/*
*  Copyright (c) 2020 Steve Seguin. All Rights Reserved.
*
*  Use of this source code is governed by the APGLv3 open-source license
*  that can be found in the LICENSE file in the root of the source
*  tree. Alternative licencing options can be made available on request.
*
*/

/*jshint esversion: 6 */


var formSubmitting = true;
var activatedPreview = false;

function getById(id) {
   var el = document.getElementById(id);
   if (!el) {
	    warnlog(id + " is not defined; skipping.");
		el = document.createElement("span"); // create a fake element
   }
   return el;
}

function changeParam(url,paramName,paramValue){
	var qind = url.indexOf('?');
	var params = url.substring(qind).split('&');
	var query = '';
	for(var i=0;i<params.length;i++) {
		var tokens = params[i].split('=');
		var name = tokens[0];
		if (tokens.length > 1 && tokens[1] !== ''){
			var value = tokens[1];
		} else{
			value = "";
		}
		if (name == paramName) {
			value = paramValue;
		}
		if (value!==""){
			value =  '=' + value;
		} 
		
		if(query == '') {
			query = name + value;
		} else {
			query = query + '&' + name + value;
		}
	}
	return url.substring(0,qind) + query;
}

function updateURL(param, force=false) {
	var para = param.split('='); 
	if (!(urlParams.has(para[0]))){
		if (history.pushState){
			
			var arr = window.location.href.split('?');
			var newurl;
			if (arr.length > 1 && arr[1] !== '') {
				newurl = window.location.href + '&' +param;
			} else {
				newurl = window.location.href + '?' +param;
			}
			
			window.history.pushState({path:newurl},'',newurl);
		}
	} else if (force){
		if (history.pushState){
			var href = new URL(window.location.href);
			if (para.length==1){
				href = changeParam(window.location.href,para[0],"")
			} else {
				href = changeParam(window.location.href,para[0],para[1]);
			}
			log(href.toString());
			window.history.pushState({path:href.toString()},'',href.toString());
		}
	}

	if (session.sticky){
		setCookie("settings", encodeURI(window.location.href), 90);
	}
}

(function (w) {
    w.URLSearchParams = w.URLSearchParams || function (searchString) {
        var self = this;
        self.searchString = searchString;
        self.get = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(self.searchString);
            if (results == null) {
                return null;
            }
            else {
                return decodeURI(results[1]) || 0;
            }
        };
    };

})(window);
var urlParams = new URLSearchParams(window.location.search);

sanitizeStreamID = function(streamID){
	streamID = streamID.trim();
	
	if (streamID.length < 1){
		streamID = session.generateStreamID(8);
		if (!(session.cleanOutput)){
			alert("No streamID was provided; one will be generated randomily.\n\nStream ID: "+streamID);
		}
	}
	var streamID_sanitized = streamID.replace(/[\W]+/g,"_");
	if (streamID !== streamID_sanitized){
		if (!(session.cleanOutput)){
			alert("Info: Only AlphaNumeric characters should be used for the stream ID.\n\nThe offending characters have been replaced by an underscore");
		}
	}
	if  (streamID_sanitized.length > 24){
		streamID_sanitized = streamID_sanitized.substring(0, 24);
		if (!(session.cleanOutput)){
			alert("The Stream ID should be less than 25 alPhaNuMeric characters long.\n\nWe will trim it to length.");
		}
	}
	return streamID_sanitized;
};
	
sanitizeRoomName = function(roomid){
	roomid = roomid.trim();
	if (roomid===""){return roomid;}
	else if (roomid===false){return roomid;}
	
	var santized = roomid.replace(/[\W]+/g,"_");
	if (santized!==roomid){
		if (!(session.cleanOutput)){
			alert("Info: Only AlphaNumeric characters should be used for the room name.\n\nThe offending characters have been replaced by an underscore");
		}
	}
	if (santized.length > 30){
		santized = santized.substring(0, 30);
		if (!(session.cleanOutput)){
			alert("The Room name should be less than 31 alPhaNuMeric characters long.\n\nWe will trim it to length.");
		}
	} 
	return santized;
};

sanitizePassword = function(passwrd){
	if (passwrd===""){return passwrd;}
	else if (passwrd===false){return passwrd;}
	
	passwrd = passwrd.trim();
	if (passwrd.length < 1){
		if (!(session.cleanOutput)){
			alert("The password provided was blank.");
		}
	}
	var santized = passwrd.replace(/[\W]+/g,"_");
	if (santized!==passwrd){
		if (!(session.cleanOutput)){
			alert("Info: Only AlphaNumeric characters should be used in the password.\n\nThe offending characters have been replaced by an underscore");
		}
	}
	return santized;
};


if (window.obsstudio){
	session.obsfix=15; // can be manually set via URL.  ; VP8=15, VP9=30. (previous was 20.)
	try{
		log("OBS VERSION:"+window.obsstudio.pluginVersion);
		log("macOS: "+navigator.userAgent.indexOf('Mac OS X') != -1);
		log(window.obsstudio);
		
		if (!(urlParams.has('streamlabs'))){
			
			var ver1 = window.obsstudio.pluginVersion;
			ver1 = ver1.split(".");
			updateURL("streamlabs");
			if (ver1.length == 3){ // Should be 3, but disabled3
				if ((ver1.length == 3) && (parseInt(ver1[0])==2) && (parseInt(ver1[1])>4) && (navigator.userAgent.indexOf('Mac OS X') != -1)){
					getById("main").innerHTML = "<div style='background-color:black;color:white;' data-translate='obs-macos-not-supported'><h1>On macOS, Please use the <a href='https://github.com/steveseguin/electroncapture'>Electron Capture app</a>, or OBS v23, as newer versions of OBS are not supported currently on macOS.</h1>\
					<br /><h2> You can find details <u><a href='https://github.com/steveseguin/obsninja/wiki/FAQ#mac-os'>within our wiki guide - https://github.com/steveseguin/obsninja/wiki/FAQ#mac-os</a></u></h2>\
					<br /> If using OBS v23 or Streamlabs, you can bypass this error message by refreshing, <a href='"+ window.location.href +"'> Clicking Here,</a> or by adding <i>&streamlabs</i> to the URL.\
					<br /> Please report this problem to steve@seguin.email if you feel it is an error.\
					</div>";
				}
			}
		}
	} catch(e){errorlog(e);}
	
	window.addEventListener('obsSceneChanged', function(event){
		log("OBS EVENT");
		log(event.detail.name);
		
		window.obsstudio.getCurrentScene(function(scene) {
			log("OBS SCENE");
			log(scene);
		});
		
		window.obsstudio.getStatus(function (status) {
			log("OBS STATUS:");
			log(status);
		});
	});
	
}

window.onload = function() { // This just keeps people from killing the live stream accidentally. Also give me a headsup that the stream is ending
	window.addEventListener("beforeunload", function (e) {
		session.ws.close();
		session.hangup();
		return undefined; // ADDED OCT 29th; get rid of popup. Just close the socket connection if the user is refreshing the page.  It's one or the other.
		///
		
		// if (formSubmitting) {
			// return undefined;
		// }
		// var confirmationMessage = 'Leaving the page now will terminate your stream ';
		// (e || window.event).returnValue = confirmationMessage; //Gecko + IE
		// getById("main").innerHTML = "SFSDFSDF";
		// return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
	});
};

getById("credits").innerHTML = "Version: "+session.version+" - "+getById("credits").innerHTML;

var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
	var now = (new Date()).getTime();
	if (now - lastTouchEnd <= 300) {
		event.preventDefault();
	}
	lastTouchEnd = now;
}, false);

var interacted=false;
document.addEventListener('click', function (event) {
	if (interacted==false){
		interacted=true;
		history.pushState({}, '');
	}
});
var Callbacks = [];
var CtrlPressed = false; // global
var AltPressed = false; 
document.addEventListener("keydown", event => { 

	if ((event.ctrlKey) || (event.metaKey) ){  // detect if CTRL is pressed
		CtrlPressed = true;
	} else {
		CtrlPressed = false;
	}
	if (event.altKey){
		AltPressed = true;
	} else {
		AltPressed = false;
	}
	
	
	if (CtrlPressed && event.keyCode){
	
	  if (event.keyCode == 77) {  // m
	    if (event.metaKey){ 
			if (AltPressed){
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
	if (!((event.ctrlKey) || (event.metaKey))){ 
		if (CtrlPressed){
			CtrlPressed = false;
			for (var i in Callbacks){
				var cb = Callbacks[i];
				log(cb.slice(1));
				cb[0](...cb.slice(1)); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#A_better_apply
			}
			Callbacks=[];
		}
	}
	if (!(event.altKey)){
		AltPressed = false;
	}
});

window.onpopstate = function() {
	if (interacted){
		window.location.reload(true);
	}
}; 

if (typeof session === 'undefined') { // make sure to init the WebRTC if not exists.
	var session = WebRTC.Media;
	session.streamID = session.generateStreamID();
	errorlog("Serious error: WebRTC session didn't load in time");
}




function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

if (getCookie("redirect") == "yes"){
	setCookie("redirect", "", 0);
	session.sticky = true;
} else if (getCookie("settings") != ""){
	session.sticky = confirm("Would you like you load your previous session's settings?");
	if (!session.sticky){
		setCookie("settings", "", 0);
		log("deleting cookie as user said no");
	} else {
		var cookieSettings = decodeURI(getCookie("settings"));
		setCookie("redirect", "yes", 1);
		window.location.replace(cookieSettings);
	}
}
if (urlParams.has('sticky')){
	if (getCookie("permission")==""){
		session.sticky = confirm("Would you allow us to store a cookie to keep your session settings persistent?");
	} else {
		session.sticky = true;
	}
	if (session.sticky){
		setCookie("permission", "yes", 999);
		setCookie("settings", encodeURI(window.location.href), 90);
	}
}


if (urlParams.has('retrytimeout')){
	session.retryTimeout = parseInt(urlParams.get('retrytimeout'));
}

if (urlParams.has('nosettings')){
	session.showSettings = false;
}

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	//session.webcamonly = true;
	getById("shareScreenGear").style.display="none";
	getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
} else if ((iOS) || (iPad)){
	getById("shareScreenGear").style.display="none";
	getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
}

if (urlParams.has('webcam') || urlParams.has('wc')){
	session.webcamonly = true;
} else if (urlParams.has('screenshare') || urlParams.has('ss')){
	session.screenshare = true;
} else if (urlParams.has('fileshare') || urlParams.has('fs')){
	getById("container-5").classList.remove('advanced');
	getById("container-3").className = 'column columnfade advanced'; // Hide screen share on mobile
	getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
	getById("container-5").classList.add("skip-animation");
	getById("container-5").classList.remove('pointer');
}

if (urlParams.has('mute') || urlParams.has('muted')){
	session.muted = true;
}

if (session.screenshare==true){
	getById("container-3").className = 'column columnfade advanced'; // Hide screen share on mobile
	getById("container-2").classList.add("skip-animation");
	getById("container-2").classList.remove('pointer');
}

if (session.webcamonly==true){
	getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
	//getById("shareScreenGear").style.display="none"; // removed based on fluffy's feedback
	getById("container-3").classList.add("skip-animation");
	getById("container-3").classList.remove('pointer');
	setTimeout(function(){previewWebcam();},10);
}

getById("main").classList.remove('hidden');

if (urlParams.has('password')){
	session.password = urlParams.get('password');
	if (session.password.length==0){
		session.password = prompt("Please enter the password below: \n\n(Note: Passwords are case-sensitive and you will not be alerted if it is incorrect.)");
	} else if (session.password==="false"){
		session.password=false;
		session.defaultPassword=false;
	} else if (session.password==="0"){
		session.password=false;
		session.defaultPassword=false;
	} else if (session.password==="off"){
		session.password=false;
		session.defaultPassword=false;
	}
}

if (session.password){
	session.password = sanitizePassword(session.password);
	getById("passwordRoom").value = session.password;
	session.defaultPassword = false;
}

if (urlParams.has('hash') || urlParams.has('crc') || urlParams.has('check')){  // could be brute forced in theory, so not as safe as just not using a hash check.
	var hash_input = urlParams.get('hash') || urlParams.get('crc') || urlParams.get('check');
	if (session.password===false){
		session.password = prompt("Please enter the password below: \n\n(Note: Passwords are case-sensitive and you will not be alerted if it is incorrect.)");
		session.password = sanitizePassword(session.password);
		getById("passwordRoom").value = session.password;
		session.defaultPassword = false;
	} 
	
	session.generateHash(session.password+session.salt,6).then(function(hash){ // million to one error. 
		log("hash is "+hash);
		if (hash.substring(0, 4) !== hash_input){ // hash crc checks are just first 4 characters.
			if (!(session.cleanOutput)){
				alert("The password was incorrect.\n\nRefresh and try again.");
			}
		} else {
			session.hash = hash;
		}
	});
}

if (session.defaultPassword!==false){
	session.password = session.defaultPassword; // no user entered password; let's use the default password if its not disabled.
}


if (urlParams.has('label')){
	session.label = decodeURIComponent(urlParams.get('label'));
	
	if (session.label.length==0){
		session.label = prompt("Please enter your display name:");
	}
	
	session.label = session.label.replace(/[\W]+/g,"_").replace(/_+/g, '_'); // but not what others might get.
	document.title=session.label.replace(/_/g, ' '); // what the result is.
	
	updateURL("label="+session.label, true);
}

if (urlParams.has('transparent')){ // sets the window to be transparent - useful for IFRAMES?
	getById("main").style.backgroundColor = "rgba(0,0,0,0)";
}

if (urlParams.has('stereo') || urlParams.has('s') || urlParams.has('proaudio')){ // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
	log("STEREO ENABLED");
	session.stereo = urlParams.get('stereo') || urlParams.get('s') || urlParams.get('proaudio');
	
	if (session.stereo){
		session.stereo = session.stereo.toLowerCase();
	}
	
	if (session.stereo==="false"){
		session.stereo = 0;
	} else if (session.stereo==="0"){
		session.stereo = 0;
	} else if (session.stereo==="no"){
		session.stereo = 0;
	} else if (session.stereo==="off"){
		session.stereo = 0;
	} else if (session.stereo==="1"){
		session.stereo = 1;
	} else if (session.stereo==="both"){
		session.stereo = 1;
	} else if (session.stereo==="3"){
		session.stereo = 3;
	} else if (session.stereo==="out"){
		session.stereo = 3;
	} else if (session.stereo==="4"){
		session.stereo = 4;
	} else if (session.stereo==="2"){  
		session.stereo = 2;
	} else if (session.stereo==="in"){  
		session.stereo = 2;
	} else {
		session.stereo = 5; // guests; no stereo in, no high bitrate in, but otherwise like stereo=1
	}
}
if ((session.stereo==1) || (session.stereo==3) || (session.stereo==4) || (session.stereo==5)){
	session.echoCancellation = false;
	session.autoGainControl = false;
	session.noiseSuppression = false;
}
if ((iOS) || (iPad)){
	session.audiobitrate = false; // iOS devices seem to get distortion with custom audio bitrates.  Disable for now.
	session.maxiosbitrate = 10; // this is 10-kbps by default already.
}



if (urlParams.has("aec") || urlParams.has("ec")){
	
	session.echoCancellation = urlParams.get('aec') || urlParams.get('ec');
	
	if (session.echoCancellation){
		session.echoCancellation = session.echoCancellation.toLowerCase();
	}
	if (session.echoCancellation=="false"){
		session.echoCancellation = false;
	} else if (session.echoCancellation=="0"){
		session.echoCancellation = false;
	} else if (session.echoCancellation=="no"){
		session.echoCancellation = false;
	} else if (session.echoCancellation=="off"){
		session.echoCancellation = false;
	} else {
		session.echoCancellation = true;
	}
}


if (urlParams.has("autogain") || urlParams.has("ag")){
	
	session.autoGainControl = urlParams.get('autogain') || urlParams.get('ag');
	if (session.autoGainControl){
		session.autoGainControl = session.autoGainControl.toLowerCase();
	}
	if (session.autoGainControl=="false"){
		session.autoGainControl = false;
	} else if (session.autoGainControl=="0"){
		session.autoGainControl = false;
	} else if (session.autoGainControl=="no"){
		session.autoGainControl = false;
	} else if (session.autoGainControl=="off"){
		session.autoGainControl = false;
	} else {
		session.autoGainControl = true;
	}
}

if (urlParams.has("denoise") || urlParams.has("dn")){
	
	session.noiseSuppression = urlParams.get('denoise') || urlParams.get('dn');
	
	if (session.noiseSuppression){
		session.noiseSuppression = session.noiseSuppression.toLowerCase();
	}
	if (session.noiseSuppression=="false"){
		session.noiseSuppression = false;
	} else if (session.noiseSuppression=="0"){
		session.noiseSuppression = false;
	} else if (session.noiseSuppression=="no"){
		session.noiseSuppression = false;
	} else if (session.noiseSuppression=="off"){
		session.noiseSuppression = false;
	} else {
		session.noiseSuppression = true;
	}
}


if (urlParams.has('roombitrate') || urlParams.has('roomvideobitrate') || urlParams.has('rbr')){ 
	log("Room BITRATE SET");
	session.roombitrate = urlParams.get('roombitrate') || urlParams.get('rbr') || urlParams.get('roomvideobitrate');
	session.roombitrate = parseInt(session.roombitrate);
	if (session.roombitrate<1){
		session.roombitrate=0;
	}
}


if (urlParams.has('audiobitrate') || urlParams.has('ab')){ // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
	log("AUDIO BITRATE SET");
	session.audiobitrate = urlParams.get('audiobitrate') || urlParams.get('ab');
	session.audiobitrate = parseInt(session.audiobitrate);
	if (session.audiobitrate<1){
		session.audiobitrate=false;
	} else if (session.audiobitrate>510){
		session.audiobitrate=510;
	} // this is to just prevent abuse
}
if ((iOS) || (iPad)){
	session.audiobitrate = false; // iOS devices seem to get distortion with custom audio bitrates.  Disable for now.
}
			

if (urlParams.has('streamid') || urlParams.has('view') || urlParams.has('v') || urlParams.has('pull')){  // the streams we want to view; if set, but let blank, we will request no streams to watch.  
	session.view = urlParams.get('streamid') || urlParams.get('view') || urlParams.get('v') || urlParams.get('pull'); // this value can be comma seperated for multiple streams to pull
	
	getById("headphonesDiv2").style.display="inline-block";
	getById("headphonesDiv").style.display="inline-block";
	
	if (session.view==null){
		session.view="";
	}
	if (session.view){
		if (session.view.split(",").length>1){
			session.view_set = session.view.split(",");
		} 
	}
	
}

if (urlParams.has('nopreview')){
	log("preview OFF");
    session.nopreview = true;
}

if (urlParams.has('obsfix')){
	session.obsfix = urlParams.get('obsfix');
	if (session.obsfix){
		session.obsfix = session.obsfix.toLowerCase();
	}
	if (session.obsfix=="false"){
		session.obsfix = false;
	} else if (session.obsfix=="0"){
		session.obsfix = false;
	} else if (session.obsfix=="no"){
		session.obsfix = false;
	} else if (session.obsfix=="off"){
		session.obsfix = false;
	} else if (parseInt(session.obsfix)>0){
		session.obsfix = parseInt(session.obsfix);
	} else {
		session.obsfix = 1; // aggressive.
	}
}

if (urlParams.has('remote') || urlParams.has('rem')){
	log("remote ENABLED");
	session.remote = urlParams.get('remote') || urlParams.get('rem');
    session.remote =  session.remote.trim();
}


if (urlParams.has('keyframeinterval') || urlParams.has('keyframerate') || urlParams.has('keyframe') ||urlParams.has('fki')){
	log("keyframerate ENABLED");
	session.keyframerate = parseInt(urlParams.get('keyframeinterval') || urlParams.get('keyframerate') || urlParams.get('keyframe') || urlParams.get('fki'));
}

if (urlParams.has('optimize')){
	session.optimize = true;
}

if (urlParams.has('obsoff') || urlParams.has('oo')){
	log("OBS feedback disabled");
    session.disableOBS = true;
}


if (urlParams.has('chroma')){
	log("Chroma ENABLED");
	getById("main").style.backgroundColor = "#"+(urlParams.get('chroma') || "000");
}

if (urlParams.has("videodevice") || urlParams.has("vdevice")  || urlParams.has("vd")  || urlParams.has("device")  || urlParams.has("d")){
	
	session.videoDevice = urlParams.get("videodevice") || urlParams.get("vdevice")  || urlParams.get("vd")  || urlParams.get("device")  || urlParams.get("d");
	
	if (session.videoDevice){
		session.videoDevice = session.videoDevice.toLowerCase().replace(/[\W]+/g,"_");
	}
	if (session.videoDevice=="false"){
		session.videoDevice = 0;
	} else if (session.videoDevice=="0"){
		session.videoDevice = 0;
	} else if (session.videoDevice=="no"){
		session.videoDevice = 0;
	} else if (session.videoDevice=="off"){
		session.videoDevice = 0;
	} else if (session.videoDevice=="snapcam"){
		session.videoDevice = "snap_camera";
	} else if (session.videoDevice=="canon"){
		session.videoDevice = "eos";
	} else if (session.videoDevice=="camlink"){
		session.videoDevice = "cam_link";
	} else if (session.videoDevice=="ndi"){
		session.videoDevice = "newtek_ndi_video";
	} else if (session.videoDevice==""){
		session.videoDevice = 1;
	} else if (session.videoDevice=="1"){
		session.videoDevice = 1;
	} else if (session.videoDevice=="default"){
		session.videoDevice = 1;
	} else {
		// whatever the user entered I guess
	}
	
	if (session.videoDevice === 0){
		getById("add_camera").innerHTML = "Share your Microphone";
	}
	
	getById("videoMenu").style.display="none";
	log("session.videoDevice:"+session.videoDevice);
}

// audioDevice
if (urlParams.has("audiodevice") || urlParams.has("adevice")  || urlParams.has("ad")  || urlParams.has("device")  || urlParams.has("d")){
	
	session.audioDevice = urlParams.get("audiodevice") || urlParams.get("adevice")  || urlParams.get("ad")  || urlParams.get("device")  || urlParams.get("d");
	
	if (session.audioDevice){
		session.audioDevice = session.audioDevice.toLowerCase().replace(/[\W]+/g,"_");
	}
	if (session.audioDevice=="false"){
		session.audioDevice = 0;
	} else if (session.audioDevice=="0"){
		session.audioDevice = 0;
	} else if (session.audioDevice=="no"){
		session.audioDevice = 0;
	} else if (session.audioDevice=="off"){
		session.audioDevice = 0;
	} else if (session.audioDevice==""){
		session.audioDevice = 1;
	} else if (session.audioDevice=="1"){
		session.audioDevice = 1;
	} else if (session.audioDevice=="default"){
		session.audioDevice = 1;
	} else if (session.audioDevice=="ndi"){
		session.audioDevice="line_newtek_ndi_audio";
	} else {
		// whatever the user entered I guess
	}
	
	log("session.audioDevice:" + session.audioDevice);
	
	getById("audioMenu").style.display="none";
	getById("headphonesDiv").style.display="none";
	getById("headphonesDiv2").style.display="none";
	getById("audioScreenShare1").style.display="none";	
	
}


if (urlParams.has("autojoin") || urlParams.has("autostart") || urlParams.has("aj") || urlParams.has("as")){
	session.autostart = true;
}


if (urlParams.has('novideo') || urlParams.has('nv') || urlParams.has('hidevideo') || urlParams.has('showonly') ){
	
	session.novideo = urlParams.get('novideo') || urlParams.get('nv') || urlParams.get('hidevideo') || urlParams.get('showonly');
	
	if (!(session.novideo)){
		session.novideo=[];
	} else {
		session.novideo = session.novideo.split(",");
	}
	log("disable video playback");
	log(session.novideo);
}

if (urlParams.has('noaudio') || urlParams.has('na') || urlParams.has('hideaudio') ){
	
	session.noaudio = urlParams.get('noaudio') || urlParams.get('na') || urlParams.get('hideaudio') ;
	
	if (!(session.noaudio)){
		session.noaudio=[];
	} else {
		session.noaudio = session.noaudio.split(",");
	}
	log("disable audio playback");
}

if (urlParams.has('forceios')){
	log("allow iOS to work in video group chat; for this user at least");
    session.forceios = true;
}

if (urlParams.has('nocursor')){
	session.nocursor = true;
	log("DISABLE CURSOR");
	var style = document.createElement('style');
	style.innerHTML = `
	video {
		margin: 0;
		padding: 0;
		overflow: hidden;
		cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=), none;
		user-select: none;
	}
	`;
	document.head.appendChild(style);
}

if (urlParams.has('vbr')){
	session.cbr = 0;
} 
 

if (urlParams.has('minptime')){
	session.minptime =  parseInt(urlParams.get('minptime')) || 10;
	if (session.minptime<10){session.minptime=10;}
}

if (urlParams.has('maxptime')){
	session.maxptime = parseInt(urlParams.get('maxptime')) || 30;
	if (session.maxptime<session.minptime){session.maxptime=session.minptime;}
}


if (urlParams.has('codec')){
	log("CODEC CHANGED");
    session.codec = urlParams.get('codec').toLowerCase();
} //else if (window.obsstudio){
	//if (session.obsfix===false){
	//	session.codec = "h264"; // H264 --- It's too laggy!!! FUCKEEEEEEE
	//}
//}

if (urlParams.has('scale')){
	log("Resolution scale requested");
    session.scale = urlParams.get('scale');
}

var ConfigSettings = getById("main-js");
var ln_template = false;

try {
	if (ConfigSettings){
		ln_template = ConfigSettings.getAttribute('data-translation');   // Translations
		if (typeof ln_template === "undefined" ) {
		   ln_template = false;
		} else if (ln_template === null ) {
		   ln_template = false;
		}
	}

	if (urlParams.has('ln')){
		ln_template = urlParams.get('ln');
	} 
} catch (e){errorlog(e);}

if (ln_template){  // checking if manual lanuage override enabled
	try {
		log("Template: "+ln_template);
		fetch("./translations/"+ln_template+'.json').then(function(response){
			if (response.status !== 200) {
				log('Looks like there was a problem. Status Code: ' +
				response.status);
				return;
			}
			response.json().then(function(data) {
				log(data);
				document.querySelectorAll('[data-translate]').forEach(function(ele){
					//log(ele.dataset.translate);
					//log(translations[ele.dataset.translate]);
					if (ele.dataset.translate in data){
						ele.innerHTML = data[ele.dataset.translate];
					}
				});
				getById("mainmenu").style.opacity = 1;
			}).catch(function(err){
				errorlog(err);
				getById("mainmenu").style.opacity = 1;
			});
		}).catch(function(err){
			errorlog(err);
			getById("mainmenu").style.opacity = 1;
		});
	
	} catch (error){
		errorlog(error);
		getById("mainmenu").style.opacity = 1;
	}
	if (location.hostname !== "obs.ninja"){
		if (session.label===false){
			document.title = location.hostname;
		}
		getById("qos").innerHTML = location.hostname;
		getById("logoname").innerHTML = getById("qos").outerHTML;
		getById("helpbutton").style.display = "none";
	}
} else if (location.hostname === "rtc.ninja"){
	try{
		if (session.label===false){
			document.title = "";
		}
		getById("qos").innerHTML = "";
		getById("logoname").innerHTML = "";
		getById("helpbutton").style.display = "none";
		getById("helpbutton").style.opacity = 0;
		getById("mainmenu").style.opacity = 1;
		getById("mainmenu").style.margin = "30px 0";
		getById("translateButton").style.display = "none";
		getById("translateButton").style.opacity = 0;
		getById("info").style.display = "none";
		getById("info").style.opacity = 0;
		getById("chatBody").innerHTML = "";
		
	} catch(e){}
} else if (location.hostname !== "obs.ninja"){
	try {
		fetch("./translations/blank.json").then(function(response){
			if (response.status !== 200) {
				log('Looks like there was a problem. Status Code: ' +
				response.status);
				return;
			}
			response.json().then(function(data) {
				log(data);
				document.querySelectorAll('[data-translate]').forEach(function(ele){
					//log(ele.dataset.translate);
					//log(translations[ele.dataset.translate]);
					if (ele.dataset.translate in data){
						ele.innerHTML = data[ele.dataset.translate];
					}
				});
				if (session.label===false){
					document.title = location.hostname;
				}
				getById("qos").innerHTML = location.hostname;
				getById("logoname").innerHTML = getById("qos").outerHTML ;
				getById("helpbutton").style.display = "none";
				getById("mainmenu").style.opacity = 1;
			}).catch(function(err){
				errorlog(err);
				getById("mainmenu").style.opacity = 1;
			});
		}).catch(function(err){
			errorlog(err);
			getById("mainmenu").style.opacity = 1;
		});
		if (session.label===false){
			document.title = location.hostname;
		}
		getById("qos").innerHTML = location.hostname;
		getById("logoname").innerHTML = getById("qos").outerHTML;
		getById("helpbutton").style.display = "none";
		getById("chatBody").innerHTML = "";
	} catch (error){
		errorlog(error);
	}
} else {  // check if automatic language translation is available
	getById("mainmenu").style.opacity = 1;
}

function changeLg(lang){
		fetch("./translations/"+lang+'.json').then(function(response){
			if (response.status !== 200) {
				logerror('Language translation file not found.' + response.status);
				return;
			}
			response.json().then(function(data) {
				log(data);
				document.querySelectorAll('[data-translate]').forEach(function(ele){
					//log(ele.dataset.translate);
					//log(translations[ele.dataset.translate]);
					try {
						if (ele.dataset.translate in data){
							ele.innerHTML = data[ele.dataset.translate];
						}
					} catch (e){
						errorlog(e);
					}
				});
			});
		}).catch(function(err){
			errorlog(err);
		});
}

if (urlParams.has('videobitrate') || urlParams.has('bitrate') || urlParams.has('vb')){
	session.bitrate = urlParams.get('videobitrate') || urlParams.get('bitrate') || urlParams.get('vb');
	if (session.bitrate){
		if ((session.view_set) && (session.bitrate.split(",").length>1)){
			session.bitrate_set = session.bitrate.split(",");
			session.bitrate = parseInt(session.bitrate_set[0]);
		} else {
			session.bitrate = parseInt(session.bitrate);
		}
		if (session.bitrate<1){session.bitrate=false;}
		log("BITRATE ENABLED");
		log(session.bitrate);
		
	}
}

if (urlParams.has('maxvideobitrate') || urlParams.has('maxbitrate') || urlParams.has('mvb')){
	session.maxvideobitrate = urlParams.get('maxvideobitrate') || urlParams.get('maxbitrate') || urlParams.get('mvb');
    session.maxvideobitrate = parseInt(session.maxvideobitrate);
	
	if (session.maxvideobitrate<1){session.maxvideobitrate=false;}
	log("maxvideobitrate ENABLED");
	log(session.maxvideobitrate);
} 

if (urlParams.has('totalroombitrate') || urlParams.has('totalroomvideobitrate')|| urlParams.has('trb')){
	session.totalRoomBitrate = urlParams.get('totalroombitrate') || urlParams.get('totalroomvideobitrate') || urlParams.get('trb');
    session.totalRoomBitrate = parseInt(session.totalRoomBitrate);
	
	if (session.totalRoomBitrate<1){session.totalRoomBitrate=false;}
	log("totalRoomBitrate ENABLED");
	log(session.totalRoomBitrate);
} 


if (urlParams.has('height') || urlParams.has('h')){
	session.height = urlParams.get('height') || urlParams.get('h');
	session.height = parseInt(session.height);
}

if (urlParams.has('width') || urlParams.has('w')){
	session.width = urlParams.get('width') || urlParams.get('w');
	session.width = parseInt(session.width);
}

if (urlParams.has('quality') || urlParams.has('q')){
	try{
		session.quality = urlParams.get('quality') || urlParams.get('q');
		session.quality = parseInt(session.quality);
		getById("gear_screen").parentNode.removeChild(getById("gear_screen"));
		getById("gear_webcam").parentNode.removeChild(getById("gear_webcam"));
	} catch(e){
		errorlog(e);
	}
}

if (urlParams.has('sink')){
	session.sink = urlParams.get('sink');
}

if (urlParams.has('fullscreen')){
	session.fullscreen=true;
}
if (urlParams.has('stats')){
	session.statsMenu=true;
}


if (urlParams.has('cleanoutput') || urlParams.has('clean')){
	session.cleanOutput = true;
	getById("translateButton").style.display="none";
	getById("credits").style.display="none";
	getById("header").style.display="none";
	var style = document.createElement('style');
	style.innerHTML = `
	video {
		background-image: none;
	}
	`;
	document.head.appendChild(style);
	
}

if (urlParams.has('channels')){ // must be loaded before channelOffset
    session.audioChannels = parseInt(urlParams.get('channels'));
	session.offsetChannel = 0;
	log("max channels is 32; channels offset");
	session.audioEffects=true;  
}
if (urlParams.has('channeloffset')){
    session.offsetChannel = parseInt(urlParams.get('channeloffset'));
	log("max channels is 32; channels offset");
	session.audioEffects=true;
}


if (urlParams.has('maxviewers') || urlParams.has('mv') ){
	
	session.maxviewers = urlParams.get('maxviewers') || urlParams.get('mv');
	if (session.maxviewers.length==0){
		session.maxviewers = 1;
	} else {
		session.maxviewers = parseInt(session.maxviewers);
	}
	log("maxviewers set");
}

if (urlParams.has('maxpublishers') || urlParams.has('mp') ){
	
	session.maxpublishers = urlParams.get('maxpublishers') || urlParams.get('mp');
	if (session.maxpublishers.length==0){
		session.maxpublishers = 1;
	} else {
		session.maxpublishers = parseInt(session.maxpublishers);
	}
	log("maxpublishers set");
}

if (urlParams.has('secure')){
	session.security = true;
	if (!(session.cleanOutput)){
		setTimeout(function() {alert("Enhanced Security Mode Enabled.");}, 100);
	}
}

if (urlParams.has('random') || urlParams.has('randomize')){
	session.randomize = true;
}

if (urlParams.has('framerate') || urlParams.has('fr') || urlParams.has('fps')){
	session.framerate = urlParams.get('framerate') || urlParams.get('fr') || urlParams.get('fps');
    session.framerate = parseInt(session.framerate);
	log("framerate Changed");
	log(session.framerate);
}



if (urlParams.has('buffer')){ // needs to be before sync
    session.buffer = parseFloat(urlParams.get('buffer')) || 0;
	log("buffer Changed: "+session.buffer);
	session.sync=0;
	session.audioEffects=true;
}

if (urlParams.has('sync')){
    session.sync = parseFloat(urlParams.get('sync'));
	log("sync Changed; in milliseconds.  If not set, defaults to auto.");
	log(session.sync);
	session.audioEffects=true;
	if (session.buffer===false){
		session.buffer=0;
	}
}

if (urlParams.has('mirror')){
	if (urlParams.get('mirror')=="3"){
		getById("main").classList.add("mirror");
	} else if (urlParams.get('mirror')=="2"){
		session.mirrored = 2;
	} else if (urlParams.get('mirror')=="0"){
		session.mirrored = 0;
	} else if (urlParams.get('mirror')=="false"){
		session.mirrored = 0;
	} else if (urlParams.get('mirror')=="off"){
		session.mirrored = 0;
	} else {
		session.mirrored = 1;
	}
}

if (urlParams.has('flip')){
	if (urlParams.get('flip')=="0"){
		session.flipped = false;
	} else if (urlParams.get('flip')=="false"){
		session.flipped = false;
	} else if (urlParams.get('flip')=="off"){
		session.flipped = false;
	} else {
		session.flipped = true;
	}
}

if ((session.mirrored) && (session.flipped)){
	try {
		log("Mirror all videos");
		var mirrorStyle = document.createElement('style');
		mirrorStyle.innerHTML = "video {transform: scaleX(-1) scaleY(-1); }";
		document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
	} catch (e){errorlog(e);}
} else if (session.mirrored){  // mirror the video horizontally
	try {
		log("Mirror all videos");
		var mirrorStyle = document.createElement('style');
		mirrorStyle.innerHTML = "video {transform: scaleX(-1);}"; 
		document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
	} catch (e){errorlog(e);}
} else if (session.flipped){  // mirror the video vertically
	try {
		log("Mirror all videos");
		var mirrorStyle = document.createElement('style');
		mirrorStyle.innerHTML = "video {transform: scaleY(-1);}";
		document.getElementsByTagName("head")[0].appendChild(mirrorStyle);
	} catch (e){errorlog(e);}
}


if (urlParams.has('icefilter')){
	log("ICE FILTER ENABLED");
    session.icefilter =  urlParams.get('icefilter');
}


if (urlParams.has('effects') || urlParams.has('effect')){
	session.effects = urlParams.get('effects') || urlParams.get('effect');
	session.effects = parseInt(session.effects);
	if (session.effects<=0){ 
		sesson.effects = false;
	}
	// mirror == 2
	// face == 1
}
if (urlParams.has('style')){
	if ((parseInt(urlParams.get('style'))==1 ) || (urlParams.get('style')=="justvideo")){ // no audio only
		session.style = 1;
	} else if ((parseInt(urlParams.get('style'))==2) || (urlParams.get('style')=="waveform")){  // audio waveform
		session.style = 2;
		session.audioEffects=true; ////!!!!!!! Do I want to enable the audioEffects myself? or do it here?
	} else if ((parseInt(urlParams.get('style'))==3) || (urlParams.get('style')=="avatar")){ // photo is taken? upload option? canvas?
		session.style = 3;
	} else {
		sesson.style = 1;
	}
}



if (urlParams.has('turn')){
	var turnstring = urlParams.get('turn');
	if (turnstring=="twilio"){
		try{
			var request = new XMLHttpRequest();
			request.open('GET', 'https://api.obs.ninja/twilio', false);  // `false` makes the request synchronous
			request.send(null);

			if (request.status === 200) {
				log(request.responseText);
				var res = JSON.parse(request.responseText);
				
				session.configuration = {
					iceServers: [
						{ "username": res["1"],
						  "credential": res["2"],
						  "url": "turn:global.turn.twilio.com:3478?transport=tcp",
						  "urls": "turn:global.turn.twilio.com:3478?transport=tcp"
						},
						{ "username": res["1"],
						  "credential": res["2"],
						  "url": "turn:global.turn.twilio.com:443?transport=tcp",
						  "urls": "turn:global.turn.twilio.com:443?transport=tcp"
						}
					],
					sdpSemantics: 'unified-plan' // future-proofing
				};
			}
		} catch(e){errorlog("Twilio Failed");}
	} else {
		try {
			turnstring = turnstring.split(";");
			if (turnstring !== "false"){ // false disables the TURN server. Useful for debuggin
				var turn = {};
				turn.username = turnstring[0]; // myusername
				turn.credential = turnstring[1];  //mypassword
				turn.urls = [turnstring[2]]; //  ["turn:turn.obs.ninja:443"];
				session.configuration.iceServers = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun4.l.google.com:19302" ]}];
				session.configuration.iceServers.push(turn);
			}
		} catch (e){
			if (!(session.cleanOutput)){
				alert("TURN server parameters were wrong.");
			}
			errorlog(e);
		}
	}
}


if (urlParams.has('privacy') || urlParams.has('private') || urlParams.has('relay')){ // please only use if you are also using your own TURN service.
	try {
		session.configuration.iceTransportPolicy = "relay";  // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/address
	} catch (e){
		if (!(session.cleanOutput)){
			alert("Privacy mode failed to configure.");
		}
		errorlog(e);
	}
}

if (urlParams.has('wss')){
	if (urlParams.get('wss')){
		session.wss = "wss://" + urlParams.get('wss');
	}
}

window.onmessage = function(e){ // iFRAME support

	if ("function" in e.data){ // these are calling in-app functions, with perhaps a callback -- TODO: add callbacks
		var ret = null;
		if (e.data.function === "previewWebcam"){
			ret = previewWebcam();
		} else if (e.data.function === "publishWebcam"){
			ret = publishWebcam();
		} else if (e.data.function === "publishScreen"){
			ret = publishScreen();
		} 
	}
	
	if ("sendChat" in e.data){
		sendChat(e.data.sendChat); // sends to all peers; more options down the road
	}
	// Chat out gets called via getChatMessage function
	// Related code: parent.postMessage({"chat": {"msg":-----,"type":----,"time":---} }, "*");
	
	if ("mic" in e.data){  // this should work for the director's mic mute button as well. Needs to be manually enabled the first time still tho.
		if (e.data.mic === true){ // unmute
			session.muted = false; // set
			log(session.mute);
			toggleMute(true); // apply 
		} else if (e.data.mic === false){ // mute
			session.muted = true; // set
			log(session.mute);
			toggleMute(true); // apply
		} else if (e.data.mic === "toggle"){ // toggle
			toggleMute();
		} 
	} 

	if ("mute" in e.data){
		if (e.data.mute === true){ // unmute
			session.speakerMuted = true; // set
			toggleSpeakerMute(true); // apply 
		} else if (e.data.mute === false){ // mute
			session.speakerMuted = false; // set
			toggleSpeakerMute(true); // apply
		} else if (e.data.mute === "toggle"){ // toggle
			toggleSpeakerMute();
		} 
	} else if ("speaker" in e.data){                  // same thing as mute.
		if (e.data.speaker === true){ // unmute
			session.speakerMuted = false; // set
			toggleSpeakerMute(true); // apply 
		} else if (e.data.speaker === false){ // mute
			session.speakerMuted = true; // set
			toggleSpeakerMute(true); // apply
		} else if (e.data.speaker === "toggle"){ // toggle
			toggleSpeakerMute();
		} 
	}
	
	
	if ("volume" in e.data){
		for (var i in session.rpcs){
			try {
				session.rpcs[i].videoElement.volume = parseFloat(e.data.volume);
			} catch(e){
				errorlog(e);
			}
		}
    }
	
	if ("bitrate" in e.data){
		for (var i in session.rpcs){
			try {
				session.requestRateLimit(parseInt(e.data.bitrate),i);
			} catch(e){
				errorlog(e);
			}
		}
	}
	
	if ("sendMessage" in e.data){  // webrtc send to viewers
		session.sendMessage(e.data);
	}
	
	if ("sendRequest" in e.data){  // webrtc send to publishers
		session.sendRequest(e.data);
	}
	
	if ("reload" in e.data){
        location.reload();
    } 
		
	if ("getStats" in e.data){
		
		var stats = {};
		stats.total_outbound_connections = Object.keys(session.pcs).length;
		stats.total_inbound_connections = Object.keys(session.rpcs).length;
		stats.inbound_stats = {};
		for (var i in session.rpcs){
			stats.inbound_stats[session.rpcs[i].streamID] = session.rpcs[i].stats;
		}
		parent.postMessage({"stats": stats }, "*");
    }
	
	if ("getLoudness" in e.data){
		log("GOT OUDNESS REQUEST");
		if (e.data.getLoudness == true){
			var loudness = {};
			for (var i in session.rpcs){
				loudness[session.rpcs[i].streamID] = session.rpcs[i].stats.Audio_Loudness;
			}
			parent.postMessage({"loudness": loudness }, "*");
			session.pushLoudness = true;
		} else {
			session.pushLoudness = false;
		}
    }
	
	if ("close" in e.data){
        for (var i in session.rpcs){
			try {
				session.rpcs[i].close();
			} catch(e){
				errorlog(e);
			}
		}
    }
	
	
};

function pokeIframeAPI(action){
	try{
		parent.postMessage({"action": action }, "*");
	} catch(e){errorlog(e);}
}

function jumptoroom(){
	var arr = window.location.href.split('?');
	var roomname = getById("joinroomID").value;
	roomname = sanitizeRoomName(roomname);
	if (roomname.length){
		if (arr.length > 1 && arr[1] !== '') {
			window.location+="&room="+roomname;
		} else {
			window.location+="?room="+roomname;
		}
	}
}

function sleep(ms = 0){  
  return new Promise(r => setTimeout(r, ms));  // LOLz!
}

session.connect();
// session.volume = 100; // needs to be set after?

var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);

if (filename.split(".").length==1){
	if (filename.length<2){
		filename=false;
	}
} else {
	filename = false;
}

//////////  Canvas Effects  ///////////////

function drawFrameMirrored(){
	session.canvasCtx.save();
    session.canvasCtx.scale(-1, 1);
    session.canvasCtx.drawImage(session.canvasSource, 0, 0, session.canvas.width*-1, session.canvas.height);
    session.canvasCtx.restore();
}

function setupCanvas(eleName){
	if (session.canvas===null){
		session.canvas = document.createElement("canvas");
		session.canvas.width="1280";
		session.canvas.height="720";
		session.canvasCtx = session.canvas.getContext('2d');
		session.canvasSource = document.createElement("video");
		session.canvasSource.autoplay = true;
		session.canvasSource.srcObject = new MediaStream();
		session.streamSrc = session.canvas.captureStream(30);
		getById(eleName).srcObject = session.streamSrc;
	} 
}

function addTracks(eleName){
	if (session.canvas===null){
		session.canvas = document.createElement("canvas");
		session.canvas.width="1280";
		session.canvas.height="720";
		session.canvasCtx = session.canvas.getContext('2d');
		session.canvasSource = document.createElement("video");
		session.canvasSource.autoplay = true;
		session.canvasSource.srcObject = new MediaStream();
		session.streamSrc = session.canvas.captureStream(30);
		getById(eleName).srcObject = session.streamSrc;
	} 
}

function applyEffects(eleName, track, stream){
	
	if (session.effects==1){
		setupCanvas(eleName);
		session.canvasSource.srcObject.addTrack(track, stream);
		session.canvas.width = track.getSettings().width;
		session.canvas.height = track.getSettings().height;
		if (session.effects==1){
			setTimeout(function(){drawFace();},100);
		}
	} else if (session.effects==2){
		setupCanvas(eleName);
		session.canvasSource.srcObject.addTrack(track, stream);
		session.canvas.width = track.getSettings().width;
		session.canvas.height = track.getSettings().height;
		var drawRate = parseInt(1000/track.getSettings().frameRate)+1;
		if (session.canvasInterval!==null){clearInterval(session.canvasInterval);}
		session.canvasInterval = setInterval(function(){drawFrameMirrored();},drawRate);
	} else {
		getById(eleName).srcObject.addTrack(track, stream); // add video track to the preview video
		session.streamSrc = getById(eleName).srcObject;
	}
}

function drawFace(){
	var faceAlignment = (function(){
		var vid = session.canvasSource;

		var canvas = session.canvas;
		var ctx = session.canvasCtx;
		
		var canvas_tmp = document.createElement("canvas");
		var ctx_tmp = canvas_tmp.getContext('2d');

		//var stream = canvas.captureStream(30);

		var image = new Image();
		var zoom = 10;
		var scale = 1;
		var lastFace = {};
		
		var w = vid.videoWidth;
		var h = vid.videoHeight;
		var x = vid.videoWidth/2;
		var y = vid.videoHeight/2;

		lastFace.x = vid.videoWidth/2;
		lastFace.y = vid.videoHeight/2;
		lastFace.w = vid.videoWidth;
		lastFace.h = vid.videoHeight;
		var yoffset=0;


		if (window.FaceDetector == undefined) {
			console.error('Face Detection not supported');
			var faceDetector = false;
		} else {
			var faceDetector = new FaceDetector();
			console.log('FaceD Loaded');
			setTimeout(function(){detect();},300);
			setTimeout(function(){draw();},33);
		}

		canvas.height = vid.videoHeight;
		canvas.width = vid.videoWidth;
		canvas_tmp.height = vid.videoHeight;
		canvas_tmp.width = vid.videoWidth;
		image.src = canvas_tmp.toDataURL();
		scale = canvas.width / image.width;
		lastFace.x = 0;
		lastFace.y = 0;
		lastFace.w = 1280/3/16*zoom;
		lastFace.h = 720/3/9*zoom;
		
		w = 1280/5;
		h = 720/5;
		x = 1280/2;
		y = 720/2 - w*9/zoom/2;
			

		async function detect(){
			

			ctx_tmp.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight);
			image.src = canvas_tmp.toDataURL();
			await faceDetector.detect(image).then(faces => {
				
				if (faces.length===0){
					log("NO FACES");
					setTimeout(function(){detect();},10);
					return;
				}
				for (let face of faces) {
					lastFace.x = (face.boundingBox.x+lastFace.x)/2 || face.boundingBox.x;
					lastFace.y = (face.boundingBox.y+lastFace.y)/2 || face.boundingBox.y;
					lastFace.w = (face.boundingBox.width+lastFace.w)/2 || face.boundingBox.width;
					lastFace.h = (face.boundingBox.height+lastFace.h)/2 || face.boundingBox.height;
				}
				
				setTimeout(function(){detect();},300);
			}).catch((e) => {
				console.error("Boo, Face Detection failed: " + e);
			});
			
		}

		function draw() {
			canvas.height = vid.videoHeight;
			canvas.width = vid.videoWidth;

			if (lastFace.w-w<0.15*lastFace.w){
				w = w*0.999 + 0.001*lastFace.w;
			}
			if (lastFace.h-h<0.15*lastFace.h){
				h = h*0.999 + 0.001*lastFace.h;
			}
			if (Math.abs(x-(lastFace.x+lastFace.w/2))>0.15*(lastFace.x+lastFace.w/2.0)){
				x = x*0.999 + 0.001*(lastFace.x+lastFace.w/2.0);
			}
			if (Math.abs(y-(lastFace.y+lastFace.h/2))>0.15*(lastFace.y+lastFace.h/2.0)){
				y = y*0.999 + 0.001*(lastFace.y+lastFace.h/2.0);
			}
			
			yoffset = w*9/zoom/2;

			var yyy = y-w*9/zoom - yoffset;
			var hhh = w*3*9/zoom;
			var www = w*3*16/zoom;
			var xxx = x-w*16/zoom*1.5;
			
			if (www+xxx<1280){xxx=1280-www;}
			if (hhh+yyy<720){yyy=720-hhh;}
			
			if (www+xxx>1280){xxx=1280-www;}
			if (hhh+yyy>720){yyy=720-hhh;}
			
			if (yyy<0){yyy=0;}
			if (xxx<0){xxx=0;}
			
			ctx.drawImage(
					vid,
					xxx,
					yyy,
					www, 
					hhh,
					0,
					0,
					vid.videoWidth, 
					vid.videoHeight
				);

			setTimeout(function(){draw();},30);
		}
	})();
}

////////  END CANVAS EFFECTS  ///////////////////


var permaid=false;

if (urlParams.has('permaid') || urlParams.has('push')){
	permaid  = urlParams.get('permaid') || urlParams.get('push');
	session.streamID = sanitizeStreamID(permaid);
	
	if (urlParams.has('permaid')){
		updateURL("permaid="+session.streamID, true);  // I'm not deleting the permaID first tho...
	} else {
		updateURL("push="+session.streamID, true);  // I'm not deleting the permaID first tho...
	}
	
	if (urlParams.has('director')){ // if I do a short form of this, it will cause duplications in the code elsewhere.
		//var director_room_input = urlParams.get('director');
		//director_room_input = sanitizeRoomName(director_room_input);
		//createRoom(director_room_input);
		permaid = false; // used to avoid a trigger later on.
	} else {
		getById("container-1").className = 'column columnfade advanced';
		getById("container-4").className = 'column columnfade advanced';
		getById("info").innerHTML = "";
		if (session.videoDevice === 0){
			getById("add_camera").innerHTML = "Share your Microphone";
		} else {
			getById("add_camera").innerHTML = "Share your Camera";
		}
		getById("add_screen").innerHTML = "Share your Screen";
		getById("passwordRoom").value = "";
		getById("videoname1").value = "";
		getById("dirroomid").innerHTML = "";
		getById("roomid").innerHTML = "";
		getById("container-1").className = 'column columnfade advanced';
		getById("container-4").className = 'column columnfade advanced';
		getById("mainmenu").style.alignSelf= "center";
		getById("mainmenu").classList.add("mainmenuclass");
		getById("header").style.alignSelf= "center";
		
		if (session.webcamonly==true){  // mobile or manual flag 'webcam' pflag set
			getById("head1").innerHTML = '<font style="color:#CCC;">- Please accept any camera permissions</font>';
		} else {	
			getById("head1").innerHTML = '<br /><font style="color:#CCC">- Please select which you wish to share</font>';
		}
	}
} 

if ( (session.roomid) || (urlParams.has('roomid')) || (urlParams.has('r')) || (urlParams.has('room')) ||  (filename) || (permaid!==false)){
	
	var roomid = "";
	if (filename){
		roomid = filename;
	} else if (urlParams.has('room')){
		roomid  = urlParams.get('room');
	} else if (urlParams.has('roomid')){
		roomid  = urlParams.get('roomid');
	} else if (urlParams.has('r')){
		roomid  = urlParams.get('r');
	} else if (session.roomid){
		roomid = session.roomid;
	}
	
	session.roomid = sanitizeRoomName(roomid);
	
	if (session.audioDevice===false){
		getById("headphonesDiv2").style.display="inline-block";
		getById("headphonesDiv").style.display="inline-block";
	}
	getById("info").innerHTML = "";
	getById("info").style.color="#CCC";
	getById("videoname1").value = session.roomid;
	getById("dirroomid").innerHTML = session.roomid;
	getById("roomid").innerHTML = session.roomid;
	getById("container-1").className = 'column columnfade advanced';
	getById("container-4").className = 'column columnfade advanced';
	getById("mainmenu").style.alignSelf= "center";
	getById("header").style.alignSelf= "center";
	
	if (session.webcamonly==true){  // mobile or manual flag 'webcam' pflag set
		getById("head1").innerHTML = '';
	} else {	
		getById("head1").innerHTML = '<font style="color:#CCC">Please select an option to join.</font>';
	}
	
	if (session.roomid.length>0){
		if (session.videoDevice === 0){
			getById("add_camera").innerHTML = "Join room with Microphone";
		} else {
			getById("add_camera").innerHTML = "Join Room with Camera";
		}
		getById("add_screen").innerHTML = "Screenshare with Room";
	} else {
		if (session.videoDevice === 0){
			getById("add_camera").innerHTML = "Share your Microphone";
		} else {
			getById("add_camera").innerHTML = "Share your Camera";
		}
		getById("add_screen").innerHTML = "Share your Screen";
	}
	getById("head3").className = 'advanced';
	if (urlParams.has('scene')){
		session.scene = parseInt(urlParams.get('scene')) || 0;
		getById("container-4").className = 'column columnfade';
		getById("container-3").className = 'column columnfade';
		getById("container-2").className = 'column columnfade';
		getById("container-1").className = 'column columnfade';
		getById("header").className = 'advanced';
		getById("info").className = 'advanced';
		getById("head1").className = 'advanced';
		getById("head2").className = 'advanced';
		getById("head3").className = 'advanced';
		getById("mainmenu").style.display = "none";
		getById("translateButton").style.display = "none";
		log("Update Mixer Event on REsize SET");
		window.addEventListener("resize", updateMixer);
		window.addEventListener("orientationchange", function(){setTimeout(updateMixer, 200);});
		joinRoom(session.roomid); // this is a scene, so we want high resolutions
		getById("main").style.overflow = "hidden";
	} 
} else if (urlParams.has('director')){ // if I do a short form of this, it will cause duplications in the code elsewhere.
	var director_room_input = urlParams.get('director');
	director_room_input = sanitizeRoomName(director_room_input);
	createRoom(director_room_input);
} else if ((session.view) && (permaid===false)){
	log("Update Mixer Event on REsize SET");
	getById("translateButton").style.display = "none";
	window.addEventListener("resize", updateMixer);
	window.addEventListener("orientationchange", function(){setTimeout(updateMixer, 200);});
	getById("main").style.overflow = "hidden";
} 

if (urlParams.has('hidemenu') || urlParams.has('hm')){  // needs to happen the room and permaid applications
    getById("mainmenu").style.display="none";
	getById("header").style.display="none";
	getById("mainmenu").style.opacity = 0;
	getById("header").style.opacity = 0;
}

if (urlParams.has('hideheader') || urlParams.has('hh')){  // needs to happen the room and permaid applications
	getById("header").style.display="none";
	getById("header").style.opacity = 0;
}

function checkConnection(){
	if (document.getElementById("qos")){  // true or false; null might cause problems?
		if ((session.ws) && (session.ws.readyState === WebSocket.OPEN)) {
			getById("qos").style.color = "white";
		} else {
			getById("qos").style.color = "red";
		}
	}
}
setInterval(function(){checkConnection();},5000);


function printViewStats(menu, statsObj, streamID){  // Stats for viewing a remote video

	menu.innerHTML="StreamID: <b>"+streamID+"</b><br />";
	menu.innerHTML+= printValues(statsObj);
	
}
function printValues(obj) {  // see: printViewStats
	var out = "";
	for (var key in obj) {
		if (typeof obj[key] === "object") {
			if (obj[key]!=null){
				out += "<li><h2 title='" + key + "'>"+key+"</h2></li>"
				out += printValues(obj[key]);
			}
		} else {
			if (key.startsWith("_")){
				// if it starts with _, we don't want to show it.
			} else {
				var unit  = '';
				var stat = key;
				if(key == 'Bitrate_in_kbps') {
					var unit = " kbps";
					stat = "Bitrate";
				}
				if(key == 'type') {
					var unit = "";
					stat = 'Type';
				}
				if(key == 'packetLoss_in_percentage') {
					var unit = " %";
					stat = 'Packet Loss 📶';
				}
				if(key == 'Buffer_Delay_in_ms') {
					var unit = " ms";
					stat = 'Buffer Delay';
				}
				out +="<li><span>"+stat+"</span><span>"+obj[key]+ unit + "</span></li>";
			}
		}
	}
	return out;
}


function printMyStats(menu){  // see: setupStatsMenu
	menu.innerHTML="";
	
	session.stats.outbound_connections = Object.keys(session.pcs).length;
	session.stats.inbound_connections = Object.keys(session.rpcs).length;
	printViewValues(session.stats);
	
	function printViewValues(obj) { 
		for (var key in obj) {
			if (typeof obj[key] === "object") {				
				printViewValues(obj[key]);
			} else {
				menu.innerHTML +="<li><span>"+key+"</span><span>"+obj[key]+"</span></li>";
			}
		}
	}
	menu.innerHTML+="<button onclick='session.forcePLI(null,event);'>Send Keyframe to Viewers</button>";
	for (var uuid in session.pcs){
		session.pcs[uuid].getStats().then(function(stats){
			stats.forEach(stat=>{
				if (stat.type=="outbound-rtp"){
					if (stat.kind=="video"){
						
						if ("qualityLimitationReason" in stat){
							session.pcs[uuid].stats.quality_Limitation_Reason = stat.qualityLimitationReason;
						}
						if ("framesPerSecond" in stat){
							session.pcs[uuid].stats.resolution = stat.frameWidth+" x "+ stat.frameHeight +" @ "+stat.framesPerSecond;
						}
						if ("encoderImplementation" in stat){
							session.pcs[uuid].stats.encoder = stat.encoderImplementation;
						}
						
					}
				}
			});
			printViewValues(session.pcs[uuid].stats);
			menu.innerHTML+="<br /><br />"
		});
	}
}



function updateStats(obsvc=false){
	log('resolution found');
	if (!(getById('previewWebcam'))){return;} // Don't show unless preview (or new stats pane is added)
	try {
		getById("webcamstats").innerHTML = "";
		getById('previewWebcam').srcObject.getVideoTracks().forEach(
			function(track) {
				log(track.getSettings());
				if ((obsvc) && (parseInt(track.getSettings().frameRate)==30)){
					getById("webcamstats").innerHTML = "Video Settings: "+(track.getSettings().width||0) +"x"+(track.getSettings().height||0)+" @ up to 60fps";
				} else {
					getById("webcamstats").innerHTML = "Current Video Settings: "+(track.getSettings().width||0) +"x"+(track.getSettings().height||0)+"@"+(parseInt(track.getSettings().frameRate*10)/10)+"fps";
				}
			}
		);
		
	} catch (e){errorlog(e);}
}


function toggleMute(apply=false){ // TODO: I need to have this be MUTE, toggle, with volume not touched.

	log("muting");

	if (session.director){
		if (!session.directorEnabledPPT){
			log("Director doesn't have PPT enabled yet");
			// director has not enabled PTT yet.
			return;
		}
	}
	
	log(session.muted);
	if (apply){
		session.muted =! session.muted;
	}
	try{var ptt = getById("press2talk");} catch(e){var ptt=false;}
	
	if (session.muted==false){
		session.muted = true;
		getById("mutetoggle").className="las la-microphone-slash my-float toggleSize";
		getById("mutebutton").className="float2";
		if (session.streamSrc){
			session.streamSrc.getAudioTracks().forEach((track) => {
			  track.enabled = false;
			});
		}
		if (ptt){
			ptt.innerHTML = "<span data-translate='Push-to-Mute'>🔇 Push to Talk</span>";
		}
		
	} else{
		session.muted=false;
		getById("mutetoggle").className="las la-microphone my-float toggleSize";
		getById("mutebutton").className="float";
		if (session.streamSrc){
			session.streamSrc.getAudioTracks().forEach((track) => {
			  track.enabled = true;
			});
		}
		if (ptt){
			ptt.innerHTML = "<span data-translate='Push-to-Mute'>🔴 Push to Mute</span>";
		}
	}
}


function toggleSpeakerMute(apply=false){ // TODO: I need to have this be MUTE, toggle, with volume not touched.
	if (apply){
		session.speakerMuted =! session.speakerMuted; 
	}
	if (session.speakerMuted == false){
		session.speakerMuted = true;
		getById("mutespeakertoggle").className="las la-volume-mute my-float toggleSize";
		getById("mutespeakerbutton").className="float2";
		
		var sounds = document.getElementsByTagName("video");
		for (var i = 0; i < sounds.length; ++i){
			sounds[i].muted = session.speakerMuted;
		}
		
	} else {
		session.speakerMuted = false;
		
		getById("mutespeakertoggle").className="las la-volume-up my-float toggleSize";
		getById("mutespeakerbutton").className="float";
		
		var sounds = document.getElementsByTagName("video");
		for (var i = 0; i < sounds.length; ++i){
			
			if (sounds[i].id === "videosource"){ // don't unmute ourselves. feedback galore if so.
				continue;
			} else if (sounds[i].id === "previewWebcam"){
				continue;
			} else if (sounds[i].id === "screenshare"){
				continue;
			} else {
				sounds[i].muted = session.speakerMuted;
			}
		}
	}
	
	for (var UUID in session.rpcs){
		if (session.rpcs[UUID].videoElement){
			if (UUID === session.directorUUID){
				session.rpcs[UUID].videoElement.muted = false; // unmute director
				log("MAKE SURE DIRECTOR ISN'T MUTED");
			} else {
				session.rpcs[UUID].videoElement.muted = session.speakerMuted;
			}
		}
	}
}


function toggleChat(ele=null){ // TODO: I need to have this be MUTE, toggle, with volume not touched.
	if (session.chat==false){
		setTimeout(function(){document.addEventListener("click", toggleChat);},10);
		
		getById("chatModule").addEventListener("click",function(e){
			e.stopPropagation(); 
			return false;
		});
		session.chat = true;
		getById("chattoggle").className="las la-comment-dots my-float toggleSize";
		getById("chatbutton").className="float2";
		getById("chatModule").style.display = "block";
		getById("chatInput").focus(); // give it keyboard focus
	} else{
		session.chat=false;
		getById("chattoggle").className="las la-comment-alt my-float toggleSize";
		getById("chatbutton").className="float";
		getById("chatModule").style.display = "none";
		
		document.removeEventListener("click", toggleChat);
		getById("chatModule").removeEventListener("click", function(e){
			e.stopPropagation(); 
			return false;
		});
	}
	if (getById("chatNotification").value){
		getById("chatNotification").value = 0;
	}
	getById("chatNotification").classList.remove("notification");
}

function toggleVideoMute(apply=false){ // TODO: I need to have this be MUTE, toggle, with volume not touched.
	if (apply){
		session.videoMuted=!session.videoMuted;
	}
	if (session.videoMuted==false){
		session.videoMuted = true;
		getById("mutevideotoggle").className="las la-eye-slash my-float toggleSize";
		getById("mutevideobutton").className="float2";
		if (session.streamSrc){
			session.streamSrc.getVideoTracks().forEach((track) => {
			  track.enabled = false;
			});
		}
		
	} else{
		session.videoMuted=false;
		
		getById("mutevideotoggle").className="las la-eye my-float toggleSize";
		getById("mutevideobutton").className="float";
		if (session.streamSrc){
			session.streamSrc.getVideoTracks().forEach((track) => {
			  track.enabled = true;
			});
		}
	}
}

function toggleSettings(){ // TODO: I need to have this be MUTE, toggle, with volume not touched.
	
	if (getById("popupSelector").style.display=="none"){
		
		updateConstraintSliders();
		
		setTimeout(function(){document.addEventListener("click", toggleSettings);},10);
		
		getById("popupSelector").addEventListener("click",function(e){
			e.stopPropagation(); 
			return false;
		});
		
		enumerateDevices().then(gotDevices2).then(function(){});
	
		getById("popupSelector").style.display="inline-block"
		getById("settingstoggle").classList.add("icn-spinner");
		getById("settingsbutton").classList.add("float2");
		getById("settingsbutton").classList.remove("float");
		setTimeout(function(){getById("popupSelector").style.right="0px";},1);
		
	} else{
		document.removeEventListener("click", toggleSettings);
		getById("popupSelector").removeEventListener("click", function(e){
			e.stopPropagation(); 
			return false;
		});
		
		getById("popupSelector").style.right="-400px";
		getById("settingstoggle").classList.remove("icn-spinner");
		
		getById("settingsbutton").classList.add("float");
		getById("settingsbutton").classList.remove("float2");
		setTimeout(function(){getById("popupSelector").style.display="none";},200);
	}
}

function hangup(){ // TODO: I need to have this be MUTE, toggle, with volume not touched.
	getById("main").innerHTML = "<font style='font-size:500%;top:40%;left:50%;margin:auto 0;position:absolute;'>👋</font>";
	setTimeout(function(){session.hangup();},0);
}

function hangupComplete(){
	getById("main").innerHTML = "<font style='font-size:500%;top:40%;left:50%;margin:auto 0;position:absolute;'>👋</font>";
}

var previousRoom="";
var stillNeedRoom=true;
var transferCancelled = false;
function directMigrate(ele, event){  // everyone in the room will hangup this guest also?  I like that idea.  What about the STREAM ID?  I suppose we don't kick out if the viewID matches.

	if (event === false){
		if (previousRoom===null){ // user cancelled in previous callback
			ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">Transfer</span>';
			ele.style.backgroundColor = null;
			return;
		}
		if (transferCancelled===true){
			ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">Transfer</span>';
			ele.style.backgroundColor = null;
			return;
		}
		migrateRoom = previousRoom
	} else if ((event.ctrlKey) || (event.metaKey)){
		ele.innerHTML = '<i class="las la-check"></i> <span data-translate="forward-to-room">Armed</span>';
		ele.style.backgroundColor = "#BF3F3F";
		transferCancelled=false;
		Callbacks.push([directMigrate, ele, stillNeedRoom]);
		stillNeedRoom=false;
		log("Migrate queued");
		return;
	} else {
		var migrateRoom = prompt("Transfer guests to room:", previousRoom);
		stillNeedRoom=true;
		if (migrateRoom===null){ // user cancelled
			ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">Transfer</span>';
			ele.style.backgroundColor = null;
			transferCancelled=true;
			return;
		}
		try{
			migrateRoom = sanitizeRoomName(migrateRoom);
			previousRoom = migrateRoom;
		} catch(e){}
		
	}
	ele.innerHTML = '<i class="las la-paper-plane"></i> <span data-translate="forward-to-room">Transfer</span>';
	ele.style.backgroundColor = null;
	
	if (migrateRoom){
		previousRoom = migrateRoom;
		
		var msg = {};
		msg.request = "migrate";
		if (session.password){
			return session.generateHash(migrateRoom+session.password+session.salt,16).then(function(rid){
				var msg = {};
				msg.request = "migrate";
				msg.roomid = rid;
				msg.target = ele.dataset.UUID;
				session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
			});
		} else {
			var msg = {};
			msg.request = "migrate";
			msg.roomid = migrateRoom;
			msg.target = ele.dataset.UUID;
			session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
		}
	}
}
var stillNeedHangupTarget=1;
function directHangup(ele, event){  // everyone in the room will hangup this guest?  I like that idea.
	if (event == false){
		if (stillNeedHangupTarget===1){
			var confirmHangup = confirm("Are you sure you wish to disconnect these users?");
			stillNeedHangupTarget = confirmHangup;
		} else {
			confirmHangup = stillNeedHangupTarget;
		}
	} else if ((event.ctrlKey) || (event.metaKey)){
		ele.innerHTML = '<i class="las la-skull-crossbones"></i> <span data-translate="disconnect-guest" >ARMED</span>';
		ele.style.backgroundColor = "#BF3F3F";
		stillNeedHangupTarget=1;
		Callbacks.push([directHangup, ele, false]);
		log("Hangup queued");
		return;
	} else {
		var confirmHangup = confirm("Are you sure you wish to disconnect this user?");
	}

	if (confirmHangup){
		var msg = {};
		//msg.request = "sendroom";
		msg.hangup = true;
		
		//msg.target = ele.dataset.UUID;
		log(msg);
		log(ele.dataset.UUID);
		session.sendRequest(msg, ele.dataset.UUID);
		//session.anysend(msg); // send to everyone in the room, so they know if they are on air or not.
	} else {
		ele.innerHTML = '<i class="las la-sign-out-alt"></i><span data-translate="disconnect-guest" >Hangup</span>';
		ele.style.backgroundColor = null;
	}
}

function directEnable(ele, event){ // A directing room only is controlled by the Director, with the exception of MUTE.
	if (!((event.ctrlKey) || (event.metaKey))){
		if (ele.dataset.enable==1){
			ele.dataset.enable = 0;
			ele.className = "";
			ele.children[1].innerHTML = "Add to Scene";
			getById("container_"+ele.dataset.UUID).style.backgroundColor = null;
		} else {
			getById("container_"+ele.dataset.UUID).style.backgroundColor = "#649166";
			ele.dataset.enable = 1;
			ele.className = "pressed";
			ele.children[1].innerHTML = "Remove";
		}
	}
	var msg = {};
	msg.request = "sendroom";
	//msg.roomid = session.roomid;
	msg.scene = "1"; // scene
	msg.action = "display";
	msg.value =  ele.dataset.enable;
	msg.target = ele.dataset.UUID;
	
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function directMute(ele, event){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("mute");
	if (!((event.ctrlKey) || (event.metaKey))){
		if (ele.dataset.mute==0){
			ele.dataset.mute = 1;
			ele.className = "";
			ele.children[1].innerHTML = "Mute in scenes";
        } else {
			ele.dataset.mute = 0;
			ele.className = "pressed";
			ele.children[1].innerHTML = "Un-mute";
        }
	}
	var msg = {};
	msg.request = "sendroom";
	//msg.roomid = session.roomid;
	msg.scene = "1";
	msg.action = "mute";
	msg.value =  ele.dataset.mute;
	msg.target = ele.dataset.UUID;
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function directVolume(ele){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("volume");
	var msg = {};
	msg.request = "sendroom";
	//msg.roomid = session.roomid;
	msg.scene = "1";
	msg.action = "volume";
	msg.target = ele.dataset.UUID; // i want to focus on the STREAM ID, not the UUID...
	msg.value = ele.value;
	
	// session.anysend(msg // msg.UUID ->  can't do this yet as DIRECTOR isn't "verfied" via WebRTC yet. ALSO,  
	// need to send to just scenes, and that isn't the case as voice is push to talk setup first. RTC is off by default then.
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function sendChat(chatmessage="hi"){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("Chat message");
	var msg = {};
	msg.chat = chatmessage;
	session.sendPeers(msg);
}

var activatedStream = false;
function publishScreen(){
	if( activatedStream == true){return;}
	activatedStream = true;
	setTimeout(function(){activatedStream=false;},1000);

	var title = "ScreenShare";//getById("videoname2").value;

	formSubmitting = false;
	
	var quality = parseInt(getById("webcamquality2").elements.namedItem("resolution2").value);
	
	if (session.quality!==false){
		quality=session.quality; // override the user's setting
	}
	
	if (quality==0){
		var width = {ideal: 1920};
		var height = {ideal: 1080};
	} else if (quality==1){
		var width = {ideal: 1280};
		var height = {ideal: 720};
	} else if (quality==2){
		var width = {ideal: 640};
		var height = {ideal: 360};
	} else if (quality>=3){  // lowest
		var width = {ideal: 320};
		var height = {ideal: 180};
	}
	
	if (session.width){
		width = {ideal: session.width};
	}
	if (session.height){
		height = {ideal: session.height};
	}

	var constraints = window.constraints = {
		audio: {
			echoCancellation: false, 
			autoGainControl: false, 
			noiseSuppression: false
		}, 
		video: {width: width, height: height, mediaSource: "screen"}
	};
	
	if (session.noiseSuppression == true){
		constraints.audio.noiseSuppression = true;; // the defaults for screen publishing should be off.
	}
	if (session.autoGainControl == true){
		constraints.audio.autoGainControl = true; // the defaults for screen publishing should be off.
	}
	if (session.echoCancellation == true){
		constraints.audio.echoCancellation = true; // the defaults for screen publishing should be off.
	}
	
	if (session.nocursor){
		constraints.video.cursor = { exact: "none" };  // Not sure this does anything, but whatever.
	} 
	
	if (session.framerate!==false){
		constraints.video.frameRate = session.framerate;
	} else {
		constraints.video.frameRate = {ideal: 60};
	}
	
	var audioSelect = document.querySelector('select#audioSourceScreenshare');
	var outputSelect = document.querySelector('select#outputSourceScreenshare');
	
	
	session.sink = outputSelect.options[outputSelect.selectedIndex].value;
	log("Session SInk: "+session.sink);
	if (session.sink=="default"){session.sink=false;}
	
	log("*");
	session.publishScreen(constraints, title, audioSelect).then((res)=>{
		if (res==false){return;} // no screen selected
		log("streamID is: "+session.streamID);

		if (!(session.cleanOutput)){
			getById("mutebutton").className="float";
			getById("mutespeakerbutton").className="float";
			getById("chatbutton").className="float";
			getById("mutevideobutton").className="float";
			getById("hangupbutton").className="float";
			if (session.showSettings){
				getById("settingsbutton").className="float";
			}
			getById("controlButtons").style.display="flex";
			getById("helpbutton").style.display = "inherit";
		} else {
			getById("controlButtons").style.display="none";
		}
		getById("head1").className = 'advanced';
		getById("head2").className = 'advanced';
	}).catch(()=>{});

}
function publishWebcam(btn = false){
	log(btn);
	if (btn){
		if (btn.dataset.ready == "false"){
			warnlog("Clicked too quickly; button not enabled yet");
			return;
		}
	}
	
	if( activatedStream == true){return;}
	activatedStream = true;
	log("PRESSED PUBLISH WEBCAM!!");
	
	var title = "Webcam"; // getById("videoname3").value;
	var ele = getById("previewWebcam");

	formSubmitting = false;
	window.scrollTo(0, 0); // iOS has a nasty habit of overriding the CSS when changing camaera selections, so this addresses that.

	if (session.roomid!==false){
		if ((session.roomid==="") && ((!(session.view)) || (session.view===""))){  
					//	no room, no viewing, viewing disabled
		} else {
			log("ROOM ID ENABLED");
			log("Update Mixer Event on REsize SET");
			window.addEventListener("resize", updateMixer);
			window.addEventListener("orientationchange", function(){setTimeout(updateMixer, 200);});
			getById("main").style.overflow = "hidden";
			//session.cbr=0; // we're just going to override it
			if (session.stereo==5){
				session.stereo=3;
			}
			joinRoom(session.roomid);
			
		}
		getById("head3").className = 'advanced';
	} else {
		getById("head3").className = '';
		getById("logoname").style.display = 'none';
	}
	
	log("streamID is: "+session.streamID);
	getById("head1").className = 'advanced';
	getById("head2").className = 'advanced';

	if (!(session.cleanOutput)){
		getById("mutebutton").className="float";
		getById("mutespeakerbutton").className="float";
		getById("chatbutton").className="float";
		getById("mutevideobutton").className="float";
		getById("hangupbutton").className="float";
		if (session.showSettings){
			getById("settingsbutton").className="float";
		}
		getById("controlButtons").style.display="flex";
		getById("helpbutton").style.display = "inherit";
	} else {
		getById("controlButtons").style.display="none";
	}
	
	if (urlParams.has('permaid')){
		updateURL("permaid="+session.streamID);
	} else {
		updateURL("push="+session.streamID);
	}
	
	
	session.publishStream(ele, title);

}


var audioContext = null;
var meter = null;
var mediaStreamSource = null;
var drawLoopLimiter = null;

function volumeStream(stream) {
	if ((iOS) || (iPad)){
		log("Volume Meter not support on iOS due to Safari Glitch");
		//setInterval(function(){
		//	var sounds = document.getElementsByTagName("video");
		//	for (var i = 0; i < sounds.length; ++i){
		//		sounds[i].addEventListener('pause', function onPause() {
		//		  sounds[i].removeEventListener('pause', onPause);
		//		  sounds[i].play();
		//		});
		//		sounds[i].pause();
		//	}
		//},5000);
	} else {
		log("gostream");
		if (meter){
			meter.shutdown;
		}
		meter=null;
		mediaStreamSource = null;
		audioContext=null
		if (!document.getElementById("meter1")){
			return;
		}
		if (stream.getAudioTracks().length){
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			audioContext = new AudioContext();
			mediaStreamSource = audioContext.createMediaStreamSource(stream); // clone to fix iOS issue
			meter = createAudioMeter(audioContext);
			mediaStreamSource.connect(meter);
			clearInterval(drawLoopLimiter);
			drawLoopLimiter = setTimeout(function(){drawLoop();},1)
		}
	}
}

function drawLoop( time ) {
	if (!document.getElementById("meter1")){
		clearInterval(drawLoopLimiter);
		if (meter){
			meter.shutdown;
		}
		meter=null;
		mediaStreamSource = null;
		audioContext=null;
		return;
	}
	if (meter.clipping){
		getById("meter1").style.width = "100px";
		getById("meter1").style.background = "red";
	} else {
		if ((100-meter.volume*100*4)<=1){
			getById("meter1").style.width = "100px";
			getById("meter1").style.background = "green";
		} else if ((100-meter.volume*100*4)<100){
			getById("meter1").style.width = (meter.volume*100*4)+"px";
			getById("meter1").style.background = "green";
		} else {
			getById("meter1").style.width = "0px";
		}
	}
	clearInterval(drawLoopLimiter);
	drawLoopLimiter = setTimeout(function(){drawLoop();},50)
}
function createAudioMeter(audioContext,clipLevel,averaging,clipLag) {
	var processor = audioContext.createScriptProcessor(512);
	processor.onaudioprocess = volumeAudioProcess;
	processor.clipping = false;
	processor.lastClip = 0;
	processor.volume = 0;
	processor.clipLevel = clipLevel || 0.95;
	processor.averaging = averaging || 0.90;
	processor.clipLag = clipLag || 750;

	processor.connect(audioContext.destination);

	processor.checkClipping = function(){
			if (!this.clipping)
				return false;
			if ((this.lastClip + this.clipLag) < window.performance.now())
				this.clipping = false;
			return this.clipping;
		};

	processor.shutdown = function(){
			this.disconnect();
			this.onaudioprocess = null;
		};

	return processor;
}

function volumeAudioProcess( event ) {
	var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
	var sum = 0;
    var x;

    for (var i=0; i<bufLength; i++) {
    	x = buf[i];
    	if (Math.abs(x)>=this.clipLevel) {
    		this.clipping = true;
    		this.lastClip = window.performance.now();
    	} else {
			this.clipping = false;
		}
    	sum += x * x ;
    }

    var rms =  Math.pow(sum / bufLength,0.3);
    this.volume = Math.max(rms, this.volume*this.averaging);
}

function randomizeArray(unshuffled) {
	
	var arr = unshuffled.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value); // shuffle once
	
    for (var i = arr.length - 1; i > 0; i--) {  // shuffle twice
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
	return arr
}

function joinRoom(roomname){
	if (roomname.length){
		roomname = sanitizeRoomName(roomname);
		log("Join room");
		log(roomname);
		session.joinRoom(roomname).then(function(response){  // callback from server; we've joined the room. Just the listing is returned
			
			if (session.joiningRoom === "seedPlz"){ // allow us to seed, now that we have joined the room.
				session.joiningRoom = false; // joined
				session.seedStream();
			} else {
				session.joiningRoom = false;  // no seeding callback
			}

			log("Members in Room");
			log(response);
			
			if (session.randomize===true){
				response = randomizeArray(response);
				log("Randomized List of Viewers");
				log(response);
				for (var i in response){
					if ("UUID" in response[i]){
						if ("streamID" in response[i]){
							if (response[i].UUID in session.rpcs){
								log("RTC already connected"); /// lets just say instead of Stream, we have 
							} else {
								log(response[i].streamID);
								var streamID = session.desaltStreamID(response[i].streamID);
								log("STREAM ID DESALTED 3: "+streamID);
								setTimeout(function(sid){play(sid);} ,(Math.floor(Math.random()*100)), streamID); // add some furtherchance with up to 100ms added latency							
							}
						}
					}
				}
			} else {
				for (var i in response){
					if ("UUID" in response[i]){
						if ("streamID" in response[i]){
							if (response[i].UUID in session.rpcs){
								log("RTC already connected"); /// lets just say instead of Stream, we have 
							} else {
								log(response[i].streamID);
								var streamID = session.desaltStreamID(response[i].streamID);
								log("STREAM ID DESALTED 3: "+streamID);
								play(streamID);  // play handles the group room mechanics here
							}
						}
					}
				}
			}
		},function(error){return {};});
	} else {
		log("Room name not long enough or contained all bad characaters");
	}	
}

function createRoom(roomname=false){
	
	if (roomname==false){
		roomname = getById("videoname1").value;
		roomname = sanitizeRoomName(roomname);
		if (roomname.length!=0){
			updateURL("director="+roomname); // make the link reloadable.
		}
	}
	if (roomname.length==0){
		if (!(session.cleanOutput)){
			alert("Please enter a room name before continuing");
		}
		return;
	}
	log(roomname);
	session.roomid = roomname;
	
	getById("dirroomid").innerHTML =  decodeURIComponent(session.roomid);
	getById("roomid").innerHTML = session.roomid;
	
	var passwordRoom = getById("passwordRoom").value;
	passwordRoom = sanitizePassword(passwordRoom);
	if (passwordRoom.length){
		session.password=passwordRoom;
		session.defaultPassword = false;
		updateURL("password="+session.password);
	}
	
	var passAdd="";
	var passAdd2="";
	
	if ((session.defaultPassword === false) && (session.password)){
			passAdd2="&password="+session.password;
			return session.generateHash(session.password+session.salt,4).then(function(hash){
				passAdd="&hash="+hash;
				createRoomCallback(passAdd, passAdd2);
			});
	} else {
		createRoomCallback(passAdd, passAdd2);
	}
}

function createRoomCallback(passAdd, passAdd2){

	var gridlayout = getById("gridlayout");
	gridlayout.classList.add("directorsgrid");

	formSubmitting = false;

	var m = getById("mainmenu");
	m.remove();

	getById("head1").className = 'advanced';
	getById("head2").className = 'advanced';
	getById("head3").className = 'advanced';
	getById("head4").className = '';

	try{
		if (session.label===false){
			if (document.title==""){
				document.title = "Control Room";
			} else {
				document.title += " - Control Room";
			}
		}
	} catch(e){errorlog(e);};
	

	session.director = true;
	getById("reshare").parentNode.removeChild(getById("reshare"));
	getById("chatbutton").classList.remove("advanced");
	getById("controlButtons").style.display = "inherit";
	getById("mutespeakerbutton").classList.remove("advanced");
	//getById("mutespeakerbutton").style.display = null;
	session.speakerMuted = true; // the director will start with audio playback muted.
	toggleSpeakerMute(true);
	
	
	gridlayout.innerHTML = "<div class='directorContainer'>\
	<div class='directorBlock'><h2>GUEST INVITE</h2>\
	<span data-translate='invite-users-to-join'>Invites users to join the group and broadcast their feed to it. They will see and hear other guests in the same room.\
	These users will see every feed in the room.</span>\
	<a onclick='popupMessage(event);copyFunction(this)' onmousedown='copyFunction(this)'\
	class='task grabLinks' style='cursor:copy' \
	href='https://"+location.host+location.pathname+"?room="+session.roomid+passAdd+"' '>\
	https://"+location.host+location.pathname+"?room="+session.roomid+passAdd+"</a>\
	<button class='pull-right grey' style='font-size:1.2em' onclick='popupMessage(event);copyFunction(this.previousElementSibling )'><i class='las la-video'></i>Copy link</button></div>"
	
	+ "<div class='directorBlock'><h2>BROADCAST INVITE</h2>\
	<span data-translate='link-to-invite-camera'>Link to invite users to broadcast their feeds to the group. These users will not see or hear any feed from the group.</span>\
	<a class='task grabLinks' style='cursor:copy' onclick='popupMessage(event);copyFunction(this)' onmousedown='copyFunction(this)'\
	href='https://"+location.host+location.pathname+"?room="+session.roomid+passAdd+"&view' '>\
	https://"+location.host+location.pathname+"?room="+session.roomid+passAdd+"&view</a>\
	<button class='pull-right grey' style='font-size:1.2em;' onclick='popupMessage(event);copyFunction(this.previousElementSibling )'><i class='las la-video'></i>Copy link</button></div>"
	
	+ "<div class='directorBlock'><h2>SCENE LINK: MANUAL</h2>\
	<span data-translate='this-is-obs-browser-source-link'>This is an OBS Browser Source link that is empty by default. Click 'add to scene' for each guest you want included in this scene</span>\
	<a class='task grabLinks'\
	onmousedown='copyFunction(this)' \
	data-drag='1' draggable='true'  \
	onclick='popupMessage(event);copyFunction(this)' \
	href='https://"+location.host+location.pathname+"?scene=1&room="+session.roomid+passAdd2+"''>\
	https://"+location.host+location.pathname+"?scene=1&room="+session.roomid+passAdd2+"</a>\
	<button class='pull-right grey' style='font-size:1.2em;' onclick='popupMessage(event);copyFunction(this.previousElementSibling )'><i class='las la-th-large' aria-hidden='true'></i></i>Copy link</button></div>"
	
	+ "<div class='directorBlock'><h2>SCENE LINK: AUTO</h2>\
	<span data-translate='this-is-obs-browser-souce-link-auto'>Also an OBS Browser Source link. All guest videos in this group chat room will automatically be added into this scene.</span>\
	<a class='task grabLinks' onmousedown='copyFunction(this)' draggable='true' data-drag='1'\
	onclick='popupMessage(event);copyFunction(this)'\
	href='https://"+location.host+location.pathname+"?scene=0&room="+session.roomid+passAdd2+"' >https://"+location.host+location.pathname+"?scene=0&room="+session.roomid+passAdd2+"</a>\
	<button class='pull-right grey' style='font-size:1.2em;' onclick='popupMessage(event);copyFunction(this.previousElementSibling )'><i class='las la-th-large'></i>Copy link</button></div>"
	+ "</div>";
	
	if (getById("roomTemplate")){
		gridlayout.innerHTML += getById("roomTemplate").innerHTML;
	}
	
	joinRoom(session.roomid);

}


function createControlBox(UUID, soloLink, streamID){
	if (document.getElementById("deleteme")){
		getById("deleteme").parentNode.removeChild(getById("deleteme"));
	}
	var controls = getById("controls_blank").cloneNode(true);
	
	var container = document.createElement("div");	
	container.id = "container_"+UUID; // needed to delete on user disconnect
	container.className = "vidcon";
	container.style.margin="15px 20px 0 0 ";
	
	controls.style.display = "block";
	controls.id = "controls_"+UUID;
	getById("guestFeeds").appendChild(container); 
	
	var buttons = "<div class='streamID' onmousedown='copyFunction(this.firstElementChild.innerText)' onclick='popupMessage(event);copyFunction(this.firstElementChild.innerText)'>ID:<span style='user-select: none;'> "+streamID+"</span>\
	<i class='las la-copy' title='Copy this Stream ID to the clipboard' style='cursor:pointer'></i>\
	<span id='label_"+UUID+"'></span>\
	</div>";

	var videoContainer = document.createElement("div");	
	videoContainer.id = "videoContainer_"+UUID; // needed to delete on user disconnect
	videoContainer.style.margin="0";

	controls.innerHTML += "<div>\
		<div style='padding:5px;word-wrap: break-word; overflow:hidden; white-space: nowrap; overflow: hidden; font-size:0.7em; text-overflow: ellipsis;' title='A direct solo view of the video/audio stream with nothing else. Its audio can be remotely controlled from here'> \
		<a class='soloLink' data-drag='1' draggable='true' onmousedown='copyFunction(this)' onclick='popupMessage(event);copyFunction(this)' \
		value='"+soloLink+"' href='"+soloLink+"'/>"+soloLink+"</a>\
		<button class='pull-right' style='width:100%;' onmousedown='copyFunction(this.previousElementSibling)' onclick='popupMessage(event);copyFunction(this.previousElementSibling)'><i class='las la-user'></i> copy Solo link</button>\
		</div></div>";
		
	controls.querySelectorAll('[data-action-type]').forEach((ele)=>{  // give action buttons some self-reference
		ele.dataset.UUID = UUID;
	});

	container.innerHTML = buttons;
	container.appendChild(videoContainer);
	container.appendChild(controls);
}

function createDirectorCam(vid){
	vid.style.width="80px";
	vid.style.height="35px";
	vid.style.padding ="0";
	getById("press2talk").innerHTML = "<span data-translate='Push-to-Mute'>🔴 Push to Mute</span>";
	getById("press2talk").outerHTML += '<button class="grey" style="margin: 10px 15px;" onclick="toggleSettings()"><i class="las la-cog"></i></button>';
	getById("miniPerformer").appendChild(vid);
	getById("press2talk").dataset.enabled="true";
	session.muted=false;
	toggleMute(true);
}

function press2talk(){
	var ele = getById("press2talk");
	ele.style.minWidth="127px";
	ele.style.padding="7px";
	if (!session.directorEnabledPPT){
		ele.innerHTML = "<span data-translate='Push-to-Mute'>🔴 Push to Mute</span>";
		session.publishDirector();
		session.muted=false;
		toggleMute(true);
		return;
	}
	toggleMute();
}


function toggle(ele, tog=false, inline=true) {
  var x = ele;
  if (x.style.display === "none") {
	if(inline){
		x.style.display = "inline-block";
	} else {
		x.style.display = "block";
	}
  } else {
    x.style.display = "none";
  }
  if (tog){
	  if (tog.dataset.saved){
		  tog.innerHTML= tog.dataset.saved;
		  delete(tog.dataset.saved);
	  } else {
		  tog.dataset.saved = tog.innerHTML;
		  tog.innerHTML = "Hide This";
	  }
  }
}

function enumerateDevices() {
	
	log("enumerated start");
	
	if (typeof navigator.enumerateDevices === "function") {
		log("enumerated failed 1");
		return navigator.enumerateDevices();
	} else if (typeof navigator.mediaDevices === "object" && typeof navigator.mediaDevices.enumerateDevices === "function") {
		return navigator.mediaDevices.enumerateDevices();
	} else {
		return new Promise((resolve, reject) => {
			try {
				if (window.MediaStreamTrack == null || window.MediaStreamTrack.getSources == null) {
					throw new Error();
				}
				window.MediaStreamTrack.getSources((devices) => {
					resolve(devices
						.filter(device => {
							return device.kind.toLowerCase() === "video" || device.kind.toLowerCase() === "videoinput";
						})
						.map(device => {
							return {
								deviceId: device.deviceId != null ? device.deviceId : "",
								groupId: device.groupId,
								kind: "videoinput",
								label: device.label,
								toJSON: /* istanbul ignore next */ function () {
									return this;
								}
							};
						}));
				});
			}
			catch (e) {
				errorlog(e);
			}
		});
	}
}

function requestOutputAudioStream(){
	try {
		warnlog("GET USER MEDIA");
		return navigator.mediaDevices.getUserMedia({audio:true, video:false }).then(function(stream1){ // Apple needs thi to happen before I can access EnumerateDevices. 
			log("get media sources; request audio stream");
			  return enumerateDevices().then(function(deviceInfos){
					stream1.getTracks().forEach(function(track) { // We don't want to keep it without audio; so we are going to try to add audio now.
						track.stop(); // I need to do this after the enumeration step, else it breaks firefox's labels
					});
					const audioOutputSelect = document.querySelector('#outputSourceScreenshare');
					audioOutputSelect.remove(0);
					audioOutputSelect.removeAttribute("onclick");
					
					for (let i = 0; i !== deviceInfos.length; ++i) {
							const deviceInfo = deviceInfos[i];
							if (deviceInfo==null){continue;}
							const option = document.createElement('option');
							option.value = deviceInfo.deviceId;
							if (deviceInfo.kind === 'audiooutput') {
								const option = document.createElement('option');
								option.value = deviceInfo.deviceId || "default";
								if (option.value == session.sink){
									option.selected = true;
								}
								option.text = deviceInfo.label || `Speaker ${audioOutputSelect.length + 1}`;
								audioOutputSelect.appendChild(option);
							} else {
								log('Some other kind of source/device: ', deviceInfo);
							}
					}
			  });
	  });
   } catch (e){
	   if (!(session.cleanOutput)){
		   if (window.isSecureContext) {
				alert("An error has occured when trying to access the default audio device. The reason is not known.");
		   } else if ((iOS) || (iPad)){
				alert("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
		   } else {
				alert("Error acessing the default audio device.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
		   }
	   }
   }
}


function requestAudioStream(){
	try {
		warnlog("GET USER MEDIA");
		return navigator.mediaDevices.getUserMedia({audio:true, video:false }).then(function(stream1){ // Apple needs thi to happen before I can access EnumerateDevices. 
			log("get media sources; request audio stream");
			  return enumerateDevices().then(function(deviceInfos){
					stream1.getTracks().forEach(function(track) { // We don't want to keep it without audio; so we are going to try to add audio now.
						track.stop(); // I need to do this after the enumeration step, else it breaks firefox's labels
					});
					log("updating audio");
					const audioInputSelect = document.querySelector('select#audioSourceScreenshare');
					audioInputSelect.remove(1);
					audioInputSelect.removeAttribute("onchange");
									
					
					for (let i = 0; i !== deviceInfos.length; ++i) {
							const deviceInfo = deviceInfos[i];
							if (deviceInfo==null){continue;}
							const option = document.createElement('option');
							option.value = deviceInfo.deviceId;
							if (deviceInfo.kind === 'audioinput') {
								option.text = deviceInfo.label || `Microphone ${audioInputSelect.length + 1}`;
								audioInputSelect.appendChild(option);
							} else {
								log('Some other kind of source/device: ', deviceInfo);
							}
					}
					audioInputSelect.style.minHeight = ((audioInputSelect.childElementCount + 1)*1.15 * 16) + 'px';
					audioInputSelect.style.minWidth = "342px";
			  });
	  });
   } catch (e){
	   if (!(session.cleanOutput)){
		   if (window.isSecureContext) {
				alert("An error has occured when trying to access the default audio device. The reason is not known.");
		   } else if ((iOS) || (iPad)){
				alert("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
		   } else {
				alert("Error acessing the default audio device.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
		   }
	   }
   }
}


function gotDevices(deviceInfos) { // https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js#L19

	log("got devices!");
	log(deviceInfos);
	try{
		const audioInputSelect = document.querySelector('#audioSource');
		
		audioInputSelect.innerHTML = "";

		var option = document.createElement('input');
		option.type="checkbox";
		option.value = "ZZZ";
		option.name = "multiselect1";
		option.id = "multiselect1";
		option.style.display = "none";
		option.checked = true;
		
		
		var label = document.createElement('label');
		label.for = option.name;
		label.innerHTML = '<span data-translate="no-audio">No Audio</span>';
		
		var listele = document.createElement('li');
		listele.appendChild(option);
		listele.appendChild(label);
		audioInputSelect.appendChild(listele);
		
		
		option.onchange = function(event){  // make sure to clear 'no audio option' if anything else is selected
			if (!(getById("multiselect1").checked)){
				getById("multiselect1").checked= true;
				log("CHECKED 1");
			} else {
				$(this).parent().parent().find('input[type="checkbox"]').not('#multiselect1').prop('checked', false); // EVIL, but validated.
			}
		};
		
		getById('multiselect-trigger').dataset.state = '0';
		getById('multiselect-trigger').classList.add('closed');
		getById('multiselect-trigger').classList.remove('open'); 
		getById('chevarrow1').classList.add('bottom');
		
		const videoSelect = document.querySelector('select#videoSource');
		const audioOutputSelect = document.querySelector('#outputSource');
		const selectors = [ videoSelect];

		const values = selectors.map(select => select.value);
		selectors.forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});
		
		
		function comp(a, b) {
			if (a.kind === 'audioinput'){return 0;}
			else if (a.kind === 'audiooutput'){return 0;}
			const labelA = a.label.toUpperCase();
			const labelB = b.label.toUpperCase();
			if (labelA > labelB) { return 1;} 
			else if (labelA < labelB) {	return -1;	}
			return 0;
		}
		//deviceInfos.sort(comp); // I like this idea, but it messes with the defaults.  I just don't know what it will do.
		
		// This is to hide NDI from default device. NDI Tools fucks up.
		var tmp = [];
		for (let i = 0; i !== deviceInfos.length; ++i) {
			deviceInfo = deviceInfos[i];
			if (!((deviceInfo.kind === 'videoinput')  &&  (deviceInfo.label.toLowerCase().startsWith("ndi") || deviceInfo.label.toLowerCase().startsWith("newtek")))){
				tmp.push(deviceInfo);
			}
		}
		
		for (let i = 0; i !== deviceInfos.length; ++i) {
			deviceInfo = deviceInfos[i];
			if ((deviceInfo.kind === 'videoinput')  &&  (deviceInfo.label.toLowerCase().startsWith("ndi") || deviceInfo.label.toLowerCase().startsWith("newtek"))){
				tmp.push(deviceInfo);
				log("V DEVICE FOUND = "+deviceInfo.label.replace(/[\W]+/g,"_").toLowerCase());
			}
		}
		deviceInfos = tmp;
		log(deviceInfos);
		
		if ((session.audioDevice) && (session.audioDevice!==1)){  // this sorts according to users's manual selection
			var tmp = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if ((deviceInfo.kind === 'audioinput')  &&  (deviceInfo.label.replace(/[\W]+/g,"_").toLowerCase().startsWith(session.audioDevice))){
					tmp.push(deviceInfo);
					log("A DEVICE FOUND = "+deviceInfo.label.replace(/[\W]+/g,"_").toLowerCase());
				}
			}
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (!((deviceInfo.kind === 'audioinput')  &&  (deviceInfo.label.replace(/[\W]+/g,"_").toLowerCase().startsWith(session.audioDevice)))){
					tmp.push(deviceInfo);
				}
			}
			
			deviceInfos = tmp;
			log(session.audioDevice);
			log(deviceInfos);
		}
		
		
		if ((session.videoDevice) && (session.videoDevice!==1)){  // this sorts according to users's manual selection
			var tmp = [];
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if ((deviceInfo.kind === 'videoinput')  &&  (deviceInfo.label.replace(/[\W]+/g,"_").toLowerCase().startsWith(session.videoDevice))){
					tmp.push(deviceInfo);
					log("V DEVICE FOUND = "+deviceInfo.label.replace(/[\W]+/g,"_").toLowerCase());
				}
			}
			for (let i = 0; i !== deviceInfos.length; ++i) {
				deviceInfo = deviceInfos[i];
				if (!((deviceInfo.kind === 'videoinput')  &&  (deviceInfo.label.replace(/[\W]+/g,"_").toLowerCase().startsWith(session.videoDevice)))){
					tmp.push(deviceInfo);
				}
			}
			deviceInfos = tmp;
			log("VDECICE:"+session.videoDevice);
			log(deviceInfos);
		}
		
		
		var counter = 1;
		for (let i = 0; i !== deviceInfos.length; ++i) {
			const deviceInfo = deviceInfos[i];
			if (deviceInfo==null){continue;}
			
			if (deviceInfo.kind === 'audioinput') {
				option = document.createElement('input');
				option.type="checkbox";
				counter++;
				listele = document.createElement('li');
				if (counter==2){
					option.checked=true;
					listele.style.display="block";
					option.style.display="none";
					getById("multiselect1").checked = false;
					getById("multiselect1").parentNode.style.display="none";
				} else {
					listele.style.display="none";
				}
				
				
				option.value = deviceInfo.deviceId || "default";
				option.name = "multiselect"+counter;
				option.id = "multiselect"+counter;
				label = document.createElement('label');
				label.for = option.name;
				
				label.innerHTML = " " + (deviceInfo.label || ("microphone "+ ((audioInputSelect.length || 0)+1)));
				
				listele.appendChild(option);
				listele.appendChild(label);
				audioInputSelect.appendChild(listele);
				
				option.onchange = function(event){  // make sure to clear 'no audio option' if anything else is selected
					getById("multiselect1").checked = false;
					log("UNCHECKED");
					if (!(CtrlPressed)){ 
						document.querySelectorAll("#audioSource input[type='checkbox']").forEach(function(item) {
						  if (event.currentTarget.id !== item.id){
							  item.checked = false;
						  } else {
							  item.checked = true;
						  }
						});
					}
				};
		
			} else if (deviceInfo.kind === 'videoinput') {
				option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
				videoSelect.appendChild(option);
			} else if (deviceInfo.kind === 'audiooutput'){
				option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				if (option.value == session.sink){
					option.selected = true;
				}
				option.text = deviceInfo.label || `Speaker ${outputSelect.length + 1}`;
				audioOutputSelect.appendChild(option);
			} else {
				log('Some other kind of source/device: ', deviceInfo);
			}
		}
		
		if (audioOutputSelect.childNodes.length==0){
			option = document.createElement('option');
			option.value = "default";
			option.text = "System Default";
			audioOutputSelect.appendChild(option);
		}
		
		
		option = document.createElement('option');
		option.text = "Disable Video";
		option.value = "ZZZ";
		videoSelect.appendChild(option); // NO AUDIO OPTION
		
		selectors.forEach((select, selectorIndex) => {
			if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
				select.value = values[selectorIndex];
			}
		});
		
	} catch (e){
		errorlog(e);
	}
}


if (location.protocol !== 'https:') {
	if (!(session.cleanOutput)){
		alert("SSL (https) is not enabled. This site will not work without it!");
	}
}


function getUserMediaVideoParams(resolutionFallbackLevel, isSafariBrowser) {
	switch (resolutionFallbackLevel) {
		case 0:
			if (isSafariBrowser) {
				return {
					width: { min: 360, ideal: 1920, max: 1920 },
					height: { min: 360, ideal: 1080, max: 1080 }
					};
			} else {
				return {
					width: { min: 720, ideal: 1920, max: 1920 },
					height: { min: 720, ideal: 1080, max: 1920 }
				};
			}
		case 1:
			if (isSafariBrowser) {
				return {
					width: { min: 360, ideal: 1280, max: 1280 },
					height: { min: 360, ideal: 720, max: 720 }
					};
			} else {
				return {
					width: { min: 720, ideal: 1280, max: 1280 },
					height: { min: 720, ideal: 720, max: 1280 }
				};
			}
		case 2:
			if (isSafariBrowser) {
				return {
					width: { min: 640 },
					height: { min: 360 }
				};
			} else {
				return {
					width: { min: 240, ideal: 640, max: 1280 },
					height: { min: 240, ideal: 360, max: 1280 }
				};
			}
		case 3:
			if (isSafariBrowser) {
				return {
					width: { min: 360, ideal: 1280, max: 1440 }
				};
			}
			else {
				return {
					width: { min: 360, ideal: 1280, max: 1440 }
				};
			}
		case 4:
			if (isSafariBrowser) {
				return {
					height: { min: 360, ideal: 720, max: 960 }
				};
			}
			else {
				return {
					height: { ideal: 720, max: 960 }
				};
			}
		case 5:
			if (isSafariBrowser) {
				return {
					width: { min: 360, ideal: 640, max: 1440 },
					height: { min: 360, ideal: 360, max: 720 }
				};
			}
			else {
				return {
					width: { ideal:640, max:1920}, 
					height: { ideal: 360, max:1920}}; // same as default, but I didn't want to mess with framerates until I gave it all a try first
			}
		case 6:
			if (isSafariBrowser) {
				return {}; // iphone users probably don't need to wait any longer, so let them just get to it
			}
			else {
				return {
					width: { min: 360, ideal: 640, max: 3840 },
					height: { min: 360, ideal: 360, max: 2160 }
				};
				
			}
		case 7:
			return { // If the camera is recording in low-light, it may have a low framerate. It coudl also be recording at a very high resolution.
				width: { min: 360, ideal: 640 },
				height: { min: 360, ideal: 360 },
			};

		case 8:
			return {
				width: {min:360}, 
				height: {min:360},
				frameRate: 10
				}; // same as default, but I didn't want to mess with framerates until I gave it all a try first
		case 9:
			return {frameRate: 0 };  // Some Samsung Devices report they can only support a framerate of 0.
		case 10:
			return {}
		default:
			return {}; 
	}
}

function addScreenDevices(device){
	
	if (device.kind=="audio"){
		const audioInputSelect = document.querySelector('#audioSource3');
		const listele = document.createElement('li');
		listele.style.display="block";
		const option = document.createElement('input');
		option.type="checkbox";
		option.checked = true;		
		
		if (getById('multiselect-trigger3').dataset.state==0){
			option.style.display = "none";
		}
		
		option.value = device.id;
		option.name = device.label;
		option.dataset.type = "screen";
		const label = document.createElement('label');
		label.for = option.name;
		label.innerHTML = " "+device.label;
		listele.appendChild(option);
		listele.appendChild(label);
		
		option.onchange = function(event){  // make sure to clear 'no audio option' if anything else is selected
			if (!(CtrlPressed)){ 
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
					log(event.currentTarget);
					log(item);
				  if (event.currentTarget.value !== item.value){ // this shoulnd't happen, but if it does.
					item.checked = false;
					activatedPreview=false;
					grabAudio("videosource","#audioSource3"); // exclude item.id
					
					if (item.dataset.type == "screen"){
						item.parentElement.parentElement.removeChild(item.parentElement);
					}
					
				  } else {
					  
					event.currentTarget.checked = true;
					activatedPreview=false;
					grabAudio("videosource","#audioSource3",item.value); // exclude item.id. 
				  }
				});
			}
			
			event.stopPropagation();
			return false;
		};
		audioInputSelect.appendChild(listele);
		getById("audioSourceNoAudio2").checked=false;
		
	} else if (device.kind=="video"){
		const videoSelect = document.querySelector('select#videoSource3');
		//const selectors = [ videoSelect];
		//const values = selectors.map(select => select.value);
		const option = document.createElement('option');
		option.value = device.label;
		option.text = device.label;
		option.selected = true;
		videoSelect.appendChild(option);
	}
}

function gotDevices2(deviceInfos){
	log("got devices!");
	log(deviceInfos);
	
	try{
		const audioInputSelect = document.querySelector('#audioSource3');
		const videoSelect = document.querySelector('select#videoSource3');
		const audioOutputSelect = document.querySelector('#outputSource3');
		const selectors = [ videoSelect];
							

		[audioInputSelect].forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});
		
		const values = selectors.map(select => select.value);
		selectors.forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});
		
		[audioOutputSelect].forEach(select => {
			while (select.firstChild) {
				select.removeChild(select.firstChild);
			}
		});
		
		var counter = 0;
		for (let i = 0; i !== deviceInfos.length; ++i){
			const deviceInfo = deviceInfos[i];
			if (deviceInfo==null){continue;}
			
			if (deviceInfo.kind === 'audioinput') {
				const option = document.createElement('input');
				option.type="checkbox";
				counter++;
				const listele = document.createElement('li');
				listele.style.display="none";
				
				try {
					getById("videosource").srcObject.getAudioTracks().forEach(function(track){
						if (deviceInfo.label==track.label){
							option.checked = true;
							listele.style.display="inherit";
						} 
					});
				} catch(e){errorlog(e);}
				
				option.style.display = "none"
				option.value = deviceInfo.deviceId || "default";
				option.name = "multiselecta"+counter;
				option.id = "multiselecta"+counter;
				
				const label = document.createElement('label');
				label.for = option.name;
				
				label.innerHTML = " " + (deviceInfo.label || ("microphone "+ ((audioInputSelect.length || 0)+1)));
				
				listele.appendChild(option);
				listele.appendChild(label);
				audioInputSelect.appendChild(listele);
				
				option.onchange = function(event){  // make sure to clear 'no audio option' if anything else is selected
					if (!(CtrlPressed)){
						document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
							if (event.currentTarget.value !== item.value){
								item.checked = false;
								if (item.dataset.type == "screen"){
									item.parentElement.parentElement.removeChild(item.parentElement);
								}
							} else {
								item.checked = true;
							}
						});
					} else {
						getById("audioSourceNoAudio2").checked=false;
					}
				};
		
			} else if (deviceInfo.kind === 'videoinput'){
				const option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
				try {
					getById("videosource").srcObject.getVideoTracks().forEach(function(track){
						if (option.text==track.label){
							option.selected = true;
						}
					});
				} catch(e){errorlog(e);}
				videoSelect.appendChild(option);
				
			} else if (deviceInfo.kind === 'audiooutput'){
				const option = document.createElement('option');
				option.value = deviceInfo.deviceId || "default";
				if (option.value == session.sink){
					option.selected = true;
				}
				option.text = deviceInfo.label || `Speaker ${outputSelect.length + 1}`;
				audioOutputSelect.appendChild(option);
				
			} else {
				log('Some other kind of source/device: ', deviceInfo);
			}
		}
		
		if (audioOutputSelect.childNodes.length==0){
			const option = document.createElement('option');
			option.value = "default";
			option.text = "System Default";
			audioOutputSelect.appendChild(option);
		}
		
		////////////
		
		session.streamSrc.getAudioTracks().forEach(function(track){ // add active ScreenShare audio tracks to the list
			log("Checking for screenshare audio");
			log(track);
			var matched=false;
			for (var i = 0; i !== deviceInfos.length; ++i){
				var deviceInfo = deviceInfos[i];
				if (deviceInfo==null){continue;}
				
				if (track.label == deviceInfo.label){
					matched=true;
					continue;
				}
			}
			if (matched==false){ // Not a gUM device
			
				var listele = document.createElement('li');
				listele.style.display="block";
				var option = document.createElement('input');
				option.type="checkbox";
				option.value = track.id;
				option.checked = true;
				option.style.display = "none";
				option.name = track.label;
				option.dataset.type="screen";
				const label = document.createElement('label');
				label.for = option.name;
				label.innerHTML = " "+track.label;
				listele.appendChild(option);
				listele.appendChild(label);
				option.onchange = function(event){  // make sure to clear 'no audio option' if anything else is selected
					if (!(CtrlPressed)){
						document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
						  if (event.currentTarget.value !== item.value){ // this shoulnd't happen, but if it does.
							item.checked = false;
							activatedPreview=false;
							if (item.dataset.type == "screen"){
								item.parentElement.parentElement.removeChild(item.parentElement);
							}
							grabAudio("videosource","#audioSource3"); // exclude item.id
						  } else {
							  
							event.currentTarget.checked = true;
							activatedPreview=false;
							grabAudio("videosource","#audioSource3",item.value); // exclude item.id. 
						  }
						});
					} else {
						getById("audioSourceNoAudio2").checked=false;
					}
					event.stopPropagation();
					return false;
				};
				audioInputSelect.appendChild(listele);
			}
		});
		/////////// no video option
		
		option = document.createElement('option'); // no video
		option.text = "Disable Video";
		option.value = "ZZZ";
		if (session.streamSrc.getVideoTracks().length==0){
			option.selected = true;
		} 
		videoSelect.appendChild(option); 
		
		
		/////////////  /// NO AUDIO appended option
		
		var option = document.createElement('input');  
		option.type="checkbox";
		option.value = "ZZZ";
		option.style.display = "none"
		option.id = "audioSourceNoAudio2";
		
		var label = document.createElement('label');
		label.for = option.name;
		label.innerHTML = " No Audio";
		var listele = document.createElement('li');
		
		if (session.streamSrc.getAudioTracks().length==0){
			option.checked = true;
		} else {
			listele.style.display="none";
			option.checked = false;
		}	
		option.onchange = function(event){  // make sure to clear 'no audio option' if anything else is selected
			if (!(CtrlPressed)){
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
					if (event.currentTarget.value !== item.value){
						item.checked = false;
						if (item.dataset.type == "screen"){
							item.parentElement.parentElement.removeChild(item.parentElement);
						}
					} else {
						item.checked = true;
					}
				});
			} else {
				document.querySelectorAll("#audioSource3 input[type='checkbox']").forEach(function(item) {
					if (event.currentTarget.value === item.value){
						event.currentTarget.checked = true;
					} else {
						item.checked = false;
						if (item.dataset.type == "screen"){
							item.parentElement.parentElement.removeChild(item.parentElement);
						}
					}
				});
			}
		}; 
		listele.appendChild(option);
		listele.appendChild(label);
		audioInputSelect.appendChild(listele);
		
		////////////
		
		
		selectors.forEach((select, selectorIndex) => {
			if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
				select.value = values[selectorIndex];
			}
		});
		
		audioInputSelect.onchange = function(){
			activatedPreview=false;
			grabAudio("videosource","#audioSource3");
		};
		videoSelect.onchange = function(){
			log("video source changed");
			activatedPreview=false;
			grabVideo(session.quality, "videosource", "select#videoSource3");
		};
		
		audioOutputSelect.onchange = function(){
			var outputSelect = document.querySelector('select#outputSource3');
			session.sink = outputSelect.options[outputSelect.selectedIndex].value;
			//if (session.sink=="default"){session.sink=false;} else {
			getById("videosource").setSinkId(session.sink).then(() => {
				log("New Output Device:"+session.sink);
			}).catch(error => {
				errorlog(error);
			});
			for (UUID in session.rpcs){
				session.rpcs[UUID].videoElement.setSinkId(session.sink).then(() => {
					log("New Output Device for: "+UUID);
				}).catch(error => {
					errorlog(error);
				});
			}
		}
		
	} catch (e){
		errorlog(e);
	}
}

function playtone(screen=false){
	
	if (screen){
		var outputSelect = document.querySelector('select#outputSourceScreenshare');
		session.sink = outputSelect.options[outputSelect.selectedIndex].value;
	}
	
	var testtone= getById("testtone");
	if (testtone){
		if (session.sink){
			testtone.setSinkId(session.sink).then(() => {
				log("changing audio sink:"+session.sink);
				testtone.play();
			}).catch(error => {
				errolog("couldn't set sink");
				errorlog(error);
			});
		} else {
			testtone.play();
		}
	}
}

async function getAudioOnly(selector, trackid=null){
	var audioSelect = document.querySelector(selector).querySelectorAll("input"); 
	var audioList = [];
	var streams = [];
	log("getAudioOnly()");
	for (var i=0; i<audioSelect.length;i++){
		if (audioSelect[i].value=="ZZZ"){
			continue;
		} else if (trackid==audioSelect[i].value){ // skip already excluded
			continue;
		} else if (audioSelect[i].checked){
			log(audioSelect[i]);
			audioList.push(audioSelect[i]);
		}
	}
	
	for (var i=0; i<audioList.length;i++){
		
		if ((audioList[i].value=="default") && (session.echoCancellation!==false) && (session.autoGainControl!==false) && (session.noiseSuppression!==false)){
			var constraint = {audio: true};
		} else { // Just trying to avoid problems with some systems that don't support these features
			var constraint = {audio: {deviceId: {exact: audioList[i].value}}};
			if (session.echoCancellation==false){
				constraint.audio.echoCancellation=false;
			} 
			if (session.autoGainControl==false){
				constraint.audio.autoGainControl=false;
			}
			if (session.noiseSuppression==false){
				constraint.audio.noiseSuppression=false;
			}
		}
		constraint.video = false;
		warnlog(constraint);
		var stream = await navigator.mediaDevices.getUserMedia(constraint).timeout(15000).then(function (stream2){
			log("pushing stream2");
			return stream2;
		}).catch(errorlog); // More error reporting maybe?
		if (stream){
			streams.push(stream);
		}
	} 
	
	return streams;
}

function applyMirror(mirror, eleName='previewWebcam'){  // true unmirrors as its already mirrored
	
	var transFlip = "";
	var transNorm = "";
	if ((eleName=='videosource') && (session.windowed)){
		 transFlip = " translate(0, 50%)";
		 transNorm = " translate(0, -50%)";
	}
	
	if (session.mirrored==2){
		mirror=true;
	} else if (session.mirrored===0){
		mirror=true;
	}
	
	
	if (mirror){ 
		if (session.mirrored && session.flipped){
			 getById(eleName).style.transform = " scaleX(-1) scaleY(-1)"+transFlip;
			 getById(eleName).classList.add("mirrorControl");
		} else if (session.mirrored){
			 getById(eleName).style.transform = "scaleX(-1)"+transNorm;
			 getById(eleName).classList.add("mirrorControl");
		} else if (session.flipped){
			 getById(eleName).style.transform = "scaleY(-1) scaleX(1)"+transFlip;
			 getById(eleName).classList.remove("mirrorControl");
		} else {
			 getById(eleName).style.transform = "scaleX(1)"+transNorm; 
			 getById(eleName).classList.remove("mirrorControl");
		}
	} else {
		if (session.mirrored && session.flipped){
			 getById(eleName).style.transform = " scaleX(1) scaleY(-1)"+transFlip;
			 getById(eleName).classList.remove("mirrorControl");
		} else if (session.mirrored){
			 getById(eleName).style.transform = "scaleX(1)"+transNorm; 
			 getById(eleName).classList.remove("mirrorControl");
		} else if (session.flipped){
			 getById(eleName).style.transform = "scaleY(-1) scaleX(-1)"+transFlip;
			 getById(eleName).classList.add("mirrorControl");
		} else {
			 getById(eleName).style.transform = "scaleX(-1)"+transNorm;
			 getById(eleName).classList.add("mirrorControl");
		}
	}	
}


async function grabScreen(quality=0, audio=true){
	if (!navigator.mediaDevices.getDisplayMedia){
		if (!(session.cleanOutput)){
			setTimeout(function(){alert("Sorry, your browser is not supported. Please use the desktop versions of Firefox or Chrome instead");},1);
		}
		return false;
	}
	
	
	if (quality==0){  // I'm going to go with default quality in most cases, as I assume Dynamic screenshare is going to want low-fps / high def.
		var width = {ideal: 1920};
		var height = {ideal: 1080};
	} else if (quality==1){
		var width = {ideal: 1280};
		var height = {ideal: 720};
	} else if (quality==2){
		var width = {ideal: 640};
		var height = {ideal: 360};
	} else if (quality>=3){  // lowest
		var width = {ideal: 320};
		var height = {ideal: 180};
	}
	
	if (session.width){
		width = {ideal: session.width};
	}
	if (session.height){
		height = {ideal: session.height};
	}

	var constraints = { // this part is a bit annoying. Do I use the same settings?  I can add custom setting controls here later
		audio: {
			echoCancellation: false,   // For screen sharing, we want it off by default.
			autoGainControl: false, 
			noiseSuppression: false 
		}, 
		video: {width: width, height: height, mediaSource: "screen"}
		//,cursor: {exact: "none"}
	};

	if (session.echoCancellation==true){
		constraints.audio.echoCancellation=true;
	} 
	if (session.autoGainControl==true){
		constraints.audio.autoGainControl=true;
	}
	if (session.noiseSuppression==true){
		constraints.audio.noiseSuppression=true;
	}
	if (audio==false){
		constraints.audio=false;
	}
	
	if (session.framerate){
		constraints.video.frameRate = session.framerate;
	}	
	
	return navigator.mediaDevices.getDisplayMedia(constraints).then(function (stream) {
		log("adding video tracks 2245");
		
		var eleName = "videosource";
		try {
			var oldstream = getById(eleName).srcObject;
			if (oldstream){
				oldstream.getVideoTracks().forEach(function(track){
					track.stop();
					oldstream.removeTrack(track);
					log("stopping video track");
				});
			} else {
				getById(eleName).srcObject = new MediaStream();
				log("CREATE NEW STREAM");
			}
		} catch(e){
			errorlog(e);
		}
		
		try {
			stream.getVideoTracks()[0].onended = function () { // if screen share stops, 
				grabScreen();
			};
		} catch(e){log("No Video selected; screensharing?");}
		
		stream.getTracks().forEach(function(track){
			log(track);
			addScreenDevices(track);
			
			getById(eleName).srcObject.addTrack(track, stream); // Lets not add the audio to this preview; echo can be annoying
			session.streamSrc = getById(eleName).srcObject;
				
			if (track.kind == "video"){
				toggleVideoMute(true);
				for (UUID in session.pcs){
					try {
						if ((session.pcs[UUID].guest==true) && (session.roombitrate===0)) {
							log("room rate restriction detected. No videos will be published to other guests");
						} else  if (session.pcs[UUID].allowVideo==true){  // allow 
							var senders = session.pcs[UUID].getSenders(); // for any connected peer, update the video they have if connected with a video already.
							var added=false;
							senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
								if (sender.track){
									if (sender.track.kind == "video"){ 
										sender.replaceTrack(track);  // replace may not be supported by all browsers.  eek.
										added=true;
									} 
								}
							});
							if (added==false){
								session.pcs[UUID].addTrack(track, stream);
							}
						}
					} catch (e){
						errorlog(e);
					}
				}
			} else {
				toggleMute(true);  // I might want to move this outside the loop, but whatever
				for (UUID in session.pcs){
					try {
						if (session.pcs[UUID].allowAudio==true){
							session.pcs[UUID].addTrack(track, stream);
						}
					} catch (e){
						errorlog(log);
					}
				}
			}
		});
		
		applyMirror(true,eleName);
	}).catch(function(err){
		errorlog(err); /* handle the error */
		
		if ((err.name == "NotAllowedError") || (err.name == "PermissionDeniedError")){
			// User Stopped it.
		} else {
			if (audio==true){
				setTimeout(function(){grabScreen(quality, false);},1);
			}
			if (!(session.cleanOutput)){
				setTimeout(function(){alert(err);},1); // TypeError: Failed to execute 'getDisplayMedia' on 'MediaDevices': Audio capture is not supported
			}
		}
	});
}

		
var grabVideoTimer = null;
async function grabVideo(quality=0, eleName='previewWebcam', selector="select#videoSource"){
	if( activatedPreview == true){log("activated preview return 2");return;}
	activatedPreview = true;
	log("Grabbing video: "+quality);
	if (grabVideoTimer){
		clearTimeout(grabVideoTimer);
	}
	log("quality of grab:"+quality);
	log("element:"+eleName);
	getById(eleName).controls=false;
	
	try {
		var oldstream = getById(eleName).srcObject;
		if (oldstream){
			oldstream.getVideoTracks().forEach(function(track){
				track.stop();
				session.streamSrc = getById(eleName).srcObject;
				//track.enabled = false;
				oldstream.removeTrack(track);
				log("track removed");
				//log("stopping video track");
			});
		} else {
			log(getById(eleName));
			getById(eleName).srcObject = new MediaStream();
			session.streamSrc = getById(eleName).srcObject;
			log("CREATE NEW STREAM");
		}
	} catch(e){
		errorlog(e);
	}
		
	
	var videoSelect = document.querySelector(selector);
	var mirror=false;
	
	if (videoSelect.value == "ZZZ"){  // if there is no video, or if manually set to audio ready, then do this step.
		if (eleName=="previewWebcam"){
			if (session.autostart){
				publishWebcam();  // no need to mirror as there is no video...
				return;
			} else {
				updateStats();
				var gowebcam = getById("gowebcam");
				if (gowebcam){
					gowebcam.disabled = false;
					gowebcam.dataset.ready = "true";
					gowebcam.style.backgroundColor = "#3C3";
					gowebcam.style.color = "black";
					gowebcam.style.fontWeight="bold";
					gowebcam.innerHTML = "START";
				}
			}
		} else {  // If they disabled the video but not in preview mode; but actualy live. We will want to remove the stream from the publishing
				// we don't want to do this otherwise, as we are "replacing" the track in other cases.
				// this does cause a problem, as previous bitrate settings & resolutions might not be applied if switched back....  must test
			for (UUID in session.pcs){
				var senders = session.pcs[UUID].getSenders(); // for any connected peer, update the video they have if connected with a video already.
				senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
					if (sender.track){
						if (sender.track.kind == "video"){ 
							session.pcs[UUID].removeTrack(sender);  // replace may not be supported by all browsers.  eek.
							errorlog("DELETED SENDER");
						}
					}
				});
				
			}
		}
		// end
	} else {
		var sq=0;
		if (session.quality==false){
			sq = session.quality_wb;
		} else if (session.quality>2){  // 1080, 720, and 360p 
			sq = 2; // hacking my own code. TODO: ugly, so I need to revisit this. 
		} else {
			sq = session.quality;
		}
		
		if (quality<sq){
			quality=sq; // override the user's setting
		}

		if ((iOS) || (iPad)){  // iOS will not work correctly at 1080p; likely a h264 codec issue.
			if (quality==0){
				quality=1;
			}
		} 
	
		var constraints = {  
			audio: false,
			video: getUserMediaVideoParams(quality, iOS)
		};
		
		log("Quality selected:"+quality);
		var _, sUsrAg = navigator.userAgent;
		
		
		log(videoSelect.options[videoSelect.selectedIndex].text.includes("NDI Video"));
		
		if ((iOS) || (iPad)){
			constraints.video.deviceId =  {exact: videoSelect.value}; // iPhone 6s compatible ? Needs to be exact for iPhone 6s
			
		} else if (sUsrAg.indexOf("Firefox") > -1){
			constraints.video.deviceId =  {exact: videoSelect.value}; // Firefox is a dick. Needs it to be exact.
			
		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes("NDI Video")) {  // NDI does not like "EXACT"
			constraints.video.deviceId = videoSelect.value;
			
		} else {
			constraints.video.deviceId =  {exact: videoSelect.value}; //  Default. Should work for Logitech, etc.  
		}
		
		if (session.width){ 
			constraints.video.width = {exact: session.width}; // manually specified - so must be exact
		}
		if (session.height){
			constraints.video.height = {exact: session.height};
		}
		if (session.framerate){
			constraints.video.frameRate = {exact: session.framerate};
		} else if (session.maxframerate){
			constraints.video.frameRate = {max: session.maxframerate};
		}
		
		var obscam = false;
		log(videoSelect.options[videoSelect.selectedIndex].text);  
		if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("OBS-Camera")){  // OBS Virtualcam
			mirror=true;
			obscam = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("OBS Virtual Camera")){  // OBS Virtualcam
			mirror=true;
			obscam = true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes(" back")){  // Android
			mirror=true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes(" rear")){  // Android
			mirror=true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.includes("NDI Video")){ // NDI Virtualcam 
			mirror=true;
		} else if (videoSelect.options[videoSelect.selectedIndex].text.startsWith("Back Camera")){  // iPhone and iOS
			mirror=true;
		} else {
			mirror=false;
		}
		session.mirrorExclude = mirror;
		
		
		log(constraints);
		setTimeout(function(){
			navigator.mediaDevices.getUserMedia(constraints).timeout(10000).then(function(stream){
				
				log("adding video tracks 2412");
				stream.getVideoTracks().forEach(function(track){
					
					if (session.effects){
						applyEffects(eleName, track, stream);
					} else {
						getById(eleName).srcObject.addTrack(track, stream); // add video track to the preview video
						session.streamSrc = getById(eleName).srcObject;
					}
					
					toggleVideoMute(true);
					for (UUID in session.pcs){
						try {
							if (((iOS) || (iPad)) && (session.pcs[UUID].guest==true)){
								warnlog("iOS and GUest detected");
							} else if ((session.pcs[UUID].guest==true) && (session.roombitrate===0)) {
								log("room rate restriction detected. No videos will be published to other guests");
							} else  if (session.pcs[UUID].allowVideo==true){  // allow 
						
								var senders = session.pcs[UUID].getSenders(); // for any connected peer, update the video they have if connected with a video already.
								var added=false;
								senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
									if (sender.track){
										if (sender.track.kind == "video"){ 
											sender.replaceTrack(track);  // replace may not be supported by all browsers.  eek.
											added=true;
										}
									}
								});
								if (added==false){
									session.pcs[UUID].addTrack(track, stream); // can't replace, so adding
								}
							}
							
						} catch (e){
							errorlog(e);
						}
					}
					
				});
				
				applyMirror(mirror,eleName);
				
				if (eleName=="previewWebcam"){
					if (session.autostart){
						publishWebcam();
					} else {
						updateStats(obscam);
						var gowebcam = getById("gowebcam");
						if (gowebcam){
							gowebcam.disabled = false;
							gowebcam.dataset.ready = "true";
							gowebcam.style.backgroundColor = "#3C3";
							gowebcam.style.color = "black";
							gowebcam.style.fontWeight="bold";
							gowebcam.innerHTML = "START";
						}
					}
				}
				
				
				// Once crbug.com/711524 is fixed, we won't need to wait anymore. This is
				// currently needed because capabilities can only be retrieved after the
				// device starts streaming. This happens after and asynchronously w.r.t.
				// getUserMedia() returns.
				if (grabVideoTimer){
					clearTimeout(grabVideoTimer);
					if (eleName=="previewWebcam"){
						getById(eleName).controls=true;
					}
				}
				if (getById("popupSelector_constraints")){
					getById("popupSelector_constraints").innerHTML = "";
				}
				grabVideoTimer = setTimeout(function(){
					if (eleName=="previewWebcam"){
						getById(eleName).controls=true;
					}
					updateConstraintSliders();
					
					dragElement(getById(eleName));
				},1000);  // focus
				
				log("DONE - found stream");
			}).catch(function(e){
				activatedPreview = false;
				errorlog(e);
				if (e.name === "OverconstrainedError"){
					errorlog(e.message);
					log("Resolution or framerate didn't work");
				} else if (e.name === "NotReadableError"){
					if (quality<=10){
						grabVideo(quality+1, eleName, selector);
					} else {
						if (!(session.cleanOutput)){
							if (iOS){
								alert("An error occured. Closing existing tabs in Safari may solve this issue.");
							} else {
								alert("Error: Could not start video source.\n\nTypically this means the Camera is already be in use elsewhere. Most webcams can only be accessed by one program at a time.\n\nTry a different camera or perhaps try re-plugging in the device.");
							}
						}
						activatedPreview=true;
						if (getById('gowebcam')){
							getById('gowebcam').innerHTML="Problem with Camera";
						}
						
					}
					return;
				} else if (e.name === "NavigatorUserMediaError"){
					if (getById('gowebcam')){
						getById('gowebcam').innerHTML="Problem with Camera";
					}
					if (!(session.cleanOutput)){
						alert("Unknown error: 'NavigatorUserMediaError'"); 
					}
					return;
				} else if (e.name === "timedOut"){
					activatedPreview=true;
					if (getById('gowebcam')){
						getById('gowebcam').innerHTML="Problem with Camera";
					}
					if (!(session.cleanOutput)){
						alert(e.message);
					}
					return;
				} else {
					errorlog("An unknown camera error occured");
				}
				
				if (quality<=10){
					grabVideo(quality+1, eleName, selector);
				} else {
					errorlog("********Camera failed to work");
					activatedPreview=true;
					if (getById('gowebcam')){
						getById('gowebcam').innerHTML="Problem with Camera";
					}
					if (!(session.cleanOutput)){
						if (session.width || session.height || session.framerate){
							alert("Camera failed to load.\n\nPlease ensure your camera supports the resolution and framerate that has been manually specified. Perhaps use &quality=0 instead.");
						} else {
							alert("Camera failed to load.\n\nPlease make sure it is not already in use by another application.\n\nPlease make sure you have accepted the camera permissions.");
						}
					}
				}
			});
		},100);
	}
}


async function grabAudio(eleName="previewWebcam", selector="#audioSource", trackid = null){ // trackid is the excluded track
	if( activatedPreview == true){log("activated preview return 2");return;}
	activatedPreview = true;
	try {
		log("Resetting Audio Streams");
		var oldstream = getById(eleName).srcObject;
		if (oldstream){
			oldstream.getAudioTracks().forEach(function(track){
				if (track.id == trackid){return;} // excluded track
				
				for (UUID in session.pcs){
					try {
						const senders = session.pcs[UUID].getSenders();
						senders.forEach((sender) => {
							log(sender);
							try {
								if (sender.track){
									if (sender.track.id === track.id){ // Audio Track to be Replaced/Removed
										log("removing track from sender");
										session.pcs[UUID].removeTrack(sender);  // sender.replaceTrack(track);
									}
								}
							} catch (e){
								errorlog(e);
							}
						});
					} catch (e){
						errorlog(e);
					}
				};
				log("REMOVE AUDIO TRACK");
				oldstream.removeTrack(track);
				track.stop();
			});
		} else { // if no stream exists
			getById(eleName).srcObject = new MediaStream();
			log("CREATE NEW SOURCE FOR AUDIO");
		}
	} catch(e){
		errorlog(e);
	}
	
	var streams = await getAudioOnly(selector, trackid); // Get audio streams
	try {
		for (var i=0; i<streams.length;i++){
			streams[i].getAudioTracks().forEach(function(track){
				
				getById(eleName).srcObject.addTrack(track, streams[i]); // add video track to the preview video
				session.streamSrc = getById(eleName).srcObject;
				toggleMute(true);
					
				for (UUID in session.pcs){
					if (session.pcs[UUID].allowAudio==true){  // allow 
						var sender = session.pcs[UUID].addTrack(track, streams[i]);
						//sender.track.onended = tryAgain;
					}
				}
			});
		}
	} catch (e){
		errorlog(e);
	}
	
	if (streams.length){
		volumeStream(getById(eleName).srcObject);
	}
	var gowebcam = getById("gowebcam");
	if (gowebcam){
		gowebcam.disabled =false;
		gowebcam.dataset.ready = "true";
		gowebcam.style.backgroundColor = "#3C3";
		gowebcam.style.color = "black";
		gowebcam.style.fontWeight="bold";
		gowebcam.innerHTML = "START";
	}
}

var tryAgainTimer=null;

function tryAgain(event){  // audio or video agnostic track reconnect ------------not actually in use,.  maybe out of date
	warnlog(event.currentTarget);
	if (getById("videosource")==null){ // Don't bother with this if just a preview stream
		return;
	}
	
	var deviceType = event.currentTarget.kind;
	var deviceId= event.currentTarget.id;
	
	if (tryAgainTimer!=null){
		clearTimeout(tryAgainTimer);
		tryAgainTimer=null;
	}
	tryAgainTimer = setTimeout(function(){
		navigator.mediaDevices.ondevicechange = null;  // we only give it 10-seconds to reconnect.
	},10000);
	
	navigator.mediaDevices.ondevicechange = function(){
		clearTimeout(tryAgainTimer);
		tryAgainTimer=null;
		navigator.mediaDevices.ondevicechange=null; // clear
		
		
		if (deviceType=="audio"){
			if ((deviceId=="default") && (session.echoCancellation!==false) && (session.autoGainControl!==false) && (session.noiseSuppression!==false)){
				var constraint = {audio: true};
			} else { 
				var constraint = {audio: {deviceId: {exact: deviceId}}};
				if (session.echoCancellation==false){
					constraint.audio.echoCancellation=false;
				} 
				if (session.autoGainControl==false){
					constraint.audio.autoGainControl=false;
				}
				if (session.noiseSuppression==false){
					constraint.audio.noiseSuppression=false;
				}
			}
			constraint.video = false;
		} else if (deviceType=="video"){
			var constraint = {
				video: {deviceId: {exact: deviceId}},
				audio: false
			};
		} else {
			return;  // no idea what this is? fail gently.
		}
		
		warnlog(constraint);
		navigator.mediaDevices.getUserMedia(constraint).timeout(3000).then(function (stream){
			stream.getTracks().forEach(function(track){
				
				getById("videosource").srcObject.addTrack(track, stream); // add video track to the preview video
				session.streamSrc = getById(eleName).srcObject;
				toggleMute(true);
					
				for (UUID in session.pcs){
					if (session.pcs[UUID].allowAudio==true){  // allow  
						var senders = session.pcs[UUID].getSenders(); // for any connected peer, update the video they have if connected with a video already.
						var added=false;
						senders.forEach((sender) => { // I suppose there could be a race condition between negotiating and updating this. if joining at the same time as changnig streams?
							if (sender.track){
								if (sender.track.id == track.id){
									added=true;
									warnlog(sender.track);
									if (sender.track.readyState=="ended"){
										sender.replaceTrack(track);  
									}
								} 
							}
						});
						if (added==false){
							sender = session.pcs[UUID].addTrack(track, stream);
							sender.track.onended = tryAgain;
						}
					}
				}
			});
		}).catch(errorlog); // console error message only
	}
}
	

function enterPressed(event, callback){
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13){
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    callback();
  }
}


function dragElement(elmnt) {
	var  millis = Date.now();
	try {
		var input = getById("zoomSlider");
		var stream = elmnt.srcObject;
		try {
			var track0 = stream.getVideoTracks();
		} catch(e){return;}
		track0 = track0[0];
		if (track0.getCapabilities){
			var capabilities = track0.getCapabilities();
			var settings = track0.getSettings();

			// Check whether zoom is supported or not. 
			if (!('zoom' in capabilities)) {
				log('Zoom is not supported by ' + track0.label);
				return;
			}

			// Map zoom to a slider element.
			input.min = capabilities.zoom.min;
			input.max = capabilities.zoom.max;
			input.step = capabilities.zoom.step;
			input.value = settings.zoom;
		}
	} catch(e){errorlog(e);return;}
	
	log("drag on");
    elmnt.onmousedown = dragMouseDown;
	elmnt.onclick = onvideoclick;
	elmnt.ontouchstart = dragMouseDown;
	
	var pos0 = 1;
	function onvideoclick(e){
		log(e);
		log("onvideoclick");
		e = e || window.event;
		e.preventDefault();
		return false;
	}
	
	function dragMouseDown(e) {
		log(e);
		log("dragMouseDown");
		
		//closeDragElement(null);
		
		//elmnt.controls = false;
		e = e || window.event;
		e.preventDefault();

		pos0 = input.value;
		if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			var touch = e.touches[0] ||e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			pos3 = touch.clientX;
			pos4 = touch.clientY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
			pos3 = e.clientX;
			pos4 = e.clientY;
		}
		document.ontouchup = closeDragElement;
		document.onmouseup = closeDragElement;
		
		document.ontouchmove = elementDrag;
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		
		if ( Date.now() - millis < 50){
			return;
		}
		millis = Date.now();
		
		if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			var touch = e.touches[0] ||e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			pos1 =  touch.clientX;
			pos2 =  touch.clientY;
		} else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
			pos1 =  e.clientX;
			pos2 =   e.clientY;
		}
		
		var zoom =  parseFloat((pos4-pos2)*2/elmnt.offsetHeight);
		
		if (zoom>1){zoom =1.0;}
		else if (zoom<-1){zoom=-1.0;}
		input.value = zoom*(input.max - input.min) + input.min;
		if (input.value !=  pos0){
			track0.applyConstraints({advanced: [ {zoom: input.value} ]});
		}
	}

	function closeDragElement(e) {
		log(e);
		log("closeDragElement");
		//if (e!==null){
		//	elmnt.controls=true;
		//}
		/* stop moving when mouse button is released:*/
		document.ontouchup = null;
		document.onmouseup = null;
		document.onmousemove = null;
		document.ontouchmove = null;
	}
}



function updateConstraintSliders(){
	getById("popupSelector_constraints").innerHTML = "";
	
	try {
		var track0 = session.streamSrc.getVideoTracks();
		track0 = track0[0];
		if (track0.getCapabilities){
			session.cameraConstaints = track0.getCapabilities();
		}
		
		log(session.cameraConstaints);
	} catch(e){
		errorlog(e);
		return;
	}
	
	try {
		var currentCameraConstaints={};
		if (track0.getSettings){
			currentCameraConstaints = track0.getSettings();
		}
	} catch(e){
		errorlog(e);
	}
	
	for (var i in session.cameraConstaints){
		try {
			if ((typeof session.cameraConstaints[i] ==='object') && (session.cameraConstaints[i] !== null) && ("max" in session.cameraConstaints[i]) && ("min" in session.cameraConstaints[i])){
				log(i);
				log(session.cameraConstaints[i]);
				
				if (i==="aspectRatio"){continue;}
				else if (i==="width"){continue;}
				else if (i==="height"){continue;}
				else if (i==="frameRate"){continue;}
				
				var label = document.createElement("label");
				label.id= "label_"+i;
				label.htmlFor = "constraints_"+i;
				label.innerHTML = i+":";
				
				var input = document.createElement("input");
				input.min = session.cameraConstaints[i].min;
				input.max = session.cameraConstaints[i].max;
				
				if (i in currentCameraConstaints){
					input.value = currentCameraConstaints[i];
					label.innerHTML = i+": "+currentCameraConstaints[i];
				} else {
					label.innerHTML = i;
				}
				if ("step" in session.cameraConstaints[i]){
					input.step = session.cameraConstaints[i].step;
				}
				input.type = "range";
				input.dataset.keyname = i;
				input.id = "constraints_"+i;
				input.style="display:block; width:95%;";
				input.name = "constraints_"+i;
				
				
				input.onchange = function(e){
					getById("label_"+e.target.dataset.keyname).innerHTML =e.target.dataset.keyname+": "+e.target.value;
					updateCameraConstraints(e.target.dataset.keyname, e.target.value);
				};
				
				
				
				getById("popupSelector_constraints").appendChild(label);
				getById("popupSelector_constraints").appendChild(input);
			}
		} catch(e){errorlog(e);}
			
	}
}
 
function updateCameraConstraints(constraint, value=null){
	var track0 = session.streamSrc.getVideoTracks();
	track0 = track0[0];
	track0.applyConstraints({advanced: [ {[constraint]: value} ]});
}
  
function setupWebcamSelection(stream=null){
	log("setup webcam");
	
	if (stream){
		log(getById("previewWebcam"));
		getById("previewWebcam").srcObject = stream;
		session.streamSrc = stream;
		if (stream.getAudioTracks().length){
			volumeStream(getById("previewWebcam").srcObject);
		}
	} else {
		log("THIS IS NO STREAM??");
	}
	
	try {
		return enumerateDevices().then(gotDevices).then(function(){
			
			
			if (parseInt(getById("webcamquality").elements.namedItem("resolution").value)==3){
				session.maxframerate  = 30;
			} else {
				session.maxframerate = false;
			}
			
			//if ((iOS) || (iPad)){
				//getById("multiselect1").parentNode.style.visibility="hidden";
				//getById("multiselect1").parentNode.style.height="0px";
				//getById("multiselecta1").parentNode.style.height="0px";
				//getById("multiselecta1").parentNode.style.visibility="hidden";
			//}
			
			var audioSelect = document.querySelector('#audioSource');
			var videoSelect = document.querySelector('select#videoSource');
			var outputSelect = document.querySelector('select#outputSource');
			
			audioSelect.onchange = function(){
				
				var gowebcam = getById("gowebcam");
				if (gowebcam){
					gowebcam.disabled = true;
					gowebcam.dataset.ready = "true";
					gowebcam.style.backgroundColor = "#DDDDDD";
					gowebcam.style.fontWeight="normal";
					gowebcam.innerHTML = "Waiting for Camera to load";
					gowebcam.dataset.translate='waiting-for-camera-to-load';
				}
				activatedPreview=false;
				grabAudio();
			};
			videoSelect.onchange = function(){
				
				var gowebcam = getById("gowebcam");
				if(gowebcam){
					gowebcam.disabled = true;
					gowebcam.dataset.ready = "true";
					gowebcam.style.backgroundColor = "#DDDDDD";
					gowebcam.style.fontWeight="normal";
					gowebcam.innerHTML = "Waiting for Camera to load";
					gowebcam.dataset.translate='waiting-for-camera-to-load';
				}
				warnlog("video source changed");
				
				activatedPreview=false;
				if (session.quality!==false){
					grabVideo(session.quality);
				} else {
					session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
					grabVideo(session.quality_wb);
				}
			};
			
			outputSelect.onchange = function(){
				session.sink = outputSelect.options[outputSelect.selectedIndex].value;
				//if (session.sink=="default"){session.sink=false;} else {
					getById("previewWebcam").setSinkId(session.sink).then(() => {
						log("New Output Device:"+session.sink);
					}).catch(error => {
						errorlog(error);
						//setTimeout(function(){alert("Failed to change audio output destination.");},1);
					});
				//}
			}
			
			getById("webcamquality").onchange = function(){
				var gowebcam = getById("gowebcam");
				if (gowebcam){
					gowebcam.disabled = true;
					gowebcam.dataset.ready = "true";
					gowebcam.style.backgroundColor = "#DDDDDD";
					gowebcam.style.fontWeight="normal";
					gowebcam.innerHTML = "Waiting for Camera to load";
					gowebcam.dataset.translate='waiting-for-camera-to-load';
				}
				
				if (parseInt(getById("webcamquality").elements.namedItem("resolution").value)==3){
					session.maxframerate  = 30;
				} else {
					session.maxframerate = false;
				}
				activatedPreview=false;
				session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
				grabVideo(session.quality_wb);
			};

			if ((session.audioDevice) && (session.audioDevice!==1)){ // change from Auto to Selected Audio Device
				log("SETTING AUDIO DEVICE!!");
				activatedPreview=false;
				grabAudio();
			}

			if (session.videoDevice===0){
				if (session.autostart){
					publishWebcam();  // no need to mirror as there is no video...
					return;
				} else {
					var gowebcam = getById("gowebcam");
					if (gowebcam){
						gowebcam.disabled =false;
						gowebcam.dataset.ready = "true";
						gowebcam.style.backgroundColor = "#3C3";
						gowebcam.style.color = "black";
						gowebcam.style.fontWeight="bold";
						gowebcam.innerHTML = "START";
						gowebcam.dataset.translate='start';
					}
					return;
				}
			} else {
				log("GRabbing video: "+session.quality);
				activatedPreview = false;
				if (session.quality!==false){
					grabVideo(session.quality);
				} else {
					session.quality_wb = parseInt(getById("webcamquality").elements.namedItem("resolution").value);
					grabVideo(session.quality_wb);
				}
			}
			
			
			
			
		}).catch(e => {errorlog(e);})
	} catch (e){errorlog(e);}
}

Promise.wait = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};

Promise.prototype.timeout = function(ms) {
    return Promise.race([
        this, 
        Promise.wait(ms).then(function () {
			var errormsg = new Error("Time Out\n\nDid you accept camera permissions in time? Please do so first.\n\nOtherwise, do you have NDI Tools installed? Maybe try uninstalling it.\n\nPlease also double check your camera and audio device are correctly connected. You may also need to refresh the page.");
			errormsg.name = "timedOut";
			errormsg.message = "Time Out\n\nDid you accept camera permissions in time? Please do so first.\n\nOtherwise, do you have NDI Tools installed? Maybe try uninstalling it.\n\nPlease also double check your camera and audio device are correctly connected. You may also need to refresh the page."
			throw errormsg;
            
        })
    ])
};

function previewWebcam(){
	if( activatedPreview == true){
		log("activeated preview return 1");
		return;
	}
	
	activatedPreview = true;
	
	try{
		var oldstream = getById('previewWebcam').srcObject;
		
		if (oldstream){
			log("old stream found");
			oldstream.getTracks().forEach(function(track) {
				track.stop();
				oldstream.removeTrack(track);
				log("stopping old track");
			});
		} else {
			getById('previewWebcam').srcObject = new MediaStream();
			session.streamSrc = getById('previewWebcam').srcObject;
			log("CREATE NEW STREAM");
		}
	  
	} catch (e){
		errorlog(e);
	}
	
	if (session.audioDevice===0){ // OFF
		var constraint = {audio: false};
	} else if ((session.echoCancellation !== false) && (session.autoGainControl !== false) && (session.noiseSuppression !== false)){ // AUTO
		var constraint = {audio: true};
	} else {                                     // Disable Echo Cancellation and stuff for the PREVIEW (DEFAULT CAM/MIC)
		var constraint = {audio: {}};
		if (session.echoCancellation !== false){ // if not disabled, we assume it's on
			constraint.audio.echoCancellation = true;
		} else {
			constraint.audio.echoCancellation = false;
		}
		if (session.autoGainControl !== false){
			constraint.audio.autoGainControl = true;
		} else {
			constraint.audio.autoGainControl = false;
		}
		if (session.noiseSuppression !== false){
			constraint.audio.noiseSuppression = true;
		} else {
			constraint.audio.noiseSuppression = false;
		}
	}
	
	if (session.videoDevice===0){
		constraint.video = false;
	} else {
		constraint.video = true;
	}
	
	try{
		log("getting permission from navigator");
		if ("permissions" in navigator){
			log("queried0");
			navigator.permissions.query({name: 'camera'}).then((permissionObj) => {
				log("queried ok");
				log(permissionObj.state);
				if (permissionObj.state!=="prompt"){
					constraint.video = false;
				}
				requestBasicPermissions(constraint)
			}).catch((error) => {
				log("queried err");
				requestBasicPermissions(constraint)
				errorlog('Got error :', error);
			});
		} else {
			log("queried not supported");
			requestBasicPermissions(constraint);
		}
	} catch(e){
		requestBasicPermissions(constraint)
		errorlog(e);
	}
}

function requestBasicPermissions(constraint){
	log("PreviewWebcam");
	log(constraint);
	try {
	  navigator.mediaDevices.getUserMedia(constraint).timeout(15000).then(function(stream){ // Apple needs thi to happen before I can access EnumerateDevices. 
		log("got first stream");
		setupWebcamSelection(stream);
	  }).catch(function(err){
			log("some error");
			errorlog(err); /* handle the error */
			if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
				//required track is missing 
			} else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
				//webcam or mic are already in use 
			} else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
				//constraints can not be satisfied by avb. devices 
			} else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
				//permission denied in browser 
				if (!(session.cleanOutput)){
					setTimeout(function(){alert("Permissions denied. Please ensure you have allowed the mic/camera permissions.");},1);
				}
				return;
			} else if (err.name == "TypeError" || err.name == "TypeError") {
				//empty constraints object 
			}  else {
				//permission denied in browser 
				if (!(session.cleanOutput)){
					setTimeout(function(){alert(err);},1);
				}
			}
		  errorlog("trying to list webcam again");
		  setupWebcamSelection();
	  });
	} catch (e){
		errorlog(e);
		if (!(session.cleanOutput)){
			if (window.isSecureContext) {
				alert("An error has occured when trying to access the webcam or microphone. The reason is not known.");
			} else if ((iOS) || (iPad)){
				alert("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
			} else {
				alert("Error acessing camera or microphone.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
			}
		}
	}
}


function copyFunction(copyText) {

	try {
		copyText.select();
		copyText.setSelectionRange(0, 99999);
		document.execCommand("copy");
	} catch(e) {
		var dummy = document.createElement('input');
		document.body.appendChild(dummy);
		dummy.value = copyText;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
		return false;
	}
}

function generateQRPage(){
	var pass = sanitizePassword(getById("invite_password").value);
	if (pass.length){
		return session.generateHash(pass+session.salt,4).then(function(hash){
			generateQRPageCallback(hash);
		});
	} else {
		generateQRPageCallback("");
	}
}

function generateQRPageCallback(hash){
	try{
		var title = getById("videoname4").value;
		if (title.length){
			title = title.replace(/[\W]+/g,"_").replace(/_+/g, '_'); // but not what others might get.
			title = "&label="+title;
		}
		var sid = session.generateStreamID(); 
		
		var viewstr = "";
		var sendstr = "";
		
		if (getById("invite_bitrate").checked){
			viewstr+="&bitrate=20000";
		}
		if (getById("invite_vp9").checked){
			viewstr+="&codec=vp9";
		}
		if (getById("invite_stereo").checked){
			viewstr+="&stereo";
			sendstr+="&stereo";
		}
		if (getById("invite_automic").checked){
			sendstr+="&audiodevice=1";
		}
		if (getById("invite_hidescreen").checked){
			sendstr+="&webcam";
		}
		
		if (getById("invite_remotecontrol").checked){  //
			var remote_gen_id = session.generateStreamID();
			sendstr+="&remote="+remote_gen_id; // security
			viewstr+="&remote="+remote_gen_id;
		}
		
		if (getById("invite_joinroom").value.trim().length){
			sendstr+="&room="+getById("invite_joinroom").value.trim();
			viewstr+="&scene&room="+getById("invite_joinroom").value.trim();
		}
		
		if (getById("invite_password").value.trim().length){
			sendstr+="&hash="+hash;
			viewstr+="&password="+getById("invite_password").value.trim();
		}
		
		
		if (getById("invite_group_chat_type").value){ //  0 is default
			if (getById("invite_group_chat_type").value==1){ // no video
				sendstr+="&novideo";
			} else if (getById("invite_group_chat_type").value==2){  // no view or audio
				sendstr+="&view";
			}
		}
		
		if (getById("invite_quality").value){
			if (getById("invite_quality").value==0){
				sendstr+="&quality=0";
			} else if (getById("invite_quality").value==1){
				sendstr+="&quality=1";
			} else if (getById("invite_quality").value==2){
				sendstr+="&quality=2";
			}
		}
		
		sendstr = 'https://' + location.host + location.pathname + '?push=' + sid + sendstr + title;
		viewstr = 'https://' + location.host+ location.pathname + '?view=' + sid + viewstr + title;
		
		getById("gencontent").innerHTML = '<br /><div id="qrcode" style="background-color:white;display:inline-block;color:black;max-width:380px;padding:35px 40px 40px 40px;">\
		<h2 style="margin:0 0 8px 0;color:black"  data-translate="invite-link">Guest Invite Link:</h2>\
		<a class="task grabLinks" title="Click to copy guest invite link to clipboard" onclick="popupMessage(event);copyFunction(this)" onmousedown="copyFunction(this)"  \
		style="word-break: break-all;cursor:copy;background-color:#CFC;border: 2px solid black;width:300px;padding:8px;margin:0px;color:#000;"  href="' + sendstr + '" >'+sendstr+' <i class="las la-paperclip" style="cursor:pointer"></i></a><br /><br /></div>\
			<br /><br />and don\'t forget the<h2 style="color:black">OBS Browser Source Link:</h2><a class="task grabLinks" title="Click to copy or just Drag the link directly into OBS" data-drag="1" onmousedown="copyFunction(this)" onclick="popupMessage(event);copyFunction(this)"  style="word-break: break-all;margin:0px;cursor:grab;background-color:#FCC;width:380px;padding:10px;border:2px solid black;margin:5px;color:#000;" href="' + viewstr + '" >'+viewstr+' <i class="las la-paperclip" style="cursor:pointer"></i></a> \
			<br /><br />\
		<span data-translate="please-note-invite-ingestion-link">This invite link and OBS ingestion link are reusable. Only one person may use a specific invite at a time.</span>';
		var qrcode = new QRCode(getById("qrcode"), {
			width : 300,
			height : 300,
			colorDark : "#000000",
			colorLight : "#FFFFFF",
			useSVG: false
		});
		qrcode.makeCode(sendstr);

	} catch(e){
		errorlog(e);
	}
}


if (session.view){
	getById("main").className = "";
	getById("credits").style.display = 'none';
	try{
		if (session.label===false){
			if (document.title==""){
				document.title = "View="+session.view.toString();
			} else {
				document.title += ", View="+session.view.toString();
			}
		}
	} catch(e){errorlog(e);};
}


if ((session.view) && (session.roomid===false)){
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
	
	setTimeout(function(){
		try{
			if ((session.view) && (!(session.cleanOutput))){
				if (document.getElementById("mainmenu")){
					getById("mainmenu").style.backgroundImage = "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K')";
					getById("mainmenu").innerHTML = '<font style="color:#666"><h1 data-translate="attempting-to-load">Attempting to load video stream.</h1></font>';
					getById("mainmenu").innerHTML += '<font style="color:#EEE" data-translate="stream-not-available-yet">The stream is not available yet or an error occured.</font><br/><button onclick="location.reload();" data-translate="try-manually">Retry Manually</button><br/>';
					
				}}
		} catch(e){
			errorlog("Error handling QR Code failure");
		}
	},15000);

	log("auto playing");

	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){ 
		if (!(session.cleanOutput)){
			alert("Safari requires us to ask for an audio permission to use peer-to-peer technology. You will need to accept it in a moment if asked to view this live video");
		}
		navigator.mediaDevices.getUserMedia({audio: true}).then(function(){
			play();
		}).catch(function(){
			play();
		});
	} else {
		play();
		//getById("mainmenu").style.display="none";
	}
} else if (session.roomid){
	try{
		if (session.label===false){
			if (document.title==""){
				document.title = "Room="+session.roomid.toString();
			} else {
				document.title += ", Room="+session.roomid.toString();
			}
		}
	} catch(e){errorlog(e);};
	
}



var vis = (function(){
	var stateKey, eventKey, keys = {
		hidden: "visibilitychange",
		webkitHidden: "webkitvisibilitychange",
		mozHidden: "mozvisibilitychange",
		msHidden: "msvisibilitychange"
	};
	for (stateKey in keys) {
		if (stateKey in document) {
			eventKey = keys[stateKey];
			break;
		}
	}
	return function(c) {
		if (c) {
			document.addEventListener(eventKey, c);
			//document.addEventListener("blur", c);
			//document.addEventListener("focus", c);
		}
		return !document[stateKey];
	};
})();

(function rightclickmenuthing() {  // right click menu
  
  "use strict";

  function clickInsideElement( e, className ) {
    var el = e.srcElement || e.target;
    
    if ( el.classList.contains(className) ) {
      return el;
    } else {
      while ( el = el.parentNode ) {
        if ( el.classList && el.classList.contains(className) ) {
          return el;
        }
      }
    }

    return false;
  }

  /**
   * Get's exact position of event.
   * 
   * @param {Object} e The event passed in
   * @return {Object} Returns the x and y position
   */
  function getPosition(event2) {
    var posx = 0;
    var posy = 0;

    if (!event2) var event = window.event;
    
    if (event2.pageX || event2.pageY) {
      posx = event2.pageX;
      posy = event2.pageY;
    } else if (event2.clientX || event2.clientY) {
      posx = event2.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = event2.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy
    };
  }

  var contextMenuClassName = "context-menu";
  var contextMenuItemClassName = "context-menu__item";
  var contextMenuLinkClassName = "context-menu__link";
  var contextMenuActive = "context-menu--active";

  var taskItemClassName = "task";
  var taskItemInContext;

  var clickCoords;
  var clickCoordsX;
  var clickCoordsY;

  var menu = document.querySelector("#context-menu");
  var menuItems = menu.querySelectorAll(".context-menu__item");
  var menuState = 0;
  var menuWidth;
  var menuHeight;
  var menuPosition;
  var menuPositionX;
  var menuPositionY;

  var windowWidth;
  var windowHeight;

  /**
   * Initialise our application's code.
   */
  function init() {
    contextListener();
    clickListener();
    keyupListener();
    resizeListener();
  }

  /**
   * Listens for contextmenu events.
   */
  function contextListener() {
    document.addEventListener( "contextmenu", function(e) {
      taskItemInContext = clickInsideElement( e, taskItemClassName );

      if ( taskItemInContext ) {
        e.preventDefault();
        toggleMenuOn();
        positionMenu(e);
      } else {
        taskItemInContext = null;
        toggleMenuOff();
      }
    });
  }

  /**
   * Listens for click events.
   */
  function clickListener() {
    document.addEventListener( "click", function(e) {
      var clickeElIsLink = clickInsideElement( e, contextMenuLinkClassName );

      if ( clickeElIsLink ) {
        e.preventDefault();
        menuItemListener( clickeElIsLink );
      } else {
        var button = e.which || e.button;
        if ( button === 1 ) {
          toggleMenuOff();
        }
      }
    });
  }

  /**
   * Listens for keyup events.
   */
  function keyupListener() {
    window.onkeyup = function(e) {
      if ( e.keyCode === 27 ) {
        toggleMenuOff();
      }
    };
  }

  /**
   * Window resize event listener
   */
  function resizeListener() {
    window.onresize = function(e) {
      toggleMenuOff();
    };
  }

  /**
   * Turns the custom context menu on.
   */
  function toggleMenuOn() {
    if ( menuState !== 1 ) {
      menuState = 1;
      menu.classList.add( contextMenuActive );
    }
  }

  /**
   * Turns the custom context menu off.
   */
  function toggleMenuOff() {
    if ( menuState !== 0 ) {
      menuState = 0;
      menu.classList.remove( contextMenuActive );
    }
  }

  /**
   * Positions the menu properly.
   * 
   * @param {Object} e The event
   */
  function positionMenu(e) {
    clickCoords = getPosition(e);
    clickCoordsX = clickCoords.x;
    clickCoordsY = clickCoords.y;

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      menu.style.left = windowWidth - menuWidth + "px";
    } else {
      menu.style.left = clickCoordsX + "px";
    }

    if ( (windowHeight - clickCoordsY) < menuHeight ) {
      menu.style.top = windowHeight - menuHeight + "px";
    } else {
      menu.style.top = clickCoordsY + "px";
    }
  }

  /**
   * Dummy action function that logs an action when a menu item link is clicked
   * 
   * @param {HTMLElement} link The link that was clicked
   */
  function menuItemListener(  link ) {
	if (link.getAttribute("data-action")=="Open"){
		window.open(taskItemInContext.value);
	} else {
		// nothing needed
	}
    log( "Task ID - " + taskItemInContext + ", Task action - " + link.getAttribute("data-action"));
    toggleMenuOff();
  }

  /**
   * Run the app.
   */
  init();

})();

document.addEventListener("dragstart", event => {
	var url = event.target.href || event.target.value;
	if (!url || !url.startsWith('https://')) return;
	if (event.target.dataset.drag!="1"){
		return;
	}
	//event.target.ondragend = function(){event.target.blur();}
	
	var streamId = url.split('view=');
	var label = url.split('label=');

	if (session.label!==false){
		url += '&layer-name='+session.label;
	} else {
		url += '&layer-name=OBS.Ninja';
	}
	if (streamId.length>1) url += ': ' + streamId[1].split('&')[0];
	if (label.length>1) url += ' - ' + decodeURI(label[1].split('&')[0]);
	
	try{
		if (document.getElementById("videosource")){
			var video = getById('videosource');
			if (typeof(video.videoWidth) == "undefined"){
				url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
				url += '&layer-height=1080';
			} else if ((parseInt(video.videoWidth)<360) || (video.videoHeight<640)){
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
	} catch(error){
		url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
		url += '&layer-height=1080';
	}
	
	event.dataTransfer.setDragImage(document.querySelector('#dragImage'), 24, 24);
	event.dataTransfer.setData("text/uri-list", encodeURI(url));
	//event.dataTransfer.setData("url", encodeURI(url));
	
	//warnlog(event);
	
});
function popupMessage(e, message="Copied to Clipboard"){  // right click menu
  
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;
    
    if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
    } else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

	posx += 10;


	var menu = document.querySelector("#messagePopup");
	menu.innerHTML = "<center>"+message+"</center>";
	var menuState = 0;
	var menuWidth;
	var menuHeight;
	var menuPosition;
	var menuPositionX;
	var menuPositionY;

	var windowWidth;
	var windowHeight;

    if ( menuState !== 1 ) {
		menuState = 1;
		menu.classList.add( "context-menu--active" );
	}

    menuWidth = menu.offsetWidth + 4;
    menuHeight = menu.offsetHeight + 4;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    if ( (windowWidth - posx) < menuWidth ) {
		menu.style.left = windowWidth - menuWidth + "px";
    } else {
		menu.style.left = posx + "px";
    }

    if ( (windowHeight - posy) < menuHeight ) {
		menu.style.top = windowHeight - menuHeight + "px";
    } else {
		menu.style.top = posy + "px";
    }
	
	function toggleMenuOff() {
		if ( menuState !== 0 ) {
		  menuState = 0;
		  menu.classList.remove( "context-menu--active" );
		}
	}
	setTimeout(function(){toggleMenuOff();},1000);
	event.preventDefault();
}

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return "Seconds ago";
}
var chatUpdateTimeout = null;
var messageList = []

function sendChatMessage(){ // filtered + visual
	var data = {};
	var msg = document.getElementById('chatInput').value;
	if (msg==""){return;}
	sendChat(msg); // send message to peers
	data.time = Date.now();
	data.msg = sanitize(msg); // this is what the other person should see
	data.label = false;
	data.type = "sent";
	document.getElementById('chatInput').value = "";
	messageList.push(data);
	messageList = messageList.slice(-100);
	updateMessages();
}

function getChatMessage(msg, label=false){
	msg = sanitize(msg); // keep it clean.
	if (msg==""){return;}
	data = {};
	data.time = Date.now();
	data.msg = msg;
	if (label){
		data.label = label.replace(/[\W]+/g,"_").replace(/_+/g, ' ');
		data.label  =  "<b>" + data.label +":</b> ";
	} else {
		data.label = "";
	}
	data.type = "recv";
	messageList.push(data);
	messageList = messageList.slice(-100);
	updateMessages();
	if (session.chat==false){
		getById("chattoggle").className="las la-comments my-float toggleSize puslate";
		getById("chatbutton").className="float";
		
		if (getById("chatNotification").value){
			getById("chatNotification").value = getById("chatNotification").value+1;
		} else {
			getById("chatNotification").value = 1;
		}
		getById("chatNotification").classList.add("notification");
		
		//if (getById("chatNotification").value>99){
		//	getById("chatNotification").innerHTML = "!";
		//} else {
		//	getById("chatNotification").innerHTML = getById("chatNotification").value;
		//}
	}
	
	if (parent){
		parent.postMessage({"gotChat": data }, "*");
	}
	
}

function updateMessages(){
	document.getElementById("chatBody").innerHTML = "";
	for (i in messageList){
		
		var time = timeSince(messageList[i].time);
		var msg = document.createElement("div");
		////// KEEP THIS IN /////////
		console.log(messageList[i].msg); // Display Recieved messages for View-Only clients.
		/////////////////////////////
		if (messageList[i].type == "sent"){
			msg.innerHTML = messageList[i].msg + " <i><small> <small>- "+time+"</small></small></i>";
			msg.classList.add("outMessage");
		} else if (messageList[i].type == "recv"){
			var label = "";
			if (messageList[i].label){
				label = messageList[i].label;
			} 
			msg.innerHTML = label+messageList[i].msg + " <i><small> <small>- "+time+"</small></small></i>";
			msg.classList.add("inMessage");
		} else if (messageList[i].type == "alert"){
			msg.innerHTML = messageList[i].msg + " <i><small> <small>- "+time+"</small></small></i>";
			msg.classList.add("inMessage");
		} else {
			msg.innerHTML = messageList[i].msg + " <i><small> <small>- "+time+"</small></small></i>";
			msg.classList.add("inMessage");
		}
		
		document.getElementById("chatBody").appendChild(msg);
	}
	if (chatUpdateTimeout){
		clearInterval(chatUpdateTimeout);
	}
	document.getElementById("chatBody").scrollTop = document.getElementById("chatBody").scrollHeight;
	chatUpdateTimeout = setTimeout(function(){updateMessages()},60000);
}

function sanitize(string) {
	var temp = document.createElement('div');
	temp.textContent = string;
	return temp.innerHTML;
}

function EnterButtonChat(event){
	 // Number 13 is the "Enter" key on the keyboard
	var key = event.which || event.keyCode;
	if (key  === 13) {
		// Cancel the default action, if needed
		event.preventDefault();
		// Trigger the button element with a click
		sendChatMessage();
	}
}

var defaultRecordingBitrate = false;
function recordVideo(target, event, videoKbps = false, interval=30){  // event.currentTarget,this.parentNode.parentNode.dataset.UUID

	var UUID = target.dataset.UUID;
	var video = session.rpcs[UUID].videoElement;
	
	if (event === null){
		if (defaultRecordingBitrate===null){
			target.style.backgroundColor = null;
			target.innerHTML = '<i class="las la-circle"></i><span data-translate="record"> Record</span>';
			return;
		}
	} else if ((event.ctrlKey) || (event.metaKey)){
		target.innerHTML = '<i class="las la-check"></i> <span data-translate="record"> ARMED</span>';
		target.style.backgroundColor = "#BF3F3F";
		Callbacks.push([recordVideo, target, null, false]);
		log("Record Video queued");
		defaultRecordingBitrate=false;
		return;
	}
	
	log("Record Video Clicked");
	if ("recording" in video){
			log("ALREADY RECORDING!");
			target.style.backgroundColor = null;
			target.innerHTML = '<i class="las la-circle"></i><span data-translate="record"> Record</span>';
			video.recorder.stop();
			session.requestRateLimit(35,UUID); // 100kbps
			delete(video.recorder);
			delete(video.recording);
			return;
		
	} else {
		target.style.backgroundColor = "#FCC";
		target.innerHTML = "<i style='font-size:110%;' class='las la-file-download'></i> <span data-translate='Download'>Download</span>";
		video.recording = true;
	}
	
	video.recorder = {};
	
	if (videoKbps==false){
		if (defaultRecordingBitrate==false){
			videoKbps = 4000; // 4mbps recording bitrate
			videoKbps = prompt("Press OK to start recording. Press again to stop and download.\n\nWarning: Keep this browser tab active to continue recording.\n\nYou can change the default video bitrate if desired below (kbps)",videoKbps);
			if (videoKbps===null){
				target.style.backgroundColor = null;
				target.innerHTML = '<i class="las la-circle"></i><span data-translate="record"> Record</span>';
				delete(video.recorder);
				delete(video.recording);
				defaultRecordingBitrate=null;
				return;
			}
			videoKbps = parseInt(videoKbps);
			defaultRecordingBitrate = videoKbps;
		} else {
			videoKbps = defaultRecordingBitrate;
		}
	} 
	
	if (videoKbps<35){  // this just makes sure you can't set 0 on the record bitrate.
		videoKbps=35;
	}
	
	session.requestRateLimit(parseInt(videoKbps*0.8), UUID); // 3200kbps transfer bitrate. Less than the recording bitrate, to avoid waste.
	
	var filename = Date.now().toString();
	var recordedBlobs = [];
	

	var cancell = false;
    if (typeof video.srcObject === "undefined" || !video.srcObject) {return;}
	
	video.recorder.stop = function (){
        video.recorder.mediaRecorder.stop();
		cancell = true;
        log('Recorded Blobs: ', recordedBlobs);
		download();
    };
	
	let options = { 
		mimeType: "video/webm",
		videoBitsPerSecond: parseInt(videoKbps*1024) // 2.5Mbps
	};
	video.recorder.mediaRecorder = new MediaRecorder(video.srcObject, options); 
	
	function download() {
        const blob = new Blob(recordedBlobs, { type: "video/webm" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename+".webm";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
	
	function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }
    
	video.recorder.mediaRecorder.ondataavailable = handleDataAvailable;
	
	video.recorder.mediaRecorder.onerror = function(event) {
		errorlog(event);
		video.recorder.stop();
		session.requestRateLimit(35,UUID);
		if (!(session.cleanOutput)){
			setTimeout(function(){alert("an error occured with the media recorder; stopping recording");},1);
		}
	};
	 
	video.srcObject.ended  = function(event) {
		video.recorder.stop();
		session.requestRateLimit(35,UUID);
		if (!(session.cleanOutput)){
			setTimeout(function(){alert("stream ended! stopping recording");},1);
		}
	};
	  
	video.recorder.mediaRecorder.start(100); // 100ms chunks

	return;
}
