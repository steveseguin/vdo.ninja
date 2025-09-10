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
- Goal: reduce background noise and prioritize speech at the OS/browser level.
- Support varies; commonly available on iOS/macOS Safari. Unsupported browsers will ignore the flag.
- Interactions: can be used alongside echo cancellation, auto-gain, and noise suppression. Actual behavior may differ by platform.

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

