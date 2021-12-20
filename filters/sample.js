function effectsEngine(){
	console.log('LOADED SAMPLE');
	function loadScript(url, callback=false){
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.onload = function(){this.remove();if(callback){callback();}}
		document.head.appendChild(script);
		
	}

	loadScript("./thirdparty/jeeliz/jeelizFaceFilter.js", 
		function(){
			loadScript("./thirdparty/jeeliz/helpers/JeelizCanvas2DHelper.js");
		}
	);

	function main(){ // entry point
		console.log(".");
		if (session.canvasSource && session.canvasSource.videoWidth && session.canvasSource.videoHeight && session.canvasWebGL){
			if (session.canvasWebGL && !(document.getElementById("effectsCanvasTarget"))){
				session.canvasWebGL.id = "effectsCanvasTarget";
				session.canvasWebGL.style.position="fixed";
				session.canvasWebGL.style.top= "-9999px";
				session.canvasWebGL.style.left= "-9999px";
				document.body.appendChild(session.canvasWebGL);
			}
			start(JEELIZFACEFILTER, "effectsCanvasTarget", session.canvasSource, 'yellow');
		} else {
			setTimeout(main, 500);
		}
	}

	function start(jeeFaceFilterAPIInstance, canvasId, videoElement, borderColor){
		let cvd = null; // return of Canvas2DDisplay

		jeeFaceFilterAPIInstance.init({
			canvasId: canvasId,
			videoSettings: {
				videoElement: videoElement
			},
			NNCPath: './thirdparty/jeeliz/neuralNets/', // root of NN_DEFAULT.json file
			callbackReady: function(errCode, spec){
				if (errCode){
					console.log('AN ERROR HAPPENS. SORRY BRO :( . ERR =', errCode);
					return;
				}
				console.log('INFO: JEELIZFACEFILTER IS READY');
				cvd = JeelizCanvas2DHelper(spec);
				cvd.ctx.strokeStyle = borderColor;
			},
			callbackTrack: function(detectState){ // drawing loop
				if (detectState.detected>0.6){
					// draw a border around the face:
					const faceCoo = cvd.getCoordinates(detectState);
					cvd.ctx.clearRect(0,0,cvd.canvas.width, cvd.canvas.height);
					cvd.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
					cvd.update_canvasTexture();
				}
			  cvd.draw();
			}
		});
	}
	main();
};
