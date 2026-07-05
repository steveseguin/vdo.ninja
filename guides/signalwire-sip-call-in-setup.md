---
description: Set up SignalWire SIP-over-WSS for the experimental VDO.Ninja phone call-in panel.
---

# SignalWire SIP call-in setup

SignalWire is currently the most direct bring-your-own provider option for VDO.Ninja's browser-side SIP call-in panel. It supports SIP over secure WebSockets, which lets the browser register as a SIP endpoint without running your own PBX.

{% hint style="warning" %}
This is experimental. Phone callers are mixed into the director/host audio and do not yet appear as normal guest tiles with full scene controls.
{% endhint %}

## What this creates

The call path is:

1. A phone caller dials your SignalWire number.
2. SignalWire routes the call to a SIP endpoint in your SignalWire Space.
3. The VDO.Ninja director page registers to that SIP endpoint over `wss://`.
4. VDO.Ninja answers the call in the browser.
5. VDO.Ninja mixes the caller into the room and sends a mix-minus return feed back to the caller.

## Cost notes

Check SignalWire's current pricing before buying numbers. At the time this guide was written, SignalWire's public voice pricing listed local numbers at a low monthly cost and usage priced per minute for PSTN, SIP, and WebRTC legs. Prices and country availability can change.

Useful references:

* [SignalWire voice pricing](https://signalwire.com/pricing/voice)
* [SignalWire SIP-over-WebSockets overview](https://signalwire.com/blogs/product/webrtc-using-sip-over-websockets)
* [SignalWire SIP trunking guide](https://signalwire.com/docs/platform/voice/sip/trunking)

## 1. Create a SignalWire Space

Create or open a SignalWire account, then create a Space. Your Space has a SIP domain similar to:

```text
your-space.sip.signalwire.com
```

The exact Space name and SIP domain are shown in the SignalWire dashboard.

## 2. Create a SIP endpoint

In the SignalWire dashboard, create a SIP credential or SIP endpoint for VDO.Ninja.

Use a dedicated credential for this purpose:

| Field | Example |
| --- | --- |
| Username | `vdo-callin` |
| Password | Use a strong generated password |
| Caller ID | Your show name or phone number |
| Encryption | Required, if offered |

Do not use your SignalWire project API token as the SIP password. The browser only needs the scoped SIP endpoint credential.

## 3. Buy or route a phone number

Buy a voice-capable number in SignalWire, or use an existing number that can route into SignalWire.

Route inbound calls from that number to the SIP endpoint you created. The exact dashboard wording can change, but the goal is:

```text
Inbound phone number -> SIP endpoint vdo-callin@your-space.sip.signalwire.com
```

If you are using a SignalWire XML/SWML/Call Flow style route, the route should dial the SIP endpoint. For example, a compatibility XML style route would be conceptually:

```xml
<Response>
  <Dial>
    <Sip>sip:vdo-callin@your-space.sip.signalwire.com</Sip>
  </Dial>
</Response>
```

Use the current SignalWire dashboard/docs for the exact routing UI.

## 4. Start VDO.Ninja

Open the director page with the experimental call-in panel:

```text
https://vdo.ninja/alpha/?director=YourRoomName&callin=signalwire
```

If the deployed version does not yet include the SignalWire label, use the generic SIP mode instead:

```text
https://vdo.ninja/alpha/?director=YourRoomName&callin=sip
```

In the panel, enter:

| VDO.Ninja field | SignalWire value |
| --- | --- |
| SIP WebSocket URL | `wss://your-space.sip.signalwire.com` |
| SIP URI | `sip:vdo-callin@your-space.sip.signalwire.com` |
| Auth username | The SIP endpoint username, such as `vdo-callin` |
| Password | The SIP endpoint password |
| Display name | Optional label, such as `VDO.Ninja` |

Leave **Register for incoming calls** enabled. Enable **Auto-answer incoming calls** only after testing.

Click **Connect**. The status should show that the SIP account registered.

## 5. Test before going live

1. Join the VDO.Ninja room as director/host.
2. Join as a normal guest from another browser or device.
3. Start the SignalWire call-in panel and confirm it registers.
4. Call the SignalWire number from a regular phone.
5. Answer the incoming call in the panel.
6. Confirm the VDO.Ninja guest hears the phone caller.
7. Confirm the phone caller hears the host and VDO.Ninja guest.
8. Confirm the phone caller does not hear a delayed copy of themselves.

## Useful parameters

| Parameter | Purpose |
| --- | --- |
| `&callin=signalwire` | Opens the call-in panel in SignalWire/SIP mode. |
| `&callin=sip` | Opens the generic SIP/PBX panel. |
| `&sipwss=wss://your-space.sip.signalwire.com` | Pre-fills the SIP WebSocket URL. |
| `&sipuri=sip:vdo-callin@your-space.sip.signalwire.com` | Pre-fills the SIP URI. |
| `&sipuser=vdo-callin` | Pre-fills the auth username. |
| `&sipauto=1` | Connects automatically when the page loads. |
| `&sipautoanswer=1` | Answers incoming calls automatically. |

Do not put the SIP password in the URL.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| SIP registration fails | Wrong WSS URL, SIP URI, username, password, or SignalWire endpoint settings. |
| Browser says the WebSocket URL is invalid | The URL must start with `wss://`, not `sip:`, `http:`, or `ws:`. |
| Phone call never reaches VDO.Ninja | The SignalWire number is not routed to the SIP endpoint, or the VDO.Ninja page is not registered. |
| Caller connects but no one hears them | Check browser microphone permissions, the VDO.Ninja outbound mix, and whether the caller audio track attached in the panel. |
| Caller hears echo | The return mix includes the phone caller audio. Hang up and check the routing before going live. |

When testing is done, release unused numbers or disable routing if you do not want ongoing charges.
