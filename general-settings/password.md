---
description: Sets a password to view a stream or to join a room
---

# \&password

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&director`](../viewers-settings/director.md))

## Aliases

* `&pass`
* `&pw`
* `&p`

## Details

To make your stream or your room more secure, you can set a password by adding `&password=xxx` to the URL.

If no password value is provided via the URL parameter, the system will prompt for one when connecting.

![](<../.gitbook/assets/image (8) (4).png>)

You will want to add the password value to the URL if loading it into OBS.

Passwords apply to both Stream IDs and Room IDs.

Please use alphanumeric-characters only; spaces or other characters may cause the mechanism to fail.

{% hint style="info" %}
**Passwords are CASE-SENSITIVE**; mobile users should watch-out for auto-capitalization when entering them.
{% endhint %}

Adding [`&hash=HASH_VALUE`](../newly-added-parameters/and-hash.md) will act as if `&password=PASSWORD` was added.

Use this link to get the hash for the password:\
[https://vdo.ninja/examples/changepass.html](https://vdo.ninja/examples/changepass.html)

## Related

{% content-ref url="../newly-added-parameters/and-hash.md" %}
[and-hash.md](../newly-added-parameters/and-hash.md)
{% endcontent-ref %}

{% content-ref url="../director-settings/codirector.md" %}
[codirector.md](../director-settings/codirector.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-prompt.md" %}
[and-prompt.md](../advanced-settings/settings-parameters/and-prompt.md)
{% endcontent-ref %}
