# How to get iPhones to output 1080p Videos

You can force 1080p on an iPhone, but you then need to use [`&codec=vp8`](../advanced-settings/view-parameters/codec.md) also.

for example:

[`https://vdo.ninja/?push=streamid&width=1920&height=1080`](https://vdo.ninja/?push=streamid\&width=1920\&height=1080)

and:

[`https://vdo.ninja/?view=streamid&codec=vp8&videobitrate=6000`](https://vdo.ninja/?view=streamid\&codec=vp8\&videobitrate=6000)

iPhones do not support h264 at resolutions higher than 720p30.

If you use VP8 though, you will be using the software-based encoder, which will make the iPhone pretty warm/hot. It also only works only on newer iOS versions (iOS 14, for example).

In the future, iOS may support 1080p with the h264 hardware encoder.
