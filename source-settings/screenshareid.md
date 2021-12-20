---
description: >-
  Pre-sets the screenshare stream id for a screen share if its a secondary
  stream
---

# \&screenshareid

## Aliases

* `&ssid`

## Options

| Value    | Description                                                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| (string) | Pre-sets the screenshare id. Useful to automate or prepare stuff in advance.                                                                    |
| {empty}  | If no value is passed, the system will automatically add the suffice of "\_screenshare" to the existing stream ID that the user might be using. |

## Details

When screen sharing as a guest in a group room, the screen share will now create a second stream for the screen share, keeping your webcam also.

\
This will preset the ID the screenshare will have, making things easier to predict and prep for.

Without this, the screen share ID is random, which is a decision made to increase security. This complication will be addressed in the future.
