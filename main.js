/////////////

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.

var VIS = vis;
var formSubmitting = true;
var setFormSubmitting = function() { formSubmitting = true; };
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

window.onpopstate = function() {
	if (interacted){
		window.location.reload(true);
	}
}; 


var session = Ooblex.Media;
session.streamID = session.generateStreamID();
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
    }

})(window)
var urlParams = new URLSearchParams(window.location.search);


if (urlParams.has('permaid')){
	var permaid  = urlParams.get('permaid');
	session.changeStreamID(permaid);
	document.getElementById("container-1").className = 'column columnfade advanced';
	document.getElementById("container-4").className = 'column columnfade advanced';
} 

if (urlParams.has('stereo')){
	log("STEREO ENABLED");
        session.stereo = true;
}

if (urlParams.has('codec')){
	log("CODEC CHANGED");
    session.codec = urlParams.get('codec');
}

if (urlParams.has('bitrate')){
    session.bitrate = parseInt(urlParams.get('bitrate'));
	log("BITRATE ENABLED");
	log(session.bitrate);
}

if (urlParams.has('height')){
	session.height = parseInt(urlParams.get('height'));
}

if (urlParams.has('width')){
	session.width = parseInt(urlParams.get('width'));
}

if (urlParams.has('framerate')){
    session.framerate = parseInt(urlParams.get('framerate'));
	log("framerate Changed");
	log(session.framerate);
}

if (urlParams.has('sync')){
    session.sync = parseFloat(urlParams.get('sync'));
	log("sync Changed");
	log(session.sync);
}

if (urlParams.has('buffer')){
    session.buffer = parseFloat(urlParams.get('buffer'));
	log("buffer Changed");
	log(session.buffer);
}

			//var sync = session.sync | 0;
			//var buffer = session.buffer | 0;

if (urlParams.has('turn')){
	try {
		var turnstring = urlParams.get('turn').split(";");
		var turn = {};
		turn.username = turnstring[0]; // myusername
		turn.credential = turnstring[1];  //mypassword
		turn.urls = [turnstring[2]]; //  ["turn:turn.obs.ninja:443"];
		session.configuration.iceServers.push(turn);
	} catch (e){
		alert("TURN server parameters were wrong.");
		errorlog(e);
	}
} else {   // THIS IS ME being Very Generous. For a little while.
        var turn = {};
        turn.username = "steve";
        turn.credential = "justtesting";
        turn.urls = ["turn:turn.obs.ninja:443"];
        session.configuration.iceServers.push(turn);
}

function updateURL(param) {
	var para = param.split('=')[0];
	if (!(urlParams.has(para))){
		
		if (history.pushState){
			
			var arr = window.location.href.split('?');
			if (arr.length > 1 && arr[1] !== '') {
				var newurl = window.location.href + '&' +param;
			} else {
				var newurl = window.location.href + '?' +param;
			}
			
			
			window.history.pushState({path:newurl},'',newurl);
		}
	}
}

function jumptoroom(){
	document.getElementById("joinroomID").value;
	var arr = window.location.href.split('?');
	if (arr.length > 1 && arr[1] !== '') {
	  window.location+="&roomid="+document.getElementById("joinroomID").value;
	} else {
		window.location+="?roomid="+document.getElementById("joinroomID").value;
	}
}

var micvolume = 100;
session.connect();
session.volume = micvolume;
if (urlParams.has('roomid')){
	var roomid  = urlParams.get('roomid');
	roomid = encodeURIComponent(roomid);
	session.roomid = roomid;
	document.getElementById("videoname1").value = roomid;
	document.getElementById("dirroomid").innerHTML = roomid;
	document.getElementById("roomid").innerHTML = roomid;
	document.getElementById("container-1").className = 'column columnfade advanced';
	document.getElementById("container-4").className = 'column columnfade advanced';
	document.getElementById("head1").innerHTML = '- Welcome. Please select an option to join the chat room';
	document.getElementById("add_camera").innerHTML = "Join Room with Camera";
	document.getElementById("add_screen").innerHTML = "Screenshare with Room";
	document.getElementById("head3").className = 'advanced';
	if (urlParams.has('scene')){
		session.scene = urlParams.get('scene');
		document.getElementById("container-4").className = 'column columnfade';
		document.getElementById("container-3").className = 'column columnfade';
		document.getElementById("container-2").className = 'column columnfade';
		document.getElementById("container-1").className = 'column columnfade';
		document.getElementById("header").className = 'advanced';
		document.getElementById("info").className = 'advanced';
		document.getElementById("header").className = 'advanced';
		document.getElementById("head1").className = 'advanced';
		document.getElementById("head2").className = 'advanced';
		document.getElementById("head3").className = 'advanced';
		document.getElementById("mainmenu").style.display = "none";
		window.addEventListener("resize", updateMixer);
		joinRoom(roomid); // this is a scene, so we want high resolutions
	} 
}	



function checkConnection(){
	if (session.ws.readyState === WebSocket.OPEN) {
		document.getElementById("qos").style.color = "white";
	} else {
		document.getElementById("qos").style.color = "red";
	}
}
setInterval(function(){checkConnection();},5000);


function updateStats(){
	log('resolution found');
	//log(document.getElementById('previewWebcam').videoWidth|0);
	//log(document.getElementById('previewWebcam').videoHeight|0);
	document.getElementById('previewWebcam').srcObject.getVideoTracks().forEach(
		function(track) {
			log(track.getSettings());
			log(track.getSettings().frameRate);
			//log(track.getSettings().frameRate);
			document.getElementById("webcamstats").innerHTML = "Current Video Settings: "+(track.getSettings().width|0) +"x"+(track.getSettings().height|0)+"@"+(parseInt(track.getSettings().frameRate*10)/10)+"fps";
		}
	);
}

function toggleMute(){ // TODO: I need to have this be MUTE, toggle, with volume not touched.
	var msg = {};
	if (micvolume==0){
		micvolume = 100;
		document.getElementById("mutetoggle").className="fa fa-microphone my-float";
		document.getElementById("mutebutton").className="float3";
	} else{
		micvolume=0;
		document.getElementById("mutetoggle").className="fa fa-microphone-slash my-float";
		document.getElementById("mutebutton").className="float";
	}
	msg.volume = micvolume;
	session.volume = micvolume;
	session.sendMessage(msg);
}
////////////////////////////

function directEnable(ele){ // A directing room only is controlled by the Director, with the exception of MUTE.
        log("enable");
	if (ele.parentNode.parentNode.dataset.enable==1){
		ele.parentNode.parentNode.dataset.enable = 0;
		ele.className = "";
		ele.innerHTML = "Add to Group Scene";
		ele.parentNode.parentNode.style.backgroundColor = "#E3E4EF";
	} else {
		ele.parentNode.parentNode.style.backgroundColor = "#AFA";
		ele.parentNode.parentNode.dataset.enable = 1;
		ele.className = "pressed";
		ele.innerHTML = "Remove from Group Scene";
	}
        var msg = {};
        msg.request = "sendroom";
        msg.roomid = session.roomid;
        msg.director = "1" // scene
        msg.action = "display";
        msg.value =  ele.parentNode.parentNode.dataset.enable;
        msg.target = ele.parentNode.parentNode.dataset.UUID;
        session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function directMute(ele){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("mute");
	if (ele.parentNode.parentNode.dataset.mute==0){
                ele.parentNode.parentNode.dataset.mute = 1;
                ele.className = "";
		ele.innerHTML = "Mute";
        } else {
                ele.parentNode.parentNode.dataset.mute = 0;
                ele.className = "pressed";
		ele.innerHTML = "Unmute";
        }
	var msg = {};
	msg.request = "sendroom";
	msg.roomid = session.roomid;
	msg.director = "1";
	msg.action = "mute";
	msg.value =  ele.parentNode.parentNode.dataset.mute;
	msg.target = ele.parentNode.parentNode.dataset.UUID;
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function directVolume(ele){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("volume");
	var msg = {};
	msg.request = "sendroom";
	msg.roomid = session.roomid;
	msg.director = "1";
	msg.action = "volume";
	msg.target = ele.parentNode.parentNode.dataset.UUID; // i want to focus on the STREAM ID, not the UUID...
	msg.value = ele.value;
	
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function chatRoom(chatmessage="hi"){ // A directing room only is controlled by the Director, with the exception of MUTE.
	log("Chat message");
	var msg = {};
	msg.request = "sendroom";
	msg.roomid = session.roomid;
	msg.action = "chat";
	msg.value = chatmessage;
	session.sendMsg(msg); // send to everyone in the room, so they know if they are on air or not.
}


function changeTitle(aTitle="Untitled"){
	log("changing title; if connected at least");
	session.changeTitle(aTitle);
}

var activatedStream = false;
function publishScreen(){
	if( activatedStream == true){return;}
	activatedStream = true;

	var title = "ScreenShare" //document.getElementById("videoname2").value;

	formSubmitting = false;

	var width = {ideal: 1280};
	var height = {ideal: 720};

	if (session.width){
		width = {ideal: session.width};
	}
	if (session.height){
		height = {ideal: session.height};
	}

	var constraints = window.constraints = {
		audio: {echoCancellation: false, autoGainControl: false, noiseSuppression:false }, // I hope this doesn't break things..
		video: {width: width, height: height, cursor: "never", mediaSource: "browser"}
	};
	
	if (session.framerate){
		constraints.video.frameRate = {exact: session.framerate};
	}

	if (session.roomid){
		window.addEventListener("resize", updateMixer);
		joinRoom(session.roomid,100);
		document.getElementById("head3").className = 'advanced';
		//updateURL("permaid="+session.streamID);
	} else {
		document.getElementById("head3").className = '';
	}
	updateURL("permaid="+session.streamID);
	session.publishScreen(constraints, title);
	log("streamID is: "+session.streamID);

	document.getElementById("mutebutton").className="float3";
	document.getElementById("helpbutton").className="float2";

	document.getElementById("head1").className = 'advanced';
	document.getElementById("head2").className = 'advanced';

}
function publishWebcam(){
	if( activatedStream == true){return;}
	activatedStream = true;

	var title = "Webcam"; // document.getElementById("videoname3").value;
	var ele = document.getElementById("previewWebcam");

	var stream = ele.srcObject;

	ele.parentNode.removeChild(ele);

	formSubmitting = false;
	window.scrollTo(0, 0); // iOS has a nasty habit of overriding the CSS when changing camaera selections, so this addresses that.

	if (session.roomid){
		window.addEventListener("resize", updateMixer);
		joinRoom(session.roomid,100);
		document.getElementById("head3").className = 'advanced';
		//updateURL("permaid="+session.streamID);
	} else {
		document.getElementById("head3").className = '';
	}
	updateURL("permaid="+session.streamID);
	session.publishStream(stream, title);
	log("streamID is: "+session.streamID);
	document.getElementById("head1").className = 'advanced';
	document.getElementById("head2").className = 'advanced';

	document.getElementById("mutebutton").className="float3";
	document.getElementById("helpbutton").className="float2";


}

function joinRoom(roomname, maxbitrate=false){
	roomname = roomname.replace(/[^0-9a-z]/gi, '');
		if (roomname.length){
			log("Join room",roomname);
			log(roomname);
			session.joinRoom(roomname,maxbitrate).then(function(response){  // callback from server; we've joined the room
				log("Members in Room");
				log(response);
				for (i in response){
					if ("UUID" in response[i]){
						if ("streamID" in response[i]){
							if (response[i]['UUID'] in session.pcs){
								log("RTC already connected"); /// lets just say instead of Stream, we have 
							} else {
								//var title = "";                            // TODO: Assign labels 
								//if ("title" in response[i]){
									//	title = response[i]["title"];
									//}
								if (urlParams.has('streamid')){
									play(response[i]['streamID']);
								} else {
									session.watchStream(response[i]['streamID']); // How do I make sure they aren't requesting the same movie twice as a race condition?
								}
							}
						}
					}
				}

			},function(error){return {}});
		} else {
			errorlog("Room name not long enough or contained all bad characaters");
		}	
}


function createRoom(){

	var roomname = document.getElementById("videoname1").value;
	log(roomname);
	if (roomname.length==0){
		alert("Please enter a room name before continuing");
		return;
	}

	var gridlayout = document.getElementById("gridlayout");
	gridlayout.classList.add("directorsgrid");

	//	var sheet = document.createElement('style');
	//	sheet.innerHTML = ".tile{object-fit:contain  }";
	//	document.body.appendChild(sheet);

	var roomname = document.getElementById("videoname1").value;
	log(roomname);
	session.roomid = roomname;
	formSubmitting = false;

	var m = document.getElementById("mainmenu");
	m.remove();

	document.getElementById("head1").className = 'advanced';
	document.getElementById("head2").className = 'advanced';
	document.getElementById("head3").className = 'advanced';
	document.getElementById("head4").className = '';
	
	document.getElementById("dirroomid").innerHTML = roomname;
	document.getElementById("roomid").innerHTML = roomname;


	//document.getElementById("mutebutton").className="float3";
	//document.getElementById("helpbutton").className="float2";
	session.director = true;
	document.getElementById("reshare").parentNode.removeChild(document.getElementById("reshare"));
	
	gridlayout.innerHTML = "<br /><div style='display:inline-block'><font style='font-size:130%;color:white;'><i class='fa fa-paper-plane-o' style='font-size:2em;'  aria-hidden='true'></i> Guest Invite Link: <a data-share='' onclick='var range=document.createRange(); range.selectNodeContents(this); var selec = window.getSelection(); selec.removeAllRanges();selec.addRange(range);document.execCommand(\"copy\");' onmouseover='this.style.cursor=\"pointer\"'><font style='color:#54F'>https://"+location.hostname+location.pathname+"?roomid="+session.roomid+"</font>\
	</a></div>";
	
	gridlayout.innerHTML += "<br /><font style='font-size:130%;color:white;'><i class='fa fa-video-camera' style='font-size:2em;'  aria-hidden='true'></i> Add Local Camera or OBS VirtualCam: <a data-share='' onclick='var range=document.createRange(); range.selectNodeContents(this); var selec = window.getSelection(); selec.removeAllRanges();selec.addRange(range);document.execCommand(\"copy\");' onmouseover='this.style.cursor=\"pointer\"'><font style='color:#F45'>https://"+location.hostname+location.pathname+"?roomid="+session.roomid+"&streamid</font>\
	</a><br />";
	
	
	gridlayout.innerHTML += "<font style='font-size:130%;color:white'><i class='fa fa-th-large' style='font-size:2em;'  aria-hidden='true'></i> Group Scene (OBS link /w auto-mixing):<a data-share='' onclick='var range=document.createRange(); range.selectNodeContents(this); var selec = window.getSelection(); selec.removeAllRanges();selec.addRange(range);document.execCommand(\"copy\");' onmouseover='this.style.cursor=\"pointer\"' id='reshare'><font style='color:#5F4'>https://"+location.hostname+location.pathname+"?scene=1&roomid="+session.roomid+"</font></a><br />";
	
	gridlayout.innerHTML += "<br /><br />\
	<font style='font-size:80%;color:#CCC;'> As guests join, their videos will appear below. You can bring their video streams into OBS manually as solo-scenes or you can add them to the Group Scene. The Group Scene auto-mixes together videos you have added to the group-scene; just add the Group Scene link to OBS in that case.\
	<hr /><br /></font>";
	
	joinRoom(roomname,100);

}

function enumerateDevices() {
	if (typeof navigator.enumerateDevices === "function") {
		return navigator.enumerateDevices();
	}
	else if (typeof navigator.mediaDevices === "object" &&
		typeof navigator.mediaDevices.enumerateDevices === "function") {
		return navigator.mediaDevices.enumerateDevices();
	}
	else {
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

function gotDevices(deviceInfos) { // https://github.com/webrtc/samples/blob/gh-pages/src/content/devices/input-output/js/main.js#L19
	const audioInputSelect = document.querySelector('select#audioSource');
	const videoSelect = document.querySelector('select#videoSource');
	const selectors = [audioInputSelect, videoSelect];

	// Handles being called several times to update labels. Preserve values.
		const values = selectors.map(select => select.value);
	selectors.forEach(select => {
		while (select.firstChild) {
			select.removeChild(select.firstChild);
		}
	});
	log(deviceInfos);
	
	for (let i = 0; i !== deviceInfos.length; ++i) {
		const deviceInfo = deviceInfos[i];
		const option = document.createElement('option');
		option.value = deviceInfo.deviceId;
		if (deviceInfo.kind === 'audioinput') {
			option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
			audioInputSelect.appendChild(option);
		} else if (deviceInfo.kind === 'videoinput') {
			option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
			videoSelect.appendChild(option);
		} else {
			log('Some other kind of source/device: ', deviceInfo);
		}
	}
	
	const option = document.createElement('option');
	option.text = "Disable Audio";
	option.value = "ZZZ";
	audioInputSelect.appendChild(option); // NO AUDIO OPTION
	
	
	
	selectors.forEach((select, selectorIndex) => {
		if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
			select.value = values[selectorIndex];
		}
	});
	
	audioInputSelect.selectedIndex  = 0;
}

function handleError(error) {
	errorlog(error);
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
					width: { min: 360, ideal: 1280, max: 1440 },
				};
			}
			else {
				return {
					width: { min: 360, ideal: 1280, max: 1440 },
				};
			}
		case 3:
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
		
		case 4:
			if (isSafariBrowser) {
				return {
					height: { min: 360, ideal: 720, max: 960 }
				};
			}
			else {
				return {
					height: { min: 360, ideal: 960, max: 960 }
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
					width: { min: 360, ideal: 640, max: 3840 },
					height: { min: 360, ideal: 360, max: 2160 }
				};
			}
		case 6:
			if (isSafariBrowser) {
				return {}; // iphone users probably don't need to wait any longer, so let them just get to it
			}
			else {
				return {width: {min:360,max:1920}, 
						height: {min:360, max:1920}}; // same as default, but I didn't want to mess with framerates until I gave it all a try first
			}
		case 7:
			return { // If the camera is recording in low-light, it may have a low framerate. It coudl also be recording at a very high resolution.
				width: { min: 360, ideal: 640 },
				height: { min: 360, ideal: 360 },
				frameRate: 10
			};

		case 8:
			return {width: {min:360,max:1920}, height: {min:360, max:1920}}; // same as default, but I didn't want to mess with framerates until I gave it all a try first
		case 9:
			return {frameRate: 0 };  // Some Samsung Devices report they can only support a framerate of 0.
		default:
			return {}; 
	}
}

function grabVideo(quality=0, audioEnable=false){
	if( activatedPreview == true){log("activeated preview return");return;}
	activatedPreview = true;
	log(quality);
	log("trying with quality:");

	var audioSelect = document.querySelector('select#audioSource');
	var videoSelect = document.querySelector('select#videoSource');
	var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

	if (iOS){  // iOS will not work correctly at 1080p; likely a h264 codec issue.
		if (quality==0){
			quality=1;
		}
	}

	var audio = false;
	if (audioEnable==true){
		if (audioSelect.value!=="ZZZ"){
			audio = {deviceId: {exact: audioSelect.value}};
			if (session.stereo){
				audio.echoCancellation = false;
				audio.autoGainControl = false;
				audio.noiseSuppression = false;
			}
		} 
	}
	
	var constraints = {
		audio: audio,
		video: getUserMediaVideoParams(quality, iOS)
	};
	constraints.video.deviceId = { exact: videoSelect.value };

	if (session.width){
		constraints.video.width = {exact: session.width};
	}
	if (session.height){
		constraints.video.height = {exact: session.height};
	}
	if (session.framerate){
		constraints.video.frameRate = {exact: session.framerate};
	} else if (session.maxframerate){
		constraints.video.frameRate = {max: session.maxframerate};
	}

	log(constraints);

	setTimeout(()=>{
		try {

			log("Trying Constraints");
			var oldstream= document.getElementById('previewWebcam').srcObject;
			if (oldstream){
				oldstream.getTracks().forEach(function(track) {
					track.stop();
				});
			}
		} catch(e){
			errorlog(e);
		}
		navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
			if (audioEnable == false){
				stream.getTracks().forEach(function(track) { // We don't want to keep it without audio; so we are going to try to add audio now.
						track.stop();
				});
				log("GOT IT BUT WITH NO AUDIO");
				activatedPreview = false;
				grabVideo(quality,true);
			}else {
				document.getElementById('previewWebcam').srcObject = stream; // set the preview window and run with it
				log("DONE - found stream");
			}
		}).catch(function(e){
			activatedPreview = false;
			errorlog(e);
			if (e.name === "OverconstrainedError"){
				errorlog(e.message);
				log("Resolution didn't work");
			} else if (e.name === "NotReadableError"){
				if (iOS){
					alert("An error occured. Upgrading to at least iOS 13.4 should fix this glitch from happening again");
				} else {
					alert("Error Listing Media Devices.\n\nThe default Camera may already be in use with another app. Typically webcams can only be accessed by one program at a time.\n\nThe selected device may also not be supported.");
				}
				activatedPreview=true;
				return;
			} else if (e.name === "NavigatorUserMediaError"){
				alert("Unknown error: 'NavigatorUserMediaError'"); 
				return;
			} else {
				errorlog("An unknown camera error occured");
			}
			if (quality<=9){
				grabVideo(quality+1);
			} else {
				errorlog("********Camera failed to work");
				activatedPreview=true;
				alert("Camera failed to load. Please make sure it is not already in use by another application.");
			}
		});
	},0);
}

var activatedPreview = false;
  
  
function setupWebcamSelection(){
	enumerateDevices().then(gotDevices).then(function(){
		if (parseInt(document.getElementById("webcamquality").elements.namedItem("resolution").value)==3){
			session.maxframerate  = 30;
		} else {
				session.maxframerate = false;
		}
		
		var audioSelect = document.querySelector('select#audioSource');
		var videoSelect = document.querySelector('select#videoSource');
		
		audioSelect.onchange = function(){
			log("AUDIO source CHANGED");
			activatedPreview=false;
			grabVideo(parseInt(document.getElementById("webcamquality").elements.namedItem("resolution").value));
		};
		videoSelect.onchange = function(){
			log("video source changed");
			activatedPreview=false;
			grabVideo(parseInt(document.getElementById("webcamquality").elements.namedItem("resolution").value));
		};
		document.getElementById("webcamquality").onchange = function(){
			log("AUDIO source CHANGED");
			activatedPreview=false;
			if (parseInt(document.getElementById("webcamquality").elements.namedItem("resolution").value)==3){
				session.maxframerate  = 30;
			} else {
				session.maxframerate = false;
			}
			grabVideo(parseInt(document.getElementById("webcamquality").elements.namedItem("resolution").value));
		};

		activatedPreview = false;
		grabVideo(parseInt(document.getElementById("webcamquality").elements.namedItem("resolution").value));

	}).catch(handleError);
}

function previewWebcam(){
  if( activatedPreview == true){log("activeated preview return");return;}
  activatedPreview = true;

  window.setTimeout(() => {

	  var oldstream= document.getElementById('previewWebcam').srcObject;
	  if (oldstream){
		  oldstream.getTracks().forEach(function(track) {
			  track.stop();
		  });
	  }
	  
	  
	  
		  navigator.mediaDevices.getUserMedia({audio:true, video:true }).then(function(stream){ // Apple needs thi to happen before I can access EnumerateDevices. 
				  //document.getElementById('previewWebcam').srcObject=stream;
				stream.getTracks().forEach(function(track) { // We don't want to keep it without audio; so we are going to try to add audio now.
					  track.stop();
				});
				setupWebcamSelection();
		  }).catch(function(e){
			  errorlog("trying to list webcam again");
			  setupWebcamSelection();
		  });
	  

  },0);
}


function checkOBS(){
	if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
		log("enumerateDevices() not supported.");
		return;
	}

	navigator.mediaDevices.enumerateDevices().then(function(devices) {
		var matchFound = false;
		devices.forEach(function(device) {
			if (device.label.startsWith("OBS-Camera")){
				alert("An OBS Virtual Camera was detected; Success!");
				log(device.kind + ": " + device.label +
					" id = " + device.deviceId);
				matchFound = true;

			}
			log(device.kind + ": " + device.label + " id = " + device.deviceId);
		});
		if (matchFound == false){
			alert("No OBS Virtual Camera was found");
		}
	}).catch(function(err) {
		log(err.name + ": " + err.message);
	});
}

function play(streamid=null){  // play whatever is in the URL params; or filter by a streamID option
	log("play stream");
	if (urlParams.has('streamid')){
		var streamlist = urlParams.get('streamid').split(",");
		log(streamlist);
		for (j in streamlist){
			if (streamid===null){
				session.watchStream(streamlist[j]);
			} else if (streamid === streamlist[j]){
				session.watchStream(streamlist[j]);
			}
		}
	}
}
var retry=null;
function browse(){
	log("browse streams");
	session.listStreams().then(function(response){
		document.getElementById("browserlist").innerHTML='No Active Broadcasts';
		response.forEach(streamID => {
			document.getElementById("browserlist").innerHTML="<a href='./?streamid="+streamID[1]+"'>"+streamID[2]+"</a> - "+streamID[0]+" seeders<br />";
		});
	},function(error){return {}});
}

function generateQRPage(ele){
	try{
		var title = encodeURI(document.getElementById("videoname4").value);
		if (title.length){
			title = "&label="+title;
		}
		var sid = session.generateStreamID();
		ele.parentNode.innerHTML = '<br /><div id="qrcode" style="background-color:white;display:inline-block;color:black;max-width:300px;padding:20px;"><h2 style="color:black">Invite Link:</h2><p style="max-width:170px;"><a href="https://' + location.hostname+ location.pathname + '?permaid=' + sid+'" ">https://' + location.hostname + location.pathname + '?permaid=' + sid  +'</a></p><br /></div>\
			<br /><br />and don\'t forget the<h2 style="color:black">OBS Link:</h2><p><a style="font-size:120%" href="https://' + location.hostname+ location.pathname + '?streamid=' + sid + title + '">https://' + location.hostname + location.pathname + '?streamid=' + sid + title + '</a></p><br /><i>In OBS v25 you can drag this link directly into OBS, or you can create a Browse element in OBS and insert it the URL source.</i> \
			<br /><br />\
		Please also note, the invite link and OBS ingestion link created is reusable, but only one person may use a specific invite at a time.';
		var qrcode = new QRCode(document.getElementById("qrcode"), {
			width : 300,
			height : 300,
			colorDark : "#000000",
			colorLight : "#FFFFFF",
			useSVG: false
		});
		qrcode.makeCode('https://' + location.hostname + location.pathname + '?permaid=' + sid);

	} catch(e){
		errorlog(e);
	}
}


if (urlParams.has('streamid')){
	document.getElementById("main").className = "";
	document.getElementById("credits").style.display = 'none';
}


if ((urlParams.has('streamid')) && (session.roomid==false)){
	document.getElementById("container-4").className = 'column columnfade';
	document.getElementById("container-3").className = 'column columnfade';
	document.getElementById("container-2").className = 'column columnfade';
	document.getElementById("container-1").className = 'column columnfade';
	//document.getElementById("header").className = 'advanced';
	document.getElementById("info").className = 'advanced';
	document.getElementById("header").className = 'advanced';
	document.getElementById("head1").className = 'advanced';
	document.getElementById("head2").className = 'advanced';
	document.getElementById("head3").className = 'advanced';

	document.getElementById("mainmenu").style.backgroundImage = "url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K')";

	document.getElementById("mainmenu").style.backgroundRepeat = "no-repeat";
	document.getElementById("mainmenu").style.backgroundPosition = "bottom center";
	document.getElementById("mainmenu").style.minHeight = "300px";
	document.getElementById("mainmenu").style.backgroundSize = "100px 100px";
	document.getElementById("mainmenu").innerHTML = '';
	
	setTimeout(function(){
		try{
			if (urlParams.get("streamid")){
				if (document.getElementById("mainmenu")){
					document.getElementById("mainmenu").innerHTML = '<font style="color:#666"><h1>Attempting to load video stream.</h1></font>';
					document.getElementById("mainmenu").innerHTML += '<font style="color:#EEE">If the stream does not load within a few seconds, the stream may not be available or some other error has occured. If the issue persists, please check out the <a href="https://reddit.com/r/obsninja">https://reddit.com/r/obsninja</a> for possible solutions or contact <a href="mailto:steve@seguin.email" target="_top">steve@seguin.email</a>.</font><br/><button onclick="location.reload();">Retry Connecting</button><br/>';

					document.getElementById("mainmenu").innerHTML += '<div id="qrcode" style="background-color:white;display:inline-block;color:black;max-width:300px;padding:20px;"><h2 style="color:black">Stream Invite URL:</h2><p><a href="https://' + location.hostname+ location.pathname + '?permaid=' + session.streamID + '">https://' + location.hostname + location.pathname + '?permaid=' + urlParams.get("streamid") + '</a></p><br /></div>';
					var qrcode = new QRCode(document.getElementById("qrcode"), {
						width : 300,
						height : 300,
						colorDark : "#000000",
						colorLight : "#FFFFFF",
						useSVG: false
					});
					qrcode.makeCode('https://' + location.hostname + location.pathname + '?permaid=' + urlParams.get("streamid"));
					retry = setInterval(function(){
						if (document.getElementById("mainmenu")){
							play();
						} else {
							clearInterval(retry);
						}
					},10000)
				}}
		} catch(e){
			errorlog("Error handling QR Code failure");
		}
	},2000);

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
		//document.getElementById("mainmenu").style.display="none";
	}
}

function updateMixer(){
	//log("update mixer");
	var playarea = document.getElementById("gridlayout");
	
	//log(session.mediaPool);
	
	var header = document.getElementById("header");
	
	var hi = header.offsetHeight ;
	//log("Header:"+hi);
	var w = window.innerWidth;
	var h = window.innerHeight - hi;
	var ww = w/16;
	var hh = h/9;
	//log("window.innerWidth"+window.innerWidth+"  "+"window.innerHeight"+window.innerHeight);
	
	var mediaPool = [];
	
	if (session.videoElement){
		if (session.videoElement.style.display!="none"){
				mediaPool.push(session.videoElement);
		}
	}
	
	for (i in session.rpcs){
		if (session.rpcs[i].videoElement){
			if (session.rpcs[i].videoElement.style.display!="none"){
				session.requestRateLimit(-1,i); // unlock bitrate
				mediaPool.push(session.rpcs[i].videoElement);
			} else {
				session.requestRateLimit(300,i);
			}
		}
	};
	
	
	if (mediaPool.length>1){
		var mod = Math.pow((ww*hh)/(mediaPool.length),0.5)  // 80
		var rw = Math.ceil(ww/mod);  // 80/80
		var rh = Math.ceil(hh/mod);
	} else { rw=1; rh=1;}
	
	//log(mod+","+rw+","+rh);  //80,1,1
	playarea.innerHTML = "";
	var i=0;
	var offset = 0;
	
	//var xhh = h/rh*9/16;
	
	mediaPool.forEach(vid=>{
	
		vid.style.position = "absolute";
		vid.display = "block";
		
		offsetx=0;
		if (Math.ceil((i+0.1)/rw)==rh){
			offsetx = (window.innerWidth- (rw - mediaPool.length%rh)*Math.ceil(window.innerWidth/rw))/2; 
		}// else {
			//console.error((i+0.1)/rw,rh);
		//}
		
		offsety = (h- Math.ceil(mediaPool.length/rw)*Math.ceil(h/rh))/2;
		
		vid.style.left = offsetx+Math.floor(((i%rw)+0)*w/rw)+"px"; 
		//vid.style.left = Math.floor(((i%rw)+0)*w/rw)+"px"; 
		
		vid.style.top  = offsety+Math.floor((Math.floor(i/rw)+0)*h/rh + hi)+"px";
												
		vid.style.width = Math.ceil(w/rw)+"px"; 
		vid.style.height = Math.ceil(h/rh)+"px"; 
		playarea.appendChild(vid);
		vid.play();
		i+=1;
	});
}

document.addEventListener("dragstart", e => {
	var url = e.target.href || e.target.data;
	if (!url || !url.startsWith('http')) return;
	
	var streamId = url.split('streamid=');
	var label = url.split('label=');
	
	
	url += '&layer-name=OBS.Ninja';
	if (streamId.length>1) url += ': ' + streamId[1].split('&')[0];
	
	if (label.length>1) url += ' - ' + decodeURI(label[1].split('&')[0]);
	
	try{
		var video = document.getElementById('videosource');
		url += '&layer-width=' + video.videoWidth; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
		url += '&layer-height=' + video.videoHeight;
	} catch(e){
		url += '&layer-width=1280'; // this isn't always 100% correct, as the resolution can fluxuate, but it is probably good enough
		url += '&layer-height=720';
	}
	e.dataTransfer.setData("text/uri-list", encodeURI(url));
});

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
	}
})();
