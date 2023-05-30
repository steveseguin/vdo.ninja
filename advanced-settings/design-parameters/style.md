---
description: Lets you select how audio-only elements are displayed in OBS and for guests
---

# \&style

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&st`

## Options

Example: `&style=2`

<table><thead><tr><th width="233">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>0</code></td><td>shows the audio-control bar with a little person as a background silhouette, if the stream is an audio-only. This lets you control the volume and mute and get some feedback that the stream is present</td></tr><tr><td><code>1</code> | (no value given)</td><td>hides audio-only windows from appearing. The default is for guests to see audio-only boxes for guests that do not have a video feed; the director is excluded</td></tr><tr><td><code>2</code></td><td>just shows an animated audio waveform of the speaker's voice, although I made the quality HD now</td></tr><tr><td><code>3</code></td><td>shows the audio meter, which you can customize using <a href="meterstyle.md"><code>&#x26;meterstyle</code></a>. You can conversely just use <code>&#x26;meterstyle</code> on its own, and mix it with a different style, and it will still work</td></tr><tr><td><code>4</code></td><td>will just show a black background for any audio-only source</td></tr><tr><td><code>5</code></td><td>will show a random color for a background, instead of just black</td></tr><tr><td><code>6</code></td><td>will show the first letter of the guest's display name, in a colored circle, with a black background. If no display name is provided, it will just be a colored circle on a black background</td></tr><tr><td><code>7</code></td><td>will include non-media-based push connections as video elements in a group room. This can include guests that joined without audio/video, directors, or a data-only connection, like maybe MIDI-output source</td></tr></tbody></table>

## Details

`&style` lets you select how media elements are displayed in OBS and for guests; audio-only elements in particular.

Styles are experimental and will undergo change, tweaks, and likely there are more to come.

The default style depends on numerous factors; the intent is to predict the most desirable for a given situation. Manually setting the style will override the default. Defaults may be changed from time to time, based on user feedback.

There is a toggle in the director's room which adds `&st` to the guest's invite link.![](<../../.gitbook/assets/image (123).png>)

## Related

{% content-ref url="meterstyle.md" %}
[meterstyle.md](meterstyle.md)
{% endcontent-ref %}

{% content-ref url="and-bgimage.md" %}
[and-bgimage.md](and-bgimage.md)
{% endcontent-ref %}

{% content-ref url="and-showall.md" %}
[and-showall.md](and-showall.md)
{% endcontent-ref %}
