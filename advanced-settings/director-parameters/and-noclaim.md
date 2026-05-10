---
description: Join director mode without trying to claim the room as the main director.
---

# \&noclaim

Director Option! ([`&director`](../../viewers-settings/director.md))

## Aliases

* `&noautoclaim`
* `&nonclaiming`
* `&claim=0`

## Details

`&noclaim` lets a director-mode URL join without attempting to claim the room as the main director.

This applies to any director-mode link, including a co-director link:

```text
https://vdo.ninja/?dir=MyRoom&codirector=DirectorPassword&noclaim
```

The co-director can still request co-director access from the current main director using the normal `&codirector` validation flow. The URL just skips the server-side room claim attempt.

## When to use it

Use `&noclaim` for co-director invite links when you want the current main director to remain the only room-claiming director.

This helps avoid a co-director becoming the main claimed director during reconnect or startup timing.

## Notes

* `&noclaim` does not grant co-director permissions by itself. Use [`&codirector`](../../director-settings/codirector.md) for that.
* If a URL does not claim the room, claim-time settings such as [`&requireapproval`](and-requireapproval.md), [`&roomcap`](and-roomcap.md), and [`&roomkey`](and-roomkey.md) are not applied from that URL.
* The director room UI can generate a non-claiming co-director link from the co-director settings.

## Related

{% content-ref url="../../director-settings/codirector.md" %}
[codirector.md](../../director-settings/codirector.md)
{% endcontent-ref %}

{% content-ref url="and-roomkey.md" %}
[and-roomkey.md](and-roomkey.md)
{% endcontent-ref %}
