---
description: Enables OS/UA voice isolation mode for the microphone
---

# \&voiceisolation

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&isolation`
* `&vi`

## Options

Examples:

- `&voiceisolation` (enable)
- `&voiceisolation=true`
- `&voiceisolation=0` or `&voiceisolation=off` (disable)

## Details

- Capture constraint: requests `getUserMedia({ audio: { voiceIsolation: true } })`.
- Scope: microphone capture only. It is not applied to `getDisplayMedia()` screen-share / tab / system-audio capture paths.
- Goal: reduce background noise and prioritize speech at the OS/browser level.
- Support varies; commonly available on iOS/macOS Safari. Unsupported browsers will ignore the flag.
- Interactions: can be used alongside echo cancellation, auto-gain, and noise suppression. Actual behavior may differ by platform.
- Performance: on slower or already CPU-bound guests, `&voiceisolation` can increase processing load and contribute to lag.
- Workarounds: if guests start falling behind, try [`&noap`](../general-settings/noaudioprocessing.md) to disable the extra Web Audio processing pipeline, or use [`&denoise`](and-denoise.md) instead when you want a lighter noise-reduction option.

## Related

{% content-ref url="aec.md" %}
[aec.md](aec.md)
{% endcontent-ref %}

{% content-ref url="and-denoise.md" %}
[and-denoise.md](and-denoise.md)
{% endcontent-ref %}

{% content-ref url="autogain.md" %}
[autogain.md](autogain.md)
{% endcontent-ref %}
