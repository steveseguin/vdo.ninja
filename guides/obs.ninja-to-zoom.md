# OBS.Ninja to Zoom

This guide will take you from having a single or multiple guests in a room and have the output fed to zoom. This includes routing video and audio and managing your guests.

### Step 1

Go to https://VDO.Ninja

### Step 2

Click the Add Group Chat to OBS button.

![Group Chat](<../.gitbook/assets/obs group chat>)

### Step 3

Enter a room name and then click the Enter the Room’s control Center.\
This is the “director’s control center”.

![Create room](<../.gitbook/assets/create room>)

### Step 4

Click the **COPY LINK** button for the **GUEST INVITE** box. We want to send this link to our guests. The can use this link to **JOIN** the room with their camera

![Copy link room](<../.gitbook/assets/room copy link>)

### Step 5

As guests join the room, they will see each other and be able to talk to each other.\
The director of the room will also see each guest in the control center as they join.

![Copy link room](<../.gitbook/assets/room add to scene>)

### Step 6

The **SCENE LINK: MANUAL** is the **OUTPUT** of the show that we want to capture. We can copy this link and press the ADD TO SCENE button in the control center for each guest. As we press the button, the guests will appear in the SCENE link that we just opened.

![Copy link room](<../.gitbook/assets/room scene link manual>)

### Step 7

If we open the **SCENE LINK** in chrome we can view it to confirm it worked. We can close it and **REMOVE** the guests from the scene as well.

![Copy link room](<../.gitbook/assets/room scene link>)

### Step 8

Next, we **download the Electron Capture app** – [https://github.com/steveseguin/electroncapture/releases](https://github.com/steveseguin/electroncapture/releases)

The Electron Capture will let us share our video into Zoom without any borders and allow us to capture the audio. It also is optimized in resolution for maximum quality transfer from VDO.Ninja to Zoom.

### Step 9

We also want to download and install a Virtual Audio device: https://rogueamoeba.com/loopback/ (macOS & non-free, but excellent) and [https://existential.audio/blackhole](https://existential.audio/blackhole) (macOS & free) [https://vb-audio.com/Cable](https://vb-audio.com/Cable) VB Cable for Windows or macOS - (Donationware)

### Step 10

We now can put our SCENE link in Electron Capture (and close the previous SCENE link page we opened). The AUDIO OUTPUT DESTINATION needs to point to the Virtual Audio Cable. Press GO when ready.

![Copy link room](<../.gitbook/assets/electron size>)

### Step 11

We now **ADD TO SCENE** the guests we want. They should appear in the Electron Capture window.

### Step 12

We go to ZOOM and we SCREEN SHARE the Electron Capture app window

### Step 13

In Zoom, we change our MICROPHONE source to be the VB Audio Cable

### Step 14

Lastly, in Zoom, we ensure the ORIGINAL AUDIO SOURCE option (no echo cancellation), so we can capture the best audio quality possible.

### Step 15

We can now use the Director Room to control who is in the scene, who is muted, and even join the room ourselves.

### More information

More on the **ROOM** here: [Getting started: The Room (VDO Ninja Podcast ep02)](https://www.youtube.com/watch?v=m1cIT1kdlEo\&list=PLWodc2tCfAH1WHjl4WAOOoRSscJ8CHACe\&index=5)

More on **Advanced settings** here: [Getting started: Power Parameters (VDO Ninja Podcast ep06)](https://www.youtube.com/watch?v=l9BNTTNY08s\&list=PLWodc2tCfAH1WHjl4WAOOoRSscJ8CHACe\&index=9)

And [https://params.obs.ninja](https://params.obs.ninja/)
