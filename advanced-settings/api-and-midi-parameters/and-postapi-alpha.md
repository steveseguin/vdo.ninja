---
description: Lets you specify a custom POST URL to send events within VDO.Ninja to
---

# \&postapi (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Aliases

* `&posturl`

## Options

Example: `&postapi=https%3A%2F%2Fwebhook.site%2Fb190f5bf-e4f8-454a-bd51-78b5807df9c1`

| Value             | Description                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| (custom POST URL) | Data JSON encoded, post URL requires HTTPS+CORS, and the passed URL parameter value needs to be encodedURLComponent |

## Details

`&postapi` lets you specify a custom POST URL to send events within VDO.Ninja to.

Data JSON encoded, post URL requires HTTPS+CORS, and the passed URL parameter value needs to be encodedURLComponent.\
ie: `&postapi=https%3A%2F%2Fwebhook.site%2Fb190f5bf-e4f8-454a-bd51-78b5807df9c1`

If you don't want to listen for events with the websocket server API I host, you can use this with your own API https server instead and get key events pushed to you that way.

<figure><img src="../../.gitbook/assets/image (2) (1).png" alt=""><figcaption></figcaption></figure>
