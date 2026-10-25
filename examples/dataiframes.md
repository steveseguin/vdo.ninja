# VDO.Ninja IFRAME API: Generic P2P Data Transmission Guide

You can send your own data between VDO.Ninja clients over their WebRTC data channels, using the IFRAME API. Use it for chat, remote control, game state, or any JSON-serializable data your app needs to share.

Data goes peer to peer when a direct connection is possible, so it works through most firewalls without port forwarding. If a direct path fails, the connection may fall back to a TURN relay server.

## Basic setup

```javascript
var iframe = document.createElement("iframe");
iframe.src = "https://vdo.ninja/?room=your-room-name&password=your-password&datamode";
document.getElementById("container").appendChild(iframe);
```

`&datamode` (alias `&dataonly`) turns off camera and microphone. Data-only room guests connect automatically after they are admitted, with no explicit push ID. For a listener that connects to publishers without publishing itself, use `&scene` or `&nopush` instead. The room's existing approval and queue rules still apply.

[room-data.html](room-data.html) is a two-participant example that sends data both ways. Wait for a peer connection before you call `sendData`.

## Receiving data

Data sent by a peer arrives at your page as `{ dataReceived, UUID }`, where `UUID` identifies the sender's connection.

```javascript
var connectedPeers = {}; // UUID -> label and active push/view directions

window.addEventListener("message", function (e) {
    if (e.source != iframe.contentWindow) return; // only accept our iframe
    if (!e.data || typeof e.data !== "object") return;
    if ("action" in e.data) {
        handleConnectionEvents(e.data);
    }
    if ("dataReceived" in e.data) {
        handleDataReceived(e.data.dataReceived, e.data.UUID);
    }
});

function handleDataReceived(data, senderUUID) {
    if (data.myApp) { // your own namespace
        var peer = connectedPeers[senderUUID];
        console.log("From", peer ? peer.label : senderUUID, data.myApp);
    }
}
```

## Tracking connected peers

Track peers by `UUID`: it is included in every connection event and in received data. `streamID` is not always included.

```javascript
function handleConnectionEvents(data) {
    if (!data.UUID) return;
    var isConnection = data.action === "push-connection" || data.action === "view-connection";

    var peer = connectedPeers[data.UUID];
    var direction = data.action === "view-connection" ? "view" : "push";

    if (isConnection && data.value === true) {
        if (!peer) {
            peer = { label: data.streamID || "Peer", view: false, push: false };
            connectedPeers[data.UUID] = peer;
        }
        peer[direction] = true;
    } else if (isConnection && data.value === false && peer) {
        peer[direction] = false;
        if (!peer.view && !peer.push) {
            delete connectedPeers[data.UUID];
        }
    } else if (data.action.endsWith("-connection-info") && peer && data.value && data.value.label) {
        peer.label = data.value.label; // the peer's &label
    }
}
```

`push-connection` covers peers that receive your stream; `view-connection` covers streams you receive. A peer can have both directions open under the same UUID, so keep them in the list until both close. See [iframeapi.md](iframeapi.md#connection-events) for all connection events.

To ask for the current list of streams you view, send `{ getStreamIDs: true }`. The reply is `{ streamIDs: { streamID: label } }`.

## Sending data

```javascript
iframe.contentWindow.postMessage({
    sendData: { myApp: { message: "Hello" } }, // your payload
    UUID: targetUUID, // optional: one peer
    type: "pcs"       // optional: limit the direction
}, "*");
```

| Field | Meaning |
|---|---|
| `sendData` | Your payload. Any JSON-serializable value. |
| `UUID` | Send to this connection only |
| `streamID` | Send to the publisher of this stream (only streams you view). Ignored if `UUID` is set. |
| `type` | Leave it out to reach each connected peer once. `"pcs"` sends only to peers receiving your stream. `"rpcs"` sends only to publishers you receive. |

Leaving out `type` is usually right. A `&scene` or `&nopush` listener only has connections to publishers, so `type: "pcs"` from it reaches nobody.

If no peer is connected yet, nothing is sent.

### Examples

```javascript
// Everyone
iframe.contentWindow.postMessage({ sendData: { myApp: { message: "Hello everyone!" } } }, "*");

// One peer, by UUID
iframe.contentWindow.postMessage({ sendData: { myApp: { message: "Hi" } }, UUID: "peer-uuid-123" }, "*");

// The publisher of a stream you view
iframe.contentWindow.postMessage({ sendData: { myApp: { message: "Hi" } }, streamID: "stream-123" }, "*");

// Every peer with a given label
Object.keys(connectedPeers).forEach(function (UUID) {
    if (connectedPeers[UUID].label === "viewer") {
        iframe.contentWindow.postMessage({ sendData: { myApp: { message: "Hello viewers!" } }, UUID: UUID }, "*");
    }
});
```

## Payload tips

- Put your data under your own namespace, such as `{ myApp: {...} }`, so it does not clash with other apps.
- Add a `type` field inside your payload to tell message kinds apart, and a `timestamp` if order matters.
- Keep payloads small. Use VDO.Ninja's file sharing for large files.
- A UUID identifies one connection. It changes if the peer reloads, so update your list from connection events.

## Complete example: simple chat

```javascript
const iframe = document.createElement("iframe");
iframe.src = "https://vdo.ninja/?room=chat-demo&datamode";
document.body.appendChild(iframe);

const chatMessages = document.createElement("div");
const messageInput = document.createElement("input");
const sendButton = document.createElement("button");
sendButton.textContent = "Send";
document.body.append(chatMessages, messageInput, sendButton);

const connectedPeers = {}; // UUID -> label and active push/view directions

sendButton.addEventListener("click", sendChatMessage);
messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendChatMessage();
});

function sendChatMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    addMessageToChat("Me", text);
    iframe.contentWindow.postMessage({
        sendData: { chatApp: { type: "chat", text: text, timestamp: Date.now() } }
    }, "*");
    messageInput.value = "";
}

function addMessageToChat(sender, text) {
    const line = document.createElement("div");
    line.textContent = sender + ": " + text; // textContent avoids HTML injection
    chatMessages.appendChild(line);
}

window.addEventListener("message", function (e) {
    if (e.source != iframe.contentWindow || !e.data || typeof e.data !== "object") return;
    const data = e.data;

    if (data.action && data.UUID) {
        const isConnection = data.action === "push-connection" || data.action === "view-connection";
        var peer = connectedPeers[data.UUID];
        var direction = data.action === "view-connection" ? "view" : "push";
        if (isConnection && data.value === true) {
            if (!peer) {
                peer = { label: data.streamID || "Guest", view: false, push: false };
                connectedPeers[data.UUID] = peer;
                addMessageToChat("System", peer.label + " joined");
            }
            peer[direction] = true;
        } else if (isConnection && data.value === false && peer) {
            peer[direction] = false;
            if (!peer.view && !peer.push) {
                delete connectedPeers[data.UUID];
                addMessageToChat("System", peer.label + " left");
            }
        } else if (data.action.endsWith("-connection-info") && peer && data.value && data.value.label) {
            peer.label = data.value.label;
        }
    }

    if (data.dataReceived && data.dataReceived.chatApp && data.dataReceived.chatApp.type === "chat") {
        var sender = connectedPeers[data.UUID];
        addMessageToChat(sender ? sender.label : "Unknown", data.dataReceived.chatApp.text);
    }
});
```

## Troubleshooting

- **No data received:** check that the peers are connected and that the `UUID` or `streamID` is current.
- **Messages sent too early are lost:** wait for a connection event before sending.
- **Nothing arrives at a listener:** do not use `type: "pcs"` from a `&scene` or `&nopush` page.
- **Data fails to send:** make sure it is JSON-serializable.
