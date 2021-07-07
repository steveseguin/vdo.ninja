
#### ⚠ Notice! We've started our rebranding from OBS.Ninja to VDO.Ninja 🎈 -- nothing else will be changing. ✨

<img src="https://user-images.githubusercontent.com/2575698/124821455-bbfec580-df3c-11eb-9641-3d036cdd6c41.png" data-canonical-src="https://user-images.githubusercontent.com/2575698/124821455-bbfec580-df3c-11eb-9641-3d036cdd6c41.png" width="200"  />

## What is **VDO NINJA**
VDO.Ninja uses peer-to-peer technology to bring remote cameras into OBS or other studio software. 

In most cases, all video data is transferred directly from peer to peer, without needing to go through any video server. This results in high-quality video with super low latency. In a small number of cases, video data may go through an encrypted TURN server, which is used to facilitate peer connections when otherwise not possible.

VDO.Ninja is designed to allow content creators to produce real-time live shows using remote media streams. It can also turn smartphones into wireless webcams, with additional Virtualcam software.

VDO.Ninja is freely available to use as a managed service over at https://vdo.ninja. 

For live support, please join our discord at https://discord.obs.ninja
Please see the sub-reddit added info: https://reddit.com/r/vdoninja  
Also check out the FAQ for more info: https://github.com/steveseguin/vdoninja/wiki

<img src="https://user-images.githubusercontent.com/2575698/120865595-56de3b80-c55c-11eb-8b98-60c59ae0f904.png" height="300" />

## How to use
I demo the basic usage of VDO.Ninja on YouTube: https://www.youtube.com/watch?v=6R_sQKxFAhg

Here is a podcast series showing how to use different basic VDO.Ninja features, including macOS support: https://www.youtube.com/watch?v=XfSqufuoV74&list=PLWodc2tCfAH1l_LDvEyxEqFf42hOBKqQM

And Here is another video series touching on some more advanced settings: https://www.youtube.com/watch?v=mQ1Jdhf5aYg&list=PL8VJWj2-XLFpFu3G35Hdm1nKZ2xn9_0_8

Check the subreddit for added use cases, advanced features, and support. Advanced features includes high-quality audio modes, custom video resolutions, and more.

## What's in this repo
This repo contains software for VDO.Ninja, including the HTML landing page for its Electron Capture app offering. A sample config file and instructions for setting up a TURN server (video relay server), is also provided. You may also find [the Wiki](https://github.com/steveseguin/vdoninja/wiki) for the project in this repo, which contains added information on how to use the software.

## How to Deploy this Repo
To use, just download and host the files on a HTTPS-enabled webserver. You may want to hide the .html extensions within your HTTP server as well, else the generated links will not work. See [here](https://github.com/steveseguin/vdoninja/blob/master/install.md) for added details and alternative install options.

Directions on how to deploy a TURN server are listed in the turnserver.md file. You may wish to do so, although not all use cases will not need one. Only about 10% of remote guests, those often connected via 4G LTE, will require a TURN server. While VDO.Ninja does host some TURN servers, they are quite expensive to operate and not really for private deployment use. If you are deploying your own version of VDO.Ninja, I'd ask you use your own TURN servers instead. 

## Server side / API software
Since VDO.Ninja uses peer-2-peer technology, video connections are made directly between viewer and publisher in 90% of cases. Hosting a TURN server yourself may help improve performance, but less than 1% of users will see any benefit of this. Details on how to deploy a TURN server are provided. For those capable of hosting their own TURN server, that would be appreciated if possible, as TURN servers are the only real cost incurred by VDO.Ninja at present. (other than time, of course)

Other than TURN servers, VDO.Ninja also uses public STUN servers and a hosted handshake server. These are used to facilitate the initial setup of peer connections and are generally not required after a peer connection is established. These servers are free to access and use, even for private deployments. As of Version 17.3 of VDO.Ninja, you can host your own handshake server or use a third-party managed one (such as piesocket.com); please see details here: https://github.com/steveseguin/websocket_server

Development builds of VDO.Ninja may include debugging software, but in-production releases have this removed. Double check to ensure "console.re" debugging is disabled before deployment, just to be safe.

A design goal of VDO.Ninja is to be serverless and we are 99% of the way there. This design objective ensures VDO.Ninja can be offered for free, along with providing increased levels of security and privacy. 

## Issues? problems? Not working?

Please see the sub-reddit for more support: https://reddit.com/r/vdoninja  

Also check out the FAQ for common answers: https://github.com/steveseguin/vdoninja/wiki

If urgent, join me on discord: https://discord.gg/EksyhGA or email me at steve@seguin.email

## Related Projects
### VDO.Ninja's Electron Capture:
A better way to perform "Window Capturing" on desktop if OBS Browser Sources fails you. A downloadable tool designed to enhance VDO.Ninja.
https://github.com/steveseguin/electroncapture

### CAPTION.Ninja
A free AI-based closed-captioning tool to add speech-to-text overlays to OBS Studio. It's browser-based with an easy OBS or VMix integration. Developed by Steve as well! https://caption.ninja

### Chat.Overlay.Ninja
A free Chrome extension that lets you select Youtube Live Chat comments, with those comments then appearing directly in OBS or VMix as an overlay. No chroma-keying needed and the styling is pretty easy to customize without needing to modify the Chrome extension itself.
http://chat.overlay.ninja/

### Steves.app:
A website designed to also work with VDO.Ninja as a Broadcasting tool. Share your webcam, window, desktop, or video file with friends and family. Peer-2-peer, so privacy can be maintained, but you can also list your broadcasts for others to watch.
https://steves.app/

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
