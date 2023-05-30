---
description: >-
  Pre-sets the screenshare stream id for a screen share if its a secondary
  stream
---

# \&screenshareid

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&ssid`

## Options

Example: `&screenshareid=SomeID`

<table><thead><tr><th width="180">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>If no value is passed, the system will automatically add the suffix of "_ss" to the existing stream ID that the user might be using.</td></tr><tr><td>(string)</td><td>Pre-sets the screenshare ID. Useful to automate or prepare stuff in advance.</td></tr></tbody></table>

## Details

When screen sharing as a guest in a group room, the screen share will now create a second stream for the screen share, keeping your webcam also.

`&screenshareid` will preset the ID the screen share will have, making things easier to predict and prep for.

Example (`&room=roomname&push=streamid&screenshareid`)\
![](<../.gitbook/assets/image (110) (1) (1).png>)

Without this, the screen share ID is random, which is a decision made to increase security. This complication will be addressed in the future.

There is a toggle in the director's room which adds `&ssid` to the guest's invite link.\
![](<../.gitbook/assets/image (117) (2).png>)

{% hint style="info" %}
`&screenshareid` doesn't work with [`&screensharetype=3`](../newly-added-parameters/and-screensharetype.md). When using `&screensharetype=3` the screen share gets the appendix `:s` added to the stream ID of the guest.
{% endhint %}

## Related

{% content-ref url="screenshare.md" %}
[screenshare.md](screenshare.md)
{% endcontent-ref %}

{% content-ref url="screensharefps.md" %}
[screensharefps.md](screensharefps.md)
{% endcontent-ref %}

{% content-ref url="screensharequality.md" %}
[screensharequality.md](screensharequality.md)
{% endcontent-ref %}
