---
description: Auto-assign guests to unique audio output channels for multitrack recording
---

# \&autochannels

Director Option! ([`&director`](../viewers-settings/director.md))

## Aliases

* `&autochannelmode`

## Options

Example: `&autochannels` or `&autochannels=1,2,3,5,6,7,8`

| Value | Description |
| ----- | ----------- |
| (no value) | Enable auto-assign using channels 1,2,3,5,6,7,8 (skips C4/LFE) |
| (comma-separated numbers) | Specify which channels to use, e.g. `1,2,3,5,6,7,8` |

Optional mode parameter:

Example: `&autochannelmode=roundrobin`

| Value | Description |
| ----- | ----------- |
| `leastused` | (default) Assign to channel with fewest guests; enables stacking |
| `roundrobin` or `rr` | Cycle through channels in order |

## Details

When enabled, the director will automatically assign each new guest to a unique audio output channel (C1-C8) as they join the room. This is useful for multitrack recording in OBS where you want each guest on a separate audio track.

### How it works

1. When a guest joins, the director automatically selects the next available channel from the allowed list
2. The channel assignment is sent to all scene viewers (which need [`&channels=8`](../advanced-settings/view-parameters/and-channels.md) for multitrack output)
3. Co-directors are synced with the channel assignments
4. Manual C1-C8 button clicks still work and will override auto-assignments

### Default behavior

By default, `&autochannels` skips channel 4 (C4) because it's the LFE (low-frequency effects) channel in OBS's 7.1 surround layout, which can distort audio if recorded to directly.

### Stacking behavior

When all allowed channels have at least one guest assigned:
- **leastused mode** (default): New guests are assigned to the channel with the fewest guests, distributing the load evenly
- **roundrobin mode**: Continues cycling through channels in order regardless of current assignments

### Guest preferred channel

Guests can request a specific channel using [`&preferchannel`](#preferchannel) in their invite link. If the preferred channel is in the director's allowed list, it will be used. Otherwise, auto-assignment falls back to the normal logic.

This is useful when you want the same guest to always end up on the same channel across sessions.

### Example usage

Director link with auto-assign enabled (skip C4):
```
https://vdo.ninja/?director=myroom&autochannels
```

Director link with specific channels:
```
https://vdo.ninja/?director=myroom&autochannels=1,2,3
```

Director link with round-robin mode:
```
https://vdo.ninja/?director=myroom&autochannels&autochannelmode=roundrobin
```

Guest link with preferred channel:
```
https://vdo.ninja/?room=myroom&preferchannel=3
```

{% hint style="warning" %}
Your scene/view links still need [`&channels=8`](../advanced-settings/view-parameters/and-channels.md) for multitrack output to work. In OBS, set your audio output to 7.1 surround to access all 8 channels.
{% endhint %}

{% hint style="info" %}
Co-directors can also use `&autochannels` in their URL. Each director's auto-assignments will be synced to other co-directors.
{% endhint %}

## Related

{% content-ref url="../advanced-settings/view-parameters/and-channels.md" %}
[and-channels.md](../advanced-settings/view-parameters/and-channels.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/and-channeloffset.md" %}
[and-channeloffset.md](../advanced-settings/view-parameters/and-channeloffset.md)
{% endcontent-ref %}

{% content-ref url="codirector.md" %}
[codirector.md](codirector.md)
{% endcontent-ref %}
