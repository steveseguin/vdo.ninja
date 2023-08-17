# Can't auto-start screen sharing

Browsers won't let you auto-start a screen share, as it will require a user's input to select the source. You can configure the screen share pop up to show certain screen share options instead of others, but you'll still need to manually select which source to capture.

There are still some other options though that might work for your use case:

* The[ Electron Capture app](../steves-helper-apps/electron-capture/) can be configured to allow for automatic screen sharing, which is useful if you want to start the screen share from command line or as a quickstart icon.
* OBS Studio can be used for screen capturing, and then when needed, you can have VDO.Ninja auto-select the OBS Virtual Camera as a source, since it can be selected automatically as a web camera.
* If you don't want to have to start OBS or are already running it, there's a virtual camera driver that will let you select screen shares as a source. [See here](https://github.com/rdp/screen-capture-recorder-to-video-windows-free).
