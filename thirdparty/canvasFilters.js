// Modified copy obtained from https://github.com/timotgl/inspector-bokeh/tree/main/demo  - MIT Lic
// Original file based on https://github.com/kig/canvasfilters/blob/master/filters.js
// I reduced the modified code to a few core functions; standard convolve/blur matrix functions.

const Filters = {};

if (typeof Float32Array == 'undefined') {  // good
  Filters.getFloat32Array = Filters.getUint8Array = function (len) {
    if (len.length) {
      return len.slice(0);
    }
    return new Array(len);
  };
} else {
  Filters.getFloat32Array = function (len) {
    return new Float32Array(len);
  };
  Filters.getUint8Array = function (len) {
    return new Uint8Array(len);
  };
}

if (typeof document != 'undefined') {
	Filters.tmpCanvas = document.createElement('canvas');
	Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');
	Filters.createImageData = function (w, h) {
		return this.tmpCtx.createImageData(w, h);
	};
} else {
	onmessage = function (e) {
		var ds = e.data;
		if (!ds.length) {
		  ds = [ds];
		}
		postMessage(Filters.runPipeline(ds));
	};
	Filters.createImageData = function (w, h) {
		return { width: w, height: h, data: this.getFloat32Array(w * h * 4) };
	};
}

Filters.convolve = function (pixels, weights, opaque) { // good
  var side = Math.round(Math.sqrt(weights.length)); 
  var halfSide = Math.floor(side / 2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y * w + x) * 4;
      var r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (var cy = 0; cy < side; cy++) {
        for (var cx = 0; cx < side; cx++) {
          var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy * sw + scx) * 4;
          var wt = weights[cy * side + cx];
          r += src[srcOff] * wt;
          g += src[srcOff + 1] * wt;
          b += src[srcOff + 2] * wt;
          a += src[srcOff + 3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};


Filters.luminance = function (pixels, args) { // good
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    // CIE luminance for the RGB
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    dst[i] = dst[i + 1] = dst[i + 2] = v;
    dst[i + 3] = d[i + 3];
  }
  return output;
};

Filters.runPipeline = function (ds) {
  var res = null;
  res = this[ds[0].name].apply(this, ds[0].args);
  for (var i = 1; i < ds.length; i++) {
    var d = ds[i];
    var args = d.args.slice(0);
    args.unshift(res);
    res = this[d.name].apply(this, args);
  }
  return res;
};
 

Filters.identity = function (pixels, args) {
  var output = Filters.createImageData(pixels.width, pixels.height);
  var dst = output.data;
  var d = pixels.data;
  for (var i = 0; i < d.length; i++) {
    dst[i] = d[i];
  }
  return output;
};


Filters.horizontalConvolve = function (pixels, weightsVector, opaque) {
  var side = weightsVector.length;
  var halfSide = Math.floor(side / 2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = Filters.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y * w + x) * 4;
      var r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (var cx = 0; cx < side; cx++) {
        var scy = sy;
        var scx = Math.min(sw - 1, Math.max(0, sx + cx - halfSide));
        var srcOff = (scy * sw + scx) * 4;
        var wt = weightsVector[cx];
        r += src[srcOff] * wt;
        g += src[srcOff + 1] * wt;
        b += src[srcOff + 2] * wt;
        a += src[srcOff + 3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};

Filters.separableConvolve = function (
  pixels,
  horizWeights,
  vertWeights,
  opaque
) {
  return this.horizontalConvolve(
    this.verticalConvolveFloat32(pixels, vertWeights, opaque),
    horizWeights,
    opaque
  );
};


Filters.gaussianBlur = function (pixels, diameter) { // good
  diameter = Math.abs(diameter);
  if (diameter <= 1) return Filters.identity(pixels);
  var radius = diameter / 2;
  var len = Math.ceil(diameter) + (1 - (Math.ceil(diameter) % 2));
  var weights = this.getFloat32Array(len); 
  var rho = (radius + 0.5) / 3;
  var rhoSq = rho * rho;
  var gaussianFactor = 1 / Math.sqrt(2 * Math.PI * rhoSq);
  var rhoFactor = -1 / (2 * rho * rho);
  var wsum = 0;
  var middle = Math.floor(len / 2);
  for (var i = 0; i < len; i++) {
    var x = i - middle;
    var gx = gaussianFactor * Math.exp(x * x * rhoFactor);
    weights[i] = gx;
    wsum += gx;
  }
  for (var i = 0; i < weights.length; i++) {
    weights[i] /= wsum;
  }
  return Filters.separableConvolve(pixels, weights, weights, false);
};


Filters.verticalConvolveFloat32 = function (pixels, weightsVector, opaque) {
  var side = weightsVector.length;
  var halfSide = Math.floor(side / 2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = { width: w, height: h, data: this.getFloat32Array(w * h * 4) };
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y * w + x) * 4;
      var r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (var cy = 0; cy < side; cy++) {
        var scy = Math.min(sh - 1, Math.max(0, sy + cy - halfSide));
        var scx = sx;
        var srcOff = (scy * sw + scx) * 4;
        var wt = weightsVector[cy];
        r += src[srcOff] * wt;
        g += src[srcOff + 1] * wt;
        b += src[srcOff + 2] * wt;
        a += src[srcOff + 3] * wt;
      }
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
      dst[dstOff + 3] = a + alphaFac * (255 - a);
    }
  }
  return output;
};

export default Filters;
