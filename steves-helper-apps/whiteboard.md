---
description: Browser-based VDO.Ninja whiteboard for live collaborative drawing with real-time streaming via P2P or WHIP.
---

# Whiteboard

## VDO.Ninja Whiteboard: Live Streaming Collaboration Tool

### Overview

VDO.Ninja Whiteboard is a powerful, browser-based drawing tool that integrates with VDO.Ninja's peer-to-peer streaming technology. It allows you to create and share live drawings, diagrams, or annotations with viewers in real-time without requiring any downloads, installations, or accounts.

### **You can access it here:**[ **https://vdo.ninja/whiteboard**](https://vdo.ninja/whiteboard)

<figure><img src="../.gitbook/assets/image (262).png" alt=""><figcaption><p>Example Masterpiece</p></figcaption></figure>

### Key Features

* **Live Whiteboard Streaming**: Share your drawings in real-time with anyone through a simple view link
* **Multiple Publishing Options**: Stream via VDO.Ninja P2P, WHIP, or directly to Twitch
* **End-to-End Encryption**: When using the VDO.Ninja mode, all streams are encrypted peer-to-peer
* **Drawing Tools**: Includes brush, text tool, eraser, fill tool, and color picker
* **No-Install Browser Based**: Works entirely in your browser with no plugins required
*   **Free and Open Source**: Use it without cost or limitations\


    <figure><img src="../.gitbook/assets/image (260).png" alt=""><figcaption><p>Menu setup</p></figcaption></figure>

### How It Works with VDO.Ninja

The whiteboard leverages VDO.Ninja's P2P data channels and media streaming capabilities to broadcast your canvas to viewers securely and efficiently.

#### Technical Integration

1. **Embedding VDO.Ninja**: The whiteboard creates a hidden iframe that loads VDO.Ninja with specific parameters:

```javascript
function createAndAppendIframe(config) {
    let url = new URL("./index.html", window.location.href);
    
    if (config.mode === 'vdo') {
        if (config.room) url.searchParams.set("room", config.room);
        if (config.push) url.searchParams.set("push", config.push);
        if (config.password) url.searchParams.set("password", config.password);
    }
    
    url.searchParams.set("framegrab", "");
    url.searchParams.set("view", "");

    const iframe = document.createElement("iframe");
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.src = url.toString();
    
    document.body.appendChild(iframe);
    return iframe;
}
```

2. **Canvas Streaming**: The whiteboard captures the canvas content and sends it to the VDO.Ninja iframe:

```javascript
async function startStreaming() {
    const iframe = document.querySelector('iframe');
    if (!iframe) return;

    // Using modern MediaStreamTrackProcessor API when available
    if (typeof MediaStreamTrackProcessor === 'function') {
        const { tracks } = await createCanvasStream();
        
        // Send frames to the VDO.Ninja iframe
        const processor = new MediaStreamTrackProcessor(track);
        const reader = processor.readable.getReader();
        
        // Read and send each frame
        // ...
    } else {
        // Fallback to sending canvas as data URL
        frameGenerator = setInterval(() => {
            const imageData = canvas.toDataURL('image/webp');
            iframe.contentWindow.postMessage({
                type: 'canvas-frame',
                frame: imageData
            }, '*');
        }, 1000/10); // 10 fps
    }
}
```

3. **View Link Generation**: When using VDO.Ninja mode, it generates a view link that can be shared with viewers:

```javascript
const viewUrl = new URL("./", window.location.href);
if (push) viewUrl.searchParams.set("view", push);
if (room) viewUrl.searchParams.set("room", room);
if (password) viewUrl.searchParams.set("password", password);
document.getElementById('viewLink').value = viewUrl.toString();
```

### How to Use the Whiteboard

1. **Access the Tool**: Open the whiteboard in any modern browser
2. **Choose Publishing Mode**:
   * VDO.Ninja (P2P): For secure, peer-to-peer streaming
   * WHIP: For streaming to any WHIP-compatible service
   * Twitch: For direct streaming to Twitch
   * Playground: For local drawing with no streaming
3. **Configure Your Stream**:
   * For VDO.Ninja mode, enter an optional Stream ID and/or Room Name
   * Set a password if desired for privacy
4. **Start Drawing**: Use the brush, text, eraser, and fill tools to create your content
5. **Share the View Link**: Copy and share the generated view link with anyone you want to see your whiteboard

### Benefits of Using VDO.Ninja Integration

* **Low Latency**: Direct peer-to-peer connections provide near real-time sharing
* **Privacy**: End-to-end encryption ensures your whiteboard sessions remain private
* **Firewall Friendly**: Works through NATs and firewalls without port forwarding
* **Scalability**: Multiple viewers can connect simultaneously
* **Cost Effective**: No server costs as data transfers directly between peers
* **Cross-Platform**: Works on any device with a modern browser

### Use Cases

* Remote teaching and tutoring
* Live diagramming during video conferences
* Virtual brainstorming sessions
* Real-time collaboration on design concepts
* Creating explanatory drawings for live streams
* Adding visual annotations to presentations

The VDO.Ninja Whiteboard combines the power of HTML5 Canvas with VDO.Ninja's peer-to-peer streaming technology to provide a versatile, secure, and accessible tool for real-time visual communication.

## Annotating a caller's live video

The Whiteboard publishes its own canvas as a video source. To draw or ping directly over a caller's camera or screen share, use VDO.Ninja's separate built-in annotation tool. It can send the caller and annotations together to OBS or provide the drawings as a transparent OBS overlay.

{% content-ref url="../guides/telestrate-a-callers-video.md" %}
[telestrate-a-callers-video.md](../guides/telestrate-a-callers-video.md)
{% endcontent-ref %}
