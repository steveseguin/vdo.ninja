---
description: >-
  Relays an incoming chunked media stream to downstream viewers without
  transcoding it first.
---

# \&retransmit

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Details

`&retransmit` is an experimental relay mode for incoming [`&chunked`](../../newly-added-parameters/and-chunked.md) streams. It lets a client receive a chunked stream and then publish that same encoded stream onward to other viewers without re-encoding it.

This enables a manual peer-to-peer-to-peer relay chain for supported chunked workflows.

### Current expectations

* It is intended for incoming chunked streams.
* It is still experimental and best suited to controlled one-stream workflows.
* It behaves more like a relay or restream node than a normal camera or mic publisher.
* It introduces additional delay depending on buffering, link quality, and recovery settings.

### Example p2p-to-p2p relay setup

```text
https://vdo.ninja/?chunked&push=PUBLISHER123
```

This is the source, publishing in chunked mode.

```text
https://vdo.ninja/?view=PUBLISHER123&retransmit&push=RESTREAMER123
```

This client receives the source and republishes it as a chunked relay stream.

```text
https://vdo.ninja/?view=RESTREAMER123
```

This viewer watches the relayed stream.

{% hint style="info" %}
`&retransmit` remains an advanced experimental option. It is not a fully automatic distribution system, and support varies depending on runtime, buffering, and chunked transport compatibility.
{% endhint %}

## Related

{% content-ref url="../../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}
