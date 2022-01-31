---
description: Controlling VDO.Ninja with Touch Portal using API commands
---

# How to control VDO.Ninja with Touch Portal

## How to

1\. Create a new room as a director, with a custom API key, so that it looks like this: [`https://vdo.ninja/?api=APIKEY&director=TouchPortalExample`](https://vdo.ninja/?api=APIKEY\&director=TouchPortalExample) `` \
Replacing the APIKEY with a string of your choosing.&#x20;

2\. Then, in Touch Portal, add a new button with the `HTTP GET` action. In the `HTTP GET` Action `GET URL` field, input your desired action. This particular GET action will send Guest 1 to Scene 1 with a push of the button:\
`https://api.vdo.ninja/APIKEY/addScene/1/1`

![](<../../.gitbook/assets/image (109).png>)

Thanks to <mark style="color:red;">djlefave</mark> on [Discord](https://discord.vdo.ninja) for this guide.

## More information

The HTTP API uses GET-requests (not POST/PUT), and is structured in a way to be compatible with existing hotkey control software.

`https://api.vdo.ninja/{apiID}/{action}/{target}/{value}`

or

`https://api.vdo.ninja/{apiID}/{action}/{value}`

or

`https://api.vdo.ninja/{apiID}/{action}`

Any field can be replaced with "null", if no value is being passed to it. Double slashes will cause issues though, so avoid those.

You find a list of all the commands here:

{% content-ref url="api-commands.md" %}
[api-commands.md](api-commands.md)
{% endcontent-ref %}

## Examples and resources

For more API examples, check out these resources:\
[https://github.com/steveseguin/Companion-Ninja](https://github.com/steveseguin/Companion-Ninja)\
[https://companion.vdo.ninja/?api=k8eYrfvJUC](https://companion.vdo.ninja/?api=k8eYrfvJUC)

## Related

{% content-ref url="../../general-settings/api.md" %}
[api.md](../../general-settings/api.md)
{% endcontent-ref %}

{% content-ref url="./" %}
[.](./)
{% endcontent-ref %}
