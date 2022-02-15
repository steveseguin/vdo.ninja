---
description: Understanding URL parameters and custom settings
---

# Advanced Options (URL Parameters)

## Overview

VDO.Ninja is a tool that can be seen as a mediator, negotiating a direct connection between a publishing device and a viewing device (such as [OBS \[Open Broadcaster Software\]](https://obsproject.com)). There are generally two links involved; one to push (publish) and one to pull (view), although links can be made to do both at the same time.

The viewer (receiver) and the publisher (sender) each play their own role in determining the qualities of a stream, so likewise each side has its own set of parameters available to them. A publisher can have multiple viewers access their video stream, with each viewer having the ability to customize the quality of the stream they receive.

The following guide details the options, syntax, values, and general use of these available settings/parameters.

## Passing parameters via the URL to achieve your desired stream settings

You can customize the playback of videos by adding query string parameters to the VDO.Ninja URL links, along with many other aspects. VDO.Ninja is highly flexible in this regard, letting you achieve your desired outcome without needing to code and without additional software.

For example, a simple viewer URL link such as `https://vdo.ninja/?view=xxxxxxx` could be amended to `https://vdo.ninja/?view=xxxxxxx&videobitrate=500`, which will cause the viewer to receive the publisher's video stream at a video bitrate of 500-kbps.

Multiple parameters can be appended together by using the ampersand (`&`) as a separating character. For example, to view the video stream published at stream ID `xxxxxxx` at a video bitrate of 500-kbps and set the [`&stereo`](general-settings/stereo.md) parameter to `1`:

```markup
http://vdo.ninja/?view=xxxxxxx&videobitrate=500&stereo=1
```

Some parameters, like [`&view`](advanced-settings/view-parameters/view.md) will accept a comma-separated list of valid values, so you can do some rather powerful combos, such as publish a video (using [`&push`](source-settings/push.md)) while also viewing multiple others videos. VDO.Ninja will auto-mix the videos together into a single layout for you:

```markup
http://vdo.ninja/?push=aaa&view=bbb,ccc,ddd
```

You might notice the stream ID values I'm using (ie: `aaa`, `bbb`, etc); these can be manually created and reused. Use `&push=STREAMID` to publish a video and `&view=STREAMID` to remotely view it. If you don't manually specify a stream ID, VDO.Ninja will sometimes generate one for you.

{% hint style="info" %}
To make up a valid stream ID of your own though, choose something with less than 31-characters of length and ensure it's AlpHaNuMerIc-only.
{% endhint %}

A stream ID must also not already be in active use, else you will be provided with an error.

## Navigating the available setting options

We've broken down the available URL parameters into 17 parts:

* ****[**Most important Parameters**](advanced-settings/cheat-sheet-of-basic-parameters/): the basic and most common parameters
* ****[**General Settings**](advanced-settings/general-parameters/): parameters that impact the app broadly
* ****[**Source Settings**](advanced-settings/source-parameters/): parameters specific to publishing, so these are things related to customizing the camera settings
* ****[**Viewer's Settings**](advanced-settings/view-parameters/): parameters that are controllable by the viewer's side, which includes bitrate, codec, and layouts
* ****[**Director Settings**](advanced-settings/director-parameters/): specific to the director's control room and director-specific features
* ****[**Video Settings**](advanced-settings/video-parameters/): resolution, FPS, effects, bitrate, self preview, mute video, PTZ, codec, buffer, scale
* ****[**Audio Settings**](advanced-settings/audio-parameters/): filters, adding delay, bitrate, channels, mono/stereo, muting guests etc.
* [**Setup Settings**](advanced-settings/setup-parameters/): password, labels, groups, devices, auto-start, welcoming guests, sharing a website/file
* ****[**Design Settings**](advanced-settings/design-parameters/): labels, styles, clean output, CSS, mirroring, margin, darkmode, background color, disable tallies etc.
* [**Mixer/Scene Settings**](advanced-settings/mixer-scene-parameters/): layout and design for the video mixer in rooms/scenes, preload/hidden scene bitrate
* ****[**Screen-share Settings**](advanced-settings/screen-share-parameters/): labels, audio filters, type, bitrate, quality etc.
* ****[**Meshcast Settings**](advanced-settings/meshcast-parameters/): options for the [`&meshcast`](newly-added-parameters/and-meshcast.md) parameter like audio filters, bitrate, screen-share, codecs etc.
* ****[**API & MIDI Settings**](advanced-settings/api-and-midi-parameters/): hotkey features via API and MIDI
* [**TURN & STUN Settings**](advanced-settings/turn-and-stun-parameters/): options for setting up TURN and STUN servers
* ****[**Newly Added Parameters**](advanced-settings/newly-added-parameters/): recently added to the Docs or to VDO.Ninja
* ****[**Parameters only on beta**](advanced-settings/parameters-only-on-beta.md): only on [VDO.Ninja/beta](https://vdo.ninja/beta/) version at the moment
* ****[**Other Parameters**](other-parameters.md): not ready for production, not intended to be used or not well-documented

You can search for specific commands using the search bar at the top-right as well.
