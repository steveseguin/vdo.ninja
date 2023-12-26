---
description: >-
  Will relay the incoming 'chunked' media stream to others connected to you,
  without transcoding
---

# \&retransmit

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Details

Added a new experimental option called `&retransmit`; it will relay the incoming '[chunked](../../newly-added-parameters/and-chunked.md)' media stream to others connected to you, without transcoding. In a way, this enables a form of peer to peer to peer broadcasting.\
\
\-- It only works with incoming [`&chunked`](../../newly-added-parameters/and-chunked.md) data streams, however trying to forward more than one chunked stream will break things currently.\
\-- It will disable your own mic/camera from being streamed; when `&retransmit` is used it configures itself as a viewer in a sense.\
\-- Chunked mode has a default play out buffer delay of about 1-second still, but that buffer time does not get passed down to the relayed viewer. There is still some transmission delay that gets introduced though, but it can be very low latency on a series of good computers/network.

### Example p2p2p setup:

```
https://vdo.ninja/?chunked&push=PUBLISHER123
```

This is the source. Notice they are publishing in chunked mode.

```
https://vdo.ninja/?view=PUBLISHER123&retransmit&push=RESTREAMER123
```

This person is both viewing the video, but also relaying.

```
https://vdo.ninja/?view=RESTREAMER123
```

This person is viewing the stream from the relayed chunked stream; p2p2p. They don't know they are getting a relayed stream.

{% hint style="info" %}
This feature is just for fun at the moment. It's does not do automatic p2p2p broadcasting, as you still need to manually customize who sees what, and chunked mode isn't compatible with all browsers/devices yet.
{% endhint %}

## Related

{% content-ref url="../../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
