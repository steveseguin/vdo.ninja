---
description: The same as &welcome, except this takes an input as a base64 encoded string
---

# \&welcomeb64 (alpha)

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\***ALPHA-ONLY** - Only available at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

Example: `&welcome64=SGVsbG8=`

<table><thead><tr><th width="257"></th><th></th></tr></thead><tbody><tr><td>(base64 encoded string)</td><td>the message the guest will see when joining the room</td></tr></tbody></table>

## Details

`&welcome64` is the same as [`&welcome`](../../newly-added-parameters/and-welcome.md), except this new option takes an input as a base64 encoded string. VDO.Ninja will decode the base64 on load.

Base64 values are less likely to get parsed by apps like Slack incorrectly, so safer to share. If feeling lazy, you can also just use [invite.cam](https://invite.cam/), and encode the entire link itself; has a similar effect.

eg:\
[https://vdo.ninja/alpha/?push=khnCsjS\&wc\&welcomeb64=SGVsbG8](https://vdo.ninja/alpha/?push=khnCsjS\&wc\&welcomeb64=SGVsbG8)

## Related

{% content-ref url="../../newly-added-parameters/and-welcome.md" %}
[and-welcome.md](../../newly-added-parameters/and-welcome.md)
{% endcontent-ref %}
