---
description: >-
  Allows assistant directors to have access to the director's room, with a
  subset of control
---

# \&codirector

Director Option! ([`&director`](../viewers-settings/director.md))

## Aliases

* `&directorpassword`
* `&dirpass`
* `&dp`

## Options

Example: `&codirector=DirectorPassword`

<table><thead><tr><th width="211">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>the site will prompt you for a password on load</td></tr><tr><td>(alpha numeric value)</td><td>password for the directors</td></tr></tbody></table>

## Details

The basic idea is there is a URL parameter called `&codirector` that you need to add to all the director links used.

For example, `https://vdo.ninja/?director=MYROOMNAME&codirector=DirectorPWD123`

So long as all the directors have `&codirector=DirectorPWD123` added to their URLs, they all share a common director's password, and so they all treat each other as valid directors.

If the passwords don't match, the first director into the room will be the real director, and the others will be rejected.

If you don't enter a password via the URL, the site will prompt you for a password on load.

### Description

Using this flag, the director can set a director's password (or prompt the user for one). Any other director that joins the room, who also has a matching director's password set, will be granted co-director controls.

A co-director has nearly all the same controls and powers as the main director, except they cannot control the main director, nor kick them out of the room. They also have a few features unavailable to them at present, such as solo-talk, as those currently would conflict with the main director's ability to use those features.

The first director to join the room is the main director, and so their password is the 'correct' password.

A co-director cannot force-disconnect the main director.

If the main director does not have `&codirector={somepassword}` in their URL, nor enabled co-director mode via the room-settings menu, then remote co-directors will not be able to join.

{% hint style="info" %}
The co-director mode is still evolving, and certain things like shared-state between all the directors may still be missing.

Starting with [v20](../release-notes/v20.md) of VDO.Ninja, a co-director invite link will be available via the room settings button, along with the option to customize permissions.
{% endhint %}

<div align="left">

<img src="../.gitbook/assets/image (31) (1).png" alt="The co-directors have a special color assigned to them">

</div>

### Optional - Enable via Room Settings

You can also enable the co-director mode by checking the "Add co-directors .." option in the room settings menu. This will provide you a link with the `&codirector` invite link already generated.

This will only work while the check-box is selected, so be sure to re-enable it if reloading the page without `&codirector` added to your own link.

### ![](<../.gitbook/assets/image (12) (3).png>)

### Warnings

Do not confuse the room password with the director's password; if they are the same, you potentially allow a mischievous guest to have access that they should not have.

Co-directors will not be able to join as co-directors unless the main director has enabled the co-director option via the room setting's checkbox or by having a matching `&codirector=xxx` parameter in their own link.

If the main director leaves and re-joins, or a new director joins, all the co-directors will need to be re-checked. It's possible that a network outage could have a co-director and the main director to switch roles, depending on who re-connected.

If you copy and paste the main director's URL to a new browser/tab, be sure to remove the [`&push=STREAMID`](../source-settings/push.md) portion of the URL. If you do not, you will get an error about the stream ID being already in use. Each co-director and guest needs their own unique stream ID.

If using the [`&queue`](../advanced-settings/guest-queuing-parameters/and-queue.md) parameter with co-directors, you may need to use [`&view=STREAMID`](../advanced-settings/view-parameters/view.md) to allow the co-director to bypass the queue, else they won't be able to be validated since they will be stuck in the queue. There is more info about this in the [queue's documentation](../advanced-settings/guest-queuing-parameters/and-queue.md).

## Related

{% content-ref url="../viewers-settings/director.md" %}
[director.md](../viewers-settings/director.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/director-parameters/and-hidecodirectors.md" %}
[and-hidecodirectors.md](../advanced-settings/director-parameters/and-hidecodirectors.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/director-parameters/and-maindirectorpassword.md" %}
[and-maindirectorpassword.md](../advanced-settings/director-parameters/and-maindirectorpassword.md)
{% endcontent-ref %}
