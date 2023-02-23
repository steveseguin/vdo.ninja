---
description: Delays the microphone by specified time in ms
---

# \&micdelay

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&md`

## Options

Example: `&micdelay=100`

| Value                    | Description                         |
| ------------------------ | ----------------------------------- |
| (positive integer value) | Delay to add in milliseconds        |
| (no value given)         | Will show the mic delay as a slider |

## Details

Delays the microphone by specified time in ms.

### Update in Version 22

Added the "mic delay" option as a slider to the director's control; it's available by default, with up to 500-ms of delay ready. If you make use of it, it will "enable" the `&micdelay` web audio node remotely if not yet on, which might cause a clicking sound. Hoping that this though can help with problematic guests who might be out of sync. This is not the same as [`&buffer`](../advanced-settings/view-parameters/buffer.md) or [`&sync`](../advanced-settings/view-parameters/sync.md) delay, which are a view-side parameters.

![](<../.gitbook/assets/image (3) (1) (4).png>)

`&micdelay`, if used on a basic push link, will show the mic delay as a slider now also. So you can adjust it as needed. I don't show the slider by default unless using the URL parameter, as I don't think its a commonly used feature.\
![](<../.gitbook/assets/image (4) (2).png>)

## Related

{% content-ref url="../newly-added-parameters/and-audiolatency.md" %}
[and-audiolatency.md](../newly-added-parameters/and-audiolatency.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/sync.md" %}
[sync.md](../advanced-settings/view-parameters/sync.md)
{% endcontent-ref %}
