---
description: >-
  New floating picture in picture mode, so you can pop out the entire video mix
  as a pinned window overlay
---

# \&pipall

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Aliases

* `&pip2`

## Details

Added a new floating picture in picture mode, so you can pop out the entire video mix as a pinned window overlay.

`&pipall` will add a dedicated button for this mode.\
![](<../../.gitbook/assets/image (7) (1) (1) (1).png>)

Or just right-click any video and select "Picture in picture all" from the context menu. This is available without any URL option.\
![](<../../.gitbook/assets/image (208).png>)

This requires Chrome v115 right now; it might vanish in v116 due to it being in a `chrome field trial`, and so you might need to enable it via `chrome:flags` if it stops working.

Update: Doesn't break the site if browser does not supported.

## Related

{% content-ref url="and-pip.md" %}
[and-pip.md](and-pip.md)
{% endcontent-ref %}

{% content-ref url="and-pipme.md" %}
[and-pipme.md](and-pipme.md)
{% endcontent-ref %}
