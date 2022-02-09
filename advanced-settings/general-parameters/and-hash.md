---
description: Checks the password
---

# \&hash

## Aliases

* `&crc`
* `&check`

## Options

| Value    | Description     |
| -------- | --------------- |
| (string) | Hashed password |

## Details

You can add `&hash=STRING` this to a guest's URL instead of [`&password`](../../general-settings/password.md) if you want to check the password. That means the password turns into another String.

The guests' invitations in the director room get 'hashed' automatically. If you want to hash your password manually, you can use this link:\
[https://vdo.ninja/examples/changepass.html](https://vdo.ninja/examples/changepass.html)\
Just enter your room password and you get the hash value.\
\
For example:\
[https://vdo.ninja/?room=roomname\&password=password](https://vdo.ninja/?room=roomname\&password=password)\
\->\
[https://vdo.ninja/?room=roomname\&hash=99e5](https://vdo.ninja/?room=roomname\&hash=99e5)

## Related

{% content-ref url="../../general-settings/password.md" %}
[password.md](../../general-settings/password.md)
{% endcontent-ref %}
