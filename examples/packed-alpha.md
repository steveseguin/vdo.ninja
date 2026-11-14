# Packed alpha video extension

`packed-sbs-v1` carries color and opacity in one ordinary WebRTC video track.
It uses the connection's existing data channel and the usual `sendMessage`
(publisher to viewer) and `sendRequest` (viewer to publisher) methods. It does
not add SDP attributes, another track, another connection, or a signaling
fallback. Audio keeps its existing track and timing.

## Frame format

For a logical image of width W and height H, the decoded carrier is 2W by H:
straight RGB occupies the left half and a grayscale opacity mask occupies the
right half. Black is transparent; white is opaque. W and H are even. Both
halves represent the same source frame. The viewer reconstructs premultiplied
RGBA for browser compositing. Video compression makes the mask approximate.

## Announcement and acknowledgement

After negotiating the video track and opening the data channel, the publisher
announces its format in a separate message:

```json
{ "alpha_send": "packed-sbs-v1", "alpha_mid": "0" }
```

`alpha_mid` is the actual negotiated video MID, as a string. `"0"` is only an
example. These are top-level command fields, not `info` or `miniInfo` metadata.

The viewer binds the announcement to that connection, receiving transceiver,
and video track. It allocates alpha state only after identifying the announced
track. Once its renderer is prepared and its output canvas is mounted in a
supported presentation mode, it responds:

```json
{ "alpha_receive": "packed-sbs-v1", "alpha_mid": "0" }
```

The publisher must withhold packed video until this acknowledgement arrives
on the current connection for the matching negotiated MID. Start with a fresh
keyframe. Preparing the viewer must not depend on receiving a video frame;
otherwise both ends would wait indefinitely. Browser autoplay may still require
a user gesture.

## Decline and withdrawal

Preparation failure, an unsupported viewing mode, or loss of an acknowledged
renderer uses the same acknowledgement fields with an empty string:

```json
{ "alpha_receive": "", "alpha_mid": "0" }
```

The viewer sends this even if preparation failed before a positive
acknowledgement. It stops rendering, cancels alpha frame callbacks, and releases
its canvas and GPU resources. The underlying packed video remains hidden;
snapshots return decoded RGBA only when available, otherwise they decline.
Frames already in flight must never expose the color/mask carrier.

Withdrawal stops the publisher's video for that viewer. It never authorizes
ordinary video on the packed track. Missing acknowledgements likewise leave
video stopped. Unknown acknowledgement values, wrong MIDs, and messages from
retired connections do not grant readiness. There is no retry protocol or
metadata-based compatibility fallback. Disconnect invalidates readiness; a
new connection needs its own announcement and acknowledgement.

## Track lifetime and presentation

The format remains fixed for the negotiated receiving track. Replacing a
camera or Spout source may preserve that track and therefore must preserve the
packed format. An opaque replacement has a white mask. Source size changes
preserve the equal color/mask halves and even logical dimensions. A format
change requires a fresh negotiated receiving track and handshake.

The initial VDO.Ninja implementation declines manual presentation mode and
unavailable WebGL or output mounting. Context loss is terminal for that alpha
renderer; reconnect the viewer to prepare a fresh one. Existing video mute
controls may withdraw readiness and prepare again when the video is resumed.
Temporary layout removal also withdraws readiness without failing the track.
When the layout mounts the output again, existing configuration prepares the
renderer and acknowledges readiness again, without a new announcement or retry
timer. This also applies when mounting was unavailable at the first announcement.

All alpha resources belong to `rpc.packedAlpha`. Ordinary video and the 2D
chroma renderer retain their existing behavior. Unannounced ordinary tracks
create no alpha state, timers, renderer, or feature messages. The existing
VP9 dual-track OBS integration is a separate contract.
