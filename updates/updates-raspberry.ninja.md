# Updates - Raspberry.Ninja

[raspberry.ninja](../steves-helper-apps/raspberry.ninja/ "mention")

#### November 4

* Pushed a patch for Raspberry.Ninja, where audio-only streams were having issues with Chrome. (issue was in the GST library being used; not Raspberry.Ninja itself)
  * Update to get the fix; `git pull` or copy/paste from here: [https://github.com/steveseguin/raspberry\_ninja/commit/8dd93af9ee757a72559e93c2bacf4f3ae4d8de22](https://github.com/steveseguin/raspberry\_ninja/commit/8dd93af9ee757a72559e93c2bacf4f3ae4d8de22)

#### November 1

* Added AV1 encoding support to Raspberry Ninja, along with some tips on using gstreamer to do WHIP without needing it.\
  [https://github.com/steveseguin/raspberry\_ninja#whip--meshcast-support](https://github.com/steveseguin/raspberry\_ninja#whip--meshcast-support)
* Added WHIP output support to Raspberry.Ninja (`python3 publish.py --whip "https://yourwhipurl.com/here" --test`)

#### October 29

*   Mainly just smoothed out some rough edges caused by rpicamsrc being depreciated by raspberry pi updates

    * An issue with the camera freezing on load is also potentially resolved; impacted some RPI CSI camera users.
    * Text is now color coded, adding some visual flare to the log output.
    * Adjusted some rules/logic based on the raspberry pi 5's released and its high performance CPU.

    [https://github.com/steveseguin/raspberry\_ninja/commit/c437916a5e76fa44a7907457522292063a14aa6b](https://github.com/steveseguin/raspberry\_ninja/commit/c437916a5e76fa44a7907457522292063a14aa6b)

#### October 7

* I have a new version of the Raspberry.Ninja image for Raspberry Pi devices built and hosted now.\
  [https://drive.google.com/file/d/1vWkznU544qkRsal1GyIj4YZ-O2pNFCfh/view?usp=drive\_link](https://drive.google.com/file/d/1vWkznU544qkRsal1GyIj4YZ-O2pNFCfh/view?usp=drive\_link) (bullseye 64bit; gst 1.22 /w USB drive support)

#### October 6

* Added `--latency 200` and `--debug` as options\
  \-- latency lets you adjust the jitter buffer delay, with the default being 200ms. (500ms might be better over bad wifi, with 70ms over Ethernet)\
  \-- debug will let you toggle on the debug logs, for debugging issues; I have it off by default not as it was too verbose
* Improved the reconnection logic; if you lose internet while streaming now, the viewer should auto-reconnect in under 30-seconds now, while before it could take up to 30-minutes in some edge cases.
* Also updated the Raspberry Pi full-installer script, so it's tested and up to date. I've also included WHIP/WHEP gstreamer support as part of that specific installer, for those wanting to play with that. I'll have a full hosted RPI 64bit pre-built bullseye image based on this new installer coming soon I hope, too; so far results of testing it show it to be rather stable, so that's a relief.
* Initial / partial `--password` support added. This feature requires the [vdo.ninja/alpha/](https://vdo.ninja/alpha/) to be used however, since I needed to add some changes there to get it compatible.

#### August 23

* Raspberry.Ninja updated with new feature and code example that allows developers to access VDO.Ninja video within OpenCV, Tensorflow, and other cv/ml python apps.\
  \-- The ability to convert VDO.Ninja video into an motion-jpeg stream is one of the examples, which also includes a YouTube video guide:\
  [https://youtu.be/LGaruUjb8dg](https://youtu.be/LGaruUjb8dg?si=-F2\_rn9t6P6FCn87)\
  \-- Some install instructions for using raspberry ninja on windows also added in the wsl folder.

#### August 5

* Added a new simplerinstall.md installation instructions to the Raspberry.Ninja project, inside the raspberry\_pi folder. It looks like you can now get Raspberry.Ninja working on the new Raspberry Image image builds (or most other systems) without having to use a custom image or building source from scratch, so setup and use is now pretty easy. I'll be pushing more changes on this front over the coming days.

#### April 22

* Following up on the updated Raspberry.Ninja I did for the RPi the other day, I now finished building an updated version for the Nvidia Jetson Nano also.\
  \
  Download: [https://drive.google.com/file/d/1B\_ywphXQ49F9we3ytcM-Zn1h7dCYOLBh/view?usp=share\_link](https://drive.google.com/file/d/1B\_ywphXQ49F9we3ytcM-Zn1h7dCYOLBh/view?usp=share\_link)\
  \
  \-- It comes with GStreamer 1.23.0 installed, with libcamera, SRT, RTMP, ffmpeg, hardware-encode, and av1 support ready to go.\
  \-- Should fit on most 16-GB or larger uSD cards - username is `vdo` and the password is `ninja`\
  \
  The installer file is also updated, if you want to diy: [https://github.com/steveseguin/raspberry\_ninja/tree/main/nvidia\_jetson](https://github.com/steveseguin/raspberry\_ninja/tree/main/nvidia\_jetson)

#### April 21

* Raspberry.Ninja was updated for Pi devices (1080p30 video from a Raspberry Pi device, straight to VDO.Ninja)\
  \-- created a new image for Raspberry Pi devices. It uses the newest Bullseye OS and has built-in support for many new advanced Sony cameras (the low light IMX462 was tested)\
  \-- libcamera support added (`python3 publish.py --libcamera` to use)\
  \-- av1, srt, and other codecs added to the image as well; should future-proof the image a bit, so I can add support for those down the road with updates.\
  \-- Newest version of gstreamer/WebRTC lib is installed now, so the **video is more stable than ever**; less frame loss than previous versions.\
  \-- install script also updated for the pi devices , so if you want to build the image yourself, now's your chance to do it hassle free. [https://github.com/steveseguin/raspberry\_ninja/blob/main/raspberry\_pi/README.md](https://github.com/steveseguin/raspberry\_ninja/blob/main/raspberry\_pi/README.md)\
  (image + install for Raspberry Pi)

#### February 5

* Added pipe-in media support to **Raspberry.Ninja**. This lets you publish from FFmpeg, OBS, applications, etc to VDO.Ninja, without needing a browser, and optionally without having to do further transcoding.\
  \
  You can either have Raspberry.Ninja do transcoding with `--pipein auto` (automatic decode detectio) or `--pipein raw` (just encode raw data), or you can do pass-thru without transcoding with `--pipein=h264`, `--pipein=vp9`, `--pipein=vp8` or `--pipein=mpegts` (mpegts is for YouTube-dl doing h264 /w audio)\
  \
  example usage: `ffmpeg -i xxxx -o - | python publish.py --pipein auto`\
  \
  I've been developing and testing this code on an Nvidia Jetson, and so I've updated to the `installer.sh` for that system as well, including adding SRT to it.\
  \
  Currently I just am support Linux with this code, but with some help I could have it working on Windows/Mac I bet -- _I've been struggling to get it working on Windows, but I see a lot of value for it there._

#### February 4

* Added the option to stream a video file to VDO.Ninja using Raspberry.Ninja. You can do it with or without transcoding the file; audio isn't supported yet, but its a start. vp8/vp9 formats work best, but compatible variations of h264 files will work also. Technically, if streaming from Raspberry.Ninja -> Raspberry.Ninja, transparency layers should be preservable I think.
* Added support for the Theta Z1 360 4K camera to the Raspberry Ninja (jetson tested).

#### January 31

* Pushed a patch to Raspberry.Ninja; this patch offers a workaround for an issue on the pi/jetson disk images I'm hosting.. at least until I can get some new disk images made with a better fix. (there's a bug in the older libraries used, so I need to recompile it all to fix it properly)

#### January 12

* Updated Raspberry.Ninja with Error Correction + Dynamic Bitrate support. This essentially makes the video stability substantially better, and it's even a bit adaptive now to changes in available bandwidth.

```
--nored  => Disable error correction. If you don't disable it,
the bandwidth may be up to 2x higher than the target video bitrate.
I do not recommend removing, unless you're on a pristine connection.

--noqos => "qos" will lower the bitrate of the video encoder if packet loss
is detected. It won't lower it more than 5x (20% of target),
but I find this works well to combat times where the network bandwidth is
insufficient.  Error correction just doesn't work if it can't actually send
enough data. Using --noqos disables this feature

I lowered the default bitrate to 2500, which will be 5000-kbps with error
correction on. On a typical spotty WIFI connection, it might drop to 2000-kbps
(4-mbps total bandwidth). 

I do NOT dynamically change the resolution, and 1500-kbps is about as low as
1080p will allow.  So, if on weak cellular or wifi, you might want to use 720p
as the resolution. This should allow for a lower bitrate floor, allowing for
use in bad environments.
 main
```

\- [https://raspberry.ninja/](https://raspberry.ninja/)\
\
To update, just go into the raspberry\_ninja folder on your device, and do `git pull`.\
\
I've yet to do full testing on a PI with it, but it's been working great on a Jetson board so far.

### 2022

#### October 15

* RTMP support added to Raspberry\_Ninja:\
  [https://youtu.be/8JOn2sK4GfQ](https://youtu.be/8JOn2sK4GfQ)

#### October 14

* Setting up mobile (IRL) streaming with Raspberry\_Ninja:\
  [https://youtu.be/eqC2SRXoPK4](https://youtu.be/eqC2SRXoPK4)

#### August 9

* You can wire up an LED to the Raspberry\_Ninja project now, on a RPI, to use as a connection-status indicator. see [`https://raspberry.ninja/raspberry_pi/`](https://raspberry.ninja/raspberry\_pi/)![Bild](https://media.discordapp.net/attachments/701232125831151697/1006385249577598976/unknown.png?width=385\&height=300)

#### August 6

* New URL for the Raspberry\_Ninja project: [https://raspberry.ninja/](https://raspberry.ninja/) (rather than having to scour GitHub to find it). And it's prettier than it used to be.\
  ![Bild](https://media.discordapp.net/attachments/701232125831151697/1005272561493491843/unknown.png?width=272\&height=300)
* Created a new uSD image for the Nvidia Jetson and the Raspberry\_Ninja project; might help with audio issues. Might also work with newer Jetson boards. Compatible with uSD cards of size 16-GB and greater now.

#### March 25

* Added the ability to save the outbound video stream to disk when using raspberry\_ninja. Just add `--save` as a CLI option and it will start saving the video + audio to disk. Viewers can connect as needed without disturbing the recording.
* improved the rotate function recently added to raspberry\_ninja; now does a native rotation when using the official raspberry pi camera
* Faster reconnecting when not using `--multiviewer` on the raspberry\_ninja; hangs up the old connection immediately when it intentionally disconnects (such as a browser refresh)

#### March 24

* Added the ability to rotate the camera (via command line ) on the Raspberry\_Ninja. Portrait mode or flipped video can be supported as a result.

#### March 17

* Added basic room support to raspberry\_ninja. Use: `--room ROOMNAME --multiviewer`
* Fixed a couple glitches with the raspberry\_ninja project when self hosting with multiple cameras and related fixes/improvements (like not needing to refresh the viewer page to trigger it to play). Updates on GitHub

#### March 15

* Added the ability to customize the audio bitrate with raspberry\_ninja `--audiobitrate 256`

#### January 24

* The raspberry\_ninja project had a major update; new RPI image (v3), which enables USB video to now hardware encode properly at 1080p30. Also, HDMI to CSI adapter support added (audio support still needs some work tho). This project lets you stream HD video at sub-second latency to VDO.Ninja using a raspberry pi or Jetson from the command line and headless.\
