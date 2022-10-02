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
	
	loadList.push("./filters/dog/libs/glfx.js");
	loadList.push("./thirdparty/jeeliz/three/customMaterials/FlexMaterial/ThreeFlexMaterial.js");
	
	if (loadList.length){
		loadList.reverse();
		while (loadList.length){
			await loadScript(loadList.pop());
		}
	}
	
	
	
	var pathname = window.location.pathname.split("/");
	pathname.pop();
	pathname = window.location.protocol + "//" + window.location.host + pathname.join("/");

	// some globals:
	let THREECAMERA = null; // should be prop of window
	let isTransformed = false;
	
	let ISDETECTED = false;
	let NOSEMESH = null, EARMESH = null;
	let DOGOBJ3D = null, FRAMEOBJ3D = null;


	let ISOVERTHRESHOLD = false, ISUNDERTRESHOLD = true;

	let ISLOADED = false;

	let MIXER = null;
	let ACTION = null;

	let ISANIMATING = false;
	let ISOPAQUE = false;
	let ISANIMATIONOVER = false;

	let _flexParts = [];
	let _videoGeometry = null;


	// callback: launched if a face is detected or lost.
	function detect_callback(isDetected) {
	 // if (isDetected) {
	//	console.log('INFO in detect_callback(): DETECTED');
	 // } else {
	//	console.log('INFO in detect_callback(): LOST');
	 // }
	}
	
	function create_mat2d(threeTexture, isTransparent){ // MT216: we put the creation of the video material in a func because we will also use it for the frame
	  return new THREE.RawShaderMaterial({
		depthWrite: false,
		depthTest: false,
		transparent: isTransparent,
		vertexShader: "attribute vec2 position;\n\
		  varying vec2 vUV;\n\
		  void main(void){\n\
			gl_Position = vec4(position, 0., 1.);\n\
			vUV = 0.5 + 0.5 * position;\n\
		  }",
		fragmentShader: "precision lowp float;\n\
		  uniform sampler2D samplerVideo;\n\
		  varying vec2 vUV;\n\
		  void main(void){\n\
			gl_FragColor = texture2D(samplerVideo, vUV);\n\
		  }",
		 uniforms:{
		  samplerVideo: { value: threeTexture }
		 }
	  });
	}
	
	function applyFilter() {
	  let canvas;
	  try {
		canvas = fx.canvas();
	  } catch (e) {
		alert('Ow no! WebGL isn\'t supported...')
		return
	  }

	  const tempImage = new Image(512, 512);
	  tempImage.src = './filters/dog/images/texture_pink.jpg';

	  tempImage.onload = () => {
		const texture = canvas.texture(tempImage);

		// Create the effet
		canvas.draw(texture).vignette(0.5, 0.6).update();

		const canvasOpacity = document.createElement('canvas');
		canvasOpacity.width = 512;
		canvasOpacity.height = 512;
		const ctx = canvasOpacity.getContext('2d');

		ctx.globalAlpha = 0.2
		ctx.drawImage(canvas, 0, 0, 512, 512);

		// Add the effect
		const calqueMesh = new THREE.Mesh(_videoGeometry,  create_mat2d(new THREE.TextureLoader().load(canvasOpacity.toDataURL('image/png')), true))
		calqueMesh.material.opacity = 0.2;
		calqueMesh.material.transparent = true;
		calqueMesh.renderOrder = 999; // render last
		calqueMesh.frustumCulled = false;
		FRAMEOBJ3D.add(calqueMesh);
	  }
	}
	
	
	// build the 3D. called once when Jeeliz Face Filter is OK
	function init_threeScene(spec) {
	  // INIT THE THREE.JS context
	  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);
	  _videoGeometry =  threeStuffs.videoMesh.geometry;

	  // CREATE OUR DOG EARS:

	  // let's begin by creating a loading manager that will allow us to
	  // have more control over the three parts of our dog model
	  const loadingManager = new THREE.LoadingManager();

	  const loaderEars = new THREE.BufferGeometryLoader(loadingManager);

	  loaderEars.load(
		'./filters/dog/models/dog/dog_ears.json',
		function (geometry) {
		  const mat = new THREE.FlexMaterial({
			map: new THREE.TextureLoader().load('./filters/dog/models/dog/texture_ears.jpg'),
			flexMap: new THREE.TextureLoader().load('./filters/dog/models/dog/flex_ears_256.jpg'),
			alphaMap: new THREE.TextureLoader().load('./filters/dog/models/dog/alpha_ears_256.jpg'),
			transparent: true,
			opacity: 1,
			bumpMap: new THREE.TextureLoader().load('./filters/dog/models/dog/normal_ears.jpg'),
			bumpScale: 0.0075,
			shininess: 1.5,
			specular: 0xffffff,
		  });

		  EARMESH = new THREE.Mesh(geometry, mat);
		  EARMESH.scale.multiplyScalar(0.025);
		  EARMESH.position.setY(-0.3);
		  EARMESH.frustumCulled = false;
		  EARMESH.renderOrder = 10000;
		  EARMESH.material.opacity.value = 1;
		}
	  );
	  // CREATE OUR DOG NOSE
	  const loaderNose = new THREE.BufferGeometryLoader(loadingManager);

	  loaderNose.load(
		'./filters/dog/models/dog/dog_nose.json',
		function (geometry) {
		  const mat = new THREE.MeshPhongMaterial({
			map: new THREE.TextureLoader().load('./filters/dog/models/dog/texture_nose.jpg'),
			shininess: 1.5,
			specular: 0xffffff,
			bumpMap: new THREE.TextureLoader().load('./filters/dog/models/dog/normal_nose.jpg'),
			bumpScale: 0.005
		  });

		  NOSEMESH = new THREE.Mesh(geometry, mat);
		  NOSEMESH.scale.multiplyScalar(0.018);
		  NOSEMESH.position.setY(-0.05);
		  NOSEMESH.position.setZ(0.15);
		  NOSEMESH.frustumCulled = false;
		  NOSEMESH.renderOrder = 10000;
		}
	  );

	  loadingManager.onLoad = () => {
		DOGOBJ3D.add(EARMESH);
		DOGOBJ3D.add(NOSEMESH);
		threeStuffs.faceObject.add(DOGOBJ3D);

		ISLOADED = true;
	  }

	  // CREATE AN AMBIENT LIGHT
	  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
	  threeStuffs.scene.add(ambient);

	  // CREAT A DIRECTIONALLIGHT
	  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
	  dirLight.position.set(100, 1000, 1000);
	  threeStuffs.scene.add(dirLight);

	  // CREATE THE CAMERA
	  THREECAMERA = JeelizThreeHelper.create_camera();
	 
	  threeStuffs.scene.add(FRAMEOBJ3D);

	  // Add filter
	  applyFilter();
	} // end init_threeScene()

	function animateTongue (mesh, isReverse) {
	  mesh.visible = true;

	  if (isReverse) {
		ACTION.timescale = -1;
		ACTION.paused = false;

		setTimeout(() => {
		  ACTION.paused = true;

		  ISOPAQUE = false;
		  ISANIMATING = false;
		  ISANIMATIONOVER = true;


		  new TWEEN.Tween(mesh.material.opacity)
			.to({ value: 0 }, 150)
			.start();
		}, 150);
	  } else {
		ACTION.timescale = 1;
		ACTION.reset();
		ACTION.paused = false;

		new TWEEN.Tween(mesh.material.opacity)
		  .to({ value: 1 }, 100)
		  .onComplete(() => {
			ISOPAQUE = true;
			setTimeout(() => {
			  ACTION.paused = true;
			  ISANIMATING = false;
			  ISANIMATIONOVER = true;
			}, 150);
		  })
		  .start();
	  }
	}


	// entry point:
	function main(){
		if (session.canvasSource && document.getElementById("effectsCanvasTarget") && JEELIZFACEFILTER){
			try {
				warnlog("LOADING JEELIZ");
				THREECAMERA = null; // should be prop of window
				isTransformed = false;
				DOGOBJ3D = new THREE.Object3D();
				FRAMEOBJ3D = new THREE.Object3D();
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
				DOGOBJ3D=null;
				FRAMEOBJ3D=null;
				isTransformed = false;
				setTimeout(function(){main();},500);
				return;
			}
			init_threeScene(spec);
		},
		callbackTrack: function (detectState) {
			if (effectName !== session.effect){
				try{
					JEELIZFACEFILTER.toggle_pause(true,false); // unload the filter when no longer active.  Leaving the track active is required, else it breaks the app
				} catch(e){errorlog(e);}
				THREECAMERA = null; // should be prop of window
				isTransformed = false;
				DOGOBJ3D=null;
				FRAMEOBJ3D=null;
				return;
			}
			
			const ISDETECTED = JeelizThreeHelper.get_isDetected();
			//if (isDetected && detectState.expressions[0] >= 0.8 && !isTransformed) { // If the person opens their mouth wide, then activate..
			if (ISDETECTED){
				
				const _quat = new THREE.Quaternion();
				const _eul = new THREE.Euler();
				_eul.setFromQuaternion(_quat);

				// flex ears material:
				if (EARMESH && EARMESH.material.set_amortized){
				  EARMESH.material.set_amortized(
					EARMESH.getWorldPosition(new THREE.Vector3(0,0,0)),
					EARMESH.getWorldScale(new THREE.Vector3(0,0,0)),
					EARMESH.getWorldQuaternion(_eul),
					false,
					0.1
				  );
				}

				if (detectState.expressions[0] >= 0.85 && !ISOVERTHRESHOLD) {
				  ISOVERTHRESHOLD = true;
				  ISUNDERTRESHOLD = false;
				  ISANIMATIONOVER = false;
				}
				if (detectState.expressions[0] <= 0.1 && !ISUNDERTRESHOLD) {
				  ISOVERTHRESHOLD = false;
				  ISUNDERTRESHOLD = true;
				  ISANIMATIONOVER = false;
				}
			}

			TWEEN.update();

			if (ISOPAQUE) {
				MIXER.update(0.16);
			}

			JeelizThreeHelper.render(detectState, THREECAMERA);
		}
	  }); 
	}
	log("returning main");
	return main;
}
