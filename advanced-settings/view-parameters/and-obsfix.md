---
description: >-
  Disables or adjusts the sensitivity of the VP8/VP9 Codec packet loss 'fix' for
  OBS
---

# \&obsfix

## Options

| Value            | Description    |
| ---------------- | -------------- |
| (integer value)  |                |
| (no value given) | defaults to 15 |
| 0 \| off         | Turns it off   |

## Details

It's on by default and set to `15` if only using OBS and if using the VP8/VP9 video [codec](../../advanced-settings.md#codec)

* There is a bug in OBS where the VP8 codec (default in most cases) does not handle packet loss events. This function attempts fixes its.
* You can disable this 'fix' by passing it the value `0` or `off`.
* When on, it will trigger a keyframe request to combat pixel smearing caused by packet loss and poor network conditions
* Triggers around every 3-seconds if needed; may not activate often with very light packet loss.
* May lower video quality, or may not be desirable, so this flag lets you disable it.
* Stream pushers can open the debug/stats menu and manually send keyframes also.
* VP9 is far less prone to packet loss issues, but it can still happen with heavy packet loss.
* Increasing the integer value passed to `&obsfix` will reduce the frequency and sensitivity of the keyframe request.
