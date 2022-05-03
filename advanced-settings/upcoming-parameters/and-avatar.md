---
description: Adds the ability to select an image, instead of a video device
---

# \&avatar

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

| Value            | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| default          | will pre-select the default avatar, rather than leaving it un-selected |
| (no value given) | adds the ability to select an image, instead of a video device         |

## Details

`&avatar` adds the ability to select an image, instead of a video device. The image will trigger when the video is muted or no video device is selected. A default avatar image is provided, but you can select your own from disk. `&avatar=default` will pre-select the default avatar, rather than leaving it un-selected.

![](<../../.gitbook/assets/image (104).png>)

## Related

{% content-ref url="../newly-added-parameters/and-waitimage.md" %}
[and-waitimage.md](../newly-added-parameters/and-waitimage.md)
{% endcontent-ref %}