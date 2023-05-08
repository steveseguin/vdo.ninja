---
description: Lets you set a pseudo 'master room password' as a director
---

# \&maindirectorpassword

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&maindirpass`

## Options

Example: `&maindirectorpassword=SomePassword123`

| Value                          | Description                                        |
| ------------------------------ | -------------------------------------------------- |
| (alphanumeric-characters only) | the password you want to set for the main director |

## Details

`&maindirectorpassword` lets you set a pseudo 'master room password' as a director. It helps avoid getting locked out as the director, if someone else tries to claim the director-role first. ie:\
[`https://vdo.ninja/?director=ROOMNAME&maindirectorpassword=MASTERPASS`](https://vdo.ninja/?director=ROOMNAME\&maindirectorpassword=MASTERPASS)

This will add a [`&token`](../settings-parameters/and-token.md) value to the invite/scene links.

![](<../../.gitbook/assets/image (1) (1) (9).png>)

This token is used by the guests to check a remote database server to see who currently 'owns' the token; it persists though, even if the director is not connected.

When using `&maindirectorpassword` as a director, it tells this database that you are the owner, and it will persist even if you aren't connected to VDO.Ninja. The [`&token`](../settings-parameters/and-token.md) tells the guest to ignore other logic about who the director is, instead using the info provided by the token-lookup to determine whose the director.

I may change or revoke this feature, depending on how testing goes this week, as it's rather experimental.

## Related

{% content-ref url="../../general-settings/password.md" %}
[password.md](../../general-settings/password.md)
{% endcontent-ref %}

{% content-ref url="../../director-settings/codirector.md" %}
[codirector.md](../../director-settings/codirector.md)
{% endcontent-ref %}

{% content-ref url="../settings-parameters/and-token.md" %}
[and-token.md](../settings-parameters/and-token.md)
{% endcontent-ref %}
