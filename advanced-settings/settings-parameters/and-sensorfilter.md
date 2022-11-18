---
description: >-
  An option to explicitly list what &sensor data you want to capture and
  transmit
---

# \&sensorfilter

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&sensorsfilter`
* `&filtersensor`
* `&filtersensors`

## Options

| Value  | Description   |
| ------ | ------------- |
| `gyro` | gyroscopic    |
| `lin`  | -             |
| `acc`  | accelerometer |
| `mag`  | magnetometer  |
| `pos`  | -             |
| `ori`  | -             |

## Details

Added a new option to explicitly list what sensor data you want to capture and transmit, when using [`&sensor`](../../source-settings/sensor.md)`&sensorfilter=gyro,lin,acc,mag,pos,ori`. For the above demo, you can use `&sensorfilter=pos,lin` to just send the data you need, reducing the load on the phone/network.

## Related

{% content-ref url="../../source-settings/sensor.md" %}
[sensor.md](../../source-settings/sensor.md)
{% endcontent-ref %}
