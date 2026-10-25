---
description: Set up SignalWire, or your own PBX, for VDO.Ninja's experimental phone call-in panel using SIP over secure WebSockets.
---

# SignalWire SIP call-in setup

SignalWire supplies a phone number and a browser-compatible SIP endpoint, so the VDO.Ninja call-in panel can register to it directly over `wss://` without a PBX of your own. The same SIP mode also works with [your own PBX](#use-your-own-pbx-or-sip-server).

{% hint style="warning" %}
The call-in panel is experimental. For how it mixes audio, the ringtone, and every URL parameter, see [Phone call-in provider options](phone-call-in-provider-options.md).
{% endhint %}

## 1. Create a SignalWire Space

Create a SignalWire account and a Space. The dashboard shows the Space's SIP domain, similar to `your-space.sip.signalwire.com`.

## 2. Create a SIP endpoint

Create a SIP endpoint (SIP credential) used only by VDO.Ninja:

| Field | Example |
| --- | --- |
| Username | `vdo-callin` |
| Password | A strong generated password |
| Caller ID | Your show name or phone number |
| Encryption | Required, if offered |

The browser needs only this endpoint's password. Never use your SignalWire project API token as the SIP password.

## 3. Route a phone number to the endpoint

Buy a voice-capable number in SignalWire, or bring in an existing one, and send its inbound calls to the endpoint:

```text
Inbound phone number -> sip:vdo-callin@your-space.sip.signalwire.com
```

The dashboard wording changes over time; see SignalWire's [SIP documentation](https://signalwire.com/docs/platform/voice/sip/trunking). If you route with a compatibility XML script, it dials the endpoint like this:

```xml
<Response>
  <Dial>
    <Sip>sip:vdo-callin@your-space.sip.signalwire.com</Sip>
  </Dial>
</Response>
```

## 4. Connect VDO.Ninja

Open the director page in SignalWire mode. `&signalwirespace` fills in the WebSocket URL for you:

```text
https://vdo.ninja/?director=YourRoomName&callin=signalwire&signalwirespace=your-space
```

Fill in the panel:

| Field | Value | Notes |
| --- | --- | --- |
| SIP WebSocket URL | `wss://your-space.sip.signalwire.com` | Where the browser connects. Must start with `wss://`. It is not the SIP address. |
| SIP URI | `sip:vdo-callin@your-space.sip.signalwire.com` | The endpoint's callable address. `sip:` is added if you leave it off. |
| Auth username | `vdo-callin` | Usually the user part of the SIP URI. |
| Password | The endpoint password | Never a project or account API token. |
| Display name | `VDO.Ninja` | Optional. |
| Dial target | `+15551234567` | Outbound calls only. A phone number becomes `sip:+15551234567@your-space.sip.signalwire.com`. |

Leave **Register for incoming calls** on, and turn on **Auto-answer incoming calls** only after testing. Click **Connect**. The status should read "SIP account registered." When a call arrives, click **Answer**.

URL parameters can pre-fill every field except the password; see the [parameter list](phone-call-in-provider-options.md#url-parameters).

## 5. Test

Run the [test checklist](phone-call-in-provider-options.md#test-before-going-live). Then, with your real provider or PBX and codecs, also test hold and resume, a second call while you are busy (the panel rejects it), and a brief network interruption.

## Saved profiles and passwords

**Save profile** stores the SIP and SignalWire fields in this browser, and **Forget** removes them. The password is saved only if you tick **Remember password on this browser** and accept the warning. It is kept in the browser's local storage: convenient on a trusted production computer, but not a secure vault. Do not use it on a shared computer.

A saved password is reused only while the WebSocket URL, SIP URI, and auth username match the saved profile. If a URL parameter or an edit changes any of them, the panel clears the password and asks you to enter it again. The saved profile stays as it was until you save or forget it, and `&sipauto` keeps working for an unchanged saved identity.

## Use your own PBX or SIP server

Use `&callin=sip` with Asterisk, FreePBX, FreeSWITCH, or another PBX. Give VDO.Ninja a dedicated extension that has:

* SIP over **WSS**, with a certificate the browser trusts, and
* **WebRTC media**. In FreePBX, set the equivalent of: Media Encryption **DTLS-SRTP**, ICE Support **Yes**, AVPF **Yes**, RTCP Mux **Yes**, DTLS Setup **Act/Pass**, DTLS Verify **Fingerprint**. Labels vary by FreePBX and Asterisk version.

An ordinary extension can register, and even work in a desktop softphone such as MicroSIP, yet fail when Chrome or Edge answers with `488 Not Acceptable Here`. Browsers accept only encrypted WebRTC audio, so the PBX's offer must include a DTLS fingerprint. A successful registration or a trusted certificate proves only that signaling works. For Asterisk, see [Configuring Asterisk for WebRTC clients](https://docs.asterisk.org/Configuration/WebRTC/Configuring-Asterisk-for-WebRTC-Clients/).

Two common routes:

* **A phone number through your PBX:** a SignalWire number, or a number from any SIP trunk provider, goes to a PBX trunk, then to the WebRTC extension, then to VDO.Ninja. Use this if you want local extensions, queues, voicemail, or different billing.
* **An existing SIP or AoIP system with no phone number:** your hardware codec or SIP client calls the browser's extension through the PBX as usual. The PBX bridges ordinary SIP and RTP to WebRTC and may transcode, so check the negotiated codec on both legs before assuming your audio quality carries through.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| "SIP registration failed" | Wrong WebSocket URL, SIP URI, username, or password, or wrong endpoint settings. |
| "SIP WebSocket URL must use wss:// for browser calling." | The URL starts with `sip:`, `http:`, or `ws:`. Use the `wss://` address. |
| "SIP server or account changed. Enter its password before connecting." | A saved password was withheld because the server or account changed. Check the fields and enter the matching password. |
| Calls never reach VDO.Ninja | The number is not routed to the endpoint, or the panel is not registered. |
| Chrome reports `ERR_CERT_AUTHORITY_INVALID` for the PBX | Install a trusted certificate, or open the PBX's HTTPS/WSS address once and accept its certificate. This fixes signaling only, not media. |
| The panel rings, but Answer sends the caller to voicemail | Look in the browser console for `488 Not Acceptable Here` or `SDP without DTLS fingerprint`, then enable WebRTC media on the extension. |
| MicroSIP works but VDO.Ninja does not | The extension offers plain RTP audio. Use a WebRTC extension. |
| The caller connects but nobody hears them | Check browser microphone permission and that the director clicked **Enable director's microphone or video**. The status should read "Caller audio connected to the VDO.Ninja outbound mix." |
| The caller cannot hear the room during Solo Talk | Expected. The return pauses for privacy and resumes afterward. |
| The caller hears echo | Someone is playing the call through speakers. Use headphones. |

When you finish testing, release unused numbers or turn off the routing to stop charges.
