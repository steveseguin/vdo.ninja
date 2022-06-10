---
description: >-
  Takes a JSON string representing how the video mixer should arrange video
  elements
---

# \&layout

Viewer-Side Option! ([`&scene`](../view-parameters/scene.md))

## Options

| Value         | Description                   |
| ------------- | ----------------------------- |
| (JSON string) | Defines the layout of a scene |

## Details

Takes a JSON string representing how the video mixer should arrange video elements. The string needed is based on the [vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) app's layout structure. Mainly used for development testing.

Example:\
[https://vdo.ninja/alpha/?scene=0\&room=ABCDEFGHIJK\&layout=%7B%22w9a98rn%22%3A%7B%22w%22%3A66.6659375%2C%22h%22%3A66.66666666666666%2C%22x%22%3A0%2C%22y%22%3A16.666944444444447%2C%22slot%22%3A0%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%2C%22EfLdwBK%22%3A%7B%22w%22%3A33.33296875%2C%22h%22%3A33.33138888888889%2C%22x%22%3A66.6671875%2C%22y%22%3A0%2C%22slot%22%3A1%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%2C%22QaLcege%22%3A%7B%22w%22%3A33.33296875%2C%22h%22%3A33.33138888888889%2C%22x%22%3A66.6671875%2C%22y%22%3A33.33305555555555%2C%22slot%22%3A2%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%2C%22vDavZzQK6%22%3A%7B%22w%22%3A33.33296875%2C%22h%22%3A33.33138888888889%2C%22x%22%3A66.6671875%2C%22y%22%3A66.66694444444444%2C%22slot%22%3A3%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%7D](https://vdo.ninja/alpha/?scene=0\&room=ABCDEFGHIJK\&layout=%7B%22w9a98rn%22%3A%7B%22w%22%3A66.6659375%2C%22h%22%3A66.66666666666666%2C%22x%22%3A0%2C%22y%22%3A16.666944444444447%2C%22slot%22%3A0%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%2C%22EfLdwBK%22%3A%7B%22w%22%3A33.33296875%2C%22h%22%3A33.33138888888889%2C%22x%22%3A66.6671875%2C%22y%22%3A0%2C%22slot%22%3A1%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%2C%22QaLcege%22%3A%7B%22w%22%3A33.33296875%2C%22h%22%3A33.33138888888889%2C%22x%22%3A66.6671875%2C%22y%22%3A33.33305555555555%2C%22slot%22%3A2%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%2C%22vDavZzQK6%22%3A%7B%22w%22%3A33.33296875%2C%22h%22%3A33.33138888888889%2C%22x%22%3A66.6671875%2C%22y%22%3A66.66694444444444%2C%22slot%22%3A3%2C%22cover%22%3Afalse%2C%22valueZ%22%3A0%2C%22borderThickness%22%3A0%2C%22animated%22%3A0%2C%22borderColor%22%3A%22%23000%22%2C%22backgroundMedia%22%3A%22%22%2C%22margin%22%3A0%2C%22rounded%22%3A0%2C%22muted%22%3Afalse%7D%7D)\
![](<../../.gitbook/assets/image (87).png>)

You can use [vdo.ninja/alpha/mixer](https://vdo.ninja/alpha/mixer) to create JSON strings.&#x20;

![](<../../.gitbook/assets/image (101) (1) (1).png>)

## Related

{% embed url="https://vdo.ninja/alpha/mixer" %}
vdo.ninja/alpha/mixer
{% endembed %}
