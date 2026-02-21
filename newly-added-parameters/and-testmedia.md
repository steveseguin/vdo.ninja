---
description: Synthetic camera/microphone media for automation and test workflows
---

# \&testmedia

Source-Side Option! ([`&push`](../source-settings/push.md), [`&room`](../general-settings/room.md), [`&director`](../viewers-settings/director.md))

## Aliases

* `&syntheticmedia`

## Options

Example: `&testmedia=1`

<table><thead><tr><th width="220">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>1</code> / (no value)</td><td>Enable synthetic video + audio capture</td></tr><tr><td><code>audio</code> / <code>mic</code> / <code>a</code></td><td>Enable synthetic audio-only capture</td></tr><tr><td><code>video</code> / <code>cam</code> / <code>v</code></td><td>Enable synthetic video-only capture</td></tr><tr><td><code>0</code> / <code>false</code> / <code>off</code> / <code>no</code></td><td>Disable synthetic capture</td></tr></tbody></table>

## Details

`&testmedia` replaces normal `getUserMedia` camera/microphone capture with generated media (canvas video and synthetic tone audio). This is mainly intended for CI, automation, and reproducible QA testing.

When enabled, this mode can avoid failures caused by missing hardware devices in headless or virtual environments.

### Tuning flags

You can tune synthetic media with these optional parameters:

* `&testaudio=0|1` to disable/enable synthetic audio explicitly
* `&testvideo=0|1` to disable/enable synthetic video explicitly
* `&testfps=<1..60>` to set generated video frame rate
* `&testwidth=<160..3840>` to set generated video width
* `&testheight=<120..2160>` to set generated video height
* `&testtone=<50..2000>` to set synthetic audio tone frequency (Hz)

If both `&testaudio=0` and `&testvideo=0` are set, audio will be re-enabled automatically as a fallback.

## Examples

Basic synthetic AV:

`https://vdo.ninja/?push=stream123&testmedia=1`

Audio-only synthetic capture:

`https://vdo.ninja/?push=stream123&testmedia=audio`

Custom synthetic profile:

`https://vdo.ninja/?push=stream123&testmedia=1&testfps=30&testwidth=1280&testheight=720&testtone=440`

## Related

{% content-ref url="and-chunked.md" %}
[and-chunked.md](and-chunked.md)
{% endcontent-ref %}

