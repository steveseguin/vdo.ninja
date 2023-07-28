# How to send the audio/video output of one OBS to another OBS using VDO.Ninja

In this walk-through we demonstrate how to use VDO.Ninja to stream a low-latency video/audio stream from one OBS Studio to another remote OBS Studio.

{% embed url="https://youtu.be/Ze1q6Qof2r0" %}

#### Requirements

* OBS Studio
  * For some Linux or older systems, you may need a virtual camera plugin as well
* A virtual audio cable
  * For Windows, use VB-CABLE Virtual Audio
    * This is recommended software as it enables proper audio support
    * The software is Donationware
    * [https://www.vb-audio.com/Cable/](https://www.google.com/url?q=https://www.vb-audio.com/Cable/\&sa=D\&source=editors\&ust=1658835550127888\&usg=AOvVaw1mgCACykvK7pkvmteZz-Mj)
  * For MacOS, you have a few choices:
    * [https://github.com/steveseguin/obsninja/wiki/FAQ#how-to-capture-audio-on-mac](https://www.google.com/url?q=https://github.com/steveseguin/obsninja/wiki/FAQ%23how-to-capture-audio-on-mac\&sa=D\&source=editors\&ust=1658835550128112\&usg=AOvVaw07GMfUuAZJy6FI8EYhOdd1)

#### Basic Workflow Diagram

Please find below a diagram explaining the basic premise of what we are intending to do in this guide. We will go through it all, one step at a time.

![](https://lh3.googleusercontent.com/hqQhbNUaiXIdsR3-jKUVySOwgG7ds07QPKZJVbhapaTNyvoWp1EHXA-pPJqlO15TKGaoZdNA1UATly8Ed2-5bu4zXm5mf4rnj\_q3rMbOpWTrh1Y1mx9I3b\_ryVAI9pd\_0uU6Hs41Q5mbkDY)

#### Step 0.

This guide assumes you have OBS installed, along with the other required software, though we shall briefly cover these initial installation steps now.

1. Install OBS Studio (or StreamLabs, etc)\
   [https://github.com/obsproject/obs-studio/releases/](https://github.com/obsproject/obs-studio/releases/)
2. Install the VB-Cable Virtual Audio device.\
   [https://vb-audio.com/Cable/](https://vb-audio.com/Cable/)

If you are on Mac, you can consider Loopback as a premium alternative option, if having problems.

#### Step 1

We now need to create a virtual webcam so we can connect OBS to VDO.Ninja. If we followed the initial software setup of Step 0 correctly, this should be all smooth sailing.

Just press START VIRTUAL CAM in OBS v26 or newer.

#### Step 2

We will now configure OBS to output audio from the Browser Source to the Virtual Audio Cable. In the OBS settings, under Advanced, we select the Monitoring Device to be our Virtual Audio device. (CABLE Input).

We also want to disable Windows audio ducking.

![](https://lh6.googleusercontent.com/O0bHw4kwdhys0MLhsQIsLQx-\_GUvd-xpFD7gILaMBSVwKlgmXMG2y\_yhQdMfF-jgugFmbgco7XM\_uFhQMY9oBOqDIz6VNhxXXgQhBh3Qhj6qPugObOW3O5KmAdCNG5Bg682NBfSEW-HKGKU)

#### Step 3

In our last configuration step, we want to go into the Advanced Audio Properties in OBS. When there, we want to set up the Audio Monitoring setting to have any audio we want pushed to the Virtual Audio Cable to be set to MONITOR AND OUTPUT.

![](https://lh6.googleusercontent.com/rlcZugNaCwarzH2x08EATZJ17q4\_LwozJv2ulOyigTmONkyCqaxBTLKlfbvy1BBVKEUD3BUnADQWOrLbYYYCjmu0q854BeFaccKWow1533U0mr0mDnMAq3NbnPrvYsx8YDx8XFCbGpERGxE)

#### Step 4

We’re ready to now create our VDO.Ninja stream.

There are many ways to do this, but the EASIEST way is to go to VDO.Ninja, click Add your Camera to OBS, and select from the options OBS Virtualcam. This option will set you up with the default settings, such as with audio echo-cancellation on, although you can use URL parameters when visiting VDO.Ninja to customize the settings more.

{% hint style="info" %}
A popular advanced URL option at this point might be with the stereo flag, so visit [https://vdo.ninja/?stereo](https://vdo.ninja/?stereo) instead of just [https://vdo.ninja](https://vdo.ninja). You can also set your own custom stream ID values, so [https://vdo.ninja/?push=myCustomStreamId123](https://vdo.ninja/?push=myCustomStreamId123), and then give your remote OBS user the link [https://vdo.ninja/?view=myCustomStreamId123](https://vdo.ninja/?view=myCustomStreamId123)![](https://lh3.googleusercontent.com/NuZ8o9ot8Uqcm2SsCSP-X11N4aPkcHYaV0enXMsDdgYdfddXsKbt320HHWM-eK-WjDzxxeXEMx75idJnJKmpxIxnC9DcMeyZ2sy35i6gka2lSGn\_mdsURHGmK3jMNSK\_I3b9C\_1Ck5IEZrU)
{% endhint %}

#### Step 5

You can select the Virtual Audio Cable from the audio choices, or instead, you can select your local microphone or multiple audio input sources.

VDO.Ninja will auto-mix if more than one option is selected. Hold `CTRL` (or `command`) to select more than one option.

![](https://lh4.googleusercontent.com/IK0U5Drf61V28WYGWLPrxN2gjRan-tX\_NNHdZV3xcKSoFwzuzPZl1nNuTlPyWxcrh0kM7rDJAO4WPGG6HUbhO8Fhh3zwdP5JRKLlJCXZmN5bn-flY175uD4IOCx3Q4RnhcyLoRmrdGuP5Dc)

#### Step 6

Press the green button when ready.

You’ll see a preview of your video stream and a link. This link is what we want to send to our remote OBS studio as an input source.

We can modify this link if we wish to have higher bitrates, for example, [https://vdo.ninja/?view=streamID\&videobitrate=20000](https://vdo.ninja/?view=streamID\&videobitrate=20000) to set a target video bitrate of 20-mbps.

![](https://lh5.googleusercontent.com/y4-K-FYPET5a-TEswgl\_FE-2IU5oSIMXH9o2lyjydhNZAqdIvussPvXS19BUmW2lte8fxDfw8dMyt5JT9H8TslLhNJfO5KTJB4xmsHbwSU7Ofq5xP2NU7fuxlPsZkgT82P6T1JxV5MzXdrM)

#### Step 7

We send this VDO.Ninja view URL to our remote OBS Studio computer and now we use it to ingest the feed into the OBS there.

To do this, we create a scene and then a Browser Source in OBS. Give it a name and we will fill out the details in the next step.

![](https://lh3.googleusercontent.com/-FvXnmuJ3YnuARZCWSh7HvXCjypC3\_aUrynSj\_7\_w7s4aeC\_67qGK5GfResjT91ol1D3wftGZrMwjtF1jVEtruVs0JA1GwUMGzip44NC2CuiE3G3T7a\_M\_udNYt4yJnfOk42JiRwzTj34c8)\


#### Step 8

In the properties for the Browser Source, we need to fill out a few fields and then hit OK.

* The URL needs to be set to the address we created earlier, ie: [https://vdo.ninja/?view=q3QCScW](https://vdo.ninja/?view=q3QCScW)
* Width needs to match the input video resolution, so likely 1280
* The height also needs to match, so likely 720
* _**Control audio via OBS**_ should be checked, for audio capture to function

![](https://lh6.googleusercontent.com/72c\_PKWSl2peJ3L8cGnBqZcl9YAv9xvFfgzp3PXjsSpRPq0k1Ahbka3XKO27LK3DMglV0WP8APNYPdjCumRTUiJw\_V19CvWFcIKRH-Hi218IwWLGsssFSxHmRiOXBfTU44HSHf2P1hyKe3s)

SECRET TIP: Some links on VDO.Ninja can be dragged and dropped directly into OBS, avoiding the tedious parts of this step.

#### Step 9

Once you hit OK, the video should appear and auto-play within seconds. There should be no audio feedback if you selected the Control audio via OBS option.

Now we just need to stretch the video to fill the full scene. It should snap into place when full.

![](https://lh5.googleusercontent.com/a1jBOf6j\_2py-tFMieJ2LoXTBv8\_ECEq-KgCQHGslz6sG5BwnN5eVcjwXgaoNmCygnyL-rzt0QPcNvQcyf-Wk4wJ2VHnICKHR\_fwiayS5iCrVrN0yT\_HsLm6Bkc7wvv8fRBZF7mw62eosyM)

All done! And that should be it! Problems?

You can also ask for help on [Discord](https://discord.vdo.ninja/); usually help can be provided within minutes, if not usually within half a day.

### WHIP Output

Newer versions of OBS may also support WHIP output, which VDO.Ninja also supports. While the Virtual Camera might be the better option for many, details on [WHIP are here](../advanced-settings/mixer-scene-parameters/and-whip.md).
