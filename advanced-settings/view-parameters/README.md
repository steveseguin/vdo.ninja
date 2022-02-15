# View Parameters

**Viewer's Settings**, which are aspects that are controllable by the viewer's side, which includes bitrate, codec, and layouts. These parameters are mostly added to [`&view`](view.md) and [`&scene`](scene.md) links. But some of them can also be added to guests and to the director.

| Parameter                                    | Explanation                                                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| ``[`&view`](view.md)``                       | Defines the stream or streams you are receiving, by their stream IDs                               |
| ``[`&scene`](scene.md)``                     | Defines the link to be treated like a scene, used by a room's director                             |
| ``[`&cc`](cc.md)``                           | Enables displaying of closed captioning text                                                       |
| ``[`&enhance`](enhance.md)``                 | Tells the remote source that you would like them to prioritize the audio stream over other streams |
| ``[`&fontsize`](fontsize.md)``               | Let you set font-size of the closed captions and stream labels                                     |
| ``[`&keyframerate`](keyframerate.md)``       | This tells the remote publishers to send keyframes at a specified rate                             |
| ``[`&manual`](manual.md)``                   | Disables the auto-mixer, allowing for a custom mixer to be used                                    |
| ``[`&maxpublishers`](and-maxpublishers.md)`` | Limits the number of remote peer connections that are publishers                                   |
| ``[`&obsfix`](and-obsfix.md)``               | Disables or adjusts the sensitivity of the VP8/VP9 Codec packet loss 'fix' for OBS                 |
| ``[`&streamlabs`](streamlabs.md)``           | Tells VDO.Ninja to not block VDO.Ninja from attempting to run when using Streamlabs for macOS      |
