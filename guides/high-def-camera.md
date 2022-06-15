# High-def camera

You can customize the playback of videos by added parameters to the VDO.Ninja URL links, along with many other aspects. The default video bitrate of most modern browsers is around 2500-kbps, which is okay, but we can achieve higher video quality if we manually set this to something even higher.

`http://obs.ninja/?view=xxxxxxx&bitrate=6000`

You’ll notice that we added \&bitrate=6000 to the viewer’s side and not the publishing side. The viewer gets to control the bitrate; every viewer can set their own custom video bitrate in fact.

On the publishing side, the default target resolution is already a high 1280x720 @ 60-fps, but we can set this higher by adding \&quality=0 to the push link. This will have the publisher’s side try to make available a 1920x1080 video stream, if their camera or video device supports it. If not, it will fall back to 720p. `http://obs.ninja/?push=xxxxxxx&quality=0`

For 1080p60 gaming, you’ll want to set the video bitrate to 12000-kbps or higher, as lower bitrates might cause the frame rate to be quite low otherwise. Otherwise, for talking head-type videos, the default video bitrate is often going to be adequate.

Higher resolution streams, especially 1080p60, requires a LOT of CPU power. Having 4-CPU cores is generally recommend for 1080p60 video streams, and 6 to 8 cores are recommended if you are intending ti game at the same time.

Using Ethernet instead of Wi-Fi will also help to ensure the frame loss at these higher resolutions is managable. At higher resolutions, frame rates are more likely to be unstable.

4K30 video is achievable with VDO.Ninja, with a fast enough computer and with very high video bitrates; often in the realm of 30 to 40-mbps.

As VDO.Ninja dynamically adjusts video resolution and bitrate to match the available Internet connection bandwidth availability, sometimes 1280x720 video resolutions won’t be maintainable. You can run the https://VDO.Ninja/speedtest to see if you are able to hit at least 2000-kbps, which is about what is needed for smooth 720p video.
