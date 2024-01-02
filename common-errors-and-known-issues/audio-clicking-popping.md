# Audio Clicking / Popping

Bluetooth microphones can cause clicking/popping.

[VDO.Ninja](https://vdo.ninja/) uses 48kHz audio (48000hz), so any software you are using with VDO.Ninja should ideally also use 48-KHz. If using a different sample rate, the browser or app will try to convert it as needed, but this doesn't always go smoothly. Very high sample rates are especially troublesome on some systems, so having your system be end-to-end setup in 48khz audio is suggested and reduce any additional audio processing overhead.

If using any virtual audio cables or pro audio gear, try to increase the audio buffer packet sizes, as buffer-under issues can cause audio distortion. Too small an audio buffer on some mic preamps or virtual audio cables can lead to clicking or distortion.

Having the playback audio device and the microphone capture device set to 48000hz, and no more than 24-bit, is recommended. You can adjust these settings in the Windows audio settings. Devices like a FiiO DAC can sometimes have the audio sample rate be very high, and that can cause buffer underruns and clicking problems.\
\
Restarting OBS or addressing heavy CPU load may also help prevent buffer underruns, which sometimes appear in the OBS logs as a max buffer reached error.  Make sure the computer isn't running near 100% load to ensure it's not just overloaded. &#x20;

As well, starting OBS Studio in admin mode can also fix issues with audio as well, as the system might be otherwise running OBS in some form of low-powered efficiency mode. \
\
Some surround sound headphones, like those by Logitech, can also cause audio problems; robotic noises, distortion, etc. Disabling surround sound mode often fixes such issues.

If using a MacOS system, ensure your computer is plugged into the power outlet and not on battery power. Systems running on batteries can sometimes have issues.

Consider reducing the resolution and bitrate of videos, as this can help free up CPU load. An overloaded system could perhaps stress the audio encoder/decoder pipeline out.

Do not use Wi-Fi if streaming high-quality music; packet loss can cause clipping. Use wired Ethernet on both ends of the connection instead.

For either the sender or viewer of a stream, make sure you are not using up more than \~80% of your total upload bandwidth. Using 100% of your bandwidth will cause packets to stall and possibly be skipped, leading to missed frames and audio clicking.

\
If dealing with audio distortion or robotic voices, sample rates of the system



You can also try adding some URL parameters to the viewer and sender linkes to see if it helps. A few parameters to try that might help are the following:\
[`&noaudioprocessing`](../general-settings/noaudioprocessing.md)\
[`&samplerate=48000`](../advanced-settings/view-parameters/and-samplerate.md)\
[`&micsamplerate=48000`](../other-parameters.md)
