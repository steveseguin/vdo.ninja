---
description: Beginner guide to VDO.Ninja with push and view links, OBS setup, remote guests, rooms, screen sharing, and first-stream best practices.
---

# Getting started with VDO.Ninja

VDO.Ninja can send live video and audio from a browser, phone, tablet, or computer directly into OBS Studio, a browser source, or another viewer link. This getting-started guide is the best entry point if you want to use VDO.Ninja for remote guests, a phone-as-webcam workflow, screen sharing, or basic live streaming.

## Core concepts

* **WebRTC:** VDO.Ninja uses WebRTC for low-latency browser-based video and audio transport.
* **Peer-to-peer:** Most of the heavy lifting happens in the browser, reducing server dependence for normal guest workflows.
* **Two URL types:**
  * **PUSH URL:** Used on the sending device, such as a smartphone, webcam, or screen-share source.
  * **VIEW URL:** Opened on another device, browser source, or production machine to receive the stream.

## Resources for beginners

* [vdo.ninja-basics.md](vdo.ninja-basics.md "mention") (with screenshots)
* [stream-ids.md](stream-ids.md "mention")
* [the-power-of-the-url-parameter.md](the-power-of-the-url-parameter.md "mention")
* [multi-person-chat.md](multi-person-chat.md "mention")
* [rooms](rooms/ "mention")
* [high-quality-camera.md](high-quality-camera.md "mention")
* [mobile-phone-camera-into-webcam.md](mobile-phone-camera-into-webcam.md "mention")
* [cheat-sheet-of-basic-parameters](../advanced-settings/cheat-sheet-of-basic-parameters/ "mention")

## Quick start

1. **Open VDO.Ninja:** Visit [https://vdo.ninja/](https://vdo.ninja/) in Chrome, Edge, Firefox, or Safari.
2. **Choose your source:** Select "Add your Camera to OBS" to use a webcam or phone camera, or "Share your Screen" to stream a desktop or application window.
3. **Grant permissions:** Allow camera and microphone access when prompted.
4. **Start streaming:** Click "Start" and copy the provided VIEW link.
5. **Share or capture:**
   * **Direct sharing:** Send the VIEW link to anyone who should watch the stream.
   * **OBS integration:** Add the VIEW link as a Browser Source in OBS Studio.

## Common use cases

* **Smartphone as webcam:** Turn a phone into a wireless camera for OBS or browser-based meetings.
* **Remote guests:** Bring in interview guests, podcast guests, or co-hosts.
* **Screen sharing:** Share a desktop, game, browser tab, or application window.
* **High-quality audio:** Stream music, podcasts, or voice feeds with low latency.
* **Production capture:** Pull remote video feeds straight into a live production workflow.

## Tips for success

* **Stable internet:** Ethernet is preferred over Wi-Fi when possible.
* **Hardware acceleration:** Enable hardware acceleration in your browser and OBS when supported.
* **Experiment with settings:** Explore the URL parameters to fine-tune video quality, audio settings, permissions, and room behavior.
* **Community support:** Join the VDO.Ninja Discord or Reddit community for help and workflow ideas.

## Native mobile apps

VDO.Ninja also offers native mobile apps for iOS and Android, providing a more focused mobile capture workflow. These apps are especially useful for:

* **Screen sharing on Android**
* **Local recording on mobile**
* **USB audio and external microphone workflows**
* **Quick camera-to-browser publishing**

## Terms of service and privacy policy

Please review the Terms of Service and Privacy Policy: [https://docs.vdo.ninja/help/privacy-and-security-details](https://docs.vdo.ninja/help/privacy-and-security-details). Most of it should come as no surprise, but please note that users using the service must be 16 years of age or older.
