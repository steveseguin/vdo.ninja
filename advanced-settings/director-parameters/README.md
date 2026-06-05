---
description: Options for &director URLs
---

# Director Parameters

Parameters specified for the director's control panel; have to be used together with the [`&director`](../../viewers-settings/director.md) parameter.

## Director Only Parameters

| Parameter | Explanation |
| --- | --- |
| [`&director`](../../viewers-settings/director.md) | Enters a room as the director, instead of a guest and have full control |
| [`&codirector`](../../director-settings/codirector.md) | Allows assistant directors to have access to the director's room, with a subset of control |
| [`&blindall`](../../newly-added-parameters/and-blindall.md) | It allows the director 'blinding' all the guests at a time with a new button |
| [`&highlightmute`](and-highlightmute.md) | Mutes non-highlighted guests and unmutes the highlighted guest when Highlight changes |
| [`&muteall`](and-muteall.md) | Adds a URL-gated director button for muting or unmuting all guests at once |
| [`&cleandirector`](../../director-settings/cleandirector.md) | Hides the invite URL options in the Director's room |
| [`&hidesolo`](../../newly-added-parameters/and-hidesolo.md) | Lets you hide the solo links from showing |
| [`&hidecodirectors`](and-hidecodirectors.md) | Hides the co-directors from appearing in the director's room |
| [`&minidirector`](../../newly-added-parameters/and-minidirector.md) | Default mini director stylesheet |
| [`&orderby`](../../newly-added-parameters/and-orderby.md) | Orders guests by their stream ID in the director's room |
| [`&queue`](../../general-settings/queue.md) | A basic guest queuing system |
| [`&rooms`](../../director-settings/rooms.md) | Quick director access to a list of rooms for transferring guests |
| [`&roomcap`](and-roomcap.md) | Claim-time room admission cap (default 80 on official service; hard max 80) |
| [`&roomkey`](and-roomkey.md) | Trusted bypass key for claim-time admission controls |
| [`&noclaim`](and-noclaim.md) | Join director mode without trying to claim the room |
| [`&requireapproval`](and-requireapproval.md) | Require manual director approval before new guests can join |
| [`&approvepopup`](and-approvepopup.md) | Show a director confirmation popup for pending approval requests |
| [`&broadcasttransfer`](and-broadcasttransfer.md) | Will let you specify the default for whether to transfer a guest from room to room in broadcast mode or not |
| [`&showdirector`](../../viewers-settings/and-showdirector.md) | Lets the director perform alongside guests, showing up in scene-view links |
| [`&slotmode`](and-slotmode.md) | Gives you the possibility to assign slots to the connected guests |
| [`&previewmode`](and-previewmode.md) | Activates the Preview layout for the director's room by default |
| [`&novice`](and-novice.md) | Hides some advanced guest options in the director's control center |
| [`&layouts`](and-layouts.md) | An ordered array of layouts, which can be used to switch between using the API layouts action |
| [`&maindirectorpassword`](and-maindirectorpassword.md) | Lets you set a pseudo 'master room password' as a director |

## Parameters you can also use as a director

| Parameter | Explanation |
| --- | --- |
| [`&totalroombitrate`](../video-bitrate-parameters/totalroombitrate.md) | The total bitrate the guests in a room can view video streams with |
| [`&limittotalbitrate`](../video-bitrate-parameters/limittotalbitrate.md) | Limits the total outbound bitrate |
| [`&notify`](../../source-settings/and-notify.md) | Audio alerts for raised hands, chat messages and if somebody joins the room |
| [`&mutespeaker=0`](../../source-settings/and-mutespeaker.md) | Can be used to have the director join unmuted |
| [`&showconnections`](../settings-parameters/and-showconnections.md) | Displays the total number of p2p connections of a remote stream |
| [`&widget`](../settings-parameters/and-widget.md) | Will load a side-bar for guests with an IFrame embed, with support for YouTube / Twitch / Social Stream |
