---
description: Removed. The built-in Social Stream Ninja Lite overlay is no longer part of VDO.Ninja.
---

# \&chatlite

{% hint style="danger" %}
**This parameter no longer exists.** The built-in Chat Lite (Social Stream Ninja Lite) overlay was removed from VDO.Ninja in the v30.2 update (July 2026). Current versions ignore `&chatlite` and all of its companion parameters.
{% endhint %}

## What was removed

These parameters no longer do anything:

* `&chatlite`, `&ssnlite`, `&socialstreamlite`
* `&chatlitebutton`, `&ssnchatbutton`
* `&chatlitesession`, `&ssnsession`
* `&chatliteprofile`, `&chatliteposition`, `&chatlitemax`, `&chatlitetransparent`
* `&chatlitenoavatar`, `&chatlitehideavatar`, `&chatliteconfig`, `&chatlitetts`

The standalone `chat-lite/` page was removed from the VDO.Ninja code at the same time.

## What to use instead

* **Live chat from YouTube, Twitch, Kick and other platforms:** run [Social Stream Ninja](../steves-helper-apps/social-stream-ninja/) separately and add its overlay to OBS as its own browser source.
* **Text chat between people in a VDO.Ninja room:** use VDO.Ninja's built-in chat. [`&chatbutton`](../general-settings/chatbutton.md) shows or hides the chat button.

## Related

{% content-ref url="../steves-helper-apps/social-stream-ninja/" %}
[social-stream-ninja](../steves-helper-apps/social-stream-ninja/)
{% endcontent-ref %}

{% content-ref url="../general-settings/chatbutton.md" %}
[chatbutton.md](../general-settings/chatbutton.md)
{% endcontent-ref %}
