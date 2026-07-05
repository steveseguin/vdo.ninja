---
description: Compare practical BYO phone call-in options for VDO.Ninja, including SignalWire, Twilio, Telnyx, and DIY PBX/SIP trunk setups.
---

# Phone call-in provider options

Phone call-ins require a bridge between the public phone network and the browser. VDO.Ninja can handle the WebRTC side, but a phone provider still needs to supply the phone number, PSTN minutes, SIP trunk, or programmable voice API.

The current recommended direction is bring-your-own provider. A free shared VDO.Ninja dial-in number may be tested later, but it is not the default recommendation yet because phone numbers and PSTN minutes create ongoing cost and abuse risk.

{% hint style="warning" %}
The call-in feature is experimental. Phone callers are currently mixed into the director/host audio. They do not yet appear as normal VDO.Ninja guest tiles with scene membership, per-guest volume, or the full director control set.
{% endhint %}

## Quick recommendation

| Option | Current fit | Best for | VDO.Ninja path |
| --- | --- | --- | --- |
| SignalWire | Best direct BYO candidate today | Users who want a cheap provider that supports browser SIP-over-WSS | `&callin=signalwire` or `&callin=sip` |
| Twilio | Best tested hosted/PIN flow | Users who have a compatible backend/Worker for token minting | `&callin=twilio` |
| Telnyx | Good next adapter candidate | Users who want low-cost WebRTC/PSTN once a Telnyx adapter exists | Not fully wired yet |
| DIY PBX + SIP trunk | Cheapest/flexible, hardest setup | Users with FreePBX, Asterisk, VoIP.ms, IPComms, or another SIP trunk | `&callin=sip` |

For a live production today, the non-native fallback is still the most reliable: use a phone app, softphone, hardware mixer, Voicemeeter, OBS monitoring, or virtual audio cables to create two mix-minus feeds. See [Phone call-ins with VDO.Ninja and virtual audio cables](phone-call-ins-with-vdo-ninja-and-virtual-audio-cables.md).

## Option 1: SignalWire SIP-over-WSS

SignalWire is the best fit for the current browser-side SIP implementation because it supports SIP over secure WebSockets, which is what browser SIP libraries such as JsSIP need.

High-level flow:

1. Create a SignalWire account and Space.
2. Buy or port a phone number.
3. Create a SIP endpoint/credential.
4. Route the phone number to that SIP endpoint.
5. Open VDO.Ninja with `&callin=signalwire`.
6. Enter the SignalWire SIP WebSocket URL, SIP URI, username, and SIP password in the call-in panel.

The SIP password is entered in the browser panel. It should be a scoped SIP endpoint credential, not a master account API token.

See [SignalWire SIP call-in setup](signalwire-sip-call-in-setup.md).

## Option 2: Twilio Voice

Twilio is the most tested native call-in path in VDO.Ninja alpha, but it is not a pure browser-only setup.

Twilio's browser Voice SDK uses short-lived Access Tokens. Those tokens are created on a server, not in a public web page. In VDO.Ninja's experimental Twilio path, a compatible backend such as a private Cloudflare Worker mints the browser token, creates a PIN, and answers Twilio's voice webhook.

This gives the easiest operator flow:

1. Director opens VDO.Ninja with `&callin=twilio`.
2. The panel asks the backend for a phone number and PIN.
3. Caller dials the number and enters the PIN.
4. The call is bridged to the browser.

Tradeoff: Twilio is mature, but usually costs more than lower-level SIP providers. Do not put Twilio Account SIDs, Auth Tokens, or API Key Secrets in VDO.Ninja URLs or browser-side JavaScript.

See [Twilio phone call-in setup](twilio-phone-call-in-setup.md).

## Option 3: Telnyx

Telnyx is a good candidate for a future low-cost adapter. Telnyx has a WebRTC JS SDK and supports browser softphone use cases, but VDO.Ninja does not currently have a complete Telnyx-specific call-in adapter wired into the panel.

Practical status:

* Telnyx can be attractive on price.
* A proper VDO.Ninja integration likely needs a Telnyx WebRTC SDK/JWT flow or a provider-specific backend.
* Until that adapter exists, Telnyx should be treated as a future native option or used behind a DIY PBX/SIP bridge.

## Option 4: DIY PBX plus a cheap SIP trunk

This is the most flexible route if you already know telephony:

1. Buy or reuse a DID from VoIP.ms, IPComms, Telnyx SIP trunking, or another trunk provider.
2. Route the DID to Asterisk, FreePBX, FreeSWITCH, or another PBX/SBC.
3. Configure a browser/WebRTC SIP extension with TLS, SIP over WSS, and compatible media settings.
4. Open VDO.Ninja with `&callin=sip`.
5. Enter the PBX WebSocket URL, SIP URI, auth username, and extension password.

This is where VoIP.ms currently fits best. VoIP.ms is inexpensive and useful as a SIP trunk/DID provider, but the browser still needs a WebRTC/SIP-over-WSS endpoint. In practice, that usually means putting FreePBX, Asterisk, FreeSWITCH, or another PBX/SBC between VoIP.ms and VDO.Ninja.

## Why a backend is needed

A normal browser page should not contain phone-provider account secrets. Providers such as Twilio, SignalWire, and Telnyx use API keys or account tokens to buy numbers, mint browser tokens, and validate webhooks. Those account-level secrets need to live on a backend service, such as a Cloudflare Worker, or remain in the provider/PBX dashboard.

For hosted/PIN systems, the backend typically does four jobs:

1. Mint a short-lived browser calling token.
2. Create a temporary PIN that maps a phone caller to one VDO.Ninja director page.
3. Answer the provider's webhook when a phone call arrives.
4. Route the call to the registered browser client after the caller enters the PIN.

The audio itself should flow between the browser and the provider. The backend should not normally proxy live audio.

SIP-over-WSS is different: the browser logs in as a SIP endpoint directly. In that model, use a scoped SIP extension password. Do not use a master provider API key as the SIP password.

## Audio flow

Regardless of provider, the same mix-minus rule applies:

| Destination | Should hear | Should not hear |
| --- | --- | --- |
| Phone caller | Host plus VDO.Ninja guests | Phone caller |
| VDO.Ninja guests | Host plus phone caller | Themselves delayed |
| Livestream or recording | Host, guests, and caller | Usually no exclusions |

The experimental VDO.Ninja call-in paths attempt to create that return mix in the browser. If you are routing calls outside the browser, use the virtual-audio-cable guide instead.

## Credential handling

Use the least powerful credential that can work:

| Credential type | Store in browser? | Notes |
| --- | --- | --- |
| SIP extension username/password | Acceptable for testing if scoped to one endpoint | Enter manually; do not put it in a shared URL. |
| Twilio API Key Secret or Auth Token | No | Backend only. Used to mint short-lived browser tokens. |
| SignalWire or Telnyx project API token | No | Backend or provider dashboard only. |
| Temporary browser token/JWT | Yes | Short-lived and provider-scoped. |

The current panel does not intentionally store SIP passwords long-term. If a future "remember this provider" option is added, it should be clearly opt-in and stored only in the local browser, with a warning that browser storage is convenience storage, not protection against XSS or a compromised machine.

Do not put provider account secrets or SIP passwords in shared VDO.Ninja URLs.

## Free shared VDO.Ninja number

A single free VDO.Ninja-hosted number may be reasonable as a trust-based beta later, but it should start with strict guardrails:

* Short PIN expiry.
* One active caller per room/session.
* Maximum call duration.
* Global concurrency cap.
* Monthly/manual spend cap.
* Failed PIN throttling.
* No outbound PSTN calls.

The inbound-only design avoids outbound toll fraud, but it does not avoid inbound cost abuse. If usage grows beyond a small monthly budget, account linking or access gating would be needed.

## Current experimental parameters

| Parameter | Purpose |
| --- | --- |
| `&callin=sip` | Show the SIP/PBX panel. |
| `&callin=signalwire` | Show the same SIP-over-WSS panel with SignalWire-specific copy. |
| `&callin=twilio` | Show the Twilio call-in adapter when available. |
| `&callinapi=https://example.com` | Point the Twilio adapter at a compatible backend. |
| `&sipwss=wss://pbx.example.com:8089/ws` | Pre-fill the SIP WebSocket endpoint. |
| `&sipuri=sip:1001@example.com` | Pre-fill the SIP URI. |
| `&sipuser=1001` | Pre-fill the SIP auth username. |

Do not put provider account secrets or SIP passwords in shared URLs.

## Provider links and price checks

Prices change. Check each provider's current pricing before buying numbers or leaving a DID active.

* [SignalWire voice pricing](https://signalwire.com/pricing/voice)
* [SignalWire SIP-over-WebSockets overview](https://signalwire.com/blogs/product/webrtc-using-sip-over-websockets)
* [Twilio Voice pricing](https://www.twilio.com/en-us/voice/pricing/us)
* [Twilio Access Tokens](https://www.twilio.com/docs/iam/access-tokens)
* [Telnyx WebRTC browser guide](https://developers.telnyx.com/docs/voice/webrtc/make-a-call-to-a-web-browser)
* [Telnyx Elastic SIP pricing](https://telnyx.com/pricing/elastic-sip)
* [VoIP.ms pricing](https://voip.ms/pricing)

## Related guides

* [Phone call-ins with VDO.Ninja and virtual audio cables](phone-call-ins-with-vdo-ninja-and-virtual-audio-cables.md)
* [SignalWire SIP call-in setup](signalwire-sip-call-in-setup.md)
* [Twilio phone call-in setup](twilio-phone-call-in-setup.md)
