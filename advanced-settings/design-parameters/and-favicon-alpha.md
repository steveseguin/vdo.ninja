---
description: Will change the browser's page favicon image
---

# \&favicon (alpha)

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md), [`&solo`](../mixer-scene-parameters/and-solo.md))

## Options

Example: `&favicon=https%3A%2F%2Fmeshcast.io%2Ffavicon.ico`

| Value             | Description         |
| ----------------- | ------------------- |
| (URL encoded URL) | Changes the favicon |

[https://www.urlencoder.org/](https://www.urlencoder.org/)

## Details

`&favicon` will change the browser's page favicon image. Passed values should be URL encoded. (Google URL encoding if needed). Since this is Javascript based, the values only update once the page loads. Meta-page-previews will likely not reflect the values.\
\
Sample link: [`https://vdo.ninja/?headertitle=LINDENKRON4TW&favicon=https%3A%2F%2Fmeshcast.io%2Ffavicon.ico`](https://vdo.ninja/?headertitle=LINDENKRON4TW\&favicon=https%3A%2F%2Fmeshcast.io%2Ffavicon.ico)

<div align="left">

<figure><img src="../../.gitbook/assets/image (181).png" alt=""><figcaption></figcaption></figure>

</div>

## Related

{% content-ref url="and-headertitle.md" %}
[and-headertitle.md](and-headertitle.md)
{% endcontent-ref %}
