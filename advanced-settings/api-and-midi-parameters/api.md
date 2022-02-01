---
description: Remote control API (HTTP-GET / WSS-based)
---

# \&api

## Aliases

* `&osc`

## Options

| Value | Description                           |
| ----- | ------------------------------------- |
| (key) | API KEY to control VDO.Ninja remotely |

## Details

You can use this parameter to enable the HTTP/WSS remote control API for VDO.Ninja. You pass a API KEY value to the parameter, and if it matches the remote control's API KEY, then the remote control interface will be able to send commands to your VDO.Ninja session.

You can control guests in the director's room, or you can control your local microphone and camera, as examples.

Please see [https://github.com/steveseguin/Companion-Ninja](https://github.com/steveseguin/Companion-Ninja) for documentation and details of this command. There is a module for Bitfocus's Companion available, along with HTTP and WSS API endpoints.

Please see [https://companion.vdo.ninja](https://companion.vdo.ninja) for a sample interface to test this command out with. The Companion module is available here: [https://github.com/bitfocus/companion-module-vdo-ninja](https://github.com/bitfocus/companion-module-vdo-ninja)

## Related

{% content-ref url="../../guides/hotkey-support/" %}
[hotkey-support](../../guides/hotkey-support/)
{% endcontent-ref %}

{% content-ref url="../../guides/hotkey-support/how-to-control-vdo.ninja-with-touch-portal.md" %}
[how-to-control-vdo.ninja-with-touch-portal.md](../../guides/hotkey-support/how-to-control-vdo.ninja-with-touch-portal.md)
{% endcontent-ref %}
