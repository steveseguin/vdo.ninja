---
description: >-
  Allows assistant directors to have access to the director's room, with a
  subset of control
---

# \&codirector

Alias:&#x20;

* `&directorpassword`
* `&dirpass`
* `&dp`

## Details

The basic idea is there is a URL parameter called `&codirector` that you need to add to all the director links used.

For example, `https://vdo.ninja/?director=MYROOMNAME&codirector=DirectorPWD123`

So long as all the directors have `&codirector=DirectoPWD123` added to their URLs, they all share a common director's password, and so they all treat each other as valid directors.

If the passwords don't match, the first director into the room will be the real director, and the others will be rejected.

If you don't enter a password via the URL, the site will prompt you for a password on load.

### Description

Using this flag, the director can set a director's password (or prompt the user for one). Any other director that joins the room, who also has a matching director's password set, will be granted co-director controls.

A co-director has nearly all the same controls and powers as the main director, except they cannot control the main director, nor kick them out of the room. They also have a few features unavailable to them at present, such as solo-talk, as those currently would conflict with the main director's ability to use those features.

The first director to join the room is the main director, and so their password is the 'correct' password.

A co-director cannot force-disconnect the main director.

{% hint style="info" %}
The co-director mode is still evolving, and certain things like shared-state between all the directors may still be missing.&#x20;

Starting with v20 of VDO.Ninja, a co-director invite link will be available via the room settings button, along with the option to customize permissions.
{% endhint %}

![The co-directors have a special color assigned to them](<../.gitbook/assets/image (31).png>)

### Warnings

Do not confuse the Room password with the Director's password; if they are the same, you potentially allow a mischievous guest to have access that they should not have.

If the main director leaves and re-joins, or a new director joins, all the co-directors will need to be re-checked. It's possible that a network outage could have a co-director and the main director to switch roles, depending on who re-connected.

If you copy and paste the main director's URL to a new browser/tab, be sure to remove the [`&push=STREAMID`](../source-settings/push.md) portion of the URL. If you do not, you will get an error about the stream ID being already in use. Each co-director and guest needs their own unique stream ID.

If using the [`&queue`](../general-settings/queue.md) parameter with co-directors, you may need to use [`&view=STREAMID`](../advanced-settings/view-parameters/view.md) to allow the co-director to bypass the queue, else they won't be able to be validated since they will be stuck in the queue. There is more info about this in the queue's documentation.

This feature required fairly extensive changes to the code base to enable, so please report issues you may encounter.&#x20;

## Related

{% content-ref url="../viewers-settings/director.md" %}
[director.md](../viewers-settings/director.md)
{% endcontent-ref %}
