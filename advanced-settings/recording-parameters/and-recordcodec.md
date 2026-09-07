---
description: Lets you set the video recording codec
---

# \&recordcodec

Sender-Side Option / Director Option! ([`&push`](../../source-settings/push.md), [`&director`](../../viewers-settings/director.md))

## Aliases

* `&rc`

## Options

Example: `&recordcodec=h264`

<table><thead><tr><th width="139">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>h264</code></td><td>request the h264 codec </td></tr><tr><td><code>vp8</code></td><td>request the VP8 codec </td></tr><tr><td><code>vp9</code></td><td>request the VP9 codec</td></tr><tr><td><code>av1</code></td><td>request the AV1 codec</td></tr><tr><td><code>mp4</code></td><td>request the MP4 container with browser-selected codecs</td></tr></tbody></table>

## Details

### MP4 recording

Use `&record=12000&recordcodec=mp4` to request an MP4 recording. `&rc=mp4` is the shorter alias. Add `&splitrecording=1` for independent one-minute disk-only segments.

This selects the MP4 container and lets the browser choose its supported codecs. Safari 26 on a real iPhone produced H.264 video and AAC audio in testing. The option changes recording output, not the live WebRTC codec or bitrate. Defaults remain unchanged.

Short real-iPhone tests verified intact saved MP4 files and native player recognition. A longer Safari 26.6 attempt produced eight independently decodable one-minute encoder segments at 1080p/~30 FPS, but BrowserStack control timed out before final download and native playback checks. Full 15-minute saved-file/playback qualification remains pending; these results do not establish long-session reliability or lip sync.

A focused follow-up retrieved both actual MP4 downloads, verified their bytes, and played both to the end in Safari with fullscreen active. The managed device's Files app was unavailable, so this does not certify opening the files through Files/Quick Look. MP4 remains opt-in.

| Situation | Outcome |
| --- | --- |
| Browser supports MP4 recording | Requests `video/mp4` and saves `.mp4` files. |
| MP4 recording is unsupported, including tested Firefox | Uses the existing recording fallback, normally WebM. Check the saved extension. |
| MP4 constructor fails and WebM is supported | Local recording retries WebM and saves `.webm`. |
| PCM or audio-only recording | Keeps the existing PCM/audio path; this MP4 video option does not override it. |
| `&recordcodec=h264` | Requests H.264 in the existing WebM path; it does not select MP4. |

Use MP4 when your player/editor needs it, especially for Apple native playback. It does not fix Android H.264 timing problems or guarantee a requested bitrate/frame rate. Browser support and encoder behavior still need qualification for the device in use.

Adding `&recordcodec` to a source or director link controls video recording output (saving to disk mode; aka [`&record`](and-record.md)). Codec values such as `h264` and `vp8` use the existing WebM path, with browser-dependent fallback. The special value `mp4` selects the MP4 container as described above. Unsupported choices fall back; verify the resulting file format.

As a guest or source side don't forget to add [`&record`](and-record.md) to the URL to get the record button.

## Older Android phones

Try `&quality=1&recordcodec=vp8` first if high-resolution recording struggles. `&quality=1` requests 720p capture, so it also changes the source used for streaming.

In September 2026 testing on a Pixel 4a running Chrome 151, native-camera recording at a requested 12 Mbps achieved approximately 20 FPS at 720p with VP8, versus 9 FPS at 1080p. H.264 improved native 1080p cadence to approximately 20 FPS, but a separate controlled 720p H.264 test repeatedly developed multi-second A/V drift. The H.264/Opus WebM file also failed to play in Google Photos on that phone despite decoding in FFmpeg.

These are device-specific results, not browser-wide guarantees. Before choosing H.264, test a saved file for synchronization and compatibility with your intended player or editor. Existing defaults remain unchanged.

A follow-up on Chrome 152 reproduced the H.264 drift with bare MediaRecorder, without VDO.Ninja or streaming. VP8 stayed stable in the same controlled-source test. Changing the app's recording writer would not address that reproduced browser-path problem.

On Safari 26, WebM recording support also does not guarantee playback in Apple's native Quick Look: an iPhone test saved an intact VP8/Opus WebM file, but Quick Look offered file information without playback. An older Safari 16 iPad selected MP4 automatically and its saved file played in Quick Look.

## Related

{% content-ref url="and-record.md" %}
[and-record.md](and-record.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/codec.md" %}
[codec.md](../view-parameters/codec.md)
{% endcontent-ref %}

{% content-ref url="and-pcm.md" %}
[and-pcm.md](and-pcm.md)
{% endcontent-ref %}
