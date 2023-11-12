---
description: A basic guest queuing and approving system
---

# \&queue

Director and/or Sender Option! ([`&director`](../../viewers-settings/director.md), [`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md))

## Details

`&queue` lets the room's director review guests who join a room.

The option can be used in one of two ways; either as a powerful screening room or as a simple approval system, depending on if the `&queue` option is also used on the director's URL.

<div align="left">

<figure><img src="../../.gitbook/assets/image (10) (4).png" alt=""><figcaption></figcaption></figure>

</div>

{% embed url="https://www.youtube.com/embed/DDJrhhdNX_c" %}

{% hint style="info" %}
`&queue` was changed in v24 to not allow the guest to see the director's video, until the director activates the guest with their pink activate-guest button. Otherwise, it's the same as before. Use [`&screen`](and-screen-alpha.md) for the old version.
{% endhint %}

If used on the director's URL, as well as the guest's URL, guests are added to a queue as they join, and the director can connect to those guests with a button in their lower control bar. This feature prevents the director's computer from being overwhelmed with connections.

The guests will not be able to see anyone, until they are transferred or approved. Once approved, the director will be able to see them, and they will be able to see the director.

Guests can be disconnected and they can then rejoin the queue, but when they do they will be at the end of the queue again.

This system can support hundreds of guests in queue, but it is not advisable to use this system if you expect thousands of guests to join.

{% hint style="info" %}
Looking for feedback!
{% endhint %}

### Using `&queue` on both director + guest links

The `&queue` option can be added to both the director URL and the guest URL, or just the guest's URL.

Example director link:

```
https://vdo.ninja?director=roomname&queue
```

Corresponding room link:

```
https://vdo.ninja/?room=roomname&queue
```

When `&queue` is added both the guests' links and director's link, there will be a new 'wait list' button added to the director's view, which when pressed, will load the next guest in queue in the director's room. The guest will be able to see the director and only the director then.

The director can add more guests this way, kicking out those they don't want, and continue to cycle thru the queue of guests as they join the room. This setup is designed as a screening room, where the director is expected to transfer the guests to the main production room when appropriate.

When transferred, the guest will no longer be considered in 'a queue' and will be able to see everyone in the new room they were transferred to, and vice versa. The guest will not know which room they were transferred to, and will be unable to rejoin without joining the queue again. You can use the "change URL" button in the director's room if you wish to permanent-transfer a guest to a new link.

This setup is ideal for when dozens or hundreds of guests may try joining a room. The director can load a few guests at a time, preventing their system from being overloaded. Relying on a transfer room prevents the main room from being attacked as well.

### Using `&queue` on just the guest invite link

When `&queue` is added to just the invite link for a guest, and not added to the director's link also, the guest will auto-load for the director, and only for the director. There is no wait-list.

The director will have a button for each joined guest titled "Activate Guest", which will pressed, will accept the guest into the current room as if a normal guest. They will see other activated guests in the room, without needing to be transferred to another room.

This approach to just adding `&queue` to the guest invite links, and not putting the room itself into a screening room, is well suited when you are only expecting just a few guests to join, and not dozens or hundreds, since the director will auto-load the video of each guest who joins.

Since it's possible for a user to just remove `&queue` from their URL when joining, bypassing the need for activation, this method is considered less secure versus the use of the screening room where users are transferred to the main room instead.

<figure><img src="../../.gitbook/assets/image (184).png" alt=""><figcaption></figcaption></figure>

### Exempt certain connections from the queue automatically

As a director, you can use [`&view`](../view-parameters/view.md) in the URL to specify stream IDs that you wish to connect normally, bypassing the queue.

For example:\
[`https://vdo.ninja/?director=MyRoom123&codirector&queue&push=mainDirector123&view=coDirectorStreamID123`](https://vdo.ninja/?director=MyRoom123\&codirector\&queue\&push=mainDirector123\&view=coDirectorStreamID123)

[`https://vdo.ninja/?director=MyRoom123&codirector&queue&push=coDirectorID123&view=mainDirector123`](https://vdo.ninja/?director=MyRoom123\&codirector\&queue\&push=coDirectorID123\&view=mainDirector123)

The above links allows a co-director join the room, despite the main director and co-director being in queuing-mode. By specifying each other's stream ID as a listed view value, they can both bypass each other's queue together.

`&view` can accept a list of stream IDs. When in `&queue` mode, `&view` allows connections to join that are not listed, but only if they are brought in via the queue. This makes it a bit of a special case for `&view`, where it otherwise is pretty strict about who connects or not.

### Other queue modes

The "queue" mode, when applied only to the guest-link, has been extended with new options. These modes do not apply when you have `&queue` also on the director's link, however, rather just when added to the guest-invite link only.

These options might be appealing for screening guests when either you don't want to use a transfer room or don't expect too many guests to be in queue.

[and-screen-alpha.md](and-screen-alpha.md "mention")

[and-hold-alpha.md](and-hold-alpha.md "mention")

[and-holdwithvideo-alpha.md](and-holdwithvideo-alpha.md "mention")

## Related

{% content-ref url="and-screen-alpha.md" %}
[and-screen-alpha.md](and-screen-alpha.md)
{% endcontent-ref %}

{% content-ref url="and-hold-alpha.md" %}
[and-hold-alpha.md](and-hold-alpha.md)
{% endcontent-ref %}

{% content-ref url="and-holdwithvideo-alpha.md" %}
[and-holdwithvideo-alpha.md](and-holdwithvideo-alpha.md)
{% endcontent-ref %}

{% content-ref url="../settings-parameters/and-queuetransfer.md" %}
[and-queuetransfer.md](../settings-parameters/and-queuetransfer.md)
{% endcontent-ref %}
