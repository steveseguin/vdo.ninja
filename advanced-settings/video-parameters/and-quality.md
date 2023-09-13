---
description: Presets the quality setting for a guest
---

# \&quality

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&q`

## Options

Example: `&quality=0`

| Value                   | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `0` \| (no value given) | about 1080p60, depending on hardware                                      |
| `1`                     | about 720p60, depending on hardware                                       |
| `2`                     | about 360p30, depending on hardware                                       |
| `-1` (device's default) | useful in allowing the screen share at the same resolution as the display |

## Details

Presets the "quality" setting for a guest. Not "strict" and is less likely to give errors than explicit resolution requests.

Without using `&quality` on the URL a guest can change the "quality" when setting up the camera:\
![](<../../.gitbook/assets/image (4) (1) (2) (1).png>)

Use [`&width`](../../source-settings/and-width.md) and [`&height`](../../source-settings/and-height.md) to get a higher resolution than 1920x1080.

There is a toggle in the director's room guest's invite link customization which adds `&q`:\
![](<../../.gitbook/assets/image (98) (1).png>)

## Related

{% content-ref url="../../source-settings/screensharequality.md" %}
[screensharequality.md](../../source-settings/screensharequality.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-mediasettings.md" %}
[and-mediasettings.md](../../newly-added-parameters/and-mediasettings.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-width.md" %}
[and-width.md](../../source-settings/and-width.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-height.md" %}
[and-height.md](../../source-settings/and-height.md)
{% endcontent-ref %}
