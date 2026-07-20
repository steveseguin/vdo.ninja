---
description: Reference for the &focus URL parameter in VDO.Ninja including behavior examples and related options.
---

# &focus

#### **Description**

Manually sets the camera focus distance for devices that support manual focus control.

#### **Sender-Side Option**

This parameter overrides auto-focus and sets a specific focal distance for the camera.

#### **Usage**

* **`&focus=100`** - Sets focus distance to 100 units
* **`&focus=0`** - Sets focus to closest distance (macro)
* **`&focus=1000`** - Sets focus to far distance

#### **Examples**

```
https://vdo.ninja/?push=streamID&focus=100
https://vdo.ninja/?push=streamID&focus=500
```

#### **Details**

* Only works on devices/browsers that support manual focus control
* Most effective on mobile devices (smartphones/tablets)
* Desktop webcams rarely support manual focus via browser APIs
* Value represents arbitrary focus distance units (not standardized)
* Disables auto-focus when set

#### **Device Support**

* **Supported:** Most modern smartphones (iOS/Android)
* **Limited Support:** Some tablets
* **Rarely Supported:** Desktop webcams
* **Not Supported:** Virtual cameras, screen shares

#### **Notes**

* Useful for fixed-focus scenarios (e.g., document cameras, product demos)
* Can prevent focus hunting during streams
* May need experimentation to find optimal value for your setup
* Focus capability depends on browser MediaStream API support

#### **Related Parameters**

* [`&autogain`](../../source-settings/autogain.md) - Controls automatic gain (audio equivalent)
* [`&brightness`](and-brightness.md) - Adjusts camera brightness
* [`&contrast`](and-contrast.md) - Adjusts camera contrast
* [`&zoom`](../video-parameters/and-zoom.md) - Controls camera zoom level
