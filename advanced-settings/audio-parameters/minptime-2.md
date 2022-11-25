---
description: >-
  Turns off the audio encoder automatically when no little to no sound is
  detected
---

# \&dtx

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Aliases

* `&usedtx`

## Details

Using `&dtx` will turn off the audio encoder automatically when no little to no sound is detected. The VDO.Ninja default uses a dynamic audio bitrate mode ([`&vbr`](../view-parameters/vbr.md)), but using `&dtx` takes things to the next level. It might be useful as a very mild [noise-gate](../../source-settings/noisegate.md) I suppose?

## Related

{% content-ref url="../view-parameters/vbr.md" %}
[vbr.md](../view-parameters/vbr.md)
{% endcontent-ref %}

{% content-ref url="minptime-3.md" %}
[minptime-3.md](minptime-3.md)
{% endcontent-ref %}

{% content-ref url="minptime-1.md" %}
[minptime-1.md](minptime-1.md)
{% endcontent-ref %}
