/* VDO.Ninja Authentication Client Integration */

// Configuration
const AUTH_SERVICE_URL = 'https://vdo-ninja-auth-service.vdo.workers.dev'; // Change for local dev: http://localhost:8787

// Authentication state
session.authMode = false;
session.requireAuth = false;
session.authToken = null;
session.authUser = null;
session.authImplicitRoomSecret = null;
session.authStreamMapping = {};
session.handleToStream = {};


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
    
    // Check for existing auth token in localStorage
    const storedToken = localStorage.getItem('vdo_auth_token');
    if (storedToken) {
      try {
        // Validate token is still valid
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          session.authToken = storedToken;
          await populateUserInfo();
        } else {
          localStorage.removeItem('vdo_auth_token');
        }
      } catch (e) {
        localStorage.removeItem('vdo_auth_token');
      }
    }
    
    // Check for auth token in URL (after OAuth redirect)
    if (urlParams.has("authtoken")) {
      session.authToken = urlParams.get("authtoken");
      localStorage.setItem('vdo_auth_token', session.authToken);
      
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('authtoken');
      window.history.replaceState({}, document.title, url.toString());
      
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
  session.universalToken = null;
  session.universalViewToken = null;
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
  session.universalViewToken = null;
  session.universalToken = null;
  session.userHandle = null;
  if (session.originalStreamID) {
    session.streamID = session.originalStreamID;
  }
  session.originalStreamID = null;
  session.authStreamAssigned = false;
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
  localStorage.removeItem('vdo_auth_token');
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
async function assignAuthStream() {
  if (!session.authToken || session.authStreamAssigned) return;
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/assign`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: session.roomid || 'lobby',
        deviceLabel: session.streamID || 'camera',
        useEncryption: false // Disabled for now until fully tested
      })
    });
    
    if (response.ok) {
      const assignment = await response.json();
      
      // Store original stream ID
      session.originalStreamID = session.streamID;
      
      // Use assigned stream ID
      session.streamID = assignment.streamId;
      session.streamSecret = assignment.streamSecret;
      session.authStreamAssigned = true;
      
      console.log("Assigned authenticated stream:", assignment.streamId);
      
      // Update any UI showing stream ID
      updateStreamIDDisplay();
    }
  } catch (e) {
    console.error("Failed to assign auth stream:", e);
  }
}

// Generate stream authentication signature
async function generateStreamSignature() {
  if (!session.streamSecret) return null;
  
  const timestamp = Date.now();
  const message = `${session.streamID}:${timestamp}`;
  
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
    streamId: session.streamID,
    userHandle: session.userHandle,
    timestamp: timestamp,
    signature: hexSignature
  };
}

// Validate incoming stream authentication
async function validateStreamAuth(streamId, authData) {
  if (!session.authToken || !authData) return true;
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        streamId: streamId,
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
  console.log('Checking room access for:', roomIdOrAlias, 'with universal token:', session.universalToken);
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
    // In auth mode, non-existent rooms can be created by authenticated users
    if (session.authToken) {
      // Allow authenticated users to proceed - room will be created on first join
      return {
        roomId: roomIdOrAlias,
        alias: roomIdOrAlias,
        displayName: roomIdOrAlias,
        requiresAuth: false,
        hasAccess: true,
        isNew: true
      };
    } else {
      // Require auth to create new rooms
      return {
        alias: roomIdOrAlias,
        displayName: roomIdOrAlias,
        requiresAuth: true,
        hasAccess: false,
        accessDenied: true,
        denialReason: 'Sign in to create or join this room'
      };
    }
  }
  
  return data;
}

// Join room with authentication
async function joinRoomWithAuth(roomIdOrAlias) {
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
              body: JSON.stringify({ universalToken: session.universalToken })
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
            session.authImplicitRoomSecret = secretData.roomPassword;
            session.password = secretData.roomPassword;
            // Keep auth room secrets implicit so generated URLs do not expose them.
            session.defaultPassword = secretData.roomPassword;
            session.hash = false;
          } catch (e2) {
            console.error('Failed to fetch room secret:', e2);
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
      body: JSON.stringify({ universalToken: session.universalToken || null })
    });
    if (!secretResp.ok) {
      console.error('Failed to fetch room secret:', secretResp.status);
    } else {
      const secretData = await secretResp.json();
      if (secretData.roomPassword) {
        session.authImplicitRoomSecret = secretData.roomPassword;
        session.password = secretData.roomPassword;
        // Keep auth room secrets implicit so generated URLs do not expose them.
        session.defaultPassword = secretData.roomPassword;
        session.hash = false;
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

// Resolve any stream ID (encrypted or not) through auth service
async function resolveStream(streamId) {
  if (!session.authToken && !session.universalToken) {
    return { error: 'Not authenticated' };
  }
  
  try {
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
        streamId: streamId,
        roomId: session.roomid,
        universalToken: session.universalToken
      })
    });
    
    if (response.ok) {
      const data = await response.json();
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
    const response = await fetch(`${AUTH_SERVICE_URL}/api/stream/key`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        streamId: streamId,
        roomId: session.roomid
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
    if (session.authToken && session.streamID && session.authStreamAssigned) {
      try {
        await fetch(`${AUTH_SERVICE_URL}/api/stream/heartbeat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.authToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            streamId: session.streamID,
            roomId: session.roomid || 'lobby'
          })
        });
      } catch (e) {
        console.error('Heartbeat failed:', e);
      }
    }
  }, 30000); // Every 30 seconds
}

// Create a universal token for view/scene links
async function createUniversalToken() {
  if (!session.authToken || !session.roomid) {
    console.error('Must be authenticated and in a room to create universal token');
    return null;
  }
  
  try {
    console.log('Creating universal token for room:', session.roomid);
    const response = await fetch(`${AUTH_SERVICE_URL}/api/room/universal-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomId: session.roomid,
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
  handleAccessRequest: handleAccessRequest
};
