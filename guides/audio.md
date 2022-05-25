---
description: >-
  Screen sharing in browsers only allows for tab-audio or desktop-audio capture;
  not window.
---

# Capture an application's audio

#### Guide: Routing Windows application’s audio to [VDO.Ninja](https://vdo.ninja/)

(For macOS users, you can use [Loopback by Roguemedia](https://www.google.com/url?q=https://rogueamoeba.com/loopback/\&sa=D\&source=editors\&ust=1622130763272000\&usg=AOvVaw09b4uk6dZqBTznSzHMJcul) instead, or check out this list of free options: [https://docs.vdo.ninja/platform-specific-issues/macos#capturing-audio](https://docs.vdo.ninja/platform-specific-issues/macos#capturing-audio))

* 1\) Install the VB-Cable Virtual Audio device. (Voicemeeter can be used instead?)\
  [https://www.vb-audio.com/Cable/](https://www.google.com/url?q=https://www.vb-audio.com/Cable/\&sa=D\&source=editors\&ust=1622130763273000\&usg=AOvVaw3I-yLt2nEk9AOrRsJ0fH9q)

![](https://lh5.googleusercontent.com/BJg9POjpwA3Psi0qX\_Ruew9VU8uZkR0wdbIcTL1GLmyfXEwa5lx71k7QdYLj51h\_MRw\_WnkoKoPcd-vVuD5of98OXkmHQRexbEwZnre2hbWQtdCvEi41ne2Om5ghHy1NuVIb-Ou1)

Tip: If you want to configure the VB Audio driver with custom settings, the recommended sample rate is 48000hz, as that is the sample used by OBS.Ninja.

* 2\) Load up Window Mixer by typing in Mixer to the windows search bar:

![](https://lh5.googleusercontent.com/1TcP9r7sYHpQKoFu72F\_RUm7\_wCYArK3LSTDar5phOvKqiMIjUbPsyKc29EEYDW0--LTXjhBdnbjjvobfAfDIe9yF1\_302ormfnAFDZM10wzqRjmcFe0YRzNiTUrusA5whvMBvLo)

* 3\) For the application you want, select the Output dropdown and select CABLE Input

![](https://lh4.googleusercontent.com/8v-kZNpbgx\_AFbccMaznCzsiB0hJUgFjmtgzp-TR-QY6YEvUP67mo969OgeR6Ae9cgKZ\_Z\_sC8RE7Ws9DVs32fK1ql7vQLTdsGYx1CvhSREHLRUHE-tf8grWIaH4FkMCNUPhufK3)

* 4\) We can now head over to [https://vdo.ninja](https://vdo.ninja) , but we will want to add the advanced URL parameter \&proaudio to the web URL, which disables echo cancellation and other digital effects. It will make the audio sound better and echo cancellation is likely not needed if capturing from a Game or Application window.\
  \
  For example, `https://vdo.ninja/?push=myStreamID&stereo`\
  \
  You can also add this to the view link, which increases the audio quality even more. For example, `https://vdo.ninja?view=myStreamID&stereo`\

* 5\) In VDO.Ninja, select the Cable Output device.\
  \
  Tip: If you hold down `CTRL` (command) while selecting inputs, you can select more than one at a time.\
  ![](https://lh3.googleusercontent.com/VzGq5kxxnObkfu-jLhc1HRzXdlbscE68QDVbOHPTHYa0cDLOF5DHQF3UrqoT\_tk9GrJrBBWKmQh2buUzh8UCERiususMiH7IrI7RiAKWHNuqC33j78Sv6DJVUcvwH9HPVvAqw20N)\

* 6\) A simple way to hear the audio as an output is to just unmute the video.  Right-click and show the controls, if not visible, then unmute.\
  ![](https://lh3.googleusercontent.com/Eu257zu9VlV2ueK\_IGMoQlDARqpkGxoqB8PVl\_aSobcsqk-hndfVgzLB0o3z\_F52O1CrBQuM\_CeslpIrYZBXRg9raG8WCLGi4wzfBOF6phsXRtyeTx9zlY3ABc0tYD8TcMvEYLXJ)![](https://lh4.googleusercontent.com/p\_6XTkNhfGQWi0quBnvEe5Bbsy06nT9jkCFi\_aHTCQbOi8HydOI5XQHtoxp4v0r8WhAHQ\_2c5LWYWnWx9SVtrWTNyyKrDlXElq991W8AyfeATdSZKx1BfzVE1sJ5sU0KXzy3yPlF)
* 7\) Alternatively, you can also use the Sound properties for the VB cable to “listen to this device” in Windows, so you can hear the audio even if not in VDO.Ninja. This method might have lower latency than the method in step 6.\
  \
  ![](https://lh3.googleusercontent.com/AQwJuAdfBEGqhrSOyjqYmZyoNf8HrfrRRtNK3w2HhFMWiP87NZeoFQ6rh2pznr-InI8gg1OyI3CnPnyWUbtV1tnlTfXMswIchomWpbfwyJtlkFFOt-BnS5nO8ObxwBocmU8NuqlJ)
