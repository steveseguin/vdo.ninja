
<img src="https://github.com/user-attachments/assets/8134f167-2ea5-42e8-9450-b7aed322b6b0" width="300" />

[![GitHub stars](https://img.shields.io/github/stars/steveseguin/vdo.ninja?style=social)](https://github.com/steveseguin/vdo.ninja)
[![GitHub forks](https://img.shields.io/github/forks/steveseguin/vdo.ninja?style=social)](https://github.com/steveseguin/vdo.ninja/fork)
[![GitHub release](https://img.shields.io/github/v/release/steveseguin/vdo.ninja?include_prereleases)](https://github.com/steveseguin/vdo.ninja/releases)
[![Discord](https://img.shields.io/discord/698324796546482177?color=7289DA&label=community&logo=discord&logoColor=white)](https://discord.vdo.ninja)
[![Share on Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fsteveseguin%2Fvdo.ninja)](https://twitter.com/intent/tweet?text=Check%20out%20VDO.Ninja%20-%20Peer-to-peer%20video%20streaming%20for%20OBS%20and%20more!&url=https%3A%2F%2Fgithub.com%2Fsteveseguin%2Fvdo.ninja)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/steveseguin/vdo.ninja/badge)](https://scorecard.dev/viewer/?uri=github.com/steveseguin/vdo.ninja)

#### ⚠ Notice! We've rebranded from OBS.Ninja to VDO.Ninja - all else is staying the same ✨


## What is VDO.Ninja? 🚀

VDO.Ninja brings peer-to-peer technology to OBS and other studio software, enabling remote camera integration with:

* 🔒 Direct peer-to-peer video transfer in most cases
* ⚡ High-quality video with super low latency
* 💪 Director control room with group chat
* 📱 Smartphone wireless webcam capabilities
* 🌐 Supports WHIP/WHEP and self-hosted SFUs
* 🆓 Free software. Free managed services. Free support.

<img src="https://user-images.githubusercontent.com/2575698/120865595-56de3b80-c55c-11eb-8b98-60c59ae0f904.png" height="300" />

## Quick Links 🔗

* 💬 [Live Support Discord](https://discord.vdo.ninja)
* 📚 [Documentation](https://docs.vdo.ninja)
* 🎯 [Subreddit](https://reddit.com/r/vdoninja)
* 🧯 [Backup Deployment](https://backup.vdo.ninja)
* 📱 Basic versions also available on [App Store](https://apps.apple.com/us/app/vdo-ninja/id1607609685) and [Play Store](https://play.google.com/store/apps/details?id=flutter.vdo.ninja)

## How to Use 📝

You can get started by just opening [VDO.Ninja](https://vdo.ninja/) in your browser and selecting *Add your Camera to OBS*.

* 🎥 [Basic Intro Video](https://www.youtube.com/watch?v=QaA_6aOP9z8&list=PLWodc2tCfAH1l_LDvEyxEqFf42hOBKqQM&index=1)
* 📺 [YouTube Video Tutorials](https://www.youtube.com/watch?v=mQ1Jdhf5aYg&list=PL8VJWj2-XLFpFu3G35Hdm1nKZ2xn9_0_8)
* 📖 [Getting Started Documentation](https://docs.vdo.ninja/getting-started)

Join the [Discord](https://discord.vdo.ninja) for community exhibitions, discussions, support, and feature updates.

## Alternative versions of VDO.Ninja
* 🪟 [Mixer App with custom layouts](https://vdo.ninja/mixer)
* 🏹 [WHIP/WHEP client](https://vdo.ninja/whip)
* 📈 [Sharable Whiteboard](https://vdo.ninja/whiteboard)
* 🕹️ [ESports Feed Manager](https://versus.cam)
* 🌃 [Alpha-version updated nightly](https://vdo.ninja/alpha)

## What's in this repo
This repository contains the VDO.Ninja web frontend and sample apps using its IFRAME API. Production backend implementations and operational scripts belong in separate repositories. Optional TURN configuration and `.sample` files are included as self-hosting examples; the website does not execute them. TURN setup guidance is provided in [turnserver.md](turnserver.md). The user documentation for VDO.Ninja itself is found at docs.vdo.ninja.

## Hosting and local development

The public service is available at [vdo.ninja](https://vdo.ninja/). To host the frontend yourself, serve this repository from an HTTPS-enabled static web server. There is no frontend build step or package installation required.

For a local preview, run this from the repository root:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://localhost:8080/`. Use HTTPS when accessing the site from other devices. Local preview serves the frontend only; normal rooms still connect to the configured signaling and relay services.

See [install.md](install.md) for deployment guidance and [turnserver.md](turnserver.md) for TURN setup examples. Hosting the frontend does not deploy the production authentication, signaling, relay, or call-in backends. Optional features may require separately configured services and credentials.

Before publishing changes, run the repository's translation checks:

```sh
node .github/ci-validateTranslations.js
node .github/ci-checkTranslationKeys.js
```

These checks require Node.js and do not cover browser behavior. Test the affected publishing, viewing, recording, or device-selection flows separately.

### Develop vs Release versions

The develop branch of this repo is a bit like the preview or nightly version of VDO.Ninja. It's intended to be functional, but it may not be that well tested, or there could be incomplete features. The develop version aligns closely with what is normally on vdo.ninja/alpha/, which is well suited for those wishing to submit code changes or to gain access to experimental new features. You can access a hosted version of the GitHub develop branch on Github pages here as well: https://steveseguin.github.io/vdo.ninja/

Release versions of VDO.Ninja have their own branches though. These latest release branch will be updated to fix bugs or critical issues as needed, but are otherwise unchanged. https://github.com/steveseguin/vdo.ninja/branches

Due to the nature of live video production, where unexpected changes to the app are not welcomed usually, I don't update https://vdo.ninja/ all that often. As well, constant updates to the primary hosted app makes supporting users challenging, as its hard to tell if an issue is with the code or with the user. For this reason, VDO.Ninja does infrequent updates to the primary hosted production version.  Users wanting newer features, or who have greater risk tolerance, should use alpha version at https://vdo.ninja/alpha/

## Backend services and self-hosting

The browser client uses signaling to establish ordinary rooms and peer connections. STUN helps discover network addresses; TURN relays traffic when a direct connection cannot be established. These services are separate from the static frontend.

- **Signaling:** [install.md](install.md) links to a separate handshake-server project and describes configuring the client for it.
- **TURN:** [turnserver.md](turnserver.md), `turnserver_basic.conf`, and the `.sample` files provide optional self-hosting examples. Replace placeholder settings before use. The website does not execute these samples.
- **Twilio call-in:** requires an explicitly configured backend URL. The Twilio backend implementation and a hosted default are not included. SIP call-in instead uses the provider settings entered by the user.
- **Live translation:** accepts a user-supplied API key or a separately configured token broker. No broker implementation is bundled here.
- **Offline deployments:** see the separate [offline deployment project](https://github.com/steveseguin/offline_deployment). Check its requirements and compatibility before deploying it.

Self-hosting the frontend does not automatically make a deployment independent of hosted services. Review the features you enable and their configured endpoints. See [LICENCE.md](LICENCE.md) for the distinction between the software license and access to hosted services.

## Issues? problems? Not working?

Join me and the community on Discord for support and more: https://discord.vdo.ninja. You can email me at steve@seguin.email for more urgent support or with other other inquiries if required.

The sub-Reddit is available at, https://reddit.com/r/vdoninja. I will often offer a single-message response to support questions posted there, but for deeper discussion, join the Discord.

Also check out the FAQ for common answers: https://docs.vdo.ninja or view recent product updates at: https://updates.vdo.ninja

I maintain a Youtube playlist with VDO.Ninja related content I create at https://www.youtube.com/watch?v=vLpRzMjUDaE&list=PLWodc2tCfAH1WHjl4WAOOoRSscJ8CHACe, however Youtube is full of community-created guides that are worth checking out.

## Related Projects
### VDO.Ninja's Electron Capture:
A better way to perform "Window Capturing" on desktop if OBS Browser Sources fails you. A downloadable tool designed to enhance VDO.Ninja, but has been expanded to have additional functionality for content creators in general
[https://github.com/steveseguin/electroncapture](https://github.com/steveseguin/electroncapture)

### Social Stream Ninja
A free Chrome extension (also a Standalone app version is available now) that lets you stream and feature chat comments from Youtube, Twitch, Facebook, and more. Featured comments will appear directly in OBS or VMix as an overlay, or as a stream list of comments. It also includes a dock for more advanced function, such as text-to-speech, LLM bots, sentiment analysis, and saving messages to disk. No chroma-keying needed and the styling is pretty easy to customize without needing to modify the Chrome extension itself.
[http://socialstream.ninja](http://socialstream.ninja)

### Rasbperry Ninja
Use a Linux system, Raspberry Pi, Nvidia Jetson, Mac, and even Windows PC (WSL) to publis or view WebRTC video using Gstreamer and Python; no browser needed . This project can use the system's local hardware encoder to enable high resolution video and even accelerated AV1 encoding. Support for USB, CSI, and HDMI video sources is available, along with options to pass-thru sources without transcoding. OpenCV-friendly, for low-latency computer vision and machine learning applications.
[http://raspberry.ninja](https://github.com/steveseguin/raspberry_ninja)

### CAPTION.Ninja
A free AI-based closed-captioning tool to add speech-to-text overlays to OBS Studio. It's browser-based with an easy OBS or VMix integration. Developed by Steve as well!
[https://caption.ninja](https://caption.ninja)

## Privacy
I try to avoid data collection whenever possible and video streams are generally designed to be private, but use at your own risk. It is best to not share links created with VDO.Ninja with those you do not trust. I've provided instructions on how to deploy a TURN server if IP-address privacy is an issue for you. See: [turnserver.md](turnserver.md)

https://vdo.ninja may unavoidably use cookies that are exempt from EU laws of requiring notice of their use; they are exempt as they are required and necessary for the technical functioning of the web service. Our webserver is cached by Cloudflare and it provides denial of server protection for the users of VDO.Ninja.

Additional security features are being added weekly on request. Please ask about these options if added security and privacy are requirements for you.

Please see: [Terms of Service](https://docs.vdo.ninja/help/privacy-and-security-details/vdo.ninja-terms-of-service) | [Privacy Policy](https://docs.vdo.ninja/help/privacy-and-security-details).

## Feedback
Ideas, feedback, bugs, etc -- all welcomed.  I'm dumping many of my ideas as issues into Github. Feedback is typically most welcomed via Email or Discord.

## Licence
See [LICENCE.md](LICENCE.md) for licensing and ownership details, [LICENSE](LICENSE) for the full core license, and [examples/LICENSE](examples/LICENSE) for the example-code license.

## Credit
Thank you to everyone who has helped support this project so far. From the moderators, volunteers helping with support, those contributing media assets, the project sponsors, those reporting issues, those offering feedback, and any code submissions.

## Contributors of this repo
<a href="https://github.com/steveseguin/vdo.ninja/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=steveseguin/vdo.ninja" />
</a>
