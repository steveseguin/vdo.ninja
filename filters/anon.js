async function effectsEngine(effectName){
	
	var loadList = [];
	if (typeof JEELIZFACEFILTER == 'undefined' || JEELIZFACEFILTER==null){
		loadList.push("./thirdparty/jeeliz/jeelizFaceFilter.js");
	} 
	if (typeof THREE == 'undefined' || THREE == null){
		loadList.push("./thirdparty/jeeliz/three/v112/three.min.js");
	} else {
		console.log("typeof THREE:"+typeof THREE);
	}
	if (typeof JeelizThreeHelper == 'undefined' || JeelizThreeHelper==null){
		loadList.push("./thirdparty/jeeliz/JeelizThreeHelper.js");
	}
	if (typeof TWEEN == 'undefined' || TWEEN == null){
		loadList.push("./thirdparty/jeeliz/Tween.min.js");
	}
	
	if (loadList.length){
		loadList.reverse();
		while (loadList.length){
			await loadScript(loadList.pop());
		}
	}

	log("finished loading anon effect");

	// some globals:
	let THREECAMERA = null; // should be prop of window
	let ANONYMOUSMESH = null;
	let ANONYMOUSOBJ3D = null;
	let isTransformed = false;
	
	var pathname = window.location.pathname.split("/");
	pathname.pop();
	pathname = window.location.protocol + "//" + window.location.host + pathname.join("/");


	// callback: launched if a face is detected or lost.
	function detect_callback(isDetected) {
	 // if (isDetected) {
	//	console.log('INFO in detect_callback(): DETECTED');
	 // } else {
	//	console.log('INFO in detect_callback(): LOST');
	 // }
	}

	// entry point:
	function main(){
		if (session.canvasSource && document.getElementById("effectsCanvasTarget") && JEELIZFACEFILTER){
			try {
				warnlog("LOADING JEELIZ");
				THREECAMERA = null; // should be prop of window
				ANONYMOUSMESH = null;
				ANONYMOUSOBJ3D = null;
				isTransformed = false;
				init_faceFilter("effectsCanvasTarget", session.canvasSource);
			} catch(e){
				errorlog(e);
			}
		} else {
			setTimeout(function(){main();},500);
			warnlog("...retrying to load");
		}
	}

	function init_faceFilter(canvasId, videoElement){
	  JEELIZFACEFILTER.init({
		canvasId: canvasId,
		NNCPath: pathname+'/thirdparty/jeeliz/neuralNets/',
		videoSettings: {
			videoElement: videoElement
		},
		callbackReady: function (errCode, spec) {
			if (errCode) {
				errorlog(errCode);
				try{
					JEELIZFACEFILTER.destroy();
				} catch(e){}
				THREECAMERA = null; // should be prop of window
				ANONYMOUSMESH = null;
				ANONYMOUSOBJ3D = null;
				isTransformed = false;
				setTimeout(function(){main();},500);
				return;
			}
			const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
			// CREATE OUR ANONYMOUS MASK:
			const headLoader = new THREE.BufferGeometryLoader();
			headLoader.load('./filters/anon/anonymous.json',(geometryHead) => {
				const mat = new THREE.MeshLambertMaterial({
					map: new THREE.TextureLoader().load('./filters/anon/anonymous.png'),
					transparent: true
				});

				ANONYMOUSMESH = new THREE.Mesh(geometryHead, mat);
				ANONYMOUSMESH.frustumCulled = false;
				ANONYMOUSMESH.scale.multiplyScalar(0.065); // mask scale
				ANONYMOUSMESH.position.fromArray([0, -0.75, 0.35]); // maskPositionOffset
				ANONYMOUSMESH.renderOrder = 1000000;
				ANONYMOUSMESH.material.opacity = 0;
				ANONYMOUSOBJ3D = new THREE.Object3D();
				ANONYMOUSOBJ3D.add(ANONYMOUSMESH);
				threeStuffs.faceObject.add(ANONYMOUSOBJ3D);
			});
			THREECAMERA = JeelizThreeHelper.create_camera();
			const ambient = new THREE.AmbientLight(0xffffff, 0.8);
			threeStuffs.scene.add(ambient);
			const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
			dirLight.position.set(100, 1000, 1000);
			threeStuffs.scene.add(dirLight);
		},
		callbackTrack: function (detectState) {
			if (effectName !== session.effect){
				try{
					JEELIZFACEFILTER.toggle_pause(true,false); // unload the filter when no longer active.  Leaving the track active is required, else it breaks the app
				} catch(e){errorlog(e);}
				THREECAMERA = null; // should be prop of window
				ANONYMOUSMESH = null;
				ANONYMOUSOBJ3D = null;
				isTransformed = false;
				return;
			}
			
			const isDetected = JeelizThreeHelper.get_isDetected();
			//if (isDetected && detectState.expressions[0] >= 0.8 && !isTransformed) { // If the person opens their mouth wide, then activate..
			if (isDetected && !isTransformed){
				isTransformed = true;
				new TWEEN.Tween( ANONYMOUSMESH.material ).to({ opacity: 1}, 700).start(); // animation
			}
			TWEEN.update();
			JeelizThreeHelper.render(detectState, THREECAMERA);
		}
	  }); 
	}
	return main;
}
