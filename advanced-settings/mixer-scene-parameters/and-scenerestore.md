---
description: Restores a guest's selected scene assignments after reconnecting
---

# \&scenerestore

Director Option! ([`&director`](../../viewers-settings/director.md), [`&room`](../../general-settings/room.md))

## Details

Add `&scenerestore` to the director URL to let the main director restore a guest's manual scene assignment after that guest disconnects and rejoins.

Example:

```
https://vdo.ninja/?director=ROOMNAME&scenerestore
```

This is useful when guests are manually assigned to scene outputs such as `&scene=1`, `&scene=2`, or `&scene=3`, and a guest drops because of a poor connection.

When enabled, the main director creates a temporary restore lease when a guest is placed into a scene. If that guest reconnects with the matching restore token while the lease is still active, the director can reapply the previous scene selection.

The lease auto-renews while the guest remains connected, so long-running sessions continue to be restorable. After a disconnect, or after the last scene action for that guest, the lease expires after 15 minutes. If the director hangs up, disconnects, or otherwise revokes the guest, the lease expires immediately.

`&scenerestore` is opt-in. It does not bypass room authentication, director approval, queue/hold modes, or the normal director trust checks.

## Related

{% content-ref url="../view-parameters/scene.md" %}
[scene.md](../view-parameters/scene.md)
{% endcontent-ref %}

{% content-ref url="scenetype.md" %}
[scenetype.md](scenetype.md)
{% endcontent-ref %}
