# Capturing without browser sources

### Vingester.app

Vingester.app can let you do VDO.Ninja to NDI.  It uses a browser window and can be used to export a copy of the window to FFmpeg, NDI, or make the source available for window-capture. It is a bit heavy on CPU usage, but on a dedicated computer, it works quite well for hosting a few NDI streams.

[https://github.com/steveseguin/vingester](https://github.com/steveseguin/vingester)



### Electron Capture

\
Electron Capture is the officially supported tool for doing window capture of VDO.Ninja. It's very light weight and has quite a few command line options to batch start several windows at a time, along with support for hotkeys and other nifty VDO.Ninja specific tasks.

[https://github.com/steveseguin/electroncapture](https://github.com/steveseguin/electroncapture) \
\
If using Electron Capture on Windows, you can currently do Win+Tab to switch between virtual desktops --- and sometimes this lets you can put all the VDO.Ninja windows in one desktop, and have a second desktop for Vmix/etc. It works with some windows setups, and in others, might just show black videos when trying to capture.&#x20;



### Virtual Cameras and Virtual Audio devices

While this approach will still use a browser source, you can ingest VDO.Ninja into a browser source for an app like OBS Studio, or even something paid like ManyCam, and then export the captured video stream via their Virtual Camera features into another app that supports webcam / video input devices.

Audio can be exported directly via VDO.Ninja into a virtual audio device, either their the `&od` feature, or from even the right-click context menu, where you can specify which audio output device an audio stream should be played into it. If a virtual audio cable is selected as the output destination, you can then bring that virtual audio cable into any audio application as a raw audio stream, as if it was a microphone or line-in source.



### WHEP / WHIP



There's also WHEP/WHIP output from VDO.Ninja, which is relatively a new technology/feature, and so not quite a replacement for browser sources. That said, OBS Studio is starting to support this ingestion approach, along with Gstreamer, many webRTC CDN servers and services, and perhaps over the coming years something like Vmix will adopt this new technology as well.  Please provide feedback and requests if using WHIP/WHEP, so i can continue to improve it.

[https://vdo.ninja/whip ](https://vdo.ninja/whip)



### Raspberry.Ninja

\
\
There's also Raspberry.Ninja ([https://github.com/steveseguin/raspberry\_ninja](https://github.com/steveseguin/raspberry\_ninja)), which supports saving raw VDO.Ninja media streams to disk. While there is a bug that's blocking things from working soothingly, can technically use it to pull raw video sources from VDO.Ninja and push to not just disk, but even NDI, system sockets/pipes, RTSP servers, and much more.\
\
While Raspberry.NInja need more time to cook when it comes to video ingestion, it is more capable than using WHEP/WHIP alone, and supports the data-channel transport protocol, allow for dynamic settings to be applied and meta information to be transmitted, such as tally-light indicators.



### Third parties



There are some third parties that have integrated with VDO.Ninja already, which are able to pull from VDO.Ninja and make the streams available as RTSP sources or such, but I do not have access to their code sources and so cannot promote their paid services here, but you can perhaps search around to find them online.&#x20;
