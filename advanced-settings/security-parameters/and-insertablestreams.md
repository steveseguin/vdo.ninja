---
description: Reference for the &insertablestreams URL parameter in VDO.Ninja including behavior examples and related options.
---

# &insertablestreams

**Also known as:** `&is`

#### **Description**

Enables insertable streams for custom media processing, allowing manipulation of encoded media frames before transmission or playback.

#### **General Option**

This parameter activates the insertable streams API, enabling advanced media processing capabilities.

#### **Usage**

* **`&insertablestreams`** - Enable insertable streams
* **`&insertablestreams=custom`** - Enable with custom identifier
* **`&is`** - Short alias

#### **Examples**

```
https://vdo.ninja/?push=streamID&insertablestreams
https://vdo.ninja/?view=streamID&is
https://vdo.ninja/?room=roomname&insertablestreams=myprocessor
```

#### **Technical Details**

* Enables WebRTC Insertable Streams API
* Allows frame-level media manipulation
* Can process both audio and video
* Used for custom encryption, effects, or analysis
* Required for certain advanced features

#### **Common Uses**

1. **Custom Encryption**: Implement end-to-end encryption
2. **Media Effects**: Apply custom video/audio processing
3. **Analytics**: Analyze media frames in real-time
4. **Watermarking**: Add watermarks to video streams
5. **Transcoding**: Custom codec implementations

#### **How It Works**

1. Intercepts encoded media frames
2. Allows JavaScript processing
3. Can modify or analyze frames
4. Re-inserts processed frames
5. Transparent to WebRTC pipeline

#### **Browser Support**

* **Chrome/Edge**: Full support (v86+)
* **Firefox**: Experimental support
* **Safari**: Limited support
* **Mobile**: Varies by platform

#### **Performance Considerations**

* Adds processing overhead
* May increase CPU usage
* Can impact latency
* Memory usage depends on processing

#### **Security Notes**

* Allows deep media access
* Use with trusted code only
* Can break E2EE if misused
* Verify processing integrity

#### **Related Parameters**

* [`&e2ee`](../setup-parameters/and-e2ee.md) - End-to-end encryption
* [`&password`](../setup-parameters/and-password.md) - Encryption password
* [`&secure`](../../source-settings/secure.md) - Security mode
* [`&privacy`](../turn-and-stun-parameters/and-privacy.md) - Privacy enhancements