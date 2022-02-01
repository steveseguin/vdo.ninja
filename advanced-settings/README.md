---
description: Understanding URL parameters and custom settings
---

# Advanced Options

## Overview

VDO.Ninja is a tool that can be seen as a mediator, negotiating a direct connection between a publishing device and a viewing device (such as [OBS \[Open Broadcaster Software\]](https://obsproject.com)). There are generally two links involved; one to push (publish) and one to pull (view), although links can be made to do both at the same time.

The viewer (receiver) and the publisher (sender) each play their own role in determining the qualities of a stream, so likewise each side has its own set of parameters available to them. A publisher can have multiple viewers access their video stream, with each viewer having the ability to customize the quality of the stream they receive.

The following guide details the options, syntax, values, and general use of these available settings/parameters; organized into three sections.

## Passing parameters via the URL to achieve your desired stream settings

You can customize the playback of videos by adding query string parameters to the VDO.Ninja URL links, along with many other aspects. VDO.Ninja is highly flexible in this regard, letting you achieve your desired outcome without needing to code and without additional software.

For example, a simple viewer URL link such as `https://vdo.ninja/?view=xxxxxxx` could be amended to `https://vdo.ninja/?view=xxxxxxx&videobitrate=500`, which will cause the viewer to receive the publisher's video stream at a video bitrate of 500-kbps.

Multiple parameters can be appended together by using the ampersand (`&`) as a separating character. For example, to view the video stream published at stream ID `xxxxxxx` at a video bitrate of 500-kbps and set the [`&stereo`](general-parameters/stereo.md) parameter to `1`:

```markup
http://vdo.ninja/?view=xxxxxxx&videobitrate=500&stereo=1
```

Some parameters, like [`&view`](viewer-parameters/view.md) will accept a comma-separated list of valid values, so you can do some rather powerful combos, such as publish a video (using [`&push`](source-parameters/push.md)) while also viewing multiple others videos. VDO.Ninja will auto-mix the videos together into a single layout for you:

```markup
http://vdo.ninja/?push=aaa&view=bbb,ccc,ddd
```

You might notice the stream ID values I'm using (ie: `aaa`, `bbb`, etc); these can be manually created and reused. Use `&push=STREAMID` to publish a video and `&view=STREAMID` to remotely view it. If you don't manually specify a stream ID, VDO.Ninja will sometimes generate one for you.

{% hint style="info" %}
To make up a valid stream ID of your own though, choose something with less than 31-characters of length and ensure it's AlpHaNuMerIc-only.
{% endhint %}

A stream ID must also not already be in active use, else you will be provided with an error.

## Navigating the available setting options

We've broken down the available URL parameters into nine parts:

* **General Settings**, which tend to settings that impact the app broadly, such as the color of the background.
* **Source Settings**, which are settings specific to publishing, so these are things related to customizing the camera and microphone.
* **Viewer's Settings**, which are aspects that are controllable by the viewer's side, which includes bitrate, codec, and layouts.
* **Director Settings**, which are specific to the director's control room and director-specific features.
* **Meshcast Settings**, which are specific to the [`&meshcast`](meshcast-parameters/and-meshcast.md) parameter.
* **API & Midi Settings**, which are specific to API & midi features.
* **Newly Added Parameters**, which have been recently added to the Docs or to VDO.Ninja.
* **Parameters only on beta**, which are parameters only on [VDO.Ninja/beta](https://vdo.ninja/beta/) version at the moment.
* ****[**Other Parameters**](other-parameters/), which are currently not ready for production or not well-documented.

You can normally find a long list of each command in the left-hand menu of this support system, although you can search for specific commands using the search bar at the top-right as well.
