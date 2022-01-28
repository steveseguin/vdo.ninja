# Audio is delayed in OBS

Might be caused by a Browser-source related bug in OBS.

Fully restart OBS and see if that clears the issue.

You can try to bring in audio via [https://vdo.ninja/electron](https://vdo.ninja/electron) instead. [`&novideo`](../viewers-settings/novideo.md) can be used to ingest just the audio. Route the audio to a virtual audio device and then bring that into OBS as an audio device. Should be in sync this way.

VDO.Ninja uses 48000khz sample rate for audio; using this sample rate whenever possible can help keep things in sync.

Try to avoid overloading your CPU or using too many browser source elements in OBS; OBS Browser Source can get overwhelmed.

VMix could be an alternative to OBS if problems persist; Vmix supports VDO.Ninja also.
