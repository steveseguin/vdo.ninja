---
description: Detect user joins and disconnects in embedded VDO.Ninja streams using iframe postMessage events.
---

# Detecting User Joins / Disconnects

## Understanding the VDO.Ninja IFRAME API: Detecting User Joins and Disconnects

The VDO.Ninja IFRAME API allows websites to embed and interact with VDO.Ninja streams. One of the most useful features is the ability to detect when users join or disconnect from your stream through event messaging. This guide will explain how to implement this functionality in your own projects.

### How the IFRAME API Works

VDO.Ninja's IFRAME API uses the browser's `postMessage` API to communicate between your parent website and the embedded VDO.Ninja iframe. This allows you to:

1. Send commands to control the VDO.Ninja instance
2. Receive events and data from the VDO.Ninja instance

### Setting Up the Basic Structure

First, you need to create an iframe that loads VDO.Ninja:

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
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
