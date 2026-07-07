---
description: Applies effects to the video/audio feeds
---

# \&effects

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&effect`

## URL Shortcut Aliases

Each effect also has a dedicated URL parameter alias that can be used instead of `&effects=N`:

| Alias                                                  | Effect                    | Equivalent        |
| ------------------------------------------------------ | ------------------------- | ----------------- |
| [`&backgroundblur`](and-backgroundblur.md) / `&bgblur` | Background blur           | `&effects=3`      |
| [`&greenscreen`](and-greenscreen.md)                   | Digital greenscreen       | `&effects=4`      |
| [`&virtualbackground`](and-virtualbackground.md) / `&vbg` | Virtual background     | `&effects=5`      |
| [`&transparentbg`](and-transparentbg.md)               | Transparent background    | `&effects=16`     |
| [`&facemesh`](and-facemesh.md)                         | Face mesh                 | `&effects=6`      |
| `&digitalzoom`                                         | Digital zoom              | `&effects=7`      |
| [`&chromakey`](and-chromakey.md)                       | Chroma key (remove green) | `&effects=14`     |
| [`&chromakeybg`](and-chromakeybg.md)                   | Chroma key + background   | `&effects=15`     |
| [`&facetracker`](and-facetracker.md) / `&facetracking` | Face tracker             | `&effects=1`      |
| [`&autofacecrop`](and-autofacecrop.md) / `&facecrop`   | Auto face crop            | `&effects=facecrop` |
| [`&overlayfx`](and-overlayfx.md)                       | Overlay image             | `&effects=overlay`|
| [`&anonymousmask`](and-anonymousmask.md) / `&anonmask` | Anonymous mask           | `&effects=anon`   |
| [`&dogface`](and-dogface.md) / `&dogears`              | Dog ears and nose         | `&effects=dog`    |

Aliases that accept a value (e.g. `&backgroundblur=5`, `&chromakey=30`, `&digitalzoom=2.5`) will set the effect value directly without needing a separate [`&effectvalue`](../newly-added-parameters/and-effectvalue.md) parameter.

## Options

Example: `&effects=7` or `&effects=zoom`

<table><thead><tr><th width="227">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>Shows a "Digital Video Effects" panel when setting up devices</td></tr><tr><td><code>0</code> | <code>false</code> | <code>off</code></td><td>Disables effects</td></tr><tr><td><code>1</code> | <code>facetracking</code></td><td>Face tracker (legacy native FaceDetector auto-crop)</td></tr><tr><td><code>facecrop</code> | <code>autofacecrop</code></td><td>Auto face crop with native FaceDetector plus MediaPipe fallback</td></tr><tr><td><code>-1</code></td><td>Flip image</td></tr><tr><td><code>2</code></td><td>Mirror image</td></tr><tr><td><code>-2</code></td><td>Flip + mirror image</td></tr><tr><td><code>3</code></td><td>Background blur</td></tr><tr><td><code>4</code></td><td>Virtual Greenscreen</td></tr><tr><td><code>5</code></td><td>Background replacement</td></tr><tr><td><code>6</code></td><td>Face mesh overlay with bundled MediaPipe FaceLandmarker</td></tr><tr><td><code>7</code> | <code>digitalzoom</code></td><td>Zoom (software-based zoom)</td></tr><tr><td><code>8</code></td><td><a data-mention href="effects.md#and-effects-8">#and-effects-8</a></td></tr><tr><td><code>9</code></td><td>Legacy Jeeliz face-box sample effect</td></tr><tr><td><code>10</code></td><td>Legacy dog ears and nose alias</td></tr><tr><td><code>11</code> | <code>anon</code></td><td>Anonymous face mask</td></tr><tr><td><code>13</code></td><td>New experimental background blur effect; it's not supported by most browsers/systems and its in origin trial</td></tr><tr><td><code>14</code></td><td>Chroma key (remove green)</td></tr><tr><td><code>15</code></td><td>Chroma key with background image</td></tr><tr><td><code>16</code></td><td>Background transparent</td></tr><tr><td><code>overlay</code></td><td>Overlay image</td></tr><tr><td><code>dog</code></td><td>Dog ears and nose</td></tr></tbody></table>

## Details

Adding `&effects` to a guest link enables the drop-down menu for Digital Video Effects. The guest can then choose the digital video effect via the drop-down menu.\
![](<../.gitbook/assets/image (11) (2) (1).png>)

This is on by default when using a basic push link outside of a room.

You can pre-select the digital video effect by adding `&effects=X` (see [Options](effects.md#options) above) to a guest/push link.

The guest can change the digital video effect dynamically via the video settings panel if you have added `&effects` to the guest's URL.

You can also pre-select the effect value by adding [`&effectvalue`](../newly-added-parameters/and-effectvalue.md) to the URL. ie: the amount of blur.

### Effect value memory

When a user manually adjusts an effect's value via the slider (blur amount, zoom level, chroma threshold, etc.), that value is automatically saved to localStorage and tied to the current room and streamID. The password is hashed before being used as part of the storage key, so it is never stored in plaintext. On the next visit to the same room or stream, the saved value is restored automatically. This means different rooms can have different preferred effect settings. Explicitly setting [`&effectvalue`](../newly-added-parameters/and-effectvalue.md) in the URL will override any saved value.

### Greenscreen performance

`&effects=4` enables a virtual Greenscreen on the publisher side.

Green screen doesn't require SIMD support to work, although it won't work as well without it on. There's a little warning info icon (!) if SIMD is not enabled.

Please do enable Webassembly-SIMD support under `chrome://flags/` if you'd like to see a large reduction in CPU load when using this feature.

### Important Note for `&effects=1`

{% hint style="warning" %}
`&effects=1` requires the use of the Chromium experimental face detection API, as I'm using the built-in browser face-tracking model for this. You can enable the API flag here: `chrome://flags/#enable-experimental-web-platform-features`\
My hope is that this feature will eventually be enabled by default within Chromium, as loading a large ML model to do face detection otherwise is a bit heavy; you may need to enable this within the OBS CLI if wishing to use it there?
{% endhint %}

### `&effects=facecrop`

`&effects=facecrop`, `&autofacecrop`, and `&facecrop` enable the newer auto face crop effect. It keeps the sender's face framed by cropping and panning the video through the existing canvas effects pipeline. It first tries the browser's native `FaceDetector` API and falls back to the bundled MediaPipe face detector model when available.

This mode is separate from `&effects=1` for backwards compatibility. Existing `&facetracker`, `&facetracking`, and `&effects=1` links keep their original behavior.

### `&effects=6`

`&effects=6` and `&facemesh` render a face mesh overlay using the bundled MediaPipe FaceLandmarker model. The older TensorFlow.js face mesh path can still be requested with `&legacyfacemesh` or `&tfjsfacemesh`.

### Legacy face effects

`&effects=9` is a legacy Jeeliz sample effect that draws a face-tracking box. `&effects=10` is a legacy alias for the dog ears and nose effect. These values are kept for backwards compatibility.

### `&effects=8`

Added `&effects=8`, which might be useful if using a Camlink or simple HDMI capture device and [`&record`](../advanced-settings/recording-parameters/and-record.md) mode. The current `&record` mode doesn't seem to always scale down the video before recording (browser issue it seems), so local file recordings might be 4K in size, despite the target resolution being set much lower. `&effects=8` will use a canvas to first resize the video though, and then recordings will be based on that, making smaller recording sizes possible. (You could also use `&effects=7`, which then provides digital zooming controls and is otherwise the same thing).

This `&effects=8` mode might also be helpful in solving issues with cameras disconnecting or having their frame rate change while recording, causing issues with the recording. The canvas acts as a reliable middle man between the camera and output video stream, so if the camera's input stream fails, the recording stream will not be impacted, other than perhaps skipping some frames. The canvas is sensitive to CPU load or browser throttling though, so frame rates may fluctuate more often when using it, so I can't suggest using it unless the guest/user is known to have a problematic camera.

### `&effects=7` (Zoom)

[`&effectvalue=1.2`](../newly-added-parameters/and-effectvalue.md) will now work with `&digitalzoom` (`&effects=7`), so you can trigger the camera to digitally zoom in on load. This works regardless of whether the camera supports zooming or not, as it is software based. Software zoom offers lower quality than hardware-based or driver-based zoom, but the zoom effect itself is often quite smooth in comparison to hardware based zoom.

## Related

{% content-ref url="../newly-added-parameters/and-effectvalue.md" %}
[and-effectvalue.md](../newly-added-parameters/and-effectvalue.md)
{% endcontent-ref %}

{% content-ref url="and-backgroundblur.md" %}
[and-backgroundblur.md](and-backgroundblur.md)
{% endcontent-ref %}

{% content-ref url="and-greenscreen.md" %}
[and-greenscreen.md](and-greenscreen.md)
{% endcontent-ref %}

{% content-ref url="and-virtualbackground.md" %}
[and-virtualbackground.md](and-virtualbackground.md)
{% endcontent-ref %}

{% content-ref url="and-transparentbg.md" %}
[and-transparentbg.md](and-transparentbg.md)
{% endcontent-ref %}

{% content-ref url="and-chromakey.md" %}
[and-chromakey.md](and-chromakey.md)
{% endcontent-ref %}

{% content-ref url="and-chromakeybg.md" %}
[and-chromakeybg.md](and-chromakeybg.md)
{% endcontent-ref %}

{% content-ref url="and-facemesh.md" %}
[and-facemesh.md](and-facemesh.md)
{% endcontent-ref %}

{% content-ref url="and-facetracker.md" %}
[and-facetracker.md](and-facetracker.md)
{% endcontent-ref %}

{% content-ref url="and-autofacecrop.md" %}
[and-autofacecrop.md](and-autofacecrop.md)
{% endcontent-ref %}

{% content-ref url="and-overlayfx.md" %}
[and-overlayfx.md](and-overlayfx.md)
{% endcontent-ref %}

{% content-ref url="and-anonymousmask.md" %}
[and-anonymousmask.md](and-anonymousmask.md)
{% endcontent-ref %}

{% content-ref url="and-dogface.md" %}
[and-dogface.md](and-dogface.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
