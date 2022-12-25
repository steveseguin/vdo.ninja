---
description: Filters, adding delay, bitrate, channels, mono/stereo, muting guests etc.
---

# Audio Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General options

You can add them to both, source ([`&push`](../../source-settings/push.md)) and viewer ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md)) sides.

| Parameter                                                               | Explanation                                                                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ``[`&proaudio`](and-proaudio.md)``                                      | Improves the audio quality, changes default audio settings and sets the audio mode to stereo |
| ``[`&stereo`](../../general-settings/stereo.md)``                       | Sets the audio mode to stereo and changes default audio settings to improve audio quality    |
| ``[`&mutespeaker`](../../source-settings/and-mutespeaker.md)``          | Auto mutes the speaker                                                                       |
| ``[`&deafen`](../../general-settings/deafen.md)``                       | Audio playback is muted                                                                      |
| ``[`&noaudioprocessing`](../../general-settings/noaudioprocessing.md)`` | Disables all webaudio audio-processing pipelines                                             |

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

| Parameter                                                                        | Explanation                                                                              |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| ``[`&audiodevice`](../../source-settings/audiodevice.md)``                       | Pre-configures the selected audio device                                                 |
| ``[`&echocancellation`](../../source-settings/aec.md)``                          | Automatic echo-cancellation is ON or OFF                                                 |
| ``[`&audiogain`](and-audiogain.md)``                                             | Applies a gain multiplier (as a percentage) to the local microphone                      |
| ``[`&autogain`](../../source-settings/autogain.md)``                             | Sets whether audio auto-normalization is ON or OFF                                       |
| ``[`&compressor`](../../source-settings/and-compressor.md)``                     | Applies a generic audio compressor to the local microphone                               |
| ``[`&denoise`](../../source-settings/and-denoise.md)``                           | Turn audio noise reduction filter ON or OFF                                              |
| ``[`&equalizer`](../../source-settings/and-equalizer.md)``                       | Provides access to a generic audio equalizer that can be applied to the local microphone |
| ``[`&limiter`](../../source-settings/and-limiter.md)``                           | Applies a generic audio limiter to the local microphone                                  |
| ``[`&lowcut`](../../source-settings/lowcut.md)``                                 | Adds a low-cut filter                                                                    |
| ``[`&noisegate`](../../source-settings/noisegate.md)``                           | Lowers your mic volume to 10% of its current value based on volume-level activity        |
| ``[`&noisegatesettings`](and-noisegatesettings.md)\*                             | Lets you tweak the \&noisegate variables, making it more or less aggressive as needed    |
| ``[`&audiocontenthint`](and-audiocontenthint.md)\*                               | `=music` fixed bitrate; `=speech` bitrate is variable                                    |
| ``[`&audiolatency`](../../newly-added-parameters/and-audiolatency.md)``          | Adds an audio-latency to the published audio stream                                      |
| ``[`&micdelay`](../../source-settings/and-micdelay.md)``                         | Delays the microphone by specified time in ms                                            |
| ``[`&mute`](../../source-settings/and-mute.md)``                                 | Starts with the microphone muted by default                                              |
| ``[`&automute`](and-automute-alpha.md) (alpha)                                   | Will mute the microphone of a guest when not loaded in an active OBS scene               |
| ``[`&outboundaudiobitrate`](../../source-settings/and-outboundaudiobitrate.md)`` | Target audio bitrate and max bitrate for outgoing audio streams                          |
| ``[`&inputchannels`](and-inputchannels.md)``                                     | Audio capture device to select N-number of audio channels                                |
| ``[`&monomic`](and-monomic.md)\*                                                 | Sets a guest's audio input to mono (1-channel)                                           |

\*NEW IN VERSION 22

## **Viewer side options**

You have to add them to the viewer side ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md) or [`&solo`](../mixer-scene-parameters/and-solo.md)).

| Parameter                                                       | Explanation                                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| ``[`&audiooutput`](../setup-parameters/and-audiooutput.md)``    | Like [`&sink`](../view-parameters/and-sink.md), but selects the audio output device |
| ``[`&sink`](../view-parameters/and-sink.md)``                   | Outputs the audio to the specified audio output device, rather than the default     |
| ``[`&volume`](and-volume.md)\*                                  | Sets the 'default' playback volume for all video elements                           |
| ``[`&volumecontrol`](and-volumecontrol.md)\*                    | Shows a dedicated local audio-volume control bar for canvas or image elements       |
| ``[`&audiobitrate`](../view-parameters/audiobitrate.md)``       | Manually sets the audio bitrate in kbps                                             |
| ``[`&vbr`](../view-parameters/vbr.md)``                         | Sets the audio bitrate to be variable, instead of constant                          |
| ``[`&mono`](../view-parameters/mono.md)``                       | Has the inbound audio playback as mono audio                                        |
| ``[`&noaudio`](../view-parameters/noaudio.md)``                 | Delivers video only streams; audio playback is disabled                             |
| ``[`&panning`](../view-parameters/and-panning.md)``             | Pans the outgoing audio left or right, allowing for spatial audio group chats       |
| ``[`&sync`](../view-parameters/sync.md)``                       | Sets an offset (in ms) for the automatic audio sync fix node                        |
| ``[`&samplerate`](../view-parameters/and-samplerate.md)``       | Audio playback sample-rate, in hz                                                   |
| ``[`&channels`](../view-parameters/and-channels.md)``           | Specifies the number of output audio channels you wish to mix up or down to         |
| ``[`&channeloffset`](../view-parameters/and-channeloffset.md)`` | Shifts audio channels 0 and 1 up channels, based on the offset value                |
| ``[`&ptime`](../view-parameters/and-ptime.md)``                 | Audio packet size                                                                   |
| ``[`&maxptime`](../view-parameters/and-maxptime.md)``           | Maximum packet size of audio                                                        |
| ``[`&minptime`](../view-parameters/minptime.md)``               | Minimum packet size of audio                                                        |
| ``[`&audiocodec`](minptime-1.md) (alpha)                        | Lets you specify the audio codec                                                    |
| ``[`&dtx`](minptime-2.md) (alpha)                               | Turns off the audio encoder automatically when no little to no sound is detected    |
| ``[`&nofec`](minptime-3.md) (alpha)                             | Disables FEC (audio forward error correction)                                       |

\*NEW IN VERSION 22
