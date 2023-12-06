---
description: Will rotate the contents of the VDO.Ninja window
---

# \&rotatewindow

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&rotatepage`

## Options

Example: `&rotatewindow=270`

<table><thead><tr><th width="212">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given) | <code>90</code></td><td>90 degree</td></tr><tr><td>(degree)</td><td>Rotates the page in the specified value in degree</td></tr></tbody></table>

## Details

`&rotatewindow` will rotate the contents of the VDO.Ninja window. It doesn't target any specific video, and can be used on the viewer-side, not just the sender.

This will be overridden by [`&forcelandscape`](../mobile-parameters/and-forcelandscape.md) mode, if that is used also.

You can pass `90`, `180`, or `270` as a value to the parameter, to rotate accordingly. The default is `90` though, if used without any value.

You might still want to use OBS to rotate instead, but if not using OBS and find the teleprompter app too cumbersome, this is a good option.

<div align="left">

<figure><img src="../../.gitbook/assets/image (1) (1) (1) (1).png" alt="" width="323"><figcaption></figcaption></figure>

</div>

## Related

{% content-ref url="and-rotate.md" %}
[and-rotate.md](and-rotate.md)
{% endcontent-ref %}

{% content-ref url="and-flip.md" %}
[and-flip.md](and-flip.md)
{% endcontent-ref %}

{% content-ref url="and-mirror.md" %}
[and-mirror.md](and-mirror.md)
{% endcontent-ref %}
