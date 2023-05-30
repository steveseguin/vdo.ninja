---
description: Lets you manually set the video bitrate for screen-shares
---

# \&screensharebitrate

Viewer-Side Option! ([`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&room`](../general-settings/room.md))

## Aliases

* `&ssbitrate`

## Options

Example: `&screensharebitrate=2500`

<table><thead><tr><th width="216">Value</th><th>Description</th></tr></thead><tbody><tr><td>(integer value)</td><td>video bitrate for screen-shares in kbps</td></tr></tbody></table>

## Details

Lets you manually set the video bitrate for screen-shares in kbps. This is a viewer-side command, and works with scenes link, view links, and guest links.

This specified screen-share bitrate will not count towards the total room or scene bitrate, if those are being used. It also takes priority over most other bitrates parameters, with just a couple exceptions.

## Related

{% content-ref url="../advanced-settings/video-bitrate-parameters/bitrate.md" %}
[bitrate.md](../advanced-settings/video-bitrate-parameters/bitrate.md)
{% endcontent-ref %}
