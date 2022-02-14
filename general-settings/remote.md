---
description: Allows remote operation of the zoom and focus, and access to statistics
---

# \&remote

## Aliases

* `&rem`

## Options

| Value                 | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| (some passcode value) | this string will have to match on both sides of the connection |

## Details

{% hint style="info" %}
**Android** devices **only**!
{% endhint %}

Must be enabled by both the sender and viewer with identical passcodes in order to work. This is a security precaution. If you pass no value to `&remote`, it will still work, so long as both sides leave it blank.

In some ways, the `&remote` function gives permissions to a viewer that would otherwise be restricted to a director or the sender themselves.

A director of a room can remotely change focus/zoom of a participant without needing the `&remote` command. This applies to both the main director and any co-director, and that's accessible via their per-guest video settings options.

### Remote Zooming using `&remote`

Use the mouse wheel over the video you wish to zoom in or out of as a viewer. The sender needs to support zoom, which often is limited to some webcams and Android devices.

### Remote Focus using `&remote`

Remote focus may also work as well by holding `CTRL` (or Command) while using the mouse wheel.  The sender needs to support focus for this to work, which often is limited to some webcams and Android devices. It's sometime listed as "focus distance" in the senders video settings menu.

To check if a device supports zoom or focus, go to [https://vdo.ninja/supports](https://vdo.ninja/supports). It will show whether your browser and the selected camera supports focus/zoom.

If you are the one publishing with an Android device, you can hold the screen down and move your finger up or down to zoom in and out as well; you don't need a remote user or the settings menu to do this.

### Remote Statistics using `&remote`

A bit less accessible, but using `&remote` also gives the viewer permission to request statistic information. The monitoring tool, also used by the VDO.Ninja speed-test, makes use of the `&remote` flag to remote access stats.

[https://vdo.ninja/monitor](https://vdo.ninja/monitor)

Example usage:\
``\
``Monitoring Link: `https://vdo.ninja/monitor?sid=BaGpHmu,stevetest123`

![](<../.gitbook/assets/image (39).png>)

It will pull statistics data from the sender of a video stream and visualize it, allowing for remote monitoring of stream quality. For this command to work though, the publisher needs to add `&remote` to their URL to allow for remote access.\
\
This reason for needing `&remote` is privacy related, as the statistical information being shared with the monitor page could include information like browser or system data of remote viewers unconnected to the monitoring user. While likely unneeded, adding `&remote=somePassword` to both the monitoring and push links will further increase security with a password check.

The VDO.Ninja speed test ([`https://vdo.ninja/speedtest`](https://vdo.ninja/speedtest)) has a link at the bottom of the page, which is all already configured to provide remote monitoring of speed test results without needing to play with any parameters or settings.

In regards to `&sid`, you can pass multiple stream IDs, and so long as each remote sender of that stream ID has `&remote` added to their URL, the monitoring page will be able to monitor all those outbound streams.

Nacks per second is similar to packet loss, and so a high nack loss rate implies a restriction on network quality.  "quality limitation reason" may also be stated, which can imply whether the CPU or Network is the bottleneck in achieving maximum quality.

If viewers of a stream ID being monitor have a label assigned ([`&label`](../advanced-settings/setup-parameters/label.md)), then that will appear as a label on the monitor page besides the graph, identifying it.
