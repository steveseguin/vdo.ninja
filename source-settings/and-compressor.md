---
description: Applies a generic audio compressor to the local microphone
---

# \&compressor

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&comp`

## Details

By adding `&compressor` to a source link, it applies a generic audio compressor to the local microphone.

An audio compressor can help reduce spikes in audio loudness.

{% hint style="info" %}
The compressor is **off by default**.
{% endhint %}

{% hint style="warning" %}
This will enable the audio processing pipeline.
{% endhint %}

There is a toggle in the director's room which adds `&comp` to the guest's invite link.\
![](<../.gitbook/assets/image (108).png>)

## Update in Version 22

There is now an option to control the compressor remotely (3 states for the compressor; Off/On/Limiter)

![](../.gitbook/assets/image.png)

## Related

{% content-ref url="and-limiter.md" %}
[and-limiter.md](and-limiter.md)
{% endcontent-ref %}
