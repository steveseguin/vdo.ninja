---
description: >-
  Option to filter which OBS scenes a remote guest has access to controlling
  when using &controlobs
---

# \&allowedscenes (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))\
\*only available on [vdo.ninja/alpha](https://vdo.ninja/alpha/)

## Options

Example: `&allowedscenes=Scene1,Scene2`

| Value                             | Description                                                                                                    |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| (comma separated OBS scene names) | filter which OBS scenes a remote guest has access to controlling when using [`&controlobs`](and-controlobs.md) |

## Details

Added `&allowedscenes` as an option to filter which OBS scenes a remote guest has access to controlling when using [`&controlobs`](and-controlobs.md). Uses CSV to split up the scenes (avoid special characters in your scene names if there are issues)

Example: `vdo.ninja/alpha/?view=StreamID&remote&allowedscenes=Scene1,Scene2`

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
