# Multi-Person Chat

![](<../.gitbook/assets/image (21) (2).png>)

## Two-Person Chat

While you can achieve a multi-person chat with a [group room](rooms/), you can also do it without it.

For example, `https://vdo.ninja/?view=id2&push=id1`

You’ll notice that here we have the link both a PUSH and VIEW parameter. This allows us to view a remote video and publish our own video to others within a single browser tab. This has the advantage over using two browser tabs as echo-cancellation will work with this approach. It is also compatible with mobile devices where two browser tabs isn’t likely feasible.

The downside of this approach is that you’ll need to create a custom link for every person. In this case,

`https://vdo.ninja/?view=id2&push=id1` and `https://vdo.ninja/?view=id1&push=id2`

If you go with a simple group room instead, you won’t need to personalize links in this way, but rather just have a single link for multiple guests.

For example, `https://vdo.ninja/?room=yourroomname`

or for something even cleaner, `https://vdo.ninja/yourroomname`

## Three-Person Chat

To create a 3-person setup, you can list multiple streams IDs as VIEW values alongside the PUSH value into three different personalized links.

`https://vdo.ninja/?view=id1,id2&push=id3`

`https://vdo.ninja/?view=id1,id3&push=id2`

`https://vdo.ninja/?view=id2,id3&push=id1`
