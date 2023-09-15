---
description: >-
  Guest invites can be configured to ensure guests join with the same stream ID
  every time they join, allowing for reusable view- and solo-links.
---

# How to get permanent links

If you connect with the [`&push=xxxx`](../source-settings/push.md) URL parameter set, you essentially are telling the system what you want the 'view=' ID to be. In this case, it would be `xxxx`. This value is referred to as the "stream ID".

As long as the stream ID is not already in use, you can use it to identify the stream you or a guest is publishing with. In so doing, you can ensure you always connect with the same stream ID, making subsequent view- and solo- links reusable.

### Refreshing vs Rejoining

If a guest joins a room without the `&push` value set in advanced, their URL will update to include a randomly generated `&push` value once they start streaming. So, if a guest refreshes their page once they start streaming, they will rejoin with the same stream ID, as the stream ID will be embedded in the URL at that point.

However, if a guest re-joins the room using the original invite link, which didn't have a `&push` value included in it, they will be assigned a new `&push` value once they rejoin.

It's important to note as well that you should not copy and share your VDO.Ninja URL after you've already started streaming, as your URL will contain your unique stream ID at that point. Share the original invite link instead, or modify the URL so it includes a different and unique stream ID to avoid conflicts.

### How to set a custom stream ID

A [`&push`](../source-settings/push.md) ID can be up to around 40-characters in length, using alphanumeric characters, and it can be pretty much anything you want to make up. You don't need to register anything; it just needs to be unique, and preferably, random enough so that it is secure from others also picking the same value.

While you can use a name as a stream ID, it's not very secure to do so. Instead, you can label your streams with [`&label`](../general-settings/label.md) to make it easier to identify. [`&showlabels`](../advanced-settings/design-parameters/showlabels.md) will then show those labels via a video overlay if you want as well.

### Other ways to set a permanent view link

You can also use [`&permaid`](../advanced-settings/setup-parameters/and-permaid.md) on a guest invite link, which will save the randomly generated stream ID to the guest's local browser storage. Every time they rejoin, their stream ID kept in local storage will be reused. With this approach, you do not need to set a stream ID ahead of time, and as long as the guest doesn't clear their cache, change computers, or use a different browser, the stream ID won't change.\
\
Another option is to not use stream IDs at all to specify a video to load into OBS, etc. Instead, you can use custom [scenes](../advanced-settings/view-parameters/scene.md). Scene 1, S2, S3, etc. When a guest joins a room, you can simply assign the guest to a specific scene, and that scene link in OBS would be unchanging. Guests would not automatically be assigned to a scene, so you'd need to manually do that, but you don't need to update any URL in OBS with this approach.

Like the above, you can also use the VDO.Ninja [Mixer App](../steves-helper-apps/mixer-app.md) ([https://vdo.ninja/mixer](https://vdo.ninja/mixer)) to have custom layouts, with "slots", and you can assign guests as they join to certain slots. You can have the system auto-assign guests to the first available slot also, or manually do so.

There are perhaps other ways of doing this as all as well, but for most users, specifying a custom stream ID for each guest is recommended. The use of a spreadsheet to keep track of invites for guests is a great way to manage this, and with the use of URL forwarding services, like [short.io](https://short.io/), you can also change a guest's VDO.Ninja invite link retroactively, via the shortening service.
