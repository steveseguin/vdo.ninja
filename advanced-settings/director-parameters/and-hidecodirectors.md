---
description: Hides the co-directors from appearing in the director's room
---

# \&hidecodirectors

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&hidedirector`
* `&hd`

## Details

`&hidecodirectors` will hide the co-directors from appearing in the director's room. You might have a few co-directors join you, but they might be taking up space, so this is a way to prevent that. It simply hides the boxes; they are still there at a code level.

Changed the logic so it stops the video/audio/IFrame/widget data from any director loading.

This is a bit like the opposite of [`&showdirector`](../../viewers-settings/and-showdirector.md), but only viewer side.

Another change is that it works with more than just one codirector hiding another codirector, but can be used with scenes, view links, or guests.

Lastly, this is not like [`&exclude`](../view-parameters/and-exclude.md), as it still allows the data-connection to happen between the two peers, allowing chat and two codirectors to sync their dashboards/commands. Keeping data connections active is important for directors, who rely on them to issue commands, so exclude is a bit to harsh in some cases.

## Related

{% content-ref url="../../director-settings/codirector.md" %}
[codirector.md](../../director-settings/codirector.md)
{% endcontent-ref %}

{% content-ref url="../../viewers-settings/director.md" %}
[director.md](../../viewers-settings/director.md)
{% endcontent-ref %}
