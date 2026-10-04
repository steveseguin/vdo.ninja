const OPENAI_CLIENT_SECRET_URL = "https://api.openai.com/v1/realtime/translations/client_secrets";
const MODEL = "gpt-realtime-translate";
const MAX_BODY_BYTES = 1024;
const UPSTREAM_TIMEOUT_MS = 10000;
const SUPPORTED_LANGUAGES = new Set(["en", "es", "pt", "fr", "ja", "ru", "zh", "de", "ko", "hi", "id", "vi", "it"]);

function allowedOrigins(env) {
	return (env.ALLOWED_ORIGINS || "")
		.split(",")
		.map(function (origin) {
			return origin.trim();
		})
		.filter(Boolean);
}

function isAllowedOrigin(origin, env) {
	return !!origin && allowedOrigins(env).indexOf(origin) !== -1;
}

function responseHeaders(origin) {
	var headers = {
		"Cache-Control": "no-store",
		"Content-Type": "application/json; charset=utf-8",
		Vary: "Origin"
	};
	if (origin) {
		headers["Access-Control-Allow-Origin"] = origin;
		headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type";
		headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
		headers["Access-Control-Max-Age"] = "600";
	}
	return headers;
}

function jsonResponse(status, message, origin, extra) {
	var body = { error: message };
	if (extra) {
		for (var key in extra) {
			body[key] = extra[key];
		}
	}
	return new Response(JSON.stringify(body), {
		status: status,
		headers: responseHeaders(origin)
	});
}

async function secretMatches(provided, expected) {
	if (!provided || !expected) {
		return false;
	}
	var encoder = new TextEncoder();
	var digests = await Promise.all([
		crypto.subtle.digest("SHA-256", encoder.encode(provided)),
		crypto.subtle.digest("SHA-256", encoder.encode(expected))
	]);
	var first = new Uint8Array(digests[0]);
	var second = new Uint8Array(digests[1]);
	if (typeof crypto.subtle.timingSafeEqual === "function") {
		return crypto.subtle.timingSafeEqual(first, second);
	}
	var difference = 0;
	for (var index = 0; index < first.length; index++) {
		difference |= first[index] ^ second[index];
	}
	return difference === 0;
}

function bearerToken(request) {
	var authorization = request.headers.get("Authorization") || "";
	return authorization.indexOf("Bearer ") === 0 ? authorization.slice(7) : "";
}

async function readBodyWithLimit(request, limit) {
	if (!request.body) {
		return "";
	}
	var reader = request.body.getReader();
	var chunks = [];
	var total = 0;
	try {
		while (true) {
			var result = await reader.read();
			if (result.done) {
				break;
			}
			total += result.value.byteLength;
			if (total > limit) {
				await reader.cancel();
				var tooLarge = new Error("Request body is too large.");
				tooLarge.status = 413;
				throw tooLarge;
			}
			chunks.push(result.value);
		}
	} finally {
		reader.releaseLock();
	}
	var combined = new Uint8Array(total);
	var offset = 0;
	for (var index = 0; index < chunks.length; index++) {
		combined.set(chunks[index], offset);
		offset += chunks[index].byteLength;
	}
	return new TextDecoder().decode(combined);
}

async function handleRequest(request, env) {
	var url = new URL(request.url);
	var origin = request.headers.get("Origin") || "";
	var originAllowed = isAllowedOrigin(origin, env);

	if (url.pathname !== "/session") {
		return jsonResponse(404, "Not found.", originAllowed ? origin : "");
	}
	if (!originAllowed) {
		return jsonResponse(403, "Origin not allowed.", "");
	}
	if (request.method === "OPTIONS") {
		return new Response(null, { status: 204, headers: responseHeaders(origin) });
	}
	if (request.method !== "POST") {
		return jsonResponse(405, "Use POST.", origin);
	}
	if (!env.OPENAI_API_KEY || !env.BROKER_ACCESS_TOKEN) {
		console.error("translation_broker_configuration_missing", {
			hasOpenAIKey: !!env.OPENAI_API_KEY,
			hasAccessToken: !!env.BROKER_ACCESS_TOKEN
		});
		return jsonResponse(500, "Broker is not configured.", origin);
	}
	if (!(await secretMatches(bearerToken(request), env.BROKER_ACCESS_TOKEN))) {
		return jsonResponse(401, "Invalid broker access token.", origin);
	}
	var contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
	if (contentType !== "application/json") {
		return jsonResponse(415, "Content-Type must be application/json.", origin);
	}

	var contentLength = Number(request.headers.get("Content-Length") || 0);
	if (contentLength > MAX_BODY_BYTES) {
		return jsonResponse(413, "Request body is too large.", origin);
	}
	var rawBody;
	try {
		rawBody = await readBodyWithLimit(request, MAX_BODY_BYTES);
	} catch (error) {
		return jsonResponse(error && error.status === 413 ? 413 : 400, error && error.status === 413 ? "Request body is too large." : "Could not read request body.", origin);
	}
	var input;
	try {
		input = JSON.parse(rawBody);
	} catch (error) {
		return jsonResponse(400, "Request body must be JSON.", origin);
	}
	if (!input || typeof input !== "object" || Array.isArray(input)) {
		return jsonResponse(400, "Request body must be a JSON object.", origin);
	}
	var targetLanguage = (input.targetLanguage || "").toString().trim().toLowerCase();
	if (!SUPPORTED_LANGUAGES.has(targetLanguage)) {
		return jsonResponse(400, "Unsupported target language.", origin);
	}

	var abortController = new AbortController();
	var timeout = setTimeout(function () {
		abortController.abort();
	}, UPSTREAM_TIMEOUT_MS);
	try {
		var upstream = await fetch(OPENAI_CLIENT_SECRET_URL, {
			method: "POST",
			headers: {
				Authorization: "Bearer " + env.OPENAI_API_KEY,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				expires_after: { anchor: "created_at", seconds: 60 },
				session: {
					model: MODEL,
					audio: { output: { language: targetLanguage } }
				}
			}),
			signal: abortController.signal
		});
		var data;
		try {
			data = await upstream.json();
		} catch (error) {
			data = null;
		}
		if (!upstream.ok || !data || !data.value) {
			console.error("translation_broker_openai_rejected", { status: upstream.status });
			return jsonResponse(502, "OpenAI did not issue a translation client secret.", origin);
		}
		return new Response(
			JSON.stringify({
				value: data.value,
				expires_at: data.expires_at || null
			}),
			{ status: 200, headers: responseHeaders(origin) }
		);
	} catch (error) {
		console.error("translation_broker_upstream_error", { name: (error && error.name) || "Error" });
		return jsonResponse(error && error.name === "AbortError" ? 504 : 502, "Could not reach OpenAI.", origin);
	} finally {
		clearTimeout(timeout);
	}
}

export default {
	fetch: handleRequest
};
