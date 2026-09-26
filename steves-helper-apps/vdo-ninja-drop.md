---
description: Share files directly between computers and phones with VDO.Ninja Drop, using a download link or QR code.
---

# VDO.Ninja Drop

[VDO.Ninja Drop](https://vdo.ninja/drop) is a free browser-based file sharing tool. Select files, share a download link, and keep the sending tab open. No account or app installation is required.

## Share files

1. Open [vdo.ninja/drop](https://vdo.ninja/drop) on the device with your files.
2. Keep the suggested four-word **Share name**, or enter your own and choose **Apply name**. Names can contain 1–64 letters, numbers, hyphens, or underscores and are case-sensitive.
3. Choose **Choose files**, or drag files onto the page. You can select multiple files, including documents, photos, videos, and ZIP archives.
4. Choose **Copy link** and send the link to your recipient.
5. Keep the tab open and your device awake while recipients download. The page shows connected recipients and transfer progress.

Links look like `https://vdo.ninja/drop?view=cedar-river-lunar-otter`. Anyone who knows the name can download while you are sharing, so avoid easy-to-guess names. Names are not reserved: if another Drop sender is using the same name, choose a different one. Drop uses its own VDO.Ninja salt to separate these shares from regular stream IDs.

Use **Remove** to stop sharing one file, or **Stop sharing** to remove all files. The share name is locked while files are selected; stop sharing before changing it. Refreshing always clears the file selection. The bare sender page generates a new name each time; after **Apply name**, its `?share=...` URL keeps that name for reuse. Older sharing links with a password fragment still work.

## Send to your phone with a QR code

After selecting files, choose **Show QR code** next to **Copy link**. Open your phone's camera, scan the code, and open the download page. Choose **Download** for a file or **Download all** to queue the available files.

The QR code contains the same full download link as **Copy link**. Keep the sender's tab open while the phone downloads. **Hide QR code** collapses the code without stopping the share.

## Download files

Recipients see the shared filenames and sizes. Downloads run one at a time; individual selections can also be queued. **Download all** queues available files that have not already been received during the current page session.

Allow multiple downloads if your browser asks, and check the browser's downloads list for the saved files. A transfer can be cancelled and retried; retrying starts the file again. If the sender disconnects, the page shows that it is waiting to reconnect.

## Folders and availability

* ZIP a folder before selecting it. Drop currently shares files and existing archives; it does not create ZIPs or preserve a folder tree itself.
* Both devices must stay connected. Files are sent from the sender's browser and are not stored for later downloads when the sender is offline.
* Each recipient receives a separate transfer, so several simultaneous recipients share the sender's available upload bandwidth.
* Transfers use VDO.Ninja's WebRTC connections, including TURN relay when needed. The QR code opens the download page; it does not contain the files.

To stream a video or audio file as a live source instead, see [\&fileshare](../source-settings/and-fileshare.md).
