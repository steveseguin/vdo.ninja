# The power of the URL parameter

You can customize the playback of videos by adding query string parameters to the [VDO.Ninja](https://vdo.ninja/) URL links, along with many other aspects. VDO.Ninja is highly flexible in this regard, letting you achieve your desired outcome without needing to code and without additional software.

For example, a simple viewer URL link such as

```
https://vdo.ninja/?view=streamid
```

could be amended to

```
https://vdo.ninja/?view=streamid&videobitrate=500
```

which will cause the viewer to receive the publisher's video stream at a video bitrate of 500-kbps.

{% hint style="info" %}
Multiple parameters can be appended together by using the ampersand (`&`) as a separating character.&#x20;
{% endhint %}

For example, to view the video stream published at stream ID `streamid` at a video bitrate of 500-kbps and set the [`&stereo`](../general-settings/stereo.md) parameter to `1`:

```
http://vdo.ninja/?view=streamid&videobitrate=500&stereo=1
```

Some parameters, like [`&view`](../advanced-settings/view-parameters/view.md) will accept a comma-separated list of valid values, so you can do some rather powerful combos, such as publish a video (using [`&push`](../source-settings/push.md)) while also viewing multiple others videos. VDO.Ninja will auto-mix the videos together into a single layout for you:

```
http://vdo.ninja/?push=aaa&view=bbb,ccc,ddd
```

{% content-ref url="../advanced-settings.md" %}
[advanced-settings.md](../advanced-settings.md)
{% endcontent-ref %}
