---
description: Enable Dropbox Cloud Sync uploads (OAuth or manual token fallback)
---

# \&dropbox

Advanced/Integration Option!

## Options

Example (manual fallback token):

`&dropbox=sl.BC1...YOUR_ACCESS_TOKEN...`

| Value         | Description                               |
| ------------- | ----------------------------------------- |
| Access Token  | Dropbox API access token                   |

## Details

- Primary flow: use **Link Dropbox** in the Cloud Sync card (OAuth popup).
- `&dropbox=...` is a manual token fallback for constrained environments.
- OAuth-based linking can store refresh-capable credentials locally for better long-lived upload behavior.
- Security: treat tokens as secrets and avoid sharing URLs containing tokens.

## Recommended setup

{% content-ref url="../../guides/cloud-sync-google-drive-and-dropbox.md" %}
[cloud-sync-google-drive-and-dropbox.md](../../guides/cloud-sync-google-drive-and-dropbox.md)
{% endcontent-ref %}

## Related

{% content-ref url="and-gdrive.md" %}
[and-gdrive.md](and-gdrive.md)
{% endcontent-ref %}
