---
description: What to ask IT for when enterprise firewalls break calls
---

# Enterprise firewall checklist

When guests frequently reconnect or can’t see/hear each other on enterprise networks:

- Prefer UDP: Permit outbound UDP for WebRTC to STUN/TURN and peers; avoid DPI that times out UDP flows.
- TURN fallback: Allow relay (TURN) over TCP/TLS when UDP is restricted. Use your own TURN if needed.
- Open ports: Follow the port guidance documented for VDO.Ninja traffic.
- Alternate paths: Try `backup.vdo.ninja`, WHEP/WHIP viewers, or Meshcast when strict egress control is required.

Related

- `common-errors-and-known-issues/relay-candidate-being-selected.md`
- `turnserver.md`
- `advanced-settings/whip-parameters/and-whep.md`

