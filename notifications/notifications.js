const POLL_INTERVAL = 60000;
let sseConnection = null;
let pollingInterval = null;
let notificationHistory = [];
class NotificationManager {
	  constructor() {
		this.subscribers = [];
		this.isConnected = false;
		this.currentTopic = null;
	  }
		async initialize() {
	  if ('serviceWorker' in navigator) {
		try {
		  let reg = await navigator.serviceWorker.register('./service-worker.js', { scope: './' });
		  console.log('Service Worker registered with scope:', reg.scope);
		  await navigator.serviceWorker.ready;
		  if (!navigator.serviceWorker.controller) {
			console.log('No controller, reloading page to activate service worker');
			window.location.reload();
			return false;
		  }
		  console.log('Service Worker ready and controlling the page');
		  this.setupServiceWorkerMessaging();
		  this.loadNotificationHistory();
		  const savedTopic = localStorage.getItem('notifyTopic');
		  if (savedTopic) {
			console.log('Restoring saved subscription for:', savedTopic);
			await this.startSubscription(savedTopic);
		  }
		  return true;
		} catch (error) {
		  console.error('Service Worker registration failed:', error);
		  return false;
		}
	  } else {
		console.warn('Service Workers not supported');
		return false;
	  }
	}
	async checkSubscriptionValidity() {
	  try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (!subscription) {
		  console.log('No push subscription found');
		  return false;
		}
		try {
		  const response = await fetch(subscription.endpoint, {
			method: 'HEAD',
			headers: {
			  'Origin': 'https://vdo.ninja'
			}
		  });
		  if (response.status === 404 || response.status === 410) {
			console.log('Push subscription is invalid, unsubscribing...');
			await subscription.unsubscribe();
			localStorage.removeItem('pushSubscription');
			localStorage.removeItem('pushTopic');
			return false;
		  }
		  return true;
		} catch (error) {
		  console.error('Error checking subscription validity:', error);
		  return false;
		}
	  } catch (error) {
		console.error('Error checking push subscription:', error);
		return false;
	  }
	}
	async unsubscribeFromPush() {
	  try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (subscription) {
		  await fetch('https://notify.vdo.ninja/unsubscribe', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({
			  subscription: subscription,
			  topic: localStorage.getItem('pushTopic')
			})
		  });
		  await new Promise(resolve => setTimeout(resolve, 500));
		  await subscription.unsubscribe();
		}
		localStorage.removeItem('pushSubscription');
		localStorage.removeItem('pushTopic');
		return true;
	  } catch (error) {
		console.error('Error unsubscribing from push:', error);
		return false;
	  }
	}
	
	async diagnoseNotificationIssues() {
	  console.group('Notification System Diagnostics');
	  
	  // Check permission
	  console.log('Notification permission:', Notification.permission);
	  
	  // Check service worker
	  console.log('Service worker controller:', !!navigator.serviceWorker.controller);
	  
	  // Check push subscription
	  try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		console.log('Push subscription exists:', !!subscription);
		
		if (subscription) {
		  // Check endpoint validity
		  try {
			const response = await fetch(subscription.endpoint, {
			  method: 'HEAD',
			  headers: { 'Origin': 'https://vdo.ninja' }
			});
			console.log('Push endpoint status:', response.status);
			console.log('Push endpoint:', subscription.endpoint.slice(-20));
		  } catch (error) {
			console.error('Error checking endpoint:', error);
		  }
		  
		  // Check subscription data
		  console.log('Subscription has keys:', subscription.keys && !!subscription.keys.p256dh && !!subscription.keys.auth);
		}
	  } catch (err) {
		console.error('Error checking subscription:', err);
	  }
	  
	  // Check saved topic
	  console.log('Saved topic:', localStorage.getItem('notifyTopic'));
	  console.log('Saved push topic:', localStorage.getItem('pushTopic'));
	  
	  // Check manifest
	  fetch('./manifest.json')
		.then(r => r.ok ? 'OK' : 'Failed')
		.then(status => console.log('manifest.json check:', status))
		.catch(e => console.log('manifest.json error:', e));
	  
	  console.groupEnd();
	  
	  return {
		permission: Notification.permission,
		hasServiceWorker: !!navigator.serviceWorker.controller,
		hasSubscription: await this.testPushSubscription(),
		topic: localStorage.getItem('notifyTopic')
	  };
	}
	
	async verifyPushEndpoint(endpoint) {
	  try {
		const response = await fetch(endpoint, {
		  method: 'HEAD',
		  headers: { 'Origin': 'https://vdo.ninja' }
		});
		
		console.log('Push endpoint check:', endpoint.slice(-10), 'status:', response.status);
		
		if (response.status === 404 || response.status === 410) {
		  console.warn('Push endpoint invalid (404/410), needs resubscription');
		  return false;
		}
		
		return true;
	  } catch (error) {
		console.error('Error verifying push endpoint:', error);
		return false;
	  }
	}

	urlBase64ToUint8Array(base64String) {
	  const padding = '='.repeat((4 - base64String.length % 4) % 4);
	  const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	  
	  const rawData = window.atob(base64);
	  const outputArray = new Uint8Array(rawData.length);
	  
	  for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	  }
	  
	  return outputArray;
	}
	async testPushSubscription() {
	  try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (!subscription) {
		  console.warn('No push subscription found');
		  return {
			success: false,
			error: 'No push subscription found'
		  };
		}
		if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
		  console.warn('Invalid push subscription format');
		  return {
			success: false,
			error: 'Invalid subscription format'
		  };
		}
		try {
		  const response = await fetch(subscription.endpoint, {
			method: 'HEAD',
			headers: {
			  'Origin': 'https://vdo.ninja'
			}
		  });
		  return {
			success: response.status !== 410,
			status: response.status,
			endpoint: subscription.endpoint.slice(-10)
		  };
		} catch (fetchError) {
		  console.error('Error testing subscription endpoint:', fetchError);
		  return {
			success: false,
			error: fetchError.message,
			endpoint: subscription.endpoint.slice(-10)
		  };
		}
	  } catch (error) {
		console.error('Error testing push subscription:', error);
		return {
		  success: false,
		  error: error.message
		};
	  }
	}
	isNotificationDuplicate(notification) {
	  if (!notification) return true;
	  const existingNotifications = this.getNotificationHistory();
	  if (notification.id) {
		return existingNotifications.some(n => n.id === notification.id);
	  }
	  const fiveSecondsAgo = Date.now() - 5000;
	  return existingNotifications.some(n => {
		return (n.timestamp || n.receivedAt || 0) >= fiveSecondsAgo &&
			   n.title === notification.title &&
			   n.body === notification.body;
	  });
	}
	async subscribeToPushNotifications(topic) {
	  if (!topic) {
		console.warn("No topic");
		return false;
	  }
	  
	  if (!('PushManager' in window)) {
		console.warn('Push notifications not supported');
		return false;
	  }
	  
	  try {
		const permission = await this.requestPermission();
		if (permission !== 'granted') {
		  console.warn('Notification permission denied');
		  return false;
		}
		
		const registration = await navigator.serviceWorker.ready;
		let existingSubscription = await registration.pushManager.getSubscription();
		
		// If existing subscription is found, try to use it
		if (existingSubscription) {
		  console.log('Using existing push subscription');
		  const subscriptionObject = existingSubscription.toJSON ? existingSubscription.toJSON() : existingSubscription;
		  
		  try {
			const subscriptionResponse = await fetch('https://notify.vdo.ninja/subscribe', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({
				subscription: subscriptionObject,
				topic: topic
			  })
			});
			
			if (subscriptionResponse.ok) {
			  localStorage.setItem('pushSubscription', JSON.stringify(subscriptionObject));
			  localStorage.setItem('pushTopic', topic);
			  return true;
			}
		  } catch (error) {
			console.error('Error updating subscription on server:', error);
			// Continue to try creating a new subscription
		  }
		}
		
		try {
		  // Get the server public key for VAPID with proper JSON parsing
		  const response = await fetch('https://notify.vdo.ninja/vapidPublicKey');
		  if (!response.ok) {
			throw new Error('Failed to fetch VAPID public key');
		  }
		  
		  // Parse the response as JSON instead of text
		  const responseData = await response.json();
		  const vapidPublicKey = responseData.key;
		  
		  if (!vapidPublicKey) {
			throw new Error('Invalid VAPID key format (missing key property)');
		  }
		  
		  console.log('Received VAPID key:', vapidPublicKey);
		  
		  const convertedVapidKey = this.urlBase64ToUint8Array(vapidPublicKey);
		  
		  const newSubscription = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: convertedVapidKey
		  });
		  
		  if (newSubscription) {
			console.log('Created new push subscription');
			const subscriptionObject = newSubscription.toJSON ? newSubscription.toJSON() : newSubscription;
			
			const subscriptionResponse = await fetch('https://notify.vdo.ninja/subscribe', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({
				subscription: subscriptionObject,
				topic: topic
			  })
			});
			
			if (subscriptionResponse.ok) {
			  localStorage.setItem('pushSubscription', JSON.stringify(subscriptionObject));
			  localStorage.setItem('pushTopic', topic);
			  return true;
			}
		  }
		} catch (error) {
		  console.error('Error in push subscription process:', error);
		}
		
		// If push subscription failed but we have SSE, that's ok
		return false;
	  } catch (error) {
		console.error('Error subscribing to push:', error);
		return false;
	  }
	}
	setupServiceWorkerMessaging() {
	  if (!navigator.serviceWorker) return;
	  navigator.serviceWorker.addEventListener('message', event => {
		const data = event.data;
		if (!data || !data.action) return;
		
		console.log('Service worker message received:', data.action, data);
		
		switch (data.action) {
		  case 'connectionStatus':
			this.isConnected = data.connected;
			this.notifySubscribers('connectionStatus', {
			  connected: data.connected,
			  topic: data.topic
			});
			break;
		  case 'subscriptionUpdated':
			console.log('Subscription was updated by service worker', data);
			if (data.topic) {
			  // Refresh our subscription data
			  this.checkSubscriptionValidity().then(isValid => {
				if (!isValid) {
				  console.log('Subscription is invalid, attempting to resubscribe');
				  this.startSubscription(data.topic);
				}
			  });
			}
			break;
		  case 'notificationSync':
			if (data.notifications) {
			  this.updateNotificationList(data.notifications);
			}
			break;
		  case 'newNotification':
			if (data.notification) {
			  this.handleNewNotification(data.notification);
			}
			break;
		  case 'sseStatus':
			this.notifySubscribers('sseStatus', {
			  status: data.status,
			  attempt: data.attempt,
			  delay: data.delay
			});
			break;
		  case 'statusUpdate':
			this.handleStatusUpdate(data);
			break;
		}
	  });
	  setTimeout(() => {
		if (navigator.serviceWorker.controller) {
		  this.checkStatus();
		}
	  }, 1000);
	}
	async sendToServiceWorker(message) {
	  return new Promise((resolve, reject) => {
		if (!navigator.serviceWorker.controller) {
		  return reject(new Error('No active service worker found'));
		}
		const timeout = setTimeout(() => {
		  reject(new Error('Service worker response timeout'));
		}, 10000);
		const messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = event => {
		  clearTimeout(timeout);
		  if (event.data.error) {
			reject(event.data.error);
		  } else {
			resolve(event.data);
		  }
		};
		try {
		  navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
		} catch (e) {
		  clearTimeout(timeout);
		  reject(e);
		}
	  });
	}
	async sendToServiceWorkerWithRetry(message, maxRetries = 3) {
	  let lastError;
	  for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
		  return await this.sendToServiceWorker(message);
		} catch (error) {
		  console.warn(`Service worker communication attempt ${attempt} failed:`, error);
		  lastError = error;
		  if (attempt < maxRetries) {
			await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
		  }
		}
	  }
	  throw lastError;
	}
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  notifySubscribers(event, data) {
    this.subscribers.forEach(callback => {
      callback(event, data);
    });
  }
	async startSubscription(topic) {
	  if (!topic) return false;
	  this.currentTopic = topic;
	  localStorage.setItem('notifyTopic', topic);
	  localStorage.setItem('lastPollTime', Date.now().toString());
	  localStorage.setItem('subscriptionCreatedAt', Date.now().toString());
	  const pushSuccess = await this.subscribeToPushNotifications(topic);
	  console.log('Push subscription', pushSuccess ? 'successful' : 'failed');
	  if (!navigator.serviceWorker.controller) {
		try {
		  await new Promise(resolve => {
			const timeout = setTimeout(() => resolve(false), 3000);
			navigator.serviceWorker.addEventListener('controllerchange', () => {
			  clearTimeout(timeout);
			  resolve(true);
			}, { once: true });
		  });
		} catch (e) {
		  console.warn('Timed out waiting for service worker to activate');
		}
	  }
	  if (navigator.serviceWorker.controller) {
		try {
		  const response = await this.sendToServiceWorkerWithRetry({
			action: 'connect',
			topic: topic
		  });
		  this.notifySubscribers('connectionStatus', {
			connected: response && response.connected,
			topic: topic
		  });
		  return true;
		} catch (error) {
		  console.error('Error connecting via service worker after retries:', error);
		  this.startFallbackPolling(topic);
		  return pushSuccess;
		}
	  } else {
		console.warn('Service worker not active, using fallback polling');
		this.startFallbackPolling(topic);
		return pushSuccess;
	  }
	}
	async checkSubscriptionRenewal() {
	  const subscriptionCreatedAt = parseInt(localStorage.getItem('subscriptionCreatedAt') || '0');
	  const currentTopic = localStorage.getItem('notifyTopic');
	  if (!subscriptionCreatedAt || !currentTopic) return;
	  const now = Date.now();
	  const monthInMs = 30 * 24 * 60 * 60 * 1000;
	  if (now - subscriptionCreatedAt > monthInMs) {
		this.promptForRenewal(currentTopic);
	  }
	}
	promptForRenewal(topic) {
	  const lastRenewalPrompt = parseInt(localStorage.getItem('lastRenewalPrompt') || '0');
	  const now = Date.now();
	  const dayInMs = 24 * 60 * 60 * 1000;
	  if (now - lastRenewalPrompt < dayInMs) return;
	  const renewalElement = document.createElement('div');
	  renewalElement.className = 'notification-popup';
	  renewalElement.innerHTML = `
		<div class="notification-popup-header">
		  <h3 class="notification-popup-title">🔔 Notification Renewal</h3>
		  <button class="notification-popup-close">&times;</button>
		</div>
		<div class="notification-popup-body">
		  <p></p>
		  <p>Would you like to continue receiving these notifications?</p>
		</div>
		<div class="notification-popup-actions">
		  <button class="secondary unsubscribe-btn">Unsubscribe</button>
		  <button class="renew-btn">Renew Subscription</button>
		</div>
	  `;
	  renewalElement.querySelector('.notification-popup-body p').textContent = `You've been subscribed to notifications for "${topic}" for a month.`;
	  document.body.appendChild(renewalElement);
	  localStorage.setItem('lastRenewalPrompt', now.toString());
	  renewalElement.querySelector('.notification-popup-close').addEventListener('click', () => {
		document.body.removeChild(renewalElement);
	  });
	  renewalElement.querySelector('.unsubscribe-btn').addEventListener('click', () => {
		this.stopSubscription();
		document.body.removeChild(renewalElement);
	  });
	  renewalElement.querySelector('.renew-btn').addEventListener('click', () => {
		localStorage.setItem('subscriptionCreatedAt', Date.now().toString());
		this.refreshSubscription(topic);
		document.body.removeChild(renewalElement);
	  });
	}
	async refreshSubscription(topic) {
	  try {
		const registration = await navigator.serviceWorker.ready;
		const subscription = await registration.pushManager.getSubscription();
		if (!subscription) {
		  console.warn('No subscription to refresh');
		  return false;
		}
		const response = await fetch('https://notify.vdo.ninja/refresh', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({
			subscription: subscription.toJSON ? subscription.toJSON() : subscription,
			topic: topic
		  })
		});
		if (response.ok) {
		  this.notifySubscribers('notification', {
			notification: {
			  title: 'Subscription Renewed',
			  body: `You'll continue receiving notifications for "${topic}"`,
			  timestamp: Date.now()
			}
		  });
		  return true;
		}
		return false;
	  } catch (error) {
		console.error('Error refreshing subscription:', error);
		return false;
	  }
	}
	async stopSubscription() {
	  this.currentTopic = null;
	  localStorage.removeItem('notifyTopic');
	  localStorage.removeItem('lastPollTime');
	  await this.unsubscribeFromPush();
	  if (navigator.serviceWorker.controller) {
		try {
		  await this.sendToServiceWorker({ action: 'disconnect' });
		} catch (error) {
		  console.error('Error disconnecting:', error);
		}
	  }
	  if (pollingInterval) {
		clearInterval(pollingInterval);
		pollingInterval = null;
	  }
	  return true;
	}
  startFallbackPolling(topic) {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    const pollForNotifications = async () => {
      try {
        const lastPollTime = parseInt(localStorage.getItem('lastPollTime') || '0');
        const response = await fetch(`https://notify.vdo.ninja/poll?topic=${encodeURIComponent(topic)}&since=${lastPollTime}`);
        const data = await response.json();
        localStorage.setItem('lastPollTime', Date.now().toString());
        if (data.notifications && Array.isArray(data.notifications) && data.notifications.length > 0) {
          data.notifications.forEach(notification => {
            this.showNotification(notification);
            this.addNotificationToHistory(notification);
          });
        }
        this.notifySubscribers('sseStatus', { status: 'polling' });
      } catch (error) {
        console.error('Error during fallback polling:', error);
      }
    };
    pollForNotifications();
    pollingInterval = setInterval(pollForNotifications, POLL_INTERVAL);
  }
  async requestPermission() {
    if (!('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    const permission = await Notification.requestPermission();
    return permission;
  }
	async checkStatus() {
	  if (navigator.serviceWorker.controller) {
		try {
		  const response = await this.sendToServiceWorkerWithRetry({ action: 'checkStatus' });
		  if (response) {
			this.notifySubscribers('statusUpdate', {
			  topic: response.config?.topic,
			  connected: true,
			  sseConnected: response.sse?.connected,
			  isPolling: response.polling?.isPolling
			});
			this.notifySubscribers('connectionStatus', {
			  connected: response.sse?.connected || response.polling?.isPolling,
			  topic: response.config?.topic
			});
			if (response.sse?.connected) {
			  this.notifySubscribers('sseStatus', { status: 'connected' });
			} else if (response.polling?.isPolling) {
			  this.notifySubscribers('sseStatus', { status: 'polling' });
			} else {
			  this.notifySubscribers('sseStatus', { status: 'disconnected' });
			}
		  }
		  return response && (response.sse?.connected || response.polling?.isPolling);
		} catch (error) {
		  console.error('Error checking status:', error);
		  this.notifySubscribers('sseStatus', { status: 'disconnected' });
		  return false;
		}
	  }
	  return false;
	}
	
	handleStatusUpdate(data) {
	  if (data.config && data.config.topic) {
		this.currentTopic = data.config.topic;
		this.notifySubscribers('statusUpdate', {
		  topic: data.config.topic,
		  connected: true,
		  sseConnected: data.sse && data.sse.connected,
		  isPolling: data.polling && data.polling.isPolling
		});
	  }
	}
  showNotification(notification) {
	  return new Promise((resolve, reject) => {
		if (!self.registration) {
		  return reject(new Error('No service worker registration available'));
		}
		
		try {
		  // Use relative paths to improve reliability
		  const options = {
			body: notification.body || 'Someone joined your room',
			icon: './media/logo2.png', // Use relative path
			badge: './media/icon.png', // Use relative path
			vibrate: [100, 50, 100],
			data: {
			  url: notification.url || notification.originalUrl || self.registration.scope,
			  timestamp: notification.timestamp || Date.now(),
			  topic: notification.topic,
			  id: notification.id
			}
		  };
		  
		  // Simply try to show the notification
		  self.registration.showNotification(
			notification.title || 'VDO.Ninja',
			options
		  ).then(() => {
			console.log('[SW-DEBUG] Notification shown successfully:', notification.id);
			resolve();
		  }).catch(error => {
			console.error('[SW-DEBUG] Error showing notification:', error ? error.toString() : 'Unknown error');
			reject(error);
		  });
		} catch (error) {
		  console.error('[SW-DEBUG] Exception in showNotification:', error ? error.toString() : 'Unknown error');
		  reject(error);
		}
	  });
	}
	
  playNotificationSound() {
    const soundSetting = localStorage.getItem('notificationSound') || 'default';
    if (soundSetting === 'none') return;
    let soundFile;
    switch (soundSetting) {
      case 'chime':
        soundFile = '/notifications/media/chime.wav';
        break;
      case 'bell':
        soundFile = '/notifications/media/bell.wav';
        break;
      default:
        soundFile = '/notifications/media/tone.mp3';
    }
    const audio = new Audio(soundFile);
    audio.play().catch(e => console.warn('Could not play notification sound', e));
  }
  handleNewNotification(notification) {
    this.showNotification(notification);
  }
  updateNotificationList(notifications) {
    if (!notifications || !Array.isArray(notifications) || notifications.length === 0) return;
    notificationHistory = notifications.map(n => ({
      ...n,
      isNew: n.isNew || false
    }));
    localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
    this.notifySubscribers('historyUpdated', { notifications: notificationHistory });
  }
  addNotificationToHistory(notification) {
    const historyItem = {
      ...notification,
      receivedAt: Date.now(),
      isNew: true
    };
    notificationHistory.unshift(historyItem);
    if (notificationHistory.length > 50) {
      notificationHistory = notificationHistory.slice(0, 50);
    }
    localStorage.setItem('notificationHistory', JSON.stringify(notificationHistory));
    this.notifySubscribers('historyUpdated', { notifications: notificationHistory });
  }
  loadNotificationHistory() {
    try {
      const savedHistory = localStorage.getItem('notificationHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        notificationHistory = Array.isArray(parsed) ? parsed.filter(item => item && typeof item === 'object' && !Array.isArray(item)) : [];
        this.notifySubscribers('historyUpdated', { notifications: notificationHistory });
      }
    } catch (e) {
      console.error('Error loading notification history', e);
      notificationHistory = [];
    }
    if (navigator.serviceWorker.controller) {
      this.sendToServiceWorker({ action: 'syncNotifications' })
        .catch(error => console.error('Failed to sync notifications:', error));
    }
  }
  clearNotificationHistory() {
    notificationHistory = [];
    localStorage.removeItem('notificationHistory');
    this.notifySubscribers('historyUpdated', { notifications: [] });
  }
  getNotificationHistory() {
    return [...notificationHistory];
  }
	async sendTestNotification(topic, customMessage = null) {
	  if (!topic) return Promise.resolve(false);
	  const message = customMessage || "Someone joined Test Room";
	  const notifyUrl = `https://notify.vdo.ninja/?notify=${encodeURIComponent(topic)}&message=${encodeURIComponent(message)}`;
	  console.log('Sending notification to:', notifyUrl);
	  try {
		const response = await fetch(notifyUrl);
		if (!response.ok) {
		  console.error('Server returned error:', response.status);
		  return false;
		}
		try {
		  const data = await response.json();
		  console.log('Notification response:', data);
		  return true;
		} catch (err) {
		  console.warn('Could not parse JSON response:', err);
		  return true;
		}
	  } catch (error) {
		console.error('Network error when sending notification:', error);
		return false;
	  }
	}
  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    }
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}
const notificationManager = new NotificationManager();
window.notificationManager = notificationManager;
window.diagnosePush = () => window.notificationManager.diagnoseNotificationIssues();
