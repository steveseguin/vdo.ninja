---
description: Lets you specify the Meshcast server to use
---

# \&meshcastcode

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Options

Example: `&meshcastcode=usw2`

<table><thead><tr><th width="200">Value</th><th>Description</th></tr></thead><tbody><tr><td>(no value given)</td><td>Chooses the best server automatically</td></tr><tr><td>(servercode)</td><td>Chooses the selected Meshcast server</td></tr></tbody></table>

Full server list: [https://meshcast.io/servers.json](https://meshcast.io/servers.json)

## Details

`&meshcastcode`lets you specify the Meshcast server to use. This was already possible with just [`&meshcast`](../../newly-added-parameters/and-meshcast.md), but if you wanted to specify audio/video-only modes as well as the server, this new option will let you specify the server another way, allowing both options to work.

ie: [`https://vdo.ninja/?meshcastcode=cae1&meshcast=video`](https://vdo.ninja/?meshcastcode=cae1\&meshcast=video)

You can select the Meshcast server via URL Parameter, if you want low-level control there.

If you don't set it, the best one will be chosen automatically. If the specified one isn't found, the next best is used.

Example: `&meshcastcode=usw2`

<table><thead><tr><th width="200">Value</th><th>Description</th></tr></thead><tbody><tr><td>(servercode)</td><td>Meshcast server</td></tr><tr><td><code>cae1</code></td><td>Canada-East 1</td></tr><tr><td><code>cae2</code></td><td>Canada-East 2</td></tr><tr><td><code>use1</code></td><td>USA-East 1</td></tr><tr><td><code>use2</code></td><td>USA-East 2</td></tr><tr><td><code>usw1</code></td><td>USA-West 1</td></tr><tr><td><code>usw2</code></td><td>USA-West 2</td></tr><tr><td><code>fr1</code></td><td>France</td></tr><tr><td><code>de1</code></td><td>Germany</td></tr><tr><td><code>usc1</code></td><td>Dev-server</td></tr></tbody></table>

Full server list: [https://meshcast.io/servers.json](https://meshcast.io/servers.json)

## Related

{% content-ref url="../../newly-added-parameters/and-meshcast.md" %}
[and-meshcast.md](../../newly-added-parameters/and-meshcast.md)
{% endcontent-ref %}

{% embed url="https://meshcast.io/" %}
https://meshcast.io/
{% endembed %}
