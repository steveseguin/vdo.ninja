---
description: Reference for the &nofullscreenbutton URL parameter in VDO.Ninja including behavior examples and related options.
---

# &nofullscreenbutton

**Also known as:** `&nofsb`

#### **Description**

Hides the full-window button that appears in the top-right corner of videos in group rooms.

#### **General Option**

This parameter removes the small expand/full-window button that typically appears when hovering over videos.

#### **Usage**

* **`&nofullscreenbutton`** - Hides the full-window button
* **`&nofsb`** - Short alias for the parameter

#### **Examples**

```
https://vdo.ninja/?room=roomname&nofullscreenbutton
https://vdo.ninja/?view=streamID&nofsb
https://vdo.ninja/?scene=1&room=roomname&nofullscreenbutton
```

#### **Visual Example**

Without the parameter: The button appears on hover
With the parameter: No button appears

#### **Details**

* Only affects the corner button, not other fullscreen methods
* Users can still double-click videos to go full-window
* F11 and other fullscreen shortcuts still work
* Useful for kiosk modes or simplified interfaces

#### **Notes**

* Helps create cleaner interfaces for public displays
* Reduces accidental clicks in touchscreen environments
* Does not affect the fullscreen button in the control bar (if enabled with [`&fullscreenbutton`](and-fullscreenbutton.md))

#### **Related Parameters**

* [`&fullscreenbutton`](and-fullscreenbutton.md) - Adds F11 fullscreen button to control bar
* [`&nocontrols`](and-nocontrols.md) - Hides all control buttons
* [`&hidemenu`](../design-parameters/and-hidemenu.md) - Hides the menu button