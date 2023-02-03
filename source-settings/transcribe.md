---
description: Enables transcription and closed captioning
---

# \&transcribe

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&trans`
* `&transcript`

## Options

Example: `&transcribe=de-DE`

| Value                     | Description                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `en-US`                   | American English                                                                                         |
| `de-DE`                   | German                                                                                                   |
| `pt-PT`                   | Portuguese                                                                                               |
| (any xx-XX language code) | You can check for additional language codes [here](https://www.science.co.il/language/Locale-codes.php). |

## Details

The transcription service uses default browser/system mic as a source and cannot be muted.

Generally needs to be used in conjunction with [`&closedcaptions`](../advanced-settings/settings-parameters/and-closedcaptions.md).

{% hint style="warning" %}
* The transcription audio source will be the default microphone of the browser, which often is the same as the system's default input source.
* It is not necessary the microphone that has been selected in VDO.Ninja. Please double check this if the transcription isn't working.
* The mute button of VDO.Ninja will not work with this feature; at the moment anyways.
* Only one transcription service can run at a time.
* Chrome or other browsers will prevent the user from running multiple transcription services at a time. Since the transcription services of most browsers requires the Internet.
{% endhint %}

You will normally need Internet access for this to work and be willing to tolerate the occasional hiccup that the browser's transcription service may cause. Service may stop for seconds at a time as a result.

Certain Android devices may not require internet for the transcription to work.

{% embed url="https://www.youtube.com/embed/3eo85WAXeuk" %}

{% hint style="danger" %}
Does not work in Safari!
{% endhint %}

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-closedcaptions.md" %}
[and-closedcaptions.md](../advanced-settings/settings-parameters/and-closedcaptions.md)
{% endcontent-ref %}

{% content-ref url="../steves-helper-apps/caption.ninja.md" %}
[caption.ninja.md](../steves-helper-apps/caption.ninja.md)
{% endcontent-ref %}
