---
description: Split local recordings into smaller files, with browser behavior, automatic mobile limits, and cloud compatibility.
---

# &splitrecording

Add this option to the browser that performs the recording. It periodically saves a file and continues recording, reducing how much unfinished media is at risk if the browser stops.

{% hint style="info" %}
Older deployments may save continuation parts instead of standalone videos. Check the filenames against the table below and keep all parts until you have opened or reassembled the recording.
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

Stopping waits for the final media data and pending writes. Allow the browser's download to finish before closing the tab. Splitting can introduce a brief capture gap; it is not frame-perfect uninterrupted recording. The source tracks stay active for live publishing.

## Saving on mobile devices

Safari may save MP4 or WebM depending on the supported codecs and browser version. Before a session, save a short recording and open the downloaded file in the player or editor you will use.

Browsers that buffer downloads in memory retain each part until it is saved. For high-bitrate mobile recordings, use a shorter interval such as `&splitrecording=1` to reduce memory use per part.

## Related options

- [`&record`](and-record.md): show the recording control and request a recording bitrate.
- [`&autorecord`](and-autorecord.md): start recording automatically.
- [`&recordcodec`](and-recordcodec.md): request a supported recording codec.
- [Recording video with consistent results](../../guides/recording-video-with-consistent-results.md): local versus received-stream recording and network considerations.
