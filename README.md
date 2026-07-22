# Capturly Live

**Capturly Live** is [Capturly](https://capturly.app)'s self-hosted, branded deployment of
[VDO.Ninja](https://github.com/steveseguin/vdo.ninja) — browser-based, peer-to-peer live
audio/video for bringing remote guests straight into a studio. No downloads, no sign-in.

Hosted at **[live.capturly.app](https://live.capturly.app)**.

## Attribution & license

This is a fork of [VDO.Ninja](https://github.com/steveseguin/vdo.ninja) by
[Steve Seguin](https://github.com/steveseguin), used under the
[AGPL-3.0](./LICENCE.md). VDO.Ninja and OBS.Ninja are Steve Seguin's projects and names;
this fork is not affiliated with or endorsed by upstream. All credit for the underlying
engine belongs to the upstream project and its contributors — consider
[sponsoring it](https://docs.vdo.ninja/getting-started/sponsor).

In accordance with the AGPL, the complete corresponding source of the deployed instance is
this repository. A "Source Code" link is present in the app footer.

## What differs from upstream

Branding and deployment configuration only — the engine is untouched:

- `index.html`: titles, meta/OG/Twitter tags, landing-page text, footer legal/support links,
  and the self-host config block (custom `session.wss`, self-hosted TURN, deployment-specific
  default password).
- `manifest.json`, `media/`: Capturly Live PWA identity, icons, favicons, and social image.
- `translations/en.json`, `translations/blank.json`: branded `logo-header`, `info-blob`,
  and support/help strings.
- `lib.js`: `submitDebugLog()` saves error logs locally for the user to email to support,
  instead of uploading them to upstream's report server.

## Self-hosted infrastructure

| Component | Endpoint |
| --------- | -------- |
| Static app | `live.capturly.app` |
| Signaling ([websocket_server](https://github.com/steveseguin/websocket_server)) | `wss.live.capturly.app` |
| TURN (coturn) | `turn.live.capturly.app` (3478/udp+tcp, 5349/tls) |
| STUN | Google + Cloudflare public STUN |

The TURN credentials in `index.html` are client-side and public by design; relay abuse is
constrained server-side (denied peer ranges, quotas).

## Syncing with upstream

```bash
git fetch upstream                 # upstream = github.com/steveseguin/vdo.ninja
git merge upstream/develop         # into main; branding lives in a small, deliberate diff
```

## Upstream documentation

The engine's docs, URL parameters, and guides all apply unchanged:

- [Documentation](https://docs.vdo.ninja)
- [URL parameters](https://params.vdo.ninja)
- [Self-hosting guide](./install.md)
