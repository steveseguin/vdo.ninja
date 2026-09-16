// Copyright (c) 2026 Steve Seguin. SPDX-License-Identifier: MIT
// Uses the local A-Frame distribution; see ../thirdparty/aframe.min.js.LICENSE.
(function () {
	"use strict";
	const $ = id => document.getElementById(id);
	const scene = document.querySelector("a-scene");
	const canvas = $("frames");
	const context = canvas.getContext("2d");
	const video = $("local-video");
	const iframe = $("connection");
	const origin = window.location.origin;
	const params = new URLSearchParams(window.location.search);
	let mode = "idle";
	let generation = 0;
	let objectURL = null;
	let pendingFrame = null;
	let decodingImage = false;
	let texture = null;
	let dirty = false;
	let soundEnabled = false;
	let waitTimer = null;
	let receivedFrame = false;

	function status(message) { $("status").textContent = message; }
	function panel(open) {
		$("source-panel").hidden = !open;
		$("sources").setAttribute("aria-expanded", String(open));
	}
	function closeFrame(frame) {
		if (frame && typeof frame.close === "function") frame.close();
	}
	function clearSource() {
		generation++;
		mode = "idle";
		clearTimeout(waitTimer);
		iframe.src = "about:blank";
		closeFrame(pendingFrame);
		pendingFrame = null;
		decodingImage = false;
		receivedFrame = false;
		video.pause();
		video.removeAttribute("src");
		video.load();
		if (objectURL) URL.revokeObjectURL(objectURL);
		objectURL = null;
		$("play").hidden = true;
		context.fillStyle = "#111827";
		context.fillRect(0, 0, canvas.width, canvas.height);
		dirty = true;
	}
	function draw(source, width, height) {
		if (!width || !height) return;
		const limit = Math.min(8192, scene.renderer ? scene.renderer.capabilities.maxTextureSize : 4096);
		const scale = Math.min(1, limit / Math.max(width, height));
		width = Math.max(1, Math.round(width * scale));
		height = Math.max(1, Math.round(height * scale));
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
			if (texture) texture.dispose();
			texture = null;
		}
		context.drawImage(source, 0, 0, width, height);
		dirty = true;
	}
	function liveFrameReady() {
		if (receivedFrame) return;
		receivedFrame = true;
		clearTimeout(waitTimer);
		status("Live 360° stream · Drag to look around.");
	}
	if (!window.AFRAME || !context) {
		status("The viewer could not load. Check that the local A-Frame files and WebGL are available.");
		return;
	}
	context.fillStyle = "#111827";
	context.fillRect(0, 0, canvas.width, canvas.height);
	dirty = true;
	// A single pending frame bounds memory use when rendering falls behind the stream.
	AFRAME.registerComponent("panorama-texture", {
		tick: function () {
			if (pendingFrame) {
				const frame = pendingFrame;
				pendingFrame = null;
				try {
					draw(frame, frame.displayWidth, frame.displayHeight);
					liveFrameReady();
				} catch (error) {
					status("Unable to display this video frame. Try reconnecting or another browser.");
				} finally { closeFrame(frame); }
			} else if (mode === "video" && video.readyState >= 2 && !video.paused) {
				draw(video, video.videoWidth, video.videoHeight);
			}
			const mesh = this.el.getObject3D("mesh");
			if (!mesh || !dirty) return;
			if (!texture) {
				texture = new AFRAME.THREE.CanvasTexture(canvas);
				texture.colorSpace = AFRAME.THREE.SRGBColorSpace;
				texture.minFilter = AFRAME.THREE.LinearFilter;
				texture.generateMipmaps = false;
				mesh.material.map = texture;
				mesh.material.needsUpdate = true;
			}
			texture.needsUpdate = true;
			dirty = false;
		}
	});
	window.addEventListener("message", event => {
		if (event.source !== iframe.contentWindow || event.origin !== origin) return;
		const data = event.data;
		if (!data || data.kind !== "video" || !data.frame) return;
		if (mode !== "live") { closeFrame(data.frame); return; }
		if (typeof VideoFrame !== "undefined" && data.frame instanceof VideoFrame) {
			closeFrame(pendingFrame);
			pendingFrame = data.frame;
		} else if (typeof data.frame === "string" && /^data:image\/(png|jpeg|webp);base64,/i.test(data.frame) && !decodingImage) {
			// The existing frame API can fall back to encoded images.
			decodingImage = true;
			const current = generation;
			const image = new Image();
			image.onload = () => {
				if (current !== generation) return;
				decodingImage = false;
				draw(image, image.naturalWidth, image.naturalHeight);
				liveFrameReady();
			};
			image.onerror = () => { if (current === generation) decodingImage = false; };
			image.src = data.frame;
		}
	});
	function connect() {
		const view = $("view").value.trim();
		if (!view) { panel(true); $("view").focus(); return; }
		if (!window.isSecureContext || typeof MediaStreamTrackProcessor === "undefined") {
			status("Live viewing needs HTTPS (or localhost) and video-frame processing support. Try Chrome or Edge, or open a local file.");
			return;
		}
		clearSource();
		mode = "live";
		const url = new URL("../", window.location.href);
		url.searchParams.set("view", view);
		url.searchParams.set("password", $("password").value);
		if (!$("password").value && !["password", "pw", "p"].some(key => params.has(key))) url.searchParams.delete("password");
		for (const key of ["room", "salt", "codec", "bitrate", "scale", "stereo", "turn", "stun", "wss"]) {
			if (params.has(key)) url.searchParams.set(key, params.get(key));
		}
		url.searchParams.set("sendframes", origin);
		url.searchParams.set("iframetarget", origin);
		for (const key of ["cleanoutput", "autostart"]) url.searchParams.set(key, "");
		if (!soundEnabled) url.searchParams.set("speakermuted", "");
		url.searchParams.set("label", "360_viewer");
		iframe.src = url.href;
		panel(false);
		status("Waiting for the 360° stream…");
		waitTimer = setTimeout(() => status("No video frames yet. Check the stream ID, password, sender, and browser support."), 20000);
	}
	$("connect-form").addEventListener("submit", event => { event.preventDefault(); connect(); });
	$("file").addEventListener("change", () => {
		const file = $("file").files[0];
		if (!file) return;
		if (!/^(image|video)\//.test(file.type)) { status("Choose a supported image or video file."); return; }
		clearSource();
		objectURL = URL.createObjectURL(file);
		panel(false);
		const current = generation;
		if (file.type.startsWith("image/")) {
			mode = "image";
			const image = new Image();
			image.onload = () => {
				if (current !== generation) return;
				draw(image, image.naturalWidth, image.naturalHeight);
				status("Local panorama · Drag to look around.");
			};
			image.onerror = () => { if (current === generation) status("This image could not be opened. Try a JPEG or PNG panorama."); };
			image.src = objectURL;
		} else {
			mode = "video";
			video.src = objectURL;
			video.muted = !soundEnabled;
			$("play").hidden = false;
			video.play().catch(() => {
				if (current === generation) status(video.error ? "This video could not be opened. Try a format supported by your browser." : "Press Play to start the local video.");
			});
		}
		$("file").value = "";
	});
	video.addEventListener("playing", () => { $("play").textContent = "Pause"; status("Local 360° video · Drag to look around."); });
	video.addEventListener("pause", () => { $("play").textContent = "Play"; });
	video.addEventListener("loadeddata", () => { if (mode === "video") draw(video, video.videoWidth, video.videoHeight); });
	video.addEventListener("error", () => { if (mode === "video") status("This video could not be opened. Try a format supported by your browser."); });
	$("play").addEventListener("click", () => {
		if (video.paused) video.play().catch(() => status("Unable to play this video."));
		else video.pause();
	});
	$("sound").addEventListener("click", () => {
		soundEnabled = !soundEnabled;
		video.muted = !soundEnabled;
		$("sound").textContent = soundEnabled ? "Mute sound" : "Enable sound";
		$("sound").setAttribute("aria-pressed", String(soundEnabled));
		if (mode === "live") iframe.contentWindow.postMessage({ speaker: soundEnabled }, origin);
	});
	$("sources").addEventListener("click", () => panel($("source-panel").hidden));
	$("stop").addEventListener("click", () => { clearSource(); panel(true); status("Stopped. Choose a stream or local file."); });
	function resetView() {
		const controls = $("camera").components["look-controls"];
		if (controls) { controls.pitchObject.rotation.x = 0; controls.yawObject.rotation.y = 0; }
		$("camera").setAttribute("camera", "fov", 80);
	}
	function zoom(delta) {
		const camera = $("camera");
		const fov = camera.getAttribute("camera").fov;
		camera.setAttribute("camera", "fov", Math.max(30, Math.min(110, fov + delta)));
	}
	$("reset").addEventListener("click", resetView);
	scene.addEventListener("wheel", event => { event.preventDefault(); zoom(Math.sign(event.deltaY) * 4); }, { passive: false });
	window.addEventListener("keydown", event => {
		if (/^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(event.target.tagName)) return;
		const controls = $("camera").components["look-controls"];
		if (!controls) return;
		if (event.key === "ArrowLeft") controls.yawObject.rotation.y += 0.1;
		else if (event.key === "ArrowRight") controls.yawObject.rotation.y -= 0.1;
		else if (event.key === "ArrowUp") controls.pitchObject.rotation.x = Math.min(Math.PI / 2, controls.pitchObject.rotation.x + 0.1);
		else if (event.key === "ArrowDown") controls.pitchObject.rotation.x = Math.max(-Math.PI / 2, controls.pitchObject.rotation.x - 0.1);
		else if (event.key === "+" || event.key === "=") zoom(-4);
		else if (event.key === "-") zoom(4);
		else if (event.key.toLowerCase() === "r") resetView();
		else return;
		event.preventDefault();
	});
	$("fullscreen").addEventListener("click", async () => {
		try {
			if (document.fullscreenElement) await document.exitFullscreen();
			else await document.documentElement.requestFullscreen();
		} catch (error) { status("Fullscreen is unavailable in this browser or embed."); }
	});
	document.addEventListener("fullscreenchange", () => { $("fullscreen").textContent = document.fullscreenElement ? "Exit fullscreen" : "Fullscreen"; });
	window.addEventListener("pagehide", () => { clearSource(); if (texture) texture.dispose(); });
	scene.addEventListener("render-target-loaded", () => {
		scene.canvas.setAttribute("tabindex", "0");
		scene.canvas.setAttribute("aria-label", "360-degree panorama. Drag or use arrow keys to look around.");
	});
	$("view").value = params.get("view") || params.get("v") || "";
	var password = params.get("password");
	if (password === null) password = params.get("pw");
	if (password === null) password = params.get("p");
	$("password").value = password === null ? "" : password;
	if ($("view").value) connect();
})();
