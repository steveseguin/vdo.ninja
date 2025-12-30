---
description: Request a preferred audio channel for multitrack recording
---

# \&preferchannel

Guest/Source Option!

## Aliases

* `&pc`

## Options

Example: `&preferchannel=3`

| Value | Description |
| ----- | ----------- |
| 1-8 | Preferred audio channel number (C1-C8) |

## Details

When a guest joins a room where the director has [`&autochannels`](../director-settings/autochannels.md) enabled, this parameter requests that the guest be assigned to a specific audio channel.

### How it works

1. Guest adds `&preferchannel=N` to their invite link (where N is 1-8)
2. When they connect, this preference is sent to the director
3. If the director has `&autochannels` enabled and the requested channel is in the allowed list, the guest is assigned to that channel
4. If the channel is not allowed (e.g., director excluded it), normal auto-assignment is used instead

### Use case

This is useful when you want the same guest to always end up on the same audio channel across multiple sessions, making post-production editing easier.

### Example

Guest link requesting channel 3:
```
https://vdo.ninja/?room=myroom&preferchannel=3
```

Director link that allows channel 3:
```
https://vdo.ninja/?director=myroom&autochannels=1,2,3,5,6,7,8
```

{% hint style="info" %}
The preferred channel is only used if the director has `&autochannels` enabled. Without it, this parameter has no effect.
{% endhint %}

{% hint style="warning" %}
If the preferred channel is not in the director's allowed list (e.g., guest requests C4 but director uses default which skips C4), the guest will be auto-assigned to another channel.
{% endhint %}

## Related

{% content-ref url="../director-settings/autochannels.md" %}
[autochannels.md](../director-settings/autochannels.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/and-channels.md" %}
[and-channels.md](../advanced-settings/view-parameters/and-channels.md)
{% endcontent-ref %}
