---
description: Global hotkey support via MIDI input and more!
---

# \&midi

## Details

You can use a MIDI controller, virtual or real, to issue commands to VDO.Ninja. This option is compatible with an Elegato Streamdeck, allowing for both control over things like mute, but also control over remote guests if a director.

A web-based dashboard for issuing MIDI commands from a virtual MIDI device can be found here: [https://vdo.ninja/midi](https://vdo.ninja/midi). It can also offer debugging information, listing MIDI event data in the browser's developer console, helping to identity what certain MIDI buttons do.

The MIDI capabilities of VDO.Ninja go beyond just controlling VDO.Ninja though. Options to seamlessly send and receive MIDI commands with remote computers at very low latency is also possible.

More information, details, guides, and tools can be found closer to the bottom of this page.

{% hint style="info" %}
Currently a Chromium-browser, like Google Chrome, is recommended when using the MIDI features. Other browsers may not be compatible at this time.
{% endhint %}

{% hint style="info" %}
**Notice:** The VDO.Ninja's MIDI API is still constantly evolving, so check back for updates if you face problems or to discover new available features and options.
{% endhint %}

## Options for \&midi={value}

{% hint style="warning" %}
There are two MIDI standards; one where value 33 is note A0, and the more common standard where value 33 is note A1. VDO.Ninja uses the A1 standard. Decrease your octave by one if having problems, such as if using TouchOSC.
{% endhint %}

| \&midi=N | Description of MIDI                                                                                                                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | Hotkeys using A3 to G4 notes                                                                                                                 |
| 2        | Hotkeys using A1 to G2 notes                                                                                                                 |
| 3        | Hotkeys using Note C1 + velocities                                                                                                           |
| 4        | <p>Hotkeys using control-change inputs.</p><p></p><p>Designed mainly for the director to control multiple guests, as well as themselves.</p> |

### **\&midi=1**

| MIDI message | Function                                     |
| ------------ | -------------------------------------------- |
| Note G3      | Toggle Chat                                  |
| Note A3      | Toggle Mute                                  |
| Note B3      | Toggle Video Output                          |
| Note C4      | Toggle Screen Share                          |
| Note D4      | Hang up                                      |
| Note E4      | Raise Hand Toggle                            |
| Note F4      | Record Local Video Toggle                    |
| Note G4      | Enable the Director’s audio \[director only] |
| Note A4      | Stop the Director’s Audio \[director only]   |

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

### **\&midi=3**

| MIDI message         | Function                                     |
| -------------------- | -------------------------------------------- |
| Note C1 + Velocity 0 | Toggle Chat                                  |
| Note C1 + Velocity 1 | Toggle Mute                                  |
| Note C1 + Velocity 2 | Toggle Video Output                          |
| Note C1 + Velocity 3 | Toggle Screen Share                          |
| Note C1 + Velocity 4 | Hang up                                      |
| Note C1 + Velocity 5 | Raise Hand Toggle                            |
| Note C1 + Velocity 6 | Record Local Video Toggle                    |
| Note C1 + Velocity 7 | Enable the Director’s audio \[director only] |
| Note C1 + Velocity 8 | Stop the Director’s Audio \[director only]   |

### **\&midi=4**

| MIDI message    | Function                                                   |
| --------------- | ---------------------------------------------------------- |
| Command = 110   | with values accepted from 0 to 8 for local toggle options. |
| Command = 110+N | where N is the guest’s order in the control room.          |

In this case, for hotkeying remote guests as a director:

| MIDI message   | Function                                   |
| -------------- | ------------------------------------------ |
| Value 0        | Opens the Transfer Popup                   |
| Value 1        | Add/remove from scene 1                    |
| Value 2        | Mute guest in scene                        |
| Value 3        | Mute guest everywhere                      |
| Value 4        | Hang-up the guest                          |
| Value 5        | Toggle Solo Chat with this guest           |
| Value 6        | Toggle the remote speaker                  |
| Value 7        | Toggle the remote display                  |
| Value 8        | Fixes Rainbow Puke of this guest in scenes |
| Value 12 to 18 | Add/remove from scene 2 to 8               |

All the above hotkey mappings are purely experimental at this time and will change based on user feedback. These mappings should allow a user to use a StreamDeck with OBS.Ninja.



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

![](<../.gitbook/assets/image (110).png>)

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



![Example of how to find the midi device order ID](<../.gitbook/assets/image (18).png>)



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



