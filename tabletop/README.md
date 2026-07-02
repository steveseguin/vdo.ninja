# VDO.Ninja Tabletop

Lightweight video-first tabletop room for maps, tokens, drawing, dice, handouts, and clean board output.

## Launch

- GM: `./tabletop/?room=my-campaign&gm`
- Player: `./tabletop/?room=my-campaign`
- Board-only local testing: add `&novideo`

The app uses the existing VDO.Ninja iframe/datachannel path for room sync. The embedded room autostarts the webcam path after entering the tabletop room so peers form and datachannels open. When `&novideo` is present, it skips the VDO iframe and uses same-browser local sync only, which is useful for Playwright and layout testing.

## Current Features

- GM-authoritative shared state with late-join snapshots
- Map image drag/drop
- Token images, labels, HP, owners, hidden/locked flags
- Square grid controls
- Drawing, erasing, text, ping, measure, and manual fog reveal tools
- Dice roller with `d20`, `1d20+5`, `2d6`, `adv`, `dis`, and `4d6kh3`
- Initiative tracker
- Image/text handouts with GM show-to-room action
- Local save plus JSON import/export
- Optional board publishing through the existing `canvas-frame` / `framegrab` path

## Notes

This intentionally avoids `lib.js`, `main.js`, and `webrtc.js`. If future work needs new iframe APIs, define the API contract first and review it before touching core files.
