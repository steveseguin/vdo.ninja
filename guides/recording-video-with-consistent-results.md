---
description: A plain-language guide to getting steadier VDO.Ninja recordings by choosing the right network, buffer, and recording method.
---

# Recording video with consistent results

This guide is for people who are using VDO.Ninja to record interviews, podcasts, remote guests, or live productions.

The goal is simple: fewer frozen moments, fewer audio jumps, and fewer surprises after the recording is finished.

The most important thing to know is this:

> A recording is only as reliable as the path used to make it.

If you record a guest after their video has already crossed a weak Wi-Fi connection, the recording may include the same freezes and jumps you saw live. If the guest records themselves locally, before the Internet gets involved, that backup can be much cleaner.

For important recordings, do not depend on only one copy. Use a live recording and at least one backup.

## A simple approach

For many serious productions, a practical approach to test is:

1. Record the live show in OBS or your production software.
2. Add a little buffer to the OBS VDO.Ninja source.
3. Have each guest make a local browser recording as a safety copy.
4. If possible, also use Google Drive cloud backup for guest recordings.
5. Test the full setup before the real session.

This gives you a live recording that is ready right away, plus cleaner guest backups if the live connection has a bad moment.

## Think in three parts

Consistent recordings usually come down to three things:

* **Network:** how steady the connection is.
* **Buffer:** how much time VDO.Ninja is allowed to smooth out bumps.
* **Recording method:** where the recording is made.

You do not need to become a network engineer. You just need to choose the right balance for the job.

## Part 1: Network

Wi-Fi is convenient, but it is also one of the most common causes of short freezes, audio skips, and sudden video quality drops.

If a guest can use an Ethernet cable, ask them to use it. This is often the single biggest improvement.

If they must use Wi-Fi:

* Ask them to sit close to the router.
* Avoid being on the far side of the house.
* Avoid busy public Wi-Fi.
* Avoid VPNs during the recording, unless they are required.
* Ask them to close cloud backup apps, game launchers, and large downloads.
* Keep the laptop plugged into power.
* Use Chrome or Edge for the most predictable browser recording support.

Firewalls can also matter. VDO.Ninja normally tries to make a direct peer-to-peer connection. Direct connections are usually best for quality and delay. Some office, school, hotel, or corporate networks block this and force the call through a relay server instead. A relay can save the connection, but it may add delay and reduce quality.

If one guest is always unstable, test them from a different network before blaming the camera or VDO.Ninja settings.

Related network and troubleshooting guides:

{% content-ref url="../common-errors-and-known-issues/packet-loss.md" %}
[packet-loss.md](../common-errors-and-known-issues/packet-loss.md)
{% endcontent-ref %}

{% content-ref url="../common-errors-and-known-issues/video-freezes-mid-stream.md" %}
[video-freezes-mid-stream.md](../common-errors-and-known-issues/video-freezes-mid-stream.md)
{% endcontent-ref %}

{% content-ref url="../common-errors-and-known-issues/relay-candidate-being-selected.md" %}
[relay-candidate-being-selected.md](../common-errors-and-known-issues/relay-candidate-being-selected.md)
{% endcontent-ref %}

{% content-ref url="../common-errors-and-known-issues/enterprise-firewall-checklist.md" %}
[enterprise-firewall-checklist.md](../common-errors-and-known-issues/enterprise-firewall-checklist.md)
{% endcontent-ref %}

{% content-ref url="handling-guest-disconnects-and-connection-recovery.md" %}
[handling-guest-disconnects-and-connection-recovery.md](handling-guest-disconnects-and-connection-recovery.md)
{% endcontent-ref %}

{% content-ref url="mesh-network-debug.md" %}
[mesh-network-debug.md](mesh-network-debug.md)
{% endcontent-ref %}

## Part 2: Buffer

A buffer is a small waiting area for video and audio.

Without much buffer, video arrives quickly, but small network bumps are easier to see. With more buffer, VDO.Ninja has more time to smooth over those bumps, but the video is delayed a little more.

For live conversation, you usually want less buffer.

For recording into OBS, a small delay is often worth it if it makes the recording steadier.

### Regular buffer for OBS sources

If you are pulling a VDO.Ninja view link into OBS and seeing little freezes or sync jumps, try adding this to the OBS/view link:

```text
&buffer=200
```

If that is not enough, try:

```text
&buffer=500
```

This does not fix a terrible connection, but it can help with normal Wi-Fi jitter.

Use this on the viewing or OBS side, not necessarily on the guest invite link.

Example OBS/view link:

```text
https://vdo.ninja/?view=GUESTID&room=ROOMNAME&scale=100&buffer=500
```

Related setting:

{% content-ref url="../advanced-settings/view-parameters/buffer.md" %}
[buffer.md](../advanced-settings/view-parameters/buffer.md)
{% endcontent-ref %}

### Chunked mode as a heavier buffer option

Chunked mode is a different way of sending video. It is designed to favor steadier quality over the lowest possible delay.

It can be useful when:

* You are recording into OBS.
* A delay of about 1 to 3 seconds is acceptable.
* The guest is on Chrome or Edge.
* You care more about avoiding visible damage than having instant video.

It is not the best choice when guests need a perfectly natural, low-delay conversation path.

A basic chunked guest link might include:

```text
&chunked=2500&chunkprofile=balanced
```

Then the OBS/view side can choose how much buffer to allow:

```text
&chunkbuffer=1000
```

This means the OBS side is giving the video about one second of room to smooth out trouble.

For a rougher Wi-Fi connection, you can allow more:

```text
&chunkbuffer=1500&chunkbufferfloor=1000&chunkbufferceil=3000&chunkjitterslack=500&chunkadapt=hybrid
```

The tradeoff is delay. More buffer can mean a steadier recording, but the video will arrive later.

Related setting:

{% content-ref url="../newly-added-parameters/and-chunked.md" %}
[and-chunked.md](../newly-added-parameters/and-chunked.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/newly-added-parameters/and-chunkedbuffer.md" %}
[and-chunkedbuffer.md](../advanced-settings/newly-added-parameters/and-chunkedbuffer.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-nochunked.md" %}
[and-nochunked.md](../advanced-settings/settings-parameters/and-nochunked.md)
{% endcontent-ref %}

## Part 3: Recording method

There are several ways to record with VDO.Ninja. They are not all equal.

For a broader overview of recording choices and file formats, see:

{% content-ref url="options-to-record-streams.md" %}
[options-to-record-streams.md](options-to-record-streams.md)
{% endcontent-ref %}

{% content-ref url="recording-format-options-and-settings.md" %}
[recording-format-options-and-settings.md](recording-format-options-and-settings.md)
{% endcontent-ref %}

### OBS recording

This is the normal live-production method.

You bring each guest into OBS, switch the show live, and record the final result. This is great when you want a finished show right away.

The downside is that OBS records what it receives. If the guest's Wi-Fi has a bad moment, OBS may record that bad moment too.

Use OBS recording as your main live record, but keep a backup.

### Other publishing paths to test

If a normal browser publisher is not steady enough, there are other ways to get video into VDO.Ninja or into your production.

These options are not required for most people, but they can be useful for more demanding recording work:

* **OBS WHIP output:** OBS can publish using WHIP into VDO.Ninja or another WHIP-compatible service. This can be a good test when you want OBS to handle capture and encoding instead of a browser tab.
* **Game Capture:** a standalone Windows app for publishing game, window, or screen-style captures into VDO.Ninja. It can be useful when a browser's capture path is too dynamic for the job. [https://github.com/steveseguin/Game-capture](https://github.com/steveseguin/Game-capture)
* **Ninja OBS Plugin:** an OBS plugin for VDO.Ninja publishing and receiving workflows, without needing to manage everything through separate browser tabs. [https://steveseguin.github.io/ninja-obs-plugin/](https://steveseguin.github.io/ninja-obs-plugin/)
* **Meshcast:** a server-based companion service for VDO.Ninja. It can help when pure peer-to-peer publishing is not the right fit, or when you want RTMP, SRT, WHIP, or VDO.Ninja/WebRTC options in the same workflow. [https://app.meshcast.io](https://app.meshcast.io)

These can be more predictable in some setups because the capture and encoding path is less like a changing browser call and more like a steady video feed. Test them before using them for a real recording.

Related tools:

{% content-ref url="../steves-helper-apps/whip-and-whep-tooling.md" %}
[whip-and-whep-tooling.md](../steves-helper-apps/whip-and-whep-tooling.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/game-capture.md" %}
[game-capture.md](../steves-helper-apps/game-capture.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/ninja-obs-plugin.md" %}
[ninja-obs-plugin.md](../steves-helper-apps/ninja-obs-plugin.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/meshcast.io.md" %}
[meshcast.io.md](../steves-helper-apps/meshcast.io.md)
{% endcontent-ref %}

### Guest local recording

This is often the best safety copy.

The guest's own browser records their camera and microphone before the video travels over the Internet. If the guest's Wi-Fi drops for a second, their local recording may still be clean.

Add this to the guest invite link to give them a recording button:

```text
&record=6000
```

To start recording automatically:

```text
&autorecordlocal=6000
```

For longer sessions, split the recording into smaller pieces:

```text
&autorecordlocal=6000&splitrecording=5
```

Splitting into 5-minute sections can reduce the chance of losing an entire recording if the browser crashes.

Important notes:

* Guest local recording uses more CPU and disk space on the guest's computer.
* It should be tested before an important session.
* The guest should not close the tab until the recording is saved.
* Chrome or Edge usually gives the most predictable browser recording support.
* Mobile browsers and Safari can be less predictable for serious recording work.

Related settings:

{% content-ref url="../advanced-settings/recording-parameters/and-record.md" %}
[and-record.md](../advanced-settings/recording-parameters/and-record.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/recording-parameters/and-autorecordlocal.md" %}
[and-autorecordlocal.md](../advanced-settings/recording-parameters/and-autorecordlocal.md)
{% endcontent-ref %}

### Google Drive backup

Google Drive backup is useful when you want guest recordings to upload to the host's Google Drive.

This can be helpful because the guest can record locally and send the file to the producer without a manual file transfer later.

Keep in mind:

* The guest may need to approve the recording prompt.
* The guest needs enough upload speed.
* Uploading while recording can add load to the guest's connection.
* It is still wise to keep another backup.

Related guide:

{% content-ref url="cloud-sync-google-drive-and-dropbox.md" %}
[cloud-sync-google-drive-and-dropbox.md](cloud-sync-google-drive-and-dropbox.md)
{% endcontent-ref %}

### Dropbox and local disk recording

Dropbox and local disk recording can be useful in studio workflows, especially for saving or uploading the host-side recording.

These are good extra safety layers, but they should not be the only backup if you need clean guest ISO recordings. If the host records a remote guest after the guest's video has crossed the Internet, the host may still capture network glitches.

### Director-side remote recording

The director can record remote videos, but this records what the director receives.

If the connection has a freeze, that freeze may be in the recording.

This is convenient, but for the cleanest backup, guest-side local recording is usually better.

## Example setups to test

### Simple interview

Use this when you want a steady live recording and a basic backup.

Guest link:

```text
https://vdo.ninja/?room=ROOMNAME&push=GUESTID&ovb=2200&maxfps=30&contenthint=detail&record=6000&splitrecording=5
```

OBS/view link:

```text
https://vdo.ninja/?view=GUESTID&room=ROOMNAME&scale=100&buffer=500
```

### Podcast with cleaner guest backups

Use this when the final show is recorded live, but you also want cleaner guest files for emergency fixes.

* Record the program in OBS.
* Ask every guest to use Ethernet if possible.
* Use `&buffer=500` on OBS/view links.
* Add `&autorecordlocal=6000&splitrecording=5` to guest links.
* Link Google Drive in the studio if you want guest backups uploaded.

Guest link:

```text
https://vdo.ninja/?room=ROOMNAME&push=GUESTID&ovb=2200&maxfps=30&contenthint=detail&autorecordlocal=6000&splitrecording=5
```

OBS/view link:

```text
https://vdo.ninja/?view=GUESTID&room=ROOMNAME&scale=100&buffer=500
```

### Higher-stability OBS capture with chunked mode

Use this only after testing. It adds delay, but may give a steadier OBS feed.

Guest link:

```text
https://vdo.ninja/?room=ROOMNAME&push=GUESTID&maxfps=30&contenthint=detail&chunked=2500&chunkprofile=balanced&autorecordlocal=6000&splitrecording=5
```

OBS/view link:

```text
https://vdo.ninja/?view=GUESTID&room=ROOMNAME&scale=100&chunkbuffer=1000
```

For worse Wi-Fi, test:

```text
&chunkbuffer=1500&chunkbufferfloor=1000&chunkbufferceil=3000&chunkjitterslack=500&chunkadapt=hybrid
```

Do not use this for the first time during a paid session.

You can also use chunked mode for the recording path while keeping a smaller, lower-latency WebRTC path for monitoring or conversation. A viewer can opt out of chunked playback with:

```text
&nochunked
```

For example, the OBS recording source might use chunked mode and a larger buffer, while a separate confidence-monitor or guest-view link uses normal WebRTC with less delay. Chunked recordings can also be saved directly to disk without re-encoding the encoded video, which can reduce extra CPU work and avoid another generation of quality loss.

## A plain-English checklist before recording

Before the real session:

* Ask guests to use Ethernet if possible.
* Ask guests to restart their browser before joining.
* Ask guests to close downloads, cloud backup apps, and other video apps.
* Check that the camera and microphone are correct.
* Do a short test recording.
* Make sure the guest knows not to close the tab until the recording is saved or uploaded.
* Start the OBS recording.
* Confirm the backup recording is also running.

During the session:

* Do not change too many settings live.
* If one guest is unstable, lower their bitrate or frame rate.
* If OBS is seeing small jumps, add more buffer.
* If the whole connection is bad, stop and fix the network if the recording matters.

After the session:

* Wait for local recordings to save.
* Wait for cloud uploads to finish.
* Check that the files open before telling guests they can leave.

## Bitrate and frame rate tips

Higher numbers are not always better.

If the guest's connection is weak, asking for more quality can make the recording worse, not better.

VDO.Ninja may use a higher camera frame rate by default, often around 60 fps if the camera and browser allow it. If you want to cap the frame rate to reduce load, 30 fps is usually a safer first test, because some cameras do not support every frame rate cleanly.

```text
&ovb=2200&maxfps=30
```

For unstable Wi-Fi, lower the bitrate first:

```text
&ovb=1800&maxfps=30
```

It may look less sharp, but it can be steadier. You can also leave the frame rate alone if the camera is already stable.

For strong wired connections, you can test higher values, but always test before the real recording.

Related guide:

{% content-ref url="video-bitrate-for-push-view-links.md" %}
[video-bitrate-for-push-view-links.md](video-bitrate-for-push-view-links.md)
{% endcontent-ref %}

## The safest mindset

VDO.Ninja can do a lot, but browsers, Wi-Fi, and laptops are still real-world things.

For casual recordings, one recording may be enough.

For paid work, important interviews, or anything that cannot be repeated, use layers:

* OBS program recording.
* Guest local recording.
* Google Drive or other cloud backup.
* A short test before the session.
* Ethernet whenever possible.

The goal is not to make failures impossible. The goal is to make sure one bad Wi-Fi moment does not ruin the whole production.
