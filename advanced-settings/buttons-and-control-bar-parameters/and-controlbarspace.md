---
description: Reference for the &controlbarspace URL parameter in VDO.Ninja including behavior examples and related options.
---

# &controlbarspace

**Also known as:** `&nocontrolbarspace` (to disable)

#### **Description**

Reserves dedicated space for the control bar to prevent video content from being obscured when controls appear.

#### **General Option**

This parameter ensures the control bar has its own space rather than overlaying on top of video content.

#### **Usage**

* **`&controlbarspace`** - Reserves space for control bar
* **`&nocontrolbarspace`** - Disables reserved space (overlay mode)

#### **Examples**

```
https://vdo.ninja/?push=streamID&controlbarspace
https://vdo.ninja/?view=streamID&controlbarspace
https://vdo.ninja/?room=roomname&nocontrolbarspace
```

#### **Visual Behavior**

**With `&controlbarspace`:**
- Video content is sized to leave room for controls
- Controls don't cover any video content
- Consistent layout whether controls are visible or hidden

**Without (or with `&nocontrolbarspace`):**
- Controls overlay on top of video
- Full video area when controls are hidden
- May obscure bottom portion when controls appear

#### **Details**

* Affects layout calculations for video sizing
* Useful for professional presentations
* Prevents important content from being hidden
* Trade-off between screen space and visibility

#### **Interaction with Other Parameters**

* Disabled by default when using [`&autohide`](../../parameters-only-on-beta/and-autohide.md)
* Works with all control bar configurations
* Affects both sender and viewer interfaces

#### **Use Cases**

* Professional broadcasts
* Educational content where controls are frequently used
* Presentations with important bottom content
* Kiosk displays with permanent controls

#### **Notes**

* Consider your content layout when choosing
* More important for content with subtitles or lower thirds
* Can affect overall video size calculations

#### **Related Parameters**

* [`&autohide`](../../parameters-only-on-beta/and-autohide.md) - Auto-hides controls
* [`&nocontrols`](../settings-parameters/and-nocontrols.md) - Removes all controls
* [`&controlbar`](README.md) - Control bar options
* [`&hidemenu`](../design-parameters/and-hidemenu.md) - Hides menu elements
