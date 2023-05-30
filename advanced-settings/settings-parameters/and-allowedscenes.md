---
description: >-
  Option to filter which OBS scenes a remote guest has access to controlling
  when using &controlobs
---

# \&allowedscenes

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

Example: `&allowedscenes=Scene1,Scene2`

<table><thead><tr><th width="345">Value</th><th>Description</th></tr></thead><tbody><tr><td>(comma separated OBS scene names)</td><td>filter which OBS scenes a remote guest has access to controlling when using <a href="and-controlobs.md"><code>&#x26;controlobs</code></a></td></tr></tbody></table>

## Details

`&allowedscenes` filters which OBS scenes a remote guest has access to controlling when using [`&controlobs`](and-controlobs.md). Uses CSV to split up the scenes (avoid special characters in your scene names if there are issues)

Example: `vdo.ninja/?view=StreamID&remote&allowedscenes=Scene1,Scene2`

{% hint style="info" %}
If you don't want a user to have the ability to start/stop a stream, set the OBS page permissions to level 4, instead of 5. It'll disable the start/stop buttons for the user if they don't have those permissions.
{% endhint %}

## Related

{% content-ref url="and-controlobs.md" %}
[and-controlobs.md](and-controlobs.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/remote.md" %}
[remote.md](../../general-settings/remote.md)
{% endcontent-ref %}
