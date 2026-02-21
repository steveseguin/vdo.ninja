---
description: Lightweight Social Stream activity overlay integrated into VDO.Ninja
---

# Chat Lite

Chat Lite is a lightweight social activity overlay UI that can run standalone or embedded inside VDO.Ninja.

Current provider cards include YouTube, Twitch, Kick, and Social Stream WebSocket relay mode.

## Sources

Chat Lite can ingest from native provider cards (YouTube/Twitch/Kick) or from the Social Stream WebSocket relay source:

* `wss://io.socialstream.ninja` with a matching session ID

This relay mode can carry additional platform events through the same activity feed workflow.

## Links

* App: [https://vdo.ninja/chat-lite/](https://vdo.ninja/chat-lite/)
* Activity/embed mode example: [https://vdo.ninja/chat-lite/index.html?view=activity\&embed=1\&session=demo](https://vdo.ninja/chat-lite/index.html?view=activity\&embed=1\&session=demo)

## VDO.Ninja integration

You can enable Chat Lite integration in VDO.Ninja using URL parameters like:

* `&chatlite=1`
* `&chatlitebutton=1`
* `&chatlitesession=YOURSESSION`

See the full parameter reference:

{% content-ref url="../newly-added-parameters/and-chatlite.md" %}
[and-chatlite.md](../newly-added-parameters/and-chatlite.md)
{% endcontent-ref %}

### Control-strip behavior

When enabled inside VDO.Ninja:

* Normal click toggles the Chat Lite activity overlay
* `SHIFT` + click opens Chat Lite setup
* `ALT` / `CTRL` + click toggles TTS mode

The activity/embed view is intended as display-only output, so overlays do not auto-connect providers in the background.

## Related

{% content-ref url="social-stream-ninja/" %}
[social-stream-ninja](social-stream-ninja/)
{% endcontent-ref %}
