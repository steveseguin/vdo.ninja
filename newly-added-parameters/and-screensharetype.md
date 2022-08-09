---
description: >-
  Defines how webcam and screenshare of a guest in a room interacts which each
  other
---

# \&screensharetype

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Aliases

* `&sstype`

## Options

| Value | Description                                                 |
| ----- | ----------------------------------------------------------- |
| 1     | Replaces the webcam screen with the screen share            |
| 2     | Creates a totally new connection for the screen share       |
| 3     | Reuses the existing connection, adding a second video track |

## Details

This parameter can be used to specify which type of screen-sharing logic is used. \
`screensharetype=1` replaces the webcam screen with the screen share,\
`screensharetype=2` creates a totally new connection for the screen share, `screensharetype=3` reuses the existing connection, adding a second video track.

I hope to have `screensharetype=3` become the standard for sharing screens eventually, but for now it will remain optional, until the issues are all worked out.

As a viewer or scene link, to specify only loading the `&screensharetype=3` screen-share, you can now use `&view=xxxxx:s` , where `:s` is appended to the end of the stream ID. This tells the system to ignore the webcam/mic feed, and just send over the screen share. You can do `&view=xxxx,xxxx:s` to target both webcam and screen share though. I may change this syntax over time, but for now it works. The solo-links in the director's room has this `:s` applied already where needed.

{% hint style="warning" %}
The type-3 screen share is still not fully cooked for use in scenes, etc, and it won't yet \
work with [`&meshcast`](and-meshcast.md), [`&novideo`](../advanced-settings/view-parameters/novideo.md) or [`&noaudio`](../advanced-settings/view-parameters/noaudio.md).
{% endhint %}

## Related

{% content-ref url="../source-settings/screenshareid.md" %}
[screenshareid.md](../source-settings/screenshareid.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/upcoming-parameters/and-smallshare.md" %}
[and-smallshare.md](../advanced-settings/upcoming-parameters/and-smallshare.md)
{% endcontent-ref %}

{% content-ref url="../source-settings/screenshare.md" %}
[screenshare.md](../source-settings/screenshare.md)
{% endcontent-ref %}
