---
description: Let guests in VDO.Ninja Live Studio see your OBS Program output using OBS Virtual Camera and the Director return invite option.
---

# Return OBS video to guests in Live Studio

Use [Live Studio](https://vdo.ninja/studio/) to manage guests while they watch the finished picture from OBS. The **Director** button at the top right opens the director controls inside Studio.

The video path is: **Guest cameras -> OBS -> OBS Virtual Camera -> Live Studio's director camera -> guests.**

## 1. Bring the guests into OBS

If OBS already receives your guests, keep that setup. Otherwise, enter your room in Live Studio, open **Output**, and copy the **Scene link** into an OBS **Browser Source**.

<figure><img src="../.gitbook/assets/live-studio-obs-return/output-scene-link.png" alt="Live Studio Output tab with the Scene link and its copy button" width="334"><figcaption><p>Use the Scene link for OBS. Keep the Live Studio page open in your browser.</p></figcaption></figure>

Keep the director's return camera out of the OBS scene. Do not add `&showdirector` to this setup or capture the Studio window inside OBS: that can create a repeating picture.

## 2. Start OBS Virtual Camera

In OBS's **Controls** dock, open the **gear beside Start Virtual Camera**. Set **Output Type** to **Program (Default)** and click **OK**. This sends the picture OBS is publishing. If OBS is in Studio Mode, use **Transition** to send changes from Preview to Program.

<figure><img src="../.gitbook/assets/obs-audio-guides/virtual-camera-program.png" alt="OBS Virtual Camera settings with Program Default selected" width="398"><figcaption><p>Choose Program for the live picture. Preview would show your edits before they go live.</p></figcaption></figure>

Click **Start Virtual Camera**. You do not need to start streaming or recording just to send this return.

<figure><img src="../.gitbook/assets/obs-audio-guides/start-virtual-camera.png" alt="OBS Controls dock with Start Virtual Camera highlighted" width="330"><figcaption><p>Start the camera before selecting it in Live Studio. Screenshot: <a href="https://obsproject.com/kb/virtual-camera-guide">OBS Project</a>.</p></figcaption></figure>

## 3. Select OBS Virtual Camera in Live Studio

1. Click **Director** at the top right of Live Studio.
2. Click the headset button to enable the director's microphone or video.
3. Click the **Settings** gear in the director's bottom toolbar.
4. Under **Video Source**, select **OBS Virtual Camera**.

<figure><img src="../.gitbook/assets/live-studio-obs-return/enable-director-camera.png" alt="The director's headset button for enabling microphone or video"><figcaption><p>Enable the director's feed to access its camera settings.</p></figcaption></figure>

<figure><img src="../.gitbook/assets/live-studio-obs-return/director-camera-settings.png" alt="Live Studio director settings with OBS Virtual Camera selected as Video Source" width="470"><figcaption><p>The director's camera sends the OBS picture back to guests.</p></figcaption></figure>

For a video-only return, mute the director's microphone with the microphone button. **OBS Virtual Camera carries video only.** Guests can keep talking through their normal VDO.Ninja microphones. Use headphones; do not send their voices back to them through OBS audio.

Click **Director** again to return to the layout editor. The camera stays active.

## 4. Send the return invite

In the **Guests** tab, tick **Director return**, then copy **Guest invite** and send that updated link to your guests. Guests who already joined must reopen the updated invite.

<figure><img src="../.gitbook/assets/live-studio-obs-return/guest-return-invite.png" alt="Live Studio with the Director button at the top, the Guest invite copy button, and Director return checked" width="334"><figcaption><p>Tick Director return before copying the guest link.</p></figcaption></figure>

This adds [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) to guest links. Guests see the director's OBS video instead of the other guests' individual videos, while still hearing each other. Their own camera preview can remain visible.

Keep OBS Virtual Camera and Live Studio running. Change the OBS Program picture and ask a guest to confirm that their return picture changes too.

## Quick checks

| What you see | What to do |
| --- | --- |
| OBS Virtual Camera is missing | Start it in OBS, then use the refresh icon beside Video Source. |
| An OBS logo or no camera picture | Check that OBS Virtual Camera is running and Program contains the picture you want. |
| Guests still see separate cameras | Copy the invite after enabling Director return; have guests reopen that link. |
| The picture repeats inside itself | Keep the director return out of the OBS scene and use the clean Scene link for its Browser Source. |
| Guests hear a delayed copy of themselves | Mute the duplicated audio path. Keep the return video-only, or build an audio return that excludes guest voices. |

For program audio or other return arrangements, see [Let guests see your finished OBS scene](let-guests-see-your-obs-scene.md#prevent-echo-and-feedback).
