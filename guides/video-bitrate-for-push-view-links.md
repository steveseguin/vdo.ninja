---
description: How to control video bitrates for basic push/view links
---

# Video bitrate for push/view links

## The default settings

The default video bitrate for simple push/view links is 2500-kbps.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
By default, both outgoing and incoming video bitrates are set at 2500-kbps.  This default setting and parameters are different if using [Rooms ](../getting-started/rooms/)and explained in detail [here](video-bitrate-in-rooms.md).

There are five parameters we will take a look at:

1. [\&outboundvideobitrate (\&ovb)](../advanced-settings/video-bitrate-parameters/and-outboundvideobitrate.md) -> push side
2. [\&maxvideobitrate (\&mvb)](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md) -> push side
3. [\&limittotalbitrate (\&ltb)](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) -> push side
4. [\&videobitrate (\&vb)](../advanced-settings/video-bitrate-parameters/bitrate.md) -> view side
5. [\&totalscenebitrate (\&tsb)](../advanced-settings/video-bitrate-parameters/and-totalscenebitrate.md) -> view side

## On the source side ([\&push](../source-settings/push.md))

### The push link sets the default outgoing video bitrate target

[`&outboundvideobitrate (&ovb)`](../advanced-settings/video-bitrate-parameters/and-outboundvideobitrate.md)\
Sets the sender-side default target bitrate for outgoing streams.

[https://vdo.ninja/?push=streamid\&ovb=4000](https://vdo.ninja/?push=streamid\&ovb=4000)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
The push link sets the outgoing default target to 4000-kbps. The view link doesn't need an additional parameter unless you want to override the default.

[https://vdo.ninja/?push=streamid\&ovb=4000](https://vdo.ninja/?push=streamid\&ovb=4000)\
[https://vdo.ninja/?view=streamid\&vb=2000](https://vdo.ninja/?view=streamid\&vb=2000)\
\
In this case the viewer requests 2000-kbps, which overrides the push-side default target (unless capped by a max).

Depending on browser/negotiation, `&ovb` can be enforced via SDP munging and may also cap the maximum bitrate.

### The push link sets a software max bitrate per stream out

[`&maxvideobitrate (&mvb)`](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md)\
`&mvb` sets a software-enforced cap per stream out. Viewer requests (`&vb`) and sender defaults (`&ovb`) cannot exceed it.

[https://vdo.ninja/?push=streamid\&mvb=1000](https://vdo.ninja/?push=streamid\&mvb=1000)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
Every view link will be capped to 1000-kbps, even if it requests a higher bitrate.

### The push link limits the video bitrate to a maximum defined value

[`&limittotalbitrate (&ltb)`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md)\
Limits the total outbound video bitrate to a defined value.

[https://vdo.ninja/?push=streamid\&ltb=5000](https://vdo.ninja/?push=streamid\&ltb=5000)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
The incoming video bitrate will still default to around 2500-kbps but permits the viewer to increase it on their end with `&ltb` telling the push link to not get higher than 5000-kbps total outgoing bitrate.

## On the viewer side ([\&view](../advanced-settings/view-parameters/view.md))

### The view link sets the video bitrate per stream in

[`&videobitrate (&vb)`](../advanced-settings/video-bitrate-parameters/bitrate.md)\
The view link is setting the target video bitrate per incoming stream.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid\&vb=2000](https://vdo.ninja/?view=streamid\&vb=2000)\
\
The view link is setting the bitrate per incoming stream (in this case 2000-kbps). So if you have a view link with three incoming video feeds: `&view=stream1,stream2,stream3` - every source is pushing 2000-kbps as `&vb=2000` and the view link has a combined bitrate of 6000-kbps.

Depending on browser/negotiation, `&vb` can be enforced via SDP munging and may also cap the maximum bitrate.

### The view link sets the total video bitrate for all incoming streams combined

[`&totalscenebitrate (&tsb)`](../advanced-settings/video-bitrate-parameters/and-totalscenebitrate.md)\
This is similar to [`&vb`](video-bitrate-for-push-view-links.md#the-view-link-sets-the-video-bitrate-per-stream-in) but it sets the target and maximum bitrate for all incoming streams combined.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid\&tsb=3000](https://vdo.ninja/?view=streamid\&tsb=3000)\
\
So if you have a view link with three incoming video feeds: `&view=stream1,stream2,stream3` - every source is pushing 1000-kbps as `&tsb=3000`.&#x20;

## Mixing the parameters

As doing some testing there were these results:

All three push parameters cap the maximum. If you set one of these values, the outgoing video bitrate will never be higher than that limit.

`&tsb` always limits the bitrate on the viewer side (total across streams). `&vb` sets the viewer target per stream, but it can be capped by sender-side limits or SDP munging.

* `&vb` overrides the default target from `&ovb`
* `&mvb` is a software max cap, regardless of `&vb` or `&ovb`
* `&tsb` caps the total incoming bitrate across all streams

## Related

{% content-ref url="../advanced-settings/video-bitrate-parameters/" %}
[video-bitrate-parameters](../advanced-settings/video-bitrate-parameters/)
{% endcontent-ref %}

{% content-ref url="video-bitrate-in-rooms.md" %}
[video-bitrate-in-rooms.md](video-bitrate-in-rooms.md)
{% endcontent-ref %}
