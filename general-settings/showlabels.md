---
description: Display labels as a video overlay
---

# \&showlabels

## Aliases

* `&showlabel`
* `&sl`

## Details

This parameter will display the user's display name or label on screen, as a text overlay. The label can be set either via the URL using the [`&label`](label.md) parameter, or the room's director can set it dynamically via the "Add a label" option. &#x20;

This parameter can be used on guest links, view links, or scene links. It will be sticky to each individual video and not the browser window as a whole.

Underscores "\_" used in label values will be replaced by spaces, allowing for word separation.

HTML5 Emojis 🎈 and some non-Latin characters are supported.&#x20;

## Preset styling options

There are some preset style options, which can be passed to the parameter as a value. You can also choose to just edit the label's style with CSS, as discussed lower on this page.

| Value      | Description                          |
| ---------- | ------------------------------------ |
| skype      | Skype styled display names           |
| ninjablue  | VDO.Ninja styled display names       |
| toprounded | Rounded display names                |
| fire       | Fire looking display names           |
| teams      | Microsoft Teams styled display names |
| zoom       | Zoom styled display names            |

For example: `https://vdo.ninja/?showlabels=ninjablue`

If no preset option is passed, a default generic style is used.

### Font size customization

You can change the font-size without using CSS, using the [`&fontsize`](../advanced-settings/view-parameters/fontsize.md) parameter. CSS is also supported though.

Font-size of labels will adjust slightly based on the window size.

## Advanced Customization

CSS of the styles can be set via the OBS browser source stylesheet window.\
The CSS class name you can customize is called `"video-label"`.

![An example of how to set a custom CSS style for labels](<../.gitbook/assets/image (16).png>)

You can copy the below code, modifying it as you desire, as a starting point. You'll still need to use `&showlabels` to trigger the labels to display though.

```
.video-label {
	color: red;
  bottom: 2vh;
	left: 50%;
	transform: translateX(-50%);
  background: rgba(0, 0, 0, .8);
	pointer-events:none;
	border-radius: 5px;
	font-size: 0.8em;
}
```

Below is another example, this time we target the video tile class, creating a margin above the video elements.  We can then move the display label into that space, creating a label that is not overlaying the video itself, but still attached.

![We can paste the CSS code directly into the OBS browser source, or we can host the style in a file and access it via the \&css parameter](<../.gitbook/assets/image (41).png>)

```
.tile {
  margin-top: 10vh !important;
  max-height: 90vh!important;
}

.video-label {
	bottom:unset;
	top:0;
	text-align:middle;
	left:unset;
	background:unset;
	text-shadow : 0 0 10px #035;
	font-size: 7vh!important;
}
```

## Related

{% content-ref url="label.md" %}
[label.md](label.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-screensharelabel.md" %}
[and-screensharelabel.md](../newly-added-parameters/and-screensharelabel.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/view-parameters/fontsize.md" %}
[fontsize.md](../advanced-settings/view-parameters/fontsize.md)
{% endcontent-ref %}

{% content-ref url="css.md" %}
[css.md](css.md)
{% endcontent-ref %}
