---
description: Checks the password
---

# \&hash

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&crc`
* `&check`

## Options

| Value    | Description     |
| -------- | --------------- |
| (string) | Hashed password |

## Details

You can add `&hash=STRING` this to a guest's URL instead of [`&password`](../general-settings/password.md) if you want to check the password. That means the password turns into another string.

If you added a passwort to your room, the guests' invitations in the director room get 'hashed' automatically:\
![](<../.gitbook/assets/image (2).png>)

If you want to hash your password manually, you can use this link:\
[https://vdo.ninja/examples/changepass.html](https://vdo.ninja/examples/changepass.html)\
Just enter your room password and you get the hash value.

For example:\
[https://vdo.ninja/?room=roomname\&password=password](https://vdo.ninja/?room=roomname\&password=password)\
\->\
[https://vdo.ninja/?room=roomname\&hash=99e5](https://vdo.ninja/?room=roomname\&hash=99e5)

## Related

{% content-ref url="../general-settings/password.md" %}
[password.md](../general-settings/password.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/upcoming-parameters/and-prompt.md" %}
[and-prompt.md](../advanced-settings/upcoming-parameters/and-prompt.md)
{% endcontent-ref %}
