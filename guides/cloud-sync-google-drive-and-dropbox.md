---
description: Configure Cloud Sync uploads for recordings using Google Drive and Dropbox
---

# Cloud Sync (Google Drive + Dropbox)

VDO.Ninja can upload recording chunks to cloud storage as part of podcast/studio workflows. This is useful for redundancy and remote collaboration.

## Google Drive

Google Drive uses an in-app OAuth flow.

1. Open the podcast studio and find the **Cloud Sync** card.
2. Click **Link Google Drive**.
3. Complete the Google popup authorization (`drive.file` scope).
4. Confirm the status switches to **Linked**.

Optional folder targeting:

`&gdrivefolder=YourFolderName`

## Dropbox

Dropbox also supports OAuth linking in the Cloud Sync card.

1. Click **Link Dropbox**.
2. Complete the Dropbox popup authorization.
3. Confirm the status switches to linked/success.

The OAuth flow can store refresh-capable credentials locally so uploads can resume in future sessions.

## Manual Dropbox token fallback

If popup auth is blocked in a kiosk or constrained environment, you can still provide a token manually:

* Paste a token into the Dropbox field in Cloud Sync, or
* Use `&dropbox=YOUR_ACCESS_TOKEN`

Manual tokens can expire quickly, so OAuth is recommended for normal use.

## Related

{% content-ref url="../advanced-settings/settings-parameters/and-gdrive.md" %}
[and-gdrive.md](../advanced-settings/settings-parameters/and-gdrive.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/settings-parameters/and-dropbox.md" %}
[and-dropbox.md](../advanced-settings/settings-parameters/and-dropbox.md)
{% endcontent-ref %}

{% content-ref url="options-to-record-streams.md" %}
[options-to-record-streams.md](options-to-record-streams.md)
{% endcontent-ref %}

