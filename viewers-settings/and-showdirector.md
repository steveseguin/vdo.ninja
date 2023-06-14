---
description: Lets the director perform alongside guests, showing up in scene-view links
---

# \&showdirector

Director Option / Viewer-Side Option! ([`&director`](director.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&sd`

## Options

Example: `&showdirector=3`

<table><thead><tr><th width="228">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code> | (no value given)</td><td>should allow everything from the director into the scene, except webpage shares and widget shares</td></tr><tr><td><code>2</code></td><td>allows the director's video from the director in scenes, but not audio</td></tr><tr><td><code>3</code>*</td><td>should allow the director's screen share to appear scene links, but not their main camera stream</td></tr><tr><td><code>4</code></td><td>allows everything, including iframe/webpage shares</td></tr></tbody></table>

\*on alpha

## Details

This URL value can be added to the director's URL (`&director=roomname&showdirector`) or to the scene link (`&scene&showdirector`) when you wish the director to appear in those links. You can also enable this flag a couple other ways.

* As a director, you will now appear as a performer kind of like other performers.
* The ability to add/remove the director's camera/audio from scenes becomes available, including a new highlight guest option, the ability to record, re-order, and more.
* By default, a director normally won't appear in any scene link or group link, and has limited functions available.

![](<../.gitbook/assets/image (109) (1) (1) (1).png>)![](<../.gitbook/assets/image (93) (1) (1) (1) (1).png>)

* When a director enables their camera, while in `&showdirector` mode, they gain access to following set of options for the director's camera feed specifically:

![](<../.gitbook/assets/image (116) (1) (1) (1).png>)

## Related

{% content-ref url="director.md" %}
[director.md](director.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/scene.md" %}
[scene.md](../advanced-settings/view-parameters/scene.md)
{% endcontent-ref %}
