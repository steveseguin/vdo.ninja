/*
*  Copyright (c) 2020 Steve Seguin. All Rights Reserved.
*
*  Use of this source code is governed by the APGLv3 open-source licensenavigator.userAgent
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
	    errorlog(id + " is not defined; skipping.");
		el = document.createElement("span"); // create a fake element
   }
   return el;
}


function updateURL(param, force=false) {
	var para = param.split('=')[0];
	if (!(urlParams.has(para)) || (force)){
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
	}

	if (session.sticky){
		setCookie("settings", encodeURI(window.location.href), 90)
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


if (window.obsstudio){
	session.obsfix=true; // can be manually set via URL.
	log("OBS VERSION:"+window.obsstudio.pluginVersion);
	log("macOS: "+navigator.userAgent.indexOf('Mac OS X') != -1);
	log(window.obsstudio);
	
	if (!(urlParams.has('streamlabs'))){
		
		var ver1 = window.obsstudio.pluginVersion;
		ver1 = ver1.split(".");
		updateURL("streamlabs");
		if (ver1.length == 3){ // Should be 3, but disabled3
			if ((ver1.length == 3) && (parseInt(ver1[0])==2) && (parseInt(ver1[1])>4) && (navigator.userAgent.indexOf('Mac OS X') != -1)){
				getById("main").innerHTML = "<div style='background-color:black;color:white;'><h1>On macOS, Please use OBS v23, as OBS v24 and v25 are not supported currently.</h1>\
				<br /><h2> Please find details <u><a href='https://github.com/steveseguin/obsninja/wiki/FAQ#mac-os'>within our wiki guide - https://github.com/steveseguin/obsninja/wiki/FAQ#mac-os</a></u></h2>\
				<br /> You can bypass this error message by refreshing, <a href='"+ window.location.href +"'> Clicking Here,</a> or by adding <i>&streamlabs</i> to the URL.\
				<br /> Please report this problem to steve@seguin.email if you feel it is an error.\
				</div>";
			}
		}
	}
	
	window.addEventListener('obsSceneChanged', function(event) {
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
		if (formSubmitting) {
			return undefined;
		}
		var confirmationMessage = 'Leaving the page now will terminate your stream ';
		(e || window.event).returnValue = confirmationMessage; //Gecko + IE
		return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
	});
};



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
	  } else if (event.keyCode == 77) {  // m
		toggleMute();
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
	setCookie("redirect", "", 0)
	session.sticky = true;
} else if (getCookie("settings") != ""){
	session.sticky = confirm("Would you like you load your previous session's settings?");
	if (!session.sticky){
		setCookie("settings", "", 0)
		log("deleting cookie as user said no");
	} else {
		var cookieSettings = decodeURI(getCookie("settings"));
		setCookie("redirect", "yes", 1)
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
		setCookie("permission", "yes", 999)
		setCookie("settings", encodeURI(window.location.href), 90)
	}
}




if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	session.webcamonly = true;
	getById("shareScreenGear").style.display="none";
}

if (urlParams.has('webcam') || urlParams.has('wc')){
	session.webcamonly = true;
} 

if (urlParams.has('screenshare') || urlParams.has('ss')){
	session.screenshare = true;
}

if (urlParams.has('mute') || urlParams.has('muted')){
	session.muted = true;
}

if (urlParams.has('mute') || urlParams.has('muted')){
	session.muted = true;
} 

if (session.screenshare==true){
	getById("container-3").className = 'column columnfade advanced'; // Hide screen share on mobile
}

if (session.webcamonly==true){
	getById("container-2").className = 'column columnfade advanced'; // Hide screen share on mobile
	//getById("shareScreenGear").style.display="none"; // removed based on fluffy's feedback
}




if (urlParams.has('password')){
	session.password = urlParams.get('password');
	if (session.password.length==0){
		session.password = prompt("Please enter the password below: \n\n(Note: Passwords are case-sensitive and you will not be alerted if it is incorrect.)");
	}
	getById("passwordRoom").value = session.password;
}


if (urlParams.has('label')){
	session.label = decodeURIComponent(urlParams.get('label'));
	if (session.label.length==0){
		session.label = prompt("Please enter your name");
	}
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
	} else if (session.stereo==="3"){
		session.stereo = 3;
	} else if (session.stereo==="2"){
		session.stereo = 2;
	} else {
		session.stereo = 1;
	}
}

if ((session.stereo==1) || (session.stereo==3)){
	session.echoCancellation = false;
	session.autoGainControl = false;
	session.noiseSuppression = false;
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


if (urlParams.has('audiobitrate') || urlParams.has('ab')){ // both peers need this enabled for HD stereo to be on. If just pub, you get no echo/noise cancellation. if just viewer, you get high bitrate mono 
	log("AUDIO BITRATE SET");
	session.audiobitrate = urlParams.get('audiobitrate') || urlParams.get('ab');
	session.audiobitrate = parseInt(session.audiobitrate);
	if (session.audiobitrate<1){
		session.audiobitrate=false;
	} else if (session.audiobitrate>1024){
		session.audiobitrate=1024;
	} // this is to just prevent abuse
}

if (urlParams.has('streamid') || urlParams.has('view') || urlParams.has('v') || urlParams.has('pull')){  // the streams we want to view; if set, but let blank, we will request no streams to watch.  
	session.view = urlParams.get('streamid') || urlParams.get('view') || urlParams.get('v') || urlParams.get('pull'); // this value can be comma seperated for multiple streams to pull
	
	if (session.audioDevice===false){
		getById("headphonesDiv2").style.display="inline-block";
		getById("headphonesDiv").style.display="inline-block";
	}
	if (session.view==null){
		session.view="";
	}
	if (session.view){
		if (session.view.split(",").length>1){
			session.view_set = session.view.split(",");
		} 
	}
	
}

if (urlParams.has('icefilter')){
	log("ICE FILTER ENABLED");
    session.icefilter =  urlParams.get('icefilter');
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
	} else {
		session.obsfix = true;
	}
}

if (urlParams.has('remote') || urlParams.has('rem')){
	log("remote ENABLED");
	session.remote = urlParams.get('remote') || urlParams.get('rem')
    session.remote =  session.remote.trim();
}
if (urlParams.has('optimize')){
	session.optimize = true;
}

if (urlParams.has('obsoff') || urlParams.has('oo')){
	log("OBS feedback disabled");
    session.disableOBS = true;
}


if (urlParams.has("videodevice") || urlParams.has("vdevice")  || urlParams.has("vd")  || urlParams.has("device")  || urlParams.has("d")){
	
	session.videoDevice = urlParams.get("videodevice") || urlParams.get("vdevice")  || urlParams.get("vd")  || urlParams.get("device")  || urlParams.get("d");
	
	if (session.videoDevice){
		session.videoDevice = session.videoDevice.toLowerCase();
	}
	if (session.videoDevice=="false"){
		session.videoDevice = 0;
	} else if (session.videoDevice=="0"){
		session.videoDevice = 0;
	} else if (session.videoDevice=="no"){
		session.videoDevice = 0;
	} else if (session.videoDevice=="off"){
		session.videoDevice = 0;
	} else {
		session.videoDevice = 1;
	}
	
	if (session.videoDevice === 0){
		getById("add_camera").innerHTML = "Share your Microphone";
	}
	
	getById("videoMenu").style.display="none";
}

// audioDevice
if (urlParams.has("audiodevice") || urlParams.has("adevice")  || urlParams.has("ad")  || urlParams.has("device")  || urlParams.has("d")){
	
	session.audioDevice = urlParams.get("audiodevice") || urlParams.get("adevice")  || urlParams.get("ad")  || urlParams.get("device")  || urlParams.get("d");
	
	if (session.audioDevice){
		session.audioDevice = session.audioDevice.toLowerCase();
	}
	if (session.audioDevice=="false"){
		session.audioDevice = 0;
	} else if (session.audioDevice=="0"){
		session.audioDevice = 0;
	} else if (session.audioDevice=="no"){
		session.audioDevice = 0;
	} else if (session.audioDevice=="off"){
		session.audioDevice = 0;
	} else {
		session.audioDevice = 1;
	}
	
	getById("audioMenu").style.display="none";
	getById("headphonesDiv1").style.display="none";
	getById("headphonesDiv2").style.display="none";
	getById("audioScreenShare1").style.display="none";	
	
}


if (urlParams.has("autojoin") || urlParams.has("autostart") || urlParams.has("aj") || urlParams.has("as")){
	session.autostart = true;
}


if (urlParams.has('novideo') || urlParams.has('nv') || urlParams.has('hidevideo')){
	
	session.novideo = urlParams.get('novideo') || urlParams.get('nv') || urlParams.has('hidevideo');
	
	if (!(session.novideo)){
		session.novideo=[];
	} else {
		session.novideo = session.novideo.split(",");
	}
	log("disable video playback");
	log(session.novideo);
}

if (urlParams.has('noaudio') || urlParams.has('na') || urlParams.has('hideaudio')){
	
	session.noaudio = urlParams.get('noaudio') || urlParams.get('na') || urlParams.has('hideaudio');
	errorlog(session.noaudio);
	
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



if (urlParams.has('codec')){
	log("CODEC CHANGED");
    session.codec = urlParams.get('codec');
}

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
		ln_template = urlParams.get('ln')
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
		document.title = location.hostname;
		getById("qos").innerHTML = location.hostname;
		getById("logoname").innerHTML = getById("qos").outerHTML;
		getById("helpbutton").style.display = "none";
	}
} else if (location.hostname === "rtc.ninja"){
	try{
		document.title = "";
		getById("qos").innerHTML = "";
		getById("logoname").innerHTML = "";
		getById("header").style.height = 0;
		getById("header").style.minHeight = 0;
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
				document.title = location.hostname;
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
		document.title = location.hostname;
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
						ele.innerHTML = data[ele.dataset.translate];
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

if (urlParams.has('height') || urlParams.has('h')){
	session.height = urlParams.get('height') || urlParams.get('h')
	session.height = parseInt(session.height);
}

if (urlParams.has('width') || urlParams.has('w')){
	session.width = urlParams.get('width') || urlParams.get('w')
	session.width = parseInt(session.width);
}

if (urlParams.has('quality') || urlParams.has('q')){
	try{
		session.quality = urlParams.get('quality') || urlParams.get('q')
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

if (urlParams.has('channeloffset')){
    session.offsetChannel = parseInt(urlParams.get('channeloffset'));
	log("max channels is 32; channels offset");
}
if (urlParams.has('channels')){
    session.audioChannels = parseInt(urlParams.get('channels'));
	log("max channels is 32; channels offset");
}

if (urlParams.has('maxviewers') || urlParams.has('mv') ){
	
	session.maxviewers = urlParams.get('maxviewers') || urlParams.get('mv')  
	if (session.maxviewers.length==0){
		session.maxviewers = 1;
	} else {
		session.maxviewers = parseInt(session.maxviewers);
	}
	log("maxviewers set");
}



if (urlParams.has('secure')){
	session.security = true;
	if (!(session.cleanOutput)){
		setTimeout(function() {alert("Enhanced Security Mode Enabled.");}, 100);
	}
}

if (urlParams.has('framerate') || urlParams.has('fr') || urlParams.has('fps')){
	session.framerate = urlParams.get('framerate') || urlParams.get('fr') || urlParams.get('fps');
    session.framerate = parseInt(session.framerate);
	log("framerate Changed");
	log(session.framerate);
}

if (urlParams.has('sync')){
    session.sync = parseFloat(urlParams.get('sync'));
	log("sync Changed");
	log(session.sync);
}

if (urlParams.has('buffer')){
    session.buffer = parseFloat(urlParams.get('buffer')) || 0;
	log("buffer Changed: "+session.buffer);
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



var turn = {};
if (urlParams.has('turn')){
	try {
		var turnstring = urlParams.get('turn').split(";");
		if (turnstring !== "false"){ // false disables the TURN server. Useful for debuggin
			turn = {};
			turn.username = turnstring[0]; // myusername
			turn.credential = turnstring[1];  //mypassword
			turn.urls = [turnstring[2]]; //  ["turn:turn.obs.ninja:443"];
			session.configuration.iceServers = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun4.l.google.com:19302" ]}]
			session.configuration.iceServers.push(turn);
		}
	} catch (e){
		alert("TURN server parameters were wrong.");
		errorlog(e);
	}
}


if (urlParams.has('privacy')){ // please only use if you are also using your own TURN service.
	try {
		session.configuration.iceTransportPolicy = "relay";  // https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate/address
	} catch (e){
		alert("Privacy mode failed to configure.");
		errorlog(e);
	}
}


window.onmessage = function(e){ // iFRAME support
    if ("mute" in e.data){
		if (e.data.mute == true){
			for (var i in session.rpcs){
				try {
					session.rpcs[i].videoElement.muted = true;
				} catch(e){
					errorlog(e);
				}
			}
		} else if (e.data.mute == false){
			for (var i in session.rpcs){
				try {
					session.rpcs[i].videoElement.muted = false;
				} catch(e){
					errorlog(e);
				}
			}
		} else if (e.data.mute == "toggle"){
			for (var i in session.rpcs){
				try {
					session.rpcs[i].videoElement.muted = !(session.rpcs[i].videoElement.muted);
				} catch(e){
					errorlog(e);
				}
			}
		} 
    }
	
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
	
	if ("mic" in e.data){
		if (e.data.mic == true){
			toggleMute(true);
		} else if (e.data.mic == false){
			toggleMute(false);
		} else if (e.data.mic == "toggle"){
			toggleMute();
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
		var out = "";
		for (var i in session.rpcs){
			out += printValues(session.rpcs[i].stats);
		}
		parent.postMessage({"stats": out }, "*");
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

function jumptoroom(){
	var arr = window.location.href.split('?');
	var roomname = getById("joinroomID").value;
	roomname = roomname.replace(/[\W_]+/g,"_");
	if (arr.length > 1 && arr[1] !== '') {
		window.location+="&room="+roomname;
	} else {
		window.location+="?room="+roomname;
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


var permaid=false;
if (urlParams.has('permaid') || urlParams.has('push')){
	permaid  = urlParams.get('permaid') || urlParams.get('push');
	session.changeStreamID(permaid);
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
	
	roomid = roomid.replace(/[\W_]+/g,"_");
	session.roomid = roomid;
	
	if (session.audioDevice===false){
		getById("headphonesDiv2").style.display="inline-block";
		getById("headphonesDiv").style.display="inline-block";
	}
	getById("info").innerHTML = "";
	getById("info").style.color="#CCC";
	getById("videoname1").value = roomid;
	getById("dirroomid").innerHTML = roomid;
	getById("roomid").innerHTML = roomid;
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
		joinRoom(roomid); // this is a scene, so we want high resolutions
		getById("main").style.overflow = "hidden";
	} 
} else if (urlParams.has('director')){ // if I do a short form of this, it will cause duplications in the code elsewhere. 
	createRoom(urlParams.get('director').replace(/[\W_]+/g,"_"));
} else if ((session.view) && (permaid===false)){
	log("Update Mixer Event on REsize SET");
	getById("translateButton").style.display = "none";
	window.addEventListener("resize", updateMixer);
	getById("main").style.overflow = "hidden";
} 

if (urlParams.has('hidemenu')){  // needs to happen the room and permaid applications
    getById("mainmenu").style.display="none";
	getById("header").style.display="none";
	getById("mainmenu").style.opacity = 0;
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
	if (apply){
		session.muted=!session.muted;
	}
	if (session.muted==false){
		session.muted = true;
		getById("mutetoggle").className="las la-microphone-slash my-float toggleSize";
		getById("mutebutton").className="float2";
		
		session.streamSrc.getAudioTracks().forEach((track) => {
		  track.enabled = false;
		});
		
	} else{
		session.muted=false;
		
		getById("mutetoggle").className="las la-microphone my-float toggleSize";
		getById("mutebutton").className="float";
		
		session.streamSrc.getAudioTracks().forEach((track) => {
		  track.enabled = true;
		});
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
		session.streamSrc.getVideoTracks().forEach((track) => {
		  track.enabled = false;
		});
		
	} else{
		session.videoMuted=false;
		
		getById("mutevideotoggle").className="las la-eye my-float toggleSize";
		getById("mutevideobutton").className="float";
		
		session.streamSrc.getVideoTracks().forEach((track) => {
		  track.enabled = true;
		});
	}
}

function toggleSettings(ele=null){ // TODO: I need to have this be MUTE, toggle, with volume not touched.
	
	
	if (getById("popupSelector").style.display=="none"){
		
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
	session.hangup();
}

function directEnable(ele, event){ // A directing room only is controlled by the Director, with the exception of MUTE.
	if (!((event.ctrlKey) || (event.metaKey))){
		if (ele.parentNode.parentNode.dataset.enable==1){
			ele.parentNode.parentNode.dataset.enable = 0;
			ele.className = "";
			ele.innerHTML = "Add to Group Scene";
			ele.parentNode.parentNode.style.backgroundColor = "#E3E4FF";
		} else {
			ele.parentNode.parentNode.style.backgroundColor = "#AFA";
			ele.parentNode.parentNode.dataset.enable = 1;
			ele.className = "pressed";
			ele.innerHTML = "Remove from Group Scene";
		}
	}
	var msg = {};
	msg.request = "sendroom";
	//msg.roomid = session.roomid;
	msg.scene = "1"; // scene
	msg.action = "display";
	msg.value =  ele.parentNode.parentNode.dataset.enable;
	msg.target = ele.parentNode.parentNode.dataset.UUID;
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function directMute(ele, event){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("mute");
	if (!((event.ctrlKey) || (event.metaKey))){
		if (ele.parentNode.parentNode.dataset.mute==0){
			ele.parentNode.parentNode.dataset.mute = 1;
			ele.className = "";
			ele.innerHTML = "Mute";
        } else {
			ele.parentNode.parentNode.dataset.mute = 0;
			ele.className = "pressed";
			ele.innerHTML = "Unmute";
        }
	}
	var msg = {};
	msg.request = "sendroom";
	//msg.roomid = session.roomid;
	msg.scene = "1";
	msg.action = "mute";
	msg.value =  ele.parentNode.parentNode.dataset.mute;
	msg.target = ele.parentNode.parentNode.dataset.UUID;
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function directVolume(ele){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("volume");
	var msg = {};
	msg.request = "sendroom";
	//msg.roomid = session.roomid;
	msg.scene = "1";
	msg.action = "volume";
	msg.target = ele.parentNode.parentNode.dataset.UUID; // i want to focus on the STREAM ID, not the UUID...
	msg.value = ele.value;
	
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
		//,cursor: {exact: "none"}
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
	
	//if (session.nocursor){
	//	constraints.video.cursor = ["motion", "always"];
	//} 
	

	if (session.framerate){
		constraints.video.frameRate = session.framerate;
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
			getById("chatbutton").className="float";
			getById("mutevideobutton").className="float";
			getById("hangupbutton").className="float";
			getById("settingsbutton").className="float";
			getById("controlButtons").style.display="flex";
			getById("helpbutton").style.display = "inherit";
		} else {
			getById("controlButtons").style.display="none";
		}
		getById("head1").className = 'advanced';
		getById("head2").className = 'advanced';
	}).catch(()=>{});

}
function publishWebcam(){
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
			getById("main").style.overflow = "hidden";
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
		getById("chatbutton").className="float";
		getById("mutevideobutton").className="float";
		getById("hangupbutton").className="float";
		getById("settingsbutton").className="float";
		getById("controlButtons").style.display="flex";
		getById("helpbutton").style.display = "inherit";
	} else {
		getById("controlButtons").style.display="none";
	}
	updateURL("push="+session.streamID);
	session.publishStream(ele, title);

}


var audioContext = null;
var meter = null;
var mediaStreamSource = null;
var drawLoopLimiter = null;

function volumeStream(stream) {
	if ((iOS) || (iPad)){
		log("Volume Meter not support on iOS due to Safari Glitch");
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

function joinRoom(roomname, maxbitrate=false){
	roomname = roomname.replace(/[^0-9a-z]/gi, '');
		if (roomname.length){
			log("Join room",roomname);
			log(roomname);
			session.joinRoom(roomname, maxbitrate).then(function(response){  // callback from server; we've joined the room
			
				if (session.director){
					var msg = {};
					msg.request = "claim";
					session.sendMsg(msg); 
				}
				
				log("Members in Room");
				log(response);
				for (var i in response){
					if ("UUID" in response[i]){
						if ("streamID" in response[i]){
							if (response[i].UUID in session.pcs){
								log("RTC already connected"); /// lets just say instead of Stream, we have 
							} else {
								//var title = "";                            // TODO: Assign labels 
								//if ("title" in response[i]){
									//	title = response[i]["title"];
									//}
								
								play(response[i].streamID);  // play handles the group room mechanics here
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
		roomname = roomname.replace(/[\W_]+/g,"_");
		if (roomname.length!=0){
			updateURL("director="+roomname); // make the link reloadable.
		}
	}
	if (roomname.length==0){
		alert("Please enter a room name before continuing");
		return;
	}
	log(roomname);
	
	var passwordRoom = getById("passwordRoom").value;
	if (passwordRoom.length){
		session.password=passwordRoom;
		updateURL("password="+session.password);
	}
	
	

	var gridlayout = getById("gridlayout");
	gridlayout.classList.add("directorsgrid");

	session.roomid = roomname;
	formSubmitting = false;

	var m = getById("mainmenu");
	m.remove();

	getById("head1").className = 'advanced';
	getById("head2").className = 'advanced';
	getById("head3").className = 'advanced';
	getById("head4").className = '';
	
	getById("dirroomid").innerHTML =  decodeURIComponent(roomname);
	getById("roomid").innerHTML = roomname;


	session.director = true;
	getById("reshare").parentNode.removeChild(getById("reshare"));
	
	var passAdd="";
	var passAdd2="";
	if (session.password){
		passAdd="&password=";
		passAdd2="&password="+session.password;
	}
	
	gridlayout.innerHTML = "<br /><div style='display:inline-block'><font style='font-size:130%;color:white;'></font><input  onclick='popupMessage(event);copyFunction(this)' onmousedown='copyFunction(this)' style='cursor:grab;font-weight:bold;background-color:#78F; width:400px; font-size:100%; padding:10px; border:2px solid black; margin:5px;'  class='task' value='https://"+location.host+location.pathname+"?room="+session.roomid+passAdd+"' /><font style='font-size:110%;color:white;'><i class='las la-video' style='position:relative;top:7px;font-size:2em;'  aria-hidden='true'></i> - Invites users to join the group and broadcast their feed to it. These users will see every feed, so performance problems may arise for some guests if too many people join a room.</font></div>";
	
	gridlayout.innerHTML += "<br /><font style='font-size:130%;color:white;'></font><input class='task' onclick='popupMessage(event);copyFunction(this)' onmousedown='copyFunction(this)' style='cursor:grab;font-weight:bold;background-color:#F45;width:400px;font-size:100%;padding:10px;border:2px solid black;margin:5px;' value='https://"+location.host+location.pathname+"?room="+session.roomid+passAdd+"&view' /><font style='font-size:110%;color:white;'><i class='las la-video' style='position:relative;top:7px;font-size:2em;'  aria-hidden='true'></i> - Link to Invite users to broadcast their feeds to the group. These users will not see or hear any feed from the group.</font><br />";
	
	
	gridlayout.innerHTML += "<font style='font-size:130%;color:white'></font><input class='task' onmousedown='copyFunction(this)' data-drag='1' onclick='popupMessage(event);copyFunction(this)' style='cursor:grab;font-weight:bold;background-color:#5F4;width:400px;font-size:100%;padding:10px;border:2px solid black;margin:5px;' value='https://"+location.host+location.pathname+"?scene=1&room="+session.roomid+passAdd2+"' /><font style='font-size:110%;color:white'><i class='las la-th-large' style='position:relative;top:7px;font-size:2em;' aria-hidden='true'></i> - This is an OBS Browser Source link that contains the group chat in just a single scene. Videos must be added to Group Scene.</font><br />";
	
	gridlayout.innerHTML += '<button style="margin:10px;" onclick="toggle(getById(\'roomnotes2\'),this);">Click Here for a quick overview and help</button><br />';
	
	gridlayout.innerHTML += "<div id='roomnotes2' style='display:none;padding:0 0 0 10px;' ><br />\
	<font style='color:#CCC;'>Welcome. This is the control-room for the group-chat. There are different things you can use this room for:<br /><br />\
	<li>You can host a small-group chat here. Share the blue link to invite guests who will join the chat automatically.</li>\
	<li>You can use it to invite and manage up to ~20 remote camera streams. Use the red-colored add camera link to bring in such streams.</li>\
	<li>You can add and remote control individual streams loaded into OBS. The required solo-links to add to OBS will appear under videos as they load.</li>\
	<li>You can use the auto-mixing Group Scene, the green link, to auto arrange multiple videos for you in OBS.</li>\
	<li>You can use it to record video streams independently</li>\
	<br />\
	As guests join, their videos will appear below. You can bring their video streams into OBS as solo-scenes or you can add them to the Group Scene.\
	<br />The Group Scene auto-mixes videos that have been added to the group scene. Please note that the Auto-Mixer requires guests be manually added to it for them to appear in it; they are not added automatically.<br /><Br />Apple mobile devices, such as iPhones and iPads, do not fully support Video Group Chat. This is a hardware constraint.<br /><br />\
	For advanced options and parameters, <a href=\"https://github.com/steveseguin/obsninja/wiki/Guides-and-How-to's#urlparameters\">see the Wiki.</a></font></div><hr />";
	
	gridlayout.innerHTML += "<div id='deleteme'><br /><br /><center>\
	<div style='display:inline-block;width:300px;height:350px;border:2px solid white;background-color:#999;margin:40px;'><br /><br />GUEST SLOT #1<br /><br />(A video will appear here when a guest joins)<br /><br /><i class='las la-user ' style='font-size:8em;' aria-hidden='true'></i><br /><br />A Solo-Link for OBS will appear here.</div>\
	<div style='display:inline-block;width:300px;height:350px;border:2px solid white;background-color:#999;margin:40px;'><br /><br />GUEST SLOT #2<br /><br />(A video will appear here when a guest joins)<br /><br /><i class='las la-user  ' style='font-size:8em;' aria-hidden='true'></i><br /><br />A Solo Link for OBS will appear here</div>\
	<div style='display:inline-block;width:300px;height:350px;border:2px solid white;background-color:#999;margin:40px;'><br /><br />GUEST SLOT #3<br /><br />(A video will appear here when a guest joins)<br /><br /><i class='las la-user ' style='font-size:8em;'aria-hidden='true'></i><br /><br />A Solo Link for OBS will appear here</div>\
	<div style='display:inline-block;width:300px;height:350px;border:2px solid white;background-color:#999;margin:40px;'><br /><br />GUEST SLOT #4<br /><br />(A video will appear here when a guest joins)<br /><br /><i class='las la-user ' style='font-size:8em;'aria-hidden='true'></i><br /><br />A Solo Link for OBS will appear here</div></center></div>";
	joinRoom(roomname);  // setting this to limit bitrate may break things.

}

function toggle(ele, tog=false) {
  var x = ele;
  if (x.style.display === "none") {
    x.style.display = "inline-block";
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
	   if (window.isSecureContext) {
			alert("An error has occured when trying to access the default audio device. The reason is not known.");
	   } else if ((iOS) || (iPad)){
			alert("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
	   } else {
			alert("Error acessing the default audio device.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
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
	   if (window.isSecureContext) {
			alert("An error has occured when trying to access the default audio device. The reason is not known.");
	   } else if ((iOS) || (iPad)){
			alert("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
	   } else {
			alert("Error acessing the default audio device.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
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
   alert("SSL (https) is not enabled. This site will not work without it!");
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



async function getAudioOnly(selector, trackid=null){
	var audioSelect = document.querySelector(selector).querySelectorAll("input"); 
	var audioList = [];
	var streams = [];
	
	for (var i=0; i<audioSelect.length;i++){
		if (audioSelect[i].value=="ZZZ"){
			continue;
		} else if (trackid==audioSelect[i].value){ // skip already excluded
			continue;
		} else if (audioSelect[i].checked){
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
	} else if (session.mirrored==0){
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
		setTimeout(function(){alert("Sorry, your browser is not supported. Please use the desktop versions of Firefox or Chrome instead");},1);
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
					} catch (e){
						errorlog(e);
					}
				}
			} else {
				toggleMute(true);  // I might want to move this outside the loop, but whatever
				for (UUID in session.pcs){
					try {
						session.pcs[UUID].addTrack(track, stream);
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
			setTimeout(function(){alert(err);},1); // TypeError: Failed to execute 'getDisplayMedia' on 'MediaDevices': Audio capture is not supported
		}
	});
}

var grabVideoTimer = null;
async function grabVideo(quality=0, eleName='previewWebcam', selector="select#videoSource"){
	if( activatedPreview == true){log("activated preview return 2");return;}
	activatedPreview = true;
	log("Grabbing video");
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
				
				//track.enabled = false;
				oldstream.removeTrack(track);
				log("track removed");
				//log("stopping video track");
			});
		} else {
			getById(eleName).srcObject = new MediaStream();
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
					gowebcam.disabled =false;
					gowebcam.style.backgroundColor = "#3C3";
					gowebcam.style.color = "black";
					gowebcam.style.fontWeight="bold";
					gowebcam.innerHTML = "START";
				}
				return;
			}
		} 
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
			navigator.mediaDevices.getUserMedia(constraints).timeout(15000).then(function(stream){
				
				log("adding video tracks 2412");
				stream.getVideoTracks().forEach(function(track){
					getById(eleName).srcObject.addTrack(track, stream); // add video track to the preview video
					session.streamSrc = getById(eleName).srcObject;
					toggleVideoMute(true);
					for (UUID in session.pcs){
						try {
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
							gowebcam.disabled =false;
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
				grabVideoTimer = setTimeout(function(){
					if (eleName=="previewWebcam"){
						getById(eleName).controls=true;
					}
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
						if (iOS){
							alert("An error occured. Closing existing tabs in Safari may solve this issue.");
						} else {
							alert("Error: Could not start video source.\n\nTypically this means the Camera is already be in use elsewhere. Most webcams can only be accessed by one program at a time.\n\nTry a different camera or perhaps try re-plugging in the device.");
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
					alert("Unknown error: 'NavigatorUserMediaError'"); 
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
					alert("Camera failed to load. \n\nPlease make sure it is not already in use by another application.\n\nPlease make sure you have accepted the camera permissions.");
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
					session.pcs[UUID].addTrack(track, streams[i]);
					//sender.replaceTrack(track);
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
		gowebcam.style.backgroundColor = "#3C3";
		gowebcam.style.color = "black";
		gowebcam.style.fontWeight="bold";
		gowebcam.innerHTML = "START";
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
		var track0 = stream.getVideoTracks();
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
	
	elmnt.ontouchstart = function (e) {
		dragMouseDown(e);
	};
	
	var pos0 = 1;
	function onvideoclick(e){
		
		log("click",e);
		e = e || window.event;
		e.preventDefault();
		return false;
	}
	
  function dragMouseDown(e) {
	log(e);
	elmnt.controls = false;
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

	document.ontouchmove = elementDrag;
	
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
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
	//zoom=(zoom+1)/2;
		
	input.value = zoom*(input.max - input.min) + input.min;
	
	if (input.value !=  pos0){
		track0.applyConstraints({advanced: [ {zoom: input.value} ]});
		//getById("infof").innerHTML = input.value + " " + pos0;
	}
	//log(pos2 +" , "+ elmnt.offsetHeight  +" , "+ parseFloat((3*pos2)/elmnt.offsetHeight) );
	

  }

  function closeDragElement(e) {
	elmnt.controls=true;
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
	document.ontouchmove = null;
  }
}
  
  
function setupWebcamSelection(stream=null){
	log("setup webcam");
	
	if (stream){
		getById("previewWebcam").srcObject = stream;
		if (stream.getAudioTracks().length){
			volumeStream(getById("previewWebcam").srcObject);
		}
	}
	
	try {
		return enumerateDevices().then(gotDevices).then(function(){
			
			
			if (parseInt(getById("webcamquality").elements.namedItem("resolution").value)==3){
				session.maxframerate  = 30;
			} else {
				session.maxframerate = false;
			}
			
			if ((iOS) || (iPad)){
				getById("multiselect1").parentNode.style.visibility="hidden";
				getById("multiselect1").parentNode.style.height="0px";
				//getById("multiselecta1").parentNode.style.height="0px";
				//getById("multiselecta1").parentNode.style.visibility="hidden";
			}
			
			var audioSelect = document.querySelector('#audioSource');
			var videoSelect = document.querySelector('select#videoSource');
			var outputSelect = document.querySelector('select#outputSource');
			
			audioSelect.onchange = function(){
				
				var gowebcam = getById("gowebcam");
				if (gowebcam){
					gowebcam.disabled = true;
					gowebcam.style.backgroundColor = "#DDDDDD";
					gowebcam.style.fontWeight="normal";
					gowebcam.innerHTML = "Waiting for Camera to load";
				}
				activatedPreview=false;
				grabAudio();
			};
			videoSelect.onchange = function(){
				
				var gowebcam = getById("gowebcam");
				if(gowebcam){
					gowebcam.disabled = true;
					gowebcam.style.backgroundColor = "#DDDDDD";
					gowebcam.style.fontWeight="normal";
					gowebcam.innerHTML = "Waiting for Camera to load";
				}
				warnlog("video source changed");
				
				activatedPreview=false;
				if (session.quality){
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
					gowebcam.style.backgroundColor = "#DDDDDD";
					gowebcam.style.fontWeight="normal";
					gowebcam.innerHTML = "Waiting for Camera to load";
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

			if (session.videoDevice===0){
				if (session.autostart){
					publishWebcam();  // no need to mirror as there is no video...
					return;
				} else {
					var gowebcam = getById("gowebcam");
					if (gowebcam){
						gowebcam.disabled =false;
						gowebcam.style.backgroundColor = "#3C3";
						gowebcam.style.color = "black";
						gowebcam.style.fontWeight="bold";
						gowebcam.innerHTML = "START";
					}
					return;
				}
			} else {
				log("GRabbing video");
				activatedPreview = false;
				if (session.quality){
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
            throw new Error("Time Out\n\nDid you accept camera permissions in time? Please do so first.\n\nOtherwise, do you have NDI Tools installed? Maybe try uninstalling it.\n\nPlease also double check your camera and audio device are correctly connected.");
        })
    ])
};

function previewWebcam(){
	if( activatedPreview == true){
		log("activeated preview return 1");
		return;
	}
	
	activatedPreview = true;
	

	if (session.mirrored==1 && session.flipped){
		 getById('previewWebcam').style.transform = " scaleX(1) scaleY(-1)";
		 getById('previewWebcam').classList.remove("mirrorControl");
	} else if (session.mirrored==1){
		 getById('previewWebcam').style.transform = "scaleX(1)";
		 getById('previewWebcam').classList.remove("mirrorControl");
	} else if (session.flipped){
		 getById('previewWebcam').style.transform = "scaleY(-1) scaleX(-1)";
		 getById('previewWebcam').classList.add("mirrorControl");
	} else {
		 getById('previewWebcam').style.transform = "scaleX(-1)";
		 getById('previewWebcam').classList.add("mirrorControl");
	}

	try{
		var oldstream = getById('previewWebcam').srcObject;
		
		if (oldstream){
			log("old stream found");
			oldstream.getTracks().forEach(function(track) {
				track.stop();
				oldstream.removeTrack(track);
				log("stopping old track");
			});
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
	
	try {
	  navigator.mediaDevices.getUserMedia(constraint).timeout(15000).then(function(stream){ // Apple needs thi to happen before I can access EnumerateDevices. 
		log("got first stream");
		setupWebcamSelection(stream);
	  }).catch(function(err){
			errorlog(err); /* handle the error */
			if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
				//required track is missing 
			} else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
				//webcam or mic are already in use 
			} else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
				//constraints can not be satisfied by avb. devices 
			} else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
				//permission denied in browser 
				setTimeout(function(){alert("Permissions denied. Please ensure you have allowed the mic/camera permissions.");},1);
				return;
			} else if (err.name == "TypeError" || err.name == "TypeError") {
				//empty constraints object 
			}  else {
				//permission denied in browser 
				setTimeout(function(){alert(err);},1);
			}
		  errorlog("trying to list webcam again");
		  setupWebcamSelection();
	  });
	} catch (e){
		errorlog(e);
		if (window.isSecureContext) {
			alert("An error has occured when trying to access the webcam or microphone. The reason is not known.");
		} else if ((iOS) || (iPad)){
			alert("iOS version 13.4 and up is generally recommended; older than iOS 11 is not supported.");
		} else {
			alert("Error acessing camera or microphone.\n\nThe website may be loaded in an insecure context.\n\nPlease see: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia");
		}
	}
}


function copyFunction(copyText) {
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");

}


function generateQRPage(){
	try{
		var title = encodeURI(getById("videoname4").value);
		if (title.length){
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
		if (getById("invite_secure").checked){
			sendstr+="&secure";
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
			viewstr+="&scene=1&room="+getById("invite_joinroom").value.trim();
		}
		
		if (getById("invite_password").value.trim().length){
			sendstr+="&password=";
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
		
		sendstr = 'https://' + location.host + location.pathname + '?push=' + sid + sendstr;
		viewstr = 'https://' + location.host+ location.pathname + '?view=' + sid + viewstr + title;
		
		getById("gencontent").innerHTML = '<br /><div id="qrcode" style="background-color:white;display:inline-block;color:black;max-width:340px;padding:40px;"><h2 style="color:black">Guest Invite Link:</h2><input class="task" onclick="popupMessage(event);copyFunction(this)" onmousedown="copyFunction(this)"  \
		style="cursor:grab;background-color:#CFC;border: 2px solid black;width:260px;font-size:120%;padding:10px;"  value="' + sendstr + '" /><br /><br /></div>\
			<br /><br />and don\'t forget the<h2 style="color:black">OBS Browser Source Link:</h2><input class="task" data-drag="1" onmousedown="copyFunction(this)" onclick="popupMessage(event);copyFunction(this)"  style="cursor:grab;background-color:#FCC;width:400px;font-size:120%;padding:10px;border:2px solid black;margin:5px;" value="' + viewstr + '" /> \
			<br /><br />\
		Please also note, the invite link and OBS ingestion link created is reusable, but only one person may use a specific invite at a time.';
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
					getById("mainmenu").innerHTML = '<font style="color:#666"><h1>Attempting to load video stream.</h1></font>';
					getById("mainmenu").innerHTML += '<font style="color:#EEE">The stream is not available yet or an error occured.</font><br/><button onclick="location.reload();">Retry Manually</button><br/>';
					
				}}
		} catch(e){
			errorlog("Error handling QR Code failure");
		}
	},15000);

	log("auto playing");

	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){ 
		alert("Safari requires us to ask for an audio permission to use peer-to-peer technology. You will need to accept it in a moment if asked to view this live video");
		navigator.mediaDevices.getUserMedia({audio: true}).then(function(){
			play();
		}).catch(function(){
			play();
		});
	} else {
		play();
		//getById("mainmenu").style.display="none";
	}
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
	var streamId = url.split('view=');
	var label = url.split('label=');

	url += '&layer-name=OBS.Ninja';
	if (streamId.length>1) url += ': ' + streamId[1].split('&')[0];
	if (label.length>1) url += ' - ' + decodeURI(label[1].split('&')[0]);
	
	try{
		var video = getById('videosource');
		if (typeof(video.videoWidth) == "undefined"){
			url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
			url += '&layer-height=1080';
		} else if ((parseInt(video.videoWidth)<200) || (video.videoHeight<200)){
			url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
			url += '&layer-height=1080';
		} else {
			url += '&layer-width=' + video.videoWidth; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
			url += '&layer-height=' + video.videoHeight;
		}
	} catch(error){
		url += '&layer-width=1920'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
		url += '&layer-height=1080';
	}
	errorlog(url);
	event.dataTransfer.setData("text/uri-list", encodeURI(url));
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
	data.type = "sent";
	document.getElementById('chatInput').value = "";
	messageList.push(data);
	messageList = messageList.slice(-10);
	updateMessages();
}

function getChatMessage(msg){
	msg = sanitize(msg); // keep it clean.
	if (msg==""){return;}
	data = {};
	data.time = Date.now();
	data.msg = msg;
	data.type = "recv";
	messageList.push(data);
	messageList = messageList.slice(-10);
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
		console.log(messageList[i].msg); // Display Recieved messages for View-Only clients.
		if (messageList[i].type == "sent"){
			msg.innerHTML = messageList[i].msg + " <i><small> <small>- "+time+"</small></small></i>";
			msg.classList.add("outMessage");
		} else if (messageList[i].type == "recv"){
			msg.innerHTML = messageList[i].msg + " <i><small> <small>- "+time+"</small></small></i>";
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