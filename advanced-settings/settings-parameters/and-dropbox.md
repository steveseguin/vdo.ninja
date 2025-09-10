---
description: Enable Dropbox uploads via an access token
---

# \&dropbox

Advanced/Integration Option!

## Options

Example:

`&dropbox=sl.BC1...YOUR_ACCESS_TOKEN...`

| Value         | Description                               |
| ------------- | ----------------------------------------- |
| Access Token  | Dropbox API access token                   |

## Details

- Loads the Dropbox SDK and initializes a client with the provided access token.
- Enables upload/backup workflows exposed by the UI where supported (experimental).
- Security: treat tokens as secrets; prefer short‑lived tokens and limit scopes.

## Related

{% content-ref url="and-gdrive.md" %}
[and-gdrive.md](and-gdrive.md)
{% endcontent-ref %}

