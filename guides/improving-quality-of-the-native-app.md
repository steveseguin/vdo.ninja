---
description: Improve quality of video if using iOS or Android native app versions
---

# How to improve quality of the native app

The [native app version](../steves-helper-apps/native-mobile-app-versions.md) of VDO.Ninja isn't as feature rich as the web-app version, so control over exactly resolutions, frame rates, and more are a bit limited. Still, there are ways to encourage the quality to be as high as it can go.

For the full native app walkthrough, including WHIP, USB devices, recording, talkback, and Social Stream Ninja, see:

{% content-ref url="../steves-helper-apps/native-mobile-app.md" %}
[native-mobile-app.md](../steves-helper-apps/native-mobile-app.md)
{% endcontent-ref %}

## Increase the bitrate

Setting the bitrate on the **viewer side**, such as by adding one of the following to the view-link.\
\
`&videobitrate=12000` or if you want to push things even more, try:  `&videobitrate=20000`

Different phones will have different CPU/encoding capabilities, so different codecs can result in varying qualities sometimes. 20-mbps is very hard on some phones, and they may overheat quickly.

### Android app-side bitrate

The Android native app also has an app-side **Custom bitrate** option under **Advanced Settings**. Enable it and enter the target bitrate in kbps. The app accepts values from 100 to 50000 kbps, with typical defaults around 6000 kbps for 720p and 10000 kbps for 1080p.

The iOS native app does not currently expose the same app-side custom bitrate field, so iOS quality is mainly influenced by the capture preset, viewer-side bitrate request, codec negotiation, network quality, and device thermals.

## Enable 1080p mode

In the app itself, you can enable the prefer 1080p mode also. This doesn't force 1080p mode, but it "suggests" to the phone that is what you want captured. In time, more advanced controls may be added in this respect.

**If screen sharing on iOS, you will probably want to NOT enable 1080p**, as iOS devices tend to stop screen sharing after a few seconds if the resource load is too high. 720p tends to keep this from happening.

## Improve the network connection

You can also try to connect your smartphone via Ethernet, rather than via WiFi, and ensure your network connection is top-notch. You can do this with a USB to Ethernet adapter, and then connecting the phone to your router.

You'll want the viewer also to be on a wired connection if possible, so preferably also ethernet.

If on cellular, considering using a bonded cellular connection, such as those provided by Speedify or other provider.

#### Diagnosing Your Network Connection

Before optimizing quality, check your connection type:

**Add `&stats` to your view link** to see live statistics including:

* Bitrate being received
* Packet loss percentage
  * Should be 0% ideally, under 1% acceptable
* Connection type (`relay` vs `host`/`srflx`)
  * `host`/`srflx` = direct, `relay` = TURN server

If you see `candidateType: relay` on either side, your connection is going through a TURN server, which adds latency and may limit bandwidth. For best quality, you want a **direct peer-to-peer connection** (`host` or `srflx`).&#x20;

**Tips for avoiding TURN/relay:**

* Ensure both devices are on the same network if possible
* Check router/firewall settings for WebRTC traffic
* Try a different network if stuck on relay mode

#### Network Optimization Tips

1. **Use Ethernet adapters** - USB-C to Ethernet adapters eliminate WiFi variability
2. **Same network advantage** - When phone and computer are on the same LAN, direct peer-to-peer is more likely
3. **Check packet loss** - `&stats` shows packet loss. Even 1-2% loss degrades quality noticeably
4. **WiFi 5GHz vs 2.4GHz** - 5GHz has less interference but shorter range
5. **Bonded cellular** - Services like Speedify can combine WiFi + cellular for stability

***

## Smartphone overheating

Phone thermal throttling is a common cause of quality degradation during video encoding.

* **Use a phone cooling fan or heatsink** - metal heatsinks on the back help significantly
* **Remove the phone case** during extended sessions
* **Avoid direct sunlight** and hot environments
* **Lower screen brightness** - screen is a heat source
* **Try H.264 codec** - often has hardware encoding with lower heat output (\&codec=h264)
* **Close other apps** to reduce CPU load

## Update your smartphone

Some smartphones will have limited functionality if using an older version of the operating system. This is especially true of iOS devices, where iOS 16 and up have several core improvements over older versions.

## If Republishing Through OBS

When using OBS to capture the VDO.Ninja stream:

1. **Increase OBS browser source bitrate**: In your streaming settings, ensure output bitrate is high enough (8000+ kbps for 1080p)
2. **Add a Sharpening Filter**: Right-click the browser source -> Filters -> Add Effect Filter -> "Sharpening". Use a small value (0.08-0.15). This helps restore perceived sharpness lost in compression, especially for text and lines.
3. **Match resolution**: Set browser source dimensions to match the incoming stream (1920x1080 for 1080p)
4. **Use Game Capture mode**: If performance allows, consider OBS's hardware-accelerated capture modes

***

## Viewer-side URL options for tweaking quality

### Codec Selection

Codec selection is generally negotiated by the viewer, browser, device hardware, and publishing target. For VDO.Ninja viewer links, try:

```
&codec=h264
```

H.264 often has hardware encoding on phones, reducing CPU load and heat.

```
&codec=vp9
```

VP9 can deliver better quality at lower bitrates for screen content with text.

```
&codec=av1
```

Best compression efficiency but requires newer devices and more CPU.

**Try different codecs** - some phones have hardware acceleration for specific codecs, which keeps them cooler and sustains quality longer.

If you are using the native app's WHIP-only mode, the WHIP service may also restrict which codecs, bitrates, and resolutions are accepted.

#### Content Hint (Resolution Priority)

```
&contenthint=detail
```

Tells the encoder to prioritize **resolution over framerate**. Excellent for screen sharing with text, documents, or detailed content. Also works: `&sshint=detail`

```
&contenthint=motion
```

Prioritizes smooth framerate over resolution. Better for video playback or games.

#### Degradation Preference

```
&degrade=maintain-resolution
```

Similar to contenthint, explicitly tells encoder to drop framerate before reducing resolution when bandwidth is limited.

#### Resolution and Scaling

```
&scale=100
```

#### Buffer for Jitter Compensation

```
&buffer=3000
```

Adds a 3-second playback buffer. Adds latency but helps smooth out network jitter. Useful if you see stuttering. Try values from 500-5000ms.

```
&buffer2=3000
```

Same as buffer but also includes RTT compensation.

***

### Final Notes

Getting "lossless" quality from mobile screen share isn't truly possible due to real-time encoding constraints, but with the right combination of settings, you can get excellent results suitable for most use cases. The key factors are:

1. Good network conditions (low latency, zero packet loss)
2. Direct peer-to-peer connection (avoiding TURN)
3. High bitrate allowance (10000+ kbps)
4. Appropriate codec for your device
5. Content hint set to prioritize what matters (resolution vs framerate)
6. Phone staying cool<br>

if you want more control over settings and quality, you'll need to use the web app, available at [https://vdo.ninja](https://vdo.ninja), however this does not support screen sharing on mobile.

And for absolute highest quality, consider USB screen mirroring to a computer, then screen sharing from the computer using the web app where you have full control over all settings.
