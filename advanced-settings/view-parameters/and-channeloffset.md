---
description: Shifts audio channels 0 and 1 up channels, based on the offset value
---

# \&channeloffset

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Options

| Value           | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| (numeric value) | Number of channels to shift the audio, starting at channel 0 |

## Details

Total channels is assumed to be 8 if this is used and not otherwise specified.

Does not work with all audio output devices and may require experimentation.

Best to use this with a mono input, as stereo channel shifting can cause issues. Simpler that way.

Please see here for detailed testing results with different audio devices: [https://docs.google.com/spreadsheets/d/1R-y7xZ2BCn-GzTlwqq63H8lorXecO02DU9Hu4twuhuA/](https://docs.google.com/spreadsheets/d/1R-y7xZ2BCn-GzTlwqq63H8lorXecO02DU9Hu4twuhuA/)

## Related

{% content-ref url="../../source-settings/channelcount.md" %}
[channelcount.md](../../source-settings/channelcount.md)
{% endcontent-ref %}

{% content-ref url="and-channels.md" %}
[and-channels.md](and-channels.md)
{% endcontent-ref %}
