---
description: Toggles list of hidden guests
---

# \&showlist

Sender-Side Option! ([`&push`](push.md))

## Options

| Value | Description                             |
| ----- | --------------------------------------- |
| 0     | Force disable the list of hidden guests |
| 1     | Force enable the list of hidden guests  |

## Details

Should list user's labels in a list, along with whether they are video-muted or not, etc.\
Includes microphone mute states and voice activity meters in the list.\
Isn't visible by default in scenes, faux rooms, or when using [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) mode.
