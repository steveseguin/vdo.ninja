---
description: We strive to protect your privacy, but you use VDO.Ninja at your own risk
---

# VDO.Ninja Privacy Policy

**Effective Date:** December 26, 2025\
**Supersedes:** September 8, 2025

VDO.Ninja is a peer-to-peer tool for real-time video, audio, and text. We don’t host your call content, and we aim to keep what we process minimal. This policy explains **what we (and our providers) process**, **why**, and **your options**.

If you disagree with this policy, please don’t use the Service.

***

### 1) What we don’t store by default

* **No call content storage.** We do **not** store your video, audio, or text content after a session ends.
* **No tracking ads/cookies.** We don’t use tracking cookies for advertising.

***

### 2) What is naturally exposed in P2P calls

* **Your IP address and basic device/network info** can be visible to **the peers you connect with**. That’s how P2P works.
  * You may use a **VPN** or force a **relay (TURN/SFU)** path to reduce exposure (trade-off: performance/latency).

***

### 3) What we (and our providers) may process

**Operational metadata (minimal by design):**

* **Connection diagnostics** (timestamps, error codes), **IP address**, **User-Agent/browser details**, **room name or token** used, and **optional pre-check test results**.
* **Why:** to set up/maintain connections, fight abuse (rate-limit/anti-flood), run speed tests you trigger, and comply with law when required.

**Quality of Service (QoS) analytics (opt-out available):**

* **Where collected:** QoS analytics are collected on **vdo.ninja** and **backup.vdo.ninja** only. **Self-hosted instances do not send QoS data** to us unless explicitly configured to do so.
* We collect **anonymized connection analytics** to monitor service health and improve reliability. This includes:
  * **Session metadata:** duration, connection type (publisher/viewer/director), success/failure status
  * **Technical details:** browser type, platform (desktop/mobile/tablet), transport type (P2P/TURN/SFU)
  * **Performance metrics:** packet loss, round-trip time, jitter, bitrate (aggregate statistics)
  * **Media info:** video/audio codec, resolution
  * **Server hostnames:** only for **official VDO.Ninja TURN and Meshcast servers**; custom/private servers are recorded as "private" (no hostname captured)
  * **Geographic region:** derived from GeoIP lookup (**IP address is not stored**)
  * **Sanitized errors:** error messages with sensitive data (room IDs, passwords, IPs) removed
* **What we do NOT collect:** room names, stream IDs, passwords, tokens, IP addresses, or any call content.
* **Why:** to identify connection issues, optimize server infrastructure, and improve service reliability.
* **Retention:** QoS data is retained for approximately **30 days**.
* **Opt-out:** Add `&qos=0` to your URL to disable QoS reporting entirely.

**Cloudflare (reverse proxy / DDoS & bot protection):**

* We front the site and some endpoints with **Cloudflare**. Cloudflare **automatically** receives and logs:
  * **IP address** and **approximate location** (country/region)
  * **Full request URL (including query parameters)**, headers, and **referrer**
  * **User-Agent** / device details; TLS/network metadata
  * Derived security signals and **security cookies/tokens** (to separate humans from bots)
* **Important:** **We do not control Cloudflare’s independent logs or retention.** Cloudflare may process this data on infrastructure **outside your country** to deliver security and performance. If you object to Cloudflare processing, please don’t use the Service.

**TURN/SFU/STUN & hosting:**

* **TURN** relays encrypted media when direct P2P is blocked (state is typically **ephemeral**).
* **SFU / Meshcast** forwards media for multi-party/broadcast; **not E2EE by default** and **server-side recording is technically possible**.
* **STUN** (e.g., Google STUN or Cloudflare STUN) helps discover paths through NAT; it exposes your IP/port to that STUN service.
* Some infrastructure may run on providers like **Google Cloud** or other reputable hosts (they process operational data to run their services).

**Optional sign-in / integrations (only if you enable them):**

* If you connect **YouTube, Discord, Google Drive, Dropbox, etc.**, those services may share identifiers/permissions with us **only to enable that feature**. Their policies apply to their use of data.
* **Invite.cam** and other companions may store their own sign-in details/settings under their own policies.

**Mobile app & credentials:**

* Native apps may store **stream IDs, passwords, room names, and settings locally**; credentials may be cached locally and expire. Uninstalling the app removes local data.

***

### 4) Cookies & local storage

* We don’t use tracking cookies.
* We use **local storage** for **preferences** (e.g., camera/mic). Clear it in **Settings** or via your browser’s “Clear site data.”

***

### 5) Recording & security realities

* **WebRTC encryption:** Media is encrypted in transit.
* **SFU/Meshcast:** Not E2EE by default; a server could record.
* **Anyone can record:** Viewers/participants can record locally (OBS/system tools) without notifying others.
* **Built-in features:** If you enable recording/upload, content may be saved to a cloud you select (their policies apply).

***

### 6) Retention

* **Routine ops data:** typically **7–30 days**.
* **QoS analytics:** typically **\~30 days**.
* **Pre-check test results:** typically **\~7 days**.
* **Incident/legal holds:** If there's a lawful request or a safety report, we may preserve **relevant** logs for the legally required period (e.g., up to **1 year** for certain child-safety matters).
* **Cloudflare:** keeps its **own** security logs per its policies (we don't control that).

We don't keep more than we need.

***

### 7) Deletion & your controls

* **No user accounts** → little to delete. We generally don’t maintain profiles.
* **Web:** Clear preferences in **Settings** or via your browser’s site-data controls.
* **Mobile:** Clear/override settings in-app; uninstalling deletes local app data.
* **Newly added or experimental features:** Please ask us if not yet covered here.
* **Ask us:** You can request access/deletion of any operational data we still hold (note: due to minimal logging, we may have very little).

***

### 8) International transfers

Operational data (IP addresses, URLs, diagnostics) may be processed on infrastructure **outside your province/state or country**, including by **Cloudflare** and hosting providers. By using the Service, you **consent** to this cross-border processing for security and performance.

***

### 9) Legal bases (EEA/UK, if applicable)

We rely on:

* **Contract necessity** (to provide features you request), and
* **Legitimate interests** (security, DDoS/bot mitigation, abuse prevention, reliability, and product improvement).

***

### 10) Children’s privacy

The Service is intended for individuals **16+** and is **not** directed to children under 16. If you believe a minor has used the Service or provided data, contact us and we’ll take appropriate steps.

***

### 11) Safety & reporting (important)

* **Do not send us illegal media** (e.g., CSAM). If you have such evidence, report it to your **national child-safety hotline** (e.g., **Cybertip.ca** in Canada, **NCMEC CyberTipline** in the U.S.) and send us the **report number** with a plain description (room name, timestamps, screen names).
* We may disable links we control, block IPs/ranges/ASNs, **preserve relevant logs**, and **report** suspected child exploitation to hotlines/authorities.
* We do **not** proactively monitor communications.

***

### 12) Self-hosting

Unless fully reconfigured, a self-hosted copy may still use **official handshake/relay infrastructure** by default. If you self-host for public use, you’re responsible for **securing** your deployment and setting your own privacy/abuse processes.

***

### 13) Security

We use reasonable technical and organizational measures (TLS, Cloudflare DDoS/bot protections, minimal retention). No system is perfectly secure. Use strong room tokens, share links carefully, and consider VPN/relay trade-offs.

***

### 14) Changes to this policy

We may update this policy from time to time. If we make **material** changes, we’ll update the effective date and post a notice. Continued use after changes take effect means you accept the updated policy.

***

### 15) Contact

Privacy questions/requests: [**steve@seguin.email**](mailto:steve@seguin.email)\
Abuse & child-safety reports: [**steve@seguin.email**](mailto:steve@seguin.email) (plain description only; **no illegal media**)\
Copyright notices: [**steve@seguin.email**](mailto:steve@seguin.email)

***

#### One-line summary

We don't store your call content. **Cloudflare** fronts our site and logs request data (including **IP** and **full URLs with query parameters**) for security and performance. We collect **anonymized QoS analytics** (no IPs, room names, or content) on official VDO.Ninja domains to monitor service health. We keep only minimal operational logs and may preserve incident-related data when legally required.
