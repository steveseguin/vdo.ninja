---
description: Makes the background transparent
---

# \&transparent

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

{% content-ref url="chroma.md" %}
[chroma.md](chroma.md)
{% endcontent-ref %}
