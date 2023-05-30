---
description: >-
  Like &videodevice for selecting a default video device, but you can still
  choose to change the camera
---

# \&vdo

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Options

Example: `&vdo=BRIO_4K`

<table><thead><tr><th width="181.57142857142856">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>0</code></td><td>disable the video camera automatically</td></tr><tr><td><code>1</code></td><td>auto-select the default video camera</td></tr><tr><td>(string value)</td><td>auto-select a video device that has a label containing that same string / device ID. Whitespaces in names can be replaced with underscores.</td></tr></tbody></table>

## Details

`&vdo` is just like [`&videodevice`](../source-settings/videodevice.md) for selecting a default video device, but you can still choose to change the camera before joining when using `&vdo`.

![](<../.gitbook/assets/image (45).png>)

## Related

{% content-ref url="../source-settings/videodevice.md" %}
[videodevice.md](../source-settings/videodevice.md)
{% endcontent-ref %}
