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

| Parameter                                                                             | Explanation                                                                 |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Push Link                                                                             |                                                                             |
| ``[`&push=SOMESTREAMID`](../source-settings/push.md)``                                | sets a unique stream ID                                                     |
| ``[`&screenshare`](../source-settings/screenshare.md)``                               | selects screen sharing instead of webcam                                    |
| ``[`&quality=0`](../advanced-settings/video-parameters/and-quality.md)``              | sets the resolution to 1920x1080p                                           |
| View Link                                                                             |                                                                             |
| ``[`&view=SOMESTREAMID`](../advanced-settings/view-parameters/view.md)``              | selects the stream ID                                                       |
| ``[`&videobitrate=10000`](../advanced-settings/video-bitrate-parameters/bitrate.md)`` | sets the video bitrate to 10,000-kbps, you can change the value if you want |
| ``[`&scale=100`](../advanced-settings/view-parameters/scale.md)``                     | tells the system to not scale down the screen share                         |

{% hint style="info" %}
If you have problems you could add [`&codec=av1`](../advanced-settings/view-parameters/codec.md) to the viewer's side and see if it makes the screen share any better.
{% endhint %}

### Framerate

Screen share in 60 FPS is the default. You can force it by adding [`&fps=60`](../advanced-settings/video-parameters/and-fps.md) to the source. If you get an error you could add [`&maxframerate=60`](../source-settings/and-maxframerate.md) instead.

{% hint style="warning" %}
You may not achieve 60 FPS depending on your hardware, the browser or the type of screen share you use or the viewer uses. Sharing a window or a chrome tab might give a higher frame rate than sharing the screen.
{% endhint %}
