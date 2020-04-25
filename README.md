![ILogo by brimace](obsNinja_logo_full.png)

## What's in this repo?
This is the client-side software for OBS.ninja.  Feel free to use it as you will; code contributions very welcomed. You may be best suited at getting ahold of me at steve@seguin.email instead of via Github if urgent though.

## How to Deploy this Repo:
To use, just download and host on a HTTPS-enabled webserver. You may want to hide the .html extensions within your HTTP server as well, else the generated links will not work. Customize the code as desired. Poke me at steve@seguin.email if you wish to commit your changes to obs.ninja directly. 

Directions on how to deploy a TURN server are listed in the turnserver.conf file.  Useful for bypassing firewalls.

Why deploy? You may want to customize the UI for your brand/business, or control security/privacy beyond what I do already. The server API is fairly flexible, so you can also add features that I do not include currently. Please be aware that the SERVER api changes often, at least at this point in early development, so it is best to CONTRIBUTE to this repo if you intend to keep things compatible.

## What is OBS NINJA
OBS.ninja uses peer 2 peer technology to bring remote cameras into OBS. The server-side load is very small, so I am able to offer it as a service for free.  It can be found at https://obs.ninja and the beta version can be found at https://obs.ninja/beta

OBS Ninja is not affiliated with OBS, but OBS Ninja is dependent on OBS to function.

Please see the sub-reddit added info: https://reddit.com/r/obsninja  
Also check out the FAQ for more info: https://github.com/steveseguin/obsninja/wiki

## How to use:
I demo the basic usage of OBS.ninja also on YoutuBe: https://www.youtube.com/watch?v=6R_sQKxFAhg

Check the subreddit for added use cases, advanced features, and support.

## Server side / API software?
The Server-side software uses code from my other project, https://Steves.app and https://meshcast.io  I have not made the server side software public yet, but the API remains free to access and use. If it gets abused, I'll put up restrictions. I do my best to not collect data of any type, but I may do so to improve the service, such as monitoring site usage, logging errors, or ensuring reliable connectivity.

## Issues? problems? Not working?

Please see the sub-reddit for more support: https://reddit.com/r/obsninja  

Also check out the FAQ for common answers: https://github.com/steveseguin/obsninja/wiki

If urgent, email me at steve@seguin.email or join me on discord: https://discord.gg/EksyhGA 

## Related Projects
#### OBS.Ninja's Electron Capture:
A better way to perform "Window Capturing" on desktop if OBS Browser Sources fails you. A downloadable tool designed to enhance OBS.Ninja.
https://github.com/steveseguin/electroncapture

#### Steves.app:
A website designed to also work with OBS.Ninja as a Broadcasting tool. Share your webcam, window, desktop, or video file with friends and family. Peer-2-peer, so privacy can be maintained, but you can also list your broadcasts for others to watch.
https://steves.app/

## Privacy
I try to avoid data collection whenever possible. Video streams are generally private, but I've yet to fully-secure the system, so use at your own risk. It is best to not share links created with OBS.ninja with those you do not trust. I've provided instructions on how to deploy a TURN server if IP-address privacy is an issue or if direct peer-to-peer connectivity is blocked by a firewall. See: turnserver.conf  

## Feedback
Idea, feed back, bugs, etc -- all welcomed.  I'm dumping many of my ideas as issues into Github. Email me or post to the subreddit

## License 
License? Well, currently it is free to use and modify however you wish. Please link back here if redistributing.  I reserve the right to  release future versions that may not be free or may have a different liceence agreement. I cannot be held responsible for what you do with my software and if my server goes down, I will not be responsible for that either. 
