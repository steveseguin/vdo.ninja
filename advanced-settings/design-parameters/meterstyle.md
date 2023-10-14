---
description: Optional audio meter style type
---

# \&meterstyle

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&director`](../../viewers-settings/director.md))

## Aliases

* `&meter`

## Options

Example: `&meterstyle=3`

<table><thead><tr><th width="218.55474452554745">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code> | (no value given)</td><td>will show the VU-style meter that the director has by default already</td></tr><tr><td><code>2</code></td><td>will show a green-border around the guest's video when they are talking</td></tr><tr><td><code>3</code></td><td>will show a little green dot in the top-right corner when the guest's talking; this is default for the guest's view already</td></tr><tr><td><code>4</code></td><td>no meter is shown, but a data-attribute named <code>data-loudness</code> is applied to the video element. This can be targeted with CSS to do custom styles via OBS browser source or with <a href="css.md"><code>&#x26;css</code></a></td></tr><tr><td><code>5</code></td><td>has the audio-only background image pulse larger in size when that specific guest is speaking</td></tr></tbody></table>

<figure><img src="../../.gitbook/assets/image (4) (8) (1).png" alt=""><figcaption></figcaption></figure>

## Details

If you add this to a director's/guest's URL, it will show an optional audio style type, when a guest is talking.

When using any `&meterstyle` effect, I now include a data attribute called `data-speaking` to the video element. It will be either 0, 1, or 2. 0 is quiet, 1 is whispering, and 2 is loud. `&meterstyle=4` includes a fine-grain option already for loudness as an attribute, but for basic CSS needs, this option might be more approachable.

You can use this attribute to use CSS to customize your own effects when someone speaks. You can further target what is CSS used based on a specific guest by using each video's stream ID data attribute as well.

### \&meterstyle=4

When using `&meterstyle=4` or greater, the background of an audio-only element is transparent now; not black. I also specifically hide the video-control bar when using `&meterstyle=4`, but you can use [`&videocontrols`](../newly-added-parameters/and-videocontrols.md) to add them back in if needed.

### \&meterstyle=5

It can be used in conjunction with [`&bgimage`](and-bgimage.md) to specific a custom background image for the video, which will pulse in size. ie: `&meterstyle=5&bgimage=./media/avatar1.png`

## Related

{% content-ref url="style.md" %}
[style.md](style.md)
{% endcontent-ref %}
