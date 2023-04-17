---
description: How to control video bitrates for basic push/view links
---

# Video bitrate for push/view links

## The default settings

The default video bitrate for simple push/view links is 2500-kbps.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
There will be a outgoing video bitrate of 2500-kbps on the source side and 2500-kbps incoming video bitrate on the viewer side.

There are five parameters we will take a look at:

1. [\&outboundvideobitrate (\&ovb)](../advanced-settings/video-bitrate-parameters/and-outboundvideobitrate.md) -> push side
2. [\&maxvideobitrate (\&mvb)](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md) -> push side
3. [\&limittotalbitrate (\&ltb)](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md) -> push side
4. [\&videobitrate (\&vb)](../advanced-settings/video-bitrate-parameters/bitrate.md) -> view side
5. [\&totalscenebitrate (\&tsb)](../advanced-settings/video-bitrate-parameters/and-totalscenebitrate.md) -> view side

## On the source side ([\&push](../source-settings/push.md))

### The push link sets the target and maximum outgoing video bitrate

[`&outboundvideobitrate (&ovb)`](../advanced-settings/video-bitrate-parameters/and-outboundvideobitrate.md)\
Sets the target and maximum outgoing video bitrate on the source side.

[https://vdo.ninja/?push=streamid\&ovb=4000](https://vdo.ninja/?push=streamid\&ovb=4000)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
The push link sets the outgoing video bitrate to 4000-kbps. The view link sees the video with a video bitrate of 4000-kbps.

### The push link sets the video bitrate per stream out

[`&maxvideobitrate (&mvb)`](../advanced-settings/video-bitrate-parameters/and-maxvideobitrate.md)\
`&mvb` is similar to `&ovb` but it sets the target and maximum bitrate per stream out.

[https://vdo.ninja/?push=streamid\&mvb=1000](https://vdo.ninja/?push=streamid\&mvb=1000)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
Every view link has a video bitrate of 1000-kbps.

### The push link limits the video bitrate to a maximum defined value

[`&limittotalbitrate (&ltb)`](../advanced-settings/video-bitrate-parameters/limittotalbitrate.md)\
Limits the total outbound video bitrate to a defined value.

[https://vdo.ninja/?push=streamid\&ltb=5000](https://vdo.ninja/?push=streamid\&ltb=5000)\
[https://vdo.ninja/?view=streamid](https://vdo.ninja/?view=streamid)\
\
The video bitrate will be around 2500-kbps (default value), because `&ltb` only tells the push link to not get higher than 5000-kbps.

## On the viewer side ([\&view](../advanced-settings/view-parameters/view.md))

### The view link sets the video bitrate per stream in

[`&videobitrate (&vb)`](../advanced-settings/video-bitrate-parameters/bitrate.md)\
The view link is setting the target and maximum video bitrate per incoming stream.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid\&vb=2000](https://vdo.ninja/?view=streamid\&vb=2000)\
\
The view link is setting the bitrate per incoming stream (in this case 2000-kbps). So if you have a view link with three incoming video feeds: `&view=stream1,stream2,stream3` - every source is pushing 2000-kbps as `&vb=2000` and the view link has a combined bitrate of 6000-kbps.

### The view link sets the total video bitrate for all incoming streams combined

[`&totalscenebitrate (&tsb)`](../advanced-settings/video-bitrate-parameters/and-totalscenebitrate.md)\
This is similar to [`&vb`](video-bitrate-for-push-view-links.md#the-view-link-sets-the-video-bitrate-per-stream-in) but it sets the target and maximum bitrate for all incoming streams combined.

[https://vdo.ninja/?push=streamid](https://vdo.ninja/?push=streamid)\
[https://vdo.ninja/?view=streamid\&tsb=3000](https://vdo.ninja/?view=streamid\&tsb=3000)\
\
So if you have a view link with three incoming video feeds: `&view=stream1,stream2,stream3` - every source is pushing 1000-kbps as `&tsb=3000`.&#x20;

## Mixing the parameters

As doing some testing there were these results:

All the three push parameters are always limiting the maximum. So if you set one of the three parameters to a value, the outgoing video bitrate will never be higher than you set it.

`&tsb` also always limits the bitrate on the viewer side, whereas `&vb` is overwritten by `&ovb` and `&mvb`.

* `&ovb` is overwriting `&vb`
* `&mvb` is overwriting `&vb`
* `&tsb` is stronger than `&ovb`

## Related

{% content-ref url="../advanced-settings/video-bitrate-parameters/" %}
[video-bitrate-parameters](../advanced-settings/video-bitrate-parameters/)
{% endcontent-ref %}

{% content-ref url="video-bitrate-in-rooms.md" %}
[video-bitrate-in-rooms.md](video-bitrate-in-rooms.md)
{% endcontent-ref %}
