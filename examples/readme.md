# VDO.Ninja Examples

This directory contains various examples demonstrating different features and capabilities of VDO.Ninja. All examples are accessible through the index.html file.

## Licensing

The [MIT license](LICENSE) covers original example code that Steve Seguin owns or is authorized to sublicense. Third-party components retain their own copyrights and licenses; the example-code license does not replace their notices or relicense VDO.Ninja core, external assets, or hosted services.

- `360.html` and `360.js` are original MIT example code using the local A-Frame library; preserve its [A-Frame and bundled component notices](../thirdparty/aframe.min.js.LICENSE).
- The WebXR AR sender and receiver use local [Three.js 0.160.0](../thirdparty/three/README.md); preserve its [MIT notice](../thirdparty/three/LICENSE).
- `gtamap.html` uses locally bundled [Leaflet 1.9.4](../thirdparty/leaflet/README.md); preserve its [BSD-2-Clause notice](../thirdparty/leaflet/LICENSE). Map tiles still come from CARTO; the example retains its CARTO and OpenStreetMap credits.
- `midi.html` uses the locally bundled [WebMidi.js 3.0.1](../thirdparty/webmidi3.js); preserve its [Apache-2.0 and bundled dependency notices](../thirdparty/webmidi3.js.LICENSE).
- [`nes.min.css`](nes.min.css): [NES.css, Bootstrap Reboot, and Normalize.css license notices](nes.min.css.LICENSE).
- [`obs_remote/thirdparty/obs-websocket.min.js`](obs_remote/thirdparty/obs-websocket.min.js): [OBS WebSocket JavaScript library license notice](obs_remote/thirdparty/obs-websocket.min.js.LICENSE).

Keep these notices with the corresponding libraries when copying or redistributing them. Dependencies loaded from external URLs remain subject to their own licenses and service terms.

## Browse examples

Use the [examples catalogue](index.html) to browse the available examples, search by keyword, or filter by category.

## 360-degree viewer

Open [360.html](360.html) and enter a VDO.Ninja stream ID, or open a local equirectangular photo/video. For a direct live view, use `360.html?view=STREAM_ID` (with `password` if needed). The older `/360.html` address forwards here and preserves URL parameters.

Drag or use arrow keys to look around, scroll or use +/− to zoom, and use Reset view to recenter. Local videos have playback and sound controls. The A-Frame headset button is available where WebXR is supported. Live viewing uses the existing iframe frame API and requires HTTPS/localhost and video-frame processing support; local files do not connect to a VDO.Ninja session and are not uploaded.

## Usage

1. Open `index.html` in a web browser to see all examples organized by category
2. Click on any example to launch it
3. View the source code of each example to understand the implementation

## Notes

- Examples may require specific VDO.Ninja features or permissions
- Some examples work best when used with specific hardware or platforms
- Always check browser console for debugging information
- Many examples include inline documentation in their source code
