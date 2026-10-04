# VDO.Ninja IFRAME API: Generic P2P Data Transmission Guide

This guide focuses specifically on how to send and receive generic data between clients using VDO.Ninja's peer-to-peer (P2P) data channels.

## Understanding the P2P Data Channels

VDO.Ninja provides a powerful API that allows websites to send arbitrary data between connected clients through its peer-to-peer infrastructure. This enables you to:

- Create custom communication channels between clients
- Implement application-specific data exchange
- Build interactive multi-user experiences
- Exchange any type of serializable data

## Why VDO.Ninja's P2P Data Channels Are Powerful

VDO.Ninja's data channels offer several compelling advantages that make them ideal for modern web applications:

- **Production-Proven Reliability**: Used in production applications like Social Stream Ninja, which processes hundreds of messages per minute per peer connection
- **Automatic LAN Optimization**: Detects when connections are on the same local network and routes data directly, reducing latency
- **Firewall Traversal**: Enables communication between devices behind different firewalls without port forwarding
- **Cost-Effective**: No server costs or bandwidth charges for data transmission, as everything happens peer-to-peer
- **Low Latency**: Direct connections between peers minimize delay, ideal for real-time applications
- **Scalability**: Each peer connects directly to others, distributing the load across the network
- **AI Integration Ready**: Perfect for distributing AI processing tasks or sharing AI-generated content between users
- **Remote Control Applications**: Enables secure remote control of devices through firewalls without complex networking setups
- **Works Across Platforms**: Functions on mobile, desktop, and various browsers without additional plugins

The creators of VDO.Ninja use these data channels in numerous applications beyond video, demonstrating their versatility and reliability in real-world scenarios.

## Basic Setup

First, set up your VDO.Ninja iframe:

```javascript
// Create the iframe element
var iframe = document.createElement("iframe");

// Set the source URL (your VDO.Ninja room)
iframe.src = "https://vdo.ninja/?room=your-room-name&password=your-password&datamode";

// Add the iframe to your page
document.getElementById("container").appendChild(iframe);
```

Data-only room guests connect automatically after admission without a camera, microphone, or explicit push ID. `&dataonly` is an alias. Use `&scene` or `&nopush` for a listener that connects to publishers without advertising itself; existing room approval and queue rules still apply.

[Open the two-participant example](room-data.html) to send data in both directions. Wait for a peer connection before calling `sendData`.

## Setting Up Event Listeners

To receive data from other clients, set up an event listener:

```javascript
// Set up event listener (cross-browser compatible)
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

// Connected peers storage
var connectedPeers = {};

// Add the event listener
eventer(messageEvent, function(e) {
    // Make sure the message is from our VDO.Ninja iframe
    if (e.source != iframe.contentWindow) return;
    
    // Process connection events to track connected peers
    if ("action" in e.data) {
        handleConnectionEvents(e.data);
    }
    
    // Handle received data
    if ("dataReceived" in e.data) {
        handleDataReceived(e.data.dataReceived, e.data.UUID);
    }
}, false);

function handleConnectionEvents(data) {
    if (data.action === "guest-connected" && data.streamID) {
        // Store connected peer information
        connectedPeers[data.streamID] = data.value?.label || "Guest";
        console.log("Guest connected:", data.streamID, "Label:", connectedPeers[data.streamID]);
    } 
    else if (data.action === "push-connection" && data.value === false && data.streamID) {
        // Remove disconnected peers
        console.log("Guest disconnected:", data.streamID);
        delete connectedPeers[data.streamID];
    }
}

function handleDataReceived(data, senderUUID) {
    console.log("Data received from:", senderUUID, "Data:", data);
    
    // Example: Check for your custom data namespace
    if (data.overlayNinja) {
        processCustomData(data.overlayNinja, senderUUID);
    }
}

function processCustomData(data, senderUUID) {
    // Process based on your application's needs
    console.log("Processing custom data:", data);
    
    // Example: Handle different data types
    if (data.message) {
        displayMessage(data.message);
    } else if (data.command) {
        executeCommand(data.command);
    }
}
```

## Sending Data

### Send Data Structure

When sending data via the VDO.Ninja IFRAME API, you use this general format:

```javascript
iframe.contentWindow.postMessage({
    sendData: yourDataPayload,
    type: "pcs",  // Connection type (see below)
    UUID: targetUUID  // Optional: specific target
}, "*");
```

The components are:

- `sendData`: Your data payload (object)
- `type`: Connection type (string)
  - `"pcs"`: Use peer connections (most reliable)
  - `"rpcs"`: Use request-based connections
- `UUID` or `streamID`: Optional target identifier

### Sending to All Connected Peers

```javascript
function sendDataToAllPeers(data) {
    // Create the data structure with your custom namespace
    var payload = {
        overlayNinja: data  // Your custom data under a namespace
    };
    
    // Send to all peers
    iframe.contentWindow.postMessage({
        sendData: payload,
        type: "pcs"  // Use peer connection for reliability
    }, "*");
}

// Example usage
sendDataToAllPeers({
    message: "Hello everyone!",
    timestamp: Date.now()
});
```

### Sending to a Specific Peer by UUID

```javascript
function sendDataToPeer(data, targetUUID) {
    // Create the data structure
    var payload = {
        overlayNinja: data  // Your custom data
    };
    
    // Send to specific UUID
    iframe.contentWindow.postMessage({
        sendData: payload,
        type: "pcs",
        UUID: targetUUID
    }, "*");
}

// Example usage
sendDataToPeer({
    message: "Hello specific peer!",
    timestamp: Date.now()
}, "peer-uuid-123");
```

### Sending to Peers with Specific Labels

```javascript
function sendDataByLabel(data, targetLabel) {
    // Create the data structure
    var payload = {
        overlayNinja: data  // Your custom data
    };
    
    // Iterate through connected peers to find those with matching label
    var keys = Object.keys(connectedPeers);
    for (var i = 0; i < keys.length; i++) {
        try {
            var UUID = keys[i];
            var label = connectedPeers[UUID];
            if (label === targetLabel) {
                // Send to this specific peer
                iframe.contentWindow.postMessage({
                    sendData: payload,
                    type: "pcs",
                    UUID: UUID
                }, "*");
            }
        } catch (e) {
            console.error("Error sending to peer:", e);
        }
    }
}

// Example usage
sendDataByLabel({
    message: "Hello all viewers!",
    timestamp: Date.now()
}, "viewer");
```

### Sending to a Peer by StreamID

```javascript
function sendDataByStreamID(data, streamID) {
    // Create the data structure
    var payload = {
        overlayNinja: data  // Your custom data
    };
    
    // Send to specific streamID
    iframe.contentWindow.postMessage({
        sendData: payload,
        type: "pcs",
        streamID: streamID
    }, "*");
}

// Example usage
sendDataByStreamID({
    message: "Hello by stream ID!",
    timestamp: Date.now()
}, "stream-123");
```

## Tracking Connected Peers

To reliably communicate with peers, keep track of connections and disconnections:

```javascript
// Store connected peers
var connectedPeers = {};

function handleConnectionEvents(data) {
    // Guest connections
    if (data.action === "guest-connected" && data.streamID) {
        connectedPeers[data.streamID] = data.value?.label || "Guest";
        console.log("Guest connected:", data.streamID, "Label:", connectedPeers[data.streamID]);
    }
    // View connections
    else if (data.action === "view-connection") {
        if (data.value && data.streamID) {
            connectedPeers[data.streamID] = "Viewer";
            console.log("Viewer connected:", data.streamID);
        } else if (data.streamID) {
            console.log("Viewer disconnected:", data.streamID);
            delete connectedPeers[data.streamID];
        }
    }
    // Director connections
    else if (data.action === "director-connected") {
        console.log("Director connected");
    }
    // Handle disconnections
    else if (data.action === "push-connection" && data.value === false && data.streamID) {
        console.log("User disconnected:", data.streamID);
        delete connectedPeers[data.streamID];
    }
}
```

## Getting All Connected StreamIDs

You can request a list of all connected streams:

```javascript
function getConnectedPeers() {
    iframe.contentWindow.postMessage({ getStreamIDs: true }, "*");
}

// In your event listener, handle the response:
if ("streamIDs" in e.data) {
    console.log("Connected streams:");
    for (var key in e.data.streamIDs) {
        console.log("StreamID:", key, "Label:", e.data.streamIDs[key]);
    }
}
```

## Detailed State Information

For more comprehensive information about the current state:

```javascript
function getDetailedState() {
    iframe.contentWindow.postMessage({ getDetailedState: true }, "*");
}

// Handle the response in your event listener
```

## Data Structure Best Practices

1. **Use a Namespace**: Put your data under a custom namespace to avoid conflicts
   ```javascript
   {
     sendData: {
       yourAppName: {
         // Your data here
       }
     }
   }
   ```

2. **Include Type Information**: Include type identifiers to differentiate messages
   ```javascript
   {
     sendData: {
       yourAppName: {
         type: "command",
         data: { /* command data */ }
       }
     }
   }
   ```

3. **Include Timestamp**: Add timestamps to help with ordering
   ```javascript
   {
     sendData: {
       yourAppName: {
         type: "update",
         data: { /* update data */ },
         timestamp: Date.now()
       }
     }
   }
   ```

## Complete Example: Simple Chat System

Here's a complete example implementing a simple chat system using the P2P data channels:

```javascript
// Create the interface
const container = document.createElement('div');
container.style.width = '100%';
container.style.maxWidth = '800px';
container.style.margin = '0 auto';
document.body.appendChild(container);

// Create VDO.Ninja iframe
const iframe = document.createElement('iframe');
iframe.allow = "camera;microphone;fullscreen;display-capture;autoplay;";
iframe.src = "https://vdo.ninja/?room=chat-demo&cleanoutput";
iframe.style.width = "100%";
iframe.style.height = "360px";
container.appendChild(iframe);

// Create chat interface
const chatContainer = document.createElement('div');
chatContainer.style.marginTop = '20px';
container.appendChild(chatContainer);

const chatMessages = document.createElement('div');
chatMessages.style.height = '300px';
chatMessages.style.border = '1px solid #ccc';
chatMessages.style.padding = '10px';
chatMessages.style.overflowY = 'scroll';
chatContainer.appendChild(chatMessages);

const inputContainer = document.createElement('div');
inputContainer.style.marginTop = '10px';
inputContainer.style.display = 'flex';
chatContainer.appendChild(inputContainer);

const messageInput = document.createElement('input');
messageInput.type = 'text';
messageInput.placeholder = 'Type your message...';
messageInput.style.flexGrow = '1';
messageInput.style.padding = '8px';
inputContainer.appendChild(messageInput);

const sendButton = document.createElement('button');
sendButton.textContent = 'Send';
sendButton.style.marginLeft = '10px';
sendButton.style.padding = '8px 16px';
inputContainer.appendChild(sendButton);

// Store connected peers
const connectedPeers = {};

// Add event listeners
sendButton.addEventListener('click', sendChatMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});

function sendChatMessage() {
    const message = messageInput.value.trim();
    if (message) {
        // Create message object
        const chatData = {
            type: 'chat',
            text: message,
            sender: 'Me',
            timestamp: Date.now()
        };
        
        // Add to local chat
        addMessageToChat(chatData.sender, chatData.text);
        
        // Send to all peers
        sendDataToAllPeers(chatData);
        
        // Clear input
        messageInput.value = '';
    }
}

function addMessageToChat(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.style.marginBottom = '8px';
    
    const senderSpan = document.createElement('strong');
    senderSpan.textContent = sender + ': ';
    messageElement.appendChild(senderSpan);
    
    const textNode = document.createTextNode(text);
    messageElement.appendChild(textNode);
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendDataToAllPeers(data) {
    // Create the data structure
    const payload = {
        chatApp: data  // Using a custom namespace
    };
    
    // Send to all peers
    iframe.contentWindow.postMessage({
        sendData: payload,
        type: "pcs"
    }, "*");
}

// Set up event listener for messages from iframe
const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
const eventer = window[eventMethod];
const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function(e) {
    // Make sure the message is from our VDO.Ninja iframe
    if (e.source != iframe.contentWindow) return;
    
    // Process connection events
    if ("action" in e.data) {
        handleConnectionEvents(e.data);
    }
    
    // Handle received data
    if ("dataReceived" in e.data) {
        handleDataReceived(e.data.dataReceived, e.data.UUID);
    }
}, false);

function handleConnectionEvents(data) {
    if (data.action === "guest-connected" && data.streamID) {
        // Store connected peer information
        connectedPeers[data.streamID] = data.value?.label || "Guest";
        console.log("Guest connected:", data.streamID, "Label:", connectedPeers[data.streamID]);
        
        // Announce new connection in chat
        addMessageToChat("System", `${connectedPeers[data.streamID]} joined the chat`);
    } 
    else if (data.action === "push-connection" && data.value === false && data.streamID) {
        // Announce disconnection
        if (connectedPeers[data.streamID]) {
            addMessageToChat("System", `${connectedPeers[data.streamID]} left the chat`);
        }
        
        // Remove from tracking
        console.log("Guest disconnected:", data.streamID);
        delete connectedPeers[data.streamID];
    }
}

function handleDataReceived(data, senderUUID) {
    // Check for chat messages
    if (data.chatApp && data.chatApp.type === 'chat') {
        const chatData = data.chatApp;
        
        // Get sender name from our peer tracking if available
        const senderName = connectedPeers[senderUUID] || chatData.sender || "Unknown";
        
        // Add to chat
        addMessageToChat(senderName, chatData.text);
    }
}
```

## Best Practices

1. **Track Connections**: Always maintain a list of connected peers
2. **Use Namespaces**: Organize your data under custom namespaces
3. **Add Type Information**: Include message types for easier processing
4. **Include Timestamps**: Help with ordering and synchronization
5. **Error Handling**: Use try/catch blocks when sending messages
6. **Data Size**: Keep payloads reasonably small to avoid performance issues
7. **UUID vs StreamID**: Prefer UUID for targeting as it's more stable

## Troubleshooting

- **No Data Received**: Verify the UUID or streamID is correct
- **Connection Issues**: Check if peers are properly connected before sending
- **Timing Problems**: Ensure the iframe is fully loaded before sending messages
- **Data Format**: Make sure your data is properly serializable
- **Security Settings**: Check that your iframe permissions are set correctly

By following this guide, you can implement robust P2P data exchange between VDO.Ninja clients for any custom application.