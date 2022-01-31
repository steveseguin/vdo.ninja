---
description: Allows remote operation of the zoom and focus, and access to statistics
---

# \&remote

{% hint style="info" %}
**Android** devices **only**!
{% endhint %}

## Aliases

* `&rem`

## Options

| Value                 | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| (some passcode value) | this string will have to match on both sides of the connection |

## Details

Must be enabled by both the sender and viewer with identical passcodes in order to work. This is a security precaution.  If you pass no value to `&remote`, it will still work, so long as both sides leave it blank.

In some ways, the `&remote` function gives permissions to a viewer that would otherwise be restricted to a director or the sender themselves.

A director of a room can remotely change focus/zoom of a participant without needing the `&remote` command. This applies to both the main director and any co-director, and that's accessible via their per-guest video settings options.

#### Remote Zooming using `&remote`

Use the mouse wheel over the video you wish to zoom in or out of as a viewer. The sender needs to support zoom, which often is limited to some webcams and Android devices.

#### Remote Focus using `&remote`

Remote focus may also work as well by holding `CTRL` (or Command) while using the mouse wheel.  The sender needs to support focus for this to work, which often is limited to some webcams and Android devices. It's sometime listed as "focus distance" in the senders video settings menu.

To check if a device supports zoom or focus, go to [https://obs.ninja/supports](https://obs.ninja/supports). It will show whether your browser and the selected camera supports focus/zoom.

If you are the one publishing with an Android device, you can hold the screen down and move your finger up or down to zoom in and out as well; you don't need a remote user or the settings menu to do this.

#### Remote Statistics using `&remote`

A bit less accessible, but using `&remote` also gives the viewer permission to request statistic information. The monitoring tool, also used by the VDO.Ninja speed-test, makes use of the `&remote` flag to remote access stats.

[https://vdo.ninja/monitor](https://vdo.ninja/monitor?sid=c95jhV3)
