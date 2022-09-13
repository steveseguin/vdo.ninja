---
description: Applies effects to the video/audio feeds
---

# \&effects

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&effect`

## Options

| Value                 | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| (no value given)      | Shows a "Digital Video Effects" panel when setting up devices |
| `0`                   | Disables effects                                              |
| `1` \| `facetracking` | Face tracker                                                  |
| `-1`                  | Flip image                                                    |
| `2`                   | Mirror image                                                  |
| `-2`                  | Flip + mirror image                                           |
| `3`                   | Background blur                                               |
| `4`                   | Virtual Greenscreen                                           |
| `5`                   | Background replacement                                        |
| `6`                   | Avatar                                                        |
| `7` \| `zoom`\*       | Zoom                                                          |
| `9`                   | Face tracking                                                 |
| `10`                  | Face tracking                                                 |
| `11`                  | Anonymous face mask                                           |

\*on alpha

## Details

Adding `&effects` to a guest link enables the drop-down menu for Digital Video Effects. The guest can then choose the digital video effect via the drop-down menu.\
![](<../.gitbook/assets/image (11) (2).png>)

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
``My hope is that this feature will eventually be enabled by default within Chromium, as loading a large ML model to do face detection otherwise is a bit heavy; you may need to enable this within the OBS CLI if wishing to use it there?
{% endhint %}

## Related

{% content-ref url="../newly-added-parameters/and-effectvalue.md" %}
[and-effectvalue.md](../newly-added-parameters/and-effectvalue.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
