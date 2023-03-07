---
description: Window sharing into Zoom with the Electron Capture app
---

# How to stream into Zoom without OBS

This guide will let you stream video from VDO.Ninja into Zoom as a window share (screen share).

Window sharing into Zoom allows for higher quality video into Zoom, but it may also result in lower frame rates. In this guide, we will assume you are using a VDO.Ninja group room with the desire to share a group scene with Zoom.  Sharing a group scene is not required though.

We will be using some software to make window sharing into Zoom more effective and clean. It is technically optionally.

#### Alternative approach for sharing video into Zoom

There is another guide for publishing from VDO.Ninja into Zoom using OBS Studio, which will have the video appear as a webcam in Zoom.  As a webcam source, the video will be smooth, but the resolution will be relatively low.\
\
Check out that guide below:

{% content-ref url="use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md" %}
[use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md](use-vdo.ninja-as-a-webcam-for-google-hangouts-zoom-and-more.md)
{% endcontent-ref %}

## Let's get started

### Step 1.

Go to [https://vdo.ninja/](https://vdo.ninja/)

### Step 2.

Click the Add Group Chat to OBS button.

If we were looking to just share our camera, and not a group scene, we could instead just use "Add your Camera to OBS". This guide will assume you are using a group scene though.

<figure><img src="../.gitbook/assets/image (17) (4).png" alt=""><figcaption></figcaption></figure>

### Step 3.

Enter a room name.

Also, check "The director will be performing as well..", so that we can add our local camera and microphone to Zoom as well, if desired.

Then click the Enter the Room’s control Center.  We should then enter the “director’s control center”.

<figure><img src="../.gitbook/assets/image (23).png" alt=""><figcaption></figcaption></figure>

### Step 4.

In the director's control center, click the **COPY LINK** button for the **GUEST INVITE** box.

We want to send this link to our guests. The can use this link to **JOIN** the room with their camera.

If we want to join the room ourselves, we can also join as a guest, or we can do so as the director. Since our camera might be in use by Zoom currently, we can add ourselves a bit later on instead

<figure><img src="../.gitbook/assets/image (22) (1).png" alt=""><figcaption></figcaption></figure>

### Step 5.

As guests join the room, they will see each other and be able to talk to each other.

The director of the room will also see each guest in the control center as they join.

<figure><img src="../.gitbook/assets/image (34).png" alt=""><figcaption></figcaption></figure>

### Step 6.

If we copy the **CAPTURE A SCENE LINK** in the director's room, and we open it in a new Chrome tab, we should be able to see all the guests in the room on that page.

<figure><img src="../.gitbook/assets/image (31).png" alt=""><figcaption></figcaption></figure>

We can technically screen share this browser tab into Zoom, especially if we joined Zoom via Chrome also. We will continue this guide assuming you want to share into Zoom via the Electron Capture app however, which offers some performance advantages.

Since we will be using the Electron Capture app instead, we can close the scene link page in our browser after we validated that it works.  We will however still use the link we copied in an upcoming step.

### Step 7.

Next, we **download the** [**Electron Capture app**](../steves-helper-apps/electron-capture.md) – [https://github.com/steveseguin/electroncapture/releases](https://github.com/steveseguin/electroncapture/releases) (free)

The Electron Capture will let us share our video into Zoom without any borders and allow us to capture the audio. It also is optimized in resolution for maximum quality transfer from VDO.Ninja to Zoom.

### Step 8.

While it might be possible to capture audio another way, in this guide we will also use a Virtual Audio Cable application to bring the audio into Zoom.

Download and install VB Cable for Windows or macOS - [https://vb-audio.com/cable](https://vb-audio.com/Cable) (Donationware).

{% hint style="info" %}
**Tip**: When installing VB Cable, on PC, you will want to extract the files, and run the installer in administrator mode.
{% endhint %}

### Step 9.

Open the Electron Capture app.

We now can put our GROUP SCENE link in Electron Capture's top input field.&#x20;

The AUDIO OUTPUT DESTINATION needs to point to the Virtual Audio Cable.&#x20;

Once ready, press GO to load our VDO.Ninja video.

<figure><img src="../.gitbook/assets/image (29).png" alt=""><figcaption></figcaption></figure>

### Step 10.

All the audio should be sent to VB Cable, so you won't hear anything if setup correctly.

While you can resize the Electron Capture app, it's best to run it at 1280x720, which is the default resolution. You can change resolutions by right-clicking the app, along enabling other options, such as pinning the app on top of all others.

The top \~ 5% of the app is draggable, so you click on its top and move it around. The app is frameless, so when window-sharing it into Zoom, the output is clean and exactly 720p resolution.

### Step 11.

To share the video with Zoom, we screen share within Zoom, selecting the the Electron Capture app as the window we want to share.

### Step 12.

To share our Audio with Zoom, we change our MICROPHONE source in Zoom to be the VB Audio Cable.&#x20;

### Step 13.

Lastly, in Zoom, we ensure the ORIGINAL AUDIO SOURCE option (no echo cancellation), so we can capture the best audio quality possible.

### Step 14.

We can close the director's room if want to at this point, however keeping it open gives you control over the room, allowing you to kick and mute guests as needed.

If we want to include our own microphone and video to the stream, we can also do so via the Director's control center, clicking "enable director's microphone or video" button. We can select our microphone/video that way.

If we do close the director's control center though, we can still add our audio and video to the stream by joining the room as a guest, using the guest invite link we looked at previously.

<figure><img src="../.gitbook/assets/image (18) (2).png" alt=""><figcaption></figcaption></figure>

### Need help?

If stuck, join our Discord support server at [https://discord.vdo.ninja](https://discord.vdo.ninja).

### More information

More on the **ROOM** here:

[Getting started: The Room (VDO Ninja Podcast ep02)](https://youtu.be/m1cIT1kdlEo)

More on **Advanced settings** here:

[Getting started: Power Parameters (VDO Ninja Podcast ep06)](https://youtu.be/l9BNTTNY08s)
