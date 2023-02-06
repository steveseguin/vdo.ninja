---
description: >-
  Disconnects communication with the handshake server as soon as possible and
  provides verbose feedback
---

# \&secure

General Option! ([`&push`](push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Details

The enhanced security parameter will auto-disconnect you from the handshake-server after the first peer connection is established (Publishers only are disconnected; not viewers). In effect, this makes it impossible for the server to request future handshakes from you, and hence no more future peer connections.

The feature also makes the connection activity verbose, letting you know when someone starts watching your stream and when that viewer disconnects.

The security mode also limits the max number of viewers to just one viewer, and if they do disconnect, they cannot reconnect. No one can actually; you will have to re-setup via a page refresh to let someone try connecting again.

This can help prevent someone from destroying a live stream due to accidentally screen sharing the stream ID to the public.

### Technical Benefits

* The handshake server has no way of talking to the publisher after the stream starts. Fully decentralized once initialized.
* The publisher cannot be spammed by "Watch Stream" requests if the invite link gets shared accidentally.
* The publisher can clearly see when someone has joined and when someone has disconnected.
* Increased security and privacy, with just some minor added inconveniences.

### Alternatives

* If you wish to host your own handshake server, there is one available that is adequate for private for personal use here: [https://github.com/steveseguin/websocket\_server/](https://github.com/steveseguin/websocket\_server/)
* If interesting in hiding your IP address from a remote guest, you can use `&privacy` instead, which will use a TURN server to connect with remote guests, acting as a middleman for the peer connection.
* While it should be tested, you can also perhaps try [`&icefilter=host`](../general-settings/and-icefilter.md) which will attempt to filter out connections with remote guests that are behind a firewall.  Feedback and test results welcomed.
