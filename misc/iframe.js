var Ooblex = {}; // Based the WebRTC and Signaling code off some of my open-source project, ooblex.com, hence the name.
Ooblex.Media = new (function(){
	var session = {};

    session.viewonly = false;;

	function onSuccess(){};
	function onError(err){alert(err);};
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
[{urls:["stun:turnserver.appearin.net:443"]}]
	var configuration = {
		iceServers: [{urls:["stun:turnserver.appearin.net:443"]},{ urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19305" ] }]
	};

	session.generateStreamID = function(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 12; i++){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	session.connect = function(){

//        navigator.mediaDevices.getUserMedia({audio: true});
		session.streamID = session.generateStreamID();
        
		session.pcs = {};
		session.streamSrc = null;
		session.msg = null;
        session.keys = {};
        session.counter=0;
        session.keys.enc = new TextEncoder("utf-8");
		session.ws = new WebSocket("wss://api.steves.app:8443");
		session.ws.onopen = function(){
			console.log("connected to video server");
			if (session.msg!==null){
				session.ws.send(JSON.stringify(session.msg));
				session.msg = null;
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
                console.log(key.publicKey);
                console.log(key.privateKey);
                key.enc = new TextEncoder("utf-8"); // needed for string to array buffer encoding
                session.keys = key;

                window.crypto.subtle.exportKey(
                    "jwk", //can be "jwk" (public or private), "spki" (public only), or "pkcs8" (private only)
                    key.publicKey //can be a publicKey or privateKey, as long as extractable was true
                ).then(function(keydata){
                    //returns the exported key data
                    console.log(keydata);
                    var data = {};
                    data.request = "storekey";
                    data.key = keydata.n;
                    session.sendMsg(data);
                    //console.log(JSON.stringify(data));
                    //session.signData("asdfasdfasdf");
                }).catch(function(err){
                    console.error(err);
                });
            })
            .catch(function(err){
                console.error(err);
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
            console.log(publicKey);
            session.keys.publicKey = publicKey;
            session.keys.privateKey = null;
        }).catch(function(err){
            console.error(err);
        });

        }

        session.signData = function(data,callback){ // data as string
            if (session.keys === {}){
                console.log("Generate Some Crypto keys first");
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
                //console.log(signature);
                callback(data,signature);
                console.log(JSON.stringify(signature)); 
            }).catch(function(err){
                console.error(err);
            });
        };

        session.verifyData = function(data){
            data.signature = new Uint8Array(data.signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
            if (session.keys.publicKey){
                window.crypto.subtle.verify({
                        name: "RSASSA-PKCS1-v1_5",
                    },
                    session.keys.publicKey, //from generateKey or importKey above
                    data.signature, //ArrayBuffer of the signature
                    session.keys.enc.encode(data.data) //ArrayBuffer of the data
                ).then(function(isvalid){
                    //returns a boolean on whether the signature is true or not
                    console.log(isvalid);
                }).catch(function(err){
                    console.error(err);
                    alert("Could not validate inbound connection");
                });
            }
        }

		session.sendMsg = function(msg){
			if (session.ws.readyState !== 1){session.msg = msg;}
			else {session.ws.send(JSON.stringify(msg));}
		}

		session.watchStream = function(streamID){
			session.streamID = streamID;
			var data = {};
			data.request = "play";
			data.streamID = session.streamID;
			session.sendMsg(data);
		}

		session.listStreams = function(){
			console.log("send this shit");
			var data = {};
			data.request = "list";
			session.sendMsg(data);
			session.listPromise = defer();
			return session.listPromise;
		}

        session.graphStreams = function(){
            console.log("graph this shit");
            var data = {};
            data.request = "graph";
            session.sendMsg(data);
            session.graphPromise = defer();
            return session.graphPromise;
        }

        


		session.ws.onmessage = function (evt) {
			var msg = JSON.parse(evt.data);
			if (msg.request){ // ACTIONS THAT ARE OUTSIDE THE SCOPE OF BASIC WEBRTC
				if (msg.request=="offerSDP"){  // newly connected client is asking for your SDP offer
					session.offerSDP(session.streamSrc, msg.UUID);
				} else if (msg.request=="listing"){
					console.log(msg.list);
					session.listPromise.resolve(msg.list);
				} else if (msg.request=="graph"){
                    console.log(msg.graph);
                    session.graphPromise.resolve(msg.graph);
                } else if (msg.request=="genkey"){
                    session.generateCrypto();
                }  else if (msg.request=="publickey"){
                    session.importCrypto(msg.key);
                }
 

			} else if (msg.description){
                console.log(msg.description);
               // var ttt=true;
				//if (msg.UUID in session.pcs)(ttt=false);
                session.setupPeer(msg.UUID); // could end up setting up the peer the wrong way.
				session.pcs[msg.UUID].setRemoteDescription(msg.description).then(function(){  // description, onSuccess, onError
					if (session.pcs[msg.UUID].remoteDescription.type === 'offer'){ // When receiving an offer/video lets answer it
						session.pcs[msg.UUID].createAnswer().then(function(description){  // creating answer
							return session.pcs[msg.UUID].setLocalDescription(description);
                        }).then(function(){
							console.log("providing answer");
							var data = {};
							data.UUID = msg.UUID;
							data.description = session.pcs[msg.UUID].localDescription; // send our updated self identify
							session.sendMsg(data);

                            var data = {};
                            data.request = "getkey"
                            session.sendMsg(data);

						}).catch(onError);
					} else if (session.pcs[msg.UUID].remoteDescription.type === 'answer'){  // someone responded to one of our answers; they presumably requested an offerSDP
                        //if (ttt){
                        //session.pcs[msg.UUID].createOffer().then(function(description){
                         // session.pcs[msg.UUID].setLocalDescription(description).then(function(){
                           // console.log("publishing SDP Offer");
                           // var data = {};
                           // data.description = session.pcs[msg.UUID].localDescription;
                           // data.UUID = msg.UUID;
                           // session.ws.send(JSON.stringify(data));
                         // }).catch(onError);
                       // }).catch(onError);
                       // }
                        // I AM A SEEDER OR PUBLISHER -- PUSHING DATA.
                        //
                        // I DONT WNAT EVERYONE DOING THIS. JUST THE ORIGINAL PUBLISHER.  I WANT THEM INSTEAD TO JUST FORWARD AND DECODE.
                        // VALIDATE MESSAGES , FORWARD, thats it. maybe some data about connection and parents. 
                        // Hold conenction open, not send data -- just check out how the latency is.
                        // CHECK FOR CHAT EMSSAGES; surface them if any
                        // SHOUDL CHAT BE TWO DIRECTIONAL?  SEEMS LIKE WAY TOO MUCH STRESS. SO NO.
                        if (!session.timer){
                            console.log("sending data string every 5 seconds");
		            	    session.timer = setInterval(function(){
                                    session.signData(Date.now().toString()+":"+session.counter,function(data,signature){
                                        session.counter += 1;
                                        for (i in session.pcs){ 
                                            console.log(i);
                                            try{
                                                session.pcs[i].sendChannel.send(JSON.stringify({data,signature}));
                                            } catch(e){
                                                console.log("RTC Connection seems to be dead? is it? If it is, or can't be validated, close this shit");
                                                session.pcs[i].close();
                                                delete(session.pcs[i]);
                                            }
                                        }
                                })
                            // SIGN DATA HERE -- session.signData
                            // // unsign data on recieve; mark as unverified if no key to match with.
                            },5000);
                        } /// testing p2p data channels -- perhaps for sending SYNC, quality, blockchina, or EVENT data.
						//console.log("Already set description for answer");
						//session.pcs[msg.UUID].setRemoteDescription(msg.description, function(){ // register their response and I assume start pubilshing (publishing)
							//console.log("THIS IS GOOD! If it fails now, maybe an localhost/SSL issue?");
							//session.pcs[UUID].createAnswer().then(function(description){
							//	console.log("SDP ANSWSER MADE!!");
							//	session.pcs[UUID].setLocalDescription(description, function (){
							//		console.log("providing answer");session.pcs[msg.UUID].remoteDescription.type === 'offer'
							//		var data = {};
							//		data.request = "publish";
							//		data.UUID = UUID;
							//		data.description = session.pcs[UUID].localDescription;
							//		session.sendMsg(data);
						//		}).catch(onError);
						//}, onError);
					}
				}).catch(onError);
			} else if (msg.candidate){
                console.log("add ice candidate");
				session.pcs[msg.UUID].addIceCandidate(msg.candidate).then(function(){console.log("added ICE from viewer");}).catch(onError);
			} else if (msg.request == "cleanup"){
				console.log("Clean up");
				if (msg.UUID in session.pcs){
					console.log("problem");
					session.pcs[msg.UUID].close();
					delete(session.pcs[msg.UUID]);
					// I'll have to figure out where to reconnect somewhere else
					//var data = {};
					//data.request = "play";
					//data.streamID = session.streamID;
					//session.sendMsg(data);
				}
			} else { console.log("what is this?",msg); }
		}
		session.ws.onclose = function(){console.log("ws closed");alert("We lost our connection to the server. Refresh")};
	};

	session.offerSDP = function(stream,UUID){  // publisher/offerer
		if (UUID in session.pcs){alert("PROBLEM! RESENDING SDP OFFER SHOULD NOT HAPPEN");}
        else {console.log("Create a new RTC connection; offering SDP on request");}

		session.pcs[UUID] = new RTCPeerConnection(configuration);

        session.pcs[UUID].sendChannel = session.pcs[UUID].createDataChannel("sendChannel");
		
        stream.getTracks().forEach(track => session.pcs[UUID].addTrack(track, stream));
		session.pcs[UUID].ontrack = event => {alert("Publisher is being sent a video stream??? NOT EXPECTED!")};

		session.pcs[UUID].onicecandidate = function(event){
			console.log("CREATE ICE");
			if (event.candidate==null){return;}
			var data = {};
			data.UUID = UUID;
			data.candidate = event.candidate;
			session.sendMsg(data);
		};

        session.pcs[UUID].oniceconnectionstatechange = function() {
            try{
              if (session.pcs[UUID].iceConnectionState == 'disconnected') {
                console.log(UUID,'Disconnected');
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
				session.pcs[UUID].setLocalDescription(description).then(function(){
    			    console.log("publishing SDP Offer");
	    			var data = {};
		    		data.description = session.pcs[UUID].localDescription;
			    	data.UUID = UUID;
				    session.ws.send(JSON.stringify(data));
                }).catch(onError);
			}).catch(onError);
		//};

		//session.pcs[UUID].sendChannel = session.pcs[UUID].createDataChannel("sendChannel");
		session.pcs[UUID].onclose = function(){
			console.log("WebRTC Connection Closed",UUID);
			delete(session.pcs[UUID]);
		};
		session.pcs[UUID].onopen = function(){console.log("WEBRTC CONNECTION OPEN",UUID);};



	};

	session.setupPeer = function(UUID){ // ingesting stream as a viewer
		if (UUID in session.pcs){console.log("RTC connection is ALREADY ready; we can already accept answers");return;} // already exists
        else {console.log("MAKING A NEW RTC CONNECTION");}
		session.pcs[UUID] = new RTCPeerConnection(configuration);
        session.pcs[UUID].addTransceiver('video', { direction: 'recvonly'});
		session.pcs[UUID].onclose = function(event){
			console.log("rpc closed");
			delete(session.pcs[UUID]);
			var data = {};
			data.request = "play";
			data.streamID = session.streamID;
			session.sendMsg(data);
			session.streamSrc==null;
		}

		session.pcs[UUID].onicecandidate = function(event){
			console.log("CREATE ICE");
			if (event.candidate==null){console.log("null ice");return;}
			var data = {};
			data.UUID = UUID;
			data.candidate = event.candidate;
			session.sendMsg(data);
            console.log(data);
		};

        session.pcs[UUID].oniceconnectionstatechange = function() {
            try{
            if (session.pcs[UUID].iceConnectionState == 'disconnected') {
                console.log(UUID,'Disconnected');
                session.pcs[UUID].close()
                delete(session.pcs[UUID]);
            }} catch (E){}
        }

		session.pcs[UUID].ondatachannel = function(event){ // recieve data from peer; event data maybe
				session.pcs[UUID].receiveChannel = event.channel;
				session.pcs[UUID].receiveChannel.onmessage = function(e){console.log("recieved data: "+e.data);session.verifyData(JSON.parse(e.data));};
				session.pcs[UUID].receiveChannel.onopen = function(){console.log("data channel opened")};
				session.pcs[UUID].receiveChannel.onclose = function(){console.log("datachannel closed");};
		};

		session.pcs[UUID].ontrack = event => {

            console.log("streams:",event.streams);
            console.log(event.streams[0].getVideoTracks());
            console.log(event.streams[0].getAudioTracks());
		    const stream = event.streams[0];
			session.streamSrc = stream;

			if (document.getElementById("videosource")){
				console.log("new track added to mediastream");
				var v = document.getElementById("videosource");
				v.autoplay = true;
				v.controls = true;
				v.muted = true;
                v.setAttribute("playsinline","");

			    v.srcObject = stream;
				var m = document.getElementById("mainmenu");
				try {m.remove();} catch(e){}

			} else {
				console.log("video element is being created and media track added");
				var v = document.createElement("video");
				document.body.appendChild(v);
				v.autoplay = true;
				v.controls = true;
				v.muted = true;
				v.id = "videosource"; // could be set to UUID in the future
                v.setAttribute("playsinline",""); 
                v.style = "width:100vw;";

				if (!v.srcObject || v.srcObject.id !== stream.id) {
			      v.srcObject = stream;
			    }

				//stream.getTracks().forEach(track => {
				//	console.log("Remote track", track)
				//});

				//	v.onloadedmetadata = (e) => {
				//		console.log("Remote video play");
				//		v.play().then(() => { console.log("Remote video playing") }).catch((e) => { console.log(e) });
				//	}

				// Time to become a seeder now that it's all working
                if (session.viewonly == false){
                    var data = {};
                    data.request = "seed";
                    data.streamID = session.streamID;
                    session.sendMsg(data);
                    console.log("OPEN TO SEEDING NOW: "+session.streamID);
                }
			}
		}
        console.log("setup peer complete");
	};


	return session;
})();
