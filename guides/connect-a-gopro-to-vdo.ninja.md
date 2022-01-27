# Connect a GoPro to VDO.Ninja

A GoPro itself doesn't support streaming directly to [VDO.Ninja](https://vdo.ninja) on its own, but there are some indirect ways to do it currently.

#### Using a GoPro Hero 8 Black or newer as a USB webcam

While this approach requires a computer, you can connect a GoPro to VDO.Ninja via USB and a computer. The GoPro will appear in your browser and VDO.Ninja for live streaming anywhere.

[https://gopro.com/en/ca/news/how-to-use-gopro-for-webcam](https://gopro.com/en/ca/news/how-to-use-gopro-for-webcam)

#### Using older GoPros as a webcam using HDMI to USB adapters

You can still connect older GoPros to VDO.Ninja on a computer with an HDMI to USB adapter. While it doesn't stream wirelessly to the computer itself, that host computer can then stream the GoPro video stream to any computer in the world wirelessly and with low latency using VDO.Ninja.

[https://gopro.com/en/ca/news/how-to-use-gopro-for-webcam](https://gopro.com/en/ca/news/how-to-use-gopro-for-webcam)

#### Portable laptop-in-a-backpack option

There's also the option of putting something like a Chromebook or Macbook M1 into a backpack, and doing much the same thing -- connect the GoPro to the Chromebook with a long HDMI cable. An HDMI to USB adapter can be used to connect the HDMI to the ultralight laptop, and you can use just the normal VDO.Ninja browser to stream the HDMI video.&#x20;

As mentioned previously, newer GoPros (such as a Hero 8 Black or newer), can use USB-C instead of HDMI.

If using a service such as Speedify.com on your laptop, you can bond WiFi and Cellular signals together, allowing you to save bandwidth and be truly mobile, while not dropping the video connection. Hardware cellular bonding solutions are available for professionals needing even more connection reliability.&#x20;

#### Android system with HDMI input support built-in

Another option, one that I haven't tested yet myself personally, is to use an Android tablet device that supports HDMI input.

One such option is this Yolobox production, which I think you can install Chrome onto?. While I haven't tried it, if you can select the HDMI input within Chrome on that device, you might be able to stream to VDO.Ninja with an HDMI device in this way.\
[https://www.amazon.ca/YoloBox-Band-Facebook-YouTube-Encoder/dp/B07PP6KHHV](https://www.amazon.ca/YoloBox-Band-Facebook-YouTube-Encoder/dp/B07PP6KHHV)

#### Screen-sharing the GoPro video preview on Android

Next year, I'll have some mobile apps out that support HDMI input into a mobile phone, with VDO.Ninja as an output, but at present I haven't had the time to do that.&#x20;

I do however have an app that lets you _screen share_ the output of an Android device to VDO.Ninja. Using it, you can use an android phone to "preview" the GoPro output in full-screen mode, and then with the VDO.Ninja app stream that full-screen GoPro output to VDO.Ninja. This approach would not require HDMI cables.

#### Raspberry Pi or Nvidia Jetson encoder

One option is to use a Raspberry Pi, which can ingest the HDMI video of the GoPro and stream it to VDO.Ninja over WiFi. \
\
The code for this project is here: [https://github.com/steveseguin/raspberry\_ninja](https://github.com/steveseguin/raspberry\_ninja) \
\
it's still a young project, and while things are functional, it's still mainly for those who are interested in tinkering. For production purposes, it might be a bit finicky, but quickly improving.&#x20;

If building your own, you might find that it can be built so small that you might be able to use it on its own as a wireless camera, and not need a GoPro at all.\


![](<../.gitbook/assets/image (127).png>)

_Stay tuned for more options._
