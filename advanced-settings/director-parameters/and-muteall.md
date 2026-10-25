---
description: Adds a director button that mutes or unmutes all guests at once.
---

# \&muteall

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&muteallguests`
* `&muteguests`

## Details

`&muteall` shows a **Mute all guests in room (toggle)** button in the director's control bar. It mutes or unmutes every connected guest at once.

```text
https://vdo.ninja/?director=MyRoom&muteall
```

The button uses the same remote mute as each guest's **Mute** button. While it is active, guests who join are muted too. Without the parameter, the button stays hidden.

* The state is not saved. Reloading the director page turns it off.
* You can still unmute one guest by hand. That guest stays unmuted until the next mute-all action (or, with `&highlightmute`, the next Highlight change). New guests are still muted while mute-all is active.
* [`&highlightmute`](and-highlightmute.md) does not undo mute-all. Highlight only unmutes guests that the highlight rule muted itself.
* Directors, co-directors, screen shares and guests without a director mute control yet are skipped.

## Related

{% content-ref url="../../newly-added-parameters/and-blindall.md" %}
[and-blindall.md](../../newly-added-parameters/and-blindall.md)
{% endcontent-ref %}
