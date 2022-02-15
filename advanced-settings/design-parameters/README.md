---
description: >-
  Labels, styles, clean output, CSS, mirroring, margin, darkmode, background
  color, disable tallies etc.
---

# Design Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General options

You can add them to both, source ([`&push`](../setup-parameters/push.md)) and viewer ([`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)) sides.

| Parameter                                       | Explanation                                                                                       |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| ``[`&label`](../../general-settings/label.md)`` | Sets a display name label                                                                         |
| ``[`&showlabels`](showlabels.md)``              | Display labels as a video overlay                                                                 |
| ``[`&style`](style.md)``                        | Lets you select how audio-only elements are displayed in OBS and for guests                       |
| ``[`&meterstyle`](meterstyle.md)``              | Optional audio meter style type                                                                   |
| ``[`&cleanoutput`](cleanoutput.md)``            | Keeps the output as clean as possible from UI elements                                            |
| ``[`&cleanish`](cleanish.md)``                  | Cleaner output; not as clean as [`&cleanoutput`](cleanoutput.md)``                                |
| ``[`&css`](css.md)``                            | Loads a custom CSS file                                                                           |
| ``[`&base64css`](and-base64css.md)``            | Lets you add css to the URL, but as a single string, so no external reference to a file is needed |
| ``[`&mirror`](mirror.md)``                      | Inverts the video so it is the mirror reflection                                                  |
| ``[`&flip`](and-flip.md)``                      | Inverts the video so it is upside down                                                            |
| ``[`&rounded`](rounded.md)``                    | Rounds the edges of videos                                                                        |
| ``[`&margin`](margin.md)``                      | Adds a margin around the videos in pixel                                                          |
| ``[`&darkmode`](darkmode.md)``                  | Darkens the website and interface                                                                 |
| ``[`&lightmode`](and-lightmode.md)``            | Forces to enable the lightmode / disable the darkmode                                             |
| ``[`&chroma`](chroma.md)``                      | Sets the background for the website to a particular hex color                                     |
| ``[`&transparent`](and-transparent.md)``        | Makes the background transparent                                                                  |

## Source side options

You have to add them to the source side ([`&push`](../setup-parameters/push.md)).

| Parameter                              | Explanation                                                     |
| -------------------------------------- | --------------------------------------------------------------- |
| ``[`&rotate`](and-rotate.md)``         | Rotates the camera                                              |
| ``[`&grid`](grid.md)``                 | Applies an rule-of-thirds grid overlay to the self-preview      |
| ``[`&hideheader`](and-hideheader.md)`` | Hides just the top header-bar                                   |
| ``[`&hidemenu`](and-hidemenu.md)``     | Hides the VDO.Ninja-branded menu and header bar                 |
| ``[`&tallyoff`](tallyoff.md)``         | Disables the Tally Light's visibility for that particular guest |

## **Viewer side options**

You have to add them to the viewer side ([`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)).

| Parameter                                | Explanation                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| ``[`&cleanviewer`](and-cleanviewer.md)`` | Hides many of the UI elements and pop-ups that may cause unwanted visual elements |
| ``[`&obsoff`](and-obsoff.md)``           | Disables the tally light effects                                                  |
| ``[`&pip`](and-pip.md)``                 | Auto PIP the first loaded video                                                   |
