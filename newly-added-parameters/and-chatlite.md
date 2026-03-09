---
description: Enable Social Stream Lite overlay integration in VDO.Ninja
---

# \&chatlite

General Option! ([`&view`](../advanced-settings/view-parameters/view.md), [`&room`](../general-settings/room.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&director`](../viewers-settings/director.md))

## Aliases

* `&ssnlite`
* `&socialstreamlite`

## Details

`&chatlite` enables the built-in Social Stream Lite activity overlay integration. It can show an in-page chat overlay and expose a control-bar button that toggles the overlay.

This feature is URL-gated and opt-in.

Chat Lite can use native provider cards (YouTube/Twitch/Kick) and Social Stream WebSocket relay mode for broader event inputs.

In simple terms: this adds a chat drawer/overlay inside VDO.Ninja so you can see supported chat feeds without leaving the page.

### Companion flags

Use these optional parameters with `&chatlite`:

<table><thead><tr><th width="255">Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>&amp;chatlitebutton</code> (alias: <code>&amp;ssnchatbutton</code>)</td><td>Show/hide the Chat Lite control button</td></tr><tr><td><code>&amp;chatlitesession</code> (alias: <code>&amp;ssnsession</code>)</td><td>Set the session ID used by the overlay</td></tr><tr><td><code>&amp;chatliteprofile</code></td><td>Apply a profile preset in the Chat Lite UI</td></tr><tr><td><code>&amp;chatliteposition</code></td><td>Set overlay position behavior for activity mode</td></tr><tr><td><code>&amp;chatlitemax</code></td><td>Set max retained/visible activity messages</td></tr><tr><td><code>&amp;chatlitetransparent</code></td><td>Toggle transparent embed background</td></tr><tr><td><code>&amp;chatlitenoavatar</code> (alias: <code>&amp;chatlitehideavatar</code>)</td><td>Hide source avatars in activity view</td></tr><tr><td><code>&amp;chatliteconfig</code></td><td>Auto-open the Chat Lite setup window</td></tr><tr><td><code>&amp;chatlitetts</code></td><td>Set TTS mode (for example <code>on</code>, <code>all</code>, <code>donations</code>)</td></tr></tbody></table>

### UI shortcuts

When the Chat Lite button is visible:

* Click: toggle overlay visibility
* `SHIFT` + click: open configuration popup
* `ALT`/`CTRL` + click: toggle TTS mode

## Notes and limits

* The built-in Chat Lite overlay works best inside the same browser profile that opened VDO.Ninja.
* The "copy overlay link" flow should be treated as a local pop-out/activity view, not a guaranteed cross-browser or cross-machine OBS overlay link.
* If you want a true standalone Social Stream overlay over SSN WebSockets, use the Social Stream theme overlays instead of the built-in Chat Lite activity page.
* Pop-outs and setup windows opened from the same VDO.Ninja page stay paired to that page; manually opened standalone Chat Lite pages still use the default browser-level session behavior.

## Examples

Enable overlay and button:

`https://vdo.ninja/?view=stream123&chatlite=1`

Set a specific session and transparent mode:

`https://vdo.ninja/?view=stream123&chatlite=1&chatlitesession=myshow&chatlitetransparent=1`

Auto-open setup UI:

`https://vdo.ninja/?room=myroom&chatlitebutton=1&chatliteconfig=1`

## Related

{% content-ref url="../steves-helper-apps/chat-lite.md" %}
[chat-lite.md](../steves-helper-apps/chat-lite.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/social-stream-ninja/" %}
[social-stream-ninja](../steves-helper-apps/social-stream-ninja/)
{% endcontent-ref %}
