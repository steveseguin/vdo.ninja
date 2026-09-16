(function (root) {
	"use strict";

	var SUPPORTED_LANGUAGES = {
		en: "English",
		es: "Spanish",
		pt: "Portuguese",
		fr: "French",
		ja: "Japanese",
		ru: "Russian",
		zh: "Chinese",
		de: "German",
		ko: "Korean",
		hi: "Hindi",
		id: "Indonesian",
		vi: "Vietnamese",
		it: "Italian"
	};
	var KEY_STORAGE = "vdo_translation_openai_key";
	var BROKER_URL_STORAGE = "vdo_translation_broker_url";
	var BROKER_TOKEN_STORAGE = "vdo_translation_broker_credential";
	var LANGUAGE_STORAGE = "vdo_translation_language";
	var PROVIDER_STORAGE = "vdo_translation_provider";
	var AUDIO_MODE_STORAGE = "vdo_translation_audio_mode";
	var RETRY_BASE_MS = 2000;
	var RETRY_MAX_MS = 30000;
	var RETRY_MAX_ATTEMPTS = 5;
	var RETRY_JITTER = 0.2;
	var RETRY_STABLE_MS = 60000;
	var activeController = false;

	function normalizeLanguage(value) {
		value = (value || "").toString().trim().replace(/_/g, "-");
		if (!value) {
			return "";
		}
		var parts = value.split("-");
		parts[0] = parts[0].toLowerCase();
		for (var i = 1; i < parts.length; i++) {
			if (parts[i].length === 2) {
				parts[i] = parts[i].toUpperCase();
			} else {
				parts[i] = parts[i].toLowerCase();
			}
		}
		return parts.join("-");
	}

	function resolveLanguage(value) {
		if (value && value.toString().toLowerCase() !== "auto") {
			return normalizeLanguage(value);
		}
		var detected = "en";
		try {
			detected = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || "en";
		} catch (e) {}
		return normalizeLanguage(detected);
	}

	function providerLanguage(value) {
		var normalized = normalizeLanguage(value);
		var base = normalized.split("-")[0];
		return Object.prototype.hasOwnProperty.call(SUPPORTED_LANGUAGES, base) ? base : false;
	}

	function languagesMatch(first, second) {
		var firstBase = providerLanguage(first);
		var secondBase = providerLanguage(second);
		return !!firstBase && firstBase === secondBase;
	}

	function hasProperties(object) {
		for (var key in object) {
			if (Object.prototype.hasOwnProperty.call(object, key)) {
				return true;
			}
		}
		return false;
	}

	function takeStoredCredential(key) {
		try {
			var oneTimeValue = sessionStorage.getItem(key) || "";
			if (oneTimeValue) {
				sessionStorage.removeItem(key);
				return oneTimeValue;
			}
			return localStorage.getItem(key) || "";
		} catch (e) {
			return "";
		}
	}

	function readStoredValue(key) {
		try {
			return localStorage.getItem(key) || "";
		} catch (e) {
			return "";
		}
	}

	function takeStoredBrokerToken(brokerURL) {
		if (!brokerURL) {
			return "";
		}
		for (var i = 0; i < 2; i++) {
			try {
				var storage = i === 0 ? sessionStorage : localStorage;
				var credential = JSON.parse(storage.getItem(BROKER_TOKEN_STORAGE) || "null");
				// Keep the endpoint and token together, including one-time tokens in other tabs.
				if (!credential || typeof credential.token !== "string" || !credential.token || new URL(credential.url).href !== new URL(brokerURL).href) {
					continue;
				}
				if (i === 0) {
					storage.removeItem(BROKER_TOKEN_STORAGE);
				}
				return credential.token;
			} catch (e) {}
		}
		return "";
	}

	function nonRetryableError(message) {
		var error = new Error(message);
		error.retryable = false;
		return error;
	}

	function Controller(config) {
		this.config = config;
		this.owner = !!config.owner;
		this.providerName = config.provider || "openai";
		this.languageSetting = config.languageSetting || "auto";
		this.language = resolveLanguage(config.language || this.languageSetting);
		this.audioMode = config.audioMode || "replace";
		this.provider = false;
		this.providerPromise = false;
		this.apiKey = this.owner ? takeStoredCredential(KEY_STORAGE) : "";
		this.brokerURL = config.brokerURL || readStoredValue(BROKER_URL_STORAGE);
		this.brokerToken = this.owner ? takeStoredBrokerToken(this.brokerURL) : "";
		this.outboundByLanguage = {};
		this.inboundByPeer = {};
		this.retryStates = { outbound: {}, inbound: {} };
		this.peerLanguages = {};
		this.remoteLanguages = {};
		this.stopped = false;
		this.warnedMissingKey = false;
		this.status = "";
	}

	Controller.prototype.setStatus = function (message, warn) {
		this.status = message || "";
		var status = document.getElementById("translationStatus");
		if (status) {
			status.textContent = this.status;
		}
		if (warn && typeof warnUser === "function") {
			warnUser(this.status, 5000);
		}
	};

	Controller.prototype.updateSettingsUI = function () {
		var container = document.getElementById("translationSettingsContainer");
		if (container) {
			container.classList.remove("hidden");
		}
		var configureButton = document.getElementById("translationConfigureButton");
		if (configureButton) {
			configureButton.style.display = this.owner ? "" : "none";
		}
		var select = document.getElementById("translationLanguageSelect");
		if (select) {
			var desired = this.languageSetting || "auto";
			var found = false;
			for (var i = 0; i < select.options.length; i++) {
				if (select.options[i].value === desired) {
					found = true;
					break;
				}
			}
			if (!found) {
				desired = providerLanguage(desired) || "auto";
			}
			select.value = desired;
		}
	};

	Controller.prototype.ensureProvider = function () {
		var self = this;
		if (!this.owner || this.stopped) {
			return Promise.reject(new Error("Translation is not active in this browser."));
		}
		if (this.provider) {
			return Promise.resolve(this.provider);
		}
		if (this.providerPromise) {
			return this.providerPromise;
		}
		if (this.providerName !== "openai") {
			return Promise.reject(nonRetryableError("Translation provider is not available: " + this.providerName));
		}
		if (this.brokerURL && !this.brokerToken) {
			this.setStatus("Translation needs the broker access token. Open Configure to add it.", !this.warnedMissingKey);
			this.warnedMissingKey = true;
			return Promise.reject(nonRetryableError("No translation broker access token is configured."));
		}
		if (!this.brokerURL && !this.apiKey) {
			this.setStatus("Translation needs an API key. Open Configure to add one.", !this.warnedMissingKey);
			this.warnedMissingKey = true;
			return Promise.reject(nonRetryableError("No translation API key is configured."));
		}
		this.providerPromise = loadScript("./translation/providers/openai.js?v=3")
			.then(function () {
				if (!root.VDOTranslationProviders || !root.VDOTranslationProviders.openai) {
					throw new Error("OpenAI translation provider did not load.");
				}
				self.provider = root.VDOTranslationProviders.openai;
				return self.provider;
			})
			.catch(function (error) {
				self.providerPromise = false;
				throw error;
			});
		return this.providerPromise;
	};

	Controller.prototype.findLocalAudioTrack = function () {
		try {
			var stream = session.getLocalStream ? session.getLocalStream() : false;
			var tracks = stream && stream.getAudioTracks ? stream.getAudioTracks() : [];
			for (var i = 0; i < tracks.length; i++) {
				if (tracks[i].readyState !== "ended") {
					return tracks[i];
				}
			}
		} catch (e) {
			errorlog(e);
		}
		return false;
	};

	Controller.prototype.createCombinedTrack = function (item, originalTrack, translatedTrack, stableOutput) {
		if (this.audioMode === "replace" && !stableOutput) {
			return translatedTrack;
		}
		var AudioContextClass = root.AudioContext || root.webkitAudioContext;
		if (!AudioContextClass) {
			return translatedTrack;
		}
		try {
			var context = session.audioCtx || new AudioContextClass();
			if (!session.audioCtx) {
				item.ownedAudioContext = context;
			}
			var destination = context.createMediaStreamDestination();
			var translatedSource = context.createMediaStreamSource(new MediaStream([translatedTrack]));
			var translatedGain = context.createGain();
			translatedGain.gain.value = 1;
			translatedSource.connect(translatedGain);
			translatedGain.connect(destination);

			var originalSource = context.createMediaStreamSource(new MediaStream([originalTrack]));
			var originalGain = context.createGain();
			originalGain.gain.value = this.audioMode === "replace" ? 0 : this.audioMode === "duck" ? 0.15 : 1;
			originalSource.connect(originalGain);
			originalGain.connect(destination);
			item.originalGain = originalGain;
			item.translatedSource = translatedSource;
			item.translatedGain = translatedGain;
			item.nodes = [translatedSource, translatedGain, originalSource, originalGain, destination];
			try {
				if (context.state === "suspended") {
					context.resume().catch(function () {});
				}
			} catch (e) {}
			item.mixedTrack = destination.stream.getAudioTracks()[0] || false;
			return item.mixedTrack || translatedTrack;
		} catch (e) {
			errorlog(e);
			return translatedTrack;
		}
	};

	Controller.prototype.cleanupCombinedTrack = function (item) {
		if (!item) {
			return;
		}
		if (item.playbackTimer) {
			clearTimeout(item.playbackTimer);
			item.playbackTimer = false;
		}
		for (var i = 0; i < (item.nodes || []).length; i++) {
			try {
				if (item.nodes[i].disconnect) {
					item.nodes[i].disconnect();
				}
			} catch (e) {}
		}
		if (item.mixedTrack) {
			try {
				item.mixedTrack.stop();
			} catch (e) {}
		}
		if (item.ownedAudioContext && item.ownedAudioContext.close) {
			try {
				item.ownedAudioContext.close();
			} catch (e) {}
		}
	};

	Controller.prototype.clearTranslationRetry = function (direction, id) {
		var bucket = this.retryStates[direction];
		var state = bucket && bucket[id];
		if (!state) {
			return;
		}
		if (state.timer) {
			clearTimeout(state.timer);
		}
		if (state.stableTimer) {
			clearTimeout(state.stableTimer);
		}
		delete bucket[id];
	};

	Controller.prototype.clearAllTranslationRetries = function (direction) {
		var directions = direction ? [direction] : ["outbound", "inbound"];
		for (var directionIndex = 0; directionIndex < directions.length; directionIndex++) {
			var currentDirection = directions[directionIndex];
			var bucket = this.retryStates[currentDirection];
			for (var id in bucket) {
				this.clearTranslationRetry(currentDirection, id);
			}
		}
	};

	Controller.prototype.markTranslationRetryStable = function (direction, id) {
		var self = this;
		var bucket = this.retryStates[direction];
		var state = bucket && bucket[id];
		if (!state || !state.attempts) {
			return;
		}
		if (state.timer) {
			clearTimeout(state.timer);
			state.timer = false;
		}
		if (state.stableTimer) {
			clearTimeout(state.stableTimer);
		}
		state.stableTimer = setTimeout(function () {
			if (self.retryStates[direction][id] === state) {
				delete self.retryStates[direction][id];
			}
		}, RETRY_STABLE_MS);
	};

	Controller.prototype.scheduleTranslationRetry = function (direction, id, callback, error) {
		var self = this;
		if (error && error.retryable === false) {
			return -1;
		}
		var bucket = this.retryStates[direction];
		var state = bucket[id] || { attempts: 0, timer: false, stableTimer: false, delay: 0 };
		bucket[id] = state;
		if (state.timer) {
			return state.delay;
		}
		if (state.stableTimer) {
			clearTimeout(state.stableTimer);
			state.stableTimer = false;
		}
		if (state.attempts >= RETRY_MAX_ATTEMPTS) {
			return false;
		}
		state.attempts += 1;
		var baseDelay = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * Math.pow(2, state.attempts - 1));
		var jitter = Math.round(baseDelay * RETRY_JITTER * (Math.random() * 2 - 1));
		state.delay = Math.max(0, baseDelay + jitter);
		this.setStatus("Translation connection failed. Retrying in " + Math.max(1, Math.ceil(state.delay / 1000)) + " seconds (" + state.attempts + "/" + RETRY_MAX_ATTEMPTS + ").", false);
		state.timer = setTimeout(function () {
			if (self.retryStates[direction][id] !== state) {
				return;
			}
			state.timer = false;
			callback();
		}, state.delay);
		return state.delay;
	};

	Controller.prototype.removePeerFromOutbound = function (UUID) {
		for (var language in this.outboundByLanguage) {
			var entry = this.outboundByLanguage[language];
			if (!entry || !entry.peers || !entry.peers[UUID]) {
				continue;
			}
			delete entry.peers[UUID];
			if (!hasProperties(entry.peers)) {
				this.closeOutbound(language);
			}
		}
	};

	Controller.prototype.setPeerLanguage = function (UUID, language) {
		var self = this;
		language = normalizeLanguage(language);
		this.removePeerFromOutbound(UUID);
		if (!language) {
			delete this.peerLanguages[UUID];
			if (session.restorePeerTranslationAudioTrack) {
				session.restorePeerTranslationAudioTrack(UUID);
			}
			return;
		}
		this.peerLanguages[UUID] = language;
		try {
			if (session.pcs[UUID] && session.pcs[UUID].stats) {
				session.pcs[UUID].stats.info = session.pcs[UUID].stats.info || {};
				session.pcs[UUID].stats.info.language = language;
			}
		} catch (e) {}
		if (!this.owner || this.stopped) {
			return;
		}
		var target = providerLanguage(language);
		if (!target) {
			this.setStatus("The requested language is not supported yet: " + language, false);
			session.restorePeerTranslationAudioTrack(UUID);
			return;
		}
		if (languagesMatch(language, this.language)) {
			session.restorePeerTranslationAudioTrack(UUID);
			return;
		}
		var outboundPromise = this.getOutbound(target);
		var pendingEntry = this.outboundByLanguage[target];
		if (pendingEntry && pendingEntry.peers) {
			pendingEntry.peers[UUID] = true;
		}
		outboundPromise
			.then(function (entry) {
				if (self.stopped || self.peerLanguages[UUID] !== language || self.outboundByLanguage[target] !== entry || !entry.peers[UUID] || !entry.track) {
					if (entry.peers && entry.peers[UUID]) {
						delete entry.peers[UUID];
					}
					if (self.outboundByLanguage[target] === entry && !hasProperties(entry.peers)) {
						self.closeOutbound(target);
					}
					return;
				}
				return session.setPeerTranslationAudioTrack(UUID, entry.track, "translation:" + target);
			})
			.catch(function (error) {
				// A previous microphone's rejection must not restore over its replacement.
				if (!self.stopped && self.peerLanguages[UUID] === language && self.outboundByLanguage[target] === pendingEntry) {
					if (!error.translationFailureHandled) {
						self.setStatus("Translation failed: " + (error.message || error), true);
					}
					session.restorePeerTranslationAudioTrack(UUID);
				}
			});
	};

	Controller.prototype.getOutbound = function (language) {
		var self = this;
		if (this.outboundByLanguage[language]) {
			return this.outboundByLanguage[language].promise;
		}
		var sourceTrack = this.findLocalAudioTrack();
		if (!sourceTrack) {
			return Promise.reject(new Error("No local microphone audio is available."));
		}
		var entry = {
			language: language,
			track: false,
			translatedTrack: false,
			session: false,
			peers: {},
			nodes: [],
			mixedTrack: false,
			ownedAudioContext: false,
			abortController: new AbortController(),
			promise: false
		};
		this.outboundByLanguage[language] = entry;
		entry.promise = this.ensureProvider()
			.then(function (provider) {
				if (self.stopped || self.outboundByLanguage[language] !== entry) {
					throw new Error("Translation session was cancelled.");
				}
				return provider.createSession({
					signal: entry.abortController.signal,
					sourceTrack: sourceTrack,
					targetLanguage: language,
					apiKey: self.apiKey,
					brokerURL: self.brokerURL,
					brokerToken: self.brokerToken,
					onError: function (error) {
						if (!self.stopped && self.outboundByLanguage[language] === entry) {
							self.handleOutboundFailure(language, error);
						}
					}
				});
			})
			.then(function (translationSession) {
				if (self.stopped || self.outboundByLanguage[language] !== entry) {
					translationSession.close();
					throw new Error("Translation session was cancelled.");
				}
				entry.session = translationSession;
				entry.translatedTrack = translationSession.outputTrack;
				entry.track = self.createCombinedTrack(entry, sourceTrack, translationSession.outputTrack);
				entry.track.enabled = !session.muted;
				self.markTranslationRetryStable("outbound", language);
				self.setStatus("Translating to " + SUPPORTED_LANGUAGES[language] + ".", false);
				return entry;
			})
			.catch(function (error) {
				if (self.outboundByLanguage[language] === entry) {
					if (!self.stopped && hasProperties(entry.peers)) {
						self.handleOutboundFailure(language, error);
						error.translationFailureHandled = true;
					} else {
						delete self.outboundByLanguage[language];
					}
				}
				throw error;
			});
		return entry.promise;
	};

	Controller.prototype.handleOutboundFailure = function (language, error) {
		var self = this;
		var entry = this.outboundByLanguage[language];
		if (!entry) {
			return;
		}
		var peers = [];
		for (var UUID in entry.peers) {
			peers.push(UUID);
		}
		this.closeOutbound(language);
		for (var i = 0; i < peers.length; i++) {
			session.restorePeerTranslationAudioTrack(peers[i]);
		}
		this.setStatus("Translation connection failed: " + ((error && error.message) || error || "unknown error"), true);
		var retryResult = this.scheduleTranslationRetry("outbound", language, function () {
			if (self.stopped) {
				return;
			}
			for (var peerIndex = 0; peerIndex < peers.length; peerIndex++) {
				var UUID = peers[peerIndex];
				if (session.pcs[UUID] && providerLanguage(self.peerLanguages[UUID]) === language) {
					self.setPeerLanguage(UUID, self.peerLanguages[UUID]);
				}
			}
		}, error);
		if (retryResult === -1) {
			this.setStatus("Translation stopped because the credential or request was rejected. Open Configure to correct it.", true);
		} else if (retryResult === false) {
			this.setStatus("Translation stopped retrying after " + RETRY_MAX_ATTEMPTS + " attempts. Reconnect or open Configure to try again.", true);
		}
	};

	Controller.prototype.closeOutbound = function (language) {
		var entry = this.outboundByLanguage[language];
		if (!entry) {
			return;
		}
		delete this.outboundByLanguage[language];
		entry.abortController.abort();
		this.cleanupCombinedTrack(entry);
		if (entry.session && entry.session.close) {
			entry.session.close();
		}
	};

	Controller.prototype.setRemoteLanguage = function (UUID, language) {
		language = normalizeLanguage(language);
		if (language) {
			this.remoteLanguages[UUID] = language;
		} else {
			delete this.remoteLanguages[UUID];
		}
		try {
			if (session.rpcs[UUID] && session.rpcs[UUID].stats) {
				session.rpcs[UUID].stats.info = session.rpcs[UUID].stats.info || {};
				session.rpcs[UUID].stats.info.language = language;
			}
			var tracks = session.rpcs[UUID] && session.rpcs[UUID].streamSrc ? session.rpcs[UUID].streamSrc.getAudioTracks() : [];
			if (tracks.length) {
				this.attachIncomingTrack(UUID, tracks[0]);
			}
		} catch (e) {
			errorlog(e);
		}
	};

	Controller.prototype.attachIncomingTrack = function (UUID, sourceTrack, retrying) {
		var self = this;
		if (!this.owner || this.stopped || !sourceTrack || sourceTrack.readyState === "ended") {
			return;
		}
		if (this.remoteLanguages[UUID] && languagesMatch(this.remoteLanguages[UUID], this.language)) {
			this.closeInbound(UUID, true);
			return;
		}
		var target = providerLanguage(this.language);
		if (!target) {
			this.setStatus("Your selected language is not supported by this provider: " + this.language, false);
			return;
		}
		var existing = this.inboundByPeer[UUID];
		if (existing && existing.sourceTrack === sourceTrack && existing.targetLanguage === target) {
			return;
		}
		if (!retrying) {
			this.clearTranslationRetry("inbound", UUID);
		}
		this.closeInbound(UUID, true);
		var token = Date.now() + ":" + Math.random();
		var item = {
			token: token,
			sourceTrack: sourceTrack,
			targetLanguage: target,
			session: false,
			playbackTrack: false,
			abortController: new AbortController(),
			nodes: [],
			ownedAudioContext: false
		};
		this.inboundByPeer[UUID] = item;
		this.ensureProvider()
			.then(function (provider) {
				if (self.stopped || self.inboundByPeer[UUID] !== item) {
					throw new Error("Translation session was cancelled.");
				}
				return provider.createSession({
					signal: item.abortController.signal,
					sourceTrack: sourceTrack,
					targetLanguage: target,
					apiKey: self.apiKey,
					brokerURL: self.brokerURL,
					brokerToken: self.brokerToken,
					onError: function (error) {
						self.handleInboundFailure(UUID, token, error);
					}
				});
			})
			.then(function (translationSession) {
				if (self.stopped || !self.inboundByPeer[UUID] || self.inboundByPeer[UUID].token !== token) {
					translationSession.close();
					return;
				}
				item.session = translationSession;
				item.playbackTrack = self.createIncomingPlaybackTrack(item, sourceTrack, translationSession.outputTrack);
				self.applyIncomingPlayback(UUID, item.playbackTrack);
				self.markTranslationRetryStable("inbound", UUID);
				self.setStatus("Two-way translation is active.", false);
			})
			.catch(function (error) {
				if (self.inboundByPeer[UUID] && self.inboundByPeer[UUID].token === token) {
					self.handleInboundFailure(UUID, token, error);
					error.translationFailureHandled = true;
				}
			});
	};

	Controller.prototype.createIncomingPlaybackTrack = function (item, originalTrack, translatedTrack) {
		// Incoming recordings need a stable output even in Replace mode, so
		// translation can fall back to the original without ending their track.
		return this.createCombinedTrack(item, originalTrack, translatedTrack, true);
	};

	Controller.prototype.applyIncomingPlayback = function (UUID, track) {
		try {
			var rpc = session.rpcs && session.rpcs[UUID];
			if (!rpc || !rpc.videoElement || !track) {
				return false;
			}
			if (rpc.videoElement.recording) {
				var pendingItem = this.inboundByPeer[UUID];
				if (pendingItem && !pendingItem.playbackTimer) {
					var self = this;
					pendingItem.playbackTimer = setTimeout(function () {
						pendingItem.playbackTimer = false;
						if (self.inboundByPeer[UUID] === pendingItem) {
							self.applyIncomingPlayback(UUID, track);
						}
					}, 1000);
				}
				this.setStatus("Translation will switch after the current recording stops.", false);
				return false;
			}
			var renderedTrack = track;
			if ((session.audioEffects === true || session.pushLoudness || rpc.isolatedChannel !== undefined) && typeof addAudioPipeline === "function") {
				renderedTrack = addAudioPipeline(UUID, track) || track;
			}
			if (!rpc.videoElement.srcObject) {
				rpc.videoElement.srcObject = createMediaStream();
			}
			var current = rpc.videoElement.srcObject.getAudioTracks();
			for (var i = 0; i < current.length; i++) {
				if (current[i] !== renderedTrack) {
					rpc.videoElement.srcObject.removeTrack(current[i]);
				}
			}
			if (rpc.videoElement.srcObject.getAudioTracks().indexOf(renderedTrack) === -1) {
				rpc.videoElement.srcObject.addTrack(renderedTrack);
			}
			rpc.translationSourceTrack = track;
			rpc.translationPlaybackTrack = renderedTrack;
			if (typeof nudgeIncomingAudioPlayback === "function") {
				nudgeIncomingAudioPlayback(UUID);
			}
			return true;
		} catch (e) {
			errorlog(e);
			return false;
		}
	};

	Controller.prototype.refreshIncomingPlayback = function (UUID) {
		var item = this.inboundByPeer[UUID];
		if (item && item.playbackTrack && item.playbackTrack.readyState !== "ended") {
			this.applyIncomingPlayback(UUID, item.playbackTrack);
		}
	};

	Controller.prototype.handleInboundFailure = function (UUID, token, error) {
		if (!this.inboundByPeer[UUID] || this.inboundByPeer[UUID].token !== token) {
			return;
		}
		var self = this;
		var sourceTrack = this.inboundByPeer[UUID].sourceTrack;
		this.closeInbound(UUID, true);
		this.setStatus("Translation connection failed: " + ((error && error.message) || error || "unknown error"), true);
		var retryResult = this.scheduleTranslationRetry("inbound", UUID, function () {
			if (!self.stopped && session.rpcs[UUID] && sourceTrack && sourceTrack.readyState !== "ended") {
				self.attachIncomingTrack(UUID, sourceTrack, true);
			}
		}, error);
		if (retryResult === -1) {
			this.setStatus("Translation stopped because the credential or request was rejected. Open Configure to correct it.", true);
		} else if (retryResult === false) {
			this.setStatus("Translation stopped retrying after " + RETRY_MAX_ATTEMPTS + " attempts. Reconnect or open Configure to try again.", true);
		}
	};

	Controller.prototype.closeInbound = function (UUID, restore) {
		var item = this.inboundByPeer[UUID];
		var rpc = session.rpcs && session.rpcs[UUID];
		if (item) {
			delete this.inboundByPeer[UUID];
			// A recorder may still own the mixed output. Keep that track and its
			// original-audio path alive, but disconnect translation immediately.
			var keepRecordingAudio = restore && rpc && rpc.videoElement && rpc.videoElement.recording && item.mixedTrack && item.originalGain && rpc.translationSourceTrack === item.playbackTrack;
			if (keepRecordingAudio) {
				item.translatedSource.disconnect();
				item.translatedGain.disconnect();
				item.originalGain.gain.value = 1;
				rpc.translationRecordingFallback = item;
			}
			item.abortController.abort();
			if (item.session && item.session.close) {
				item.session.close();
			}
			if (!keepRecordingAudio) {
				this.cleanupCombinedTrack(item);
			}
		}
		if (!restore) {
			this.cleanupIncomingRecordingFallback(rpc);
		} else if (rpc) {
			try {
				delete rpc.translationPlaybackTrack;
				delete rpc.translationSourceTrack;
				this.restoreIncomingPlaybackWhenSafe(UUID);
			} catch (e) {
				errorlog(e);
			}
		}
	};

	Controller.prototype.cleanupIncomingRecordingFallback = function (rpc) {
		if (!rpc) {
			return;
		}
		if (rpc.translationRestoreTimer) {
			clearTimeout(rpc.translationRestoreTimer);
			rpc.translationRestoreTimer = false;
		}
		if (rpc.translationRecordingFallback) {
			this.cleanupCombinedTrack(rpc.translationRecordingFallback);
			delete rpc.translationRecordingFallback;
		}
	};

	Controller.prototype.restoreIncomingPlaybackWhenSafe = function (UUID, expectedRPC) {
		var self = this;
		var rpc = expectedRPC || (session.rpcs && session.rpcs[UUID]);
		if (!rpc || !rpc.videoElement || !session.rpcs || session.rpcs[UUID] !== rpc) {
			this.cleanupIncomingRecordingFallback(rpc);
			return;
		}
		if (rpc.videoElement.recording) {
			if (!rpc.translationRestoreTimer) {
				rpc.translationRestoreTimer = setTimeout(function () {
					rpc.translationRestoreTimer = false;
					self.restoreIncomingPlaybackWhenSafe(UUID, rpc);
				}, 1000);
			}
			return;
		}
		if (rpc.translationRestoreTimer) {
			clearTimeout(rpc.translationRestoreTimer);
			rpc.translationRestoreTimer = false;
		}
		updateIncomingAudioElement(UUID);
		this.cleanupIncomingRecordingFallback(rpc);
	};

	Controller.prototype.localAudioTrackChanged = function () {
		if (!this.owner || this.stopped) {
			return;
		}
		this.clearAllTranslationRetries("outbound");
		var languages = {};
		for (var UUID in this.peerLanguages) {
			languages[UUID] = this.peerLanguages[UUID];
		}
		for (var language in this.outboundByLanguage) {
			this.closeOutbound(language);
		}
		for (var peerUUID in languages) {
			this.setPeerLanguage(peerUUID, languages[peerUUID]);
		}
	};

	Controller.prototype.syncMuteState = function (muted) {
		for (var language in this.outboundByLanguage) {
			var entry = this.outboundByLanguage[language];
			if (entry && entry.track) {
				entry.track.enabled = !muted;
			}
		}
	};

	Controller.prototype.setLanguage = function (setting) {
		for (var recordingUUID in session.rpcs) {
			if (session.rpcs[recordingUUID].videoElement && session.rpcs[recordingUUID].videoElement.recording) {
				this.updateSettingsUI();
				this.setStatus("Stop the current local recording before changing translation language.", true);
				return false;
			}
		}
		setting = setting || "auto";
		this.languageSetting = setting;
		this.language = resolveLanguage(setting);
		this.config.languageSetting = setting;
		this.config.language = this.language;
		session.translation.languageSetting = setting;
		session.translation.language = this.language;
		try {
			localStorage.setItem(LANGUAGE_STORAGE, setting);
		} catch (e) {}
		this.updateSettingsUI();

		this.clearAllTranslationRetries("inbound");
		var inboundTracks = {};
		for (var UUID in session.rpcs) {
			try {
				var tracks = session.rpcs[UUID].streamSrc ? session.rpcs[UUID].streamSrc.getAudioTracks() : [];
				if (tracks.length) {
					inboundTracks[UUID] = tracks[0];
				}
			} catch (e) {}
		}
		for (var inboundUUID in this.inboundByPeer) {
			this.closeInbound(inboundUUID, true);
		}
		this.localAudioTrackChanged();
		for (var sourceUUID in inboundTracks) {
			this.attachIncomingTrack(sourceUUID, inboundTracks[sourceUUID]);
		}
		if (session.sendMessage) {
			session.sendMessage({ translationLanguage: this.language });
		}
		this.setStatus("Preferred language: " + (SUPPORTED_LANGUAGES[providerLanguage(this.language)] || this.language) + ".", false);
	};

	Controller.prototype.removePeer = function (UUID, direction) {
		if (!direction || direction === "outbound") {
			this.removePeerFromOutbound(UUID);
			delete this.peerLanguages[UUID];
		}
		if (!direction || direction === "inbound") {
			this.clearTranslationRetry("inbound", UUID);
			this.closeInbound(UUID, false);
			delete this.remoteLanguages[UUID];
		}
	};

	Controller.prototype.scanExistingPeers = function () {
		for (var UUID in session.pcs) {
			try {
				var info = session.pcs[UUID].stats && session.pcs[UUID].stats.info;
				if (info && info.language) {
					this.setPeerLanguage(UUID, info.language);
				}
			} catch (e) {}
		}
		for (var remoteUUID in session.rpcs) {
			try {
				var remoteInfo = session.rpcs[remoteUUID].stats && session.rpcs[remoteUUID].stats.info;
				if (remoteInfo && remoteInfo.language) {
					this.remoteLanguages[remoteUUID] = normalizeLanguage(remoteInfo.language);
				}
				var tracks = session.rpcs[remoteUUID].streamSrc ? session.rpcs[remoteUUID].streamSrc.getAudioTracks() : [];
				if (tracks.length) {
					this.attachIncomingTrack(remoteUUID, tracks[0]);
				}
			} catch (e) {}
		}
	};

	Controller.prototype.stop = function () {
		this.stopped = true;
		this.clearAllTranslationRetries();
		for (var UUID in this.peerLanguages) {
			if (session.restorePeerTranslationAudioTrack) {
				session.restorePeerTranslationAudioTrack(UUID);
			}
		}
		for (var language in this.outboundByLanguage) {
			this.closeOutbound(language);
		}
		for (var remoteUUID in this.inboundByPeer) {
			this.closeInbound(remoteUUID, true);
		}
		this.setStatus("Translation stopped; original audio restored.", false);
	};

	function start(config) {
		if (activeController) {
			activeController.stop();
		}
		activeController = new Controller(config);
		session.translationController = activeController;
		activeController.updateSettingsUI();
		activeController.setStatus(activeController.owner ? "Translation is ready; waiting for participant audio." : "Preferred language: " + (SUPPORTED_LANGUAGES[providerLanguage(activeController.language)] || activeController.language) + ".", false);
		activeController.scanExistingPeers();
		return Promise.resolve(activeController);
	}

	root.setTranslationLanguage = function (value) {
		if (activeController) {
			activeController.setLanguage(value);
		}
	};

	root.openTranslationSetup = function () {
		var setupURL = new URL("./translate.html", root.location.href);
		setupURL.hash = "return=" + encodeURIComponent(root.location.href);
		root.open(setupURL.href, "_blank", "noopener");
	};

	root.stopTranslation = function () {
		try {
			if (session.sendMessage) {
				session.sendMessage({ translationLanguage: "" });
			}
		} catch (e) {}
		if (activeController) {
			activeController.stop();
		}
		if (session.translation) {
			session.translation.enabled = false;
		}
	};

	root.VDOTranslation = {
		start: start,
		normalizeLanguage: normalizeLanguage,
		resolveLanguage: resolveLanguage,
		providerLanguage: providerLanguage,
		supportedLanguages: SUPPORTED_LANGUAGES,
		storage: {
			key: KEY_STORAGE,
			brokerURL: BROKER_URL_STORAGE,
			brokerToken: BROKER_TOKEN_STORAGE,
			language: LANGUAGE_STORAGE,
			provider: PROVIDER_STORAGE,
			audioMode: AUDIO_MODE_STORAGE
		}
	};
})(window);
