---
description: >-
  Sets the audio mode for screen-shares to stereo and changes default audio
  settings to improve audio quality
---

# \&screensharestereo

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&ssproaudio`
* `&sss`

## Options

Example: `&screensharestereo=1`

<table><thead><tr><th width="226">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>It behaves like 3 or 1, depending on if you are a guest or not</td></tr><tr><td><code>0</code></td><td>will try to down-mix the screen-share to mono. Does not enable any pro-audio settings</td></tr><tr><td><code>1</code></td><td>enables it for both push and view (if used on both links)</td></tr><tr><td><code>2</code></td><td>enables it just for viewing requests and not publishing requests</td></tr><tr><td><code>3</code></td><td>enables it for just publishing requests and not viewing requests</td></tr><tr><td><code>4</code></td><td>enables 5.1-multichannel audio support (Experimental and may require a Chrome flag to be set)</td></tr><tr><td><code>5</code></td><td>This is the default if nothing is set. It behaves like 3 or 1, depending on if you are a guest or not</td></tr></tbody></table>

View [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) for more details.

## Details

Like [`&proaudio`](../advanced-settings/audio-parameters/and-proaudio.md) but for screen-shares.

## Related

{% content-ref url="../advanced-settings/audio-parameters/and-proaudio.md" %}
[and-proaudio.md](../advanced-settings/audio-parameters/and-proaudio.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/stereo.md" %}
[stereo.md](../general-settings/stereo.md)
{% endcontent-ref %}
