---
description: The guest waits on hold, while the director can already see and hear the guest before activation.
---

# \&holdwithvideo

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&queue4`

## Details

`&holdwithvideo` is the same basic workflow as [`&hold`](and-hold-alpha.md), except the director can already see and hear the guest before activation.

Before activation:

* the guest sees a waiting message
* the guest does not see or hear the director
* the director can preview the guest's live audio/video

After activation or transfer:

* the waiting overlay is cleared for the guest
* both sides move into normal live room behavior

This mode applies to guest invite links when the director is not using the room-wide `&queue` screening model.

## Related

{% content-ref url="../../general-settings/queue.md" %}
[queue.md](../../general-settings/queue.md)
{% endcontent-ref %}
