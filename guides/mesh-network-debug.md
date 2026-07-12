---
description: Diagnose one-way guest audio, use director custom mixes, inspect the P2P mesh, and recover peers safely
---

# Recover Missing Guest-to-Guest Audio

VDO.Ninja rooms normally use separate peer-to-peer paths between participants. One direction can fail while every other direction keeps working. This guide shows directors how to identify that case, restore audio with a custom mix, inspect the Mesh Network Debug view, and rebuild the affected connection.

## Quick diagnosis: A cannot hear B, but C can

Suppose:

* C can hear B.
* A can hear C.
* A cannot hear B.

B's microphone is working because C receives it. A's speaker output is working because A hears C. The fault is therefore specific to the **B to A path** or to playback of B's track at A. Refreshing B's microphone is unlikely to be the first useful action.

If moving A from the shared Wi-Fi to a hotspot fixes the problem, suspect the local network path: an unusable LAN ICE candidate, access-point isolation, a guest Wi-Fi/VLAN rule, a local firewall, or a browser/network-interface interaction. A VPN is not a conclusive test because WebRTC may still select a direct LAN candidate or the VPN may not carry WebRTC UDP traffic.

## Live-show recovery order

Use the least disruptive action first:

1. Ask B to speak, open **Mesh Network Debug**, and click **Refresh** while B is speaking.
2. Select the **B -> A** arrow. If audio was sent but not received, use **Restart This ICE Path**. Wait 5 to 10 seconds, then refresh while B speaks again.
3. If it is still broken, select B and use **Restart All ICE Paths**. This broader action can briefly disturb B's other peer connections.
4. If the show must continue, send B to A through A's **Mix** control.
5. After the show, reload B and then A one at a time. If the problem returns, test both guest links with `&relay`.

Use **Refresh Mic** on B only when nobody can hear B or B's local microphone meter has stopped. Use **Refresh Guest Media + ICE** only when restarting B's microphone, camera, and peer connections together is acceptable.

## Open Mesh Network Debug

In the director control center, select the mesh/network icon beside the room name. The full-screen Mesh Network Debug view opens and requests a connection map from each guest. Select **Refresh** after guests have finished joining or after any recovery action.

<figure><img src="../.gitbook/assets/mesh-audio-recovery/mesh-debug-button.png" alt="Director control-center header with the Mesh Network Debug icon beside the room controls"><figcaption><p>Select the connected-nodes icon beside the room name to open Mesh Network Debug.</p></figcaption></figure>

<figure><img src="../.gitbook/assets/mesh-audio-recovery/mesh-overview.png" alt="Mesh Network Debug showing separate directional arrows between the director and Guests A, B, and C, with the Guest B to Guest A audio path orange"><figcaption><p>A reviewed, staged four-node example. Guest B to Guest A is orange because B sent audio packets while A received none; the reverse A to B arrow remains green.</p></figcaption></figure>

### Read the diagram

| Display | Meaning |
| --- | --- |
| Blue-outlined circle | Director |
| Green-outlined circle | Guest with no detected directional problem |
| Orange-outlined circle | Guest with a degraded connection or an expected media stream stalled on arrival |
| Red-outlined circle | Guest with a failed connection |
| Gray-outlined circle | Guest that reported no connections |
| Purple square | Scene or view-only connection |
| Solid green arrow | The directional path is connected and expected RTP reached the listener during the sample, or no media was expected |
| Dashed orange arrow | The path is degraded, or the publisher sent expected RTP while the listener received none |
| Dashed red arrow | Failed |
| Dashed gray arrow | Media flow could not be verified during the sample |
| Cyan double-dashed arrows | Peer pair marked as patched through the director's mix-minus path |
| Arrow direction | Publisher -> listener; A -> B and B -> A are separate paths |

Select a guest node to see its browser, TURN badge, reported connections, and guest-wide recovery controls. Select an arrow to see its publisher, listener, sender and receiver packet deltas, candidate path, track state, and directional recovery action.

{% hint style="info" %}
The tool samples RTP for about one second. Ask the publisher to speak while clicking **Refresh**. A quiet sender is shown as unverified instead of stalled. A green audio arrow confirms packets reached the listener's browser; it does not prove the track was audible through the listener's selected output device or Web Audio path.
{% endhint %}

After automatic recovery, select the affected arrow and check both fields. **ICE state: connected** confirms that PC recovered. **Candidate path: relay** confirms the selected candidate pair actually uses TURN; merely configuring or requesting relay is not proof. A connected host/server-reflexive path means the first normal restart recovered directly, which is also a successful result.

### Node recovery controls

| Action | What it currently does | When to use it |
| --- | --- | --- |
| **Refresh Mic** | Re-captures the selected guest's microphone | Nobody can hear that guest, or their mic capture stopped |
| **Refresh Video** | Re-captures the selected guest's camera | Camera is frozen or missing |
| **Restart All ICE Paths** | Requests ICE restarts for all of that guest's P2P connections | A targeted path restart failed, or several paths are degraded |
| **Refresh Guest Media + ICE** | Refreshes mic, video, and every ICE path | Less targeted actions failed and a broad interruption is acceptable |
| **Restart Primary WHIP** | Asks the guest to rebuild its primary WHIP publisher | Only appears when the guest's current mesh report confirms that primary WHIP is enabled, configured, and restartable |
| **Reconnect Local WHEP** | Rebuilds this director browser's local WHEP playback connection | A guest's **Local WHEP** status is failed, disconnected, or otherwise needs a fresh playback session |

The media, ICE, and primary-WHIP actions affect the selected guest. **Reconnect Local WHEP** affects only the current director browser. For one bad P2P direction, use the arrow's **Restart This ICE Path** action first.

<figure><img src="../.gitbook/assets/mesh-audio-recovery/mesh-node-recovery-controls.png" alt="Guest B node details showing separate Primary WHIP, Screen WHIP, and Local WHEP states plus Restart Primary WHIP and Reconnect Local WHEP controls"><figcaption><p>Primary WHIP publishing and local WHEP playback are separate legs with separate recovery actions. Screen WHIP is also reported separately and is not restarted by the primary-WHIP action.</p></figcaption></figure>

### WHIP versus WHEP recovery

The publisher owns WHIP; the listener owns WHEP:

`Guest media -> primary WHIP publisher -> media server -> local WHEP player -> director`

- Use **Restart Primary WHIP** when the guest's primary publisher needs rebuilding. The command is sent to that guest and does not appear for a merely configured, unavailable, legacy, or screen-only WHIP path.
- Use **Reconnect Local WHEP** when this director browser's WHEP player needs rebuilding. It runs locally and does not send a restart command to the publisher.
- A **Screen WHIP** badge describes the separate screen publisher. **Restart Primary WHIP** does not restart it.
- An explicit `&whepplay=` source has no VDO.Ninja guest publisher to command; only its local WHEP playback leg can be reconnected.

## Reconnect peers safely

Select the affected arrow and use **Restart This ICE Path**. The command uses the peer key reported by that endpoint and calls `restartIce()` on only the selected publisher-to-listener connection. It does not close the connection or restart the publisher's other peer paths.

<figure><img src="../.gitbook/assets/mesh-audio-recovery/mesh-edge-recovery-actions.png" alt="Guest B to Guest A directional path showing connected ICE, stalled listener audio, 18 sent packets and zero received packets, Restart This ICE Path, and Patch Peer Pair via Mix-Minus"><figcaption><p>The B -> A panel distinguishes a connected ICE transport from stalled audio and exposes the targeted ICE restart.</p></figcaption></figure>

Recovery sequence:

1. Ask the sender to speak and click **Refresh**.
2. Select the affected sender -> listener arrow and click **Restart This ICE Path**.
3. Wait 5 to 10 seconds, ask the sender to speak, and click **Refresh** again.
4. If the directional restart fails, select the sender node and click **Restart All ICE Paths**.
5. If media capture itself is broken, use **Refresh Mic** or **Refresh Guest Media + ICE** on the sender.
6. If the path still does not return, have the sender reload their page. Reload the receiver next if required.
7. Rejoin both affected guests with a TURN recovery or forced-relay option if the same pair fails again.

Do not use **Hangup** as a reconnect button. It intentionally removes the guest and requires them to join again.

## Emergency audio patch: send B to A with Mix

The per-guest **Mix** control is the most targeted current fallback for a one-way failure because you can relay only the missing source to the listener. It is still an emergency workaround, not a transparent replacement for the direct path.

The director must already have an outbound P2P connection with an audio sender to the listener. The Mix control can be visible even when no replaceable outbound audio sender exists; in that case it cannot inject the relay. Test this workflow before relying on it live.

1. In the director control center, find **A's** guest card. A is the listener who is missing audio.
2. Expand **Additional Controls**.
3. Scroll to **PGM / Mic** and select **Mix**.
4. Under **Guests**, enable **B**.
5. Disable **Director Mix** and leave other guests disabled unless A also needs those sources relayed.
6. Ask A to confirm that B is audible.

<figure><img src="../.gitbook/assets/mesh-audio-recovery/guest-custom-mix.png" alt="Guest A custom Mix with Director Mix and Guest C disabled and Guest B selected"><figcaption><p>Example B-to-A emergency route: open Guest A's Mix, disable Director Mix, select Guest B, and leave Guest C disabled.</p></figcaption></figure>

The target guest is automatically excluded from their own return mix, which prevents A from hearing A through the director.

{% hint style="warning" %}
The normal direct guest-to-guest track is not removed. Include only the missing source. If the B to A direct path recovers while B is still selected in A's custom mix, A may hear B twice. Uncheck B to stop relaying that source, then verify A's audio because the current control does not reliably restore the director's original outbound track.
{% endhint %}

Opening the Mix menu enables the custom mix and may immediately replace the director's outbound audio track with the currently selected sources. Closing the menu only hides it; it does not disable the custom mix. There is currently no reliable one-click reset to the original director track. If the routing state becomes unclear, reload the affected guest connection or the director after the production.

### Whole-room `&mixminus`

For a planned director-hosted N-1 workflow, add `&mixminus` (or `&mm`) to the **director URL before joining**:

`https://vdo.ninja/?director=ROOM&mixminus`

The director then attempts to build a custom return for every guest containing the director and the other guests, excluding the recipient. This still requires an active director audio context and outbound audio sender for each recipient. Do not add this flag only to guest links.

This flag does not remove the normal guest-to-guest P2P audio paths. Test the complete routing before a production so direct and relayed copies do not create doubled audio.

## Patch via Mix-Minus in the mesh view

When a guest-to-guest arrow is failed, disconnected, or has verified stalled audio, selecting it exposes **Patch Peer Pair via Mix-Minus**. The toolbar's **Patch Audio Problems** action applies the same operation to affected guest pairs.

Use an edge patch only when both directions are unusable or when a short-lived emergency bridge is more important than possible doubled audio. The current patch:

* relays both directions through the director, even if only one direction failed;
* leaves the original direct tracks in place;
* marks both arrows cyan immediately without confirming that replacement audio reached either guest; and
* does not reliably restore the director's original outbound audio track when **Remove Patch** is selected.

**Unpatch Recovered** removes an automatic/manual pair patch only after both directional arrows report healthy. Have both guests speak and refresh before relying on that check.

For a one-way B to A failure, prefer A's per-guest **Mix** panel and select only B.

## Bypass a bad local path

Apply connection flags to the **affected guest links**, not only to the director link.

### Automatic recovery with TURN escalation

For the complete opt-in recovery bundle, use this on both A and B:

`&autorecover=1`

This enables adaptive disconnect timing, automatic TURN escalation, and WHEP fallback signaling when WHIP/WHEP settings exist. It keeps direct P2P as the first choice; TURN is used only after recovery escalates and only when usable TURN servers are configured.

Automatic TURN escalation is enabled by default. Direct P2P remains the first choice; on a hard failure VDO.Ninja attempts one normal ICE restart, waits the recovery window, and then makes one relay-eligible restart if the path is still not connected. `&autorelay=1` can make this explicit or override `&autorecover=0`.

Use `&autorelay=0`, `&autorelay=off`, `&autorelay=false`, or `&autorelay=no` to disable automatic forced-relay escalation regardless of room size. Use `&turn=0` when the link must not have TURN servers available to normal browser ICE selection either.

### Force TURN relay

If the same pair continues to fail, test both guest links with:

`&relay`

Example:

`https://vdo.ninja/?room=ROOM&relay`

TURN usually adds latency and consumes relay bandwidth, but it bypasses the direct A to B LAN route. For an audio-only room, the bandwidth cost is comparatively small.

If UDP itself appears blocked or unstable, test:

`&relay&tcp`

TCP can add more latency and should be a fallback, not the first test.

### Other targeted checks

* Test `&ipv6=0` on A and B if the router has unreliable IPv6. Current VDO.Ninja builds already prefer IPv4 by default, so treat this as a diagnostic test.
* Disable guest-network or AP/client isolation on the Wi-Fi access point.
* Confirm A and B are not separated by a mesh-node VLAN, extender guest mode, or a second router.
* Mark the local network as trusted/private in the operating-system firewall, or temporarily test with the local firewall/security product disabled.
* Try current Chrome/Edge and Firefox without extensions.
* Test one device over Ethernet to the same main router.

## What to record for a useful bug report

Capture the direction, not just "audio failed":

| Test | Result |
| --- | --- |
| A hears B | yes/no |
| B hears A | yes/no |
| A hears C | yes/no |
| C hears A | yes/no |
| B hears C | yes/no |
| C hears B | yes/no |

Also record:

* the browser and operating system for each guest;
* whether the affected guests share a router, access point, extender, or VLAN;
* whether the mesh node or edge shows host, server-reflexive, or TURN relay candidates;
* whether **Restart This ICE Path**, **Restart All ICE Paths**, a page reload, `&relay`, or `&relay&tcp` changes the result; and
* a `chrome://webrtc-internals` dump from the listener when possible.

If inbound audio bytes for B increase at A while B remains inaudible, investigate A's playback element, output device, mute state, and Web Audio path. If the bytes do not increase, investigate the B to A transport, sender track, and ICE route.

## Related

{% content-ref url="../common-errors-and-known-issues/audio-over-vdo.ninja-isnt-working.md" %}
[audio-over-vdo.ninja-isnt-working.md](../common-errors-and-known-issues/audio-over-vdo.ninja-isnt-working.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/and-relay.md" %}
[and-relay.md](../general-settings/and-relay.md)
{% endcontent-ref %}

{% content-ref url="handling-guest-disconnects-and-connection-recovery.md" %}
[handling-guest-disconnects-and-connection-recovery.md](handling-guest-disconnects-and-connection-recovery.md)
{% endcontent-ref %}
