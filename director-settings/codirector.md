---
description: >-
  Allows assistant directors to join the director room with a shared
  co-director password and a subset of protected controls.
---

# \&codirector

Director Option! ([`&director`](../viewers-settings/director.md))

## Aliases

* `&directorpassword`
* `&dirpass`
* `&dp`

## Options

Example: `&codirector=DirectorPassword`

| Value | Description |
| --- | --- |
| (no value given) | Prompt for the co-director password on load |
| (alpha numeric value) | Shared co-director password |

## Details

Adding `&codirector` to the director URL enables trusted assistant-director access.

Example:

```text
https://vdo.ninja/?director=MYROOMNAME&codirector=DirectorPWD123
```

Any other director using the same room name and matching co-director password can join as a co-director.

The first valid director in the room remains the main director. Co-directors inherit most director tools, but the main director remains authoritative and cannot be removed or controlled in the same way as other guests.

## Current behavior

* Co-directors can share most director controls
* The main director remains the authority
* Some controls remain restricted to avoid conflicts with the main director
* Queue and held-guest state is synced from the main director over the normal shared-state path

That last point matters for `&queue`: late-joining co-directors should still see the current "Activate Guest" controls for held guests, and activating a guest from a co-director routes through the normal director activation flow.

## Optional room-settings workflow

You can also enable co-directors from the room settings panel, which generates a co-director invite link for you.

## Warnings

* Do not reuse the room password as the co-director password.
* Co-directors can only join if the main director has enabled co-director mode with a matching password or room setting.
* If the main director leaves and rejoins, co-directors may need to reconnect and revalidate.
* If duplicating a director URL into another tab, remove any existing [`&push=STREAMID`](../source-settings/push.md) value first, since each participant needs a unique stream ID.
* [`&view`](../advanced-settings/view-parameters/view.md) can still be used to intentionally exempt specific stream IDs from queue behavior, but it is no longer the recommended workaround just to let co-directors see queued guests.

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
