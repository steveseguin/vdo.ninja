---
description: The total bitrate a guest in a room can view video streams with
---

# \&totalroombitrate

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&totalroomvideobitrate`
* `&trb`

## Options

| Value           | Description                                    |
| --------------- | ---------------------------------------------- |
| (integer value) | set this to be the total combined room bitrate |
| 500             | default value                                  |

## Description

The total bitrate a guest in a room can view video streams with; their combined bitrate total of all inbound video streams.

Split between the number of streams that guest is viewing

So for example, with 6-guests in a room, the default of 500-kbps will have each guest requesting 100-kbps from each other. 5 streams x 100-kbps.



{% hint style="info" %}
Please note the difference between `&totalroombitrate` and `&maxtotalscenebitrate.   &trb`controls what the total bitratef or guests in a room is limited to. `&maxtotalscenebitrate, on the other hand,` is what you will want if you want to do the same for a view-link, added to OBS, for example.&#x20;

\
For more information, see:  [https://docs.vdo.ninja/advanced-settings/video-parameters/and-maxtotalscenebitrate](https://docs.vdo.ninja/advanced-settings/video-parameters/and-maxtotalscenebitrate)


{% endhint %}





### Limitations

Total room bitrate does not override any limits other guests in the room may have set to limit their outbound bandwidth.\
\
Mobile devices are also coded to typically refuse requests of higher bitrates by other guests, even with a high total room bitrate set. Mobile devices will quickly overheat if publishing to many guests using software-encoding, so they are treated somewhat special.

In general, setting a high total room bitrate will increase the CPU and network requirements of the group room. Higher bitrates mean higher resolution, which means higher compute loads, so some computers may become overloaded. The default of 500-kbps seems low, but it was carefully selected to reduce such issues as much as reasonable.\
\
Consider using [`&broadcast`](broadcast.md), combined with either a powerful host computer or a service like [Meshcast.io](https://meshcast.io/) if you'd like to share high quality video to a larger room. A high total room bitrate value may cause severe problems in large rooms or on slower computers.

### Director's ability to control

If the director joins the room, they automatically set the default total room bitrate for every guest that joins the room; guests will match the director's value. This feature may even override the URL-parameter that any guest might have added to their URL already, depending on version of VDO.Ninja. (still being tweaked based on user feedback)

The director can also dynamically change their total room bitrate value using a slider that appears when pressing the room-settings button in the lower control bar. This will instantly change the total room bitrate value for all guests.

![The director can change the room's default TRB value dynamically](<../../.gitbook/assets/image (28).png>)

## Related

{% content-ref url="../../source-settings/roombitrate.md" %}
[roombitrate.md](../../source-settings/roombitrate.md)
{% endcontent-ref %}

{% content-ref url="and-controlroombitrate.md" %}
[and-controlroombitrate.md](and-controlroombitrate.md)
{% endcontent-ref %}
