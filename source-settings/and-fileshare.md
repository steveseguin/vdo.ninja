---
description: Allows the user to select a video or audio file as a source for streaming
---

# \&fileshare

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&fs`

## Details

Adding `&fileshare` to a URL allows the user to select a video or audio file as a source for streaming.

The stream can be paused and scrubbed like a normal video/audio file. It will auto-loop when it ends.

Supports audio-only files as well as common video formats. Depends on your browser. If you mute the video, it will mute the video for all the viewers as well. It is extremely simple in functionality and is only available when the URL is used. The resolution used will be limited by the video's native resolution.

{% hint style="warning" %}
The video will be **transcoded for each** connected **guest**!
{% endhint %}

<figure><img src="../.gitbook/assets/image (5) (1) (1).png" alt=""><figcaption></figcaption></figure>
