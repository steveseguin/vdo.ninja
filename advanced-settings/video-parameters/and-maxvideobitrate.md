---
description: Limits the max video bitrate out for this publisher, per stream out
---

# \&maxvideobitrate

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&maxbitrate`
* `&mvb`

## Options

| Value                    | Description               |
| ------------------------ | ------------------------- |
| (positive integer value) | max allowed guest bitrate |

## Details

Useful if you are a director and you wish to prevent guests from pulling more than 500-kbps (LQ) or 1200-kbps (HQ) when in [broadcast](../view-parameters/broadcast.md) mode.

This is NOT the same as setting the target bitrate as a publisher; this just sets a max limit that viewers can pull video streams at.\
\
Please see [`&totalroombitrate`](../view-parameters/totalroombitrate.md) or [`&limittotalbitrate`](../../source-settings/limittotalbitrate.md), as well.

{% hint style="info" %}
Set to 600-kbps, 200-kbps, or 80-kbps if the goal is to reduce CPU load also. (2x, 3x, or 4x down-scaling is applied at those bitrate limits).
{% endhint %}

## Related

{% content-ref url="../view-parameters/totalroombitrate.md" %}
[totalroombitrate.md](../view-parameters/totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/limittotalbitrate.md" %}
[limittotalbitrate.md](../../source-settings/limittotalbitrate.md)
{% endcontent-ref %}
