---
description: >-
  Enables viewing a specific slot from a scene link when the director is using
  &slotmode
---

# \&viewslot

The `&viewslot` parameter enables viewing a specific slot from a scene link when the director is using `&slotmode`. This creates a single-video view of whatever is assigned to that slot number.

## Usage

Basic syntax for viewing a specific slot:\
\
`/?scene&viewslot=1&room=ROOMNAME`

## Key Features

The `&viewslot` parameter provides single-video viewing of slot assignments with these characteristics:

* Only shows content from the specified slot number
* **Automatically updates when new guests join** and are assigned slots
* Dynamically updates when directors change slot assignments
* Optimizes performance by only loading the visible video stream
* Disables layouts and auto-mixing functionality
* Requires director to be using `&slotmode`

### Auto-Update Behavior

Scene links using `&viewslot` automatically receive slot assignment updates whenever:

* A new guest joins and is assigned to the specified slot
* The director manually reassigns slots
* A guest disconnects, freeing their slot

This means you don't need to refresh the scene link when guests join or leave.

## Performance Optimization

By default, only the visible video stream is connected to reduce CPU and network load. Two parameters control this behavior:

```
&nohiddensceneoptimization    # Prevents optimization of hidden elements
&hiddenscenebitrate=VALUE     # Sets custom bitrate for hidden videos (default: 0)
```

## Related Parameters

#### Slot Assignment (`&slot`)

Guests can specify their preferred slot assignment:

```
&slot=N    # N is the desired slot number (1 or higher)
&slot=0    # Exclude this guest from slot assignments
```

Using `&slot=0` allows guests (like instructors or control room operators) to join without consuming a slot.

### Fixed Slot Count (`&slots`)

Forces a specific number of slots in the auto-mixer:

```
&slots=N    # N is the desired number of slots
```

### Slot Mode (`&slotmode`)

Director parameter enabling slot assignment functionality:

```
&slotmode    # Enables slot management for directors
```
