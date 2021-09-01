function effectsEngine(effectName){
	var functions = {};

	function loadScript(url){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.onload = function(){
			this.remove();
			if (loadList.length){
				loadScript(loadList.pop());
			}
		}
		document.head.appendChild(script);
	}
	var loadList = [
		"./thirdparty/jeeliz/jeelizFaceFilter.js",
		"./thirdparty/jeeliz/three.min.js",
		"./thirdparty/jeeliz/JeelizThreeHelper.js",
		'./thirdparty/jeeliz/Tween.min.js'
	];
	loadList.reverse();
	loadScript(loadList.pop());

	// some globals:
	let THREECAMERA = null; // should be prop of window
	let ANONYMOUSMESH = null;
	let ANONYMOUSOBJ3D = null;
	let isTransformed = false;


	// callback: launched if a face is detected or lost.
	function detect_callback(isDetected) {
	  if (isDetected) {
		console.log('INFO in detect_callback(): DETECTED');
	  } else {
		console.log('INFO in detect_callback(): LOST');
	  }
	}

	// entry point:
	function main(){
		if (session.canvasSource && document.getElementById("effectsCanvasTarget") && JEELIZFACEFILTER){
			//try {JEELIZFACEFILTER.destroy();}catch(e){}
			try {
				init_faceFilter("effectsCanvasTarget", session.canvasSource);
			} catch(e){
			}
		} else {
			setTimeout(function(){main();},500);
			errorlog("...");
		}
	}

	function init_faceFilter(canvasId, videoElement){
	  JEELIZFACEFILTER.init({
		canvasId: canvasId,
		NNCPath: 'https://stevesserver.com/neuralNets/',
		videoSettings: {
			videoElement: videoElement
		},
		callbackReady: function (errCode, spec) {
			if (errCode) {
				console.error(errCode);
				try{
					JEELIZFACEFILTER.toggle_pause(true,true); 
				} catch(e){}
				try{
					JEELIZFACEFILTER.destroy();
				} catch(e){}
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
			if (effectName !== session.effects){
				try{
					JEELIZFACEFILTER.toggle_pause(true,true); // unload the filter when no longer active.
				} catch(e){}
				try{
					JEELIZFACEFILTER.destroy();
				} catch(e){}
				return;
			}
			warnlog("FOUND");
			const isDetected = JeelizThreeHelper.get_isDetected();
			//if (isDetected && detectState.expressions[0] >= 0.8 && !isTransformed) {
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
