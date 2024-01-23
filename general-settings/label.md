---
description: Sets a display name label
---

# \&label

General Option! ([`&push`](../source-settings/push.md), [`&room`](room.md), [`&view`](../advanced-settings/view-parameters/view.md), [`&scene`](../advanced-settings/view-parameters/scene.md))

## Aliases

* `&l`

## Options

Example: `&label=Steve`

| Value             | Description                                        |
| ----------------- | -------------------------------------------------- |
| (no value given)  | It will prompt the user for a Display Name on load |
| (string)          | Sets the label for the guest/browser tab           |
| `TITLEn\SUBTITLE` | [Multiple lines](label.md#multiple-lines-on-alpha) |

## Details

`&label` sets a display name label to the stream ID.

* Uses the label in OBS Studio if dragging the link into OBS Studio.
* Will change the name of the Browser tab to the Label specified.\
  ![](<../.gitbook/assets/image (141).png>)
* Shows up in the connection debug Stats window.\
  ![](<../.gitbook/assets/image (114) (2).png>)
* If left blank, it will prompt the user for a Display Name on load.\
  ![](<../.gitbook/assets/image (75) (1).png>)
* You can use [`&showlabels`](../advanced-settings/design-parameters/showlabels.md) to show the labels in the video sources.

### Multiple lines

Until I figure out a better way of doing this, I've enabled a way to have a display name be on multiple-lines in VDO.Ninja.

`&label=DisplayNameHere\nSubtitleHere` Note the use of as a line break ie:

```
https://vdo.ninja/?label=Steve_Seguin\n(he/him)\nhttps://twitch.tv/vdoninja&push=JaAiVEH
https://vdo.ninja/?view=JaAiVEH&showlabels
```

So it's not super obvious how to do this currently, so I think the next goal will be to add the option to let a guest enter their own sub-title, etc, when joining, using dedicated input fields. But until then, I hope this still helps. You can stylize the sub-label within OBS's CSS section, targeting the following CSS, but please note I'll probably be tweaking the CSS/HTML as well in the future:

```
.video-label>span:nth-child(2) {
    font-size: 50%;
    display: block;
    text-align: center;
}
```

![](<../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

## Related

{% content-ref url="../advanced-settings/design-parameters/showlabels.md" %}
[showlabels.md](../advanced-settings/design-parameters/showlabels.md)
{% endcontent-ref %}

{% content-ref url="../newly-added-parameters/and-screensharelabel.md" %}
[and-screensharelabel.md](../newly-added-parameters/and-screensharelabel.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/setup-parameters/and-labelsuggestion.md" %}
[and-labelsuggestion.md](../advanced-settings/setup-parameters/and-labelsuggestion.md)
{% endcontent-ref %}
