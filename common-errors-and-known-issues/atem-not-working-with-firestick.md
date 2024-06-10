---
description: >-
  ATEM devices don't support HDCP, which some HDMI input devices require.
  Disabling HDCP with some HDMI splitters can resolve the issue.
---

# ATEM not working with Firestick

One user reports that their ATEM extreme wasn't working with an Amazon Firestick via HDMI.

Due to HDCP, it turns out you need to use an HDMI splitter that bypasses HDCP for it to work, else you'll just get a black screen. The ATEM does not support HDCP, so you need a way to disable it, and some splitters can offer that.

{% embed url="https://www.youtube.com/watch?v=vweEwAvusfE" %}
Taking a look at the Firestick HD Max and VDO.Ninja
{% endembed %}

### Background and more information

In a YouTube video, it was demonstrated that a Firestick, such as the 4K Max, can play VDO.Ninja videos at full-screen with a clean output. AV1 is even supported to some degree with the 4K Max, which offers excellent color reproduction versus VP8 or H264.

Given the price of a Firestick versus something like an SBC (ie: Orange Pi 5), it's an appealing option to use as a source for an ATEM device, like an ATEM mini. ATEMs don't have browser source support on their own, making a hack like this necessary.

Needing to disable HDCP may also apply to other HDMI input devices when paired with a Firestick, Chromecast, or other media dongle.&#x20;

If using this setup with an overlay, like [Social Stream](../steves-helper-apps/social-stream-ninja/), you may want to use `&chroma` on the featured chat overlays to enable the green background. From there, you should be able to chroma-filter out the green in the ATEM device, providing transparency.

It's also possible to use OBS to output a source to an ATEM device, via HDMI output on your computer. You'll still need to use a green screen if wanting transparencies of course.

Lastly, you can use IFrames and the VDO.Ninja mixer app to create custom scenes and layouts with transparencies in a browser source, if you wanted to do the mixing that way, avoiding the need for Chroma keying. Just please note that a Firestick or other low-powered dongle don't seem to handle multiple videos and complex effects all that well, or even full HD video for that matter. You may want to get a NUC device or powerful SBC to do more complex mixes that feed out into an ATEM of such.
