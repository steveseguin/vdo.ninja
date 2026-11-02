---
description: Presets the quality setting for a guest
---

# \&quality

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&q`

## Options

Examples: `&quality=4K`, `&quality=fullhd`, or `&q=720p`.

| Value | Equivalent values | Target resolution |
| --- | --- | --- |
| `-2` | `4k`, `2160p`, `2160` | 3840x2160 (4K UHD) |
| `-3` | `2k`, `1440p`, `1440` | 2560x1440 |
| `0` | `fullhd`, `1080p`, `1080`, `high`, or no value | 1920x1080 (Full HD) |
| `1` | `hd`, `720p`, `720` | 1280x720 |
| `2` | `360p`, `360`, `low` | 640x360 |
| `-1` | | Device/browser default, with no resolution constraint from this preset; useful for sharing a screen at its native resolution |
| `3` or higher | | Uses the low camera preset (`2`); targets 320x180 for screen sharing |

Named values are case-insensitive: `4K` and `4k` are equivalent. For Full HD, use `fullhd` or `1080p`; `fhd` is not a supported value.

`&quality` or `&q` without a value selects `0`. Omitting the parameter entirely uses automatic defaults.

The standalone shortcuts `&4k`, `&fullhd`, and `&1080p` also select their respective presets. Use these parameter names in lowercase.

## Details

Presets the target resolution for a guest. It is not strict and is less likely to give errors than explicit resolution requests.

If `&quality` is omitted entirely, VDO.Ninja selects an initial quality tier using the device type, available CPU cores, reported memory, and whether the guest is joining a room. The default is therefore not always 720p. The camera and browser determine the actual frame rate unless [`&fps`](and-fps.md) or [`&maxframerate`](../../source-settings/and-maxframerate.md) is set.

Without using `&quality` on the URL a guest can change the "quality" when setting up the camera:\
![](<../../.gitbook/assets/image (4) (1) (2) (1).png>)

Use `&quality=1440p` or `&quality=4k` for resolutions above 1080p. Actual capture resolution depends on the camera, browser, and hardware. Use [`&width`](../../source-settings/and-width.md) and [`&height`](../../source-settings/and-height.md) when you need explicit dimensions instead of a preset.

For screen sharing, [`&screensharequality`](../../source-settings/screensharequality.md) overrides `&quality` without changing camera quality.

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
