---
description: Time interval in seconds for &postimage
---

# \&postinterval

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\* on [https://vdo.ninja/beta/](https://vdo.ninja/beta/) and [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

| Value   | Description     |
| ------- | --------------- |
| (value) | time in seconds |

## Details

Added an option to post a snapshot of your local camera to a HTTPS/POST URL (blob/jpeg).

`https://vdo.ninja/alpha/?postimage=URL_TO_POST_IMAGE_TO_AS_BLOCK&postinterval=INTERVAL_IN_SEC`

So, for example:

``[`https://vdo.ninja/alpha/?postimage=https%3A%2F%2Ftemp.vdo.ninja%2F&postinterval=30&push=testID1&wc`](https://vdo.ninja/alpha/?postimage=https%3A%2F%2Ftemp.vdo.ninja%2F\&postinterval=30\&push=testID1\&wc)``\
``posts to a sample test server I have up. The URL is URL encoded, but not always necessary. If posting to my test server, the image can be accessed at `https://temp.vdo.ninja/images/STREAMID.jpg`.\
There's caching enabled mind you, so you'll want to post-fix the current timestamp to the URL to disable that per request.

For example: [`https://temp.vdo.ninja/images/yiMkpMg.jpg?t=3412341234`](https://temp.vdo.ninja/images/yiMkpMg.jpg?t=3412341234)&#x20;

This feature could be useful to checking out a stream before actually connecting to it, as that's my intent with it, but it is also something you can use with Octoprint, where you need an IP camera jpeg source as input.

## Related

{% content-ref url="and-postimage.md" %}
[and-postimage.md](and-postimage.md)
{% endcontent-ref %}
