/*
*  Copyright (c) 2020 Steve Seguin. All Rights Reserved.
*
*  Use of this source code is governed by the APGLv3 open-source license
*  that can be found in the LICENSE file in the root of the source
*  tree. Alternative licencing options can be made available on request.
*
*/
/*jshint esversion: 6 */
async function main(){ // main asyncronous thread; mostly initializes the user settings.

	var delayedStartupFuncs = [];

	if (!isIFrame){
		if (getStorage("redirect") == "yes") {
			setStorage("redirect", "", 0);
			session.sticky = true;
		} else if (getStorage("settings") != "") {
			if (!(session.cleanOutput)){
				window.focus();
				session.sticky = confirm("Would you like you load your previous session's settings?");
				if (!session.sticky) {
					setStorage("settings", "", 0);
					log("deleting cookie as user said no");
				} else {
					var cookieSettings = decodeURI(getStorage("settings"));
					setStorage("redirect", "yes", 1);
					window.location.replace(cookieSettings);
				}
			}
		}

		if (urlParams.has('sticky')){ // won't work with iframes.
		
			//if (getStorage("permission") == "") {
			//	session.sticky = confirm("Would you allow us to store a cookie to keep your session settings persistent?");
			//} else {
			session.sticky = true;
			//}
			//if (session.sticky) {
			setStorage("permission", "yes", 999);
			setStorage("settings", encodeURI(window.location.href), 90);
			//}
		}
	}

	if (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1) {
		try {
			getById("electronDragZone").style.cursor="grab";
			const ipcRenderer = require('electron').ipcRenderer;
			window.prompt = function(title, val){
			  return ipcRenderer.sendSync('prompt', {title, val});
			};
		} catch(e){}
	}

	if (urlParams.has('cleanoutput') || urlParams.has('clean') || urlParams.has('cleanish')) {
		session.cleanOutput = true;
	}

	if (urlParams.has('retrytimeout')) {
		session.retryTimeout = parseInt(urlParams.get('retrytimeout'));
	}

	if (urlParams.has('ptz')){
		session.ptz=true;
	}

	if (urlParams.has('optimize')) {
		session.optimize = parseInt(urlParams.get('optimize')) || 0;
	}

	if (urlParams.has('nosettings') || urlParams.has('ns')) {
		screensharebutton = false;
		session.showSettings = false;
	}

	if (urlParams.has('nomicbutton') || urlParams.has('nmb')) {
		getById("mutebutton").setAttribute('style', "display: none !important");
	}


	if (urlParams.has('novideobutton') || urlParams.has('nvb')) {
		getById("mutevideobutton").setAttribute('style', "display: none !important");
	}

	if (urlParams.has('screenshareid') || urlParams.has('ssid')) {
		if (urlParams.get('screenshareid') || urlParams.get('ssid')) {
			session.screenshareid = urlParams.get('screenshareid') || urlParams.get('ssid');
			session.screenshareid = sanitizeStreamID(session.screenshareid);
		}
	}

	if (urlParams.has('screensharefps') || urlParams.has('ssfps')) {
		if (urlParams.get('screensharefps') || urlParams.get('ssfps')) {
			session.screensharefps = urlParams.get('screensharefps') || urlParams.get('ssfps');
			session.screensharefps = parseInt(session.screensharefps) || 2;
		}
	}

	if (urlParams.has('screensharequality') || urlParams.has('ssq')) {
		if (urlParams.get('screensharequality') || urlParams.get('ssq')) {
			session.screensharequality = urlParams.get('screensharequality') || urlParams.get('ssq');
			session.screensharequality = parseInt(session.screensharequality) || 1;
		}
	}

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		//session.webcamonly = true;
		session.mobile = true;
		getById("shareScreenGear").style.display = "none";
		screensharebutton = false;
		screensharesupport = false;
		getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
		getById("dropButton").style.display = "none";
		//session.disableWebAudio = true; // default true; might be useful to disable on slow or old computers?
		session.audioEffects = false; // disable audio inbound effects also.
		session.audioMeterGuest = false;
		
	} else if ((iOS) || (iPad)) {
		getById("shareScreenGear").style.display = "none";
		session.mobile = true;
		screensharebutton = false;
		screensharesupport = false;
		getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
		getById("dropButton").style.display = "none";
		//session.audiobitrate = false; // iOS devices seem to get distortion with custom audio bitrates.  Disable for now.
		//session.maxiosbitrate = 10; // this is 10-kbps by default already.
		//session.disableWebAudio = true; // default true; might be useful to disable on slow or old computers?
		session.audioEffects = false; // disable audio inbound effects also.
		session.audioMeterGuest = false;
	} else {
		log("MAKE DRAGGABLE");
		delayedStartupFuncs.push([makeDraggableElement, document.getElementById("subControlButtons")]);
		
		if (safariVersion() && !getChromeVersion()){
			getById("SafariWarning").style.display = "block";
		}
	}


	if ((iOS) || (iPad)) {
		window.addEventListener('resize', function() {  // Safari is the new IE.
			var msg = {};
			msg.requestSceneUpdate = true;
			session.sendMessage(msg);
			
			if ( window.matchMedia("(orientation: portrait)").matches ) {
				document.getElementsByTagName("html")[0].style.height = "100vh";
				setTimeout(function(){
					document.getElementsByTagName("html")[0].style.height = "100%";
				}, 1000);
			} else if ( window.matchMedia("(orientation: landscape)").matches ) {
				document.getElementsByTagName("html")[0].style.height = "100vh";
				setTimeout(function(){
					document.getElementsByTagName("html")[0].style.height = "100%";
				}, 1000);
			}
		});
	}

	if (/CriOS/i.test(navigator.userAgent) && (iOS || iPad)) {
		if (!(session.cleanOutput)) {
			try {
				navigator.mediaDevices.getUserMedia;
			} catch (e) {
				warnUser("Chrome on this device does not support the required technology to use this site.\n\nPlease use Safari instead or update your iOS and browser version.");
			}
		}
	}

	
	if (urlParams.has('broadcast') || urlParams.has('bc')) {
		log("Broadcast flag set");
		session.broadcast = urlParams.get('broadcast') || urlParams.get('bc') || null;
		//if ((iOS) || (iPad)) {
		//	session.nopreview = false;
		//} else {
		//	session.nopreview = true;
		//}
		session.minipreview = 2; // full screen if nothing else on screen.
		session.style = 1;
		getById("header").style.display = "none";
		getById("header").style.opacity = 0;
		session.showList=false;
	}

	if (urlParams.has('showlist')) {
		session.showList = urlParams.get('showlist');
		if (session.showList === "false") {
			session.showList = false;
		} else if (session.showList=== "0") {
			session.showList = false;
		} else if (session.showList === "no") {
			session.showList = false;
		} else if (session.showList === "off") {
			session.showList = false;
		} else {
			session.showList = true;
		}
	}
	
	var filename = false;
	try {
		filename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
		filename = filename.replace("??", "?");
		filename2 = filename.split("?")[0];
		// split at ???
		if (filename.split(".").length == 1) {
			if (filename2.length < 2) { // easy win
				filename = false;
			} else if (filename.startsWith("&")) { // easy win
				var tmpHref = window.location.href.substring(0, window.location.href.lastIndexOf('/')) + "/?" + filename.split("&").slice(1).join("&");
				log("TMP " + tmpHref);
				updateURL(filename.split("&")[1], true, tmpHref);
				filename = false;
			} else if (filename2.split("&")[0].includes("=")) {
				log("asdf  " + filename.split("&")[0]);
				if (history.pushState) {
					var tmpHref = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
					tmpHref = tmpHref + "/?" + filename;
					filename = false;
					//warnUser("Please ensure your URL is correctly formatted.");
					window.history.pushState({path: tmpHref.toString()}, '', tmpHref.toString());
				}
			} else {
				filename = filename2.split("&")[0];
				if (filename2 != filename) {
					warnUser("Warning: Please ensure your URL is correctly formatted.");
				}
			}
		} else {
			filename = false;
		}
		log(filename);
	} catch (e) {
		errorlog(e);
	}


	var directorLanding = false;
	if (urlParams.has('director') || urlParams.has('dir')) {
		directorLanding = urlParams.get('director') || urlParams.get('dir') || null;
		if (directorLanding === null) {
			directorLanding = true;
		} else if (directorLanding.length === 0) {
			directorLanding = true;
		} else {
			directorLanding = false;
		}
		session.meterStyle = 1;
	} else if (filename === "director") {
		directorLanding = true;
		filename = false;
		session.meterStyle = 1;
	}

	if (urlParams.has('rooms')) {
		session.rooms = urlParams.get('rooms').split(",").map(function(e) { 
			return sanitizeRoomName(e);
		});
		getById("rooms").classList.remove('advanced');
	}

	if (urlParams.has('showdirector')) {
		session.showDirector = true;
	}

	if (urlParams.has('midi') || urlParams.has('hotkeys')) {
		session.midiHotkeys = urlParams.get('midi') || urlParams.get ('hotkeys') || 1;
		session.midiHotkeys = parseInt(session.midiHotkeys);
	}

	if (urlParams.has('midipush') || urlParams.has('midiout') || urlParams.has('mo')){
		session.midiOut =  urlParams.get('midipush') ||  urlParams.get('midiout') || urlParams.get('mo') || true;
	}

	if (urlParams.has('midipull') || urlParams.has('midiin') || urlParams.has('mi')){
		session.midiIn =  urlParams.get('midipull') ||  urlParams.get('midiin') || urlParams.get('mi') || true;
	}


	if (urlParams.has('webcam') || urlParams.has('wc')) {
		session.webcamonly = true;
		screensharebutton = false;
	} else if (urlParams.has('screenshare') || urlParams.has('ss')) {
		session.screenshare = true;
		if (urlParams.get('screenshare') || urlParams.get('ss')){
			session.screenshare = parseInt(urlParams.get('screenshare'));
		}
	} else if (urlParams.has('fileshare') || urlParams.has('fs')) {
		getById("container-5").classList.remove('advanced');
		getById("container-5").classList.add("skip-animation");
		getById("container-5").classList.remove('pointer');
	} else if (directorLanding) {
		getById("container-1").classList.remove('advanced');
		getById("container-1").classList.add("skip-animation");
		getById("container-1").classList.remove('pointer');
	} else if (urlParams.has('website') || urlParams.has('iframe')) {
		getById("container-6").classList.remove('advanced');
		getById("container-6").classList.add("skip-animation");
		getById("container-6").classList.remove('pointer');
		session.website = urlParams.get('website') || urlParams.get('iframe') || false;
		
		if (session.website){
			if (session.director){
				delayedStartupFuncs.push([shareWebsite, session.website]);
			} else {
				delayedStartupFuncs.push([session.publishIFrame, session.website]);
			}
		}
	}

	if (urlParams.has('ssb')) {
		screensharebutton = true;
	}

	if (urlParams.has('mute') || urlParams.has('muted') || urlParams.has('m')) {
		session.muted = true;
	}

	if (urlParams.has('videomute') || urlParams.has('videomuted') || urlParams.has('vm')) {
		session.videoMutedFlag = true;
	}


	if (urlParams.has('deaf') || urlParams.has('deafen')) {
		session.directorSpeakerMuted=true; // false == true in this case.
	}

	if (urlParams.has('blind')) {
		session.directorDisplayMuted=true; // false == true in this case.
	}


	if (urlParams.has('dpi') || urlParams.has('dpr')) {
		session.devicePixelRatio = urlParams.get('dpi') || urlParams.get('dpr') || 2.0;
	} //else if (window.devicePixelRatio && window.devicePixelRatio!==1){ 
	//	session.devicePixelRatio = window.devicePixelRatio; // this annoys me to no end.
	//}

	if (urlParams.has('speakermute') || urlParams.has('mutespeaker') || urlParams.has('sm') || urlParams.has('ms')) {
		session.speakerMuted = true;
		getById("mutespeakertoggle").className = "las la-volume-mute my-float toggleSize";
		//getById("mutespeakerbutton").className="advanced float2 red";
		getById("mutespeakerbutton").classList.add("red");
		getById("mutespeakerbutton").classList.add("float2");
		getById("mutespeakerbutton").classList.remove("float");

		var sounds = document.getElementsByTagName("video");
		for (var i = 0; i < sounds.length; ++i) {
			sounds[i].muted = session.speakerMuted;
		}
	}

	if (urlParams.has('chatbutton') || urlParams.has('chat') || urlParams.has('cb')) {
		session.chatbutton = urlParams.get('chatbutton') || urlParams.get('chat') || urlParams.get('cb') || null;
		if (session.chatbutton === "false") {
			session.chatbutton = false;
		} else if (session.chatbutton === "0") {
			session.chatbutton = false;
		} else if (session.chatbutton === "no") {
			session.chatbutton = false;
		} else if (session.chatbutton === "off") {
			session.chatbutton = false;
		} else {
			session.chatbutton = true;
			getById("chatbutton").classList.remove("advanced");
		}
	}

	if (session.screenshare !== false) {
		getById("container-3").className = 'column columnfade advanced'; // Hide screen share on mobile
		getById("container-2").classList.add("skip-animation");
		getById("container-2").classList.remove('pointer');
	}

	if (urlParams.has('manual')) {
		session.manual = true;
	}

	if (urlParams.has('hands') || urlParams.has('hand')) {
		session.raisehands = true;
	}

	if (urlParams.has('portrait') || urlParams.has('916') || urlParams.has('vertical')) {
		session.aspectratio = 1; // 9:16  (default of 0 is 16:9)
	} else if (urlParams.has('square') || urlParams.has('11')) {
		session.aspectratio = 2; //1:1 ?
	}

	if (urlParams.has('cover')) {
		session.cover = true;
		document.documentElement.style.setProperty('--fit-style', 'cover');
	} 

	if (urlParams.has('record')) {
		if (safariVersion()) {
			if (!(session.cleanOutput)) {
				warnUser("Your browser or device is not supported. Try Chrome if on macOS.");
			}
		} else {
			session.recordLocal = urlParams.get('record');

			if (session.recordLocal != parseInt(session.recordLocal)) {
				session.recordLocal = 6000;
			} else {
				session.recordLocal = parseInt(session.recordLocal);
			}
		}
	}
	if (urlParams.has('pcm')) {
		session.pcm = true;
	}

	if (urlParams.has('bigbutton')) {
		session.bigmutebutton = true;
		getById("mutebutton").style.width = "min(40vh,40vw)";
		getById("mutebutton").style.height = "min(40vh,40vw)";
		getById("mutetoggle").style.width = "min(40vh,40vw)";
		getById("mutetoggle").style.height = "min(40vh,40vw)";

	}

	if (urlParams.has('scene')) {
		session.scene = urlParams.get('scene') || 0;
		if (typeof session.scene === "string"){
			session.scene = session.scene.replace(/[\W]+/g, "_");
		} else {
			session.scene = (parseInt(session.scene) || 0) + "";
			
		}
		session.disableWebAudio = true;
		session.audioEffects = false;
		session.audioMeterGuest = false;
	}
	if (session.scene!=="1"){ // scene =0 and 1 should load instantly.
		session.hiddenSceneViewBitrate = 0; // By default this is ~ 400kbps, but if you have 10 scenes, i don't want to kill things.
	}

	if (urlParams.has('scenetype') || urlParams.has('type')) {
		session.sceneType = parseInt(urlParams.get('scenetype')) || parseInt(urlParams.get('type')) || false;
	}

	if (urlParams.has('mediasettings')) {
		session.forceMediaSettings = true;
	}


	if (urlParams.has('transcript') || urlParams.has('transcribe') || urlParams.has('trans')) {
		session.transcript = urlParams.get('transcript') || urlParams.get('transcribe') || urlParams.get('trans') || "en-US";
	}


	if (urlParams.has('cc') || urlParams.has('closedcaptions') || urlParams.has('captions')) {
		session.closedCaptions = true;
	}

	if (session.webcamonly == true) {
		getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
		getById("container-3").classList.add("skip-animation");
		getById("container-3").classList.remove('pointer');
		delayedStartupFuncs.push([previewWebcam]);
	}

	if (urlParams.has('css')){
		var cssURL = urlParams.get('css');
		cssURL = decodeURI(cssURL);
		log(cssURL);
		var cssStylesheet = document.createElement('link');
		cssStylesheet.rel = 'stylesheet';
		cssStylesheet.type = 'text/css';
		cssStylesheet.media = 'screen';
		cssStylesheet.href = cssURL;
		document.getElementsByTagName('head')[0].appendChild(cssStylesheet);
		
		cssStylesheet.onload = function() {
			getById("main").classList.remove('hidden');
			log("loaded remote style sheet");
		};

		cssStylesheet.onerror = function() {
			getById("main").classList.remove('hidden');
			errorlog("REMOTE STYLE SHEET HAD ERROR");
		};
		
	} else {
		getById("main").classList.remove('hidden');
	}

	if (urlParams.has('password') || urlParams.has('pass') || urlParams.has('pw') || urlParams.has('p')) {
		session.password = urlParams.get('password') || urlParams.get('pass') || urlParams.get('pw') || urlParams.get('p');
		if (!session.password) {
			window.focus();
			session.password = await promptAlt("Please enter the password below: \n\n(Note: Passwords are case-sensitive and you will not be alerted if it is incorrect.)");
		} else if (session.password === "false") {
			session.password = false;
			session.defaultPassword = false;
		} else if (session.password === "0") {
			session.password = false;
			session.defaultPassword = false;
		} else if (session.password === "off") {
			session.password = false;
			session.defaultPassword = false;
		}
	}

	if (session.password) {
		session.password = sanitizePassword(session.password);
		getById("passwordRoom").value = session.password;
		session.defaultPassword = false;
		getById("addPasswordBasic").style.display = "none";
	}


	if (urlParams.has('hash') || urlParams.has('crc') || urlParams.has('check')) { // could be brute forced in theory, so not as safe as just not using a hash check.
		session.taintedSession = null; // waiting to see if valid or not.
		var hash_input = urlParams.get('hash') || urlParams.get('crc') || urlParams.get('check');
		if (session.password === false) {
			window.focus();
			session.password = await promptAlt("Please enter the password below: \n\n(Note: Passwords are case-sensitive.)");
			session.password = sanitizePassword(session.password);
			getById("passwordRoom").value = session.password;
			session.defaultPassword = false;
		}

		session.generateHash(session.password + session.salt, 6).then(function(hash) { // million to one error. 
			log("hash is " + hash);
			if (hash.substring(0, 4) !== hash_input) { // hash crc checks are just first 4 characters.
				session.taintedSession = true;
				if (!(session.cleanOutput)) {
					getById("request_info_prompt").innerHTML = "The password was incorrect.\n\nRefresh and try again.";
					getById("request_info_prompt").style.display = "block";
					getById("mainmenu").style.display = "none";
					getById("head1").style.display = "none";
					session.cleanOutput = true;

				} else {
					getById("request_info_prompt").innerHTML = "";
					getById("request_info_prompt").style.display = "block";
					getById("mainmenu").style.display = "none";
					getById("head1").style.display = "none";
				}
			} else {
				session.taintedSession = false;
				session.hash = hash;
			}
		});
	}

	if (session.defaultPassword !== false) {
		session.password = session.defaultPassword; // no user entered password; let's use the default password if its not disabled.
	}

	if (urlParams.has('showlabels') || urlParams.has('showlabel') || urlParams.has('sl')) {
		session.showlabels = urlParams.get('showlabels') || urlParams.get('showlabel') || urlParams.get('sl') || "";
		session.showlabels = sanitizeLabel(session.showlabels.replace(/[\W]+/g, "_").replace(/_+/g, '_'));
		if (session.showlabels == "") {
			session.showlabels = true;
			session.labelstyle = false;
		} else {
			session.labelstyle = session.showlabels;
			session.showlabels = true;
		}
	}

	if (urlParams.has('sizelabel') || urlParams.has('labelsize') || urlParams.has('fontsize')) {
		session.labelsize = urlParams.get('sizelabel') || urlParams.get('labelsize') || urlParams.get('fontsize') || 100;
		session.labelsize = parseInt(session.labelsize);
	}
		
	if (urlParams.has('label') || urlParams.has('l')) {
		session.label = urlParams.get('label') || urlParams.get('l') || null;
		var updateURLAsNeed = true;
		if (session.label == null || session.label.length == 0) {
			window.focus();
			session.label = await promptAlt("Please enter your display name:");
		} else {
			var updateURLAsNeed = false;
			session.label = decodeURIComponent(session.label);
			session.label = session.label.replace(/_/g, " ")
		}
		if (session.label != null) {
			session.label = sanitizeLabel(session.label); // alphanumeric was too strict. 
			document.title = session.label; // what the result is.

			if (updateURLAsNeed) {
				var label = encodeURIComponent(session.label);
				if (urlParams.has('l')) {
					updateURL("l=" + label, true, false);
				} else {
					updateURL("label=" + label, true, false);
				}
			}
		}
	}

	if (urlParams.has('transparent')) { // sets the window to be transparent - useful for IFRAMES?
		getById("main").style.backgroundColor = "rgba(0,0,0,0)";
		document.documentElement.style.setProperty('--container-color', '#0000');
		document.documentElement.style.setProperty('--background-color', '#0000');
		document.documentElement.style.setProperty('--regular-margin', '0');
		document.documentElement.style.setProperty('--director-margin', '0 25px 0 0');
		getById("directorLinksButton").style.color = "black";
		session.transparent=true;
	}

	if (urlParams.has('stereo') || urlParams.has('s') || urlParams.has('proaudio')) { // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
		log("STEREO ENABLED");
		session.stereo = urlParams.get('stereo') || urlParams.get('s') || urlParams.get('proaudio');

		if (session.stereo) {
			session.stereo = session.stereo.toLowerCase();
		}

		//var supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
		//supportedConstraints.channelCount;

		if (session.stereo === "false") {
			session.stereo = 0;
			session.audioInputChannels = 1;
		} else if (session.stereo === "0") {
			session.stereo = 0;
			session.audioInputChannels = 1;
		} else if (session.stereo === "no") {
			session.stereo = 0;
			session.audioInputChannels = 1;
		} else if (session.stereo === "off") {
			session.stereo = 0;
			session.audioInputChannels = 1;

		} else if (session.stereo === "1") {
			session.stereo = 1;
		} else if (session.stereo === "both") {
			session.stereo = 1;
		} else if (session.stereo === "3") {
			session.stereo = 3;
		} else if (session.stereo === "out") {
			session.stereo = 3;
		} else if (session.stereo === "mono") {
			session.stereo = 3;
			session.audiobitrate = 128;
		} else if (session.stereo === "4") {
			session.stereo = 4;
		} else if (session.stereo === "multi") {
			session.stereo = 4;
		} else if (session.stereo === "2") {
			session.stereo = 2;
		} else if (session.stereo === "in") {
			session.stereo = 2;
		} else {
			session.stereo = 5; // guests; no stereo in, no high bitrate in, but otherwise like stereo=1
		}
	}


	if (urlParams.has('pie')){
		session.pie = urlParams.get('pie') || false; // If session.pie == true, then there is no need to set parameters via URL
		if (session.pie){
			session.wss = "wss://us-nyc-1.websocket.me/v3/1?api_key="+session.pie; // if URL param is set, it will use the API key.
		}
	}

	if ((session.stereo == 1) || (session.stereo == 3) || (session.stereo == 4) || (session.stereo == 5)) {
		session.echoCancellation = false;
		session.autoGainControl = false;
		session.noiseSuppression = false;
	}

	if (urlParams.has('mono')) {
		session.mono = true;
		if ((session.stereo == 1) || (session.stereo == 4)) {
			session.stereo = 3;
			session.audiobitrate = 128;
		} else if (session.stereo == 5) {
			session.stereo = 3;
			session.audiobitrate = 128;
		} else if (session.stereo == 2) {
			session.stereo = 0;
			session.audiobitrate = 128;
		}
	}

	if (urlParams.has("channelcount") || urlParams.has("ac")) {
		session.audioInputChannels = urlParams.get('channelcount') || urlParams.get('ac');
		session.audioInputChannels = parseInt(session.audioInputChannels);
		if (!session.audioInputChannels) {
			session.audioInputChannels = false;
		}
	}


	if (urlParams.has("aec") || urlParams.has("ec")) {

		session.echoCancellation = urlParams.get('aec') || urlParams.get('ec');

		if (session.echoCancellation) {
			session.echoCancellation = session.echoCancellation.toLowerCase();
		}
		if (session.echoCancellation == "false") {
			session.echoCancellation = false;
		} else if (session.echoCancellation == "0") {
			session.echoCancellation = false;
		} else if (session.echoCancellation == "no") {
			session.echoCancellation = false;
		} else if (session.echoCancellation == "off") {
			session.echoCancellation = false;
		} else {
			session.echoCancellation = true;
		}
	}


	if (urlParams.has("autogain") || urlParams.has("ag")) {

		session.autoGainControl = urlParams.get('autogain') || urlParams.get('ag');
		if (session.autoGainControl) {
			session.autoGainControl = session.autoGainControl.toLowerCase();
		}
		if (session.autoGainControl == "false") {
			session.autoGainControl = false;
		} else if (session.autoGainControl == "0") {
			session.autoGainControl = false;
		} else if (session.autoGainControl == "no") {
			session.autoGainControl = false;
		} else if (session.autoGainControl == "off") {
			session.autoGainControl = false;
		} else {
			session.autoGainControl = true;
		}
	}

	if (urlParams.has("denoise") || urlParams.has("dn")) {

		session.noiseSuppression = urlParams.get('denoise') || urlParams.get('dn');

		if (session.noiseSuppression) {
			session.noiseSuppression = session.noiseSuppression.toLowerCase();
		}
		if (session.noiseSuppression == "false") {
			session.noiseSuppression = false;
		} else if (session.noiseSuppression == "0") {
			session.noiseSuppression = false;
		} else if (session.noiseSuppression == "no") {
			session.noiseSuppression = false;
		} else if (session.noiseSuppression == "off") {
			session.noiseSuppression = false;
		} else {
			session.noiseSuppression = true;
		}
	}


	if (urlParams.has('roombitrate') || urlParams.has('roomvideobitrate') || urlParams.has('rbr')) {
		log("Room BITRATE SET");
		session.roombitrate = urlParams.get('roombitrate') || urlParams.get('rbr') || urlParams.get('roomvideobitrate');
		session.roombitrate = parseInt(session.roombitrate);
		if (session.roombitrate < 1) {
			session.roombitrate = 0;
		}
	}

	if ( urlParams.has('outboundaudiobitrate') || urlParams.has('oab')) {
		session.outboundAudioBitrate = parseInt(urlParams.get('outboundaudiobitrate')) || parseInt(urlParams.get('oab')) || false;
	}
	if (urlParams.has('outboundvideobitrate') || urlParams.has('ovb')) {
		session.outboundVideoBitrate = parseInt(urlParams.get('outboundvideobitrate')) || parseInt(urlParams.get('ovb')) || false;
	}

	if (urlParams.has('webp')){
		session.webp = true;
	}

	if (urlParams.has('webpquality') || urlParams.has('webpq') || urlParams.has('wq')){
		session.webPquality = parseInt(urlParams.get('webpquality')) || parseInt(urlParams.get('webpq')) || parseInt(urlParams.get('wq')) || 4;
	}


	if (urlParams.has('audiobitrate') || urlParams.has('ab')) { // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
		log("AUDIO BITRATE SET");
		session.audiobitrate = urlParams.get('audiobitrate') || urlParams.get('ab');
		session.audiobitrate = parseInt(session.audiobitrate);
		if (session.audiobitrate < 1) {
			session.audiobitrate = false;
		} else if (session.audiobitrate > 510) {
			session.audiobitrate = 510;
		} // this is to just prevent abuse
	}
	if ((iOS) || (iPad)) {
		session.audiobitrate = false; // iOS devices seem to get distortion with custom audio bitrates.  Disable for now.
	}

	/* if (urlParams.has('whitebalance') || urlParams.has('temp')){ // Need to be applied after the camera is selected. bleh. not enforcible. remove for now.
		var temperature = urlParams.get('whitebalance') || urlParams.get('temp');
		try{
			updateCameraConstraints('colorTemperature',  parseFloat(temperature));
		} catch (e){errorlog(e);}
	} */

	if (urlParams.has('streamid') || urlParams.has('view') || urlParams.has('v') || urlParams.has('pull')) { // the streams we want to view; if set, but let blank, we will request no streams to watch.  
		session.view = urlParams.get('streamid') || urlParams.get('view') || urlParams.get('v') || urlParams.get('pull') || null; // this value can be comma seperated for multiple streams to pull

		getById("headphonesDiv2").style.display = "inline-block";
		getById("headphonesDiv").style.display = "inline-block";
		getById("addPasswordBasic").style.display = "none";

		if (session.view == null) {
			session.view = "";
		}
		if (session.view) {
			if (session.view.split(",").length > 1) {
				session.view_set = session.view.split(",");
			}
		}
	}

	//if (urlParams.has('directorview') || urlParams.has('dv')){
	//	session.directorView = true;
	//	if (!session.view){
	//		session.view = true;
	//	}
	//}

	if (urlParams.has('nopreview') || urlParams.has('np')) {
		log("preview OFF");
		session.nopreview = true;
	} else if ((urlParams.has('preview')) || (urlParams.has('showpreview'))) {
		log("preview ON");
		session.nopreview = false;
	} else if ((urlParams.has('minipreview')) || (urlParams.has('mini'))) {
		var mini = urlParams.has('minipreview') || urlParams.has('mini') || true; // 2 is a valid option.
		log("preview ON");
		session.nopreview = false;
		session.minipreview = mini;
	}

	if (urlParams.has('obsfix')) {
		session.obsfix = urlParams.get('obsfix');
		if (session.obsfix) {
			session.obsfix = session.obsfix.toLowerCase();
		}
		if (session.obsfix == "false") {
			session.obsfix = false;
		} else if (session.obsfix == "0") {
			session.obsfix = false;
		} else if (session.obsfix == "no") {
			session.obsfix = false;
		} else if (session.obsfix == "off") {
			session.obsfix = false;
		} else if (parseInt(session.obsfix) > 0) {
			session.obsfix = parseInt(session.obsfix);
		} else {
			session.obsfix = 1; // aggressive.
		}
	}

	if (urlParams.has('controlroombitrate') || urlParams.has('crb')) {
		session.controlRoomBitrate = true;
	}

	if (urlParams.has('remote') || urlParams.has('rem')) {
		log("remote ENABLED");
		session.remote = urlParams.get('remote') || urlParams.get('rem') || "nosecurity";
		session.remote = session.remote.trim();
	}

	if (urlParams.has('latency') || urlParams.has('al') || urlParams.has('audiolatency')) {
		log("latency  ENABLED");
		session.audioLatency = urlParams.get('latency') || urlParams.get('al') || urlParams.get('audiolatency');
		session.audioLatency = parseInt(session.audioLatency) || 0;
		session.disableWebAudio = false;
	}



	if (urlParams.has('micdelay') || urlParams.has('delay') || urlParams.has('md')) {
		log("audio gain  ENABLED");
		session.micDelay = urlParams.get('micdelay') || urlParams.get('delay') || urlParams.get('md');
		session.micDelay = parseInt(session.micDelay) || 0;
		session.disableWebAudio = false;
	}

	if (urlParams.has('tips')){
		getById("guestTips").style.display="flex";
	}

	if (urlParams.has('audiogain') || urlParams.has('gain') || urlParams.has('g')) {
		log("audio gain  ENABLED");
		session.audioGain = urlParams.get('audiogain') || urlParams.get('gain') || urlParams.get('g');
		session.audioGain = parseInt(session.audioGain) || 0;
		session.disableWebAudio = false;
	}
	if (urlParams.has('compressor') || urlParams.has('comp')) {
		log("audio gain  ENABLED");
		session.compressor = 1;
		session.disableWebAudio = false;
	} else if (urlParams.has('limiter')) {
		log("audio gain  ENABLED");
		session.compressor = 2;
		session.disableWebAudio = false;
	}
	if ((urlParams.has('equalizer')) || (urlParams.has('eq'))) {
		session.equalizer = true;
		session.disableWebAudio = false;
	}
	if ((urlParams.has('lowcut')) || (urlParams.has('lc')) || (urlParams.has('higpass'))) {
		session.lowcut = urlParams.get('lowcut') || urlParams.get('lc') || urlParams.get('higpass') || 100;
		session.lowcut = parseInt(session.lowcut);
		session.disableWebAudio = false;
	}

	if (urlParams.has('pip')) {
		session.pip = true; // togglePip
		//session.manual=true;
		//innerHTML = 
	}

	if (urlParams.has('keyframeinterval') || urlParams.has('keyframerate') || urlParams.has('keyframe') || urlParams.has('fki')) {
		log("keyframerate ENABLED");
		session.keyframerate = parseInt(urlParams.get('keyframeinterval') || urlParams.get('keyframerate') || urlParams.get('keyframe') || urlParams.get('fki')) || 0;
	}

	if (urlParams.has('tallyoff') || urlParams.has('obsoff') || urlParams.has('oo') || urlParams.has('disableobs')) {
		log("OBS feedback disabled");
		session.disableOBS = true;
		getById("obsState").style.display = "none !important";
	}

	if (window.obsstudio) {
		session.disableWebAudio = true; // default true; might be useful to disable on slow or old computers?
		session.audioMeterGuest = false;
		session.audioEffects = false;
		session.obsfix = 15; // can be manually set via URL.  ; VP8=15, VP9=30. (previous was 20.)
		try {
			log("OBS VERSION:" + window.obsstudio.pluginVersion);
			log("macOS: " + navigator.userAgent.indexOf('Mac OS X') != -1);
			log(window.obsstudio);
			
			if (typeof document.visibilityState !== "undefined"){
				session.obsState.visibility = document.visibilityState==="visible";
				//session.obsState.sourceActive = session.obsState.visibility;
			}
			
			window.obsstudio.getStatus(function(obsStatus) {
				log("OBS STATUS:");
				log(obsStatus);
				// TODO: update state here
				if ("recording" in obsStatus){
					session.obsState.recording = obsStatus.recording;
				}
				if ("streaming" in obsStatus){
					session.obsState.streaming = obsStatus.streaming;
				}
				
			});
			
			if (!(urlParams.has('streamlabs'))) {

				var ver1 = window.obsstudio.pluginVersion.split(".");
				var cefVersion = getChromeVersion();

				if (ver1.length == 3) { // Should be 3, but disabled3
					if ((ver1.length == 3) && (parseInt(ver1[0]) == 2) && (cefVersion < 76) && (navigator.userAgent.indexOf('Mac OS X') != -1)) {
						updateURL("streamlabs");
						getById("main").innerHTML = "<div style='background-color:black;color:white;' data-translate='obs-macos-not-supported'><h1>Update OBS Studio to v26.1.2 or newer; older versions and StreamLabs OBS are not supported on macOS.\
						<br /><i><small><small>download here: <a href='https://github.com/obsproject/obs-studio/releases/tag/26.1.2'>https://github.com/obsproject/obs-studio/releases/tag/26.1.2</a></small></small></i>\
						</h1> <br /><br />\
						<h2>Please use the <a href='https://github.com/steveseguin/electroncapture'>Electron Capture app</a> if there are further problems or if you wish to use StreamLabs on macOS still.</h2>\
						<br />You can find more details <u><a href='https://github.com/steveseguin/obsninja/wiki/FAQ#mac-os'>within our wiki guide - https://github.com/steveseguin/obsninja/wiki/FAQ#mac-os</a></u></h2>\
						<br /> You can bypass this error message by refreshing, <a href='" + window.location.href + "'> Clicking Here,</a> or by adding <i>&streamlabs</i> to the URL, but it may still not actually work.\
						\
						<br /> Please report this problem to steve@seguin.email if you feel it is an error.\
						</div>";
					}
				}
			}
			
			if (navigator.userAgent.indexOf('Mac OS X') != -1) {
				session.codec = "h264"; // default the codec to h264 if OBS is on macOS (that's all it supports with hardware)
			}
			
			if (session.disableOBS===false){
				window.addEventListener("obsSourceVisibleChanged", obsSourceVisibleChanged);
				window.addEventListener("obsSourceActiveChanged", obsSourceActiveChanged);
				window.addEventListener("obsSceneChanged", obsSceneChanged);
				window.addEventListener("obsStreamingStarted", obsStreamingStarted);
				window.addEventListener("obsStreamingStopped", obsStreamingStopped);
				window.addEventListener("obsRecordingStarted", obsRecordingStarted);
				window.addEventListener("obsRecordingStopped", obsRecordingStopped);
			}
			
		} catch (e) {
			errorlog(e);
		}
	}


	if (urlParams.has('chroma')) {
		log("Chroma ENABLED");
		getById("main").style.backgroundColor = "#" + (urlParams.get('chroma') || "0F0");
	}

	if (urlParams.has('margin')) {
		if (urlParams.get('margin') || 10){
			try {
				var videoMargin = urlParams.get('margin')  || 10;
				videoMargin = parseInt(videoMargin);
				videoMargin+="px";
				document.querySelector(':root').style.setProperty('--video-margin', videoMargin);
			} catch(e){errorlog("variable css failed");}
		}
	}

	if (urlParams.has('fadein')) {
		session.fadein=true;
		if (urlParams.get('fadein') || 0){
			try {
				var fadeinspeed = parseInt(urlParams.get('fadein') || 0)/1000.0;
				fadeinspeed+="s";
				document.querySelector(':root').style.setProperty('--fadein-speed', fadeinspeed);
			} catch(e){errorlog("variable css failed");}
		} else {
			try {
				var fadeinspeed = 0.5;
				fadeinspeed+="s";
				document.querySelector(':root').style.setProperty('--fadein-speed', fadeinspeed);
			} catch(e){errorlog("variable css failed");}
		}
	}


	if (urlParams.has("videodevice") || urlParams.has("vdevice") || urlParams.has('vd') || urlParams.has('device') || urlParams.has('d')) {

		session.videoDevice = urlParams.get("videodevice") || urlParams.get("vdevice") || urlParams.get("vd") || urlParams.get("device") || urlParams.get("d");

		if (session.videoDevice === null) {
			session.videoDevice = "1";
		} else if (session.videoDevice) {
			session.videoDevice = session.videoDevice.toLowerCase().replace(/[\W]+/g, "_");
		}
		if (session.videoDevice == "false") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "0") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "no") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "off") {
			session.videoDevice = 0;
		} else if (session.videoDevice == "snapcam") {
			session.videoDevice = "snap_camera";
		} else if (session.videoDevice == "canon") {
			session.videoDevice = "eos";
		} else if (session.videoDevice == "camlink") {
			session.videoDevice = "cam_link";
		} else if (session.videoDevice == "ndi") {
			session.videoDevice = "newtek_ndi_video";
		} else if (session.videoDevice == "") {
			session.videoDevice = 1;
		} else if (session.videoDevice == "1") {
			session.videoDevice = 1;
		} else if (session.videoDevice == "default") {
			session.videoDevice = 1;
		} else {
			// whatever the user entered I guess, santitized.
			session.videoDevice = session.videoDevice.replace(/[\W]+/g, "_").toLowerCase();
		}

		if (session.videoDevice === 0) {
			getById("add_camera").innerHTML = "Share your Microphone";
			miniTranslate(getById("add_camera"), "share-your-mic");
		}

		getById("videoMenu").style.display = "none";
		log("session.videoDevice:" + session.videoDevice);
	}

	// audioDevice
	if (urlParams.has('audiodevice') || urlParams.has('adevice') || urlParams.has('ad') || urlParams.has('device') || urlParams.has('d')) {

		session.audioDevice = urlParams.get("audiodevice") || urlParams.get("adevice") || urlParams.get("ad") || urlParams.get("device") || urlParams.get("d");

		if (session.audioDevice === null) {
			session.audioDevice = "1";
		} else if (session.audioDevice) {
			session.audioDevice = session.audioDevice.toLowerCase().replace(/[\W]+/g, "_");
		}

		if (session.audioDevice == "false") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "0") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "no") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "off") {
			session.audioDevice = 0;
		} else if (session.audioDevice == "") {
			session.audioDevice = 1;
		} else if (session.audioDevice == "1") {
			session.audioDevice = 1;
		} else if (session.audioDevice == "default") {
			session.audioDevice = 1;
		} else if (session.audioDevice == "ndi") {
			session.audioDevice = "line_newtek_ndi_audio";
		} else {
			// whatever the user entered I guess
			session.audioDevice = session.audioDevice.replace(/[\W]+/g, "_").toLowerCase();
		}


		if (session.videoDevice === 0) {
			if (session.audioDevice === 0) {
				getById("add_camera").innerHTML = "Click Start to Join";
				miniTranslate(getById("add_camera"), "click-start-to-join");
				getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
				getById("container-3").classList.add("skip-animation");
				getById("container-3").classList.remove('pointer');
				delayedStartupFuncs.push([previewWebcam]);
				session.webcamonly = true;
			}
		}

		log("session.audioDevice:" + session.audioDevice);

		getById("audioMenu").style.display = "none";
		getById("headphonesDiv").style.display = "none";
		getById("headphonesDiv2").style.display = "none";
		getById("audioScreenShare1").style.display = "none";

	}


	if (urlParams.has('autojoin') || urlParams.has('autostart') || urlParams.has('aj') || urlParams.has('as')) {
		session.autostart = true;
		if (session.screenshare!==false) {
			delayedStartupFuncs.push([publishScreen]);
		}
	}

	if (urlParams.has('noiframe') || urlParams.has('noiframes') || urlParams.has('nif')) {

		session.noiframe = urlParams.get('noiframe') || urlParams.get('noiframes') || urlParams.get('nif');

		if (!(session.noiframe)) {
			session.noiframe = [];
		} else {
			session.noiframe = session.noiframe.split(",");
		}
		log("disable iframe playback");
		log(session.noiframe);
	}


	if (urlParams.has('exclude') || urlParams.has('ex')) {

		session.exclude = urlParams.get('exclude') || urlParams.get('ex');

		if (!(session.exclude)) {
			session.exclude = false;
		} else {
			session.exclude = session.exclude.split(",");
		}
		log("exclude video playback");
		log(session.exclude);
	}


	if (urlParams.has('novideo') || urlParams.has('nv') || urlParams.has('hidevideo') || urlParams.has('showonly')) {

		session.novideo = urlParams.get('novideo') || urlParams.get('nv') || urlParams.get('hidevideo') || urlParams.get('showonly');

		if (!(session.novideo)) {
			session.novideo = [];
		} else {
			session.novideo = session.novideo.split(",");
		}
		log("disable video playback");
		log(session.novideo);
	}

	if (urlParams.has('noaudio') || urlParams.has('na') || urlParams.has('hideaudio')) {

		session.noaudio = urlParams.get('noaudio') || urlParams.get('na') || urlParams.get('hideaudio');

		if (!(session.noaudio)) {
			session.noaudio = [];
		} else {
			session.noaudio = session.noaudio.split(",");
		}
		log("disable audio playback");
	}

	if (urlParams.has('forceios')) {
		log("allow iOS to work in video group chat; for this user at least");
		session.forceios = true;
	}

	if (urlParams.has('nocursor')) {
		session.nocursor = true;
		log("DISABLE CURSOR");
		var styletmp = document.createElement('style');
		styletmp.innerHTML = `
		video {
			margin: 0;
			padding: 0;
			overflow: hidden;
			cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=), none;
			user-select: none;
		}
		`;
		document.head.appendChild(styletmp);
		
	}

	if (urlParams.has('vbr')) {
		session.cbr = 0;
	}

	if (urlParams.has('order')) {
		session.order = parseInt(urlParams.get('order')) || 0;
	}
	if (urlParams.has('sensors') || urlParams.has('sensor') || urlParams.has('gyro') || urlParams.has('gyros') || urlParams.has('accelerometer')) {
		session.sensorData = urlParams.get('sensors') || urlParams.get('sensor') || urlParams.get('gyro') || urlParams.get('gyros') || urlParams.get('accelerometer') || 30;
		session.sensorData = parseInt(session.sensorData);
	}

	if (urlParams.has('minptime')) {
		session.minptime = parseInt(urlParams.get('minptime')) || 10;
		if (session.minptime < 10) {
			session.minptime = 10;
		}
		if (session.minptime > 300) {
			session.minptime = 300;
		}
	}

	if (urlParams.has('maxptime')) {
		session.maxptime = parseInt(urlParams.get('maxptime')) || 60;
		if (session.maxptime < 10) {
			session.maxptime = 10;
		}
		if (session.maxptime > 300) {
			session.maxptime = 300;
		}
	}

	if (urlParams.has('ptime')) {
		session.ptime = parseInt(urlParams.get('ptime')) || 20;
		if (session.minptime < 10) {
			session.ptime = 10;
		}
		if (session.minptime > 300) {
			session.ptime = 300;
		}
	}


	if (urlParams.has('codec')) {
		log("CODEC CHANGED");
		session.codec = urlParams.get('codec').toLowerCase();
		if (session.codec=="webp"){
			session.webp = true;
			session.codec = false;
		}
	} else if (isOperaGX()){
		session.codec = "vp8";
		warnlog("Defaulting to VP8 manually, as H264 with remote iOS devices is not supported");
	}

	if (urlParams.has('nonacks')){ // disables error control / throttling.
		session.noNacks = true;
	}
	if (urlParams.has('nopli')){ // disables error control / throttling.
		session.noPLIs = true;
	}
	if (urlParams.has('noremb')){ // disables error control / throttling.
		session.noREMB = true;
	}

	if (urlParams.has('scale')) {
		if (urlParams.get('scale') == "false") {} else if (urlParams.get('scale') == "0") {} else if (urlParams.get('scale') == "no") {} else if (urlParams.get('scale') == "off") {} else {
			log("Resolution scale requested");
			session.scale = parseInt(urlParams.get('scale')) || 100;
		}
		session.dynamicScale = false; // default true
	}

	var ConfigSettings = getById("main-js");
	var ln_template = false;
	
	try {
		if (ConfigSettings) {
			ln_template = ConfigSettings.getAttribute('data-translation'); // Translations
			if (typeof ln_template === "undefined") {
				ln_template = false;
			} else if (ln_template === null) {
				ln_template = false;
			}
		}

		if (urlParams.has('ln')) {
			ln_template = urlParams.get('ln');
		}
	} catch (e) {
		errorlog(e);
	}

	if (ln_template) { // checking if manual lanuage override enabled
		try {
			log("Template: " + ln_template);
			fetch("./translations/" + ln_template + '.json').then(function(response) {
				if (response.status !== 200) {
					log('Looks like there was a problem. Status Code: ' +
						response.status);
					return;
				}
				response.json().then(function(data) {
					log(data);
					translation = data;
					var trans = data.innerHTML;
					var allItems = document.querySelectorAll('[data-translate]');
					allItems.forEach(function(ele) {
						if (ele.dataset.translate in trans) {
							ele.innerHTML = trans[ele.dataset.translate];
						}
					});
					trans = data.titles;
					var allTitles = document.querySelectorAll('[title]');
					allTitles.forEach(function(ele) {
						var key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
						if (key in trans) {
							ele.title = trans[key];
						}
					});
					trans = data.placeholders;
					var allPlaceholders = document.querySelectorAll('[placeholder]');
					allPlaceholders.forEach(function(ele) {
						var key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
						if (key in trans) {
							ele.placeholder = trans[key];
						}
					});


					getById("mainmenu").style.opacity = 1;
				}).catch(function(err) {
					errorlog(err);
					getById("mainmenu").style.opacity = 1;
				});
			}).catch(function(err) {
				errorlog(err);
				getById("mainmenu").style.opacity = 1;
			});

		} catch (error) {
			errorlog(error);
			getById("mainmenu").style.opacity = 1;
		}
	} else if (location.hostname !== "vdo.ninja") {
		if (location.hostname === "rtc.ninja"){
			try {
				if (session.label === false) {
					document.title = "";
				}
				getById("qos").innerHTML = "";
				getById("logoname").innerHTML = "";
				getById("helpbutton").style.display = "none";
				getById("helpbutton").style.opacity = 0;
				getById("reportbutton").style.display = "none";
				getById("reportbutton").style.opacity = 0;
				getById("mainmenu").style.opacity = 1;
				getById("mainmenu").style.margin = "30px 0";
				getById("translateButton").style.display = "none";
				getById("translateButton").style.opacity = 0;
				getById("info").style.display = "none";
				getById("info").style.opacity = 0;
				getById("chatBody").innerHTML = "";
			} catch (e) {}
		}
		try {
			fetch("./translations/blank.json").then(function(response) {
				if (response.status !== 200) {
					log('Looks like there was a problem. Status Code: ' +
						response.status);
					return;
				}
				response.json().then(function(data) {
					log(data);

					var trans = data.innerHTML;
					var allItems = document.querySelectorAll('[data-translate]');
					allItems.forEach(function(ele) {
						if (ele.dataset.translate in trans) {
							ele.innerHTML = trans[ele.dataset.translate];
						}
					});
					trans = data.titles;
					var allTitles = document.querySelectorAll('[title]');
					allTitles.forEach(function(ele) {
						var key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
						if (key in trans) {
							ele.title = trans[key];
						}
					});
					trans = data.placeholders;
					var allPlaceholders = document.querySelectorAll('[placeholder]');
					allPlaceholders.forEach(function(ele) {
						var key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
						if (key in trans) {
							ele.placeholder = trans[key];
						}
					});

					if (session.label === false) {
						document.title = location.hostname;
					}
					getById("qos").innerHTML = location.hostname;
					getById("logoname").innerHTML = getById("qos").outerHTML;
					getById("helpbutton").style.display = "none";
					getById("reportbutton").style.display = "none";
					getById("mainmenu").style.opacity = 1;
				}).catch(function(err) {
					errorlog(err);
					getById("mainmenu").style.opacity = 1;
				});
			}).catch(function(err) {
				errorlog(err);
				getById("mainmenu").style.opacity = 1;
			});
			if (session.label === false) {
				document.title = location.hostname;
			}
			getById("qos").innerHTML = location.hostname;
			getById("logoname").innerHTML = getById("qos").outerHTML;
			getById("helpbutton").style.display = "none";
			getById("reportbutton").style.display = "none";
			getById("chatBody").innerHTML = "";
		} catch (error) {
			errorlog(error);
		}
	} else { // check if automatic language translation is available
		getById("mainmenu").style.opacity = 1;
	}

	try {
		if (location.hostname === "rtc.ninja"){ // an extra-brand-free version of vdo.ninja
			if (session.label === false) {
				document.title = "";
			}
			getById("qos").innerHTML = "";
			getById("logoname").innerHTML = "";
			getById("helpbutton").style.display = "none";
			getById("helpbutton").style.opacity = 0;
			getById("reportbutton").style.display = "none";
			getById("reportbutton").style.opacity = 0;
			getById("mainmenu").style.opacity = 1;
			getById("mainmenu").style.margin = "30px 0";
			getById("translateButton").style.display = "none";
			getById("translateButton").style.opacity = 0;
			getById("info").style.display = "none";
			getById("info").style.opacity = 0;
			getById("chatBody").innerHTML = "";
		} else if (location.hostname !== "vdo.ninja") {
			if (session.label === false) {
				document.title = location.hostname;
			}
			getById("qos").innerHTML = sanitizeLabel(location.hostname);
			getById("logoname").innerHTML = getById("qos").outerHTML;
			getById("helpbutton").style.display = "none";
			getById("reportbutton").style.display = "none";
		}

	} catch (e) {}

	if (isIFrame) {
		getById("helpbutton").style.display = "none";
		getById("helpbutton").style.opacity = 0;
		getById("reportbutton").style.display = "none";
		getById("reportbutton").style.opacity = 0;
		getById("chatBody").innerHTML = "";
	}

	if (urlParams.has('beep') || urlParams.has('notify') || urlParams.has('tone')) {
		session.beepToNotify = true;
	}

	if (urlParams.has('r2d2')) {
		getById("testtone").innerHTML = "";
		getById("testtone").src = "./media/robot.mp3";
		session.beepToNotify = true;
	}

	if (urlParams.has('videobitrate') || urlParams.has('bitrate') || urlParams.has('vb')) {
		session.bitrate = urlParams.get('videobitrate') || urlParams.get('bitrate') || urlParams.get('vb');
		if (session.bitrate) {
			if ((session.view_set) && (session.bitrate.split(",").length > 1)) {
				session.bitrate_set = session.bitrate.split(",");
				session.bitrate = parseInt(session.bitrate_set[0]);
			} else {
				session.bitrate = parseInt(session.bitrate);
			}
			if (session.bitrate < 1) {
				session.bitrate = false;
			}
			log("BITRATE ENABLED");
			log(session.bitrate);

		}
	}

	if (urlParams.has('maxvideobitrate') || urlParams.has('maxbitrate') || urlParams.has('mvb')) {
		session.maxvideobitrate = urlParams.get('maxvideobitrate') || urlParams.get('maxbitrate') || urlParams.get('mvb');
		session.maxvideobitrate = parseInt(session.maxvideobitrate);

		if (session.maxvideobitrate < 1) {
			session.maxvideobitrate = false;
		}
		log("maxvideobitrate ENABLED");
		log(session.maxvideobitrate);
	}

	if (urlParams.has('totalroombitrate') || urlParams.has('totalroomvideobitrate') || urlParams.has('trb')) {
		session.totalRoomBitrate = urlParams.get('totalroombitrate') || urlParams.get('totalroomvideobitrate') || urlParams.get('trb');
		session.totalRoomBitrate = parseInt(session.totalRoomBitrate);

		if (session.totalRoomBitrate < 1) {
			session.totalRoomBitrate = false;
		}
		log("totalRoomBitrate ENABLED");
		log(session.totalRoomBitrate);
		
	}
	if (session.totalRoomBitrate===false){
		session.totalRoomBitrate = session.totalRoomBitrate_default;
	} else {
		session.totalRoomBitrate_default = session.totalRoomBitrate; // trb_default doesn't change dynamically, but trb can (per director I guess)
	}


	if (urlParams.has('limittotalbitrate') || urlParams.has('ltb')){
		session.limitTotalBitrate = urlParams.get('limittotalbitrate') || urlParams.get('ltb') || 2500;
		session.limitTotalBitrate = parseInt(session.limitTotalBitrate);
	}

	if (urlParams.has('height') || urlParams.has('h')) {
		session.height = urlParams.get('height') || urlParams.get('h');
		session.height = parseInt(session.height);
	}

	if (urlParams.has('width') || urlParams.has('w')) {
		session.width = urlParams.get('width') || urlParams.get('w');
		session.width = parseInt(session.width);
	}

	if (urlParams.has('quality') || urlParams.has('q')) {
		try {
			session.quality = urlParams.get('quality') || urlParams.get('q') || 0;
			session.quality = parseInt(session.quality);
			getById("gear_screen").parentNode.removeChild(getById("gear_screen"));
			getById("gear_webcam").parentNode.removeChild(getById("gear_webcam"));
		} catch (e) {
			errorlog(e);
		}
	}

	if (urlParams.has('sink')) {
		session.sink = urlParams.get('sink');
	} else if (urlParams.has('outputdevice') || urlParams.has('od') || urlParams.has('audiooutput')) {
		session.outputDevice = urlParams.get('outputdevice') || urlParams.get('od') || urlParams.get('audiooutput') || null;
		
		if (session.outputDevice) {
			session.outputDevice = session.outputDevice.toLowerCase().replace(/[\W]+/g, "_");
		} else {
			session.outputDevice = null;
			getById("headphonesDiv3").style.display = "none"; // 
		}

		if (session.outputDevice) {
			try {
				enumerateDevices().then(function(deviceInfos) {
					for (let i = 0; i !== deviceInfos.length; ++i) {
						if (deviceInfos[i].kind === 'audiooutput') {
							if (deviceInfos[i].label.replace(/[\W]+/g, "_").toLowerCase().includes(session.outputDevice)) {
								session.sink = deviceInfos[i].deviceId;
								log("AUDIO OUT DEVICE: " + deviceInfos[i].deviceId);
								break;
							}
						}
					}
				});
			} catch (e) {}
		}
		
		getById("headphonesDiv").style.display = "none";
		getById("headphonesDiv2").style.display = "none";
	}

	if (window.obsstudio || (navigator.userAgent.toLowerCase().indexOf(' electron/') > -1)){
		session.fullscreen = true;
	} else if (urlParams.has('fullscreen')) {
		session.fullscreen = true;
	}

	if (urlParams.has('stats')) {
		session.statsMenu = true;
	}

	if (urlParams.has('cleandirector') || urlParams.has('cdv')) {
		session.cleanDirector = true;
	}

	if (session.cleanOutput){
		getById("translateButton").style.display = "none";
		getById("credits").style.display = "none";
		getById("header").style.display = "none";
		getById("controlButtons").style.display = "none";
		var styleTmp = document.createElement('style');
		styleTmp.innerHTML = `
		video {
			background-image: none;
		}
		`;
		document.head.appendChild(styleTmp);
	}
	getById("credits").innerHTML = "Version: " + session.version + " - " + getById("credits").innerHTML;

	if (urlParams.has('cleanish')) {
		session.cleanish = true;
	}

	if (urlParams.has('channels')) { // must be loaded before channelOffset
		session.audioChannels = parseInt(urlParams.get('channels'));
		session.offsetChannel = 0;
		log("max channels is 32; channels offset");
		session.audioEffects = true;
	}
	if (urlParams.has('channeloffset')) {
		session.offsetChannel = parseInt(urlParams.get('channeloffset'));
		log("max channels is 32; channels offset");
		session.audioEffects = true;
	}

	if (urlParams.has('enhance')) {
		//if (parseInt(urlParams.get('enhance')>0){
		session.enhance = true; //parseInt(urlParams.get('enhance'));
		//}
	}

	if (urlParams.has('maxviewers') || urlParams.has('mv')) {

		session.maxviewers = urlParams.get('maxviewers') || urlParams.get('mv');
		if (session.maxviewers.length == 0) {
			session.maxviewers = 1;
		} else {
			session.maxviewers = parseInt(session.maxviewers);
		}
		log("maxviewers set");
	}

	if (urlParams.has('maxpublishers') || urlParams.has('mp')) {

		session.maxpublishers = urlParams.get('maxpublishers') || urlParams.get('mp');
		if (session.maxpublishers.length == 0) {
			session.maxpublishers = 1;
		} else {
			session.maxpublishers = parseInt(session.maxpublishers);
		}
		log("maxpublishers set");
	}

	if (urlParams.has('maxconnections') || urlParams.has('mc')) {

		session.maxconnections = urlParams.get('maxconnections') || urlParams.get('maxconnections');
		if (session.maxconnections.length == 0) {
			session.maxconnections = 1;
		} else {
			session.maxconnections = parseInt(session.maxconnections);
		}

		log("maxconnections set");
	}


	if (urlParams.has('secure')) {
		session.security = true;
		if (!(session.cleanOutput)) {
			delayedStartupFuncs.push([warnUser, "Enhanced Security Mode Enabled."]);
		}
	}

	if (urlParams.has('random') || urlParams.has('randomize')) {
		session.randomize = true;
	}

	if (urlParams.has('framerate') || urlParams.has('fr') || urlParams.has('fps')) {
		session.framerate = urlParams.get('framerate') || urlParams.get('fr') || urlParams.get('fps');
		session.framerate = parseInt(session.framerate);
		log("framerate Changed");
		log(session.framerate);
	}

	if (urlParams.has('maxframerate') || urlParams.has('mfr') || urlParams.has('mfps')) {
		session.maxframerate = urlParams.get('maxframerate') || urlParams.get('mfr') || urlParams.get('mfps');
		session.maxframerate = parseInt(session.maxframerate);
		log("max framerate assigned");
		log(session.maxframerate);
	}

	if (urlParams.has('buffer')) { // needs to be before sync
		session.buffer = parseFloat(urlParams.get('buffer')) || 0;
		log("buffer Changed: " + session.buffer);
		session.sync = 0;
		session.audioEffects = true;
	}

	if (urlParams.has('sync')) {
		session.sync = parseFloat(urlParams.get('sync'));
		log("sync Changed; in milliseconds.  If not set, defaults to auto.");
		log(session.sync);
		session.audioEffects = true;
		if (session.buffer === false) {
			session.buffer = 0;
		}
	}

	if (urlParams.has('mirror')) {
		if (urlParams.get('mirror') == "3") {
			getById("main").classList.add("mirror");
		} else if (urlParams.get('mirror') == "2") {
			session.mirrored = 2;
		} else if (urlParams.get('mirror') == "0") {
			session.mirrored = 0;
		} else if (urlParams.get('mirror') == "false") {
			session.mirrored = 0;
		} else if (urlParams.get('mirror') == "off") {
			session.mirrored = 0;
		} else {
			session.mirrored = 1;
		}
	}

	if (urlParams.has('flip')) {
		if (urlParams.get('flip') == "0") {
			session.flipped = false;
		} else if (urlParams.get('flip') == "false") {
			session.flipped = false;
		} else if (urlParams.get('flip') == "off") {
			session.flipped = false;
		} else {
			session.flipped = true;
		}
	}

	if ((session.mirrored) && (session.flipped)) {
		try {
			log("Mirror all videos");
			var mirrorStyle = document.createElement('style');
			mirrorStyle.innerHTML = "video {transform: scaleX(-1) scaleY(-1); }";
			document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
		} catch (e) {
			errorlog(e);
		}
	} else if (session.mirrored) { // mirror the video horizontally
		try {
			log("Mirror all videos");
			var mirrorStyle = document.createElement('style');
			mirrorStyle.innerHTML = "video {transform: scaleX(-1);}";
			document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
		} catch (e) {
			errorlog(e);
		}
	} else if (session.flipped) { // mirror the video vertically
		try {
			log("Mirror all videos");
			var mirrorStyle = document.createElement('style');
			mirrorStyle.innerHTML = "video {transform: scaleY(-1);}";
			document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
		} catch (e) {
			errorlog(e);
		}
	}


	if (urlParams.has('icefilter')) {
		log("ICE FILTER ENABLED");
		session.icefilter = urlParams.get('icefilter');
	}


	if (urlParams.has('effects') || urlParams.has('effect')) {
		session.effects = urlParams.get('effects') || urlParams.get('effect') || null;
		if (session.effects === null){
			getById("effectsDiv").style.display = "block";
			session.effects = 0;
		} else if (session.effects === "0" || session.effects === "false" || session.effects === "off"){
			session.effects = false;
			getById("effectSelector3").style.display = "none";
			getById("effectsDiv3").style.display = "none";
			getById("effectSelector").style.display = "none";
			getById("effectsDiv").style.display = "none";
		} else {
			session.effects = parseInt(session.effects);
		}
		
		if (session.effects === 5){
			getById("selectImageTFLITE").style.display = "block";
			getById("selectImageTFLITE3").style.display = "block";
			getById("effectSelector").style.display = "none";
			getById("effectsDiv").style.display = "block";
		}
		// mirror == 2
		// face == 1
		// blur = 3
		// green = 4
		// image = 5
	}
	
	if (!(getChromeVersion()>=57)){
		getById("effectSelector").disabled=true;
		getById("effectSelector3").disabled=true;
		getById("effectSelector").title = "Effects are only support on Chromium-based browsers";
		getById("effectSelector3").title = "Effects are only support on Chromium-based browsers";
		var elementsTmp = document.querySelectorAll('[data-effectsNotice]');
		for (let i = 0; i < elementsTmp.length; i++) {
			elementsTmp[i].style.display = "inline-block";
		}
	}


	if (urlParams.has('viewereffect') || urlParams.has('viewereffects') || urlParams.has('ve')) {
		session.viewereffects = parseInt(urlParams.get('viewereffect')) || parseInt(urlParams.get('ve')) || false;
	}

	if (urlParams.has('activespeaker') || urlParams.has('speakerview')  || urlParams.has('sas')){
		session.activeSpeaker = true;
		session.audioEffects = true;
		session.audioMeterGuest = true;
		setInterval(function(){activeSpeaker(false);},100);
	}

	if (urlParams.has('meter') || urlParams.has('meterstyle')){
		session.meterStyle = urlParams.get('meter') || urlParams.get('meterstyle') || 1;
	}

	if (urlParams.has('directorchat') || urlParams.has('dc')){
		session.directorChat = true;
	}

	if (urlParams.has('style') || urlParams.has('st')) {
		session.style = urlParams.get('style') || urlParams.get('st') || 1;
		if ((parseInt(session.style) == 1) || (session.style == "justvideo")) { // no audio only
			session.style = 1;
		} else if ((parseInt(session.style) == 2) || (session.style == "waveform")) { // audio waveform
			session.style = 2;
			session.audioEffects = true; ////!!!!!!! Do I want to enable the audioEffects myself? or do it here?
		} else if ((parseInt(session.style) == 3) || (session.style == "volume")) { // photo is taken? upload option? canvas?
			session.style = 3;
			session.audioEffects = true;
		} else {
			session.style = 1;
		}
	}


	if (urlParams.has('samplerate') || urlParams.has('sr')) {
		session.sampleRate = parseInt(urlParams.get('samplerate')) || parseInt(urlParams.get('samplerate')) || 48000;
		if (session.audioCtx) {
			session.audioCtx.close(); // close the default audio context.
		}
		session.audioCtx = new AudioContext({ // create a new audio context with a higher sample rate. 
			sampleRate: session.sampleRate
		});
		session.audioEffects = true;
	}


	if (urlParams.has('noaudioprocessing') || urlParams.has('noap')) {
		session.disableWebAudio = true; // default true; might be useful to disable on slow or old computers?
		session.audioEffects = false; // disable audio inbound effects also.
		session.audioMeterGuest = false;
	}

	if (urlParams.has('tcp')){ // forces the TURN servers to use TCP mode; still need to add &private to force TURN also tho
		session.forceTcpMode = true;
	}
	if (urlParams.has('speedtest')){ // forces essentially UDP mode, unless TCP is specified, and some other stuff
		session.speedtest = true;
	}

	if (urlParams.has('turn')) {
		var turnstring = urlParams.get('turn');
		if (turnstring == "twilio") { // a sample function on loading remote credentials for TURN servers.
			try {
				
				session.ws = false; // prevents connection
				var twillioRequest = new XMLHttpRequest();
				twillioRequest.onreadystatechange = function() {
					if (twillioRequest.status === 200) {
						try{
							var res = JSON.parse(twillioRequest.responseText);
						} catch(e){return;}
						session.configuration = {
							iceServers: [{
									"username": res["1"],
									"credential": res["2"],
									"url": "turn:global.turn.twilio.com:3478?transport=tcp",
									"urls": "turn:global.turn.twilio.com:3478?transport=tcp"
								},
								{
									"username": res["1"],
									"credential": res["2"],
									"url": "turn:global.turn.twilio.com:443?transport=tcp",
									"urls": "turn:global.turn.twilio.com:443?transport=tcp"
								}
							],
							sdpSemantics: 'unified-plan' // future-proofing
						};
						if (session.ws===false){
							session.ws=null; // allows connection (clears state)
							session.connect(); // connect if not already connected.
						}
					}
					// system does not connect if twilio API does not respond.
				};
				twillioRequest.open('GET', 'https://api.obs.ninja:1443/twilio', true); // `false` makes the request synchronous
				twillioRequest.send();

				
			} catch (e) {
				errorlog("Twilio Failed");
			}
		} else if (turnstring == "nostun") { // disable TURN servers
			session.configuration = {
				sdpSemantics: 'unified-plan' // future-proofing
			};
		} else if ((turnstring == "false") || (turnstring == "off") || (turnstring == "0")) { // disable TURN servers
			session.configuration = {
				iceServers: [
					{ urls: ["stun:stun.l.google.com:19302", "stun:stun4.l.google.com:19302"]} // more than 4 stun+turn servers will cause firefox issues? (2 + 2 for now then)
				],
				sdpSemantics: 'unified-plan' // future-proofing
			};
		} else {
			try {
				//session.configuration = {iceServers: [], sdpSemantics: 'unified-plan'};
				turnstring = turnstring.split(";");
				if (turnstring !== "false") { // false disables the TURN server. Useful for debuggin
					var turn = {};
					turn.username = turnstring[0]; // myusername
					turn.credential = turnstring[1]; //mypassword
					turn.urls = [turnstring[2]]; //  ["turn:turn.obs.ninja:443"];
					
					session.configuration = {
						iceServers: [
							{ urls: ["stun:stun.l.google.com:19302", "stun:stun4.l.google.com:19302"]} // more than 4 stun+turn servers will cause firefox issues? (2 + 2 for now then)
						],
						sdpSemantics: 'unified-plan' // future-proofing
					};
					
					session.configuration.iceServers.push(turn);
				}
			} catch (e) {
				if (!(session.cleanOutput)) {
					warnUser("TURN server parameters were wrong.");
				}
				errorlog(e);
			}
		}
	} else {
		chooseBestTURN(); // vdo.ninja turn servers, if needed.
	}


	if (urlParams.has('privacy') || urlParams.has('private') || urlParams.has('relay')) { // please only use if you are also using your own TURN service.
		session.privacy = true;
		
		try {
			session.configuration.iceTransportPolicy = "relay"; // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/address
		} catch (e) {
			if (!(session.cleanOutput)) {
				warnUser("Privacy mode failed to configure.");
			}
			errorlog(e);
		}
		
		if (session.speedtest){
			if (session.maxvideobitrate !== false) {
				if (session.maxvideobitrate > 6000) {
					session.maxvideobitrate = 6000; // Please feel free to get rid of this if using your own TURN servers...
				}
			} else {
				session.maxvideobitrate = 6000; // don't let people pull more than 2500 from you
			}
			if (session.bitrate !== false) {
				if (session.bitrate > 6000) {
					session.bitrate = 6000; // Please feel free to get rid of this if using your own TURN servers...
				}
			}
		} else {
			if (session.maxvideobitrate !== false) {
				if (session.maxvideobitrate > 2500) {
					session.maxvideobitrate = 2500; // Please feel free to get rid of this if using your own TURN servers...
				}
			} else {
				session.maxvideobitrate = 2500; // don't let people pull more than 2500 from you
			}
			if (session.bitrate !== false) {
				if (session.bitrate > 2500) {
					session.bitrate = 2500; // Please feel free to get rid of this if using your own TURN servers...
				}
			}
		}
	}

	if (urlParams.has('wss')) {
		if (urlParams.get('wss')) {
			session.wss = "wss://" + urlParams.get('wss');
		}
	}

	if (urlParams.has('queue')) {
		session.queue = true;
	}

	if (urlParams.has('permaid') || urlParams.has('push')) {
		session.permaid = urlParams.get('push') || urlParams.get('permaid');

		if (session.permaid) {
			session.streamID = sanitizeStreamID(session.permaid);
		} else {
			session.permaid = null;
		}

		if (urlParams.has('permaid')) {
			updateURL("permaid=" + session.streamID, true, false); // I'm not deleting the permaID first tho...
		} else {
			updateURL("push=" + session.streamID, true, false); // I'm not deleting the permaID first tho...
		}

		if (urlParams.has('director') || urlParams.has('dir')) { // if I do a short form of this, it will cause duplications in the code elsewhere.
			//var director_room_input = urlParams.get('director');
			//director_room_input = sanitizeRoomName(director_room_input);
			//createRoom(director_room_input);
			session.permaid = false; // used to avoid a trigger later on.
		} else {
			getById("container-1").className = 'column columnfade advanced';
			getById("container-4").className = 'column columnfade advanced';
			getById("dropButton").className = 'column columnfade advanced';

			getById("info").innerHTML = "";
			if (session.videoDevice === 0) {
				getById("add_camera").innerHTML = "Share your Microphone";
				miniTranslate(getById("add_camera"), "share-your-mic");
			} else {
				getById("add_camera").innerHTML = "Share your Camera";
				miniTranslate(getById("add_camera"), "share-your-camera");
			}
			getById("add_screen").innerHTML = "Share your Screen";
			miniTranslate(getById("add_screen"), "share-your-screen");

			getById("passwordRoom").value = "";
			getById("videoname1").value = "";
			getById("dirroomid").innerHTML = "";
			getById("roomid").innerHTML = "";

			getById("mainmenu").style.alignSelf = "center";
			getById("mainmenu").classList.add("mainmenuclass");
			getById("header").style.alignSelf = "center";

			if ((iOS) || (iPad)) {
				getById("header").style.display = "none"; // just trying to free up space.
			}

			if (session.webcamonly == true) { // mobile or manual flag 'webcam' pflag set
				getById("head1").innerHTML = '<font style="color:#CCC;" data-translate="please-accept-permissions">- Please accept any camera permissions</font>';
			} else {
				getById("head1").innerHTML = '<br /><font style="color:#CCC" data-translate="please-select-which-to-share">- Please select which you wish to share</font>';
			}
		}
	}

	if ((session.roomid) || (urlParams.has('roomid')) || (urlParams.has('r')) || (urlParams.has('room')) || (filename) || (session.permaid !== false)) {

		var roomid = "";
		if (filename) {
			roomid = filename;
		} else if (urlParams.has('room')) {
			roomid = urlParams.get('room');
		} else if (urlParams.has('roomid')) {
			roomid = urlParams.get('roomid');
		} else if (urlParams.has('r')) {
			roomid = urlParams.get('r');
		} else if (session.roomid) {
			roomid = session.roomid;
		}

		session.roomid = sanitizeRoomName(roomid);

		if (!(session.cleanOutput)) {
			if (session.roomid === "test") {
				if (session.password === session.defaultPassword) {
					window.focus();
					var testRoomResponse = confirm("The room name 'test' is very commonly used and may not be secure.\n\nAre you sure you wish to proceed?");
					if (testRoomResponse == false) {
						hangup();
						throw new Error("User requested to not enter room 'room'.");
					}
				}
			}
		}

		if (session.audioDevice === false && session.outputDevice === false) {
			getById("headphonesDiv2").style.display = "inline-block";
			getById("headphonesDiv").style.display = "inline-block";
		}
		getById("addPasswordBasic").style.display = "none";
		
		getById("info").innerHTML = "";
		getById("info").style.color = "#CCC";
		getById("videoname1").value = session.roomid;
		getById("dirroomid").innerText = session.roomid;
		getById("roomid").innerText = session.roomid;
		getById("container-1").className = 'column columnfade advanced';
		getById("container-4").className = 'column columnfade advanced';
		getById("container-7").style.display = 'none';
		getById("container-8").style.display = 'none';
		getById("mainmenu").style.alignSelf = "center";
		getById("mainmenu").classList.add("mainmenuclass");
		getById("header").style.alignSelf = "center";

		if (session.webcamonly == true) { // mobile or manual flag 'webcam' pflag set
			getById("head1").innerHTML = '';
		} else {
			getById("head1").innerHTML = '<font style="color:#CCC" data-translate="please-select-option-to-join">Please select an option to join.</font>';
		}

		if (session.roomid.length > 0) {
			if (session.videoDevice === 0) {
				if (session.audioDevice === 0) {
					getById("add_camera").innerHTML = "Join room";
					miniTranslate(getById("add_camera"), "join-room");
				} else {
					getById("add_camera").innerHTML = "Join room with Microphone";
					miniTranslate(getById("add_camera"), "join-room-with-mic");
				}
			} else {
				getById("add_camera").innerHTML = "Join Room with Camera";
				miniTranslate(getById("add_camera"), "join-room-with-camera");
			}
			getById("add_screen").innerHTML = "Screenshare with Room";
			miniTranslate(getById("add_screen"), "share-screen-with-room");
		} else {
			if (session.videoDevice === 0) {
				getById("add_camera").innerHTML = "Share your Microphone";
				miniTranslate(getById("add_camera"), "share-your-mic");
			} else {
				getById("add_camera").innerHTML = "Share your Camera";
				miniTranslate(getById("add_camera"), "share-your-camera");
			}
			getById("add_screen").innerHTML = "Share your Screen";
			miniTranslate(getById("add_screen"), "share-your-screen");
		}
		getById("head3").className = 'advanced';

		if (session.scene !== false) {
			getById("container-4").className = 'column columnfade';
			getById("container-3").className = 'column columnfade';
			getById("container-2").className = 'column columnfade';
			getById("container-1").className = 'column columnfade';
			getById("header").className = 'advanced';
			getById("info").className = 'advanced';
			getById("head1").className = 'advanced';
			getById("head2").className = 'advanced';
			getById("mainmenu").style.display = "none";
			getById("translateButton").style.display = "none";
			log("Update Mixer Event on REsize SET");
			window.addEventListener("resize", updateMixer);
			window.addEventListener("orientationchange", function() {
				setTimeout(updateMixer, 200);
			});
			joinRoom(session.roomid); // this is a scene, so we want high resolutions
			getById("main").style.overflow = "hidden";

			if (session.chatbutton === true) {
				getById("chatbutton").classList.remove("advanced");
				getById("controlButtons").style.display = "inherit";
			} else if (session.chatbutton === false) {
				getById("chatbutton").classList.add("advanced");
			}
		} else {
			if ((session.permaid === null) && (session.roomid == "")) {
				if (!(session.cleanOutput)) {
					getById("head3").className = '';
				}
			}
		}

	} else if (urlParams.has('director') || urlParams.has('dir')) { // if I do a short form of this, it will cause duplications in the code elsewhere.
		if (directorLanding == false) {
			var director_room_input = urlParams.get('director') || urlParams.get('dir');
			director_room_input = sanitizeRoomName(director_room_input);
			log("director_room_input:" + director_room_input);
			createRoom(director_room_input);
		}
		if (session.chatbutton === true) {
			getById("chatbutton").classList.remove("advanced");
			getById("controlButtons").style.display = "inherit";
		} else if (session.chatbutton === false) {
			getById("chatbutton").classList.add("advanced");
		}
	} else if ((session.view) && (session.permaid === false)) {
		//if (!session.activeSpeaker){
		session.audioMeterGuest = false;
		//}
		if (session.audioEffects === null) {
			session.audioEffects = false;
		}
		log("Update Mixer Event on REsize SET");
		getById("translateButton").style.display = "none";
		window.addEventListener("resize", updateMixer);
		window.addEventListener("orientationchange", function() {
			setTimeout(updateMixer, 200);
		});
		getById("main").style.overflow = "hidden";

		if (session.chatbutton === true) {
			getById("chatbutton").classList.remove("advanced");
			getById("controlButtons").style.display = "inherit";
		} else if (session.chatbutton === false) {
			getById("chatbutton").classList.add("advanced");
		}
	}

	if (session.audioEffects === null) {
		session.audioEffects = true;
	}

	if (session.audioEffects) {
		getById("channelGroup1").style.display = "block";
		getById("channelGroup2").style.display = "block";
	}

	if (urlParams.has('hidemenu') || urlParams.has('hm')) { // needs to happen the room and permaid applications
		getById("mainmenu").style.display = "none";
		getById("header").style.display = "none";
		getById("mainmenu").style.opacity = 0;
		getById("header").style.opacity = 0;
	}

	if (urlParams.has('hideheader') || urlParams.has('noheader') || urlParams.has('hh')) { // needs to happen the room and permaid applications
		getById("header").style.display = "none";
		getById("header").style.opacity = 0;
	}

	
	if (session.view) {
		getById("main").className = "";
		getById("credits").style.display = 'none';
		try {
			if (session.label === false) {
				if (document.title == "") {
					document.title = "View=" + session.view.toString();
				} else {
					document.title += ", View=" + session.view.toString();
				}
			}
		} catch (e) {
			errorlog(e);
		};
	}

	if ((session.view) && (session.roomid === false)) {
		getById("container-4").className = 'column columnfade';
		getById("container-3").className = 'column columnfade';
		getById("container-2").className = 'column columnfade';
		getById("container-1").className = 'column columnfade';
		//getById("header").className = 'advanced';
		getById("info").className = 'advanced';
		getById("header").className = 'advanced';
		getById("head1").className = 'advanced';
		getById("head2").className = 'advanced';
		getById("head3").className = 'advanced';
		

		getById("mainmenu").style.backgroundRepeat = "no-repeat";
		getById("mainmenu").style.backgroundPosition = "bottom center";
		getById("mainmenu").style.minHeight = "300px";
		getById("mainmenu").style.backgroundSize = "100px 100px";
		getById("mainmenu").innerHTML = '';

		setTimeout(function() {
			try {
				if ((session.view) && (!(session.cleanOutput))) {
					if (document.getElementById("mainmenu")) {
						getById("mainmenu").style.backgroundImage = "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K')";
						getById("mainmenu").innerHTML = '<font style="color:#666"><h1 data-translate="attempting-to-load">Attempting to load video stream.</h1></font>';
						getById("mainmenu").innerHTML += '<font style="color:#EEE" data-translate="stream-not-available-yet">The stream is not available yet or an error occured.</font><br/><button onclick="location.reload();" data-translate="try-manually">Retry Manually</button><br/>';

					}
				}
			} catch (e) {
				errorlog("Error handling QR Code failure");
			}
		}, 15000);

		log("auto playing");
		var SafariVer = safariVersion();
		if ((iPad || iOS) && navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1 && SafariVer > 13) { // Modern iOS doesn't need pop up
			play();
		} else if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) { // Safari on Desktop does require pop up
			if (!(session.cleanOutput)) {
				warnUser("Safari requires us to ask for an audio permission to use peer-to-peer technology. You will need to accept it in a moment if asked to view this live video", 20000);
			}
			navigator.mediaDevices.getUserMedia({
				audio: true
			}).then(function() {
				closeModal();
				play();
			}).catch(function() {
				play();
			});
		} else { // everything else is OK.
			play();
		}
	} else if (session.roomid) {
		try {
			if (session.label === false) {
				if (document.title == "") {
					document.title = "Room=" + session.roomid.toString();
				} else {
					document.title += ": " + session.roomid.toString();
				}
			}
		} catch (e) {
			errorlog(e);
		};

	}
	setTimeout(function(){
		for (var i in delayedStartupFuncs) {
			var cb = delayedStartupFuncs[i];
			log(cb.slice(1));
			cb[0](...cb.slice(1)); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#A_better_apply
		}
		delayedStartupFuncs = [];
	},50);

	if ((session.effects==3) || (session.effects==4) || (session.effects==5)){
		attemptTFLiteJsFileLoad();
	} else if (session.effects==6){
		var script = document.createElement('script');
		var script2 = document.createElement('script');
		var script3 = document.createElement('script');
		var script4 = document.createElement('script');
		model = false;
		script.onload = function() {
			document.head.appendChild(script2);
		}
		script2.onload = function() {
			document.head.appendChild(script3);
		}
		script3.onload = function() {
			document.head.appendChild(script4);
		}
		script4.onload = function() {
			async function loadModel(){
				model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
				
			}
			loadModel();
		}
		script.src = "https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js";
		script2.src = "https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js";
		script3.src = "https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js";
		script4.src = "https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js";
		
		script.type = 'text/javascript';script2.type = 'text/javascript';script3.type = 'text/javascript';script4.type = 'text/javascript';
		document.head.appendChild(script);
	} 

	if (location.protocol !== 'https:') {
		if (!(session.cleanOutput)) {
			warnUser("SSL (https) is not enabled. This site will not work without it!<br /><br /><a href='https://"+window.location.host+window.location.pathname+window.location.search+"'>Try accessing the site from here instead.</a>");
		}
	}
	
	if (session.sensorData) {
		setupSensorData(parseInt(session.sensorData));
	}

	try {
		navigator.mediaDevices.ondevicechange = reconnectDevices;
	} catch (e) {
		errorlog(e);
	}

	if (isIFrame) { // reduce CPU load if not needed.
		window.onmessage = function(e) { // iFRAME support
			log(e);
			try {
				if ("function" in e.data) { // these are calling in-app functions, with perhaps a callback -- TODO: add callbacks
					var ret = null;
					if (e.data.function === "previewWebcam") {
						ret = previewWebcam();
					} else if (e.data.function === "changeHTML") {
						ret = getById(e.data.target);
						ret.innerHTML = e.data.value;
					} else if (e.data.function === "publishScreen") {
						ret = publishScreen();
					} else if (e.data.function === "eval") {
						eval(e.data.value); // eval == evil ; feedback welcomed
					}
				}
			} catch (err) {
				errorlog(err);
			}

			if ("sendChat" in e.data) {
				sendChat(e.data.sendChat); // sends to all peers; more options down the road
			}
			// Chat out gets called via getChatMessage function
			// Related code: parent.postMessage({"chat": {"msg":-----,"type":----,"time":---} }, "*");

			if ("mic" in e.data) { // this should work for the director's mic mute button as well. Needs to be manually enabled the first time still tho.
				if (e.data.mic === true) { // unmute
					session.muted = false; // set
					log(session.muted);
					toggleMute(true); // apply 
				} else if (e.data.mic === false) { // mute
					session.muted = true; // set
					log(session.muted);
					toggleMute(true); // apply
				} else if (e.data.mic === "toggle") { // toggle
					toggleMute();
				}
			}

			if ("camera" in e.data) { // this should work for the director's mic mute button as well. Needs to be manually enabled the first time still tho.
				if (e.data.camera === true) { // unmute
					session.videoMuted = false; // set
					log(session.videoMuted);
					toggleVideoMute(true); // apply 
				} else if (e.data.camera === false) { // mute
					session.videoMuted = true; // set
					log(session.videoMuted);
					toggleVideoMute(true); // apply
				} else if (e.data.camera === "toggle") { // toggle
					toggleVideoMute();
				}
			}
			
			if ("keyframe" in e.data) {
				session.sendKeyFrameScenes();
			}

			if ("mute" in e.data) {
				if (e.data.mute === true) { // unmute
					session.speakerMuted = true; // set
					toggleSpeakerMute(true); // apply 
				} else if (e.data.mute === false) { // mute
					session.speakerMuted = false; // set
					toggleSpeakerMute(true); // apply
				} else if (e.data.mute === "toggle") { // toggle
					toggleSpeakerMute();
				}
			} else if ("speaker" in e.data) { // same thing as mute.
				if (e.data.speaker === true) { // unmute
					session.speakerMuted = false; // set
					toggleSpeakerMute(true); // apply 
				} else if (e.data.speaker === false) { // mute
					session.speakerMuted = true; // set
					toggleSpeakerMute(true); // apply
				} else if (e.data.speaker === "toggle") { // toggle
					toggleSpeakerMute();
				}
			}
			
			if ("record" in e.data) {
				if (e.data.record == false) { // mute
					if ("recording" in session.videoElement) {
						recordLocalVideo("stop");
					}
				} else if (e.data.record  == true){
					if ("recording" in session.videoElement) {
						// already recording
					} else {
						recordLocalVideo("start");
					}
				}
			}


			if ("volume" in e.data) {
				for (var i in session.rpcs) {
					try {
						session.rpcs[i].videoElement.volume = parseFloat(e.data.volume);
					} catch (e) {
						errorlog(e);
					}
				}
			}

			if ("bitrate" in e.data) {
				for (var i in session.rpcs) {
					try {
						session.requestRateLimit(parseInt(e.data.bitrate), i);
					} catch (e) {
						errorlog(e);
					}
				}
			}
			
			if ("audiobitrate" in e.data) {
				for (var i in session.rpcs) {
					try {
						session.requestAudioRateLimit(parseInt(e.data.audiobitrate), i);
					} catch (e) {
						errorlog(e);
					}
				}
			}
			
			if ("changeVideoDevice" in e.data) {
				warnlog(e.data.changeVideoDevice);
				changeVideoDevice(e.data.changeVideoDevice);
			}
			
			if ("changeAudioDevice" in e.data) {
				warnlog(e.data.changeAudioDevice);
				changeAudioDevice(e.data.changeAudioDevice);
			}
			

			if ("sceneState" in e.data) { // TRUE OR FALSE - tells the connected peers if they are live or not via a tally light change.

				if (session.obsState.visibility !== e.data.sceneState) { // only move forward if there is a change; the event likes to double fire you see.
					session.obsStateSync();
				}
			}

			if ("sendMessage" in e.data) { // webrtc send to viewers
				session.sendMessage(e.data);
			}

			if ("sendRequest" in e.data) { // webrtc send to publishers
				session.sendRequest(e.data);
			}

			if ("sendPeers" in e.data) { // webrtc send message to every connected peer; like send and request; a hammer vs a knife.
				session.sendPeers(e.data);
			}

			if ("reload" in e.data) {
				location.reload();
			}

			if ("getStats" in e.data) {

				var stats = {};
				stats.total_outbound_connections = Object.keys(session.pcs).length;
				stats.total_inbound_connections = Object.keys(session.rpcs).length;
				stats.inbound_stats = {};
				for (var i in session.rpcs) {
					stats.inbound_stats[session.rpcs[i].streamID] = session.rpcs[i].stats;
				}

				for (var uuid in session.pcs) {
					setTimeout(function(UUID) {
						session.pcs[UUID].getStats().then(function(stats) {
							stats.forEach(stat => {
								if (stat.type == "outbound-rtp") {
									if (stat.kind == "video") {

										if ("qualityLimitationReason" in stat) {
											session.pcs[UUID].stats.quality_limitation_reason = stat.qualityLimitationReason;
										}
										if ("framesPerSecond" in stat) {
											session.pcs[UUID].stats.resolution = stat.frameWidth + " x " + stat.frameHeight + " @ " + stat.framesPerSecond;
										}
										if ("encoderImplementation" in stat) {
											session.pcs[UUID].stats.encoder = stat.encoderImplementation;
										}
									}
								} else if (stat.type == "remote-candidate") {
									if ("relayProtocol" in stat) {
										if ("ip" in stat) {
											session.pcs[UUID].stats.remote_relay_IP = stat.ip;
										}
										session.pcs[UUID].stats.remote_relayProtocol = stat.relayProtocol;
									}
									if ("candidateType" in stat) {
										session.pcs[UUID].stats.remote_candidateType = stat.candidateType;
									}
								} else if (stat.type == "local-candidate") {
									if ("relayProtocol" in stat) {
										if ("ip" in stat) {
											session.pcs[UUID].stats.local_relayIP = stat.ip;
										}
										session.pcs[UUID].stats.local_relayProtocol = stat.relayProtocol;
									}
									if ("candidateType" in stat) {
										session.pcs[UUID].stats.local_candidateType = stat.candidateType;
									}
								} else if ((stat.type == "candidate-pair" ) && (stat.nominated)) {
									
									if ("availableOutgoingBitrate" in stat){
										session.pcs[UUID].stats.available_outgoing_bitrate_kbps = parseInt(stat.availableOutgoingBitrate/1024);
									}
									if ("totalRoundTripTime" in stat){
										if ("responsesReceived" in stat){
											session.pcs[UUID].stats.average_roundTripTime_ms = parseInt((stat.totalRoundTripTime/stat.responsesReceived)*1000);
										} 
										
									}
								}
								return;
							});
							return;
						});
					}, 0, uuid);
				}
				setTimeout(function() {
					stats.outbound_stats = {};
					for (var i in session.pcs) {
						stats.outbound_stats[i] = session.pcs[i].stats;
					}
					parent.postMessage({
						"stats": stats
					}, "*");
				}, 1000);
			}
			
			if ("getRemoteStats" in e.data) {
				session.sendRequest({"requestStats":true, "remote":session.remote});
			}

			if ("getLoudness" in e.data) {
				log("GOT LOUDNESS REQUEST");
				if (e.data.getLoudness == true) {
					session.pushLoudness = true;
					var loudness = {};
					
					for (var i in session.rpcs) {
						loudness[session.rpcs[i].streamID] = session.rpcs[i].stats.Audio_Loudness;
					}
					
					parent.postMessage({
						"loudness": loudness
					}, "*");
					
				} else {
					session.pushLoudness = false;
				}
			}

			if ("getStreamIDs" in e.data) {
				if (e.data.getStreamIDs == true) {
					var streamIDs = {};
					for (var i in session.rpcs) {
						streamIDs[session.rpcs[i].streamID] = session.rpcs[i].label;
					}
					parent.postMessage({
						"streamIDs": streamIDs
					}, "*");

				}
			}

			if ("close" in e.data) {
				for (var i in session.rpcs) {
					try {
						session.rpcs[i].close();
					} catch (e) {
						errorlog(e);
					}
				}
			}

			if ("style" in e.data) {
				try {
					const style = document.createElement('style');
					style.textContent = e.data.style;
					document.head.append(style);
					log(style);
				} catch (e) {
					errorlog(e);
				}
			}


			if ("automixer" in e.data) {
				if (e.data.automixer == true) {
					session.manual = false;
					try {
						updateMixer();
					} catch (e) {}
				} else if (e.data.automixer == false) {
					session.manual = true;
				}
			}

			if ("target" in e.data) {
				log(e.data);
				for (var i in session.rpcs) {
					try {
						if ("streamID" in session.rpcs[i]) {
							if ((session.rpcs[i].streamID == e.data.target) || (e.data.target == "*")) {
								try {
									if ("settings" in e.data) {
										for (const property in e.data.settings) {
											session.rpcs[i].videoElement[property] = e.data.settings[property];
										}
									}
									if ("add" in e.data) {
										getById("gridlayout").appendChild(session.rpcs[i].videoElement);

									} else if ("remove" in e.data) {
										try {
											session.rpcs[i].videoElement.parentNode.removeChild(session.rpcs[i].videoElement);
										} catch (e) {
											try {
												session.rpcs[i].videoElement.parentNode.parentNode.removeChild(session.rpcs[i].videoElement.parentNode);
											} catch (e) {}
										}
									}
								} catch (e) {
									errorlog(e);
								}
							}
						}
					} catch (e) {
						errorlog(e);
					}
				}
			}
		};
	}

	if (session.midiHotkeys || session.midiOut!==false) {
		
		var script = document.createElement('script');
		script.onload = function() {
			WebMidi.enable(function(err) { // hotkeys

				if (err) {
					errorlog(err);
				}

				WebMidi.addListener("connected", function(e) {
					log(e);
				});

				WebMidi.addListener("disconnected", function(e) {
					log(e);
				});
				
				console.log(WebMidi.inputs);
				
				if (session.midiOut===true){
					for (var i = 0; i < WebMidi.inputs.length; i++) {
						var input = WebMidi.inputs[i];
						
						input.addListener("midimessage", "all", function(e) {
							log(e);
							var msg = {};
							msg.midi = {};
							msg.midi.d = e.data;
							msg.midi.s = e.timestamp;
							msg.midi.t = e.type;
							
							for (var UUID in session.pcs){
								if (session.pcs[UUID].allowMIDI){
									session.sendMessage(msg, UUID);
								}
							}
						});
					}
				} else if (session.midiOut==parseInt(session.midiOut)){
					try{
						var input = WebMidi.inputs[parseInt(session.midiOut)-1];
						input.addListener("midimessage", "all", function(e) {
							log(e);
							var msg = {};
							msg.midi = {};
							msg.midi.d = e.data;
							msg.midi.s = e.timestamp;
							msg.midi.t = e.type;
							
							for (var UUID in session.pcs){
								if (session.pcs[UUID].allowMIDI){
									session.sendMessage(msg, UUID);
								}
							}
						});
					} catch(e){errorlog(e);};
				}
				
				for (var i = 0; i < WebMidi.inputs.length; i++) {
					var input = WebMidi.inputs[i];
					input.addListener('noteon', "all", function(e) {
						log(e);
						if (session.midiHotkeys==1){
							log(e);
							var note = e.note.name + e.note.octave;
							if (note == "G3") {  // open and close the chat window
								toggleChat();
							} else if (note == "A3") { // mute your audio output
								toggleMute();
							} else if (note == "B3") { // mute your video output
								toggleVideoMute();
							} else if (note == "C4") { // enable / disable screenshare
								toggleScreenShare();
							} else if (note == "D4") { // completely kill your connection/session
								hangup();
							} else if (note == "E4") { // raise your hand; director sees this
								raisehand();
							} else if (note == "F4") { // start/stop local recording
								recordLocalVideoToggle();
							} else if (note == "G4") {  // Director Enables their Audio output
								press2talk(true);
							} else if (note == "A4") {  // Director cut's their audio/video output
								hangup2();
							}
						} else if (session.midiHotkeys==2){
							log(e);
							var note = e.note.name + e.note.octave;
							if (note == "G1") {  // open and close the chat window
								toggleChat();
							} else if (note == "A1") { // mute your audio output
								toggleMute();
							} else if (note == "B1") { // mute your video output
								toggleVideoMute();
							} else if (note == "C2") { // enable / disable screenshare
								toggleScreenShare();
							} else if (note == "D2") { // completely kill your connection/session
								hangup();
							} else if (note == "E2") { // raise your hand; director sees this
								raisehand();
							} else if (note == "F2") { // start/stop local recording
								recordLocalVideoToggle();
							} else if (note == "G2") {  // Director Enables their Audio output
								press2talk(true);
							} else if (note == "A2") {  // Director cut's their audio/video output
								hangup2();
							}
						} else if (session.midiHotkeys==3){
							log(e);
							var note = e.note.name + e.note.octave;
							var velocity = e.velocity;
							if (note == "C1"){
								if (velocity == "0") {  // open and close the chat window
									toggleChat();
								} else if (note == "1") { // mute your audio output
									toggleMute();
								} else if (note == "2") { // mute your video output
									toggleVideoMute();
								} else if (note == "3") { // enable / disable screenshare
									toggleScreenShare();
								} else if (note == "4") { // completely kill your connection/session
									hangup();
								} else if (note == "5") { // raise your hand; director sees this
									raisehand();
								} else if (note == "6") { // start/stop local recording
									recordLocalVideoToggle();
								} else if (note == "7") {  // Director Enables their Audio output
									press2talk(true);
								} else if (note == "8") {  // Director cut's their audio/video output
									hangup2();
								}
							}
						}
					});
					input.addListener('controlchange', "all", function(e) {
						
						if (session.midiHotkeys==4){
							/* channel: 1
							controller: {number: 110, name: undefined}
							data: Uint8Array(3) [176, 110, 3]
							target: Input {_userHandlers: {…}, _midiInput: MIDIInput, …}
							timestamp: 98235.34000001382
							type: "controlchange"
							value: 3 */
							log(e);
							if (e.channel!==1){
								errorlog("VDO.Ninja is currently configured for use on channel 1 for MIDI hotkeys");
								return;
							} // channel 1?
							
							var command = e.controller.number;
							var value = e.value;
							
							if (command == 110){
								if (value == 0) {  // open and close the chat window
									toggleChat();
								} else if (value == 1) { // mute your audio output
									toggleMute();
								} else if (value == 2) { // mute your video output
									toggleVideoMute();
								} else if (value == 3) { // enable / disable screenshare
									toggleScreenShare();
								} else if (value == 4) { // completely kill your connection/session
									hangup();
								} else if (value == 5) { // raise your hand; director sees this
									raisehand();
								} else if (value == 6) { // start/stop local recording
									recordLocalVideoToggle();
								} else if (value == 7) {  // Director Enables their Audio output
									press2talk(true);
								} else if (value == 8) {  // Director cut's their audio/video output
									hangup2();
								}
							} else if (command > 110){
								var guestslot = command-111;
								if (value == 0) { 
									var elements = document.querySelectorAll('[data-action-type="forward"][data--u-u-i-d]');
									if (elements[guestslot]) {
										directMigrate(elements[guestslot], true);
									}
								} else if (value == 1) { 
									var elements = document.querySelectorAll('[data-action-type="addToScene"][data--u-u-i-d]');
									if (elements[guestslot]) {
										directEnable(elements[guestslot], true);
									}
								} else if (value == 2) { 
									var elements = document.querySelectorAll('[data-action-type="mute-scene"][data--u-u-i-d]');
									if (elements[guestslot]) {
										directMute(elements[guestslot], true);
									}
								} else if (value == 3) { 
									var elements = document.querySelectorAll('[data-action-type="mute-guest"][data--u-u-i-d]');
									if (elements[guestslot]) {
										remoteMute(elements[guestslot], true);
									}
								}  else if (value == 4) { 
									var elements = document.querySelectorAll('[data-action-type="hangup"][data--u-u-i-d]');
									if (elements[guestslot]) {
										directHangup(elements[guestslot], true);
									}
								} else if (value == 5) { 
									var elements = document.querySelectorAll('[data-action-type="solo-chat"][data--u-u-i-d]');
									if (elements[guestslot]) {
										session.toggleSoloChat(elements[guestslot].dataset.UUID);
									}
								} else if (value == 6) { 
									var elements = document.querySelectorAll('[data-action-type="toggle-remote-speaker"][data--u-u-i-d]');
									if (elements[guestslot]) {
										remoteSpeakerMute(elements[guestslot]);
									}
								} else if (value == 7) { 
									var elements = document.querySelectorAll('[data-action-type="toggle-remote-display"][data--u-u-i-d]');
									if (elements[guestslot]) {
										remoteDisplayMute(elements[guestslot]);
									}
								} else if ((value => 27)) { 
									var elements = document.querySelectorAll('[data-action-type="volume"][data--u-u-i-d]');
									if (elements[guestslot]) {
										elements[guestslot].value = parseInt(value-27);
										remoteVolume(elements[guestslot]);
									}
								}
							}
						}
					});
				}
			});
		};
		script.src = "./thirdparty/webmidi.js"; // dynamically load this only if its needed. Keeps loading time down.
		document.head.appendChild(script);
	} else if (session.midiIn){
		var script = document.createElement('script');
		script.src = "./thirdparty/webmidi.js"; // dynamically load this only if its needed. Keeps loading time down.
		script.onload = function() {
			WebMidi.enable(function(err) { // hotkeys
				if (err) {
					errorlog(err);
				}
				console.log(WebMidi.outputs);

			});
		}
		document.head.appendChild(script);
	}
	

	

	var languages = getById('languagesList').querySelectorAll('li a');
	var timezones = [];

	languages.forEach(language => {
		if (language.dataset.tz) {
			var languageTimezones = language.dataset.tz.split(';'); // each link can have multiple timezones separated by ;
			languageTimezones.forEach(element => {
				timezones.push(element);
			});
		}
	});

	var currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	if (timezones.includes(currentTimezone)) {
		var el = getById('languagesList').querySelector("li a[data-tz*='" + currentTimezone +"']"); // select language li
		el.parentElement.removeChild(el); // remove it
		getById('languagesList').insertBefore(el, getById('languagesList').querySelector('li:nth-child(2)')); // insert it after English
	}

	var visAudioTimeout = null
	document.addEventListener("visibilitychange", function() {
		//log("hidden : " +document.hidden);
		log("vis : "+document.visibilityState);
		if ((iOS) || (iPad)) { // fixes a bug on iOS devices.  Not need with other devices?
			clearTimeout(visAudioTimeout);
			if (document.visibilityState === 'visible') {	
				visAudioTimeout = setTimeout(function() {
					resetupAudioOut();
					activatedPreview=false;
					grabAudio("videosource", "#audioSource3");
				}, 500);
			}
		}
	});

	// Warns user about network going down
	window.addEventListener("offline", function (e) {
		if ((session.view) && (session.permaid === false)) {
			log("VDO.Ninja has no network connectivity and can't work properly." );
		} else if (session.scene !== false) {
			log("VDO.Ninja has no network connectivity and can't work properly." );
		} else if (!session.cleanOutput) {
			warnUser("Network connection lost.");
		} else {
			log("VDO.Ninja has no network connectivity and can't work properly.");
		}
	});

	window.addEventListener("online", function (e) {
		closeModal();
	});

	function updateConnectionStatus() {
		warnlog("Connection type changed from " + session.stats.network_type + " to " + Connection.effectiveType);
		session.stats.network_type = Connection.effectiveType + " / " + Connection.type;
		session.ping();
	}
	try {
		var Connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		session.stats.network_type = Connection.effectiveType + " / " + Connection.type;
		Connection.addEventListener('change', updateConnectionStatus);
	} catch (e) {}

	
	setInterval(function() {
		checkConnection();
	}, 5000);

	// Remove modal if network comes back up
	window.addEventListener("online", function (e) {
		if (!session.cleanOutput) {
			// Remove last inserted modal; Could be improved by tagging the
			// modal elements and only removing modals tagged 'offline'
			userWarnings = document.querySelectorAll('.alertModal');
			closeModal(userWarnings[userWarnings.length- 1]);
		} else {
		  log(
			"Network connectivity has been restored."
		  );
		}
	});

	document.addEventListener("dragstart", event => {
		var url = event.target.href || event.target.value;
		if (!url || !url.startsWith('https://')) return;
		if (event.target.dataset.drag != "1") {
			return;
		}
		//event.target.ondragend = function(){event.target.blur();}

		var streamId = url.split('view=');
		var label = url.split('label=');

		if (session.label !== false) {
			url += '&layer-name=' + session.label;
		} else {
			url += '&layer-name=VDO.Ninja';
		}
		if (streamId.length > 1) url += ': ' + streamId[1].split('&')[0];
		if (label.length > 1) url += ' - ' + decodeURI(label[1].split('&')[0]);

		try {
			if (document.getElementById("videosource")) {
				var video = getById('videosource');
				if (typeof(video.videoWidth) == "undefined") {
					url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
					url += '&layer-height=1080';
				} else if ((parseInt(video.videoWidth) < 360) || (video.videoHeight < 640)) {
					url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
					url += '&layer-height=1080';
				} else {
					url += '&layer-width=' + video.videoWidth; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
					url += '&layer-height=' + video.videoHeight;
				}
			} else {
				url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
				url += '&layer-height=1080';
			}
		} catch (error) {
			url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
			url += '&layer-height=1080';
		}

		event.dataTransfer.setDragImage( getById('dragImage'), 24, 24);
		event.dataTransfer.setData("text/uri-list", encodeURI(url));
		//event.dataTransfer.setData("url", encodeURI(url));

	});

	window.onload = function winonLoad() { // This just keeps people from killing the live stream accidentally. Also give me a headsup that the stream is ending
		window.addEventListener("beforeunload", function(e) {
			try {
				session.ws.close();
				if (session.videoElement.recording) {
					session.videoElement.recorder.writer.close();
					session.videoElement.recording = false;
				}
				for (var i in session.rpcs) {
					if (session.rpcs[i].videoElement) {
						if (session.rpcs[i].videoElement.recording) {
							session.rpcs[i].videoElement.recorder.writer.close();
							session.rpcs[i].videoElement.recording = false;
						}
					}
				}
			} catch (e) {}
			//setTimeout(function(){session.hangup();},0);
			return undefined; // ADDED OCT 29th; get rid of popup. Just close the socket connection if the user is refreshing the page.  It's one or the other.

		});
	};

	var lastTouchEnd = 0;
	document.addEventListener('touchend', function(event) {
		var now = (new Date()).getTime();
		if (now - lastTouchEnd <= 300) {
			event.preventDefault();
		}
		lastTouchEnd = now;
	}, false);


	document.addEventListener('click', function(event) {
		if (session.firstPlayTriggered == false) {
			playAllVideos();
			session.firstPlayTriggered = true;
			history.pushState({}, '');
		}
	});
	
	document.addEventListener("keydown", event => {

		if ((event.ctrlKey) || (event.metaKey)) { // detect if CTRL is pressed
			CtrlPressed = true;
		} else {
			CtrlPressed = false;
		}
		if (event.altKey) {
			AltPressed = true;
		} else {
			AltPressed = false;
		}


		if (CtrlPressed && event.keyCode) {

			if (event.keyCode == 77) { // m
				if (event.metaKey) {
					if (AltPressed) {
						toggleMute(); // macOS
					}
				} else {
					toggleMute(); // Windows
				}
				// } else if (event.keyCode == 69) { // e 
				//	hangup();
			} else if (event.keyCode == 66) { // b
				toggleVideoMute();
			}
		}


	});

	document.addEventListener("keyup", event => {
		if (!((event.ctrlKey) || (event.metaKey))) {
			if (CtrlPressed) {
				CtrlPressed = false;
				for (var i in Callbacks) {
					var cb = Callbacks[i];
					log(cb.slice(1));
					cb[0](...cb.slice(1)); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#A_better_apply
				}
				Callbacks = [];
			}
		}
		if (!(event.altKey)) {
			AltPressed = false;
		}
	});
}

main(); // asyncronous load

setTimeout(function(){ // lazy load
	var script = document.createElement('script');
	document.head.appendChild(script);
	script.onload = function() { 
		var script = document.createElement('script');
		document.head.appendChild(script);
		script.src = "./thirdparty/StreamSaver.js"; // dynamically load this only if its needed. Keeps loading time down.
	};
	script.src = "./thirdparty/polyfill.min.js"; // dynamically load this only if its needed. Keeps loading time down.
},0);