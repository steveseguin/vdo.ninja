# Fail safes and Backups

Low-latency Live streaming is inherently challenging, and as more remote streams that are added to a live production, the more likely a problem will occur.

VDO.Ninja acknowledges these risks and attempts to mitigate them when possible.

## Back-up site

If the main website and service goes down, [https://backup.vdo.ninja](https://backup.vdo.ninja) is a backup deployment of VDO.Ninja. It is independent of the main service, so if the main site is down for whatever reason, the backup site should still be up. \
\
Both the backup and main site share the same DNS provider; DNS server 1.1.1.1 should be used if there are DNS issues.

There's also the Github version of the code hosted at [https://steveseguin.github.io/vdo.ninja/](https://steveseguin.github.io/vdo.ninja/), if just the website goes down.&#x20;

## Fixed versions

VDO.Ninja does update the application code every few weeks, and with new code comes potentially new bugs and/or feature changes.\
\
To mitigate any surprises, past versions of the app remain hosted long after a new release. For example, version 18 can be found at [https://vdo.ninja/v18/](https://vdo.ninja/v18/) with **the current previous version being listed on the main site**. Most new releases become bug-free within a few days of their release, thanks to prompt user bug reports.

## Redundant relay servers

There are multiple TURN servers, which help support guests that are unable to connect directly via P2P. These are hosted in around the globe. They definitely are not cheap to host, yet are essential for a simplified and reliable user experience.

## Self-hosting

The option to self-host VDO.Ninja is available, to different degrees of isolation. Refer to the[ Github repo](https://github.com/steveseguin/vdo.ninja) for [installation instructions](https://github.com/steveseguin/vdo.ninja/blob/master/install.md). \
\
Hosting just the website code is the easiest option, providing further customization support, but hosting also the STUN, TURN, and handshake server will provide total hosting independence.

### Third-party managed hosting

While self-hosting on your own servers works, you can also host VDO.Ninja on unaffliated third party services.&#x20;

* The website code for VDO.Ninja can be forked and hosted by Github Pages for free or any website provider really.
* There are companies that offer hosted STUN and TURN services for a fee.
* VDO.Ninja's handshake server is of an agnostic design and can work with third-party websocket providers, such as piesocket.com

## Debugging tools

Speed-tests and Debug tools are provided, either via the Left-Click + CTRL (command) options or at [https://vdo.ninja/speedtest](https://vdo.ninja/speedtest) . These can be useful to diagnose problems, such as whether Packet Loss is a culprit to low-quality video, and remotely determining who is at fault.

## Active free support

There is active support on the DISCORD channel [https://discord.gg/sk4caKg](https://discord.gg/sk4caKg), Reddit, and limited support via email: steve@seguin.email If paid support is requested, there are capable users in the community who can be recommended.

## Listed known issues

On the main website, currently known issues will be listed, often with links to solutions.

As a side note, most issues are the fault of guests being connected over Wi-Fi, instead of being connected via wired Ethernet. Wi-Fi has horrible packet loss issues, and Packet Loss can kill the quality of live streams. Considering switching to Ethernet if possible, and if using OBS, perhaps consider VP9 or H264 as a codec; those codecs have less packet loss issues.

**Always prep and practice ahead of live-streams**, and make sure to have practiced game-plans and backup solutions for every possible outcome. It will reduce stress and ensure a calm and collected response to issues that inevitably happen. Low-latency live streaming can be challenging, even with the best of tools.
