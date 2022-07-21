---
description: Stream from VDO.NInja into Zoom using the Electron Capture app
---

# Stream into Zoom without OBS

## Stream from VDO.NInja into Zoom, without OBS <a href="#h.1qc55rh0mkw2" id="h.1qc55rh0mkw2"></a>

* 1\) Go to [https://vdo.ninja](https://vdo.ninja).

![](https://lh6.googleusercontent.com/UoSBAlHm1MeZ7C2knumDrmoWUBicdQe9ibI-DAkYdgZXbkWTqB2q7bg-CN59ElmBGaFOn48ToyyDK7isD\_-xb9CbFJPoXU\_pTRGtLEh66Ofz1-6REd33Aar8rWgJBoGumh7yimtZ)

* 2\) Click the Add Group Chat to OBS button.\
  \
  ![](https://lh5.googleusercontent.com/DX3XOFr3gs1h8y5pdKJ84IqGNV32IPt-M2k67CHlCCwswWxNr9Dx9-ENTgauM6yWUyj6TvGb0sjBVUup18grpDIjxkHf9QO72BLAdcbKuk8d-MYf8Q4ZQ52rTB\_h5dvJcdfLsMZs)\

* 3\) Enter a room name and then click the Enter the Room’s control Center.\
  \
  This is the “director’s control center”.

![](https://lh3.googleusercontent.com/gCRIR6ZA-cGFcorYDDqNToLeDWfUDaADdciHs5vUaNzxFkfFNCBEIue3kUov3rjAKxxS7qE46XhRioaGFlwEHPeK1aK8sDXtIeUhWT7PqoEF5GU0Gr93MjU4denhiyfbTWbK5DV0)

* 4\) Click the COPY LINK button for the GUEST INVITE box.  We want to send this link to our guests.  The can use this link to JOIN the room with their camera\

* 5\) As guests join the room, they will see each other and be able to talk to each other.\
  \
  The director of the room will also see each guest in the control center as they join.![](https://lh6.googleusercontent.com/rYaZdsjT8OKKKhExrbuni455UKQve5-NefpKZzXw98FR3fQlHE8yLxrUmu4YJVX-\_XmecuRO2xPtna3C15jKda2cYYOMugf\_fFNOIyUmkUnB1mwCKefsN7Welre\_3GBYaU1TREZf)\
  \

* 6\) The SCENE LINK: MANUAL is the OUTPUT of the show that we want to capture. We can copy this link and press the ADD TO SCENE button in the control center for each guest.  As we press the button, the guests will appear in the SCENE link that we just opened. ![](https://lh6.googleusercontent.com/zSbrbEsNNvbrJsigY-jdtYhOwrsx6q78It9iaZ3HW1rV5fN3e5GV2osRkwGzUlCpRhLi7mIBuzNRo19kYf03IDhH\_ypZYBfMhQKDR\_SCEkOXaqkyVDoxuHLHJosTI\_uZAkaG\_g7m)\

* &#x20;7\) If we open the SCENE LINK in chrome we can view it to confirm it worked.  We can close it and REMOVE the guests from the scene as well.\
  \
  ![](https://lh4.googleusercontent.com/cD\_KP9JvEsOEIoN677BmiJertW6yc0qfcVOLBYo-IJzxQU-xq66dm0r7g5dIWDaPPT1lpQqUg39KQ9BoDqUpcU2QVdDAZL9XgI\_mPMj6I0wTq-Y9gJuXV8FWJA\_oykgLEBoIsdlW)\

* 8\) Next, we download the Electron Capture app -- [https://github.com/steveseguin/electroncapture/releases](https://www.google.com/url?q=https://github.com/steveseguin/electroncapture/releases\&sa=D\&source=editors\&ust=1623459494599000\&usg=AOvVaw1-SPmZGDZJRr0rfI848VLf)\
  \
  The Electron Capture will let us share our video into Zoom without any borders and allow us to capture the audio. It also is optimized in resolution for maximum quality transfer from VDO.Ninja to Zoom.\

* 9\) We also want to download and install a Virtual Audio device:\
  \
  [https://rogueamoeba.com/loopback/](https://www.google.com/url?q=https://rogueamoeba.com/loopback/\&sa=D\&source=editors\&ust=1623459494599000\&usg=AOvVaw2vgGph\_iXd6ysPnLS\_CLZg) (macOS & non-free, but excellent) and [https://existential.audio/blackhole/](https://www.google.com/url?q=https://existential.audio/blackhole/\&sa=D\&source=editors\&ust=1623459494599000\&usg=AOvVaw1-EZolaHAC0tUEGzmwWgUi) (macOS & free)\
  [https://vb-audio.com/Cable/](https://www.google.com/url?q=https://vb-audio.com/Cable/\&sa=D\&source=editors\&ust=1623459494600000\&usg=AOvVaw0YvTuqw5IqLf4G\_xbsoCyF) VB Cable for Windows or macOS - (Donationware)\

* 10\) We now can put our SCENE link in Electron Capture (and close the previous SCENE link page we opened).  The AUDIO OUTPUT DESTINATION needs to point to the Virtual Audio Cable. Press GO when ready.\

* 11\) We now ADD TO SCENE the guests we want. They should appear in the Electron Capture window.\

* 12\) We go to ZOOM and we SCREEN SHARE the Electron Capture app window. If you cannot select it in Zoom, right click the Electron Capture app and make sure "Always on top" is not selected.\

* 13\) In Zoom, we change our MICROPHONE source to be the VB Audio Cable.\

* 14\) Lastly, in Zoom, we ensure the ORIGINAL AUDIO SOURCE option (no echo cancellation), so we can capture the best audio quality possible.\

* 15\) We can now use the Director Room to control who is in the scene, who is muted, and even join the room ourselves.\


![](<../.gitbook/assets/image (19).png>)

More information about rooms:

{% content-ref url="../getting-started/rooms.md" %}
[rooms.md](../getting-started/rooms.md)
{% endcontent-ref %}
