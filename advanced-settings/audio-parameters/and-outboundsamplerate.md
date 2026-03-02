---
description: Reference for the &outboundsamplerate URL parameter in VDO.Ninja including behavior examples and related options.
---

# &outboundsamplerate

**Also known as:** `&obsr`

#### **Description**

Sets the sample rate for outbound audio processing in the web audio pipeline.

#### **Sender-Side Option**

This parameter controls the sample rate used for audio resampling before transmission.

#### **Usage**

* **`&outboundsamplerate=48000`** - Sets sample rate to 48kHz (default in v24+)
* **`&outboundsamplerate=44100`** - Sets sample rate to 44.1kHz
* **`&outboundsamplerate=0`** - Disables resampling
* **`&obsr=48000`** - Short alias for the parameter

#### **Examples**

```
https://vdo.ninja/?push=streamID&outboundsamplerate=48000
https://vdo.ninja/?push=streamID&obsr=44100
https://vdo.ninja/?push=streamID&outboundsamplerate=0
```

#### **Details**

* In VDO.Ninja v24+, audio is automatically resampled to 48kHz for web audio processing
* This parameter allows override of the default resampling behavior
* Audio is encoded to 48kHz by Opus regardless of this setting
* Mainly useful for debugging or testing audio issues

#### **Platform Behavior**

* **Chrome/Chromium:** Resampling enabled by default (can be disabled)
* **Firefox/Safari:** No default resampling (can be force-enabled)
* **Mobile browsers:** No default resampling (can be force-enabled)

#### **Important Notes**

* High sample rates can crash the web audio pipeline
* Avoid sample rates above 48kHz
* Setting to 0 or omitting value disables resampling
* Using `&noap` disables the entire web audio pipeline

#### **Technical Background**

* Resampling ensures consistent audio processing across different input devices
* Helps prevent audio glitches with certain hardware configurations
* Final transmission uses Opus codec at 48kHz regardless

#### **Related Parameters**

* [`&samplerate`](../view-parameters/and-samplerate.md) - Sets playback sample rate (viewer-side)
* [`&noaudioprocessing`](../../general-settings/noaudioprocessing.md) - Disables audio processing
* [`&audiocodec`](minptime-1.md) - Selects audio codec