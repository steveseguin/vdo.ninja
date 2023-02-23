---
description: Allows a user to save and then later restore their streaming session settings
---

# \&sticky

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Details

Allows a user to save and then later restore their streaming session settings via the use of local storage.

Clearing the browser's cache will clear the settings.

This will not work if the site is wrapped as an IFRAME.

The user will be prompted with a pop-up when they return to the site, after using `&sticky`, to see if they wish to recover their previous settings. These settings are those stored in the URL only, so it essentially loads the previously used URL.

There is a toggle in the director's room which adds `&sticky` to the guest's invite link.\
![](<../.gitbook/assets/image (94) (2).png>)

### New in Version 23 (on alpha)

Added a little "pin" icon to the end of the copy/view link when sharing your camera. Pressing it is the same as using `&sticky` on your URL, as next time you visit VDO.Ninja it will ask you if you wish to reload your [`&push`](../source-settings/push.md) link.

<figure><img src="../.gitbook/assets/image (8) (1).png" alt=""><figcaption></figcaption></figure>

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-clearstorage-alpha.md" %}
[and-clearstorage-alpha.md](../advanced-settings/settings-parameters/and-clearstorage-alpha.md)
{% endcontent-ref %}
