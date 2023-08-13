---
description: >-
  Specifies an OBS cut scene to switch to when the bitrate drops below a
  threshold
---

# \&cutscene

Viewer-Side Option! ([`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&room`](../../general-settings/room.md))

## Aliases

* `&lowbitratescene`

## Options

Example: `&cutscene=ObsSceneName`

| Value            | Description               |
| ---------------- | ------------------------- |
| (OBS scene name) | The name of the OBS scene |

## Details

You can use the IRL-related command called `&cutscene` to specify an OBS cut scene to switch to when the bitrate drops below a threshold and return to the original scene when the bitrate recovers. (assuming the cut scene is active; it won't switch back from a scene that isn't the cut away scene)

The default bitrate threshold is 300-kbps, but you can use the existing [`&bitratecutoff=N`](../parameters-only-on-beta/and-bitratecutoff.md) option to specify a custom one. Using `&cutscene` with [`&bitratecutoff`](../parameters-only-on-beta/and-bitratecutoff.md) will override the behaviour of [`&bitratecutoff`](../parameters-only-on-beta/and-bitratecutoff.md)'s other features. It won't start triggering until the bitrate has hit at least the threshold once. to use:

```
https://vdo.ninja/?push=XXX
https://vdo.ninja/?view=XXX&controlobs&bitratecutoff=300&cutscene=FML&remote
```

You can of course use this with [`&controlobs`](and-controlobs.md)[`&remote`](../../general-settings/remote.md), to have the publisher change the scenes dynamically, and see what the current OBS scene is (if still connected).

{% hint style="warning" %}
Note that the OBS browser source needs the permissions to be set to high, to give VDO.Ninja permissions to change scenes.
{% endhint %}

{% hint style="warning" %}
Do not set the OBS browser source to "Shutdown" when not visible, as this will prevent things from being able to switch back.
{% endhint %}

## Related

{% content-ref url="../parameters-only-on-beta/and-bitratecutoff.md" %}
[and-bitratecutoff.md](../parameters-only-on-beta/and-bitratecutoff.md)
{% endcontent-ref %}

{% content-ref url="and-controlobs.md" %}
[and-controlobs.md](and-controlobs.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/remote.md" %}
[remote.md](../../general-settings/remote.md)
{% endcontent-ref %}
