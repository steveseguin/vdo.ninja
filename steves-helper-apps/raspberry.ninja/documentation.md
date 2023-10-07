---
description: This is an archived snapshot of the documentation as of Aug. 16, 2023.
---

# Documentation

##

## 👉👉👉Go to [https://raspberry.ninja](documentation.md#go-to-https-raspberry.ninja) 👈👈👈

##

## Please note that this documentation is not kept up to date.

Please visit [https://raspberry.ninja](../../updates/updates-raspberry.ninja.md) for the most up-to-date documentation for Raspberry.Ninja. This documentation is included here as a consolidate resource for our LMM AI support bot to learn from. The resource here will be updated only occasional, as needed, and many links or references may be out of date.



Chronologically updates are here:

{% content-ref url="../../updates/updates-raspberry.ninja.md" %}
[updates-raspberry.ninja.md](../../updates/updates-raspberry.ninja.md)
{% endcontent-ref %}

## ![](https://user-images.githubusercontent.com/2575698/107161314-f6523f80-6969-11eb-9e9b-9135554b87b5.png) Raspberry Ninja

Turn your Raspberry Pi, Nvidia Jetson, Orange Pi, or nearly any Python-compatible system into a ninja-cam with hardware-acceleration enabled! This lets you publish live streaming video and audio directly to your web browser or OBS instance using VDO.Ninja. Achieve very low streaming latency over the Internet or a LAN; all for free.

It also has the ability to record remote VDO.Ninja streams to disk, without needing to transcode, and can broadcast a low-latency video stream to multiple viewers at time. More recently, fdsink and OpenCV support have been added, for ingesting remote video streams with sub-300-ms of latency into your computer vision projects.

### Preface

The core concepts and code used in this project can be reused for other projects; most Linux systems, and a large variety of embedded systems; potentially even smartphones. There's a focus of supporting Raspberry Pis and Nvidia Jetson systems, which includes offering pre-built images and install scripts. Other Linux system users should still be able to use the code, but setup support will be limited.

YouTube video demoing:

{% embed url="https://youtu.be/J0qqXxHNU_c" %}

I also have another longer [YouTube video here](https://youtu.be/eqC2SRXoPK4), which focuses on setting up the Raspberry\_ninja for IRL-streaming.\*\*\*\*

[![image](https://user-images.githubusercontent.com/2575698/127951812-b799a6e6-f77e-4749-8ef1-15221b842805.png)](https://youtu.be/J0qqXxHNU\_c)

Recent updates to Raspberry Ninja have added improved error correction and video redundancy, along with automated dynamic bitrate controls for congestion management. This has greatly improved stream reliability, reducing frame loss, and limiting buffer sizes. That said, having more than 5-megabites of upload bandwidth and having a solid connection is recommend if intending to use the default settings.

### Install options

See below for different install options

#### Setup for a Raspberry Pi

See the `raspberry_pi` sub-folder for instructions on installing and setting up a Raspberry Pi. [Jump there now](https://github.com/steveseguin/raspberry\_ninja/tree/main/raspberry\_pi)

A Raspberry Pi works fairly well with a CSI-connected camera, but USB-based cameras currently struggle a bit with older Raspberry Pi models. As a result, consider buying an Nvidia Jetson Nano 2GB instead of a Raspberry Pi if looking to jump into this all. Also, the RPI Zero W 1 and RPi 3 both don't have the greatest WiFi built-in, while the Raspberry Pi Zero 2 seems to work rather well. Without good connectivity, you may find yourself facing frame-drops and stutter. HDMI to CSI adapters do work, but they may be limited to 25-fps and can be finicky still with some camera sources; audio over HDMI is also a bit tricky to setup currently.

![image](https://user-images.githubusercontent.com/2575698/146033910-3c54ba8c-1d3e-4073-bc59-e190decaca63.png)

#### Setup for an Nvidia Jetson

Please see the `nvidia_jetson` folder for details on installation. [Jump there now](https://github.com/steveseguin/raspberry\_ninja/blob/main/nvidia\_jetson/README.md)

![image](https://user-images.githubusercontent.com/2575698/127804651-fc8ce68e-3510-4cd0-9d5a-1953c6aac0d8.png)

Nvidia Jetsons work well with USB-connected cameras and have a selection of compatible CSI-cameras well. You may need to buy WiFi adapter if it is not included.

#### Setup for Linux Desktops

You can deploy Raspberry.Ninja to a desktop pretty quickly in most cases, without compiling anything. I have an installer for recent versions of Ubuntu if interested. [Jump there now](https://github.com/steveseguin/raspberry\_ninja/blob/main/ubuntu)

For other distros, see below for requirements

**Requirements for linux systems in general:**

You'll want to install Gstreamer 1.16 or newer; emphasis on the newer. You'll need to ensure `libnice`, `srtp`, `sctp`, and `webrtcbin` are part of that install, along with any media codecs you intend to use.

Python3 is also required, along with `websockets`. If you have PIP installed, `pip3 install websockets` can get you going there.

#### Setup for Windows (WSL)

You can actually run Raspberry Ninja on a Windows PC via the WSL virtual machine interface. It's really quick and simple, except getting camera/hardware support going is tricky.

Still, it might be useful if you want to pull a stream from a remote Raspberry.Ninja system, recording the stream to disk or using it for local machine learning.

See the WSL install script here: [Jump there now](https://github.com/steveseguin/raspberry\_ninja/blob/main/wsl)

It is possible to install Gstreamer for Windows natively, but due to the difficulty in that all, I'm not supporting it officially at present. The main challenge is `cairo` fails to compile, so that needs to be fixed first.

### Generic quick-install method

```
sudo apt-get update && sudo apt upgrade -y
sudo apt-get install python3-pip -y

sudo apt-get install -y libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev libgstreamer-plugins-bad1.0-dev gstreamer1.0-plugins-base gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly gstreamer1.0-libav gstreamer1.0-tools gstreamer1.0-x python3-pyqt5 python3-opengl gstreamer1.0-alsa gstreamer1.0-gl gstreamer1.0-qt5 gstreamer1.0-gtk3 gstreamer1.0-pulseaudio gstreamer1.0-nice gstreamer1.0-plugins-base-apps

pip3 install websockets

sudo apt-get install -y libcario-dev ## possibly optional
pip3 install PyGObject ## possibly optional

sudo apt-get install git -y
cd ~ 
git clone https://github.com/steveseguin/raspberry_ninja
cd raspberry_ninja
python3 publish.py --test
```

### Updating

Major updates sometimes will require that the latest Rasbperry Pi or Jetson image be installed on your device, but most updates are minor and only require the `publish.py` file to be updated. If you've just installed the latest device image, you will still want to update before going further, as the image is not updated with every new code release.

You can normally update by logging into your device, either via SSH, or via mouse/keyboard with the terminal app open.

```
cd ~
cd raspberry_ninja
git pull
```

That's it.

If you run into issues due making changes to the code, you can either `git stash` your changes first, or you can just delete the raspberry\_ninja folder and clone it again.

ie:

```
cd ~
rm raspberry_ninja -r
git clone https://github.com/steveseguin/raspberry_ninja
cd raspberry_ninja
```

Updates are usually optional, as they typically just focus on added features or improving video quality/stability. I do recommend checking for new updates every now and then.

### Usage

You should be able to run the publshing script simply with `python3 publish.py`, however lots of options are available for customizing as desired.

```
$ python3 publish.py
```

To get the list of supported commands with your version of the code, run `python3 publish.py --help`.

Sample help output: ( what's shown below may not be up-to-date)

```
usage: publish.py [-h] [--streamid STREAMID] [--server SERVER]
                  [--bitrate BITRATE] [--width WIDTH] [--height HEIGHT]
                  [--framerate FRAMERATE] [--test] [--hdmi] [--v4l2 V4L2]
                  [--rpicam] [--nvidiacsi] [--alsa ALSA] [--pulse PULSE]
                  [--raw] [--h264] [--nvidia] [--rpi] [--novideo] [--noaudio]
                  [--pipeline PIPELINE]

optional arguments:
  -h, --help            show this help message and exit
  --streamid STREAMID   Stream ID of the peer to connect to
  --server SERVER       Handshake server to use, eg:
                        "wss://wss.vdo.ninja:443"
  --bitrate BITRATE     Sets the video bitrate. This is not adaptive, so
                        packet loss and insufficient bandwidth will cause
                        frame loss
  --width WIDTH         Sets the video width. Make sure that your input
                        supports it.
  --height HEIGHT       Sets the video height. Make sure that your input
                        supports it.
  --framerate FRAMERATE
                        Sets the video framerate. Make sure that your input
                        supports it.
  --test                Use test sources.
  --rtmp                Use RTMP instead of webRTC; pass "rtmp://xxxx.com/live/xxx-xxxx-xxx"
  --hdmi                Try to setup a HDMI dongle
  --v4l2 V4L2           Sets the V4L2 input device.
  --rpicam              Sets the RaspberryPi input device.
  --nvidiacsi           Sets the input to the nvidia csi port.
  --alsa ALSA           Use alsa audio input.
  --pulse PULSE         Use pulse audio (or pipewire) input.
  --raw                 Opens the V4L2 device with raw capabilities.
  --bt601               Changes the input color profile when in raw mode to BT601
  --h264                For PC, instead of VP8, use x264.
  --vp8                 VP8 encoder instead of h264; likely software-based
  --nvidia              Creates a pipeline optimised for nvidia hardware.
  --rpi                 Creates a pipeline optimised for raspberry pi hadware.
  --novideo             Disables video input.
  --noaudio             Disables audio input.
  --omx                 An alternative hardware encoder for the RPi; glitches, but faster?
  --pipeline PIPELINE   A full custom pipeline
  --record STREAMID     Specify a remote stream ID to record; this will disable publishing mode
  --midi                MIDI transport; can forward/recieve MIDI to remote browser/device
  --save                Will save a local copy of the outbound stream to disk (MKV format)
  --rotate DEGREES      Will rotate the video by 90, 180 , or 270 degrees
  --multiviewer         Allows for multiple viewers at a time; this can increase bandwidth usage of course
  --nored               Disable error correction. If you don't disable it, the bandwidth may be up to 2x higher than the target video bitrate.  I do not recommend removing, unless you're on a pristine connection.
  --noqos               This will disable the qos feature. The QOS feature will lower the bitrate of the video encoder if heavy packet loss is detected. It won't lower it more than 5x (20% of target), but I find this works well to combat times where the network bandwidth is insufficient. 
  --pipein              Lets you pipe data in from a unix pipe, something like: `ffmpeg -i input.mp4 -o - | python3 publish.py --pipein auto`
  --libcamera           Use libcamera as a source; this may be needed if using third party cameras like those from Arducam
  --latency             Set the incoming jitter buffer, in milliseconds. 200-ms is the default.
  --password            Start with VDO.Ninja v24, Raspberry.Ninja is partially compatible with passwords
  --framebuffer         Specify the stream ID that you wish to ingest and output locally as as frame buffer (OpenCV friendly)

```

**Changing video input sources**

Using `gst-device-monitor-1.0` will list available devices and their 'caps', or settings. This can help determine what GStreamer pipeline changes need to be made in the script or getting info about what video format options are available for your device.

To help further debug, `gst-launch-1.0` can be used to test a pipeline out before adding it to the script. For for added reference, here is an example Pipeline for the Rasbperry Pi to enable UVC-based MJPEG video capture support is:

```
gst-launch-1.0 v4l2src device=/dev/video0 io-mode=2 ! image/jpeg,framerate=30/1,width=1920,height=1080 ! jpegparse ! nvjpegdec ! video/x-raw ! nvvidconv ! "video/x-raw(memory:NVMM)" ! omxh264enc ! "video/x-h264, stream-format=(string)byte-stream" ! h264parse ! rtph264pay config-interval=-1 ! application/x-rtp,media=video,encoding-name=H264,payload=96 ! fakesink
```

Notice how we used device = OUR\_AUDIO\_DEVICE\_NAME to specify the audio device we want to use, and we configure the device to read and decode JPEG, as that is what our device in this case supports.

The Raspberry\_Ninja publish.py script automatically tries to create a pipeline for you, based on the command line arguments passed, but you can override that at a code level with your own pipeline if easier as well.

**Adding an audio source**

The script will use the default system ALSA audio output device, although you can override that using the command line arguments or via manually setting a gstreamer pipeline at the code level.

To get details of available audio devices, assuming pulseaudio is installed, running the following from the command line will give us access to audio device IDs

```
pactl list | grep -A2 'Source #' | grep 'Name: ' | cut -d" " -f2
```

resulting in..

```
alsa_input.usb-MACROSILICON_2109-02.analog-stereo
alsa_output.platform-sound.analog-stereo.monitor
alsa_input.platform-sound.analog-stereo
```

In this example, an HDMI audio source is the first in the list, so that is our device name. Your device name will likely vary.

Pulse audio and ALSA audio command-line arguments can be passed to setup audio, without needing to tweak Gstreamer pipelines manually. The defaults I think will use the system ALSA default device.

### How to Run:

Ensure the pi/jetson is connected to the Internet, via Ethernet is recommended for best performance. You'll also very likely need to ensure a camera and/or microphone input are connected; this can also be a USB UVC device, supported CSI-based camera, or other selectable media inputs. It technically might be possible to even select a pipe to stream from, although this is a fairly advanced option.

Run using: `python3 publish.py --streamid SomeStreamID --bitrate 2000`

In Chrome, open this link to view: `https://vdo.ninja/?password=false&view=SomeStreamID`

You can have multiple viewers at a time, but you must enable that with a command-line argument.

Also note, if you run with `sudo`, you might get a permissions error when using audio.

#### [Auto-starting the script on boot](https://github.com/steveseguin/raspberry\_ninja#auto-starting-the-script-on-boot) <a href="#user-content-auto-starting-the-script-on-boot" id="user-content-auto-starting-the-script-on-boot"></a>

A guide on how to setup a RPI to auto-stream on boot can be found in the Rasbperry Pi folder, along with details on how to configure the WiFi SSID and password without needing to SSH in first.

#### [RTMP output](https://github.com/steveseguin/raspberry\_ninja#rtmp-output) <a href="#user-content-rtmp-output" id="user-content-rtmp-output"></a>

RTMP support overrides WebRTC support at the moment, and the features that are support are pretty limited.

`python3 publish.py --rtmp rtmp://a.rtmp.youtube.com/live2/z4a2-q14h-01gp-xhaw-3zvw --bitrate 6000`

Things like bitrate, width, height, raw, framerate are also supported, but not a whole lot else.

RTMP support is currently experimental; example use with a Jetson here: [https://www.youtube.com/watch?v=8JOn2sK4GfQ](https://www.youtube.com/watch?v=8JOn2sK4GfQ)

You can't publish to vdo.ninja with RTMP, but rather a service like YouTube.

#### [SRT support](https://github.com/steveseguin/raspberry\_ninja#srt-support) <a href="#user-content-srt-support" id="user-content-srt-support"></a>

I have added SRT support to the Raspberry Pi image. You need to use it via Ffmpeg or Gstreamer via command line currently, as I haven't added it to the Raspberry Ninja code directly yet. Still, it's easy enough to publish via command line with SRT, and you get the benefits of an up-to-date Raspberry Pi image with drivers and software all pre-installed.

#### [WHIP / Meshcast support](https://github.com/steveseguin/raspberry\_ninja#whip--meshcast-support) <a href="#user-content-whip--meshcast-support" id="user-content-whip--meshcast-support"></a>

I added WHIP/WHEP support to the Raspberry Pi x64 pre-built image, although currently its via the rust-based webrtchttp gstreamer plugins and is outside the scope of Raspberry.Ninja itself for now.

[whipsink](https://gstreamer.freedesktop.org/documentation/webrtchttp/whipsink.html?gi-language=python) [whepsrc](https://gstreamer.freedesktop.org/documentation/webrtchttp/whepsrc.html?gi-language=python)

You can technically build these plugins yourself also, using Rust (cargoc) and Gstreamer 1.22 I think, but I intend to offer my own version of WHEP/WHIP support as an integral part of Raspberry.Ninja at some point in the future instead.

#### [NDI support](https://github.com/steveseguin/raspberry\_ninja#ndi-support) <a href="#user-content-ndi-support" id="user-content-ndi-support"></a>

I've been experimenting with NDI support, but it's not officially working correct yet.

#### [OpenCV / FFMPEG / FDSink / Framebuffer support](https://github.com/steveseguin/raspberry\_ninja#opencv--ffmpeg--fdsink--framebuffer-support) <a href="#user-content-opencv--ffmpeg--fdsink--framebuffer-support" id="user-content-opencv--ffmpeg--fdsink--framebuffer-support"></a>

There's support for OpenCV/Framebuffer (--framebuffer STREAMIDHERE) and FDSink now. There's a Youtube video online demoing how to use Raspberry.Ninja to bring raw BGR video frames into Numpy.

### Hardware options

Of the Raspberry Pi devices, the Raspberry Pi 4 or the Raspberry Pi Zero 2 are so far the best options on this front, depending on your needs. Any of the Nvidia Jetson devices should work fine, but only the Jetson Nano 2GB, 4GB, and NX have been tested and validated. If you wish to use other Jetson devices, you'll need to setup and install Gstreamer 1.19 yourself on those systems, as no pre-built image will be provided at this time. (Unless someone wishes to donate the hardware that is) Any other Linux system or SBC embedded system is on the user to setup and install at this point, but they should closely follow the same steps that the Nvidia Jetson uses.

It's rather hard to install everything needed on a Raspberry Pi Zero 2 directly, due to the limited memory, so I do recommend that if installing from scratch that you use a Raspberry Pi 4 with 4GB or greater.

#### Camera options

There's plenty of options for the Rasbperry Pi and Nvidia Jetson when it comes to cameras and HDMI adapters. The easiest option for a Raspberry Pi is to use one of the official Raspberry Pi camera. These are normally just plug an play on both platforms and well supported.

USB cameras are options, but currently with Raspberry Pi devices these are only supported up to around 720p30. USB 3.0 devices are even less supported, as you need to ensure the Raspberry Pi you are using supports USB 3.0; for example, a Camlink will not work on a Raspberry Pi 3.

If low-light is important to you, the Sony IMX327 and IMX462 series of sensors might appeal to you. They are generally designed for security camera applications, but with the use of an IR Filter, you can make them adequate for use a standard video cameras. These options may require additional gstreamer and driver work to have work however, so they are for more advanced-users at this time.

I have gotten the low-light Arducam IMX462 to work with the newest image for RPI working (the Bullseye image). It might require a small change to the `dtoverlay` line in the `/boot/config.txt` file though to configure your specific camera, but I think I have most working now without any need drivers. (a few exceptions) , oh, and if you are changing `dtoverlay`, you might need to also comment out the camera auto detect link that is also in the config.txt file. (else it might not work)

Links for such low-light cameras:

[https://www.uctronics.com/arducam-for-raspberry-pi-ultra-low-light-camera-1080p-hd-wide-angle-pivariety-camera-module-based-on-1-2-7inch-2mp-starvis-sensor-imx462-compatible-with-raspberry-pi-isp-and-gstreamer-plugin.html](https://www.uctronics.com/arducam-for-raspberry-pi-ultra-low-light-camera-1080p-hd-wide-angle-pivariety-camera-module-based-on-1-2-7inch-2mp-starvis-sensor-imx462-compatible-with-raspberry-pi-isp-and-gstreamer-plugin.html) (I own this camera and it works on a Raspberry Pi 4 with my newest created RPi image. It works if you do not use the pivariety daughterboard and just connecting directly; you'll need to change the config.txt file a bit and use --libcamera to use though)

[https://www.amazon.ca/VEYE-MIPI-327E-forRaspberry-Jetson-XavierNX-YT0-95-4I/dp/B08QJ1BBM1](https://www.amazon.ca/VEYE-MIPI-327E-forRaspberry-Jetson-XavierNX-YT0-95-4I/dp/B08QJ1BBM1)

[https://www.e-consystems.com/usb-cameras/sony-starvis-imx462-ultra-low-light-camera.asp ](https://www.e-consystems.com/usb-cameras/sony-starvis-imx462-ultra-low-light-camera.asp)(USB-based; more compatible with other devices)

You can buy IR Filters, or you can buy lenses that come with IR filters, if needed, for pretty cheap. Many are designed for security applications, so be aware. [https://fulekan.aliexpress.com/store/1862644](https://fulekan.aliexpress.com/store/1862644)

#### 360-degree cameras

Support for the Theta 4k 360 USB camera has been added. Has been tested with the Jetson. It is likely too slow to use with a Raspberry Pi though.

Install script and brief usage example found here: [https://github.com/steveseguin/raspberry\_ninja/blob/main/nvidia\_jetson/theta\_z1\_install.sh](https://github.com/steveseguin/raspberry\_ninja/blob/main/nvidia\_jetson/theta\_z1\_install.sh)

#### HDMI Input options

As per HDMI adapters, a 1080p30 USB 2.0 HDMI to MJPEG adapter can usually be had for $10 to $20, although there are many fake offerings out there. I've tested a $12 MACROSILICON HDMI to USB adapter, and it works pretty well with the Jetson (and OK with the RPI), although finding a legitimate one might be tricky. On a Raspberry Pi 4, 1080p30 is posssible with the HDMI to USB adapter, but audio currently then goes out of sync; at 720p though, audio stays in sync with the video more frequently. Audio sync issues might be resolved in the future with more system tuning.

There's another option though, and that is to use an HDMI to CSI adapter for Raspberry Pis, such as the C780A ($29 USD) https://www.aliexpress.com/item/1005002861310912.html, although the frame rate of an HDMI to CSI option is limited to 1080p25 (due to 2 CSI lanes only). It's also slightly more expensive than the HDMI to USB alternative. The RPi Compute Module boards seem to have four-lanes of CSI available though, so 30-fps might be achivable there if you buy the compatible board (C780B ?)

Audio is also more challenging when dealing with the HDMI to CSI adapters, as you need to connect audio from the board via I2S to the RPi. This isn't easy to do with some of the HDMI to CSI boards, but there are a couple options where this is a trival step.

Please note before buying that there are different HDMI to CSI2 boards, and they might look similar, but they are definitely not equal.

* X630 boards seem to have a solder-free audio support (via an addon board; X630-A2) and 1080p25 support; there's a nice YouTube guide on setting it up https://www.youtube.com/watch?v=lJL2Ihs1aYg and a kit available to make it all a breeze; https://geekworm.com/products/x630?variant=39772641165400.
* C779 boards do not support audio (hardware problem), making it quite challenging to use. But it is often the cheapest option. I don't recommend this option.
* C780 boards supposedly has fixed the audio issue of the C779 boards, but they remain untested by me yet. It appears they have good audio support and a 4-lane option (C780B) for the RPi Compute module boards, but most users will proabably need the two-lane C780A.
* Boards by Auvidea, like the B100, B101, or B102, have audio support via I2S it seems. These are more expensive options though, and there is mention of RPi Compute Module support with some of these Auvidea boards as well. I haven't tested these boards yet.
* I haven't tested the Geekworm HC100 board yet, but it seems similar to the B100/B101. Might require some light soldering to get audio support? Not sure.

HDMI to CSI boards are not plug-and-play currently, as they do require a couple tweaks to the boot file at the very least, and maybe an update to the EDID file. (script provided for that). Depending on the video input signal, you might need to further tweak settings, such as colorimetery settings. This not really an issue with the HDMI to USB adapters, as they convert to a very standard MJPEG format, making them more plug and play friendly.

Please share with the community what works well for you and what did not.

#### MIDI options

When using the `--midi` parameter, video and audio are disabled. Instead, the script can send and recieve MIDI commands over VDO.Ninja. Supports plug-and-play, although you may need to install `python-rtmidi` using pip3 first.

Incoming MIDI messages will be forwarded to the first MIDI device connected to the Pi. Adding `&midiout` to the viewer's view-link will have that remote browser send any MIDI messages (such as from a USB DJ Controller) to the raspberry\_ninja publish.py script, which will then be forwarded to the first local MIDI device

Outgoing MIDI messages will be sent to connected viewers, and if those connected viewers have `&midiin` added to their view-links, those MIDI commands will be forwarded to the connected MIDI devices.

If using a virtual MIDI device on the remote viewer's computer, such as `loopMIDI`, you can target that as both a source and target for MIDI commands. This is especially useful for connecting VDO.Ninja to DJ software applilcations, like Mixxx or Serato DJ Pro, which supports mapping of MIDI inputs/outputs.

Please note, the raspberry\_ninja publish.py script can both send and recieve MIDI commands over a single peer connection, which is a bit different than how video/audio work currently. It's also different than how browser to browser currently is setup, where a sender won't ever request MIDI data, yet the raspberry\_ninja code does allow the sender to both send and receive MIDI data.

midi demo video:

{% embed url="https://youtu.be/Gry9UFtOTmQ?si=SpIBdDBPu9J1MN2M" %}

#### Note:

* Installation from source is pretty slow and problematic on a RPI; using system images makes using this so much easier.
* Please use the provided backup server for development purposes; that wss server is `wss://apibackup.vdo.ninja:443` and for viewing: `https://backup.vdo.ninja`
* Passwords must be DISABLED explicitly as this code does not yet have the required crypto logic added yet. Things will not playback if you leave off `&password=false`
* The current code does not dynamically adjust resolution to combat frame loss; rather it will just drop frames. As a result, having a high quality connection between sender and viewer is required. Consider lowering the bitrate or resolution if problems persist.
* Speedify.com works on Linux and embedded devices, providing network bonding and fail-over connections. The install instructions are pretty easy and can be found here: https://support.speedify.com/article/562-install-speedify-linux (not sponsored)
* If you want to do computer-vision / machine-learning with cv2 or tensorflow on the resulting webRTC video stream, I have an open-source project here that you can take snippets from that you can add to raspberry\_ninja to do what you want: [github.com/ooblex](https://github.com/ooblex/ooblex/blob/master/code/decoder.py#L84)
* If you wish to play a video back, using a Raspberry Pi, try this "kiosk" mode image that can be found here: https://awesomeopensource.com/project/futurice/chilipie-kiosk. Raspberry Pis seem to handle video playback in Chromium-based browsers OK. I'l try to have browser-free playback at some point in the future.
* If needing to make a backup of your microSD, see: [http://sigkillit.com/2022/10/13/shrink-a-raspberry-pi-or-retropie-img-on-windows-with-pishrink/](http://sigkillit.com/2022/10/13/shrink-a-raspberry-pi-or-retropie-img-on-windows-with-pishrink/)

#### TODO:

* Fix VP8/VP9 recordings and add muxing to the H264 recordings (moderate)
* Have an option to "playback" an incoming stream full-screened on a pi or Jetson, to use as an input to an ATEM mixer.
* Add a jitter buffer to the recording mode (moderate)
* Add support for passwords and group rooms (steve)
* Make easier to use for novice users; perhaps adding a local web-interface or config file accessible via an SD card reader via Windows. These options could then allow for setting of wifi passwords, device, settings, stream IDs, etc, without needing to SSH in or using nano/vim. (moderate)
* Add a QR-code reader mode to the app, as to setup Stream ID, bitrate, and WiFi passwords using a little website tool. (moderate)
* Have gstreamer/python automatically detect the input devices, settings, system, and configure things automatically. Allowing for burn, plug, and boot, without needing to log in via SSH at all.

#### Discord Support

Support is available on Discord at [https://discord.vdo.ninja](https://discord.vdo.ninja) in channel _#raspberry-ninja_
