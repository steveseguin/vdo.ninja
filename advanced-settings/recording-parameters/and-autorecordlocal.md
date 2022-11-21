---
description: Records just the local video automatically on their initial load
---

# \&autorecordlocal

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

| Value              | Description                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `0`                | No video recorded; audio tentatively recorded as 32bit PCM lossless.                              |
| (negative integer) | No video recorded; audio recorded as {integer} kbps OPUS file. eg: -120 - Audio only at 120 kbps. |
| (positive integer) | Recorded video bitrate in kbps.                                                                   |

## Details

`&autorecordlocal` will record the local video automatically on their initial load. This applies to the director, guest, scenes, and whatever really.

You can stop/restart recordings as needed via the right-click menu per each video for now, until I can design a nicer UI for managing multi-recording state at least.

You can pass the default recording bitrate as a value to the parameter, like you might if using [`&record`](and-record.md).

## Related

{% content-ref url="and-record.md" %}
[and-record.md](and-record.md)
{% endcontent-ref %}

{% content-ref url="and-autorecord.md" %}
[and-autorecord.md](and-autorecord.md)
{% endcontent-ref %}

{% content-ref url="and-autorecordremote.md" %}
[and-autorecordremote.md](and-autorecordremote.md)
{% endcontent-ref %}
