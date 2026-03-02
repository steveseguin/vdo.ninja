---
description: Troubleshooting guide for Improving vMix performance in VDO.Ninja and OBS with likely causes and practical fixes.
---

# Improving vMix performance

I found a tip that may be worth adding to your vMix performance page, docs.vdo.ninja/common-errors-and-known-issues/vmix-high-cpu

In the performance settings, if you enable advanced settings at the bottom, there is a "high output performance mode" option. For users with Nvida 1080 cards and above, it seems to significantly reduce both render time and GPU usage with no obvious drawback. I assume it uses features not available at all on older cards, but vMix doesn't document what it does, so hard to say for sure. (The only official word was a release note "Added "High Output Performance Mode" in Settings -> Performance. Improves render time when outputting 4K60 video when used with high end graphics cards. (GeForce 1080+)" but for myself and everyone else reporting trying it on forums, it had a big impact at 1080p and slower fps as well,)
