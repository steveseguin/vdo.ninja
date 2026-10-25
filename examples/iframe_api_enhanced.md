## Enhanced IFRAME API Documentation - HTTP/WSS API Integration

### Overview

Every [HTTP/WSS API](httpwssapi.md) command also works over the iframe's `postMessage` interface, sent with an `action` property:

```javascript
iframe.contentWindow.postMessage({
    action: "commandName",
    value: "value",       // optional
    value2: "optional",   // optional second value
    target: "optional",   // a guest's slot number or stream ID, for director commands
    cib: "callback-id"    // optional; copied into the reply
}, "*");
```

A `value` of `"true"` or `"false"` is converted to a boolean. The other iframe commands are listed in [iframeapi.md](iframeapi.md).

### Director permissions

Commands with a `target` control a guest and need director rights:

- Load the iframe with `&director=roomname` instead of `&room=roomname`.
- To share control between several directors, every director adds the same `&codirector=password` to their `&director=roomname` link.

Without director rights, most guest commands reply `false`, and guests reject the rest. The iframe API does not need `&api`.

### Commands for the local page (no `target`)

```javascript
iframe.contentWindow.postMessage({ action: "mic", value: "toggle" }, "*");
iframe.contentWindow.postMessage({ action: "volume", value: 85 }, "*");      // 0-100 percent
iframe.contentWindow.postMessage({ action: "bitrate", value: 2500 }, "*");   // kbps for streams you view
iframe.contentWindow.postMessage({ action: "layout", value: 2 }, "*");       // director: layout 2 from &layouts; 0 = automixer
iframe.contentWindow.postMessage({ action: "joinGroup", value: "1" }, "*");
iframe.contentWindow.postMessage({ action: "getDetails", cib: "details-123" }, "*");
iframe.contentWindow.postMessage({ action: "zoom", value: 0.1 }, "*");                 // relative
iframe.contentWindow.postMessage({ action: "zoom", value: 1.5, value2: "abs" }, "*");  // absolute
iframe.contentWindow.postMessage({ action: "sendChat", value: "Hello everyone!" }, "*");
```

`speaker` (`true` unmutes), `camera`, `record`, `leaveGroup`, `getGuestList`, `pan`, `tilt`, `focus`, `reload`, `hangup`, `togglehand`, `togglescreenshare` and `forceKeyframe` work the same way. `layout` also accepts a custom layout array; see [Layout and display](iframeapi.md#layout-and-display).

### Director commands for a guest

`target` is a slot number (`"1"`, `"2"`...) or a stream ID.

```javascript
iframe.contentWindow.postMessage({ action: "mic", target: "1", value: "toggle" }, "*");
iframe.contentWindow.postMessage({ action: "rotate", target: "1", value: true }, "*");   // +90 degrees
iframe.contentWindow.postMessage({ action: "rotate", target: "streamID123", value: 180 }, "*");
iframe.contentWindow.postMessage({ action: "rotate", target: "1", value: false }, "*");  // reset
iframe.contentWindow.postMessage({ action: "addScene", target: "2", value: 1 }, "*");    // toggle in scene 1
iframe.contentWindow.postMessage({ action: "forward", target: "1", value: "newroom" }, "*");
iframe.contentWindow.postMessage({ action: "sendChat", target: "1", value: "Private message" }, "*");
iframe.contentWindow.postMessage({ action: "sendDirectorChat", target: "2", value: "You're live in 10 seconds!" }, "*"); // shown on the guest's screen
iframe.contentWindow.postMessage({ action: "volume", target: "1", value: 120 }, "*");    // 0-200
iframe.contentWindow.postMessage({ action: "startRoomTimer", target: "1", value: 600 }, "*"); // seconds
iframe.contentWindow.postMessage({ action: "mixorder", target: "2", value: -1 }, "*");   // -1 moves down, 1 moves up
```

`camera`, `soloChat`, `soloChatBidirectional`, `hangup` and `zoom` take a `target` the same way. The [HTTP/WSS API](httpwssapi.md) page lists the other guest actions.

### `function` calls for directors

`targetGuest` runs a guest action with the same `target`, `action`, `value` and `value2`:

```javascript
iframe.contentWindow.postMessage({ function: "targetGuest", target: "1", action: "rotate", value: true }, "*");
```

`commands` runs a local command (not `rotate`, which needs a guest `target`):

```javascript
iframe.contentWindow.postMessage({ function: "commands", action: "zoom", value: 0.5, value2: "abs" }, "*");
```

These three reply with an object that has `ok` (and `error` when `ok` is `false`), plus `target`, `UUID` and `streamID`:

| `function` | Extra fields | Reply key |
|---|---|---|
| `getGuestMediaDevices` | `target` | `guestMediaDevices`, with `devices` and the guest's current camera, microphone and speaker labels |
| `setGuestMediaDevice` | `target`, `kind` (`"camera"`, `"microphone"` or `"speaker"`), `deviceId` | `guestMediaDeviceChange` |
| `activateQueuedGuest` | `target` | `queuedGuestActivation` |

```javascript
iframe.contentWindow.postMessage({ function: "setGuestMediaDevice", target: "1", kind: "camera", deviceId: "abc", cib: "dev-1" }, "*");
// reply: { guestMediaDeviceChange: { ok, error, target, UUID, streamID, kind, deviceId }, cib: "dev-1" }
```

### Reply format

When you include `cib`, every `action` command gets a reply:

- An object result arrives as that object with `cib` added. `getDetails` returns the state keyed by stream ID; `getGuestList` returns `{ "1": { streamID, label }, ..., cib }`.
- Any other result arrives as `{ action, result, cib }`, such as `{ action: "mic", result: true, cib }` (`true` means muted).
- An error arrives as `{ action, error: true, result: false, message, cib }`.

Without `cib`, the raw result is posted, which can be a plain value such as `true`. The HTTP/WSS API's `{ callback: {...} }` wrapper is not used here.

### Complete example: director control panel

```html
<div id="container"></div>
<select id="guest-select"><option value="1">Guest 1</option></select>
<button onclick="controlGuest('mic', 'toggle')">Toggle Mic</button>
<button onclick="controlGuest('camera', 'toggle')">Toggle Camera</button>
<button onclick="controlGuest('addScene', 1)">Add to Scene 1</button>
<button onclick="controlGuest('forward', 'lobby')">Send to Lobby</button>
<button onclick="iframe.contentWindow.postMessage({ getGuestList: true }, '*')">Refresh guests</button>

<script>
const iframe = document.createElement("iframe");
iframe.allow = "camera;microphone;fullscreen;display-capture;autoplay;";
iframe.src = "https://vdo.ninja/?director=myroom&cleanoutput";
document.getElementById("container").appendChild(iframe);

function controlGuest(action, value) {
    const target = document.getElementById("guest-select").value;
    iframe.contentWindow.postMessage({ action, target, value, cib: "cb-" + Date.now() }, "*");
}

window.addEventListener("message", function (e) {
    if (e.source !== iframe.contentWindow || !e.data || typeof e.data !== "object") return;
    if (e.data.guestList) { // { "1": { streamID, label }, ... }
        const select = document.getElementById("guest-select");
        select.innerHTML = "";
        Object.keys(e.data.guestList).forEach(function (slot) {
            const option = document.createElement("option");
            option.value = slot;
            option.textContent = e.data.guestList[slot].label || ("Guest " + slot);
            select.appendChild(option);
        });
    } else if (e.data.cib) {
        console.log("Reply:", e.data);
    }
});
</script>
```

### Troubleshooting

- **Commands reply `false` or do nothing:** check the iframe URL uses `&director=`, and that `target` matches a slot number or stream ID.
- **No reply:** send a `cib`, and wait for the iframe to load first.
