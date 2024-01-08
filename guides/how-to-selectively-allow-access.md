---
description: >-
  There's a few ways currently to limit or control access to a VDO.Ninja link or
  room. More ways will be added in the future.
---

# How to selectively allow access

* One way to limit who can view your stream is with the [`&prompt`](../advanced-settings/settings-parameters/and-prompt.md) option. Essentially, it will ask the publisher of a stream if they wish to allow a certain viewer to connect.\
  \
  Details here:

{% content-ref url="../advanced-settings/settings-parameters/and-prompt.md" %}
[and-prompt.md](../advanced-settings/settings-parameters/and-prompt.md)
{% endcontent-ref %}

* Another option is to use the [`transfer` ](../getting-started/rooms/transfer-rooms.md)room function, as a director. So, invited guests join a public lobby room, and then you can transfer them from that public room to a private secret room with the director's transfer button. Since only the director knows which room the guest is transferred to, the guest can't invite others to the secret room, nor can they rejoin once they disconnect or get kicked.\
  A further benefit of the transfer room method is that the director can pre-screen guests by observing their webcam and audio stream, rather than relying on just a label name.
* Another option is to use [`&maxconnections`](../source-settings/and-maxconnections.md), limiting the number of connections to something low, like 1, can be sometimes useful in ensuring there is only one viewer for a simple push stream.
* Obviously VDO.Ninja also has [`&password`](../advanced-settings/setup-parameters/and-password.md) support, and that can be useful to have back to back guests in a room, where you simply need to change the password to switch to another guest with matching password. Room names can be all the same, since it's the password AND the room name that create a room's uniqueness.
* Another option is to use [Cloudflare's Zero Trust service](https://www.cloudflare.com/en-ca/zero-trust/), which can be used with a self-hosted version of VDO.Ninja. When a user tries to join with an invite link in this setup, Cloudflare's service will prompt them to sign in first, blocking access to the site. Only users signing in with an approved location, IP address, domain, or email can continue.
* There are additional link-shortner services with password and user-access controls, which can be used to mask an invite-link for VDO.Ninja, and limit who can acess the real link that way. These services can be dynamically updated, allowing you to change the VDO.Ninja invite link after sending out the shortened alias link, and even changing the user-access allowances.
* There are also services designed for queue or user lobby management, which can be used to on-the-fly redirect a selected user to a VDO.Ninja link. [https://app.invite.cam](https://app.invite.cam) is such a service being developed by the developers of VDO.Ninja for such a purpose, although it is still in a young state of development.

More options for user control will be added to VDO.Ninja in the future. Feedback can be provided via the Discord server ([https://discord.vdo.ninja](https://discord.vdo.ninja)) in the #feature-request channel.\
