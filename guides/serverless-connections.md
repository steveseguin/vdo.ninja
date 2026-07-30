---
description: How two browsers can start a VDO.Ninja call with no handshake server at all, by passing a short code through a QR code, a chat message, or anything else that carries text.
---

# Serverless connections

Every VDO.Ninja call normally starts the same way. Both browsers connect to the handshake server, the server passes signalling messages between them, and the media flows directly peer to peer.

**The server is a postman, not a participant.** If the two browsers exchange the initial messages by some other means — a QR code held up to a camera, a line pasted into a chat box — they can establish their own data channel. The example then uses that channel to carry any later signalling peer to peer, so it never needs the handshake server.

An example implementation is linked at the bottom of the page.

## What actually has to be exchanged

To start a connection, each side has to tell the other three things:

* **A fingerprint of its certificate**, so the browser can verify that the certificate presented on the connection matches the one in the exchanged description. This binds the connection to that description, not to a person's real-world identity; authenticity still depends on how safely the code is exchanged.
* **Its ICE credentials** — a short username and password used to authenticate the connectivity probes.
* **A list of network routes** it can be reached on: its address on the local network, its address as seen from the internet, and any relay servers it has reserved.

In the recorded browser samples, writing that out in the usual format came to **around 3,000 characters** for an audio and video offer: about 3,470 from Chrome and 2,700 from Firefox. Exact SDP size varies by browser version and configuration.

That is the obstacle. Three thousand characters produces a QR code that is too dense for the intended screen-to-camera exchange and exceeds many short-message limits.

Getting it under two hundred is the whole trick.

## Where the savings come from

### Do not describe media you have not turned on yet

This is the big one, and it is worth more than everything else combined.

Almost all of those 3,000 characters describe audio and video: every codec, every parameter, every extension the two sides might negotiate. None of it is needed in order to *connect*.

Open a bare data channel first — no camera, no microphone — and the SDP portion collapses to **about 460 characters**. A complete plain-text exchange with gathered routes is closer to 700 characters. After connecting, the wrapper uses that bootstrap channel to negotiate an independent persistent data channel. Turn your camera on afterwards and the browsers carry the media renegotiation over that sidecar, without another code exchange.

### Most of what is left is identical every time

Within a recognised data-channel SDP shape, the overwhelming majority is boilerplate — the same lines, in the same order. Six SDP values are extracted from that shape; session metadata and network routes are encoded separately.

So a recognised shape is stored as **two bits in the record header** and the changing values are stored separately. Captured Chrome and Firefox shapes are recognised, and the tested Safari data-channel SDP matches the Chrome shape. An unrecognised shape still has a line-based fallback; it just costs a little more.

### Text is an expensive way to store numbers

The values that remain are written as text, and text is wasteful.

A certificate fingerprint is 64 hexadecimal characters holding 32 bytes of information. An address like `192.168.1.40` is 12 characters holding 4 bytes. Stored as the numbers they actually are, everything shrinks by half or better.

Network routes benefit most. A first compact IPv4 route is about **seven bytes**: packed flags, four address bytes, and a port. IPv6 and mDNS addresses need 16 address bytes, while repeated addresses are references and related IPv4/IPv6 routes reuse a shared address prefix — useful for ISP blocks and when TURN exposes UDP and TCP on the same relay. Anything unrecognised is preserved through the generic path.

### Anything that can be worked out is not sent at all

Several fields carry no information worth transmitting. There is no server to collide with and only ever two participants, so the stream name is a constant both ends already know. Route priorities can be recalculated from the order the routes appear in. The random SDP origin ID and wrapper session label are derived from the certificate fingerprint already in the record; later renegotiations are normalized to those same values. Other attributes are supplied by the recognised SDP shape.

None of that goes on the wire.

### What is left cannot be made smaller

Roughly **50 to 55 bytes** are consumed by the certificate fingerprint and packed ICE password alone. They are random, they have to arrive exactly, and no amount of cleverness compresses random data. That is the main floor, and it is roughly 40% of a finished code.

### The result

| | characters |
| :--- | :--- |
| A normal audio and video offer | ~3,000 |
| Data-only, written as ordinary text | ~700 |
| Data-only, packed properly in the Chrome/Firefox/Safari matrix | **44 – 70** |
| Hostile ten-route IPv4/IPv6 + UDP/TCP fixture | **89 – 96** |

The compact record uses
a base-30,000 subset of
[`qntm/base2048`](https://github.com/qntm/base2048) and
[`qntm/base32768`](https://github.com/qntm/base32768)'s transport-safe
alphabets. Each normalization-stable BMP letter or number carries about 14.87
bits: no emoji, surrogate pairs, punctuation, whitespace, controls, or
combining characters. The full 118-glyph guard is at most 235 X-weighted
characters and 352 UTF-8 bytes, and the same text round-trips through UTF-8
Notepad files. New codes start with a single ASCII `Y`; older `Z`, `VQ`, and
`VN` codes remain decodable.

Validation covers all nine offerer/answerer pairings among Chrome, Firefox, and
Safari, with Safari running on real iPhone 15 Pro Max devices. Every pairing
exchanged persistent-sidecar chat in both directions. Normal runs keep ICE
policy `all`: local Chrome selected host-to-host, while real-network runs
selected server-reflexive/learned-peer-reflexive paths. Separate TURN-only runs
passed in Chrome, Firefox, and real-iPhone Safari with relay-to-relay selected
pairs. The TURN-only sidecar also exchanged chat both ways, confirming that the
compact codes keep TURN as a fallback without forcing it normally.

## After connecting: persistent chat and signalling

The first VDO.Ninja data channel is sufficient to finish the QR handshake, but
VDO.Ninja may replace that peer connection when a camera or microphone is first
added. Chat tied only to the bootstrap connection would disappear with it.

The example therefore negotiates a second, independent data-only peer
connection immediately after connecting. It inherits VDO.Ninja's ICE servers
and policy, so it still prefers direct paths and can use TURN when direct
connectivity fails. Later VDO.Ninja signalling and application data move onto
that sidecar before media controls are enabled.

Precisely: the only descriptions a person carries out of band are the original
compact offer and answer. The sidecar does have an ordinary internal offer and
answer, but those bytes travel automatically over the already-established peer
data channel and never appear as another code.

Both people can use the example's text chat. Messages are reliable and ordered,
stay peer to peer, and do not add anything to the 118-character offer or answer
because the sidecar is negotiated after the QR exchange. Chat history exists
only in the two open pages; there is no server-side history or offline delivery.

## Getting the code across

### As a QR code

The sharing side displays a QR code that is really just a link with the offer on the end of it. The intended flow is to scan it with a phone's ordinary camera app so the page opens with the offer already loaded. The replying side then shows a code of its own, which the first person reads back.

The renderer passes the compact text to the QR encoder as exact UTF-8 bytes and surrounds the result with the standard four-module quiet zone. Software tests decode the rendered pixels back to the exact link in Chromium and Firefox. Real reading distance still depends on screen size, brightness, glare, and camera focus; screen-to-camera reliability has not yet been claimed across physical devices.

### As a chat message

The codes are plain text, so anything that carries text will do.

**Offers and answers now share a 118-character hard limit.** Current Chrome,
Firefox, and real-iPhone Safari runs produce 44–70 characters. A deterministic
fixture with unrelated addresses and randomized ports is the stronger size
check: Chrome-shaped SDP is 89 characters and Firefox-shaped SDP is 96 while
retaining ten IPv4/IPv6 host, server-reflexive, and UDP/TCP relay routes. ICE
learns peer-reflexive routes from connectivity checks, so they are not carried
as bootstrap candidates. The Copy button copies the raw code; the offer QR
contains a longer page URL so a camera app can open it directly.

The raw code fits X's 280-character weighted limit even if every non-ASCII
glyph receives weight two, and it fits YouTube Live Chat's documented
200-character limit by glyph count. It contains only letters/numbers because
YouTube says URLs and special characters may be rejected, so paste the raw code
rather than the QR link. At most 352 UTF-8 bytes remain below IRC's line limit.
Classic SMS uses 16-bit encoding for this alphabet: the full guard fits two
concatenated 67-character parts, not one 70-character part. No live YouTube
message or carrier SMS was sent during automated validation, so platform
moderation and carrier recoding remain external variables.

{% hint style="info" %}
**It takes two messages, one in each direction.** The first person posts an offer, the second replies with an answer, and only then are they connected. A channel that only travels one way cannot do it.
{% endhint %}

## What it costs you

There are real trade-offs, and they are worth knowing before you rely on this.

**Codes are not durable invitations.** The routes belong to the open page and its current network state, so that page must stay open. There is no application-level expiry timer, but a network change or expired NAT/TURN state can invalidate a delayed exchange. If a reply no longer connects, generate a new offer.

**One viewer per published stream.** This is a one-to-one bootstrap. The offer is good for exactly one answer, and the first valid reply takes the connection.

**A publicly posted code is claimable.** VDO.Ninja's additional application-layer wrapping of the SDP is disabled because its ciphertext cannot be packed down to this size. Anyone who can read your offer and answers it before the intended person can take the connection. Exchange codes through a channel you trust. WebRTC's DTLS/SRTP transport encryption remains enabled.

**There is no out-of-band recovery after the persistent sidecar is lost.** The browser may survive transient network trouble while the channel remains usable, and the wrapper can tunnel an ICE restart over it. Once the page reports that the peer dropped, this example does not rebuild the channel; exchange fresh codes.

**The persistent channel is a second peer connection.** It carries very little
traffic, but if the peers require TURN it also needs its own relay allocation.

## After the handshake, no more out-of-band exchange is needed

This is what makes it practical rather than a party trick.

The moment the bootstrap data channel opens, the external signalling exchange is finished. The wrapper negotiates its persistent sidecar over that connection, then tunnels later VDO.Ninja signalling for actions such as turning on a camera or attempting an ICE restart. Two-way chat and other application messages use the sidecar as well.

So it is **one exchange, once**. Not a code per change, and not a code per minute. Connect, and then use it like any other call.

## One clarification

"Serverless" here means **no handshake server**. Connections still use STUN to discover how each side appears from the internet, and may fall back to a TURN relay when two networks cannot reach each other directly — exactly as any WebRTC call does, serverless or not.

VDO.Ninja's existing LAN-only parameter is `&lanonly`. The reusable QR module can pass it to the iframe through `extraParams`, but the public example page does not currently expose a LAN-only option. Do not append it to the example page URL and expect it to be forwarded.

## Try it

The implementation is included in the app repository at `qr.html`. Once that app revision is deployed, it will be available at:

[**https://vdo.ninja/qr**](https://vdo.ninja/qr)

One person presses **Start connection** and gets a QR code plus a copyable compact code. The other opens the QR link or pastes the code, gets a reply code back, and the first person scans or pastes that in. Both can then chat; the sharing side can also turn on its camera or microphone. The wrapper drives an unmodified VDO.Ninja iframe, so media uses the normal VDO.Ninja paths while persistent chat and signalling remain in the example wrapper.

The wire format, the measurements behind the numbers on this page, and the cross-browser test results are documented alongside the example in [`examples/qrconnect.md`](https://github.com/obsninja/obsninja/blob/master/examples/qrconnect.md).
