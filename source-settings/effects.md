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
| (no value given) | Shows a "Digital video effects" panel when setting up devices |
| 0                | Disables effects                                              |
| 1                | Face tracker                                                  |
| 2                | Mirror image                                                  |
| 3                | Background blur                                               |
| 4                | Virtual greenscreen                                           |
| 5                | Background replacement                                        |
| 6                | Avatar                                                        |
| 9                | Face tracking                                                 |
| 10               | Face tracking                                                 |
| 11               | Anonymous face mask                                           |

## Details

### Green screen performance

Green screen doesn't require SIMD support to work, although it won't work as well without it on. There's a little warning info icon (!) if SIMD is not enabled.

Please do enable Webassembly-SIMD support under `chrome://flags/` if you'd like to see a large reduction in CPU load when using this feature.

## Related

{% content-ref url="../newly-added-parameters/and-effectvalue.md" %}
[and-effectvalue.md](../newly-added-parameters/and-effectvalue.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
