---
description: Keep links alive across ISP resets and unattended hours
---

# 24/7 unattended operation

Combine retry and timed reloads to recover from daily disconnects.

- Auto‑retry: Add `&retry` to re‑establish lost peer connections; tune with `&retrytimeout=5000` (ms).
- Timed reload: Use `&autoreload=3600` (seconds) for periodic reloads, or `&autoreload24=04:00` for a daily reload.
- Session end: Pair `&autoend` with `&endpage=https://...` to wrap up and redirect.
- Mobile tips: Prevent sleep and background audio pausing; see `guides/keep-mic-active-in-background-on-android-browser.md`.

Example

- Viewer: `...?view=ID&retry&retrytimeout=5000&autoreload24=04:05`
- Source: `...?push=ID&retry&autoreload=14400`

Related

- `advanced-settings/settings-parameters/and-retry.md`
- `advanced-settings/settings-parameters/and-autoreload.md`
- `advanced-settings/settings-parameters/and-autoreload24.md`
- `advanced-settings/settings-parameters/and-autoend.md`
- `advanced-settings/settings-parameters/and-endpage.md`
