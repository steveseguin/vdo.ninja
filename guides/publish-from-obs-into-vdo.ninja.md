---
description: Publish an OBS scene into VDO.Ninja using OBS Virtual Camera and a virtual audio cable, with notes on WHIP and server-based alternatives.
---

# Publish from OBS into VDO.Ninja

If you want to use an OBS scene, source, crop, or full program output as the camera feed in VDO.Ninja, the most reliable general workflow is:

1. Build the shot in OBS
2. Output that shot with OBS Virtual Camera
3. Route the audio you want with a virtual audio cable
4. Select those devices in a VDO.Ninja push link

This approach is useful when:

* You want a polished OBS scene to appear as a live camera in VDO.Ninja
* You want to send a composited feed into a room, guest slot, or interview
* You want to send only a cropped or branded version of a camera instead of the raw source
* You want to keep your main program output separate from your VDO.Ninja contribution

For most users, this is the best default option. It is mature, flexible, low latency, and does not depend on newer WHIP support.

## What you need

* OBS Studio v26 or newer
* OBS Virtual Camera
* A virtual audio cable
  * Windows or macOS: [VB-CABLE](https://www.vb-audio.com/Cable/)
  * macOS alternatives: see [macOS audio capture options](../platform-specific-issues/macos.md#capturing-audio)
* A Chromium-based browser is recommended for the VDO.Ninja sender side

## Why this method is recommended

OBS Virtual Camera lets you turn an OBS scene into a webcam device that browsers can use. That means VDO.Ninja can treat your OBS output just like a normal camera, while OBS remains the place where you do the compositing, cropping, branding, scene switching, and filtering.

Because the VDO.Ninja sender runs separately from your main OBS output pipeline, this also keeps your workflow modular. If you are already streaming, recording, or routing signals elsewhere from OBS, you do not need to rebuild those paths just to send one feed into VDO.Ninja.

## Step 1: Build the shot you want in OBS

Create the scene or source you want VDO.Ninja to use.

That can be:

* A full scene
* A single cropped camera
* A branded lower-third scene
* A split-screen layout
* A source with filters, color correction, or overlays applied

If needed, create a dedicated scene just for VDO.Ninja. This is often cleaner than reusing your full live program scene.

## Step 2: Start OBS Virtual Camera

In OBS, start the Virtual Camera.

If your OBS version allows selecting the source for Virtual Camera output, point it at the specific scene or source you built for VDO.Ninja. If not, route the desired scene through your active virtual camera output path.

Official OBS Virtual Camera guide:

* [OBS Virtual Camera Guide](https://obsproject.com/kb/virtual-camera-guide)

## Step 3: Route audio from OBS to a virtual audio cable

OBS does not include a built-in virtual microphone device, so you normally need a virtual audio cable for audio.

In OBS:

1. Open **Settings** -> **Audio** or **Advanced**
2. Set the **Monitoring Device** to your virtual audio cable input
3. Open **Advanced Audio Properties**
4. For each source you want to send to VDO.Ninja, set **Audio Monitoring** to `Monitor and Output`

This lets OBS send selected audio sources into the virtual cable, which VDO.Ninja can then use as a microphone.

{% hint style="info" %}
This is also where you create a mix-minus. If you are feeding OBS audio back into a live room or group call, only monitor the sources you want remote participants to hear. Do not send their own return audio back to them unless you intentionally want that.
{% endhint %}

For more audio routing options:

* [Audio guide](audio.md)

## Step 4: Open a VDO.Ninja push link

Open your VDO.Ninja push link in a browser.

Then select:

* **Camera:** `OBS Virtual Camera`
* **Microphone:** your virtual audio cable

At that point, your OBS scene is now your VDO.Ninja source.

If you want, you can also combine the OBS audio feed with a live microphone by holding `CTRL` or `CMD` while selecting audio devices in supported browsers.

## Step 5: Tune resolution and frame rate when needed

If the browser does not detect the correct frame rate or aspect ratio from OBS Virtual Camera, you can force the values with URL parameters on the push link.

Examples:

* `&framerate=60`
* `&width=1920&height=1080`
* `&width=720&height=1280`

{% hint style="info" %}
Start OBS Virtual Camera before selecting it in VDO.Ninja. If you select it first and activate it later, the browser may cache the wrong aspect ratio or frame rate.
{% endhint %}

{% hint style="info" %}
If you force `&width` and `&height`, make them match the actual OBS output resolution for that virtual camera feed. Mismatches can cause scaling or framing issues.
{% endhint %}

## Common use cases

### Send a polished scene into a VDO.Ninja room

Use a dedicated scene with your chosen camera crop, graphics, and audio mix, then select it via OBS Virtual Camera in a normal VDO.Ninja push link.

### Send only a clean camera crop

If you have a wide camera in OBS but only want one crop or composition to appear in VDO.Ninja, build that crop in OBS and expose only that shot through Virtual Camera.

### Use OBS as a browser-based contribution encoder

This is a practical way to send a prepared video feed into browser-based production systems, remote interviews, green rooms, or guest workflows without sending the raw camera directly.

## Alternatives

### Publish directly from OBS using WHIP

OBS also supports WHIP output, and VDO.Ninja supports receiving WHIP streams.

This can remove the browser from the publishing side, but it is still a more advanced path and can be less forgiving depending on OBS version, NAT behavior, encoder settings, and the network environment.

Start here if you want to test that path:

* [From OBS to VDO.Ninja using WHIP](from-obs-to-vdo.ninja-using-whip.md)
* [Recommended OBS WHIP settings](obs-whip-output-settings.md)

### Share media directly from inside OBS

If you want OBS itself to host the VDO.Ninja sender page in a dock or browser source, see:

* [How to share webcam from inside OBS](share-webcam-from-inside-obs.md)

### Use a server bridge such as MediaMTX

If your media is already being published to a server, or if you want VDO.Ninja viewers to consume a WHEP feed instead of a local browser camera feed, a WHIP/WHEP server such as MediaMTX can also fit into the workflow.

That path is usually better for specialized server-based routing than for the default "send an OBS scene into VDO.Ninja" use case.

## Troubleshooting

### The video looks stretched or the crop is wrong

* Start OBS Virtual Camera before opening the VDO.Ninja device picker
* Confirm the OBS output resolution matches any forced `&width` and `&height` values
* Re-select the camera in the browser after changing OBS virtual camera state

### Audio is missing

* Confirm the OBS Monitoring Device is set to the virtual audio cable
* Confirm the relevant OBS sources are set to `Monitor and Output`
* Confirm the virtual cable is selected as the microphone in VDO.Ninja

### Remote participants hear themselves

Your OBS audio mix is feeding return audio back into the room. Revisit your monitored sources and rebuild the mix-minus so only intended sources are sent to the virtual cable.

### The frame rate is lower than expected

Try forcing the sender link with `&framerate=30` or `&framerate=60`, depending on your OBS output.

## Summary

If your goal is to get an OBS-built shot into VDO.Ninja, use OBS Virtual Camera for video and a virtual audio cable for audio first. It is the most broadly compatible and production-friendly workflow.

Use WHIP when you specifically want direct OBS publishing and are prepared to tune around the additional constraints.
