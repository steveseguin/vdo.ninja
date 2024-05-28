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

This feature will increase the size of the audio and video _playout delay_ by means of tweaking the webRTC _jitter buffer_ pipeline (or a related buffer).&#x20;

This can effectively be used as a way to delay the incoming video and audio by around 4-seconds. It's compatible with modern Chromium-based browsers, likely Firefox, but not Safari.

While in theory this option can also help to improve video and audio quality, as a larger playback buffer should help reduce the effects of network jitter and packet loss, it's not a miracle solution in this regard. Adding 200-ms of buffer delay using this feature is worth trying however, as some users have reported it has helped improve their connections.

The problem is that the browser doesn't fully make use of the available buffer if set high, and so it's largely used as mainly a hint. Network conditions, memory limits and other factors may impact the results as well. \
\
Older versions of Chromium allowed upwards of 15-seconds of buffering, with recent versions of Chromium allowing up to just 4-seconds.&#x20;

### Chunked-mode

If using the `&chunked` transfer mode, the method and function of the `&buffer` option is different than normal. There is not hard coded limit on what delay you can add, as it that uses it a custom buffering solution that isn't controlled by the browser. You can set the delay to be whatever you want; minutes even, assuming you have the memory for it.

Using `&buffer` with `&chunked` mode can improve quality, however more than a few seconds is probably not advisable.

#### Example values

`&buffer=0` will force the audio to be in sync with the video, with the video playing back with minimal delay.

`&buffer=100` will add a 100-ms time delay to the video, on top of any existing delay.

`&buffer=200` can help reduce video problems, such as frame jitter, with 200-ms of added delay.

{% hint style="warning" %}
* This feature will only work if playing the video in Chrome or Chromium-based browsers of around version 80 and newer.
* OBS v27.1.3 or older (on PC) uses v75 though, so you will need to update to OBS 27.2 or newer to use it there.
* The Electron Capture app also supports the `&buffer` command, along with vMix using a compatible Chromium version.
* Using the `&buffer` command may stop [Echo Cancellation](../../source-settings/aec.md) from working due to the audio delay this feature produces.
* Beyond 3-seconds of buffering may cause audio/video sync issues.
{% endhint %}

{% hint style="info" %}
You can refer to the [`&sync`](sync.md) command if you wish to delay the audio, relative to the video. `&buffer` will try to keep the audio and video in sync, which might always be desired.
{% endhint %}

## Chunked mode

When using \&buffer with a stream that is being sent using chunked-mode ([\&chunked](../../newly-added-parameters/and-chunked.md)), the method of buffering will be different as it doesn't rely on the built-in system playout webRTC buffer delay function.

The practical benefit of using \&chunked mode with \&buffer is that you can have buffers that are minutes long, up to whatever your system's resources can handle.

As well, the buffering works to buffer the stream, in a way similar to HLS or RTMP buffering.\
\
The default buffer is around 1-second actually when using \&chunked mode, as it requires a buffer to avoid playback issues. If the buffer underruns, the stream may fail.

Please refer to \&chunked mode for more details, but it could be an option for you if your goal is to improve the quality of streams when facing high-packet loss. It's only compatible with Chromium-based browsers; not Firefox or Safari as of yet.

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
