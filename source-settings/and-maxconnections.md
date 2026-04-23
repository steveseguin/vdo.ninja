---
description: Limit the total number of peer connections to a source.
---

# \&maxconnections

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&mc`

## Options

Example: `&maxconnections=5`

| Value | Description |
| --- | --- |
| Integer | Maximum number of total push/view peer connections allowed for the source |

## Details

`&maxconnections` limits the total number of peer connections to a single source or push stream.

```text
https://vdo.ninja/?push=Camera1&maxconnections=1
```

This can be useful when a source should only be viewed by one or a few viewers.

## Not a room cap

`&maxconnections` is not the same as [`&roomcap`](../advanced-settings/director-parameters/and-roomcap.md).

* `&maxconnections` applies to a source/push link.
* `&roomcap` applies to admission into a claimed director room.

If you want to limit how many people can enter a room, use `&roomcap` on the director link instead.

## Related

{% content-ref url="../advanced-settings/director-parameters/and-roomcap.md" %}
[and-roomcap.md](../advanced-settings/director-parameters/and-roomcap.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/and-maxpublishers.md" %}
[and-maxpublishers.md](../advanced-settings/view-parameters/and-maxpublishers.md)
{% endcontent-ref %}

{% content-ref url="and-maxviewers.md" %}
[and-maxviewers.md](and-maxviewers.md)
{% endcontent-ref %}
