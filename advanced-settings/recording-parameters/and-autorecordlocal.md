---
description: Records just the local video automatically on their initial load
---

# \&autorecordlocal

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

Example: `&autorecordlocal=2000`

<table><thead><tr><th width="209">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>0</code></td><td>No video recorded; audio recorded as 32-bit PCM lossless.</td></tr><tr><td>(negative integer)</td><td>No video recorded; audio recorded as OPUS at that bitrate in kbps. e.g. <code>&autorecordlocal=-256</code> records audio-only at 256 kbps.</td></tr><tr><td>(positive integer)</td><td>Recorded video bitrate in kbps.</td></tr></tbody></table>

## Details

`&autorecordlocal` will record the local video automatically on their initial load. This applies to the director, guest, scenes, and whatever really.

You can stop/restart recordings as needed via the right-click menu per each video for now, until I can design a nicer UI for managing multi-recording state at least.

You can pass the default recording bitrate as a value to the parameter, like you might if using [`&record`](and-record.md).

### Update in [v23](../../releases/v23.md)

There are buttons in the room settings of the director to start/stop _all_ recordings; both remote/local.

<figure><img src="../../.gitbook/assets/image (6) (1) (2).png" alt=""><figcaption></figcaption></figure>

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
