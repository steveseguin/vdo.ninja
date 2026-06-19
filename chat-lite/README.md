# Social Stream Ninja Lite (VDO.Ninja integration)

A lightweight in-repo chat control surface for VDO.Ninja. It connects directly to supported providers in-browser and renders an activity/overlay view without requiring the Social Stream extension.

## Features

- One-page experience for managing chat relays.
- Session generator with clipboard-ready overlay link.
- Native YouTube chat integration.
- Native Twitch chat integration.
- Native Kick chat integration.
- Optional Social Stream WebSocket source by session ID (for additional sites/events).
- Activity log for connection and transport events.

## Getting Started

1. Serve the project as usual (local dev server or deployed site) and open `chat-lite/index.html`.
2. Generate or enter a session ID, then click **Start Relay**.
3. Connect the providers you need:
   - YouTube / Twitch: OAuth popup flow (client IDs are pre-filled and can be overridden).
   - Kick: channel-name + direct public websocket flow (no sign-in required).
   - SSN WebSocket: provide a Social Stream session ID to relay additional platforms.
4. Open `chat-lite/index.html?view=activity&session=YOUR_ID&embed=1&transparent=1` as an overlay view.

### OAuth Redirect URIs

Add the Lite page URL as an authorized redirect URI in your developer console:

- **YouTube**: `https://your-domain/chat-lite/index.html`
- **Twitch**: `https://your-domain/chat-lite/index.html`

The implicit flow appends `#access_token=...` to this page, which the plugins capture on load.

## Notes

- The Twitch integration defaults to the authenticated channel unless a custom channel name is provided.
- The Social Stream WebSocket source expects a valid session ID and defaults to `wss://io.socialstream.ninja` (`join`, `out=3`, `in=4`).
- Overlay activity mode is available via `?view=activity`; add `&transparent=1` for in-scene overlays.
- `?view=activity` is display-only by design (no provider auto-connect). Use the standard `chat-lite/index.html` page to configure/connect sources.

## Directory Overview

```
chat-lite/
|-- index.html          # Lite control panel entry point
|-- styles.css          # Minimal styling for the one-page UI
|-- app.js              # Core controller (sessions, plugins, activity)
|-- utils/
|   |-- helpers.js       # Common helpers (IDs, formatting)
|   `-- storage.js       # Namespaced localStorage helpers
|-- shared/
|   |-- utils/           # Shared helpers (HTML, emotes, script loader)
|   `-- vendor/          # Bundled Twitch client fallback
|-- providers/           # Source adapters (YouTube, Twitch, Kick)
`-- plugins/
    |-- basePlugin.js    # Shared card + lifecycle logic
    |-- youtubePlugin.js # YouTube Data API integration
    |-- twitchPlugin.js  # Twitch chat (tmi.js) integration
    |-- kickPlugin.js    # Kick chat integration
    `-- socialStreamWebSocketPlugin.js # Session-ID WebSocket fallback
```

## Development Notes

- The page is built as ES modules without a bundler; load it via HTTP(S) so OAuth redirects succeed.
- `tmi.js` is vendored under `thirdparty/tmi.js` (with `thirdparty/tmi.js.LICENSE`) to avoid CDN dependencies.
- Ship `chat-lite/shared/`, `chat-lite/providers/`, and `chat-lite/plugins/` together when deploying.
- Message payloads follow Social Stream/VDO overlay conventions (`type`, `chatname`, `chatmessage`) and are normalized in the plugin layer.
- Append `?debug=1` to the Lite URL (persisted in local storage) to surface verbose relay logs in the browser console and activity feed; use `?debug=0` to turn it back off.
- Activity logging stays lightweight unless debug mode is enabled; adjust in `app.js` if you need deeper instrumentation.
