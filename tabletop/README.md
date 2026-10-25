# VDO.Ninja Tabletop

Lightweight video-first tabletop room for maps, tokens, drawing, dice, handouts, and clean board output.

## Launch

- GM: `./tabletop/?room=my-campaign&gm`
- Player: `./tabletop/?room=my-campaign`
- Board-only local testing: add `&novideo` (aliases `&novideoroom`, `&tabletopnovideo`)
- Optional: `&name=` (or `&label=`) sets the player name, and `&password=` (or `&pass=`, `&pw=`) sets the room password. Without a room, the page opens as GM.

The app syncs the room through an embedded VDO.Ninja iframe and its data channels. After you enter the tabletop room, the embedded room starts the camera automatically so peers connect and the data channels open. With `&novideo`, it skips the iframe and syncs only between tabs in the same browser, which is useful for Playwright and layout testing.

## Current Features

- GM-authoritative shared state with late-join snapshots
- Map image drag/drop
- Token images, labels, HP, owners, hidden/locked flags
- Square grid controls
- Drawing, erasing, text, ping, measure, and manual fog reveal tools
- Dice roller with `d20`, `1d20+5`, `2d6`, `adv`, `dis`, `4d6kh3` and `4d6kl1`
- Initiative tracker
- Image/text handouts with GM show-to-room action
- Local save plus JSON import/export
- Optional board publishing through the existing `canvas-frame` / `framegrab` path

## Notes

This intentionally avoids `lib.js`, `main.js`, and `webrtc.js`. If future work needs new iframe APIs, define the API contract first and review it before touching core files.
