---
description: Controlling VDO.Ninja with Touch Portal using API commands
---

# How to control VDO.Ninja with Touch Portal

## How to

1\. Create a new room as a director, with a custom API key, so that it looks like this: [`https://vdo.ninja/?api=APIKEY&director=TouchPortalExample`](https://vdo.ninja/?api=APIKEY\&director=TouchPortalExample) `` \
Replacing the APIKEY with a string of your choosing.&#x20;

2\. Then, in Touch Portal, add a new button with the `HTTP GET` action. In the `HTTP GET` Action `GET URL` field, input your desired action. This particular GET action will send Guest 1 to Scene 1 with a push of the button:\
`https://api.vdo.ninja/APIKEY/addScene/1/1`

![](<../../.gitbook/assets/image (109) (1) (1).png>)

Thanks to <mark style="color:red;">djlefave</mark> on [Discord](https://discord.vdo.ninja/) for this guide.

## More information

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}

{% content-ref url="broken-reference" %}
[Broken link](broken-reference)
{% endcontent-ref %}

## Examples and resources

For more API examples, check out these resources:\
[https://github.com/steveseguin/Companion-Ninja](https://github.com/steveseguin/Companion-Ninja)\
[https://companion.vdo.ninja/?api=k8eYrfvJUC](https://companion.vdo.ninja/?api=k8eYrfvJUC)

## Related

{% content-ref url="../../general-settings/api.md" %}
[api.md](../../general-settings/api.md)
{% endcontent-ref %}
