const CACHE_NAME = 'vdo-ninja-notifications-v1';
const urlsToCache = [
  '/notifications/media/tone.mp3',
  '/notifications/media/chime.wav',
  '/notifications/media/bell.wav',
  '/notifications/media/logo2.png',
  '/notifications/media/icon.png',
];
let sseConnection = null;
let pollingInterval = null;
let reconnectTimeout = null;
let currentTopic = null;
let reconnectAttempts = 0;
let pushSubscription = null;
const MAX_RECONNECT_ATTEMPTS = 10;
const MAX_RECONNECT_DELAY = 300000;
const pendingResponses = new Map();
const recentNotifications = new Set();
const processedNotificationIds = new Set();
const PROCESSED_ID_EXPIRY = 30000;

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('[SW-DEBUG] Push subscription change event detected.');
  event.waitUntil(handleSubscriptionChange(event));
});

async function handleSubscriptionChange(event) {
  try {
    console.log('[SW-DEBUG] Handling subscription change');
    // Get the old subscription data (may be null)
    const oldSubscription = event.oldSubscription;
    let topic = null;
    
    // Get the current topic from IndexedDB
    try {
      topic = await getStoreItem('topic');
      if (!topic) {
        console.error('[SW-DEBUG] No topic found for resubscription');
        return;
      }
    } catch (error) {
      console.error('[SW-DEBUG] Error retrieving topic:', error);
      return;
    }
    
    // Try to get or create a new subscription
    let newSubscription;
    try {
      // Try to get new subscription from event if provided
      if (event.newSubscription) {
        newSubscription = event.newSubscription;
      } else {
        // Get VAPID key from server
        const keyResponse = await fetch('https://notify.vdo.ninja/vapidPublicKey');
        if (!keyResponse.ok) {
          throw new Error('Failed to fetch VAPID key');
        }
        
        const keyData = await keyResponse.json();
        const vapidKey = keyData.key;
        
        if (!vapidKey) {
          throw new Error('Invalid VAPID key format');
        }
        
        // Convert the VAPID key to the required format
        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
        
        // Create a new subscription
        newSubscription = await self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }
      
      // Send the new subscription to the server
      await fetch('https://notify.vdo.ninja/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: newSubscription,
          topic: topic
        })
      });
      
      console.log('[SW-DEBUG] Successfully updated push subscription');
      
      // Notify any open clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            action: 'subscriptionUpdated',
            topic: topic
          });
        });
      });
      
    } catch (error) {
      console.error('[SW-DEBUG] Error resubscribing:', error);
    }
  } catch (error) {
    console.error('[SW-DEBUG] Error in handleSubscriptionChange:', error);
  }
}

self.addEventListener('push', event => {
  event.waitUntil((async () => {
    try {
      let notification = {};
      if (event.data) {
        try {
          notification = JSON.parse(event.data.text());
        } catch (e) {
          console.error('[SW] Failed to parse push data:', e);
          notification = {
            title: 'VDO.Ninja Notification',
            body: 'Someone joined your room',
            timestamp: Date.now(),
            url: self.registration.scope
          };
        }
      } else {
        notification = {
          title: 'VDO.Ninja Notification',
          body: 'Someone joined your room',
          timestamp: Date.now(),
          url: self.registration.scope
        };
      }
      
      notification.id = notification.id || `push-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      notification.timestamp = notification.timestamp || Date.now();
      notification.source = notification.source || 'web_push';
      
      const isDuplicate = await isNotificationDuplicate(notification);
      if (!isDuplicate) {
        await storeNotification(notification);
        
        // Check permission before showing
        if (Notification.permission === 'granted') {
          await showNotification(notification).catch(err => {
            console.error('[SW] Show notification error:', err);
          });
        } else {
          console.warn('[SW] Notification permission not granted');
        }
        
        broadcastToClients('newNotification', { notification });
      }
    } catch (error) {
      console.error('[SW] Error handling push notification:', error);
    }
  })());
});

async function decryptPushMessage(rawData, subscription) {
  try {
    try {
      return JSON.parse(rawData);
    } catch (e) {
      console.log('[SW] Push message not valid JSON, attempting decryption');
    }
    if (!subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      console.error('[SW] Cannot decrypt push: missing subscription keys');
      throw new Error('Missing subscription keys');
    }
    console.log('[SW] Push message received for endpoint:', subscription.endpoint.slice(-10));
    try {
      const decodedData = atob(rawData);
      return JSON.parse(decodedData);
    } catch (e) {
      return {
        title: 'VDO.Ninja Notification',
        body: 'New notification received',
        timestamp: Date.now(),
        url: self.registration.scope
      };
    }
  } catch (error) {
    console.error('[SW] Error decrypting push message:', error);
    return {
      title: 'VDO.Ninja Notification',
      body: 'New notification received',
      timestamp: Date.now(),
      url: self.registration.scope
    };
  }
}
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      initStore().then(() => {
        return getStoreItem('topic').then(topic => {
          if (topic) {
            console.log('[SW] Restoring connection for topic:', topic);
            connectToSSE(topic);
          }
        });
      })
    ])
  );
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(error => {
            console.error('[SW] Fetch error:', error);
            if (event.request.url.includes('index.html')) {
              return new Response('Offline Mode: Please reconnect to the internet', {
                headers: { 'Content-Type': 'text/html' }
              });
            }
            return new Response('Offline resource unavailable');
          });
      })
  );
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then(clients => {
        for (const client of clients) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }
        const url = event.notification.data?.url || self.registration.scope;
        return self.clients.openWindow(url);
      })
  );
});
self.addEventListener('message', event => {
  const data = event.data;
  if (!data || !data.action) return;
  const messageId = data.messageId || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const port = event.ports && event.ports[0];
  if (!port) {
    console.error('[SW] No message port provided');
    return;
  }
  if (data.requiresResponse !== false) {
    pendingResponses.set(messageId, {
      port,
      timestamp: Date.now()
    });
    setTimeout(() => {
      const pendingResponse = pendingResponses.get(messageId);
      if (pendingResponse) {
        try {
          pendingResponse.port.postMessage({
            error: 'Response timeout in service worker'
          });
        } catch (e) {
        }
        pendingResponses.delete(messageId);
      }
    }, 9000);
  }
  const sendResponse = (response) => {
    const pendingResponse = pendingResponses.get(messageId);
    if (pendingResponse && pendingResponse.port) {
      try {
        pendingResponse.port.postMessage(response);
      } catch (e) {
        console.error('[SW] Error sending response:', e);
      }
      pendingResponses.delete(messageId);
    }
  };
  Promise.resolve().then(async () => {
    switch (data.action) {
      case 'connect':
        if (data.topic) {
          const success = await connectToSSE(data.topic);
          sendResponse({
            connected: success,
            topic: data.topic
          });
        }
        break;
      case 'disconnect':
        await disconnectAll();
        sendResponse({
          connected: false
        });
        break;
      case 'syncNotifications':
        const notifications = await getAllNotifications();
        sendResponse({
          notifications: notifications
        });
        break;
      case 'checkStatus':
        const [topic, sseStatus, pollingStatus] = await Promise.all([
          getStoreItem('topic'),
          getStoreItem('sseStatus'),
          getStoreItem('pollingStatus')
        ]);
        sendResponse({
          action: 'statusUpdate',
          config: topic ? { topic } : null,
          sse: sseStatus || { connected: false },
          polling: pollingStatus || { isPolling: false }
        });
        break;
      case 'startPolling':
        if (data.topic) {
          startPolling(data.topic);
          sendResponse({ success: true });
        }
        break;
      case 'testNotification':
        if (data.notification) {
          await showNotification(data.notification);
          await storeNotification(data.notification);
          broadcastToClients('newNotification', {
            notification: data.notification
          });
          sendResponse({ success: true });
        }
        break;
      default:
        sendResponse({ error: 'Unknown action' });
    }
  }).catch(error => {
    console.error(`[SW] Error processing ${data.action}:`, error);
    sendResponse({
      error: error.message || 'Error processing request'
    });
  });
});
self.addEventListener('periodicsync', event => {
  if (event.tag === 'notification-poll') {
    Promise.all([
      getStoreItem('topic'),
      getStoreItem('sseStatus')
    ]).then(([topic, sseStatus]) => {
      if (topic && (!sseStatus || !sseStatus.connected)) {
        console.log('[SW] Running periodic background poll');
        pollForNotifications(topic);
      }
    });
  }
});
const DB_NAME = 'VDONinjaNotifications';
const DB_VERSION = 1;
let db = null;
function initStore() {
  if (db) return Promise.resolve(db);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('notifications')) {
        const store = db.createObjectStore('notifications', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('store')) {
        db.createObjectStore('store', { keyPath: 'key' });
      }
    };
    request.onsuccess = event => {
      db = event.target.result;
      resolve(db);
    };
    request.onerror = event => {
      console.error('[SW] IndexedDB error:', event.target.error);
      reject(event.target.error);
    };
  });
}
function storeNotification(notification) {
  return initStore().then(() => {
    return new Promise((resolve, reject) => {
      try {
        notification.id = notification.id || `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        notification.timestamp = notification.timestamp || Date.now();
        notification.isNew = true;
        const tx = db.transaction('notifications', 'readwrite');
        const store = tx.objectStore('notifications');
        console.log('[SW-DEBUG] Storing notification in IndexedDB:', notification.id);
        const request = store.put(notification);
        request.onsuccess = () => {
          console.log('[SW-DEBUG] Successfully stored notification in DB:', notification.id);
          cleanupOldNotifications();
          resolve(notification);
        };
        request.onerror = event => {
          const error = event.target.error;
          console.error('[SW-DEBUG] Error storing notification in DB:', error);
          reject(error);
        };
      } catch (error) {
        console.error('[SW-DEBUG] Exception in storeNotification:', error);
        reject(error);
      }
    });
  });
}
function getAllNotifications() {
  return initStore().then(() => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('notifications', 'readonly');
      const store = tx.objectStore('notifications');
      const index = store.index('timestamp');
      const request = index.getAll();
      request.onsuccess = () => {
        const notifications = request.result || [];
        resolve(notifications.sort((a, b) => b.timestamp - a.timestamp));
      };
      request.onerror = event => {
        console.error('[SW] Error getting notifications:', event.target.error);
        reject(event.target.error);
      };
    });
  });
}
function cleanupOldNotifications() {
  initStore().then(() => {
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');
    const countRequest = store.count();
    countRequest.onsuccess = () => {
      if (countRequest.result <= 50) return;
      const excess = countRequest.result - 50;
      const index = store.index('timestamp');
      let deleted = 0;
      index.openCursor(null, 'next').onsuccess = event => {
        const cursor = event.target.result;
        if (!cursor) return;
        function deleteNext() {
          if (deleted >= excess) return;
          store.delete(cursor.value.id);
          deleted++;
          cursor.continue();
        }
        deleteNext();
      };
    };
  });
}
function setStoreItem(key, value) {
  return initStore().then(() => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('store', 'readwrite');
      const store = tx.objectStore('store');
      const request = store.put({
        key: key,
        value: value,
        updated: Date.now()
      });
      request.onsuccess = () => resolve(value);
      request.onerror = event => reject(event.target.error);
    });
  });
}
function getStoreItem(key) {
  return initStore().then(() => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('store', 'readonly');
      const store = tx.objectStore('store');
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result ? request.result.value : null);
      };
      request.onerror = event => reject(event.target.error);
    });
  });
}
function connectToSSE(topic) {
  if (!topic) return Promise.resolve(false);
  disconnectSSE();
  currentTopic = topic;
  return setStoreItem('topic', topic).then(() => {
    try {
      const url = `https://notify.vdo.ninja/events?topic=${encodeURIComponent(topic)}`;
      console.log('[SW] Connecting to SSE:', url);
      setStoreItem('sseStatus', {
        connected: false,
        connecting: true,
        lastConnectAttempt: Date.now()
      });
      
      // Broadcast connection attempt
      broadcastToClients('sseStatus', {
        status: 'reconnecting',
        attempt: reconnectAttempts
      });
      
      // Create new EventSource with longer timeout
      sseConnection = new EventSource(url);
      
      // Increase connection timeout from 10s to 30s
      const connectionTimeout = setTimeout(() => {
        if (sseConnection) {
          console.warn('[SW] SSE connection timed out, will retry');
          sseConnection.close();
          reconnectSSE();
        }
      }, 30000);
      
      // Add an open event listener to handle immediate connection
      sseConnection.addEventListener('open', () => {
        console.log('[SW] SSE connection opened');
        // Don't clear timeout yet - wait for 'connect' event with data
      });
      
      sseConnection.addEventListener('connect', event => {
        clearTimeout(connectionTimeout);
        console.log('[SW] SSE connection established');
        reconnectAttempts = 0;
        let connectionData = { connected: true };
        try {
          connectionData = JSON.parse(event.data);
        } catch (e) {
          console.warn('[SW] Could not parse connection data:', e);
        }
        
        setStoreItem('sseStatus', {
          connected: true,
          lastConnected: Date.now(),
          data: connectionData
        });
        
        broadcastToClients('connectionStatus', {
          connected: true,
          topic: topic
        });
        
        broadcastToClients('sseStatus', { status: 'connected' });
      });
	  
      sseConnection.addEventListener('notification', event => {
		  console.log('[SW-DEBUG] SSE notification event received');
		  try {
			let notification = {};
			let eventData = event.data;
			console.log('[SW-DEBUG] SSE event data:', eventData);
			try {
			  notification = JSON.parse(eventData);
			} catch (e) {
			  console.log('[SW-DEBUG] Failed to parse SSE data, using default notification');
			  notification = {
				title: 'VDO.Ninja Notification',
				body: 'New notification received',
				timestamp: Date.now()
			  };
			}
			notification.source = 'sse';
			notification.id = notification.id || `sse-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
			notification.timestamp = notification.timestamp || Date.now();
			console.log('[SW-DEBUG] Processing SSE notification:', notification);
			(async () => {
			  try {
				console.log('[SW-DEBUG] Checking if SSE notification is a duplicate');
				const isDuplicate = await isNotificationDuplicate(notification);
				if (!isDuplicate) {
				  console.log('[SW-DEBUG] Not a duplicate, proceeding with SSE notification:', notification.id);
				  try {
					await storeNotification(notification);
					console.log('[SW-DEBUG] Notification stored successfully');
				  } catch (storeError) {
					console.error('[SW-DEBUG] Error storing notification:', storeError);
				  }
				  try {
					console.log('[SW-DEBUG] Showing notification');
					await showNotification(notification);
					console.log('[SW-DEBUG] Notification shown successfully');
				  } catch (showError) {
					console.error('[SW-DEBUG] Error showing notification:', showError ? showError.toString() : 'Unknown error');
				  }
				  try {
					console.log('[SW-DEBUG] Broadcasting notification');
					broadcastToClients('newNotification', { notification });
					console.log('[SW-DEBUG] Notification broadcast complete');
				  } catch (broadcastError) {
					console.error('[SW-DEBUG] Error broadcasting notification:', broadcastError);
				  }
				  console.log('[SW-DEBUG] SSE notification processing complete');
				} else {
				  console.log('[SW-DEBUG] SSE notification is a duplicate, ignoring');
				}
			  } catch (error) {
				console.error('[SW-DEBUG] Error processing SSE notification:', error);
			  }
			})();
		  } catch (e) {
			console.error('[SW-DEBUG] Error handling SSE notification:', e);
		  }
		});
		
      sseConnection.addEventListener('reconnect', () => {
        console.log('[SW] Received reconnect instruction');
        reconnectSSE();
      });
	  
      sseConnection.onerror = error => {
        console.error('[SW] SSE connection error', error);
        // Don't immediately reconnect - check readyState first
        if (sseConnection && sseConnection.readyState === 2) { // CLOSED
          reconnectSSE();
        }
      };
	  
      return true;
    } catch (e) {
      console.error('[SW] Error setting up SSE:', e);
      reconnectSSE();
      return false;
    }
  });
}
function disconnectSSE() {
  if (sseConnection) {
    console.log('[SW] Closing SSE connection');
    sseConnection.close();
    sseConnection = null;
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
}

function reconnectSSE() {
  disconnectSSE();
  if (!currentTopic) return;
  
  reconnectAttempts++;
  
  // Implement exponential backoff with jitter
  const baseDelay = Math.min(
    MAX_RECONNECT_DELAY,
    Math.pow(1.5, Math.min(reconnectAttempts, 8)) * 1000
  );
  
  // Add jitter to prevent thundering herd problem
  const jitter = Math.random() * 1000;
  const delay = baseDelay + jitter;
  
  console.log(`[SW] Reconnecting SSE in ${Math.round(delay)}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
  
  setStoreItem('sseStatus', {
    connected: false,
    reconnecting: true,
    lastDisconnected: Date.now(),
    reconnectAttempt: reconnectAttempts,
    nextReconnect: Date.now() + delay
  }).then(() => {
    broadcastToClients('sseStatus', {
      status: 'reconnecting',
      delay: delay,
      attempt: reconnectAttempts
    });
    
    // Switch to polling after MAX_RECONNECT_ATTEMPTS
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('[SW] Max reconnect attempts reached, switching to polling');
      startPolling(currentTopic);
      
      // After a longer delay (5 minutes), try SSE again
      setTimeout(() => {
        reconnectAttempts = 0;
        connectToSSE(currentTopic);
      }, 300000);
      
      return;
    }
    
    // Set reconnect timeout
    reconnectTimeout = setTimeout(() => {
      connectToSSE(currentTopic);
    }, delay);
  });
}

function startPolling(topic) {
  if (!topic) return Promise.resolve(false);
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  return setStoreItem('pollingStatus', {
    isPolling: true,
    topic: topic,
    lastPoll: Date.now(),
    interval: 60000
  }).then(() => {
    broadcastToClients('sseStatus', { status: 'polling' });
    pollForNotifications(topic);
    pollingInterval = setInterval(() => {
      pollForNotifications(topic);
    }, 60000);
    if ('periodicSync' in self.registration) {
      self.registration.periodicSync.register('notification-poll', {
        minInterval: 15 * 60 * 1000
      }).catch(err => {
        console.warn('[SW] Failed to register periodic sync:', err);
      });
    }
    return true;
  });
}
async function isNotificationDuplicate(notification) {
  if (!notification) {
    console.log('[SW-DEBUG] Empty notification received');
    return true;
  }
  console.log('[SW-DEBUG] Checking notification:', {
    id: notification.id,
    title: notification.title,
    body: notification.body,
    source: notification.source,
    timestamp: notification.timestamp
  });
  notification.id = notification.id || `notification-${Date.now()}-${Math.random().toString(36).substring(2, 12)}`;
  if (processedNotificationIds.has(notification.id)) {
    console.log('[SW-DEBUG] Already processed this notification ID:', notification.id);
    return true;
  }
  const contentFingerprint = `${notification.title || ''}|${notification.body || ''}`;
  const shortWindowKey = `${contentFingerprint}|${Math.floor(Date.now()/5000)}`;
  console.log('[SW-DEBUG] Checking short-term cache with key:', shortWindowKey);
  console.log('[SW-DEBUG] Current cache size:', recentNotifications.size);
  console.log('[SW-DEBUG] Current cache entries:', Array.from(recentNotifications));
  if (recentNotifications.has(shortWindowKey)) {
    console.log('[SW-DEBUG] DUPLICATE: Found in short-term cache:', shortWindowKey);
    return true;
  }
  console.log('[SW-DEBUG] Not a duplicate (so far), adding to caches');
  recentNotifications.add(shortWindowKey);
  setTimeout(() => {
    recentNotifications.delete(shortWindowKey);
    console.log('[SW-DEBUG] Removed from short-term cache:', shortWindowKey);
  }, 5000);
  processedNotificationIds.add(notification.id);
  setTimeout(() => {
    processedNotificationIds.delete(notification.id);
    console.log('[SW-DEBUG] Removed from processed IDs cache:', notification.id);
  }, PROCESSED_ID_EXPIRY);
  console.log('[SW-DEBUG] Unique notification identified:', notification.id);
  return false;
}
function pollForNotifications(topic) {
  if (!topic) return Promise.resolve([]);
  return getStoreItem('pollingStatus').then(status => {
    const lastPoll = status?.lastPoll || (Date.now() - 3600000);
    return fetch(`https://notify.vdo.ninja/poll?topic=${encodeURIComponent(topic)}&since=${lastPoll}`)
      .then(response => response.json())
      .then(async data => {
        setStoreItem('pollingStatus', {
          ...(status || {}),
          lastPoll: Date.now(),
          isPolling: true,
          topic: topic
        });
        if (!data.notifications || !Array.isArray(data.notifications)) {
          return [];
        }
        const promises = [];
		for (const notification of data.notifications) {
		  const isDuplicate = await isNotificationDuplicate(notification);
		  if (!isDuplicate) {
			promises.push(
			  storeNotification(notification)
				.then(() => showNotification(notification))
				.then(() => broadcastToClients('newNotification', {
				  notification,
				  fromPoll: true
				}))
			);
		  } else {
			console.log('[SW] Duplicate notification from poll ignored:', notification);
		  }
		}
        return Promise.all(promises);
      })
      .catch(error => {
        console.error('[SW] Error polling for notifications:', error);
        return [];
      });
  });
}
function showNotification(notification) {
  if (!self.registration) {
    return Promise.reject(new Error('No service worker registration available'));
  }
  
	function testImage(url) {
	  return fetch(url)
		.then(response => {
		  if (response.ok) {
			return url;
		  }
		  throw new Error('Image failed to load: '+url);
		});
	}
  
  return Promise.all([
    testImage('./media/logo2.png').catch(() => undefined),
    testImage('./media/icon.png').catch(() => undefined)
  ]).then(([logoExists, iconExists]) => {
    const options = {
      body: notification.body || 'Someone joined your room',
      icon: logoExists ? './media/logo2.png' : undefined,
      badge: iconExists ? './media/icon.png' : undefined,
      vibrate: [100, 50, 100],
      data: {
        url: notification.url || notification.originalUrl || self.registration.scope,
        timestamp: notification.timestamp || Date.now(),
        topic: notification.topic,
        id: notification.id
      }
    };
    
    return self.registration.showNotification(
      notification.title || 'VDO.Ninja',
      options
    );
  });
}

function broadcastToClients(action, data) {
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        action: action,
        ...data
      });
    });
  });
}
function disconnectAll() {
  disconnectSSE();
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  currentTopic = null;
  return Promise.all([
    setStoreItem('topic', null),
    setStoreItem('sseStatus', { connected: false }),
    setStoreItem('pollingStatus', { isPolling: false })
  ]);
}