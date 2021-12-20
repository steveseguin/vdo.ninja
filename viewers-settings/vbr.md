---
description: Sets the audio bitrate to be variable, instead of constant
---

# \&vbr

## Details

Sets the audio bitrate to be variable, instead of constant, but only when an audio bitrate is manually specified.

By default, Chrome uses a variable bitrate with a cap at around 32-kbps with mono-audio.

When manually specifying a bitrate, Chrome keeps the audio bitrate pretty constant, even if VBR is turned on.
