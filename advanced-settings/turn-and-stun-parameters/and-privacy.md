---
description: Reference for the &privacy URL parameter in VDO.Ninja including behavior examples and related options.
---

# &privacy

#### **Description**

Enhanced privacy mode that forces TURN relay usage and adds additional privacy protections.

#### **General Option**

This parameter enables stricter privacy settings beyond just using TURN relay, including blocking potentially privacy-compromising features.

#### **Usage**

* **`&privacy`** - Enable enhanced privacy mode

#### **Examples**

```
https://vdo.ninja/?push=streamID&privacy
https://vdo.ninja/?room=roomname&privacy
https://vdo.ninja/?view=streamID&privacy
```

#### **Details**

* Forces all connections through TURN relay servers (hides IP addresses)
* Prompts for confirmation before loading iframes (except trusted sites)
* More restrictive than [`&relay`](../../general-settings/and-relay.md) alone
* Shows warnings even in OBS when iframes try to load
* Trusted sites (YouTube, Twitch, Vimeo) bypass iframe warnings

#### **Privacy Features**

1. **IP Address Protection**: Routes through TURN servers
2. **Iframe Blocking**: Prevents automatic loading of embedded content
3. **Enhanced Warnings**: Shows privacy notices for potential risks
4. **No Direct P2P**: Prevents direct peer connections

#### **Visual Example**

When an iframe tries to load with `&privacy`:

![Privacy warning dialog](<../../.gitbook/assets/image (232).png>)

#### **Use Cases**

* Streaming with hidden IP addresses
* Corporate environments with strict privacy requirements
* Public streams where location privacy is important
* Preventing tracking through embedded content

#### **Limitations**

* May increase latency due to relay usage
* Some features may be restricted
* Higher bandwidth usage on TURN servers
* Not all embedded content will work

#### **Notes**

* More restrictive than [`&relay`](../../general-settings/and-relay.md)
* Combines multiple privacy features
* Good for high-security scenarios
* May impact performance

#### **Related Parameters**

* [`&relay`](../../general-settings/and-relay.md) - Forces TURN relay (less restrictive)
* [`&nowebsite`](../../source-settings/nowebsite.md) - Completely disables iframe loading
* [`&lanonly`](and-lanonly.md) - Restricts to local network only
* [`&icefilter`](../../general-settings/and-icefilter.md) - Custom ICE filtering