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
| `0` \| (no value given) | targets about 1920x1080, depending on hardware                            |
| `1`                     | targets about 1280x720, depending on hardware                             |
| `2`                     | targets about 640x360, depending on hardware                              |
| `-1` (device's default) | useful in allowing the screen share at the same resolution as the display |

## Details

Presets the target resolution for a guest. It is not strict and is less likely to give errors than explicit resolution requests.

If `&quality` is omitted entirely, VDO.Ninja selects an initial quality tier using the device type, available CPU cores, reported memory, and whether the guest is joining a room. The default is therefore not always 720p. The camera and browser determine the actual frame rate unless [`&fps`](and-fps.md) or [`&maxframerate`](../../source-settings/and-maxframerate.md) is set.

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
