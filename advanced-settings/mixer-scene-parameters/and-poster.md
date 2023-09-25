---
description: Lets you specify a poster image for videos that have not yet started playing
---

# \&poster

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&poster=./media/bg_sample.webp`

| Value         | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| (encoded URL) | takes an encoded URL, pointing to a CORS-accessible image file |

## Details

`&poster` lets you specify a poster image for videos that have not yet started playing (using the built-in HTML poster attribute). This flag takes an encoded URL, pointing to a CORS-accessible image file.

Example of the command:

```
https://vdo.ninja/?view=YbFmisR&poster=./media/bg_sample.webp&hideplaybutton
```

## Related

{% content-ref url="and-hideplaybutton.md" %}
[and-hideplaybutton.md](and-hideplaybutton.md)
{% endcontent-ref %}
