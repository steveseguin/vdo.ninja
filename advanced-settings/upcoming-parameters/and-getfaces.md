---
description: Will request a continuous stream of face bounding boxes
---

# \&getfaces

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md),[`&solo`](and-solo.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&pushfaces`

## Details

`&getfaces` on the viewer link will request a continuous stream of face bounding boxes, for all inbound videos and all faces contained within. The data is transmitted to the parent IFRAME, and this data can be used for moving the IFrame window around, if you wish to make your own custom face-tracker or whatever else.

{% hint style="warning" %}
`&getfaces` requires the use of the Chromium experimental face detection API, as I'm using the built-in browser face-tracking model for this. You can enable the API flag here: `chrome://flags/#enable-experimental-web-platform-features`\
``My hope is that this feature will eventually be enabled by default within Chromium, as loading a large ML model to do face detection otherwise is a bit heavy; you may need to enable this within the OBS CLI if wishing to use it there?
{% endhint %}
