---
description: >-
  Tells the remote source that you would like them to prioritize the audio
  stream over other streams.
---

# \&enhance

## Details

Tells the remote source that you would like them to prioritize the audio stream over other streams.

* May not be compatible with all remote sources; depends on the browser they have
* Prioritizing audio may cause problems elsewhere, such as for other viewers or for video streams
* Prioritization applies to both encoding and networking sending of audio packets
* May override custom ptime values.
* This option may be useful in reducing audio 'clicking', but likely will be just as effective as a placebo.

For advanced users, this sets the following of the audio's stream: `networkPriority = "high";` `priority = "high";` `adaptivePtime = true;`

For more details, please see: [https://www.w3.org/TR/webrtc-priority/#dom-rtcrtpencodingparameters-networkpriority](https://www.w3.org/TR/webrtc-priority/#dom-rtcrtpencodingparameters-networkpriority)
