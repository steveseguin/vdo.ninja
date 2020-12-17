---
layout:       post
title:        "OBS.ninja basics"
date:         2020-12-16 10:00:00 +0000
author:       "Steve Seguin"
categories:   basic
tags:         basics
permalink:    basics
order:        1

# POSTS LIST
class:       "style1"                         # config bg-color to post list card (1..6)
list-image:  "/assets/images/pic01.jpg"       # config image to post list card (1..6)
description: >                                # config description to post list card
  How stuff works

# POST HEADER
header-image: "/assets/screenshots/Site.png"      # config image to post header
alt-image:    "image description test post a" # config image description to alt att.
---
OBS.Ninja, from this point on: obsn, needs 2 thinks to work:
  - Someone pushing a video feed out from their device
  - Someone viewing that video feed

Enter obs.ninja. Click `Add your camera to OBS`.
Select your device from the list of devices your browser supports.

<figure>
<img src="{{site.url}}/assets/screenshots/camera-picker.jpg"/>
<figcaption>Camera picker window in OBS.Ninja</figcaption>
</figure>

You will see the video feed of the device on screen, and at the top of the screen a 'view' link.

Copy this view link and send it to someone you want to have access to this feed, or place it inside a 
OBS browser source.

![OBSN view link](/assets/screenshots/view-link.jpg)

{:.warning}
OBSN is a peer-to-peer system. This means for each new person viewing your feed, a new encode is processed. It also is CPU bound since encoding usually takes place on the CPU. Take care not to overload your system. Keep an eye on your CPU usage.
