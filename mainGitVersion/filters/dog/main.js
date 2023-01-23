"use strict";

// some globalz:
let THREECAMERA = null;
let ISDETECTED = false;
let TONGUEMESH = null, NOSEMESH = null, EARMESH = null;
let DOGOBJ3D = null, FRAMEOBJ3D = null;


let ISOVERTHRESHOLD = false, ISUNDERTRESHOLD = true;

let ISLOADED = false;

let MIXER = null;
let ACTION = null;

let ISANIMATING = false;
let ISOPAQUE = false;
let ISTONGUEOUT = false;
let ISANIMATIONOVER = false;

let _flexParts = [];
let _videoGeometry = null;

// callback: launched if a face is detected or lost
function detect_callback(isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
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
  tempImage.src = './images/texture_pink.jpg';

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
    './models/dog/dog_ears.json',
    function (geometry) {
      const mat = new THREE.FlexMaterial({
        map: new THREE.TextureLoader().load('./models/dog/texture_ears.jpg'),
        flexMap: new THREE.TextureLoader().load('./models/dog/flex_ears_256.jpg'),
        alphaMap: new THREE.TextureLoader().load('./models/dog/alpha_ears_256.jpg'),
        transparent: true,
        opacity: 1,
        bumpMap: new THREE.TextureLoader().load('./models/dog/normal_ears.jpg'),
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
    './models/dog/dog_nose.json',
    function (geometry) {
      const mat = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./models/dog/texture_nose.jpg'),
        shininess: 1.5,
        specular: 0xffffff,
        bumpMap: new THREE.TextureLoader().load('./models/dog/normal_nose.jpg'),
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

  // CREATE OUR DOG TONGUE
  const loaderTongue = new THREE.JSONLoader(loadingManager);

  loaderTongue.load(
    'models/dog/dog_tongue.json',
    function (geometry) {
      geometry.computeMorphNormals();
      const mat = new THREE.FlexMaterial({
        map: new THREE.TextureLoader().load('./models/dog/dog_tongue.jpg'),
        flexMap: new THREE.TextureLoader().load('./models/dog/flex_tongue_256.png'),
        alphaMap: new THREE.TextureLoader().load('./models/dog/tongue_alpha_256.jpg'),
        transparent: true,
        morphTargets: true,
        opacity: 1
      });

      TONGUEMESH = new THREE.Mesh(geometry, mat);
      TONGUEMESH.material.opacity.value = 0;

      TONGUEMESH.scale.multiplyScalar(2);
      TONGUEMESH.position.setY(-0.28);

      TONGUEMESH.frustumCulled = false;
      TONGUEMESH.visible = false;

      if (!MIXER) {
        // the mixer is declared globally so we can use it in the THREE renderer
        MIXER = new THREE.AnimationMixer(TONGUEMESH);
        const clips = TONGUEMESH.geometry.animations;

        const clip = clips[0];

        ACTION = MIXER.clipAction(clip);
        ACTION.noLoop = true;

        ACTION.play();
      }
    }
  );

  loadingManager.onLoad = () => {
    DOGOBJ3D.add(EARMESH);
    DOGOBJ3D.add(NOSEMESH);
    DOGOBJ3D.add(TONGUEMESH);

    addDragEventListener(DOGOBJ3D);

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
      ISTONGUEOUT = false;
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
          ISTONGUEOUT = true;
          ISANIMATIONOVER = true;
        }, 150);
      })
      .start();
  }
}

// Entry point: launched by body.onload()
function main(){
  DOGOBJ3D = new THREE.Object3D();
  FRAMEOBJ3D = new THREE.Object3D();

  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  });
}

function init_faceFilter(videoSettings){
  JEELIZFACEFILTER.init({
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // root of NN_DEFAULT.json file
    videoSettings: videoSettings,
    callbackReady: function (errCode, spec) {
      if (errCode) {
        console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    }, // end callbackReady()

    // called at each render iteration (drawing loop)
    callbackTrack: function (detectState) {
      ISDETECTED = JeelizThreeHelper.get_isDetected();

      if (ISDETECTED) {
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

        if (TONGUEMESH && TONGUEMESH.material.set_amortized){
          TONGUEMESH.material.set_amortized(
            TONGUEMESH.getWorldPosition(new THREE.Vector3(0,0,0)),
            TONGUEMESH.getWorldScale(new THREE.Vector3(0,0,0)),
            TONGUEMESH.getWorldQuaternion(_eul),
            false,
            0.3
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

        if (ISLOADED && ISOVERTHRESHOLD && !ISANIMATING && !ISANIMATIONOVER) {
          if (!ISTONGUEOUT) {
            ISANIMATING = true;
            animateTongue(TONGUEMESH);
          } else {
            ISANIMATING = true;
            animateTongue(TONGUEMESH, true);
          }
        }
      }

      TWEEN.update();

      // Update the mixer on each frame:
      if (ISOPAQUE) {
        MIXER.update(0.16);
      }

      JeelizThreeHelper.render(detectState, THREECAMERA);
    } // end callbackTrack()
  }); // end JEELIZFACEFILTER.init call
}

