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

Example: `&screensharetype=3`

<table><thead><tr><th width="196">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code></td><td>Replaces the webcam screen with the screen share</td></tr><tr><td><code>2</code></td><td>Creates a totally new connection for the screen share</td></tr><tr><td><code>3</code> (default)</td><td>Reuses the existing connection, adding a second video track</td></tr></tbody></table>

## Details

This parameter can be used to specify which type of screen sharing logic is used.

* `screensharetype=1` replaces the webcam screen with the screen share
* `screensharetype=2` creates a totally new connection for the screen share
* `screensharetype=3` reuses the existing connection, adding a second video track; also doesn't show the local screen share window

The default `&screensharetype` for screen-sharing is `3` when in a room.

As a viewer or scene link, to specify only loading the `&screensharetype=3` screen share, you can now use `&view=xxxx:s`, where `:s` is appended to the end of the stream ID. This tells the system to ignore the webcam/mic feed, and just send over the screen share. You can do `&view=xxxx,xxxx:s` to target both webcam and screen share though. I may change this syntax over time, but for now it works. The solo-links in the director's room has this `:s` applied already where needed.

{% hint style="info" %}
If using `&screensharetype=3` the parameter [`&screenshareid`](../source-settings/screenshareid.md) doesn't do anything.
{% endhint %}

{% hint style="warning" %}
The type-3 screen share is still not fully cooked for use in scenes, etc, and it won't yet \
work with [`&meshcast`](and-meshcast.md), [`&novideo`](../advanced-settings/video-parameters/and-novideo.md) or [`&noaudio`](../advanced-settings/view-parameters/noaudio.md).
{% endhint %}

## Related

{% content-ref url="../source-settings/screenshareid.md" %}
[screenshareid.md](../source-settings/screenshareid.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/screen-share-parameters/and-smallshare.md" %}
[and-smallshare.md](../advanced-settings/screen-share-parameters/and-smallshare.md)
{% endcontent-ref %}

{% content-ref url="../source-settings/screenshare.md" %}
[screenshare.md](../source-settings/screenshare.md)
{% endcontent-ref %}
