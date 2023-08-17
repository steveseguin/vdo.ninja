---
description: Privacy, Policies, and Data-collection
---

# Privacy and security details

[VDO.Ninja](https://vdo.ninja/) is a peer-to-peer network, which implies it naturally will share your IP address with the remote guests you are connecting with. There are ways to prevent this, such as using VPNs, TURN-servers, and/or enabling IP-leak protection in your browser, but this is not the default behavior. In no way does VDO.Ninja accept responsibility if your IP address is leaked. Connecting only with trusted peers, such as people you know and trust, is recommended for most use cases.

VDO.Ninja does not store IP addresses or other personal information for longer than is needed to provide the service. This might include for purposes of TURN relay server, error reporting, rate-limiting, or for Denial of Service abuse prevention (anti-flooding). There are no user-accounts, although you may use third-party services such as Discord, Reddit, Email, or YouTube to communicate with the VDO.Ninja developers, support, and community.

VDO.Ninja and Meshcast uses Cloudflare as a web server caching service and DNS service, and for some of the site's security. Cloudflare may use technical cookies and data-collection to provide reliable service and very basic analytics. These general usage analytics may be shared with the community, such as when the service sees a large spike in usage, and Cloudflare claims this data is all GDPR-compliant.

Video data may at times be transferred via a hosted TURN video relay server, but this is done only to ensure service. This media data is not stored and is only accessible to the intended remote peer. In most cases though, the video data is directly transferred between two peers, without the use of such servers. Any data that passes through the TURN server remains encrypted per the WebRTC standard, and some TURN servers provided offer further TLS encryption on top of it.

There is basic debug and statistic information transmitted between connected peers when using VDO.Ninja; this may include browser information, GPU, operating system details, and other browser-accessible details. Speed tests that knowingly upload user preferences to a VDO.Ninja server for later review also may contain such information, but it is deleted automatically after no more than a week.

VDO.Ninja on its own does not use tracking cookies, though it may use the local storage for storing user preferences, physical media device names, settings, or history for the purpose of improved user experience. These are not used for tracking, nor are they transferred anywhere. Cloudflare may use its own technical cookies, as mentioned previously.

If accessing the Twitch API, Youtube API, or other service remotely via VDO.Ninja, user auth credentials may be cached within local browser storage until it expires. A complete and future-proof list of what may be stored in local browser storage will be hard to list here, but questions can be asked to Steve directly if it is a concerned.

Deploying the VDO.Ninja website code yourself will still reveal your IP address to some servers, such as STUN/TURN/WSS servers, which are needed for WebRTC to function. The VDO.Ninja hosted and operated servers do not collect personal data, although it may be possible that error or system logs will occasionally capture an IP address. These logs are generally cleared and are not stored longer than needed to ensure reliable and bug-free service.

The option to host your own STUN, TURN and WSS servers exists, allowing for fully isolated hosting, but limited support is available for users choosing this route. Please see the VDO.Ninja GitHub repo for information on deploying server-side software, where links to code and detailed instructions are provided.

Some third-party services used by VDO.Ninja, such as [Meshcast.io](https://meshcast.io/), may be used with VDO.Ninja by means of IFRAMES or the [`&meshcast`](../newly-added-parameters/and-meshcast.md) parameter, but these third-party services are out of the scope of this privacy document. Briefly worth nothing though, being SFU server-based, Meshcast does not offer full end-to-end video encryption like VDO.Ninja alone currently offers. Meshcast does not create recordings, does not access personal streams without permission, and does not store personal data beyond what the user explicitly allows or what is technically required to offer the service.

Please also note that Meshcast hosted streams are accessible by users outside of a VDO.Ninja group room, without a password, so long as they have the Meshcast stream ID. The stream ID is accessible to anyone viewing the Meshcast stream, which they can then leak to others outside of the room. This is a typical security concern of server-based streaming services of course, so if this is a concern, do not use Meshcast in conjunction with VDO.Ninja.

VDO.Ninja does have a domain-isolated hosted version to third-party though from being used in VDO.Ninja directly, located at [https://isolated.vdo.ninja](https://isolated.vdo.ninja), which tries to block third-party domains from functioning within VDO.Ninja's website code.&#x20;

When using the VDO.Ninja service, stream ID values and room names should be kept secure and treated like passwords when possible. Actual passwords are available additionally though, which are used to enable a client-side encryption mechanism that ensure two peers are unable to connect if passwords do not match. It is not recommended to the include the raw password in the URL, where possible, for maximum security.

Room names (typically encrypted) and salted stream IDs are transmitted to the handshake server, as they are required for making connections between peers. Passwords are intended to remain client-side only, and unless set in the URL, remain always entirely client-side. Passwords also are used to encrypt room names, further salt stream IDs, and to further encrypt IP-containing initial handshake connection data.

To further protect the user, any deployment of VDO.Ninja to a private domain name will be further secured, as the domain name will be used as a salting mechanism for both room names, stream IDs, and encryption. As a result, a stream or room on one domain will not be accessible from another hosted deployment on another domain without tampering; at least the odds are astronomical.

While nearly all data transfer is peer to peer based, the initial handshake between two peers is still handled by a server, as per a technical requirement. Once the peer connection is established, any further data between peers is then transferred directly between peers, if possible. This includes the media streams, chat messages, and other aspects, including display names and system information. A VDO.Ninja server may still transmit/receive data if using the remote control HTTPS/WSS API, for ping/pong keep alive requests, for reconnection or ice-restart events, and as a backup for failed peer to peer messages.

Once a user disconnects from the handshake-server, any cached information about their connection is promptly cleared from memory. Such cached information is a technical requirement to offer public service at scale.

Future and auxiliary services that use VDO.Ninja as a component, such as [SocialStream](../steves-helper-apps/social-stream/), Invite.cam, or [Versus.cam](../steves-helper-apps/versus.cam.md), may have their own data-privacy or user-storage policies.

Backup handshake servers are hosted to ensure reliability, such as with [https://backup.vdo.ninja](https://backup.vdo.ninja), and managed third-party handshake servers are supported, such as piesocket.com.

There are several hosted handshake, website, and TURN servers across the globe, with the primary servers hosted in the USA. Details for hosting a personal-sized handshake-server is here, [https://github.com/steveseguin/websocket\_server/](https://github.com/steveseguin/websocket\_server/). Self-hosting with the provided handshake server is intended for limited private/personal use, as message routing is handled in a fanout fashion, so large scale public use isn't advised without further deployment or development considerations.

VDO.Ninja cannot guarantee privacy, service, or security, despite its efforts to protect you. You use the site, code, or service at your own risk and acceptance. Questions or requests related to privacy can be made out to steve@seguin.email.
