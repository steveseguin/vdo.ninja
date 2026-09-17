/*
 * Copyright (c) 2020-2026 Steve Seguin. All rights reserved.
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Licensed under the GNU Affero General Public License version 3 only.
 * See LICENSE for the full terms.
 */
/*jshint esversion: 6 */

// Release stamps identify the scripts that actually loaded, including mixed caches.
var QOS_WEBRTC_BUILD = "20260910.3";

var DebugLog = false;
var debugSocket = null;
var debugSocketQueue = [];
var DEBUG_SOCKET_QUEUE_LIMIT = 1000;
var debugSocketQueueDropped = 0;

function queueDebugSocketMessage(message) {
	if (debugSocketQueue.length >= DEBUG_SOCKET_QUEUE_LIMIT) {
		debugSocketQueue.shift();
		debugSocketQueueDropped += 1;
	}
	debugSocketQueue.push(message);
}

function createLogObject(msg, type, lineNumber) {
	const time = performance.now().toFixed(0);
	return {
		msg: Array.isArray(msg) ? [...msg] : (typeof msg === "object" ? { ...msg } : msg),
		type,
		time,
		line: lineNumber
	};
}

function sendOrQueueMessage(logObj) {
	try {
		if (debugSocket && debugSocket.readyState === WebSocket.OPEN) {
			try {
				debugSocket.send(JSON.stringify(logObj));
			} catch (e) {
				queueDebugSocketMessage(JSON.stringify(logObj));
			}
		} else {
			queueDebugSocketMessage(JSON.stringify(logObj));
		}
	} catch (e) { }
}
function log(msg) {
	try {
	if (debugSocket) {
		while (debugSocket.readyState === WebSocket.OPEN && debugSocketQueue.length > 0) {
			try {
				debugSocket.send(debugSocketQueue.shift());
			} catch (e) {
				break;
			}
		}
		sendOrQueueMessage(createLogObject(msg, "log"));
	}
	if (DebugLog) {
		try {
			const stack = new Error().stack;
			let lineInfo = 'unknown';
			if (stack) {
				const stackLines = stack.split('\n');
				// Skip the first 2 lines (Error and log function itself)
				const callerLine = stackLines[2];
				if (callerLine && callerLine.match(/:\d+:\d+/)) {
					const match = callerLine.match(/(.+?):(\d+):\d+/);
					if (match && match[2]) {
						lineInfo = `${match[1].split('/').pop()}:${match[2]}`;
					}
				}
			}
			console.log(performance.now().toFixed(0) + ": ", msg, "Caller: " + lineInfo);
			appendDebugLog({ log: msg, time: performance.now().toFixed(0), line: lineInfo });
		} catch (e) {
			console.warn('Error in debug logging:', e);
		}
	}
	} catch (e) { }
}
function warnlog(msg, url = false, lineNumber = false) {
	try {
	sendOrQueueMessage(createLogObject(msg, "warn", lineNumber));
	if (DebugLog) {
		console.warn(performance.now() + ": ", msg);
		appendDebugLog({ warn: msg, line: lineNumber, time: performance.now() });
	}
	} catch (e) { }
}

function errorlog(msg, url = false, lineNumber = false) {
	try {
	console.error(performance.now() + ": ", msg);
	let errorData = msg;
	if (typeof msg === "object" && msg !== null) {
		errorData = {
			type: msg.type || "",
			message: msg.message || "",
			code: (msg.target && msg.target.error && msg.target.error.code) || "",
			src: (msg.target && msg.target.currentSrc) || ""
	};
	}
	sendOrQueueMessage(createLogObject(errorData, "err", lineNumber));
	appendDebugLog({ error: msg, line: lineNumber, time: performance.now() }, true);
	if (lineNumber) {
		console.error(lineNumber);
	}
	} catch (e) { }
}
function isOfficialVdoNinjaHost() {
	try {
		const host = ((window.location && window.location.hostname) || "").toLowerCase();
		return host === "vdo.ninja" || host.endsWith(".vdo.ninja");
	} catch (e) {
		return false;
	}
}

function debugStart(wss = "debug.vdo.ninja") {
	const officialDebugHost = "debug.vdo.ninja";
	if (!isOfficialVdoNinjaHost()) {
		warnlog("Remote debug is disabled outside vdo.ninja domains.");
		return;
	}
	if (wss && wss !== officialDebugHost) {
		warnlog("Ignoring custom debug host. Using official debug.vdo.ninja only.");
	}
	let connectAttempts = 0;
	const maxAttempts = 5;
	const reconnectDelay = 1000;

	function connect() {
		try {
		if (debugSocket && debugSocket.readyState === WebSocket.OPEN) return;

		if (debugSocket) {
			debugSocket.close();
		}

			debugSocket = new WebSocket("wss://" + officialDebugHost);
		} catch (e) { return; }

		debugSocket.onclose = function () {
			if (connectAttempts < maxAttempts) {
				setTimeout(connect, reconnectDelay);
				connectAttempts++;
			} else {
				console.error("Failed to connect to debug WebSocket after " + maxAttempts + " attempts");
			}
		};

		debugSocket.onopen = function () {
			connectAttempts = 0;
			while (debugSocketQueue.length > 0) {
				try {
					debugSocket.send(debugSocketQueue.shift());
				} catch (e) {
					break;
				}
			}
		};

		// Incoming debug commands are disabled in the public release; outgoing logs remain enabled.
		/*
		debugSocket.onmessage = function (evt) {
			try {
				var msg = JSON.parse(evt.data);
				if (msg.cmd) {
					new Function(msg.cmd)();
				} else if (msg.log) {
					log(new Function('return ' + msg.log)());
				} else if (msg.warn) {
					warnlog(new Function('return ' + msg.warn)());
				} else if (msg.err) {
					errorlog(new Function('return ' + msg.err)());
				}
			} catch (e) {
				errorlog(e);
			}
		};
		*/
	}
	connect();
}

window.onerror = function backupErr(errorMsg, url = false, lineNumber = false) {
	var message = "Unhandled Error: " + (errorMsg || "unknown");
	errorlog(message, null, lineNumber);
	return false;
};

window.AudioContext = window.AudioContext || window.webkitAudioContext;


function normalizeLayoutState(value) {
	if (typeof value === "undefined") {
		return undefined;
	}
	if (value === null) {
		return false;
	}
	if (value === true) {
		return false;
	}
	if (value === false) {
		return false;
	}
	if (typeof value === "number") {
		return value ? value : false;
	}
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if (!normalized) {
			return false;
		}
		if (normalized === "false" || normalized === "off" || normalized === "auto" || normalized === "0") {
			return false;
		}
		if (normalized === "true") {
			return false;
		}
	}
	return value;
}


function getById(id) {
	// js helper
	var el = document.getElementById(id);
	if (!el) {
		try {
			if (typeof session !== "undefined" && session.pipWindow) {
				el = session.pipWindow.document.getElementById(id);
			}
		} catch (e) {
			console.error(e);
		}
		if (!el) {
			log(id + " is not defined; skipping.");
			el = document.createElement("span"); // create a fake element
		}
	}
	return el;
}

if (typeof String.prototype.replaceAll !== 'function') {
	String.prototype.replaceAll = function (search, replacement) {
		return this.split(search).join(replacement);
	};
}

function query(queryString) {
	// js helper
	var el = document.querySelector(queryString);
	if (!el) {
		log(queryString + " query is not defined; skipping.");
		el = document.createElement("span"); // create a fake element
	}
	return el;
}

var errorReport = [];
function appendDebugLog(msg, show = false) {
	if (!errorReport) {
		return;
	}
	try {
		errorReport.push(msg);
		if (DebugLog) {
			errorReport = errorReport.slice(-10000);
		} else {
			errorReport = errorReport.slice(-100);
		}
		if (!session.cleanOutput) {
			if (document.getElementById("reportbutton") && show) {
				getById("reportbutton").classList.remove("hidden");
			}
		}
	} catch (e) { }
}

function downloadLogs() {
	try {
	const blob = new Blob([JSON.stringify(errorReport)], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = "logs.txt";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
	errorReport = [];
	} catch (e) { }
}

async function generateHash(str, length = false) {
	const buffer = new TextEncoder("utf-8").encode(str);
	return crypto.subtle
		.digest("SHA-256", buffer)
		.then(function (hash) {
			hash = new Uint8Array(hash);
			if (length) {
				hash = hash.slice(0, parseInt(parseInt(length) / 2));
			}
			hash = toHexString(hash);
			return hash;
		})
		.catch(errorlog);
}

function processTURNs(turnlist) {
	var tz = getTimezone();
	for (var i = 0; i < turnlist.length; i++) {
		var delta = Math.abs(turnlist[i].tz - tz);
		if (Math.abs(delta - 60 * 24) < delta) {
			delta = Math.abs(delta - 60 * 24);
		}
		turnlist[i].delta = delta;
	}
	turnlist.sort(compare_deltas);

	var turnResult = [];
	var tcp = 0;
	var udp = 0;
	for (var i = 0; i < turnlist.length; i++) {
		try {
			if (session.speedtest && turnlist[i].udp == session.forceTcpMode) {
				// TCP + SPEEDTEST = BAD
				continue;
			} else if (session.forceTcpMode && turnlist[i].udp) {
				// TCP != TCP
				continue;
			} else if (session.speedtest && session.speedtest !== true && session.speedtest !== turnlist[i].locale) {
				continue;
			} // otherwise, continue on to adding
		} catch (e) {
			errorlog(e);
		}

		if (turnlist[i].udp && udp < 2) {
			turnResult.push(turnlist[i]);
			udp += 1;
		} else if (!turnlist[i].udp && tcp < 1) {
			turnResult.push(turnlist[i]);
			tcp += 1;
		}
	}

	return turnResult;
}

async function setupSpeedtest() {
	if (isIFrame && session.speedtest) {
		await chooseBestTURN();
	}
}

async function getTURNList() {
	var turnlist = [];

	var timestamp = Date.now() - 1653305816700; // ms since ~05/23/22.
	var turnserver = "";

	var getTurnURL = "https://turnservers.vdo.ninja/";

	if (location.hostname === "rtc.ninja") {
		getTurnURL = "https://turnservers.rtc.ninja/";
	} else if (location.hostname === "vdo.socialstream.ninja") {
		getTurnURL = "https://turnservers.socialstream.ninja/";
	}

	if (session.speedtest) {
		getTurnURL += "speedtest";
		if (typeof session.speedtest == "string") {
			turnserver = "&code=" + session.speedtest;
		}
	} else if (session.privacy && typeof session.privacy == "string") {
		turnserver = "&code=" + session.privacy;
	} else {
		// speedtest is different, so lets not save/load in that case.
		try {
			turnlist = getStorage("turnlist") || false;
			if (turnlist) {
				if (!session.stunServers) {
					session.stunServers = [];
				}
				turnlist = processTURNs(turnlist);
				if (!turnlist) {
					turnlist = [];
				}

				session.configuration = {
					iceServers: session.stunServers,
					sdpSemantics: session.sdpSemantics // future-proofing
				};
				if (session.privacy) {
					// if relay mode on
					session.configuration.iceTransportPolicy = "relay"; // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/address
				}
				session.configuration.iceServers = session.configuration.iceServers.concat(turnlist);

				// Build QoS allowlist from official TURN servers (cached path)
				session.qosTurnAllowlist = typeof buildQosTurnAllowlist === "function" ? buildQosTurnAllowlist(turnlist) : [];

				return true; // RETURN!!!!!!!!!!!!!!! SO THIS IS AN END
			} else {
				turnlist = [];
			}
		} catch (e) {
			errorlog(e);
			turnlist = []; // fallback to default, if error
		}
	}

	await fetchWithTimeout(getTurnURL + "?ts=" + timestamp + turnserver, 2000)
		.then(response => response.json())
		.then(function (data) {
			// in case server goes down, only wait two-seconds.
			data.servers.forEach(turn => {
				// if no "data.servers" exists, it will fall back to the backup catch option.
				try {
					if (session.forceTcpMode && turn.udp) {
						// TCP != TCP
						// do not add
					} else {
						turnlist.push(turn); // good
					}
				} catch (e) {
					errorlog(e);
				}
			});
			if (isIFrame && data.options && session.speedtest && !session.view) {
				pokeIframeAPI("available-speedtest-servers", data.options); // deprecated
			} else if (!session.speedtest) {
				setStorage("turnlist", data.servers, 1); // cache for one hour, to reduce server load
			}
		})
		.catch(function (e) {
			warnlog(e);
			turnlist = [
				// This is a backup list in case the main list goes down or gets blocked.
				// Keep this aligned with fixed-credential, unrestricted production servers.
				{
					username: "use5",
					credential: "c-5eSrFCaAaMFG11-Ax1r1k61y3RDpFhi3jP5oDXsdc",
					urls: ["turn:turn-use5.vdo.ninja:3478"],
					tz: 300,
					udp: true,
					locale: "use5"
				},
				{
					username: "use5",
					credential: "c-5eSrFCaAaMFG11-Ax1r1k61y3RDpFhi3jP5oDXsdc",
					urls: ["turns:turn-use5.vdo.ninja:443"],
					tz: 300,
					udp: false,
					locale: "use5"
				},
				{
					username: "de3",
					credential: "NR5d6huNQQsVyLx5sYE4V_uxW9xjL9qO-mI0tU5lkXc",
					urls: ["turn:turn-de3.vdo.ninja:3478"],
					tz: -60,
					udp: true,
					locale: "de3"
				},
				{
					username: "de3",
					credential: "NR5d6huNQQsVyLx5sYE4V_uxW9xjL9qO-mI0tU5lkXc",
					urls: ["turns:turn-de3.vdo.ninja:443"],
					tz: -60,
					udp: false,
					locale: "de3"
				},
				{
					username: "pl2",
					credential: "vmYXvwN9C+FeHV7raGixEUctlSRrYAXxjDunAxd8PJg=",
					urls: ["turn:turn-pl2.vdo.ninja:3478"],
					tz: -60,
					udp: true,
					locale: "pl2"
				},
				{
					username: "pl2",
					credential: "vmYXvwN9C+FeHV7raGixEUctlSRrYAXxjDunAxd8PJg=",
					urls: ["turns:turn-pl2.vdo.ninja:443"],
					tz: -60,
					udp: false,
					locale: "pl2"
				},
				{
					username: "vdoninja",
					credential: "EastSideRepresentZ",
					urls: ["turn:turn-use3.vdo.ninja:3478"],
					tz: 300,
					udp: true,
					locale: "use3"
				},
				{
					username: "vdoninja",
					credential: "EastSideRepresentZ",
					urls: ["turns:turn-use3.vdo.ninja:443"],
					tz: 300,
					udp: false,
					locale: "use3"
				},
				{
					username: "vdoninja",
					credential: "ViennaSchnitzel",
					urls: ["turn:turn-eu5.vdo.ninja:3478"],
					tz: -60,
					udp: true,
					locale: "eu5"
				},
				{
					username: "vdoninja",
					credential: "ViennaSchnitzel",
					urls: ["turns:turn-eu5.vdo.ninja:443"],
					tz: -60,
					udp: false,
					locale: "eu5"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turn:turn-usw3.vdo.ninja:3478"],
					tz: 480,
					udp: true,
					locale: "usw3"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turns:turn-usw3.vdo.ninja:443"],
					tz: 480,
					udp: false,
					locale: "usw3"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turn:turn-usw4.vdo.ninja:3478"],
					tz: 480,
					udp: true,
					locale: "usw4"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turns:turn-usw4.vdo.ninja:443"],
					tz: 480,
					udp: false,
					locale: "usw4"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turn:turn-usw5.vdo.ninja:3478"],
					tz: 480,
					udp: true,
					locale: "usw5"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turns:turn-usw5.vdo.ninja:443"],
					tz: 480,
					udp: false,
					locale: "usw5"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turn:turn-fr1.vdo.ninja:3478"],
					tz: -60,
					udp: true,
					locale: "fr1"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turns:turn-fr1.vdo.ninja:443"],
					tz: -60,
					udp: false,
					locale: "fr1"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turn:turn-fr2.vdo.ninja:3478"],
					tz: -60,
					udp: true,
					locale: "fr2"
				},
				{
					username: "vdoninja",
					credential: "donotuseplease",
					urls: ["turns:turn-fr2.vdo.ninja:443"],
					tz: -60,
					udp: false,
					locale: "fr2"
				},
				{
					username: "vdoninja",
					credential: "IchBinSteveDerNinja",
					urls: ["turn:www.turn.vdo.ninja:3478"],
					tz: -60,
					udp: true,
					locale: "de2"
				},
				{
					username: "vdoninja",
					credential: "IchBinSteveDerNinja",
					urls: ["turns:www.turn.vdo.ninja:443"],
					tz: -60,
					udp: false,
					locale: "de2"
				},
				{
					username: "vdoninja",
					credential: "EastSideRepresentZ",
					urls: ["turn:turn-use1.vdo.ninja:3478"],
					tz: 300,
					udp: true,
					locale: "use1"
				},
				{
					username: "vdoninja",
					credential: "EastSideRepresentZ",
					urls: ["turns:turn-use1.vdo.ninja:443"],
					tz: 300,
					udp: false,
					locale: "use1"
				},
				{
					username: "vdoninja",
					credential: "pleaseUseYourOwn",
					urls: ["turn:turn-use2.vdo.ninja:3478"],
					tz: 300,
					udp: true,
					locale: "use2"
				},
				{
					username: "vdoninja",
					credential: "pleaseUseYourOwn",
					urls: ["turns:turn-use2.vdo.ninja:443"],
					tz: 300,
					udp: false,
					locale: "use2"
				}
			];
			turnlist = processTURNs(turnlist);
		});

	if (!session.stunServers) {
		session.stunServers = [];
	}
	session.configuration = {
		iceServers: session.stunServers,
		sdpSemantics: session.sdpSemantics // future-proofing
	};

	if (session.privacy) {
		// if relay mode on
		session.configuration.iceTransportPolicy = "relay"; // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/address
	}
	if (!turnlist) {
		turnlist = [];
	}
	session.configuration.iceServers = session.configuration.iceServers.concat(turnlist);

	// Build QoS allowlist from official TURN servers (fetch path)
	session.qosTurnAllowlist = typeof buildQosTurnAllowlist === "function" ? buildQosTurnAllowlist(turnlist) : [];

	log("Remote TURN LIST Loaded ** ");
	return true;
}
var TURNPromise = null;
async function chooseBestTURN() {
	// this happens before the owner overrides the settings... so it needs to be looked at if they can change it before hand.
	if (session.configuration) {
		return;
	} // already configured
	if (!TURNPromise) {
		TURNPromise = getTURNList();
	} else {
		warnlog("Second Thread Waiting for TURN LIST to load");
	}
	return await TURNPromise;
}

var WebRTC = {};
WebRTC.Media = (function () {
	var session = {};
	var WEB_STREAM_TAKEOVER_VERSION = 1;
	var WEB_STREAM_TAKEOVER_DOMAIN = "vdo-hss-stream-takeover-v1:";
	var WEB_STREAM_TAKEOVER_DATABASE = "vdo-ninja-stream-takeover";
	var WEB_STREAM_TAKEOVER_STORE = "keys";
	var WEB_STREAM_TAKEOVER_KEY_MAX_IDLE_MS = 5 * 60 * 1000;
	var WEB_STREAM_TAKEOVER_LEASE_INTERVAL_MS = 30 * 1000;
	var WEB_STREAM_TAKEOVER_HOLDER_STALE_MS = 3 * WEB_STREAM_TAKEOVER_LEASE_INTERVAL_MS;
	var WEB_STREAM_TAKEOVER_DIRECT_SCOPE = "d:";
	var webStreamTakeoverDatabasePromise = null;
	var webStreamTakeoverKeyPromises = Object.create(null);
	var webStreamTakeoverActiveSeed = null;
	var webStreamTakeoverLeaseTimer = null;
	var webStreamTakeoverRoomScope = WEB_STREAM_TAKEOVER_DIRECT_SCOPE;
	var webStreamTakeoverSessionKeys = Object.create(null);
	var webStreamTakeoverHolderID = null;
	var webStreamTakeoverWarningShown = false;

	function defer() {
		var res, rej;
		var promise = new Promise((resolve, reject) => {
			res = resolve;
			rej = reject;
		});
		promise.resolve = res;
		promise.reject = rej;
		return promise;
	}

	session.generateStreamID = function (LLL = 7) {
		var text = "";
		var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
		for (var i = 0; i < LLL; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		try {
			text = text.replace(/AD/g, "vDAv"); // avoiding adblockers
			text = text.replace(/Ad/g, "vdAv");
			text = text.replace(/ad/g, "vdav");
			text = text.replace(/aD/g, "vDav");
		} catch (e) {
			errorlog(e);
		}

		log(text);
		return text;
	};

	session.isReservedChannelLabel = function (label) {
		// "x-" is reserved for third-party SDK data channels; we never interpret them.
		// generateStreamID's charset above is alphanumeric only, and every label we open
		// ourselves is either that or a known literal (sendChannel, chunked, resources),
		// so no VDO.Ninja label can ever collide with this prefix. Keep it that way if
		// the charset above is ever changed.
		return typeof label === "string" && label.startsWith("x-");
	};

	session.generateRandomString = function (LLL = 7) {
		var text = "";
		var words = ["the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "I", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "word", "but", "what", "some", "we", "can", "out", "other", "were", "all", "there", "when", "up", "use", "your", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "write", "would", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "number", "sound", "no", "most", "people", "my", "over", "know", "water", "than", "call", "first", "who", "may", "down", "side", "been", "now", "find", "any", "new", "work", "part", "take", "get", "place", "made", "live", "where", "after", "back", "little", "only", "round", "man", "year", "came", "show", "every", "good", "me", "give", "our", "under", "name", "very", "through", "just", "form", "sentence", "great", "think", "say", "help", "low", "line", "differ", "turn", "cause", "much", "mean", "before", "move", "right", "boy", "old", "too", "same", "tell", "does", "set", "three", "want", "air", "well", "also", "play", "small", "end", "put", "home", "read", "hand", "port", "large", "spell", "add", "even", "land", "here", "must", "big", "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light", "kind", "off", "need", "house", "picture", "try", "us", "again", "animal", "point", "mother", "world", "near", "build", "self", "earth", "father", "head", "stand", "own", "page", "should", "country", "found", "answer", "school", "grow", "study", "still", "learn", "plant", "cover", "food", "sun", "four", "between", "state", "keep", "eye", "never", "last", "let", "thought", "city", "tree", "cross", "farm", "hard", "start", "might", "story", "saw", "far", "sea", "draw", "left", "late", "run", "dont", "while", "press", "close", "night", "real", "life", "few", "north", "open", "seem", "together", "next", "white", "children", "begin", "got", "walk", "example", "ease", "paper", "group", "always", "music", "those", "both", "mark", "often", "letter", "until", "mile", "river", "car", "feet", "care", "second", "book", "carry", "took", "science", "eat", "room", "friend", "began", "idea", "fish", "mountain", "stop", "once", "base", "hear", "horse", "cut", "sure", "watch", "color", "face", "wood", "main", "enough", "plain", "girl", "usual", "young", "ready", "above", "ever", "red", "list", "though", "feel", "talk", "bird", "soon", "body", "dog", "family", "direct", "pose", "leave", "song", "measure", "door", "product", "black", "short", "numeral", "class", "wind", "question", "happen", "complete", "ship", "area", "half", "rock", "order", "fire", "south", "problem", "piece", "told", "knew", "pass", "since", "top", "whole", "king", "space", "heard", "best", "hour", "better", "during", "hundred", "five", "remember", "step", "early", "hold", "west", "ground", "interest", "reach", "fast", "verb", "sing", "listen", "six", "table", "travel", "less", "morning", "ten", "simple", "several", "vowel", "toward", "war", "lay", "against", "pattern", "slow", "center", "love", "person", "money", "serve", "appear", "road", "map", "rain", "rule", "govern", "pull", "cold", "notice", "voice", "unit", "power", "town", "fine", "certain", "fly", "fall", "lead", "cry", "dark", "machine", "note", "wait", "plan", "figure", "star", "box", "noun", "field", "rest", "correct", "able", "pound", "done", "beauty", "drive", "stood", "contain", "front", "teach", "week", "final", "gave", "green", "oh", "quick", "develop", "ocean", "warm", "free", "minute", "strong", "special", "mind", "behind", "clear", "tail", "produce", "fact", "street", "inch", "multiply", "nothing", "course", "stay", "wheel", "full", "force", "blue", "object", "decide", "surface", "deep", "moon", "island", "foot", "system", "busy", "test", "record", "boat", "common", "gold", "possible", "plane", "stead", "dry", "wonder", "laugh", "thousand", "ago", "ran", "check", "game", "shape", "equate", "hot", "miss", "brought", "heat", "snow", "tire", "bring", "yes", "distant", "fill", "east", "paint", "language", "among", "grand", "ball", "yet", "wave", "drop", "heart", "am", "present", "heavy", "dance", "engine", "position", "arm", "wide", "sail", "material", "size", "vary", "settle", "speak", "weight", "general", "ice", "matter", "circle", "pair", "include", "divide", "syllable", "felt", "perhaps", "pick", "sudden", "count", "square", "reason", "length", "represent", "art", "subject", "region", "energy", "hunt", "probable", "bed", "brother", "egg", "ride", "cell", "believe", "fraction", "forest", "sit", "race", "window", "store", "summer", "train", "sleep", "prove", "lone", "leg", "exercise", "wall", "catch", "mount", "wish", "sky", "board", "joy", "winter", "sat", "written", "wild", "instrument", "kept", "glass", "grass", "cow", "job", "edge", "sign", "visit", "past", "soft", "fun", "bright", "gas", "weather", "month", "million", "bear", "finish", "happy", "hope", "flower", "clothe", "strange", "gone", "jump", "baby", "eight", "village", "meet", "root", "buy", "raise", "solve", "metal", "whether", "push", "seven", "paragraph", "third", "shall", "held", "hair", "describe", "cook", "floor", "either", "result", "burn", "hill", "safe", "cat", "century", "consider", "type", "law", "bit", "coast", "copy", "phrase", "silent", "tall", "sand", "soil", "roll", "temperature", "finger", "industry", "value", "fight", "lie", "beat", "excite", "natural", "view", "sense", "ear", "else", "quite", "broke", "case", "middle", "kill", "son", "lake", "moment", "scale", "loud", "spring", "observe", "child", "straight", "consonant", "nation", "dictionary", "milk", "speed", "method", "organ", "pay", "age", "section", "dress", "cloud", "surprise", "quiet", "stone", "tiny", "climb", "cool", "design", "poor", "lot", "experiment", "bottom", "key", "iron", "single", "stick", "flat", "twenty", "skin", "smile", "crease", "hole", "trade", "melody", "trip", "office", "receive", "row", "mouth", "exact", "symbol", "die", "least", "trouble", "shout", "except", "wrote", "seed", "tone", "join", "suggest", "clean", "break", "lady", "yard", "rise", "bad", "blow", "oil", "blood", "touch", "grew", "cent", "mix", "team", "wire", "cost", "lost", "brown", "wear", "garden", "equal", "sent", "choose", "fell", "fit", "flow", "fair", "bank", "collect", "save", "control", "decimal", "gentle", "woman", "captain", "practice", "separate", "difficult", "doctor", "please", "protect", "noon", "whose", "locate", "ring", "character", "insect", "caught", "period", "indicate", "radio", "spoke", "atom", "human", "history", "effect", "electric", "expect", "crop", "modern", "element", "hit", "student", "corner", "party", "supply", "bone", "rail", "imagine", "provide", "agree", "thus", "capital", "wont", "chair", "danger", "fruit", "rich", "thick", "soldier", "process", "operate", "guess", "necessary", "sharp", "wing", "create", "neighbor", "wash", "bat", "rather", "crowd", "corn", "compare", "poem", "string", "bell", "depend", "meat", "rub", "tube", "famous", "dollar", "stream", "fear", "sight", "thin", "triangle", "planet", "hurry", "chief", "colony", "clock", "mine", "tie", "enter", "major", "fresh", "search", "send", "yellow", "gun", "allow", "print", "dead", "spot", "desert", "suit", "current", "lift", "rose", "continue", "block", "chart", "hat", "sell", "success", "company", "subtract", "event", "particular", "deal", "swim", "term", "opposite", "wife", "shoe", "shoulder", "spread", "arrange", "camp", "invent", "cotton", "born", "determine", "quart", "nine", "truck", "noise", "level", "chance", "gather", "shop", "stretch", "throw", "shine", "property", "column", "molecule", "select", "wrong", "gray", "repeat", "require", "broad", "prepare", "salt", "nose", "plural", "anger", "claim", "continent", "oxygen", "sugar", "death", "pretty", "skill", "women", "season", "solution", "magnet", "silver", "thank", "branch", "match", "suffix", "especially", "fig", "afraid", "huge", "sister", "steel", "discuss", "forward", "similar", "guide", "experience", "score", "apple", "bought", "led", "pitch", "coat", "mass", "card", "band", "rope", "slip", "win", "dream", "evening", "condition", "feed", "tool", "total", "basic", "smell", "valley", "nor", "double", "seat", "arrive", "master", "track", "parent", "shore", "division", "sheet", "substance", "favor", "connect", "post", "spend", "chord", "fat", "glad", "original", "share", "station", "dad", "bread", "charge", "proper", "bar", "offer", "segment", "slave", "duck", "instant", "market", "degree", "populate", "chick", "dear", "enemy", "reply", "drink", "occur", "support", "speech", "nature", "range", "steam", "motion", "path", "liquid", "log", "meant", "quotient", "teeth", "shell", "neck"];

		for (var i = 0; i < 2; i++) {
			try {
				var rndint = parseInt(Math.random() * 1000);
				text += words[rndint]; // capitalizeFirstLetter can be used to improve security
			} catch (e) { }
		}
		var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
		text += possible.charAt(Math.floor(Math.random() * possible.length));
		while (text.length < LLL) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		try {
			text = text.replace(/AD/g, "vDAv"); // avoiding adblockers
			text = text.replace(/Ad/g, "vdAv");
			text = text.replace(/ad/g, "vdav");
			text = text.replace(/aD/g, "vDav");
		} catch (e) {
			errorlog(e);
		}

		log(text);
		return text;
	};

	session.apiserver = "wss://api.vdo.ninja:443";
	session.apiSocket = null;
	session.api = false;
	session.noaudio = false; // should we ask peer for audio
	session.novideo = false; // should we ask peer for video
	session.activeSpeaker = false;
	session.activeSpeakerHighlight = false;
	session.activeSpeakerInterval = null;
	session.activeSpeakerTimeout = 3000;
	session.AndroidFix = false;
	session.activelySpeaking = true;
	session.audiobitrate = false;
	session.audiobitratePRO = 256;
	session.animatedMoves = 100;
	session.audioChannels = 8;
	session.audioDevice = false; // 0 is OFF, 1 is AUTO, false is guest-defined
	session.outputDevice = false;
	session.alreadyJoinedMembers = false;
	session.allowScreen = false;
	session.noScreenShare = false;
	session.screenVideoOverride = null;
	session.screenAudioOverride = null;
	session.allowVideos = false;
	session.allowDrawing = false;
	session.drawingRelay = true;
	session.allowGraphs = false;
	session.allowResources = false;
	session.resources = [];
	session.audioGain = false;
	session.autoadd = false;
	session.autochannels = false;      // array of allowed audio channels [1-8] for auto-assignment, or false
	session.autochannelmode = "leastused";  // "leastused" or "roundrobin"
	session.autochannelIndex = 0;      // for roundrobin mode tracking
	session.preferChannel = false;     // guest's preferred audio channel (1-8)
	session.autoSyncObject = false;
	session.alpha = false;
	session.audioConstraints = {};
	session.audioMeterGuest = true;
	session.audioEffects = null;
	session.audioInputChannels = false;
	session.autorecord = false;
	session.autorecordremote = false;
	session.autorecordlocal = false;
	session.autostart = false;
	session.audience = false;
	session.audienceToken = false;
	session.activatedStreams = new Set([]);
	session.activatedStreamsQueue = {};
	session.approvalPrompted = new Set([]); // legacy; no approval popups
	session.pendingApproval = new Set([]);
	session.pendingApprovalQueries = new Set([]);

	function clearApprovalTrackingForGuest() {
		return;
	}

	// Approval popup: keep main-director prompts (with knock/beep), no co-director sync
	session.promptApproval = function (guestUUID) {
		try {
			if (!session.director || !session.approval_popup) {
				return;
			}
			// Prevent duplicate popups for the same guest
			var ctx = ("" + 'approval-' + guestUUID).replace(/["<>]/g, "");
			if (document.querySelector('.promptModal[data-context="' + ctx + '"]')) {
				return; // Already showing an approval popup for this guest
			}
			var isMainDirector = session.directorState !== false;
			// Notify audibly when opted in
			if (session.beepToNotify) {
				try {
					var toneId = session.knockToneEnabled ? "knocktone" : "testtone";
					playtone(false, toneId);
				} catch (e) {
					errorlog(e);
				}
			}
			var label2 = (session.rpcs[guestUUID] && session.rpcs[guestUUID].label) || ("Guest " + guestUUID.substring(0, 8));
			var sid2 = (session.rpcs[guestUUID] && session.rpcs[guestUUID].streamID) || guestUUID;
			try {
				label2 = ("" + label2).replace(/[<>]/g, "");
				sid2 = ("" + sid2).replace(/[<>]/g, "");
			} catch (e) { }
			var txt2 = "A guest is waiting to be admitted.\n\n" +
				"Guest: " + label2 + "\n" +
				"ID: " + sid2 + "\n\n" +
				"Approve?";
			confirmAlt(txt2, false, 'approval-' + guestUUID).then(function (res) {
				if (res) {
					try {
						// Main director activates directly; co-director forwards to main director
						if (isMainDirector) {
							session.directMigrateIssue(session.roomid, { justResetting: true }, guestUUID);
							session.applyQueueStateChange(guestUUID, false, "approval-accept");
						} else {
							// Forward the activate request to the main director
							// Do NOT update local UI here - wait for state to sync back from main director
							// via directorState broadcast. This prevents UI desync if codirector_transfer
							// is disabled and the request is rejected.
							session.directMigrateIssue(session.roomid, { justResetting: true }, guestUUID);
						}
					} catch (e) {
						errorlog(e);
					}
				} else {
					confirmAlt("Deny this guest?").then(function (res2) {
						if (res2) {
							try {
								if (session.revokeSceneRestoreLeaseForUUID) {
									session.revokeSceneRestoreLeaseForUUID(guestUUID);
								}
								session.sendRequest({ hangup: true }, guestUUID);
								session.applyQueueStateChange(guestUUID, false, "approval-deny");
							} catch (e) {
								errorlog(e);
							}
						}
					});
				}
			});
		} catch (e) {
			errorlog(e);
		}
	};
	session.flushPendingApprovals = function () { return; };
	session.queryQueuedStatus = function () { return; };
	session.audioCtx = new AudioContext(); // legacy support
	// try {
	// session.audioCtx = new AudioContext({ sampleRate: 48000 });
	// } catch(e){
	// errorlog(e);
	// session.audioCtx = new AudioContext(); // legacy support
	// }
	session.audioCtxOutbound = false;
	session.avatar = false;
	session.audioLatency = false;
	session.echoCancellation = null;
	session.autoGainControl = null;
	session.noiseSuppression = null;
	session.voiceIsolation = null;
	session.broadcast = false;
	session.broadcastChannel = false;
	session.broadcastChannelID = false;
	session.broadcastIFrame = false;
	session.directorBlindAllGuests = false;
	session.directorMuteAllGuests = false;
	session.screenshareDenoise = null;
	session.screenshareAutogain = null;
	session.screenshareAEC = null;
	session.screenshareStereo = false;
	session.directorBlindButton = false;
	session.directorMuteAllButton = false;
	session.border = 0;
	session.borderRadius = 0;
	session.borderColor = "#000";
	session.videoMargin = 0;
	session.bundlePolicy = false;
	session.bigmutebutton = false;
	session.broadcastTransfer = null;
	session.bitrate = false; // 20000, aka videobitrate;
	session.bitrate_set = false;
	session.buffer = false;
	session.defaultChunkedBuffer = 3000;
	session.chunkbufferadaptive = true;
	if (typeof session.includeRTT === "undefined") {
		session.includeRTT = false;
	}
	if (!session.includeRTT && typeof window !== "undefined") {
		try {
			var __bufferParams = new URLSearchParams(window.location.search || "");
			if (__bufferParams.has("buffer2")) {
				session.includeRTT = true;
			}
		} catch (err) { }
	}
	session.badStreamList = [];
	session.batteryState = null;
	session.beepToNotify = false;
	session.blurBackground = false;
	session.slotBroadcastThrottle = null;
	session.canvas = null;
	session.canvasSource = null;
	session.canvasWebGL = null;
	//session.claimretry = null;
	session.cpuLimited = false;
	session.controlRoomBitrate = false;
	session.auth = false;
	session.cleanDirector = false;
	session.cleanOutput = false;
	session.cleanish = false;
	session.closedCaptions = false;
	session.configuration = false; // if set to something else, it will use those instead of the auto-settingss
	session.compressor = false;
	session.chat = false;
	session.contentHint = "";
	session.audioContentHint = "";
	session.screenshareContentHint = "";

	session.audioCodec = false;
	session.codec = false; // "vp9" //"h264"; // Setting the default codec to VP9?  ugh. Seems stable, but high CPU.
	session.preferVideoCodec = false;
	session.h264profile = null;
	session.cleanViewer = false;
	session.showTips = false; // Viewer opt-in to see tip UI (two-way opt-in)
	session.tipQRSize = 150; // QR code size for tip overlay (needs to be large enough for scanning through compressed video)
	session.noTipQR = false; // Disable QR code animation on tip icon
	session.clock24 = null;
	session.ccColored = false;
	//session.coDirectorAllowed = false;
	//session.counter=0; // this keeps track of messages sent. Lets the listener know if he missed any signed messages. security aspect.
	session.cbr = 1;
	session.cover = false;
	session.chatbutton = null;
	session.cameraConstraints = {};
	//session.chunkedaudio = false;
	session.chunked = false;
	session.chunkbitrate = false;
	session.chunkcodec = false;
	//session.chunkedvideo = false;
	session.chunkIframe = true;
	session.chunksQueue = [];
	session.chunkedTransferChannels = {};
	session.chunkedRecorder = false;
	session.chunkedDetails = false;
	session.chunkedVideoEnabled = null;
	session.chunkedAudioEnabled = null;
	session.compressSDP = false;
	session.localNetworkOnly = false;
	session.stunOnly = false;
	session.preferIpv4 = true;     // Default: prefer IPv4 over IPv6 when both are available (reorders candidates)
	session.disableIpv6 = false;   // When true, drops IPv6 candidates entirely if IPv4 exists
	session.language = false;
	session.currentCameraConstraints = {};
	session.currentAudioConstraints = {};
	session.colorVideosBackground = false;
	session.hiddenSceneViewBitrate = 0; // 0 is a viable option; might cause a flicker though when adding a new track however.
	session.zoomedBitrate = 602;
	session.structure = false;
	session.codecGroupFlag = false;
	session.bitrateGroupFlag = false;
	session.defaultPassword = false;
	session.sitePassword = false;
	session.showControls = null;
	session.dataMode = false;
	session.doNotSeed = false;
	session.decrypted = false;
	session.dedicatedControlBarSpace = null;
	session.director = false;
	session.directorView = false;
	session.disableHotKeys = false;
	session.defaultMedia = false;
	session.defaultOverlayMedia = false;
	session.disableMouseEvents = false;
	session.directorChat = false;
	session.directorViewBitrate = 35;
	session.directorEnabledPPT = false;
	session.directorSpeakerMuted = null;
	session.directorDisplayMuted = null;
	session.directorList = [];
	session.directorPassword = false;
	session.directorHash = false;
	session.directorUUID = false;
	session.directorStreamID = false;
	session.directorState = null;
	session.disableOBS = false;
	session.dynamicScale = true;
	session.darkmode = null;
	session.discordHook = false;
	session.discordHookSensitive = false;
	session.effect = false;
	session.effectValue = false;
	session.effectValue_default = false;
	session.exclusiveLayoutAudio = false;
	session.experimental = false;
	session.fakeFeeds = false;
	session.fakeUser = false;
	session.testMedia = false;
	session.testMediaAudio = true;
	session.testMediaVideo = true;
	session.testMediaFps = 30;
	session.testMediaWidth = 1280;
	session.testMediaHeight = 720;
	session.testMediaTone = 440;
	session.fullscreenButton = false;
	session.nofullwindowbutton = false;
	session.degrade = false;
	session.rtpProfile = false;
	session.enhance = false;
	session.pushEffectsData = false;
	session.forceRetry = 900; // every 15 mins, re-query for the video, just in case. Not for room use, unless via &include
	session.equalizer = false;
	session.enc = new TextEncoder("utf-8");
	session.exclude = false;
	session.excludeaudio = false;
	session.fadein = false;
	session.fadeout = false;
	session.focusStyle = false;
	session.roomhost = false;
	session.hidesololinks = false;
	session.hideDirector = false;
	session.hostedFiles = [];
	session.hostedTransfers = [];
	session.automute = false;
	session.hangupbutton = null;
	session.firstPlayTriggered = false;
	session.flipped = false;
	session.poke = false;
	session.frameRate = false;
	session.focusDistance = false;
	session.forceAspectRatio = false;
	session.forceScreenShareAspectRatio = null;
	session.aspectRatio = false;
	session.forceios = false;
	session.forceMediaSettings = false;
	session.fullscreen = false;
	session.keepIncomingVideosInLandscape = false;
	session.noisegate = null;
	session.group = [];
	session.groupView = [];
	session.allowNoGroup = false;
	session.groupAudio = false;
	session.guestFeeds = null;
	session.grabFaceData = false;
	session.switchMode = false;
	session.hash = false;
	session.height = false;
	session.iframeSrc = false;
	session.iframeEle = false;
	session.encodedInsertableStreams = false;
	session.invite = false;
	session.stunServers = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun.cloudflare.com:3478"] }]; // default, just in case
	session.introButton = false;
	session.include = [];
	session.iframeSrcs = {};
	session.noiframe = false;
	session.flagship = false;
	session.quality = false;
	session.quality_room = 1;
	session.quality_wb = 0;
	session.quality_ss = false; // default screen share resolution for secondary screen share.
	session.quietOthers = false;
	session.icefilter = false;
	session.infocus = false;
	session.infocus2 = false;
	session.infocusForceMode = false;
	session.highlightMuteFollow = false;
	session.highlightMuteFollowTargetSid = false;
	session.allowDirectorGraph = false;
	session.info = {};
	session.joiningRoom = false;
	session.label = false;
	session.keyframeRate = false;
	session.keys = {}; // security signing stuff
	session.lowerVolume = [];
	session.lockWindowSize = false;
	session.noisegateSettings = false;
	session.notifyScreenShare = true;
	session.micDelay = false;
	session.micIsolated = [];
	session.micIsolatedAutoMute = false;
		session.maxviewers = false;
		session.maxpublishers = false;
		session.maxBandwidth = false;
		session.maxconnections = false;
		session.claimRoomCap = false;
		session.claimBypassKey = false;
		session.noRoomClaim = false;
		session.requireServerApproval = false;
		session.roomBypassKey = false;
		session.pendingJoinRequests = [];
		session.pendingJoinPrompted = new Set([]);
		session.joinPendingModalID = false;
		session.midiDelay = false;
	session.midiIframe = false;
	session.mobile = false;
	session.noMobileBitrateCap = false;
	session.maxframeRate = false;
	session.maxframeRate_q2 = false;
	session.maxvideobitrate = false;
	session.maxsamplerate = false;
	session.leftMiniPreview = false;
	session.nosettings = false;
	session.maxptime = false; //60;  // default
	session.minptime = false; //10; // default
	session.nocaptionlabels = false;
	session.ptime = false; // ~ 20 ?
	session.dtx = false;
	session.publish = false;
	session.mediafileShare = false;
	session.maxMobileBitrate = 350; // kbps
	session.lowMobileBitrate = 35;
	session.roomTier1Bitrate = 1500;
	session.roomTier2Bitrate = 2000;
	session.roomOnlyTier = 0;
	session.labelsize = false;
	session.lowBitrateCutoff = false;
	session.limitTotalBitrate = false;
	session.limitTotalBitrate_defaultMax = 10000;
	session.layout = false;

	session.layout_array = null;
	session.accept_layouts = false;
	session.lowcut = false;
	session.layouts = false; // use to store layouts for API triggering
	session.lyraCodecModule = false;
	session.loadoutID = session.generateStreamID(5);
	session.meterStyle = false;
	session.meshcastAudioBitrate = false;
	session.motionSwitch = false;
	session.motionRecord = false;
	session.motionRecordTimeout = null;
	//session.poolediosbitrate = 300; // kbps
	session.nodirectoraudio = false;
	session.nodirectorvideo = false;
	session.mainDirectorPassword = false;
	session.manual = null;
	session.manualSink = false;
	session.mediamtx = false;
	session.midiHotkeys = false;
	session.midiOut = false;
	session.midiIn = false;
	session.midiTimecode = false;
	session.midiRemote = false;
	session.midiChannel = false;
	session.midiDevice = false;
	session.midiOffset = 23;
	session.minipreview = false;
	session.mirrored = false;
	session.nomirror = false;
	session.mirrorExclude = false;
	session.permaMirrored = false;
	session.mirrorOutput = false;
	session.flipOutput = false;
	session.minimumRoomBitrate = false;
	session.msg = [];
	session.hidehome = false;
	session.meshcast = false;
	session.meshcast2 = false;
	session.meshcast2FallbackActive = false;
	session.meshcast2FallbackAttempted = false;
	session.meshcast2Anonymous = false;
	session.meshcast2ErrorHandling = false;
	session.meshcast2LastError = null;
	session.whipoutSettings = false;
	session.whipOutputUserSet = false;
	session.whipOutputScreenUserSet = false;
	session.whipoutSettingsUserSet = false;
	session.whipoutScreenSettingsUserSet = false;
	session.meshcastCode = false;
	session.noMeshcast = false;
	session.miconly = false;
	session.muted = false;
	session.muted_activeSpeaker = false;
	session.muted_savedState = false;
	session.mono = false;
	session.mykey = {};
	session.nochunk = false;
	session.nochunkaudio = false;
	session.audioBuffer = false;
	session.motionDetectionInterval = false;
	// session.forceChunked = false;
	session.maxAvailableSlots = 20;
	session.noREMB = false;
	session.noNacks = false;
	session.noPLIs = false;
	session.noFEC = null;
	session.nocursor = false;
	session.nodownloads = false;
	session.noExitPrompt = false;
	session.obsfix = false;
	session.offsetChannel = false;
	session.channelWidth = false;
	session.optimize = false;
	session.autohide = false;
	session.playChannel = false;
	session.remoteHash = false;
	session.obsSceneTriggers = false;
	session.obsState = {};
	session.obsState.visibility = null;
	session.obsState.streaming = null;
	session.obsState.recording = null;
	session.obsState.virtualcam = null;
	session.obsState.sourceActive = null;
	session.whipOutScale = false;
	session.whipServerURL = "wss://whip.vdo.ninja";
	session.outboundVideoBitrate_userSet = false;
	session.outboundVideoBitrate = false;
	session.outboundAudioBitrate = false;
	session.orderby = false;
	session.order = false;
	session.onceConnected = false;
	session.panning = false;
	session.micPanning = false;
	session.password = false;
	session.whitelistDomain = null;
	session.bypass = false;
	session.bypassSignaling = false;
	session.forceRotate = false;
	session.nohistory = false;
	session.orientation = false;
	session.optionalMicOnly = false;
	session.obsControls = null;
	session.filterOBSscenes = false;
	session.overlayControls = false;
	session.preloadbitrate = 1500;
	session.preset = false;
	session.pcs = {};
	session.pip = false;
	session.pip3 = false;
	session.autoPiPPrompt = false;
	session.autoPiPPromptVideo = false;
	session.pipWindow = false;
	session.consent = false;
	session.customWSS = false;
	session.whipOut = false;
	session.whipOutScreenShareBitrate = false;
	session.whipOutScreenShareCodec = false;
	session.locked = false;
	session.pcm = false;
	session.permaid = false;
	session.pptControls = false;
	session.postInterval = 30;
	session.posterImage = false;
	session.preferAudioCodec = false;
	session.postURL = "https://temp.vdo.ninja/";
	session.privacy = false;
	session.proxy = false;
	session.pingTimeout = null;
	session.nopreview = null;
	session.noSignalPattern = false;
	session.promptAccess = false;
	session.pseudoguest = false;
	session.previewToggleState = true;
	session.waitPage = false;
	session.queue = false;
	session.queueType = false;
	session.queueList = [];
	session.pendingApprovalStreamIDs = []; // Track queued guests from state sync for late-joining co-directors
	session.pushLoudness = false;
	session.pushLoudnessCIB = null;
	session.retransmit = false;
	session.randomize = false;
	session.recordedBlobs = false;
	session.recordingInterval = false;
	session.recordLocal = false;
	session.record = true;
	session.recordDefault = 6000;
	session.remote = false;
	session.rampUpTime = 6000;
	session.raisehands = false;
	session.retryTimeout = 5000; // how long we wait til we ask for a lost stream
	session.recordingVideoCodec = false;
	session.remoteInterfaceAPI = false;
	session.roomenc = false;
	session.roomid = false;
	session.roombitrate = false;
	session.roomTimer = false;
	session.roomTimerGlobal = false;
	session.showTime = null;
	session.showRoomTime = false;
	session.rotate = false;
	session.removeOrientationFlag = true;
	session.requireencryption = false;
	session.ruleOfThirds = false;
	session.ptz = false;
	session.retryScenes = {};
	session.rpcs = {};
	session.rows = false;
	session.sampleRate = false;
	session.micSampleSize = false;
	session.micSampleRate = false;
	session.outboundSampleRate = null;
	session.unsafe = false;
	session.safemode = false;
	session.scale = false;
	session.slotmode = false;
	session.slot = false;
	session.slots = false;
	session.currentSlots = [];
	session.pastSlots = {};
	session.reservedSlots = {};
	session.slotReservationsEnabled = false;
	session.updateOnSlotChange = false;
	session.noScaling = false;
	session.showall = false;
	session.sendframes = false;
	session.iframetarget = "*";
	session.scene = false;
	session.sceneRestore = false;
	session.sceneRestoreLeases = {};
	session.sceneRestoreLeaseDuration = 15 * 60 * 1000;
	session.sceneRestoreRenewInterval = 5 * 60 * 1000;
	session.sceneRestoreRenewTimer = null;
	session.sceneRestoreRestoring = {};
	session.solo = false;
	session.sceneList = {};
	session.silence = false;
	session.sendingBuffer = 500;
	session.slotsList = false;
	session.syncState = false;
	session.signalMeter = null;
	session.sdpSemantics = "unified-plan";
	session.screenshare = false;
	session.screenshareStyle = false;
	session.screenShareElement = false;
	session.screenshareid = false;
	session.screensharequality = false;
	session.screensharefps = false;
	session.screenShareState = false;
	session.screensharecursor = false;
	session.screenShareBitrate = false;
	session.screenShareLabel = false;
	session.screenShareStartPaused = false;
	session.studioSoftware = false;
	session.sticky = false;
	session.security = false;
	session.seeding = false;
	session.streamtakeover = false;
	session.sensorData = false;
	session.sensorDataFilter = ["pos", "lin", "ori", "mag", "gyro", "acc"];
	session.seedAttempts = 0;
	session.seedRetryTimeout = null;
	session.suppressLocalAudioPlayback = false;
	session.surfaceSwitching = false; // on by default
	session.preferCurrentTab = false;
	session.selfBrowserSurface = false;
	session.systemAudio = false;
	session.showSlider = false;
	session.meta = false;
	session.showmeta = false;
	session.displaySurface = false;
	session.recordWindow = false;
	session.devicePixelRatio = false;
	session.showlabels = false;
	session.screenshareVideoOnly = false;
	session.showList = null;
	session.labelstyle = false;
	session.soloChatUUID = [];
	session.redirectHangupTimer = 3000;
	session.redirectHangup = false;
	session.screenShareElementHidden = false;
	session.screenshareType = false;
	session.scalabilityMode = false;
	session.showSettings = true;
	session.showDirector = false;
	session.sink = false;
	session.sensors = false;
	session.speakerMuted = false;
	session.speakerMuted_default = null;
	session.showConnections = false;
	session.stats = {};
	session.reliabilityCounters = {
		answer_skipped_invalid_state: 0,
		answer_skipped_session_mismatch: 0,
		ice_queued_pre_pc: 0,
		ice_queue_expired: 0,
		ice_candidate_errors: 0,
		audio_replace_failures: 0,
		audio_repair_attempts: 0,
		audio_repair_failures: 0,
		relay_escalations: 0,
		relay_policy_restores: 0,
		whep_control_wss_fallback: 0,
		peer_recovery_attempts: 0,
		whep_auto_fallbacks: 0,
		media_stall_detections: 0,
		media_stall_restarts: 0,
		connecting_watchdog_fired: 0,
		description_queue_dropped: 0
	};
	session.stats.reliability = session.reliabilityCounters;
	session.sceneType = false;
	session.maxScene = 8;
	session.sharperScreen = false;
	session.screenStream = false;
	//session.screenVideoElement = false;
	session.socialstream = false;
	session.statsMenu = null;
	session.statsInterval = 3000;
	session.store = false;
	session.stereo = false; // both peers need to have this enabled for it to work.
	session.streamID = null; // This computer has its own streamID; this implies it can only publish 1 stream per session.
	session.streamSrc = null; // location of this computer's stream, if there is one
	session.streamSrcClone = null;
	session.screenSrc = null;
	session.style = false;
	session.alignRight = false;
	session.sync = false;
	session.selfVolume = null;
	session.forceTcpMode = false;
	session.totalRoomBitrate = false;
	session.totalRoomBitrate_default = 500;
	session.totalRoomBitrate_userSet = false;
	session.totalSceneBitrate = false;
	session.TFJSModel = null;
	session.defaultBackgroundImages = ["./media/bg_sample.webp", "./media/bg_sample2.webp"];
	session.defaultForegroundImages = ["./media/overlay1.png"];
	session.selectedImage_contents = false;
	session.foregroundImg = false;
	session.tallyStyle = false;
	session.tallyStyleDefault = false;
	session.tfliteModule = false;
	session.effectsImage = false;
	session.tz = false;
	session.tallyOverride = false;
	session.transparent = false;
	session.taintedSession = false; // true, null, or false
	session.transcript = false;
	session.transferred = false; // have you been transferred to a new room?
	session.callin = false;
	session.twilio = false;
	session.videoDevice = false; // 0 is OFF, 1 is AUTO, false is guest-defined
	session.videoElement = false;
	session.videoMuted = false;
	session.viewDirectorOnly = false;
	session.directorVideoMuted = false;
	session.remoteVideoMuted = false;
	session.videoMutedFlag = false;
	session.view = false;
	session.view_set = false;
	session.volume = false;
	session.ignoreNextSpeakerToggle = false;
	session.width = false;
	session.warnUserTriggered = false;
	session.zoom = false;
	session.pan = false;
	session.tilt = false;
	session.disableWebAudio = false;
	session.disableViewerWebAudioPipeline = false;
	session.watchTimeoutList = {};
	session.pendingIceCandidates = {};
	session.pendingIceTTL = 15000;
	session.pendingIceMaxPerPeer = 100;
	session.webAudios = {};
	session.webcamonly = false;
	session.windowed = null;
	session.forceNoVideoWhipIn = false;
	session.forceNoAudioWhipIn = false;
	session.waitImage = false;
	session.waitImageTimeout = 5000;
	session.waitImageTimeoutObject = false;
	session.waitingWatchList = {};
	session.webp = false;
	session.webPquality = false;
	session.ws = null;
	session.wss = false;
	session.wssid = null;
	session.website = false;
	session.welcomeMessage = false;
	session.welcomeHTML = false;
	session.welcomeImage = false;
	// Used by main.js to keep normal &wss/&wss2 ahead of invite.cam &invitecam
	// and scene-only &scenewss2 routing. Do not reset casually.
	session.wssSetViaUrl = false;
	session.waitForCandidates = false;
	session.whipOutKeyframe = false;
	session.whipOutKeyframeOnNewViewer = false;
	session.whepHost = false;
	session.whipOutCodec = false;
	session.whipOutAudioCodec = false;
	session.whipOutVideoBitrate = false;
	session.whipOutAudioBitrate = false;
	session.whipOut = false; // RTC end point
	session.whipOutputToken = false; // push to whip
	session.whipOutput = false;
	session.whipOutScreen = false; // RTC endpoint for secondary streams
	session.whipOutputScreen = false;
	session.whipoutScreenSettings = false;
	session.whipPublishPrimary = true;
	session.whipPublishScreen = true;
	session.screenWhepPreference = "auto";
	session.whepInput = false; // play whep
	session.whepWait = 2000; // 2s wait for ice candidates by default
	session.whipWait = 2000;
	session.whepInputToken = false;
	session.whipView = false; // listen for whip
	session.whiteBalance = false;
	session.exposure = false;
	session.saturation = false;
	session.sharpness = false;
	session.contrast = false;
	session.brightness = false;
	session.focusDistance = false;
	session.iFramesAllowed = true;
	session.popupChat = null;
	session.gdrive = false;
	session.dbx = false;
	session.dropboxAccessToken = null;
	session.pauseInvisible = false;
	session.preferredVideoErrorCorrection = false;
	session.videoErrorCorrection = false;
	session.predAudio = false;
	session.pfecAudio = false;
	session.redAudio = false;
	session.fecAudio = false;
	session.detune = false;
	session.disableBackground = null;
	session.defaultIframeSrc = "";
	session.version = null;
	session.viewslot = false;
	session.viewheight = false;
	session.viewwidth = false;
	session.videoWorker = false;
	session.updateLocalStatsInterval = null;
	session.UUID = false; // this is only for use with &pie
	session.localMuteElement = getById("muteStateTemplate").cloneNode(true);
	//session.localMuteElement.style.display = "none";
	session.volumeControl = null;
	session.localMuteElement.id = "localMuteElement";
	session.voiceMeter = getById("voiceMeterTemplate").cloneNode(true);
	session.voiceMeter.id = "localVoiceMeter";
	session.voiceMeter.style.opacity = 0; // temporary
	session.voiceMeter.dataset.level = 0;
	session.widget = false;
	session.widgetleft = false;
	session.widgetwidth = 25;
	session.noWidget = false;
	session.showMuteState = false;
	session.showUnMuteState = false;
	session.screensharebutton = true;
	session.introOnClean = false;
	session.codirector_transfer = true;
	session.codirector_changeURL = true;
	session.codirectorNoClaim = false;
	session.youtubeKey = false;
	session.requestscenes = false;
	session.openscene = false;
	session.GDRIVE_CLIENT_ID = "877147493034-67tq62ds8cj54it6cr0ut24irm7t7q5g.apps.googleusercontent.com";
	session.GDRIVE_FOLDERNAME = "recordings";
	session.DROPBOX_APP_KEY = "uwxixfldkii1xpt";

	session.getRoomOnlyTier = function () {
		if (session.roomid === false || session.scene !== false || session.director || session.whipOut || session.meshcast) {
			return 0;
		}

		var guestViewers = 0;
		for (var uuid in session.pcs) {
			var pc = session.pcs[uuid];
			if (!pc || pc.realUUID || pc.connectionState === "closed" || pc.iceConnectionState === "closed") {
				continue;
			}
			if (pc.guest === true && pc.scene === false) {
				guestViewers += 1;
			} else {
				return 0;
			}
		}

		if (!guestViewers) {
			return 0;
		}
		if (session.mobile && (session.cpuLimited || session.quality_wb >= 2 || ((iOS || iPad) && SafariVersion && SafariVersion <= 13))) {
			return 1;
		}
		return 2;
	};

	session.getMobileGuestBitrateCap = function () {
		var roomOnlyTier = session.getRoomOnlyTier();
		if (roomOnlyTier === 1) {
			return session.roomTier1Bitrate;
		} else if (roomOnlyTier > 1) {
			return session.roomTier2Bitrate;
		} else if (session.flagship) {
			return session.maxMobileBitrate;
		} else if (Object.keys(session.pcs).length > 4) {
			return session.lowMobileBitrate;
		} else if ((iOS || iPad) && SafariVersion && SafariVersion <= 13) {
			return session.lowMobileBitrate;
		}
		return session.maxMobileBitrate;
	};

	if (location.hostname == "vdo.ninja") {
		session.salt = "vdo.ninja";
	} else if (location.hostname == "steveseguin.github.io") {
		// allows github to be a backup ; passwords will still work
		session.salt = "vdo.ninja";
	} else if (["vdo.ninja", "rtc.ninja", "versus.cam", "socialstream.ninja"].includes(location.hostname.split(".").slice(-2).join("."))) {
		session.salt = location.hostname.split(".").slice(-2).join("."); // official sub-domains will retain their passwords
	} else {
		try {
			var ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
			if (ipRegex.test(window.location.hostname)) { // Check if the input matches the IP address regex
				session.salt = "vdo.ninja";
			} else if (window.location.hostname == "localhost") {
				session.salt = "vdo.ninja";
			} else {
				session.salt = location.hostname; // user.github.io is going to be secure, versus john.github.io		
			}
		} catch (e) {
			session.salt = location.hostname;
			errorlog(e);
		}
	}

	// QoS (Quality of Service) monitoring - only for official VDO.ninja domains
	// Strictly limited to: vdo.ninja and dev.versus.cam
	session.qosEnabled = (function() {
		var h = location.hostname;
		// Only these exact domains - no subdomains, no other domains
		if (h === "vdo.ninja") return true;
		if (h === "dev.versus.cam") return true;
		// All other domains: disabled (self-hosted, backup, rtc.ninja, etc.)
		return false;
	})();

	if (session.qosEnabled) {
		session.qosData = {
			startTime: Date.now(),
			connectionSuccesses: 0,
			connectionFailures: 0,
			iceRestarts: 0,
			packetLossVideoSamples: [],
			packetLossAudioSamples: [],
			rttSamples: [],
			jitterSamples: [],
			bitrateSamples: [],
			turnServersUsed: [],
			meshcastServersUsed: [],
			candidateTypesLocal: [],
			candidateTypesRemote: [],
			lastVideoCodec: null,
			lastAudioCodec: null,
			lastResolution: null,
			transportType: null,
			sent: false,
			wssSuccess: false
		};
	}

	// QoS holds at most three distinct records in memory, independently of debug.
	var qosErrors = [];
	var qosCriticalSent = false;
	var qosCriticalTimer = null;
	session.qosCriticalEnabled = location.hostname === "vdo.ninja" && /^\/alpha(?:\/|$)/.test(location.pathname);
	var qosCodes = ["signaling_failed", "handshake_decryption_failed", "local_offer_failed", "local_answer_failed", "remote_offer_failed", "remote_answer_failed", "ice_recovery_exhausted", "dtls_failed", "control_transport_closed", "initial_settings_apply_failed", "initial_settings_send_failed", "initial_settings_compose_failed", "video_track_setup_failed", "audio_track_setup_failed", "app_exception"];
	var qosErrorNames = ["Error", "TypeError", "ReferenceError", "SyntaxError", "RangeError", "OperationError", "InvalidStateError", "InvalidAccessError", "NotSupportedError", "NotAllowedError", "AbortError", "NetworkError", "DataError", "SecurityError", "TimeoutError"];
	var qosFiles = ["webrtc.js", "lib.js", "main.js", "auth-client.js", "podcast/bootstrap.js"];
	function qosSource(url, line) {
		try {
			var source = new URL(url);
			var file = source.pathname.replace(/^\/(?:alpha\/)?/, "");
			if (source.origin !== location.origin || qosFiles.indexOf(file) === -1) return null;
			return { file: file, line: Math.max(0, Math.min(100000, parseInt(line, 10) || 0)) };
		} catch (e) { return null; }
	}
	function qosStackSource(error) {
		try {
			// Inspect only the first stack frame. A later app frame must not
			// misattribute an exception thrown by an extension or embedding page.
			var stack = error && typeof error.stack === "string" ? error.stack.slice(0, 4096) : "";
			var frame = stack.split(/\r?\n/).find(function (line) {
				return /^\s*at\s/.test(line) || /^[^\s]*@(?:https?|file|chrome-extension|moz-extension):\/\//.test(line);
			});
			var match = frame && frame.match(/((?:https?|file|chrome-extension|moz-extension):\/\/[^\s()]+):(\d+):(\d+)/);
			return match ? qosSource(match[1], match[2]) : null;
		} catch (e) { return null; }
	}
	session.takeQosErrors = function () {
		var records = [];
		qosErrors.forEach(function (item) {
			if (!item.sent) { item.sent = true; records.push(item.record); }
		});
		return records.length ? records : null;
	};
	session.flushQosCriticalReport = function () {
		try {
			clearTimeout(qosCriticalTimer);
			qosCriticalTimer = null;
			if (!session.qosEnabled || !session.qosCriticalEnabled || qosCriticalSent || typeof postQosPayload !== "function" || typeof qosSoftwareInfo !== "function") return;
			if (!qosErrors.some(function (item) { return !item.sent && item.urgent; })) return;
			qosCriticalSent = true; // Claim the attempt before fetch or lifecycle races.
			var payload = qosSoftwareInfo();
			payload.reportType = "critical";
			payload.errors = session.takeQosErrors();
			postQosPayload(payload, 1024);
		} catch (e) { /* Reporting must never report itself or affect the call. */ }
	};
	session.queueQosError = function (code, error, file, line, urgent) {
		try {
			if (!session.qosEnabled || qosCodes.indexOf(code) === -1) return;
			var source = qosStackSource(error);
			file = source ? source.file : (qosFiles.indexOf(file) !== -1 ? file : null);
			line = source ? source.line : Math.max(0, Math.min(100000, parseInt(line, 10) || 0));
			var key = code + ":" + file + ":" + line;
			var existing = qosErrors.find(function (item) { return item.key === key; });
			if (existing) {
				existing.urgent = existing.urgent || !!urgent;
			} else {
				if (qosErrors.length >= 3) return;
				var name = error && qosErrorNames.indexOf(error.name) !== -1 ? error.name : "Error";
				qosErrors.push({ key: key, sent: false, urgent: !!urgent, record: { code: code, name: name, file: file, line: file ? line : 0 } });
			}
			if (urgent && session.qosCriticalEnabled && !qosCriticalSent && !qosCriticalTimer) {
				qosCriticalTimer = setTimeout(session.flushQosCriticalReport, 1000);
			}
		} catch (e) { /* No messages, stacks or arbitrary objects cross the QoS boundary. */ }
	};
	session.observeQosTransport = function (peer) {
		try {
			if (!session.qosEnabled || !peer || peer.connectionState === "closed") return;
			var sctp = peer.sctp;
			var dtls = sctp && sctp.transport;
			if (dtls && dtls.state === "failed" && (peer.iceConnectionState === "connected" || peer.iceConnectionState === "completed")) {
				session.queueQosError("dtls_failed", null, "webrtc.js", 0, true);
			} else if (sctp && sctp.state === "closed" && dtls && dtls.state === "connected" && peer.connectionState === "connected") {
				session.queueQosError("control_transport_closed", null, "webrtc.js", 0, true);
			}
		} catch (e) { }
	};
	window.addEventListener("error", function (event) {
		var source = qosSource(event.filename, event.lineno);
		if (source) session.queueQosError("app_exception", event.error, source.file, source.line, true);
	});
	window.addEventListener("unhandledrejection", function (event) {
		var source = qosStackSource(event.reason);
		if (source) session.queueQosError("app_exception", event.reason, source.file, source.line, true);
	});
	// Do not add report work to pagehide/visibility handlers. The normal
	// error timer and summary are best effort; shutdown cleanup takes priority.

	session.reportCriticalError = function (stage, error, fallbackLine = false) {
		var qosStage = {
			"initial-settings-apply": "initial_settings_apply_failed",
			"initial-settings-send": "initial_settings_send_failed",
			"initial-settings-compose": "initial_settings_compose_failed",
			"initial-publish-video-track": "video_track_setup_failed",
			"initial-publish-audio-track": "audio_track_setup_failed"
		}[stage];
		if (qosStage) {
			// Duplicate tracks can leave working media intact: summary only.
			session.queueQosError(qosStage, error, "webrtc.js", fallbackLine, stage.indexOf("initial-settings-") === 0);
		}
		try {
			var safeStage = String(stage || "unknown")
				.replace(/[^a-z0-9_-]/gi, "-")
				.substring(0, 60);
			var errorName = "Error";
			var errorMessage = "Unknown error";
			if (error && typeof error === "object") {
				if (error.name) {
					errorName = String(error.name);
				}
				if (error.message) {
					errorMessage = String(error.message);
				} else if (typeof error.code !== "undefined") {
					errorMessage = "code " + error.code;
				}
			} else if (typeof error !== "undefined" && error !== null) {
				errorMessage = String(error);
			}
			errorName = errorName.replace(/[^a-z0-9_.-]/gi, "").substring(0, 40) || "Error";
			errorMessage = errorMessage.substring(0, 300);
			var errorLine = parseInt(fallbackLine, 10) || 0;
			var sourcePosition = "";
			if (error && error.stack) {
				var stackMatch = String(error.stack).match(/(?:^|[\\/])([^\\/\s()]+\.js)(?:\?[^:\s)]*)?:(\d+):(\d+)/m);
				if (stackMatch && stackMatch[2]) {
					sourcePosition = " @ " + stackMatch[1];
					errorLine = parseInt(stackMatch[2], 10) || errorLine;
				}
			}
			errorlog(
				"CRITICAL " + safeStage + " | " + errorName + sourcePosition + ": " + errorMessage,
				false,
				errorLine
			);
		} catch (reportError) {
			errorlog(reportError, false, fallbackLine);
		}
	};

	session.bumpReliabilityCounter = function (name, delta = 1) {
		try {
			if (!session.reliabilityCounters) {
				return;
			}
			if (!(name in session.reliabilityCounters)) {
				session.reliabilityCounters[name] = 0;
			}
			session.reliabilityCounters[name] += delta;
		} catch (e) {
			errorlog(e);
		}
	};

	session.chunkProtocolIndexedV1 = "indexed-v1";
	session.getChunkedOutputProtocol = function (details) {
		if (details && typeof details.chunkProtocol === "string") {
			return details.chunkProtocol;
		}
		if (
			session.chunkedRecorder &&
			session.chunkedRecorder.reliability &&
			session.chunkedRecorder.reliability.indexed
		) {
			return session.chunkProtocolIndexedV1;
		}
		return session.chunkindex ? session.chunkProtocolIndexedV1 : "positional-v1";
	};

	session.peerSupportsChunkProtocol = function (peer, protocol) {
		return !!(
			peer &&
			Array.isArray(peer.chunkProtocols) &&
			peer.chunkProtocols.indexOf(protocol) !== -1
		);
	};

	session.canSendChunkedToPeer = function (peer, details) {
		if (!peer || !peer.allowChunked) {
			return false;
		}
		const protocol = session.getChunkedOutputProtocol(details);
		return protocol !== session.chunkProtocolIndexedV1 || session.peerSupportsChunkProtocol(peer, protocol);
	};

	// Presentation-only status for chunked room previews; never alter playout timing.
	function createChunkedBufferIndicator(file, getTarget) {
		const params = new URLSearchParams(location.search);
		function allowed() {
			return !!(session.roomid || session.director) && !session.cleanOutput && !session.cleanDirector
				&& session.scene === false && session.view === false
				&& !["view", "v", "V", "pull", "streamid", "scene", "scn", "cleanoutput", "clean", "cleanish"].some(key => params.has(key));
		}
		if (!allowed()) {
			return null;
		}
		let overlay = null;
		let label = null;
		let progress = null;
		let lastTimestamp = null;
		let lastDecodedAt = performance.now();
		let consecutive = 0;
		let hasPlayed = false;
		let lastTarget = getTarget();
		let timer = null;
		function destroy() {
			clearInterval(timer);
			if (overlay) {
				overlay.remove();
				overlay = null;
			}
		}
		function refresh() {
			if (!allowed() || !session.rpcs[file.UUID] || file.channel.readyState === "closed") {
				destroy();
				return;
			}
			const target = getTarget();
			if (Math.abs(target - lastTarget) > 250) {
				consecutive = 0;
			}
			lastTarget = target;
			const stats = session.rpcs[file.UUID].stats.chunked_mode_video || {};
			const stalled = performance.now() - lastDecodedAt > 3000;
			const waiting = target > 0 && (consecutive < 2 || stalled);
			if (!waiting) {
				if (overlay) overlay.style.display = "none";
				return;
			}
			const video = file.videoElement;
			// Directors have a dedicated preview wrapper, separate from their controls.
			const parent = session.director ? document.getElementById("videoContainer_" + file.UUID) : video.parentElement;
			if (!parent || parent === document.body || !parent.isConnected) return;
			if (!overlay) {
				overlay = document.createElement("div");
				overlay.className = "chunked-buffer-indicator";
				overlay.style.cssText = "position:absolute;left:0;right:0;bottom:0;z-index:2;pointer-events:none;box-sizing:border-box;align-items:center;justify-content:center;flex-direction:column;gap:6px;padding:10px;color:#fff;background:rgba(20,22,26,.9);font:13px sans-serif;text-align:center;";
				label = document.createElement("span");
				label.id = "chunked-buffer-label-" + file.UUID;
				progress = document.createElement("progress");
				progress.max = 1;
				progress.setAttribute("aria-labelledby", label.id);
				progress.style.cssText = "width:140px;max-width:80%;height:4px;margin:0;";
				overlay.appendChild(label);
				overlay.appendChild(progress);
			}
			if (overlay.parentElement !== parent) parent.appendChild(overlay);
			const startup = !hasPlayed && !session.director;
			const phase = startup ? "startup" : "buffering";
			if (overlay.dataset.phase !== phase) {
				overlay.dataset.phase = phase;
				miniTranslate(label, startup ? "chunked-synchronizing" : "chunked-buffering", startup ? "Synchronizing…" : "Buffering…");
			}
			overlay.style.top = startup ? "0" : "auto";
			overlay.style.background = startup ? "#14161a" : "rgba(20,22,26,.85)";
			overlay.style.display = "flex";
			const window = file.video && file.video.controller && file.video.controller.bufferWindow();
			if (!window || stats.awaiting_keyframe) {
				progress.removeAttribute("value");
			} else {
				const age = file.getRemoteNow() - file.video.realTime - window.oldest / 1000;
				const span = (window.newest - window.oldest) / 1000;
				// Missing data cannot fill the bar merely because wall time passed.
				progress.value = Math.max(0, Math.min(.98, Math.min(age, span) / target));
			}
		}
		timer = setInterval(refresh, 200);
		refresh();
		return {
			decoded(timestamp) {
				const target = getTarget();
				const age = file.getRemoteNow() - (file.video ? file.video.realTime : 0) - timestamp / 1000;
				if (Math.abs(target - lastTarget) > 250) consecutive = 0;
				lastTarget = target;
				// Buffer readiness is not a sync-accuracy verdict: a slow decoder
				// can output old frames while playback is nevertheless advancing.
				if (age >= target - 250) {
					consecutive = lastTimestamp !== null && timestamp > lastTimestamp ? consecutive + 1 : 1;
				} else {
					consecutive = 0;
				}
				lastTimestamp = timestamp;
				lastDecodedAt = performance.now();
				if (target > 0 && consecutive >= 2) hasPlayed = true;
			},
			destroy
		};
	}

	function updateChunkedDecodeLatencyStat(destination, elapsedMs) {
		if (!destination) {
			return false;
		}
		var sampleMs = parseFloat(elapsedMs);
		if (!Number.isFinite(sampleMs) || sampleMs < 0) {
			return false;
		}
		sampleMs = Math.min(1200, sampleMs);
		var previousMs = parseFloat(destination.decodeLatencyMs);
		if (Number.isFinite(previousMs) && previousMs >= 0) {
			destination.decodeLatencyMs = Math.round(previousMs * 0.8 + sampleMs * 0.2);
		} else {
			destination.decodeLatencyMs = Math.round(sampleMs);
		}
		return true;
	}

	function chunkedMediaWorkerRuntime() {
		var sourceTrack = null;
		var sourceReader = null;
		var sourceEncoder = null;
		var sourceKind = null;
		var sourceStopped = false;
		var sourceFrameReported = false;
		var videoFrameCounter = 0;
		var videoNeedKeyframe = false;
		var videoForceKeyframe = false;
		var videoDropCount = 0;
		var videoGenerator = null;
		var videoWriter = null;
		var videoDecoder = null;
		var videoDecoderConfig = null;
		var videoDecodeStartedAt = Object.create(null);

		function errorDetails(error) {
			return {
				name: error && error.name ? error.name : "Error",
				message: error && error.message ? error.message : String(error)
			};
		}

		function reportError(scope, error) {
			self.postMessage({ type: "error", scope: scope, error: errorDetails(error) });
		}

		function closeFrame(frame) {
			try {
				if (frame && typeof frame.close === "function") {
					frame.close();
				}
			} catch (error) { }
		}

		function createSourceEncoder(kind, config) {
			var callbacks = {
				output: function (chunk) {
					try {
						var bytes = new Uint8Array(chunk.byteLength);
						chunk.copyTo(bytes);
						self.postMessage({
							type: "encoded",
							kind: kind,
							chunkType: chunk.type || "key",
							timestamp: chunk.timestamp,
							duration: typeof chunk.duration === "number" ? chunk.duration : null,
							data: bytes.buffer
						}, [bytes.buffer]);
					} catch (error) {
						reportError(kind + "-encoder-output", error);
					}
				},
				error: function (error) {
					reportError(kind + "-encoder", error);
				}
			};
			if (kind === "video") {
				sourceEncoder = new VideoEncoder(callbacks);
			} else {
				sourceEncoder = new AudioEncoder(callbacks);
			}
			sourceEncoder.configure(config);
		}

		function readSourceFrame() {
			if (sourceStopped || !sourceReader || !sourceEncoder) {
				return;
			}
			sourceReader.read().then(function (result) {
				var frame = result.value;
				if (result.done || sourceStopped) {
					closeFrame(frame);
					self.postMessage({ type: "source-ended", kind: sourceKind });
					return;
				}
				try {
					if (!sourceFrameReported) {
						sourceFrameReported = true;
						self.postMessage({ type: "source-frame", kind: sourceKind, timestamp: frame.timestamp });
					}
					if (sourceKind === "video") {
						videoFrameCounter += 1;
						var insertKeyframe = false;
						if (videoNeedKeyframe) {
							insertKeyframe = videoForceKeyframe || videoFrameCounter >= 60;
							if (insertKeyframe) {
								videoFrameCounter = 0;
								videoNeedKeyframe = false;
								videoForceKeyframe = false;
							}
						}
						if (videoDropCount > 0 && !insertKeyframe) {
							videoDropCount -= 1;
							self.postMessage({ type: "video-frame-dropped" });
						} else {
							sourceEncoder.encode(frame, { keyFrame: insertKeyframe });
							if (insertKeyframe) {
								self.postMessage({ type: "video-keyframe" });
							}
						}
					} else {
						sourceEncoder.encode(frame);
					}
				} catch (error) {
					reportError(sourceKind + "-encode", error);
				}
				closeFrame(frame);
				readSourceFrame();
			}).catch(function (error) {
				reportError((sourceKind || "media") + "-processor", error);
			});
		}

		function startSourceEncoder(data) {
			try {
				sourceKind = data.kind;
				sourceTrack = data.track;
				sourceStopped = false;
				sourceFrameReported = false;
				sourceReader = new MediaStreamTrackProcessor({ track: sourceTrack }).readable.getReader();
				createSourceEncoder(sourceKind, data.config);
				self.postMessage({ type: "encoder-ready", kind: sourceKind });
				readSourceFrame();
			} catch (error) {
				reportError((data.kind || "media") + "-encoder-start", error);
			}
		}

		function stopSourceEncoder() {
			sourceStopped = true;
			try {
				if (sourceReader) {
					sourceReader.cancel();
				}
			} catch (error) { }
			try {
				if (sourceEncoder && sourceEncoder.state !== "closed") {
					sourceEncoder.close();
				}
			} catch (error2) { }
			try {
				if (sourceTrack) {
					sourceTrack.stop();
				}
			} catch (error3) { }
			sourceReader = null;
			sourceEncoder = null;
			sourceTrack = null;
		}

		function createVideoDecoder() {
			videoDecoder = new VideoDecoder({
				output: function (frame) {
					var timestampKey = String(frame.timestamp);
					var decodeStartedAt = videoDecodeStartedAt[timestampKey];
					delete videoDecodeStartedAt[timestampKey];
					if (typeof decodeStartedAt === "number" && isFinite(decodeStartedAt)) {
						self.postMessage({
							type: "video-decode-complete",
							timestamp: frame.timestamp,
							latencyMs: Math.max(0, performance.now() - decodeStartedAt)
						});
					}
					try {
						var pending = videoWriter.write(frame);
						if (pending && typeof pending.then === "function") {
							pending.then(function () {
								closeFrame(frame);
							}).catch(function (error) {
								closeFrame(frame);
								reportError("video-generator-write", error);
							});
						} else {
							closeFrame(frame);
						}
					} catch (error) {
						closeFrame(frame);
						reportError("video-generator-write", error);
					}
				},
				error: function (error) {
					reportError("video-decoder", error);
				}
			});
			videoDecoder.configure(videoDecoderConfig);
		}

		function startVideoSink(config) {
			try {
				videoDecoderConfig = config;
				if (typeof self.VideoTrackGenerator === "function") {
					videoGenerator = new VideoTrackGenerator();
				} else {
					videoGenerator = new MediaStreamTrackGenerator({ kind: "video" });
				}
				videoWriter = videoGenerator.writable.getWriter();
				createVideoDecoder();
				var generatedTrack = videoGenerator.track || videoGenerator;
				self.postMessage({ type: "video-sink-ready", track: generatedTrack }, [generatedTrack]);
			} catch (error) {
				reportError("video-sink-start", error);
			}
		}

		function resetVideoDecoder(config) {
			try {
				videoDecodeStartedAt = Object.create(null);
				if (config) {
					videoDecoderConfig = config;
				}
				if (videoDecoder && videoDecoder.state !== "closed") {
					videoDecoder.close();
				}
				createVideoDecoder();
				self.postMessage({ type: "video-decoder-reset" });
			} catch (error) {
				reportError("video-decoder-reset", error);
			}
		}

		self.onmessage = function (event) {
			var data = event.data || {};
			if (data.type === "probe") {
				self.postMessage({
					type: "probe",
					mediaStreamTrackProcessor: typeof self.MediaStreamTrackProcessor === "function",
					videoTrackGenerator: typeof self.VideoTrackGenerator === "function" || typeof self.MediaStreamTrackGenerator === "function",
					videoEncoder: typeof self.VideoEncoder === "function",
					audioEncoder: typeof self.AudioEncoder === "function",
					videoDecoder: typeof self.VideoDecoder === "function",
					encodedVideoChunk: typeof self.EncodedVideoChunk === "function"
				});
				return;
			}
			if (data.type === "start-encoder") {
				startSourceEncoder(data);
				return;
			}
			if (data.type === "configure-encoder") {
				try {
					if (sourceEncoder && sourceEncoder.state !== "closed") {
						sourceEncoder.configure(data.config);
					}
				} catch (error) {
					reportError((sourceKind || "media") + "-encoder-configure", error);
				}
				return;
			}
			if (data.type === "request-keyframe") {
				videoNeedKeyframe = true;
				videoForceKeyframe = videoForceKeyframe || !!data.force;
				return;
			}
			if (data.type === "drop-video-frames") {
				videoDropCount += Math.max(0, parseInt(data.count) || 0);
				return;
			}
			if (data.type === "close-encoder") {
				stopSourceEncoder();
				return;
			}
			if (data.type === "start-video-sink") {
				startVideoSink(data.config);
				return;
			}
			if (data.type === "decode-video") {
				try {
					var chunkInit = {
						type: data.chunkType,
						timestamp: data.timestamp,
						data: data.data
					};
					if (typeof data.duration === "number") {
						chunkInit.duration = data.duration;
					}
					videoDecodeStartedAt[String(data.timestamp)] = performance.now();
					videoDecoder.decode(new EncodedVideoChunk(chunkInit));
					self.postMessage({ type: "video-decode-queue", size: videoDecoder.decodeQueueSize || 0 });
				} catch (error) {
					reportError("video-decode", error);
				}
				return;
			}
			if (data.type === "reset-video-decoder") {
				resetVideoDecoder(data.config);
				return;
			}
			if (data.type === "configure-video-decoder") {
				resetVideoDecoder(data.config);
				return;
			}
			if (data.type === "close-video-sink") {
				try {
					if (videoDecoder && videoDecoder.state !== "closed") {
						videoDecoder.close();
					}
				} catch (error) { }
				try {
					if (videoWriter) {
						videoWriter.close();
					}
				} catch (error2) { }
			}
		};
	}

	session.getChunkedMediaWorkerUrl = function () {
		if (session.chunkedMediaWorkerUrl) {
			return session.chunkedMediaWorkerUrl;
		}
		var source = "(" + chunkedMediaWorkerRuntime.toString() + ")();";
		session.chunkedMediaWorkerUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
		return session.chunkedMediaWorkerUrl;
	};

	session.createChunkedMediaWorker = function () {
		return new Worker(session.getChunkedMediaWorkerUrl());
	};

	session.ensureChunkedWorkerSupport = function () {
		if (session.chunkedWorkerSupportPromise) {
			return session.chunkedWorkerSupportPromise;
		}
		session.chunkedWorkerSupportPromise = new Promise(function (resolve) {
			if (typeof Worker !== "function" || typeof Blob !== "function" || typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
				session.chunkedWorkerSupport = false;
				resolve(false);
				return;
			}
			var worker;
			var finished = false;
			var timeout = setTimeout(function () {
				if (finished) {
					return;
				}
				finished = true;
				try {
					worker.terminate();
				} catch (error) { }
				session.chunkedWorkerSupport = false;
				resolve(false);
			}, 3000);
			try {
				worker = session.createChunkedMediaWorker();
				worker.onmessage = function (event) {
					if (finished || !event.data || event.data.type !== "probe") {
						return;
					}
					finished = true;
					clearTimeout(timeout);
					session.chunkedWorkerSupport = event.data;
					worker.terminate();
					resolve(event.data);
				};
				worker.onerror = function () {
					if (finished) {
						return;
					}
					finished = true;
					clearTimeout(timeout);
					worker.terminate();
					session.chunkedWorkerSupport = false;
					resolve(false);
				};
				worker.postMessage({ type: "probe" });
			} catch (error) {
				finished = true;
				clearTimeout(timeout);
				session.chunkedWorkerSupport = false;
				resolve(false);
			}
		});
		return session.chunkedWorkerSupportPromise;
	};

	session.createChunkedWorkerEncoder = function (kind, track, config, callbacks) {
		var worker = session.createChunkedMediaWorker();
		var startedResolve;
		var started = new Promise(function (resolve) {
			startedResolve = resolve;
		});
		var firstFrame = true;
		var failed = false;
		var proxy = {
			state: "configured",
			config: config,
			worker: worker,
			pendingDrops: 0,
			keyframeRequested: false,
			lastForceKeyframe: false,
			configure: function (nextConfig) {
				if (proxy.state === "closed") {
					return;
				}
				proxy.config = nextConfig;
				worker.postMessage({ type: "configure-encoder", config: nextConfig });
			},
			close: function () {
				if (proxy.state === "closed") {
					return;
				}
				proxy.state = "closed";
				if (proxy.controlTimer) {
					clearInterval(proxy.controlTimer);
					proxy.controlTimer = null;
				}
				try {
					worker.postMessage({ type: "close-encoder" });
				} catch (error) { }
				setTimeout(function () {
					worker.terminate();
				}, 25);
			},
			syncControl: function () {
				if (kind !== "video" || proxy.state === "closed" || !session.chunkedRecorder) {
					return;
				}
				var recorder = session.chunkedRecorder;
				var adaptation = recorder.adaptation;
				var forceKeyframe = !!(adaptation && adaptation.forceKeyFrame);
				if (recorder.needKeyFrame && (!proxy.keyframeRequested || forceKeyframe !== proxy.lastForceKeyframe)) {
					proxy.keyframeRequested = true;
					proxy.lastForceKeyframe = forceKeyframe;
					worker.postMessage({ type: "request-keyframe", force: forceKeyframe });
				}
				if (adaptation && (adaptation.mode === "framerate" || adaptation.mode === "hybrid") && adaptation.frameDropBudget >= 1) {
					var dropCount = Math.floor(adaptation.frameDropBudget);
					adaptation.frameDropBudget = Math.max(0, adaptation.frameDropBudget - dropCount);
					proxy.pendingDrops += dropCount;
					worker.postMessage({ type: "drop-video-frames", count: dropCount });
				}
			}
		};

		worker.onmessage = function (event) {
			var data = event.data || {};
			if (data.type === "source-frame" && firstFrame) {
				firstFrame = false;
				if (callbacks.started) {
					callbacks.started(data.timestamp);
				}
				startedResolve();
				return;
			}
			if (data.type === "encoded") {
				try {
					var init = {
						type: data.chunkType,
						timestamp: data.timestamp,
						data: data.data
					};
					if (typeof data.duration === "number") {
						init.duration = data.duration;
					}
					var chunk = data.kind === "video" ? new EncodedVideoChunk(init) : new EncodedAudioChunk(init);
					callbacks.output(chunk);
				} catch (error) {
					callbacks.error(error);
				}
				return;
			}
			if (data.type === "video-keyframe") {
				proxy.keyframeRequested = false;
				proxy.lastForceKeyframe = false;
				if (session.chunkedRecorder) {
					session.chunkedRecorder.needKeyFrame = false;
					if (session.chunkedRecorder.adaptation) {
						session.chunkedRecorder.adaptation.forceKeyFrame = false;
					}
				}
				return;
			}
			if (data.type === "video-frame-dropped") {
				proxy.pendingDrops = Math.max(0, proxy.pendingDrops - 1);
				if (session.chunkedRecorder && session.chunkedRecorder.adaptation) {
					var adaptation = session.chunkedRecorder.adaptation;
					adaptation.droppedFrames = (adaptation.droppedFrames || 0) + 1;
					session.stats.chunkedDroppedFrames = adaptation.droppedFrames;
				}
				return;
			}
			if (data.type === "source-ended") {
				proxy.state = "closed";
				if (firstFrame) {
					firstFrame = false;
					startedResolve();
				}
				return;
			}
			if (data.type === "error" && !failed) {
				failed = true;
				if (firstFrame) {
					firstFrame = false;
					startedResolve();
				}
				var error = new Error(data.error && data.error.message ? data.error.message : "Chunked media worker failed");
				error.name = data.error && data.error.name ? data.error.name : "Error";
				callbacks.error(error);
			}
		};
		worker.onerror = function (event) {
			if (failed) {
				return;
			}
			failed = true;
			if (firstFrame) {
				firstFrame = false;
				startedResolve();
			}
			callbacks.error(new Error(event && event.message ? event.message : "Chunked media worker failed"));
		};

		var workerTrack = typeof track.clone === "function" ? track.clone() : track;
		worker.postMessage({ type: "start-encoder", kind: kind, track: workerTrack, config: config }, [workerTrack]);
		if (kind === "video") {
			proxy.controlTimer = setInterval(proxy.syncControl, 100);
			proxy.syncControl();
		}
		return { encoder: proxy, started: started };
	};

	session.createChunkedAudioDataSource = async function (stream, config, onFrame, onError) {
		var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
		if (typeof AudioContextConstructor !== "function" || typeof AudioData !== "function") {
			throw new Error("This browser cannot create AudioData for chunked audio encoding");
		}
		var ownsAudioContext = !session.audioCtx;
		var audioContext = session.audioCtx || new AudioContextConstructor({ sampleRate: config.sampleRate || 48000 });
		if (!session.audioCtx) {
			session.audioCtx = audioContext;
		}
		var inputNode = audioContext.createMediaStreamSource(stream);
		var captureNode = null;
		var silenceNode = audioContext.createGain();
		silenceNode.gain.value = 0;
		var totalFrames = 0;
		var active = true;

		function emitAudioData(channelBuffers, frameCount) {
			if (!active || !channelBuffers || !channelBuffers.length || !frameCount) {
				return;
			}
			try {
				var channelCount = channelBuffers.length;
				var planar = new Float32Array(frameCount * channelCount);
				for (var channelIndex = 0; channelIndex < channelCount; channelIndex++) {
					var samples = channelBuffers[channelIndex] instanceof Float32Array ? channelBuffers[channelIndex] : new Float32Array(channelBuffers[channelIndex]);
					planar.set(samples.subarray(0, frameCount), channelIndex * frameCount);
				}
				var timestamp = Math.round(totalFrames * 1000000 / audioContext.sampleRate);
				totalFrames += frameCount;
				onFrame(new AudioData({
					format: "f32-planar",
					sampleRate: audioContext.sampleRate,
					numberOfFrames: frameCount,
					numberOfChannels: channelCount,
					timestamp: timestamp,
					data: planar.buffer
				}));
			} catch (error) {
				onError(error);
			}
		}

		if (audioContext.audioWorklet && typeof AudioWorkletNode === "function") {
			if (!session.chunkedAudioWorkletModulePromise) {
				session.chunkedAudioWorkletModulePromise = audioContext.audioWorklet.addModule("./chunked-audio-worklet.js?v=1");
			}
			await session.chunkedAudioWorkletModulePromise;
			captureNode = new AudioWorkletNode(audioContext, "vdo-chunked-audio-capture", {
				numberOfInputs: 1,
				numberOfOutputs: 1,
				outputChannelCount: [1]
			});
			captureNode.port.onmessage = function (event) {
				var data = event.data || {};
				emitAudioData(data.channels, data.frames);
			};
		} else {
			var channelCount = Math.max(1, Math.min(2, inputNode.channelCount || config.numberOfChannels || 1));
			captureNode = (audioContext.createScriptProcessor || audioContext.createJavaScriptNode).call(audioContext, 2048, channelCount, 1);
			captureNode.onaudioprocess = function (event) {
				var channels = [];
				for (var channelIndex = 0; channelIndex < event.inputBuffer.numberOfChannels; channelIndex++) {
					var samples = new Float32Array(event.inputBuffer.length);
					samples.set(event.inputBuffer.getChannelData(channelIndex));
					channels.push(samples);
				}
				emitAudioData(channels, event.inputBuffer.length);
			};
		}

		return {
			channelCount: Math.max(1, Math.min(2, inputNode.channelCount || config.numberOfChannels || 1)),
			sampleRate: audioContext.sampleRate,
			context: audioContext,
			start: function () {
				inputNode.connect(captureNode);
				captureNode.connect(silenceNode);
				silenceNode.connect(audioContext.destination);
				return audioContext.resume();
			},
			close: function () {
				if (!active) {
					return;
				}
				active = false;
				try {
					inputNode.disconnect();
				} catch (error) { }
				try {
					captureNode.disconnect();
				} catch (error2) { }
				try {
					silenceNode.disconnect();
				} catch (error3) { }
				if (ownsAudioContext) {
					try {
						audioContext.close();
					} catch (error4) { }
				}
			}
		};
	};

	session.createChunkedWorkerVideoSink = function (config, onError, onDecodeComplete) {
		return new Promise(function (resolve, reject) {
			var worker = session.createChunkedMediaWorker();
			var settled = false;
			var timeout = setTimeout(function () {
				if (settled) {
					return;
				}
				settled = true;
				worker.terminate();
				reject(new Error("Timed out creating the chunked Safari video sink"));
			}, 5000);
			var proxy = {
				isChunkedWorkerProxy: true,
				state: "configured",
				decodeQueueSize: 0,
				config: config,
				decode: function (chunk) {
					if (proxy.state !== "configured") {
						throw new Error("Chunked video decoder is not configured");
					}
					var bytes = new Uint8Array(chunk.byteLength);
					chunk.copyTo(bytes);
					worker.postMessage({
						type: "decode-video",
						chunkType: chunk.type,
						timestamp: chunk.timestamp,
						duration: typeof chunk.duration === "number" ? chunk.duration : null,
						data: bytes.buffer
					}, [bytes.buffer]);
				},
				configure: function (nextConfig) {
					proxy.config = nextConfig;
					proxy.state = "configured";
					worker.postMessage({ type: "configure-video-decoder", config: nextConfig });
				},
				reset: function (nextConfig) {
					if (nextConfig) {
						proxy.config = nextConfig;
					}
					proxy.state = "configured";
					worker.postMessage({ type: "reset-video-decoder", config: proxy.config });
				},
				close: function () {
					proxy.state = "closed";
				},
				destroy: function () {
					proxy.state = "closed";
					try {
						worker.postMessage({ type: "close-video-sink" });
					} catch (error) { }
					setTimeout(function () {
						worker.terminate();
					}, 25);
				}
			};

			worker.onmessage = function (event) {
				var data = event.data || {};
				if (data.type === "video-sink-ready" && !settled) {
					settled = true;
					clearTimeout(timeout);
					resolve({ track: data.track, decoder: proxy, worker: worker });
					return;
				}
				if (data.type === "video-decode-queue") {
					proxy.decodeQueueSize = data.size || 0;
					return;
				}
				if (data.type === "video-decode-complete") {
					if (typeof onDecodeComplete === "function") {
						onDecodeComplete(data.timestamp, data.latencyMs);
					}
					return;
				}
				if (data.type === "video-decoder-reset") {
					proxy.state = "configured";
					return;
				}
				if (data.type === "error") {
					var error = new Error(data.error && data.error.message ? data.error.message : "Chunked video worker failed");
					error.name = data.error && data.error.name ? data.error.name : "Error";
					if (!settled) {
						settled = true;
						clearTimeout(timeout);
						worker.terminate();
						reject(error);
					} else if (onError) {
						onError(error);
					}
				}
			};
			worker.onerror = function (event) {
				var error = new Error(event && event.message ? event.message : "Chunked video worker failed");
				if (!settled) {
					settled = true;
					clearTimeout(timeout);
					worker.terminate();
					reject(error);
				} else if (onError) {
					onError(error);
				}
			};
			worker.postMessage({ type: "start-video-sink", config: config });
		});
	};

	session.ensureReliabilityStats = function () {
		try {
			if (!session.stats) {
				session.stats = {};
			}
			if (session.reliabilityCounters) {
				session.stats.reliability = session.reliabilityCounters;
			}
		} catch (e) {
			errorlog(e);
		}
	};
	session.ensureReliabilityStats();

	session.attachIceCandidateErrorTracker = function (pc, role = "peer", UUID = null) {
		try {
			if (!pc) {
				return;
			}
			pc.onicecandidateerror = function (e) {
				try {
					const code = (e && ("errorCode" in e)) ? String(e.errorCode) : "unknown";
					const text = (e && e.errorText) ? e.errorText : "";
					const url = (e && e.url) ? e.url : "";
					session.bumpReliabilityCounter("ice_candidate_errors");
					session.bumpReliabilityCounter("ice_candidate_error_" + code);
					pc.lastIceCandidateError = {
						role: role,
						UUID: UUID,
						code: code,
						text: text,
						url: url,
						ts: Date.now()
					};
					warnlog("ICE candidate error (" + role + ")" + (UUID ? " " + UUID : "") + ": " + code + " " + text);
				} catch (err) {
					errorlog(err);
				}
			};
		} catch (e) {
			warnlog(e);
		}
	};

	session.getPendingIceKey = function (UUID, type) {
		return (type || "unknown") + ":" + UUID;
	};

	session.pendingIceLastSweep = 0;
	session.pendingIceSweepMinMs = 2000;
	session.pendingIceMaxKeys = 500;

	session.prunePendingIceCandidates = function (force = false) {
		try {
			if (!session.pendingIceCandidates) {
				return;
			}

			const now = Date.now();
			const sweepMinMs = parseInt(session.pendingIceSweepMinMs) || 2000;
			if (!force && now - session.pendingIceLastSweep < sweepMinMs) {
				return;
			}
			session.pendingIceLastSweep = now;

			const ttl = parseInt(session.pendingIceTTL) || 15000;
			const maxKeys = Math.max(50, parseInt(session.pendingIceMaxKeys) || 500);
			let expiredCount = 0;
			let keyCount = 0;
			const keys = Object.keys(session.pendingIceCandidates);

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const queue = session.pendingIceCandidates[key];
				if (!Array.isArray(queue) || !queue.length) {
					delete session.pendingIceCandidates[key];
					continue;
				}

				while (queue.length && (!queue[0] || !queue[0].ts || now - queue[0].ts > ttl)) {
					queue.shift();
					expiredCount += 1;
				}

				if (!queue.length) {
					delete session.pendingIceCandidates[key];
				} else {
					keyCount += 1;
				}
			}

			if (keyCount > maxKeys) {
				const sortable = [];
				for (const key in session.pendingIceCandidates) {
					const queue = session.pendingIceCandidates[key];
					if (!Array.isArray(queue) || !queue.length) {
						continue;
					}
					const tail = queue[queue.length - 1];
					const ts = tail && tail.ts ? tail.ts : 0;
					sortable.push([key, ts]);
				}

				sortable.sort(function (a, b) {
					return a[1] - b[1];
				});

				const removeCount = Math.max(0, sortable.length - maxKeys);
				for (let i = 0; i < removeCount; i++) {
					const key = sortable[i][0];
					const queue = session.pendingIceCandidates[key];
					if (Array.isArray(queue)) {
						expiredCount += queue.length;
					}
					delete session.pendingIceCandidates[key];
				}
				warnlog("Pruned pending ICE key overflow: " + removeCount + " keys");
			}

			if (expiredCount) {
				session.bumpReliabilityCounter("ice_queue_expired", expiredCount);
				warnlog("Pruned stale pending ICE candidates: " + expiredCount);
			}
		} catch (e) {
			errorlog(e);
		}
	};

	session.queuePendingIce = function (msg) {
		try {
			if (!msg || !msg.UUID || !msg.type || !msg.candidate) {
				return false;
			}

			session.prunePendingIceCandidates();

			const key = session.getPendingIceKey(msg.UUID, msg.type);
			const now = Date.now();
			const ttl = parseInt(session.pendingIceTTL) || 15000;
			const maxEntries = parseInt(session.pendingIceMaxPerPeer) || 100;

			const newKey = !session.pendingIceCandidates[key];
			if (newKey) {
				session.pendingIceCandidates[key] = [];
			}

			const queue = session.pendingIceCandidates[key];
			let expiredCount = 0;
			while (queue.length && now - queue[0].ts > ttl) {
				queue.shift();
				expiredCount += 1;
			}

			if (expiredCount) {
				session.bumpReliabilityCounter("ice_queue_expired", expiredCount);
				warnlog("Dropped stale queued ICE candidates: " + expiredCount);
			}

			if (queue.length >= maxEntries) {
				queue.shift();
				warnlog("Pending ICE queue full; dropping oldest candidate");
			}

			queue.push({
				candidate: msg.candidate,
				session: ("session" in msg) ? msg.session : undefined,
				type: msg.type,
				UUID: msg.UUID,
				ts: now
			});
			// The sweep throttle must not allow a burst to exceed the existing key limit.
			if (newKey && Object.keys(session.pendingIceCandidates).length > Math.max(50, parseInt(session.pendingIceMaxKeys) || 500)) {
				session.prunePendingIceCandidates(true);
			}

			session.bumpReliabilityCounter("ice_queued_pre_pc");
			warnlog("Queued ICE before peer connection ready: " + msg.UUID + " (" + msg.type + ")");
			return true;
		} catch (e) {
			errorlog(e);
			return false;
		}
	};

	session.drainPendingIce = function (UUID, type) {
		try {
			const key = session.getPendingIceKey(UUID, type);
			const queue = session.pendingIceCandidates[key];
			if (!queue || !queue.length) {
				return 0;
			}

			delete session.pendingIceCandidates[key];

			const now = Date.now();
			const ttl = parseInt(session.pendingIceTTL) || 15000;
			let drained = 0;
			let expired = 0;
			let mismatched = 0;

			for (let i = 0; i < queue.length; i++) {
				const item = queue[i];
				if (!item || !item.candidate) {
					continue;
				}
				if (now - item.ts > ttl) {
					expired += 1;
					continue;
				}

				if (type === "remote") {
					if (!(UUID in session.pcs)) {
						continue;
					}
					const pc = session.pcs[UUID];
					if (
						("session" in item) &&
						(item.session !== undefined) &&
						(item.session !== null) &&
						pc.session &&
						(pc.session != item.session)
					) {
						mismatched += 1;
						continue;
					}
					pc
						.addIceCandidate(item.candidate)
						.then()
						.catch(function (e) {
							warnlog("Failed to add queued ICE candidate: " + e.message);
						});
					drained += 1;
				} else if (type === "local") {
					if (!(UUID in session.rpcs) || session.rpcs[UUID] === null) {
						continue;
					}
					const rpc = session.rpcs[UUID];
					if (
						("session" in item) &&
						(item.session !== undefined) &&
						(item.session !== null) &&
						rpc.session &&
						(rpc.session != item.session)
					) {
						mismatched += 1;
						continue;
					}
					rpc
						.addIceCandidate(item.candidate)
						.then()
						.catch(function (e) {
							warnlog("Failed to add queued ICE candidate: " + e.message);
						});
					drained += 1;
				}
			}

			if (expired) {
				session.bumpReliabilityCounter("ice_queue_expired", expired);
				warnlog("Dropped stale queued ICE candidates during drain: " + expired);
			}
			if (mismatched) {
				warnlog("Skipped queued ICE candidates due to session mismatch: " + mismatched);
			}
			if (drained) {
				warnlog("Drained queued ICE candidates: " + drained + " for " + UUID + " (" + type + ")");
			}
			return drained;
		} catch (e) {
			errorlog(e);
			return 0;
		}
	};

	session.clearPendingIceForUUID = function (UUID, type = false) {
		try {
			if (!UUID || !session.pendingIceCandidates) {
				return;
			}
			if (type) {
				// Inbound and outbound peers share a UUID, but own separate ICE queues.
				delete session.pendingIceCandidates[session.getPendingIceKey(UUID, type)];
			} else {
				delete session.pendingIceCandidates[session.getPendingIceKey(UUID, "remote")];
				delete session.pendingIceCandidates[session.getPendingIceKey(UUID, "local")];
				delete session.pendingIceCandidates[session.getPendingIceKey(UUID, "unknown")];
			}
		} catch (e) {
			errorlog(e);
		}
	};


	session.encryptMessage = function (message, phrase = session.password + session.salt) {
		var vector = crypto.getRandomValues(new Uint8Array(16));
		return crypto.subtle
			.digest({ name: "SHA-256" }, convertStringToArrayBufferView(phrase))
			.then(function (result) {
				return window.crypto.subtle.importKey("raw", result, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]).then(
					function (key) {
						return crypto.subtle.encrypt({ name: "AES-CBC", iv: vector }, key, convertStringToArrayBufferView(message)).then(
							function (result) {
								encrypted_data = new Uint8Array(result);
								encrypted_data = toHexString(encrypted_data);
								vector = toHexString(vector);
								return [encrypted_data, vector];
							},
							function (e) {
								errorlog(e.message);
								return false;
							}
						);
					},
					function (e) {
						errorlog(e);
						return false;
					}
				);
			})
			.catch(errorlog);
	};

	session.decryptMessage = function (encrypted_data, vector, phrase = session.password + session.salt) {
		encrypted_data = toByteArray(encrypted_data);
		vector = toByteArray(vector);
		return crypto.subtle
			.digest({ name: "SHA-256" }, convertStringToArrayBufferView(phrase))
			.then(function (result) {
				return window.crypto.subtle.importKey("raw", result, { name: "AES-CBC" }, false, ["encrypt", "decrypt"]).then(function (key) {
					return crypto.subtle.decrypt({ name: "AES-CBC", iv: vector }, key, encrypted_data).then(
						function (result2) {
							var decrypted_data = new Uint8Array(result2);
							var str = "";
							for (var iii = 0; iii < decrypted_data.byteLength; iii++) {
								str += String.fromCharCode(decrypted_data[iii]);
							}
							return str;
						},
						function (e) {
							errorlog(vector);
							errorlog(encrypted_data);
							errorlog(e);
							return false;
						}
					);
				});
			})
			.catch(errorlog);
	};

	session.decodeRemote = async function (msg) {
		if (typeof msg.remote !== "object") {
			return msg;
		}
		try {
			if (msg.remote.length == 2) {
				if (!session.remoteHash) {
					session.remoteHash = await generateHash(session.remote + session.salt, 12);
				}
				msg.remote = await session.decryptMessage(msg.remote[0], msg.remote[1], session.remoteHash);
				if (msg.remote) {
					log("Remote request decoded successfully");
				} else {
					warnlog("Remote request failed to decode; continuing still.");
				}
				log(msg);
			}
		} catch (e) {
			errorlog(e);
		}
		return msg;
	};

	session.encodeRemote = async function (data) {
		try {
			if (data.remote && typeof data.remote === "string") {
				var remoteHash = await generateHash(data.remote + session.salt, 12);
				data.remote = await session.encryptMessage(data.remote, remoteHash);
			}
		} catch (e) {
			errorlog(e);
		}
		return data;
	};

	session.decodeInvite = function (decrypted) {
		try {
			try {
				decrypted = decodeURIComponent(decrypted.replace(/ /g, "+"));
			} catch (e) { }

			decrypted = CryptoJS.AES.decrypt(decrypted, "OBSNINJAFORLIFE");
			decrypted = decrypted.toString(CryptoJS.enc.Utf8);

			if (decrypted) {
				if (decrypted.startsWith("http://")) {
					decrypted = decrypted.replace("http://", "");
				} else if (decrypted.startsWith("https://")) {
					decrypted = decrypted.replace("https://", "");
				} else if (decrypted.startsWith("/")) {
					decrypted = decrypted.replace("/", "");
				} else if (decrypted.startsWith("obs.ninja/")) {
					decrypted = decrypted.replace("obs.ninja/", "");
				} else if (decrypted.startsWith("vdo.ninja/")) {
					decrypted = decrypted.replace("vdo.ninja/", "");
				} else if (decrypted.startsWith("backup.vdo.ninja/")) {
					decrypted = decrypted.replace("backup.vdo.ninja/", "");
				}

				decrypted = decrypted.split("?").splice(1).join("?");

				if (decrypted) {
					decrypted = "?" + decrypted.replace(/\?/g, "&");
					session.decrypted = decrypted;
				}
			}
		} catch (e) {
			warnlog(e);
		}
	};

	session.requestKeyframe = function (UUID, scene = false) {
		var msg = {};
		msg.keyframe = true;
		msg.scene = scene;
		session.sendRequest(msg, UUID); // I'm not going to bother to check if this works or not.
	};

	session.requestAudioRateLimit = function (bandwidth, UUID, lock = null) {
		// let's keep it simple, since its not used often.
		if (!session.rpcs[UUID]) {
			return false; // is not defined. probably disconnected.
		}

		var msg = {};
		if (lock !== null) {
			// override mode; lock state might be changed
			session.rpcs[UUID].lockedAudioBitrate = lock || false;
		} else if (session.rpcs[UUID].lockedAudioBitrate) {
			warnlog("Audio Bitrate is locked; can't update");
			return;
		}
		msg.audioBitrate = bandwidth;
		log(msg);
		if (session.sendRequest(msg, UUID)) {
			session.rpcs[UUID].audioBandwidth = bandwidth; // keep the requestRateLimit dedupe mirror honest
		}
	};

	session.requestRateLimit = function (bandwidth, UUID, optimizeAudio = false, lock = null) {
		log("requestRateLimit RUN: " + optimizeAudio);

		if (!session.rpcs[UUID] || !session.rpcs[UUID].getStats) {
			return false; // is not defined. probably disconnected.
		}

		if (lock !== null) {
			// override mode; lock state might be changed
			session.rpcs[UUID].lockedVideoBitrate = lock || false;
		} else if (session.rpcs[UUID].lockedVideoBitrate) {
			warnlog("Video Bitrate is locked; can't update");
			return;
		}

		if (bandwidth === false) {
			// Just retry setting it.
			//if (session.rpcs[UUID].targetBandwidth===session.rpcs[UUID].bandwidth){ // already set
			//	return false;
			//}
		} else {
			session.rpcs[UUID].targetBandwidth = bandwidth;
		}

		var audioBitrate = -1;
		//if (session.rpcs[UUID].manualAudioBandwidth!==false){
		//	audioBitrate = session.rpcs[UUID].manualAudioBandwidth;
		//}

		if (session.rpcs[UUID].manualBandwidth !== false) {
			// override the bandwidth; false is off
			bandwidth = parseInt(session.rpcs[UUID].manualBandwidth);
		} else {
			bandwidth = parseInt(session.rpcs[UUID].targetBandwidth);
		}

		if (session.obsState.visibility === false) {
			if (session.optimize !== false) {
				if (window.obsstudio) {
					return false;
				}
			}
		} else if (session.motionSwitch && bandwidth === 0) {
			// in case we are in motion-detection mode, we don't want to disable background videos
			return false;
		}

		if (bandwidth === 0 && session.rpcs[UUID].remoteMuteState) {
			bandwidth = 1;
		}

		var msg = {};
		msg.bitrate = bandwidth;

		if (optimizeAudio === null) {
			// skip audio
		} else if (optimizeAudio) {
			if (bandwidth === 0) {
				warnlog("OPTIMIZED AUDIO ENABLED; zero bitrate");
				msg.audioBitrate = 0;
			} else {
				if (audioBitrate < 16 && audioBitrate >= 0) {
					msg.audioBitrate = audioBitrate;
				} else {
					msg.audioBitrate = 16;
				}
			}
		} else if (lock === null) {
			// not using the iframe API, as IFRAME API is normally true/false only.
			msg.audioBitrate = audioBitrate; // -1 ? unlock bitrate
		}

		// Dedupe on the video bitrate, and on the audio directive only when this message carries one;
		// an audio change at an unchanged video bitrate (e.g. audio restored while video stays disabled)
		// must still be sent, or the remote guest stays muted. Messages without an audioBitrate
		// (lock / iframe API calls) must not touch the audio mirror.
		var hasAudio = "audioBitrate" in msg;
		if (session.rpcs[UUID].bandwidth === bandwidth) {
			if (!hasAudio || session.rpcs[UUID].audioBandwidth === msg.audioBitrate) {
				return false; // already set
			}
		}

		log("request rate limit: " + bandwidth);

		if (session.sendRequest(msg, UUID)) {
			session.rpcs[UUID].bandwidth = bandwidth;
			if (hasAudio) {
				session.rpcs[UUID].audioBandwidth = msg.audioBitrate;
			}
			return true;
		} else {
			setTimeout(function setratelimitfunc() {
				session.requestRateLimit(false, UUID);
			}, 5000); // just try re-setting it if it didn't work
			warnlog("couldn't set rate limit");
			return false;
		}
	};

	session.sendGenericData = function (data, UUID = false, streamID = false, type = false) {
		var sent = false;
		var msg = {};
		msg.pipe = data;
		try {
			if (!UUID && !streamID) {
				if (type == "rpcs") {
					session.sendRequest(msg);
				} else if (type == "pcs") {
					session.sendMessage(msg);
				} else {
					session.sendPeers(msg);
				}
				sent = true;
			} else if (UUID) {
				UUID = UUID + "";
				if (type == "rpcs") {
					session.sendRequest(msg, UUID);
				} else if (type == "pcs") {
					session.sendMessage(msg, UUID);
				} else {
					session.sendPeers(msg, UUID);
				}
				sent = true;
			} else if (streamID) {
				streamID = streamID + "";
				for (var uuid in session.rpcs) {
					if (session.rpcs[uuid].streamID === streamID) {
						if (type == "rpcs") {
							session.sendRequest(msg, uuid);
						} else if (type == "pcs") {
							session.sendMessage(msg, uuid);
						} else {
							session.sendPeers(msg, uuid);
						}
						sent = true;
					}
				}
			}
			return sent;
		} catch (e) {
			return false;
		}
	};

	session.gotGenericData = function (data, UUID) {
		var msg = {};
		msg.dataReceived = {};
		msg.dataReceived = data;
		if (UUID !== null) {
			msg.UUID = UUID;
		}

		if (isIFrame) {
			parent.postMessage(msg, session.iframetarget);
		} else if (data.overlayNinja && !isIFrame) {
			// don't send back to self.
			getChatMessage(data.overlayNinja.chatmessage, data.overlayNinja.chatname, false, false); // don't send to iframes, since its coming from an iframe probably.
		}
	};

	session.directorSpeakerMute = function () {
		if (session.directorSpeakerMuted === null) {
			return;
		} // not set.
		for (var uuid in session.rpcs) {
			try {
				var receivers = getReceivers2(uuid); //session.rpcs[uuid].getReceivers();
				for (var i = 0; i < receivers.length; i++) {
					if (receivers[i].track.kind == "audio") {
						// FIX: Only use double-set workaround for Chrome 133+
						// Firefox may mishandle the rapid enabled state changes
						if (ChromiumVersion && ChromiumVersion >= 133) {
							receivers[i].track.enabled = true;
						}
						receivers[i].track.enabled = !session.directorSpeakerMuted;
					}
				}
			} catch (e) { }
		}
		if (session.directorSpeakerMuted) {
			getById("videosource").muted = true;
		}
	};

	session.directorDisplayMute = function () {
		if (session.directorDisplayMuted === null) {
			return;
		} // not set.

		if (session.directorDisplayMuted) {
			getById("gridlayout").classList.add("hidden");
			if (!session.cleanOutput) {
				warnUser(getTranslation("vision-disabled"), false, false);
			}
		} else {
			getById("gridlayout").classList.remove("hidden");
			if (!session.cleanOutput) {
				closeModal();
			}
		}

		for (var uuid in session.rpcs) {
			try {
				var receivers = getReceivers2(uuid); //session.rpcs[uuid].getReceivers();
				for (var i = 0; i < receivers.length; i++) {
					if (receivers[i].track.kind == "video") {
						receivers[i].track.enabled = true; // Chrome 133+ fix: must enable before disabling
						receivers[i].track.enabled = !session.directorDisplayMuted;
					}
				}
			} catch (e) {
				errorlog(e);
			}
		}
		if (session.directorDisplayMuted) {
			getById("videosource").muted = true;
		}
	};

	function isWebStreamTakeoverEligible() {
		if (session.streamtakeover !== true) {
			return false;
		}
		try {
			if (window.self !== window.top) {
				return false;
			}
		} catch (e) {
			return false;
		}
		if (
			session.customWSS !== false ||
			session.director ||
			session.directorState ||
			session.scene !== false ||
			session.audience ||
			session.bypass ||
			session.whipOut ||
			session.whipOutput
		) {
			return false;
		}
		if (
			window.isSecureContext === false ||
			!window.crypto ||
			!window.crypto.subtle ||
			!window.indexedDB ||
			!window.TextEncoder
		) {
			return false;
		}
		return normalizeWebStreamTakeoverEndpoint() !== null;
	}

	function normalizeWebStreamTakeoverEndpoint() {
		try {
			var endpoint = new URL(String(session.wss || ""), window.location.href);
			var protocol = endpoint.protocol.toLowerCase();
			var hostname = endpoint.hostname.toLowerCase();
			var loopback = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
			if (endpoint.username || endpoint.password || !hostname) {
				return null;
			}
			if (protocol !== "wss:" && !(protocol === "ws:" && loopback)) {
				return null;
			}
			if (hostname.indexOf(":") !== -1 && hostname.charAt(0) !== "[") {
				hostname = "[" + hostname + "]";
			}
			var port = endpoint.port || (protocol === "wss:" ? "443" : "80");
			return protocol + "//" + hostname + ":" + port + (endpoint.pathname || "/");
		} catch (e) {
			return null;
		}
	}

	function encodeWebStreamTakeoverBase64Url(value) {
		var bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
		var binary = "";
		for (var i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window
			.btoa(binary)
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/g, "");
	}

	function decodeWebStreamTakeoverBase64Url(value, exactLength) {
		if (typeof value !== "string" || !value || !/^[A-Za-z0-9_-]+$/.test(value)) {
			return null;
		}
		try {
			var normalized = value.replace(/-/g, "+").replace(/_/g, "/");
			var padding = (4 - (normalized.length % 4)) % 4;
			var binary = window.atob(normalized + "=".repeat(padding));
			if (binary.length !== exactLength) {
				return null;
			}
			var bytes = new Uint8Array(binary.length);
			for (var i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			if (encodeWebStreamTakeoverBase64Url(bytes) !== value) {
				return null;
			}
			return bytes;
		} catch (e) {
			return null;
		}
	}

	function encodeWebStreamTakeoverDerInteger(value) {
		var start = 0;
		while (start < value.length - 1 && value[start] === 0) {
			start += 1;
		}
		var needsLeadingZero = (value[start] & 0x80) !== 0;
		var length = value.length - start + (needsLeadingZero ? 1 : 0);
		var encoded = new Uint8Array(2 + length);
		encoded[0] = 0x02;
		encoded[1] = length;
		var offset = 2;
		if (needsLeadingZero) {
			encoded[offset] = 0;
			offset += 1;
		}
		encoded.set(value.subarray(start), offset);
		return encoded;
	}

	function convertWebStreamTakeoverSignatureToDer(value) {
		var signature = value instanceof Uint8Array ? value : new Uint8Array(value);
		if (signature.length !== 64) {
			throw new Error("Unexpected WebCrypto ECDSA signature format");
		}
		var r = encodeWebStreamTakeoverDerInteger(signature.subarray(0, 32));
		var s = encodeWebStreamTakeoverDerInteger(signature.subarray(32));
		var der = new Uint8Array(2 + r.length + s.length);
		der[0] = 0x30;
		der[1] = r.length + s.length;
		der.set(r, 2);
		der.set(s, 2 + r.length);
		return der;
	}

	function getWebStreamTakeoverHolderID() {
		if (webStreamTakeoverHolderID) {
			return webStreamTakeoverHolderID;
		}
		var holderBytes = new Uint8Array(16);
		window.crypto.getRandomValues(holderBytes);
		webStreamTakeoverHolderID = encodeWebStreamTakeoverBase64Url(holderBytes);
		return webStreamTakeoverHolderID;
	}

	function normalizeWebStreamTakeoverRoomScope(roomID) {
		if (roomID === null || roomID === false || typeof roomID === "undefined" || roomID === "") {
			return WEB_STREAM_TAKEOVER_DIRECT_SCOPE;
		}
		return "r:" + String(roomID).toLowerCase();
	}

	function getCurrentWebStreamTakeoverRoomScope() {
		return webStreamTakeoverRoomScope;
	}

	function stopWebStreamTakeoverLease(expectedSocket) {
		if (
			expectedSocket &&
			webStreamTakeoverActiveSeed &&
			webStreamTakeoverActiveSeed.socket !== expectedSocket
		) {
			return;
		}
		if (webStreamTakeoverLeaseTimer) {
			clearTimeout(webStreamTakeoverLeaseTimer);
			webStreamTakeoverLeaseTimer = null;
		}
		webStreamTakeoverActiveSeed = null;
	}

	function setWebStreamTakeoverRoomScope(roomID) {
		if (session.streamtakeover !== true || session.customWSS !== false) {
			return;
		}
		var nextScope = normalizeWebStreamTakeoverRoomScope(roomID);
		if (nextScope !== webStreamTakeoverRoomScope) {
			stopWebStreamTakeoverLease();
			webStreamTakeoverRoomScope = nextScope;
		}
	}

	async function getWebStreamTakeoverAlias(endpoint, roomScope, wireStreamID) {
		var scope =
			"vdo-hss-takeover-key-v2\u0000" +
			endpoint +
			"\u0000" +
			roomScope +
			"\u0000" +
			wireStreamID;
		var digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(scope));
		var bytes = new Uint8Array(digest);
		var hex = "";
		for (var i = 0; i < bytes.length; i++) {
			hex += bytes[i].toString(16).padStart(2, "0");
		}
		return "vdo_hss_takeover_v2_" + hex;
	}

	function openWebStreamTakeoverDatabase() {
		if (webStreamTakeoverDatabasePromise) {
			return webStreamTakeoverDatabasePromise;
		}
		webStreamTakeoverDatabasePromise = new Promise(function (resolve, reject) {
			var request = window.indexedDB.open(WEB_STREAM_TAKEOVER_DATABASE, 1);
			request.onupgradeneeded = function () {
				var database = request.result;
				if (!database.objectStoreNames.contains(WEB_STREAM_TAKEOVER_STORE)) {
					database.createObjectStore(WEB_STREAM_TAKEOVER_STORE, { keyPath: "alias" });
				}
			};
			request.onsuccess = function () {
				var database = request.result;
				database.onversionchange = function () {
					database.close();
				};
				resolve(database);
			};
			request.onerror = function () {
				reject(request.error || new Error("Unable to open takeover key storage"));
			};
			request.onblocked = function () {
				reject(new Error("Takeover key storage is blocked"));
			};
		}).catch(function (error) {
			webStreamTakeoverDatabasePromise = null;
			throw error;
		});
		return webStreamTakeoverDatabasePromise;
	}

	async function readWebStreamTakeoverKey(alias) {
		var database = await openWebStreamTakeoverDatabase();
		return new Promise(function (resolve, reject) {
			var transaction = database.transaction(WEB_STREAM_TAKEOVER_STORE, "readonly");
			var request = transaction.objectStore(WEB_STREAM_TAKEOVER_STORE).get(alias);
			request.onsuccess = function () {
				resolve(request.result || null);
			};
			request.onerror = function () {
				reject(request.error || new Error("Unable to read takeover key"));
			};
		});
	}

	async function addWebStreamTakeoverKey(record) {
		var database = await openWebStreamTakeoverDatabase();
		return new Promise(function (resolve, reject) {
			var transaction = database.transaction(WEB_STREAM_TAKEOVER_STORE, "readwrite");
			var request = transaction.objectStore(WEB_STREAM_TAKEOVER_STORE).add(record);
			transaction.oncomplete = function () {
				resolve(record);
			};
			transaction.onabort = function () {
				reject(request.error || transaction.error || new Error("Unable to store takeover key"));
			};
			transaction.onerror = function () {};
		});
	}

	async function deleteWebStreamTakeoverKeyIfUnchanged(alias, expectedRecord) {
		if (session.streamtakeover !== true) {
			return false;
		}
		var database = await openWebStreamTakeoverDatabase();
		return new Promise(function (resolve, reject) {
			var deleted = false;
			var transaction = database.transaction(WEB_STREAM_TAKEOVER_STORE, "readwrite");
			var store = transaction.objectStore(WEB_STREAM_TAKEOVER_STORE);
			var request = store.get(alias);
			request.onsuccess = function () {
				var current = request.result || null;
				if (
					current &&
					expectedRecord &&
					current.alias === expectedRecord.alias &&
					current.publicKey === expectedRecord.publicKey &&
					current.lastActiveAt === expectedRecord.lastActiveAt
				) {
					store.delete(alias);
					deleted = true;
				}
			};
			transaction.oncomplete = function () {
				resolve(deleted);
			};
			transaction.onabort = function () {
				reject(transaction.error || new Error("Unable to remove expired takeover key"));
			};
			transaction.onerror = function () {};
		});
	}

	function validateWebStreamTakeoverKey(record, alias, now) {
		if (!record || record.alias !== alias || typeof record.publicKey !== "string") {
			return null;
		}
		if (
			typeof record.lastActiveAt !== "number" ||
			!Number.isFinite(record.lastActiveAt) ||
			record.lastActiveAt > now ||
			now - record.lastActiveAt > WEB_STREAM_TAKEOVER_KEY_MAX_IDLE_MS
		) {
			return null;
		}
		var publicKey = decodeWebStreamTakeoverBase64Url(record.publicKey, 65);
		var privateKey = record.privateKey;
		if (
			!publicKey ||
			publicKey[0] !== 0x04 ||
			!privateKey ||
			privateKey.type !== "private" ||
			privateKey.extractable !== false ||
			!privateKey.algorithm ||
			privateKey.algorithm.name !== "ECDSA" ||
			privateKey.algorithm.namedCurve !== "P-256" ||
			!privateKey.usages ||
			privateKey.usages.indexOf("sign") === -1
		) {
			return null;
		}
		return {
			alias: alias,
			privateKey: privateKey,
			publicKey: record.publicKey,
			lastActiveAt: record.lastActiveAt
		};
	}

	async function renewWebStreamTakeoverKey(alias, publicKey, now) {
		if (session.streamtakeover !== true) {
			return false;
		}
		var holderID = getWebStreamTakeoverHolderID();
		var database = await openWebStreamTakeoverDatabase();
		return new Promise(function (resolve, reject) {
			var renewed = false;
			var transaction = database.transaction(WEB_STREAM_TAKEOVER_STORE, "readwrite");
			var store = transaction.objectStore(WEB_STREAM_TAKEOVER_STORE);
			var request = store.get(alias);
			request.onsuccess = function () {
				var record = request.result || null;
				if (
					!record ||
					record.alias !== alias ||
					record.publicKey !== publicKey ||
					typeof record.lastActiveAt !== "number" ||
					!Number.isFinite(record.lastActiveAt) ||
					record.lastActiveAt > now ||
					now - record.lastActiveAt > WEB_STREAM_TAKEOVER_KEY_MAX_IDLE_MS
				) {
					return;
				}
				var holders = record.holders;
				if (!holders || typeof holders !== "object" || Array.isArray(holders)) {
					holders = {};
				}
				holders[holderID] = now;
				record.holders = holders;
				record.lastActiveAt = now;
				store.put(record);
				renewed = true;
			};
			transaction.oncomplete = function () {
				resolve(renewed);
			};
			transaction.onabort = function () {
				reject(transaction.error || new Error("Unable to renew takeover key"));
			};
			transaction.onerror = function () {};
		});
	}

	async function releaseWebStreamTakeoverKey(alias, publicKey, deleteIfLastHolder, authorizedCleanup) {
		if (session.streamtakeover !== true && authorizedCleanup !== true) {
			return { deleted: false, retryAfterMs: 0 };
		}
		var holderID = getWebStreamTakeoverHolderID();
		var now = Date.now();
		var database = await openWebStreamTakeoverDatabase();
		return new Promise(function (resolve, reject) {
			var result = { deleted: false, retryAfterMs: 0 };
			var transaction = database.transaction(WEB_STREAM_TAKEOVER_STORE, "readwrite");
			var store = transaction.objectStore(WEB_STREAM_TAKEOVER_STORE);
			var request = store.get(alias);
			request.onsuccess = function () {
				var record = request.result || null;
				if (!record) {
					result.deleted = true;
					return;
				}
				if (record.alias !== alias || record.publicKey !== publicKey) {
					return;
				}
				var holders = record.holders;
				if (!holders || typeof holders !== "object" || Array.isArray(holders)) {
					holders = {};
				}
				delete holders[holderID];
				var holderIDs = Object.keys(holders);
				var freshHolderCount = 0;
				var latestExpiry = 0;
				for (var i = 0; i < holderIDs.length; i++) {
					var timestamp = holders[holderIDs[i]];
					if (
						typeof timestamp !== "number" ||
						!Number.isFinite(timestamp) ||
						timestamp > now ||
						now - timestamp > WEB_STREAM_TAKEOVER_HOLDER_STALE_MS
					) {
						delete holders[holderIDs[i]];
						continue;
					}
					freshHolderCount += 1;
					latestExpiry = Math.max(latestExpiry, timestamp + WEB_STREAM_TAKEOVER_HOLDER_STALE_MS);
				}

				if (deleteIfLastHolder && freshHolderCount === 0) {
					store.delete(alias);
					result.deleted = true;
					return;
				}
				record.holders = holders;
				store.put(record);
				if (deleteIfLastHolder && latestExpiry > now) {
					result.retryAfterMs = latestExpiry - now + 100;
				}
			};
			transaction.oncomplete = function () {
				resolve(result);
			};
			transaction.onabort = function () {
				reject(transaction.error || new Error("Unable to release takeover key"));
			};
			transaction.onerror = function () {};
		});
	}

	async function loadOrCreateWebStreamTakeoverKey(alias) {
		for (var attempt = 0; attempt < 4; attempt++) {
			if (session.streamtakeover !== true) {
				return null;
			}
			var now = Date.now();
			var storedRecord = await readWebStreamTakeoverKey(alias);
			var existing = validateWebStreamTakeoverKey(storedRecord, alias, now);
			if (existing) {
				if (await renewWebStreamTakeoverKey(alias, existing.publicKey, now)) {
					existing.lastActiveAt = now;
					return existing;
				}
				continue;
			}
			if (storedRecord) {
				if (!(await deleteWebStreamTakeoverKeyIfUnchanged(alias, storedRecord))) {
					continue;
				}
			}

			var keyPair = await window.crypto.subtle.generateKey(
				{ name: "ECDSA", namedCurve: "P-256" },
				false,
				["sign", "verify"]
			);
			if (session.streamtakeover !== true) {
				return null;
			}
			if (!keyPair.privateKey || keyPair.privateKey.extractable !== false) {
				throw new Error("The browser did not create a non-extractable private key");
			}
			var publicKeyRaw = new Uint8Array(await window.crypto.subtle.exportKey("raw", keyPair.publicKey));
			if (publicKeyRaw.length !== 65 || publicKeyRaw[0] !== 0x04) {
				throw new Error("The browser returned an unsupported public key format");
			}
			now = Date.now();
			var holders = {};
			holders[getWebStreamTakeoverHolderID()] = now;
			var record = {
				alias: alias,
				privateKey: keyPair.privateKey,
				publicKey: encodeWebStreamTakeoverBase64Url(publicKeyRaw),
				createdAt: now,
				lastActiveAt: now,
				holders: holders
			};
			try {
				await addWebStreamTakeoverKey(record);
				return validateWebStreamTakeoverKey(record, alias, now);
			} catch (error) {
				if (error && error.name === "ConstraintError") {
					continue;
				}
				throw error;
			}
		}
		throw new Error("Unable to establish a current takeover key");
	}

	async function getWebStreamTakeoverKey(alias) {
		if (session.streamtakeover !== true) {
			return null;
		}
		if (!webStreamTakeoverKeyPromises[alias]) {
			webStreamTakeoverKeyPromises[alias] = loadOrCreateWebStreamTakeoverKey(alias);
		}
		var keyPromise = webStreamTakeoverKeyPromises[alias];
		try {
			return await keyPromise;
		} catch (error) {
			throw error;
		} finally {
			if (webStreamTakeoverKeyPromises[alias] === keyPromise) {
				delete webStreamTakeoverKeyPromises[alias];
			}
		}
	}

	function isWebStreamTakeoverLeaseCurrent(activeSeed) {
		return Boolean(
			activeSeed &&
			webStreamTakeoverActiveSeed === activeSeed &&
			isWebStreamTakeoverEligible() &&
			session.ws === activeSeed.socket &&
			activeSeed.socket &&
			activeSeed.socket.readyState === 1 &&
			session.seeding === true &&
			activeSeed.endpoint === normalizeWebStreamTakeoverEndpoint() &&
			activeSeed.roomScope === getCurrentWebStreamTakeoverRoomScope() &&
			activeSeed.wireStreamID === getCurrentWebStreamTakeoverWireStreamID()
		);
	}

	function scheduleWebStreamTakeoverLease(activeSeed) {
		if (webStreamTakeoverLeaseTimer) {
			clearTimeout(webStreamTakeoverLeaseTimer);
		}
		webStreamTakeoverLeaseTimer = setTimeout(async function () {
			webStreamTakeoverLeaseTimer = null;
			if (!isWebStreamTakeoverLeaseCurrent(activeSeed)) {
				if (webStreamTakeoverActiveSeed === activeSeed) {
					webStreamTakeoverActiveSeed = null;
				}
				return;
			}
			var renewed = false;
			try {
				renewed = await renewWebStreamTakeoverKey(activeSeed.alias, activeSeed.publicKey, Date.now());
			} catch (error) {
				warnlog("Web stream takeover lease renewal failed; the current stream remains connected.");
			}
			if (!renewed) {
				if (webStreamTakeoverActiveSeed === activeSeed) {
					webStreamTakeoverActiveSeed = null;
				}
				return;
			}
			if (isWebStreamTakeoverLeaseCurrent(activeSeed)) {
				scheduleWebStreamTakeoverLease(activeSeed);
			}
		}, WEB_STREAM_TAKEOVER_LEASE_INTERVAL_MS);
	}

	async function releaseAllWebStreamTakeoverKeys(deleteIfLastHolder) {
		if (session.streamtakeover !== true) {
			return [];
		}
		stopWebStreamTakeoverLease();
		var keys = webStreamTakeoverSessionKeys;
		webStreamTakeoverSessionKeys = Object.create(null);
		var aliases = Object.keys(keys);
		var releases = aliases.map(async function (alias) {
			var result = await releaseWebStreamTakeoverKey(alias, keys[alias], deleteIfLastHolder);
			delete webStreamTakeoverKeyPromises[alias];
			if (deleteIfLastHolder && !result.deleted && result.retryAfterMs > 0) {
				setTimeout(function () {
					releaseWebStreamTakeoverKey(alias, keys[alias], true, true).catch(function () {});
				}, result.retryAfterMs);
			}
			return result;
		});
		return Promise.all(releases);
	}

	session.releaseWebStreamTakeoverOnHangup = function () {
		if (session.streamtakeover !== true) {
			return Promise.resolve([]);
		}
		return releaseAllWebStreamTakeoverKeys(true);
	};

	window.addEventListener("pagehide", function () {
		if (session.streamtakeover === true) {
			releaseAllWebStreamTakeoverKeys(false).catch(function () {});
		}
	});

	async function getWebStreamTakeoverWireStreamID(streamID) {
		var wireStreamID = String(streamID || "");
		if (!wireStreamID) {
			return null;
		}
		if (session.password) {
			if (session.hash === false) {
				var generatedHash = await generateHash(session.password + session.salt, 6);
				if (typeof generatedHash !== "string" || generatedHash.length < 6) {
					return null;
				}
				session.hash = generatedHash;
			}
			if (typeof session.hash !== "string" || session.hash.length < 6) {
				return null;
			}
			wireStreamID = wireStreamID.substring(0, 64) + session.hash.substring(0, 6);
		}
		return wireStreamID;
	}

	function getCurrentWebStreamTakeoverWireStreamID() {
		var streamID = session.authMode && session.realStreamID ? session.realStreamID : session.streamID;
		if (!streamID) {
			return null;
		}
		streamID = String(streamID);
		if (session.password) {
			if (typeof session.hash !== "string" || session.hash.length < 6) {
				return null;
			}
			streamID = streamID.substring(0, 64) + session.hash.substring(0, 6);
		}
		return streamID;
	}

	async function prepareWebStreamTakeover(streamID) {
		if (!isWebStreamTakeoverEligible()) {
			return null;
		}
		var endpoint = normalizeWebStreamTakeoverEndpoint();
		var roomScope = getCurrentWebStreamTakeoverRoomScope();
		var wireStreamID = await getWebStreamTakeoverWireStreamID(streamID);
		if (!endpoint || !roomScope || !wireStreamID) {
			return null;
		}
		var alias = await getWebStreamTakeoverAlias(endpoint, roomScope, wireStreamID);
		var key = await getWebStreamTakeoverKey(alias);
		if (!key) {
			return null;
		}
		return {
			alias: alias,
			endpoint: endpoint,
			roomScope: roomScope,
			wireStreamID: wireStreamID,
			privateKey: key.privateKey,
			publicKey: key.publicKey
		};
	}

	async function respondToWebStreamTakeoverChallenge(msg, socket) {
		var activeSeed = webStreamTakeoverActiveSeed;
		if (
			!isWebStreamTakeoverEligible() ||
			!activeSeed ||
			!socket ||
			session.ws !== socket ||
			activeSeed.socket !== socket ||
			socket.readyState !== 1 ||
			session.seeding !== true ||
			msg.v !== WEB_STREAM_TAKEOVER_VERSION ||
			typeof msg.expiresInMs !== "number" ||
			msg.expiresInMs <= 0 ||
			msg.expiresInMs > 5000 ||
			activeSeed.endpoint !== normalizeWebStreamTakeoverEndpoint() ||
			activeSeed.roomScope !== getCurrentWebStreamTakeoverRoomScope() ||
			activeSeed.wireStreamID !== getCurrentWebStreamTakeoverWireStreamID()
		) {
			return;
		}
		var challenge = decodeWebStreamTakeoverBase64Url(msg.challenge, 32);
		if (!challenge) {
			return;
		}
		try {
			var domain = new TextEncoder().encode(WEB_STREAM_TAKEOVER_DOMAIN);
			var signedBytes = new Uint8Array(domain.length + challenge.length);
			signedBytes.set(domain, 0);
			signedBytes.set(challenge, domain.length);
			var rawSignature = await window.crypto.subtle.sign(
				{ name: "ECDSA", hash: "SHA-256" },
				activeSeed.privateKey,
				signedBytes
			);
			var signature = convertWebStreamTakeoverSignatureToDer(rawSignature);
			if (
				webStreamTakeoverActiveSeed !== activeSeed ||
				!isWebStreamTakeoverEligible() ||
				session.ws !== socket ||
				activeSeed.socket !== socket ||
				socket.readyState !== 1 ||
				session.seeding !== true ||
				activeSeed.endpoint !== normalizeWebStreamTakeoverEndpoint() ||
				activeSeed.roomScope !== getCurrentWebStreamTakeoverRoomScope() ||
				activeSeed.wireStreamID !== getCurrentWebStreamTakeoverWireStreamID()
			) {
				return;
			}
			socket.send(
				JSON.stringify({
					request: "seedtakeoverproof",
					v: WEB_STREAM_TAKEOVER_VERSION,
					challenge: msg.challenge,
					signature: encodeWebStreamTakeoverBase64Url(signature)
				})
			);
		} catch (error) {
			warnlog("Web stream takeover proof was unavailable; using existing collision behavior.");
		}
	}

	function respondToServerPing(msg, socket) {
		if (session.customWSS !== false || !socket || socket.readyState !== 1) {
			return;
		}
		var response = { request: "pong" };
		if (Object.prototype.hasOwnProperty.call(msg, "id")) {
			response.id = msg.id;
		}
		try {
			// Send on the event's exact socket. The normal queued signaling helper
			// could replay this response after reconnecting on a different socket.
			socket.send(JSON.stringify(response));
		} catch (error) {
			warnlog("Server ping response could not be sent.");
		}
	}

	session.seedStream = async function () {
		await session.connect();
		if (session.shadowBanned) {
			log("Shadow mode: not seeding");
			return; // Don't seed if shadow banned
		} else if (session.joiningRoom !== false) {
			session.joiningRoom = "seedPlz"; // if we seed before we join the room, that seed won't be "private".  So we want to seed after we join.
			log("seeding blocked");
		} else if (session.doNotSeed) {
			log("doNotSeed!");
		} else {
			var msg = {};
			msg.request = "seed";
			// In auth mode with encryption, use the real stream ID on the handshake server
			if (session.authMode && session.realStreamID) {
				msg.streamID = session.realStreamID;
				log("Seeding with real stream ID: " + session.realStreamID);
			} else {
				msg.streamID = session.streamID;
			}
			if (session.streamtakeover === true) {
				if (!session.roomid && !session.roomenc) {
					setWebStreamTakeoverRoomScope(null);
				}
				stopWebStreamTakeoverLease();
				if (isWebStreamTakeoverEligible()) {
					try {
						var takeover = await prepareWebStreamTakeover(msg.streamID);
						if (
							!isWebStreamTakeoverEligible() ||
							(takeover && takeover.endpoint !== normalizeWebStreamTakeoverEndpoint()) ||
							(takeover && takeover.roomScope !== getCurrentWebStreamTakeoverRoomScope()) ||
							(takeover && takeover.wireStreamID !== getCurrentWebStreamTakeoverWireStreamID())
						) {
							takeover = null;
						}
						if (takeover) {
							msg.takeover = {
								v: WEB_STREAM_TAKEOVER_VERSION,
								publicKey: takeover.publicKey
							};
							webStreamTakeoverActiveSeed = {
								alias: takeover.alias,
								endpoint: takeover.endpoint,
								roomScope: takeover.roomScope,
								wireStreamID: takeover.wireStreamID,
								privateKey: takeover.privateKey,
								publicKey: takeover.publicKey,
								socket: session.ws
							};
							webStreamTakeoverSessionKeys[takeover.alias] = takeover.publicKey;
						} else {
							webStreamTakeoverActiveSeed = null;
						}
					} catch (error) {
						webStreamTakeoverActiveSeed = null;
						warnlog("Web stream takeover key was unavailable; using existing collision behavior.");
					}
				} else {
					webStreamTakeoverActiveSeed = null;
					if (!webStreamTakeoverWarningShown) {
						webStreamTakeoverWarningShown = true;
						warnlog("Web stream takeover is disabled for this signaling or session mode.");
					}
				}
			}
			session.sendMsg(msg);
			if (
				session.streamtakeover === true &&
				msg.takeover &&
				isWebStreamTakeoverLeaseCurrent(webStreamTakeoverActiveSeed)
			) {
				scheduleWebStreamTakeoverLease(webStreamTakeoverActiveSeed);
			}
			log("seeding !!");
			pokeAPI("seeding", true); // lets not say we are seeding unless connected.
			pokeIframeAPI("seeding-started", true);
			pokeIframeAPI("seeding", true);
		}
	};

	session.requestCoDirector = function () {
		getById("coDirectorEnable").disabled = true;
		getById("coDirectorEnable").title = "Only the main director can use this setting";
		getById("codirectorSettings").classList.add("hidden");

		if (session.directorPassword) {
			if (session.directorHash) {
				if (session.directorUUID) {
					if (session.directorUUID in session.rpcs) {
						if (session.rpcs[session.directorUUID].codirectorRequested === false) {
							session
								.encryptMessage(session.directorHash, session.directorHash)
								.then(function (enc) {
									var data = {};
									data.UUID = session.directorUUID;
									data.requestCoDirector = enc[0];
									data.vector = enc[1];
									if (session.rpcs[session.directorUUID].codirectorRequested === false) {
										if (session.sendRequest(data, data.UUID)) {
											session.rpcs[session.directorUUID].codirectorRequested = true;
										}
									}
								})
								.catch(errorlog);
						}
					}
				}
			} else {
				generateHash(session.directorPassword + session.salt + "abc123", 12)
					.then(function (hash) {
						// million to one error.
						session.directorHash = hash;
						if (session.directorUUID) {
							if (session.rpcs[session.directorUUID].codirectorRequested === false) {
								session
									.encryptMessage(session.directorHash, session.directorHash)
									.then(function (enc) {
										var data = {};
										data.UUID = session.directorUUID;
										data.requestCoDirector = enc[0];
										data.vector = enc[1];
										if (session.rpcs[session.directorUUID].codirectorRequested === false) {
											if (session.sendRequest(data, data.UUID)) {
												session.rpcs[session.directorUUID].codirectorRequested = true;
											}
										}
									})
									.catch(errorlog);
							}
						}
						return;
					})
					.catch(errorlog);
			}
		}
	};

	session.pixelFix = function (scale, UUID) {
		// This probably has become obsolete with Chrome v93.  Test and Remove sometimes soon.

		return scale; // the issue should be fixed as of January 4th 2022. Disable this function for now.

		/* if (getChromiumVersion() && (getChromiumVersion()>=93)){return scale;} // Until this function is removed, make sure it doesn't impact 
		
		try {
			if (!session.videoElement){return scale;}
			if (!session.videoElement.srcObject){return scale;}
			if (!session.videoElement.srcObject.getVideoTracks().length){return scale;}
			if (session.pcs[UUID].stats && ("_hardwareEncoder" in session.pcs[UUID].stats)){ // if the hardware encoder has been used.
				return scale;
			}
			
			if ((navigator.userAgent.indexOf(' Pixel ') != -1) || (navigator.userAgent.indexOf("Android 11") > -1) || (navigator.userAgent.indexOf("Android 12") > -1)){
				
				var nativeSettings = session.videoElement.srcObject.getVideoTracks()[0].getSettings();
				var nativeHeight = nativeSettings.height;
				var nativeWidth = nativeSettings.width;
				
				var stmp = scale;
				if (stmp>100){stmp=100;}
				
				var scaledHeight = nativeHeight*stmp/100;
				var scaledWidth = nativeWidth*stmp/100;
				
				if (scaledHeight<scaledWidth){
					scaledHeight = parseInt(scaledHeight / 16) * 16;
					var newScale = 100.0*scaledHeight/nativeHeight;
				} else {
					scaledWidth = parseInt(scaledWidth / 16) * 16;
					var newScale = 100.0*scaledWidth/nativeWidth;
				}
				if (newScale>=3){
					newScale = newScale-2;
				}
				return newScale;
			} else if (navigator.userAgent.indexOf("Android") > -1){
				
				var nativeSettings = session.videoElement.srcObject.getVideoTracks()[0].getSettings();
				var nativeHeight = nativeSettings.height;
				var nativeWidth = nativeSettings.width;
				
				var stmp = scale;
				if (stmp>100){stmp=100;}
				
				var scaledHeight = nativeHeight*stmp/100;
				var scaledWidth = nativeWidth*stmp/100;
				
				if (scaledHeight>scaledWidth){
					scaledWidth = parseInt(scaledWidth / 16) * 16;
					return 100.0*scaledWidth/nativeWidth;
				} 
				return scale;
			} else {
				return scale;
			}
		} catch(e){
			errorlog(e);
			return scale;
		} */
	};

	session.refreshScale = function (UUID = false) {
		log("Refreshing scale");
		if (UUID) {
			if (!session.pcs[UUID]) {
				return false;
			}
			if (session.pcs[UUID].scaleResolution !== false || session.pcs[UUID].scaleWidth !== false || session.pcs[UUID].scaleHeight !== false) {
				log("resolution scale: " + session.pcs[UUID].scaleWidth + " x " + session.pcs[UUID].scaleHeight);
				session.setResolution(UUID, session.pcs[UUID].scaleWidth, session.pcs[UUID].scaleHeight, session.pcs[UUID].scaleSnap, session.pcs[UUID].cover);
				return true;
			} else if (session.pcs[UUID].scale !== false) {
				log("scale scale");
				session.setScale(UUID, session.pcs[UUID].scale, true);
				return true;
			}
		} else {
			for (var UID in session.pcs) {
				setTimeout(
					function (uuid) {
						if (session.pcs[uuid].scaleResolution !== false || session.pcs[uuid].scaleWidth !== false || session.pcs[uuid].scaleHeight !== false) {
							log("resolution scale: " + session.pcs[uuid].scaleWidth + " x " + session.pcs[uuid].scaleHeight);
							session.setResolution(uuid, session.pcs[uuid].scaleWidth, session.pcs[uuid].scaleHeight, session.pcs[uuid].scaleSnap, session.pcs[uuid].cover);
						} else if (session.pcs[uuid].scale !== false) {
							log("scale scale");
							session.setScale(uuid, session.pcs[uuid].scale, true);
						}
					},
					0,
					UID
				);
			}
		}
		return false;
	};

	session.whipOutSetScale = function (scale = session.whipOutScale) {
		warnlog("WHIP OUT SET SCALING IS FIRING, which is GOOD !!!!!!");
		// session.whipOutScale
		if (session.whipOut.scale !== scale) {
			if (scale == null) {
				// probably will trigger a keyframe
				try {
					var senders = session.whipOut.getSenders().find(function (s) {
						return s.track && s.track.kind == "video";
					});
				} catch (e) {
					errorlog(e);
				}
				if (!senders) {
					warnlog("can't change bitrate; no video senders found");
					return;
				}

				var parameters = senders.getParameters();
				if (!parameters.encodings || parameters.encodings.length == 0) {
					parameters.encodings = [{}];
				}
				if ("scaleResolutionDownBy" in parameters.encodings[0]) {
					scale = 100 / parameters.encodings[0].scaleResolutionDownBy;
					scale = scale * 0.95;
				} else {
					scale = 95;
				}
			} else {
				session.whipOut.scale = scale;
			}

			try {
				if (SafariVersion && SafariVersion <= 13 && (iOS || iPad)) {
					log("iOS devices do not support dynamic bitrates correctly; skipping");
				} else if ("RTCRtpSender" in window && "setParameters" in window.RTCRtpSender.prototype) {
					try {
						var senders = session.whipOut.getSenders().find(function (s) {
							return s.track && s.track.kind == "video";
						});
					} catch (e) {
						errorlog(e);
					}
					if (!senders) {
						warnlog("can't change bitrate; no video senders found");
						return;
					}

					var settings = {};

					/////// RESOLUTION
					if (scale <= 0 || scale == 100) {
						// if "unlocked", get rid of resolution scale limit -1 = unlocked
						var chromeVersion = getChromiumVersion();
						if (chromeVersion > 80) {
							// just because
							settings.scaleResolutionDownBy = null;
						} else {
							settings.scaleResolutionDownBy = 1.0;
						}
					} else {
						// TODO:  CHECK TO SEE IF ITS ALREADY SET OR NOT. CANCEL IF ALREADY SET.  SET TIMEOUT ON senders SIDE: DON"T FLOOD.
						settings.scaleResolutionDownBy = 100.0 / scale; // group chat and director's room might see resolution limited; so 720p-> 240p
					}
					//////////////////////

					setEncodings(
						senders,
						settings,
						function (scl) {
							log("scale set!");
							pokeIframeAPI("setVideoScale", scl, "meshcast"); // deprecated
							pokeIframeAPI("set-video-scale", scl, "meshcast");
							session.whipOut.stats.scaleFactor = parseInt(scl) + "%";
						},
						scale
					);

					return;
				}
			} catch (e) {
				errorlog(e);
			}
		}
	};

	session.setScale = function (UUID, scale, force = false) {
		warnlog("SET SCALING IS FIRING, which is GOOD !!!!!! " + scale);

		try {
			session.pcs[UUID].stats.scaleFactor = scale;
		} catch (e) {
			errorlog(e);
		}

		if (!force && session.pcs[UUID].scale === scale) {
			return;
		} // already set.

		// if (!session.pcs[UUID].scaleSet && (session.pcs[UUID].scale===scale)){
		// var parameters = senders.getParameters();
		// if (parameters.encodings && parameters.encodings[0] && ("scaleResolutionDownBy" in parameters.encodings[0])){
		// test = 100 / parameters.encodings[0].scaleResolutionDownBy;
		// if (test == scale){
		// return; // already set.
		// }
		// }
		// }

		if (scale == null) {
			// this is an iPhone video glitch issue, where toggling the video's resolution unjams it.

			try {
				var senders = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});
			} catch (e) {
				errorlog(e);
			}
			if (!senders) {
				warnlog("can't change bitrate; no video senders found");
				return;
			}

			var parameters = senders.getParameters();
			if (!parameters.encodings || parameters.encodings.length == 0) {
				parameters.encodings = [{}];
			}
			if ("scaleResolutionDownBy" in parameters.encodings[0]) {
				scale = 100 / parameters.encodings[0].scaleResolutionDownBy;
				scale = scale * 0.95;
			} else {
				scale = 95;
			}
		} else {
			scale = Math.ceil(scale);
			session.pcs[UUID].scale = scale;
		}

		try {
			if (SafariVersion && SafariVersion <= 13 && (iOS || iPad)) {
				log("iOS devices do not support dynamic bitrates correctly; skipping");
			} else if ("RTCRtpSender" in window && "setParameters" in window.RTCRtpSender.prototype) {
				try {
					var senders = getSenders2(UUID).find(function (s) {
						return s.track && s.track.kind == "video";
					});
				} catch (e) {
					errorlog(e);
				}
				if (!senders) {
					warnlog("can't change bitrate; no video senders found");
					return;
				}

				scale = session.calculateScale(UUID, false, scale);

				/////// RESOLUTION

				var settings = {};

				if (scale <= 0 || scale == 100) {
					// if "unlocked", get rid of resolution scale limit -1 = unlocked
					var chromeVersion = getChromiumVersion();
					if (chromeVersion > 80) {
						// just because
						settings.scaleResolutionDownBy = null;
					} else {
						settings.scaleResolutionDownBy = 1.0;
					}
				} else {
					// TODO:  CHECK TO SEE IF ITS ALREADY SET OR NOT. CANCEL IF ALREADY SET.  SET TIMEOUT ON senders SIDE: DON"T FLOOD.
					settings.scaleResolutionDownBy = 100.0 / scale; // group chat and director's room might see resolution limited; so 720p-> 240p
				}
				//////////////////////

				setEncodings(
					senders,
					settings,
					function (arr) {
						log("scale set! " + arr[0]);
						pokeIframeAPI("setVideoScale", arr[0], arr[1]); // deprecated
						pokeIframeAPI("set-video-scale", arr[0], arr[1]);
						session.pcs[arr[1]].stats.scaleFactor = parseInt(arr[0]) + "%";
					},
					[scale, UUID]
				);

				return;
			}
		} catch (e) {
			errorlog(e);
		}
	};

	session.requestResolution = function (UUID, width, height, snap = false, requestAs = false, cover = null) {
		if (!(UUID in session.rpcs)) {
			return;
		}

		/* clearInterval(session.rpcs[UUID].optimizeRequestTimeout);
		if (session.rpcs[UUID].optimizeDelayFlag==false){
			session.rpcs[UUID].optimizeDelayFlag=true;
		} else {
			session.rpcs[UUID].optimizeRequestTimeout = setTimeout(function(uuid, w, h){
				if (session.rpcs[uuid]){
					session.rpcs[uuid].optimizeDelayFlag = false;
					session.requestResolution(uuid, w, h);
				}
			},2000, UUID, width, height);
			return;
		} */

		if (cover === null) {
			cover = session.cover || false;
		}

		var send = false;
		if (requestAs) {
			// Another viewer's request must not share this connection's resolution cache.
			send = true;
		} else {
			if (!(session.rpcs[UUID].scaleWidth == Math.floor(width) || session.rpcs[UUID].scaleWidth === Math.ceil(width))) {
				width = Math.round(width);
				session.rpcs[UUID].scaleWidth = width;
				send = true;
			}
			if (!(session.rpcs[UUID].scaleHeight == Math.floor(height) || session.rpcs[UUID].scaleHeight === Math.ceil(height))) {
				height = Math.round(height);
				session.rpcs[UUID].scaleHeight = height;
				send = true;
			}

			if (session.rpcs[UUID].scaleSnap != snap) {
				session.rpcs[UUID].scaleSnap = snap;
				send = true;
			}
		}

		width = Math.round(width);
		height = Math.round(height);

		if (send) {
			var msg = {};
			msg.UUID = UUID;
			msg.requestResolution = { w: width, h: height, s: snap, c: cover };
			if (requestAs) {
				msg.requestAs = requestAs;
			}
			log(width + " " + height);
			session.sendRequest(msg, UUID);
		}
		if (!requestAs) {
			if (snap) {
				session.rpcs[UUID].stats.Requested_resolution = "~ " + parseInt(width) + " x " + parseInt(height);
			} else {
				session.rpcs[UUID].stats.Requested_resolution = parseInt(width) + " x " + parseInt(height);
			}
		}
	};

	session.calculateScale = function (UUID, bandwidth = false, scale = false) {
		if (scale) {
			// manually specified
		} else if (session.pcs[UUID].scale) {
			// saved
			scale = session.pcs[UUID].scale;
		} else {
			// 100%
			scale = 100;
		}

		if (session.pcs[UUID].scaleResolution && scale > session.pcs[UUID].scaleResolution) {
			// if scale-scale is bigger than resolution-scale
			scale = session.pcs[UUID].scaleResolution;
		}

		if (bandwidth) {
			scale = getOptimizedScale(UUID, scale, bandwidth);
		} else if (session.pcs[UUID].scaleDueToBitrate && session.pcs[UUID].scaleDueToBitrate < scale) {
			scale = session.pcs[UUID].scaleDueToBitrate;
		}

		if (session.screenShareState && session.pcs[UUID].scaleSnap) {
			// try to have the scale be close to a native resolution or a divisble by 2, if suitable. Screensharing only really
			if (scale > 85) {
				scale = 100;
			} else if (scale > 42 && scale < 50) {
				scale = 50;
			}
		}
		scale = session.pixelFix(scale, UUID);
		return scale;
	};

	session.setResolution = function (UUID = false, width = null, height = null, snap = false, cover = false) {
		// session.pcs[UUID].scale -- Let's not scale to HIGHER than the scale that's already set.

		log("setResolution triggered; " + width + "x" + height);

		if (UUID && !(UUID in session.pcs)) {
			return;
		} else if (!UUID) {
			for (var uid in session.pcs) {
				// lets reset things?
				session.setResolution(uid, session.pcs[uid].scaleWidth, session.pcs[uid].scaleHeight, session.pcs[uid].scaleSnap, session.pcs[uid].cover);
			}
			return;
		}

		cover = cover || false;
		snape = snap || false;

		if (width === null && height === null) {
			if (!session.pcs[UUID].scaleWidth && !session.pcs[UUID].scaleHeight) {
				return;
			} else {
				width = session.pcs[UUID].scaleWidth || 100;
				height = session.pcs[UUID].scaleHeight || 100;
				//snap = session.pcs[UUID].scaleSnap || false;
			}
		} else {
			session.pcs[UUID].scaleWidth = width;
			session.pcs[UUID].scaleHeight = height;
			session.pcs[UUID].scaleSnap = snap;
			session.pcs[UUID].cover = cover;
		}

		if (SafariVersion && SafariVersion <= 13 && (iOS || iPad)) {
			return;
		} // cause apple was late to the game

		if ("RTCRtpSender" in window && "setParameters" in window.RTCRtpSender.prototype) {
			var sender = getSenders2(UUID).find(function (s) {
				return s.track && s.track.kind == "video";
			});

			if (!sender) {
				log("can't change bitrate; no video sender found");
				return;
			}

			var settings = {};

			if ("realUUID" in session.pcs[UUID]) {
				var tracks = session.screenStream.getVideoTracks();
				if (tracks.length) {
					var nativeSettings = tracks[0].getSettings();
					var nativeHeight = nativeSettings.height;
					var nativeWidth = nativeSettings.width;
				} else {
					return;
				}
			} else if (session.videoElement && session.videoElement.srcObject) {
				var tracks = session.videoElement.srcObject.getVideoTracks();
				if (tracks.length) {
					var nativeSettings = tracks[0].getSettings();
					var nativeHeight = nativeSettings.height;
					var nativeWidth = nativeSettings.width;
				} else {
					return;
				}
			} else {
				return;
			}

			// if (width==null){
			// width = 0; //nativeWidth; // changed april 25 2023
			// }
			// if (height==null){
			// height = 0; // nativeHeight; // changed april 25 2023
			// }

			var sw = (100 * width) / nativeWidth; // ... 320 / 640 = 0.5
			var sh = (100 * height) / nativeHeight;

			warnlog(sw + " x " + sh);

			var ss = 100;

			if (width === null) {
				ss = sh;
			} else if (height === null) {
				ss = sw;
			} else if (cover) {
				if (sw > sh) {
					// we scale to the max resolution, rather than the min resolution (width vs height). changed april 25 2023 to avoid an issue with &cover
					ss = sw;
				} else {
					ss = sh;
				}
			} else {
				if (sw < sh) {
					ss = sw;
				} else {
					ss = sh;
				}
			}

			if (ss > 100) {
				// requested resolution is too high
				ss = 100;
			}

			log("resolution scale: " + ss);
			session.pcs[UUID].scaleResolution = ss;

			var scale = session.calculateScale(UUID);

			if (scale <= 0 || scale == 100) {
				// if "unlocked", get rid of resolution scale limit -1 = unlocked
				var chromeVersion = getChromiumVersion();
				if (chromeVersion > 80) {
					// just because
					settings.scaleResolutionDownBy = null;
				} else {
					settings.scaleResolutionDownBy = 1.0;
				}
			} else {
				// TODO:  CHECK TO SEE IF ITS ALREADY SET OR NOT. CANCEL IF ALREADY SET.  SET TIMEOUT ON SENDER SIDE: DON"T FLOOD.
				settings.scaleResolutionDownBy = 100.0 / scale; // group chat and director's room might see resolution limited; so 720p-> 240p
			}

			setEncodings(
				sender,
				settings,
				function (arr) {
					log("scale set!");
					pokeIframeAPI("setVideoScale", arr[0], arr[1]); // depreciated
					pokeIframeAPI("set-video-scale", arr[0], arr[1]);
					session.pcs[arr[1]].stats.scaleFactor = parseInt(arr[0]) + "%";
				},
				[scale, UUID]
			);
			return;
		}
	};

	/* session.whipOutForcePLI = function(event = null) {
		if (event) {
			event.stopPropagation();
		}
		
		if (iOS || iPad) {
			log("iOS devices do not support dynamic bitrates correctly; skipping");
			return false;
		} else if ("RTCRtpSender" in window && "setParameters" in window.RTCRtpSender.prototype) {
			log("FORCING A KEY FRAME FOR WHIP: " + UUID);

			if (!session.whipOut) {
				return false;
			}

			// session.whipOutKeyframe
			// session.whipOutKeyframeOnNewViewer
			if (session.whipOutKeyframe) {
				if (session.whipOut.keyframeTimeout) {
					clearTimeout(session.whipOut.keyframeTimeout);
				}
				session.whipOut.keyframeTimeout = setTimeout(
					function (UUID) {
						if (!session.whipOut) {
							clearInterval(this);
						} else {
							session.whipOutForcePLI(UUID);
						}
					},
					parseInt(session.whipOutKeyframe),
					UUID
				);
			}

			try {
				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});

				if (!sender) {
					warnlog("can't change bitrate; no video sender found");
					return false;
				}

				var settings = {};

				settings.scaleResolutionDownBy = 10; // 50% of default max

				setEncodings(
					sender,
					settings,
					function (arr) {
						log("scaleResolutionDownBy set 2a! " + arr[0]);
						var scale = session.calculateScale(arr[0]);

						var settings = {};

						if (scale <= 0 || scale == 100) {
							// if "unlocked", get rid of resolution scale limit -1 = unlocked
							var chromeVersion = getChromiumVersion();
							if (chromeVersion > 80) {
								// just because
								settings.scaleResolutionDownBy = null;
							} else {
								settings.scaleResolutionDownBy = 1.0;
							}
						} else {
							settings.scaleResolutionDownBy = 100.0 / scale;
						}

						setEncodings(arr[1], settings, function () {
							log("scaleResolutionDownBy set 2b!");
						});
					},
					[UUID, sender]
				);

				return true;
			} catch (e) {
				errorlog(e);
			}
		}
		return false;
	}; */

	session.forcePLI = function (UUID = null, event = null) {
		if (event) {
			event.stopPropagation();
		}

		if (session.chunkedRecorder) {
			session.chunkedRecorder.needKeyFrame = true;
			log("FORCING A CHUNKED KEY FRAME: " + UUID);
		}

		if (iOS || iPad) {
			log("iOS devices do not support dynamic bitrates correctly; skipping");
			return false;
		} else if ("RTCRtpSender" in window && "setParameters" in window.RTCRtpSender.prototype) {
			log("FORCING A KEY FRAME: " + UUID);

			if (UUID == null) {
				for (var UUID in session.pcs) {
					session.forcePLI(UUID);
				}
				return false;
			}

			if (!(UUID in session.pcs)) {
				return false;
			}

			if (session.pcs[UUID].keyframeRate) {
				if (session.pcs[UUID].keyframeTimeout) {
					clearTimeout(session.pcs[UUID].keyframeTimeout);
					session.pcs[UUID].keyframeTimeout = null;
				}
				session.pcs[UUID].keyframeTimeout = setTimeout(
					function (UUID) {
						if (!session.pcs[UUID]) {
							clearInterval(this);
						} else {
							session.forcePLI(UUID);
						}
					},
					parseInt(session.pcs[UUID].keyframeRate),
					UUID
				);
			}

			try {
				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});

				if (!sender) {
					warnlog("can't change bitrate; no video sender found");
					return false;
				}

				var settings = {};

				settings.scaleResolutionDownBy = 10; // 50% of default max

				setEncodings(
					sender,
					settings,
					function (arr) {
						log("scaleResolutionDownBy set 2a! " + arr[0]);
						var scale = session.calculateScale(arr[0]);

						var settings = {};

						if (scale <= 0 || scale == 100) {
							// if "unlocked", get rid of resolution scale limit -1 = unlocked
							var chromeVersion = getChromiumVersion();
							if (chromeVersion > 80) {
								// just because
								settings.scaleResolutionDownBy = null;
							} else {
								settings.scaleResolutionDownBy = 1.0;
							}
						} else {
							settings.scaleResolutionDownBy = 100.0 / scale;
						}

						setEncodings(arr[1], settings, function () {
							log("scaleResolutionDownBy set 2b!");
						});
					},
					[UUID, sender]
				);

				return true;
			} catch (e) {
				errorlog(e);
			}
		}
		return false;
	};

	session.enhanceAudioEncoder = function (UUID) {
		log("enhacing audio encoder");

		var sender = getSenders2(UUID).find(function (s) {
			return s.track && s.track.kind == "audio";
		});
		if (!sender) {
			log("no audio track to poke");
			return false;
		}
		var settings = {};

		try {
			settings.networkPriority = "high";
			settings.priority = "high";
			settings.adaptivePtime = true;

			setEncodings(
				sender,
				settings,
				function (uid) {
					log("done clearing audio");
					pokeIframeAPI("prioritize-audio", true, uid);
				},
				UUID
			);
		} catch (e) {
			errorlog(e);
		}
	};

	session.degradationPreference = function (UUID, preference = "maintain-framerate") {
		var sender = getSenders2(UUID).find(function (s) {
			return s.track && s.track.kind == "video";
		});
		if (!sender) {
			log("no video track to control");
			return false;
		}
		var settings = {};
		try {
			if (preference === true) {
				settings.degradationPreference = "maintain-framerate"; // preference goes here
				log("done setting degrad to maintain-framerate");
			} else {
				settings.degradationPreference = preference;
				log("done setting degrad to " + preference);
			}

			setEncodings(
				sender,
				settings,
				(function () {
					log("done setting degrad");
				})()
			);
		} catch (e) {
			errorlog(e);
		}
	};

	session.limitMaxBandwidth = function (available_outgoing_bitrate_kbps, pc, meshcast = false) {
		// BANDWIDTh is not the same as bitrate.
		log("session.limitMaxBandwidth running: " + available_outgoing_bitrate_kbps + ", mc?: " + meshcast);
		if (session.maxBandwidth === false) {
			return;
		}

		pc.maxBandwidth = parseInt((session.maxBandwidth / 100) * available_outgoing_bitrate_kbps);

		if (meshcast) {
			session.limitMeshcastBitrate(null);
		} else {
			session.limitBitrate(pc.UUID, null);
		}
	};

	session.limitAudioEncoder = function (UUID, bandwidth = 32000, delay = 1000) {
		log("encodering being kicked");
		var sender = getSenders2(UUID).find(function (s) {
			return s.track && s.track.kind == "audio";
		});
		if (!sender) {
			log("no audio track to poke");
			return false;
		}

		var settings = {};
		settings.maxBitrate = bandwidth;

		setEncodings(
			sender,
			settings,
			function (arr) {
				pokeIframeAPI("setAudioBitrate", arr[0], arr[1]); // deprecated
				pokeIframeAPI("set-audio-bitrate", arr[0], arr[1]);
				if (arr[2] > 0) {
					setTimeout(
						function () {
							try {
								if (arr[1] in session.pcs) {
									var sender2 = getSenders2(arr[1]).find(function (s) {
										return s.track && s.track.kind == "audio";
									});
								} else {
									return false;
								}
								if (!sender2) {
									log("no audio track to poke");
									return false;
								}
								var settings = {};
								settings.maxBitrate = null;
								setEncodings(sender2, settings, function () {
									log("done clearing audio");
								});
							} catch (e) {
								errorlog(e);
							}
						},
						arr[2],
						arr[1]
					);
				}
			},
			[bandwidth, UUID, delay]
		);
	};

	session.directMigrateIssue = function (migrateRoom, transferSettings, UUID) {
		transferSettings = { ...transferSettings };
		pokeIframeAPI("transfer", migrateRoom, UUID);
		if (session.password) {
			return generateHash(migrateRoom + session.password + session.salt, 16)
				.then(function (rid) {
					var msg = {};
					if (transferSettings.updateurl) {
						transferSettings.roomenc = rid;
					}

					if (session.director && session.directorUUID) {
						msg.migrate = UUID;
						msg.roomid = rid;
						msg.transferSettings = transferSettings;
						session.sendRequest(msg, session.directorUUID); // make sure the main director checks if priv, before sending on.
						log(msg);
					} else if (transferSettings.updateurl) {
						msg.request = "migrate";
						msg.transferSettings = transferSettings;
						log(msg);
						session.sendRequest(msg, UUID, function () {
							var msg2 = {};
							msg2.request = "migrate";
							msg2.roomid = rid;
							msg2.target = UUID;
							session.sendMsg(msg2);
						});
						log(msg);
					} else if ("broadcast" in transferSettings) {
						msg.request = "migrate";
						msg.transferSettings = transferSettings;
						delete msg.transferSettings.roomid;
						delete msg.transferSettings.roomenc;
						log(msg);
						session.sendRequest(msg, UUID, function () {
							var msg2 = {};
							msg2.request = "migrate";
							msg2.roomid = rid;
							msg2.target = UUID;
							session.sendMsg(msg2);
						});
						log(msg);
					} else if (Object.keys(transferSettings).length) {
						msg.request = "migrate";
						msg.transferSettings = transferSettings;
						delete msg.transferSettings.roomid;
						delete msg.transferSettings.roomenc;
						log(msg);
						session.sendRequest(msg, UUID, function () {
							var msg2 = {};
							msg2.request = "migrate";
							msg2.roomid = rid;
							msg2.target = UUID;
							session.sendMsg(msg2);
						});
						log(msg);
					} else {
						msg.request = "migrate";
						msg.roomid = rid;
						msg.target = UUID;
						session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
					}
				})
				.catch(errorlog);
		} else {
			if (transferSettings.updateurl) {
				transferSettings.roomenc = migrateRoom;
			}
			var msg = {};
			if (session.director && session.directorUUID) {
				// the director can confirm it gets there.
				msg.migrate = UUID;
				msg.roomid = migrateRoom;
				msg.transferSettings = transferSettings;
				session.sendRequest(msg, session.directorUUID); // make sure the main director checks if priv, before sending on.
				log(msg);
			} else if (transferSettings.updateurl) {
				msg.request = "migrate";
				msg.transferSettings = transferSettings;
				session.sendRequest(msg, UUID, function () {
					var msg2 = {};
					msg2.request = "migrate";
					msg2.roomid = migrateRoom;
					msg2.target = UUID;
					session.sendMsg(msg2);
				});
			} else if ("broadcast" in transferSettings) {
				msg.request = "migrate";
				msg.transferSettings = transferSettings;
				delete msg.transferSettings.roomid;
				delete msg.transferSettings.roomenc;
				session.sendRequest(msg, UUID, function () {
					var msg2 = {};
					msg2.request = "migrate";
					msg2.roomid = migrateRoom;
					msg2.target = UUID;
					session.sendMsg(msg2);
				});
			} else if (Object.keys(transferSettings).length) {
				msg.request = "migrate";
				msg.transferSettings = transferSettings;
				delete msg.transferSettings.roomid;
				delete msg.transferSettings.roomenc;
				log(msg);
				session.sendRequest(msg, UUID, function () {
					var msg2 = {};
					msg2.request = "migrate";
					msg2.roomid = migrateRoom;
					msg2.target = UUID;
					session.sendMsg(msg2);
				});
				log(msg);
			} else {
				msg.request = "migrate";
				msg.roomid = migrateRoom;
				msg.target = UUID;
				session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
			}
		}
	};

	session.limitAudioBitrate = async function (UUID, bandwidth) {
		bandwidth = parseInt(bandwidth);
		try {
			var sender = getSenders2(UUID).find(function (s) {
				return s.track && s.track.kind == "audio";
			});

			if (!sender) {
				log("can't change audio bitrate; no audio sender found");
				return;
			}
			var settings = {};

			if (bandwidth < 0) {
				// if -1 , this implies unlock.
				settings.active = true;
				if (SafariVersion && SafariVersion <= 13 && (iOS || iPad)) {
					bandwidth = 32; // iOS won't allow for Delete.
					if (session.pcs[UUID].setAudioBitrate !== false) {
						bandwidth = session.pcs[UUID].setAudioBitrate;
					} else if (session.audiobitrate) {
						bandwidth = session.audiobitrate;
					}
					settings.maxBitrate = bandwidth * 1024;
				} else if (session.pcs[UUID].setAudioBitrate !== false) {
					bandwidth = session.pcs[UUID].setAudioBitrate;
					settings.maxBitrate = bandwidth * 1024;
				} else {
					settings.maxBitrate = null;
				}
			} else if (bandwidth === 0) {
				settings.active = false;
			} else {
				settings.active = true;
				settings.maxBitrate = bandwidth * 1024;
			}

			if (session.pcs[UUID].audioMutedOverride) {
				settings.active = false;
			}

			setEncodings(
				sender,
				settings,
				function (arr) {
					pokeIframeAPI("setAudioBitrate", arr[0], arr[1]);
					pokeIframeAPI("set-audio-bitrate", arr[0], arr[1]);
					log("audio bandwidth set f!");
				},
				[bandwidth, UUID]
			);
		} catch (e) {
			errorlog(e);
			log(UUID);
			log(session.pcs[UUID]);
		}
	};

	function isPeerEffectivelyHidden(UUID) {
		if (!session.pcs[UUID]) {
			return false;
		}
		return session.pcs[UUID].sceneDisplay === false || !!(session.pcs[UUID].obsState && session.pcs[UUID].obsState.visibility === false);
	}

	session.optimizeBitrate = function (UUID) {
		// session.limitTotalBitrateGuests
		if (session.iframeSrc && session.pcs[UUID].allowIframe === true) {
			// disable video if iFrame is active.
			session.limitBitrate(UUID, 0); // audio isn't disabled .. unless
			if (session.pcs[UUID].optimizedBitrate === 0) {
				if (isPeerEffectivelyHidden(UUID)) {
					session.limitAudioBitrate(UUID, 0);
				} else {
					session.limitAudioBitrate(UUID, -1);
				}
			}
		} else if (session.pcs[UUID] && session.pcs[UUID].optimizedBitrate !== false) {
			if (isPeerEffectivelyHidden(UUID)) {
				var bitrate = session.pcs[UUID].optimizedBitrate;
				if (session.pcs[UUID].savedBitrate && session.pcs[UUID].savedBitrate > 0) {
					if (session.pcs[UUID].savedBitrate < session.pcs[UUID].optimizedBitrate) {
						bitrate = session.pcs[UUID].savedBitrate; // this just makes sure we don't increase the bitrate higher than it already was
					}
				}
				session.limitBitrate(UUID, bitrate, true); // bypass, so applying the cap doesn't overwrite the saved pre-optimization target
				if (session.pcs[UUID].optimizedBitrate === 0) {
					session.limitAudioBitrate(UUID, 0);
				}
			} else {
				if (session.pcs[UUID].optimizedBitrate === 0) {
					session.limitAudioBitrate(UUID, -1);
				}
				session.limitTotalBitrateGuests();
				if (session.pcs[UUID].savedBitrate !== false || session.maxvideobitrate) {
					session.limitBitrate(UUID, null); // visible again; locally restore the saved target for any optimize value, rather than relying solely on the viewer's raise message arriving
				}
			}
		} else {
			session.limitTotalBitrateGuests();
			if (session.maxvideobitrate) {
				session.limitBitrate(UUID, null);
			}
		}
	};

	session.limitTotalBitrateGuests = function (bandwidth = 0, uid = false) {
		if (!session.limitTotalBitrate) {
			return bandwidth;
		}
		if (!session.roomid || session.scene !== false) {
			log("Switching to limitTotalBitrateAll");
			session.limitTotalBitrateAll(bandwidth, uid);
			return bandwidth;
		}
		if ((iOS || iPad) && SafariVersion && SafariVersion <= 13) {
			return bandwidth;
		} // lets assume iOS 13 and older isn't supported.

		var totalBitrate = bandwidth;

		if (uid === false) {
			totalBitrate = 0;
		} else if (totalBitrate < 0) {
			// if unlocked.  If maxBandwidth was active, this would be more than 0, so can avoid that.

			totalBitrate = session.pcs[uid].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500; // review this. make sure max bandwidth is applied correctly
		}

		var totalStreams = 0;
		for (var UUID in session.pcs) {
			if (uid === UUID) {
				continue;
			}
			if (!session.pcs[UUID].guest) {
				continue;
			}

			try {
				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});
				if (!sender) {
					continue;
				}
				var parameters = sender.getParameters();
				if (!parameters.encodings || parameters.encodings.length == 0) {
					if (session.pcs[UUID].setBitrate < 0) {
						// why would this happen?
						totalBitrate += Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					} else {
						totalBitrate += session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					}
					warnlog(totalBitrate);
					totalStreams += 1;
					continue;
				}
				if (parameters.encodings[0].active == false) {
					continue;
				}
				if (parameters.encodings[0].maxBitrate) {
					if ("preLimitedBitrate" in session.pcs[UUID]) {
						totalBitrate += parseInt(session.pcs[UUID].preLimitedBitrate);
					} else {
						totalBitrate += parseInt(parameters.encodings[0].maxBitrate) / 1024;
					}
				} else if (session.pcs[UUID].setBitrate < 0) {
					totalBitrate += Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
				} else {
					totalBitrate += session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					warnlog(totalBitrate);
				}
				totalStreams += 1;
			} catch (e) {
				errorlog(e);
			}
		}

		if (!totalBitrate) {
			return totalBitrate;
		}

		warnlog("totalBitrate: " + totalBitrate);

		var scale = parseFloat(totalBitrate / session.limitTotalBitrate);
		if (scale < 1) {
			scale = 1;
		}

		for (var UUID in session.pcs) {
			if (uid === UUID) {
				continue;
			}
			if (!session.pcs[UUID].guest) {
				continue;
			}
			try {
				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});
				if (!sender) {
					continue; // no sender
				}
				var parameters = sender.getParameters();
				if (!parameters.encodings || parameters.encodings.length == 0) {
					if (session.pcs[UUID].setBitrate < 0) {
						var bitr = Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					} else {
						var bitr = session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					}
					var target = parseInt(bitr / scale);

					session.limitBitrate(UUID, target, true);
					continue;
				}
				if (parameters.encodings[0].active == false) {
					continue;
				}
				if (parameters.encodings[0].maxBitrate) {
					if ("preLimitedBitrate" in session.pcs[UUID]) {
						var bitr = parseInt(session.pcs[UUID].preLimitedBitrate);
					} else {
						var bitr = parseInt(parseInt(parameters.encodings[0].maxBitrate) / 1024);
					}
					var target = parseInt(bitr / scale);

					session.limitBitrate(UUID, target, true);
				} else {
					if (session.pcs[UUID].setBitrate < 0) {
						var bitr = Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					} else {
						var bitr = session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					}
					var target = parseInt(bitr / scale);
					session.limitBitrate(UUID, target, true);
				}
			} catch (e) {
				errorlog(e);
			}
		}

		return parseInt(bandwidth / scale);
	};

	session.limitTotalBitrateAll = function (bandwidth = 0, uid = false) {
		// video bitrate only
		if (!session.limitTotalBitrate) {
			return bandwidth;
		}
		if ((iOS || iPad) && SafariVersion && SafariVersion <= 13) {
			return bandwidth;
		} // lets assume iOS 13 and older isn't supported.

		var totalBitrate = bandwidth;

		if (uid === false) {
			totalBitrate = 0;
		} else if (totalBitrate < 0) {
			// if unlocked.  If maxBandwidth was active, this would be more than 0, so can avoid that.
			totalBitrate = session.pcs[uid].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
		}

		var totalStreams = 0;
		for (var UUID in session.pcs) {
			if (uid === UUID) {
				continue;
			}
			try {
				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});
				if (!sender) {
					continue;
				}
				var parameters = sender.getParameters();
				if (!parameters.encodings || parameters.encodings.length == 0) {
					if (session.pcs[UUID].setBitrate < 0) {
						// why would this happen?
						totalBitrate += Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					} else {
						totalBitrate += session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					}
					warnlog(totalBitrate);
					totalStreams += 1;
					continue;
				}
				if (parameters.encodings[0].active == false) {
					continue;
				}
				if (parameters.encodings[0].maxBitrate) {
					if ("preLimitedBitrate" in session.pcs[UUID]) {
						totalBitrate += parseInt(session.pcs[UUID].preLimitedBitrate);
					} else {
						totalBitrate += parseInt(parameters.encodings[0].maxBitrate) / 1024;
					}
				} else if (session.pcs[UUID].setBitrate < 0) {
					totalBitrate += Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
				} else {
					totalBitrate += session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					warnlog(totalBitrate);
				}
				totalStreams += 1;
			} catch (e) {
				errorlog(e);
			}
		}

		if (!totalBitrate) {
			return totalBitrate;
		}

		warnlog("totalBitrate: " + totalBitrate);

		var scale = parseFloat(totalBitrate / session.limitTotalBitrate);
		if (scale < 1) {
			scale = 1;
		}

		for (var UUID in session.pcs) {
			if (uid === UUID) {
				continue;
			}
			try {
				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});
				if (!sender) {
					continue; // no sender
				}
				var parameters = sender.getParameters();
				if (!parameters.encodings || parameters.encodings.length == 0) {
					if (session.pcs[UUID].setBitrate < 0) {
						var bitr = Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					} else {
						var bitr = session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					}
					var target = parseInt(bitr / scale);

					session.limitBitrate(UUID, target, true);
					continue;
				}
				if (parameters.encodings[0].active == false) {
					continue;
				}
				if (parameters.encodings[0].maxBitrate) {
					if ("preLimitedBitrate" in session.pcs[UUID]) {
						var bitr = parseInt(session.pcs[UUID].preLimitedBitrate);
					} else {
						var bitr = parseInt(parseInt(parameters.encodings[0].maxBitrate) / 1024);
					}
					var target = parseInt(bitr / scale);

					session.limitBitrate(UUID, target, true);
				} else {
					if (session.pcs[UUID].setBitrate < 0) {
						var bitr = Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					} else {
						var bitr = session.pcs[UUID].setBitrate || Math.min((session.outboundVideoBitrate || 0) || (session.pcs[UUID].maxBandwidth || 0)) || 2500;
					}
					var target = parseInt(bitr / scale);
					session.limitBitrate(UUID, target, true);
				}
			} catch (e) {
				errorlog(e);
			}
		}

		return parseInt(bandwidth / scale);
	};

	session.announceCoDirector = function (codirectorUUID, UUID = false) {
		// UUID is likely always going to be false.
		var data = {};
		data.directorSettings = {};
		data.directorSettings.addCoDirector = [codirectorUUID];
		session.sendPeers(data, UUID);
		pokeIframeAPI("new-co-director", codirectorUUID);
	};

	session.limitMeshcastBitrate = function (bandwidth = null) {
		// may not be issued if a simple push/view link
		// In Chrome, use RTCRtpSender.setParameters to change bandwidth without
		// (local) renegotiation. Note that this will be within the envelope of
		// the initial maximum bandwidth negotiated via SDP.
		if (!session.whipOut) {
			return;
		} // no meshcast

		if (session.whipOut.bitrateTimeout) {
			clearInterval(session.whipOut.bitrateTimeout); // add this to the session.meshcast initialization
			session.whipOut.bitrateTimeout = null;
		}

		if (bandwidth === null) {
			if (session.whipOut.savedBitrate === false) {
				return;
			}
			bandwidth = session.whipOut.savedBitrate;
		}

		bandwidth = parseInt(bandwidth);

		if (session.whipOut.setBitrate && bandwidth > session.whipOut.setBitrate) {
			// this should be redundant, but it may not be. SDP bitrate should take priority; at least it might reduce spam.
			bandwidth = session.whipOut.setBitrate;
		} else if (session.whipOut.setBitrate === false) {
			if (bandwidth < 0) {
				if (session.outboundVideoBitrate) {
					bandwidth = session.outboundVideoBitrate;
				} else {
					bandwidth = 2500;
				}
			}
		}

		if (session.maxvideobitrate) {
			if (bandwidth > session.maxvideobitrate) {
				bandwidth = session.maxvideobitrate;
			}
		}

		session.whipOut.savedBitrate = bandwidth;
		if (session.whipOut.optimizedBitrate !== false) {
			if (session.whipOut.obsState.visibility === false) {
				if (bandwidth > session.whipOut.optimizedBitrate) {
					session.whipOut.savedBitrate = bandwidth;
					bandwidth = parseInt(session.whipOut.optimizedBitrate) || 0;
				}
			}
		}

		if (session.whipOut.maxBandwidth !== null) {
			// null is the default if not enabled/set
			if (session.whipOut.maxBandwidth < bandwidth) {
				bandwidth = session.whipOut.maxBandwidth;
				session.whipOut.stats.max_bandwidth_capped_kbps = bandwidth;
				warnlog("Max bandwidth being capped: " + bandwidth + "-kbps");
			} else if (session.whipOut.stats) {
				session.whipOut.stats.max_bandwidth_capped_kbps = false;
			}
		} else if ("max_bandwidth_capped_kbps" in session.whipOut.stats) {
			session.whipOut.stats.max_bandwidth_capped_kbps = false;
		}

		if (bandwidth === 0) {
			var timeSinceStarted = Date.now() - session.whipOut.startTime;
			if (timeSinceStarted < session.rampUpTime) {
				bandwidth = session.preloadbitrate; // 1000
				log("starting some preload bitrate " + (Date.now() - session.whipOut.startTime));
				session.whipOut.bitrateTimeout = setTimeout(function () {
					try {
						warnlog("stopping some preload bitrate " + (Date.now() - session.whipOut.startTime));
						session.limitMeshcastBitrate(null);
					} catch (e) { }
				}, session.rampUpTime - timeSinceStarted + 5); // the +5 is just to make sure it doesn't get triggered before hand.
			}
		}

		try {
			if ((iOS || iPad) && SafariVersion && SafariVersion <= 13) {
				log("iOS devices do not support dynamic bitrates correctly; skipping");

				var sender = session.whipOut.getSenders().find(function (s) {
					return s.track && s.track.kind == "video";
				});

				if (!sender) {
					warnlog("can't change bitrate; no video sender found");
					return;
				}

				var settings = {};
				if (bandwidth < 0) {
					// if -1 , this implies unlock.
					settings.active = true;
					//delete parameters.encodings[0].maxBitrate; // for older iOS devices, we manually set the bitrate to 2500 rather than deleting the max bitrate value.
					bandwidth = 2500;
					if (session.bitrate) {
						bandwidth = session.bitrate;
					}
					if (session.maxvideobitrate) {
						if (bandwidth > session.maxvideobitrate) {
							bandwidth = session.maxvideobitrate;
						}
					}
					settings.maxBitrate = bandwidth * 1024; // iOS doesn't really like the "delete" sender option. so, manually setting 2500kbps or whatever manually.
				} else if (bandwidth === 0) {
					settings.active = false;
				} else {
					settings.active = true;
					settings.maxBitrate = bandwidth * 1024;
				}

				setEncodings(
					sender,
					settings,
					function (bw) {
						pokeIframeAPI("set-meshcast-video-bitrate", bw);
						log("bandwidth set g! " + bw);
					},
					bandwidth
				);

				return;
			} else if ("RTCRtpSender" in window && "setParameters" in window.RTCRtpSender.prototype) {
				var sender = session.whipOut.getSenders().find(function (s) {
					return s.track && s.track.kind == "video";
				});

				if (!sender) {
					log("can't change bitrate; no video sender found");
					return;
				}

				var settings = {};

				if (bandwidth < 0) {
					// if -1 , this implies unlock.
					if (settings.active == false) {
						settings.active = true;
					}
					settings.maxBitrate = null;
				} else if (bandwidth === 0) {
					settings.active = false;
					if (Firefox) {
						settings.maxBitrate = 1;
					}
				} else {
					settings.active = true;
					settings.maxBitrate = bandwidth * 1024;
				}

				if (iPad || iOS || Firefox) {
					// Firefox and iOS Safari need this timing workaround for reliable bitrate updates.
					if (session.whipOut.bitrateTimeoutFirefox) {
						// if recently run or planned to run soon.
						clearInterval(session.whipOut.bitrateTimeoutFirefox);

						session.whipOut.bitrateTimeoutFirefox = setTimeout(function () {
							// I have firefox/safari waiting 3 seconds before changing bitrates
							log("bitrate timeout; ios/firefox specific: " + bandwidth);
							session.whipOut.bitrateTimeoutFirefox = false;
							session.limitMeshcastBitrate(null);
						}, 500);
					} else {
						session.whipOut.bitrateTimeoutFirefox = setTimeout(function () {
							// trick it into thinking its running
							session.whipOut.bitrateTimeoutFirefox = false;
						}, 500);

						setEncodings(
							sender,
							settings,
							function (bw) {
								log("bandwidth set h! " + bw);
								pokeIframeAPI("set-meshcast-video-bitrate", bw);
							},
							bandwidth
						);
					}
				} else {
					setEncodings(
						sender,
						settings,
						function (bw) {
							log("bandwidth set i! " + bw);
							pokeIframeAPI("set-meshcast-video-bitrate", bw);
						},
						bandwidth
					);
				}
				return;
			} else {
				warnlog("BROWER DID NOT SUPPORT LIMIT BITRATE");
			}
		} catch (e) {
			errorlog(e);
		}
	};

	session.targetBitrate = function (UUID, targetBitrate) {
		if (targetBitrate === false) {
			session.pcs[UUID].setBitrate = false;
			session.limitBitrate(UUID, -1);
		} else {
			targetBitrate = parseInt(targetBitrate) || -1;
			if (targetBitrate >= 0) {
				session.pcs[UUID].setBitrate = targetBitrate;
				session.limitBitrate(UUID, targetBitrate);
			}
		}
	};
	session.targetAudioBitrate = function (UUID, targetAudioBitrate) {
		if (targetAudioBitrate === false) {
			session.pcs[UUID].setAudioBitrate = false;
			session.limitAudioBitrate(UUID, -1);
		} else {
			targetAudioBitrate = parseInt(targetAudioBitrate) || -1;
			if (targetAudioBitrate >= 0) {
				session.pcs[UUID].setAudioBitrate = targetAudioBitrate;
				session.limitAudioBitrate(UUID, targetAudioBitrate);
			}
		}
	};

	session.limitBitrate = function (UUID, bandwidth = null, bypass = false) {
		// may not be issued if a simple push/view link

		log("Bitrate request: " + bandwidth);

		if (!(UUID in session.pcs)) {
			return;
		} // user already disconnected.

		if (session.pcs[UUID].bitrateTimeout) {
			clearInterval(session.pcs[UUID].bitrateTimeout);
			session.pcs[UUID].bitrateTimeout = null;
		}

		var doWeSaveBitrate = true;

		if (bandwidth === null) {
			if (session.pcs[UUID].savedBitrate === false) {
				if (session.pcs[UUID].maxBandwidth === null) {
					return;
				} else {
					bandwidth = session.pcs[UUID].maxBandwidth;
					doWeSaveBitrate = false;
				}
			} else {
				bandwidth = session.pcs[UUID].savedBitrate;
			}
		}

		bandwidth = parseInt(bandwidth);

		if (!session.noMobileBitrateCap && session.mobile && session.pcs[UUID].guest == true && session.pcs[UUID].forceios == false && session.getMobileGuestBitrateCap) {
			var roomOnlyTier = session.getRoomOnlyTier();
			var mobileGuestBitrateCap = session.getMobileGuestBitrateCap();
			if (session.maxvideobitrate !== false && session.maxvideobitrate < mobileGuestBitrateCap) {
				mobileGuestBitrateCap = session.maxvideobitrate;
			}
			if (mobileGuestBitrateCap && session.pcs[UUID].setBitrate && session.pcs[UUID].setBitrate !== mobileGuestBitrateCap && (roomOnlyTier || session.pcs[UUID].setBitrate > mobileGuestBitrateCap)) {
				session.pcs[UUID].setBitrate = mobileGuestBitrateCap;
			}
		}

		if (session.pcs[UUID].setBitrate && bandwidth > session.pcs[UUID].setBitrate) {
			// this should be redundant, but it may not be. SDP bitrate should take priority; at least it might reduce spam.
			bandwidth = session.pcs[UUID].setBitrate;
		} else if (bandwidth < 0) {
			bandwidth = session.pcs[UUID].setBitrate || session.outboundVideoBitrate || 2500;
		}

		let maxvideobitrate = session.maxvideobitrate;
		if (session.pcs[UUID].guest == true) {
			if (maxvideobitrate !== false) {
				if (session.roombitrate !== false) {
					if (session.roombitrate < maxvideobitrate) {
						maxvideobitrate = session.roombitrate;
					}
				}
			} else {
				maxvideobitrate = session.roombitrate;
			}
		}
		if (maxvideobitrate) {
			if (bandwidth > maxvideobitrate) {
				bandwidth = maxvideobitrate;
			}
		}
		var optimizedHidden = isPeerEffectivelyHidden(UUID);
		var optimizedCapRequest = false;
		if (session.pcs[UUID].optimizedBitrate !== false && optimizedHidden) {
			if (bandwidth <= (parseInt(session.pcs[UUID].optimizedBitrate) || 0)) {
				optimizedCapRequest = true; // this is the hidden-state optimize cap, not a real viewing target; keep the saved target for the restore
			}
		}
		if (doWeSaveBitrate && !bypass && !optimizedCapRequest) {
			log("save bandwidth: " + bandwidth);
			session.pcs[UUID].savedBitrate = bandwidth; // save our target bitrate
		}
		if (session.pcs[UUID].optimizedBitrate !== false) {
			if (optimizedHidden) {
				if (bandwidth > session.pcs[UUID].optimizedBitrate) {
					if (doWeSaveBitrate) {
						session.pcs[UUID].savedBitrate = bandwidth;
					}
					bandwidth = parseInt(session.pcs[UUID].optimizedBitrate) || 0;
				}
			}
		}

		if (session.pcs[UUID].maxBandwidth !== null) {
			// null is the default if not enabled/set
			if (session.pcs[UUID].maxBandwidth < bandwidth) {
				bandwidth = session.pcs[UUID].maxBandwidth;

				session.pcs[UUID].stats.max_bandwidth_capped_kbps = bandwidth; // capped.
				warnlog("Max bandwidth being capped: " + bandwidth + "-kbps");
			} else if (session.pcs[UUID].maxBandwidth === bandwidth && !doWeSaveBitrate) {
				session.pcs[UUID].stats.max_bandwidth_capped_kbps = bandwidth;
				warnlog("Max bandwidth controlling bitrate: " + bandwidth + "-kbps");
			} else {
				warnlog("Max bandwidth NOT being capped: " + bandwidth + "-kbps");
				session.pcs[UUID].stats.max_bandwidth_capped_kbps = false;
			}
		} else if ("max_bandwidth_capped_kbps" in session.pcs[UUID].stats) {
			session.pcs[UUID].stats.max_bandwidth_capped_kbps = false;
		}

		if (bypass === false) {
			if (session.limitTotalBitrate) {
				session.pcs[UUID].preLimitedBitrate = bandwidth;
				bandwidth = session.limitTotalBitrateGuests(bandwidth, UUID);
			}
		}

		if (bandwidth === 0) {
			var timeSinceStarted = Date.now() - session.pcs[UUID].startTime;
			if (timeSinceStarted < session.rampUpTime) {
				bandwidth = session.preloadbitrate; // 1000
				log("starting some preload bitrate " + (Date.now() - session.pcs[UUID].startTime));
				session.pcs[UUID].bitrateTimeout = setTimeout(
					function (uuid) {
						try {
							warnlog("stopping some preload bitrate " + (Date.now() - session.pcs[uuid].startTime));
							session.limitBitrate(uuid, null);
						} catch (e) { }
					},
					session.rampUpTime - timeSinceStarted + 5,
					UUID
				); // the +5 is just to make sure it doesn't get triggered before hand.
			}
		}

		try {
			if ((iOS || iPad) && SafariVersion && SafariVersion <= 13) {
				log("iOS 13 and below do not support dynamic bitrates correctly; skipping");

				if (session.pcs[UUID].guest == true && session.pcs[UUID].forceios == false) {
					return;
				}

				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});

				if (!sender) {
					log("can't change bitrate; no video sender found");
					return;
				}

				var settings = {};
				if (bandwidth === 0) {
					settings.active = false;
				} else {
					settings.active = true;
					settings.maxBitrate = bandwidth * 1024;
				}

				setEncodings(
					sender,
					settings,
					function (arr) {
						pokeIframeAPI("setVideoBitrate", arr[0], arr[1]);
						pokeIframeAPI("set-video-bitrate", arr[0], arr[1]);
						log("bandwidth set a! " + arr[0]);
					},
					[bandwidth, UUID]
				);

				return;
			} else if ("RTCRtpSender" in window && "setParameters" in window.RTCRtpSender.prototype) {
				var sender = getSenders2(UUID).find(function (s) {
					return s.track && s.track.kind == "video";
				});

				if (!sender) {
					log("can't change bitrate; no video sender found");
					return;
				}

				var settings = {};

				if (bandwidth === 0) {
					settings.active = false;
					if (Firefox) {
						settings.maxBitrate = 1;
						settings.scaleResolutionDownBy = 1000; // hack
					}
				} else {
					settings.active = true;
					settings.maxBitrate = bandwidth * 1024;
				}

				if (bandwidth !== 0) {
					// don't bother scaling if the bitrate is zero
					// scale = getOptimizedScale(UUID, scale, bandwidth);
					var scale = session.calculateScale(UUID, bandwidth);

					if (scale <= 0 || scale == 100) {
						// if "unlocked", get rid of resolution scale limit -1 = unlocked
						var chromeVersion = getChromiumVersion();
						if (chromeVersion > 80) {
							// just because
							settings.scaleResolutionDownBy = null;
						} else {
							settings.scaleResolutionDownBy = 1.0;
						}
					} else {
						settings.scaleResolutionDownBy = 100.0 / scale;
					}

					if (iPad || iOS || Firefox) {
						// Firefox and iOS Safari need this timing workaround for reliable bitrate updates.
						if (session.pcs[UUID].bitrateTimeoutFirefox) {
							// if recently run or planned to run soon.
							clearInterval(session.pcs[UUID].bitrateTimeoutFirefox);

							session.pcs[UUID].bitrateTimeoutFirefox = setTimeout(
								function (uuid, bp) {
									// I have firefox/safari waiting 3 seconds before changing bitrates
									log("bitrate timeout; ios/firefox specific: " + bandwidth);
									session.pcs[uuid].bitrateTimeoutFirefox = false;
									session.limitBitrate(uuid, null, bp);
								},
								500,
								UUID,
								bypass
							);
						} else {
							session.pcs[UUID].bitrateTimeoutFirefox = setTimeout(
								function (uuid) {
									// trick it into thinking its running
									session.pcs[uuid].bitrateTimeoutFirefox = false;
								},
								500,
								UUID
							);

							setEncodings(
								sender,
								settings,
								function (arr) {
									log("bandwidth set b! " + arr[0]);
									session.pcs[arr[1]].stats.scaleFactor = parseInt(arr[2]) + "%";
									pokeIframeAPI("setVideoBitrate", arr[0], arr[1]); // depcreated
									pokeIframeAPI("setVideoScale", arr[2], arr[1]); // depcreated
									pokeIframeAPI("set-video-bitrate", arr[0], arr[1]);
									pokeIframeAPI("set-video-scale", arr[2], arr[1]);
								},
								[bandwidth, UUID, scale]
							);
						}
					} else {
						warnlog(settings);
						setEncodings(
							sender,
							settings,
							function (arr) {
								log("bandwidth set c! " + arr[0]);
								session.pcs[arr[1]].stats.scaleFactor = parseInt(arr[2]) + "%";
								pokeIframeAPI("setVideoBitrate", arr[0], arr[1]); // depcreated
								pokeIframeAPI("setVideoScale", arr[2], arr[1]); // depcreated
								pokeIframeAPI("set-video-bitrate", arr[0], arr[1]);
								pokeIframeAPI("set-video-scale", arr[2], arr[1]);
							},
							[bandwidth, UUID, scale]
						);
					}
				} else {
					// no scale
					if (iPad || iOS || Firefox) {
						// Firefox and iOS Safari need this timing workaround for reliable bitrate updates.
						if (session.pcs[UUID].bitrateTimeoutFirefox) {
							// if recently run or planned to run soon.
							clearInterval(session.pcs[UUID].bitrateTimeoutFirefox);

							session.pcs[UUID].bitrateTimeoutFirefox = setTimeout(
								function (uuid, bp) {
									// I have firefox/safari waiting 3 seconds before changing bitrates
									log("bitrate timeout; ios/firefox specific: " + bandwidth);
									session.pcs[uuid].bitrateTimeoutFirefox = false;
									session.limitBitrate(uuid, null, bp);
								},
								500,
								UUID,
								bypass
							);
						} else {
							session.pcs[UUID].bitrateTimeoutFirefox = setTimeout(
								function (uuid) {
									// trick it into thinking its running
									session.pcs[uuid].bitrateTimeoutFirefox = false;
								},
								500,
								UUID
							);

							setEncodings(
								sender,
								settings,
								function (arr) {
									log("bandwidth set d! " + arr[0]);
									pokeIframeAPI("setVideoBitrate", arr[0], arr[1]); // dep
									pokeIframeAPI("set-video-bitrate", arr[0], arr[1]);
								},
								[bandwidth, UUID]
							);
						}
					} else {
						setEncodings(
							sender,
							settings,
							function (arr) {
								log("bandwidth set e! " + arr[0]);
								pokeIframeAPI("setVideoBitrate", arr[0], arr[1]); // dep
								pokeIframeAPI("set-video-bitrate", arr[0], arr[1]);
							},
							[bandwidth, UUID]
						);
					}
				}
			} else {
				warnlog("BROWER DID NOT SUPPORT LIMIT BITRATE");
			}
		} catch (e) {
			errorlog(e);
		}
	};

	function getOptimizedScale(UUID, scale, bandwidth) {
		if (session.noScaling) {
			return scale;
		}

		warnlog("getOptimizedScale: " + scale + " : " + bandwidth);
		if (bandwidth < 0) {
			session.pcs[UUID].scaleDueToBitrate = 100;
		} else if (bandwidth >= 601) {
			session.pcs[UUID].scaleDueToBitrate = 100;
		} else if ("realUUID" in session.pcs[UUID]) {
			// allow screen shares type 3 to run at higher resolutions // realUUID
			session.pcs[UUID].scaleDueToBitrate = 100; // lets mute this and see.
		} else if (session.screenShareState) {
			// allow screen shares to run at higher resolutions // screenShareState

			session.pcs[UUID].scaleDueToBitrate = 100; // lets mute this and see.
		} else {
			var dimension = getNativeOutputResolution();
			if (dimension) {
				try {
					dimension = dimension.width * dimension.height;
					dimension = Math.pow(dimension, 0.5);
				} catch (e) {
					dimension = false;
				}
			}
			warnlog("dimension: " + dimension);
			if (bandwidth >= 350) {
				if (dimension && dimension <= 480) {
					// if LESS THAN 640x360, do not scale.
					session.pcs[UUID].scaleDueToBitrate = 100; // 360p
				} else if (session.mobile) {
					if (dimension && dimension >= 1440) {
						session.pcs[UUID].scaleDueToBitrate = 100 / 3; // 360p
					} else if (session.flagship) {
						if (dimension && dimension >= 960) {
							session.pcs[UUID].scaleDueToBitrate = 100 / 2; // 360p
						} else {
							session.pcs[UUID].scaleDueToBitrate = 100; // 360p
						}
					} else {
						session.pcs[UUID].scaleDueToBitrate = 100 / 2; // 360p
					}
				} else if (dimension && dimension >= 1440) {
					session.pcs[UUID].scaleDueToBitrate = 100 / 2.5; // 540p?
				} else if (dimension && dimension >= 960) {
					session.pcs[UUID].scaleDueToBitrate = 100 / 2; // 360p
				} else {
					session.pcs[UUID].scaleDueToBitrate = 100; // 360p
				}
			} else if (bandwidth >= 201) {
				if (dimension && dimension < 480) {
					// if LESS THAN 640x360, do not scale.
					session.pcs[UUID].scaleDueToBitrate = 100;
				} else if (session.mobile) {
					if (dimension && dimension >= 1440) {
						session.pcs[UUID].scaleDueToBitrate = 100 / 4; // 480x300-ish
					} else if (session.flagship) {
						session.pcs[UUID].scaleDueToBitrate = 100 / 2.0;
					} else {
						session.pcs[UUID].scaleDueToBitrate = 100 / 2.5;
					}
				} else if (dimension && dimension >= 1440) {
					session.pcs[UUID].scaleDueToBitrate = 100 / 3.0; // 640x360
				} else {
					session.pcs[UUID].scaleDueToBitrate = 100 / 2.0;
				}
			} else if (dimension && dimension <= 240) {
				// do not scale if native resolution 320x180 or less, and bitrate is above 80.
				session.pcs[UUID].scaleDueToBitrate = 100;
			} else if (bandwidth >= 81) {
				if (session.mobile) {
					if (dimension && dimension >= 1440) {
						session.pcs[UUID].scaleDueToBitrate = 100 / 6.0;
					} else if (session.flagship) {
						session.pcs[UUID].scaleDueToBitrate = 100 / 3.0;
					} else {
						session.pcs[UUID].scaleDueToBitrate = 100 / 4.0;
					}
				} else if (dimension && dimension >= 1440) {
					session.pcs[UUID].scaleDueToBitrate = 100 / 4.0;
				} else {
					session.pcs[UUID].scaleDueToBitrate = 100 / 3.0;
				}
			} else if (session.mobile) {
				if (dimension && dimension >= 960) {
					session.pcs[UUID].scaleDueToBitrate = 100 / 6.0;
				} else if (session.flagship) {
					session.pcs[UUID].scaleDueToBitrate = 100 / 4.0;
				} else {
					session.pcs[UUID].scaleDueToBitrate = 100 / 5.0;
				}
			} else if (dimension && dimension >= 1440) {
				session.pcs[UUID].scaleDueToBitrate = 100 / 5.0;
			} else {
				session.pcs[UUID].scaleDueToBitrate = 100 / 4.0;
			}
		}

		if (session.pcs[UUID].scaleDueToBitrate < scale) {
			scale = session.pcs[UUID].scaleDueToBitrate;
		}
		return scale;
	}

	function unlockBitrate(sdp, kbps = 10000) {
		if (!window.CodecsHandler) {
			return sdp;
		}
		kbps = parseInt(kbps);

		if (session.audiobitrate) {
			kbps += session.audiobitrate; // counter balance
		} else if (session.director && session.stereo == 5) {
			// director, no custom audio, and stereo is enabled.  32kbps by default
			kbps += 32;
		} else if (session.stereo && session.stereo != 3) {
			// should be 256kbps by defaul tI guess
			if (session.audioCodec && session.audioCodec == "red") {
				kbps += session.audiobitratePRO * 2;
			} else {
				kbps += session.audiobitratePRO;
			}
		} else {
			kbps += 32;
		}
		log("actual bitrate:" + kbps);
		if (kbps < 1) {
			kbps = 1;
		} //

		sdp = CodecsHandler.setVideoBitrates(
			sdp,
			{
				min: parseInt(kbps / 10) || 1,
				max: kbps || 1
			},
			session.codec
		);

		return sdp;
	}

	session.signData = function (data, callback) {
		// data as string
		log(data);
		if (!session.mykey.privateKey) {
			warnlog("Generate Some Crypto keys first");
		}
		window.crypto.subtle
			.sign(
				{
					name: "RSASSA-PKCS1-v1_5"
				},
				session.mykey.privateKey, //from generateKey or importKey above
				session.enc.encode(data) //ArrayBuffer of data you want to sign
			)
			.then(function (signature) {
				//returns an ArrayBuffer containing the signature
				signature = new Uint8Array(signature);
				signature = signature.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
				//signature = new Uint8Array(signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
				//log(signature);
				callback(data, signature);
				log(JSON.stringify(signature));
			})
			.catch(errorlog);
	};

	session.verifyData = function (data, streamID) {
		data.signature = new Uint8Array(data.signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
		if (session.keys[streamID].publicKey) {
			return window.crypto.subtle
				.verify(
					{
						name: "RSASSA-PKCS1-v1_5"
					},
					session.keys[streamID].publicKey, //from generateKey or importKey above
					data.signature, //ArrayBuffer of the signature
					session.enc.encode(data.data) //ArrayBuffer of the data
				)
				.then(function (isvalid) {
					//returns a boolean on whether the signature is true or not
					//log(isvalid);
					return isvalid;
				})
				.catch(function (err) {
					errorlog(err);
					return false;
					//warnUser("Could not validate inbound connection");
				});
		}
	};

	session.desaltStreamID = function (streamID) {
		if (session.password) {
			if (session.hash !== false) {
				//log("hash is not false");
				streamID = streamID.slice(0, -1 * session.hash.length);
				pokeIframeAPI("stream-id-detected", streamID);
				return streamID;
			} else {
				//log("Stream ID pre:"+streamID);
				return generateHash(session.password + session.salt, 6)
					.then(function (hash) {
						// I definitely need to make this better..
						session.hash = hash;
						//log(streamID);
						streamID = streamID.slice(0, -1 * session.hash.length);
						//log("Final streamID: "+streamID);
						pokeIframeAPI("stream-id-detected", streamID);
						return streamID;
					})
					.catch(errorlog);
			}
		}
		pokeIframeAPI("stream-id-detected", streamID);
		return streamID;
	};

	/* session.reissueView = function(streamID){ // Probably causes more problems than it solves.
		if (streamID in session.watchTimeoutListDoubleCheck){
			clearTimeout(session.watchTimeoutListDoubleCheck[streamID]);
			delete session.watchTimeoutListDoubleCheck[streamID];
			// don't request to watch the stream again.
		} else {
			session.watchTimeoutListDoubleCheck[streamID] = setTimeout(function(streamID){
				if (streamID in session.watchTimeoutListDoubleCheck){
					var alreadyConnected = false;
					for (var uuid in session.rpcs){
						if (session.rpcs[uuid].streamID == streamID){
							alreadyConnected=true;
						}
					}
					
					if (alreadyConnected==false){
						session.watchStream(streamID);
						warnlog("SENDING STREAM REQUEST AGAIN!!!!!!!!");
					}
				}
				
			},10000,streamID);
		}
	} */

	session.ping = function () {
		if (session.customWSS) {
			return;
		} // reduce spam
		clearTimeout(session.pingTimeout);
		if (!session.ws || session.ws.readyState !== 1) {
			return;
		}
		session.pingTimeout = setTimeout(function () {
			log("Pinging");
			var data = {};
			data.request = "ping";
			session.sendMsg(data);
		}, 3000);
	};

	session.watchStream = async function (streamID) {
		await session.connect();

		if (session.shadowBanned) {
			log("Shadow mode: not watching streams");
			return; // Don't try to watch if shadow banned
		}

		if (streamID.length > 0) {
			if (streamID === session.streamID) {
				warnlog("Can't play your own stream ID");
				return;
			}

			// In auth mode, only resolve encrypted stream IDs through auth service
			// For now, we're not using encryption, so skip this step
			// TODO: Re-enable when encrypted stream IDs are fully implemented
			/*
			if (session.authMode && window.vdoAuth && session.encryptionKey) {
				try {
					// Get the real stream ID and encryption key from auth service
					const streamData = await window.vdoAuth.resolveStream(streamID);
					if (streamData && streamData.realStreamId && streamData.realStreamId !== streamID) {
						log("Resolved stream ID: " + streamID + " -> " + streamData.realStreamId);
						streamID = streamData.realStreamId;
					}
				} catch (e) {
					log("Stream resolution failed, using original ID: " + e);
				}
			}
			*/

			var data = {};
			data.request = "play";
			data.streamID = streamID; // no salt please.  We will add the salt as needed.
			session.sendMsg(data);
			session.waitingWatchList[streamID] = true;

			pokeIframeAPI("requested-stream", streamID);
		} else {
			log("stream ID is 0 length");
		}
	};

		session.joinRoom = async function sessionjoinroom(roomid) {
		if (session.joiningRoom === false) {
			session.joiningRoom = true;
		}

		// In auth mode, validate room access BEFORE connecting to handshake server
		if (session.authMode && window.vdoAuth) {
			const canJoin = await window.vdoAuth.joinRoom(roomid);
			if (!canJoin) {
				session.joiningRoom = false;
				return; // Access denied - auth UI already shown
			}
		}

		await session.connect();

			var data = {};
			data.request = "joinroom";

				if (session.director && !session.directorView && !session.noRoomClaim) {
					data.claim = true; // become director; or try
					data.claimSettings = {
						roomCap: session.claimRoomCap !== false ? parseInt(session.claimRoomCap) : null,
						bypassKey: session.claimBypassKey || "",
						// Only an explicit true enables approval mode.
						requireApproval: session.requireServerApproval === true
					};
				}

			if (session.roomBypassKey) {
				data.roomKey = session.roomBypassKey;
			}

		if (session.customWSS && (session.scene === false)) {
			data.streamID = session.streamID;
		}

		var token = "";
		if (session.token) {
			token = session.token;
		}

		if (session.password) {
			if (session.hash) {
				// Check if user is blocked from this room+password (shadow ban)
				// Skip for directors and scenes - they should never be shadow banned
				if (!session.director && !session.scene) {
					try {
						var blockKey = "vdo_block_" + sanitizeRoomName(roomid) + "_" + session.hash;
						if (getStorage(blockKey)) {
							session.shadowBanned = true;
							log("Shadow mode: blocked from room - not joining");
							session.joiningRoom = false;
							return Promise.resolve([]); // Return empty member list, don't actually join
						}
					} catch (e) {}
				}

				return generateHash(roomid + session.password + session.salt + token, 16)
					.then(function (rid) {
						// 16-character hash is pretty good, no?
						if (session.customWSS) {
							session.roomenc = rid;
						}
						data.roomid = rid;
						setWebStreamTakeoverRoomScope(data.roomid);
						session.sendMsg(data); // server only
						session.listPromise = defer();
						log("deferring with a promise; hashed room");
						pokeIframeAPI("joining-room", roomid);
						return session.listPromise;
					})
					.catch(errorlog);
			} else {
				return generateHash(session.password + session.salt, 6)
					.then(function (hash) {
						// I need to make this better

						session.hash = hash;
						log("hash is " + hash);
						log("rejoining room");
						return session.joinRoom(roomid);
					})
					.catch(errorlog);
			}
		} else {
			// Check if user is blocked from this room (shadow ban) - no password case
			// Skip for directors and scenes - they should never be shadow banned
			if (!session.director && !session.scene) {
				try {
					var blockKey = "vdo_block_" + sanitizeRoomName(roomid) + "_";
					if (getStorage(blockKey)) {
						session.shadowBanned = true;
						log("Shadow mode: blocked from room - not joining");
						session.joiningRoom = false;
						return Promise.resolve([]); // Return empty member list, don't actually join
					}
				} catch (e) {}
			}

			if (session.customWSS) {
				session.roomenc = roomid;
			}

			data.roomid = roomid;
			setWebStreamTakeoverRoomScope(data.roomid);
			session.sendMsg(data); // server only
			session.listPromise = defer();
			log("deferring with a promise");
			pokeIframeAPI("joining-room", roomid);
			return session.listPromise;
		}
		};

		session.sendJoinApproval = function (targetUUID, action = "approve") {
			if (!targetUUID) {
				return;
			}
			var msg = {
				request: "approvejoin",
				target: targetUUID,
				action: action === "deny" ? "deny" : "approve"
			};
			session.sendMsg(msg);
		};

		session.sendMsg = function (msg, UUID = false) {
		// session.ws.send

		if (UUID) {
			msg.UUID = UUID;
		}

		if (session.customWSS) {
			if (session.UUID) {
				msg.from = session.UUID;
			} else {
				session.UUID = session.generateStreamID(20);
				msg.from = session.UUID;
			}
			if (msg.UUID && msg.from === msg.UUID) {
				return;
			} // don't send messages to yourself.
			if (!("roomid" in msg)) {
				if (session.roomenc) {
					msg.roomid = session.roomenc;
				}
			}
		}

		for (var field in session.signalingMessages) {
			if (!(field in msg)) continue;
			try {
				if (!session.ws || session.ws.readyState !== WebSocket.OPEN) return false;
				var data = JSON.stringify(msg);
				if (data.length > (session.password ? 10000 : 25000)) return false;
				session.ws.send(data);
				return true;
			} catch (e) { return false; }
		}
		clearTimeout(session.pingTimeout);
		try {
			if (session.password) {
				if (msg.streamID) {
					if (session.hash !== false) {
						if (!session.ws || typeof session.ws !== "object" || session.ws.readyState !== 1) {
							log(msg, "could not be sent; queuing it");
							session.msg.push(msg);
						} else {
							msg.streamID = msg.streamID.substring(0, 64) + session.hash.substring(0, 6); // I add it to the end so the streamID takes priority.  if something enters 24-characters, that's pretty secure, no?

							var data = JSON.stringify(msg);
							if ((msg.description || msg.candidates) && data.length < 35000) {
								// we'll make an exception
							} else if (data.length > 10000) {
								errorlog("msg size error");
								errorlog(msg);
								errorlog(data.length);
								return;
							}
							session.ws.send(data);
						}
					} else {
						return generateHash(session.password + session.salt, 6)
							.then(function (hash) {
								session.hash = hash;
								if (typeof session.ws !== "object" || session.ws.readyState !== 1) {
									log(msg, "could not be sent; queuing it");
									session.msg.push(msg);
								} else {
									msg.streamID = msg.streamID.substring(0, 64) + session.hash.substring(0, 6); // just make sure this doesn't happen.

									var data = JSON.stringify(msg);
									if ((msg.description || msg.candidates) && data.length < 35000) {
										// we'll make an exception
									} else if (data.length > 10000) {
										errorlog("msg size error");
										return;
									}
									session.ws.send(data);
								}
							})
							.catch(errorlog);
					}
				} else {
					if (!session.ws || typeof session.ws !== "object" || session.ws.readyState !== 1) {
						log(msg, "could not be sent; queuing it");
						session.msg.push(msg);
						// store the last message to be sent if websocket is not ready.
					} else {
						var data = JSON.stringify(msg);
						if ((msg.description || msg.candidates) && data.length < 35000) {
							// we'll make an exception
						} else if (data.length > 10000) {
							errorlog("msg size error");
							return;
						}
						session.ws.send(data);
					}
				}
			} else {
				if (typeof session.ws !== "object" || session.ws.readyState !== 1) {
					warnlog("message could not be sent; queuing it");
					session.msg.push(msg);
					// store the last message to be sent if websocket is not ready.
				} else {
					var data = JSON.stringify(msg);
					if (data.length > 25000) {
						errorlog("msg size error");
						return;
					}
					session.ws.send(data);
				}
			}
		} catch (e) {
			errorlog(e);
		}
	};

	session.sendPeers = function (data, UUID = false, exclude = false) {
		// using sentList only works well if sending it to one person; the count means little otherwise

		var sentList = [];
		var msg = JSON.stringify(data);

		for (var i in session.pcs) {
			if (exclude && exclude === i) {
				continue;
			}
			if (UUID && UUID !== i) {
				continue;
			}
			try {
				session.pcs[i].sendChannel.send(msg);
				sentList.push(i);
			} catch (e) {
				if (session.pcs[i].startTime + 100000 < Date.now()) {
					warnlog("RTC Connection seems to be dead or not yet open? 1");
				} else {
					log("RTC Connection seems to be dead or not yet open? 1");
				}
			}
			if (UUID && UUID === i) {
				return sentList.length;
			}
		}
		for (var i in session.rpcs) {
			if (exclude && exclude === i) {
				continue;
			}
			if (UUID && UUID !== i) {
				continue;
			}
			if (sentList.includes(i)) {
				continue;
			} // don't send twice
			if (session.rpcs[i].whip) {
				warnlog(msg);
				continue;
			}

			try {
				if ("realUUID" in session.rpcs[i]) {
					var msgAlt = { ...data };
					msgAlt.altUUID = true;
					msgAlt = JSON.stringify(msgAlt);
					session.rpcs[session.rpcs[i].realUUID].receiveChannel.send(msgAlt);
				} else {
					session.rpcs[i].receiveChannel.send(msg);
				}
				sentList.push(i);
			} catch (e) {
				warnlog("RTC Connection seems to be dead or not yet open? 2");
			}
		}
		return sentList.length;
	};

	// Only these existing commands may use signaling when both data channels fail.
	session.signalingMessages = { whepSettings: "pcs", whepScreenSettings: "pcs", screenStopped: "pcs", volume: "rpcs", hangup: "rpcs" };

	session.anysend = function (data, peers = false) {
		for (var field in session.signalingMessages) {
			if (!(field in data)) continue;
			var group = session.signalingMessages[field];
			var UUID = data.UUID;
			// Retained viewers keep their signaling session while P2P retries.
			var peer = session[group][UUID];
			if (!peer || !peer.session || (peer.signalingState === "closed" && !(group === "rpcs" && peer.__closing))) return false;
			var message = { UUID: UUID, session: peer.session };
			message[field] = data[field];
			if (field === "volume") {
				peer.volumeRevision = (peer.volumeRevision || 0) + 1;
				message.volumeRevision = peer.volumeRevision;
			}
			if (field === "screenStopped" && session.whipoutScreenSettings) message.screenStarted = session.whipoutScreenSettings.started;
			if (field === "hangup" && data.block) message.block = true;
			if (group === "pcs") {
				if (session.sendMessage(message, UUID) || session.sendRequest(message, UUID)) return true;
			} else {
				if (session.sendRequest(message, UUID) || session.sendMessage(message, UUID)) return true;
			}
			// Do not queue a command for a later WebSocket connection.
			var socket = session.ws;
			if (!socket || socket.readyState !== WebSocket.OPEN) return false;
			if (session.password && (group === "pcs" || peer.vector)) {
				return session.encryptMessage(JSON.stringify(message)).then(function (enc) {
					if (!enc || session[group][UUID] !== peer || peer.session !== message.session || (peer.signalingState === "closed" && !(group === "rpcs" && peer.__closing))) return false;
					if (field === "volume" && peer.volumeRevision !== message.volumeRevision) return false;
					if (group === "pcs") {
						if (session.sendMessage(message, UUID) || session.sendRequest(message, UUID)) return true;
					} else {
						if (session.sendRequest(message, UUID) || session.sendMessage(message, UUID)) return true;
					}
					if (session.ws !== socket || socket.readyState !== WebSocket.OPEN) return false;
					var encrypted = { UUID: UUID, session: message.session, vector: enc[1] };
					encrypted[field] = enc[0];
					return session.sendMsg(encrypted);
				}).catch(function () { return false; });
			}
			return session.sendMsg(message);
		}
		// Compact QR sessions need the parent's ID translation on every negotiation.
		if (session.bypass && session.bypassSignaling && (data.description || data.candidates)) {
			return session.sendMsg(data);
		}
		// tries to send a message via WebRTC instead of WSS , but will fallback to WSS if needed.
		var res = false;
		if ("UUID" in data) {
			res = session.sendMessage(data, data.UUID);
			if (res) {
				log(data);
				log("successfully sent message vis WebRTC instead of WSS");
			} else {
				log("sending message via WSS as WebRTC failed to send message");
				session.sendMsg(data);
			}
		} else if (peers) {
			// Try sending to ALL peers instead of to server
			res = session.sendMessage(data);
			if (res) {
				log(data);
				log("successfully sent message vis WebRTC instead of WSS to all RTC Peers");
			} else {
				log("sending message via WSS as WebRTC failed to send message; RTC peers only");
				session.sendMsg(data);
			}
		} else {
			// no target, so assume its for the server
			session.sendMsg(data);
			warnlog("sending message via server");
			warnlog(data);
		}
	};

	session.anyrequest = function (data, peers = false) {
		for (var field in session.signalingMessages) {
			if (field in data) return session.anysend(data);
		}
		if (session.bypass && session.bypassSignaling && (data.description || data.candidates)) {
			return session.sendMsg(data);
		}
		var res = false;
		if ("UUID" in data) {
			res = session.sendRequest(data, data.UUID);
			if (res) {
				log("successfully sent message vis WebRTC instead of WSS");
			} else {
				log("sending message via WSS as WebRTC failed to send message");
				session.sendMsg(data);
			}
		} else if (peers) {
			// Try sending to ALL peers instead of to server
			res = session.sendRequest(data);
			if (res) {
				log("successfully sent message vis WebRTC instead of WSS to all RTC Peers");
			} else {
				log("sending message via WSS as WebRTC failed to send message; RTC peers only");
				session.sendMsg(data);
			}
		} else {
			// no target, so assume its for the server
			session.sendMsg(data);
			warnlog("sending request via server");
			warnlog(data);
		}
	};

	session.directorActions = function (msg, retrying = false) {
		log(msg);
		if ("action" in msg) {
			if ("target" in msg) {
				if ("scene" in msg) {
					// scene specific

					if (session.retryScenes[msg.target]) {
						clearTimeout(session.retryScenes[msg.target]);
						delete session.retryScenes[msg.target];
					}

					if (session.scene !== false) {
						// the user is in a scene
						var updateMix = false;
						var counter = 0;

						if (session.optimize === 0) {
							if (msg.scene) { // scene 0 shoud auto load everyone, so ignore that case
								if (session.scene === msg.scene) {
									if (msg.action == "display") {
										if (msg.value && msg.target) { // this is so we know what is added or not to the scene.  Useful for knowing what to load and what to load on demand.
											if (!session.activatedStreams.has(msg.target)) {

												// Keep only the latest pending add; this queue is just a lazy connection bridge.
												session.activatedStreamsQueue[msg.target] = [msg];
												session.activatedStreams.add(msg.target);
												play(msg.target); // play instead of watchstream, as watchstream bypasses the view-set checks and such
												// try loading it here
												// once loaded, add them to the scene? rather, the scene should auto-sync with the director onload, so we can ignore that?
												// but make sure it works.. cause it probably doesn't.
											} else if (session.activatedStreamsQueue[msg.target]) {
												// Keep the latest pending add without growing the queue.
												session.activatedStreamsQueue[msg.target] = [msg];
											}
										} else {
											// remove it since if the guest reloads, we don't want them back in.
											session.activatedStreams.delete(msg.target);
											delete session.activatedStreamsQueue[msg.target];
										}
									}
								}
							}
						}

						let matched = false;

						for (var i in session.rpcs) {
							// If you are VIEWING this use
							counter += 1;
							if (session.rpcs[i].streamID === msg.target) {
								log("Found target for scene change");
								matched = true;
								if ("value" in msg) {
									if (msg.action == "mute") {
										if (msg.value == 1) {
											log("Mute video 3306");
											session.rpcs[i].mutedState = true;
											applyMuteState(i);
										} else {
											log("Unmute video");
											session.rpcs[i].mutedState = false;
											applyMuteState(i);
										}
										session.sceneSync(i);
									} else if (msg.action == "display") {
										// add to scene
										if (session.view) {
										return;
									} // DO NOT DO HIDE FOR SOLO FEEDS (TODO: Revisit this; scene=solo maybe could solve this?

										if (session.scene === msg.scene) {
											if (session.sceneType == 2) {
												if (msg.value == 0) {
													session.rpcs[i].mutedStateScene = true;
													applyMuteState(i);
													if (session.rpcs[i].videoElement) {
														if (session.rpcs[i].videoElement.style.display && session.rpcs[i].videoElement.style.display !== "none") {
															session.rpcs[i].videoElement.style.display = "none";
															session.rpcs[i].videoElement.sceneType2 = false;
															updateMix = true;
														}
													}
													if (session.rpcs[i].iframeEle && session.rpcs[i].iframeEle.style.display && session.rpcs[i].iframeEle.style.display !== "none") {
														session.rpcs[i].iframeEle.style.display = "none";
														session.rpcs[i].iframeEle.sceneType2 = false;
														updateMix = true;
													}
													var recentDate = 0;
													var recentUID = false;
													for (var uid in session.rpcs) {
														if (uid !== i) {
															if (session.rpcs[uid].videoElement && session.rpcs[uid].videoElement.sceneType2) {
																if (session.rpcs[uid].videoElement.sceneType2 > recentDate) {
																	recentDate = session.rpcs[uid].videoElement.sceneType2;
																	recentUID = uid;
																}
															}
															if (session.rpcs[uid].iframeEle && session.rpcs[uid].iframeEle.sceneType2) {
																if (session.rpcs[uid].iframeEle.sceneType2 > recentDate) {
																	recentDate = session.rpcs[uid].iframeEle.sceneType2;
																	recentUID = uid;
																}
															}
														}
													}
													if (recentUID) {
														session.rpcs[recentUID].mutedStateScene = false;
														applyMuteState(recentUID);
														if (session.rpcs[recentUID].videoElement) {
															if (session.rpcs[recentUID].videoElement.controlTimer) {
																clearInterval(session.rpcs[recentUID].videoElement.controlTimer);
															}
															session.rpcs[recentUID].videoElement.controls = false;
															if (session.showControls) {
																session.rpcs[recentUID].videoElement.controlTimer = setTimeout(showControlBar.bind(null, session.rpcs[recentUID].videoElement), 1000);
															}

															if (session.rpcs[recentUID].videoElement.style.display && session.rpcs[recentUID].videoElement.style.display !== "block") {
																session.rpcs[recentUID].videoElement.style.display = "block";
																session.rpcs[recentUID].videoElement.sceneType2 = Date.now();
																updateMix = true;
															}
															////if (session.rpcs[recentUID].mutedState===null){
															//	session.rpcs[recentUID].videoElement.muted=false;
															//} else {
															//	session.rpcs[recentUID].videoElement.muted = session.rpcs[recentUID].mutedState;
															//}
														}
														if (session.rpcs[recentUID].iframeEle && session.rpcs[recentUID].iframeEle.style.display && session.rpcs[recentUID].iframeEle.style.display !== "block") {
															session.rpcs[recentUID].iframeEle.style.display = "block";
															session.rpcs[recentUID].iframeEle.sceneType2 = Date.now();
															updateMix = true;
														}
													}
												} else {
													for (var uid in session.rpcs) {
														// If you are VIEWING this use
														if (uid !== i) {
															session.rpcs[uid].mutedStateScene = true;
															applyMuteState(uid);
															if (session.rpcs[uid].videoElement) {
																//session.rpcs[uid].videoElement.muted=true
																if (session.rpcs[uid].videoElement.style.display && session.rpcs[uid].videoElement.style.display !== "none") {
																	session.rpcs[uid].videoElement.style.display = "none";
																	//session.rpcs[uid].videoElement.sceneType2 = false;
																	updateMix = true;
																}
															}
															if (session.rpcs[uid].iframeEle && session.rpcs[uid].iframeEle.style.display && session.rpcs[uid].iframeEle.style.display !== "none") {
																session.rpcs[uid].iframeEle.style.display = "none";
																//session.rpcs[uid].iframeEle.sceneType2 = false;
																updateMix = true;
															}
														}
													}
													session.rpcs[i].mutedStateScene = false;
													applyMuteState(i);
													if (session.rpcs[i].videoElement) {
														if (session.rpcs[i].videoElement.controlTimer) {
															clearInterval(session.rpcs[i].videoElement.controlTimer);
														}

														session.rpcs[i].videoElement.controls = false;
														if (session.showControls) {
															session.rpcs[i].videoElement.controlTimer = setTimeout(showControlBar.bind(null, session.rpcs[i].videoElement), 1000);
														}

														if (session.rpcs[i].videoElement.style.display && session.rpcs[i].videoElement.style.display !== "block") {
															session.rpcs[i].videoElement.style.display = "block";
															session.rpcs[i].videoElement.sceneType2 = Date.now();
															updateMix = true;
														}
														//if (session.rpcs[i].mutedState===null){
														//	session.rpcs[i].videoElement.muted=false;
														//} else {
														//	session.rpcs[i].videoElement.muted = session.rpcs[i].mutedState;
														//}
													} else {
														matched = false;
													}
													if (session.rpcs[i].iframeEle && session.rpcs[i].iframeEle.style.display && session.rpcs[i].iframeEle.style.display !== "block") {
														session.rpcs[i].iframeEle.style.display = "block";
														session.rpcs[i].iframeEle.sceneType2 = Date.now();
														updateMix = true;
													}
													//setTimeout(function(){updateMixer();},1);
												}
											} else if (session.sceneType == 1) {
												if (msg.value == 0) {
													if (session.rpcs[i].videoElement) {
														if (session.rpcs[i].videoElement.style.display && session.rpcs[i].videoElement.style.display !== "none") {
															session.rpcs[i].videoElement.style.display = "none";
															updateMix = true;
														}
														//session.rpcs[i].videoElement.muted=true;
													}
													if (session.rpcs[i].iframeEle && session.rpcs[i].iframeEle.style.display && session.rpcs[i].iframeEle.style.display !== "none") {
														session.rpcs[i].iframeEle.style.display = "none";
														updateMix = true;
													}
													//setTimeout(function(){updateMixer();},1);
												} else {
													for (var uid in session.rpcs) {
														// If you are VIEWING this use
														if (uid !== i) {
															if (session.rpcs[uid].videoElement) {
																if (session.rpcs[uid].videoElement.style.display && session.rpcs[uid].videoElement.style.display !== "none") {
																	session.rpcs[uid].videoElement.style.display = "none";
																	updateMix = true;
																}
															}
															if (session.rpcs[uid].iframeEle && session.rpcs[uid].iframeEle.style.display && session.rpcs[uid].iframeEle.style.display !== "none") {
																session.rpcs[uid].iframeEle.style.display = "none";
																updateMix = true;
															}
														}
													}
													if (session.rpcs[i].videoElement) {
														if (session.rpcs[i].videoElement.controlTimer) {
															clearInterval(session.rpcs[i].videoElement.controlTimer);
														}
														session.rpcs[i].videoElement.controls = false;
														if (session.showControls) {
															session.rpcs[i].videoElement.controlTimer = setTimeout(showControlBar.bind(null, session.rpcs[i].videoElement), 1000);
														}

														if (session.rpcs[i].videoElement.style.display && session.rpcs[i].videoElement.style.display !== "block") {
															session.rpcs[i].videoElement.style.display = "block";
															updateMix = true;
														}
													} else {
														matched = false;
													}
													if (session.rpcs[i].iframeEle && session.rpcs[i].iframeEle.style.display && session.rpcs[i].iframeEle.style.display !== "block") {
														session.rpcs[i].iframeEle.style.display = "block";
														updateMix = true;
													}
													//setTimeout(function(){updateMixer();},1);

													//setTimeout(function(){updateMixer();},500);
												}
											} else if (msg.value == 0) {
												//  Just a plain scene ; add  or remove just the scene, then mix; don't worry about other elements - the mixer will handle it.
												session.rpcs[i].mutedStateScene = true;
												applyMuteState(i);
												if (session.rpcs[i].videoElement) {
													if (session.rpcs[i].videoElement.style.display && session.rpcs[i].videoElement.style.display !== "none") {
														session.rpcs[i].videoElement.style.display = "none";
														updateMix = true;
													}
													//session.rpcs[i].videoElement.muted=true;
													//  I can probably just go thru the RPCS[] list, using UUID, and say "visible" or not. Use Update on that instead.
													// I won't need to update the lement directly , just the update function.
												}
												if (session.rpcs[i].iframeEle && session.rpcs[i].iframeEle.style.display && session.rpcs[i].iframeEle.style.display !== "none") {
													session.rpcs[i].iframeEle.style.display = "none";
													updateMix = true;
												}
												//setTimeout(function(){updateMixer();},1);
											} else {
												session.rpcs[i].mutedStateScene = false;
												applyMuteState(i);
												if (session.rpcs[i].videoElement) {
													if (session.rpcs[i].videoElement.controlTimer) {
														clearInterval(session.rpcs[i].videoElement.controlTimer);
													}
													session.rpcs[i].videoElement.controls = false;
													if (session.showControls) {
														session.rpcs[i].videoElement.controlTimer = setTimeout(showControlBar.bind(null, session.rpcs[i].videoElement), 1000);
													}

													if (session.rpcs[i].videoElement.style.display && session.rpcs[i].videoElement.style.display !== "block") {
														session.rpcs[i].videoElement.style.display = "block";
														updateMix = true;
													}
													//if (session.rpcs[i].mutedState===null){
													//	session.rpcs[i].videoElement.muted=false;
													//} else {
													//	session.rpcs[i].videoElement.muted = session.rpcs[i].mutedState;
													//}
												} else {
													warnlog("No video element yet?");
													matched = false;
												}
												if (session.rpcs[i].iframeEle && session.rpcs[i].iframeEle.style.display && session.rpcs[i].iframeEle.style.display !== "block") {
													session.rpcs[i].iframeEle.style.display = "block";
													updateMix = true;
												}
											}
										}
										session.sceneSync(i);
									} else if (msg.action == "volume") {
										log(parseInt(msg.value) / 100.0);
										if (session.rpcs[i].videoElement) {
											session.rpcs[i].videoElement.volume = parseInt(msg.value) / 100.0;
											log("UN-MUTED");
										}
									}
								}
							}
						}

						if (!matched && !retrying) {
							warnlog("Target for scene not found; retrying in 3 seconds");
							if (session.retryScenes[msg.target]) {
								clearTimeout(session.retryScenes[msg.target]);
							}
							session.retryScenes[msg.target] = setTimeout(function (target) {
								log("retrying..");
								session.directorActions(msg, true);
							}, 3000, msg.target);
						}
						if (updateMix) {
							updateMixer();
						}
					}
				} else if (msg.action == "migrate") {
					// I'm accepting this via p2p only
				} else if (msg.action == "hangup") {
					// I'm accepting this via p2p only
				}
			} else if (msg.action === "layout") {
				warnlog("custom layout being applied");
				log(msg);
				session.layout = msg.value;
				pokeIframeAPI("layout-updated", session.layout);
				updateMixer();
			}
		}
	};

	session.newMainDirectorSetup = function () {
		log("session.newMainDirectorSetup");
		if (session.directorUUID in session.pcs) {
			if (session.pcs[session.directorUUID].stats && session.pcs[session.directorUUID].stats.info) {
				session.pcs[session.directorUUID].stats.info.director = true;
			}
		}
		if (session.directorUUID in session.rpcs) {
			if (session.rpcs[session.directorUUID].stats && session.rpcs[session.directorUUID].stats.info) {
				session.rpcs[session.directorUUID].stats.info.director = true;
			}
			if (session.director) {
				getById("container_" + session.directorUUID).classList.add("directorBox");
				if (session.rpcs[session.directorUUID].label === false) {
					miniTranslate(getById("label_" + session.directorUUID), "main-director");
				}
			}
		}
		session.requestCoDirector(); // this self-checks if sent already.
		if (session.startSceneRestoreRenewal) {
			session.startSceneRestoreRenewal();
		}
		updateUserList(); // this won't update faster than every 200ms, so its okay to spam
		pokeIframeAPI("new-main-director", session.directorUUID);
	};

	session.connect = async function sessionconnect(reconnect = false) {
		session.qosClosing = false;
		if (session.onceConnected) {
			reconnect = true;
		}
		const reconnectingSeeder = session.onceConnected === true && reconnect == true && session.seeding;
		if (session.taintedSession === true) {
			log("tainted");
			return;
		}
		if (session.ws !== null) {
			log("already connected to websocket server");
			return;
		}
		if (session.wss == false) {
			//errorlog("WEB SOCKET IS SET TO THE DEV SERVER STILL");
			if (session.proxy !== false) {
				session.wss = "wss://proxywss.rtc.ninja:443";
			} else {
				session.wss = "wss://wss.vdo.ninja:443";
			}
		}

		if (!RTCPeerConnection) {
			console.error(getTranslation("webrtc-is-blocked"));
			if (!session.cleanOutput) {
				warnUser(getTranslation("webrtc-is-blocked"), false, false);
			}
			return;
		}

		if (session.ws === null) {
			session.ws = false; // temporarily pause the connection attempts, until we get the TURN server.
			// default ws value is null (unconnected), and connected is an object, so false we'll use as a hacky "pre-connecting" state.
			await chooseBestTURN();
		}

		if (session.customWSS === false) {
			session.wssid = session.generateStreamID(12);
			for (var UUID in session.rpcs) {
				warnlog("Checking to see if reconnectino to ws lost any peers");
				if (session.rpcs[UUID].connectionState === "failed") {
					warnlog("cleaning up lost connection");
					session.closeRPC(UUID); // WSS reconnect is not an explicit departure.
				}
			}
		} // else  --- if its a custom server, doesn't really matter if they reconnect or not. the timer on close will handle it.

		if (session.bypass) {
			session.ws = {};
			session.ws.close = function (e) { };
			session.ws.readyState = 1;
			session.ws.send = function (data) {
				parent.postMessage(
					{
						bypass: data
					},
					session.iframetarget
				);
			};

			setTimeout(function () {
				session.ws.onopen();
			}, 10);
		} else {
			session.ws = new WebSocket(session.wss);
		}

		if (reconnect == false) {
			// we only want to show an error on first connection; no later on.

			if (session.showTime === true) {
				session.showTime = null;
				toggleClock();
			}

			session.timeout = setTimeout(function () {
				pokeIframeAPI("hssConnection", "timeout"); // dep
				pokeIframeAPI("hss-connection", "timeout");

				errorlog("Websockets timed out; 30000ms");
				if (!session.cleanOutput) {
					if (!session.studioSoftware) {
						// let's not show the message if it's in OBS.
						session.warnUserTriggered = true;
						warnUser(getTranslation("site-not-responsive"), 30000, false);
					}
				}
			}, 30000);
		}

		session.ws.onopen = function sessionwsopen() {
			if (session.director) {
				for (var peerUUID in session.rpcs) updateWhepDirectorControls(peerUUID);
			}
			// Don't send auth data to the handshake server - it doesn't understand it
			// Auth is handled separately through the auth service

			if (session.warnUserTriggered) {
				closeModal();
			}

			session.onceConnected = true;
			clearTimeout(session.pingTimeout);
			clearTimeout(session.timeout);
			log("connected to video server");

			// Track WSS connection success for QoS
			if (session.qosEnabled && session.qosData) {
				session.qosData.wssSuccess = true;
			}

			checkConnection();
			if (session.transferred) {
				errorlog("RECONNECTING to HSS; DISCONNECTING FROM TRANSFERRED ROOM");
				for (i in session.rpcs) {
					try {
						if (session.rpcs[i].streamID) {
							if (!session.include.includes(session.rpcs[i].streamID)) {
								session.closeRPC(i);
							}
						} else {
							session.closeRPC(i);
						}
					} catch (e) { }
				}
				for (i in session.pcs) {
					try {
						session.closePC(i);
					} catch (e) { }
				}
				session.transferred = false;
				session.broadcastIFrame = false;

				if (session.popupChat) {
					if (!session.popupChat.closed) {
						session.popupChat.close();
						session.popupChat = null;
					}
				}
			}

			if (session.msg && (session.msg.length > 0)) {
				// send the last store message that was in queue to be sent when ws was closed.  sending 1 message is better than none, and I don't want to spam the server with hundreds. so this is a balance.
				try {
					var messagesToSend = session.msg.slice(-30); // let's not spam the wss server if possible.
					session.msg = []; // clear it so we don't duplicate things.
					messagesToSend.forEach(function (message) {
						log("resending message");
						session.sendMsg(message);
					});
				} catch (e) {
					errorlog(e);
				}
			}
			if (isWebStreamTakeoverLeaseCurrent(webStreamTakeoverActiveSeed)) {
				scheduleWebStreamTakeoverLease(webStreamTakeoverActiveSeed);
			}
			if (reconnect == true) {
				pokeIframeAPI("hssConnection", "reconnected"); // dep
				pokeIframeAPI("hss-connection", "reconnected");
				session.suppressApprovalPopups = true;
				setTimeout(() => { session.suppressApprovalPopups = false; }, 3000);
				if (session.seeding) {
					if (reconnectingSeeder) {
						clearTimeout(session.seedRetryTimeout);
						session.seedRetryTimeout = null;
						session.seedAttempts = 0;
					}
					// if it is seeding, then it likely has a gen-key already. (small small chance it doesn't; meh)
					session.seedStream();
				}

				if (session.roomid) {
					log("ROOMID ENABLED");
					log("Update Mixer Event on Resize SET");
					joinRoom(session.roomid);

					if (session.include.length) {
						var keys = Object.keys(session.waitingWatchList); // re-request
						for (var i = 0; i < keys.length; i++) {
							if (session.include.includes(keys[i])) {
								log("LOADING UP WAITING WATCH STREAM: " + keys[i]);
								session.watchStream(keys[i]);
							}
						}
					}
				} else {
					var keys = Object.keys(session.waitingWatchList);
					for (var i = 0; i < keys.length; i++) {
						log("LOADING UP WAITING WATCH STREAM: " + keys[i]);
						session.watchStream(keys[i]);
					}
				}
			} else {
				pokeIframeAPI("hssConnection", "connected"); // dep
				pokeIframeAPI("hss-connection", "connected");

				// Initialize tip SSE notifications if enabled
				if (typeof fetchPerformerFromToken === 'function') {
					fetchPerformerFromToken().then(function() {
						if (typeof initTipNotifications === 'function') {
							initTipNotifications();
						}
					});
				} else if (typeof initTipNotifications === 'function') {
					initTipNotifications();
				}
			}
		};

		session.requestStream = function (streamID) {
			for (var UUID in session.rpcs) {
				if (session.rpcs[UUID].streamID === streamID) {
					log("already watching stream");
					return false;
				}
			}
			if (session.waitingWatchList[streamID]) {
				log("already waiting for stream");
				return false;
			}
			session.watchStream(streamID);
			log("requesting stream");
			return true;
		};

		session.ws.onmessage = async function (evt) {
			clearTimeout(session.pingTimeout);
			try {
				var msg = JSON.parse(evt.data);
			} catch (e) {
				try {
					var msg = JSON.parse(evt.data.toString());
				} catch (ee) {
					errorlog(ee);
					return;
				}
			}

			// Reject peer IDs that collide with inherited object properties.
			if (
				Object.prototype.hasOwnProperty.call(Object.prototype, msg.UUID) ||
				(session.customWSS && Object.prototype.hasOwnProperty.call(Object.prototype, msg.from))
			) {
				return;
			}

			//if (msg.request == "debug"){
			//	var request = new XMLHttpRequest();
			//	request.open('POST', "https://reports.vdo.ninja/");  //  php, well, whatever.
			//	request.send(JSON.stringify(msg)); ;
			//	return;
			//}

			if (msg.streamID) {
				// desalt.  Base layer only.
				msg.streamID = session.desaltStreamID(msg.streamID);
			}

			if ("remote" in msg) {
				msg = await session.decodeRemote(msg);
				if (!msg) {
					return;
				}
			}

			if (msg.request === "ping") {
				var pingSocket = evt && evt.currentTarget ? evt.currentTarget : session.ws;
				respondToServerPing(msg, pingSocket);
				return;
			}

			if (session.streamtakeover === true && msg.request === "seedtakeoverchallenge") {
				var challengeSocket = evt && evt.currentTarget ? evt.currentTarget : session.ws;
				await respondToWebStreamTakeoverChallenge(msg, challengeSocket);
				return;
			}

			////////////////////
			if (session.customWSS) {
				if ("from" in msg && session.UUID && msg.from === session.UUID) {
					//warnlog("Can't accept messages from yourself");
					return;
				} else {
					log(msg);
				}
				if ("UUID" in msg) {
					if (session.UUID) {
						if (msg.UUID !== session.UUID) {
							return;
						}
					} else {
						return;
					}
					delete msg.UUID;
				}

				if ("roomid" in msg) {
					if (!session.roomenc) {
						return;
					}

					if ("request" in msg) {
						if (msg.request === "migrate") {
							if ("roomid" in msg) {
								if ("target" in msg) {
									if (msg.target == session.UUID) {
										msg.request = "transferred";
										session.roomenc = msg.roomid;
										var data = {};
										data.request = "joinroom";
										data.roomid = session.roomenc;
										data.streamID = session.streamID;
										session.sendMsg(data);
									} else {
										return;
									}
								} else {
									return;
								}
							} else {
								return;
							}
						} else if (msg.roomid.toLowerCase() !== session.roomenc.toLowerCase()) {
							return;
						}
					} else if (msg.roomid.toLowerCase() !== session.roomenc.toLowerCase()) {
						return;
					}
					delete msg.roomid;
				}

				if ("director" in msg) {
					if (session.token || session.mainDirectorPassword) {
						await checkToken();
					} else if (msg.from) {
						session.directorUUID = msg.from;
						session.directorStreamID = false;
						session.directorList = [];
						// this is a custom server. we'll leave it at high security
						session.directorList.push(session.directorUUID);

						session.newMainDirectorSetup();
					}
					delete msg.director;
				}
				if ("from" in msg) {
					msg.UUID = msg.from;
					delete msg.from;
				}
				if ("request" in msg) {
					if (msg.request === "play") {
						if ("streamID" in msg) {
							if (msg.streamID === session.streamID) {
								msg.request = "offerSDP";
							} else {
								return;
							}
						}
					} else if (msg.request === "seed") {
						if (session.view_set) {
							if (session.view_set.includes(msg.streamID)) {
								play(msg.streamID);
								return;
							} else {
								return;
							}
						}
					} else if (msg.request === "joinroom") {
						if ("streamID" in msg) {
							if (session.view_set) {
								if (session.view_set.includes(msg.streamID)) {
									play(msg.streamID);
									//return;
								} else {
									//return;
								}
							} else {
								play(msg.streamID);
							}
						}
						msg.request = "offerSDP";
					}
				} else if ("streamID" in msg) {
					if (session.view_set) {
						if (session.view_set.includes(msg.streamID)) {
							//
						} else {
							return;
						}
					} else if (session.view) {
						if (session.view !== msg.streamID) {
							return;
						} else {
							//
						}
					}
				}
			}
			///

			/////////////

			for (var field in session.signalingMessages) {
				if (!(field in msg)) continue;
				var group = session.signalingMessages[field] === "pcs" ? "rpcs" : "pcs";
				var UUID = msg.UUID; // Hosted HSS supplies the sending socket's UUID.
				var peer = session[group][UUID];
				if (!peer || !msg.session || peer.session !== msg.session || (peer.signalingState === "closed" && !(group === "rpcs" && peer.__closing))) return;
				if (group === "pcs" && session.directorList.indexOf(UUID) === -1) return;
				var message = msg;
				if (session.password && msg.vector) {
					try {
						message = JSON.parse(await session.decryptMessage(msg[field], msg.vector));
					} catch (e) { return; }
				} else if (msg.vector || (session.password && (group === "rpcs" || session.requireencryption || (session.password !== session.defaultPassword && !session.unsafe)))) {
					return;
				}
				if (!message || typeof message !== "object" || !(field in message) || message.session !== msg.session) return;
				if (session[group][UUID] !== peer || peer.session !== msg.session || (peer.signalingState === "closed" && !(group === "rpcs" && peer.__closing))) return;
				if (group === "rpcs" && session.noMeshcast && !(field === "screenStopped" && message.screenStopped === true)) return;
				if (field === "whepScreenSettings" && session.screenWhepPreference === "p2p") return;
				if (group === "rpcs" && session.allowVideos !== false && session.allowVideos && !session.allowVideos.includes(peer.streamID) && !(field === "screenStopped" && message.screenStopped === true)) return;
				// Once either data channel works, ignore delayed signaling controls.
				if (group === "pcs" && ((session.pcs[UUID] && session.pcs[UUID].sendChannel && session.pcs[UUID].sendChannel.readyState === "open") ||
					(session.rpcs[UUID] && session.rpcs[UUID].receiveChannel && session.rpcs[UUID].receiveChannel.readyState === "open"))) return;
				var data = { session: msg.session };
				data[field] = message[field];
				if (field === "volume" && ("volumeRevision" in message)) data.volumeRevision = message.volumeRevision;
				if (field === "screenStopped") data.screenStarted = message.screenStarted;
				if (field === "hangup" && message.block === true) data.block = true;
				if (group === "pcs") return session.processPCSOnMessage(data, UUID);
				return session.processRPCSOnMessage(data, UUID);
			}

				if (msg.request) {
					const clearJoinPendingModal = function () {
						if (!session.joinPendingModalID) {
							return;
						}
						closeModal(false, session.joinPendingModalID);
						session.joinPendingModalID = false;
					};
					// ACTIONS THAT ARE OUTSIDE THE SCOPE OF BASIC WEBRTC
					if (msg.request == "offerSDP") {
					// newly connected client is asking for your SDP offer

					// In auth mode, validate viewer before creating any connection
					if (session.authMode && session.roomid) {
						// Store pending request for validation
						session.pendingViewers = session.pendingViewers || {};
						session.pendingViewers[msg.UUID] = {
							timestamp: Date.now(),
							validating: true
						};

						// For now, we'll allow connections but they won't get media until validated
						// This prevents IP leakage while maintaining compatibility
						log("Auth mode: Deferring media for " + msg.UUID + " until validated");
					}

					if (session.queue) {
						if (session.directorList.indexOf(msg.UUID) >= 0) {
							session.offerSDP(msg.UUID);
						} else if (session.director) {
							if (msg.UUID in session.rpcs) {
								session.offerSDP(msg.UUID);
							}
						} else if (session.queueType == 3 || session.queueType == 4) {
							// For hold (queueType 3) and holdwithvideo (queueType 4), create the PC
							// even for unknown viewers. This handles the race condition where a
							// co-director joins after the guest: the co-director sends play() before
							// addCoDirector announcement arrives. The PC is created with
							// needsPublishing=true, and when addCoDirector arrives, publishing starts
							// (for queueType 4) or control box appears (for queueType 3, no media).
							session.offerSDP(msg.UUID);
						} else {
							return;
						}
					} else {
						session.offerSDP(msg.UUID);
					}
					} else if (msg.request == "joinpending") {
						if (!session.cleanOutput || (session.scene!==false)) {
							const isSceneJoinPending = (session.scene !== false) || (("scene" in msg) && (msg.scene !== false) && (msg.scene !== null) && (typeof msg.scene !== "undefined"));
							const pendingApprovalMessage = session.directorPassword
								? (isSceneJoinPending ? "Waiting for the main director to approve this scene request." : "Waiting for the main director to approve your join request.")
								: (isSceneJoinPending ? "Waiting for the director to approve this scene request." : "Waiting for the director to approve your join request.");
							setTimeout(() => {
								session.joinPendingModalID = warnUser(pendingApprovalMessage, false, true, "joinpending");
							}, 1);
						}
					} else if (msg.request == "joinrequest") {
						if (!session.director || session.directorState === false) {
							return;
						}
						var joinRequestUUID = msg.UUID;
						if (!joinRequestUUID) {
							return;
						}
						var joinRequestIsScene = (("scene" in msg) && (msg.scene !== false) && (msg.scene !== null) && (typeof msg.scene !== "undefined")) || (msg.isScene === true) || (msg.role === "scene");
						var joinRequestSceneName = false;
						if (joinRequestIsScene && ("scene" in msg) && (msg.scene !== null) && (typeof msg.scene !== "undefined")) {
							joinRequestSceneName = msg.scene + "";
						}
						var joinRequestLabel = msg.label || (joinRequestIsScene ? ("Scene " + ((joinRequestSceneName && joinRequestSceneName !== "true") ? joinRequestSceneName : joinRequestUUID.substring(0, 8))) : ("Guest " + joinRequestUUID.substring(0, 8)));

						var requestData = {
							UUID: joinRequestUUID,
							requestedAt: msg.requestedAt || Date.now(),
							roomid: msg.roomid || session.roomid,
							label: joinRequestLabel
						};

						if (typeof addPendingJoinRequest === "function") {
							addPendingJoinRequest(requestData);
						}

						if (session.approval_popup && !session.pendingJoinPrompted.has(joinRequestUUID) && !session.suppressApprovalPopups) {
							session.pendingJoinPrompted.add(joinRequestUUID);
							confirmAlt("A " + (joinRequestIsScene ? "scene" : "guest") + " is waiting for approval.\n\n" + joinRequestLabel + "\n\nApprove?", false, "server-approval-" + joinRequestUUID).then(function (res) {
								if (res) {
									if (typeof approveJoinRequest === "function") {
										approveJoinRequest(joinRequestUUID);
									} else {
										session.sendJoinApproval(joinRequestUUID, "approve");
									}
								} else {
									confirmAlt("Deny this " + (joinRequestIsScene ? "scene" : "guest") + "?").then(function (denyRes) {
										if (denyRes) {
											if (typeof denyJoinRequest === "function") {
												denyJoinRequest(joinRequestUUID);
											} else {
												session.sendJoinApproval(joinRequestUUID, "deny");
											}
										}
									});
								}
								});
							}
						} else if (msg.request == "joinrequestgone") {
							if (!session.director || session.directorState === false) {
								return;
							}
							if (!msg.UUID) {
								return;
							}
							if (typeof removePendingJoinRequest === "function") {
								removePendingJoinRequest(msg.UUID);
							} else if (session.pendingJoinRequests) {
								session.pendingJoinRequests = session.pendingJoinRequests.filter(entry => entry.UUID !== msg.UUID);
								if (typeof updateJoinRequestPanel === "function") {
									updateJoinRequestPanel(false);
								}
							}
					} else if (msg.request == "joinrequestresult") {
						clearJoinPendingModal();
						if (msg.result === "denied") {
							if (!session.cleanOutput) {
								setTimeout(() => {
									warnUser("The director denied your join request.");
								}, 1);
							}
							if (session.listPromise && session.listPromise.resolve) {
								session.listPromise.resolve([]);
							}
							session.joiningRoom = false;
						} else if (msg.result === "expired") {
							if (!session.cleanOutput) {
								setTimeout(() => {
									warnUser("Your join request expired. Please try joining again.");
								}, 1);
							}
							if (session.listPromise && session.listPromise.resolve) {
								session.listPromise.resolve([]);
							}
							session.joiningRoom = false;
						}
					} else if (msg.request == "listing") {
						clearJoinPendingModal();
						// Get a list of streams you have access to
						log(msg);
					// In auth mode, filter the listing to only show SSO-registered streams.
					// Do this before director handling so stale pre-auth room claimants do
					// not block the authenticated owner from controlling the room.
					if (session.authMode && window.vdoAuth && msg.list) {
						const filteredList = [];
						let authorizedDirector = !msg.director;
						for (const item of msg.list) {
							if (item.streamID) {
								const streamData = await window.vdoAuth.resolveStream(item.streamID);
								if (streamData && !streamData.error) {
									if (item.UUID && item.UUID === msg.director) {
										authorizedDirector = true;
									}
									// Replace with encrypted stream ID for UI
									if (session.encryptedToReal && session.encryptedToReal[item.streamID]) {
										item.encryptedStreamID = Object.keys(session.encryptedToReal).find(
											key => session.encryptedToReal[key] === item.streamID
										);
									}
									filteredList.push(item);
								}
							} else {
								if (item.UUID && item.UUID === msg.director) {
									authorizedDirector = true;
								}
								filteredList.push(item); // No stream ID, probably director
							}
						}
						if (msg.director && !authorizedDirector) {
							delete msg.director;
							if (session.director && msg.claim === false) {
								msg.claim = true;
							}
						}
						msg.list = filteredList;
					}

					pokeIframeAPI("room-peer-listing", {
						list: msg.list || [],
						director: msg.director || false,
						claim: "claim" in msg ? msg.claim : null,
						source: "listing"
					});

					if (session.token || session.mainDirectorPassword) {
						await checkToken();
					} else if ("director" in msg) {
						session.directorUUID = msg.director;

						session.directorStreamID = false;
						//session.directorList = [];
						session.cleanDirectorList(); // august 22nd 2024
						session.directorList.push(session.directorUUID);
						session.newMainDirectorSetup();
					} else {
						session.directorUUID = false;
						session.directorStreamID = false;
						session.cleanDirectorList();
					}

					// If we're a director in auth mode and just joined a room, create a universal token
					if (session.director && session.authMode && window.vdoAuth && session.authToken) {
						// Check if we're the room owner
						if ("claim" in msg && msg.claim === true) {
							// We just created/claimed this room, so create a universal token
							setTimeout(async () => {
								await window.vdoAuth.createUniversalToken();
							}, 1000); // Small delay to ensure room is fully set up
						}
					}

					if (session.mainDirectorPassword) {
						// we're a token director
						// we're a token  director
					} else if ("claim" in msg) {
							if (session.token || msg.claim == false) {
							// if a token user, we know we aren't actually the director
							if (!session.cleanOutput) {
								miniTranslate(getById("head4"), "not-the-director");
								if (session.directorPassword) {
									if (session.directorState === null) {
										warnUser(getTranslation("room-is-claimed-codirector"), false, false);
									}
								} else if (session.token) {
									setTimeout(function () {
										warnUser(getTranslation("token-room-is-claimed"), false, false);
									}, 1);
								} else {
									setTimeout(function () {
										warnUser(getTranslation("room-is-claimed"), false, false);
									}, 1);
									// allow them to join as a co-director? prompt with a password?
								}
							}
								session.directorState = false;
								pokeAPI("director", false);
								pokeIframeAPI("director", false);
								session.pendingJoinRequests = [];
								if (session.pendingJoinPrompted) {
									session.pendingJoinPrompted.clear();
								}
								if (typeof updateJoinRequestPanel === "function") {
									updateJoinRequestPanel(false);
								}
							} else {
								session.directorState = true;
								pokeAPI("director", true);
								pokeIframeAPI("director", true);
								session.pendingJoinRequests = session.pendingJoinRequests || [];
								if (typeof updateJoinRequestPanel === "function") {
									updateJoinRequestPanel(false);
								}
							}
						}

					//if (session.director){ // we try to claim it anyways, just in case.
					//	var msg1 = {};
					//	msg1.request = "claim";
					//	session.sendMsg(msg1);
					//}
					session.alreadyJoinedMembers = msg.list;
					session.listPromise.resolve(msg.list); // used for rooms  -- this is being de-salted on its own
					} else if (msg.request == "transferred") {
						clearJoinPendingModal();
						// Get a list of streams you have access to

					session.queueList = [];
					session.transferred = true;
					session.broadcastIFrame = false;
					log("You've been transferred");
					pokeIframeAPI("transferred");

					let resetQueue = false;
					const holdQueueType = session.queueType || (session.queue == 3 ? 3 : session.queue == 4 ? 4 : false);

					if (!session.director) {
						if (session.queue == 2 || session.queueType == 2) {
							session.queue = true;
							session.transferred = true;
						} else if (holdQueueType == 3 || holdQueueType == 4) {
							// this is just a reset, not a transfer
							session.queue = false;
							session.queueType = holdQueueType;
							resetQueue = true;
							// session.transferred = true;
						} else {
							session.queue = false;
							session.transferred = true;
						}
					} else {
						session.transferred = true;
					}

					if (!resetQueue) {
						for (i in session.rpcs) {
							try {
								if (!session.include.includes(session.rpcs[i].streamID)) {
									warnlog("transferred and closing");
									session.closeRPC(i);
								}
							} catch (e) { }
						}
						for (i in session.pcs) {
							try {
								log("closing 4");
								session.closePC(i);
							} catch (e) { }
						}

						if (session.popupChat) {
							if (!session.popupChat.closed) {
								session.popupChat.close();
								session.popupChat = null;
							}
						}
					}

					if (!resetQueue) {
						if (session.token || session.mainDirectorPassword) {
							await checkToken();
						} else if ("director" in msg) {
							session.directorUUID = msg.director;
							session.directorStreamID = false;
							session.directorList = []; // its a transfer, so we can assume its a fresh start.
							session.directorList.push(session.directorUUID);
							session.newMainDirectorSetup();
						} else {
							session.directorUUID = false;
							session.directorStreamID = false;
							session.directorList = [];
						}
						youveBeenTransferred();

						session.totalRoomBitrate = session.totalRoomBitrate_default; // reset director-infludenced settings.

						updateMixer();
					} else {
						youveBeenActivated();
						session.queueType = false;
					}

					//updateUserList();

					log("Members in Room");
					log(msg.list);
					for (var i in msg.list) {
						if ("UUID" in msg.list[i]) {
							if (msg.list[i].streamID) {
								if (msg.list[i].UUID in session.rpcs) {
									log("RTC already connected"); /// lets just say instead of Stream, we have
								} else {
									var streamID = session.desaltStreamID(msg.list[i].streamID);
									log("STREAM ID desalted 2:" + streamID);

									if (session.queue) {
										if (session.directorList.indexOf(msg.list[i].UUID) >= 0) {
											// Only queueType 2 (&screen) sees director immediately.
											// queueType 3 (&hold) and 4 (&holdwithvideo) are fully isolated
											// from the director until activated.
											if (session.queueType == 2) {
												play(streamID, msg.list[i].UUID);
											}
										} else if (session.view_set && session.view_set.includes(streamID)) {
											play(streamID, msg.list[i].UUID);
										} else if (session.queueList.length < 5000) {
											if (!(streamID in session.watchTimeoutList) && !session.queueList.includes(streamID)) {
												session.queueList.push(streamID);
											}
										}
									} else {
										play(streamID, msg.list[i].UUID);
									}
								}
							}
						}
					}
					updateQueue();
					//session.listPromise.resolve(msg.list); // used for rooms
				} else if (msg.request == "roomclaimed") {
					// I think roomclaimed was made obsolete with v17.3 
					// Get a list of streams you have access to
					log(msg);
					if (session.token || session.mainDirectorPassword) {
						await checkToken();
					} else if ("director" in msg) {
						session.directorUUID = msg.director;
						session.directorStreamID = false;
						session.directorList = []; // room claiming is obsolete, so lets ignore updating this case and leave at higher security
						session.directorList.push(session.directorUUID);
						session.newMainDirectorSetup();
					} else {
						session.directorUUID = false;
						session.directorList = [];
						errorlog("Roomclaimed response missing director while unauthenticated");
					}
					updateUserList();
					//} else if (msg.request == "sendroom") { // deprecated
					/* // send a message to those in the group via server. p2p is probably the preferred method, but not always possible
					log("Inbound User-based Message from Room");
					log(msg);
					/// validate who is the DIRECTOR ; use the UUID and signing
					try {
						if (session.token || session.mainDirectorPasswor) {
							// we will ignore server side messages from any director
						} else if ("director" in msg) {
							//  This is the director-related feed
							if (msg.director == true) {
								session.directorActions(msg);
							}
						}
					} catch (e) {
						errorlog(e);
					} */
					} else if (msg.request == "someonejoined") {
						// someone joined the room.  they may not have a video submitted: like the director.
						if (msg.UUID && typeof removePendingJoinRequest === "function") {
							removePendingJoinRequest(msg.UUID);
						}
						if (msg.UUID) {
							pokeIframeAPI("room-peer-discovered", {
								UUID: msg.UUID,
								streamID: "streamID" in msg ? msg.streamID : false,
								label: msg.label || false,
								director: !!msg.director,
								source: "someonejoined"
							});
						}

						if (session.token || session.mainDirectorPassword) {
							await checkToken();
					} else if (msg.director) {
						// true
						session.directorUUID = msg.UUID;
						session.directorStreamID = false;

						// session.directorList = []; // assuming the director had to reconnect.
						session.cleanDirectorList(); // august 22nd 2024. lets wipe directors who aren't already connected.

						session.directorList.push(session.directorUUID);
						session.newMainDirectorSetup();
					}

					if ("streamID" in msg) {
						log("Someone Joined the Room with a video");
						var joinedStreamID = msg.streamID;
						if (session.queue) {
							if (session.directorList.indexOf(msg.UUID) >= 0) {
								// Only queueType 2 (&screen) sees director immediately
								if (session.queueType == 2) {
									play(joinedStreamID, msg.UUID);
								}
							} else if (session.view_set && session.view_set.includes(joinedStreamID)) {
								play(joinedStreamID, msg.UUID);
							} else if (session.queueList.length < 5000) {
								if (!(joinedStreamID in session.watchTimeoutList) && !session.queueList.includes(joinedStreamID)) {
									session.queueList.push(joinedStreamID);
									updateQueue(true);
								}
							}
						} else {
							play(joinedStreamID, msg.UUID);
						}
					} else {
						log("Someone Joined the Room");
					}

				} else if (msg.request == "videoaddedtoroom") {
					// a video was added to the room
					log("Someone published a video to the Room");
					log(msg);
					var addedStreamID = msg.streamID;
					if (session.queue) {
						if (session.directorList.indexOf(msg.UUID) >= 0) {
							// Only queueType 2 (&screen) sees director immediately
							if (session.queueType == 2) {
								play(addedStreamID, msg.UUID);
							}
						} else if (session.view_set && session.view_set.includes(addedStreamID)) {
							play(addedStreamID, msg.UUID);
						} else if (session.queueList.length < 5000) {
							if (!(addedStreamID in session.watchTimeoutList) && !session.queueList.includes(addedStreamID)) {
								session.queueList.push(addedStreamID);
								updateQueue(true);
							}
						}
					} else {
						play(addedStreamID, msg.UUID);
					}
				} else if (msg.request == "alert") {
					errorlog(msg);
					pokeIframeAPI("alert", msg.message);
					if (session.scene === false) {
						if ("message" in msg) {
							if (msg.message === "Stream ID is already in use." || msg.message === "Stream ID is already in use in this room.") {
								if (session.seedRetryTimeout !== null) {
									log("Seed retry already scheduled; ignoring duplicate conflict alert");
									return;
								}
								if (session.seedAttempts < 2) {
									// this should be a good balance of delay and retries.
									const retrySocket = session.ws;
									const retryDelay = reconnectingSeeder ? 30000 : 5000;
									const retryTimeout = setTimeout(function () {
										if (session.seedRetryTimeout === retryTimeout) {
											session.seedRetryTimeout = null;
										}
										if (session.ws !== retrySocket || retrySocket.readyState !== WebSocket.OPEN) {
											return;
										}
										session.seedAttempts = parseInt(session.seedAttempts) + 1;
										session.seedStream();
									}, retryDelay);
									session.seedRetryTimeout = retryTimeout;
								} else {
									if (!session.cleanOutput && window.obsstudio) {
										try {
											var hangupContainer = getById("hangupContainer");
											if (hangupContainer) {
												var refreshButton = hangupContainer.querySelector("button");
												if (refreshButton) {
													refreshButton.remove();
												}
												hangupContainer.innerHTML = "&#x1F44B;<br>";
												var obsExplainer = document.createElement("div");
												obsExplainer.style.fontSize = "20%";
												obsExplainer.style.maxWidth = "720px";
												obsExplainer.style.lineHeight = "1.45";
												obsExplainer.style.margin = "14px auto";
												obsExplainer.textContent = "This OBS browser source disconnected because the stream ID is already in use. This usually means the OBS source is using a push link instead of a view link, or the same stream is already open in another tab, browser source, or device. Use the view link in OBS, or close the other session that is already using this stream ID.";
												hangupContainer.appendChild(obsExplainer);
												if (refreshButton) {
													hangupContainer.appendChild(refreshButton);
												}
											}
										} catch (e) {
											errorlog(e);
										}
									}
									hangup();
									if (!session.cleanOutput) {
										if (session.permaid && ((session.permaid.length < 3) || (session.permaid === "test")) && (session.password === session.defaultPassword)) {
											setTimeout(function () {
												warnUser(getTranslation("streamid-already-published-obvious"), false, false);
											}, 1);
										} else {
											setTimeout(function () {
												warnUser(getTranslation("streamid-already-published"), false, false);
											}, 1);
										}
									} else {
										console.warn(getTranslation("streamid-already-published"));
									}
								}
							} else if (msg.message === "Room is full") {
								if (!session.cleanOutput) {
									setTimeout(() => {
										warnUser("Room is full.\n\nThe room you are trying is join is act its max capacity.");
									}, 1);
								}
							} else if (session.token || session.mainDirectorPassword) {
								// ignore messages from the server
							} else if (msg.message === "Room is already claimed by someone else.") {
								// this is not to be translated
								if (!session.cleanOutput) {
									//getById("head4").innerHTML = getTranslation("not-the-director");
									miniTranslate(getById("head4"), "not-the-director");
									if (session.directorPassword) {
										if (session.directorState === null) {
											warnUser(getTranslation("room-is-claimed-codirector"), false, false);
										}
									} else {
										setTimeout(function () {
											warnUser(getTranslation("room-is-claimed"), false, false);
										}, 1);
										// allow them to join as a co-director? prompt with a password?
									}
								}
								session.directorState = false;
								pokeAPI("director", false);
								pokeIframeAPI("director", false);
								try {
									session.flushPendingApprovals();
								} catch (e) { }
							} else {
								if (!session.cleanOutput) {
									setTimeout(() => {
										warnUser(msg.message);
									}, 1);
								}
							}
						}
					}
				} else if (msg.request == "warn") {
					if ("message" in msg) {
						warnlog(msg.message);
					}
				} else {
					log(msg);
				}
			} else if (msg.description) {
				// we don't get the STREAM ID back with this. That could be good from a privacy point of view -- no one in the group call will have Stream ID access for publishing?
				// For the sake of ease, I may just return the StreamID and revisit
				if ("streamID" in msg) {
					if (msg.streamID in session.watchTimeoutList) {
						clearTimeout(session.watchTimeoutList[msg.streamID]);
						delete session.watchTimeoutList[msg.streamID];
					}
				}
				session.processDescription(msg);
			} else if (msg.candidate) {
				log("GOT ICE!!");
				session.processIce(msg);
			} else if (msg.candidates) {
				log("GOT ICES!!");
				session.processIceBundle(msg);
			} else if (msg.bye || msg.request == "cleanup") {
				// If someone disconnects from Websockets, and doesn't reconnect, THEN we can discard their key or something?
				warnlog("Clean up");
				if (msg.UUID in session.pcs) {
					log("closing 4");
					session.closePC(msg.UUID);
				}
				if (msg.UUID in session.rpcs) {
					warnlog("problem");
					if (msg.bye) session.closeRPC(msg.UUID);
					else session.closeRPC(msg.UUID);
					// I'll have to figure out where to reconnect somewhere else
				}
			} else if (msg.iceRestartRequest && msg.UUID) {
				// Viewer requested ICE restart through WebSocket
				warnlog("Viewer requested ICE restart via WebSocket");
				if (msg.UUID in session.pcs) {
					if (session.pcs[msg.UUID].restartIce) {
						log("Performing ICE restart for viewer " + msg.UUID);
						session.pcs[msg.UUID].restartIce();
					} else {
						log("Performing offer-based ICE restart for viewer " + msg.UUID);
						session.createOffer(msg.UUID, true);
					}
				}
			} else if (session.audience && msg.token) {
				session.audienceToken = msg.token;
				updateReshareLink();
			} else {
				log("what is this?");
			}
		};

		session.ws.onerror = async function (event) {
			if (event.currentTarget === session.ws && !session.security && !session.qosClosing) {
				session.queueQosError("signaling_failed", null, "webrtc.js", 0, true);
			}
			warnlog(event);
		};

		session.ws.onclose = async function (event) {
			if (session.director) {
				for (var peerUUID in session.rpcs) updateWhepDirectorControls(peerUUID);
			}
			if (event.currentTarget === session.ws && !event.wasClean && !session.security && !session.qosClosing) {
				session.queueQosError("signaling_failed", null, "webrtc.js", 0, true);
			}
			// this gets triggered, along with error, so we will ignore error.
			clearTimeout(session.pingTimeout);
			if (session.streamtakeover === true) {
				var closedTakeoverSocket = event && event.currentTarget ? event.currentTarget : session.ws;
				stopWebStreamTakeoverLease(closedTakeoverSocket);
			}
			pokeIframeAPI("hssConnection", "closed");
			pokeIframeAPI("hss-connection", "closed");
			try {
				if ("code" in event) {
					if (event.code == 503) {
						if (reconnect == false) {
							// we only want to show an error on first connection; no later on.
							clearTimeout(session.timeout); // probably shouldn't be needed
							if (!session.cleanOutput) {
								warnUser("Failed to connect to service: Error 503<br /><br />Possibly too many connections from the same address tried to connect.<br />Visit https://discord.vdo.ninja for support.", 30000, false);
							}
						}
					}
				}
			} catch (e) {
				errorlog(e);
			}

			warnlog("Connection to Control Server lost.\n\nWill try to reconnect in 2 seconds.");
			if (session.security == false) {
				// don't reconnect if security mode is enabled
				try {
					if (session.ws.readyState === WebSocket.CLOSED) {
						session.ws = null;
						setTimeout(() => {
							try {
								session.connect(true);
							} catch (e) { }
						}, 5000); // retry
					}
				} catch (e) {
					errorlog(e);
				}
			}
		};
	};

	session.sendMessage = function (msg, UUID = null) {
		// Publisher signs the request. This lets sub-viewers, if any, verify if a message is from the original publisher or not.
		//msg.timestamp = Date.now().toString();
		//msg.counter = session.counter;
		//return session.signData(msg,function(data,signature){  // just the publisher needs to sign; cause
		//session.counter += 1;

		//log("Messaging sent");
		//msg = msg.map(v => v === undefined ? null : v); // fix possible UNDEFINED issues

		if (UUID == null) {
			// send to all RTC peers i'm publishing to
			msg = JSON.stringify(msg);
			for (var i in session.pcs) {
				try {
					if (!session.pcs[i].sendChannel) { continue; }
					session.pcs[i].sendChannel.send(msg);
				} catch (e) {
					if (session.pcs[i].startTime + 100000 < Date.now()) {
						warnlog("RTC Connection seems to be dead or not yet open? 4");
					} else {
						log("RTC Connection seems to be dead or not yet open? 4");
					}
					//session.pcs[i].close();
					//delete(session.pcs[i]);
					// I suppose we need to handle this better;
				}
			}
			return true;
		} else if (session.pcs[UUID]) {
			try {
				if (!session.pcs[UUID].sendChannel) { return false; }
				session.pcs[UUID].sendChannel.send(JSON.stringify(msg));
				return true;
			} catch (e) {
				// Check if PCS connection is older than 30 seconds
				if (session.pcs[UUID].startTime + 30000 < Date.now()) {
					warnlog("RTC Connection seems to be dead or not yet open? 3");
				} else {
					log("RTC Connection seems to be dead or not yet open? 3");
				}
				//warnlog(JSON.stringify(msg));

				return false;
			}
		} else {
			warnlog("RTC Connection seems to be dead or not yet open? DOES NOT EXIST. was it deleted? 666");
		}
		return false;
		//});
	};

	function getDrawingColor(UUID) {
		try {
			if (typeof getColorFromName === "function") {
				return getColorFromName(UUID || "drawing");
			}
		} catch (e) { }
		return "red";
	}

	function styleDrawingPayload(draw, sourceUUID, forceColor = false) {
		if (!draw || typeof draw === "string") {
			return draw;
		}
		const color = getDrawingColor(sourceUUID);
		const styled = Object.assign({}, draw);
		// Preserve picker colors; legacy drawings keep their participant color.
		if (!styled.c || (forceColor && !/^#[0-9a-f]{6}$/i.test(styled.c))) {
			styled.c = color;
		}
		if (Array.isArray(styled.p)) {
			styled.p = styled.p.map(segment => {
				if (segment && typeof segment === "object") {
					const next = Object.assign({}, segment);
					if (!next.c || (forceColor && !/^#[0-9a-f]{6}$/i.test(next.c))) {
						next.c = styled.c;
					}
					return next;
				}
				return segment;
			});
		}
		return styled;
	}

	session.resolveDrawingRequest = function (UUID, approved, altUUID = false, targetUUID = false, targetIsScreen = false) {
		try {
			if (!UUID) {
				return false;
			}
			let sendUUID = UUID;
			let routeToScreen = !!targetIsScreen;
			if (session.pcs[UUID] && session.pcs[UUID].realUUID) {
				sendUUID = session.pcs[UUID].realUUID;
				routeToScreen = true;
			} else if ((!session.pcs[sendUUID] || session.pcs[sendUUID].realUUID) && altUUID && session.pcs[altUUID] && !session.pcs[altUUID].realUUID) {
				sendUUID = altUUID;
			}
			if (approved) {
				if (session.pcs[sendUUID]) {
					session.pcs[sendUUID].allowDrawing = true;
					session.pcs[sendUUID].drawControlAllowed = true;
					if (routeToScreen) {
						session.pcs[sendUUID].initialDrawing2 = false;
					} else {
						session.pcs[sendUUID].initialDrawing = false;
					}
				}
				if (sendUUID !== UUID && session.pcs[UUID]) {
					session.pcs[UUID].allowDrawing = true;
					session.pcs[UUID].drawControlAllowed = true;
				}
			}
			const reply = {
				drawingApproval: !!approved,
				allowdrawing: !!approved,
				drawingTargetUUID: targetUUID || false,
				drawingTargetIsScreen: !!routeToScreen
			};
			if (routeToScreen) {
				reply.altUUID = true;
			}
			return session.sendMessage(reply, sendUUID);
		} catch (e) {
			errorlog(e);
		}
		return false;
	};

	session.relayDrawingMessage = function (draw, sourceUUID, altUUID = false, targetIsScreen = false) {
		try {
			if (session.drawingRelay === false || !draw || !session.pcs) {
				return;
			}
			const sourceBaseUUID = altUUID || sourceUUID;
			const routeToScreen = !!targetIsScreen || !!altUUID || !!(session.pcs[sourceUUID] && session.pcs[sourceUUID].realUUID);
			const styledDraw = styleDrawingPayload(draw, sourceBaseUUID, true);
			for (var UUID in session.pcs) {
				if (session.pcs[UUID].realUUID) {
					continue;
				}
				if (UUID === sourceBaseUUID || UUID === sourceUUID) {
					continue;
				}
				if (!session.pcs[UUID].allowDrawing) {
					continue;
				}
				const relayMsg = {
					draw: styledDraw,
					drawingRelay: true,
					drawingSourceUUID: sourceBaseUUID,
					drawingTargetIsScreen: !!routeToScreen
				};
				if (routeToScreen) {
					relayMsg.altUUID = true;
				}
				session.sendMessage(relayMsg, UUID);
			}
		} catch (e) {
			errorlog(e);
		}
	};

	// Shared control messages can arrive over WSS before any data channel exists.
			session.processRPCSOnMessage = async function (msg, UUID) {
				if (msg.session && (("volume" in msg) || ("hangup" in msg))) {
					if (!session.pcs[UUID] || session.pcs[UUID].session !== msg.session) return;
					return session.processPCSOnMessage(msg, UUID);
				}
				if (msg.session && (("whepSettings" in msg) || ("whepScreenSettings" in msg) || ("screenStopped" in msg)) && (!session.rpcs[UUID] || session.rpcs[UUID].session !== msg.session)) return;
				if (session.rpcs[UUID]) {
					var screenStarted = msg.whepScreenSettings ? msg.whepScreenSettings.started : msg.screenStarted;
					if (typeof screenStarted === "number" && Number.isFinite(screenStarted) && screenStarted > 0) {
						var peer = session.rpcs[UUID];
						if (screenStarted < (peer.lastScreenStarted || 0) || screenStarted <= (peer.lastScreenStopped || 0)) return;
						peer.lastScreenStarted = screenStarted;
						if (msg.screenStopped === true) peer.lastScreenStopped = screenStarted;
					}
				}
				// quite important to rewrite this.
				//if (session.verifyData(msg,session.rpcs[event.target.UUID]['streamID'])){  // I'm just going to disable security for now.

				warnlog(msg);

				if ("translationLanguage" in msg && session.translationController) {
					session.translationController.setRemoteLanguage(UUID, msg.translationLanguage);
				}

				if ("bye" in msg) {
					warnlog("BYE RPCS");
					session.closeRPC(UUID, true); // user is telling us they are quitting, so lets clean up preemptively.
					return;
				} else if ("ping" in msg) {
					var data = {};
					data.pong = msg.ping;
					session.sendRequest(data, UUID);
					warnlog("PINGED");
					return;
				} else if ("pong" in msg) {
					try {
						if (session.rpcs[UUID]) {
							session.rpcs[UUID].lastPongToken = msg.pong;
							session.rpcs[UUID].lastPongAt = Date.now();
							if (session.rpcs[UUID].lastPingToken === msg.pong) {
								clearPeerLivenessPing(session.rpcs[UUID]);
							}
						}
					} catch (e) { }
					warnlog("PONGED");
					return;
				}

				log("incoming message from publisher");

				var mustUpdateMixer = false;
				var mustUpdateUserList = false;

				if ("description" in msg) {
					// we don't get the STREAM ID back with this. That could be good from a privacy point of view -- no one in the group call will have Stream ID access for publishing?
					session.processDescription(msg);
				} else if ("candidate" in msg) {
					msg.UUID = UUID; // make sure its set correctly
					log("GOT ICE!!");
					session.processIce(msg);
				} else if ("candidates" in msg) {
					msg.UUID = UUID; // make sure its set correctly
					log("GOT ICES!!");
					session.processIceBundle(msg);
				}

				if ("cbid" in msg) {
					checkRequestCallback(msg.cbid);
				}

				if ("sceneRestoreHash" in msg) {
					session.recordSceneRestoreHash(UUID, msg.sceneRestoreHash);
					return;
				}

				if ("rejected" in msg) {
					if (msg.rejected === "getConnectionMap" && typeof handleConnectionMapRejection === "function") {
						handleConnectionMapRejection(msg, UUID);
						return;
					}
					if (isIFrame && session.iframeMediaDeviceChangeRequests) {
						try {
							var rejectedDeviceKind2 = msg.rejected === "changeCamera" ? "camera" : msg.rejected === "changeMicrophone" ? "microphone" : msg.rejected === "changeSpeaker" ? "speaker" : false;
							var rejectedDeviceKey2 = rejectedDeviceKind2 ? UUID + ":" + rejectedDeviceKind2 : false;
							var rejectedDeviceRequest2 = rejectedDeviceKey2 ? session.iframeMediaDeviceChangeRequests[rejectedDeviceKey2] : false;
							if (rejectedDeviceRequest2) {
								if (rejectedDeviceRequest2.timer) {
									clearTimeout(rejectedDeviceRequest2.timer);
								}
								parent.postMessage(
									{
										guestMediaDeviceChange: {
											ok: false,
											error: msg.message || "Guest rejected device change",
											target: rejectedDeviceRequest2.target || (session.rpcs[UUID] && session.rpcs[UUID].streamID) || UUID,
											UUID: UUID,
											streamID: (session.rpcs[UUID] && session.rpcs[UUID].streamID) || false,
											kind: rejectedDeviceKind2,
											deviceId: rejectedDeviceRequest2.deviceId || false
										},
										cib: rejectedDeviceRequest2.cib || null
									},
									session.iframetarget
								);
								delete session.iframeMediaDeviceChangeRequests[rejectedDeviceKey2];
							}
						} catch (e) {
							errorlog(e);
						}
					}
					if (!session.director && !session.remote) {
						warnlog("Ignoring control rejection on a view-only page: " + msg.rejected);
						pokeIframeAPI("rejected", msg.rejected, UUID);
						return;
					}
					if (msg.rejected === "requestCoDirector") {
						session.directorState = false;
						if (!session.cleanOutput) {
							warnUser(getTranslation("director-denied"));
							//getById("head4").innerHTML = getTranslation("not-the-director");
							miniTranslate(getById("head4"), "not-the-director");
						}
					} else if (msg.rejected === "requestCoMigrate") {
						if (!session.cleanOutput) {
							warnUser(getTranslation("only-main-director"), 3000);
						}
					} else if (!session.cleanOutput) {
						if (msg.message) {
							warnUser(msg.message, 5000);
						} else if (session.directorUUID === UUID) {
							warnUser(getTranslation("request-failed"), 5000);
						} else if (session.remote && !session.director) {
							warnUser(getTranslation("tokens-did-not-match"), 5000);
						} else {
							warnUser(getTranslation("token-not-director"), 5000);
						}
					} else if (session.director) {
						if (!session.cleanOutput) {
							warnUser(msg.message || ("The request (" + msg.rejected + ") failed due to permissions or it was rejected by the user"), 5000);
						}
					} else if (!session.cleanOutput) {
						if (session.remote) {
							warnUser(getTranslation("remote-token-rejected"), 5000);
						} else {
							warnUser(getTranslation("remote-control-failed"), 5000);
						}
					} else {
						// we won't say anything; lets just ignore it.
					}

					errorlog("ACTION REJECTED: " + msg.rejected + ", isDirector: " + session.director);
					pokeIframeAPI("rejected", msg.rejected, UUID);
					return;
				} else if ("approved" in msg) {
					if (msg.approved === "requestCoDirector") {
						if (session.director) {
							try {
								if (session.label === false) {
									document.title = getTranslation("control-room-co-director");
								}
							} catch (e) {
								errorlog(e);
							}

							if (!session.cleanOutput && !session.directorState) {
								warnUser(getTranslation("approved-as-director"), 3000);
								//	getById("head4").innerHTML = getTranslation("you-are-a-codirector");
								miniTranslate(getById("head4"), "you-are-a-codirector");
								miniTranslate(getById("yourDirectorStatus"), "this-is-you");
								//getById("yourDirectorStatus").innerHTML = getTranslation("this-is-you");
							}
							if (!session.directorState) {
								// we're already approved, so no need to re-approve. And we probably already synced.
								session.directorState = true;
								pokeAPI("codirector", true);
								session.initialDirectorSync(UUID);
							}
						}
					}
					log("approved: " + msg.approved);
					pokeIframeAPI("approved", msg.approved, UUID);
					return;
				}

				if ("connectionMap" in msg) {
					// Handle mesh network visualization response from guest
					if (typeof handleConnectionMapResponse === "function") {
						handleConnectionMapResponse(msg, UUID);
					}
					return;
				}

				if ("iframeSrc" in msg) {
					try {
						session.rpcs[UUID].iframeSrc = msg.iframeSrc || false;

						if (session.director) {
							// this is only for the director
							if (session.rpcs[UUID].iframeSrc) {
								var iframeDetails = getById("iframeDetails_" + UUID);
								var sharedWebsite = String(session.rpcs[UUID].iframeSrc);
								var sharedWebsiteURL = false;
								try {
									sharedWebsiteURL = new URL(sharedWebsite, window.location.href);
								} catch (e) {}
								iframeDetails.textContent = "Shared website: ";
								if (sharedWebsiteURL && (sharedWebsiteURL.protocol === "https:" || sharedWebsiteURL.protocol === "http:")) {
									var sharedWebsiteLink = document.createElement("a");
									sharedWebsiteLink.href = sharedWebsiteURL.href;
									sharedWebsiteLink.textContent = sharedWebsite;
									sharedWebsiteLink.target = "_blank";
									sharedWebsiteLink.rel = "noopener noreferrer";
									iframeDetails.appendChild(sharedWebsiteLink);
								} else {
									iframeDetails.appendChild(document.createTextNode(sharedWebsite));
								}
								iframeDetails.classList.remove("hidden");
							} else {
								getById("iframeDetails_" + UUID).classList.add("hidden");
								getById("iframeDetails_" + UUID).innerText = "";
							}
						} else {
							if (session.rpcs[UUID].iframeSrc == false) {
								try {
									session.rpcs[UUID].iframeEle.remove();
								} catch (e) {
									errorlog(e);
								}
								if (session.rpcs[UUID].iframeVideo) {
									// meshcast only
									session.rpcs[UUID].iframeVideo.remove();
									session.rpcs[UUID].iframeVideo = false;
								}
								session.rpcs[UUID].iframeEle = false;
								mustUpdateMixer = true;
								if (session.broadcast !== false) {
									if (session.broadcast !== null) {
										if (session.rpcs[UUID].streamID === session.broadcast) {
											session.broadcastIFrame = false;
										}
									} else if (UUID == session.directorUUID) {
										session.broadcastIFrame = false;
									}
								}
							} else {
								if (session.broadcast !== false) {
									if (session.broadcast !== null) {
										if (session.rpcs[UUID].streamID === session.broadcast) {
											if (session.noiframe === false) {
												session.rpcs[UUID].iframeEle = loadIframe(msg.iframeSrc, UUID);
												mustUpdateMixer = true;
												session.broadcastIFrame = session.rpcs[UUID].iframeEle;
												if (session.rpcs[UUID].streamID) {
													session.rpcs[UUID].iframeEle.dataset.sid = session.rpcs[UUID].streamID;
												}
											} else if (session.rpcs[UUID].streamID in session.noiframe) {
												session.rpcs[UUID].iframeEle = loadIframe(msg.iframeSrc, UUID);
												mustUpdateMixer = true; // hopefully the director will bud out
												session.broadcastIFrame = session.rpcs[UUID].iframeEle;
												if (session.rpcs[UUID].streamID) {
													session.rpcs[UUID].iframeEle.dataset.sid = session.rpcs[UUID].streamID;
												}
											}
										}
									} else if (session.directorUUID) {
										if (UUID == session.directorUUID) {
											if (session.noiframe === false) {
												session.rpcs[UUID].iframeEle = loadIframe(msg.iframeSrc, UUID);
												mustUpdateMixer = true;
												session.broadcastIFrame = session.rpcs[UUID].iframeEle;
												if (session.rpcs[UUID].streamID) {
													session.rpcs[UUID].iframeEle.dataset.sid = session.rpcs[UUID].streamID;
												}
											} else if (session.rpcs[UUID].streamID in session.noiframe) {
												session.rpcs[UUID].iframeEle = loadIframe(msg.iframeSrc, UUID);
												mustUpdateMixer = true; // hopefully the director will bud out
												session.broadcastIFrame = session.rpcs[UUID].iframeEle;
												if (session.rpcs[UUID].streamID) {
													session.rpcs[UUID].iframeEle.dataset.sid = session.rpcs[UUID].streamID;
												}
											}
										}
									}
								} else {
									if (session.noiframe === false) {
										session.rpcs[UUID].iframeEle = loadIframe(msg.iframeSrc, UUID);
										mustUpdateMixer = true;
										if (session.rpcs[UUID].streamID) {
											session.rpcs[UUID].iframeEle.dataset.sid = session.rpcs[UUID].streamID;
										}
									} else if (session.rpcs[UUID].streamID in session.noiframe) {
										session.rpcs[UUID].iframeEle = loadIframe(msg.iframeSrc, UUID);
										mustUpdateMixer = true; // hopefully the director will bud out
										if (session.rpcs[UUID].streamID) {
											session.rpcs[UUID].iframeEle.dataset.sid = session.rpcs[UUID].streamID;
										}
									}
								}
							}
						}
					} catch (e) {
						errorlog(e);
					}
				} else if ("ifs" in msg) {
					// iframe sync
					if (session.rpcs[UUID].iframeEle) {
						try {
							if (session.rpcs[UUID].iframeSrc.startsWith("https://www.youtube.com/")) {
								// TODO ; this needs to be tracked someother way
								processIframeSyncUpdates(msg.ifs, UUID);
							}
						} catch (e) {
							errorlog(e);
						}
					}
				}

				if ("drawingApproval" in msg) {
					const approvalTargetUUID = msg.drawingTargetUUID || UUID;
					if (msg.drawingApproval && msg.allowdrawing) {
						if (session.rpcs[approvalTargetUUID]) {
							session.rpcs[approvalTargetUUID].allowDrawing = true;
						}
						try {
							if (typeof resumePendingDrawOnVideo === "function") {
								resumePendingDrawOnVideo(approvalTargetUUID);
							}
						} catch (e) {
							errorlog(e);
						}
					} else {
						try {
							if (session.pendingDrawingAccessRequests) {
								delete session.pendingDrawingAccessRequests[approvalTargetUUID];
							}
							if (typeof addLocalDrawingStatusMessage === "function") {
								addLocalDrawingStatusMessage("Drawing access was denied by the host.");
							}
						} catch (e) {
							errorlog(e);
						}
					}
					return;
				}

				if ("allowdrawing" in msg && msg.allowdrawing) {
					const drawingTargetUUID = msg.drawingTargetUUID || UUID;
					if (session.rpcs[drawingTargetUUID]) {
						session.rpcs[drawingTargetUUID].allowDrawing = msg.allowdrawing;
					}
					try {
						if (typeof resumePendingDrawOnVideo === "function") {
							resumePendingDrawOnVideo(drawingTargetUUID);
						}
					} catch (e) {
						errorlog(e);
					}
				}

				if ("draw" in msg) {
					const drawTargetElement = typeof getRenderedRemoteElement === "function" ? getRenderedRemoteElement(UUID) : session.rpcs[UUID].videoElement;
					if (drawTargetElement && (session.allowDrawing || session.rpcs[UUID].allowDrawing)) {
						let canvasOverlay = null;
						if (msg.drawingSourceUUID) {
							if (!session.rpcs[UUID].canvasOverlays) {
								session.rpcs[UUID].canvasOverlays = {};
							}
							if (!session.rpcs[UUID].canvasOverlays[msg.drawingSourceUUID]) {
								session.rpcs[UUID].canvasOverlays[msg.drawingSourceUUID] = receiveDrawingOnVideo(drawTargetElement, msg.drawingSourceUUID);
							}
							canvasOverlay = session.rpcs[UUID].canvasOverlays[msg.drawingSourceUUID];
						} else {
							if (!session.rpcs[UUID].canvasOverlay) {
								session.rpcs[UUID].canvasOverlay = receiveDrawingOnVideo(drawTargetElement, UUID);
							}
							canvasOverlay = session.rpcs[UUID].canvasOverlay;
						}
						if (canvasOverlay) {
							if (typeof msg.draw == "string") {
								if (msg.draw == "clear") {
									canvasOverlay.clearDrawing();
								} else if (msg.draw == "cleanup") {
									canvasOverlay.cleanup();
									if (msg.drawingSourceUUID && session.rpcs[UUID].canvasOverlays) {
										delete session.rpcs[UUID].canvasOverlays[msg.drawingSourceUUID];
									} else {
										session.rpcs[UUID].canvasOverlay = null;
									}
								} else if (msg.draw == "undo") {
									canvasOverlay.updateDrawing("undo");
								}
							} else {
								canvasOverlay.updateDrawing(msg.draw);
							}
						}
					}
					return;
				}


				if ("remote" in msg) {
					try {
						msg = await session.decodeRemote(msg);
						if (!msg) {
							return;
						}
					} catch (e) {
						errorlog(e);
					}
				}

				if ("obsCommand" in msg) {
					processOBSCommand(msg); // ie: msg.obsCommand = {changeScene: this.dataset.obsScene}
				}

				if ("chat" in msg) {
					var isDirector = false;
					var overlayMsg = false;
					if (session.directorUUID === UUID) {
						isDirector = true;
						if ("overlay" in msg) {
							overlayMsg = msg.overlay;
						}
					}
					if (session.director) {
						if (msg.chat == "Raised hand") {
							if (session.beepToNotify) {
								playtone();
							}
							getById("hands_" + UUID).classList.remove("hidden");
							session.rpcs[UUID].remoteRaisedHandElement.classList.remove("hidden");
							// Sync hand-raised state to co-directors (only main director syncs to avoid redundant broadcasts)
							try {
								if (session.directorState !== false && session.rpcs[UUID] && session.rpcs[UUID].streamID) {
									syncDirectorState({ dataset: { sid: session.rpcs[UUID].streamID } });
								}
							} catch (e) { errorlog(e); }
							//return;
						} else if (msg.chat == "Lowered hand") {
							getById("hands_" + UUID).classList.add("hidden");
							session.rpcs[UUID].remoteRaisedHandElement.classList.add("hidden");
							// Sync hand-lowered state to co-directors (only main director syncs to avoid redundant broadcasts)
							try {
								if (session.directorState !== false && session.rpcs[UUID] && session.rpcs[UUID].streamID) {
									syncDirectorState({ dataset: { sid: session.rpcs[UUID].streamID } });
								}
							} catch (e) { errorlog(e); }
							//return;
						}
					}
					log("isDirector " + isDirector);
					getChatMessage(msg.chat, session.rpcs[UUID].label, isDirector, overlayMsg, UUID);
				}

				if ("tip" in msg) {
					// Handle incoming tip notification
					if (typeof processTipMessage === 'function') {
						processTipMessage(msg.tip, UUID);
					}
				}

				if ("pipe" in msg) {
					session.gotGenericData(msg.pipe, UUID);
				}

				if ("autoSync" in msg) {
					session.autoSyncObject = msg.autoSync;
					session.autoSyncCallback(UUID);
				}

				if ("effectsData" in msg) {
					log(msg);
				}

				if ("group" in msg) {
					log(msg);
					if (msg.group) {
						session.rpcs[UUID].group = msg.group.split(",");
					} else {
						session.rpcs[UUID].group = [];
					}
					log(session.rpcs[UUID]);
					mustUpdateMixer = true;
					if (session.director && session.rpcs[UUID].streamID) {
						try {
							syncGroup(session.rpcs[UUID].group, UUID);
						} catch (e) {
							errorlog(e);
						}
					}
					pokeIframeAPI("remote-group-change", session.rpcs[UUID].group, UUID);
					//mustUpdateUserList = true;
				}

				if ("transcript" in msg) {
					log(msg);
					if (session.closedCaptions) {
						updateClosedCaptions(msg, session.rpcs[UUID].label, UUID);
					}
				}

				if ("cameraOperatorSettings" in msg) {
					pokeIframeAPI("camera-operator-settings", msg.cameraOperatorSettings, UUID);
				}
				if ("cameraOperatorRejected" in msg) {
					pokeIframeAPI("camera-operator-rejected", msg.cameraOperatorRejected, UUID);
				}
				if ("cameraEffectChange" in msg) {
					pokeIframeAPI("camera-operator-effect-change", msg.cameraEffectChange, UUID);
					if (session.director && msg.cameraEffectChange && msg.cameraEffectChange.ok === false) {
						warnUser(msg.cameraEffectChange.error || "The guest rejected the video effect change.", 4000);
					}
				}
				if ("mediaDeviceChange" in msg && isIFrame) {
					pokeIframeAPI("camera-operator-device-change", msg.mediaDeviceChange, UUID);
				}


				if (session.director) {
					if ("audioOptions" in msg) {
						updateDirectorsAudio(msg.audioOptions, UUID);
					}
					if ("mediaDevices" in msg) {
						gotDevicesRemote(msg.mediaDevices, UUID);
						if (isIFrame && session.iframeMediaDeviceRequests && session.iframeMediaDeviceRequests[UUID]) {
							try {
								var iframeDeviceRequest = session.iframeMediaDeviceRequests[UUID];
								iframeDeviceRequest.devices = msg.mediaDevices || [];
								if (iframeDeviceRequest.settleTimer) {
									clearTimeout(iframeDeviceRequest.settleTimer);
								}
								iframeDeviceRequest.settleTimer = setTimeout(function () {
									try {
										var request = session.iframeMediaDeviceRequests && session.iframeMediaDeviceRequests[UUID];
										if (!request) {
											return;
										}
										if (request.timer) {
											clearTimeout(request.timer);
										}
										var currentVideoLabel = false;
										var currentAudioLabel = false;
										var currentSpeakerLabel = false;
										var videoLabel = document.getElementById("remoteVideoLabel_" + UUID);
										var audioLabel = document.getElementById("remoteAudioLabel_" + UUID);
										var speakerSelect = document.getElementById("remoteAudioOutputSelect_" + UUID);
										if (videoLabel) {
											currentVideoLabel = videoLabel.innerText || false;
										}
										if (audioLabel) {
											currentAudioLabel = audioLabel.innerText || false;
										}
										if (speakerSelect && speakerSelect.selectedOptions && speakerSelect.selectedOptions[0]) {
											currentSpeakerLabel = speakerSelect.selectedOptions[0].text || false;
										}
										parent.postMessage(
											{
												guestMediaDevices: {
													ok: true,
													target: request.target || (session.rpcs[UUID] && session.rpcs[UUID].streamID) || UUID,
													UUID: UUID,
													streamID: (session.rpcs[UUID] && session.rpcs[UUID].streamID) || false,
													devices: request.devices || [],
													currentVideoLabel: currentVideoLabel,
													currentAudioLabel: currentAudioLabel,
													currentSpeakerLabel: currentSpeakerLabel
												},
												cib: request.cib || null
											},
											session.iframetarget
										);
										delete session.iframeMediaDeviceRequests[UUID];
									} catch (e) {
										errorlog(e);
									}
								}, 150);
							} catch (e) {
								errorlog(e);
							}
						}
					}
					if ("mediaDeviceChange" in msg) {
						if (isIFrame && session.iframeMediaDeviceChangeRequests && msg.mediaDeviceChange && msg.mediaDeviceChange.kind) {
							try {
								var mediaDeviceChangeKey = UUID + ":" + msg.mediaDeviceChange.kind;
								var mediaDeviceChangeRequest = session.iframeMediaDeviceChangeRequests[mediaDeviceChangeKey];
								if (mediaDeviceChangeRequest) {
									if (mediaDeviceChangeRequest.timer) {
										clearTimeout(mediaDeviceChangeRequest.timer);
									}
									parent.postMessage(
										{
											guestMediaDeviceChange: {
												ok: msg.mediaDeviceChange.ok !== false,
												error: msg.mediaDeviceChange.error || false,
												target: mediaDeviceChangeRequest.target || (session.rpcs[UUID] && session.rpcs[UUID].streamID) || UUID,
												UUID: UUID,
												streamID: (session.rpcs[UUID] && session.rpcs[UUID].streamID) || false,
												kind: msg.mediaDeviceChange.kind,
												deviceId: msg.mediaDeviceChange.deviceId || mediaDeviceChangeRequest.deviceId || false
											},
											cib: mediaDeviceChangeRequest.cib || null
										},
										session.iframetarget
									);
									delete session.iframeMediaDeviceChangeRequests[mediaDeviceChangeKey];
								}
							} catch (e) {
								errorlog(e);
							}
						}
					}
					if ("videoOptions" in msg) {
						updateDirectorsVideo(msg.videoOptions, UUID);
					}
					if ("recorder" in msg) {
						updateRemoteRecordButton(UUID, msg.recorder, msg.alt || false);
					}
					if ("gdrive" in msg) {
						updateGdriveButton(UUID, msg.gdrive, msg.alt || false);
					}
					if ("timer" in msg) {
						updateRemoteTimerButton(UUID, msg.timer);
					}
				}
				//else if (session.remote){
				//	if ("videoOptions" in msg){
				//		if ((session.remote===true) || (("remote" in msg) && (msg.remote === session.remote) && session.remote)){ // authorized
				////			updateRemotePTZControls(msg.audioOptions, UUID);
				//		}
				//	}
				//}

				if ("whepSettings" in msg) {
					whepWatch(UUID, msg.whepSettings); // this function filters out invalid meshcast requests instead now.
				} else if ("whepScreenSettings" in msg) {
					const screenSettings = { ...msg.whepScreenSettings, media: "screen" };
					whepWatch(UUID, screenSettings);
				} else if ("meshcast" in msg) {
					if (!session.noMeshcast) {
						meshcastWatch(UUID, msg.meshcast); // this function filters out invalid meshcast requests instead now.
					}
				}

				if ("lowerhand" in msg) {
					if (session.directorList.indexOf(UUID) >= 0) {
						if (session.raisehands) {
							lowerhand();
						}
					}
				}

				if ("isolateChannel" in msg) {
					if (session.directorList.indexOf(UUID) >= 0) {
						isolateIncomingChannel(msg.isolateChannel, UUID);
					}
				}

				if (!session.viewslot && (session.directorList.indexOf(UUID) >= 0)) {
					if ("layout" in msg) {
						session.layout = msg.layout;
						pokeIframeAPI("layout-updated", session.layout);
						mustUpdateMixer = true;
					}
					if ("layout_array" in msg) {
						session.layout_array = msg.layout_array;
					}
				}

				if ("infocus" in msg) {
					if (!session.ignoreHighlight) {
						session.infocus = false;
						session.infocus2 = false;
						if (session.broadcast === false) {
							log(msg);
							if (session.directorList.indexOf(UUID) >= 0) {
								if (msg["infocus"] !== false) {
									if (msg["infocus"] === session.streamID) {
										session.infocus = true;
									} else {
										if (session.view_set.length && !(msg["infocus"] in session.view_set)) {
											warnlog("NOT IN VIEW SET");
											session.infocus = false;
										} else if (session.view && session.view !== msg["infocus"]) {
											warnlog("NOT VIEW TARGET");
											session.infocus = false;
										} else if (session.scene !== false && session.directorUUID && session.directorUUID in session.rpcs && !session.rpcs[session.directorUUID].showDirector && msg["infocus"] === session.rpcs[session.directorUUID].streamID) {
											warnlog("not allowed to show the director");
											session.infocus = false;
										} else {
											for (var uid in session.rpcs) {
												if (session.rpcs[uid].streamID === msg["infocus"]) {
													session.infocus = uid;
													break;
												}
											}
											warnlog("ON FOCUS NOT FOUND");
										}
									}
								} else {
									session.infocus = false;
								}
								mustUpdateMixer = true;
								mustUpdateUserList = true;

								if (session.infocus) {
									session.infocusForceMode = true;
								} else {
									session.infocusForceMode = false;
								}
								if (typeof applyHighlightMuteFollow === "function") {
									applyHighlightMuteFollow(msg["infocus"]);
								}
							}
						}
					}
				} else if ("infocus2" in msg) {
					if (!session.ignoreHighlight) {
						session.infocus = false;
						session.infocus2 = false;
						if (session.broadcast === false) {
							log(msg);
							if (session.directorList.indexOf(UUID) >= 0) {
								if (msg["infocus2"] !== false) {
									if (msg["infocus2"] === session.streamID) {
										session.infocus2 = true;
									} else {
										if (session.view_set.length && !(msg["infocus2"] in session.view_set)) {
											warnlog("NOT IN VIEW SET");
											session.infocus2 = false;
										} else if (session.view && session.view !== msg["infocus2"]) {
											warnlog("NOT VIEW TARGET");
											session.infocus2 = false;
										} else if (session.scene !== false && session.directorUUID && session.directorUUID in session.rpcs && !session.rpcs[session.directorUUID].showDirector && msg["infocus2"] === session.rpcs[session.directorUUID].streamID) {
											warnlog("not allowed to show the director");
											session.infocus2 = false;
										} else {
											for (var uid in session.rpcs) {
												if (session.rpcs[uid].streamID === msg["infocus2"]) {
													session.infocus2 = uid;
													break;
												}
											}
											warnlog("ON FOCUS NOT FOUND");
										}
									}
								} else {
									session.infocus2 = false;
								}
								if (session.infocus2) {
									session.infocusForceMode = true;
								} else {
									session.infocusForceMode = false;
								}

								mustUpdateMixer = true;
								mustUpdateUserList = true;
							}
						}
					}
				}

				if ("allowmidi" in msg && msg.allowmidi !== false) {
					session.rpcs[UUID].allowMIDI = msg.allowmidi;
				}

				if ("sensors" in msg) {
					log(msg);
					session.rpcs[UUID].stats.sensors = msg.sensors;
					if (isIFrame) {
						parent.postMessage({ sensors: msg.sensors }, session.iframetarget);
					}
				}

				if ("midi" in msg) {
					playbackMIDI(msg.midi, false, UUID);
				}

				if ("fileList" in msg && msg.fileList) {
					addDownloadLink(msg.fileList, UUID, session.rpcs);
				}

				if ("rotate_video" in msg) {
					if (session.rpcs[UUID].rotate !== msg.rotate_video) {
						session.rpcs[UUID].rotate = msg.rotate_video;
						if (session.rpcs[UUID].videoElement) {
							session.rpcs[UUID].videoElement.rotated = session.rpcs[UUID].rotate;
							session.rpcs[UUID].videoElement.dataset.rotated = session.rpcs[UUID].rotate;
						}
						mustUpdateMixer = true;
					}
				}

				if ("info" in msg) {
					// info should only be initial data
					warnlog(msg);
					session.rpcs[UUID].stats.info = msg.info;
					if (session.translationController && msg.info.language) {
						session.translationController.setRemoteLanguage(UUID, msg.info.language);
					}

					if (msg.info.autoSync) {
						if (!session.autoSyncObject) {
							session.autoSyncObject = msg.info.autoSync;
							session.autoSyncCallback(UUID);
						}
					}

					if ("pseudoguest" in msg.info) {
						session.rpcs[UUID].pseudoguest = msg.info.pseudoguest;
					}

					if ("screenShareState" in msg.info) {
						const initialScreenShareState = !!msg.info.screenShareState;
						session.rpcs[UUID].screenShareState = initialScreenShareState;
						if (session.rpcs[UUID + "_screen"]) {
							session.rpcs[UUID + "_screen"].screenShareState = initialScreenShareState;
						}
						mustUpdateMixer = true;
					}

					if (msg.info.smallScreen) {
						session.rpcs[UUID].smallScreen = true;
					}

					if (session.director && msg.info.midi_url) {
						document.querySelectorAll("#guestFeeds [data--u-u-i-d='" + UUID + "'] .midi-controls").forEach(ele => {
							ele.classList.remove("hidden");
						});
					}

					// Only expose primary WHIP recovery when the guest reports a live restart capability.
					if (session.director) {
						var controls = getById("controls_" + UUID);
						if (controls) {
							var whipButton = controls.querySelector('[data-action-type="restart-whip"]');
							if (whipButton) {
								if (msg.info.whipRestartable) {
									whipButton.dataset.UUID = UUID;
									whipButton.classList.remove("hidden");
								} else {
									whipButton.classList.add("hidden");
									delete whipButton.dataset.UUID;
								}
							}
						}
					}

					if (msg.info.allowdrawing) {
						session.rpcs[UUID].allowDrawing = msg.info.allowdrawing;
						try {
							if (typeof resumePendingDrawOnVideo === "function") {
								resumePendingDrawOnVideo(UUID);
							}
							if (session.rpcs[UUID].videoElement && session.rpcs[UUID].videoElement.syncDrawOnVideo) {
								session.rpcs[UUID].videoElement.syncDrawOnVideo();
							}
						} catch (e) {
							errorlog(e);
						}
					}

					if (session.rpcs[UUID].signalMeter) {
						if (session.rpcs[UUID].stats.info.cpuLimited) {
							session.rpcs[UUID].signalMeter.dataset.cpu = "1";
						} else if ("cpuLimited" in session.rpcs[UUID].stats.info) {
							session.rpcs[UUID].signalMeter.dataset.cpu = "0";
						}
					}

					if ("obs_control" in msg.info) {
						if (msg.info.obs_control !== false) {
							session.rpcs[UUID].obsControl = msg.info.obs_control;
							session.obsStateSync("details", UUID);
						} else {
							session.rpcs[UUID].obsControl = false;
						}
					}

					if ("meta" in msg.info) {
						try {
							if (msg.info.meta && typeof msg.info.meta == "object") {
								session.rpcs[UUID].meta = msg.info.meta; //.label.replace(/[\W]+/g,"_").replace(/_+/g, ' ');
							} else {
								if (msg.info.meta) {
									// truthy but not an object; a peer tried to send meta and got the type wrong
									warnlog("info.meta ignored; expected an object, got " + typeof msg.info.meta);
								}
								session.rpcs[UUID].meta = false;
							}
						} catch (e) {
							errorlog(e);
						}
					}

					// Ensure newly-joined guests are instructed to connect to existing co-directors
					try {
						if (session.director && session.directorState === true) {
							for (var pid in session.pcs) {
								try {
									if (session.pcs[pid] && session.pcs[pid].coDirector === true) {
										var dmsg = { directorSettings: { addCoDirector: [pid] } };
										session.sendRequest(dmsg, UUID);
									}
								} catch (e) { }
							}
						}
					} catch (e) { errorlog(e); }


					if ("label" in msg.info) {
						try {
							// Don't overwrite director-set label with guest's info label
							if (!session.rpcs[UUID].labelSetByDirector) {
								if (typeof msg.info.label == "string") {
									session.rpcs[UUID].label = sanitizeLabel(msg.info.label); //.label.replace(/[\W]+/g,"_").replace(/_+/g, ' ');
								} else {
									session.rpcs[UUID].label = false;
								}
							}
							applyStyleEffect(UUID);
							if (session.director) {
								setupGuestLabelControl(UUID);
							}
							try { session.updateApprovalPrompt(UUID); } catch (e) { errorlog(e); }
						} catch (e) {
							errorlog(e);
						}
					}

					// Store tip acceptance info from peer
					if ("acceptsTips" in msg.info && msg.info.acceptsTips) {
						session.rpcs[UUID].acceptsTips = true;
						session.rpcs[UUID].tipId = msg.info.tipId || null;
						session.rpcs[UUID].tipServer = msg.info.tipServer || session.tipServer || "https://tip.vdo.ninja";
						session.rpcs[UUID].tipAmounts = msg.info.tipAmounts || [5, 10, 25, 50, 100];
						session.rpcs[UUID].tipCurrency = msg.info.tipCurrency || "USD";
						// Add tip icon if viewer has opted in (two-way opt-in)
						if (session.showTips && !session.cleanOutput) {
							if (typeof addTipIconToVideo === 'function') {
								addTipIconToVideo(UUID);
							}
						}
					}

					if ("order" in msg.info) {
						try {
							session.rpcs[UUID].order = parseInt(msg.info.order) || 0;
							if (session.director) {
								var elements = document.querySelectorAll('[data-action-type="order-value"][data--u-u-i-d="' + UUID + '"]');
								if (elements[0]) {
									elements[0].innerText = session.rpcs[UUID].order;
								}
							}
						} catch (e) {
							errorlog(e);
						}
					} else {
						session.rpcs[UUID].order = 0;
					}

					if ("preferChannel" in msg.info) {
						var ch = parseInt(msg.info.preferChannel);
						if (ch >= 1 && ch <= 8) {
							session.rpcs[UUID].preferChannel = ch;
						}
					}

					if (typeof msg.info.queued !== "undefined") {
						var stillQueued = msg.info.queued !== false && msg.info.queued !== null && msg.info.queued !== 0 && msg.info.queued !== 3;
						session.applyQueueStateChange(UUID, stillQueued, "guest-info");
						if (session.director && !session.queue) {
							if (stillQueued) {
								showRemoveQueueButton(UUID);
								session.promptApproval(UUID);
							} else if (msg.info.queued === 3) {
								hideRemoveQueueButton(UUID);
							}
						}
						// Remove from pending approvals list if we just processed this guest
						if (session.rpcs[UUID] && session.rpcs[UUID].streamID) {
							var pendingIdx = session.pendingApprovalStreamIDs.indexOf(session.rpcs[UUID].streamID);
							if (pendingIdx > -1) {
								session.pendingApprovalStreamIDs.splice(pendingIdx, 1);
							}
						}
						if (stillQueued && !session.directorUUID && session.codirector_transfer) {
							try {
								session.directorList.forEach(function (uuid) {
									session.initialDirectorSync(uuid);
								});
							} catch (e) {
								errorlog(e);
							}
						}
					}

					if (session.rpcs[UUID].batteryMeter) {
						try {
							if ("power_level" in msg.info) {
								if (msg.info.power_level !== null) {
									var level = session.rpcs[UUID].batteryMeter.querySelector(".battery-level");
									if (level) {
										var value = parseInt(session.rpcs[UUID].stats.info.power_level) || 0;
										if (value > 100) {
											value = 100;
										}
										if (value < 0) {
											value = 0;
										}
										level.style.height = parseInt(value) + "%";
										if (value < 10) {
											session.rpcs[UUID].batteryMeter.classList.remove("warn");
											session.rpcs[UUID].batteryMeter.classList.add("alert");
										} else if (value < 25) {
											session.rpcs[UUID].batteryMeter.classList.remove("alert");
											session.rpcs[UUID].batteryMeter.classList.add("warn");
										} else {
											session.rpcs[UUID].batteryMeter.classList.remove("alert");
											session.rpcs[UUID].batteryMeter.classList.remove("warn");
										}
										if (value < 100) {
											session.rpcs[UUID].batteryMeter.classList.remove("hidden");
										}
										session.rpcs[UUID].batteryMeter.title = value + "% battery remaining";
									}
								}
							}
							if ("plugged_in" in msg.info) {
								if (msg.info.plugged_in === false) {
									session.rpcs[UUID].batteryMeter.dataset.plugged = "0";
									session.rpcs[UUID].batteryMeter.classList.remove("hidden");
								} else {
									session.rpcs[UUID].batteryMeter.dataset.plugged = "1";
								}
							}
						} catch (e) {
							errorlog(e);
						}
					}

					if ("initial_group" in msg.info) {
						try {
							if (msg.info.initial_group) {
								session.rpcs[UUID].group = msg.info.initial_group.split(",");
							} else {
								session.rpcs[UUID].group = [];
							}
							if (session.director) {
								initGroupButtons(UUID);
								if (session.rpcs[UUID].group.length) {
									syncGroup(session.rpcs[UUID].group, UUID);
								}
							} else {
								mustUpdateMixer = true;
							}
						} catch (e) {
							errorlog(e);
						}
					}

					if ("muted" in msg.info) {
						try {
							session.rpcs[UUID].remoteMuteState = msg.info.muted;

							// Only proceed if we're showing mute/unmute states and not in clean output mode (unless director)
							if ((session.showMuteState || session.showUnMuteState || (session.scene === false)) && session.roomid && (!session.cleanOutput || session.director)) {

								// Create the element if it doesn't exist
								if (!session.rpcs[UUID].remoteMuteElement) {
									session.rpcs[UUID].remoteMuteElement = getById("muteStateTemplate").cloneNode(true);
									session.rpcs[UUID].remoteMuteElement.id = "remoteMuteState_" + UUID;
									session.rpcs[UUID].remoteMuteElement.classList.remove("hidden");
									mustUpdateMixer = true;
								}

								// Update element based on mute state and configuration
								if (session.rpcs[UUID].remoteMuteState) { // User is muted
									if (session.showMuteState || (session.scene === false)) {
										// Show muted icon
										session.rpcs[UUID].remoteMuteElement.classList.remove("unmuted");
										session.rpcs[UUID].remoteMuteElement.classList.remove("hidden");
									} else {
										// Don't show any icon if we don't want to show muted state
										session.rpcs[UUID].remoteMuteElement.classList.add("hidden");
									}
								} else { // User is unmuted
									if (session.showUnMuteState) {
										// Show unmuted icon
										session.rpcs[UUID].remoteMuteElement.classList.add("unmuted");
										session.rpcs[UUID].remoteMuteElement.classList.remove("hidden");

									} else {
										// Don't show any icon if we don't want to show unmuted state
										session.rpcs[UUID].remoteMuteElement.classList.add("hidden");
									}
								}
							} else {
								// Hide element completely if we're not showing any states
								if (session.rpcs[UUID].remoteMuteElement) {
									session.rpcs[UUID].remoteMuteElement.classList.add("hidden");
								}
							}

							pokeIframeAPI("remote-mute-state", session.rpcs[UUID].remoteMuteState, UUID);
						} catch (e) {
							errorlog(e);
						}
					}

					if (session.director) {
						try {
							if ("recording_audio_pipeline" in msg.info) {
								if (msg.info.recording_audio_pipeline == false) {
									initRecordingImpossible(UUID);
								}
							}
						} catch (e) {
							errorlog(e);
						}
						try {
							if ("recording_audio_gain" in msg.info) {
								if (msg.info.recording_audio_gain !== false) {
									let audioGain = parseInt(msg.info.recording_audio_gain) || 0;
									initAudioButtons(audioGain, UUID);
								}
							}
						} catch (e) {
							errorlog(e);
						}
						try {
							if ("directorSpeakerMuted" in msg.info) {
								if (msg.info.directorSpeakerMuted) {
									updateRemoteSpeakerMute(UUID);
								}
							}
						} catch (e) {
							errorlog(e);
						}
						try {
							if ("directorDisplayMuted" in msg.info) {
								if (msg.info.directorDisplayMuted) {
									updateRemoteDisplayMute(UUID);
								}
							}
						} catch (e) {
							errorlog(e);
						}


						if (session.openscene && msg.info.requestScenes && session.rpcs[UUID].streamID) {
							try {
								msg.info.requestScenes.forEach(scene => {
									var ele = getGuestTargetScene(scene, session.rpcs[UUID].streamID);
									if (ele) {
										directEnable(ele, true);
									}
								});
							} catch (e) {
								errorlog(e);
							}
						}
					}

					if ("directorVideoMuted" in msg.info) {
						try {
							if (session.director) {
								if (msg.info.directorVideoMuted) {
									updateDirectorVideoMute(UUID); //
								}
							} else {
								session.rpcs[UUID].directorVideoMuted = msg.info.directorVideoMuted;
								if (session.rpcs[UUID].directorVideoMuted) {
									if (UUID in session.rpcs) {
										session.requestRateLimit(0, UUID);
									}
								}
							}
						} catch (e) {
							errorlog(e);
						}
					}

					let updateRemoteMirror = false;
					if ("directorMirror" in msg.info) {
						try {
							if (session.director) {
								if (msg.info.directorMirror) {
									if (getById("container_" + UUID).querySelector('[data-action-type="mirror-guest"]')) {
										getById("container_" + UUID)
											.querySelector('[data-action-type="mirror-guest"]')
											.classList.add("pressed");
										getById("container_" + UUID).querySelector('[data-action-type="mirror-guest"]').ariaPressed = "true";
									}
								}
							}
							session.rpcs[UUID].mirrorState = msg.info.directorMirror;
							updateRemoteMirror = true;
						} catch (e) {
							errorlog(e);
						}
					}

					if ("directorFlip" in msg.info) {
						try {
							session.rpcs[UUID].flipState = msg.info.directorFlip;
							updateRemoteMirror = true;
						} catch (e) {
							errorlog(e);
						}
					}

					if (updateRemoteMirror && session.rpcs[UUID].videoElement) {
						try {
							applyMirrorGuest(
								session.rpcs[UUID].mirrorState,
								session.rpcs[UUID].videoElement,
								session.rpcs[UUID].flipState
							);
						} catch (e) {
							errorlog(e);
						}
					}

					if ("video_muted_init" in msg.info) {
						try {
							session.rpcs[UUID].videoMuted = msg.info.video_muted_init;
							if (session.rpcs[UUID].videoMuted) {
								if (session.director) {
									session.rpcs[UUID].remoteVideoMuteElement.classList.remove("hidden");
								}
							}
							pokeIframeAPI("remote-video-mute-state", session.rpcs[UUID].videoMuted, UUID);
						} catch (e) {
							errorlog(e);
						}
					}

					if ("rotate_video" in msg.info) {
						if (session.rpcs[UUID].rotate !== msg.info.rotate_video) {
							session.rpcs[UUID].rotate = msg.info.rotate_video;
							if (session.rpcs[UUID].videoElement) {
								session.rpcs[UUID].videoElement.rotated = session.rpcs[UUID].rotate;
								session.rpcs[UUID].videoElement.dataset.rotated = session.rpcs[UUID].rotate;
							}
							mustUpdateMixer = true;
						}
					}

					if ("room_init" in msg.info) {
						if (msg.info.room_init === false) {
							soloLinkGeneratorInit(UUID);
						}
					}

					directorCoDirectorColoring(UUID);
					mustUpdateUserList = true;

					pokeAPI("details", getDetailedState(session.rpcs[UUID].streamID));
					pokeIframeAPI("view-connection-info", msg.info, UUID);
				}

				if ("miniInfo" in msg) {
					// this needs to happen after msg.info as it replaces the stats completely. miniInfo just updates.
					if (session.rpcs[UUID].stats && session.rpcs[UUID].stats.info) {
						processMiniInfoUpdate(msg.miniInfo, UUID);
					}
				}

				if (msg.directorSettings) {
					session.rpcs[UUID].director = true; // this is not a real thing; it's just in case.
					var directorSenderUUID = (UUID || "").toString();
					if (session.rpcs && session.rpcs[directorSenderUUID] && session.rpcs[directorSenderUUID].realUUID) {
						directorSenderUUID = session.rpcs[directorSenderUUID].realUUID.toString();
					} else if (directorSenderUUID.endsWith("_screen")) {
						directorSenderUUID = directorSenderUUID.slice(0, -7);
					}

					if (msg.directorSettings.tokenDirector) {
						await checkToken();
					}

					if (session.directorUUID === directorSenderUUID) {
						// only allow the main director to adjust these settings

						if ("totalRoomBitrate" in msg.directorSettings) {
							session.totalRoomBitrate = parseInt(msg.directorSettings.totalRoomBitrate) || 0;
							session.totalRoomBitrate_userSet = true;
							mustUpdateMixer = true;
						}
						if (msg.directorSettings.soloVideo) {
							var soloVideoMode = false;
							if ("soloVideoMode" in msg.directorSettings) {
								soloVideoMode = msg.directorSettings.soloVideoMode;
							}
							if (session.broadcast === false) {
								if (soloVideoMode === "alt") {
									session.infocus = false;
									mustUpdateMixer = true;
									mustUpdateUserList = true;
									// rely on the dedicated infocus2 sync path to populate session.infocus2
								} else {
									if (msg.directorSettings.soloVideo === session.streamID) {
										session.infocus = true;
									} else {
										for (var uid in session.rpcs) {
											if (session.rpcs[uid].streamID === msg.directorSettings.soloVideo) {
												if ((session.directorList.includes(uid) || session.rpcs[uid].director) && !session.showDirector) {
													break;
												}
												session.infocus = uid;
												break;
											}
										}
									}
									mustUpdateMixer = true;
									mustUpdateUserList = true;
								}
							}
						}

						if ("showDirector" in msg.directorSettings) {
							if (session.scene !== false) {
								if (session.showDirector) {
									session.rpcs[UUID].showDirector = session.showDirector;
								} else if (msg.directorSettings.showDirector) {
									session.rpcs[UUID].showDirector = msg.directorSettings.showDirector;
								}
							}
						}
						if (session.scene !== false) {
							if (msg.directorSettings.scene) {
								for (var uid in msg.directorSettings.scene) {
									setTimeout(
										function (dat) {
											session.directorActions(dat);
										},
										1000,
										msg.directorSettings.scene[uid]
									);
								}
							}
							if (msg.directorSettings.mute) {
								for (var uid in msg.directorSettings.mute) {
									setTimeout(
										function (dat) {
											session.directorActions(dat);
										},
										1000,
										msg.directorSettings.mute[uid]
									);
								}
							}
						}

						if ("addCoDirector" in msg.directorSettings) {
							// only the main director can assign co-directorship; guests mark co-directors visually
							for (var i = 0; i < msg.directorSettings.addCoDirector.length; i++) {
								var coUUID = msg.directorSettings.addCoDirector[i].toString();
								if (!session.directorList.includes(coUUID)) {
									session.directorList.push(coUUID);
									addDirectorBlue(coUUID);
								}
								// If co-director already connected before we knew about them (race condition),
								// and we deferred publishing, start publishing now (only for holdwithvideo, not hold)
								if (coUUID in session.pcs && session.pcs[coUUID].needsPublishing && session.queueType == 4) {
									session.initialPublish(coUUID);
								}
							}
						}
					}

				}

				// ## TODO, update from the codirector once they get approved.  Check the first connected users.

				if (session.directorList.indexOf(UUID) >= 0) {
					if (session.scene !== false) {
						// this is a scene change by a director
						if ("action" in msg) {
							session.directorActions(msg);
						}

						if ("audioOutputChannel" in msg && msg.sid) {
							for (var uid in session.rpcs) {
								if (session.rpcs[uid].streamID === msg.sid) {
									if (msg.audioOutputChannel) {
										session.rpcs[uid].channelOffset = parseInt(msg.audioOutputChannel) || false;
										session.rpcs[uid].channelOffset -= 1; // 0 is channel 1
									} else {
										session.rpcs[uid].channelOffset = false;
									}
									updateIncomingVideoElement(uid, false, true);
									break;
								}
							}
						}
					}
					if ("directorSettings" in msg && msg.directorSettings.blindAllGuests) {
						// will not unblind; just blind.
						if (!session.director) {
							// co director can do this.
							if (session.scene === false) {
								session.directorDisplayMuted = true;
								session.directorDisplayMute();
							}
						}
					}
					if ("mirrorGuestState" in msg && "mirrorGuestTarget" in msg) {
						if (msg.mirrorGuestTarget && msg.mirrorGuestTarget === true) {
							session.permaMirrored = msg.mirrorGuestState;
							session.mirrorOutput = msg.mirrorGuestState;
							applyMirror(session.mirrorExclude);

							if (session.director) {
								var mirrorButton = getById("container_director").querySelector('[data-action-type="mirror-guest"]');
								if (mirrorButton) {
									if (msg.mirrorGuestState) {
										mirrorButton.classList.add("pressed");
										mirrorButton.ariaPressed = "true";
										mirrorButton.value = 1;
									} else {
										mirrorButton.classList.remove("pressed");
										mirrorButton.ariaPressed = "false";
										mirrorButton.value = 0;
									}
								}
							}
						} else if (msg.mirrorGuestTarget && msg.mirrorGuestTarget in session.rpcs) {
							session.rpcs[msg.mirrorGuestTarget].mirrorState = msg.mirrorGuestState;
							if (session.rpcs[msg.mirrorGuestTarget].videoElement) {
								applyMirrorGuest(
									msg.mirrorGuestState,
									session.rpcs[msg.mirrorGuestTarget].videoElement,
									session.rpcs[msg.mirrorGuestTarget].flipState
								); // mirror, videoElement
							}

							if (session.director) {
								var mirrorButton = getById("container_" + msg.mirrorGuestTarget).querySelector('[data-action-type="mirror-guest"]');
								if (mirrorButton) {
									if (msg.mirrorGuestState) {
										mirrorButton.classList.add("pressed");
										mirrorButton.ariaPressed = "true";
										mirrorButton.value = 1;
									} else {
										mirrorButton.classList.remove("pressed");
										mirrorButton.ariaPressed = "false";
										mirrorButton.value = 0;
									}
								}
							}
						}
					}

					// RPCS
					if ("directorState" in msg) {
						// this is the codirector getting an update from the main director or another codirector
						if (!session.syncState) {
							session.syncState = {};
						}
						var incomingState = msg.directorState || {};
						for (var sid in incomingState) {
							session.syncState[sid] = incomingState[sid];
							syncSceneState(sid);
							syncOtherState(sid);
							syncLabelState(sid);
						}
						log(msg);
						pokeAPI("details", session.syncState);
					}

					if ("widgetSrc" in msg) {
						session.widget = msg.widgetSrc || false;
						let widget = document.getElementById("widget");
						try {
							if (widget) {
								if (!session.widget) {
									document.getElementById("widget").remove();
									mustUpdateMixer = true;
								} else {
									widget.src = parseURL4Iframe(session.widget);
								}
							} else {
								mustUpdateMixer = true;
							}
							if (session.director) {
								getById("widgetURL").value = session.widget || "";
							}
						} catch (e) {
							errorlog(e);
						}
						pokeIframeAPI("widget-src", session.widget, UUID);
					}

					if ("slotsUpdate" in msg) {
						// might need to limit this to the main director only
						session.currentSlots = msg.slotsUpdate;
						if ("reservedSlots" in msg) {
							session.reservedSlots = normalizeSlotReservations(msg.reservedSlots);
						}
						if ("slotReservationsEnabled" in msg) {
							session.slotReservationsEnabled = !!msg.slotReservationsEnabled;
							populateSlotPicker();
							updateSlotReservationUI();
						}

						// Update local UI to match
						if (session.director) {
							updateSlotUI();
						}

						// Handle viewslot mode
						if (session.viewslot) {
							try {
								let sID = session.currentSlots[session.viewslot];
								if (sID) {
									if (session.layout && !session.layout[sID]) {
										session.layout = {
											[sID]: { h: 100, w: 100, x: 0, y: 0, c: session.cover }
										};
										updateMixer();
									}
								} else if (session.layout && Object.keys(session.layout).length) {
									session.layout = {};
									updateMixer();
								}
							} catch (e) {
								errorlog(e);
							}
						} else if (!session.obsSceneSync() && session.updateOnSlotChange) {
							if (session.layout_array) {
								session.layout = combinedLayout(session.layout_array);
								updateMixer();
							}
							if (session.layout) {
								session.layout = combinedLayoutSimple(session.layout);
								updateMixer();
							}
						}
						warnlog(msg);
					}
					if ("layouts" in msg) {
						// might need to limit this to the main director only
						session.layouts = msg.layouts;
						if ("obsSceneTriggers" in msg) {
							// might need to limit this to the main director only
							session.obsSceneTriggers = msg.obsSceneTriggers;
							session.obsSceneSync();
						} else {
							session.obsSceneTriggers = false;
						}
					}

					if ("stopClock" in msg) {
						stopClock();
					}
					if ("resumeClock" in msg) {
						resumeClock();
					}
					if ("setClock" in msg) {
						setClock(msg.setClock);
					}
					if ("hideClock" in msg) {
						hideClock();
					}
					if ("showClock" in msg) {
						showClock();
					}
					if ("startClock" in msg) {
						startClock();
					}
					if ("pauseClock" in msg) {
						pauseClock();
					}

					if ("showTime" in msg) {
						if (session.showTime !== false) {
							if (msg.showTime && !session.showTime) {
								toggleClock(msg.clock24 || false);
							} else if (!msg.showTime && session.showTime) {
								toggleClock(msg.clock24 || false);
							}
						}
					}
				}

				if ("order" in msg) {
					session.rpcs[UUID].order = parseInt(msg.order) || 0;
					if (UUID in session.pcs) {
						session.pcs[UUID].order = parseInt(msg.order) || 0;
					}
					if (session.director) {
						var elements = document.querySelectorAll('[data-action-type="order-value"][data--u-u-i-d="' + UUID + '"]');
						//log(elements);
						if (elements[0]) {
							elements[0].innerText = parseInt(msg.order) || 0;
						}
					}
					mustUpdateMixer = true;
				}

				if ("changeLabel" in msg) {
					log("Change Label");
					if ("value" in msg) {
						log("value there");
						if (typeof msg.value == "string") {
							session.rpcs[UUID].label = sanitizeLabel(msg.value); //.replace(/[\W]+/g,"_").replace(/_+/g, ' ');
							if (session.rpcs[UUID].label.length == 0) {
								session.rpcs[UUID].label = false;
							}
							applyStyleEffect(UUID);
							if (session.director) {
								// could be director, getting a confirmation.
								updateLabelDirectors(UUID);
							} else if (session.showlabels) {
								mustUpdateMixer = true;
							}
						} else {
							session.rpcs[UUID].label = false;
							applyStyleEffect(UUID);
							if (session.director) {
								// could be director, getting a confirmation.
								updateLabelDirectors2(UUID);
							} else if (session.showlabels) {
								mustUpdateMixer = true;
							}
						}
						mustUpdateUserList = true;
						pokeIframeAPI("remote-label-changed", session.rpcs[UUID].label, UUID);
					}
				}

				if ("muteState" in msg) {
					log(msg);
					session.rpcs[UUID].remoteMuteState = msg.muteState;
					session.requestRateLimit(false, UUID);

					// Update stats info if available
					if (session.rpcs[UUID].stats.info) {
						session.rpcs[UUID].stats.info.muted = session.rpcs[UUID].remoteMuteState;
					}

					// Only proceed if we're showing mute/unmute states and not in clean output mode (unless director)
					if ((session.showMuteState || session.showUnMuteState || (session.scene === false)) && session.roomid && (!session.cleanOutput || session.director)) {

						// Create the element if it doesn't exist
						if (!session.rpcs[UUID].remoteMuteElement) {
							session.rpcs[UUID].remoteMuteElement = getById("muteStateTemplate").cloneNode(true);
							session.rpcs[UUID].remoteMuteElement.id = "remoteMuteState_" + UUID;
							mustUpdateMixer = true;
						}

						// Update element based on mute state and configuration
						if (session.rpcs[UUID].remoteMuteState) { // User is muted
							if (session.showMuteState || (session.scene === false)) {
								// Show muted icon
								session.rpcs[UUID].remoteMuteElement.classList.remove("unmuted");
								session.rpcs[UUID].remoteMuteElement.classList.remove("hidden");
							} else {
								// Don't show any icon if we don't want to show muted state
								session.rpcs[UUID].remoteMuteElement.classList.add("hidden");
							}
						} else { // User is unmuted
							if (session.showUnMuteState) {
								// Show unmuted icon
								session.rpcs[UUID].remoteMuteElement.classList.add("unmuted");
								session.rpcs[UUID].remoteMuteElement.classList.remove("hidden");
							} else {
								// Don't show any icon if we don't want to show unmuted state
								session.rpcs[UUID].remoteMuteElement.classList.add("hidden");
							}
						}

						mustUpdateUserList = true;
					} else {
						// Hide element completely if we're not showing any states
						if (session.rpcs[UUID].remoteMuteElement) {
							session.rpcs[UUID].remoteMuteElement.classList.add("hidden");
						}
					}

					pokeAPI("remoteMuted", session.rpcs[UUID].remoteMuteState, session.rpcs[UUID].streamID);
					pokeIframeAPI("remote-mute-state", msg.muteState, UUID);
				}

				if ("requestSceneUpdate" in msg) {
					var chromeVersion = getChromiumVersion();
					if (chromeVersion) {
						if (chromeVersion < 80) {
							// this fixes a chrome bug.
							mustUpdateMixer = true;
						}
					}
				}

				if ("videoMuted" in msg) {
					log("videoMuted: " + msg.videoMuted);
					session.rpcs[UUID].videoMuted = msg.videoMuted;

					if (session.rpcs[UUID].videoMuted) {
						// v.dataset.aspectRatio
						if (!session.manual) {
							// if manual mode, we won't auto rate limit.  Not sure what else to do about that.
							session.requestRateLimit(0, UUID); // this is undone by the auto mixer,
							// the mixer doesn't run if the director is on
						}
						if (session.rpcs[UUID].imageElement) {
							session.rpcs[UUID].imageElement.hidden = true;
							session.rpcs[UUID].imageElement.style.visibility = "hidden";
						}
					} else {
						if (!session.switchMode) {
							applyQualityDirector(UUID);
						}
						updateIncomingVideoElement(UUID, true, false);
					}
					mustUpdateMixer = true;

					if (session.director) {
						if (session.rpcs[UUID].videoMuted) {
							session.rpcs[UUID].remoteVideoMuteElement.classList.remove("hidden");
						} else {
							session.rpcs[UUID].remoteVideoMuteElement.classList.add("hidden");
						}
					}

					if (session.rpcs[UUID].defaultSpeaker && session.rpcs[UUID].videoMuted) {
						// finish this.
						setTimeout(function () {
							activeSpeaker();
						}, 0);
					} else if (!session.rpcs[UUID].videoMuted) {
						setTimeout(function () {
							activeSpeaker();
						}, 0);
					}

					mustUpdateUserList = true;
					pokeAPI("remoteVideoMuted", session.rpcs[UUID].videoMuted, session.rpcs[UUID].streamID);
					pokeIframeAPI("remote-video-mute-state", msg.videoMuted, UUID);
				}

				if ("screenStopped" in msg) {
					if (UUID + "_screen" in session.rpcs) {
						session.rpcs[UUID + "_screen"].virtualHangup = msg.screenStopped;

						try {
							if (session.rpcs[UUID + "_screen"].virtualHangup) {
								if (!(SafariVersion && SafariVersion > 16) && (iPad || iOS)) {
									// bug in safari mobile
									session.rpcs[UUID + "_screen"].videoElement.needsLoading = true;
								}
							}
						} catch (e) { }

						if (session.director) {
							if (msg.screenStopped) {
								getById("container_" + UUID + "_screen").classList.add("screenshareNotActive");
							} else {
								getById("container_" + UUID + "_screen").classList.remove("screenshareNotActive");
							}
						}

						mustUpdateMixer = true;
						mustUpdateUserList = true;
					}
					if ("screenStopped" in msg) {
						if (msg.screenStopped) {
							// Reset screenshare flags so layouts don't keep treating this as active
							try {
								if (UUID in session.rpcs) {
									session.rpcs[UUID].screenShareState = false;
								}
								if (UUID + "_screen" in session.rpcs) {
									session.rpcs[UUID + "_screen"].screenShareState = false;
								}
							} catch (e) {
								errorlog(e);
							}
							stopScreenWhep(UUID);
						} else {
							try {
								if (UUID in session.rpcs) {
									session.rpcs[UUID].screenShareState = true;
								}
								if (UUID + "_screen" in session.rpcs) {
									session.rpcs[UUID + "_screen"].screenShareState = true;
								}
							} catch (e) {
								errorlog(e);
							}
							mustUpdateMixer = true;
						}
					}
				}

				if ("screenShareState" in msg) {
					let hasActiveScreenTracks = false;
					let screenRPC = null;
					try {
						if (session.rpcs && session.rpcs[UUID + "_screen"]) {
							screenRPC = session.rpcs[UUID + "_screen"];
							if (screenRPC.streamSrc) {
								hasActiveScreenTracks = screenRPC.streamSrc.getVideoTracks().some(trk => trk.readyState === "live");
							}
						}
					} catch (e) { }

					// Do not clear an active screenshare when tracks are already flowing
					if (msg.screenShareState === false && hasActiveScreenTracks) {
						msg.screenShareState = true;
					}

					session.rpcs[UUID].screenShareState = msg.screenShareState;
					if (screenRPC && msg.screenShareState) {
						screenRPC.screenShareState = true;
					}
					if (msg.screenShareState) {
						maybeStartScreenWhep(UUID);
					} else {
						stopScreenWhep(UUID);
					}
					mustUpdateMixer = true;
					pokeIframeAPI("remote-screenshare-state", msg.screenShareState, UUID);
				}

				if ("directVideoMuted" in msg) {
					// hide video entirely; style doesn't impact this.
					if (!session.director) {
						if ("target" in msg) {
							if (session.directorList.indexOf(UUID) >= 0) {
								var uuid = msg.target;
								if (uuid === true) {
									session.directorVideoMuted = msg.directVideoMuted;
								} else if (uuid in session.rpcs) {
									session.rpcs[uuid].directorVideoMuted = msg.directVideoMuted;
									if (session.rpcs[uuid].directorVideoMuted) {
										session.requestRateLimit(0, uuid);
									}
									mustUpdateMixer = true;
								}
							}
						}
					}
					mustUpdateUserList = true;
				}

				if ("virtualHangup" in msg) {
					if (!session.director) {
						if (session.directorList.indexOf(UUID) >= 0) {
							if (UUID in session.rpcs) {
								session.rpcs[UUID].virtualHangup = msg.virtualHangup;
								if (session.rpcs[UUID].virtualHangup) {
									if (UUID in session.rpcs) {
										session.requestRateLimit(0, UUID);
									}
								}
								mustUpdateMixer = true;
							}
						}
					}
					mustUpdateUserList = true;
				}

				if ("requestFile" in msg) {
					log("requestFile in reverse");
					try {
						session.sendFile(UUID, msg.requestFile);
					} catch (e) {
						errorlog(e);
					}
				}

				if ("remoteStats" in msg) {
					remoteStats(msg, UUID);
				}

				if (mustUpdateMixer) {
					setTimeout(function () {
						updateMixer();
						updateUserList();
					}, 1);
				} else if (mustUpdateUserList) {
					updateUserList();
				}
			};



	var sendRequestCallbacks = {};
	function checkRequestCallback(cbid) {
		try {
			var runMe = sendRequestCallbacks[cbid] || false;
			if (runMe) {
				clearTimeout(runMe[1]);
				delete sendRequestCallbacks[cbid];
				warnlog("RUNNING CALLBACK: " + cbid);
				runMe[0]();
			}
		} catch (e) {
			errorlog(e);
		}
	}

	// Legacy remove/approve helpers (no co-director request path)
	function hideRemoveQueueButton(UUID) {
		try {
			var elements = document.querySelectorAll('[data-action-type="remove-queue"][data--u-u-i-d="' + UUID + '"]');
			if (elements && elements[0]) {
				elements[0].classList.add("hidden");
			}
		} catch (e) {
			/* noop */
		}
	}

	function showRemoveQueueButton(UUID, retryCount = 0) {
		try {
			var elements = document.querySelectorAll('[data-action-type="remove-queue"][data--u-u-i-d="' + UUID + '"]');
			if (elements && elements[0]) {
				elements[0].classList.remove("hidden");
			} else if (retryCount < 3) {
				// Element may not exist yet (race condition); retry after short delay
				setTimeout(function () {
					showRemoveQueueButton(UUID, retryCount + 1);
				}, 200);
			}
		} catch (e) {
			/* noop */
		}
	}

	// Push minimal directorState updates to co-directors + director peers
	session.pushDirectorStateUpdate = function (payload, reason = "unspecified") {
		try {
			if (!payload || !payload.directorState) {
				return;
			}
			if (!(session.director || session.directorState || session.scene)) {
				return;
			}
			if (session.debug) {
				log("[queue-sync] sending directorState update (" + reason + ")");
			}
			for (var uuid in session.pcs) {
				if (session.pcs[uuid].coDirector) {
					session.sendMessage(payload, uuid);
				}
			}
			if (session.directorList && session.directorList.length) {
				for (var i in session.directorList) {
					var duuid = session.directorList[i];
					if (session.rpcs[duuid]) {
						session.sendRequest(payload, duuid);
					}
				}
			}
		} catch (e) {
			errorlog(e);
		}
	};

	// Single source of truth: main director updates UI + syncState and notifies co-directors
	session.applyQueueStateChange = function (UUID, isQueued, reason = "unspecified") {
		if (!UUID) {
			return;
		}

		var streamID = false;
		try {
			if (session.rpcs[UUID] && session.rpcs[UUID].streamID) {
				streamID = session.rpcs[UUID].streamID;
			}
		} catch (e) { }

		// Local UI toggle for the director page
		if (session.director && !session.queue) {
			if (isQueued) {
				showRemoveQueueButton(UUID);
			} else {
				hideRemoveQueueButton(UUID);
				try {
					closeModal(false, "approval-" + UUID);
				} catch (e) {
					/* noop */
				}
			}
		}

		// Directors/co-directors or scene contexts can fan out state; guests cannot
		if (!session.director && !session.scene) {
			return;
		}
		if (!streamID) {
			return;
		}

		try {
			if (!session.syncState) {
				session.syncState = {};
			}

			var detailedState = {};
			try {
				detailedState = getDetailedState(streamID) || {};
			} catch (e) {
				detailedState = {};
			}

			var currentState = session.syncState[streamID] || detailedState[streamID] || { streamID: streamID };
			var mergedOthers = {};
			if (currentState.others) {
				for (var key in currentState.others) {
					mergedOthers[key] = currentState.others[key];
				}
			}
			mergedOthers["remove-queue"] = !!isQueued;

			var updatedState = Object.assign({}, currentState, { others: mergedOthers });
			session.syncState[streamID] = updatedState;

			if (session.debug) {
				log("[queue-sync] " + streamID + " queued=" + isQueued + " reason=" + reason);
			}

			var payload = { directorState: {} };
			payload.directorState[streamID] = updatedState;
			session.pushDirectorStateUpdate(payload, reason);
			try {
				pokeAPI("details", payload.directorState, streamID);
			} catch (e) {
				errorlog(e);
			}
		} catch (e) {
			errorlog(e);
		}

		if (!isQueued && session.sceneRestore && typeof session.applySceneRestoreForUUID === "function") {
			setTimeout(function () {
				session.applySceneRestoreForUUID(UUID);
			}, 100);
		}
	};

	session.canUseSceneRestore = function () {
		if (!(session.sceneRestore && session.director && session.directorState === true)) {
			return false;
		}
		if (session.directorUUID && session.UUID && session.directorUUID !== session.UUID) {
			return false;
		}
		return true;
	};

	session.getSceneRestoreRoomKey = function () {
		var roomKey = session.roomid || session.roomenc || session.permaid || "default";
		var hashKey = session.hash || "";
		return (roomKey + "_" + hashKey).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 120) || "default";
	};

	session.getSceneRestoreDirectorStorageKey = function () {
		return "vdo_scene_restore_director_v1_" + session.getSceneRestoreRoomKey();
	};

	session.getSceneRestoreGuestStorageKey = function () {
		var streamKey = session.streamID || session.permaid || "guest";
		streamKey = (streamKey + "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80) || "guest";
		return "vdo_scene_restore_guest_v1_" + session.getSceneRestoreRoomKey() + "_" + streamKey;
	};

	session.makeSceneRestoreToken = function () {
		var bytes = new Uint8Array(32);
		if (window.crypto && window.crypto.getRandomValues) {
			window.crypto.getRandomValues(bytes);
			return Array.prototype.map.call(bytes, function (byte) {
				return ("0" + byte.toString(16)).slice(-2);
			}).join("");
		}
		return (Date.now().toString(16) + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 64);
	};

	session.getSceneRestoreToken = function () {
		var key = session.getSceneRestoreGuestStorageKey();
		var token = false;
		try {
			token = localStorage.getItem(key);
		} catch (e) { }
		if (!token || !/^[a-f0-9]{32,128}$/i.test(token)) {
			token = session.makeSceneRestoreToken();
			try {
				localStorage.setItem(key, token);
			} catch (e) { }
		}
		return token;
	};

	session.getSceneRestoreHash = async function () {
		var token = session.getSceneRestoreToken();
		return await generateHash(token + "|" + session.getSceneRestoreRoomKey(), 48);
	};

	session.normalizeSceneRestoreHash = function (hash) {
		if (typeof hash !== "string") {
			return false;
		}
		hash = hash.trim();
		if (!/^[a-f0-9]{24,128}$/i.test(hash)) {
			return false;
		}
		return hash.toLowerCase();
	};

	session.loadSceneRestoreLeases = function () {
		if (session.sceneRestoreLeasesLoaded) {
			return session.sceneRestoreLeases;
		}
		session.sceneRestoreLeasesLoaded = true;
		session.sceneRestoreLeases = {};
		try {
			var raw = localStorage.getItem(session.getSceneRestoreDirectorStorageKey());
			if (raw) {
				var parsed = JSON.parse(raw);
				if (parsed && typeof parsed === "object") {
					session.sceneRestoreLeases = parsed;
				}
			}
		} catch (e) {
			session.sceneRestoreLeases = {};
		}
		session.cleanupSceneRestoreLeases(false);
		return session.sceneRestoreLeases;
	};

	session.saveSceneRestoreLeases = function () {
		try {
			var hasLeases = false;
			for (var hash in session.sceneRestoreLeases) {
				hasLeases = true;
				break;
			}
			if (hasLeases) {
				localStorage.setItem(session.getSceneRestoreDirectorStorageKey(), JSON.stringify(session.sceneRestoreLeases));
			} else {
				localStorage.removeItem(session.getSceneRestoreDirectorStorageKey());
			}
		} catch (e) { }
	};

	session.cleanupSceneRestoreLeases = function (save = true) {
		var now = Date.now();
		var changed = false;
		for (var hash in session.sceneRestoreLeases) {
			var lease = session.sceneRestoreLeases[hash];
			if (!lease || !lease.scenes || !lease.expiresAt || lease.expiresAt <= now) {
				delete session.sceneRestoreLeases[hash];
				changed = true;
			}
		}
		if (changed && save) {
			session.saveSceneRestoreLeases();
		}
	};

	session.escapeSceneRestoreSelector = function (value) {
		value = value + "";
		if (window.CSS && CSS.escape) {
			return CSS.escape(value);
		}
		return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
	};

	session.getSceneRestoreScenesForUUID = function (UUID) {
		var scenes = {};
		try {
			var safeUUID = session.escapeSceneRestoreSelector(UUID);
			document.querySelectorAll('[data-action-type="addToScene"][data--u-u-i-d="' + safeUUID + '"][data-scene]').forEach(function (ele) {
				if (ele.value == 1) {
					scenes[ele.dataset.scene + ""] = true;
				}
			});
		} catch (e) {
			errorlog(e);
		}
		return scenes;
	};

	session.isSceneRestorePeerLive = function (pc) {
		if (!pc) {
			return false;
		}
		var state = (pc.connectionState || pc.iceConnectionState || "").toLowerCase();
		return !(state === "failed" || state === "disconnected" || state === "closed");
	};

	session.hasActiveSceneRestoreOwner = function (hash, currentUUID) {
		for (var UUID in session.rpcs) {
			if (UUID === currentUUID) {
				continue;
			}
			if (session.rpcs[UUID] && session.rpcs[UUID].sceneRestoreHash === hash && session.isSceneRestorePeerLive(session.rpcs[UUID])) {
				return true;
			}
		}
		return false;
	};

	session.isSceneRestoreGuestQueued = function (UUID) {
		try {
			var safeUUID = session.escapeSceneRestoreSelector(UUID);
			var ele = document.querySelector('[data-action-type="remove-queue"][data--u-u-i-d="' + safeUUID + '"]');
			if (ele && !ele.classList.contains("hidden")) {
				return true;
			}
		} catch (e) { }
		try {
			var info = session.rpcs[UUID] && session.rpcs[UUID].stats && session.rpcs[UUID].stats.info;
			if (info && typeof info.queued !== "undefined") {
				return info.queued !== false && info.queued !== null && info.queued !== 0 && info.queued !== 3;
			}
		} catch (e) { }
		return false;
	};

	session.renewSceneRestoreLeaseForUUID = function (UUID) {
		if (!session.canUseSceneRestore() || !session.rpcs[UUID] || UUID.endsWith("_screen")) {
			return false;
		}
		var hash = session.rpcs[UUID].sceneRestoreHash;
		if (!hash) {
			session.requestSceneRestoreIdentity(UUID);
			return false;
		}
		var scenes = session.getSceneRestoreScenesForUUID(UUID);
		var hasScenes = false;
		for (var scene in scenes) {
			hasScenes = true;
			break;
		}
		if (!hasScenes) {
			return false;
		}
		session.loadSceneRestoreLeases();
		session.sceneRestoreLeases[hash] = {
			scenes: scenes,
			streamID: session.rpcs[UUID].streamID || false,
			updatedAt: Date.now(),
			expiresAt: Date.now() + session.sceneRestoreLeaseDuration
		};
		session.saveSceneRestoreLeases();
		return true;
	};

	session.renewSceneRestoreLeases = function () {
		if (!session.canUseSceneRestore()) {
			return;
		}
		session.loadSceneRestoreLeases();
		session.cleanupSceneRestoreLeases(false);
		for (var UUID in session.rpcs) {
			session.renewSceneRestoreLeaseForUUID(UUID);
		}
		session.saveSceneRestoreLeases();
	};

	session.startSceneRestoreRenewal = function () {
		if (!session.canUseSceneRestore()) {
			return;
		}
		session.loadSceneRestoreLeases();
		session.cleanupSceneRestoreLeases();
		var firstStart = !session.sceneRestoreRenewTimer;
		if (firstStart) {
			session.sceneRestoreRenewTimer = setInterval(function () {
				session.renewSceneRestoreLeases();
			}, session.sceneRestoreRenewInterval);
		}
		if (firstStart) {
			for (var UUID in session.rpcs) {
				session.requestSceneRestoreIdentity(UUID);
				session.applySceneRestoreForUUID(UUID);
			}
		}
	};

	session.requestSceneRestoreIdentity = function (UUID) {
		if (!session.canUseSceneRestore() || !session.rpcs[UUID] || UUID.endsWith("_screen")) {
			return false;
		}
		try {
			if (session.rpcs[UUID].receiveChannel && session.rpcs[UUID].receiveChannel.readyState === "open") {
				return session.sendRequest({ sceneRestoreRequest: true }, UUID);
			}
		} catch (e) {
			errorlog(e);
		}
		return false;
	};

	session.sendSceneRestoreIdentity = async function (UUID) {
		if (session.director || session.scene !== false) {
			return false;
		}
		if (!session.pcs[UUID] || UUID.endsWith("_screen")) {
			return false;
		}
		var hash = await session.getSceneRestoreHash();
		if (!hash) {
			return false;
		}
		return session.sendMessage({ sceneRestoreHash: hash }, UUID);
	};

	session.handleSceneRestoreRequest = function (UUID, altUUID = false) {
		try {
			var sceneRestoreRequester = (altUUID || UUID || "").toString();
			if (session.directorUUID && sceneRestoreRequester === session.directorUUID) {
				return session.sendSceneRestoreIdentity(UUID);
			}
		} catch (e) {
			errorlog(e);
		}
		return false;
	};

	session.recordSceneRestoreHash = function (UUID, hash) {
		if (!session.sceneRestore || !session.director || !session.rpcs[UUID] || UUID.endsWith("_screen")) {
			return false;
		}
		hash = session.normalizeSceneRestoreHash(hash);
		if (!hash) {
			return false;
		}
		session.rpcs[UUID].sceneRestoreHash = hash;
		if (session.canUseSceneRestore()) {
			session.startSceneRestoreRenewal();
			session.renewSceneRestoreLeaseForUUID(UUID);
			session.applySceneRestoreForUUID(UUID);
		}
		return true;
	};

	session.updateSceneRestoreLeaseFromElement = function (ele) {
		if (!session.canUseSceneRestore() || !ele || !ele.dataset || !ele.dataset.UUID || !ele.dataset.scene) {
			return false;
		}
		var UUID = ele.dataset.UUID;
		if (!session.rpcs[UUID] || UUID.endsWith("_screen")) {
			return false;
		}
		var hash = session.rpcs[UUID].sceneRestoreHash;
		if (!hash) {
			session.requestSceneRestoreIdentity(UUID);
			return false;
		}
		session.loadSceneRestoreLeases();
		session.cleanupSceneRestoreLeases(false);
		var lease = session.sceneRestoreLeases[hash] || {
			scenes: {},
			streamID: session.rpcs[UUID].streamID || false
		};
		var scene = ele.dataset.scene + "";
		if (ele.value == 1) {
			lease.scenes[scene] = true;
			lease.streamID = session.rpcs[UUID].streamID || false;
			lease.updatedAt = Date.now();
			lease.expiresAt = Date.now() + session.sceneRestoreLeaseDuration;
			session.sceneRestoreLeases[hash] = lease;
		} else {
			delete lease.scenes[scene];
			var hasScenes = false;
			for (var activeScene in lease.scenes) {
				hasScenes = true;
				break;
			}
			if (hasScenes) {
				lease.updatedAt = Date.now();
				lease.expiresAt = Date.now() + session.sceneRestoreLeaseDuration;
				session.sceneRestoreLeases[hash] = lease;
			} else {
				delete session.sceneRestoreLeases[hash];
			}
		}
		session.saveSceneRestoreLeases();
		return true;
	};

	session.revokeSceneRestoreLeaseForUUID = function (UUID) {
		if (!session.sceneRestore || !session.director || !UUID || !session.rpcs[UUID]) {
			return false;
		}
		var hash = session.rpcs[UUID].sceneRestoreHash;
		if (!hash) {
			return false;
		}
		session.loadSceneRestoreLeases();
		delete session.sceneRestoreLeases[hash];
		delete session.rpcs[UUID].sceneRestoreHash;
		session.saveSceneRestoreLeases();
		return true;
	};

	session.applySceneRestoreForUUID = function (UUID) {
		if (!session.canUseSceneRestore() || !session.rpcs[UUID] || UUID.endsWith("_screen")) {
			return false;
		}
		var hash = session.rpcs[UUID].sceneRestoreHash;
		if (!hash) {
			session.requestSceneRestoreIdentity(UUID);
			return false;
		}
		session.loadSceneRestoreLeases();
		session.cleanupSceneRestoreLeases();
		var lease = session.sceneRestoreLeases[hash];
		if (!lease || !lease.scenes || lease.expiresAt <= Date.now()) {
			return false;
		}
		if (session.hasActiveSceneRestoreOwner(hash, UUID)) {
			setTimeout(function () {
				session.applySceneRestoreForUUID(UUID);
			}, 3000);
			return false;
		}
		if (session.isSceneRestoreGuestQueued(UUID)) {
			return false;
		}
		var restored = false;
		session.sceneRestoreRestoring[UUID] = true;
		try {
			for (var scene in lease.scenes) {
				if (!lease.scenes[scene]) {
					continue;
				}
				var safeUUID = session.escapeSceneRestoreSelector(UUID);
				var safeScene = session.escapeSceneRestoreSelector(scene);
				var ele = document.querySelector('[data-action-type="addToScene"][data--u-u-i-d="' + safeUUID + '"][data-scene="' + safeScene + '"]');
				if (!ele && typeof updateSceneList === "function") {
					updateSceneList(scene);
					ele = document.querySelector('[data-action-type="addToScene"][data--u-u-i-d="' + safeUUID + '"][data-scene="' + safeScene + '"]');
				}
				if (ele && ele.value != 1 && typeof directEnable === "function") {
					directEnable(ele, { ctrlKey: false, metaKey: false });
					restored = true;
				}
			}
		} catch (e) {
			errorlog(e);
		}
		delete session.sceneRestoreRestoring[UUID];
		if (restored) {
			session.renewSceneRestoreLeaseForUUID(UUID);
		}
		return restored;
	};

	session.sendRequest = function (msg, UUID = null, callback = false, errorCallback = false) {
		// webRTC only

		if (UUID !== null) {
			if (session.rpcs[UUID] && session.rpcs[UUID].whip) {
				warnlog(msg);
				if (errorCallback) {
					errorCallback(new Error("Requests are unavailable for this WHIP connection"));
				}
				return;
			}

			if (callback) {
				// i'm on doing callbacks on specific targets right now, as its all that's needed.
				try {
					var cbid = parseInt(Math.random() * 99999999999);
					msg.cbid = cbid;
					var timer = setTimeout(
						function (cbid) {
							var runMe = sendRequestCallbacks[cbid] || false;
							if (runMe) {
								delete sendRequestCallbacks[cbid];
								runMe[0]();
							}
						},
						5000,
						cbid
					);
					sendRequestCallbacks[cbid] = [callback, timer];
					warnlog("ISSUING CALLBACK: " + cbid);
				} catch (e) {
					errorlog(e);
				}
			}
		}

		if (UUID == null) {
			// send to all RTC peers i'm publishing to
			var sentList = [];
			var msgJson = JSON.stringify(msg);
			for (var i in session.rpcs) {
				if (session.rpcs[i].whip) {
					warnlog(msg);
					continue;
				}

				try {
					if ("realUUID" in session.rpcs[i]) {
						var msgAlt = msg;
						msgAlt.altUUID = true;
						msgAlt = JSON.stringify(msgAlt);
						session.rpcs[session.rpcs[i].realUUID].receiveChannel.send(msgAlt);
						sentList.push(i);
					} else if (session.rpcs[i].receiveChannel) {
						session.rpcs[i].receiveChannel.send(msgJson);
						sentList.push(i);
					} else {
						// didn't send
					}
				} catch (e) {
					log(msg);
					warnlog("PUBLISHER's RTC Connection seems to be dead? ");
					warnlog(e);
				}
			}
			return sentList.length;
		} else if (session.rpcs[UUID]) {
			try {
				/* if (callback){ // i'm on doing callbacks on specific targets right now, as its all that's needed.
					try {
						var cbid = parseInt(Math.random()*99999999999);
						msg.cbid = cbid;
						var timer = setTimeout(function(cbid){
							var runMe = sendRequestCallbacks[cbid] || false;
							if (runMe){
								delete sendRequestCallbacks[cbid];
								runMe[0]();
							}
						}, 5000, cbid);
						sendRequestCallbacks[cbid] = [callback, timer];
						warnlog("ISSUING CALLBACK: "+cbid);
					} catch(e){errorlog(e);}
				} */

				if ("realUUID" in session.rpcs[UUID]) {
					var msgAlt = msg;
					msgAlt.altUUID = true;
					session.rpcs[session.rpcs[UUID].realUUID].receiveChannel.send(JSON.stringify(msgAlt));
					return true;
				} else if (session.rpcs[UUID].receiveChannel) {
					session.rpcs[UUID].receiveChannel.send(JSON.stringify(msg));
					return true;
				} else {
					log("couldn't send a request to specified publishe via p2p: " + UUID);
					if (errorCallback) {
						errorCallback(new Error("The target data channel is unavailable"));
					}
					return false;
				}
			} catch (e) {
				warnlog(e);
				log("PUBLISHER's RTC Connection seems to be dead? 2");
				if (errorCallback) {
					errorCallback(e);
				}
				return false;
			}
		} else {
			if (errorCallback) {
				errorCallback(new Error("The target peer is unavailable"));
			}
			return false;
		}
	};

	session.hangupDirector = function () {
		session.taintedSession = true;

		session.screenShareState = false;
		pokeIframeAPI("screen-share-state", session.screenShareState, null, session.streamID);
		notifyOfScreenShare();

		warnlog("hanging up");

		pokeIframeAPI("director-share", false, false, session.streamID);
		pokeIframeAPI("seeding", false, false, session.streamID);
		pokeAPI("seeding", false);

		try {
			if (session.videoElement && session.videoElement.srcObject) {
				session.videoElement.srcObject.getTracks().forEach(function (track) {
					session.videoElement.srcObject.removeTrack(track);
					track.stop();
					log("stopping old track");
				});
			}
			if (session.streamSrc) {
				session.streamSrc.getVideoTracks().forEach(function (track) {
					session.videoDevice = normalizeDeviceLabel(track.label);
					session.streamSrc.removeTrack(track);
					track.stop();
					log("stopping old track");
				});
				session.audioDevice = [];
				session.streamSrc.getAudioTracks().forEach(function (track) {
					session.audioDevice.push(normalizeDeviceLabel(track.label));
					session.streamSrc.removeTrack(track);
					track.stop();
					log("stopping old track");
				});
				if (!session.audioDevice.length) {
					session.audioDevice = false;
				}
			}
			if (session.streamSrcClone) {
				session.streamSrcClone.getTracks().forEach(function (track) {
					session.streamSrcClone.removeTrack(track);
					track.stop();
				});
			}
			for (var UUID in session.pcs) {
				var senders = getSenders2(UUID); // for any connected peer, update the video they have if connected with a video already.
				senders.forEach(sender => {
					// I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
					if (sender.track) {
						sender.track.enabled = false; // (If we hide black videos, we can reuse this);
						//session.pcs[UUID].removeTrack(sender);  // replace may not be supported by all browsers.  eek.
					}
				});
			}

			try {
				if (document.getElementById("container_director")) {
					if (!session.syncState) {
						session.syncState = {};
					}
					if (session.streamID) {
						session.syncState[session.streamID] = getDetailedState(session.streamID);
					}

					getById("container_director").parentNode.removeChild(getById("container_director"));
					updateLockedElements();
				}
			} catch (e) {
				warnlog(e);
			}

			var msg = {};
			msg.videoMuted = true; // we're not going to hang up the peer connection; but we will kill the video.
			msg.virtualHangup = true;
			session.sendMessage(msg);

			getById("videosource").remove();

			//for (i in session.pcs){
			//	session.pcs[i].close();
			//	session.pcs[i] = null;
			//	delete(session.pcs[i]);
			//}

			if (session.whipOut && session.whipOut.deleteme) {
				warnlog("I'm not sure if I should hang up the whip Output or not");
				//session.whipOut.deleteme();
			}
		} catch (e) {
			errorlog("failed to disconnect");
		}

		log("HANG UP 2 COMPLETE");
	};

	session.createOffer = function (UUID, iceRestart = false) {
		const pc = session.pcs[UUID];
		if (!pc || pc.signalingState === "closed") {
			return;
		}
		return pc.createOffer({ iceRestart: iceRestart })
			.then(description => {
				if (session.pcs[UUID] !== pc || pc.signalingState === "closed") {
					return;
				}
				log("create offer worked");
				if (!window.CodecsHandler || (SafariVersion && SafariVersion <= 13 && (iOS || iPad))) {
					// skip.
				} else if (session.stereo == 3 || session.stereo == 5 || session.stereo == 1) {
					// stereo out
					if (session.mono && Firefox) {
						description.sdp = CodecsHandler.setOpusAttributes(description.sdp, {
							stereo: 0
						});
						log("mono enabled");
					} else {
						description.sdp = CodecsHandler.setOpusAttributes(description.sdp, {
							stereo: 1
							//'cbr': session.cbr,
							//'useinbandfec': 1,  // packet loss handler
							//'ptime': 20,
							//'maxptime': session.maxptime,
							//'minptime': session.minptime
						});
						log("stereo enabled");
					}
				} else if (iOS || iPad) {
					// iOS doesn't have multichannel, so why even bother
					// skip
				} else if (session.stereo == 4) {
					description.sdp = CodecsHandler.setOpusAttributes(description.sdp, {
						stereo: 2
						//	'useinbandfec': 1,  // packet loss handler
						//'ptime': 20,
						//'maxptime': session.maxptime,
						//'minptime': session.minptime
					});
					log("stereo enabled");
				}

				if (iOS || iPad) {
					//
					if (session.removeOrientationFlag && description.sdp.includes("a=extmap:3 urn:3gpp:video-orientation\r\n")) {
						description.sdp = description.sdp.replace("a=extmap:3 urn:3gpp:video-orientation\r\n", "");
						//description.removed = "a=extmap:3 urn:3gpp:video-orientation\r\n";
					}
				}

				if (pc.preferVideoCodec) {
					try {
						description.sdp = CodecsHandler.preferCodec(description.sdp, pc.preferVideoCodec, session.preferredVideoErrorCorrection);
						log("Trying to set " + pc.preferVideoCodec + " as preferred video codec by viewer via API (offer)");
					} catch (e) {
						errorlog(e);
						warnlog("couldn't set preferred video codec");
					}
				}

				if (pc.preferAudioCodec) {
					try {
						if (pc.preferAudioCodec === "lyra") {
							// not supported currently
							description.sdp = CodecsHandler.modifyDescLyra(description.sdp);
						} else if (pc.preferAudioCodec === "pcm") {
							if (session.audioInputChannels && session.audioInputChannels == 1) {
								description.sdp = CodecsHandler.modifyDescPCM(description.sdp, session.micSampleRate || 48000, false); // mono
							} else if (session.stereo) {
								description.sdp = CodecsHandler.modifyDescPCM(description.sdp, session.micSampleRate || 48000, true); // mono
							} else {
								description.sdp = CodecsHandler.modifyDescPCM(description.sdp, session.micSampleRate || 48000, false);
							}
						} else {
							description.sdp = CodecsHandler.preferAudioCodec(description.sdp, pc.preferAudioCodec, session.predAudio, session.pfecAudio); // "red" codec
						}
						log("Trying to set " + pc.preferAudioCodec + " as preferred audio codec by viewer via API (offer)");
					} catch (e) {
						errorlog(e);
						warnlog("couldn't set preferred audio codec");
					}
				}

				if (Android && session.h264profile !== false && session.AndroidFix) {
					// Avoid rewriting profile when multiple video m-lines are present (eg. camera + screenshare)
					var _multiVideo = false;
					try {
						_multiVideo = (description && description.sdp && (description.sdp.match(/^m=video /mg) || []).length > 1) || false;
					} catch (e) { }
					if (!_multiVideo) {
						description.sdp = description.sdp.replace(/42e01f/gi, "42001f"); // super annoying. jan 26th,2022.  Revisit someone soon; erase if android works without it.
					}
				}

				if (session.localNetworkOnly) {
					description.sdp = filterSDPLAN(description.sdp);
				}
				if (session.stunOnly) { // or whatever flag you want to use
					description.sdp = filterStunOnly(description.sdp);
				}

				// Arm before setting the description: gathering can complete before its promise returns.
				let gatheringPromise = null;
				let iceCredentialsChanged = false;
				if (session.waitForCandidates && pc.localDescription) {
					const previousUfrags = pc.localDescription.sdp.match(/^a=ice-ufrag:.*$/gm) || [];
					iceCredentialsChanged = (description.sdp.match(/^a=ice-ufrag:.*$/gm) || []).some(ufrag => previousUfrags.indexOf(ufrag) === -1);
				}
				if (session.waitForCandidates && (iceRestart || iceCredentialsChanged || !pc.localDescription || pc.iceGatheringState !== "complete")) {
					if (!pc.iceCandidatesPromise) {
						let resolveFunction;
						const promise = new Promise(resolve => {
							resolveFunction = resolve;
						});
						pc.iceCandidatesPromise = { promise: promise, resolve: resolveFunction };
					}
					gatheringPromise = pc.iceCandidatesPromise.promise;
				}
				return pc.setLocalDescription(description)
					.then(async function () {
						if (session.pcs[UUID] !== pc || pc.signalingState === "closed") {
							return;
						}

						if (gatheringPromise) {
							await gatheringPromise;
							if (session.pcs[UUID] !== pc || pc.signalingState === "closed") {
								return;
							}
						}

						log("publishing SDP Offer: " + UUID);

						session.applyIsolatedChat(UUID);

						var data = {};
						data.UUID = UUID;
						data.streamID = session.streamID;
						let outgoingDescription = pc.localDescription;
						if (session.localNetworkOnly || session.stunOnly) {
							// Gathering can add candidates after the initial SDP filter, especially with waitice.
							outgoingDescription = { type: outgoingDescription.type, sdp: outgoingDescription.sdp };
							if (session.localNetworkOnly) outgoingDescription.sdp = filterSDPLAN(outgoingDescription.sdp);
							if (session.stunOnly) outgoingDescription.sdp = filterStunOnly(outgoingDescription.sdp);
						}
						data.description = filterDescriptionIpv6(outgoingDescription); // Filter IPv6 if &ipv6=0
						data.session = pc.session;

						if (session.customWSS) {
							data.isScene = session.scene;
						}

						if (session.slot !== false) {
							data.slot = session.slot;
						}

						if (session.screenStream !== false) {
							// null if already used. false if never used.
							var screenTracks = session.screenStream.getTracks();
							var senders = pc.getSenders(); // excluded
							var indexes = [];
							for (var i = 0; i < senders.length; i++) {
								var senderTrack = getSenderSourceTrack(senders[i]);
								for (var j = 0; j < screenTracks.length; j++) {
									if (senderTrack && senderTrack.id == screenTracks[j].id && senderTrack.kind == screenTracks[j].kind) {
										indexes.push(i);
									}
								}
							}
							if (indexes.length) {
								data.screen = indexes;
							}
						}

						if (session.password) {
							return session
								.encryptMessage(JSON.stringify(data.description))
								.then(function (enc) {
									if (session.pcs[UUID] !== pc || pc.signalingState === "closed") {
										return;
									}
									data.description = enc[0];
									data.vector = enc[1];
									session.anysend(data); // pcs to rpcs
								})
								.catch(errorlog);
						} else {
							session.anysend(data);
						}
					})
					.catch(function (error) {
						if (session.pcs[UUID] === pc && pc.signalingState !== "closed") session.queueQosError("local_offer_failed", error, "webrtc.js", 0, true);
						errorlog(error);
					});
			})
			.catch(function (error) {
				if (session.pcs[UUID] === pc && pc.signalingState !== "closed") session.queueQosError("local_offer_failed", error, "webrtc.js", 0, true);
				errorlog(error);
			});
	};

	session.sendKeyFrameScenes = function () {
		for (var UUID in session.pcs) {
			// issue keyframes to scenes only;
			if (session.pcs[UUID].scene !== false) {
				// scene=0 is possible, so explicit
				session.forcePLI(UUID);
				log("FORCE KEYFRAME FOR SCENE");
			} else {
				log("Not a scene");
			}
		}
	};

	function clearPeerLivenessPing(peer) {
		if (!peer) {
			return;
		}
		clearTimeout(peer.__livenessPingTimeout);
		peer.__livenessPingTimeout = null;
	}

	session.cleanupP2PMixMinus = function (UUID) {
		const nodes = session.p2pMixMinusNodes && session.p2pMixMinusNodes[UUID];
		if (!nodes) return;
		delete session.p2pMixMinusNodes[UUID];
		for (const node of nodes) {
			try { node.disconnect(); } catch (e) { warnlog(e); }
		}
	};

	// Media and peer-control transports can fail independently. Only managed
	// Meshcast playback gets this grace; generic WHEP/P2P retains its behavior.


	session.closePC = function (UUID, notify = true) {
		session.cleanupP2PMixMinus(UUID);
		log("closePC");
		session.clearPendingIceForUUID(UUID, "remote");
		if (session.translationController) {
			session.translationController.removePeer(UUID, "outbound");
		}
		if (!(UUID in session.pcs)) {
			return;
		}
		clearTimeout(session.pcs[UUID].iceTimer);
		clearTimeout(session.pcs[UUID].closeTimeout);
		clearPeerLivenessPing(session.pcs[UUID]);
		clearInterval(session.pcs[UUID].requestedStatsInterval);
		clearTimeout(session.pcs[UUID].qosStatsTimeout); // QoS stats collection cleanup
		clearTimeout(session.pcs[UUID].rtpProfileTimer);

		pokeIframeAPI("push-connection", false, UUID);
		if (typeof emitTallyState === "function") emitTallyState(UUID, "remote", true);

		try {
			if (session.pcs[UUID].canvasOverlay && session.pcs[UUID].canvasOverlay.cleanup) {
				session.pcs[UUID].canvasOverlay.cleanup();
			}
			if (session.pcs[UUID].canvasOverlayScreen && session.pcs[UUID].canvasOverlayScreen.cleanup) {
				session.pcs[UUID].canvasOverlayScreen.cleanup();
			}

			if (session.soloChatUUID && session.soloChatUUID.includes(UUID)) {
				session.soloChatUUID.splice(session.soloChatUUID.indexOf(UUID), 1);
				session.applySoloChat(false);
			}
		} catch (e) {
			errorlog(e);
		}

		if ("realUUID" in session.pcs[UUID]) {
			delete session.pcs[UUID];
			applySceneState();
			return;
		}

		if (UUID + "_screen" in session.pcs && session.pcs[UUID + "_screen"].realUUID && session.pcs[UUID + "_screen"].realUUID === UUID) {
			clearTimeout(session.pcs[UUID + "_screen"].iceTimer);
			clearTimeout(session.pcs[UUID + "_screen"].closeTimeout);
			clearPeerLivenessPing(session.pcs[UUID + "_screen"]);
			clearInterval(session.pcs[UUID + "_screen"].requestedStatsInterval);
			clearTimeout(session.pcs[UUID + "_screen"].qosStatsTimeout); // QoS stats collection cleanup

			try {
				if (session.pcs[UUID + "_screen"].canvasOverlay && session.pcs[UUID + "_screen"].canvasOverlay.cleanup) {
					session.pcs[UUID + "_screen"].canvasOverlay.cleanup();
				}
				if (session.pcs[UUID + "_screen"].canvasOverlayScreen && session.pcs[UUID + "_screen"].canvasOverlayScreen.cleanup) {
					session.pcs[UUID + "_screen"].canvasOverlayScreen.cleanup();
				}
			} catch (e) {
				errorlog(e);
			}

			if (typeof emitTallyState === "function") emitTallyState(UUID + "_screen", "remote", true);
			session.pcs[UUID + "_screen"] = null;
			session.clearPendingIceForUUID(UUID + "_screen", "remote");
			delete session.pcs[UUID + "_screen"]; // I need to remove the screen share, as if the parent connection dies, the screen share becomes orphaned; it's dead anyways at this point.
		}

		try {
			session.sendMessage({ bye: true }, UUID);
		} catch (e) {
			warnlog("Failed to send BYE while closing peer: " + UUID);
			errorlog(e);
		}
		try {
			session.pcs[UUID].close();
		} catch (e) {
			warnlog("Failed to close RTCPeerConnection: " + UUID);
			errorlog(e);
		}

		if (session.pcs[UUID].guest) {
			if (session.beepToNotify) {
				if (notify) {
					warnlog("WHY ARE YOU GOD DAMN BEEPING");
					playtone(false, "leavetone");
				}
			}
		}

		session.pcs[UUID] = null;
		if (session.security) {
			if (!session.cleanOutput) {
				setTimeout(function settimeoutpeerdisconnected() {
					warnUser("Remote peer disconnected. Due to enhanced security, please refresh to create a new connection.");
				}, 1);
			}
		}
		delete session.pcs[UUID];
		session.applySoloChat();
		applySceneState();
	};



	// Only undo a policy change owned by automatic recovery, never explicit relay-only.

	// Minimal TURN rotation helper for liveness-based failover
	session.rotateIceServersSimple = function (pc) {
		try {
			if (!session || !session.configuration || !pc || !pc.setConfiguration || !pc.getConfiguration) { return false; }
			let currentConfig = null;
			try {
				currentConfig = pc.getConfiguration();
			} catch (e) {
				return false;
			}
			if (!currentConfig) { return false; }
			let iceServers = Array.isArray(session.configuration.iceServers) ? session.configuration.iceServers.slice() : [];
			const stuns = [];
			const turns = [];
			for (const s of iceServers) {
				let urls = s && (s.urls || s.url || []);
				if (typeof urls === "string") { urls = [urls]; }
				const isTurn = (Array.isArray(urls) && urls.some(u => typeof u === "string" && (u.startsWith("turn:") || u.startsWith("turns:"))));
				if (isTurn) { turns.push(s); } else { stuns.push(s); }
			}
			if (turns.length > 1) {
				turns.push(turns.shift()); // rotate first TURN to end
			}
			const newList = stuns.concat(turns);
			const nextConfig = { ...currentConfig };
			nextConfig.iceServers = newList;
			try {
				pc.setConfiguration(nextConfig);
			} catch (e) {
				warnlog("Unable to rotate TURN order");
				return false;
			}
			session.configuration.iceServers = newList; // bias future PCs
			warnlog("Rotated TURN order (simple)");
			return true;
		} catch (e) { errorlog(e); return false; }
	};





	// This watchdog is deliberately transport-only. RTP inactivity is diagnostic
	// because muted and trackless peers may legitimately send no media.



	// Browser-reported failures get two attempts, plus a final restored-policy
	// attempt only when optional recovery actually forced relay-only.


	session.closeRPC = function (UUID, hangup = false, keepMedia = false) {
		var peer = session.rpcs[UUID];
		var screen = session.rpcs[UUID + "_screen"];
		keepMedia = !!(keepMedia && !hangup && peer && peer.streamID && !peer.realUUID && !peer.whip &&
			((peer.whep && peer.whep.connectionState === "connected") || (screen && screen.whep && screen.whep.connectionState === "connected")));
		if (keepMedia) {
			// Retire only P2P; the existing WHEP player and its display still own their media.
			var sid = peer.streamID;
			peer.__closing = true;
			session.clearPendingIceForUUID(UUID, "local");
			clearInterval(peer.closeTimeout);
			clearPeerLivenessPing(peer);
			clearTimeout(peer.iceTimer);
			clearTimeout(peer.hangupFallbackTimeout);
			clearTimeout(peer.obsStateSyncRetryTimer);
			clearTimeout(peer.sceneSyncRetryTimer);
			peer.onclose = null;
			peer.onconnectionstatechange = null;
			peer.oniceconnectionstatechange = null;
			peer.onicecandidate = null;
			peer.onicegatheringstatechange = null;
			peer.ondatachannel = null;
			peer.ontrack = null;
			if (peer.receiveChannel) {
				peer.receiveChannel.onopen = null;
				peer.receiveChannel.onmessage = null;
				peer.receiveChannel.onclose = null;
			}
			try { session.sendRequest({ bye: true }, UUID); } catch (e) { }
			peer.close();
			updateWhepDirectorControls(UUID);
		} else {
			if (session.rpcs[UUID]) {
				session.rpcs[UUID].__closing = true;
			}

			if (session.sessionLog && UUID in session.rpcs) {
				try {
					pushSessionLogEntry("leave", session.rpcs[UUID].label || UUID, "Disconnected");
				} catch(e){}
			}
			clearApprovalTrackingForGuest(UUID);
			session.clearPendingIceForUUID(UUID, "local");
			if (session.translationController) {
				session.translationController.removePeer(UUID, "inbound");
			}
			if (!(UUID in session.rpcs)) {
				log("UUID not found; can't close");
				// Clean up orphaned control boxes if the RPC is already gone
				// This handles co-director edge cases where connections fail before full setup
				try {
					var orphanedContainer = document.getElementById("container_" + UUID);
					if (orphanedContainer) {
						warnlog("Removing orphaned control box for UUID: " + UUID);
						// Try to get streamID from elements within container for co-director sync
						var sidElement = orphanedContainer.querySelector('[data-sid]');
						var orphanSid = sidElement ? sidElement.dataset.sid : null;

						orphanedContainer.parentNode.removeChild(orphanedContainer);
						updateLockedElements();
						try {
							releaseSlotState(orphanSid);
						} catch (e) { warnlog(e); }

						// Notify co-directors of the cleanup if we have a streamID
						if (orphanSid && session.director && typeof syncDirectorState === 'function') {
							try {
								syncDirectorState({ dataset: { sid: orphanSid } });
							} catch (e) { warnlog(e); }
						}
					}
					// Also clean up any orphaned screen share container
					var orphanedScreenContainer = document.getElementById("container_" + UUID + "_screen");
					if (orphanedScreenContainer) {
						warnlog("Removing orphaned screen container for UUID: " + UUID);
						orphanedScreenContainer.parentNode.removeChild(orphanedScreenContainer);
					}
				} catch (e) { warnlog(e); }
				return false;
			}
			clearTimeout(session.rpcs[UUID].sceneSyncRetryTimer);
			clearTimeout(session.rpcs[UUID].obsStateSyncRetryTimer);
			warnlog("closeRPC");
			try {
				if (session.renewSceneRestoreLeaseForUUID) {
					session.renewSceneRestoreLeaseForUUID(UUID);
				}
			} catch (e) {
				errorlog(e);
			}
			if (!(typeof UUID === "string" && UUID.endsWith("_screen"))) {
				try {
					stopPrimaryWhep(UUID);
					stopScreenWhep(UUID);
				} catch (e) {
					warnlog(e);
				}
			} else {
				stopScreenWhep(UUID.slice(0, -7));
			}
			clearInterval(session.rpcs[UUID].closeTimeout);
			clearPeerLivenessPing(session.rpcs[UUID]);
			clearTimeout(session.rpcs[UUID].hangupFallbackTimeout);

			try {
				if (session.rpcs[UUID].canvasOverlay && session.rpcs[UUID].canvasOverlay.cleanup) {
					session.rpcs[UUID].canvasOverlay.cleanup();
				}
				if (session.rpcs[UUID].canvasOverlays) {
					for (var overlayUUID in session.rpcs[UUID].canvasOverlays) {
						if (session.rpcs[UUID].canvasOverlays[overlayUUID] && session.rpcs[UUID].canvasOverlays[overlayUUID].cleanup) {
							session.rpcs[UUID].canvasOverlays[overlayUUID].cleanup();
						}
					}
				}
			} catch (e) {
				errorlog(e);
			}

			if (session.soloChatUUID && session.soloChatUUID.includes(UUID)) {
				try {
					session.soloChatUUID.splice(session.soloChatUUID.indexOf(UUID), 1);
					// Apply the updated solo chat state
					session.applySoloChat(false);
				} catch (e) { }
			}

			try {
				// Keep BYE on the established peer path. Do not relay it over WSS:
				// the signaling server should not be able to disconnect clients
				// that already have an established peer connection.
				session.sendRequest({ bye: true }, UUID);
				warnlog("SEND BYE");
			} catch (e) { }

			try {
				var sid = session.rpcs[UUID].streamID;
			} catch (e) { }
			var slotStreamID = sid;

			try {
				session.rpcs[UUID].close();
			} catch (e) {
				warnlog("already closed PCS");
			}

			if (session.rpcs[UUID].motionDetectionInterval) {
				clearInterval(session.rpcs[UUID].motionDetectionInterval);
			}

			try {
				if (session.rpcs[UUID].streamSrc) {
					session.rpcs[UUID].streamSrc.getTracks().forEach(function (track) {
						track.stop();
						log("Track stopped");
					});
				}
			} catch (e) { }

			if (session.director) {
				try {
					if (session.rpcs[UUID].videoElement && "recorder" in session.rpcs[UUID].videoElement) {
						session.rpcs[UUID].videoElement.recorder.stop();
						//warnUser("Video Disconnected; downloading");
					}
				} catch (e) {
					warnlog(e);
				}
			} else if (!session.roomid) {
				if (session.beepToNotify) {
					playtone(false, "leavetone");
				}
			}

			try {
				if (document.getElementById("container_" + UUID)) {
					if (!session.syncState) {
						session.syncState = {};
					}
					if (sid) {
						session.syncState[sid] = getDetailedState(sid);
					}

					getById("container_" + UUID).parentNode.removeChild(getById("container_" + UUID));
					updateLockedElements();
				}
			} catch (e) {
				warnlog(e);
			}

			try {
				if (session.rpcs[UUID].videoElement) {
					session.rpcs[UUID].videoElement.remove();
				}
			} catch (e) { }

			try {
				if (session.broadcast !== false) {
					if (session.rpcs[UUID].iframeEle) {
						try {
							session.rpcs[UUID].iframeEle.remove();
						} catch (e) {
							errorlog(e);
						}
						session.rpcs[UUID].iframeEle.remove();
					}
				}
			} catch (e) { }

			try {
				if (session.rpcs[UUID].canvas) {
					session.rpcs[UUID].canvas.remove();
				}
			} catch (e) { }
			try {
				if (session.rpcs[UUID].imageElement) {
					session.rpcs[UUID].imageElement.remove();
				}
			} catch (e) { }

			if ("eventPlayActive" in session.rpcs[UUID]) {
				clearInterval(session.rpcs[UUID].eventPlayActive);
			}

			pokeIframeAPI("view-connection", false, UUID); // new api
			pokeAPI("endViewConnection", session.rpcs[UUID].streamID);
			if (session.discordHook) {
				try {
					pokeDiscord("endViewConnection", {
						streamID: session.rpcs[UUID].streamID,
						label: session.rpcs[UUID].label,
						session: session.rpcs[UUID].session,
						startTime: session.rpcs[UUID].startTime,
						hangup: hangup
					});
				} catch (e) {
					console.warn(e);
				}
			}
			if (session.rpcs[UUID].whip) {
				sid = false;
			}

			// Cleanup mix-minus state when guest leaves
			if (session.directorMixMinus) {
				try {
					onGuestLeftMixMinus(UUID);
				} catch (e) { }
			}

			try {
				if (typeof emitTallyState === "function") emitTallyState(UUID, "local", true);
				session.rpcs[UUID] = null;
				delete session.rpcs[UUID];
			} catch (e) { }

			try {
				releaseSlotState(slotStreamID);
			} catch (e) {
				warnlog(e);
			}

			try {
				session.closeRPC(UUID + "_screen"); // cause.
			} catch (e) { }

			if (!session.director || session.switchMode) {
				setTimeout(function () {
					updateMixer();
				}, 1);
			}

		}

		if (typeof sid == "undefined") {
			return false;
		}
		try {
			warnlog("Should we ask to play the stream Again?");
			if (sid) {
				if (sid in session.watchTimeoutList) {
					log("watchTimeoutList:" + sid);
					clearTimeout(session.watchTimeoutList[sid]);
					delete session.watchTimeoutList[sid];
				}
				session.watchTimeoutList[sid] = setTimeout(
					function (sss) {
						try {
							delete session.watchTimeoutList[sss];
						} catch (e) {
							warnlog("session.watchTimeoutList no longer exists; won't retry.");
							return false;
						}
						log("watchTimeoutList2:" + sss);
						try {
							for (var uid in session.rpcs) {
								if (session.rpcs[uid].streamID === sss) {
									if (session.rpcs[uid].connectionState === "connected") {
										warnlog(" --- we will not ask again; we're already connected");
										return false; // we're already connected. Don't send another request for this stream ID out.
									}
								}
							}
						} catch (e) {
							errorlog(e);
						}
						warnlog(" --- we will ask again");
						session.watchStream(sss);
					},
					session.retryTimeout,
					sid
				);
			}
		} catch (e) {
			errorlog(e);
		}
		if (keepMedia) return false;
		pokeIframeAPI("new-view-connection", false, UUID); // deprecated

		if (sid !== null) {
			pokeIframeAPI("end-view-connection", sid, UUID); // deprecated
		} else {
			pokeIframeAPI("end-view-connection", true, UUID); // deprecated
		}
		try {
			closeModal(false, "approval-" + UUID);
		} catch (e) {
			/* noop */
		}
		updateUserList();
		return false;
	};

	session.forceRetryTimeout = null;
	session.retryWatchInterval = function () {
		var messageSent = false;
		if (session.view) {
			// this may not work if the watch is requested via an IFRAME; an outside the room-stream

			if (session.forceRetry) {
				clearTimeout(session.forceRetryTimeout); // prevents multiple instances of this running.
			}

			if (session.ws === null || typeof session.ws !== "object" || session.ws.readyState !== 1) {
				// not connected.
			} else {
				var viewlist = session.view.split(",");
				for (var j in viewlist) {
					if (viewlist[j]) {
						var playing = false;
						for (var UUID in session.rpcs) {
							if (session.rpcs[UUID].streamID && session.rpcs[UUID].streamID === viewlist[j]) {
								playing = true;
								break;
							}
						}
						if (viewlist[j] in session.watchTimeoutList) {
							playing = true;
						}
						if (playing) {
							continue;
						}
						session.watchStream(viewlist[j]);
						messageSent = true;
					}
				}
			}

			if (session.forceRetry && session.forceRetry < 10) {
				session.forceRetry = 10;
			}
			if (session.forceRetry) {
				session.forceRetryTimeout = setTimeout(function () {
					log("retrying at an interval");
					session.retryWatchInterval();
				}, session.forceRetry * 1000);
			}
		}
		return messageSent;
	};

	session.offerSDP = async function (UUID) {
		// publisher/offerer (PCS)
		if (UUID in session.pcs) {
			if (session.pcs[UUID].connectionState === "failed" || session.pcs[UUID].connectionState === "closed") {
				log("closing 6");
				session.closePC(UUID); // make sure this actually cleans up., since custom==false;
				warnlog("cleaning up lost connection");
			} else if (iPad || iOS) {
				// not sure if I should move this down, below the !==connected case.. but if it aint broke, don't fix it.
				log("closing 7");
				session.closePC(UUID); // make sure this actually cleans up., since custom==false;
				warnlog("cleaning up lost connection -- disconnected - iOS specific");
			} else if (session.pcs[UUID].connectionState !== "connected") {
				// if gets stuck connecting, let if retry.
				// Sleep before reconnect - use shorter delay for better responsiveness (was reconnectSpeed[4]=3000ms)
				var waitedPeer = session.pcs[UUID];
				await sleep(1000); // 1 second delay to ensure connection attempt
				if (session.pcs[UUID] && session.pcs[UUID] !== waitedPeer) {
					log("Skipping stale offer request; a replacement peer already exists for " + UUID);
					return;
				}
				if (session.pcs[UUID]) {
					if (session.pcs[UUID].connectionState !== "connected") {
						// still connecting..  well, lets abort then.
						log("closing 6");
						session.closePC(UUID); // make sure this actually cleans up., since custom==false;
						warnlog("cleaning up lost connection");
					} else {
						// somethign else.
						warnlog("The other end is just being a keener. Ignore it: " + session.pcs[UUID].connectionState); //  I should handle new SDP's better, maybe?, but currently.............
						return; // just ignore it I guess.
					}
				}
			} else {
				warnlog("The other end is just being a keener. Ignore it: " + session.pcs[UUID].connectionState); //  I should handle new SDP's better, maybe?, but currently.............
				return; // just ignore it I guess.
			}
		} else {
			log("Create a new RTC connection; offering SDP on request");
		}

		if (!session.configuration) {
			await chooseBestTURN();
		}
		if (UUID in session.pcs) {
			log("Skipping duplicate offer creation; a peer now exists for " + UUID);
			return;
		}

		// Count after asynchronous setup, immediately before allocating this peer.
		if (session.maxviewers !== false) {
			if (Object.keys(session.pcs).length >= session.maxviewers) {
				log("closing 1");
				log("closing 8");
				session.closePC(UUID);
				return;
			}
		} else if (session.maxconnections !== false) {
			if (Object.keys(session.rpcs).length + Object.keys(session.pcs).length >= session.maxconnections) {
				log("closing 2");
				log("closing 9");
				session.closePC(UUID);
				return;
			}
		}
		if (session.encodedInsertableStreams) {
			session.configuration.encodedInsertableStreams = true;
		}

		if (session.bundlePolicy) {
			session.configuration.bundlePolicy = session.bundlePolicy;
		}

		try {
			session.pcs[UUID] = new RTCPeerConnection(session.configuration);
			session.attachIceCandidateErrorTracker(session.pcs[UUID], "pcs", UUID);
		} catch (err) {
			if (!session.cleanOutput) {
				warnUser("An RTC error occurred");
			}
			errorlog(err);
			return;
		}

		if (session.security) {
			if (Object.keys(session.pcs).length > 1) {
				log("closing 3");
				log("closing 10");
				session.closePC(UUID);
				return;
			}
		}

		session.pcs[UUID].stats = {};
		//session.pcs[UUID].history = [];
		session.pcs[UUID].session = session.loadoutID + session.generateStreamID(5); // SESSION is not stream ID
		session.pcs[UUID].sceneDisplay = null;
		session.pcs[UUID].sceneMute = null;
		session.pcs[UUID].obsState = {};
		session.pcs[UUID].obsState.visibility = null;
		session.pcs[UUID].obsState.sourceActive = null;
		session.pcs[UUID].obsState.streaming = null;
		session.pcs[UUID].obsState.recording = null;
		session.pcs[UUID].obsState.virtualcam = null;

		session.pcs[UUID].optimizedBitrate = false;
		session.pcs[UUID].savedBitrate = false;
		session.pcs[UUID].solo = null;
		session.pcs[UUID].layout = null;
		session.pcs[UUID].layoutState = false;
		session.pcs[UUID].bitrateTimeout = null;
		session.pcs[UUID].maxBandwidth = null; // based on max available bitrate
		session.pcs[UUID].audioMutedOverride = false;
		session.pcs[UUID].bitrateTimeoutFirefox = false;
		session.pcs[UUID].coDirector = false;
		session.pcs[UUID].setBitrate = false;
		session.pcs[UUID].setAudioBitrate = false;
		session.pcs[UUID].guest = false; // unknown yet really
		session.pcs[UUID].limitAudio = false;
		session.pcs[UUID].enhanceAudio = false;
		session.pcs[UUID].degradationPreference = false;
		session.pcs[UUID].encoder = null;
		session.pcs[UUID].forceios = false;
		session.pcs[UUID].allowVideo = false; // true unless otherwise said
		session.pcs[UUID].allowAudio = false; // true unless otherwise said
		session.pcs[UUID].allowDrawing = false;
		session.pcs[UUID].drawControlAllowed = false;
		session.pcs[UUID].allowIframe = false;
		session.pcs[UUID].allowWidget = false;
		session.pcs[UUID].allowChunked = false;
		session.pcs[UUID].chunkProtocols = [];
		session.pcs[UUID].allowWebp = false;
		session.pcs[UUID].allowDownloads = false;
		session.pcs[UUID].allowMIDI = false;
		session.pcs[UUID].allowBroadcast = false;
		session.pcs[UUID].allowResources = false;
		// session.pcs[UUID].allowScreen = false; // obsolete
		session.pcs[UUID].allowScreenVideo = false;
		session.pcs[UUID].allowScreenAudio = false;
		session.pcs[UUID].whipout = null;
		session.pcs[UUID].whipScreen = null;
		session.pcs[UUID].screenWhepAllowed = null;
		session.pcs[UUID].UUID = UUID;
		session.pcs[UUID].scale = false;
		session.pcs[UUID].rotation = false;
		session.pcs[UUID].scaleDueToBitrate = false;
		session.pcs[UUID].scaleWidth = false;
		session.pcs[UUID].scaleHeight = false;
		session.pcs[UUID].scaleSnap = false;
		session.pcs[UUID].cover = false;
		session.pcs[UUID].scaleResolution = false;
		session.pcs[UUID].showDirector = null;
		session.pcs[UUID].scene = false;
		session.pcs[UUID].keyframeRate = false;
		session.pcs[UUID].keyframeTimeout = null;
		session.pcs[UUID].label = false;
		session.pcs[UUID].order = false;
		session.pcs[UUID].preferVideoCodec = false;
		session.pcs[UUID].preferAudioCodec = false;
		session.pcs[UUID].closeTimeout = null;
		session.pcs[UUID].wssid = session.wssid;
		session.pcs[UUID].remote = false;
		session.pcs[UUID].startTime = Date.now();

		session.pcs[UUID].needsPublishing = null;

		function setupSendChannel(reconnect = false) {
			if (reconnect) {
				return;
			} // this could cause a serious feedback loop if allowed.

			session.pcs[UUID].sendChannel = session.pcs[UUID].createDataChannel("sendChannel");
			session.pcs[UUID].sendChannel.UUID = UUID;

			session.pcs[UUID].sendChannel.onerror = e => {
				if (e.error && e.error.sctpCauseCode && e.error.sctpCauseCode !== 12) {
					// hang up
					warnlog(e);
				}
				log("rtc data channel error: " + UUID);
			};

			session.pcs[UUID].sendChannel.onopen = () => {
				updateWhepDirectorControls(UUID);
				// we don't need this anymore if muting locally.
				if (reconnect) {
					return;
				}
				session.pcs[UUID].delayIceSend = 0;

				log("send channel open pcs");
				msg = {};
				msg.info = {};
				msg.info.label = session.label;
				if (session.translation && session.translation.enabled && session.translation.language) {
					msg.info.language = session.translation.language;
				}
				msg.info.meta = session.meta;
				msg.info.order = session.order;
				msg.info.muted = session.muted;
				msg.info.queued = session.queue;
				if (session.preferChannel) {
					msg.info.preferChannel = session.preferChannel;
				}

				// Tipping info
				if (session.receiveTips) {
					msg.info.acceptsTips = true;
					msg.info.tipId = session.tipId || session.streamID;
					msg.info.tipServer = session.tipServer;
					msg.info.tipAmounts = session.tipAmounts;
					msg.info.tipCurrency = session.tipCurrency;
				}

				try {
					if (session.group.length || session.allowNoGroup) {
						msg.info.initial_group = session.group.join(",");
					}
				} catch (e) { }

				msg.info.directorSpeakerMuted = session.directorSpeakerMuted; // this is so the director's button is in the correct state
				msg.info.directorDisplayMuted = session.directorDisplayMuted; // this is so the director's button is in the correct state
				msg.info.directorVideoMuted = session.directorVideoMuted;
				msg.info.directorMirror = session.permaMirrored;
				msg.info.directorFlip = session.flipOutput;

				msg.info.video_muted_init = session.videoMuted; // if the video is muted, then do not show it. (we need to do this dynamically as well)

				if (session.roomid) {
					msg.info.room_init = true;
				} else {
					msg.info.room_init = false;
				}


				msg.info.proaudio_init = session.proaudio;

				if (session.whipOutput) {
					msg.info.whipOut = true;
				}
				if (
					session.whipOutput &&
					session.whipPublishPrimary !== false &&
					typeof session.restartWhipConnection === "function"
				) {
					msg.info.whipRestartable = true;
				}

				if (session.requestscenes) {
					msg.info.requestScenes = session.requestscenes;
				}

				if (session.director) {
					if (!session.mainDirectorPassword && session.directorUUID && session.directorUUID === UUID) {
						session.newMainDirectorSetup();
					} else {
						msg.directorSettings = {};

						if (session.mainDirectorPassword) {
							msg.directorSettings.tokenDirector = true;
						}
						msg.directorSettings.totalRoomBitrate = session.totalRoomBitrate; // this can be changed by the director dynamically
						if (session.soloChatUUID.length && !session.soloChatUUID.includes(UUID)) {
							// you're not who the director is talking to currently.
							msg.info.muted = true;
						}
						var addCoDirector = [];
						for (var dirUID in session.pcs) {
							if (session.pcs[dirUID].coDirector === true) {
								addCoDirector.push(dirUID);
							}
						}
						if (session.directorBlindAllGuests) {
							msg.directorSettings.blindAllGuests = true;
						}
						if (addCoDirector.length) {
							msg.directorSettings.addCoDirector = addCoDirector;
						}
					}

					if (session.autoSyncObject) {
						msg.info.autoSync = session.autoSyncObject;
					}
				}
				if (session.broadcast !== false) {
					msg.info.broadcast_mode = true;
				} else {
					msg.info.broadcast_mode = false;
				}

				if (session.remote) {
					msg.info.remote = true;
				} else {
					msg.info.remote = false;
				}

				if (session.allowDrawing) {
					msg.info.allowdrawing = true;
				} else {
					msg.info.allowdrawing = false;
				}

				if (session.obsControls) {
					msg.info.obs_control = session.obsControls;
				} else if (session.obsControls === false) {
					msg.info.obs_control = false;
				} else if (session.roomid && !session.director) {
					msg.info.obs_control = false;
				} else {
					msg.info.obs_control = null;
				}

				if (session.consent) {
					msg.info.consent = true;
				}

				msg.info.screenshare_url = session.screenshare;

				if (!session.notifyScreenShare) {
					msg.info.smallScreen = true;
				}

				if (session.notifyScreenShare) {
					// Advertise the actual screenshare state so viewers render it correctly even while the stream is active
					msg.info.screenShareState = !!session.screenShareState;
				} else {
					msg.info.screenShareState = false;
				}
				msg.info.width_url = session.width;
				msg.info.height_url = session.height;

				try {
					if (session.streamSrc) {
						let tracks = session.streamSrc.getVideoTracks();
						if (tracks.length) {
							let settings = tracks[0].getSettings();
							msg.info.video_init_width = settings.width || false;
							msg.info.video_init_height = settings.height || false;
							msg.info.video_init_frameRate = parseInt(settings.frameRate) || false;
						}
					}
					if (session.screenStream && session.screenStream.srcObject) {
						let tracks = session.screenStream.srcObject.getVideoTracks();
						if (tracks.length) {
							let settings = tracks[0].getSettings();
							msg.info.video_2_init_width = settings.width || false;
							msg.info.video_2_init_height = settings.height || false;
							msg.info.video_2_init_frameRate = parseInt(settings.frameRate) || false;
						}
					}
				} catch (e) {
					errorlog(e);
				}

				if (session.midiIn || session.midiRemote) {
					msg.info.midi_url = true;
				}

				msg.info.quality_url = session.quality;
				msg.info.maxvb_url = session.maxvideobitrate;
				msg.info.maxviewers_url = session.maxviewers;
				msg.info.stereo_url = session.stereo;
				msg.info.aec_url = session.echoCancellation;
				msg.info.agc_url = session.autoGainControl;
				msg.info.denoise_url = session.noiseSuppression;
				msg.info.isolation_url = session.voiceIsolation;
				msg.info.version = session.version;
				msg.info.recording_audio_gain = session.audioGain;
				//msg.info.recording_audio_gain_init = session.audioGain;
				msg.info.recording_audio_compressor_type = session.compressor;
				msg.info.recording_audio_mic_delay = session.micDelay;
				msg.info.recording_audio_ctx_latency = session.audioLatency;
				msg.info.recording_audio_pipeline = !session.disableWebAudio;
				msg.info.playback_audio_pipeline = session.audioEffects;
				msg.info.playback_audio_samplerate = session.sampleRate;
				msg.info.playback_audio_volume_meter = session.audioMeterGuest;

				if (session.pseudoguest) {
					msg.info.pseudoguest = session.pseudoguest;
				}

				if (session.stats.network_type) {
					msg.info.conn_type = session.stats.network_type; // wifi, 4g, etc.
				}

				if (session.forceRotate !== false) {
					if (session.rotate) {
						msg.info.rotate_video = session.forceRotate + parseInt(session.rotate);
					} else {
						msg.info.rotate_video = session.forceRotate;
					}
				} else {
					msg.info.rotate_video = session.rotate;
				}

				if (msg.info.rotate_video && msg.info.rotate_video >= 360) {
					msg.info.rotate_video -= 360;
				}

				try {
					if (navigator && navigator.userAgent) {
						msg.info.useragent = navigator.userAgent;
					}
					if (navigator && navigator.platform) {
						msg.info.platform = navigator.platform;
					}
					if (gpgpuSupport) {
						msg.info.gpGPU = gpgpuSupport;
					}
					if (cpuSupport) {
						msg.info.CPU = cpuSupport;
					}
					if (iOS) {
						msg.info.iPhone12Up = iPhone12Up;
					}
					if (SafariVersion) {
						msg.info.Browser = "Safari " + SafariVersion;
					} else if (getChromiumVersion() > 60) {
						msg.info.Browser = "Chromium-based v" + getChromiumVersion();
					} else if (Firefox) {
						msg.info.Browser = "Firefox";
					} else if (navigator.userAgent.indexOf("CriOS") >= 0) {
						msg.info.Browser = "Chrome for iOS";
					} else {
						msg.info.Browser = "Unknown";
					}
				} catch (e) { }

				if (session.batteryState) {
					if ("level" in session.batteryState) {
						if (typeof session.batteryState.level == "number") {
							msg.info.power_level = parseInt(session.batteryState.level * 100);
						} else {
							msg.info.power_level = session.batteryState.level;
						}
					}
					if ("charging" in session.batteryState) {
						msg.info.plugged_in = session.batteryState.charging;
					}
				}

				if (session.director && session.roomTimerGlobal) {
					if (session.roomTimer && session.roomTimer > 0) {
						msg.setClock = session.roomTimer - Date.now() / 1000;
						msg.showClock = true;
						msg.startClock = true;
					} else if (session.roomTimer && session.roomTimer < 0) {
						msg.setClock = session.roomTimer * -1.0;
						msg.showClock = true;
						msg.startClock = true;
						msg.pauseClock = true;
					}

					if (session.showRoomTime) {
						msg.showTime = true;
					}
				}

				if (session.cpuLimited) {
					msg.info.cpuLimited = session.cpuLimited;
				}

				try {
					var roomOnlyTier = session.getRoomOnlyTier ? session.getRoomOnlyTier() : 0;
					if (session.info.out || roomOnlyTier || session.roomOnlyTier) {
						msg.miniInfo = {};
						if (session.info.out) {
							msg.miniInfo.out = {};
							msg.miniInfo.out.c = session.info.out.c;
						}
						if (roomOnlyTier || session.roomOnlyTier) {
							msg.miniInfo.rot = roomOnlyTier || session.roomOnlyTier;
						}
					}
				} catch (e) { }

				session.sendMessage(msg, UUID); // Lets send our VIEWER info about our stream.  We can add this info to the debug screen.
				pokeIframeAPI("new-push-connection", true, UUID); // deprecated
				pokeIframeAPI("push-connection", true, UUID);

				updateUserList();
			};

			session.pcs[UUID].sendChannel.onclose = (event) => {
				updateWhepDirectorControls(UUID);
				if (session.pcs[UUID] && event && session.pcs[UUID].sendChannel === event.target) session.observeQosTransport(session.pcs[UUID]);
				pokeIframeAPI("new-push-connection", false, UUID);
				session.ping();
				warnlog("send channel closed");
				//if (iOS || iPad){
				//	log("closing PC connection due to send channel closing -- iOS only");
				//log("closing 11");session.closePC(UUID);
				//setupSendChannel(true);
				//}
				// do not uncomment. will cause a crash on iOS.
				return; // cleaning up just causes more problems.
			};

			session.handlePublisherMessage = async function (e, UUID) {
				// the publisher is getting a message from its viewer.  Things like, please zoom in.
				log("received data from viewer");
				try {
					var msg = JSON.parse(e.data);
				} catch (e1) {
					warnlog("Couldn't parse JSON; will attempt as ArrayBuffer UINT8ARRAY");
					log(e.data);
					try {
						var data = new TextDecoder().decode(e.data);
						var msg = JSON.parse(data);
					} catch (e2) {
						try {
							var msg = await new Response(e.data).text();
							msg = JSON.parse(msg);
						} catch (e) {
							return;
						}
					}
				}
				log(msg);

				if ("remote" in msg) {
					try {
						msg = await session.decodeRemote(msg);
						if (!msg) {
							return;
						}
					} catch (e) {
						errorlog(e);
					}
				}

				try {
					if ("altUUID" in msg) {
						await session.processPCSOnMessage(msg, UUID + "_screen", UUID);
					} else {
						await session.processPCSOnMessage(msg, UUID);
					}
				} catch (error) {
					if ("audio" in msg || "video" in msg) {
						session.reportCriticalError("initial-settings-apply", error);
					} else {
						errorlog(error);
					}
				}
			};
		}

		if (!session.legacywebrtc) {
			setupSendChannel(false);
		}

		session.pcs[UUID].ondatachannel = event => {
			// receive data from peer; event data maybe. This probably should never be called.
			warnlog("data channel being used in reverse; this shouldn't really happen, except if maybe doing a file transfer");
			warnlog(event);
			if (event.channel.label && event.channel.label !== "sendChannel") {
				if (session.isReservedChannelLabel(event.channel.label)) {
					return; // third-party SDK channel; the warnlog above already fired
				}
				// I guess if a filename uses this, there will be a problem. better fix that.
				session.recieveFile(session.rpcs, UUID, event.channel);
				return;
			}
		};

		session.pcs[UUID].onnegotiationneeded = event => {
			// bug: https://groups.google.com/forum/#!topic/discuss-webrtc/3-TmyjQ2SeE
			log("onnegotiationneeded triggered; creating offer");
			try {
				// Do not block initial negotiation; datachannel offer is required in this app
				// Any m-line/glare issues are handled on the answerer side and via persistent transceivers elsewhere
				session.createOffer(UUID);
			} catch (e) { warnlog(e); }
		};

		session.pcs[UUID].ontrack = event => {
			errorlog("Publisher is being sent a video stream??? NOT EXPECTED!");
		};

		session.pcs[UUID].iceTimer = null;
		session.pcs[UUID].iceBundle = [];
		session.pcs[UUID].delayIceSend = 10; // enough time for host candidates
		session.pcs[UUID].iceCandidatesPromise = null;

		const publisherIcePeer = session.pcs[UUID];
		session.pcs[UUID].onicecandidate = event => {
			//event

			if (event.candidate == null) {
				log("empty ice..");
				if (session.waitForCandidates && session.pcs[UUID].iceCandidatesPromise) {  // TODO: apply filter to SDP's candidates.
					session.pcs[UUID].iceCandidatesPromise.resolve();
					session.pcs[UUID].iceCandidatesPromise = false;
				}
				return;
			} else if (session.waitForCandidates && session.pcs[UUID].iceCandidatesPromise) {
				return;
			}

			log(event);

			try {
				if (session.icefilter) {
					if (event.candidate.candidate.indexOf(session.icefilter) === -1) {
						log("dropped candidate due to filter");
						return;
					} else {
						log(event.candidate);
					}
				}
			} catch (e) {
				errorlog(e);
			}
			try {
				if (session.localNetworkOnly) {
					if (!filterIceLAN(event.candidate)) {
						return;
					}
				}
				if (session.stunOnly) { // or whatever flag you want to use
					if (!filterStunOnly(event.candidate)) {
						return;
					}
				}
			} catch (e) {
				errorlog(e);
			}

			if (session.pcs[UUID].iceTimer !== null) {
				session.pcs[UUID].iceBundle.push(event.candidate);
				return;
			}
			//warnlog("NEW ICE BUNDLE CREATED");

			session.pcs[UUID].iceBundle.push(event.candidate);

			session.pcs[UUID].iceTimer = setTimeout(
				function (uuid) {
					//warnlog("SENDING ICE BUNDLE");
					try {
						session.pcs[uuid].iceTimer = null; // ensure its clear
					} catch (e) {
						warnlog("ice timer no longer exists");
						return;
					}

					var data = {};
					data.UUID = uuid;
					data.type = "local";

					// Apply IPv6 filtering/reordering before sending candidates
					var candidatesToSend = session.pcs[uuid].iceBundle;
					try {
						if (session.disableIpv6) {
							// Filter out IPv6 if IPv4 exists (safe fallback to IPv6 if no IPv4)
							var filterResult = filterIpv6FromCandidates(candidatesToSend);
							candidatesToSend = filterResult.filtered;
						} else if (session.preferIpv4 !== false) {
							// Default: reorder to prefer IPv4 (IPv4 first, then IPv6)
							candidatesToSend = reorderCandidatesIpv4First(candidatesToSend);
						}
					} catch (e) {
						warnlog("IPv6 filtering error:", e);
					}

					data.candidates = candidatesToSend;
					data.session = session.pcs[uuid].session;

					session.pcs[uuid].iceBundle = [];
					session.pcs[UUID].delayIceSend = 1000;

					if (session.password) {
						session
							.encryptMessage(JSON.stringify(data.candidates))
							.then(function (enc) {
								if (session.pcs[uuid] !== publisherIcePeer || publisherIcePeer.signalingState === "closed") {
									return;
								}
								data.candidates = enc[0];
								data.vector = enc[1];
								session.anysend(data); // pcs to rpcs
								//session.sendMsg(data);
							})
							.catch(errorlog);
					} else {
						session.anysend(data);
						//session.sendMsg(data);
					}
				},
				session.pcs[UUID].delayIceSend,
				UUID
			); // I'm doing this so I can rate limit how much the server gets smashed. This also can give the description SDP a chance to connect first via HOST. After that, things are sent via WebRTC!
			// LOCAL is SENT at 70ms delayed; REMOTE is 130ms after that -- so time to travel thru server.  Reducing network load.
		};

	session.approvePlaybackAccess = function (UUID) {
		var peer = session.pcs[UUID];
		if (!peer || peer.signalingState === "closed") return Promise.resolve(false);
		var peerSession = peer.session;
		if (!session.promptAccess || peer.playbackAccessApproved === true) return Promise.resolve(true);
		if (peer.playbackAccessPending) return peer.playbackAccessPending;
		window.focus();
		if (session.beepToNotify) playtone();
		var name = peer.label || peer.streamID || (session.rpcs[UUID] && (session.rpcs[UUID].label || session.rpcs[UUID].streamID)) || UUID;
		peer.playbackAccessPending = confirmAlt(name + getTranslation("prompt-access-request"), true).then(function (allowed) {
			delete peer.playbackAccessPending;
			if (session.pcs[UUID] !== peer || peer.session !== peerSession || peer.signalingState === "closed") return false;
			if (!allowed) {
				session.closePC(UUID);
				return false;
			}
			peer.playbackAccessApproved = true;
			return true;
		}).catch(function () {
			delete peer.playbackAccessPending;
			return false;
		});
		return peer.playbackAccessPending;
	};

		session.processPCSOnMessage = async function (msg, UUID, altUUID = false) {
			msg.UUID = UUID;
			if (msg.session && (("volume" in msg) || ("hangup" in msg)) && (!session.pcs[UUID] || session.pcs[UUID].session !== msg.session)) return;
			if (msg.session && (("whepSettings" in msg) || ("whepScreenSettings" in msg) || ("screenStopped" in msg))) {
				if (!session.rpcs[UUID] || session.rpcs[UUID].session !== msg.session) return;
				return session.processRPCSOnMessage(msg, UUID);
			}

			if ("translationLanguage" in msg && session.translationController) {
				session.translationController.setPeerLanguage(UUID, msg.translationLanguage);
			}

			if (msg.description) {
				// we don't get the STREAM ID back with this. That could be good from a privacy point of view -- no one in the group call will have Stream ID access for publishing?
				//msg.UUID = UUID; // make sure the message applies to the current RTC connection
				session.processDescription(msg);
				return;
			} else if (msg.candidate) {
				//msg.UUID = UUID; // make sure the message applies to the current RTC connection
				log("GOT ICE!!");
				session.processIce(msg);
				return;
			} else if (msg.candidates) {
				//msg.UUID = UUID; // make sure the message applies to the current RTC connection
				log("GOT ICEs!!");
				session.processIceBundle(msg);
				return;
			} else if ("ping" in msg) {
				var data = {};
				data.pong = msg.ping;
				session.sendMessage(data, UUID);
				warnlog("PINGED");
				return;
			} else if ("pong" in msg) {
				try {
					if (session.pcs[UUID]) {
						session.pcs[UUID].lastPongToken = msg.pong;
						session.pcs[UUID].lastPongAt = Date.now();
						if (session.pcs[UUID].lastPingToken === msg.pong) {
							clearPeerLivenessPing(session.pcs[UUID]);
						}
					}
				} catch (e) { }
				warnlog("PONGED");
				return;
			} else if ("bye" in msg) {
				warnlog("BYE");
				log("closing 12");
				session.closePC(UUID); // user is telling us they are quitting, so lets clean up preemptively.
				return;
			} else if ("iceRestartRequest" in msg) {
				warnlog("Viewer requested ICE restart due to connection failure");
				// Trigger ICE restart for this connection
				if (session.pcs[UUID]) {
					if (session.pcs[UUID].restartIce) {
						log("Performing ICE restart for viewer " + UUID);
						session.pcs[UUID].restartIce();
					} else {
						log("Performing offer-based ICE restart for viewer " + UUID);
						session.createOffer(UUID, true);
					}
				}
				return;
			}

			if (session.director) {
				if ("requestCoDirector" in msg && "vector" in msg) {
					if (session.directorPassword) {
						if (session.directorHash) {
							session
								.decryptMessage(msg.requestCoDirector, msg.vector, session.directorHash)
								.then(function (result) {
									if (result === session.directorHash) {
										session.pcs[UUID].coDirector = true;
										session.directorList.push(UUID);
										getById("container_" + UUID).classList.add("directorBlue");
										session.announceCoDirector(UUID);
										session.initialDirectorSync(UUID);

										var data = {};
										data.approved = "requestCoDirector";
										session.sendMessage(data, UUID); // this skips the server
									} else {
										warnlog("codirector request hash failed");
										var data = {};
										data.rejected = "requestCoDirector";
										session.sendMessage(data, UUID); // this skips the server
									}
								})
								.catch(function () {
									warnlog("Failed attempt to connect as co-director");
									var data = {};
									data.rejected = "requestCoDirector";
									session.sendMessage(data, UUID); // this skips the server
								});
						} else {
							generateHash(session.directorPassword + session.salt + "abc123", 12)
								.then(function (hash) {
									// million to one error.
									session.directorHash = hash;
									session
										.decryptMessage(msg.requestCoDirector, msg.vector, session.directorHash)
										.then(function (result) {
											if (result === session.directorHash) {
												session.pcs[UUID].coDirector = true;
												session.directorList.push(UUID);
												getById("container_" + UUID).classList.add("directorBlue");
												session.announceCoDirector(UUID);
												session.initialDirectorSync(UUID);

												var data = {};
												data.approved = "requestCoDirector";
												session.sendRequest(data, UUID); // this skips the server
											} else {
												warnlog("codirector request hash failed");
												var data = {};
												data.rejected = "requestCoDirector";
												session.sendRequest(data, UUID); // this skips the server
											}
										})
										.catch(function () {
											warnlog("Failed attempt to connect as co-director");
											var data = {};
											data.rejected = "requestCoDirector";
											session.sendRequest(data, UUID); // this skips the server
										});

									return;
								})
								.catch(errorlog);
						}
					} else {
						warnlog("reject co");
						var data = {};
						data.rejected = "requestCoDirector";
						session.sendRequest(data, UUID); // this skips the server
					}
				}

				if ("migrate" in msg && "roomid" in msg) {
					log("Someone is trying to transfer a guest");
					if (session.codirector_transfer) {
						if (UUID in session.pcs && session.pcs[UUID].coDirector === true) {
							log("Valid co director trying to transfer a guest");
							var data = {};
							if (msg.transferSettings && msg.transferSettings.updateurl) {
								data.request = "migrate";
								data.transferSettings = msg.transferSettings;
								log(data);
								session.sendRequest(data, msg.migrate.toString(), function () {
									var data = {};
									data.request = "migrate";
									data.roomid = msg.roomid;
									data.target = msg.migrate.toString();
									session.sendMsg(data);
								});
								log(data);
							} else if (msg.transferSettings && "broadcast" in msg.transferSettings) {
								data.request = "migrate";
								data.transferSettings = { ...msg.transferSettings };
								delete data.transferSettings.roomid;
								delete data.transferSettings.roomenc;
								log(data);
								session.sendRequest(data, msg.migrate.toString(), function () {
									var data = {};
									data.request = "migrate";
									data.roomid = msg.roomid;
									data.target = msg.migrate.toString();
									session.sendMsg(data);
								});
								log(data);
							} else if (Object.keys(msg.transferSettings).length) {
								data.request = "migrate";
								data.transferSettings = { ...msg.transferSettings };
								delete data.transferSettings.roomid;
								delete data.transferSettings.roomenc;
								log(data);
								session.sendRequest(data, msg.migrate.toString(), function () {
									var data = {};
									data.request = "migrate";
									data.roomid = msg.roomid;
									data.target = msg.migrate.toString();
									session.sendMsg(data);
								});
								log(data);
							} else {
								data.request = "migrate";
								data.roomid = msg.roomid;
								data.target = msg.migrate.toString();
								session.sendMsg(data); // send to everyone in the room, so they know if they are on air or not.
							}
							pokeIframeAPI("transfer", msg.roomid, msg.migrate.toString());
						}
					} else {
						var data = {};
						data.rejected = "requestCoMigrate";
						session.sendRequest(data, UUID); // this skips the server
					}
				}

			}

			// Main-only: co-director asked a guest to connect to them; re-announce co-director to that guest
			if (session.director && msg.request === "requestGuestConnect" && msg.guest) {
				try {
					if (UUID in session.pcs && session.pcs[UUID].coDirector === true) {
						var dmsg2 = {
							directorSettings: {
								addCoDirector: [UUID]
							}
						};
						session.sendRequest(dmsg2, msg.guest.toString());
					}
				} catch (e) {
					errorlog(e);
				}
				return;
			}

			if ("requestAs" in msg) {
				if (!msg.UUID) {
					log("no UUID in msg");
					return;
				} // no requester
				var uuidRA = msg.requestAs; // target
				if (!session.pcs[uuidRA]) {
					log("no pcs[UUID]");
					return;
				} // target doesn't exist
				if (session.directorList.indexOf(uuidRA) >= 0) {
					// we do not target directors
					var data = {};
					data.rejected = "requestAs";
					session.sendMessage(data, msg.UUID); // denied
					warnlog("Remote user is a director"); // can't remote control a drector
					return;
				}

				// Main director helper: co-director requests guest to connect to them
				if (session.director && msg.request === "requestGuestConnect" && msg.guest) {
					try {
						if (UUID in session.pcs && session.pcs[UUID].coDirector === true) {
							var dmsg = {
								directorSettings: {
									addCoDirector: [UUID]
								}
							};
							session.sendRequest(dmsg, msg.guest.toString());
						}
					} catch (e) {
						errorlog(e);
					}
					return;
				}
				if (session.directorList.indexOf(msg.UUID) < 0) {
					if (session.remote !== true && !(session.remote && "remote" in msg && msg.remote === session.remote)) {
						return;
					}
				}
				if ("targetBitrate" in msg) {
					session.targetBitrate(uuidRA, msg.targetBitrate);
				}
				if ("targetAudioBitrate" in msg) {
					session.targetAudioBitrate(uuidRA, msg.targetAudioBitrate);
				}
				if ("requestResolution" in msg) {
					try {
						session.setResolution(uuidRA, msg.requestResolution.w, msg.requestResolution.h, msg.requestResolution.s, msg.requestResolution.c);
					} catch (e) {
						errorlog(e);
					}
				}
				return;
			}

			// Optimization metadata must be known before visibility is applied, while visibility
			// still needs to be stored before the bitrate request is handled below.
			if ("optimizedBitrate" in msg) {
				session.pcs[UUID].optimizedBitrate = parseInt(msg.optimizedBitrate);
			}
			manageSceneState(msg, UUID); // session.obsState // msg.obsState.xxx "obsState". THIS MUST COME BEFORE "bitrate" or session.limiteBitrate , else the state will be messed up.

			try {
				// this entire block is "optional" , so if it fails, we can perhaps still make a connection.
				if ("info" in msg) {
					session.pcs[UUID].stats.info = msg.info;
					if (session.translationController && msg.info.language) {
						session.translationController.setPeerLanguage(UUID, msg.info.language);
					}

					if ("label" in msg.info) {
						if (typeof msg.info.label == "string") {
							session.pcs[UUID].label = sanitizeLabel(msg.info.label); //.replace(/[\W]+/g,"_").replace(/_+/g, ' ');
						} else {
							session.pcs[UUID].label = false;
						}
					}

					// Store tip acceptance info from peer
					if ("acceptsTips" in msg.info && msg.info.acceptsTips) {
						session.pcs[UUID].acceptsTips = true;
						session.pcs[UUID].tipId = msg.info.tipId || null;
						session.pcs[UUID].tipServer = msg.info.tipServer || session.tipServer || "https://tip.vdo.ninja";
						session.pcs[UUID].tipAmounts = msg.info.tipAmounts || [5, 10, 25, 50, 100];
						session.pcs[UUID].tipCurrency = msg.info.tipCurrency || "USD";
						// Add tip icon if viewer has opted in (two-way opt-in)
						if (session.showTips && !session.cleanOutput) {
							if (typeof addTipIconToVideo === 'function') {
								addTipIconToVideo(UUID);
							}
						}
					}

					if (altUUID) {
						if (altUUID === session.directorUUID) {
							try {
								session.pcs[UUID].stats.info.director = true;
							} catch (e) { }
						} else if (session.directorList.indexOf(altUUID) >= 0) {
							try {
								session.pcs[UUID].stats.info.coDirector = true;
							} catch (e) { }
						}
					} else {
						if (UUID === session.directorUUID) {
							try {
								session.pcs[UUID].stats.info.director = true;
							} catch (e) { }
						} else if (session.directorList.indexOf(UUID) >= 0) {
							try {
								session.pcs[UUID].stats.info.coDirector = true;
							} catch (e) { }
						}
					}

					if (session.layouts && session.director && "obs" in msg.info && msg.info.obs) {
						// this is a guest or scene in layout mode. Let's set them up with all the layouts. I might need to change this to "switchMode" or something instead
						broadcastSlotUpdate(UUID);
						if (session.obsSceneTriggers) {
							session.sendMessage({
								obsSceneTriggers: session.obsSceneTriggers,
								layouts: session.layouts
							}, UUID);
						} else {
							session.sendMessage({
								layouts: session.layouts
							}, UUID);
						}
					}

					// I'm having this get set if either the viewer or sender is Firefox. EEK!
					// Also applying for iOS Safari 17+ as it has similar SDP bitrate issues
					if (Firefox || msg.info.firefox || ((iOS || iPad) && SafariVersion && SafariVersion > 16)) {
						// doesn't actually seem to work that well if sender if Firefox. 5mbps max with vp8?
						try {
							if ("vb_url" in msg.info) {
								// need to set max bitrate also
								if (session.pcs[UUID].savedBitrate === false) {
									// not yet set
									if (msg.info.vb_url && parseInt(msg.info.vb_url) > 0) {
										session.pcs[UUID].savedBitrate = parseInt(msg.info.vb_url); // bitrate is maxed at 2500 by firefox already.
										if (session.pcs[UUID].bitrateTimeout) {
											clearTimeout(session.pcs[UUID].bitrateTimeout);
										}
										session.pcs[UUID].bitrateTimeout = setTimeout(
											function (uuid) {
												session.limitBitrate(uuid, null);
											},
											1000,
											UUID
										);
									}
								}
							}
						} catch (e) {
							errorlog(e);
						}
					}
					pokeIframeAPI("push-connection-info", msg.info, UUID);
				}

				if ("ifs" in msg) {
					// iframe sync
					if (session.iframeSrc) {
						try {
							if (session.iframeSrc.startsWith("https://www.youtube.com/")) {
								// TODO ; this needs to be tracked someother way
								processIframeSyncFeedback(msg.ifs, UUID); // Youtube specific frame sync.
							}
						} catch (e) {
							errorlog(e);
						}
					}
				}
				if ("pipe" in msg) {
					session.gotGenericData(msg.pipe, UUID);
				}

				if ("drawingRequest" in msg) {
					const drawingTargetUUID = msg.drawingTargetUUID || false;
					const drawingTargetIsScreen = !!msg.drawingTargetIsScreen || !!altUUID;
					if (session.allowDrawing || (session.pcs[UUID] && session.pcs[UUID].drawControlAllowed)) {
						session.resolveDrawingRequest(UUID, true, altUUID, drawingTargetUUID, drawingTargetIsScreen);
					} else if (typeof addDrawingPermissionRequest === "function") {
						addDrawingPermissionRequest(UUID, altUUID, drawingTargetUUID, drawingTargetIsScreen);
					} else {
						session.resolveDrawingRequest(UUID, false, altUUID, drawingTargetUUID, drawingTargetIsScreen);
					}
					return;
				}

				if ("draw" in msg) {
					if (session.allowDrawing || (session.pcs[UUID] && session.pcs[UUID].drawControlAllowed)) {
						const drawingTargetIsScreen = !!msg.drawingTargetIsScreen || !!altUUID || !!(session.pcs[UUID] && session.pcs[UUID].realUUID);
						const drawingPayload = styleDrawingPayload(msg.draw, altUUID || UUID, true);
						const overlayKey = drawingTargetIsScreen ? "canvasOverlayScreen" : "canvasOverlay";
						const targetVideoElement = drawingTargetIsScreen ? session.screenShareElement : session.videoElement;
						if (!session.pcs[UUID][overlayKey] && targetVideoElement) {
							session.pcs[UUID][overlayKey] = receiveDrawingOnVideo(targetVideoElement, UUID);
						}
						const canvasOverlay = session.pcs[UUID][overlayKey];
						if (canvasOverlay) {
							if (typeof msg.draw == "string") {
								if (msg.draw == "clear") {
									canvasOverlay.clearDrawing();
								} else if (msg.draw == "cleanup") {
									canvasOverlay.cleanup();
									session.pcs[UUID][overlayKey] = null;
								} else if (msg.draw == "undo") {
									canvasOverlay.updateDrawing("undo");
								}
							} else {
								canvasOverlay.updateDrawing(drawingPayload);
							}
						}
						if (!msg.drawingRelay) {
							session.relayDrawingMessage(drawingPayload, UUID, altUUID, drawingTargetIsScreen);
						}
					}
					return;
				}
				if ("autoSync" in msg) {
					session.autoSyncObject = msg.autoSync;
					session.autoSyncCallback(UUID);
				}

				if ("audioBitrate" in msg) {
					session.limitAudioBitrate(UUID, msg.audioBitrate);
				}

				if ("bitrate" in msg) {
					session.limitBitrate(UUID, msg.bitrate); // needs to be after visibility
				}

				if ("targetBitrate" in msg) {
					session.targetBitrate(UUID, msg.targetBitrate);
				}
				if ("targetAudioBitrate" in msg) {
					session.targetAudioBitrate(UUID, msg.targetAudioBitrate);
				}

				if ("hangup" in msg) {
					if ("remote" in msg) {
						if ((msg.remote === session.remote && session.remote) || session.remote === true) {
							session.hangup();
							return; // if we continue, it will check to see if director.
						}
					}
				}
				if ("reload" in msg) {
					// Allow reload from directors (basic director privilege) or via mutual &remote
					if (session.directorList.indexOf(altUUID || UUID) >= 0) {
						session.hangup(true); //hangup true implies reload.
						return;
					} else if ("remote" in msg) {
						if ((msg.remote === session.remote && session.remote) || session.remote === true) {
							session.hangup(true); //hangup true implies reload.
							return; // if we continue, it will check to see if director.
						}
					}
				}

				if ("requestStats" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0) {
						var output = {};
						if (session.whipOut.stats) {
							output.whipOut = session.whipOut.stats;
						} else {
							for (var uuid in session.pcs) {
								if (uuid === UUID) {
									continue;
								}
								output[uuid] = session.pcs[uuid].stats;
								//output[uuid].label = session.pcs[uuid].label;
								// output[uuid].streamID = session.pcs[uuid].streamID;
							}
						}
						var data = {};
						data.remoteStats = output;
						session.sendMessage(data, UUID);
					} else if ("remote" in msg) {
						if ((msg.remote === session.remote && session.remote) || session.remote === true) {
							var output = {};
							if (session.whipOut.stats) {
								output.whipOut = session.whipOut.stats;
							} else {
								for (var uuid in session.pcs) {
									if (uuid === UUID) {
										continue;
									}
									output[uuid] = session.pcs[uuid].stats;
									//output[uuid].label = session.pcs[uuid].label;
								}
							}
							var data = {};
							data.remoteStats = output;
							session.sendMessage(data, UUID);
						}
					} else {
						var output = {};
						if (session.whipOut.stats) {
							output.whipOut = session.whipOut.stats;
						} else {
							for (var uuid in session.pcs) {
								if (uuid === UUID) {
									continue;
								}
								if (!session.pcs[uuid].stats) {
									continue;
								}
								if (session.pcs[uuid].guest) {
									continue;
								} // don't share data of fellow guests
								if (session.roomid) {
									if ("scene" in session.pcs[uuid].stats) {
										if (session.pcs[uuid].stats.scene === false) {
											// if in a room, only share stats of scenes.
											continue;
										}
									} else {
										continue;
									}
								}
								output[uuid] = {};
								if (session.pcs[uuid].stats.video_bitrate_kbps) {
									output[uuid].video_bitrate_kbps = session.pcs[uuid].stats.video_bitrate_kbps;
								}
								if (session.pcs[uuid].stats.nacks_per_second) {
									output[uuid].nacks_per_second = session.pcs[uuid].stats.nacks_per_second;
								}
								if (session.pcs[uuid].stats.available_outgoing_bitrate_kbps) {
									output[uuid].available_outgoing_bitrate_kbps = session.pcs[uuid].stats.available_outgoing_bitrate_kbps;
								}
								if (session.pcs[uuid].stats.scene) {
									output[uuid].scene = session.pcs[uuid].stats.scene;
								}
								if (session.pcs[uuid].label) {
									// share label stats; either they are view/push or a scene. can't be a guest.
									output[uuid].label = session.pcs[uuid].label;
								}
								if (session.pcs[uuid].stats.resolution) {
									output[uuid].resolution = session.pcs[uuid].stats.resolution;
								}
								if (session.pcs[uuid].stats.video_encoder) {
									output[uuid].video_encoder = session.pcs[uuid].stats.video_encoder;
								}
							}
						}
						var data = {};
						data.remoteStats = output;
						session.sendMessage(data, UUID);
					}
				}

				if ("requestStatsContinuous" in msg) {
					clearInterval(session.pcs[UUID].requestedStatsInterval);
					if (session.directorList.indexOf(altUUID || UUID) >= 0) {
						if (msg.requestStatsContinuous) {
							session.pcs[UUID].requestedStatsInterval = setInterval(
								function (UUID) {
									var output = {};
									if (session.whipOut.stats) {
										output.whipOut = session.whipOut.stats;
									} else {
										for (var uuid in session.pcs) {
											if (uuid === UUID) {
												continue;
											}
											if (!session.pcs[uuid].stats) {
												continue;
											}
											if (session.pcs[uuid].guest) {
												continue;
											}
											output[uuid] = session.pcs[uuid].stats;
										}
									}
									var data = {};
									data.remoteStats = output;
									session.sendMessage(data, UUID);
								},
								3000,
								UUID
							);
							var output = {};
							if (session.whipOut.stats) {
								output.whipOut = session.whipOut.stats;
							} else {
								for (var uuid in session.pcs) {
									if (uuid === UUID) {
										continue;
									}
									if (!session.pcs[uuid].stats) {
										continue;
									}
									if (session.pcs[uuid].guest) {
										continue;
									}
									output[uuid] = session.pcs[uuid].stats;
								}
							}
							var data = {};
							data.remoteStats = output;
							session.sendMessage(data, UUID);
						}
					} else if ("remote" in msg) {
						if ((msg.remote === session.remote && session.remote) || session.remote === true) {
							// authorized
							if (msg.requestStatsContinuous) {
								session.pcs[UUID].requestedStatsInterval = setInterval(
									function (UUID) {
										var output = {};
										if (session.whipOut.stats) {
											output.whipOut = session.whipOut.stats;
										} else {
											for (var uuid in session.pcs) {
												if (uuid === UUID) {
													continue;
												}
												if (!session.pcs[uuid].stats) {
													continue;
												}
												if (session.pcs[uuid].guest) {
													continue;
												}
												output[uuid] = session.pcs[uuid].stats;
											}
										}
										var data = {};
										data.remoteStats = output;
										session.sendMessage(data, UUID);
									},
									3000,
									UUID
								);
								//errorlog("remote stats interval");
								var output = {};
								if (session.whipOut.stats) {
									output.whipOut = session.whipOut.stats;
								} else {
									for (var uuid in session.pcs) {
										if (uuid === UUID) {
											continue;
										}
										if (!session.pcs[uuid].stats) {
											continue;
										}
										if (session.pcs[uuid].guest) {
											continue;
										}
										output[uuid] = session.pcs[uuid].stats;
									}
								}
								var data = {};
								data.remoteStats = output;
								session.sendMessage(data, UUID);
							}
						}
					} else if (msg.requestStatsContinuous) {
						session.pcs[UUID].requestedStatsInterval = setInterval(
							function (UID) {
								var output = {};
								if (session.whipOut.stats) {
									output.whipOut = session.whipOut.stats;
								} else {
									for (var uuid in session.pcs) {
										if (uuid === UID) {
											continue;
										}
										if (!session.pcs[uuid].stats) {
											continue;
										}
										if (session.pcs[uuid].guest) {
											continue;
										} // don't share data of fellow guests
										if (session.roomid) {
											if ("scene" in session.pcs[uuid].stats) {
												if (session.pcs[uuid].stats.scene === false) {
													// if in a room, only share stats of scenes.
													continue;
												}
											} else {
												continue;
											}
										}
										output[uuid] = {};
										if (session.pcs[uuid].stats.video_bitrate_kbps) {
											output[uuid].video_bitrate_kbps = session.pcs[uuid].stats.video_bitrate_kbps;
										}
										if (session.pcs[uuid].stats.nacks_per_second) {
											output[uuid].nacks_per_second = session.pcs[uuid].stats.nacks_per_second;
										}
										if (session.pcs[uuid].stats.available_outgoing_bitrate_kbps) {
											output[uuid].available_outgoing_bitrate_kbps = session.pcs[uuid].stats.available_outgoing_bitrate_kbps;
										}
										if (session.pcs[uuid].stats.scene) {
											output[uuid].scene = session.pcs[uuid].stats.scene;
										}
										if (session.pcs[uuid].label) {
											// share label stats; either they are view/push or a scene. can't be a guest.
											output[uuid].label = session.pcs[uuid].label;
										}
										if (session.pcs[uuid].stats.resolution) {
											output[uuid].resolution = session.pcs[uuid].stats.resolution;
										}
										if (session.pcs[uuid].stats.video_encoder) {
											output[uuid].video_encoder = session.pcs[uuid].stats.video_encoder;
										}
									}
								}
								var data = {};
								data.remoteStats = output;
								session.sendMessage(data, UID);
							},
							3000,
							UUID
						);
						var output = {};
						if (session.whipOut.stats) {
							output.whipOut = session.whipOut.stats;
						} else {
							for (var uuid in session.pcs) {
								if (uuid === UUID) {
									continue;
								}
								if (!session.pcs[uuid].stats) {
									continue;
								}
								if (session.pcs[uuid].guest) {
									continue;
								} // don't share data of fellow guests
								if (session.roomid) {
									if ("scene" in session.pcs[uuid].stats) {
										if (session.pcs[uuid].stats.scene === false) {
											// if in a room, only share stats of scenes.
											continue;
										}
									} else {
										continue;
									}
								}
								output[uuid] = {};
								if (session.pcs[uuid].stats.video_bitrate_kbps) {
									output[uuid].video_bitrate_kbps = session.pcs[uuid].stats.video_bitrate_kbps;
								}
								if (session.pcs[uuid].stats.nacks_per_second) {
									output[uuid].nacks_per_second = session.pcs[uuid].stats.nacks_per_second;
								}
								if (session.pcs[uuid].stats.available_outgoing_bitrate_kbps) {
									output[uuid].available_outgoing_bitrate_kbps = session.pcs[uuid].stats.available_outgoing_bitrate_kbps;
								}
								if (session.pcs[uuid].stats.scene) {
									output[uuid].scene = session.pcs[uuid].stats.scene;
								}
								if (session.pcs[uuid].label) {
									// share label stats; either they are view/push or a scene. can't be a guest.
									output[uuid].label = session.pcs[uuid].label;
								}
								if (session.pcs[uuid].stats.resolution) {
									output[uuid].resolution = session.pcs[uuid].stats.resolution;
								}
								if (session.pcs[uuid].stats.video_encoder) {
									output[uuid].video_encoder = session.pcs[uuid].stats.video_encoder;
								}
							}
						}
						var data = {};
						data.remoteStats = output;
						session.sendMessage(data, UUID);
					}
				}

				if ("requestResolution" in msg) {
					try {
						session.setResolution(UUID, msg.requestResolution.w, msg.requestResolution.h, msg.requestResolution.s, msg.requestResolution.c);
					} catch (e) {
						errorlog(e);
					}
				}

				if ("keyframe" in msg) {
					if (msg.scene) {
						// true or false only
						if (session.directorList.indexOf(altUUID || UUID) >= 0) {
							//  requested by director; if not, ignore
							session.sendKeyFrameScenes();
						} else {
							errorlog("Not director");
						}
					} else {
						session.forcePLI(UUID);
					}
				}

				if ("chat" in msg) {
					var isDirector = false;
					var overlayMsg = false;
					if (session.directorList.indexOf(altUUID || UUID) >= 0) {
						isDirector = true;
						if ("overlay" in msg) {
							if (msg.overlay == true) {
								overlayMsg = true;
							}
						}
					}
					log("isDirector " + isDirector);
					getChatMessage(msg.chat, session.pcs[UUID].label, isDirector, overlayMsg, UUID);
				}

				if ("tip" in msg) {
					// Handle incoming tip notification
					if (typeof processTipMessage === 'function') {
						processTipMessage(msg.tip, UUID);
					}
				}

				if ("order" in msg) {
					session.pcs[UUID].order = parseInt(msg.order) || 0;
					if (UUID in session.rpcs) {
						session.rpcs[UUID].order = session.pcs[UUID].order;
					}
					if (session.director) {
						var elements = document.querySelectorAll('[data-action-type="order-value"][data--u-u-i-d="' + UUID + '"]');
						log(elements);
						if (elements[0]) {
							elements[0].innerText = parseInt(msg.order) || 0;
						}
					}
					updateMixer();
				}

				if ("scale" in msg) {
					session.setScale(UUID, msg.scale);
				}

				/// PCS
				if (session.director && session.pcs[UUID].coDirector && "directorState" in msg) {
					// this is a post-connection incremental scene state update.
					log(msg);
					session.syncState = msg.directorState;
					for (var sid in session.syncState) {
						syncSceneState(sid);
						syncOtherState(sid);
						syncLabelState(sid);

						// Co-director: trigger approval popup for queued guests
						if (session.approval_popup && session.syncState[sid] && session.syncState[sid].others && session.syncState[sid].others["remove-queue"]) {
							// Find UUID for this streamID
							var foundGuest = false;
							for (var guestUUID in session.rpcs) {
								if (session.rpcs[guestUUID].streamID === sid) {
									showRemoveQueueButton(guestUUID);
									session.promptApproval(guestUUID);
									foundGuest = true;
									break;
								}
							}
							// If guest not connected yet, store for later when they connect
							if (!foundGuest && !session.pendingApprovalStreamIDs.includes(sid)) {
								session.pendingApprovalStreamIDs.push(sid);
							}
						} else if (session.syncState[sid] && session.syncState[sid].others && !session.syncState[sid].others["remove-queue"]) {
							// Guest was approved/removed from queue - remove from pending list
							var idx = session.pendingApprovalStreamIDs.indexOf(sid);
							if (idx > -1) {
								session.pendingApprovalStreamIDs.splice(idx, 1);
							}
						}
					}
					pokeAPI("details", msg.directorState);

					// Re-broadcast to other co-directors (not back to sender)
					for (var coUUID in session.pcs) {
						if (session.pcs[coUUID].coDirector && coUUID !== UUID) {
							session.sendMessage({ directorState: msg.directorState }, coUUID);
						}
					}
				}
				var remoteAuthorized = session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote);
				if (session.directorList.indexOf(altUUID || UUID) == -1) {
					// if the director gets rejected, let them know.
					if ("requestAudioHack" in msg) {
						var data = {};
						data.rejected = "requestAudioHack";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestVideoRecord" in msg) {
						var data = {};
						data.rejected = "requestVideoRecord";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("changeOrder" in msg) {
						var data = {};
						data.rejected = "changeOrder";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("changeURL" in msg) {
						var data = {};
						data.rejected = "changeURL";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("changeLabel" in msg) {
						var data = {};
						data.rejected = "changeLabel";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestChangeEQ" in msg) {
						var data = {};
						data.rejected = "requestChangeEQ";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestChangeGating" in msg) {
						var data = {};
						data.rejected = "requestChangeGating";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestChangeCompressor" in msg) {
						var data = {};
						data.rejected = "requestChangeCompressor";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestChangeSubGain" in msg) {
						var data = {};
						data.rejected = "requestChangeSubGain";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestChangeMicPanning" in msg) {
						var data = {};
						data.rejected = "requestChangeMicPanning";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("remoteVideoMuted" in msg) {
						var data = {};
						data.rejected = "remoteVideoMuted";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestChangeMicDelay" in msg) {
						var data = {};
						data.rejected = "requestChangeMicDelay";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("lowerhand" in msg) {
						var data = {};
						data.rejected = "lowerhand";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("hangup" in msg) {
						var data = {};
						data.rejected = "hangup";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("displayMute" in msg) {
						var data = {};
						data.rejected = "displayMute";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("speakerMute" in msg) {
						var data = {};
						data.rejected = "speakerMute";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("volume" in msg) {
						var data = {};
						data.rejected = "volume";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("micIsolated" in msg) {
						var data = {};
						data.rejected = "micIsolated";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("requestUpload" in msg) {
						var data = {};
						data.rejected = "requestUpload";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("stopClock" in msg) {
						var data = {};
						data.rejected = "stopClock";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("resumeClock" in msg) {
						var data = {};
						data.rejected = "resumeClock";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("setClock" in msg) {
						var data = {};
						data.rejected = "setClock";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("hideClock" in msg) {
						var data = {};
						data.rejected = "hideClock";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("showClock" in msg) {
						var data = {};
						data.rejected = "showClock";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("startClock" in msg) {
						var data = {};
						data.rejected = "startClock";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("pauseClock" in msg) {
						var data = {};
						data.rejected = "pauseClock";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("showTime" in msg) {
						var data = {};
						data.rejected = "showTime";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("group" in msg) {
						var data = {};
						data.rejected = "group";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("rotate" in msg) {
						if (!remoteAuthorized) {
							var data = {};
							data.rejected = "rotate";
							session.sendMessage(data, UUID); // this skips the server
						}
					} else if ("mirrorGuestState" in msg && "mirrorGuestTarget" in msg) {
						if (!remoteAuthorized) {
							var data = {};
							data.rejected = "mirrorGuestState";
							session.sendMessage(data, UUID); // this skips the server
						}
					} else if ("refreshMicrophone" in msg) {
						var data = {};
						data.rejected = "refreshMicrophone";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("changeMicrophone" in msg) {
						var data = {};
						data.rejected = "changeMicrophone";
						session.sendMessage(data, UUID); // this skips the server
					} else if ("getConnectionMap" in msg) {
						var data = {};
						data.rejected = "getConnectionMap";
						data.meshRequestId = msg.meshRequestId;
						session.sendMessage(data, UUID); // this skips the server
					} else if ("refreshVideo" in msg) {
						if (!remoteAuthorized) {
							var data = {};
							data.rejected = "refreshVideo";
							session.sendMessage(data, UUID);
						}
					} else if ("refreshConnection" in msg) {
						if (!remoteAuthorized) {
							var data = {};
							data.rejected = "refreshConnection";
							session.sendMessage(data, UUID);
						}
					} else if ("refreshAll" in msg) {
						if (!remoteAuthorized) {
							var data = {};
							data.rejected = "refreshAll";
							session.sendMessage(data, UUID);
						}
					} else if ("reconnectPeer" in msg) {
						var data = {};
						data.rejected = "reconnectPeer";
						session.sendMessage(data, UUID);
					}

				} else {
					if ("sceneRestoreRequest" in msg) {
						session.handleSceneRestoreRequest(UUID, altUUID);
						return;
					}
					if ("requestAudioHack" in msg) {
						var track0 = session.streamSrc.getAudioTracks();
						if (track0.length) {
							if ("deviceId" in msg) {
								applyAudioHack(msg.keyname, msg.value, msg.deviceId);
							} else {
								applyAudioHack(msg.keyname, msg.value);
							}
						}
					}
					if ("requestVideoRecord" in msg) {
						if (msg.requestVideoRecord) {
							if (msg.googleDriveRecord) {
								session.gdrive = {};
								session.gdrive.sessionUri = msg.googleDriveRecord;
							}
							if (session.videoElement) {
								var bitrate = 6000;

								if (msg.recordConfig) {
									bitrate = msg.recordConfig;
								} else if (msg.value) {
									bitrate = parseInt(msg.value);
								}

								recordLocalVideo("start", bitrate, false, msg.altUUID || false);
							}
						} else if (session.videoElement) {
							recordLocalVideo("stop", false, false, msg.altUUID || false);
						}
					}
					if ("changeOrder" in msg) {
						if (session.order == false) {
							session.order = 0;
						}
						session.order += parseInt(msg.changeOrder) || 0;
						var data = {};
						data.order = session.order;
						session.sendPeers(data);
						updateMixer();
					}

					// Publisher-side: apply director-requested mic panning
					if ("requestChangeMicPanning" in msg) {
						var prev = session.micPanning;
						if (msg.value === "false") {
							session.micPanning = false;
						} else {
							var v = parseInt(msg.value);
							if (isNaN(v)) { v = 90; }
							if (v < 0) v = 0; if (v > 180) v = 180;
							session.micPanning = v;
						}

						// Ensure WebAudio outbound pipeline is active if enabling
						if (session.micPanning !== false) {
							try { session.disableWebAudio = false; } catch (e) { }
						}

						// Rebuild outbound pipeline when enabling or disabling mic panning
						if ((prev === false && session.micPanning !== false) || (prev !== false && session.micPanning === false)) {
							try { session.videoElement.srcObject = outboundAudioPipeline(); } catch (e) { errorlog(e); }
							senderAudioUpdate();
						} else if (session.micPanning !== false) {
							// Live adjust without rebuild
							changeMicPanning(session.micPanning, msg.track);
						}
					}

					if ("changeURL" in msg) {
						changeURL(msg.changeURL);
					}
					if ("rotate" in msg) {
						if (msg.rotate === true) {
							if (session.rotate === false) {
								session.rotate = 90;
							} else {
								session.rotate += 90;
							}
							if (session.rotate >= 360) {
								session.rotate -= 360;
							}
							if (session.rotate === 0) {
								session.rotate = false;
							}
						} else if (msg.rotate === false || msg.rotate === "false") {
							session.rotate = false;
						} else {
							session.rotate = parseInt(msg.rotate) || false;
						}
						updateForceRotate();
						updateMixer();
					}

					if ("stopClock" in msg) {
						stopClock();
					}
					if ("resumeClock" in msg) {
						resumeClock();
					}
					if ("setClock" in msg) {
						setClock(msg.setClock);
					}
					if ("hideClock" in msg) {
						hideClock();
					}
					if ("showClock" in msg) {
						showClock();
					}
					if ("startClock" in msg) {
						startClock();
					}
					if ("pauseClock" in msg) {
						pauseClock();
					}

					if ("showTime" in msg) {
						if (session.showTime !== false) {
							if (msg.showTime && !session.showTime) {
								toggleClock(msg.clock24 || false);
							} else if (!msg.showTime && session.showTime) {
								toggleClock(msg.clock24 || false);
							}
						}
					}

					if ("requestUpload" in msg) {
						toggleFileshare(UUID);
					}

					if ("group" in msg) {
						try {
							if (altUUID) {
								if (msg.group) {
									session.group_alt = msg.group.split(",");
								} else {
									session.group_alt = [];
								}
								session.sendMessage({
									group: msg.group,
									altUUID: true
								});
							} else {
								if (msg.group) {
									session.group = msg.group.split(",");
								} else {
									session.group = [];
								}
								session.sendMessage({
									group: msg.group
								});
							}
							updateMixer();
							pokeIframeAPI("group-set-updated", session.group);
						} catch (e) { }
					}

					if ("changeLabel" in msg) {
						if ("value" in msg) {
							if (typeof msg.value == "string") {
								session.label = sanitizeLabel(msg.value); // .replace(/[\W]+/g,"_").replace(/_+/g, ' ');
								log("New Label: " + session.label);
								if (session.director) {
									// secondary director
									var elements = getById("label_" + UUID);
									if (session.label) {
										elements.innerText = session.label;
										elements.classList.remove("addALabel");
									} else if (session.directorUUID === (altUUID || UUID)) {
										//elements.innerHTML = getTranslation("main-director");
										miniTranslate(elements.innerHTML, "main-director");
										elements.classList.remove("addALabel");
									} else {
										//elements.innerHTML = getTranslation("add-a-label");
										miniTranslate(elements.innerHTML, "add-a-label");
										elements.classList.add("addALabel");
									}
								} else if (session.showlabels) {
									// update mixer if labels are shown
									updateMixer();
								}

								if (!session.director) {
									if (session.label) {
										document.title = session.label;
									} else {
										document.title = location.hostname;
									}
								}

								////
								var label = encodeURIComponent(session.label);
								if (urlParams.has("l")) {
									updateURL("l=" + label, true, false);
								} else {
									updateURL("label=" + label, true, false);
								}
								////

								var data = {};
								data.changeLabel = true;
								data.value = session.label;
								session.sendMessage(data);
							} else {
								session.label = false;

								var data = {};
								data.changeLabel = true;
								data.value = session.label;
								session.sendMessage(data);

								if (session.director) {
									// secondary director
									var elements = getById("label_" + UUID);
									if (session.directorUUID === (altUUID || UUID)) {
										//elements.innerHTML = getTranslation("main-director");
										miniTranslate(elements.innerHTML, "main-director");
										elements.classList.remove("addALabel");
									} else {
										//elements.innerHTML = getTranslation("add-a-label");
										miniTranslate(elements.innerHTML, "add-a-label");
										elements.classList.add("addALabel");
									}
								} else if (session.showlabels) {
									// update mixer if labels are shown
									document.title = location.hostname;
									updateMixer();
								} else {
									document.title = location.hostname;
								}
							}
						}
					}

					if ("requestChangeEQ" in msg) {
						if (msg.keyname == "low") {
							changeLowEQ(parseFloat(msg.value), msg.track);
						} else if (msg.keyname == "mid") {
							changeMidEQ(parseFloat(msg.value), msg.track);
						} else if (msg.keyname == "high") {
							changeHighEQ(parseFloat(msg.value), msg.track);
						}
					}

					if ("requestChangeGating" in msg) {
						var was = session.noisegate;
						if (msg.value === "false") {
							session.noisegate = false;
							log("noise gate off");
						} else if (msg.value === "true") {
							session.noisegate = true;
							log("noise gate on");
						} else {
							session.noisegate = msg.value;
						}
						if (session.noisegate !== was) {
							senderAudioUpdate();
						}
					}

					if ("requestChangeCompressor" in msg) {
						var was = session.compressor;
						if (msg.value === "false") {
							session.compressor = false;
							log("noise gate off");
						} else if (msg.value === "1") {
							session.compressor = 1;
							log("noise gate on");
						} else if (msg.value === "2") {
							session.compressor = 2;
							log("noise gate on");
						} else {
							session.compressor = parseInt(msg.value) || false;
						}
						if (session.compressor !== was) {
							senderAudioUpdate();
						}
					}

					if ("requestChangeMicPanning" in msg) {
						var prev = session.micPanning;
						if (msg.value === "false") {
							session.micPanning = false;
						} else {
							var v = parseInt(msg.value);
							if (isNaN(v)) { v = 90; }
							if (v < 0) v = 0; if (v > 180) v = 180;
							session.micPanning = v;
						}
						// Rebuild outbound pipeline when enabling or disabling mic panning
						if ((prev === false && session.micPanning !== false) || (prev !== false && session.micPanning === false)) {
							try { session.videoElement.srcObject = outboundAudioPipeline(); } catch (e) { errorlog(e); }
							senderAudioUpdate();
						} else if (session.micPanning !== false) {
							// Live adjust without rebuild
							changeMicPanning(session.micPanning, msg.track);
						}
					}

					if ("requestChangeMicDelay" in msg) {
						if (session.micDelay === false) {
							session.micDelay = parseInt(msg.value) || 0;
							senderAudioUpdate();
						} else {
							session.micDelay = parseInt(msg.value) || 0;
							changeMicDelay(session.micDelay, msg.track);
						}
					}

					if ("requestChangeSubGain" in msg) {
						changeSubGain(parseFloat(msg.value), msg.deviceId);
					}

					if ("lowerhand" in msg) {
						if (session.raisehands) {
							lowerhand();
						}
					}

					if ("mirrorGuestState" in msg && "mirrorGuestTarget" in msg) {
						if (msg.mirrorGuestTarget && msg.mirrorGuestTarget === true) {
							session.permaMirrored = msg.mirrorGuestState;
							session.mirrorOutput = msg.mirrorGuestState;
							applyMirror(session.mirrorExclude);
						} else if (msg.mirrorGuestTarget && msg.mirrorGuestTarget in session.rpcs) {
							session.rpcs[msg.mirrorGuestTarget].mirrorState = msg.mirrorGuestState;
							if (session.rpcs[msg.mirrorGuestTarget].videoElement) {
								applyMirrorGuest(
									msg.mirrorGuestState,
									session.rpcs[msg.mirrorGuestTarget].videoElement,
									session.rpcs[msg.mirrorGuestTarget].flipState
								); // mirror, videoElement
							}
						}
					}

					if ("getAudioSettings" in msg) {
						var data = {};
						data.UUID = UUID;
						data.audioOptions = listAudioSettingsPrep();
						sendMediaDevices(data.UUID);
						session.sendMessage(data, data.UUID);
					}
					if ("getVideoSettings" in msg) {
						var data = {};
						data.UUID = UUID;
						data.videoOptions = listVideoSettingsPrep();
						sendMediaDevices(data.UUID);
						session.sendMessage(data, data.UUID);
					}

					if ("changeSpeaker" in msg) {
						changeAudioOutputDeviceById(msg.changeSpeaker, UUID);
					}

					if ("changeMicrophone" in msg) {
						changeAudioDeviceById(msg.changeMicrophone, UUID);
					}

					if ("refreshMicrophone" in msg) {
						refreshMicrophoneDevice(UUID);
					}

					if ("refreshVideo" in msg) {
						refreshVideoDevice(UUID);
					}

					if ("refreshConnection" in msg) {
						// Trigger ICE restart for all peer connections
						for (var peerUUID in session.pcs) {
							if (session.pcs[peerUUID] && session.pcs[peerUUID].restartIce) {
								try {
									session.pcs[peerUUID].restartIce();
									log("ICE restart triggered for pcs: " + peerUUID);
								} catch (e) {
									warnlog("ICE restart failed for pcs: " + e);
								}
							}
						}
						for (var peerUUID in session.rpcs) {
							if (session.rpcs[peerUUID] && session.rpcs[peerUUID].restartIce) {
								try {
									session.rpcs[peerUUID].restartIce();
									log("ICE restart triggered for rpcs: " + peerUUID);
								} catch (e) {
									warnlog("ICE restart failed for rpcs: " + e);
								}
							}
						}
					}

					if ("refreshAll" in msg) {
						// Full media restart: refresh mic, video, and ICE
						refreshMicrophoneDevice(UUID);
						setTimeout(function() {
							refreshVideoDevice(UUID);
						}, 500);
						setTimeout(function() {
							for (var peerUUID in session.pcs) {
								if (session.pcs[peerUUID] && session.pcs[peerUUID].restartIce) {
									try { session.pcs[peerUUID].restartIce(); } catch (e) {}
								}
							}
							for (var peerUUID in session.rpcs) {
								if (session.rpcs[peerUUID] && session.rpcs[peerUUID].restartIce) {
									try { session.rpcs[peerUUID].restartIce(); } catch (e) {}
								}
							}
						}, 1000);
					}

					if ("restartWhip" in msg) {
						// Restart WHIP publishing connection (e.g., to MediaMTX)
						if (session.restartWhipConnection) {
							log("Restarting WHIP connection per director request");
							session.restartWhipConnection();
						} else if (session.whipOut) {
							// Fallback: close and let auto-reconnect handle it
							log("WHIP restart requested but no restart function - closing connection");
							try {
								session.whipOut.close();
								session.whipOut = null;
							} catch (e) {
								warnlog(e);
							}
						} else {
							log("WHIP restart requested but no WHIP connection active");
						}
					}

					if ("reconnectPeer" in msg) {
						// Restart ICE on one specific mesh path. Closing here used to leave
						// the connection without anything that recreated it.
						var targetPeerUUID = msg.reconnectPeer;
						if (targetPeerUUID) {
							var reconnectPeer = session.pcs[targetPeerUUID] || session.rpcs[targetPeerUUID];
							if (reconnectPeer && reconnectPeer.restartIce) {
								try {
									reconnectPeer.restartIce();
									log("Mesh ICE restart triggered for peer: " + targetPeerUUID);
								} catch (e) {
									warnlog("Mesh ICE restart failed for peer " + targetPeerUUID + ": " + e);
								}
							} else {
								warnlog("Mesh ICE restart could not find a restartable peer: " + targetPeerUUID);
							}
						}
					}

					if ("getConnectionMap" in msg) {
						// Build an on-demand, directional connection map for Mesh Network Debug.
						// Stats sampling only runs when the mesh tool explicitly requests it.
						var browserName = "Unknown";
						if (SafariVersion) {
							browserName = "Safari " + SafariVersion;
						} else if (typeof getChromiumVersion === "function" && getChromiumVersion() > 60) {
							browserName = "Chrome " + getChromiumVersion();
						} else if (Firefox) {
							browserName = "Firefox";
						} else if (navigator.userAgent.indexOf("CriOS") >= 0) {
							browserName = "Chrome iOS";
						}

						function meshTransportConnected(peer) {
							return !!(
								peer &&
								(peer.connectionState === "connected" ||
									peer.iceConnectionState === "connected" ||
									peer.iceConnectionState === "completed")
							);
						}

						function meshTransportState(peer, configured) {
							if (!configured) {
								return "disabled";
							}
							if (!peer) {
								return "not-started";
							}
							return peer.connectionState || peer.iceConnectionState || "unknown";
						}

						var primaryWhipConfigured = !!session.whipOutput && session.whipPublishPrimary !== false;
						var screenWhipConfigured = !!session.whipOutputScreen && session.whipPublishScreen === true;
						var whipReconnectAttempts = 0;
						try {
							whipReconnectAttempts = session.getWhipReconnectAttempts ? session.getWhipReconnectAttempts() : 0;
						} catch (e) {}

						var connectionMap = {
							uuid: session.UUID,
							streamID: session.streamID,
							label: session.label || session.streamID || "Guest",
							browser: browserName,
							meshRequestId: msg.meshRequestId,
							sampledAt: Date.now(),
							whipPrimary: {
								configured: primaryWhipConfigured,
								active: !!session.whipOut,
								connected: meshTransportConnected(session.whipOut),
								state: meshTransportState(session.whipOut, primaryWhipConfigured),
								restartable: primaryWhipConfigured && typeof session.restartWhipConnection === "function",
								reconnectAttempts: whipReconnectAttempts
							},
							whipScreen: {
								configured: screenWhipConfigured,
								active: !!session.whipOutScreen,
								connected: meshTransportConnected(session.whipOutScreen),
								state: meshTransportState(session.whipOutScreen, screenWhipConfigured),
								restartable: false
							},
							connections: []
						};
						var meshStatPromises = [];

						function meshTrackDetails(peer, direction, connInfo, audioMuted, videoMuted) {
							var tracks = [];
							try {
								var endpoints = direction === "outgoing" ? peer.getSenders() : peer.getReceivers();
								for (var endpointIndex = 0; endpointIndex < endpoints.length; endpointIndex++) {
									if (endpoints[endpointIndex] && endpoints[endpointIndex].track) {
										tracks.push(endpoints[endpointIndex].track);
									}
								}
							} catch (e) {}

							function describeTrack(kind, intentionallyMuted) {
								var track = null;
								for (var trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
									if (tracks[trackIndex].kind === kind) {
										track = tracks[trackIndex];
										break;
									}
								}
								connInfo[kind + "TrackPresent"] = !!track;
								connInfo[kind + "TrackEnabled"] = !!(track && track.enabled !== false);
								connInfo[kind + "TrackMuted"] = !!(track && track.muted);
								connInfo[kind + "TrackState"] = track ? (track.readyState || "unknown") : "missing";
								connInfo[kind + "IntentionallyMuted"] = !!intentionallyMuted;
								connInfo[kind + "Expected"] = !!(
									track &&
									track.readyState !== "ended" &&
									track.enabled !== false &&
									!intentionallyMuted
								);
							}

							describeTrack("audio", audioMuted);
							describeTrack("video", videoMuted);
						}

						function readMeshStats(stats, direction) {
							var snapshot = {
								audioBytes: 0,
								audioPackets: 0,
								videoBytes: 0,
								videoPackets: 0,
								audioStatsPresent: false,
								videoStatsPresent: false,
								localCandidateType: "unknown",
								remoteCandidateType: "unknown",
								protocol: "unknown",
								relayProtocol: ""
							};
							var rtpType = direction === "outgoing" ? "outbound-rtp" : "inbound-rtp";
							var bytesField = direction === "outgoing" ? "bytesSent" : "bytesReceived";
							var packetsField = direction === "outgoing" ? "packetsSent" : "packetsReceived";
							var selectedPairId = null;
							var fallbackPair = null;

							stats.forEach(function (stat) {
								if (stat.type === rtpType && !stat.isRemote) {
									var mediaKind = ((stat.kind || stat.mediaType || "") + "").toLowerCase();
									if (mediaKind === "audio") {
										snapshot.audioStatsPresent = true;
										snapshot.audioBytes += Number.isFinite(stat[bytesField]) ? stat[bytesField] : 0;
										snapshot.audioPackets += Number.isFinite(stat[packetsField]) ? stat[packetsField] : 0;
									} else if (mediaKind === "video") {
										snapshot.videoStatsPresent = true;
										snapshot.videoBytes += Number.isFinite(stat[bytesField]) ? stat[bytesField] : 0;
										snapshot.videoPackets += Number.isFinite(stat[packetsField]) ? stat[packetsField] : 0;
									}
								} else if (stat.type === "transport" && stat.selectedCandidatePairId) {
									selectedPairId = stat.selectedCandidatePairId;
								} else if (stat.type === "candidate-pair") {
									if (stat.selected) {
										selectedPairId = stat.id;
									} else if (!fallbackPair && stat.nominated && stat.state === "succeeded") {
										fallbackPair = stat;
									}
								}
							});

							var pair = selectedPairId && stats.get ? stats.get(selectedPairId) : fallbackPair;
							if (pair) {
								var localCandidate = pair.localCandidateId && stats.get ? stats.get(pair.localCandidateId) : null;
								var remoteCandidate = pair.remoteCandidateId && stats.get ? stats.get(pair.remoteCandidateId) : null;
								if (localCandidate) {
									snapshot.localCandidateType = localCandidate.candidateType || "unknown";
									snapshot.protocol = localCandidate.protocol || pair.protocol || "unknown";
									snapshot.relayProtocol = localCandidate.relayProtocol || "";
								}
								if (remoteCandidate) {
									snapshot.remoteCandidateType = remoteCandidate.candidateType || "unknown";
									if (snapshot.protocol === "unknown") {
										snapshot.protocol = remoteCandidate.protocol || pair.protocol || "unknown";
									}
									if (!snapshot.relayProtocol) {
										snapshot.relayProtocol = remoteCandidate.relayProtocol || "";
									}
								}
							}
							return snapshot;
						}

						function sampleMeshConnection(peer, connInfo) {
							if (!peer || !peer.getStats) {
								connInfo.statsAvailable = false;
								return Promise.resolve(connInfo);
							}
							var firstSnapshot = null;
							var sampleStarted = Date.now();
							return peer.getStats()
								.then(function (stats) {
									firstSnapshot = readMeshStats(stats, connInfo.direction);
									return new Promise(function (resolve) {
										setTimeout(resolve, 900);
									});
								})
								.then(function () {
									return peer.getStats();
								})
								.then(function (stats) {
									var latest = readMeshStats(stats, connInfo.direction);
									connInfo.statsAvailable = true;
									connInfo.sampleWindowMs = Date.now() - sampleStarted;
									connInfo.audioStatsPresent = latest.audioStatsPresent;
									connInfo.videoStatsPresent = latest.videoStatsPresent;
									connInfo.audioBytes = latest.audioBytes;
									connInfo.audioPackets = latest.audioPackets;
									connInfo.videoBytes = latest.videoBytes;
									connInfo.videoPackets = latest.videoPackets;
									connInfo.audioBytesDelta = Math.max(0, latest.audioBytes - firstSnapshot.audioBytes);
									connInfo.audioPacketsDelta = Math.max(0, latest.audioPackets - firstSnapshot.audioPackets);
									connInfo.videoBytesDelta = Math.max(0, latest.videoBytes - firstSnapshot.videoBytes);
									connInfo.videoPacketsDelta = Math.max(0, latest.videoPackets - firstSnapshot.videoPackets);
									connInfo.audioFlowing = !!(connInfo.audioBytesDelta > 0 || connInfo.audioPacketsDelta > 0);
									connInfo.videoFlowing = !!(connInfo.videoBytesDelta > 0 || connInfo.videoPacketsDelta > 0);
									connInfo.localCandidateType = latest.localCandidateType;
									connInfo.remoteCandidateType = latest.remoteCandidateType;
									connInfo.protocol = latest.protocol;
									connInfo.relayProtocol = latest.relayProtocol;
									if (latest.localCandidateType === "relay" || latest.remoteCandidateType === "relay") {
										connInfo.candidateType = "relay";
									} else {
										connInfo.candidateType = latest.localCandidateType !== "unknown" ? latest.localCandidateType : latest.remoteCandidateType;
									}
									return connInfo;
								})
								.catch(function (error) {
									connInfo.statsAvailable = false;
									connInfo.statsError = error && error.message ? error.message : "getStats failed";
									return connInfo;
								});
						}

						// Outgoing connections: this guest publishes to the peer.
						for (var pcsPeerUUID in session.pcs) {
							if (session.pcs[pcsPeerUUID]) {
								var pc = session.pcs[pcsPeerUUID];
								var outgoingInfo = {
									peerUUID: pcsPeerUUID,
									peerStreamID: pc.streamID || pcsPeerUUID,
									direction: "outgoing",
									state: pc.connectionState || "unknown",
									bandwidth: -1,
									nackCount: pc.stats ? (pc.stats.nackCount || 0) : 0,
									pliCount: pc.stats ? (pc.stats.pliCount || 0) : 0,
									candidateType: pc.stats ? (pc.stats.candidateType_local || "unknown") : "unknown"
								};
								meshTrackDetails(pc, "outgoing", outgoingInfo, session.muted, session.videoMuted);
								connectionMap.connections.push(outgoingInfo);
								meshStatPromises.push(sampleMeshConnection(pc, outgoingInfo));
							}
						}

						// Incoming connections: this guest receives from the peer.
						for (var rpcsPeerUUID in session.rpcs) {
							if (session.rpcs[rpcsPeerUUID]) {
								var rpc = session.rpcs[rpcsPeerUUID];
								var incomingCandidateType = "unknown";
								if (rpc.stats && rpc.stats["Peer-to-Peer_Connection"]) {
									incomingCandidateType = rpc.stats["Peer-to-Peer_Connection"].candidateType_local || "unknown";
								}
								var incomingInfo = {
									peerUUID: rpcsPeerUUID,
									peerStreamID: rpc.streamID || rpcsPeerUUID,
									direction: "incoming",
									state: rpc.connectionState || "unknown",
									bandwidth: rpc.bandwidth || -1,
									nackCount: rpc.nackCount || 0,
									pliCount: rpc.pliCount || 0,
									candidateType: incomingCandidateType
								};
								meshTrackDetails(rpc, "incoming", incomingInfo, rpc.remoteMuteState, rpc.videoMuted);
								connectionMap.connections.push(incomingInfo);
								meshStatPromises.push(sampleMeshConnection(rpc, incomingInfo));
							}
						}

						connectionMap.requesterUUID = UUID;
						Promise.all(meshStatPromises).then(function () {
							connectionMap.sampledAt = Date.now();
							session.sendMessage({ connectionMap: connectionMap }, UUID);
							log("Sent directional connection map to director: " + connectionMap.connections.length + " connections");
						});
					}

					if ("changeCamera" in msg) {
						changeVideoDeviceById(msg.changeCamera, UUID);
					}

					if ("requestChangeLowcut" in msg) {
						changeLowCut(parseFloat(msg.value), msg.track);
					}

					if ("requestChangeLowcut" in msg) {
						changeLowCut(parseFloat(msg.value), msg.track);
					}

					if ("hangup" in msg) {
						if (session.directorUUID) {
							// make sure the king director can't be hung up by a co-director, but let others be kicked by a sub-director

							// If director chose to block this user, store it before hanging up
							if (msg.block && session.roomid) {
								try {
									// Use room + hash to make block specific to room+password combination
									var blockKey = "vdo_block_" + sanitizeRoomName(session.roomid) + "_" + (session.hash || "");
									setStorage(blockKey, true, 4); // Block for 4 hours
									log("User blocked from room");
								} catch (e) {
									errorlog("Failed to store block: " + e);
								}
							}

							session.hangup();
						}
					}
					if ("mute" in msg) {
						//session.forcePLI(UUID);
					}
					if ("volume" in msg) {
						if ("volumeRevision" in msg) {
							if (!Number.isSafeInteger(msg.volumeRevision) || msg.volumeRevision <= (session.pcs[UUID].lastVolumeRevision || 0)) return;
							session.pcs[UUID].lastVolumeRevision = msg.volumeRevision;
						}
						var vol = parseInt(msg.volume) / 100.0 || 0;
						session.audioGain = parseInt(msg.volume) || 0;
						try {
							for (var waid in session.webAudios) {
								// TODO:  EXCLUDE CURRENT TRACK IF ALREADY EXISTS ... if (trackid === wa.id){..
								log("Adjusting Gain; only track 0 in all likely hood, unless more than track 0 support is added.");
								session.webAudios[waid].gainNode.gain.setValueAtTime(vol, session.webAudios[waid].audioContext.currentTime);
							}
						} catch (e) { }
						updateVolume(true);
					}
					if ("micIsolate" in msg) {
						if (msg.micIsolate) {
							if (session.directorList.indexOf(altUUID || UUID) >= 0) {
								session.micIsolated.push(UUID);
								session.applyIsolatedChat();
							}
						} else {
							var index = session.micIsolated.indexOf(UUID);
							if (index > -1) {
								session.micIsolated.splice(index, 1);
								session.applyIsolatedChat();
							}
						}
					}

					if ("lowerVolume" in msg) {
						if (msg.lowerVolume) {
							if (session.directorList.indexOf(altUUID || UUID) >= 0) {
								session.lowerVolume.push(UUID);
								session.applyIsolatedVolume();
							}
						} else {
							var index = session.lowerVolume.indexOf(UUID);
							if (index > -1) {
								session.lowerVolume.splice(index, 1);
								session.applyIsolatedVolume();
							}
						}
					}

					if ("speakerMute" in msg) {
						if (msg.speakerMute) {
							session.directorSpeakerMuted = true;
							session.directorSpeakerMute();
						} else {
							session.directorSpeakerMuted = false;
							session.directorSpeakerMute();
						}
					}

					if ("displayMute" in msg) {
						if (msg.displayMute) {
							session.directorDisplayMuted = true;
							session.directorDisplayMute();
						} else {
							session.directorDisplayMuted = false;
							session.directorDisplayMute();
						}
					}

					if ("remoteVideoMuted" in msg) {
						session.remoteVideoMuted = msg.remoteVideoMuted;
						toggleVideoMute(true);
						if (!session.videoMuted) {
							// we're already muted, and that's not going to change
							var data = {};
							data.videoMuted = session.remoteVideoMuted;
							session.sendMessage(data);
						}
					}

					if ("changeParams" in msg) {
						applyNewParams(msg.changeParams);
					}
				}
				///////// END DIRECTOR

				if (session.directorUUID === (altUUID || UUID)) {
					// main director only.
					if (msg.request === "migrate") {
						warnlog("TRANSFERRING?");

						if ("transferSettings" in msg) {
							if ("roomenc" in msg.transferSettings) {
								session.roomenc = msg.transferSettings.roomenc;
								setWebStreamTakeoverRoomScope(session.roomenc);
							}
							if ("broadcast" in msg.transferSettings) {
								if (msg.transferSettings.broadcast === true || msg.transferSettings.broadcast === null) {
									session.broadcast = null;

									if (session.minipreview === false) {
										session.minipreview = 2; // full screen if nothing else on screen.
									}
									if (session.style === false) {
										session.style = 1;
									}
									if (session.showList === null) {
										session.showList = true;
									}
								} else {
									session.broadcast = msg.transferSettings.broadcast;
								}
								if (msg.transferSettings.updateurl) {
									if (session.broadcast !== false) {
										if (session.broadcast === null) {
											updateURL("broadcast", true);
										} else {
											updateURL("broadcast=" + session.broadcast, true);
										}
									} else {
										updateURL("broadcast=false", true);
									}
								}
							}

							if ("roomid" in msg.transferSettings) {
								session.roomid = msg.transferSettings.roomid;
								if (msg.transferSettings.updateurl) {
									updateURL("room=" + session.roomid, true);
								}
							}
							if ("queue" in msg.transferSettings) {
								session.queue = msg.transferSettings.queue;
								if (session.queue) {
									// default queue mode when not specified
									if (!("queueType" in msg.transferSettings)) {
										session.queueType = 2;
									}
								} else {
									session.queueType = false;
								}
								if (msg.transferSettings.updateurl) {
									if (session.queue) {
										updateURL("queue", true);
									} else {
										updateURL("queue=false", true);
									}
								}
							}

							if ("queueType" in msg.transferSettings) {
								try {
									session.queue = true;
									session.queueType = parseInt(msg.transferSettings.queueType) || 3;
								} catch (e) {
									errorlog(e);
								}
							}

							if ("justResetting" in msg.transferSettings) {
								if (session.queue) {
									session.queue = 3;
									if (msg.transferSettings.updateurl) {
										updateURL("queue=false", true);
									}
								}
							}
						}
						if (session.waitPage && session.layout) {
							session.layout = false;
							session.waitPage = false;
							updateMixer();
						}
					}
					try {
						if ("directorSettings" in msg && "addCoDirector" in msg.directorSettings) {
							// only the main director can assign co-directorship; guests mark co-directors visually
							var senderUUID = (altUUID || UUID || "").toString();
							if (session.rpcs && session.rpcs[senderUUID] && session.rpcs[senderUUID].realUUID) {
								senderUUID = session.rpcs[senderUUID].realUUID.toString();
							} else if (senderUUID.endsWith("_screen")) {
								senderUUID = senderUUID.slice(0, -7);
							}
							if (session.directorUUID && senderUUID === session.directorUUID) {
								for (var i = 0; i < msg.directorSettings.addCoDirector.length; i++) {
									var coUUID = msg.directorSettings.addCoDirector[i].toString();
									if (!session.directorList.includes(coUUID)) {
										session.directorList.push(coUUID);
										var ele = getById("container_" + coUUID);
										if (ele) {
											ele.classList.add("directorBlue");
										}
									}
									// If co-director already connected before we knew about them (race condition),
									// and we deferred publishing, start publishing now (only for holdwithvideo, not hold)
									if (coUUID in session.pcs && session.pcs[coUUID].needsPublishing && session.queueType == 4) {
										session.initialPublish(coUUID);
									}
									// If the co-director already has a P2P connection to this guest, push audio settings
									// so advanced audio controls can populate without waiting for a manual retry.
									if (coUUID in session.pcs) {
										try {
											var data = {};
											data.UUID = coUUID;
											data.audioOptions = listAudioSettingsPrep();
											sendMediaDevices(data.UUID);
											session.sendMessage(data, data.UUID);
										} catch (e) { }
									}
								}
							}
						}
					} catch (e) {
						errorlog(e);
					}

					if ("cbid" in msg) {
						try {
							session.sendMessage({
								cbid: msg.cbid
							}, UUID);
						} catch (e) {
							errorlog(e);
						}
					}
				}
				if ("requestVideoHack" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote)) {
						if (msg.cameraOperatorRequest && !validateCameraOperatorConstraint(msg.keyname, msg.value)) {
							session.sendMessage({ cameraOperatorRejected: "constraint" }, UUID);
							return;
						}
						if ("ctrl" in msg && msg.ctrl) {
							await updateCameraConstraints(msg.keyname, msg.value, true, UUID);
						} else {
							await updateCameraConstraints(msg.keyname, msg.value, false, false);
						}
						if (msg.cameraOperatorRequest) {
							setTimeout(function (requesterUUID) {
								sendCameraOperatorSettings(requesterUUID);
							}, 120, UUID);
						}
					} else {
						// no password provided by remote or not a director
						if (msg.cameraOperatorRequest) {
							session.sendMessage({ cameraOperatorRejected: "constraint" }, UUID);
						}
						return;
					}
				}

				if ("getCameraOperatorSettings" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || remoteAuthorized) {
						sendCameraOperatorSettings(UUID);
					} else {
						session.sendMessage({ cameraOperatorRejected: "settings" }, UUID);
					}
				}

				if ("changeCameraOperator" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || remoteAuthorized) {
						changeVideoDeviceById(msg.changeCameraOperator, UUID, false);
					} else {
						session.sendMessage({ cameraOperatorRejected: "camera" }, UUID);
					}
				}

				if ("changeCameraEffect" in msg || "changeCameraEffectAmount" in msg) {
					var effectDirectorAuthorized = session.directorList.indexOf(altUUID || UUID) >= 0;
					if (effectDirectorAuthorized || remoteAuthorized) {
						var requestedEffect = "changeCameraEffect" in msg ? msg.changeCameraEffect : undefined;
						var requestedEffectAmount = "changeCameraEffectAmount" in msg ? msg.changeCameraEffectAmount : undefined;
						var effectResult = await changeVideoEffectWithConsent(requestedEffect, requestedEffectAmount, UUID);
						var effectResponse = { cameraEffectChange: effectResult };
						if (effectDirectorAuthorized && ("changeCameraEffect" in msg || !effectResult.ok)) {
							effectResponse.videoOptions = listVideoSettingsPrep();
						}
						session.sendMessage(effectResponse, UUID);
						if (effectResponse.videoOptions) {
							sendMediaDevices(UUID);
						}
						if (msg.cameraOperatorRequest) {
							sendCameraOperatorSettings(UUID);
						}
					} else {
						session.sendMessage({ cameraOperatorRejected: "effect" }, UUID);
					}
				}

				if (session.directorList.indexOf(altUUID || UUID) == -1 && remoteAuthorized) {
					if ("refreshVideo" in msg) {
						refreshVideoDevice(UUID);
					}
					if ("refreshConnection" in msg) {
						for (var peerUUID in session.pcs) {
							if (session.pcs[peerUUID] && session.pcs[peerUUID].restartIce) {
								try {
									session.pcs[peerUUID].restartIce();
								} catch (e) {}
							}
						}
						for (var peerUUID in session.rpcs) {
							if (session.rpcs[peerUUID] && session.rpcs[peerUUID].restartIce) {
								try {
									session.rpcs[peerUUID].restartIce();
								} catch (e) {}
							}
						}
					}
					if ("refreshAll" in msg) {
						refreshMicrophoneDevice(UUID);
						setTimeout(function() {
							refreshVideoDevice(UUID);
						}, 500);
						setTimeout(function() {
							for (var peerUUID in session.pcs) {
								if (session.pcs[peerUUID] && session.pcs[peerUUID].restartIce) {
									try {
										session.pcs[peerUUID].restartIce();
									} catch (e) {}
								}
							}
							for (var peerUUID in session.rpcs) {
								if (session.rpcs[peerUUID] && session.rpcs[peerUUID].restartIce) {
									try {
										session.rpcs[peerUUID].restartIce();
									} catch (e) {}
								}
							}
						}, 1000);
					}
				}

				if ("zoom" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote)) {
						session.remoteZoom(parseFloat(msg.zoom), (msg.abs || false));
					} else {
						// no password provided by remote
						return;
					}
				}
				if ("focus" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote)) {
						session.remoteFocus(parseFloat(msg.focus), (msg.abs || false));
					} else {
						// no password provided by remote
						return;
					}
				}
				if ("autofocus" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote)) {
						session.setRemoteAutofocus(msg.autofocus);
					} else {
						// no password provided by remote
						return;
					}
				}
				if ("pan" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote)) {
						session.remotePan(parseFloat(msg.pan), (msg.abs || false));
					} else {
						// no password provided by remote
						return;
					}
				}
				if ("tilt" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote)) {
						session.remoteTilt(parseFloat(msg.tilt), (msg.abs || false));
					} else {
						// no password provided by remote
						return;
					}
				}
				if ("exposure" in msg) {
					if (session.directorList.indexOf(altUUID || UUID) >= 0 || session.remote === true || (session.remote && "remote" in msg && msg.remote === session.remote)) {
						session.remoteExposure(parseFloat(msg.exposure), (msg.abs || false));
					} else {
						// no password provided by remote
						return;
					}
				}
				if ("rotate" in msg && session.directorList.indexOf(altUUID || UUID) == -1) {
					if (remoteAuthorized) {
						if (msg.rotate === true) {
							if (session.rotate === false) {
								session.rotate = 90;
							} else {
								session.rotate += 90;
							}
							if (session.rotate >= 360) {
								session.rotate -= 360;
							}
							if (session.rotate === 0) {
								session.rotate = false;
							}
						} else if (msg.rotate === false || msg.rotate === "false") {
							session.rotate = false;
						} else {
							session.rotate = parseInt(msg.rotate) || false;
						}
						updateForceRotate();
						updateMixer();
					} else {
						return;
					}
				}
				if ("mirrorGuestState" in msg && "mirrorGuestTarget" in msg && session.directorList.indexOf(altUUID || UUID) == -1) {
					if (remoteAuthorized) {
						if (msg.mirrorGuestTarget && msg.mirrorGuestTarget === true) {
							session.permaMirrored = msg.mirrorGuestState;
							session.mirrorOutput = msg.mirrorGuestState;
							applyMirror(session.mirrorExclude);
						} else if (msg.mirrorGuestTarget && msg.mirrorGuestTarget in session.rpcs) {
							session.rpcs[msg.mirrorGuestTarget].mirrorState = msg.mirrorGuestState;
							if (session.rpcs[msg.mirrorGuestTarget].videoElement) {
								applyMirrorGuest(
									msg.mirrorGuestState,
									session.rpcs[msg.mirrorGuestTarget].videoElement,
									session.rpcs[msg.mirrorGuestTarget].flipState
								); // mirror, videoElement
							}
						}
					} else {
						return;
					}
				}

				if ("requestFile" in msg) {
					log("requestFile");
					try {
						session.sendFile(UUID, msg.requestFile);
					} catch (e) {
						errorlog(e);
					}
				}

				if ("midi" in msg) {
					playbackMIDI(msg.midi, true, UUID);
				}
			} catch (e) {
				errorlog(e);
			}

			if ("rejected" in msg) {
				if (isIFrame && session.iframeMediaDeviceChangeRequests) {
					try {
						var rejectedDeviceKind = msg.rejected === "changeCamera" ? "camera" : msg.rejected === "changeMicrophone" ? "microphone" : msg.rejected === "changeSpeaker" ? "speaker" : false;
						var rejectedDeviceKey = rejectedDeviceKind ? UUID + ":" + rejectedDeviceKind : false;
						var rejectedDeviceRequest = rejectedDeviceKey ? session.iframeMediaDeviceChangeRequests[rejectedDeviceKey] : false;
						if (rejectedDeviceRequest) {
							if (rejectedDeviceRequest.timer) {
								clearTimeout(rejectedDeviceRequest.timer);
							}
							parent.postMessage(
								{
									guestMediaDeviceChange: {
										ok: false,
										error: msg.message || "Guest rejected device change",
										target: rejectedDeviceRequest.target || (session.rpcs[UUID] && session.rpcs[UUID].streamID) || UUID,
										UUID: UUID,
										streamID: (session.rpcs[UUID] && session.rpcs[UUID].streamID) || false,
										kind: rejectedDeviceKind,
										deviceId: rejectedDeviceRequest.deviceId || false
									},
									cib: rejectedDeviceRequest.cib || null
								},
								session.iframetarget
							);
							delete session.iframeMediaDeviceChangeRequests[rejectedDeviceKey];
						}
					} catch (e) {
						errorlog(e);
					}
				}
				if (msg.rejected == "obsCommand") {
					if (session.remote) {
						warnUser(getTranslation("invalid-remote-code"), 3000);
					} else if (document.querySelector("#obsRemotePassword>input") && document.querySelector("#obsRemotePassword>input").value) {
						warnUser(getTranslation("invalid-remote-code-obs"), 7000);
					} else {
						warnUser(getTranslation("request-rejected-obs"), 10000);
					}
					getById("obsRemotePassword").classList.remove("hidden");
				} else if (session.director) {
					if (!session.cleanOutput) {
						warnUser(msg.message || ("The request (" + msg.rejected + ") failed due to permissions or it was rejected by the user"), 5000);
					}
				} else if (!session.cleanOutput) {
					if (session.remote) {
						warnUser(getTranslation("remote-token-rejected"), 5000);
					} else {
						warnUser(getTranslation("remote-control-failed"), 5000);
					}
				}
				errorlog("ACTION REJECTED: " + msg.rejected + ", isDirector: " + session.director);
				pokeIframeAPI("rejected", msg.rejected, UUID);
				return;
			} else if ("approved" in msg) {
				log("approved: " + msg.approved);

				pokeIframeAPI("approved", msg.approved, UUID);
				return;
			}

			if ("audio" in msg || "video" in msg) {
				// this adds audio/video for just the person sending the message; so it's safe to allow. (iOS publishers need to check to make sure tho)
				log("ASKING FOR AUDIO AND VIDEO?");

				if (msg.audio) {
					session.pcs[UUID].allowAudio = msg.audio;
				}

				if (session.webp && "allowwebp" in msg && msg.allowwebp !== false) {
					session.pcs[UUID].allowWebp = msg.allowwebp;
					session.pcs[UUID].allowVideo = false;
					setTimeout(function () {
						makeImages(true);
					}, 1000);
				} else if (msg.video) {
					session.pcs[UUID].allowVideo = msg.video;
				}

				if ("broadcast" in msg && msg.broadcast !== false) {
					session.pcs[UUID].allowBroadcast = msg.broadcast;
				}

				if ("allowchunked" in msg && msg.allowchunked !== false) {
					session.pcs[UUID].allowChunked = msg.allowchunked;
					session.pcs[UUID].chunkProtocols = [];
					if (
						Array.isArray(msg.chunkprotocols) &&
						msg.chunkprotocols.indexOf(session.chunkProtocolIndexedV1) !== -1
					) {
						session.pcs[UUID].chunkProtocols.push(session.chunkProtocolIndexedV1);
					}
				}

				if ("allowdrawing" in msg && msg.allowdrawing) {
					session.pcs[UUID].allowDrawing = msg.allowdrawing;
					try {
						if (session.videoElement && session.videoElement.syncDrawOnVideo) {
							session.videoElement.syncDrawOnVideo();
						}
					} catch (e) {
						errorlog(e);
					}
				}

				if ("iframe" in msg && msg.iframe !== false) {
					session.pcs[UUID].allowIframe = msg.iframe;
				}

				const allowsScreenWhip = !(("allowscreenmeshcast" in msg && msg.allowscreenmeshcast === false) || ("allowscreenwhipout" in msg && msg.allowscreenwhipout === false));
				session.pcs[UUID].screenWhepAllowed = allowsScreenWhip;

				if ("widget" in msg && msg.widget !== false) {
					session.pcs[UUID].allowWidget = msg.widget;
				}

				if ("allowmidi" in msg && msg.allowmidi !== false) {
					session.pcs[UUID].allowMIDI = msg.allowmidi;
				}

				if ("allowresources" in msg && msg.allowresources !== false) {
					session.pcs[UUID].allowResources = msg.allowresources;
				}

				if ("downloads" in msg && msg.downloads !== false) {
					session.pcs[UUID].allowDownloads = msg.downloads;
				}

				if ("allowscreen" in msg && msg.allowscreen !== false) {
					session.pcs[UUID].allowScreenAudio = true;
					session.pcs[UUID].allowScreenVideo = true;
				}

				if ("allowscreenvideo" in msg && msg.allowscreenvideo !== false) {
					session.pcs[UUID].allowScreenVideo = true;
				}
				if ("allowscreenaudio" in msg && msg.allowscreenaudio !== false) {
					session.pcs[UUID].allowScreenAudio = true;
				}

				if (session.preferVideoCodec) {
					session.pcs[UUID].preferVideoCodec = session.preferVideoCodec;
				} else if ("preferVideoCodec" in msg && msg.preferVideoCodec !== false) {
					// not currently used
					session.pcs[UUID].preferVideoCodec = msg.preferVideoCodec.toLowerCase();
				}

				if (session.preferAudioCodec) {
					session.pcs[UUID].preferAudioCodec = session.preferAudioCodec;
				} else if ("preferAudioCodec" in msg && msg.preferAudioCodec !== false) {
					// not currently used
					session.pcs[UUID].preferAudioCodec = msg.preferAudioCodec.toLowerCase();
				}

				if ("allowscreenmeshcast" in msg && msg.allowscreenmeshcast === false) {
					session.pcs[UUID].whipScreen = false;
				}
				if ("allowscreenwhipout" in msg && msg.allowscreenwhipout === false) {
					session.pcs[UUID].whipScreen = false;
				}
				if ("allowmeshcast" in msg && msg.allowmeshcast === false) {
					session.pcs[UUID].whipout = false;
				} else if ("allowwhipout" in msg && msg.allowwhipout === false) {
					session.pcs[UUID].whipout = false;
				} else if (session.meshcast) {
					if (session.meshcast == "video") {
						session.pcs[UUID].allowVideo = false;
					} else if (session.meshcast == "audio") {
						session.pcs[UUID].allowAudio = false;
					} else if (session.pcs[UUID].allowVideo == false) {
						// lets not use meshcast if the guest doesn't want video
						session.pcs[UUID].whipout = false;
						// audio will be whatever it is; p2p if allowed. &broacast mode for example.
					} else {
						session.pcs[UUID].allowAudio = false;
						session.pcs[UUID].allowVideo = false;
					}
				} else if (session.whipOutput) {
					if (session.pcs[UUID].allowAudio === true && session.pcs[UUID].allowVideo === true) {
						session.pcs[UUID].allowAudio = false;
						session.pcs[UUID].allowVideo = false;
					} else {
						// Some WHEP relays reject audio-only/video-only offers for A/V WHIP sources.
						session.pcs[UUID].whipout = false;
					}
				}

				if (session.whipPublishScreen && session.whipOutputScreen && allowsScreenWhip) {
					session.pcs[UUID].allowScreenAudio = false;
					session.pcs[UUID].allowScreenVideo = false;
				}

				if (session.promptAccess && !(await session.approvePlaybackAccess(UUID))) return;

				if (session.whipoutSettings && session.whipoutSettings.url) {
					broadcastWhepSettings("primary");
				}
				if (
					session.whipPublishScreen &&
					session.screenShareState &&
					session.whipoutScreenSettings &&
					session.whipoutScreenSettings.url &&
					session.whipoutScreenSettings.started
				) {
					broadcastWhepSettings("screen");
				}

				if ("guest" in msg) {
					// newly added; guests say if they are guests or not
					if (msg.guest == true) {
						session.pcs[UUID].guest = true;
						if (session.beepToNotify) {
							playtone(false, "jointone");
							showNotification("A Guest joined the room", "");
						}
						pokeIframeAPI("guest-connected", msg.director, UUID);
					}
				}

				if ("forceios" in msg) {
					if (msg.forceios === true) {
						session.pcs[UUID].forceios = true;
					}
				}

				if ("remote" in msg) {
					session.pcs[UUID].remote = msg.remote;
				}

				if ("limitaudio" in msg) {
					if (msg.limitaudio == true) {
						session.pcs[UUID].limitAudio = true;
					}
				}

				if ("enhanceaudio" in msg) {
					if (msg.enhanceaudio == true) {
						session.pcs[UUID].enhanceAudio = true;
					}
				}

				if (msg.degrade) {
					session.pcs[UUID].degradationPreference = msg.degrade;
				}

				if ("keyframeRate" in msg) {
					try {
						session.pcs[UUID].keyframeRate = msg.keyframeRate;
						if (session.pcs[UUID].keyframeRate) {
							setTimeout(
								function (UUID) {
									session.forcePLI(UUID);
								},
								5000,
								UUID
							);
						}
					} catch (e) {
						warnlog(e);
					}
					// session.pcs[UUID].keyframeRate
					// session.requestKeyframe(UUID);
					// session.rpcs[UUID].stats[stat.trackId].nackTrigger = 0;
					// session.forcePLI(UUID);
				}

				if ("solo" in msg) {
					session.pcs[UUID].solo = msg.solo;
				}

				if ("layout" in msg) {
					const layoutValue = msg.layout;
					if (
						layoutValue &&
						layoutValue !== true &&
						layoutValue !== "true" &&
						layoutValue !== false &&
						layoutValue !== "false"
					) {
						session.pcs[UUID].layout = layoutValue;
					} else if (!session.pcs[UUID].layout && (layoutValue === true || layoutValue === "true")) {
						session.pcs[UUID].layout = layoutValue;
					}
					const normalizedLayout = normalizeLayoutState(layoutValue);
					if (typeof normalizedLayout !== "undefined") {
						session.pcs[UUID].layoutState = normalizedLayout;
					} else if (typeof session.pcs[UUID].layoutState === "undefined") {
						session.pcs[UUID].layoutState = false;
					}
				}

				if ("scene" in msg) {
					// newly added; guests say if they are a scene or not
					if (msg.scene !== false) {
						// director won't allow video to a scene
						try {
							if (typeof msg.scene === "string") {
								session.pcs[UUID].scene = msg.scene.replace(/[\W]+/g, "_");
							} else {
								session.pcs[UUID].scene = (parseInt(msg.scene) || 0) + "";
							}
							session.pcs[UUID].stats.scene = session.pcs[UUID].scene;
							updateSceneList(session.pcs[UUID].scene);
						} catch (e) {
							errorlog(e);
						}

						if ("showDirector" in msg) {
							// remote scene is setting the state of sjow director
							session.pcs[UUID].showDirector = msg.showDirector;
						} else {
							session.pcs[UUID].showDirector = session.showDirector; // director is setting state instead; default false
						}

						if (session.director) {
							if (session.pcs[UUID].showDirector == false) {
								// nothing allowed in scene
								session.pcs[UUID].allowAudio = false;
								session.pcs[UUID].allowVideo = false;
								session.pcs[UUID].allowIframe = false;
								session.pcs[UUID].allowDrawing = false;
								session.pcs[UUID].allowWidget = false;
								session.pcs[UUID].whipout = false;
								session.pcs[UUID].allowWebp = false;
								session.pcs[UUID].allowScreenAudio = false;
								session.pcs[UUID].allowScreenVideo = false;
							} else if (session.pcs[UUID].showDirector == 1) {
								// everything allowed except iframe and widgets (1==true)
								session.pcs[UUID].allowIframe = false;
								session.pcs[UUID].allowWidget = false;
								session.pcs[UUID].allowDrawing = false;
							} else if (session.pcs[UUID].showDirector == 2) {
								// video/iframe/widget allowed; but not audio
								session.pcs[UUID].allowAudio = false;
								session.pcs[UUID].allowScreenAudio = false;
								session.pcs[UUID].allowIframe = false;
								session.pcs[UUID].allowWidget = false;
								session.pcs[UUID].allowDrawing = false;
								// allow video, iframe, widgets
							} else if (session.pcs[UUID].showDirector == 3) {
								// only the screen share (a/v) allowed in scenes
								session.pcs[UUID].allowAudio = false;
								session.pcs[UUID].allowVideo = false;
								session.pcs[UUID].allowIframe = false;
								session.pcs[UUID].allowWidget = false;
								session.pcs[UUID].whipout = false;
								session.pcs[UUID].allowWebp = false;
								session.pcs[UUID].allowDrawing = false;
								// session.pcs[UUID].allowScreenAudio = false;
								// session.pcs[UUID].allowScreenVideo = false;
							} else if (session.pcs[UUID].showDirector == 4) {
								// everything allowed
								//
							}

							broadcastSlotUpdate(UUID);
						}

						if (session.pcs[UUID].solo) {
							pokeIframeAPI("solo-scene-connected", msg.scene, UUID);
						} else {
							pokeIframeAPI("scene-connected", msg.scene, UUID);
						}
					}
					session.initialDirectorSync(UUID); // try to sync initial scene
				} else if (msg.director) {
					// newly added; guests say if they are guests or not
					if (iOS || iPad) {
						// hardware h264 encoder related.
						if (session.pcs[UUID].forceios == true) {
							session.pcs[UUID].guest = true;
						}
					}
					if (session.beepToNotify) {
						playtone(false, "jointone");
						showNotification("A director joined the room", "Trying to join at least");
					}

					session.initialDirectorSync(UUID); // try to sync initial directors

					pokeIframeAPI("director-connected", msg.director, UUID);
				}

				if (session.director) {
					if ("hidedirector" in msg) {
						if (msg.hidedirector == true) {
							session.pcs[UUID].allowAudio = false;
							session.pcs[UUID].allowVideo = false;
							session.pcs[UUID].allowIframe = false;
							session.pcs[UUID].allowWidget = false;
							session.pcs[UUID].whipout = false;
							session.pcs[UUID].allowWebp = false;
							session.pcs[UUID].allowScreenAudio = false;
							session.pcs[UUID].allowScreenVideo = false;
							session.pcs[UUID].allowDrawing = false;
						}
					}
					session.initialPublish(UUID);
				} else if (session.queueType == 3 && !session.director) {
					// &hold (queue3): Defer ALL publishing until activated. See main.js for full docs.
					// Note: Check queueType only (not session.queue) because justResetting sets queue=false
					session.pcs[UUID].needsPublishing = true;
				} else if (session.queueType == 4 && !session.director) {
					// &holdwithvideo (queue4): Only publish to directors/co-directors until activated.
					// This allows director preview while blocking Guest→Guest media flow.
					// Note: Check queueType only (not session.queue) because justResetting sets queue=false
					if (session.directorList.indexOf(UUID) >= 0) {
						session.initialPublish(UUID);
					} else {
						// Non-director viewer - defer until activated
						session.pcs[UUID].needsPublishing = true;
					}
				} else {
					session.initialPublish(UUID);
				}
			}
		}

		session.pcs[UUID].sendChannel.onmessage = e => session.handlePublisherMessage(e, UUID);

		function getSoloVideoHighlightState() {
			try {
				var altElement = document.querySelector('[data-action-type="solo-video"].altpress');
				if (altElement) {
					return { type: "infocus2", target: resolveSoloVideoTarget(altElement) };
				}
				var pressedElement = document.querySelector('[data-action-type="solo-video"].pressed');
				if (pressedElement) {
					return { type: "infocus", target: resolveSoloVideoTarget(pressedElement) };
				}
				var directorToggle = typeof getById === "function" ? getById("highlightDirector") : document.getElementById("highlightDirector");
				if (directorToggle) {
					var directorTarget = resolveSoloVideoTarget(directorToggle);
					if (directorToggle.checked) {
						if (directorToggle.classList && directorToggle.classList.contains("altpress")) {
							return { type: "infocus2", target: directorTarget };
						}
						return { type: "infocus", target: directorTarget };
					}
				}
			} catch (e) {
				errorlog(e);
			}
			return null;
		}

		function resolveSoloVideoTarget(ele) {
			if (!ele) {
				return false;
			}
			try {
				if (ele.dataset && ele.dataset.sid) {
					return ele.dataset.sid;
				}
			} catch (e) { }
			if (ele && ele.id === "highlightDirector" && session && session.streamID) {
				return session.streamID;
			}
			return false;
		}

		session.initialDirectorSync = function (UUID) {
			if (!(session.directorState || session.scene)) {
				return;
			}
			try {
				var data = {};

				if (session.pcs[UUID]) {
					data.directorSettings = getDirectorSettings(session.pcs[UUID].scene);
				}

				log("TRYING TO SYNC WITH SENDING: " + UUID);

				var exists = false;
				if (session.alreadyJoinedMembers) {
					session.alreadyJoinedMembers.forEach(lkl => {
						if (lkl.UUID === UUID) {
							exists = true;
						}
					});
				}
				if (!exists || (session.pcs[UUID] && session.pcs[UUID].coDirector === true)) {
					data.directorState = getDetailedState();
				} else {
					warnlog("this unverified director was already connected; not going to send my director state to them");
				}

				if (session.director) {
					var soloState = getSoloVideoHighlightState();
					if (soloState && session.pcs[UUID]) {
						var targetSid = soloState.target;
						if (targetSid !== false) {
							var layoutState = session.pcs[UUID].layoutState;
							var allowAutoLayout = true;
							try {
								if (typeof isAutoLayoutState === "function") {
									allowAutoLayout = isAutoLayoutState(layoutState);
								} else if (typeof normalizeLayoutStateValue === "function") {
									var normalizedLayout = normalizeLayoutStateValue(layoutState);
									allowAutoLayout = normalizedLayout === false || typeof normalizedLayout === "undefined" || normalizedLayout === null;
								} else {
									allowAutoLayout = !layoutState || layoutState === false;
								}
							} catch (e) {
								errorlog(e);
							}
							if (!session.pcs[UUID].solo && allowAutoLayout) {
								var actionMsg = {};
								actionMsg[soloState.type] = targetSid;
								session.sendMessage(actionMsg, UUID);
							}
						}
					}
				}

				if (Object.keys(data).length) {
					session.sendPeers(data, UUID); // this skips the server */
				}
			} catch (e) { }
		};

		session.provideFileList = function (UUID) {
			log("session.provideFileList");
			if (!session.hostedFiles || !session.hostedFiles.length) {
				// nothing to share
				return;
			}

			var data = {};
			var fileList = [];
			for (var i = 0; i < session.hostedFiles.length; i++) {
				if (session.hostedFiles[i].restricted === false || session.hostedFiles[i].restricted === UUID) {
					fileList.push({
						id: session.hostedFiles[i].id,
						name: session.hostedFiles[i].name,
						size: session.hostedFiles[i].size
					});
				}
			}
			data.fileList = fileList;

			if (UUID in session.pcs) {
				session.sendMessage(data, UUID);
			} else if (UUID in session.rpcs) {
				session.sendRequest(data, UUID);
			}
			log(data);
		};

		session.initialPublish = function (UUID) {
			log("INITIAL PUBLISH START: " + UUID);

			if (UUID in session.pcs) {
				// good.
				session.pcs[UUID].needsPublishing = false;
			} else {
				errorlog("UUID not found in pcs");
				return;
			}

			if (getSenders2(UUID).length) {
				errorlog("PROBLEM, Senders is more than 0: " + getSenders2(UUID).length);
			}

			if (session.pcs[UUID].allowIframe === true) {
				if (session.iframeSrc) {
					var data = {};
					data.iframeSrc = session.iframeSrc;

					if (session.iframeEle && session.iframeEle.sendOnNewConnect) {
						if (session.iframeSrc.startsWith("https://www.youtube.com/")) {
							// TODO ; this needs to be tracked someother way
							data.iframeSrc += "&start=" + parseInt(Math.ceil(session.iframeEle.sendOnNewConnect.ifs.t)) + "";
						}
					}
					session.sendMessage(data, UUID);
				}
			}

			if (session.pcs[UUID].allowWidget === true) {
				if (session.widget && session.director) {
					var data = {};
					data.widgetSrc = session.widget;
					session.sendMessage(data, UUID);
				}
			}

			if (session.pcs[UUID].allowDownloads === true) {
				session.provideFileList(UUID);
			}

			if (session.pcs[UUID].allowResources === true) {
				session.createResourceChannel(UUID);
			}

			let audioOnly = false;
			if (session.chunked && session.canSendChunkedToPeer(session.pcs[UUID])) {
				session.chunkedStream(UUID);
				if (session.pcs[UUID].allowChunked !== 2) {
					return;
				}
				audioOnly = true;
			}

			var stream = session.getLocalStream();
			log("Does Local Stream Source EXIST?");
			log(stream.getTracks());

			if (session.whipoutSettings && session.pcs[UUID].whipout === null && (!session.promptAccess || session.pcs[UUID].playbackAccessApproved === true)) {
				// if true, already connected, and if false, it's disabled.
				var data = {};
				data.whepSettings = session.whipoutSettings;
				if (session.sendMessage(data, UUID)) {
					session.pcs[UUID].whipout = true;
				}
				warnlog(data);
			}

			if (!audioOnly && (session.pcs[UUID].allowScreenVideo || session.pcs[UUID].allowScreenAudio)) {
				createSecondStream2(UUID); // screen share 
			}
			var videoAdded = false;

			if (!audioOnly) {
				stream.getVideoTracks().forEach(async track => {
					try {
						if (session.pcs[UUID].allowVideo === true) {
							if (track.kind == "video") {
								if (session.pcs[UUID].guest === true && session.roombitrate === 0) {
									log("room rate restriction detected. No videos will be published to other guests");
								} else {
									// either not iOS or not a guest
									let sender = session.pcs[UUID].addTrack(track, stream);

									if (sender && session.encodedInsertableStreams) {
										try {
											setupSenderTransform(sender, UUID);
										} catch (e) {
											errorlog(e);
										}
									}

									warnlog("added video track");
									videoAdded = true;
									setTimeout(
										function (uuid) {
											try {
												session.optimizeBitrate(uuid);
											} catch (e) {
												warnlog(e);
											}
										},
										session.rampUpTime,
										UUID
									); // 3 seconds lets us ramp up the quality a bit
									//if (sender.track){
									//	sender.track.onended = tryAgain; //errorlog;  //tryAgain (this breaks the screen-share stop code)
									//}
								}
							}
						}
					} catch (e) {
						session.reportCriticalError("initial-publish-video-track", e);
					}
				});
			}

			if (session.mixMinus) {
				if (session.directorMixMinus) {
					// Director mix-minus: use director-specific mixing
					var mixStream = createDirectorMixMinusForGuest(UUID);
					if (mixStream) {
						stream = mixStream;
						onGuestJoinedMixMinus(UUID); // Initialize state for this guest
					}
				} else {
					stream = mixMinusAudio(UUID); // only works with p2p; no chunked mode.
				}
			}

			if (session.pcs[UUID].allowAudio) {
				stream.getAudioTracks().forEach(track => {
					// where else are tracks added?  Need to add this to that as well as audio.
					try {
						if (track.kind == "audio") {
							session.pcs[UUID].addTrack(track, stream);
							warnlog("added audio track");
						}
					} catch (e) {
						session.reportCriticalError("initial-publish-audio-track", e);
					}
				});

				log("does any audio exist?");
				if (stream.getAudioTracks().length) {
					if (session.director !== false) {
						session.applySoloChat(); // mute streams that should be muted if a director
					}

					//session.applyIsolatedChat(); // we will run this on setLocalDescription instead. ALl the following could probably be moved there.

					log("starting kicker");

					if (session.pcs[UUID].limitAudio === true) {
						warnlog("limiting AudioEncoder");
						setTimeout(session.limitAudioEncoder, 1000, UUID, 32000, 0); // forever pinned to 20kbps (must apply this again some other time)  If stero, this is like 20kbps per channel then, which isn't horrible.
					}
					if (session.pcs[UUID].enhanceAudio === true) {
						setTimeout(session.enhanceAudioEncoder, 1000, UUID);
					}
				}
			}

			if (session.pcs[UUID].degradationPreference) {
				setTimeout(session.degradationPreference, 1000, UUID, session.pcs[UUID].degradationPreference);
			} else if (session.contentHint && SafariVersion) {
				if (session.contentHint == "detail") {
					setTimeout(session.degradationPreference, 1000, UUID, "maintain-resolution");
				} else if (session.contentHint == "motion") {
					setTimeout(session.degradationPreference, 1000, UUID, "maintain-framerate");
				}
			}

			if (iOS || iPad) {
				///////// THIS IS A FIX FOR iOS 15.4.  When a video is loaded (view/push), the bitrate from iOS devices is stuck low, and resolution needs toggle to fix.
				// videoAdded value needs to be deleted from above also
				if (SafariVersion && SafariVersion <= 13) {
					// we won't bother trying to change resolution, since probably not supported.
				} else if (videoAdded) {
					setTimeout(
						function (uuid) {
							session.setScale(uuid, null, true); // 0.95%
						},
						2000,
						UUID
					);
					setTimeout(
						function (uuid) {
							var processed = session.refreshScale(uuid); // checks if scale is set; sets if possible.
							if (!processed) {
								// didn't have anything to apply, so lets manually apply 100% or whatever.
								session.setScale(uuid, 100, true); // 100%
							}
						},
						5000,
						UUID
					);
				}
			} else {
				setTimeout(
					function (uuid) {
						session.refreshScale(uuid); // if I do this too early, it fails on the setParameter. (I probably should queue failed attempts. boo)
					},
					1000,
					UUID
				);
			}
		};

		session.pcs[UUID].oniceconnectionstatechange = function (event) {
			// this
			if (!(UUID in session.pcs)) {
				return;
			}
			try {
				if (this.iceConnectionState === "closed") {
					log("ICE closed?");
				} else if (this.iceConnectionState === "disconnected") {
					///////////// Do not use ICE candidates ; duh.
					log("PCS: ICE Disconnected; wait for retry? pcs");
				} else if (this.iceConnectionState === "failed") {
					log("ICE FAILed. bad?");
				} else if (this.iceConnectionState === "connected") {
					log("iceConnectionState == connected");
				} else {
					log(this.iceConnectionState);
				}
			} catch (e) {
				errorlog(e);
			}
		};

		session.pcs[UUID].onconnectionstatechange = function (event) {
			const expectedPeer = this;
			if (session.pcs[UUID] !== this) {
				return;
			}
			session.observeQosTransport(this);
			switch (this.connectionState) {
				case "connected":
						log("CONNECTEED!");
						clearTimeout(session.pcs[UUID].closeTimeout);
						clearPeerLivenessPing(session.pcs[UUID]);
						if (session.rtpProfile && !this.rtpProfileTimer && !this.rtpProfileBusy) {
							processRtpProfileStats(UUID, this);
						}
						// QoS tracking
						if (session.qosEnabled && session.qosData) {
							session.qosData.connectionSuccesses++;
							// Start periodic QoS stats collection for this publisher connection
							try {
								setTimeout(processPcsQosStats, 500, UUID);
							} catch (e) { }
						}
						if (session.security) {
							if (session.ws.readyState !== 1) {
								// already closed.
								session.ws.close();
								break;
							}
							session.ws.close();
							setTimeout(function () {
								if (session.cleanOutput != true) {
									warnUser(getTranslation("remote-peer-connected"));
								}
							}, 1);
						}
						break;
				case "disconnected":
					log("onconnectionstatechange pcs ice -- disconnected, but not yet closed? ");
					clearTimeout(session.pcs[UUID].closeTimeout);
					// Liveness ping; if no pong within 1500ms, attempt ICE restart (and rotate TURN order if configured)
					try {
						const token = Date.now();
						if (session.pcs[UUID]) { session.pcs[UUID].lastPongToken = undefined; session.pcs[UUID].lastPingToken = token; }
						try { session.sendMessage({ ping: token }, UUID); } catch (e) { warnlog(e); }
						setTimeout(function (uid, tok) {
							try {
								if (session.pcs[uid] !== expectedPeer || expectedPeer.lastPingToken !== tok) { return; }
								if (session.pcs[uid].connectionState !== "disconnected") { return; }
								if (session.pcs[uid].lastPongToken !== tok) {
									try { session.rotateIceServersSimple && session.rotateIceServersSimple(session.pcs[uid]); } catch (e) { warnlog(e); }
									if (session.pcs[uid].restartIce) { try { session.pcs[uid].restartIce(); } catch (e) { warnlog(e); } }
									try { session.createOffer(uid, true); } catch (e) { warnlog(e); }
								}
							} catch (e) { errorlog(e); }
						}, 3000, UUID, token);
					} catch (e) { errorlog(e); }

					session.pcs[UUID].closeTimeout = setTimeout(
						function (uid) {
							if (session.pcs[uid] !== expectedPeer || expectedPeer.connectionState === "connected") return;
							if (uid in session.pcs) {
								warnlog(" --- PC TIMED OUT, but still alive. Killing it. via disconnected state");
								session.closePC(uid);
							} else {
								errorlog(" --- PC TIMED OUT and already deleted. shouldn't happen");
							}
							//log("closing 15");session.closePC(uid);
						},
						// PCS disconnect timeout (platform-specific default)
						((navigator.platform && navigator.platform.toLowerCase().includes('win')) ? 10000 : 5000),
						UUID
					);
					break;
				case "failed":
					warnlog("connection state -> failed; will try ice reconnect or such");
					// QoS tracking
					if (session.qosEnabled && session.qosData) {
						session.qosData.connectionFailures++;
					}
					if (session.pcs[UUID]) {
						session.pcs[UUID].delayIceSend = 0;
						if (session.pcs[UUID].closeTimeout) {
							log("Close timeout cancelled - ice failed instead");
							clearTimeout(session.pcs[UUID].closeTimeout);
						}
						// Restart ICE or re-offer
						if (session.pcs[UUID].restartIce) {
							log("ice restart real");
							session.pcs[UUID].restartIce();
							// QoS tracking
							if (session.qosEnabled && session.qosData) {
								session.qosData.iceRestarts++;
							}
						} else {
							log("fake ice restart faked");
							session.createOffer(UUID, true);
							// QoS tracking
							if (session.qosEnabled && session.qosData) {
								session.qosData.iceRestarts++;
							}
						}
					}
					break;
				case "closed":
						warnlog("pcs RTC CLOSED");
						log("closing 18");
						session.closePC(UUID);
						break;
				default:
						log("rtc state: " + session.pcs[UUID].connectionState);
						clearTimeout(session.pcs[UUID].closeTimeout);
						break;
			}
			};

		session.pcs[UUID].onclose = function (event) {
			warnlog("WebRTC Connection Closed. Clean up. 657");
			log("closing 19");
			session.closePC(UUID);
			//session.pcs[UUID] = null;
			//delete(session.pcs[UUID]);
			//session.applySoloChat();
			//applySceneState();
		};

		session.pcs[UUID].onopen = function sessiononopensession() {
			log("WEBRTC CONNECTION OPEN");
		};
	};

	// A retransmitted answer cannot complete an ICE restart using the old credentials.
	// Keep unchanged answers valid for ordinary renegotiation and require matching SDP origins.
	function isRepeatedAnswerForIceRestart(pc, description) {
		var previous = pc.currentRemoteDescription;
		if (!previous || previous.type !== "answer" || !pc.currentLocalDescription || !pc.pendingLocalDescription) {
			return false;
		}
		var origin = description.sdp.match(/^o=[^\r\n]+/m);
		var previousOrigin = previous.sdp.match(/^o=[^\r\n]+/m);
		if (!origin || !previousOrigin || origin[0] !== previousOrigin[0]) {
			return false;
		}
		function iceByMid(sdp) {
			var sections = sdp.split(/\r?\nm=/);
			var defaults = sections.shift();
			var result = Object.create(null);
			sections.forEach(function (section) {
				var mid = section.match(/^a=mid:([^\r\n]+)/m);
				var media = section.match(/^\S+ +(\d+)/);
				var ufrag = section.match(/^a=ice-ufrag:([^\r\n]+)/m) || defaults.match(/^a=ice-ufrag:([^\r\n]+)/m);
				var pwd = section.match(/^a=ice-pwd:([^\r\n]+)/m) || defaults.match(/^a=ice-pwd:([^\r\n]+)/m);
				if (mid && media && media[1] !== "0" && ufrag && pwd) {
					result[mid[1]] = { ufrag: ufrag[1], pwd: pwd[1] };
				}
			});
			return result;
		}
		var current = iceByMid(pc.currentLocalDescription.sdp);
		var pending = iceByMid(pc.pendingLocalDescription.sdp);
		var remote = iceByMid(previous.sdp);
		var incoming = iceByMid(description.sdp);
		return Object.keys(current).some(function (mid) {
			return pending[mid] && remote[mid] && incoming[mid] &&
				current[mid].ufrag !== pending[mid].ufrag && current[mid].pwd !== pending[mid].pwd &&
				remote[mid].ufrag === incoming[mid].ufrag && remote[mid].pwd === incoming[mid].pwd;
		});
	}

	session.processDescription2 = async function (msg) {
		var UUID = msg.UUID; // just in case I forget.

		if (msg.description.type == "offer") {
			if (await session.setupIncoming(msg) === false) return;
			return session.connectPeer(msg);
		} else {
			//  assumed to be an answer, ie:	if (msg.description.type=="answer"){
			try {
				if (!(msg.UUID in session.pcs)) {
					return Promise.resolve(false);
				}
				const pc = session.pcs[msg.UUID];

				// Reject obsolete answers before they can change this peer's codec or bitrate state.
				if ("session" in msg && msg.session != pc.session) {
					session.bumpReliabilityCounter("answer_skipped_session_mismatch");
					errorlog("Answer SDP does not have a matching session ID");
					return;
				}
				if (msg.description.type === "answer") {
					const signalingState = pc.signalingState || "unknown";
					if (signalingState !== "have-local-offer") {
						session.bumpReliabilityCounter("answer_skipped_invalid_state");
						warnlog("Skipped remote answer: invalid signaling state (" + signalingState + ")");
						return;
					}
					if (isRepeatedAnswerForIceRestart(pc, msg.description)) {
						session.bumpReliabilityCounter("answer_skipped_repeated_restart");
						warnlog("Skipped repeated answer while ICE restart is pending");
						return;
					}
				}

				var maxvideobitrate = session.maxvideobitrate;
			if (!session.noMobileBitrateCap && session.mobile && session.pcs[msg.UUID].guest == true && session.pcs[msg.UUID].forceios == false) {
				// unless explicitly stated, we will assume the lowest quality for this guest.

				var mobileMaxBitrate = session.getMobileGuestBitrateCap();

				if (maxvideobitrate === false || maxvideobitrate > mobileMaxBitrate) {
					maxvideobitrate = mobileMaxBitrate;
				}

				if (iOS || iPad) {
					if (maxvideobitrate !== false) {
						if (session.pcs[msg.UUID].savedBitrate === false) {
							session.pcs[msg.UUID].setBitrate = maxvideobitrate;

							msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, "vp8", session.preferredVideoErrorCorrection); // I won't support vp9, as its too high CPU for guests.
							msg.description.sdp = CodecsHandler.setVideoBitrates(msg.description.sdp, {
								min: parseInt(maxvideobitrate / 10) || 1,
								max: maxvideobitrate
							});
						} else if (session.pcs[msg.UUID].savedBitrate > maxvideobitrate) {
							session.pcs[msg.UUID].setBitrate = maxvideobitrate;
							msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, "vp8", session.preferredVideoErrorCorrection); // I won't support vp9, as its too high CPU for guests.
							msg.description.sdp = CodecsHandler.setVideoBitrates(msg.description.sdp, {
								min: parseInt(maxvideobitrate / 10) || 1,
								max: maxvideobitrate
							});
						}
						maxvideobitrate = false; //this makes it bypass thigns later -- very important.
					}
				}
			} else if (session.pcs[msg.UUID].guest == true) {
				if (maxvideobitrate !== false) {
					if (session.roombitrate !== false) {
						if (session.roombitrate < maxvideobitrate) {
							maxvideobitrate = session.roombitrate;
						}
					}
				} else {
					maxvideobitrate = session.roombitrate;
				}

				if ((iOS || iPad) && session.pcs[msg.UUID].forceios) {
					// account for it.
					session.pcs[msg.UUID].encoder = true;
				}
			} else if (iOS || iPad) {
				// android devices fall over to vp8 on their own;  I might need to handle Nvidia devices though.
				var encoders = 0;
				for (var uid in session.pcs) {
					if (msg.UUID !== uid) {
						if (session.pcs[uid].encoder === true) {
							encoders += 1;
							//if (session.pcs[msg.UUID].stats && ("_hardwareEncoder" in session.pcs[msg.UUID].stats)){ // TOD: set the encoder status vis stats also; keep it more accurate.
						}
					}
				}
				if (encoders >= 3) {
					if (session.pcs[msg.UUID].forceios) {
						session.pcs[msg.UUID].encoder = true;
						if (session.pcs[msg.UUID].preferVideoCodec && session.pcs[msg.UUID].preferVideoCodec === "h264") {
							msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, "h264", session.preferredVideoErrorCorrection);
							log("Trying to set " + session.pcs[msg.UUID].preferVideoCodec + " as preferred codec by viewer via API");
						}
					} else if (session.pcs[msg.UUID].preferVideoCodec && session.pcs[msg.UUID].preferVideoCodec === "vp9") {
						msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, "vp9", session.preferredVideoErrorCorrection);
						log("Trying to set " + session.pcs[msg.UUID].preferVideoCodec + " as preferred codec by viewer via API");
						session.pcs[msg.UUID].encoder = false;
					} else {
						msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, "vp8", session.preferredVideoErrorCorrection); // attempts to avoid the H264 encoder being used for iOS devices.
						log("Setting Codec to vp8");
						session.pcs[msg.UUID].encoder = false;
					}
				} else if (session.pcs[msg.UUID].preferVideoCodec && session.pcs[msg.UUID].preferVideoCodec !== "h264") {
					if (session.pcs[msg.UUID].preferVideoCodec === "vp9" || session.pcs[msg.UUID].preferVideoCodec === "vp8") {
						msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, session.pcs[msg.UUID].preferVideoCodec, session.preferredVideoErrorCorrection);
						log("Trying to set " + session.pcs[msg.UUID].preferVideoCodec + " as preferred codec by viewer via API");
						session.pcs[msg.UUID].encoder = false;
					} else {
						session.pcs[msg.UUID].encoder = true; // has to be at the moment, h264 then.
					}
				} else {
					session.pcs[msg.UUID].encoder = true;
					if (session.pcs[msg.UUID].preferVideoCodec && session.pcs[msg.UUID].preferVideoCodec === "h264") {
						msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, "h264", session.preferredVideoErrorCorrection);
						log("Trying to set " + session.pcs[msg.UUID].preferVideoCodec + " as preferred codec by viewer via API");
					}
				}
			} else if (session.pcs[msg.UUID].preferVideoCodec) {
				msg.description.sdp = CodecsHandler.preferCodec(msg.description.sdp, session.pcs[msg.UUID].preferVideoCodec, session.preferredVideoErrorCorrection);
				log("Trying to set " + session.pcs[msg.UUID].preferVideoCodec + " as preferred codec by viewer via API");
			}

			try {
				if (maxvideobitrate) {
					// if 0 or false, we bypass. We bypass on 0 because there should be no video track Added.
					//Make sure they cannot ask for more than the max allowed bitrate

					var setBitrate = CodecsHandler.getVideoBitrates(msg.description.sdp); // session.pcs[msg.UUID].setBitrate is always false in this case, since maxvideobitrate is false; see above logic.

					log("BITRATE 1: " + setBitrate);

					if (session.pcs[msg.UUID].savedBitrate !== false) {
						if (session.pcs[msg.UUID].savedBitrate < maxvideobitrate) {
							maxvideobitrate = false;
						}
					}

					if (maxvideobitrate === false) {
						session.pcs[msg.UUID].setBitrate = setBitrate;
					} else if (setBitrate !== false && setBitrate > maxvideobitrate) {
						// TODO: Make sense of what is going on here. I forgot why I have it > and not <
						var abset = CodecsHandler.getOpusBitrate(msg.description.sdp) || 0;
						msg.description.sdp = CodecsHandler.setVideoBitrates(msg.description.sdp, {
							min: parseInt(maxvideobitrate / 10) || 1,
							max: parseInt(maxvideobitrate + abset / 1024)
						});
						session.pcs[msg.UUID].setBitrate = maxvideobitrate;
					} else if (setBitrate === false) {
						var abset = CodecsHandler.getOpusBitrate(msg.description.sdp) || 0;
						msg.description.sdp = CodecsHandler.setVideoBitrates(msg.description.sdp, {
							min: parseInt(maxvideobitrate / 10) || 1,
							max: parseInt(maxvideobitrate + abset / 1024)
						});

						if (session.outboundVideoBitrate && session.outboundVideoBitrate > maxvideobitrate) {
							session.pcs[msg.UUID].setBitrate = maxvideobitrate;
						} else if (session.outboundVideoBitrate) {
							session.pcs[msg.UUID].setBitrate = session.outboundVideoBitrate;
						} else {
							session.pcs[msg.UUID].savedBitrate = 2500;
						}
					} else {
						session.pcs[msg.UUID].setBitrate = setBitrate;
					}

				} else if (session.outboundVideoBitrate !== false) {
					var setBitrate = CodecsHandler.getVideoBitrates(msg.description.sdp);
					log("BITRATE 2: " + setBitrate);
					if (setBitrate === false) {
						var abset = CodecsHandler.getOpusBitrate(msg.description.sdp) || 0;
						msg.description.sdp = CodecsHandler.setVideoBitrates(msg.description.sdp, {
							min: parseInt(session.outboundVideoBitrate / 10) || 1,
							max: parseInt(session.outboundVideoBitrate + abset / 1024)
						});
					} else if (session.pcs[msg.UUID].setBitrate === false) {
						session.pcs[msg.UUID].setBitrate = setBitrate;
					}
				} else if (session.pcs[msg.UUID].setBitrate === false) {
					session.pcs[msg.UUID].setBitrate = CodecsHandler.getVideoBitrates(msg.description.sdp);
					log("BITRATE 3: " + session.pcs[msg.UUID].setBitrate);
				}
			} catch (e) {
				warnlog("Answer is a data-channel only SDP");
			}

			if (session.outboundAudioBitrate) {
				msg.description.sdp = CodecsHandler.setOpusAttributes(msg.description.sdp, {
					maxaveragebitrate: session.outboundAudioBitrate * 1024,
					cbr: session.cbr
				});
			}

			/* if (session.pcs[msg.UUID].preferAudioCodec){ // this doubles the check; perhaps a bit needless.
				try{
					if (session.pcs[msg.UUID].preferAudioCodec === "lyra"){
						msg.description.sdp = CodecsHandler.modifyDescLyra(msg.description.sdp);
					} else {
						msg.description.sdp = CodecsHandler.preferAudioCodec(msg.description.sdp, session.pcs[msg.UUID].preferAudioCodec);
					}
					log("Trying to set "+ session.pcs[msg.UUID].preferAudioCodec+" as preferred audio codec by viewer via API (offer)");
				} catch(e){errorlog(e);warnlog("couldn't set preferred audio codec");}
			} */

			if (session.localNetworkOnly) {
				msg.description.sdp = filterSDPLAN(msg.description.sdp);
			}
			if (session.stunOnly) { // or whatever flag you want to use
				msg.description.sdp = filterStunOnly(msg.description.sdp);
			}

			return pc
				.setRemoteDescription(msg.description)
				.then(async function () {
					if (session.pcs[msg.UUID] !== pc) {
						return false;
					}
					try {
						session.drainPendingIce(msg.UUID, "remote");
						if ((session.whipoutSettings || session.whipoutScreenSettings) && !(await session.approvePlaybackAccess(msg.UUID))) return false;
						if (session.pcs[msg.UUID] !== pc || pc.session !== msg.session || pc.signalingState === "closed") return false;
						if (session.whipoutSettings) broadcastWhepSettings("primary");
						if (session.whipoutScreenSettings) broadcastWhepSettings("screen");
					} catch (e) {
						errorlog(e);
					}
				})
				.catch(function (err) {
					try {
						const state = (session.pcs[msg.UUID] && session.pcs[msg.UUID].signalingState) || "unknown";
						if (
							msg.description &&
							msg.description.type === "answer" &&
							err &&
							err.message &&
							err.message.toLowerCase().includes("called in wrong state: stable")
						) {
							session.bumpReliabilityCounter("answer_skipped_invalid_state");
							warnlog("Dropped stale remote answer for " + msg.UUID + " while signaling state was " + state);
							return;
						}
					} catch (e) {
						errorlog(e);
					}
					if (session.pcs[msg.UUID] === pc && pc.signalingState !== "closed") session.queueQosError("remote_answer_failed", err, "webrtc.js", 0, true);
					errorlog(err);
				});
			} catch (e) {
				errorlog(e);
				return Promise.resolve(false);
			}
		}
		return Promise.resolve(false);
	};

	session.processDescription = function (msg) {
		// For the sake of ease, I may just return the StreamID and revisit
		if (session.password && msg.vector) {
			// changed: july 22nd 2021
			return session
				.decryptMessage(msg.description, msg.vector)
				.then(function (description) {
					try {
						msg.description = JSON.parse(description);
						return session.processDescription2(msg);
					} catch (e) {
						errorlog(e);
					}
				})
				.catch(function (error) {
					session.queueQosError("handshake_decryption_failed", error, "webrtc.js", 0, false);
					errorlog("Decryption error:", error);
				});
		} else {
			return session.processDescription2(msg).catch(errorlog);
		}
	};






	session.processIce = function (msg) {
		// LEGACY
		if (session.password && msg.vector) {
			session
				.decryptMessage(msg.candidate, msg.vector)
				.then(function (candidate) {
					try {
						msg.candidate = JSON.parse(candidate);
						session.processIce2(msg);
					} catch (e) {
						errorlog(e);
					}
				})
				.catch(function (error) {
					errorlog("Decryption error:", error);
				});
		} else {
			session.processIce2(msg);
		}
	};

	session.processIce2 = function (msg) {
		// An invalid entry must not abort processing the remaining candidates in a bundle.
		if (msg.candidate !== null && msg.candidate !== undefined && typeof msg.candidate !== "object") {
			warnlog("Ignoring malformed ICE candidate entry");
			return;
		}
		try {
			// filter # 1 (encrypted)
			if (session.icefilter) {
				if (msg.candidate.candidate.indexOf(session.icefilter) === -1) {
					log("dropped candidate due to filter");
					log(msg.candidate);
					return;
				} else {
					log("PASSED");
					log(msg.candidate);
				}
			}
		} catch (e) {
			errorlog(e);
		}

		if (msg.candidate && "candidate" in msg.candidate && msg.candidate.candidate == "") {
			return;
		} // iphones seem to throw empty candidates?

		try {
			if (session.localNetworkOnly) {
				if (!filterIceLAN(msg.candidate)) {
					return;
				}
			}
			if (session.stunOnly) { // or whatever flag you want to use
				if (!filterStunOnly(msg.candidate)) {
					return;
				}
			}
		} catch (e) {
			errorlog(e);
		}

		if (msg.UUID in session.pcs && msg.type == "remote") {
			log("PCS WINS ICE");

			if ("session" in msg && session.pcs[msg.UUID].session != msg.session) {
				warnlog("Ignoring ICE candidate for stale session");
				return;
			}
			session.pcs[msg.UUID]
				.addIceCandidate(msg.candidate)
				.then()
				.catch(function (e) {
					var emsg = e && e.message ? e.message : "";
					if (e && (e.name === "InvalidStateError" ||
							  emsg.indexOf("remote description") !== -1 ||
							  emsg.indexOf("not set") !== -1)) {
						warnlog("ICE candidate arrived before remote description; re-queuing: " + emsg);
						session.queuePendingIce(msg);
						session.bumpReliabilityCounter("ice_requeued_no_remote_desc");
					} else {
						warnlog("Failed to add ICE candidate: " + emsg);
					}
				});
		} else if (msg.UUID in session.rpcs && msg.type == "local") {
			log("RPCS WINS ICE");

			if ("session" in msg && session.rpcs[msg.UUID].session != msg.session) {
				warnlog("Ignoring ICE candidate for stale session");
				return;
			}
			if (session.rpcs[msg.UUID] === null) {
				return;
			}

			session.rpcs[msg.UUID]
				.addIceCandidate(msg.candidate)
				.then()
				.catch(function (e) {
					var emsg = e && e.message ? e.message : "";
					if (e && (e.name === "InvalidStateError" ||
							  emsg.indexOf("remote description") !== -1 ||
							  emsg.indexOf("not set") !== -1)) {
						warnlog("ICE candidate arrived before remote description; re-queuing: " + emsg);
						session.queuePendingIce(msg);
						session.bumpReliabilityCounter("ice_requeued_no_remote_desc");
					} else {
						warnlog("Failed to add ICE candidate: " + emsg);
					}
				});
		} else if (session.queuePendingIce(msg)) {
			// queued while peer object is still being created
			return;
		} else {
			session.bumpReliabilityCounter("ice_dropped_missing_pc");
			warnlog("Dropping ICE candidate with no matching peer: UUID=" + msg.UUID + " type=" + msg.type);
			errorlog("ICE DID NOT FIND A PC OPTION? peer might have left before ICE complete?");
		}
	};

	session.processIceBundle = function (msg) {
		if (session.password && msg.vector) {
			session.decryptMessage(msg.candidates, msg.vector).then(function (candidates) {
				msg.candidates = JSON.parse(candidates); // we stringify it before encoding, so .. yeah.

				for (var i = 0; i < msg.candidates.length; i++) {
					// Each asynchronous ICE retry must retain its own candidate.
					const subMsg = {};
					subMsg.UUID = msg.UUID;
					subMsg.type = msg.type;
					if ("session" in msg) { subMsg.session = msg.session; }
					subMsg.candidate = msg.candidates[i];
					session.processIce2(subMsg);
				}
			});
		} else {
			for (var i = 0; i < msg.candidates.length; i++) {
				const subMsg = {};
				subMsg.UUID = msg.UUID;
				subMsg.type = msg.type;
				if ("session" in msg) { subMsg.session = msg.session; }
				subMsg.candidate = msg.candidates[i];
				session.processIce2(subMsg);
			}
		}
	};

	/* function replaceSsrcAndCleanupSdp(sdp) { // fix for gstreamer (audio only offers)
	  const generateSsrc = () => Math.floor(Math.random() * 0xFFFFFFFF).toString();

	  const lines = sdp.split('\r\n');

	  let inAudioSection = false;
	  let newSsrc = generateSsrc();
	  
	  for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith('m=audio ')) {
		  inAudioSection = true;
		} else if (lines[i].startsWith('m=') && !lines[i].startsWith('m=audio ')) {
		  inAudioSection = false;
		}
		if (inAudioSection && lines[i].startsWith('a=ssrc:')) {
		  lines[i] = lines[i].replace(/a=ssrc:\d+/g, `a=ssrc:${newSsrc}`);
		}
	  }
	  return lines.join('\r\n');
	} */

	session.connectPeer = async function (msg) {
		// someone is SENDING us a video stream

		log(msg);

		if (session.removeOrientationFlag && msg.description && msg.description.sdp && msg.description.sdp.includes("a=extmap:3 urn:3gpp:video-orientation\r\n")) {
			// this might need to be moved to the sender side, if not already?  Keeping it on the viewer side does allow for the native app to work with the viewer though..  both are fine then
			msg.description.sdp = msg.description.sdp.replace("a=extmap:3 urn:3gpp:video-orientation\r\n", "");
			warnlog("removed from SDP: 'a=extmap:3 urn:3gpp:video-orientation\r\n'"); // fix for iPhone devices and rotation.
		}

		if (session.noPLIs) {
			msg.description.sdp = CodecsHandler.disablePLI(msg.description.sdp);
		}

		if (session.noREMB) {
			msg.description.sdp = CodecsHandler.disableREMB(msg.description.sdp);
		}

		if (session.noNacks) {
			log(msg.description.sdp);
			msg.description.sdp = CodecsHandler.disableNACK(msg.description.sdp);
		}

		if (session.localNetworkOnly) {
			msg.description.sdp = filterSDPLAN(msg.description.sdp);
		}
		if (session.stunOnly) { // or whatever flag you want to use
			msg.description.sdp = filterStunOnly(msg.description.sdp);
		}

		// Glare/m-line safety: rollback if not stable and we're applying a new offer
		try {
			if (msg.description && msg.description.type === "offer") {
				const pcr = session.rpcs[msg.UUID];
				if (pcr && pcr.signalingState && pcr.signalingState !== "stable") {
					try { pcr.setLocalDescription({ type: "rollback" }).catch(warnlog); } catch (e) { warnlog(e); }
				}
			}
		} catch (e) { warnlog(e); }

		if (msg.description && msg.description.type === "answer") {
			const rpcSignalingState = (session.rpcs[msg.UUID] && session.rpcs[msg.UUID].signalingState) || "unknown";
			if (rpcSignalingState !== "have-local-offer") {
				session.bumpReliabilityCounter("rpc_answer_skipped_invalid_state");
				warnlog("Skipped RPC answer: invalid signaling state (" + rpcSignalingState + ")");
				return false;
			}
		}

		if (!(msg.UUID in session.rpcs) || !session.rpcs[msg.UUID]) {
			return false;
		}
		const rpc = session.rpcs[msg.UUID];

		if ("screen" in msg) {
			rpc.screenIndexes = msg.screen;
			log("SCREENS");
			log(msg.screen);
		}

		return rpc.setRemoteDescription(msg.description).then(async function () {
				if (session.rpcs[msg.UUID] !== rpc || rpc.signalingState === "closed") {
					return false;
				}
				// description, onSuccess, onError
				try {
					session.drainPendingIce(msg.UUID, "local");
				} catch (e) {
					errorlog(e);
				}

				if (session.rpcs[msg.UUID].remoteDescription.type === "offer") {
					// When receiving an offer/video lets answer it

					// Only answer when in the correct signaling state
					if (session.rpcs[msg.UUID].signalingState !== "have-remote-offer") { return false; }

					return rpc
					.createAnswer()
					.then(function (description) {
						if (session.rpcs[msg.UUID] !== rpc || rpc.signalingState === "closed") {
							return false;
						}
						// creating answer
						log("creating answer");

						if (session.rpcs[msg.UUID].whip) {
							if (session.stereo && session.stereo == 4) {
								// pro audio only when viewing streams
								description.sdp = CodecsHandler.setOpusAttributes(description.sdp, { stereo: 2 }, true);
							} else if (session.stereo && !session.mono && session.stereo != 3) {
								description.sdp = CodecsHandler.setOpusAttributes(description.sdp, { stereo: 1 }, true);
							}
							return rpc.setLocalDescription(description);
						}

						var configs = false;

						if (!session.director && session.stereo == 5) {
							// pro audio only when viewing streams
							configs = {
								stereo: 1,
								maxaveragebitrate: (session.audiobitrate || session.audiobitratePRO) * 1024,
								//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
								cbr: session.cbr,
								useinbandfec: session.noFEC ? 0 : 1,
								maxptime: session.maxptime,
								minptime: session.minptime,
								ptime: session.ptime,
								dtx: session.dtx // "usedtx", if no loud audio, stops sending audio for 400ms. default.
							};
							log("stereo inbound enabled");
						} else if (session.mono && Firefox) {
							// chrome defaults to mono already
							if (session.audiobitrate) {
								configs = {
									stereo: 0,
									maxaveragebitrate: session.audiobitrate * 1024,
									//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
									cbr: session.cbr, // vbr
									useinbandfec: session.noFEC ? 0 : 1,
									maxptime: session.maxptime,
									minptime: session.minptime,
									ptime: session.ptime,
									dtx: session.dtx
								};
							} else {
								configs = {
									stereo: 0,
									//'maxaveragebitrate': session.audiobitrate * 1024,
									//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
									//'cbr': session.cbr,  // vbr
									useinbandfec: session.noFEC ? 0 : 1,
									maxptime: session.maxptime,
									minptime: session.minptime,
									ptime: session.ptime,
									dtx: session.dtx
								};
							}
						} else if (session.stereo == 1 || session.stereo == 2 || session.stereo == 5) {
							// pro audio mode --- stereo INBOUND at HQ.  Guests would be converted to stereo = 3 already
							configs = {
								stereo: 1,
								maxaveragebitrate: (session.audiobitrate || session.audiobitratePRO) * 1024,
								//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
								cbr: session.cbr,
								useinbandfec: session.noFEC ? 0 : 1,
								maxptime: session.maxptime,
								minptime: session.minptime,
								ptime: session.ptime,
								dtx: session.dtx
							};
							log("stereo inbound enabled");
						} else if (session.stereo == 4) {
							// pro audio only when viewing streams
							configs = {
								stereo: 2,
								maxaveragebitrate: (session.audiobitrate || session.audiobitratePRO) * 1024, // 5.1 technically, but quad-channel audio supported this way
								//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
								cbr: session.cbr,
								useinbandfec: session.noFEC ? 0 : 1,
								maxptime: session.maxptime,
								minptime: session.minptime,
								ptime: session.ptime,
								dtx: session.dtx
							};
						} else if (session.audiobitrate) {
							// high bitrate, but no stereo
							configs = {
								// 'stereo': 1,
								maxaveragebitrate: session.audiobitrate * 1024,
								//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
								cbr: session.cbr, // vbr
								useinbandfec: session.noFEC ? 0 : 1,
								maxptime: session.maxptime,
								minptime: session.minptime,
								ptime: session.ptime,
								dtx: session.dtx
							};
						} else if (session.noFEC) {
							configs = {
								// 'stereo': 1,
								//'maxaveragebitrate': session.audiobitrate * 1024,
								//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
								//'cbr': session.cbr,  // vbr
								useinbandfec: 0,
								maxptime: session.maxptime,
								minptime: session.minptime,
								ptime: session.ptime,
								dtx: session.dtx
							};
						} else if (session.dtx) {
							configs = {
								// 'stereo': 1,
								//'maxaveragebitrate': session.audiobitrate * 1024,
								//'maxplaybackrate': (session.maxsamplerate  || 48000 ),
								//'cbr': session.cbr,  // vbr
								//'useinbandfec': 0,
								maxptime: session.maxptime,
								minptime: session.minptime,
								ptime: session.ptime,
								dtx: session.dtx
							};
						}

						// we don't set CBR on its own as no audio bitrate was set, or if it was, cbr would be already set.

						if (session.stereo === 6) {
							if (!configs) {
								configs = { stereo: 1 };
							} else {
								configs.stereo = 1;
							}
						}

						if (configs && window.CodecsHandler) {
							description.sdp = CodecsHandler.setOpusAttributes(description.sdp, configs);
						}

						if (session.audioCodec) {
							try {
								if (session.audioCodec === "lyra") {
									description.sdp = CodecsHandler.modifyDescLyra(description.sdp);
								} else if (session.audioCodec === "pcm") {
									if (session.mono) {
										description.sdp = CodecsHandler.modifyDescPCM(description.sdp, session.sampleRate || 48000, false, session.ptime);
									} else if (session.stereo) {
										description.sdp = CodecsHandler.modifyDescPCM(description.sdp, session.sampleRate || 32000, true, session.ptime);
									} else {
										description.sdp = CodecsHandler.modifyDescPCM(description.sdp, session.sampleRate || 48000, false, session.ptime);
									}
								} else {
									description.sdp = CodecsHandler.preferAudioCodec(description.sdp, session.audioCodec, session.redAudio, session.fecAudio); // opus ideal, but you can try red or whatever
								}
							} catch (e) {
								errorlog(e);
								warnlog("couldn't set preferred audio codec");
							}
						}

						//if (session.stereo===0){
						//	description.sdp = description.sdp.replaceAll("48000/2","48000/1"); // Chrome does not like this. It will barf on me.
						//}

						if (session.codecs && session.codecs.length) {
							// rarely used
							for (var c = session.codecs.length - 1; c >= 0; c--) {
								try {
									description.sdp = CodecsHandler.preferCodec(description.sdp, session.codecs[c], session.videoErrorCorrection);
								} catch (e) {
									errorlog(e);
									break;
								}
							}
						}

						if (session.codec && window.CodecsHandler) {
							description.sdp = CodecsHandler.preferCodec(description.sdp, session.codec, session.videoErrorCorrection); // default
						} // else if (session.broadcast !==false){
						//	description.sdp = CodecsHandler.preferCodec(description.sdp, "h264", session.videoErrorCorrection); // maybe this will use less CPU? -- causes an issue when I use OBS /w NVENc also; driver limited
						//}

						// Only rewrite H264 profile when there's a single video m-line and no active screenshare
						try {
							var multiVideo = false;
							try {
								multiVideo = (description && description.sdp && (description.sdp.match(/^m=video /mg) || []).length > 1) || false;
							} catch (e) { }
							var hasScreens = (session.rpcs[msg.UUID] && session.rpcs[msg.UUID].screenIndexes && session.rpcs[msg.UUID].screenIndexes.length > 0) || false;
							var alreadyApplied = (session.rpcs[msg.UUID] && session.rpcs[msg.UUID].h264ProfileApplied) || false;

							if (session.h264profile && !(multiVideo || hasScreens || alreadyApplied)) {
								log("h264profile being modified");
								description.sdp = description.sdp.replace(/42e01f/gi, session.h264profile); // openH264
								description.sdp = description.sdp.replace(/42001f/gi, session.h264profile); // external encoder
								description.sdp = description.sdp.replace(/420029/gi, session.h264profile); // external encoder
								description.sdp = description.sdp.replace(/42a01e/gi, session.h264profile); // external encoder
								description.sdp = description.sdp.replace(/42a014/gi, session.h264profile); // external encoder
								description.sdp = description.sdp.replace(/42a00b/gi, session.h264profile); // external encoder
								description.sdp = description.sdp.replace(/640c1f/gi, session.h264profile); // will not work
								if (session.rpcs[msg.UUID]) {
									session.rpcs[msg.UUID].h264ProfileApplied = true;
								}
							}
						} catch (e) {
							errorlog(e);
						}

						if (session.noPLIs) {
							description.sdp = CodecsHandler.disablePLI(description.sdp);
						}

						if (session.noREMB) {
							description.sdp = CodecsHandler.disableREMB(description.sdp);
						}

						if (session.noNacks) {
							log(description.sdp);
							description.sdp = CodecsHandler.disableNACK(description.sdp);
						}

						if (session.rpcs[msg.UUID].manualBandwidth) {
							log("bit rate being munged");
							description.sdp = unlockBitrate(description.sdp, session.rpcs[msg.UUID].manualBandwidth);
						} else if (session.bitrate) {
							// works with vp8, not vp9
							log("bit rate being munged");
							description.sdp = unlockBitrate(description.sdp, session.bitrate);
							//session.rpcs[msg.UUID].manualBandwidth = session.bitrate; // Doing this to support Firefox; not sure if its a good idea.
						}

						if (session.localNetworkOnly) {
							description.sdp = filterSDPLAN(description.sdp);
						}
						if (session.stunOnly) { // or whatever flag you want to use
							description.sdp = filterStunOnly(description.sdp);
						}

						log(description);

						return rpc.setLocalDescription(description);
					})
					.then(function providededanswer() {
						if (session.rpcs[msg.UUID] !== rpc || rpc.signalingState === "closed") {
							return false;
						}
						log("providing answer");

						if (session.rpcs[msg.UUID].whip) {
							//if (data.description && data.description.sdp){
							if (session.rpcs[msg.UUID].whipCallback) {
								session.rpcs[msg.UUID].whipCallback();
							}
							//	session.rpcs[msg.UUID].whipCallback = false;
							//}
							return;
						}

						var data = {};
						data.UUID = msg.UUID;
						data.description = filterDescriptionIpv6(rpc.localDescription); // Filter IPv6 if &ipv6=0
						data.session = rpc.session;

						if (session.password && rpc.vector) {
							return session
								.encryptMessage(JSON.stringify(data.description))
								.then(function (enc) {
									if (session.rpcs[msg.UUID] !== rpc || rpc.signalingState === "closed") {
										return false;
									}
									data.description = enc[0];
									data.vector = enc[1];
									//session.sendMsg(data);
									session.anyrequest(data); // rpcs to pcs
									return true;
								})
								.catch(errorlog);
						} else {
							session.anyrequest(data);
							//session.sendMsg(data);
							return true;
						}

						//data = {};
						//data.request = "getkey";
						//data.UUID = msg.UUID;   -- they other party does not need this
						//data.streamID = session.rpcs[msg.UUID].streamID;
						//session.sendMsg(data);
					})
					.catch(function (error) {
						if (session.rpcs[msg.UUID] === rpc && rpc.signalingState !== "closed") session.queueQosError("local_answer_failed", error, "webrtc.js", 0, true);
						errorlog(error);
					});
			} else if (session.rpcs[msg.UUID].remoteDescription.type === "answer") {
				// someone responded to one of our answers; they presumably requested an offerSDP
				errorlog("Someone sent us an ANSWER sdp??");
				return false;
			}
		})
			.catch(function (err) {
				try {
					const rpcState = (session.rpcs[msg.UUID] && session.rpcs[msg.UUID].signalingState) || "unknown";
					if (
						msg.description &&
						msg.description.type === "answer" &&
						err &&
						err.message &&
						err.message.toLowerCase().includes("called in wrong state: stable")
					) {
						session.bumpReliabilityCounter("rpc_answer_skipped_invalid_state");
						warnlog("Dropped stale RPC answer for " + msg.UUID + " while signaling state was " + rpcState);
						return;
					}
					if (session.rpcs[msg.UUID] === rpc && rpc.signalingState !== "closed") session.queueQosError(msg.description.type === "offer" ? "remote_offer_failed" : "remote_answer_failed", err, "webrtc.js", 0, true);
					// A rejected initial offer has no watchdog yet and must not retain an admission slot.
					// WHIP owns its failure cleanup; preserve negotiated peers and replacement generations.
					if (msg.description && msg.description.type === "offer" && session.rpcs[msg.UUID] === rpc && !rpc.whip && !rpc.remoteDescription && !rpc.localDescription) {
						session.closeRPC(msg.UUID);
					}
				} catch (e) {
					errorlog(e);
				}
				errorlog(err);
				return false;
			});
	};

	session.calculateOptimalBufferSize = function (UUID, options = {}) {
		const rpc = session.rpcs[UUID];
		const base = typeof options.base === "number" ? options.base : 200;
		if (!rpc || !rpc.stats) {
			return base;
		}
		if (!(base > 0)) {
			return 0;
		}

		const media = options.media === "audio" ? "audio" : "video";
		const clamp = options.clamp || {};
		const clampMin = typeof clamp.min === "number" ? clamp.min : 0;
		const clampMaxDefault = media === "audio" ? 5000 : 180000;
		const clampMax = typeof clamp.max === "number" ? clamp.max : clampMaxDefault;

		let target = base;
		let previousTarget = base;
		let bufferDelta = base;
		let occupancy = base;
		let rebuffering = false;
		let underflowAge = Infinity;

		const chunkStats = media === "audio" ? rpc.stats.chunked_mode_audio : rpc.stats.chunked_mode_video;
		if (chunkStats) {
			if (typeof chunkStats.buffer_buffer === "number" && Number.isFinite(chunkStats.buffer_buffer)) {
				previousTarget = chunkStats.buffer_buffer;
			}
			if (typeof chunkStats.buffer_delta === "number" && Number.isFinite(chunkStats.buffer_delta)) {
				bufferDelta = chunkStats.buffer_delta;
			}
			if (typeof chunkStats.buffer_level === "number" && Number.isFinite(chunkStats.buffer_level)) {
				occupancy = chunkStats.buffer_level;
			} else {
				const fallbackTarget = typeof chunkStats.buffer_buffer === "number" ? chunkStats.buffer_buffer : base;
				occupancy = Math.max(0, fallbackTarget - bufferDelta);
			}
			rebuffering = !!chunkStats.rebuffering;
			if (chunkStats.last_underflow && Number.isFinite(chunkStats.last_underflow)) {
				underflowAge = Date.now() - chunkStats.last_underflow;
			}
		}

		if (rebuffering) {
			target = Math.max(target, base + Math.max(80, base * 0.25));
		}
		if (underflowAge < 5000) {
			target = Math.max(target, base + Math.max(120, base * 0.4));
		}
		if (bufferDelta <= base * 0.3) {
			const deficit = base - bufferDelta;
			if (deficit > 20) {
				target = Math.max(target, base + Math.max(60, deficit * 0.6));
			}
		}
		const occupancyFloor = base * 0.3;
		if (occupancy <= occupancyFloor) {
			const shortfall = occupancyFloor - occupancy;
			if (shortfall > 0) {
				target = Math.max(target, base + Math.max(60, shortfall * 1.2));
			}
		}

		const peerStats = rpc.stats["Peer-to-Peer_Connection"] || rpc.stats["Peer_Connection"];
		if (session.includeRTT && peerStats && peerStats.Round_Trip_Time_ms) {
			const rtt = parseFloat(peerStats.Round_Trip_Time_ms);
			if (Number.isFinite(rtt) && rtt > 0) {
				target = Math.max(target, base + rtt / 2);
			}
		}

		if (Number.isFinite(rpc.stats.packetLoss) && rpc.stats.packetLoss > 0.03) {
			target = Math.max(target, base + rpc.stats.packetLoss * 1000);
		}
		if (Number.isFinite(rpc.stats.jitter) && rpc.stats.jitter > 0.02) {
			target = Math.max(target, base + rpc.stats.jitter * 4000);
		}

		if (!rebuffering && underflowAge > 5000 && previousTarget > base) {
			const decayStep = Math.max(20, base * 0.1);
			const lowered = Math.max(base, previousTarget - decayStep);
			target = Math.max(target, lowered);
		}

		target = Math.max(clampMin, Math.min(target, clampMax));
		return Math.round(target);
	};

	// Keep capture origins, reconnect headers, and clock replies in one domain.
	// Re-anchoring a channel to Date.now() after an OS clock correction shifts
	// playback relative to frames that were encoded using the original clock.
	var chunkedClockAnchor = null;
	session.getChunkedTimestamp = function () {
		if (typeof performance === "undefined" || !performance.now) {
			return Date.now();
		}
		var monotonic = performance.now();
		if (!chunkedClockAnchor) {
			chunkedClockAnchor = { wall: Date.now(), monotonic: monotonic };
		}
		return chunkedClockAnchor.wall + monotonic - chunkedClockAnchor.monotonic;
	};

	session.restartChunkedMode = async function (config) {
		errorlog("Chunked mode failed. Attempting to restart...");

		// Wait a short time before attempting restart
		await new Promise(resolve => setTimeout(resolve, 2000));

		try {
			session.chunkedVideoEnabled = null; // Reset the flag
			await session.webCodec(config); // Attempt to restart
			log("Chunked mode restarted successfully");
		} catch (error) {
			errorlog("Failed to restart chunked mode:", error);
			// Notify the user about the failure
			if (!session.cleanOutput) {
				warnUser("Video encoding failed. Please try refreshing your browser.");
			}
		}
	};

	session.getLocalStream = function () {
		// just helps me stay organized, with logic consolidated; it gets damn confusing otherwise, especially as memory fades.
		if (session.videoElement && session.videoElement.srcObject) {
			return session.videoElement.srcObject;
		} else if (session.videoElement && session.videoElement.src && session.streamSrc) {
			return session.streamSrc;
		} else {
			log("checkBasicStreamsExist");
			checkBasicStreamsExist();
			return session.videoElement.srcObject;
		}
	};

	var baddy = 0;
	var counterWebCodec = 0;
	session.webCodec = async function (config = null) {
		if (session.chunkedVideoEnabled !== null) {
			return;
		} else {
			session.chunkedVideoEnabled = false;
		}

		if (!config && session.stats.Chunked_video) {
			config = session.stats.Chunked_video;
		}

		let frame_counter = 0;
		var track = session.getLocalStream().getVideoTracks();
		if (!track || !track.length) {
			warnlog("NO TRACKS");
			session.chunkedVideoEnabled = null;
			return;
		}
		track = track[0];

		var stop = false;
		var lastTimestamp = -1;
		var firstTimestamp = -1;
		var frameReader = null;
		var encoder;
		var res;
		var promise = new Promise((resolve, reject) => {
			res = resolve;
		});
		promise.resolve = res;

		let readerClosed = false;
		const cleanupReader = () => {
			if (readerClosed) {
				return;
			}
			readerClosed = true;
			try {
				if (frameReader) {
					frameReader.releaseLock();
				}
			} catch (err) { }
		};

		const encodedOutputProcessor = {
			output: async frame => {
				if (!session.chunkedRecorder || !session.chunkedRecorder.sendChunks) {
					return;
				} else if (frame.constructor.name == "EncodedVideoChunk") {
					if (firstTimestamp == -1) {
						firstTimestamp = frame.timestamp;
						session.stats.Chunked_video.realTime = session.getChunkedTimestamp();
						promise.resolve();
					}
					let frameData = new Uint8Array(frame.byteLength);
					frame.copyTo(frameData);
					if (typeof session.chunkedRecorder.enqueueFrame === "function") {
						session.chunkedRecorder.enqueueFrame({
							media: "video",
							frameType: frame.type,
							timestamp: frame.timestamp - firstTimestamp,
							data: frameData
						});
					} else {
						session.chunksQueue.push([frame.timestamp - firstTimestamp, frame.type]);
						session.chunksQueue.push(frameData);
					}
					if (session.chunkIframe) {
						pokeIframeAPI("chunked-outbound", { type: frame.type, ts: frame.timestamp - firstTimestamp });
					}
					try {
						await session.chunkedRecorder.sendChunks("video");
					} catch (e) {
						errorlog(e);
					}
				}
			},
			error: e => {
				errorlog(e); // encoding error
				stop = true;
				session.chunkedVideoEnabled = null;
				if (session.chunkedRecorder) {
					session.chunkedRecorder.needKeyFrame = true;
				}
				try {
					if (frameReader) {
						frameReader.cancel().catch(() => { });
					}
				} catch (err) { }
				cleanupReader();
				try {
					if (encoder && encoder.state !== "closed") {
						encoder.close();
					}
				} catch (err) { }
				session.restartChunkedMode(config);
			}
		};

		var useWorkerProcessor = typeof MediaStreamTrackProcessor !== "function";
		if (useWorkerProcessor) {
			var workerSupport = await session.ensureChunkedWorkerSupport();
			if (!workerSupport || !workerSupport.mediaStreamTrackProcessor || !workerSupport.videoEncoder) {
				session.chunkedVideoEnabled = null;
				throw new Error("This browser cannot process chunked video tracks in a worker");
			}
			var workerEncoder = session.createChunkedWorkerEncoder("video", track, config, {
				output: encodedOutputProcessor.output,
				error: encodedOutputProcessor.error,
				started: function (timestamp) {
					if (firstTimestamp == -1) {
						firstTimestamp = timestamp;
						session.stats.Chunked_video.realTime = session.getChunkedTimestamp();
						promise.resolve();
					}
				}
			});
			encoder = workerEncoder.encoder;
			encoder.config = config;
			session.stats.Chunked_video = config;
			session.chunkedRecorder.videoEncoder = encoder;
			session.chunkedVideoEnabled = true;
			return promise;
		}

		var prc = new MediaStreamTrackProcessor(track);
		var frameStream = prc.readable;
		frameReader = frameStream.getReader();

		counterWebCodec += 1;
		frameReader.counterWebCodec = counterWebCodec;

		encoder = new VideoEncoder(encodedOutputProcessor);
		encoder.config = config;
		encoder.configure(config);
		session.stats.Chunked_video = config;

		session.chunkedRecorder.videoEncoder = encoder;

		function consumeAdaptiveVideoFrameDrop(insertKeyframe) {
			const recorder = session.chunkedRecorder;
			const adaptation = recorder && recorder.adaptation;
			if (insertKeyframe || !adaptation || !(adaptation.mode === "framerate" || adaptation.mode === "hybrid") || adaptation.frameDropBudget < 1) {
				return false;
			}
			adaptation.frameDropBudget = Math.max(0, adaptation.frameDropBudget - 1);
			adaptation.droppedFrames = (adaptation.droppedFrames || 0) + 1;
			session.stats.chunkedDroppedFrames = adaptation.droppedFrames;
			return true;
		}

		var startupOriginWallMs = 0;
		var startupOriginMonotonicMs = 0;
		var startupOriginSamples = 0;
		frameReader.read().then(function processFrame({ done, value }) {
			if (done || stop) {
				// await encoder.flush();
				try {
					encoder.close();
				} catch (err) { }
				if (value) {
					value.close();
				}
				warnlog("frameReader.read().then(function");
				cleanupReader();
				return;
			} else if (encoder.state == "closed") {
				if (value) {
					value.close();
				}
				warnlog(" else if (encoder.state == 'closed'");
				cleanupReader();
				return;
			}

			if (firstTimestamp == -1) {
				firstTimestamp = value.timestamp;
				startupOriginWallMs = session.getChunkedTimestamp();
				startupOriginMonotonicMs = performance.now();
				session.stats.Chunked_video.realTime = startupOriginWallMs;
				promise.resolve();
			} else if (startupOriginSamples++ < 60) {
				// The first queued capture can predate encoder startup. Refine its
				// wall-clock origin from fresh captures instead of retaining that lag.
				// Only move earlier during startup; later congestion must not add delay.
				var captureElapsedMs = (value.timestamp - firstTimestamp) / 1000;
				var originCandidateMs = startupOriginWallMs + performance.now() - startupOriginMonotonicMs - captureElapsedMs;
				if (captureElapsedMs >= 0 && Number.isFinite(originCandidateMs)
					&& originCandidateMs < session.stats.Chunked_video.realTime - 10) {
					session.stats.Chunked_video.realTime = Math.round(originCandidateMs);
					for (var timingUUID in session.chunkedTransferChannels) {
						var timingChannel = session.chunkedTransferChannels[timingUUID];
						if (!timingChannel || timingChannel.readyState !== "open") {
							continue;
						}
						try {
							timingChannel.send(JSON.stringify({ type: "chunkedtiming", realTimeVideo: session.stats.Chunked_video.realTime }));
						} catch (timingError) {
							errorlog(timingError);
						}
					}
				}
			}

			if (lastTimestamp == value.timestamp) {
				value.timestamp += 1;
				warnlog("Timestamp duplicated");
			}

			if (!stop) {
				lastTimestamp = value.timestamp;
				frame_counter++;
				let insert_keyframe = false;
				if (session.chunkedRecorder.needKeyFrame) {
					const forceKeyFrame = session.chunkedRecorder.adaptation && session.chunkedRecorder.adaptation.forceKeyFrame;
					insert_keyframe = forceKeyFrame || frame_counter >= 60; // key every ~ 2 seconds at most
					if (insert_keyframe) {
						frame_counter = 0;
						session.chunkedRecorder.needKeyFrame = false;
						if (session.chunkedRecorder.adaptation) {
							session.chunkedRecorder.adaptation.forceKeyFrame = false;
						}
						warnlog("Keyframe inserted");
					}
				}

				if (!consumeAdaptiveVideoFrameDrop(insert_keyframe)) {
					try {
						encoder.encode(value, { keyFrame: insert_keyframe });
					} catch (e) {
						errorlog(e);
					}
				}
			}
			value.close();
			frameReader.read().then(processFrame);
		});

		session.chunkedVideoEnabled = true;
		return promise;
	};

	session.webCodecAudio = async function (config) {
		if (session.chunkedAudioEnabled !== null) {
			return;
		} else {
			session.chunkedAudioEnabled = false;
		}

		if (!config && session.stats.Chunked_audio) {
			config = session.stats.Chunked_audio;
		}

		var stream = session.getLocalStream();
		var track = stream.getAudioTracks();

		if (!track || !track.length) {
			session.chunkedAudioEnabled = null;
			return;
		}

		track = track[0];

		var settings = track.getSettings();
		if (config.numberOfChannels > settings.channelCount) {
			config.numberOfChannels = settings.channelCount;
			config.channels = settings.channelCount;
		}

		if (config.sampleRate != settings.sampleRate) {
			// not sure about this, as you can't change things then, but w/e
			try {
				stream = outboundAudioPipeline(); // I should probably do this everytime, regardless, but Firefox might not like it. Doesn't add enough value is sample rate matches already
			} catch (e) {
				errorlog(e);
			}
		}

		var stop = false;
		var lastTimestamp = -1;
		var firstTimestamp = -1;
		var frameReader = null;
		var encoder;
		var res;
		var promise = new Promise((resolve, reject) => {
			res = resolve;
		});
		promise.resolve = res;

		function reportFirstAudioTimestamp(timestamp) {
			if (firstTimestamp != -1) {
				return false;
			}
			firstTimestamp = timestamp;
			session.stats.Chunked_audio.realTime = session.getChunkedTimestamp();
			promise.resolve();
			for (var UUID in session.chunkedTransferChannels) {
				var channel = session.chunkedTransferChannels[UUID];
				if (!channel || channel.readyState !== "open") {
					continue;
				}
				try {
					channel.send(JSON.stringify({
						type: "chunkedconfig",
						configAudio: session.chunkedRecorder && session.chunkedRecorder.configAudio,
						realTimeAudio: session.stats.Chunked_audio.realTime
					}));
				} catch (error) {
					errorlog(error);
				}
			}
			return true;
		}

		const encodedAudioOutputProcessor = {
			output: async frame => {
				if (!session.chunkedRecorder || !session.chunkedRecorder.sendChunks) {
					return;
				} else if (frame.constructor.name == "EncodedAudioChunk") {
					reportFirstAudioTimestamp(frame.timestamp);
					let frameData = new Uint8Array(frame.byteLength);
					frame.copyTo(frameData);
					if (typeof session.chunkedRecorder.enqueueFrame === "function") {
						session.chunkedRecorder.enqueueFrame({
							media: "audio",
							frameType: "audio",
							timestamp: frame.timestamp - firstTimestamp,
							data: frameData
						});
					} else {
						session.chunksQueue.push([frame.timestamp - firstTimestamp, "audio"]);
						session.chunksQueue.push(frameData);
					}
					if (session.chunkIframe) {
						pokeIframeAPI("chunked-outbound", { type: "audio", ts: frame.timestamp - firstTimestamp });
					}

					try {
						await session.chunkedRecorder.sendChunks("audio");
					} catch (e) {
						errorlog(e);
						if (!session.chunkedRecorder) {
							//	encoder.close();
						}
					}
				}
			},
			error: e => {
				errorlog(e);
			}
		};

		session.stats.Chunked_audio = {};
		session.stats.Chunked_audio.codec = config.codec;
		session.stats.Chunked_audio.numberOfChannels = config.numberOfChannels;
		session.stats.Chunked_audio.sampleRate = config.sampleRate; // not a true sample rate?
		session.stats.Chunked_audio.bitrate = config.tuning ? config.tuning.bitrate : config.bitrate;

		var encoderTrack = stream.getAudioTracks()[0];
		var useWorkerProcessor = typeof MediaStreamTrackProcessor !== "function";
		if (useWorkerProcessor) {
			if (typeof AudioEncoder !== "function" || typeof AudioData !== "function") {
				session.chunkedAudioEnabled = null;
				throw new Error("This browser cannot encode AudioData for chunked audio");
			}
			var nativeAudioEncoder = new AudioEncoder(encodedAudioOutputProcessor);
			var audioDataSource = await session.createChunkedAudioDataSource(stream, config, function (audioData) {
				try {
					reportFirstAudioTimestamp(audioData.timestamp);
					if (encoder.state === "configured") {
						nativeAudioEncoder.encode(audioData);
					}
				} catch (error) {
					encodedAudioOutputProcessor.error(error);
				} finally {
					try {
						audioData.close();
					} catch (closeError) { }
				}
			}, encodedAudioOutputProcessor.error);
			if (audioDataSource.channelCount && config.numberOfChannels !== audioDataSource.channelCount) {
				config.numberOfChannels = audioDataSource.channelCount;
				config.channels = audioDataSource.channelCount;
			}
			if (audioDataSource.sampleRate) {
				config.sampleRate = audioDataSource.sampleRate;
			}
			nativeAudioEncoder.configure(config);
			encoder = {
				state: "configured",
				config: config,
				audioDataSource: audioDataSource,
				configure: function (nextConfig) {
					if (encoder.state === "closed") {
						return;
					}
					encoder.config = nextConfig;
					nativeAudioEncoder.configure(nextConfig);
				},
				close: function () {
					if (encoder.state === "closed") {
						return;
					}
					encoder.state = "closed";
					audioDataSource.close();
					try {
						if (nativeAudioEncoder.state !== "closed") {
							nativeAudioEncoder.close();
						}
					} catch (error) { }
				}
			};
			session.stats.Chunked_audio.numberOfChannels = config.numberOfChannels;
			session.stats.Chunked_audio.sampleRate = config.sampleRate;
			session.chunkedRecorder.configAudio = config;
			session.chunkedRecorder.audioEncoder = encoder;
			session.chunkedAudioEnabled = true;
			audioDataSource.start().catch(function (error) {
				encodedAudioOutputProcessor.error(error);
			});
			return promise;
		}

		var prc = new MediaStreamTrackProcessor(encoderTrack);
		var frameStream = prc.readable;
		frameReader = frameStream.getReader();
		encoder = new AudioEncoder(encodedAudioOutputProcessor);

		//config.sampleRate = 48000*config.numberOfChannels; // I'm just going to hard code this to 48000, since i don't know what the bleep is going on.
		encoder.config = config;
		encoder.configure(config);

		frameReader.read().then(function processFrameAudio({ done, value }) {
			if (done || stop) {
				// await encoder.flush();
				encoder.close();
				if (value) {
					value.close();
				}
				session.chunkedAudioEnabled = null;
				return;
			} else if (encoder.state == "closed") {
				if (value) {
					value.close();
				}
				session.chunkedAudioEnabled = null;
				return;
			}
			try {
				if (firstTimestamp == -1) {
					firstTimestamp = value.timestamp;
					session.stats.Chunked_audio.realTime = session.getChunkedTimestamp();
					promise.resolve();
				}
				if (lastTimestamp == value.timestamp) {
					value.timestamp += 1;
				}
				if (!stop) {
					lastTimestamp = value.timestamp;
					try {
						encoder.encode(value);
					} catch (e) {
						errorlog(e);
					}
				}

				value.close();
				frameReader.read().then(processFrameAudio);
			} catch (e) {
				errorlog(e);
				errorlog(value);
				errorlog(done);
			}
		});
		session.chunkedAudioEnabled = true;
		return promise;
	};

	session.getPCM = function (audioStream, config = {}) {
		// this code is deprecated in browsers, but so much easier than worklets..
		warnlog("PCM STARTED");
		const audioContext = new window.AudioContext({ sampleRate: config.sampleRate || 48000 }); // pcm with 44.1kHz ; cd quality?
		// creates an audio node from the microphone incoming stream
		const audioInput = audioContext.createMediaStreamSource(audioStream); // I dont think session.audioCtx is the greatest choice

		const bufferSize = 2048;
		const recorder = (audioContext.createScriptProcessor || audioContext.createJavaScriptNode).call(audioContext, bufferSize, 1, 1);
		recorder.onaudioprocess = async function (event) {
			var frameData = new Uint8Array(event.inputBuffer.getChannelData(0).buffer);
			session.chunksQueue.push([0, "pcm"]);
			session.chunksQueue.push(frameData);

			try {
				await session.chunkedRecorder.sendChunks("pcm");
			} catch (e) {
				errorlog(e);
				if (!session.chunkedRecorder) {
					encoder.close();
				}
			}
		};

		audioInput.connect(recorder);

		recorder.connect(audioContext.destination);

		session.stats.Chunked_audio = {};
		session.chunkedAudioEnabled = true;
		return recorder;
	};

	const INDEXED_CHUNK_HEADER_BYTES = 20;
	const INDEXED_CHUNK_MAGIC = [86, 68, 73, 68, 88, 48, 48, 49]; // VDIDX001

	function createIndexedChunkPayload(frameId, chunkIndex, parity, payload) {
		if (!(payload instanceof Uint8Array)) {
			payload = new Uint8Array(payload);
		}
		const framed = new Uint8Array(INDEXED_CHUNK_HEADER_BYTES + payload.byteLength);
		for (let i = 0; i < INDEXED_CHUNK_MAGIC.length; i++) {
			framed[i] = INDEXED_CHUNK_MAGIC[i];
		}
		framed[8] = parity ? 1 : 0;
		const view = new DataView(framed.buffer);
		view.setUint32(12, frameId >>> 0, false);
		view.setUint32(16, chunkIndex >>> 0, false);
		framed.set(payload, INDEXED_CHUNK_HEADER_BYTES);
		return framed;
	}

	function parseIndexedChunkPayload(payload) {
		if (!(payload instanceof Uint8Array) || payload.byteLength < INDEXED_CHUNK_HEADER_BYTES) {
			return null;
		}
		for (let i = 0; i < INDEXED_CHUNK_MAGIC.length; i++) {
			if (payload[i] !== INDEXED_CHUNK_MAGIC[i]) {
				return null;
			}
		}
		const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
		return {
			frameId: view.getUint32(12, false),
			chunkIndex: view.getUint32(16, false),
			parity: !!(payload[8] & 1),
			data: payload.subarray(INDEXED_CHUNK_HEADER_BYTES)
		};
	}

	function configureChunkedReliabilityRecorder() {
		if (!session.chunkedRecorder) {
			return false;
		}
		if (session.chunkedRecorder.reliabilityConfigured) {
			return !!(session.chunkedRecorder.reliability && session.chunkedRecorder.reliability.enabled);
		}

		const fallbackChunkSize = Number.isFinite(session.chunkchunksize) ? session.chunkchunksize : parseInt(session.chunkchunksize) || 16384;
		const resolvedChunkSize = Math.max(2048, Math.min(65536, fallbackChunkSize));
		const configuredFec = Number.isFinite(session.chunkfec) ? session.chunkfec : parseInt(session.chunkfec) || 0;
		const reliableFec = configuredFec >= 2 ? configuredFec : 0;
		const nackEnabled = !!session.chunknack;
		const hasReliability = nackEnabled || reliableFec >= 2;
		if (!hasReliability) {
			return false;
		}

		const retryWindow = Number.isFinite(session.chunkretry) ? session.chunkretry : parseInt(session.chunkretry) || 0;
		const cacheWindow = Number.isFinite(session.chunkcache) ? session.chunkcache : parseInt(session.chunkcache) || 0;
		const baseSendingBuffer = Number.isFinite(session.sendingBuffer) ? session.sendingBuffer : 500;
		const receiverBufferBudget = Math.max(parseInt(session.chunkbuffer) || 0, parseInt(session.chunkbufferceil) || 0) + (parseInt(session.chunkjitterslack) || 0);
		const requestedCacheMs = Math.max(6000, retryWindow || 0, baseSendingBuffer * 6, receiverBufferBudget);
		const maxCacheMs = cacheWindow || Math.min(30000, requestedCacheMs);
		const MAX_CACHE_BYTES = 67108864; // 64MB upper bound for resend cache

		session.chunkedRecorder.reliabilityConfigured = true;
		session.chunkedRecorder.reliability = {
			enabled: hasReliability,
			chunkSize: resolvedChunkSize,
			fecRate: reliableFec,
			nack: nackEnabled,
			indexed: !!session.chunkindex,
			cache: new Map(),
			cacheOrder: [],
			cacheBytes: 0,
			maxCacheMs,
			maxCacheBytes: MAX_CACHE_BYTES,
			nextFrameId: (Math.random() * 2147483647) | 0,
			stats: { fecParityBlocks: 0, retransmits: 0 }
		};

		session.chunkedRecorder.ensureReliabilityFrameId = function () {
			const reliability = session.chunkedRecorder.reliability;
			reliability.nextFrameId = (reliability.nextFrameId + 1) >>> 0;
			if (reliability.nextFrameId > 4294967294) {
				reliability.nextFrameId = 1;
			}
			return reliability.nextFrameId;
		};

		session.chunkedRecorder.pruneReliabilityCache = function () {
			const reliability = session.chunkedRecorder.reliability;
			if (!reliability.enabled) {
				return;
			}
			const now = Date.now();
			while (reliability.cacheOrder.length) {
				const frameKey = reliability.cacheOrder[0];
				const cached = reliability.cache.get(frameKey);
				if (!cached) {
					reliability.cacheOrder.shift();
					continue;
				}
				const age = now - cached.createdAt;
				if (reliability.cacheBytes > reliability.maxCacheBytes || age > reliability.maxCacheMs) {
					reliability.cache.delete(frameKey);
					reliability.cacheOrder.shift();
					reliability.cacheBytes = Math.max(0, reliability.cacheBytes - cached.totalBytes);
				} else {
					break;
				}
			}
		};

		session.chunkedRecorder.storeReliabilityEntry = function (entry) {
			const reliability = session.chunkedRecorder.reliability;
			if (!reliability.enabled) {
				return;
			}
			reliability.cache.set(entry.frameId, entry);
			reliability.cacheOrder.push(entry.frameId);
			reliability.cacheBytes += entry.totalBytes;
			session.chunkedRecorder.pruneReliabilityCache();
			session.ensureReliabilityStats();
			session.stats.chunkedFecParity = reliability.stats.fecParityBlocks;
		};

		session.chunkedRecorder.enqueueFrame = function ({ media, frameType, timestamp, data }) {
			if (!(data instanceof Uint8Array)) {
				return;
			}
			const reliability = session.chunkedRecorder.reliability;
			const chunkSize = Math.max(1, Math.min(262144, reliability.chunkSize || data.byteLength));
			const frameId = session.chunkedRecorder.ensureReliabilityFrameId();
			const dataChunks = [];
			const descriptors = [];
			let offset = 0;
			let index = 0;
			while (offset < data.byteLength) {
				const end = Math.min(data.byteLength, offset + Math.max(1, chunkSize));
				const slice = data.subarray(offset, end);
				dataChunks.push(slice);
				descriptors.push({ index, size: slice.byteLength, group: reliability.fecRate >= 2 ? Math.floor(index / reliability.fecRate) : 0 });
				offset = end;
				index += 1;
			}
			if (!dataChunks.length) {
				dataChunks.push(new Uint8Array(0));
				descriptors.push({ index: 0, size: 0, group: 0 });
			}

			const parityChunks = [];
			const parityDescriptors = [];
			if (reliability.enabled && reliability.fecRate >= 2) {
				for (let start = 0; start < dataChunks.length; start += reliability.fecRate) {
					const group = dataChunks.slice(start, start + reliability.fecRate);
					if (!group.length) {
						continue;
					}
					const paritySize = group.reduce((max, chunk) => Math.max(max, chunk.byteLength), 0);
					const parityBuffer = new Uint8Array(paritySize);
					if (paritySize) {
						for (const chunk of group) {
							for (let i = 0; i < paritySize; i++) {
								const value = i < chunk.byteLength ? chunk[i] : 0;
								parityBuffer[i] ^= value;
							}
						}
					}
					parityChunks.push(parityBuffer);
					parityDescriptors.push({ group: Math.floor(start / reliability.fecRate), groupStart: start, groupSize: group.length, size: paritySize });
				}
				reliability.stats.fecParityBlocks += parityChunks.length;
			}

			const metaExtra = {
				version: 1,
				frameId,
				media,
				frameType,
				totalChunks: dataChunks.length,
				parityChunks: parityChunks.length,
				chunkSize,
				fecRate: reliability.fecRate,
				nack: reliability.nack,
				indexed: !!reliability.indexed,
				dataBytes: data.byteLength,
				descriptors,
				parityDescriptors
			};

			const metadataEntry = [timestamp, frameType, metaExtra];
			session.chunksQueue.push(metadataEntry);
			for (let chunkIndex = 0; chunkIndex < dataChunks.length; chunkIndex++) {
				const chunk = dataChunks[chunkIndex];
				session.chunksQueue.push(reliability.indexed ? createIndexedChunkPayload(frameId, chunkIndex, false, chunk) : chunk);
			}
			for (let parityIndex = 0; parityIndex < parityChunks.length; parityIndex++) {
				const parity = parityChunks[parityIndex];
				session.chunksQueue.push(reliability.indexed ? createIndexedChunkPayload(frameId, parityIndex, true, parity) : parity);
			}

			session.chunkedRecorder.storeReliabilityEntry({
				frameId,
				timestamp,
				media,
				frameType,
				dataChunks,
				parityChunks,
				parityDescriptors,
				createdAt: Date.now(),
				totalBytes: data.byteLength + parityChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
			});
		};

		session.chunkedRecorder.handleNack = function (uuid, request) {
			const reliability = session.chunkedRecorder.reliability;
			if (!reliability || !reliability.enabled) {
				return;
			}
			if (!request || typeof request.frameId === "undefined") {
				return;
			}
			const frameId = request.frameId >>> 0;
			const channel = session.chunkedTransferChannels[uuid];
			if (!channel || channel.readyState !== "open") {
				return;
			}
			const cached = reliability.cache.get(frameId);
			if (!cached) {
				return;
			}
			const isParity = !!request.parity;
			let chunkIndex = Number.isFinite(request.chunkIndex) ? parseInt(request.chunkIndex) : -1;
			let parityIndex = Number.isFinite(request.parityIndex) ? parseInt(request.parityIndex) : -1;
			let payload = null;
			let parityDescriptor = null;
			if (isParity) {
				if (parityIndex < 0) {
					parityIndex = Math.max(0, chunkIndex);
				}
				payload = cached.parityChunks[parityIndex];
				parityDescriptor = cached.parityDescriptors[parityIndex] || null;
			} else {
				payload = cached.dataChunks[chunkIndex];
			}
			if (!payload) {
				return;
			}
			const metaExtra = {
				version: 1,
				frameId: cached.frameId,
				media: cached.media,
				frameType: cached.frameType,
				totalChunks: cached.dataChunks.length,
				parityChunks: cached.parityChunks.length,
				chunkSize: reliability.chunkSize,
				fecRate: reliability.fecRate,
				nack: reliability.nack,
				indexed: !!reliability.indexed,
				resend: true,
				parity: isParity,
				chunkIndex: isParity ? parityIndex : chunkIndex,
				group: isParity && parityDescriptor ? parityDescriptor.group : (reliability.fecRate >= 2 ? Math.floor(Math.max(chunkIndex, 0) / reliability.fecRate) : 0),
				groupSize: isParity && parityDescriptor ? parityDescriptor.groupSize : (reliability.fecRate >= 2 ? Math.min(reliability.fecRate, cached.dataChunks.length - Math.floor(Math.max(chunkIndex, 0) / reliability.fecRate) * reliability.fecRate) : cached.dataChunks.length)
			};
			try {
				const resendMetadata = JSON.stringify([cached.timestamp, cached.frameType, metaExtra, 0]);
				const resendPayload = reliability.indexed ? createIndexedChunkPayload(cached.frameId, isParity ? parityIndex : chunkIndex, isParity, payload) : payload;
				channel.send(resendMetadata);
				channel.send(resendPayload);
				reliability.stats.retransmits += 1;
				session.ensureReliabilityStats();
				session.stats.chunkedResends = (session.stats.chunkedResends || 0) + 1;
				session.stats.chunkedNacksHandled = (session.stats.chunkedNacksHandled || 0) + 1;
			} catch (err) {
				errorlog(err);
			}
		};

		return true;
	}

	session.retransmitChunkedStream = async function (updatedDeets = false, upstreamChannel = false) {
		//var session.chunkedTransferChannels = {};
		//var session.chunkedRecorder = false;
		//var session.chunksQueue = [];

		//session.chunksQueue.push([frame.timestamp-firstTimestamp, "audio"]);
		//session.chunksQueue.push(frameData);
		//session.chunkedRecorder.sendChunks("audio");
		//session.chunkedRecorder.sendChunks("video");

		// frame.timestamp-firstTimestamp

		if (!session.chunkedRecorder) {
			warnlog("RE TRANSMISSIONS STARTED");

			var sendTimeout = null;
			session.chunkedRecorder = {};

			const fallbackChunkSize = Number.isFinite(session.chunkchunksize) ? session.chunkchunksize : parseInt(session.chunkchunksize) || 16384;
			const resolvedChunkSize = Math.max(2048, Math.min(65536, fallbackChunkSize));
			const configuredFec = Number.isFinite(session.chunkfec) ? session.chunkfec : parseInt(session.chunkfec) || 0;
			const reliableFec = configuredFec >= 2 ? configuredFec : 0;
			const nackEnabled = !!session.chunknack;
			const hasReliability = nackEnabled || reliableFec >= 2;
			const retryWindow = Number.isFinite(session.chunkretry) ? session.chunkretry : parseInt(session.chunkretry) || 0;
			const cacheWindow = Number.isFinite(session.chunkcache) ? session.chunkcache : parseInt(session.chunkcache) || 0;
			const baseSendingBuffer = Number.isFinite(session.sendingBuffer) ? session.sendingBuffer : 500;
			const receiverBufferBudget = Math.max(parseInt(session.chunkbuffer) || 0, parseInt(session.chunkbufferceil) || 0) + (parseInt(session.chunkjitterslack) || 0);
			const requestedCacheMs = Math.max(6000, retryWindow || 0, baseSendingBuffer * 6, receiverBufferBudget);
			const maxCacheMs = cacheWindow || Math.min(30000, requestedCacheMs);
			const MAX_CACHE_BYTES = 67108864; // 64MB upper bound for resend cache

			session.chunkedRecorder.reliability = {
				enabled: hasReliability,
				chunkSize: resolvedChunkSize,
				fecRate: reliableFec,
				nack: nackEnabled,
				indexed: !!session.chunkindex,
				cache: new Map(),
				cacheOrder: [],
				cacheBytes: 0,
				maxCacheMs,
				maxCacheBytes: MAX_CACHE_BYTES,
				nextFrameId: (Math.random() * 2147483647) | 0,
				stats: { fecParityBlocks: 0, retransmits: 0 }
			};

			session.chunkedRecorder.ensureReliabilityFrameId = function () {
				const reliability = session.chunkedRecorder.reliability;
				reliability.nextFrameId = (reliability.nextFrameId + 1) >>> 0;
				if (reliability.nextFrameId > 4294967294) {
					reliability.nextFrameId = 1;
				}
				return reliability.nextFrameId;
			};

			session.chunkedRecorder.pruneReliabilityCache = function () {
				const reliability = session.chunkedRecorder.reliability;
				if (!reliability.enabled) {
					return;
				}
				const now = Date.now();
				while (reliability.cacheOrder.length) {
					const frameKey = reliability.cacheOrder[0];
					const cached = reliability.cache.get(frameKey);
					if (!cached) {
						reliability.cacheOrder.shift();
						continue;
					}
					const age = now - cached.createdAt;
					if (reliability.cacheBytes > reliability.maxCacheBytes || age > reliability.maxCacheMs) {
						reliability.cache.delete(frameKey);
						reliability.cacheOrder.shift();
						reliability.cacheBytes = Math.max(0, reliability.cacheBytes - cached.totalBytes);
					} else {
						break;
					}
				}
			};

			session.chunkedRecorder.storeReliabilityEntry = function (entry) {
				const reliability = session.chunkedRecorder.reliability;
				if (!reliability.enabled) {
					return;
				}
				reliability.cache.set(entry.frameId, entry);
				reliability.cacheOrder.push(entry.frameId);
				reliability.cacheBytes += entry.totalBytes;
				session.chunkedRecorder.pruneReliabilityCache();
				session.ensureReliabilityStats();
				session.stats.chunkedFecParity = reliability.stats.fecParityBlocks;
			};

			session.chunkedRecorder.enqueueFrame = function ({ media, frameType, timestamp, data }) {
				if (!(data instanceof Uint8Array)) {
					return;
				}
				const reliability = session.chunkedRecorder.reliability;
				const chunkSize = Math.max(1, Math.min(262144, reliability.chunkSize || data.byteLength));
				const frameId = session.chunkedRecorder.ensureReliabilityFrameId();
				const dataChunks = [];
				const descriptors = [];
				let offset = 0;
				let index = 0;
				while (offset < data.byteLength) {
					const end = Math.min(data.byteLength, offset + Math.max(1, chunkSize));
					const slice = data.subarray(offset, end);
					dataChunks.push(slice);
					descriptors.push({ index, size: slice.byteLength, group: reliability.fecRate >= 2 ? Math.floor(index / reliability.fecRate) : 0 });
					offset = end;
					index += 1;
				}
				if (!dataChunks.length) {
					dataChunks.push(new Uint8Array(0));
					descriptors.push({ index: 0, size: 0, group: 0 });
				}

				const parityChunks = [];
				const parityDescriptors = [];
				if (reliability.enabled && reliability.fecRate >= 2) {
					for (let start = 0; start < dataChunks.length; start += reliability.fecRate) {
						const group = dataChunks.slice(start, start + reliability.fecRate);
						if (!group.length) {
							continue;
						}
						const paritySize = group.reduce((max, chunk) => Math.max(max, chunk.byteLength), 0);
						const parityBuffer = new Uint8Array(paritySize);
						if (paritySize) {
							for (const chunk of group) {
								for (let i = 0; i < paritySize; i++) {
									const value = i < chunk.byteLength ? chunk[i] : 0;
									parityBuffer[i] ^= value;
								}
							}
						}
						parityChunks.push(parityBuffer);
						parityDescriptors.push({ group: Math.floor(start / reliability.fecRate), groupStart: start, groupSize: group.length, size: paritySize });
					}
					reliability.stats.fecParityBlocks += parityChunks.length;
				}

				const metaExtra = {
					version: 1,
					frameId,
					media,
					frameType,
					totalChunks: dataChunks.length,
					parityChunks: parityChunks.length,
					chunkSize,
					fecRate: reliability.fecRate,
					nack: reliability.nack,
					indexed: !!reliability.indexed,
					dataBytes: data.byteLength,
					descriptors,
					parityDescriptors
				};

				const metadataEntry = [timestamp, frameType, metaExtra];
				session.chunksQueue.push(metadataEntry);
				for (let chunkIndex = 0; chunkIndex < dataChunks.length; chunkIndex++) {
					const chunk = dataChunks[chunkIndex];
					session.chunksQueue.push(reliability.indexed ? createIndexedChunkPayload(frameId, chunkIndex, false, chunk) : chunk);
				}
				for (let parityIndex = 0; parityIndex < parityChunks.length; parityIndex++) {
					const parity = parityChunks[parityIndex];
					session.chunksQueue.push(reliability.indexed ? createIndexedChunkPayload(frameId, parityIndex, true, parity) : parity);
				}

				session.chunkedRecorder.storeReliabilityEntry({
					frameId,
					timestamp,
					media,
					frameType,
					dataChunks,
					parityChunks,
					parityDescriptors,
					createdAt: Date.now(),
					totalBytes: data.byteLength + parityChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
				});
			};

			session.chunkedRecorder.handleNack = function (uuid, request) {
				const reliability = session.chunkedRecorder.reliability;
				if (!request || typeof request.frameId === "undefined") {
					return;
				}
				const frameId = request.frameId >>> 0;
				const channel = session.chunkedTransferChannels[uuid];
				if (!channel || channel.readyState !== "open") {
					return;
				}
				const cached = reliability && reliability.enabled ? reliability.cache.get(frameId) : null;
				if (!cached) {
					const upstreamChannel = session.chunkedRecorder.upstreamChannel;
					if (upstreamChannel && upstreamChannel.readyState === "open") {
						try {
							upstreamChannel.send(JSON.stringify(request));
							session.stats.chunkedNacksForwarded = (session.stats.chunkedNacksForwarded || 0) + 1;
						} catch (err) {
							errorlog(err);
						}
					}
					return;
				}
				const isParity = !!request.parity;
				let chunkIndex = Number.isFinite(request.chunkIndex) ? parseInt(request.chunkIndex) : -1;
				let parityIndex = Number.isFinite(request.parityIndex) ? parseInt(request.parityIndex) : -1;
				let payload = null;
				let parityDescriptor = null;
				if (isParity) {
					if (parityIndex < 0) {
						parityIndex = Math.max(0, chunkIndex);
					}
					payload = cached.parityChunks[parityIndex];
					parityDescriptor = cached.parityDescriptors[parityIndex] || null;
				} else {
					payload = cached.dataChunks[chunkIndex];
				}
				if (!payload) {
					return;
				}
				const descriptors = cached.parityDescriptors || [];
				const metaExtra = {
					version: 1,
					frameId: cached.frameId,
					media: cached.media,
					frameType: cached.frameType,
					totalChunks: cached.dataChunks.length,
					parityChunks: cached.parityChunks.length,
					chunkSize: reliability.chunkSize,
					fecRate: reliability.fecRate,
					nack: reliability.nack,
					indexed: !!reliability.indexed,
					resend: true,
					parity: isParity,
					chunkIndex: isParity ? parityIndex : chunkIndex,
					group: isParity && parityDescriptor ? parityDescriptor.group : (reliability.fecRate >= 2 ? Math.floor(Math.max(chunkIndex, 0) / reliability.fecRate) : 0),
					groupSize: isParity && parityDescriptor ? parityDescriptor.groupSize : (reliability.fecRate >= 2 ? Math.min(reliability.fecRate, cached.dataChunks.length - Math.floor(Math.max(chunkIndex, 0) / reliability.fecRate) * reliability.fecRate) : cached.dataChunks.length)
				};
				try {
					const resendMetadata = JSON.stringify([cached.timestamp, cached.frameType, metaExtra, 0]);
					const resendPayload = reliability.indexed ? createIndexedChunkPayload(cached.frameId, isParity ? parityIndex : chunkIndex, isParity, payload) : payload;
					channel.send(resendMetadata);
					channel.send(resendPayload);
					reliability.stats.retransmits += 1;
					session.ensureReliabilityStats();
					session.stats.chunkedResends = (session.stats.chunkedResends || 0) + 1;
					session.stats.chunkedNacksHandled = (session.stats.chunkedNacksHandled || 0) + 1;
				} catch (err) {
					errorlog(err);
				}
			};

			session.chunkedDetails = updatedDeets || false;
			if (session.chunkedDetails) {
				session.chunkedRecorder.upstreamChannel = upstreamChannel;
			}

			session.chunkedRecorder.sendChunks = async function (mtype = "null") {
				// null probably means unknown, since we are forwarding and not bothering to check. I should check I guess though? especially for keyframes so I don't send data if not yet ready. I could apply this code elsewhere?
				if (sendTimeout) {
					return;
				}
				sendTimeout = true;
				try {
				var mediaType = mtype;

				const viewerHealthMap = session.chunkedRecorder.viewerHealth = session.chunkedRecorder.viewerHealth || {};
				for (const vId in viewerHealthMap) {
					if (!session.chunkedTransferChannels[vId] || !session.pcs[vId]) {
						const staleHealth = viewerHealthMap[vId];
						if (staleHealth && staleHealth.stallRecoveryTimer) {
							clearTimeout(staleHealth.stallRecoveryTimer);
							staleHealth.stallRecoveryTimer = null;
						}
						delete viewerHealthMap[vId];
					}
				}
				const maxBufferByPriority = { 0: 0, 1: 0, 2: 0 };
				let maxBufferSize = 0;
				var reliableQueue = session.chunkedRecorder && session.chunkedRecorder.reliability && session.chunkedRecorder.reliability.enabled;
				const RELIABLE_RELIEF_PAUSES = 4;
				const RELIABLE_RELIEF_HIGH_PRIORITY_PAUSES = 8;

				function getViewerPriority(pcsEntry) {
					if (!pcsEntry) {
						return 2;
					}
					if (pcsEntry.scene !== false && pcsEntry.scene !== undefined && pcsEntry.scene !== null) {
						return 0;
					}
					if (pcsEntry.sceneDisplay !== null && pcsEntry.sceneDisplay !== undefined && pcsEntry.sceneDisplay !== false) {
						return 0;
					}
					if (pcsEntry.guest === true || pcsEntry.pseudoguest === true) {
						return 2;
					}
					return 1;
				}

				function getPriorityWatermark(priority) {
					var staticLimit;
					switch (priority) {
						case 0:
							staticLimit = 1572864; // ~1.5MB for scenes/layouts
							break;
						case 1:
							staticLimit = 1048576; // ~1MB for standard viewers
							break;
						default:
							staticLimit = 786432; // ~768KB for guests/low priority
							break;
					}
					var rateKbps = parseInt(session.stats && session.stats.adjustBitrate) || parseInt(session.chunkbitrate) || parseInt(session.chunked) || 900;
					var senderWindowMs = parseInt(session.sendingBuffer) || 500;
					// Scale reliable backpressure to chunkedbuffer's sender window, but keep the old byte caps.
					var bytesForWindow = Math.max(0, (rateKbps * 1000 / 8) * (senderWindowMs / 1000));
					var multiplier = priority === 0 ? 4 : (priority === 1 ? 3 : 2);
					var minWater = priority === 0 ? 393216 : (priority === 1 ? 262144 : 196608);
					return Math.max(minWater, Math.min(staticLimit, bytesForWindow * multiplier));
				}

				function ensureViewerHealth(uuid, priority) {
					if (!viewerHealthMap[uuid]) {
						viewerHealthMap[uuid] = { priority: priority, skipped: 0, sent: 0, buffered: 0, stalled: false, consecutiveHigh: 0 };
					}
					viewerHealthMap[uuid].priority = priority;
					return viewerHealthMap[uuid];
				}

				function getReliableReliefThreshold(priority) {
					return priority === 0 ? RELIABLE_RELIEF_HIGH_PRIORITY_PAUSES : RELIABLE_RELIEF_PAUSES;
				}

				function markReliableViewerSkipped(channel, health) {
					health.skipped = (health.skipped || 0) + 1;
					health.reliableSkipped = (health.reliableSkipped || 0) + 1;
					health.reliableRelieved = true;
					health.stalled = true;
					if (channel) {
						channel.keyframeSent = false;
					}
					session.chunkedRecorder.needKeyFrame = true;
					const upstreamChannel = session.chunkedRecorder.upstreamChannel;
					if (upstreamChannel && upstreamChannel.readyState === "open") {
						try {
							upstreamChannel.send(JSON.stringify({ kf: true }));
						} catch (err) {
							errorlog(err);
						}
					}
					session.stats.chunkedReliableSkipped = (session.stats.chunkedReliableSkipped || 0) + 1;
					session.stats.chunkedReliableRelieved = (session.stats.chunkedReliableRelieved || 0) + 1;
				}

				function isReliableViewerRelieved(uuid) {
					if (!reliableQueue || !viewerHealthMap[uuid] || !viewerHealthMap[uuid].reliableRelieved) {
						return false;
					}
					var channel = session.chunkedTransferChannels[uuid];
					var pcsEntry = session.pcs[uuid];
					if (!channel || !pcsEntry || channel.readyState !== "open") {
						return true;
					}
					var priority = getViewerPriority(pcsEntry);
					var highWater = getPriorityWatermark(priority);
					var recoveryWater = Math.max(65536, Math.min(524288, highWater * 0.5));
					var bufferedAmount = channel.bufferedAmount || 0;
					if (bufferedAmount > recoveryWater) {
						return true;
					}

					var health = viewerHealthMap[uuid];
					health.buffered = bufferedAmount;
					health.consecutiveHigh = 0;
					health.reliablePaused = false;
					health.reliableRelieved = false;
					health.stalled = false;
					if (health.stallRecoveryTimer) {
						clearTimeout(health.stallRecoveryTimer);
						health.stallRecoveryTimer = null;
					}
					if (!pcsEntry.stats) {
						pcsEntry.stats = {};
					}
					pcsEntry.stats.bufferedAmount = bufferedAmount;
					channel.keyframeSent = false;
					session.chunkedRecorder.needKeyFrame = true;
					var upstreamChannel = session.chunkedRecorder.upstreamChannel;
					if (upstreamChannel && upstreamChannel.readyState === "open") {
						try {
							upstreamChannel.send(JSON.stringify({ kf: true }));
						} catch (err) {
							errorlog(err);
						}
					}
					return false;
				}

				function mediaAllowedForChunkedViewer(pcsEntry, type) {
					if (!pcsEntry) {
						return false;
					}
					if ((type == "key" || type == "delta" || type == "video") && !pcsEntry.allowVideo) {
						return false;
					}
					if ((type == "audio" || type == "pcm") && (!pcsEntry.allowAudio || (pcsEntry.allowChunked == 2))) {
						return false;
					}
					return true;
				}

				function pauseReliableQueueIfNeeded(type) {
					if (!reliableQueue) {
						return false;
					}
					for (var uuid in session.chunkedTransferChannels) {
						var channel = session.chunkedTransferChannels[uuid];
						var pcsEntry = session.pcs[uuid];
						if (!channel || !pcsEntry || channel.readyState !== "open" || !mediaAllowedForChunkedViewer(pcsEntry, type)) {
							continue;
						}
						if (!pcsEntry.stats) {
							pcsEntry.stats = {};
						}
						var priority = getViewerPriority(pcsEntry);
						var health = ensureViewerHealth(uuid, priority);
						if (isReliableViewerRelieved(uuid)) {
							continue;
						}
						var highWater = getPriorityWatermark(priority);
						var bufferedAmount = channel.bufferedAmount || 0;
						pcsEntry.stats.bufferedAmount = bufferedAmount;
						if (bufferedAmount > highWater) {
							health.buffered = bufferedAmount;
							health.consecutiveHigh = (health.consecutiveHigh || 0) + 1;
							health.reliablePaused = true;
							health.paused = (health.paused || 0) + 1;
							if (session.stats) {
								session.stats.chunkedReliablePaused = (session.stats.chunkedReliablePaused || 0) + 1;
							}
							if (health.consecutiveHigh >= getReliableReliefThreshold(priority)) {
								markReliableViewerSkipped(channel, health);
								continue;
							}
							return true;
						}
					}
					return false;
				}

				function sendToViewer(uuid, payload, options = {}) {
					var channel = session.chunkedTransferChannels[uuid];
					var pcsEntry = session.pcs[uuid];
					if (!channel || !pcsEntry || channel.readyState !== "open") {
						return false;
					}
					var isMetadata = options.metadata === true;
					if (!pcsEntry.stats) {
						pcsEntry.stats = {};
					}
					var priority = getViewerPriority(pcsEntry);
					var health = ensureViewerHealth(uuid, priority);
					if (!channel.keyframeSent) {
						channel.keyframeSent = false;
					}
					if (!channel.audioHeaderSent) {
						channel.audioHeaderSent = false;
					}
					if (!channel.detailsSent) {
						channel.detailsSent = false;
					}

					if (mediaType === "delta" && !channel.keyframeSent) {
						warnlog("Waiting for keyframe / header before sending delta / raw video data");
						if (session.chunkedRecorder) {
							session.chunkedRecorder.needKeyFrame = true;
						}
						return false;
					}
					if (!isMetadata && (mediaType === "key" || mediaType === "delta" || mediaType === "video") && !channel.keyframeSent) {
						warnlog("Waiting for keyframe / header before sending delta / raw video data");
						if (session.chunkedRecorder) {
							session.chunkedRecorder.needKeyFrame = true;
						}
						return false;
					}
					if (!isMetadata && (mediaType === "audio" || mediaType === "pcm") && !channel.audioHeaderSent) {
						warnlog("Waiting for audio header before sending raw audio data");
						return false;
					}

					if (!channel.detailsSent) {
						if (session.chunkedDetails) {
							try {
								var tmpdetails = { ...session.chunkedDetails };
								tmpdetails.timestamp = Date.now();
								channel.send(JSON.stringify(tmpdetails));
								channel.detailsSent = true;
							} catch (err) {
								health.sendErrors = (health.sendErrors || 0) + 1;
								health.stalled = true;
								session.chunkedRecorder.needKeyFrame = true;
								return false;
							}
						} else {
							channel.detailsSent = true;
						}
					}
					var bufferedAmount = channel.bufferedAmount || 0;
					if (bufferedAmount > maxBufferSize) {
						maxBufferSize = bufferedAmount;
					}
					if (bufferedAmount > maxBufferByPriority[priority]) {
						maxBufferByPriority[priority] = bufferedAmount;
					}
					pcsEntry.stats.bufferedAmount = bufferedAmount;

					var reliabilityEnabled = session.chunkedRecorder && session.chunkedRecorder.reliability && session.chunkedRecorder.reliability.enabled;
					var canSkip = !reliabilityEnabled && (mediaType === "video" || mediaType === "delta");
					var highWater = getPriorityWatermark(priority);
					if (priority === 0) {
						if (bufferedAmount > highWater * 1.5) {
							health.highPriorityPressure = (health.highPriorityPressure || 0) + 1;
						} else {
							health.highPriorityPressure = 0;
						}
					}

					if (reliabilityEnabled && bufferedAmount > highWater) {
						health.buffered = bufferedAmount;
						health.consecutiveHigh = (health.consecutiveHigh || 0) + 1;
						health.reliablePaused = true;
						health.paused = (health.paused || 0) + 1;
						if (session.stats) {
							session.stats.chunkedReliablePaused = (session.stats.chunkedReliablePaused || 0) + 1;
						}
						return false;
					}

					if (canSkip && priority > 0 && bufferedAmount > highWater) {
						health.skipped = (health.skipped || 0) + 1;
						health.consecutiveHigh = (health.consecutiveHigh || 0) + 1;
						health.buffered = bufferedAmount;
						if (health.consecutiveHigh >= 4) {
							health.stalled = true;
							session.chunkedRecorder.needKeyFrame = true;
							if (!health.stallRecoveryTimer) {
								health.stallRecoveryTimer = setTimeout(function () {
									health.stallRecoveryTimer = null;
									const viewerHealthMap = session.chunkedRecorder ? session.chunkedRecorder.viewerHealth : null;
									const channel = session.chunkedTransferChannels ? session.chunkedTransferChannels[uuid] : null;
									const pcsEntry = session.pcs ? session.pcs[uuid] : null;
									if (!viewerHealthMap || viewerHealthMap[uuid] !== health || !channel || !pcsEntry || channel.readyState !== "open") {
										return;
									}
									health.stalled = false;
									health.consecutiveHigh = 0;
									if (session.chunkedRecorder) {
										session.chunkedRecorder.needKeyFrame = true;
									}
									warnlog("Chunked stall auto-recovery fired for relay viewer");
								}, 5000);
							}
						}
						return false;
					}

					try {
						channel.send(payload);
					} catch (err) {
						health.sendErrors = (health.sendErrors || 0) + 1;
						health.stalled = true;
						session.chunkedRecorder.needKeyFrame = true;
						return false;
					}

					if (isMetadata) {
						if (mediaType == "key" || mediaType == "video") {
							channel.keyframeSent = true;
						} else if (mediaType == "audio" || mediaType == "pcm") {
							channel.audioHeaderSent = true;
						}
					}

					bufferedAmount = channel.bufferedAmount || 0;
					if (bufferedAmount > maxBufferSize) {
						maxBufferSize = bufferedAmount;
					}
					if (bufferedAmount > maxBufferByPriority[priority]) {
						maxBufferByPriority[priority] = bufferedAmount;
					}
					pcsEntry.stats.bufferedAmount = bufferedAmount;
					health.buffered = bufferedAmount;
					health.sent = (health.sent || 0) + 1;
					health.lastSend = Date.now();
					health.consecutiveHigh = Math.max(0, (health.consecutiveHigh || 0) - 1);
					health.reliablePaused = false;
					health.reliableRelieved = false;
					health.stalled = false;
					if (health.stallRecoveryTimer) {
						clearTimeout(health.stallRecoveryTimer);
						health.stallRecoveryTimer = null;
					}
					return true;
				}


				while (session.chunksQueue.length) {
					if (!Object.keys(session.chunkedTransferChannels).length) {
						// no connections, so lets close things.
						session.chunksQueue = [];
						sendTimeout = null;
						session.stats.chunkedInQueue = 0;
						return;
					}
					session.stats.chunkedInQueue = session.chunksQueue.length;
					maxBufferSize = 0;
					maxBufferByPriority[0] = 0;
					maxBufferByPriority[1] = 0;
					maxBufferByPriority[2] = 0;
					var buffer = session.chunksQueue.shift();
					if (Array.isArray(buffer)) {
						mediaType = buffer[1];
						if (pauseReliableQueueIfNeeded(mediaType)) {
							session.chunksQueue.unshift(buffer);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						const payloadArray = buffer.slice();
						payloadArray.push(session.chunksQueue.length);
						var tmp = JSON.stringify(payloadArray);
						for (var uuid in session.chunkedTransferChannels) {
							if (!session.chunkedTransferChannels[uuid]) {
								continue;
							}
							if (isReliableViewerRelieved(uuid)) {
								continue;
							}

							if ((mediaType == "key" || mediaType == "delta" || mediaType == "video") && !session.pcs[uuid].allowVideo) {
								continue; // do not send video
							}
							if ((mediaType == "audio" || mediaType == "pcm") && !session.pcs[uuid].allowAudio) {
								continue; // do not send video
							}

							if (!session.chunkedTransferChannels[uuid].keyframeSent && mediaType == "delta") {
								warnlog("Waiting for keyframe / header before sending delta / raw video data");
								continue;
							}

							//session.chunkedTransferChannels[uuid].timeOffset = null;

							try {
								if (session.chunkedTransferChannels[uuid].readyState === "open") {
									if (!session.chunkedTransferChannels[uuid].detailsSent) {
										if (session.chunkedDetails) {
											var tmpdetails = { ...session.chunkedDetails };
											tmpdetails.timestamp = Date.now();
											session.chunkedTransferChannels[uuid].send(JSON.stringify(tmpdetails));
											session.chunkedTransferChannels[uuid].detailsSent = true;
										} else {
											continue;
										}
									}

									session.chunkedTransferChannels[uuid].send(tmp);

									if (mediaType == "key" || mediaType == "video") {
										session.chunkedTransferChannels[uuid].keyframeSent = true;
									} else if (mediaType == "audio" || mediaType == "pcm") {
										session.chunkedTransferChannels[uuid].audioHeaderSent = true;
									}

									session.pcs[uuid].stats.bufferedAmount = session.chunkedTransferChannels[uuid].bufferedAmount;
									if (maxBufferSize < session.pcs[uuid].stats.bufferedAmount) {
										maxBufferSize = session.pcs[uuid].stats.bufferedAmount;
									}
								}
							} catch (e) { }
						}
					} else if (buffer.byteLength > 262144) {
						if (pauseReliableQueueIfNeeded(mediaType)) {
							session.chunksQueue.unshift(buffer);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						for (var uuid in session.chunkedTransferChannels) {
							if (!session.chunkedTransferChannels[uuid]) {
								continue;
							}
							if (isReliableViewerRelieved(uuid)) {
								continue;
							}

							if ((mediaType == "key" || mediaType == "delta" || mediaType == "video") && !session.pcs[uuid].allowVideo) {
								continue; // do not send video
							}
							if ((mediaType == "audio" || mediaType == "pcm") && !session.pcs[uuid].allowAudio) {
								continue; // do not send video
							}

							if ((mediaType == "key" || mediaType == "delta" || mediaType == "video") && !session.chunkedTransferChannels[uuid].keyframeSent) {
								warnlog("Waiting for keyframe / header before sending delta / raw video data");
								continue; // we won't send any video until kickstarted with a video header / keyframe
							} else if (!session.chunkedTransferChannels[uuid].audioHeaderSent && (mediaType == "audio" || mediaType == "pcm")) {
								warnlog("Waiting for audio header before sending raw audio data");
								continue;
							}

							try {
								if (session.chunkedTransferChannels[uuid].readyState === "open") {
									if (!session.chunkedTransferChannels[uuid].detailsSent) {
										if (session.chunkedDetails) {
											var tmpdetails = { ...session.chunkedDetails };
											tmpdetails.timestamp = Date.now(); // I need to offset this to match the sender's
											session.chunkedTransferChannels[uuid].send(JSON.stringify(tmpdetails));
											session.chunkedTransferChannels[uuid].detailsSent = true;
										} else {
											continue;
										}
									}

									session.chunkedTransferChannels[uuid].send(buffer.slice(0, 262144));

									session.pcs[uuid].stats.bufferedAmount = session.chunkedTransferChannels[uuid].bufferedAmount;
									if (maxBufferSize < session.pcs[uuid].stats.bufferedAmount) {
										maxBufferSize = session.pcs[uuid].stats.bufferedAmount;
									}
								}
							} catch (e) { }
						}
						session.chunksQueue.unshift(buffer.slice(262144));
					} else {
						if (pauseReliableQueueIfNeeded(mediaType)) {
							session.chunksQueue.unshift(buffer);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						for (var uuid in session.chunkedTransferChannels) {
							if (!session.chunkedTransferChannels[uuid]) {
								continue;
							}
							if (isReliableViewerRelieved(uuid)) {
								continue;
							}

							if ((mediaType == "key" || mediaType == "delta" || mediaType == "video") && !session.pcs[uuid].allowVideo) {
								continue; // do not send video
							}
							if ((mediaType == "audio" || mediaType == "pcm") && !session.pcs[uuid].allowAudio) {
								continue; // do not send video
							}

							try {
								if (session.chunkedTransferChannels[uuid].readyState === "open") {
									if (!session.chunkedTransferChannels[uuid].detailsSent) {
										if (session.chunkedDetails) {
											var tmpdetails = { ...session.chunkedDetails };
											tmpdetails.timestamp = Date.now();
											session.chunkedTransferChannels[uuid].send(JSON.stringify(tmpdetails));
											session.chunkedTransferChannels[uuid].detailsSent = true;
										} else {
											continue;
										}
									}

									session.chunkedTransferChannels[uuid].send(buffer);
								}
								session.pcs[uuid].stats.bufferedAmount = session.chunkedTransferChannels[uuid].bufferedAmount;
								if (maxBufferSize < session.pcs[uuid].stats.bufferedAmount) {
									maxBufferSize = session.pcs[uuid].stats.bufferedAmount;
								}
							} catch (e) { }
						}
					}

					session.stats.maxBufferSize = maxBufferSize;
				}
				session.stats.chunkedInQueue = 0;
				} catch (e) {
					errorlog(e);
				} finally {
					sendTimeout = null;
				}
			};
		}

		for (let UUID in session.pcs) {
			if (!session.canSendChunkedToPeer(session.pcs[UUID], session.chunkedDetails)) {
				const incompatibleChannel = session.chunkedTransferChannels[UUID];
				if (incompatibleChannel) {
					try {
						const hostedIndex = session.hostedTransfers.indexOf(incompatibleChannel);
						if (hostedIndex > -1) {
							session.hostedTransfers.splice(hostedIndex, 1);
						}
						incompatibleChannel.onclose = null;
						incompatibleChannel.close();
					} catch (e) {
						warnlog(e);
					}
					delete session.chunkedTransferChannels[UUID];
				}
				continue;
			}
			if (session.chunkedTransferChannels[UUID]) {
				// already sending

				if (session.chunkedDetails) {
					var tmpdetails = { ...session.chunkedDetails };
					tmpdetails.timestamp = Date.now();

					if (updatedDeets) {
						try {
							session.chunkedTransferChannels[UUID].send(JSON.stringify(tmpdetails));
							session.chunkedTransferChannels[UUID].detailsSent = true;
						} catch (e) { }
					} else if (!session.chunkedTransferChannels[UUID].detailsSent) {
						try {
							session.chunkedTransferChannels[UUID].send(JSON.stringify(tmpdetails));
							session.chunkedTransferChannels[UUID].detailsSent = true;
						} catch (e) { }
					}
				}
			} else {
				var channelName = "chunked"; // max one chunked transfer per peer, so fine to reuse name

				session.chunkedTransferChannels[UUID] = session.pcs[UUID].createDataChannel(channelName, { ordered: true });

				session.chunkedTransferChannels[UUID].contentType = "chunks";

				session.chunkedTransferChannels[UUID].binaryType = "arraybuffer";

				session.chunkedTransferChannels[UUID].header = false;

				session.chunkedTransferChannels[UUID].detailsSent = false;

				session.chunkedTransferChannels[UUID].timeOffset = null;

				session.chunkedTransferChannels[UUID].keyframeSent = false;
				session.chunkedTransferChannels[UUID].audioHeaderSent = false;

				session.chunkedTransferChannels[UUID].bufferedAmountLowThreshold = 65536; // 64KB; below every reliable relief watermark
				session.chunkedTransferChannels[UUID].onbufferedamountlow = function () {
					var health = (session.chunkedRecorder && session.chunkedRecorder.viewerHealth) ? session.chunkedRecorder.viewerHealth[UUID] : null;
					if (health && health.stalled) {
						health.stalled = false;
						health.consecutiveHigh = 0;
						health.reliablePaused = false;
						health.reliableRelieved = false;
						if (health.stallRecoveryTimer) {
							clearTimeout(health.stallRecoveryTimer);
							health.stallRecoveryTimer = null;
						}
					}
					if (session.chunkedRecorder && session.chunkedRecorder.sendChunks) {
						session.chunkedRecorder.sendChunks();
					}
				};

				session.chunkedTransferChannels[UUID].onopen = () => {
					log("RETRANSMIT chunkedtransfer OPEN");
					if (session.chunkedDetails) {
						var tmpdetails = { ...session.chunkedDetails };
						tmpdetails.timestamp = Date.now();
						session.chunkedTransferChannels[UUID].send(JSON.stringify(tmpdetails));
						session.chunkedTransferChannels[UUID].detailsSent = true;
					}
				};

				session.chunkedTransferChannels[UUID].onclose = () => {
					try {
						var index = session.hostedTransfers.indexOf(session.chunkedTransferChannels[UUID]);
						if (index > -1) {
							session.hostedTransfers.splice(index, 1);
						}
					} catch (e) {
						errorlog(e);
					}

					log("re-Transfer ended");
					session.chunkedTransferChannels[UUID] = null;
					delete session.chunkedTransferChannels[UUID];

					var cancel = false;
					for (var i = 0; i < session.hostedTransfers.length; i++) {
						if ("contentType" in session.hostedTransfers[i] && session.hostedTransfers[i].contentType == "chunks") {
							cancel = true;
							break;
						}
					}
				};

				session.chunkedTransferChannels[UUID].onmessage = event => {
					if (event.data) {
						try {
							var data = JSON.parse(event.data);
							if (data.kf) {
								if (session.chunkedRecorder.upstreamChannel) {
									session.chunkedRecorder.upstreamChannel.send(JSON.stringify({ kf: true }));
									warnlog("KEY FRAME will be requested from the seeder on behalf of a seeder ...");
								} else {
									errorlog("no upstreamChannel 2");
								}
							} else if (data.type === "nack" && session.chunkedRecorder && typeof session.chunkedRecorder.handleNack === "function") {
								session.chunkedRecorder.handleNack(UUID, data);
							}
						} catch (e) {
							//
						}
					}
				};
				session.hostedTransfers.push(session.chunkedTransferChannels[UUID]);
			}
		}

		await session.chunkedRecorder.sendChunks();
	};

	function sanitizeChunkDimension(value, multiple = 2) {
		let numeric = Number.isFinite(value) ? Math.floor(value) : multiple;
		if (numeric < multiple) {
			numeric = multiple;
		}
		const remainder = numeric % multiple;
		if (remainder !== 0) {
			numeric -= remainder;
		}
		if (numeric < multiple) {
			numeric = multiple;
		}
		return numeric;
	}

	function fitChunkDimensions(width, height, maxLongEdge) {
		width = sanitizeChunkDimension(width, 2);
		height = sanitizeChunkDimension(height, 2);
		maxLongEdge = Math.max(2, parseInt(maxLongEdge) || Math.max(width, height));
		const longestEdge = Math.max(width, height);
		if (longestEdge <= maxLongEdge) {
			return { width: width, height: height };
		}
		const scale = maxLongEdge / longestEdge;
		return {
			width: sanitizeChunkDimension(width * scale, 2),
			height: sanitizeChunkDimension(height * scale, 2)
		};
	}

	function getChunkAdaptiveResolutionThresholds(recorder) {
		var baseWidth = recorder && recorder.adaptiveBaseVideoWidth ? recorder.adaptiveBaseVideoWidth : 1280;
		var baseHeight = recorder && recorder.adaptiveBaseVideoHeight ? recorder.adaptiveBaseVideoHeight : 720;
		var pixelRatio = Math.max(0.25, (baseWidth * baseHeight) / (1280 * 720));
		var fullDown = Math.max(350, Math.min(4000, Math.round(700 * pixelRatio)));
		var fullUp = Math.max(fullDown + 60, Math.min(4500, Math.round(780 * pixelRatio)));
		return {
			fullDown: fullDown,
			fullUp: fullUp,
			emergencyDown: 220,
			emergencyUp: 280
		};
	}

	function applyChunkAdaptiveResolution(recorder, bitrateKbps, forceConfigure) {
		if (!recorder || !recorder.configVideo || !recorder.adaptiveBaseVideoWidth || !recorder.adaptiveBaseVideoHeight) {
			return 0;
		}
		var thresholds = getChunkAdaptiveResolutionThresholds(recorder);
		var resolutionTier = Number.isFinite(recorder.adaptiveResolutionTier) ? recorder.adaptiveResolutionTier : 0;
		if (resolutionTier === 0 && bitrateKbps < thresholds.fullDown) {
			resolutionTier = 1;
		} else if (resolutionTier === 1 && bitrateKbps < thresholds.emergencyDown) {
			resolutionTier = 2;
		} else if (resolutionTier === 1 && bitrateKbps > thresholds.fullUp) {
			resolutionTier = 0;
		} else if (resolutionTier === 2 && bitrateKbps > thresholds.emergencyUp) {
			resolutionTier = 1;
		}

		if (forceConfigure || resolutionTier !== recorder.adaptiveResolutionTier) {
			var maxLongEdge = resolutionTier === 2 ? 320 : (resolutionTier === 1 ? 640 : Math.max(recorder.adaptiveBaseVideoWidth, recorder.adaptiveBaseVideoHeight));
			var dimensions = fitChunkDimensions(recorder.adaptiveBaseVideoWidth, recorder.adaptiveBaseVideoHeight, maxLongEdge);
			recorder.configVideo.width = dimensions.width;
			recorder.configVideo.height = dimensions.height;
			// Adaptive recovery can outgrow the AVC level chosen at a smaller tier.
			// Keep the wire metadata and encoder configuration in sync for each tier.
			if (isChunkedH264Codec(recorder.configVideo.codec)) {
				var requiredCodec = getChunkedH264CodecForVideo(dimensions.width, dimensions.height, recorder.configVideo.frameRate);
				var currentCodec = recorder.configVideo.codec;
				recorder.configVideo.codec = /^(avc1|avc3)\.[0-9a-f]{6}$/i.test(currentCodec)
					? currentCodec.slice(0, -2) + requiredCodec.slice(-2) : requiredCodec;
			}
			if (recorder.videoEncoder && recorder.videoEncoder.config) {
				recorder.videoEncoder.config.width = dimensions.width;
				recorder.videoEncoder.config.height = dimensions.height;
				if (isChunkedH264Codec(recorder.configVideo.codec)) {
					recorder.videoEncoder.config.codec = recorder.configVideo.codec;
				}
			}
			recorder.adaptiveResolutionTier = resolutionTier;
			recorder.needKeyFrame = true;
			if (recorder.adaptation) {
				recorder.adaptation.forceKeyFrame = true;
			}
		}
		return resolutionTier;
	}

	function getChunkedH264CodecForVideo(width, height, framerate) {
		var macroblocksPerFrame = Math.ceil(Math.max(1, width || 1280) / 16) * Math.ceil(Math.max(1, height || 720) / 16);
		var macroblocksPerSecond = macroblocksPerFrame * Math.max(1, Math.ceil(framerate || 30));
		var levels = [
			{ value: "1E", maxFrame: 1620, maxRate: 40500 },
			{ value: "1F", maxFrame: 3600, maxRate: 108000 },
			{ value: "20", maxFrame: 5120, maxRate: 216000 },
			{ value: "28", maxFrame: 8192, maxRate: 245760 },
			{ value: "2A", maxFrame: 8704, maxRate: 522240 },
			{ value: "32", maxFrame: 22080, maxRate: 589824 },
			{ value: "33", maxFrame: 36864, maxRate: 983040 },
			{ value: "34", maxFrame: 36864, maxRate: 2073600 }
		];
		for (var i = 0; i < levels.length; i++) {
			if (macroblocksPerFrame <= levels[i].maxFrame && macroblocksPerSecond <= levels[i].maxRate) {
				return "avc1.42E0" + levels[i].value;
			}
		}
		return "avc1.42E034";
	}

	function normalizeChunkCodecName(codec, defaultH264Codec = "avc1.42E01E") {
		var value = (codec || "").toString().toLowerCase().trim();
		if (!value || value === "auto") {
			return "";
		}
		if (value === "av1" || value === "av01") {
			return "av01.0.04M.08";
		}
		if (value === "vp9" || value === "vp09") {
			return "vp09.00.10.08";
		}
		if (value === "h264" || value === "avc" || value === "avc1") {
			return defaultH264Codec;
		}
		return value;
	}

	function getPreferredChunkCodecs(width, height, framerate) {
		var defaultH264Codec = getChunkedH264CodecForVideo(width, height, framerate);
		var defaults = ["av01.0.04M.08", "vp09.00.10.08", "vp8", defaultH264Codec];
		var codecs = [];
		var requested = session.chunkcodec || false;
		if (requested) {
			var requestedList = requested.toString().split(",");
			for (var i = 0; i < requestedList.length; i++) {
				var normalized = normalizeChunkCodecName(requestedList[i], defaultH264Codec);
				if (normalized && codecs.indexOf(normalized) === -1) {
					codecs.push(normalized);
				}
			}
		}
		for (var j = 0; j < defaults.length; j++) {
			if (codecs.indexOf(defaults[j]) === -1) {
				codecs.push(defaults[j]);
			}
		}
		return codecs;
	}

	function isChunkedH264Codec(codec) {
		var value = (codec || "").toString().toLowerCase();
		return value === "h264" || value === "avc" || value === "avc1" || value.indexOf("avc1.") === 0 || value.indexOf("avc3.") === 0;
	}

	function createChunkedVideoEncoderProbeConfig(codec, alpha, acceleration, width, height, framerate) {
		var config = {
			codec,
			alpha,
			hardwareAcceleration: acceleration,
			width,
			height,
			bitrate: 2000000,
			bitrateMode: "constant",
			framerate,
			latencyMode: "realtime"
		};
		if (isChunkedH264Codec(codec)) {
			config.avc = { format: "annexb" };
		}
		return config;
	}

	async function getAvailableWebCodecs(width = 1280, height = 720, framerate = 30) {
		var codecs = getPreferredChunkCodecs(width, height, framerate);
		var accelerations = ["prefer-hardware", "prefer-software"];

		var supported = [];

		if (session.alpha) {
			var configs = [];
			var alpha = "keep";

			for (var codec of codecs) {
				// prefer av1 next
				for (var acceleration of accelerations) {
					// prefer hardware version of av1 if possible, etc.
					configs.push(createChunkedVideoEncoderProbeConfig(codec, alpha, acceleration, width, height, framerate));
				}
			}

			for (var i = 0; i < configs.length; i++) {
				var support = await VideoEncoder.isConfigSupported(configs[i]);
				if (support && support.supported) {
					supported.push(support);
				}
			}

			if (!supported.length) {
				// not alpha compatibel codecs found
				if (!session.cleanOutput) {
					warnUser("Notice: Alpha chunked-mode encoding is not supported by this browser.\n\nThe vidoe encoder is falling back to non-alpha mode", 6000);
				}
			}
		}

		if (!supported.length) {
			var configs = [];
			var alpha = "discard";

			for (var codec of codecs) {
				// prefer av1 next
				for (var acceleration of accelerations) {
					// prefer hardware version of av1 if possible, etc.
					configs.push(createChunkedVideoEncoderProbeConfig(codec, alpha, acceleration, width, height, framerate));
				}
			}

			for (var i = 0; i < configs.length; i++) {
				var support = await VideoEncoder.isConfigSupported(configs[i]);
				if (support && support.supported) {
					supported.push(support);
				}
			}
		}

		return supported;
	}

	///

	session.chunkedStream = async function (UUID = null) {
		// transmit chunked stream
		// log("SENDING CHUNKS TO: " + UUID + " " + session.chunkedVideoEnabled + " " + session.chunkedAudioEnabled);

		function trackPendingChunkedAudio(pendingAudioPromise) {
			if (!pendingAudioPromise || typeof pendingAudioPromise.finally !== "function") {
				return;
			}
			pendingAudioPromise.finally(function () {
				if (session.chunkedRecorder && session.chunkedRecorder.audioPromise === pendingAudioPromise) {
					delete session.chunkedRecorder.audioPromise;
				}
			});
		}

		function startChunkedAudioNonBlocking() {
			if (!session.chunkedRecorder || !session.chunkedRecorder.configAudio || session.chunkedAudioEnabled || session.chunkedRecorder.audioPromise) {
				return;
			}
			if (session.chunkedRecorder.configAudio.codec == "pcm") {
				try {
					session.getPCM(session.getLocalStream(), session.chunkedRecorder.configAudio);
				} catch (e) {
					errorlog(e);
				}
				return;
			}
			session.chunkedRecorder.audioPromise = session.webCodecAudio(session.chunkedRecorder.configAudio);
			trackPendingChunkedAudio(session.chunkedRecorder.audioPromise);
		}

		if (UUID && !session.canSendChunkedToPeer(session.pcs[UUID])) {
			return;
		}

		if (!session.chunkedVideoEnabled && session.chunkedRecorder && session.chunkedRecorder.configVideo) {
			await session.webCodec(session.stats.Chunked_video);
		}

		if (!session.chunkedAudioEnabled && session.chunkedRecorder && session.chunkedRecorder.configAudio) {
			startChunkedAudioNonBlocking();
		}

		if (UUID) {
			if (UUID in session.chunkedTransferChannels) {
				warnlog("UUID in session.chunkedTransferChannels already");
				return; // already sending or setting up
			} else {
				session.chunkedTransferChannels[UUID] = null; // reserve
			}
		}

		if (!session.chunkedRecorder) {
			// already setup

			var stream = session.getLocalStream(); // this is the processed stream

			///////////////
			//var options = {};

			// Keep bitrate separate from receiver delay. Some integrations use
			// very long chunked playout buffers; those values must not become
			// WebCodecs kbps or the encoder will downscale/cap quality.
			var requestedChunkBitrate = parseInt(session.chunkbitrate) || parseInt(session.chunked) || 2500;
			var videoKbps = requestedChunkBitrate; // make sure smaller than max chunk size;

			//var chunktime = 200; // I made this a smaller chunk size; if I can get this working, maybe I'll have the other mdoe work.
			var sendTimeout = null;

			if (session.maxvideobitrate && session.maxvideobitrate < videoKbps) {
				videoKbps = session.maxvideobitrate;
			}
			session.chunkbitrate = videoKbps;

			var configVideo = {
				codec: "vp09.00.10.08",
				width: 1920,
				height: 1080,
				bitrate: parseInt(videoKbps * 1000), // bits per second
				frameRate: 30,
				latencyMode: "realtime"
				//bitrateMode: "constant",
				//alpha: "keep", // not yet supported
				//hardwareAcceleration: "prefer-hardware"
			};

			var tracks = stream.getVideoTracks();
			var adaptiveBaseVideoWidth = 0;
			var adaptiveBaseVideoHeight = 0;
			if (tracks.length) {
				var settings = tracks[0].getSettings();
				if (settings.width) {
					configVideo.width = settings.width;
				}
				if (settings.height) {
					configVideo.height = settings.height;
				}
				if (settings.frameRate) {
					configVideo.frameRate = settings.frameRate;
				}
				adaptiveBaseVideoWidth = configVideo.width;
				adaptiveBaseVideoHeight = configVideo.height;
			} else {
				configVideo = false;
			}

			if (configVideo && videoKbps < 601) {
				var mod = (configVideo.width * configVideo.height) / (640 * 360);
				if (mod >= 2) {
					configVideo.width = parseInt(configVideo.width / 2);
					configVideo.height = parseInt(configVideo.height / 2);
				} else if (mod >= 1.5) {
					configVideo.width = parseInt(configVideo.width / 1.5);
					configVideo.height = parseInt(configVideo.height / 1.5);
				}
			}
			if (configVideo) {
				configVideo.width = sanitizeChunkDimension(configVideo.width, 2);
				configVideo.height = sanitizeChunkDimension(configVideo.height, 2);
				configVideo.frameRate = Math.max(1, Math.round(configVideo.frameRate || 30));
				try {
					var supportedCodecs = await getAvailableWebCodecs(configVideo.width, configVideo.height, configVideo.frameRate);
					if (supportedCodecs && supportedCodecs.length) {
						configVideo.codec = supportedCodecs[0].config.codec;
						configVideo.alpha = supportedCodecs[0].config.alpha;
						if (isChunkedH264Codec(configVideo.codec)) {
							configVideo.avc = { format: "annexb" };
						} else {
							delete configVideo.avc;
						}
					}
					// if not detected as having alpha, we won't set it.
					log(supportedCodecs);
				} catch (e) {
					errorlog(e);
				}

				warnlog(configVideo);

				if (configVideo.width == configVideo.height) {
					//if (configVideo.width<640){
					configVideo.width = 640;
					configVideo.height = 640;
					//	}
				}
				if (session.chunkadaptresolution) {
					const initialMaxEdge = videoKbps < 240 ? 320 : (videoKbps < 750 ? 640 : Math.max(adaptiveBaseVideoWidth, adaptiveBaseVideoHeight));
					const initialDimensions = fitChunkDimensions(adaptiveBaseVideoWidth, adaptiveBaseVideoHeight, initialMaxEdge);
					configVideo.width = initialDimensions.width;
					configVideo.height = initialDimensions.height;
				}
			}

			var configAudio = {
				codec: "opus",
				numberOfChannels: 2,
				channels: 2,
				sampleRate: 48000,
				bitrate: 64000,
				tuning: {
					bitrate: 64000
				}
			};
			if (videoKbps > 3000) {
				configAudio = {
					codec: "opus",
					numberOfChannels: 2,
					channels: 2,
					sampleRate: 48000,
					tuning: {
						bitrate: 128000
					}
				};
			} else if (videoKbps < 601) {
				configAudio = {
					codec: "opus",
					numberOfChannels: 2,
					channels: 2,
					sampleRate: 48000,
					tuning: {
						bitrate: 32000
					}
				};
			}

			if (session.pcm) {
				configAudio = {
					codec: "pcm",
					numberOfChannels: 2,
					channels: 2,
					sampleRate: 48000
				};
			}

			if (!stream.getAudioTracks().length) {
				configAudio = false;
			}

			if (!configAudio && !configVideo) {
				warnlog("no video/audio config");
				return;
			} // only start if there is audio OR video; at least until I make this smarter

			// //options.mimeType = 'video/webm; codecs="vp09.00.10.08"';
			warnlog("session.chunkedRecorder set");
			session.chunkedRecorder = {};
			session.chunkedRecorder.needKeyFrame = true;
			session.chunkedRecorder.configVideo = configVideo || false;
			session.chunkedRecorder.configAudio = configAudio || false;
			session.chunkedRecorder.adaptiveBaseVideoWidth = adaptiveBaseVideoWidth;
			session.chunkedRecorder.adaptiveBaseVideoHeight = adaptiveBaseVideoHeight;
			session.chunkedRecorder.adaptiveResolutionTier = videoKbps < 240 ? 2 : (videoKbps < 750 ? 1 : 0);
			session.chunkedRecorder.updateVideoProfile = function (width, height, ceilingKbps, frameRate) {
				var recorder = session.chunkedRecorder;
				if (!recorder || !recorder.configVideo) {
					return false;
				}
				recorder.adaptiveBaseVideoWidth = sanitizeChunkDimension(width || recorder.adaptiveBaseVideoWidth || recorder.configVideo.width, 2);
				recorder.adaptiveBaseVideoHeight = sanitizeChunkDimension(height || recorder.adaptiveBaseVideoHeight || recorder.configVideo.height, 2);
				var safeCeiling = Math.max(1, parseInt(ceilingKbps) || parseInt(session.chunkadaptceil) || videoKbps);
				session.maxvideobitrate = safeCeiling;
				session.chunkadaptceil = safeCeiling;
				if (frameRate) {
					recorder.configVideo.frameRate = Math.max(1, Math.round(frameRate));
				}
				// Keep the wire metadata and the WebCodecs configuration in sync.
				// WebCodecs uses lowercase `framerate`; retaining a 720p AVC level
				// when switching to 1080p closes the encoder asynchronously.
				recorder.configVideo.framerate = recorder.configVideo.frameRate;
				if (recorder.adaptation) {
					recorder.adaptation.ceiling = safeCeiling;
					recorder.adaptation.floor = Math.min(recorder.adaptation.floor, safeCeiling);
					recorder.adaptation.target = Math.min(recorder.adaptation.target, safeCeiling);
					recorder.adaptation.forceKeyFrame = true;
				}
				var activeBitrate = recorder.adaptation ? recorder.adaptation.target : (session.stats.adjustBitrate || videoKbps);
				var tier = applyChunkAdaptiveResolution(recorder, activeBitrate, true);
				if (recorder.videoEncoder && recorder.videoEncoder.state !== "closed" && recorder.videoEncoder.configure && recorder.videoEncoder.config) {
					recorder.videoEncoder.config.codec = recorder.configVideo.codec;
					recorder.videoEncoder.config.framerate = recorder.configVideo.framerate;
					recorder.videoEncoder.config.frameRate = recorder.configVideo.frameRate;
					recorder.videoEncoder.config.bitrate = Math.min(activeBitrate, safeCeiling) * 1000;
					recorder.videoEncoder.configure(recorder.videoEncoder.config);
				}
				recorder.needKeyFrame = true;
				session.stats.chunkedResolutionTier = tier;
				session.stats.chunkedResolution = recorder.configVideo.width + "x" + recorder.configVideo.height;
				return true;
			};
			session.chunkedRecorder.chunkRates = [];
			session.stats.adjustBitrate = videoKbps;
			if (configureChunkedReliabilityRecorder()) {
				session.stats.chunkedReliability = "enabled";
			}


			////////////////
			function createWSS() {
				const room = "room123";
				let sentHeader = false;
				var ws = new WebSocket("wss://pipe.vdo.ninja:9001/" + room + "/publisher");

				ws.timer = null;

				ws.binaryType = "arraybuffer";

				ws.onopen = () => {
					console.log("Connected to Chunkcast");
					if (session.chunkedAudioEnabled && session.chunkedVideoEnabled) {
						let message = {
							timestamp: session.getChunkedTimestamp(),
							type: "chunkedtransfer",
							realTimeVideo: (session.stats.Chunked_video && session.stats.Chunked_video.realTime) || 0,
							realTimeAudio: (session.stats.Chunked_audio && session.stats.Chunked_audio.realTime) || 0,
							size: 99999999999999,
							configVideo: session.chunkedRecorder.configVideo,
							configAudio: session.chunkedRecorder.configAudio,
							recordType: session.chunked,
							filename: channelName + ".webm",
							id: channelName
						};

						log(message);

						ws.sendHeader(message);
						sentHeader = true;
					} else if (session.chunkedAudioEnabled) {
						let message = {
							timestamp: session.getChunkedTimestamp(),
							type: "chunkedtransfer",
							realTimeAudio: (session.stats.Chunked_audio && session.stats.Chunked_audio.realTime) || 0,
							size: 99999999999999,
							configAudio: session.chunkedRecorder.configAudio,
							recordType: session.chunked,
							filename: channelName + ".webm",
							id: channelName
						};

						log(message);

						ws.sendHeader(message);
						sentHeader = true;
					} else if (session.chunkedVideoEnabled) {
						let message = {
							timestamp: session.getChunkedTimestamp(),
							type: "chunkedtransfer",
							realTimeVideo: (session.stats.Chunked_video && session.stats.Chunked_video.realTime) || 0,
							size: 99999999999999,
							configVideo: session.chunkedRecorder.configVideo,
							recordType: session.chunked,
							filename: channelName + ".webm",
							id: channelName
						};

						log(message);
						ws.sendHeader(message);
						sentHeader = true;
					}

					console.log("HEADER SENT?");

					if (session.chunkedRecorder && session.chunkedRecorder.sendChunks) {
						session.chunkedRecorder.sendChunks(); // start
					}

					if (sentHeader) {
						requestUpdates();
					}
				};

				ws.sendObject = function (data) {
					if (!sentHeader) { return; }
					if (Array.isArray(data)) {
						ws.sendHeader(data);
					} else if (typeof data === "object") {
						ws.sendVideoChunk(data);
					} else {
						return "not an object or array";
					}
				};

				ws.sendHeader = function (headerObject) {
					try {
						const headerString = JSON.stringify(headerObject);
						const headerBuffer = new TextEncoder().encode(headerString);
						const messageTypeBuffer = new Uint8Array([0x00]); // Header indicator
						const messageBuffer = new Uint8Array(messageTypeBuffer.length + headerBuffer.length);
						messageBuffer.set(messageTypeBuffer, 0);
						messageBuffer.set(headerBuffer, messageTypeBuffer.length);
						this.send(messageBuffer);
					} catch (e) {
						errorlog(e);
					}
				};

				// Function to send video chunk
				ws.sendVideoChunk = function (videoChunk) {
					try {
						const messageTypeBuffer = new Uint8Array([0x01]); // Video chunk indicator
						const messageBuffer = new Uint8Array(messageTypeBuffer.length + videoChunk.byteLength);
						messageBuffer.set(messageTypeBuffer, 0);
						messageBuffer.set(new Uint8Array(videoChunk), messageTypeBuffer.length);
						this.send(messageBuffer);
					} catch (e) {
						errorlog(e);
					}
				};


				ws.onmessage = function (event) {

					const data = new Uint8Array(event.data);
					const messageType = data[0];

					if (messageType === 0x03) {
						// Handle server response
						const viewerCount = new DataView(data.buffer).getUint32(1, true);
						const newViewers = new DataView(data.buffer).getUint32(5, true);
						const keyframeRequested = data[9] === 1;

						console.log(`Total viewers: ${viewerCount}`);
						console.log(`New viewers: ${newViewers}`);

						if (keyframeRequested) {
							console.log("Keyframe requested");
							session.chunkedRecorder.needKeyFrame = true;
						}
					}
				};

				ws.requestPublisherUpdate = function () {
					const messageTypeBuffer = new Uint8Array([0x02]); // Publisher request indicator
					this.send(messageTypeBuffer);
				};

				function requestUpdates() {
					if (ws.readyState === 1) {
						ws.requestPublisherUpdate();
						clearTimeout(ws.timer);
						ws.timer = setTimeout(requestUpdates, 5000); // Request updates every 5 seconds
					}
				}

				ws.onclose = () => {
					console.log("Chunkcast WebSocket disconnected");
					if (ws.timer) {
						clearTimeout(ws.timer);
					}
					// Mark WebSocket as disconnected
					session.chunkedRecorder.wss = false;
				};

				ws.onerror = error => {
					console.error("Chunkcast WebSocket Error:", error);
				};
				return ws;
			}
			session.chunkedRecorder.wss = false;


			////////////////////

			// Helper function to clear chunks up to the last keyframe
			function clearChunksToLastKeyframe() {
				let lastKeyIndex = -1;
				for (let i = session.chunksQueue.length - 1; i >= 0; i--) {
					const entry = session.chunksQueue[i];
					if (Array.isArray(entry) && entry[1] === "key") {
						lastKeyIndex = i;
						break;
					}
				}
				if (lastKeyIndex > 0) {
					const removed = lastKeyIndex;
					session.chunksQueue = session.chunksQueue.slice(lastKeyIndex);
					console.log(`Cleared ${removed} queued entries prior to last keyframe`);
					return removed;
				} else if (lastKeyIndex === -1) {
					console.log("No keyframe found in queue, keeping all chunks");
				}
				return 0;
			}

			function resetChunkedHeaderStateAfterTrim() {
				if (session.chunkedRecorder) {
					session.chunkedRecorder.needKeyFrame = true;
				}
				if (!session.chunkedTransferChannels) {
					return;
				}
				for (var uuid in session.chunkedTransferChannels) {
					var channel = session.chunkedTransferChannels[uuid];
					if (!channel) {
						continue;
					}
					channel.keyframeSent = false;
					channel.audioHeaderSent = false;
				}
			}

			session.chunkedRecorder.sendChunks = async function (mtype = "null") {
				if (sendTimeout) {
					return;
				}
				sendTimeout = true;

				// Limit queue size to prevent memory issues (approx 50MB worth of chunks)
				const maxQueueSize = 500;
				if (session.chunksQueue.length > maxQueueSize) {
					const originalLength = session.chunksQueue.length;
					clearChunksToLastKeyframe();
					if (session.chunksQueue.length > maxQueueSize) {
						let trimmedQueue = session.chunksQueue.slice(-maxQueueSize);
						let alignIndex = trimmedQueue.findIndex(entry => Array.isArray(entry) && typeof entry[1] === "string");
						if (alignIndex === -1) {
							console.warn("Chunked queue overflow, dropping all entries (no metadata for alignment)");
							trimmedQueue = [];
						} else if (alignIndex > 0) {
							trimmedQueue = trimmedQueue.slice(alignIndex);
						}
						session.chunksQueue = trimmedQueue;
					}
					const dropped = originalLength - session.chunksQueue.length;
					if (dropped > 0) {
						console.warn(`Chunked queue overflow, dropping ${dropped} oldest chunks`);
						session.stats.chunkedQueueTrimmed = (session.stats.chunkedQueueTrimmed || 0) + dropped;
						resetChunkedHeaderStateAfterTrim();
					}
				}

				if (session.chunkcast) { ////////
					if (!session.chunkedRecorder.wss) {
						session.chunkedRecorder.wss = createWSS();
					}
					if (session.chunkedRecorder.wss) {
						if (session.chunkedRecorder.wss.readyState === 1) {
							while (session.chunksQueue.length) {
								try {
									session.chunkedRecorder.wss.sendObject(session.chunksQueue.shift());
								} catch (e) {
									break;
								}
							}
						} else {
							// WebSocket not ready - if queue is getting too large, clear to last keyframe
							if (session.chunksQueue.length > 1000) { // ~100MB of chunks
								console.log("Chunkcast queue too large, clearing to last keyframe");
								clearChunksToLastKeyframe();
							} else {
								console.log("Chunkcast WebSocket not ready, queuing chunks");
							}
						}
						sendTimeout = null;
						return;
					}
				} //////////////

				var mediaType = mtype;

				const viewerHealthMap = session.chunkedRecorder.viewerHealth = session.chunkedRecorder.viewerHealth || {};
				for (const vId in viewerHealthMap) {
					if (!session.chunkedTransferChannels[vId] || !session.pcs[vId]) {
						const staleHealth = viewerHealthMap[vId];
						if (staleHealth && staleHealth.stallRecoveryTimer) {
							clearTimeout(staleHealth.stallRecoveryTimer);
							staleHealth.stallRecoveryTimer = null;
						}
						delete viewerHealthMap[vId];
					}
				}
				const maxBufferByPriority = { 0: 0, 1: 0, 2: 0 };
				let maxBufferSize = 0;
				var reliableQueue = session.chunkedRecorder && session.chunkedRecorder.reliability && session.chunkedRecorder.reliability.enabled;
				const RELIABLE_RELIEF_PAUSES = 4;
				const RELIABLE_RELIEF_HIGH_PRIORITY_PAUSES = 8;

				function getViewerPriority(pcsEntry) {
					if (!pcsEntry) {
						return 2;
					}
					if (pcsEntry.scene !== false && pcsEntry.scene !== undefined && pcsEntry.scene !== null) {
						return 0;
					}
					if (pcsEntry.sceneDisplay !== null && pcsEntry.sceneDisplay !== undefined && pcsEntry.sceneDisplay !== false) {
						return 0;
					}
					if (pcsEntry.guest === true || pcsEntry.pseudoguest === true) {
						return 2;
					}
					return 1;
				}

				function getPriorityWatermark(priority) {
					var staticLimit;
					switch (priority) {
						case 0:
							staticLimit = 1572864; // ~1.5MB for scenes/layouts
							break;
						case 1:
							staticLimit = 1048576; // ~1MB for standard viewers
							break;
						default:
							staticLimit = 786432; // ~768KB for guests/low priority
							break;
					}
					var rateKbps = parseInt(session.stats && session.stats.adjustBitrate) || parseInt(session.chunkbitrate) || parseInt(session.chunked) || videoKbps || 900;
					var senderWindowMs = parseInt(session.sendingBuffer) || 500;
					// Scale reliable backpressure to chunkedbuffer's sender window, but keep the old byte caps.
					var bytesForWindow = Math.max(0, (rateKbps * 1000 / 8) * (senderWindowMs / 1000));
					var multiplier = priority === 0 ? 4 : (priority === 1 ? 3 : 2);
					var minWater = priority === 0 ? 393216 : (priority === 1 ? 262144 : 196608);
					return Math.max(minWater, Math.min(staticLimit, bytesForWindow * multiplier));
				}

				function ensureViewerHealth(uuid, priority) {
					if (!viewerHealthMap[uuid]) {
						viewerHealthMap[uuid] = { priority: priority, skipped: 0, sent: 0, buffered: 0, stalled: false, consecutiveHigh: 0 };
					}
					viewerHealthMap[uuid].priority = priority;
					return viewerHealthMap[uuid];
				}

				function getReliableReliefThreshold(priority) {
					return priority === 0 ? RELIABLE_RELIEF_HIGH_PRIORITY_PAUSES : RELIABLE_RELIEF_PAUSES;
				}

				function markReliableViewerSkipped(uuid, channel, health, reason) {
					health.skipped = (health.skipped || 0) + 1;
					health.reliableSkipped = (health.reliableSkipped || 0) + 1;
					const reliefSkip = reason === "relief" || reason === "relief-drain";
					if (reliefSkip) {
						health.reliableRelieved = true;
						health.stalled = true;
					}
					if (channel) {
						channel.keyframeSent = false;
					}
					if (session.chunkedRecorder) {
						session.chunkedRecorder.needKeyFrame = true;
					}
					if (session.stats) {
						session.stats.chunkedReliableSkipped = (session.stats.chunkedReliableSkipped || 0) + 1;
						if (reliefSkip) {
							session.stats.chunkedReliableRelieved = (session.stats.chunkedReliableRelieved || 0) + 1;
						}
					}
					return "skipped";
				}

				function mediaAllowedForChunkedViewer(pcsEntry, type) {
					if (!pcsEntry) {
						return false;
					}
					if ((type == "key" || type == "delta" || type == "video") && !pcsEntry.allowVideo) {
						return false;
					}
					if ((type == "audio" || type == "pcm") && (!pcsEntry.allowAudio || (pcsEntry.allowChunked == 2))) {
						return false;
					}
					return true;
				}

				function pauseReliableQueueIfNeeded(type) {
					if (!reliableQueue) {
						return false;
					}
					for (var uuid in session.chunkedTransferChannels) {
						var channel = session.chunkedTransferChannels[uuid];
						var pcsEntry = session.pcs[uuid];
						if (!channel || !pcsEntry || channel.readyState !== "open" || !mediaAllowedForChunkedViewer(pcsEntry, type)) {
							continue;
						}
						if (!pcsEntry.stats) {
							pcsEntry.stats = {};
						}
						var priority = getViewerPriority(pcsEntry);
						var highWater = getPriorityWatermark(priority);
						var bufferedAmount = channel.bufferedAmount || 0;
						pcsEntry.stats.bufferedAmount = bufferedAmount;
						if (bufferedAmount > highWater) {
							var health = ensureViewerHealth(uuid, priority);
							health.buffered = bufferedAmount;
							health.consecutiveHigh = (health.consecutiveHigh || 0) + 1;
							health.reliablePaused = true;
							health.paused = (health.paused || 0) + 1;
							if (session.stats) {
								session.stats.chunkedReliablePaused = (session.stats.chunkedReliablePaused || 0) + 1;
							}
							if (health.consecutiveHigh >= getReliableReliefThreshold(priority)) {
								markReliableViewerSkipped(uuid, channel, health, "relief");
								continue;
							}
							return true;
						}
					}
					return false;
				}

				function sendToViewer(uuid, payload, options = {}) {
					var channel = session.chunkedTransferChannels[uuid];
					var pcsEntry = session.pcs[uuid];
					if (!channel || !pcsEntry || channel.readyState !== "open") {
						return false;
					}
					var isMetadata = options.metadata === true;
					if (!pcsEntry.stats) {
						pcsEntry.stats = {};
					}
					var priority = getViewerPriority(pcsEntry);
					var health = ensureViewerHealth(uuid, priority);
					var reliabilityEnabled = session.chunkedRecorder && session.chunkedRecorder.reliability && session.chunkedRecorder.reliability.enabled;
					var highWater = getPriorityWatermark(priority);
					var bufferedAmount = channel.bufferedAmount || 0;
					if (!channel.keyframeSent) {
						channel.keyframeSent = false;
					}
					if (!channel.audioHeaderSent) {
						channel.audioHeaderSent = false;
					}
					if (!channel.detailsSent) {
						channel.detailsSent = false;
					}
					if (reliabilityEnabled && health.reliableRelieved) {
						var configuredLowWater = channel.bufferedAmountLowThreshold || 524288;
						var recoveryWater = Math.max(65536, Math.min(configuredLowWater, highWater * 0.5));
						if (bufferedAmount > recoveryWater) {
							return markReliableViewerSkipped(uuid, channel, health, "relief-drain");
						}
						health.reliableRelieved = false;
						health.reliablePaused = false;
						health.stalled = false;
						health.consecutiveHigh = 0;
						channel.keyframeSent = false;
						session.chunkedRecorder.needKeyFrame = true;
					}

					if (mediaType === "delta" && !channel.keyframeSent) {
						warnlog("Waiting for keyframe / header before sending delta / raw video data");
						if (session.chunkedRecorder) {
							session.chunkedRecorder.needKeyFrame = true;
						}
						return reliabilityEnabled ? markReliableViewerSkipped(uuid, channel, health, "waiting-keyframe") : false;
					}
					if (!isMetadata && (mediaType === "key" || mediaType === "delta" || mediaType === "video") && !channel.keyframeSent) {
						warnlog("Waiting for keyframe / header before sending delta / raw video data");
						if (session.chunkedRecorder) {
							session.chunkedRecorder.needKeyFrame = true;
						}
						return reliabilityEnabled ? markReliableViewerSkipped(uuid, channel, health, "waiting-keyframe") : false;
					}
					if (!isMetadata && (mediaType === "audio" || mediaType === "pcm") && !channel.audioHeaderSent) {
						warnlog("Waiting for audio header before sending raw audio data");
						return false;
					}

					if (!channel.detailsSent) {
						if (session.chunkedDetails) {
							try {
								var tmpdetails = { ...session.chunkedDetails };
								tmpdetails.timestamp = session.getChunkedTimestamp();
								channel.send(JSON.stringify(tmpdetails));
								channel.detailsSent = true;
							} catch (err) {
								health.sendErrors = (health.sendErrors || 0) + 1;
								health.stalled = true;
								session.chunkedRecorder.needKeyFrame = true;
								return false;
							}
						} else {
							channel.detailsSent = true;
						}
					}
					bufferedAmount = channel.bufferedAmount || 0;
					if (bufferedAmount > maxBufferSize) {
						maxBufferSize = bufferedAmount;
					}
					if (bufferedAmount > maxBufferByPriority[priority]) {
						maxBufferByPriority[priority] = bufferedAmount;
					}
					pcsEntry.stats.bufferedAmount = bufferedAmount;

					var canSkip = !reliabilityEnabled && (mediaType === "video" || mediaType === "delta");
					if (priority === 0) {
						if (bufferedAmount > highWater * 1.5) {
							health.highPriorityPressure = (health.highPriorityPressure || 0) + 1;
						} else {
							health.highPriorityPressure = 0;
						}
					}

					if (reliabilityEnabled && bufferedAmount > highWater) {
						health.buffered = bufferedAmount;
						health.consecutiveHigh = (health.consecutiveHigh || 0) + 1;
						health.reliablePaused = true;
						health.paused = (health.paused || 0) + 1;
						if (session.stats) {
							session.stats.chunkedReliablePaused = (session.stats.chunkedReliablePaused || 0) + 1;
						}
						if (health.consecutiveHigh >= getReliableReliefThreshold(priority)) {
							return markReliableViewerSkipped(uuid, channel, health, "relief");
						}
						return false;
					}

					if (canSkip && priority > 0 && bufferedAmount > highWater) {
						health.skipped = (health.skipped || 0) + 1;
						health.consecutiveHigh = (health.consecutiveHigh || 0) + 1;
						health.buffered = bufferedAmount;
						if (health.consecutiveHigh >= 4) {
							health.stalled = true;
							session.chunkedRecorder.needKeyFrame = true;
							if (!health.stallRecoveryTimer) {
								health.stallRecoveryTimer = setTimeout(function () {
									health.stallRecoveryTimer = null;
									const viewerHealthMap = session.chunkedRecorder ? session.chunkedRecorder.viewerHealth : null;
									const channel = session.chunkedTransferChannels ? session.chunkedTransferChannels[uuid] : null;
									const pcsEntry = session.pcs ? session.pcs[uuid] : null;
									if (!viewerHealthMap || viewerHealthMap[uuid] !== health || !channel || !pcsEntry || channel.readyState !== "open") {
										return;
									}
									health.stalled = false;
									health.consecutiveHigh = 0;
									clearChunksToLastKeyframe();
									if (session.chunkedRecorder) {
										session.chunkedRecorder.needKeyFrame = true;
									}
									warnlog("Chunked stall auto-recovery fired for viewer");
								}, 5000);
							}
						}
						return false;
					}

					try {
						channel.send(payload);
					} catch (err) {
						health.sendErrors = (health.sendErrors || 0) + 1;
						health.stalled = true;
						session.chunkedRecorder.needKeyFrame = true;
						return false;
					}

					if (isMetadata) {
						if (mediaType == "key" || mediaType == "video") {
							channel.keyframeSent = true;
						} else if (mediaType == "audio" || mediaType == "pcm") {
							channel.audioHeaderSent = true;
						}
					}

					bufferedAmount = channel.bufferedAmount || 0;
					if (bufferedAmount > maxBufferSize) {
						maxBufferSize = bufferedAmount;
					}
					if (bufferedAmount > maxBufferByPriority[priority]) {
						maxBufferByPriority[priority] = bufferedAmount;
					}
					pcsEntry.stats.bufferedAmount = bufferedAmount;
					health.buffered = bufferedAmount;
					health.sent = (health.sent || 0) + 1;
					health.lastSend = Date.now();
					health.consecutiveHigh = Math.max(0, (health.consecutiveHigh || 0) - 1);
					health.reliablePaused = false;
					health.stalled = false;
					if (health.stallRecoveryTimer) {
						clearTimeout(health.stallRecoveryTimer);
						health.stallRecoveryTimer = null;
					}
					return true;
				}

				while (session.chunksQueue.length) {

					if (!Object.keys(session.chunkedTransferChannels).length) {
						// no connections, clear old chunks but keep from last keyframe
						clearChunksToLastKeyframe();
						sendTimeout = null;
						session.stats.chunkedInQueue = session.chunksQueue.length;
						session.chunkedRecorder.chunkRates = [];
						return;
					}
					session.stats.chunkedInQueue = session.chunksQueue.length;
					maxBufferSize = 0;
					maxBufferByPriority[0] = 0;
					maxBufferByPriority[1] = 0;
					maxBufferByPriority[2] = 0;
					var buffer = session.chunksQueue.shift();
					if (Array.isArray(buffer)) {
						mediaType = buffer[1];
						const queueDepth = session.chunksQueue.length;
						const metadataEntry = buffer;
						const payloadArray = buffer.slice();
						payloadArray.push(queueDepth);
						const metadataPayload = JSON.stringify(payloadArray);
						const criticalMetadata = mediaType == "key" || mediaType == "video" || mediaType == "audio" || mediaType == "pcm";
						if (pauseReliableQueueIfNeeded(mediaType)) {
							session.chunksQueue.unshift(metadataEntry);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						let attempted = false;
						let delivered = false;
						let skipped = false;
						let blocked = false;
						let pendingReceivers = false;
						for (var uuid in session.chunkedTransferChannels) {
							var channel = session.chunkedTransferChannels[uuid];
							if (!channel) {
								pendingReceivers = true;
								continue;
							}
							var pcsEntry = session.pcs[uuid];
							if (!pcsEntry) {
								continue;
							}
							if ((mediaType == "key" || mediaType == "delta" || mediaType == "video") && !pcsEntry.allowVideo) {
								continue; // do not send video
							}
							if ((mediaType == "audio" || mediaType == "pcm") && (!pcsEntry.allowAudio || (pcsEntry.allowChunked == 2))) {
								continue; // do not send audio
							}
							attempted = true;
							const sendResult = sendToViewer(uuid, metadataPayload, { metadata: true });
							if (sendResult === true) {
								delivered = true;
							} else if (sendResult === "skipped") {
								skipped = true;
							} else {
								blocked = true;
							}
						}
						const onlySkipped = skipped && !blocked && !pendingReceivers;
						if (!delivered && (attempted || pendingReceivers) && (criticalMetadata || reliableQueue) && !onlySkipped) {
							if (criticalMetadata && session.chunkedRecorder) {
								session.chunkedRecorder.needKeyFrame = true;
							}
							session.chunksQueue.unshift(metadataEntry);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
					} else if (buffer.byteLength > 262144) {
						const originalBuffer = buffer;
						const chunkSlice = originalBuffer.slice(0, 262144);
						if (pauseReliableQueueIfNeeded(mediaType)) {
							session.chunksQueue.unshift(originalBuffer);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						let attempted = false;
						let delivered = false;
						let skipped = false;
						let blocked = false;
						let pendingReceivers = false;
						for (var uuid in session.chunkedTransferChannels) {
							var channel = session.chunkedTransferChannels[uuid];
							if (!channel) {
								pendingReceivers = true;
								continue;
							}
							var pcsEntry = session.pcs[uuid];
							if (!pcsEntry) {
								continue;
							}
							if ((mediaType == "key" || mediaType == "delta" || mediaType == "video") && !pcsEntry.allowVideo) {
								continue; // do not send video
							}
							if ((mediaType == "audio" || mediaType == "pcm") && (!pcsEntry.allowAudio || (pcsEntry.allowChunked == 2))) {
								continue; // do not send audio
							}
							attempted = true;
							const sendResult = sendToViewer(uuid, chunkSlice);
							if (sendResult === true) {
								delivered = true;
							} else if (sendResult === "skipped") {
								skipped = true;
							} else {
								blocked = true;
							}
						}
						const criticalPayload = mediaType == "key" || mediaType == "video" || mediaType == "audio" || mediaType == "pcm";
						const onlySkipped = skipped && !blocked && !pendingReceivers;
						if (!delivered && (attempted || pendingReceivers) && (criticalPayload || reliableQueue) && !onlySkipped) {
							if (criticalPayload && session.chunkedRecorder) {
								session.chunkedRecorder.needKeyFrame = true;
							}
							session.chunksQueue.unshift(originalBuffer);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						if (delivered) {
							session.chunksQueue.unshift(originalBuffer.slice(262144));
							session.chunkedRecorder.chunkRates.push({ bufferSize: maxBufferSize, byteLength: 262144, timestamp: Date.now() });
						}
					} else {
						const originalBuffer = buffer;
						if (pauseReliableQueueIfNeeded(mediaType)) {
							session.chunksQueue.unshift(originalBuffer);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						let attempted = false;
						let delivered = false;
						let skipped = false;
						let blocked = false;
						let pendingReceivers = false;
						for (var uuid in session.chunkedTransferChannels) {
							var channel = session.chunkedTransferChannels[uuid];
							if (!channel) {
								pendingReceivers = true;
								continue;
							}
							var pcsEntry = session.pcs[uuid];
							if (!pcsEntry) {
								continue;
							}
							if ((mediaType == "key" || mediaType == "delta" || mediaType == "video") && !pcsEntry.allowVideo) {
								continue; // do not send video
							}
							if ((mediaType == "audio" || mediaType == "pcm") && (!pcsEntry.allowAudio || (pcsEntry.allowChunked == 2))) {
								continue; // do not send audio
							}
							attempted = true;
							const sendResult = sendToViewer(uuid, buffer);
							if (sendResult === true) {
								delivered = true;
							} else if (sendResult === "skipped") {
								skipped = true;
							} else {
								blocked = true;
							}
						}
						const criticalPayload = mediaType == "key" || mediaType == "video" || mediaType == "audio" || mediaType == "pcm";
						const onlySkipped = skipped && !blocked && !pendingReceivers;
						if (!delivered && (attempted || pendingReceivers) && (criticalPayload || reliableQueue) && !onlySkipped) {
							if (criticalPayload && session.chunkedRecorder) {
								session.chunkedRecorder.needKeyFrame = true;
							}
							session.chunksQueue.unshift(originalBuffer);
							session.stats.chunkedInQueue = session.chunksQueue.length;
							sendTimeout = null;
							return;
						}
						if (delivered) {
							session.chunkedRecorder.chunkRates.push({ bufferSize: maxBufferSize, byteLength: buffer.byteLength, timestamp: Date.now() });
						}
					}

					session.chunkedRecorder.chunkRates = session.chunkedRecorder.chunkRates.slice(-1000);

					let totalAdded = 0;
					let totalNotSent = 0;
					let timeElapsed = 0;

					for (let i = session.chunkedRecorder.chunkRates.length - 1; i > 0; i--) {
						// {bufferSize:maxBufferSize , byteLength:buffer.byteLength, timestamp:Date.now()

						if (timeElapsed > session.sendingBuffer * 2) {
							session.chunkedRecorder.chunkRates.splice(i - 1, 1);
							continue;
						}

						const previous = session.chunkedRecorder.chunkRates[i - 1];
						const current = session.chunkedRecorder.chunkRates[i];

						// Calculate data added and sent
						totalNotSent += current.bufferSize - previous.bufferSize;

						totalAdded += current.byteLength; // should be previous

						timeElapsed += current.timestamp - previous.timestamp;
					}

					let totalSent = totalAdded - totalNotSent;
					let addingRate = 0;
					let sendingRate = 0;

					if (timeElapsed > 0) {
						const elapsedSeconds = timeElapsed / 1000;
						if (elapsedSeconds > 0) {
							addingRate = ((totalAdded / elapsedSeconds) * 8) / 1000;
							sendingRate = ((totalSent / elapsedSeconds) * 8) / 1000;
						}
					}

					let pressureMaxBufferSize = maxBufferSize;
					const pressureMaxBufferByPriority = { 0: maxBufferByPriority[0], 1: maxBufferByPriority[1], 2: maxBufferByPriority[2] };
					let sawActivePressureViewer = false;
					if (reliableQueue) {
						pressureMaxBufferSize = 0;
						pressureMaxBufferByPriority[0] = 0;
						pressureMaxBufferByPriority[1] = 0;
						pressureMaxBufferByPriority[2] = 0;
						for (const pressureId in viewerHealthMap) {
							const pressureHealth = viewerHealthMap[pressureId];
							if (!pressureHealth || pressureHealth.reliableRelieved) {
								continue;
							}
							const priority = pressureHealth.priority || 0;
							const buffered = pressureHealth.buffered || 0;
							sawActivePressureViewer = true;
							pressureMaxBufferSize = Math.max(pressureMaxBufferSize, buffered);
							pressureMaxBufferByPriority[priority] = Math.max(pressureMaxBufferByPriority[priority] || 0, buffered);
						}
						if (!sawActivePressureViewer) {
							pressureMaxBufferSize = 0;
						}
					}

					session.stats.chunkedBuffer = parseInt((8 * pressureMaxBufferSize) / Math.max(sendingRate, 1)) + " / " + session.sendingBuffer;

					let bufferPressureMs = sendingRate > 0 ? (8 * pressureMaxBufferSize) / sendingRate : 0;
					let bufferFullness = session.sendingBuffer > 0 ? bufferPressureMs / session.sendingBuffer : 0;
					session.stats.bufferFullness = bufferFullness;
					session.stats.addVsSentRate = parseInt(addingRate) + " : " + parseInt(sendingRate);

					if (!session.chunkedRecorder.adaptation) {
						const adaptationBaseKbps = parseInt(session.chunkbitrate) || parseInt(session.chunked) || videoKbps || 2500;
						const baseFloor = Math.max(200, adaptationBaseKbps * 0.2);
						const parsedFloor = Number.isFinite(parseFloat(session.chunkadaptfloor)) ? parseFloat(session.chunkadaptfloor) : baseFloor;
						const parsedCeil = Number.isFinite(parseFloat(session.chunkadaptceil)) ? parseFloat(session.chunkadaptceil) : adaptationBaseKbps;
						session.chunkedRecorder.adaptation = {
							target: adaptationBaseKbps,
							floor: parsedFloor,
							ceiling: parsedCeil,
							lastChange: 0,
							mode: (session.chunkadapt || "bitrate").toLowerCase(),
							frameDropBudget: 0,
							maxFrameDrop: Number.isFinite(parseInt(session.chunkadaptmaxdrop)) ? Math.max(0, parseInt(session.chunkadaptmaxdrop)) : 6,
							threshold: Number.isFinite(parseFloat(session.chunkadaptthreshold)) ? parseFloat(session.chunkadaptthreshold) : 380,
							interval: Number.isFinite(parseInt(session.chunkadaptinterval)) ? Math.max(200, parseInt(session.chunkadaptinterval)) : 800
						};
					}
					const adaptation = session.chunkedRecorder.adaptation;
					adaptation.mode = (session.chunkadapt || adaptation.mode || "bitrate").toLowerCase();
					if (Number.isFinite(parseFloat(session.chunkadaptfloor))) {
						adaptation.floor = parseFloat(session.chunkadaptfloor);
					}
					if (Number.isFinite(parseFloat(session.chunkadaptceil))) {
						adaptation.ceiling = parseFloat(session.chunkadaptceil);
					} else {
						adaptation.ceiling = parseInt(session.chunkbitrate) || parseInt(session.chunked) || videoKbps || adaptation.ceiling;
					}
					if (Number.isFinite(parseInt(session.chunkadaptmaxdrop))) {
						adaptation.maxFrameDrop = Math.max(0, parseInt(session.chunkadaptmaxdrop));
					}
					if (Number.isFinite(parseFloat(session.chunkadaptthreshold))) {
						adaptation.threshold = parseFloat(session.chunkadaptthreshold);
					}
					if (Number.isFinite(parseInt(session.chunkadaptinterval))) {
						adaptation.interval = Math.max(200, parseInt(session.chunkadaptinterval));
					}
					adaptation.floor = Math.max(0, Math.min(adaptation.floor, adaptation.ceiling));
					const now = Date.now();
					let newTarget = adaptation.target;

					let highPriorityStall = false;
					let mediumPressure = false;
					let highPressure = false;
					let lowPressure = false;
					let lowPrioritySkips = 0;

					for (const id in viewerHealthMap) {
						const health = viewerHealthMap[id];
						if (health.reliableRelieved) {
							if (health.priority === 0) {
								highPriorityStall = true;
							}
							continue;
						}
						if (health.priority === 0 && (health.stalled || (health.highPriorityPressure || 0) > 3)) {
							highPriorityStall = true;
						}
						if (health.priority > 0) {
							lowPrioritySkips += health.skipped || 0;
						}
					}

					highPressure = pressureMaxBufferByPriority[0] > getPriorityWatermark(0);
					mediumPressure = pressureMaxBufferByPriority[1] > getPriorityWatermark(1);
					lowPressure = pressureMaxBufferByPriority[2] > getPriorityWatermark(2);

					const mode = adaptation.mode || "bitrate";
					const allowBitrateAdjust = mode === "bitrate" || mode === "hybrid";
					const allowFrameDrop = mode === "framerate" || mode === "hybrid";
					const pressureThreshold = Math.max(1, adaptation.threshold || 380);

					if (highPriorityStall || highPressure || bufferPressureMs > pressureThreshold) {
						if (allowBitrateAdjust) {
							newTarget = Math.max(adaptation.floor, adaptation.target * 0.82);
						}
						if (allowFrameDrop) {
							const increment = mode === "hybrid" ? 1 : 2;
							adaptation.frameDropBudget = Math.min(adaptation.maxFrameDrop, adaptation.frameDropBudget + increment);
						}
					} else if (mediumPressure || bufferPressureMs > pressureThreshold * 0.8) {
						if (allowBitrateAdjust) {
							newTarget = Math.max(adaptation.floor, adaptation.target * 0.9);
						}
						if (allowFrameDrop) {
							adaptation.frameDropBudget = Math.min(adaptation.maxFrameDrop, adaptation.frameDropBudget + 1);
						}
					} else if (!highPriorityStall && !highPressure && bufferPressureMs < pressureThreshold * 0.35 && sendingRate > 0) {
						if (allowBitrateAdjust) {
							newTarget = Math.min(adaptation.ceiling, adaptation.target * 1.08);
						}
					}

					if (allowBitrateAdjust && Math.abs(newTarget - adaptation.target) > adaptation.target * 0.05 && now - adaptation.lastChange > adaptation.interval) {
						adaptation.target = Math.max(adaptation.floor, Math.min(newTarget, adaptation.ceiling));
						adaptation.lastChange = now;
					}
					if (highPriorityStall) {
						session.chunkedRecorder.needKeyFrame = true;
					}

					session.stats.adjustBitrate = Math.max(adaptation.floor, Math.min(adaptation.target, adaptation.ceiling));
					adaptation.frameDropBudget = Math.max(0, Math.min(adaptation.maxFrameDrop, adaptation.frameDropBudget));
					session.stats.chunkedFrameDropBudget = Math.round(adaptation.frameDropBudget);
					session.stats.chunkAdaptMode = adaptation.mode;
					session.stats.adjustBitrate = Math.round(session.stats.adjustBitrate);
					session.stats.currentRate = session.stats.adjustBitrate;

					const bytesPerMs = sendingRate > 0 ? sendingRate / 8 : 0;
					const bufferFullnessPriority = {
						high: bytesPerMs ? Math.round(pressureMaxBufferByPriority[0] / bytesPerMs) : 0,
						medium: bytesPerMs ? Math.round(pressureMaxBufferByPriority[1] / bytesPerMs) : 0,
						low: bytesPerMs ? Math.round(pressureMaxBufferByPriority[2] / bytesPerMs) : 0
					};
					session.stats.bufferFullnessPriority = bufferFullnessPriority;
					session.stats.chunkedViewerHealth = {};
					for (const key in viewerHealthMap) {
						const h = viewerHealthMap[key];
						session.stats.chunkedViewerHealth[key] = {
							priority: h.priority,
							buffered: parseInt(h.buffered || 0),
							skipped: h.skipped || 0,
							reliableSkipped: h.reliableSkipped || 0,
							reliablePaused: !!h.reliablePaused,
							reliableRelieved: !!h.reliableRelieved,
							stalled: !!h.stalled,
							pressure: h.highPriorityPressure || 0
						};
					}
					session.stats.chunkedViewerSkips = lowPrioritySkips;

					try {
						if (session.chunkedRecorder && session.chunkedRecorder.videoEncoder) {
							if (session.chunkedRecorder.videoEncoder.state == "closed") {
								console.log("Video encdoder closed");
								delete session.chunkedRecorder.videoEncoder;
								session.chunkedVideoEnabled = null;
								await session.webCodec();
							}
							if (session.chunkedRecorder && session.chunkedRecorder.videoEncoder && session.chunkedRecorder.videoEncoder.configure && session.chunkedRecorder.videoEncoder.config) {
								var previousBitrate = session.chunkedRecorder.videoEncoder.config.bitrate;
								var previousWidth = session.chunkedRecorder.videoEncoder.config.width;
								var previousHeight = session.chunkedRecorder.videoEncoder.config.height;
								var previousTuningBitrate = session.chunkedRecorder.videoEncoder.config.tuning && session.chunkedRecorder.videoEncoder.config.tuning.bitrate;
								if (session.chunkedRecorder.videoEncoder.config.bitrate && session.stats.adjustBitrate) {
									session.chunkedRecorder.videoEncoder.config.bitrate = session.stats.adjustBitrate * 1000;
								}
								if (session.chunkadaptresolution && session.chunkedRecorder.adaptiveBaseVideoWidth && session.chunkedRecorder.adaptiveBaseVideoHeight) {
									var resolutionTier = applyChunkAdaptiveResolution(session.chunkedRecorder, session.stats.adjustBitrate, false);
									session.stats.chunkedResolutionTier = resolutionTier;
									session.stats.chunkedResolution = session.chunkedRecorder.videoEncoder.config.width + "x" + session.chunkedRecorder.videoEncoder.config.height;
								}
								if (session.chunkedRecorder.videoEncoder.config.tuning && session.stats.adjustBitrate) {
									session.chunkedRecorder.videoEncoder.config.tuning.bitrate = session.stats.adjustBitrate * 1000;
								}

								// sendChunks runs for every encoded frame. Reconfigure only when
								// adaptation actually changes encoder settings, not on every tick.
								var nextConfig = session.chunkedRecorder.videoEncoder.config;
								if (nextConfig.bitrate !== previousBitrate || nextConfig.width !== previousWidth
									|| nextConfig.height !== previousHeight
									|| (nextConfig.tuning && nextConfig.tuning.bitrate) !== previousTuningBitrate) {
									session.chunkedRecorder.videoEncoder.configure(nextConfig);
								}
							}
							session.stats.adjustBitrate = parseInt(session.stats.adjustBitrate);
						}
						if (session.chunkedRecorder && session.chunkedRecorder.audioEncoder) {
							if (session.chunkedRecorder.audioEncoder.state == "closed") {
								console.log("Video encdoder closed");
								delete session.chunkedRecorder.audioEncoder;
								session.chunkedAudioEnabled = null;
								await session.webCodecAudio();
							}
							if (session.chunkedRecorder && session.chunkedRecorder.audioEncoder && session.chunkedRecorder.audioEncoder.configure && session.chunkedRecorder.audioEncoder.config) {
								session.chunkedRecorder.audioEncoder.configure(session.chunkedRecorder.audioEncoder.config);
							}
						}
					} catch (e) {
						errorlog(e);

						if (session.chunkedTransferChannels) {
							for (var uuid in session.chunkedTransferChannels) {
								session.chunkedTransferChannels[uuid].close();
								if (uuid in session.chunkedTransferChannels) {
									delete session.chunkedTransferChannels[uuid];
								}
								session.chunkedVideoEnabled = null;
								session.chunkedAudioEnabled = null;
								if (session.chunkedRecorder && session.chunkedRecorder.videoEncoder) {
									try {
										session.chunkedRecorder.videoEncoder.close();
									} catch (e) { }
									delete session.chunkedRecorder.videoEncoder;
									await session.webCodec();
								}
								if (session.chunkedRecorder && session.chunkedRecorder.audioEncoder) {
									try {
										session.chunkedRecorder.audioEncoder.close();
										delete session.chunkedRecorder.audioEncoder;
									} catch (e) { }
								}

								setTimeout(
									function (UID) {
										session.chunkedStream(UID);
									},
									1000,
									uuid
								);
							}
						}

						sendTimeout = null;
						return;
					}
				}
				sendTimeout = null;
				session.stats.chunkedInQueue = 0;
			};

			if (session.chunkedRecorder.configVideo) {
				session.chunkedRecorder.videoPromise = session.webCodec(session.chunkedRecorder.configVideo);
			}
			if (session.chunkedRecorder.configAudio) {
				if (session.chunkedRecorder.configAudio.codec == "pcm") {
					session.getPCM(stream, session.chunkedRecorder.configAudio);
				} else {
					session.chunkedRecorder.audioPromise = session.webCodecAudio(session.chunkedRecorder.configAudio);
					trackPendingChunkedAudio(session.chunkedRecorder.audioPromise);
				}
			}

			stream.ended = function (event) {
				warnlog("STREAM ENDED");
				log(event);
			};
		} else {
			warnlog("session.chunkedRecorder is not false");
		}
		if (session.chunkedRecorder.videoPromise) {
			await session.chunkedRecorder.videoPromise;
			delete session.chunkedRecorder.videoPromise;
		}
		if (session.chunkedRecorder.audioPromise) {
			// Synthetic/test audio can take longer to emit its first frame; do not block
			// chunked transport startup on audio warm-up or video will never reach viewers.
			trackPendingChunkedAudio(session.chunkedRecorder.audioPromise);
		}

		if (!UUID) {
			return;
		}
		///////////////////

		var channelName = "chunked"; // max one chunked transfer per peer, so fine to reuse name

		if (UUID in session.pcs) {
			if (!session.chunkedTransferChannels[UUID]) {
				session.chunkedTransferChannels[UUID] = session.pcs[UUID].createDataChannel(channelName, { ordered: true });
			} else {
				errorlog("You might already be connected to this chunked video stream");
				return;
			}
			//	} else if (UUID in session.rpcs){ // this doens't work yet.
			//		session.chunkedTransferChannels[UUID] = session.rpcs[UUID].createDataChannel(channelName, {ordered:true});
		} else {
			warnlog("UUID does not exist");
			return;
		}

		session.chunkedTransferChannels[UUID].contentType = "chunks";

		session.chunkedTransferChannels[UUID].binaryType = "arraybuffer";

		session.chunkedTransferChannels[UUID].header = false;

		session.chunkedTransferChannels[UUID].bufferedAmountLowThreshold = 524288; // 512KB
		session.chunkedTransferChannels[UUID].onbufferedamountlow = function () {
			var health = (session.chunkedRecorder && session.chunkedRecorder.viewerHealth) ? session.chunkedRecorder.viewerHealth[UUID] : null;
			if (health && health.stalled) {
				health.stalled = false;
				health.consecutiveHigh = 0;
				health.reliablePaused = false;
				health.reliableRelieved = false;
				if (health.stallRecoveryTimer) {
					clearTimeout(health.stallRecoveryTimer);
					health.stallRecoveryTimer = null;
				}
			}
			if (session.chunkedRecorder && session.chunkedRecorder.sendChunks) {
				session.chunkedRecorder.sendChunks();
			}
		};

		session.chunkedTransferChannels[UUID].onopen = () => {
			log("chunkedtransfer OPEN");
			var sendChunkedAudio = !!(
				session.chunkedRecorder &&
				session.chunkedRecorder.configAudio &&
				session.pcs[UUID].allowAudio &&
				!(session.pcs[UUID].allowChunked == 2)
			);
			if (sendChunkedAudio && session.chunkedVideoEnabled && session.pcs[UUID].allowVideo) {
				let message = {
					timestamp: session.getChunkedTimestamp(),
					type: "chunkedtransfer",
					chunkProtocol: session.getChunkedOutputProtocol(),
					realTimeVideo: (session.stats.Chunked_video && session.stats.Chunked_video.realTime) || 0,
					realTimeAudio: (session.stats.Chunked_audio && session.stats.Chunked_audio.realTime) || 0,
					size: 99999999999999,
					configVideo: session.chunkedRecorder.configVideo,
					configAudio: session.chunkedRecorder.configAudio,
					recordType: session.chunked,
					filename: channelName + ".webm",
					id: channelName
				};

				log(message);

				session.chunkedTransferChannels[UUID].send(JSON.stringify(message));
			} else if (sendChunkedAudio) {
				let message = {
					timestamp: session.getChunkedTimestamp(),
					type: "chunkedtransfer",
					chunkProtocol: session.getChunkedOutputProtocol(),
					realTimeAudio: (session.stats.Chunked_audio && session.stats.Chunked_audio.realTime) || 0,
					size: 99999999999999,
					configAudio: session.chunkedRecorder.configAudio,
					recordType: session.chunked,
					filename: channelName + ".webm",
					id: channelName
				};

				log(message);

				session.chunkedTransferChannels[UUID].send(JSON.stringify(message));
			} else if (session.chunkedVideoEnabled && session.pcs[UUID].allowVideo) {
				let message = {
					timestamp: session.getChunkedTimestamp(),
					type: "chunkedtransfer",
					chunkProtocol: session.getChunkedOutputProtocol(),
					realTimeVideo: (session.stats.Chunked_video && session.stats.Chunked_video.realTime) || 0,
					size: 99999999999999,
					configVideo: session.chunkedRecorder.configVideo,
					recordType: session.chunked,
					filename: channelName + ".webm",
					id: channelName
				};

				log(message);

				session.chunkedTransferChannels[UUID].send(JSON.stringify(message));
			} // else ..
		};

		session.chunkedTransferChannels[UUID].onclose = () => {
			try {
				var index = session.hostedTransfers.indexOf(session.chunkedTransferChannels[UUID]);
				if (index > -1) {
					session.hostedTransfers.splice(index, 1);
				}
			} catch (e) {
				errorlog(e);
			}

			log("Transfer ended");
			session.chunkedTransferChannels[UUID] = null;
			delete session.chunkedTransferChannels[UUID];

			var cancel = true;
			for (var i = 0; i < session.hostedTransfers.length; i++) {
				if ("contentType" in session.hostedTransfers[i] && session.hostedTransfers[i].contentType == "chunks") {
					cancel = false;
					break;
				}
			}
			if (cancel) {
				warnlog("Cancelling? no more chunked connections. I probalby shouldn't be stopping if recording also.");
				try {
					session.chunkedRecorder.stop();
				} catch (e) { }
				session.chunkedRecorder = false;
			}
		};

		session.chunkedTransferChannels[UUID].onmessage = event => {
			if (event.data) {
				try {
					var data = JSON.parse(event.data);
					if (data.type === "chunkedclock") {
						var clockChannel = session.chunkedTransferChannels[UUID];
						if (clockChannel) {
							clockChannel.send(JSON.stringify({ type: "chunkedclock", timestamp: session.getChunkedTimestamp() }));
						}
					} else if (data.kf) {
						warnlog("chunked-mode KEY FRAME REQUESTED BY A VIEWER");
						session.chunkedRecorder.needKeyFrame = true;
					} else if (data.type === "nack" && session.chunkedRecorder && typeof session.chunkedRecorder.handleNack === "function") {
						session.chunkedRecorder.handleNack(UUID, data);
					}
				} catch (e) {
					//
				}
			}
			// log(event.data);
		};
		session.hostedTransfers.push(session.chunkedTransferChannels[UUID]);
	};

	session.recieveFile = async function (pc, UUID, channel) {
		log("Created transfer channel");

		var transferchannel = channel;
		transferchannel.binaryType = "arraybuffer";

		var receivedBuffers = "";
		var receivedBuffersSize = 0;
		var details = false;
		var idx = false;
		//readable.pipeTo(streamSaver.createWriteStream(transferchannel.label.toString()));
		var writing = 0;
		var file = {};
		//file.writer =  writable.getWriter();;
		/* var downloadFile = (blob, fileName) => {
		  var a = document.createElement('a');
		  var url = window.URL.createObjectURL(blob);
		  a.href = url;
		  a.download = fileName;
		  a.click();
		  window.URL.revokeObjectURL(url);
		  a.remove()
		}; */

		transferchannel.onopen = e => {
			log("Opened transfer channel");
		};

		transferchannel.onmessage = e => {
			if (!details) {
				try {
					details = JSON.parse(e.data);
					if (details.type == "filetransfer") {
						var { readable, writable } = new TransformStream({
							transform: (chunk, ctrl) => chunk.arrayBuffer().then(b => ctrl.enqueue(new Uint8Array(b)))
						});
						file.writer = writable.getWriter();
						readable.pipeTo(streamSaver.createWriteStream(details.filename));

						for (var i = 0; i < transferList.length; i++) {
							if (transferList[i].id == details.id) {
								transferList[i].dc = transferchannel;
								idx = i;
								transferList[idx].status = 2;
								updateDownloadLink(idx);
								break;
							}
						}
					} else {
						errorlog("Not supported; expected 'filetransfer'");
					}
					warnlog(details);
					return;
				} catch (e) {
					errorlog(e);
				}
			}
			try {
				var data = e.data;
				if (data == "EOF1") {
					log("Transfer was completed successfully");
					try {
						transferchannel.close();
					} catch (e) { }
					transferList[idx].status = 3;
					updateDownloadLink(idx);
					return;
				} else if (data == "EOF2") {
					warnlog("Transfer was cnacelled by remote user; parital file saved.");
					try {
						transferchannel.close();
					} catch (e) { }
					transferList[idx].status = 5;
					updateDownloadLink(idx);
					return;
				} else {
					// saving the data chunk. must STREAM to disk, rather than keep in memory; or should.
					try {
						writing += 1;
						try {
							var ab = [new Uint8Array(data)];
							if (file.writer) {
								file.writer.write(new Blob(ab));
							} else {
								//if (transferList[idx].buffer){ // disabling the ability to buffer for now.
								//	transferList[idx].buffer.push(ab[0]);
								//} else {
								//	transferList[idx].buffer = ab;
								//}
							}
						} catch (e) {
							errorlog(e);
						}
						writing -= 1;
						receivedBuffersSize += data.byteLength;
						var completion = receivedBuffersSize / details.size;
						transferList[idx].completed = completion;
						updateDownloadLink(idx);
					} catch (e) {
						errorlog(e);
					}
					return;
				}
			} catch (err) {
				errorlog(err);
			}
		};

		transferchannel.onclose = e => {
			if (writing <= 0) {
				if (file.writer) {
					setTimeout(
						function (writer, writing) {
							if (writing <= 0) {
								writer.close();
								writer = null;
							} else {
								setTimeout(
									function (writer, writing) {
										writer.close();
										writer = null;
									},
									5000,
									writer
								);
							}
						},
						1000,
						file.writer,
						writing
					);
				}
			}

			transferchannel = null;
			return;
		};
		return;
	};

	async function playoutBuffer(dbq, start = false) {
		try {
			dbq.decoder.decode(dbq.queue.shift());
		} catch (e) {
			errorlog(e);
		}
		if (dbq.nextQueue === null && !start) {
			return;
		}
		dbq.nextQueue = setTimeout(
			function (dbq) {
				playoutBuffer(dbq);
			},
			33,
			dbq
		);
	}

	session.refreshChunkedBufferDelay = function (UUID = null) {
		function wakePeer(uuid) {
			if (!session.rpcs || !session.rpcs[uuid] || !Array.isArray(session.rpcs[uuid].chunkedChannels)) {
				return;
			}
			session.rpcs[uuid].chunkedChannels.forEach(function (file) {
				if (file && file.video && file.video.controller && typeof file.video.controller.wake === "function") {
					try {
						file.video.controller.wake();
					} catch (err) {
						errorlog(err);
					}
				}
			});
		}
		if (UUID && session.rpcs && session.rpcs[UUID]) {
			wakePeer(UUID);
			return;
		}
		if (!UUID && session.rpcs) {
			for (var uuid in session.rpcs) {
				wakePeer(uuid);
			}
		}
	};

	session.recieveChunkedStream = async function (UUID, channel) {
		log("Created transfer channel");

		if (!session.rpcs[UUID]) {
			errorlog("no pc[UUID] found");
			return;
		}

		if (!session.rpcs[UUID].chunkedChannels) {
			session.rpcs[UUID].chunkedChannels = [];
		} else {
			session.rpcs[UUID].chunkedChannels.forEach(f2 => {
				if (f2.channel) {
					f2.channel.close();
				}
			});
		}

		var receivedBuffers = "";
		var receivedBuffersSize = 0;
		var details = false;
		var idx = false;

		var file = {};
		file.channel = channel;
		file.chunkedInitializing = false;
		file.chunkedDraining = false;
		file.pendingChunkedMessages = [];
		session.rpcs[UUID].chunkedChannels.push(file);

		file.channel.binaryType = "arraybuffer";

		file.channel.onopen = e => {
			log("Opened transfer channel");
			//session.rpcs[UUID].stats.chunked_mode = "Chunked Stream Active";
			// I probably don't need to do anything, as the viewer; the sender will send when appropropiate?
		};
		file.channel.onclose = async function (e) {
			if (file.chunkedBufferIndicator) file.chunkedBufferIndicator.destroy();
			clearInterval(file.chunkedClockTimer);
			file.chunkedClockTimer = null;
			if (file && file.video && file.video.controller && file.video.controller.destroy) {
				try {
					file.video.controller.destroy();
				} catch (err) {
					errorlog(err);
				}
				file.video.controller = null;
			}
			if (file && file.video && file.video.workerSink && file.video.workerSink.decoder && file.video.workerSink.decoder.destroy) {
				try {
					file.video.workerSink.decoder.destroy();
				} catch (err2) {
					errorlog(err2);
				}
			}
			if (file && file.audio && Array.isArray(file.audio.activeSources)) {
				file.audio.activeSources.forEach(function (source) {
					try {
						source.stop();
					} catch (err3) { }
					try {
						source.disconnect();
					} catch (err4) { }
				});
				file.audio.activeSources = [];
			}
			if (file && file.videoWriter) {
				if (file && file.videoElement.stopWriter) {
					await delay(1000);
					try {
						await file.videoElement.stopWriter();
					} catch (e) { }
				}
			}
			if (session.rpcs[UUID]) {
				//session.rpcs[UUID].stats.chunked_mode = "Chunked Stream Ended";
				delete session.rpcs[UUID].stats.chunked_mode_video;
				delete session.rpcs[UUID].stats.chunked_mode_audio;
				if (Array.isArray(session.rpcs[UUID].chunkedChannels)) {
					const idx = session.rpcs[UUID].chunkedChannels.indexOf(file);
					if (idx > -1) {
						session.rpcs[UUID].chunkedChannels.splice(idx, 1);
					}
				}
			}
			return;
		};

		async function startWriter() {
			var handle = await window.showSaveFilePicker({
				startIn: "videos",
				suggestedName: "myVideo.webm",
				types: [
					{
						description: "Video File",
						accept: { "video/webm": [".webm"] }
					}
				]
			});

			var writeable = await handle.createWritable();
			file.writer_config.fileWriter = writeable;
			file.videoWriter = new WebMWriter(file.writer_config);
			if (file.video) {
				file.video.header = false;
			}

			file.videoElement.stopWriter = async function (estop = false) {
				var videoWriter = file.videoWriter;
				var fileWriter = file.writer_config.fileWriter;
				file.videoElement.stopWriter = false;
				clearInterval(file.updateTime);
				file.updateTime = null;
				var recordingStop = (async function () {
					try {
						// Flush buffered frames and duration before closing, including on hangup.
						await videoWriter.complete();
					} finally {
						await fileWriter.close();
					}
				})();
				if (!file.pendingRecordingStops) {
					file.pendingRecordingStops = [];
				}
				file.pendingRecordingStops.push(recordingStop);
				try {
					await recordingStop;
				} finally {
					file.pendingRecordingStops.splice(file.pendingRecordingStops.indexOf(recordingStop), 1);
				}
			};
			return file.videoWriter;
		}

		const parsedNackAttempts = parseInt(session.chunknackattempts);
		const parsedNackDelay = parseInt(session.chunknackdelay);
		const MAX_NACK_ATTEMPTS = Number.isFinite(parsedNackAttempts) ? Math.max(1, Math.min(20, parsedNackAttempts)) : 3;
		const NACK_RETRY_DELAY_MS = Number.isFinite(parsedNackDelay) ? Math.max(50, Math.min(5000, parsedNackDelay)) : 180;

		function ensureChunkReliabilityState() {
			if (!file.chunkReliability) {
				file.chunkReliability = {
					frames: new Map(),
					order: [],
					current: null,
					pendingResend: null,
					legacyFrameId: 0,
					legacyMode: false,
					stats: { fecRepairs: 0, nacksSent: 0, framesDropped: 0, orphanChunks: 0 }
				};
			}
			return file.chunkReliability;
		}

		function extractMetadata(metaArray) {
			const meta = { timestamp: metaArray[0], type: metaArray[1], extra: null, queueDepth: null };
			for (let i = 2; i < metaArray.length; i++) {
				const value = metaArray[i];
				if (value && typeof value === "object" && !Array.isArray(value)) {
					meta.extra = value;
				} else if (typeof value === "number" && meta.queueDepth === null) {
					meta.queueDepth = value;
				}
			}
			return meta;
		}

		function getFrameState(frameId) {
			const reliability = ensureChunkReliabilityState();
			return reliability.frames.get(frameId >>> 0) || null;
		}

		function parseChunkedMs(value) {
			if (value === false || value === null || typeof value === "undefined") {
				return null;
			}
			const parsed = parseFloat(value);
			return Number.isFinite(parsed) ? parsed : null;
		}

		function getReliabilityFrameBudgetMs() {
			let target = null;
			const rpc = file && file.UUID && session.rpcs ? session.rpcs[file.UUID] : null;
			if (rpc && rpc.stats && rpc.stats.chunked_mode_video) {
				target = parseChunkedMs(rpc.stats.chunked_mode_video.buffer_buffer);
			}
			if (target === null && rpc) {
				target = parseChunkedMs(rpc.buffer);
			}
			if (target === null) {
				target = parseChunkedMs(session.chunkbuffer);
			}
			if (target === null) {
				target = parseChunkedMs(session.buffer);
			}
			if (target === null) {
				target = parseChunkedMs(session.defaultChunkedBuffer);
			}
			if (target === null) {
				target = 200;
			}
			const ceil = parseChunkedMs(session.chunkbufferceil);
			if (ceil !== null) {
				target = Math.min(target, ceil);
			}
			const slack = parseChunkedMs(file.chunkJitterSlack) || parseChunkedMs(session.chunkjitterslack) || 0;
			return Math.max(1000, target + slack + (MAX_NACK_ATTEMPTS * NACK_RETRY_DELAY_MS) + 500);
		}
		function clearFrameWatchdog(state) {
			if (state && state.watchdogTimer) {
				clearTimeout(state.watchdogTimer);
				state.watchdogTimer = null;
			}
		}

		function scheduleFrameWatchdog(state, delayMs) {
			if (!state || state.complete) {
				return;
			}
			clearFrameWatchdog(state);
			state.watchdogTimer = setTimeout(async function () {
				state.watchdogTimer = null;
				if (state.complete) {
					return;
				}
				const age = Date.now() - state.createdAt;
				await tryFinalizeFrame(state);
				if (!state.complete) {
					const budget = getReliabilityFrameBudgetMs();
					if (age >= budget) {
						registerFrameDrop(state);
						markFrameComplete(state, null);
					} else {
						scheduleFrameWatchdog(state, Math.max(NACK_RETRY_DELAY_MS, Math.min(1000, budget - age)));
					}
				}
				await deliverCompletedFrames();
			}, Math.max(50, delayMs || NACK_RETRY_DELAY_MS));
		}

		function initFrameState(meta) {
			const reliability = ensureChunkReliabilityState();
			const extra = meta.extra || {};
			let frameId;
			if (typeof extra.frameId === "number" && Number.isFinite(extra.frameId)) {
				frameId = extra.frameId >>> 0;
			} else {
				reliability.legacyFrameId += 1;
				frameId = reliability.legacyFrameId >>> 0;
			}
			const descriptors = Array.isArray(extra.descriptors) && extra.descriptors.length
				? extra.descriptors
				: [{ index: 0, size: extra.dataBytes || 0, group: 0 }];
			const parityDescriptors = Array.isArray(extra.parityDescriptors) ? extra.parityDescriptors : [];
			const state = {
				frameId,
				timestamp: meta.timestamp,
				type: meta.type,
				media: extra.media || (meta.type === "audio" || meta.type === "pcm" ? "audio" : "video"),
				descriptors,
				parityDescriptors,
				data: new Array(descriptors.length).fill(null),
				parity: new Array(parityDescriptors.length).fill(null),
				nextDataIndex: 0,
				nextParityIndex: 0,
				queueDepth: meta.queueDepth,
				nackAttempts: {},
				complete: false,
				dropped: false,
				assembled: null,
				createdAt: Date.now(),
				watchdogTimer: null,
				nackEnabled: !!extra.nack,
				indexedPayloads: !!extra.indexed
			};
			reliability.frames.set(frameId, state);
			reliability.order.push(frameId);
			reliability.current = state;
			reliability.pendingResend = null;
			reliability.legacyMode = false;
			scheduleFrameWatchdog(state, NACK_RETRY_DELAY_MS);
			return state;
		}

		function requestFrameNack(state, chunkIndex, parity = false) {
			if (!state || !state.nackEnabled) {
				return false;
			}
			const key = `${parity ? "p" : "d"}:${chunkIndex}`;
			const attempts = state.nackAttempts[key] || 0;
			if (attempts >= MAX_NACK_ATTEMPTS) {
				return false;
			}
			state.nackAttempts[key] = attempts + 1;
			setTimeout(() => {
				if (state.complete) {
					return;
				}
				try {
					file.channel.send(
						JSON.stringify({
							type: "nack",
							frameId: state.frameId,
							chunkIndex: chunkIndex,
							parity
						})
					);
					const reliability = ensureChunkReliabilityState();
					reliability.stats.nacksSent += 1;
					if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats) {
						const vStats = session.rpcs[file.UUID].stats.chunked_mode_video = session.rpcs[file.UUID].stats.chunked_mode_video || {};
						vStats.nacks_sent = (vStats.nacks_sent || 0) + 1;
					}
				} catch (err) {
					errorlog(err);
				}
			}, NACK_RETRY_DELAY_MS);
			return true;
		}

		function mergeChunks(chunks) {
			const total = chunks.reduce((sum, chunk) => sum + (chunk ? chunk.byteLength : 0), 0);
			const merged = new Uint8Array(total);
			let offset = 0;
			for (const chunk of chunks) {
				if (!chunk) {
					continue;
				}
				merged.set(chunk, offset);
				offset += chunk.byteLength;
			}
			return merged;
		}

		function attemptParityRepair(state, parityIndex) {
			const descriptor = state.parityDescriptors[parityIndex];
			if (!descriptor) {
				return;
			}
			const start = descriptor.groupStart || 0;
			const size = descriptor.groupSize || state.descriptors.length;
			let missingIndex = -1;
			for (let i = 0; i < size; i++) {
				const idx = start + i;
				if (!state.data[idx]) {
					if (missingIndex !== -1) {
						return; // more than one missing, cannot repair with single parity
					}
					missingIndex = idx;
				}
			}
			if (missingIndex === -1) {
				return;
			}
			const parityChunk = state.parity[parityIndex];
			if (!parityChunk) {
				return;
			}
			const expectedSize = state.descriptors[missingIndex] && state.descriptors[missingIndex].size ? state.descriptors[missingIndex].size : parityChunk.byteLength;
			const recovered = new Uint8Array(parityChunk.byteLength);
			recovered.set(parityChunk);
			for (let i = 0; i < size; i++) {
				const idx = start + i;
				if (idx === missingIndex) {
					continue;
				}
				const chunk = state.data[idx];
				if (!chunk) {
					return; // still missing another chunk
				}
				for (let j = 0; j < recovered.byteLength; j++) {
					recovered[j] ^= j < chunk.byteLength ? chunk[j] : 0;
				}
			}
			state.data[missingIndex] = recovered.slice(0, expectedSize);
			const reliability = ensureChunkReliabilityState();
			reliability.stats.fecRepairs += 1;
			if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats) {
				const vStats = session.rpcs[file.UUID].stats.chunked_mode_video = session.rpcs[file.UUID].stats.chunked_mode_video || {};
				vStats.fec_repairs = (vStats.fec_repairs || 0) + 1;
			}
		}

		function markFrameComplete(state, assembled) {
			clearFrameWatchdog(state);
			state.complete = true;
			state.assembled = assembled || null;
			const reliability = ensureChunkReliabilityState();
			if (reliability.current === state) {
				reliability.current = null;
			}
		}

		function isVideoReliabilityFrame(state) {
			return state && (state.media === "video" || state.type === "key" || state.type === "delta" || state.type === "video");
		}

		function requestReliabilityKeyframe() {
			try {
				if (file.dc && file.dc.readyState === "open") {
					if (!file.requestKeyframe) {
						file.dc.send(JSON.stringify({ kf: true }));
						file.requestKeyframe = setTimeout(function () {
							clearTimeout(file.requestKeyframe);
							file.requestKeyframe = null;
						}, 1000);
					}
				}
			} catch (err) {
				errorlog(err);
			}
		}

		function registerFrameDrop(state) {
			const reliability = ensureChunkReliabilityState();
			const alreadyAwaitingKeyframe = !!reliability.awaitingKeyframe;
			reliability.stats.framesDropped = (reliability.stats.framesDropped || 0) + 1;
			if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats) {
				const vStats = session.rpcs[file.UUID].stats.chunked_mode_video = session.rpcs[file.UUID].stats.chunked_mode_video || {};
				vStats.frames_dropped = (vStats.frames_dropped || 0) + 1;
				if (isVideoReliabilityFrame(state)) {
					vStats.awaiting_keyframe = true;
				}
			}
			if (isVideoReliabilityFrame(state)) {
				reliability.awaitingKeyframe = true;
				if (!alreadyAwaitingKeyframe && file.resetChunkedVideoDecoder) {
					file.resetChunkedVideoDecoder(false);
				} else if (!alreadyAwaitingKeyframe) {
					requestReliabilityKeyframe();
				}
			}
			state.dropped = true;
		}

		async function tryFinalizeFrame(state) {
			if (!state || state.complete) {
				return;
			}
			const missing = [];
			for (let i = 0; i < state.data.length; i++) {
				if (!state.data[i]) {
					missing.push(i);
				}
			}
			if (!missing.length) {
				markFrameComplete(state, mergeChunks(state.data));
				return;
			}
			if (!state.nackEnabled) {
				// FEC-only frames may still receive a late parity payload. The frame
				// watchdog owns the playout deadline and will drop it at that budget.
				return;
			}
			let requested = false;
			missing.forEach(idx => {
				requested = requestFrameNack(state, idx) || requested;
			});
			const exhausted = !requested && missing.every(idx => (state.nackAttempts[`d:${idx}`] || 0) >= MAX_NACK_ATTEMPTS);
			if (exhausted) {
				registerFrameDrop(state);
				markFrameComplete(state, null);
			}
		}

		async function deliverCompletedFrames() {
			const reliability = ensureChunkReliabilityState();
			while (reliability.order.length) {
				const frameId = reliability.order[0];
				const state = reliability.frames.get(frameId);
				if (!state || !state.complete) {
					break;
				}
				reliability.order.shift();
				reliability.frames.delete(frameId);
				if (state.dropped || !state.assembled) {
					continue;
				}
				if (isVideoReliabilityFrame(state) && reliability.awaitingKeyframe) {
					if (state.type !== "key") {
						registerFrameDrop(state);
						continue;
					}
					reliability.awaitingKeyframe = false;
					if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats && session.rpcs[file.UUID].stats.chunked_mode_video) {
						session.rpcs[file.UUID].stats.chunked_mode_video.awaiting_keyframe = false;
					}
				}
				await file.processFrame({
					data: state.assembled,
					timestamp: state.timestamp,
					type: state.type
				});
			}
		}

		async function handleMetadataPacket(metaArray) {
			const reliability = ensureChunkReliabilityState();
			const meta = extractMetadata(metaArray);
			if (!meta.extra || typeof meta.extra !== "object") {
				reliability.legacyMode = true;
				reliability.current = null;
				reliability.pendingResend = null;
				file.frameMeta = metaArray;
				return;
			}
			if (meta.extra.resend) {
				const frameState = getFrameState(meta.extra.frameId);
				if (!frameState) {
					return;
				}
				reliability.pendingResend = {
					frame: frameState,
					parity: !!meta.extra.parity,
					chunkIndex: Number.isFinite(meta.extra.chunkIndex) ? parseInt(meta.extra.chunkIndex) : 0,
					parityIndex: Number.isFinite(meta.extra.parityIndex) ? parseInt(meta.extra.parityIndex) : (Number.isFinite(meta.extra.chunkIndex) ? parseInt(meta.extra.chunkIndex) : 0)
				};
				return;
			}
			if (reliability.current && !reliability.current.complete) {
				const prior = reliability.current;
				await tryFinalizeFrame(prior);
				if (!prior.complete) {
					const age = Date.now() - prior.createdAt;
					const budget = getReliabilityFrameBudgetMs();
					if (age >= budget) {
						registerFrameDrop(prior);
						markFrameComplete(prior, null);
					} else {
						scheduleFrameWatchdog(prior, Math.max(NACK_RETRY_DELAY_MS, Math.min(1000, budget - age)));
					}
				}
				await deliverCompletedFrames();
			}
			const state = initFrameState(meta);
			if (state.data.length === 0) {
				state.data = [null];
			}
		}

		async function handleIndexedChunkPayload(packet) {
			const target = getFrameState(packet.frameId);
			if (!target) {
				const reliability = ensureChunkReliabilityState();
				reliability.stats.orphanChunks = (reliability.stats.orphanChunks || 0) + 1;
				if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats) {
					const vStats = session.rpcs[file.UUID].stats.chunked_mode_video = session.rpcs[file.UUID].stats.chunked_mode_video || {};
					vStats.orphan_chunks = (vStats.orphan_chunks || 0) + 1;
				}
				return;
			}
			if (!target.indexedPayloads || target.complete) {
				return;
			}
			const chunkIndex = parseInt(packet.chunkIndex);
			if (!Number.isFinite(chunkIndex) || chunkIndex < 0) {
				return;
			}
			if (packet.parity) {
				if (chunkIndex >= target.parity.length) {
					return;
				}
				target.parity[chunkIndex] = packet.data;
				attemptParityRepair(target, chunkIndex);
			} else {
				if (chunkIndex >= target.data.length) {
					return;
				}
				target.data[chunkIndex] = packet.data;
			}
			let complete = true;
			for (let i = 0; i < target.data.length; i++) {
				if (!target.data[i]) {
					complete = false;
					break;
				}
			}
			if (complete) {
				markFrameComplete(target, mergeChunks(target.data));
				await deliverCompletedFrames();
			}
		}

		async function handleChunkPayload(payload) {
			const reliability = ensureChunkReliabilityState();
			const data = payload instanceof Uint8Array ? payload : new Uint8Array(payload);
			const indexedPacket = parseIndexedChunkPayload(data);
			if (indexedPacket) {
				await handleIndexedChunkPayload(indexedPacket);
				return;
			}
			if (reliability.legacyMode) {
				await handleLegacyPayload(data);
				return;
			}
			if (reliability.pendingResend) {
				const target = reliability.pendingResend.frame;
				if (target) {
					if (reliability.pendingResend.parity) {
						target.parity[reliability.pendingResend.parityIndex] = data;
						attemptParityRepair(target, reliability.pendingResend.parityIndex);
					} else {
						target.data[reliability.pendingResend.chunkIndex] = data;
					}
					await tryFinalizeFrame(target);
					await deliverCompletedFrames();
				}
				reliability.pendingResend = null;
				return;
			}
			const state = reliability.current;
			if (!state) {
				return;
			}
			if (state.nextDataIndex < state.data.length) {
				state.data[state.nextDataIndex] = data;
				state.nextDataIndex += 1;
				if (state.nextDataIndex === state.data.length && state.parity.length === 0) {
					await tryFinalizeFrame(state);
					reliability.current = null;
					await deliverCompletedFrames();
				}
				return;
			}
			if (state.nextParityIndex < state.parity.length) {
				state.parity[state.nextParityIndex] = data;
				attemptParityRepair(state, state.nextParityIndex);
				state.nextParityIndex += 1;
				if (state.nextParityIndex === state.parity.length) {
					await tryFinalizeFrame(state);
					reliability.current = null;
					await deliverCompletedFrames();
				}
				return;
			}
			await handleLegacyPayload(data);
		}

		async function handleLegacyPayload(payload) {
			if (payload.byteLength >= 262144) {
				if (file.buffer) {
					const tmp = new Uint8Array(file.buffer.length + payload.byteLength);
					tmp.set(file.buffer);
					tmp.set(payload, file.buffer.length);
					file.buffer = tmp;
				} else {
					file.buffer = new Uint8Array(payload);
				}
				return;
			}
			if (file.buffer) {
				const tmp = new Uint8Array(file.buffer.length + payload.byteLength);
				tmp.set(file.buffer);
				tmp.set(payload, file.buffer.length);
				file.buffer = null;
				await file.processFrame({ data: tmp, timestamp: file.frameMeta[0], type: file.frameMeta[1] });
			} else {
				await file.processFrame({ data: payload, timestamp: file.frameMeta[0], type: file.frameMeta[1] });
			}
		}

		file.channel.onmessage = async function (e) {
			if ((file.chunkedInitializing || file.chunkedDraining) && !e.chunkedDrain) {
				file.pendingChunkedMessages.push(e.data);
				return;
			}
			if (!details) {
				file.chunkedInitializing = true;
				try {
					let tmp = JSON.parse(e.data);

					if (tmp.type == "chunkedtransfer") {
						log("GOT CHUNKED DETAILS");

						details = tmp;

						if (session.retransmit) {
							session.retransmitChunkedStream(details, file.channel); // these should be the real details
						}

						log("CHUNKED DETAILS");
						log(details);
						file.details = details;
						file.UUID = UUID;
						file.completed = 0;
						file.status = 2;

						file.time = Date.now();
						file.theirtime = details.timestamp;
						file.remoteTimestampBase = details.timestamp || file.time;
						file.timedelta = file.time - file.remoteTimestampBase;
						if (typeof performance !== "undefined" && performance.now) {
							file.performanceStart = performance.now();
							file.getRemoteNow = function () {
								return file.remoteTimestampBase + (performance.now() - file.performanceStart);
							};
						} else {
							file.getRemoteNow = function () {
								return Date.now() - file.timedelta;
							};
						}

						// A delayed first header must not permanently bias the remote clock.
						// Fresh samples can reduce that delay without assuming synchronized PCs.
						file.updateChunkedClock = function (timestamp) {
							if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) { return; }
							var correction = timestamp - file.getRemoteNow();
							if (correction <= 10) { return; }
							file.remoteTimestampBase += correction;
							file.timedelta -= correction;
							if (file.video && file.video.controller) { file.video.controller.wake(); }
						};
						file.chunkedClockTimer = setInterval(function () {
							// Relays retain their existing clock domain; do not forward samples
							// from an upstream publisher as if they came from the relay itself.
							if (!session.retransmit && file.channel.readyState === "open") {
								try { file.channel.send(JSON.stringify({ type: "chunkedclock" })); } catch (clockError) { errorlog(clockError); }
							}
						}, 5000);

						file.dc = file.channel;
						file.id = details.id;
						file.updateTime = null;
						file.buffer = false;

						if (!session.rpcs[UUID].videoElement) {
							session.rpcs[UUID].videoElement = createVideoElement();
						}
						file.videoElement = session.rpcs[UUID].videoElement;

						if (!session.rpcs[UUID].videoElement.srcObject) {
							session.rpcs[UUID].videoElement.srcObject = createMediaStream(); // updateIncomingVideoElement
						}

						if (!session.rpcs[UUID].streamSrc) {
							session.rpcs[UUID].streamSrc = createMediaStream();
						}

						file.streamSrc = session.rpcs[UUID].streamSrc;

						file.videoElement.autoplay = true;
						file.videoElement.muted = false;
						file.videoElement.setAttribute("playsinline", "");
						file.videoElement.dataset.sid = session.rpcs[UUID].streamID;
						file.videoElement.id = "videosource_" + UUID;
						file.videoElement.dataset.UUID = UUID;
						file.videoElement.chunkedtransfer = true;

						if (session.rpcs[UUID].mirrorState) {
							applyMirrorGuest(
								session.rpcs[UUID].mirrorState,
								session.rpcs[UUID].videoElement,
								session.rpcs[UUID].flipState
							);
						}

						if (session.rpcs[UUID].rotate !== false) {
							session.rpcs[UUID].videoElement.rotated = session.rpcs[UUID].rotate;
							session.rpcs[UUID].videoElement.dataset.rotated = session.rpcs[UUID].rotate;
						}

						file.videoElement.addEventListener(
							"playing",
							e => {
								try {
									var bigPlayButton = document.getElementById("bigPlayButton");
									if (bigPlayButton) {
										bigPlayButton.parentNode.removeChild(bigPlayButton);
									}
								} catch (e) { }

								file.playing = true;
								if (file.audioContext) {
									file.audioContext.resume();
								} else if (session.audioCtx) {
									session.audioCtx.resume();
								}
								// might need to resume the main one as well?
								try {
									if (session.pip) {
										if (v.readyState >= 3) {
											if (!v.pip) {
												v.pip = true;
												toggleSystemPip(v, true);
											}
										}
									}
								} catch (e) { }
							},
							{ once: true }
						);

						file.videoElement.addEventListener("error", function (e) {
							errorlog(e);
						});

						file.videoElement.startWriter = startWriter;

						file.videoElement.oncanplay = function () {
							updateMixer();
						};

						file.videoWriter = false;
						file.frameMeta = false;

						file.writer_config = {};
						file.writer_config.video = false;
						file.writer_config.audio = false;
						file.chunkJitterSlack = Number.isFinite(parseFloat(session.chunkjitterslack)) ? parseFloat(session.chunkjitterslack) : 0;

						file.stream_configVideo = false;
						file.stream_configAudio = false;

						file.init_video = false;
						file.init_audio = false;
						file.video = false;
						file.audio = false;
						file.promise_audio = false;
						file.playing = false;
						file.video_session = 1;

						////// START OF VIDEO
						if (details.configVideo) {
							session.rpcs[UUID].stats.chunked_mode_video = details.configVideo;
							file.chunkedDecodeStartedAt = new Map();
							file.recordChunkedVideoDecodeStart = function (frame) {
								if (!frame || typeof frame.timestamp === "undefined") {
									return null;
								}
								const timestampKey = String(frame.timestamp);
								file.chunkedDecodeStartedAt.set(timestampKey, performance.now());
								while (file.chunkedDecodeStartedAt.size > 240) {
									const oldestKey = file.chunkedDecodeStartedAt.keys().next().value;
									file.chunkedDecodeStartedAt.delete(oldestKey);
								}
								return timestampKey;
							};
							file.recordChunkedVideoDecodeComplete = function (timestamp, elapsedMs) {
								if (file.chunkedBufferIndicator) file.chunkedBufferIndicator.decoded(timestamp);
								const timestampKey = String(timestamp);
								const startedAt = file.chunkedDecodeStartedAt.get(timestampKey);
								file.chunkedDecodeStartedAt.delete(timestampKey);
								let sampleMs = parseFloat(elapsedMs);
								if (!Number.isFinite(sampleMs) && typeof startedAt === "number" && Number.isFinite(startedAt)) {
									sampleMs = performance.now() - startedAt;
								}
								if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats) {
									const stats = session.rpcs[file.UUID].stats.chunked_mode_video = session.rpcs[file.UUID].stats.chunked_mode_video || {};
									updateChunkedDecodeLatencyStat(stats, sampleMs);
								}
							};
							file.decodeChunkedVideoFrame = function (frame) {
								const timestampKey = file.recordChunkedVideoDecodeStart(frame);
								try {
									file.video.decoder.decode(frame);
								} catch (error) {
									if (timestampKey !== null) {
										file.chunkedDecodeStartedAt.delete(timestampKey);
									}
									throw error;
								}
							};

							file.stream_configVideo = {};
							const streamWidth = sanitizeChunkDimension(parseInt(details.configVideo.width) || 1280, 2);
							const streamHeight = sanitizeChunkDimension(parseInt(details.configVideo.height) || 720, 2);
							file.stream_configVideo.width = streamWidth;
							file.stream_configVideo.height = streamHeight;
							file.stream_configVideo.codec = details.configVideo.codec || "vp09.00.10.08";

							file.writer_config.video = true;
							file.writer_config.width = streamWidth;
							file.writer_config.height = streamHeight;

							if (details.configVideo.codec == "vp09.00.10.08") {
								file.writer_config.codec = "VP9";
							} else if (details.configVideo.codec == "av01.0.04M.08") {
								file.writer_config.codec = "AV1";
							} else if (details.configVideo.codec == "av1") {
								file.writer_config.codec = "AV1";
							} else if (details.configVideo.codec == "vp8") {
								file.writer_config.codec = "VP8";
							} else if (details.configVideo.codec == "h264" || details.configVideo.codec.indexOf("avc1.") === 0) {
								file.writer_config.codec = "H264";
							} else {
								file.writer_config.codec = "VP9"; // whatever goes here instead
							}

							file.requestChunkedVideoKeyframe = function () {
								try {
									if (file.dc && file.dc.readyState === "open" && !file.requestKeyframe) {
										file.dc.send(JSON.stringify({ kf: true }));
										file.requestKeyframe = setTimeout(function () {
											clearTimeout(file.requestKeyframe);
											file.requestKeyframe = null;
										}, 1000);
									}
								} catch (e) {
									errorlog(e);
								}
							};

							file.resetChunkedVideoDecoder = function (countDecoderError) {
								const now = Date.now();
								if (file.chunkedDecoderResetUntil && now < file.chunkedDecoderResetUntil) {
									if (file.requestChunkedVideoKeyframe) {
										file.requestChunkedVideoKeyframe();
									}
									return;
								}
								file.chunkedDecoderResetUntil = now + 250;
								if (file.chunkedDecodeStartedAt) {
									file.chunkedDecodeStartedAt.clear();
								}
								if (file.video) {
									if (file.video.decoder && file.video.decoder.isChunkedWorkerProxy) {
										try {
											file.video.decoder.reset(file.stream_configVideo);
										} catch (e) {
											errorlog(e);
										}
									} else if (file.video.decoder) {
										try {
											if (file.video.decoder.state !== "closed") {
												file.video.decoder.close();
											}
										} catch (e) {}
										try {
											file.video.decoder = new VideoDecoder(file.init_video);
											file.video.decoder.configure(file.stream_configVideo);
										} catch (e) {
											errorlog(e);
										}
									}
									file.video.playbackheader = false;
									file.video.queue = [];
									file.video.nextQueue = null;
									if (file.video.controller && file.video.controller.destroy) {
										try {
											file.video.controller.destroy();
										} catch (e) {}
									}
									file.video.controller = null;
								}
								if (file.vosc) {
									try {
										file.vosc.onended = null;
										file.vosc.stop(0);
									} catch (e) {}
									try {
										file.vosc.disconnect();
									} catch (e) {}
									file.vosc = false;
								}
								if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats) {
									const vStats = session.rpcs[file.UUID].stats.chunked_mode_video = session.rpcs[file.UUID].stats.chunked_mode_video || {};
									if (countDecoderError !== false) {
										vStats.decoder_errors = (vStats.decoder_errors || 0) + 1;
									}
									vStats.awaiting_keyframe = true;
								}
								if (file.chunkReliability) {
									file.chunkReliability.awaitingKeyframe = true;
								}
								file.requestChunkedVideoKeyframe();
							};

							file.init_video = {
								output: frame => {
									file.recordChunkedVideoDecodeComplete(frame.timestamp);
									try {
										file.video.frameWriter.write(frame).catch(err => { });
									} catch (e) { }
								},
								error: e => {
									if (file.resetChunkedVideoDecoder) {
										file.resetChunkedVideoDecoder(true);
									}
									if (file.video.decoder.state == "closed") {
										errorlog(e.message);
										warnlog("CLOSED");
									} else {
										errorlog(e.message);
									}
								}
							};
							file.video = {};
							if (typeof MediaStreamTrackGenerator === "function") {
								file.video.generator = new MediaStreamTrackGenerator({ kind: "video" });
								file.video.stream = new MediaStream([file.video.generator]);
								file.video.frameWriter = file.video.generator.writable.getWriter();
								file.video.decoder = new VideoDecoder(file.init_video);
								file.video.decoder.configure(file.stream_configVideo);
							} else {
								var workerSupport = await session.ensureChunkedWorkerSupport();
								if (!workerSupport || !workerSupport.videoTrackGenerator || !workerSupport.videoDecoder) {
									throw new Error("This browser cannot create a chunked video output track");
								}
								var workerVideoSink = await session.createChunkedWorkerVideoSink(
									file.stream_configVideo,
									function (error) {
										errorlog(error);
										if (file.resetChunkedVideoDecoder) {
											file.resetChunkedVideoDecoder(true);
										}
									},
									function (timestamp, latencyMs) {
										file.recordChunkedVideoDecodeComplete(timestamp, latencyMs);
									}
								);
								file.video.workerSink = workerVideoSink;
								file.video.generator = workerVideoSink.track;
								file.video.stream = new MediaStream([workerVideoSink.track]);
								file.video.frameWriter = false;
								file.video.decoder = workerVideoSink.decoder;
							}
							file.video.queue = [];
							file.video.nextQueue = null;
							file.video.playbackheader = false;
							file.video.header = false;

							if ("realTimeVideo" in details) {
								file.video.realTime = details.realTimeVideo;
							}

							file.streamSrc.addTrack(file.video.stream.getVideoTracks()[0]);
						}
						/////// END OF VIDEO

						const resolveChunkedBufferTarget = function (type = "video", fallback = 200) {
							const rpc = session.rpcs[file.UUID];
							const parseBufferSetting = value => {
								if (value === false || value === null || value === undefined) {
									return null;
								}
								const parsed = parseFloat(value);
								return Number.isFinite(parsed) ? parsed : null;
							};
							// Keep resolution pure so defaults can keep affecting active peers until
							// a per-peer override is explicitly set.
							const defaultSetting = parseBufferSetting(session.defaultChunkedBuffer);
							const chunkBufferSetting = parseBufferSetting(session.chunkbuffer);
							const audioBufferSetting = parseBufferSetting(session.audioBuffer);
							const initialSetting = type === "video" ? chunkBufferSetting : (audioBufferSetting !== null ? audioBufferSetting : chunkBufferSetting);
							const globalSetting = parseBufferSetting(session.buffer);
							const rpcSetting = rpc ? parseBufferSetting(rpc.buffer) : null;
							let buffer = fallback;
							if (defaultSetting !== null) {
								buffer = defaultSetting;
							}
							if (initialSetting !== null) {
								buffer = initialSetting;
							}
							if (globalSetting !== null) {
								buffer = globalSetting;
							}
							if (rpcSetting !== null) {
								buffer = rpcSetting;
							}
							const bufferFloor = parseBufferSetting(type === "video" ? session.chunkbufferfloor : null);
							const bufferCeil = parseBufferSetting(type === "video" ? session.chunkbufferceil : null);
							const clampMin = bufferFloor !== null ? bufferFloor : 0;
							const sharedAvTarget = !!details.configAudio && audioBufferSetting === null;
							const clampMaxDefault = type === "audio" || sharedAvTarget ? 30000 : 180000;
							let clampMax = bufferCeil !== null ? bufferCeil : clampMaxDefault;
							if (sharedAvTarget) {
								clampMax = Math.min(clampMax, 30000);
							}
							if (session.chunkbufferadaptive !== false && typeof session.calculateOptimalBufferSize === "function") {
								try {
									const adaptive = session.calculateOptimalBufferSize(file.UUID, { media: type, base: buffer, clamp: { min: clampMin, max: clampMax } });
									if (typeof adaptive === "number" && !Number.isNaN(adaptive)) {
										buffer = adaptive;
									}
								} catch (err) {
									errorlog(err);
								}
							}
							if (!Number.isFinite(buffer)) {
								buffer = fallback;
							}
							buffer = Math.max(clampMin, Math.min(buffer, clampMax));
							return buffer;
						};

						if (details.configVideo) {
							if (file.chunkedBufferIndicator) file.chunkedBufferIndicator.destroy();
							file.chunkedBufferIndicator = createChunkedBufferIndicator(file, function () {
								return resolveChunkedBufferTarget("video", 200);
							});
						}

						///// START AUDIO

						file.setupChunkedAudio = async function (configAudio, realTimeAudio) {
							if (!configAudio) {
								return false;
							}
							if (file.audio || file.PCMSource) {
								if (typeof realTimeAudio === "number" && file.audio) {
									file.audio.realTime = realTimeAudio;
								}
								return false;
							}
							//details.configAudio.sampleRate = 48000; // over-riding things for now
							//details.configAudio.numberOfChannels = 1;  //

							session.rpcs[UUID].stats.chunked_mode_audio = configAudio;

							file.stream_configAudio = configAudio;

							file.writer_config.audio = true;
							file.writer_config.samplingFrequency = configAudio.sampleRate || 48000;
							file.writer_config.channels = configAudio.numberOfChannels || 1;

							// PCM AUDIO
							//} else  // disabled
							if (file.stream_configAudio.codec && file.stream_configAudio.codec == "pcm") {
								// pcm audio; raw capture using deprecated browser API
								if (!file.destination) {
									file.destination = session.audioCtx.createMediaStreamDestination();
								} else {
									file.streamSrc.getAudioTracks().forEach(trk => {
										file.streamSrc.removeTrack(trk);
									});
								}
								file.destination.stream.getAudioTracks().forEach(trk => {
									file.streamSrc.addTrack(trk);
								});
								file.PCMSource = true;

								// LEGACY AUDIO
							} else {
								// not SharedBufferArray, but also needs decoding

								if (!file.audio) {
									file.audio = {};
								}
								file.audio.queue = [];
								//file.audio.lastPlayTime = 0;
								file.audio.nextQueue = null;

								if (typeof realTimeAudio === "number") {
									file.audio.realTime = realTimeAudio;
								} else {
									errorlog("No realtime");
								}

								//file.destination.stream.getAudioTracks().forEach(trk=>{
								//	file.streamSrc.addTrack(trk);
								//});

								file.init_audio = {
									output: frame => {
										const chunkTimestamp = typeof frame.timestamp === "number" ? frame.timestamp : 0;
										file.audio.frameWriter.write(frame);
										if (file.audio.usesAudioDataSink && typeof frame.close === "function") {
											frame.close();
										}

										const rpc = session.rpcs[file.UUID];
										if (!rpc || !rpc.stats || !rpc.stats.chunked_mode_audio) {
											return;
										}

										if (file.audioTime) {
											return;
										}

										const statsAudio = rpc.stats.chunked_mode_audio;
										const remoteNow = typeof file.getRemoteNow === "function" ? file.getRemoteNow() : Date.now() - (file.timedelta || 0);
										const realTimeOffset = file.audio.realTime || 0;
										const baseDelta = chunkTimestamp / 1000 - (remoteNow - realTimeOffset);
										const hardwareLatencyMs = ((session.audioCtx.baseLatency || 0) + (session.audioCtx.outputLatency || 0)) * 1000;

										if (!file.audio.bufferState) {
											file.audio.bufferState = {
												targetMs: 200,
												minLead: 24,
												rejoinMargin: 120,
												rebuffering: false
											};
										}

										const audioState = file.audio.bufferState;
										const audioTargetMs = audioState.targetMs == null ? 200 : audioState.targetMs;
										const bufferTarget = resolveChunkedBufferTarget("audio", audioTargetMs);
										audioState.targetMs = bufferTarget;
										if (bufferTarget === 0) {
											audioState.minLead = 0;
											audioState.rejoinMargin = 0;
										} else {
											audioState.minLead = Math.max(20, Math.min(100, bufferTarget * 0.12));
											let audioRejoin = Math.max(audioState.minLead, bufferTarget * 0.25);
											const slack = Number.isFinite(file.chunkJitterSlack) ? file.chunkJitterSlack : 0;
											if (slack > 0) {
												audioRejoin += slack;
											}
											audioState.rejoinMargin = audioRejoin;
										}

										const bufferLevel = baseDelta + bufferTarget;
										if (!audioState.rebuffering && bufferTarget > 0 && bufferLevel < audioState.minLead) {
											audioState.rebuffering = true;
											audioState.lastUnderflow = Date.now();
											statsAudio.last_underflow = audioState.lastUnderflow;
										}
										if (audioState.rebuffering && (bufferTarget === 0 || bufferLevel >= bufferTarget - audioState.rejoinMargin)) {
											audioState.rebuffering = false;
										}

										let desiredBufferMs;
										if (bufferTarget === 0) {
											desiredBufferMs = Math.max(0, bufferLevel);
										} else if (audioState.rebuffering) {
											desiredBufferMs = Math.max(bufferTarget, audioState.minLead);
										} else {
											desiredBufferMs = Math.max(audioState.minLead, bufferLevel);
										}

										let playoutDelayMs = desiredBufferMs - hardwareLatencyMs;
										if (playoutDelayMs < 0 || !Number.isFinite(playoutDelayMs)) {
											playoutDelayMs = 0;
										}

										statsAudio.buffer_dateNow = Date.now();
										statsAudio.buffer_timedelta = file.timedelta;
										statsAudio.buffer_realTime = file.audio.realTime;
										statsAudio.buffer_timestamp = chunkTimestamp;
										statsAudio.buffer_delta = playoutDelayMs;
										statsAudio.buffer_buffer = bufferTarget;
										statsAudio.buffer_baseLatency = (session.audioCtx.baseLatency || 0) * 1000;
										statsAudio.buffer_outputLatency = (session.audioCtx.outputLatency || 0) * 1000;
										const audioOccupancy = Math.max(0, desiredBufferMs);
										statsAudio.buffer_lead = Math.round(baseDelta);
										statsAudio.buffer_level = Math.round(audioOccupancy);
										statsAudio.rebuffering = audioState.rebuffering;

										try {
											if (file.delayNode.delayTime.setTargetAtTime) {
												file.delayNode.delayTime.setTargetAtTime(playoutDelayMs / 1000.0, session.audioCtx.currentTime, 0.05);
											} else {
												file.delayNode.delayTime.setValueAtTime(playoutDelayMs / 1000.0, session.audioCtx.currentTime);
											}
										} catch (err) {
											errorlog(err);
										}

										const timeoutMs = Math.max(10, playoutDelayMs);
										file.audioTime = setTimeout(function () {
											file.audioTime = null;
										}, timeoutMs);
									},
									error: e => {
										if (file.audio.decoder.state == "closed") {
											errorlog(e.message);
											warnlog("CLOSED");
										} else {
											errorlog(e.message);
										}
									}
								};
								file.audio.decoder = new AudioDecoder(file.init_audio);
								file.audio.decoder.configure(file.stream_configAudio);

								//file.audioContext = new AudioContext({ sampleRate: file.writer_config.samplingFrequency, latencyHint: "playback" });
								//file.audioContext.suspend();

								file.delayNode = session.audioCtx.createDelay(30);
								file.delayNode.delayTime.value = 0; // delayTime takes it in seconds.
								if (typeof MediaStreamTrackGenerator === "function") {
									file.audio.generator = new MediaStreamTrackGenerator({ kind: "audio" });
									file.audio.frameWriter = file.audio.generator.writable.getWriter();
									file.audio.stream = new MediaStream([file.audio.generator]);
									file.audio.audioNode = session.audioCtx.createMediaStreamSource(file.audio.stream);
								} else {
									file.audio.usesAudioDataSink = true;
									file.audio.audioNode = session.audioCtx.createGain();
									file.audio.playbackAnchorTime = null;
									file.audio.nextPlaybackTime = null;
									file.audio.activeSources = [];
									file.audio.maxActiveSources = 1600;
									file.audio.frameWriter = {
										write: function (audioData) {
											if (session.audioCtx.state !== "running") {
												// Web Audio's clock does not advance while autoplay is blocked.
												// Do not accumulate stale real-time audio for a later burst.
												file.audio.playbackAnchorTime = null;
												file.audio.nextPlaybackTime = null;
												return Promise.resolve();
											}
											var sampleRate = audioData.sampleRate || file.writer_config.samplingFrequency || session.audioCtx.sampleRate;
											var channelCount = audioData.numberOfChannels || file.writer_config.channels || 1;
											var frameCount = audioData.numberOfFrames || Math.max(1, Math.round((audioData.duration || 20000) * sampleRate / 1000000));
											var audioBuffer = session.audioCtx.createBuffer(channelCount, frameCount, sampleRate);
											for (var channelIndex = 0; channelIndex < channelCount; channelIndex++) {
												var channelData = audioBuffer.getChannelData(channelIndex);
												try {
													audioData.copyTo(channelData, { planeIndex: channelIndex, format: "f32-planar" });
												} catch (copyError) {
													audioData.copyTo(channelData, { planeIndex: channelIndex });
												}
											}
											var timestampSeconds = (typeof audioData.timestamp === "number" ? audioData.timestamp : 0) / 1000000;
											var currentTime = session.audioCtx.currentTime;
											if (file.audio.playbackAnchorTime === null) {
												file.audio.playbackAnchorTime = currentTime - timestampSeconds;
											}
											var scheduledTime = file.audio.playbackAnchorTime + timestampSeconds;
											if (scheduledTime < currentTime - 0.1) {
												file.audio.playbackAnchorTime += currentTime - scheduledTime;
												scheduledTime = currentTime;
											}
											if (file.audio.nextPlaybackTime !== null && scheduledTime < file.audio.nextPlaybackTime) {
												scheduledTime = file.audio.nextPlaybackTime;
											}
											var source = session.audioCtx.createBufferSource();
											source.buffer = audioBuffer;
											source.connect(file.audio.audioNode);
											file.audio.activeSources.push(source);
											while (file.audio.activeSources.length > file.audio.maxActiveSources) {
												var staleSource = file.audio.activeSources.shift();
												try {
													staleSource.stop();
												} catch (stopError) { }
												try {
													staleSource.disconnect();
												} catch (disconnectError) { }
											}
											source.onended = function () {
												try {
													source.disconnect();
												} catch (error) { }
												var sourceIndex = file.audio.activeSources.indexOf(source);
												if (sourceIndex >= 0) {
													file.audio.activeSources.splice(sourceIndex, 1);
												}
											};
											source.start(Math.max(currentTime, scheduledTime));
											file.audio.nextPlaybackTime = Math.max(currentTime, scheduledTime) + audioBuffer.duration;
											return Promise.resolve();
										}
									};
								}
								file.audio.audioNode.connect(file.delayNode);

								file.destination = session.audioCtx.createMediaStreamDestination();
								file.delayNode.connect(file.destination);

								file.destination.stream.getAudioTracks().forEach(trk => {
									file.streamSrc.addTrack(trk);
								});
							}
							return true;
						};
						await file.setupChunkedAudio(details.configAudio, details.realTimeAudio);

						warnlog(details);
						/* 
						if (details.realTimeAudio){
							file.audio.realTime = details.realTimeAudio
						} 
						if (details.realTimeVideo){
							file.video.realTime = details.realTimeVideo
						} */
						setupIncomingVideoTracking(session.rpcs[UUID].videoElement, UUID);

						if (file.audio && file.video) {
							updateIncomingVideoElement(UUID);
						} else if (file.video) {
							updateIncomingVideoElement(UUID, true, false);
						} else if (file.audio) {
							updateIncomingVideoElement(UUID, false, true);
						}

						//transferList.push(file);
						//idx = transferList.length-1;
						//updateDownloadLink(idx);

						file.processFrame = async function (dataFrame) {
							// PROCESSING CHOOSER (AUDIO/PCM/VIDEO)

							if (session.chunkIframe && "timestamp" in dataFrame && session.rpcs[UUID]) {
								pokeIframeAPI("chunked-inbound", { UUID: UUID, streamID: session.rpcs[UUID].streamID, type: dataFrame.type, ts: dataFrame.timestamp });
							}

							if (dataFrame.type == "audio") {
								///////////// AUDIO PROCESSING

								try {
									session.rpcs[file.UUID].stats.chunked_mode_audio.time_seconds = parseInt(dataFrame.timestamp / 10000) / 100; // for stats
								} catch (e) {
									console.error("time_second missing", e);
									return;
								}

								file.processFrameAudio(dataFrame);
							} else if (dataFrame.type == "pcm") {
								// PCM AUDIO PROCESSING
								//var frameData = new Float32Array(dataFrame.data.buffer);
								var PCMSource = session.audioCtx.createBufferSource();
								PCMSource.connect(file.destination);
								PCMSource.onended = function () {
									this.disconnect();
								};
								var PCMBuffer = session.audioCtx.createBuffer(2, dataFrame.data.length, session.audioCtx.sampleRate / 2); // need to ensure this is set correctly;
								PCMSource.buffer = PCMBuffer;
								var nowBuffering = PCMBuffer.getChannelData(0).set(dataFrame.data);

								PCMSource.start(0);
							} else {
								// ///////////// VIDEO PROCESSING
								session.rpcs[file.UUID].stats.chunked_mode_video.time_seconds = parseInt(dataFrame.timestamp / 10000) / 100; // for stats
								file.processFrameVideo(dataFrame);
							}
						};

						file.processFrameVideo = async function (dataFrame) {
							// VIDEO PROCESSING

							try {
								if (dataFrame.type) {
									dataFrame = new EncodedVideoChunk(dataFrame);
								} else {
									errorlog("dataframe has no type");

								}
							} catch (e) {
								errorlog(e);
								errorlog(dataFrame);
								return;
							}

							if (!file.createChunkedVideoController) {
								file.createChunkedVideoController = function (UUID) {
									const queue = [];
									const state = {
										inFlight: false,
										pendingFrame: null,
										pendingTimer: null,
										pendingOscillator: null,
										pendingToken: 0,
										rebuffering: false,
										rebufferTimer: null,
										lastFrameAt: Date.now(),
										starvationTimer: null,
										bufferState: {
											targetMs: 200,
											minLead: 32,
											rejoinMargin: 120,
											enterThreshold: 8
										}
									};
									file.video.nextQueue = null;

									function ensureStats() {
										if (!session.rpcs[UUID]) {
											return false;
										}
										if (!session.rpcs[UUID].stats.chunked_mode_video) {
											session.rpcs[UUID].stats.chunked_mode_video = {};
										}
										return true;
									}

									function getRemoteNowMs() {
										if (typeof file.getRemoteNow === "function") {
											return file.getRemoteNow();
										}
										return Date.now() - (file.timedelta || 0);
									}

									function refreshBufferState(target) {
										const bufferState = state.bufferState;
										bufferState.targetMs = target;
										if (target === 0) {
											bufferState.minLead = 0;
											bufferState.rejoinMargin = 0;
											bufferState.enterThreshold = 0;
										} else {
											bufferState.minLead = Math.max(16, Math.min(160, target * 0.12));
											let rejoin = Math.max(bufferState.minLead * 2, target * 0.3);
											const slack = Number.isFinite(file.chunkJitterSlack) ? file.chunkJitterSlack : 0;
											if (slack > 0) {
												rejoin += slack;
											}
											bufferState.rejoinMargin = rejoin;
											bufferState.enterThreshold = Math.min(bufferState.minLead * 0.5, target * 0.1);
										}
										return bufferState;
									}

									function scheduleRebufferCheck(delay) {
										if (state.rebufferTimer) {
											return;
										}
										state.rebufferTimer = setTimeout(function () {
											state.rebufferTimer = null;
											drainQueue();
										}, delay);
									}

									function clearPendingSchedule() {
										state.pendingToken += 1;
										if (state.pendingTimer) {
											clearTimeout(state.pendingTimer);
											state.pendingTimer = null;
										}
										if (state.pendingOscillator) {
											const osc = state.pendingOscillator;
											state.pendingOscillator = null;
											try {
												osc.onended = null;
												osc.stop(0);
											} catch (err) { }
											try {
												osc.disconnect();
											} catch (err) { }
										}
									}

									function completePendingFrame(token, frame) {
										if (token !== state.pendingToken) {
											return false;
										}
										state.pendingFrame = null;
										state.pendingTimer = null;
										state.pendingOscillator = null;
										decodeFrame(frame);
										state.inFlight = false;
										if (queue.length) {
											drainQueue();
										}
										return true;
									}

									function wakeQueue() {
										if (state.rebufferTimer) {
											clearTimeout(state.rebufferTimer);
											state.rebufferTimer = null;
										}
										if (state.inFlight && state.pendingFrame) {
											const frame = state.pendingFrame;
											clearPendingSchedule();
											state.pendingFrame = null;
											state.inFlight = false;
											queue.unshift(frame);
										}
										drainQueue();
									}

									function decodeFrame(frame) {
										if (!file.video || !file.video.decoder || file.video.decoder.state !== "configured") {
											if (file.requestChunkedVideoKeyframe) {
												file.requestChunkedVideoKeyframe();
											}
											return;
										}
										try {
											file.decodeChunkedVideoFrame(frame);
										} catch (err) {
											errorlog(err);
											if (file.resetChunkedVideoDecoder) {
												file.resetChunkedVideoDecoder(true);
											} else if (file.requestChunkedVideoKeyframe) {
												file.requestChunkedVideoKeyframe();
											}
										}
									}

									function drainQueue() {
										if (state.inFlight) {
											return;
										}
										if (!queue.length) {
											return;
										}
										if (!ensureStats()) {
											queue.length = 0;
											return;
										}

										if (!file.video || !file.video.decoder || file.video.decoder.state !== "configured") {
											queue.length = 0;
											if (file.requestChunkedVideoKeyframe) {
												file.requestChunkedVideoKeyframe();
											}
											return;
										}

										const frame = queue[0];
										const chunkTimestamp = typeof frame.timestamp === "number" ? frame.timestamp : 0;
										const nowRemote = getRemoteNowMs();
										const realTimeOffset = file.video.realTime || 0;

										const videoTargetMs = state.bufferState.targetMs == null ? 200 : state.bufferState.targetMs;
										const target = resolveChunkedBufferTarget("video", videoTargetMs);
										const bufferState = refreshBufferState(target);
										const lead = chunkTimestamp / 1000 - (nowRemote - realTimeOffset);
										const delta = lead + target;
										const occupancy = Math.max(0, delta);
										let queuedDuration = 0;
										if (queue.length > 1) {
											const tailFrame = queue[queue.length - 1];
											const tailTimestamp = tailFrame && typeof tailFrame.timestamp === "number" ? tailFrame.timestamp : chunkTimestamp;
											queuedDuration = Math.max(0, (tailTimestamp - chunkTimestamp) / 1000);
										}
										const bufferedAhead = Math.max(occupancy, queuedDuration);
										let playbackDelay = Math.max(0, delta);
										const stats = session.rpcs[UUID].stats.chunked_mode_video;
										const updateStats = function (delay) {
											let scheduled = delay;
											if (!(scheduled >= 0 && Number.isFinite(scheduled))) {
												scheduled = 0;
											}
											stats.buffer_lead = Math.round(lead);
											stats.buffer_delta = Math.round(scheduled);
											stats.buffer_buffer = Math.round(target);
											stats.buffer_level = Math.round(bufferedAhead);
											stats.buffer_queue = Math.round(queuedDuration);
											stats.buffer_schedule = Math.round(occupancy);
											stats.queue_length = queue.length;
											stats.rebuffering = !!state.rebuffering;
										};

										const configuredFrameRate = file.stream_configVideo && parseFloat(file.stream_configVideo.frameRate);
										// Catch up intact references after brief main-thread stalls instead of
										// discarding a long buffer and waiting for a future keyframe to age.
										// Keep low-delay behavior and bound catch-up to at most one second;
										// larger stale backlogs still take the keyframe recovery path below.
										const lateFrameTolerance = Math.max(250, Math.min(1000, target * 0.25), 1000 / (configuredFrameRate > 0 ? configuredFrameRate : 30));
										if (delta < -lateFrameTolerance) {
											let resumeIndex = -1;
											for (let queueIndex = 1; queueIndex < queue.length; queueIndex += 1) {
												const candidate = queue[queueIndex];
												if (!candidate || candidate.type !== "key" || typeof candidate.timestamp !== "number") {
													continue;
												}
												const candidateDelta = candidate.timestamp / 1000 - (nowRemote - realTimeOffset) + target;
												if (candidateDelta >= -lateFrameTolerance) {
													resumeIndex = queueIndex;
													break;
												}
											}
											const droppedCount = resumeIndex > 0 ? resumeIndex : queue.length;
											stats.playout_drops = (stats.playout_drops || 0) + droppedCount;
											if (session.stats) {
												session.stats.chunkedPlayoutDrops = (session.stats.chunkedPlayoutDrops || 0) + droppedCount;
											}
											if (resumeIndex > 0) {
												queue.splice(0, resumeIndex);
												state.rebuffering = false;
												stats.awaiting_keyframe = false;
												drainQueue();
												return;
											}
											queue.length = 0;
											state.rebuffering = true;
											file.video.playbackheader = false;
											stats.awaiting_keyframe = true;
											stats.buffer_level = 0;
											stats.buffer_queue = 0;
											stats.queue_length = 0;
											stats.rebuffering = true;
											if (file.requestChunkedVideoKeyframe) {
												file.requestChunkedVideoKeyframe();
											}
											return;
										}

										const enterThreshold = bufferState.enterThreshold;
										const rejoinThreshold = target > 0 ? Math.max(bufferState.minLead, target * 0.5) : 0;
										if (target > 0 && bufferedAhead <= enterThreshold) {
											state.rebuffering = true;
											stats.last_underflow = Date.now();
										}
										if (state.rebuffering && delta >= bufferState.minLead) {
											state.rebuffering = false;
										}
										if (state.rebuffering && target > 0 && bufferedAhead < Math.max(0, rejoinThreshold)) {
											updateStats(playbackDelay);
											scheduleRebufferCheck(Math.max(20, Math.min(250, target / 4)));
											return;
										} else {
											state.rebuffering = false;
										}

										if (state.rebufferTimer) {
											clearTimeout(state.rebufferTimer);
											state.rebufferTimer = null;
										}

										updateStats(playbackDelay);

										queue.shift();
										state.inFlight = true;
										state.pendingFrame = frame;
										state.pendingToken += 1;
										const pendingToken = state.pendingToken;

										const audioCtxState = session.audioCtx && session.audioCtx.state;
										if (!session.audioCtx || audioCtxState !== "running") {
											stats.scheduler = "timer";
											stats.audio_context_state = audioCtxState || "missing";
											state.pendingTimer = setTimeout(function () {
												completePendingFrame(pendingToken, frame);
											}, Math.max(0, playbackDelay));
											return;
										}
										stats.scheduler = "audioContext";
										stats.audio_context_state = audioCtxState;

										if (!session.silence) {
											session.silence = session.audioCtx.createGain();
											session.silence.gain.value = 0;
											session.silence.connect(session.audioCtx.destination);
										}

										const osc = session.audioCtx.createOscillator();
										state.pendingOscillator = osc;
										osc.connect(session.silence);
										osc.start(0);
										osc.onended = function () {
											osc.disconnect();
											completePendingFrame(pendingToken, frame);
										};
										osc.stop(session.audioCtx.currentTime + playbackDelay / 1000);
									}

									state.starvationTimer = setInterval(function () {
										if (!session.rpcs[UUID]) {
											clearInterval(state.starvationTimer);
											return;
										}
										if (Date.now() - state.lastFrameAt > 5000) {
											if (file.dc && file.dc.readyState === "open") {
												if (!file.requestKeyframe) {
													file.dc.send(JSON.stringify({ kf: true }));
													file.requestKeyframe = setTimeout(function () {
														clearTimeout(file.requestKeyframe);
														file.requestKeyframe = null;
													}, 1000);
												}
											}
										}
									}, 3000);

									return {
										bufferWindow() {
											const first = state.pendingFrame || queue[0];
											const last = queue.length ? queue[queue.length - 1] : first;
											return first && last ? { oldest: first.timestamp, newest: last.timestamp } : null;
										},
										enqueue(frame) {
											state.lastFrameAt = Date.now();
											queue.push(frame);
											if (file.video.queue !== queue) {
												file.video.queue = queue;
											}
											drainQueue();
										},
										wake() {
											wakeQueue();
										},
										destroy() {
											clearPendingSchedule();
											if (state.rebufferTimer) {
												clearTimeout(state.rebufferTimer);
												state.rebufferTimer = null;
											}
											if (state.starvationTimer) {
												clearInterval(state.starvationTimer);
												state.starvationTimer = null;
											}
											queue.length = 0;
											state.pendingFrame = null;
											state.inFlight = false;
											state.rebuffering = false;
										}
									};
								};
							}

							if (file.videoWriter && file.videoElement.stopWriter) {
								// VIDEO FILE WRITER
								if (!file.video.header && dataFrame.type !== "key") {
									log("waiting for keyframe");
									log(dataFrame);
									if (!file.requestKeyframe) {
										file.dc.send(JSON.stringify({ kf: true })); // request a keyframe as its needed.
										file.requestKeyframe = setTimeout(function () {
											clearTimeout(file.requestKeyframe);
											file.requestKeyframe = null;
										}, 1000);
									}
								} else if (!file.video.header) {
									file.video.header = Date.now();
									file.videoWriter.addFrame(dataFrame);
									log("start writing frames");
									if (session.director && !file.updateTime) {
										file.updateTime = setInterval(
											function (uid) {
												var time = (Date.now() - file.video.header) / 1000;
												var minutes = Math.floor(time / 60);
												var seconds = Math.floor(time - minutes * 60);
												try {
													document.querySelector("[data-action-type='recorder-local'][data--u-u-i-d='" + uid + "']").innerHTML = '<i class="las la-stop-circle"></i> ' + minutes + "m : " + zpadTime(seconds) + "s";
												} catch (e) {
													log("not record button detected; can't update time since started recording");
												}
											},
											1000,
											file.UUID
										);
									}
								} else {
									file.videoWriter.addFrame(dataFrame);
								}
							}

							if (file.video && file.video.decoder && file.video.decoder.state !== "configured") {
								file.video_session += 1;
								warnlog("Restarting since not configured");
								file.video.playbackheader = false;
								if (dataFrame.type === "key") {
									if (file.video.decoder.isChunkedWorkerProxy) {
										file.video.decoder.reset(file.stream_configVideo);
									} else {
										try {
											if (file.video.decoder.state !== "closed") {
												file.video.decoder.close();
											}
										} catch (e) {}
										file.video.decoder = new VideoDecoder(file.init_video);
										await file.video.decoder.configure(file.stream_configVideo);
									}
									file.video.playbackheader = false;
								}
							}

							if (!file.video.playbackheader && dataFrame.type !== "key") {
								if (session.rpcs[file.UUID] && session.rpcs[file.UUID].stats) {
									const vStats = session.rpcs[file.UUID].stats.chunked_mode_video = session.rpcs[file.UUID].stats.chunked_mode_video || {};
									vStats.awaiting_keyframe = true;
									vStats.rebuffering = true;
									vStats.buffer_buffer = Math.round(resolveChunkedBufferTarget("video", 200));
									vStats.buffer_level = 0;
									vStats.queue_length = 0;
								}
								if (file.requestChunkedVideoKeyframe) {
									file.requestChunkedVideoKeyframe();
								}
								return;
							}

							if (file.video.playbackheader || dataFrame.type === "key") {
								if (dataFrame.type === "key" && session.rpcs[file.UUID] && session.rpcs[file.UUID].stats && session.rpcs[file.UUID].stats.chunked_mode_video) {
									session.rpcs[file.UUID].stats.chunked_mode_video.awaiting_keyframe = false;
								}
								file.video.playbackheader = true;
								if (file.video.realTime) {
									try {
										if (!file.video.controller) {
											file.video.controller = file.createChunkedVideoController(UUID);
										}
										file.video.controller.enqueue(dataFrame);
									} catch (e) {
										errorlog(e);
										if (file.video.controller && file.video.controller.destroy) {
											file.video.controller.destroy();
										}
										file.video.controller = null;
									}
									return;
								}
								try {
									if (file.video.nextQueue) {
										file.video.queue.push(dataFrame);
									} else if (file.video.queue.length) {
										file.video.queue.push(dataFrame);
									} else {
										if (file.video.realTime) {
											file.video.nextQueue = true;
											function processVideoQueue(dataFrameA) {
												var video_session = file.video_session;
												var delta = dataFrameA.timestamp / 1000 - (Date.now() - file.timedelta - file.video.realTime);
												const parseBufferSetting = value => {
													if (value === false || value === null || value === undefined) {
														return null;
													}
													const parsed = parseFloat(value);
													return Number.isFinite(parsed) ? parsed : null;
												};
												var buffer = parseBufferSetting(session.defaultChunkedBuffer) || 200;
												if (!session.rpcs[file.UUID]) {
													clearTimeout(file.video.nextQueue);
													file.video.nextQueue = null;
													file.video.queue = [];
													return;
												}
												const initialSetting = parseBufferSetting(session.chunkbuffer);
												const globalSetting = parseBufferSetting(session.buffer);
												const rpcSetting = parseBufferSetting(session.rpcs[file.UUID].buffer);
												if (initialSetting !== null) {
													buffer = initialSetting;
												}
												if (globalSetting !== null) {
													buffer = globalSetting;
												}
												if (rpcSetting !== null) {
													buffer = rpcSetting;
												}
												delta += buffer;

												if (!session.rpcs[file.UUID].stats.chunked_mode_video) {
													session.rpcs[file.UUID].stats.chunked_mode_video = {};
												}

												session.rpcs[file.UUID].stats.chunked_mode_video.buffer_delta = parseInt(delta);
												session.rpcs[file.UUID].stats.chunked_mode_video.buffer_buffer = parseInt(buffer);
												session.rpcs[file.UUID].stats.chunked_mode_video.buffer_vals = dataFrameA.timestamp + ":" + (Date.now() - file.timedelta - file.video.realTime) + ":" + Date.now() + ":" + file.timedelta + ":" + file.video.realTime;

												if (!session.silence) {
													session.silence = session.audioCtx.createGain();
													session.silence.gain.value = 0;
													session.silence.connect(session.audioCtx.destination);
												}
												if (!file.vosc) {
													if (delta <= 0) {
														delta = 0;
													}
													file.vosc = session.audioCtx.createOscillator();
													file.vosc.connect(session.silence);
													file.vosc.start(0);
													file.vosc.onended = (event) => {
														file.vosc.disconnect();
														if (video_session === file.video_session) {
															try {
																file.decodeChunkedVideoFrame(dataFrameA);
															} catch (e) {
																errorlog(e);
															}
														} else {
															console.log(video_session, file.video_session);
														}
														file.vosc = false;
														if (file.video.queue.length) {
															processVideoQueue(file.video.queue.shift());
														} else {
															file.video.nextQueue = null;
														}
													};
													file.vosc.stop(session.audioCtx.currentTime + delta / 1000);
												}
											}
											try {
												processVideoQueue(dataFrame);
											} catch (e) {
												errorlog(e);
												file.video.nextQueue = null;
												if (!file.requestKeyframe) {
													file.dc.send(JSON.stringify({ kf: true })); // request a keyframe as its needed.
													file.requestKeyframe = setTimeout(function () {
														clearTimeout(file.requestKeyframe);
														file.requestKeyframe = null;
													}, 1000);
												}
											}
										} else {
											try {
												file.decodeChunkedVideoFrame(dataFrame);
											} catch (e) {
												errorlog(e);
											}
										}
									}
								} catch (e) {
									errorlog(e);
									file.video.playbackheader = false;
								}
							}
							if (file.video.decoder.decodeQueueSize) {
								console.log("decodeQueueSize: " + file.video.decoder.decodeQueueSize);
							}

							if (!file.video.playbackheader) {
								if (!file.requestKeyframe) {
									file.dc.send(JSON.stringify({ kf: true })); // request a keyframe as its needed.
									file.requestKeyframe = setTimeout(function () {
										clearTimeout(file.requestKeyframe);
										file.requestKeyframe = null;
									}, 1000);

								}
							}
						};

						file.processFrameAudio = async function (dataFrame) {
							// LEGACY AUDIO METHOD
							if (!file.audio) {
								errorlog("Audio isn't setup yet.");
								return;
							}
							try {
								dataFrame.type = "key";
								dataFrame = new EncodedAudioChunk(dataFrame);
							} catch (e) {
								return;
							}

							if (file.videoWriter && file.videoElement.stopWriter && (file.writer_config.video === false || (file.video && file.video.header))) {
								file.videoWriter.addFrame(dataFrame);
							}
							if (file.audio.decoder.state === "closed") {
								file.audio.decoder = new AudioDecoder(file.init_audio);
								file.audio.decoder.configure(file.stream_configAudio);
							}
							try {
								file.audio.decoder.decode(dataFrame);
							} catch (e) {
								errorlog(e);
							}
						}; // END LEGACY AUDIO PROCESSING
					} else if (file.audio && details.realTimeAudio) {
						file.audio.realTime = details.realTimeAudio;
					} else if (file.video && details.realTimeVideo) {
						file.video.realTime = details.realTimeVideo;
					} else {
						errorlog(tmp);
					}

					file.chunkedInitializing = false;
					file.chunkedDraining = true;
					try {
						while (file.pendingChunkedMessages.length) {
							await file.channel.onmessage({ data: file.pendingChunkedMessages.shift(), chunkedDrain: true });
						}
					} finally {
						file.chunkedDraining = false;
					}
					return;
				} catch (e) {
					file.chunkedInitializing = false;
					file.pendingChunkedMessages = [];
					errorlog(e);
				}
			} else if (session.retransmit) {
				session.chunksQueue.push(e.data);
				if (session.retransmit) {
					session.retransmitChunkedStream();
				}
			}

			try {
				const payload = e.data;
				if (typeof payload === "string") {
					var metadata = JSON.parse(payload);
					if (metadata && metadata.type === "chunkedclock") {
						file.updateChunkedClock(metadata.timestamp);
						return;
					}
					if (metadata && (metadata.type === "chunkedtiming" || metadata.type === "chunkedconfig")) {
						var audioAdded = false;
						if (metadata.configAudio) {
							details.configAudio = metadata.configAudio;
							if (file.setupChunkedAudio) {
								audioAdded = await file.setupChunkedAudio(metadata.configAudio, metadata.realTimeAudio);
							}
						}
						if (typeof metadata.realTimeAudio === "number") {
							details.realTimeAudio = metadata.realTimeAudio;
							if (file.audio) {
								file.audio.realTime = metadata.realTimeAudio;
							}
						}
						if (typeof metadata.realTimeVideo === "number") {
							details.realTimeVideo = metadata.realTimeVideo;
							if (file.video) {
								file.video.realTime = metadata.realTimeVideo;
								if (file.video.controller && typeof file.video.controller.wake === "function") {
									file.video.controller.wake();
								}
							}
						}
						if (audioAdded) {
							if (file.video) {
								updateIncomingVideoElement(UUID);
							} else {
								updateIncomingVideoElement(UUID, false, true);
							}
						}
						return;
					}
					await handleMetadataPacket(metadata);
				} else if (payload) {
					await handleChunkPayload(payload);
				}
			} catch (err) {
				errorlog(err);
			}
		};
		return;
	};

	session.cleanDirectorList = function () {
		const validUUIDs = new Set([
			...Object.keys(session.pcs),
			...Object.keys(session.rpcs)
		]);
		const originalLength = session.directorList.length;
		session.directorList = session.directorList.filter(uuid => validUUIDs.has(uuid));
		const removedCount = originalLength - session.directorList.length;
		if (removedCount) {
			log(`Removed ${removedCount} UUID(s) from the director's list.`);
		}
	}

	/// THE PROBLEM IS I HAVE A PATH WAY FOR INPUT AND A PATHWAY FOR OUTPUT, BU THEY SHARE THE SAME PATHWAY. LOL.  I NEED TO COMBINE THESE INTO ONE.
	session.setupIncoming = async function (msg) {
		// ingesting stream as a viewer
		log("SETUP INCOMING");
		var UUID = msg.UUID;
		// Reject before touching an existing peer or allocating a replacement.
		if (session.requireencryption && !msg.vector) {
			errorlog("Encryption is required, but none found. Cancelling.");
			errorlog(msg);
			return false;
		} else if (!msg.vector && !session.defaultPassword && session.password && !session.unsafe) {
			errorlog("Encryption is required for non-default passwords setups. No encryption found.\n\nNote: If you'd like to allow it regardless, add &unsafe to your URL to allow connections made with a password that does not encryption.");
			errorlog(msg);
			return false;
		}
		var retainedMedia = session.rpcs[UUID];
		// The publisher can retry before our P2P cleanup timer; retain media from that same browser session.
		if (retainedMedia && !retainedMedia.__closing && !retainedMedia.whip && !retainedMedia.realUUID &&
			retainedMedia.streamID === msg.streamID && retainedMedia.connectionState !== "connected" &&
			typeof msg.session === "string" && typeof retainedMedia.session === "string" && msg.session !== retainedMedia.session &&
			msg.session.length === 10 && retainedMedia.session.length === 10 && msg.session.substring(0, 5) === retainedMedia.session.substring(0, 5) &&
			((retainedMedia.whep && retainedMedia.whep.connectionState === "connected") ||
			(session.rpcs[UUID + "_screen"] && session.rpcs[UUID + "_screen"].whep && session.rpcs[UUID + "_screen"].whep.connectionState === "connected"))) {
			session.closeRPC(UUID, false, true);
		}
		if (!retainedMedia || !retainedMedia.__closing || retainedMedia.signalingState !== "closed" || retainedMedia.streamID !== msg.streamID ||
			(!retainedMedia.whep && !(session.rpcs[UUID + "_screen"] && session.rpcs[UUID + "_screen"].whep))) {
			retainedMedia = false;
		}
		if (UUID in session.rpcs) {
			if ("session" in msg && msg.session) {
				// don't bother if set to null or none or false (seems to keep older raspberry ninja working, etc)
				if (session.rpcs[UUID].session == msg.session) {
					log("SDP Sessions Match. I assume ADDING TRACKS. RPCS");
					return;
					//session.processDescription(msg);
				} //else {
				//	log("SDP Sessions do not match. Do I delete an accept this new SDP? RPCS");
				// just ignore it?
				// I should probably KILL the current session and listen to the new one. But whatever. Not an issue yet.
				//}
				warnlog("already connected 1");
				if (!retainedMedia) session.closeRPC(UUID, false);
			}
			//////// SKIP SetupIncoming; go straight to next step.
		} else {
			log("MAKING A NEW RPCS RTC CONNECTION");
		}

		try {
			for (var i in session.rpcs) {
				if (retainedMedia && session.rpcs[i] === retainedMedia) continue;
				if (session.rpcs[i].streamID == msg.streamID) {
					if (session.rpcs[i].whip) {
						errorlog("This stream token is already connected. Are you having a CORS issue? Also, ensure SSL if enforced on your host everywhere.");
					}
					if (session.rpcs[i].videoElement) {
						session.rpcs[i].videoElement.style.display = "none";
					}
					warnlog("already connected 2. disconnecting..");
					session.closeRPC(i); // could be the same websocket client or a new one; doesn't matter up until now.
					if (i !== UUID) {
						// not the same UUID, so not the same websocket connection. If it was, then we can't know if they reset.
						if (i in session.pcs) {
							// we are making the assumption that the stream ID is tied to the connection; checking to see if we should kill any old connections that haven't close yet.
							if (msg.session && msg.session.substring(0, 6) !== session.loadoutID) {
								// different load out value (both present), so we know this is a refreshed browser.
								warnlog("CLOSING SECONDARY CONNECTION; matched stream ID has re-connected");
								log("closing 20");
								session.closePC(i, false); // kill the old connection now siliently, rather than waiting for it to time out and making a noise.
							} else {
								warnlog("Websocket connection failed or something; this is a split connection. not ideal, as it could be unstable.");
							}
						}
					}
				}
			}
			if (document.getElementById("mainmenu")) {
				document.getElementById("mainmenu").parentNode.removeChild(document.getElementById("mainmenu"));
				document.querySelectorAll(".hidden2").forEach(ele2 => {
					ele2.classList.remove("hidden2");
				});
			}
		} catch (e) {
			errorlog(e);
		}
		//////////////////////

		// Shadow ban: silently ignore all incoming connections
		if (session.shadowBanned) {
			log("Shadow mode: ignoring incoming connection from " + UUID);
			return;
		}

		const incomingLimitReached = function () {
			var retainedCount = retainedMedia ? 1 + (session.rpcs[UUID + "_screen"] ? 1 : 0) : 0;
			if (session.maxpublishers !== false) {
				return Object.keys(session.rpcs).length - retainedCount >= session.maxpublishers;
			} else if (session.maxconnections !== false) {
				return Object.keys(session.rpcs).length - retainedCount + Object.keys(session.pcs).length >= session.maxconnections;
			}
			return false;
		};
		if (incomingLimitReached()) {
			warnlog("Publisher will be ignored due to max connections already hit");
			return;
		}

		if (session.queue) {
			if (session.director) {
				if (!(UUID in session.pcs)) {
					session.offerSDP(UUID);
				}
			} else if (session.directorList.indexOf(UUID) == -1) { // session.include
				if (!(msg.streamID && session.view_set && session.view_set.includes(msg.streamID))) {
					return;
				}
			}
		}

		if (!session.configuration) {
			await chooseBestTURN();
		}

		if (retainedMedia && session.rpcs[UUID] !== retainedMedia) return;
		// Other admissions can consume capacity while configuration is pending.
		if (incomingLimitReached()) {
			warnlog("Publisher will be ignored due to max connections already hit");
			return;
		}

		if (session.encodedInsertableStreams) {
			session.configuration.encodedInsertableStreams = true;
		}

		if (session.bundlePolicy) {
			session.configuration.bundlePolicy = session.bundlePolicy;
		}

		try {
			session.rpcs[UUID] = new RTCPeerConnection(session.configuration);
			session.attachIceCandidateErrorTracker(session.rpcs[UUID], "rpcs", UUID);

		} catch (err) {
			if (!session.cleanOutput) {
				warnUser("An RTC error occurred.");
			}
			errorlog(err);
			return;
		}

		if (!msg.vector) {
			// well, the viewer if they have a password can view a non-encrypted stream at least, but not vice versa - probably for the best for expected encryption reasons.
			if (session.password && session.defaultPassword) {
				warnlog("No vector? uh oh -- might be raspberry ninja or some other simpler implementation, so lets move on. We're using the default password, so we're going to allow it");
				warnlog(msg);
			}
			session.rpcs[UUID].vector = false;
		} else {
			if (!session.password) {
				errorlog("Handshake has a vector? But we don't have a password. This is probably going to fail...");
				errorlog(msg);
			}
			session.rpcs[UUID].vector = true;
		}

		if (session.security) {
			if (Object.keys(session.rpcs).length - (retainedMedia && session.rpcs[UUID + "_screen"] ? 1 : 0) > 1) {
				warnlog("TOO MANY PUBLISHING PEERS");
				log(session.rpcs);
				delete session.rpcs[UUID];
				updateUserList();
				return;
			} else {
				warnlog("CONNECTED TO FIRST PEER");
			}
		}

		if (msg.streamID in session.waitingWatchList) {
			log("deleting watch list");
			delete session.waitingWatchList[msg.streamID];
		}

		try {
			session.rpcs[UUID].streamID = msg.streamID;
			const screenUUID = UUID + "_screen";
			if (screenUUID in session.rpcs) {
				const screenRPC = session.rpcs[screenUUID];
				const parentStreamID = session.rpcs[UUID].streamID;
				if (parentStreamID) {
					const screenStreamID = parentStreamID + ":s";
					if (screenRPC.streamID !== screenStreamID) {
						screenRPC.streamID = screenStreamID;
					}
					if (screenRPC.videoElement) {
						screenRPC.videoElement.dataset.sid = screenStreamID;
					}
					if (session.rpcs[UUID].screenElement && session.rpcs[UUID].screenElement !== screenRPC.videoElement) {
						session.rpcs[UUID].screenElement.dataset.sid = screenStreamID;
					}
				}
			}
			if (!retainedMedia) await checkDirectorStreamID();
		} catch (e) {
			errorlog(e);
			return;
		}

		if (msg.session) {
			session.rpcs[UUID].session = msg.session;
		} else {
			session.rpcs[UUID].session = null;
		}
		session.rpcs[UUID].getStatsTimeout = null;
		session.rpcs[UUID].activelySpeaking = false; // default to off.
		session.rpcs[UUID].defaultSpeaker = false; // default to off.
		session.rpcs[UUID].loudest = false; // default to off.
		session.rpcs[UUID].allowMIDI = false; // special allowance for reciever.
		session.rpcs[UUID].allowGraphs = false;
		session.rpcs[UUID].allowDrawing = false;
		session.rpcs[UUID].stats = {};
		//session.rpcs[UUID].slot = false;
		session.rpcs[UUID].stats.Audio_Loudness = false;
		session.rpcs[UUID].showDirector = false;
		session.rpcs[UUID].codirectorRequested = false;
		session.rpcs[UUID].canvasIntervalAction = null;
		session.rpcs[UUID].bandwidth = -1;
		session.rpcs[UUID].audioBandwidth = -1; // last audioBitrate sent; -1 (uncapped) matches a fresh publisher
		session.rpcs[UUID].bandwidthMuted = false;
		session.rpcs[UUID].buffer = false;
		session.rpcs[UUID].channelOffset = false;
		session.rpcs[UUID].channelWidth = false;
		session.rpcs[UUID].targetBandwidth = -1;
		session.rpcs[UUID].manualBandwidth = false;
		//session.rpcs[UUID].manualAudioBandwidth=false;
		session.rpcs[UUID].videoElement = false;
		session.rpcs[UUID].imageElement = false;
		session.rpcs[UUID].voiceMeter = false;
		session.rpcs[UUID].group = [];
		session.rpcs[UUID].videoMuted = false;
		session.rpcs[UUID].iframeVideo = false;
		session.rpcs[UUID].lockedVideoBitrate = false;
		session.rpcs[UUID].lockedAudioBitrate = false;
		session.rpcs[UUID].virtualHangup = false;
		session.rpcs[UUID].remoteMuteState = false;
		session.rpcs[UUID].remoteMuteElement = false;
		session.rpcs[UUID].closeTimeout = null;
		session.rpcs[UUID].__closing = false;
		session.rpcs[UUID].whep = false;
		session.rpcs[UUID].mutedState = null; // scenes
		session.rpcs[UUID].mutedStateMixer = null;
		session.rpcs[UUID].mutedStateScene = null;
		session.rpcs[UUID].mirrorState = null;
		session.rpcs[UUID].flipState = null;
		session.rpcs[UUID].motionDetectionInterval = false;
		session.rpcs[UUID].rotate = false;
		session.rpcs[UUID].savedVolume = false;
		session.rpcs[UUID].scaleHeight = false;
		session.rpcs[UUID].scaleWidth = false;
		session.rpcs[UUID].scaleSnap = false;
		session.rpcs[UUID].signalMeter = false;
		session.rpcs[UUID].volumeControl = false;
		session.rpcs[UUID].streamSrc = null;
		session.rpcs[UUID].screenIndexes = false;
		session.rpcs[UUID].screenShareState = false;
		session.rpcs[UUID].smallScreen = false;
		session.rpcs[UUID].pseudoguest = false;
		session.rpcs[UUID].director = null; // superficial; not the main way to track directors.
		session.rpcs[UUID].directorVideoMuted = false;
		session.rpcs[UUID].directorVolumeState = 100;
		session.rpcs[UUID].directorMutedState = 0;
		session.rpcs[UUID].nackCount = 0;
		session.rpcs[UUID].settings = false;
		session.rpcs[UUID].opacityDisconnect = "1";
		session.rpcs[UUID].opacityMuted = "1";
		session.rpcs[UUID].obsControl = false;
		//session.rpcs[UUID].optimizeRequestTimeout = false;
		//session.rpcs[UUID].optimizeDelayFlag = false;
		session.rpcs[UUID].pliCount = 0;
		session.rpcs[UUID].label = false;
		session.rpcs[UUID].meta = false;
		session.rpcs[UUID].order = false;
		session.rpcs[UUID].canvasCtx = null;
		session.rpcs[UUID].canvas = null;

		session.rpcs[UUID].inboundAudioPipeline = {};
		//session.rpcs[UUID].fileList = false;
		session.rpcs[UUID].iframeSrc = false;
		session.rpcs[UUID].iframeEle = false;
		session.rpcs[UUID].startTime = Date.now();
		session.rpcs[UUID].whipCallback = false;
		session.rpcs[UUID].wssid = session.wssid;

		if (retainedMedia) {
			var mediaFields = [
				"whep", "isWhepSession", "restartWhepConnection", "whepExpectedAudio", "whepExpectedVideo", "whepAudioRecoveryState", "suppressReconnect", "reconnecting",
				"primaryWhepRequested", "activePrimaryWhepMarker", "pendingPrimaryWhepSettings", "lastPrimaryWhepUrl", "lastPrimaryWhepToken", "lastPrimaryWhepMarker", "pendingPrimaryWhepMarker", "pendingPrimaryWhepStarted",
				"videoElement", "streamSrc", "inboundAudioPipeline", "stats", "getStatsTimeout", "eventPlayActive", "startTime",
				"screenElement", "screenShareState", "smallScreen", "__whepPrevSmallScreen", "__whepAutoSmallScreen", "lastScreenStarted", "lastScreenStopped",
				"canvas", "canvasCtx", "canvasOverlay", "canvasOverlays", "imageElement", "viewChromaCanvas", "viewChromaCanvasCtx", "viewChromaState",
				"motionDetectionInterval", "canvasIntervalAction", "voiceMeter", "signalMeter", "batteryMeter", "connectionDetails", "volumeControl", "remoteMuteElement", "remoteVideoMuteElement", "remoteRaisedHandElement",
				"mutedState", "mutedStateMixer", "mutedStateScene", "mirrorState", "flipState", "rotate", "savedVolume", "scaleHeight", "scaleWidth", "scaleSnap",
				"channelOffset", "channelWidth", "isolatedChannel", "buffer", "manualBandwidth", "targetBandwidth", "videoMuted", "directorVideoMuted", "directorVolumeState", "directorMutedState", "remoteMuteState", "opacityDisconnect", "opacityMuted",
				"label", "labelSetByDirector", "meta", "group", "order", "settings", "loudnessRecoveryState"
			];
			for (var fieldIndex = 0; fieldIndex < mediaFields.length; fieldIndex++) {
				var mediaField = mediaFields[fieldIndex];
				if (Object.prototype.hasOwnProperty.call(retainedMedia, mediaField)) {
					session.rpcs[UUID][mediaField] = retainedMedia[mediaField];
				}
			}
			var resumedPeer = session.rpcs[UUID];
			await checkDirectorStreamID();
			if (session.rpcs[UUID] !== resumedPeer) return;
			updateWhepDirectorControls(UUID);
		}

		if (session.activeSpeaker == 2 || session.activeSpeaker == 4) {
			session.rpcs[UUID].loudest = true;
		}

		// normally the following function runs when there is a new incoming track. In this case, we
		if (session.showall && !retainedMedia) {
			// this just is in case we want to show an empty video if no audio/video
			var v = createRichVideoElement(UUID); //
			v.style.display = "block";
		}

		if (session.director && !retainedMedia) {
			if (session.customWSS && "isScene" in msg && msg.isScene !== false) {
				// this is a scene, so lets not show it.
			} else {
				var soloLink = soloLinkGenerator(session.rpcs[UUID].streamID);

				if ("slot" in msg) {
					createControlBox(UUID, soloLink, session.rpcs[UUID].streamID, msg.slot);
				} else {
					createControlBox(UUID, soloLink, session.rpcs[UUID].streamID);
				}

				// Auto-assign audio channel if configured
				if (session.autochannels && session.autochannels.length) {
					setTimeout(function() {
						autoAssignAudioChannel(UUID);
					}, 100);  // Small delay ensures DOM is ready
				}

				// Check if this guest was in pending approvals list (for late-joining co-directors)
				if (session.approval_popup && session.pendingApprovalStreamIDs.includes(session.rpcs[UUID].streamID)) {
					var pendingIdx = session.pendingApprovalStreamIDs.indexOf(session.rpcs[UUID].streamID);
					if (pendingIdx > -1) {
						session.pendingApprovalStreamIDs.splice(pendingIdx, 1);
					}
					// Delay slightly to ensure control box is rendered
					setTimeout(function () {
						showRemoveQueueButton(UUID);
						session.promptApproval(UUID);
					}, 100);
				}
			}
		}

		session.rpcs[UUID].UUID = UUID;

		try {
			if (session.view_set) {
				if (session.view_set.includes(session.rpcs[UUID].streamID)) {
					if (session.bitrate_set !== false) {
						// if the bitrate is customized for this video, set it.
						let posSet = session.view_set.indexOf(session.rpcs[UUID].streamID);
						if (session.bitrate_set.length > posSet) {
							session.rpcs[UUID].manualBandwidth = parseInt(session.bitrate_set[posSet]);
							if (session.rpcs[UUID].manualBandwidth <= 0) {
								// I don't know if I want this to be <=, but instead < , but rare situation
								session.rpcs[UUID].manualBandwidth = false;
							}
						}
					}
				}
			}
		} catch (e) {
			errorlog(e);
		}
		//}
		//session.rpcs[UUID].addTransceiver('video', { direction: 'recvonly'});  // this breaks OBS v23
		session.rpcs[UUID].onclose = function (event) {
			// this
			log("webrtc connectioned closed-event");
			session.closeRPC(UUID);
		};

		session.rpcs[UUID].iceTimer = null;
		session.rpcs[UUID].iceBundle = [];
		session.rpcs[UUID].delayIceSend = 10; // enough time for host candidates
		const receiverIcePeer = session.rpcs[UUID];
		session.rpcs[UUID].onicecandidate = function (event) {
			// event

			if (event.candidate == null) {
				log("null ice rpcs");

				if (session.rpcs[UUID] && session.rpcs[UUID].whipCallback2) {
					// Apply IPv6 filtering for WHIP callback
					var whipCandidates = [...session.rpcs[UUID].iceBundle];
					try {
						if (session.disableIpv6) {
							var filterResult = filterIpv6FromCandidates(whipCandidates);
							whipCandidates = filterResult.filtered;
						} else if (session.preferIpv4 !== false) {
							whipCandidates = reorderCandidatesIpv4First(whipCandidates);
						}
					} catch (e) {
						warnlog("IPv6 filtering error (WHIP):", e);
					}
					session.rpcs[UUID].whipCallback2(whipCandidates);
					clearTimeout(session.rpcs[UUID].iceTimer);
					session.rpcs[UUID].iceTimer = null;
					session.rpcs[UUID].iceBundle = [];
					session.rpcs[UUID].whipCallback2 = null;
					console.log("candidate callback finished in totalilty");
				}
				return;
			}
			try {
				if (session.icefilter) {
					if (event.candidate.candidate.indexOf(session.icefilter) === -1) {
						log("dropped candidate due to filter");
						return;
					} else {
						log(event.candidate);
					}
				}
			} catch (e) {
				errorlog(e);
			}
			try {
				if (session.localNetworkOnly) {
					if (!filterIceLAN(event.candidate)) {
						return;
					}
				}
				if (session.stunOnly) { // or whatever flag you want to use
					if (!filterStunOnly(event.candidate)) {
						return;
					}
				}
			} catch (e) {
				errorlog(e);
			}

			session.rpcs[UUID].iceBundle.push(event.candidate);

			if (session.rpcs[UUID] && (session.rpcs[UUID].whipCallback2 || (session.rpcs[UUID].iceTimer !== null))) {
				return;
			}

			session.rpcs[UUID].iceTimer = setTimeout(
				function (UUID) {
					if (!(UUID in session.rpcs)) {
						return;
					}
					if (session.rpcs[UUID].whipCallback2) {
						return;
					}

					session.rpcs[UUID].iceTimer = null; // ensure its clear

					if (!session.rpcs[UUID].iceBundle || !session.rpcs[UUID].iceBundle.length) {
						// don't send empty ice candidates
						errorlog("RPC ICE candidate flush skipped: empty candidate bundle");
						return;
					}

					var data = {};
					data.UUID = UUID;
					data.type = "remote";

					// Apply IPv6 filtering/reordering before sending candidates
					var candidatesToSend = session.rpcs[UUID].iceBundle;
					try {
						if (session.disableIpv6) {
							// Filter out IPv6 if IPv4 exists (safe fallback to IPv6 if no IPv4)
							var filterResult = filterIpv6FromCandidates(candidatesToSend);
							candidatesToSend = filterResult.filtered;
						} else if (session.preferIpv4 !== false) {
							// Default: reorder to prefer IPv4 (IPv4 first, then IPv6)
							candidatesToSend = reorderCandidatesIpv4First(candidatesToSend);
						}
					} catch (e) {
						warnlog("IPv6 filtering error:", e);
					}

					data.candidates = candidatesToSend;
					data.session = session.rpcs[UUID].session; ///// WHY NOT SESSION ON ALL RTC ICE?
					session.rpcs[UUID].iceBundle = [];

					session.rpcs[UUID].delayIceSend = 1000;

					if (session.rpcs[UUID].whip) { return; }

					if (session.password && session.rpcs[UUID].vector) {
						session
							.encryptMessage(JSON.stringify(data.candidates))
							.then(function (enc) {
								if (session.rpcs[UUID] !== receiverIcePeer || receiverIcePeer.signalingState === "closed") {
									return;
								}
								data.candidates = enc[0];
								data.vector = enc[1];
								session.anyrequest(data);
							})
							.catch(errorlog);
					} else {
						session.anyrequest(data); // rpcs to pcs
					}
				},
				session.rpcs[UUID].delayIceSend,
				UUID
			); // LOCAL is SENT at 70ms delayed; REMOTE is 130ms after that -- so time to travel thru server.  Reducing network load.
		};

		session.rpcs[UUID].onconnectionstatechange = function (event) {
			const expectedPeer = this;
			if (session.rpcs[this.UUID] !== this || this.__closing) {
				return;
			}
			session.observeQosTransport(this);
			switch (this.connectionState) {
				case "connected":
						log("** connected");
						log("closeTimeout cancelled; 4");
						clearInterval(session.rpcs[this.UUID].closeTimeout);
						if (this.UUID in session.rpcs) {
							clearPeerLivenessPing(session.rpcs[this.UUID]);
						}
						if (session.security) {
							if (session.ws.readyState !== 1) {
								// already closed.
								session.ws.close();
								break;
							}
							session.ws.close();
							setTimeout(function () {
								if (session.cleanOutput != true) {
									warnUser(getTranslation("remote-peer-connected"));
								}
							}, 1);
						}
						// The connection has become fully connected
						if (session.sessionLog && this.UUID in session.rpcs) {
							try {
								pushSessionLogEntry("join", session.rpcs[this.UUID].label || this.UUID, "Connected");
							} catch(e){}
						}
						break;
				case "disconnected":
					log("closeTimeout cancelled; 5");
					warnlog("rpcs onconnectionstatechange Disconnected; retry in 5s"); // !!

					if (this.UUID in session.rpcs) {
						clearInterval(session.rpcs[this.UUID].closeTimeout);
						session.rpcs[this.UUID].delayIceSend = 0;
						if (session.rpcs[this.UUID].whipCallback) {
							return;
						}
						// Liveness ping; if no pong within 1500ms, request ICE restart from publisher
						try {
							const token = Date.now();
							const uid = this.UUID;
							if (session.rpcs[uid]) { session.rpcs[uid].lastPongToken = undefined; session.rpcs[uid].lastPingToken = token; }
							try { session.sendRequest({ ping: token }, uid); } catch (e) { warnlog(e); }
							setTimeout(function (uuid2, tok) {
								try {
									if (session.rpcs[uuid2] !== expectedPeer || expectedPeer.lastPingToken !== tok) { return; }
									if (session.rpcs[uuid2].connectionState !== "disconnected") { return; }
									if (session.rpcs[uuid2].lastPongToken !== tok) {
										try { session.anyrequest({ iceRestartRequest: true, UUID: uuid2 }); } catch (e) { warnlog(e); errorlog(e); }
									}
								} catch (e) { errorlog(e); }
							}, 3000, uid, token);
						} catch (e) { errorlog(e); }

						session.rpcs[this.UUID].closeTimeout = setTimeout(
							function (uid) {
							if (session.rpcs[uid] !== expectedPeer || expectedPeer.connectionState === "connected") return;
								log("disconnected; no reconnect even after 5s; closing");
								session.closeRPC(uid, false, true);
							},
							// RPC disconnect timeout - default 5000ms
							5000,
							this.UUID
						);
					} else {
						log("UUID not found; can't close.");
					}
					break;
				case "failed": // One or more transports has terminated unexpectedly or in an error
					warnlog("FAIL rpcs onconnectionstatechange");
					if (this.UUID in session.rpcs) {
						clearInterval(session.rpcs[this.UUID].closeTimeout);
						session.rpcs[this.UUID].delayIceSend = 0;

						// Notify publisher that viewer connection failed
						try {
							var data = {
								"iceRestartRequest": true,
								"UUID": this.UUID
							};
							session.anyrequest(data);
							log("Sent ICE restart request to publisher via anyrequest");
						} catch (e) {
							errorlog(e);
						}

						// RPC (viewer) cannot initiate reconnection - must wait for PCS (publisher)
						// Just clean up after a timeout
						session.rpcs[this.UUID].closeTimeout = setTimeout(
							function (uid) {
							if (session.rpcs[uid] !== expectedPeer || expectedPeer.connectionState === "connected") return;
								log("RPC connection failed - closing after timeout");
								session.closeRPC(uid, false, true);
							},
							30000, // 30 seconds to allow publisher time to reconnect
							this.UUID
						);
					} else {
						log("UUID not found; can't close.");
					}
					break;
				case "closed":
						// The connection has been closed
						warnlog("RTC closed");
						session.closeRPC(this.UUID);
						break;
				default:
						log("closeTimeout cancelled; 7");
						log("this.connectionState: " + this.connectionState);
						clearInterval(session.rpcs[this.UUID].closeTimeout);
						break;
			}
			};

		session.rpcs[UUID].onicegatheringstatechange = function (e) {
			let connection = e.target;
			switch (connection.iceGatheringState) {
				case "gathering":
					log("ICE GATHER START");
					break;
				case "complete":
					log("ICE GATHER COMPLETED");
					if (session.rpcs[UUID].whipCallback2) {
						// Apply IPv6 filtering for WHIP callback
						var whipCandidates = [...session.rpcs[UUID].iceBundle];
						try {
							if (session.disableIpv6) {
								var filterResult = filterIpv6FromCandidates(whipCandidates);
								whipCandidates = filterResult.filtered;
							} else if (session.preferIpv4 !== false) {
								whipCandidates = reorderCandidatesIpv4First(whipCandidates);
							}
						} catch (e) {
							warnlog("IPv6 filtering error (WHIP gather):", e);
						}
						session.rpcs[UUID].whipCallback2(whipCandidates);
						clearTimeout(session.rpcs[UUID].iceTimer);
						session.rpcs[UUID].iceTimer = null;
						session.rpcs[UUID].iceBundle = [];
						session.rpcs[UUID].whipCallback2 = null;
					}
					break;
			}
		};

		session.rpcs[UUID].oniceconnectionstatechange = function () {
			if (session.rpcs[UUID] !== this || this.__closing) return;
			try {
				if (this.iceConnectionState == "closed") {
					errorlog("CLOSED");
				} else if (this.iceConnectionState == "disconnected") {
					// !!
					if (session.rpcs[UUID].whipCallback) {
						return;
					}

					warnlog("ICE DISCONNECTED");
					if (!(this.whep && this.whep.connectionState === "connected")) {
						session.rpcs[UUID].opacityDisconnect = "0";
						session.rpcs[UUID].videoElement.style.opacity = "0"; // TODO: iphone should not be stuck in disconnect state if togglign the wifi off and on quickly. but it does. so until that's fixed, we have this.
					}
					session.rpcs[UUID].disconnectedTimeout = setTimeout(
						function (uuid) {
							updateMixer();
						},
						500,
						UUID
					);
				} else if (this.iceConnectionState == "failed") {
					errorlog("ICE FAILED");
					// RPC cannot initiate ICE restart - must wait for publisher to restart
				} else {
					log("ICE: " + this.iceConnectionState);

					if (session.rpcs[UUID].disconnectedTimeout) {
						clearTimeout(session.rpcs[UUID].disconnectedTimeout);
					}

					if (session.rpcs[UUID].videoElement && "opacity" in session.rpcs[UUID].videoElement.style) {
						if (session.rpcs[UUID].opacityDisconnect == "0" && session.rpcs[UUID].opacityMuted == "1") {
							session.rpcs[UUID].videoElement.style.opacity = "1";
							session.rpcs[UUID].opacityDisconnect = "1";
							updateMixer();
						} else {
							session.rpcs[UUID].opacityDisconnect = "1";
						}
					} else {
						session.rpcs[UUID].opacityDisconnect = "1";
					}
				}
			} catch (E) { }
		};

		session.rpcs[UUID].ondatachannel = function (event) {
			// receive data from peer; event data maybe
			log(event);
			if (event.channel.label && event.channel.label !== "sendChannel") {
				if (session.badStreamList.includes(session.rpcs[UUID].streamID)) {
					// we will have none of this.
					return;
				}
				if (event.channel.label === "chunked") {
					session.recieveChunkedStream(UUID, event.channel);
				} else if (event.channel.label === "resources") {
					session.recieveResourcesChannel(UUID, event.channel);
				} else if (session.isReservedChannelLabel(event.channel.label)) {
					warnlog("Ignoring reserved third-party data channel: " + event.channel.label);
				} else {
					session.recieveFile(session.rpcs, UUID, event.channel);
				}
				return;
			}

			//var reconnecting = false;
			//if ("receiveChannel" in session.rpcs[UUID]){
			//	reconnecting = true;
			//}
			session.rpcs[UUID].receiveChannel = event.channel;
			session.rpcs[UUID].receiveChannel.UUID = UUID;

			session.rpcs[UUID].receiveChannel.onerror = e => {
				if (e.error && e.error.sctpCauseCode && e.error.sctpCauseCode !== 12) {
					// hang up
					warnlog(e);
				}
				log("rtc data channel error 2: " + UUID);
			};

			var receiveChannelOpenHandler = async function (e, settingsContext) {
				//	if (reconnecting){return;}

				session.rpcs[UUID].delayIceSend = 0;

				if (session.scene !== false && session.optimize !== false) {
					// channel (re)opened; forget the assumed remote bitrate so the next sceneSync resends it,
					// and re-assert the current scene state once media has had a moment to attach
					session.rpcs[UUID].bandwidth = false;
					session.rpcs[UUID].audioBandwidth = null; // unknown after reopen; null matches no directive, so audio is re-sent too
					setTimeout(
						function (uuid) {
							try {
								session.sceneSync(uuid);
							} catch (e) {
								errorlog(e);
							}
						},
						1000,
						UUID
					);
				}

				var msg = {}; // Request video/audio

				msg.downloads = false;
				msg.allowmidi = false;
				msg.allowdrawing = false;
				msg.iframe = false;
				msg.widget = false;
				msg.audio = false;
				msg.video = false;
				msg.broadcast = false;
				msg.allowwebp = false;
				msg.allowscreenaudio = false;
				msg.allowscreenvideo = false;
				msg.allowchunked = false;
				msg.allowresources = false;

				//msg.preferVideoCodec = false; // does not work with guests. I'm hiding this for now since it serves no point.
				if (session.audioCodec && (session.audioCodec === "red" || session.audioCodec === "lyra")) {
					// might need to enable this for RED support? not sure.
					msg.preferAudioCodec = session.audioCodec;
				}

				const rawStreamID = session.rpcs[UUID].streamID || "";
				let baseStreamID = rawStreamID;
				if (baseStreamID && baseStreamID.endsWith(":s")) {
					baseStreamID = baseStreamID.slice(0, -2);
				}
				const isScreenStream = !!rawStreamID && rawStreamID.endsWith(":s");
				const screenStreamID = baseStreamID ? baseStreamID + ":s" : "";
				const rawScreenVariantID = screenStreamID || (isScreenStream ? rawStreamID : "");
				const excludeList = session.exclude !== false && session.exclude ? session.exclude : null;
				const baseExcluded = !!(excludeList && baseStreamID && excludeList.includes(baseStreamID));
				const screenExcluded = !!(excludeList && screenStreamID && excludeList.includes(screenStreamID));
				const rawExcluded = !!(excludeList && rawStreamID && excludeList.includes(rawStreamID));

				try {
					let allowScreenVideo = !session.noScreenShare;
					let allowScreenAudio = !session.noScreenShare;

					const allowScreenMatches = value => {
						if (!value || session.allowScreen === false || session.allowScreen === true) {
							return false;
						}
						if (session.allowScreen && typeof session.allowScreen.includes === "function") {
							return session.allowScreen.includes(value);
						}
						return false;
					};

					if (!session.noScreenShare && session.allowScreen !== false) {
						if (session.allowScreen === true) {
							allowScreenAudio = true;
							allowScreenVideo = true;
						} else if (
							allowScreenMatches(rawStreamID) ||
							allowScreenMatches(screenStreamID) ||
							allowScreenMatches(baseStreamID)
						) {
							allowScreenAudio = true;
							allowScreenVideo = true;
						} else {
							allowScreenAudio = false;
							allowScreenVideo = false;
						}
					}

					if (!session.noScreenShare) {
						if (session.screenVideoOverride === true) {
							allowScreenVideo = true;
						} else if (session.screenVideoOverride === false) {
							allowScreenVideo = false;
						}
						if (session.screenAudioOverride === true) {
							allowScreenAudio = true;
						} else if (session.screenAudioOverride === false) {
							allowScreenAudio = false;
						}
					}

					msg.allowscreenvideo = allowScreenVideo;
					msg.allowscreenaudio = allowScreenAudio;

					if (msg.allowscreenvideo) {
						if (session.novideo !== false) {
							if (!rawScreenVariantID || !session.novideo.includes(rawScreenVariantID)) {
								msg.allowscreenvideo = false;
							}
						} else if (session.broadcast !== false) {
							if (session.broadcast !== null) {
								if (screenStreamID && screenStreamID === session.broadcast) {
									msg.broadcast = true;
								} else {
									msg.allowscreenvideo = false;
								}
							} else if (session.directorUUID) {
								if (UUID === session.directorUUID) {
									msg.broadcast = true;
								} else {
									msg.allowscreenvideo = false;
								}
							}
						} else if (screenExcluded) {
							msg.allowscreenvideo = false;
							msg.allowscreenaudio = false;
						}
					}

					if (msg.allowscreenaudio) {
						if (session.noaudio !== false) {
							if (!rawScreenVariantID || !session.noaudio.includes(rawScreenVariantID)) {
								msg.allowscreenaudio = false;
							}
						} else if (session.excludeaudio) {
							if (rawScreenVariantID && session.excludeaudio.includes(rawScreenVariantID)) {
								msg.allowscreenaudio = false;
							}
						}
					}
				} catch (e) {
					errorlog(e);
				}

				try {
					if (session.novideo !== false) {
						if (rawStreamID && session.novideo.includes(rawStreamID)) {
							msg.video = true;
						} else if (screenStreamID && session.novideo.includes(screenStreamID)) {
							msg.video = isScreenStream ? true : 2;
						} else {
							msg.video = false;
						}
					} else if (session.broadcast !== false) {
						if (session.broadcast !== null) {
							if (rawStreamID && rawStreamID === session.broadcast) {
								msg.broadcast = true;
								msg.video = true;
							} else {
								msg.video = false;
							}
						} else if (session.directorUUID) {
							if (UUID === session.directorUUID) {
								msg.broadcast = true;
								msg.video = true;
							} else {
								msg.video = false;
							}
						}
					} else if (excludeList) {
						if (baseExcluded || rawExcluded) {
							msg.video = false;
						} else {
							msg.video = true;
							if (screenExcluded) {
								msg.allowscreenvideo = false;
								msg.allowscreenaudio = false;
							}
						}
					} else {
						msg.video = true;
					}

					if (session.noaudio !== false) {
						if (rawStreamID && session.noaudio.includes(rawStreamID)) {
							msg.audio = true;
						} else if (screenStreamID && session.noaudio.includes(screenStreamID)) {
							msg.audio = 2;
						} else {
							msg.audio = false;
						}
					} else if (session.excludeaudio && session.excludeaudio.includes(rawStreamID)) {
						msg.audio = false;
					} else {
						msg.audio = true;
					}

					if (session.nodirectoraudio && session.directorList.indexOf(UUID) >= 0) {
						msg.audio = false;
					}
					if (session.nodirectorvideo && session.directorList.indexOf(UUID) >= 0) {
						msg.video = false;
					}
					if (session.noiframe !== false) {
						if (session.noiframe.includes(session.rpcs[UUID].streamID)) {
							msg.iframe = true;
						} else {
							msg.iframe = false;
						}
					} else {
						msg.iframe = true;
					}

					if (session.noWidget !== false) {
						if (session.noWidget.includes(session.rpcs[UUID].streamID)) {
							msg.widget = true;
						} else {
							msg.widget = false;
						}
					} else {
						if (session.scene !== false) {
							msg.widget = false;
						} else if (session.view && !session.director && session.permaid === false) {
							msg.widget = false;
						} else {
							msg.widget = true;
						}
					}

					if (session.noMeshcast) {
						msg.allowmeshcast = false;
					}

					if (session.screenWhepPreference === "p2p") {
						msg.allowscreenmeshcast = false;
						msg.allowscreenwhipout = false;
					} else if (session.screenWhepPreference === "whep") {
						msg.allowscreenvideo = false;
						msg.allowscreenaudio = false;
					}

					if (session.hideDirector) {
						msg.hidedirector = session.hideDirector;
					}

					if (session.allowVideos !== false) {
						if (!session.allowVideos.includes(session.rpcs[UUID].streamID)) {
							msg.video = false;
							msg.audio = false;
						}
					}

					if (session.midiIn || session.midiRemote || session.midiIframe || session.midiTimecode) {
						// no point setting it to false as this is rarely used anyways
						msg.allowmidi = true;
					}

					msg.downloads = true;
					if (session.nodownloads) {
						// session.hostedFiles
						msg.downloads = false;
					}

					if (session.nochunk) {
						msg.allowchunked = false;
					} else {
						var workerSupport = false;
						if (typeof MediaStreamTrackGenerator !== "function") {
							workerSupport = await session.ensureChunkedWorkerSupport();
						}
						// Chromium exposes the legacy generator on window. Safari exposes
						// MediaStreamTrackProcessor and VideoTrackGenerator in a worker.
						var supportsNativeChunkedVideoReceive = (
							typeof MediaStreamTrackGenerator === "function" &&
							typeof VideoDecoder === "function" &&
							typeof EncodedVideoChunk === "function"
						);
						var supportsWorkerChunkedVideoReceive = !!(
							workerSupport &&
							workerSupport.videoTrackGenerator &&
							workerSupport.videoDecoder &&
							workerSupport.encodedVideoChunk &&
							typeof EncodedVideoChunk === "function"
						);
						var supportsChunkedVideoReceive = supportsNativeChunkedVideoReceive || supportsWorkerChunkedVideoReceive;
						var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
						var supportsChunkedAudioReceive = (
							supportsChunkedVideoReceive &&
							typeof AudioDecoder === "function" &&
							typeof EncodedAudioChunk === "function" &&
							(
								typeof MediaStreamTrackGenerator === "function" ||
								(typeof AudioData === "function" && typeof AudioContextConstructor === "function")
							)
						);
						if (!supportsChunkedVideoReceive) {
							msg.allowchunked = false;
						} else {
							msg.allowchunked = (session.nochunkaudio || !supportsChunkedAudioReceive) ? 2 : 1;
							msg.chunkprotocols = [session.chunkProtocolIndexedV1];
						}
					}

					if (session.allowResources) {
						msg.allowresources = session.allowResources;
					}

					if (session.allowDrawing) {
						msg.allowdrawing = true;
					}

					if (session.codec && (session.codec == "webp" || session.codec == "images" || session.codec == "jpeg")) {
						msg.allowwebp = true;
					}

					if (session.accept_layouts) {
						msg.layout = true; // this layout is for PUBLISHER, to flag, not as a layout json object.
					}

					if (session.badStreamList.includes(session.rpcs[UUID].streamID)) {
						warnlog("new connection is contained in badStreamList! This might be the director's video/audio -> this a scene?");
						msg.allowmeshcast = false;
						msg.allowchunked = false;
						msg.allowdrawing = false;
						msg.allowresources = false;
						msg.layout = false;
						msg.downloads = false;
						msg.allowmidi = false;
						msg.iframe = false;
						msg.widget = false;
						msg.audio = false;
						msg.video = false;
						msg.broadcast = false;
						msg.allowwebp = false;
						msg.allowscreenaudio = false;
						msg.allowscreenvideo = false;
					}
				} catch (e) {
					errorlog(e);
				}

				try {
					msg.info = {};
					msg.info.label = session.label;
					if (session.translation && session.translation.enabled && session.translation.language) {
						msg.info.language = session.translation.language;
					}
					msg.info.meta = session.meta;
					if (session.noScreenShare) {
						msg.info.allowscreenshares = false;
					}
					msg.info.order = session.order;
					if (session.preferChannel) {
						msg.info.preferChannel = session.preferChannel;
					}
					msg.info.stereo_url = session.stereo;
					msg.info.vb_url = session.bitrate;
					msg.info.ab_url = session.audiobitrate;
					msg.info.codec_url = session.codec;
					if (session.audioCodec) {
						msg.info.audio_codec_url = session.audioCodec;
					}
					msg.info.version = session.version;
					msg.info.forceios = session.forceios;
					msg.info.enhance_audio = session.enhance;
					msg.info.ptime = session.ptime;
					msg.info.minptime = session.minptime;
					msg.info.maxptime = session.maxptime;

					if (Firefox) {
						msg.info.firefox = Firefox;
					}
					if (ChromiumVersion) {
						msg.info.chromium = ChromiumVersion;
					}
					if (SafariVersion) {
						msg.info.safari = SafariVersion;
					}
					if (navigator && navigator.userAgent) {
						msg.info.useragent = navigator.userAgent;
					}

					if (navigator && navigator.platform) {
						msg.info.platform = navigator.platform;
					}

					if (gpgpuSupport) {
						msg.info.gpGPU = gpgpuSupport;
					}
					if (cpuSupport) {
						msg.info.CPU = cpuSupport;
					}
					//if (iOS){
					// msg.info.iPhone12Up = iPhone12Up;
					// msg.info.SafariVersion = SafariVersion;
					//}
					if (session.disableOBS === false) {
						if (window.obsstudio) {
							msg.info.obs = window.obsstudio.pluginVersion;
							try {
								msg = session.getOBSOptimization(msg, UUID);
							} catch (e) {
								errorlog(e);
								warnUser(e.message);
							}
						} else {
							msg.info.obs = false;
						}
					} else {
						msg.info.obs = false;
					}
				} catch (error) { }

				if (session.whipOutput) {
					msg.info.whipOut = true;
				}
				if (
					session.whipOutput &&
					session.whipPublishPrimary !== false &&
					typeof session.restartWhipConnection === "function"
				) {
					msg.info.whipRestartable = true;
				}

				msg.guest = false;
				msg.scene = false;
				msg.director = false;
				msg.limitaudio = false;
				msg.forceios = false;

				if (session.remote) {
					msg.remote = true;
				}

				if (session.enhance) {
					msg.enhanceaudio = true;
				}
				if (session.degrade) {
					msg.degrade = session.degrade;
				}
				if (session.solo) {
					msg.solo = session.solo;
				}
				if (session.keyframeRate !== false) {
					msg.keyframeRate = session.keyframeRate;
				}

				if (session.director) {
					// director is exempt
					msg.director = true;

					msg.forceios = session.forceios;

					if (session.directorUUID && session.directorUUID === UUID) {
						// doing it here, as the REAL director should be able to KICK this user, meaning they show up as a guest.
						session.newMainDirectorSetup();
					} else {
						var directorSettings = {};
						directorSettings.addCoDirector = [];
						for (var dirUID in session.pcs) {
							if (session.pcs[dirUID].coDirector === true) {
								directorSettings.addCoDirector.push(dirUID);
							}
						}

						if (directorSettings.addCoDirector.length) {
							msg.directorSettings = directorSettings;
						}
					}

					if (session.roomTimer && session.roomTimer > 0) {
						msg.setClock = session.roomTimer - Date.now() / 1000;
						msg.showClock = true;
						msg.startClock = true;
					} else if (session.roomTimer && session.roomTimer < 0) {
						msg.setClock = session.roomTimer * -1.0;
						msg.showClock = true;
						msg.startClock = true;
						msg.pauseClock = true;
					}

					if (session.showRoomTime) {
						msg.showTime = true;
					}

					//if (session.audiobitrate){
					//	msg.limitaudio = false;
					//} else if (session.stereo==5){
					//	msg.limitaudio = true;
					//}
					//} else if (session.audiobitrate && (session.audiobitrate>64)){ // limit audio bitrate to 64-kbps for director in-bound
					//	msg.limitaudio = true;
					//}
				} else if (session.scene !== false) {
					// OBS is exempt
					msg.scene = session.scene; // tell publisher if I am a scene or not. Director won't send video/audio then.
					if (session.showDirector || session.solo) {
						msg.showDirector = session.showDirector || session.solo;
					}
				} else if (session.roomid !== false && session.roomid !== "") {
					// guests are not
					msg.forceios = session.forceios;
					msg.guest = true; // used if iOS publisher
					//if (session.audiobitrate){
					//	msg.limitaudio = false;  // I'm going to assume this was done on purpose.
					//} else if (session.stereo && session.stereo==5){
					//	msg.limitaudio = true;
					//}
				}

				if (session.scale) {
					msg.scale = parseFloat(session.scale);
				} else if (session.viewheight || session.viewwidth) {
					msg.requestResolution = {};
					msg.requestResolution.h = null;
					msg.requestResolution.w = null;
					if (session.viewheight) {
						msg.requestResolution.h = session.viewheight;
						session.rpcs[UUID].scaleHeight = session.viewheight;
					}
					if (session.viewwidth) {
						msg.requestResolution.w = session.viewwidth;
						session.rpcs[UUID].scaleWidth = session.viewwidth;
					}
				}

				if (!session.roomid) {
					if (session.beepToNotify) {
						playtone(false, "jointone");
						showNotification("There's a new incoming connection.");
					}
				}

				session.rpcs[UUID].settings = msg; // this is what I'm sending them; not what I received

				// session.sendRequest({"ping":true}, UUID); // set the connection up first, to see if it works.

				settingsContext.stage = "send";
				var settingsErrorCallback = function (error) {
					settingsContext.errorReported = true;
					session.reportCriticalError("initial-settings-send", error);
				};
				var settingsSent = session.sendRequest(msg, UUID, false, settingsErrorCallback);
				settingsContext.stage = "post-send";
				if (settingsSent) {
					// send via WebRTC
					log("successfully requested audio and video? maybe?");
				} else {
					if (!settingsContext.errorReported) {
						session.reportCriticalError("initial-settings-send", new Error("sendRequest returned false"));
					}
				}

				if (session.obsStateSync) {
					try {
						// Ensure fresh connections immediately learn the current OBS/tally status
						session.obsStateSync(false, UUID);
					} catch (e) {
						errorlog(e);
					}
				}

				pokeIframeAPI("new-view-connection", true, UUID); // deprecated
				pokeIframeAPI("view-connection", true, UUID);
				pokeAPI("newViewConnection", session.rpcs[UUID].streamID);
				if (session.requestSceneRestoreIdentity) {
					session.requestSceneRestoreIdentity(UUID);
				}

				if (session.updateOnSlotChange) {
					if (session.layout_array) {
						session.layout = combinedLayout(session.layout_array);
					}
					updateMixer();
				}

				clearTimeout(session.rpcs[UUID].getStatsTimeout);
				session.rpcs[UUID].getStatsTimeout = setTimeout(processStats, 0, UUID);
			};

			session.rpcs[UUID].receiveChannel.onopen = function (e) {
				updateWhepDirectorControls(UUID);
				var settingsContext = { stage: "compose", errorReported: false };
				return receiveChannelOpenHandler(e, settingsContext).catch(function (error) {
					if (settingsContext.stage === "compose" || settingsContext.stage === "send") {
						session.reportCriticalError("initial-settings-" + settingsContext.stage, error);
					} else {
						errorlog(error);
					}
				});
			};

			session.rpcs[UUID].receiveChannel.onmessage = async e => {
				// the publisher is telling the viewer to do something; like mute their mic

				if (typeof e.data == "object") {
					if (!session.rpcs[UUID].imageElement) {
						session.rpcs[UUID].imageElement = document.createElement("img");
						session.rpcs[UUID].imageElement.width = 16;
						session.rpcs[UUID].imageElement.height = 9;
						session.rpcs[UUID].imageElement.style.objectFit = "contain";
						session.rpcs[UUID].imageElement.dataset.UUID = UUID;
						try {
							session.rpcs[UUID].imageElement.dataset.sid = session.rpcs[UUID].streamID;
						} catch (e) { }
						session.rpcs[UUID].imageElement.hidden = false;
						session.rpcs[UUID].imageElement.addEventListener("click", function (e) {
							// show stats of video if double clicked
							log("clicked");
							try {
								if (e.ctrlKey || e.metaKey) {
									e.preventDefault();
									if (session.statsMenu !== false) {
										var uid = e.currentTarget.dataset.UUID;
										if (!toggleStatsMenuClosed(uid) && "stats" in session.rpcs[uid]) {
											var [menu, innerMenu] = statsMenuCreator(uid);
											printViewStats(innerMenu, uid);
											menu.interval = setInterval(printViewStats, session.statsInterval, innerMenu, uid);
										}
									}
									e.stopPropagation();
									return false;
								}
							} catch (e) {
								errorlog(e);
							}
						});
						updateMixer();
					} else if (session.rpcs[UUID].imageElement.hidden) {
						session.rpcs[UUID].imageElement.hidden = false;
						session.rpcs[UUID].imageElement.style.visibility = "visible";
					}
					//const arrayBufferView = new Uint8Array(e.data);
					//const blob = new Blob([new Uint8Array(e.data)], { type: 'image/webp' });
					session.rpcs[UUID].imageElement.src = window.URL.createObjectURL(new Blob([new Uint8Array(e.data)], { type: "image/webp" })); // revoke this? not sure how to or if needed
					return;
				}

				try {
					var msg = JSON.parse(e.data); // we know it's not an object, so probably JSON
					msg.UUID = UUID;

					if ("altUUID" in msg) {
						await session.processRPCSOnMessage(msg, UUID + "_screen");
					} else {
						await session.processRPCSOnMessage(msg, UUID);
					}
				} catch (err) {
					warnlog("mystery-message-recieved");
					warnlog(err);
					warnlog(e.data);
				}
			};


			session.rpcs[UUID].receiveChannel.onclose = (event) => {
				updateWhepDirectorControls(UUID);
				if (session.rpcs[UUID] && event && session.rpcs[UUID].receiveChannel === event.target) session.observeQosTransport(session.rpcs[UUID]);
				//  We will see how this Holds up
				warnlog("rpc datachannel closed");
				//session.closeRPC(UUID); // Reopening after teardown requires restoring or renegotiating the connection state.
			};
		};

		session.rpcs[UUID].ontrack = event => {
			warnlog("New ON TRACK event");
			session.onTrack(event, UUID);
		};
		log("setup peer complete");
	};

	session.setupScreenShareAddon = function (tracks, UUID) {
		log("session.setupScreenShareAddon");
		if (!session.rpcs[UUID].screenElement) {
			if (!(UUID + "_screen" in session.rpcs) || typeof session.rpcs[UUID + "_screen"] !== "object") {
				session.rpcs[UUID + "_screen"] = {};
			}
			session.rpcs[UUID + "_screen"].realUUID = UUID;

			session.rpcs[UUID].screenElement = createVideoElement(); // not sure if this makes sense

			session.rpcs[UUID].screenElement.needsLoading = false;
			session.rpcs[UUID].screenElement.addEventListener("loadstart", event => {
				log("incoming screen share started loading");
				event.target.needsLoading = false;
			});

			session.rpcs[UUID].screenElement.srcObject = createMediaStream();
			session.rpcs[UUID + "_screen"].videoElement = session.rpcs[UUID].screenElement;
			session.rpcs[UUID + "_screen"].streamSrc = createMediaStream();

			if (session.rpcs[UUID].streamID) {
				session.rpcs[UUID + "_screen"].streamID = session.rpcs[UUID].streamID + ":s"; // to denote that it's a screenshare type 3
			}
			try {
				session.rpcs[UUID].screenShareState = true;
				if (session.rpcs[UUID + "_screen"]) {
					session.rpcs[UUID + "_screen"].screenShareState = true;
				}
			} catch (e) { }

			session.rpcs[UUID + "_screen"].stats = {};
			session.rpcs[UUID].stats.Audio_Loudness = false;

			session.rpcs[UUID + "_screen"].getStats = function () {
				return new Promise((resolve, reject) => {
					resolve([]);
				});
			};
			session.rpcs[UUID + "_screen"].getStatsTimeout = null;
			session.rpcs[UUID + "_screen"].allowGraphs = false;
			session.rpcs[UUID + "_screen"].allowMIDI = false;
			session.rpcs[UUID + "_screen"].allowDrawing = false;
			session.rpcs[UUID + "_screen"].defaultSpeaker = false;
			session.rpcs[UUID + "_screen"].motionDetectionInterval = false;
			session.rpcs[UUID + "_screen"].activelySpeaking = false; // default to off.
			session.rpcs[UUID + "_screen"].loudest = false; // default to off.
			session.rpcs[UUID + "_screen"].canvasIntervalAction = null;
			session.rpcs[UUID + "_screen"].codirectorRequested = false;
			session.rpcs[UUID + "_screen"].buffer = false;
			session.rpcs[UUID + "_screen"].bandwidth = -1;
			session.rpcs[UUID + "_screen"].audioBandwidth = -1;
			session.rpcs[UUID + "_screen"].bandwidthMuted = false;
			session.rpcs[UUID + "_screen"].showDirector = false; // the director doesn't have a secondary screen share currently, so needs to be false anyways.
			session.rpcs[UUID + "_screen"].channelOffset = false;
			session.rpcs[UUID + "_screen"].channelWidth = false;
			session.rpcs[UUID + "_screen"].targetBandwidth = -1;
			session.rpcs[UUID + "_screen"].manualBandwidth = false;
			//session.rpcs[UUID+"_screen"].maxBandwidth = null; // based on max available bitrate
			//session.rpcs[UUID+"_screen"].manualAudioBandwidth = false;
			//session.rpcs[UUID+"_screen"].videoElement=false;
			session.rpcs[UUID + "_screen"].imageElement = false;
			session.rpcs[UUID + "_screen"].voiceMeter = false;
			session.rpcs[UUID + "_screen"].group = session.rpcs[UUID].group || [];
			session.rpcs[UUID + "_screen"].videoMuted = false;
			session.rpcs[UUID + "_screen"].iframeVideo = false;
			session.rpcs[UUID + "_screen"].directorVideoMuted = false;
			session.rpcs[UUID + "_screen"].virtualHangup = false;
			session.rpcs[UUID + "_screen"].remoteMuteState = false;
			session.rpcs[UUID + "_screen"].remoteMuteElement = false;
			session.rpcs[UUID + "_screen"].lockedVideoBitrate = false;
			session.rpcs[UUID + "_screen"].lockedAudioBitrate = false;
			session.rpcs[UUID + "_screen"].closeTimeout = null;
			session.rpcs[UUID + "_screen"].mutedState = null; // scenes
			session.rpcs[UUID + "_screen"].mutedStateMixer = null;
			session.rpcs[UUID + "_screen"].mutedStateScene = null;
			session.rpcs[UUID + "_screen"].mirrorState = null;
			session.rpcs[UUID + "_screen"].flipState = null;
			session.rpcs[UUID + "_screen"].scaleHeight = false;
			session.rpcs[UUID + "_screen"].scaleWidth = false;
			session.rpcs[UUID + "_screen"].scaleSnap = false;
			//session.rpcs[UUID + "_screen"].slot = false;
			session.rpcs[UUID + "_screen"].signalMeter = false;
			session.rpcs[UUID + "_screen"].volumeControl = false;
			//session.rpcs[UUID+"_screen"].streamSrc = null;
			session.rpcs[UUID + "_screen"].screenIndexes = false;
			session.rpcs[UUID + "_screen"].screenShareState = true; // this is a screen share, so it should be true.
			session.rpcs[UUID + "_screen"].directorVolumeState = 100;
			session.rpcs[UUID + "_screen"].directorMutedState = 0;
			session.rpcs[UUID + "_screen"].nackCount = 0;
			session.rpcs[UUID + "_screen"].opacityDisconnect = "1";
			session.rpcs[UUID + "_screen"].opacityMuted = "1";
			session.rpcs[UUID + "_screen"].obsControl = false;
			session.rpcs[UUID + "_screen"].pliCount = 0;
			session.rpcs[UUID + "_screen"].label = false;
			session.rpcs[UUID + "_screen"].order = false;
			session.rpcs[UUID + "_screen"].canvasCtx = null;
			session.rpcs[UUID + "_screen"].canvas = null;
			session.rpcs[UUID + "_screen"].inboundAudioPipeline = {};
			session.rpcs[UUID + "_screen"].iframeSrc = false;
			session.rpcs[UUID + "_screen"].iframeEle = false;
			session.rpcs[UUID + "_screen"].startTime = Date.now();
			session.rpcs[UUID + "_screen"].settings = false;
			session.rpcs[UUID + "_screen"].savedVolume = false;
			session.rpcs[UUID + "_screen"].pseudoguest = false; // this shouldn't ever be true?

			if (session.activeSpeaker == 2 || session.activeSpeaker == 4) {
				session.rpcs[UUID + "_screen"].loudest = true;
			}

			if (session.rpcs[UUID].smallScreen) {
				session.rpcs[UUID + "_screen"].smallScreen = true;
			} else {
				session.rpcs[UUID + "_screen"].smallScreen = false;
			}
			if (session.rpcs[UUID].__whepAutoSmallScreen) {
				session.rpcs[UUID + "_screen"].smallScreen = false;
			}

			if (session.rpcs[UUID].allowDrawing) {
				session.rpcs[UUID + "_screen"].allowDrawing = session.rpcs[UUID].allowDrawing;
				try {
					if (typeof resumePendingDrawOnVideo === "function") {
						resumePendingDrawOnVideo(UUID + "_screen");
					}
					if (session.rpcs[UUID + "_screen"].videoElement && session.rpcs[UUID + "_screen"].videoElement.syncDrawOnVideo) {
						session.rpcs[UUID + "_screen"].videoElement.syncDrawOnVideo();
					}
				} catch (e) {
					errorlog(e);
				}
			}

			session.rpcs[UUID + "_screen"].videoElement.dataset.UUID = UUID + "_screen";
			session.rpcs[UUID + "_screen"].videoElement.id = "videosource_" + UUID + "_screen"; // could be set to UUID in the future
			if (session.rpcs[UUID + "_screen"].streamID) {
				session.rpcs[UUID + "_screen"].videoElement.dataset.sid = session.rpcs[UUID + "_screen"].streamID;
			}

			session.rpcs[UUID + "_screen"].videoElement.screenshare = false;
			session.rpcs[UUID + "_screen"].voiceMeter = false;
			///
			setupIncomingScreenTracking(session.rpcs[UUID + "_screen"].videoElement, UUID + "_screen");

			tracks.forEach(function (trk2) {
				session.rpcs[UUID].screenElement.srcObject.addTrack(trk2);
				session.rpcs[UUID + "_screen"].streamSrc.addTrack(trk2);
			});
			session.rpcs[UUID + "_screen"].videoElement.autoplay = true;
			session.rpcs[UUID + "_screen"].videoElement.setAttribute("playsinline", "");

			mediaSourceUpdated(UUID + "_screen", session.rpcs[UUID + "_screen"].streamID);
		} else {
			try {
				session.rpcs[UUID].screenElement.srcObject.getTracks().forEach(function (trk) {
					if (trk.readyState === "ended") {
						session.rpcs[UUID].screenElement.srcObject.removeTrack(trk);
					}
				});
				session.rpcs[UUID + "_screen"].streamSrc.getTracks().forEach(function (trk) {
					if (trk.readyState === "ended") {
						session.rpcs[UUID + "_screen"].streamSrc.removeTrack(trk);
					}
				});
			} catch (e) { warnlog(e); }
			tracks.forEach(function (trk2) {
				var added = false;
				session.rpcs[UUID].screenElement.srcObject.getTracks().forEach(function (trk) {
					if (trk.id == trk2.id && trk.kind == trk2.kind) {
						added = true;
					}
				});
				if (!added) {
					session.rpcs[UUID].screenElement.srcObject.addTrack(trk2);
				}
				//
				var added = false;
				session.rpcs[UUID + "_screen"].streamSrc.getTracks().forEach(function (trk) {
					if (trk.id == trk2.id && trk.kind == trk2.kind) {
						added = true;
					}
				});
				if (!added) {
					session.rpcs[UUID + "_screen"].streamSrc.addTrack(trk2);
				}
			});
		}
		try {
			session.rpcs[UUID].screenShareState = true;
		} catch (e) { }
		try {
			if (session.rpcs[UUID + "_screen"]) {
				session.rpcs[UUID + "_screen"].screenShareState = true;
			}
		} catch (e) { }
	};

	return session;
})();

var meshcastServer = false;
var meshcastServerList = false;
const meshcastPingResults = new Map();

function selectMeshcast(ele) {
	if (session.meshcast2) {
		session.meshcastCode = ele.value || "any";
		return;
	}
	meshcastServer = {};
	const option = ele.options[ele.selectedIndex];
	meshcastServer.url = option.url;
	meshcastServer.code = option.code || null;
	meshcastServer.id = option.id || null;
}

async function pingMeshcast(option, url) {
	return new Promise((resolve) => {
		const xhttp = new XMLHttpRequest();
		xhttp.onload = function () {
			const load = parseFloat(this.responseText);
			if (load >= 0) {
				meshcastPingResults.set(option.id || option.code, {
					load,
					failed: false,
					option
				});

				// Update option text based on load
				if (load > 70) {
					option.innerHTML += " (full)";
				} else if (load > 40) {
					option.innerHTML += " (fair)";
				} else if (load > 10) {
					option.innerHTML += " (ok)";
				} else if (load > 0) {
					option.innerHTML += " (good)";
				} else {
					handleMeshcastFailure(option);
				}
				resolve(true);
			} else {
				handleMeshcastFailure(option);
				resolve(false);
			}
		};

		xhttp.onerror = () => {
			handleMeshcastFailure(option);
			resolve(false);
		};

		xhttp.timeout = 2000; // Increased timeout to 2s
		xhttp.ontimeout = () => {
			handleMeshcastFailure(option, "timeout");
			resolve(false);
		};

		xhttp.open("GET", url, true);
		xhttp.send();
	});
}

function handleMeshcastFailure(option, reason = "fail") {
	meshcastPingResults.set(option.id || option.code, {
		load: Infinity,
		failed: true,
		option
	});
	option.disabled = true;
	option.innerHTML += ` (${reason})`;
}

function sortMeshcastOptions() {
	const edgelist = document.getElementById("edgelist");
	const options = Array.from(edgelist.options);

	options.sort((a, b) => {
		const aResult = meshcastPingResults.get(a.id || a.code) || { load: Infinity, failed: true };
		const bResult = meshcastPingResults.get(b.id || b.code) || { load: Infinity, failed: true };

		// Failed servers go to the bottom
		if (aResult.failed && !bResult.failed) return 1;
		if (!aResult.failed && bResult.failed) return -1;

		// If both servers are working, consider load and timezone
		const aServer = meshcastServerList.find(s => (s.id || s.code) === (a.id || a.code));
		const bServer = meshcastServerList.find(s => (s.id || s.code) === (b.id || b.code));

		const aScore = aResult.load + (aServer.delta || 0) / 40;
		const bScore = bResult.load + (bServer.delta || 0) / 40;

		// Store scores for debugging/reference
		a.dataset.score = aScore;
		b.dataset.score = bScore;
		a.dataset.load = aResult.load;
		b.dataset.load = bResult.load;
		a.dataset.delta = (aServer.delta || 0) / 40;
		b.dataset.delta = (bServer.delta || 0) / 40;

		return aScore - bScore;
	});

	options.forEach(option => edgelist.appendChild(option));
}

function selectBestMeshcastServer() {
	const edgelist = document.getElementById("edgelist");

	// First try to find a working preferred server
	let bestOption = Array.from(edgelist.options).find(option =>
		option.preferred && !option.disabled
	);

	// If no working preferred server, take first non-disabled server
	if (!bestOption) {
		bestOption = Array.from(edgelist.options).find(option => !option.disabled);
	}

	if (bestOption) {
		bestOption.selected = true;
		selectMeshcast(edgelist);
	} else {
		console.error("No available meshcast servers found");
	}
}

async function queryMeshcastServers(callback = false) {
	if (session.meshcast2) {
		var controller = new AbortController();
		var timeout = setTimeout(function () { controller.abort(); }, 10000);
		var select = document.getElementById("edgelist");
		try {
			select.innerHTML = "";
			var automatic = document.createElement("option");
			automatic.value = "";
			automatic.textContent = "Automatic (Meshcast v2)";
			select.appendChild(automatic);
			select.disabled = !!session.whipOutput || !!session.whipOutputScreen;
			const response = await fetch("https://app.meshcast.io/api/publish/anonymous/servers", { signal: controller.signal });
			if (!response.ok) throw new Error("Meshcast region list unavailable");
			const payload = await response.json();
			for (const server of payload.servers || []) {
				const option = document.createElement("option");
				option.value = server.id;
				option.textContent = server.name || server.region || server.id;
				select.appendChild(option);
			}
			const preferred = preferredMeshcast2Server(payload.servers || []);
			if (preferred) select.value = preferred.id;
			select.disabled = !!session.whipOutput || !!session.whipOutputScreen;
			if (session.director && !session.cleanOutput && !session.cleanDirector) document.getElementById("meshcastMenu").classList.remove("hidden");

		} catch (e) {
			warnlog("Meshcast region list unavailable; automatic routing remains available.");
			if (select) select.title = "Region list unavailable. Automatic routing remains available.";
		} finally {
			clearTimeout(timeout);
			if (callback) callback();
		}
		return;
	}
	try {
		const d = new Date();
		const tz = urlParams.has("tz") ? parseInt(urlParams.get("tz")) : d.getTimezoneOffset();

		const response = await fetch("https://meshcast.io/servers.json?ts=" + Date.now());
		const serverList = await response.json();
		meshcastServerList = serverList;

		const meshcastValue = typeof session.meshcast === "string" ? session.meshcast.trim() : session.meshcast;
		const specialMeshcastModes = ["any", "audio", "video"];
		let requestedCode = session.meshcastCode || null;

		if (typeof requestedCode === "string") {
			requestedCode = requestedCode.trim();
			if (!requestedCode.length) {
				requestedCode = null;
			}
		}

		if (!requestedCode && typeof meshcastValue === "string" && meshcastValue.length) {
			const normalizedMeshcast = meshcastValue.toLowerCase();
			if (!specialMeshcastModes.includes(normalizedMeshcast)) {
				requestedCode = meshcastValue;
			}
		}

		if (requestedCode) {
			const matches = serverList.some(s =>
				(s.code && s.code === requestedCode) || (s.id && s.id === requestedCode)
			);

			if (!matches) {
				const looksLikeHost = requestedCode.includes(".");
				let assumedUrl;
				if (looksLikeHost) {
					assumedUrl = requestedCode.startsWith("http")
						? requestedCode.replace(/\/$/, "")
						: "https://" + requestedCode.replace(/\/$/, "");
				} else {
					assumedUrl = `https://${requestedCode}.meshcast.io`;
				}

				const assumed = {
					id: requestedCode,
					code: requestedCode,
					url: assumedUrl,
					label: `Assumed: ${requestedCode}`,
					tz: tz,
					penalty: -10000000,
					preferred: true,
				};
				meshcastServerList.unshift(assumed);
			}
		}

		// First sort by timezone and preferred status
		meshcastServerList = meshcastServerList.map(server => {
			let delta = Math.abs(server.tz - tz);
			if (Math.abs(delta - 60 * 24) < delta) {
				delta = Math.abs(delta - 60 * 24);
			}
			server.delta = delta + (server.penalty || 0);
			if (requestedCode) {
				const matchesRequested =
					(server.code && server.code === requestedCode) ||
					(server.id && server.id === requestedCode);
				if (!matchesRequested) {
					server.delta += 660000;
				}
				server.preferred = !!matchesRequested;
			} else {
				server.preferred = !!(session.meshcastCode &&
					((server.id === session.meshcastCode) || (session.meshcastCode === server.code)));
			}

			return server;
		}).sort((a, b) => a.delta - b.delta);

		// Create all options
		const options = meshcastServerList.map(server => {
			const option = document.createElement("option");
			if (server.code) option.code = server.code;
			if (server.id) option.id = server.id;
			option.url = server.url;
			option.textContent = server.label;
			option.preferred = server.preferred;
			document.getElementById("edgelist").appendChild(option);
			return option;
		});

		// Ping all servers concurrently
		const pingPromises = meshcastServerList.map((server, index) =>
			pingMeshcast(options[index], server.url + "/status")
		);

		// Wait for all pings to complete
		await Promise.all(pingPromises);

		// Sort options based on ping results and preferences
		sortMeshcastOptions();

		// Select best available server
		selectBestMeshcastServer();

		if (callback) {
			callback();
		}

		if (session.director && !session.cleanOutput && !session.cleanDirector) {
			document.getElementById("meshcastMenu").classList.remove("hidden");
		}
	} catch (error) {
		console.error("Error fetching meshcast servers:", error);
	}
}

function preferredMeshcast2Server(servers) {
	const requested = String(session.meshcastCode || session.meshcast || "any").trim().toLowerCase()
		.replace(/^https?:\/\//, "").replace(/\.meshcast\.io\/?$/, "");
	const regionAliases = { use1: "us-east", use2: "us-east", usw1: "us-west", usw2: "us-west", de1: "eu", cae1: "ca", cn1: "asia" };
	const region = regionAliases[requested];
	return servers.find(server => server.id === requested) ||
		(region && servers.find(server => typeof server.region === "string" && server.region.toLowerCase().startsWith(region)));
}

function showMeshcastQuotaStatus(quota, error = false) {
	if (!session.meshcast2Anonymous || (!quota && !error)) return;
	if (quota) session.meshcast2Quota = quota;
	if (session.cleanOutput || session.cleanViewer || session.cleanDirector || session.hidehome || session.hidesololinks ||
		["clean", "cleanoutput", "cleanish", "hidehome", "hidemenu", "hm", "hideheader", "noheader", "hh"].some(function (flag) { return urlParams.has(flag); })) return;

	var percent = Number(quota && (typeof quota.bandwidth_percentage === "undefined" ? quota.percentage : quota.bandwidth_percentage));
	var exceeded = quota && (quota.quota_exceeded === true || (typeof quota.quota_exceeded === "undefined" && percent >= 100));
	if (quota && typeof quota.warning_percentage !== "undefined") percent = Number(quota.warning_percentage);
	var level = error || (exceeded ? 100 : percent >= 95 ? 95 : percent >= 80 ? 80 : 0);
	var marker = String(quota && quota.reset_at || "") + ":" + level;
	if (!level || session.meshcast2QuotaDismissed === marker) return;
	session.meshcast2QuotaDismissed = marker; // Don't repeat the same warning on every usage check.
	warnUser(getTranslation(error || (exceeded ? "meshcast-usage-exhausted" : "meshcast-usage-high")), false, false);
}

async function refreshMeshcastQuotaStatus() {
	if (!session.meshcast2Anonymous || session.meshcast2QuotaPending) return;
	session.meshcast2QuotaPending = true;
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10000);
	try {
		const response = await fetch("https://app.meshcast.io/api/publish/anonymous/status", { cache: "no-store", signal: controller.signal });
		if (!response.ok) throw new Error("Meshcast usage check unavailable");
		var quota = await response.json();
		if (!quota || !(Number(quota.bandwidth_limit_bytes) > 0) || !Number.isFinite(Number(quota.bandwidth_used_bytes))) throw new Error("Invalid Meshcast usage response");
		showMeshcastQuotaStatus(quota);
	} catch (e) {
		warnlog("Meshcast bandwidth status unavailable; will retry.");
	} finally {
		clearTimeout(timeout);
		session.meshcast2QuotaPending = false;
	}
}

async function renewMeshcast2Sessions() {
	if (session.meshcast2Renewing) return;
	session.meshcast2Renewing = true;
	try {
		const active = Object.keys(session.meshcast2Sessions || {}).some(media => {
			const stream = media === "screen" ? session.screenStream : session.videoElement && session.videoElement.srcObject;
			const enabled = media === "screen" ? session.whipPublishScreen && session.screenShareState : session.whipPublishPrimary;
			return enabled && stream && stream.getTracks().some(track => track.readyState === "live");
		});
		if (active) await refreshMeshcastQuotaStatus();
		for (const media of Object.keys(session.meshcast2Sessions || {})) {
			const state = session.meshcast2Sessions[media];
			const stream = media === "screen" ? session.screenStream : session.videoElement && session.videoElement.srcObject;
			const enabled = media === "screen" ? session.whipPublishScreen && session.screenShareState : session.whipPublishPrimary;
			if (!enabled || !stream || !stream.getTracks().some(track => track.readyState === "live") || Date.now() < state.renewAt) continue;
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 10000);
			try {
				const response = await fetch("https://app.meshcast.io/api/publish/anonymous/renew", {
					method: "POST", headers: { Authorization: "Bearer " + state.key }, signal: controller.signal
				});
				var payload = await response.json().catch(function () { return {}; });
				if (!response.ok) {
					if (payload.code === "QUOTA_EXCEEDED") {
						var quota = payload.quota || {};
						quota.quota_exceeded = true;
						showMeshcastQuotaStatus(quota);
					} else {
						showMeshcastQuotaStatus(null, "meshcast-renewal-failed");
					}
					throw new Error("Meshcast session renewal failed");
				}
				if (!(Number(payload.expires_in_seconds) > 0)) throw new Error("Meshcast returned an invalid session expiry");
				state.expiresAt = Date.now() + payload.expires_in_seconds * 1000;
				state.renewAt = Date.now() + payload.expires_in_seconds * 500;
			} catch (e) {
				warnlog(e);
				if (!session.meshcast2Quota || !session.meshcast2Quota.quota_exceeded) showMeshcastQuotaStatus(null, "meshcast-renewal-failed");
			} finally {
				clearTimeout(timeout);
			}
		}
	} finally {
		session.meshcast2Renewing = false;
	}
}

async function meshcast2() {
	if (!session.meshcast2 || (!session.autostart && !session.videoElement.srcObject && !session.screenShareState)) {
		return;
	}
	if (session.meshcast2Pending) {
		return session.meshcast2Pending;
	}
	const baseUrl = "https://app.meshcast.io";
	const mode = String(session.meshcast2).toLowerCase();
	const anonymous = session.meshcast2 === true || ["any", "anon", "audio", "video"].includes(mode);
	session.meshcast2Anonymous = anonymous;
	const controller = new AbortController();
	const requestTimeout = setTimeout(() => controller.abort(), 20000);

	async function configureOutput(media) {
		const screen = media === "screen";
		const settingsName = screen ? "whipoutScreenSettings" : "whipoutSettings";
		const outputName = screen ? "whipOutputScreen" : "whipOutput";
		const previous = session.meshcast2Sessions && session.meshcast2Sessions[media];
		if (previous && previous.expiresAt <= Date.now()) session[settingsName] = false;
		if (session[settingsName] !== false) {
			const peer = screen ? session.whipOutScreen : session.whipOut;
			if (!peer || ["closed", "failed"].includes(peer.connectionState)) {
				if (screen) whipOutScreen();
				else whipOut();
			}
			return;
		}
		let streamKey;
		const routing = new URLSearchParams();
		routing.set("timezone_offset", String(new Date().getTimezoneOffset()));
		const requestedRegion = String(session.meshcastCode || session.meshcast || "any").trim().toLowerCase()
			.replace(/^https?:\/\//, "").replace(/\.meshcast\.io\/?$/, "");
		const regionAliases = { use1: "us-east", use2: "us-east", usw1: "us-west", usw2: "us-west", de1: "eu-central", cae1: "ca-east", cn1: "asia-east" };
		if (regionAliases[requestedRegion]) routing.set("region_hint", regionAliases[requestedRegion]);
		else if (["us-east", "us-west", "us-central", "eu-west", "eu-central", "ca-east", "ca-west", "asia-east", "asia-southeast", "oceania"].includes(requestedRegion)) routing.set("region_hint", requestedRegion);
		else if (!["any", "anon", "audio", "video", "false"].includes(requestedRegion)) routing.set("server", requestedRegion);
		const serverQuery = "?" + routing.toString();
		if (anonymous) {
			session.meshcast2LastError = null;
			const response = await fetch(baseUrl + "/api/publish/anonymous", {
				method: "POST",
				signal: controller.signal,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ duration_minutes: 120 })
			});
			var payload = await response.json().catch(function () { return {}; });
			if (!response.ok) {
				session.meshcast2LastError = payload.code || "UNKNOWN";
				if (payload.code === "QUOTA_EXCEEDED") {
					var quota = payload.quota || {};
					quota.quota_exceeded = true;
					showMeshcastQuotaStatus(quota);
				}
				throw new Error("Meshcast could not start publishing. The service may be temporarily unavailable; try again shortly.");
			}
			streamKey = payload.stream_key;
			if (typeof streamKey !== "string" || !streamKey.startsWith("anon_")) throw new Error("Meshcast returned no anonymous credential");
			const lifetime = Number(payload.expires_in_seconds) || 7200;
			session.meshcast2Sessions = session.meshcast2Sessions || {};
			session.meshcast2Sessions[media] = { key: streamKey, expiresAt: Date.now() + lifetime * 1000, renewAt: Date.now() + lifetime * 500 };
			if (!session.meshcast2RenewTimer) session.meshcast2RenewTimer = setInterval(renewMeshcast2Sessions, 60000);
			if (payload.quota) showMeshcastQuotaStatus(payload.quota);
			refreshMeshcastQuotaStatus();
		} else {
			streamKey = screen ? urlParams.get("meshcast2screen") : String(session.meshcast2).trim();
			if (!streamKey) {
				throw new Error("Screen sharing with an account requires a separate Publish Key in &meshcast2screen=.");
			}
		}
		if (!streamKey || typeof streamKey !== "string") throw new Error("Meshcast returned no publishing credential");
		session.meshcast2Anonymous = anonymous;
		session.meshcast2LastError = null;
		const select = document.getElementById("edgelist");
		if (select) {
			select.disabled = true;
			select.title = "Can't change the location once started streaming";
		}
		session[outputName] = baseUrl + "/api/gateway/whip/" + encodeURIComponent(streamKey) + serverQuery;
		// Account playback is populated from the WHIP response's public WHEP URL.
		// Never distribute an account Publish Key in peer settings.
		session[settingsName] = {
			type: "whep",
			url: "", // Advertise only the node-pinned URL returned by WHIP.
			media: media,
			started: false
		};
		if (screen) {
			whipOutScreen();
		} else {
			whipOut();
		}
	}

	session.meshcast2Pending = (async function () {
		try {
			if (session.whipPublishPrimary && (session.autostart || session.videoElement.srcObject)) {
				await configureOutput("primary");
			}
			if (session.whipPublishScreen && session.screenShareState) {
				await configureOutput("screen");
			}
		} catch (e) {
			errorlog(e);
			if (anonymous) {
				if (session.meshcast2LastError !== "QUOTA_EXCEEDED") showMeshcastQuotaStatus(null, "meshcast-publishing-failed");
			} else if (!session.cleanOutput) {
				promptAlt(e.message || "Meshcast publishing failed. Try again later.", false, false, false, 5);
			}
		}
	})();
	try {
		return await session.meshcast2Pending;
	} finally {
		clearTimeout(requestTimeout);
		session.meshcast2Pending = null;
	}
}

async function meshcast(ping = false) {
	if (session.meshcast2) return meshcast2();
	if (!session.meshcast) return;

	if (ping) {
		await queryMeshcastServers();
		return;
	}

	if (session.whipoutSettings !== false) return;

	if (!session.autostart && !session.videoElement.srcObject) return;

	session.whipoutSettings = null;

	const candidates = [];
	const primaryToken = session.generateStreamID(14);
	const screenToken = `${primaryToken}_s`;

	async function meshcastCallback() {
		document.getElementById("edgelist").disabled = true;
		document.getElementById("edgelist").title = "Can't change the location once started streaming";

		if (!meshcastServer && meshcastServerList && meshcastServerList.length) {
			meshcastServer = meshcastServerList.shift();
		}

		if (!meshcastServer) {
			handleMeshcastError();
			return;
		}

		if (meshcastServer.id) {
			// Track meshcast server for QoS
			if (session.qosEnabled && session.qosData && meshcastServer && meshcastServer.url) {
				try {
					var host = new URL(meshcastServer.url).hostname;
					session.qosData.transportType = "meshcast";
					if (host && !session.qosData.meshcastServersUsed.includes(host)) {
						session.qosData.meshcastServersUsed.push(host);
					}
				} catch (e) {}
			}

			if (session.whipPublishPrimary) {
				session.whipOutput = meshcastServer.url + "/" + primaryToken + "/whip";
				session.whipoutSettings = {
					type: "whep",
					url: meshcastServer.url + "/" + primaryToken + "/whep",
					token: primaryToken,
					media: "primary",
					started: false
				};
				whipOut();
			} else {
				session.whipOutput = false;
				session.whipoutSettings = false;
			}

			if (session.whipPublishScreen) {
				session.whipOutputScreen = meshcastServer.url + "/" + screenToken + "/whip";
				session.whipoutScreenSettings = {
					type: "whep",
					url: meshcastServer.url + "/" + screenToken + "/whep",
					token: screenToken,
					media: "screen",
					started: false
				};
				if (session.screenShareState) {
					whipOutScreen();
				}
			} else {
				session.whipOutputScreen = false;
				session.whipoutScreenSettings = false;
			}
		}
	}

	if (!meshcastServerList) {
		await queryMeshcastServers(meshcastCallback);
	} else {
		await meshcastCallback();
	}
}

function handleMeshcastError() {
	errorlog("No meshcast server found that worked");
	if (!session.cleanOutput) {
		const restartURL = window.location.href;
		if (restartURL.includes("?")) {
			warnUser(
				`Failed to connect to Meshcast.\n\nCheck your connection or switch to peer-to-peer mode instead.\n\n` +
				`<a href='${restartURL}&meshcastfailed'>Click here to reload without Meshcast enabled</a>`,
				false,
				false
			);
		} else {
			warnUser("Failed to connect to Meshcast.\n\nCheck your connection or switch to peer-to-peer mode instead.");
		}
	}
}

function whepSettingsHasStarted(settings) {
	if (!settings || !("started" in settings)) {
		return false;
	}
	const started = settings.started;
	if (typeof started === "number") {
		return started > 0;
	}
	if (typeof started === "string") {
		const trimmed = started.trim();
		if (!trimmed) {
			return false;
		}
		if (trimmed === "0") {
			return false;
		}
		if (trimmed.toLowerCase() === "false") {
			return false;
		}
		return true;
	}
	if (started === true) {
		return true;
	}
	return false;
}

	function whepSettingsMarker(settings) {
		if (!settings) {
			return null;
		}
		if (whepSettingsHasStarted(settings)) {
			return String(settings.started);
		}
		const url = typeof settings.url === "string" ? settings.url : "";
		const token = typeof settings.token === "string" ? settings.token : "";
		if (url || token) {
			return url + "|" + token;
		}
		return null;
	}

	function cancelWhepAudioRecovery(UUID, preserveReconnectHistory = true) {
		try {
			if (!session || !session.rpcs || !(UUID in session.rpcs) || !session.rpcs[UUID]) {
				return;
			}
			const rpc = session.rpcs[UUID];
			const state = rpc.whepAudioRecoveryState;
			if (!state) {
				return;
			}

			if (state.muteTimer) {
				clearTimeout(state.muteTimer);
				state.muteTimer = null;
			}
			if (state.autoplayRetryTimer) {
				clearTimeout(state.autoplayRetryTimer);
				state.autoplayRetryTimer = null;
			}
			state.autoplayRetryQueued = false;
			state.autoplayRetryInFlight = false;

			if (state.onVisibilityChange && typeof document !== "undefined" && document.removeEventListener) {
				document.removeEventListener("visibilitychange", state.onVisibilityChange);
			}
			if (state.onFocus && typeof window !== "undefined" && window.removeEventListener) {
				window.removeEventListener("focus", state.onFocus);
			}
			state.onVisibilityChange = null;
			state.onFocus = null;

			if (state.track && state.track.removeEventListener) {
				if (state.onMute) {
					state.track.removeEventListener("mute", state.onMute);
				}
				if (state.onUnmute) {
					state.track.removeEventListener("unmute", state.onUnmute);
				}
				if (state.onEnded) {
					state.track.removeEventListener("ended", state.onEnded);
				}
			}
			state.onMute = null;
			state.onUnmute = null;
			state.onEnded = null;

			if (state.stream && state.stream.removeEventListener && state.onRemoveTrack) {
				state.stream.removeEventListener("removetrack", state.onRemoveTrack);
			}
			state.onRemoveTrack = null;
			state.stream = null;
			state.track = null;
			state.trackId = null;
			if (!preserveReconnectHistory) {
				state.reconnectAttempts = [];
			}
			state.recoveryInProgress = false;
			state.autoplayRetryAttempted = false;
			state.epoch = (parseInt(state.epoch) || 0) + 1;
		} catch (e) {
			errorlog(e);
		}
	}

	function stopPrimaryWhep(UUID, clearState = true) {
		try {
			if (!session || !session.rpcs || !session.rpcs[UUID]) {
				return;
			}
			const rpc = session.rpcs[UUID];
			cancelWhepAudioRecovery(UUID);
			rpc.suppressReconnect = true;
			rpc.primaryWhepRequested = false;
			rpc.reconnecting = false;
			rpc.activePrimaryWhepMarker = null;
			try {
				if (rpc.whep && rpc.whep.close) {
					rpc.whep.close();
				}
			} catch (e) {
				warnlog(e);
			}
			rpc.whep = null;
			if (clearState) {
				rpc.pendingPrimaryWhepSettings = null;
				rpc.lastPrimaryWhepUrl = null;
				rpc.lastPrimaryWhepToken = null;
				rpc.lastPrimaryWhepMarker = null;
				rpc.pendingPrimaryWhepMarker = null;
				delete rpc.pendingPrimaryWhepStarted;
			}
		} catch (e) {
			errorlog(e);
		}
	}

	function maybeStartPrimaryWhep(UUID) {
		try {
			if (!session || !session.rpcs || !session.rpcs[UUID]) {
				return;
			}
			const rpc = session.rpcs[UUID];
			const pendingSettings = rpc.pendingPrimaryWhepSettings;
			if (!pendingSettings || !pendingSettings.url) {
				return;
			}
			const url = pendingSettings.url;
			const token = pendingSettings.token;
			const pendingMarker = rpc.pendingPrimaryWhepMarker || whepSettingsMarker(pendingSettings);
			const activeMarker = rpc.activePrimaryWhepMarker || null;
			const hasStarted = whepSettingsHasStarted(pendingSettings) || !!rpc.pendingPrimaryWhepStarted;

			if (rpc.primaryWhepRequested) {
				const hasLivePrimaryWhep = !!(rpc.whep && rpc.whep.connectionState !== "closed" && rpc.whep.connectionState !== "failed");
				if (pendingMarker && activeMarker && pendingMarker !== activeMarker) {
					stopPrimaryWhep(UUID, false);
				} else if (!hasLivePrimaryWhep) {
					rpc.primaryWhepRequested = false;
					rpc.activePrimaryWhepMarker = null;
				} else {
					return;
				}
			}
			if (rpc.primaryWhepRequested) {
				return;
			}

			rpc.primaryWhepRequested = true;
			rpc.suppressReconnect = false;
			rpc.activePrimaryWhepMarker = pendingMarker || (hasStarted ? "__started__" : null);

			if (token) {
				whepIn(url, token, UUID);
			} else {
				whepIn(url, false, UUID);
			}
		} catch (e) {
			errorlog(e);
		}
	}

	async function whepWatch(UUID, settings) { // secondary; meshcast-like where tied to user.
		// whepWatch(UUID, msg.whepSettings);
		if (session.noMeshcast) {
			return;
		}
		console.log(settings);

		if (settings.type == "meshcast") {
			meshcastWatch(UUID, settings);
		} else if (settings.type == "whep") {
			if (settings && settings.url) {
				const isScreenMedia = settings.media === "screen";
				if (isScreenMedia) {
					const targetUUID = UUID + "_screen";
					const payload = Object.assign({}, settings);
					try {
						if (!(targetUUID in session.rpcs)) {
							session.rpcs[targetUUID] = {};
						}
						const screenRPC = session.rpcs[targetUUID];
						screenRPC.realUUID = UUID;
						const nextUrl = payload.url || "";
						const nextToken = payload.token || "";
						const nextMarker = whepSettingsMarker(payload);
						const hasStarted = whepSettingsHasStarted(payload);
						const prevUrl = screenRPC.lastWhepUrl || "";
						const prevToken = screenRPC.lastWhepToken || "";
						const prevMarker = screenRPC.lastWhepMarker || null;
						const payloadChanged = prevUrl !== nextUrl || prevToken !== nextToken || prevMarker !== nextMarker;
						if (payloadChanged && screenRPC.whepRequested) {
							cancelWhepAudioRecovery(targetUUID);
							try {
								if (screenRPC.whep && screenRPC.whep.close) {
									screenRPC.whep.close();
								}
							} catch (e) {
								warnlog(e);
							}
							screenRPC.whep = null;
							screenRPC.whepRequested = false;
							screenRPC.reconnecting = false;
							screenRPC.activeWhepMarker = null;
						}
						screenRPC.pendingWhepSettings = payload;
						screenRPC.lastWhepUrl = nextUrl;
						screenRPC.lastWhepToken = nextToken;
						screenRPC.lastWhepMarker = nextMarker;
						screenRPC.pendingWhepMarker = nextMarker;
						if (hasStarted) {
							screenRPC.pendingWhepStarted = true;
						} else {
							delete screenRPC.pendingWhepStarted;
						}
						screenRPC.suppressReconnect = false;
						screenRPC.stats = screenRPC.stats || {};
						if (typeof screenRPC.screenShareState === "undefined") {
							screenRPC.screenShareState = !!(session.rpcs[UUID] && session.rpcs[UUID].screenShareState);
						}
						if (session.rpcs[UUID] && session.rpcs[UUID].streamID) {
							const parentStreamID = session.rpcs[UUID].streamID;
							const screenStreamID = parentStreamID + ":s";
							if (screenRPC.streamID !== screenStreamID) {
								screenRPC.streamID = screenStreamID;
							}
							if (screenRPC.videoElement) {
								screenRPC.videoElement.dataset.sid = screenStreamID;
							}
							if (session.rpcs[UUID].screenElement && session.rpcs[UUID].screenElement !== screenRPC.videoElement) {
								session.rpcs[UUID].screenElement.dataset.sid = screenStreamID;
							}
						}
						if (hasStarted && session.rpcs[UUID]) {
							session.rpcs[UUID].screenShareState = true;
						}
						if (hasStarted) {
							screenRPC.screenShareState = true;
						}
					} catch (e) { }
					maybeStartScreenWhep(UUID);
				} else {
					const payload = Object.assign({}, settings);
					try {
						if (!(UUID in session.rpcs)) {
							session.rpcs[UUID] = {};
						}
						const rpc = session.rpcs[UUID];
						const nextUrl = payload.url || "";
						const nextToken = payload.token || "";
						const nextMarker = whepSettingsMarker(payload);
						const hasStarted = whepSettingsHasStarted(payload);
						const prevUrl = rpc.lastPrimaryWhepUrl || "";
						const prevToken = rpc.lastPrimaryWhepToken || "";
						const prevMarker = rpc.lastPrimaryWhepMarker || null;
						const payloadChanged = prevUrl !== nextUrl || prevToken !== nextToken || prevMarker !== nextMarker;
						if (payloadChanged && rpc.primaryWhepRequested) {
							stopPrimaryWhep(UUID, false);
						}
						rpc.pendingPrimaryWhepSettings = payload;
						rpc.lastPrimaryWhepUrl = nextUrl;
						rpc.lastPrimaryWhepToken = nextToken;
						rpc.lastPrimaryWhepMarker = nextMarker;
						rpc.pendingPrimaryWhepMarker = nextMarker;
						if (hasStarted) {
							rpc.pendingPrimaryWhepStarted = true;
						} else {
							delete rpc.pendingPrimaryWhepStarted;
						}
						rpc.suppressReconnect = false;
						rpc.stats = rpc.stats || {};
					} catch (e) { }
					maybeStartPrimaryWhep(UUID);
				}
			}
		}
	}

function maybeStartScreenWhep(UUID) {
	try {
		if (!session || !session.rpcs) {
			return;
		}
		const targetUUID = UUID + "_screen";
		const screenRPC = session.rpcs[targetUUID];
		if (!screenRPC || !screenRPC.pendingWhepSettings) {
			return;
		}
		const parent = session.rpcs[UUID] || null;
		const pendingSettings = screenRPC.pendingWhepSettings;
		const { url, token } = pendingSettings;
		if (!url) {
			return;
		}
		const pendingMarker = screenRPC.pendingWhepMarker || whepSettingsMarker(pendingSettings);
		const activeMarker = screenRPC.activeWhepMarker || null;
		const hasStarted = whepSettingsHasStarted(pendingSettings) || !!screenRPC.pendingWhepStarted;

		if (hasStarted) {
			if (parent) {
				if (typeof parent.__whepPrevSmallScreen === "undefined") {
					parent.__whepPrevSmallScreen = parent.smallScreen;
				}
				if (!parent.smallScreen) {
					parent.smallScreen = true;
					parent.__whepAutoSmallScreen = true;
				} else {
					parent.__whepAutoSmallScreen = false;
				}
			}
			if (parent) {
				parent.screenShareState = true;
			}
			screenRPC.screenShareState = true;
			if (parent && parent.__whepAutoSmallScreen) {
				screenRPC.smallScreen = false;
			}
		}

		if (!hasStarted && (!parent || !parent.screenShareState)) {
			return;
		}

		if (screenRPC.whepRequested) {
			if (pendingMarker && activeMarker && pendingMarker !== activeMarker) {
				cancelWhepAudioRecovery(targetUUID);
				try {
					if (screenRPC.whep && screenRPC.whep.close) {
						screenRPC.whep.close();
					}
				} catch (e) {
					warnlog(e);
				}
				screenRPC.whep = null;
				screenRPC.whepRequested = false;
				screenRPC.reconnecting = false;
				screenRPC.activeWhepMarker = null;
			} else {
				return;
			}
		}
		if (screenRPC.whepRequested) {
			return;
		}

		screenRPC.whepRequested = true;
		screenRPC.suppressReconnect = false;
		screenRPC.screenShareState = true;
		screenRPC.activeWhepMarker = pendingMarker || (hasStarted ? "__started__" : null);

		if (token) {
			whepIn(url, token, targetUUID);
		} else {
			whepIn(url, false, targetUUID);
		}
	} catch (e) {
		errorlog(e);
	}
}

function stopScreenWhep(UUID) {
	try {
		const targetUUID = UUID + "_screen";
		const screenRPC = session.rpcs && session.rpcs[targetUUID] ? session.rpcs[targetUUID] : null;
		if (!screenRPC) {
			return;
		}
		cancelWhepAudioRecovery(targetUUID);
		screenRPC.pendingWhepSettings = null;
		screenRPC.whepRequested = false;
		screenRPC.suppressReconnect = true;
		screenRPC.reconnecting = false;
		screenRPC.screenShareState = false;
		screenRPC.lastWhepUrl = null;
		screenRPC.lastWhepToken = null;
		screenRPC.lastWhepMarker = null;
		screenRPC.pendingWhepMarker = null;
		screenRPC.activeWhepMarker = null;
		delete screenRPC.pendingWhepStarted;
		try {
			if (session.rpcs[UUID]) {
				session.rpcs[UUID].screenShareState = false;
			}
		} catch (e) {
			errorlog(e);
		}
		try {
			if (session.rpcs[UUID] && typeof session.rpcs[UUID].__whepPrevSmallScreen !== "undefined") {
				session.rpcs[UUID].smallScreen = session.rpcs[UUID].__whepPrevSmallScreen;
				delete session.rpcs[UUID].__whepPrevSmallScreen;
				delete session.rpcs[UUID].__whepAutoSmallScreen;
			}
		} catch (e) {
			errorlog(e);
		}
		try {
			if (screenRPC.whep && screenRPC.whep.close) {
				screenRPC.whep.close();
			}
		} catch (e) {
			warnlog(e);
		}
		screenRPC.whep = null;
		updateWhepDirectorControls(UUID);
	} catch (e) {
		errorlog(e);
	}
}

async function meshcastWatch(UUID, settings) {
	console.log("meshcastWatch called - this meshcast version is deprecated in favour of WHEP.");
	if (!(UUID in session.rpcs)) {
		session.rpcs[UUID] = {};
		session.rpcs[UUID].stats = {};
		session.rpcs[UUID].allowGraphs = false;
		session.rpcs[UUID].allowDrawing = false;
		session.rpcs[UUID].inboundAudioPipeline = {};
		session.rpcs[UUID].channelOffset = false;
		session.rpcs[UUID].channelWidth = false;
		session.rpcs[UUID].settings = false;
		session.rpcs[UUID].activelySpeaking = false; // default to off.
		session.rpcs[UUID].defaultSpeaker = false;
		session.rpcs[UUID].mirrorState = null;
		session.rpcs[UUID].flipState = null;
		session.rpcs[UUID].motionDetectionInterval = false;
		session.rpcs[UUID].lockedVideoBitrate = false; // doesn't do anything
		session.rpcs[UUID].lockedAudioBitrate = false;
		session.rpcs[UUID].buffer = false;
		session.rpcs[UUID].manualBandwidth = false; // doesn't do anything, except maybe help keep track of pause/play states
		session.rpcs[UUID].getStatsTimeout = null;
		session.rpcs[UUID].smallScreen = false;
		session.rpcs[UUID].pseudoguest = false;
		errorlog("RPCS for MESHCAST ISNT MADE YET??");
	}

	var video = true;
	var audio = true;

	if (session.novideo !== false && !session.novideo.includes(session.rpcs[UUID].streamID)) {
		video = false;
	} else if (session.rpcs[UUID].settings && !session.rpcs[UUID].settings.video) {
		video = false;
	}
	if (session.noaudio !== false && !session.noaudio.includes(session.rpcs[UUID].streamID)) {
		audio = false;
	} else if (session.excludeaudio && session.excludeaudio.includes(session.rpcs[UUID].streamID)) {
		audio = false;
	} else if (session.rpcs[UUID].settings && !session.rpcs[UUID].settings.audio) {
		audio = false;
	}

	if (!audio && !video) {
		errorlog("We will not request the meshcast as no audio or video is requested");
		return;
	}

	disableQualityDirector(UUID);

	if (!session.configuration) {
		await chooseBestTURN();
	}

	var config = { ...session.configuration };

	if (config.bundlePolicy) {
		delete config["bundlePolicy"]; // meshcast isn't w/e
	}
	if (config.encodedInsertableStreams) {
		delete config["encodedInsertableStreams"]; // not supported
	}

	if (session.encodedInsertableStreams) {
		console.error("Notice: Meshcast does not support Insertable Streams (or E2EE) at the moment");
		// session.configuration.encodedInsertableStreams = true;
	}

	try {
		session.rpcs[UUID].whep = new RTCPeerConnection(config);
		session.attachIceCandidateErrorTracker(session.rpcs[UUID].whep, "whep", UUID);
	} catch (err) {
		if (!session.cleanOutput) {
			warnUser("An RTC error occurred");
		}
	}
	//var candidates = [];

	session.rpcs[UUID].whep.ontrack = function (event) {
		session.onTrack(event, UUID);

		let track = null;
		if (event.streams && event.streams[0]) {
			try {
				let newStream = event.streams[0];
				track = newStream.getVideoTracks()[0];
			} catch (e) { }
		} else if (event.track && event.track.kind && (event.track.kind == "video")) {
			track = event.track
		}
		if (track) {
			log(track);
			setTimeout(function (track, UUID) {
				if (session.rpcs[UUID] && track && track.id) {
					if (session.rpcs[UUID].stats && session.rpcs[UUID].stats[track.id] && ("keyFramesRequested_pli" in session.rpcs[UUID].stats[track.id])) {

						// log("I need to request a keyframe. keyFramesRequested_pli: "+session.rpcs[UUID].stats[track.id].keyFramesRequested_pli);
					}
				}
			}, 6100, track, UUID); // 3 seconds for stats to update + 2 second for keyframe to trigger + 1100 for delay
		}

	};

	//session.rpcs[UUID].whep.onicecandidate = function(event){ //event
	//	if (event.candidate==null){return;}
	//	candidates.push(event.candidate);
	//};

	var accessToken = session.generateStreamID(14);

	var data = {};
	data.streamID = settings.token;
	data.UUID = accessToken;

	function ajax(data) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
				var contentType = this.getResponseHeader("content-type");
				if (contentType == "application/sdp") {
					var jsep = {};
					jsep.sdp = this.responseText;
					jsep.type = "offer";
					//log(jsep);

					if (session.localNetworkOnly) {
						jsep.sdp = filterSDPLAN(jsep.sdp);
					}
					if (session.stunOnly) { // or whatever flag you want to use
						jsep.sdp = filterStunOnly(jsep.sdp);
					}
					session.rpcs[UUID].whep
						.setRemoteDescription(jsep)
						.then(function () {
							respond();
						})
						.catch(function (e) {
							log(e);
						});
				}
			} else {
				log(this);
			}
		};
		xhttp.open("POST", settings.url, true);
		xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhttp.setRequestHeader("Authorization", "Bearer " + accessToken);
		xhttp.send(JSON.stringify(data));
	}
	function respond() {
		session.rpcs[UUID].whep
			.createAnswer()
			.then(function (answer) {
				answer.sdp = CodecsHandler.setOpusAttributes(answer.sdp, { stereo: 1 });
				//log(answer);
				return session.rpcs[UUID].whep.setLocalDescription(answer);
			})
			.then(function () {
				//log(session.pc.localDescription);
				var data = {};
				data.UUID = accessToken;
				var filteredDesc = filterDescriptionIpv6(session.rpcs[UUID].whep.localDescription);
				data.answer = filteredDesc.sdp;
				ajax(data);
			})
			.catch(function (err) { });
	}
	ajax(data);
}

///////////////// CHUNKED TRANSFER -- WEBCODEC VERSION

(function () {
	"use strict";

	let ArrayBufferDataStream = function (length) {
		this.data = new Uint8Array(length);
		this.pos = 0;
	};

	ArrayBufferDataStream.prototype.seek = function (toOffset) {
		this.pos = toOffset;
	};

	ArrayBufferDataStream.prototype.writeBytes = function (arr) {
		for (let i = 0; i < arr.length; i++) {
			this.data[this.pos++] = arr[i];
		}
	};

	ArrayBufferDataStream.prototype.writeByte = function (b) {
		this.data[this.pos++] = b;
	};

	ArrayBufferDataStream.prototype.writeU8 = ArrayBufferDataStream.prototype.writeByte;

	ArrayBufferDataStream.prototype.writeU16BE = function (u) {
		this.data[this.pos++] = u >> 8;
		this.data[this.pos++] = u;
	};

	ArrayBufferDataStream.prototype.writeDoubleBE = function (d) {
		let bytes = new Uint8Array(new Float64Array([d]).buffer);
		for (let i = bytes.length - 1; i >= 0; i--) {
			this.writeByte(bytes[i]);
		}
	};

	ArrayBufferDataStream.prototype.writeFloatBE = function (d) {
		let bytes = new Uint8Array(new Float32Array([d]).buffer);
		for (let i = bytes.length - 1; i >= 0; i--) {
			this.writeByte(bytes[i]);
		}
	};

	ArrayBufferDataStream.prototype.writeString = function (s) {
		for (let i = 0; i < s.length; i++) {
			this.data[this.pos++] = s.charCodeAt(i);
		}
	};

	ArrayBufferDataStream.prototype.writeEBMLVarIntWidth = function (i, width) {
		switch (width) {
			case 1:
				this.writeU8((1 << 7) | i);
				break;
			case 2:
				this.writeU8((1 << 6) | (i >> 8));
				this.writeU8(i);
				break;
			case 3:
				this.writeU8((1 << 5) | (i >> 16));
				this.writeU8(i >> 8);
				this.writeU8(i);
				break;
			case 4:
				this.writeU8((1 << 4) | (i >> 24));
				this.writeU8(i >> 16);
				this.writeU8(i >> 8);
				this.writeU8(i);
				break;
			case 5:
				this.writeU8((1 << 3) | ((i / 4294967296) & 0x7));
				this.writeU8(i >> 24);
				this.writeU8(i >> 16);
				this.writeU8(i >> 8);
				this.writeU8(i);
				break;
			default:
				throw new Error("Bad EBML VINT size " + width);
		}
	};
	ArrayBufferDataStream.prototype.measureEBMLVarInt = function (val) {
		if (val < (1 << 7) - 1) {
			return 1;
		} else if (val < (1 << 14) - 1) {
			return 2;
		} else if (val < (1 << 21) - 1) {
			return 3;
		} else if (val < (1 << 28) - 1) {
			return 4;
		} else if (val < 34359738367) {
			// 2 ^ 35 - 1 (can address 32GB)
			return 5;
		} else {
			throw new Error("EBML VINT size not supported " + val);
		}
	};

	ArrayBufferDataStream.prototype.writeEBMLVarInt = function (i) {
		this.writeEBMLVarIntWidth(i, this.measureEBMLVarInt(i));
	};

	ArrayBufferDataStream.prototype.writeUnsignedIntBE = function (u, width) {
		if (width === undefined) {
			width = this.measureUnsignedInt(u);
		}

		switch (width) {
			case 5:
				this.writeU8(Math.floor(u / 4294967296)); // Need to use division to access >32
			// bits of floating point var
			case 4:
				this.writeU8(u >> 24);
			case 3:
				this.writeU8(u >> 16);
			case 2:
				this.writeU8(u >> 8);
			case 1:
				this.writeU8(u);
				break;
			default:
				throw new Error("Bad UINT size " + width);
		}
	};

	ArrayBufferDataStream.prototype.measureUnsignedInt = function (val) {
		if (val < 1 << 8) {
			return 1;
		} else if (val < 1 << 16) {
			return 2;
		} else if (val < 1 << 24) {
			return 3;
		} else if (val < 4294967296) {
			return 4;
		} else {
			return 5;
		}
	};

	ArrayBufferDataStream.prototype.getAsDataArray = function () {
		if (this.pos < this.data.byteLength) {
			return this.data.subarray(0, this.pos);
		} else if (this.pos == this.data.byteLength) {
			return this.data;
		} else {
			throw new Error("ArrayBufferDataStream's pos lies beyond end of buffer");
		}
	};

	window.ArrayBufferDataStream = ArrayBufferDataStream;
})();

(function () {
	"use strict";
	let BlobBuffer = function (fs) {
		return function (destination) {
			let buffer = [],
				writePromise = Promise.resolve(),
				fileWriter = null,
				fd = null;

			if (destination && destination.constructor.name === "FileSystemWritableFileStream") {
				fileWriter = destination;
			} else if (fs && destination) {
				fd = destination;
			}

			this.pos = 0;

			this.length = 0;

			function readBlobAsBuffer(blob) {
				return new Promise(function (resolve, reject) {
					let reader = new FileReader();

					reader.addEventListener("loadend", function () {
						resolve(reader.result);
					});

					reader.readAsArrayBuffer(blob);
				});
			}

			function convertToUint8Array(thing) {
				return new Promise(function (resolve, reject) {
					if (thing instanceof Uint8Array) {
						resolve(thing);
					} else if (thing instanceof ArrayBuffer || ArrayBuffer.isView(thing)) {
						resolve(new Uint8Array(thing));
					} else if (thing instanceof Blob) {
						resolve(
							readBlobAsBuffer(thing).then(function (buffer) {
								return new Uint8Array(buffer);
							})
						);
					} else {
						resolve(
							readBlobAsBuffer(new Blob([thing])).then(function (buffer) {
								return new Uint8Array(buffer);
							})
						);
					}
				});
			}

			function measureData(data) {
				let result = data.byteLength || data.length || data.size;

				if (!Number.isInteger(result)) {
					throw new Error("Failed to determine size of element");
				}

				return result;
			}

			this.seek = function (offset) {
				if (offset < 0) {
					throw new Error("Offset may not be negative");
				}

				if (isNaN(offset)) {
					throw new Error("Offset may not be NaN");
				}

				if (offset > this.length) {
					throw new Error("Seeking beyond the end of file is not allowed");
				}

				this.pos = offset;
			};

			this.write = function (data) {
				let newEntry = {
					offset: this.pos,
					data: data,
					length: measureData(data)
				},
					isAppend = newEntry.offset >= this.length;

				this.pos += newEntry.length;
				this.length = Math.max(this.length, this.pos);

				writePromise = writePromise.then(async function () {
					if (fd) {
						return new Promise(function (resolve, reject) {
							convertToUint8Array(newEntry.data).then(function (dataArray) {
								let totalWritten = 0,
									buffer = Buffer.from(dataArray.buffer),
									handleWriteComplete = function (err, written, buffer) {
										totalWritten += written;

										if (totalWritten >= buffer.length) {
											resolve();
										} else {
											fs.write(fd, buffer, totalWritten, buffer.length - totalWritten, newEntry.offset + totalWritten, handleWriteComplete);
										}
									};

								fs.write(fd, buffer, 0, buffer.length, newEntry.offset, handleWriteComplete);
							});
						});
					} else if (fileWriter) {
						return fileWriter.seek(newEntry.offset).then(function () {
							return fileWriter.write(new Blob([newEntry.data]));
						});
					} else if (!isAppend) {
						for (let i = 0; i < buffer.length; i++) {
							let entry = buffer[i];
							if (!(newEntry.offset + newEntry.length <= entry.offset || newEntry.offset >= entry.offset + entry.length)) {
								if (newEntry.offset < entry.offset || newEntry.offset + newEntry.length > entry.offset + entry.length) {
									throw new Error("Overwrite crosses blob boundaries");
								}

								if (newEntry.offset == entry.offset && newEntry.length == entry.length) {
									entry.data = newEntry.data;
									return;
								} else {
									return convertToUint8Array(entry.data)
										.then(function (entryArray) {
											entry.data = entryArray;
											return convertToUint8Array(newEntry.data);
										})
										.then(function (newEntryArray) {
											newEntry.data = newEntryArray;
											entry.data.set(newEntry.data, newEntry.offset - entry.offset);
										});
								}
							}
						}
					}
					buffer.push(newEntry);
				});
			};

			this.complete = function (mimeType) {
				if (fd || fileWriter) {
					writePromise = writePromise.then(function () {
						return null;
					});
				} else {
					writePromise = writePromise.then(function () {
						let result = [];
						for (let i = 0; i < buffer.length; i++) {
							result.push(buffer[i].data);
						}
						return new Blob(result, {
							type: mimeType
						});
					});
				}

				return writePromise;
			};
		};
	};
	window.BlobBuffer = BlobBuffer(null);
})();

(function () {
	"use strict";

	function EBMLFloatX(value) {
		this.value = value;
	}

	function extend(base, top) {
		let target = {};

		[base, top].forEach(function (obj) {
			for (let prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					target[prop] = obj[prop];
				}
			}
		});
		return target;
	}

	function writeEBML(buffer, bufferFileOffset, ebml) {
		if (Array.isArray(ebml)) {
			for (let i = 0; i < ebml.length; i++) {
				writeEBML(buffer, bufferFileOffset, ebml[i]);
			}
		} else if (typeof ebml === "string") {
			buffer.writeString(ebml);
		} else if (ebml instanceof Uint8Array) {
			buffer.writeBytes(ebml);
		} else if (ebml.id) {
			ebml.offset = buffer.pos + bufferFileOffset;
			buffer.writeUnsignedIntBE(ebml.id);

			if (Array.isArray(ebml.data)) {
				let sizePos, dataBegin, dataEnd;

				if (ebml.size === -1) {
					buffer.writeByte(0xff);
				} else {
					sizePos = buffer.pos;

					buffer.writeBytes([0, 0, 0, 0]);
				}

				dataBegin = buffer.pos;

				ebml.dataOffset = dataBegin + bufferFileOffset;
				writeEBML(buffer, bufferFileOffset, ebml.data);

				if (ebml.size !== -1) {
					dataEnd = buffer.pos;
					ebml.size = dataEnd - dataBegin;
					buffer.seek(sizePos);
					buffer.writeEBMLVarIntWidth(ebml.size, 4); // Size field
					buffer.seek(dataEnd);
				}
			} else if (typeof ebml.data === "string") {
				buffer.writeEBMLVarInt(ebml.data.length); // Size field
				ebml.dataOffset = buffer.pos + bufferFileOffset;
				buffer.writeString(ebml.data);
			} else if (typeof ebml.data === "number") {
				if (!ebml.size) {
					ebml.size = buffer.measureUnsignedInt(ebml.data);
				}
				buffer.writeEBMLVarInt(ebml.size); // Size field
				ebml.dataOffset = buffer.pos + bufferFileOffset;
				buffer.writeUnsignedIntBE(ebml.data, ebml.size);
			} else if (ebml.data instanceof EBMLFloatX) {
				buffer.writeEBMLVarInt(8); // Size field
				ebml.dataOffset = buffer.pos + bufferFileOffset;
				buffer.writeDoubleBE(ebml.data.value);
			} else if (ebml.data instanceof Uint8Array) {
				buffer.writeEBMLVarInt(ebml.data.byteLength); // Size field
				ebml.dataOffset = buffer.pos + bufferFileOffset;
				buffer.writeBytes(ebml.data);
			} else {
				throw new Error("Bad EBML datatype " + typeof ebml.data);
			}
		} else {
			throw new Error("Bad EBML datatype " + typeof ebml.data);
		}
	}

	let WebMWriter = function (ArrayBufferDataStream, BlobBuffer) {
		return function (options) {
			let MAX_CLUSTER_DURATION_MSEC = 5000;

			let writtenHeader = false;
			let videoWidth = 0;
			let videoHeight = 0;

			let firstTimestampEver = true;
			let earliestTimestamp = 0;
			let samplingFrequency = 48000;
			let channels = 1;

			let clusterFrameBuffer = [];
			let clusterStartTime = 0;
			let clusterDuration = 0;
			let lastTimeCode = 0;

			let optionDefaults = {
				fileWriter: null, // Chrome FileWriter in order to stream to a file
				codec: options.codec || "VP9" // Codec to write to webm file
			},
				ebmlSegment, // Root element of the EBML document
				segmentDuration = {
					id: 0x4489, // Duration
					data: new EBMLFloatX(0)
				},
				blobBuffer = new BlobBuffer(options.fileWriter);

			function MakeElement(id, data) {
				data = new Uint8Array(data);
				return Concat(EncodeID(id), EncodeLength(data.byteLength), data);
			}

			function Concat() {
				var i,
					l = 0,
					a;
				for (i = 0; i < arguments.length; i++) l += arguments[i].byteLength;
				a = new Uint8Array(l);
				for (i = 0, l = 0; i < arguments.length; l += arguments[i].byteLength, i++) a.set(arguments[i], l);
				return a;
			}

			function EncodeID(id) {
				if ((id & 0xff000000) != 0) return new Uint8Array([(id >>> 24) & 0xff, (id >>> 16) & 0xff, (id >>> 8) & 0xff, id & 0xff]);
				if ((id & 0xff0000) != 0) return new Uint8Array([(id >>> 16) & 0xff, (id >>> 8) & 0xff, id & 0xff]);
				if ((id & 0xff00) != 0) return new Uint8Array([(id >>> 8) & 0xff, id & 0xff]);
				if ((id & 0xff) != 0) return new Uint8Array([id & 0xff]);
				throw "InvalidOperationException";
			}

			function EncodeLength(value) {
				if (value <= 0x7f) return new Uint8Array([0x80 | (value & 0x7f)]);
				if (value <= 0x3fff) return new Uint8Array([0x40 | ((value >> 8) & 0x3f), value & 0xff]);
				return new Uint8Array([0x08, (value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]);
			}

			function MakeFloat(id, value) {
				var b = new DataView(new ArrayBuffer(4));
				b.setFloat32(0, value, false);
				return MakeElement(id, new Uint8Array(b.buffer));
			}

			function EncodeUInt(value) {
				if (value <= 0xff) return new Uint8Array([value & 0xff]);
				if (value <= 0xffff) return new Uint8Array([(value >>> 8) & 0xff, value & 0xff]);
				if (value <= 0xffffff) return new Uint8Array([(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]);
				return new Uint8Array([(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]);

				var b = new DataView(new ArrayBuffer(4));
				b.setUint32(0, value, false);
				return b;
			}

			function MakeUInt(id, value) {
				return MakeElement(id, EncodeUInt(value));
			}

			function MakeUnicode(id, value) {
				return MakeElement(id, new TextEncoder().encode(value));
			}

			function writeHeader() {
				let ebmlHeader = {
					id: 0x1a45dfa3, // EBML
					data: [
						MakeUInt(0x4286, 1), //EBMLVersion
						MakeUInt(0x42f7, 1), //EBMLReadVersion
						MakeUInt(0x42f2, 4), //EBMLMaxIDLength
						MakeUInt(0x42f3, 8), //EBMLMaxSizeLength
						MakeUnicode(0x4282, "webm"), //DocType
						MakeUInt(0x4287, 4), //DocTypeVersion
						MakeUInt(0x4285, 2) //DocTypeReadVersion
					]
				};

				let segmentInfo = {
					id: 0x1549a966, // Info
					data: [
						MakeUInt(0x2ad7b1, 1000000), //TimestampScale = 1000000000/1000000=1ms
						MakeUnicode(0x4d80, "VDO-Ninja"), //MuxingApp
						MakeUnicode(0x5741, "VDO-Ninja"), //WritingApp
						segmentDuration // To be filled in later
					]
				};

				let videoProperties = [
					{
						id: 0xb0, // PixelWidth
						data: videoWidth
					},
					{
						id: 0xba, // PixelHeight
						data: videoHeight
					}
				];

				let tracks = {
					id: 0x1654ae6b, // Tracks
					data: [
						{
							id: 0xae, // TrackEntry
							data: [
								MakeUInt(0xd7, 1), //TrackNumber
								MakeUInt(0x73c5, 1), //TrackUID
								MakeUInt(0x9c, 0), //FlagLacing
								MakeUnicode(0x22b59c, "und"), //Language
								MakeUnicode(0x86, "V_" + options.codec), //CodecID
								MakeUInt(0x83, 1), //TrackType
								{
									id: 0xe0, // Video
									data: [MakeUInt(0xb0, videoWidth), MakeUInt(0xba, videoHeight)]
								}
							]
						},
						{
							id: 0xae, // TrackEntry
							data: [
								MakeUInt(0xd7, 2), //TrackNumber
								MakeUInt(0x73c5, 2), //TrackUID
								MakeUInt(0x9c, 0), //FlagLacing
								MakeUnicode(0x22b59c, "und"), //Language
								MakeUnicode(0x86, "A_OPUS"), //CodecID
								MakeUInt(0x83, 2), //TrackType
								{
									id: 0xe1, // Audio
									data: [MakeFloat(0xb5, samplingFrequency), MakeUInt(0x9f, channels)]
								},
								MakeElement(
									0x63a2, //CodecPrivate
									new Uint8Array(["O".charCodeAt(0), "p".charCodeAt(0), "u".charCodeAt(0), "s".charCodeAt(0), "H".charCodeAt(0), "e".charCodeAt(0), "a".charCodeAt(0), "d".charCodeAt(0), 1, channels & 0xff, 0x38, 0x01, (samplingFrequency >>> 0) & 0xff, (samplingFrequency >>> 8) & 0xff, (samplingFrequency >>> 16) & 0xff, (samplingFrequency >>> 24) & 0xff, 0, 0, 0])
								)
							]
						}
					]
				};

				if (options.video === false) {
					tracks.data.shift(); // Keep the existing audio track number for audio-only files.
				}

				ebmlSegment = {
					id: 0x18538067, // Segment
					size: -1, // Unbounded size
					data: [segmentInfo, tracks]
				};

				let bufferStream = new ArrayBufferDataStream(512);
				writeEBML(bufferStream, blobBuffer.pos, [ebmlHeader, ebmlSegment]);
				blobBuffer.write(bufferStream.getAsDataArray());
				writtenHeader = true;
			}

			function createSimpleBlockForframe(frame) {
				let bufferStream = new ArrayBufferDataStream(1 + 2 + 1);

				if (!(frame.trackNumber > 0 && frame.trackNumber < 127)) {
					throw new Error("TrackNumber must be > 0 and < 127");
				}

				bufferStream.writeEBMLVarInt(frame.trackNumber); // Always 1 byte since we limit the range of trackNumber
				bufferStream.writeU16BE(frame.timecode);
				bufferStream.writeByte(
					(frame.type == "key" ? 1 : 0) << 7 // frame
				);

				return {
					id: 0xa3, // SimpleBlock
					data: [bufferStream.getAsDataArray(), frame.frame]
				};
			}

			function createCluster(cluster) {
				return {
					id: 0x1f43b675,
					data: [
						{
							id: 0xe7, // Timecode
							data: Math.round(cluster.timecode)
						}
					]
				};
			}

			function flushClusterFrameBuffer() {
				if (clusterFrameBuffer.length === 0) {
					return;
				}

				let rawImageSize = 0;

				for (let i = 0; i < clusterFrameBuffer.length; i++) {
					rawImageSize += clusterFrameBuffer[i].frame.byteLength;
				}

				let buffer = new ArrayBufferDataStream(rawImageSize + clusterFrameBuffer.length * 64); // Estimate 64 bytes per block header
				let cluster = createCluster({
					timecode: Math.round(clusterStartTime)
				});

				for (let i = 0; i < clusterFrameBuffer.length; i++) {
					cluster.data.push(createSimpleBlockForframe(clusterFrameBuffer[i]));
				}

				writeEBML(buffer, blobBuffer.pos, cluster);
				blobBuffer.write(buffer.getAsDataArray());

				clusterFrameBuffer = [];
				clusterDuration = 0;
			}

			function addFrameToCluster(frame, TRACK_NUMBER) {
				frame.trackNumber = TRACK_NUMBER;
				var time = frame.intime / 1000;
				if (firstTimestampEver) {
					earliestTimestamp = time;
					time = 0;
					firstTimestampEver = false;
				} else {
					time = time - earliestTimestamp;
				}
				lastTimeCode = time;
				if (clusterDuration == 0) clusterStartTime = time;

				frame.timecode = Math.round(time - clusterStartTime);

				clusterFrameBuffer.push(frame);
				clusterDuration = frame.timecode + 1;

				if (clusterDuration >= MAX_CLUSTER_DURATION_MSEC) {
					flushClusterFrameBuffer();
				}
			}

			function rewriteSeekHead() {
				let seekHeadBuffer = new ArrayBufferDataStream(seekHead.size),
					oldPos = blobBuffer.pos;

				writeEBML(seekHeadBuffer, seekHead.dataOffset, seekHead.data);

				blobBuffer.seek(seekHead.dataOffset);
				blobBuffer.write(seekHeadBuffer.getAsDataArray());
				blobBuffer.seek(oldPos);
			}

			function rewriteDuration() {
				let buffer = new ArrayBufferDataStream(8),
					oldPos = blobBuffer.pos;

				buffer.writeDoubleBE(lastTimeCode);
				blobBuffer.seek(segmentDuration.dataOffset);
				blobBuffer.write(buffer.getAsDataArray());

				blobBuffer.seek(oldPos);
			}

			this.addFrame = function (frame) {
				if (!writtenHeader) {
					videoWidth = options.width;
					videoHeight = options.height;
					samplingFrequency = options.samplingFrequency;
					channels = options.channels;
					writeHeader();
				}
				if (frame.constructor.name == "EncodedVideoChunk") {
					// track 1
					let frameData = new Uint8Array(frame.byteLength);
					frame.copyTo(frameData);
					addFrameToCluster(
						{
							frame: frameData,
							intime: frame.timestamp,
							type: frame.type
						},
						1
					);
					return;
				} else if (frame.constructor.name == "EncodedAudioChunk") {
					// track 2
					let frameData = new Uint8Array(frame.byteLength);
					frame.copyTo(frameData);
					addFrameToCluster(
						{
							frame: frameData,
							intime: frame.timestamp,
							type: frame.type
						},
						2
					);
					return;
				}
			};

			this.complete = function () {
				if (!writtenHeader) {
					writeHeader();
				}
				firstTimestampEver = true;
				flushClusterFrameBuffer();
				rewriteDuration();
				if (options.video === false) {
					return blobBuffer.complete("audio/webm");
				}
				return blobBuffer.complete("video/webm");
			};

			this.getWrittenSize = function () {
				return blobBuffer.length;
			};

			options = extend(optionDefaults, options || {});
		};
	};
	window.WebMWriter = WebMWriter(window.ArrayBufferDataStream, window.BlobBuffer);
})();

/////////////////////
