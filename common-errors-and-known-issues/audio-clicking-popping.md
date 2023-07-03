# Audio Clicking / Popping

Bluetooth microphones can cause clicking/popping.

[VDO.Ninja](https://vdo.ninja/) uses 48kHz audio (48000hz), so any software you connect should also use 48-KHz.  Sometimes odd sample rates or very high sample rates can cause issues with VDO.Ninja.

If you have the option with any software being connected, increase the buffer size of your audio pipeline. Virtual audio cables can have buffer-under issues, causing audio distortion, and using different audio cables or increasing the buffer within that software can help.

If using a macOS system, ensure your computer is plugged into the power outlet and not on battery power.  Systems running on batteries can sometimes have issues.

Consider reducing the resolution and bitrate of videos, as this can help free up CPU load. An overloaded system could perhaps stress the audio encoder/decoder pipeilne out.

Do not use Wi-Fi if streaming high-quality music; packet loss can cause clipping. Use wired Ethernet on both ends of the connection instead.

For either the sender or viewer of a stream, make sure you are not using up more than \~80% of your total upload bandwidth. Using 100% of your bandwidth will cause packets to stall and possibly be skipped, leading to missed frames and audio clicking\
\
You can also try adding some URL parameters to the viewer and sender linkes to see if it helps. A few parameters to try are the following\
\
\&noap\
`&samplerate=48000`\
`&micsamplerate=48000`
