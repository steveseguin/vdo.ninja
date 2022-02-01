---
description: Specifies the number of output audio channels you wish to mix up or down to
---

# \&channels

## Options

| Value           | Description                     |
| --------------- | ------------------------------- |
| (integer value) | number of audio output channels |

## Details

Left and right is available for most users; channels 1 and 2

* Up to 6-channels is possible, if your output device supports it.
* On Windows, you might need to select 5.1 surround sound with your device in the Windows audio settings
* On macOS, you might want to consider using SoundFlower, as it seems the most correct with its routing.

Designed to be used with [`&channeloffset`](../#channeloffset).

Please see here for detailed testing results with different audio devices: [https://docs.google.com/spreadsheets/d/1R-y7xZ2BCn-GzTlwqq63H8lorXecO02DU9Hu4twuhuA/](https://docs.google.com/spreadsheets/d/1R-y7xZ2BCn-GzTlwqq63H8lorXecO02DU9Hu4twuhuA/)

## Related

{% content-ref url="and-channeloffset.md" %}
[and-channeloffset.md](and-channeloffset.md)
{% endcontent-ref %}

{% content-ref url="../source-parameters/channelcount.md" %}
[channelcount.md](../source-parameters/channelcount.md)
{% endcontent-ref %}
