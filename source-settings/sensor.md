---
description: Access device sensor data at given rate
---

# \&sensor

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&sensors`
* `&gyro`
* `&gyros`
* `&accelerometer`

## Options

| Value           | Description                                           |
| --------------- | ----------------------------------------------------- |
| (integer value) | Set polling rate to given value, in hz. Default 30hz. |

## Details

Gyroscopic, accelerometer, magnetometer data can be pushed out.

Enable with `&sensor=30` (30hz).\
Results show up in the remote stats log or the remote IFRAME API.

Useful for VR live streaming support, where you want to capture a smartphone's movement, as well as video.\
\
Support will vary from device to device; please report problems or reach out for requests.

#### Update 22/06/02

`&sensor` now also includes speed and altitude data.&#x20;

Added a demo/sample on how to overlay speed + acceleration on top of video playback (compatible with a mobile phone sender)

[https://vdo.ninja/examples/sensoroverlay?view=STREAMID](https://vdo.ninja/examples/sensoroverlay?view=STREAMID)

{% embed url="https://www.youtube.com/watch?v=SqbufszHKi4" %}

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-sensorfilter.md" %}
[and-sensorfilter.md](../advanced-settings/settings-parameters/and-sensorfilter.md)
{% endcontent-ref %}
