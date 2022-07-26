# How to mirror a video while Full-Screen - For iPads and Teleprompters

To  get a video to mirror while full-screened, you have a few options.

One is to just full screen the browser itself; F11 on most desktops. The video itself may not be fullscreen, but the browser will be and should be pretty close to perfect. Adding [`&hideheader`](../advanced-settings/design-parameters/and-hideheader.md) can hide any menu bars, if there are any.

Another option that is undergoing experimental testing as of Sept 23rd 2020 is to use the [`&effects`](../source-settings/effects.md) option, with `&effects=2` applying a mirrored effect to the video before publishing the video.

**Push Link**\
[https://vdo.ninja/?push=SOMESTREAMID\&effects=2](https://vdo.ninja/?push=SOMESTREAMID\&effects=2)

**View Link**\
[https://vdo.ninja/?view=SOMESTREAMID](https://vdo.ninja/?view=SOMESTREAMID)

So by adding `&effects=2`, the video will be mirrored in a way that can be full screened.  There are some limitations with this approach still, but I'm curious to get your feedback.
