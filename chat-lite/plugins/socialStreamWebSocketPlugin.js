import { BasePlugin } from "./basePlugin.js";
import { storage } from "../utils/storage.js";
import { safeHtml, htmlToText } from "../utils/helpers.js";

const SESSION_KEY = "socialstream.websocket.sessionId";
const SERVER_KEY = "socialstream.websocket.serverUrl";
const OUT_KEY = "socialstream.websocket.out";
const IN_KEY = "socialstream.websocket.in";

const DEFAULT_SERVER_URL = "wss://io.socialstream.ninja";
const DEFAULT_OUT = 3;
const DEFAULT_IN = 4;

function toInt(value, fallback) {
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeServerUrl(value) {
	const trimmed = String(value || "").trim();
	if (!trimmed) {
		return DEFAULT_SERVER_URL;
	}
	return trimmed;
}

function collectPayloads(input) {
	if (input === null || input === undefined) {
		return [];
	}
	if (Array.isArray(input)) {
		return input.flatMap((entry) => collectPayloads(entry));
	}
	if (typeof input !== "object") {
		return [];
	}

	const nestedKeys = ["overlayNinja", "dataReceived", "contents", "detail", "msg", "message"];
	for (const key of nestedKeys) {
		if (Object.prototype.hasOwnProperty.call(input, key)) {
			const nested = collectPayloads(input[key]);
			if (nested.length) {
				return nested;
			}
		}
	}

	return [input];
}

function eventHasSignal(payload) {
	if (!payload || typeof payload !== "object") {
		return false;
	}

	const hasRenderableText = (value) => {
		if (typeof value !== "string") {
			return false;
		}
		return htmlToText(value).trim().length > 0;
	};

	if (hasRenderableText(payload.chatname) || hasRenderableText(payload.username) || hasRenderableText(payload.user) || hasRenderableText(payload.author)) {
		return true;
	}
	if (hasRenderableText(payload.chatmessage) || hasRenderableText(payload.message) || hasRenderableText(payload.text)) {
		return true;
	}
	if (payload.hasDonation || payload.membership) {
		return true;
	}
	if (payload.donationAmount || payload.bits || payload.contentimg) {
		return true;
	}
	if (typeof payload.hasDonation === "number" || typeof payload.bits === "number") {
		return true;
	}
	return false;
}

function normalizeMessageText(payload) {
	const raw = payload.chatmessage || payload.message || payload.text || "";
	const plain = htmlToText(raw || "").trim();
	if (!plain) {
		return "";
	}
	return safeHtml(plain);
}

function normalizeChatPayload(payload) {
	if (!payload || typeof payload !== "object") {
		return null;
	}

	const chatmessage = normalizeMessageText(payload);
	const chatname = String(payload.chatname || payload.username || payload.user || payload.author || "").trim();

	const normalized = {
		id: payload.id || payload.messageId || undefined,
		type: String(payload.type || payload.platform || "socialstream").toLowerCase(),
		chatname: chatname || "Social Stream",
		chatmessage,
		chatimg: payload.chatimg || payload.avatar || payload.avatar_url || "",
		timestamp: payload.timestamp || Date.now()
	};

	if (payload.chatbadges) {
		normalized.chatbadges = payload.chatbadges;
	}
	if (payload.badges) {
		normalized.badges = payload.badges;
	}
	if (payload.nameColor) {
		normalized.nameColor = payload.nameColor;
	}
	if (payload.textColor) {
		normalized.textColor = payload.textColor;
	}
	if (payload.backgroundColor) {
		normalized.backgroundColor = payload.backgroundColor;
	}
	if (payload.hasDonation) {
		normalized.hasDonation = payload.hasDonation;
	}
	if (payload.donationAmount) {
		normalized.donationAmount = payload.donationAmount;
	}
	if (payload.donationCurrency) {
		normalized.donationCurrency = payload.donationCurrency;
	}
	if (payload.membership) {
		normalized.membership = payload.membership;
	}
	if (payload.bits) {
		normalized.bits = payload.bits;
	}
	if (payload.event) {
		normalized.event = payload.event;
	}
	if (payload.contentimg) {
		normalized.contentimg = payload.contentimg;
	}
	if (payload.subtitle) {
		normalized.subtitle = payload.subtitle;
	}
	if (payload.sourceName) {
		normalized.sourceName = payload.sourceName;
	}
	if (payload.sourceImg) {
		normalized.sourceImg = payload.sourceImg;
	}
	if (payload.title) {
		normalized.title = payload.title;
	}

	if (!normalized.chatmessage && !eventHasSignal(payload)) {
		return null;
	}
	return normalized;
}

export class SocialStreamWebSocketPlugin extends BasePlugin {
	constructor(options) {
		super({
			...options,
			id: "socialstreamws",
			name: "SSN WebSocket",
			description: "Join an existing Social Stream Ninja session ID over WebSocket to relay non-native sources."
		});

		this.socket = null;
		this.manualClose = false;
		this.statusLabel = null;
		this.sessionInput = null;
		this.serverInput = null;
		this.outInput = null;
		this.inInput = null;
	}

	renderPrimary(container) {
		const statusLabel = document.createElement("div");
		statusLabel.className = "source-card__subtext";
		statusLabel.hidden = true;
		container.append(statusLabel);
		this.statusLabel = statusLabel;
		this.refreshStatus();
		return container;
	}

	renderSettings(container) {
		const sessionRow = document.createElement("label");
		sessionRow.className = "field";
		const sessionLabel = document.createElement("span");
		sessionLabel.className = "field__label";
		sessionLabel.textContent = "Session ID";
		const sessionInput = document.createElement("input");
		sessionInput.type = "text";
		sessionInput.placeholder = "Social Stream session ID";
		sessionInput.autocomplete = "off";
		sessionInput.value = storage.get(SESSION_KEY, "");
		sessionInput.addEventListener("change", () => {
			storage.set(SESSION_KEY, (sessionInput.value || "").trim());
			this.refreshStatus();
		});
		sessionRow.append(sessionLabel, sessionInput);

		const serverRow = document.createElement("label");
		serverRow.className = "field";
		const serverLabel = document.createElement("span");
		serverLabel.className = "field__label";
		serverLabel.textContent = "WebSocket server URL";
		const serverInput = document.createElement("input");
		serverInput.type = "url";
		serverInput.placeholder = DEFAULT_SERVER_URL;
		serverInput.autocomplete = "off";
		serverInput.value = storage.get(SERVER_KEY, DEFAULT_SERVER_URL);
		serverInput.addEventListener("change", () => {
			storage.set(SERVER_KEY, normalizeServerUrl(serverInput.value));
		});
		serverRow.append(serverLabel, serverInput);

		const modeRow = document.createElement("div");
		modeRow.className = "field field--checkbox-group";

		const outRow = document.createElement("label");
		outRow.className = "field";
		const outLabel = document.createElement("span");
		outLabel.className = "field__label";
		outLabel.textContent = "Out mode";
		const outInput = document.createElement("input");
		outInput.type = "number";
		outInput.min = "0";
		outInput.step = "1";
		outInput.value = String(toInt(storage.get(OUT_KEY, DEFAULT_OUT), DEFAULT_OUT));
		outInput.addEventListener("change", () => {
			storage.set(OUT_KEY, toInt(outInput.value, DEFAULT_OUT));
		});
		outRow.append(outLabel, outInput);

		const inRow = document.createElement("label");
		inRow.className = "field";
		const inLabel = document.createElement("span");
		inLabel.className = "field__label";
		inLabel.textContent = "In mode";
		const inInput = document.createElement("input");
		inInput.type = "number";
		inInput.min = "0";
		inInput.step = "1";
		inInput.value = String(toInt(storage.get(IN_KEY, DEFAULT_IN), DEFAULT_IN));
		inInput.addEventListener("change", () => {
			storage.set(IN_KEY, toInt(inInput.value, DEFAULT_IN));
		});
		inRow.append(inLabel, inInput);

		modeRow.append(outRow, inRow);
		container.append(sessionRow, serverRow, modeRow);

		this.sessionInput = sessionInput;
		this.serverInput = serverInput;
		this.outInput = outInput;
		this.inInput = inInput;
		return container;
	}

	refreshStatus() {
		if (!this.statusLabel) {
			return;
		}
		const sessionId = this.getConfiguredSessionId();
		if (!sessionId) {
			this.statusLabel.hidden = true;
			this.statusLabel.textContent = "";
			return;
		}
		this.statusLabel.hidden = false;
		this.statusLabel.innerHTML = `Session: <strong>${safeHtml(sessionId)}</strong>`;
	}

	getConfiguredSessionId() {
		if (this.sessionInput) {
			return (this.sessionInput.value || "").trim();
		}
		return (storage.get(SESSION_KEY, "") || "").trim();
	}

	getServerUrl() {
		const uiValue = this.serverInput ? this.serverInput.value : storage.get(SERVER_KEY, DEFAULT_SERVER_URL);
		return normalizeServerUrl(uiValue);
	}

	getOutMode() {
		const uiValue = this.outInput ? this.outInput.value : storage.get(OUT_KEY, DEFAULT_OUT);
		return toInt(uiValue, DEFAULT_OUT);
	}

	getInMode() {
		const uiValue = this.inInput ? this.inInput.value : storage.get(IN_KEY, DEFAULT_IN);
		return toInt(uiValue, DEFAULT_IN);
	}

	shouldAutoConnect(sessionId) {
		return super.shouldAutoConnect(sessionId) && Boolean(this.getConfiguredSessionId());
	}

	enable() {
		if (!this.messenger.getSessionId()) {
			throw new Error("Start a session before connecting Social Stream WebSocket.");
		}

		const sessionId = this.getConfiguredSessionId();
		if (!sessionId) {
			throw new Error("Enter a Social Stream session ID first.");
		}

		storage.set(SESSION_KEY, sessionId);
		storage.set(SERVER_KEY, this.getServerUrl());
		storage.set(OUT_KEY, this.getOutMode());
		storage.set(IN_KEY, this.getInMode());

		this.connectSocket(sessionId);
	}

	disable() {
		this.manualClose = true;
		if (this.socket) {
			try {
				this.socket.close();
			} catch (err) {
				console.warn("Failed to close SSN WebSocket", err);
			}
		}
		this.socket = null;
	}

	connectSocket(sessionId) {
		const serverUrl = this.getServerUrl();
		const outMode = this.getOutMode();
		const inMode = this.getInMode();

		this.manualClose = false;
		this.socket = new WebSocket(serverUrl);

		this.socket.addEventListener("open", () => {
			if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
				return;
			}
			const joinMessage = {
				join: sessionId,
				out: outMode,
				in: inMode
			};
			this.socket.send(JSON.stringify(joinMessage));
			this.setState("connected");
			this.log("Connected to Social Stream WebSocket.", { serverUrl, sessionId, outMode, inMode });
		});

		this.socket.addEventListener("message", (event) => {
			this.handleSocketMessage(event?.data);
		});

		this.socket.addEventListener("error", (event) => {
			const message = event?.message || "WebSocket error";
			this.reportError(new Error(message));
		});

		this.socket.addEventListener("close", (event) => {
			const detail = {
				code: event?.code,
				reason: event?.reason || "",
				wasClean: event?.wasClean
			};
			this.socket = null;
			if (this.manualClose) {
				this.setState("idle");
				this.log("Social Stream WebSocket disconnected.", detail);
				return;
			}
			this.reportError(new Error(`WebSocket closed (${detail.code || "unknown"})`));
		});
	}

	handleSocketMessage(rawMessage) {
		if (!rawMessage) {
			return;
		}
		let parsed = null;
		try {
			parsed = typeof rawMessage === "string" ? JSON.parse(rawMessage) : rawMessage;
		} catch (err) {
			this.debugLog("Skipping non-JSON message from Social Stream WebSocket.");
			return;
		}

		const payloads = collectPayloads(parsed);
		if (!payloads.length) {
			return;
		}

		let relayedCount = 0;
		payloads.forEach((entry) => {
			if (!eventHasSignal(entry)) {
				return;
			}
			const normalized = normalizeChatPayload(entry);
			if (!normalized) {
				return;
			}
			this.publish(normalized, { silent: true });
			relayedCount += 1;
		});

		if (relayedCount) {
			this.log("Relayed WebSocket message(s).", { count: relayedCount }, { kind: "debug" });
		}
	}
}
