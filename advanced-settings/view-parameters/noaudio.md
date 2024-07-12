---
description: Delivers video only streams; audio playback is disabled
---

# \&noaudio

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&na`
* `&hideaudio`

## Details

Delivers video only streams; audio playback is disabled for all incoming streams. `&noaudio` also hides the speaker button.

You can pass a comma separated list of stream IDs that will be excluded, so that they specifically will play audio. `?noaudio=guest1a,guest2a` will only allow audio from guest1a and guest2a to play



External Iframes may or may not be muted by default if using \&noaudio. While I try to mute frames when possible, like embedded Youtube videos, there may be still some Iframe sources I cannot mute.

`&exludeaudio` can also be used to specify certain stream IDs that will NOT play audio, so the inverse of `&noaudio`



If you want to be able to unmute the speaker button during production, use [`&mutespeaker`](../../source-settings/and-mutespeaker.md) instead of `&noaudio`.&#x20;

[`&deafen`](../../general-settings/deafen.md) also disables monitoring your own audio, then it's impossible to get any sound from VDO.Ninja.



## Related

{% content-ref url="../audio-parameters/and-nodirectoraudio.md" %}
[and-nodirectoraudio.md](../audio-parameters/and-nodirectoraudio.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/and-mutespeaker.md" %}
[and-mutespeaker.md](../../source-settings/and-mutespeaker.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/deafen.md" %}
[deafen.md](../../general-settings/deafen.md)
{% endcontent-ref %}

{% content-ref url="../video-parameters/and-novideo.md" %}
[and-novideo.md](../video-parameters/and-novideo.md)
{% endcontent-ref %}
