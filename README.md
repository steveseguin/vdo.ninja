
### ⚠ Notice! We've rebranded from OBS.Ninja to VDO.Ninja - all else is staying the same ✨

<img src="https://user-images.githubusercontent.com/2575698/124821455-bbfec580-df3c-11eb-9641-3d036cdd6c41.png" data-canonical-src="https://user-images.githubusercontent.com/2575698/124821455-bbfec580-df3c-11eb-9641-3d036cdd6c41.png" width="200"  />

## What is **VDO NINJA**
VDO.Ninja uses peer-to-peer technology to bring remote cameras into OBS or other studio software. 

In most cases, all video data is transferred directly from peer to peer, without needing to go through any video server. This results in high-quality video with super low latency. In a small number of cases, video data may go through an encrypted TURN server, which is used to facilitate peer connections when otherwise not possible.

VDO.Ninja is designed to allow content creators to produce real-time live shows using remote media streams. It can also turn smartphones into wireless webcams, with additional Virtualcam software.

VDO.Ninja is freely available to use as a managed service over at https://vdo.ninja. 

For live support, please join our discord at https://discord.vdo.ninja
Please see the sub-reddit added info: https://reddit.com/r/vdoninja  
Also check out the user documentation at: https://docs.vdo.ninja

<img src="https://user-images.githubusercontent.com/2575698/120865595-56de3b80-c55c-11eb-8b98-60c59ae0f904.png" height="300" />

## How to use
A video demo and playlist of the basic usage of VDO.Ninja on YouTube can be found here: https://www.youtube.com/watch?v=QaA_6aOP9z8&list=PLWodc2tCfAH1l_LDvEyxEqFf42hOBKqQM&index=1.

And Here is another video series touching on some more advanced settings: https://www.youtube.com/watch?v=mQ1Jdhf5aYg&list=PL8VJWj2-XLFpFu3G35Hdm1nKZ2xn9_0_8

Check the subreddit for added use cases, advanced features, and support. Advanced features includes high-quality audio modes, custom video resolutions, and more.

## What's in this repo
This repo contains the web client software for VDO.Ninja, along with many sample apps that leverage its IFRAME API. A sample config file and instructions for setting up an optional TURN video relay server is also provided here. The user documentation for VDO.Ninja itself is found at docs.vdo.ninja.

## How to Deploy this Repo
VDO.Ninja is available as a free-to-use hosted service at https://vdo.ninja, so deploying is optional. If you do wish to self-deploy the service however, details are provided below.

Hosting a private deployment can be as simple as hosting the files in this repository on a HTTPS-enabled webserver. For a very simple method on how to do this, there's a video guide here: https://www.youtube.com/watch?v=uYLKkX2_flY

For more advanced users, you can see the [install.md](https://github.com/steveseguin/vdoninja/blob/master/install.md) file for alternative hosting options and more details on deploying additional system components. Limited technical support is provided for self-deployments, mainly due to how time-consuming such requests are, but the details to fully-deploy all system components are provided in the install.md file.

If self-hosting, you might also wish to host your own video relay TURN server.  Directions on how to deploy a TURN server are listed in the turnserver.md file. Only about ~ 5% of remote guests usually will need a TURN server, often those connected via 4G LTE or those behind a strict firewall, but most other users don't need one. While VDO.Ninja does host some pubiic TURN servers, they are quite expensive to operate, so please try to avoid abusing if possible. If you are deploying your own version of VDO.Ninja, I'd ask you to use your own TURN servers if you are capable of doing so; it's understandable if you aren't able to though.

### Develop vs Release versions

The develop branch is a bit like the preview or nightly version of VDO.Ninja. It's intended to be functional, but it may not be that well tested or there could be incomplete features. This version aligns closely with what is normally on vdo.ninja/beta/ or vdo.ninja/alpha/, which is well suited for those wishing to submit code changes or to gain access to experimental new features. You can access the GitHub develop on Github pages here as well: https://steveseguin.github.io/vdo.ninja/

Release versions of VDO.Ninja have their own branches though, with the newest release being hosted at https://vdo.ninja/.  These latest release branch will be updated to fix bugs or critical issues as needed, but are otherwise unchanged. https://github.com/steveseguin/vdo.ninja/branches

Due to the nature of live video production, where unexpected changes to the app are not welcomed usually, I don't update https://vdo.ninja/ all that often. As well, constant updates to the primary hosted app makes supporting users challenging, as its hard to tell if an issue is with the code or with the user. For this reason, VDO.Ninja does infrequent updates to the primary hosted production version.  Users wanting newer features, or who have greater risk tolerance, should use the beta version (vdo.ninja/beta/). The alpha version is usually updated daily, whereas beta is usually updated weekly.

## Server side / API software
Since VDO.Ninja uses peer-2-peer technology, video connections are made directly between viewer and publisher in 95% of cases. Hosting a TURN server yourself may help improve performance, but less than 1% of users will see an improvement to video quality by using one. They also will not help lower bandwidth usage or CPU usage, so generally you wish to avoid using them if possible.

Details on how to deploy a TURN server are provided; see: turnserver.md. For those capable of hosting their own TURN server, that would be appreciated if possible, as TURN servers are the largest cost incurred by VDO.Ninja at present. (other than time, of course)

Other than TURN servers, VDO.Ninja also uses public STUN servers and a hosted handshake server. These are used to facilitate the initial setup of peer connections and are generally not required after a peer connection is established. These servers are free to access and use, even for private deployments. As of Version 17.3 of VDO.Ninja, you can host your own handshake server or use a third-party managed one (such as piesocket.com); please see details here: https://github.com/steveseguin/websocket_server

A design goal of VDO.Ninja is to be serverless and we are near 99% of the way there. This design objective ensures VDO.Ninja can be offered for free, along with providing increased levels of security and privacy. 

## Issues? problems? Not working?

Please see the sub-reddit for more support: https://reddit.com/r/vdoninja  

Also check out the FAQ for common answers: https://github.com/steveseguin/vdoninja/wiki

If urgent, join me on discord: https://discord.vdo.ninja or email me at steve@seguin.email  (Steve may not respond to emails if deemed unimportant)

## Related Projects
### VDO.Ninja's Electron Capture:
A better way to perform "Window Capturing" on desktop if OBS Browser Sources fails you. A downloadable tool designed to enhance VDO.Ninja, but has been expanded to have additional functionality for content creators in general
https://github.com/steveseguin/electroncapture

### CAPTION.Ninja
A free AI-based closed-captioning tool to add speech-to-text overlays to OBS Studio. It's browser-based with an easy OBS or VMix integration. Developed by Steve as well! https://caption.ninja

### Social Stream Ninja
A free Chrome extension that lets you stream and feature chat comments from Youtube, Twitch, Facebook, and more. Featured comments will appear directly in OBS or VMix as an overlay, or as a stream list of comments. It also includes a dock for more advanced function, such as text-to-speech, sentiment analysis, and saving to disk. No chroma-keying needed and the styling is pretty easy to customize without needing to modify the Chrome extension itself.
http://socialstream.ninja

### Rasbperry Ninja
Use a Raspberry Pi, NVidia Jetson, or Linux box as a dedicated camera for VDO.Ninja. This project can use the hardware encoder of the RPi or Jetson to enable 1080p30 or even 4K video capture and webRTC-based broadcasting. Support for USB, CSI, and HDMI video sources is available. Python-based.
[http://socialstream.ninja](https://github.com/steveseguin/raspberry_ninja)

## Privacy
I try to avoid data collection whenever possible and video streams are generally designed to be private, but use at your own risk. It is best to not share links created with VDO.Ninja with those you do not trust. I've provided instructions on how to deploy a TURN server if IP-address privacy is an issue for you. See: [turnserver.md](turnserver.md) 

https://vdo.ninja may unavoidably use cookies that are exempt from EU laws of requiring notice of their use; they are exempt as they are required and necessary for the technical functioning of the web service. Our webserver is cached by Cloudflare and it provides denial of server protection for the users of VDO.Ninja.

Additional security features are being added weekly on request. Please ask about these options if added security and privacy are requirements for you.

## Feedback
Ideas, feedback, bugs, etc -- all welcomed.  I'm dumping many of my ideas as issues into Github. Feedback is typically most welcomed via Email or Discord.

## Licence 
VDO.Ninja is available as 'mostly' open-source; please see the LICENCE.md file for details.

## Credit
Thank you to everyone who has helped support this project so far. From the moderators, volunteers helping with support, those contributing media assets, the project sponsors, those reporting issues, those offering feedback, and any code submissions.

## Contributors of this repo
<a href="https://github.com/steveseguin/vdoninja/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=steveseguin/vdoninja" />
</a>
