---
description: Specifies a negative timezone value in minutes for a TURN server
---

# \&tz

General Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Options

Example: `&tz=-480`

| Value              | Description                                    |
| ------------------ | ---------------------------------------------- |
| (value in minutes) | specifies a negative timezone value in minutes |

## Details

Using a TURN server, you can fake your location. So if a certain location is overloaded, you can try to use the TURN servers of a different location. To do so, use the `&tz` command to specify a negative timezone value in minutes, such as: [`https://vdo.ninja/?tz=-480`](https://vdo.ninja/?tz=-480), where (tz = timezone \* -60)

## Related

{% content-ref url="../general-settings/turn.md" %}
[turn.md](../general-settings/turn.md)
{% endcontent-ref %}

{% content-ref url="../common-errors-and-known-issues/works-on-wifi-but-not-on-4g.md" %}
[works-on-wifi-but-not-on-4g.md](../common-errors-and-known-issues/works-on-wifi-but-not-on-4g.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/and-tcp.md" %}
[and-tcp.md](../general-settings/and-tcp.md)
{% endcontent-ref %}

{% content-ref url="../general-settings/and-relay.md" %}
[and-relay.md](../general-settings/and-relay.md)
{% endcontent-ref %}
