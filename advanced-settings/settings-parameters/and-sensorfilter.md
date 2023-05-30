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

Example: `&sensorfilter=gyro`

<table><thead><tr><th width="232">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>gyro</code></td><td>gyroscopic</td></tr><tr><td><code>lin</code></td><td>-</td></tr><tr><td><code>acc</code></td><td>accelerometer</td></tr><tr><td><code>mag</code></td><td>magnetometer</td></tr><tr><td><code>pos</code></td><td>-</td></tr><tr><td><code>ori</code></td><td>-</td></tr></tbody></table>

## Details

Added a new option to explicitly list what sensor data you want to capture and transmit, when using [`&sensor`](../../source-settings/sensor.md)`&sensorfilter=gyro,lin,acc,mag,pos,ori`. For the above demo, you can use `&sensorfilter=pos,lin` to just send the data you need, reducing the load on the phone/network.

## Related

{% content-ref url="../../source-settings/sensor.md" %}
[sensor.md](../../source-settings/sensor.md)
{% endcontent-ref %}
