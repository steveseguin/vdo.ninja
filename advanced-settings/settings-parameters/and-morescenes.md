---
description: Reference for the &morescenes URL parameter in VDO.Ninja including behavior examples and related options.
---

# &morescenes

#### **Description**

Adds additional numbered scene buttons beyond the default 8 scenes in the director's control room.

#### **Director-Side Option**

This parameter extends the number of scene selection buttons available to the director.

#### **Usage**

* **`&morescenes=12`** - Shows 12 scene buttons (1-12)
* **`&morescenes=16`** - Shows 16 scene buttons (1-16)
* **`&morescenes=20`** - Shows 20 scene buttons (1-20)

#### **Examples**

```
https://vdo.ninja/?room=roomname&director&morescenes=12
https://vdo.ninja/?room=roomname&director&morescenes=16
```

#### **Details**

* Default without parameter: 8 scene buttons
* Minimum value: 9 (values below 9 are set to 8)
* Maximum practical limit depends on screen size and UI layout
* Scene buttons appear in the director's control interface
* Each scene can have different guests/layouts assigned

#### **Visual Example**

When `&morescenes=12` is used, the director will see:

![Scene buttons 1-12 in the director interface](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1).png>)

#### **Notes**

* Useful for productions with many different scene configurations
* Additional scenes can be accessed via keyboard shortcuts
* Scene configurations are saved per room

#### **Related Parameters**

* [`&scene`](../../advanced-settings/view-parameters/scene.md) - Specifies which scene to view
* [`&director`](../../viewers-settings/director.md) - Enables director mode
* [`&layouts`](../director-parameters/and-layouts.md) - Pre-configures scene layouts