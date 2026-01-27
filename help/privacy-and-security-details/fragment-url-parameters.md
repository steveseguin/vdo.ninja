---
description: Hide sensitive URL parameters from server logs using fragment URLs
---

# Fragment URL Parameters

## Overview

VDO.Ninja now supports placing sensitive URL parameters in the **fragment** portion of the URL (after `#`) instead of the query string (after `?`). Parameters placed in the fragment are never sent to the server, keeping them hidden from Cloudflare and other intermediaries.

## How It Works

When you load a URL, your browser sends the query string (`?param=value`) to the server, but the fragment (`#param=value`) stays entirely client-side. This means:

| URL Format | Server Visibility |
| --- | --- |
| `?push=cam1&p=secret` | Cloudflare sees `push=cam1` AND `p=secret` |
| `?push=cam1#p=secret` | Cloudflare sees only `push=cam1` |

{% hint style="info" %}
Fragment parameters take **precedence** over query parameters. If the same parameter appears in both places, the fragment value is used.
{% endhint %}

## Use Cases

### Hiding Passwords from Server Logs

Instead of:
```
https://vdo.ninja/?push=cam1&p=mysecretpassword
```

Use:
```
https://vdo.ninja/?push=cam1#p=mysecretpassword
```

### Hiding Tokens and Keys

```
https://vdo.ninja/?push=cam1#p=secret&token=abc123&key=xyz
```

Multiple sensitive parameters can be placed after the `#`.

## Fallback Behavior

You can combine fragment passwords with a hash fallback in case the fragment is stripped during URL sharing:

```
https://vdo.ninja/?push=cam1&hash=99e5#p=secret
```

In this example:
- If the fragment survives URL sharing: `p=secret` is used directly
- If the fragment is stripped (some platforms do this): the user is prompted to enter a password, which is then validated against `&hash=99e5`

This keeps the real password hidden in the fragment while providing hash-based validation as a fallback.

## Limitations

### Screen Sharing Visibility

The fragment is still visible in the browser's address bar. If you share your screen showing the browser, the fragment values will be visible. Consider using [`&hash`](../../newly-added-parameters/and-hash.md) for passwords if screen sharing is a concern.

### URL Sharing

Some platforms and messaging apps may strip or modify the fragment portion when sharing URLs. Test your sharing workflow to ensure fragments are preserved.

### Page Refresh

Unlike cookies or localStorage, fragment parameters persist on page refresh since they remain in the URL.

## Technical Details

- Fragment parameters are parsed client-side using the same logic as query parameters
- Standard URL encoding applies (`%20` for spaces, etc.)
- Parameters can use `=` for values or be flags without values
- The same parameter aliases work (`&p`, `&pw`, `&pass`, `&password`)

## Related

{% content-ref url="../../advanced-settings/setup-parameters/and-password.md" %}
[and-password.md](../../advanced-settings/setup-parameters/and-password.md)
{% endcontent-ref %}

{% content-ref url="../../newly-added-parameters/and-hash.md" %}
[and-hash.md](../../newly-added-parameters/and-hash.md)
{% endcontent-ref %}

{% content-ref url="./" %}
[Privacy and security details](./)
{% endcontent-ref %}
