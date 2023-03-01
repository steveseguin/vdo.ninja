---
description: >-
  Will load a side-bar with an IFrame embed, with support for YouTube / Twitch /
  Social Stream
---

# \&widget (alpha)

General Option! / Director Option! ([`&director`](../../viewers-settings/director.md), [`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/) and [vdo.ninja/beta](https://vdo.ninja/beta/)

## Options

Example: `&widget=https%3A%2F%2Fwww.youtube.com%2Flive_chat%3Fis_popout%3D1%26v%3DORBwkXsUNEs`

| Value                            | Description                                       |
| -------------------------------- | ------------------------------------------------- |
| (URLComponent-encoded URL value) | load a side-bar with that page as an IFRAME embed |

## Details

`&widget` lets you pass a URLComponent-encoded URL value. It will load a side-bar with that page as an IFrame embed, with support for YouTube/Twitch specifically added.

This was designed for Twitch / YouTube / Social Stream chat, but could in theory work with any CORS-friendly site, such as a third-party web tool.

The director of a room also has the option to enable/disable the widget function for everyone in the room via the room settings menu.

You can encode the URL here:\
[https://www.urlencoder.org/](https://www.urlencoder.org/)

<figure><img src="../../.gitbook/assets/image (7) (1) (1).png" alt=""><figcaption></figcaption></figure>

If the director uses `&widget`, it will auto sync that with all guests as they connect. I'll try to find ways to make it easier to resize/minimize in the future.

## Related

{% content-ref url="../../general-settings/chatbutton.md" %}
[chatbutton.md](../../general-settings/chatbutton.md)
{% endcontent-ref %}

{% content-ref url="../../steves-helper-apps/social-stream.md" %}
[social-stream.md](../../steves-helper-apps/social-stream.md)
{% endcontent-ref %}
