---
description: VDO.Ninja URL parameters and advanced settings for OBS, rooms, remote guests, bitrate, audio, video, screen sharing, WHIP, and mobile workflows.
---

# VDO.Ninja URL Parameters and Advanced Settings

## Overview

VDO.Ninja uses URL parameters to control how publishing, viewing, rooms, guest invites, OBS integration, bitrate, audio, video, recording, WHIP, and mobile workflows behave. If you are searching for a specific VDO.Ninja parameter such as `&push`, `&room`, `&meshcast`, `&whip`, `&quality`, or `&queue`, this section is the main reference.

VDO.Ninja negotiates a direct connection between a publishing device and a viewing device, such as [OBS \[Open Broadcaster Software\]](https://obsproject.com/). There are generally two links involved: one to push (publish) and one to pull (view), although links can be made to do both at the same time.

The viewer (receiver) and the publisher (sender) each play their own role in determining the qualities of a stream, so likewise each side has its own set of parameters available to them. A publisher can have multiple viewers access their video stream, with each viewer having the ability to customize the quality of the stream they receive.

The following guide details the options, syntax, values, and general use of these available settings/parameters.

## Passing parameters via the URL

You can customize the playback of videos by adding query string parameters to the VDO.Ninja URL links, along with many other aspects. VDO.Ninja is highly flexible in this regard, letting you achieve your desired outcome without needing to code and without additional software.

For example, a simple viewer URL link such as `https://vdo.ninja/?view=streamid` could be amended to `https://vdo.ninja/?view=streamid&videobitrate=500`, which will cause the viewer to receive the publisher's video stream at a video bitrate of 500-kbps.

Multiple parameters can be appended together by using the ampersand (`&`) as a separating character. For example, to view the video stream published at stream ID `streamid` at a video bitrate of 500-kbps and set the [`&stereo`](general-settings/stereo.md) parameter to `1`:

```markup
http://vdo.ninja/?view=streamid&videobitrate=500&stereo=1
```

Some parameters, like [`&view`](advanced-settings/view-parameters/view.md) will accept a comma-separated list of valid values, so you can do some rather powerful combos, such as publish a video (using [`&push`](source-settings/push.md)) while also viewing multiple others videos. VDO.Ninja will auto-mix the videos together into a single layout for you:

```markup
http://vdo.ninja/?push=aaa&view=bbb,ccc,ddd
```

You might notice the stream ID values I'm using (ie: `aaa`, `bbb`, etc); these can be manually created and reused. Use `&push=STREAMID` to publish a video and `&view=STREAMID` to remotely view it. If you don't manually specify a stream ID, VDO.Ninja will sometimes generate one for you.

{% hint style="info" %}
To make up a valid stream ID of your own though, keep it at 64-characters or less and use alphanumeric characters where possible.
{% endhint %}

A stream ID must also not already be in active use, else you will be provided with an error.

{% hint style="info" %}
URL fragment parameters (after `#`) are merged with normal query parameters and take precedence on conflicts. Example: `?view=A#view=B` resolves to `view=B`.
{% endhint %}

## General, sender, viewer, and director options

All of the available parameters can be seperated in five categories. You find the category on the top of the page of a parameter.

* **General Option** ([`&push`](source-settings/push.md), [`&room`](general-settings/room.md), [`&view`](advanced-settings/view-parameters/view.md), [`&scene`](advanced-settings/view-parameters/scene.md), [`&solo`](advanced-settings/mixer-scene-parameters/and-solo.md), [`&director`](viewers-settings/director.md))\
  You can use these parameters as a sender or as a viewer as well as in scenes, solo-links and rooms or even as a director.
* **Sender-Side Option** ([`&push`](source-settings/push.md))\
  You can use these parameters as a sender when you are publishing a video with `&push`. You can use these parameters in rooms ([`&room`](general-settings/room.md)) when publishing or as a basic push link outside a room. These parameters will affect the outgoing stream.
* **Viewer-Side Option** ([`&view`](advanced-settings/view-parameters/view.md), [`&scene`](advanced-settings/view-parameters/scene.md), [`&room`](general-settings/room.md), [`&solo`](advanced-settings/mixer-scene-parameters/and-solo.md))\
  You can use these parameters as a viewer of one or more video sources (scenes and solo-links in a room, as a guest in a room, or a basic `&view` stream). These parameters will affect the incoming stream(s).
* **Director Option** ([`&director`](viewers-settings/director.md))\
  These parameters are specifically for the director of a room.
* **Meshcast Option** ([`&meshcast`](newly-added-parameters/and-meshcast.md))\
  These parameters can only be used in combination with `&meshcast`. You can find them in [Meshcast Parameters](advanced-settings/meshcast-parameters/). These parameters are always Sender-Side Option, so you will find `&push` in the URL, too.
* **WHIP Option** ([WHIP and WHEP tooling](steves-helper-apps/whip-and-whep-tooling.md))\
  WHIP Parameters are specific to WHIP and WHEP. You can find them in [WHIP Parameters](advanced-settings/whip-parameters/).

## Navigating the available setting options

We've broken down the available URL parameters into 22 categories:

* [cheat-sheet-of-basic-parameters](advanced-settings/cheat-sheet-of-basic-parameters/ "mention") (the basic and most common parameters)
* [setup-parameters](advanced-settings/setup-parameters/ "mention") (stream ID, create a room, password, labels, groups, devices, auto-start, welcoming guests, sharing a website/file)
* [camera-parameters](advanced-settings/camera-parameters/ "mention") (options to pre-set the camera settings)
* [video-parameters](advanced-settings/video-parameters/ "mention") (resolution, FPS, effects, self preview, mute video, PTZ, codec, buffer, broadcasting, scale)
* [video-bitrate-parameters](advanced-settings/video-bitrate-parameters/ "mention") (changing the bitrate of the outgoing and incoming video and for rooms)
* [audio-parameters](advanced-settings/audio-parameters/ "mention") (filters, adding delay, bitrate, channels, mono/stereo, muting guests, etc.)
* [settings-parameters](advanced-settings/settings-parameters/ "mention") (language, save cookies, remote access, chat widget, chunked mode, raise hands, notify, transcription, closed captions)
* [buttons-and-control-bar-parameters](advanced-settings/buttons-and-control-bar-parameters/ "mention") (show/hide buttons, adjust the user control bar and video control bar)
* [design-parameters](advanced-settings/design-parameters/ "mention") (labels, styles, clean output, CSS, mirroring, margin, dark mode, background color, disable tallies, etc.)
* [mixer-scene-parameters](advanced-settings/mixer-scene-parameters/ "mention") (layout and design for the video mixer in rooms/scenes, preload/hidden scene bitrate)
* [director-parameters](advanced-settings/director-parameters/ "mention") (specific to the director's control room and director-specific features)
* [screen-share-parameters](advanced-settings/screen-share-parameters/ "mention") (labels, audio filters, type, bitrate, quality, etc.)
* [recording-parameters](advanced-settings/recording-parameters/ "mention") (options to specify recordings with VDO.Ninja)
* [guest-queuing-parameters](advanced-settings/guest-queuing-parameters/ "mention") (options for guest queuing and approving system)
* [meshcast-parameters](advanced-settings/meshcast-parameters/ "mention") (options for the [`&meshcast`](newly-added-parameters/and-meshcast.md) parameter like audio filters, bitrate, screen-share, codecs, etc.)
* [whip-parameters](advanced-settings/whip-parameters/ "mention") (options to specify the [`&whip`](advanced-settings/whip-parameters/and-whip.md) parameter)
* [mobile-parameters](advanced-settings/mobile-parameters/ "mention") (options to specify push links and guest invite links for mobile phones)
* [api-and-midi-parameters](advanced-settings/api-and-midi-parameters/ "mention") (hotkey features via API and MIDI)
* [turn-and-stun-parameters](advanced-settings/turn-and-stun-parameters/ "mention") (options for setting up TURN and STUN servers)
* [new-parameters.md](advanced-settings/new-parameters.md "mention") (recently added to VDO.Ninja)
* [upcoming-parameters.md](advanced-settings/upcoming-parameters.md "mention") (only on [VDO.Ninja/beta](https://vdo.ninja/beta/) and/or [VDO.Ninja/alpha](https://vdo.ninja/alpha/) version at the moment)
* [other-parameters.md](other-parameters.md "mention") (not ready for production, not intended to be used or not well-documented)

You can search for specific commands using the search bar at the top-right as well.
