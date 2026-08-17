---
description: Draw or ping on a caller's live video and show the annotations in OBS, either over the caller's feed or as a transparent overlay.
---

# Telestrate a caller's video

VDO.Ninja's built-in **Draw/Ping on video** tool can annotate a caller's camera or screen share. The marks are synchronized overlays rather than being baked into the caller's encoded video, so each passive output or additional viewing link that should show them must opt in with `&drawing`.

{% hint style="success" %}
**The simple version:** Add `&drawing` to the OBS Browser Source URL, right-click the caller in the Director's Room, select **Request draw access** or **Draw/Ping on video**, and then select **Enable Drawing**.
{% endhint %}

## Show the caller and annotations together

For a caller with the stream ID `PLAYER1` in room `YOUR_ROOM`, use this as the OBS Browser Source URL:

```text
https://vdo.ninja/?view=PLAYER1&room=YOUR_ROOM&drawing&cleanoutput
```

To show annotations in a complete room scene instead, add `&drawing` to the Scene link:

```text
https://vdo.ninja/?scene&room=YOUR_ROOM&drawing
```

Keep the room password and any other required connection options consistent across the director, caller, and OBS links.

## Start drawing

1. In the Director's Room, right-click the caller's video or screen share.
2. Select **Request draw access**. If access was already granted, the option is named **Draw/Ping on video** instead.
3. The caller opens the chat/action notification and selects **Allow**.
4. When the drawing controls appear, select **Enable Drawing**, then draw over the video.

The controls also provide:

* **Ping** for a temporary target marker
* **Clear** to remove all current marks
* **Undo** to remove the last drawing action

Right-click the video again and select **Stop draw mode** when finished.

Adding `&drawing` to the caller's invite pre-authorizes drawing and skips the manual approval prompt. Only do this when the caller expects annotations.

## Output only the drawings with a transparent background

Use a dedicated OBS Browser Source with the same caller view link:

```text
https://vdo.ninja/?view=PLAYER1&room=YOUR_ROOM&drawing&cleanoutput&transparent
```

In that Browser Source's **Custom CSS** field, use:

```css
video {
    opacity: 0 !important;
}
```

This keeps the incoming video active as the coordinate reference but hides it from the OBS output. The drawing canvas remains visible. Place this Browser Source above the game feed or other source that should receive the annotations.

Match the Browser Source dimensions and aspect ratio to the feed used by the telestrator. Different crops or aspect ratios can make the marks appear in the wrong position.

{% hint style="warning" %}
`&drawing` is required on every passive VDO.Ninja view or Scene link that should display the annotations. An OBS or other viewing link without it will show the caller normally but will not render the marks.
{% endhint %}

## Troubleshooting

* Refresh the OBS Browser Source after adding `&drawing` or changing its Custom CSS.
* If the director sees **Request draw access**, the caller still needs to approve the request.
* Do not add `&nodrawingrelay` or `&noshareddrawing`; those options prevent the caller from relaying annotations to other viewers.
* For an isolated caller feed, use `&view=STREAM_ID`. For a composed room layout, use the normal Scene link with `&drawing`.
