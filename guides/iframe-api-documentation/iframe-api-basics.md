---
description: 'Understanding the VDO.Ninja IFRAME API: Detecting User Joins and Disconnects'
---

# IFRAME API Basics

The VDO.Ninja IFRAME API allows websites to embed and interact with VDO.Ninja streams. One of the most useful features is the ability to detect when users join or disconnect from your stream through event messaging. This guide will explain how to implement this functionality in your own projects.

### How the IFRAME API Works

VDO.Ninja's IFRAME API uses the browser's `postMessage` API to communicate between your parent website and the embedded VDO.Ninja iframe. This allows you to:

1. Send commands to control the VDO.Ninja instance
2. Receive events and data from the VDO.Ninja instance

### Setting Up the Basic Structure

irst, you need to create an iframe that loads VDO.Ninja:

```
// Create the iframe element
var iframe = document.createElement("iframe");

// Set necessary permissions
iframe.allow = "camera;microphone;fullscreen;display-capture;autoplay;";

// Set the source URL (your VDO.Ninja room)
iframe.src = "https://vdo.ninja/?room=your-room-name&cleanoutput";

// Add the iframe to your page
document.getElementById("container").appendChild(iframe);
```

### Setting Up the Event Listener

To detect joins and disconnects, you need to set up an event listener for messages from the iframe:

```
// Set up event listener (cross-browser compatible)
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

// Add the event listener
eventer(messageEvent, function (e) {
    // Make sure the message is from our VDO.Ninja iframe
    if (e.source != iframe.contentWindow) return;
    
    // Log the data for debugging
    console.log(e.data);
    
    // Process specific events
    if ("action" in e.data) {
        // Handle different actions
        handleAction(e.data);
    }
}, false);
```

### Detecting User Joins and Disconnects

The key events to watch for are:

#### Guest Connections

```
function handleAction(data) {
    if (data.action === "guest-connected") {
        // A new guest has connected
        console.log("Guest connected:", data.streamID);
        
        // You can access additional info if available
        if (data.value && data.value.label) {
            console.log("Guest label:", data.value.label);
        }
    }
    else if (data.action === "view-connection") {
        // Someone viewing the stream has connected
        console.log("Viewer connected:", data.streamID);
        
        // The value property will be true for connections
        if (data.value) {
            console.log("New viewer connected");
        } else {
            console.log("Viewer disconnected");
        }
    }
    else if (data.action === "director-connected") {
        // The director has connected
        console.log("Director connected");
    }
    else if (data.action === "scene-connected") {
        // A scene has connected
        console.log("Scene connected:", data.value); // Scene ID
    }
    else if (data.action === "slot-updated") {
        // A stream has been assigned to a slot
        console.log("Stream", data.streamID, "assigned to slot", data.value);
    }
}
```

#### Disconnections

```
function handleAction(data) {
    // Handling disconnections
    if (data.action === "view-connection" && data.value === false) {
        // A viewer has disconnected
        console.log("Viewer disconnected:", data.streamID);
    }
    else if (data.action === "director-share" && data.value === false) {
        // A director has stopped sharing
        console.log("Director stopped sharing:", data.streamID);
    }
    else if (data.action === "push-connection" && data.value === false) {
        // A guest has disconnected
        console.log("Guest disconnected:", data.streamID);
    }
}
```

### Complete Working Example

Here's a complete example that demonstrates detecting joins and disconnects:

```
// Create the container for the iframe
var container = document.createElement("div");
container.id = "vdo-container";
document.body.appendChild(container);

// Create the iframe element
var iframe = document.createElement("iframe");
iframe.allow = "camera;microphone;fullscreen;display-capture;autoplay;";
iframe.src = "https://vdo.ninja/?room=your-room-name&cleanoutput";
iframe.style.width = "100%";
iframe.style.height = "100%";
container.appendChild(iframe);

// Create a status display element
var statusDiv = document.createElement("div");
statusDiv.id = "connection-status";
document.body.appendChild(statusDiv);

// Set up event listener
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

// Keep track of connected users
var connectedUsers = {};

// Add the event listener
eventer(messageEvent, function (e) {
    // Make sure the message is from our VDO.Ninja iframe
    if (e.source != iframe.contentWindow) return;
    
    // Log all messages for debugging
    console.log(e.data);
    
    // Process specific actions
    if ("action" in e.data) {
        handleAction(e.data);
    }
}, false);

function handleAction(data) {
    // Handle connections
    if (data.action === "guest-connected" && data.streamID) {
        connectedUsers[data.streamID] = data.value?.label || "Guest";
        updateStatusDisplay("Guest connected: " + (data.value?.label || data.streamID));
    }
    else if (data.action === "view-connection") {
        if (data.value && data.streamID) {
            connectedUsers[data.streamID] = "Viewer";
            updateStatusDisplay("Viewer connected: " + data.streamID);
        } else if (data.streamID) {
            delete connectedUsers[data.streamID];
            updateStatusDisplay("Viewer disconnected: " + data.streamID);
        }
    }
    else if (data.action === "director-connected") {
        updateStatusDisplay("Director connected");
    }
    else if (data.action === "push-connection" && data.value === false && data.streamID) {
        delete connectedUsers[data.streamID];
        updateStatusDisplay("User disconnected: " + data.streamID);
    }
}

function updateStatusDisplay(message) {
    var timestamp = new Date().toLocaleTimeString();
    statusDiv.innerHTML += `<p>${timestamp}: ${message}</p>`;
    
    // Update connected users count
    var count = Object.keys(connectedUsers).length;
    document.getElementById("user-count").textContent = count;
}

// Add a user count display
var countDiv = document.createElement("div");
countDiv.innerHTML = "Connected users: <span id='user-count'>0</span>";
document.body.insertBefore(countDiv, statusDiv);
```

### Waiting Room Example

You can implement a waiting room like the one in the `waitingroom.html` file from your code samples:

```
// Setup event listener
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
var waiting = null;

eventer(messageEvent, function (e) {
    if (e.source != iframe.contentWindow) return;
    
    if ("action" in e.data) {
        if (e.data.action == "joining-room") {
            // Show initial joining message
            outputWindow.innerHTML = "JOINING ROOM";
            
            // After 1 second, show waiting message if director hasn't joined
            waiting = setTimeout(function() {
                outputWindow.innerHTML = "Waiting for the director to join";
                outputWindow.classList.remove("hidden");
            }, 1000);
        } 
        else if (e.data.action == "director-connected") {
            // Director has joined, clear waiting message
            clearTimeout(waiting);
            outputWindow.innerHTML = "";
            outputWindow.classList.add("hidden");
        }
    }
});
```

### Getting Additional Information About Connections

For more detailed information about connections, you can use the `getStreamIDs` or `getDetailedState` commands:

```
// Request info about all connected streams
iframe.contentWindow.postMessage({ "getStreamIDs": true }, "*");

// Request detailed state information
iframe.contentWindow.postMessage({ "getDetailedState": true }, "*");
```

### Best Practices

1. **Always check the source**: Make sure messages are coming from your VDO.Ninja iframe.
2. **Handle disconnections gracefully**: Sometimes connections drop unexpectedly.
3. **Consider implementing reconnection logic**: If important users disconnect, you might want to notify them or attempt to reconnect.
4. **Debug with console.log**: Log all events during development to understand the full message flow.
5. **Test with multiple users**: The behavior can be different depending on who connects first.

By implementing these techniques, you can build sophisticated applications that respond to users joining and leaving your VDO.Ninja sessions, creating more interactive and responsive experiences.

##

##

## VDO.Ninja IFRAME API - Complete Inbound Control Reference

This document provides a comprehensive list of all inbound remote control calls available through the VDO.Ninja IFRAME API. These commands allow you to control a VDO.Ninja instance embedded in an iframe from your parent webpage.

### Table of Contents

* [Basic Usage](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#basic-usage)
* [Audio Controls](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#audio-controls)
* [Video Controls](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#video-controls)
* [Stream Management](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#stream-management)
* [Recording Controls](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#recording-controls)
* [Group Management](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#group-management)
* [Bitrate & Quality Controls](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#bitrate--quality-controls)
* [Device Management](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#device-management)
* [Layout & Display Controls](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#layout--display-controls)
* [Data & Messaging](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#data--messaging)
* [Statistics & Monitoring](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#statistics--monitoring)
* [Utility Functions](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#utility-functions)
* [Advanced Controls](https://github.com/steveseguin/Companion-Ninja/blob/main/iframeapi.md#advanced-controls)

### Basic Usage

To send commands to the VDO.Ninja iframe:

```
iframe.contentWindow.postMessage({
    command: value,
    // optional parameters
}, "*");
```

### Audio Controls

#### `mic` - Microphone Control

Controls the local microphone mute state.

```
// Unmute microphone
iframe.contentWindow.postMessage({ mic: true }, "*");

// Mute microphone
iframe.contentWindow.postMessage({ mic: false }, "*");

// Toggle microphone
iframe.contentWindow.postMessage({ mic: "toggle" }, "*");
```

#### `mute` / `speaker` - Speaker Control

Controls the speaker mute state (incoming audio).

```
// Mute speakers
iframe.contentWindow.postMessage({ mute: true }, "*");
// OR
iframe.contentWindow.postMessage({ speaker: false }, "*");

// Unmute speakers
iframe.contentWindow.postMessage({ mute: false }, "*");
// OR
iframe.contentWindow.postMessage({ speaker: true }, "*");

// Toggle speaker
iframe.contentWindow.postMessage({ mute: "toggle" }, "*");
```

#### `volume` - Volume Control

Sets the volume level for incoming audio (0.0 to 1.0).

```
// Set volume to 50%
iframe.contentWindow.postMessage({ volume: 0.5 }, "*");

// Set volume for specific stream
iframe.contentWindow.postMessage({ 
    volume: 0.8, 
    target: "streamID123" // or use "*" for all streams
}, "*");
```

#### `panning` - Audio Panning

Adjusts stereo panning for incoming audio.

```
// Pan left (-90 to 90, where -90 is full left, 90 is full right)
iframe.contentWindow.postMessage({ 
    panning: -45,
    UUID: "connection-uuid" // optional, applies to all if omitted
}, "*");
```

#### `targetAudioBitrate` - Audio Bitrate Target

Sets the target audio bitrate (in kbps).

```
iframe.contentWindow.postMessage({ 
    targetAudioBitrate: 128,
    target: "streamID123" // optional
}, "*");
```

#### `audiobitrate` - Audio Bitrate Control

Changes the audio bitrate with optional lock.

```
iframe.contentWindow.postMessage({ 
    audiobitrate: 64,
    lock: true, // optional, defaults to true
    target: "streamID123" // optional
}, "*");
```

#### `PPT` - Push-to-Talk

Controls push-to-talk functionality.

```
// Activate PPT (unmute)
iframe.contentWindow.postMessage({ PPT: true }, "*");

// Deactivate PPT (mute)
iframe.contentWindow.postMessage({ PPT: false }, "*");

// Toggle PPT
iframe.contentWindow.postMessage({ PPT: "toggle" }, "*");
```

### Video Controls

#### `camera` - Camera Control

Controls the local camera on/off state.

```
// Turn on camera
iframe.contentWindow.postMessage({ camera: true }, "*");

// Turn off camera
iframe.contentWindow.postMessage({ camera: false }, "*");

// Toggle camera
iframe.contentWindow.postMessage({ camera: "toggle" }, "*");
```

#### `pauseinvisible` - Pause Invisible Videos

Controls whether videos hidden in the mixer are paused.

```
// Enable pause invisible
iframe.contentWindow.postMessage({ pauseinvisible: true }, "*");

// Disable pause invisible
iframe.contentWindow.postMessage({ pauseinvisible: false }, "*");

// Toggle
iframe.contentWindow.postMessage({ pauseinvisible: "toggle" }, "*");
```

#### `keyframe` - Request Keyframe

Forces a keyframe to be sent to all scene connections.

```
iframe.contentWindow.postMessage({ keyframe: true }, "*");
```

### Stream Management

#### `requestStream` - Request Specific Stream

Loads a specific stream by ID.

```
iframe.contentWindow.postMessage({ 
    requestStream: "streamID123" 
}, "*");
```

#### `close` / `hangup` - Disconnect Streams

Disconnects and hangs up connections.

```
// Normal hangup
iframe.contentWindow.postMessage({ close: true }, "*");

// Emergency stop (immediate)
iframe.contentWindow.postMessage({ close: "estop" }, "*");

// Hangup and reload
iframe.contentWindow.postMessage({ close: "reload" }, "*");
```

### Recording Controls

#### `record` - Local Recording Control

Controls local video recording.

```
// Start recording
iframe.contentWindow.postMessage({ record: true }, "*");

// Stop recording
iframe.contentWindow.postMessage({ record: false }, "*");

// Record specific video element
iframe.contentWindow.postMessage({ 
    record: "videoElementId" 
}, "*");
```

### Group Management

#### `groups` - Set Groups

Sets the groups for the local stream.

```
// Set groups as array
iframe.contentWindow.postMessage({ 
    groups: ["group1", "group2"] 
}, "*");

// Set groups as comma-separated string
iframe.contentWindow.postMessage({ 
    groups: "group1,group2" 
}, "*");

// Clear groups
iframe.contentWindow.postMessage({ groups: [] }, "*");
```

#### `groupView` - Set View Groups

Sets which groups are visible.

```
// View specific groups
iframe.contentWindow.postMessage({ 
    groupView: ["group1", "group3"] 
}, "*");

// View all groups
iframe.contentWindow.postMessage({ groupView: [] }, "*");
```

### Bitrate & Quality Controls

#### `bitrate` - Video Bitrate Control

Sets video bitrate for streams (in kbps).

```
// Set bitrate for all streams
iframe.contentWindow.postMessage({ 
    bitrate: 2500,
    lock: true // optional, defaults to true
}, "*");

// Set bitrate for specific stream
iframe.contentWindow.postMessage({ 
    bitrate: 1000,
    target: "streamID123" // or UUID: "uuid-here"
}, "*");
```

#### `targetBitrate` - Target Video Bitrate

Sets the fundamental bitrate target.

```
iframe.contentWindow.postMessage({ 
    targetBitrate: 3000,
    target: "streamID123" // optional
}, "*");
```

#### `manualBitrate` - Manual Bandwidth Control

Sets manual bandwidth limits.

```
iframe.contentWindow.postMessage({ 
    manualBitrate: 5000,
    target: "streamID123" // optional
}, "*");
```

#### `scale` - Resolution Scaling

Controls resolution scaling.

```
// Set specific scale percentage
iframe.contentWindow.postMessage({ scale: 50 }, "*");

// Disable manual scaling (enable dynamic)
iframe.contentWindow.postMessage({ scale: false }, "*");

// Apply to specific stream
iframe.contentWindow.postMessage({ 
    scale: 75,
    UUID: "connection-uuid"
}, "*");
```

#### `targetWidth` / `targetHeight` - Resolution Request

Request specific resolution from remote connection.

```
iframe.contentWindow.postMessage({ 
    targetWidth: 1280,
    targetHeight: 720,
    UUID: "connection-uuid" // required
}, "*");
```

### Device Management

#### `changeVideoDevice` - Change Camera

Changes the active video input device.

```
iframe.contentWindow.postMessage({ 
    changeVideoDevice: "deviceId-here" 
}, "*");
```

#### `changeAudioDevice` - Change Microphone

Changes the active audio input device.

```
iframe.contentWindow.postMessage({ 
    changeAudioDevice: "deviceId-here" 
}, "*");
```

#### `changeAudioOutputDevice` - Change Speaker

Changes the audio output device.

```
iframe.contentWindow.postMessage({ 
    changeAudioOutputDevice: "deviceId-here" 
}, "*");
```

#### `getDeviceList` - List Available Devices

Requests a list of available media devices.

```
iframe.contentWindow.postMessage({ 
    getDeviceList: true,
    cib: "callback-id" // optional callback ID
}, "*");

// Response will be sent back via postMessage:
// { deviceList: [...], cib: "callback-id" }
```

### Layout & Display Controls

#### `layout` - Set Layout



Sets the display layout.

```
// Set single layout
iframe.contentWindow.postMessage({ layout: "grid" }, "*");

// Set multiple layouts (array)
iframe.contentWindow.postMessage({ 
    layout: ["grid", "presenter"] 
}, "*");

// With scene control (director only)
iframe.contentWindow.postMessage({ 
    layout: "grid",
    scene: 1,
    UUID: "target-uuid" // optional
}, "*");
```

#### `previewMode` - Switch Preview Mode

Switches between preview modes.

```
iframe.contentWindow.postMessage({ 
    previewMode: 1 // mode number
}, "*");
```

#### `slotmode` - Slot Mode Control

Controls slot mode behavior.

```
iframe.contentWindow.postMessage({ 
    slotmode: 1 // slot mode number, or false to disable
}, "*");
```

#### `advancedMode` - Toggle Advanced UI

Shows/hides advanced UI elements.

```
// Show advanced elements
iframe.contentWindow.postMessage({ advancedMode: true }, "*");

// Hide advanced elements
iframe.contentWindow.postMessage({ advancedMode: false }, "*");
```

#### `toggleSettings` - Toggle Settings Panel

Controls the settings panel visibility.

```
// Toggle settings
iframe.contentWindow.postMessage({ toggleSettings: "toggle" }, "*");

// Show settings
iframe.contentWindow.postMessage({ toggleSettings: true }, "*");
```

#### `target` - DOM Manipulation

Manipulates video elements in the DOM.

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
        muted: true
    }
}, "*");
```

### Data & Messaging

#### `sendData` - Send Generic Data

Sends data through peer connections.

```
iframe.contentWindow.postMessage({ 
    sendData: { custom: "data" },
    UUID: "target-uuid", // optional
    streamID: "streamID123", // optional
    type: "custom-type" // optional
}, "*");
```

#### `sendChat` - Send Chat Message

Sends a chat message to all peers.

```
iframe.contentWindow.postMessage({ 
    sendChat: "Hello everyone!" 
}, "*");
```

#### `sendMessage` - WebRTC Message to Viewers

Sends a message to viewer connections.

```
iframe.contentWindow.postMessage({ 
    sendMessage: { custom: "viewer-data" } 
}, "*");
```

#### `sendRequest` - WebRTC Request to Publishers

Sends a request to publisher connections.

```
iframe.contentWindow.postMessage({ 
    sendRequest: { action: "some-action" } 
}, "*");
```

#### `sendPeers` - Message All Peers

Sends a message to all connected peers.

```
iframe.contentWindow.postMessage({ 
    sendPeers: { broadcast: "data" } 
}, "*");
```

#### `sendRawMIDI` - Send MIDI Data

Sends raw MIDI messages.

```
iframe.contentWindow.postMessage({ 
    sendRawMIDI: {
        data: [144, 60, 127], // MIDI data array
        channel: 1,
        timestamp: Date.now()
    },
    UUID: "target-uuid" // optional
}, "*");
```

### Statistics & Monitoring

#### `getStats` - Get Quick Stats

Requests current statistics.

```
// Get all stats
iframe.contentWindow.postMessage({ 
    getStats: true,
    cib: "callback-id"
}, "*");

// Get stats for specific stream
iframe.contentWindow.postMessage({ 
    getStats: true,
    streamID: "streamID123",
    cib: "callback-id"
}, "*");
```

#### `getFreshStats` - Get Detailed Stats

Requests detailed statistics (takes \~1 second).

```
iframe.contentWindow.postMessage({ 
    getFreshStats: true,
    cib: "callback-id"
}, "*");
```

#### `getRemoteStats` - Request Remote Stats

Requests statistics from remote peers.

```
iframe.contentWindow.postMessage({ 
    getRemoteStats: true 
}, "*");
```

#### `requestStatsContinuous` - Continuous Stats

Enables/disables continuous statistics updates.

```
// Enable continuous stats
iframe.contentWindow.postMessage({ 
    requestStatsContinuous: true 
}, "*");

// Disable continuous stats
iframe.contentWindow.postMessage({ 
    requestStatsContinuous: false 
}, "*");
```

#### `getLoudness` - Audio Loudness Monitoring

Enables/disables loudness monitoring.

```
// Enable loudness monitoring
iframe.contentWindow.postMessage({ 
    getLoudness: true,
    cib: "callback-id"
}, "*");

// Disable loudness monitoring
iframe.contentWindow.postMessage({ 
    getLoudness: false 
}, "*");
```

Notes:

- Loudness push is opt-in and off by default.
- Call `getLoudness: true` once to subscribe.
- `&pushloudness` (or `&getloudness`) in the iframe URL also enables loudness push.
- The first message is a snapshot (`mode: "snapshot"`), then continuous updates arrive as `mode: "update"`.
- Loudness messages use `action: "loudness"` and include a `loudness` object.
- `cib` is echoed only if you provide it on the subscribe request.
- Avoid polling `getLoudness` on an interval.

#### `getStreamIDs` - List Stream IDs

Gets a list of all connected stream IDs.

```
iframe.contentWindow.postMessage({ 
    getStreamIDs: true,
    cib: "callback-id"
}, "*");
```

#### `getStreamInfo` - Detailed Stream Information

Gets detailed information about all streams.

```
iframe.contentWindow.postMessage({ 
    getStreamInfo: true,
    cib: "callback-id"
}, "*");
```

#### `getDetailedState` - Complete State Information

Gets comprehensive state information.

```
iframe.contentWindow.postMessage({ 
    getDetailedState: true,
    cib: "callback-id"
}, "*");
```

For chunked viewer integrations, each remote stream entry can include:

* `chunkedBufferDefault` - the current inherited/default chunked playout request
* `chunkedBufferOverride` - an explicit per-stream buffer override, if one is set
* `chunkedBufferRequested` - the effective requested value for that stream before live adaptation
* `chunkedBufferCeil` - the configured viewer-side ceiling for chunked playout
* `chunkedBufferAdaptive` - whether adaptive chunked target adjustments are enabled

#### `getGuestList` - Get Guest List

Gets a list of all connected guests.

```
iframe.contentWindow.postMessage({ 
    getGuestList: true,
    cib: "callback-id"
}, "*");
```

### Utility Functions

#### `reload` - Reload Page

Forces a page reload.

```
iframe.contentWindow.postMessage({ reload: true }, "*");
```

#### `style` - Inject Custom CSS

Injects custom CSS into the iframe.

```
iframe.contentWindow.postMessage({ 
    style: `
        .videoContainer { border: 2px solid red; }
        #mutebutton { background: blue; }
    `
}, "*");
```

#### `function` - Execute Built-in Functions

Executes predefined functions.

```
// Preview webcam
iframe.contentWindow.postMessage({ 
    function: "previewWebcam" 
}, "*");

// Publish screen
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

// Execute arbitrary code (use with caution)
iframe.contentWindow.postMessage({ 
    function: "eval",
    value: "console.log('Hello from eval');"
}, "*");
```

#### `saveVideoFrameToDisk` - Save Screenshot

Saves a video frame to disk.

```
// Save local video
iframe.contentWindow.postMessage({ 
    saveVideoFrameToDisk: true,
    filename: "screenshot.png" // optional
}, "*");

// Save specific stream
iframe.contentWindow.postMessage({ 
    saveVideoFrameToDisk: true,
    streamID: "streamID123",
    filename: "stream-capture.jpg"
}, "*");

// Save all streams
iframe.contentWindow.postMessage({ 
    saveVideoFrameToDisk: true,
    UUID: "*"
}, "*");
```

#### `getVideoFrame` - Get Video Frame Data

Gets video frame data as base64.

```
iframe.contentWindow.postMessage({ 
    getVideoFrame: true,
    streamID: "streamID123", // or UUID
    cib: "callback-id"
}, "*");
```

#### `copyVideoFrameToClipboard` - Copy Screenshot

Copies a video frame to clipboard.

```
iframe.contentWindow.postMessage({ 
    copyVideoFrameToClipboard: true,
    streamID: "streamID123" // or UUID
}, "*");
```

#### `getSnapshotBySlot` / `getSnapshotByStreamID` - Get Slot/Stream Snapshot

Gets a snapshot from a specific slot or stream using MediaStreamTrackProcessor.

```
// By slot number
iframe.contentWindow.postMessage({ 
    getSnapshotBySlot: 0, // slot index
    cib: "callback-id"
}, "*");

// By stream ID
iframe.contentWindow.postMessage({ 
    getSnapshotByStreamID: "streamID123",
    cib: "callback-id"
}, "*");

// Response includes base64 image data:
// {
//     type: 'frame',
//     frame: 'data:image/png;base64,...',
//     UUID: 'connection-uuid',
//     streamID: 'streamID123',
//     slot: 0,
//     format: 'png',
//     cib: 'callback-id'
// }
```

### Advanced Controls

#### `sceneState` - OBS Scene State

Sets the scene state for OBS integration.

```
// Scene is live
iframe.contentWindow.postMessage({ 
    sceneState: true 
}, "*");

// Scene is not live
iframe.contentWindow.postMessage({ 
    sceneState: false 
}, "*");
```

#### `layouts` - OBS Layout Sync

Syncs layouts with OBS.

```
iframe.contentWindow.postMessage({ 
    layouts: ["layout1", "layout2"],
    obsSceneTriggers: true // optional
}, "*");
```

#### `obsCommand` - OBS Commands

Sends commands to OBS.

```
iframe.contentWindow.postMessage({ 
    obsCommand: "some-command",
    remote: "remote-id", // optional
    UUID: "target-uuid", // optional
    streamID: "streamID123" // optional
}, "*");
```

#### `setBufferDelay` - Audio/Video Buffer Delay

Sets the buffer delay in milliseconds.

```
// Set default buffer delay
iframe.contentWindow.postMessage({ 
    setBufferDelay: 200 
}, "*");

// Set for specific stream
iframe.contentWindow.postMessage({ 
    setBufferDelay: 300,
    streamID: "streamID123" // or UUID or label
}, "*");

// Set for all streams
iframe.contentWindow.postMessage({ 
    setBufferDelay: 250,
    UUID: "*"
}, "*");
```

Notes:

* Sending `setBufferDelay` **without** `streamID`, `UUID`, or `label` updates the viewer's default requested buffer.
* Sending it **with** `streamID`, `UUID`, or `label` creates/updates an explicit per-stream override.
* `UUID: "*"` fans the same request out to all currently connected streams.
* For chunked video workflows, the live target can still differ from the requested value if adaptive buffering is enabled.
* If you need a fixed long-delay video target, load the viewer with:

```text
&noaudio&chunkbufferadaptive=0&chunkbufferceil=180000
```

That pattern is useful for music-sync tools where the audio is handled externally and VDO.Ninja is only delaying video to match it.

#### `automixer` - Automixer Control

Controls the automatic mixer behavior.

```
// Enable automixer
iframe.contentWindow.postMessage({ 
    automixer: true 
}, "*");

// Disable automixer (manual control)
iframe.contentWindow.postMessage({ 
    automixer: false 
}, "*");
```

#### `enableYouTube` - YouTube Chat Integration



Enables YouTube chat integration.

```
// Enable with API key
iframe.contentWindow.postMessage({ 
    enableYouTube: "your-youtube-api-key" 
}, "*");

// Enable with existing key
iframe.contentWindow.postMessage({ 
    enableYouTube: true 
}, "*");
```

#### `nextSlide` / `prevSlide` - Slide Navigation

Controls slide navigation.

```
// Next slide
iframe.contentWindow.postMessage({ nextSlide: true }, "*");

// Previous slide
iframe.contentWindow.postMessage({ prevSlide: true }, "*");
```

#### `getFaces` / `faceTrack` - Face Detection

Controls face detection/tracking.

```
// Enable face tracking
iframe.contentWindow.postMessage({ 
    getFaces: true,
    faceTrack: true
}, "*");

// Disable face tracking
iframe.contentWindow.postMessage({ 
    getFaces: true,
    faceTrack: false
}, "*");
```

#### `getEffectsData` - Effects Data

Gets data from visual effects (face tracking, etc.).

```
// Get specific effect data
iframe.contentWindow.postMessage({ 
    getEffectsData: "effect-name" 
}, "*");

// Disable effects data
iframe.contentWindow.postMessage({ 
    getEffectsData: false 
}, "*");
```

#### `action` - Companion API Actions



Executes Companion API actions.

```
iframe.contentWindow.postMessage({ 
    action: "action-name",
    value: "action-value",
    target: "optional-target"
}, "*");
```

### Response Handling

Many commands support a callback ID (`cib`) for tracking responses:

```
// Send request with callback ID
iframe.contentWindow.postMessage({ 
    getStats: true,
    cib: "unique-callback-123"
}, "*");

// Listen for response
window.addEventListener("message", function(e) {
    if (e.data.cib === "unique-callback-123") {
        console.log("Stats received:", e.data.stats);
    }
});
```

### Notes



* All commands are sent via `postMessage` to the iframe's `contentWindow`
* The second parameter `"*"` can be replaced with a specific origin for security
* Some commands require director privileges to function
* Commands that affect remote streams often accept `UUID`, `streamID`, or `target` parameters
* The `lock` parameter on bitrate controls prevents automatic adjustments
* Many "get" commands return data via postMessage back to the parent window
