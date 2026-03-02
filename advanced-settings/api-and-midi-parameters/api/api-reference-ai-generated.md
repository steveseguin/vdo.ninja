---
description: Advanced settings reference for API reference - alt version in VDO.Ninja including usage details and configuration notes.
---

# API reference - alt version

## VDO.Ninja Remote Control API Documentation

### Overview

VDO.Ninja's Remote Control API allows programmatic control of VDO.Ninja sessions via HTTP or WebSocket connections. This powerful API enables integration with stream decks, custom applications, and automation tools for controlling cameras, microphones, layouts, and other features.

### Basic Setup

To enable the API on any VDO.Ninja instance, add the `&api` parameter with a unique API key:

```
https://vdo.ninja/?api=YOUR_UNIQUE_API_KEY&webcam
```

This key must be kept private and will be used to authenticate API requests. The same key must be used when making API calls to control this specific VDO.Ninja instance.

### Connection Methods

The API supports three connection methods:

1. **WebSocket API** (recommended for real-time control)
2. **HTTP GET API** (good for simple controllers and hotkeys)
3. **Server-Sent Events** (SSE) for one-way event monitoring

#### WebSocket API

Connect to `wss://api.vdo.ninja:443` and authenticate with your API key:

```javascript
const socket = new WebSocket("wss://api.vdo.ninja:443");

socket.onopen = function() {
    // Join with your API key
    socket.send(JSON.stringify({"join": "YOUR_UNIQUE_API_KEY"}));
    
    // After joining, you can send commands
    socket.send(JSON.stringify({
        "action": "mic", 
        "value": false // mute microphone
    }));
};

// Listen for responses and events
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("Received:", data);
};
```

#### HTTP GET API

Structure: `https://api.vdo.ninja/{apiKey}/{action}/{target}/{value}`

Examples:

```
https://api.vdo.ninja/YOUR_UNIQUE_API_KEY/mic/false       // Mute microphone
https://api.vdo.ninja/YOUR_UNIQUE_API_KEY/camera/toggle   // Toggle camera
```

#### Server-Sent Events (SSE)

For monitoring events without sending commands:

```javascript
const eventSource = new EventSource(`https://api.vdo.ninja/sse/YOUR_UNIQUE_API_KEY`);
eventSource.onmessage = function(event) {
    console.log(JSON.parse(event.data));
};
```

### API Commands Reference

#### Self-Targeted Commands

These commands affect the local VDO.Ninja instance that has the API key enabled.

| Action              | Value Options                 | Description                                |
| ------------------- | ----------------------------- | ------------------------------------------ |
| `mic`               | `true`, `false`, `toggle`     | Control microphone state                   |
| `camera`            | `true`, `false`, `toggle`     | Control camera state                       |
| `speaker`           | `true`, `false`, `toggle`     | Control speaker state                      |
| `volume`            | `0` to `200`                  | Set playback volume (percentage)           |
| `bitrate`           | Integer (kbps), `-1` for auto | Set video bitrate                          |
| `record`            | `true`, `false`               | Control local recording                    |
| `hangup`            | N/A                           | Disconnect current session                 |
| `reload`            | N/A                           | Reload the page                            |
| `sendChat`          | Text string                   | Send a chat message                        |
| `togglehand`        | N/A                           | Toggle raised hand status                  |
| `togglescreenshare` | N/A                           | Toggle screen sharing                      |
| `forceKeyframe`     | N/A                           | Force video keyframes ("rainbow puke fix") |
| `getDetails`        | N/A                           | Get detailed state information             |
| `getGuestList`      | N/A                           | Get list of connected guests with IDs      |

#### Layout Control Commands

| Action   | Value                    | Description                          |
| -------- | ------------------------ | ------------------------------------ |
| `layout` | `0` or `false`           | Switch to auto-mixer layout          |
| `layout` | Integer (`1`, `2`, etc.) | Switch to specific predefined layout |
| `layout` | Layout object/array      | Apply custom layout configuration    |

#### Camera Control (PTZ) Commands

| Action     | Value                              | Description                        |
| ---------- | ---------------------------------- | ---------------------------------- |
| `zoom`     | `-1.0` to `1.0`                    | Adjust zoom level (relative)       |
| `zoom`     | `0.0` to `1.0` with `value2="abs"` | Set absolute zoom level            |
| `focus`    | `-1.0` to `1.0`                    | Adjust focus (relative)            |
| `pan`      | `-1.0` to `1.0`                    | Adjust camera pan (negative=left)  |
| `tilt`     | `-1.0` to `1.0`                    | Adjust camera tilt (negative=down) |
| `exposure` | `0.0` to `1.0`                     | Adjust camera exposure             |

#### Group Communication Commands

| Action           | Value      | Description                             |
| ---------------- | ---------- | --------------------------------------- |
| `group`          | `1` to `8` | Toggle participation in specified group |
| `joinGroup`      | `1` to `8` | Join a specific group                   |
| `leaveGroup`     | `1` to `8` | Leave a specific group                  |
| `viewGroup`      | `1` to `8` | Toggle view of specified group          |
| `joinViewGroup`  | `1` to `8` | View a specific group                   |
| `leaveViewGroup` | `1` to `8` | Stop viewing a specific group           |

#### Timer Commands

| Action           | Value             | Description                    |
| ---------------- | ----------------- | ------------------------------ |
| `startRoomTimer` | Integer (seconds) | Start countdown timer for room |
| `pauseRoomTimer` | N/A               | Pause the room timer           |
| `stopRoomTimer`  | N/A               | Stop and reset the room timer  |

#### Presentation Control

| Action      | Value                     | Description                                        |
| ----------- | ------------------------- | -------------------------------------------------- |
| `nextSlide` | N/A                       | Advance to next slide (for PowerPoint integration) |
| `prevSlide` | N/A                       | Go to previous slide                               |
| `soloVideo` | `true`, `false`, `toggle` | Highlight video for all guests                     |

#### Director-Only Guest Commands

These commands target specific guests when you are the director.

| Action                  | Target        | Value                     | Description                      |
| ----------------------- | ------------- | ------------------------- | -------------------------------- |
| `forward`               | Guest ID/slot | Room name                 | Transfer guest to another room   |
| `addScene`              | Guest ID/slot | Scene ID (1-8)            | Toggle guest in/out of scene     |
| `muteScene`             | Guest ID/slot | Scene ID                  | Toggle guest's audio in scene    |
| `mic`                   | Guest ID/slot | `true`, `false`, `toggle` | Control guest's microphone       |
| `hangup`                | Guest ID/slot | N/A                       | Disconnect a specific guest      |
| `soloChat`              | Guest ID/slot | N/A                       | Private chat with guest          |
| `soloChatBidirectional` | Guest ID/slot | N/A                       | Two-way private chat             |
| `speaker`               | Guest ID/slot | N/A                       | Toggle guest's speaker           |
| `display`               | Guest ID/slot | N/A                       | Toggle guest's display           |
| `forceKeyframe`         | Guest ID/slot | N/A                       | Fix video artifacts for guest    |
| `soloVideo`             | Guest ID/slot | N/A                       | Highlight specific guest's video |
| `volume`                | Guest ID/slot | `0` to `100`              | Set guest's microphone volume    |
| `mixorder`              | Guest ID/slot | `-1` or `1`               | Change guest's position in mixer |
| `ptzZoom`               | Guest ID/slot | Number (+ optional `value2`) | Change remote zoom (`value2="abs"` for absolute mode) |
| `ptzPan`                | Guest ID/slot | Number (+ optional `value2`) | Change remote pan (`value2="abs"` for absolute mode) |
| `ptzTilt`               | Guest ID/slot | Number (+ optional `value2`) | Change remote tilt (`value2="abs"` for absolute mode) |
| `ptzFocus`              | Guest ID/slot | Number (+ optional `value2`) | Change remote focus (`value2="abs"` for absolute mode) |
| `ptzAutofocus`          | Guest ID/slot | `true` / `false`          | Enable or disable remote autofocus |
| `remoteMirror`          | Guest ID/slot | `true` / `false` / `toggle` | Set or toggle remote mirror state (aliases: `mirror`, `mirrorGuest`) |
| `remoteRotate`          | Guest ID/slot | `true` / `false` / Number | Rotate remote output (`true`=+90 step, `false`=reset, number=explicit rotation; aliases: `rotate`, `rotateGuest`) |

### Target Parameter Explanation

When using director commands, you can specify targets in two ways:

1. **Slot number**: Simple integers like `1`, `2`, `3` (corresponds to position in room)
2. **Stream ID**: The unique ID for a specific guest (more reliable as slots can change)

Examples:

```javascript
// Target guest in slot 1
{"action": "mic", "target": 1, "value": false}

// Target guest with specific stream ID
{"action": "mic", "target": "abc123xyz", "value": false}
```

### Callbacks and Responses

API commands receive callbacks with the current state after execution:

```javascript
// WebSocket example response when toggling mic
{
  "callback": {
    "action": "mic",
    "value": "toggle",
    "result": false  // Indicates mic is now muted
  }
}
```

### Custom Layout Format

The layout API supports complex scene configurations. Layouts can be arrays of objects with properties:

```javascript
// Simple layout with two videos
{
  "action": "layout",
  "value": [
    {"x": 0, "y": 0, "w": 50, "h": 100, "slot": 0},
    {"x": 50, "y": 0, "w": 50, "h": 100, "slot": 1}
  ]
}
```

Layout object properties:

* `x`, `y`: Position (percentage of canvas)
* `w`, `h`: Width and height (percentage)
* `slot`: Which video slot to display (0-indexed)
* `z`: Z-index for layering (optional)
* `c`: Cover mode (true/false, optional)
* `cropTop`, `cropRight`, `cropBottom`, `cropLeft`: Crop values in pixels, rendered via `clip-path: inset(...)` (optional)

### Implementation Examples

#### Python Example

```python
import websockets
import asyncio
import json

async def control_camera():
    async with websockets.connect("wss://api.vdo.ninja:443") as websocket:
        # Join with API key
        await websocket.send(json.dumps({"join": "YOUR_API_KEY"}))
        
        # Zoom in camera
        await websocket.send(json.dumps({
            "action": "zoom",
            "value": 0.5,
            "value2": "abs"
        }))
        
        # Wait for response
        response = await websocket.recv()
        print(f"Response: {response}")

asyncio.run(control_camera())
```

#### JavaScript HTTP Example

```javascript
// Toggle microphone via HTTP
fetch("https://api.vdo.ninja/YOUR_API_KEY/mic/toggle")
    .then(response => response.text())
    .then(result => console.log("Mic toggled, new state:", result));
```

### Integration with Automation Tools

The API integrates well with:

1. **BitFocus Companion**: Official module available at [github.com/bitfocus/companion-module-vdo-ninja](https://github.com/bitfocus/companion-module-vdo-ninja)
2. **Stream Deck**: Can use HTTP requests for button actions
3. **Node-RED**: Great for complex automation workflows
4. **Home Assistant**: For smart home integration

### Security Considerations

* Keep your API key private
* Consider using unique keys for different productions
* The API has full control over the VDO.Ninja instance it's connected to
* All connections are encrypted over SSL/TLS

### Troubleshooting

* Ensure the API key matches exactly between VDO.Ninja and your requests
* For WebSocket connections, implement reconnection logic (connections timeout after \~1 minute of inactivity)
* When using HTTP API, a `timeout` response means the request couldn't reach the target

### Additional Resources

* Complete API documentation: [github.com/steveseguin/Companion-Ninja](https://github.com/steveseguin/Companion-Ninja)
* Interactive demo: [companion.vdo.ninja](https://companion.vdo.ninja)
* For Python implementations: See the Python sample in the repository

### Advanced Usage: Self-Hosting the API

For production environments, you can self-host the API server:

1. Clone the repository from GitHub
2. Install dependencies with `npm install`
3.  Modify the server URL in your VDO.Ninja instances:

    ```javascript
    session.apiserver = "wss://your-custom-domain:443";
    ```
4. Run the server with proper SSL certificates

Note: Self-hosting support is limited and should only be attempted by experienced developers.
