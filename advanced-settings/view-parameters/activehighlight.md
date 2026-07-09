---
description: Automatically drives Highlight / Featured from the current active speaker.
---

# \&activehighlight

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

`&activehighlight` uses VDO.Ninja's active-speaker detection to automatically control the Highlight / Featured guest state.

Use this when you want the person currently speaking to become larger, while the other guests remain visible in the same scene layout.

## Aliases

* `&activespeakerfeatured`

## Options

| Value | Description |
| --- | --- |
| `2` \| (no value given) | Uses the secondary Highlight / Featured mode. The active speaker becomes larger, but other visible guests remain in the layout. |
| `1` | Uses normal Highlight, which is closer to a full speaker focus mode. |

Example:

```text
https://vdo.ninja/?room=ROOMNAME&scene=0&activehighlight=2&cleanoutput
```

Alias example:

```text
https://vdo.ninja/?room=ROOMNAME&scene=0&activespeakerfeatured&cleanoutput
```

By itself, `&activehighlight=2` does not enable `&activespeaker`, so it does not hide non-speaking guests. If you also add `&activespeaker`, the normal active-speaker hide/show behavior still applies.

You can add `&activespeakerdelay` if speaker changes are happening too quickly.

The scene or view link still needs to receive and process guest audio to know who is speaking. Do not add `&noaudio` or `&noap` to the same link unless another script is controlling Highlight for you.

By default, this mode follows video-capable speakers, similar to `&activespeaker=3`, so audio-only sources do not take over the Featured layout.

## Related

{% content-ref url="activespeaker.md" %}
[activespeaker.md](activespeaker.md)
{% endcontent-ref %}

{% content-ref url="../mixer-scene-parameters/and-activespeakerdelay.md" %}
[and-activespeakerdelay.md](../mixer-scene-parameters/and-activespeakerdelay.md)
{% endcontent-ref %}
