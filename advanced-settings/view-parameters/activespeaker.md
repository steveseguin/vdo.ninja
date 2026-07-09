---
description: >-
  Auto-hides remote guests videos when added, if those guests are not speaking
  actively
---

# \&activespeaker

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&sas`
* `&speakerview`

## Options

Example: `&activespeaker=1`

| Value                   | Description                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `1` \| (no value given) | will only show one speaker at a time; the loudest or last-loud speaker                  |
| `2`                     | will show whoever is talking; mixed together; if no one is talking, just shows yourself |
| `3`                     | the same as `1`, but it will not switch to show audio-only sources (just video only)    |
| `4`                     | the same as `2`, but it will not switch to show audio-only sources (just video only)    |

In all four cases, if someone else is talking/active, your local preview will become a [mini-preview](../../source-settings/and-minipreview.md) in the top right.

If you want the active speaker to become larger while other guests remain visible, use [`&activehighlight=2`](activehighlight.md) or `&activespeakerfeatured` instead.

### Customize the delay on switching

By default, the active speaker switches fairly quickly, typically within a few hundred milliseconds of a louder speaker taking over. You can add a fixed added delay, which works with modes 1 and 3, which will delay how long it takes before a switch between speakers is made

`&activespeakerdelay`=2000, where 2000 is a value in milliseconds.

This will not impact modes 2 or 4

## Related

If looking to add a green box around active speakers, or make it just easier to see who is talking, please considering using \&meterstyle instead.

{% content-ref url="../design-parameters/meterstyle.md" %}
[meterstyle.md](../design-parameters/meterstyle.md)
{% endcontent-ref %}

{% content-ref url="activehighlight.md" %}
[activehighlight.md](activehighlight.md)
{% endcontent-ref %}

{% content-ref url="../mixer-scene-parameters/and-motiondetection-alpha.md" %}
[and-motiondetection-alpha.md](../mixer-scene-parameters/and-motiondetection-alpha.md)
{% endcontent-ref %}
