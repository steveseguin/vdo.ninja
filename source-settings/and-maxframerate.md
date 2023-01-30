---
description: >-
  Like &fps, except it will allow for lower frame rates if the specific frame
  rate requested failed
---

# \&maxframerate

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&mfr`
* `&mfps`

## Options

Example: `&maxframerate=60`

| Value                    | Description                    |
| ------------------------ | ------------------------------ |
| (positive integer value) | Frame rate (frames per second) |

## Details

Like [`&fps`](../advanced-settings.md#framerateframe-rate), except it will allow for lower frame rates if the specific frame rate requested failed.

You can set `&maxframerate=60` and the system automatically selects 30 if your camera doesn't support a frame rate of 60.

## Related

{% content-ref url="../advanced-settings/video-parameters/and-fps.md" %}
[and-fps.md](../advanced-settings/video-parameters/and-fps.md)
{% endcontent-ref %}
