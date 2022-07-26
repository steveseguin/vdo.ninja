# Publish to Facebook Live

There's a video guide on how to publish from VDO.Ninja to Facebook Live here: [https://www.youtube.com/watch?v=Zk345qg0U6U](https://www.youtube.com/watch?v=Zk345qg0U6U)

Some options that you can use to achieve this include:

RTMP is an option, typically done via OBS Studio. You can get a stream key for publishing from the Facebook Live production dashboard:\
[https://www.facebook.com/live/producer/](https://www.facebook.com/live/producer/)

You'd use the OBS Browser source to bring VDO.Ninja into OBS Studio.

You can also publish via OBS into Facebook via the Virtual camera, as Facebook supports webcam publishing. This will require the use of a virtual audio cable though, and since OBS does not yet include its own virtual audio cable, you'll have to download one.\
For example: [https://vb-audio.com/Cable/](https://vb-audio.com/Cable/)

You can also screen share VDO.Ninja into Facebook, bypassing the need for OBS altogether. Facebook doesn't support audio cable via screen share sadly, so you'll need to use a virtual audio cable still for audio routing.

You can use the Electron Capture app instead of Chrome as a screen sharing source, which provides exact resolution and always-on-top options. It also makes it easier to select the virtual audio cable output as the output destination.

With Chrome, you can select the virtual audio cable as the output source by adding [`&od=cable`](../advanced-settings/view-parameters/and-outputdevice.md) to the scene/view link, or by visiting [https://vdo.ninja/electron](https://vdo.ninja/electron) and selecting it from the drop down menu.
