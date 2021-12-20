---
description: Sets a password to view a stream or to join a room.
---

# \&password

{% hint style="warning" %}
No error is provided if the password fails or is incorrect; it will just not work.
{% endhint %}

## Aliases

* `&pass`
* `&pw`
* `&p`

## Details

If no password value is provided via the URL parameter, the system will prompt for one when connecting.\
You will want to add the password value to the URL if loading it into OBS.\
Passwords apply to both Stream IDs and Room IDs.\
Please use alphanumeric-characters only; spaces or other characters may cause the mechanism to fail.\


{% hint style="info" %}
**Passwords are CASE-SENSITIVE**; mobile users should watch-out for auto-capitalization when entering them.
{% endhint %}

\
Adding `&hash=HASH_VALUE` will act as if `&password` was added.
