var Ooblex = {}; // Based the WebRTC and Signaling code off some of my open-source project, ooblex.com, hence the name.i
function log(msg){
	console.re.log(msg);
	console.log(msg);
}
function errorlog(msg){
	console.re.error(msg);
	console.error(msg);
}
function isAlphaNumeric(str) {
	var code, i, len;

	for (i = 0, len = str.length; i < len; i++) {
		code = str.charCodeAt(i);
		if (!(code > 47 && code < 58) && // numeric (0-9)
			!(code > 64 && code < 91) && // upper alpha (A-Z)
			!(code > 96 && code < 123)) { // lower alpha (a-z)
			return false;
		}
	}
	return true;
}
window.onerror = function backupErr(errorMsg, url, lineNumber) {
	console.re.error("Unhandeled Error occured: " + errorMsg);//or any message
	return false;
}
Ooblex.Media = new (function(){
	var session = {};

	function onSuccess(){};
	function onError(err){errorlog(err);};
	function defer(){
		var res, rej;
		var promise = new Promise((resolve, reject) => {
			res = resolve;
			rej = reject;
		});
		promise.resolve = res;
		promise.reject = rej;
		return promise;
	}
	var configuration = {
		iceServers: [{urls:["stun:turnserver.appearin.net:443"]},{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19305" ] }] // probably shouldn't be using appearin anymore, but google may be blocked in some coutnries
	};

	session.streamID = null;
	session.pcs = {};
	session.streamSrc = null;
	session.msg = null;
	session.keys = {};
	session.counter=0;
	session.keys.enc = new TextEncoder("utf-8");
	session.volume = 0;

	session.generateStreamID = function(){
		var text = "";
		var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz023456789";
		for (var i = 0; i < 7; i++){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		log(text);
		return text;
	};

	session.changeStreamID = function(permaid){
		permaid = permaid.replace(/[^0-9a-zA-Z]/gi, '');
		if (permaid.length < 1){
			alert("permaid URL parameter should be at least 7 alphanumeric characters long");			          
		} else if  (permaid.length > 25){
			alert("permaid URL parameter should be less than 21 alphanumeric characters long");
		} else {
			session.streamID = permaid;
		}
	}

	session.generateCrypto = function(){
		window.crypto.subtle.generateKey({
			name: "RSASSA-PKCS1-v1_5",
			modulusLength: 512, //can be 1024, 2048, or 4096 -- also apparently 512!
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
		},
			true, //whether the key is extractable (i.e. can be used in exportKey)
			["sign", "verify"] //can be any combination of "sign" and "verify"
		).then(function(key){
			log(key.publicKey);
			log(key.privateKey);
			key.enc = new TextEncoder("utf-8"); // needed for string to array buffer encoding
			session.keys = key;

			window.crypto.subtle.exportKey(
				"jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
				key.publicKey //can be a publicKey or privateKey, as long as extractable was true
			).then(function(keydata){
				//returns the exported key data
				log(keydata);
				var data = {};
				data.request = "storekey";
				data.key = keydata.n;
				session.sendMsg(data);
				//log(JSON.stringify(data));
				//session.signData("asdfasdfasdf");
			}).catch(function(err){
				errorlog(err);
			});
		})
			.catch(function(err){
				errorlog(err);
			});
	}

	session.importCrypto = function(n){
		window.crypto.subtle.importKey(
			"jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
			{   //this is an example jwk key, other key types are Uint8Array objects
				kty: "RSA",
				e: "AQAB",
				n: n,
				alg: "RS1",
				ext: true,
			},
			{   //these are the algorithm options
				name: "RSASSA-PKCS1-v1_5",
				hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
			},
			true, //whether the key is extractable (i.e. can be used in exportKey)
			["verify"] //"verify" for public key import, "sign" for private key imports
		).then(function(publicKey){
			//returns a publicKey (or privateKey if you are importing a private key)
			log(publicKey);
			session.keys.publicKey = publicKey;
			session.keys.privateKey = null;
		}).catch(function(err){
			errorlog(err);
		});

	}
	function extractSdp(sdpLine, pattern) {
		var result = sdpLine.match(pattern);
		return (result && result.length == 2)? result[1]: null;
	}
	function forceStereoAudio(sdp) {
		var sdpLines = sdp.split('\r\n');
		var fmtpLineIndex = null;
		for (var i = 0; i < sdpLines.length; i++) {
			if (sdpLines[i].search('opus/48000') !== -1) {
				var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
				break;
			}
		}
		for (var i = 0; i < sdpLines.length; i++) {
			if (sdpLines[i].search('a=fmtp') !== -1) {
				var payload = extractSdp(sdpLines[i], /a=fmtp:(\d+)/);
				if (payload === opusPayload) {
					fmtpLineIndex = i;
					break;
				}
			}
		}
		if (fmtpLineIndex === null) return sdp;
		sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat('; stereo=1; sprop-stereo=1');
		sdp = sdpLines.join('\r\n');
		return sdp;
	}

	session.signData = function(data,callback){ // data as string
		if (session.keys === {}){
			log("Generate Some Crypto keys first");
		}
		window.crypto.subtle.sign(
			{
				name: "RSASSA-PKCS1-v1_5",
			},
			session.keys.privateKey, //from generateKey or importKey above
			session.keys.enc.encode(data) //ArrayBuffer of data you want to sign
		).then(function(signature){
			//returns an ArrayBuffer containing the signature
			signature = new Uint8Array(signature);
			signature = signature.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
			//signature = new Uint8Array(signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
			//log(signature);
			callback(data,signature);
			log(JSON.stringify(signature));
		}).catch(function(err){
			errorlog(err);
		});
	};

	session.verifyData = function(data){
		data.signature = new Uint8Array(data.signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
		if (session.keys.publicKey){
			return window.crypto.subtle.verify({
				name: "RSASSA-PKCS1-v1_5",
			},
				session.keys.publicKey, //from generateKey or importKey above
				data.signature, //ArrayBuffer of the signature
				session.keys.enc.encode(data.data) //ArrayBuffer of the data
			).then(function(isvalid){
				//returns a boolean on whether the signature is true or not
				log(isvalid);
				return isvalid
			}).catch(function(err){
				errorlog(err);
				return false
				//alert("Could not validate inbound connection");
			});
		}
	}

	session.changeTitle = function(title){
		var data = {};
		data.request = "changeTitle";
		data.title = title;
		session.sendMsg(data);
	}


	session.watchStream = function(streamID){
		session.streamID = streamID;
		var data = {};
		data.request = "play";
		data.streamID = session.streamID;
		session.sendMsg(data);
	}

        session.debug = function(){
                var data = {};
                data.request = "debug123";
                session.sendMsg(data);
        }

        session.joinRoom = function(roomid){
                var data = {};
                data.request = "joinroom";
                data.roomid = roomid
                session.sendMsg(data);
                session.listPromise = defer();
                return session.listPromise;
        }

	session.retryTimer = null; 
	session.ws=null;

	session.connect = function(){
		if (session.ws != null){return;}
		session.ws = new WebSocket("wss://api.obs.ninja:9443");

		session.sendMsg = function(msg){
			log("sending message");
			if (session.ws.readyState !== 1){session.msg = msg;}
			else {session.ws.send(JSON.stringify(msg));}
		}

		session.ws.onopen = function(){
			if (session.retryTimer!=null){
				clearInterval(session.retryTimer);
				session.retryTimer=null;
			}
			log("connected to video server");
			if (session.msg!==null){
				session.ws.send(JSON.stringify(session.msg));
				session.msg = null;
			}
		}

		session.ws.onmessage = function (evt) {
			var msg = JSON.parse(evt.data);
			if (msg.request){ // ACTIONS THAT ARE OUTSIDE THE SCOPE OF BASIC WEBRTC
				if (msg.request=="offerSDP"){  // newly connected client is asking for your SDP offer
					session.offerSDP(session.streamSrc, msg.UUID);
				} else if (msg.request=="listing"){
					log(msg.list);
					session.listPromise.resolve(msg.list);
				} else if (msg.request=="graph"){
					log(msg.graph);
					session.graphPromise.resolve(msg.graph);
				} else if (msg.request=="genkey"){
					session.generateCrypto();
				} else if (msg.request=="publickey"){
					session.importCrypto(msg.key);
				} else if (msg.request=="sendroom"){
					console.log("Inbound User-based Message from Room",msg);
				} else if (msg.request=="someonejoined"){
                                        console.log("Someone Joined the Room",msg);
                                } else if (msg.request=="videoaddedtoroom"){
                                        console.log("Someone published a video to the Room",msg);
                                } else {
					console.log(msg);
				}


			} else if (msg.description){
				log(msg.description);
				// var ttt=true;
				//if (msg.UUID in session.pcs)(ttt=false);
				session.setupPeer(msg.UUID); // could end up setting up the peer the wrong way.
				session.connectPeer(msg);
			} else if (msg.candidate){
				log("add ice candidate");
				session.pcs[msg.UUID].addIceCandidate(msg.candidate).then(function(){log("added ICE from viewer");}).catch(onError);
			} else if (msg.request == "cleanup"){
				log("Clean up");
				if (msg.UUID in session.pcs){
					log("problem");
					session.pcs[msg.UUID].close();
					delete(session.pcs[msg.UUID]);
					// I'll have to figure out where to reconnect somewhere else
				}
			} else { log("what is this?",msg); }
		}
		session.ws.onclose = function(){
			errorlog("Connection to Control Server lost.\n\nAuto-reconnect is not yet implemented");
		};

		//         alert("We lost our connection to the server. Refresh")};
		//           session.ws=null;
		//            setTimeout(function(){session.connect();}, 100);
		//            session.connect();
		//            
	};

	session.publishWebcam = function( constraints = {video: true,audio: true}, title="Webcam Sharing Session"){ // webcam stream is used to generated an SDP
		//  if (session.streamSrc==null){
		navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
			log("Audio tracks");
			log(stream.getAudioTracks());
			session.streamSrc=stream;
			var v = document.createElement("video");
			document.body.appendChild(v);
			v.autoplay = true;
			v.controls = true;
			v.muted = true;
			v.setAttribute("playsinline","");
			v.id = "videosource"; // could be set to UUID in the future
			v.className = "tile";
			v.srcObject = session.streamSrc;
			document.getElementById("gridlayout").appendChild(v);
			var m = document.getElementById("mainmenu");
			m.remove();
			v.play();
			var data = {};
			data.request = "seed";
			data.title = title;
			document.getElementById("reshare").innerHTML = "https://"+location.hostname+location.pathname+"?streamid="+session.streamID;
			document.getElementById("reshare").setAttribute("data-share","?streamid="+session.streamID);
			data.streamID = session.streamID;
			session.sendMsg(data);

		}).catch(function(error){
			log('getDisplayMedia error: ' + error.name, error);
			errorlog(error);
			alert("An error occured. Does your computer or mobile device have a webcam or camera installed?");
		});
	};

	session.publishStream = function(stream, title="Screen Sharing Session"){ // webcam stream is used to generated an SDP
		log("STREAM SETUP");
		stream.oninactive = function() {
			errorlog('Stream inactive');
		}
		if (stream.getAudioTracks().length==0){
			errorlog("NO AUDIO TRACK INCLUDED");
		};
		session.streamSrc=stream;
		//var m = document.getElementById("mainmenu");
		//m.remove();

		//  stream.getTracks().forEach(track => track.play());
		var data = {};
		data.request = "seed";
		//document.getElementById("reshare").innerHTML = "https://obs.ninja/?streamid="+session.streamID;
		data.streamID = session.streamID;
		data.title = title;
		session.sendMsg(data);
	};

	session.publishScreen = function(constraints, title="Screen Sharing Session"){ // webcam stream is used to generated an SDP
		log("SCREEN SHARE SETUP");
		if (!navigator.mediaDevices.getDisplayMedia){
			alert("Sorry, your browser is not supported. Please use the desktop versions of Firefox or Chrome instead");
			return
		}
		navigator.mediaDevices.getDisplayMedia(constraints)
			.then(function success(stream) {
				stream.oninactive = function() {
					log('Stream inactive');
				}
				if (stream.getAudioTracks().length==0){
					alert("NO AUDIO TRACK SELECTED; make sure to include audio as a stream or update to at least Chrome version 74");
				};
				session.streamSrc=stream;
				var v = document.createElement("video");
				v.autoplay = true;
				v.controls = true;
				v.setAttribute("playsinline","");
				v.muted = true;
				v.id = "videosource"; // could be set to UUID in the futur
				v.className = "tile";
				if (!v.srcObject || v.srcObject.id !== stream.id) {
					v.srcObject = stream;
				}
				document.getElementById("gridlayout").appendChild(v);
				var m = document.getElementById("mainmenu");
				m.remove();

				//	stream.getTracks().forEach(track => track.play());

				var data = {};
				data.request = "seed";
				document.getElementById("reshare").innerHTML = "https://obs.ninja/?streamid="+session.streamID;
				data.streamID = session.streamID;
				data.title = title;
				session.sendMsg(data);
			}).catch(function(error){
				errorlog('getDisplayMedia error: ' + error.name, error);
			});
	};

	session.publishFile = function(ele,event, title="Video File Sharing Session"){ // webcam stream is used to generated an SDP
		log("FILE SHARE SETUP");

		var file = ele.files[0];
		var type = file.type;

		var fileURL = URL.createObjectURL(file);

		var v = document.createElement("video");
		v.autoplay = false;
		v.controls = true;
		v.muted = false;
		v.loop = true;
		v.setAttribute("playsinline","");
		v.src = fileURL;

		var canPlay = v.canPlayType(type);
		if (canPlay === ''){canPlay = 'no';}
		log('Can play type "' + type + '": ' + canPlay);
		if (canPlay === 'no') {
			v.outerHTML = "";
			alert("Cannot play this file type. Please refresh and try another option ");
			return;
		}

		v.id = "videosource"; // could be set to UUID in the future
		v.className = "tile";
		document.getElementById("gridlayout").appendChild(v);
		var m = document.getElementById("mainmenu");
		m.remove();

		try{
			session.streamSrc=v.captureStream();;
		} catch(e){
			log(e);
			alert("Safari and many older browsers do not support this feature. Perhaps try using Chrome or Firefox on desktop instead. Please refresh to try another option.");
			v.outerHTML = "";
			return false;
		}


		var data = {};
		data.request = "seed";
		data.title = title;
		document.getElementById("reshare").innerHTML = "https://obs.ninja/?streamid="+session.streamID;
		data.streamID = session.streamID;
		session.sendMsg(data);
	};

	session.sendMessage = function(msg, UUID=null){
		msg['timestamp'] = Date.now().toString();
		msg['counter'] = session.counter;

		session.signData(msg,function(data,signature){
			session.counter += 1;

			if (UUID == null){
				for (i in session.pcs){
					log(i);
					try{
						session.pcs[i].sendChannel.send(JSON.stringify({data,signature}));
					} catch(e){
						log("RTC Connection seems to be dead? is it? If it is, or can't be validated, close this shit");
						session.pcs[i].close();
						delete(session.pcs[i]);
					}
				}
			} else {
				log(UUID);
				try{
					session.pcs[UUID].sendChannel.send(JSON.stringify({data,signature}));
				} catch(e){
					log("RTC Connection seems to be dead? is it? If it is, or can't be validated, close this shit");
					session.pcs[UUID].close();
					delete(session.pcs[UUID]);
				}	
			}
		})
	};

	session.offerSDP = function(stream,UUID){  // publisher/offerer
		if (UUID in session.pcs){alert("PROBLEM! RESENDING SDP OFFER SHOULD NOT HAPPEN");}
		else {log("Create a new RTC connection; offering SDP on request");}

		session.pcs[UUID] = new RTCPeerConnection(configuration);

		session.pcs[UUID].sendChannel = session.pcs[UUID].createDataChannel("sendChannel");

		session.pcs[UUID].sendChannel.onopen = function(){
			var msg = {};
			msg["volume"] = session.volume;
			session.sendMessage(msg, UUID);
		}

		log("pubs streams to offeR",stream.getTracks());	
		stream.getTracks().forEach(track => session.pcs[UUID].addTrack(track, stream));
		session.pcs[UUID].ontrack = event => {alert("Publisher is being sent a video stream??? NOT EXPECTED!")};

		session.pcs[UUID].onicecandidate = function(event){
			log("CREATE ICE");
			if (event.candidate==null){return;}
			var data = {};
			data.UUID = UUID;
			data.candidate = event.candidate;
			session.sendMsg(data);
		};

		session.pcs[UUID].oniceconnectionstatechange = function() {
			try{
				if (session.pcs[UUID].iceConnectionState == 'disconnected') {
					log(UUID,'Disconnected');
					session.pcs[UUID].close()
					delete(session.pcs[UUID]);
				} else if (session.pcs[UUID].iceConnectionState == 'failed') {
					alert('Could not make WebRTC connection');
					session.pcs[UUID].close()
					delete(session.pcs[UUID]);
				}
			}
			catch(e){}
		}

		//session.pcs[UUID].onnegotiationneeded = function(){ // bug: https://groups.google.com/forum/#!topic/discuss-webrtc/3-TmyjQ2SeE
		session.pcs[UUID].createOffer().then(function(description){

			// disabled as its more prone to cause problems than not.
			//description.sdp = forceStereoAudio(description.sdp);
			//log(description.sdp);

			session.pcs[UUID].setLocalDescription(description).then(function(){
				log("publishing SDP Offer");
				var data = {};
				data.description = session.pcs[UUID].localDescription;
				log(data.description.sdp);
				data.UUID = UUID;
				session.ws.send(JSON.stringify(data));
			}).catch(onError);
		}).catch(onError);
		//};

		//session.pcs[UUID].sendChannel = session.pcs[UUID].createDataChannel("sendChannel");
		session.pcs[UUID].onclose = function(){
			log("WebRTC Connection Closed",UUID);
			delete(session.pcs[UUID]);
		};
		session.pcs[UUID].onopen = function(){
			log("WEBRTC CONNECTION OPEN",UUID);

		};

	};

	session.connectPeer = function(msg){
		session.pcs[msg.UUID].setRemoteDescription(msg.description).then(function(){  // description, onSuccess, onError
			if (session.pcs[msg.UUID].remoteDescription.type === 'offer'){ // When receiving an offer/video lets answer it
				session.pcs[msg.UUID].createAnswer().then(function(description){  // creating answer

					description.sdp = forceStereoAudio(description.sdp);
					log(description.sdp);

					return session.pcs[msg.UUID].setLocalDescription(description);
				}).then(function(){
					log("providing answer");
					var data = {};
					data.UUID = msg.UUID;
					data.description = session.pcs[msg.UUID].localDescription; // send our updated self identify
					log(data.description.sdp);
					session.sendMsg(data);

					var data = {};
					data.request = "getkey"
					session.sendMsg(data);

				}).catch(onError);
			} else if (session.pcs[msg.UUID].remoteDescription.type === 'answer'){  // someone responded to one of our answers; they presumably requested an offerSDP
			}
		}).catch(onError);
	}

	session.setupPeer = function(UUID){ // ingesting stream as a viewer
		if (UUID in session.pcs){log("RTC connection is ALREADY ready; we can already accept answers");return;} // already exists
		else {log("MAKING A NEW RTC CONNECTION");}
		session.pcs[UUID] = new RTCPeerConnection(configuration);
		//session.pcs[UUID].addTransceiver('video', { direction: 'recvonly'});
		session.pcs[UUID].onclose = function(event){
			log("rpc closed");
			delete(session.pcs[UUID]);
			var data = {};
			data.request = "play";
			data.streamID = session.streamID;
			session.sendMsg(data);
			session.streamSrc==null;
		}

		session.pcs[UUID].onicecandidate = function(event){
			log("CREATE ICE");
			if (event.candidate==null){log("null ice");return;}
			var data = {};
			data.UUID = UUID;
			data.candidate = event.candidate;
			session.sendMsg(data);
			log(data);
		};

		session.pcs[UUID].oniceconnectionstatechange = function() {
			try{
				if (session.pcs[UUID].iceConnectionState == 'disconnected') {
					log(UUID,'Disconnected');
					session.pcs[UUID].close()
					delete(session.pcs[UUID]);
				}} catch (E){}
		}
		session.pcs[UUID].ondatachannel = function(event){ // recieve data from peer; event data maybe


			session.pcs[UUID].receiveChannel = event.channel;
			session.pcs[UUID].receiveChannel.onmessage = function(e){
				log("recieved data: "+e.data);
				var msg = JSON.parse(e.data)
				log(msg);
				if (session.verifyData(msg)){
					if ("data" in msg){
						if ("volume" in msg.data){
							log("Changing volume");
							log(parseInt(msg.data["volume"])/100.0);
							var volume = parseInt(msg.data["volume"])/100.0;
							if (volume>0){
								document.getElementById("videosource_"+UUID).muted=false;
								document.getElementById("videosource_"+UUID).volume = parseInt(msg.data["volume"])/100.0;
							} else {
								document.getElementById("videosource_"+UUID).muted=true;
							}
						}}
				}

			};
			session.pcs[UUID].receiveChannel.onopen = function(){log("data channel opened")};
			session.pcs[UUID].receiveChannel.onclose = function(){
				log("datachannel closed");
				try {
					session.pcs[UUID].close();
				} catch (e){
					errorlog(e);
				}

				//delete session.pcs[UUID];
				try {
					//delete session.pcs[UUID];
					delete(session.pcs[UUID]);
				} catch (e){
					errorlog(e);
				}
				setTimeout(function(){session.watchStream(session.streamID);},3000);

			};
		};

		session.pcs[UUID].ontrack = event => {

			log("streams:",event.streams);
			log(event.streams[0].getVideoTracks());
			log(event.streams[0].getAudioTracks());
			const stream = event.streams[0];
			session.streamSrc = stream;

			//document.getElementById("reshare").innerHTML = "https://obs.ninja/?streamid="+session.streamID;
			if (document.getElementById("videosource_"+UUID)){
				log("new track added to mediastream");
				var v = document.getElementById("videosource_"+UUID);
				v.autoplay = true;
				v.controls = true;
				v.muted = false;
				v.volume = 0;
				v.setAttribute("playsinline","");
				v.srcObject = stream;
				v.className = "tile";

			} else {
				log("video element is being created and media track added");

				var container = document.createElement("div");	
				container.id = "container_"+UUID;
				container.className = "vidcon";
				var v = document.createElement("video");
				document.getElementById("gridlayout").appendChild(container);
				container.appendChild(v);
				v.muted = false;
				v.volume = 0;
				v.autoplay = true;
				v.controls = true;
				v.id = "videosource_"+UUID; // could be set to UUID in the future
				v.className += "tile";
				v.setAttribute("playsinline",""); 
				if (!v.srcObject || v.srcObject.id !== stream.id) {
					v.srcObject = stream;
				}
				try {
					var m = document.getElementById("mainmenu");
					m.remove();} catch(e){
					}

				//stream.getTracks().forEach(track => {
				//	log("Remote track", track)
				//});

				//	v.onloadedmetadata = (e) => {
				//		log("Remote video play");
				//		v.play().then(() => { log("Remote video playing") }).catch((e) => { log(e) });
				//	}

				// Time to become a seeder now that it's all working
				var data = {};
				data.request = "seed";
				data.streamID = session.streamID;
				session.sendMsg(data);
				log("OPEN TO SEEDING NOW: "+session.streamID);
			}
		}
		log("setup peer complete");
	};


	return session;
})();
