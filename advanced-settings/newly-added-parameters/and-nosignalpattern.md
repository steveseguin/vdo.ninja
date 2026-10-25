---
description: >-
  Shows a built-in "No Signal" test pattern while a view or scene link has no
  active video feeds
---

# \&nosignalpattern

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&view`](../view-parameters/view.md))

## Aliases

* `&nosignal`

## Options

| Value | Description |
| ----- | ----------- |
| `1` or no value | Color bars with "NO SIGNAL" and VDO.Ninja branding (default) |
| `2`, `clean`, `plain` or `unbranded` | Color bars with "NO SIGNAL", without branding |
| `3`, `clock` or `standby` | Standby-style "NO SIGNAL" screen with an animated clock graphic |
| `0`, `false` or `off` | Disabled |

Any other value shows pattern `1`. Without the parameter, the normal waiting spinner is used.

## Details

When a [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md) link has no active video, this shows a built-in "No Signal" image instead of the spinner. The image comes back when all incoming video ends, so a live output shows a clear standby picture instead of a blank screen.

* [`&waitimage`](and-waitimage.md) takes priority. If both are set, the custom image is shown.
* The pattern appears immediately. Add [`&waittimeout`](and-waittimeout.md) to delay it.

## Examples

`https://vdo.ninja/?view=streamid&nosignal`

`https://vdo.ninja/?view=streamid&nosignalpattern=2`

`https://vdo.ninja/?scene&room=example&nosignalpattern=3`

## Related

{% content-ref url="and-waitimage.md" %}
[and-waitimage.md](and-waitimage.md)
{% endcontent-ref %}

{% content-ref url="and-waitmessage.md" %}
[and-waitmessage.md](and-waitmessage.md)
{% endcontent-ref %}

{% content-ref url="and-waittimeout.md" %}
[and-waittimeout.md](and-waittimeout.md)
{% endcontent-ref %}
