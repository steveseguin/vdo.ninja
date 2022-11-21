---
description: Record functionality for guests
---

# \&record

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

| Value              | Description                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `0`                | No video recorded; audio tentatively recorded as 32bit PCM lossless.                              |
| (negative integer) | No video recorded; audio recorded as {integer} kbps OPUS file. Eg: -120 - Audio only at 120 kbps. |
| (positive integer) | Recored video bitrate in kbps.                                                                    |

## Details

### Recorded file properties

**`File format`**` ``- WebM.` &#x20;

**`File Codec:`**` ``H264 or VP8 for video; OPUS or PCM for audio.` &#x20;

Usually up to the browser.

Default bitrate will record at around 4000 kbps, but it will still prompt still for value if not set.

The Director of a room will be notified if a user is recording and they can start/stop the recording.\
The Director of a room can trigger the record function remotely, even if the \&record parameter has not been added.

The video/audio will be saved in real-time to the guest's local download folder.

Do not force-close the browser or turn off the computer while it is recording; you may lose the file or have a partial capture.

The recording should stop automatically when the guest hangs-ups manually. I try my best to do the same when the browser is closed, but it's best to still purposefully stop recording first.

It will automatically capture with stereo audio and echo cancellation off, if available. You can use [https://isolated.vdo.ninja/convert](https://isolated.vdo.ninja/convert) to convert from WebM file formats to opus or wav file formats, **without transcoding and without downloads**.

### Recording as the director

When recording as the director, the button and option to record each guest is available by default.  It's hidden behind Advanced controls. You have the option to record locally, to your own disk, or record remotely, directly to the remote guest's local storage.\
\
When recording to the guest's local storage, quality should be near pristine, given as its not being sent via the Internet first.  Recording locally, the video may have dynamic resolutions and varying quality, due to the low latency transmission. ([`&chunked`](../../newly-added-parameters/and-chunked.md)-mode excepted)

Anyone can also access the recording options via right-clicking a video. This option is available as of VDO.Ninja v22.

![](<../../.gitbook/assets/image (102) (1) (1).png>)![](<../../.gitbook/assets/image (101) (1).png>)

### Bitrate Thresholds

| Threshold      | Inbound Audio | Recorded audio |
| -------------- | ------------- | -------------- |
| 4000           | 128 kpbs      | 128 kpbs       |
| 2500           | 80 kbps       | 128 kpbs       |
| Less than 2500 | 32 kbps       | 32 kbps        |

### When using [`&chunked`](../../newly-added-parameters/and-chunked.md) mode

When the sender of a stream is using the `&chunked` mode, recording their video will save the inbound video directly to disk without transcoding. Not needing to transcode the saved video in the browser is only possible with the `&chunked` mode. Of course, you also don't have the option to increase the bitrate or change codecs when using this mode; at least not as the viewer.

The chunked mode (as of June 2022) is still a maturing feature. Please report any issues and provide feedback.

### Please note:

{% hint style="info" %}
When recording with PCM, ([`&pcm`](and-pcm.md)) the inbound audio bitrate will be at 256-kbps. (regardless of video bitrate)
{% endhint %}

{% hint style="warning" %}
* If recording with an Nvidia/AMD graphics card installed on your computer, ensure your drivers are up to date or try recording with VP8-codec instead. Hardware-encoding might reduce CPU load, but it can also result in discolored video if the driver is buggy.
* Safari browsers and iOS devices may struggle with media recording.
* Enabling Safari's _MediaRecorder_ under E_xperimental webKit Features_ may be needed. As well, users may be asked to download a file once the recording ends, for the webM media file to be saved correctly to disk.
{% endhint %}

## Related

{% content-ref url="and-recordcodec.md" %}
[and-recordcodec.md](and-recordcodec.md)
{% endcontent-ref %}

{% content-ref url="and-autorecord.md" %}
[and-autorecord.md](and-autorecord.md)
{% endcontent-ref %}

{% content-ref url="and-pcm.md" %}
[and-pcm.md](and-pcm.md)
{% endcontent-ref %}
