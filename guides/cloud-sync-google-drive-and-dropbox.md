---
description: Configure Cloud Sync uploads for recordings using Google Drive and Dropbox
---

# Cloud Sync (Google Drive + Dropbox)

In Podcast Studio, Google Drive receives guest backups during recording. Dropbox uploads the host's finished recordings after recording stops. Wait for uploads to finish before closing the page.

## Google Drive

Google Drive uses an in-app OAuth flow.

1. Open the podcast studio and find **Recording settings**.
2. Click **Connect** next to **Google Drive**.
3. Complete the Google popup authorization (`drive.file` scope).
4. Confirm the status switches to **Connected**.
5. Click **Enable guest backup**. Each guest must accept the recording prompt; check that their backup is confirmed.

Uploads go to the `recordings` folder by default. To choose another folder:

`&recordfolder=YourFolderName`

## Dropbox

Connect Dropbox under **Recording settings** to upload the host's recordings after Stop.

1. Click **Connect** next to **Dropbox**.
2. Complete the Dropbox popup authorization.
3. Confirm the status switches to **Connected**.

The OAuth flow can remember the connection for future sessions.

## Manual Dropbox token fallback

If popup auth is blocked in a kiosk or constrained environment, you can still provide a token manually:

* Paste a token into the Dropbox field under **Recording settings**, or
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

