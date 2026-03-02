---
description: Reference for the &bufferaudio URL parameter in VDO.Ninja including behavior examples and related options.
---

# &bufferaudio

**Also known as:** `&audiobuffer`

#### **Description**

Sets a minimum audio buffer duration in milliseconds for incoming audio streams to improve playback stability.

#### **Viewer-Side Option**

This parameter controls the audio buffering for received streams, helping to smooth out network jitter.

#### **Usage**

* **`&bufferaudio=100`** - Sets 100ms audio buffer
* **`&bufferaudio=250`** - Sets 250ms audio buffer  
* **`&bufferaudio=0`** - Minimal buffering (lowest latency)
* **`&audiobuffer=200`** - Alias usage

#### **Examples**

```
https://vdo.ninja/?view=streamID&bufferaudio=150
https://vdo.ninja/?scene=1&room=roomname&bufferaudio=200
https://vdo.ninja/?director&room=roomname&audiobuffer=100
```

#### **Details**

* Value in milliseconds (ms)
* Higher values increase stability but add latency
* Lower values reduce latency but may cause glitches
* Helps with poor network conditions
* Only affects received audio, not sent audio

#### **Recommended Values**

* **0-50ms**: Ultra-low latency, stable networks only
* **100-200ms**: Good balance for most situations
* **250-500ms**: Poor network conditions
* **500ms+**: Very unstable connections

#### **Trade-offs**

**Low Buffer (0-50ms):**
- ✅ Minimal latency
- ❌ May glitch on poor networks
- ❌ Sensitive to jitter

**High Buffer (200ms+):**
- ✅ Smooth playback
- ✅ Handles network issues
- ❌ Noticeable delay

#### **Use Cases**

* Music performances requiring sync
* Interviews over unstable connections
* International calls with high latency
* Mobile connections with variable quality

#### **Notes**

* Independent from video buffering
* Applies to all incoming audio streams
* May affect lip-sync at high values
* Consider network conditions when setting

#### **Related Parameters**

* [`&buffer`](../view-parameters/buffer.md) - Video buffer control
* [`&buffer2`](../video-parameters/and-buffer2.md) - Alternative buffer method
* [`&audiolatency`](../newly-added-parameters/and-audiolatency.md) - Audio latency control
* [`&sync`](../view-parameters/sync.md) - Audio/video synchronization