---
description: Find where audio stops: at the microphone, in the browser, or in OBS.
---

# Audio over VDO.Ninja isn't working

Start at the microphone, then check the receiving device. Speak while checking the meters so you can see where the sound stops.

1. **On the sender:** select the intended microphone and make sure it is unmuted. Its audio indicator should move when you speak.
2. **In a receiving browser:** open the viewer link, click the page if playback needs permission, and check the computer's volume and output device.
3. **In OBS:** use the steps below. A moving OBS meter means audio is reaching OBS, even when you cannot hear it in your headphones.

### OBS isn't set to capture audio

1. Double-click the VDO.Ninja Browser Source in the **Sources** list.
2. Enable **Control audio via OBS** and select **OK**.
3. Speak into the sending microphone and watch the source's meter in OBS's **Audio Mixer**. Make sure it is unmuted.
4. Make a short OBS recording and play it back to check the recorded sound.

<figure><img src="../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1).png" alt="OBS Browser Source properties with Control audio via OBS highlighted"><figcaption><p>Enable this checkbox in the Browser Source properties.</p></figcaption></figure>

To hear the source locally, open **Advanced Audio Properties** from the mixer and choose **Monitor and Output** for that source. Use headphones to avoid feedback.

### External USB / Lightning audio

On a phone, start with the [VDO.Ninja native app](../steves-helper-apps/native-mobile-app.md#usb-audio):

1. Connect the microphone before opening Publishing Settings.
2. Select it in the microphone list. Tap **Refresh Mics** if a newly connected device is missing.
3. Start the stream and check the receiving audio. If the device is still missing, try a compatible adapter or powered hub.

On iPhone or iPad, reopen Publishing Settings after connecting the microphone so the app sees the new audio route.

### If using the native mobile app

For screen-share audio:

* **Android 10+:** enable **Capture System Audio** before starting **SCREEN**. The captured app must allow audio capture.
* **iPhone or iPad:** check the separate app-audio and microphone mutes. For narration, also enable the microphone in Apple's broadcast controls.

Protected content may block capture. See the [screen-sharing steps](../steves-helper-apps/native-mobile-app.md#screen-sharing).

### Sample rates or invalid audio settings

If the sender's meter moves but a Windows computer cannot play the feed:

1. Check the selected speaker or headphones in Windows and in VDO.Ninja.
2. Open the device's sound properties. Try **48,000 Hz**, **16-bit or 24-bit**, and stereo playback if those options are available.
3. Reopen the viewer and try again. If you use Bluetooth, compare with wired headphones.

<figure><img src="../.gitbook/assets/image (4) (9).png" alt="Windows sound device Advanced tab showing 24-bit, 48000 Hz" width="360"><figcaption><p>Example Windows playback format. The available choices depend on the device.</p></figcaption></figure>

### OBS may be having a max buffer issue

If audio worked and then stopped or became distorted, finish any active recording or broadcast before restarting OBS. Close unnecessary sources and apps, then check again.

### Echo cancellation

Echo cancellation can remove sound that it mistakes for feedback. Try headphones first. For music or a mixer feed, compare the audio-processing settings and see [echo or feedback fixes](echo-or-feedback-issues.md).

### Not all playback devices support audio

If a dedicated player shows video without sound, compare the same viewer link in a desktop browser. Check that player's audio and browser-source support before changing the sender.

### Guests can't hear each other in a room

If only some guest-to-guest connections are silent, use the director's [Guest Audio Recovery and Mesh Debug guide](../guides/mesh-network-debug.md).
