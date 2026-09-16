(function (root) {
	"use strict";

	var CLIENT_SECRET_URL = "https://api.openai.com/v1/realtime/translations/client_secrets";
	var CALLS_URL = "https://api.openai.com/v1/realtime/translations/calls";
	var MODEL = "gpt-realtime-translate";

	function responseError(response, fallback) {
		return response.text().then(function (text) {
			var message = text || fallback;
			try {
				var parsed = JSON.parse(text);
				message = (parsed.error && parsed.error.message) || parsed.message || message;
			} catch (e) {}
			var error = new Error(message + " (HTTP " + response.status + ")");
			error.status = response.status;
			error.retryable = response.status === 408 || response.status === 429 || response.status >= 500;
			throw error;
		});
	}

	function nonRetryableError(message) {
		var error = new Error(message);
		error.retryable = false;
		return error;
	}

	function normalizeBrokerURL(value) {
		if (!value) {
			return "";
		}
		var parsed;
		try {
			parsed = new URL(value);
		} catch (e) {
			throw nonRetryableError("The translation broker URL is invalid.");
		}
		var loopback = ["localhost", "127.0.0.1", "[::1]"].indexOf(parsed.hostname) !== -1;
		if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && loopback)) {
			throw nonRetryableError("The translation broker must use HTTPS (HTTP is allowed only for local testing).");
		}
		return parsed.href;
	}

	function cancellationError() {
		var error = nonRetryableError("Translation session was cancelled.");
		error.name = "AbortError";
		return error;
	}

	function createClientSecret(options, targetLanguage, signal) {
		var brokerURL = normalizeBrokerURL(options.brokerURL);
		var headers = { "Content-Type": "application/json" };
		var body;
		if (brokerURL) {
			if (!options.brokerToken) {
				return Promise.reject(nonRetryableError("A translation broker access token is required."));
			}
			headers.Authorization = "Bearer " + options.brokerToken;
			body = { targetLanguage: targetLanguage };
		} else {
			headers.Authorization = "Bearer " + options.apiKey;
			body = {
				session: {
					model: MODEL,
					audio: {
						output: {
							language: targetLanguage
						}
					}
				}
			};
		}
		return fetch(brokerURL || CLIENT_SECRET_URL, {
			method: "POST",
			headers: headers,
			credentials: "omit",
			signal: signal,
			body: JSON.stringify(body)
		})
			.then(function (response) {
				if (!response.ok) {
					return responseError(response, brokerURL ? "The translation broker rejected the credential request." : "OpenAI rejected the translation credential request.");
				}
				return response.json();
			})
			.then(function (data) {
				var value = data.value || data.client_secret || data.clientSecret;
				if (value && typeof value === "object") {
					value = value.value;
				}
				if (!value) {
					throw new Error("OpenAI returned no translation client secret.");
				}
				return value;
			})
			.catch(function (error) {
				if (error && error.name === "TypeError") {
					var networkError = new Error(brokerURL ? "The browser could not reach the translation broker." : "The browser could not reach OpenAI's credential endpoint. A lightweight token broker may be required.");
					networkError.retryable = true;
					throw networkError;
				}
				throw error;
			});
	}

	function createSession(options) {
		if (!options || !options.sourceTrack || options.sourceTrack.kind !== "audio") {
			return Promise.reject(new Error("An audio source track is required for translation."));
		}
		if (!options.apiKey && !options.brokerURL) {
			return Promise.reject(nonRetryableError("An OpenAI API key or translation broker is required."));
		}
		if (options.signal && options.signal.aborted) {
			return Promise.reject(cancellationError());
		}

		var pc = new RTCPeerConnection();
		var requestController = new AbortController();
		var events = pc.createDataChannel("oai-events");
		var outputTrack = false;
		var intentionallyClosed = false;
		var outputResolve = false;
		var outputReject = false;
		var outputTimer = false;
		var cancelReject;
		var cancelled = new Promise(function (resolve, reject) {
			cancelReject = reject;
		});
		var outputPromise = new Promise(function (resolve, reject) {
			outputResolve = resolve;
			outputReject = reject;
		});
		// The output deadline may fire while setRemoteDescription is pending.
		outputPromise.catch(function () {});

		function checkOpen() {
			if (intentionallyClosed) {
				throw cancellationError();
			}
		}

		function close() {
			if (intentionallyClosed) {
				return;
			}
			intentionallyClosed = true;
			clearTimeout(outputTimer);
			if (options.signal) {
				options.signal.removeEventListener("abort", close);
			}
			requestController.abort();
			try {
				events.close();
			} catch (e) {}
			try {
				pc.close();
			} catch (e) {}
			cancelReject(cancellationError());
		}

		if (options.signal) {
			options.signal.addEventListener("abort", close, { once: true });
		}

		function reportError(error) {
			if (intentionallyClosed) {
				return;
			}
			if (options.onError) {
				options.onError(error instanceof Error ? error : new Error(error || "OpenAI translation connection failed."));
			}
		}

		pc.ontrack = function (event) {
			if (intentionallyClosed || !event.track || event.track.kind !== "audio" || outputTrack) {
				return;
			}
			outputTrack = event.track;
			outputTrack.onended = function () {
				reportError(new Error("OpenAI ended the translated audio track."));
			};
			clearTimeout(outputTimer);
			outputResolve(outputTrack);
		};

		pc.onconnectionstatechange = function () {
			if (pc.connectionState === "failed") {
				reportError(new Error("OpenAI translation connection failed."));
			}
		};

		events.onmessage = function (event) {
			try {
				var data = JSON.parse(event.data);
				if (data.type === "error") {
					reportError(new Error((data.error && data.error.message) || data.message || "OpenAI reported a translation error."));
				}
			} catch (e) {
				warnlog(e);
			}
		};

		var setup = Promise.resolve().then(function () {
			checkOpen();
			var sourceStream = new MediaStream([options.sourceTrack]);
			pc.addTrack(options.sourceTrack, sourceStream);
			return createClientSecret(options, options.targetLanguage, requestController.signal);
		})
			.then(function (clientSecret) {
				checkOpen();
				return pc.createOffer().then(function (offer) {
					checkOpen();
					return pc.setLocalDescription(offer).then(function () {
						checkOpen();
						return fetch(CALLS_URL, {
							method: "POST",
							headers: {
								Authorization: "Bearer " + clientSecret,
								"Content-Type": "application/sdp"
							},
							body: offer.sdp,
							signal: requestController.signal
						});
					});
				});
			})
			.then(function (response) {
				checkOpen();
				if (!response.ok) {
					return responseError(response, "OpenAI rejected the translation call.");
				}
				return response.text();
			})
			.then(function (answerSDP) {
				checkOpen();
				outputTimer = setTimeout(function () {
					outputReject(new Error("OpenAI did not provide translated audio in time."));
				}, 15000);
				return pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
			})
			.then(function () {
				checkOpen();
				return outputPromise;
			})
			.then(function (track) {
				checkOpen();
				return {
					pc: pc,
					events: events,
					outputTrack: track,
					close: close
				};
			});
		return Promise.race([setup, cancelled])
			.catch(function (error) {
				close();
				throw error;
			});
	}

	root.VDOTranslationProviders = root.VDOTranslationProviders || {};
	root.VDOTranslationProviders.openai = {
		name: "OpenAI",
		model: MODEL,
		createSession: createSession
	};
})(window);
