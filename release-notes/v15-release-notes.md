# v15

* [macOS support](v15-release-notes.md#macOS-support)
* [Local recording](v15-release-notes.md#local-recording)
* [Transcription](v15-release-notes.md#transcription)
* [UI/UX updates](v15-release-notes.md#ui-ux)
* [Director page](v15-release-notes.md#director-page)
* [New parameters](v15-release-notes.md#other-new-parameters)
* [More device data available](v15-release-notes.md#more-device-data-available)

## macOS Support

* VDO.Ninja is now natively supported by OBS on macOS. Update to v26.1.2 on macOS to access!

## Local recording

* Remote control local-media recording as been added to the Director's room as an option -- experimental, but a great way to record remote guests for post-processing. (Guest will need to upload the record file manually after the recording is stopped.)
* The `&record` flag is available now, which lets a guest record their own video by providing a RECORD button to their control bar.
* The default recording bitrate is 6000-kbps /w 130-kbps OPUS audio, but it can be set by the director remotely or passed as a value to \&record=NNN
* Setting the recording bitrate to 0 will enable Audio-only 32-bit PCM recording (webM container); negative values will record OPUS audio (no video).
* Supports Chrome, Firefox, Android, but not yet Safari.
* [https://vdo.ninja/convert](https://vdo.ninja/convert) has been created to allow for quick conversion of WebM container formats to other formats, such as MP4 or WAV. Attempts to also support videos with variable resolutions.

## Transcription

* Transcription /w Closed Captioning overlay has been added, although experimental. Uses default system mic as a source and cannot be muted.
  * `&transcribe=en-US` (or just `&trans`; added to the publisher).
  * `&cc` (will display the incoming text).
  * Won't work with Safari.
  * `&fontsize=100` can let you set font-size of the closed captions&#x20;

## UI/UX

* When creating a room, recommendations on room name selection and password usage is now offered.
* Audio network connection logic has been enhanced some more; addressing potential audio connection issues.
* Buttons when muted/disabled turn RED; versus just remain grey. Lots of related UI/UX fixes like this.
* If you leave \&push blank, it will auto assign a relatively secure stream ID for you now, automatically.
* `&fontsize=100` applies also to the `&label` / `&showlabel` font-size.
* Safari 14 on iOS will no longer ask for mic permissions if JUST viewing a webRTC stream.
* improvements made to the stats debug window (`CTRL + LeftClick`). More readable, hints for stereo provided, etc.
* A guest of a room can no longer access the audio/video advanced settings, such as echo-cancellation. Only the Director can.
* iOS devices now support `&stereo` for the purpose of high quality audio playback on iOS.
* The control bar can be dragged around on desktop. I prefer this over making videos smaller.
* Support for non-Latin characters are supported now with custom guest labels, text messages, and with CC/transcriptions.
* Made interface more accessible to the blind and those without a mouse. Tabbing around works with the main elements/buttons.

## Director page

* The Director can now STOP audio/video publishing after they have started it; screen share also now available for Directors.
* Director can dynamically edit/add a label for a remote guest in the control room.
* Link obfuscation is available as a toggle now in the Director's room and create-reusable invite link page ([invite.cam](https://invite.cam)).
* Director's room has been stylized; invite and scene link options have been consolidated a bit.

## Other New parameters

* `&mono` flag added. Lets a viewer force mono even if the `&stereo` flag is set.
* `&cleanish` flag is added; same as `&cleanoutput`, except shows the playbutton.
* More short-code aliases for common URL Parameters have been created.
* `&order=N` is a new parameter; let's you sort/reorder videos in a scene based on their ordered priority. Also dynamically controllable by the Director.

## More device data available

* Gyroscopic, accelerometer, magnetometer data is accessible now. Enable with `&sensor=30` (30hz). Results show up in the remote stats log or the remote IFRAME API. Useful for VR live streaming support, where you want to capture a smartphone's movement, as well as video.
