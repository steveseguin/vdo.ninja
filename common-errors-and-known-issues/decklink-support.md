---
description: >-
  Blackmagic Decklink support isn't compatible with Google Chrome (chromium)
  browsers, but support is still possible.
---

# Decklink support?

Chrome continues to be incompatible with Blackmagic Decklink video sources, however there still are solutions.

* Someone says Firefox works for them, but not Chrome, so perhaps try Firefox with VDO.Ninja
* Bringing the Decklink into OBS, and then into Chrome via the OBS Virtual Camera seems like a popular approach.
* It's possible to bring in Decklink via OBS using WHIP webrtc output, which is compatible with VDO.Ninja if there is no NAT firewall blocking the connection.
  * An option on this page ([https://whip.vdo.ninja/](https://whip.vdo.ninja/)), shows the WHIP ingestion URL and will offer a view-link.
  * I also have WHIP working with [https://meshcast.io/](https://meshcast.io/), if needed, but this may limit bitrates. Details on WHIP publishing should be available on meshcast.io.
* Raspberry Ninja as a command-line tool for VDO.Ninja that I am able to support myself, [https://raspberry.ninja/](https://raspberry.ninja/),  and it is compatible with a large array of input sources.
  * Basic Decklink support could be added probably within a few minutes, but it's not as easy to use as the browser-based version of VDO.Ninja.
  * I don't have Decklink device to actually test support with here, and Windows compatibility may be challenging, but it may be worth considering for your needs.

Please advocate to both Decklink and the Chromium development teams for proper Decklink support, as this has been a long-standing issue without either party addressing the issue yet.
