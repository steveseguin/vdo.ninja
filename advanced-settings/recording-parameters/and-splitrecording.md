---
description: Reference for the &splitrecording URL parameter in VDO.Ninja including behavior examples and related options.
---

# &splitrecording

#### **Description**

Enables automatic splitting of browser-based recordings into multiple file segments to prevent data loss and enable incremental saving.

#### **Sender-Side Option**

When recording locally in the browser (using [`&record`](and-record.md)), this parameter splits the recording into multiple files at specified intervals.

#### **Usage**

* **`&splitrecording`** - Splits recordings every 5 minutes (default)
* **`&splitrecording=10`** - Splits recordings every 10 minutes
* **`&splitrecording=1`** - Splits recordings every 1 minute

#### **Examples**

```
https://vdo.ninja/?push=streamID&record&splitrecording
https://vdo.ninja/?push=streamID&record&splitrecording=15
```

#### **Details**

* Each file segment is approximately 30MB at 720p for 5 minutes of recording
* Files are saved with numbered suffixes (e.g., `recording.webm`, `recording.webm_1`, `recording.webm_2`)
* Only the first file contains the media header information
* Segments must be concatenated to create a playable video file
* If battery reaches 2% on mobile/laptop, recording automatically saves and starts a new segment

#### **File Concatenation**

To combine the segments into a single playable file:

**Windows Command Prompt:**
```bash
copy /b recording.webm + recording.webm_1 + recording.webm_2 output.webm
```

**FFmpeg (cross-platform):**
```bash
ffmpeg -i "concat:recording.webm|recording.webm_1|recording.webm_2" -c copy output.webm
```

#### **Notes**

* Helps prevent complete data loss if the browser crashes
* Enables cloud upload of recording chunks while still recording
* Minimum value is 1 minute
* Feature requires Chrome/Chromium-based browsers for battery detection

#### **Related Parameters**

* [`&record`](and-record.md) - Enables local recording
* [`&autorecord`](and-autorecord.md) - Automatically starts recording