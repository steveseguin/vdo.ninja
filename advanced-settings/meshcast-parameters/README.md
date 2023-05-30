---
description: >-
  Options for the &meshcast parameter like audio filters, bitrate, screen-share,
  codecs etc.
---

# Meshcast Parameters

**Meshcast Parameters** are specific to the [`&meshcast`](../../newly-added-parameters/and-meshcast.md) parameter. They are all parameters for the publisher's side ([`&push`](../../source-settings/push.md)) and have to be used together with [`&meshcast`](../../newly-added-parameters/and-meshcast.md).

## Source side options

<table><thead><tr><th width="307.57142857142856">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="../../newly-added-parameters/and-meshcast.md"><code>&#x26;meshcast</code></a></td><td>Triggers the service, causing the outbound audio/video stream to be transferred to a hosted server</td></tr><tr><td><a href="and-meshcastaudiobitrate.md"><code>&#x26;meshcastaudiobitrate</code></a></td><td>Option to change outbound audio bitrate of the <code>&#x26;meshcast</code> parameter</td></tr><tr><td><a href="../../meshcast-settings/and-meshcastbitrate.md"><code>&#x26;meshcastbitrate</code></a></td><td>Option to change outbound video bitrate of the <code>&#x26;meshcast</code> parameter</td></tr><tr><td><a href="../../meshcast-settings/and-meshcastcodec.md"><code>&#x26;meshcastcodec</code></a></td><td>Option to change codec of the <code>&#x26;meshcast</code> parameter</td></tr><tr><td><a href="../../meshcast-settings/and-mcscreensharebitrate.md"><code>&#x26;mcscreensharebitrate</code></a></td><td>Option to change outbound screen-share video bitrate of the <code>&#x26;meshcast</code> parameter</td></tr><tr><td><a href="../../meshcast-settings/and-mcscreensharecodec.md"><code>&#x26;mcscreensharecodec</code></a></td><td>Option to change codec of the <code>&#x26;meshcast</code> parameter while screen-sharing</td></tr><tr><td><a href="../upcoming-parameters/and-meshcastscale.md"><code>&#x26;meshcastscale</code></a></td><td>Scales down the Meshcast video output via the URL</td></tr></tbody></table>

## **Viewer side options**

<table><thead><tr><th width="310.57142857142856">Parameter</th><th>Explanation</th></tr></thead><tbody><tr><td><a href="and-nomeshcast.md"><code>&#x26;nomeshcast</code></a> (alpha)</td><td>Tells a sender to provide a p2p stream, rather than a Meshcast stream</td></tr></tbody></table>
