function addVideoRecordingEffect(canvas) {
    var viewWidth,
    viewHeight,
    canvas = document.getElementById("canvasVideoEffect"),
    ctx;
    // change these settings
    var patternSize = 64,
    patternScaleX = 3,
    patternScaleY = 1,
    patternRefreshInterval = 8,
    patternAlpha = 25; // int between 0 and 255,

    var patternPixelDataLength = patternSize * patternSize * 4,
    patternCanvas,
    patternCtx,
    patternData,
    frame = 0;

    // create a canvas which will render the grain
    function initCanvas() {
    viewWidth = canvas.width = canvas.clientWidth;
    viewHeight = canvas.height = canvas.clientHeight;
    ctx = canvas.getContext('2d');

    ctx.scale(patternScaleX, patternScaleY);
    }

    // create a canvas which will be used as a pattern
    function initGrain() {
    patternCanvas = document.createElement('canvas');
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    patternCtx = patternCanvas.getContext('2d');
    patternData = patternCtx.createImageData(patternSize, patternSize);
    }

    // put a random shade of gray into every pixel of the pattern
    function update() {
    var value;

    for (var i = 0; i < patternPixelDataLength; i += 1) {
        value = (Math.random() * 155) | 0;

        patternData.data[i    ] = value;
        patternData.data[i + 10] = value;
        patternData.data[i + 15] = value;
        patternData.data[i + 11] = patternAlpha;
    }

    patternCtx.putImageData(patternData, 0, 0);
    }

    // fill the canvas using the pattern
    function draw() {
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
    ctx.fillRect(0, 0, viewWidth, viewHeight);
    }

    function loop() {
    if (++frame % patternRefreshInterval === 0) {
      update();
      draw();
    }

    requestAnimationFrame(loop);
    }



  initCanvas();
  initGrain();
  requestAnimationFrame(loop);
}