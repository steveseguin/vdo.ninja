---
description: Quick director access to a list of rooms for transfering guests.
---

# \&rooms

{% hint style="warning" %}
If **\&cleanoutput** is enabled, rooms parameter is ignored.
{% endhint %}

## Usage

```
https://vdo.ninja?dir=ROOMID&rooms=ROOMID2,ROOMID3,ROOMID4
```

The link above would add "_ROOMID2_", "_ROOMID3_", "_ROOMID4_" guest transfer buttons to the director control bar.

Pressing any of these buttons will arm the transfer buttons beneath each caller with the chosen room name, allowing callers to be quickly moved from one room to another.

Arming can be disabled by clicking the room name again. If the current room is in the list it will be ignored.
