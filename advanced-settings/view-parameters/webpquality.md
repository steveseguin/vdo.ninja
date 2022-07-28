---
description: Quality setting for the &webp option
---

# \&webpquality

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

{% hint style="info" %}
V22: Sender-Side Option! ([`&push`](../../source-settings/push.md))
{% endhint %}

## Aliases

* `&webpq`
* `&wq`

## Options

| Value | Description    |
| ----- | -------------- |
| 0     | 1080p          |
| 1     | 720p           |
| 2     | 540p           |
| 3     | 360p           |
| 4     | 270p           |
| 5     | 270p @ 15-fps  |
| 6     | 270p @ 5-fps   |
| 7     | 270p @ 2.5-fps |
| 8     | 360p @ 1-fps   |

## Details

You add this parameter to the director (or designated broadcaster) and it then sets the the quality target for the [`&webp`](../../advanced-settings.md#webp) mode.

Default is 270p @ 10-fps.

Compression quality is set to 66% in all cases. This seems the best bang for buck. Unless specified, this is also webp.

## Related

{% content-ref url="webp.md" %}
[webp.md](webp.md)
{% endcontent-ref %}
