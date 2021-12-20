---
description: Same as &audiodevice or &videodevice, but applies to both.
---

# \&device

## Options

| Value          | Description                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 0              | disable the audio/video devices. No option to change it during setup is provided.                                                       |
| 1              | auto-select the default video / audio devices. No option to change it will be allowed.                                                  |
| (string value) | auto-select a video & audio device that has a label containing that same string. Whitespaces in names can be replaced with underscores. |

## Details

If you set `&device=0`, you disable audio and video inputs, but chat is still available.\
Chat-only guests can access a group-room this way.
