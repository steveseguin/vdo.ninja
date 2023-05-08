---
description: >-
  Options for the &meshcast parameter like audio filters, bitrate, screen-share,
  codecs etc.
---

# Meshcast Parameters

**Meshcast Parameters** are specific to the [`&meshcast`](../../newly-added-parameters/and-meshcast.md) parameter. They are all parameters for the publisher's side ([`&push`](../../source-settings/push.md)) and have to be used together with [`&meshcast`](../../newly-added-parameters/and-meshcast.md).

| Parameter                                                                      | Explanation                                                                                        |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [`&meshcast`](../../newly-added-parameters/and-meshcast.md)                    | Triggers the service, causing the outbound audio/video stream to be transferred to a hosted server |
| [`&meshcastaudiobitrate`](and-meshcastaudiobitrate.md)                         | Option to change outbound audio bitrate of the `&meshcast` parameter                               |
| [`&meshcastbitrate`](../../meshcast-settings/and-meshcastbitrate.md)           | Option to change outbound video bitrate of the `&meshcast` parameter                               |
| [`&meshcastcodec`](../../meshcast-settings/and-meshcastcodec.md)               | Option to change codec of the `&meshcast` parameter                                                |
| [`&mcscreensharebitrate`](../../meshcast-settings/and-mcscreensharebitrate.md) | Option to change outbound screen-share video bitrate of the `&meshcast` parameter                  |
| [`&mcscreensharecodec`](../../meshcast-settings/and-mcscreensharecodec.md)     | Option to change codec of the `&meshcast` parameter while screen-sharing                           |
| [`&meshcastscale`](../upcoming-parameters/and-meshcastscale.md)                | Scales down the Meshcast video output via the URL                                                  |
