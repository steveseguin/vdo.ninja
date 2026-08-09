---
description: Reference for the &preferaudiocodec URL parameter in VDO.Ninja including behavior examples and related options.
---

# &preferaudiocodec

#### **Description**

Sets the preferred audio codec for outgoing streams, allowing the sender to specify which audio codec they prefer to use.

#### **Sender-Side Option**

This parameter influences which audio codec is negotiated during the WebRTC connection setup.

#### **Usage**

* **`&preferaudiocodec=opus`** - Prefer Opus codec (default for most browsers)
* **`&preferaudiocodec=red`** - Prefer RED (redundancy encoding) for packet loss resilience
* **`&preferaudiocodec=g722`** - Prefer G.722 codec

#### **Examples**

```
https://vdo.ninja/?push=streamID&preferaudiocodec=opus
https://vdo.ninja/?push=streamID&preferaudiocodec=red
https://vdo.ninja/?push=streamID&whipout=whipserver&preferaudiocodec=g722
```

#### **Details**

* The parameter sets a preference, but the final codec is negotiated between peers
* Both sender and receiver must support the codec for it to be used
* Primarily intended for debugging or WHIP publishing scenarios
* Codec names are case-insensitive (converted to lowercase)

#### **Available Codecs**

* **opus** - Default, high-quality codec with good compression
* **red** - Redundancy encoding, better for poor network conditions
* **g722** - Traditional telephony codec, wider compatibility

#### **Notes**

* Not all browsers support all codecs
* Using RED codec may limit bitrate to 216 kbps
* This is an advanced parameter mainly for debugging or specific use cases
* WHIP servers may require specific codecs

{% hint style="info" %}
The native Ninja OBS Plugin has its own **Audio RED (Experimental)** setting. When enabled, it offers RFC 2198 RED and
can carry one previous Opus frame with the current frame; each viewer either selects that mapping or falls back to plain Opus.
`&preferaudiocodec=red` configures a VDO.Ninja browser publisher and does not turn on the plugin setting.
{% endhint %}

#### **Related Parameters**

* [`&audiocodec`](../audio-parameters/minptime-1.md) - Forces a specific audio codec (viewer-side)
* [`&audiobitrate`](../view-parameters/audiobitrate.md) - Sets the audio bitrate
* [`&whipout`](../whip-parameters/and-whipout.md) - Publishes via WHIP protocol
