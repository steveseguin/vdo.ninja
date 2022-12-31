---
description: >-
  The same as &group, except it lets you see those groups without actually
  needing to join them with your mic/camera
---

# \&groupview (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

| Value     | Description                                          |
| --------- | ---------------------------------------------------- |
| `1`       | adds the guest or director to group 1                |
| `2`       | adds the guest or director to group 2                |
| `3,4,5,6` | adds the guest or director to group 3, 4, 5 and 6    |
| string    | creates/adds the guest or director to a custom group |

## Details

`&groupview` is the same as [`&group`](../../general-settings/and-group.md), except it lets you see those groups without actually needing to join them with your mic/camera. (There's no button in the directors/guest view for this, since there isn't a need yet for that.)

You can change the view-only groups via the API (http/IFrame) or using the [Comms app](../../steves-helper-apps/comms.md), which has been updated with buttons for this option. the HTTP documentation: [https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#api-commands](https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#api-commands)

You can now use the HTTP/WSS API to both join and leave a group; not just toggle said state. Both the view-group function and regular group function.

## Related

{% content-ref url="../../general-settings/and-group.md" %}
[and-group.md](../../general-settings/and-group.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/and-groupaudio.md" %}
[and-groupaudio.md](../../general-settings/and-groupaudio.md)
{% endcontent-ref %}

{% content-ref url="and-groupmode.md" %}
[and-groupmode.md](and-groupmode.md)
{% endcontent-ref %}
