---
description: Quick director access to a list of rooms for transfering guests
---

# \&rooms

Director Option! ([`&director`](../viewers-settings/director.md))

## Options

Example: `&rooms=room1,room2,room3`

<table><thead><tr><th>Value</th><th>Description</th><th data-hidden></th></tr></thead><tbody><tr><td>(string value)</td><td>adds the rooms to the guest transfer buttons to the director control bar (comma separated)</td><td></td></tr></tbody></table>

## Details

[https://vdo.ninja/?director=ROOMID\&rooms=ROOMID2,ROOMID3,ROOMID4](https://vdo.ninja/?director=ROOMID\&rooms=ROOMID2,ROOMID3,ROOMID4)

The link above would add "_ROOMID2_", "_ROOMID3_", "_ROOMID4_" guest transfer buttons to the director control bar.

<figure><img src="../.gitbook/assets/image (37).png" alt=""><figcaption></figcaption></figure>

Pressing any of these buttons will arm the transfer buttons beneath each caller with the chosen room name, allowing callers to be quickly moved from one room to another.

![](<../.gitbook/assets/image (4) (2) (1) (1).png>)

Arming can be disabled by clicking the room name again. If the current room is in the list it will be ignored.

{% hint style="warning" %}
If [`&cleanoutput`](../advanced-settings/design-parameters/cleanoutput.md) is enabled, rooms parameter is ignored.
{% endhint %}

## Related

{% content-ref url="../general-settings/room.md" %}
[room.md](../general-settings/room.md)
{% endcontent-ref %}

{% content-ref url="../getting-started/rooms/" %}
[rooms](../getting-started/rooms/)
{% endcontent-ref %}

{% content-ref url="../getting-started/rooms/transfer-rooms.md" %}
[transfer-rooms.md](../getting-started/rooms/transfer-rooms.md)
{% endcontent-ref %}
