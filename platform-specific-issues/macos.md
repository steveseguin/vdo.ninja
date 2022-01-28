# macOS

{% hint style="info" %}
As of January 2021, OBS for macOS now supports VDO.Ninja natively. Update to OBS v26.1.2 for macOS to obtain access.
{% endhint %}

Please not that only H264 hardware decoding is supported, so you may wish to specify [`&codec=h264`](../viewers-settings/codec.md) in your OBS view links to reduce CPU load.

For those using older versions of OBS or StreamLabs, I recommend instead using the Electron Capture app to assist: [https://github.com/steveseguin/electroncapture](https://github.com/steveseguin/electroncapture). Follow the link for instructions and files.

## Capturing audio

{% hint style="info" %}
_Please note: This section is obsolete now, unless you are still using the Electron Capture app on macOS. For other users, update to OBS v26.1.2 to obtain audio capture support directly in OBS itself. (Be sure to select "Control audio via OBS" when setting up your browser source in OBS to allow for this)_
{% endhint %}

To capture audio on macOS using the Electron Capture app, you'll need a virtual audio cable; something to loopback the audio-output back into the system as an input source. Some software options include:

| Software      | Price        | URL                                                                                                                                                                                  |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Blackhole     | **Free**     | [https://existential.audio/blackhole/](https://existential.audio/blackhole/)                                                                                                         |
| VB Cable      | Donationware | [https://vb-audio.com/Cable/](https://vb-audio.com/Cable/)                                                                                                                           |
| Loopback      | _Paid_       | [https://rogueamoeba.com/loopback/](https://rogueamoeba.com/loopback/)                                                                                                               |
| Audiohijack   | _Paid_       | [https://rogueamoeba.com/audiohijack](https://rogueamoeba.com/audiohijack)                                                                                                           |
| iShowU        | _Paid_       | [https://obsproject.com/forum/resources/os-x-capture-audio-with-ishowu-audio-capture.505/](https://obsproject.com/forum/resources/os-x-capture-audio-with-ishowu-audio-capture.505/) |
| Soundflower   | **Free**     | [https://rogueamoeba.com/freebies/soundflower/](https://rogueamoeba.com/freebies/soundflower/)                                                                                       |
| GroundControl | **Free**     | [https://www.gingeraudio.com/](https://www.gingeraudio.com)                                                                                                                          |

With the above software, you can also share and stream your macOS desktop audio: [Guide Here](https://kast.zendesk.com/hc/en-us/articles/360031463111-How-to-stream-computer-audio-on-a-Mac)

If your mac is unable to handle OBS and VDO.Ninja, another solution use the cloud to host OBS remotely.

Here is an example of a pay-by-the-hour cloud server you can rent for a few dollars: [https://console.cloud.google.com/marketplace/details/nvidia/nvidia-gaming-windows-server-2019](https://console.cloud.google.com/marketplace/details/nvidia/nvidia-gaming-windows-server-2019) It works great, but takes some time to setup for novices. You can also use Paperspace or AWS Workstations as a remote Windows options; Paperspace is easier to get going with. When picking a VM to use, you'll want a machine with a dozen or more vCPU cores, and/or a system with an Nvidia GPU. A GPU works quite well to accelerate RTMP video encoding and VDO.Ninja video decoding.

## Safari on macOS

While Safari may work with VDO.Ninja, it is generally advised to not use Safari with macOS. The microphone may become muted if the tab is minimized, echo-cancellation doesn't quite work as well as with Chromium-based browsers, video/audio issues are more common, and many of the advanced features offered by VDO.Ninja are not supported on non-Chromium-based Browsers. Consider using the Electron Capture app if adverse to installing or using Chrome, as it is based no Chromium but community created specifically for VDO.Ninja.
