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

## Limits

- **Two peers.** Text chat is two-way, but media is currently one-way: one
  publishes and one views. Rooms need the server.
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
