---
description: Does a few things when it detects motion in a video
---

# \&motiondetection

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&motionswitch`

## Options

Example: `&motiondetection=40`

<table><thead><tr><th width="294">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code> to <code>64</code></td><td>sensitivity of the motion detection trigger as a value</td></tr><tr><td>(no value given)</td><td>sensitivity <code>15</code> of the motion detection trigger</td></tr></tbody></table>

## Details

`&motiondetection` does a few things when it detects motion in a video (viewer-side).

It will feature highlight the specific video where movement is detected, if more than one video is included in the mix. Using a custom [`&layout`](and-layout.md) will disable this feature though, and use the layout instead.

It will also trigger an IFrame API event, which might be useful if you want to use VDO.Ninja as a security camera; you could script things to auto-record the video or log data events.

It will also switch to itself in OBS as a scene, which might be how this will be mainly used. (you need to have the OBS browser source's page permission set to high to allow this to actually work)

You can adjust the sensitivity of the motion detection trigger as a value; the default I think is 15, but it can be between 1 and 64 I think.

## Related

{% content-ref url="../view-parameters/activespeaker.md" %}
[activespeaker.md](../view-parameters/activespeaker.md)
{% endcontent-ref %}
