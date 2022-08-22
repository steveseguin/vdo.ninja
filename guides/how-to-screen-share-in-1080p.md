# How to screen share in 1080p

### Push Link (Sender)

``[`https://vdo.ninja/?push=SOMESTREAMID&screenshare&quality=0`](https://vdo.ninja/?push=SOMESTREAMID\&screenshare\&quality=0)``\
``Alias:\
[`https://vdo.ninja/?push=SOMESTREAMID&ss&q=0`](https://vdo.ninja/?push=SOMESTREAMID\&ss\&q=0)``\
``Copy one of the two links above and change SOMESTREAMID into a different name. You could add [`&fps=60`](../advanced-settings/video-parameters/and-fps.md) to the link, but the default is already 60-fps.

### View Link (Viewer)

``[`https://vdo.ninja/?view=SOMESTREAMID&videobitrate=10000&scale=100`](https://vdo.ninja/?view=SOMESTREAMID\&videobitrate=10000\&scale=100)``\
``Alias:\
``[`https://vdo.ninja/?v=SOMESTREAMID&vb=10000&scale=100`](https://vdo.ninja/?v=SOMESTREAMID\&vb=10000\&scale=100)``\
``Copy one of the two links above and change SOMESTREAMID in the same name as you did for the Push Link. You can change `&videobitrate=10000` to another value if you want to change the bitrate.

### Explanation

| Parameter                                                                    | Explanation                                                                 |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Push Link                                                                    |                                                                             |
| ``[`&push=SOMESTREAMID`](../source-settings/push.md)``                       | sets a unique stream ID                                                     |
| ``[`&screenshare`](../source-settings/screenshare.md)``                      | selects screen sharing instead of webcam                                    |
| ``[`&quality=0`](../advanced-settings/video-parameters/and-quality.md)``     | sets the resolution to 1920x1080p                                           |
| View Link                                                                    |                                                                             |
| ``[`&view=SOMESTREAMID`](../advanced-settings/view-parameters/view.md)``     | selects the stream ID                                                       |
| ``[`&videobitrate=10000`](../advanced-settings/view-parameters/bitrate.md)`` | sets the video bitrate to 10,000-kbps, you can change the value if you want |
| ``[`&scale=100`](../advanced-settings/view-parameters/scale.md)``            | tells the system to not scale down the screen share                         |
