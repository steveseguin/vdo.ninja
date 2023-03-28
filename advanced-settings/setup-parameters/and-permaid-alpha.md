---
description: >-
  Will save that stream ID to local storage and reuse it every time &permaid is
  used without a stream ID
---

# \&permaid (alpha)

Sender-Side Option! ([`&room`](../../general-settings/room.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

Example: `&permaid=StreamID`

| Value            | Description                                                       |
| ---------------- | ----------------------------------------------------------------- |
| (no value given) | creates a randomly generated stream ID                            |
| (string)         | 1 to 49-characters long: aLphaNumEric-characters; case sensitive. |

## Details

If using `&permaid=streamidhere` to specify the stream ID, rather than just [`&push`](../../source-settings/push.md), will save that stream ID to local storage and reuse it every time `&permaid` is used without a stream ID.

You could also just use `&permaid` on its own initially, which will auto assign a unique stream ID and save that generated one to local storage, which makes it easier to use one invite for many users, but have VDO.Ninja manage the stream ID assignments.

If not using `&permaid`, it will just default to using `&push` with a random ID. (this avoids 'stream already in use' mishaps)

## Related

{% content-ref url="../../source-settings/push.md" %}
[push.md](../../source-settings/push.md)
{% endcontent-ref %}
