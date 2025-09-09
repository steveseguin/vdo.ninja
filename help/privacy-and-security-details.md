---
description: VDO.Ninja - Privacy, Policies, and Data-collection
---

# Privacy and security details

## Privacy & Security (Plain-English Explainer)

**Last updated:** September 8, 2025\
&#xNAN;_&#x54;his page is a friendly summary for curious users. It’s **not** the official policy. For the binding versions, see:_\
• Privacy Policy: [https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-privacy-policy](https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-privacy-policy)\
• Terms of Service: [https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-terms-of-service](https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-terms-of-service)\
• Abuse & Child Safety: [https://docs.vdo.ninja/help/privacy-and-security-details/abuse-and-child-safety](https://docs.vdo.ninja/help/privacy-and-security-details/abuse-and-child-safety)

***

### TL;DR

* VDO.Ninja is **peer-to-peer**. By design, your **IP address** can be visible to the people you connect with.
* We don’t store your call content. We keep only **minimal technical logs** for short periods to run and protect the service.
* We front parts of the site through **Cloudflare** for DDoS/bot protection. Cloudflare **logs technical request data**, including **full URLs with query parameters**.
* If you need more privacy, use a **VPN** or **relay (TURN/SFU)**—with a trade-off in latency/bandwidth.

***

### 1) P2P means peer IPs are exchanged

* In a direct P2P call, your device connects to the other person’s device. That usually exposes your **IP address** (and basic network/device info) to the **other participant**.
* You can reduce this exposure by using a **VPN**, forcing a **TURN** relay path, or enabling “IP leak” protections in your browser/OS. This can affect quality/performance.
* Because this exchange is **inherent to P2P**, VDO.Ninja can’t stop someone you’re talking to from learning your IP. Connect with **people you trust**.

***

### 2) What we (and our providers) log

* **No call content storage.** We don’t keep your video/audio/text after a session ends.
* We may keep **minimal technical metadata** (e.g., timestamps, error codes, IPs seen by our edge, room name/token you used, pre-check test results) for short periods to operate, debug, fight abuse, and comply with law if needed.
* **Cloudflare** protects our site and some endpoints. Cloudflare **automatically logs** things like your **IP**, **full URL (including query parameters)**, **User-Agent**, **country/region**, referrer, and security signals. Cloudflare may set security cookies/tokens. Cloudflare keeps **its own** logs under **its own** policies.
* We may share **high-level, anonymous usage spikes** with the community (e.g., “traffic doubled today”); not individual user data.

***

### 3) Cookies & local storage

* We don’t use **tracking cookies** for ads.
* Your browser’s **local storage** may hold **preferences** (camera/mic selection, device names, last settings, etc.). It’s for convenience only and stays on your device unless you clear it.
* Cloudflare may use its **own** technical cookies for security/performance.

***

### 4) TURN, SFU, STUN, and the handshake server

* **TURN** can relay encrypted media if direct P2P is blocked (e.g., strict NAT). Data is encrypted (WebRTC). Some deployments add **TLS** on top. TURN typically doesn’t store content.
* **SFU**/**Meshcast** forwards media for multi-party/broadcast workflows. It’s **not end-to-end encrypted by default**, so server-side recording is **technically possible**.
* **STUN**/ICE servers, plus our **handshake** (signaling) server, help peers discover and connect.
* The handshake server keeps **temporary connection info in memory** to make public service possible; it’s cleared once you disconnect.

***

### 5) Third-party services (Meshcast, YouTube, Twitch, etc.)

* If you embed or connect **third-party services** (e.g., Meshcast, YouTube, Twitch, Discord), **their** privacy/terms apply to their parts.
* **Meshcast:** Being SFU-based, it isn’t full end-to-end encrypted like a pure P2P call. **Viewers can see the Meshcast stream ID**, and anyone with that ID can watch (no VDO.Ninja room password required). If that’s a concern, avoid Meshcast for that session.
* A domain-isolated build is available at [**https://isolated.vdo.ninja**](https://isolated.vdo.ninja/), which _attempts_ to block third-party domains inside the VDO.Ninja UI.

***

### 6) Self-hosting & isolation

* Even if you host the website code yourself, your browser will still talk to **STUN/TURN/WSS** servers unless you change the defaults.
* Full isolation requires running **your own** STUN/TURN/WSS and configuring your deployment to use them instead of the defaults.
* Reference handshake server (private/small-scale use):\
  [https://github.com/steveseguin/websocket\_server/](https://github.com/steveseguin/websocket_server/)
* Managed third-party handshake examples are supported.
* We run multiple handshake/website/TURN servers worldwide; primary nodes are in the **USA**. A backup is at [**https://backup.vdo.ninja**](https://backup.vdo.ninja/).

***

### 7) How names, tokens, and passwords work (at a glance)

* Treat **room names** and **stream IDs** like **passwords**. Don’t share widely.
* Avoid putting raw **passwords** in URLs; prefer entering them in the UI.
* Room names (typically **encrypted**) and **salted** stream IDs are sent to the handshake server so peers can find each other.
* Passwords are meant to remain **client-side** (unless you place them in the URL) and are used to encrypt room names, further salt stream IDs, and encrypt initial handshake data.
* Hosting on a different domain also acts as a **salt**; a room/stream on one domain generally won’t interoperate with a different domain’s deployment without deliberate changes.

***

### 8) Security realities

* **Anyone can record** what they can view (OBS, system tools). Don’t assume a session is unrecorded.
* We can’t forcibly end **P2P** calls already in progress or remove content from devices we don’t control.
* We don’t proactively monitor calls. We respond to reports **best-effort** and may not be online when a live stream is happening.

***

### 9) Responsibility & risk

* Because IP exchange is inherent to P2P and we don’t control participants’ devices, we **can’t guarantee** privacy, service, or security. Use VDO.Ninja **at your own risk**.
* For sensitive use cases, consider a **VPN**, **relay mode**, **passwords**, and **careful link sharing** with trusted peers only.

***

### Questions?

* Privacy questions/requests: [**steve@seguin.email**](mailto:steve@seguin.email)

_Again, for the official, binding versions, please read:_\
Privacy Policy — [https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-privacy-policy](https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-privacy-policy)\
Terms of Service — [https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-terms-of-service](https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-terms-of-service)\
Abuse & Child Safety — [https://docs.vdo.ninja/help/privacy-and-security-details/abuse-and-child-safety](https://docs.vdo.ninja/help/privacy-and-security-details/abuse-and-child-safety)

***
