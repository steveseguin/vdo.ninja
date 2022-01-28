# Low frame rates

There are several reasons you may be experiencing low frame rates, including:

* If you are on MacOS using StreamLabs OBS, then the frame rates will be bad because of a bug in StreamLabs for Mac (consider the Electron Capture app instead).
* Try switching on "Enable Browser Source Hardware Acceleration" on in Advanced settings of OBS.
* If you are using Cellular / 4G, then the quality of the video may be poor due to the TURN server being in the USA or overloaded.
* Lights in your room are too dim maybe; try to make your room much brighter.
* Resolution is set to high, so selecting a lower resolution might help. This is especially true for H264 streams.
* Your Internet may be very slow or unstable. Try maybe Speedify.com and DO NOT use Wi-Fi.
* Make sure your CPU is not running near 100%. An overloaded computer or network will lag.
* Lower the resolution of OBS Ninja; select "Smooth and Cool" or 640x360 during camera selection.

Regardless, putting your own version of the HTML server up will not make it any faster.

To debug what the issue is, determine if it is faster when going from Chrome tab to Chrome tab on the same computer. If not, then it is nothing to do with servers.

If you are using a Mac with StreamLabs, you might be better off using the [Electron Capture app](https://github.com/steveseguin/electroncapture) instead.
