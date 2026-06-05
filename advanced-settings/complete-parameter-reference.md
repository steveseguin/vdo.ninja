---
description: A complete list of URL parameters, although not documented
---

# Complete List of Parameters

## This is a near-complete list of all the URL parameters within VDO.Ninja (current as of v27.7). It does not offer help in explaining what a parameter does, as it's provided purely as a technical reference.

This list is not exhaustive, it may have flawed descriptions, and it does not offer links or specifics. Please refer to other support material in the documentation for details on how certain parameters actually work. If a parameter below is not found in the rest of the documentation, please refer to the code directly.\
\
This list is AI-generated, based on the contents of the `main.js` file, which you can [refer to on the Github.](https://github.com/steveseguin/vdo.ninja/blob/develop/main.js) Searching through the `lib.js` file also will help provide added detail into any function calls the parameters are calling.  Using an LLM with a sufficiently large context-window can help explain the code, as well as nearly any function, so give that a try if stuck.

If you are self-hosting VDO.Ninja, often these URL parameters can be hard-coded to have a certain value without needing URL parameters. Please refer to the `main.js` file as well for a sense of what needs to be done to accomplish that though.

### A

| Parameter          | Aliases                               | Values                                          | Description                               |
| ------------------ | ------------------------------------- | ----------------------------------------------- | ----------------------------------------- |
| `action`           | -                                     | -                                               | -                                         |
| `ad`               | See `audiodevice`                     | -                                               | -                                         |
| `addstun`          | -                                     | String (format: username;password;url)          | Adds additional STUN server               |
| `ado`              | See `audiodevice`                     | -                                               | -                                         |
| `adevice`          | See `audiodevice`                     | -                                               | -                                         |
| `ag`               | See `autogain`                        | -                                               | -                                         |
| `agc`              | See `autogain`                        | -                                               | -                                         |
| `alertvolume`      | -                                     | 0-100                                           | Sets volume for alert sounds              |
| `alpha`            | -                                     | Boolean                                         | -                                         |
| `am`               | See `automute`                        | -                                               | -                                         |
| `apiserver`        | -                                     | URL                                             | Sets custom API server                    |
| `approvalpopup`    | See `approvepopup`                    | -                                               | -                                         |
| `approvepopup`     | `approvalpopup`                       | Boolean                                         | Shows a director popup for pending approval requests |
| `ar`               | See `aspectratio`                     | -                                               | -                                         |
| `aspectratio`      | `ar`                                  | Number/String (`portrait`,`landscape`,`square`) | Sets aspect ratio                         |
| `audience`         | -                                     | String                                          | -                                         |
| `audiobitrate`     | -                                     | Integer (kbps)                                  | Sets audio bitrate                        |
| `audiocontenthint` | `audiocontent`, `audiohint`           | String                                          | Sets audio content processing hint        |
| `audiodevice`      | `adevice`, `ad`, `device`, `d`, `ado` | Device ID/name or `0`/`false`/`no`/`off`        | Selects audio input device                |
| `audioeffects`     | -                                     | Boolean                                         | Enables audio effects processing          |
| `autoadd`          | -                                     | Stream ID(s) (comma-separated)                  | Auto-adds specified streams               |
| `autogain`         | `ag`, `agc`                           | Boolean                                         | Controls automatic gain control           |
| `automute`         | `am`                                  | Boolean                                         | Enables automatic audio muting            |
| `autorecord`       | -                                     | Boolean/Integer                                 | Starts recording automatically            |
| `autorecordlocal`  | -                                     | Boolean/Integer                                 | -                                         |
| `autorecordremote` | -                                     | Boolean/Integer                                 | -                                         |
| `autorecover`      | -                                     | Boolean                                         | Enables connection-recovery bundle        |
| `autoreload`       | -                                     | Integer (minutes)                               | Auto reloads page after specified minutes |
| `autoreload24`     | -                                     | Time (HH:MM)                                    | Reloads at specified time                 |
| `autorelay`        | -                                     | Boolean                                         | Enables relay escalation in recovery      |
| `autostart`        | `as`                                  | Boolean                                         | Auto starts session                       |
| `autohide`         | -                                     | Boolean                                         | -                                         |
| `autowhep`         | -                                     | Boolean                                         | Auto-derives WHEP share URL from WHIP output URL |
| `avatarimg`        | `bgimage`, `bgimg`                    | URL                                             | Sets avatar/background image              |
| `avatarimg2`       | `bgimage2`, `bgimg2`                  | URL                                             | Sets secondary avatar/background image    |
| `avatarimg3`       | `bgimage3`, `bgimg3`                  | URL                                             | Sets tertiary avatar/background image     |

### B

| Parameter           | Aliases                         | Values             | Description                       |
| ------------------- | ------------------------------- | ------------------ | --------------------------------- |
| `background`        | `appbg`                         | URL                | Sets application background       |
| `base64css`         | `b64css`, `cssbase64`, `cssb64` | Base64 encoded CSS | Applies custom CSS                |
| `base64js`          | `b64js`, `jsbase64`, `jsb64`    | Base64 encoded JS  | Applies custom JavaScript         |
| `batterymeeter`     | -                               | Boolean            | Shows battery meter               |
| `beep`              | `notify`, `tone`                | Boolean            | Enables notification sounds       |
| `beepvolume`        | -                               | 0-100              | Sets volume for beep sounds       |
| `bgimage`           | See `avatarimg`                 | -                  | -                                 |
| `bgimage2`          | See `avatarimg2`                | -                  | -                                 |
| `bgimage3`          | See `avatarimg3`                | -                  | -                                 |
| `bgimg`             | See `avatarimg`                 | -                  | -                                 |
| `bgimg2`            | See `avatarimg2`                | -                  | -                                 |
| `bgimg3`            | See `avatarimg3`                | -                  | -                                 |
| `bigbutton`         | -                               | String             | Shows large mute button with text |
| `bitrate`           | -                               | Integer (kbps)     | Viewer-side target bitrate (may cap via SDP)  |
| `bitratecutoff`     | `bitcut`                        | Integer            | Sets bitrate cutoff threshold     |
| `blackout`          | `blackoutmode`, `bo`, `bom`     | Boolean            | -                                 |
| `blur`              | -                               | Integer (1-10)     | Sets background blur amount       |
| `bc`                | See `broadcast`                 | -                  | -                                 |
| `bct`               | See `broadcasttransfer`         | -                  | -                                 |
| `broadcast`         | `bc`                            | Boolean            | Enables broadcast mode            |
| `broadcasttransfer` | `bct`                           | Boolean            | -                                 |
| `buffer`            | -                               | Number             | Sets buffer delay                 |
| `buffer2`           | -                               | Number             | Alternative buffer setting        |
| `bundle`            | -                               | String             | Sets bundle policy                |
| `bypass`            | -                               | Boolean            | -                                 |

### C

| Parameter            | Aliases                                         | Values                | Description                     |
| -------------------- | ----------------------------------------------- | --------------------- | ------------------------------- |
| `cb`                 | See `chatbutton`                                | -                     | -                               |
| `cbr`                | -                                               | Boolean               | Enables constant bitrate        |
| `cc`                 | See `closedcaptions`                            | -                     | -                               |
| `cccolored`          | `cccoloured`, `coloredcc`, `colorcc`, `cccolor` | Boolean               | Enables colored closed captions |
| `cftoken`            | `cft`                                           | String                | -                               |
| `channelcount`       | `ac`, `inputchannels`                           | Integer               | Sets number of audio channels   |
| `channeloffset`      | -                                               | Integer               | -                               |
| `chat`               | See `chatbutton`                                | -                     | -                               |
| `chatbutton`         | `chat`, `cb`                                    | Boolean               | Shows chat button               |
| `chatlite`           | `ssnlite`, `socialstreamlite`                   | Boolean               | Enables Chat Lite integration   |
| `chatlitebutton`     | `ssnchatbutton`                                 | Boolean               | Shows Chat Lite control button  |
| `chatlitesession`    | `ssnsession`                                    | String                | Sets Chat Lite session ID       |
| `chroma`             | -                                               | Color code            | Sets chroma key color           |
| `chunked`            | `chunk`                                         | Integer               | Enables chunked/WebCodecs publishing; value sets target video bitrate |
| `chunkedbuffer`      | `sendingbuffer`                                 | Integer               | Sets sender-side chunk backlog target |
| `chunkbuffer`        | -                                               | Integer               | Sets chunked viewer playout target |
| `chunkbufferfloor`   | -                                               | Integer               | Sets chunked viewer playout floor |
| `chunkbufferceil`    | -                                               | Integer               | Sets chunked viewer playout ceiling |
| `chunkbufferadaptive`| -                                               | Boolean               | Enables/disables adaptive chunked viewer targeting |
| `fixedchunkbuffer`   | -                                               | Boolean               | Shortcut to disable adaptive chunked viewer targeting |
| `chunkjitterslack`   | -                                               | Integer               | Adds extra headroom before chunked rebuffering |
| `chunkprofile`       | -                                               | String                | Applies chunked preset defaults |
| `chunkadapt`         | -                                               | String                | Sets chunked adaptation mode    |
| `clean`              | See `cleanoutput`                               | -                     | -                               |
| `cleanoutput`        | `clean`                                         | Boolean               | Minimizes UI elements           |
| `cleanish`           | -                                               | Boolean               | -                               |
| `cleanstorage`       | `clear`                                         | Boolean               | Clears stored settings          |
| `clock`              | `clock24`                                       | 0-9                   | Shows clock with position       |
| `closedcaptions`     | `cc`, `captions`                                | Boolean               | Enables closed captions         |
| `codec`              | `codecs`, `videocodec`                          | String                | Sets video codec                |
| `codirector`         | See `directorpassword`                          | -                     | -                               |
| `compressor`         | `comp`                                          | Boolean/Integer       | Audio compression settings      |
| `consent`            | -                                               | Boolean               | -                               |
| `contenthint`        | `contenttype`, `content`, `hint`                | String                | Sets content processing hint    |
| `controlbarspace`    | -                                               | Boolean               | -                               |
| `controls`           | `videocontrols`                                 | Boolean               | Shows video controls            |
| `controlroombitrate` | `crb`                                           | Boolean               | -                               |
| `cover`              | -                                               | Boolean               | Sets cover mode for video       |
| `crop`               | -                                               | Integer (-100 to 100) | Sets video crop                 |
| `css`                | -                                               | URL                   | Applies external CSS            |

### D

| Parameter          | Aliases                         | Values         | Description                |
| ------------------ | ------------------------------- | -------------- | -------------------------- |
| `d`                | See `audiodevice`/`videodevice` | -              | -                          |
| `darkmode`         | `nightmode`, `darktheme`        | Boolean        | Enables dark theme         |
| `deaf`             | `deafen`                        | Boolean        | -                          |
| `defaultlabel`     | `labelsuggestion`, `ls`         | String         | Sets default label         |
| `delay`            | See `micdelay`                  | -              | -                          |
| `denoise`          | `dn`                            | Boolean        | Controls noise suppression |
| `device`           | See `audiodevice`/`videodevice` | -              | -                          |
| `director`         | `dir`                           | String/Boolean | Enables director mode      |
| `directorchat`     | `dc`                            | Boolean        | -                          |
| `directorpassword` | `dirpass`, `dp`, `codirector`   | String         | Sets director password     |
| `directorview`     | `dv`                            | Boolean        | -                          |
| `displaysurface`   | -                               | String         | -                          |
| `dp`               | See `directorpassword`          | -              | -                          |
| `dpi`              | `dpr`                           | Number         | Sets display pixel ratio   |
| `drawing`          | -                               | Boolean        | -                          |
| `dtx`              | `usedtx`                        | Boolean        | -                          |
| `dv`               | See `directorview`              | -              | -                          |

### E

| Parameter          | Aliases                | Values         | Description                   |
| ------------------ | ---------------------- | -------------- | ----------------------------- |
| `e2ee`             | -                      | Boolean        | Enables end-to-end encryption |
| `ec`               | See `echocancellation` | -              | -                             |
| `echocancellation` | `aec`, `ec`            | Boolean        | Controls echo cancellation    |
| `effect`           | `effects`              | String/Integer | Applies video effects         |
| `effectvalue`      | `ev`                   | Number         | Sets effect intensity         |
| `electronic`       | -                      | Boolean        | -                             |
| `enhance`          | -                      | Boolean        | -                             |
| `entrymsg`         | `welcome`              | String         | Sets welcome message          |
| `equalizer`        | `eq`                   | Boolean        | Enables audio equalizer       |
| `exclude`          | `ex`                   | Stream ID(s)   | Excludes specified streams    |
| `excludeaudio`     | `exaudio`, `silence`   | Stream ID(s)   | -                             |
| `experimental`     | -                      | Boolean        | Enables experimental features |
| `exposure`         | -                      | Number         | Sets camera exposure          |

### F

| Parameter              | Aliases                  | Values                        | Description                  |
| ---------------------- | ------------------------ | ----------------------------- | ---------------------------- |
| `facingmode`           | -                        | String (`user`/`environment`) | Sets camera facing mode      |
| `fadein`               | -                        | Number/Boolean                | Sets fade in effect          |
| `fakeguests`           | `fakefeeds`, `fakeusers` | Integer                       | -                            |
| `fb`                   | See `feedbackbutton`     | -                             | -                            |
| `feedbackbutton`       | `fb`                     | Boolean/Number                | Shows feedback button        |
| `fileshare`            | `fs`                     | Boolean                       | Enables file sharing         |
| `fit`                  | -                        | Boolean                       | Sets fit mode for video      |
| `fl`                   | See `forcelandscape`     | -                             | -                            |
| `flagship`             | -                        | Boolean                       | -                            |
| `flip`                 | -                        | Boolean                       | Flips video                  |
| `focus`                | -                        | Number                        | Sets camera focus            |
| `forceios`             | -                        | Boolean                       | -                            |
| `forcelandscape`       | `forcedlandscape`, `fl`  | Boolean                       | Forces landscape orientation |
| `forceportrait`        | `forcedportrait`, `fp`   | Boolean                       | Forces portrait orientation  |
| `forceviewerlandscape` | -                        | Integer                       | -                            |
| `forceviewerportrait`  | -                        | Integer                       | -                            |
| `fp`                   | See `forceportrait`      | -                             | -                            |
| `frameRate`            | `fr`, `fps`              | Integer                       | Sets frame rate              |
| `fs`                   | See `fileshare`          | -                             | -                            |
| `fsb`                  | See `fullscreenbutton`   | -                             | -                            |
| `fullhd`               | -                        | Boolean                       | Enables 1080p quality        |
| `fullscreen`           | -                        | Boolean                       | Enables fullscreen mode      |
| `fullscreenbutton`     | `fsb`                    | Boolean                       | Shows fullscreen button      |

### G

| Parameter    | Aliases           | Values    | Description           |
| ------------ | ----------------- | --------- | --------------------- |
| `ga`         | See `groupaudio`  | -         | -                     |
| `gain`       | See `audiogain`   | -         | -                     |
| `gate`       | See `noisegate`   | -         | -                     |
| `gating`     | See `noisegate`   | -         | -                     |
| `gdrive`     | -                 | Boolean   | -                     |
| `gm`         | See `groupmode`   | -         | -                     |
| `group`      | `groups`          | String(s) | Sets group membership |
| `groupaudio` | `ga`              | Boolean   | -                     |
| `groupmode`  | `gm`              | Boolean   | -                     |
| `groupview`  | `viewgroup`, `gv` | String(s) | Sets group view       |
| `gv`         | See `groupview`   | -         | -                     |

### H

| Parameter         | Aliases             | Values     | Description               |
| ----------------- | ------------------- | ---------- | ------------------------- |
| `h`               | See `height`        | -          | -                         |
| `h264profile`     | -                   | String     | Sets H264 profile         |
| `hands`           | `hand`              | Boolean    | -                         |
| `hangupbutton`    | `hub`, `humb64`     | Boolean    | Shows hangup button       |
| `hangupmessage`   | `hum`, `humb64`     | String     | Sets hangup message       |
| `height`          | `h`                 | Integer    | Sets video height         |
| `hh`              | See `hideheader`    | -          | -                         |
| `hidecodirector`  | `hidedirector`      | Boolean    | Hides director controls   |
| `hidecursor`      | See `nocursor`      | -          | -                         |
| `hideheader`      | `noheader`, `hh`    | Boolean    | Hides header              |
| `highlightmute`   | `hmute`, `mutefollowhighlight`, `mfh` | Boolean | Mutes non-highlighted guests when Highlight changes |
| `hidemouse`       | See `nocursor`      | -          | -                         |
| `hidesolo`        | `hs`                | Boolean    | -                         |
| `hidescreenshare` | `hidess`, `sshide`  | Boolean    | Hides screen share option |
| `hint`            | See `contenthint`   | -          | -                         |
| `holdercolor`     | `videobg`, `videobgcolor`, `videobackground`, `videobackgroundcolor`, `holderbg`, `holderbgcolor` | Color code | Sets the video holder background color |
| `host`            | -                   | Boolean    | -                         |
| `hotkeys`         | See `midi`          | -          | -                         |
| `hs`              | See `hidesolo`      | -          | -                         |
| `hub`             | See `hangupbutton`  | -          | -                         |
| `hum`             | See `hangupmessage` | -          | -                         |
| `humb64`          | See `hangupmessage` | -          | -                         |

### I

| Parameter           | Aliases                | Values         | Description                    |
| ------------------- | ---------------------- | -------------- | ------------------------------ |
| `icefilter`         | -                      | String         | Sets ICE filter                |
| `id`                | See `push`             | -              | -                              |
| `iframe`            | See `website`          | -              | -                              |
| `iframetarget`      | -                      | String         | Sets iframe target             |
| `imagelist`         | -                      | JSON array     | Sets list of background images |
| `include`           | -                      | Stream ID(s)   | Includes specified streams     |
| `insertablestreams` | `is`                   | Boolean/String | -                              |
| `intro`             | `ib`                   | Boolean        | Shows intro                    |
| `isolation`         | `voiceisolation`, `vi` | Boolean        | Requests mic voice isolation   |

### J

| Parameter  | Aliases | Values | Description                 |
| ---------- | ------- | ------ | --------------------------- |
| `js`       | -       | URL    | Applies external JavaScript |
| `justtalk` | -       | String | -                           |

### K

| Parameter          | Aliases                           | Values  | Description            |
| ------------------ | --------------------------------- | ------- | ---------------------- |
| `keyframe`         | See `keyframeinterval`            | -       | -                      |
| `keyframerate`     | See `keyframeinterval`            | -       | -                      |
| `keyframeinterval` | `keyframerate`, `keyframe`, `fki` | Integer | Sets keyframe interval |

### L

| Parameter   | Aliases                 | Values      | Description        |
| ----------- | ----------------------- | ----------- | ------------------ |
| `l`         | See `label`             | -           | -                  |
| `label`     | `l`                     | String      | Sets display name  |
| `labelsize` | `sizelabel`, `fontsize` | Integer     | Sets label size    |
| `lanonly`   | -                       | Boolean     | -                  |
| `latency`   | `al`, `audiolatency`    | Integer     | Sets audio latency |
| `layout`    | -                       | JSON/String | Sets video layout  |
| `layouts`   | -                       | JSON array  |                    |

### L (continued)

| Parameter           | Aliases         | Values                                          | Description                   |
| ------------------- | --------------- | ----------------------------------------------- | ----------------------------- |
| `limittotalbitrate` | `ltb`           | Number                                          | Sets bitrate limit            |
| `locked`            | -               | Number/String (`portrait`,`landscape`,`square`) | Locks aspect ratio            |
| `locksize`          | -               | Boolean                                         | -                             |
| `lowcut`            | `lc`, `higpass` | Integer                                         | Sets low-cut filter frequency |
| `lowlatency`        | `ll`, `ultralow` | Boolean                                        | Enables low-latency preset    |
| `lowbitratescene`   | `cutscene`      | String                                          | -                             |
| `lowmobilebitrate`  | -               | Integer                                         | Lower fallback mobile sender bitrate cap |

### M

| Parameter              | Aliases              | Values               | Description                 |
| ---------------------- | -------------------- | -------------------- | --------------------------- |
| `maxbitrate`           | `mvb`                | Integer              | Software max video bitrate per stream |
| `maxbandwidth`         | -                    | Integer (0-200)      | -                           |
| `maxconnections`       | `mc`                 | Integer              | Maximum allowed connections |
| `maxframerate`         | `mfr`, `mfps`        | Integer              | Sets maximum framerate      |
| `maxmobilebitrate`     | -                    | Integer              | Normal mobile sender bitrate cap |
| `maxpublishers`        | `mp`                 | Integer              | Maximum allowed publishers  |
| `maxtotalscenebitrate` | `mtsb`, `tsb`        | Integer              | -                           |
| `maxvideobitrate`      | -                    | Integer              | Software max video bitrate per stream |
| `maxviewers`           | `mv`                 | Integer              | Maximum allowed viewers     |
| `mc`                   | See `maxconnections` | -                    | -                           |
| `mcaudiobitrate`       | `mcab`               | Integer              | -                           |
| `mcbitrate`            | `mcb`                | Integer              | -                           |
| `mccodec`              | -                    | String               | -                           |
| `mcscale`              | `meshcastscale`      | Integer              | -                           |
| `mcscreensharebitrate` | `mcssbitrate`        | Integer              | -                           |
| `mcscreensharecodec`   | `mcsscodec`          | String               | -                           |
| `md`                   | See `micdelay`       | -                    | -                           |
| `mediasettings`        | -                    | Boolean              | Shows media settings        |
| `meshcast`             | -                    | String               | -                           |
| `meshcast2`            | -                    | String/Boolean       | Enables Meshcast 2.0 mode   |
| `meshcastcode`         | `mccode`             | String               | -                           |
| `meter`                | `meterstyle`         | Integer              | Sets audio meter style      |
| `micdelay`             | `delay`, `md`        | Integer              | Sets microphone delay       |
| `mididevice`           | -                    | Integer              | -                           |
| `midihotkeys`          | -                    | Boolean/Integer      | -                           |
| `midiiframe`           | -                    | Boolean              | -                           |
| `midioffset`           | -                    | Integer              | -                           |
| `mfh`                  | See `highlightmute`  | -                    | -                           |
| `minipreview`          | `mini`               | Boolean/Integer      | Shows mini preview          |
| `minipreviewoffset`    | `mpo`                | Integer (-20 to 120) | -                           |
| `minroombitrate`       | `mrb`                | Integer              | -                           |
| `mirror`               | -                    | Integer (0-3)        | Sets mirror mode            |
| `mono`                 | -                    | Boolean              | Forces mono audio           |
| `morescenes`           | -                    | Integer              | -                           |
| `motionswitch`         | `motiondetection`    | Integer              | -                           |
| `muteall`              | `muteallguests`, `muteguests` | Boolean      | Shows director mute-all guests button |
| `mutefollowhighlight`  | See `highlightmute`  | -                    | -                           |
| `mp`                   | See `maxpublishers`  | -                    | -                           |
| `mrb`                  | See `minroombitrate` | -                    | -                           |
| `mv`                   | See `maxviewers`     | -                    | -                           |
| `mvb`                  | See `maxbitrate`     | -                    | -                           |

### N

| Parameter            | Aliases                              | Values          | Description                       |
| -------------------- | ------------------------------------ | --------------- | --------------------------------- |
| `na`                 | See `noaudio`                        | -               | -                                 |
| `ng`                 | See `noisegate`                      | -               | -                                 |
| `nme`                | See `nomouseevents`                  | -               | -                                 |
| `noap`               | See `noaudioprocessing`              | -               | -                                 |
| `noaudio`            | `na`, `hideaudio`                    | Stream ID(s)    | Disables audio for streams        |
| `noaudioprocessing`  | `noap`                               | Boolean         | Disables audio processing         |
| `noautoclaim`        | See `noclaim`                        | -               | -                                 |
| `noclaim`            | `noautoclaim`, `nonclaiming`, `claim=0` | Boolean      | Skips director room claim attempt |
| `nocursor`           | `hidecursor`, `nomouse`, `hidemouse` | Boolean         | Hides cursor                      |
| `nocontrols`         | -                                    | Boolean         | -                                 |
| `nocontrolbar`       | -                                    | Boolean         | -                                 |
| `nodownloads`        | See `nofileshare`                    | -               | -                                 |
| `nofec`              | -                                    | Boolean         | Disables forward error correction |
| `nofileshare`        | `nofiles`                            | Boolean         | Disables file sharing             |
| `nofullscreenbutton` | `nofsb`                              | Boolean         | -                                 |
| `noheader`           | See `hideheader`                     | -               | -                                 |
| `nohub`              | See `nohangupbutton`                 | -               | -                                 |
| `nohangupbutton`     | `nohub`                              | Boolean         | Hides hangup button               |
| `noisegate`          | `gating`, `gate`, `ng`               | Boolean/Integer | Sets noise gate                   |
| `nonclaiming`        | See `noclaim`                        | -               | -                                 |
| `nomobilebitratecap` | -                                    | Boolean         | Disables only the mobile sender bitrate safety cap |
| `nomouseevents`      | `nme`                                | Boolean         | -                                 |
| `nopreview`          | `np`                                 | Boolean         | Disables preview                  |
| `nopush`             | `noseed`                             | Boolean         | -                                 |
| `noremb`             | -                                    | Boolean         | -                                 |
| `noscale`            | `noscaling`                          | Boolean         | Disables scaling                  |
| `nosettings`         | `ns`                                 | Boolean         | Hides settings                    |
| `nostats`            | -                                    | Boolean         | Hides statistics                  |
| `notios`             | -                                    | Boolean         | -                                 |
| `novideo`            | `nv`, `hidevideo`                    | Stream ID(s)    | Disables video for streams        |
| `np`                 | See `nopreview`                      | -               | -                                 |
| `ns`                 | See `nosettings`                     | -               | -                                 |
| `nv`                 | See `novideo`                        | -               | -                                 |

### O

| Parameter              | Aliases                         | Values          | Description          |
| ---------------------- | ------------------------------- | --------------- | -------------------- |
| `oab`                  | See `outboundaudiobitrate`      | -               | -                    |
| `obscontrols`          | `remoteobs`, `obsremote`, `obs` | Boolean/String  | Enables OBS controls |
| `obsfix`               | -                               | Boolean/Integer | -                    |
| `obsoff`               | `oo`                            | Boolean         | -                    |
| `optimize`             | -                               | Integer         | -                    |
| `order`                | -                               | Integer         | -                    |
| `orderby`              | -                               | String          | -                    |
| `orientation`          | -                               | String          | -                    |
| `outboundaudiobitrate` | `oab`                           | Integer         | -                    |
| `outboundvideobitrate` | `ovb`                           | Integer         | Sender-side default target (may cap via SDP) |
| `overlaycontrols`      | -                               | Boolean         | -                    |
| `ovb`                  | See `outboundvideobitrate`      | -               | -                    |

### P

| Parameter         | Aliases                | Values         | Description             |
| ----------------- | ---------------------- | -------------- | ----------------------- |
| `p`               | See `password`         | -              | -                       |
| `p0`              | -                      | Boolean        | -                       |
| `pan`             | See `panning`          | -              | -                       |
| `panning`         | `pan`                  | Boolean/String | Sets audio panning      |
| `password`        | `pass`, `pw`, `p`      | String         | Sets room password      |
| `p2pfailtimeout`  | -                      | Integer (ms)   | Sets P2P recovery timeout window |
| `p2precoversteps` | See `peerrecoversteps` | -              | -                       |
| `pcm`             | -                      | Boolean        | -                       |
| `peerrecoversteps`| `p2precoversteps`      | Integer (1-6)  | Max automated recovery steps |
| `permaid`         | See `push`             | -              | -                       |
| `pendingicettl`   | -                      | Integer (ms)   | Pending ICE queue TTL   |
| `pie`             | -                      | String/Boolean | -                       |
| `pip`             | -                      | Boolean        | Picture-in-picture mode |
| `pip2`            | `pipall`               | Boolean        | -                       |
| `pip3`            | `mypip`, `pipme`       | Boolean        | -                       |
| `planb`           | -                      | Boolean        | -                       |
| `playchannel`     | -                      | Integer        | -                       |
| `poster`          | -                      | URL            | Sets poster image       |
| `postimage`       | -                      | URL            | -                       |
| `postinterval`    | -                      | Integer        | -                       |
| `ppt`             | -                      | Boolean/String | Push-to-talk settings   |
| `pptcontrols`     | `slides`, `powerpoint` | Boolean        | -                       |
| `preloadbitrate`  | -                      | Integer        | -                       |
| `private`         | See `privacy`          | -              | -                       |
| `privacy`         | `private`, `relay`     | Boolean        | Enables privacy mode    |
| `prompt`          | -                      | Boolean        | -                       |
| `proxy`           | -                      | Boolean        | -                       |
| `push`            | `id`, `permaid`        | String         | Sets stream ID          |
| `pusheffectsdata` | -                      | Boolean        | -                       |
| `pushloudness`    | `getloudness`          | Boolean        | Enables continuous IFRAME loudness events (`action: "loudness"`). |
| `pw`              | See `password`         | -              | -                       |

### Q

| Parameter | Aliases         | Values         | Description            |
| --------- | --------------- | -------------- | ---------------------- |
| `q`       | See `quality`   | -              | -                      |
| `quality` | `q`             | Integer/String | Sets video quality     |
| `queue`   | -               | Boolean/String | Enables queue system   |
| `queue2`  | `screen`        | Boolean        | Alternative queue mode |
| `queue3`  | `hold`          | Boolean        | Queue with hold        |
| `queue4`  | `holdwithvideo` | Boolean        | Queue with video       |

### R

| Parameter           | Aliases           | Values             | Description            |
| ------------------- | ----------------- | ------------------ | ---------------------- |
| `r`                 | See `room`        | -                  | -                      |
| `rampuptime`        | -                 | Integer            | -                      |
| `rc`                | See `recordcodec` | -                  | -                      |
| `record`            | -                 | Boolean            | Enables recording      |
| `recordcodec`       | `rc`              | String             | Sets recording codec   |
| `recordfolder`      | -                 | String             | Sets recording folder  |
| `reload`            | -                 | Boolean            | -                      |
| `requireapproval`   | -                 | Boolean            | Requires manual director approval for claimed-room joins |
| `requireencryption` | -                 | Boolean            | -                      |
| `rcap`              | See `roomcap`     | -                  | -                      |
| `retransmit`        | -                 | Boolean            | -                      |
| `retrytimeout`      | -                 | Integer (min 5000) | -                      |
| `room`              | `r`, `roomid`     | String             | Sets room ID           |
| `roombitrate`       | `rbr`             | Integer            | Sets room bitrate      |
| `roomcap`           | `rcap`            | Integer            | Claimed-room admission cap |
| `roomkey`           | `rk`              | String             | Claimed-room bypass key |
| `roomonlybitrate`   | See `roomtier2bitrate` | -              | -                      |
| `roomonlylowbitrate` | See `roomtier1bitrate` | -             | -                      |
| `roomtier1bitrate`  | `rt1b`, `roomonlylowbitrate`, `rolb` | Integer | Lower automatic room-only bitrate tier |
| `roomtier2bitrate`  | `rt2b`, `roomonlybitrate`, `rob` | Integer | Higher automatic room-only bitrate tier |
| `rob`               | See `roomtier2bitrate` | -              | -                      |
| `rolb`              | See `roomtier1bitrate` | -              | -                      |
| `rounded`           | `round`           | Integer            | Sets rounded corners   |
| `rk`                | See `roomkey`     | -                  | -                      |
| `rt1b`              | See `roomtier1bitrate` | -              | -                      |
| `rt2b`              | See `roomtier2bitrate` | -              | -                      |
| `ruler`             | `grid`, `thirds`  | URL/Boolean        | Shows composition grid |

### S

| Parameter                | Aliases                                    | Values                   | Description                   |
| ------------------------ | ------------------------------------------ | ------------------------ | ----------------------------- |
| `salt`                   | -                                          | String                   | -                             |
| `samplerate`             | `sr`                                       | Integer                  | Sets audio sample rate        |
| `saturation`             | -                                          | Number                   | Sets video saturation         |
| `scale`                  | -                                          | Integer/Boolean          | Sets video scale              |
| `scene`                  | `scn`                                      | String/Integer           | Sets scene                    |
| `scenetype`              | `type`                                     | Integer                  | -                             |
| `screenshare`            | `ss`                                       | Boolean/String           | Enables screen sharing        |
| `screensharecontenthint` | `sscontenthint`, `sscontent`, `sshint`     | String                   | -                             |
| `screenshareaec`         | `ssec`, `ssaec`                            | Boolean                  | Screen share audio settings   |
| `screensharebitrate`     | `ssbitrate`                                | Integer                  | Sets screen share bitrate     |
| `screensharecodec`       | -                                          | String                   | -                             |
| `screensharefps`         | `ssfps`                                    | Integer                  | Sets screen share framerate   |
| `screenshareid`          | `ssid`                                     | String                   | -                             |
| `screensharelabel`       | `sslabel`                                  | String                   | -                             |
| `screensharequality`     | `ssq`                                      | Integer/String           | Sets screen share quality     |
| `screensharetype`        | `sstype`                                   | Integer                  | -                             |
| `secure`                 | -                                          | Boolean                  | -                             |
| `selfbrowsersurface`     | -                                          | String                   | -                             |
| `sendframes`             | -                                          | String                   | -                             |
| `sensordata`             | `sensor`, `gyro`, `gyros`, `accelerometer` | Integer                  | -                             |
| `sensorfilter`           | `sensorsfilter`, `filtersensor`            | String (comma-separated) | -                             |
| `sharpness`              | -                                          | Number                   | Sets video sharpness          |
| `showall`                | -                                          | Boolean                  | -                             |
| `showdirector`           | `sd`                                       | Boolean/Integer          | -                             |
| `showlist`               | -                                          | Boolean                  | -                             |
| `sizelabel`              | See `labelsize`                            | -                        | -                             |
| `slideshow`              | -                                          | Integer                  | -                             |
| `slot`                   | -                                          | Integer                  | -                             |
| `slots`                  | -                                          | Integer                  | -                             |
| `slotmode`               | `slotsmode`                                | Integer                  | -                             |
| `smallshare`             | `smallscreen`                              | Boolean                  | -                             |
| `solo`                   | -                                          | Boolean                  | -                             |
| `speedtest`              | -                                          | Boolean/String           | -                             |
| `splitrecording`         | -                                          | Integer                  | Sets recording split interval |
| `ss`                     | See `screenshare`                          | -                        | -                             |
| `ssb`                    | -                                          | Boolean                  | -                             |
| `ssec`                   | See `screenshareaec`                       | -                        | -                             |
| `sshint`                 | See `screensharecontenthint`               | -                        | -                             |
| `ssid`                   | See `screenshareid`                        | -                        | -                             |
| `sspaused`               | `sspause`, `ssp`                           | Boolean                  | -                             |
| `ssq`                    | See `screensharequality`                   | -                        | -                             |
| `sstype`                 | See `screensharetype`                      | -                        | -                             |
| `stereo`                 | `s`, `proaudio`                            | String/Integer           | Sets stereo mode              |
| `streamid`               | See `view`                                 | -                        | -                             |
| `style`                  | `st`                                       | Integer (0-7)            | Sets interface style          |
| `stun`                   | -                                          | String                   | Sets STUN server              |
| `surfaceswitching`       | -                                          | String                   | -                             |
| `svc`                    | `scalabilitymode`                          | String                   | Sets scalability mode         |
| `systemaudio`            | -                                          | String                   | -                             |

### T

| Parameter          | Aliases                    | Values        | Description                  |
| ------------------ | -------------------------- | ------------- | ---------------------------- |
| `tallyoff`         | `notally`, `to`            | Boolean       | -                            |
| `tc`               | `timecode`, `showtimecode` | Boolean       | -                            |
| `tcp`              | -                          | Boolean       | Forces TCP mode              |
| `testmedia`        | `syntheticmedia`           | Boolean/String | Enables synthetic media mode |
| `testaudio`        | -                          | Boolean       | Synthetic media audio toggle |
| `testvideo`        | -                          | Boolean       | Synthetic media video toggle |
| `testfps`          | -                          | Integer       | Synthetic media FPS          |
| `testwidth`        | -                          | Integer       | Synthetic media width        |
| `testheight`       | -                          | Integer       | Synthetic media height       |
| `testtone`         | -                          | Integer       | Synthetic audio tone (Hz)    |
| `timer`            | -                          | Integer (1-9) | Sets timer position          |
| `to`               | See `tallyoff`             | -             | -                            |
| `token`            | -                          | String        | Authentication token         |
| `totalbitrate`     | `tb`                       | Integer       | -                            |
| `totalroombitrate` | `trb`, `tb`                | Integer       | Sets total room bitrate      |
| `transcript`       | `transcribe`, `trans`      | String        | -                            |
| `transparent`      | `transparency`             | Boolean       | Makes background transparent |
| `trb`              | See `totalroombitrate`     | -             | -                            |
| `turn`             | -                          | String        | Sets TURN server             |
| `type`             | See `scenetype`            | -             | -                            |

### U

| Parameter | Aliases   | Values  | Description |
| --------- | --------- | ------- | ----------- |
| `unsafe`  | -         | Boolean | -           |
| `usedtx`  | See `dtx` | -       | -           |

### V

| Parameter | Aliases            | Values  | Description           |
| --------- | ------------------ | ------- | --------------------- |
| `v`       | See `view`         | -       | -                     |
| `vb`      | See `videobitrate` | -       | -                     |
| `vbr`     | -                  | Boolean | Variable bitrate mode |
| `vd`      | See `videodevice`  | -       | -                     |
| `vdevice` | See `videodevice`  | -       | -                     |
| `ve`      | See `viewereffect` | -       | -                     |
| `vh`      | See `viewheight`   | -       | -                     |
| `vi`      | See `isolation`    | -       | -                     |
| `video`   | -                  | Boolean | -                     |

### V (continued)

| Parameter        | Aliases                               | Values                                   | Description                |
| ---------------- | ------------------------------------- | ---------------------------------------- | -------------------------- |
| `videobitrate`   | `bitrate`, `vb`                       | Integer                                  | Sets video bitrate         |
| `videocontrols`  | See `controls`                        | -                                        | -                          |
| `videodevice`    | `vdevice`, `vd`, `device`, `d`, `vdo` | Device ID/name or `0`/`false`/`no`/`off` | Selects video input device |
| `view`                 | `v`, `streamid`                       | Stream ID                                | Sets view mode                                                    |
| `viewchroma`           | `vchroma`                                                   | Hex color (e.g. `00ff00`, `f00`)         | Receiver-side chroma key: removes this color from incoming video  |
| `viewchromathreshold`  | `vchromathreshold`, `viewchromathresh`, `vchromathresh`     | 0-255 (default 40)                       | Distance threshold for `viewchroma` color matching                |
| `viewchromasmoothing`  | `vchromasmoothing`, `viewchromasmooth`, `vchromasmooth`     | 1-255 (default 30)                       | Edge softness for `viewchroma` transparency falloff               |
| `viewchromahide`       | `viewchromahidesource`, `vchromahide`, `vchromahidesource`  | `0`/`1`/`true`/`false`/`off` (default 1) | Hide the raw source video behind the keyed canvas                 |
| `viewereffect`         | `viewereffects`, `ve`                 | Integer                                  | Sets viewer effects                                               |
| `viewgroup`            | See `groupview`                       | -                                        | -                                                                 |
| `viewheight`           | `vh`                                  | Integer                                  | Sets view height                                                  |
| `viewwidth`            | `vw`                                  | Integer                                  | Sets view width                                                   |
| `virtualeffects` | -                                     | Boolean                                  | -                          |
| `vdo`            | See `videodevice`                     | -                                        | -                          |
| `volume`         | `vol`                                 | 0-100                                    | Sets volume level          |
| `vred`           | -                                     | Boolean                                  | -                          |
| `vw`             | See `viewwidth`                       | -                                        | -                          |

### W

| Parameter                   | Aliases            | Values      | Description               |
| --------------------------- | ------------------ | ----------- | ------------------------- |
| `w`                         | See `width`        | -           | -                         |
| `waitmessage`               | -                  | String      | Sets wait message         |
| `waitimage`                 | -                  | URL         | Sets wait screen image    |
| `waittimeout`               | -                  | Integer     | Sets wait timeout         |
| `wb`                        | See `whitebalance` | -           | -                         |
| `webp`                      | `images`           | String      | Sets WebP image format    |
| `webpquality`               | `webpq`, `wq`      | Integer     | Sets WebP quality         |
| `website`                   | `iframe`           | URL         | Embeds website            |
| `welcomehtml`               | -                  | HTML/Base64 | Sets welcome HTML         |
| `welcomeimage`              | `welcomeimg`       | URL         | Sets welcome image        |
| `welcomemessage`            | -                  | String      | Sets welcome message      |
| `whep`                      | `whepplay`         | URL         | WHEP playback URL         |
| `whepicewait`               | `whepwait`         | Integer     | WHEP ICE timeout          |
| `whepshare`                 | `whepsrc`          | URL         | WHEP share URL            |
| `whepsharetoken`            | `whepsrctoken`     | String      | WHEP share token          |
| `wheptoken`                 | `whepplaytoken`    | String      | WHEP auth token           |
| `whip`                      | `whipview`         | URL         | WHIP URL                  |
| `whipicewait`               | `whipwait`         | Integer     | WHIP ICE timeout          |
| `whipout`                   | `whippush`         | URL         | WHIP output URL           |
| `whipoutaudiobitrate`       | `woab`             | Integer     | WHIP audio bitrate        |
| `whipoutaudiocodec`         | `woac`             | String      | WHIP audio codec          |
| `whipoutcodec`              | `woc`, `wovc`      | String      | WHIP video codec          |
| `whipoutscreensharebitrate` | `wossbitrate`      | Integer     | WHIP screen share bitrate |
| `whipoutscreensharecodec`   | `wosscodec`        | String      | WHIP screen share codec   |
| `whipouttoken`              | -                  | String      | WHIP output token         |
| `whipoutvideobitrate`       | `wovb`             | Integer     | WHIP video bitrate        |
| `whitebalance`              | `wb`, `temp`       | Number      | Sets white balance        |
| `width`                     | `w`                | Integer     | Sets video width          |
| `widgetleft`                | -                  | Boolean     | -                         |
| `widgetwidth`               | -                  | Number      | -                         |
| `wq`                        | See `webpquality`  | -           | -                         |
| `wss`                       | -                  | URL         | WebSocket server URL      |
| `wss2`                      | -                  | URL         | Alternative WebSocket URL |

### Y

| Parameter | Aliases | Values | Description             |
| --------- | ------- | ------ | ----------------------- |
| `youtube` | -       | String | YouTube integration key |

### Z

| Parameter       | Aliases | Values  | Description               |
| --------------- | ------- | ------- | ------------------------- |
| `zoom`          | -       | Boolean | Enables zoom effect       |
| `zoomedbitrate` | `zb`    | Integer | Sets zoomed video bitrate |

### Notes

1. Boolean parameters can typically be set to `true`, `false`, `0`, `1`, `off`, or `no`
2. Many parameters that take integer values have specific valid ranges or expected values
3. Some parameters may behave differently depending on browser, device, or other active parameters
4. URL parameters are case-insensitive
5. When multiple aliases exist for a parameter, they all provide the same functionality
6. Some parameters may require specific hardware, browser support, or other parameters to function

For the most current and detailed information, please refer to the official VDO.Ninja documentation.
