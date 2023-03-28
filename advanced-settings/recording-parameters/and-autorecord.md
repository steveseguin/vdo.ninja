---
description: >-
  Records the local video and the remote video(s) automatically on their initial
  load
---

# \&autorecord

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

Example: `&autorecord=1500`

| Value              | Description                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `0`                | No video recorded; audio tentatively recorded as 32bit PCM lossless.                              |
| (negative integer) | No video recorded; audio recorded as {integer} kbps OPUS file. eg: -120 - Audio only at 120 kbps. |
| (positive integer) | Recorded video bitrate in kbps.                                                                   |

## Details

`&autorecord` will record the local and remote videos automatically on their initial load. This applies to the director, guest, scenes, and whatever really.

You can stop/restart recordings as needed via the right-click menu per each video for now, until I can design a nicer UI for managing multi-recording state at least.

You can pass the default recording bitrate as a value to the parameter, like you might if using [`&record`](and-record.md).

### Update in V23 (currently on alpha)

There are buttons in the room settings of the director to start/stop _all_ recordings; both remote/local.

<figure><img src="../../.gitbook/assets/image (6) (1) (2).png" alt=""><figcaption></figcaption></figure>

## Related

{% content-ref url="and-record.md" %}
[and-record.md](and-record.md)
{% endcontent-ref %}

{% content-ref url="and-autorecordlocal.md" %}
[and-autorecordlocal.md](and-autorecordlocal.md)
{% endcontent-ref %}

{% content-ref url="and-autorecordremote.md" %}
[and-autorecordremote.md](and-autorecordremote.md)
{% endcontent-ref %}
