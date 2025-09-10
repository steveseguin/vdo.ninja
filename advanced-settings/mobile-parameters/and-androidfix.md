---
description: Enable an H.264 profile compatibility tweak for Android
---

# \&androidfix

Mobile/Compatibility Option!

## Options

Example: `&androidfix`

| Value      | Description                                   |
| ---------- | --------------------------------------------- |
| (no value) | Enables Android H.264 profile compatibility   |

## Details

- Applies an SDP tweak that changes the H.264 profile level (`42e01f` → `42001f`) to improve compatibility with some Android devices/browsers.
- Use only if you encounter H.264 playback/connection issues on Android.
- Has no effect on non-Android platforms.

## Related

{% content-ref url="and-forceios.md" %}
[and-forceios.md](and-forceios.md)
{% endcontent-ref %}

