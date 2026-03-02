---
description: Reference for the &lanonly URL parameter in VDO.Ninja including behavior examples and related options.
---

# &lanonly

#### **Description**

Restricts peer-to-peer connections to devices on the same local area network (LAN), blocking all external connections.

#### **General Option**

This parameter attempts to ensure that all WebRTC connections are established only between devices on the same local network.

#### **Usage**

* **`&lanonly`** - Enable LAN-only mode

#### **Examples**

```
https://vdo.ninja/?room=localroom&lanonly
https://vdo.ninja/?push=streamID&lanonly
https://vdo.ninja/?view=streamID&lanonly
```

#### **Details**

* Blocks all public IP addresses for both incoming and outgoing connections
* Disables TURN/STUN servers to prevent external relay
* Still requires internet connection for initial handshake and website access
* Failed external connections will retry but won't establish
* Only allows RFC1918 private IP ranges (192.168.x.x, 10.x.x.x, 172.16-31.x.x)

#### **Technical Implementation**

* Filters ICE candidates to exclude public IPs
* Removes TURN server configuration
* Modifies SDP to prevent external connection attempts
* May not work with WHEP/WHIP protocols

#### **Use Cases**

* Corporate networks requiring internal-only streaming
* Security-conscious deployments
* Testing local network performance
* Avoiding internet bandwidth usage for local streams

#### **Limitations**

* VDO.Ninja server (handshake) still requires internet
* Cannot connect to devices outside your LAN
* May not work with complex network configurations (VLANs, etc.)
* No fallback to TURN if direct connection fails

#### **Notes**

* For fully offline operation, consider self-hosting VDO.Ninja
* Devices must be on the same subnet for connection
* Useful for reducing latency in local productions
* May help with privacy concerns about external IP exposure

#### **Related Parameters**

* [`&relay`](../../general-settings/and-relay.md) - Forces TURN relay (opposite behavior)
* [`&privacy`](../turn-and-stun-parameters/README.md) - Enhanced privacy mode
* [`&icefilter`](../../general-settings/and-icefilter.md) - Custom ICE candidate filtering
* [`&tcp`](../../general-settings/and-tcp.md) - Forces TCP connections