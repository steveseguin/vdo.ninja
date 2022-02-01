---
description: Makes the background transparent
---

# \&transparent

## Aliases

* `&transparency`

## Details

Makes the background for the website transparent using CSS.

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

A video demo of the [`&chunked`](../newly-added-parameters/and-chunked.md) transfer and how to enable support for alpha-channel transparency is available here: [https://youtu.be/SWDlm1Jf-Oo](https://youtu.be/SWDlm1Jf-Oo)

{% content-ref url="chroma.md" %}
[chroma.md](chroma.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
