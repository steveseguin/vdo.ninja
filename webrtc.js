var Ooblex = {}; // Based the WebRTC and Signaling code off some of my open-source project, ooblex.com, hence the name.i
function log(msg){
	console.log(msg);
}
function errorlog(msg){
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
	errorlog(errorMsg);
	errorlog("Unhandeled Error occured"); //or any message
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

	session.configuration = {iceServers: [{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19305" ]}, {urls:["stun:turnserver.appearin.net:443"]}]};
//	var turn = {};
//	turn.username = "steve";
//	turn.credential = "justtesting";
//	turn.urls = ["turn:turn.obs.ninja:443"];
//	session.configuration.iceServers.push(turn);
	log(session.configuration);

	session.streamID = null; // This computer has its own streamID; this implies it can only publish 1 stream per session.
	session.pcs = {};
	session.rpcs = {};

	session.streamSrc = null; // location of this computer's stream, if there is one
	session.msg = null;
	session.keys = {}; // security signing stuff 
	session.mykey = {};
	session.counter=0; // this keeps track of messages sent. Lets the listener know if he missed any signed messages. security aspect.
	session.enc = new TextEncoder("utf-8");
	session.volume = 0; // state of volume.
	session.stereo = false; // both peers need to have this enabled for it to work.
	session.bitrate = false; // 20000;
	session.screenshare = false;
	session.director = false;
	session.scene = false;
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
			session.mykey = key;

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

	session.importCrypto = function(n,streamID){
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
			session.keys[streamID] = {};
			session.keys[streamID].publicKey = publicKey;
			session.keys[streamID].privateKey = null;
		}).catch(function(err){
			errorlog(err);
		});

	}
	function extractSdp(sdpLine, pattern) {
		var result = sdpLine.match(pattern);
		return (result && result.length == 2)? result[1]: null;
	}
	function unlockBitrate(sdp, kbps=10000, screenshare=false){
		kbps = parseInt(kbps);
		if (kbps<300){kbps=300;}
		var startkbps = parseInt(kbps/2.0);

		var bandwidth = {
			screen: 300, // 300kbits minimum
			audio: 50, // 50kbits  minimum
			video: kbps // 256kbits (both min-max)
		};
		// https://cdn.webrtc-experiment.com/CodecsHandler.js	
		//sdp = CodecsHandler.preferCodec(sdp, 'h264');
		sdp = CodecsHandler.setApplicationSpecificBandwidth(sdp, bandwidth, screenshare);
		sdp = CodecsHandler.setVideoBitrates(sdp, {
			min: bandwidth.video,
			max: bandwidth.video
		});
		//sdp = BandwidthHandler.setOpusAttributes(sdp);
		return sdp;
	}

	session.signData = function(data,callback){ // data as string
		if (session.mykey === {}){
			log("Generate Some Crypto keys first");
		}
		window.crypto.subtle.sign(
			{
				name: "RSASSA-PKCS1-v1_5",
			},
			session.mykey.privateKey, //from generateKey or importKey above
			session.enc.encode(data) //ArrayBuffer of data you want to sign
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

	session.verifyData = function(data,streamID){
		data.signature = new Uint8Array(data.signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
		if (session.keys[streamID].publicKey){
			return window.crypto.subtle.verify({
				name: "RSASSA-PKCS1-v1_5",
			},
				session.keys[streamID].publicKey, //from generateKey or importKey above
				data.signature, //ArrayBuffer of the signature
				session.enc.encode(data.data) //ArrayBuffer of the data
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
		//session.streamID = streamID; //  we won't remember what we asked for, but this keeps it simple 
		var data = {};
		data.request = "play";
		data.streamID = streamID;
		session.sendMsg(data);
	}

	session.debug = function(){
		var data = {};
		data.request = "debug123";
		session.sendMsg(data);
	}

	session.joinRoom = function(roomid,maxbitrate){
		var data = {};
		data.request = "joinroom";
		data.roomid = roomid
		session.sendMsg(data);
		if (session.bitrate==false){
			session.bitrate = maxbitrate; // allow users to override, but otherwise limit it
		}
		session.listPromise = defer();
		return session.listPromise;
	}

	session.retryTimer = null; 
	session.ws=null;

	session.connect = function(){
		if (session.ws != null){return;}
		session.ws = new WebSocket("wss://api.obs.ninja:7443");

		session.sendMsg = function(msg){
			log("sending message");
			if (session.ws.readyState !== 1){session.msg = msg;} // store the last message to be sent if websocket is not ready. 
			else {session.ws.send(JSON.stringify(msg));}
		}

		session.ws.onopen = function(){
			if (session.retryTimer!=null){
				clearInterval(session.retryTimer);
				session.retryTimer=null;
			}
			log("connected to video server");
			if (session.msg!==null){  // send the last store message that was in queue to be sent when ws was closed.  sending 1 message is better than none, and I don't want to spam the server with hundreds. so this is a balance.
				session.ws.send(JSON.stringify(session.msg));
				session.msg = null;
			}
		}

		session.ws.onmessage = function (evt) {
			var msg = JSON.parse(evt.data);
			if (msg.request){ // ACTIONS THAT ARE OUTSIDE THE SCOPE OF BASIC WEBRTC
				if (msg.request=="offerSDP"){  // newly connected client is asking for your SDP offer
					session.offerSDP(session.streamSrc, msg.UUID);
				} else if (msg.request=="listing"){ // Get a list of streams you have access to
					log(msg.list);
					session.listPromise.resolve(msg.list);
				} else if (msg.request=="graph"){  // for debugging and for more advanced projects
					log(msg.graph);
					session.graphPromise.resolve(msg.graph);
				} else if (msg.request=="genkey"){ // prevents spoofing ; more for future work 
					session.generateCrypto();
				} else if (msg.request=="publickey"){ // prevents spoofing
					session.importCrypto(msg.key, msg.streamID);
				} else if (msg.request=="sendroom"){ // send a message to those in the group via server. p2p is probably the preferred method, but not always possible
					log("Inbound User-based Message from Room");
					if ("director" in msg){
						if (msg['director'] === session.scene){
							if ("action" in msg){
								if (msg['action'] == "mute"){
									if ("target" in msg){
										for (i in session.rpcs){ // If you are VIEWING this use
											if (i === msg["target"]){
												alert("MUTE");
												
											}
										}
									}

								}
							}
						}
					}

					log(msg);
				} else if (msg.request=="someonejoined"){ // someone joined the room.  they may not have a video submitted: like the director.
					log("Someone Joined the Room");
					log(msg);
				} else if (msg.request=="videoaddedtoroom"){ // a video was added to the room
					log("Someone published a video to the Room");
					log(msg);
					session.watchStream(msg.streamID);
				} else {
					log(msg);
				}


			} else if (msg.description){  // we don't get the STREAM ID back with this. That could be good from a privacy point of view -- no one in the group call will have Stream ID access for publishing?
				// For the sake of ease, I may just return the StreamID and revisit
				//log(msg.description);
				// var ttt=true;
				//if (msg.UUID in session.pcs)(ttt=false);
				if (msg.description.type=="offer"){
					session.setupIncoming(msg); // could end up setting up the peer the wrong way.
					session.connectPeer(msg);
				} else {
					session.pcs[msg.UUID].setRemoteDescription(msg.description).then(function(){log("PCS SET SDP");}).catch(onError);

				}
			} else if (msg.candidate){
				if ((msg.UUID in session.pcs) && (msg.type=="remote")){
					log("PCS WINS ICE");
					session.pcs[msg.UUID].addIceCandidate(msg.candidate).then(function(){log("added ICE from viewer");}).catch(function(e){
						//console.error("ICE ERROR");
						errorlog(e);
						errorlog(msg);
					}); // NOT SURE ABOUT THIS
				} else if ((msg.UUID in session.rpcs ) && (msg.type=="local")) {
					log("RPCS WINS ICE");
					session.rpcs[msg.UUID].addIceCandidate(msg.candidate).then(function(){log("added ICE from publisher");}).catch(function(e){
						//console.error("ICE ERROR");
						errorlog(e);
						errorlog(msg);
					}); // NOT SURE ABOUT THIS
				} else {
					errorlog("ICE DID NOT FIND A PC OPTION?");
				}
			} else if (msg.request == "cleanup"){  // If someone disconnects from Websockets, and doesn't reconnect, THEN we can discard their key or something?
				log("Clean up");
				if (msg.UUID in session.pcs){
					log("problem");
					session.pcs[msg.UUID].close();
					delete(session.pcs[msg.UUID]);
					// I'll have to figure out where to reconnect somewhere else
				}
				if (msg.UUID in session.rpcs){
					log("problem");
					session.rpcs[msg.UUID].close();
					delete(session.rpcs[msg.UUID]);
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

			var container = document.createElement("div");
			container.id = "container";
			container.className = "vidcon";
			document.getElementById("gridlayout").appendChild(container);
			container.appendChild(v);

			v.autoplay = true;
			v.controls = true;
			v.muted = true;
			v.setAttribute("playsinline","");
			v.id = "videosource"; // could be set to UUID in the future
			v.className = "tile";
			v.srcObject = session.streamSrc;
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

	session.publishStream = function(stream, title="Stream Sharing Session"){ // webcam stream is used to generated an SDP
		log("STREAM SETUP");

		stream.oninactive = function() {
			errorlog('Stream inactive');
		}
		if (stream.getVideoTracks().length==0){
			errorlog("NO VIDEO TRACK INCLUDED");
		};

		if (stream.getAudioTracks().length==0){
			errorlog("NO AUDIO TRACK INCLUDED");
		};

		session.streamSrc=stream;
		var v = document.createElement("video");

		var container = document.createElement("div");
		container.id = "container";
		container.className = "vidcon";
		document.getElementById("gridlayout").appendChild(container);
		container.appendChild(v);

		v.autoplay = true;
		v.controls = true;
		v.muted = true;
		v.setAttribute("playsinline","");
		v.id = "videosource"; // could be set to UUID in the future
		v.className = "tile";
		v.srcObject = session.streamSrc;
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
	};

	session.publishScreen = function(constraints, title="Screen Sharing Session"){ // webcam stream is used to generated an SDP
		log("SCREEN SHARE SETUP");
		if (!navigator.mediaDevices.getDisplayMedia){
			alert("Sorry, your browser is not supported. Please use the desktop versions of Firefox or Chrome instead");
			return
		}
		session.screenshare = true;
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
				var container = document.createElement("div");
				container.id = "container";
				container.className = "vidcon";
				document.getElementById("gridlayout").appendChild(container);
				container.appendChild(v);

				v.autoplay = true;
				v.controls = true;
				v.setAttribute("playsinline","");
				v.muted = true;
				v.id = "videosource"; // could be set to UUID in the futur
				v.className = "tile";
				if (!v.srcObject || v.srcObject.id !== stream.id) {
					v.srcObject = stream;
				}
				var m = document.getElementById("mainmenu");
				m.remove();

				//	stream.getTracks().forEach(track => track.play());

				var data = {};
				data.request = "seed";
				document.getElementById("reshare").innerHTML = "https://"+location.hostname+location.pathname+"?streamid="+session.streamID;
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

		var container = document.createElement("div");
		container.id = "container";
		container.className = "vidcon";
		var v = document.createElement("video");
		document.getElementById("gridlayout").appendChild(container);
		container.appendChild(v);
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

	session.sendMessage = function(msg, UUID=null){ // I MIGHT NEED TO LOOK CLOSER AT THIS. ITS ONE DIRECTIONAL CURRENTLY
		msg['timestamp'] = Date.now().toString();
		msg['counter'] = session.counter;

		session.signData(msg,function(data,signature){
			session.counter += 1;

			if (UUID == null){ // send to all RTC peers i'm publishing to
				for (i in session.pcs){
					try{
						session.pcs[i].sendChannel.send(JSON.stringify({data,signature}));
					} catch(e){
						log("RTC Connection seems to be dead? is it? If it is, or can't be validated, close this shit");
						//session.pcs[i].close();
						//delete(session.pcs[i]);
					}
				}
			} else {
				try{
					session.pcs[UUID].sendChannel.send(JSON.stringify({data,signature}));
				} catch(e){
					log("RTC Connection seems to be dead? is it? If it is, or can't be validated, close this shit");
					//session.pcs[UUID].close();
					//delete(session.pcs[UUID]);
				}	
			}
		});
	};

	session.offerSDP = function(stream,UUID){  // publisher/offerer (PCS)
		if (UUID in session.pcs){errorlog("PROBLEM! RESENDING SDP OFFER SHOULD NOT HAPPEN");}
		else {log("Create a new RTC connection; offering SDP on request");}

		session.pcs[UUID] = new RTCPeerConnection(session.configuration);
		session.pcs[UUID]['UUID'] = UUID;
		session.pcs[UUID].sendChannel = session.pcs[UUID].createDataChannel("sendChannel");

		session.pcs[UUID].sendChannel.onopen = () => {
			var msg = {};
			msg["volume"] = session.volume;
			session.sendMessage(msg, UUID); //TODO: does this work? UUID being passed like this?
		};

                session.pcs[UUID].sendChannel.onclose = () => {
			log("send channel closed");
                };

		log("pubs streams to offeR",stream.getTracks());	
		stream.getTracks().forEach(track => session.pcs[UUID].addTrack(track, stream));
		session.pcs[UUID].ontrack = event => {errorlog("Publisher is being sent a video stream??? NOT EXPECTED!")};

		session.pcs[UUID].onicecandidate = function(event){
			log("CREATE ICE");
			if (event.candidate==null){return;}

			var data = {};
			data.UUID = this.UUID;
			data.type = "local";
			data.candidate = event.candidate;
			session.sendMsg(data);
		};

		session.pcs[UUID].oniceconnectionstatechange = function(){
			try {
				if (this.iceConnectionState == 'closed') {
					log('ICE closed?');
                                } else	if (this.iceConnectionState == 'disconnected') {
					log('ICE Disconnected; wait for retry? pcs');
					session.pcs[UUID].close();
					session.pcs[UUID] = null;
					delete(session.pcs[UUID]);
				} else if (this.iceConnectionState == 'failed') {
					log('ICE FAILed. bad?');
				} else {
					log(this.iceConnectionState);
				}
			} catch(e){
				errorlog(e);
			}
		}

		//session.pcs[UUID].onnegotiationneeded = function(){ // bug: https://groups.google.com/forum/#!topic/discuss-webrtc/3-TmyjQ2SeE
		session.pcs[UUID].createOffer().then((description)=>{
			if (session.stereo){
				//description.sdp = CodecsHandler.forceStereoAudio(description.sdp);
				description.sdp = CodecsHandler.setOpusAttributes(description.sdp, {
					'stereo': 1,
					//'sprop-stereo': 1,
					'maxaveragebitrate': 128 * 1000 * 8,
					'maxplaybackrate': 128 * 1000 * 8,
					//'cbr': 1,
					//'useinbandfec': 1,
					// 'usedtx': 1,
					'maxptime': 3
				});
				log("stereo enabled");
			}

			if (session.bitrate){
				log("bit rate being munged");
				description.sdp = unlockBitrate(description.sdp, session.bitrate, session.screenshare);
			}

			session.pcs[UUID].setLocalDescription(description).then(function(){
				log("publishing SDP Offer");
				var data = {};
				data.description = session.pcs[UUID].localDescription;
				data.UUID = UUID;
				data.streamID = session.streamID;
				session.ws.send(JSON.stringify(data));
			}).catch(onError);
		}).catch(onError);
		//};

		//session.pcs[UUID].sendChannel = session.pcs[UUID].createDataChannel("sendChannel");
		session.pcs[UUID].onclose = function(){
			log("WebRTC Connection Closed. Clean up. 657");
			session.pcs[UUID].
			session.pcs[UUID] = null;
			delete(session.pcs[UUID]);
		};
		session.pcs[UUID].onopen = function(){
			log("WEBRTC CONNECTION OPEN");

		};

	};


	session.connectPeer = function(msg){ // someone is SENDING us a video stream
		session.rpcs[msg.UUID].setRemoteDescription(msg.description).then(function(){  // description, onSuccess, onError
			if (session.rpcs[msg.UUID].remoteDescription.type === 'offer'){ // When receiving an offer/video lets answer it
				session.rpcs[msg.UUID].createAnswer().then(function(description){  // creating answer
					if (session.stereo){
					description.sdp = CodecsHandler.setOpusAttributes(description.sdp, {
						'stereo': 1,
						'sprop-stereo': 1,
						'maxaveragebitrate': 128 * 1000 * 2,
						'maxplaybackrate': 128 * 1000 * 2,
						//'cbr': 1,
						//'useinbandfec': 1,
						// 'usedtx': 1,
						'maxptime': 3
					});

					}
					if (session.bitrate){
						log("bit rate being munged");
						description.sdp = unlockBitrate(description.sdp, session.bitrate);
					}
					return session.rpcs[msg.UUID].setLocalDescription(description);
				}).then(function(){
					log("providing answer");
					var data = {};
					data.UUID = msg.UUID;
					data.description = session.rpcs[msg.UUID].localDescription; // send our updated self identify
					session.sendMsg(data);

					var data = {};
					data.request = "getkey"
					// data.UUID = msg.UUID;   -- they other party does not need this
					data.streamID = session.rpcs[msg.UUID]['streamID'];
					session.sendMsg(data);

				}).catch(onError);
			} else if (session.rpcs[msg.UUID].remoteDescription.type === 'answer'){  // someone responded to one of our answers; they presumably requested an offerSDP
			}
		}).catch(onError);
	}
	/// THE PROBLEM IS I HAVE A PATH WAY FOR INPUT AND A PATHWAY FOR OUTPUT, BU THEY SHARE THE SAME PATHWAY. LOL.  I NEED TO COMBINE THESE INTO ONE.
	session.setupIncoming = function(msg){ // ingesting stream as a viewer
		var UUID = msg.UUID;
		if (UUID in session.rpcs){log("RTC connection is ALREADY ready; we can already accept answers");return;} // already exists
		else {log("MAKING A NEW RTC CONNECTION");}
		session.rpcs[UUID] = new RTCPeerConnection(session.configuration);
		session.rpcs[UUID]["UUID"] = UUID;
		if ("streamID" in msg){
			session.rpcs[msg.UUID]['streamID'] = msg["streamID"];
		}
		//session.rpcs[UUID].addTransceiver('video', { direction: 'recvonly'});
		session.rpcs[UUID].onclose = function(event){
			log("rpc closed");
			try {
				var streamID = this.streamID; // reconnect if possible
				var data = {};
				data.request = "play";
				data.streamID = streamID;
				session.sendMsg(data);
			} catch(e){
				errorlog("Couldn't re-connect"); // Might be fone forever. :(  Set a timeout? TODO
				errorlog(e);
			}

			try {	if (document.getElementById("container_"+this.UUID)){
					document.getElementById("container_"+this.UUID).parentNode.removeChild(document.getElementById("container_"+this.UUID));
				}
			} catch (e){errorlog(e);}
			try {	if (this.streamSrc){
         	                        this.streamSrc.getTracks().forEach(function(track) {
	                                       track.stop();
                                	});
				}
                        } catch (e){errorlog(e);}
			try {
				this.receiveChannel.close();
			}catch (e){errorlog(e);}	
			
			try {
				session.rpcs[this.UUID] = null
				delete(session.rpcs[this.UUID]);
			} catch (e){errorlog(e);}

		}

		session.rpcs[UUID].onicecandidate = function(event){
			log("CREATE ICE");
			if (event.candidate==null){log("null ice");return;}
			var data = {};
			data.UUID = this.UUID;
			data.type = "remote";
			data.candidate = event.candidate;
			session.sendMsg(data);
		};

		session.rpcs[UUID].oniceconnectionstatechange = function() {
			try{

				if (this.iceConnectionState == 'closed') {
					errorlog('CLOSED');
				} else  if (this.iceConnectionState == 'disconnected') {
					errorlog('ICE Disconnected; wait for retry? rpcs');
					log(this.streamID);
					var sid = this.streamID;
					try {
						setTimeout(()=>{log("TRYING TO RECONNECT");session.watchStream(sid);},3000);
					} catch (e){
						errorlog(e);
					}
					if (this.streamSrc){
                	                        this.streamSrc.getTracks().forEach(function(track) {
        	                                       track.stop();
							log("Track stopped");
	                                        });
                        	        }


					try {
						if (document.getElementById("container_"+this.UUID)){
							document.getElementById("container_"+this.UUID).parentNode.removeChild(document.getElementById("container_"+this.UUID));
						}
					} catch (e){errorlog(e);}
						session.rpcs[this.UUID].close();
						session.rpcs[this.UUID] = null
						delete(session.rpcs[this.UUID]);

			} else if (this.iceConnectionState == 'failed') {
				errorlog("ICE FAILED");
			} else {
				log("ICE: "+this.iceConnectionState);
			}

		} catch (E){}
	}

	session.rpcs[UUID].ondatachannel = (event)=>{ // recieve data from peer; event data maybe


		this.receiveChannel = event.channel;
		this.receiveChannel.onmessage = (e)=>{
			log("recieved data: "+e.data);
			var msg = JSON.parse(e.data)
			log(msg);
			//if (session.verifyData(msg,session.rpcs[UUID]['streamID'])){  // I'm just going to disable security for now.
			if ("data" in msg){
				if ("volume" in msg.data){
					log("Changing volume");
					log(parseInt(msg.data["volume"])/100.0);
					var volume = parseInt(msg.data["volume"])/100.0;
					if (volume>0){
						document.getElementById("videosource_"+UUID).muted=false; // TODO: THIS SHOULDn't be UUID? or should it be STREAMID? *fak*
						document.getElementById("videosource_"+UUID).volume = parseInt(msg.data["volume"])/100.0;
					} else {
						document.getElementById("videosource_"+UUID).muted=true;
					}
				}}
			//}

		};
		this.receiveChannel.onopen = function(){log("data channel opened")};

		this.receiveChannel.onclose = () => {
			log("rpc datachannel closed");
			//this.receiveChannel.close();
			//session.rpcs[UUID].close();
		};
	};

	session.rpcs[UUID].ontrack = event => {

		log("streams:",event.streams);
		log(event.streams[0].getVideoTracks());
		log(event.streams[0].getAudioTracks());
		const stream = event.streams[0];
		session.rpcs[UUID].streamSrc = stream;

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
				if (document.getElementById("mainmenu")){
					var m = document.getElementById("mainmenu");
					m.remove();
				}
			} catch(e){errorlog(e);}

			if (session.director){
				var controls = document.getElementById("controls_blank").cloneNode(true);
				controls.id = "controls_"+UUID;
				controls.dataset.UUID = UUID;
				controls.style.display = "block";
				container.appendChild(controls);
			}

			//stream.getTracks().forEach(track => {
			//	log("Remote track", track)
			//});

			//	v.onloadedmetadata = (e) => {
			//		log("Remote video play");
			//		v.play().then(() => { log("Remote video playing") }).catch((e) => { log(e) });
			//	}

			// Time to become a seeder now that it's all working // Let's disable this for now. This is for my other project anyways.
			var data = {};  
			data.request = "seed";
			//data.streamID = session.streamID; // Let's switch this to UUID. Protects publisher's STREAM ID and the server can sort it out anyways.
			//data.streamID = session.rpcs[UUID].streamID;
			//session.sendMsg(data);
			//log("OPEN TO RE-SEEDING UUID: "+this.UUID);
		}
	}
	log("setup peer complete");
};


return session;
})();
