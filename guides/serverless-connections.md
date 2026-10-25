---
description: How two browsers start a VDO.Ninja call with no handshake server, by exchanging a short code through a QR code, a chat message or any other text channel.
---

# Serverless connections

A VDO.Ninja call normally starts with both browsers connecting to the handshake server, which passes signalling messages between them; media then flows peer to peer. If the two browsers exchange those first messages some other way, such as a QR code shown to a camera or text pasted into a chat, they can open their own connection and carry all later signalling over it.

This page covers the technical details. For setup steps, see [QR Connect](../steves-helper-apps/qr-connect.md), or try it at [vdo.ninja/qr](https://vdo.ninja/qr).

![Device A and Device B exchange an offer code and a reply code by QR or text. This opens a VDO.Ninja peer connection that starts with only a data channel. Over it, the two pages set up a second sidecar connection for chat and later signalling, and camera and microphone are added to the first connection when turned on.](../.gitbook/assets/network-serverless-bootstrap.svg)

## What has to be exchanged

To start a connection, each side must give the other:

* **a certificate fingerprint**, so the browser can check the encrypted connection matches the exchanged description. This ties the connection to the description, not to a real-world identity, so trust depends on how safely the code travels;
* **ICE credentials**, a short username and password that authenticate connectivity checks;
* **network routes**: its local address, its address as seen from the internet, and any reserved relay addresses.

Written in the usual SDP format, an audio and video offer is **around 3,000 characters**. That is too dense for a QR code read from a screen and too long for many message limits. QR mode packs it into one short code per person; Trickle mode splits it across several small messages.

## How the code gets small

**Connect with data only, add media later.** Almost all of those 3,000 characters describe audio and video codecs and extensions, none of which are needed to connect. A bare data-channel offer is about 460 characters of SDP, or about 700 with gathered routes. Camera and microphone are negotiated later over the open connection, with no new code.

**Send only what changes.** Within a recognised data-channel SDP shape, nearly every line is the same each time. A recognised shape is stored as two bits in the record header, and only six changing SDP values are kept; session details and routes are encoded separately. Any other shape falls back to a slightly longer line-based form.

**Store numbers as numbers.** A fingerprint is 64 hex characters but only 32 bytes. An address like `192.168.1.40` is 12 characters but 4 bytes. A first IPv4 route takes about seven bytes: flags, four address bytes and a port. IPv6 and mDNS addresses take 16 address bytes; repeated addresses become references, and related routes share an address prefix. Anything unrecognised still passes through a generic path.

**Leave out what can be worked out.** With no server and only two participants, the stream name is a constant both ends know. Route priorities follow from route order. The random SDP origin ID and session label are derived from the fingerprint, and later renegotiations reuse them. The recognised SDP shape supplies the rest.

**What is left is random.** The fingerprint and packed ICE password take roughly 50–55 bytes, about 40% of a finished code, and random data cannot be compressed.

| Form | Approximate characters |
| --- | --- |
| Normal audio and video offer | ~3,000 |
| Data-only offer as ordinary text | ~700 |
| Typical packed data-only offer | **44–70** |

The packed record is written in a 30,000-character subset of the transport-safe alphabets from [qntm/base2048](https://github.com/qntm/base2048) and [qntm/base32768](https://github.com/qntm/base32768). Each character is a Unicode letter or number that is stable under normalization and carries about 14.87 bits, with no emoji, punctuation, spaces, control or combining characters. New codes start with an ASCII `Y`; older codes starting with `Z`, `VQ` or `VN` can still be read. Offers and answers have a hard limit of 118 characters, which is at most 235 characters by X's weighting and 352 UTF-8 bytes.

## After connecting: the sidecar

Once the bootstrap data channel opens, the out-of-band exchange is finished. The page immediately negotiates a second, data-only peer connection, the **sidecar**, over that channel. It uses the same ICE servers and policy, so it prefers direct routes and can fall back to TURN. Chat and all later VDO.Ninja signalling, such as turning on a camera or attempting an ICE restart, move onto the sidecar before media controls are enabled. Its own offer and answer travel automatically over the existing channel, never as another code.

So there is **one exchange, once**: not a code per change. Chat messages are reliable, ordered and peer to peer, and history exists only in the two open pages.

## Getting the code across

### QR code

After **Start connection**, the page shows a QR code holding a link with the offer appended, so a phone's normal camera app opens the page with the offer loaded. The other person can instead choose **Scan or paste a code**. Their page shows a reply code, which the first person scans or pastes back. If scanning fails, enlarge the code, reduce glare or paste the code instead.

### Text message

The codes are plain text. **Copy code** copies the raw code; **Copy link** copies the longer QR link. Paste the raw code into chat apps.

| Channel | Fits? |
| --- | --- |
| X (280 weighted characters) | Yes, even if every non-ASCII character counts as two |
| YouTube Live Chat (200 characters) | Yes; the code has only letters and numbers, since YouTube may reject links and special characters |
| IRC (one line) | Yes, at most 352 UTF-8 bytes |
| Classic SMS | Needs two joined 67-character parts, because this alphabet uses 16-bit encoding |

{% hint style="info" %}
**QR mode needs one message in each direction**: an offer, then a reply. Trickle mode can need several each way. A one-way channel cannot complete either exchange.
{% endhint %}

### Trickle mode (LoRa / mesh compatible)

Turn on **Trickle mode (LoRa / mesh compatible)** on the QR page, or open [vdo.ninja/qr?lora](https://vdo.ninja/qr?lora). Each message is plain ASCII, **140 characters** by default including header and checksum, and can be lowered to **40**; the replying page adopts the offer's limit. The 118-character QR limit does not apply to the combined exchange.

The first message carries the compact description and as many routes as fit, preferring public and relay routes. Other routes follow in more messages as they are found; none are dropped to save space, and anything too long is split into numbered parts. Smaller messages can mean more text and more exchanges in total. Messages start with `L1O` (offer) or `L1A` (answer); the header identifies the exchange, record and part and includes a checksum. The receiver reassembles parts, ignores duplicates and rejects conflicting parts or messages from another exchange. Keep sending every available message both ways until connected; **Start over** clears the exchange.

Messaging apps have different limits. Meshtastic's [Android composer](https://github.com/meshtastic/meshtastic/blob/master/docs/software/android/user/messages-and-channels.md#message-limits) allows 200 bytes. MeshCore's [channel message handling](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.cpp) counts the sender-name prefix against the allowance, so some channels need less than 140. Copy messages between the page and your radio's messaging app; the page does not connect to radio hardware. Radio carries only the setup; chat, audio and video still need an IP path between the browsers, directly or through TURN.

## Limitations

* **Codes are not lasting invitations.** Routes belong to the open page and its current network, so keep both pages open. There is no expiry timer, but a network change or expired NAT or TURN state can break a delayed exchange. If a reply no longer connects, start a new offer.
* **One viewer per offer.** The first valid reply takes the connection.
* **A posted code can be claimed.** VDO.Ninja's extra SDP encryption layer is off because its output cannot fit this size, so anyone who reads your offer and answers first gets the connection. Exchange codes over a channel you trust. WebRTC's DTLS/SRTP encryption still protects the call.
* **No recovery once the sidecar is lost.** The connection can ride out brief network trouble, and the page can tunnel an ICE restart over the sidecar. Once the page reports that the peer dropped, exchange new codes.
* **The sidecar is a second peer connection.** It carries little traffic, but when TURN is needed it needs its own relay allocation.
* **"Serverless" means no handshake server.** The browsers still use STUN to learn their public addresses and may use TURN when the networks cannot reach each other directly, as in any WebRTC call.
* **LAN-only mode is not exposed.** The reusable QR module can pass [`&lanonly`](../advanced-settings/turn-and-stun-parameters/and-lanonly.md) to its iframe through `extraParams`, but the public page has no such option, and adding it to the page URL does nothing.

## Implementation

The page is `qr.html` with `qrconnect.js` in the app repository. Media uses the normal VDO.Ninja iframe, run with `&bypasssignaling` so the wrapper routes SDP and ICE messages and keeps the compact session IDs consistent. The wire format and integration details are in [`examples/qrconnect.md`](https://github.com/steveseguin/vdo.ninja/blob/develop/examples/qrconnect.md).
