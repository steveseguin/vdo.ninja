"use strict";

var QR_BASE_URL = new URL("./", self.location.href);
var QR_CACHE_PREFIX = "vdo-qr-offline-" + encodeURIComponent(QR_BASE_URL.pathname) + "-";
var QR_CACHE_NAME = QR_CACHE_PREFIX + "v3";
var NETWORK_TIMEOUT = 2500;

var CORE_URLS = [
	"/",
	"/main.css",
	"/auth-styles.css",
	"/thirdparty/adapter.js",
	"/thirdparty/CodecsHandler.js",
	"/thirdparty/aes.js",
	"/webrtc.js",
	"/auth-client.js",
	"/lib.js",
	"/main.js",
	"/podcast/bootstrap.js",
	"/manifest.json",
	"/media/favicon-32x32.png",
	"/media/favicon-16x16.png",
	"/media/favicon.ico",
	"/media/vdoNinja_logo_full.png",
	"/media/icon-192x192.png",
	"/media/icon-512x512.png",
	"/lineawesome/fonts/la-solid-900.woff2"
];

var QR_PATHS = {
	"/qr": true,
	"/qr/": true,
	"/qr.html": true,
	"/qrconnect.js": true,
	"/qr-manifest.webmanifest": true,
	"/thirdparty/qrcode.min.js": true,
	"/thirdparty/jsqr.min.js": true
};

var CORE_PATHS = {};
CORE_URLS.forEach(function (path) {
	CORE_PATHS[path] = true;
});
CORE_URLS = CORE_URLS.map(function (path) {
	return new URL("." + path, QR_BASE_URL).href;
});

function sameOriginURL(value) {
	try {
		var url = new URL(value, QR_BASE_URL);
		return url.origin === self.location.origin ? url : null;
	} catch (error) {
		return null;
	}
}

function appPath(url) {
	if (!url || url.origin !== QR_BASE_URL.origin || url.pathname.indexOf(QR_BASE_URL.pathname) !== 0) {
		return null;
	}
	return "/" + url.pathname.slice(QR_BASE_URL.pathname.length);
}

function allowedCacheURL(value) {
	var path = appPath(sameOriginURL(value));
	return !!(path && (QR_PATHS[path] || CORE_PATHS[path]));
}

function cacheFresh(cache, value) {
	var url = sameOriginURL(value);
	if (!url) {
		return Promise.reject(new Error("Invalid offline asset URL."));
	}
	var request = new Request(url.href, {
		credentials: "same-origin",
		cache: "reload"
	});
	return fetch(request)
		.then(function (response) {
			if (!response || !response.ok) {
				throw new Error("Could not cache " + url.pathname);
			}
			return cache.put(request, response.clone());
		})
		.catch(function (error) {
			return cache.match(request, { ignoreSearch: true }).then(function (cached) {
				if (cached) {
					return;
				}
				throw error;
			});
		});
}

function cacheURLs(values) {
	var urls = values.filter(allowedCacheURL);
	if (urls.length !== values.length) {
		return Promise.reject(new Error("The offline asset list contained an unsupported URL."));
	}
	return caches.open(QR_CACHE_NAME).then(function (cache) {
		return Promise.all(
			urls.map(function (url) {
				return cacheFresh(cache, url);
			})
		);
	});
}

function isQRPage(url) {
	var path = appPath(url);
	return path === "/qr" || path === "/qr/" || path === "/qr.html";
}

function isKeptIframe(url) {
	var path = appPath(url);
	return (path === "/" || path === "/index.html") && url.searchParams.has("keepsw");
}

function qrClientRequest(event, url) {
	if (isQRPage(url) || isKeptIframe(url)) {
		return Promise.resolve(true);
	}
	if (!event.clientId) {
		return Promise.resolve(false);
	}
	return self.clients.get(event.clientId).then(function (client) {
		if (!client) {
			return false;
		}
		var clientURL = sameOriginURL(client.url);
		return !!(clientURL && (isQRPage(clientURL) || isKeptIframe(clientURL)));
	});
}

function cachedFallback(cache, request, url) {
	if (isKeptIframe(url)) {
		return cache.match(QR_BASE_URL.href, { ignoreSearch: true });
	}
	if (isQRPage(url)) {
		return cache.match(request, { ignoreSearch: true }).then(function (cached) {
			return cached || cache.match(new URL("qr.html", QR_BASE_URL).href, { ignoreSearch: true });
		});
	}
	return cache.match(request, { ignoreSearch: true });
}

function networkFirst(request, url) {
	return caches.open(QR_CACHE_NAME).then(function (cache) {
		var controller = typeof AbortController === "function" ? new AbortController() : null;
		var timer = setTimeout(function () {
			if (controller) {
				controller.abort();
			}
		}, NETWORK_TIMEOUT);
		var options = controller ? { signal: controller.signal } : {};
		return fetch(request, options)
			.then(function (response) {
				clearTimeout(timer);
				if (response && response.ok) {
					cache.put(request, response.clone()).catch(function () {});
					return response;
				}
				throw new Error("The network returned an error for " + url.pathname);
			})
			.catch(function (error) {
				clearTimeout(timer);
				return cachedFallback(cache, request, url).then(function (cached) {
					if (cached) {
						return cached;
					}
					throw error;
				});
			});
	});
}

self.addEventListener("install", function (event) {
	event.waitUntil(
		cacheURLs(CORE_URLS).then(function () {
			return self.skipWaiting();
		})
	);
});

self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches
			.keys()
			.then(function (names) {
				return Promise.all(
					names.map(function (name) {
						var legacyRootCache = QR_BASE_URL.pathname === "/" && /^vdo-qr-offline-v\d+$/.test(name);
						if (legacyRootCache || (name.indexOf(QR_CACHE_PREFIX) === 0 && name !== QR_CACHE_NAME)) {
							return caches.delete(name);
						}
					})
				);
			})
			.then(function () {
				return self.clients.claim();
			})
	);
});

self.addEventListener("message", function (event) {
	if (!event.data || event.data.type !== "cache-qr-app") {
		return;
	}
	var port = event.ports && event.ports[0];
	event.waitUntil(
		cacheURLs(Array.isArray(event.data.urls) ? event.data.urls : [])
			.then(function () {
				if (port) {
					port.postMessage({ ok: true });
				}
			})
			.catch(function (error) {
				if (port) {
					port.postMessage({
						ok: false,
						error: String(error && error.message ? error.message : error)
					});
				}
			})
	);
});

self.addEventListener("fetch", function (event) {
	if (event.request.method !== "GET") {
		return;
	}
	var url = sameOriginURL(event.request.url);
	var path = appPath(url);
	if (!path || (!QR_PATHS[path] && !CORE_PATHS[path] && path !== "/index.html")) {
		return;
	}
	event.respondWith(
		qrClientRequest(event, url).then(function (handle) {
			return handle ? networkFirst(event.request, url) : fetch(event.request);
		})
	);
});
