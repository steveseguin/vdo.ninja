/* VDO.Ninja Authentication Client Integration */

// Configuration
const AUTH_SERVICE_URL = 'https://sso.vdo.ninja'; // Change for local dev: http://localhost:8787

const AUTH_TOKEN_STORAGE_KEY = 'vdo_auth_token';

function isVdoNinjaSSOHost(hostname) {
  hostname = String(hostname || "").toLowerCase();
  return hostname === "vdo.ninja" || hostname.endsWith(".vdo.ninja");
}

function isSSOSupportedOnCurrentHost() {
  try {
    return isVdoNinjaSSOHost(window.location.hostname);
  } catch (e) {
    return false;
  }
}

function decodeJwtPayload(token) {
  try {
    var encoded = String(token || "").split(".")[1];
    if (!encoded) {
      return null;
    }
    encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (encoded.length % 4) {
      encoded += "=";
    }
    var binary = atob(encoded);
    if (typeof TextDecoder !== "undefined") {
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return JSON.parse(new TextDecoder("utf-8").decode(bytes));
    }
    return JSON.parse(decodeURIComponent(escape(binary)));
  } catch (e) {
    return null;
  }
}

// Authentication state
session.authMode = false;
session.requireAuth = false;
session.authToken = null;
session.authUser = null;
session.authImplicitRoomSecret = null;
session.authJoinCache = null;
session.authAccessPromises = {};
session.authAccessCache = {};
session.universalViewTokenPromise = null;
session.authStreamMapping = {};
session.handleToStream = {};
session.authStreamAssignLastStatus = null;
session.authStreamAssignLastError = null;

const AUTH_ACCESS_CACHE_TTL_MS = 5000;

function getAuthAccessCacheKey(roomIdOrAlias, isDirector) {
  return JSON.stringify({
    room: String(roomIdOrAlias || ""),
    isDirector: !!isDirector,
    authToken: session.authToken || null,
    universalToken: session.universalToken || null
  });
}

function getAuthJoinCacheKey(roomIdOrAlias) {
  return JSON.stringify({
    room: String(roomIdOrAlias || ""),
    authToken: session.authToken || null,
    universalToken: session.universalToken || null
  });
}

function getCachedAuthJoin(roomIdOrAlias) {
  const cache = session.authJoinCache;
  if (!cache || cache.key !== getAuthJoinCacheKey(roomIdOrAlias)) {
    return null;
  }
  if (!cache.roomPassword || session.authImplicitRoomSecret !== cache.roomPassword || session.password !== cache.roomPassword) {
    return null;
  }
  return cache;
}

function rememberAuthJoin(roomIdOrAlias, roomPassword) {
  session.authJoinCache = {
    key: getAuthJoinCacheKey(roomIdOrAlias),
    roomId: session.roomid,
    roomAlias: session.roomAlias || null,
    realRoomId: session.realRoomId || null,
    roomPassword: roomPassword,
    createdAt: Date.now()
  };
}

function clearAuthJoinCache() {
  session.authJoinCache = null;
  session.authAccessPromises = {};
  session.authAccessCache = {};
}

function getStoredAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function saveStoredAuthToken(token) {
  try {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch (e) {}
}

function clearStoredAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (e) {}
}

function removeAuthTokenFromCurrentURL() {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('authtoken');

    if (url.hash) {
      var hashString = url.hash.slice(1);
      var hashPrefix = hashString.charAt(0) === "?" ? "?" : "";
      if (hashPrefix) {
        hashString = hashString.slice(1);
      }
      hashString = hashString.replace(/\?\?/g, "?").replace(/\?/g, "&").replace(/^&/, "");
      var hashParams = new URLSearchParams(hashString);
      if (hashParams.has('authtoken')) {
        hashParams.delete('authtoken');
        var cleanHash = hashParams.toString();
        url.hash = cleanHash ? hashPrefix + cleanHash : "";
      }
    }

    window.history.replaceState({}, document.title, url.toString());
  } catch (e) {}

  try {
    urlParams.delete('authtoken');
  } catch (e) {}
}

function applyAuthRoomSecret(roomIdOrAlias, roomPassword) {
  const sameSecret = session.authImplicitRoomSecret === roomPassword && session.password === roomPassword;
  session.authImplicitRoomSecret = roomPassword;
  session.password = roomPassword;
  // Keep auth room secrets implicit so generated URLs do not expose them.
  session.defaultPassword = roomPassword;
  if (!sameSecret) {
    session.hash = false;
  }
  rememberAuthJoin(roomIdOrAlias, roomPassword);
}

async function getAuthRoomScope(roomId = null) {
  const roomName = session.roomid || roomId || 'lobby';
  if (session.password) {
    const token = session.token || "";
    return await generateHash(roomName + session.password + session.salt + token, 16);
  }
  return roomName;
}

async function getAuthOriginalPasswordScope(roomId = null) {
  if (session.defaultPassword !== false || !session.password) {
    return null;
  }
  const roomName = session.roomid || roomId || 'lobby';
  const token = session.token || "";
  return await generateHash(roomName + session.password + session.salt + token, 16);
}

// Initialize authentication
async function initAuthentication() {
  // Check URL parameters for universal token first
  if (urlParams.has("universaltoken")) {
    session.universalToken = urlParams.get("universaltoken");
    session.authMode = true;
    console.log('Universal token detected:', session.universalToken);
    // Universal tokens bypass auth requirement for viewing
    if (session.view || session.scene || session.solo) {
      session.requireAuth = false;
      console.log('Auth requirement bypassed for viewing');
    }
  }
  
  // Check URL parameters
  if (urlParams.has("auth") || urlParams.has("requireauth") || urlParams.has("authtoken")) {
    session.authMode = true;
    session.requireAuth = urlParams.has("requireauth");
    
    // Check for an existing auth token scoped to this room URL.
    const storedToken = getStoredAuthToken();
    if (storedToken) {
      try {
        // Validate token is still valid
        const payload = decodeJwtPayload(storedToken);
        if (payload && payload.exp > Date.now() / 1000) {
          session.authToken = storedToken;
          await populateUserInfo();
        } else {
          clearStoredAuthToken();
        }
      } catch (e) {
        clearStoredAuthToken();
      }
    }
    
    // Check for auth token in URL (after OAuth redirect)
    if (urlParams.has("authtoken")) {
      session.authToken = urlParams.get("authtoken");
      saveStoredAuthToken(session.authToken);

      // Clean query or fragment token from the visible URL.
      removeAuthTokenFromCurrentURL();
      
      await populateUserInfo();
    }
    
    // Check if we need to verify room requirements
    if (!session.authToken && session.authMode && (urlParams.has("room") || urlParams.has("roomid") || urlParams.has("r"))) {
      const roomId = urlParams.get("room") || urlParams.get("roomid") || urlParams.get("r");
      if (roomId) {
        // Check if this room requires auth
        try {
          const roomInfo = await checkRoomAccess(roomId, urlParams.has("director") || urlParams.has("dir"));
          if (roomInfo.requiresAuth) {
            session.requireAuth = true;
          }
        } catch (e) {
          console.log('Could not check room requirements:', e);
        }
      }
    }
    
    // Show auth UI if required and not authenticated
    if (!session.authToken && (session.requireAuth || session.director)) {
      // If the page is in auth mode or the director is attempting to use auth,
      // encourage sign-in proactively.
      showAuthUI();
    }
  }
}

// Show authentication UI
function showAuthUI(options = {}) {
  const authContainer = document.createElement('div');
  authContainer.id = 'auth-container';
  const isDirectorAuthURL = session.director || urlParams.has("director") || urlParams.has("dir");
  const canDisableSSO = isDirectorAuthURL && session.authMode && !session.universalToken && !session.decrypted && !options.hideDisableSSO;
  authContainer.innerHTML = `
    <div class="auth-modal">
      <h2>Sign in to VDO.Ninja</h2>
      <p>${options.message || 'Sign in to claim your personal stream ID and enable advanced features'}</p>
      
      <div class="auth-buttons">
        <button onclick="socialSignIn('google')" class="auth-button google">
          <img src="./media/google.png" alt="Google">
          Sign in with Google
        </button>
        <button onclick="socialSignIn('discord')" class="auth-button discord">
          <img src="./media/discord.png" alt="Discord">
          Sign in with Discord
        </button>
        <button onclick="socialSignIn('twitch')" class="auth-button twitch">
          <img src="./media/twitch.png" alt="Twitch">
          Sign in with Twitch
        </button>
      </div>
      
      ${(!session.requireAuth && !options.requireAuth) ? '<button onclick="skipAuth()" class="skip-auth">Continue without signing in</button>' : ''}
      ${canDisableSSO ? '<div style="display:flex; align-items:center; gap:0.75rem; margin:1rem 0 0.25rem 0; color:var(--text-color-secondary, #aaa); font-size:0.8rem;"><span style="flex:1; border-top:1px solid var(--border-color, #444);"></span><span>or</span><span style="flex:1; border-top:1px solid var(--border-color, #444);"></span></div><button onclick="disableDirectorSSO()" class="skip-auth" style="margin-top:0.5rem;">Enter room without SSO</button><p style="font-size:0.78rem; line-height:1.35; opacity:0.85; margin:0.5rem 0 0 0;">Disables SSO for this director room. New guest links will not include SSO; older SSO guest invites may not join this room.</p>' : ''}
    </div>
  `;
  
  document.body.appendChild(authContainer);
}

// Social sign-in handler
function socialSignIn(provider) {
  const returnUrl = encodeURIComponent(window.location.href);
  window.location.href = `${AUTH_SERVICE_URL}/auth/${provider}?returnUrl=${returnUrl}`;
}

// Skip authentication
function skipAuth() {
  const authContainer = document.getElementById('auth-container');
  if (authContainer) {
    authContainer.remove();
  }
  session.authSkipped = true;
}

// Disable SSO for a director URL and reload into the normal room path.
function disableDirectorSSO() {
  if (!session.director && !urlParams.has("director") && !urlParams.has("dir")) {
    return;
  }
  session.authSkipped = true;
  session.authMode = false;
  session.requireAuth = false;
  session.authImplicitRoomSecret = null;
  clearAuthJoinCache();
  clearStoredAuthToken();
  session.universalToken = null;
  session.universalViewToken = null;
  session.universalViewTokenPromise = null;
  session.pendingRoomSettings = null;
  session.roomAlias = null;
  session.realRoomId = null;
  session.defaultPassword = session.sitePassword;
  session.password = session.sitePassword;
  session.hash = false;
  try {
    sessionStorage.removeItem('vdo_pending_room_settings');
    sessionStorage.removeItem('vdo_pending_room_settings_recover');
    sessionStorage.setItem('vdo_sso_disabled_notice', '1');
  } catch (e) {}

  try {
    const authParams = ["auth", "requireauth", "authtoken", "universaltoken"];
    const url = new URL(window.location.href);
    authParams.forEach(param => url.searchParams.delete(param));
    if (url.hash) {
      var hashString = url.hash.slice(1);
      var hashPrefix = hashString.charAt(0) === "?" ? "?" : "";
      if (hashPrefix) {
        hashString = hashString.slice(1);
      }
      hashString = hashString.replace(/\?\?/g, "?").replace(/\?/g, "&").replace(/^&/, "");
      var hashParams = new URLSearchParams(hashString);
      authParams.forEach(param => hashParams.delete(param));
      var cleanHash = hashParams.toString();
      url.hash = cleanHash ? (hashPrefix || "?") + cleanHash : "";
    }
    try {
      window.removeEventListener("beforeunload", confirmUnload);
    } catch (e2) {}
    window.location.replace(url.toString());
  } catch (e) {
    try {
      window.removeEventListener("beforeunload", confirmUnload);
    } catch (e2) {}
    window.location.reload();
  }
}

// Sign out of SSO
function ssoSignOut() {
  session.authToken = null;
  session.authUser = null;
  session.authMode = false;
  session.requireAuth = false;
  session.authImplicitRoomSecret = null;
  clearAuthJoinCache();
  session.universalViewToken = null;
  session.universalViewTokenPromise = null;
  session.universalToken = null;
  session.userHandle = null;
  if (session.originalStreamID) {
    session.streamID = session.originalStreamID;
  }
  session.originalStreamID = null;
  session.authStreamID = null;
  session.realStreamID = null;
  session.authStreamAssigned = false;
  session.authStreamAssignedRoomId = null;
  session.authStreamAssignedRoomScope = null;
  session.authStreamAssignLastStatus = null;
  session.authStreamAssignLastError = null;
  session.streamSecret = null;
  // Clear auth-derived room secret state so future joins use normal defaults.
  session.defaultPassword = session.sitePassword;
  session.password = session.sitePassword;
  if ((session.password === undefined) || (session.password === null)) {
    session.password = session.defaultPassword;
  }
  if ((session.password === undefined) || (session.password === null)) {
    session.password = false;
  }
  session.hash = false;
  session.roomAlias = null;
  session.realRoomId = null;
  session.pendingRoomSettings = null;
  try {
    sessionStorage.removeItem('vdo_pending_room_settings');
    sessionStorage.removeItem('vdo_pending_room_settings_recover');
  } catch (e) {}
  var passwordInput = document.getElementById('passwordRoom');
  if (passwordInput) {
    passwordInput.value = '';
  }
  updateStreamIDDisplay();
  clearStoredAuthToken();
  var btn = document.getElementById('ssoSignOutBtn');
  if (btn) { btn.style.display = 'none'; }
  var display = document.getElementById('user-info-display');
  if (display) { display.remove(); }
}

// Populate user info from auth token
async function populateUserInfo() {
  if (!session.authToken) return;
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/user/info`, {
      headers: { 'Authorization': `Bearer ${session.authToken}` }
    });
    
    if (response.ok) {
      const userInfo = await response.json();
      session.authUser = userInfo;
      
      // Auto-populate label if not set
      if (!session.label && userInfo.displayName) {
        session.label = userInfo.displayName;
        if (document.getElementById("label_input")) {
          document.getElementById("label_input").value = session.label;
        }
      }
      
      // Auto-populate avatar if not set
      if (!session.avatar && userInfo.avatar) {
        session.avatar = userInfo.avatar;
        updateAvatarDisplay();
      }
      
      // Store user handle
      session.userHandle = userInfo.userHandle;
      
      // Show user info in UI
      showUserInfo(userInfo);

      // Show sign-out button
      var btn = document.getElementById('ssoSignOutBtn');
      if (btn) { btn.style.display = ''; }
    }
  } catch (e) {
    console.error("Failed to get user info:", e);
  }
}

// Show user info in UI
function showUserInfo(userInfo) {
  const existingDisplay = document.getElementById('user-info-display');
  if (existingDisplay) {
    existingDisplay.remove();
  }
  
  const userDisplay = document.createElement('div');
  userDisplay.id = 'user-info-display';
  userDisplay.className = 'user-info-display';

  const img = document.createElement('img');
  img.src = userInfo.avatar || './media/default-avatar.png';
  img.alt = userInfo.displayName || '';

  const details = document.createElement('div');
  details.className = 'user-details';

  const nameDiv = document.createElement('div');
  nameDiv.className = 'user-name';
  nameDiv.textContent = userInfo.displayName || '';

  const handleDiv = document.createElement('div');
  handleDiv.className = 'user-handle';
  handleDiv.textContent = userInfo.userHandle || '';

  details.appendChild(nameDiv);
  details.appendChild(handleDiv);
  userDisplay.appendChild(img);
  userDisplay.appendChild(details);
  
  // Add to appropriate location based on current view
  const targetElement = document.querySelector('.header-container') || document.querySelector('.container');
  if (targetElement) {
    targetElement.insertBefore(userDisplay, targetElement.firstChild);
  }
}

// Assign authenticated stream ID
async function assignAuthStream(roomId = null, options = {}) {
  roomId = roomId || 'lobby';
  options = options || {};
  const roomScope = await getAuthRoomScope(roomId);
  if (!session.authToken || (!options.force && session.authStreamAssigned && session.authStreamAssignedRoomId === roomId && session.authStreamAssignedRoomScope === roomScope)) return true;
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: roomId,
        roomScope: roomScope,
        requestedStreamId: session.streamID || null,
        deviceLabel: session.streamID || 'camera',
        useEncryption: false // Disabled for now until fully tested
      })
    });
    
    if (response.ok) {
      const assignment = await response.json();

      session.authStreamID = assignment.realStreamId || assignment.streamId || session.streamID;
      session.realStreamID = assignment.realStreamId || session.authStreamID;
      session.streamSecret = assignment.streamSecret;
      session.authStreamAssigned = true;
      session.authStreamAssignedRoomId = roomId;
      session.authStreamAssignedRoomScope = roomScope;
      session.authStreamAssignLastStatus = response.status;
      session.authStreamAssignLastError = null;
      
      console.log("Registered authenticated stream:", session.authStreamID);
      
      // Update any UI showing stream ID
      updateStreamIDDisplay();
      return true;
    }
    const errorData = await response.json().catch(() => ({}));
    session.authStreamAssignLastStatus = response.status;
    session.authStreamAssignLastError = errorData;
    console.error("Failed to assign auth stream:", response.status, errorData);
    if (!options.silent && typeof warnUser === "function") {
      warnUser(errorData.error || "Failed to register authenticated stream ID.", false, false);
    }
  } catch (e) {
    session.authStreamAssignLastStatus = 0;
    session.authStreamAssignLastError = e;
    console.error("Failed to assign auth stream:", e);
  }
  return false;
}

function isAuthStreamAssignmentRetryable() {
  const status = session.authStreamAssignLastStatus;
  return status === 0 || status === 408 || status === 429 || status >= 500;
}

async function ensureAuthStreamAssigned(roomId = null) {
  const attempts = [0, 500, 1500];
  for (let i = 0; i < attempts.length; i++) {
    if (attempts[i]) {
      await new Promise(resolve => setTimeout(resolve, attempts[i]));
    }
    if (await assignAuthStream(roomId, { silent: i > 0 })) {
      return true;
    }
    if (!isAuthStreamAssignmentRetryable()) {
      return false;
    }
  }
  return false;
}

function clearAuthStreamAssignment() {
  session.authStreamAssigned = false;
  session.authStreamAssignedRoomId = null;
  session.authStreamAssignedRoomScope = null;
  session.streamSecret = null;
}

// Generate stream authentication signature
async function generateStreamSignature() {
  if (!session.streamSecret) return null;
  
  const timestamp = Date.now();
  const streamId = session.authStreamID || session.realStreamID || session.streamID;
  const message = `${streamId}:${timestamp}`;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(session.streamSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  const hexSignature = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return {
    streamId: streamId,
    userHandle: session.userHandle,
    timestamp: timestamp,
    signature: hexSignature
  };
}

// Validate incoming stream authentication
async function validateStreamAuth(streamId, authData) {
  if (!session.authToken || !authData) return true;
  
  try {
    const lookupStreamId = getAuthStreamLookupId(authData.streamId || streamId);
    const roomScope = await getAuthRoomScope();
    const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        streamId: lookupStreamId,
        roomId: session.realRoomId || session.roomid || null,
        roomScope: roomScope,
        auth: authData
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.valid && result.userInfo) {
        // Store user info for this stream
        session.authStreamMapping[streamId] = result.userInfo;
        
        // Update UI if this is a director view
        if (session.director) {
          updateStreamDisplay(streamId, result.userInfo);
        }
      }
      return result.valid;
    }
  } catch (e) {
    console.error("Stream validation failed:", e);
  }
  
  return false;
}

// Resolve view handles (e.g., @johndoe) to stream IDs
async function resolveViewHandles(viewList) {
  if (!session.authToken) return viewList;
  
  const resolved = [];
  
  for (const target of viewList) {
    if (target.startsWith('@')) {
      // User handle - resolve to current stream
      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/user/${target}`, {
          headers: { 'Authorization': `Bearer ${session.authToken}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.currentStreamId) {
            resolved.push(data.currentStreamId);
            // Store mapping for UI
            session.handleToStream[target] = data;
          }
        }
      } catch (e) {
        console.error(`Failed to resolve handle ${target}:`, e);
      }
    } else {
      resolved.push(target);
    }
  }
  
  return resolved;
}

// Check room access
async function checkRoomAccess(roomIdOrAlias, isDirector = false) {
  if (!session.authAccessPromises) {
    session.authAccessPromises = {};
  }
  if (!session.authAccessCache) {
    session.authAccessCache = {};
  }
  const accessKey = getAuthAccessCacheKey(roomIdOrAlias, isDirector);
  const cachedAccess = session.authAccessCache && session.authAccessCache[accessKey];
  if (cachedAccess && Date.now() - cachedAccess.createdAt < AUTH_ACCESS_CACHE_TTL_MS) {
    return cachedAccess.data;
  }
  if (session.authAccessPromises[accessKey]) {
    return session.authAccessPromises[accessKey];
  }

  console.log('Checking room access for:', roomIdOrAlias, 'with universal token:', session.universalToken);
  session.authAccessPromises[accessKey] = (async () => {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/room/access`, {
      method: 'POST',
      headers: {
        'Authorization': session.authToken ? `Bearer ${session.authToken}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        room: roomIdOrAlias,
        isDirector: isDirector,
        universalToken: session.universalToken || null
      })
    });

    const data = await response.json();
    console.log('Room access response:', response.status, data);

    // Handle room not found case
    if (response.status === 404 && data && data.error === 'Room not found') {
      return {
        alias: roomIdOrAlias,
        displayName: roomIdOrAlias,
        requiresAuth: true,
        hasAccess: false,
        accessDenied: true,
        denialReason: data.denialReason || 'The director must create this SSO room before guests can join'
      };
    }

    session.authAccessCache[accessKey] = {
      data: data,
      createdAt: Date.now()
    };
    return data;
  })();

  try {
    return await session.authAccessPromises[accessKey];
  } finally {
    delete session.authAccessPromises[accessKey];
  }
}

// Join room with authentication
async function joinRoomWithAuth(roomIdOrAlias) {
  const cachedJoin = getCachedAuthJoin(roomIdOrAlias);
  if (cachedJoin) {
    session.roomid = cachedJoin.roomId;
    session.roomAlias = cachedJoin.roomAlias;
    session.realRoomId = cachedJoin.realRoomId;
    if (!(await ensureAuthStreamAssigned(session.realRoomId || session.roomid))) {
      return false;
    }
    return true;
  }

  // If director is using auth mode but not signed in yet, force sign in first
  if (session.director && session.authMode && !session.authToken && !session.universalToken) {
    const roomLabel = roomIdOrAlias || 'this room';
    showAuthUI({
      message: `Sign in to manage "${roomLabel}"`,
      requireAuth: true
    });
    return false;
  }
  // If we have a universal token, validate it first
  if (session.universalToken) {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/room/validate-universal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: session.universalToken,
          roomId: roomIdOrAlias
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.valid) {
          // Universal token is valid, bypass normal auth
          session.roomid = roomIdOrAlias;
          // Still need the room secret for handshake-level access
          try {
            const secretResp = await fetch(`${AUTH_SERVICE_URL}/api/room/secret/${roomIdOrAlias}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                universalToken: session.universalToken,
                roomPasswordScope: await getAuthOriginalPasswordScope(roomIdOrAlias)
              })
            });
            if (!secretResp.ok) {
              console.error('Failed to fetch room secret:', secretResp.status);
              return false;
            }
            const secretData = await secretResp.json();
            if (!secretData.roomPassword) {
              console.error('Missing room secret in response');
              return false;
            }
            applyAuthRoomSecret(roomIdOrAlias, secretData.roomPassword);
          } catch (e2) {
            console.error('Failed to fetch room secret:', e2);
            return false;
          }
          if (!(await ensureAuthStreamAssigned(session.realRoomId || session.roomid))) {
            return false;
          }
          return true;
        }
      }
    } catch (e) {
      console.error('Failed to validate universal token:', e);
    }
  }
  
  const roomInfo = await checkRoomAccess(roomIdOrAlias, session.director);
  
  if (roomInfo.requiresAuth && !session.authToken && !session.universalToken) {
    if (session.authSkipped) {
      // User already chose to skip auth, show access denied instead of auth UI
      showAccessDeniedUI({
        ...roomInfo,
        denialReason: 'This room requires authentication. Please reload the page and sign in to join.',
        requestAccessUrl: null
      });
      return false;
    } else {
      // First time seeing auth requirement for this room
      const displayLabel = roomInfo.displayName || roomInfo.alias || roomIdOrAlias || roomInfo.roomId || 'this room';
      showAuthUI({
        message: `Sign in to join "${displayLabel}"`,
        requireAuth: true
      });
      return false;
    }
  }
  
  if (roomInfo.accessDenied) {
    showAccessDeniedUI(roomInfo);
    return false;
  }
  
  // Important: For auth rooms, we need to use the original alias for hashing
  // The auth service tracks by the real room ID, but VDO uses the alias
  if (roomInfo.alias && roomInfo.alias === roomIdOrAlias) {
    // User provided the alias, keep using it
    session.roomid = roomIdOrAlias;
  } else if (roomInfo.roomId === roomIdOrAlias) {
    // User provided the real room ID
    session.roomid = roomInfo.alias || roomIdOrAlias;
  } else {
    // Default case
    session.roomid = roomInfo.alias || roomInfo.roomId;
  }
  
  session.roomAlias = roomInfo.alias;
  session.realRoomId = roomInfo.roomId;

  // Fetch room secret to enforce SSO access at the handshake level
  let roomSecretApplied = false;
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (session.authToken) {
      headers['Authorization'] = `Bearer ${session.authToken}`;
    }
    const secretResp = await fetch(`${AUTH_SERVICE_URL}/api/room/secret/${roomIdOrAlias}`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        universalToken: session.universalToken || null,
        roomPasswordScope: await getAuthOriginalPasswordScope(roomIdOrAlias)
      })
    });
    if (!secretResp.ok) {
      console.error('Failed to fetch room secret:', secretResp.status);
    } else {
      const secretData = await secretResp.json();
      if (secretData.roomPassword) {
        applyAuthRoomSecret(roomIdOrAlias, secretData.roomPassword);
        roomSecretApplied = true;
      } else {
        console.error('Missing room secret in response');
      }
    }
  } catch (e) {
    console.error('Failed to fetch room secret:', e);
  }

  if (!roomSecretApplied && (roomInfo.requiresAuth || session.universalToken)) {
    return false;
  }

  if (!(await ensureAuthStreamAssigned(session.realRoomId || session.roomid))) {
    return false;
  }
  return true;
}

// Show access denied UI
function showAccessDeniedUI(roomInfo) {
  const modal = document.createElement('div');
  modal.id = 'auth-container';
  const inner = document.createElement('div');
  inner.className = 'auth-modal access-denied-modal';

  const h3 = document.createElement('h3');
  h3.textContent = 'Access Denied';

  const p = document.createElement('p');
  p.textContent = roomInfo.denialReason || '';

  const btn = document.createElement('button');
  if (roomInfo.requestAccessUrl) {
    btn.textContent = 'Request Access';
    btn.onclick = () => requestRoomAccess(roomInfo.roomId);
  } else {
    btn.textContent = 'Go Back';
    btn.onclick = () => window.location.reload();
  }

  inner.appendChild(h3);
  inner.appendChild(p);
  inner.appendChild(btn);
  modal.appendChild(inner);
  
  document.body.appendChild(modal);
}

// Request room access
async function requestRoomAccess(roomId) {
  if (!session.authToken) {
    showAuthUI({ message: 'Sign in to request access' });
    return;
  }
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/room/request-access/${roomId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`
      }
    });
    
    if (response.ok) {
      alert('Access request sent! The room owner will review your request.');
      document.getElementById('auth-container').remove();
    }
  } catch (e) {
    console.error('Failed to request access:', e);
  }
}

// Update stream display with user info
function updateStreamDisplay(streamId, userInfo) {
  // Update control box if it exists
  const controlBox = document.getElementById(`controls_${streamId}`);
  if (controlBox && userInfo) {
    const header = controlBox.querySelector('.header');
    if (header && !header.querySelector('.user-auth-badge')) {
      const badge = document.createElement('div');
      badge.className = 'user-auth-badge';
      badge.innerHTML = `
        <img src="${userInfo.avatar}" alt="${userInfo.displayName}">
        <span class="user-handle">${userInfo.userHandle}</span>
        <span class="user-provider ${userInfo.provider}">${userInfo.provider}</span>
      `;
      header.appendChild(badge);
    }
  }
  
  // Update any labels showing stream ID
  const labels = document.querySelectorAll(`[data-stream-id="${streamId}"]`);
  labels.forEach(label => {
    if (userInfo && !label.dataset.updated) {
      label.dataset.updated = 'true';
      label.textContent = userInfo.displayName || userInfo.userHandle;
    }
  });
}

// Update avatar display
function updateAvatarDisplay() {
  if (session.avatar) {
    // Update any avatar displays in the UI
    const avatarElements = document.querySelectorAll('.avatar-display');
    avatarElements.forEach(el => {
      el.src = session.avatar;
    });
  }
}

// Update stream ID display
function updateStreamIDDisplay() {
  // Update any UI elements showing the stream ID
  const streamIdElements = document.querySelectorAll('.stream-id-display');
  streamIdElements.forEach(el => {
    el.textContent = session.originalStreamID || session.streamID;
  });
}

function getAuthStreamLookupId(streamId) {
  streamId = String(streamId || "");
  if (session.authMode && session.hash && streamId.endsWith(session.hash)) {
    return streamId.slice(0, -1 * session.hash.length);
  }
  return streamId;
}

// Resolve any stream ID (encrypted or not) through auth service
async function resolveStream(streamId) {
  if (!session.authToken && !session.universalToken) {
    return { error: 'Not authenticated' };
  }

  const lookupStreamId = getAuthStreamLookupId(streamId);
  
  try {
    const roomScope = await getAuthRoomScope();
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (session.authToken) {
      headers['Authorization'] = `Bearer ${session.authToken}`;
    }
    
    const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/resolve`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        streamId: lookupStreamId,
        roomId: session.realRoomId || session.roomid,
        roomScope: roomScope,
        universalToken: session.universalToken
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (session.authMode && !data.userInfo) {
        return { error: 'Stream is not registered for this authenticated room' };
      }
      data.requestedStreamId = streamId;
      data.lookupStreamId = lookupStreamId;
      return data;
    } else if (response.status === 403) {
      return { error: 'Access denied' };
    } else if (response.status === 404) {
      return { error: 'Stream not found' };
    }
  } catch (e) {
    console.error('Failed to resolve stream:', e);
    return { error: 'Failed to resolve stream' };
  }
  
  return { error: 'Unknown error' };
}

// Get encryption key for viewing a stream
async function getStreamKey(streamId) {
  if (!session.authToken) return null;
  
  try {
    const lookupStreamId = getAuthStreamLookupId(streamId);
    const roomScope = await getAuthRoomScope();
    const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        streamId: lookupStreamId,
        roomId: session.realRoomId || session.roomid,
        roomScope: roomScope
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    console.error('Failed to get stream key:', e);
  }
  
  return null;
}

// Decrypt stream ID using XOR cipher
async function decryptStreamId(encryptedId, key) {
  // Add padding if needed
  const base64 = encryptedId
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(encryptedId.length + (4 - encryptedId.length % 4) % 4, '=');
  
  const encrypted = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const keyData = new TextEncoder().encode(key);
  
  const decrypted = new Uint8Array(encrypted.length);
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ keyData[i % keyData.length];
  }
  
  return new TextDecoder().decode(decrypted);
}

// Heartbeat to keep stream active
function startAuthHeartbeat() {
  if (!session.authToken || !session.streamID) return;
  
  setInterval(async () => {
    const streamId = session.authStreamID || session.realStreamID || session.streamID;
    if (session.authToken && streamId) {
      try {
        const roomId = session.authStreamAssignedRoomId || session.realRoomId || session.roomid || 'lobby';
        if (!session.authStreamAssigned) {
          await assignAuthStream(roomId, { silent: true });
          return;
        }

        const roomScope = session.authStreamAssignedRoomScope || await getAuthRoomScope(roomId);
        const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/heartbeat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            streamId: streamId,
            roomId: roomId,
            roomScope: roomScope
          })
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Heartbeat failed:', response.status, errorData);
          if (response.status === 403 || response.status === 404) {
            clearAuthStreamAssignment();
            await assignAuthStream(roomId, { silent: response.status === 404 });
          }
        }
      } catch (e) {
        console.error('Heartbeat failed:', e);
      }
    }
  }, 30000); // Every 30 seconds
}

async function ensureDirectorRoomRecord() {
  if (!session.authToken || !session.roomid) {
    return false;
  }
  if (session.realRoomId) {
    return true;
  }

  const roomInfo = await checkRoomAccess(session.roomid, true);
  if (!roomInfo || roomInfo.accessDenied || !roomInfo.roomId) {
    return false;
  }

  session.roomAlias = roomInfo.alias || session.roomAlias || session.roomid;
  session.realRoomId = roomInfo.roomId;
  if (roomInfo.alias) {
    session.roomid = roomInfo.alias;
  }

  return true;
}

// Create a universal token for view/scene links
async function createUniversalToken() {
  if (!session.authToken || !session.roomid) {
    console.error('Must be authenticated and in a room to create universal token');
    return null;
  }

  if (session.universalViewToken) {
    return session.universalViewToken;
  }
  if (session.universalViewTokenPromise) {
    return session.universalViewTokenPromise;
  }

  session.universalViewTokenPromise = (async () => {
    try {
      if (!await ensureDirectorRoomRecord()) {
        console.error('SSO room is not ready for universal token creation');
        return null;
      }

      const tokenRoomId = session.realRoomId || session.roomid;
      console.log('Creating universal token for room:', tokenRoomId);
      const response = await fetch(`${AUTH_SERVICE_URL}/api/room/universal-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: tokenRoomId,
          description: 'View/Scene access token'
        })
      });

      if (response.ok) {
        const data = await response.json();
        session.universalViewToken = data.token;
        console.log('Created universal token:', data.token);

        // Update all existing solo links
        updateAllSoloLinks();

        return data.token;
      } else {
        console.error('Failed to create universal token:', response.status);
      }
    } catch (e) {
      console.error('Failed to create universal token:', e);
    }

    return null;
  })();

  try {
    return await session.universalViewTokenPromise;
  } finally {
    session.universalViewTokenPromise = null;
  }
}

// Update all solo link displays with new token
function updateAllSoloLinks() {
  // Update director's own solo link if present
  const directorLink = document.querySelector('#grabDirectorSoloLink');
  if (directorLink && session.streamID) {
    const soloLink = soloLinkGenerator(session.streamID, true);
    directorLink.dataset.raw = soloLink;
    directorLink.href = soloLink;
    directorLink.innerText = soloLink;
  }
  
  // Update solo links in control boxes
  document.querySelectorAll('.soloLink').forEach(ele => {
    if (ele.getAttribute('value')) {
      const baseUrl = ele.getAttribute('value');
      // Extract stream ID from the base URL
      const match = baseUrl.match(/[?&]view=([^&]+)/);
      if (match && match[1]) {
        const streamId = match[1];
        const soloLink = soloLinkGenerator(streamId, false);
        ele.href = soloLink;
        ele.innerHTML = soloLink;
      }
    }
  });
}

// Update room settings (access mode, allowlist)
async function updateRoomSettings(roomId, settings) {
  if (!session.authToken) {
    console.error('Must be authenticated to update room settings');
    return null;
  }
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/room/settings/${roomId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settings)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Room settings updated');
      return data;
    } else {
      console.error('Failed to update room settings:', response.status);
    }
  } catch (e) {
    console.error('Failed to update room settings:', e);
  }
  
  return null;
}

// Get pending access requests for a room
async function getRoomAccessRequests(roomId) {
  if (!session.authToken) {
    console.error('Must be authenticated to get access requests');
    return [];
  }
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/room/requests/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${session.authToken}`
      }
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('Failed to get access requests:', e);
  }
  
  return [];
}

// Approve or deny an access request
async function handleAccessRequest(roomId, userId, action) {
  if (!session.authToken) {
    console.error('Must be authenticated to handle access requests');
    return false;
  }
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/room/request/${roomId}/${userId}/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`
      }
    });
    
    return response.ok;
  } catch (e) {
    console.error('Failed to handle access request:', e);
  }
  
  return false;
}

// Export functions for use in main VDO.Ninja code
window.vdoAuth = {
  init: initAuthentication,
  assignStream: assignAuthStream,
  generateSignature: generateStreamSignature,
  validateStream: validateStreamAuth,
  resolveHandles: resolveViewHandles,
  checkRoomAccess: checkRoomAccess,
  joinRoom: joinRoomWithAuth,
  startHeartbeat: startAuthHeartbeat,
  getStreamKey: getStreamKey,
  decryptStreamId: decryptStreamId,
  resolveStream: resolveStream,
  createUniversalToken: createUniversalToken,
  updateRoomSettings: updateRoomSettings,
  getRoomAccessRequests: getRoomAccessRequests,
  handleAccessRequest: handleAccessRequest,
  isSupported: isSSOSupportedOnCurrentHost
};

function isSSOAvailableOnThisHost() {
  try {
    if (window.vdoAuth && typeof window.vdoAuth.isSupported === "function") {
      return window.vdoAuth.isSupported();
    }
  } catch (e) {}
  return isSSOSupportedOnCurrentHost();
}

function toggleSSOOptions(enabled) {
  const box = document.getElementById('ssoOptions');
  if (!box) return;

  if (enabled && !isSSOAvailableOnThisHost()) {
    enabled = false;
    const ssoToggle = document.getElementById('useSSOForRoom');
    if (ssoToggle) {
      ssoToggle.checked = false;
    }
  }

  box.style.display = enabled ? 'block' : 'none';

  const passwordInput = document.getElementById('passwordRoom');
  if (passwordInput) {
    if (enabled) {
      passwordInput.value = '';
      passwordInput.disabled = true;
    } else {
      passwordInput.disabled = false;
    }
  }

  const passwordNote = document.getElementById('passwordRoomSSONote');
  if (passwordNote) {
    passwordNote.style.display = enabled ? 'block' : 'none';
  }

  const listRow = document.getElementById('preAllowlistRow');
  if (!enabled) {
    if (listRow) listRow.style.display = 'none';
    return;
  }

  try {
    const selected = document.querySelector('input[name="ssoAccessMode"]:checked');
    if (selected && selected.value === 'allowlist') {
      if (listRow) listRow.style.display = 'block';
    } else {
      if (listRow) listRow.style.display = 'none';
    }
  } catch (e) {}
}

function initIndexAuthUI() {
  const ssoToggle = document.getElementById('useSSOForRoom');
  const ssoRow = document.getElementById('ssoRoomOptionRow');

  if (!ssoToggle && !ssoRow && !document.getElementById('requireApprovalForRoom')) {
    return;
  }

  if (!isSSOAvailableOnThisHost()) {
    if (ssoRow) {
      ssoRow.style.display = 'none';
    }
    if (ssoToggle) {
      ssoToggle.checked = false;
    }
    toggleSSOOptions(false);
  } else if (ssoToggle) {
    try {
      const params = new URLSearchParams(window.location.search);
      ssoToggle.checked = params.has('auth') || params.has('requireauth');
    } catch (e) {
      ssoToggle.checked = false;
    }
    toggleSSOOptions(!!ssoToggle.checked);
  }

  const roomApprovalToggle = document.getElementById('requireApprovalForRoom');
  if (roomApprovalToggle) {
    try {
      roomApprovalToggle.checked = new URLSearchParams(window.location.search).has('requireapproval');
    } catch (e) {}
  }
}

window.toggleSSOOptions = toggleSSOOptions;
initIndexAuthUI();
