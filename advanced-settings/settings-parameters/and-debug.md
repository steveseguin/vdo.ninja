---
description: Reference for the &debug URL parameter in VDO.Ninja including behavior examples and related options.
---

# &debug

#### **Description**

Enables verbose debug logging to browser console and optionally streams logs to a WebSocket server.

#### **General Option**

This parameter activates detailed logging for troubleshooting connection issues and debugging problems.

#### **Usage**

* **`&debug`** - Enable debug logging to console and auto-save on exit
* **`&debug=ws://server.com:port`** - Stream logs to WebSocket server
* **`&debug=wss://secure-server.com`** - Stream logs to secure WebSocket

#### **Examples**

```
https://vdo.ninja/?room=roomname&debug
https://vdo.ninja/?push=streamID&debug
https://vdo.ninja/?view=streamID&debug=ws://localhost:8080
```

#### **Details**

* Outputs verbose logs to browser's developer console
* Attempts to auto-save logs to disk when page closes
* Can stream logs in real-time to WebSocket endpoint
* Auto-save may not work in OBS browser sources
* Logs include connection states, errors, and performance data

#### **Log Contents**

* WebRTC connection states
* ICE candidate information
* Media track events
* Error messages
* Performance metrics
* Network quality data
* API calls and responses

#### **WebSocket Streaming**

When using `&debug=websocketserver`:
* Logs stream in real-time
* Requires custom WebSocket server
* Useful for remote debugging
* Can monitor multiple sessions

#### **Accessing Logs**

1. **Browser Console**: Press F12 → Console tab
2. **Auto-saved File**: Downloads on page close (Chrome only)
3. **WebSocket Stream**: Real-time on your server

#### **Use Cases**

* Troubleshooting connection failures
* Analyzing performance issues
* Remote support and debugging
* Development and testing
* Network diagnostics

#### **Notes**

* Generates significant console output
* May impact performance slightly
* Sensitive information may be logged
* Best used temporarily for troubleshooting
* Log files can become large quickly

#### **Related Parameters**

* [`&stats`](../../general-settings/and-stats.md) - Shows connection statistics overlay
* [`&showconnections`](and-showconnections.md) - Displays connection info
* [`&getdetailedstate`](../../guides/api-commands/getdetailedstate.md) - API for connection state