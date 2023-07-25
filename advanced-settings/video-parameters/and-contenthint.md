---
description: '=motion prioritizes frame rate; =detail prioritizes resolution'
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

#### Additional value options

Depending on browser and version, there may be additional values you can pass, such as `text`. Please see the following link for possible options that your browser may offer:

[https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/contentHint](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/contentHint)

## Details

`&contenthint` can customize how you want VDO.Ninja to balance resolution vs frame rate, specifically when bitrate or CPU is insufficient to offer both at the same time.

The two options for video are `detail` or `motion`. Screen-shares generally tend towards `detail` by default, and camera sources are tend towards `motion` by default. `detail` will try to prioritize resolution over frame rate, so the frame rate may drop a lot used. `motion` will try to maximize frame rate, but may drop the resolution a lot. There's no way to force both on as there's no magic bullet if your CPU or network cannot keep up.

For more information on how to lock or maximize the resolution of a video feed, please see the following guide:

{% content-ref url="../../guides/how-do-i-lock-the-resolution.md" %}
[how-do-i-lock-the-resolution.md](../../guides/how-do-i-lock-the-resolution.md)
{% endcontent-ref %}

There is [`&screensharecontenthint`](../screen-share-parameters/and-screensharecontenthint.md) if you want the parameter to only affect screen-shares.\
\
If facing issues poor quality, try increasing your bitrate or improving your network connection, such as moving off of WiFi and onto Ethernet. Sometimes changing codecs, such as to h264 or av1, can help improve quality depending on the cause.\
\
If your CPU is overloaded, h264 might use less CPU than other codecs. You can also consider using \&meshcast to reduce CPU usage if sharing to multiple viewers at a time.

{% hint style="info" %}
If using [`&codec=vp9`](../view-parameters/codec.md) on the viewer side, the frame rate may drop as low as even 5-fps.
{% endhint %}

{% hint style="warning" %}
This parameter has been tested on Chrome, but other browsers may vary in behavior. Safari seems to just ignore things, for example.
{% endhint %}

## Related

{% content-ref url="../screen-share-parameters/and-screensharecontenthint.md" %}
[and-screensharecontenthint.md](../screen-share-parameters/and-screensharecontenthint.md)
{% endcontent-ref %}
