---
description: '=motion prioritizes resolution; =detail prioritizes frame rate'
---

# \&contenthint

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&hint`
* `&contenttype`
* `&content`

## Options

Example: `&contenthint=detail`

| Value    | Description                                    |
| -------- | ---------------------------------------------- |
| `detail` | will prioritize **resolution** over frame rate |
| `motion` | will prioritize **frame rate** over resolution |

## Details

`&contenthint` can customize how you want VDO.Ninja to balance resolution vs frame rate, specifically when bitrate or CPU is insufficient to offer both at the same time.

The two options for video are `detail` or `motion`. Screen-shares generally tend towards `detail` by default, and camera sources are tend towards `motion` by default. `detail` will try to prioritize resolution over frame rate, so the frame rate may drop a lot used. `motion` will try to maximize frame rate, but may drop the resolution a lot. There's no way to force both on as there's no magic bullet if your CPU or network cannot keep up.

{% hint style="info" %}
If using [`&codec=vp9`](../view-parameters/codec.md) on the viewer side, the frame rate may drop as low as even 5-fps.
{% endhint %}

There is [`&screensharecontenthint`](../screen-share-parameters/and-screensharecontenthint.md) if you want the parameter to only affect screen-shares.

{% hint style="warning" %}
This parameter has been tested on Chrome, but other browsers may vary in behavior. Safari seems to just ignore things, for example.
{% endhint %}

## Related

{% content-ref url="../screen-share-parameters/and-screensharecontenthint.md" %}
[and-screensharecontenthint.md](../screen-share-parameters/and-screensharecontenthint.md)
{% endcontent-ref %}
