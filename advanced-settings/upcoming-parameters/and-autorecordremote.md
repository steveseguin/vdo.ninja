---
description: Records just the remote video(s) automatically on their initial load
---

# \&autorecordremote

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md),[`&solo`](and-solo.md))\
\* on [https://vdo.ninja/beta/](https://vdo.ninja/beta/)

## Options

| Value              | Description                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `0`                | No video recorded; audio tentatively recorded as 32bit PCM lossless.                              |
| (negative integer) | No video recorded; audio recorded as {integer} kbps OPUS file. Eg: -120 - Audio only at 120 kbps. |
| (positive integer) | Recorded video bitrate in kbps.                                                                   |

## Details

`&autorecordremote` will record the remote video(s) automatically on their initial load. This applies to the director, guest, scenes, and whatever really.

You can stop/restart recordings as needed via the right-click menu per each video for now, until I can design a nicer UI for managing multi-recording state at least.

You can pass the default recording bitrate as a value to the parameter, like you might if using [`&record`](../../source-settings/and-record.md).

## Related

{% content-ref url="../../source-settings/and-record.md" %}
[and-record.md](../../source-settings/and-record.md)
{% endcontent-ref %}

{% content-ref url="and-autorecord.md" %}
[and-autorecord.md](and-autorecord.md)
{% endcontent-ref %}

{% content-ref url="and-autorecordlocal.md" %}
[and-autorecordlocal.md](and-autorecordlocal.md)
{% endcontent-ref %}
