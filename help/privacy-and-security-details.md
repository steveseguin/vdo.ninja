---
description: Privacy, Policies, and Data-collection
---

# Privacy and security details

[VDO.Ninja](https://vdo.ninja) is a peer-to-peer network, which implies it naturally will share your IP address with the remote guests you are connecting with. There are ways to prevent this, such as using VPNs, TURN-servers, and/or enabling IP-leak protection in your browser, but this is not the default behavior. In no way does VDO.Ninja accept responsibility if your IP address is leaked. Connecting only with trusted peers, such as people you know and trust, is recommended for most use cases.

VDO.Ninja does not store IP addresses or other personal information for longer than is needed to provide the service. This might include for purposes of TURN relay server, error reporting, or for Denial of Service abuse prevention (anti-flooding). There are no user-accounts, although you may use third-party services such as Discord, Reddit, Email, or Youtube to communicate with the VDO.Ninja developers, support, and community.

VDO.Ninja uses Cloudflare as a webserver caching service and DNS service, and for some of the site's security. Cloudflare may use technical cookies and data-collection to provide reliable service and very basic analytics for VDO.Ninja. These general usage analytics may be shared with the community, such as when the service sees a large spike in usage, and Cloudflare claims this data is all GDPR-compliant.

Video data may at times be transferred via a hosted TURN video relay server, but this is done only to ensure service. This media data is not stored and is only accessible to the intended remote peer. In most cases though, the video data is directly transferred between two peers, without the use of such servers. Any data that passes through the TURN server remains encrypted per the WebRTC standard, and some TURN servers provided offer further TLS encryption on top of it.

VDO.Ninja on its own does not use tracking cookies, though it may use the local storage for storing preferences, settings, or history for the purpose of improved user experience. These are not used for tracking, nor are they transferred anywhere. Cloudflare may use its own technical cookies, as mentioned previously.

Deploying the VDO.Ninja website code yourself will still reveal your IP address to some servers, such as STUN/TURN/WSS servers, which are needed for WebRTC to function. The VDO.Ninja hosted and operated servers do not collect personal data, although it may be possible that error or system logs will occasionally capture an IP address. These logs are generally cleared and are not stored longer than needed to ensure reliable and bug-free service.\
\
The option to host your own STUN, TURN and WSS servers exists, allowing for fully isolated hosting, but limited support is available for users choosing this route. Please see the VDO.Ninja Github repo for information on deploying server-side software, where links to code and detailed instructions are provided.\
\
Some third-party services, such as [Meshcast.io](https://meshcast.io), may be used with VDO.Ninja by means of IFRAMES, but those third-party services are out of the scope of this privacy document. VDO.Ninja does have a domain-isolated hosted version to block such services though from being used in VDO.Ninja, located at https://isolated.vdo.ninja, which blocks third-party domains from functioning within VDO.Ninja's website code.

When using the VDO.Ninja service, stream ID values and room names should be kept secure and treated like passwords when possible. Actual passwords are available additionally though, which are used to enable a client-side encryption mechanism that ensure two peers are unable to connect if passwords do not match. Passwords are not shared with any server and remain client-side. Passwords also are used to encrypt room names, salt stream IDs, and to further encrypt IP-containing initial handshake connection data.\
\
To further protect the user, any deployment of VDO.Ninja to a private domain name will be further secured, as the domain name will be used as a salting mechanism for both room names, stream IDs, and encryption. As a result, a stream or room on one domain will not be accessible from another hosted deployment on another domain without tampering; at least the odds are astronomical.

While nearly all data transfer is peer to peer based, the initial handshake between two peers is still handled by a server, as per a technical requirement. Once the peer connection is established though, further data is then transferred directly between peers, if possible. This includes the media streams, chat messages, and other aspects, including display names and system information. Backup handshake servers are hosted to ensure reliability, such as with [https://backup.obs.ninja](https://backup.obs.ninja), and managed third-party handshake servers are supported, such as piesocket.com.\
\
There are several hosted handshake, website, and TURN servers across the globe, with the primary servers hosted in the USA. Details for hosting a personal-sized handshake-server is here, [https://github.com/steveseguin/websocket\_server/](https://github.com/steveseguin/websocket\_server/).

VDO.Ninja cannot guarantee privacy, service, or security, despite its efforts to protect you. You use the site, code, or service at your own risk and acceptance. Questions or requests related to privacy can be made out to steve@seguin.email.
