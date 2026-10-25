***
This documentation has formally moved to: https://docs.vdo.ninja/guides/iframe-api-documentation
***
The documentation below is deprecated and may be out of date.

## VDO.Ninja - iFrame API documentation (deprecated; see above)

You can embed VDO.Ninja in your own website with an `<iframe>`, then control it from your page with the browser's `postMessage` API. URL parameters on the iframe `src` set the starting state; `postMessage` commands change it while it runs, and the iframe posts events back to your page.

### Embed VDO.Ninja

In HTML:

```html
<iframe allow="autoplay;camera;microphone;fullscreen;display-capture" src="https://vdo.ninja/?view=vhX5PYg&cleanoutput&transparent"></iframe>
```

Or with JavaScript:

```js
const iframe = document.createElement("iframe");
iframe.allow = "autoplay;camera;microphone;fullscreen;display-capture";
iframe.src = "https://vdo.ninja/?webcam";
document.body.appendChild(iframe);
```

URL parameters that are often useful in an iframe: `&webcam`, `&screenshare`, `&videodevice=0` or `1`, `&audiodevice=0` or `1`, `&autostart`, `&cleanoutput`, `&chroma` and `&transparent`. See the [URL parameter reference](https://docs.vdo.ninja/advanced-settings) for the full list.

### Send commands

```js
iframe.contentWindow.postMessage({ mute: true }, "*");       // mute incoming audio
iframe.contentWindow.postMessage({ mic: "toggle" }, "*");    // toggle your microphone
iframe.contentWindow.postMessage({ bitrate: 5000 }, "*");    // request 5000 kbps video
iframe.contentWindow.postMessage({ bitrate: -1 }, "*");      // back to the default bitrate
iframe.contentWindow.postMessage({ volume: 0.5 }, "*");      // 50% playback volume
iframe.contentWindow.postMessage({ getStats: true }, "*");   // request stats
iframe.contentWindow.postMessage({ getLoudness: true }, "*"); // start loudness updates
iframe.contentWindow.postMessage({ sendChat: "Hello!" }, "*");
iframe.contentWindow.postMessage({ close: true }, "*");      // hang up
iframe.contentWindow.postMessage({ reload: true }, "*");
iframe.contentWindow.postMessage({ function: "previewWebcam" }, "*");
```

`mute` and `mic` also accept `false` and `"toggle"`. The full command list is in [examples/iframeapi.md](examples/iframeapi.md).

### Listen for events

```js
window.addEventListener("message", function (e) {
    if (e.source !== iframe.contentWindow) return; // ignore other frames
    if (!e.data || typeof e.data !== "object") return;

    if ("stats" in e.data) {
        console.log("inbound stats by stream ID:", e.data.stats.inbound);
    }
    if ("chat" in e.data) {
        console.log("chat:", e.data.chat.msg);
    }
    if ("loudness" in e.data) {
        console.log("loudness by stream ID:", e.data.loudness);
    }
    if ("action" in e.data) {
        console.log("event:", e.data.action, e.data.value, e.data.streamID);
    }
});
```

Incoming chat messages also carry a deprecated `gotChat` copy; use `chat`.

### Examples and sandbox

- Sandbox for trying every command: https://vdo.ninja/iframe (source: [iframe.html](iframe.html))
- The speed test runs a publishing iframe and a viewing iframe on one page and reads the stats over this API: https://vdo.ninja/speedtest (source: [speedtest.html](speedtest.html))
- Community examples: [examples/](examples/)
- Join and disconnect events: [examples/iframeapi.md](examples/iframeapi.md)
- Sending your own data between peers: [examples/dataiframes.md](examples/dataiframes.md)
- Director controls through the iframe: [examples/iframe_api_enhanced.md](examples/iframe_api_enhanced.md)

The API grows based on user requests. Post requests in the VDO.Ninja Discord (discord.vdo.ninja). Upcoming versions are often hosted at https://vdo.ninja/beta.

-steve
