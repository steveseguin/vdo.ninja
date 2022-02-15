---
description: >-
  Allows a guest to control their total room video bitrate dynamically from the
  settings panel (under video settings)
---

# \&controlroombitrate

## Aliases

* `&crb`

## Details

A slider appears in the guest’s settings menu.

This feature could be useful for guests that have limited CPU or Network bandwidth to self-regulate.

Lowering this slider will reduce the video bitrate of incoming video streams.

It will not allow the guest to increase the room bitrate's limits; only lower them.

You need to be a publisher to access this value (as the settings button is needed).

Consider using [`&totalroombitrate`](totalroombitrate.md) if you wish to increase the bitrate higher than the default max of \~ 500-kbps.

![](<../../.gitbook/assets/image (131).png>)

## Related

{% content-ref url="../../source-settings/roombitrate.md" %}
[roombitrate.md](../../source-settings/roombitrate.md)
{% endcontent-ref %}

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}
