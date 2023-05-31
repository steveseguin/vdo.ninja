---
description: >-
  Will play either the left or right audio stream-only for an incoming stereo
  stream
---

# \&playchannel (alpha)

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))\
**ALPHA-ONLY** - Only available at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

Example: `&playchannel=1`

<table><thead><tr><th width="202">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code></td><td>Will play the left audio channel only</td></tr><tr><td><code>2</code></td><td>Will play the right audio channel only</td></tr><tr><td>3-6</td><td>Will play the selected channel</td></tr></tbody></table>

## Details

`&playchannel` will play either the left or right audio stream-only for an incoming stereo stream.

It will play back the selected channel as mono audio, dropping other channels from the playback. `&playchannel=1` is left channel; `2` is right; and if multi channel works for you, then you can target 6 different channels.

This is useful if you wanted to capture the left and right audio channels of a remote guest in OBS in different browser sources, without having to do any fancy audio routing on the studio side.

Both left and right audio channels are still sent; it's just during local playback that the non-selected channels are dropped, so it's not as efficient as local routing, nor will both channel be in exact sync anymore either.

This will not currently work in conjunction with [`&panning`](../view-parameters/and-panning.md) of [`&channeloffset`](../view-parameters/and-channeloffset.md); and will override those options.\
\
Example usage: [https://vdo.ninja/alpha/?view=XXXXXXXX\&stereo\&playchannel=1](https://vdo.ninja/alpha/?view=XXXXXXXX\&stereo\&playchannel=1)

## Related

{% content-ref url="../view-parameters/and-channels.md" %}
[and-channels.md](../view-parameters/and-channels.md)
{% endcontent-ref %}

{% content-ref url="and-inputchannels.md" %}
[and-inputchannels.md](and-inputchannels.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/and-channels.md" %}
[and-channels.md](../view-parameters/and-channels.md)
{% endcontent-ref %}
