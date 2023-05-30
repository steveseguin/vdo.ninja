---
description: Optional audio meter style type
---

# \&meterstyle

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&director`](../../viewers-settings/director.md))

## Aliases

* `&meter`

## Options

Example: `&meterstyle=3`

<table><thead><tr><th width="218.55474452554745">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code> | (no value given)</td><td>will show the VU-style meter that the director has by default already</td></tr><tr><td><code>2</code></td><td>will show a green-border around the guest's video when they are talking</td></tr><tr><td><code>3</code></td><td>will show a little green dot in the top-right corner when the guest's talking; this is default for the guest's view already</td></tr><tr><td><code>4</code></td><td>no meter is shown, but a data-attribute named <code>data-loudness</code> is applied to the video element. This can be targeted with CSS to do custom styles via OBS browser source or with <a href="css.md"><code>&#x26;css</code></a></td></tr></tbody></table>

<figure><img src="../../.gitbook/assets/image (4) (8) (1).png" alt=""><figcaption></figcaption></figure>

## Details

If you add this to a director's/guest's URL, it will show an optional audio style type, when a guest is talking.

## Related

{% content-ref url="style.md" %}
[style.md](style.md)
{% endcontent-ref %}
