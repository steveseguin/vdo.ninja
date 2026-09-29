---
description: Lets a guest mute their microphone and shared audio in scenes while continuing to talk in the room.
---

# \&scenemutebutton

Guest-side option. Currently available in [VDO.Ninja alpha](https://vdo.ninja/alpha/); use updated alpha pages for the guest and scene viewers.

## Details

Add `&scenemutebutton` to a guest's invite link to show **Mute in scenes** beside their microphone button. The guest can then talk to the room without their voice playing in the scene outputs used for the show.

```text
https://vdo.ninja/alpha/?room=YOUR_ROOM&scenemutebutton
```

For example, capture this room scene in OBS:

```text
https://vdo.ninja/alpha/?room=YOUR_ROOM&scene=0
```

The button starts off. When the guest enables it, the broadcast icon turns amber and the label changes to **Muted in scenes**. It covers both their microphone and separate screenshare audio. Directors, co-directors and normal room participants can still hear them, provided their microphone and listening controls allow it.

Directors and room participants see a separate **Guest muted scenes** indicator on the guest's card. The director's own **Mute in scenes** control remains separate.

## Which links are affected?

* Room scene links, including `&scene=0`.
* Director solo links using `&solo`.
* Listen-only links using `&viewonly`, `&nopush`, `&noseed` or `&viewmode`, which VDO.Ninja also treats as scenes.

Plain `?view=STREAM_ID` links that can access the stream are not scene links and can still hear the guest. A room participant recording their room audio can also still record it.

Scenes using `&showmutestate` can display the amber badge on the program output when their output settings permit mute indicators.

## Main microphone mute

The main microphone mute takes visual priority: the scene button dims and says **Scene mute saved**. Unmuting the microphone keeps the scene-mute choice enabled; it does not unexpectedly put the guest back on air.

The main microphone button controls microphone audio, not separately shared system audio. Clearing the scene mute does not clear the main microphone mute or a mute applied by the director.

## Meshcast and reconnects

Updated scene pages mute the guest's playback too, including audio delivered through Meshcast or WHEP. The guest also mutes individual peer-to-peer audio senders where available. The shared relay upload continues so room participants can still hear it.

The scene-mute choice applies to scenes joining later, microphone replacement and connections that reconnect while the guest page stays open. Reloading the guest page resets the choice.

**Changing scene audio** means a sender update is pending. **Scene audio not confirmed** indicates a sender update failed; check the show output before relying on it. These messages are not acknowledgements from every connected scene.

Older scene pages ignore the new playback-mute signal. Use updated pages at both ends when relying on Meshcast/WHEP muting. Audio mixed back in by another participant, a custom return mix, or a capture of the director's listening output needs separate control. Chunked audio has not been verified with this option.

## Related

* [Start with the microphone muted: `&mute`](../../source-settings/and-mute.md)
* [Room audio, OBS, Meshcast, and private talk](../../guides/room-audio-obs-meshcast-and-private-talk.md)
