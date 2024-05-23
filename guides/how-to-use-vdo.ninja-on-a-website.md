---
description: You can host a VDO.Ninja media stream on a website, via the IFRAME API
---

# How to use VDO.Ninja on a website

### Basic embedding

Embedding VDO.NInja into a website should be pretty simple; we're just using the IFRAME element and setting the source to the VDO.Ninja URL we wish to load

```
<!DOCTYPE html>
<html>
<head>
    <title>VDO.Ninja Embedded Iframe</title>
</head>
<body>
    <iframe 
        src="https://vdo.ninja/?view=JkYwyxy" 
        allow="camera; microphone; autoplay" 
        width="640" 
        height="360">
    </iframe>
</body>
</html>
```

You may want to add or remove certain permissions, such as geolocation. Please note that while enabling auto-play is an IFRAME option, unless the parent window has already had a user-gesture interaction, the video inside VDO.Ninja will not autoplay; at least not with audio. Auto-playing of audio is controlled by the browser to limit annoying ads from auto-playing also; overriding this isn't really feasible.

### Adding some security for public deployments

If wanting to use this page for public use, I'd probably want to secure things a bit more.  Such as using the `&audience` parameter, which makes it so the viewer can't just publish to your stream ID when you stop streaming yourself. \
\
The audience parameter is available with VDO.Ninja v25.2 and newer.

1. An example push link is this: [https://vdo.ninja/alpha/?audience=12345abcPublishingToken\&push=JkYwyxy](https://vdo.ninja/alpha/?audience=12345abcPublishingToken\&push=JkYwyxy)
2. The view link you'd be provided woudl be something then like this: [https://vdo.ninja/alpha/?audience=HrDrNy3jiA50QzlU\&view=JkYwyxy](../getting-started/vdo.ninja-basics.md)

<figure><img src="../.gitbook/assets/image (241).png" alt=""><figcaption><p>Example of the provided audience key to use</p></figcaption></figure>

### Advanced IFRAME API options

There's a sandbox that lets you play with the IFRAME API here: [https://vdo.ninja/iframe](https://vdo.ninja/iframe) , but it might be more complex than you need.\
\
More about the[ ](how-to-use-vdo.ninja-on-a-website.md#advanced-iframe-api-options)[IFRAME API here.](https://docs.vdo.ninja/guides/iframe-api-documentation)

### Transparency

Setting the `allowtransparency` attribute on the IFrame to `true` will allow for the contents to be transparent. You can then make VDO.Ninja transparent by adding `&transparent` to the URL, which sets the page's background to `rgba(0,0,0,0)`.&#x20;

[https://vdo.ninja/iframe ](https://vdo.ninja/iframe)can demonstrate this by opening [https://vdo.ninja/?transparent](https://vdo.ninja/?transparent) with it.

### Accessing media frames directly for use in a video element

This is a more complex request, but it's possible.\
\
https://versus.cam makes use of the `&sendframes` parameter to send raw video frames to the parent IFRAME, for use in a video element. This requires the VDO.Ninja deployment and the parent frame to share the same site origins, however depending on how you want the domains to appear, this could require some fancy request header manipulation, etc.\
\
Another easier option is to use the IFRAME API to make a request using `getVideoFrame`, such as: `{getVideoFrame:true, streamID:"abc123xyc"}`.  This will return a video frame, a PNG image of the current video stream with stream ID `abc123xyc`, which allows for a crude video stream. If perhaps a guest's browser doesn't support the `&sendframes` option, this could be a fallback.\
\
Anyways, these are advanced and complex options of loading a video element with a VDO.Ninja source. Normally just using the IFRAME as the playback window, and interacting with it via the IFRAME API is suggested.\
\
If you really want another way to access VDO.Ninja streams,  you may need to consider using a server to convert from VDO.Ninja into an HLS stream, however that both carries cost and incrasese the latency of the stream dramatically.
