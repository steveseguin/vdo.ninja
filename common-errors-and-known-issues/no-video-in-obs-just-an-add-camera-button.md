---
description: >-
  If you trying to add your video to OBS or Streamlabs, but instead of video you
  see buttons saying something like "Add camera" or "Share camera", double check
  your browser source links.
---

# No video in OBS, just an "Add camera" button

If see the VDO.Ninja menu, instead of a video, it is typically caused by having your PUSH link used as a VIEW link in OBS or Streamlabs's browser source.

To fix, you should be able to just replace the `?push=` part of the URL with `?view=`.

A push link is for the sender to use, so to send video from your phone or computer to OBS.

A view link is used for viewing a video in OBS or other studio software.

VDO.Ninja will respond differently to whether a push or view link is provided, as each has a different role.

If you still see the VDO.Ninja menu or website, check to make sure your link is correct. Your links should start with `https://vdo.ninja/?`

If you forget the `?`, or have other errors in the URL, the website might load in an error state. This error state may sometimes be the VDO.Ninja website, perhaps with no images showing, or other graphical issues.

If still having problems after, ensure the stream ID value for both the view and the push parameters of the sender and viewer links are the same. You should have only at most one push-link open per stream ID as well; more than one will show an error that the stream ID is already in use.
