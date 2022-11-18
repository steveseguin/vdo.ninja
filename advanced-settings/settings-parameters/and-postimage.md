---
description: Post a snapshot of your local camera to a HTTPS/POST URL
---

# \&postimage

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

| Value                             | Description     |
| --------------------------------- | --------------- |
| `https%3A%2F%2Ftemp.vdo.ninja%2F` | URL-encoded URL |

## Details

Added an option to post a snapshot of your local camera to a HTTPS/POST URL (blob/jpeg).

`https://vdo.ninja/?postimage=URL_TO_POST_IMAGE_TO_AS_BLOCK&postinterval=INTERVAL_IN_SEC`

So, for example:

``[`https://vdo.ninja/?postimage=https%3A%2F%2Ftemp.vdo.ninja%2F&postinterval=30&push&wc`](https://vdo.ninja/?postimage=https%3A%2F%2Ftemp.vdo.ninja%2F\&postinterval=30\&push\&wc)``\
``posts to a sample test server I have up. The URL is URL encoded, but not always necessary. If posting to my test server, the image can be accessed at `https://temp.vdo.ninja/images/STREAMID.jpg`.\
There's caching enabled mind you, so you'll want to post-fix the current timestamp to the URL to disable that per request.

For example: [`https://temp.vdo.ninja/images/yiMkpMg.jpg?t=3412341234`](https://temp.vdo.ninja/images/yiMkpMg.jpg?t=3412341234)&#x20;

This feature could be useful to checking out a stream before actually connecting to it, as that's my intent with it, but it is also something you can use with Octoprint, where you need an IP camera jpeg source as input.

## Related

{% content-ref url="and-postinterval.md" %}
[and-postinterval.md](and-postinterval.md)
{% endcontent-ref %}

{% content-ref url="../upcoming-parameters/and-slideshow.md" %}
[and-slideshow.md](../upcoming-parameters/and-slideshow.md)
{% endcontent-ref %}
