const root = document.getElementById("studio-root");
const roomForm = document.getElementById("room-form");
const roomNameInput = document.getElementById("room-name");
const roomPasswordInput = document.getElementById("room-password");
const randomRoomButton = document.getElementById("random-room");
const directorFrame = document.getElementById("director-frame");
const stage = document.getElementById("stage");
const stageOverlay = document.getElementById("stage-overlay");
const stageBg = document.getElementById("stage-bg");
const stageEmpty = document.getElementById("stage-empty");
const boxInspector = document.getElementById("box-inspector");
const boxInspectorTitle = document.getElementById("box-inspector-title");
const sceneList = document.getElementById("scene-list");
const sourceList = document.getElementById("source-list");
const activeSceneTitle = document.getElementById("active-scene-title");
const connectionStatus = document.getElementById("connection-status");
const joinSoundButton = document.getElementById("toggle-join-sound");
const toast = document.getElementById("toast");

const params = new URLSearchParams(window.location.search);
const DEFAULT_POLL_MS = 1400;
const REQUEST_TIMEOUT_MS = 3500;
const STORAGE_PREFIX = "studio.session.";
const JOIN_SOUND_STORAGE_KEY = "studio.joinSound";
const TEMPLATE_VERSION = 1;
const APP_STATE_VERSION = 4;
const THUMBNAIL_REFRESH_MS = 5000;
const DISCONNECTED_SOURCE_RETENTION_MS = 30000;
const SAMPLE_SOURCES = [
	{ label: "Sample Host", color: "#2457d6", loudness: 42 },
	{ label: "Sample Guest", color: "#13a66f", loudness: 28 },
	{ label: "Screen Share", color: "#8b5cf6", loudness: 0, screenSharing: true }
];

let storedJoinSound = false;
try {
	storedJoinSound = localStorage.getItem(JOIN_SOUND_STORAGE_KEY) === "1";
} catch (error) {
	storedJoinSound = false;
}

const state = {
	room: params.get("room") || params.get("r") || params.get("director") || params.get("dir") || "",
	password: params.get("password") || params.get("pass") || params.get("pw") || "",
	iframeReady: false,
	sourceSnapshotReady: false,
	pollTimer: null,
	thumbnailTimer: null,
	saveTimer: null,
	audioContext: null,
	joinSound: storedJoinSound,
	requestId: 0,
	pendingRequests: new Map(),
	activeSceneId: "auto",
	lastAppliedSceneId: null,
	selectedBoxId: null,
	pendingDeleteSceneId: null,
	pendingDeleteTimer: null,
	dragOperation: null,
	sources: new Map(),
	placeholders: [],
	scenes: [],
	output: {
		status: "No output window opened",
		mode: "idle"
	},
	brand: {
		background: "#05070d",
		radius: 10,
		labels: true
	}
};

const defaultScenes = [
	{
		id: "scene_1",
		name: "Scene 1",
		auto: true,
		layout: []
	}
];

function clone(value) {
	return JSON.parse(JSON.stringify(value));
}

function createId(prefix) {
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeRoomName(value) {
	return (value || "")
		.trim()
		.replace(/[^a-zA-Z0-9_.-]/g, "")
		.slice(0, 80);
}

function randomRoomName() {
	return `show-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36).slice(-4)}`;
}

function getActiveScene() {
	return state.scenes.find(scene => scene.id === state.activeSceneId) || state.scenes[0];
}

function scheduleSave() {
	clearTimeout(state.saveTimer);
	state.saveTimer = setTimeout(saveSession, 200);
}

function sessionStorageKey() {
	return `${STORAGE_PREFIX}${state.room || "default"}`;
}

function saveSession() {
	if (!state.room) {
		return;
	}
	const payload = {
		activeSceneId: state.activeSceneId,
		lastAppliedSceneId: state.lastAppliedSceneId,
		version: APP_STATE_VERSION,
		scenes: state.scenes,
		brand: state.brand,
		placeholders: state.placeholders
	};
	try {
		localStorage.setItem(sessionStorageKey(), JSON.stringify(payload));
	} catch (error) {
		console.warn("Unable to save studio session", error);
	}
}

function loadSession() {
	clearPendingSceneDelete(false);
	state.scenes = clone(defaultScenes);
	state.activeSceneId = "scene_1";
	state.placeholders = [];
	try {
		const saved = JSON.parse(localStorage.getItem(sessionStorageKey()) || "null");
		if (saved && saved.version === APP_STATE_VERSION && Array.isArray(saved.scenes) && saved.scenes.length) {
			state.scenes = saved.scenes;
			state.activeSceneId = saved.activeSceneId || state.scenes[0].id;
			state.lastAppliedSceneId = saved.lastAppliedSceneId || null;
			state.placeholders = Array.isArray(saved.placeholders) ? saved.placeholders : [];
			state.brand = { ...state.brand, ...(saved.brand || {}) };
		}
	} catch (error) {
		console.warn("Unable to load studio session", error);
	}
	if (!getActiveScene()) {
		state.activeSceneId = state.scenes[0].id;
	}
	if (state.lastAppliedSceneId && !state.scenes.some(scene => scene.id === state.lastAppliedSceneId)) {
		state.lastAppliedSceneId = null;
	}
}

function normalizeTemplateScene(scene, index) {
	const name =
		String(scene.name || `Scene ${index + 1}`)
			.trim()
			.slice(0, 48) || `Scene ${index + 1}`;
	const layout = Array.isArray(scene.layout)
		? scene.layout.slice(0, 16).map((item, itemIndex) => ({
				id: createId("box"),
				streamID: typeof item.streamID === "string" ? item.streamID : "",
				slot: Number.isFinite(parseInt(item.slot, 10)) ? parseInt(item.slot, 10) : itemIndex,
				label: typeof item.label === "string" ? item.label.slice(0, 80) : "",
				x: clamp(parseFloat(item.x) || 0, 0, 99),
				y: clamp(parseFloat(item.y) || 0, 0, 99),
				w: clamp(parseFloat(item.w) || 40, 7, 100),
				h: clamp(parseFloat(item.h) || 36, 8, 100),
				z: parseInt(item.z, 10) || itemIndex + 1,
				cover: item.cover !== false
			}))
		: [];
	layout.forEach(item => {
		item.x = clamp(item.x, 0, 93);
		item.y = clamp(item.y, 0, 92);
		item.w = clamp(item.w, 7, 100 - item.x);
		item.h = clamp(item.h, 8, 100 - item.y);
	});
	return {
		id: createId("scene"),
		name,
		auto: Boolean(scene.auto) && !layout.length,
		layout
	};
}

function exportTemplate() {
	const payload = {
		app: "vdo.ninja.studio",
		version: TEMPLATE_VERSION,
		exportedAt: new Date().toISOString(),
		scenes: state.scenes,
		brand: state.brand,
		placeholders: state.placeholders
	};
	const blob = new Blob([JSON.stringify(payload, null, "\t")], { type: "application/json" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${state.room || "studio"}-template.json`;
	link.click();
	URL.revokeObjectURL(link.href);
	showToast("Template exported");
}

function importTemplateFile(file) {
	if (!file) {
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		try {
			const payload = JSON.parse(reader.result);
			if (!payload || !Array.isArray(payload.scenes) || !payload.scenes.length) {
				throw new Error("Missing scenes");
			}
			clearPendingSceneDelete(false);
			state.scenes = payload.scenes.slice(0, 24).map(normalizeTemplateScene);
			state.activeSceneId = state.scenes[0].id;
			state.lastAppliedSceneId = null;
			state.selectedBoxId = null;
			if (payload.brand && typeof payload.brand === "object") {
				state.brand = {
					background: /^#[0-9a-f]{6}$/i.test(payload.brand.background || "") ? payload.brand.background : state.brand.background,
					radius: clamp(parseInt(payload.brand.radius, 10) || 0, 0, 32),
					labels: payload.brand.labels !== false
				};
			}
			if (Array.isArray(payload.placeholders)) {
				state.placeholders = payload.placeholders.slice(0, 24).map((item, index) => ({
					streamID: createId("placeholder"),
					label: String(item.label || `Guest Slot ${index + 1}`).slice(0, 80),
					slot: parseInt(item.slot, 10) || index + 1,
					placeholder: true
				}));
			}
			renderAll();
			applySceneToFrame();
			scheduleSave();
			showToast("Template imported");
		} catch (error) {
			showToast("Invalid template file");
		}
		document.getElementById("template-file").value = "";
	};
	reader.readAsText(file);
}

function showToast(message) {
	toast.textContent = message;
	toast.dataset.show = "true";
	clearTimeout(toast.hideTimer);
	toast.hideTimer = setTimeout(() => {
		toast.dataset.show = "false";
	}, 1800);
}

function setStatus(text, mode = "idle") {
	connectionStatus.textContent = text;
	connectionStatus.dataset.state = mode;
}

function setOutputStatus(text, mode = "idle") {
	state.output.status = text;
	state.output.mode = mode;
	const status = document.getElementById("output-status");
	if (!status) {
		return;
	}
	status.dataset.state = mode;
	const value = status.querySelector(".output-status__value");
	if (value) {
		value.textContent = text;
	}
}

function buildBaseUrl() {
	const base = new URL("../", window.location.href);
	return base.href.replace(/\/$/, "");
}

function currentExtraParams() {
	const extra = new URLSearchParams(window.location.search);
	["room", "r", "director", "dir", "password", "pass", "pw"].forEach(key => extra.delete(key));
	return extra;
}

function appendParams(url, extra) {
	for (const [key, value] of extra.entries()) {
		if (!url.searchParams.has(key)) {
			url.searchParams.set(key, value);
		}
	}
}

function buildDirectorUrl() {
	const url = new URL("../index.html", window.location.href);
	const extra = currentExtraParams();
	url.searchParams.set("ltb", extra.has("ltb") ? extra.get("ltb") : "1500");
	url.searchParams.set("nocontrolbarspace", "");
	url.searchParams.set("transparent", "");
	url.searchParams.set("cleanoutput", "");
	url.searchParams.set("hideheader", "");
	url.searchParams.set("showlabels", "");
	url.searchParams.set("hidetranslate", "");
	url.searchParams.set("cleandirector", "");
	url.searchParams.set("chatbutton", "0");
	url.searchParams.set("director", state.room);
	url.searchParams.set("slotmode", "");
	url.searchParams.set("showdirector", "");
	if (state.password) {
		url.searchParams.set("password", state.password);
	}
	appendParams(url, extra);
	return url.href;
}

async function buildInviteUrl() {
	const url = new URL("../index.html", window.location.href);
	const extra = currentExtraParams();
	url.searchParams.set("room", state.room);
	url.searchParams.set("webcam", "");
	url.searchParams.set("label", "");
	if (state.password) {
		url.searchParams.set("password", state.password);
	}
	appendParams(url, extra);
	return url.href;
}

function buildSceneUrl(options = {}) {
	const url = new URL("../index.html", window.location.href);
	url.searchParams.set("scene", "0");
	url.searchParams.set("layout", "");
	url.searchParams.set("remote", "");
	url.searchParams.set("showlabels", "");
	url.searchParams.set("room", state.room);
	url.searchParams.set("locked", "1.7777777777");
	if (options.record) {
		url.searchParams.set("recordwindow", "");
		url.searchParams.set("chroma", "000");
	}
	if (options.whipEndpoint) {
		url.searchParams.set("cleanviewer", "");
		url.searchParams.set("chroma", "000");
		url.searchParams.set("nosettings", "");
		url.searchParams.set("prefercurrenttab", "");
		url.searchParams.set("selfbrowsersurface", "include");
		url.searchParams.set("displaysurface", "browser");
		url.searchParams.set("np", "");
		url.searchParams.set("nopush", "");
		url.searchParams.set("publish", "");
		url.searchParams.set("quality", "1");
		url.searchParams.set("whippush", options.whipEndpoint);
	}
	if (state.password) {
		url.searchParams.set("password", state.password);
	}
	return url.href;
}

function framePost(message) {
	if (!directorFrame.contentWindow) {
		return;
	}
	directorFrame.contentWindow.postMessage(message, "*");
}

function frameRequest(message, responseKey, timeoutMs = REQUEST_TIMEOUT_MS) {
	return new Promise((resolve, reject) => {
		const cib = createId("studio");
		const timeout = setTimeout(() => {
			state.pendingRequests.delete(cib);
			reject(new Error(`Timed out waiting for ${responseKey}`));
		}, timeoutMs);
		state.pendingRequests.set(cib, { responseKey, resolve, reject, timeout });
		framePost({ ...message, cib });
	});
}

function handleFrameMessage(event) {
	if (event.source !== directorFrame.contentWindow || !event.data || typeof event.data !== "object") {
		return;
	}
	const data = event.data;
	if (data.cib && state.pendingRequests.has(data.cib)) {
		const pending = state.pendingRequests.get(data.cib);
		if (pending.responseKey in data) {
			clearTimeout(pending.timeout);
			state.pendingRequests.delete(data.cib);
			pending.resolve(data[pending.responseKey]);
		}
	}
	if (data.detailedState) {
		applyDetailedState(data.detailedState);
	}
	if (data.action === "image-frame-capture" && data.value) {
		applyVideoFrame(data.value);
	}
	if (data.action === "loudness" && data.loudness) {
		applyLoudness(data.loudness);
	}
	if (data.action === "guest-connected" || data.action === "view-connection" || data.action === "slot-updated" || data.action === "director-share") {
		refreshState();
	}
	if (data.action === "layout-updated") {
		setStatus("Updated", "live");
	}
}

async function refreshState() {
	if (!state.iframeReady) {
		return;
	}
	try {
		const detailedState = await frameRequest({ getDetailedState: true }, "detailedState");
		applyDetailedState(detailedState);
		const liveCount = getLiveSourceCount();
		setStatus(liveCount ? `${liveCount} source${liveCount === 1 ? "" : "s"}` : "Ready", "live");
	} catch (error) {
		setStatus("Reconnecting", "idle");
	}
}

function getLiveSourceCount() {
	let count = 0;
	for (const source of state.sources.values()) {
		if (!source.disconnected) {
			count++;
		}
	}
	return count;
}

function applyDetailedState(detailedState) {
	const nextSources = new Map();
	const joinedSources = [];
	const now = Date.now();
	Object.values(detailedState || {}).forEach(item => {
		if (!item || !item.streamID || item.localStream || item.localstream) {
			return;
		}
		if (item.director === true && !item.streamID.endsWith(":s")) {
			return;
		}
		const previous = state.sources.get(item.streamID);
		const others = item.others || {};
		const source = {
			streamID: item.streamID,
			label: item.label || item.streamID,
			slot: item.slot ? parseInt(item.slot, 10) : false,
			group: item.group || [],
			muted: Boolean(item.muted || others["mute-guest"]),
			videoMuted: Boolean(item.videoMuted || others["mute-video-guest"]),
			screenSharing: Boolean(item.screenSharing),
			videoVisible: Boolean(item.videoVisible),
			featured: Boolean(item.featured),
			queued: Boolean(others["remove-queue"]),
			handRaised: Boolean(others["hand-raised"]),
			disconnected: false,
			disconnectedAt: 0,
			loudness: previous ? previous.loudness : 0,
			thumbnailUrl: previous ? previous.thumbnailUrl : "",
			thumbnailAt: previous ? previous.thumbnailAt : 0,
			devices: previous ? previous.devices : [],
			devicesLoaded: previous ? previous.devicesLoaded : false,
			devicesLoading: previous ? previous.devicesLoading : false,
			deviceError: previous ? previous.deviceError : "",
			currentVideoLabel: previous ? previous.currentVideoLabel : "",
			currentAudioLabel: previous ? previous.currentAudioLabel : "",
			currentSpeakerLabel: previous ? previous.currentSpeakerLabel : ""
		};
		nextSources.set(item.streamID, source);
		if (state.sourceSnapshotReady && (!previous || previous.disconnected) && !source.queued) {
			joinedSources.push(source);
		}
	});
	for (const [streamID, previous] of state.sources.entries()) {
		if (nextSources.has(streamID)) {
			continue;
		}
		const disconnectedAt = previous.disconnectedAt || now;
		if (now - disconnectedAt <= DISCONNECTED_SOURCE_RETENTION_MS) {
			nextSources.set(streamID, {
				...previous,
				disconnected: true,
				disconnectedAt,
				queued: false,
				loudness: 0
			});
			continue;
		}
		if (previous.thumbnailUrl) {
			URL.revokeObjectURL(previous.thumbnailUrl);
		}
	}
	const sourceListChanged = !sourceMapsHaveSameRenderableState(state.sources, nextSources);
	state.sources = nextSources;
	if (sourceListChanged) {
		renderSources();
		renderLayout();
	}
	if (joinedSources.length) {
		playJoinSound();
	}
	state.sourceSnapshotReady = true;
	requestSourceThumbnails();
}

function sourceMapsHaveSameRenderableState(previousSources, nextSources) {
	if (previousSources.size !== nextSources.size) {
		return false;
	}
	for (const [streamID, next] of nextSources.entries()) {
		const previous = previousSources.get(streamID);
		if (!previous || sourceRenderSignature(previous) !== sourceRenderSignature(next)) {
			return false;
		}
	}
	return true;
}

function sourceRenderSignature(source) {
	return JSON.stringify({
		streamID: source.streamID,
		label: source.label,
		slot: source.slot || false,
		group: source.group || [],
		muted: Boolean(source.muted),
		videoMuted: Boolean(source.videoMuted),
		screenSharing: Boolean(source.screenSharing),
		videoVisible: Boolean(source.videoVisible),
		featured: Boolean(source.featured),
		queued: Boolean(source.queued),
		handRaised: Boolean(source.handRaised),
		disconnected: Boolean(source.disconnected),
		placeholder: Boolean(source.placeholder),
		sample: Boolean(source.sample),
		devicesLoaded: Boolean(source.devicesLoaded),
		devicesLoading: Boolean(source.devicesLoading),
		deviceError: source.deviceError || "",
		deviceCount: Array.isArray(source.devices) ? source.devices.length : 0,
		currentVideoLabel: source.currentVideoLabel || "",
		currentAudioLabel: source.currentAudioLabel || "",
		currentSpeakerLabel: source.currentSpeakerLabel || ""
	});
}

function getSourceCard(streamID) {
	if (!window.CSS || typeof CSS.escape !== "function") {
		return null;
	}
	return sourceList.querySelector(`[data-source-id="${CSS.escape(streamID)}"]`);
}

function applyVideoFrame(frame) {
	if (!frame || !frame.streamID || !state.sources.has(frame.streamID) || !frame.imageData) {
		return;
	}
	const source = state.sources.get(frame.streamID);
	if (source.thumbnailUrl) {
		URL.revokeObjectURL(source.thumbnailUrl);
	}
	source.thumbnailUrl = URL.createObjectURL(frame.imageData);
	source.thumbnailAt = Date.now();
	updateSourcePreview(source);
}

function updateSourcePreview(source) {
	const card = getSourceCard(source.streamID);
	const preview = card ? card.querySelector(".source-card__preview") : null;
	if (!preview || !source.thumbnailUrl) {
		renderSources();
		return;
	}
	preview.querySelectorAll("img, .source-card__sample, i").forEach(element => element.remove());
	const image = document.createElement("img");
	image.src = source.thumbnailUrl;
	image.alt = "";
	preview.insertBefore(image, preview.firstChild);
}

function applyLoudness(loudness) {
	Object.entries(loudness).forEach(([streamID, value]) => {
		const source = state.sources.get(streamID);
		if (!source) {
			return;
		}
		source.loudness = clamp(parseInt(value, 10) || 0, 0, 100);
		const meter = getSourceCard(streamID)?.querySelector(".source-card__meter span");
		if (meter) {
			meter.style.width = `${source.loudness}%`;
		}
	});
}

function requestSourceThumbnails() {
	if (!state.iframeReady || !state.sources.size) {
		return;
	}
	const now = Date.now();
	for (const source of state.sources.values()) {
		if (source.disconnected || source.videoMuted || source.queued || now - (source.thumbnailAt || 0) < THUMBNAIL_REFRESH_MS) {
			continue;
		}
		framePost({ getVideoFrame: true, streamID: source.streamID });
	}
}

function sourceLabelForItem(item) {
	if (item.streamID && state.sources.has(item.streamID)) {
		return state.sources.get(item.streamID).label || item.streamID;
	}
	const source = findSourceBySlot(item.slot);
	if (source) {
		return source.label || source.streamID;
	}
	return item.label || `Slot ${parseInt(item.slot, 10) + 1}`;
}

function findSourceBySlot(slotZeroBased) {
	const slot = parseInt(slotZeroBased, 10) + 1;
	for (const source of state.sources.values()) {
		if (source.slot === slot) {
			return source;
		}
	}
	for (const source of state.placeholders) {
		if (source.slot === slot) {
			return source;
		}
	}
	return null;
}

function isSourceOnStage(source) {
	const scene = getActiveScene();
	return Boolean(scene && !scene.auto && scene.layout.some(item => sourceMatchesLayoutItem(source, item)));
}

function buildSourceList() {
	const liveSources = Array.from(state.sources.values()).sort((a, b) => {
		if (Boolean(a.disconnected) !== Boolean(b.disconnected)) {
			return a.disconnected ? 1 : -1;
		}
		const slotA = a.slot || 9999;
		const slotB = b.slot || 9999;
		if (slotA !== slotB) {
			return slotA - slotB;
		}
		return a.streamID.localeCompare(b.streamID);
	});
	return liveSources.concat(state.placeholders);
}

function normalizeGuestDevices(devices) {
	const counts = {
		audioinput: 0,
		audiooutput: 0,
		videoinput: 0
	};
	return (Array.isArray(devices) ? devices : [])
		.filter(device => device && (device.kind === "audioinput" || device.kind === "audiooutput" || device.kind === "videoinput") && device.deviceId)
		.map(device => {
			counts[device.kind] += 1;
			return {
				deviceId: String(device.deviceId),
				kind: String(device.kind),
				label: String(device.label || (device.kind === "videoinput" ? `Camera ${counts[device.kind]}` : device.kind === "audiooutput" ? `Speaker ${counts[device.kind]}` : `Microphone ${counts[device.kind]}`))
			};
		});
}

function getGuestDeviceList(source, kind) {
	const deviceKind = kind === "camera" ? "videoinput" : kind === "speaker" ? "audiooutput" : "audioinput";
	return (Array.isArray(source.devices) ? source.devices : []).filter(device => device.kind === deviceKind);
}

function currentGuestDeviceLabel(source, kind) {
	if (kind === "camera") {
		return source.currentVideoLabel || "";
	}
	if (kind === "speaker") {
		return source.currentSpeakerLabel || "";
	}
	return source.currentAudioLabel || "";
}

function renderGuestDeviceSelect(source, kind, labelText, placeholderText, emptyText) {
	const devices = getGuestDeviceList(source, kind);
	const row = document.createElement("label");
	row.className = "source-card__device-row";
	const label = document.createElement("span");
	label.textContent = labelText;
	const select = document.createElement("select");
	select.disabled = source.devicesLoading || !devices.length;
	const currentLabel = currentGuestDeviceLabel(source, kind);
	let matchedCurrent = false;
	const blank = document.createElement("option");
	blank.value = "";
	blank.textContent = devices.length ? (currentLabel ? `Current: ${currentLabel}` : placeholderText) : emptyText;
	select.append(blank);
	devices.forEach(device => {
		const option = document.createElement("option");
		option.value = device.deviceId;
		option.textContent = device.label;
		if (currentLabel && device.label === currentLabel) {
			option.selected = true;
			matchedCurrent = true;
		}
		select.append(option);
	});
	if (matchedCurrent) {
		blank.textContent = placeholderText;
	}
	select.addEventListener("change", () => {
		if (!select.value) {
			return;
		}
		changeSourceDevice(source.streamID, kind, select.value);
		select.value = "";
	});
	row.append(label, select);
	return row;
}

function renderSourceDeviceControls(source) {
	if (!source.devicesLoading && !source.devicesLoaded && !source.deviceError) {
		return null;
	}
	const panel = document.createElement("div");
	panel.className = "source-card__devices";
	if (source.devicesLoading) {
		const loading = document.createElement("div");
		loading.className = "source-card__device-note";
		loading.textContent = "Loading guest devices";
		panel.append(loading);
		return panel;
	}
	if (source.deviceError) {
		const error = document.createElement("div");
		error.className = "source-card__device-note source-card__device-note--error";
		error.textContent = source.deviceError;
		panel.append(error);
	}
	if (source.devicesLoaded) {
		panel.append(
			renderGuestDeviceSelect(source, "camera", "Camera", "Select camera", "No cameras"),
			renderGuestDeviceSelect(source, "microphone", "Mic", "Select microphone", "No microphones")
		);
		if (getGuestDeviceList(source, "speaker").length) {
			panel.append(renderGuestDeviceSelect(source, "speaker", "Speaker", "Select speaker", "No speakers"));
		}
	}
	return panel;
}

function renderSources() {
	const sources = buildSourceList();
	sourceList.innerHTML = "";
	if (!sources.length) {
		const empty = document.createElement("div");
		empty.className = "source-empty";
		const text = document.createElement("div");
		text.textContent = "No guests connected";
		const action = document.createElement("button");
		action.type = "button";
		action.className = "button button--secondary source-empty__action";
		action.textContent = "Copy Invite";
		action.addEventListener("click", () => copyText(document.getElementById("invite-link").value, "Invite link"));
		empty.append(text, action);
		sourceList.append(empty);
		return;
	}
	sources.forEach(source => {
		const isPlaceholder = Boolean(source.placeholder);
		const onStage = isSourceOnStage(source);
		const card = document.createElement("article");
		card.className = "source-card";
		card.draggable = !source.disconnected;
		card.dataset.sourceId = source.streamID;
		card.dataset.onStage = onStage ? "true" : "false";
		card.dataset.disconnected = source.disconnected ? "true" : "false";
		if (!source.disconnected) {
			card.addEventListener("dragstart", event => {
				event.dataTransfer.setData("application/x-studio-source", source.streamID);
				event.dataTransfer.effectAllowed = "copyMove";
				stage.dataset.dropActive = "true";
			});
			card.addEventListener("dragend", () => {
				delete stage.dataset.dropActive;
			});
		}

		const preview = document.createElement("div");
		preview.className = "source-card__preview";
		if (source.thumbnailUrl) {
			const image = document.createElement("img");
			image.src = source.thumbnailUrl;
			image.alt = "";
			preview.append(image);
		} else if (source.sample) {
			const samplePreview = document.createElement("div");
			samplePreview.className = "source-card__sample";
			samplePreview.style.background = source.color || "#2457d6";
			samplePreview.textContent = (source.label || "Sample")
				.split(/\s+/)
				.map(part => part.charAt(0))
				.join("")
				.slice(0, 3);
			preview.append(samplePreview);
		} else {
			const placeholderIcon = document.createElement("i");
			placeholderIcon.className = source.screenSharing ? "las la-desktop" : "las la-user";
			preview.append(placeholderIcon);
		}
		const meter = document.createElement("div");
		meter.className = "source-card__meter";
		meter.title = "Audio level";
		const meterFill = document.createElement("span");
		meterFill.style.width = `${clamp(source.loudness || 0, 0, 100)}%`;
		meter.append(meterFill);
		preview.append(meter);

		const header = document.createElement("div");
		header.className = "source-card__header";
		const name = document.createElement("div");
		name.className = "source-card__name";
		name.textContent = source.label || source.streamID;
		const slot = document.createElement("span");
		slot.className = "source-card__slot";
		slot.textContent = source.slot ? `Slot ${source.slot}` : "Manual";
		header.append(name, slot);

		const meta = document.createElement("div");
		meta.className = "source-card__meta";
		meta.textContent = isPlaceholder ? (source.sample ? "Sample test asset" : "Reserved guest slot") : `${source.streamID}${source.disconnected ? " / disconnected" : source.videoMuted ? " / video muted" : ""}`;

		const sourceState = document.createElement("div");
		sourceState.className = "source-card__state";
		sourceState.textContent = source.disconnected ? (onStage ? "Disconnected on stage" : "Disconnected") : source.queued ? "Waiting for activation" : isPlaceholder ? (source.sample ? (onStage ? "Sample on stage" : "Drag test asset") : onStage ? "Reserved on stage" : "Waiting for guest") : onStage ? "On stage" : "Backstage";

		const actions = document.createElement("div");
		actions.className = "source-card__actions";
		const stageButton = document.createElement("button");
		stageButton.type = "button";
		stageButton.className = "button button--secondary";
		stageButton.textContent = source.disconnected && !onStage ? "Waiting to reconnect" : onStage ? "Remove from Scene" : "Add to Scene";
		stageButton.disabled = Boolean(source.disconnected && !onStage);
		stageButton.addEventListener("click", () => {
			if (onStage) {
				removeSourceFromStage(source.streamID);
			} else {
				addSourceToStage(source.streamID);
			}
		});
		actions.append(stageButton);
		if (!isPlaceholder && !source.disconnected && source.queued) {
			const activateButton = document.createElement("button");
			activateButton.type = "button";
			activateButton.className = "button button--primary";
			activateButton.textContent = "Activate Guest";
			activateButton.addEventListener("click", () => activateQueuedGuest(source.streamID));
			actions.append(activateButton);
		}
		if (!source.disconnected && !source.queued) {
			const spotlightButton = document.createElement("button");
			spotlightButton.type = "button";
			spotlightButton.className = "button button--secondary";
			spotlightButton.textContent = "Spotlight";
			spotlightButton.addEventListener("click", () => spotlightSource(source.streamID));
			actions.append(spotlightButton);
		}
		if (!isPlaceholder && !source.disconnected) {
			const micButton = document.createElement("button");
			micButton.type = "button";
			micButton.className = "button button--secondary";
			micButton.textContent = source.muted ? "Unmute Mic" : "Mute Mic";
			micButton.addEventListener("click", () => toggleSourceControl(source.streamID, "mic"));
			actions.append(micButton);

			const videoButton = document.createElement("button");
			videoButton.type = "button";
			videoButton.className = "button button--secondary";
			videoButton.textContent = source.videoMuted ? "Camera On" : "Camera Off";
			videoButton.addEventListener("click", () => toggleSourceControl(source.streamID, "video"));
			actions.append(videoButton);

			const devicesButton = document.createElement("button");
			devicesButton.type = "button";
			devicesButton.className = "button button--secondary";
			devicesButton.textContent = source.devicesLoading ? "Loading Devices" : source.devicesLoaded ? "Refresh Devices" : "Devices";
			devicesButton.disabled = Boolean(source.devicesLoading);
			devicesButton.addEventListener("click", () => loadSourceDevices(source.streamID));
			actions.append(devicesButton);

			const soloButton = document.createElement("button");
			soloButton.type = "button";
			soloButton.className = "button button--secondary";
			soloButton.textContent = "Solo";
			soloButton.addEventListener("click", () => soloSource(source.streamID));
			actions.append(soloButton);
		}
		card.append(preview, header, meta, sourceState, actions);
		const deviceControls = renderSourceDeviceControls(source);
		if (deviceControls) {
			card.append(deviceControls);
		}
		sourceList.append(card);
	});
}

function renderScenes() {
	sceneList.innerHTML = "";
	state.scenes.forEach(scene => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "scene-card";
		button.setAttribute("aria-selected", scene.id === state.activeSceneId ? "true" : "false");
		button.dataset.sceneId = scene.id;
		button.addEventListener("click", () => activateScene(scene.id));

		const thumb = document.createElement("div");
		thumb.className = "scene-thumb";
		if (scene.auto) {
			const box = document.createElement("span");
			box.className = "scene-thumb__box";
			box.style.cssText = "left:8%;top:10%;width:84%;height:80%;";
			thumb.append(box);
		} else {
			scene.layout.slice(0, 8).forEach(item => {
				const box = document.createElement("span");
				box.className = "scene-thumb__box";
				box.style.left = `${item.x}%`;
				box.style.top = `${item.y}%`;
				box.style.width = `${item.w}%`;
				box.style.height = `${item.h}%`;
				thumb.append(box);
			});
		}

		const text = document.createElement("div");
		const title = document.createElement("div");
		title.className = "scene-card__title";
		title.textContent = scene.name;
		const meta = document.createElement("div");
		meta.className = "scene-card__meta";
		meta.textContent = scene.auto ? "Auto layout" : `${scene.layout.length} source${scene.layout.length === 1 ? "" : "s"}`;
		text.append(title, meta);
		button.append(thumb, text);
		if (scene.id === state.lastAppliedSceneId) {
			const badge = document.createElement("span");
			badge.className = "scene-card__badge";
			badge.textContent = "Applied";
			button.append(badge);
		}
		sceneList.append(button);
	});
}

function renderLayout() {
	const scene = getActiveScene();
	activeSceneTitle.value = scene ? scene.name : "Scene";
	stageOverlay.innerHTML = "";
	stage.dataset.hasLayout = scene && (scene.auto ? state.sources.size > 0 : scene.layout.length > 0) ? "true" : "false";
	stage.dataset.layoutMode = scene && scene.auto ? "auto" : "custom";
	if (!scene) {
		stageEmpty.textContent = "No scene selected";
	} else if (scene.auto) {
		stageEmpty.textContent = "Auto layout uses connected guests";
	} else if (scene.layout.length) {
		stageEmpty.textContent = "";
	} else if (buildSourceList().length) {
		stageEmpty.textContent = "Drag guests here or add a guest slot";
	} else {
		stageEmpty.textContent = "Invite guests or add guest slots";
	}
	stageBg.style.background = state.brand.background;
	document.documentElement.style.setProperty("--stage-bg", state.brand.background);
	document.documentElement.style.setProperty("--source-radius", `${state.brand.radius}px`);
	if (!scene || scene.auto) {
		renderBoxInspector();
		return;
	}
	scene.layout
		.slice()
		.sort((a, b) => (a.z || 0) - (b.z || 0))
		.forEach(item => {
			const box = document.createElement("div");
			box.className = "layout-box";
			box.dataset.boxId = item.id;
			box.dataset.testid = `layout-box-${item.id}`;
			box.dataset.selected = item.id === state.selectedBoxId ? "true" : "false";
			box.dataset.cover = item.cover !== false ? "true" : "false";
			box.style.left = `${item.x}%`;
			box.style.top = `${item.y}%`;
			box.style.width = `${item.w}%`;
			box.style.height = `${item.h}%`;
			box.style.zIndex = `${10 + (item.z || 0)}`;
			box.addEventListener("pointerdown", event => beginBoxDrag(event, item.id, "move"));
			box.addEventListener("dragover", event => {
				if (!Array.from(event.dataTransfer.types || []).includes("application/x-studio-source")) {
					return;
				}
				event.preventDefault();
				event.stopPropagation();
				event.dataTransfer.dropEffect = "move";
				box.dataset.dropTarget = "true";
			});
			box.addEventListener("dragleave", event => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					delete box.dataset.dropTarget;
				}
			});
			box.addEventListener("drop", event => {
				event.preventDefault();
				event.stopPropagation();
				delete box.dataset.dropTarget;
				delete stage.dataset.dropActive;
				assignSourceToLayoutItem(event.dataTransfer.getData("application/x-studio-source"), item.id);
			});

			if (state.brand.labels) {
				const label = document.createElement("div");
				label.className = "layout-box__label";
				label.textContent = sourceLabelForItem(item);
				box.append(label);
			}

			const handle = document.createElement("div");
			handle.className = "layout-box__handle";
			handle.title = "Resize";
			handle.addEventListener("pointerdown", event => beginBoxDrag(event, item.id, "resize"));
			box.append(handle);
			stageOverlay.append(box);
		});
	renderBoxInspector();
}

function renderLinks() {
	document.getElementById("room-copy").textContent = state.room ? `Room: ${state.room}` : "";
	buildInviteUrl().then(url => {
		document.getElementById("invite-link").value = url;
	});
	document.getElementById("scene-link").value = buildSceneUrl();
	const passwordInput = document.getElementById("room-password-display");
	const passwordCard = document.getElementById("password-card");
	const copyPassword = document.getElementById("copy-password");
	if (passwordInput && passwordCard && copyPassword) {
		passwordInput.value = state.password || "No password set";
		passwordCard.dataset.empty = state.password ? "false" : "true";
		copyPassword.disabled = !state.password;
	}
}

function renderAll() {
	renderScenes();
	renderSources();
	renderLayout();
	renderLinks();
	updateBrandControls();
	setOutputStatus(state.output.status, state.output.mode);
	renderJoinSoundButton();
	syncSceneActionButtons();
	window.studioApp = {
		state,
		applyDetailedState,
		applyLoudness,
		activateScene,
		addSourceToStage,
		removeSourceFromStage,
		applyPreset,
		spotlightSource,
		refreshState,
		updateSelectedBox,
		removeSelectedBox,
		toggleSourceControl,
		loadSourceDevices,
		changeSourceDevice,
		activateQueuedGuest,
		moveActiveScene,
		deleteActiveScene,
		addSampleSources,
		toggleJoinSound
	};
}

function updateBrandControls() {
	document.getElementById("brand-background").value = state.brand.background;
	document.getElementById("brand-radius").value = state.brand.radius;
	document.getElementById("brand-labels").checked = state.brand.labels;
}

function getSelectedLayoutItem() {
	const scene = getActiveScene();
	if (!scene || scene.auto || !state.selectedBoxId) {
		return null;
	}
	return scene.layout.find(item => item.id === state.selectedBoxId) || null;
}

function renderBoxInspector() {
	const item = getSelectedLayoutItem();
	if (!item) {
		boxInspector.dataset.empty = "true";
		boxInspectorTitle.textContent = "No source selected";
		return;
	}
	boxInspector.dataset.empty = "false";
	boxInspectorTitle.textContent = sourceLabelForItem(item);
	document.getElementById("box-fit-toggle").textContent = item.cover === false ? "Fill" : "Fit";
	document.getElementById("box-x").value = round(item.x);
	document.getElementById("box-y").value = round(item.y);
	document.getElementById("box-w").value = round(item.w);
	document.getElementById("box-h").value = round(item.h);
}

function finishLayoutEdit() {
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function updateSelectedBox(values) {
	const item = getSelectedLayoutItem();
	if (!item) {
		return;
	}
	if ("w" in values) {
		item.w = clamp(parseFloat(values.w) || item.w, 7, 100 - item.x);
	}
	if ("h" in values) {
		item.h = clamp(parseFloat(values.h) || item.h, 8, 100 - item.y);
	}
	if ("x" in values) {
		item.x = clamp(parseFloat(values.x) || 0, 0, 100 - item.w);
	}
	if ("y" in values) {
		item.y = clamp(parseFloat(values.y) || 0, 0, 100 - item.h);
	}
	finishLayoutEdit();
}

function removeSelectedBox() {
	const scene = getActiveScene();
	const item = getSelectedLayoutItem();
	if (!scene || !item) {
		return;
	}
	scene.layout = scene.layout.filter(box => box.id !== item.id);
	state.selectedBoxId = null;
	finishLayoutEdit();
}

function normalizeSceneZ(scene) {
	scene.layout
		.slice()
		.sort((a, b) => (a.z || 0) - (b.z || 0))
		.forEach((item, index) => {
			item.z = index + 1;
		});
}

function moveSelectedBoxLayer(direction) {
	const scene = getActiveScene();
	const item = getSelectedLayoutItem();
	if (!scene || !item || scene.layout.length < 2) {
		return;
	}
	normalizeSceneZ(scene);
	const ordered = scene.layout.slice().sort((a, b) => (a.z || 0) - (b.z || 0));
	const index = ordered.findIndex(box => box.id === item.id);
	const targetIndex = clamp(index + direction, 0, ordered.length - 1);
	if (targetIndex === index) {
		return;
	}
	const target = ordered[targetIndex];
	const z = item.z;
	item.z = target.z;
	target.z = z;
	finishLayoutEdit();
}

function toggleSelectedBoxFit() {
	const item = getSelectedLayoutItem();
	if (!item) {
		return;
	}
	item.cover = item.cover === false;
	finishLayoutEdit();
}

function resetSelectedBox() {
	const item = getSelectedLayoutItem();
	if (!item) {
		return;
	}
	item.x = 2;
	item.y = 2;
	item.w = 96;
	item.h = 96;
	finishLayoutEdit();
}

function renameActiveScene() {
	const scene = getActiveScene();
	if (!scene) {
		return;
	}
	const nextName = activeSceneTitle.value.trim().slice(0, 48);
	if (!nextName) {
		activeSceneTitle.value = scene.name;
		return;
	}
	scene.name = nextName;
	renderScenes();
	scheduleSave();
}

function renameActiveSceneLive() {
	const scene = getActiveScene();
	if (!scene) {
		return;
	}
	const nextName = activeSceneTitle.value.trim().slice(0, 48);
	if (!nextName) {
		return;
	}
	scene.name = nextName;
	renderScenes();
	scheduleSave();
}

function activateScene(sceneId) {
	if (!state.scenes.some(scene => scene.id === sceneId)) {
		return;
	}
	if (state.pendingDeleteSceneId && state.pendingDeleteSceneId !== sceneId) {
		clearPendingSceneDelete(false);
	}
	state.activeSceneId = sceneId;
	state.selectedBoxId = null;
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function duplicateActiveScene() {
	const scene = getActiveScene();
	if (!scene) {
		return;
	}
	clearPendingSceneDelete(false);
	const copy = clone(scene);
	copy.id = createId("scene");
	copy.name = `Scene ${state.scenes.length + 1}`;
	copy.layout = (copy.layout || []).map(item => ({ ...item, id: createId("box") }));
	const index = state.scenes.findIndex(item => item.id === scene.id);
	state.scenes.splice(index + 1, 0, copy);
	activateScene(copy.id);
}

function syncSceneActionButtons() {
	const scene = getActiveScene();
	const deleteButton = document.getElementById("delete-scene");
	const moveUpButton = document.getElementById("move-scene-up");
	const moveDownButton = document.getElementById("move-scene-down");
	if (deleteButton) {
		const pending = scene && state.pendingDeleteSceneId === scene.id;
		deleteButton.textContent = pending ? "Confirm Delete" : "Delete";
		deleteButton.classList.toggle("button--danger", Boolean(pending));
		deleteButton.classList.toggle("button--secondary", !pending);
	}
	if (moveUpButton && moveDownButton) {
		const index = scene ? state.scenes.findIndex(item => item.id === scene.id) : -1;
		moveUpButton.disabled = index <= 0;
		moveDownButton.disabled = index < 0 || index >= state.scenes.length - 1;
	}
}

function clearPendingSceneDelete(sync = true) {
	clearTimeout(state.pendingDeleteTimer);
	state.pendingDeleteTimer = null;
	state.pendingDeleteSceneId = null;
	if (sync) {
		syncSceneActionButtons();
	}
}

function deleteActiveScene() {
	const scene = getActiveScene();
	if (!scene || state.scenes.length <= 1) {
		showToast("Keep at least one scene");
		return;
	}
	if (state.pendingDeleteSceneId !== scene.id) {
		clearTimeout(state.pendingDeleteTimer);
		state.pendingDeleteSceneId = scene.id;
		state.pendingDeleteTimer = setTimeout(() => clearPendingSceneDelete(), 4500);
		syncSceneActionButtons();
		showToast(`Click Confirm Delete to remove ${scene.name}`);
		return;
	}
	clearPendingSceneDelete(false);
	const index = state.scenes.findIndex(item => item.id === scene.id);
	state.scenes.splice(index, 1);
	state.activeSceneId = state.scenes[Math.max(0, index - 1)].id;
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function moveActiveScene(direction) {
	const scene = getActiveScene();
	const index = scene ? state.scenes.findIndex(item => item.id === scene.id) : -1;
	const nextIndex = index + direction;
	if (index < 0 || nextIndex < 0 || nextIndex >= state.scenes.length) {
		showToast(direction < 0 ? "Scene is already first" : "Scene is already last");
		return;
	}
	clearPendingSceneDelete(false);
	const [moved] = state.scenes.splice(index, 1);
	state.scenes.splice(nextIndex, 0, moved);
	renderScenes();
	syncSceneActionButtons();
	scheduleSave();
}

function addScene() {
	clearPendingSceneDelete(false);
	const active = getActiveScene();
	const scene = active
		? {
				...clone(active),
				id: createId("scene"),
				name: `Scene ${state.scenes.length + 1}`,
				layout: (active.layout || []).map(item => ({ ...item, id: createId("box") }))
			}
		: {
				id: createId("scene"),
				name: `Scene ${state.scenes.length + 1}`,
				auto: true,
				layout: []
			};
	state.scenes.push(scene);
	activateScene(scene.id);
}

function ensureEditableScene() {
	let scene = getActiveScene();
	if (!scene.auto) {
		return scene;
	}
	scene.auto = false;
	scene.layout = Array.isArray(scene.layout) ? scene.layout : [];
	return scene;
}

function getSourceById(sourceId) {
	return state.sources.get(sourceId) || state.placeholders.find(source => source.streamID === sourceId) || null;
}

function sourceMatchesLayoutItem(source, item) {
	return Boolean(source && item && (item.streamID === source.streamID || (source.slot && parseInt(item.slot, 10) + 1 === source.slot)));
}

function layoutItemFromSource(source, index) {
	return {
		id: createId("box"),
		streamID: source.placeholder ? "" : source.streamID,
		slot: source.slot ? source.slot - 1 : index,
		label: source.label,
		cover: true,
		z: index + 1
	};
}

function sourceIdentityForLayout(source, index) {
	return {
		streamID: source.placeholder ? "" : source.streamID,
		slot: source.slot ? source.slot - 1 : index,
		label: source.label || ""
	};
}

function layoutItemIdentity(item) {
	return {
		streamID: item.streamID || "",
		slot: Number.isFinite(parseInt(item.slot, 10)) ? parseInt(item.slot, 10) : false,
		label: item.label || ""
	};
}

function setLayoutItemIdentity(item, identity) {
	item.streamID = identity.streamID || "";
	item.slot = identity.slot === false ? false : identity.slot;
	item.label = identity.label || "";
}

function nextZ(scene) {
	return scene.layout.reduce((max, item) => Math.max(max, item.z || 0), 0) + 1;
}

function addSourceToStage(sourceId, position = null) {
	const source = getSourceById(sourceId);
	if (!source) {
		return;
	}
	const scene = ensureEditableScene();
	const existing = scene.layout.find(item => sourceMatchesLayoutItem(source, item));
	if (existing) {
		state.selectedBoxId = existing.id;
		renderAll();
		return;
	}
	const count = scene.layout.length;
	const defaultRect = position || {
		x: Math.min(56, 4 + count * 6),
		y: Math.min(46, 5 + count * 5),
		w: 40,
		h: 36
	};
	scene.layout.push({
		id: createId("box"),
		streamID: source.placeholder ? "" : source.streamID,
		slot: source.slot ? source.slot - 1 : count,
		label: source.label,
		x: defaultRect.x,
		y: defaultRect.y,
		w: defaultRect.w,
		h: defaultRect.h,
		z: nextZ(scene),
		cover: true
	});
	state.selectedBoxId = scene.layout[scene.layout.length - 1].id;
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function removeSourceFromStage(sourceId) {
	const scene = getActiveScene();
	const source = getSourceById(sourceId);
	if (!scene || scene.auto || !source) {
		return;
	}
	scene.layout = scene.layout.filter(item => !sourceMatchesLayoutItem(source, item));
	if (!scene.layout.some(item => item.id === state.selectedBoxId)) {
		state.selectedBoxId = null;
	}
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function assignSourceToLayoutItem(sourceId, targetBoxId) {
	const source = getSourceById(sourceId);
	const scene = getActiveScene();
	if (!source || !scene || scene.auto) {
		return;
	}
	const target = scene.layout.find(item => item.id === targetBoxId);
	if (!target) {
		return;
	}
	const targetIndex = scene.layout.findIndex(item => item.id === target.id);
	const existing = scene.layout.find(item => sourceMatchesLayoutItem(source, item));
	if (existing && existing.id === target.id) {
		state.selectedBoxId = target.id;
		renderLayout();
		return;
	}
	if (existing) {
		const previousTarget = layoutItemIdentity(target);
		setLayoutItemIdentity(target, sourceIdentityForLayout(source, targetIndex));
		setLayoutItemIdentity(existing, previousTarget);
		setStatus("Swapped sources", "live");
	} else {
		setLayoutItemIdentity(target, sourceIdentityForLayout(source, targetIndex));
		setStatus("Source replaced", "live");
	}
	state.selectedBoxId = target.id;
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function soloSource(sourceId) {
	const source = getSourceById(sourceId);
	if (!source) {
		return;
	}
	const scene = ensureEditableScene();
	scene.name = source.label ? `Solo: ${source.label}` : "Solo";
	scene.layout = [
		{
			id: createId("box"),
			streamID: source.placeholder ? "" : source.streamID,
			slot: source.slot ? source.slot - 1 : 0,
			label: source.label,
			x: 2,
			y: 2,
			w: 96,
			h: 96,
			z: 1,
			cover: true
		}
	];
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function spotlightSource(sourceId) {
	const source = getSourceById(sourceId);
	if (!source || source.disconnected || source.queued) {
		return;
	}
	const scene = ensureEditableScene();
	let items = scene.layout.length ? scene.layout.map((item, index) => ({ ...item, z: index + 1 })) : currentLayoutItemsForPreset(9);
	let featured = items.find(item => sourceMatchesLayoutItem(source, item));
	if (!featured) {
		featured = layoutItemFromSource(source, items.length);
	}
	items = [featured].concat(items.filter(item => item !== featured && !sourceMatchesLayoutItem(source, item))).slice(0, 9);
	const rects = getPresetRects("spotlight", items.length);
	scene.name = source.label ? `Spotlight: ${source.label}` : "Spotlight";
	scene.layout = items.map((item, index) => ({
		...item,
		id: item.id || createId("box"),
		x: rects[index].x,
		y: rects[index].y,
		w: rects[index].w,
		h: rects[index].h,
		z: index + 1,
		cover: true
	}));
	state.selectedBoxId = scene.layout[0]?.id || null;
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function toggleSourceControl(streamID, control) {
	const source = state.sources.get(streamID);
	if (!source) {
		return;
	}
	const action = control === "video" ? "video" : "mic";
	framePost({ function: "targetGuest", target: streamID, action });
	if (control === "video") {
		source.videoMuted = !source.videoMuted;
		setStatus(source.videoMuted ? "Camera off request sent" : "Camera on request sent", "live");
	} else {
		source.muted = !source.muted;
		setStatus(source.muted ? "Mute request sent" : "Unmute request sent", "live");
	}
	renderSources();
	setTimeout(refreshState, 900);
}

async function loadSourceDevices(streamID, options = {}) {
	const source = state.sources.get(streamID);
	if (!source || source.placeholder || source.disconnected) {
		return;
	}
	source.devicesLoading = true;
	source.deviceError = "";
	renderSources();
	try {
		const response = await frameRequest({ function: "getGuestMediaDevices", target: streamID }, "guestMediaDevices", 6500);
		const liveSource = state.sources.get(streamID);
		if (!liveSource) {
			return;
		}
		liveSource.devicesLoading = false;
		if (!response || response.ok === false) {
			liveSource.devicesLoaded = false;
			liveSource.devices = [];
			liveSource.deviceError = response?.error || "Unable to load devices";
		} else {
			liveSource.devices = normalizeGuestDevices(response.devices);
			liveSource.devicesLoaded = true;
			liveSource.deviceError = liveSource.devices.length ? "" : "No switchable devices returned";
			liveSource.currentVideoLabel = response.currentVideoLabel || "";
			liveSource.currentAudioLabel = response.currentAudioLabel || "";
			liveSource.currentSpeakerLabel = response.currentSpeakerLabel || "";
		}
		renderSources();
		if (!options.silent) {
			showToast(liveSource.deviceError || "Guest devices loaded");
		}
	} catch (error) {
		const liveSource = state.sources.get(streamID);
		if (liveSource) {
			liveSource.devicesLoading = false;
			liveSource.devicesLoaded = false;
			liveSource.deviceError = "Unable to load devices";
			renderSources();
		}
		if (!options.silent) {
			showToast("Unable to load devices");
		}
	}
}

async function changeSourceDevice(streamID, kind, deviceId) {
	const source = state.sources.get(streamID);
	if (!source || source.placeholder || source.disconnected || !deviceId) {
		return;
	}
	const label = kind === "camera" ? "Camera" : kind === "speaker" ? "Speaker" : "Microphone";
	setStatus(`${label} change requested`, "live");
	try {
		const response = await frameRequest({ function: "setGuestMediaDevice", target: streamID, kind, deviceId }, "guestMediaDeviceChange", 9500);
		if (!response || response.ok === false) {
			throw new Error(response?.error || "Unable to change device");
		}
		showToast(`${label} changed`);
		setTimeout(() => loadSourceDevices(streamID, { silent: true }), 900);
		setTimeout(refreshState, 900);
	} catch (error) {
		setStatus(`${label} change failed`, "idle");
		showToast(`${label} change failed`);
	}
}

function activateQueuedGuest(streamID) {
	const source = state.sources.get(streamID);
	if (!source || !source.queued) {
		return;
	}
	frameRequest({ function: "activateQueuedGuest", target: streamID }, "queuedGuestActivation", 4500).catch(() => {});
	source.queued = false;
	renderSources();
	setStatus("Activating guest", "live");
	showToast("Activation sent");
	setTimeout(refreshState, 700);
}

function currentLayoutItemsForPreset(limit = 9) {
	const scene = ensureEditableScene();
	if (scene.layout.length) {
		return scene.layout.slice(0, limit).map((item, index) => ({ ...item, z: index + 1 }));
	}
	const sources = buildSourceList()
		.filter(source => !source.disconnected && !source.queued)
		.slice(0, limit);
	return sources.map(layoutItemFromSource);
}

function sourceForLayoutItem(item) {
	if (item.streamID && state.sources.has(item.streamID)) {
		return state.sources.get(item.streamID);
	}
	return findSourceBySlot(item.slot);
}

function prioritizePresetItems(items, name) {
	if (name !== "screen") {
		return items;
	}
	return items.slice().sort((a, b) => {
		const sourceA = sourceForLayoutItem(a);
		const sourceB = sourceForLayoutItem(b);
		const screenA = Boolean(sourceA && sourceA.screenSharing);
		const screenB = Boolean(sourceB && sourceB.screenSharing);
		if (screenA !== screenB) {
			return screenA ? -1 : 1;
		}
		return (a.z || 0) - (b.z || 0);
	});
}

function applyPreset(name) {
	const scene = ensureEditableScene();
	const limit = getPresetLimit(name);
	const items = prioritizePresetItems(currentLayoutItemsForPreset(limit), name);
	const count = Math.max(1, Math.min(items.length, limit));
	const rects = getPresetRects(name, count);
	scene.layout = items.slice(0, rects.length).map((item, index) => ({
		...item,
		id: item.id || createId("box"),
		x: rects[index].x,
		y: rects[index].y,
		w: rects[index].w,
		h: rects[index].h,
		z: index + 1,
		cover: true
	}));
	renderAll();
	applySceneToFrame();
	scheduleSave();
}

function getPresetLimit(name) {
	if (name === "solo") {
		return 1;
	}
	if (name === "duo" || name === "pip" || name === "vertical") {
		return 2;
	}
	return 9;
}

function getPresetRects(name, count) {
	if (name === "solo" || count === 1) {
		return [{ x: 2, y: 2, w: 96, h: 96 }];
	}
	if (name === "pip") {
		return [
			{ x: 2, y: 2, w: 96, h: 96 },
			{ x: 69, y: 65, w: 27, h: 29 }
		];
	}
	if (name === "vertical") {
		return [
			{ x: 18, y: 2, w: 30, h: 96 },
			{ x: 52, y: 2, w: 30, h: 96 }
		];
	}
	if (name === "screen") {
		return getScreenRects(count);
	}
	if (name === "spotlight") {
		return getSpotlightRects(count);
	}
	if (name === "grid" || name === "nine") {
		return getGridRects(count);
	}
	if (name === "rows") {
		return getRowRects(count);
	}
	return [
		{ x: 2, y: 2, w: 47, h: 96 },
		{ x: 51, y: 2, w: 47, h: 96 }
	];
}

function getGridRects(count) {
	const cols = count <= 2 ? count : count <= 4 ? 2 : 3;
	const rows = Math.ceil(count / cols);
	const gap = 2;
	const cellW = (96 - gap * (cols - 1)) / cols;
	const cellH = (96 - gap * (rows - 1)) / rows;
	return Array.from({ length: count }, (_, index) => ({
		x: 2 + (index % cols) * (cellW + gap),
		y: 2 + Math.floor(index / cols) * (cellH + gap),
		w: cellW,
		h: cellH
	}));
}

function getSpotlightRects(count) {
	if (count <= 1) {
		return [{ x: 2, y: 2, w: 96, h: 96 }];
	}
	const sideCount = count - 1;
	const many = sideCount > 4;
	const main = { x: 2, y: 2, w: many ? 60 : 68, h: 96 };
	const railX = many ? 64 : 72;
	const railW = many ? 34 : 26;
	const cols = many ? 2 : 1;
	const rows = Math.ceil(sideCount / cols);
	const gap = 2;
	const cellW = (railW - gap * (cols - 1)) / cols;
	const cellH = (96 - gap * (rows - 1)) / rows;
	const side = Array.from({ length: sideCount }, (_, index) => ({
		x: railX + (index % cols) * (cellW + gap),
		y: 2 + Math.floor(index / cols) * (cellH + gap),
		w: cellW,
		h: cellH
	}));
	return [main].concat(side);
}

function getScreenRects(count) {
	if (count <= 1) {
		return [{ x: 2, y: 2, w: 96, h: 96 }];
	}
	const main = { x: 2, y: 2, w: 72, h: 96 };
	const railCount = count - 1;
	const gap = 2;
	const cellH = (96 - gap * (railCount - 1)) / railCount;
	const rail = Array.from({ length: railCount }, (_, index) => ({
		x: 76,
		y: 2 + index * (cellH + gap),
		w: 22,
		h: cellH
	}));
	return [main].concat(rail);
}

function getRowRects(count) {
	const rows = Math.min(count, 3);
	const cols = Math.ceil(count / rows);
	const gap = 2;
	const cellW = (96 - gap * (cols - 1)) / cols;
	const cellH = (96 - gap * (rows - 1)) / rows;
	return Array.from({ length: count }, (_, index) => ({
		x: 2 + Math.floor(index / rows) * (cellW + gap),
		y: 2 + (index % rows) * (cellH + gap),
		w: cellW,
		h: cellH
	}));
}

function exportLayoutItem(item) {
	const output = {
		x: round(item.x),
		y: round(item.y),
		w: round(item.w),
		h: round(item.h),
		z: item.z || 0,
		cover: item.cover !== false,
		rounded: state.brand.radius,
		margin: 0
	};
	if (Number.isFinite(parseInt(item.slot, 10))) {
		output.slot = parseInt(item.slot, 10);
	}
	return output;
}

function buildLayoutPayload(scene) {
	if (!scene || scene.auto) {
		return false;
	}
	const hasDirectStreams = scene.layout.some(item => item.streamID);
	if (!hasDirectStreams) {
		return scene.layout.map(exportLayoutItem);
	}
	const combined = {};
	scene.layout.forEach(item => {
		const output = exportLayoutItem(item);
		if (item.streamID) {
			combined[item.streamID] = output;
			return;
		}
		const source = findSourceBySlot(item.slot);
		if (source) {
			combined[source.streamID] = output;
			return;
		}
		if (!combined[""]) {
			combined[""] = [];
		}
		combined[""].push(output);
	});
	return combined;
}

function applySceneToFrame() {
	const scene = getActiveScene();
	if (!state.iframeReady || !scene) {
		return;
	}
	const layout = buildLayoutPayload(scene);
	framePost({ scene: "0", layout });
	state.lastAppliedSceneId = scene.id;
	renderScenes();
	setStatus(scene.auto ? "Auto layout" : "Updated", "live");
	scheduleSave();
}

function round(value) {
	return Math.round(parseFloat(value) * 1000) / 1000;
}

function beginBoxDrag(event, boxId, mode) {
	event.preventDefault();
	event.stopPropagation();
	const scene = getActiveScene();
	if (!scene || scene.auto) {
		return;
	}
	const item = scene.layout.find(box => box.id === boxId);
	if (!item) {
		return;
	}
	state.selectedBoxId = boxId;
	const rect = stage.getBoundingClientRect();
	state.dragOperation = {
		mode,
		boxId,
		startX: event.clientX,
		startY: event.clientY,
		stageWidth: rect.width,
		stageHeight: rect.height,
		original: { x: item.x, y: item.y, w: item.w, h: item.h }
	};
	stageOverlay.dataset.dragging = "true";
	window.addEventListener("pointermove", handleBoxDrag);
	window.addEventListener("pointerup", endBoxDrag, { once: true });
	renderLayout();
}

function handleBoxDrag(event) {
	const drag = state.dragOperation;
	if (!drag) {
		return;
	}
	const scene = getActiveScene();
	const item = scene.layout.find(box => box.id === drag.boxId);
	if (!item) {
		return;
	}
	const deltaX = ((event.clientX - drag.startX) / drag.stageWidth) * 100;
	const deltaY = ((event.clientY - drag.startY) / drag.stageHeight) * 100;
	if (drag.mode === "resize") {
		item.w = clamp(drag.original.w + deltaX, 7, 100 - item.x);
		item.h = clamp(drag.original.h + deltaY, 8, 100 - item.y);
	} else {
		item.x = clamp(drag.original.x + deltaX, 0, 100 - item.w);
		item.y = clamp(drag.original.y + deltaY, 0, 100 - item.h);
	}
	const box = stageOverlay.querySelector(`[data-box-id="${item.id}"]`);
	if (box) {
		box.style.left = `${item.x}%`;
		box.style.top = `${item.y}%`;
		box.style.width = `${item.w}%`;
		box.style.height = `${item.h}%`;
	}
}

function endBoxDrag() {
	window.removeEventListener("pointermove", handleBoxDrag);
	delete stageOverlay.dataset.dragging;
	state.dragOperation = null;
	applySceneToFrame();
	renderBoxInspector();
	renderScenes();
	scheduleSave();
}

function renderJoinSoundButton() {
	if (!joinSoundButton) {
		return;
	}
	joinSoundButton.textContent = state.joinSound ? "Sound On" : "Sound Off";
	joinSoundButton.setAttribute("aria-pressed", state.joinSound ? "true" : "false");
	joinSoundButton.title = state.joinSound ? "Disable guest join sound" : "Enable guest join sound";
}

function ensureAudioContext() {
	const AudioContext = window.AudioContext || window.webkitAudioContext;
	if (!AudioContext) {
		return null;
	}
	if (!state.audioContext) {
		state.audioContext = new AudioContext();
	}
	if (state.audioContext.state === "suspended") {
		state.audioContext.resume().catch(() => {});
	}
	return state.audioContext;
}

function playJoinSound() {
	if (!state.joinSound) {
		return;
	}
	const audioContext = ensureAudioContext();
	if (!audioContext) {
		return;
	}
	const now = audioContext.currentTime;
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();
	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(880, now);
	oscillator.frequency.setValueAtTime(1175, now + 0.11);
	gain.gain.setValueAtTime(0.0001, now);
	gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
	gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
	oscillator.connect(gain);
	gain.connect(audioContext.destination);
	oscillator.start(now);
	oscillator.stop(now + 0.25);
}

function toggleJoinSound() {
	state.joinSound = !state.joinSound;
	try {
		localStorage.setItem(JOIN_SOUND_STORAGE_KEY, state.joinSound ? "1" : "0");
	} catch (error) {
		console.warn("Unable to persist join sound preference", error);
	}
	if (state.joinSound) {
		ensureAudioContext();
	}
	renderJoinSoundButton();
	showToast(state.joinSound ? "Join sound enabled" : "Join sound disabled");
}

function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

function addPlaceholder() {
	const nextSlot = getNextSlot();
	const placeholder = {
		streamID: createId("placeholder"),
		label: `Guest Slot ${nextSlot}`,
		slot: nextSlot,
		placeholder: true
	};
	state.placeholders.push(placeholder);
	renderSources();
	scheduleSave();
}

function getNextSlot() {
	return Math.max(0, ...state.placeholders.map(item => item.slot || 0), ...Array.from(state.sources.values()).map(item => item.slot || 0)) + 1;
}

function addSampleSources() {
	const existing = new Set(state.placeholders.filter(item => item.sample).map(item => item.label));
	let nextSlot = getNextSlot();
	let added = 0;
	SAMPLE_SOURCES.forEach(sample => {
		if (existing.has(sample.label)) {
			return;
		}
		state.placeholders.push({
			streamID: createId("sample"),
			label: sample.label,
			slot: nextSlot++,
			placeholder: true,
			sample: true,
			color: sample.color,
			screenSharing: Boolean(sample.screenSharing),
			loudness: sample.loudness || 0
		});
		added++;
	});
	renderSources();
	scheduleSave();
	showToast(added ? "Sample sources added" : "Sample sources already added");
}

function updateActiveBrand() {
	state.brand.background = document.getElementById("brand-background").value;
	state.brand.radius = parseInt(document.getElementById("brand-radius").value, 10) || 0;
	state.brand.labels = document.getElementById("brand-labels").checked;
	renderLayout();
	applySceneToFrame();
	scheduleSave();
}

async function copyText(value, label) {
	try {
		await navigator.clipboard.writeText(value);
		showToast(`${label} copied`);
	} catch (error) {
		showToast(`Unable to copy ${label.toLowerCase()}`);
	}
}

function openUrl(url, statusText = "Output window opened") {
	const win = window.open(url, "_blank", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1280,height=720");
	if (win && typeof win.focus === "function") {
		win.focus();
	}
	setOutputStatus(statusText, win ? "active" : "idle");
	if (!win) {
		showToast("Popup blocked");
	}
}

async function startStudio() {
	state.room = sanitizeRoomName(roomNameInput.value || state.room);
	state.password = roomPasswordInput.value || "";
	state.sourceSnapshotReady = false;
	if (!state.room) {
		roomNameInput.focus();
		return;
	}
	loadSession();
	root.dataset.state = "studio";
	renderAll();
	setStatus("Loading", "idle");
	const url = buildDirectorUrl();
	directorFrame.src = url;
	const current = new URL(window.location.href);
	current.searchParams.set("room", state.room);
	if (state.password) {
		current.searchParams.set("password", state.password);
		current.searchParams.delete("pass");
		current.searchParams.delete("pw");
	} else {
		current.searchParams.delete("password");
		current.searchParams.delete("pass");
		current.searchParams.delete("pw");
	}
	history.replaceState(null, "", current.href);
}

function bindEvents() {
	roomForm.addEventListener("submit", event => {
		event.preventDefault();
		startStudio();
	});
	randomRoomButton.addEventListener("click", () => {
		roomNameInput.value = randomRoomName();
		roomNameInput.focus();
	});
	directorFrame.addEventListener("load", () => {
		state.iframeReady = true;
		setStatus("Connected", "live");
		framePost({ previewMode: true, layout: buildLayoutPayload(getActiveScene()), target: "*" });
		applySceneToFrame();
		refreshState();
		framePost({ getLoudness: true });
		clearInterval(state.pollTimer);
		state.pollTimer = setInterval(refreshState, DEFAULT_POLL_MS);
		clearInterval(state.thumbnailTimer);
		state.thumbnailTimer = setInterval(requestSourceThumbnails, THUMBNAIL_REFRESH_MS);
	});
	window.addEventListener("message", handleFrameMessage);
	window.addEventListener("beforeunload", () => {
		clearInterval(state.pollTimer);
		clearInterval(state.thumbnailTimer);
		for (const source of state.sources.values()) {
			if (source.thumbnailUrl) {
				URL.revokeObjectURL(source.thumbnailUrl);
			}
		}
	});
	window.addEventListener("keydown", event => {
		const target = event.target;
		if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
			return;
		}
		if (event.key === "Delete" || event.key === "Backspace") {
			if (getSelectedLayoutItem()) {
				event.preventDefault();
				removeSelectedBox();
			}
		} else if (event.key === "Escape") {
			state.selectedBoxId = null;
			renderLayout();
		} else if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
			const item = getSelectedLayoutItem();
			if (!item) {
				return;
			}
			event.preventDefault();
			const step = event.shiftKey ? 5 : 1;
			updateSelectedBox({
				x: item.x + (event.key === "ArrowRight" ? step : event.key === "ArrowLeft" ? -step : 0),
				y: item.y + (event.key === "ArrowDown" ? step : event.key === "ArrowUp" ? -step : 0)
			});
		}
	});

	document.getElementById("refresh-state").addEventListener("click", refreshState);
	document.getElementById("add-scene").addEventListener("click", addScene);
	document.getElementById("export-template").addEventListener("click", exportTemplate);
	document.getElementById("import-template").addEventListener("click", () => document.getElementById("template-file").click());
	document.getElementById("template-file").addEventListener("change", event => importTemplateFile(event.target.files[0]));
	document.getElementById("duplicate-scene").addEventListener("click", duplicateActiveScene);
	document.getElementById("delete-scene").addEventListener("click", deleteActiveScene);
	document.getElementById("move-scene-up").addEventListener("click", () => moveActiveScene(-1));
	document.getElementById("move-scene-down").addEventListener("click", () => moveActiveScene(1));
	document.getElementById("go-live").addEventListener("click", applySceneToFrame);
	document.getElementById("add-placeholder").addEventListener("click", addPlaceholder);
	document.getElementById("add-samples").addEventListener("click", addSampleSources);
	joinSoundButton?.addEventListener("click", toggleJoinSound);
	activeSceneTitle.addEventListener("input", renameActiveSceneLive);
	activeSceneTitle.addEventListener("change", renameActiveScene);
	activeSceneTitle.addEventListener("keydown", event => {
		if (event.key === "Enter") {
			event.preventDefault();
			activeSceneTitle.blur();
		}
	});
	document.getElementById("box-remove").addEventListener("click", removeSelectedBox);
	document.getElementById("box-backward").addEventListener("click", () => moveSelectedBoxLayer(-1));
	document.getElementById("box-forward").addEventListener("click", () => moveSelectedBoxLayer(1));
	document.getElementById("box-fit-toggle").addEventListener("click", toggleSelectedBoxFit);
	document.getElementById("box-reset").addEventListener("click", resetSelectedBox);
	["box-x", "box-y", "box-w", "box-h"].forEach(id => {
		const updateBoxField = () => {
			updateSelectedBox({
				x: document.getElementById("box-x").value,
				y: document.getElementById("box-y").value,
				w: document.getElementById("box-w").value,
				h: document.getElementById("box-h").value
			});
		};
		document.getElementById(id).addEventListener("input", updateBoxField);
		document.getElementById(id).addEventListener("change", updateBoxField);
	});

	document.querySelectorAll(".layout-preset").forEach(button => {
		button.addEventListener("click", () => applyPreset(button.dataset.preset));
	});

	document.querySelectorAll(".tab-button").forEach(button => {
		button.addEventListener("click", () => {
			document.querySelectorAll(".tab-button").forEach(tab => tab.setAttribute("aria-selected", tab === button ? "true" : "false"));
			document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.toggle("hidden", panel.dataset.panel !== button.dataset.tab));
		});
	});

	["brand-background", "brand-radius", "brand-labels"].forEach(id => {
		document.getElementById(id).addEventListener("input", updateActiveBrand);
		document.getElementById(id).addEventListener("change", updateActiveBrand);
	});

	stage.addEventListener("dragover", event => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	});
	stage.addEventListener("drop", event => {
		event.preventDefault();
		delete stage.dataset.dropActive;
		const sourceId = event.dataTransfer.getData("application/x-studio-source");
		if (!sourceId) {
			return;
		}
		const rect = stage.getBoundingClientRect();
		const x = clamp(((event.clientX - rect.left) / rect.width) * 100 - 20, 0, 60);
		const y = clamp(((event.clientY - rect.top) / rect.height) * 100 - 18, 0, 64);
		addSourceToStage(sourceId, { x, y, w: 40, h: 36 });
	});

	stageOverlay.addEventListener("pointerdown", event => {
		if (event.target === stageOverlay) {
			state.selectedBoxId = null;
			renderLayout();
		}
	});

	document.getElementById("room-copy").addEventListener("click", () => copyText(state.room, "Room name"));
	document.getElementById("copy-invite").addEventListener("click", () => copyText(document.getElementById("invite-link").value, "Invite link"));
	document.getElementById("copy-password").addEventListener("click", () => {
		if (state.password) {
			copyText(state.password, "Room password");
		}
	});
	document.getElementById("copy-scene").addEventListener("click", () => copyText(document.getElementById("scene-link").value, "Scene link"));
	document.getElementById("open-scene").addEventListener("click", () => openUrl(buildSceneUrl(), "Scene link opened"));
	document.getElementById("record-scene").addEventListener("click", () => openUrl(buildSceneUrl({ record: true }), "Recorder opened"));
	document.getElementById("open-meshcast").addEventListener("click", () => openUrl("https://app.meshcast.io/", "Meshcast opened"));
	document.getElementById("publish-whip").addEventListener("click", () => {
		const endpoint = document.getElementById("whip-endpoint").value.trim();
		if (!endpoint) {
			showToast("Enter a WHIP endpoint");
			return;
		}
		try {
			const url = new URL(endpoint);
			if (!["http:", "https:"].includes(url.protocol)) {
				throw new Error("Unsupported WHIP endpoint protocol");
			}
		} catch (error) {
			showToast("Enter a valid WHIP endpoint");
			return;
		}
		openUrl(buildSceneUrl({ whipEndpoint: endpoint }), "WHIP publisher opened");
	});
}

bindEvents();

if (state.room) {
	roomNameInput.value = state.room;
	roomPasswordInput.value = state.password;
	startStudio();
} else {
	roomNameInput.value = "";
}
