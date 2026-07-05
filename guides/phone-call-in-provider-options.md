---
description: Compare the practical ways to bring phone callers into a VDO.Ninja production, including audio routing, SIP/PBX, and programmable phone providers.
---

# Phone call-in provider options

Phone call-ins require a bridge between the public phone network and the browser. VDO.Ninja can handle the WebRTC side, but a phone provider still needs to supply the phone number, PSTN minutes, SIP trunk, or programmable voice API.

For most live shows, there are three practical approaches:

| Approach | Best for | Cost model | VDO.Ninja feature path |
| --- | --- | --- | --- |
| External phone app plus mix-minus routing | Reliable production today | Your phone/SIP provider plus your audio tools | [Virtual audio cable call-in guide](phone-call-ins-with-vdo-ninja-and-virtual-audio-cables.md) |
| SIP/PBX over WebRTC | Advanced users with FreePBX, Asterisk, or a SIP provider | SIP DID plus trunk/minute fees | `&callin=sip` experimental panel |
| Programmable voice provider | Hosted dial-in number and PIN flow | Number rental plus per-minute PSTN costs | `&callin=twilio` experimental adapter, backend required |

## Why a backend is needed

A normal browser page should not contain phone-provider account secrets. Providers such as Twilio, SignalWire, and Telnyx use API keys or account tokens to buy numbers, mint browser tokens, and validate webhooks. Those secrets need to live on a backend service, such as a Cloudflare Worker.

The backend typically does four jobs:

1. Mint a short-lived browser calling token.
2. Create a temporary PIN that maps a phone caller to one VDO.Ninja director page.
3. Answer the provider's webhook when a phone call arrives.
4. Route the call to the registered browser client after the caller enters the PIN.

The audio itself should flow between the browser and the provider. The backend should not normally proxy live audio.

## Audio flow

Regardless of provider, the same mix-minus rule applies:

| Destination | Should hear | Should not hear |
| --- | --- | --- |
| Phone caller | Host plus VDO.Ninja guests | Phone caller |
| VDO.Ninja guests | Host plus phone caller | Themselves delayed |
| Livestream or recording | Host, guests, and caller | Usually no exclusions |

The experimental VDO.Ninja call-in paths attempt to create that return mix in the browser. If you are routing calls outside the browser, use the virtual-audio-cable guide instead.

## SIP/PBX providers

SIP is usually the cheapest path if you already understand PBX routing.

Common setup:

1. Buy or use a DID from a provider such as VoIP.ms, IPComms, or another SIP trunk provider.
2. Route that DID to a PBX such as Asterisk or FreePBX.
3. Configure a WebRTC-capable SIP extension with TLS and SIP over secure WebSockets.
4. Open the VDO.Ninja director URL with `&callin=sip`.
5. Enter the WSS server, SIP URI, auth username, and password in the panel.

This path is flexible, but it is not beginner-friendly. The PBX needs a valid TLS certificate, WebRTC-compatible media settings, and a reachable `wss://` SIP endpoint.

## Programmable voice providers

Programmable providers can give a simpler operator workflow: the VDO.Ninja director starts call-in mode, gets a phone number and PIN, and gives those to the caller.

Common setup:

1. Create a provider account.
2. Create API credentials for the backend.
3. Create a voice application or equivalent webhook target.
4. Buy a phone number.
5. Point the number at the voice application.
6. Configure the call-in backend with provider credentials.
7. Open VDO.Ninja with the provider adapter enabled.

The exact names differ by provider. Twilio calls the webhook target a TwiML App. SignalWire and Telnyx have similar concepts, but their browser SDKs and token formats differ.

## Abuse and spending controls

Phone numbers and PSTN minutes cost money, so any hosted version should include limits:

* Short PIN expiry.
* One active caller per room, unless explicitly expanded.
* Maximum call duration.
* Maximum concurrent calls.
* Rate limits on PIN attempts.
* Signed provider webhook validation.
* Manual top-ups or account-level spend caps.

If users bring their own provider account, they pay their own phone bill. If VDO.Ninja hosts the provider account, VDO.Ninja needs stronger abuse controls.

## Current experimental parameters

| Parameter | Purpose |
| --- | --- |
| `&callin=sip` | Show the SIP/PBX panel. |
| `&callin=twilio` | Show the Twilio call-in adapter when available. |
| `&callinapi=https://example.com` | Point the Twilio adapter at a compatible backend. |
| `&sipwss=wss://pbx.example.com:8089/ws` | Pre-fill the SIP WebSocket endpoint. |
| `&sipuri=sip:1001@example.com` | Pre-fill the SIP URI. |
| `&sipuser=1001` | Pre-fill the SIP auth username. |

Do not put provider account secrets or SIP passwords in shared URLs.

## Related guides

* [Phone call-ins with VDO.Ninja and virtual audio cables](phone-call-ins-with-vdo-ninja-and-virtual-audio-cables.md)
* [Twilio phone call-in setup](twilio-phone-call-in-setup.md)
