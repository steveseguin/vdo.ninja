---
description: A token for invite/scene links to determine whose the director of a room
---

# \&token (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

| Value                          | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| (alphanumeric-characters only) | a token for invite/scene links to determine whose the director of a room |

## Details

When using [`&maindirectorpassword`](../director-parameters/and-maindirectorpassword-alpha.md) as a director, it will add `&token=xxx` to the invite/scene links.

![](<../../.gitbook/assets/image (1) (1).png>)

This token is used by the guests to check a remote database server to see who currently 'owns' the token; it persists though, even if the director is not connected.

When using [`&maindirectorpassword`](../director-parameters/and-maindirectorpassword-alpha.md) as a director, it tells this database that you are the owner, and it will persist even if you aren't connected to VDO.Ninja. The `&token` tells the guest to ignore other logic about who the director is, instead using the info provided by the token-lookup to determine whose the director.

I may change or revoke this feature, depending on how testing goes this week, as it's rather experimental.

## Related

{% content-ref url="../director-parameters/and-maindirectorpassword-alpha.md" %}
[and-maindirectorpassword-alpha.md](../director-parameters/and-maindirectorpassword-alpha.md)
{% endcontent-ref %}
