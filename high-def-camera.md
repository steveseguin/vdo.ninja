---
layout:       post
title:        "High-def camera"
date:         2020-12-16 10:00:00 +0000
author:       "Steve Seguin"
categories:   hd
tags:         tag1 tag2
permalink:    high-def-camera
order:        3

# POSTS LIST
class:       "style2"                         # config bg-color to post list card (1..6)
list-image:  "/assets/images/pic02.jpg"       # config image to post list card (1..6)
description: >                                # config description to post list card
  Get your camera inside OBS.ninja quickly

# POST HEADER
header-image: "/assets/images/pic13.jpg"      # config image to post header
alt-image:    "image description test post a" # config image description to alt att.
---

You can customize the playback of videos by added parameters to the OBS.Ninja URL links, along with many other aspects. OBS.Ninja is highly flexible in this regard, letting you achieve your desired outcome without needing to code and without additional software.

For example, `https://obs.ninja/?view=xxxxxxx`, could be amended to `https://obs.ninja/?view=xxxxxxx&bitrate=500`, which will target a video bitrate of 500kbps.

Multiple parameters can be appended together by using the separating charater "&".

`http://obs.ninja/?view=xxxxxxx&bitrate=500&stereo=1`

You might notice the Stream ID values we are using (ie: aaa, bbb, etc); these can be manually created and reused. Use &push=STREAMID to publish a video and &view=STREAMID to remotely view it. If you don't manually specify a stream ID, OBS.Ninja will sometimes generate one for you.

To make up a valid stream ID of your own though, choose something with less than 31-characters of length and ensure it's AlpHaNuMerIc-only. A stream ID must also not already be in active use, else you will be provided with an error.