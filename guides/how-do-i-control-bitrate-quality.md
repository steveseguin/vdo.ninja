# How to control bitrate/quality

## Video Bitrate

The bitrate controls are accessible via a URL parameter that can be added to the VIEW link.

Something like [https://vdo.ninja/?view=yyyyy\&bitrate=10000 ](https://vdo.ninja/?view=yyyyy\&bitrate=10000)will let the viewer request set a 10-mbps bitrate; up to around 20000-kbps is reasonable, but higher is possible in situations. The value is in kilobits per second and the default bitrate is 2500-kbps.

The viewer sets the bitrate generally, although you can set maximum allowed bitrates as the publisher of a stream. See the advanced settings in the wiki for more help here; there are many options available.

When in a group room, the guests will generally get a very low-quality preview of the stream. This can be changed with the [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) parameter or via the room's director settings menu. The higher the room bitrate however, the more CPU and Network load will be placed on those in the room.

When dealing with a group scene link, you can use [`&bitrate`](../advanced-settings/video-bitrate-parameters/bitrate.md) as normal, or `&totalbitrate`. There are many [other ways to control bitrates](how-do-i-control-bitrate-quality.md#more-details), in both rooms and push links, with these being the standard options.

## Resolution

Camera resolution by default is captured at 1280x720. You can increase this by changing the quality setting when selecting your camera, or by adding `&quality=0` to the URL. The [`&quality`](../advanced-settings/video-parameters/and-quality.md) parameter acts as a preset, where \&quality=0 is preset for 1920x1080 @ 60-fps, `&quality=1` is 720p60, and `&quality=2` is a gentle 360p30.

You can manually set the video resolution via the URL, using `&width=1920&height=1080`, and this might be helpful when dealing with non-standard aspect-ratios.

{% hint style="info" %}
If using the OBS Virtual Camera as a source, be sure to activate it in OBS before trying to access it with VDO.Ninja with non-standard resolutions set.
{% endhint %}

The resolution can also be set on the viewer-side via the `&scale=100` parameter. This scales down the resolution, as a percentage, based on the original camera capture resolution.&#x20;

By default, VDO.Ninja will try to optimize and scale down the incoming resolution to fit the viewer's window size, but sometimes you might want to disable this. Adding `&scale=100` to the view link can achieve that, as it forces 100% scale, or no scaling in other words.

VDO.Ninja may still scale the video down however, although only if the connection between the two peers is having network issues, if the sender's encoder is having issues, or if the set bitrate is too low to sustain the higher resolution.

## Audio

You can improve audio quality in the same way, by increasing the [`&audiobitrate`](../advanced-settings/view-parameters/audiobitrate.md), but you can get better results by just disabling noise and echo cancellation instead.

[`&proaudio`](../general-settings/stereo.md) is flag that presets many audio options, which can be added to both the sender's and viewser's link to enable stereo audio with no audio processing and a very high audio bitrate set. You may need to be using headphones, especially if in a group room, if using [`&proaudio`](../general-settings/stereo.md) or if disabling the echo cancellation features.

## More Details

{% content-ref url="video-bitrate-for-push-view-links.md" %}
[video-bitrate-for-push-view-links.md](video-bitrate-for-push-view-links.md)
{% endcontent-ref %}

{% content-ref url="video-bitrate-in-rooms.md" %}
[video-bitrate-in-rooms.md](video-bitrate-in-rooms.md)
{% endcontent-ref %}

{% content-ref url="audio-filters.md" %}
[audio-filters.md](audio-filters.md)
{% endcontent-ref %}
