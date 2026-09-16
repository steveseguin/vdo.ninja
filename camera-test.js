class CameraTest {
	constructor() {
		this.localStream = null;
		this.peerConnections = [];
		this.selectedDeviceId = null;
		this.testResults = [];
		this.isRunning = false;
		this.stopRequested = false;

		// Move from smaller to larger modes so the camera does not bounce between extremes.
		this.resolutionConfigs = [
			{ width: 320, height: 240, name: "QVGA", orientation: "landscape" },
			{ width: 240, height: 320, name: "QVGA", orientation: "portrait" },
			{ width: 640, height: 480, name: "VGA", orientation: "landscape" },
			{ width: 480, height: 640, name: "VGA", orientation: "portrait" },
			{ width: 1280, height: 720, name: "720p", orientation: "landscape" },
			{ width: 720, height: 1280, name: "720p", orientation: "portrait" },
			{ width: 1920, height: 1080, name: "1080p", orientation: "landscape" },
			{ width: 1080, height: 1920, name: "1080p", orientation: "portrait" }
		];

		this.fpsTargets = [60, 30, 24, 15];
		this.mediaRequestTimeoutMs = 12000;
		this.videoStartTimeoutMs = 6000;
		this.measurementDurationMs = 1800;

		this.initializeElements();
		this.setupEventListeners();
		this.updateScanNote();
		this.enumerateCameras();
	}

	initializeElements() {
		this.elements = {
			cameraSelect: document.getElementById("cameraSelect"),
			scanMode: document.getElementById("scanMode"),
			scanDelay: document.getElementById("scanDelay"),
			scanNote: document.getElementById("scanNote"),
			secondaryActions: document.getElementById("secondaryActions"),
			startScan: document.getElementById("startScan"),
			stopScan: document.getElementById("stopScan"),
			startP2P: document.getElementById("startP2P"),
			exportResults: document.getElementById("exportResults"),
			previewGrid: document.getElementById("previewGrid"),
			localPlaceholder: document.getElementById("localPlaceholder"),
			localVideo: document.getElementById("localVideo"),
			remoteVideo: document.getElementById("remoteVideo"),
			remoteWrapper: document.getElementById("remoteWrapper"),
			status: document.getElementById("status"),
			progressContainer: document.getElementById("progressContainer"),
			progressBar: document.getElementById("progressBar"),
			resultsBody: document.getElementById("resultsBody"),
			currentStats: document.getElementById("currentStats"),
			currentRes: document.getElementById("currentRes"),
			currentFps: document.getElementById("currentFps"),
			currentMode: document.getElementById("currentMode")
		};
	}

	setupEventListeners() {
		this.elements.cameraSelect.addEventListener("change", () => this.onCameraChange());
		this.elements.scanMode.addEventListener("change", () => this.updateScanNote());
		this.elements.scanDelay.addEventListener("change", () => this.updateScanNote());
		this.elements.startScan.addEventListener("click", () => this.handlePrimaryAction());
		this.elements.stopScan.addEventListener("click", () => this.requestStop());
		this.elements.startP2P.addEventListener("click", () => this.startP2PTest());
		this.elements.exportResults.addEventListener("click", () => this.exportResults());
		window.addEventListener("pagehide", () => this.cleanup());

		if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
			navigator.mediaDevices.addEventListener("devicechange", () => {
				if (!this.isRunning) {
					this.enumerateCameras(true);
				}
			});
		}
	}

	async enumerateCameras(preserveSelection) {
		if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
			this.updateStatus("Camera access is unavailable in this browser.", "error");
			return;
		}

		try {
			const previousDeviceId = preserveSelection ? this.selectedDeviceId : null;
			const devices = await navigator.mediaDevices.enumerateDevices();
			// Devices without IDs are not selectable until camera permission is granted.
			const videoDevices = devices.filter(device => device.kind === "videoinput" && device.deviceId);

			this.elements.cameraSelect.textContent = "";
			const placeholder = document.createElement("option");
			placeholder.value = "";
			placeholder.textContent = videoDevices.length ? "Select a camera..." : "No cameras found";
			this.elements.cameraSelect.appendChild(placeholder);

			videoDevices.forEach((device, index) => {
				const option = document.createElement("option");
				option.value = device.deviceId;
				option.textContent = device.label || `Camera ${index + 1}`;
				this.elements.cameraSelect.appendChild(option);
			});

			if (previousDeviceId && videoDevices.some(device => device.deviceId === previousDeviceId)) {
				this.elements.cameraSelect.value = previousDeviceId;
				this.selectedDeviceId = previousDeviceId;
			} else if (!preserveSelection && videoDevices.length === 1) {
				this.elements.cameraSelect.value = videoDevices[0].deviceId;
				this.selectedDeviceId = videoDevices[0].deviceId;
				this.updateStatus("Camera found. Ready to run the recommended scan.");
			} else if (preserveSelection) {
				this.selectedDeviceId = null;
			}

			if (!videoDevices.length) {
				this.selectedDeviceId = null;
				this.updateStatus("No cameras are visible yet. Allow camera access to continue.");
			}

			this.updateActionButtons();
		} catch (error) {
			this.updateStatus(`Error enumerating cameras: ${error.message}`, "error");
		}
	}

	onCameraChange() {
		this.selectedDeviceId = this.elements.cameraSelect.value || null;
		this.releaseLocalStream();
		this.closePeerConnections();
		this.clearVideo(this.elements.remoteVideo);
		this.resetResults();

		if (this.selectedDeviceId) {
			this.updateStatus("Camera selected. Safe scan is ready.");
		} else {
			this.updateStatus("Select a camera to begin.");
		}

		this.updateActionButtons();
	}

	updateActionButtons() {
		const hasCamera = Boolean(this.selectedDeviceId);
		const hasListedCameras = this.elements.cameraSelect.options.length > 1;
		const cameraApiAvailable = Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
		const successfulResults = this.testResults.filter(result => result.status === "Success" || result.status === "Adjusted");
		const hasResults = this.testResults.length > 0;
		const hasSuccessfulResult = successfulResults.length > 0;

		this.elements.cameraSelect.disabled = this.isRunning;
		this.elements.scanMode.disabled = this.isRunning;
		this.elements.scanDelay.disabled = this.isRunning;
		this.elements.startScan.disabled = this.isRunning || !cameraApiAvailable || (!hasCamera && hasListedCameras);
		this.elements.startScan.hidden = this.isRunning;
		this.elements.startScan.textContent = !hasCamera ? (hasListedCameras ? "Select a camera above" : "Allow camera access") : hasResults ? "Scan selected camera again" : "Scan selected camera";
		this.elements.stopScan.hidden = !this.isRunning;
		this.elements.startP2P.disabled = this.isRunning || !hasCamera || !hasSuccessfulResult;
		this.elements.startP2P.textContent = hasSuccessfulResult ? `Test WebRTC (${successfulResults.length})` : "Test WebRTC";
		this.elements.exportResults.disabled = this.isRunning || !hasResults;
		this.elements.secondaryActions.hidden = this.isRunning || !hasResults;
	}

	updateScanNote() {
		const seconds = Math.round(this.getRecoveryDelay() / 1000);
		const pauseText = `${seconds} second${seconds === 1 ? "" : "s"}`;
		const notes = {
			safe: `Recommended tests 480p, 720p, and 1080p at 30 fps. The camera is turned off for ${pauseText} between each mode.`,
			orientation: `Orientation check tests eight landscape and portrait sizes at 30 fps, with a ${pauseText} hardware pause between tests.`,
			full: `Extended runs 32 combinations. Some cameras cannot tolerate this many changes; use a longer pause if the camera is sensitive.`
		};
		this.elements.scanNote.textContent = notes[this.elements.scanMode.value] || notes.safe;
	}

	getRecoveryDelay() {
		const delay = parseInt(this.elements.scanDelay.value, 10);
		return Number.isFinite(delay) ? Math.max(1000, delay) : 3000;
	}

	getSafeConfigs() {
		return this.resolutionConfigs.filter(config => config.orientation === "landscape" && config.width >= 640);
	}

	buildResolutionPlan() {
		const mode = this.elements.scanMode.value;
		const configs = mode === "safe" ? this.getSafeConfigs() : this.resolutionConfigs;
		const fpsTargets = mode === "full" ? this.fpsTargets : [30];
		const plan = [];

		configs.forEach(config => {
			fpsTargets.forEach(fps => {
				plan.push({ config: config, fps: fps });
			});
		});

		return plan;
	}

	async handlePrimaryAction() {
		if (!this.selectedDeviceId) {
			await this.requestCameraAccess();
			return;
		}
		await this.startResolutionScan();
	}

	async requestCameraAccess() {
		if (this.isRunning) {
			return;
		}

		this.isRunning = true;
		this.stopRequested = false;
		this.updateActionButtons();
		this.updateStatus("Allow camera access in the browser prompt. The preview will close immediately afterward.");

		try {
			this.localStream = await this.getUserMediaWithTimeout({ video: true, audio: false });
			this.releaseLocalStream();
			await this.enumerateCameras(false);

			if (this.selectedDeviceId) {
				this.updateStatus("Camera access granted. Ready to run the recommended scan.", "success");
			} else if (this.elements.cameraSelect.options.length > 1) {
				this.updateStatus("Camera access granted. Select the camera you want to test.", "success");
			}
		} catch (error) {
			if (this.stopRequested) {
				this.updateStatus("Camera access request stopped. The camera has been released.");
			} else {
				this.updateStatus(this.describeError(error), "error");
			}
		} finally {
			this.releaseLocalStream();
			this.isRunning = false;
			this.stopRequested = false;
			this.updateActionButtons();
		}
	}

	async startResolutionScan() {
		await this.runCapturePlan(this.buildResolutionPlan(), "Resolution scan");
	}

	async runCapturePlan(plan, label) {
		if (this.isRunning || !this.selectedDeviceId) {
			return;
		}

		this.resetResults();
		this.isRunning = true;
		this.stopRequested = false;
		this.updateActionButtons();
		this.showProgress(true);
		this.elements.previewGrid.hidden = false;
		this.updateProgress(0);
		this.updateStatus(`${label} starting with ${plan.length} tests...`, "success");

		let completedTests = 0;
		try {
			for (let index = 0; index < plan.length; index += 1) {
				if (this.stopRequested) {
					break;
				}

				if (index > 0) {
					// Fully release the hardware before asking the Android camera service for another mode.
					const recoveryDelay = this.getRecoveryDelay();
					this.updateStatus(`Camera released. Waiting ${Math.round(recoveryDelay / 1000)} seconds before test ${index + 1} of ${plan.length}...`);
					await this.waitWithCancellation(recoveryDelay);
				}

				if (this.stopRequested) {
					break;
				}

				const item = plan[index];
				this.updateStatus(`${label}: test ${index + 1} of ${plan.length} — ${item.config.width}x${item.config.height} at ${item.fps} fps`);
				await this.testConfiguration(item.config, item.fps);
				completedTests += 1;
				this.updateProgress((completedTests / plan.length) * 100);
			}
		} finally {
			this.releaseLocalStream();
			this.elements.previewGrid.hidden = true;
			this.isRunning = false;
			this.showProgress(false);
			this.updateActionButtons();

			if (this.stopRequested) {
				this.updateStatus(`${label} stopped safely after ${completedTests} of ${plan.length} tests.`);
			} else {
				this.updateStatus(`${label} complete. The camera has been released.`, "success");
			}
			this.stopRequested = false;
			this.enumerateCameras(true);
		}
	}

	async testConfiguration(config, targetFps) {
		const requestedResolution = `${config.width}x${config.height}`;
		let result = null;

		try {
			const constraints = {
				audio: false,
				video: {
					deviceId: { exact: this.selectedDeviceId },
					width: { exact: config.width },
					height: { exact: config.height },
					frameRate: { exact: targetFps }
				}
			};

			this.updateCurrentStats(config, targetFps, "Camera capture");
			this.localStream = await this.getUserMediaWithTimeout(constraints);

			if (this.stopRequested) {
				return;
			}

			await this.attachStream(this.elements.localVideo, this.localStream);
			await this.waitWithCancellation(750);

			if (this.stopRequested) {
				return;
			}

			const track = this.localStream.getVideoTracks()[0];
			if (!track) {
				throw this.createError("NotReadableError", "The camera did not provide a video track.");
			}

			const measurement = await this.measureFPS(this.elements.localVideo, track, this.measurementDurationMs);
			const settings = track.getSettings ? track.getSettings() : {};
			const actualWidth = this.elements.localVideo.videoWidth || settings.width || 0;
			const actualHeight = this.elements.localVideo.videoHeight || settings.height || 0;
			const reportedWidth = settings.width || 0;
			const reportedHeight = settings.height || 0;
			const actualResolution = actualWidth && actualHeight ? `${actualWidth}x${actualHeight}` : "-";
			const actualOrientation = this.getOrientation(actualWidth, actualHeight);
			const details = [];
			const resolutionMatched = Math.abs(actualWidth - config.width) <= 2 && Math.abs(actualHeight - config.height) <= 2;
			const fpsTolerance = Math.max(2.5, targetFps * 0.12);
			const fpsMatched = measurement.fps > 0 && Math.abs(measurement.fps - targetFps) <= fpsTolerance;

			if (!resolutionMatched) {
				details.push(`Browser delivered ${actualResolution} instead of the exact request.`);
			}
			if (reportedWidth && reportedHeight && (reportedWidth !== actualWidth || reportedHeight !== actualHeight)) {
				details.push(`The track reports ${reportedWidth}x${reportedHeight}, while the video element presents ${actualResolution}.`);
			}
			if (!fpsMatched) {
				details.push(`Frame rate differed from the ${targetFps} fps request.`);
			}
			if (measurement.source === "settings") {
				details.push("The browser exposed only its reported frame rate; presented frames could not be counted.");
			}
			if (settings.resizeMode && settings.resizeMode !== "none") {
				details.push(`Resize mode: ${settings.resizeMode}.`);
			}
			if (measurement.fps > 0 && actualWidth && actualHeight) {
				details.push(`VDO.Ninja options: &width=${config.width}&height=${config.height}&mfr=${targetFps}`);
			}

			result = {
				requestedResolution: requestedResolution,
				actualResolution: actualResolution,
				requestedOrientation: config.orientation,
				actualOrientation: actualOrientation,
				requestedFps: targetFps,
				actualFps: measurement.fps,
				fpsSource: measurement.source,
				p2pFps: "-",
				status: measurement.fps > 0 && actualWidth && actualHeight ? (resolutionMatched && fpsMatched ? "Success" : "Adjusted") : "No Frames",
				details: details.join(" "),
				testedAt: new Date().toISOString()
			};
		} catch (error) {
			if (this.stopRequested) {
				return;
			}

			result = {
				requestedResolution: requestedResolution,
				actualResolution: "-",
				requestedOrientation: config.orientation,
				actualOrientation: "-",
				requestedFps: targetFps,
				actualFps: 0,
				fpsSource: "none",
				p2pFps: "-",
				status: this.getFailureStatus(error),
				details: this.describeError(error),
				testedAt: new Date().toISOString()
			};
		} finally {
			this.releaseLocalStream();
		}

		if (result) {
			this.testResults.push(result);
			this.renderResults();
			this.updateActionButtons();
		}
	}

	async getUserMediaWithTimeout(constraints) {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			throw this.createError("NotSupportedError", "Camera access is unavailable in this browser.");
		}

		let abandoned = false;
		let timedOut = false;
		let timeoutId = null;
		let cancellationInterval = null;
		const mediaRequest = navigator.mediaDevices.getUserMedia(constraints);
		const timeout = new Promise((resolve, reject) => {
			timeoutId = setTimeout(() => {
				timedOut = true;
				reject(this.createError("TimeoutError", `The camera did not respond within ${Math.round(this.mediaRequestTimeoutMs / 1000)} seconds.`));
			}, this.mediaRequestTimeoutMs);
		});
		const cancellation = new Promise((resolve, reject) => {
			cancellationInterval = setInterval(() => {
				if (this.stopRequested) {
					abandoned = true;
					reject(this.createError("AbortError", "The camera test was stopped."));
				}
			}, 100);
		});

		try {
			return await Promise.race([mediaRequest, timeout, cancellation]);
		} finally {
			clearTimeout(timeoutId);
			clearInterval(cancellationInterval);
			if (timedOut || abandoned) {
				// getUserMedia cannot be cancelled; stop a stream that arrives after we give up waiting.
				mediaRequest.then(stream => this.stopStream(stream)).catch(() => {});
			}
		}
	}

	async attachStream(video, stream) {
		video.srcObject = stream;
		if (video === this.elements.localVideo) {
			this.elements.localPlaceholder.hidden = true;
		}
		try {
			await video.play();
		} catch (error) {}
		await this.waitForVideoReady(video, this.videoStartTimeoutMs);
	}

	waitForVideoReady(video, timeoutMs) {
		return new Promise((resolve, reject) => {
			if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
				resolve();
				return;
			}

			let settled = false;
			let timeoutId = null;
			let cancellationInterval = null;
			const cleanup = () => {
				clearTimeout(timeoutId);
				clearInterval(cancellationInterval);
				video.removeEventListener("loadedmetadata", checkReady);
				video.removeEventListener("canplay", checkReady);
				video.removeEventListener("playing", checkReady);
			};
			const checkReady = () => {
				if (!settled && video.readyState >= 2 && video.videoWidth && video.videoHeight) {
					settled = true;
					cleanup();
					resolve();
				}
			};
			timeoutId = setTimeout(() => {
				if (!settled) {
					settled = true;
					cleanup();
					reject(this.createError("TimeoutError", "Timed out waiting for the camera to produce video."));
				}
			}, timeoutMs);
			cancellationInterval = setInterval(() => {
				if (!settled && this.stopRequested) {
					settled = true;
					cleanup();
					reject(this.createError("AbortError", "The camera test was stopped."));
				}
			}, 100);

			video.addEventListener("loadedmetadata", checkReady);
			video.addEventListener("canplay", checkReady);
			video.addEventListener("playing", checkReady);
			checkReady();
		});
	}

	measureFPS(video, track, duration) {
		return new Promise(resolve => {
			let finished = false;
			let callbackId = 0;
			let frameCount = 0;
			let lastPresentedFrames = null;
			const startedAt = performance.now();
			const startingPlaybackFrames = this.readPlaybackFrameCount(video);

			const finish = () => {
				if (finished) {
					return;
				}
				finished = true;
				if (callbackId && video.cancelVideoFrameCallback) {
					try {
						video.cancelVideoFrameCallback(callbackId);
					} catch (error) {}
				}

				const elapsed = Math.max(performance.now() - startedAt, 1);
				let countedFrames = frameCount;
				let source = frameCount ? "presented frames" : "none";
				const endingPlaybackFrames = this.readPlaybackFrameCount(video);

				if (!countedFrames && startingPlaybackFrames !== null && endingPlaybackFrames !== null) {
					countedFrames = Math.max(0, endingPlaybackFrames - startingPlaybackFrames);
					source = countedFrames ? "playback frames" : "none";
				}

				let fps = countedFrames ? (countedFrames * 1000) / elapsed : 0;
				if (!fps && track && track.getSettings) {
					const settings = track.getSettings();
					if (settings && Number.isFinite(settings.frameRate)) {
						fps = settings.frameRate;
						source = "settings";
					}
				}

				resolve({ fps: Math.round(fps * 10) / 10, source: source });
			};

			if (video.requestVideoFrameCallback) {
				const countFrame = (now, metadata) => {
					if (finished) {
						return;
					}
					if (metadata && Number.isFinite(metadata.presentedFrames)) {
						if (lastPresentedFrames === null) {
							frameCount += 1;
						} else {
							frameCount += Math.max(1, metadata.presentedFrames - lastPresentedFrames);
						}
						lastPresentedFrames = metadata.presentedFrames;
					} else {
						frameCount += 1;
					}

					if (this.stopRequested || now - startedAt >= duration) {
						finish();
						return;
					}
					callbackId = video.requestVideoFrameCallback(countFrame);
				};
				callbackId = video.requestVideoFrameCallback(countFrame);
			}

			setTimeout(finish, duration + 250);
		});
	}

	readPlaybackFrameCount(video) {
		if (video.getVideoPlaybackQuality) {
			const quality = video.getVideoPlaybackQuality();
			if (quality && Number.isFinite(quality.totalVideoFrames)) {
				return quality.totalVideoFrames;
			}
		}
		if (Number.isFinite(video.webkitDecodedFrameCount)) {
			return video.webkitDecodedFrameCount;
		}
		return null;
	}

	async startP2PTest() {
		if (this.isRunning || !this.selectedDeviceId) {
			return;
		}

		const resultIndexes = [];
		this.testResults.forEach((result, index) => {
			if (result.status === "Success" || result.status === "Adjusted") {
				resultIndexes.push(index);
			}
		});
		if (!resultIndexes.length) {
			this.updateStatus("Run a successful capture scan before starting P2P tests.", "error");
			return;
		}

		this.isRunning = true;
		this.stopRequested = false;
		this.elements.remoteWrapper.hidden = false;
		this.elements.previewGrid.hidden = false;
		this.elements.previewGrid.classList.add("has-remote");
		this.showProgress(true);
		this.updateProgress(0);
		this.updateActionButtons();

		let completedTests = 0;
		try {
			for (let index = 0; index < resultIndexes.length; index += 1) {
				if (this.stopRequested) {
					break;
				}
				if (index > 0) {
					const recoveryDelay = this.getRecoveryDelay();
					this.updateStatus(`Camera released. Waiting ${Math.round(recoveryDelay / 1000)} seconds before P2P test ${index + 1} of ${resultIndexes.length}...`);
					await this.waitWithCancellation(recoveryDelay);
				}
				if (this.stopRequested) {
					break;
				}

				const resultIndex = resultIndexes[index];
				this.updateStatus(`P2P test ${index + 1} of ${resultIndexes.length}...`);
				await this.runP2PTest(this.testResults[resultIndex]);
				completedTests += 1;
				this.updateProgress((completedTests / resultIndexes.length) * 100);
			}
		} finally {
			this.releaseLocalStream();
			this.closePeerConnections();
			this.clearVideo(this.elements.remoteVideo);
			this.elements.remoteWrapper.hidden = true;
			this.elements.previewGrid.hidden = true;
			this.elements.previewGrid.classList.remove("has-remote");
			this.isRunning = false;
			this.showProgress(false);
			this.updateActionButtons();
			this.updateStatus(this.stopRequested ? `P2P tests stopped safely after ${completedTests} of ${resultIndexes.length}.` : "P2P tests complete. The camera has been released.", this.stopRequested ? "" : "success");
			this.stopRequested = false;
		}
	}

	async runP2PTest(result) {
		let localPC = null;
		let remotePC = null;
		try {
			const dimensions = result.requestedResolution.split("x").map(Number);
			const constraints = {
				audio: false,
				video: {
					deviceId: { exact: this.selectedDeviceId },
					width: { exact: dimensions[0] },
					height: { exact: dimensions[1] },
					frameRate: { exact: result.requestedFps }
				}
			};

			this.updateCurrentStats({ width: dimensions[0], height: dimensions[1] }, result.requestedFps, "P2P Test");
			this.localStream = await this.getUserMediaWithTimeout(constraints);
			await this.attachStream(this.elements.localVideo, this.localStream);
			await this.waitWithCancellation(750);
			if (this.stopRequested) {
				return;
			}

			localPC = new RTCPeerConnection();
			remotePC = new RTCPeerConnection();
			this.peerConnections = [localPC, remotePC];

			localPC.onicecandidate = event => {
				if (event.candidate) {
					remotePC.addIceCandidate(event.candidate).catch(() => {});
				}
			};
			remotePC.onicecandidate = event => {
				if (event.candidate) {
					localPC.addIceCandidate(event.candidate).catch(() => {});
				}
			};
			remotePC.ontrack = event => {
				if (event.streams && event.streams[0]) {
					this.elements.remoteVideo.srcObject = event.streams[0];
					this.elements.remoteVideo.play().catch(() => {});
				}
			};

			this.localStream.getTracks().forEach(localTrack => localPC.addTrack(localTrack, this.localStream));

			const offer = await localPC.createOffer();
			await localPC.setLocalDescription(offer);
			await remotePC.setRemoteDescription(offer);
			const answer = await remotePC.createAnswer();
			await remotePC.setLocalDescription(answer);
			await localPC.setRemoteDescription(answer);

			await this.waitForVideoReady(this.elements.remoteVideo, 8000);
			await this.waitWithCancellation(500);
			const measurement = await this.measureFPS(this.elements.remoteVideo, null, this.measurementDurationMs);
			result.p2pFps = measurement.fps || 0;
		} catch (error) {
			if (!this.stopRequested) {
				result.p2pFps = "Error";
				result.details = `${result.details ? `${result.details} ` : ""}P2P: ${this.describeError(error)}`;
			}
		} finally {
			this.closePeerConnections();
			this.clearVideo(this.elements.remoteVideo);
			this.releaseLocalStream();
			this.renderResults();
		}
	}

	requestStop() {
		if (!this.isRunning) {
			return;
		}
		this.stopRequested = true;
		this.updateStatus("Stopping safely and releasing the camera...");
		this.releaseLocalStream();
		this.closePeerConnections();
		this.clearVideo(this.elements.remoteVideo);
		this.elements.remoteWrapper.hidden = true;
		this.elements.previewGrid.hidden = true;
		this.elements.previewGrid.classList.remove("has-remote");
	}

	async waitWithCancellation(duration) {
		const deadline = performance.now() + duration;
		while (!this.stopRequested && performance.now() < deadline) {
			await new Promise(resolve => setTimeout(resolve, Math.min(100, Math.max(0, deadline - performance.now()))));
		}
		return !this.stopRequested;
	}

	stopStream(stream) {
		if (!stream) {
			return;
		}
		stream.getTracks().forEach(track => {
			try {
				track.stop();
			} catch (error) {}
		});
	}

	releaseLocalStream() {
		const stream = this.localStream;
		this.localStream = null;
		this.clearVideo(this.elements.localVideo);
		this.elements.localPlaceholder.hidden = false;
		this.stopStream(stream);
	}

	closePeerConnections() {
		this.peerConnections.forEach(connection => {
			try {
				connection.close();
			} catch (error) {}
		});
		this.peerConnections = [];
	}

	clearVideo(video) {
		try {
			video.pause();
		} catch (error) {}
		video.srcObject = null;
	}

	cleanup() {
		this.stopRequested = true;
		this.releaseLocalStream();
		this.closePeerConnections();
		this.clearVideo(this.elements.remoteVideo);
		this.elements.remoteWrapper.hidden = true;
		this.elements.previewGrid.hidden = true;
		this.elements.previewGrid.classList.remove("has-remote");
	}

	getOrientation(width, height) {
		if (!width || !height) {
			return "-";
		}
		if (width === height) {
			return "square";
		}
		return width > height ? "landscape" : "portrait";
	}

	createError(name, message, constraint) {
		const error = new Error(message);
		error.name = name;
		if (constraint) {
			error.constraint = constraint;
		}
		return error;
	}

	getFailureStatus(error) {
		if (!error) {
			return "Failed";
		}
		if (error.name === "OverconstrainedError" || error.name === "ConstraintNotSatisfiedError" || error.name === "NotFoundError") {
			return "Not Supported";
		}
		if (error.name === "TimeoutError") {
			return "Timed Out";
		}
		if (error.name === "NotReadableError" || error.name === "AbortError") {
			return "Camera Error";
		}
		if (error.name === "NotAllowedError" || error.name === "SecurityError") {
			return "Permission Denied";
		}
		return "Failed";
	}

	describeError(error) {
		if (!error) {
			return "Unknown camera error.";
		}
		const constraint = error.constraint ? ` (${error.constraint})` : "";
		return `${error.name || "Error"}${constraint}: ${error.message || "Unknown camera error"}`;
	}

	updateStatus(message, type) {
		this.elements.status.textContent = message;
		this.elements.status.className = "status";
		if (type) {
			this.elements.status.classList.add(type);
		}
	}

	showProgress(show) {
		this.elements.progressContainer.hidden = !show;
	}

	updateProgress(percentage) {
		this.elements.progressBar.style.width = `${percentage}%`;
		this.elements.progressBar.setAttribute("aria-valuenow", String(Math.round(percentage)));
	}

	updateCurrentStats(config, fps, mode) {
		this.elements.currentStats.hidden = false;
		this.elements.currentRes.textContent = `${config.width}x${config.height}`;
		this.elements.currentFps.textContent = `${fps} fps`;
		this.elements.currentMode.textContent = mode;
	}

	resetResults() {
		this.testResults = [];
		this.renderResults();
		this.updateActionButtons();
	}

	renderResults() {
		this.elements.resultsBody.textContent = "";
		if (!this.testResults.length) {
			const row = document.createElement("tr");
			const cell = document.createElement("td");
			cell.colSpan = 8;
			cell.className = "empty-results";
			cell.textContent = "No tests run yet.";
			row.appendChild(cell);
			this.elements.resultsBody.appendChild(row);
			return;
		}

		this.testResults.forEach(result => {
			const orientation = result.actualOrientation && result.actualOrientation !== "-" && result.actualOrientation !== result.requestedOrientation ? `${result.requestedOrientation} → ${result.actualOrientation}` : result.requestedOrientation;
			const measuredFps = result.actualFps ? `${result.actualFps}${result.fpsSource === "settings" ? " (reported)" : ""}` : "-";
			const labels = ["Requested", "Actual video", "Orientation", "Target FPS", "Measured FPS", "WebRTC FPS", "Result", "Notes"];
			const values = [result.requestedResolution, result.actualResolution, orientation, result.requestedFps, measuredFps, result.p2pFps, result.status, result.details || "-"];
			const row = document.createElement("tr");
			values.forEach((value, index) => {
				const cell = document.createElement("td");
				cell.textContent = String(value);
				cell.dataset.label = labels[index];
				if (labels[index] === "Result") {
					cell.className = `result-status status-${String(result.status).toLowerCase().replace(/\s+/g, "-")}`;
				}
				row.appendChild(cell);
			});
			this.elements.resultsBody.appendChild(row);
		});
	}

	escapeCsv(value) {
		const text = value === null || typeof value === "undefined" ? "" : String(value);
		return `"${text.replace(/"/g, '""')}"`;
	}

	exportResults() {
		if (!this.testResults.length) {
			this.updateStatus("There are no test results to export.", "error");
			return;
		}

		const selectedOption = this.elements.cameraSelect.options[this.elements.cameraSelect.selectedIndex];
		const cameraName = selectedOption ? selectedOption.textContent : "Unknown camera";
		const rows = [["Camera", "Browser", "Requested Resolution", "Actual Resolution", "Requested Orientation", "Actual Orientation", "Requested FPS", "Measured FPS", "FPS Source", "P2P FPS", "Status", "Details", "Tested At"]];

		this.testResults.forEach(result => {
			rows.push([cameraName, navigator.userAgent, result.requestedResolution, result.actualResolution, result.requestedOrientation, result.actualOrientation, result.requestedFps, result.actualFps, result.fpsSource, result.p2pFps, result.status, result.details, result.testedAt]);
		});

		const csvContent = rows.map(row => row.map(value => this.escapeCsv(value)).join(",")).join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `camera-test-results-${new Date().toISOString().slice(0, 10)}.csv`;
		anchor.click();
		setTimeout(() => URL.revokeObjectURL(url), 0);
		this.updateStatus("Results exported successfully.", "success");
	}
}

document.addEventListener("DOMContentLoaded", () => {
	new CameraTest();
});
