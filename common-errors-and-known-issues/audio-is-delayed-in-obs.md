# Audio is delayed in OBS

### OBS specific issues

Might be caused by a Browser-source related bug in OBS; this is normally the cause

Fully restart OBS and see if that clears the issue.\
\
Start OBS in administrator mode, if on Windows, to ensure it's not being throttled.\
\
Some users have had better luck fully uninstalling OBS and then re-installing it.\
\
If that fails, you can try to bring in audio via [https://vdo.ninja/electron](https://vdo.ninja/electron) instead. [`&novideo`](../advanced-settings/video-parameters/and-novideo.md) can be used to ingest just the audio. Route the audio to a virtual audio device and then bring that into OBS as an audio device. Should be in sync this way.

### Other possible options

VDO.Ninja uses 48000-hz sample rate for audio; using this sample rate whenever possible can help keep things in sync.

Try to avoid overloading your CPU or using too many browser source elements in OBS; OBS Browser Source can get overwhelmed.

VMix could be an alternative to OBS if problems persist; Vmix supports VDO.Ninja also.
