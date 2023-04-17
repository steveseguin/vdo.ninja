---
description: Lets you specify a STUN server for webRTC negotiation
---

# \&stun

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Details

This parameter lets you specify a STUN server for webRTC negotiation. The default STUN servers use those provided by Google, at `stun:stun.l.google.com:19302`, but with this command you can set your own.

`&stun` will overwrite the existing STUN values provided by VDO.Ninja. If you wish to keep the existing STUN server options, adding additional options, or if you wish to add multiple custom STUN servers, you can use the related [`&addstun`](../newly-added-parameters/and-addstun.md) parameter. This is the same idea, but when used it won't overwrite the existing STUN options.

Using `&stun` and [`&addstun`](../newly-added-parameters/and-addstun.md) together will let you specify two custom STUN servers.

Setting `&stun` to false will clear the default STUN servers.

If your STUN server requires a password, you can pass the STUN server address with semi-comma separated values in the form `&stun=USERNAME;PASSWORD;ADDRESS`

Basic sample usage of `&stun`:

[`https://vdo.ninja/?push&stun=stun:stun4.l.google.com:19302`](https://vdo.ninja/?push\&stun=stun:stun4.l.google.com:19302)

## Related

{% content-ref url="../newly-added-parameters/and-addstun.md" %}
[and-addstun.md](../newly-added-parameters/and-addstun.md)
{% endcontent-ref %}

{% content-ref url="turn.md" %}
[turn.md](turn.md)
{% endcontent-ref %}
