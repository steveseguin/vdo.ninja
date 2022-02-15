---
description: Record functionality for guests
---

# \&record

## Options

| Value              | Description                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| 0                  | No video recorded; audio tentatively recorded as 32bit PCM lossless.                              |
| (negative integer) | No video recorded; audio recorded as {integer} kbps OPUS file. Eg: -120 - Audio only at 120 kbps. |
| (integer)          | Recored video bitrate in kbps.                                                                    |

## Details

### Recorded file properties

**`File format`**` ``- WebM.` &#x20;

**`File Codec:`**` ``H264 or VP8 for video; OPUS or PCM for audio.` &#x20;

Usually up to the browser.&#x20;

Default bitrate will record at around 6000 kbps, but it will still prompt still for value if not set.

The Director of a room will be notified if a user is recording and they can start/stop the recording.\
The Director of a room can trigger the record function remotely, even if the \&record parameter has not been added.

The video/audio will be saved in real-time to the guest's local download folder.

Do not close the browser or turn off the computer while it is recording; you may lose the file or have a partial capture.

The recording should stop automatically when the guest hangs-ups manually.

It will automatically capture with Stereo audio and echo cancellation off, if available. You can use [https://obs.ninja/convert](https://obs.ninja/convert) to convert from WebM file formats to opus or wav file formats, **without transcoding and without downloads**.

### Bitrate Thresholds

| Threshold      | Inbound Audio | Recorded audio |
| -------------- | ------------- | -------------- |
| 4000           | 128 kpbs      | 128 kpbs       |
| 2500           | 80 kbps       | 128 kpbs       |
| Less than 2500 | 32 kbps       | 32 kbps        |

{% hint style="info" %}
When recording with PCM, ([`&pcm`](and-pcm.md)) the inbound audio bitrate will be at 256kbps. (regardless of video bitrate)
{% endhint %}

## Related

{% content-ref url="and-recordcodec.md" %}
[and-recordcodec.md](and-recordcodec.md)
{% endcontent-ref %}

{% content-ref url="and-pcm.md" %}
[and-pcm.md](and-pcm.md)
{% endcontent-ref %}
