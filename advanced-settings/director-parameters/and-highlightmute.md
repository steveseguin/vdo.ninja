---
description: Mutes the other guests whenever the director highlights a guest.
---

# \&highlightmute

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&hmute`
* `&mutefollowhighlight`
* `&mfh`

## Options

| Value | Description |
| --- | --- |
| (no value) or any other value | Turn on **Mute follows Highlight** |
| `0`, `false`, `no` or `off` | Leave it off |

## Details

`&highlightmute` turns on **Mute follows Highlight** in the director's room. You can also tick it in the director's **Room Settings**.

```text
https://vdo.ninja/?director=MyRoom&highlightmute
```

When you **Highlight** a guest, the other guests are remotely muted, so the highlighted guest is the only one on air. When you clear the Highlight, guests muted by this rule are unmuted again. Guests who join while someone is highlighted are muted too.

* It only unmutes guests that it muted itself. A guest you muted by hand stays muted when highlighted.
* You can still mute or unmute guests by hand. The rule applies again at the next Highlight change.
* Turning it on when nobody is highlighted mutes no one.
* CTRL/⌘ + click Highlight, which only enlarges a video, does not change audio.
* Directors, co-directors, screen shares and guests without a director mute control yet are skipped.

## Related

{% content-ref url="and-muteall.md" %}
[and-muteall.md](and-muteall.md)
{% endcontent-ref %}
