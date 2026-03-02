---
description: Reference for the &blackoutmode URL parameter in VDO.Ninja including behavior examples and related options.
---

# &blackoutmode

**Also known as:** `&blackout`, `&bo`, `&bom`

#### **Description**

Enables blackout mode, which hides all videos and mutes all audio for privacy or emergency situations.

#### **General Option**

This parameter activates or shows the blackout mode button, allowing quick privacy control during streams.

#### **Usage**

* **`&blackoutmode`** - Shows the blackout button
* **`&blackoutmode=1`** - Shows button and activates blackout immediately
* **`&blackout`** - Alias for blackoutmode
* **`&bo`** - Short alias
* **`&bom`** - Short alias

#### **Examples**

```
https://vdo.ninja/?room=roomname&blackoutmode
https://vdo.ninja/?push=streamID&blackoutmode=1
https://vdo.ninja/?director&room=roomname&bo
```

#### **Visual Example**

When activated:
- All video feeds become black
- All audio is muted
- A clear indicator shows blackout is active
- Can be toggled on/off with the button

#### **Details**

* Shows a prominent blackout button in the interface
* When activated, immediately blacks out all video
* Mutes all audio inputs and outputs
* Useful for emergency privacy situations
* State can be toggled by clicking the button

#### **Use Cases**

* Emergency privacy protection
* Quick mute during unexpected interruptions
* Studio blackouts between takes
* Privacy during sensitive discussions
* Technical issue masking

#### **Notes**

* Affects both incoming and outgoing streams
* Blackout state is local (not synchronized across participants)
* Quick toggle for immediate privacy
* Visual indicator prevents accidental activation

#### **Related Parameters**

* [`&mute`](../../source-settings/and-mute.md) - Mutes audio only
* [`&videomute`](../../source-settings/and-videomute.md) - Mutes video only
* [`&privacy`](../../turn-and-stun-parameters/and-privacy.md) - Enhanced privacy mode
* [`&hidemenu`](../design-parameters/and-hidemenu.md) - Hides interface elements