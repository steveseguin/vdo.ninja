---
description: Enhanced IFRAME API Documentation - HTTP/WSS API Integration
---

# IFRAME API for Directors

#### Overview

The VDO.Ninja IFRAME API provides access to all HTTP/WSS API commands through the `action` parameter. This means you can use any command from the [HTTP/WSS API](https://github.com/steveseguin/Companion-Ninja) directly through the iframe's postMessage interface.

#### Using HTTP/WSS API Commands via IFRAME

All commands available in the HTTP/WSS API can be accessed through the IFRAME API using this format:

```
iframe.contentWindow.postMessage({
    action: "commandName",
    value: "value",
    value2: "optional",
    target: "optional", // for director commands
    cib: "callback-id" // optional callback identifier
}, "*");
```

#### Director Permissions

**Important:** To use director commands for remote control, you must have director permissions:

1. Use `&director=roomname` instead of `&room=roomname` in your iframe URL
2. Or combine with `&codirector=password` to enable multiple directors
3. Without proper permissions, director commands will fail silently

Example iframe URL with director permissions:

```
https://vdo.ninja/?director=myroom&cleanoutput&api=myapikey
```

### Complete Command Reference

**Self Commands (No Target Required)**

These commands affect the local VDO.Ninja instance:

```
// Microphone control
iframe.contentWindow.postMessage({ action: "mic", value: "toggle" }, "*");

// Camera control  
iframe.contentWindow.postMessage({ action: "camera", value: false }, "*");

// Speaker control
iframe.contentWindow.postMessage({ action: "speaker", value: true }, "*");

// Volume control (0-200)
iframe.contentWindow.postMessage({ action: "volume", value: 85 }, "*");

// Recording
iframe.contentWindow.postMessage({ action: "record", value: true }, "*");

// Bitrate control
iframe.contentWindow.postMessage({ action: "bitrate", value: 2500 }, "*");

// Layout control
iframe.contentWindow.postMessage({ action: "layout", value: 2 }, "*");

// Custom layout object
iframe.contentWindow.postMessage({ 
    action: "layout", 
    value: [
        {x: 0, y: 0, w: 50, h: 100, slot: 0},
        {x: 50, y: 0, w: 50, h: 100, slot: 1}
    ]
}, "*");

// Group management
iframe.contentWindow.postMessage({ action: "joinGroup", value: "1" }, "*");
iframe.contentWindow.postMessage({ action: "leaveGroup", value: "2" }, "*");

// Get information
iframe.contentWindow.postMessage({ action: "getDetails", cib: "details-123" }, "*");
iframe.contentWindow.postMessage({ action: "getGuestList", cib: "guests-456" }, "*");

// Camera PTZ controls
iframe.contentWindow.postMessage({ action: "zoom", value: 0.1 }, "*"); // Relative
iframe.contentWindow.postMessage({ action: "zoom", value: 1.5, value2: "abs" }, "*"); // Absolute
iframe.contentWindow.postMessage({ action: "pan", value: -0.5 }, "*");
iframe.contentWindow.postMessage({ action: "tilt", value: 0.1 }, "*");
iframe.contentWindow.postMessage({ action: "focus", value: 0.8, value2: "abs" }, "*");

// Other controls
iframe.contentWindow.postMessage({ action: "reload" }, "*");
iframe.contentWindow.postMessage({ action: "hangup" }, "*");
iframe.contentWindow.postMessage({ action: "togglehand" }, "*");
iframe.contentWindow.postMessage({ action: "togglescreenshare" }, "*");
iframe.contentWindow.postMessage({ action: "forceKeyframe" }, "*");
iframe.contentWindow.postMessage({ action: "sendChat", value: "Hello everyone!" }, "*");
```

PTZ commands require the sender to opt in with `&ptz` and grant camera permissions, and the camera must support PTZ/focus. In Chrome, PTZ changes are blocked when the sender tab/window is hidden, so keep it visible during control. If you are not acting as a director, PTZ control also requires `&remote` on both sides.

**Director Commands (Target Required)**

These commands require director permissions and target specific guests:

```
// Target can be:
// - Slot number: "1", "2", "3", etc.
// - Stream ID: "abc123xyz"
// - "*" for all guests (where applicable)

// Guest microphone control
iframe.contentWindow.postMessage({ 
    action: "mic", 
    target: "1", 
    value: "toggle" 
}, "*");

// Guest camera control
iframe.contentWindow.postMessage({ 
    action: "camera", 
    target: "streamID123", 
    value: false 
}, "*");

// Add guest to scene
iframe.contentWindow.postMessage({ 
    action: "addScene", 
    target: "2", 
    value: 1  // Scene number
}, "*");

// Transfer guest to another room
iframe.contentWindow.postMessage({ 
    action: "forward", 
    target: "1", 
    value: "newroom" 
}, "*");

// Solo chat with guest
iframe.contentWindow.postMessage({ 
    action: "soloChat", 
    target: "3" 
}, "*");

// Two-way solo chat
iframe.contentWindow.postMessage({ 
    action: "soloChatBidirectional", 
    target: "2" 
}, "*");

// Send private message to guest
iframe.contentWindow.postMessage({ 
    action: "sendChat", 
    target: "1", 
    value: "Private message" 
}, "*");

// Overlay message on guest's screen
iframe.contentWindow.postMessage({ 
    action: "sendDirectorChat", 
    target: "2", 
    value: "You're live in 10 seconds!" 
}, "*");

// Guest volume control
iframe.contentWindow.postMessage({ 
    action: "volume", 
    target: "1", 
    value: 120  // 0-200
}, "*");

// Disconnect specific guest
iframe.contentWindow.postMessage({ 
    action: "hangup", 
    target: "3" 
}, "*");

// Guest camera PTZ control
iframe.contentWindow.postMessage({ 
    action: "zoom", 
    target: "1", 
    value: 0.1 
}, "*");

// Timer controls for guest
iframe.contentWindow.postMessage({ 
    action: "startRoomTimer", 
    target: "1", 
    value: 600  // 10 minutes in seconds
}, "*");

// Change guest position in mixer
iframe.contentWindow.postMessage({ 
    action: "mixorder", 
    target: "2", 
    value: -1  // Move up
}, "*");
```

#### Using targetGuest Function (Legacy)

The `targetGuest` function provides another way to control guests:

```
iframe.contentWindow.postMessage({
    function: "targetGuest",
    target: "1",      // Guest slot or stream ID
    action: "mic",    // Action to perform
    value: "toggle"   // Value (optional)
}, "*");
```

#### Using Commands Function

Access any command from the Commands object:

```
iframe.contentWindow.postMessage({
    function: "commands",
    action: "zoom",
    value: 0.5,
    value2: "abs"
}, "*");
```

#### Advanced DOM Manipulation

Target specific video elements by stream ID:

```
// Add video to grid
iframe.contentWindow.postMessage({
    target: "streamID123",
    add: true
}, "*");

// Remove video from grid
iframe.contentWindow.postMessage({
    target: "streamID123",
    remove: true
}, "*");

// Replace all videos with target
iframe.contentWindow.postMessage({
    target: "streamID123",
    replace: true
}, "*");

// Apply settings to video element
iframe.contentWindow.postMessage({
    target: "streamID123",
    settings: {
        style: "transform: scale(1.5);",
        muted: true,
        volume: 0.5
    }
}, "*");
```

#### Special Functions

```
// Preview local webcam
iframe.contentWindow.postMessage({
    function: "previewWebcam"
}, "*");

// Publish screen share
iframe.contentWindow.postMessage({
    function: "publishScreen"
}, "*");

// Change HTML content
iframe.contentWindow.postMessage({
    function: "changeHTML",
    target: "elementId",
    value: "<p>New content</p>"
}, "*");

// Route WebSocket message
iframe.contentWindow.postMessage({
    function: "routeMessage",
    value: { /* message data */ }
}, "*");

// Execute code (use with extreme caution)
iframe.contentWindow.postMessage({
    function: "eval",
    value: "console.log('Hello from eval');"
}, "*");
```

#### Handling Responses

Listen for responses with callback IDs:

```
window.addEventListener("message", function(e) {
    if (e.source !== iframe.contentWindow) return;
    
    if (e.data.cib === "my-callback-123") {
        console.log("Received response:", e.data);
        
        // Handle different response types
        if (e.data.guestList) {
            console.log("Guest list:", e.data.guestList);
        } else if (e.data.detailedState) {
            console.log("State info:", e.data.detailedState);
        } else if (e.data.callback) {
            console.log("Command result:", e.data.callback.result);
        }
    }
});
```

#### Complete Example: Director Control Panel

```
<!DOCTYPE html>
<html>
<head>
    <title>VDO.Ninja Director Control Panel</title>
</head>
<body>
    <h1>Director Control Panel</h1>
    
    <div id="container"></div>
    
    <div id="controls">
        <h2>Guest Controls</h2>
        <select id="guest-select">
            <option value="1">Guest 1</option>
            <option value="2">Guest 2</option>
            <option value="3">Guest 3</option>
        </select>
        
        <button onclick="controlGuest('mic', 'toggle')">Toggle Mic</button>
        <button onclick="controlGuest('camera', 'toggle')">Toggle Camera</button>
        <button onclick="controlGuest('addScene', 1)">Add to Scene 1</button>
        <button onclick="controlGuest('forward', 'lobby')">Send to Lobby</button>
        <button onclick="controlGuest('zoom', 0.1)">Zoom In</button>
        <button onclick="controlGuest('zoom', -0.1)">Zoom Out</button>
    </div>
    
    <div id="log"></div>

    <script>
    // Create iframe with director permissions
    const iframe = document.createElement("iframe");
    iframe.allow = "camera;microphone;fullscreen;display-capture;autoplay;";
    iframe.src = "https://vdo.ninja/?director=myroom&cleanoutput&api=mykey";
    iframe.style.width = "800px";
    iframe.style.height = "600px";
    document.getElementById("container").appendChild(iframe);
    
    // Control function
    function controlGuest(action, value) {
        const target = document.getElementById("guest-select").value;
        
        const message = {
            action: action,
            target: target
        };
        
        if (value !== undefined) {
            message.value = value;
        }
        
        // Generate callback ID
        const callbackId = `cb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        message.cib = callbackId;
        
        iframe.contentWindow.postMessage(message, "*");
        log(`Sent: ${JSON.stringify(message)}`);
    }
    
    // Listen for responses
    window.addEventListener("message", function(e) {
        if (e.source !== iframe.contentWindow) return;
        
        log(`Received: ${JSON.stringify(e.data)}`);
        
        // Handle specific events
        if (e.data.action === "guest-connected") {
            log(`Guest connected: ${e.data.streamID}`);
        } else if (e.data.guestList) {
            updateGuestList(e.data.guestList);
        }
    });
    
    // Logging
    function log(message) {
        const logDiv = document.getElementById("log");
        const entry = document.createElement("div");
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logDiv.appendChild(entry);
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    
    // Update guest list
    function updateGuestList(guests) {
        const select = document.getElementById("guest-select");
        select.innerHTML = "";
        
        guests.forEach((guest, index) => {
            const option = document.createElement("option");
            option.value = guest.id || (index + 1);
            option.textContent = guest.label || `Guest ${index + 1}`;
            select.appendChild(option);
        });
    }
    
    // Get initial guest list
    setTimeout(() => {
        iframe.contentWindow.postMessage({
            action: "getGuestList",
            cib: "initial-guests"
        }, "*");
    }, 2000);
    </script>
</body>
</html>
```

#### Important Notes

1. **Director Permissions**: Always use `&director=roomname` or `&codirector=password` for director commands
2. **Target Format**: Use slot numbers (1, 2, 3) or stream IDs for targeting
3. **Callback IDs**: Use unique `cib` values to track responses
4. **Error Handling**: Commands may fail silently without proper permissions
5. **Timing**: Wait for iframe to load before sending commands

#### Troubleshooting

* **Commands not working**: Check director permissions in iframe URL
* **No response**: Verify callback ID handling and message source
* **Guest not found**: Confirm target value matches slot or stream ID
* **Permission errors**: Ensure using `&director=` not `&room=`

This integration allows you to build powerful control interfaces using the full capabilities of the VDO.Ninja API through simple iframe messaging.
