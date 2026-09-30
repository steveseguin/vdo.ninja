---
description: Practical playbook for guest disconnects, retry behavior, and fallback strategies
---

# Handling Guest Disconnects and Connection Recovery

When guests randomly disconnect, freeze, or reconnect in loops, there is rarely one single fix. This guide gives a layered approach so you can choose the least disruptive option first, then escalate only when needed.

<figure><img src="../.gitbook/assets/docs-infographics/guest-disconnect-recovery-ladder.png" alt="Diagram showing a guest disconnect recovery ladder from retry tuning to network checks, fallback transport, and live-show operational fallback"><figcaption><p>Start with reconnect and retry options, then try relay, Meshcast, WHIP/WHEP, or live-show fallbacks when needed.</p></figcaption></figure>

## Fast checklist before going live

1. Have guests use wired Ethernet where possible.
2. Ask guests on unstable links to test Chrome and Firefox ahead of time.
3. Keep a fallback path ready:
   - P2P first
   - Meshcast/WHIP+WHEP fallback
   - Mix-minus patching for critical audio continuity

## Option 1: Reconnect and retry

VDO.Ninja attempts to reconnect automatically. Keep the guest link open after a brief interruption.

For a view link that needs to keep checking for a missing stream, use [`&retry=10`](../advanced-settings/settings-parameters/and-retry.md) to check every 10 seconds. `&retrytimeout=5000` sets the minimum wait before retrying a lost stream; 5000 ms is the default and minimum.

## Option 2: Browser and network remediations

- Switch guest browser (Chrome <-> Firefox) for problematic links.
- Disable VPN/proxy/security middleboxes where possible.
- Prefer Ethernet over Wi-Fi; avoid double-NAT and overloaded consumer routers.
- If direct P2P is consistently failing, test TURN path reliability using [`&relay`](../general-settings/and-relay.md).

## Option 3: Meshcast or WHIP/WHEP fallback

If room topology is large or network quality is inconsistent:

- Publish through Meshcast / WHIP and distribute WHEP playback where appropriate.
- Use `&whepshare=` (+ optional `&whepsharetoken=`) for external WHEP sources.
- Keep P2P for low-latency workflows, but use WHIP/WHEP paths when consistency is more important than absolute lowest latency.

## Option 4: Director operational fallback

When a specific guest-to-guest P2P edge fails during a live show:

- Ask the publisher to speak, click **Refresh** in **Mesh Network Debug**, and inspect the separate publisher -> listener arrow. Orange can identify a one-way RTP stall even while ICE remains connected.
- Select the affected arrow and use **Restart This ICE Path** before using guest-wide recovery actions.
- For one-way audio, prefer the listener's per-guest **Mix** control over the bidirectional **Patch via Mix-Minus** edge action. Both require an existing director outbound audio sender and can duplicate audio if the direct path recovers.
- Use **Restart All ICE Paths**, **Refresh Video**, **Refresh Mic**, or **Refresh Guest Media + ICE** when broader per-guest recovery is needed.
- If Mesh Network Debug confirms that a guest's primary WHIP publisher is restartable, use **Restart Primary WHIP**. If only this director's WHEP playback leg failed, use **Reconnect Local WHEP** instead.

See [Guest Audio Recovery and Mesh Debug](mesh-network-debug.md) for the directional health indicators, targeted ICE restart, mix-minus fallback, and safe operating sequence.

## Broadcast-mode resiliency pattern

For larger productions:

- Use broadcast-oriented workflows so not every guest must maintain every P2P edge.
- Keep a dedicated fallback scene/source path in OBS for temporary degraded guests.
- Combine with retry/reload controls for unattended overlays:
  - `&retry`
  - `&retrytimeout=5000`
  - `&autoreload` / `&autoreload24`

## Example link templates

- Director:
  - `https://vdo.ninja/?director=ROOM`
- Guest:
  - `https://vdo.ninja/?room=ROOM&push=GUESTID`
- Viewer/Scene:
  - `https://vdo.ninja/?scene&room=ROOM&retry&retrytimeout=5000`

## Related

- [Primary and Backup Guests with `&scene` and `&slots=1`](primary-and-backup-guests-with-scene-and-slots.md)
- [Mesh Network Debug](mesh-network-debug.md)
- [`&pendingicettl`](../advanced-settings/turn-and-stun-parameters/and-pendingicettl.md)
- [Packet Loss](../common-errors-and-known-issues/packet-loss.md)
