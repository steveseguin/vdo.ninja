---
description: >-
  An ordered array of layouts, which can be used to switch between using the API
  layouts action
---

# \&layouts

Director Option! ([`&director`](../../viewers-settings/director.md))\
\* on [https://vdo.ninja/alpha/](https://vdo.ninja/alpha/)

## Options

| Value                       | Description              |
| --------------------------- | ------------------------ |
| (URL-encoded ordered array) | structure of the layouts |

## Details

`&layouts=[[{xxxxxx}]]` is a URL parameter option, where you can pass a set of different layouts (as a URL-encoded ordered array) to VDO.Ninja. (\*\* on alpha)

This is akin to using the [vdo.ninja/beta/mixer](https://vdo.ninja/beta/mixer), to visually set layouts, but instead you are just manually setting all the available layouts directly, bypassing the mixer app.

Once you have set the layouts, the "layout" [API](../../general-settings/api.md) feature becomes a bit more useful, as you can remotely activate any of those layouts with a simple API command.

I documented the 'layout' API option a bit here, but the tl;dr; is that you can either use this API call to set a layout from within the array of layouts that are set, or you can pass a full-fledge layout-object, for on-the-fly custom layouts.

ie: `{action:'layout',value':5}` or `{action:'layout',value':[{xxxx.layout-stuff-here.xxxx]]}`

fyi, the layout and the API in general work with the [vdo.ninja/beta/mixer](https://vdo.ninja/beta/mixer) page, so you can use it to create the layouts, and then manually switch between them via the API. The API is streamdeck-friendly.

{% embed url="https://github.com/steveseguin/Companion-Ninja/blob/main/README.md#custom-layout-switching-" %}

### Example

`&layouts=[[{"x":0,"y":0,"w":100,"h":100,"slot":0}],[{"x":0,"y":0,"w":100,"h":100,"slot":1}],[{"x":0,"y":0,"w":100,"h":100,"slot":2}],[{"x":0,"y":0,"w":100,"h":100,"slot":3}],[{"x":0,"y":0,"w":50,"h":100,"c":false,"slot":0},{"x":50,"y":0,"w":50,"h":100,"c":false,"slot":1}],[{"x":0,"y":0,"w":100,"h":100,"z":0,"c":false,"slot":1},{"x":70,"y":70,"w":30,"h":30,"z":1,"c":true,"slot":0}],[{"x":0,"y":0,"w":50,"h":50,"c":true,"slot":0},{"x":50,"y":0,"w":50,"h":50,"c":true,"slot":1},{"x":0,"y":50,"w":50,"h":50,"c":true,"slot":2},{"x":50,"y":50,"w":50,"h":50,"c":true,"slot":3}],[{"x":0,"y":16.667,"w":66.667,"h":66.667,"c":true,"slot":0},{"x":66.667,"y":0,"w":33.333,"h":33.333,"c":true,"slot":1},{"x":66.667,"y":33.333,"w":33.333,"h":33.333,"c":true,"slot":2},{"x":66.667,"y":66.667,"w":33.333,"h":33.333,"c":true,"slot":3}]]`

## Related

{% content-ref url="../mixer-scene-parameters/and-layout.md" %}
[and-layout.md](../mixer-scene-parameters/and-layout.md)
{% endcontent-ref %}

{% content-ref url="and-slotmode.md" %}
[and-slotmode.md](and-slotmode.md)
{% endcontent-ref %}

{% content-ref url="../../general-settings/api.md" %}
[api.md](../../general-settings/api.md)
{% endcontent-ref %}
