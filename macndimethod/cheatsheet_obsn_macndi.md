# VDO.Ninja Cheat Sheets
VDO.Ninja lets you bring remote video feeds into OBS at low latency and with excellent quality

  Jump to:

* [OBS Ninja Basic Concepts](#basicconcepts)
* [Getting Started with OBS Ninja](#gettingstarted)
* [Automating OBSN start-up](#automation)
* [Mac: Audio Routing with Loopback (example 1)](#loopbackrouting1)

<a name="basiccomponents"></a>

## BASIC CONCEPTS

To understand VDO.Ninja, you have to understand its three main components: 

* The GROUP ROOM allows guests to hear and see each other. GROUP ROOMs are automtatically created by guests joining them through an invitation link in a browser (preferably Chrome). No further configuration is required (but possible by adding parameters to the invitation link).
* SCENES & SOLO LINKS are a way for the producer/director to add guests to OBS, vMix, etc.
* The CONTROL CENTER gives the director control over the guests' status. This includes mute/unmute, visibility in scenes or transfers to other rooms.

![OBS Ninja | basic concepts](basicconcepts/OBSN_basic_concepts.jpg)   
(v1.2, 2021-01-22)

[download JPG](basicconcepts/OBSN_basic_concepts.jpg) |
[download PNG](basicconcepts/OBSN_basic_concepts.png) |
[download PDF](basicconcepts/OBSN_basic_concepts.pdf) (best for printing)

<a name="gettingstarted"></a>

## GETTING STARTED

Many of the VDO.Ninja behaviour is managed through URL parameters in the form of &parameter=value.  
This includes things like

* audio and video bit rates
* video resolution
* choice of video codec
* audio behaviour like echo cancellation, noise reduction or mono/stereo
* passwords
* buffering behaviour

![VDO.Ninja | cheat-sheet](cheatsheet/OBSN_cheat-sheet.jpg)   
(v1.1, 2021-01-23)

[download JPG](cheatsheet/OBSN_cheat-sheet.jpg) |
[download PNG](cheatsheet/OBSN_cheat-sheet.png) |
[download PDF](cheatsheet/OBSN_cheat-sheet.pdf) (best for printing)

<a name="automation"></a>

## AUTOMATING VDON START-UP (currently in beta only)

For regularly repeated setups you can automate a lot of the parameters:

* audio input device
* video input device
* audio output device
* guest names (stream IDs and labels)

Depending on your platform, you can put all these into scripts or even apps for easy recall.


![VDO.Ninja | automating start-up](automation/OBSN_automation_cheat-sheet.jpg)   
(v1.0, 2021-01-22)

[download JPG](automation/OBSN_automation_cheat-sheet.jpg) |
[download PNG](automation/OBSN_automation_cheat-sheet.png) |
[download PDF](automation/OBSN_automation_cheat-sheet.pdf) (best for printing)


<a name="loopbackrouting1"></a>

## MAC: AUDIO ROUTING USING LOOPBACK (EXAMPLE 1)

Route audio from multiple apps to all guests in a room and record the same audio in OBS while simultaneously being a participant in the room.

![VDO.Ninja | mac audio routing example 1](loopbackrouting1/loopbackrouting1.jpg)   
(v1.0, 2021-02-09)

[download JPG](loopbackrouting1/loopbackrouting1.jpg) |
[download PNG](loopbackrouting1/loopbackrouting1.png) |
[download PDF](loopbackrouting1/loopbackrouting1.pdf) (best for printing)
