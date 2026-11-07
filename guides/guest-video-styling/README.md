---
description: Style guest videos with names, lower thirds, borders, backgrounds, OBS layouts, custom CSS, and downloadable interface starters.
---

# Style your guest videos

Add a name, a border, or your show's colors to each guest. Start with a few link options. Use CSS or a custom page when you want a more individual look.

## Guide map

| Start here | What you can make |
| --- | --- |
| 🟢 [Names and borders](#names-and-borders) | A styled group scene, without code |
| 🎨 [Custom CSS](custom-css.md) | Your own lower thirds, colors, and talking indicators |
| 🧩 [OBS and Mixer layouts](obs-and-mixer.md) | Fixed guest boxes, image frames, logos, and backgrounds |
| 🛠️ [A custom page with an iframe](iframe-starter.md) | A branded show page with an embedded group scene |
| ⚡ [A dynamic stage](dynamic-stage.md) | Your own guest cards, scores, and spotlight controls |

<figure><img src="../../.gitbook/assets/guest-video-styling/preset-styles.jpg" alt="Four built-in guest label styles: default, Ninja Blue, rounded, and Teams"><figcaption><p>Built-in styles on VDO.Ninja's sample video. Labels follow each guest as the scene rearranges.</p></figcaption></figure>

## Names and borders

### 1. Give each guest a name

In the director's room, click **Add a label** under the guest. You can also add a name to their invite link:

```text
&label=Jane_Doe
```

For a name and title, use:

```text
&label=Jane_Doe%5CnHost
```

`%5Cn` means a line break here: the literal characters `\n`, encoded for a URL. When typing in the director's label box, enter `Jane Doe\nHost`.

### 2. Turn on labels in the output

Append this to the **group scene link you use in OBS**:

```text
&showlabels=ninjablue
```

Use `&showlabels` for the default look. Other styles include `rounded`, `teams`, `zoom`, `skype`, `toprounded`, and `fire`.

These options change the page displaying the video. Adding them to your OBS scene link does not change the guest's camera or everyone else's view.

### 3. Add a border and some space

Append:

```text
&border=4&bordercolor=white&rounded=12&margin=12
```

That gives every guest a 4-pixel white border, rounded corners, and space around the video. Change the numbers to suit your canvas.

**A complete example:**

```text
https://vdo.ninja/?room=YOUR_ROOM&scene=0&showlabels=ninjablue&border=4&bordercolor=white&rounded=12&margin=12
```

Replace `YOUR_ROOM`. If your scene link already contains a password or other options, keep them and append only the styling options. Do not add a second `?`.

[▶ Try names and borders with sample video](https://vdo.ninja/?view&fakeguests=4&showlabels=ninjablue&border=4&bordercolor=white&rounded=12&margin=12&fontsize=100&cleanoutput)

## Fine-tune the picture

| Goal | Add to the scene or view link |
| --- | --- |
| Smaller labels | `&fontsize=80` (100 is the normal setting) |
| Fill each video box | `&cover` (crops the edges when needed) |
| Keep the full picture | Leave `&cover` off |
| Consistent video boxes | `&structure` (16:9 by default; combine with `&cover` to fill them) |
| Square video layout | `&square&structure&cover` |
| Green border while a guest talks | `&meterstyle=2` |
| Transparent page background | `&transparent` |
| A solid page background | `&chroma=182232` |
| An image behind the layout | `&background=` followed by an encoded image URL |

The talking indicator needs active incoming audio. For a different border or graphic for each guest, use [separate OBS sources](obs-and-mixer.md) or a custom layout.

<figure><img src="../../.gitbook/assets/guest-video-styling/scene-borders.jpg" alt="Four sample guest videos with white rounded borders, spacing, and lower-third names"><figcaption><p>One scene link can style every guest. This preview repeats the built-in sample clip.</p></figcaption></figure>

## Keep going

**Customize:** [CSS recipes](custom-css.md) · [OBS and Mixer](obs-and-mixer.md)

**Build:** [Iframe starter](iframe-starter.md) · [Dynamic stage starter](dynamic-stage.md)

**Reference:** [Labels](../../advanced-settings/design-parameters/showlabels.md) · [Names and titles](../../general-settings/label.md) · [Borders](../../advanced-settings/design-parameters/and-border.md) · [All design options](../../advanced-settings/design-parameters/README.md)

## Quick fixes

| What you see | What to check |
| --- | --- |
| No names | Set the guest's label and add `&showlabels` to the output link. |
| Literal `\n` in another app's name list | Multiline labels are a VDO.Ninja display feature. Use one line if that app uses the label as a plain name. |
| A border is still black | Try `&bordercolor=white`; for a CSS recipe use `border-color: ... !important`. |
| Faces or screen edges are cut off | Remove `&cover`, or choose a box with the same shape as the source. |
| Styling appears in one window only | Apply it to each scene/view URL where you want that look. OBS Custom CSS affects that Browser Source only. |
| Two copies of a guest's audio | Keep one intended audio path. See [OBS layouts](obs-and-mixer.md#keep-one-audio-path). |
