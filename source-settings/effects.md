---
description: Applies effects to the video/audio feeds
---

# \&effects

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&effect`

## Options

Example: `&effects=7` or `&effects=zoom`

<table><thead><tr><th width="227">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>Shows a "Digital Video Effects" panel when setting up devices</td></tr><tr><td><code>0</code> | <code>false</code> | <code>off</code></td><td>Disables effects</td></tr><tr><td><code>1</code> | <code>facetracking</code></td><td>Face tracker</td></tr><tr><td><code>-1</code></td><td>Flip image</td></tr><tr><td><code>2</code></td><td>Mirror image</td></tr><tr><td><code>-2</code></td><td>Flip + mirror image</td></tr><tr><td><code>3</code></td><td>Background blur</td></tr><tr><td><code>4</code></td><td>Virtual Greenscreen</td></tr><tr><td><code>5</code></td><td>Background replacement</td></tr><tr><td><code>6</code></td><td>Avatar</td></tr><tr><td><code>7</code> | <code>zoom</code></td><td>Zoom</td></tr><tr><td><code>8</code></td><td><a data-mention href="effects.md#and-effects-8">#and-effects-8</a></td></tr><tr><td><code>9</code></td><td>Face tracking</td></tr><tr><td><code>10</code></td><td>Face tracking</td></tr><tr><td><code>11</code> | <code>anon</code></td><td>Anonymous face mask</td></tr><tr><td><code>13</code></td><td>New experimental background blur effect; it's not supported by most browsers/systems and its in origin trial</td></tr></tbody></table>

## Details

Adding `&effects` to a guest link enables the drop-down menu for Digital Video Effects. The guest can then choose the digital video effect via the drop-down menu.\
![](<../.gitbook/assets/image (11) (2) (1).png>)

This is on by default when using a basic push link outside of a room.

You can pre-select the digital video effect by adding `&effects=X` (see [Options](effects.md#options) above) to a guest/push link.

The guest can change the digital video effect dynamically via the video settings panel if you have added `&effects` to the guest's URL.

You can also pre-select the effect value by adding [`&effectvalue`](../newly-added-parameters/and-effectvalue.md) to the URL. ie: the amount of blur.

### Greenscreen performance

`&effects=4` enables a virtual Greenscreen on the publisher side.

Green screen doesn't require SIMD support to work, although it won't work as well without it on. There's a little warning info icon (!) if SIMD is not enabled.

Please do enable Webassembly-SIMD support under `chrome://flags/` if you'd like to see a large reduction in CPU load when using this feature.

### Important Note for `&effects=1`

{% hint style="warning" %}
`&effects=1` requires the use of the Chromium experimental face detection API, as I'm using the built-in browser face-tracking model for this. You can enable the API flag here: `chrome://flags/#enable-experimental-web-platform-features`\
My hope is that this feature will eventually be enabled by default within Chromium, as loading a large ML model to do face detection otherwise is a bit heavy; you may need to enable this within the OBS CLI if wishing to use it there?
{% endhint %}

### `&effects=8`

Added `&effects=8`, which might be useful if using a Camlink or simple HDMI capture device and [`&record`](../advanced-settings/recording-parameters/and-record.md) mode. The current `&record` mode doesn't seem to always scale down the video before recording (browser issue it seems), so local file recordings might be 4K in size, despite the target resolution being set much lower. `&effects=8` will use a canvas to first resize the video though, and then recordings will be based on that, making smaller recording sizes possible. (You could also use `&effects=7`, which then provides digital zooming controls and is otherwise the same thing).

This `&effects=8` mode might also be helpful in solving issues with cameras disconnecting or having their frame rate change while recording, causing issues with the recording. The canvas acts as a reliable middle man between the camera and output video stream, so if the camera's input stream fails, the recording stream will not be impacted, other than perhaps skipping some frames. The canvas is sensitive to CPU load or browser throttling though, so frame rates may fluctuate more often when using it, so I can't suggest using it unless the guest/user is known to have a problematic camera.

### `&effects=7` (Zoom)

[`&effectvalue=1.2`](../newly-added-parameters/and-effectvalue.md) will now work with `&zoom` (`&effects=7`), so you can trigger the camera to digitally zoom in on load.

## Related

{% content-ref url="../newly-added-parameters/and-effectvalue.md" %}
[and-effectvalue.md](../newly-added-parameters/and-effectvalue.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
