---
description: Adds a director-only button for muting or unmuting all current guests.
---

# \&muteall

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&muteallguests`
* `&muteguests`

## Details

`&muteall` adds a top-bar button in the director control room for muting or unmuting all connected guests at once.

```text
https://vdo.ninja/?director=MyRoom&muteall
```

The button uses the same remote guest mute path as each guest's individual **Mute** button in the director UI. When active, newly joining guests are also muted once their director control box is created.

## Limitations

This option is URL gated. If `&muteall`, `&muteallguests`, or `&muteguests` is not added to the director URL, the button stays hidden and the app behaves as it normally does.

The global mute state is live browser state. It is not a room-level saved setting, and it starts inactive again if the director page is refreshed.

Manual per-guest changes are still allowed. If a director manually unmutes one guest while the global mute-all button remains active, that guest stays unmuted until another global mute-all action or another audio-follow action changes them. New guests will still be muted while the global mute-all state is active.

If [`&highlightmute`](and-highlightmute.md) / **Mute follows Highlight** is also active, Highlight can still unmute the highlighted guest. In that combination, `&muteall` is not an absolute lockout.

The button targets normal guest audio controls only. It skips directors, screen-share entries, pseudo-guests, and guests that do not yet have a director mute control available.

## Related

{% content-ref url="../../newly-added-parameters/and-blindall.md" %}
[and-blindall.md](../../newly-added-parameters/and-blindall.md)
{% endcontent-ref %}
