---
description: Use a primary and backup guest feed with scene-based failover, &slots=1, and audio-safe output links.
---

# Primary and Backup Guests with `&scene` and `&slots=1`

If you want one guest to have a hot spare on another computer or network, the practical VDO.Ninja workflow is to use **two different guest stream IDs** and stage both in the same scene.

This is not the same as having two computers live on the exact same guest ID.

## Important limitation first

Do **not** try to use the exact same `&push=` ID on both machines at the same time.

This will conflict.

Instead, use two different guest IDs, such as:

- `guestA_lan`
- `guestA_5g`

Then place both feeds into the same scene and let the scene output decide which one is visible.

## Fastest failover setup

Use these example links:

### Director

```text
https://vdo.ninja/?director=show123
```

### Primary guest

```text
https://vdo.ninja/?room=show123&push=guestA_lan&label=GuestA-LAN
```

### Backup guest

```text
https://vdo.ninja/?room=show123&push=guestA_5g&label=GuestA-5G
```

### Program output for OBS

```text
https://vdo.ninja/?scene=1&room=show123&slots=1&pauseinvisible
```

## How to use it

1. Open the director link.
2. Bring in both guest links.
3. Add both guest feeds to `Scene 1`.
4. Keep the preferred feed first in scene order.
5. Use the `scene=1` output link in OBS.

With `&slots=1`, only one feed is visible in the output at a time, even though both are already connected in the scene.

If the visible feed drops, the other feed is already loaded and can take over immediately.

## Why `&pauseinvisible` matters

The main problem with this trick is usually audio.

`&pauseinvisible` is the simple fix.

When the hidden backup feed is not visible in the mixer, its audio is muted too. That prevents doubled audio while keeping the backup feed connected and ready.

This is the easiest all-in-one failover link:

```text
https://vdo.ninja/?scene=1&room=show123&slots=1&pauseinvisible
```

## Advanced audio routing for OBS

If you want more control over audio, use separate scene audio channels for the primary and backup feeds.

### Director with auto channel assignment enabled

```text
https://vdo.ninja/?director=show123&autochannels=1,2
```

### Primary guest prefers channel 1

```text
https://vdo.ninja/?room=show123&push=guestA_lan&label=GuestA-LAN&preferchannel=1
```

### Backup guest prefers channel 2

```text
https://vdo.ninja/?room=show123&push=guestA_5g&label=GuestA-5G&preferchannel=2
```

### Multichannel scene output

```text
https://vdo.ninja/?scene=1&room=show123&slots=1&channels=8
```

This gives you a cleaner broadcast workflow:

- video still fails over via `&scene=1&slots=1`
- primary audio can live on channel 1
- backup audio can live on channel 2
- OBS can monitor, gate, or switch those channels however you want

If you still want only the visible feed to be audible inside the VDO.Ninja scene output, add `&pauseinvisible` to the multichannel link as well:

```text
https://vdo.ninja/?scene=1&room=show123&slots=1&channels=8&pauseinvisible
```

## Recommended pattern

Use one of these two approaches:

### Simple

Use this when you just want the backup feed to stay silent until it becomes visible:

```text
https://vdo.ninja/?scene=1&room=show123&slots=1&pauseinvisible
```

### Advanced

Use this when you want OBS to have separate audio control over the main and backup feeds:

```text
https://vdo.ninja/?director=show123&autochannels=1,2
https://vdo.ninja/?room=show123&push=guestA_lan&label=GuestA-LAN&preferchannel=1
https://vdo.ninja/?room=show123&push=guestA_5g&label=GuestA-5G&preferchannel=2
https://vdo.ninja/?scene=1&room=show123&slots=1&channels=8
```

## Notes and caveats

- Use two different `&push` IDs. Do not try to dual-publish the exact same ID.
- If you want automatic takeover, do not hard-lock the backup to a separate visible slot. Keep both feeds in the same scene and let `&slots=1` handle visibility.
- Wired LAN for the primary and cellular or separate Wi-Fi for the backup is the usual redundancy pattern.
- If the backup device should stay totally out of the program until needed, keep it in the same scene but hidden behind the active feed.

## Related

- [`&slots`](../newly-added-parameters/and-slots.md)
- [`&channels`](../advanced-settings/view-parameters/and-channels.md)
- [`&preferchannel`](../general-settings/preferchannel.md)
- [`&autochannels`](../director-settings/autochannels.md)
- [Handling Guest Disconnects and Connection Recovery](handling-guest-disconnects-and-connection-recovery.md)
