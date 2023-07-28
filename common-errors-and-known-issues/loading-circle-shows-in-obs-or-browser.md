# Loading circle shows in OBS or browser

The loading circle will appear in a VDO.Ninja view link if a video does not auto-load within several seconds or so.

It will be removed once the video connects, and won't re-appear unless the browser source/page is refreshed.

You can hide this loading circle by default by adding [`&cleanoutput`](../advanced-settings/design-parameters/cleanoutput.md) to the URL of the view link.

example: [`https://vdo.ninja/?view=ABC123abc&cleanoutput`](https://vdo.ninja/?view=ABC123abc\&cleanoutput)

This will hide other non-essentially UI elements as well, such as any error messages. In most cases, when a view link is loaded into OBS, most non-essentially elements are hidden by default.

It is also possible to customize the loading circle with other images.
