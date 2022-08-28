---
description: Videos in a group scene will slide around the screen when being re-arranged
---

# \&animated

Viewer-Side Option! ([`&view`](view.md), [`&scene`](scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&animate`

## Options

| Value                           | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| (no value given)                | videos in a group scene will slide around when being re-arranged |
| `false` \| `0` \| `no` \| `off` | disables the animated effect                                     |

## Details

Videos in a group scene will slide around the screen when being re-arranged, such as when a new video gets added to the scene.

{% hint style="info" %}
In the newest version of VDO.Ninja `&animated` is on by default. You can disable it with `&animated=0`. There is also a toggle in the director's room to disable it in the guest's invite URL.\
![](<../../.gitbook/assets/image (10).png>)
{% endhint %}

Mobile phone users will not have this effect enabled by default, but most other guest and scene types will.

You can force enable this animation effect by adding `&animated` to the URL, or you can force disable the effect by passing false, such as `&animated=false` , or passing `0`, `no`, or `off`.

## Related

{% content-ref url="fadein.md" %}
[fadein.md](fadein.md)
{% endcontent-ref %}
