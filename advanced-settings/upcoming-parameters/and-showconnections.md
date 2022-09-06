---
description: Displays the total number of p2p connections of a remote stream
---

# \&showconnections

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md),[`&solo`](and-solo.md))\
Director Option! ([`&director`](../../viewers-settings/director.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Details

`&showconnections` will display the total number of p2p connections of a remote stream. Works with the director's room and the automixer. Might help give comfort over privacy/security during a stream.

Total number of p2p remote connections (viewers) of a stream source will also appear in the stats menu, even without `&showconnections`. Could be useful for debugging CPU/bandwidth issues.

Connections may represent video/audio streams, or just a data-connection. Meshcast-hosted streams might not be accounted for, depending on how the viewer is connecting.

![](<../../.gitbook/assets/image (3).png>)

## Related

{% content-ref url="../../source-settings/and-maxconnections.md" %}
[and-maxconnections.md](../../source-settings/and-maxconnections.md)
{% endcontent-ref %}
