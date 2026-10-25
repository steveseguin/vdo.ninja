---
description: Sets the outbound audio bitrate for Meshcast and WHIP output. Use &meshcastab or &mcab.
---

# \&meshcastaudiobitrate

Meshcast Option / Sender-Side Option! ([`&meshcast`](../../newly-added-parameters/and-meshcast.md), [`&push`](../../source-settings/push.md))

{% hint style="warning" %}
**Use `&meshcastab` or `&mcab`.** The full spelling `&meshcastaudiobitrate` is not recognized by the current code, so it has no effect.
{% endhint %}

## Aliases

* `&meshcastab`
* `&mcab`
* `&mcaudiobitrate`
* `&whipoutaudiobitrate`, `&woab` (same setting, see [`&whipoutaudiobitrate`](../whip-parameters/and-whipoutaudiobitrate.md))

## Options

Example: `&meshcastab=128`

| Value | Description |
| --- | --- |
| (integer) | Outbound Meshcast/WHIP audio bitrate in kbps |
| Omitted | The browser's default Opus bitrate |

## Details

Sets the Opus audio bitrate that the publisher sends to Meshcast or another WHIP output. The bitrate is constant (CBR) unless you also add [`&vbr`](../view-parameters/vbr.md). Adding the parameter also hides the audio bitrate menu in the WHIP publishing dialog.

```
https://vdo.ninja/?push=STREAMID&meshcast&meshcastab=128
```

It does not change audio sent over normal peer-to-peer connections.

## Related

{% content-ref url="../../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% content-ref url="../../meshcast-settings/and-meshcastbitrate.md" %}
[and-meshcastbitrate.md](../../meshcast-settings/and-meshcastbitrate.md)
{% endcontent-ref %}
