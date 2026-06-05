---
description: Automatically mutes non-highlighted guests and unmutes the highlighted guest.
---

# \&highlightmute

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&hmute`
* `&mutefollowhighlight`
* `&mfh`

## Details

`&highlightmute` enables **Mute follows Highlight** in the director control room.

```text
https://vdo.ninja/?director=MyRoom&highlightmute
```

When enabled, selecting a guest with the director **Highlight** / solo-video control will remotely unmute that highlighted guest and remotely mute the other guests.

This is intended for production workflows where the active on-air guest should automatically be the only unmuted guest.

## Limitations

This option is URL gated or manually enabled from the director room settings. If it is not enabled, Highlight behaves as it normally does.

Manual per-guest unmute changes are still possible. Those manual changes remain until the next Highlight change, when the mute-follow rule is applied again.

If the option is enabled while no guest is currently highlighted, guests may be muted until a Highlight target is selected.

The Ctrl/Cmd-click Highlight mode, which only makes a video larger, does not drive mute-follow. Only normal Highlight changes affect audio.

The rule targets normal guest audio controls only. It skips directors, screen-share entries, pseudo-guests, and guests that do not yet have a director mute control available.

## Related

{% content-ref url="and-muteall.md" %}
[and-muteall.md](and-muteall.md)
{% endcontent-ref %}
