# Use the green screen just locally

Since OBS is using a very old browser inside, the green screen effect inside [VDO.Ninja](https://vdo.ninja/) wouldn't really run well within OBS itself, and even if it did, accessing the camera from a browser-source is a hassle to setup.

&#x20;What you could do though is use the Electron Capture app, and then just window capture the local preview output. You can hide the interface UI and access any camera/microphone changes via the Electron Capture's right-click context menu of options instead.

Electron download link: [https://github.com/steveseguin/electroncapture/releases](https://github.com/steveseguin/electroncapture/releases)\
\
Getting this working is not complex; pretty easy once you do it once actually. Sample URL to enter into VDO.Ninja:

``[`https://vdo.ninja/?cleanoutput&webcam&effects=4`](https://vdo.ninja/?cleanoutput\&webcam\&effects=4)``

![](<../.gitbook/assets/image (32).png>)

Cheers.
