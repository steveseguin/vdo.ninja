---
description: Ask a publisher before sending a source stream to a new viewer.
---

# \&prompt

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&approve`
* `&validate`

## Details

`&prompt` is publisher-side viewer confirmation.

After a viewer connection is established, but before the publisher sends audio/video to that viewer, the publisher sees a prompt asking whether to allow the connection.

```text
https://vdo.ninja/?push=Camera1&prompt
```

If the publisher approves, the stream is sent to that viewer. If the publisher denies, the viewer is disconnected and no audio/video is sent.

If the viewer has [`&label=NAME`](../../general-settings/label.md) on their view link, that label is shown in the prompt. Otherwise, a generated connection ID is shown.

## When to use it

Use `&prompt` when one publisher wants to approve viewers of a single push/source stream.

It is useful for:

* a private camera feed
* a temporary one-to-one source link
* warning the publisher before a new viewer receives media

## Limitations

`&prompt` is not a room admission control.

* It does not limit who can enter a room.
* It does not create a room waiting list.
* A denied viewer can try to connect again.
* Viewer labels can be spoofed, so do not treat the prompt as strong identity verification.

For director-controlled room joins, use [`&requireapproval`](../director-parameters/and-requireapproval.md). For room size limits, use [`&roomcap`](../director-parameters/and-roomcap.md).

## Related

{% content-ref url="../director-parameters/and-requireapproval.md" %}
[and-requireapproval.md](../director-parameters/and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="../setup-parameters/and-password.md" %}
[and-password.md](../setup-parameters/and-password.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-hash.md" %}
[and-hash.md](../../newly-added-parameters/and-hash.md)
{% endcontent-ref %}
