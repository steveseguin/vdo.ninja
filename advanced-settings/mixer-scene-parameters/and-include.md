---
description: Adds stream IDs within the viewer's room scope
---

# \&include

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Options

Example: `&include=StreamID`

| Value | Description |
| --- | --- |
| (stream ID) | Publisher stream ID within the viewer's room scope, with a matching password |

## Details

`&include` adds stream IDs to the viewer's selection, including alongside [`&view`](../view-parameters/view.md). It does not override room isolation.

* In a room, requested stream IDs resolve only to publishers in that same room. `&include` does not import standalone publishers or publishers from another room.
* Outside a room, `&include` can select additional standalone publishers with a matching password.

Matching stream IDs or passwords do not merge these scopes. Room isolation is intentional: common IDs such as `GUEST` or `TEST` must not cause an unrelated publisher's video to appear in a room.

Do not use `&include` to distribute one standalone publisher to guests in multiple rooms. A connection that happens to work because it was established before joining a room is not a supported way to bypass this restriction.

## Related

{% content-ref url="../view-parameters/view.md" %}
[view.md](../view-parameters/view.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/and-exclude.md" %}
[and-exclude.md](../view-parameters/and-exclude.md)
{% endcontent-ref %}
