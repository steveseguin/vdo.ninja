---
description: >-
  Records the local video and the remote video(s) automatically on their initial
  load
---

# \&autorecord

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

Example: `&autorecord=1500`

<table><thead><tr><th width="187">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>0</code></td><td>No video recorded; audio tentatively recorded as 32bit PCM lossless.</td></tr><tr><td>(negative integer)</td><td>No video recorded; audio recorded as {integer} kbps OPUS file. eg: -120 - Audio only at 120 kbps.</td></tr><tr><td>(positive integer)</td><td>Recorded video bitrate in kbps.</td></tr></tbody></table>

## Details

`&autorecord` will record the local and remote videos automatically on their initial load. This applies to the director, guest, scenes, and whatever really.

You can stop/restart recordings as needed via the right-click menu per each video for now, until I can design a nicer UI for managing multi-recording state at least.

You can pass the default recording bitrate as a value to the parameter, like you might if using [`&record`](and-record.md).

### Update in [v23](../../releases/v23.md)

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
