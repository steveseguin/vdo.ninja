---
description: Quick checks when guests or director can’t see/hear via Meshcast
---

# Meshcast connection issues

If guests can’t see/hear each other or director tiles spin when using `&meshcast`, try these:

- Change region: Pick a different Meshcast server (`&meshcastcode=use1`, `usw1`, `de1`, etc.). Servers can be busier at local peak times.
- Codec swap: Try `&meshcastcodec=h264` or `vp9` for compatibility; for screen shares, adjust `&mcscreensharecodec=`.
- Bitrate caps: Reduce video/audio bitrate to stabilize (`&meshcastbitrate=2000`, `&meshcastaudiobitrate=64`), and lower screen‑share bitrate if needed (`&mcscreensharebitrate=`).
- Fallback path: If a specific viewer struggles, add `&nomeshcast` to their view link to request a direct P2P feed from that publisher when possible.
- Director preview: Avoid opening many high‑bitrate views in the director at once; use scene or single‑view previews where possible.
- Alternate route: If enterprise networks interfere, consider WHEP/WHIP for viewers or use `backup.vdo.ninja` as a quick test.

## Use Meshcast button is missing

The [Use Meshcast button](../newly-added-parameters/and-meshcast.md#switch-a-connected-guest-from-the-directors-room-alpha) appears at the end of a guest's **Additional Controls** in the director's room.

* Use current `/alpha/` pages for both the director and the guest. Updating only the director's page is not enough: the guest must report that it supports switching.
* If both links use `/alpha/` but the button is still missing after an update, hard-refresh the guest tab and rejoin. Use **Ctrl+Shift+R** on Windows/Linux or **Cmd+Shift+R** on macOS. Refresh the director's tab too if it was open before the update.
* The guest needs to be publishing a camera or microphone feed. The button is hidden when the guest's own link disables Meshcast with `&nomeshcast` or `&nowhep`, disables primary WHIP publishing, or is already publishing to a custom WHIP service such as MediaMTX.
* Firefox guests need Firefox 110 or newer for this switch.

Adding `&nowhep` or `&nomeshcast` to a viewer's link keeps that viewer on a direct feed; it does not prevent the director from switching the guest for other viewers.

Related

- `newly-added-parameters/and-meshcast.md`
- `advanced-settings/meshcast-parameters/and-meshcastcode.md`
- `meshcast-settings/and-meshcastbitrate.md`
- `meshcast-settings/and-meshcastcodec.md`
- `advanced-settings/meshcast-parameters/and-meshcastaudiobitrate.md`
- `meshcast-settings/and-mcscreensharebitrate.md`
- `meshcast-settings/and-mcscreensharecodec.md`
- `advanced-settings/meshcast-parameters/and-nomeshcast.md`
- `common-errors-and-known-issues/enterprise-firewall-checklist.md`

