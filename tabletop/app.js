"use strict";

const app = document.getElementById("app");
const setupForm = document.getElementById("setup-form");
const roomInput = document.getElementById("room-input");
const nameInput = document.getElementById("name-input");
const passwordInput = document.getElementById("password-input");
const roleGm = document.getElementById("role-gm");
const rolePlayer = document.getElementById("role-player");
const randomRoomButton = document.getElementById("random-room");
const copyRoomButton = document.getElementById("copy-room");
const syncStatus = document.getElementById("sync-status");
const snapshotRequestButton = document.getElementById("snapshot-request");
const exportButton = document.getElementById("export-state");
const importButton = document.getElementById("import-state");
const importFileInput = document.getElementById("import-file");
const publishBoardButton = document.getElementById("publish-board");
const vdoFrame = document.getElementById("vdo-frame");
const toggleVideoRoomButton = document.getElementById("toggle-video-room");
const sceneList = document.getElementById("scene-list");
const sceneNameInput = document.getElementById("scene-name");
const addSceneButton = document.getElementById("add-scene");
const duplicateSceneButton = document.getElementById("duplicate-scene");
const deleteSceneButton = document.getElementById("delete-scene");
const clearSceneButton = document.getElementById("clear-scene");
const boardShell = document.getElementById("board-drop-target");
const canvas = document.getElementById("board-canvas");
const ctx = canvas.getContext("2d");
const boardHud = document.getElementById("board-hud");
const coordinatesLabel = document.getElementById("board-coordinates");
const boardOutputLink = document.getElementById("board-output-link");
const measurementLabel = document.getElementById("measurement-label");
const drawColorInput = document.getElementById("draw-color");
const brushSizeInput = document.getElementById("brush-size");
const mapFileButton = document.getElementById("map-file-button");
const tokenFileButton = document.getElementById("token-file-button");
const mapFileInput = document.getElementById("map-file");
const tokenFileInput = document.getElementById("token-file");
const assetList = document.getElementById("asset-list");
const tokenList = document.getElementById("token-list");
const tokenEditor = document.getElementById("token-editor");
const tokenNameInput = document.getElementById("token-name");
const tokenOwnerInput = document.getElementById("token-owner");
const tokenHpInput = document.getElementById("token-hp");
const tokenHiddenInput = document.getElementById("token-hidden");
const tokenLockedInput = document.getElementById("token-locked");
const deleteTokenButton = document.getElementById("delete-token");
const addSelectedToInitiativeButton = document.getElementById("add-selected-to-initiative");
const rollForm = document.getElementById("roll-form");
const rollInput = document.getElementById("roll-input");
const privateRollInput = document.getElementById("private-roll");
const rollLog = document.getElementById("roll-log");
const initiativeList = document.getElementById("initiative-list");
const prevTurnButton = document.getElementById("prev-turn");
const nextTurnButton = document.getElementById("next-turn");
const addHandoutButton = document.getElementById("add-handout");
const handoutFileInput = document.getElementById("handout-file");
const handoutList = document.getElementById("handout-list");
const gridEnabledInput = document.getElementById("grid-enabled");
const gridSizeInput = document.getElementById("grid-size");
const gridOpacityInput = document.getElementById("grid-opacity");
const playersCanDrawInput = document.getElementById("players-can-draw");
const playersCanCreateInput = document.getElementById("players-can-create");
const playersCanMoveOwnedInput = document.getElementById("players-can-move-owned");
const playersCanPingInput = document.getElementById("players-can-ping");
const toast = document.getElementById("toast");
const handoutModal = document.getElementById("handout-modal");
const handoutTitle = document.getElementById("handout-title");
const handoutBody = document.getElementById("handout-body");
const closeHandoutButton = document.getElementById("close-handout");

const params = new URLSearchParams(window.location.search);
const initialRoom = sanitizeRoom(params.get("room") || params.get("r") || "");
const STORAGE_PREFIX = "tabletop.session.";
const CLIENT_ID_KEY = "tabletop.clientId";
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1600;
const IMAGE_MAX_EDGE = 1800;
const SNAPSHOT_DEBOUNCE_MS = 90;
const TOOL_DEFAULT = "select";
const DISABLE_VIDEO_ROOM = params.has("novideo") || params.has("novideoroom") || params.has("tabletopnovideo");
const ROOM_NAME_WORDS = ["able above after bright clear cloud color direct early field final first frame fresh great green group guide", "happy heavy large level light local main major marker middle modern motion near north open party plain point", "quick ready river round scene score secure select sharp signal silver simple space stable stone stream table", "target token total track turn video view white wide"].join(" ").split(" ");

const imageCache = new Map();
const seenMessages = new Set();
let broadcastChannel = null;
let resizeObserver = null;
let renderQueued = false;
let saveTimer = null;
let snapshotTimer = null;
let transportSyncTimers = [];
let boardPublishFrame = null;
let boardPublishTimer = null;
let activeTool = TOOL_DEFAULT;
let pointerState = null;
let selectedTokenId = null;
let currentStroke = null;
let currentMeasurement = null;
let lastAcceptedSnapshotTimestamp = 0;

const clientId = getOrCreateClientId();

let state = createDefaultState({
	room: initialRoom,
	password: params.get("password") || params.get("pass") || params.get("pw") || "",
	role: params.has("gm") || !initialRoom ? "gm" : "player",
	playerName: params.get("name") || params.get("label") || ""
});

function getOrCreateClientId() {
	try {
		const existing = sessionStorage.getItem(CLIENT_ID_KEY);
		if (existing) {
			return existing;
		}
		const next = createId("client");
		sessionStorage.setItem(CLIENT_ID_KEY, next);
		return next;
	} catch (error) {
		return createId("client");
	}
}

function createId(prefix) {
	return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function sanitizeRoom(value) {
	return (value || "")
		.trim()
		.replace(/[^a-zA-Z0-9_.-]/g, "")
		.slice(0, 80);
}

function sanitizeName(value) {
	return (value || "").trim().slice(0, 40);
}

function clone(value) {
	return JSON.parse(JSON.stringify(value));
}

function createDefaultState(options = {}) {
	const sceneId = createId("scene");
	const room = sanitizeRoom(options.room || "");
	const role = options.role === "gm" ? "gm" : "player";
	return {
		version: 1,
		room,
		password: options.password || "",
		role,
		playerName: sanitizeName(options.playerName || (role === "gm" ? "GM" : "")),
		activeSceneId: sceneId,
		selectedSceneId: sceneId,
		updatedAt: Date.now(),
		scenes: [
			{
				id: sceneId,
				name: "Scene 1",
				mapAssetId: null,
				map: { x: 0, y: 0, w: 1600, h: 900 },
				camera: { x: 120, y: 90, zoom: 0.62 },
				grid: { enabled: true, size: 64, opacity: 0.35, color: "#ffffff" },
				tokens: [],
				drawings: [],
				fog: { enabled: false, reveals: [] }
			}
		],
		assets: {},
		rolls: [],
		handouts: [],
		initiative: { entries: [], activeIndex: 0 },
		players: {},
		permissions: {
			playersCanDraw: false,
			playersCanCreateTokens: false,
			playersCanMoveOwned: true,
			playersCanPing: true
		},
		boardOutput: { streamId: "" }
	};
}

function getActiveScene() {
	return state.scenes.find(scene => scene.id === state.activeSceneId) || state.scenes[0];
}

function getStorageKey() {
	return `${STORAGE_PREFIX}${state.room || "local"}`;
}

function saveState() {
	clearTimeout(saveTimer);
	saveTimer = setTimeout(() => {
		try {
			localStorage.setItem(getStorageKey(), JSON.stringify(state));
		} catch (error) {
			showToast("Session is too large for local storage; export a backup.");
		}
	}, 120);
}

function loadSavedState(room) {
	try {
		const saved = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}${room || "local"}`) || "null");
		if (saved && saved.version === 1 && Array.isArray(saved.scenes) && saved.scenes.length) {
			const role = state.role;
			const playerName = state.playerName;
			const password = state.password;
			state = normalizeState(saved);
			state.role = role;
			state.playerName = playerName || state.playerName;
			state.password = password || state.password;
			return true;
		}
	} catch (error) {
		console.warn("Unable to load tabletop state", error);
	}
	return false;
}

function normalizeState(next) {
	const normalized = { ...createDefaultState({ room: next.room, role: next.role, playerName: next.playerName, password: next.password }), ...next };
	normalized.scenes = Array.isArray(next.scenes) && next.scenes.length ? next.scenes : normalized.scenes;
	normalized.assets = next.assets && typeof next.assets === "object" ? next.assets : {};
	normalized.rolls = Array.isArray(next.rolls) ? next.rolls.slice(-80) : [];
	normalized.handouts = Array.isArray(next.handouts) ? next.handouts : [];
	normalized.initiative = next.initiative && Array.isArray(next.initiative.entries) ? next.initiative : { entries: [], activeIndex: 0 };
	normalized.permissions = { ...createDefaultState().permissions, ...(next.permissions || {}) };
	normalized.players = next.players && typeof next.players === "object" ? next.players : {};
	normalized.boardOutput = next.boardOutput || { streamId: "" };
	if (!normalized.scenes.some(scene => scene.id === normalized.activeSceneId)) {
		normalized.activeSceneId = normalized.scenes[0].id;
	}
	normalized.scenes.forEach(scene => {
		scene.map = scene.map || { x: 0, y: 0, w: 1600, h: 900 };
		scene.camera = scene.camera || { x: 120, y: 90, zoom: 0.62 };
		scene.grid = { enabled: true, size: 64, opacity: 0.35, color: "#ffffff", ...(scene.grid || {}) };
		scene.tokens = Array.isArray(scene.tokens) ? scene.tokens : [];
		scene.drawings = Array.isArray(scene.drawings) ? scene.drawings : [];
		scene.fog = scene.fog || { enabled: false, reveals: [] };
	});
	return normalized;
}

function updateUrl() {
	const next = new URL(window.location.href);
	if (state.room) {
		next.searchParams.set("room", state.room);
	}
	if (state.role === "gm") {
		next.searchParams.set("gm", "");
	} else {
		next.searchParams.delete("gm");
	}
	if (state.playerName) {
		next.searchParams.set("name", state.playerName);
	}
	if (state.password) {
		next.searchParams.set("password", state.password);
	} else {
		next.searchParams.delete("password");
	}
	window.history.replaceState(null, "", next.toString());
}

function enterRoom() {
	state.room = sanitizeRoom(roomInput.value || state.room || randomRoomName());
	state.playerName = sanitizeName(nameInput.value) || (roleGm.checked ? "GM" : "Player");
	state.password = passwordInput.value || "";
	state.role = roleGm.checked ? "gm" : "player";
	loadSavedState(state.room);
	state.room = sanitizeRoom(roomInput.value || state.room);
	lastAcceptedSnapshotTimestamp = 0;
	state.players[clientId] = { id: clientId, name: state.playerName, role: state.role, updatedAt: Date.now() };
	app.dataset.state = "room";
	app.dataset.role = state.role;
	updateUrl();
	setupVdoFrame();
	setupBroadcastChannel();
	updateInviteText();
	syncFormFromState();
	renderAll();
	saveState();
	if (state.role === "gm") {
		broadcastSnapshot("gm-enter");
	} else {
		requestSnapshot();
	}
}

function randomRoomName() {
	const possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
	let text = "";
	for (let i = 0; i < 2; i++) {
		text += ROOM_NAME_WORDS[Math.floor(Math.random() * ROOM_NAME_WORDS.length)];
	}
	text += possible.charAt(Math.floor(Math.random() * possible.length));
	while (text.length < 8) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return avoidBlockedRoomText(text);
}

function avoidBlockedRoomText(text) {
	return [
		["AD", "vDAv"],
		["Ad", "vdAv"],
		["ad", "vdav"],
		["aD", "vDav"]
	].reduce((value, replacement) => value.split(replacement[0]).join(replacement[1]), text);
}

function setupVdoFrame() {
	clearTransportSyncTimers();
	if (!state.room) {
		return;
	}
	if (DISABLE_VIDEO_ROOM) {
		vdoFrame.removeAttribute("src");
		document.querySelector(".video-panel").dataset.collapsed = "true";
		syncStatus.textContent = "Local sync";
		syncStatus.dataset.state = "live";
		return;
	}
	const url = new URL("../index.html", window.location.href);
	url.searchParams.set("room", state.room);
	url.searchParams.set("label", state.playerName || (state.role === "gm" ? "GM" : "Player"));
	url.searchParams.set("cleanoutput", "");
	url.searchParams.set("transparent", "");
	url.searchParams.set("chatbutton", "0");
	url.searchParams.set("hidetranslate", "");
	url.searchParams.set("datachannel", "1");
	url.searchParams.set("webcam", "");
	url.searchParams.set("autostart", "");
	if (state.password) {
		url.searchParams.set("password", state.password);
	}
	vdoFrame.src = url.toString();
	syncStatus.textContent = "Connecting";
	syncStatus.dataset.state = "warn";
	scheduleTransportSync("transport-start");
}

function clearTransportSyncTimers() {
	transportSyncTimers.forEach(timer => clearTimeout(timer));
	transportSyncTimers = [];
}

function scheduleTransportSync(reason) {
	if (DISABLE_VIDEO_ROOM || !state.room) {
		return;
	}
	clearTransportSyncTimers();
	[250, 1250, 3500].forEach(delay => {
		transportSyncTimers.push(
			setTimeout(() => {
				if (app.dataset.state !== "room" || !state.room || DISABLE_VIDEO_ROOM) {
					return;
				}
				if (state.role === "gm") {
					broadcastSnapshot(reason);
				} else {
					requestSnapshot({ quiet: true });
				}
			}, delay)
		);
	});
}

function setupBroadcastChannel() {
	if (broadcastChannel) {
		broadcastChannel.close();
	}
	if (!("BroadcastChannel" in window) || !state.room) {
		return;
	}
	broadcastChannel = new BroadcastChannel(`vdo-tabletop-${state.room}`);
	broadcastChannel.onmessage = event => {
		handleTransportMessage(event.data, "local");
	};
}

function updateInviteText() {
	const url = new URL(window.location.href);
	url.searchParams.set("room", state.room);
	url.searchParams.delete("gm");
	if (state.password) {
		url.searchParams.set("password", state.password);
	}
	copyRoomButton.textContent = url.toString();
	copyRoomButton.title = url.toString();
}

function syncFormFromState() {
	roomInput.value = state.room || "";
	nameInput.value = state.playerName || "";
	passwordInput.value = state.password || "";
	roleGm.checked = state.role === "gm";
	rolePlayer.checked = state.role !== "gm";
	const scene = getActiveScene();
	sceneNameInput.value = scene ? scene.name : "";
	gridEnabledInput.checked = !!(scene && scene.grid.enabled);
	gridSizeInput.value = scene && scene.grid.size ? scene.grid.size : 64;
	gridOpacityInput.value = scene && typeof scene.grid.opacity === "number" ? Math.round(scene.grid.opacity * 100) : 35;
	playersCanDrawInput.checked = !!state.permissions.playersCanDraw;
	playersCanCreateInput.checked = !!state.permissions.playersCanCreateTokens;
	playersCanMoveOwnedInput.checked = !!state.permissions.playersCanMoveOwned;
	playersCanPingInput.checked = !!state.permissions.playersCanPing;
}

function setTool(tool) {
	activeTool = tool || TOOL_DEFAULT;
	document.querySelectorAll(".tool-button[data-tool]").forEach(button => {
		button.setAttribute("aria-pressed", button.dataset.tool === activeTool ? "true" : "false");
	});
	canvas.style.cursor = activeTool === "pan" ? "grab" : activeTool === "select" ? "default" : "crosshair";
}

function canEditBoard() {
	return state.role === "gm" || !!state.permissions.playersCanDraw;
}

function canCreateToken() {
	return state.role === "gm" || !!state.permissions.playersCanCreateTokens;
}

function canMoveToken(token) {
	if (state.role === "gm") {
		return true;
	}
	if (!state.permissions.playersCanMoveOwned || token.locked) {
		return false;
	}
	const owner = (token.owner || "").trim().toLowerCase();
	return owner && owner === (state.playerName || "").trim().toLowerCase();
}

function applyLocalMutation(reason, options = {}) {
	state.updatedAt = Date.now();
	saveState();
	renderAll();
	if (state.role === "gm" && options.broadcast !== false) {
		debouncedBroadcastSnapshot(reason);
	}
}

function debouncedBroadcastSnapshot(reason) {
	clearTimeout(snapshotTimer);
	snapshotTimer = setTimeout(() => {
		broadcastSnapshot(reason);
	}, SNAPSHOT_DEBOUNCE_MS);
}

function createEnvelope(type, payload = {}) {
	return {
		app: "vdo-tabletop",
		version: 1,
		id: createId("msg"),
		type,
		room: state.room,
		authorId: clientId,
		authorName: state.playerName,
		authorRole: state.role,
		timestamp: Date.now(),
		payload
	};
}

function sendTabletopMessage(type, payload = {}, targetUuid = null) {
	const envelope = createEnvelope(type, payload);
	seenMessages.add(envelope.id);
	if (broadcastChannel) {
		broadcastChannel.postMessage(envelope);
	}
	if (vdoFrame.contentWindow) {
		const message = {
			sendData: { tabletopNinja: envelope },
			type: "pcs"
		};
		if (targetUuid) {
			message.UUID = targetUuid;
		}
		vdoFrame.contentWindow.postMessage(message, "*");
	}
	return envelope;
}

function broadcastSnapshot(reason = "snapshot", targetUuid = null) {
	syncStatus.textContent = "Synced";
	syncStatus.dataset.state = "live";
	return sendTabletopMessage("snapshot", { reason, state: getPublicState() }, targetUuid);
}

function getPublicState() {
	const publicState = clone(state);
	const visibleAssetIds = {};
	const hiddenAssetIds = {};

	publicState.rolls = publicState.rolls.filter(roll => !roll.privateRoll);
	publicState.scenes = publicState.scenes.map(scene => {
		const publicScene = { ...scene };
		if (publicScene.mapAssetId) {
			visibleAssetIds[publicScene.mapAssetId] = true;
		}
		publicScene.tokens = publicScene.tokens.filter(token => {
			if (token.hidden) {
				if (token.assetId) {
					hiddenAssetIds[token.assetId] = true;
				}
				return false;
			}
			if (token.assetId) {
				visibleAssetIds[token.assetId] = true;
			}
			return true;
		});
		return publicScene;
	});
	publicState.initiative.entries = publicState.initiative.entries.filter(entry => {
		return publicState.scenes.some(scene => scene.tokens.some(token => token.id === entry.tokenId));
	});
	publicState.initiative.activeIndex = Math.min(publicState.initiative.activeIndex, Math.max(0, publicState.initiative.entries.length - 1));

	const assets = publicState.assets && typeof publicState.assets === "object" ? publicState.assets : {};
	publicState.assets = {};
	Object.keys(assets).forEach(assetId => {
		if (!hiddenAssetIds[assetId] || visibleAssetIds[assetId]) {
			publicState.assets[assetId] = assets[assetId];
		}
	});
	return publicState;
}

function getExportState() {
	return clone(state);
}

function canAcceptSnapshot(envelope) {
	if (!envelope || envelope.authorRole !== "gm" || !envelope.authorId) {
		return false;
	}
	if (envelope.timestamp && lastAcceptedSnapshotTimestamp && envelope.timestamp < lastAcceptedSnapshotTimestamp) {
		return false;
	}
	if (envelope.timestamp) {
		lastAcceptedSnapshotTimestamp = envelope.timestamp;
	}
	return true;
}

function requestSnapshot(options = {}) {
	sendTabletopMessage("snapshot-request", { wantedAt: Date.now() });
	if (!options.quiet) {
		syncStatus.textContent = "Waiting for GM";
		syncStatus.dataset.state = "warn";
	}
}

function sendIntent(intent, payload = {}) {
	if (state.role === "gm") {
		applyIntent({ intent, payload, authorId: clientId, authorName: state.playerName, authorRole: state.role });
		broadcastSnapshot(intent);
		return;
	}
	sendTabletopMessage("intent", { intent, payload });
	showToast("Sent to GM");
}

function handleTransportMessage(message, source) {
	const envelope = message && message.tabletopNinja ? message.tabletopNinja : message;
	if (!envelope || envelope.app !== "vdo-tabletop" || envelope.room !== state.room) {
		return;
	}
	if (envelope.authorId === clientId || seenMessages.has(envelope.id)) {
		return;
	}
	seenMessages.add(envelope.id);
	if (seenMessages.size > 500) {
		const first = seenMessages.values().next().value;
		seenMessages.delete(first);
	}

	if (envelope.type === "snapshot") {
		if (state.role !== "gm" && envelope.payload && envelope.payload.state && canAcceptSnapshot(envelope)) {
			const localRole = state.role;
			const localName = state.playerName;
			const localPassword = state.password;
			state = normalizeState(envelope.payload.state);
			state.role = localRole;
			state.playerName = localName;
			state.password = localPassword;
			state.players[clientId] = { id: clientId, name: state.playerName, role: state.role, updatedAt: Date.now() };
			syncStatus.textContent = "Synced";
			syncStatus.dataset.state = "live";
			saveState();
			renderAll();
		}
	} else if (envelope.type === "snapshot-request") {
		if (state.role === "gm") {
			broadcastSnapshot("late-join", source === "vdo" ? envelope.sourceUuid : null);
		}
	} else if (envelope.type === "intent") {
		if (state.role === "gm" && envelope.payload) {
			applyIntent({
				intent: envelope.payload.intent,
				payload: envelope.payload.payload || {},
				authorId: envelope.authorId,
				authorName: envelope.authorName,
				authorRole: envelope.authorRole
			});
			broadcastSnapshot(envelope.payload.intent || "intent");
		}
	} else if (envelope.type === "handout-show" && envelope.payload) {
		if (envelope.payload.handout && !state.handouts.some(item => item.id === envelope.payload.handout.id)) {
			state.handouts.push(envelope.payload.handout);
			saveState();
			renderHandouts();
		}
		showHandout(envelope.payload.handoutId);
	} else if (envelope.type === "ping" && envelope.payload) {
		if (envelope.payload.sourceClientId === clientId) {
			return;
		}
		addPingMarker(envelope.payload.x, envelope.payload.y);
	}
}

function applyIntent(intentMessage) {
	const scene = getActiveScene();
	if (!scene || !intentMessage) {
		return false;
	}
	const { intent, payload, authorName, authorRole } = intentMessage;
	if (intent === "roll") {
		const roll = buildRoll(payload.formula, authorName || "Player", payload.privateRoll);
		if (!roll) {
			return false;
		}
		state.rolls.unshift(roll);
		state.rolls = state.rolls.slice(0, 80);
		applyLocalMutation("roll", { broadcast: false });
		return true;
	}
	if (intent === "ping") {
		if (authorRole !== "gm" && !state.permissions.playersCanPing) {
			return false;
		}
		if (intentMessage.authorId !== clientId) {
			addPingMarker(payload.x, payload.y);
		}
		sendTabletopMessage("ping", { x: payload.x, y: payload.y, sourceClientId: payload.sourceClientId || intentMessage.authorId });
		return true;
	}
	if (intent === "draw") {
		if (authorRole !== "gm" && !state.permissions.playersCanDraw) {
			return false;
		}
		scene.drawings.push(payload.drawing);
		applyLocalMutation("draw", { broadcast: false });
		return true;
	}
	if (intent === "move-token") {
		const token = scene.tokens.find(item => item.id === payload.tokenId);
		if (!token) {
			return false;
		}
		if (authorRole !== "gm") {
			const owner = (token.owner || "").toLowerCase();
			const requester = (authorName || "").toLowerCase();
			if (!state.permissions.playersCanMoveOwned || token.locked || !owner || owner !== requester) {
				return false;
			}
		}
		token.x = payload.x;
		token.y = payload.y;
		applyLocalMutation("move-token", { broadcast: false });
		return true;
	}
	if (intent === "create-token") {
		if (authorRole !== "gm" && !state.permissions.playersCanCreateTokens) {
			return false;
		}
		if (payload.asset && payload.asset.id) {
			state.assets[payload.asset.id] = payload.asset;
		}
		if (!payload.token || !payload.token.assetId || !state.assets[payload.token.assetId]) {
			return false;
		}
		const token = {
			...payload.token,
			id: createId("token"),
			owner: payload.token.owner || authorName || "",
			hidden: false,
			locked: false
		};
		scene.tokens.push(token);
		applyLocalMutation("create-token", { broadcast: false });
		return true;
	}
	return false;
}

function queueRender() {
	if (renderQueued) {
		return;
	}
	renderQueued = true;
	requestAnimationFrame(() => {
		renderQueued = false;
		renderBoard();
	});
}

function renderAll() {
	syncFormFromState();
	renderScenes();
	renderAssets();
	renderTokens();
	renderRolls();
	renderInitiative();
	renderHandouts();
	renderPermissions();
	queueRender();
}

function renderScenes() {
	sceneList.innerHTML = "";
	state.scenes.forEach(scene => {
		const card = document.createElement("button");
		card.type = "button";
		card.className = "scene-card";
		card.dataset.active = scene.id === state.activeSceneId ? "true" : "false";
		card.innerHTML = `
			<div class="scene-card__title"></div>
			<div class="scene-card__meta">${scene.tokens.length} tokens, ${scene.drawings.length} marks</div>
		`;
		card.querySelector(".scene-card__title").textContent = scene.name;
		card.addEventListener("click", () => {
			if (state.role !== "gm") {
				return;
			}
			state.activeSceneId = scene.id;
			selectedTokenId = null;
			applyLocalMutation("scene-switch");
		});
		sceneList.appendChild(card);
	});
}

function renderAssets() {
	assetList.innerHTML = "";
	const assets = Object.values(state.assets).sort((a, b) => b.createdAt - a.createdAt);
	if (!assets.length) {
		const empty = document.createElement("div");
		empty.className = "asset-card";
		empty.innerHTML = "<div></div><div><div class='asset-card__title'>No assets yet</div><div class='asset-card__meta'>Drop images onto the board.</div></div>";
		assetList.appendChild(empty);
		return;
	}
	assets.forEach(asset => {
		const card = document.createElement("button");
		card.type = "button";
		card.className = "asset-card";
		card.innerHTML = `
			<img alt="" />
			<div>
				<div class="asset-card__title"></div>
				<div class="asset-card__meta"></div>
			</div>
		`;
		card.querySelector("img").src = asset.dataUrl;
		card.querySelector(".asset-card__title").textContent = asset.name;
		card.querySelector(".asset-card__meta").textContent = asset.kind === "map" ? "Click to set map" : "Click to add token";
		card.addEventListener("click", () => {
			if (asset.kind === "map") {
				setSceneMap(asset.id);
			} else {
				createTokenFromAsset(asset.id);
			}
		});
		assetList.appendChild(card);
	});
}

function renderTokens() {
	const scene = getActiveScene();
	tokenList.innerHTML = "";
	if (!scene.tokens.length) {
		const empty = document.createElement("div");
		empty.className = "token-card";
		empty.innerHTML = "<div class='token-card__title'>No tokens</div><div class='token-card__meta'>Add image tokens from Assets.</div>";
		tokenList.appendChild(empty);
	}
	scene.tokens.forEach(token => {
		if (state.role !== "gm" && token.hidden) {
			return;
		}
		const card = document.createElement("button");
		card.type = "button";
		card.className = "token-card";
		card.dataset.active = token.id === selectedTokenId ? "true" : "false";
		card.innerHTML = `
			<div class="token-card__title"></div>
			<div class="token-card__meta"></div>
		`;
		card.querySelector(".token-card__title").textContent = token.name;
		card.querySelector(".token-card__meta").textContent = `${token.owner || "GM"}${token.hp !== "" && token.hp !== null ? `, HP ${token.hp}` : ""}${token.hidden ? ", hidden" : ""}${token.locked ? ", locked" : ""}`;
		card.addEventListener("click", () => selectToken(token.id));
		tokenList.appendChild(card);
	});
	const selected = scene.tokens.find(token => token.id === selectedTokenId);
	tokenEditor.dataset.empty = selected ? "false" : "true";
	if (selected) {
		tokenNameInput.value = selected.name || "";
		tokenOwnerInput.value = selected.owner || "";
		tokenHpInput.value = selected.hp ?? "";
		tokenHiddenInput.checked = !!selected.hidden;
		tokenLockedInput.checked = !!selected.locked;
	}
}

function renderRolls() {
	rollLog.innerHTML = "";
	state.rolls.slice(0, 30).forEach(roll => {
		const card = document.createElement("div");
		card.className = "roll-card";
		card.innerHTML = `
			<div class="roll-card__total"></div>
			<div class="roll-card__formula"></div>
			<div class="roll-card__meta"></div>
		`;
		const total = Number(roll.total);
		card.querySelector(".roll-card__total").textContent = Number.isFinite(total) ? String(total) : "0";
		card.querySelector(".roll-card__formula").textContent = `${roll.formula}: ${roll.detail}`;
		card.querySelector(".roll-card__meta").textContent = `${roll.author} - ${new Date(roll.timestamp).toLocaleTimeString()}`;
		rollLog.appendChild(card);
	});
}

function renderInitiative() {
	initiativeList.innerHTML = "";
	const scene = getActiveScene();
	state.initiative.entries.forEach((entry, index) => {
		const token = scene.tokens.find(item => item.id === entry.tokenId);
		const card = document.createElement("div");
		card.className = "initiative-card";
		card.dataset.active = index === state.initiative.activeIndex ? "true" : "false";
		card.innerHTML = `
			<div>
				<div class="initiative-card__title"></div>
				<div class="token-card__meta"></div>
			</div>
			<input type="number" />
			<button type="button" class="icon-button" title="Remove" aria-label="Remove"><i class="las la-times"></i></button>
		`;
		card.querySelector(".initiative-card__title").textContent = token ? token.name : "Missing token";
		card.querySelector(".token-card__meta").textContent = token && token.owner ? token.owner : "GM";
		card.querySelector("input").value = String(parseInt(entry.score, 10) || 0);
		card.querySelector("input").addEventListener("change", event => {
			entry.score = parseInt(event.target.value, 10) || 0;
			sortInitiative();
			applyLocalMutation("initiative");
		});
		card.querySelector("button").addEventListener("click", () => {
			state.initiative.entries.splice(index, 1);
			state.initiative.activeIndex = Math.min(state.initiative.activeIndex, Math.max(0, state.initiative.entries.length - 1));
			applyLocalMutation("initiative");
		});
		card.addEventListener("click", event => {
			if (event.target.tagName === "INPUT" || event.target.closest("button")) {
				return;
			}
			state.initiative.activeIndex = index;
			if (token) {
				selectToken(token.id);
			}
			applyLocalMutation("initiative");
		});
		initiativeList.appendChild(card);
	});
}

function renderHandouts() {
	handoutList.innerHTML = "";
	if (!state.handouts.length) {
		const empty = document.createElement("div");
		empty.className = "handout-card";
		empty.innerHTML = "<div class='handout-card__title'>No handouts</div><div class='handout-card__meta'>Add images or text files.</div>";
		handoutList.appendChild(empty);
	}
	state.handouts.forEach(handout => {
		const card = document.createElement("button");
		card.type = "button";
		card.className = "handout-card";
		card.innerHTML = `
			<div class="handout-card__title"></div>
			<div class="handout-card__meta"></div>
		`;
		card.querySelector(".handout-card__title").textContent = handout.name;
		card.querySelector(".handout-card__meta").textContent = handout.kind === "image" ? "Image handout" : "Text handout";
		card.addEventListener("click", () => {
			showHandout(handout.id);
			if (state.role === "gm") {
				sendTabletopMessage("handout-show", { handoutId: handout.id, handout });
			}
		});
		handoutList.appendChild(card);
	});
}

function renderPermissions() {
	const isGm = state.role === "gm";
	document.querySelectorAll("#scene-name, #add-scene, #duplicate-scene, #delete-scene, #clear-scene, #grid-enabled, #grid-size, #grid-opacity, #players-can-draw, #players-can-create, #players-can-move-owned, #players-can-ping").forEach(element => {
		element.disabled = !isGm;
	});
	document.querySelectorAll("#token-name, #token-owner, #token-hp, #token-hidden, #token-locked, #delete-token, #add-selected-to-initiative").forEach(element => {
		element.disabled = !isGm;
	});
	publishBoardButton.disabled = !isGm;
}

async function renderBoard() {
	resizeCanvasToDisplay();
	const scene = getActiveScene();
	if (!scene) {
		return;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#0d1016";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate(scene.camera.x, scene.camera.y);
	ctx.scale(scene.camera.zoom, scene.camera.zoom);
	drawWorldBackdrop(scene);
	await drawMap(scene);
	drawGrid(scene);
	drawDrawings(scene);
	await drawTokens(scene);
	drawFog(scene);
	drawCurrentStroke();
	drawMeasurement(scene);
	ctx.restore();
}

function resizeCanvasToDisplay() {
	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	const width = Math.max(320, Math.floor(rect.width * dpr));
	const height = Math.max(240, Math.floor(rect.height * dpr));
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}
}

function drawWorldBackdrop(scene) {
	ctx.fillStyle = "#111827";
	ctx.fillRect(-600, -600, WORLD_WIDTH + 1200, WORLD_HEIGHT + 1200);
	ctx.strokeStyle = "rgba(255,255,255,0.08)";
	ctx.lineWidth = 2 / scene.camera.zoom;
	ctx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
}

async function drawMap(scene) {
	if (!scene.mapAssetId || !state.assets[scene.mapAssetId]) {
		const hasBoardContent = scene.tokens.length || scene.drawings.length || (scene.fog && scene.fog.reveals && scene.fog.reveals.length);
		ctx.fillStyle = "#172033";
		ctx.fillRect(scene.map.x, scene.map.y, scene.map.w, scene.map.h);
		if (!hasBoardContent) {
			ctx.fillStyle = "rgba(255,255,255,0.58)";
			ctx.font = "34px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Drop a map image here", scene.map.x + scene.map.w / 2, scene.map.y + scene.map.h / 2);
		}
		return;
	}
	const image = await loadImage(state.assets[scene.mapAssetId].dataUrl);
	ctx.drawImage(image, scene.map.x, scene.map.y, scene.map.w, scene.map.h);
}

function drawGrid(scene) {
	if (!scene.grid.enabled) {
		return;
	}
	const size = Math.max(8, scene.grid.size || 64);
	const bounds = visibleWorldBounds(scene);
	ctx.save();
	ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, scene.grid.opacity || 0.35))})`;
	ctx.lineWidth = 1 / scene.camera.zoom;
	ctx.beginPath();
	for (let x = Math.floor(bounds.left / size) * size; x <= bounds.right; x += size) {
		ctx.moveTo(x, bounds.top);
		ctx.lineTo(x, bounds.bottom);
	}
	for (let y = Math.floor(bounds.top / size) * size; y <= bounds.bottom; y += size) {
		ctx.moveTo(bounds.left, y);
		ctx.lineTo(bounds.right, y);
	}
	ctx.stroke();
	ctx.restore();
}

function drawDrawings(scene) {
	for (const drawing of scene.drawings) {
		drawDrawing(drawing);
	}
}

function drawDrawing(drawing) {
	if (!drawing) {
		return;
	}
	ctx.save();
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.strokeStyle = drawing.color || "#f97316";
	ctx.fillStyle = drawing.color || "#f97316";
	ctx.lineWidth = drawing.size || 8;
	if (drawing.type === "stroke" && Array.isArray(drawing.points) && drawing.points.length) {
		ctx.beginPath();
		ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
		drawing.points.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
		ctx.stroke();
	} else if (drawing.type === "text") {
		ctx.font = `${drawing.size || 28}px Arial`;
		ctx.textBaseline = "top";
		ctx.fillText(drawing.text || "", drawing.x, drawing.y);
	}
	ctx.restore();
}

async function drawTokens(scene) {
	const activeEntry = state.initiative.entries[state.initiative.activeIndex];
	for (const token of scene.tokens) {
		if (state.role !== "gm" && token.hidden) {
			continue;
		}
		const asset = state.assets[token.assetId];
		ctx.save();
		ctx.globalAlpha = token.hidden ? 0.45 : 1;
		if (asset) {
			const image = await loadImage(asset.dataUrl);
			ctx.drawImage(image, token.x, token.y, token.w, token.h);
		} else {
			ctx.fillStyle = "#334155";
			ctx.fillRect(token.x, token.y, token.w, token.h);
		}
		ctx.lineWidth = 4 / scene.camera.zoom;
		ctx.strokeStyle = token.id === selectedTokenId ? "#24c68a" : activeEntry && activeEntry.tokenId === token.id ? "#f97316" : "rgba(255,255,255,0.65)";
		ctx.strokeRect(token.x, token.y, token.w, token.h);
		if (token.hp !== "" && token.hp !== null && typeof token.hp !== "undefined") {
			ctx.fillStyle = "rgba(0,0,0,0.76)";
			ctx.fillRect(token.x, token.y + token.h - 28, token.w, 28);
			ctx.fillStyle = "#fff";
			ctx.font = "18px Arial";
			ctx.textAlign = "center";
			ctx.fillText(`HP ${token.hp}`, token.x + token.w / 2, token.y + token.h - 8);
		}
		ctx.fillStyle = "rgba(0,0,0,0.72)";
		ctx.fillRect(token.x, token.y - 28, token.w, 24);
		ctx.fillStyle = "#fff";
		ctx.font = "16px Arial";
		ctx.textAlign = "center";
		ctx.fillText(token.name || "Token", token.x + token.w / 2, token.y - 10);
		ctx.restore();
	}
}

function drawFog(scene) {
	if (!scene.fog || !scene.fog.enabled) {
		return;
	}
	const alpha = state.role === "gm" ? 0.35 : 0.82;
	ctx.save();
	ctx.fillStyle = `rgba(0,0,0,${alpha})`;
	ctx.fillRect(-1000, -1000, WORLD_WIDTH + 2000, WORLD_HEIGHT + 2000);
	ctx.globalCompositeOperation = "destination-out";
	for (const reveal of scene.fog.reveals || []) {
		ctx.beginPath();
		ctx.arc(reveal.x, reveal.y, reveal.r, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.restore();
}

function drawCurrentStroke() {
	if (currentStroke) {
		drawDrawing(currentStroke);
	}
}

function drawMeasurement(scene) {
	if (!currentMeasurement) {
		return;
	}
	ctx.save();
	ctx.strokeStyle = "#f97316";
	ctx.fillStyle = "#f97316";
	ctx.lineWidth = 3 / scene.camera.zoom;
	ctx.beginPath();
	ctx.moveTo(currentMeasurement.start.x, currentMeasurement.start.y);
	ctx.lineTo(currentMeasurement.end.x, currentMeasurement.end.y);
	ctx.stroke();
	ctx.restore();
}

function visibleWorldBounds(scene) {
	return {
		left: -scene.camera.x / scene.camera.zoom,
		top: -scene.camera.y / scene.camera.zoom,
		right: (canvas.width - scene.camera.x) / scene.camera.zoom,
		bottom: (canvas.height - scene.camera.y) / scene.camera.zoom
	};
}

function loadImage(src) {
	if (imageCache.has(src)) {
		return imageCache.get(src);
	}
	const promise = new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = reject;
		image.src = src;
	});
	imageCache.set(src, promise);
	return promise;
}

function screenToWorld(clientX, clientY) {
	const scene = getActiveScene();
	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	const sx = (clientX - rect.left) * dpr;
	const sy = (clientY - rect.top) * dpr;
	return {
		x: (sx - scene.camera.x) / scene.camera.zoom,
		y: (sy - scene.camera.y) / scene.camera.zoom,
		screenX: sx,
		screenY: sy
	};
}

function worldToScreen(x, y) {
	const scene = getActiveScene();
	return {
		x: x * scene.camera.zoom + scene.camera.x,
		y: y * scene.camera.zoom + scene.camera.y
	};
}

function tokenAt(worldPoint) {
	const scene = getActiveScene();
	for (let i = scene.tokens.length - 1; i >= 0; i -= 1) {
		const token = scene.tokens[i];
		if (state.role !== "gm" && token.hidden) {
			continue;
		}
		if (worldPoint.x >= token.x && worldPoint.x <= token.x + token.w && worldPoint.y >= token.y && worldPoint.y <= token.y + token.h) {
			return token;
		}
	}
	return null;
}

function selectToken(tokenId) {
	selectedTokenId = tokenId;
	renderTokens();
	queueRender();
}

function setSceneMap(assetId) {
	if (state.role !== "gm") {
		showToast("Only the GM can change maps.");
		return;
	}
	const scene = getActiveScene();
	const asset = state.assets[assetId];
	if (!asset || !scene) {
		return;
	}
	scene.mapAssetId = assetId;
	const ratio = asset.width && asset.height ? asset.width / asset.height : 16 / 9;
	scene.map.w = 1600;
	scene.map.h = Math.round(scene.map.w / ratio);
	if (scene.map.h > 1200) {
		scene.map.h = 1200;
		scene.map.w = Math.round(scene.map.h * ratio);
	}
	scene.map.x = 0;
	scene.map.y = 0;
	applyLocalMutation("map");
	showToast("Map set");
}

function createTokenFromAsset(assetId, atPoint = null) {
	if (!canCreateToken()) {
		showToast("Token creation is locked.");
		return;
	}
	const scene = getActiveScene();
	const asset = state.assets[assetId];
	if (!scene || !asset) {
		return;
	}
	const point = atPoint || { x: scene.map.x + 120, y: scene.map.y + 120 };
	const size = Math.max(48, scene.grid.size || 64);
	const token = {
		id: createId("token"),
		assetId,
		name: asset.name.replace(/\.[^.]+$/, "").slice(0, 48) || "Token",
		owner: state.role === "gm" ? "" : state.playerName,
		x: point.x - size / 2,
		y: point.y - size / 2,
		w: size,
		h: size,
		hp: "",
		hidden: false,
		locked: false,
		status: []
	};
	if (state.role === "gm") {
		scene.tokens.push(token);
		selectedTokenId = token.id;
		applyLocalMutation("token");
	} else {
		sendIntent("create-token", { assetId, asset, token });
	}
}

function sortInitiative() {
	state.initiative.entries.sort((a, b) => (parseInt(b.score, 10) || 0) - (parseInt(a.score, 10) || 0));
	state.initiative.activeIndex = Math.min(state.initiative.activeIndex, Math.max(0, state.initiative.entries.length - 1));
}

function buildRoll(input, author, privateRoll = false) {
	const formula = normalizeRollFormula(input);
	if (!formula) {
		showToast("Roll format not understood.");
		return null;
	}
	const parsed = parseRollFormula(formula);
	if (!parsed) {
		showToast("Roll format not understood.");
		return null;
	}
	const dice = [];
	for (let i = 0; i < parsed.count; i += 1) {
		dice.push(1 + Math.floor(Math.random() * parsed.sides));
	}
	let used = dice.slice();
	if (parsed.keep === "kh") {
		used = dice
			.slice()
			.sort((a, b) => b - a)
			.slice(0, parsed.keepCount);
	} else if (parsed.keep === "kl") {
		used = dice
			.slice()
			.sort((a, b) => a - b)
			.slice(0, parsed.keepCount);
	}
	const total = used.reduce((sum, value) => sum + value, 0) + parsed.modifier;
	const detail = `[${dice.join(", ")}]${parsed.keep ? ` ${parsed.keep}${parsed.keepCount} -> [${used.join(", ")}]` : ""}${parsed.modifier ? ` ${parsed.modifier > 0 ? "+" : ""}${parsed.modifier}` : ""}`;
	return {
		id: createId("roll"),
		formula,
		total,
		dice,
		used,
		detail,
		author: author || "Player",
		privateRoll: !!privateRoll,
		timestamp: Date.now()
	};
}

function normalizeRollFormula(value) {
	const raw = (value || "").trim().toLowerCase().replace(/\s+/g, "");
	if (!raw) {
		return "";
	}
	if (raw === "adv" || raw === "advantage") {
		return "2d20kh1";
	}
	if (raw === "dis" || raw === "disadvantage") {
		return "2d20kl1";
	}
	if (/^d\d+/.test(raw)) {
		return `1${raw}`;
	}
	return raw;
}

function parseRollFormula(formula) {
	const match = formula.match(/^(\d{1,3})d(\d{1,4})(?:(kh|kl)(\d{1,3}))?([+-]\d{1,4})?$/i);
	if (!match) {
		return null;
	}
	const count = Math.min(100, Math.max(1, parseInt(match[1], 10)));
	const sides = Math.min(10000, Math.max(2, parseInt(match[2], 10)));
	const keep = match[3] || "";
	const keepCount = keep ? Math.min(count, Math.max(1, parseInt(match[4], 10) || 1)) : count;
	const modifier = match[5] ? parseInt(match[5], 10) : 0;
	return { count, sides, keep, keepCount, modifier };
}

async function addImageAsset(file, kind) {
	if (!file || !file.type.startsWith("image/")) {
		showToast("Choose an image file.");
		return null;
	}
	const image = await fileToCompressedImage(file);
	const asset = {
		id: createId("asset"),
		kind,
		name: file.name || (kind === "map" ? "Map" : "Token"),
		type: image.type,
		dataUrl: image.dataUrl,
		width: image.width,
		height: image.height,
		createdAt: Date.now()
	};
	state.assets[asset.id] = asset;
	if (kind === "map") {
		setSceneMap(asset.id);
	} else {
		applyLocalMutation("asset");
	}
	return asset;
}

async function fileToCompressedImage(file) {
	const dataUrl = await readFileAsDataUrl(file);
	const image = await loadImage(dataUrl);
	const scale = Math.min(1, IMAGE_MAX_EDGE / Math.max(image.width, image.height));
	const width = Math.max(1, Math.round(image.width * scale));
	const height = Math.max(1, Math.round(image.height * scale));
	const work = document.createElement("canvas");
	work.width = width;
	work.height = height;
	const workCtx = work.getContext("2d");
	workCtx.drawImage(image, 0, 0, width, height);
	let output = "";
	try {
		output = work.toDataURL("image/webp", 0.86);
	} catch (error) {
		output = work.toDataURL("image/jpeg", 0.86);
	}
	return { dataUrl: output, width, height, type: output.slice(5, output.indexOf(";")) };
}

function readFileAsDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function readFileAsText(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsText(file);
	});
}

function showToast(message) {
	toast.textContent = message;
	toast.dataset.show = "true";
	clearTimeout(toast.hideTimer);
	toast.hideTimer = setTimeout(() => {
		toast.dataset.show = "false";
	}, 1800);
}

function addPingMarker(x, y) {
	const marker = document.createElement("div");
	marker.className = "ping-marker";
	const point = worldToScreen(x, y);
	const dpr = window.devicePixelRatio || 1;
	marker.style.left = `${point.x / dpr}px`;
	marker.style.top = `${point.y / dpr}px`;
	boardHud.appendChild(marker);
	setTimeout(() => marker.remove(), 1300);
}

function showHandout(handoutId) {
	const handout = state.handouts.find(item => item.id === handoutId);
	if (!handout) {
		return;
	}
	handoutTitle.textContent = handout.name;
	handoutBody.innerHTML = "";
	if (handout.kind === "image") {
		const image = document.createElement("img");
		image.src = handout.dataUrl;
		image.alt = handout.name;
		handoutBody.appendChild(image);
	} else {
		const pre = document.createElement("pre");
		pre.textContent = handout.text || "";
		handoutBody.appendChild(pre);
	}
	handoutModal.classList.remove("hidden");
}

function exportState() {
	const blob = new Blob([JSON.stringify(getExportState(), null, "\t")], { type: "application/json" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.download = `${state.room || "tabletop"}-tabletop.json`;
	document.body.appendChild(link);
	link.click();
	link.remove();
	setTimeout(() => URL.revokeObjectURL(link.href), 1000);
	showToast("Session exported");
}

async function importStateFile(file) {
	if (!file) {
		return;
	}
	try {
		const next = JSON.parse(await readFileAsText(file));
		const localRole = state.role;
		const localName = state.playerName;
		const localPassword = state.password;
		state = normalizeState(next);
		state.role = localRole;
		state.playerName = localName;
		state.password = localPassword;
		state.room = sanitizeRoom(state.room || roomInput.value);
		selectedTokenId = null;
		applyLocalMutation("import");
		showToast("Session imported");
	} catch (error) {
		showToast("Invalid tabletop file");
	}
	importFileInput.value = "";
}

function publishBoard() {
	if (state.role !== "gm") {
		return;
	}
	if (boardPublishFrame) {
		clearInterval(boardPublishTimer);
		boardPublishFrame.remove();
		boardPublishFrame = null;
		boardPublishTimer = null;
		publishBoardButton.textContent = "Publish Board";
		boardOutputLink.textContent = "";
		showToast("Board output stopped");
		return;
	}
	const streamId = state.boardOutput.streamId || `board-${state.room || Math.random().toString(36).slice(2, 7)}`;
	state.boardOutput.streamId = streamId;
	const url = new URL("../index.html", window.location.href);
	url.searchParams.set("framegrab", "");
	url.searchParams.set("view", "");
	url.searchParams.set("push", streamId);
	url.searchParams.set("room", state.room);
	url.searchParams.set("label", "Tabletop Board");
	url.searchParams.set("cleanoutput", "");
	url.searchParams.set("transparent", "");
	if (state.password) {
		url.searchParams.set("password", state.password);
	}
	boardPublishFrame = document.createElement("iframe");
	boardPublishFrame.className = "hidden";
	boardPublishFrame.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;screen-wake-lock;";
	boardPublishFrame.src = url.toString();
	document.body.appendChild(boardPublishFrame);
	boardPublishTimer = setInterval(() => {
		if (!boardPublishFrame || !boardPublishFrame.contentWindow) {
			return;
		}
		try {
			boardPublishFrame.contentWindow.postMessage({ type: "canvas-frame", frame: canvas.toDataURL("image/webp", 0.82) }, "*");
		} catch (error) {
			console.warn("Unable to publish board frame", error);
		}
	}, 100);
	const view = new URL("../", window.location.href);
	view.searchParams.set("view", streamId);
	view.searchParams.set("room", state.room);
	view.searchParams.set("solo", "");
	view.searchParams.set("sharperscreen", "");
	if (state.password) {
		view.searchParams.set("password", state.password);
	}
	boardOutputLink.textContent = view.toString();
	publishBoardButton.textContent = "Stop Board";
	applyLocalMutation("board-output");
	showToast("Board output publishing");
}

function handlePointerDown(event) {
	const scene = getActiveScene();
	const point = screenToWorld(event.clientX, event.clientY);
	pointerState = {
		pointerId: event.pointerId,
		start: point,
		last: point,
		button: event.button
	};
	canvas.setPointerCapture(event.pointerId);
	if (activeTool === "pan" || event.button === 1 || event.altKey) {
		canvas.style.cursor = "grabbing";
		return;
	}
	if (activeTool === "select") {
		const token = tokenAt(point);
		if (token) {
			selectToken(token.id);
			pointerState.tokenId = token.id;
			pointerState.tokenOffset = { x: point.x - token.x, y: point.y - token.y };
		} else {
			selectToken(null);
		}
		return;
	}
	if (activeTool === "draw") {
		if (!canEditBoard()) {
			showToast("Drawing is locked.");
			return;
		}
		currentStroke = {
			id: createId("draw"),
			type: "stroke",
			color: drawColorInput.value,
			size: parseInt(brushSizeInput.value, 10) || 8,
			points: [{ x: point.x, y: point.y }],
			author: state.playerName,
			timestamp: Date.now()
		};
		return;
	}
	if (activeTool === "erase") {
		if (!canEditBoard()) {
			showToast("Erase is locked.");
			return;
		}
		pointerState.erased = eraseAt(point, false);
		return;
	}
	if (activeTool === "text") {
		if (!canEditBoard()) {
			showToast("Text is locked.");
			return;
		}
		const text = window.prompt("Text to place on the board:");
		if (text) {
			const drawing = {
				id: createId("text"),
				type: "text",
				text: text.slice(0, 240),
				x: point.x,
				y: point.y,
				color: drawColorInput.value,
				size: Math.max(18, parseInt(brushSizeInput.value, 10) * 3),
				author: state.playerName,
				timestamp: Date.now()
			};
			if (state.role === "gm") {
				scene.drawings.push(drawing);
				applyLocalMutation("text");
			} else {
				sendIntent("draw", { drawing });
			}
		}
		return;
	}
	if (activeTool === "measure") {
		currentMeasurement = { start: point, end: point };
		return;
	}
	if (activeTool === "fog") {
		if (state.role !== "gm") {
			showToast("Only the GM controls fog-of-war.");
			return;
		}
		scene.fog.enabled = true;
		scene.fog.reveals.push({ x: point.x, y: point.y, r: Math.max(40, parseInt(brushSizeInput.value, 10) * 5) });
		applyLocalMutation("fog");
		return;
	}
	if (activeTool === "ping") {
		if (state.role === "gm" || state.permissions.playersCanPing) {
			addPingMarker(point.x, point.y);
			sendIntent("ping", { x: point.x, y: point.y, sourceClientId: clientId });
		}
	}
}

function handlePointerMove(event) {
	if (!pointerState) {
		const point = screenToWorld(event.clientX, event.clientY);
		coordinatesLabel.textContent = `${Math.round(point.x)}, ${Math.round(point.y)}`;
		return;
	}
	const scene = getActiveScene();
	const point = screenToWorld(event.clientX, event.clientY);
	const dxScreen = point.screenX - pointerState.last.screenX;
	const dyScreen = point.screenY - pointerState.last.screenY;
	if (activeTool === "pan" || pointerState.button === 1 || event.altKey) {
		scene.camera.x += dxScreen;
		scene.camera.y += dyScreen;
		queueRender();
	} else if (activeTool === "select" && pointerState.tokenId) {
		const token = scene.tokens.find(item => item.id === pointerState.tokenId);
		if (token && canMoveToken(token)) {
			token.x = point.x - pointerState.tokenOffset.x;
			token.y = point.y - pointerState.tokenOffset.y;
			queueRender();
		}
	} else if (activeTool === "draw" && currentStroke) {
		currentStroke.points.push({ x: point.x, y: point.y });
		queueRender();
	} else if (activeTool === "erase") {
		pointerState.erased = eraseAt(point, false) || pointerState.erased;
	} else if (activeTool === "measure" && currentMeasurement) {
		currentMeasurement.end = point;
		const dist = Math.hypot(currentMeasurement.end.x - currentMeasurement.start.x, currentMeasurement.end.y - currentMeasurement.start.y);
		const grid = scene.grid.size || 64;
		const cells = dist / grid;
		const screen = worldToScreen(point.x, point.y);
		const dpr = window.devicePixelRatio || 1;
		measurementLabel.textContent = `${cells.toFixed(1)} squares`;
		measurementLabel.style.left = `${screen.x / dpr + 10}px`;
		measurementLabel.style.top = `${screen.y / dpr + 10}px`;
		measurementLabel.classList.remove("hidden");
		queueRender();
	} else if (activeTool === "fog" && state.role === "gm") {
		scene.fog.enabled = true;
		scene.fog.reveals.push({ x: point.x, y: point.y, r: Math.max(40, parseInt(brushSizeInput.value, 10) * 5) });
		queueRender();
	}
	pointerState.last = point;
	coordinatesLabel.textContent = `${Math.round(point.x)}, ${Math.round(point.y)}`;
}

function handlePointerUp(event) {
	if (!pointerState) {
		return;
	}
	const scene = getActiveScene();
	canvas.releasePointerCapture(event.pointerId);
	canvas.style.cursor = activeTool === "pan" ? "grab" : activeTool === "select" ? "default" : "crosshair";
	if (activeTool === "select" && pointerState.tokenId) {
		const token = scene.tokens.find(item => item.id === pointerState.tokenId);
		if (token && canMoveToken(token)) {
			if (state.role === "gm") {
				applyLocalMutation("move-token");
			} else {
				sendIntent("move-token", { tokenId: token.id, x: token.x, y: token.y });
			}
		}
	}
	if (activeTool === "draw" && currentStroke && currentStroke.points.length > 1) {
		const drawing = currentStroke;
		currentStroke = null;
		if (state.role === "gm") {
			scene.drawings.push(drawing);
			applyLocalMutation("draw");
		} else {
			sendIntent("draw", { drawing });
		}
	}
	if (activeTool === "measure") {
		currentMeasurement = null;
		measurementLabel.classList.add("hidden");
		queueRender();
	}
	if (activeTool === "erase" && pointerState.erased) {
		applyLocalMutation("erase");
	}
	if (activeTool === "fog" && state.role === "gm") {
		applyLocalMutation("fog");
	}
	pointerState = null;
}

function eraseAt(point, commit = true) {
	const scene = getActiveScene();
	const radius = Math.max(8, parseInt(brushSizeInput.value, 10) || 8) * 2;
	const before = scene.drawings.length;
	scene.drawings = scene.drawings.filter(drawing => !drawingNearPoint(drawing, point, radius));
	if (scene.drawings.length !== before) {
		if (commit) {
			applyLocalMutation("erase");
		} else {
			queueRender();
		}
		return true;
	}
	return false;
}

function drawingNearPoint(drawing, point, radius) {
	if (drawing.type === "text") {
		return Math.abs(drawing.x - point.x) < radius * 3 && Math.abs(drawing.y - point.y) < radius * 2;
	}
	if (!Array.isArray(drawing.points)) {
		return false;
	}
	return drawing.points.some(item => Math.hypot(item.x - point.x, item.y - point.y) <= radius);
}

function handleWheel(event) {
	event.preventDefault();
	const scene = getActiveScene();
	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	const sx = (event.clientX - rect.left) * dpr;
	const sy = (event.clientY - rect.top) * dpr;
	const before = screenToWorld(event.clientX, event.clientY);
	const factor = event.deltaY < 0 ? 1.1 : 0.9;
	scene.camera.zoom = Math.max(0.18, Math.min(3.2, scene.camera.zoom * factor));
	scene.camera.x = sx - before.x * scene.camera.zoom;
	scene.camera.y = sy - before.y * scene.camera.zoom;
	queueRender();
	saveState();
	if (state.role === "gm") {
		debouncedBroadcastSnapshot("camera");
	}
}

async function handleBoardDrop(event) {
	event.preventDefault();
	boardShell.dataset.dragging = "false";
	const files = Array.from(event.dataTransfer.files || []);
	if (!files.length) {
		return;
	}
	const world = screenToWorld(event.clientX, event.clientY);
	const kind = event.shiftKey ? "token" : "map";
	for (const file of files) {
		const asset = await addImageAsset(file, kind);
		if (asset && kind === "token") {
			createTokenFromAsset(asset.id, world);
		}
	}
}

function updateSelectedTokenFromEditor() {
	const scene = getActiveScene();
	const token = scene.tokens.find(item => item.id === selectedTokenId);
	if (!token || state.role !== "gm") {
		return;
	}
	token.name = tokenNameInput.value.slice(0, 48) || "Token";
	token.owner = tokenOwnerInput.value.slice(0, 40);
	token.hp = tokenHpInput.value === "" ? "" : Math.max(0, parseInt(tokenHpInput.value, 10) || 0);
	token.hidden = tokenHiddenInput.checked;
	token.locked = tokenLockedInput.checked;
	applyLocalMutation("token-edit");
}

function addSelectedToInitiative() {
	const scene = getActiveScene();
	const token = scene.tokens.find(item => item.id === selectedTokenId);
	if (!token) {
		showToast("Select a token first.");
		return;
	}
	if (!state.initiative.entries.some(entry => entry.tokenId === token.id)) {
		state.initiative.entries.push({ tokenId: token.id, score: 0 });
		sortInitiative();
		applyLocalMutation("initiative");
	}
}

function nextTurn(delta) {
	if (!state.initiative.entries.length) {
		return;
	}
	state.initiative.activeIndex = (state.initiative.activeIndex + delta + state.initiative.entries.length) % state.initiative.entries.length;
	const entry = state.initiative.entries[state.initiative.activeIndex];
	if (entry) {
		selectedTokenId = entry.tokenId;
	}
	applyLocalMutation("initiative");
}

function createScene(copy = false) {
	if (state.role !== "gm") {
		return;
	}
	const source = getActiveScene();
	const scene = copy ? clone(source) : createDefaultState().scenes[0];
	scene.id = createId("scene");
	scene.name = copy ? `${source.name} Copy` : `Scene ${state.scenes.length + 1}`;
	if (copy) {
		scene.tokens = scene.tokens.map(token => ({ ...token, id: createId("token") }));
		scene.drawings = scene.drawings.map(drawing => ({ ...drawing, id: createId("draw") }));
	}
	state.scenes.push(scene);
	state.activeSceneId = scene.id;
	selectedTokenId = null;
	applyLocalMutation("scene");
}

function deleteActiveScene() {
	if (state.role !== "gm" || state.scenes.length < 2) {
		showToast("Keep at least one scene.");
		return;
	}
	const index = state.scenes.findIndex(scene => scene.id === state.activeSceneId);
	state.scenes.splice(index, 1);
	state.activeSceneId = state.scenes[Math.max(0, index - 1)].id;
	selectedTokenId = null;
	applyLocalMutation("scene-delete");
}

function updateSceneSettings() {
	if (state.role !== "gm") {
		return;
	}
	const scene = getActiveScene();
	scene.name = sceneNameInput.value.trim().slice(0, 60) || "Scene";
	scene.grid.enabled = gridEnabledInput.checked;
	scene.grid.size = parseInt(gridSizeInput.value, 10) || 64;
	scene.grid.opacity = Math.max(0, Math.min(1, (parseInt(gridOpacityInput.value, 10) || 0) / 100));
	state.permissions.playersCanDraw = playersCanDrawInput.checked;
	state.permissions.playersCanCreateTokens = playersCanCreateInput.checked;
	state.permissions.playersCanMoveOwned = playersCanMoveOwnedInput.checked;
	state.permissions.playersCanPing = playersCanPingInput.checked;
	applyLocalMutation("settings");
}

function startAppFromParams() {
	roomInput.value = state.room || "";
	nameInput.value = state.playerName || "";
	passwordInput.value = state.password || "";
	roleGm.checked = state.role === "gm";
	rolePlayer.checked = state.role !== "gm";
	if (state.room) {
		enterRoom();
	}
}

setupForm.addEventListener("submit", event => {
	event.preventDefault();
	enterRoom();
});

randomRoomButton.addEventListener("click", () => {
	roomInput.value = randomRoomName();
});

copyRoomButton.addEventListener("click", async () => {
	try {
		await navigator.clipboard.writeText(copyRoomButton.title || window.location.href);
		showToast("Invite copied");
	} catch (error) {
		showToast("Copy failed");
	}
});

snapshotRequestButton.addEventListener("click", () => {
	if (state.role === "gm") {
		broadcastSnapshot("manual");
	} else {
		requestSnapshot();
	}
});

exportButton.addEventListener("click", exportState);
importButton.addEventListener("click", () => importFileInput.click());
importFileInput.addEventListener("change", () => importStateFile(importFileInput.files[0]));
publishBoardButton.addEventListener("click", publishBoard);

toggleVideoRoomButton.addEventListener("click", () => {
	const panel = document.querySelector(".video-panel");
	panel.dataset.collapsed = panel.dataset.collapsed === "true" ? "false" : "true";
});

document.querySelectorAll(".tool-button[data-tool]").forEach(button => {
	button.addEventListener("click", () => setTool(button.dataset.tool));
});

document.querySelectorAll(".tab-button[data-tab]").forEach(button => {
	button.addEventListener("click", () => {
		document.querySelectorAll(".tab-button[data-tab]").forEach(item => item.setAttribute("aria-selected", item === button ? "true" : "false"));
		document.querySelectorAll(".tab-panel[data-panel]").forEach(panel => panel.classList.toggle("hidden", panel.dataset.panel !== button.dataset.tab));
	});
});

addSceneButton.addEventListener("click", () => createScene(false));
duplicateSceneButton.addEventListener("click", () => createScene(true));
deleteSceneButton.addEventListener("click", deleteActiveScene);
clearSceneButton.addEventListener("click", () => {
	if (state.role !== "gm") {
		return;
	}
	getActiveScene().drawings = [];
	applyLocalMutation("clear-drawings");
});
sceneNameInput.addEventListener("change", updateSceneSettings);
gridEnabledInput.addEventListener("change", updateSceneSettings);
gridSizeInput.addEventListener("input", updateSceneSettings);
gridOpacityInput.addEventListener("input", updateSceneSettings);
playersCanDrawInput.addEventListener("change", updateSceneSettings);
playersCanCreateInput.addEventListener("change", updateSceneSettings);
playersCanMoveOwnedInput.addEventListener("change", updateSceneSettings);
playersCanPingInput.addEventListener("change", updateSceneSettings);

mapFileButton.addEventListener("click", () => mapFileInput.click());
tokenFileButton.addEventListener("click", () => tokenFileInput.click());
mapFileInput.addEventListener("change", async () => {
	await addImageAsset(mapFileInput.files[0], "map");
	mapFileInput.value = "";
});
tokenFileInput.addEventListener("change", async () => {
	await addImageAsset(tokenFileInput.files[0], "token");
	tokenFileInput.value = "";
});

tokenNameInput.addEventListener("change", updateSelectedTokenFromEditor);
tokenOwnerInput.addEventListener("change", updateSelectedTokenFromEditor);
tokenHpInput.addEventListener("change", updateSelectedTokenFromEditor);
tokenHiddenInput.addEventListener("change", updateSelectedTokenFromEditor);
tokenLockedInput.addEventListener("change", updateSelectedTokenFromEditor);
deleteTokenButton.addEventListener("click", () => {
	if (state.role !== "gm") {
		return;
	}
	const scene = getActiveScene();
	scene.tokens = scene.tokens.filter(token => token.id !== selectedTokenId);
	state.initiative.entries = state.initiative.entries.filter(entry => entry.tokenId !== selectedTokenId);
	selectedTokenId = null;
	applyLocalMutation("token-delete");
});
addSelectedToInitiativeButton.addEventListener("click", addSelectedToInitiative);

rollForm.addEventListener("submit", event => {
	event.preventDefault();
	const formula = rollInput.value.trim();
	if (!formula) {
		return;
	}
	if (privateRollInput.checked) {
		const roll = buildRoll(formula, state.playerName || "Player", true);
		if (roll) {
			state.rolls.unshift(roll);
			renderRolls();
			saveState();
		}
		return;
	}
	sendIntent("roll", { formula, privateRoll: false });
});

document.querySelectorAll("[data-roll]").forEach(button => {
	button.addEventListener("click", () => {
		rollInput.value = button.dataset.roll;
		rollForm.requestSubmit();
	});
});

prevTurnButton.addEventListener("click", () => nextTurn(-1));
nextTurnButton.addEventListener("click", () => nextTurn(1));
addHandoutButton.addEventListener("click", () => handoutFileInput.click());
handoutFileInput.addEventListener("change", async () => {
	const file = handoutFileInput.files[0];
	if (!file) {
		return;
	}
	if (file.type.startsWith("image/")) {
		const image = await fileToCompressedImage(file);
		state.handouts.push({ id: createId("handout"), kind: "image", name: file.name, dataUrl: image.dataUrl, createdAt: Date.now() });
	} else {
		const text = await readFileAsText(file);
		state.handouts.push({ id: createId("handout"), kind: "text", name: file.name, text: text.slice(0, 20000), createdAt: Date.now() });
	}
	handoutFileInput.value = "";
	applyLocalMutation("handout");
});
closeHandoutButton.addEventListener("click", () => handoutModal.classList.add("hidden"));
handoutModal.addEventListener("click", event => {
	if (event.target === handoutModal) {
		handoutModal.classList.add("hidden");
	}
});

canvas.addEventListener("pointerdown", handlePointerDown);
canvas.addEventListener("pointermove", handlePointerMove);
canvas.addEventListener("pointerup", handlePointerUp);
canvas.addEventListener("pointercancel", handlePointerUp);
canvas.addEventListener("wheel", handleWheel, { passive: false });

boardShell.addEventListener("dragover", event => {
	event.preventDefault();
	boardShell.dataset.dragging = "true";
});
boardShell.addEventListener("dragleave", () => {
	boardShell.dataset.dragging = "false";
});
boardShell.addEventListener("drop", handleBoardDrop);

window.addEventListener("message", event => {
	if (event.source !== vdoFrame.contentWindow || !event.data) {
		return;
	}
	if (event.data.dataReceived) {
		const data = event.data.dataReceived;
		if (data.tabletopNinja) {
			data.tabletopNinja.sourceUuid = event.data.UUID || null;
			handleTransportMessage(data, "vdo");
		}
	}
	if (event.data.action === "joining-room") {
		syncStatus.textContent = "Joining";
		syncStatus.dataset.state = "warn";
	} else if (event.data.action && /connected/.test(event.data.action)) {
		syncStatus.textContent = "Connected";
		syncStatus.dataset.state = "live";
		scheduleTransportSync("transport-connected");
	}
});

window.addEventListener("resize", queueRender);

if ("ResizeObserver" in window) {
	resizeObserver = new ResizeObserver(queueRender);
	resizeObserver.observe(canvas);
}

setTool(TOOL_DEFAULT);
startAppFromParams();

window.__tabletopDebug = {
	getState: () => clone(state),
	setState: next => {
		state = normalizeState(next);
		renderAll();
	},
	receive: message => handleTransportMessage(message, "debug"),
	roll: formula => buildRoll(formula, "Debug", false),
	addImageAsset,
	renderBoard
};
