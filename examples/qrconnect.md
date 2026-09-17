# Serverless Connect (`/qr.html`)

Connects two VDO.Ninja peers by passing one small code each way over any
out-of-band channel — a QR code held up to a camera, an IRC line, a DM, a
sticky note — instead of going through the handshake server.

VDO.Ninja itself is unmodified. The page wraps it in an iframe and drives it
entirely through parameters and the IFRAME API that already exist.

## The flow

The intended screen-to-camera flow is:

1. Alice opens the page and presses **Start connection**. She gets a QR code
   which is really just a link back to this page with the offer in the hash.
2. Bob points his phone's camera app at it. That opens the page for him with
   the offer already loaded, and he gets a code of his own back.
3. Alice reads Bob's code — with the in-page scanner, or pasted in.
4. Connected. Both sides can chat immediately. Alice turns on her camera and
   it flows while chat remains two-way.

For IRC, Twitch, DMs, or another text channel, either side can copy the raw code
or a link. Pasted input is structurally decoded while it is entered, so a
prefix-looking but malformed code cannot be applied. A full link and a code
copied as part of a whitespace-separated chat message are accepted too.

If an answer link opens in a second same-origin browser tab while exactly one
offer tab is waiting, the pages hand the answer across `BroadcastChannel` with
a short-lived `localStorage` fallback. The offer tab still owns the live
`RTCPeerConnection`; no SDP or usage state is sent to a server. If no waiting
tab, or more than one, is found, the page leaves the answer available to copy
instead of guessing.

Everything except step 4 is a datachannel-only handshake, which is what keeps
the codes compact enough for a relatively low-density QR code.

Neither side ever touches `wss.vdo.ninja`. STUN and TURN are still used for NAT
traversal, the same as any WebRTC connection. Integrators can pass the existing
`&lanonly` parameter through `extraParams` to restrict the iframe to LAN
candidates; the public example page does not expose that option.

## How it works

### Trickle mode (LoRa / mesh compatible)

Enable **Trickle mode (LoRa / mesh compatible)** before starting a connection, or open
`qr.html?lora`. The default limit is **140 ASCII characters per message**,
including its header and checksum. The limit can be reduced to 40 characters;
the answering page automatically uses the offer's limit.

This mode works with text transports beyond radio apps. It splits connection
details into small messages and sends additional network routes as they become
available; it does not necessarily reduce the total amount of text exchanged.
MeshCore and Meshtastic do not have identical message limits. Meshtastic's
[Android composer](https://github.com/meshtastic/meshtastic/blob/master/docs/software/android/user/messages-and-channels.md#message-limits)
allows 200 bytes, while MeshCore's
[channel message handling](https://github.com/meshcore-dev/MeshCore/blob/main/src/helpers/BaseChatMesh.cpp)
counts the sender-name prefix against the text limit. Lower this page's limit
to fit the app and message type you use; 140 bytes is not a universal radio limit.

1. Start the connection and copy the selected outgoing message into your radio
   app. If the selector lists more messages, send each separately.
2. On the other device, choose **Scan or paste a code** and paste each received
   message. The page recognizes LoRa messages automatically.
3. Send that device's outgoing messages back and paste them into the original
   waiting tab. Continue exchanging available messages until connected.

The first message includes the compact datachannel description and as many
available candidates as fit, preferring public and relay routes. Overflow and
late candidates use additional messages through the existing trickle ICE path.
No route is discarded just to meet the message limit. If a description or a
single candidate is too large, it is split into numbered parts. Select an
earlier outgoing message to resend it; duplicates are ignored, and out-of-order
parts wait for missing messages. **Start over** clears the exchange.

Messages use uppercase Base32 letters/digits and the `L1O` (offer side) or `L1A`
(answer side) prefix. Each character occupies one UTF-8 byte. A 21-character
header carries the version/role, an eight-character exchange ID, the message
limit, record number, part number/count, and CRC-16. Record zero carries the
existing packed description format; later records carry the existing dense
candidate format. Candidates retain the description's ICE generation, and
generated candidate foundations remain distinct across records. Receivers
reject conflicting parts, damaged messages and replies from another exchange.
The CRC detects accidental corruption; the full DTLS fingerprint and ICE
credentials remain in the description.

The limit applies to the text copied into the radio app. Reserve any additional
space required by your transport by lowering the limit. This mode does not
connect directly to radio hardware. Keep both browser pages open during the
exchange; very long delays or background suspension can still require a fresh
connection. LoRa carries connection signaling; WebRTC chat, audio and video
still need an IP path between the devices, directly or through TURN.

The ordinary QR mode and its existing code formats remain available. LoRa
shows copyable text first; **Show QR** displays a QR for the selected packet.

### Bypassing the handshake server

`&bypass` is an existing VDO.Ninja flag. It replaces the WebSocket with a
postMessage stub (`webrtc.js`, `session.connect`), so everything VDO.Ninja
would have sent to the server arrives at the parent page as
`{bypass: "<json>"}`. Signalling goes back in through the IFRAME API's
`routeMessage` call (`main.js`), which feeds it straight to `ws.onmessage`.

With no value, `&bypass` also sets `customWSS`, which switches VDO.Ninja to the
addressing rules a self-hosted relay would use: every message carries `from`
and `UUID`, and it filters on them locally.

### Making the sharer offer first

Normally the viewer asks and the publisher answers. Here the sharer has to
produce an offer with no peer in sight, so the page feeds its own iframe the
play request a viewer would have sent:

```js
{ request: "play", streamID: <sid>, from: <answer slot> }
```

VDO.Ninja builds a peer connection for that slot and hands over the offer.

### UUID slots

Session UUIDs are generated per page load, so a blob captured from one side
cannot name the other. Each side substitutes a fixed slot name for its own UUID
on the way out and substitutes its real one back on the way in:

|               | sharer                 | joiner                 |
| ------------- | ---------------------- | ---------------------- |
| own UUID →    | `qrconnect0000000000a` | `qrconnect0000000000b` |
| peer keyed as | `qrconnect0000000000b` | `qrconnect0000000000a` |

Symmetrical, and VDO.Ninja never knows it happened.

### Once connected, no more codes

The out-of-band signalling exchange ends as soon as the bootstrap datachannel
opens. The wrapper immediately uses it to negotiate a second, independent
data-only peer connection. That persistent sidecar uses the same ICE server
configuration and policy as VDO.Ninja, including direct, STUN, and TURN routes.

The sidecar matters because VDO.Ninja may replace its bootstrap peer connection
when the first camera or microphone is added. Chat tied only to that connection
would disappear at the same time. Once the sidecar opens, the wrapper moves
later VDO.Ninja signalling and application data onto it. Media renegotiation,
ICE restarts, and two-way chat can then survive a VDO media-connection
replacement without another code exchange.

Sidecar negotiation happens after the QR handshake over the already-connected
peer channel, so it adds nothing to either 118-character code. It does create a
second `RTCPeerConnection`; when TURN is required, that connection needs its own
small relay allocation.

Precisely: the only descriptions a person carries out of band are the original
compact offer and answer. The sidecar does have an ordinary internal offer and
answer, but those bytes travel automatically over the already-established peer
data channel and never appear as another code.

### Two-way chat

Both roles get a chat panel. Messages use the wrapper's `qrchat` namespace over
the reliable ordered sidecar channel; they do not use the handshake server.
Outgoing and incoming text is limited to 2,000 UTF-16 characters per message,
rendered with `textContent`, and the page retains the newest 100 messages in
memory. There is no offline delivery or persisted history.

## Code format

`"Y"` followed by a base-30,000 encoding of a binary record. Its alphabet is a
letters-and-numbers-only subset of
[`qntm/base2048`](https://github.com/qntm/base2048) and
[`qntm/base32768`](https://github.com/qntm/base32768)'s transport-safe
repertoires, used under their MIT licences. Each BMP glyph carries about 14.87
bits. There are no emoji, surrogate pairs, punctuation, whitespace, combining
marks, or controls, and the text is stable under NFC, NFD, NFKC, and NFKD
normalization.

Each glyph is one JavaScript/UTF-16 character. X assigns some of the wider
Unicode letters a weight of two, so a code at the full 118-glyph guard weighs
at most 235 of X's 280 characters. It is at most 352 UTF-8 bytes, leaving normal
overhead in an IRC line's 510-octet payload. Codes also round-trip unchanged
through UTF-8 text files, including current Notepad, encoded URL fragments, and
the exact UTF-8 QR renderer/scanner path.

Old `"Z"` Base2048, `"VQ"` Base512, and `"VN"` base64url codes remain
decodable. New codes use the one-character `Y` prefix.

Text plus deflate was tried first and came out around 700 characters, which is
a dense, awkward QR code. The current packed form is **44 to 70 characters
across the tested Chrome/Firefox/Safari 3×3 matrix**. A deliberately hostile
fixture with unrelated addresses and ports retains ten IPv4/IPv6 host,
server-reflexive, and UDP/TCP relay routes at **89 characters for Chrome-shaped
SDP and 96 for Firefox-shaped SDP**.

```
u8     header: role | SDP mode | has-streamID | fast-known-fields |
               has-session-token | 2-bit skeleton/setup value
       line list | varint length + deflated skeleton/SDP
[u8    generic packing descriptor]
[u64   literal o= session id]       omitted on the fast path
[str   literal o= username]         omitted on the fast path
bytes  ice-ufrag
bytes  ice-pwd
32B    DTLS fingerprint
[str   session token]               normally derived, not sent
[str   streamID]                    only when not the default
varint tagged candidate count, then a packed candidate bitstream:
       type | transport | [tcptype] | literal/reference/prefix address |
       absolute/+1/same/delta port
```

On a recognised browser shape, the ICE encodings and lengths are implied by
the two-bit skeleton ID, which is itself folded into the header. The random
`o=` session ID and the wrapper's session label are derived from
the already-required DTLS fingerprint. Later renegotiations are normalized to
the same derived values before being tunneled, so no continuity information is
lost. Firefox's decorative `o=` username is normalized to `-`.

The generic paths still carry literal origin/session fields. That preserves
correctness for an unfamiliar browser shape or a direct `encodeBlob` caller
using nonstandard fields.

### Text-channel limits

- **X:** the ASCII prefix and lower-range symbols have weight one; wider
  Unicode letters have weight two. The absolute worst case is 235 weighted
  characters, below X's 280-character limit. The hostile Firefox fixture
  measured 182–186.
- **YouTube Live Chat:** Google documents a 200-character limit and says URLs
  and special characters can be rejected. Copy the raw code, not the QR's URL.
  The raw format contains only Unicode letters/numbers, including its ASCII
  `Y` prefix. Automated tests verify the character classes, but no live chat
  message was posted as part of this test run, so moderation behavior remains
  an external variable.
- **IRC:** any permitted code is at most 352 UTF-8 octets. RFC 2812 allows 510
  octets for the command and parameters after the final CRLF is accounted for,
  leaving normal `PRIVMSG` overhead.
- **SMS:** the non-ASCII alphabet selects 16-bit SMS encoding. One classic SMS
  part is therefore not enough, but the 118-character fixture fits in two
  ordinary concatenated parts at 67 UCS2 characters per part. It no longer
  needs the three parts that a 178/198-character code could require.
- **Notepad/text files:** UTF-8 with or without a BOM round-trips exactly. The
  automated test also checks all four Unicode normalization forms.

References: [YouTube's 200-character Live Chat limit](https://support.google.com/youtube/answer/15270973),
[IRC's 512-octet line limit](https://www.rfc-editor.org/rfc/rfc2812#section-2.3),
[3GPP/ETSI concatenated SMS sizes](https://www.etsi.org/deliver/etsi_TS/123000_123099/123040/06.05.00_60/ts_123040v060500p.pdf),
and [Notepad's UTF-8 default](https://blogs.windows.com/windows-insider/2018/12/10/announcing-windows-10-insider-preview-build-18298/).

### Shared secrets

RFC 5245 defines `ice-char` as `ALPHA / DIGIT / "+" / "/"` — exactly 64
symbols — so Chrome's ice-ufrag and ice-pwd fit six bits per character. Their
known lengths are implied by the SDP shape, so they need neither mode nor
length fields.

Firefox goes further and generates both as lowercase hex, which is only four
bits a character, so its 32-character pwd packs to 16 bytes instead of 24.
Anything outside the recognised shapes or alphabets uses the generic
self-describing path.

The fingerprint (32 bytes), ice-pwd (16–18 packed), and ice-ufrag (3–4 packed)
are irreducible — they are random and have to arrive exactly. Those 51–54 bytes
are most of a route-free record and define the real floor.

### The stream name

There is no server to collide with and only ever two peers, so the stream name
carries no information. Both sides agree on `qrc` and it costs nothing; a
caller that wants its own still gets a field.

### Ports

Browsers hand out ports in runs, so most candidates are one more than the last.
Two bits saying which — absolute, `+1`, same, or a one-byte signed delta —
beats two bytes of port on almost every candidate after the first.

### The SDP

A datachannel-only description is nearly all boilerplate. Lifting out the six
values that vary — origin username, session id, ice-ufrag, ice-pwd, fingerprint,
setup — leaves a skeleton identical for every connection a given browser makes.
A recognised skeleton costs **two bits in the existing header**, with no
separate skeleton byte.

The o= username is one of those six specifically because Firefox stamps its
build version into it (`mozilla...THIS_IS_SDPARTA-142.0`). Leave it in the
skeleton and every Firefox release looks like a brand new SDP shape.

Four modes, in decreasing order of luck:

| Mode     | When                                      | Cost              |
| -------- | ----------------------------------------- | ----------------- |
| known    | whole shape is in the skeleton table      | 2 header bits     |
| lines    | lines are in the dictionary, in any order | 6 bits per line   |
| skeleton | six values extracted, shape unrecognised  | deflated skeleton |
| raw      | not even the six values                   | deflated SDP      |

The fallback chain is load-bearing. `lines` handles an unrecognised shape when
all of its lines are in the dictionary. If that is not possible, the codec
carries a deflated skeleton or, as a final fallback, the deflated SDP.
Correctness therefore never depends on a skeleton-table hit; only size does. A
pair that has never been captured can still connect, and a browser update that
changes a shape costs bytes rather than breaking the format.

That distinction matters because the two paths differ by about twenty
characters, and it is tempting to read a table full of browser-specific entries
as the mechanism. It is not. Deleting every entry in `SKELETONS` would leave a
working codec that produces slightly longer codes.

Chrome and Firefox both have entries, captured rather than guessed, so both hit
the two-bit path. Firefox orders the same lines quite differently and its entry
survives releases because the build version lives in the extracted o= username,
not in the shape.

**The tested Safari shape needs no entry of its own.** Its datachannel SDP was
captured from Safari 26.5 on macOS and is byte-identical in shape to Chrome's,
so it matches `SKELETONS[0]` and costs the same two bits. This is an observed
SDP-shape match, not a claim that Safari and Chrome are the same browser engine.

### Why the current table has four entries

The captured Chrome, Firefox and Safari descriptions currently reduce to two
shape families: the Chrome-shaped SDP also seen in the Safari sample, and
Firefox's Gecko shape. The table includes each family's own shape plus the
shape produced when one answers the other:

| entry | shape                                   |
| ----- | --------------------------------------- |
| 0     | Chrome-shaped offer and matching answer |
| 1     | Gecko offer, and Gecko answering Gecko  |
| 2     | Gecko answering a Chrome-shaped offer   |
| 3     | Chrome/Safari-shaped answer to Gecko    |

Measured, not assumed: every pairing of Chrome and Firefox lands on exactly
those four, and Safari's captured SDP is byte-identical to Chrome's, so it
shares 0 and 3. A future shape can use the line-based fallback and may later be
appended to the table as a compression optimisation.

Two things that cost real bytes to learn:

**Capture from the running app, not from a bare `RTCPeerConnection`.** VDO.Ninja's
Firefox offer carries a session-level `a=sendrecv` that a lab peer connection
never emits. An entry captured the lazy way sat in this table looking correct
and never matched once, quietly costing Firefox twenty bytes a code.

**An answer is its own shape, because it mirrors the offer.** Chrome answering
Firefox drops `a=extmap-allow-mixed`; Firefox answering Chrome gains a second
one. That is why entries 2 and 3 exist at all.

The **line dictionary** is the safety net for engines nobody has captured.
Browsers draw on much the same small vocabulary of datachannel SDP lines even
when the order differs, so an unfamiliar SDP costs about a byte a line rather
than a compressed blob:
Firefox's skeleton deflates to 260 bytes but line-encodes to about 20. That is
the difference between an unrecognised engine costing ~25 characters more than
Chrome and costing three times Chrome.

Both tables are positional: **only ever append to `SKELETONS` and `SDP_LINES`**,
never reorder or remove, or previously issued codes stop decoding.

### The o= username

Chrome writes `-`. Firefox writes
`mozilla...THIS_IS_SDPARTA-142.0`, thirty-one decorative characters that change
every release. The recognised path normalizes both to `-`, so neither costs a
bit. Later outbound SDP is normalized the same way before it crosses the
datachannel.

The generic fallback still preserves an unrecognised username. Runs of digits
are lifted from Firefox-style names and the remainder uses a small template
table, so falling off the fast path remains compact and lossless.

### The candidates

Only address, port, transport and type have to survive. Foundation and priority
are regenerated — browsers accept whatever you invent, and priority only orders
the connectivity checks, so deriving it from list position preserves the order
the browser wanted.

**`raddr`/`rport` are rebuilt as zeroes, not omitted.** The real values are of no
use to the far side and are not carried, but RFC 5245 makes the attributes
mandatory on anything other than a host candidate, and leaving them out produces
a line that a lenient parser accepts and a strict one refuses to _pair_. That
distinction cost a lot to find: every engine accepted the bare form via
`addIceCandidate` without error, so it looked fine, and Chrome and Safari
connected happily on it. Firefox did not — **zero of six connections across a
real network**, while the same builds connected fine on one machine where host
candidates carried the call. Emitting `raddr 0.0.0.0 rport 0` took that to ten
of twelve, and costs nothing on the wire because it is a constant.

The lesson generalises: an engine accepting a candidate is not evidence it will
use it. Only a real network proves that, because on one machine the host
candidates hide every other defect.

Addresses pack as 4 bytes (IPv4), 16 (IPv6), or 16 (an mDNS `.local` UUID,
which is what browsers emit for host candidates before media permission is
granted). Anything else, and any candidate that does not parse, is carried
verbatim behind a flag. The address codec is round-tripped and compared at
encode time, so a formatting difference costs bytes, never correctness.

The current wire format packs candidate flags across byte boundaries and
references an address already used earlier in the code. A new IPv4/IPv6 address
can also reuse the common hexadecimal prefix of an earlier address and carry
only its changed suffix. That removes most of the cost when routes share an ISP
prefix, a public IPv6 address is both host and reflexive, or TURN exposes UDP
and TCP on the same relay. A UUIDv4 mDNS address also omits its six fixed
version/variant bits.

Measured with the current `Y`/Base30000 format, driving the real page between
separate browsers. Every one of the nine Chrome/Firefox/Safari role pairings
connects and exchanges persistent-sidecar chat in both directions. Local
Chrome/Firefox tests also start the camera and confirm chat still works in both
directions after the VDO media connection is replaced. Safari results use real
iPhone 15 Pro Max devices:

|                   | offer | answer |
| ----------------- | ----- | ------ |
| Chrome → Chrome   | 53    | 44     |
| Chrome → Firefox  | 54    | 56     |
| Chrome → Safari   | 54    | 59     |
| Firefox → Chrome  | 56    | 48     |
| Firefox → Firefox | 70    | 70     |
| Firefox → Safari  | 70    | 59     |
| Safari → Chrome   | 59    | 48     |
| Safari → Firefox  | 59    | 70     |
| Safari → Safari   | 59    | 50     |

These are observations, not fixed lengths: the gathered routes and browser SDP
can change. Offers and answers both enforce a **118-character hard limit**. The
deterministic ten-route dual-stack/TCP fixture is the stronger size check: 89
characters for Chrome-shaped SDP and 96 for Firefox-shaped SDP, with all ten
routes surviving decode and `addIceCandidate`.

Normal runs keep `iceTransportPolicy: "all"`. Local Chrome selected a
host-to-host pair, while the real-network matrix selected direct
server-reflexive/learned-peer-reflexive paths. Separate relay-only tests passed
in Chrome, Firefox, and a real iPhone Safari: Safari and Chrome exchanged
35-character codes, both policies were `relay`, and both sides selected a
relay-to-relay candidate pair. The persistent chat sidecar also inherited the
relay-only policy and exchanged messages both ways. TURN is therefore retained
as a fallback without being forced during ordinary connections.

### Across a real network

Before the current dense envelope, every pairing was also run with the two peers
on different machines through a tunnel, so both sides sat behind genuine NATs
and the call had to survive STUN and TURN. Safari → Safari used two separate
remote machines. The lengths below are historical `VN`/base64url measurements;
they remain connectivity evidence but are not current `Z` length estimates.

| sharer → joiner   | offer    | answer       |           |
| ----------------- | -------- | ------------ | --------- |
| Chrome → Chrome   | 154, 172 | 160, 154     | connected |
| Chrome → Firefox  | 154, 172 | 164, 178     | connected |
| Chrome → Safari   | 172      | 164          | connected |
| Firefox → Chrome  | 178      | 154          | connected |
| Firefox → Firefox | 174, 178 | **198**, 164 | connected |
| Firefox → Safari  | 178      | 162, 164     | connected |
| Safari → Chrome   | 164      | 160          | connected |
| Safari → Safari   | 164      | **136**      | connected |
| Safari → Firefox  | 164      | 197          | connected |

**All nine cells connected.** Route counts varied between runs.

Safari → Firefox took four attempts to measure, and the reason matters more
than the result. Every failure looked like flaky infrastructure — the sharing
page simply never produced an offer — and it was not infrastructure. This page
was giving up after fifteen seconds, and VDO.Ninja start-up on Safari over the
plain-http test tunnel sometimes takes longer than that. Raising the limit made
the same pairing connect on the next try.

**The cause of the stall itself was never established.** `enumerateDevices` does
fall back to `window.MediaStreamTrack.getSources` — an API Safari removed — when
`navigator.mediaDevices` is absent, which it is on a non-secure origin, and that
throws. But hiding `navigator.mediaDevices` in Chromium reproduces the exception
and no stall whatever: time-to-offer stays at 3.2 seconds. The tidy explanation
is therefore wrong, and what is left is a slow start-up on one browser on one
kind of origin, cause unknown.

The deadline is now 25 seconds, with a progress message on the way. **It costs a
working connection nothing** — the iframe reports in at around 0.7 seconds — it
only bounds how long a broken one takes to admit it.

## Gathering

There is only one code, so every route retained for the exchange has to be in it
— nothing trickles afterwards. Local addresses all arrive at once, but a TURN
allocation is a round trip to the relay, and on a phone over cellular that can
land a second or two after everything else. A quiet gap is therefore not proof
that gathering has finished, so the collector keeps waiting until it has seen a
relay candidate, up to five seconds, before it will emit a code.

That costs a second or two on a LAN where relay candidates are never coming.
It is the right trade for two phones on cellular, where carrier-grade NAT means
the relay is frequently the only route that works at all. The wait is skipped
once the peer is already connected, because no further out-of-band code is
needed at that point.

TURN servers themselves need no special handling: VDO.Ninja already resolves its
list before opening the signalling stub, so the iframe has them by the time it
gathers.

### Keeping the code scannable

Redundant candidates are removed before every encode, not used to fill an old
character allowance. Peer-reflexive candidates are omitted because
[RFC 8445](https://www.rfc-editor.org/rfc/rfc8445#section-5.1.3) states that
candidate gathering does not produce them; ICE learns them from connectivity
checks. The real Firefox matrix selected such a learned `prflx` route
successfully. The compactor then keeps the preferred local, TURN, and
server-reflexive route per transport/address family. Firefox's two preferred
mDNS host names are both kept because their IPv4/IPv6 family is hidden.

Every stage preserves at least one gathered `host`, `srflx`, and `relay`
candidate. UDP and TCP host and relay routes are retained independently, so
compacting does not force TURN and does not discard the TCP fallback needed on
a UDP-blocked network.

The compatibility budget is a hard ceiling of **118 characters for either
role**. If essential data still does not fit, encoding fails visibly instead
of emitting an oversized or less-connectable code. `Session` applies the
ceiling by default and clamps any larger requested budget; direct `encodeBlob`
calls enforce it too. Copy/paste carries the raw compact payload; both QR codes
add the page URL so a phone camera can open either one directly.

## Parameters used

| Parameter              | Why                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `&bypass`              | swaps the WebSocket for postMessage                                                       |
| `&password=false`      | VDO.Ninja encrypts SDP with a default key otherwise, and the codec cannot pack ciphertext |
| `&vd=0&ad=0&autostart` | publish nothing at first, so the bootstrap offer is datachannel-only                      |
| `&cleanoutput`         | the wrapper supplies the controls                                                         |

Pass anything else through `extraParams`. For example, an integration that must
remain LAN-only can pass `extraParams: "&lanonly"`. The public example page does
not copy arbitrary URL parameters into the iframe.

The wrapper page itself accepts:

| Parameter                 | Behaviour                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| `?autostart=1`            | starts creating an offer without pressing **Start connection**            |
| `?c=CODE` or `?code=CODE` | query-string fallback when a service strips URL fragments                 |
| `?camera=front\|rear`     | chooses the preferred publishing camera; `?facing=` is an alias           |
| `?scan=front\|rear`       | chooses the initial camera used by the in-page QR scanner                 |
| `#CODE`                   | preferred invite/reply form; validates and applies the code automatically |

Code-bearing URL fragments are preferred because they are not part of the HTTP
request. Generated links omit all wrapper parameters, keeping them as short as
the current page path permits. The media camera defaults to front, the scanner
defaults to rear, and both can be switched after permission reveals multiple
devices.

## Embedding API (version 1)

The page can be controlled by another application through `postMessage`.
Enable it explicitly, binding it to the parent application's exact origin:

```html
<iframe src="https://vdo.ninja/qr?api=1&parentOrigin=https%3A%2F%2Fapp.example" allow="camera; microphone; autoplay; display-capture; fullscreen" title="QR Connect"></iframe>
```

Include the scheme and any non-default port in `parentOrigin`. HTTP localhost
origins are supported for development. Opaque origins such as `file:` and
sandboxed frames without `allow-same-origin` are not supported by this transport.
The QR page verifies both the origin and the controlling parent window, and
sends replies only to that origin. Messages from its inner VDO iframe cannot
control this API. The parent must likewise verify the QR origin and iframe
window when receiving messages. Do not forward arbitrary messages from other
windows or unverified radio senders.

The parent retains contact selection, sender verification, hardware permissions,
radio credentials, pacing, queues and retry decisions. Only the exact `text` of
a LoRa packet belongs on the radio. API JSON and its identifiers stay local.
No radio driver, server component, or application-specific integration is needed
in QR Connect. The page remains usable on static hosts such as GitHub Pages.

### Initialization and request identity

Register the parent's message listener before loading the iframe. The page emits
`ready` with its `instanceId` and capabilities. No handshake text is emitted
before `init`. If `ready` was missed, send `init` without `instanceId` to discover
the current instance. Initialization is safe to repeat and does not start a call.

```js
qrFrame.contentWindow.postMessage(
	{
		api: "qrconnect",
		version: 1,
		type: "command",
		id: "request-1",
		command: "init",
		data: {}
	},
	"https://vdo.ninja"
);
```

Responses have `type: "response"`, echo `id`, and include `instanceId`,
`sessionId`, and either `{ ok: true, result: ... }` or
`{ ok: false, error: { code, message, retryable, requestId } }`.
The `init` result contains `{ capabilities, state }`.

All commands after initialization must include the returned `instanceId` and
the current `sessionId`, which is initially `null`. `start` returns a session ID
immediately; an incoming offer establishes an answering attempt on the first
accepted fragment. Adopt the response's session ID before sending the next
command. Each peer has its own local API session ID; it is separate from the
exchange ID already inside L1 packets. Use a fresh `init` to recover state when
the current session ID is unknown.

```js
qrFrame.contentWindow.postMessage(
	{
		api: "qrconnect",
		version: 1,
		type: "command",
		id: "request-2",
		instanceId: currentInstanceId,
		sessionId: currentSessionId,
		command: "configure",
		data: { mode: "lora", maxBytes: 140, embedded: true }
	},
	"https://vdo.ninja"
);
```

Request IDs are 1–80 ASCII letters, digits, periods, underscores, colons or
hyphens. Retrying the same ID with the same command, session and data returns
the original response, including while the operation is pending. It never
starts another call or sends chat again. Changed contents produce `ID_CONFLICT`.
Use new IDs for fresh state/statistics reads. Replies to old requests can contain
old state: they acknowledge that request, not a new call.

Completed requests are retained across `reset`, with a limit of 4,096 requests
per iframe instance; the API rejects further requests instead of evicting IDs
and allowing an old command to execute again. Reload and initialize a new iframe
when needed. Command content is limited to 16,384 UTF-8 bytes. Reloading changes
`instanceId` and destroys the active connection; it cannot restore an old offer.

### Commands

| Command              | `data` and result                                                                                                                                                                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init`               | Returns capabilities, limits and current state.                                                                                                                                                                                                                                                       |
| `configure`          | Optional `mode: "lora" \| "qr"`, `maxBytes: 40..140`, `theme: "system" \| "light" \| "dark"`, `embedded`, `showInstructions`, `showChat`. The last three are booleans. Format/budget changes require an idle attempt; presentation can change during a call. Theme applies to the QR page's controls. |
| `start`              | Creates an offer; returns `{ sessionId, state }` before packets finish gathering.                                                                                                                                                                                                                     |
| `receive`            | `{ text }`. Uses the normal validation and reassembly path; returns acceptance/progress. Incoming LoRa offers adopt their packet limit, which cannot exceed the configured limit. Receiving never enables camera or microphone.                                                                       |
| `getState`           | Returns the structured state below.                                                                                                                                                                                                                                                                   |
| `getOutgoing`        | Returns `{ packets, finalPacketCount: null }`. Recovers missed events without generating new codes.                                                                                                                                                                                                   |
| `setPacketStatus`    | `{ packetId, status }`; returns the updated packet. Records the parent's report and sends no traffic.                                                                                                                                                                                                 |
| `sendChat`           | `{ text }`, 1–2,000 UTF-16 characters; returns `{ messageId }`. Uses the established WebRTC chat channel.                                                                                                                                                                                             |
| `setMedia`           | `{ camera: true/false, microphone: true/false }`; either field may be omitted. Returns current state, which can still be `starting`. Requests for both devices acquire them in sequence. Enabling requires media readiness; disabling is safe before connection.                                      |
| `getDevices`         | Returns `{ devices: [{ kind, deviceId, label }] }`. Labels and IDs may be unavailable before permission. Does not request capture permission.                                                                                                                                                         |
| `selectDevice`       | `{ kind: "camera" \| "microphone", deviceId }` from `getDevices`. Selects for the next start, or switches an active input. Selecting an inactive input does not start it.                                                                                                                             |
| `requestScreenShare` | Reports `interactionRequired` and exposes an in-frame button. The user chooses a source after clicking it. Unsupported browsers return `UNSUPPORTED`.                                                                                                                                                 |
| `stopScreenShare`    | Stops an active screen share through the existing VDO screen control.                                                                                                                                                                                                                                 |
| `getStats`           | Returns direct/relay transport, connection timing, received audio bytes, decoded video frames and packet totals. Unavailable counters are `null`. No raw SDP, ICE credentials, addresses, stream IDs or device labels are returned.                                                                   |
| `hangup`             | Releases the iframe's media and peer connections. Retains the closed session ID and outgoing packet history for inspection.                                                                                                                                                                           |
| `reset`              | Releases resources, cancels pending work, clears fragments/history and returns to idle with `sessionId: null`. Preserves parent initialization and configuration.                                                                                                                                     |

`setMedia: false` disables publishing that input using the existing mute controls;
it does not promise to release hardware. `hangup` and `reset` unload the media
iframe and release its resources. A successful media command acknowledges the
request; observe `media`/`state` for completion or `error` for failure. Browser
permission prompts can remain pending, and device-start timeouts are reported.

### Events and state

Events use `{ api, version, type: "event", instanceId, sessionId, event, data }`.
Every event except `ready` requires initialization.

| Event                 | Contents                                                                                                                                                                                                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ready`               | Capabilities and limits; instance identity is in the envelope.                                                                                                                                                                                                                                             |
| `state`               | Structured connection state and readable status.                                                                                                                                                                                                                                                           |
| `outgoing`            | One generated packet, with stable `packetId`, `format`, exact `text`, UTF-8 `bytes`, `budget`, `role`, `status` and `needed`. LoRa also includes zero-based `sequence` and `part`, plus fragment `count`. Normal QR includes `code` and `link`, with `budget: null`; it is not labelled as a radio packet. |
| `receiveProgress`     | `accepted`, `duplicate`, records completed by this input, the next record index, known missing record indexes, and known missing fragments as `{ sequence, count, parts }`. Wholly missing records have no invented fragment count.                                                                        |
| `chat`                | `{ messageId, text, direction: "sent" \| "received" }`. IDs are local to this page.                                                                                                                                                                                                                        |
| `media`               | Current state including local inputs, screen sharing, remote tracks and return-media readiness.                                                                                                                                                                                                            |
| `devicesChanged`      | Current device choices.                                                                                                                                                                                                                                                                                    |
| `interactionRequired` | Operation, reason and the in-frame control needing a click.                                                                                                                                                                                                                                                |
| `error`               | Stable code, readable message, retryability and a request ID when available.                                                                                                                                                                                                                               |
| `closed`              | `local-hangup`, `reset`, or `failure`. A remote transport interruption is reported as `disconnected`; it is not falsely identified as a deliberate remote hangup.                                                                                                                                          |
| `resize`              | Current content width/height on resize or presentation changes.                                                                                                                                                                                                                                            |

For example, a connected session can still be preparing return media:

```json
{
	"connection": "connected",
	"chat": "ready",
	"returnMedia": "starting",
	"camera": "off",
	"microphone": "off",
	"screen": "off",
	"signalingNeeded": false
}
```

Connection states are `idle`, `preparing`, `exchanging`, `connecting`,
`connected`, `disconnected`, `failed` and `closed`. Inputs use `off`, `starting`,
`on` and `error`; chat and return media have their own readiness states.

Additional candidate packets can arrive after the first offer/answer event.
There is no declared final packet count in L1. `moreNeeded` remains true until
the connection succeeds; missing-record/fragment lists describe only known gaps.
Once `signalingNeeded` becomes false, stop sending any remaining handshake
packets. `getOutgoing` retains them with `needed: false`, so the parent can
reconcile its queue without treating them as failed transmissions.

Transmission status is initially `null` (no parent report). Accepted reports
are `queued` (queued locally), `radioAccepted` (radio accepted the command),
`radioAcknowledged` (recipient radio acknowledged it), `unconfirmed` (unknown
outcome), and `failed` (definite failure). `peerAccepted` is rejected because
QR Connect does not send per-packet peer acknowledgements. A successful
`receive` response acknowledges acceptance by the **local** page only. Neither
status updates nor retries create extra radio traffic automatically.

In API mode, normal QR answers must be delivered to their original iframe;
automatic tab handoff and URL-driven autostart/code loading are disabled. The
standalone page retains those behaviors when `api` is absent.

### Native WebViews and permissions

An application using a web parent can use the iframe API inside its WebView.
A WebView2 host loading QR Connect directly can explicitly use
`?api=1&apiTransport=webview2`. This requires the native bridge in the top-level
document and uses the same schema over `window.chrome.webview.postMessage` and
its `message` event. It is never enabled just because a bridge exists. The
native host must validate the web-message source URL and restrict navigation
before sending or accepting commands. Other native bridges require a host-side
adapter; they are not automatically detected.

The host's CSP must allow the QR origin in `frame-src`. Camera, microphone and
display-capture policy must permit the whole iframe chain, and native apps must
also handle their platform's permission requirements. Screen capture is optional
and requires a fresh user interaction; an API message does not bypass that.
The native bridge's availability does not establish media support in that host.

See [browser messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage),
[capture permissions](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia),
[screen capture](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia),
and [WebView2 security](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/security).

## Reusing the module

`qrconnect.js` has no DOM dependencies and can drive any UI:

```js
const session = new QRConnect.Session({
	role: "share", // or "join"
	iframe: myIframe,
	vdoBase: "../",
	qrBudget: 118, // optional lower ceiling; cannot exceed 118
	extraParams: "", // for example, "&lanonly"
	// Needed only when a cross-origin iframe prevents the wrapper from
	// reading VDO.Ninja's ICE configuration:
	peerConfiguration: null
});

session.on("state", text => console.log(text));
session.on("blob", result => show(result.text)); // .candidates and .dropped
session.on("connected", up => {});
session.on("channel", up => {}); // persistent peer channel
session.on("channel-error", err => {});
session.on("data", message => {}); // { data, UUID }
session.on("event", data => {}); // IFRAME API action events
session.on("error", err => {});

session.start();
session.createOffer(); // sharer
// session.acceptOffer(payload);                    // joiner
// session.acceptAnswer(payload);                   // sharer, once the answer is back
// session.sendData({ myApplication: { text: "hello" } }); // after "channel" is up
```

`QRConnect.decodeBlob(text)` resolves to the payload those last two take.
`session.post(msg)` forwards a raw IFRAME API message to the iframe.
`session.destroy()` closes the wrapper's peer channel, cancels startup/gathering
timers, removes listeners and navigates its media iframe to `about:blank`.

## Limits

- **Two peers.** Text chat and media are two-way. Rooms need the server.
- Camera controls switch one active publishing device at a time; they do not
  publish multiple cameras simultaneously.
- **Application-layer SDP wrapping is off**, because the codec cannot pack its
  ciphertext. Anyone who can read the offer _and_ answers it before the
  intended peer can take the connection, so exchange codes through a trusted
  channel. WebRTC's DTLS/SRTP transport encryption remains enabled.
- **A reported drop means re-scanning.** The wrapper can carry renegotiation or
  an ICE restart while the persistent sidecar survives, but it does not rebuild
  that channel after it is lost.
- A **secure context** is required for the camera: use HTTPS in production;
  browsers also treat `localhost` as secure for local testing.
- The offer is only good for one answer.
- A same-browser handoff can report that its waiting tab accepted an answer.
  With no timestamp or shared registry in the code, global used or expired
  status cannot be exact; a remote failure can only be described as closed,
  stale, already claimed, or unreachable.
- Automatic answer handoff requires the original offer tab to remain open and
  refuses to choose when multiple offer tabs are waiting.
- Chat has no server-side history, offline queue, or delivery after either page
  closes.
- **Physical screen-to-camera scanning is not yet validated.** Software tests
  round-trip the rendered QR through jsQR, and the page now supplies the
  standard four-module quiet zone. The in-page scanner prefers the rear camera,
  but real reliability still depends on screen size, glare, focus, distance,
  and the two devices involved.

## Dependencies

- `thirdparty/qrcode.min.js` — QR generation, already in the repo.
- `thirdparty/jsqr.min.js` — QR decoding. The example does not depend on the
  inconsistently available `BarcodeDetector` API.
