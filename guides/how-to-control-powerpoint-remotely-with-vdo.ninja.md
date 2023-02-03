# How to control PowerPoint remotely with VDO.Ninja

### Overview

Support for remote PowerPoint slide control. (previous/next slide):

* Documented things quite a bit here: [https://github.com/steveseguin/powerpoint\_remote](https://github.com/steveseguin/powerpoint\_remote)
* I've only tested with Windows + PowerPoint so far, but it can be tweaked to work with more than PPT without much trouble
* Uses AutoHotKey + VDO.Ninja + MIDI to achieve the result; quite a few different ways implement it, with samples provided
* Built-in basic controller added, via [`&powerpoint`](../advanced-settings/settings-parameters/and-powerpoint-alpha.md) (aliases: `&slides`, `&ppt`, `&pptcontrols`)
* IFrame sample app provided with larger buttons and sample code to add more custom buttons/actions if needed. (start/stop/etc): [https://vdo.ninja/examples/powerpoint](https://vdo.ninja/examples/powerpoint)
* HTTP / WSS remote control also added; `https://api.vdo.ninja/YOURAPIKEY/nextSlide` and `prevSlide`
* Local Streamdeck support also working, via MIDI

### YouTube Tutorial

{% embed url="https://youtu.be/ORH8betTt8Y" %}
Remote control PowerPoint with VDO.Ninja
{% endembed %}

### Images

<figure><img src="../.gitbook/assets/image (5) (1).png" alt=""><figcaption><p><code></code><a href="../advanced-settings/settings-parameters/and-powerpoint-alpha.md"><code>&#x26;powerpoint</code></a> as a URL parameter</p></figcaption></figure>

<figure><img src="../.gitbook/assets/image (19).png" alt=""><figcaption><p>Remote PowerPoint Web control via VDO.Ninja (IFrame API)</p></figcaption></figure>
