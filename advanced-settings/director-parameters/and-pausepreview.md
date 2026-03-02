---
description: Reference for the \&pausepreview URL parameter in VDO.Ninja including behavior examples and related options.
---

# \&pausepreview

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&dpp`

## Options

Example: `&pausepreview`

<table><thead><tr><th width="211">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>The guest video previews that a director sees will pause after a period</td></tr></tbody></table>

## Details

Designe for use with the director's control center

After a few seconds, the video of newly joined guests will pause for the director. In most cases, this will also pause the video bitrate too, setting it to zero or near zero.\
\
The director can use buttons available under the video to increase the quality and restart the video if needed.

This approach provides a snapshot and verification that guests who are joining are who they say they are, provides an opportunity for the video quality to stabilize a bit, and yet also reduces the CPU/Network load that a director faces when many multiple guests are joining.

Unlike using `&novideo`, videos can be resumed, but \&novideo may offer even greater resource savings.
