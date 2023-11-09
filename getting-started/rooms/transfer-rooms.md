---
description: A powerful tool that allows a director to move guests to a different room
---

# How to transfer guests to other rooms

Sometimes you will want to move a user from one room to another. This is often the case if wanting to pre-screen users, or if you want to create break-out rooms. It also is a way to ensure when you kick a user out of a room, they cannot be allowed back in without express permission.

![The transfer room button appears as an option for each guest](<../../.gitbook/assets/image (2) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

### Details

When a user is transferred to another room, they no longer are the owner of that guest. The director of the room you transferred that guest to becomes the owner.

Only the main director can transfer users; anyone can be the director of a room -- it's first come first serve, so be sure to leave the director-window open if you wish to remain the director of a room

When a guest is transferred to a new room, they do not know which room they are transferred to. This allows for privacy and secrecy, allowing for the main landing room to act like a screening room.

The [`&queue`](../../general-settings/queue.md) command can be used in conjunction with rooms and transfer rooms. When you transfer a user from a queue, they will no longer be in any queue once transferred. When in queue, the guest will not be able to see anyone, but the director will be able to see them. When transferred out of the queue, they will be able to see everyone in the room.

If you transfer someone to a room, the passwords for both rooms need to match. This may change in the future.

If someone in a transfer room disconnects or refresh, they will end up back in the original landing room. This is for privacy and security reasons, as once a user is kicked out or disconnected, the expectation is they cannot enter the room again unless explicitly allowed. Be sure that any guest who is transferred has a stable connection; unstable mobile connections or connections using VPN services may get booted out every now and then.

### Alternative option

![An alternative to the transfer feature is the change URL function.](<../../.gitbook/assets/image (3) (1) (1) (1) (1) (1) (1) (1) (1) (1) (1).png>)

If you'd like to transfer a user to a new room, along with a new password or setting, you can use the Change URL option instead; as seen in the image above. The guest transferred in this fashion WILL be able to see the room they were transferred to, along with any new password. If they get disconnected or if they refresh, they will stay in the new room. This is quite useful if privacy and security are not urgently needed, as it allows for more robust options.

### Creating preset room destinations for quick transfers

There's an option called [`&rooms`](../../director-settings/rooms.md), which allows the director to list multiple room names via the URL. These rooms become buttons that the director can press to pre-arm the transfer button with.&#x20;

![](<../../.gitbook/assets/image (130) (1).png>)
