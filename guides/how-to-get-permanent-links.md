# How to get permanent links

If you connect with the "`?push=xxxx`" URL parameter set, you essentially are telling the system what you want the 'view=' ID to be.

As long as it is not already in use, you can publish to that 'view=' ID. If the connection fails and does not reconnect automatically, just refresh the page and it will try to connect again.

A [`&push`](../source-settings/push.md) ID can be up to around 40-characters in length. You can also label your streams with [`&label`](../general-settings/label.md) to make it easier to identify them in OBS. [`&showlabels`](../general-settings/showlabels.md) will then show those labels via a video overlay if you want it to.

Also there is a hack to create a reusable custom URL. If you open the the Generate Link box and then click on the Invite Link (just above the QR) to open it, you will get a link in the address bar that looks something like this: [https://OBS.Ninja/?push=fH6iAk2](https://obs.ninja/?push=fH6iAk2), you can then manually change the code to something more memorable for you needs, like [https://OBS.Ninja/?push=davesOBScamear](https://obs.ninja/?push=davesOBScamear). Then you can use the custom link to add a camera or screenshare.

The best part of this is that you can put this custom link in your OBS or OBS Streamlab (the 'view=' version, aka [https://OBS.Ninja/?view=davesOBScamear](https://obs.ninja/?view=davesOBScamear) and reuse it as many times as you like, providing no one else creates the same link while you are not using it. This is very nice for setting up templates in OBS.
