---
description: Show/hide buttons, adjust the user control bar and video control bar
---

# Buttons and Control Bar Parameters

## User Control Bar Options

<div align="left">

<figure><img src="../../.gitbook/assets/image (1) (2) (6).png" alt=""><figcaption><p>The user control bar</p></figcaption></figure>

</div>

<table><thead><tr><th width="254.57142857142856">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="../../parameters-only-on-beta/and-autohide.md"><code>&#x26;autohide</code></a></td><td>Auto-hides the control bar after a few moments of the mouse being idle</td></tr><tr><td><a href="../settings-parameters/and-controlbarspace.md"><code>&#x26;controlbarspace</code></a></td><td>Forces the user control bar to be in its own dedicated space</td></tr><tr><td><a href="../../source-settings/and-nosettings.md"><code>&#x26;nosettings</code></a></td><td>Disables the local settings button</td></tr><tr><td><a href="../../viewers-settings/nomicbutton.md"><code>&#x26;nomicbutton</code></a></td><td>Disables the mic button; guests can't mute audio</td></tr><tr><td><a href="../../source-settings/and-nospeakerbutton.md"><code>&#x26;nospeakerbutton</code></a></td><td>Hides the speaker button</td></tr><tr><td><a href="../../viewers-settings/and-novideobutton.md"><code>&#x26;novideobutton</code></a></td><td>Disables the video button; guests can't mute video</td></tr><tr><td><a href="../../source-settings/nofileshare.md"><code>&#x26;nofileshare</code></a></td><td>Hides the ability for a guest to upload a file</td></tr><tr><td><a href="../settings-parameters/and-screensharebutton.md"><code>&#x26;screensharebutton</code></a></td><td>Forces the screen-share button to appear for guests</td></tr><tr><td><a href="../settings-parameters/and-nohangupbutton.md"><code>&#x26;nohangupbutton</code></a></td><td>Hides the hang-up button</td></tr><tr><td><a href="../../general-settings/chatbutton.md"><code>&#x26;chatbutton</code></a></td><td>Shows or hides the chat button</td></tr><tr><td><a href="../../newly-added-parameters/and-bigbutton.md"><code>&#x26;bigbutton</code></a></td><td>Makes the microphone mute button a lot bigger</td></tr><tr><td><a href="../settings-parameters/and-fullscreenbutton.md"><code>&#x26;fullscreenbutton</code></a></td><td>Adds a full-screen button to the control bar</td></tr><tr><td><a href="../../source-settings/nowebsite.md"><code>&#x26;nowebsite</code></a></td><td>Disables IFrames from loading, such as remotely shared websites by another guest or director</td></tr><tr><td><a href="../../source-settings/and-hands.md"><code>&#x26;hands</code></a></td><td>Enables a "Raise Hand" button for guests</td></tr></tbody></table>

#### Positioning the control bar

While you can position the control bar by dragging it around, you can also set it's initial position with the use of a custom CSS parameter. For example,

`&cssb64=I3N1YkNvbnRyb2xCdXR0b25ze3RyYW5zZm9ybTp0cmFuc2xhdGUoMHB4LCBjYWxjKC0xMDB2aCArIDkwcHgpKSFpbXBvcnRhbnR9Ow`

The above is a base64 encoded version of the following CSS, which positions the control bar at the top by default. Base64 encoding allows us to use stylings safely as a URL parameter.

`#subControlButtons{transform:translate(0px, calc(-100vh + 90px))!important};`

## Video Control Bar Options

<div align="left">

<figure><img src="../../.gitbook/assets/image (9) (1) (3) (1).png" alt=""><figcaption><p>The video control bar</p></figcaption></figure>

</div>

<table><thead><tr><th width="267">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="../newly-added-parameters/and-videocontrols.md"><code>&#x26;videocontrols</code></a></td><td>Shows the video control bar</td></tr><tr><td><a href="../settings-parameters/and-nocontrols.md"><code>&#x26;nocontrols</code></a></td><td>Will force hide the video control bar</td></tr></tbody></table>
