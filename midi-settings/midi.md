---
description: Global hotkey support via MIDI input and more
---

# \&midi

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&hotkeys`

## Details

You can use a MIDI controller, virtual or real, to issue commands to VDO.Ninja. This option is compatible with an Elegato Streamdeck, allowing for both control over things like mute, but also control over remote guests if a director.

A web-based dashboard for issuing MIDI commands from a virtual MIDI device can be found here: [https://vdo.ninja/midi](https://vdo.ninja/midi). It can also offer debugging information, listing MIDI event data in the browser's developer console, helping to identity what certain MIDI buttons do.

The MIDI capabilities of VDO.Ninja go beyond just controlling VDO.Ninja though. Options to seamlessly send and receive MIDI commands with remote computers at very low latency is also possible.

More information, details, guides, and tools can be found closer to the bottom of this page.

{% hint style="warning" %}
Currently a Chromium-browser, like Google Chrome, is recommended when using the MIDI features. Other browsers may not be compatible at this time.
{% endhint %}

{% hint style="info" %}
**Notice:** The VDO.Ninja's MIDI API is still constantly evolving, so check back for updates if you face problems or to discover new available features and options.
{% endhint %}

### Options for \&midi={value}

{% hint style="warning" %}
There are two MIDI standards; one where value 33 is note A0, and the more common standard where value 33 is note A1. VDO.Ninja uses the A1 standard. Decrease your octave by one if having problems, such as if using TouchOSC.
{% endhint %}

<table><thead><tr><th width="160">Value</th><th>Description</th></tr></thead><tbody><tr><td>&#x26;midi=N</td><td>Description of MIDI </td></tr><tr><td><code>1</code></td><td>Hotkeys using A3 to G4 notes </td></tr><tr><td><code>2</code></td><td>Hotkeys using A1 to G2 notes</td></tr><tr><td><code>3</code></td><td>Hotkeys using Note C1 + velocities</td></tr><tr><td><code>4</code></td><td><p>Hotkeys using control-change inputs.</p><p></p><p>Designed mainly for the director to control multiple guests, as well as themselves.</p></td></tr></tbody></table>

### **\&midi=1**

<table><thead><tr><th width="209">MIDI message</th><th>Function</th></tr></thead><tbody><tr><td>Note G3</td><td>Toggle Chat</td></tr><tr><td>Note A3</td><td>Toggle Mute</td></tr><tr><td>Note B3</td><td>Toggle Video Output</td></tr><tr><td>Note C4</td><td>Toggle Screen Share</td></tr><tr><td>Note D4</td><td>Hang up</td></tr><tr><td>Note E4</td><td>Raise Hand Toggle</td></tr><tr><td>Note F4</td><td>Record Local Video Toggle</td></tr><tr><td>Note G4</td><td>Enable the Director’s audio [director only]</td></tr><tr><td>Note A4</td><td>Stop the Director’s Audio [director only]</td></tr><tr><td>Note B4</td><td>Toggle the Local Speaker Output</td></tr></tbody></table>

### **\&midi=2**

| MIDI message | Function                                     |
| ------------ | -------------------------------------------- |
| Note G1      | Toggle Chat                                  |
| Note A1      | Toggle Mute                                  |
| Note B1      | Toggle Video Output                          |
| Note C2      | Toggle Screen Share                          |
| Note D2      | Hang up                                      |
| Note E2      | Raise Hand Toggle                            |
| Note F2      | Record Local Video Toggle                    |
| Note G2      | Enable the Director’s audio \[director only] |
| Note A2      | Stop the Director’s Audio \[director only]   |
| Note B2      | Toggle the Local Speaker Output              |

### **\&midi=3**

<table><thead><tr><th width="232">MIDI message</th><th>Function</th></tr></thead><tbody><tr><td>Note C1 + Velocity 0</td><td>Toggle Chat</td></tr><tr><td>Note C1 + Velocity 1</td><td>Toggle Mute</td></tr><tr><td>Note C1 + Velocity 2</td><td>Toggle Video Output</td></tr><tr><td>Note C1 + Velocity 3</td><td>Toggle Screen Share</td></tr><tr><td>Note C1 + Velocity 4</td><td>Hang up</td></tr><tr><td>Note C1 + Velocity 5</td><td>Raise Hand Toggle</td></tr><tr><td>Note C1 + Velocity 6</td><td>Record Local Video Toggle</td></tr><tr><td>Note C1 + Velocity 7</td><td>Enable the Director’s audio [director only]</td></tr><tr><td>Note C1 + Velocity 8</td><td>Stop the Director’s Audio [director only]</td></tr><tr><td>Note C1 + Velocity 9</td><td>Toggle the Local Speaker Output</td></tr></tbody></table>

### **\&midi=4**

<table><thead><tr><th width="209">MIDI message</th><th>Function</th></tr></thead><tbody><tr><td>Command = 110</td><td>with values accepted from 0 to 8 for local toggle options.</td></tr><tr><td>Command = 110+N</td><td>where N is the guest’s order in the control room.</td></tr></tbody></table>

In this case, for hotkeying remote guests as a director:

<table><thead><tr><th width="209">MIDI message</th><th>Function</th></tr></thead><tbody><tr><td>Value 0</td><td>Opens the Transfer Popup</td></tr><tr><td>Value 1</td><td>Add/remove from scene 1</td></tr><tr><td>Value 2</td><td>Mute guest in scene</td></tr><tr><td>Value 3</td><td>Mute guest everywhere</td></tr><tr><td>Value 4</td><td>Hang-up the guest</td></tr><tr><td>Value 5</td><td>Toggle Solo Chat with this guest</td></tr><tr><td>Value 6</td><td>Toggle the remote speaker</td></tr><tr><td>Value 7</td><td>Toggle the remote display</td></tr><tr><td>Value 8</td><td>Fixes Rainbow Puke of this guest in scenes</td></tr><tr><td>Value 12 to 18</td><td>Add/remove from scene 2 to 8</td></tr></tbody></table>

All the above hotkey mappings are purely experimental at this time and will change based on user feedback. These mappings should allow a user to use a StreamDeck with VDO.Ninja.

### Configuring MIDI device and channel

By default, any MIDI device on any MIDI channel can trigger the \&midi actions if their command and values match.&#x20;

Starting with version 20 of VDO.Ninja, you can filter inputs based on channel and device using `&mididevice` and `&midichannel`.

#### \&mididevice

This parameter can take any number from 1 and up.  It's based on the MIDI device's list index order. You can check the developer console of the browser with \&midi added to get a list of those midi devices and the list.  The first item in the list can be used using `&mididevice=1` and the second will be `&mididevice=2`, etc. &#x20;

If you don't specify a MIDI device, all devices will be used.  This \&mididevice filter does not apply to \&midiin or \&midiout.

#### \&midichannel

MIDI supports channel 1 to 16. Prior to VDO.Ninja v20, channel 1 was the only channel that worked, but in v20, any channel will be treated as a trigger by default.&#x20;

By using \&midichannel=1, you can again set VDO.Ninja to only trigger on inputs sent over channel 1. You can specify any single channel to trigger on though, from 1 to 16, if that level of control is needed.

This command is not compatible with \&midiout or \&midiin.&#x20;

## Elgato Streamdeck support

You can configure a Streamdeck to issue MIDI commands, via the use of a MIDI plugin for Streamdeck. This allows you to send hotkey commands from your Streamdeck to VDO.Ninja locally, on the same computer, or even remotely, via the MIDI remote control feature.

You'll need to find a MIDI plugin within the Streamdeck store, or add one from source. Normally you can just search for MIDI and have some options appear.

For macOS, one Streamdeck plugin available is [https://github.com/tsbkelly/Streamdeck-Midibutton](https://github.com/tsbkelly/Streamdeck-Midibutton)

For PC, there's this one [https://trevligaspel.se/streamdeck/midi/index.html](https://trevligaspel.se/streamdeck/midi/index.html)

![](<../.gitbook/assets/image (110) (1) (1) (1) (1).png>)

You will also need a Virtual MIDI loopback interface on your computer, if intending to send MIDI commands to VDO.Ninja.  There's free options available, such as:

{% embed url="https://www.nerds.de/en/loopbe1.html" %}

{% embed url="https://www.tobias-erichsen.de/software/loopmidi.html" %}

See below for a community-created video guide on setting up the Streamdeck with a mac and VDO.Ninja. Let me know if this documentation could use more details.

{% embed url="https://youtu.be/uidN3bLLiVk" %}

## Remote MIDI control

{% hint style="info" %}
This is available for version 19 and higher.
{% endhint %}

This lets you route all MIDI messages from one computer to another computer, with the purpose of remote trigger the VDO.Ninja hotkeys.

```
https://vdo.ninja/beta/?midiremote=4&director=ROOMNAMEHERE
https://vdo.ninja/beta/?room=ROOMNAMEHERE&midiout=1&vd=0&ad=0&push&autostart&label=MIDI_CONTROLLER
```

* \&midiremote={reference \&midi's values; 1 to 4}

{% embed url="https://www.youtube.com/watch?v=rnZ8HM9FL4I" %}
Remote controlling demo
{% endembed %}

{% content-ref url="../director-settings/midiremote.md" %}
[midiremote.md](../director-settings/midiremote.md)
{% endcontent-ref %}

## MIDI pass-through mode

{% hint style="info" %}
This is available for version 18 and higher.
{% endhint %}

This lets you route all MIDI messages from one computer to another computer, going from local MIDI device input to the remote MIDI device output. Example usage:

Starting with VDO.Ninja v20, this will feature will also mirror the channel input, matching the channel with the output. The only control a user has really in configuring it is which device is the input and which device is the output.

```
https://vdo.ninja/?view=Nwz2C7d&midiin=1
https://vdo.ninja/?midiout=0&push=Nwz2C7d
```

* \&midiin={midi output device index; defaults to all} (or \&midipull / \&mi) -- allows for receiving of remote midi. Device indeces starts at 1, where an index of 0 implies "all".
* \&midiout={midi input device index; defaults to all} (or \&midipush / \&mo) -- allows for sending of remote midi.  Device indices starts at 1, where an index of 0 implies "all".

{% content-ref url="midiout.md" %}
[midiout.md](midiout.md)
{% endcontent-ref %}

{% content-ref url="midiin.md" %}
[midiin.md](midiin.md)
{% endcontent-ref %}

It's important to not send and receive between two tabs locally if from the same midi device, as that will create a feedback loop; computer won't like it.

Check the console log or [https://vdo.ninja/midi](https://vdo.ninja/midi) to see which midi device is what device index.

![Example of how to find the midi device order ID](<../.gitbook/assets/image (18) (1).png>)

While the original MIDI timestamp is transmitted to the remote computer also, it currently isn't included with the output MIDI event itself. I'm just not sure what to use it for currently, but let me know if you need it.

Remote midi transfer does need a VDO.Ninja peer connection to send the MIDI data over. If you don't want to create a connection that includes video and/or audio, you can disable media inputs by using `&vd=0&ad=0`, which disables any audio or video input options.

You can also disable playback of video or audio tracks by using `&novideo&noaudio.`

You can have multiple inputs and outputs per connection.

## Video Guides

{% embed url="https://www.youtube.com/watch?v=uidN3bLLiVk" %}
https://www.youtube.com/watch?v=uidN3bLLiVk
{% endembed %}

{% embed url="https://www.youtube.com/watch?v=mdAzAZo65Mc" %}
https://www.youtube.com/watch?v=mdAzAZo65Mc
{% endembed %}

## Related

{% content-ref url="and-mididevice.md" %}
[and-mididevice.md](and-mididevice.md)
{% endcontent-ref %}

{% content-ref url="and-mididevice.md" %}
[and-mididevice.md](and-mididevice.md)
{% endcontent-ref %}

{% content-ref url="and-midichannel.md" %}
[and-midichannel.md](and-midichannel.md)
{% endcontent-ref %}
