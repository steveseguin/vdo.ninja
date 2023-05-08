---
description: >-
  If the total bitrate drops below the specified bitrate, the viewer will
  auto-hide the audio and video for that stream
---

# \&bitratecutoff

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&bitcut`

## Options

Example: `&bitratecutoff=500`

| Value            | Description                   |
| ---------------- | ----------------------------- |
| (no value given) | video cuts off under 300-kbps |
| (integer value)  | cut off bitrate in kbps       |

## Details

`&bitratecutoff` is a viewer-side parameter. If the total bitrate drops below the specified bitrate (default value of 300), the viewer will auto-hide the audio and video for that stream. It will un-hide once the average bitrate returns above 300-kbps.

{% hint style="info" %}
There is a 3-second delay in calculating the average bitrate. Won't work with viewers that are Firefox/Safari; just Chrome/Chromium, so OBS, vMix, Electron Capture, Chrome. This is because Firefox/Safari lack the stats in VDO.Ninja needed to trigger this.
{% endhint %}

## Related

{% content-ref url="../settings-parameters/and-cutscene.md" %}
[and-cutscene.md](../settings-parameters/and-cutscene.md)
{% endcontent-ref %}

{% content-ref url="and-statsinterval.md" %}
[and-statsinterval.md](and-statsinterval.md)
{% endcontent-ref %}
