---
description: Split local recordings into smaller files, with browser behavior, automatic mobile limits, and cloud compatibility.
---

# &splitrecording

Add this option to the browser that performs the recording. It periodically saves a file and continues recording, reducing how much unfinished media is at risk if the browser stops.

{% hint style="info" %}
The independent-file behavior and automatic mobile size target below describe the recorder update qualified in September 2026. Use a deployment containing that update. Older versions produce continuation parts that need reassembly; pushing source changes does not establish availability on every hosted version.
{% endhint %}

## Options

| Option or situation | Interval | Outcome and use case |
| --- | --- | --- |
| `&record&splitrecording` | Five minutes | Explicit split interval for longer recordings |
| `&record&splitrecording=1` | One minute | Smaller files for mobile devices or high recording bitrates |
| `&record&splitrecording=10` | Ten minutes | Fewer, larger downloads; needs more memory on browsers that buffer the file |
| iPhone/iPad with `record` or `autorecord`, without `splitrecording` | Up to five minutes, shortened to an estimated 100 MiB per part | About 66 seconds at a requested 12 Mbps; retains encoder quality |
| Desktop Safari with `record` or `autorecord`, without `splitrecording` | Ten minutes | Automatic splitting; no mobile size adjustment |
| Chrome/Firefox without `splitrecording` | No automatic interval from this option | Add an explicit interval when smaller files are wanted |

Values are whole minutes. Bare `splitrecording` uses five minutes. An explicit value overrides the automatic mobile size estimate. The estimate uses the encoder's reported video and audio bitrate; variable bitrate means it is not a hard byte limit. Cloud continuation recordings retain their existing interval behavior.

Example publisher URL:

```text
https://vdo.ninja/?push=YOUR_STREAM_ID&record=12000&splitrecording=1
```

`record=12000` requests approximately 12 Mbps video; it does not guarantee the achieved bitrate or change the live stream's bitrate. File size depends on encoded bitrate and duration, not resolution alone.

## Standalone files and cloud continuation parts

| Recording path | File behavior | What to do |
| --- | --- | --- |
| Updated disk-only recorder | Every segment has its own container header, such as `recording.webm`, `recording_1.webm` or `recording_1.mp4` | Open each file independently. To combine them, use an editor or container-aware concatenation. Do not simply append the bytes. |
| The same recording also feeds Dropbox or Google Drive | The encoder stays continuous; local files retain names such as `recording.webm_1` | Keep every part and reassemble them in order. These are not independent videos. |
| Older recorder versions | Later parts can lack independent headers | Keep all continuation parts for reassembly. |

For **continuation parts only**, Windows Command Prompt can reconstruct the original container:

```bat
copy /b recording.webm+recording.webm_1+recording.webm_2 output.webm
```

Stopping waits for the final media data and pending writes. The updated recorder does not begin a download until that segment emits media, avoiding empty files when Stop coincides with a split. Allow the browser's download to finish before closing the tab. Splitting can introduce a brief capture gap; it is not frame-perfect uninterrupted recording. The source tracks stay active for live publishing.

## Browsers and qualification

| Browser | Validated behavior and limits |
| --- | --- |
| Chrome desktop and Android | Pixel 4a/9a completed 20-minute native recordings through UDP loss, blackout and recovery. Media-bearing Downloads files matched device checksums, decoded fully, and opened in Android's native viewer. An empty split-boundary file found on the 4a was fixed and retested. |
| Firefox desktop | Native MediaRecorder lifecycle and WebM audio/video work. A BrowserStack run encoded about 17 FPS both with the app and bare MediaRecorder; a local Windows comparison also reproduced 15-16 FPS without loading VDO.Ninja. This is not a universal Firefox limit. |
| Safari 26 on iPhone | Nearly 16 minutes at approximately 12 Mbps with one-minute parts completed and all encoded parts decoded. A five-minute-part run crashed WebKit near 15 minutes, motivating smaller automatic mobile parts. |
| Safari 15.5 on iPad 9th generation | More than ten minutes of native H.264/AAC recording produced independently decodable parts. Actual scene bitrate was about 1.9 Mbps despite the higher request. |

Safari may use MP4 or WebM depending on the supported codecs and browser version. Its Blob fallback retains a part in memory until saving; completed Blob URLs are released after a download grace period. Apple Files-app persistence, background recording, low-storage behavior and hour-long sessions are separate checks. BrowserStack media decoding alone does not verify an OS-level save.

The Pixel 4a test camera supplied only about 6-9 FPS at 1080p in the tested scene, and its video ended 0.5-0.8 seconds before audio. Successful file saving does not establish smooth capture or tight A/V sync on that device. The 9a supplied and recorded about 15 FPS, with end timestamps within 70 ms. Camera settings and requested bitrate are not guarantees of achieved frame rate or timing.

## Related options

- [`&record`](and-record.md): show the recording control and request a recording bitrate.
- [`&autorecord`](and-autorecord.md): start recording automatically.
- [`&recordcodec`](and-recordcodec.md): request a supported recording codec.
- [Recording video with consistent results](../../guides/recording-video-with-consistent-results.md): local versus received-stream recording and network considerations.
