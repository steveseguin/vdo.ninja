---
description: >-
  Hides the publisher's local screen-share preview window when screen sharing in
  a room
---

# \&screensharehide

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Aliases

* `&sshide`
* `&hidescreenshare`
* `&hidess`

## Details

This hides the publisher's local screen-share preview window that appears when screen sharing in a room. You can use this if you want to screen share in a room, but you don't want to see your own screen share.

This does not hide incoming screen shares on viewer or scene links. To prevent a scene or viewer from loading remote screen shares, use [`&noscreenshare`](../advanced-settings/screen-share-parameters/and-noscreenshare.md).

Using [`&screensharetype=3`](and-screensharetype.md) also hides the local screen-share window.

## Example

```
https://vdo.ninja/?room=ROOMNAME&screenshare&hidescreenshare
```

This lets the publisher screen share into the room without showing their own local screen-share preview.

## Related

{% content-ref url="../source-settings/screenshare.md" %}
[screenshare.md](../source-settings/screenshare.md)
{% endcontent-ref %}

{% content-ref url="../source-settings/screenshareid.md" %}
[screenshareid.md](../source-settings/screenshareid.md)
{% endcontent-ref %}

{% content-ref url="and-screensharetype.md" %}
[and-screensharetype.md](and-screensharetype.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/screen-share-parameters/and-noscreenshare.md" %}
[and-noscreenshare.md](../advanced-settings/screen-share-parameters/and-noscreenshare.md)
{% endcontent-ref %}
