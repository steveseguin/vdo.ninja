---
description: >-
  The same as &hangupmessage, except this takes an input as a base64 encoded
  string
---

# \&humb64

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&humb64=YnllJTNDaW1nJTIwc3JjJTNEJTIyLiUyRm1lZGlhJTJGbG9nb19jcm9wcGVkLnBuZyUyMiUzRQ==`

<table><thead><tr><th width="257"></th><th></th></tr></thead><tbody><tr><td>(base64 encoded string)</td><td>the message the guest will see when hanging up</td></tr></tbody></table>

## Details

`&humb64` is the same as [`&hangupmessage`](and-hangupmessage.md), except this new option takes an input as a base64 encoded string. VDO.Ninja will decode the base64 on load.

Base64 values are less likely to get parsed by apps like Slack incorrectly, so safer to share. If feeling lazy, you can also just use [invite.cam](https://invite.cam/), and encode the entire link itself; has a similar effect.

eg:\
[https://vdo.ninja/?push=khnCsjS\&wc\&humb64=YnllJTNDaW1nJTIwc3JjJTNEJTIyLiUyRm1lZGlhJTJGbG9nb19jcm9wcGVkLnBuZyUyMiUzRQ](https://vdo.ninja/?push=khnCsjS\&wc\&humb64=YnllJTNDaW1nJTIwc3JjJTNEJTIyLiUyRm1lZGlhJTJGbG9nb19jcm9wcGVkLnBuZyUyMiUzRQ)

## Related

{% content-ref url="and-hangupmessage.md" %}
[and-hangupmessage.md](and-hangupmessage.md)
{% endcontent-ref %}
