---
description: Send an OBS scene and its audio to another computer with VDO.Ninja, then receive it as an OBS Browser Source.
---

# How to send the audio/video output of one OBS to another OBS using VDO.Ninja

The sending computer uses **OBS Virtual Camera + a virtual audio cable**. The receiving computer loads the VDO.Ninja **view link** in an OBS Browser Source.

Install [OBS Studio](https://obsproject.com/download) on both computers. Install [VB-CABLE](https://vb-audio.com/Cable/) on the sender for audio; Mac users can use the [macOS audio options](../platform-specific-issues/macos.md#capturing-audio).

## 1. Start the sending camera

Select the OBS scene you want to share, then click **Start Virtual Camera**.

<figure><img src="../.gitbook/assets/obs-audio-guides/start-virtual-camera.png" alt="Start Virtual Camera highlighted in the OBS Controls dock" width="330"><figcaption><p>No OBS streaming output is needed. Image: <a href="https://obsproject.com/kb/virtual-camera-guide">OBS Project</a>.</p></figcaption></figure>

## 2. Send OBS audio into the cable

Open **Settings → Audio → Advanced**. Set **Monitoring Device** to **CABLE Input** and apply the change.

<figure><img src="../.gitbook/assets/obs-audio-guides/monitoring-device.png" alt="OBS Monitoring Device set to CABLE Input"><figcaption><p>This setting is on the Audio page, inside its Advanced section.</p></figcaption></figure>

Right-click the **Audio Mixer → Advanced Audio Properties**. For each source to share, choose **Monitoring Enabled** in OBS 32.2, or **Monitor and Output** in older versions.

<figure><img src="../.gitbook/assets/obs-audio-guides/advanced-audio-properties.png" alt="Game Audio monitoring enabled with Discord and Microphone monitoring off"><figcaption><p>Only monitored sources enter the cable. This example sends game audio without voices.</p></figcaption></figure>

Keep the receiving feed out of this cable to prevent an audio loop. For individual application capture, follow the [audio guide](share-obs-audio-with-vdo-ninja.md).

## 3. Publish through VDO.Ninja

On the sender, open [VDO.Ninja](https://vdo.ninja/) and choose **Add your Camera to OBS**. Select **OBS Virtual Camera** and **CABLE Output**, then click **START**.

<figure><img src="../.gitbook/assets/obs-audio-guides/vdo-camera-and-audio.png" alt="VDO.Ninja device picker with OBS Virtual Camera and CABLE Output selected" width="494"><figcaption><p>The virtual camera supplies video; the cable supplies audio.</p></figcaption></figure>

Copy the resulting **view link** to the receiving computer. Leave the publishing tab open.

For music or game audio, add [`&proaudio=1`](../advanced-settings/audio-parameters/and-proaudio.md) to both the publishing and viewing links to preserve stereo and avoid voice processing. Use headphones when speaking.

## 4. Add the view link to the receiving OBS

In the receiver's **Sources** dock, click **+ → Browser**, create a source, and paste the sender's view link into **URL**. Set the browser canvas to the intended size, such as **1920 × 1080**, and check **Control audio via OBS**.

<figure><img src="../.gitbook/assets/obs-audio-guides/obs-receive-audio.png" alt="OBS Browser Source URL, Width 1920, Height 1080, and Control audio via OBS checked"><figcaption><p>Paste your own view link. Width and Height set the browser canvas, not the sender's capture resolution.</p></figcaption></figure>

Click **OK**, then right-click the source and choose **Transform → Fit to Screen**. Check the picture, audio meter, and a short recording.

If you also want to listen locally, set the receiving OBS's Monitoring Device to your headphones and enable monitoring for this Browser Source. Otherwise, monitoring can stay off while the sound goes to your stream or recording.

## More options

* [Fixed camera scenes and switching between two players](share-obs-virtual-camera-and-audio.md)
* [Control video quality and bitrate](how-do-i-control-bitrate-quality.md)
* [Publish directly with WHIP](from-obs-to-vdo.ninja-using-whip.md)

### Video walkthrough

The video uses an older OBS layout; the screenshots above show the current controls.

{% embed url="https://youtu.be/Ze1q6Qof2r0" %}
