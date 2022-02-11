---
description: How to embed VDO.Ninja into your own website with the IFRAME API
---

# Embed into a site with iFrames

[VDO.Ninja](https://vdo.ninja) offers here a simple and free solution to quickly enable real-time video streaming in their websites. VDON wishes to make live video streaming development accessible to any developer, even novices, yet still remain flexible and powerful.

While VDO.Ninja does offer source-code to customize the application and UI at a low level, this isn't for beginners and it is rather hard to maintain. As well, due to the complexity of video streaming in the web, typical approaches for offering API access isn't quite feasible either.

The solution decided on isn't an SDK framework, but rather the use of embeddable _IFrames_ and a corresponding bi-directional iframe API. An [iframe](https://www.w3schools.com/tags/tag\_iframe.ASP) allows us to embed a webpage inside a webpage, including VDO.Ninja into your own website.

Modern web browsers allow the parent website to communicate with the child webpage, giving a high-level of control to a developer, while also abstracting the complex code and hosting requirements. Functionality, we can make an VDON video stream act much like an HTML video element tag, where you can issue commands like play, pause, or change video sources with ease.

Creating an VDON iframe can be done in HTML or programmatically with Javascript like so:

```
const iframe = document.createElement("iframe");
iframe.allow = "autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;";
iframe.src = "https://vdo.ninja/?push=vhX5PYg&cleanoutput&transparent";
```

You can also make an VDO.Ninja without Javascript, using just HTML, like

`<iframe allow="autoplay;camera;microphone;fullscreen;picture-in-picture;display-capture;" src="https://vdo.ninja/?push=vhX5PYg&cleanoutput&transparent"></iframe>`

Adding that iframe to the DOM will reveal a simple page for accessing for a user to select and share their webcam. For a developer wishing to access a remote guest's stream, this makes the ingestion of that stream into production software like OBS Studios very easy. The level of customization and control opens up opportunities, such as a pay-to-join audience option for a streaming interactive broadcast experience.

An example of how this API is used by VDO.Ninja is with its Internet Speedtest, which has two VDO.Ninja IFrames on a single page. One iframe feeds video to the other iframe, and the speed at which it does this is a measure of the system's performance. Detailed stats of the connection are made available to the parent window, which displays the results. [https://vdo.ninja/speedtest](https://vdo.ninja/speedtest)

More community-contributed IFRAME examples can be found here:\
[https://github.com/steveseguin/vdoninja/tree/master/examples](https://github.com/steveseguin/vdoninja/tree/master/examples)

A sandbox of options is available at this page, too: [https://vdo.ninja/iframe](https://vdo.ninja/iframe) You can enter an VDO.Ninja URL in the input box to start using it. For developers, viewing the source of that page will reveal examples of how all the available functions work, along with a way to test and play with each of them. You can also see here for the source-code on GitHub:\
[https://github.com/steveseguin/vdoninja/blob/master/iframe.html](https://github.com/steveseguin/vdoninja/blob/master/iframe.html)

I also have an example of how you can transfer virtually any data (JSON, text, small images) via the IFRAME API with just a few lines of code here:\
[https://gist.github.com/steveseguin/15bba03d1993c88d0bd849f7749ea625](https://gist.github.com/steveseguin/15bba03d1993c88d0bd849f7749ea625) It's a pretty awesome example of how you can securely communicate peer to peer online with virtually zero effort and with no cost.

Please note that since VDO.Ninja requires SSL to be strictly enabled site wide, any website you embed a VDO.Ninja iframe into also will require SSL enabled site wide. Using a service like Cloudflare can provide SSL-enabled caching for websites to make this fairly easy to do.

Something else to note about this iframe API is that it can not only be controlled via URL parameters given to the iframe _src_ URL, but also using postMessage and addEventListener methods of the browser. The later is used to dynamically control VDO.Ninja, while the former is used to initiate the instance to a desired state.

Some of the more interesting ones primarily for iframe users might include:

* ``[`&webcam`](../source-settings/and-webcam.md)``
* ``[`&screenshare`](../source-settings/screenshare.md)``
* ``[`&videodevice`](../source-settings/videodevice.md)`=`1 or 0
* ``[`&audiodevice`](../source-settings/audiodevice.md)`=`1 or 0
* ``[`&autostart`](../source-settings/and-autostart.md)``
* ``[`&chroma`](../advanced-settings/design-parameters/chroma.md)``
* ``[`&transparent`](../advanced-settings/design-parameters/and-transparent.md)``
* As for API, allow for dynamic messaging, below are examples of the options available:
* Mute Speaker
* Mute Mic
* Disconnect
* Change Video Bitrate
* Reload the page
* Change the volume
* Request detailed connection stats
* Access the loudness level of the audio
* Send/Recieve a chat message to other connected guests
* Get notified when there is a video connection

As for the actually details for methods and options available to dynamically control child VDON iframe, they are primarily kept up to via the iframe.html file that is mentioned previously. see: _iframe.html_. Below is a snippet from that file:

```javascript
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

This VDO.Ninja API is developed and expanded based on user feedback and requests. It is by no means complete, but it is getting better every week.

### Advanced IFrame functionality

There's some users who wish to have an SDK instead of an IFRAME API. While an SDK may happen eventually, currently the IFRAME API is surprisingly capable.

If you wish to use your own video mixer logic for example, you can disable the existing auto-mixer logic that currently exists using the [`&manual`](../advanced-settings/view-parameters/manual.md) flag. You can then access the `srcObject` of each of the video elements in VDO.Ninja and pull those streams into the parent frame to manipulate or to connect to the parent DOM.&#x20;

If you aren't self-hosting the code, you may run into cross origin permission issues. This concept works with different subdomains though, and if you ask, the option to directly reference the VDO.Ninja servers with your own DNS servers is available. Self-hosting the code in a sub-domain of your own works too.

[https://javascript.info/cross-window-communication#windows-on-subdomains-document-domain](https://javascript.info/cross-window-communication#windows-on-subdomains-document-domain)

See the video below for an advanced demo of the IFRAME API and how videos hosted within VDO.Ninja can be accessed and manipulated by the parent window. Video works well in this fashion; pulling audio from the IFRAME is a bit trickier however.

{% embed url="https://www.youtube.com/watch?v=SqbufszHKi4&feature=youtu.be" %}

### All to happy to support the IFRAME API

Please feel free to follow me in the VDO.Ninja Discord channel ([discord.vdo.ninja](https://discord.com/invite/T4xpQVv)) where I post news about updates and listen to requests. The upcoming version of VDO.Ninja is also often hosted at [https://vdo.ninja/beta](https://vdo.ninja/beta), where you can explore new features and help crush any unexpected bugs.\
\
I am keen to continue to support the IFRAME API, so please reach out if you have questions or requests.

\-steve
