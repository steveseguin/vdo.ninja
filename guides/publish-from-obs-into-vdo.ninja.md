---
description: How to share audio and video from OBS Studio into VDO.Ninja
---

# Publish from OBS into VDO.Ninja

In this walk-through we demonstrate how to use VDO.Ninja with the OBS Virtual camera and Virtual Audio Cable.\
\
This combination is powerful and opens the world to numerous new live show formats.  You could also push back audio and/or video from OBS into VDO.Ninja to share with a group there, or into a large Zoom call, all with super low latency.\
\
Combining this OBS to VDO.Ninja approach with \&broadcast mode or a server-assisted approach, you can enable larger room sizes, with around 10 to 30 people in a room being feasible.

#### Requirements

* OBS Studio v26 or newer
  * This ideally will run on OBS on the same system as VDO.Ninja
  * For Windows, OBS version 26 or newer is recommended: [https://obsproject.com/download](https://www.google.com/url?q=https://obsproject.com/download\&sa=D\&source=editors\&ust=1626144550329000\&usg=AOvVaw1SHwecfzt\_otZPz1YNkN3r)\

* Virtual Audio Cable Software               &#x20;
  * For Windows or Mac, you can use VB-CABLE Virtual Audio
    * This is recommended software as it enables proper audio support
    * The software is Donationware
    * [https://www.vb-audio.com/Cable/](https://www.google.com/url?q=https://www.vb-audio.com/Cable/\&sa=D\&source=editors\&ust=1626144550330000\&usg=AOvVaw3F2QQT0F6uzv1rHBdsARNF)\

    * There's also Voicemeter or VAC available as good options on PC.
    * For macOS, you have a few other good choices too:
      * [https://github.com/steveseguin/vdo.ninja/wiki/FAQ#how-to-capture-audio-on-mac](https://www.google.com/url?q=https://github.com/steveseguin/obsninja/wiki/FAQ%23how-to-capture-audio-on-mac\&sa=D\&source=editors\&ust=1626144550330000\&usg=AOvVaw1Rzm5d\_ud17CiLByYZ66lb)

### Step 0.

This guide assumes you have OBS installed, along with the other required software, though we shall briefly cover these initial installation steps now.

\
We also will assume you are using Windows. You will need to adapt accordingly for macOS, which likely is going to be more complicated.

On the computer that will be using Zoom or Google Hangouts to broadcast, please do the following:

1. Uninstall and remove all old versions of OBS, including StreamLabs OBS if that is installed.
2. Install OBS Studio v26 or newer  h[ttps://github.com/obsproject/obs-studio/releases/](https://www.google.com/url?q=https://github.com/obsproject/obs-studio/releases/\&sa=D\&source=editors\&ust=1626144550332000\&usg=AOvVaw1bxku67pfwg38PkVD7xtUZ)
3. Lastly, install the VB-Cable Virtual Audio device \
   [https://www.vb-audio.com/Cable/](https://www.google.com/url?q=https://www.vb-audio.com/Cable/\&sa=D\&source=editors\&ust=1626144550333000\&usg=AOvVaw1V70Tdr32UiXMUJZ0Uysnb)

### Step 1.

Start the OBS Virtual camera ; located under the Start Recording button

![](https://lh6.googleusercontent.com/BpQBnUERL-YK5ZlvYTP-bR3233Cmhuaq8aMU3lh\_1mImDzyk25u-hJVgYmwtlA1PMfAsrL2zVMRZrXa\_AFfT8IuxxLr7baDzASq9A4NTStOwmehduDh3GpXprq0Eknhg1tk-HCH3)

### Step 2

We will now configure OBS to output audio from the Browser Source to the Virtual Audio Cable.  In the OBS settings, under Advanced, we select the Monitoring Device to be our Virtual Audio device. (CABLE Input).  \
\
We also want to disable Windows audio ducking.

![](https://lh5.googleusercontent.com/jP-gdnyijHCUCO3sDiCckh84K2XyHDo-piOZXGv\_\_gDWW4sSOtURMn86GGGdBI4F-mHnXg0Nl\_Xx-K9u0L-g\_n3Wu1WnyA803FUl0VpXe5Q27xCwr6x6i02dkTRebGeSGkFhWYbj)

### Step 3

In our last configuration step, we want to go into the Advanced Audio Properties in OBS. When there, we want to set the audio sources we want to output have its Audio Monitoring setting be set to Monitor and Output.\
\
If you intend to feed audio from OBS back into an VDO.Ninja group call, you can use this step to also mix-minus the audio; selecting just the audio sources you want the remote guests to hear, excluding their own audio to prevent echo.\
\


![](https://lh3.googleusercontent.com/772ztsgbSiy\_1wb-Y83MwD3s9A7M1Xy9Ndoag8TiKZO74ROCNqYa3M6PGhFSCq6rsziOYvtDVj84gVWy7EKJKoYOk377ZSoOteqWE\_yf8NeJmyzGokpKmvuT0KvELL2O7iS\_SpiC)

![](https://lh5.googleusercontent.com/9DPFjFvS9Hiab\_tcoA4TLG93mvlj-qqZi4bBrBoJWX3CkHQ5p54Q1fG8ijSgHGabLdS22X2W4b0zQ87NWRUXZ2VU37uyvAe-\_QFyMDNicZ8anw\_bYqeHaXDs3bG2h3DFJhKEqCYh)

### Step 4

We’re READY to go!  Using this setup we can publish from OBS into VDO.Ninja with near zero latency; going forward it's just like selecting a second Webcam and microphone.

If you are already in VDO.Ninja, you can switch between your webcam and the virtual camera and normal camera in the settings. If you're a director of a room in VDO.Ninja, you can even share you audio and video from OBS into a room and not have it show up in any scene; just have it been seen by guests.\
\
It is important to remember that you need to select the VB-Audio Virtual Cable in the call as well, if you also want to share the audio from it that is. \
\
If publishing to VDO.Ninja, remember that you can select multiple audio sources in VDO.Ninja by holding down CTRL (or command) when selecting them. You could include the VB Audio Cable and your local microphone together, for example.\


![Example of how things look in VDO.Ninja when selecting OBS Virtualcam + VB Cable](<../.gitbook/assets/image (80).png>)

\
All done! You can switch between the webcam and the OBS live video as needed.
