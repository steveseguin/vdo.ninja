# MIDI, API and WebHID support

## MIDI hotkeys

There are numerous more hotkeys that can be used via MIDI; these are global hotkeys, used even if the window is not visible, but they require some additional setup. You can remotely control via MIDI also, using the [`&midiout`](../midi-settings/midiout.md) and [`&midiin`](../midi-settings/midiin.md) routing functionality.&#x20;

MIDI hotkeys are compatible with an Elgato Streamdeck by means of a free Streamdeck MIDI plugin.

{% content-ref url="../midi-settings/midi.md" %}
[midi.md](../midi-settings/midi.md)
{% endcontent-ref %}

## Bitfocus Companion

There is also Bitfocus Companion control compatibility, available here: [https://github.com/bitfocus/companion-module-vdo-ninja](https://github.com/bitfocus/companion-module-vdo-ninja)

## HTTP / Websocket API

The Bitfocus Companion plugin makes use of a HTTP and Websocket API, that allows for lots of remote control functionality.

There is a website that demos some of the commands available here: [https://companion.vdo.ninja/](https://companion.vdo.ninja/) Details on the API itself is here: [https://github.com/steveseguin/Companion-Ninja](https://github.com/steveseguin/Companion-Ninja)

You can use this to create your own hotkeys for pretty any device, application, or website.

{% content-ref url="../general-settings/api.md" %}
[api.md](../general-settings/api.md)
{% endcontent-ref %}

## IFRAME API

The HTTP and websocket make use of a server to route API calls. If you'd like to create your own API server or don't need remote hotkey support, you can used the provide IFRAME API and send commands instead to VDO.Ninja via an IFRAME wrapper.&#x20;

The IFRAME API is the most powerful option, but it requires some basic coding on your own part to have it provide hotkey functionality for your specific requirement.

{% content-ref url="iframe-api-documentation.md" %}
[iframe-api-documentation.md](iframe-api-documentation.md)
{% endcontent-ref %}

Below is an example of how to remotely control OBS anywhere online using the VDO.Ninja IFrame API; the code is just an example of how to use the IFrame API with OBS in this case, and it not intended to be used in production as is. The core concept lets you relay data messages from one website page to another, peer to peer, with just a few lines of code!

{% embed url="https://github.com/steveseguin/sample-p2p-tunnel" %}

## WebHID

There is also WebHID support, but it's not fully implemented at this time. User requests are welcomed though and there's a demo here: [https://vdo.ninja/webhid](https://vdo.ninja/webhid)\
It should be improved upon in the future, assuming the feature does not get depreciated by the browser first.

## Feature requests and feedback

It's easy enough to add new hotkeys or features; please make a request as needed. The hotkey and API commands are organically development, based on user needs and feedback. Most simple requests can be accommodated within minutes.
