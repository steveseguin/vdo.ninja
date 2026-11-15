---
description: Makes the background transparent
---

# \&transparent

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&transparency`

## Details

Makes the background for the website transparent using CSS.

This clears the page background; it does not remove a background from the video or create an alpha channel. For transparent Spout2 video from Game Capture, use its **Browser** alpha mode and a `https://vdo.ninja/alpha/` viewer link with `&transparent`. See the [transparent video guide](../../guides/how-to-stream-transparent-video.md).

The browser source in OBS already has a transparent background by default.

This is useful for embedding VDO.Ninja as an [IFRAME](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe).\
Not helpful with the Electron Capture app.\
Not needed for OBS if using default OBS CSS stylesheet:

```css
body {
    background-color: rgba(0, 0, 0, 0);
    margin: 0px auto;
    overflow: hidden;
}
```

## Related

A video demo of the [`&chunked`](../../newly-added-parameters/and-chunked.md) transfer and how to enable support for alpha-channel transparency is available here: [https://youtu.be/SWDlm1Jf-Oo](https://youtu.be/SWDlm1Jf-Oo)

{% content-ref url="chroma.md" %}
[chroma.md](chroma.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
