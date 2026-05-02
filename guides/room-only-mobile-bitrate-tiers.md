---
description: How VDO.Ninja balances higher guest room quality with mobile device safety
---

# Room-only mobile bitrate tiers

VDO.Ninja group rooms use peer-to-peer mesh networking by default. This means each guest may need to send a separate video stream to every other guest. A three-person call is usually easy. A five-person call can already mean four outbound video encodes per guest, plus scene or director connections if you are producing a show.

The default room behaviour has historically been conservative because VDO.Ninja is often used for production. In that workflow, the director or scene link is usually the priority, and guest-to-guest video is more of a confidence monitor. Keeping room preview bitrates low helps avoid overheating phones, saturating upload links, or causing audio dropouts.

For room-only calls, such as family calls or conferencing, VDO.Ninja can allow a higher room bitrate automatically when the call is only guests talking to other guests.

## When automatic room-only tiering applies

Automatic room-only tiering is intended for normal guests in a group room.

It applies when:

* the user is in a room as a guest
* the visible videos are other guests
* there is no director or scene viewer connected to that guest
* no explicit room bitrate has been set
* the room is not being redistributed through a production-oriented mode such as Meshcast or WHIP

It does not apply when the guest is connected to a director or scene viewer. In those cases, VDO.Ninja returns to production-safe behaviour unless you explicitly set bitrate parameters.

## Default tier values

The default automatic room-only budgets are:

| Tier | Intended device type | Default total room budget |
| --- | --- | --- |
| Tier 1 | weaker or stressed mobile devices | 1500-kbps |
| Tier 2 | normal or stronger devices | 2000-kbps |

The value is a total room budget, not a per-person bitrate. If a guest is watching three other guests, a 2000-kbps total budget is split across those visible videos, so each feed is requested at about 666-kbps.

Low-tier mobile senders are treated more carefully. If a weak mobile guest is in the same room, other guests will request less from that specific sender, while still allowing stronger senders to use the higher room-only budget.

## How device strength is estimated

Browser device detection is limited, so VDO.Ninja uses broad hints rather than exact phone model lists.

The main signals considered are:

* mobile versus desktop browser mode
* browser-visible CPU thread count
* browser-visible device memory, when available
* older iOS Safari/WebKit handling
* live WebRTC CPU pressure when available

Typical classification:

| Device signal | Likely tier |
| --- | --- |
| mobile device with fewer than 4 reported CPU threads | weak |
| mobile device with 2 GB or less reported memory | weak |
| mobile device with 8 or more reported CPU threads and at least about 6 GB memory | strong |
| mobile device with 4 or more CPU threads but not clearly high end | normal |
| modern iOS/iPadOS WebKit devices | generally normal or strong |
| unknown specs | normal fallback |

These are only hints. Browsers may hide or round system information for privacy. Chrome, Brave, Edge, Firefox, and Safari can expose different information. On iOS and iPadOS, Chrome, Firefox, Brave, and Safari are all WebKit-based for practical WebRTC behaviour, even if their browser names differ.

Runtime behaviour still matters. If a device starts showing CPU pressure while encoding, it can be treated more carefully even if its initial specs looked strong.

## Parameters to use

For normal room-only calls, you often do not need to add anything. VDO.Ninja will use the automatic tier values.

To tune the automatic room-only tiers:

* [`&roomtier2bitrate`](../advanced-settings/video-bitrate-parameters/roomtier2bitrate.md) changes the normal or strong room-only budget. Default: `2000`.
* [`&roomtier1bitrate`](../advanced-settings/video-bitrate-parameters/roomtier1bitrate.md) changes the weak mobile room-only budget. Default: `1500`.

Example:

`https://vdo.ninja/?room=FamilyCall&roomtier2bitrate=2500&roomtier1bitrate=1500`

Use higher values only when you trust the devices, network, and thermals. A higher room budget increases both inbound viewing quality and outbound load on the senders.

## If a director or scene is connected

When a guest is connected to a director or scene viewer, VDO.Ninja assumes a production workflow. In that mode, protecting the guest's audio/video stability and the production feed takes priority over guest-to-guest room quality.

To improve room quality in a director or scene controlled room, use explicit parameters:

* Add [`&totalroombitrate`](../advanced-settings/video-bitrate-parameters/totalroombitrate.md) to the room or guest links to raise the guest-to-guest room budget.
* Add [`&controlroombitrate`](../advanced-settings/video-bitrate-parameters/and-controlroombitrate.md) if you want guests to adjust their own room receive budget from the interface.
* Use [`&roombitrate`](../advanced-settings/video-bitrate-parameters/roombitrate.md) on weaker guests to cap how much other room guests can pull from them.
* Use [`&maxmobilebitrate`](../advanced-settings/video-bitrate-parameters/and-maxmobilebitrate.md) or [`&flagship`](../advanced-settings/upcoming-parameters/and-flagship.md) on a known-capable mobile publisher if you intentionally want to lift mobile sender limits in production-style rooms.
* Use [`&videobitrate`](../advanced-settings/video-bitrate-parameters/bitrate.md) or [`&totalscenebitrate`](../advanced-settings/video-bitrate-parameters/and-totalscenebitrate.md) for scene quality. Scene bitrate and guest room bitrate are separate concerns.
* For larger rooms or one-to-many production, consider [`&meshcast`](../newly-added-parameters/and-meshcast.md) or [`&broadcast`](../advanced-settings/view-parameters/broadcast.md) so guests do not need to upload many peer-to-peer video streams.

## Suggested starting points

| Use case | Suggested parameters |
| --- | --- |
| simple family call with modern phones | no extra bitrate parameters |
| high-quality room-only call on strong devices | `&roomtier2bitrate=2500&roomtier1bitrate=1500` |
| mixed room with low-end phones | `&roomtier2bitrate=2000&roomtier1bitrate=1200` |
| director room where guest-to-guest quality matters | `&totalroombitrate=2000` or higher, tested carefully |
| production scene quality | use `&videobitrate` or `&totalscenebitrate` on the scene/view link |

## Related

{% content-ref url="video-bitrate-in-rooms.md" %}
[video-bitrate-in-rooms.md](video-bitrate-in-rooms.md)
{% endcontent-ref %}

{% content-ref url="../advanced-settings/video-bitrate-parameters/" %}
[video-bitrate-parameters](../advanced-settings/video-bitrate-parameters/)
{% endcontent-ref %}
