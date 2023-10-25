---
description: PCM audio recordings
---

# \&pcm

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Details

Video recordings will be saved as Video + PCM audio format.

### Converting and playing back WebM-PCM

WebM is a universal container of sorts when used within a Chromium browser, but it doesn't always work well for VLC or popular video editors. FFmpeg can be used to convert to other formats though, including MP4 and WAV, typically without transcoding.

To make converting from WebM to other formats easier, a version of FFmpeg is hosted within VDO.Ninja for this. It can be located here at [https://vdo.ninja/convert](https://vdo.ninja/convert), with several of the most common conversion options ready to go, such as WebM-PCM to WAV-PCM.

Due to memory limits and other browser limitations, this FFmpeg tool can only process files under about 2-gigabytes in size. For larger files, you may need to download and use a desktop version of [FFmpeg](https://ffmpeg.org/download.html) instead.

FFmpeg command lines are provided if you choose to run FFmpeg yourself locally, but if that is still to complicated, you can grab [Handbrake ](https://handbrake.fr/)for free; it's a GUI-based option that is fairly accessible.

## Related

{% content-ref url="and-record.md" %}
[and-record.md](and-record.md)
{% endcontent-ref %}
