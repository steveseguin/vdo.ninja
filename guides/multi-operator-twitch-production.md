---
description: Build a shared Twitch production where three to five operators contribute POV and camera feeds, join without scene edits, and hand the broadcast between operators.
---

# Multi-operator Twitch production with VDO.Ninja and OBS

This workflow is for a shared Twitch channel where:

* any authorized member can start the show;
* three to five members can add their POV and camera without the current operator rebuilding OBS;
* another member can take over when the current operator leaves; and
* Discord carries the conversation audio.

VDO.Ninja and Twitch have different jobs in this design. VDO.Ninja transports each participant's contribution. One OBS instance composites those feeds and sends the single program to Twitch.

```text
Player POVs and cameras -> VDO.Ninja -> current program OBS -> Twitch
Discord voice ------------------------> current program OBS -> Twitch
```

A handoff therefore needs either a coordinated stop/start between two OBS computers or an encoder that stays connected to Twitch while control changes hands. VDO.Ninja alone does not elect the Twitch operator or keep the Twitch ingest session alive.

## Quick recommendation

| Priority | Recommended design |
| --- | --- |
| Start with equipment everyone already owns | Install the same OBS scene collection on every operator's computer and use a short, coordinated Twitch handoff |
| Lowest load on the gaming computers and the cleanest handoff | Run one always-on production OBS on a spare computer and let members control it remotely |
| Highest uptime and automatic failover | Put a redundant encoder or private relay behind the production and add an authenticated active-operator lease |

For a three-to-five-person Windows gaming group, a practical starting point is **Game Capture for each gameplay feed, a VDO.Ninja browser link for each camera, and OBS Browser Sources for the final mix**. Give every feed a permanent ID and pre-build every source once.

## Choose the contribution tool

| Tool | Best use here | Advantages | Important limitation |
| --- | --- | --- | --- |
| VDO.Ninja in a browser | Webcams, phone cameras, and occasional screen sharing | No install, cross-platform, reusable links | Browser screen sharing requires a window/screen choice and may be less consistent for games |
| [Game Capture](using-game-capture-with-vdo.ninja.md) | Windows game/window video and its audio | Native, low-memory capture with hardware encoding and window-specific audio | Windows only; send the webcam separately or composite it elsewhere |
| [Ninja OBS Plugin](using-ninja-obs-plugin-with-vdo.ninja.md) as a receiver | Managing VDO.Ninja sources inside OBS | Can auto-create/update inbound room sources; its browser-backed receiver follows normal VDO.Ninja behavior | The native VP9/H.264/Opus receiver remains experimental |
| Ninja OBS Plugin as a publisher | A contributor-only OBS or a separate contribution computer | Publishes the OBS output directly to VDO.Ninja | It uses OBS's active streaming output slot, so this plugin path alone cannot publish to VDO.Ninja and Twitch at the same time |
| OBS Browser Sources | Receiving the final VDO.Ninja feeds | Established, portable OBS workflow | Each live feed still needs decoding and compositing |

The Ninja OBS Plugin is useful, but it is not automatically the lightest answer for this design. Its publishing mode conflicts with using the same normal OBS output for Twitch. Game Capture is generally the better gameplay contributor on Windows, while a Browser Source or the plugin's browser-backed receiver is a sensible production input.

## Solution 1: give every operator the same OBS production

This is the simplest decentralized setup. It does not require an always-on server, but Twitch handoffs can include a short slate, cut, or stream restart.

### 1. Give each operator separate Twitch access

Do not share the channel owner's password or primary stream key.

In the channel's Twitch Creator Dashboard, open **Settings -> Stream -> Permissions -> People who can stream to your channel** and authorize each operator by email. Twitch gives each person a separate guest stream key. Removing an authorized streamer invalidates that person's key without rotating everyone else's key.

Each person configures their own key in a local OBS profile. Share the scene collection, but configure the streaming profile separately because [OBS profiles store stream and output settings](https://obsproject.com/kb/profiles), while [scene collections store scenes and sources](https://obsproject.com/kb/scene-collections).

See Twitch's [Stream Key FAQ](https://help.twitch.tv/s/article/twitch-stream-key-faq?language=en_US) for the current authorized-streamer workflow.

Enable [Twitch Disconnect Protection](https://help.twitch.tv/s/article/Disconnect-Protection?language=en_US) and rehearse with it. It can display a temporary slate for up to 90 seconds during a supported encoder disconnect, but it is not a source switcher and should not be assumed to make a handoff seamless.

### 2. Assign permanent VDO.Ninja identities

Choose a private room name, a strong room password, and two unique IDs per person:

| Member | Gameplay ID | Camera ID |
| --- | --- | --- |
| Alice | `alice-game` | `alice-cam` |
| Bob | `bob-game` | `bob-cam` |
| Carol | `carol-game` | `carol-cam` |

Use names that are unique to the production rather than these public examples. Do not open the same publishing ID on two devices at once.

An example camera shortcut is:

```text
https://vdo.ninja/?room=TEAMROOM&push=alice-cam&webcam&audiodevice=0&autostart&view#p=ROOMPASSWORD
```

This disables the camera link's microphone because voice is coming from Discord, starts the camera path with fewer prompts, and prevents the contributor page from receiving every other room feed. The browser must still receive camera permission.

For browser-based gameplay or desktop capture, a reusable link can look like:

```text
https://vdo.ninja/?room=TEAMROOM&push=alice-game&screenshare&autostart&view#p=ROOMPASSWORD
```

The browser will still require the user to choose the screen or window for security. On Windows, Game Capture avoids that browser workflow: save `TEAMROOM`, `alice-game`, and the password in the app, select the game/window, and select only that window's audio. Do not capture the complete desktop mix if it includes Discord.

Keeping the password after `#` prevents it from being sent in normal web requests and server logs. Treat every saved link as private anyway.

### 3. Build the OBS scene once

There are two useful layout models.

#### Fastest automatic layout

Add one OBS Browser Source containing a VDO.Ninja auto-scene:

```text
https://vdo.ninja/?room=TEAMROOM&scene=0&slots=10&maxslots=10#p=ROOMPASSWORD
```

`scene=0` automatically adds live room feeds, so the operator does not need to touch OBS when someone joins. Set the slot count to the maximum number of simultaneous gameplay and camera feeds. This is quick, but game and camera feeds become separate tiles and the layout is intentionally generic.

#### Fixed branded layout

For a consistent gameplay-plus-camera composition, pre-add a Browser Source for every expected feed and position it in advance:

```text
https://vdo.ninja/?room=TEAMROOM&view=alice-game&solo#p=ROOMPASSWORD
https://vdo.ninja/?room=TEAMROOM&view=alice-cam&solo&noaudio#p=ROOMPASSWORD
```

Repeat this for all members. An offline source waits in its assigned position; when that permanent publishing ID comes online, it appears without operator action.

For each Browser Source:

* enable **Control audio via OBS** for gameplay sources;
* keep camera sources silent;
* leave **Refresh browser when scene becomes active** disabled;
* leave **Shutdown source when not visible** disabled when immediate reconnection matters; and
* avoid loading the same VDO.Ninja feed through both a Browser Source and the plugin.

Export this scene collection and import it on each operator's OBS. Local capture device names can differ, so each operator should test their copy once. A personalized version can use direct local game/camera sources for that operator and VDO.Ninja sources for everyone else; this saves a local encode/decode round trip but requires one variant per operator.

The collection contains the private VDO.Ninja room links, so distribute it only to trusted operators and change the room credentials when access should be revoked.

#### One combined feed per member

If each person's camera must always be overlaid on their gameplay, build a dedicated **Contribution** scene in that person's OBS and publish it as one VDO.Ninja feed. In OBS Virtual Camera settings, select **Scene** and choose **Contribution** rather than **Program**. The [OBS Virtual Camera](https://obsproject.com/kb/virtual-camera-guide) can output that fixed scene while Program shows the multi-person Twitch production, avoiding a recursive picture.

Select OBS Virtual Camera in a VDO.Ninja browser publisher. Route game audio through a virtual audio device if the combined feed needs it; Virtual Camera itself carries video only. This reduces the production OBS from as many as ten live decodes to five, but it adds a browser encode and audio routing on each gaming computer. Unlike the Ninja OBS Plugin's publishing path, Virtual Camera does not consume OBS's Twitch streaming-output slot.

### 4. Route Discord and game audio only once

Audio duplication is the most common failure in this setup.

* Everyone should use headphones.
* Camera publishing links should have no microphone audio.
* Game Capture should send the game/window audio, not the full desktop mix containing Discord.
* The active OBS captures Discord application audio once.
* The active operator also adds their own microphone to OBS, because their microphone is not normally present in Discord's local output capture.
* For the active operator's own game, use either the local game source or its VDO.Ninja return, never both.
* Leave OBS monitoring off unless a deliberate mix-minus has been tested.

Record a short local sample with all members talking and playing. Confirm that every voice and game is present once, with no delayed duplicate.

### 5. Use a break-before-make handoff

Use a private Discord text channel as the on-air lock. Exactly one person may own it.

1. The incoming operator opens OBS, loads the shared program scene, and confirms video and meters.
2. The incoming operator writes `READY` in the control channel.
3. The outgoing operator stops only the Twitch output and writes `OFF AIR`. Their Game Capture and camera contribution can remain live.
4. The incoming operator starts their Twitch output with their own guest stream key.
5. Confirm the channel is live from Twitch's dashboard or a separate device.
6. The old operator closes the full program receiver unless they are remaining as the immediate standby.

Do not deliberately overlap two Twitch outputs. The stop/start order is easy to rehearse and avoids treating Twitch as a mixer. Expect a short interruption; Disconnect Protection may cover a brief encoder loss with its slate, but test the exact handoff before relying on it.

If the current operator disappears unexpectedly, another authorized member can start their OBS output. Depending on timing and Twitch state, viewers may see the disconnect slate or a stream restart.

## Solution 2: keep one production OBS online

An always-on production computer is the best match for both low player impact and clean operator takeover.

```text
Players -> VDO.Ninja -> dedicated OBS -> Twitch
                              ^
                    authorized remote control
```

The production OBS can run on a spare desktop at a member's home or on suitable hosted hardware. It owns the Twitch connection, common overlays, browser sources, and Discord/program audio routing. Members take control of that OBS rather than replacing the Twitch encoder.

Join the production computer to the Discord call with its microphone disabled, then capture that Discord output in OBS. Because every participant is remote from this computer, their voices arrive in one mix; do not also enable microphone audio on their VDO.Ninja camera feeds.

Benefits:

* joining feeds still appear automatically;
* a member leaving does not disconnect Twitch;
* handoff means changing control, not changing encoder;
* gaming computers only publish their own feeds; and
* the Twitch key exists on one production machine.

OBS includes obs-websocket in OBS 28 and newer. Keep authentication enabled, use a strong unique password, and reach it through a private VPN or equivalent trusted network. Do not expose the obs-websocket port directly to the public Internet. Remote desktop is another option, although it should also be protected with strong authentication and restricted network access.

The production computer should use wired networking, a hardware H.264 encoder, and enough GPU decode/composition capacity for all live feeds. A UPS and automatic OBS launch are worthwhile if the machine is expected to be available without an operator on site.

This design still has one production-computer and one-site failure domain. Add a standby if that matters.

## Solution 3: active/standby production or a private relay

For higher uptime, keep two matching production encoders or place a switching relay in front of Twitch.

### Active/standby OBS

The primary OBS sends to Twitch. The standby keeps the same scene ready and may receive confidence feeds, but it does not transmit until the primary fails. A health check or operator initiates the takeover.

This is simpler than a full relay, but Twitch still sees an encoder reconnection. Keep the standby's full VDO.Ninja receive path closed until needed, or accept that every extra live receiver adds upload/network work for contributors.

### Stable relay output

A relay design keeps one outbound session connected to Twitch and switches between private contribution inputs:

```text
Operator A program --\
Operator B program ----> authenticated switch/relay -> one Twitch output
Fallback slate -------/
```

The control layer should provide one active lease, a visible owner, a manual **Take over** action, a heartbeat, and a fallback slate. It must reject simultaneous ownership rather than guessing which operator wins.

This can make failover nearly invisible to Twitch, but it adds server administration, monitoring, bandwidth, latency, and possibly another encode generation. Standardize resolution, frame rate, keyframe interval, and audio layout across every input before attempting automatic switching.

VDO.Ninja can continue carrying the individual player feeds in this design; the relay only stabilizes the final program output.

## A small helper app can reduce the remaining clicks

A purpose-built VDO.Ninja example app could later add:

* a roster showing which POV and camera feeds are healthy;
* a clearly visible current Twitch operator;
* an expiring on-air lease with **Ready**, **Release**, and **Take over** actions;
* a handoff countdown and acknowledgement; and
* optional control of the local or dedicated OBS through authenticated obs-websocket.

Such an app should never store or transmit Twitch stream keys. It can coordinate operators and OBS, but only an always-on encoder or relay can preserve the same Twitch output session through a workstation handoff.

## Performance guidelines

Start conservatively and increase quality after a full-group test:

* use 720p30 or 720p60 for gameplay contributions before attempting 1080p60 from every player;
* use 360p30 or 720p30 for small webcam overlays;
* use a phone for the webcam when practical so the gaming computer only encodes the gameplay contribution;
* use a [hardware encoder in OBS](https://obsproject.com/kb/hardware-encoding) to reduce CPU load;
* cap the game's frame rate so OBS retains GPU headroom;
* keep contributor pages in publish-only mode with the empty `&view` parameter;
* let only the active program OBS, and briefly a standby during handoff, receive every feed;
* prefer wired Ethernet for the current operator or dedicated production machine; and
* watch OBS **Stats** for rendering lag, encoding lag, and network-dropped frames separately.

VDO.Ninja is peer-to-peer by default. Each additional active production receiver increases contributor upload demand even when a sender can reuse its encode. A single dedicated production receiver is therefore usually lighter than keeping five complete OBS program views open.

## Rehearsal checklist

Before the first public show:

* join every permanent game and camera ID in a different order;
* confirm late arrivals appear without changes in the active OBS;
* confirm Discord voices and game audio are present exactly once;
* leave and rejoin one contributor;
* perform a planned operator handoff;
* unplug or close the current operator unexpectedly and test recovery;
* verify that two operators cannot accidentally believe they are on air;
* check Twitch's dashboard and the public player after each transition; and
* save a local OBS recording of the test for audio and frame-drop review.

The replicated-OBS design is a good starting point. If the handoff interruption or gaming-PC load becomes unacceptable, move the same VDO.Ninja sources and scene collection to an always-on production computer; the contribution links do not need to change.

## Related guides

* [Using Game Capture and Spout2 with VDO.Ninja](using-game-capture-with-vdo.ninja.md)
* [Using the Ninja OBS Plugin with VDO.Ninja](using-ninja-obs-plugin-with-vdo.ninja.md)
* [How to send the output of one OBS to another](how-to-send-the-audio-video-output-of-one-obs-to-another-obs-using-vdo.ninja.md)
* [Permanent VDO.Ninja links and stream IDs](how-to-get-permanent-links.md)
* [System requirements for streaming](system-requirements-for-streaming.md)
* [Enabling WebRTC sources in OBS](enabling-webrtc-sources-in-obs.md)
