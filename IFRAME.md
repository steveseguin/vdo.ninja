***
This documentation has formally moved to: https://docs.vdo.ninja/guides/iframe-api-documentation
***
The documentation below is now considered depreciated and out-of-date.





## VDO.Ninja - iFrame API documentation (depreciated; see above)

VDO.Ninja (VDON) is offers here a simple and free solution to quickly enable real-time video streaming in their websites. VDON wishes to make live video streaming development accessible to any developer, even novices, yet still remain flexible and powerful.

While VDO.Ninja does offer source-code to customize the application and UI at a low level, this isn't for beginners and it is rather hard to maintain. As well, due to the complexity of video streaming in the web, typical approaches for offering API access isn't quite feasible either.

The solution decided on isn't an SDK framework, but rather the use of embeddable _IFrames_ and a corresponding bi-directional iframe API. An [iframe](https://www.w3schools.com/tags/tag_iframe.ASP) allows us to embed a webpage inside a webpage, including VDO.Ninja into your own website.

Modern web browsers allow the parent website to communicate with the child webpage, giving a high-level of control to a developer, while also abstracting the complex code and hosting requirements. Functionality, we can make an VDON video stream act much like an HTML video element tag, where you can issue commands like play, pause, or change video sources with ease.

Creating an VDON iframe can be done in HTML or programmatically with Javascript like so:

```
const iframe = document.createElement("iframe");
iframe.allow = "autoplay;camera;microphone";
iframe.allowtransparency = "false";
iframe.src = "https://vdo.ninja/?webcam";
```

You can also make an VDO.Ninja without Javascript, using just HTML, like

`<iframe allow="autoplay;camera;microphone" src="https://vdo.ninja/?view=vhX5PYg&cleanoutput&transparent"></iframe>`

Adding that iframe to the DOM will reveal a simple page accessing for a user to select and share their webcam. For a developer wishing to access a remote guest's stream, this makes the ingestion of that stream into production software like OBS Studios very easy. The level of customization and control opens up opportunities, such as a pay-to-join audience option for a streaming interactive broadcast experience.

An example of how this API is used by VDO.Ninja is with its Internet Speedtest, which has two VDO.Ninja IFrames on a single page. One iframe feeds video to the other iframe, and the speed at which it does this is a measure of the system's performance. Detailed stats of the connection are made available to the parent window, which displays the results.
https://vdo.ninja/speedtest

More community-contributed IFRAME examples can be found here: https://github.com/steveseguin/vdoninja/tree/master/examples

A sandbox of options is available at this page, too: https://vdo.ninja/iframe You can enter an VDO.Ninja URL in the input box to start using it. For developers, viewing the source of that page will reveal examples of how all the available functions work, along with a way to test and play with each of them. You can also see here for the source-code on GitHub: https://github.com/steveseguin/vdoninja/blob/master/iframe.html

One thing to note about this iframe API is that it is a mix of URL parameters given to the iframe _src_ URL, but also the postMessage and addEventListener methods of the browser. The later is used to dynamically control VDO.Ninja, while the former is used to initiate the instance to a desired state.

For more information on the URL parameters thare are available, please see: https://github.com/steveseguin/vdoninja/wiki/Advanced-Settings

Some of the more interesting ones primarily for iframe users might include:

- &webcam
- &screenshare
- &videodevice=1 or 0
- &audiodevice=1 or 0
- &autostart
- &chroma
- &transparency
- As for API, allow for dynamic messaging, below are examples of the options available:

- Mute Speaker
- Mute Mic
- Disconnect
- Change Video Bitrate
- Reload the page
- Change the volume
- Request detailed connection stats
- Access the loudness level of the audio
- Send/Recieve a chat message to other connected guests
- Get notified when there is a video connection

As for the actually details for methods and options available to dynamically control child VDON iframe, they are primarily kept up to via the iframe.html file that is mentioned previously. see: _iframe.html_. Below is a snippet from that file:

```js
let button = document.createElement("button");
button.innerHTML = "Mute Speaker";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "mute": true
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Un-Mute Speaker";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "mute": false
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Toggle Speaker";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "mute": "toggle"
    }, '*');
}
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Mute Mic";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "mic": false
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Un-Mute Mic";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "mic": true
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Toggle Mic";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "mic": "toggle"
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Disconnect";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "close": true
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Low Bitrate";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "bitrate": 30
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "High Bitrate";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "bitrate": 5000
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Default Bitrate";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "bitrate": -1
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Reload";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "reload": true
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "50% Volume";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "volume": 0.5
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "100% Volume";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "volume": 1.0
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Request Stats";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "getStats": true
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Request Loudness Levels";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "getLoudness": true
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Stop Sending Loudness Levels";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "getLoudness": false
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "Say Hello";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "sendChat": "Hello!"
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "previewWebcam()";
button.onclick = () => {
    iframe.contentWindow.postMessage({
        "function": "previewWebcam"
    }, '*');
};
iframeContainer.appendChild(button);

button = document.createElement("button");
button.innerHTML = "CLOSE IFRAME";
button.onclick = () => {
    iframeContainer.parentNode.removeChild(iframeContainer);
};
iframeContainer.appendChild(button);

// As for listening events, where the parent listens for responses or events from the VDON child frame:

// //////////  LISTEN FOR EVENTS

const eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
const eventer = window[eventMethod];
const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

eventer(messageEvent, function (e) {
    if (e.source !== iframe.contentWindow) {
        return
    } // reject messages send from other iframes

    if ("stats" in e.data) {
        const outputWindow = document.createElement("div");

        let out = `<br />total_inbound_connections:${
            e.data.stats.total_inbound_connections
        }`;
        out += `<br />total_outbound_connections:${
            e.data.stats.total_outbound_connections
        }`;

        for (const streamID in e.data.stats.inbound_stats) {
            out += `<br /><br /><b>streamID:</b> ${streamID}<br />`;
            out += printValues(e.data.stats.inbound_stats[streamID]);
        }

        outputWindow.innerHTML = out;
        iframeContainer.appendChild(outputWindow);
    }

    if ("gotChat" in e.data) {
        const outputWindow = document.createElement("div");
        outputWindow.innerHTML = e.data.gotChat.msg;
        outputWindow.style.border = "1px dotted black";
        iframeContainer.appendChild(outputWindow);
    }

    if ("action" in e.data) {
        const outputWindow = document.createElement("div");
        outputWindow.innerHTML = `child-page-action: ${
            e.data.action
        }<br />`;
        outputWindow.style.border = "1px dotted black";
        iframeContainer.appendChild(outputWindow);
    }

    if ("loudness" in e.data) {
        console.log(e.data);
        if (document.getElementById("loudness")) {
            outputWindow = document.getElementById("loudness");
        } else {
            const outputWindow = document.createElement("div");
            outputWindow.style.border = "1px dotted black";
            iframeContainer.appendChild(outputWindow);
            outputWindow.id = "loudness";
        }
        outputWindow.innerHTML = "child-page-action: loudness<br />";
        for (const key in e.data.loudness) {
            outputWindow.innerHTML += `${key} Loudness: ${
                e.data.loudness[key]
            }\n`;
        }
        outputWindow.style.border = "1px black";

    }
});
```

This VDO.Ninja API is developed and expanded based on user feedback and requests. It is by no means complete.

Please feel free to follow me in the VDO.Ninja Discord channel (discord.vdo.ninja) where I post news about updates and listen to requests. The upcoming version of VDO.Ninja is also often hosted at https://vdo.ninja/beta, where you can explore new features and help crush any unexpected bugs.

-steve
