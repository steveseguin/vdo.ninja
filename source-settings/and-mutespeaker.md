---
description: Auto mutes the speaker
---

# \&mutespeaker

General Option! ([`&push`](push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&director`](../viewers-settings/director.md))

## Aliases

* `&ms`
* `&speakermute`
* `&sm`
* `&speakermuted`

## Options

Example: `&mutespeaker=0` or `&mutespeaker=false`

| Value            | Description                                                           |
| ---------------- | --------------------------------------------------------------------- |
| (no value given) | the default behavior of this option is to mute inbound audio playback |
| `0` \| `false`   | will have the speaker button unmuted                                  |
| `1` \| `true`    | will have the speaker button muted                                    |

## Details

Sets the speaker to be muted (or unmuted) by default for a push-link, guest, director or view/scene link.

If no value is passed, the default behavior of this option is to mute inbound audio playback. The user can still unmute the audio via the speaker-icon button in their lower control bar.

If looking to mute the audio playback of a view or scene link, [`&noaudio`](../advanced-settings/view-parameters/noaudio.md) is an alternative option that will block audio tracks from connecting in the first place. It can't be toggled on and off though, like `&mutespeaker` can be though.

### Unmuting the director's speaker by default

You can also use this parameter to have a director join the room with their speaker output unmuted by default.

Set the `&mutespeaker` value to `false` or `0` to have the mute button start unmuted. By default, the director joins with their speaker output muted, so this option can be used to have the director join unmuted instead.

[https://vdo.ninja/?director=ROOMNAME\&mutespeaker=0](https://vdo.ninja/?director=ROOMNAME\&mutespeaker=0)

### Muting shared websites ([meshcast.io](https://meshcast.io/) / youtube)

The director and guests can share websites with others in a group room. The audio playback of [meshcast.io](https://meshcast.io/) shared links will respect the `&mutespeaker` parameter used by VDO.Ninja, but other sites that are shared may not respect it.

You can also add [`&mute`](and-mute.md) to a meshcast.io link itself, when sharing it, which will mute just the meshcast video by default for others. This can be useful to avoid echo cancellation issues that sometimes are created when sharing meshcast.io links in a VDO.Ninja group room.

## Related

{% content-ref url="and-mute.md" %}
[and-mute.md](and-mute.md)
{% endcontent-ref %}

{% content-ref url="and-videomute.md" %}
[and-videomute.md](and-videomute.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/noaudio.md" %}
[noaudio.md](../advanced-settings/view-parameters/noaudio.md)
{% endcontent-ref %}
