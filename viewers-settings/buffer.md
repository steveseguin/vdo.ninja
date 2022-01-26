---
description: Sets the video buffer
---

# \&buffer

## Options

| Value           | Description |
| --------------- | ----------- |
| (numeric value) | delay in ms |

## Details

{% hint style="warning" %}
This will only work if playing the video in Chrome or Chromium-based browsers of around version 80 and newer.\
\
OBS on PC uses v75 though, so it's not supported in OBS yet. OBS will support the buffer command in the future, but **currently it does not.**
{% endhint %}

`&buffer=0` will force the audio to be in sync with the video, with the video playing back with minimal delay.

Adding a buffer > \~ 100 will add a time delay to the video.\
Adding a buffer > \~ 100 can help reduce video problems, such as frame jitter.

Works well with the [Electron Capture](https://github.com/steveseguin/electroncapture) app.

{% hint style="info" %}
Using may stop Echo Cancellation from working.
{% endhint %}
