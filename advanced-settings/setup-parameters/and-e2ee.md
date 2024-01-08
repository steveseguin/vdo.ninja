---
description: >-
  Support for something called "end to end encryption" using "insertable
  streams"
---

# \&e2ee

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&director`](../../viewers-settings/director.md))

## Details

There is support for something called "end to end encryption" using "insertable streams" to VDO.Ninja. To use, **add** `&e2ee` **to both the viewer and sender side links**. Can be used in conjunction with [`&password`](and-password.md) to specify a cipher.

More technical details about it:

* VDO.Ninja is already end to end encrypted by default (in peer to peer mode), so this isn't anything of much value to most users.
* In p2p mode, this will double up the encryption on the video/audio stream, which might be useful if your system was compromised by a state actor.
* Uses the browser's built-in AES algo, but there is dedicated JS file for the encryption logic, so you can custom-code to use your own encryption I guess.
* Does NOT work with [Meshcast](../../newly-added-parameters/and-meshcast.md), as I don't have insertable streams working server-side there yet, so there is no E2EE with Meshcast still.
* It can be used with compatible [WHIP/WHEP](../../steves-helper-apps/whip-and-whep-tooling.md) services, but most WHIP/WHEP services won't support insertable streams. Still, some do, and that's probably the main reason why I bothered to add this all in.
* The default crypto key used will be hard coded, public, and not secure, but if you provide a [`&password`](and-password.md) it will use that as the secure cipher phrase instead.
* The encoder and decoder algo will fail-safely, rather than fail-securely; I can change this if needed, but it allows for broader peer compatibility and user friendliness. I have more work to do on visually indicating the state of this all, and to allow for more customization, but I'll wait on that until there is more feedback I guess.
* Not all browsers support this, so in those cases, it may fail safely, if possible; otherwise it will just fail completely.

## Related

{% content-ref url="and-password.md" %}
[and-password.md](and-password.md)
{% endcontent-ref %}
