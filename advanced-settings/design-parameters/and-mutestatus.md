---
description: Show a muted/unmuted state icon overlay on remote tiles
---

# \&mutestatus

Viewer/Room Option! ([`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&showmutestate`
* `&showmuted`

## Also see

`&unmutestatus` (aliases: `&showunmutestate`, `&showunmuted`) — shows an "unmuted" indicator instead.

## Options

Examples:

- `&mutestatus` — show a muted icon overlay when a guest is muted
- `&unmutestatus` — show an unmuted icon overlay when a guest is not muted

## Details

- When used in rooms/scenes, adds a small overlay icon per remote tile that reflects the guest’s current mic mute state.
- Honors clean output: icons are hidden if `&cleanoutput`/`&cleandirector` is active (except for the director).
- Useful for confidence monitoring and for productions where a persistent visual mute cue is desired.
- Can be combined: using both `&mutestatus` and `&unmutestatus` will show either state explicitly.

## Related

{% content-ref url="../../general-settings/room.md" %}
[room.md](../../general-settings/room.md)
{% endcontent-ref %}

{% content-ref url="cleanoutput.md" %}
[cleanoutput.md](cleanoutput.md)
{% endcontent-ref %}

