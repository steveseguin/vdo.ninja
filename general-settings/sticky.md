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

## Related

{% content-ref url="../advanced-settings/settings-parameters/sticky-1.md" %}
[sticky-1.md](../advanced-settings/settings-parameters/sticky-1.md)
{% endcontent-ref %}
