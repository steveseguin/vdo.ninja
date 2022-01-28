# Audio Clicking / Popping

Bluetooth microphones can cause clicking/popping.

[VDO.Ninja](https://vdo.ninja) uses 48kHz audio (48000hz), so any software you connect should also use 48-KHz.

If you have the option with any software being connected, increase the buffer size of your audio pipeline.

If using a macOS system, ensure your computer is plugged into the power outlet and not on battery power.

Consider reducing the resolution and bitrate of videos, as this can help free up CPU load.

Do not use Wi-Fi if streaming high-quality music; packet loss can cause clipping. Use wired Ethernet on both ends of the connection instead.

For either the sender or viewer of a stream, make sure you are not using up more than \~80% of your total upload bandwidth. Using 100% of your bandwidth will cause packets to stall and possibly be skipped, leading to missed frames and audio clicking
