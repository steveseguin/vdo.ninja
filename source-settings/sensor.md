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

{% embed url="https://www.youtube.com/watch?v=SqbufszHKi4" %}
