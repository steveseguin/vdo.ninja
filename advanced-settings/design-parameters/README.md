---
description: >-
  Labels, styles, clean output, CSS, mirroring, margin, darkmode, background
  color, disable tallies etc.
---

# Design Parameters

They are separated in three groups: [general options](./#general-options) (push and view), [source side](./#source-side-options) (push) options and [viewer side](./#viewer-side-options) (view) options.

## General options

You can add them to both, source ([`&push`](../../source-settings/push.md)) and viewer ([`&view`](../view-parameters/view.md) or [`&scene`](../view-parameters/scene.md)) sides.

| Parameter                                                 | Explanation                                                                                                |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| ``[`&label`](../../general-settings/label.md)``           | Sets a display name label                                                                                  |
| ``[`&showlabels`](showlabels.md)``                        | Display labels as a video overlay                                                                          |
| ``[`&fontsize`](../view-parameters/fontsize.md)``         | Let you set font-size of the closed captions and stream labels                                             |
| ``[`&style`](style.md)``                                  | Lets you select how audio-only elements are displayed in OBS and for guests                                |
| ``[`&bgimage`](and-bgimage.md)\*                          | Can be used to set the default image avatar, when using [`&style=0`](style.md) or [`&style=6`](style.md)`` |
| ``[`&showall`](and-showall.md)\*                          | Includes non-media-based push connections as video elements in a group room                                |
| ``[`&meterstyle`](meterstyle.md)``                        | Optional audio meter style type                                                                            |
| ``[`&cleanoutput`](cleanoutput.md)``                      | Keeps the output as clean as possible from UI elements                                                     |
| ``[`&cleanish`](cleanish.md)``                            | Cleaner output; not as clean as [`&cleanoutput`](cleanoutput.md)``                                         |
| ``[`&css`](css.md)``                                      | Loads a custom CSS file                                                                                    |
| ``[`&base64css`](and-base64css.md)``                      | Lets you add css to the URL, but as a single string, so no external reference to a file is needed          |
| ``[`&js`](and-js.md)``                                    | Lets you pass a third party hosted javascript file URL                                                     |
| ``[`&base64js`](and-base64js.md)\*                        | Lets a user add raw javascript to the URL to run on page load                                              |
| ``[`&mirror`](mirror.md)``                                | Inverts the video so it is the mirror reflection                                                           |
| ``[`&flip`](and-flip.md)``                                | Inverts the video so it is upside down                                                                     |
| ``[`&border`](and-border.md)\*                            | Adds a border around the videos                                                                            |
| ``[`&bordercolor`](and-bordercolor.md)\*                  | Defines the color of [`&border`](and-border.md)``                                                          |
| ``[`&rounded`](rounded.md)``                              | Rounds the edges of videos                                                                                 |
| ``[`&margin`](margin.md)``                                | Adds a margin around the videos in pixel                                                                   |
| ``[`&darkmode`](darkmode.md)``                            | Darkens the website and interface                                                                          |
| ``[`&lightmode`](and-lightmode.md)``                      | Forces to enable the lightmode / disable the darkmode                                                      |
| ``[`&background`](and-background.md)\*                    | Accepts a URL-encoded image URL to make as the app's default background                                    |
| ``[`&chroma`](chroma.md)``                                | Sets the background for the website to a particular hex color                                              |
| ``[`&transparent`](and-transparent.md)``                  | Makes the background transparent                                                                           |
| ``[`&nocursor`](../../general-settings/and-nocursor.md)`` | Hides the mouse cursor over videos at a CSS level                                                          |

\*NEW IN VERSION 22

## Source side options

You have to add them to the source side ([`&push`](../../source-settings/push.md)).

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
