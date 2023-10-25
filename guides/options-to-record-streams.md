# Options to record streams

There are several ways to record, with more ways coming. I'll list some of the ways here, although they may not be exactly what you had in mind.

### Local / Remote Recording in VDO.Ninja

The VDO.Ninja room director has the option to record streams locally and remotely.

You can also add \&record to guest invite URL to introduce a recording button, for that publisher to start/stop their own local recording. Local recordings of this type are often of high quality.

You can also right-click and record any video within VDO.Ninja.

Depending on the type of video, and whether its local or remote, recording the video with this method may use up extra resources from the publisher's computer, including CPU and bandwidth.

Another issue is the format saved is WebM, which sometimes will need post-processing to make it compatible with many popular video editors. If the browser crashes, that also may cause the video recording to become lost, so it might not be the most reliable option.

That said, this is an easy option and available for free within VDO.Ninja.

### Using OBS to record; or multiple OBS

You can open multiple OBS Studios. Each OBS can record a full-window video if needed. This is useful if doing an interview with someone, and you intend to post process edit it.

OBS has advanced hardware accelerated encoding options, and so this is good option if wanting to have a few high-resolution recordings taking place, as you can offload the encoding to the GPU if available.

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

On the upcoming version of [VDO.Ninja](https://vdo.ninja/), you can use a WHIP/WHEP services to relay video via a server. In this case, the server itself can make a copy of the stream; the same stream everyone else in the room will see. There's also SVC scalability support, so if your server supports that, you can push high-bitrates. ([https://vdo.ninja/alpha/whip](https://vdo.ninja/alpha/whip) for some common tooling)

To demo this concept, you can try out using Cloudflare's Stream service, as it has a free tier and I've done the heavily lifting to make it easy to use. Instructions and tool to setup Cloudflare with VDO.Ninja are here: [vdo.ninja/alpha/cloudflare](https://vdo.ninja/alpha/cloudflare). Cloudflare should technically be saving each stream to disk automatically, but I haven't actually tried downloading their videos recordings to see if they work well.

There are other premium providers other than Cloudflare, and specialized support for them and open-source projects will be added in time.

### Recording via self-hosted SFU server

If running on Linux, you can do the same concept as about with your own WHIP/WHEP/SFU service. It's a bit advanced, but you can deploy such a service and [VDO.Ninja](https://vdo.ninja/)'s (+v24) will be able to use it.

So, instead of direct p2p connections for video/audio streams between peers, streams are broadcasted via the hosted server. This is essentially like deploying your own Meshcast service, which [VDO.Ninja](https://vdo.ninja/) offers, but one that you control. In this case, you'd configure your service to record to disk, which is something Meshcast does not do or offer.

While I'm happy to support users from the [VDO.Ninja](https://vdo.ninja/) side of this all, I don't have the time to offer support to users wanting to deploy own WHIP/WHEP servers. There are many such WHIP/WHEP/SFU open source projects available, although they are perhaps targeted towards more technical users.

### Recording to Dropbox / Cloud

I have been working when I can on a way to auto-sync the local/remote recordings to Dropbox and other cloud providers. The code is there, but it still is a bit buggy and the user interface is lacking. This will record a local copy to disk, but automatically stream that local recording to the cloud as well; before or during the stream.

If there is of great interest to users, please let me know on Discord in the Feature Request channel how you'd like it to work, which provider, etc. I'm trying to figure out where best to invest my time on that feature, and with so little time, unless there's active interest, I let some tasks idle.

### Headless recording

This is a bit like having a headless version of OBS in the cloud, where it's configured to take a [VDO.Ninja](https://vdo.ninja/) browser link and publish it using FFMPEG to RTMP. Works with DigitalOcean or even an Orange pi.

[https://github.com/steveseguin/browser-to-rtmp-docker](https://github.com/steveseguin/browser-to-rtmp-docker)

You can very easily configure the FFmpeg script to save to MP4/MKV format though, so if you were wanting to record the guest in the cloud, this is an option. It still will put a load on the guest, as they are encoding a high quality stream that won't be used live really, but if you want to do isolated guest recordings, and don't have the local CPU for it, this might help.

### [Raspberry.Ninja](options-to-record-streams.md#raspberry.ninja)

[Raspberry.Ninja](https://raspberry.ninja/) is my project for Linux systems (and Windows WSL also), which lets you both publish and record Raspberry Ninja streams, without a browser at all.

While it's mainly used for publishing video to [VDO.Ninja](https://vdo.ninja/) using the hardware encoder in small embedded computers, like the Raspberry Pi, it can also record video streams to disk, as perfect copies. No transcoding is done.

If you are enterprising, you can have [Raspberry.Ninja](https://raspberry.ninja/) record the incoming guest streams to disk without transcoding, and then transcode them, before window-sharing them or publishing them to NDI. Doing this would require some Python coding, not too much, and all the code needed to achieve it is scattered around my Github. Still, this wouldn't be a task for novice developers.

### Contact me for more discussion / updates

If you want to follow up with me on some of these options, please contact me on Discord at [https://discord.vdo.ninja](https://discord.vdo.ninja/).

As well, things change quickly with VDO.Ninja; this post may already be out of date by the time you read it. Feel free to ask for updates.
