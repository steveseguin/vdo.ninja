---
description: A basic guest queuing system
---

# \&queue

This option lets the room's director review guests who join a room, and when approved, transfer them to another room.&#x20;

{% embed url="https://www.youtube.com/embed/DDJrhhdNX_c" %}

Guests are added to a queue as they join, and the director can connect to those guests with a button in their lower control bar. This feature prevents the director's computer from being overwhelmed with connections.\
\
The guests will not be able to see anyone, until they are transferred or approved. Once approved, the director will be able to see them, and they will be able to see the director.

Guests can be disconnected and they can then rejoin the queue, but when they do they will be at the end of the queue again.

This system can support hundreds of guests in queue, but it is not advisable to use this system if you expect thousands of guests to join.

{% hint style="info" %}
Looking for feedback!
{% endhint %}

## Details of using

Add this to both the director URL and the guest URL.

Example director link:

```
https://vdo.ninja?director=xxxx&queue
```

Corresponding room link:

```
https://vdo.ninja/?room=xxxx&queue
```

There will be a new button added to the director's view, which when pressed, loads a guest into the director's room. The guest will be able to see the director and only the director then.

The director can add more guests this way, kicking out those they don't want, and continue to cycle thru the queue of guests as they join the room.

The director can then Transfer the guest(s) to another room, and when transferred, the guests are no longer considered in 'a queue' and will be able to see everyone in that new room, and vice versa. The guest will not know which room they were transferred to, and will be unable to rejoin without joining the queue again. You can use the "change url" button in the director's room if you wish to perma-transfer a guest to a new link.

### Exempt certain connections from the queue automatically

As a director, you can use `&view` in the URL to specify stream IDs that you wish to connect normally, bypassing the queue.

For example,  `https://vdo.ninja/?director=MyRoom123&codirector&queue&push=mainDirector123&view=coDirectorStreamID123`

`https://vdo.ninja/?director=MyRoom123&codirector&queue&push=coDirectorID123&view=mainDirector123`

The above links allows a co-director join the room, despite the main director and co-director being in Queuing-mode. By specifying each other's stream ID as a listed view value, they can both bypass each other's queue together.

`&view` can accept a list of stream IDs.  When in `&queue` mode, `&view` allows connections to join that are not listed, but only if they are brought in via the queue. This makes it a bit of a special case for `&view`, where it otherwise is pretty strict about who connects or not.

{% content-ref url="../advanced-settings/mixer-scene-parameters/view.md" %}
[view.md](../advanced-settings/mixer-scene-parameters/view.md)
{% endcontent-ref %}
