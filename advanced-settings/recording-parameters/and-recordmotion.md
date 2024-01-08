---
description: >-
  Takes a video snapshot and saves it to disk whenever there is motion detected
  in a video
---

# \&recordmotion

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Aliases

* `&motionrecord`

## Options

Example: `&recordmotion=15`

<table><thead><tr><th width="195">Value</th><th>Description</th></tr></thead><tbody><tr><td>(integer value)</td><td>will control the sensitivity of the motion capture</td></tr></tbody></table>

## Details

`&recordmotion` takes a video snapshot and saves it to disk as a PNG file whenever there is motion detected in a video.

* Auto saves (to download folder) one photo per second, max.
* It can take values, such as `&recordmotion=15`, which will control the sensitivity of the motion capture
* It's primarily designed for the sender-side, but I think it should work if a viewer also
* I don't think this will work within OBS, so Chrome/Chromium is recommended instead
* I guess the point of this is to allow for basic security camera operation, but also as a source of inspiration for other ideas
* File name of the saved file contains the timestamp
