---
description: Applies effects to the video/audio feeds
---

# \&effects

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&effect`

## Options

| Value            | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| (no value given) | Shows a "Digital Video Effects" panel when setting up devices |
| `0`              | Disables effects                                              |
| `1`              | Face tracker                                                  |
| `-1`             | Flip image                                                    |
| `2`              | Mirror image                                                  |
| `-2`             | Flip + mirror image                                           |
| `3`              | Background blur                                               |
| `4`              | Virtual greenscreen                                           |
| `5`              | Background replacement                                        |
| `6`              | Avatar                                                        |
| `9`              | Face tracking                                                 |
| `10`             | Face tracking                                                 |
| `11`             | Anonymous face mask                                           |

## Details

Adding `&effects` to a guest link enables the drop-down menu for Digital Video Effects. The guest can then choose the digital video effect via the drop-down menu.\
![](<../.gitbook/assets/image (11) (2).png>)

This is on by default when using a basic push link outside of a room.

You can pre-select the digital video effect by adding `&effects=X` (see [Options](effects.md#options) above) to a guest/push link.

The guest can change the digital video effect dynamically via the video settings panel if you have added `&effects` to the guest's URL.

You can also pre-select the effect value by adding [`&effectvalue`](../newly-added-parameters/and-effectvalue.md) to the URL. ie: the amount of blur.

### Green screen performance

`&effects=4` enables a virtual green screen on the publisher side.

Green screen doesn't require SIMD support to work, although it won't work as well without it on. There's a little warning info icon (!) if SIMD is not enabled.

Please do enable Webassembly-SIMD support under `chrome://flags/` if you'd like to see a large reduction in CPU load when using this feature.

## Related

{% content-ref url="../newly-added-parameters/and-effectvalue.md" %}
[and-effectvalue.md](../newly-added-parameters/and-effectvalue.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
