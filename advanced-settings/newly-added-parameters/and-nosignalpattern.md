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
| `1` | Classic color-bar "NO SIGNAL" pattern with VDO.Ninja branding. This is also used by `&nosignal`. |
| `2` | Classic color-bar "NO SIGNAL" pattern without VDO.Ninja branding. |
| `3` | Standby-style "NO SIGNAL" pattern with an animated clock graphic. |

## Details

This option replaces the default waiting spinner with a built-in "No Signal" pattern when a [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md) link has no active video content.

Examples:

`https://vdo.ninja/?view=streamid&nosignal`

`https://vdo.ninja/?view=streamid&nosignalpattern=2`

`https://vdo.ninja/?scene&room=example&nosignalpattern=3`

The default behavior is unchanged unless this parameter is added. The pattern can also reappear after all incoming video connections end, which makes it useful for live-streaming outputs where an empty scene should show a clear standby image instead of a spinner or blank view.

If [`&waitimage`](and-waitimage.md) is also set, the custom wait image takes priority over `&nosignalpattern`.

You can still use [`&waittimeout`](and-waittimeout.md) if you want to delay when the no-signal pattern appears.

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
