---
description: Same as &audiodevice or &videodevice, but applies to both
---

# \&device

Sender-Side Option! ([`&push`](push.md))

## Aliases

* `&d`

## Options

Example: `&device=Brio_4K`

<table><thead><tr><th width="187">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>0</code></td><td>disable the audio and video devices; no option to change it during setup is provided.</td></tr><tr><td><code>1</code></td><td>auto-select the default video and audio devices; no option to change it will be allowed.</td></tr><tr><td>(string value)</td><td>auto-select a video and audio device that has a label containing that same string; whitespaces in names can be replaced with underscores.</td></tr></tbody></table>

## Details

If you set `&device=0`, you disable audio and video inputs, but chat is still available.

Chat-only guests can access a group-room this way.

## Related

{% content-ref url="videodevice.md" %}
[videodevice.md](videodevice.md)
{% endcontent-ref %}

{% content-ref url="audiodevice.md" %}
[audiodevice.md](audiodevice.md)
{% endcontent-ref %}
