---
description: Same as &audiodevice or &videodevice, but applies to both
---

# \&device

## Aliases

* `&d`

## Options

| Value          | Description                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 0              | disable the audio and video devices; no option to change it during setup is provided                                                    |
| 1              | auto-select the default video and audio devices; no option to change it will be allowed                                                 |
| (string value) | auto-select a video & audio device that has a label containing that same string; whitespaces in names can be replaced with underscores. |

## Details

If you set `&device=0`, you disable audio and video inputs, but chat is still available.\
Chat-only guests can access a group-room this way.

## Related

{% content-ref url="videodevice.md" %}
[videodevice.md](videodevice.md)
{% endcontent-ref %}

{% content-ref url="audiodevice.md" %}
[audiodevice.md](audiodevice.md)
{% endcontent-ref %}
