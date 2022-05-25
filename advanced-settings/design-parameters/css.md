---
description: Loads a custom CSS file
---

# \&css

General Option! ([`&push`](../../source-settings/push.md), [`&room`](../../general-settings/room.md), [`&view`](../view-parameters/view.md), [`&scene`](../view-parameters/scene.md))

## Options

Any url-encoded url that links to a CSS file.

Example:

```
https://vdo.ninja/?css=https%3A%2F%2Fbackup.obs.ninja%2Fdev4321%2Fexamples%2Fmain.css
```

You can use this tool to encode the URL you want to link to [https://meyerweb.com/eric/tools/dencoder/](https://meyerweb.com/eric/tools/dencoder/)

## Details

Link to a remotely hosted CSS style sheet via the URL.\
You can stylize VDO.Ninja without needing to host anything more than a CSS file.\
The page elements are not visible until the remote style sheet has been loaded.

### base64css

You can pass CSS as a base64-encoded string using the [`&base64css`](and-base64css.md) parameter. This needs to be URLComponent encoded first, and then converted to base 64.&#x20;

The [https://invite.vdo.ninja/](https://invite.vdo.ninja/) tool has an option to do these base64 encoding steps under "General Options".

### Customizable director's dock for OBS

Customizable director's dock for OBS example made:\
`&css=minidirector.css`

Example:\
[https://vdo.ninja/?css=minidirector.css\&cleanoutput\&hidesolo\&director=YOURROOMNAMEHERE](https://vdo.ninja/?css=minidirector.css\&cleanoutput\&hidesolo\&director=YOURROOMNAMEHERE)

## Related

{% content-ref url="and-base64css.md" %}
[and-base64css.md](and-base64css.md)
{% endcontent-ref %}
