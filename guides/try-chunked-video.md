---
description: Try experimental browser chunked video for a difficult connection, with clear sender bitrate, viewer buffer, room, and reset steps.
---

# Try chunked video on a difficult connection

Use chunked mode as an advanced fallback after improving the [network](choose-a-network-for-live-events.md) and testing a lower [normal video bitrate](how-do-i-control-bitrate-quality.md). It uses a different browser video path with explicit buffering and recovery controls. Expect extra delay and test it before relying on it at an event.

Use a recent Chromium-based browser such as Chrome on the sending device and a current OBS Browser Source on the receiver. On iPhone, both Safari and Chrome need the required iOS browser features; unsupported versions use normal video instead. Firefox cannot publish chunked video. For another phone option, see the [native app's SRT setup](mobile-app/srt-to-meshcast.md).

## 1. Change the filming link

Append `&chunked=1000&quality=1&fps=30` to the **sender's** existing browser link and reopen it. This example requests 720p30 with a **1000 kbps video target**. It is a low-bandwidth comparison, so moving action may look soft.

```text
Direct: https://vdo.ninja/?push=YOURID&chunked=1000&quality=1&fps=30
Room:   https://vdo.ninja/?room=YOURROOM&chunked=1000&quality=1&fps=30
```

Keep your own IDs, password, and existing options. A room invite does not need to be converted to a `push` link. If an option already exists, change it rather than adding a duplicate.

**The number after `chunked` is bitrate in kbps, not milliseconds.** `&chunked=500` targets only 500 kbps. It can be an emergency fallback with `&quality=2` for 360p, but is unlikely to give sharp fast-moving sports video. Raise the target only when the connection can carry it.

## 2. Set the receiving buffer

In OBS, open the camera's **Browser Source > Properties**. Add `&chunkbuffer=3000` to its existing view link:

```text
https://vdo.ninja/?view=YOURID&chunkbuffer=3000
```

This sets an initial three-second playout target. Chunked mode can adjust it automatically, and total delay includes capture, encoding, and transport. An existing `&buffer=3000` also sets the chunked buffer; use one setting, since `buffer` overrides `chunkbuffer`.

For a room, keep the complete solo view or scene link copied from the director. Do not put the viewer buffer on the filming link and expect it to delay OBS.

## 3. Compare and keep only what helps

Check sustained motion, sound sync, and recovery after brief interruptions. Close duplicate direct viewers; chunked mode still sends data to each viewer.

On iPhone, choose the camera and orientation before starting. If changing cameras freezes the received video, refresh the OBS Browser Source. If rotating the phone leaves the received picture in the wrong shape, [return to normal video](#return-to-normal-video).

Plain `&chunked` does not enable its optional parity and selective-resend controls. If loss persists despite enough upload capacity, use the [reliability settings and presets](../newly-added-parameters/and-chunked.md#reliability) for a controlled comparison. These add overhead, so do not pile them onto an already saturated connection.

Keep bitrate in the sender's `chunked` or `chunkbitrate` setting. A normal viewer `&bitrate` request does not control this encoder. Likewise, `chunkedbuffer` controls the sender's backlog, not the viewer's playback delay.

## Return to normal video

Remove `chunked` and any other chunk-specific options from both links, then reopen the sender and refresh the OBS source. Remove test quality limits or buffer settings if you no longer want them. `&buffer=0` only requests minimal buffering; it does not switch chunked mode off.

See [buffering explained](smooth-playback-with-a-buffer.md) or the [complete chunked reference](../newly-added-parameters/and-chunked.md) for finer control. Chunked URL options do not configure native-app SRT, RTMP, or WHIP outputs.
