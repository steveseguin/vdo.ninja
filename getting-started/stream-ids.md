# What are stream IDs?

Stream IDs are not magical in any way and can be manually or automatically created and reused.

Use [`https://vdo.ninja/?push=STREAMID`](https://vdo.ninja/?\&push=STREAMID) to publish a video and [`https://vdo.ninja/?view=STREAMID`](https://vdo.ninja/?\&view=STREAMID) to remotely view it. If you don't manually specify a stream ID, VDO.Ninja will sometimes generate one for you. You can reuse the generated stream ID if you wish.

Stream IDs only exist when they are actively used; once you stop using a stream ID, it no longer exists until it is used again.

### Additional technical details of stream IDs

* When in a group room, a stream ID can only be accessed from within that same room, unless transferred to a new room by the room's director.
* To make up a valid stream ID of your own, choose something with less than 51-characters of length and ensure it's AlpHaNuMerIc-only.
* A stream ID must not already be in active use, else you will be provided with an error stating this. This isn't the case when using a password however, as the password AND the stream ID must be the same in this case for the stream ID to be considered _already in use_. So, you technically can reuse the same stream IDs, changing only the password, if security is a concern. Even still, you should try to keep stream ID's confidential and change them when appropriate.
* You can use the [`&label`](../general-settings/label.md) property to give a name to a stream, rather than using a stream ID to do the same. Using this strategy of using securely-named stream IDs, while using labels to assign a name to a stream, will improve security and unlock new options, like lower-third display name overlays.
* A director does have a stream ID, and they can be manually assigned to a director in the same way they are assigned to any publisher.
* When a guest shares their screen, while also sharing their webcam, the screen share stream will get its own stream ID. Adding [`&ssid`](../source-settings/screenshareid.md) to the guest link can have the stream ID for that screen share be predictable, appending `_ss` as a value. Otherwise, the screen share stream may have a random stream ID.
