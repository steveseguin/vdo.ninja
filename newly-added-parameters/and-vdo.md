---
description: >-
  Like &videodevice for selecting a default video device, but you can still
  choose to change the camera
---

# \&vdo

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Options

| Value          | Description                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 0              | disable the video camera automatically. No option to change it during setup is provided.                                                   |
| 1              | auto-select the default video camera. No option to change it will be allowed.                                                              |
| (string value) | auto-select a video device that has a label containing that same string / deviceID. Whitespaces in names can be replaced with underscores. |

## Details

`&vdo` is just like [`&videodevice`](../source-settings/videodevice.md) for selecting a default video device, but you can still choose to change the camera before joining when using `&vdo`.

![](<../.gitbook/assets/image (45).png>)

## Related

{% content-ref url="../source-settings/videodevice.md" %}
[videodevice.md](../source-settings/videodevice.md)
{% endcontent-ref %}
