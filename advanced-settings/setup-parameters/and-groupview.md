---
description: >-
  The same as &group, except it lets you see those groups without actually
  needing to join them with your mic/camera
---

# \&groupview

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&viewgroup`
* `&gv`

## Options

Example: `&groupview=Groupname`

<table><thead><tr><th width="222.57142857142856">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code></td><td>adds the guest or director to group 1</td></tr><tr><td><code>2</code></td><td>adds the guest or director to group 2</td></tr><tr><td><code>3,4,5,6</code></td><td>adds the guest or director to group 3, 4, 5 and 6</td></tr><tr><td>(string)</td><td>creates/adds the guest or director to a custom group</td></tr></tbody></table>

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
