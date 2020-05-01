![ILogo by brimace](obsNinja_logo_full.png)

## What is OBS NINJA
OBS.Ninja uses peer-to-peer technology to bring remote cameras into OBS. In most cases, all video data is transferred directly from peer to peer, without needing to go through any remote server. This results in high-quality video with super low latency. In a small number of cases, video data may go through an encrypted TURN server, which is used to facilitate peer connections when otherwise not possible.

OBS Ninja is not affiliated with OBS, but OBS Ninja is dependent on OBS to function. OBS.Ninja is designed to allow content creators to produce real-time live shows with OBS Studio and to allow smartphones to be used as webcams on a Windows PC. 

Please see the sub-reddit added info: https://reddit.com/r/obsninja  
Also check out the FAQ for more info: https://github.com/steveseguin/obsninja/wiki

## How to use:
I demo the basic usage of OBS.Ninja on YouTube: https://www.youtube.com/watch?v=6R_sQKxFAhg

Check the subreddit for added use cases, advanced features, and support. Advanced features includes high-quality audio modes, custom video resolutions, and more.

MacOS users will face some challenges in using OBS currently, but there are workarounds. Please see Reddit or the Wiki.

## What's in this repo?
This repo contains the software for OBS.ninja and its TURN server deployment settings. Feel free to use it as you will; code contributions very welcomed. You may be best suited at getting ahold of me at steve@seguin.email instead of via Github if urgent though.

## How to Deploy this Repo:
To use, just download and host on a HTTPS-enabled webserver. You may want to hide the .html extensions within your HTTP server as well, else the generated links will not work. Customize the code as desired. 

Directions on how to deploy a TURN server are listed in the turnserver.conf file. You may wish to do so if you are having problems with my existing TURN server, although most users will not need one. About 10% of users, those often connected via 4G LTE, will require a TURN server. My TURN server does cost me money to host, which I do for free, so please do not abuse it.

Why deploy OBS.Ninja? You may want to customize the UI for your brand/business, or control security/privacy beyond what I do already. I personally feel it is best to CONTRIBUTE desired changes to this repo instead, as technology moves fast and older forked versions will become obsolete. 

## Server side / API software?
Other than the hosted TURN server, OBS.Ninja uses public STUN servers and a hosted handshake server. These are used to facilitate the initial setup of peer connections and are not required after a peer connection is established. Development builds of OBS.Ninja may include debugging software, but in-production releases have this removed.

A design goal of OBS.Ninja is to be serverless and we are 99% of the way there. This design objective ensures OBS.Ninja can be offered for free, along with providing increased levels of security and privacy.

## Issues? problems? Not working?

Please see the sub-reddit for more support: https://reddit.com/r/obsninja  

Also check out the FAQ for common answers: https://github.com/steveseguin/obsninja/wiki

If urgent, join me on discord: https://discord.gg/EksyhGA or email me at steve@seguin.email

## Related Projects
#### OBS.Ninja's Electron Capture:
A better way to perform "Window Capturing" on desktop if OBS Browser Sources fails you. A downloadable tool designed to enhance OBS.Ninja.
https://github.com/steveseguin/electroncapture

#### Steves.app:
A website designed to also work with OBS.Ninja as a Broadcasting tool. Share your webcam, window, desktop, or video file with friends and family. Peer-2-peer, so privacy can be maintained, but you can also list your broadcasts for others to watch.
https://steves.app/

## Privacy
I try to avoid data collection whenever possible and video streams are generally designed to be private, but use at your own risk. It is best to not share links created with OBS.Ninja with those you do not trust. I've provided instructions on how to deploy a TURN server if IP-address privacy is an issue for you. See: turnserver.conf

Additional security features are being added weekly on request. Please ask about these options if added security and privacy are concerns for you.

## Feedback
Idea, feed back, bugs, etc -- all welcomed.  I'm dumping many of my ideas as issues into Github. Feedback is typcially most welcomed via Email or Discord.

## License 
Currently the software is free to use and modify however you wish, including for commericial applications. Please link back here if redistributing any portion of OBS.Ninja as code or as a service. I (steve) reserve the right to release future versions that may not be free or may have a different licence agreement. I cannot be held responsible for what you do with my software, and if problems occur with the software or any provided service, I will not be responsible for that either. Usage of OBS.Ninja, as a service or as code, is to be used in Good Faith and may not be used to intentially harm OBS.Ninja or its creator.
