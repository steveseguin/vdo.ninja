---
description: Will show the audio and the video of the director but not of the guests
---

# \&directoronly

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Aliases

* `&directorsonly`
* `&do`

## Details

`&directoronly` will show the audio and video of the director but not of the guests. It is basically the same as [`&broadcast`](../view-parameters/broadcast.md) but the guests can't hear each other. It is just the same as doing [`&view=DirectorStreamID`](../view-parameters/view.md), but without having to know the stream ID for the director.

It will actually connect to any director, including co-directors, not just the main one.

[`&view`](../view-parameters/view.md), [`&include`](../mixer-scene-parameters/and-include.md), [`&exclude`](../view-parameters/and-exclude.md) have a lower priority to `&directoronly`. So if there are two directors, you can do `&directoronly&exclude=coDirector123`, so that the codirector doesn't connect.

I changed the toggle in the director's room for "Guests hear others" from [`&view=`](../view-parameters/view.md) to `&directoronly`. The point of this change is that the [director](../../viewers-settings/director.md) can now still talk to those in the room.\
![](<../../.gitbook/assets/image (9) (2).png>)

Purpose of change: I had a user who wanted [`&broadcast`](../view-parameters/broadcast.md), but also not have the guests hear each other. It's a bit of a hassle to do [`&view=DirectorStreamID`](../view-parameters/view.md), and the toggle is labelled to be misleading by saying "guests", not "everyone".

You can use `&directoronly` to replace [`&broadcast`](../view-parameters/broadcast.md) if you don't want the guests hearing each other.

## Related

{% content-ref url="../view-parameters/broadcast.md" %}
[broadcast.md](../view-parameters/broadcast.md)
{% endcontent-ref %}

{% content-ref url="../view-parameters/view.md" %}
[view.md](../view-parameters/view.md)
{% endcontent-ref %}
