---
description: >-
  'Hashes' the password into another String so that you can't see the password
  in the URL
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

You can add this to a guest's URL instead of [`&password`](../general-settings/password.md) if you want to 'hash' the password. That means the password turns into another String.

The the guests' invitations in the director room get hashed automatically. If you want to hash your password manually, you can use this link:\
[https://vdo.ninja/examples/changepass.html](https://vdo.ninja/examples/changepass.html)\
Just enter your room password and you get the hash value.\
\
For example:\
[https://vdo.ninja/?room=roomname\&password=password](https://vdo.ninja/?room=roomname\&password=password)\
\->\
[https://vdo.ninja/?room=roomname\&hash=99e5](https://vdo.ninja/?room=roomname\&hash=99e5)

## Related

{% content-ref url="../general-settings/password.md" %}
[password.md](../general-settings/password.md)
{% endcontent-ref %}
