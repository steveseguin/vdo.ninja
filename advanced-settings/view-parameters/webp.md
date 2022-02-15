---
description: Custom video codec for broadcasts
---

# \&webp

## Details

Must be used with [`&broadcast`](broadcast.md), but the director doesn't need to be the designated broadcaster.

The Electron Capture app should work to allow for webp-based broadcasting even if the tab is not visible, as tab throttling is disabled with that application.\
This is essentially a stream of webp-based images sent over the webRTC data-channels.\
The quality by default is limited in both frame rate and resolution, as this custom video codec is very inefficient at higher resolutions and frame-rates.

Based on my testing, the webp mode is only efficient if you are keeping the bitrates under like 2 mbps, so the higher qualities make little sense IMO outside of some niche use cases as they use up a lot of bandwidth.

If you have issues with Webp-mode, or find the quality or CPU savings not sufficient, you can check out the [Meshcast.io](https://meshcast.io) integration instead. It's a relatively new supported addition to VDO.Ninja

{% content-ref url="../../guides/iframe-api-documentation.md" %}
[iframe-api-documentation.md](../../guides/iframe-api-documentation.md)
{% endcontent-ref %}

{% embed url="https://www.youtube.com/watch?v=-7QsLChfdsE" %}

## Related

{% content-ref url="broadcast.md" %}
[broadcast.md](broadcast.md)
{% endcontent-ref %}

{% content-ref url="webpquality.md" %}
[webpquality.md](webpquality.md)
{% endcontent-ref %}
