---
description: >-
  Styles lets you select how media elements are displayed in OBS and for guests;
  audio-only elements in particular
---

# \&style

## Aliases

* `&st`

## Options

| Value | Description                                                                                                                                                                                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | hides audio-only windows from appearing. The default is for guests to see audio-only boxes for guests that do not have a video feed; the director is excluded                                            |
| 2     | just shows an animated audio waveform of the speaker's voice, although I made the quality HD now                                                                                                         |
| 3     | shows the audio meter, which you can customize using \&meterstyle. You can conversely just use \&meterstyle on its own, and mix it with a different style, and it will still work                        |
| 4     | will just show a black background for any audio-only source                                                                                                                                              |
| 5     | will show a random color for a background, instead of just black                                                                                                                                         |
| 6     | will show the first letter of the guest's display name, in a colored circle, with a black background. If no display name is provided, it will just be a colored circle on a black background             |
| 0     | shows the audio-control bar with a little person as a background silhouette, if the stream is an audio-only. This lets you control the volume and mute and get some feedback that the stream is present. |

## Details

Styles are experimental and will undergo change, tweaks, and likely there are more to come.

The default style depends on numerous factors; the intent is to predict the most desirable for a given situation. Manually setting the style will override the default Defaults may be changed from time to time, based on user feedback.

## Related

{% content-ref url="meterstyle.md" %}
[meterstyle.md](meterstyle.md)
{% endcontent-ref %}
