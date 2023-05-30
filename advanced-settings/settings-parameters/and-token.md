---
description: A token for invite/scene links to determine whose the director of a room
---

# \&token

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

Example: `&token=5eb5e63ee4d9ba06`

<table><thead><tr><th width="306">Value</th><th>Description</th></tr></thead><tbody><tr><td>(alphanumeric-characters only)</td><td>a token for invite/scene links to determine whose the director of a room</td></tr></tbody></table>

## Details

When using [`&maindirectorpassword`](../director-parameters/and-maindirectorpassword.md) as a director, it will add `&token=xxx` to the invite/scene links.

![](<../../.gitbook/assets/image (1) (1) (9).png>)

This token is used by the guests to check a remote database server to see who currently 'owns' the token; it persists though, even if the director is not connected.

When using [`&maindirectorpassword`](../director-parameters/and-maindirectorpassword.md) as a director, it tells this database that you are the owner, and it will persist even if you aren't connected to VDO.Ninja. The `&token` tells the guest to ignore other logic about who the director is, instead using the info provided by the token-lookup to determine whose the director.

I may change or revoke this feature, depending on how testing goes this week, as it's rather experimental.

## Related

{% content-ref url="../director-parameters/and-maindirectorpassword.md" %}
[and-maindirectorpassword.md](../director-parameters/and-maindirectorpassword.md)
{% endcontent-ref %}
