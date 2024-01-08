---
description: >-
  Another security option, for those concerned about random spying of their
  streams
---

# \&prompt

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&approve`
* `&validate`

## Details

After a new peer viewer connection is established, but before the video/audio streams start getting sent to that new viewer, a prompt will appear asking the publisher if they wish to send their stream to that viewer. If they say no, the remote viewer is disconnected and no video/audio is sent to them. If they have [`&label=xxx`](../../general-settings/label.md) added to their view link, that label will appear as the display name. Otherwise, if no label is available, a random ID representing that connection is shown.

There's nothing stopping a disconnected viewer from re-joining and re-asking, causing some grief, and spoofing an identify isn't too hard, but it gives you some control and warning to block unexpected viewers.

In the future, I can add this control to the director, rather than just the senders, and add additional ways to check identities. For now though, it's a start.

<figure><img src="../../.gitbook/assets/image (117) (1).png" alt=""><figcaption></figcaption></figure>

## Related

{% content-ref url="../setup-parameters/and-password.md" %}
[and-password.md](../setup-parameters/and-password.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-hash.md" %}
[and-hash.md](../../newly-added-parameters/and-hash.md)
{% endcontent-ref %}
