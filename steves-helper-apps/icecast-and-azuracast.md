---
description: Publish VDO.Ninja audio to Icecast or AzuraCast from a browser tab.
---

# Icecast and AzuraCast audio publishing

VDO.Ninja can act as a browser-based source client for Icecast-compatible radio servers. This is useful when you want a VDO.Ninja audio-only source to publish directly into Icecast, AzuraCast, or another compatible mount.

The setup helper is here:

{% embed url="https://vdo.ninja/icecast" %}
[https://vdo.ninja/icecast](https://vdo.ninja/icecast)
{% endembed %}

The alpha helper is here:

{% embed url="https://vdo.ninja/alpha/icecast" %}
[https://vdo.ninja/alpha/icecast](https://vdo.ninja/alpha/icecast)
{% endembed %}

The helper builds a normal VDO.Ninja source URL with `&push` and `&icecastpush` enabled. Keep that source tab open while broadcasting; it captures the local audio and publishes it to the Icecast-compatible source endpoint.

There is also an optional relay mode that builds a `&view` URL with `&icecastview`. Relay mode is for cases where another VDO.Ninja source is already live and you want a second browser tab to listen to that stream and forward it to Icecast/AzuraCast.

## Basic workflow

1. Choose the VDO.Ninja stream ID you want to publish. For example:

   `FUSION_ONLINE`

2. Open the Icecast helper:

   `https://vdo.ninja/icecast`

3. Leave **Publish local audio with &push** selected and enter the stream ID, such as `FUSION_ONLINE`.

4. Enter your Icecast or AzuraCast source details. Use the source/ingest endpoint, not the public listener URL.

5. Click **Generate**, then **Open**.

The generated source URL will look similar to:

`https://vdo.ninja/?push=FUSION_ONLINE&audioonly&proaudio&icecastpush&icecastauto=1`

If the source settings are saved in the browser, the generated URL can avoid putting the source password in the address bar. If the URL needs to be portable to another machine, enable **Include source credentials in the generated URL**, but treat the resulting link like a password.

## Optional relay workflow

If the audio is already being sent into VDO.Ninja from another browser, use **Relay an existing VDO.Ninja stream with &view** in the helper. This creates a second browser tab that receives that VDO.Ninja audio and publishes it to Icecast/AzuraCast:

`https://vdo.ninja/?view=FUSION_ONLINE&novideo&proaudio&icecastview&icecastauto=1`

## AzuraCast compatibility

Yes, this should work with AzuraCast when the station exposes an Icecast-compatible source mount. Use the station's source connection details, usually the source username, source password, host/port, and mountpoint.

Do not use the public listener URL, such as an `/listen/` URL. VDO.Ninja needs the source endpoint that accepts a live encoder/source connection.

AzuraCast deployments vary, so the accepted audio format depends on the station and mount configuration. AAC is the default in VDO.Ninja when the browser supports it. Ogg Opus or WebM Opus can also be selected, but the Icecast/AzuraCast mount must accept that format.

## URL parameters

Use an explicit mode flag to enable Icecast/AzuraCast publishing:

* `&icecastpush` publishes the local audio from the same `&push` source tab.
* `&icecastview` publishes received remote audio from a `&view` or scene/room relay tab.

Do not use a generic `&icecast` flag for room workflows. A room can have both local and incoming audio, so the mode must be explicit.

| Parameter | Aliases | Purpose |
| --- | --- | --- |
| `&icecastpush` | `&icecastlocal`, `&icecastmic` | Publishes this tab's local VDO.Ninja source audio. Use with `&push`. |
| `&icecastview` | `&icecastremote`, `&icecastfromview` | Publishes received VDO.Ninja audio. Use with `&view`, `&scene`, or a receive-only relay tab. |
| `&icecastauto=1` | `&icecastautostart=1` | Starts publishing automatically once audio is available and settings are complete. |
| `&icecasttarget=` | `&icecasturl`, `&icecastsource` | Full Icecast-compatible source URL, including mountpoint. |
| `&icecastserver=` | `&icecasthost` | Server URL when you want VDO.Ninja to combine it with `&icecastmount`. |
| `&icecastmount=` | `&icecastmountpoint` | Mountpoint to append to `&icecastserver`. |
| `&icecastuser=` | `&icecastusername` | Source username. Defaults to `source`. |
| `&icecastpassword=` | `&icecastpass`, `&icecastsourcepassword` | Source password. |
| `&icecastformat=` | `&icecastmime`, `&icecasttype` | Audio format. Common values: `audio/aac`, `audio/ogg;codecs=opus`, `audio/webm;codecs=opus`. |
| `&icecastbitrate=` | `&icecastab` | Audio bitrate in bits per second or kbps. For example, `128000` or `128`. |
| `&icecastname=` |  | Stream name metadata. |
| `&icecastgenre=` |  | Genre metadata. |
| `&icecastdescription=` | `&icecastdesc` | Description metadata. |
| `&icecastpublic=1` |  | Marks the stream public in Icecast metadata. |
| `&icecastrelay=` | `&icecastrelayurl` | Optional relay URL. VDO.Ninja uses its default relay unless this is set to `0`, `false`, `direct`, or `none`. |
| `&icecastrelaytoken=` |  | Token for private/custom relay deployments. |
| `&icecaststream=` | `&icecastsid` | In relay/view mode, selects which received stream should be published if the viewer receives multiple streams. |

## URL examples

Publish local audio to VDO.Ninja and Icecast/AzuraCast from the same source tab:

`https://vdo.ninja/?push=FUSION_ONLINE&audioonly&proaudio&icecastpush&icecastauto=1`

Include source settings directly in the URL:

`https://vdo.ninja/?push=FUSION_ONLINE&audioonly&proaudio&icecastpush&icecasttarget=https%3A%2F%2Fradio.example.com%3A8000%2Fstream&icecastuser=source&icecastpassword=SOURCE_PASSWORD&icecastauto=1`

Build the source endpoint from server plus mount:

`https://vdo.ninja/?push=FUSION_ONLINE&audioonly&proaudio&icecastpush&icecastserver=https%3A%2F%2Fradio.example.com%3A8000%2F&icecastmount=stream&icecastpassword=SOURCE_PASSWORD`

Force direct publishing without the relay:

`https://vdo.ninja/?push=FUSION_ONLINE&audioonly&proaudio&icecastpush&icecastrelay=0&icecasttarget=https%3A%2F%2Fradio.example.com%3A8000%2Fstream&icecastpassword=SOURCE_PASSWORD`

Relay an existing VDO.Ninja source from a second browser tab:

`https://vdo.ninja/?view=FUSION_ONLINE&novideo&proaudio&icecastview&icecastauto=1`

## Browser and relay notes

The publishing happens from the browser tab. Some Icecast servers do not accept browser uploads directly because of CORS, HTTPS, mixed-content, or firewall rules. VDO.Ninja uses an Icecast relay by default to avoid many of those browser limitations.

If your Icecast/AzuraCast source endpoint is available over HTTPS and supports browser CORS uploads, direct publishing may work. If not, leave the relay enabled.

For HTTP-only servers loaded from the HTTPS VDO.Ninja site, the relay is normally required because browsers block mixed-content uploads.

## Troubleshooting

* If the VDO.Ninja page says **Waiting for VDO.Ninja audio**, confirm the microphone/source is active. In relay mode, also confirm the remote sender is live and that the `&view=` stream ID is correct.
* If the Icecast server rejects the stream, confirm the source URL, username, password, mountpoint, and accepted audio format.
* If you are using AzuraCast, copy the source connection details from the station profile instead of the public listening link.
* Keep the generated viewer tab open for the full broadcast. Closing it stops the Icecast/AzuraCast source.
