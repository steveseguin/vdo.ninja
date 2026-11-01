/* Copyright (c) 2026 Steve Seguin. SPDX-License-Identifier: MIT */
(function () {
	"use strict";
	var cameras = [];
	var local = null;
	var localContext = null;
	var micRequest = 0;
	var samples = [];
	var round = null;
	var mode = "buffer2";
	var compensate = true;
	var settleUntil = 0;
	var lastTick = 0;
	var suggestions = [];
	var lastRender = 0;
	var lastMeter = 0;
	var timer = null;
	var discoveryTimer = null;
	var modeHelp = {
		buffer2: "Requests buffering with estimated network travel time included. Check alignment after it settles.",
		buffer: "Sets the browser playback buffer only. Network travel time is not included.",
		chunkbuffer: "For publishers using &chunked. Align with a visible clap; receiver adaptive buffering is turned off."
	};

	function el(id) { return document.getElementById(id); }
	function say(message, error) {
		el("status").textContent = message;
		el("status").className = error ? "error" : "";
	}
	function setupMessage(message, error) {
		el("setup-message").textContent = message;
		el("setup-message").className = error ? "error" : "";
		el("setup-message").hidden = !message;
	}
	function number(input, min, max) {
		var value = Number(input.value);
		if (!input.value.trim() || !isFinite(value) || value < min || value > max) {
			throw new Error("Enter a number from " + min + " to " + max + ".");
		}
		return Math.round(value);
	}
	function limit() { return mode === "chunkbuffer" ? 180000 : 3000; }
	function visual() { return el("method-visual").checked; }
	function sources() {
		var list = cameras.slice();
		if (local && !visual()) { list.unshift(local); }
		return list;
	}
	function post(camera, message) {
		camera.frame.contentWindow.postMessage(message, camera.url.origin);
	}
	function clearMeasurements(message) {
		round = null;
		samples = [];
		suggestions = [];
		cameras.forEach(function (camera) { if (camera.observed) { camera.observed.value = ""; } });
		renderHistory();
		if (message) { say(message); }
		render();
	}
	function makeSource(name) {
		return { name: name, method: "none", lastSeen: 0, noise: 0, level: 0, quietSince: 0, lastSample: 0, node: null, input: null, context: null, data: null, meterAt: 0, meterLevel: 0, peak: 0, shown: 0, connected: false };
	}
	function detach(source) {
		if (source.input && source.node) {
			try { source.input.disconnect(source.node); } catch (e) { /* The iframe may already have reloaded. */ }
		}
		if (source.node) { source.node.disconnect(); }
		source.node = null;
		source.input = null;
		source.context = null;
		source.data = null;
		source.lastSeen = 0;
		source.lastSample = 0;
	}
	function attach(source, input, context, method) {
		if (source.input === input) { return; }
		detach(source);
		var analyser = context.createAnalyser();
		analyser.fftSize = 2048;
		input.connect(analyser);
		source.input = input;
		source.node = analyser;
		source.context = context;
		source.data = new Float32Array(analyser.fftSize);
		source.method = method;
		source.noise = 0;
		clearMeasurements("Audio path ready or changed. Take a fresh set of claps.");
	}
	function viewURL(camera, preview) {
		var url = new URL(camera.url.href);
		var params = url.searchParams;
		["buffer", "buffer2", "buffer3", "chunkbuffer"].forEach(function (key) { params.delete(key); });
		params.set(mode, String(camera.delay));
		if (compensate) { params.set("sync", "0"); }
		if (mode === "chunkbuffer") {
			params.set("chunkbufferadaptive", "0");
			params.set("chunkbufferceil", "180000");
		}
		if (preview) {
			// Only the calibration preview needs metering and silent playback.
			params.delete("noaudio");
			params.delete("na");
			params.delete("hideaudio");
			params.delete("speakermute");
			params.delete("sm");
			params.set("volume", "0");
			params.set("cleanoutput", "");
			if (mode !== "chunkbuffer") { params.set("pushloudness", ""); }
			params.set("iframetarget", window.location.origin);
		}
		return url.href;
	}
	function updateLink(camera) {
		camera.output.value = viewURL(camera, false);
		el("copy-links").hidden = true;
		el("copy-links").value = "";
	}
	function button(text, action) {
		var node = document.createElement("button");
		node.textContent = text;
		node.addEventListener("click", action);
		return node;
	}
	function copy(text, fallback, control) {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text).then(function () {
				say("Copied. Paste the view links into OBS, then check a visible clap there.");
				if (!control.dataset.label) { control.dataset.label = control.textContent; }
				control.textContent = "Copied";
				setTimeout(function () { control.textContent = control.dataset.label; }, 1500);
			}).catch(function () { selectFallback(fallback, text); });
		} else { selectFallback(fallback, text); }
	}
	function selectFallback(input, text) {
		input.value = text;
		input.hidden = false;
		input.focus();
		input.select();
		say("Copy the selected view links with your keyboard.");
	}
	function applyDelay(camera, value) {
		camera.delay = value;
		camera.delayInput.value = value;
		// Set both the default for reconnects and the existing peer override.
		post(camera, { setBufferDelay: value });
		post(camera, { setBufferDelay: value, UUID: "*" });
		updateLink(camera);
	}
	function changedDelay() {
		settleUntil = performance.now() + 10000;
		clearMeasurements("Delay requested. Wait at least 10 seconds for playback to settle, then measure again. Check the video before using the links in OBS.");
	}
	function makeCard(camera, index) {
		var card = document.createElement("article");
		card.className = "camera";
		card.innerHTML = '<div class="camera-head"><h3></h3><span class="stream-id"></span><span class="pill">Connecting</span></div>' +
			'<div class="video"></div>' +
			'<div class="camera-body">' +
			'<div class="meter" aria-hidden="true"><span class="meter-fill"></span><span class="meter-mark" hidden></span></div>' +
			'<p class="camera-status"></p>' +
			'<dl class="stats"><div><dt class="label-offset">Audio offset</dt><dd class="stat-offset">—</dd></div><div title="Range across samples (largest minus smallest)"><dt>Spread</dt><dd class="stat-spread">—</dd></div><div><dt class="label-target">Audio target</dt><dd class="stat-target">—</dd></div></dl>' +
			'<label class="field observed" hidden>Video lag behind Camera 1<span class="unit"><input type="number" step="1" /><span>ms</span></span></label>' +
			'<div class="camera-row"><label class="field">Buffer target<span class="unit"><input class="delay" type="number" min="0" step="1" /><span>ms</span></span></label></div>' +
			'<div class="link-row"><input class="output-link" readonly /></div>' +
			'</div>';
		card.querySelector("h3").textContent = camera.name;
		card.querySelector(".stream-id").textContent = camera.streamID;
		var frame = document.createElement("iframe");
		frame.title = camera.name + " preview";
		frame.allow = "autoplay; fullscreen";
		frame.referrerPolicy = "no-referrer";
		card.querySelector(".video").appendChild(frame);
		camera.frame = frame;
		camera.pill = card.querySelector(".pill");
		camera.meterFill = card.querySelector(".meter-fill");
		camera.meterMark = card.querySelector(".meter-mark");
		camera.status = card.querySelector(".camera-status");
		camera.offsetLabel = card.querySelector(".label-offset");
		camera.targetLabel = card.querySelector(".label-target");
		camera.offsetCell = card.querySelector(".stat-offset");
		camera.spreadCell = card.querySelector(".stat-spread");
		camera.targetCell = card.querySelector(".stat-target");
		var observedField = card.querySelector(".observed");
		if (index > 0) {
			camera.observedField = observedField;
			camera.observed = observedField.querySelector("input");
			camera.observed.id = "observed-" + index;
			camera.observed.setAttribute("aria-label", camera.name + " video lag relative to Camera 1 in milliseconds");
			camera.observed.addEventListener("keydown", function (event) {
				if (event.key === "Enter" && !el("capture").disabled) { capture(); }
			});
		} else {
			// Keep the reference card the same height as the others.
			camera.observedField = observedField;
			observedField.firstChild.textContent = "Video lag";
			var reference = observedField.querySelector("input");
			reference.type = "text";
			reference.value = "Reference";
			reference.disabled = true;
			reference.setAttribute("aria-label", camera.name + " is the video reference");
			observedField.querySelector(".unit > span").hidden = true;
		}
		camera.delayInput = card.querySelector("input.delay");
		camera.delayInput.max = limit();
		camera.delayInput.value = camera.delay;
		camera.delayInput.setAttribute("aria-label", camera.name + " buffer target in milliseconds");
		camera.output = card.querySelector(".output-link");
		camera.output.setAttribute("aria-label", camera.name + " OBS view link");
		var controls = card.querySelector(".camera-row");
		var set = button("Set", function () {
			try { applyDelay(camera, number(camera.delayInput, 0, limit())); changedDelay(); } catch (e) { say(e.message, true); }
		});
		controls.appendChild(set);
		camera.delayInput.addEventListener("keydown", function (event) {
			if (event.key === "Enter") { set.click(); }
		});
		var monitor = button("Unmute", function () {
			camera.audible = !camera.audible;
			post(camera, { volume: camera.audible ? 1 : 0 });
			monitor.textContent = camera.audible ? "Mute" : "Unmute";
			monitor.setAttribute("aria-pressed", camera.audible ? "true" : "false");
		});
		monitor.setAttribute("aria-pressed", "false");
		monitor.setAttribute("aria-label", "Listen to " + camera.name);
		controls.appendChild(monitor);
		var copyButton = button("Copy link", function () { copy(camera.output.value, camera.output, copyButton); });
		card.querySelector(".link-row").appendChild(copyButton);
		frame.addEventListener("load", function () {
			detach(camera);
			camera.method = "none";
			camera.connected = false;
			camera.meterAt = 0;
			if (mode === "chunkbuffer") {
				clearMeasurements("Viewer loaded. Confirm the publishers are sending chunked video, then compare a visible clap and enter its offsets.");
			} else {
				clearMeasurements("Viewer loaded. Wait for each audio meter, then capture a clap. If a meter stays quiet, click inside that preview to enable playback.");
				post(camera, { getLoudness: true });
			}
			post(camera, { getDetailedState: true });
		});
		el("cameras").appendChild(card);
		updateLink(camera);
		frame.src = viewURL(camera, true);
	}
	function loadCameras() {
		try {
			if (location.protocol === "file:") { throw new Error("Serve this page over HTTPS or localhost so the iframe API can identify its origin."); }
			var lines = el("links").value.split(/\r?\n/).filter(function (line) { return line.trim(); });
			if (lines.length < 2 || lines.length > 8) { throw new Error("Add between two and eight individual camera view links."); }
			var urls = [];
			var seen = {};
			lines.forEach(function (line) {
				var url;
				try { url = new URL(line.trim()); } catch (err) { throw new Error("“" + line.trim().slice(0, 60) + "” is not a complete link. Paste the full view link, starting with https://."); }
				var id = url.searchParams.get("streamid") || url.searchParams.get("view") || url.searchParams.get("v") || url.searchParams.get("V") || url.searchParams.get("pull");
				var publishes = ["push", "id", "permaid", "publish", "director", "dir"].some(function (key) { return url.searchParams.has(key); });
				if (!/^https?:$/.test(url.protocol) || url.username || url.password || !id || id.indexOf(",") !== -1 || id === "*" || publishes) {
					throw new Error("Use an HTTP(S) VDO.Ninja view link for one camera on each line, without publishing or director options.");
				}
				if (location.protocol === "https:" && url.protocol !== "https:") { throw new Error("Use HTTPS camera links on this HTTPS page."); }
				var key = url.origin + url.pathname + "?view=" + id;
				if (seen[key]) { throw new Error("The same camera appears twice. Use a different stream for each view."); }
				seen[key] = true;
				urls.push({ url: url, id: id });
			});
			var base = number(el("base-delay"), 0, el("mode").value === "chunkbuffer" ? 180000 : 3000);
			cameras.forEach(detach);
			el("cameras").textContent = "";
			cameras = [];
			mode = el("mode").value;
			compensate = el("sync").checked;
			if (mode === "chunkbuffer") { el("method-visual").checked = true; }
			urls.forEach(function (item, index) {
				var camera = makeSource("Camera " + (index + 1));
				camera.url = item.url;
				camera.streamID = item.id;
				camera.delay = base;
				cameras.push(camera);
				makeCard(camera, index);
			});
			settleUntil = performance.now() + 10000;
			setupMessage("");
			clearMeasurements("Connecting cameras. Allow at least 10 seconds for playback to settle.");
			el("measure-title").scrollIntoView({ behavior: "smooth", block: "start" });
		} catch (e) { setupMessage(e.message, true); }
	}
	function discover() {
		cameras.forEach(function (camera) {
			post(camera, { getDetailedState: true });
			if (camera.url.origin !== window.location.origin || mode === "chunkbuffer") { return; }
			var input = null;
			var context = null;
			try {
				var session = camera.frame.contentWindow.session;
				if (session && session.audioCtx && session.rpcs) {
					context = session.audioCtx;
					for (var uuid in session.rpcs) {
						var rpc = session.rpcs[uuid];
						if (rpc.streamID !== camera.streamID || !rpc.inboundAudioPipeline) { continue; }
						var nodes = [];
						for (var track in rpc.inboundAudioPipeline) {
							if (rpc.inboundAudioPipeline[track].analyser) { nodes.push(rpc.inboundAudioPipeline[track].analyser); }
						}
						// Multiple audio tracks require choosing the clap track explicitly.
						if (nodes.length === 1) { input = nodes[0]; }
					}
				}
			} catch (e) { /* Cross-origin redirects use the metering API. */ }
			if (input && context) { attach(camera, input, context, "waveform"); }
			else if (camera.node) {
				detach(camera);
				camera.method = "none";
				clearMeasurements("An audio path disconnected. Reconnect and take a new set of claps.");
			}
		});
	}
	window.addEventListener("message", function (event) {
		var data = event.data;
		if (!data || typeof data !== "object") { return; }
		for (var i = 0; i < cameras.length; i++) {
			var camera = cameras[i];
			if (event.source !== camera.frame.contentWindow || event.origin !== camera.url.origin) { continue; }
			if (data.detailedState) {
				var state = data.detailedState[camera.streamID];
				var connected = !!(state && !state.localStream);
				if (camera.connected && (!connected || camera.uuid !== state.UUID)) {
					clearMeasurements("A camera disconnected or reconnected. Take fresh measurements after it settles.");
					settleUntil = performance.now() + 10000;
				}
				camera.connected = connected;
				camera.uuid = connected ? state.UUID : null;
				camera.stateAt = performance.now();
			}
			if (mode !== "chunkbuffer" && data.loudness && data.mode !== "snapshot" && Object.prototype.hasOwnProperty.call(data.loudness, camera.streamID)) {
				var level = data.loudness[camera.streamID];
				if (typeof level !== "number" || !isFinite(level) || level < 0) { return; }
				camera.meterAt = performance.now();
				camera.meterLevel = level;
				if (!camera.node) {
					if (camera.method !== "meter") {
						camera.method = "meter";
						camera.noise = 0;
						clearMeasurements("Audio meter ready. Capture several claps; API metering provides coarse timing.");
					}
					feed(camera, level, camera.meterAt, camera.meterAt);
				}
			}
			return;
		}
	});
	function ready(source, now) {
		if (source === local) { return source.context && source.context.state === "running" && source.stream.active; }
		return source.connected && now - source.stateAt < 4000 && source.lastSeen > 0 && now - source.lastSeen < 700 && (!source.context || source.context.state === "running");
	}
	function feed(source, level, timestamp, now) {
		source.lastSeen = now;
		source.level = level;
		if (level > source.peak) { source.peak = level; }
		if (!round || round.stage === "quiet") {
			source.noise = source.noise * 0.95 + level * 0.05;
			return;
		}
		var index = round.sources.indexOf(source);
		if (index === -1) { return; }
		var threshold = round.thresholds[index];
		if (level < threshold * 0.6) {
			if (!source.quietSince) { source.quietSince = now; }
			return;
		}
		if (level < threshold) { return; }
		var wasQuiet = source.quietSince && now - source.quietSince >= 100;
		source.quietSince = 0;
		if (!wasQuiet || timestamp < round.listenAt) { return; }
		if (round.hits[index] !== null) {
			if (timestamp - round.hits[index] > 350) { round.bad = true; }
			return;
		}
		round.hits[index] = timestamp;
		if (!round.first) { round.first = now; }
		var received = round.hits.filter(function (hit) { return hit !== null; }).length;
		say("Heard " + received + " of " + round.sources.length + " sources. Stay quiet while the delayed copies arrive…");
	}
	function sampleWaveform(source, now) {
		if (!source.node || source.context.state !== "running") { return; }
		source.node.getFloatTimeDomainData(source.data);
		var duration = source.data.length * 1000 / source.context.sampleRate;
		var start = now - duration;
		var peak = 0;
		var onset = now;
		var threshold = Infinity;
		if (round && round.stage === "listen") { threshold = round.thresholds[round.sources.indexOf(source)]; }
		var found = false;
		var first = Math.max(0, Math.ceil((source.lastSample - start) * source.context.sampleRate / 1000));
		for (var i = first; i < source.data.length; i++) {
			var amplitude = Math.abs(source.data[i]);
			if (amplitude > peak) { peak = amplitude; }
			if (!found && amplitude >= threshold) { onset = start + i * 1000 / source.context.sampleRate; found = true; }
		}
		source.lastSample = now;
		feed(source, peak, onset, now);
	}
	function capture() {
		if (visual()) { recordVisual(); return; }
		var now = performance.now();
		var list = sources();
		if (mode === "chunkbuffer") { say("Use observed video offsets for chunked mode.", true); return; }
		if (now < settleUntil) { say("Let the new buffer target settle before measuring.", true); return; }
		if (!list.every(function (source) { return ready(source, now); })) { say("Every source needs an active audio meter. Check camera microphones and click inside any paused preview.", true); return; }
		round = { stage: "quiet", sources: list, started: now, listenAt: 0, first: 0, hits: [], thresholds: [], bad: false };
		list.forEach(function (source) { source.quietSince = 0; round.hits.push(null); });
		say("Stay quiet for two seconds while background levels are measured…");
		render();
	}
	function finishRound() {
		var result = round;
		round = null;
		if (result.bad) { say("More than one transient was heard. Sample discarded; make one clap and wait for the result.", true); }
		else if (result.hits.some(function (hit) { return hit === null; })) {
			var missing = [];
			result.hits.forEach(function (hit, i) { if (hit === null) { missing.push(result.sources[i].name); } });
			say("Sample discarded. No clear clap from " + missing.join(", ") + ". Try a louder clap, quieter room, or different sensitivity.", true);
		} else {
			var reference = result.hits[0];
			addSample(result.hits.map(function (hit) { return hit - reference; }));
		}
		render();
	}
	function addSample(offsets) {
		samples.push({ offsets: offsets, time: new Date() });
		if (samples.length > 50) { samples.shift(); }
		renderHistory();
		if (visual()) { say("Video offsets recorded. Apply the suggested targets, let playback settle, then check a visible clap again."); }
		else { say("Sample " + samples.length + " recorded. " + (samples.length < 3 ? "Repeat the clap to build a useful average." : "Review the variation, apply the suggested targets, then measure again.")); }
	}
	function renderHistory() {
		var history = el("history");
		history.textContent = samples.length ? "" : "No measurements yet.";
		var list = sources();
		samples.forEach(function (sample, index) {
			var row = document.createElement("p");
			var text = "#" + (index + 1) + " · " + sample.time.toLocaleTimeString();
			for (var i = 1; i < list.length; i++) { text += " · " + list[i].name + ": " + ms(sample.offsets[i]); }
			row.textContent = text;
			var remove = button("Remove", function () {
				round = null;
				samples.splice(index, 1);
				renderHistory();
				render();
				say("Sample removed. Suggestions now use the remaining measurements.");
			});
			remove.setAttribute("aria-label", "Remove sample " + (index + 1));
			row.appendChild(remove);
			history.appendChild(row);
		});
	}
	function recordVisual() {
		try {
			var offsets = [0];
			for (var i = 1; i < cameras.length; i++) { offsets.push(number(el("observed-" + i), -180000, 180000)); }
			addSample(offsets);
			render();
		} catch (e) { say("Enter every camera’s observed lag relative to Camera 1. " + e.message, true); }
	}
	function stats(values) {
		var sorted = values.slice().sort(function (a, b) { return a - b; });
		var sum = 0;
		values.forEach(function (value) { sum += value; });
		var middle = Math.floor(sorted.length / 2);
		return { mean: sum / values.length, median: sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2, min: sorted[0], max: sorted[sorted.length - 1] };
	}
	function ms(value) {
		var rounded = Math.round(value);
		return (rounded > 0 ? "+" : "") + rounded + " ms";
	}
	function render() {
		var now = performance.now();
		var isVisual = visual();
		var wait = Math.ceil((settleUntil - now) / 1000);
		var label = isVisual ? "Record video offsets" : "Capture one clap";
		if (round) { label = "Listening…"; }
		else if (wait > 0) { label = "Settling… " + wait + " s"; }
		el("empty-state").hidden = cameras.length > 0;
		el("workbench").hidden = !cameras.length;
		el("workbench").className = round ? "listening" : "";
		el("audio-help").hidden = isVisual;
		el("visual-help").hidden = !isVisual;
		el("sensitivity-label").hidden = isVisual;
		el("reference").textContent = local && !isVisual ? "your local audio" : "Camera 1";
		el("capture").textContent = label;
		el("capture").disabled = cameras.length < 2 || !!round || now < settleUntil || (!isVisual && mode === "chunkbuffer");
		el("cancel").hidden = !round;
		el("clear").disabled = !samples.length && !round;
		el("copy-all").disabled = !cameras.length;
		el("count").textContent = samples.length + (samples.length === 1 ? " sample" : " samples");
		el("method-audio").disabled = !!round || mode === "chunkbuffer";
		el("method-visual").disabled = !!round;
		el("sensitivity").disabled = !!round;
		var list = sources();
		var summary = [];
		var slowest = -Infinity;
		var spread = 0;
		suggestions = [];
		if (samples.length) {
			list.forEach(function (source, i) {
				var result = stats(samples.map(function (sample) { return sample.offsets[i]; }));
				summary.push(result);
				if (source !== local) { slowest = Math.max(slowest, result.median); }
				spread = Math.max(spread, result.max - result.min);
			});
		}
		// A typed video offset is already a judged value; claps need repeats to average out.
		var needed = isVisual ? 1 : 3;
		var canApply = samples.length >= needed && !round;
		var outOfRange = false;
		list.forEach(function (source, i) {
			if (source === local) { return; }
			source.offsetLabel.textContent = isVisual ? "Video offset" : "Audio offset";
			source.targetLabel.textContent = isVisual ? "Video target" : "Audio target";
			source.offsetCell.textContent = i === 0 ? "Reference" : (summary.length ? ms(summary[i].median) : "—");
			source.offsetCell.className = i === 0 ? "stat-offset ref" : "stat-offset";
			source.spreadCell.textContent = samples.length > 1 && i > 0 ? Math.round(summary[i].max - summary[i].min) + " ms" : "—";
			source.targetCell.textContent = "—";
			source.targetCell.className = "stat-target";
			if (summary.length) {
				var target = Math.round(source.delay + slowest - summary[i].median);
				suggestions.push(target);
				source.targetCell.textContent = target + " ms";
				if (target > limit() || target < 0) { outOfRange = true; canApply = false; source.targetCell.className = "stat-target warn"; }
			}
		});
		cameras.forEach(function (camera) { if (camera.observedField) { camera.observedField.hidden = !isVisual; } });
		el("apply").disabled = !canApply;
		var description = isVisual ? "Enter each camera’s video lag, then record it to see the suggested targets." : "Capture at least three claps. Suggestions use the median offset, so one stray sound has less effect.";
		if (samples.length >= needed) { description = (samples.length > 1 ? "Largest spread: " + Math.round(spread) + " ms. " : "") + (spread > 100 ? "Timing is moving; check Wi-Fi and take more samples before applying." : "Apply, let playback settle, then measure again to check what is left."); }
		if (outOfRange) { description = "A suggested target exceeds this mode’s range. Lower the starting targets and recalibrate, or use chunked video with visual offsets."; }
		if (local && !isVisual && samples.length) {
			description += slowest >= 0 ? " Estimated OBS mixer delay after alignment: +" + Math.round(slowest) + " ms. Confirm in OBS." : " Local audio is later than the cameras; add video delay or reduce mixer latency in OBS.";
		}
		el("spread").textContent = description;
	}
	function tick() {
		var now = performance.now();
		if (round && lastTick && now - lastTick > 150) { round = null; say("Browser scheduling paused during the measurement. Sample discarded; keep this tab visible and try again.", true); }
		lastTick = now;
		var list = sources();
		list.forEach(function (source) { sampleWaveform(source, now); });
		if (round) {
			if (!round.sources.every(function (source) { return ready(source, now); })) { round = null; say("An audio source stopped updating. Sample discarded; check playback and try again.", true); }
			else if (round.stage === "quiet" && now - round.started >= 2000) {
				round.stage = "listen";
				round.listenAt = now;
				var sensitivity = Number(el("sensitivity").value);
				round.sources.forEach(function (source) {
					var minimum = source.method === "meter" ? 2.5 * sensitivity : 0.0075 * sensitivity;
					round.thresholds.push(Math.max(minimum, source.noise * sensitivity));
					source.quietSince = 0;
				});
				say("Clap once now, then stay quiet. Listening for up to eight seconds…");
			} else if (round.stage === "listen" && ((round.first && now - round.first >= 3500) || now - round.listenAt >= 8000)) { finishRound(); }
		}
		if (now - lastMeter > 80) {
			lastMeter = now;
			cameras.forEach(paintMeter);
		}
		if (now - lastRender > 250) {
			lastRender = now;
			cameras.forEach(function (camera) { paintStatus(camera, now); });
			render();
		}
	}
	function paintMeter(camera) {
		var scale = camera.method === "meter" ? 100 : 1;
		// Hold short peaks briefly so a clap is visible between paints.
		camera.shown = Math.max(Math.min(1, camera.peak / scale), camera.shown * 0.75);
		camera.peak = 0;
		camera.meterFill.style.transform = "scaleX(" + camera.shown.toFixed(3) + ")";
		var index = round && round.stage === "listen" ? round.sources.indexOf(camera) : -1;
		camera.meterMark.hidden = index === -1;
		if (index !== -1) { camera.meterMark.style.left = Math.min(100, round.thresholds[index] / scale * 100) + "%"; }
	}
	function paintStatus(camera, now) {
		var pill = "Ready";
		var tone = "good";
		var text = camera.method === "waveform" ? "Waveform sampling · finer audio timing" : "IFRAME meter · coarse timing, about 100 ms steps";
		var index = round ? round.sources.indexOf(camera) : -1;
		if (!camera.connected) { pill = "Connecting"; tone = ""; text = "Waiting for the camera and IFRAME API…"; }
		else if (visual()) { pill = "Connected"; text = "Compare a visible clap and enter the video offsets. Audio is not required."; }
		else if (!ready(camera, now)) { pill = "No audio"; tone = "warn"; text = "Turn on this camera’s microphone, or click the preview to start playback."; }
		else if (index !== -1 && round.hits[index] !== null) { pill = "Clap heard"; }
		else if (index !== -1 && round.stage === "listen") { pill = "Listening"; tone = "busy"; }
		camera.pill.textContent = pill;
		camera.pill.className = tone ? "pill " + tone : "pill";
		camera.status.textContent = text;
	}
	function disconnectMic() {
		micRequest++;
		if (local) { detach(local); local.stream.getTracks().forEach(function (track) { track.stop(); }); local = null; }
		if (localContext) { localContext.close().catch(function () {}); localContext = null; }
		el("mic-device").disabled = true;
		el("disconnect-mic").disabled = true;
		el("connect-mic").disabled = false;
		el("mic-status").textContent = "Local audio disconnected.";
		clearMeasurements("Reference changed. Take a fresh set of measurements.");
	}
	function connectMic() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { say("Local audio requires HTTPS or localhost and microphone support.", true); return; }
		var selected = el("mic-device").value;
		disconnectMic();
		var request = micRequest;
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		if (!AudioContext) { say("This browser does not support Web Audio.", true); return; }
		localContext = new AudioContext();
		localContext.resume().catch(function () {});
		var context = localContext;
		el("connect-mic").disabled = true;
		el("disconnect-mic").disabled = false;
		var constraints = { echoCancellation: false, noiseSuppression: false, autoGainControl: false };
		if (selected) { constraints.deviceId = { exact: selected }; }
		navigator.mediaDevices.getUserMedia({ audio: constraints, video: false }).then(function (stream) {
			if (request !== micRequest) { stream.getTracks().forEach(function (track) { track.stop(); }); return; }
			local = makeSource("Local audio reference");
			local.stream = stream;
			attach(local, context.createMediaStreamSource(stream), context, "local");
			el("mic-status").textContent = "Connected: " + (stream.getAudioTracks()[0].label || "local audio") + ". Included as the reference for audio measurements.";
			el("connect-mic").disabled = false;
			return navigator.mediaDevices.enumerateDevices().then(function (devices) {
				if (request !== micRequest) { return; }
				el("mic-device").textContent = "";
				devices.forEach(function (device) {
					if (device.kind !== "audioinput") { return; }
					var option = document.createElement("option");
					option.value = device.deviceId;
					option.textContent = device.label || "Audio input";
					el("mic-device").appendChild(option);
				});
				var settings = stream.getAudioTracks()[0].getSettings();
				el("mic-device").value = settings.deviceId || selected;
				el("mic-device").disabled = false;
			});
		}).catch(function () {
			if (request !== micRequest) { return; }
			disconnectMic();
			say("Could not open local audio. Check microphone permission and whether another application has exclusive access.", true);
		});
	}
	function rebuildResults() {
		clearMeasurements("Measurement method changed. Take a fresh set of samples.");
	}
	el("load").addEventListener("click", loadCameras);
	el("capture").addEventListener("click", capture);
	el("cancel").addEventListener("click", function () { round = null; say("Clap capture cancelled; previous samples kept."); render(); });
	el("clear").addEventListener("click", function () { clearMeasurements("Measurements cleared. Capture a fresh set of claps."); });
	el("method-audio").addEventListener("change", rebuildResults);
	el("method-visual").addEventListener("change", rebuildResults);
	el("mode").addEventListener("change", function () {
		var value = el("mode").value;
		el("base-delay").max = value === "chunkbuffer" ? 180000 : 3000;
		el("mode-help").textContent = modeHelp[value];
		setupMessage(cameras.length && value !== mode ? "Press Load cameras to use this mode. The current previews and links still use " + mode + "." : "");
	});
	el("sync").addEventListener("change", function () {
		if (cameras.length && el("sync").checked !== compensate) { setupMessage("Press Load cameras to apply this change to the previews and links."); }
	});
	el("apply").addEventListener("click", function () {
		if (suggestions.length !== cameras.length || el("apply").disabled) { return; }
		cameras.forEach(function (camera, i) { applyDelay(camera, suggestions[i]); });
		changedDelay();
	});
	el("copy-all").addEventListener("click", function () {
		var text = cameras.map(function (camera) { return camera.name + "\n" + camera.output.value; }).join("\n\n");
		copy(text, el("copy-links"), el("copy-all"));
	});
	el("connect-mic").addEventListener("click", connectMic);
	el("mic-device").addEventListener("change", connectMic);
	el("disconnect-mic").addEventListener("click", disconnectMic);
	document.addEventListener("visibilitychange", function () {
		if (document.hidden && round) { round = null; say("Clap capture cancelled because the tab was hidden. Keep it visible while measuring.", true); render(); }
	});
	window.addEventListener("pagehide", function () {
		clearInterval(timer);
		clearInterval(discoveryTimer);
		cameras.forEach(detach);
		disconnectMic();
	});
	window.addEventListener("pageshow", function (event) {
		if (event.persisted) {
			timer = setInterval(tick, 10);
			discoveryTimer = setInterval(discover, 1500);
		}
	});
	timer = setInterval(tick, 10);
	discoveryTimer = setInterval(discover, 1500);
	render();
}());
