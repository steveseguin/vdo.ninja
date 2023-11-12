---
description: Limits the total outbound bitrate
---

# \&limittotalbitrate

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&ltb`

## Options

Example: `&limittotalbitrate=2000` or `&limittotalbitrate=2000,1000`

| Value                    | Description                              |
| ------------------------ | ---------------------------------------- |
| (positive integer value) | max total outbound video bitrate in kbps |
| `1000,500`               | Desktop bitrate, Smartphone bitrate      |

## Details

_Tries_ to limit the total outbound bitrate to some max total value, via the publisher's side. This could be useful if you are broadcasting video as a director to the room, but only have a fixed amount of upload bandwidth or CPU.

`&limittotalbitrate` can now take two values; the second of which gets used if the device is a 'mobile' device, while the first gets used otherwise. ie: `&limittotalbitrate=1000,500`\
Useful if you don't know if the guest is going to join via Desktop or via Smartphone, and you wish to avoid overloading a mobile device.

## Related

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="roombitrate.md" %}
[roombitrate.md](roombitrate.md)
{% endcontent-ref %}
