---
description: Prevents a viewer or scene link from loading incoming screen shares
---

# \&noscreenshare

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&noscreenshares`
* `&noscreen`
* `&noscreens`

## Details

This prevents a viewer or scene link from loading incoming screen-share video or audio. It is useful for camera-only group scenes, such as `&scene=0` links that should show guest cameras but not guest or director screen shares.

This is different from [`&hidescreenshare`](../../newly-added-parameters/and-screensharehide.md), which only hides the publisher's own local screen-share preview window.

## Example

```
https://vdo.ninja/?scene=0&room=ROOMNAME&noscreenshare
```

This creates a camera-only group scene by loading room cameras while blocking guest and director screen shares.

## Related

{% content-ref url="../../newly-added-parameters/and-screensharehide.md" %}
[and-screensharehide.md](../../newly-added-parameters/and-screensharehide.md)
{% endcontent-ref %}

{% content-ref url="and-allowscreenmedia.md" %}
[and-allowscreenmedia.md](and-allowscreenmedia.md)
{% endcontent-ref %}
