---
description: A mic only button shows if a guest joining a room
---

# \&miconlyoption (alpha)

Sender-Side Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&moo`

## Details

Based on user feedback, I'm testing the concept of a "join with mic-only" button. You can enable it with `&miconlyoption`. It's exactly the same as join with video, except the video device is not selected by default. When used, a mic only button shows if a guest joining a room, and if [`&audiodevice=0`](../../source-settings/audiodevice.md) is not present. Hoping this will give more users courage to click the join button, but if it causes issues, I may revert.\
\
For testing at [https://vdo.ninja/?room=someetestroomhere\&moo](https://vdo.ninja/?room=someetestroomhere\&moo)

## Related

{% content-ref url="../../source-settings/miconly.md" %}
[miconly.md](../../source-settings/miconly.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/audiodevice.md" %}
[audiodevice.md](../../source-settings/audiodevice.md)
{% endcontent-ref %}
