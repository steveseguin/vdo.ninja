---
description: Adds a message the guest will see when joining the room
---

# \&welcome

## Aliases

* `&entrymsg`

## Options

|          |                                                      |
| -------- | ---------------------------------------------------- |
| (string) | the message the guest will see when joining the room |

## Details

You can set a message on the guest-invite link that appears as an overlay, appearing to be from the director, once the guest joins the stream.

example: `https://vdo.ninja/?welcome=hello`

![](<../.gitbook/assets/image (133).png>)

The message can be URL encoded, to allow for spaces and special characters. recommended. You can do so with this tool: [https://www.urlencoder.org](https://www.urlencoder.org)

You can also activate the welcome message as a director via a new toggle option. When selected, it offers the director an input text prompt and then auto-encodes the message for the director to the guest invite link.\
\
![](<../.gitbook/assets/image (127) (1).png>)
