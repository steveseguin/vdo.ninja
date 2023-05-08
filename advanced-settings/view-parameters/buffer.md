---
description: Sets the video buffer
---

# \&buffer

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&buffer=500`

| Value           | Description |
| --------------- | ----------- |
| (numeric value) | delay in ms |

## Details

This feature will increase the size of the audio and video _playout delay_ by means of tweaking the webRTC _jitter buffer_ pipeline (or a related buffer).

This can effectively be used as a way to delay the incoming video and audio by upwards of around 15-seconds. It's compatible with modern Chromium-based browsers.

While in theory this option can also help to improve video and audio quality, as a larger playback buffer can help reduce the effects of network jitter and packet loss, it's not a miracle solution in this regard. Adding 200-ms of buffer delay using this feature is worth trying however, as some users have reported it has helped improve their connections.

While one might think adding 10-seconds of buffer would then only improve the connection further, at this point it doesn't really. Work is being done to change this however, such as the work related to the `&chunked` transfer mode, which will work quite well with extended buffer times.

#### Example values

`&buffer=0` will force the audio to be in sync with the video, with the video playing back with minimal delay.

`&buffer=100` will add a 100-ms time delay to the video, on top of any existing delay.

`&buffer=200` can help reduce video problems, such as frame jitter, with 200-ms of added delay.

{% hint style="warning" %}
* This feature will only work if playing the video in Chrome or Chromium-based browsers of around version 80 and newer.
* OBS v27.1.3 or older (on PC) uses v75 though, so you will need to update to OBS 27.2 or newer to use it there.
* The Electron Capture app also supports the `&buffer` command, along with vMix using a compatible Chromium version.
* Using the `&buffer` command may stop [Echo Cancellation](../../source-settings/aec.md) from working due to the audio delay this feature produces.
{% endhint %}

{% hint style="info" %}
You can refer to the [`&sync`](sync.md) command if you wish to delay the audio, relative to the video. `&buffer` will try to keep the audio and video in sync, which might always be desired.
{% endhint %}

## Update in [v23](../../releases/v23.md)

The option to right click a remote video and add/adjust the [`&buffer`](buffer.md) delay for that specific video dynamically.\
![](<../../.gitbook/assets/image (173).png>)

## Related

{% content-ref url="../video-parameters/and-buffer2.md" %}
[and-buffer2.md](../video-parameters/and-buffer2.md)
{% endcontent-ref %}

{% content-ref url="sync.md" %}
[sync.md](sync.md)
{% endcontent-ref %}
