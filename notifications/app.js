document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});
async function initializeApp() {
  try {
    const initialized = await window.notificationManager.initialize();
    console.log('Notification manager initialized:', initialized);
    handleUrlParameters();
    initTabSystem();
    initNotificationBadge();
    checkNotificationPermission();
    setupUrlDetection();
    enhanceTopicInput();
    setupEventListeners();
    setupParseUrlButton();
    checkSavedSubscription();
    updateExampleUrl();
    window.notificationManager.subscribe(handleNotificationEvent);
    const statusCheckInterval = setInterval(() => {
      if (navigator.serviceWorker.controller && localStorage.getItem('notifyTopic')) {
        window.notificationManager.checkStatus()
          .then(status => {
            updateSubscriptionStatusPanel();
          });
      }
    }, 30000);
    const renewalCheckInterval = setInterval(() => {
      if (navigator.serviceWorker.controller && localStorage.getItem('notifyTopic')) {
        window.notificationManager.checkSubscriptionRenewal();
      }
    }, 3600000);
    setTimeout(() => {
      if (navigator.serviceWorker.controller && localStorage.getItem('notifyTopic')) {
        window.notificationManager.checkSubscriptionRenewal();
      }
    }, 10000);
	
	const subscriptionHeartbeatInterval = setInterval(() => {
	  if (navigator.serviceWorker.controller && localStorage.getItem('notifyTopic')) {
		const topic = localStorage.getItem('notifyTopic');
		
		// Ping the server to keep subscription active
		fetch('https://notify.vdo.ninja/ping', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({
			topic: topic
		  })
		}).catch(err => console.warn('Heartbeat error:', err));
		
		// Also periodically test the push subscription
		window.notificationManager.testPushSubscription()
		  .then(result => {
			if (!result.success) {
			  console.log('Push subscription test failed:', result);
			  window.notificationManager.startSubscription(topic);
			}
		  });
	  }
	}, 24 * 60 * 60 * 1000); // Daily check

	const validityCheckInterval = setInterval(() => {
	  if (navigator.serviceWorker.controller && localStorage.getItem('notifyTopic')) {
		window.notificationManager.checkSubscriptionValidity().then(isValid => {
		  if (!isValid) {
			const topic = localStorage.getItem('notifyTopic');
			if (topic) {
			  console.log('Subscription became invalid, resubscribing...');
			  window.notificationManager.startSubscription(topic);
			}
		  }
		});
	  }
	}, 3600000);
    updateSubscriptionStatusPanel();
    console.log('App initialization complete');
  } catch (error) {
    console.error('Error initializing app:', error);
    document.getElementById('notification-status').innerHTML = `
      <div class="status warning">
        <p>Error initializing notification system. Please refresh the page or try again later.</p>
      </div>
    `;
  }
}
async function handleVdoUrlParameter(vdoUrlParam, subscribeParam) {
  try {
    const decodedUrl = decodeURIComponent(vdoUrlParam);
    const result = await parseVdoNinjaUrl(decodedUrl);
    if (result && result.topic) {
      const topicInput = document.getElementById('topic-input');
      if (topicInput) {
        topicInput.value = result.topic;
        updateExampleUrl();
      }
      const urlInput = document.getElementById('vdo-url-input');
      if (urlInput) {
        urlInput.value = generateSafeUrl(decodedUrl);
      }
      if (subscribeParam === 'true' || subscribeParam === '1') {
        setTimeout(() => {
          requestNotificationPermission().then(permission => {
            if (permission === 'granted') {
              startNotificationSubscription(result.topic);
              displayStatusMessage(`✅ Automatically subscribed to: <strong>${escapeNotificationText(result.topic)}</strong>`, 'active');
            }
          });
        }, 1000);
      }
    }
  } catch (error) {
    console.error('Error handling VDO URL parameter:', error);
  }
}
function handleTopicParameter(topicParam) {
  if (!topicParam){return;}
  const topicInput = document.getElementById('topic-input');
  if (topicInput) {
    topicInput.value = topicParam;
  }
  setTimeout(() => {
    requestNotificationPermission().then(permission => {
      if (permission === 'granted') {
        startNotificationSubscription(topicParam);
        displayStatusMessage(`✅ Automatically subscribed to topic: <strong>${escapeNotificationText(topicParam)}</strong>`, 'active');
      }
    });
  }, 1000);
}
function handleUrlParameters() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const subscribeParam = urlParams.get('subscribe');
    const topicParam = urlParams.get('topic');
    const vdoUrlParam = urlParams.get('url');
    if (vdoUrlParam) {
      handleVdoUrlParameter(vdoUrlParam, subscribeParam);
    }
    else if (subscribeParam === 'true' || subscribeParam === '1') {
      if (topicParam) {
        handleTopicParameter(topicParam);
      }
    }
    history.replaceState(null, '', window.location.pathname);
  } catch (e) {
    console.error('Error handling URL parameters:', e);
    displayStatusMessage('Error processing URL parameters', 'warning');
  }
}
function extractVdoNinjaUrl(text) {
  if (!text) return null;
  const regex = /(https?:\/\/)?([\w.-]+\.)?(vdo\.ninja|obs\.ninja)(\S*)/gi;
  const match = regex.exec(text);
  if (match) {
    let url = match[0];
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    return url;
  }
  return null;
}
function hashTopic(text) {
  if (!text || typeof text !== 'string') {
    return generateRandomTopic();
  }
  try {
    const salt1 = "VDO_24x89jf3mwqpz";
    const salt2 = "Ninja_7fhGj2P9wq";
    let saltedText = salt1 + text + salt2 + text.split('').reverse().join('');
    let hash = 0;
    for (let i = 0; i < saltedText.length; i++) {
      const char = saltedText.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    let hash2 = 0;
    for (let i = 0; i < saltedText.length; i++) {
      hash2 = ((hash2 << 7) + hash2) + saltedText.charCodeAt(i);
      hash2 = hash2 & hash2;
    }
    const combinedHash = Math.abs(hash).toString(36) + Math.abs(hash2).toString(36);
    if (combinedHash.length < 8) {
      return combinedHash + Math.random().toString(36).substring(2, 10);
    }
    return combinedHash.substring(0, 16);
  } catch (e) {
    console.error('Error in hashTopic:', e);
    return generateRandomTopic();
  }
}
function addParamToUrl(url, param, value) {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set(param, value);
    return urlObj.toString();
  } catch (e) {
    console.error('Error adding param to URL:', e);
    return url;
  }
}
async function parseVdoNinjaUrl(url) {
  try {
    if (typeof url !== 'string') {
      throw new Error('Invalid URL: must be a string');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    if (!url.includes('vdo.ninja') && !url.includes('obs.ninja') && !url.includes('versus.cam') && !url.includes('comms.cam')) {
      throw new Error('Not a valid VDO.Ninja URL');
    }
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const existingTopic = params.get('poke');
    if (existingTopic) {
      return {
        topic: existingTopic,
        notificationUrl: url,
        originalUrl: url,
        isExistingTopic: true
      };
    }
    const roomId = params.get('room') || params.get('roomid') || params.get('r') || '';
    const directorId = params.get('director') || params.get('dir') || '';
    const pushId = params.get('push') || params.get('id') || params.get('permaid') || '';
    const viewId = params.get('streamid') || params.get('view') || params.get('v') || params.get('pull') || '';
    const password = params.get('password') || '';
    const hash = params.get('hash') || '';
    const scene = params.get('scene') || params.get('scn') || '';
    const components = {
      room: roomId,
      director: directorId,
      push: pushId,
      view: viewId,
      scene: scene,
      domain: urlObj.hostname.replace(/\./g, '_')
    };
    let sensitiveData = Object.entries(components)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}:${value}`)
      .join('_');
    if (!sensitiveData) {
      sensitiveData = 'vdo_' + Math.random().toString(36).substring(2, 10);
    }
    const secureTopicHash = hashTopic(sensitiveData);
    const finalPrefix = components.domain || 'vdo_ninja';
    const finalTopic = `${finalPrefix}_${secureTopicHash.substring(0, 12)}`;
    const notificationUrl = addParamToUrl(url, 'poke', finalTopic);
    return {
      topic: finalTopic,
      notificationUrl: notificationUrl,
      originalUrl: url,
      roomId: components.room || '',
      directorId: components.director || '',
      viewId: components.view || '',
      pushId: components.push || ''
    };
  } catch (e) {
    console.error('Error parsing VDO.Ninja URL:', e);
    throw e;
  }
}
function toHexString(buffer) {
  return Array.prototype.map.call(
    buffer,
    b => b.toString(16).padStart(2, '0')
  ).join('');
}
function setupUrlDetection() {
  const topicInput = document.getElementById('topic-input');
  const urlInput = document.getElementById('vdo-url-input');
  if (!urlInput) {
    const subscribeCard = document.querySelector('.notification-card');
    if (subscribeCard) {
      const newFormGroup = document.createElement('div');
      newFormGroup.className = 'form-group';
      newFormGroup.innerHTML = `
        <label for="vdo-url-input">VDO.Ninja URL (Optional):</label>
        <input type="text" id="vdo-url-input" placeholder="Paste your VDO.Ninja URL">
        <small>We'll extract the notification topic from your URL automatically</small>
      `;
      const topicFormGroup = subscribeCard.querySelector('.form-group');
      if (topicFormGroup) {
        subscribeCard.insertBefore(newFormGroup, topicFormGroup);
      } else {
        subscribeCard.appendChild(newFormGroup);
      }
      const urlInput = document.getElementById('vdo-url-input');
      addUrlInputListeners(urlInput, topicInput);
    }
  } else {
    addUrlInputListeners(urlInput, topicInput);
  }
}
function escapeNotificationText(value) {
	var text = document.createElement("span");
	text.textContent = String(value);
	return text.innerHTML;
}
function displayStatusMessage(message, statusType = 'active', duration = 5000) {
  const statusEl = document.getElementById('notification-status');
  if (!statusEl) return;
  statusEl.innerHTML = `
    <div class="status ${statusType}">
      <p>${message}</p>
    </div>
  `;
  if (duration > 0) {
    setTimeout(() => {
      if (statusEl.innerHTML.includes(message)) {
        statusEl.innerHTML = '';
      }
    }, duration);
  }
}
async function processVdoUrl(url, topicInput) {
  try {
    const result = await parseVdoNinjaUrl(url);
    if (result && result.topic) {
      topicInput.value = result.topic;
      updateExampleUrl();
      displayStatusMessage(`✅ Topic extracted: <strong>${escapeNotificationText(result.topic)}</strong>`, 'active');
    }
  } catch (error) {
    console.error('Error processing VDO URL:', error);
    displayStatusMessage('⚠️ Could not extract topic from URL', 'warning');
  }
}
function addUrlInputListeners(urlInput, topicInput) {
  if (!urlInput || !topicInput) return;
  urlInput.addEventListener('input', async () => {
    const url = urlInput.value.trim();
    if (url && (url.includes('vdo.ninja') || url.includes('obs.ninja'))) {
      processVdoUrl(url, topicInput);
    }
  });
  urlInput.addEventListener('paste', async (e) => {
    setTimeout(async () => {
      const url = urlInput.value.trim();
      if (url && (url.includes('vdo.ninja') || url.includes('obs.ninja'))) {
        processVdoUrl(url, topicInput);
      }
    }, 10);
  });
}
function enhanceTopicInput() {
  const topicInput = document.getElementById('topic-input');
  if (topicInput) {
    topicInput.addEventListener('paste', async (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('text');
      if (pastedText && (pastedText.includes('://') ||
                         pastedText.includes('vdo.ninja') ||
                         pastedText.includes('obs.ninja'))) {
        e.preventDefault();
        const topic = await extractTopicFromUrl(pastedText);
        if (topic) {
          topicInput.value = topic;
          updateExampleUrl();
          displayStatusMessage(`✅ Topic extracted from URL: <strong>${escapeNotificationText(topic)}</strong>`, 'active');
        } else {
          topicInput.value = pastedText;
          displayStatusMessage('⚠️ Could not extract topic from text', 'warning');
        }
      }
    });
  }
}
async function extractTopicFromUrl(url) {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]+$/.test(url) && !url.includes('.') && !url.includes('/')) {
    return url;
  }
  const vdoUrl = extractVdoNinjaUrl(url);
  if (vdoUrl) {
    const result = await parseVdoNinjaUrl(vdoUrl);
    if (result && result.topic) {
      return result.topic;
    }
  }
  return null;
}
function generateSafeUrl(url) {
  try {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const sensitiveParams = [
      'password', 'pass', 'pwd', 'hash', 'secret', 'token', 'key', 'apikey',
      'api_key', 'auth', 'credentials', 'cred', 'signin', 'login'
    ];
    sensitiveParams.forEach(param => {
      if (params.has(param)) {
        params.delete(param);
      }
    });
    urlObj.search = params.toString();
    return urlObj.toString();
  } catch (e) {
    console.error("Error generating safe URL:", e);
    return '';
  }
}
function updateSubscriptionStatusPanel() {
  const statusContainer = document.getElementById('subscription-status-panel');
  if (!statusContainer) {
    const panel = document.createElement('div');
    panel.id = 'subscription-status-panel';
    panel.className = 'notification-card';
    panel.innerHTML = `
      <h2>Subscription Status</h2>
      <div id="subscription-status-details">
        <p>Not currently monitoring any topics</p>
      </div>
    `;
    const firstCard = document.querySelector('.notification-card');
    if (firstCard && firstCard.parentNode) {
      firstCard.parentNode.insertBefore(panel, firstCard.nextSibling);
    }
  }
  const topic = localStorage.getItem('notifyTopic');
  const statusDetails = document.getElementById('subscription-status-details');
  if (!statusDetails) return;
  if (topic) {
    checkConnectionStatus().then(statusInfo => {
      updateStatusDisplay(statusInfo);
    }).catch(err => {
      console.error('Error checking connection status:', err);
      updateStatusDisplay({ status: 'disconnected', text: 'Connection error' });
    });
    const lastPollTime = localStorage.getItem('lastPollTime') || 'Never';
    const lastPollDate = lastPollTime !== 'Never' ? new Date(parseInt(lastPollTime)).toLocaleString() : 'Never';
    const pushEnabled = localStorage.getItem('pushSubscription') ? 'Enabled' : 'Disabled';
    statusDetails.innerHTML = `
      <div class="status active">
        <p><strong>Currently subscribed to:</strong> ${escapeNotificationText(topic)}</p>
        <p><strong>Connection status:</strong> <span id="sw-connection-status">Checking...</span></p>
        <p><strong>Push notifications:</strong> <span id="push-status">${pushEnabled}</span></p>
        <p><strong>Last activity:</strong> <span id="last-activity-display">${lastPollDate}</span></p>
        <button id="unsubscribe-button" class="danger">Unsubscribe from "${escapeNotificationText(topic)}"</button>
      </div>
    `;
    document.getElementById('unsubscribe-button')?.addEventListener('click', () => {
      stopNotificationSubscription();
      updateSubscriptionStatusPanel();
    });
  } else {
    statusDetails.innerHTML = `
      <div class="status inactive">
        <p>Not currently monitoring any topics</p>
        <p>Enter a topic above and click "Subscribe to Notifications"</p>
      </div>
    `;
  }
}
async function checkConnectionStatus() {
  if (!navigator.serviceWorker.controller) {
    return { status: 'disconnected', text: 'Service worker not active' };
  }
  try {
    const response = await window.notificationManager.sendToServiceWorker({ action: 'checkStatus' });
    if (response?.sse?.connected) {
      return { status: 'connected', text: 'Using real-time updates' };
    } else if (response?.polling?.isPolling) {
      return { status: 'polling', text: 'Using fallback polling' };
    } else {
      return { status: 'disconnected', text: 'Not connected' };
    }
  } catch (error) {
    console.error('Error checking status:', error);
    return { status: 'disconnected', text: 'Status check failed' };
  }
}
function updateStatusDisplay(statusInfo) {
  const statusElement = document.getElementById('sw-connection-status');
  if (statusElement) {
    statusElement.textContent = statusInfo.text;
    statusElement.className = statusInfo.status;
  }
}
function handleNotificationEvent(event, data) {
  switch (event) {
    case 'connectionStatus':
      updateConnectionStatus(data.connected, data.topic);
      updateSubscriptionStatusPanel();
      break;
    case 'sseStatus':
      updateConnectionStatusDisplay(data.status, data.attempt, data.delay);
      updateSubscriptionStatusPanel();
      break;
    case 'notification':
      createNotificationPopup(data.notification);
      createFlashEffect();
      updateLastActivityTime();
      updateSubscriptionStatusPanel();
      break;
    case 'historyUpdated':
      updateNotificationHistoryUI();
      updateNotificationBadge();
      break;
	case 'statusUpdate':
      if (data && data.topic) {
        document.getElementById('topic-input').value = data.topic;
      }
      if (data && data.sseConnected) {
        updateConnectionStatusDisplay('connected');
      } else if (data && data.isPolling) {
        updateConnectionStatusDisplay('polling');
      }
      updateSubscriptionStatusPanel();
      break;
  }
}
function checkNotificationPermission() {
  if ('Notification' in window) {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      document.getElementById('notification-status').innerHTML = `
        <div class="status inactive">
          <p>Browser notifications are not enabled. <button id="request-permission">Enable Notifications</button></p>
        </div>
      `;
      document.getElementById('request-permission')?.addEventListener('click', requestNotificationPermission);
    }
  }
}

async function requestNotificationPermission() {
  // First check current permission
  if (Notification.permission === 'denied') {
    console.warn('Notifications are blocked. User must change browser settings.');
    document.getElementById('notification-status').innerHTML = `
      <div class="status warning">
        <p>Notifications are blocked in your browser settings. Please enable them to receive notifications.</p>
      </div>
    `;
    return 'denied';
  }
  
  try {
    const permission = await window.notificationManager.requestPermission();
    
    if (permission === 'granted') {
      document.getElementById('notification-status').innerHTML = `
        <div class="status active">
          <p>Browser notifications are enabled!</p>
        </div>
      `;
      
      // Test if push subscription is working
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        console.log('Testing existing push subscription');
        await window.notificationManager.testPushSubscription();
      }
    }
    
    return permission;
  } catch (error) {
    console.error('Error requesting permission:', error);
    return 'error';
  }
}

function checkSavedSubscription() {
  const savedTopic = localStorage.getItem('notifyTopic');
  const topicInput = document.getElementById('topic-input');
  if (savedTopic) {
    topicInput.value = savedTopic;
    if (navigator.serviceWorker.controller) {
      window.notificationManager.checkStatus().then(hasActiveSubscription => {
        if (!hasActiveSubscription) {
          console.log('No active subscription found, starting new subscription');
          startNotificationSubscription(savedTopic);
        } else {
          console.log('Active subscription found and restored');
        }
        updateSubscriptionStatusPanel();
      });
    } else {
      console.log('Waiting for service worker before restoring subscription');
      navigator.serviceWorker.ready.then(() => {
        if (navigator.serviceWorker.controller) {
          window.notificationManager.checkStatus().then(hasActiveSubscription => {
            if (!hasActiveSubscription) {
              startNotificationSubscription(savedTopic);
            }
            updateSubscriptionStatusPanel();
          });
        } else {
          startNotificationSubscription(savedTopic);
          updateSubscriptionStatusPanel();
        }
      });
    }
  } else {
    const randomTopic = generateRandomTopic();
    topicInput.value = randomTopic;
    updateExampleUrl();
    updateSubscriptionStatusPanel();
  }
}
function generateRandomTopic() {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
function setupEventListeners() {
  const subscribeBtn = document.getElementById('subscribe-btn');
	if (subscribeBtn) {
	  subscribeBtn.addEventListener('click', () => {
		let topic = document.getElementById('topic-input').value.trim();
		if (!topic) {
		  topic = generateRandomTopic();
		  document.getElementById('topic-input').value = topic;
		}
		requestNotificationPermission().then(permission => {
		  if (permission === 'granted') {
			startNotificationSubscription(topic);
		  }
		});
	  });
	}
  const clearHistoryBtn = document.getElementById('clear-history');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearNotificationHistory);
  }
  const unsubscribeBtn = document.getElementById('unsubscribe-all');
  if (unsubscribeBtn) {
    unsubscribeBtn.addEventListener('click', stopNotificationSubscription);
  }
  const topicInput = document.getElementById('topic-input');
  if (topicInput) {
    topicInput.addEventListener('input', updateExampleUrl);
  }
  const soundSelect = document.getElementById('notification-sound');
  if (soundSelect) {
    soundSelect.value = localStorage.getItem('notificationSound') || 'default';
    soundSelect.addEventListener('change', e => {
      localStorage.setItem('notificationSound', e.target.value);
    });
  }
  const desktopToggle = document.getElementById('desktop-notifications');
  if (desktopToggle) {
    desktopToggle.checked = localStorage.getItem('desktopNotifications') !== 'false';
    desktopToggle.addEventListener('change', e => {
      localStorage.setItem('desktopNotifications', e.target.checked);
    });
  }
  const fakeNotificationBtn = document.getElementById('fake-notification-btn');
	if (fakeNotificationBtn) {
	  fakeNotificationBtn.addEventListener('click', () => {
		let topic = document.getElementById('topic-input').value.trim();
		if (!topic) {
		  topic = generateRandomTopic();
		  document.getElementById('topic-input').value = topic;
		}
		const testNotification = {
		  title: 'Test Notification',
		  body: 'This is a test notification for VDO.Ninja',
		  url: window.location.href,
		  timestamp: Date.now()
		};
		if (navigator.serviceWorker.controller) {
		  window.notificationManager.sendToServiceWorker({
			action: 'testNotification',
			notification: testNotification
		  });
		} else {
		  window.notificationManager.showNotification(testNotification);
		}
	  });
	}
  setInterval(updateSubscriptionStatusPanel, 30000);
  const testNotificationBtn = document.getElementById('test-notification-btn');
	if (testNotificationBtn) {
	  testNotificationBtn.addEventListener('click', () => {
		let topic = document.getElementById('topic-input').value.trim();
		if (!topic) {
		  topic = generateRandomTopic();
		  document.getElementById('topic-input').value = topic;
		}
		const button = testNotificationBtn;
		const originalText = button.textContent;
		button.textContent = 'Sending...';
		button.disabled = true;
		window.notificationManager.sendTestNotification(topic)
		  .then(success => {
			if (!success) {
			  alert('Failed to send test notification');
			}
		  })
		  .catch(error => {
			console.error('Error sending notification:', error);
			alert('Error sending notification');
		  })
		  .finally(() => {
			button.textContent = originalText;
			button.disabled = false;
		  });
	  });
	}
}
function startNotificationSubscription(topic) {
  if (!topic) return;
  window.notificationManager.startSubscription(topic)
    .then(success => {
      updateSubscriptionStatusPanel();
    });
}
function stopNotificationSubscription() {
  window.notificationManager.stopSubscription()
    .then(() => {
      updateSubscriptionStatusPanel();
    });
}

function updateConnectionStatus(connected, topic) {
  if (connected) {
    updateStatusDisplay({ status: 'connected', text: 'Using real-time updates' });
    localStorage.setItem('lastPollTime', Date.now().toString());
  } else {
    updateStatusDisplay({ status: 'disconnected', text: 'Disconnected' });
  }
}

function updateConnectionStatusDisplay(status, attempt, delay) {
  const statusEl = document.getElementById('connection-status');
  if (!statusEl) return;
  switch (status) {
    case 'connected':
      statusEl.textContent = 'Using real-time updates';
      statusEl.style.color = '#64b5f6';
      break;
    case 'reconnecting':
      statusEl.textContent = `Connection lost, reconnecting${attempt ? ` (attempt ${attempt})` : ''}...`;
      statusEl.style.color = '#ff9800';
      break;
    case 'polling':
      statusEl.textContent = 'Using fallback polling';
      statusEl.style.color = '#ff9800';
      break;
    case 'disconnected':
      statusEl.textContent = 'Disconnected';
      statusEl.style.color = '#f44336';
      break;
    default:
      statusEl.textContent = 'Connection status unknown';
      statusEl.style.color = '#999';
  }
}
function updateLastActivityTime() {
  const lastActivityEl = document.getElementById('last-activity-display');
  if (!lastActivityEl) return;
  const lastPollTime = parseInt(localStorage.getItem('lastPollTime') || '0');
  const now = Date.now();
  const diff = now - lastPollTime;
  if (diff < 60000) {
    lastActivityEl.textContent = 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    lastActivityEl.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.floor(diff / 3600000);
    lastActivityEl.textContent = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
}
function getBaseUrl() {
  const url = window.location;
  const path = url.pathname;
  
  // Extract everything before "/notifications/" in the path
  const notificationsIndex = path.indexOf('/notifications/');
  
  if (notificationsIndex !== -1) {
    // Get everything up to the notifications segment
    const basePath = path.substring(0, notificationsIndex + 1); // Keep trailing slash
    return url.origin + basePath;
  } else {
    // Notifications not in path, return the origin + path
    // Ensure path ends with trailing slash
    const normalizedPath = path.endsWith('/') ? path : path + '/';
    return url.origin + normalizedPath;
  }
}

function updateExampleUrl() {
  const topicInput = document.getElementById('topic-input');
  const exampleUrl = document.getElementById('example-url');
  if (!topicInput || !exampleUrl) return;
  const topic = topicInput.value.trim() || 'your-topic';
  exampleUrl.value = getBaseUrl() + `?room=example&poke=${topic}`;
}
function createNotificationPopup(notification) {
  const notificationId = 'notification-' + Date.now();
  const notificationElement = document.createElement('div');
  notificationElement.className = 'notification-popup';
  notificationElement.id = notificationId;
  const timeAgo = window.notificationManager.getTimeAgo(notification.timestamp || Date.now());
  notificationElement.innerHTML = `
    <div class="notification-popup-header">
      <h3 class="notification-popup-title">🔔 </h3>
      <button class="notification-popup-close">&times;</button>
    </div>
    <div class="notification-popup-body">
      <p></p>
      <div class="time"><strong>${timeAgo}</strong> (${new Date(notification.timestamp || Date.now()).toLocaleTimeString()})</div>
    </div>
    <div class="notification-popup-actions">
      <button class="secondary dismiss-btn">Dismiss</button>
      <button class="open-url-btn">Open Room</button>
    </div>
  `;
  notificationElement.querySelector('.notification-popup-title').appendChild(document.createTextNode(notification.title || 'VDO.Ninja Notification'));
  notificationElement.querySelector('.notification-popup-body p').textContent = notification.body || 'Someone joined your room';
  document.body.appendChild(notificationElement);
  notificationElement.querySelector('.notification-popup-close').addEventListener('click', () => {
    if (document.body.contains(notificationElement)) {
      document.body.removeChild(notificationElement);
    }
  });
  notificationElement.querySelector('.dismiss-btn').addEventListener('click', () => {
    if (document.body.contains(notificationElement)) {
      document.body.removeChild(notificationElement);
    }
  });
  notificationElement.querySelector('.open-url-btn').addEventListener('click', () => {
    if (notification.url) {
      window.open(notification.url, '_blank');
    }
    if (document.body.contains(notificationElement)) {
      document.body.removeChild(notificationElement);
    }
  });
  setTimeout(() => {
    if (document.body.contains(notificationElement)) {
      notificationElement.style.opacity = '0';
      notificationElement.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        if (document.body.contains(notificationElement)) {
          document.body.removeChild(notificationElement);
        }
      }, 500);
    }
  }, 15000);
}
function createFlashEffect() {
  const flashElement = document.createElement('div');
  flashElement.className = 'notification-flash';
  document.body.appendChild(flashElement);
  setTimeout(() => {
    if (document.body.contains(flashElement)) {
      document.body.removeChild(flashElement);
    }
  }, 500);
  document.body.classList.add('shake');
  setTimeout(() => {
    document.body.classList.remove('shake');
  }, 500);
}
function clearNotificationHistory() {
  window.notificationManager.clearNotificationHistory();
}
function updateNotificationHistoryUI() {
  const historyEl = document.getElementById('notification-history');
  if (!historyEl) return;
  const notificationHistory = window.notificationManager.getNotificationHistory();
  if (notificationHistory.length === 0) {
    historyEl.innerHTML = '<p>No notifications yet.</p>';
    return;
  }
  historyEl.innerHTML = '';
  notificationHistory.forEach((notification, index) => {
    const notificationEl = document.createElement('div');
    notificationEl.className = 'notification-item';
    if (notification.isNew) {
      notificationEl.classList.add('new');
    }
    const timestamp = notification.timestamp || notification.receivedAt || Date.now();
    const timeAgo = window.notificationManager.getTimeAgo(timestamp);
    notificationEl.innerHTML = `
      <div class="notification-icon">🔔</div>
      <div class="content">
        <h3></h3>
        <p></p>
        <div class="time"><strong>${timeAgo}</strong> (${new Date(timestamp).toLocaleString()})</div>
      </div>
      <div class="actions">
        <button class="open-url" data-index="${index}">Open</button>
      </div>
    `;
    notificationEl.querySelector('h3').textContent = notification.title || 'VDO.Ninja Notification';
    notificationEl.querySelector('p').textContent = notification.body || 'Notification received';
    historyEl.appendChild(notificationEl);
  });
  document.querySelectorAll('.open-url').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      const notification = notificationHistory[index];
      if (notification && notification.url) {
        window.open(notification.url, '_blank');
      }
    });
  });
}
function setupParseUrlButton() {
  const parseUrlBtn = document.getElementById('parse-url-btn');
  const vdoUrlInput = document.getElementById('vdo-url-input');
  const parsedUrlOutput = document.getElementById('parsed-url-output');
  const generatedTopic = document.getElementById('generated-topic');
  const notificationUrl = document.getElementById('notification-url');
  const copyUrlBtn = document.getElementById('copy-url-btn');
  const useGeneratedTopicBtn = document.getElementById('use-generated-topic');
  if (!parseUrlBtn || !vdoUrlInput) return;
  parseUrlBtn.addEventListener('click', async () => {
    const url = vdoUrlInput.value.trim();
    if (!url) {
      displayStatusMessage('⚠️ Please enter a VDO.Ninja URL', 'warning');
      return;
    }
    try {
      parseUrlBtn.textContent = 'Processing...';
      parseUrlBtn.disabled = true;
      const result = await parseVdoNinjaUrl(url);
      if (result && result.topic) {
        if (generatedTopic) generatedTopic.value = result.topic;
        if (notificationUrl) notificationUrl.value = result.notificationUrl;
        if (parsedUrlOutput) parsedUrlOutput.style.display = 'block';
        if (copyUrlBtn) {
          copyUrlBtn.addEventListener('click', () => {
            notificationUrl.select();
            document.execCommand('copy');
            copyUrlBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyUrlBtn.textContent = 'Copy URL';
            }, 2000);
          });
        }
        if (useGeneratedTopicBtn) {
          useGeneratedTopicBtn.addEventListener('click', () => {
            const topicInput = document.getElementById('topic-input');
            if (topicInput) {
              topicInput.value = result.topic;
              const subscribeBtn = document.getElementById('subscribe-btn');
              if (subscribeBtn) {
                subscribeBtn.scrollIntoView({ behavior: 'smooth' });
                subscribeBtn.classList.add('shake');
                setTimeout(() => {
                  subscribeBtn.classList.remove('shake');
                }, 1000);
              }
            }
          });
        }
        displayStatusMessage('✅ Successfully parsed URL', 'active');
      } else {
        displayStatusMessage('⚠️ Could not generate a topic from this URL', 'warning');
      }
    } catch (error) {
      console.error('Error parsing URL:', error);
      displayStatusMessage('⚠️ Error parsing URL: ' + escapeNotificationText(error.message), 'warning');
    } finally {
      parseUrlBtn.textContent = 'Create Notification Topic';
      parseUrlBtn.disabled = false;
    }
  });
}
function initNotificationBadge() {
  const historyTab = document.querySelector('.tab[data-tab="history"]');
  if (!historyTab) return;
  let badge = document.getElementById('notification-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.id = 'notification-badge';
    badge.style.display = 'none';
    badge.style.backgroundColor = '#f44336';
    badge.style.color = 'white';
    badge.style.borderRadius = '50%';
    badge.style.padding = '2px 6px';
    badge.style.fontSize = '11px';
    badge.style.marginLeft = '5px';
    badge.style.fontWeight = 'bold';
    historyTab.appendChild(badge);
  }
  updateNotificationBadge();
}
function updateNotificationBadge() {
  const badge = document.getElementById('notification-badge');
  if (!badge) return;
  const notificationHistory = window.notificationManager.getNotificationHistory();
  const unreadCount = notificationHistory.filter(n => n.isNew).length;
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}
function initTabSystem() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabId = tab.getAttribute('data-tab');
      const contentEl = document.getElementById(`${tabId}-tab`);
      if (contentEl) {
        contentEl.classList.add('active');
      }
      if (tabId === 'history') {
        const notificationHistory = window.notificationManager.getNotificationHistory();
        notificationHistory.forEach(n => n.isNew = false);
        localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
        updateNotificationHistoryUI();
        updateNotificationBadge();
      }
    });
  });
}
document.addEventListener('visibilitychange', () => {
  const topic = localStorage.getItem('notifyTopic');
  if (!topic) return;
  if (document.visibilityState === 'visible') {
    window.notificationManager.checkStatus();
  }
});
window.addEventListener('online', () => {
  const topic = localStorage.getItem('notifyTopic');
  if (topic) {
    console.log('Back online, reconnecting to notification service');
    window.notificationManager.startSubscription(topic);
  }
});