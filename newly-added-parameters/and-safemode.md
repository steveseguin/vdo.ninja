---
description: Tries to load the camera/audio with as little possible complexity as possible
---

# \&safemode

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Details

Adding `&safemode` to a source/guest link currently just tries to load the camera/audio with as little possible complexity as possible. For cameras that just 'flash' their video preview for a second, but won't work beyond that when setting things up, this might be a solution there.

This has the guest's camera start in a rather basic fashion, which might help solve problems with certain camera not being able to use VDO.Ninja.&#x20;

It's available under director's customization options as well, under "Compatibility mode".

There is a toggle in the director's room which adds `&safemode` to the guest's invite link.\
![](<../.gitbook/assets/image (99).png>)
