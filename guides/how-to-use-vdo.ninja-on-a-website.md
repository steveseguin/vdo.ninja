---
description: You can host a VDO.Ninja media stream on a website, via the IFRAME API
---

# How to use VDO.Ninja on a website

### Basic embeddeding

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
More about the[ IFRAME API here.](how-to-use-vdo.ninja-on-a-website.md#advanced-iframe-api-options)

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
