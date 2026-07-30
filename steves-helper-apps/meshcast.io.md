---
description: >-
  A low latency video CDN and app surface for larger-room and one-to-many
  VDO.Ninja workflows.
---

# Meshcast.io

{% embed url="https://meshcast.io" %}
[https://meshcast.io/](https://meshcast.io/)
{% endembed %}

Meshcast is a free-to-use service that works alongside VDO.Ninja. It provides a low-latency CDN-style path for larger rooms and one-to-many distribution workflows without pushing the full load onto the original publisher.

The newer Meshcast app is available at [https://app.meshcast.io](https://app.meshcast.io). It is an updated version of the original Meshcast service, is still free to use, and now requires signing in.

The main public entry points are:

* [https://meshcast.io](https://meshcast.io)
* [https://app.meshcast.io](https://app.meshcast.io)

It is not intended as a mass-broadcast CDN in the traditional sense, but it is designed to handle larger viewing groups more efficiently than pure peer-to-peer fanout alone.

## Production uses

Meshcast can be useful when a normal peer-to-peer VDO.Ninja connection is not the best fit for a guest, venue, or recording workflow.

For example:

* a guest on a difficult connection can publish with RTMP or SRT into Meshcast
* Meshcast can then provide a path back into VDO.Ninja via WebRTC-style playback
* a production can use WHIP, RTMP, SRT, or VDO.Ninja-style workflows depending on what the guest's setup can handle

This makes Meshcast a server-based option for cases where a browser-to-browser connection is too fragile, blocked, or inconsistent. It is a separate service, but it is designed to work well with VDO.Ninja.

## Delayed HLS playback

Meshcast's HLS player can keep an incoming audio/video stream a fixed number of seconds behind live. This is useful for broadcast safety delays and for bringing a delayed feed into OBS.

For example, a two-minute delay uses `delay=120`:

```text
https://app.meshcast.io/hls-player/STREAM_ID?delay=120&muted=0&controls=0
```

HLS requires a registered Meshcast account. Start the ingest at least two minutes before opening the player so the complete delay is available.

{% content-ref url="../guides/delay-an-incoming-feed.md" %}
[delay-an-incoming-feed.md](../guides/delay-an-incoming-feed.md)
{% endcontent-ref %}

{% embed url="https://www.youtube.com/watch?v=-7QsLChfdsE" %}
[https://youtu.be/-7QsLChfdsE](https://youtu.be/-7QsLChfdsE)
{% endembed %}

{% content-ref url="../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/meshcast-parameters/" %}
[meshcast-parameters](../advanced-settings/meshcast-parameters/)
{% endcontent-ref %}

## Updates

{% content-ref url="../updates/updates-meshcast.io.md" %}
[updates-meshcast.io.md](../updates/updates-meshcast.io.md)
{% endcontent-ref %}
