---
description: >-
  An ordered array of layouts, which can be used to switch between using the API
  layouts action
---

# \&layouts

Director Option! ([`&director`](../../viewers-settings/director.md))

## Options

Example: `&layouts=[[{"x":0,"y":0,"w":100,"h":100,"slot":0}],[{"x":0,"y":0,"w":100,"h":100,"slot":1}],[{"x":0,"y":0,"w":100,"h":100,"slot":2}],[{"x":0,"y":0,"w":100,"h":100,"slot":3}],[{"x":0,"y":0,"w":50,"h":100,"c":false,"slot":0},{"x":50,"y":0,"w":50,"h":100,"c":false,"slot":1}],[{"x":0,"y":0,"w":100,"h":100,"z":0,"c":false,"slot":1},{"x":70,"y":70,"w":30,"h":30,"z":1,"c":true,"slot":0}],[{"x":0,"y":0,"w":50,"h":50,"c":true,"slot":0},{"x":50,"y":0,"w":50,"h":50,"c":true,"slot":1},{"x":0,"y":50,"w":50,"h":50,"c":true,"slot":2},{"x":50,"y":50,"w":50,"h":50,"c":true,"slot":3}],[{"x":0,"y":16.667,"w":66.667,"h":66.667,"c":true,"slot":0},{"x":66.667,"y":0,"w":33.333,"h":33.333,"c":true,"slot":1},{"x":66.667,"y":33.333,"w":33.333,"h":33.333,"c":true,"slot":2},{"x":66.667,"y":66.667,"w":33.333,"h":33.333,"c":true,"slot":3}]]`

<table><thead><tr><th width="241">Value</th><th>Description</th></tr></thead><tbody><tr><td>[layout1,layout2,...]</td><td>(URL-encoded ordered array)</td></tr></tbody></table>

## Details

`&layouts=[[{xxxxxx}]]` is a URL parameter option, where you can pass a set of different layouts (as a URL-encoded ordered array) to VDO.Ninja.

This is akin to using the [vdo.ninja/mixer](https://vdo.ninja/mixer), to visually set layouts, but instead you are just manually setting all the available layouts directly, bypassing the mixer app.

Once you have set the layouts, the "layout" [API](../../general-settings/api.md) feature becomes a bit more useful, as you can remotely activate any of those layouts with a simple API command.

I documented the 'layout' API option a bit here, but the tl;dr; is that you can either use this API call to set a layout from within the array of layouts that are set, or you can pass a full-fledge layout-object, for on-the-fly custom layouts.

ie: `{action:'layout',value':5}` or `{action:'layout',value':[{xxxx.layout-stuff-here.xxxx]]}`

fyi, the layout and the API in general work with the [vdo.ninja/mixer](https://vdo.ninja/mixer) page, so you can use it to create the layouts, and then manually switch between them via the API. The API is streamdeck-friendly.

{% embed url="https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#custom-layout-switching-" %}

You can assign guests to custom slots when using [`&slotmode`](and-slotmode.md) on the director's URL.

<figure><img src="../../.gitbook/assets/image (5) (1) (4).png" alt=""><figcaption></figcaption></figure>

### URL example

[https://vdo.ninja/?director=roomname\&slotmode\&api=xxx\&layouts=\[\[{"x":0,"y":0,"w":100,"h":100,"slot":0}\],\[{"x":0,"y":0,"w":100,"h":100,"slot":1}\],\[{"x":0,"y":0,"w":100,"h":100,"slot":2}\],\[{"x":0,"y":0,"w":100,"h":100,"slot":3}\],\[{"x":0,"y":0,"w":50,"h":100,"c":false,"slot":0},{"x":50,"y":0,"w":50,"h":100,"c":false,"slot":1}\],\[{"x":0,"y":0,"w":100,"h":100,"z":0,"c":false,"slot":1},{"x":70,"y":70,"w":30,"h":30,"z":1,"c":true,"slot":0}\],\[{"x":0,"y":0,"w":50,"h":50,"c":true,"slot":0},{"x":50,"y":0,"w":50,"h":50,"c":true,"slot":1},{"x":0,"y":50,"w":50,"h":50,"c":true,"slot":2},{"x":50,"y":50,"w":50,"h":50,"c":true,"slot":3}\],\[{"x":0,"y":16.667,"w":66.667,"h":66.667,"c":true,"slot":0},{"x":66.667,"y":0,"w":33.333,"h":33.333,"c":true,"slot":1},{"x":66.667,"y":33.333,"w":33.333,"h":33.333,"c":true,"slot":2},{"x":66.667,"y":66.667,"w":33.333,"h":33.333,"c":true,"slot":3}\]\]](https://vdo.ninja/?director=roomname\&slotmode\&api=xxx\&layouts=\[\[\{%22x%22:0,%22y%22:0,%22w%22:100,%22h%22:100,%22slot%22:0}],\[\{%22x%22:0,%22y%22:0,%22w%22:100,%22h%22:100,%22slot%22:1}],\[\{%22x%22:0,%22y%22:0,%22w%22:100,%22h%22:100,%22slot%22:2}],\[\{%22x%22:0,%22y%22:0,%22w%22:100,%22h%22:100,%22slot%22:3}],\[\{%22x%22:0,%22y%22:0,%22w%22:50,%22h%22:100,%22c%22:false,%22slot%22:0},\{%22x%22:50,%22y%22:0,%22w%22:50,%22h%22:100,%22c%22:false,%22slot%22:1}],\[\{%22x%22:0,%22y%22:0,%22w%22:100,%22h%22:100,%22z%22:0,%22c%22:false,%22slot%22:1},\{%22x%22:70,%22y%22:70,%22w%22:30,%22h%22:30,%22z%22:1,%22c%22:true,%22slot%22:0}],\[\{%22x%22:0,%22y%22:0,%22w%22:50,%22h%22:50,%22c%22:true,%22slot%22:0},\{%22x%22:50,%22y%22:0,%22w%22:50,%22h%22:50,%22c%22:true,%22slot%22:1},\{%22x%22:0,%22y%22:50,%22w%22:50,%22h%22:50,%22c%22:true,%22slot%22:2},\{%22x%22:50,%22y%22:50,%22w%22:50,%22h%22:50,%22c%22:true,%22slot%22:3}],\[\{%22x%22:0,%22y%22:16.667,%22w%22:66.667,%22h%22:66.667,%22c%22:true,%22slot%22:0},\{%22x%22:66.667,%22y%22:0,%22w%22:33.333,%22h%22:33.333,%22c%22:true,%22slot%22:1},\{%22x%22:66.667,%22y%22:33.333,%22w%22:33.333,%22h%22:33.333,%22c%22:true,%22slot%22:2},\{%22x%22:66.667,%22y%22:66.667,%22w%22:33.333,%22h%22:33.333,%22c%22:true,%22slot%22:3}]])

`&layouts=[`

Layout1:\
`[{"x":0,"y":0,"w":100,"h":100,"slot":0}],`\
Layout2:\
`[{"x":0,"y":0,"w":100,"h":100,"slot":1}],`\
Layout3:\
`[{"x":0,"y":0,"w":100,"h":100,"slot":2}],`\
Layout4:\
`[{"x":0,"y":0,"w":100,"h":100,"slot":3}],`\
Layout5:\
`[{"x":0,"y":0,"w":50,"h":100,"c":false,"slot":0},{"x":50,"y":0,"w":50,"h":100,"c":false,"slot":1}],`\
Layout6:\
`[{"x":0,"y":0,"w":100,"h":100,"z":0,"c":false,"slot":1},{"x":70,"y":70,"w":30,"h":30,"z":1,"c":true,"slot":0}],`\
Layout7:\
`[{"x":0,"y":0,"w":50,"h":50,"c":true,"slot":0},{"x":50,"y":0,"w":50,"h":50,"c":true,"slot":1},{"x":0,"y":50,"w":50,"h":50,"c":true,"slot":2},{"x":50,"y":50,"w":50,"h":50,"c":true,"slot":3}],`\
Layout8:\
`[{"x":0,"y":16.667,"w":66.667,"h":66.667,"c":true,"slot":0},{"x":66.667,"y":0,"w":33.333,"h":33.333,"c":true,"slot":1},{"x":66.667,"y":33.333,"w":33.333,"h":33.333,"c":true,"slot":2},{"x":66.667,"y":66.667,"w":33.333,"h":33.333,"c":true,"slot":3}]`\
\
`]`

### Streamdeck usage

You need to add [`&api=xxx`](../../general-settings/api.md) to the director's URL to control the layouts via Streamdeck.

<table><thead><tr><th width="398">HTTP Get</th><th>Description</th></tr></thead><tbody><tr><td><code>https://api.vdo.ninja/xxx/layout/0</code></td><td>Disables the layouts -> Auto-mixing</td></tr><tr><td><code>https://api.vdo.ninja/xxx/layout/1</code></td><td>Select Layout 1</td></tr><tr><td><code>https://api.vdo.ninja/xxx/layout/2</code></td><td>Select Layout 2</td></tr><tr><td><code>https://api.vdo.ninja/xxx/layout/[{"x":0,"y":0,"w":50,"h":100,"c":true,"slot":0},{"x":50,"y":0,"w":50,"h":100,"c":false,"slot":1}]</code> *</td><td>Select specified layout</td></tr></tbody></table>

\*If you use the HTTP Get like this, you don't need to add `&layouts` to the director's URL.

Using these URLs change the layout of your scene in OBS. The URL you should use in OBS is the default one:

[https://vdo.ninja/?scene\&room=roomname](https://vdo.ninja/?scene\&room=roomname)

### Excel-based Layout Generator

[https://docs.google.com/spreadsheets/d/1cHBTfni-Os3SAITsXrrNJ3qVCMVjunuW3xugvw1dykw/edit#gid=151839312](https://docs.google.com/spreadsheets/d/1cHBTfni-Os3SAITsXrrNJ3qVCMVjunuW3xugvw1dykw/edit#gid=151839312)\
\
Download it and save it as .xlsx - then you can edit it and create custom layouts for the `&layouts` parameter.

## Related

{% content-ref url="and-slotmode.md" %}
[and-slotmode.md](and-slotmode.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/api.md" %}
[api.md](../../general-settings/api.md)
{% endcontent-ref %}

{% content-ref url="../mixer-scene-parameters/and-layout.md" %}
[and-layout.md](../mixer-scene-parameters/and-layout.md)
{% endcontent-ref %}
