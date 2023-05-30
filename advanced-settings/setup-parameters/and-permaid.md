---
description: >-
  Will save that stream ID to local storage and reuse it every time &permaid is
  used without a stream ID
---

# \&permaid

Sender-Side Option! ([`&room`](../../general-settings/room.md))

## Options

Example: `&permaid=StreamID`

<table><thead><tr><th width="183">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>creates a randomly generated stream ID</td></tr><tr><td>(string)</td><td>1 to 49-characters long: aLphaNumEric-characters; case sensitive.</td></tr></tbody></table>

## Details

If using `&permaid=streamidhere` to specify the stream ID, rather than just [`&push`](../../source-settings/push.md), will save that stream ID to local storage and reuse it every time `&permaid` is used without a stream ID.

You could also just use `&permaid` on its own initially, which will auto assign a unique stream ID and save that generated one to local storage, which makes it easier to use one invite for many users, but have VDO.Ninja manage the stream ID assignments.

If not using `&permaid`, it will just default to using `&push` with a random ID. (this avoids 'stream already in use' mishaps)

## Related

{% content-ref url="../../source-settings/push.md" %}
[push.md](../../source-settings/push.md)
{% endcontent-ref %}
