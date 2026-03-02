---
description: Reference for the &chunkedbuffer URL parameter in VDO.Ninja including behavior examples and related options.
---

# &chunkedbuffer

**Also known as:** `&sendingbuffer`

#### **Description**

Sets the buffer size in milliseconds for chunked media transmission mode, controlling latency vs reliability trade-off.

#### **Sender-Side Option**

This parameter configures the buffering behavior when using chunked transmission mode for improved reliability.

#### **Usage**

* **`&chunkedbuffer=5000`** - 5 second buffer (default)
* **`&chunkedbuffer=2000`** - 2 second buffer (lower latency)
* **`&chunkedbuffer=10000`** - 10 second buffer (more reliable)
* **`&sendingbuffer=3000`** - Alias usage

#### **Examples**

```
https://vdo.ninja/?push=streamID&chunked&chunkedbuffer=3000
https://vdo.ninja/?push=streamID&chunked&sendingbuffer=5000
https://vdo.ninja/?room=roomname&chunked&chunkedbuffer=2000
```

#### **Details**

* Only applies when using [`&chunked`](and-chunked.md) mode
* Value in milliseconds (default: 5000ms)
* Controls how much data is buffered before sending
* Higher values improve reliability on poor connections
* Lower values reduce latency but may cause issues

#### **Buffer Size Guidelines**

* **1000-2000ms**: Low latency, good networks
* **3000-5000ms**: Balanced (default range)
* **5000-10000ms**: Poor networks, high reliability
* **10000ms+**: Extreme conditions

#### **How It Works**

1. Media is encoded into chunks
2. Chunks are buffered for specified duration
3. Buffer allows for retransmission if needed
4. Larger buffer = more retry opportunities

#### **Trade-offs**

**Small Buffer (1-2 seconds):**
- ✅ Lower latency
- ✅ More real-time
- ❌ Less reliable on poor networks
- ❌ May drop frames

**Large Buffer (5-10 seconds):**
- ✅ Very reliable
- ✅ Handles packet loss well
- ❌ Higher latency
- ❌ Less real-time interaction

#### **Use Cases**

* Streaming over cellular networks
* International broadcasts
* Unreliable internet connections
* Recording important content
* One-way broadcasts (higher buffer acceptable)

#### **Notes**

* Requires [`&chunked`](and-chunked.md) to be enabled
* Affects sender-side behavior only
* Memory usage increases with buffer size
* Consider your use case when setting

#### **Related Parameters**

* [`&chunked`](and-chunked.md) - Enables chunked transmission mode
* [`&buffer`](../view-parameters/buffer.md) - Viewer-side buffer control
* [`&nochunk`](../settings-parameters/and-nochunked.md) - Disables chunked mode
* [`&retransmit`](../settings-parameters/and-retransmit.md) - Relay chunked streams