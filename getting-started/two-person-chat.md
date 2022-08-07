# Two person chat

![](<../.gitbook/assets/image (8).png>)

While you can achieve a multi-person chat with a [group room](rooms/), you can also do it without it.

For example, `https://vdo.ninja/?view=id2&push=id1`

You’ll notice that here we have the link both PUSHing and VIEWing at the same time. This allows us to view a remote video and publish a video to others, using the same website tab. This has the advantage over using two-browser tabs as echo-cancellation will work with this approach, while with two-tabs it might not. It also is compatible with mobile-devices, where two-tabs isn’t likely feasible.

The downside of this approach is that you’ll need to create a custom link for every person. In this case,

`https://vdo.ninja/?view=id2&push=id1` and `https://vdo.ninja/?view=id1&push=id2`

If you go with a simple group room instead, you won’t need to personalize links in this way, but rather just have a single link for multiple guests.

For example, `https://vdo.ninja/?room=yourroomname`

or for something even cleaner, `https://vdo.ninja/yourroomname`
