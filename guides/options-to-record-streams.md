# Options to record streams

There are several ways to record, with more ways coming. I'll list some of the ways here, although they may not be exactly what you had in mind. Regardless of which method you prefer, having a backup recording going is always advisable.

### Local / Remote Recording in VDO.Ninja

The VDO.Ninja room director has the option to record streams locally and remotely.

You can also add \&record to guest invite URL to introduce a recording button, for that publisher to start/stop their own local recording. Local recordings of this type are often of high quality.

You can also right-click and record any video within VDO.Ninja.

Depending on the type of video, and whether its local or remote, recording the video with this method may use up extra resources from the publisher's computer, including CPU and bandwidth.

Another issue is the format saved is WebM, which sometimes will need post-processing to make it compatible with many popular video editors. If the browser crashes, that also may cause the video recording to become lost, so it might not be the most reliable option.

That said, this is an easy option and available for free within VDO.Ninja.

Given thesmall chance the browser will fail with recording, you can use features like `&splitrecording` to automatically segment the video as its being recorded, saving perhaps 5-minute portions of the video at a time. You will need to concatenate the video chunks together however afterwards, but helps reduce the likelihood of the entire recording being lost due to a system crash.

### Using OBS to record; or multiple OBS

You can open multiple OBS Studios. Each OBS can record a full-window video if needed. This is useful if doing an interview with someone, and you intend to post process edit it.

OBS has advanced hardware accelerated encoding options, and so this is good option if wanting to have a few high-resolution recordings taking place, as you can offload the encoding to the GPU if available.

If adding `&channel=8` to your view/scene link in OBS, and enabling 7.1-channel audio in OBS, you can have a specific guest be recorded to a specific audio channel in your OBS recording. This is a bit finicky, given how 7.1-channel audio is hard to downmix into a proper stereo output, but for recording a podcast it might be a great option still to help in post-production ease. As of VDO.Ninja v26, the director has options to control these channels dynamically, under a guest's scene-settings menu.

<figure><img src="../.gitbook/assets/image (245).png" alt=""><figcaption><p>Multiple channels available for recording; one per guest, for example.</p></figcaption></figure>

### OBS Source Record plugin

For OBS, there is a source-record plugin that allows you to record each Guest in OBS as its own dedicated video source. By pulling in a single high quality ISO (solo) feed per guest into OBS, and mixing videos using OBS, you can get high quality footage for post-production efforts. [https://obsproject.com/forum/resources/source-record.1285/](https://obsproject.com/forum/resources/source-record.1285/)

This is nice because you can have one OBS Studio open, and that's it. The downside is, you won't be able to use the VDO.Ninja auto-mixer if using solo-links instead.

### Electron Capture et al

[Electron Capture](../steves-helper-apps/electron-capture.md) ([https://github.com/steveseguin/electroncapture](https://github.com/steveseguin/electroncapture)) or [Vingester.app](https://vingester.app/) are similar concepts to source-recording, but instead you can capture in an application that isn't OBS. From there you window capture or NDI capture those streams locally into OBS, or/and other applications at the same time. These options do add complexity, but I sometimes will use these approaches, especially if I want to interact with the stream or pin it on top of other apps.

If interested in Vingester, as it has NDI output options, consider downloading it from here:\
[https://github.com/steveseguin/vingester](https://github.com/steveseguin/vingester) , as the official repo for it is no longer maintained, and has an audio bug in it. Vingester does use quite a bit of CPU.

### Chunked mode

If using the [`&chunked`](../newly-added-parameters/and-chunked.md) mode of [VDO.Ninja](https://vdo.ninja/), a video stream is encoded once, and that is sent to all viewers and even the local/remote recordings. This is experimental and still pretty high CPU, due to the high quality of the stream being shared, but it might be lower CPU than trying to do two high quality encodings.

There is no server-side support for chunked mode at the moment, but I will continue to improve it and work on it as requests come in.

### Recording via WHIP/WHEP service

You can use a WHIP/WHEP services to relay video via a server. In this case, the server itself can make a copy of the stream; the same stream everyone else in the room will see. There's also [SVC scalability support](../advanced-settings/whip-parameters/and-svc.md), so if your server supports that, you can push high-bitrates. ([https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip) for some common tooling)

You could in theory record to Twitch or paid WebRTC service via their WHIP ingest, but if you deploy your own SFU server, such as MediaMTX, you can configure it to record via WHIP as well. There's even a dedicated option for configuring MediaMTX with VDO.NInja: `&mediamtx` (v26 of VDO.Ninja)

### Recording to Google Drive / Dropbox

I have been working when I can on a way to auto-sync the local/remote recordings to Google Drive, Dropbox and other cloud providers. The code is there, but it still is a bit buggy and the user interface is lacking. This will record a local copy to disk, but automatically stream that local recording to the cloud as well; before or during the stream.

If there is of great interest to users, please let me know on Discord in the Feature Request channel how you'd like it to work, which provider, etc. I'm trying to figure out where best to invest my time on that feature, and with so little time, unless there's active interest, I let some tasks idle.

\*update: Google Drive recording has a dedicated button in the Director's control room, which will let the director have remote guests upload their video to their Google Drive account automatically.

### Headless recording

This is a bit like having a headless version of OBS in the cloud, where it's configured to take a [VDO.Ninja](https://vdo.ninja/) browser link and publish it using FFMPEG to RTMP. Works with DigitalOcean or even an Orange pi.

[https://github.com/steveseguin/browser-to-rtmp-docker](https://github.com/steveseguin/browser-to-rtmp-docker)

You can very easily configure the FFmpeg script to save to MP4/MKV format though, so if you were wanting to record the guest in the cloud, this is an option. It still will put a load on the guest, as they are encoding a high quality stream that won't be used live really, but if you want to do isolated guest recordings, and don't have the local CPU for it, this might help.

### [Raspberry.Ninja](options-to-record-streams.md#raspberry.ninja)

[Raspberry.Ninja](https://raspberry.ninja/) is my project for Linux systems (and Windows WSL also), which lets you both publish and record Raspberry Ninja streams, without a browser at all.

While it's mainly used for publishing video to [VDO.Ninja](https://vdo.ninja/) using the hardware encoder in small embedded computers, like the Raspberry Pi, it can also record video streams to disk, as perfect copies. No transcoding is done.

If you are enterprising, you can have [Raspberry.Ninja](https://raspberry.ninja/) record the incoming guest streams to disk without transcoding, and then transcode them, before window-sharing them or publishing them to NDI. NDI output support is available with Raspberry.Ninja, however it does require transcoding currently.&#x20;

### Recording an entire window/scene to disk as a mixed output

If you want to record more than a single guest, but rather an entire scene, using URL parameters you can achieve this. We are essentially doing a screen share of the output window, and recording that.\
\
**Record entire scene to disk:** [https://vdo.ninja/?scene=0\&layout\&remote\&clean\&chroma=000\&ssar=landscape\&nosettings\&prefercurrenttab\&selfbrowsersurface=include\&displaysurface=browser\&np\&nopush\&publish\&record\&screenshareaspectratio=1.7777777777777777\&locked=1.7777777777777777\&room=ROOMNAME](https://vdo.ninja/?scene=0\&layout\&remote\&clean\&chroma=000\&ssar=landscape\&nosettings\&prefercurrenttab\&selfbrowsersurface=include\&displaysurface=browser\&np\&nopush\&publish\&record\&screenshareaspectratio=1.7777777777777777\&locked=1.7777777777777777\&room=ROOMNAME)\
**Publish entire scene to a WHIP endpont:**\
[https://vdo.ninja/?scene=0\&layout\&remote\&clean\&chroma=000\&ssar=landscape\&nosettings\&prefercurrenttab\&selfbrowsersurface=include\&displaysurface=browser\&np\&nopush\&publish\&whippush\&screenshareaspectratio=1.7777777777777777\&locked=1.7777777777777777\&room=surprisethinP](https://vdo.ninja/?scene=0\&layout\&remote\&clean\&chroma=000\&ssar=landscape\&nosettings\&prefercurrenttab\&selfbrowsersurface=include\&displaysurface=browser\&np\&nopush\&publish\&whippush\&screenshareaspectratio=1.7777777777777777\&locked=1.7777777777777777\&room=surprisethinP)

<figure><img src="../.gitbook/assets/image (243).png" alt=""><figcaption></figcaption></figure>

### Contact me for more discussion / updates

If you want to follow up with me on some of these options, please contact me on Discord at [https://discord.vdo.ninja](https://discord.vdo.ninja/).

As well, things change quickly with VDO.Ninja; this post may already be out of date by the time you read it. Feel free to ask for updates.
