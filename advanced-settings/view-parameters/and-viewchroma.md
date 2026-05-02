---
description: >-
  Receiver-side chroma key. Removes a chosen color from incoming video streams
  without needing anything from the sender.
---

# \&viewchroma

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&vchroma`

## Options

Example: `&viewchroma=00ff00&viewchromathreshold=40&viewchromasmoothing=30`

<table><thead><tr><th width="230">Parameter</th><th width="260">Aliases</th><th>Description</th></tr></thead><tbody><tr><td><code>&#x26;viewchroma</code></td><td><code>&#x26;vchroma</code></td><td>Hex color to key out. Accepts 3- or 6-digit hex, with or without <code>#</code>. Defaults to <code>0f0</code> (green) when no value is given.</td></tr><tr><td><code>&#x26;viewchromathreshold</code></td><td><code>&#x26;vchromathreshold</code>, <code>&#x26;viewchromathresh</code>, <code>&#x26;vchromathresh</code></td><td>How close a pixel must be to the key color before it is treated as background. Range 0–255, default 40. Higher = more aggressive keying.</td></tr><tr><td><code>&#x26;viewchromasmoothing</code></td><td><code>&#x26;vchromasmoothing</code>, <code>&#x26;viewchromasmooth</code>, <code>&#x26;vchromasmooth</code></td><td>Softness of the edge between kept and keyed pixels. Range 1–255, default 30. Higher = softer, more gradual edge.</td></tr><tr><td><code>&#x26;viewchromahide</code></td><td><code>&#x26;viewchromahidesource</code>, <code>&#x26;vchromahide</code>, <code>&#x26;vchromahidesource</code></td><td>Whether to hide the raw source video behind the keyed canvas. Default <code>1</code> (hidden). Set to <code>0</code>, <code>false</code>, or <code>off</code> to keep the source visible for debugging.</td></tr></tbody></table>

## Details

`&viewchroma` applies a chroma key on the **receiving** side. It runs entirely in the viewer's browser — the sender does not need to enable any effects, install anything, or know that keying is happening. This is the counterpart to [`&chromakey`](../../source-settings/and-chromakey.md), which runs on the sender.

Incoming video is drawn to a canvas each frame. Pixels close to the target color are turned transparent, pixels further away are kept opaque, and pixels in between fade smoothly based on the smoothing value. The keyed canvas replaces the raw `<video>` in the auto-mixer layout, so recording, scenes, and OBS capture all pick up the keyed result.

The default behavior hides the raw source video behind the canvas, because any pixel the key made transparent would otherwise show the original color underneath. `&viewchromahide=0` lets you see both layers side-by-side, which is useful while tuning `threshold` and `smoothing`.

## Examples

Key out pure red on a single incoming stream, with default threshold and smoothing:

```
https://vdo.ninja/?view=StreamID&viewchroma=ff0000
```

Key green with a tighter threshold and softer edges:

```
https://vdo.ninja/?view=StreamID&viewchroma=00ff00&viewchromathreshold=25&viewchromasmoothing=50
```

Debug mode — show both the keyed canvas and the original video so you can compare:

```
https://vdo.ninja/?view=StreamID&viewchroma=00ff00&viewchromahide=0
```

Use in a scene to composite a guest onto a virtual background supplied by CSS or another layer:

```
https://vdo.ninja/?scene&room=roomname&viewchroma=00ff00
```

## Notes

* Works with any number of viewed streams at once; each stream is keyed independently.
* Color accuracy of the source affects results. Strong, well-lit backgrounds key cleanly; JPEG-style compression artifacts around hair and edges can leak through.
* Because keying happens in the viewer, the raw (unkeyed) stream is still transmitted over the network. Bandwidth use is unchanged.
* To key on the sender side instead — for example to save upload bandwidth or to key once for every viewer — use [`&chromakey`](../../source-settings/and-chromakey.md).

## Related

{% content-ref url="../../source-settings/and-chromakey.md" %}
[and-chromakey.md](../../source-settings/and-chromakey.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-chromakeybg.md" %}
[and-chromakeybg.md](../../source-settings/and-chromakeybg.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-greenscreen.md" %}
[and-greenscreen.md](../../source-settings/and-greenscreen.md)
{% endcontent-ref %}

{% content-ref url="view.md" %}
[view.md](view.md)
{% endcontent-ref %}

{% content-ref url="scene.md" %}
[scene.md](scene.md)
{% endcontent-ref %}
