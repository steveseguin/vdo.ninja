# How to control VDO.Ninja with Touch Portal

1\. Create a custom API. First create a new room, with a custom API key, so that it looks like this: [`https://vdo.ninja/?api=APIKEY&director=TouchPortalExample`](https://vdo.ninja/?api=APIKEY\&director=TouchPortalExample) `` \
Replacing the APIKEY with a string of your choosing.&#x20;

2\. Then, in Touch Portal, add a new button with the HTTP GET action. In the HTTP GET Action GET URL field, input your desired action. This particular GET action will send Guest 1 to Scene 1 with a push of the button:\
`https://api.vdo.ninja/APIKEY/addScene/1/1`

![](<../.gitbook/assets/image (109).png>)

For more API examples, check out these resources:\
[https://github.com/steveseguin/Companion-Ninja](https://github.com/steveseguin/Companion-Ninja)\
[https://companion.vdo.ninja/?api=k8eYrfvJUC](https://companion.vdo.ninja/?api=k8eYrfvJUC)

Thanks to <mark style="color:red;">djlefave</mark> on [Discord](https://discord.vdo.ninja) for this guide.

## Related

{% content-ref url="../general-settings/api.md" %}
[api.md](../general-settings/api.md)
{% endcontent-ref %}

{% content-ref url="hotkey-support.md" %}
[hotkey-support.md](hotkey-support.md)
{% endcontent-ref %}
