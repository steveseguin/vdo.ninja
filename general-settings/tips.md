---
description: Shows a help-screen on the guest joining
---

# \&tips

Sender-Side Option! ([`&push`](../source-settings/push.md))

## Details

Shows a help-screen on the guest joining.\
![](<../.gitbook/assets/image (41).png>)

Also available as a director room toggle to add to the guest's invite link.\
![](<../.gitbook/assets/image (27) (2).png>)

{% hint style="warning" %}
This `&tips` option is a guest help-screen. It is not related to Ninja Backer tipping. For tipping, use `&tip`/`&tipsid` and `&showtips`.
{% endhint %}

## Customize Which Tips Show

By default, `&tips` shows the default guest tips. You can optionally pass a comma-separated list to show only specific tips:

```
https://vdo.ninja/?room=demo&tips=1,2,3
```

Tip IDs:

1. Device is powered (default)
2. Connection is hardwired instead of Wi-Fi (default)
3. Using headphones/earphones (default)
4. Close other video/calling apps
5. Use a quiet room
6. Face a light source

When `&tips` has no list, only the default tips are shown. Tips not listed in the URL are hidden.
