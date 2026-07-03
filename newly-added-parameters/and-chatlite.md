---
description: Enable Social Stream Ninja Lite overlay integration in VDO.Ninja
---

# \&chatlite

General Option! ([`&view`](../advanced-settings/view-parameters/view.md), [`&room`](../general-settings/room.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&director`](../viewers-settings/director.md))

## Aliases

* `&ssnlite`
* `&socialstreamlite`

## Details

`&chatlite` enables the built-in Social Stream Ninja Lite activity overlay integration. It can show an in-page chat overlay and expose a control-bar button that toggles the overlay.

This feature is URL-gated and opt-in.

Social Stream Ninja Lite can use native provider cards (YouTube/Twitch/Kick) and Social Stream WebSocket relay mode for broader event inputs.

In simple terms: this adds a small local chat/activity overlay inside VDO.Ninja so you can see supported chat feeds without leaving the page. It is not the full Social Stream Ninja extension, and normal VDO.Ninja pages do not load it unless one of the Chat Lite URL flags is present.

## Basic setup

1. Add `&chatlite=1` to the VDO.Ninja link where you want the overlay.
2. Click the Social Stream Ninja Lite control-bar button while holding `SHIFT` to open the setup window.
3. Connect YouTube, Twitch, Kick, or the Social Stream WebSocket relay source.
4. Keep the setup window and VDO.Ninja page using the same session ID.

For a button without opening the overlay immediately, use `&chatlitebutton=1`. For a specific session name, add `&chatlitesession=YOURSESSION`.

### Companion flags

Use these optional parameters with `&chatlite`:

<table><thead><tr><th width="255">Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>&amp;chatlitebutton</code> (alias: <code>&amp;ssnchatbutton</code>)</td><td>Show/hide the Chat Lite control button</td></tr><tr><td><code>&amp;chatlitesession</code> (alias: <code>&amp;ssnsession</code>)</td><td>Set the session ID used by the overlay</td></tr><tr><td><code>&amp;chatliteprofile</code></td><td>Apply a profile preset in the Chat Lite UI</td></tr><tr><td><code>&amp;chatliteposition</code></td><td>Set overlay position behavior for activity mode</td></tr><tr><td><code>&amp;chatlitemax</code></td><td>Set max retained/visible activity messages</td></tr><tr><td><code>&amp;chatlitetransparent</code></td><td>Toggle transparent embed background</td></tr><tr><td><code>&amp;chatlitenoavatar</code> (alias: <code>&amp;chatlitehideavatar</code>)</td><td>Hide source avatars in activity view</td></tr><tr><td><code>&amp;chatliteconfig</code></td><td>Auto-open the Chat Lite setup window</td></tr><tr><td><code>&amp;chatlitetts</code></td><td>Set TTS mode (for example <code>on</code>, <code>all</code>, <code>donations</code>)</td></tr></tbody></table>

### UI shortcuts

When the Chat Lite button is visible:

* Click: toggle overlay visibility
* `SHIFT` + click: open configuration popup
* `ALT`/`CTRL` + click: toggle native browser TTS

## Native TTS

`&chatlitetts=on` or `&chatlitetts=all` enables native browser text-to-speech for incoming Lite activity messages. `&chatlitetts=donations` speaks only donation/member-style events.

This uses the browser/system `speechSynthesis` voices. It is useful on desktop and mobile browsers, including Android and iOS when the browser permits it. Some browsers require a user gesture before speech can start.

Only text content is spoken. HTML tags, scripts, event handlers, style blocks, iframe content, and media-only nodes are filtered out before speech text is built. Images are spoken only when they provide useful `alt` or `title` text.

## Notes and limits

* The built-in Chat Lite overlay works best inside the same browser profile that opened VDO.Ninja.
* The "copy overlay link" flow should be treated as a local pop-out/activity view, not a guaranteed cross-browser or cross-machine OBS overlay link.
* If you want a true standalone Social Stream overlay over SSN WebSockets, use the Social Stream theme overlays instead of the built-in Chat Lite activity page.
* Pop-outs and setup windows opened from the same VDO.Ninja page stay paired to that page; manually opened standalone Chat Lite pages still use the default browser-level session behavior.
* This Lite integration does not currently try to match every Social Stream Ninja feature. Full emote-provider support, advanced TTS engines, and extension-only capture behavior should still use Social Stream Ninja directly.
* The activity renderer sanitizes incoming HTML before display. Links and images are restricted to safe renderable URLs, and executable markup is dropped.

## Examples

Enable overlay and button:

`https://vdo.ninja/?view=stream123&chatlite=1`

Set a specific session and transparent mode:

`https://vdo.ninja/?view=stream123&chatlite=1&chatlitesession=myshow&chatlitetransparent=1`

Auto-open setup UI:

`https://vdo.ninja/?room=myroom&chatlitebutton=1&chatliteconfig=1`

Enable compact bottom-right overlay with native TTS:

`https://vdo.ninja/?view=stream123&chatlite=1&chatliteprofile=compact&chatliteposition=bottom-right&chatlitemax=8&chatlitetts=all`

Enable the overlay but speak only donation/member-style events:

`https://vdo.ninja/?view=stream123&chatlite=1&chatlitetts=donations`

## Related

{% content-ref url="../steves-helper-apps/chat-lite.md" %}
[chat-lite.md](../steves-helper-apps/chat-lite.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/social-stream-ninja/" %}
[social-stream-ninja](../steves-helper-apps/social-stream-ninja/)
{% endcontent-ref %}
