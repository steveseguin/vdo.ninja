---
description: >-
  The ability for VDO.Ninja to Remotely Control OBS Studio while
  streaming/directing
---

# \&controlobs

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Aliases

* `&obscontrols`
* `&remoteobs`
* `&obsremote`
* `&obs`

## Remotely Control OBS Studio

Added the ability for VDO.Ninja to **Remotely Control OBS Studio** while streaming/directing. It may be useful for [IRL streaming](https://restream.io/blog/irl-streaming-ultimate-guide/)?

The menu button to control OBS auto-shows in the director's view or push-mode, if OBS Studio is set to give VDO.Ninja "full" permissions.

![](<../../.gitbook/assets/image (103).png>)

The menu button can also be added manually, for even guests, using `&controlobs`. [`&obsoff`](../design-parameters/and-obsoff.md) can be used to set permissions to fully off (also disables tally light and scene optimizations tho) when added to the OBS browser source link.

The OBS instance still needs [`&remote=optional-passcode-here`](../../general-settings/remote.md) added to the URL for remote commands to work. If [`&remote`](../../general-settings/remote.md) is left blank, it gives anyone permissions to control it. If a value is passed to [`&remote`](../../general-settings/remote.md), the sender needs to have a matching [`&remote` ](../../general-settings/remote.md)value or they need to manually enter the passcode in the pop up control menu.

![](<../../.gitbook/assets/image (105).png>)

If the OBS browser source has its permissions set to something other than full (lower than level 5), the control menu will still show what info it has -- current scene, recording/streaming state, etc; depending on level. The lower the level, the less info is available to show. It can't remotely change anything though.

It supports multiple OBS instances and will label them according to the [`&label=xxx`](../../general-settings/label.md) value set on the scene/view link, or whatever the unique connection ID is.

## How to set it up (example)

1\. Add a browser source to OBS Studio with this URL:\
`https://vdo.ninja/alpha/?view=streamid12345&remote&controlobs`

2\. Give page permissions to the browser source (Full access to OBS) like on the image below\
![](<../../.gitbook/assets/image (111).png>)

3\. Open this Push Link: [https://vdo.ninja/alpha/?push=streamid12345\&wc\&as\&controlobs\&remote](https://vdo.ninja/alpha/?push=streamid12345\&wc\&as\&controlobs\&remote)

4\. Click on this button\
![](<../../.gitbook/assets/image (118).png>)

5\. Control OBS Studio remotely via VDO.Ninja

## Related

{% content-ref url="../../general-settings/remote.md" %}
[remote.md](../../general-settings/remote.md)
{% endcontent-ref %}

{% content-ref url="../design-parameters/and-obsoff.md" %}
[and-obsoff.md](../design-parameters/and-obsoff.md)
{% endcontent-ref %}
