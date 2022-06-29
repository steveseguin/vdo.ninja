---
description: Will optimize the mobile experience for more capable smartphones
---

# \&flagship

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Details

``[`https://vdo.ninja/alpha/?flagship`](https://vdo.ninja/alpha/?flagship)

Been playing around a new flag called `&flagship`, which will optimize the mobile experience for more capable smartphones; essentially, streaming higher quality video to other guests versus the normal mobile-performance mode.

Can be used to try to have a mobile phone push closer-to-desktop quality out, to other guests. The quality is only slightly worse than what a desktop user would push out I think. Just add `&flagship` to the guest invite links to trigger.

If you don't include `&flagship`, I've still made some performance tweak, such as increasing the default bitrate from 200-kbps to 350-kbps with just one other guest in the room; with two other, its 250-kbps; after that, it starts to drop down a lot again though. I need to organize my thoughts a bit more on all this, but so far I think it's an improvement.

I've also modified the non-flagship mode, for low-end mobile devices, to use the [`&limittotalbitrate`](../../source-settings/limittotalbitrate.md) flag by default (500-kbps). [`&limittotalbitrate`](../../source-settings/limittotalbitrate.md) hasn't been that heavily tested yet, but it's part of v22 and might be better than [`&totalroombitrate`](../view-parameters/totalroombitrate.md); currently I'll increasingly use them together I think though. They are both the same concept, except one is viewer-side controlled, and the other is sender-side controlled; both limit the bitrate that guests in the room see based on the number of guests in the room.
