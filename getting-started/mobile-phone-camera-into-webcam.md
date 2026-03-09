---
description: Use an iPhone or Android phone as a webcam with VDO.Ninja, OBS, and OBS Virtual Camera, including optional audio setup guidance.
---

# Use a mobile phone as a webcam with VDO.Ninja

VDO.Ninja is one of the easiest ways to turn an iPhone or Android phone into a webcam for OBS, Zoom, Google Meet, Teams, and other apps that can use OBS Virtual Camera or a browser source. This page covers the simplest workflow and points to the full step-by-step guides if you need audio routing or more advanced setup.

{% hint style="info" %}
This set of instructions will work for Windows, macOS, and Linux.
{% endhint %}

## Simple steps

1. Go to [https://vdo.ninja/?push](https://vdo.ninja/?push) with your mobile phone and start sharing your camera.
2. Add your VDO.Ninja `view` link as a Browser Source in OBS in a scene.
   1. Select the "Control audio via OBS" option to bring audio in.
   2. Resize the source as you see fit.
3. Configure OBS Virtual Camera to use the scene or source as the output selection.
4. Select "Start Virtual Camera" in OBS.
5. Open your third-party program and choose "OBS Virtual Camera" as the video input.

Detailed steps on how to perform this setup and include audio from the device are explained [here](../guides/use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md).

## Use cases

OBS Virtual Camera is fully compatible with VDO.Ninja and is useful for connecting multiple different OBS mixers together remotely, turning your smartphone into a webcam, or sharing a live show with a small group of collaborators in near real time.

## Notes

Sometimes you may need to stop and restart OBS Virtual Camera if it starts crashing your computer. If you see nothing but grey, start the virtual camera before using it. If you see only black, it is usually because there is nothing active in OBS yet.

More related guides with more detail:

{% content-ref url="../guides/use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md" %}
[use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md](../guides/use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md)
{% endcontent-ref %}

{% content-ref url="../guides/syncing-usb-audio-with-vdo.ninja-greater-than-obs-virtual-camera.md" %}
[syncing-usb-audio-with-vdo.ninja-greater-than-obs-virtual-camera.md](../guides/syncing-usb-audio-with-vdo.ninja-greater-than-obs-virtual-camera.md)
{% endcontent-ref %}
