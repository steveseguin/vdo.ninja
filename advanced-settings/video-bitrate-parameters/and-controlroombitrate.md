---
description: >-
  Allows a guest to control their own total room video receive bitrate from the
  settings panel (under video settings)
---

# \&controlroombitrate

Room Guest Option! ([`&room`](../../general-settings/room.md))

## Aliases

* `&crb`

## Details

Allows a guest to control their own total room video receive bitrate dynamically from the settings panel (under video settings).

A slider appears in the guest's settings menu.

This feature can be useful for guests that have limited CPU or network bandwidth to self-regulate.

Lowering this slider will reduce the video bitrate of incoming room video streams for that guest.

It will not allow the guest to increase above the room bitrate limit; only lower their own receive budget.

You need to be a publisher to access this value, as the settings button is needed.

Consider using [`&totalroombitrate`](totalroombitrate.md) if you wish to increase the room bitrate higher than the default.

## Priority

If a main director is connected, the director's room bitrate setting still controls the room limit. `&controlroombitrate` only lets the guest reduce their own receive budget below that limit.

If no director is connected, the guest's own URL value, such as `&trb=4000`, controls that guest's room receive budget. `&controlroombitrate` then lets the guest reduce it from the interface.

<div align="left">

<img src="../../.gitbook/assets/image (131).png" alt="">

</div>

## Related

{% content-ref url="roombitrate.md" %}
[roombitrate.md](roombitrate.md)
{% endcontent-ref %}

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}
