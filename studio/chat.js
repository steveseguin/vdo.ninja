const DEFAULT_SERVER = "wss://io.socialstream.ninja/extension";
let BRIDGE_ORIGIN = "https://vdo.socialstream.ninja";
if (!("credentialless" in document.createElement("iframe"))) {
	BRIDGE_ORIGIN = "https://isolated.vdo.ninja";
}
const chat = {
	frame: null,
	socket: null,
	retry: null,
	attempt: 0,
	config: null,
	messages: [],
	seen: new Map(),
	peers: new Set(),
	paused: false,
	featured: null,
	onFeature: null
};

function element(id) {
	return document.getElementById("chat-" + id);
}

function status(text) {
	element("status").textContent = text;
}

function readConnection() {
	let session = element("session").value.trim();
	let password = element("password").value || "false";
	let mode = element("transport").value;
	let server = element("server").value.trim() || DEFAULT_SERVER;
	if (/^https?:\/\//i.test(session)) {
		const url = new URL(session);
		const options = url.searchParams;
		session = options.get("session") || "";
		password = options.get("password") || "false";
		mode = options.has("server2") ? "websocket" : "webrtc";
		if (mode === "websocket" && options.has("localserver") && !options.get("server2")) {
			throw new Error("For a local SSN server, enter its session ID and WebSocket address in Connection options.");
		}
		server = options.get("server2") || DEFAULT_SERVER;
	}
	if (!/^[a-zA-Z0-9_.-]{1,128}$/.test(session)) {
		throw new Error("Enter one SSN session ID or a dock link containing session=.");
	}
	if (mode === "websocket") {
		const url = new URL(server);
		if (!["wss:", "ws:"].includes(url.protocol) || url.username || url.password) {
			throw new Error("Use a ws:// or wss:// WebSocket address without embedded credentials.");
		}
		if (location.protocol === "https:" && url.protocol === "ws:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
			throw new Error("Use wss:// for a remote server from this HTTPS page.");
		}
		server = url.href;
	}
	return { session, password, mode, server };
}

function disconnect() {
	chat.config = null;
	clearTimeout(chat.retry);
	chat.retry = null;
	chat.peers.clear();
	if (chat.socket) {
		chat.socket.onclose = null;
		chat.socket.onmessage = null;
		chat.socket.close();
		chat.socket = null;
	}
	if (chat.frame) {
		chat.frame.remove();
		chat.frame = null;
	}
	element("disconnect").disabled = true;
	status("Disconnected — existing messages remain in this panel");
}

function connect(event) {
	event.preventDefault();
	let config;
	try {
		config = readConnection();
	} catch (error) {
		status(error.message || "Check your SSN connection settings.");
		return;
	}
	disconnect();
	clearMessages();
	chat.seen.clear();
	chat.config = config;
	chat.attempt = 0;
	element("session").value = config.session;
	element("password").value = config.password === "false" ? "" : config.password;
	element("transport").value = config.mode;
	element("server").value = config.server;
	element("disconnect").disabled = false;
	if (config.mode === "websocket") {
		connectSocket(config);
		return;
	}
	status("Connecting to SSN… Keep Lite or your SSN capture running.");
	const url = new URL(BRIDGE_ORIGIN + "/");
	const options = { ln: "", salt: "vdo.ninja", password: config.password, push: "", label: "dock", vd: "0", ad: "0", novideo: "", noaudio: "", autostart: "", cleanoutput: "", room: config.session };
	// Keep the isolated bridge on SSN's signaling service.
	if (BRIDGE_ORIGIN === "https://isolated.vdo.ninja") options.wss2 = "wss://wss.socialstream.ninja:443";
	Object.keys(options).forEach(key => url.searchParams.set(key, options[key]));
	const frame = document.createElement("iframe");
	frame.className = "chat-bridge";
	frame.title = "Social Stream chat connection";
	frame.setAttribute("aria-hidden", "true");
	frame.tabIndex = -1;
	// Keep the SSN bridge compatible with the host's embed policy.
	if ("credentialless" in frame) frame.setAttribute("credentialless", "true");
	frame.src = url.href;
	chat.frame = frame;
	frame.onload = function () {
		if (chat.frame === frame && !chat.peers.size) status("Bridge loaded — waiting for SSN. Send a test message in Lite or SSN to check delivery.");
	};
	document.body.appendChild(frame);
}

function connectSocket(config) {
	if (chat.config !== config) return;
	status(chat.attempt ? "Reconnecting to SSN server…" : "Connecting to SSN server…");
	let socket;
	try {
		socket = new WebSocket(config.server);
	} catch (error) {
		status("Unable to open this server. Check the WebSocket address.");
		return;
	}
	chat.socket = socket;
	socket.onopen = function () {
		if (chat.socket !== socket) return;
		chat.attempt = 0;
		socket.send(JSON.stringify({ join: config.session, out: 3, in: 4 }));
		status("Server connected — waiting for chat. Enable chat forwarding in SSN.");
	};
	socket.onmessage = function (event) {
		if (chat.socket !== socket || typeof event.data !== "string" || event.data.length > 1000000) return;
		try { receive(JSON.parse(event.data)); } catch (error) { /* Ignore non-chat packets. */ }
	};
	socket.onerror = function () { socket.close(); };
	socket.onclose = function () {
		if (chat.socket !== socket || chat.config !== config) return;
		chat.socket = null;
		status("Server disconnected — retrying…");
		// Only this active connection owns the retry; Disconnect cancels it.
		chat.retry = setTimeout(function () { connectSocket(config); }, Math.min(30000, 1000 * Math.pow(2, chat.attempt++)));
	};
}

function bridgeMessage(event) {
	if (!chat.frame || event.source !== chat.frame.contentWindow || event.origin !== BRIDGE_ORIGIN) return;
	const data = event.data;
	if (!data || typeof data !== "object") return;
	if (data.dataReceived && Object.prototype.hasOwnProperty.call(data.dataReceived, "overlayNinja")) {
		receive(data.dataReceived.overlayNinja);
	} else if (["push-connection", "view-connection"].includes(data.action) && data.UUID) {
		if (data.value) chat.peers.add(data.UUID);
		else chat.peers.delete(data.UUID);
		status(chat.peers.size ? "SSN peer connected — waiting for chat" : "Waiting for SSN to reconnect…");
	} else if (data.action === "hss-connection" && data.value === "closed" && !chat.peers.size) {
		status("Signaling disconnected — bridge is reconnecting…");
	}
}

function plainMessage(data) {
	const body = typeof data.chatmessage === "string" ? data.chatmessage.slice(0, 20000) : "";
	if (data.textonly === true) return body;
	// Parse rich SSN messages in an inert template; render only text and emote labels.
	const template = document.createElement("template");
	template.innerHTML = body;
	template.content.querySelectorAll("script, style, iframe, object").forEach(node => node.remove());
	template.content.querySelectorAll("img").forEach(node => node.replaceWith(document.createTextNode(node.getAttribute("alt") || "")));
	template.content.querySelectorAll("br").forEach(node => node.replaceWith(document.createTextNode("\n")));
	return template.content.textContent || "";
}

function safeImage(value) {
	if (typeof value !== "string") return "";
	try {
		const url = new URL(value);
		if (url.protocol === "https:" || url.protocol === "http:") return url.href;
	} catch (error) { }
	return "";
}

function matchesDelete(message, deletion) {
	const data = message.data;
	if (deletion.type && deletion.type !== data.type) return false;
	const meta = deletion.meta || {};
	const original = data.meta || {};
	if (meta.streamUsername) {
		if (deletion.type === "vpzone") {
			if (String(meta.streamUsername).toLowerCase() !== String(original.streamUsername).toLowerCase()) return false;
		} else if (meta.streamUsername !== original.streamUsername) {
			return false;
		}
	}
	if (meta.messageId != null) return original.messageId != null && String(meta.messageId) === String(original.messageId);
	if (deletion.id != null) return data.id != null && String(deletion.id) === String(data.id);
	if (deletion.userid != null) return data.userid != null && String(deletion.userid) === String(data.userid);
	if (deletion.type === "twitch" && meta.pluralmind && deletion.username) return deletion.username === data.username;
	if (deletion.chatname) {
		const sourceName = original.sourceDisplayName || (data.type === "twitch" && original.twitchDisplayName) || data.chatname;
		const deleteName = meta.sourceDisplayName || (deletion.type === "twitch" && meta.twitchDisplayName) || deletion.chatname;
		return deletion.chatname === data.chatname || deleteName === data.chatname || deleteName === sourceName;
	}
	return Boolean(deletion.type);
}

function receive(data, depth = 0) {
	if (!data || typeof data !== "object" || depth > 4) return;
	if (Array.isArray(data)) {
		data.forEach(item => receive(item, depth + 1));
		return;
	}
	if (data.overlayNinja) return receive(data.overlayNinja, depth + 1);
	if (data.contents) return receive(data.contents, depth + 1);
	const identity = data.delete && typeof data.delete === "object" ? data.delete : data;
	const identityMeta = identity.meta || {};
	const ids = [identity.id, identity.userid, identityMeta.messageId, identityMeta.streamUsername];
	// Malformed identity objects must not interrupt the rest of a chat batch.
	for (const id of ids) {
		if (id !== null && typeof id === "object") return;
	}
	if (data.delete && typeof data.delete === "object") {
		const onlyLast = data.delete.onlyLast && data.delete.id == null && !(data.delete.meta && data.delete.meta.messageId != null);
		let newest = null;
		if (onlyLast) {
			for (let i = chat.messages.length - 1; i >= 0; i--) {
				if (matchesDelete(chat.messages[i], data.delete)) {
					newest = chat.messages[i];
					break;
				}
			}
			if (!newest && chat.featured && matchesDelete(chat.featured, data.delete)) newest = chat.featured;
		}
		if (chat.featured && (!onlyLast || chat.featured === newest) && matchesDelete(chat.featured, data.delete)) feature(null);
		chat.messages = chat.messages.filter(message => {
			if (onlyLast && message !== newest) return true;
			if (!matchesDelete(message, data.delete)) return true;
			message.row.remove();
			return false;
		});
		updateEmpty();
		return;
	}
	if (data.clearAll === true || data.action === "clearAll" || data.action === "clearDock" || data.action === "clear") {
		clearMessages();
		return;
	}
	if (data.action || data.callback || data.get || data.mid !== undefined) return;
	const text = plainMessage(data);
	const image = safeImage(data.contentimg);
	const donation = typeof data.hasDonation === "string" ? data.hasDonation : "";
	const membership = typeof data.membership === "string" ? data.membership : "";
	if (!text && !image && !donation && !membership) return;
	const platform = typeof data.type === "string" ? data.type.slice(0, 80) : "chat";
	const name = typeof data.chatname === "string" ? data.chatname.slice(0, 160) : "Viewer";
	const meta = data.meta || {};
	const id = data.id != null ? data.id : meta.messageId;
	// Never collapse distinct ID-less messages just because their text matches.
	if (id != null) {
		const key = JSON.stringify([platform, meta.streamUsername || data.tid || "", String(id)]);
		if (chat.seen.has(key)) return;
		chat.seen.set(key, true);
		if (chat.seen.size > 1000) chat.seen.delete(chat.seen.keys().next().value);
	}
	const row = document.createElement("article");
	row.className = "chat-message";
	const heading = document.createElement("div");
	heading.className = "chat-message__heading";
	const author = document.createElement("strong");
	author.textContent = name;
	const source = document.createElement("span");
	source.textContent = platform;
	heading.append(author, source);
	const body = document.createElement("p");
	body.textContent = text;
	row.append(heading, body);
	if (donation || membership) {
		const detail = document.createElement("p");
		detail.className = "chat-message__support";
		detail.textContent = [donation, membership].filter(Boolean).join(" · ");
		row.append(detail);
	}
	if (image) {
		const attachment = document.createElement("img");
		attachment.src = image;
		attachment.alt = "Chat attachment";
		attachment.loading = "lazy";
		attachment.referrerPolicy = "no-referrer";
		attachment.onerror = function () { attachment.remove(); };
		row.append(attachment);
	}
	const message = { data, row, platform, name, text: [text, donation, membership].filter(Boolean).join(" · ") };
	if (message.text) {
		const show = document.createElement("button");
		show.type = "button";
		show.className = "button button--secondary button--compact";
		show.textContent = "Show on stream";
		show.onclick = function () { feature(message); };
		row.append(show);
	}
	chat.messages.push(message);
	if (chat.messages.length > 200) chat.messages.shift().row.remove();
	const filter = element("filter");
	if (!Array.from(filter.options).some(option => option.value === platform)) {
		const option = document.createElement("option");
		option.value = platform;
		option.textContent = platform;
		filter.append(option);
	}
	row.hidden = Boolean(filter.value && filter.value !== platform);
	element("messages").append(row);
	updateEmpty();
	if (!chat.paused) element("messages").scrollTop = element("messages").scrollHeight;
	status("Receiving chat");
}

function updateEmpty() {
	const list = element("messages");
	const old = list.querySelector(".chat-empty");
	if (old) old.remove();
	if (!chat.messages.some(message => !message.row.hidden)) {
		const empty = document.createElement("p");
		empty.className = "chat-empty";
		empty.textContent = chat.messages.length ? "No messages from this platform." : "Waiting for messages. Keep your SSN source running.";
		list.append(empty);
	}
}

function feature(message) {
	if (chat.featured) chat.featured.row.classList.remove("chat-message--featured");
	chat.featured = message;
	if (message) message.row.classList.add("chat-message--featured");
	element("hide").disabled = !message;
	element("featured-label").textContent = message ? "On stream: " + message.name : "No chat on stream";
	chat.onFeature(message ? overlayText(message.name, 80) + " · " + overlayText(message.platform, 40) + "\n" + overlayText(message.text, 360) : "");
}

function overlayText(text, limit) {
	text = text.replace(/\s+/g, " ").trim();
	if (text.length > limit) text = text.slice(0, limit - 1) + "…";
	// Allow long URLs and unbroken words to wrap inside the on-stream card.
	return text.replace(/\S{32}(?=\S)/g, "$&\u200b");
}

function clearMessages() {
	feature(null);
	chat.messages = [];
	element("messages").textContent = "";
	element("filter").innerHTML = '<option value="">All platforms</option>';
	updateEmpty();
}

export function initChat(onFeature) {
	chat.onFeature = onFeature;
	element("connect-form").addEventListener("submit", connect);
	element("disconnect").addEventListener("click", disconnect);
	element("clear").addEventListener("click", clearMessages);
	element("hide").addEventListener("click", function () { feature(null); });
	element("pause").addEventListener("click", function () {
		chat.paused = !chat.paused;
		element("pause").setAttribute("aria-pressed", String(chat.paused));
		element("pause").textContent = chat.paused ? "Resume scrolling" : "Pause scrolling";
		if (!chat.paused) element("messages").scrollTop = element("messages").scrollHeight;
	});
	element("filter").addEventListener("change", function () {
		const platform = element("filter").value;
		chat.messages.forEach(message => { message.row.hidden = Boolean(platform && platform !== message.platform); });
		updateEmpty();
	});
	window.addEventListener("message", bridgeMessage);
	window.addEventListener("pagehide", disconnect);
}
