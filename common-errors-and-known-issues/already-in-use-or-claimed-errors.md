---
description: '"The stream ID you are publishing to is already in use" and other such errors'
---

# Already in use or claimed errors

### "The stream ID you are publishing to is already in use"

Understanding[ stream IDs](../getting-started/stream-ids.md) will help potentially avoid these errors in the future, but the basic notion is any media stream being published over VDO.Ninja needs to register itself with a stream ID.  This is specified by using the [\&push](../source-settings/push.md) URL parameter, such as \&push=STREAMID.

The moment you connect to the system or start streaming, your stream ID gets registered to your connection, and so as long as you remain connected and online, you keep that stream ID. If you close the browser, hang up, or lose your Internet connection, then your stream ID unregisters automatically as well.

If a stream ID you are trying to claim is already in use by another stream, and that other connection is still actively online, then you'll get an error about it being already in use. In this case, you will need to wait for that other user to hang up or disconnect before you can attempt to register the stream ID yourself.

There are some subtleties to the above, such as if using passwords or self-hosted instances of VDO.Ninja, then stream IDs are isolated to their own unique realm, allowing you to use the same stream ID as someone else from a different realm.  So if a stream ID is already in use, you can just change or add a password, and that will resolve the issue.

Of course, when you want to invite several people to a group room, you can't have different passwords, so you will want each guest to have their own unique stream ID still. By default with VDO.Ninja, if you do not use `&push` in the URL to specify a stream ID, then VDO.Ninja will auto generate a random stream ID for the guest. The system will also auto add the `&push=STREAMID` parameter to the guest's URL, so if the guest refreshes their page, they will keep the same stream ID.

The above is where there are sometimes issues, as if you join a room without a \&push value specified, and then after connecting connecting you copy/share your URL with someone else, your URL might now contain your stream ID.  When you then share it with someone else, they won't be able to connect as you are already using the stream ID that is specified.

In the above case, when distributing invite URLs to guests, either ensure each guest has a unique stream ID assigned to them, or ensure that there is no `&push` parameter added to the URL, allowing the system to generate a random stream ID for each guest.\
\
Manually creating a stream ID for each guest is recommended if you want each guest to appear in the same solo-view-link every time they re-join, as otherwise they may have a random new stream ID everytime they join. Many show producers will use a spreadsheet to keep track of who has what stream ID, their settings, and the corresponding invite link. Some of these spreadsheets are pretty sophisticated, with the ability to generate obfuscated invite links based on a few parameters.\
\
If manually creating stream IDs, please just note that they need to be alphanumeric, with no special characters, are should be ideally less than roughly 30-characters long. If using a password, the uniqueness of the stream ID doesn't matter so much, but if not using a password, please ensure you create unique values that can't be easily guessed or accidentally duplicated by someone else.

Additional tools and options are available to create and assign stream IDs, such as [\&permaid](../advanced-settings/setup-parameters/and-permaid.md),  and other methods to store stream IDs via local user storage, but those options are out of the scope of this article.

### "The room is already claimed by someone"

This error indicates that there is already someone in a group room that has joined the room in the role of a director.  The first director to join a room claims the room as theirs, and it remains theirs until they go offline or close their browser, as the room is assigned to their active connection. Another director will then be able to claim the room then, once the main director disconnects.

Claiming a room doesn't inherently mean much, other than anyone who joins the room will only acknowledge them as the main director. Acknowledging someone as a director will simply mean that director has certain privileges when requesting actions of a guest or scene. A validated director can ask a guest to hang up, for example, while otherwise such a request will be rejected.\
\
Since VDO.Ninja is built on the concept of peer to peer connections, claiming a room is the same concept as claiming a stream ID, and those claims are tied to your active connections. Everything beyond that is really a matter of peers agreeing to a certain set of rules amongst themselves. If someone does claim a room and forgets to close their browser, you'll need to close that browser, change rooms, or change room passwords if you wish to have someone else become the main director.

