---
description: Used to position where the mini preview is located by default on screen
---

# \&minipreviewoffset

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&mpo`

## Options

Example: `&minipreviewoffset=60`

<table><thead><tr><th width="295">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given) | <code>0</code></td><td>left-most side of the screen</td></tr><tr><td><code>40</code></td><td>center of the screen</td></tr><tr><td>(integer value) <code>-20</code> to <code>120</code></td><td>defines the position of the mini preview</td></tr></tbody></table>

## Details

Added `&minipreviewoffset` accepts an integer value, `-20` to `120`, which is used to position where the [mini preview](../../source-settings/and-minipreview.md) is located by default on screen. `40` would imply center of the screen, as the mini preview is about 20% of the screen size. `0` (or just `&minipreviewoffset`) is the left-most side of the screen.

<figure><img src="../../.gitbook/assets/image (3) (9).png" alt=""><figcaption><p><code>&#x26;minipreviewoffset=40</code></p></figcaption></figure>

## Related

{% content-ref url="../../source-settings/and-minipreview.md" %}
[and-minipreview.md](../../source-settings/and-minipreview.md)
{% endcontent-ref %}
