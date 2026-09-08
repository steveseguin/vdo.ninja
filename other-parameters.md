---
description: Not ready for production, not intended to be used or not well-documented
---

# Other Parameters

There are some more parameters on [VDO.Ninja](https://vdo.ninja/) which are currently not ready for production, not intended to be used, or not well-documented.

You could find out more about these parameters when searching for them on this link:\
[https://github.com/steveseguin/vdo.ninja/blob/develop/main.js](https://github.com/steveseguin/vdo.ninja/blob/develop/main.js)

<table><thead><tr><th width="262.57142857142856">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><code>&#x26;crop</code></td><td>Changes the aspect ratio on the publisher side, but lets you pass an integer value to represent a percentile cropping value.<br><br>So, <code>&#x26;crop=10</code> will reduce the width by 90% and <code>&#x26;crop=-10</code> will increase the aspect ratio. The assumed base aspect ratio is 16:9.</td></tr><tr><td><code>&#x26;debug</code></td><td>Sends live debug log data to a remote server. That debug server is normally off, but this flag can be used by Steve to debug issues remotely. The debug data is not stored at any point.</td></tr><tr><td><code>&#x26;directorview</code></td><td>Not currently an active feature.</td></tr><tr><td><code>&#x26;nomouseevents</code></td><td>Disables 'some' of the mouse/touch/drag triggers and events; for debugging and niche situations.</td></tr><tr><td><code>&#x26;nonacks</code></td><td><p>'Tries' to force the browser to not send key frames or lower quality/resolution; doesn't really work.</p><p>Tells the browser to not send NACK feedback.</p></td></tr><tr><td><code>&#x26;nopli</code></td><td>Tries to find ways to combat frame stutter caused by packet loss or key frame requests. Doesn't really work.<br><br>Tells the browser to not send picture loss indicators.</td></tr><tr><td><code>&#x26;noremb</code></td><td>Deletes the flag for Chrome's bandwidth estimation logic.</td></tr><tr><td><code>&#x26;pusheffectsdata</code></td><td>Makes the data for the active digital effect available to the IFRAME API or a remote guest.</td></tr><tr><td><code>&#x26;retry</code></td><td>Used in rare cases, sometimes with the Raspberry Ninja project, where the peer connection may "crash" and the remote viewer won't bother to try reconnecting.</td></tr><tr><td><code>&#x26;retrytimeout</code></td><td>Should not be changed (value in milliseconds).</td></tr><tr><td><code>&#x26;salt</code></td><td>Mainly to allow <a href="steves-helper-apps/versus.cam.md">Versus.cam</a> to work with VDO.Ninja.</td></tr><tr><td><code>&#x26;slot</code></td><td>Not currently an active feature.</td></tr><tr><td><code>&#x26;speedtest</code></td><td>Forces essentially UDP mode, unless TCP is specified, and some other stuff.</td></tr><tr><td><code>&#x26;viewereffect</code></td><td><strong>Deprecated</strong>; no longer used by the app.</td></tr><tr><td><code>&#x26;wss</code></td><td>Specify the handshake server address to use.</td></tr><tr><td><code>&#x26;graphs</code></td><td>?</td></tr><tr><td><code>&#x26;lowmobilebitrate</code></td><td>?</td></tr><tr><td><code>&#x26;maxmobilebitrate</code></td><td>?</td></tr><tr><td><code>&#x26;minroombitrate</code></td><td>?</td></tr><tr><td><code>&#x26;sendframes</code></td><td>?</td></tr><tr><td><code>&#x26;overlaycontrols</code></td><td>?</td></tr><tr><td><code>&#x26;pushloudness</code></td><td>Enables continuous IFRAME loudness updates (same behavior as getLoudness=true)</td></tr><tr><td><code>&#x26;hangupbutton</code></td><td>?</td></tr><tr><td><code>&#x26;socialstream</code></td><td>?</td></tr><tr><td><code>&#x26;fakeuser</code></td><td>?</td></tr><tr><td><code>&#x26;androidfix</code></td><td>?</td></tr><tr><td><code>&#x26;scenelinkcodec</code></td><td>This is mainly for a niche IFRAME API use</td></tr><tr><td><code>&#x26;scenelinkbitrate</code></td><td>This is mainly for a niche IFRAME API use</td></tr><tr><td><code>&#x26;showheader</code></td><td>Forces the header bar to show even if using <a href="advanced-settings/design-parameters/cleanoutput.md"><code>&#x26;cleanoutput</code></a> for example</td></tr><tr><td><code>&#x26;degrade</code></td><td>Firefox, and maybe Safari, supported I think. The possible values are <code>maintain-framerate</code>, <code>maintain-resolution</code>, or <code>balanced</code>. The default value is balanced.</td></tr><tr><td><code>&#x26;iframetarget</code></td><td>Specifies the IFRAME Hostname target</td></tr><tr><td><code>&#x26;bypass</code></td><td>?</td></tr><tr><td><code>&#x26;mixminus</code></td><td>N-1 (mix-minus) routing option for advanced room workflows.</td></tr><tr><td><code>&#x26;nopassword</code></td><td>?</td></tr><tr><td><code>&#x26;micsamplerate</code></td><td>Lets you specify the capture audio sample rate. Also added purely for experimental reasons; I don't recommend touching.</td></tr><tr><td><code>&#x26;insertablestreams</code></td><td>Enables a special mode that allows for custom codecs</td></tr><tr><td><code>&#x26;leaveorientationflag</code></td><td>?</td></tr><tr><td><code>&#x26;motionrecord</code></td><td>Switch OBS to this scene when there is motion, and "solo view" this video in the VDO.Ninja auto-mixer, if used</td></tr><tr><td><code>&#x26;alpha</code></td><td>Fixed <a href="advanced-settings/view-parameters/webp.md"><code>&#x26;webp</code></a> + <a href="advanced-settings/view-parameters/codec.md#webp"><code>&#x26;codec=webp</code></a> + <code>&#x26;alpha</code> so it properly supports alpha channels. If your needs are modest it can offer transparent streaming video when using <a href="source-settings/and-fileshare.md"><code>&#x26;fileshare</code></a> /w a transparent WebM video source (or a virtual background /w a transparent png)</td></tr><tr><td><code>&#x26;ipv6</code></td><td><code>=0</code>/<code>false</code> prefers IPv4 and drops IPv6 candidates; <code>=1</code> explicitly allows IPv6. (Default prefers IPv4 but still allows IPv6.)</td></tr><tr><td><code>&#x26;discordwebhook</code> / <code>&#x26;dwh</code></td><td>Send disconnect alerts to a Discord webhook (viewer disconnects that fail to reconnect). If the value lacks <code>https://discord.com/api/webhooks/</code>, it is prefixed automatically.</td></tr><tr><td><code>&#x26;discordwebhook2</code> / <code>&#x26;dwh2</code></td><td>Same as above but also fires on normal hangups; treat as sensitive.</td></tr><tr><td><code>&#x26;tips</code></td><td>Show the guest help screen. For tipping, use <code>&#x26;tip=ID</code> on the sender and <code>&#x26;showtips</code> on the viewer; see <a href="https://ninjabacker.com/guide">NinjaBacker setup</a></td></tr></tbody></table>

## Mix-Minus (`&mixminus`)

Mix-minus, also called N-1, is a return mix that excludes the recipient's own audio. For example, guest A receives the host, guest B, and playback audio; guest B receives the host, guest A, and playback audio. Each guest's separate microphone feed is omitted from their own return.

`&mixminus` (alias `&mm`) enables director-hosted mix-minus on a director or co-director link. The browser builds a separate return for each guest, including the director's outgoing audio and other received guest audio by default.

### Enable director-hosted mix-minus

Add the flag to the director URL before joining:

`https://vdo.ninja/?director=ROOM&mixminus`

Replace `ROOM` with your room name and preserve any other required room parameters. For this workflow, put the flag on the director that will host the mixes; guests do not need it on their invite links. A co-director can also host mixes, but enabling multiple mixers can introduce additional copies of the same audio.

The mixing browser needs an active audio context, access to the source audio, and an outbound peer audio connection to each recipient. Keep that browser connected throughout the session. A visible Mix control alone does not guarantee that an outbound audio sender exists.

**The flag does not disable normal guest-to-guest audio.** If a guest hears another participant directly and through the director's mix, they may hear doubled or delayed audio. Plan and test the complete routing; adding the flag alone does not convert an ordinary room into a single-path audio system.

### Choose what a guest hears

In the director control center, open the listener's **Additional Controls**, find **PGM / Mic**, and select **Mix**. Choose the sources for that listener:

* **Director Mix** includes the director's processed outgoing audio.
* Raw input devices can be selected separately. Avoid including the same microphone through both a raw input and Director Mix.
* **Guests** lets you select other received audio sources. The listener's own connection is excluded automatically.

The per-guest Mix control can also be used without the URL flag for a targeted route. Without `&mixminus`, other guests are excluded initially; with it, other guests are included by default.

Opening the menu enables the custom mix and may immediately replace the outbound audio track. Closing it only hides the menu. There is currently no reliable one-click restoration of the original director audio track; uncheck sources to stop relaying them and verify what the listener hears. See [Guest Audio Recovery and Mesh Debug](guides/mesh-network-debug.md#emergency-audio-patch-send-b-to-a-with-mix) for the detailed recovery procedure.

### Common uses

| Use case | Routing approach |
| --- | --- |
| Interviews, panels, or remote production | Give each participant the host and selected other speakers, excluding their own feed. Check for duplicate direct audio paths. |
| Playback clips or music for participants | Bring playback into Ninja as a separate audio source or as part of the director's outgoing audio, then include it in the required returns. |
| A missing guest-to-guest audio connection | Use the listener's Mix control to relay only the missing speaker. Remove that source from the custom mix when the direct connection recovers. |
| Phone or external conferencing bridges | Build a return excluding the caller or conference audio before sending it back to that endpoint. See [phone call-in routing](guides/phone-call-ins-with-vdo-ninja-and-virtual-audio-cables.md). |

### OBS scene changes and program returns

Keeping voices audible while switching cameras or screen shares is a separate routing task. One approach is a room scene link with `&novideo` as an audio-only OBS browser source, reused in every required scene. Mute duplicate audio on the visual sources and ensure the audio source remains active during transitions. `&mixminus` controls participant returns; it does not keep OBS sources active across scene changes.

For playback from OBS, create a return containing only the sources that participants should hear, such as clips, music, or the host microphone. Exclude incoming room audio from that shared return. See [Send an OBS return feed to guests](guides/send-an-obs-return-feed-to-guests.md).

**Mix-minus cannot remove a voice already embedded in a mixed input.** If the OBS program feed contains guest A, excluding A's separate Ninja connection does not remove A from that program feed. Keep sources separate until the return mix is built, or create the required mix-minus upstream in the mixer or routing software.

### Limits and checks before going live

* These custom returns use individual peer audio connections. Meshcast does not provide this per-recipient mix-minus routing; do not assume a shared Meshcast program feed can supply a different return to each guest.
* A second connection carrying the same person's microphone is a separate source. Excluding their main connection does not automatically exclude that duplicate.
* Mix-minus does not prevent acoustic feedback from speakers into microphones. Use headphones where possible; see [`&noheadphones`](source-settings/noheadphones.md) for speaker-based setups.
* Have each participant speak, play a clip, and switch production scenes. Confirm that everyone hears each intended source once and never hears their own delayed voice.
* Recheck after reconnecting a guest or restoring a failed direct connection. If audio doubles, inspect both the direct path and the selected custom-mix sources.
