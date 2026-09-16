Longpipe vendor assets
======================

This directory vendors the Longpipe browser SDK runtime and video background model weights used by VDO.Ninja virtual background effects.

- SDK package: longpipe@0.0.12
- Upstream source commit: `bf67e8d62531a80eefc1d75ba3fb89e12076f86a`
- Upstream source (provenance only; never loaded at runtime): https://github.com/sb2702/longpipe/tree/bf67e8d62531a80eefc1d75ba3fb89e12076f86a
- Browser module: `./longpipe.js` (the `.js` suffix is required by VDO.Ninja's static hosts so it is served with a JavaScript MIME type)
- Browser module SHA-256: `af0895caf3ce6c3b6b8309684d22e83ecc725cf271444b9b3abcc5a9254b278f`
- SDK license: ./LICENSE
- Model version: 0.0.4
- Upstream model source (provenance only; never loaded at runtime): https://cdn.longpipe.dev/models/v/0.0.4/
- Model manifest and SHA-256 hashes: ./models/v/0.0.4/manifest.json
- Model weights license: ./models/v/0.0.4/WEIGHTS_LICENSE

All Longpipe runtime dependencies used by VDO.Ninja are hosted in this directory. The browser module contains no remote runtime URLs, its worker and worklet code is inlined, and VDO.Ninja pins model requests to `./thirdparty/longpipe/models/v/0.0.4/`.

Only video tier model weights are mirrored here. Longpipe audio denoise is disabled (`audio: "passthrough"`), and its unused assets are intentionally not included.

VDO.Ninja patch
---------------

`vdoninja-0.0.12.patch` is the complete source patch applied to the upstream commit. It keeps model loading local, adds selectable temporal matte modes, bounds frame queues, closes failed frame/bitmap resources, hardens worker errors/timeouts and teardown, avoids overlapping WebGPU timing fences, reduces per-frame telemetry overhead, exposes safe renderer diagnostics, adds opt-in protection from startup passthrough until the first rendered output, and makes worker/worklet inlining work on Windows build hosts.

The SDK runtime itself contains no VDO.Ninja spinner, branding, or demo UI. Those upstream demo assets are not vendored.

To reproduce the browser module from a clean upstream checkout:

1. Check out the source commit above.
2. Run `git apply /path/to/thirdparty/longpipe/vdoninja-0.0.12.patch`.
3. Run `npm ci`, `npm run typecheck`, and `npm run build`.
4. Copy `dist/index.js` to this directory as `longpipe.js`.

The upstream repository does not include all generated browser-test fixtures. The focused worker-controller, output-adapter, stabilizer, and autotune tests are the reproducible validation subset; VDO.Ninja's Playwright effects tests cover the vendored browser module.

VDO.Ninja background effects set `waitForFirstFrame: true`. The SDK default remains unchanged for other consumers. Development regression tests are maintained separately from this public release repository.
