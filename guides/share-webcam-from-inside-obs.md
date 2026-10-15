---
description: Share a webcam or OBS Virtual Camera through a VDO.Ninja dock inside OBS.
---

# How to share webcam from inside OBS

{% hint style="warning" %}
OBS 27.1.3 supports the dock setup below. If your OBS version cannot open a camera in the dock, use the [browser publishing guide](publish-from-obs-into-vdo.ninja.md).
{% endhint %}

## 1. Enable camera access for the dock

On Windows, right-click the OBS shortcut and open **Properties**. Add `--enable-media-stream` to **Target**, after the closing quotation mark:

```text
"C:\Program Files\obs-studio\bin\64bit\obs64.exe" --enable-media-stream
```

<figure><img src="../.gitbook/assets/image (112).png" alt="OBS shortcut properties with --enable-media-stream appended after the quoted executable path" width="485"><figcaption><p>Keep your existing OBS path. Add the flag outside its quotes, then restart OBS using this shortcut.</p></figcaption></figure>

## 2. Open VDO.Ninja in a browser dock

Add a custom browser dock using this URL:

```text
https://vdo.ninja/?webcam&vd=obs&ad=virtual&autostart&cover
```

It selects OBS Virtual Camera and a matching virtual audio cable, then starts publishing automatically. Start **OBS Virtual Camera** before opening the dock; see the [audio setup](share-obs-audio-with-vdo-ninja.md) to send sound through the cable.

## 3. Check the selected devices

For manual selection, leave `&autostart` out of the dock URL. Choose the devices, check the preview, and click **START**.

<figure><img src="../.gitbook/assets/obs-audio-guides/vdo-camera-and-audio.png" alt="VDO.Ninja device controls with OBS Virtual Camera and CABLE Output selected" width="494"><figcaption><p>Use OBS Virtual Camera for the picture and CABLE Output for the sound.</p></figcaption></figure>

Copy the resulting **view link** to your receiver. Keep the dock running, and keep its preview out of the OBS scene sent to Virtual Camera to avoid a repeating picture.

## Related

If OBS and the VDO.Ninja dock or browser source are competing for the same physical webcam, see [Camera already in use by OBS or VDO.Ninja](../common-errors-and-known-issues/cant-load-camera-both-in-obs-and-vdon.md).
