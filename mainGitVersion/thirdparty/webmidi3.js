/**
 * WebMidi.js v3.0.1
 * A JavaScript library to kickstart your MIDI projects
 * https://webmidijs.org
 * Build generated on November 26th, 2021.
 *
 * © Copyright 2015-2021, Jean-Philippe Côté.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

!function(e){"use strict";class t{constructor(e=!1){this.eventMap={},this.eventsSuspended=1==e}addListener(e,r,s={}){if("string"==typeof e&&e.length<1||e instanceof String&&e.length<1||"string"!=typeof e&&!(e instanceof String)&&e!==t.ANY_EVENT)throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");if("function"!=typeof r)throw new TypeError("The callback must be a function.");const a=new n(e,this,r,s);return this.eventMap[e]||(this.eventMap[e]=[]),s.prepend?this.eventMap[e].unshift(a):this.eventMap[e].push(a),a}addOneTimeListener(e,t,n={}){n.remaining=1,this.addListener(e,t,n)}static get ANY_EVENT(){return Symbol.for("Any event")}hasListener(e,r){return void 0===e?!!(this.eventMap[t.ANY_EVENT]&&this.eventMap[t.ANY_EVENT].length>0)||Object.entries(this.eventMap).some(([,e])=>e.length>0):!!(this.eventMap[e]&&this.eventMap[e].length>0)&&(r instanceof n?this.eventMap[e].filter(e=>e===r).length>0:"function"==typeof r?this.eventMap[e].filter(e=>e.callback===r).length>0:null==r)}get eventNames(){return Object.keys(this.eventMap)}getListeners(e){return this.eventMap[e]||[]}suspendEvent(e){this.getListeners(e).forEach(e=>{e.suspended=!0})}unsuspendEvent(e){this.getListeners(e).forEach(e=>{e.suspended=!1})}getListenerCount(e){return this.getListeners(e).length}emit(e,...n){if("string"!=typeof e&&!(e instanceof String))throw new TypeError("The 'event' parameter must be a string.");if(this.eventsSuspended)return;let r=[],s=this.eventMap[t.ANY_EVENT]||[];return this.eventMap[e]&&(s=s.concat(this.eventMap[e])),s.forEach(e=>{if(e.suspended)return;let t=[...n];Array.isArray(e.arguments)&&(t=t.concat(e.arguments)),e.remaining>0&&(r.push(e.callback.apply(e.context,t)),e.count++),--e.remaining<1&&e.remove()}),r}removeListener(e,t,n={}){if(void 0===e)return void(this.eventMap={});if(!this.eventMap[e])return;let r=this.eventMap[e].filter(e=>t&&e.callback!==t||n.remaining&&n.remaining!==e.remaining||n.context&&n.context!==e.context);r.length?this.eventMap[e]=r:delete this.eventMap[e]}async waitFor(e,t={}){return t.duration=parseInt(t.duration),(isNaN(t.duration)||t.duration<=0)&&(t.duration=1/0),new Promise((n,r)=>{let s,a=this.addListener(e,()=>{clearTimeout(s),n()},{remaining:1});t.duration!==1/0&&(s=setTimeout(()=>{a.remove(),r("The duration expired before the event was emitted.")},t.duration))})}get eventCount(){return Object.keys(this.eventMap).length}}class n{constructor(e,n,r,s={}){if("string"!=typeof e&&!(e instanceof String)&&e!==t.ANY_EVENT)throw new TypeError("The 'event' parameter must be a string or EventEmitter.ANY_EVENT.");if(!n)throw new ReferenceError("The 'target' parameter is mandatory.");if("function"!=typeof r)throw new TypeError("The 'callback' must be a function.");void 0===s.arguments||Array.isArray(s.arguments)||(s.arguments=[s.arguments]),(s=Object.assign({context:n,remaining:1/0,arguments:void 0,duration:1/0},s)).duration!==1/0&&setTimeout(()=>this.remove(),s.duration),this.arguments=s.arguments,this.callback=r,this.context=s.context,this.count=0,this.event=e,this.remaining=parseInt(s.remaining)>=1?parseInt(s.remaining):1/0,this.suspended=!1,this.target=n}remove(){this.target.removeListener(this.event,this.callback,{context:this.context,remaining:this.remaining})}}
/**
   * The `Enumerations` class contains enumerations and arrays of elements used throughout the
   * library. All properties are static and should be referenced using the class name. For example:
   * `Enumerations.MIDI_CHANNEL_MESSAGES`.
   *
   * @license Apache-2.0
   * @since 3.0.0
   */class r{static get MIDI_CHANNEL_MESSAGES(){return{noteoff:8,noteon:9,keyaftertouch:10,controlchange:11,programchange:12,channelaftertouch:13,pitchbend:14}}static get MIDI_CHANNEL_NUMBERS(){return[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]}static get MIDI_CHANNEL_MODE_MESSAGES(){return{allsoundoff:120,resetallcontrollers:121,localcontrol:122,allnotesoff:123,omnimodeoff:124,omnimodeon:125,monomodeon:126,polymodeon:127}}static get MIDI_CONTROL_CHANGE_MESSAGES(){return{bankselectcoarse:0,modulationwheelcoarse:1,breathcontrollercoarse:2,controller3:3,footcontrollercoarse:4,portamentotimecoarse:5,dataentrycoarse:6,volumecoarse:7,balancecoarse:8,controller9:9,pancoarse:10,expressioncoarse:11,effectcontrol1coarse:12,effectcontrol2coarse:13,controller14:14,controller15:15,generalpurposeslider1:16,generalpurposeslider2:17,generalpurposeslider3:18,generalpurposeslider4:19,controller20:20,controller21:21,controller22:22,controller23:23,controller24:24,controller25:25,controller26:26,controller27:27,controller28:28,controller29:29,controller30:30,controller31:31,bankselectfine:32,modulationwheelfine:33,breathcontrollerfine:34,controller35:35,footcontrollerfine:36,portamentotimefine:37,dataentryfine:38,volumefine:39,balancefine:40,controller41:41,panfine:42,expressionfine:43,effectcontrol1fine:44,effectcontrol2fine:45,controller46:46,controller47:47,controller48:48,controller49:49,controller50:50,controller51:51,controller52:52,controller53:53,controller54:54,controller55:55,controller56:56,controller57:57,controller58:58,controller59:59,controller60:60,controller61:61,controller62:62,controller63:63,holdpedal:64,portamento:65,sustenutopedal:66,softpedal:67,legatopedal:68,hold2pedal:69,soundvariation:70,resonance:71,soundreleasetime:72,soundattacktime:73,brightness:74,soundcontrol6:75,soundcontrol7:76,soundcontrol8:77,soundcontrol9:78,soundcontrol10:79,generalpurposebutton1:80,generalpurposebutton2:81,generalpurposebutton3:82,generalpurposebutton4:83,controller84:84,controller85:85,controller86:86,controller87:87,controller88:88,controller89:89,controller90:90,reverblevel:91,tremololevel:92,choruslevel:93,celestelevel:94,phaserlevel:95,databuttonincrement:96,databuttondecrement:97,nonregisteredparametercoarse:98,nonregisteredparameterfine:99,registeredparametercoarse:100,registeredparameterfine:101,controller102:102,controller103:103,controller104:104,controller105:105,controller106:106,controller107:107,controller108:108,controller109:109,controller110:110,controller111:111,controller112:112,controller113:113,controller114:114,controller115:115,controller116:116,controller117:117,controller118:118,controller119:119,allsoundoff:120,resetallcontrollers:121,localcontrol:122,allnotesoff:123,omnimodeoff:124,omnimodeon:125,monomodeon:126,polymodeon:127}}static get MIDI_REGISTERED_PARAMETERS(){return{pitchbendrange:[0,0],channelfinetuning:[0,1],channelcoarsetuning:[0,2],tuningprogram:[0,3],tuningbank:[0,4],modulationrange:[0,5],azimuthangle:[61,0],elevationangle:[61,1],gain:[61,2],distanceratio:[61,3],maximumdistance:[61,4],maximumdistancegain:[61,5],referencedistanceratio:[61,6],panspreadangle:[61,7],rollangle:[61,8]}}static get MIDI_SYSTEM_MESSAGES(){return{sysex:240,timecode:241,songposition:242,songselect:243,tunerequest:246,tuningrequest:246,sysexend:247,clock:248,start:250,continue:251,stop:252,activesensing:254,reset:255,midimessage:0,unknownsystemmessage:-1}}}
/**
   * The `Note` class represents a single musical note such as `"D3"`, `"G#4"`, `"F-1"`, `"Gb7"`, etc.
   *
   * `Note` objects can be played back on a single channel by calling
   * [`OutputChannel.playNote()`]{@link OutputChannel#playNote} or, on multiple channels of the same
   * output, by calling [`Output.playNote()`]{@link Output#playNote}.
   *
   * The note has [`attack`](#attack) and [`release`](#release) velocities set at `0.5` by default.
   * These can be changed by passing in the appropriate option. It is also possible to set a
   * system-wide default for attack and release velocities by using the
   * [`WebMidi.defaults`](WebMidi#defaults) property.
   *
   * If you prefer to work with raw MIDI values (`0` to `127`), you can use [`rawAttack`](#rawAttack) and
   * [`rawRelease`](#rawRelease) to both get and set the values.
   *
   * The note may have a [`duration`](#duration). If it does, playback will be automatically stopped
   * when the duration has elapsed by sending a `"noteoff"` event. By default, the duration is set to
   * `Infinity`. In this case, it will never stop playing unless explicitly stopped by calling a
   * method such as [`OutputChannel.stopNote()`]{@link OutputChannel#stopNote},
   * [`Output.stopNote()`]{@link Output#stopNote} or similar.
   *
   * @param value {string|number} The value used to create the note. If an identifier string is used,
   * it must start with the note letter, optionally followed by an accidental and followed by the
   * octave number (`"C3"`, `"G#4"`, `"F-1"`, `"Db7"`, etc.). If a number is used, it must be an
   * integer between 0 and 127. In this case, middle C is considered to be C4 (note number 60).
   *
   * @param {object} [options={}]
   *
   * @param {number} [options.duration=Infinity] The number of milliseconds before the note should be
   * explicitly stopped.
   *
   * @param {number} [options.attack=0.5] The note's attack velocity as a float between 0 and 1. If
   * you wish to use an integer between 0 and 127, use the `rawAttack` option instead. If both
   * `attack` and `rawAttack` are specified, the latter has precedence.
   *
   * @param {number} [options.release=0.5] The note's release velocity as a float between 0 and 1. If
   * you wish to use an integer between 0 and 127, use the `rawRelease` option instead. If both
   * `release` and `rawRelease` are specified, the latter has precedence.
   *
   * @param {number} [options.rawAttack=64] The note's attack velocity as an integer between 0 and
   * 127. If you wish to use a float between 0 and 1, use the `release` option instead. If both
   * `attack` and `rawAttack` are specified, the latter has precedence.
   *
   * @param {number} [options.rawRelease=64] The note's release velocity as an integer between 0 and
   * 127. If you wish to use a float between 0 and 1, use the `release` option instead. If both
   * `release` and `rawRelease` are specified, the latter has precedence.
   *
   * @throws {Error} Invalid note identifier
   * @throws {RangeError} Invalid name value
   * @throws {RangeError} Invalid accidental value
   * @throws {RangeError} Invalid octave value
   * @throws {RangeError} Invalid duration value
   * @throws {RangeError} Invalid attack value
   * @throws {RangeError} Invalid release value
   *
   * @license Apache-2.0
   * @since 3.0.0
   */class s{constructor(e,t={}){this.duration=d.defaults.note.duration,this.attack=d.defaults.note.attack,this.release=d.defaults.note.release,null!=t.duration&&(this.duration=t.duration),null!=t.attack&&(this.attack=t.attack),null!=t.rawAttack&&(this.attack=a.from7bitToFloat(t.rawAttack)),null!=t.release&&(this.release=t.release),null!=t.rawRelease&&(this.release=a.from7bitToFloat(t.rawRelease)),Number.isInteger(e)?this.identifier=a.toNoteIdentifier(e):this.identifier=e}get identifier(){return this._name+(this._accidental||"")+this._octave}set identifier(e){const t=a.getNoteDetails(e);if(d.validation&&!e)throw new Error("Invalid note identifier");this._name=t.name,this._accidental=t.accidental,this._octave=t.octave}get name(){return this._name}set name(e){if(d.validation&&(e=e.toUpperCase(),!["C","D","E","F","G","A","B"].includes(e)))throw new Error("Invalid name value");this._name=e}get accidental(){return this._accidental}set accidental(e){if(d.validation&&(e=e.toLowerCase(),!["#","##","b","bb"].includes(e)))throw new Error("Invalid accidental value");this._accidental=e}get octave(){return this._octave}set octave(e){if(d.validation&&(e=parseInt(e),isNaN(e)))throw new Error("Invalid octave value");this._octave=e}get duration(){return this._duration}set duration(e){if(d.validation&&(e=parseFloat(e),isNaN(e)||null===e||e<0))throw new RangeError("Invalid duration value.");this._duration=e}get attack(){return this._attack}set attack(e){if(d.validation&&(e=parseFloat(e),isNaN(e)||!(e>=0&&e<=1)))throw new RangeError("Invalid attack value.");this._attack=e}get release(){return this._release}set release(e){if(d.validation&&(e=parseFloat(e),isNaN(e)||!(e>=0&&e<=1)))throw new RangeError("Invalid release value.");this._release=e}get rawAttack(){return a.fromFloatTo7Bit(this._attack)}set rawAttack(e){this._attack=a.from7bitToFloat(e)}get rawRelease(){return a.fromFloatTo7Bit(this._release)}set rawRelease(e){this._release=a.from7bitToFloat(e)}get number(){return a.toNoteNumber(this.identifier)}getOffsetNumber(e=0,t=0){return d.validation&&(e=parseInt(e)||0,t=parseInt(t)||0),Math.min(Math.max(this.number+12*e+t,0),127)}}
/**
   * The `Utilities` class contains general-purpose utility methods. All methods are static and
   * should be called using the class name. For example: `Utilities.getNoteDetails("C4")`.
   *
   * @license Apache-2.0
   * @since 3.0.0
   */class a{
/**
     * Returns a MIDI note number matching the identifier passed in the form of a string. The
     * identifier must include the octave number. The identifier also optionally include a sharp (#),
     * a double sharp (##), a flat (b) or a double flat (bb) symbol. For example, these are all valid
     * identifiers: C5, G4, D#-1, F0, Gb7, Eb-1, Abb4, B##6, etc.
     *
     * When converting note identifiers to numbers, C4 is considered to be middle C (MIDI note number
     * 60) as per the scientific pitch notation standard.
     *
     * The resulting note number can be offset by using the `octaveOffset` parameter.
     *
     * @param identifier {string} The identifier in the form of a letter, followed by an optional "#",
     * "##", "b" or "bb" followed by the octave number. For exemple: C5, G4, D#-1, F0, Gb7, Eb-1,
     * Abb4, B##6, etc.
     *
     * @param {number} [octaveOffset=0] A integer to offset the octave by.
     *
     * @returns {number} The MIDI note number (an integer between 0 and 127).
     *
     * @throws RangeError Invalid 'octaveOffset' value
     *
     * @throws TypeError Invalid note identifier
     *
     * @license Apache-2.0
     * @since 3.0.0
     * @static
     */
static toNoteNumber(e,t=0){if(t=null==t?0:parseInt(t),isNaN(t))throw new RangeError("Invalid 'octaveOffset' value");"string"!=typeof e&&(e="");const n=this.getNoteDetails(e);if(!n)throw new TypeError("Invalid note identifier");let r=12*(n.octave+1+t);if(r+={C:0,D:2,E:4,F:5,G:7,A:9,B:11}[n.name],n.accidental&&(n.accidental.startsWith("b")?r-=n.accidental.length:r+=n.accidental.length),r<0||r>127)throw new RangeError("Invalid octaveOffset value");return r}static getNoteDetails(e){Number.isInteger(e)&&(e=this.toNoteIdentifier(e));const t=e.match(/^([CDEFGAB])(#{0,2}|b{0,2})(-?\d+)$/i);if(!t)throw new TypeError("Invalid note identifier");const n=t[1].toUpperCase(),r=parseInt(t[3]);let s=t[2].toLowerCase();return s=""===s?void 0:s,{accidental:s,identifier:n+(s||"")+r,name:n,octave:r}}static sanitizeChannels(e){let t;if(this.validation)if("all"===e)t=["all"];else if("none"===e)return[];return t=Array.isArray(e)?e:[e],t.indexOf("all")>-1&&(t=r.MIDI_CHANNEL_NUMBERS),t.map((function(e){return parseInt(e)})).filter((function(e){return e>=1&&e<=16}))}static toTimestamp(e){let t=!1;const n=parseFloat(e);return!isNaN(n)&&("string"==typeof e&&"+"===e.substring(0,1)?n>=0&&(t=d.time+n):n>=0&&(t=n),t)}static guessNoteNumber(e,t){t=parseInt(t)||0;let n=!1;if(Number.isInteger(e)&&e>=0&&e<=127)n=parseInt(e);else if(parseInt(e)>=0&&parseInt(e)<=127)n=parseInt(e);else if("string"==typeof e||e instanceof String)try{n=this.toNoteNumber(e.trim(),t)}catch(e){return!1}return n}static toNoteIdentifier(e,t){if(e=parseInt(e),isNaN(e)||e<0||e>127)throw new RangeError("Invalid note number");if(t=null==t?0:parseInt(t),isNaN(t))throw new RangeError("Invalid octaveOffset value");const n=Math.floor(e/12-1)+t;return["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"][e%12]+n.toString()}static buildNote(e,t={}){if(t.octaveOffset=parseInt(t.octaveOffset)||0,e instanceof s)return e;let n=this.guessNoteNumber(e,t.octaveOffset);if(!1===n)throw new TypeError(`The input could not be parsed as a note (${e})`);return t.octaveOffset=void 0,new s(n,t)}static buildNoteArray(e,t={}){let n=[];return Array.isArray(e)||(e=[e]),e.forEach(e=>{n.push(this.buildNote(e,t))}),n}static from7bitToFloat(e){return e===1/0&&(e=127),e=parseInt(e)||0,Math.min(Math.max(e/127,0),1)}static fromFloatTo7Bit(e){return e===1/0&&(e=1),e=parseFloat(e)||0,Math.min(Math.max(Math.round(127*e),0),127)}static fromMsbLsbToFloat(e,t=0){d.validation&&(e=Math.min(Math.max(parseInt(e)||0,0),127),t=Math.min(Math.max(parseInt(t)||0,0),127));const n=((e<<7)+t)/16383;return Math.min(Math.max(n,0),1)}static fromFloatToMsbLsb(e){d.validation&&(e=Math.min(Math.max(parseFloat(e)||0,0),1));const t=Math.round(16383*e);return{msb:t>>7,lsb:127&t}}static offsetNumber(e,t=0,n=0){if(d.validation){if(e=parseInt(e),isNaN(e))throw new Error("Invalid note number");t=parseInt(t)||0,n=parseInt(n)||0}return Math.min(Math.max(e+12*t+n,0),127)}static getPropertyByValue(e,t){return Object.keys(e).find(n=>e[n]===t)}static getCcNameByNumber(e){return a.getPropertyByValue(r.MIDI_CONTROL_CHANGE_MESSAGES,e)}static getChannelModeByNumber(e){if(!(e>=120&&e<=127))return!1;for(let t in r.MIDI_CHANNEL_MODE_MESSAGES)if(r.MIDI_CHANNEL_MODE_MESSAGES.hasOwnProperty(t)&&e===r.MIDI_CHANNEL_MODE_MESSAGES[t])return t;return!1}}
/**
   * The `OutputChannel` class represents a single output MIDI channel. `OutputChannel` objects are
   * provided by an [`Output`](Output) port which, itself, is made available by a device. The
   * `OutputChannel` object is derived from the host's MIDI subsystem and should not be instantiated
   * directly.
   *
   * All 16 `OutputChannel` objects can be found inside the parent output's
   * [`channels`]{@link Output#channels} property.
   *
   * @param {Output} output The [`Output`](Output) this channel belongs to.
   * @param {number} number The MIDI channel number (`1` - `16`).
   *
   * @extends EventEmitter
   * @license Apache-2.0
   * @since 3.0.0
   */class i extends t{constructor(e,t){super(),this._output=e,this._number=t,this._octaveOffset=0}destroy(){this._output=null,this._number=null,this._octaveOffset=0,this.removeListener()}send(e,t={time:0}){return this.output.send(e,t),this}sendKeyAftertouch(e,t,n={}){if(d.validation){if(n.useRawValue&&(n.rawValue=n.useRawValue),isNaN(parseFloat(t)))throw new RangeError("Invalid key aftertouch value.");if(n.rawValue){if(!(t>=0&&t<=127&&Number.isInteger(t)))throw new RangeError("Key aftertouch raw value must be an integer between 0 and 127.")}else if(!(t>=0&&t<=1))throw new RangeError("Key aftertouch value must be a float between 0 and 1.")}n.rawValue||(t=a.fromFloatTo7Bit(t));const s=d.octaveOffset+this.output.octaveOffset+this.octaveOffset;return Array.isArray(e)||(e=[e]),a.buildNoteArray(e).forEach(e=>{this.send([(r.MIDI_CHANNEL_MESSAGES.keyaftertouch<<4)+(this.number-1),e.getOffsetNumber(s),t],{time:a.toTimestamp(n.time)})}),this}
/**
     * Sends a MIDI **control change** message to the channel at the scheduled time. The control
     * change message to send can be specified numerically (`0` to `127`) or by using one of the
     * following common names:
     *
     * | Number | Name                          |
     * |--------|-------------------------------|
     * | 0      |`bankselectcoarse`             |
     * | 1      |`modulationwheelcoarse`        |
     * | 2      |`breathcontrollercoarse`       |
     * | 4      |`footcontrollercoarse`         |
     * | 5      |`portamentotimecoarse`         |
     * | 6      |`dataentrycoarse`              |
     * | 7      |`volumecoarse`                 |
     * | 8      |`balancecoarse`                |
     * | 10     |`pancoarse`                    |
     * | 11     |`expressioncoarse`             |
     * | 12     |`effectcontrol1coarse`         |
     * | 13     |`effectcontrol2coarse`         |
     * | 18     |`generalpurposeslider3`        |
     * | 19     |`generalpurposeslider4`        |
     * | 32     |`bankselectfine`               |
     * | 33     |`modulationwheelfine`          |
     * | 34     |`breathcontrollerfine`         |
     * | 36     |`footcontrollerfine`           |
     * | 37     |`portamentotimefine`           |
     * | 38     |`dataentryfine`                |
     * | 39     |`volumefine`                   |
     * | 40     |`balancefine`                  |
     * | 42     |`panfine`                      |
     * | 43     |`expressionfine`               |
     * | 44     |`effectcontrol1fine`           |
     * | 45     |`effectcontrol2fine`           |
     * | 64     |`holdpedal`                    |
     * | 65     |`portamento`                   |
     * | 66     |`sustenutopedal`               |
     * | 67     |`softpedal`                    |
     * | 68     |`legatopedal`                  |
     * | 69     |`hold2pedal`                   |
     * | 70     |`soundvariation`               |
     * | 71     |`resonance`                    |
     * | 72     |`soundreleasetime`             |
     * | 73     |`soundattacktime`              |
     * | 74     |`brightness`                   |
     * | 75     |`soundcontrol6`                |
     * | 76     |`soundcontrol7`                |
     * | 77     |`soundcontrol8`                |
     * | 78     |`soundcontrol9`                |
     * | 79     |`soundcontrol10`               |
     * | 80     |`generalpurposebutton1`        |
     * | 81     |`generalpurposebutton2`        |
     * | 82     |`generalpurposebutton3`        |
     * | 83     |`generalpurposebutton4`        |
     * | 91     |`reverblevel`                  |
     * | 92     |`tremololevel`                 |
     * | 93     |`choruslevel`                  |
     * | 94     |`celestelevel`                 |
     * | 95     |`phaserlevel`                  |
     * | 96     |`databuttonincrement`          |
     * | 97     |`databuttondecrement`          |
     * | 98     |`nonregisteredparametercoarse` |
     * | 99     |`nonregisteredparameterfine`   |
     * | 100    |`registeredparametercoarse`    |
     * | 101    |`registeredparameterfine`      |
     * | 120    |`allsoundoff`                  |
     * | 121    |`resetallcontrollers`          |
     * | 122    |`localcontrol`                 |
     * | 123    |`allnotesoff`                  |
     * | 124    |`omnimodeoff`                  |
     * | 125    |`omnimodeon`                   |
     * | 126    |`monomodeon`                   |
     * | 127    |`polymodeon`                   |
     *
     * As you can see above, not all control change message have a matching name. This does not mean
     * you cannot use the others. It simply means you will need to use their number
     * (`0` to `127`) instead of their name. While you can still use them, numbers `120` to `127` are
     * usually reserved for *channel mode* messages. See
     * [`sendChannelMode()`]{@link OutputChannel#sendChannelMode} method for more info.
     *
     * To view a detailed list of all available **control change** messages, please consult "Table 3 -
     * Control Change Messages" from the [MIDI Messages](
     * https://www.midi.org/specifications/item/table-3-control-change-messages-data-bytes-2)
     * specification.
     *
     * **Note**: messages #0-31 (MSB) are paired with messages #32-63 (LSB). For example, message #1
     * (`modulationwheelcoarse`) can be accompanied by a second control change message for
     * `modulationwheelfine` to achieve a greater level of precision. if you want to specify both MSB
     * and LSB for messages between `0` and `31`, you can do so by passing a 2-value array as the
     * second parameter.
     *
     * @param {number|string} controller The MIDI controller name or number (`0` - `127`).
     *
     * @param {number|number[]} value The value to send (0-127). You can also use a two-position array
     * for controllers 0 to 31. In this scenario, the first value will be sent as usual and the second
     * value will be sent to the matching LSB controller (which is obtained by adding 32 to the first
     * controller)
     *
     * @param {object} [options={}]
     *
     * @param {number|string} [options.time] If `time` is a string prefixed with `"+"` and followed by
     * a number, the message will be delayed by that many milliseconds. If the value is a number, the
     * operation will be scheduled for that time. The current time can be retrieved with
     * [`WebMidi.time`]{@link WebMidi#time}. If `options.time` is omitted, or in the past, the
     * operation will be carried out as soon as possible.
     *
     * @throws {RangeError} Controller numbers must be between 0 and 127.
     * @throws {RangeError} Invalid controller name.
     * @throws {TypeError} The value array must have a length of 2.
     *
     * @returns {OutputChannel} Returns the `OutputChannel` object so methods can be chained.
     *
     * @license Apache-2.0
     * @since 3.0.0
     */sendControlChange(e,t,n={}){if("string"==typeof e&&(e=r.MIDI_CONTROL_CHANGE_MESSAGES[e]),Array.isArray(t)||(t=[t]),d.validation){if(void 0===e)throw new TypeError("Control change must be identified with a valid name or an integer between 0 and 127.");if(!Number.isInteger(e)||!(e>=0&&e<=127))throw new TypeError("Control change number must be an integer between 0 and 127.");if(2===(t=t.map(e=>{const t=Math.min(Math.max(parseInt(e),0),127);if(isNaN(t))throw new TypeError("Values must be integers between 0 and 127");return t})).length&&e>=32)throw new TypeError("To use a value array, the controller must be between 0 and 31")}return t.forEach((s,i)=>{this.send([(r.MIDI_CHANNEL_MESSAGES.controlchange<<4)+(this.number-1),e+32*i,t[i]],{time:a.toTimestamp(n.time)})}),this}_selectNonRegisteredParameter(e,t={}){return this.sendControlChange(99,e[0],t),this.sendControlChange(98,e[1],t),this}_deselectRegisteredParameter(e={}){return this.sendControlChange(101,127,e),this.sendControlChange(100,127,e),this}_deselectNonRegisteredParameter(e={}){return this.sendControlChange(101,127,e),this.sendControlChange(100,127,e),this}_selectRegisteredParameter(e,t={}){return this.sendControlChange(101,e[0],t),this.sendControlChange(100,e[1],t),this}_setCurrentParameter(e,t={}){return e=[].concat(e),this.sendControlChange(6,e[0],t),e.length<2||this.sendControlChange(38,e[1],t),this}sendRpnDecrement(e,t={}){if(Array.isArray(e)||(e=r.MIDI_REGISTERED_PARAMETERS[e]),d.validation){if(void 0===e)throw new TypeError("The specified registered parameter is invalid.");let t=!1;if(Object.getOwnPropertyNames(r.MIDI_REGISTERED_PARAMETERS).forEach(n=>{r.MIDI_REGISTERED_PARAMETERS[n][0]===e[0]&&r.MIDI_REGISTERED_PARAMETERS[n][1]===e[1]&&(t=!0)}),!t)throw new TypeError("The specified registered parameter is invalid.")}return this._selectRegisteredParameter(e,t),this.sendControlChange(97,0,t),this._deselectRegisteredParameter(t),this}sendRpnIncrement(e,t={}){if(Array.isArray(e)||(e=r.MIDI_REGISTERED_PARAMETERS[e]),d.validation){if(void 0===e)throw new TypeError("The specified registered parameter is invalid.");let t=!1;if(Object.getOwnPropertyNames(r.MIDI_REGISTERED_PARAMETERS).forEach(n=>{r.MIDI_REGISTERED_PARAMETERS[n][0]===e[0]&&r.MIDI_REGISTERED_PARAMETERS[n][1]===e[1]&&(t=!0)}),!t)throw new TypeError("The specified registered parameter is invalid.")}return this._selectRegisteredParameter(e,t),this.sendControlChange(96,0,t),this._deselectRegisteredParameter(t),this}playNote(e,t={}){if(this.sendNoteOn(e,t),t.duration>0&&isFinite(String(t.duration).trim()||NaN)){let n={time:(a.toTimestamp(t.time)||d.time)+t.duration,release:t.release,rawRelease:t.rawRelease};this.sendNoteOff(e,n)}return this}sendNoteOff(e,t={}){if(d.validation){if(null!=t.rawRelease&&!(t.rawRelease>=0&&t.rawRelease<=127))throw new RangeError("The 'rawRelease' option must be an integer between 0 and 127");if(null!=t.release&&!(t.release>=0&&t.release<=1))throw new RangeError("The 'release' option must be an number between 0 and 1");t.rawVelocity&&(t.rawRelease=t.velocity,console.warn("The 'rawVelocity' option is deprecated. Use 'rawRelease' instead.")),t.velocity&&(t.release=t.velocity,console.warn("The 'velocity' option is deprecated. Use 'attack' instead."))}let n=64;null!=t.rawRelease?n=t.rawRelease:isNaN(t.release)||(n=Math.round(127*t.release));const s=d.octaveOffset+this.output.octaveOffset+this.octaveOffset;return a.buildNoteArray(e,{rawRelease:parseInt(n)}).forEach(e=>{this.send([(r.MIDI_CHANNEL_MESSAGES.noteoff<<4)+(this.number-1),e.getOffsetNumber(s),e.rawRelease],{time:a.toTimestamp(t.time)})}),this}stopNote(e,t={}){return this.sendNoteOff(e,t)}sendNoteOn(e,t={}){if(d.validation){if(null!=t.rawAttack&&!(t.rawAttack>=0&&t.rawAttack<=127))throw new RangeError("The 'rawAttack' option must be an integer between 0 and 127");if(null!=t.attack&&!(t.attack>=0&&t.attack<=1))throw new RangeError("The 'attack' option must be an number between 0 and 1");t.rawVelocity&&(t.rawAttack=t.velocity,t.rawRelease=t.release,console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' or 'rawRelease'.")),t.velocity&&(t.attack=t.velocity,console.warn("The 'velocity' option is deprecated. Use 'attack' instead."))}let n=64;null!=t.rawAttack?n=t.rawAttack:isNaN(t.attack)||(n=Math.round(127*t.attack));const s=d.octaveOffset+this.output.octaveOffset+this.octaveOffset;return a.buildNoteArray(e,{rawAttack:n}).forEach(e=>{this.send([(r.MIDI_CHANNEL_MESSAGES.noteon<<4)+(this.number-1),e.getOffsetNumber(s),e.rawAttack],{time:a.toTimestamp(t.time)})}),this}sendChannelMode(e,t=0,n={}){if("string"==typeof e&&(e=r.MIDI_CHANNEL_MODE_MESSAGES[e]),d.validation){if(void 0===e)throw new TypeError("Invalid channel mode message name or number.");if(isNaN(e)||!(e>=120&&e<=127))throw new TypeError("Invalid channel mode message number.");if(isNaN(parseInt(t))||t<0||t>127)throw new RangeError("Value must be an integer between 0 and 127.")}return this.send([(r.MIDI_CHANNEL_MESSAGES.controlchange<<4)+(this.number-1),e,t],{time:a.toTimestamp(n.time)}),this}sendOmniMode(e,t={}){return void 0===e||e?this.sendChannelMode("omnimodeon",0,t):this.sendChannelMode("omnimodeoff",0,t),this}sendChannelAftertouch(e,t={}){if(d.validation){if(isNaN(parseFloat(e)))throw new RangeError("Invalid channel aftertouch value.");if(t.rawValue){if(!(e>=0&&e<=127&&Number.isInteger(e)))throw new RangeError("Channel aftertouch raw value must be an integer between 0 and 127.")}else if(!(e>=0&&e<=1))throw new RangeError("Channel aftertouch value must be a float between 0 and 1.")}return this.send([(r.MIDI_CHANNEL_MESSAGES.channelaftertouch<<4)+(this.number-1),Math.round(127*e)],{time:a.toTimestamp(t.time)}),this}sendMasterTuning(e,t={}){if(e=parseFloat(e)||0,d.validation&&!(e>-65&&e<64))throw new RangeError("The value must be a decimal number larger than -65 and smaller than 64.");let n=Math.floor(e)+64,r=e-Math.floor(e);r=Math.round((r+1)/2*16383);let s=r>>7&127,a=127&r;return this.sendRpnValue("channelcoarsetuning",n,t),this.sendRpnValue("channelfinetuning",[s,a],t),this}sendModulationRange(e,t,n={}){if(d.validation){if(!Number.isInteger(e)||!(e>=0&&e<=127))throw new RangeError("The semitones value must be an integer between 0 and 127.");if(!(null==t||Number.isInteger(t)&&t>=0&&t<=127))throw new RangeError("If specified, the cents value must be an integer between 0 and 127.")}return t>=0&&t<=127||(t=0),this.sendRpnValue("modulationrange",[e,t],n),this}sendNrpnValue(e,t,n={}){if(t=[].concat(t),d.validation){if(!Array.isArray(e)||!Number.isInteger(e[0])||!Number.isInteger(e[1]))throw new TypeError("The specified NRPN is invalid.");if(!(e[0]>=0&&e[0]<=127))throw new RangeError("The first byte of the NRPN must be between 0 and 127.");if(!(e[1]>=0&&e[1]<=127))throw new RangeError("The second byte of the NRPN must be between 0 and 127.");t.forEach(e=>{if(!(e>=0&&e<=127))throw new RangeError("The data bytes of the NRPN must be between 0 and 127.")})}return this._selectNonRegisteredParameter(e,n),this._setCurrentParameter(t,n),this._deselectNonRegisteredParameter(n),this}sendPitchBend(e,t={}){if(d.validation)if(t.rawValue&&Array.isArray(e)){if(!(e[0]>=0&&e[0]<=127))throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.");if(!(e[1]>=0&&e[1]<=127))throw new RangeError("The pitch bend LSB must be an integer between 0 and 127.")}else if(t.rawValue&&!Array.isArray(e)){if(!(e>=0&&e<=127))throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.")}else{if(isNaN(e)||null===e)throw new RangeError("Invalid pitch bend value.");if(!(e>=-1&&e<=1))throw new RangeError("The pitch bend MSB must be an integer between 0 and 127.")}let n=0,s=0;if(t.rawValue&&Array.isArray(e))n=e[0],s=e[1];else if(t.rawValue&&!Array.isArray(e))n=e;else{const t=a.fromFloatToMsbLsb((e+1)/2);n=t.msb,s=t.lsb}return this.send([(r.MIDI_CHANNEL_MESSAGES.pitchbend<<4)+(this.number-1),s,n],{time:a.toTimestamp(t.time)}),this}sendPitchBendRange(e,t,n={}){if(d.validation){if(!Number.isInteger(e)||!(e>=0&&e<=127))throw new RangeError("The semitones value must be an integer between 0 and 127.");if(!Number.isInteger(t)||!(t>=0&&t<=127))throw new RangeError("The cents value must be an integer between 0 and 127.")}return this.sendRpnValue("pitchbendrange",[e,t],n),this}sendProgramChange(e,t={}){if(e=parseInt(e)||0,d.validation&&!(e>=0&&e<=127))throw new RangeError("The program number must be between 0 and 127.");return this.send([(r.MIDI_CHANNEL_MESSAGES.programchange<<4)+(this.number-1),e],{time:a.toTimestamp(t.time)}),this}sendRpnValue(e,t,n={}){if(Array.isArray(e)||(e=r.MIDI_REGISTERED_PARAMETERS[e]),d.validation){if(!Number.isInteger(e[0])||!Number.isInteger(e[1]))throw new TypeError("The specified NRPN is invalid.");if(!(e[0]>=0&&e[0]<=127))throw new RangeError("The first byte of the RPN must be between 0 and 127.");if(!(e[1]>=0&&e[1]<=127))throw new RangeError("The second byte of the RPN must be between 0 and 127.");[].concat(t).forEach(e=>{if(!(e>=0&&e<=127))throw new RangeError("The data bytes of the RPN must be between 0 and 127.")})}return this._selectRegisteredParameter(e,n),this._setCurrentParameter(t,n),this._deselectRegisteredParameter(n),this}sendTuningBank(e,t={}){if(d.validation&&(!Number.isInteger(e)||!(e>=0&&e<=127)))throw new RangeError("The tuning bank number must be between 0 and 127.");return this.sendRpnValue("tuningbank",e,t),this}sendTuningProgram(e,t={}){if(d.validation&&(!Number.isInteger(e)||!(e>=0&&e<=127)))throw new RangeError("The tuning program number must be between 0 and 127.");return this.sendRpnValue("tuningprogram",e,t),this}sendLocalControl(e,t={}){return e?this.sendChannelMode("localcontrol",127,t):this.sendChannelMode("localcontrol",0,t)}sendAllNotesOff(e={}){return this.sendChannelMode("allnotesoff",0,e)}sendAllSoundOff(e={}){return this.sendChannelMode("allsoundoff",0,e)}sendResetAllControllers(e={}){return this.sendChannelMode("resetallcontrollers",0,e)}sendPolyphonicMode(e,t={}){return"mono"===e?this.sendChannelMode("monomodeon",0,t):this.sendChannelMode("polymodeon",0,t)}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get output(){return this._output}get number(){return this._number}}
/**
   * The `Output` class represents a single MIDI output port (not to be confused with a MIDI channel).
   * A port is made available by a MIDI device. A MIDI device can advertise several input and output
   * ports. Each port has 16 MIDI channels which can be accessed via the [`channels`](#channels)
   * property.
   *
   * The `Output` object is automatically instantiated by the library according to the host's MIDI
   * subsystem and should not be directly instantiated.
   *
   * You can access all available `Output` objects by referring to the
   * [`WebMidi.outputs`](WebMidi#outputs) array or by using methods such as
   * [`WebMidi.getOutputByName()`](WebMidi#getOutputByName) or
   * [`WebMidi.getOutputById()`](WebMidi#getOutputById).
   *
   * @param {MIDIOutput} midiOutput [`MIDIOutput`](https://developer.mozilla.org/en-US/docs/Web/API/MIDIOutput)
   * object as provided by the MIDI subsystem.
   *
   * @fires Output#opened
   * @fires Output#disconnected
   * @fires Output#closed
   *
   * @extends EventEmitter
   * @license Apache-2.0
   */class o extends t{constructor(e){super(),this._midiOutput=e,this._octaveOffset=0,this.channels=[];for(let e=1;e<=16;e++)this.channels[e]=new i(this,e);this._midiOutput.onstatechange=this._onStateChange.bind(this)}async destroy(){this.removeListener(),this.channels.forEach(e=>e.destroy()),this.channels=[],this._midiOutput.onstatechange=null,await this.close(),this._midiOutput=null}_onStateChange(e){let t={timestamp:d.time};"open"===e.port.connection?(t.type="opened",t.target=this,this.emit("opened",t)):"closed"===e.port.connection&&"connected"===e.port.state?(t.type="closed",t.target=this,this.emit("closed",t)):"closed"===e.port.connection&&"disconnected"===e.port.state?(t.type="disconnected",t.target={connection:e.port.connection,id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},this.emit("disconnected",t)):"pending"===e.port.connection&&"disconnected"===e.port.state||console.warn("This statechange event was not caught:",e.port.connection,e.port.state)}async open(){try{return await this._midiOutput.open(),Promise.resolve(this)}catch(e){return Promise.reject(e)}}async close(){this._midiOutput?await this._midiOutput.close():await Promise.resolve()}
/**
     * Sends a MIDI message on the MIDI output port. If no time is specified, the message will be
     * sent immediately. The message should be an array of 8 bit unsigned integers (0-225), a
     * [`Uint8Array`]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array}
     * object or a [`Message`](Message) object.
     *
     * It is usually not necessary to use this method directly as you can use one of the simpler
     * helper methods such as [`playNote()`](#playNote), [`stopNote()`](#stopNote),
     * [`sendControlChange()`](#sendControlChange), etc.
     *
     * Details on the format of MIDI messages are available in the summary of
     * [MIDI messages]{@link https://www.midi.org/specifications-old/item/table-1-summary-of-midi-message}
     * from the MIDI Manufacturers Association.
     *
     * @param message {number[]|Uint8Array|Message} An array of 8bit unsigned integers, a `Uint8Array`
     * object (not available in Node.js) containing the message bytes or a `Message` object.
     *
     * @param {object} [options={}]
     *
     * @param {number|string} [options.time=(now)] If `time` is a string prefixed with `"+"` and
     * followed by a number, the message will be delayed by that many milliseconds. If the value is a
     * number
     * [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp),
     * the operation will be scheduled for that specific time. If `time` is omitted, or in the past,
     * the operation will be carried out as soon as possible.
     *
     * @throws {RangeError} The first byte (status) must be an integer between 128 and 255.
     *
     * @returns {Output} Returns the `Output` object so methods can be chained.
     *
     * @license Apache-2.0
     */send(e,t={time:0},n){if(e instanceof c&&(e=d.isNode?e.data:e.rawData),e instanceof Uint8Array&&d.isNode&&(e=Array.from(e)),d.validation){if(Array.isArray(e)||e instanceof Uint8Array||(e=[e],Array.isArray(t)&&(e=e.concat(t)),t=n?{time:n}:{time:0}),!(parseInt(e[0])>=128&&parseInt(e[0])<=255))throw new RangeError("The first byte (status) must be an integer between 128 and 255.");e.slice(1).forEach(e=>{if(!((e=parseInt(e))>=0&&e<=255))throw new RangeError("Data bytes must be integers between 0 and 255.")}),t||(t={time:0})}return this._midiOutput.send(e,a.toTimestamp(t.time)),this}sendSysex(e,t=[],n={}){if(e=[].concat(e),t instanceof Uint8Array){const s=new Uint8Array(1+e.length+t.length+1);s[0]=r.MIDI_SYSTEM_MESSAGES.sysex,s.set(Uint8Array.from(e),1),s.set(t,1+e.length),s[s.length-1]=r.MIDI_SYSTEM_MESSAGES.sysexend,this.send(s,{time:n.time})}else{const s=e.concat(t,r.MIDI_SYSTEM_MESSAGES.sysexend);this.send([r.MIDI_SYSTEM_MESSAGES.sysex].concat(s),{time:n.time})}return this}clear(){return this._midiOutput.clear?this._midiOutput.clear():d.validation&&console.warn("The 'clear()' method has not yet been implemented in your environment."),this}sendTimecodeQuarterFrame(e,t={}){if(d.validation&&(e=parseInt(e),isNaN(e)||!(e>=0&&e<=127)))throw new RangeError("The value must be an integer between 0 and 127.");return this.send([r.MIDI_SYSTEM_MESSAGES.timecode,e],{time:t.time}),this}sendSongPosition(e=0,t={}){var n=(e=Math.floor(e)||0)>>7&127,s=127&e;return this.send([r.MIDI_SYSTEM_MESSAGES.songposition,n,s],{time:t.time}),this}sendSongSelect(e=0,t={}){if(d.validation&&(e=parseInt(e),isNaN(e)||!(e>=0&&e<=127)))throw new RangeError("The program value must be between 0 and 127");return this.send([r.MIDI_SYSTEM_MESSAGES.songselect,e],{time:t.time}),this}sendTuneRequest(e={}){return this.send([r.MIDI_SYSTEM_MESSAGES.tunerequest],{time:e.time}),this}sendClock(e={}){return this.send([r.MIDI_SYSTEM_MESSAGES.clock],{time:e.time}),this}sendStart(e={}){return this.send([r.MIDI_SYSTEM_MESSAGES.start],{time:e.time}),this}sendContinue(e={}){return this.send([r.MIDI_SYSTEM_MESSAGES.continue],{time:e.time}),this}sendStop(e={}){return this.send([r.MIDI_SYSTEM_MESSAGES.stop],{time:e.time}),this}sendActiveSensing(e={}){return this.send([r.MIDI_SYSTEM_MESSAGES.activesensing],{time:e.time}),this}sendReset(e={}){return this.send([r.MIDI_SYSTEM_MESSAGES.reset],{time:e.time}),this}sendTuningRequest(e={}){return d.validation&&console.warn("The sendTuningRequest() method has been deprecated. Use sendTuningRequest() instead."),this.sendTuneRequest(e)}sendKeyAftertouch(e,t,n={}){return null==n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendKeyAftertouch(e,t,n)}),this}sendControlChange(e,t,n={},s={}){if(d.validation&&(Array.isArray(n)||Number.isInteger(n)||"all"===n)){const e=n;(n=s).channels=e,"all"===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS)}return null==n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendControlChange(e,t,n)}),this}sendPitchBendRange(e=0,t=0,n={}){return null==n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendPitchBendRange(e,t,n)}),this}setPitchBendRange(e=0,t=0,n="all",s={}){return d.validation&&(console.warn("The setPitchBendRange() method is deprecated. Use sendPitchBendRange() instead."),s.channels=n,"all"===s.channels&&(s.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendPitchBendRange(e,t,s)}sendRpnValue(e,t,n={}){return null==n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendRpnValue(e,t,n)}),this}setRegisteredParameter(e,t=[],n="all",s={}){return d.validation&&(console.warn("The setRegisteredParameter() method is deprecated. Use sendRpnValue() instead."),s.channels=n,"all"===s.channels&&(s.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendRpnValue(e,t,s)}sendChannelAftertouch(e,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendChannelAftertouch(e,t)}),this}sendPitchBend(e,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendPitchBend(e,t)}),this}sendProgramChange(e=0,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendProgramChange(e,t)}),this}sendModulationRange(e,t,n={}){return null==n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendModulationRange(e,t,n)}),this}setModulationRange(e=0,t=0,n="all",s={}){return d.validation&&(console.warn("The setModulationRange() method is deprecated. Use sendModulationRange() instead."),s.channels=n,"all"===s.channels&&(s.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendModulationRange(e,t,s)}sendMasterTuning(e,t={}){return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendMasterTuning(e,t)}),this}setMasterTuning(e,t={},n={}){return d.validation&&(console.warn("The setMasterTuning() method is deprecated. Use sendMasterTuning() instead."),n.channels=t,"all"===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendMasterTuning(e,n)}sendTuningProgram(e,t={}){return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendTuningProgram(e,t)}),this}setTuningProgram(e,t="all",n={}){return d.validation&&(console.warn("The setTuningProgram() method is deprecated. Use sendTuningProgram() instead."),n.channels=t,"all"===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendTuningProgram(e,n)}sendTuningBank(e=0,t={}){return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendTuningBank(e,t)}),this}setTuningBank(e,t="all",n={}){return d.validation&&(console.warn("The setTuningBank() method is deprecated. Use sendTuningBank() instead."),n.channels=t,"all"===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendTuningBank(e,n)}sendChannelMode(e,t=0,n={},s={}){if(d.validation&&(Array.isArray(n)||Number.isInteger(n)||"all"===n)){const e=n;(n=s).channels=e,"all"===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS)}return null==n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendChannelMode(e,t,n)}),this}sendAllSoundOff(e={}){return null==e.channels&&(e.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(e.channels).forEach(t=>{this.channels[t].sendAllSoundOff(e)}),this}sendAllNotesOff(e={}){return null==e.channels&&(e.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(e.channels).forEach(t=>{this.channels[t].sendAllNotesOff(e)}),this}sendResetAllControllers(e={},t={}){if(d.validation&&(Array.isArray(e)||Number.isInteger(e)||"all"===e)){const n=e;(e=t).channels=n,"all"===e.channels&&(e.channels=r.MIDI_CHANNEL_NUMBERS)}return null==e.channels&&(e.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(e.channels).forEach(t=>{this.channels[t].sendResetAllControllers(e)}),this}sendPolyphonicMode(e,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendPolyphonicMode(e,t)}),this}sendLocalControl(e,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendLocalControl(e,t)}),this}sendOmniMode(e,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendOmniMode(e,t)}),this}sendNrpnValue(e,t,n={}){return null==n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].sendNrpnValue(e,t,n)}),this}setNonRegisteredParameter(e,t=[],n="all",s={}){return d.validation&&(console.warn("The setNonRegisteredParameter() method is deprecated. Use sendNrpnValue() instead."),s.channels=n,"all"===s.channels&&(s.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendNrpnValue(e,t,s)}sendRpnIncrement(e,t={}){return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendRpnIncrement(e,t)}),this}incrementRegisteredParameter(e,t="all",n={}){return d.validation&&(console.warn("The incrementRegisteredParameter() method is deprecated. Use sendRpnIncrement() instead."),n.channels=t,"all"===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendRpnIncrement(e,n)}sendRpnDecrement(e,t={}){return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendRpnDecrement(e,t)}),this}decrementRegisteredParameter(e,t="all",n={}){return d.validation&&(console.warn("The decrementRegisteredParameter() method is deprecated. Use sendRpnDecrement() instead."),n.channels=t,"all"===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS)),this.sendRpnDecrement(e,n)}sendNoteOff(e,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendNoteOff(e,t)}),this}stopNote(e,t){return this.sendNoteOff(e,t)}playNote(e,t={},n={}){if(d.validation&&(t.rawVelocity&&console.warn("The 'rawVelocity' option is deprecated. Use 'rawAttack' instead."),t.velocity&&console.warn("The 'velocity' option is deprecated. Use 'velocity' instead."),Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].playNote(e,t)}),this}sendNoteOn(e,t={},n={}){if(d.validation&&(Array.isArray(t)||Number.isInteger(t)||"all"===t)){const e=t;(t=n).channels=e,"all"===t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS)}return null==t.channels&&(t.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(t.channels).forEach(n=>{this.channels[n].sendNoteOn(e,t)}),this}get name(){return this._midiOutput.name}get id(){return this._midiOutput.id}get connection(){return this._midiOutput.connection}get manufacturer(){return this._midiOutput.manufacturer}get state(){return this._midiOutput.state}get type(){return this._midiOutput.type}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}}
/**
   * The `Forwarder` class allows the forwarding of MIDI messages to predetermined outputs. When you
   * call its [`forward()`](#forward) method, it will send the specified [`Message`](Message) object
   * to all the outputs listed in its [`destinations`](#destinations) property.
   *
   * If specific channels or message types have been defined in the [`channels`](#channels) or
   * [`types`](#types) properties, only messages matching the channels/types will be forwarded.
   *
   * While it can be manually instantiated, you are more likely to come across a `Forwarder` object as
   * the return value of the [`Input.addForwarder()`](Input#addForwarder) method.
   *
   * @param {Output|Output[]} [destinations=\[\]] An [`Output`](Output) object, or an array of such objects,
   * to forward the message to.
   *
   * @param {object} [options={}]
   * @param {string|string[]} [options.types=(all messages)] A MIDI message type or an array of such types
   * (`"noteon"`, `"controlchange"`, etc.), that the specified message must match in order to be
   * forwarded. If this option is not specified, all types of messages will be forwarded. Valid
   * messages are the ones found in either [`MIDI_SYSTEM_MESSAGES`](Enumerations#MIDI_SYSTEM_MESSAGES)
   * or [`MIDI_CHANNEL_MESSAGES`](Enumerations#MIDI_CHANNEL_MESSAGES).
   * @param {number} [options.channels=[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]]
   * A MIDI channel number or an array of channel numbers that the message must match in order to be
   * forwarded. By default all MIDI channels are included (`1` to `16`).
   *
   * @license Apache-2.0
   * @since 3.0.0
   */class l{constructor(e=[],t={}){this.destinations=[],this.types=[...Object.keys(r.MIDI_SYSTEM_MESSAGES),...Object.keys(r.MIDI_CHANNEL_MESSAGES)],this.channels=r.MIDI_CHANNEL_NUMBERS,this.suspended=!1,Array.isArray(e)||(e=[e]),t.types&&!Array.isArray(t.types)&&(t.types=[t.types]),t.channels&&!Array.isArray(t.channels)&&(t.channels=[t.channels]),d.validation&&(e.forEach(e=>{if(!(e instanceof o))throw new TypeError("Destinations must be of type 'Output'.")}),void 0!==t.types&&t.types.forEach(e=>{if(!r.MIDI_SYSTEM_MESSAGES.hasOwnProperty(e)&&!r.MIDI_CHANNEL_MESSAGES.hasOwnProperty(e))throw new TypeError("Type must be a valid message type.")}),void 0!==t.channels&&t.channels.forEach(e=>{if(!r.MIDI_CHANNEL_NUMBERS.includes(e))throw new TypeError("MIDI channel must be between 1 and 16.")})),this.destinations=e,t.types&&(this.types=t.types),t.channels&&(this.channels=t.channels)}forward(e){this.suspended||this.types.includes(e.type)&&(e.channel&&!this.channels.includes(e.channel)||this.destinations.forEach(t=>{(!d.validation||t instanceof o)&&t.send(e)}))}}
/**
   * The `InputChannel` class represents a single MIDI input channel (1-16) from a single input
   * device. This object is derived from the host's MIDI subsystem and should not be instantiated
   * directly.
   *
   * All 16 `InputChannel` objects can be found inside the input's [`channels`](Input#channels)
   * property.
   *
   * @param {Input} input The [`Input`](Input) object this channel belongs to.
   * @param {number} number The channel's MIDI number (1-16).
   *
   * @fires InputChannel#midimessage
   *
   * @fires InputChannel#noteoff
   * @fires InputChannel#noteon
   * @fires InputChannel#keyaftertouch
   * @fires InputChannel#programchange
   * @fires InputChannel#event:controlchange-controllerxxx
   * @fires InputChannel#channelaftertouch
   * @fires InputChannel#pitchbend
   * @fires InputChannel#controlchange
   *
   * @fires InputChannel#allnotesoff
   * @fires InputChannel#allsoundoff
   * @fires InputChannel#localcontrol
   * @fires InputChannel#monomode
   * @fires InputChannel#omnimode
   * @fires InputChannel#resetallcontrollers
   *
   * @fires InputChannel#event:nrpn
   * @fires InputChannel#event:nrpn-dataentrycoarse
   * @fires InputChannel#event:nrpn-dataentryfine
   * @fires InputChannel#event:nrpn-databuttonincrement
   * @fires InputChannel#event:nrpn-databuttondecrement
   * @fires InputChannel#event:rpn
   * @fires InputChannel#event:rpn-dataentrycoarse
   * @fires InputChannel#event:rpn-dataentryfine
   * @fires InputChannel#event:rpn-databuttonincrement
   * @fires InputChannel#event:rpn-databuttondecrement
   *
   * @extends EventEmitter
   * @license Apache-2.0
   * @since 3.0.0
   */class h extends t{constructor(e,t){super(),this._input=e,this._number=t,this._octaveOffset=0,this._nrpnBuffer=[],this._rpnBuffer=[],this.parameterNumberEventsEnabled=!0,this.notesState=new Array(128).fill(!1)}destroy(){this._input=null,this._number=null,this._octaveOffset=0,this._nrpnBuffer=[],this.notesState=new Array(128).fill(!1),this.parameterNumberEventsEnabled=!1,this.removeListener()}_processMidiMessageEvent(e){const t=Object.assign({},e);t.target=this,t.type="midimessage",this.emit(t.type,t),this._parseEventForStandardMessages(t)}_parseEventForStandardMessages(e){const t=Object.assign({},e);t.type=t.message.type||"unknownmidimessage";const n=e.message.dataBytes[0],r=e.message.dataBytes[1];if("noteoff"===t.type||"noteon"===t.type&&0===r)this.notesState[n]=!1,t.note=new s(a.offsetNumber(n,this.octaveOffset+this.input.octaveOffset+d.octaveOffset),{rawAttack:0,rawRelease:r}),t.value=a.from7bitToFloat(r),t.rawValue=r,t.velocity=t.note.release,t.rawVelocity=t.note.rawRelease;else if("noteon"===t.type)this.notesState[n]=!0,t.note=new s(a.offsetNumber(n,this.octaveOffset+this.input.octaveOffset+d.octaveOffset),{rawAttack:r}),t.value=a.from7bitToFloat(r),t.rawValue=r,t.velocity=t.note.attack,t.rawVelocity=t.note.rawAttack;else if("keyaftertouch"===t.type)t.identifier=a.toNoteIdentifier(n,d.octaveOffset+this.input.octaveOffset+this.octaveOffset),t.key=a.toNoteNumber(t.identifier),t.rawKey=n,t.value=a.from7bitToFloat(r),t.rawValue=r,t.note=new s(a.offsetNumber(n,this.octaveOffset+this.input.octaveOffset+d.octaveOffset));else if("controlchange"===t.type){t.controller={number:n,name:a.getCcNameByNumber(n)},t.subtype=t.controller.name||"controller"+n,t.value=a.from7bitToFloat(r),t.rawValue=r;const e=Object.assign({},t);e.type=`${t.type}-controller${n}`,delete e.subtype,this.emit(e.type,e),t.message.dataBytes[0]>=120&&this._parseChannelModeMessage(t),this.parameterNumberEventsEnabled&&this._isRpnOrNrpnController(t.message.dataBytes[0])&&this._parseEventForParameterNumber(t)}else"programchange"===t.type?(t.value=n+1,t.rawValue=n):"channelaftertouch"===t.type?(t.value=a.from7bitToFloat(n),t.rawValue=n):"pitchbend"===t.type?(t.value=((r<<7)+n-8192)/8192,t.rawValue=(r<<7)+n):t.type="unknownmessage";this.emit(t.type,t)}_parseChannelModeMessage(e){const t=Object.assign({},e);t.type=t.controller.name,"localcontrol"===t.type&&(t.value=127===t.message.data[2]),"omnimodeon"===t.type?(t.type="omnimode",t.value=!0):"omnimodeoff"===t.type&&(t.type="omnimode",t.value=!1),"monomodeon"===t.type?(t.type="monomode",t.value=!0):"polymodeon"===t.type&&(t.type="monomode",t.value=!1),this.emit(t.type,t)}_parseEventForParameterNumber(e){const t=e.message.dataBytes[0],n=e.message.dataBytes[1],s=r.MIDI_CONTROL_CHANGE_MESSAGES;t===s.nonregisteredparameterfine||t===s.registeredparameterfine?(this._nrpnBuffer=[],this._rpnBuffer=[],t===s.nonregisteredparameterfine?this._nrpnBuffer=[e.message]:127!==n&&(this._rpnBuffer=[e.message])):t===s.nonregisteredparametercoarse||t===s.registeredparametercoarse?t===s.nonregisteredparametercoarse?(this._rpnBuffer=[],1===this._nrpnBuffer.length?this._nrpnBuffer.push(e.message):this._nrpnBuffer=[]):(this._nrpnBuffer=[],1===this._rpnBuffer.length&&127!==n?this._rpnBuffer.push(e.message):this._rpnBuffer=[]):t!==s.dataentrycoarse&&t!==s.dataentryfine&&t!==s.databuttonincrement&&t!==s.databuttondecrement||(2===this._rpnBuffer.length?this._dispatchParameterNumberEvent("rpn",this._rpnBuffer[0].dataBytes[1],this._rpnBuffer[1].dataBytes[1],e):2===this._nrpnBuffer.length?this._dispatchParameterNumberEvent("nrpn",this._nrpnBuffer[0].dataBytes[1],this._nrpnBuffer[1].dataBytes[1],e):(this._nrpnBuffer=[],this._rpnBuffer=[]))}_isRpnOrNrpnController(e){return e===r.MIDI_CONTROL_CHANGE_MESSAGES.dataentrycoarse||e===r.MIDI_CONTROL_CHANGE_MESSAGES.dataentryfine||e===r.MIDI_CONTROL_CHANGE_MESSAGES.databuttonincrement||e===r.MIDI_CONTROL_CHANGE_MESSAGES.databuttondecrement||e===r.MIDI_CONTROL_CHANGE_MESSAGES.nonregisteredparametercoarse||e===r.MIDI_CONTROL_CHANGE_MESSAGES.nonregisteredparameterfine||e===r.MIDI_CONTROL_CHANGE_MESSAGES.registeredparametercoarse||e===r.MIDI_CONTROL_CHANGE_MESSAGES.registeredparameterfine}_dispatchParameterNumberEvent(e,t,n,s){e="nrpn"===e?"nrpn":"rpn";const i={target:s.target,timestamp:s.timestamp,parameterMsb:t,parameterLsb:n,value:a.from7bitToFloat(s.message.dataBytes[1]),rawValue:s.message.dataBytes[1]};i.parameter="rpn"===e?Object.keys(r.MIDI_REGISTERED_PARAMETERS).find(e=>r.MIDI_REGISTERED_PARAMETERS[e][0]===t&&r.MIDI_REGISTERED_PARAMETERS[e][1]===n):(t<<7)+n;const o=a.getPropertyByValue(r.MIDI_CONTROL_CHANGE_MESSAGES,s.message.dataBytes[0]);i.type=`${e}-${o}`,this.emit(i.type,i),i.type=e,i.subtype=o,this.emit(i.type,i)}getChannelModeByNumber(e){return d.validation&&(console.warn("The 'getChannelModeByNumber()' method has been moved to the 'Utilities' class."),e=Math.floor(e)),a.getChannelModeByNumber(e)}getCcNameByNumber(e){if(d.validation&&(console.warn("The 'getCcNameByNumber()' method has been moved to the 'Utilities' class."),!((e=parseInt(e))>=0&&e<=127)))throw new RangeError("Invalid control change number.");return a.getCcNameByNumber(e)}getNoteState(e){e instanceof s&&(e=e.identifier);const t=a.guessNoteNumber(e,d.octaveOffset+this.input.octaveOffset+this.octaveOffset);return this.notesState[t]}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get input(){return this._input}get number(){return this._number}get nrpnEventsEnabled(){return this.parameterNumberEventsEnabled}set nrpnEventsEnabled(e){this.validation&&(e=!!e),this.parameterNumberEventsEnabled=e}static get EVENTS(){return["noteoff","controlchange","noteon","keyaftertouch","programchange","channelaftertouch","pitchbend","allnotesoff","allsoundoff","localcontrol","monomode","omnimode","resetallcontrollers","nrpn","nrpn-dataentrycoarse","nrpn-dataentryfine","nrpn-databuttonincrement","nrpn-databuttondecrement","rpn","rpn-dataentrycoarse","rpn-dataentryfine","rpn-databuttonincrement","rpn-databuttondecrement"]}}
/**
   * The `Message` class represents a single MIDI message. It has several properties that make it
   * easy to make sense of the binary data it contains.
   *
   * @param {Uint8Array} data The raw data of the MIDI message as a
   * [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
   * of integers between `0` and `255`.
   *
   * @license Apache-2.0
   * @since 3.0.0
   */class c{constructor(e){this.rawData=e,this.data=Array.from(this.rawData),this.statusByte=this.rawData[0],this.rawDataBytes=this.rawData.slice(1),this.dataBytes=this.data.slice(1),this.isChannelMessage=!1,this.isSystemMessage=!1,this.command=void 0,this.channel=void 0,this.manufacturerId=void 0,this.type=void 0,this.statusByte<240?(this.isChannelMessage=!0,this.command=this.statusByte>>4,this.channel=1+(15&this.statusByte)):(this.isSystemMessage=!0,this.command=this.statusByte),this.isChannelMessage?this.type=a.getPropertyByValue(r.MIDI_CHANNEL_MESSAGES,this.command):this.isSystemMessage&&(this.type=a.getPropertyByValue(r.MIDI_SYSTEM_MESSAGES,this.command)),this.statusByte===r.MIDI_SYSTEM_MESSAGES.sysex&&(0===this.dataBytes[0]?(this.manufacturerId=this.dataBytes.slice(0,3),this.dataBytes=this.dataBytes.slice(3,this.rawDataBytes.length-1),this.rawDataBytes=this.rawDataBytes.slice(3,this.rawDataBytes.length-1)):(this.manufacturerId=[this.dataBytes[0]],this.dataBytes=this.dataBytes.slice(1,this.dataBytes.length-1),this.rawDataBytes=this.rawDataBytes.slice(1,this.rawDataBytes.length-1)))}}
/**
   * The `Input` class represents a single MIDI input port. This object is automatically instantiated
   * by the library according to the host's MIDI subsystem and does not need to be directly
   * instantiated. Instead, you can access all `Input` objects by referring to the
   * [`WebMidi.inputs`](WebMidi#inputs) array. You can also retrieve inputs by using methods such as
   * [`WebMidi.getInputByName()`](WebMidi#getInputByName) and
   * [`WebMidi.getInputById()`](WebMidi#getInputById).
   *
   * Note that a single MIDI device may expose several inputs and/or outputs.
   *
   * **Important**: the `Input` class does not directly fire channel-specific MIDI messages
   * (such as [`noteon`](InputChannel#event:noteon) or
   * [`controlchange`](InputChannel#event:controlchange), etc.). The [`InputChannel`](InputChannel)
   * object does that. However, you can still use the
   * [`Input.addListener()`](#addListener) method to listen to channel-specific events on multiple
   * [`InputChannel`](InputChannel) objects at once.
   *
   * @param {MIDIInput} midiInput [`MIDIInput`](https://developer.mozilla.org/en-US/docs/Web/API/MIDIInput)
   * object as provided by the MIDI subsystem (Web MIDI API).
   *
   * @fires Input#opened
   * @fires Input#disconnected
   * @fires Input#closed
   * @fires Input#midimessage
   * @fires Input#sysex
   * @fires Input#timecode
   * @fires Input#songposition
   * @fires Input#songselect
   * @fires Input#tunerequest
   * @fires Input#clock
   * @fires Input#start
   * @fires Input#continue
   * @fires Input#stop
   * @fires Input#activesensing
   * @fires Input#reset
   * @fires Input#unknownmidimessage
   *
   * @extends EventEmitter
   * @license Apache-2.0
   */class u extends t{constructor(e){super(),this._midiInput=e,this._octaveOffset=0,this.channels=[];for(let e=1;e<=16;e++)this.channels[e]=new h(this,e);this._forwarders=[],this._midiInput.onstatechange=this._onStateChange.bind(this),this._midiInput.onmidimessage=this._onMidiMessage.bind(this)}async destroy(){this.removeListener(),this.channels.forEach(e=>e.destroy()),this.channels=[],this._forwarders=[],this._midiInput&&(this._midiInput.onstatechange=null,this._midiInput.onmidimessage=null),await this.close(),this._midiInput=null}_onStateChange(e){let t={timestamp:d.time,target:this};"open"===e.port.connection?(t.type="opened",this.emit("opened",t)):"closed"===e.port.connection&&"connected"===e.port.state?(t.type="closed",this.emit("closed",t)):"closed"===e.port.connection&&"disconnected"===e.port.state?(t.type="disconnected",t.target={connection:e.port.connection,id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},this.emit("disconnected",t)):"pending"===e.port.connection&&"disconnected"===e.port.state||console.warn("This statechange event was not caught: ",e.port.connection,e.port.state)}_onMidiMessage(e){const t=new c(e.data),n={target:this,message:t,timestamp:e.timeStamp,type:"midimessage",data:t.data,rawData:t.data,statusByte:t.data[0],dataBytes:t.dataBytes};this.emit("midimessage",n),t.isSystemMessage?this._parseEvent(n):t.isChannelMessage&&this.channels[t.channel]._processMidiMessageEvent(n),this._forwarders.forEach(e=>e.forward(t))}_parseEvent(e){const t=Object.assign({},e);t.type=t.message.type||"unknownmidimessage","songselect"===t.type&&(t.song=e.data[1]+1),this.emit(t.type,t)}async open(){try{await this._midiInput.open()}catch(e){return Promise.reject(e)}return Promise.resolve(this)}async close(){if(!this._midiInput)return Promise.resolve(this);try{await this._midiInput.close()}catch(e){return Promise.reject(e)}return Promise.resolve(this)}getChannelModeByNumber(){d.validation&&console.warn("The 'getChannelModeByNumber()' method has been moved to the 'Utilities' class.")}addListener(e,t,n={}){if(d.validation&&"function"==typeof n){let e=null!=t?[].concat(t):void 0;t=n,n={channels:e}}if(h.EVENTS.includes(e)){void 0===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS);let s=[];return a.sanitizeChannels(n.channels).forEach(r=>{s.push(this.channels[r].addListener(e,t,n))}),s}return super.addListener(e,t,n)}addOneTimeListener(e,t,n={}){return n.remaining=1,this.addListener(e,t,n)}on(e,t,n,r){return this.addListener(e,t,n,r)}hasListener(e,t,n={}){if(d.validation&&"function"==typeof n){let e=[].concat(t);t=n,n={channels:e}}return h.EVENTS.includes(e)?(void 0===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),a.sanitizeChannels(n.channels).every(n=>this.channels[n].hasListener(e,t))):super.hasListener(e,t)}removeListener(e,t,n={}){if(d.validation&&"function"==typeof n){let e=[].concat(t);t=n,n={channels:e}}if(void 0===n.channels&&(n.channels=r.MIDI_CHANNEL_NUMBERS),null==e)return a.sanitizeChannels(n.channels).forEach(e=>{this.channels[e]&&this.channels[e].removeListener()}),super.removeListener();h.EVENTS.includes(e)?a.sanitizeChannels(n.channels).forEach(r=>{this.channels[r].removeListener(e,t,n)}):super.removeListener(e,t,n)}addForwarder(e,t={}){let n;return n=e instanceof l?e:new l(e,t),this._forwarders.push(n),n}removeForwarder(e){this._forwarders=this._forwarders.filter(t=>t!==e)}hasForwarder(e){return this._forwarders.includes(e)}get name(){return this._midiInput.name}get id(){return this._midiInput.id}get connection(){return this._midiInput.connection}get manufacturer(){return this._midiInput.manufacturer}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get state(){return this._midiInput.state}get type(){return this._midiInput.type}get nrpnEventsEnabled(){return d.validation&&console.warn("The 'nrpnEventsEnabled' property has been moved to the 'InputChannel' class."),!1}}
/**
   * The `WebMidi` object makes it easier to work with the low-level Web MIDI API. Basically, it
   * simplifies sending outgoing MIDI messages and reacting to incoming MIDI messages.
   *
   * When using the WebMidi.js library, you should know that the `WebMidi` class has already been
   * instantiated. You cannot instantiate it yourself. If you use the **IIFE** version, you should
   * simply use the global object called `WebMidi`. If you use the **CJS** (CommonJS) or **ESM** (ES6
   * module) version, you get an already-instantiated object when you import the module.
   *
   * @fires WebMidi#connected
   * @fires WebMidi#disabled
   * @fires WebMidi#disconnected
   * @fires WebMidi#enabled
   * @fires WebMidi#midiaccessgranted
   *
   * @extends EventEmitter
   * @license Apache-2.0
   */const d=new class extends t{constructor(){super(),this.defaults={note:{attack:a.from7bitToFloat(64),release:a.from7bitToFloat(64),duration:1/0}},this.interface=null,this.validation=!0,this._inputs=[],this._disconnectedInputs=[],this._outputs=[],this._disconnectedOutputs=[],this._stateChangeQueue=[],this._octaveOffset=0}async enable(e={},t=!1){if(this.validation=!1!==e.validation,this.validation&&("function"==typeof e&&(e={callback:e,sysex:t}),t&&(e.sysex=!0)),this.enabled)return"function"==typeof e.callback&&e.callback(),Promise.resolve();const n={timestamp:this.time,target:this,type:"error",error:void 0},r={timestamp:this.time,target:this,type:"midiaccessgranted"},s={timestamp:this.time,target:this,type:"enabled"};try{this.interface=await navigator.requestMIDIAccess({sysex:e.sysex,software:e.software})}catch(t){return n.error=t,this.emit("error",n),"function"==typeof e.callback&&e.callback(t),Promise.reject(t)}this.emit("midiaccessgranted",r),this.interface.onstatechange=this._onInterfaceStateChange.bind(this);try{await this._updateInputsAndOutputs()}catch(t){return n.error=t,this.emit("error",n),"function"==typeof e.callback&&e.callback(t),Promise.reject(t)}return this.emit("enabled",s),"function"==typeof e.callback&&e.callback(),Promise.resolve(this)}async disable(){return this._destroyInputsAndOutputs().then(()=>{"function"==typeof navigator.close&&navigator.close(),this.interface&&(this.interface.onstatechange=void 0),this.interface=null;let e={timestamp:this.time,target:this,type:"disabled"};this.emit("disabled",e),this.removeListener()})}getInputById(e){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1}for(let t=0;t<this.inputs.length;t++)if(this.inputs[t].id===e.toString())return this.inputs[t];return!1}getInputByName(e){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1;e=e.toString()}for(let t=0;t<this.inputs.length;t++)if(~this.inputs[t].name.indexOf(e))return this.inputs[t];return!1}getOutputByName(e){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1;e=e.toString()}for(let t=0;t<this.outputs.length;t++)if(~this.outputs[t].name.indexOf(e))return this.outputs[t];return!1}getOutputById(e){if(this.validation){if(!this.enabled)throw new Error("WebMidi is not enabled.");if(!e)return!1}for(let t=0;t<this.outputs.length;t++)if(this.outputs[t].id===e.toString())return this.outputs[t];return!1}noteNameToNumber(e){return this.validation&&console.warn("The noteNameToNumber() method is deprecated. Use Utilities.toNoteNumber() instead."),a.toNoteNumber(e,this.octaveOffset)}getOctave(e){return this.validation&&(console.warn("The getOctave()is deprecated. Use Utilities.getNoteDetails() instead"),e=parseInt(e)),!isNaN(e)&&e>=0&&e<=127&&a.getNoteDetails(a.offsetNumber(e,this.octaveOffset)).octave}sanitizeChannels(e){return this.validation&&console.warn("The sanitizeChannels() method has been moved to the utilities class."),a.sanitizeChannels(e)}toMIDIChannels(e){return this.validation&&console.warn("The toMIDIChannels() method has been deprecated. Use Utilities.sanitizeChannels() instead."),a.sanitizeChannels(e)}guessNoteNumber(e){return this.validation&&console.warn("The guessNoteNumber() method has been deprecated. Use Utilities.guessNoteNumber() instead."),a.guessNoteNumber(e,this.octaveOffset)}getValidNoteArray(e,t={}){return this.validation&&console.warn("The getValidNoteArray() method has been moved to the Utilities.buildNoteArray()"),a.buildNoteArray(e,t)}convertToTimestamp(e){return this.validation&&console.warn("The convertToTimestamp() method has been moved to Utilities.toTimestamp()."),a.toTimestamp(e)}async _destroyInputsAndOutputs(){let e=[];return this.inputs.forEach(t=>e.push(t.destroy())),this.outputs.forEach(t=>e.push(t.destroy())),Promise.all(e).then(()=>{this._inputs=[],this._outputs=[]})}_onInterfaceStateChange(e){this._updateInputsAndOutputs();let t={timestamp:e.timeStamp,type:e.port.state};"connected"===e.port.state&&"open"===e.port.connection?("output"===e.port.type?(t.port=this.getOutputById(e.port.id),t.target=t.port):"input"===e.port.type&&(t.port=this.getInputById(e.port.id),t.target=t.port),this.emit(e.port.state,t)):"disconnected"===e.port.state&&"pending"===e.port.connection&&(t.port={connection:"closed",id:e.port.id,manufacturer:e.port.manufacturer,name:e.port.name,state:e.port.state,type:e.port.type},t.target=t.port,this.emit(e.port.state,t))}async _updateInputsAndOutputs(){return Promise.all([this._updateInputs(),this._updateOutputs()])}async _updateInputs(){if(!this.interface)return;for(let e=this._inputs.length-1;e>=0;e--){const t=this._inputs[e];Array.from(this.interface.inputs.values()).find(e=>e===t._midiInput)||(this._disconnectedInputs.push(t),this._inputs.splice(e,1))}let e=[];return this.interface.inputs.forEach(t=>{if(!this._inputs.find(e=>e._midiInput===t)){let n=this._disconnectedInputs.find(e=>e._midiInput===t);n||(n=new u(t)),this._inputs.push(n),e.push(n.open())}}),Promise.all(e)}async _updateOutputs(){if(!this.interface)return;for(let e=this._outputs.length-1;e>=0;e--){const t=this._outputs[e];Array.from(this.interface.outputs.values()).find(e=>e===t._midiOutput)||(this._disconnectedOutputs.push(t),this._outputs.splice(e,1))}let e=[];return this.interface.outputs.forEach(t=>{if(!this._outputs.find(e=>e._midiOutput===t)){let n=this._disconnectedOutputs.find(e=>e._midiOutput===t);n||(n=new o(t)),this._outputs.push(n),e.push(n.open())}}),Promise.all(e)}get enabled(){return null!==this.interface}get inputs(){return this._inputs}get isNode(){return"[object process]"===Object.prototype.toString.call("undefined"!=typeof process?process:0)}get isBrowser(){return"undefined"!=typeof window&&void 0!==window.document}get octaveOffset(){return this._octaveOffset}set octaveOffset(e){if(this.validation&&(e=parseInt(e),isNaN(e)))throw new TypeError("The 'octaveOffset' property must be an integer.");this._octaveOffset=e}get outputs(){return this._outputs}get supported(){return"undefined"!=typeof navigator&&navigator.requestMIDIAccess}get sysexEnabled(){return!(!this.interface||!this.interface.sysexEnabled)}get time(){return performance.now()}get version(){return"3.0.1"}get CHANNEL_EVENTS(){return this.validation&&console.warn("The CHANNEL_EVENTS enum has been moved to InputChannel.EVENTS."),h.EVENTS}get MIDI_SYSTEM_MESSAGES(){return this.validation&&console.warn("The MIDI_SYSTEM_MESSAGES enum has been moved to Enumerations.MIDI_SYSTEM_MESSAGES."),r.MIDI_SYSTEM_MESSAGES}get MIDI_CHANNEL_MODE_MESSAGES(){return this.validation&&console.warn("The MIDI_CHANNEL_MODE_MESSAGES enum has been moved to Enumerations.MIDI_CHANNEL_MODE_MESSAGES."),r.MIDI_CHANNEL_MODE_MESSAGES}get MIDI_CONTROL_CHANGE_MESSAGES(){return this.validation&&console.warn("The MIDI_CONTROL_CHANGE_MESSAGES enum has been moved to Enumerations.MIDI_CONTROL_CHANGE_MESSAGES."),r.MIDI_CONTROL_CHANGE_MESSAGES}get MIDI_REGISTERED_PARAMETER(){return this.validation&&console.warn("The MIDI_REGISTERED_PARAMETER enum has been moved to Enumerations.MIDI_REGISTERED_PARAMETERS."),this.MIDI_REGISTERED_PARAMETERS}get NOTES(){return this.validation&&console.warn("The NOTES enum has been deprecated."),["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]}};d.constructor=null,e.Enumerations=r,e.Forwarder=l,e.Message=c,e.Note=s,e.Utilities=a,e.WebMidi=d}(this.window=this.window||{});
//# sourceMappingURL=webmidi.iife.min.js.map
