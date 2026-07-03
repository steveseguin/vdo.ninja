---
description: The total bitrate a guest in a room can view video streams with
---

# \&totalroombitrate

Room Option! ([`&room`](../../general-settings/room.md))\
Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&totalroomvideobitrate`
* `&trb`

## Options

Example: `&totalroombitrate=4000` or `&totalroombitrate=2000,1000`

| Value           | Description                                    |
| --------------- | ---------------------------------------------- |
| (integer value) | set this to be the total combined room bitrate |
| `1000,500`      | Desktop bitrate, Smartphone bitrate            |

## Details

The total bitrate a guest in a room can view video streams with; their combined bitrate total of all inbound room video streams. This is commonly shortened to `&trb`.

{% hint style="info" %}
The default value is 500-kbps.
{% endhint %}

The value is split between the number of visible streams that guest is viewing.

So for example, with 6-guests in a room, the default of 500-kbps will have each guest requesting 100-kbps from each other. 5 streams x 100-kbps.

For guest-only conferencing rooms, VDO.Ninja may use automatic room-only tiers when no explicit total room bitrate is set and no director or scene viewer is connected. These tiers raise the default room budget for normal or stronger devices while keeping weaker mobile devices more protected. See [room-only-mobile-bitrate-tiers.md](../../guides/room-only-mobile-bitrate-tiers.md "mention") for the high-level guide.

This parameter is for room guest-to-guest viewing. For scene, solo, or normal view-link quality, use [`&videobitrate`](bitrate.md) or [`&totalscenebitrate`](and-totalscenebitrate.md) instead.

### Persistence

The room name itself does not permanently save a `&totalroombitrate` value. To make a room consistently start at a higher bitrate, include the parameter in the links used to join the room.

For a director-led room, put it on the director/host link:

`https://vdo.ninja/?director=RoomName&trb=4000`

If several people might be the main director/host, each of their director links should include the same value.

For a room used without a director, put it on the guest room link:

`https://vdo.ninja/?room=RoomName&trb=4000`

In that case it affects that guest's own room receive budget. It does not permanently set the room for every other guest unless their links also include the same value.

### Two values

`&totalroombitrate` can take two values; the second of which gets used if the device is a 'mobile' device, while the first gets used otherwise. ie: `&totalroombitrate=1000,500`\
Useful if you don't know if the guest is going to join via Desktop or via Smartphone, and you wish to avoid overloading a mobile device.

{% hint style="info" %}
Please note the difference between `&totalroombitrate` and [`&totalscenebitrate`](and-totalscenebitrate.md). `&totalroombitrate`controls what the total bitrate for guests in a room is limited to. [`&totalscenebitrate`](and-totalscenebitrate.md), on the other hand, is what you will want if you want to do the same for a view-link, added to OBS, for example.
{% endhint %}

### Limitations

Total room bitrate does not override any limits other guests in the room may have set to limit their outbound bandwidth.

Mobile devices are also coded to typically refuse requests of higher bitrates by other guests, even with a high total room bitrate set. Mobile devices will quickly overheat if publishing to many guests using software-encoding, so they are treated somewhat special.

In general, setting a high total room bitrate will increase the CPU and network requirements of the group room. Higher bitrates mean higher resolution, which means higher compute loads, so some computers may become overloaded. The default of 500-kbps seems low, but it was carefully selected to reduce such issues as much as reasonable.

Consider using [`&broadcast`](../view-parameters/broadcast.md), combined with either a powerful host computer or a service like [Meshcast.io](https://meshcast.io/) if you'd like to share high quality video to a larger room. A high total room bitrate value may cause severe problems in large rooms or on slower computers.

### Director's ability to control

If the director joins the room, they automatically set the default total room bitrate for every guest that joins the room; guests will match the director's value. This feature may even override the URL-parameter that any guest might have added to their URL already, depending on version of VDO.Ninja. (still being tweaked based on user feedback)

The director can also dynamically change their total room bitrate value using a slider that appears when pressing the room-settings button in the lower control bar. This will instantly change the total room bitrate value for all guests in the active room, but it is not a permanent saved room setting after everyone leaves.

### Priority order

1. The connected main director's current room bitrate value takes priority for guests.
2. If no main director is controlling the value, each guest uses their own URL value, such as `&trb=4000`.
3. If `&totalroombitrate` / `&trb` is not set, `&videobitrate` can initialize that guest's total room bitrate target.
4. If no explicit bitrate is set, VDO.Ninja uses the default room behavior. Guest-only rooms may use automatic room-only bitrate tiers.

![The director can change the room's default TRB value dynamically](<../../.gitbook/assets/image (28) (1).png>)

There is a toggle in the director's room which adds `&trb=2000` to the guest's invite link.

![](<../../.gitbook/assets/image (94) (1).png>)

## Related

{% content-ref url="roombitrate.md" %}
[roombitrate.md](roombitrate.md)
{% endcontent-ref %}

{% content-ref url="and-totalbitrate.md" %}
[and-totalbitrate.md](and-totalbitrate.md)
{% endcontent-ref %}

{% content-ref url="and-controlroombitrate.md" %}
[and-controlroombitrate.md](and-controlroombitrate.md)
{% endcontent-ref %}

{% content-ref url="../../guides/video-bitrate-in-rooms.md" %}
[video-bitrate-in-rooms.md](../../guides/video-bitrate-in-rooms.md)
{% endcontent-ref %}
