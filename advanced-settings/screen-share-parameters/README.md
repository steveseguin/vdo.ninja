---
description: Labels, audio filters, type, bitrate, quality etc.
---

# Screen-share Parameters

Screen-share parameters are separated by where they are applied:

* **Source side** options belong on publisher links, such as [`&push`](../../source-settings/push.md), guest invite links, or room participants who will share a screen.
* **Viewer side** options belong on receive links, such as [`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md), and control how incoming screen shares are requested or displayed.

Use [`&screensharehide`](../../newly-added-parameters/and-screensharehide.md) when the screen-sharing publisher should not see their own local screen-share preview. Use [`&noscreenshare`](and-noscreenshare.md) when a viewer or scene link should not load incoming screen shares.

## General options

| Parameter | Explanation |
| --- | --- |
| [`&screensharestereo`](../../newly-added-parameters/and-screensharestereo.md) | Sets the audio mode for screen-shares to stereo and changes default audio settings to improve audio quality |

## Source side options

| Parameter | Explanation |
| --- | --- |
| [`&screenshare`](../../source-settings/screenshare.md) | Disables camera-sharing as an option |
| [`&screenshare2`](../../newly-added-parameters/and-screenshare2.md) | Shows the "Share your Screen" button before asking the user to select screen-share options |
| [`&screenshareaec`](../../newly-added-parameters/and-screenshareaec.md) | Turns automatic echo cancellation for screen-shares on or off |
| [`&screenshareautogain`](../../newly-added-parameters/and-screenshareautogain.md) | Turns audio auto-normalization for screen-shares on or off |
| [`&screensharecursor`](../../source-settings/cursor.md) | Attempts to show the mouse cursor on screen shares |
| [`&screensharedenoise`](../../newly-added-parameters/and-screensharedenoise.md) | Turns audio noise reduction for screen-shares on or off |
| [`&screensharefps`](../../source-settings/screensharefps.md) | Sets a target FPS for a screen share |
| [`&screensharehide`](../../newly-added-parameters/and-screensharehide.md) | Hides the publisher's local screen-share preview window |
| [`&screenshareid`](../../source-settings/screenshareid.md) | Pre-sets the stream ID for a secondary screen-share stream |
| [`&screensharelabel`](../../newly-added-parameters/and-screensharelabel.md) | Gives the screen-share stream the same label as the guest |
| [`&screensharequality`](../../source-settings/screensharequality.md) | Sets a custom screen-share quality |
| [`&screensharecontenthint`](and-screensharecontenthint.md) | `=motion` prioritizes frame rate; `=detail` prioritizes resolution |
| [`&screenshareaspectratio`](and-screenshareaspectratio.md) | Changes the screen-share aspect ratio on the publisher side |
| [`&screensharetype`](../../newly-added-parameters/and-screensharetype.md) | Defines how a guest's webcam and screen share interact in a room |
| [`&smallshare`](and-smallshare.md) | Makes the screen share behave like a webcam share |
| [`&screensharevideoonly`](../../newly-added-parameters/and-screensharevideoonly.md) | Disables the option to select audio when screen sharing |
| [`&screensharebutton`](../settings-parameters/and-screensharebutton.md) | Forces the screen-share button to appear for guests |
| [`&suppresslocalaudio`](and-suppresslocalaudio.md) | Disables local audio playback of a Chrome tab while screen-sharing it |
| [`&prefercurrenttab`](and-prefercurrenttab.md) | Makes the current tab the default screen-share source |
| [`&selfbrowsersurface`](and-selfbrowsersurface.md) | Excludes the current tab as a screen-share source option |
| [`&systemaudio`](and-systemaudio.md) | Excludes system audio as an audio source when display sharing |
| [`&displaysurface`](and-displaysurface.md) | Pre-selects display-share rather than tab-share when screen-sharing |
| [`&screenwhep`](and-screenwhep.md) | Chooses whether screen-shares prefer WHEP relays or stay P2P |
| [`&screensharestyle`](and-screensharestyle.md) | Selects a screen-share layout style preset |

## Viewer side options

| Parameter | Explanation |
| --- | --- |
| [`&screensharebitrate`](../../newly-added-parameters/and-screensharebitrate.md) | Manually sets the video bitrate for incoming screen shares |
| [`&sharperscreen`](and-sharperscreen.md) | Sets [`&scale=100`](../view-parameters/scale.md), but only for screen-shares |
| [`&sspaused`](../../parameters-only-on-beta/and-sspaused.md) | Starts incoming screen shares paused |
| [`&allowscreenvideo`](and-allowscreenmedia.md)<br>[`&allowscreenaudio`](and-allowscreenmedia.md) | Force-enables or blocks incoming screen-share video/audio tracks on a viewer link |
| [`&noscreenshare`](and-noscreenshare.md) | Prevents viewer and scene links from loading incoming screen shares |
