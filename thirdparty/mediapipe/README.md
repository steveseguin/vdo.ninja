MediaPipe assets vendored for local-only runtime loading.

Files:
- `tasks-vision/*` from `@mediapipe/tasks-vision@0.10.14` (Apache-2.0)
- The browser bundle uses a `.js` filename locally so basic static servers send a JavaScript MIME type; its contents are otherwise the upstream ESM bundle.
- `models/selfie_segmenter_landscape_float16.tflite` from the MediaPipe model bucket
- `models/blaze_face_short_range_float16.tflite` from the MediaPipe model bucket
- `models/face_landmarker_float16.task` from the MediaPipe model bucket

Upstream sources:
- https://registry.npmjs.org/@mediapipe/tasks-vision/-/tasks-vision-0.10.14.tgz
- https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/1/selfie_segmenter_landscape.tflite
- https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite
- https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task

License:
- Package license metadata: Apache-2.0 (`tasks-vision/package.json`); full text in [LICENSE](LICENSE).
- Keep upstream notices when updating these files.

Model licenses:

The following Google model cards explicitly identify Apache License, Version 2.0 for the models. The full license text is included in [LICENSE](LICENSE).

| Local model file | License | Google model-card evidence |
| --- | --- | --- |
| `models/selfie_segmenter_landscape_float16.tflite` | Apache-2.0 | [Selfie Segmentation](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Selfie%20Segmentation.pdf), covering both general and landscape models. |
| `models/blaze_face_short_range_float16.tflite` | Apache-2.0 | [BlazeFace Short Range](https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20%28Short%20Range%29.pdf). |
| `models/face_landmarker_float16.task` | Apache-2.0 | [BlazeFace Short Range](https://storage.googleapis.com/mediapipe-assets/MediaPipe%20BlazeFace%20Model%20Card%20%28Short%20Range%29.pdf), [FaceMesh V2](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20MediaPipe%20Face%20Mesh%20V2.pdf), and [Blendshape V2](https://storage.googleapis.com/mediapipe-assets/Model%20Card%20Blendshape%20V2.pdf). |

Google's [Face Landmarker guide](https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker#models) identifies the three components of the model bundle and links their model cards. These references document the models' upstream licenses; they do not relicense the models under VDO.Ninja's examples MIT license. Preserve the license and upstream notices when redistributing these assets.
