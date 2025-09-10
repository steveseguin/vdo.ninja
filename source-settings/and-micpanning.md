---
description: Pan your microphone left or right before sending
---

# \&micpanning

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&mpan`

## Options

Example: `&micpanning=120`

| Value                | Description                                  |
| -------------------- | -------------------------------------------- |
| (no value) \| `true` | Enable mic panning at center (`90`)          |
| `0–89`               | Pan left (`0` = hard left)                   |
| `90`                 | Center                                       |
| `91–180`             | Pan right (`180` = hard right)               |

## Details

- Publisher-side effect: downmixes the mic to mono, applies gain trim to avoid clipping, then pans to stereo in the outbound WebAudio pipeline.
- WebAudio required: [`&noaudioprocessing`](../general-settings/noaudioprocessing.md) (`&noap`) disables outbound processing; mic panning will not engage if set.
- Live control:
  - Local Settings shows a “Mic Pan” slider when mic panning is enabled.
  - Directors can adjust per guest via the advanced audio panel.
  - Also controllable via API messages (e.g., `requestChangeMicPanning`).
- Safari/iOS: uses a PannerNode fallback internally; same range and behavior.

## Related

{% content-ref url="and-micdelay.md" %}
[and-micdelay.md](and-micdelay.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/noaudioprocessing.md" %}
[noaudioprocessing.md](../general-settings/noaudioprocessing.md)
{% endcontent-ref %}

