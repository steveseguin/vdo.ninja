---
description: Recent highlights only (rolling window)
---

# Updates - VDO.Ninja

For real-time release notes and announcements, use:

* [https://updates.vdo.ninja](https://updates.vdo.ninja/)
* [https://discord.vdo.ninja](https://discord.vdo.ninja/)

## Scope of this page

This page is intentionally short to reduce stale or cached snippets.

* Only highlights from the last 120 days are kept here.
* Current window: **November 9, 2025 to March 9, 2026**.
* Anything older should be removed after the permanent docs are updated.
* This page is not a long-term changelog archive.

## Recent highlights (rolling)

* **Approval-system room controls**
  Added `&requireapproval`, `&roomcap` / `&rcap`, and `&roomkey` / `&rk` for claimed-room admission control. Trusted room keys can bypass approval and cap checks. These controls are tied to the current director session.

* **Queue and co-director sync improvements**
  Held-guest activation state now syncs correctly to co-directors through the normal director state flow, and `&hold` / `&holdwithvideo` activation behavior is documented in line with the current code path.

* **Chunked/WebCodecs reliability controls**
  Recent chunked work includes `&chunkfec`, `&chunknack`, `&chunkbuffer`, `&chunkbufferfloor`, `&chunkbufferceil`, `&chunkjitterslack`, `&chunkadapt`, and `&chunkprofile` for opt-in reliability, buffering, and adaptation experiments.

* **PTZ and recovery controls**
  Added or expanded `&autorelay`, `&pendingicettl`, low-latency chunked presets, PTZ remote actions, and the dedicated PTZ control surface at [https://vdo.ninja/ptz.html](https://vdo.ninja/ptz.html). Auto-relay now defaults on while keeping initial connections direct-first; a hard failure gets one normal restart before one relay-eligible restart.

* **Standalone helper app growth**
  New public helper surfaces now include the standalone Screen Recorder, Game Capture app, Ninja OBS Plugin, and Ninja VST3 Plugin.

## Editor maintenance rule

* Add highlights only for recent changes inside the active rolling window.
* For each highlight, ensure a stable doc page exists in the correct section.
* Remove highlights when they age out of the window.
