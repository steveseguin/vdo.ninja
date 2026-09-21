---
description: A basic OBS call-in show setup, with host audio through VB-CABLE, guest audio and video in one Browser Source, and options for reusable slots, lobbies, and show returns.
---

# Run a call-in show with OBS and VDO.Ninja

For a host with one to four callers, **one OBS Browser Source can bring in all selected callers together**. You can add and remove callers in VDO.Ninja while keeping that OBS source and its audio settings unchanged. Separate sources are useful when you want to position, crop, or adjust each caller independently in OBS.

The working example below keeps the host's camera, microphone, and playback in OBS. VDO.Ninja handles the conversation, and OBS sends the finished show to YouTube. After that are alternatives for audio, layouts, caller admission, and video returns.

## Basic setup: send the host and OBS playback to callers

This example uses **OBS Virtual Camera** for the picture and **VB-CABLE** for selected audio. The cable device names below are for Windows; [other audio-routing options](audio.md) can provide the same connection on other systems.

1. **Create the live room.** [Create a VDO.Ninja room](../getting-started/rooms/README.md) and keep its **Director's Room** open. This is your control page. Callers use its guest invitation; keep director and OBS viewing links private.
2. **Bring callers into OBS once.** In **Capture a Group Scene**, turn **Auto-add guests** off and copy the scene link. Add it to OBS as a **Browser Source** named **Callers**, and enable **Control audio via OBS**. Use **Add to Scene** in VDO.Ninja to select callers for this output. Keep your existing host camera and microphone in OBS.
3. **Send the OBS picture back.** Start **OBS Virtual Camera**, with **Program** selected if callers should see the broadcast picture. It sends video only; the next step supplies audio.
4. **Send host audio into the cable.** [Install VB-CABLE](share-obs-audio-with-vdo-ninja.md#1-install-the-cable-and-keep-your-headphones-as-the-normal-output). In OBS **Settings / Audio / Advanced**, set **Monitoring Device** to **CABLE Input**. In **Advanced Audio Properties**, enable monitoring for the **host microphone and wanted clips/music**, keeping them enabled for the broadcast too. Older OBS versions call this **Monitor and Output**. Leave **Callers** on **Monitor Off**, with its broadcast audio enabled.
5. **Select both devices in VDO.Ninja.** Choose **Enable director's microphone or video**. Select **OBS Virtual Camera** as the camera and **CABLE Output** as the only audio input, then start publishing. Do not also select the physical host microphone: it already comes through the cable.
6. **Listen through VDO.Ninja.** Set the director's audio output to headphones and enable local guest playback if muted. Keep the director browser/headphone audio out of OBS Desktop Audio or application capture. Everyone speaking uses headphones and mutes YouTube playback.
7. **Keep the return out of OBS's caller source.** Do not add the director's returned camera/audio to the VDO.Ninja scene captured by **Callers**. It would send OBS its own picture and a second copy of the host audio. Check director inclusion if using `&showdirector` or the Mixer.

The audio settings are:

| Source | OBS broadcast to YouTube | OBS monitoring to CABLE Input |
| --- | --- | --- |
| Host microphone | On | On |
| Clips/music callers should hear | On | On |
| VDO.Ninja callers | On | **Off** |
| Director browser/headphone playback | Not captured | Not captured |

**Monitor Off does not mute the broadcast.** It keeps guest voices out of the cable so callers do not hear themselves returned from OBS. They hear the host and selected playback through the director, and hear one another through normal room audio. The host hears callers through the director browser.

OBS monitoring now goes to the cable, not the host's headphones. This example supplies local listening for guest voices; hearing OBS-only media clips locally requires a separate listening route. Device screenshots and monitoring details are in [Share audio from OBS](share-obs-audio-with-vdo-ninja.md) and [Share OBS Virtual Camera and audio](share-obs-virtual-camera-and-audio.md). In those playback examples, include the host microphone in monitoring for this call-in setup.

This works **with or without `&broadcast`** on guest invitations. Without it, callers see normal room videos, including the director's OBS picture. With it, they watch the director's picture instead of the other individual guest videos; they still hear one another.

### Bring the next caller on air

Admit or transfer the caller into the live room, then add them to the selected VDO.Ninja scene. Remove them from that scene when finished, and return them to the lobby or disconnect them if they should leave the conversation. **The Callers source and OBS audio settings stay in place.**

Before sharing a public invitation, choose a [lobby or approval workflow](#manage-waiting-callers-and-admission). Before going live, test with two callers: both should hear the host, each other, and a clip once; an OBS recording should contain all three voices. Add another caller without changing OBS settings.

## Alternative: use the host microphone directly

If callers only need the conversation, select the physical host microphone in VDO.Ninja as well as in OBS. This avoids a virtual audio cable. Keep the same guest Browser Source, headphone listening, and exclusion of the director from OBS's caller output. Leave OBS guest monitoring off.

<figure><img src="../.gitbook/assets/docs-infographics/call-in-show-setup.png" alt="Direct-microphone alternative: the host and callers converse through VDO.Ninja; host camera and microphone plus guest media feed OBS; the host listens through VDO.Ninja on headphones with OBS guest monitoring off."><figcaption><p>The direct-microphone alternative. The host microphone is selected separately in OBS and VDO.Ninja; no audio cable is used.</p></figcaption></figure>

OBS Virtual Camera is still optional for the picture. If you later need to send clips/music, either switch the director's audio input to the cable setup above, or keep the direct microphone and add a [separate playback-only return](room-audio-obs-meshcast-and-private-talk.md#4-return-obs-clips-and-music-to-the-main-room). Only that second arrangement needs a return excluding the host microphone, because VDO.Ninja already captures it directly.

For doubled sound, see [Echo and duplicate monitoring](../common-errors-and-known-issues/echo-or-feedback-issues.md#control-room-plus-obs-monitoring).

## Options for running the show

* [Keep OBS ready as callers change](#keep-obs-ready-as-callers-change): layouts, Mixer slots, and individual sources.
* [Manage waiting callers and admission](#manage-waiting-callers-and-admission): lobbies, approval, and private talk.
* [Keep voices audible when switching pictures](#keep-voices-audible-when-switching-pictures).
* [Choose what callers see](#choose-what-callers-see): ordinary rooms, broadcast mode, and Meshcast.
* [Handle reconnects and prepare for the show](#handle-reconnects-and-prepare-for-the-show).
* [Accept telephone calls](#accept-telephone-calls).

## Keep OBS ready as callers change

A **VDO.Ninja scene link** is a webpage showing the feeds selected for that VDO.Ninja scene. It can show several callers together or just one caller. It is different from an **OBS scene**, which combines your host camera, graphics, and Browser Sources into the broadcast picture.

### Arrange the callers together in VDO.Ninja

With this approach, one OBS Browser Source displays the whole caller layout. OBS gets one audio fader for that source; VDO.Ninja provides the individual guest controls.

* **Automatic layout:** Use **Capture a Group Scene** in the director page. With **Auto-add guests** on (`&scene=0`), room guests appear automatically. This fits a live room containing only intended broadcast participants.
* **Manual selection:** Turn **Auto-add guests** off and add chosen callers to a numbered VDO.Ninja scene, such as Scene 1. The OBS source stays fixed while you add or remove people. [Scene controls](../advanced-settings/view-parameters/scene.md) explain the options.
* **Custom layout and numbered seats:** Open [vdo.ninja/mixer](https://vdo.ninja/mixer). The Mixer lets you assign callers to slots and place those slots in layouts, including crops for phone video. Copy its clean scene/output link into OBS, rather than the Mixer control-page URL. See the [Mixer guide](../steves-helper-apps/mixer-app.md).

A **slot** is a numbered seat: changing who occupies slot 1 changes the caller shown in that seat without rebuilding the layout. In the Mixer, turn off **Assign a slot to new guests automatically** if arrivals should wait for manual assignment. Save/export the Mixer settings for reuse.

### Arrange individual caller boxes in OBS

Separate Browser Sources let OBS position, crop, filter, and adjust the volume of each caller independently. Those sources can follow a seat, a selected scene, or a particular person:

| What the OBS source follows | How to reuse it |
| --- | --- |
| **A numbered slot** | Assign callers with the Mixer or the director's `&slotmode` controls. An OBS link using `&viewslot=1` follows whoever occupies slot 1. Prepare one source per seat. |
| **A dedicated VDO.Ninja scene** | Give each OBS caller box its own scene link. Keep one caller in each scene; remove the previous caller and add the next. No fixed caller identity is needed. |
| **A particular guest** | Use that guest's solo link. A unique, fixed `&push` ID in their invitation keeps the source reusable for their later appearances. |

Example OBS link for slot 1:

```text
https://vdo.ninja/?room=YOUR_ROOM&scene&viewslot=1
```

Use it with the Mixer or a director using `&slotmode`, and preserve your room's access parameters. Change the slot number for other OBS boxes. A guest's `&slot=1` requests a seat; it does not reserve it.

[Slot viewing](../advanced-settings/mixer-scene-parameters/and-viewslot.md) and [Permanent links, scenes, and slots](how-to-get-permanent-links.md) provide the complete link sets. Use generated viewing links for authenticated rooms so OBS can connect without interactive sign-in.

## Manage waiting callers and admission

A public call-in invitation needs somewhere for people to wait. Joining the conversation and appearing on the broadcast are separate decisions: removing a caller from an OBS picture does not stop other people in the room hearing them.

| Need | Common approach | Details |
| --- | --- | --- |
| A public waiting list with host/helper controls | **app.invite.cam** provides a lobby, invitations, admission, and return-to-lobby actions | [app.invite.cam guide](../steves-helper-apps/app-invite-cam.md) |
| A lobby using regular VDO.Ninja rooms | Share a separate waiting-room link, then transfer selected callers into the live room | [Transfer rooms](../getting-started/rooms/transfer-rooms.md) |
| Approval before entering a room | Add `&requireapproval` to the director link; approve or deny pending requests | [Director approval](../advanced-settings/director-parameters/and-requireapproval.md) |
| Access based on identity | Use signed-in room access and configure an allowlist or manage pending access requests | [SSO and access controls](sso-and-signed-in-access.md) |

**app.invite.cam** gives callers somewhere to wait instead of repeatedly trying to enter the show. It supports anonymous guests or named Discord users. For a panel whose callers hear one another, configure group conversation rather than director-only guest isolation.

**Transfer rooms** send callers back to the lobby when they rejoin through their original invitation. Share that lobby link, keep both director pages open, and use matching room passwords. Transfers manage ordinary arrivals; they are not an account-based ban.

**Approval and sign-in:** `&requireapproval` does not block new joins when the director is absent. Sign-in alone permits signed-in accounts; configure access rules to restrict admission. [Green rooms and waiting options](green-room-and-guest-approval-options.md) also covers queue/hold modes.

### Screen callers without putting private talk on air

A lobby operator or helper can check a caller's microphone before admission. If the on-air host does the screening, keep their microphone out of the broadcast too.

VDO.Ninja's local listening controls and **Solo Talk** do not mute the host microphone in OBS. Keep screening audio out of OBS's guest selection and desktop capture. With the cable setup, check the host's broadcast output and cable monitoring separately: an OBS output mute may leave monitoring active. See [Private conversations and Solo Talk](room-audio-obs-meshcast-and-private-talk.md#7-keep-private-conversations-off-air).

## Keep voices audible when switching pictures

Switching to a fullscreen caller, a screen share, or a host-only OBS scene can remove the source carrying other voices. Two common approaches are:

* Reuse the existing caller sources in each OBS scene that needs their audio, keeping them active.
* Create a shared **Room Audio** scene in OBS with an audio-only VDO.Ninja source, and use video-only links for the pictures. This makes the on-air audio selection independent of the picture layout.

Keep the host mic/playback sources active too if they feed the director through the cable. Capture each voice once and include only on-air callers in a shared audio source. Keep monitoring off for every guest audio source feeding OBS, including audio-only sources. [Keep voices active while switching pictures](room-audio-obs-meshcast-and-private-talk.md#3-keep-voices-active-when-switching-to-a-screenshare) covers source settings and screen-share audio.

## Choose what callers see

The callers' view can differ from the audience's OBS picture.

| Caller experience | Setup |
| --- | --- |
| See the other participants | Use normal room invitations. Each guest receives the other participants' video. |
| See the host or a single show view | Add [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) to guest invitations. Callers receive the main director's video while normal guest-to-guest audio remains available. |
| See the finished OBS picture | Select **OBS Virtual Camera** as the director's camera. Normal room invites show it alongside room videos; `&broadcast` invites show just the director's picture. |

`&broadcast` controls what callers watch; it does not start the YouTube broadcast or belong on OBS viewing links. Keep a returned OBS picture out of the VDO.Ninja output OBS captures to prevent a repeating image. Virtual Camera carries video only. See [Let guests see the finished OBS scene](let-guests-see-your-obs-scene.md).

### Direct video or Meshcast distribution

Broadcast mode can work **without Meshcast**: the director sends their video to the callers directly. This reduces guests' video-sharing work but gives the director more return-video uploads.

With **Meshcast**, a publishing guest or director uploads a feed to a server for distribution. For an OBS picture returned by the director, enable `&meshcast` on the director link and retain `&broadcast` on guest invitations. The [return guide](let-guests-see-your-obs-scene.md#4-optional-send-the-return-through-meshcast-v2) also documents `&meshcast2` for the newer service.

Meshcast also works for individual guest publications in ordinary rooms. It reduces repeated uploads but adds a server dependency and some delay. Enabling it for the director does not move the guests' outgoing feeds to Meshcast. See [Meshcast options](../newly-added-parameters/and-meshcast.md).

Neither mode makes the full OBS audio mix suitable for active callers. People only watching in a greenroom can receive that full mix. See [Show feeds and room returns](room-audio-obs-meshcast-and-private-talk.md).

## Handle reconnects and prepare for the show

A reusable OBS source saves editing links, but someone may still need to restore the caller's seat or scene selection.

* **Recurring guest:** Give them a unique fixed stream ID, or use `&permaid` to remember one in the same browser. Two simultaneous callers must not share an ID.
* **Brief disconnection:** The director's [`&scenerestore`](../advanced-settings/mixer-scene-parameters/and-scenerestore.md) can restore manual scene membership for a returning guest with a valid temporary restore identity. It does not bypass admission or save every layout permanently.
* **Caller returns to the lobby:** Re-admit or transfer them, then check their seat and on-air audio. Keep a host-only OBS scene ready while sorting out a missing feed.

Before the show, make an OBS recording with two callers. Check conversation audio, broadcast audio, a new admission, a caller replacement, a reconnect, and every OBS scene you will switch to. Test private talk separately from ordinary on-air conversation. If using an OBS return or Meshcast, include those paths in the rehearsal.

## Accept telephone calls

A caller opening the guest link in a phone browser uses the workflows above. Dialing a telephone number requires a phone provider or a phone/softphone bridge.

| Approach | What changes | Setup guide |
| --- | --- | --- |
| External phone or softphone with an audio mixer/router | Create return mixes that let browser and telephone callers hear each other without hearing themselves | [Phone calls with virtual audio cables or hardware](phone-call-ins-with-vdo-ninja-and-virtual-audio-cables.md) |
| Experimental integrated SIP/SignalWire or Twilio support | Configure the provider-backed call-in path; telephone callers currently join the director's audio mix, rather than ordinary guest tiles | [Phone call-in provider options](phone-call-in-provider-options.md) |

For the integrated path, a guest-only OBS viewing source will not capture the phone caller by itself. Plan how the director's mixed audio reaches OBS and avoid capturing the host microphone twice. The linked phone guides cover this additional routing.
