---
description: Connect two browsers by exchanging QR codes, without VDO.Ninja's handshake server.
---

# QR Connect

**Exchange two codes. Then talk, share video, or chat. No handshake server introduces the two browsers.**

Try it at [vdo.ninja/qr](https://vdo.ninja/qr).

![Device A sends an offer code to device B. B sends a reply code back. Both can then start an encrypted call, directly or through TURN when needed.](../.gitbook/assets/qr-connect-exchange.svg)

## Connect in three steps

1. **A:** Press **Start connection**. Let B scan your QR or send B the text code.
2. **B:** Open the QR link, or choose **Scan or paste a code**. Send the reply back. **A scans or pastes it into the original waiting tab.**
3. Either person can now start their **camera and microphone separately**, or just chat. Scanning does not start broadcasting.

Keep both pages open. Each offer connects one pair; it is not a permanent room link.

## What “serverless” means

The code contains the connection details themselves. **No server looks up the code or exchanges the offer and reply for you.** You scan or copy them across. If you use a messaging app, that app carries your copy.

Servers can still have other jobs:

| Job | What happens |
| --- | --- |
| Load the app | A web server supplies the page; supported browsers cache an offline copy. |
| Find a network route | STUN helps discover the browser's internet-facing address. |
| Cross restrictive networks | TURN can relay encrypted traffic, including on cellular connections. |

**No handshake server** does not mean **no internet services**. Direct connections are preferred; TURN-only connections work too.

## How the code gets so small

**Connect a tiny data channel first; add audio/video afterward.** Long lists of media settings never need to fit in the QR.

The browser then packs the remaining details:

- Replace repeated text with a small template identifier.
- Pack addresses, credentials, and the certificate fingerprint into binary; reuse values and trim network routes.
- Encode the bytes using 30,000 letters and numbers: almost 15 bits per character.

The text is capped at **118 characters**, plus the page address when shared as a link. Unfamiliar browser formats have fallbacks, including DEFLATE compression. If essential data cannot fit, the app reports an error.

This compresses **connection instructions**, not picture quality. Later settings travel automatically over the peer connection—no extra QR needed.

## What is used or saved?

| Item | Where it goes |
| --- | --- |
| Connection code | Network routes, temporary credentials, and a certificate fingerprint. No camera frames or private encryption key. |
| Audio/video and chat | Encrypted WebRTC traffic; no automatic recording or server-side chat history. Chat lives in the open pages. |
| Local storage | Cached app files and temporary tab-handoff records, sometimes containing a reply code. Records use a 20-minute cleanup age; closing the browser can delay cleanup. |
| Other copies/settings | Browser permissions and VDO.Ninja preferences may persist. Clipboard copies, screenshots, and shared messages can remain in other apps. |

Exchange codes privately: someone else could answer your offer first. Compression is not encryption. If the connection is fully lost, exchange fresh codes.

For the implementation details, see [Serverless connections](../guides/serverless-connections.md).
