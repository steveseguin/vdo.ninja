---
description: Shows the video control bar
---

# \&videocontrols

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&controls`

## Options

Example: `&videocontrols=false`

| Value                   | Description                 |
| ----------------------- | --------------------------- |
| (no value given)        | Shows the video control bar |
| `0` \| `false` \| `off` | Hides the video control bar |

## Details

`&videocontrols` is a publisher's side parameter. It shows the video control bar (provides access to full screen on mobile). You can also show the control bar with `Right-Click` -> `Show control bar`.

{% hint style="warning" %}
This is not the same control bar as the user control bar. Also, be sure to not accidentally unmute yourself -- echo feedback galore.
{% endhint %}

![](<../../.gitbook/assets/image (133) (1).png>)

## Related

{% content-ref url="../settings-parameters/and-nocontrols.md" %}
[and-nocontrols.md](../settings-parameters/and-nocontrols.md)
{% endcontent-ref %}

{% content-ref url="../../parameters-only-on-beta/and-autohide.md" %}
[and-autohide.md](../../parameters-only-on-beta/and-autohide.md)
{% endcontent-ref %}
