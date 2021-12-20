# There are black borders around the video in OBS.

If a black border appears around the video, check that the custom CSS settings in the browser source has not been modified from the default setting:

```css
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }
```

If you changed the default CSS settings, then you'll need to change them back to get rid of any background.

Also, ideally the width/height in OBS Browser source should be the same aspect ratio as the video. 1280x720 (not 800x600) This will fit the window to the video.



_original issue thread:_ [_Reddit: Advice on adding to OBS_](https://www.reddit.com/r/OBSNinja/comments/g1xyoi/advice\_on\_adding\_to\_obs/)\
