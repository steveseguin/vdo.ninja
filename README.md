![ILogo by brimace](images/obsNinja_logo_full.png)

## What is OBS NINJA
OBS.Ninja uses peer-to-peer technology to bring remote cameras into OBS. In most cases, all video data is transferred directly from peer to peer, without needing to go through any video server. This results in high-quality video with super low latency. In a small number of cases, video data may go through an encrypted TURN server, which is used to facilitate peer connections when otherwise not possible.

OBS Ninja is not affiliated with OBS. OBS.Ninja is designed to allow content creators to produce real-time live shows with OBS Studio (or other compatible software) using remote media streams. It can also turn smartphones into wireless webcams, with additional Virtualcam software. 

Please see the sub-reddit added info: https://reddit.com/r/obsninja  
Also check out the FAQ for more info: https://github.com/steveseguin/obsninja/wiki

## How to use:
I demo the basic usage of OBS.Ninja on YouTube: https://www.youtube.com/watch?v=6R_sQKxFAhg

Check the subreddit for added use cases, advanced features, and support. Advanced features includes high-quality audio modes, custom video resolutions, and more.

MacOS users will face some challenges in using OBS currently, but there are workarounds. Please see Reddit or the Wiki.

## What's in this repo?
This repo contains software for OBS.ninja, including the HTML landing page for its Electron Capture app offering. A sample config file and instructions for setting up a TURN server (video relay server), is also provided. You may also find the Wiki for the project in this repo, which contains added information on how to use the software.

## How to Deploy this Repo:
To use, just download and host on a HTTPS-enabled webserver. You may want to hide the .html extensions within your HTTP server as well, else the generated links will not work. 

Directions on how to deploy a TURN server are listed in the turnserver.conf file. You may wish to do so if you are having problems with my existing TURN server, although most users will not need one. About 10% of users, those often connected via 4G LTE, will require a TURN server. 

## Server side / API software?
Since OBS.Ninja uses peer-2-peer technology, video connections are made directly between viewer and publisher in 90% of cases. Hosting a TURN server yourself may help improve performance, but less than 1% of users will see any benefit of this. Details on how to deploy a TURN server are provided. For those capable of hosting their own TURN server, that would be appreciated if possible, as TURN servers are the only real cost incurred by OBS.Ninja at present. (other than time, of course)

Other than TURN servers, OBS.Ninja also uses public STUN servers and a hosted handshake server. These are used to facilitate the initial setup of peer connections and are generally not required after a peer connection is established. Development builds of OBS.Ninja may include debugging software, but in-production releases have this removed. 

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

#### StageTen.tv
A browser-based studio solution and simplified alternative to OBS, with built-in OBS.Ninja functionality. It is a server-based approach to group interactions and live production. Steve Seguin is affiliated with StageTen, yet StageTen is not affiliated with OBS.Ninja.

## Privacy
I try to avoid data collection whenever possible and video streams are generally designed to be private, but use at your own risk. It is best to not share links created with OBS.Ninja with those you do not trust. I've provided instructions on how to deploy a TURN server if IP-address privacy is an issue for you. See: turnserver.conf 

https://obs.ninja may unavoiably use cookies that are exempt from EU laws of requiring notice of their use; they are exempt as they are required and necessary for the technical functioning of the web service. Our webserver is cached by Cloudflare and it provides denial of server protection for the users of OBS.Ninja.

Additional security features are being added weekly on request. Please ask about these options if added security and privacy are requirements for you.

## Feedback
Ideas, feedback, bugs, etc -- all welcomed.  I'm dumping many of my ideas as issues into Github. Feedback is typcially most welcomed via Email or Discord.

## Licence 
OBS.Ninja is available as open-source; please see the LICENCE.md file for details.

