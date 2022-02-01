---
description: Enables displaying of closed captioning text
---

# \&cc (closed-captions)

## Aliases

* `&closedcaptions`
* `&captions`

## Details



This command will display the incoming transcribed text-data as an overlay. You will need to use this on the VIEW link, while also using the [`&transcribe`](../../source-settings/transcribe.md) command on the PUSH link.

See video for a walk-thru:

{% embed url="https://www.youtube.com/embed/3eo85WAXeuk" %}

Overlay text data is pulled from the source with [`&transcribe`](../../source-settings/transcribe.md) added.&#x20;

``[`&fontsize={percent}`](fontsize.md) can be used to adjust the overlay font-size. 100% is default;&#x20;

Use can use [`&css=somecssfile.css`](../../general-settings/css.md) to further customize the CSS style, or do so in the OBS Browser source style sheet area. You can also set the CSS via a base64 encoded string in the URL, via the [`&base64css`](../../general-settings/css.md) parameter.\
\
An example of a custom stylesheet for OBS that changes the font-family of the overlay text is the is the following:

```
body {
  background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden;
}

@font-face {
  font-family: 'opendyslexic';
	src: url('https://vdo.ninja/examples/OpenDyslexic-Regular.otf');
	font-style: normal;
	font-weight: normal;
} 

#overlayMsgs {
	font-family: "opendyslexic", opendyslexic, serif;
}
```

\
Another example of limiting the captioning-text to only use a fixed height of space when used as an overlay to OBS browser source. Just replace the OBS browser style with this code snippet instead:

```
body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }

#overlayMsgs{
    overflow: auto!important;
    display: flex!important;
    flex-direction: column-reverse!important;
    height: 240px!important;
}

#overlayMsgs span {
    text-align: left!important;
}
```

\
Feedback and user requests are welcomed.

### Example links and  Resources

[https://vdo.ninja/?transcribe](https://vdo.ninja/?transcribe)\
[https://vdo.ninja/?view=abc123\&cc](https://vdo.ninja/?view=abc123\&cc)\
[https://meyerweb.com/eric/tools/dencoder/](https://meyerweb.com/eric/tools/dencoder/)\
[https://vdo.ninja/examples/rainbow.css](https://vdo.ninja/examples/rainbow.css)\
[https://vdo.ninja/?css=https%3A%2F%2Fvdo.ninja%2Fexamples%2Frainbow.css](https://vdo.ninja/?css=https%3A%2F%2Fvdo.ninja%2Fexamples%2Frainbow.css)

## Related

{% content-ref url="../../general-settings/css.md" %}
[css.md](../../general-settings/css.md)
{% endcontent-ref %}

{% content-ref url="../../source-settings/transcribe.md" %}
[transcribe.md](../../source-settings/transcribe.md)
{% endcontent-ref %}
