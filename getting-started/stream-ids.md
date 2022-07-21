# What are stream IDs?

Stream IDs are not magical in any way and can be manually or automatically created and reused.

Use [`&push=STREAMID`](../source-settings/push.md) to publish a video and [`&view=STREAMID`](../advanced-settings/view-parameters/view.md) to remotely view it. If you don't manually specify a stream ID, VDO.Ninja will sometimes generate one for you. You can reuse the generated stream ID if you wish.

Stream IDs only exist when they are actively used; once you stop using a stream ID, it no longer exists until it is used again.

### Additional technical details of stream IDs

{% hint style="info" %}
When in a group room, a stream ID can only be accessed from within that same room, unless transferred to a new room by the room's director.
{% endhint %}

{% hint style="info" %}
To make up a valid stream ID of your own, choose something with less than 51-characters of length and ensure it's AlpHaNuMerIc-only.
{% endhint %}

{% hint style="info" %}
A stream ID must not already be in active use, else you will be provided with an error stating this. \
\
This isn't the case when using a password however, as the password AND the stream ID must be the same in this case for the stream ID to be considered _already in use_. So, you technically can reuse the same stream IDs, changing only the password, if security is a concern. Even still, you should try to keep stream ID's confidential and change them when appropriate.
{% endhint %}

{% hint style="info" %}
You can use the [`&label`](../general-settings/label.md) property to give a name to a stream, rather than using a stream ID to do the same. Using this strategy of using securely-named stream IDs, while using labels to assign a name to a stream, will improve security and unlock new options, like lower-third display name overlays.
{% endhint %}

{% hint style="info" %}
A director does have a stream ID, and they can be manually assigned to a director in the same way they are assigned to any publisher.
{% endhint %}
