---
description: Common setups for a live call-in show with OBS and VDO.Ninja, including room audio, guest scenes, caller lobbies, approval, and optional phone support.
---

# Run a call-in show with OBS and VDO.Ninja

A call-in show can use VDO.Ninja for the conversation and OBS for the finished broadcast. Viewers join through a browser link, the host brings callers into the conversation, and OBS sends the selected guests, host camera, and audio to YouTube or another streaming service.

The options below cover a host with roughly one to four remote guests on air at once. A caller using a phone's browser joins like any other guest; dialing a telephone number is a separate option covered at the end.

## The basic audio setup

In a normal VDO.Ninja room, guests hear one another directly. The host can speak and listen from the Director's Room while keeping their own camera and microphone in OBS.

| Sound | How it reaches its destination |
| --- | --- |
| Host microphone to callers | Select and enable the host microphone in VDO.Ninja |
| Host microphone to the broadcast | Capture the microphone in OBS |
| Guests to one another | Normal VDO.Ninja room audio |
| Guests to the host's headphones | Listen through the Director's Room |
| Guests to the broadcast | VDO.Ninja scene or solo Browser Sources in OBS |

To set up this arrangement:

1. [Create a room](../getting-started/rooms/README.md) and keep its Director's Room open.
2. Click **Enable director's microphone or video**, select the host microphone, and enable it for the conversation. The host's camera can stay in OBS; sending video to callers is optional.
3. Select headphones as the director's audio output and enable local guest playback if it is muted. Have callers wear headphones too.
4. Add the guest scene or solo links to OBS as **Browser Sources**, with **Control audio via OBS** enabled. Keep the host's existing camera and microphone sources in OBS.
5. Leave OBS monitoring off for those guest sources when listening through VDO.Ninja. Keep their broadcast audio enabled. Avoid also capturing the director browser/headphone output through Desktop Audio or application capture, which would duplicate the guests.
6. Keep the director's microphone out of the guest scene captured by OBS, since OBS already captures the host microphone. The director is normally excluded from scene links; enabling **Director will also be a performer** / `&showdirector` can change that.

This arrangement does not need a virtual audio cable or an OBS audio return. VDO.Ninja carries the conversation, so sending the complete OBS mix back would return callers' own voices to them. Keep YouTube playback muted on participating devices too.

See [Echo or feedback issues](../common-errors-and-known-issues/echo-or-feedback-issues.md#control-room-plus-obs-monitoring) for duplicate monitoring and capture problems.

## One group source or separate guest sources?

Both are common. The choice is where you want to manage the guest layout and audio levels.

| OBS arrangement | What it provides | When a new caller arrives |
| --- | --- | --- |
| One group scene Browser Source | VDO.Ninja arranges the guests; OBS gets one combined guest audio fader | Add the caller to the VDO.Ninja scene; the existing OBS source follows |
| Separate solo Browser Sources | Independent positioning, filters, and audio faders in OBS | Add or replace a solo link, or prepare reusable guest/slot sources |

For a group source, copy **Capture a Group Scene** from the director page. Turn **Auto-add guests** off for a manually selected scene, then use **Add to Scene** on the callers you want on air. OBS keeps the same Browser Source and audio settings as callers change.

With **Auto-add guests** on (`&scene=0`), room guests appear automatically. That fits a room containing only the people intended to be on air. A manual scene such as `&scene=1` lets the director choose the broadcast participants. See [Scene options](../advanced-settings/view-parameters/scene.md) and the [Mixer app](../steves-helper-apps/mixer-app.md) for layout controls.

Separate sources suit an OBS layout with individual guest boxes. [Permanent links and slots](how-to-get-permanent-links.md) cover reusable sources for recurring guests or fixed seats, so every new caller need not require a new OBS setup.

If the show switches between several OBS scenes, reuse the existing guest source in each scene that needs its audio. Another option is a shared audio-only room source with separate video-only sources. See [Keep voices active while switching pictures](room-audio-obs-meshcast-and-private-talk.md#3-keep-voices-active-when-switching-to-a-screenshare).

## Where callers wait and how they join

Joining the conversation and going on air are separate decisions. Removing someone from the broadcast scene does not remove them from the room or stop the other callers hearing them.

### app.invite.cam lobby

[app.invite.cam](../steves-helper-apps/app-invite-cam.md) is well suited to public call-in shows: it provides a waiting list, host/helper controls, and admission or return-to-lobby actions. Share the lobby invitation so callers have somewhere to wait instead of repeatedly trying to enter the live conversation.

Hosts sign in; guest invitations can support anonymous callers or named Discord users. For a panel where admitted callers hear one another, configure group conversation rather than leaving those guests isolated to the director. The [app's host and guest guide](https://app.invite.cam/guide) covers the controls.

### A transfer room in regular VDO.Ninja

A second VDO.Ninja room can serve as the public lobby. Callers join that room, and its director transfers them into the separate live room when ready. Share the lobby link rather than the live-room invitation.

On a normal reconnect or refresh, transferred callers return to their original lobby link. That keeps routine rejoining out of the live conversation. Transfers are a production workflow, not an account-based ban. Keep both director pages open; the rooms need matching passwords for transfers. See [Transfer rooms](../getting-started/rooms/transfer-rooms.md).

### Director approval and signed-in access

For a join approval gate, add [`&requireapproval`](../advanced-settings/director-parameters/and-requireapproval.md) to the director link. Callers wait for the director to approve or deny their request. Keep the director connected: this live approval setting does not block new joins when the director is absent.

If identity matters too, [SSO and signed-in access](sso-and-signed-in-access.md) cover room access controls, allowlists, and pending requests. Requiring sign-in alone permits signed-in users; configure the access rules for who should actually be admitted.

[Green rooms and guest waiting options](green-room-and-guest-approval-options.md) compares these approaches with queue/hold modes.

## Optional additions

**Let callers see the finished show:** OBS Virtual Camera can send a picture back while VDO.Ninja continues carrying the conversation. Keep that returned picture out of the OBS guest scene to avoid a repeating image. See [Let guests see your finished OBS scene](let-guests-see-your-obs-scene.md).

**Let callers hear clips or music:** Send a separate playback-only return, excluding the host and guest microphones already carried by VDO.Ninja. See [Return OBS clips and music to the room](room-audio-obs-meshcast-and-private-talk.md#4-return-obs-clips-and-music-to-the-main-room).

**Screen a caller privately:** Use the lobby workflow or arrange private talk separately. A host microphone captured directly by OBS remains on air even when VDO.Ninja's talk controls change. See [Keep private conversations off air](room-audio-obs-meshcast-and-private-talk.md#7-keep-private-conversations-off-air).

**Accept telephone calls:** Dial-in support needs a phone provider or an external phone/softphone bridge. [Phone call-in provider options](phone-call-in-provider-options.md) links to the experimental SIP/SignalWire and Twilio setups. Those callers currently enter the director's audio mix rather than appearing as ordinary guest tiles, so the basic guest-only OBS source above needs an additional route for that mixed audio. An external phone setup is covered in [Phone call-ins with virtual audio cables](phone-call-ins-with-vdo-ninja-and-virtual-audio-cables.md).

## Before going live

Make a short OBS recording with two callers: confirm everyone hears the others once, callers do not hear themselves, and the recording includes the host and both guests. Admit another caller, switch OBS scenes if used, and check what happens when someone reconnects. Confirm waiting callers and any private conversations stay out of the broadcast.
