---
description: Will ask the user for content to remote change their camera or microphone
---

# \&consent

Sender-Side Option! ([`&push`](push.md))

## Details

Adding to the guest's invite link will either alert the guest or seek permission of the guest to remotely change their camera or mic without further approval.

For privacy reasons, without this flag a director of a room will need to have the guest approve a remote camera or microphone change. With this flag added however, the consent to do so will be obtained on the initial connection, allowing the director to change cameras or mics of the guest without blockers.

![](<../.gitbook/assets/image (102) (1) (1) (1).png>)

### On alpha

Added "change URL" permissions to the `&consent` flag. That is, when using `&consent` on the guest URL, the director can remotely change the guest's URL without additional permission -- it will just change.

## Related

{% content-ref url="../general-settings/remote.md" %}
[remote.md](../general-settings/remote.md)
{% endcontent-ref %}
