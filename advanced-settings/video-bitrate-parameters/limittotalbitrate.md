---
description: Limits the total outbound bitrate
---

# \&limittotalbitrate

Sender-Side Option! / Director Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&director`](../../viewers-settings/director.md))

## Aliases

* `&ltb`

## Options

Example: `&limittotalbitrate=2000` or `&limittotalbitrate=2000,1000`

| Value                    | Description                              |
| ------------------------ | ---------------------------------------- |
| (positive integer value) | max total outbound video bitrate in kbps |
| `1000,500`               | Desktop bitrate, Smartphone bitrate      |

## Details

_Tries_ to limit the total outbound bitrate to some max total value, via the publisher's side. This could be useful if you are broadcasting video as a director to the room, but only have a fixed amount of upload bandwidth or CPU.

`&limittotalbitrate` can now take two values; the second of which gets used if the device is a 'mobile' device, while the first gets used otherwise. ie: `&limittotalbitrate=1000,500`\
Useful if you don't know if the guest is going to join via Desktop or via Smartphone, and you wish to avoid overloading a mobile device.

### Director

When using the `&limittotalbitrate` option as a [director](../../viewers-settings/director.md), the room settings will include a new slider to let you dynamically change that value.

This lets the director set a maximum total bandwidth outbound from them to the guests; useful if you set the total room bitrate to something high. Combined, you can ensure the guests as high quality as possible from you, without causing your OBS RTMP output or whatever to get smashed.

### Mixer App

When using the [Mixer App](../../steves-helper-apps/mixer-app.md) ([vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer)), the `&limittotalbitrate` value was set to 350-kbps before, but now I have it set to 1500-kbps. Guests in the Mixer App should as a result now see the director's broadcast output in 3x higher quality now, for better or worse. I may adjust the default value in the mixer based on user issue reports.

The slider doesn't appear if not using the `&limittotalbitrate` value in the URL (or if not using the Mixer App). It's just too confusing to explain to include it by default.

<figure><img src="../../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>

## Related

{% content-ref url="totalroombitrate.md" %}
[totalroombitrate.md](totalroombitrate.md)
{% endcontent-ref %}

{% content-ref url="roombitrate.md" %}
[roombitrate.md](roombitrate.md)
{% endcontent-ref %}
