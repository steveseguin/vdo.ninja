---
description: Reference for the &leaveorientationflag URL parameter in VDO.Ninja including behavior examples and related options.
---

# &leaveorientationflag

#### **Description**

Preserves the video orientation metadata in the WebRTC stream, preventing automatic orientation corrections.

#### **Sender-Side Option**

This parameter prevents VDO.Ninja from removing the 3GPP video orientation extension from the SDP.

#### **Usage**

* **`&leaveorientationflag`** - Preserves orientation metadata

#### **Examples**

```
https://vdo.ninja/?push=streamID&leaveorientationflag
https://vdo.ninja/?room=roomname&leaveorientationflag
```

#### **Technical Details**

* Preserves `a=extmap:3 urn:3gpp:video-orientation` in SDP
* By default, VDO.Ninja removes this flag
* Affects how video rotation is handled
* Important for certain mobile streaming scenarios

#### **What It Does**

When enabled:
- Raw orientation data is passed through
- Receiving applications handle rotation
- No automatic orientation correction
- Preserves original mobile device orientation

When disabled (default):
- VDO.Ninja handles orientation
- Automatic rotation for mobile sources
- Consistent orientation across platforms

#### **Use Cases**

* Custom applications that handle rotation
* Debugging orientation issues
* Preserving raw mobile video streams
* Integration with systems expecting orientation data

#### **Platform Considerations**

* **Mobile devices**: May affect portrait/landscape handling
* **Desktop**: Usually no visible effect
* **OBS**: May impact how mobile sources are displayed
* **Custom receivers**: Can read orientation metadata

#### **Notes**

* Advanced parameter for specific use cases
* Most users should use default behavior
* Can affect mobile video display
* Test thoroughly when enabling

#### **Related Parameters**

* [`&forcelandscape`](../mobile-parameters/and-forcelandscape.md) - Forces landscape orientation
* [`&forceportrait`](../mobile-parameters/and-forceportrait.md) - Forces portrait orientation
* [`&rotate`](../design-parameters/and-rotate.md) - Rotates video display
* [`&leavevideorotation`](README.md) - Related rotation handling