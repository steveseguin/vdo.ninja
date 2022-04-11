---
description: OpenH264 software encoding will be used
---

# \&h264profile

Viewer-Side Option! ([`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md), [`&room`](../general-settings/room.md))

## Options

| Value                        | Description                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| (no value given)             | disables hardware h264 encoding -> OpenH264 software encoding will be used, if H264 is used     |
| 42e01f                       | advanced users can also pass a 6-character h264 profile ID to the parameter to get used instead |
| 0 \| false \| off \| default | has the h264 profile be left as the default browser default when the sender is an android       |

## Details

`&h264profile` is added to the viewer-side to tweak the h264 profile type. Use it as is if you wish to disable hardware h264 encoding, for example. Instead, OpenH264 software encoding will be used, if H264 is used.

Open264 software encoding can actually use less CPU than the Windows-selected hardware encoder, and in some cases will suffer from less video glitching.\
\
Advanced users can also pass a 6-character h264 profile ID to the parameter to get used instead. This flag will not force H264 to be used, but rather configures it in case h264 gets used. You can still use [`&codec`](../advanced-settings/view-parameters/codec.md) to set the codec to h264.\
\
Example: `https://vdo.ninja/?view=xxxxxxx&h264profile=42e01f&codec=h264`

![](https://lh5.googleusercontent.com/sITY54EgMFJiM2nX7QXOjd645PKQv\_xktwsSUg1QVyvdpxJ9hLRuv0iyOQiL4nHw0dDYklKKp8bqh5F3jFh8prq9foPjaEZmv\_se\_bEwzhECGUDjTYHCJvbaw\_eve8Xs3T5\_7fxf)

## Related

{% content-ref url="../advanced-settings/view-parameters/codec.md" %}
[codec.md](../advanced-settings/view-parameters/codec.md)
{% endcontent-ref %}
