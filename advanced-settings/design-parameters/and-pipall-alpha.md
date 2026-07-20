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
![](<../../.gitbook/assets/image (7) (1) (1) (1) (1).png>)

Or just right-click any video and select "Picture in picture all" from the context menu. This is available without any URL option.\
![](<../../.gitbook/assets/image (208).png>)

This mode requires the [Document Picture-in-Picture API](https://developer.chrome.com/blog/new-in-chrome-116/), which shipped in Chrome 116. VDO.Ninja checks for the API before showing the dedicated button, so unsupported browsers continue without this mode.

## Related

{% content-ref url="and-pip.md" %}
[and-pip.md](and-pip.md)
{% endcontent-ref %}

{% content-ref url="and-pipme-alpha.md" %}
[and-pipme-alpha.md](and-pipme-alpha.md)
{% endcontent-ref %}
