---
description: Custom video codec for broadcasts
---

# \&webp

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

{% hint style="info" %}
V22: Sender-Side Option! ([`&push`](../../source-settings/push.md))
{% endhint %}

## Aliases

* `&images`

## Options

Example: `&webp=jpeg`

| Value            | Description       |
| ---------------- | ----------------- |
| (no value given) | webp image format |
| `jpeg`           | jpeg image format |

## Details

#### Changes on Version 22 of VDO.Ninja

The `&webp` mode has been modified a bit. Main change is that you now enable it by add `&webp` to the sender's URL, and [`&codec=webp`](codec.md) to the viewer's URL (otherwise, it falls back to normal video mode). No need for [`&broadcast`](broadcast.md) anymore. (as a reminder, this mode sends the video as a series of low-quality images, rather than a more efficient video stream).

I've removed the toggle in the director's room for this `&webp` feature, as [`&chunked`](../../newly-added-parameters/and-chunked.md) mode is replacing its purpose there, but you might still want to use this mode when the viewer-side does not support video playback or hardware acceleration. Specifically, this option lets you bring motion images (aka, crude video) into the streamlabs mobile app, as a browser source, where other forms of video decoding is not supported.

#### Version 21 and backwards

In Version 21 and backwards it must be used with [`&broadcast`](broadcast.md) on the viewer side but the director doesn't need to be the designated broadcaster.

The Electron Capture app should work to allow for webp-based broadcasting even if the tab is not visible, as tab throttling is disabled with that application.\
This is essentially a stream of webp-based images sent over the webRTC data-channels.\
The quality by default is limited in both frame rate and resolution, as this custom video codec is very inefficient at higher resolutions and frame-rates.

Based on my testing, the webp mode is only efficient if you are keeping the bitrates under like 2 mbps, so the higher qualities make little sense IMO outside of some niche use cases as they use up a lot of bandwidth.

If you have issues with Webp-mode, or find the quality or CPU savings not sufficient, you can check out the [`&meshcast`](../../newly-added-parameters/and-meshcast.md) integration instead. It's a relatively new supported addition to VDO.Ninja.

#### Details

Default quality is 270p @ 10-fps webp. You can change this with [`&webpquality`](webpquality.md) to increase resolution and max frame rate.

The default frame rate is a target, but if the connection cannot keep up, a lower frame rate will be used. This ensures the lowest latency possible.

Compression quality is set to 66% in all cases. This seems the best bang for buck.

This mode can work with audio, which uses the normal audio mode for transport.  Audio and these motion images stay roughly in sync.

{% content-ref url="../../guides/iframe-api-documentation.md" %}
[iframe-api-documentation.md](../../guides/iframe-api-documentation.md)
{% endcontent-ref %}

{% embed url="https://www.youtube.com/watch?v=-7QsLChfdsE" %}

## Related

{% content-ref url="webpquality.md" %}
[webpquality.md](webpquality.md)
{% endcontent-ref %}

{% content-ref url="codec.md" %}
[codec.md](codec.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
