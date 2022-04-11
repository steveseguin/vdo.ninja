---
description: >-
  If someone else is speaking in a group call, the guest's microphone gets muted
  automatically
---

# \&noisegate

Sender-Side Option! ([`&push`](push.md))

## Options

| Value                 | Description                                                                |
| --------------------- | -------------------------------------------------------------------------- |
| (no value given) \| 1 | will mute the microphone when someone else is speaking                     |
| 2                     | will mute the speakers when you are talking                                |
| 3                     | will mute the speakers when someone else is talking (mainly for debugging) |

## Details

The point of this feature is to allow guests who might be in a rather noisy room or who are unable to use echo cancellation to still engage with a chat, without them introducing feedback back into the room.

This is a very hard and aggressive noise filter, and a guest won't be audible to others in the room if others in the room are currently talking.

User feedback on this feature welcomed.

## Related

{% content-ref url="and-denoise.md" %}
[and-denoise.md](and-denoise.md)
{% endcontent-ref %}
