---
description: >-
  Shows the battery meter for guests that are on devices with a battery that's
  draining/charging
---

# \&batterymeter

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&batterymeter=0`

| Value                | Description                    |
| -------------------- | ------------------------------ |
| (no value given)     | Adds a battery-meter per guest |
| `0` \| `no` \| `off` | Disables the battery-meter     |

## Details

Curtesy of @Yong.\
Notes:\
[https://github.com/steveseguin/vdo.ninja/pull/1078#issuecomment-1627799535](https://github.com/steveseguin/vdo.ninja/pull/1078#issuecomment-1627799535)

It's the same concept of [`&signalmeter`](../../newly-added-parameters/and-signalmeter.md), except shows the battery meter for guests that are on devices with a battery that's draining/charging.

Shows blinking warning if under 25% battery life.

The battery meter was already available by default as the director, but now it can be enabled as a guest, etc.

Also supports disabling the meter with `&batterymeter=0`.

## Related

{% content-ref url="../../newly-added-parameters/and-signalmeter.md" %}
[and-signalmeter.md](../../newly-added-parameters/and-signalmeter.md)
{% endcontent-ref %}
