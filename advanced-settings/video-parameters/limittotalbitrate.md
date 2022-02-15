---
description: Limits the total outbound bitrate
---

# \&limittotalbitrate

## Aliases

* `&ltb`

## Options

| Value                    | Description                              |
| ------------------------ | ---------------------------------------- |
| (positive integer value) | max total outbound video bitrate in kbps |

## Details

_Tries_ to limit the total outbound bitrate to some max total value, via the publisher's side. This could be useful if you are broadcasting video as a director to the room, but only have a fixed amount of upload bandwidth or CPU.

## Related

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="roombitrate.md" %}
[roombitrate.md](roombitrate.md)
{% endcontent-ref %}
