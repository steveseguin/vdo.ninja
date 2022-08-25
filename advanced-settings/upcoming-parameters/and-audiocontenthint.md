---
description: '=music fixed bitrate; =speech bitrate is variable'
---

# \&audiocontenthint

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

| Value    | Description                                                 |
| -------- | ----------------------------------------------------------- |
| `music`  | seems to be a fixed bitrate of 32-kbps sent out by default  |
| `speech` | bitrate is variable, using less bandwidth when not speaking |

## Details

There are two options for `&audiocontenthint`: `speech` and `music`. No idea what it does exactly, but when using `music` there seems to be a fixed bitrate of 32-kbps sent out by default, where as with `speech` it is variable, using less bandwidth when not speaking.

{% hint style="warning" %}
This parameter has been tested on Chrome, but other browsers may vary in behavior. Safari seems to just ignore things, for example.
{% endhint %}

## Related

{% content-ref url="../view-parameters/vbr.md" %}
[vbr.md](../view-parameters/vbr.md)
{% endcontent-ref %}

{% content-ref url="and-contenthint.md" %}
[and-contenthint.md](and-contenthint.md)
{% endcontent-ref %}
