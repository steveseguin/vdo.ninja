---
description: Auto mutes guest's speaker
---

# \&mutespeaker

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ms`
* `&speakermute`
* `&sm`
* `&speakermuted`

## Details

Sets the speaker to be muted (or un-muted) by default for a push-link, guest or director. &#x20;

\
If no value is passed, the default behavior of this option is to mute inbound audio playback. The user can still un-mute the audio via the speaker-icon button in their lower control bar.&#x20;

If looking to mute the audio playback of a view or scene link, `&noaudio` is an altenrative option that will block audio tracks from connecting in the first place.  It can't be toggled on and off though, like `&speakermute` can be though.

### Un-muting the director's speaker by default

You can also use this parameter to have a director join the room with their speaker output unmuted by default. \
\
Set the `&speakermute` value to `false` or `0` to have the mute button start un-muted.  By default, the director joins with their speaker output muted, so this option can be used to have the director join unmuted instead.\
\
ie: `?director=ROOMNAME&sm=0`

#### Muting shared websites (meshcast.io / youtube)

The director and guests can share websites with others in a group room. The audio playback of meshcast.io shared links will respect the `&speakermute` parameter used by VDO.Ninja, but other sites that are shared may not respect it.

You can also add \&mute to a meshcast.io link itself, when sharing it, which will mute just the meshcast video by default for others. This can be useful to avoid echo cancellation issues that sometimes are created when sharing meshcast.io links in a VDO.Ninja group room.

## Related

{% content-ref url="and-mute.md" %}
[and-mute.md](and-mute.md)
{% endcontent-ref %}

{% content-ref url="and-videomute.md" %}
[and-videomute.md](and-videomute.md)
{% endcontent-ref %}
