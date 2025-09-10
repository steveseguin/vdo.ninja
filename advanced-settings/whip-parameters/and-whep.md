---
description: Play a WHEP endpoint as a viewer input
---

# \&whep

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&whepplay`

## Options

Example:

`&whep=https%3A%2F%2Fwhep.example.com%2Fpath%2Fto%2Fendpoint`

| Value | Description              |
| ----- | ------------------------ |
| URL   | WHEP playback endpoint  |

## Details

- Adds a WHEP video/audio source into the current view/scene layout.
- Use with [`&wheptoken`](and-wheptoken.md) if the WHEP endpoint requires a bearer token.
- Honors normal viewer filters (e.g., `&novideo`, `&noaudio`).

## Related

{% content-ref url="and-wheptoken.md" %}
[and-wheptoken.md](and-wheptoken.md)
{% endcontent-ref %}

{% content-ref url="and-whepwait.md" %}
[and-whepwait.md](and-whepwait.md)
{% endcontent-ref %}

