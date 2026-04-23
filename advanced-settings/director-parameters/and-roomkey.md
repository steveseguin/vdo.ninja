---
description: Add a trusted bypass key for room approval and custom room caps.
---

# \&roomkey

General Option! ([`&director`](../../viewers-settings/director.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&rk`

## Options

Example: `&roomkey=TRUSTED_BYPASS_KEY`

| Value | Description |
| --- | --- |
| String | Trusted bypass key shared between the director and selected guest links |

## Details

`&roomkey` is a trusted bypass key for the room admission controls on a claimed room.

Add it to the director link:

```text
https://vdo.ninja/?director=MyRoom&requireapproval&roomcap=10&roomkey=TRUSTEDKEY
```

Add the same key only to trusted guest links:

```text
https://vdo.ninja/?room=MyRoom&roomkey=TRUSTEDKEY
```

Guests with a matching key can bypass:

* manual approval from [`&requireapproval`](and-requireapproval.md)
* a lower custom cap from [`&roomcap`](and-roomcap.md)

`&roomkey` cannot bypass the server hard cap. On the official `vdo.ninja` service, the hard cap is `80`.

## Live director behavior

The bypass key is attached to the live director claim. If the director leaves and a new director claims the room with a different key, the trusted bypass changes with that director's settings.

## Security notes

Treat a room key like a password.

* Share it only with guests who should bypass approval or a custom cap.
* Rotate it if it is exposed.
* Do not use a predictable key for public events.

## Related

{% content-ref url="and-requireapproval.md" %}
[and-requireapproval.md](and-requireapproval.md)
{% endcontent-ref %}

{% content-ref url="and-roomcap.md" %}
[and-roomcap.md](and-roomcap.md)
{% endcontent-ref %}
