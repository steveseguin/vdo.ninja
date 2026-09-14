This folder primarily contains third-party libraries; MIT/Apache2.0 licenced.

Most the files are superficially needed and not required for the core function of VDO.Ninja; most anyways.

Included here:
- jsSHA 3.3.0 in `jssha/` for the OBS authentication fallback (BSD-3-Clause); see [provenance](jssha/README.md) and the full [license notice](jssha/LICENSE).
- Three.js 0.160.0 in `three/` for the WebXR examples; see [provenance and MIT notice](three/README.md). The Jeeliz version remains separate.
- Chart.js 3.9.1 in `chartjs/` for codec comparison; see [provenance and the Chart.js/@kurkle/color MIT notices](chartjs/README.md).
- Leaflet 1.9.4 in `leaflet/` (BSD-2-Clause), used by the map example; see [provenance](leaflet/README.md) and the full [license notice](leaflet/LICENSE).
- WebMidi.js 3.0.1 in `webmidi3.js` (Apache-2.0), including djipevents; see [webmidi3.js.LICENSE](webmidi3.js.LICENSE).
- TensorFlow.js libraries in `tfjs/` (Apache-2.0 with separately licensed embedded components); see [tfjs/README.md](tfjs/README.md) and [tfjs/LICENSE](tfjs/LICENSE).
- WebRTC adapter in `adapter.js` (BSD-3-Clause); the full upstream notice is in [adapter.js.LICENSE](adapter.js.LICENSE). Preserve the existing file-level copyright notices as well.
- CryptoJS 3.1.2 in `aes.js` retains its original BSD-3-Clause notice in [aes.js.LICENSE](aes.js.LICENSE), sourced from the original project's archived license page.
- jsQR 1.4.0 in `thirdparty/jsqr.min.js`, used by `qr.html` (Apache-2.0). Copyright (c) 2016 Cosmo Wolfe; the full license is in [jsqr.LICENSE](jsqr.LICENSE), copied from the [jsQR 1.4.0 package](https://cdn.jsdelivr.net/npm/jsqr@1.4.0/LICENSE). The bundle header records its source URL.
- MediaPipe Tasks Vision + selfie segmenter model in `thirdparty/mediapipe/` (Apache-2.0)
- JsSIP 3.10.1 browser bundle in `thirdparty/jssip-3.10.1.min.js` (MIT), generated from the npm package for the experimental `&callin=sip` path. The upstream copyright and license notice is in `jssip-3.10.1.LICENSE` (source: https://github.com/versatica/JsSIP/blob/3.10.1/LICENSE).
- Twilio Voice JavaScript SDK 2.18.3 in `thirdparty/twilio-voice-sdk-2.18.3.min.js` (Apache-2.0); provenance and bundled notices are in the matching `SOURCE.md` and `LICENSE.md` files.
- Dropbox JavaScript SDK 10.34.0 in `thirdparty/dropbox-sdk-10.34.0.min.js` (MIT); provenance and license are in the matching `SOURCE.md` and `LICENSE` files.

## MIT notices

Keep these companion notices with the corresponding files when copying or redistributing them. Bundled dependencies retain their own licenses, including any non-MIT notices collected in a bundle's companion file. These notices do not relicense other VDO.Ninja code or assets.

| Library or borrowed code | Files covered | Notice |
| --- | --- | --- |
| StreamSaver | `StreamSaver.js`, `StreamSaver_legacy.js`, `sw.js`, `mitm.html` | [StreamSaver.LICENSE](StreamSaver.LICENSE) |
| jQuery 3.6.0 | `jquery/jquery-3.6.0.js`, including Sizzle | [jquery-3.6.0.js.LICENSE](jquery/jquery-3.6.0.js.LICENSE) |
| jQuery UI 1.13.1 | `jquery/jquery-ui.js`, stylesheet and theme assets | [jquery-ui.LICENSE](jquery/jquery-ui.LICENSE) |
| Web Streams Polyfill | `polyfill.min.js` | [polyfill.min.js.LICENSE](polyfill.min.js.LICENSE) |
| Inspector Bokeh and canvasfilters | `measureBlur.js`, `focus_worker.js`, `canvasFilters.js` | [inspector-bokeh.LICENSE](inspector-bokeh.LICENSE) |
| A-Frame 1.5.0 | `aframe.min.js` and bundled components | [aframe.min.js.LICENSE](aframe.min.js.LICENSE) |
| Tween.js | `jeeliz/Tween.min.js`, including easing equations | [Tween.min.js.LICENSE](jeeliz/Tween.min.js.LICENSE) |
| Three.js | `jeeliz/three/v112/three.min.js` | [three.LICENSE](jeeliz/three/three.LICENSE) |
| glfx.js | `../filters/dog/libs/glfx.js` | [glfx.js.LICENSE](../filters/dog/libs/glfx.js.LICENSE) |
| Context Filter Polyfill blur code | The David Enke blur implementation credited in `../lib.js` | [context-filter-polyfill.LICENSE](context-filter-polyfill.LICENSE) |

Where an exact version is not recorded or recovered, the companion notice distinguishes the license reference from the bundled version. Existing complete notices in `CodecsHandler.js` and `qrcode.min.js`, and the separate Longpipe, JsSIP, Dropbox, and example-library notices, must also be preserved.
