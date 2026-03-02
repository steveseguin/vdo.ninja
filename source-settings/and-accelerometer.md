---
description: Reference for the &accelerometer URL parameter in VDO.Ninja including behavior examples and related options.
---

# &accelerometer

**Also known as:** `&sensors`, `&sensor`, `&gyro`, `&gyros`

#### **Description**

Enables device motion and orientation sensor data transmission, allowing real-time sharing of accelerometer, gyroscope, and other sensor information.

#### **Sender-Side Option**

This parameter activates sensor data collection and transmission from devices that support motion sensors.

#### **Usage**

* **`&accelerometer`** - Enable at default rate (30 Hz)
* **`&accelerometer=60`** - Enable at 60 Hz update rate
* **`&sensor=10`** - Enable at 10 Hz update rate
* **`&gyro=30`** - Alias usage

#### **Examples**

```
https://vdo.ninja/?push=streamID&accelerometer
https://vdo.ninja/?push=streamID&sensor=60
https://vdo.ninja/?room=roomname&gyro=30
```

#### **Sensor Data Included**

* **Accelerometer**: Linear acceleration (x, y, z)
* **Gyroscope**: Rotational velocity
* **Orientation**: Device orientation in space
* **Magnetometer**: Compass heading (if available)
* **Linear Acceleration**: Acceleration without gravity
* **Absolute Orientation**: Quaternion orientation

#### **Update Rates**

* **Default**: 30 Hz (30 updates per second)
* **Minimum**: 1 Hz
* **Maximum**: 60 Hz (device dependent)
* **Recommended**: 10-30 Hz for most applications

#### **Device Support**

* **Smartphones**: Full support (iOS/Android)
* **Tablets**: Full support
* **Laptops**: Limited (some have accelerometers)
* **Desktop**: Usually no sensors

#### **Browser Requirements**

* Requires HTTPS connection
* User permission required
* Not all browsers support all sensors

#### **Data Format**

Sensor data is transmitted as structured data containing:
- Timestamp
- Sensor type
- X, Y, Z values
- Additional sensor-specific data

#### **Use Cases**

* Motion-controlled applications
* VR/AR experiences
* Game controllers
* Motion analysis
* Remote device monitoring
* Interactive presentations

#### **Performance Notes**

* Higher rates increase bandwidth usage
* Can impact battery life on mobile
* May affect device performance
* Consider network latency

#### **Privacy Considerations**

* Requires explicit user permission
* Can reveal device movement patterns
* May be disabled by privacy settings
* Use responsibly

#### **Related Parameters**

* [`&sensorfilter`](../settings-parameters/and-sensorfilter.md) - Filter specific sensors
* [`&remote`](../general-settings/remote.md) - Remote control features
* [`&ptz`](ptz.md) - Pan-tilt-zoom control
* [`&api`](../general-settings/api.md) - API for sensor data access