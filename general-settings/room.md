---
description: Sets a room id for the session to join
---

# \&room

## Aliases

* `&roomid`
* `&r`

## Details

Rooms broadcast to all participants who has joined and chat messages

Rooms are complemented by the [`&director={value}`](../director-settings/director.md) function. Directors can have oversight of a room.

Rooms limit the viewing bitrate that guests of a room can request. OBS does not have these viewing limits though.

Rooms have no forced limit on the number of guests allowed, but practically 10 is about the limit I'd recommend.

``[`&showonly=xxx`](../viewers-settings/novideo.md) and `` [`&roombitrate=0`](../source-settings/roombitrate.md) can be used to help increase the capacity of rooms to 30 or more.

An alternative to a `&room` is a _faux-room_, which can be done with: _`?push=aaa&view=bbb,ccc,ddd`_

## Additional info

There's a documentation page dedicated to rooms [here](../getting-started/rooms/).

There's also a video below looking at what sort of performance and system load there is when using an unoptimized group room.

{% embed url="https://www.youtube.com/watch?v=VYYG4rZffcM" %}

{% content-ref url="../viewers-settings/broadcast.md" %}
[broadcast.md](../viewers-settings/broadcast.md)
{% endcontent-ref %}

You can reduce CPU load using the [`&broadcast`](../viewers-settings/broadcast.md) flag, if hosting a larger room. See the above link.

You can also transfer guests between group rooms, using the transfer function that the director has.

{% content-ref url="../getting-started/rooms/transfer-rooms.md" %}
[transfer-rooms.md](../getting-started/rooms/transfer-rooms.md)
{% endcontent-ref %}
