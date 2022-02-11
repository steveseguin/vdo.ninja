---
description: Audio capture device to select N-number of audio channels
---

# \&channelcount

## Aliases

* `&ac`

## Options

| Value             | Description                            |
| ----------------- | -------------------------------------- |
| 2                 | Audio capture device set to 2 channels |
| 6                 | Audio capture device set to 6 channels |
| (integer value X) | Audio capture device set to X channels |

## Details

`&channelcount=N` tells the audio capture device explicitly to select N-number of audio channels. This shouldn’t be needed often, but may help with debugging or advanced use canses. Setting [`&stereo=0`](stereo.md) will set `&channecount=1` by default.

## Related

{% content-ref url="and-channeloffset.md" %}
[and-channeloffset.md](and-channeloffset.md)
{% endcontent-ref %}
