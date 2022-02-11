# Audio Parameters

**Audio Settings**, which are specific to audio features. They are separated in three groups: general options (push and view), source side (push) options and viewer side (view) options.

## General options

You can add them to both, source and viewer sides.

| Parameter                                        | Explanation                                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| ``[`&deafen`](deafen.md)``                       | Audio playback is muted                                                                   |
| ``[`&noaudioprocessing`](noaudioprocessing.md)`` | Disables all webaudio audio-processing pipelines                                          |
| ``[`&stereo`](stereo.md)``                       | Sets the audio mode to stereo and changes default audio settings to improve audio quality |

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

| Parameter                                                  | Explanation                                                                                  |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| ``[`&audiodevice`](../../source-settings/audiodevice.md)`` | Pre-configures the selected audio device                                                     |
| ``[`&aec`](aec.md)``                                       | Automatic echo-cancellation is ON or OFF                                                     |
| ``[`&audiogain`](gain.md)``                                | Applies a gain multiplier (as a percentage) to the local microphone                          |
| ``[`&autogain`](autogain.md)``                             | Sets whether audio auto-normalization is ON or OFF                                           |
| ``[`&compressor`](and-compressor.md)``                     | Applies a generic audio compressor to the local microphone                                   |
| ``[`&denoise`](and-denoise.md)``                           | Turn audio noise reduction filter ON or OFF                                                  |
| ``[`&equalizer`](and-equalizer.md)``                       | Provides access to a generic audio equalizer that can be applied to the local microphone     |
| ``[`&limiter`](and-limiter.md)``                           | Applies a generic audio limiter to the local microphone                                      |
| ``[`&lowcut`](lowcut.md)``                                 | Adds a low-cut filter                                                                        |
| ``[`&noisegate`](noisegate.md)``                           | If someone else is speaking in a group call, the guest's microphone gets muted automatically |
| ``[`&audiolatency`](and-audiolatency.md)``                 | Adds an audio-latency to the published audio stream                                          |
| ``[`&micdelay`](and-micdelay.md)``                         | Delays the microphone by specified time in ms                                                |
| ``[`&mute`](and-mute.md)``                                 | Starts with the microphone muted by default                                                  |
| ``[`&mutespeaker`](and-mutespeaker.md)``                   | Auto mutes guest's speaker                                                                   |
| ``[`&outboundaudiobitrate`](and-outboundaudiobitrate.md)`` | Target audio bitrate and max bitrate for outgoing audio streams                              |
| ``[`&channelcount`](channelcount.md)``                     | Audio capture device to select N-number of audio channels                                    |

## **Viewer side options**

You have to add them to the viewer side ([`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)).

| Parameter                                                     | Explanation                                                                         |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| ``[`&outputdevice`](../view-parameters/and-outputdevice.md)`` | Like [`&sink`](../view-parameters/and-sink.md), but selects the audio output device |
| ``[`&sink`](../view-parameters/and-sink.md)``                 | Outputs the audio to the specified audio output device, rather than the default     |
| ``[`&audiobitrate`](audiobitrate.md)``                        | Manually sets the audio bitrate in kbps                                             |
| ``[`&vbr`](vbr.md)``                                          | Sets the audio bitrate to be variable, instead of constant                          |
| ``[`&mono`](mono.md)``                                        | Has the inbound audio playback as mono audio                                        |
| ``[`&noaudio`](noaudio.md)``                                  | Delivers video only streams; audio playback is disabled                             |
| ``[`&panning`](and-panning.md)``                              | Pans the outgoing audio left or right, allowing for spatial audio group chats       |
| ``[`&sync`](sync.md)``                                        | Sets an offset (in ms) for the automatic audio sync fix node                        |
| ``[`&samplerate`](and-samplerate.md)``                        | Audio playback sample-rate, in hz                                                   |
| ``[`&channels`](and-channels.md)``                            | Specifies the number of output audio channels you wish to mix up or down to         |
| ``[`&channeloffset`](and-channeloffset.md)``                  | Shifts audio channels 0 and 1 up channels, based on the offset value                |
| ``[`&ptime`](and-ptime.md)``                                  | Audio packet size                                                                   |
| ``[`&maxptime`](and-maxptime.md)``                            | Maximum packet size of audio                                                        |
| ``[`&minptime`](minptime.md)``                                | Minimum packet size of audio                                                        |
