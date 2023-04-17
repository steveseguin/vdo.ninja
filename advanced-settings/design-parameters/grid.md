---
description: Applies an rule-of-thirds grid overlay to the self-preview
---

# \&grid

Sender-Side Option! ([`&push`](../../source-settings/push.md))

## Aliases

* `&ruler`
* `&thirds`

## Options

Example: `&grid=./media/thirdshead.svg`

| Value            | Description                              |
| ---------------- | ---------------------------------------- |
| (no value given) | adds a white rule-of-thirds grid overlay |
| (encoded URL)    | adds an image as a overlay               |

## Details

Applies an rule-of-thirds grid overlay to the self-preview video window. This is useful for passively nudging guests to better center themselves while on camera.

{% hint style="warning" %}
As of [v19.0](../../release-notes/v19.md), this only works for guests of a room or of a faux-room. It doesn't yet support basic push/view links, as those don't use the auto-mixer code, which is where this code is currently applied.
{% endhint %}

![default version of \&grid](<../../.gitbook/assets/image (92) (1).png>)

### Changes in Version 22

Added the option to customize the `&grid` effect by passing an image link (can help center guests).

A transparent PNG or an SVG file are the recommended options.

It will stretch to cover the camera preview-area, so probably best to keep things 16:9 aspect if needed.

URL can be URL-encoded, for more complex URLs. Simple URLs might work without.

Technically this can be used as an overlay for other things, but it only works with the self-preview.

Example: [`https://vdo.ninja/?push&grid=./media/thirdshead.svg`](https://vdo.ninja/?push\&grid=./media/thirdshead.svg)

Leave the passed value empty if you wish to have the white basic rule-of-thirds show as default.

{% hint style="info" %}
* As of v22, it now works in non-room mode (basic push links):\
  [https://vdo.ninja/?push\&grid](https://vdo.ninja/?push\&grid)
* You can now also toggle it in the director's room to add it to the guest's link:\
  ![](<../../.gitbook/assets/image (103) (1).png>)
{% endhint %}

You can encode your URL here:\
[https://www.urlencoder.org/](https://www.urlencoder.org/)
