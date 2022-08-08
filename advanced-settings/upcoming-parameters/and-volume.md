---
description: Sets the 'default' playback volume for all video elements
---

# \&volume

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&vol`

## Options

| Value   | Description                      |
| ------- | -------------------------------- |
| (0-100) | audio playback volume in percent |

## Details

`&volume` can set the 'default' playback volume for all video elements in VDO.Ninja. Currently the range is 0 to 100 and other volume commands or mute states may override this value. The default is 100.

![](<../../.gitbook/assets/image (123).png>)

`&volume=50`

## Related

{% content-ref url="../audio-parameters/and-audiogain.md" %}
[and-audiogain.md](../audio-parameters/and-audiogain.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/autogain.md" %}
[autogain.md](../../source-settings/autogain.md)
{% endcontent-ref %}
