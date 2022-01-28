---
description: >-
  Sets the stream ID that will be reviews on the remote monitoring statistics
  page
---

# \&sid

## Aliases

* `&view`

## Options

| Value          | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| (string value) | The stream ID to view; can be a comma-separated list of IDs |

## Details

This option is specific to to the remote monitoring page. Example usage:\
\
[`https://vdo.ninja/monitor?sid=BaGpHm,stevetest123`](https://vdo.ninja/monitor?sid=BaGpHmu)

![](<../.gitbook/assets/image (39).png>)

It will pull statistics data from the sender of a video stream and visualize it, allowing for remote monitoring of stream quality. For this command to work though, the publisher needs to add [`&remote`](../general-settings/remote.md) to their URL to allow for remote access.\
\
This reason for needing `&remote` is privacy related, as the statistical information being shared with the monitor page could include information like browser or system data of remote viewers unconnected to the monitoring user. While likely unneeded, adding `&remote=somePassword` to both the monitoring and push links will further increase security with a password check.

The VDO.NInja speed test (`https://vdo.ninja/speedtest`) has a link at the bottom of the page, which is all already configured to provide remote monitoring of speed test results without needing to play with any parameters or settings.

In regards to `&sid`, you can pass multiple stream IDs, and so long as each remote sender of that stream ID has `&remote` added to their URL, the monitoring page will be able to monitor all those outbound streams.

Nacks per second is similar to packet loss, and so a high nack loss rate implies a restriction on network quality.  "quality limitation reason" may also be stated, which can imply whether the CPU or Network is the bottleneck in achieving maximum quality.

If viewers of a stream ID being monitor have a label assigned ([`&label`](../general-settings/label.md)), then that will appear as a label on the monitor page besides the graph, identifying it.
