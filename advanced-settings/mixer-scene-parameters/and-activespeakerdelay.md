---
description: This option can be used in conjunction with &activespeaker
---

# \&activespeakerdelay

To understand the effect of setting `activeSpeakerTimeout` to 2000 in the `activeSpeaker=1` mode, let's analyze the relevant parts of the code:

When `activeSpeaker` is 1 (or 3), the code aims to show only one speaker at a time - the loudest or last-loud speaker. The `activeSpeakerTimeout` affects how quickly the system switches from one active speaker to another. Here's what happens:

1. Without `activeSpeakerTimeout` (or when it's set to 0):
   * The system immediately switches to the new loudest speaker.
   * As soon as a speaker is no longer the loudest, their `defaultSpeaker` status is set to `false` immediately.
2. With `activeSpeakerTimeout` set to 2000 (2 seconds):
   * When a speaker is no longer the loudest, instead of immediately setting their `defaultSpeaker` status to `false`, the system sets a timeout.
   * If the speaker doesn't become the loudest again within 2 seconds, their `defaultSpeaker` status is then set to `false`.

The key difference is in these lines:

```javascript
javascriptCopyif (!session.activeSpeakerTimeout) {
    session.rpcs[loudestActive].defaultSpeaker = false;
    changed = true;
    log(loudestActive + " is loudest but not speaker anymore");
} else {
    session.rpcs[loudestActive].defaultSpeaker = setTimeout(
        function (uuid) {
            session.rpcs[uuid].defaultSpeaker = false;
            updateMixer();
        },
        session.activeSpeakerTimeout,
        loudestActive
    );
}
```

This creates a "grace period" of 2 seconds, which has several effects:

1. It prevents rapid switching between speakers if multiple people are speaking with similar volume levels.
2. It allows for brief pauses in speech without immediately switching to another speaker.
3. It creates a smoother transition between speakers, especially in scenarios with multiple active participants.

In essence, setting `activeSpeakerTimeout` to 2000 makes the system more "patient" before switching speakers, which can lead to a more stable and less distracting visual experience for participants in the call, especially in active discussions where speaker dominance might fluctuate rapidly.
