---
description: Align video holders to the top of their containers
---

# \&aligntop

Add `&aligntop` to the viewing page's URL to place the video at the top when a landscape source is displayed in a portrait window. The unused space appears below the video.

## Example

`https://vdo.ninja/?view=STREAMID&aligntop`

Replace `STREAMID` with the stream ID you want to view. This is useful for a 16:9 presentation viewed on a portrait phone or digital display.

## Details

The option applies this CSS to every video holder on that page:

```css
.holder {
    top: 0 !important;
}
```

It changes the local page layout, not the transmitted video. It overrides each holder's normal top offset, so use it where that placement is wanted for all videos on the page.

No value is required. Remove `&aligntop` to restore the normal layout; `&aligntop=0` still enables it because the option checks only whether the parameter is present.

On versions without this option, the same rule can be supplied through [`&base64css` / `&cssb64`](and-base64css.md).
