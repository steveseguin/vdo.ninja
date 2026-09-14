(function () {
	"use strict";

	var CALLIN_SCRIPT_ID = "vdo-callin-panel-style";
	var JSSIP_URL = "./thirdparty/jssip-3.10.1.min.js";
	var TWILIO_URL = "./thirdparty/twilio-voice-sdk-2.18.3.min.js";
	var DEFAULT_TWILIO_API = "https://vdo-callin-alpha.vdo.workers.dev";
	var SIP_PROFILE_STORAGE_KEY = "vdo.callin.sipProfile.v1";
	var CALLIN_PANEL_POSITION_KEY = "vdo.callin.panelPosition.v1";
	var CALLIN_RINGTONE_STORAGE_KEY = "vdo.callin.ringtone.v1";
	var CALLIN_UPLOAD_ORIGIN = "https://fileuploads.vdo.ninja";
	var CALLIN_RINGTONE_SOURCES = {
		classic: "./media/tone.ogg",
		bell: "./media/bell.wav",
		chime: "./media/chime.wav"
	};

	function getParams() {
		try {
			if (window.urlParams) {
				return window.urlParams;
			}
		} catch (e) {}
		return new URLSearchParams(window.location.search);
	}

	function getParam(names, fallback) {
		var params = getParams();
		if (!Array.isArray(names)) {
			names = [names];
		}
		for (var i = 0; i < names.length; i++) {
			if (params.has(names[i])) {
				return params.get(names[i]);
			}
		}
		return fallback || "";
	}

	function hasParam(names) {
		var params = getParams();
		if (!Array.isArray(names)) {
			names = [names];
		}
		for (var i = 0; i < names.length; i++) {
			if (params.has(names[i])) {
				return true;
			}
		}
		return false;
	}

	function paramEnabled(names) {
		var params = getParams();
		if (!Array.isArray(names)) {
			names = [names];
		}
		for (var i = 0; i < names.length; i++) {
			if (params.has(names[i])) {
				var value = params.get(names[i]);
				if (value === null || value === "") {
					return true;
				}
				value = String(value).toLowerCase();
				return !(value === "0" || value === "false" || value === "off" || value === "no");
			}
		}
		return false;
	}

	function stripSensitiveParams(names) {
		try {
			var url = new URL(window.location.href);
			var changed = false;
			for (var i = 0; i < names.length; i++) {
				if (url.searchParams.has(names[i])) {
					url.searchParams.delete(names[i]);
					changed = true;
				}
			}
			if (changed && window.history && window.history.replaceState) {
				window.history.replaceState(window.history.state, document.title, url.href);
			}
			return changed;
		} catch (e) {}
		return false;
	}

	function callinLog(message) {
		try {
			if (window.log) {
				log("[callin] " + message);
			} else {
				console.log("[callin] " + message);
			}
		} catch (e) {}
	}

	function callinError(error) {
		try {
			if (window.errorlog) {
				errorlog(error);
			} else {
				console.error(error);
			}
		} catch (e) {}
	}

	function loadCallInDependency(url, onload, onerror) {
		try {
			var result = loadScript(url, onload);
			if (result && typeof result.catch === "function") {
				result.catch(onerror);
			}
		} catch (error) {
			onerror(error);
		}
	}

	function readStoredObject(key) {
		try {
			if (!window.localStorage) {
				return null;
			}
			var raw = localStorage.getItem(key);
			if (!raw) {
				return null;
			}
			return JSON.parse(raw);
		} catch (e) {}
		return null;
	}

	function writeStoredObject(key, value) {
		try {
			if (!window.localStorage) {
				return false;
			}
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch (e) {}
		return false;
	}

	function removeStoredObject(key) {
		try {
			if (window.localStorage) {
				localStorage.removeItem(key);
				return true;
			}
		} catch (e) {}
		return false;
	}

	function readSipProfile() {
		var profile = readStoredObject(SIP_PROFILE_STORAGE_KEY);
		if (!profile || typeof profile !== "object") {
			return {};
		}
		return profile;
	}

	function readRingtoneSettings() {
		var stored = readStoredObject(CALLIN_RINGTONE_STORAGE_KEY);
		var mode = stored && stored.mode === "silent" ? "silent" : "ring";
		var tone = stored && CALLIN_RINGTONE_SOURCES[stored.tone] ? stored.tone : "classic";
		var volume = stored && typeof stored.volume === "number" ? stored.volume : 60;
		var customUrl = normalizeRingtoneUrl(stored && stored.customUrl);
		var customName = customUrl && stored && stored.customName ? String(stored.customName).slice(0, 100) : "";
		if (stored && stored.tone === "custom" && customUrl) {
			tone = "custom";
		}
		volume = Math.max(0, Math.min(100, volume));
		return { mode: mode, tone: tone, volume: volume, customUrl: customUrl, customName: customName };
	}

	function normalizeRingtoneUrl(value) {
		if (!value) {
			return "";
		}
		try {
			var parsed = new URL(String(value));
			if (parsed.protocol !== "https:") {
				return "";
			}
			parsed.username = "";
			parsed.password = "";
			return parsed.href;
		} catch (e) {}
		return "";
	}

	function getParamOrProfile(names, profile, key, fallback) {
		if (hasParam(names)) {
			return getParam(names, fallback);
		}
		if (profile && Object.prototype.hasOwnProperty.call(profile, key)) {
			return profile[key] || "";
		}
		return fallback || "";
	}

	function profileFlag(profile, key, fallback) {
		if (!profile || !Object.prototype.hasOwnProperty.call(profile, key)) {
			return !!fallback;
		}
		return !!profile[key];
	}

	function boolFromParamOrProfile(names, profile, key, fallback) {
		if (hasParam(names)) {
			var value = String(getParam(names, fallback ? "1" : "0")).toLowerCase();
			return !(value === "0" || value === "false" || value === "off" || value === "no");
		}
		return profileFlag(profile, key, fallback);
	}

	function getSignalWireSpaceValue(profile) {
		var value = getParamOrProfile(["signalwirespace", "swspace", "callinspace"], profile, "signalwireSpace", "");
		value = String(value || "").trim();
		value = value.replace(/^https?:\/\//i, "");
		value = value.replace(/^wss?:\/\//i, "");
		value = value.replace(/\/.*$/, "");
		value = value.replace(/\.signalwire\.com$/i, "");
		value = value.replace(/\.sip$/i, "");
		return value;
	}

	function signalWireWssFromSpace(space) {
		space = String(space || "").trim();
		if (!space) {
			return "";
		}
		if (/^wss:\/\//i.test(space)) {
			return space;
		}
		space = space.replace(/^https?:\/\//i, "");
		space = space.replace(/^wss?:\/\//i, "");
		space = space.replace(/\/.*$/, "");
		if (/\.sip\.signalwire\.com$/i.test(space)) {
			return "wss://" + space;
		}
		if (/\.signalwire\.com$/i.test(space)) {
			space = space.replace(/\.signalwire\.com$/i, "");
		}
		return "wss://" + space + ".sip.signalwire.com";
	}

	function getSipDomainFromUri(uri) {
		uri = String(uri || "").trim();
		uri = uri.replace(/^sips?:/i, "");
		var at = uri.indexOf("@");
		if (at === -1) {
			return "";
		}
		uri = uri.slice(at + 1);
		uri = uri.replace(/[>;].*$/, "");
		return uri.trim();
	}

	function getSipDomainFromWss(wss) {
		wss = String(wss || "").trim();
		wss = wss.replace(/^wss?:\/\//i, "");
		wss = wss.replace(/\/.*$/, "");
		return wss;
	}

	function setCallInOutputDevice(target, requested) {
		if (!target || !target.setSinkId || !requested) {
			return;
		}
		target.setSinkId(requested).catch(function (firstError) {
			if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
				callinError(firstError);
				return;
			}
			navigator.mediaDevices
				.enumerateDevices()
				.then(function (devices) {
					var requestedLower = String(requested).toLowerCase();
					var partialMatch = null;
					for (var i = 0; i < devices.length; i++) {
						if (devices[i].kind !== "audiooutput" || !devices[i].label) {
							continue;
						}
						var label = devices[i].label.toLowerCase();
						if (label === requestedLower) {
							return devices[i];
						}
						if (!partialMatch && label.indexOf(requestedLower) !== -1) {
							partialMatch = devices[i];
						}
					}
					return partialMatch;
				})
				.then(function (device) {
					if (!device) {
						callinError(firstError);
						return;
					}
					return target.setSinkId(device.deviceId).catch(function (e) {
						callinError(e);
					});
				})
				.catch(function (e) {
					callinError(e);
				});
		});
	}

	function clampPanelPosition(left, top, width, height) {
		var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
		var margin = 8;
		if (viewportWidth > 0) {
			left = Math.max(margin, Math.min(left, viewportWidth - Math.min(width, viewportWidth) - margin));
		}
		if (viewportHeight > 0) {
			top = Math.max(margin, Math.min(top, viewportHeight - Math.min(height, viewportHeight) - margin));
		}
		return { left: left, top: top };
	}

	function applyStoredPanelPosition(panel) {
		var position = readStoredObject(CALLIN_PANEL_POSITION_KEY);
		if (!position || typeof position.left !== "number" || typeof position.top !== "number") {
			return;
		}
		var rect = panel.getBoundingClientRect();
		var next = clampPanelPosition(position.left, position.top, rect.width || 340, rect.height || 200);
		panel.style.left = next.left + "px";
		panel.style.top = next.top + "px";
		panel.style.right = "auto";
		panel.style.bottom = "auto";
	}

	function enablePanelDrag(panel, handle) {
		var dragging = false;
		var startX = 0;
		var startY = 0;
		var startLeft = 0;
		var startTop = 0;

		function point(event) {
			if (event.touches && event.touches.length) {
				return event.touches[0];
			}
			if (event.changedTouches && event.changedTouches.length) {
				return event.changedTouches[0];
			}
			return event;
		}

		function start(event) {
			if (event.target && event.target.closest && event.target.closest("button")) {
				return;
			}
			var p = point(event);
			var rect = panel.getBoundingClientRect();
			dragging = true;
			startX = p.clientX;
			startY = p.clientY;
			startLeft = rect.left;
			startTop = rect.top;
			panel.style.left = startLeft + "px";
			panel.style.top = startTop + "px";
			panel.style.right = "auto";
			panel.style.bottom = "auto";
			if (event.preventDefault) {
				event.preventDefault();
			}
		}

		function move(event) {
			if (!dragging) {
				return;
			}
			var p = point(event);
			var rect = panel.getBoundingClientRect();
			var next = clampPanelPosition(startLeft + p.clientX - startX, startTop + p.clientY - startY, rect.width, rect.height);
			panel.style.left = next.left + "px";
			panel.style.top = next.top + "px";
			if (event.preventDefault) {
				event.preventDefault();
			}
		}

		function end() {
			if (!dragging) {
				return;
			}
			dragging = false;
			var rect = panel.getBoundingClientRect();
			writeStoredObject(CALLIN_PANEL_POSITION_KEY, { left: rect.left, top: rect.top });
		}

		handle.addEventListener("mousedown", start);
		document.addEventListener("mousemove", move);
		document.addEventListener("mouseup", end);
		handle.addEventListener("touchstart", start);
		document.addEventListener("touchmove", move);
		document.addEventListener("touchend", end);
	}

	function ensureStyle() {
		if (document.getElementById(CALLIN_SCRIPT_ID)) {
			return;
		}
		var style = document.createElement("style");
		style.id = CALLIN_SCRIPT_ID;
		style.textContent =
			"#vdo-callin-panel{position:fixed;right:14px;bottom:72px;z-index:2147483100;width:340px;max-width:calc(100vw - 28px);font-family:Arial,Helvetica,sans-serif;background:var(--background-color,#141926);color:#f5f7fa;border:1px solid rgba(255,255,255,.14);border-radius:4px;box-shadow:0 14px 34px rgba(0,0,0,.35);overflow:hidden}\n" +
			"#vdo-callin-panel.vdo-callin-minimized .vdo-callin-body{display:none}\n" +
			"#vdo-callin-panel button,#vdo-callin-panel input,#vdo-callin-panel select{font:inherit}\n" +
			"#vdo-callin-panel button{border:0;border-radius:var(--button-radius,2px);background:#1967d2;color:#fff;padding:7px 10px;cursor:pointer}\n" +
			"#vdo-callin-panel button.secondary{background:var(--button-color,#2a2a2a)}\n" +
			"#vdo-callin-panel button.danger{background:#a33a3a}\n" +
			"#vdo-callin-panel button:disabled{opacity:.55;cursor:default}\n" +
			"#vdo-callin-panel input,#vdo-callin-panel select{box-sizing:border-box;width:100%;background:rgba(0,0,0,.26);color:#f7f9fb;border:1px solid rgba(255,255,255,.18);border-radius:var(--button-radius,2px);padding:7px}\n" +
			"#vdo-callin-panel select{color-scheme:dark;background-color:#0f1420;color:#f7f9fb}\n" +
			"#vdo-callin-panel select option,#vdo-callin-panel select optgroup{background-color:#0f1420;color:#f7f9fb}\n" +
			"#vdo-callin-panel input::placeholder{color:rgba(245,247,250,.48)}\n" +
			"#vdo-callin-panel label{display:block;margin:8px 0 4px;color:#cdd8e2;font-size:12px}\n" +
			".vdo-callin-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;background:rgba(0,0,0,.22);border-bottom:1px solid rgba(255,255,255,.1);cursor:move;user-select:none}\n" +
			".vdo-callin-title{font-weight:700;font-size:14px}\n" +
			".vdo-callin-head-actions{display:flex;align-items:center;gap:6px}\n" +
			"#vdo-callin-panel button.vdo-callin-icon{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0;background:var(--button-color,#2a2a2a);font-size:17px}\n" +
			".vdo-callin-body{padding:12px;max-height:72vh;overflow:auto}\n" +
			".vdo-callin-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}\n" +
			".vdo-callin-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}\n" +
			".vdo-callin-actions.compact{margin-top:8px}\n" +
			"#vdo-callin-panel .vdo-callin-check{display:flex;align-items:center;gap:8px;margin:9px 0 0;color:#d9e2ea;font-size:12px;line-height:1.25}\n" +
			"#vdo-callin-panel .vdo-callin-check input{width:16px;min-width:16px;height:16px;padding:0;margin:0;flex:0 0 auto}\n" +
			"#vdo-callin-panel .vdo-callin-check span{display:block}\n" +
			"#vdo-callin-status{margin-top:10px;padding:8px;border-radius:var(--button-radius,2px);background:rgba(0,0,0,.28);color:#dce7ef;font-size:12px;line-height:1.35;min-height:18px}\n" +
			".vdo-callin-note{margin-top:8px;color:#aebdca;font-size:12px;line-height:1.35}\n" +
			".vdo-callin-warning{color:#f4d18a}\n" +
			"#vdo-callin-panel .vdo-callin-guide a{color:#8ab4f8;text-decoration:none}\n" +
			"#vdo-callin-panel .vdo-callin-guide a:hover{text-decoration:underline}\n" +
			".vdo-callin-ringtone-menu{position:absolute;top:47px;right:8px;z-index:2;width:250px;padding:10px;background:#111722;border:1px solid rgba(255,255,255,.18);border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.4)}\n" +
			".vdo-callin-ringtone-menu.vdo-callin-hidden{display:none}\n" +
			".vdo-callin-ringtone-menu label:first-child{margin-top:0}\n" +
			".vdo-callin-ringtone-actions{display:flex;align-items:center;gap:7px}\n" +
			"#vdo-callin-panel .vdo-callin-ringtone-actions select{min-width:0;flex:1}\n" +
			".vdo-callin-ringtone-status{margin-top:7px;color:#aebdca;font-size:11px;line-height:1.3;overflow-wrap:anywhere}\n" +
			".vdo-callin-ringtone-status:empty{display:none}\n" +
			".vdo-callin-ringtone-volume{display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px}\n" +
			"#vdo-callin-panel .vdo-callin-ringtone-volume input{height:24px;padding:0;background:transparent}\n" +
			".vdo-callin-ringtone-value{min-width:34px;color:#cdd8e2;font-size:12px;text-align:right}\n" +
			".vdo-callin-incoming{margin-top:10px;padding:9px;border:1px solid rgba(255,255,255,.18);border-radius:var(--button-radius,2px);background:rgba(255,255,255,.05)}\n" +
			".vdo-callin-incoming strong{display:block;margin-bottom:7px}\n" +
			"@media(max-width:600px){#vdo-callin-panel{right:8px;bottom:8px;max-width:calc(100vw - 16px)}}";
		document.head.appendChild(style);
	}

	function makeButton(text, className) {
		var button = document.createElement("button");
		button.type = "button";
		button.textContent = text;
		if (className) {
			button.className = className;
		}
		return button;
	}

	function makeIconButton(iconClass, title) {
		var button = makeButton("", "vdo-callin-icon");
		var icon = document.createElement("i");
		icon.className = iconClass;
		icon.setAttribute("aria-hidden", "true");
		button.title = title;
		button.setAttribute("aria-label", title);
		button.appendChild(icon);
		return button;
	}

	function makeInput(id, labelText, value, type) {
		var wrapper = document.createElement("div");
		var label = document.createElement("label");
		var input = document.createElement("input");
		label.setAttribute("for", id);
		label.textContent = labelText;
		input.id = id;
		input.type = type || "text";
		input.value = value || "";
		input.autocomplete = "off";
		wrapper.appendChild(label);
		wrapper.appendChild(input);
		return { wrapper: wrapper, input: input };
	}

	function getPcConfig() {
		var config = {};
		var key;
		if (window.session && session.configuration) {
			for (key in session.configuration) {
				if (Object.prototype.hasOwnProperty.call(session.configuration, key)) {
					config[key] = session.configuration[key];
				}
			}
		}
		if (!config.iceServers) {
			if (window.session && session.stunServers) {
				config.iceServers = session.stunServers;
			} else {
				config.iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
			}
		}
		return config;
	}

	function getAudioContext() {
		if (!window.session) {
			return null;
		}
		if (!session.audioCtxOutbound) {
			try {
				session.audioCtxOutbound = new AudioContext();
			} catch (e) {
				try {
					session.audioCtxOutbound = new webkitAudioContext();
				} catch (e2) {
					callinError(e2);
					return null;
				}
			}
		}
		return session.audioCtxOutbound;
	}

	function hasAudio(stream) {
		return stream && stream.getAudioTracks && stream.getAudioTracks().length;
	}

	function getUsableAudioTracks(stream, includeMuted) {
		if (!stream || !stream.getAudioTracks) {
			return [];
		}
		var tracks = stream.getAudioTracks();
		var usable = [];
		for (var i = 0; i < tracks.length; i++) {
			if (tracks[i] && (includeMuted || tracks[i].enabled !== false) && (!tracks[i].readyState || tracks[i].readyState === "live")) {
				usable.push(tracks[i]);
			}
		}
		return usable;
	}

	function hasUsableAudio(stream) {
		return getUsableAudioTracks(stream).length > 0;
	}

	function isLocalMicrophoneMuted() {
		if (!window.session) {
			return false;
		}
		if (session.muted) {
			return true;
		}
		var stream = session.streamSrc;
		var tracks = stream && stream.getAudioTracks ? stream.getAudioTracks() : [];
		for (var i = 0; i < tracks.length; i++) {
			if (tracks[i] && tracks[i].enabled === false) {
				return true;
			}
		}
		return false;
	}

	function hasSharedAudioTrack(streamA, streamB) {
		var tracksA = getUsableAudioTracks(streamA);
		var tracksB = getUsableAudioTracks(streamB);
		for (var i = 0; i < tracksA.length; i++) {
			for (var j = 0; j < tracksB.length; j++) {
				if (tracksA[i] === tracksB[j] || (tracksA[i].id && tracksA[i].id === tracksB[j].id)) {
					return true;
				}
			}
		}
		return false;
	}

	function setupCallIn(options) {
		if (!window.session) {
			return;
		}
		if (session.callin && session.callin.stop) {
			try {
				session.callin.stop();
			} catch (e) {
				callinError(e);
			}
		}

		ensureStyle();

		var state = {
			mode: (options && options.mode) || getParam("callin", "sip") || "sip",
			ignoredPasswordParam: stripSensitiveParams(["sippass", "callinpass"]),
			ringtoneSettings: readRingtoneSettings(),
			ringtoneAudio: null,
			ringtoneCycleTimer: null,
			ringtoneBurstTimer: null,
			ringtoneStopTimer: null,
			ringtoneActive: false,
			ringtoneMenu: null,
			ringtoneButton: null,
			ringtoneUploadCleanup: null,
			stopped: false,
			savedSipIdentity: null,
			sipPasswordRequired: false,
			ua: null,
			connectionPending: false,
			callPending: false,
			callAttempt: 0,
			activeSession: null,
			remoteStream: null,
			twilioData: null,
			twilioAudio: null,
			twilioInputStream: null,
			twilioRefreshInterval: null,
			twilioRefreshPromise: null,
			twilioRefreshRetryTimer: null,
			twilioRefreshFailures: 0,
			twilioSessionEnded: false,
			connectedMode: null,
			autoDialed: false,
			returnNodes: [],
			returnPrivate: false,
			returnDestination: null,
			returnStream: null,
			panel: null,
			status: null,
			remoteAudio: null,
			incomingBox: null,
			incomingAutoAnswerTimer: null,
			connectButton: null,
			dialButton: null,
			hangupButton: null,
			unloadHandler: null,
			fields: {},
			groups: {}
		};

		var adapters = {
			sip: {
				name: "SIP / PBX",
				available: true,
				message: "SIP/PBX selected. Enter a SIP-over-WSS endpoint and SIP credentials."
			},
			twilio: {
				name: "Twilio",
				available: true,
				message: "Twilio adapter selected. Enter the Worker URL and access key, then start the bridge."
			},
			signalwire: {
				name: "SignalWire",
				available: true,
				message: "SignalWire SIP selected. Enter the SignalWire SIP-over-WSS endpoint and SIP credentials."
			},
			telnyx: {
				name: "Telnyx",
				available: false,
				message: "Telnyx support needs the Telnyx WebRTC SDK/JWT or SIP credential adapter."
			}
		};

		function setStatus(text) {
			if (state.status) {
				state.status.textContent = text;
			}
			callinLog(text);
		}

		function updateRingtoneButton() {
			if (!state.ringtoneButton) {
				return;
			}
			var silent = state.ringtoneSettings.mode === "silent" || state.ringtoneSettings.volume === 0;
			var icon = state.ringtoneButton.querySelector("i");
			if (icon) {
				icon.className = silent ? "las la-bell-slash" : "las la-bell";
			}
			var title = silent ? "Incoming ringtone is silent" : "Incoming ringtone settings";
			state.ringtoneButton.title = title;
			state.ringtoneButton.setAttribute("aria-label", title);
		}

		function saveRingtoneSettings() {
			writeStoredObject(CALLIN_RINGTONE_STORAGE_KEY, state.ringtoneSettings);
			updateRingtoneButton();
		}

		function getRingtoneSource() {
			if (state.ringtoneSettings.tone === "custom" && state.ringtoneSettings.customUrl) {
				return state.ringtoneSettings.customUrl;
			}
			return CALLIN_RINGTONE_SOURCES[state.ringtoneSettings.tone] || CALLIN_RINGTONE_SOURCES.classic;
		}

		function prepareRingtoneAudio() {
			var source = getRingtoneSource();
			var audio = state.ringtoneAudio;
			if (!audio) {
				audio = document.createElement("audio");
				audio.preload = "auto";
				audio.loop = true;
				audio.playsInline = true;
				audio.style.display = "none";
				document.body.appendChild(audio);
				var outputDevice = getParam(["callinoutput", "sipoutput"], "");
				setCallInOutputDevice(audio, outputDevice);
				state.ringtoneAudio = audio;
			}
			if (audio.getAttribute("src") !== source) {
				try {
					audio.pause();
					audio.currentTime = 0;
				} catch (e) {}
				audio.src = source;
				audio.load();
			}
			return audio;
		}

		function stopRingtone() {
			state.ringtoneActive = false;
			if (state.ringtoneCycleTimer) {
				clearInterval(state.ringtoneCycleTimer);
				state.ringtoneCycleTimer = null;
			}
			if (state.ringtoneBurstTimer) {
				clearTimeout(state.ringtoneBurstTimer);
				state.ringtoneBurstTimer = null;
			}
			if (state.ringtoneStopTimer) {
				clearTimeout(state.ringtoneStopTimer);
				state.ringtoneStopTimer = null;
			}
			if (state.ringtoneAudio) {
				try {
					state.ringtoneAudio.pause();
					state.ringtoneAudio.currentTime = 0;
				} catch (e) {}
			}
		}

		function playRingtoneBurst() {
			if (!state.ringtoneActive) {
				return;
			}
			var audio = prepareRingtoneAudio();
			audio.volume = state.ringtoneSettings.volume / 100;
			try {
				audio.currentTime = 0;
				var playResult = audio.play();
				if (playResult && playResult.catch) {
					playResult.catch(function (e) {
						callinError(e);
					});
				}
			} catch (e) {
				callinError(e);
			}
			if (state.ringtoneBurstTimer) {
				clearTimeout(state.ringtoneBurstTimer);
			}
			state.ringtoneBurstTimer = setTimeout(function () {
				state.ringtoneBurstTimer = null;
				try {
					audio.pause();
					audio.currentTime = 0;
				} catch (e) {}
			}, 1500);
		}

		function startRingtone(preview) {
			stopRingtone();
			if (state.ringtoneSettings.mode === "silent" || state.ringtoneSettings.volume === 0) {
				return false;
			}
			if (!preview && window.session && session.speakerMuted) {
				return false;
			}
			state.ringtoneActive = true;
			playRingtoneBurst();
			if (!preview) {
				state.ringtoneCycleTimer = setInterval(playRingtoneBurst, 4000);
			} else {
				state.ringtoneStopTimer = setTimeout(stopRingtone, 1500);
			}
			return true;
		}

		function unlockRingtoneAudio() {
			if (state.ringtoneSettings.mode === "silent") {
				return;
			}
			var audio = prepareRingtoneAudio();
			var volume = audio.volume;
			audio.volume = 0;
			var playResult = audio.play();
			if (playResult && playResult.then) {
				playResult
					.then(function () {
						audio.pause();
						audio.currentTime = 0;
						audio.volume = volume;
					})
					.catch(function () {
						audio.volume = volume;
					});
			}
		}

		function openRingtoneUpload(ringtoneSelect, customOption, ringtoneStatus) {
			if (state.ringtoneUploadCleanup) {
				state.ringtoneUploadCleanup();
			}
			var popup = window.open(CALLIN_UPLOAD_ORIGIN + "/popup/upload", "uploadCallInRingtone", "width=640,height=640");
			if (!popup) {
				ringtoneStatus.textContent = "The upload pop-up was blocked.";
				return;
			}
			ringtoneStatus.textContent = "Choose a small audio file in the upload window.";
			var monitor = null;
			var cleanup = function () {
				if (monitor) {
					clearInterval(monitor);
					monitor = null;
				}
				window.removeEventListener("message", handleMessage);
				if (state.ringtoneUploadCleanup === cleanup) {
					state.ringtoneUploadCleanup = null;
				}
			};
			var handleMessage = function (event) {
				if (event.origin !== CALLIN_UPLOAD_ORIGIN || event.source !== popup || !event.data || event.data.type !== "media-uploaded") {
					return;
				}
				var contentType = String(event.data.contentType || "").toLowerCase();
				if (contentType && contentType.indexOf("audio/") !== 0 && contentType !== "application/ogg") {
					ringtoneStatus.textContent = "That upload is not an audio file.";
					cleanup();
					return;
				}
				var customUrl = normalizeRingtoneUrl(event.data.url);
				if (!customUrl) {
					ringtoneStatus.textContent = "The upload did not return a valid HTTPS audio URL.";
					cleanup();
					return;
				}
				stopRingtone();
				state.ringtoneSettings.mode = "ring";
				state.ringtoneSettings.tone = "custom";
				state.ringtoneSettings.customUrl = customUrl;
				state.ringtoneSettings.customName = event.data.filename ? String(event.data.filename).slice(0, 100) : "Custom ringtone";
				customOption.disabled = false;
				ringtoneSelect.value = "custom";
				ringtoneStatus.textContent = state.ringtoneSettings.customName;
				saveRingtoneSettings();
				cleanup();
			};
			window.addEventListener("message", handleMessage);
			monitor = setInterval(function () {
				if (!popup || popup.closed) {
					cleanup();
				}
			}, 1000);
			state.ringtoneUploadCleanup = cleanup;
		}

		function setButtons() {
			var connected = !!state.ua;
			var pending = !!state.connectionPending;
			var callPending = !!state.callPending;
			var active = !!state.activeSession;
			var mode = state.connectedMode || (state.fields.provider ? state.fields.provider.value : state.mode);
			var twilioOutbound = mode === "twilio" && state.twilioData && state.twilioData.outbound === true;
			if (state.connectButton) {
				state.connectButton.textContent = pending ? (mode === "twilio" ? "Starting..." : "Connecting...") : connected ? "Disconnect" : mode === "twilio" ? "Start" : "Connect";
				state.connectButton.disabled = pending;
			}
			if (state.dialButton) {
				state.dialButton.disabled = pending || callPending || !connected || active || (mode === "twilio" && !twilioOutbound);
			}
			if (state.hangupButton) {
				state.hangupButton.disabled = !active;
			}
			if (state.fields.provider) {
				state.fields.provider.disabled = pending || connected;
			}
			var lockedFields = ["twilioApi", "twilioKey", "wss", "uri", "authUser", "password", "register"];
			for (var i = 0; i < lockedFields.length; i++) {
				if (state.fields[lockedFields[i]]) {
					state.fields[lockedFields[i]].disabled = pending || connected;
				}
			}
		}

		function normalizeSipTarget(target) {
			target = String(target || "").trim();
			if (!target) {
				return "";
			}
			if (/^sips?:/i.test(target)) {
				return target;
			}
			if (target.indexOf("@") !== -1) {
				return "sip:" + target;
			}
			var dialTarget = target.replace(/[^\d+*#]/g, "");
			if (!dialTarget) {
				return target;
			}
			var domain = getSipDomainFromUri(state.fields.uri.value) || getSipDomainFromWss(state.fields.wss.value);
			if (!domain) {
				return target;
			}
			return "sip:" + dialTarget + "@" + domain;
		}

		function createRemoteAudio() {
			if (state.remoteAudio) {
				return state.remoteAudio;
			}
			var audio = document.createElement("audio");
			audio.autoplay = true;
			audio.playsInline = true;
			audio.muted = !!(window.session && session.speakerMuted);
			audio.style.display = "none";
			document.body.appendChild(audio);
			state.remoteAudio = audio;

			var outputDevice = getParam(["callinoutput", "sipoutput"], "");
			setCallInOutputDevice(audio, outputDevice);
			return audio;
		}

		function applySpeakerMute() {
			if (state.remoteAudio) {
				state.remoteAudio.muted = !!(window.session && session.speakerMuted);
			}
			if (state.twilioAudio) {
				// Once the stream is attached to remoteAudio, keep the SDK-owned
				// element silent so the caller is not monitored twice.
				state.twilioAudio.muted = hasUsableAudio(state.remoteStream) || !!(window.session && session.speakerMuted);
			}
			if (window.session && session.speakerMuted) {
				stopRingtone();
			}
		}

		function addSourceToReturnMix(ctx, destination, stream) {
			// Keep live muted tracks connected: enabling the track must restore audio.
			if (!getUsableAudioTracks(stream, true).length) {
				return false;
			}
			try {
				var source = ctx.createMediaStreamSource(stream);
				source.connect(destination);
				state.returnNodes.push(source);
				return true;
			} catch (e) {
				callinError(e);
				return false;
			}
		}

		function cleanupReturnMix(keepDestination) {
			for (var i = 0; i < state.returnNodes.length; i++) {
				try {
					state.returnNodes[i].disconnect();
				} catch (e) {}
			}
			state.returnNodes = [];
			if (!keepDestination) {
				state.returnDestination = null;
				state.returnStream = null;
				if (window.session && session.callin) {
					session.callin.returnStream = null;
				}
			}
		}

		function createReturnMix(extraStream, keepDestination) {
			cleanupReturnMix(keepDestination);
			var ctx = getAudioContext();
			if (!ctx) {
				return null;
			}
			if (ctx.state === "suspended" && ctx.resume) {
				ctx.resume().catch(function () {});
			}

			var destination = keepDestination && state.returnDestination ? state.returnDestination : ctx.createMediaStreamDestination();
			state.returnDestination = destination;

			var added = false;
			var addedLocal = false;
			// The caller is outside the room's per-peer Solo Talk/private-chat routes.
			// Silence the complete return feed until the private conversation ends.
			var privateChat = session.director ? !!(session.soloChatUUID && session.soloChatUUID.length) : !!((session.micIsolated && session.micIsolated.length) || session.micIsolatedAutoMute);
			if (!privateChat && session.streamSrc) {
				addedLocal = addSourceToReturnMix(ctx, destination, session.streamSrc);
				added = addedLocal || added;
			}
			if (!privateChat && !addedLocal && !isLocalMicrophoneMuted() && extraStream && !hasSharedAudioTrack(extraStream, session.streamSrc)) {
				added = addSourceToReturnMix(ctx, destination, extraStream) || added;
			}

			if (!privateChat && session.rpcs) {
				for (var uuid in session.rpcs) {
					if (!Object.prototype.hasOwnProperty.call(session.rpcs, uuid)) {
						continue;
					}
					try {
						if (session.rpcs[uuid].videoElement && session.rpcs[uuid].videoElement.srcObject) {
							added = addSourceToReturnMix(ctx, destination, session.rpcs[uuid].videoElement.srcObject) || added;
						}
					} catch (e) {
						callinError(e);
					}
				}
			}

			state.returnStream = destination.stream;
			if (window.session && session.callin) {
				session.callin.returnStream = state.returnStream;
			}
			if (privateChat) {
				setStatus("Caller return audio paused during Solo Talk/private chat.");
			} else if (!added) {
				setStatus("Return mix is silent until VDO.Ninja has a host mic or guest audio.");
			} else if (state.returnPrivate) {
				setStatus("Caller return audio resumed.");
			}
			state.returnPrivate = privateChat;
			return state.returnStream;
		}

		function replaceCallerSendTrack() {
			if (!state.activeSession || !state.activeSession.connection || !state.returnStream) {
				return;
			}
			var tracks = state.returnStream.getAudioTracks();
			if (!tracks.length || !state.activeSession.connection.getSenders) {
				return;
			}
			var nextTrack = tracks[0];
			var senders = state.activeSession.connection.getSenders();
			for (var i = 0; i < senders.length; i++) {
				if (senders[i].track && senders[i].track.kind === "audio" && senders[i].replaceTrack) {
					try {
						senders[i].replaceTrack(nextTrack).catch(function (e) {
							callinError(e);
						});
					} catch (e) {
						callinError(e);
					}
				}
			}
		}

		function updateMixer() {
			if (!state.activeSession) {
				return;
			}
			if (state.connectedMode === "twilio" || (state.fields.provider && state.fields.provider.value === "twilio")) {
				createReturnMix(state.twilioInputStream, true);
			} else {
				createReturnMix(null, true);
				replaceCallerSendTrack();
			}
		}

		function rebuildOutboundMix() {
			if (!window.session || !session.videoElement || !window.outboundAudioPipeline) {
				return;
			}
			try {
				session.videoElement.srcObject = outboundAudioPipeline(session.streamSrc || false);
				if (window.senderAudioUpdate) {
					senderAudioUpdate();
				}
			} catch (e) {
				callinError(e);
			}
		}

		function attachRemoteStream(stream) {
			if (!hasAudio(stream)) {
				return false;
			}
			if (!state.remoteStream) {
				state.remoteStream = new MediaStream();
			}
			var tracks = stream.getAudioTracks ? stream.getAudioTracks() : [];
			for (var i = 0; i < tracks.length; i++) {
				var exists = false;
				var current = state.remoteStream.getAudioTracks();
				for (var j = 0; j < current.length; j++) {
					if (current[j].id === tracks[i].id) {
						exists = true;
						break;
					}
				}
				if (!exists) {
					state.remoteStream.addTrack(tracks[i]);
				}
			}

			var audio = createRemoteAudio();
			audio.srcObject = state.remoteStream;
			try {
				var playResult = audio.play();
				if (playResult && playResult.catch) {
					playResult.catch(function () {});
				}
			} catch (e) {}

			session.callin.remoteStream = state.remoteStream;
			session.callin.element = audio;
			applySpeakerMute();
			rebuildOutboundMix();
			setStatus("Caller audio connected to the VDO.Ninja outbound mix.");
			return true;
		}

		function wirePeerConnection(sipSession) {
			if (!sipSession || !sipSession.connection || sipSession._vdoCallInWired) {
				return;
			}
			sipSession._vdoCallInWired = true;
			try {
				sipSession.connection.addEventListener("track", function (event) {
					if (event.streams && event.streams[0]) {
						attachRemoteStream(event.streams[0]);
					} else if (event.track) {
						var stream = new MediaStream();
						stream.addTrack(event.track);
						attachRemoteStream(stream);
					}
				});
			} catch (e) {
				callinError(e);
			}
			try {
				sipSession.connection.onaddstream = function (event) {
					attachRemoteStream(event.stream);
				};
			} catch (e) {}
			try {
				var receivers = sipSession.connection.getReceivers ? sipSession.connection.getReceivers() : [];
				for (var i = 0; i < receivers.length; i++) {
					if (receivers[i].track && receivers[i].track.kind === "audio") {
						var stream = new MediaStream();
						stream.addTrack(receivers[i].track);
						attachRemoteStream(stream);
					}
				}
			} catch (e) {}
		}

		function getCallOptions(eventHandlers) {
			var returnStream = createReturnMix();
			return {
				eventHandlers: eventHandlers || {},
				mediaConstraints: { audio: true, video: false },
				mediaStream: returnStream,
				pcConfig: getPcConfig(),
				rtcOfferConstraints: { offerToReceiveAudio: true, offerToReceiveVideo: false },
				rtcAnswerConstraints: { offerToReceiveAudio: true, offerToReceiveVideo: false }
			};
		}

		function clearIncomingCallPrompt() {
			stopRingtone();
			if (state.incomingAutoAnswerTimer) {
				clearTimeout(state.incomingAutoAnswerTimer);
				state.incomingAutoAnswerTimer = null;
			}
			if (state.incomingBox) {
				try {
					state.incomingBox.remove();
				} catch (e) {}
				state.incomingBox = null;
			}
		}

		function cleanupCall() {
			clearIncomingCallPrompt();
			state.callPending = false;
			state.activeSession = null;
			if (state.remoteAudio) {
				try {
					state.remoteAudio.pause();
					state.remoteAudio.srcObject = null;
				} catch (e) {}
			}
			if (state.remoteStream) {
				try {
					state.remoteStream.getTracks().forEach(function (track) {
						track.stop();
					});
				} catch (e) {}
			}
			state.remoteStream = null;
			if (state.twilioAudio) {
				try {
					state.twilioAudio.pause();
					state.twilioAudio.srcObject = null;
				} catch (e) {}
				if (state.twilioAudio._vdoCallInAppended && state.twilioAudio.parentNode) {
					try {
						state.twilioAudio.parentNode.removeChild(state.twilioAudio);
					} catch (e2) {}
				}
			}
			state.twilioAudio = null;
			session.callin.remoteStream = null;
			session.callin.element = null;
			cleanupReturnMix();
			rebuildOutboundMix();
			setButtons();
		}

		function endActiveSession() {
			if (!state.activeSession) {
				return;
			}
			try {
				if (state.activeSession.terminate) {
					state.activeSession.terminate();
				} else if (state.activeSession.disconnect) {
					state.activeSession.disconnect();
				} else if (state.activeSession.reject) {
					state.activeSession.reject();
				}
			} catch (e) {
				callinError(e);
			}
		}

		function bindRtcSession(sipSession) {
			state.activeSession = sipSession;
			setButtons();
			if (sipSession._vdoCallInBound) {
				return;
			}
			sipSession._vdoCallInBound = true;
			setTimeout(function () {
				wirePeerConnection(sipSession);
			}, 0);

			sipSession.on("progress", function () {
				setStatus("Call is ringing or in progress.");
				wirePeerConnection(sipSession);
			});
			sipSession.on("accepted", function () {
				setStatus("Call accepted.");
				wirePeerConnection(sipSession);
				updateMixer();
			});
			sipSession.on("confirmed", function () {
				setStatus("Call connected.");
				wirePeerConnection(sipSession);
				updateMixer();
			});
			sipSession.on("ended", function (event) {
				var cause = event && event.cause ? event.cause : "ended";
				setStatus("Call ended: " + cause);
				cleanupCall();
			});
			sipSession.on("failed", function (event) {
				var cause = event && event.cause ? event.cause : "failed";
				setStatus("Call failed: " + cause);
				cleanupCall();
			});
			sipSession.on("getusermediafailed", function (event) {
				var cause = event && event.error ? event.error : "getUserMedia failed";
				setStatus("Call media failed: " + cause);
			});
		}

		function getTwilioApiBase() {
			var api = state.fields.twilioApi ? state.fields.twilioApi.value.trim() : "";
			if (!api) {
				api = DEFAULT_TWILIO_API;
			}
			return api.replace(/\/+$/, "");
		}

		function fetchTwilioJson(path, body, options) {
			var api = getTwilioApiBase();
			if (!/^https:\/\//i.test(api) && !/^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(api)) {
				return Promise.reject(new Error("Twilio Worker URL must be HTTPS."));
			}
			var headers = {
				"Content-Type": "application/json"
			};
			var key = state.fields.twilioKey ? state.fields.twilioKey.value : "";
			if (key) {
				headers["X-API-Key"] = key;
			}
			var controller = window.AbortController ? new AbortController() : null;
			var timeout = null;
			if (controller && !(options && options.keepalive)) {
				timeout = setTimeout(function () {
					controller.abort();
				}, 15000);
			}
			var request = fetch(api + path, {
				method: "POST",
				headers: headers,
				body: body ? JSON.stringify(body) : "{}",
				keepalive: !!(options && options.keepalive),
				signal: controller ? controller.signal : undefined
			});
			return request.then(
				function (response) {
					if (timeout) {
						clearTimeout(timeout);
					}
					return response.text().then(function (text) {
						var data = {};
						if (text) {
							try {
								data = JSON.parse(text);
							} catch (e) {
								data = { error: true, message: text };
							}
						}
						if (!response.ok || data.error) {
							var requestError = new Error(data.message || data.code || "Twilio Worker request failed");
							requestError.status = response.status;
							requestError.code = data.code || "";
							throw requestError;
						}
						return data;
					});
				},
				function (error) {
					if (timeout) {
						clearTimeout(timeout);
					}
					if (error && error.name === "AbortError") {
						throw new Error("Twilio Worker request timed out.");
					}
					throw error;
				}
			);
		}

		function getTwilioPhoneNumber(data) {
			if (!data) {
				return "";
			}
			if (typeof data.phoneNumber === "string" && /^\+[1-9]\d{6,14}$/.test(data.phoneNumber)) {
				return data.phoneNumber;
			}
			if (typeof data.dialInNumber === "string" && /^\+[1-9]\d{6,14}$/.test(data.dialInNumber)) {
				return data.dialInNumber;
			}
			if (data.dialInNumbers && data.dialInNumbers.length) {
				for (var i = 0; i < data.dialInNumbers.length; i++) {
					var entry = data.dialInNumbers[i];
					var number = typeof entry === "string" ? entry : entry && (entry.number || entry.phoneNumber);
					if (typeof number === "string" && /^\+[1-9]\d{6,14}$/.test(number)) {
						return number;
					}
				}
			}
			return "";
		}

		function validateTwilioSessionData(data, previousData) {
			if (!data || typeof data !== "object" || Array.isArray(data)) {
				throw new Error("Call-in service returned an invalid session response.");
			}
			var pin = typeof data.pin === "string" || typeof data.pin === "number" ? String(data.pin).trim() : "";
			if (!pin && (typeof data.dialInNumber === "string" || typeof data.dialInNumber === "number")) {
				var legacyPin = String(data.dialInNumber).trim();
				if (/^\d{4,10}$/.test(legacyPin)) {
					pin = legacyPin;
				}
			}
			if (typeof data.token !== "string" || !data.token || data.token.length > 32768 || !/^\d{4,10}$/.test(pin) || typeof data.identity !== "string" || !/^[A-Za-z0-9_]{1,121}$/.test(data.identity) || typeof data.sessionToken !== "string" || data.sessionToken.length < 16 || data.sessionToken.length > 512) {
				throw new Error("Call-in service returned an invalid session response.");
			}
			if (previousData && (previousData.pin !== pin || previousData.identity !== data.identity)) {
				throw new Error("Call-in service changed the active session unexpectedly.");
			}
			data.pin = pin;
			return data;
		}

		function describeTwilioInvite(data) {
			if (!data) {
				return "Twilio bridge started.";
			}
			var phoneNumber = getTwilioPhoneNumber(data);
			var outbound = data.outbound ? " Outbound test dialing is enabled." : "";
			if (phoneNumber) {
				return "Call " + phoneNumber + " and enter PIN " + data.pin + "." + outbound;
			}
			return "Twilio bridge registered. PIN " + data.pin + " is ready, but no phone number is configured yet." + outbound;
		}

		function refreshTwilioToken() {
			if (state.twilioRefreshPromise) {
				return state.twilioRefreshPromise;
			}
			if (state.twilioRefreshRetryTimer) {
				return Promise.resolve();
			}
			if (!state.ua || !state.twilioData || !state.twilioData.pin || !state.twilioData.identity) {
				return Promise.resolve();
			}
			var device = state.ua;
			var refreshBody = {
				pin: state.twilioData.pin,
				identity: state.twilioData.identity
			};
			if (state.twilioData.sessionToken) {
				refreshBody.sessionToken = state.twilioData.sessionToken;
			}
			state.twilioRefreshPromise = fetchTwilioJson("/session/refresh", refreshBody)
				.then(function (data) {
					data = validateTwilioSessionData(data, state.twilioData);
					state.twilioRefreshPromise = null;
					if (state.ua !== device) {
						return;
					}
					state.twilioData = data;
					session.callin.twilioData = data;
					state.twilioRefreshFailures = 0;
					if (state.ua && state.ua.updateToken) {
						state.ua.updateToken(data.token);
					}
					setStatus("Twilio token refreshed. " + describeTwilioInvite(data));
				})
				.catch(function (e) {
					state.twilioRefreshPromise = null;
					if (state.ua !== device) {
						return;
					}
					callinError(e);
					if (e && (e.status === 400 || e.status === 401 || e.status === 403)) {
						setStatus("Twilio session expired or was rejected. Disconnect and start it again.");
						return;
					}
					state.twilioRefreshFailures++;
					var retryDelay = Math.min(60000, 5000 * Math.pow(2, state.twilioRefreshFailures - 1));
					setStatus("Twilio token refresh failed; retrying in " + Math.round(retryDelay / 1000) + " seconds.");
					state.twilioRefreshRetryTimer = setTimeout(function () {
						state.twilioRefreshRetryTimer = null;
						refreshTwilioToken();
					}, retryDelay);
				});
			return state.twilioRefreshPromise;
		}

		function endTwilioSession(keepalive) {
			if (state.twilioSessionEnded || !state.twilioData || !state.twilioData.pin || !state.twilioData.identity || !state.twilioData.sessionToken) {
				return Promise.resolve();
			}
			state.twilioSessionEnded = true;
			return fetchTwilioJson(
				"/session/end",
				{
					pin: state.twilioData.pin,
					identity: state.twilioData.identity,
					sessionToken: state.twilioData.sessionToken
				},
				{ keepalive: !!keepalive }
			).catch(function (e) {
				if (!keepalive) {
					callinError(e);
				}
			});
		}

		function attachTwilioRemoteStreamFromCall(call) {
			if (hasUsableAudio(state.remoteStream)) {
				setStatus("Caller audio connected to the VDO.Ninja outbound mix.");
				return true;
			}
			if (state.twilioAudio && hasAudio(state.twilioAudio.srcObject)) {
				return attachRemoteStream(state.twilioAudio.srcObject);
			}

			var stream = null;
			try {
				if (call && call.getRemoteStream) {
					stream = call.getRemoteStream();
				}
			} catch (e) {
				callinError(e);
			}
			if (hasAudio(stream)) {
				return attachRemoteStream(stream);
			}

			try {
				if (call && call._mediaHandler && call._mediaHandler._remoteStream) {
					stream = call._mediaHandler._remoteStream;
				}
			} catch (e2) {
				callinError(e2);
			}
			if (hasAudio(stream)) {
				return attachRemoteStream(stream);
			}

			try {
				var handler = call && call._mediaHandler ? call._mediaHandler : null;
				var pc = null;
				if (handler && handler.version && handler.version.pc) {
					pc = handler.version.pc;
				} else if (handler && handler.peerConnection) {
					pc = handler.peerConnection;
				} else if (handler && handler._peerConnection) {
					pc = handler._peerConnection;
				}
				if (pc && pc.getReceivers) {
					var receivers = pc.getReceivers();
					var receiverStream = new MediaStream();
					for (var i = 0; i < receivers.length; i++) {
						if (receivers[i].track && receivers[i].track.kind === "audio") {
							receiverStream.addTrack(receivers[i].track);
						}
					}
					if (hasAudio(receiverStream)) {
						return attachRemoteStream(receiverStream);
					}
				}
			} catch (e3) {
				callinError(e3);
			}
			return false;
		}

		function scheduleTwilioRemoteAttach(call) {
			var delays = [0, 250, 1000, 2500, 5000];
			for (var i = 0; i < delays.length; i++) {
				(function (delay) {
					setTimeout(function () {
						if (state.activeSession !== call) {
							return;
						}
						if (!attachTwilioRemoteStreamFromCall(call) && delay === 5000) {
							setStatus("Twilio call connected, but caller audio is not available yet.");
						}
					}, delay);
				})(delays[i]);
			}
		}

		function attachTwilioAudioElement(audio, call) {
			if (!audio) {
				return;
			}
			state.twilioAudio = audio;
			state.twilioAudio.autoplay = true;
			state.twilioAudio.playsInline = true;
			if (!state.twilioAudio.parentNode && document.body) {
				state.twilioAudio.style.display = "none";
				document.body.appendChild(state.twilioAudio);
				state.twilioAudio._vdoCallInAppended = true;
			}
			state.twilioAudio.muted = true;
			if (attachTwilioRemoteStreamFromCall(call)) {
				session.callin.element = state.remoteAudio;
			} else {
				applySpeakerMute();
				try {
					var playResult = state.twilioAudio.play();
					if (playResult && playResult.catch) {
						playResult.catch(function () {});
					}
				} catch (e) {}
				session.callin.element = state.twilioAudio;
				rebuildOutboundMix();
				setStatus("Twilio call connected. Waiting for caller audio.");
			}
		}

		function bindTwilioCall(call) {
			state.activeSession = call;
			setButtons();
			if (call._vdoCallInBound) {
				return;
			}
			call._vdoCallInBound = true;

			call.on("accept", function () {
				if (hasUsableAudio(state.remoteStream)) {
					setStatus("Caller audio connected to the VDO.Ninja outbound mix.");
				} else {
					setStatus("Twilio call connected. Waiting for caller audio.");
				}
				updateMixer();
				scheduleTwilioRemoteAttach(call);
			});
			call.on("disconnect", function () {
				setStatus("Twilio call disconnected.");
				cleanupCall();
			});
			call.on("cancel", function () {
				setStatus("Twilio call cancelled.");
				cleanupCall();
			});
			call.on("reject", function () {
				setStatus("Twilio call rejected.");
				cleanupCall();
			});
			call.on("error", function (error) {
				var message = error && error.message ? error.message : "call error";
				setStatus("Twilio call error: " + message);
				callinError(error);
			});
			call.on("audio", function (audio) {
				attachTwilioAudioElement(audio, call);
				scheduleTwilioRemoteAttach(call);
			});
		}

		function answerTwilioCall(call) {
			try {
				if (state.activeSession !== call) {
					return;
				}
				clearIncomingCallPrompt();
				bindTwilioCall(call);
				updateMixer();
				call.accept();
				scheduleTwilioRemoteAttach(call);
				setStatus("Answering incoming Twilio call.");
			} catch (e) {
				callinError(e);
				setStatus("Failed to answer incoming Twilio call.");
			}
		}

		function showIncomingTwilioCall(call) {
			var from = "unknown caller";
			try {
				if (call.parameters && call.parameters.From) {
					from = call.parameters.From;
				}
			} catch (e) {}

			clearIncomingCallPrompt();
			var box = document.createElement("div");
			box.className = "vdo-callin-incoming";
			var title = document.createElement("strong");
			title.textContent = "Incoming phone call";
			var detail = document.createElement("div");
			detail.textContent = from;
			var actions = document.createElement("div");
			actions.className = "vdo-callin-actions";
			var accept = makeButton("Answer", "");
			var reject = makeButton("Reject", "danger");
			accept.onclick = function () {
				answerTwilioCall(call);
			};
			reject.onclick = function () {
				try {
					call.reject();
				} catch (e) {
					callinError(e);
				}
				clearIncomingCallPrompt();
				setStatus("Incoming Twilio call rejected.");
			};
			actions.appendChild(accept);
			actions.appendChild(reject);
			box.appendChild(title);
			box.appendChild(detail);
			box.appendChild(actions);
			state.panel.querySelector(".vdo-callin-body").appendChild(box);
			state.incomingBox = box;
			setStatus("Incoming Twilio phone call.");

			if (state.fields.autoAnswer.checked) {
				state.incomingAutoAnswerTimer = setTimeout(function () {
					state.incomingAutoAnswerTimer = null;
					answerTwilioCall(call);
				}, 100);
			} else {
				startRingtone(false);
			}
		}

		function createTwilioAudioProcessor() {
			return {
				createProcessedStream: function (inputStream) {
					state.twilioInputStream = inputStream || null;
					var returnStream = createReturnMix(state.twilioInputStream, true);
					if (returnStream) {
						return Promise.resolve(returnStream);
					}
					return Promise.resolve(inputStream);
				},
				destroyProcessedStream: function () {
					state.twilioInputStream = null;
					cleanupReturnMix();
					return Promise.resolve();
				}
			};
		}

		function destroyTwilioDevice(device) {
			if (!device) {
				return;
			}
			try {
				var result = device.destroy ? device.destroy() : device.unregister ? device.unregister() : null;
				if (result && result.catch) {
					result.catch(function (e) {
						callinError(e);
					});
				}
			} catch (e) {
				callinError(e);
			}
		}

		function clearTwilioDeviceState() {
			if (state.twilioRefreshRetryTimer) {
				clearTimeout(state.twilioRefreshRetryTimer);
				state.twilioRefreshRetryTimer = null;
			}
			state.ua = null;
			state.connectedMode = null;
			state.twilioData = null;
			state.twilioInputStream = null;
			state.twilioRefreshPromise = null;
			state.twilioRefreshFailures = 0;
			session.callin.twilioData = null;
		}

		function connectTwilio() {
			if (state.connectionPending || state.ua) {
				return;
			}
			var api = getTwilioApiBase();
			if (!api) {
				setStatus("Enter a Twilio Worker URL first.");
				return;
			}
			state.connectionPending = true;
			setStatus("Starting Twilio bridge.");
			setButtons();
			loadCallInDependency(TWILIO_URL, function () {
				if (state.stopped) {
					state.connectionPending = false;
					return;
				}
				if (!window.Twilio || !Twilio.Device) {
					state.connectionPending = false;
					setStatus("Twilio Voice SDK failed to load.");
					setButtons();
					return;
				}
				fetchTwilioJson("/session/start")
					.then(function (data) {
						data = validateTwilioSessionData(data);
						state.twilioData = data;
						state.twilioSessionEnded = false;
						state.twilioRefreshFailures = 0;
						if (state.stopped) {
							throw new Error("Twilio bridge was stopped before registration.");
						}
						state.ua = new Twilio.Device(data.token);
						state.connectedMode = "twilio";
						session.callin.twilioData = data;

						var processor = createTwilioAudioProcessor();
						var processorReady = Promise.resolve();
						if (state.ua.audio && state.ua.audio.addProcessor) {
							processorReady = state.ua.audio.addProcessor(processor);
						}

						state.ua.on("registered", function () {
							setStatus(describeTwilioInvite(state.twilioData));
							setButtons();
						});
						state.ua.on("unregistered", function () {
							setStatus("Twilio bridge unregistered.");
							setButtons();
						});
						state.ua.on("incoming", function (call) {
							if (state.activeSession && state.activeSession !== call) {
								try {
									call.reject();
								} catch (e) {}
								return;
							}
							bindTwilioCall(call);
							showIncomingTwilioCall(call);
						});
						state.ua.on("error", function (error) {
							var message = error && error.message ? error.message : "device error";
							setStatus("Twilio device error: " + message);
							callinError(error);
							if (error && (error.code === 31005 || error.code === 31204 || error.code === 31205)) {
								refreshTwilioToken();
							}
						});
						state.ua.on("tokenWillExpire", refreshTwilioToken);

						return processorReady.then(function () {
							if (!state.ua) {
								throw new Error("Twilio bridge was stopped before registration.");
							}
							setStatus("Registering Twilio bridge.");
							setButtons();
							return state.ua.register();
						});
					})
					.then(function () {
						state.connectionPending = false;
						setButtons();
						if (state.twilioRefreshInterval) {
							clearInterval(state.twilioRefreshInterval);
						}
						state.twilioRefreshInterval = setInterval(refreshTwilioToken, 50 * 60 * 1000);
					})
					.catch(function (e) {
						state.connectionPending = false;
						callinError(e);
						endTwilioSession(false);
						destroyTwilioDevice(state.ua);
						clearTwilioDeviceState();
						setStatus("Twilio bridge failed: " + e.message);
						setButtons();
					});
			}, function (error) {
				if (state.stopped) {
					return;
				}
				state.connectionPending = false;
				callinError(error);
				setStatus("Twilio Voice SDK failed to load.");
				setButtons();
			});
		}

		function disconnectTwilio() {
			state.connectionPending = false;
			state.callPending = false;
			state.callAttempt += 1;
			hangup();
			endTwilioSession(false);
			if (state.twilioRefreshInterval) {
				clearInterval(state.twilioRefreshInterval);
				state.twilioRefreshInterval = null;
			}
			var device = state.ua;
			clearTwilioDeviceState();
			destroyTwilioDevice(device);
			setStatus("Twilio bridge stopped.");
			setButtons();
		}

		function answerIncoming(sipSession) {
			try {
				if (state.activeSession !== sipSession) {
					return;
				}
				clearIncomingCallPrompt();
				bindRtcSession(sipSession);
				sipSession.answer(getCallOptions());
				setStatus("Answering incoming SIP call.");
				setTimeout(function () {
					wirePeerConnection(sipSession);
				}, 0);
			} catch (e) {
				callinError(e);
				setStatus("Failed to answer incoming call. Check the SIP account and browser media permissions.");
			}
		}

		function showIncomingCall(sipSession) {
			var from = "unknown caller";
			try {
				if (sipSession.remote_identity) {
					from = sipSession.remote_identity.toString();
				}
			} catch (e) {}

			clearIncomingCallPrompt();
			var box = document.createElement("div");
			box.className = "vdo-callin-incoming";
			var title = document.createElement("strong");
			title.textContent = "Incoming call";
			var detail = document.createElement("div");
			detail.textContent = from;
			var actions = document.createElement("div");
			actions.className = "vdo-callin-actions";
			var accept = makeButton("Answer", "");
			var reject = makeButton("Reject", "danger");
			accept.onclick = function () {
				answerIncoming(sipSession);
			};
			reject.onclick = function () {
				try {
					sipSession.terminate();
				} catch (e) {
					callinError(e);
				}
				clearIncomingCallPrompt();
				setStatus("Incoming call rejected.");
			};
			actions.appendChild(accept);
			actions.appendChild(reject);
			box.appendChild(title);
			box.appendChild(detail);
			box.appendChild(actions);
			state.panel.querySelector(".vdo-callin-body").appendChild(box);
			state.incomingBox = box;
			setStatus("Incoming SIP call.");

			if (state.fields.autoAnswer.checked) {
				state.incomingAutoAnswerTimer = setTimeout(function () {
					state.incomingAutoAnswerTimer = null;
					answerIncoming(sipSession);
				}, 100);
			} else {
				startRingtone(false);
			}
		}

		function validateSavedSipPassword() {
			var identity = state.savedSipIdentity;
			if (identity && (identity.wss !== state.fields.wss.value.trim() || identity.uri !== state.fields.uri.value.trim() || identity.authUser !== state.fields.authUser.value.trim())) {
				state.fields.password.value = "";
				state.savedSipIdentity = null;
				state.sipPasswordRequired = true;
			}
			if (state.sipPasswordRequired && !state.fields.password.value) {
				setStatus("SIP server or account changed. Enter its password before connecting.");
				return false;
			}
			return true;
		}

		function connectSip() {
			if (state.connectionPending || state.ua) {
				return;
			}
			if (!validateSavedSipPassword()) {
				return;
			}
			var wss = state.fields.wss.value.trim();
			var uri = state.fields.uri.value.trim();
			var password = state.fields.password.value;
			var authUser = state.fields.authUser.value.trim();
			var displayName = state.fields.display.value.trim();
			var register = state.fields.register.checked;

			if (!wss || !uri) {
				setStatus("SIP WSS URL and SIP URI are required.");
				return;
			}
			if (!/^wss:\/\//i.test(wss)) {
				setStatus("SIP WebSocket URL must use wss:// for browser calling.");
				return;
			}
			if (!/^sip:/i.test(uri)) {
				uri = "sip:" + uri;
			}
			state.autoDialed = false;
			state.connectionPending = true;
			setStatus("Starting SIP user agent.");
			setButtons();

			function maybeAutoDialSip() {
				if (state.autoDialed) {
					return;
				}
				if (paramEnabled(["sipautodial", "callinautodial"]) && state.fields.target.value.trim()) {
					state.autoDialed = true;
					dialSip();
				}
			}

			loadCallInDependency(JSSIP_URL, function () {
				if (state.stopped) {
					state.connectionPending = false;
					return;
				}
				if (!window.JsSIP) {
					state.connectionPending = false;
					setStatus("JsSIP failed to load.");
					setButtons();
					return;
				}
				try {
					var socket = new JsSIP.WebSocketInterface(wss);
					var config = {
						sockets: [socket],
						uri: uri,
						register: register,
						session_timers: false,
						user_agent: "VDO.Ninja experimental call-in"
					};
					if (password) {
						config.password = password;
					}
					if (authUser) {
						config.authorization_user = authUser;
					}
					if (displayName) {
						config.display_name = displayName;
					}

					state.ua = new JsSIP.UA(config);
					state.connectedMode = "sip";
					state.ua.on("connected", function () {
						setStatus("SIP WebSocket connected.");
						setButtons();
						if (!state.fields.register.checked) {
							setTimeout(maybeAutoDialSip, 0);
						}
					});
					state.ua.on("disconnected", function () {
						setStatus("SIP WebSocket disconnected.");
						setButtons();
					});
					state.ua.on("registered", function () {
						setStatus("SIP account registered.");
						setButtons();
						maybeAutoDialSip();
					});
					state.ua.on("unregistered", function () {
						setStatus("SIP account unregistered.");
						setButtons();
					});
					state.ua.on("registrationFailed", function (event) {
						var cause = event && event.cause ? event.cause : "registration failed";
						setStatus("SIP registration failed: " + cause);
					});
					state.ua.on("newRTCSession", function (event) {
						var sipSession = event.session;
						if (state.activeSession && state.activeSession !== sipSession) {
							try {
								sipSession.terminate();
							} catch (e) {}
							return;
						}
						bindRtcSession(sipSession);
						if (event.originator === "remote") {
							showIncomingCall(sipSession);
						}
					});
					state.ua.start();
					state.connectionPending = false;
					setStatus("Starting SIP user agent.");
					setButtons();
				} catch (e) {
					state.connectionPending = false;
					state.ua = null;
					state.connectedMode = null;
					callinError(e);
					setStatus("Failed to start SIP. Check WSS URL, SIP URI, and credentials.");
					setButtons();
				}
			}, function (error) {
				if (state.stopped) {
					return;
				}
				state.connectionPending = false;
				callinError(error);
				setStatus("JsSIP failed to load.");
				setButtons();
			});
		}

		function disconnectSip() {
			state.connectionPending = false;
			state.callPending = false;
			state.callAttempt += 1;
			hangup();
			if (state.ua) {
				try {
					state.ua.stop();
				} catch (e) {
					callinError(e);
				}
			}
			state.ua = null;
			state.connectedMode = null;
			state.autoDialed = false;
			setStatus("SIP disconnected.");
			setButtons();
		}

		function dialSip() {
			if (!state.ua) {
				setStatus("Connect SIP before dialing.");
				return;
			}
			var rawTarget = state.fields.target.value.trim();
			var target = normalizeSipTarget(rawTarget);
			if (!target) {
				setStatus("Enter a SIP target or phone routing target first.");
				return;
			}
			try {
				var sipSession = state.ua.call(
					target,
					getCallOptions({
						progress: function () {
							setStatus("Dialing " + target + ".");
						},
						failed: function (event) {
							var cause = event && event.cause ? event.cause : "failed";
							setStatus("Call failed: " + cause);
						},
						ended: function (event) {
							var cause = event && event.cause ? event.cause : "ended";
							setStatus("Call ended: " + cause);
						},
						confirmed: function () {
							setStatus("Call connected.");
						}
					})
				);
				bindRtcSession(sipSession);
				setTimeout(function () {
					wirePeerConnection(sipSession);
				}, 0);
			} catch (e) {
				callinError(e);
				setStatus("Dial failed. Check the target, SIP domain, and provider routing.");
			}
		}

		function dialTwilio() {
			if (state.callPending || state.activeSession) {
				return;
			}
			if (!state.ua || state.connectedMode !== "twilio") {
				setStatus("Start the Twilio bridge before dialing.");
				return;
			}
			if (!state.twilioData || state.twilioData.outbound !== true) {
				setStatus("This Twilio Worker does not advertise outbound dialing support.");
				return;
			}
			var target = state.fields.twilioTarget ? state.fields.twilioTarget.value.trim() : "";
			if (!target) {
				setStatus("Enter an outbound phone number first.");
				return;
			}
			if (!/^\+\d{7,15}$/.test(target)) {
				setStatus("Use E.164 format for Twilio outbound dialing, such as +15551234567.");
				return;
			}
			var device = state.ua;
			var callAttempt = ++state.callAttempt;
			state.callPending = true;
			setStatus("Dialing " + target + " through Twilio.");
			setButtons();
			try {
				var connectResult = device.connect({
					params: {
						To: target
					}
				});
				Promise.resolve(connectResult)
					.then(function (call) {
						if (callAttempt !== state.callAttempt || state.ua !== device) {
							try {
								if (call && call.disconnect) {
									call.disconnect();
								}
							} catch (e) {}
							return;
						}
						state.callPending = false;
						bindTwilioCall(call);
						scheduleTwilioRemoteAttach(call);
						setStatus("Dialing " + target + " through Twilio.");
						setButtons();
					})
					.catch(function (e) {
						if (callAttempt !== state.callAttempt) {
							return;
						}
						state.callPending = false;
						setButtons();
						callinError(e);
						setStatus("Twilio outbound call failed: " + (e && e.message ? e.message : "failed"));
					});
			} catch (e2) {
				if (callAttempt === state.callAttempt) {
					state.callPending = false;
					setButtons();
				}
				callinError(e2);
				setStatus("Twilio outbound call failed: " + (e2 && e2.message ? e2.message : "failed"));
			}
		}

		function hangup() {
			if (!state.activeSession) {
				return;
			}
			endActiveSession();
			cleanupCall();
			setStatus("Call hung up.");
		}

		function stop() {
			state.stopped = true;
			state.connectionPending = false;
			stopRingtone();
			if (state.connectedMode === "twilio" || state.twilioData) {
				disconnectTwilio();
			} else {
				hangup();
				if (state.ua) {
					try {
						if (state.ua.stop) {
							state.ua.stop();
						} else if (state.ua.destroy) {
							state.ua.destroy();
						}
					} catch (e) {}
				}
				state.ua = null;
				state.connectedMode = null;
			}
			if (state.panel) {
				state.panel.remove();
			}
			if (state.remoteAudio) {
				state.remoteAudio.remove();
			}
			if (state.twilioRefreshInterval) {
				clearInterval(state.twilioRefreshInterval);
				state.twilioRefreshInterval = null;
			}
			if (state.unloadHandler) {
				window.removeEventListener("beforeunload", state.unloadHandler);
				state.unloadHandler = null;
			}
			if (state.ringtoneAudio) {
				state.ringtoneAudio.remove();
				state.ringtoneAudio = null;
			}
			if (state.ringtoneUploadCleanup) {
				state.ringtoneUploadCleanup();
			}
			cleanupReturnMix();
		}

		function buildPanel() {
			var existing = document.getElementById("vdo-callin-panel");
			if (existing) {
				existing.remove();
			}
			var savedProfile = readSipProfile();
			var savedProfileLoaded = !!(savedProfile.wss || savedProfile.uri || savedProfile.authUser || savedProfile.display || savedProfile.target || savedProfile.password);
			if ((!hasParam("callin") || getParam("callin", "") === "") && savedProfile.provider && adapters[savedProfile.provider]) {
				state.mode = savedProfile.provider;
			}
			var panel = document.createElement("div");
			panel.id = "vdo-callin-panel";

			var head = document.createElement("div");
			head.className = "vdo-callin-head";
			var title = document.createElement("div");
			title.className = "vdo-callin-title";
			title.textContent = "Phone call-in";
			var headActions = document.createElement("div");
			headActions.className = "vdo-callin-head-actions";
			var ringtoneButton = makeIconButton("las la-bell", "Incoming ringtone settings");
			ringtoneButton.setAttribute("aria-expanded", "false");
			var minimize = makeIconButton("las la-chevron-down", "Minimize phone call-in panel");
			minimize.setAttribute("aria-expanded", "true");
			minimize.onclick = function () {
				var minimized = panel.classList.toggle("vdo-callin-minimized");
				var icon = minimize.querySelector("i");
				if (icon) {
					icon.className = minimized ? "las la-chevron-up" : "las la-chevron-down";
				}
				minimize.setAttribute("aria-expanded", minimized ? "false" : "true");
				minimize.setAttribute("aria-label", minimized ? "Expand phone call-in panel" : "Minimize phone call-in panel");
				minimize.title = minimized ? "Expand phone call-in panel" : "Minimize phone call-in panel";
				if (state.ringtoneMenu) {
					state.ringtoneMenu.classList.add("vdo-callin-hidden");
					ringtoneButton.setAttribute("aria-expanded", "false");
				}
			};
			head.appendChild(title);
			headActions.appendChild(ringtoneButton);
			headActions.appendChild(minimize);
			head.appendChild(headActions);

			var ringtoneMenu = document.createElement("div");
			ringtoneMenu.className = "vdo-callin-ringtone-menu vdo-callin-hidden";
			var ringtoneLabel = document.createElement("label");
			ringtoneLabel.setAttribute("for", "vdo-callin-ringtone-tone");
			ringtoneLabel.textContent = "Ringtone";
			var ringtoneSelect = document.createElement("select");
			ringtoneSelect.id = "vdo-callin-ringtone-tone";
			var classicOption = document.createElement("option");
			classicOption.value = "classic";
			classicOption.textContent = "Classic ring";
			var bellOption = document.createElement("option");
			bellOption.value = "bell";
			bellOption.textContent = "Bell";
			var chimeOption = document.createElement("option");
			chimeOption.value = "chime";
			chimeOption.textContent = "Chime";
			var customOption = document.createElement("option");
			customOption.value = "custom";
			customOption.textContent = "Custom upload";
			customOption.disabled = !state.ringtoneSettings.customUrl;
			var silentOption = document.createElement("option");
			silentOption.value = "silent";
			silentOption.textContent = "Silent";
			ringtoneSelect.appendChild(classicOption);
			ringtoneSelect.appendChild(bellOption);
			ringtoneSelect.appendChild(chimeOption);
			ringtoneSelect.appendChild(customOption);
			ringtoneSelect.appendChild(silentOption);
			ringtoneSelect.value = state.ringtoneSettings.mode === "silent" ? "silent" : state.ringtoneSettings.tone;
			var ringtoneActions = document.createElement("div");
			ringtoneActions.className = "vdo-callin-ringtone-actions";
			var ringtonePreview = makeIconButton("las la-play", "Preview ringtone");
			var ringtoneUpload = makeIconButton("las la-cloud-upload-alt", "Upload custom ringtone");
			ringtoneActions.appendChild(ringtoneSelect);
			ringtoneActions.appendChild(ringtonePreview);
			ringtoneActions.appendChild(ringtoneUpload);
			var ringtoneStatus = document.createElement("div");
			ringtoneStatus.className = "vdo-callin-ringtone-status";
			ringtoneStatus.textContent = state.ringtoneSettings.tone === "custom" ? state.ringtoneSettings.customName : "";
			var ringtoneVolumeLabel = document.createElement("label");
			ringtoneVolumeLabel.setAttribute("for", "vdo-callin-ringtone-volume");
			ringtoneVolumeLabel.textContent = "Ringtone volume";
			var ringtoneVolumeRow = document.createElement("div");
			ringtoneVolumeRow.className = "vdo-callin-ringtone-volume";
			var ringtoneVolume = document.createElement("input");
			ringtoneVolume.type = "range";
			ringtoneVolume.id = "vdo-callin-ringtone-volume";
			ringtoneVolume.min = "0";
			ringtoneVolume.max = "100";
			ringtoneVolume.value = String(state.ringtoneSettings.volume);
			var ringtoneVolumeValue = document.createElement("span");
			ringtoneVolumeValue.className = "vdo-callin-ringtone-value";
			ringtoneVolumeValue.textContent = state.ringtoneSettings.volume + "%";
			ringtoneVolumeRow.appendChild(ringtoneVolume);
			ringtoneVolumeRow.appendChild(ringtoneVolumeValue);
			ringtoneMenu.appendChild(ringtoneLabel);
			ringtoneMenu.appendChild(ringtoneActions);
			ringtoneMenu.appendChild(ringtoneStatus);
			ringtoneMenu.appendChild(ringtoneVolumeLabel);
			ringtoneMenu.appendChild(ringtoneVolumeRow);

			var body = document.createElement("div");
			body.className = "vdo-callin-body";

			var providerLabel = document.createElement("label");
			providerLabel.setAttribute("for", "vdo-callin-provider");
			providerLabel.textContent = "Provider";
			var provider = document.createElement("select");
			provider.id = "vdo-callin-provider";
			for (var key in adapters) {
				if (Object.prototype.hasOwnProperty.call(adapters, key)) {
					var option = document.createElement("option");
					option.value = key;
					option.textContent = adapters[key].name;
					provider.appendChild(option);
				}
			}
			provider.value = adapters[state.mode] ? state.mode : "sip";
			body.appendChild(providerLabel);
			body.appendChild(provider);

			var twilioApi = makeInput("vdo-callin-twilio-api", "Twilio Worker URL", getParam(["callinapi", "twilioapi"], DEFAULT_TWILIO_API), "text");
			var twilioKey = makeInput("vdo-callin-twilio-key", "Worker access key", "", "password");
			var twilioTarget = makeInput("vdo-callin-twilio-target", "Outbound test number", getParam(["twiliotarget", "callintarget"], ""), "text");
			twilioTarget.input.placeholder = "+15551234567";
			body.appendChild(twilioApi.wrapper);
			body.appendChild(twilioKey.wrapper);
			body.appendChild(twilioTarget.wrapper);

			var signalWireSpace = getSignalWireSpaceValue(savedProfile);
			var wssValue = getParamOrProfile(["sipwss", "callinwss"], savedProfile, "wss", "");
			if (!wssValue && state.mode === "signalwire" && signalWireSpace) {
				wssValue = signalWireWssFromSpace(signalWireSpace);
			}
			var passwordValue = profileFlag(savedProfile, "rememberPassword", false) ? savedProfile.password || "" : "";
			var wss = makeInput("vdo-callin-wss", "SIP WebSocket URL", wssValue, "text");
			var uri = makeInput("vdo-callin-uri", "SIP URI", getParamOrProfile(["sipuri", "callinuri"], savedProfile, "uri", ""), "text");
			var authUser = makeInput("vdo-callin-auth", "Auth username", getParamOrProfile(["sipuser", "callinuser"], savedProfile, "authUser", ""), "text");
			var password = makeInput("vdo-callin-pass", "Password", passwordValue, "password");
			if (passwordValue) {
				state.savedSipIdentity = {
					wss: String(savedProfile.wss || "").trim(),
					uri: String(savedProfile.uri || "").trim(),
					authUser: String(savedProfile.authUser || "").trim()
				};
			}
			wss.input.oninput = uri.input.oninput = authUser.input.oninput = validateSavedSipPassword;
			password.input.oninput = function () {
				state.savedSipIdentity = null;
				state.sipPasswordRequired = false;
			};
			var display = makeInput("vdo-callin-display", "Display name", getParamOrProfile(["sipdisplay", "callindisplay"], savedProfile, "display", "VDO.Ninja"), "text");
			var target = makeInput("vdo-callin-target", "Dial target", getParamOrProfile(["siptarget", "callintarget"], savedProfile, "target", ""), "text");
			wss.input.placeholder = "wss://your-provider.example.com";
			uri.input.placeholder = "sip:user@example.com";
			authUser.input.placeholder = "Usually the SIP username";
			target.input.placeholder = "+15551234567 or sip:user@example.com";

			body.appendChild(wss.wrapper);
			body.appendChild(uri.wrapper);
			var row1 = document.createElement("div");
			row1.className = "vdo-callin-row";
			row1.appendChild(authUser.wrapper);
			row1.appendChild(password.wrapper);
			body.appendChild(row1);
			var row2 = document.createElement("div");
			row2.className = "vdo-callin-row";
			row2.appendChild(display.wrapper);
			row2.appendChild(target.wrapper);
			body.appendChild(row2);

			var registerWrap = document.createElement("label");
			registerWrap.className = "vdo-callin-check";
			var register = document.createElement("input");
			register.type = "checkbox";
			register.checked = boolFromParamOrProfile(["sipregister", "callinregister"], savedProfile, "register", true);
			var registerText = document.createElement("span");
			registerText.textContent = "Register for incoming calls";
			registerWrap.appendChild(register);
			registerWrap.appendChild(registerText);
			body.appendChild(registerWrap);

			var autoAnswerWrap = document.createElement("label");
			autoAnswerWrap.className = "vdo-callin-check";
			var autoAnswer = document.createElement("input");
			autoAnswer.type = "checkbox";
			autoAnswer.checked = boolFromParamOrProfile(["sipautoanswer", "callinautoanswer"], savedProfile, "autoAnswer", false);
			var autoAnswerText = document.createElement("span");
			autoAnswerText.textContent = "Auto-answer incoming calls";
			autoAnswerWrap.appendChild(autoAnswer);
			autoAnswerWrap.appendChild(autoAnswerText);
			body.appendChild(autoAnswerWrap);

			var rememberWrap = document.createElement("label");
			rememberWrap.className = "vdo-callin-check";
			var rememberPassword = document.createElement("input");
			rememberPassword.type = "checkbox";
			rememberPassword.checked = profileFlag(savedProfile, "rememberPassword", false);
			var rememberText = document.createElement("span");
			rememberText.textContent = "Remember password on this browser";
			rememberWrap.appendChild(rememberPassword);
			rememberWrap.appendChild(rememberText);
			body.appendChild(rememberWrap);

			var profileActions = document.createElement("div");
			profileActions.className = "vdo-callin-actions compact";
			var saveProfileButton = makeButton("Save profile", "secondary");
			var forgetProfileButton = makeButton("Forget", "secondary");
			profileActions.appendChild(saveProfileButton);
			profileActions.appendChild(forgetProfileButton);
			body.appendChild(profileActions);

			var actions = document.createElement("div");
			actions.className = "vdo-callin-actions";
			var connect = makeButton("Connect", "");
			var dial = makeButton("Dial", "secondary");
			var end = makeButton("Hang up", "danger");
			actions.appendChild(connect);
			actions.appendChild(dial);
			actions.appendChild(end);
			body.appendChild(actions);

			var status = document.createElement("div");
			status.id = "vdo-callin-status";
			status.setAttribute("role", "status");
			status.setAttribute("aria-live", "polite");
			body.appendChild(status);

			var note = document.createElement("div");
			note.className = "vdo-callin-note vdo-callin-guide";
			body.appendChild(note);

			panel.appendChild(head);
			panel.appendChild(ringtoneMenu);
			panel.appendChild(body);
			document.body.appendChild(panel);

			state.panel = panel;
			state.status = status;
			state.ringtoneMenu = ringtoneMenu;
			state.ringtoneButton = ringtoneButton;
			state.connectButton = connect;
			state.dialButton = dial;
			state.hangupButton = end;
			state.fields = {
				provider: provider,
				twilioApi: twilioApi.input,
				twilioKey: twilioKey.input,
				twilioTarget: twilioTarget.input,
				wss: wss.input,
				uri: uri.input,
				authUser: authUser.input,
				password: password.input,
				display: display.input,
				target: target.input,
				register: register,
				autoAnswer: autoAnswer,
				rememberPassword: rememberPassword
			};
			state.groups = {
				twilio: [twilioApi.wrapper, twilioKey.wrapper, twilioTarget.wrapper],
				sip: [wss.wrapper, uri.wrapper, row1, row2, registerWrap, autoAnswerWrap, rememberWrap, profileActions]
			};

			function setGuideLink(mode) {
				var href = "https://docs.vdo.ninja/guides/phone-call-in-provider-options";
				var text = "Open call-in setup guide";
				if (mode === "twilio") {
					href = "https://docs.vdo.ninja/guides/twilio-phone-call-in-setup";
					text = "Open Twilio setup guide";
				} else if (mode === "signalwire") {
					href = "https://docs.vdo.ninja/guides/signalwire-sip-call-in-setup";
					text = "Open SignalWire setup guide";
				}
				note.textContent = "";
				var link = document.createElement("a");
				link.href = href;
				link.target = "_blank";
				link.rel = "noopener noreferrer";
				link.textContent = text;
				note.appendChild(link);
			}

			function updateProviderFields() {
				var mode = provider.value;
				var sipMode = mode === "sip" || mode === "signalwire";
				var i;
				for (i = 0; i < state.groups.twilio.length; i++) {
					state.groups.twilio[i].style.display = mode === "twilio" ? "" : "none";
				}
				for (i = 0; i < state.groups.sip.length; i++) {
					state.groups.sip[i].style.display = sipMode ? "" : "none";
				}
				if (mode === "signalwire") {
					wss.input.placeholder = "wss://your-space.sip.signalwire.com";
					uri.input.placeholder = "sip:username@your-space.sip.signalwire.com";
					target.input.placeholder = "+15551234567 or sip:user@your-space.sip.signalwire.com";
					if (!state.fields.wss.value && signalWireSpace) {
						state.fields.wss.value = signalWireWssFromSpace(signalWireSpace);
					}
				} else {
					wss.input.placeholder = "wss://your-provider.example.com";
					uri.input.placeholder = "sip:user@example.com";
					target.input.placeholder = "+15551234567 or sip:user@example.com";
				}
				if (note) {
					setGuideLink(mode);
				}
				setButtons();
			}

			function forgetSavedSipPassword() {
				var profile = readSipProfile();
				var changed = false;
				if (Object.prototype.hasOwnProperty.call(profile, "password")) {
					delete profile.password;
					changed = true;
				}
				if (profile.rememberPassword) {
					profile.rememberPassword = false;
					changed = true;
				}
				if (!changed) {
					return false;
				}
				writeStoredObject(SIP_PROFILE_STORAGE_KEY, profile);
				return true;
			}

			function confirmPasswordStorage() {
				if (!rememberPassword.checked) {
					if (forgetSavedSipPassword()) {
						setStatus("Saved SIP password removed from this browser.");
					}
					return;
				}
				var message = "Saving a SIP password stores it in this browser's localStorage.\nOnly do this on a trusted computer.\nDo not use this on shared or public systems.";
				if (typeof confirmAlt === "function") {
					confirmAlt(message, true).then(function (result) {
						if (!result) {
							rememberPassword.checked = false;
							setStatus("Password will not be saved.");
						}
					});
				} else if (!window.confirm(message)) {
					rememberPassword.checked = false;
					setStatus("Password will not be saved.");
				}
			}

			function saveSipProfile() {
				validateSavedSipPassword();
				var providerValue = state.fields.provider.value;
				if (!(providerValue === "sip" || providerValue === "signalwire")) {
					setStatus("SIP profile saving applies to SIP and SignalWire modes.");
					return;
				}
				var profile = {
					provider: providerValue,
					wss: state.fields.wss.value.trim(),
					uri: state.fields.uri.value.trim(),
					authUser: state.fields.authUser.value.trim(),
					display: state.fields.display.value.trim(),
					target: state.fields.target.value.trim(),
					register: !!state.fields.register.checked,
					autoAnswer: !!state.fields.autoAnswer.checked,
					rememberPassword: !!state.fields.rememberPassword.checked,
					signalwireSpace: signalWireSpace || ""
				};
				if (profile.rememberPassword && state.fields.password.value) {
					profile.password = state.fields.password.value;
				}
				if (!writeStoredObject(SIP_PROFILE_STORAGE_KEY, profile)) {
					setStatus("Could not save SIP profile in this browser.");
					return;
				}
				state.savedSipIdentity = profile.password ? { wss: profile.wss, uri: profile.uri, authUser: profile.authUser } : null;
				state.sipPasswordRequired = false;
				setStatus(profile.password ? "Saved SIP profile and password on this browser." : "Saved SIP profile without the password.");
			}

			function forgetSipProfile() {
				removeStoredObject(SIP_PROFILE_STORAGE_KEY);
				state.savedSipIdentity = null;
				state.sipPasswordRequired = false;
				state.fields.password.value = "";
				state.fields.rememberPassword.checked = false;
				setStatus("Forgot saved SIP profile on this browser.");
			}

			provider.onchange = function () {
				var adapter = adapters[provider.value];
				state.mode = provider.value;
				updateProviderFields();
				if (!adapter.available) {
					setStatus(adapter.message);
				} else {
					setStatus(adapter.message);
				}
			};
			connect.onclick = function () {
				unlockRingtoneAudio();
				var adapter = adapters[state.fields.provider.value];
				if (!adapter.available) {
					setStatus(adapter.message);
					return;
				}
				if (state.ua) {
					if (state.connectedMode === "twilio") {
						disconnectTwilio();
					} else {
						disconnectSip();
					}
				} else {
					if (state.fields.provider.value === "twilio") {
						connectTwilio();
					} else {
						connectSip();
					}
				}
			};
			dial.onclick = function () {
				if (state.fields.provider.value === "twilio") {
					dialTwilio();
					return;
				}
				dialSip();
			};
			end.onclick = hangup;
			ringtoneButton.onclick = function () {
				var hidden = ringtoneMenu.classList.toggle("vdo-callin-hidden");
				ringtoneButton.setAttribute("aria-expanded", hidden ? "false" : "true");
			};
			ringtoneSelect.onchange = function () {
				stopRingtone();
				if (ringtoneSelect.value === "silent") {
					state.ringtoneSettings.mode = "silent";
				} else {
					state.ringtoneSettings.mode = "ring";
					state.ringtoneSettings.tone = ringtoneSelect.value;
				}
				ringtoneStatus.textContent = state.ringtoneSettings.tone === "custom" ? state.ringtoneSettings.customName : "";
				saveRingtoneSettings();
			};
			ringtoneVolume.oninput = function () {
				state.ringtoneSettings.volume = parseInt(ringtoneVolume.value, 10) || 0;
				ringtoneVolumeValue.textContent = state.ringtoneSettings.volume + "%";
				if (state.ringtoneAudio) {
					state.ringtoneAudio.volume = state.ringtoneSettings.volume / 100;
				}
				saveRingtoneSettings();
			};
			ringtonePreview.onclick = function () {
				startRingtone(true);
			};
			ringtoneUpload.onclick = function () {
				openRingtoneUpload(ringtoneSelect, customOption, ringtoneStatus);
			};
			rememberPassword.onchange = confirmPasswordStorage;
			saveProfileButton.onclick = saveSipProfile;
			forgetProfileButton.onclick = forgetSipProfile;

			setButtons();
			state.startRingtone = startRingtone;
			state.stopRingtone = stopRingtone;
			updateRingtoneButton();
			enablePanelDrag(panel, head);
			applyStoredPanelPosition(panel);
			provider.onchange();
			if (state.ignoredPasswordParam) {
				setStatus("SIP password URL parameter was ignored and removed from the address bar. Enter the password manually.");
			} else if (savedProfileLoaded && (provider.value === "sip" || provider.value === "signalwire")) {
				setStatus(password.value ? "Loaded saved SIP profile from this browser, including its saved password." : "Loaded saved SIP profile from this browser. Enter the password if required.");
			}
			validateSavedSipPassword();
		}

		session.callin = {
			mode: state.mode,
			element: null,
			remoteStream: null,
			returnStream: null,
			updateMixer: updateMixer,
			rebuildOutboundMix: rebuildOutboundMix,
			applySpeakerMute: applySpeakerMute,
			hangup: hangup,
			stop: stop,
			_state: state
		};

		buildPanel();
		state.unloadHandler = function () {
			if (state.connectedMode === "twilio" && state.twilioData) {
				endTwilioSession(true);
			}
		};
		window.addEventListener("beforeunload", state.unloadHandler);

		if (paramEnabled(["sipauto", "callinauto"])) {
			setTimeout(function () {
				if (state.fields.provider.value === "sip" || state.fields.provider.value === "signalwire") {
					connectSip();
				}
			}, 100);
		}
	}

	window.setupCallIn = setupCallIn;
})();
