---
description: Option for a custom hang-up message
---

# \&hangupmessage (alpha)

Sender-Side Option! ([`&push`](../../source-settings/push.md))\
\***ALPHA-ONLY** - Only available at [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&hum`

## Options

Example: `&hangupmessage=bye<img%20src%3D".%2Fmedia%2Flogo_cropped.png">`

<table><thead><tr><th width="225"></th><th></th></tr></thead><tbody><tr><td>(URL encoded string)</td><td>the message the guest will see when hanging up</td></tr></tbody></table>

## Details

Option for a custom hang-up message. `&hangupmessage` takes a URL encoded string. So it can be just "bye", or it can be some HTML, as shown in the link.

eg:\
[https://vdo.ninja/alpha/?hum=bye%3Cimg%20src%3D%22.%2Fmedia%2Flogo\_cropped.png%22%3E\&push=ZimFGxM](https://vdo.ninja/alpha/?hum=bye%3Cimg%20src%3D%22.%2Fmedia%2Flogo\_cropped.png%22%3E\&push=ZimFGxM)\
![](<../../.gitbook/assets/image (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

## Related

{% content-ref url="and-humb64-alpha.md" %}
[and-humb64-alpha.md](and-humb64-alpha.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-welcome.md" %}
[and-welcome.md](../../newly-added-parameters/and-welcome.md)
{% endcontent-ref %}

{% content-ref url="and-welcomeimage.md" %}
[and-welcomeimage.md](and-welcomeimage.md)
{% endcontent-ref %}
