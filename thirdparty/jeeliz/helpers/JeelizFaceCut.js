/*
This helper is usefull to cut faces (in 2D)
It is used for example in the faceSwap demo
It can:
- handle basic vanilla WebGL helpers like compiling shaders
- handle search display
- handle face cut

It does not handle the 3D aspect (no matrix stories)

*/

const JeelizFaceCut = (function(){

  // settings:
  const FACECUTSETTINGS = {
    scale: [1.1, 1.7],   // scale of the face cut area. Relative to initial square detection area
    offset: [0.01,0.10], // relative. 1-> 100% scale mask width of the image (or height)
    smoothEdge: 0.15,  // crop smooth edge
    headForheadY: 0.7,   // forhead start when Y>this value. Max: 1
    headJawY: 0.5,     // lower jaw start when Y<this value. Max: 1
    ryDriftDx: -0.1,
    rzDriftDx: 0.1     // drift along X axis if rotation around Z (depth). tweak
  };
  
  // private variables:
  let GL = null, __canvas = null, __glVideoTexture = null, __videoTransformMat2 = null;
  const __shps = {};
  let __fboDrawTarget = null, __fbo = null;


  // private functions:

  // BEGIN VANILLA WEBGL HELPERS
  // compile a shader:
  function compile_shader(source, glType, typeString) {
    const glShader = GL.createShader(glType);
    GL.shaderSource(glShader, source);
    GL.compileShader(glShader);
    if (!GL.getShaderParameter(glShader, GL.COMPILE_STATUS)) {
      alert("ERROR IN " + typeString +  " SHADER: " + GL.getShaderInfoLog(glShader));
      console.log('Buggy shader source: \n', source);
      return null;
    }
    return glShader;
  };

  // build the shader program:
  function build_shaderProgram(shaderVertexSource, shaderFragmentSource, id) {
    // compile both shader separately:
    const glShaderVertex = compile_shader(shaderVertexSource, GL.VERTEX_SHADER, "VERTEX " + id);
    const glShaderFragment = compile_shader(shaderFragmentSource, GL.FRAGMENT_SHADER, "FRAGMENT " + id);

    const glShaderProgram = GL.createProgram();
    GL.attachShader(glShaderProgram, glShaderVertex);
    GL.attachShader(glShaderProgram, glShaderFragment);

    // start the linking stage:
    GL.linkProgram(glShaderProgram);
    const aPos = GL.getAttribLocation(glShaderProgram, "position");
    GL.enableVertexAttribArray(aPos);

    return {
      program: glShaderProgram,
      uniforms:{}
    };
  }
  //END VANILLA WEBGL HELPERS

  // builds shader programs:
  function build__shps(){
    const copyVertexShaderSource = "attribute vec2 position;\n\
       varying vec2 vUV;\n\
       void main(void){\n\
        gl_Position = vec4(position, 0., 1.);\n\
        vUV = 0.5 + 0.5*position;\n\
       }";

    const copyFragmentShaderSource = "precision lowp float;\n\
       uniform sampler2D samplerImage;\n\
       varying vec2 vUV;\n\
       \n\
       void main(void){\n\
         gl_FragColor = texture2D(samplerImage, vUV);\n\
       }";

    // Copy shader program: simply copy a texture
    __shps.copy = build_shaderProgram(copyVertexShaderSource, copyFragmentShaderSource, 'COPY');
    __shps.copy.uniforms.samplerImage = GL.getUniformLocation(__shps.copy.program, 'samplerImage');
    GL.useProgram(__shps.copy.program);
    GL.uniform1i(__shps.copy.uniforms.samplerImage, 0);

    // search shp: display a search square on the head
    // we play on the viewport position to positionnate it
    const searchFragmentShaderSource = "precision lowp float;\n\
       uniform float detected;\n\
       varying vec2 vUV;\n\
       \n\
       void main(void){\n\
         vec3 color = mix(vec3(0.1,0.1,0.1), vec3(0.,0.6,1.), detected);\n\
         vec2 blendCenterFactor = 2. * abs(vUV-vec2(0.5,0.5));\n\
         float alpha = pow(max(blendCenterFactor.x, blendCenterFactor.y), 3.);\n\
         gl_FragColor = vec4(color, alpha*0.5);\n\
       }";
    __shps.search = build_shaderProgram(copyVertexShaderSource, searchFragmentShaderSource, 'SEARCH');
    __shps.search.uniforms.detected = GL.getUniformLocation(__shps.search.program, 'detected');


    // faceCut shp: cut the face and put the result into a texture with alpha:
    const copyRotateVertexShaderSource = "attribute vec2 position;\n\
     uniform float rz, aspectRatio;\n\
     varying vec2 vUV, vUVrot;\n\
     void main(void){\n\
       float cz=cos(rz+0.2),sz=sin(rz);\n\
       vec2 posRz=mat2(cz, sz*aspectRatio, -sz/aspectRatio, cz)*position;\n\
      gl_Position=vec4(position, 0., 1.);\n\
      vUV = 0.5 + 0.5 * position;\n\
      vUVrot = 0.5 + 0.5 * posRz;\n\
     }";
     
    const faceCutFragmentShaderSource = "precision lowp float;\n\
      uniform sampler2D samplerImage;\n\
      uniform mat2 videoTransformMat2;\n\
      uniform vec2 offset, scale;\n\
      varying vec2 vUV, vUVrot;\n\
      \n\
      const float UPPERHEADY = " + FACECUTSETTINGS.headForheadY.toFixed(2) + ";\n\
      const float LOWERHEADY = " + FACECUTSETTINGS.headJawY.toFixed(2) + ";\n\
      const float SMOOTHEDGE = " + FACECUTSETTINGS.smoothEdge.toFixed(2) + ";\n\
      \n\
      \n\
      void main(void){\n\
        \n\
        float alpha = 0.;\n\
        vec2 uv = vUVrot; // uv normalized in the face\n\
        if (uv.y>UPPERHEADY){ // upper head: circle arc\n\
          vec2 uvc = (uv-vec2(0.5,UPPERHEADY))*vec2(1., 0.5/(1.-UPPERHEADY));\n\
          float alphaBorder = smoothstep(0.5-SMOOTHEDGE, 0.5, length(uvc));\n\
          float alphaCenter = smoothstep(UPPERHEADY, 1., uv.y);\n\
          alpha = mix(alphaCenter, alphaBorder, smoothstep(0.3, 0.45, abs(uv.x-0.5)));\n\
        } else if (uv.y<LOWERHEADY){ // lower head: circle arc \n\
          vec2 uvc = (uv-vec2(0.5, LOWERHEADY))*vec2(1., 0.5/LOWERHEADY);\n\
          alpha = smoothstep(0.5-SMOOTHEDGE, 0.5, length(uvc));\n\
        } else { // middle head: straight\n\
          vec2 uvc = vec2(uv.x-0.5, 0.);\n\
          alpha = smoothstep(0.5-SMOOTHEDGE, 0.5,length(uvc));\n\
        }\n\
        \n\
        vec2 uvCol = offset + (vUV+vec2(-0.5,-0.5))*scale;\n\
        // go from canvas ref to video or image ref:\n\
        vec2 uvImageCentered = 2.0 * videoTransformMat2 * (uvCol - 0.5);\n\
        vec3 color = texture2D(samplerImage, uvImageCentered + 0.5).rgb;\n\
        \n\
        float grayScale = dot(color, vec3(0.33,0.33,0.33));\n\
      if (alpha>0.01){\n\
        alpha = mix(pow(alpha, 0.5), pow(alpha, 1.5), smoothstep(0.1,0.5,grayScale));\n\
      }\n\
      //color = vec3(1.,0.,0.); //FOR DEBUG: DISPLAY IN RED\n\
      gl_FragColor = vec4(color, 1.-alpha);\n\
       \n\
     }";
    __shps.faceCut = build_shaderProgram(copyRotateVertexShaderSource, faceCutFragmentShaderSource, 'FACECUT');
    __shps.faceCut.uniforms.rz = GL.getUniformLocation(__shps.faceCut.program, 'rz');
    __shps.faceCut.uniforms.offset = GL.getUniformLocation(__shps.faceCut.program, 'offset');
    __shps.faceCut.uniforms.scale = GL.getUniformLocation(__shps.faceCut.program, 'scale');
    __shps.faceCut.uniforms.videoTransformMat2 = GL.getUniformLocation(__shps.faceCut.program, 'videoTransformMat2');
    __shps.faceCut.uniforms.aspectRatio = GL.getUniformLocation(__shps.faceCut.program, 'aspectRatio');
    __shps.faceCut.uniforms.samplerImage = GL.getUniformLocation(__shps.faceCut.program, 'samplerImage');
    GL.useProgram(__shps.faceCut.program);
    GL.uniform1i(__shps.faceCut.uniforms.samplerImage, 0);
    

    // renderFace shp: make color correction
    const renderFaceFragmentShaderSource = "precision lowp float;\n\
     uniform sampler2D samplerImage, samplerHueSrc, samplerHueDst;\n\
     varying vec2 vUV, vUVrot;\n\
     const vec2 EPSILON2=vec2(0.001, 0.001);\n\
     \n\
     vec3 rgb2hsv(vec3 c) { //from http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl\n\
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);\n\
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));\n\
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));\n\
      float d = q.x - min(q.w, q.y);\n\
      float e = 1.0e-10;\n\
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);\n\
     }\n\
     \n\
     vec3 hsv2rgb(vec3 c) { //from https://github.com/hughsk/glsl-hsv2rgb \n\
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0); \n\
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); \n\
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); \n\
      //return c.z * normalize(mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y));\n\
     } \n\
     \n\
     void main(void){\n\
       vec2 uv = vUVrot;\n\
       // get color in HSV format:\n\
       vec2 uvCut = uv;\n\
       vec4 colorImage = texture2D(samplerImage, uvCut);\n\
       vec3 colorRGB = colorImage.rgb;\n\
       vec3 colorHSV = rgb2hsv(colorRGB);\n\
       // compute color transform:\n\
       vec3 srcRGB = texture2D(samplerHueSrc, uv).rgb;\n\
       vec3 dstRGB = texture2D(samplerHueDst, uv).rgb;\n\
       vec3 srcHSV = rgb2hsv(srcRGB);\n\
       vec3 dstHSV = rgb2hsv(dstRGB);\n\
       // apply the transform:\n\
       vec2 factorSV = vec2(1.,0.8)*dstHSV.yz/(srcHSV.yz+EPSILON2);\n\
       factorSV = clamp(factorSV, vec2(0.3,0.3), vec2(3,3.));\n\
       float dHue = dstHSV.x - srcHSV.x;\n\
       vec3 colorHSVout = vec3(mod(1.0+colorHSV.x+dHue, 1.0), colorHSV.yz*factorSV);\n\
       colorHSVout = clamp(colorHSVout, vec3(0.,0.,0.), vec3(1.,1.,1));\n\
       // reconvert to RGB and output the color:\n\
       colorRGB = hsv2rgb(colorHSVout);\n\
       gl_FragColor = vec4(colorRGB, colorImage.a);\n\
     }";
    __shps.renderFace = build_shaderProgram(copyRotateVertexShaderSource, renderFaceFragmentShaderSource, 'RENDERFACE');
    __shps.renderFace.uniforms.rz = GL.getUniformLocation(__shps.renderFace.program, 'rz');
    __shps.renderFace.uniforms.aspectRatio = GL.getUniformLocation(__shps.renderFace.program, 'aspectRatio');
    __shps.renderFace.uniforms.samplerImage = GL.getUniformLocation(__shps.renderFace.program, 'samplerImage');
    __shps.renderFace.uniforms.samplerHueSrc = GL.getUniformLocation(__shps.renderFace.program, 'samplerHueSrc');
    __shps.renderFace.uniforms.samplerHueDst = GL.getUniformLocation(__shps.renderFace.program, 'samplerHueDst');
    GL.useProgram(__shps.renderFace.program);
    GL.uniform1i(__shps.renderFace.uniforms.samplerImage, 0);
    GL.uniform1i(__shps.renderFace.uniforms.samplerHueSrc, 2);
    GL.uniform1i(__shps.renderFace.uniforms.samplerHueDst, 1);
     
  } //end build__shps()

  function fill_viewport(){ // FILL VIEWPORT. A VBO with 1 big triangle is already bound to the context by Facefilter API
    GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
  }

  function build__fbo(){ // we need to create a FBO to do render to texture for color corrections
    __fbo = GL.createFramebuffer();
    __fboDrawTarget = (GL.DRAW_FRAMEBUFFER)?GL.DRAW_FRAMEBUFFER:GL.FRAMEBUFFER; //depending on WebGL1 or WebGL2
  }

  function create_emptyTexture(w, h){
    const tex = GL.createTexture();
    GL.bindTexture(GL.TEXTURE_2D, tex);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, w, h, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE );
    GL.texParameteri( GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE );
    return tex;
  };

  function create_emptyLinearTexture(w, h){
    const tex = create_emptyTexture(w,h);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    return tex;
  };

  //create the artpainting and userCrop hue textures:
  function create_emptyMipmapTexture(w,h){
    const tex = create_emptyTexture(w,h);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
    return tex;
  };

  // public static methods:
  const superThat = {
    init: function(spec){
      GL = spec.GL;
      __canvas = spec.canvasElement;
      __glVideoTexture = spec.videoTexture;
      __videoTransformMat2 = spec.videoTransformMat2;

      build__shps();
      build__fbo();
    },

    draw_video: function(){ // draw the video texture as background
      JEELIZFACEFILTER.render_video();
    },

    draw_search: function(detectStates){
      superThat.draw_video();

      GL.enable(GL.BLEND);
      GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
      GL.useProgram(__shps.search.program);
      detectStates.forEach(function(detectState){
        GL.uniform1f(__shps.search.uniforms.detected, detectState.detected);
        const xPx = ((detectState.x+1)*0.5*__canvas.width),
          yPx = ((detectState.y+1)*0.5*__canvas.height),
          wPx = Math.round(detectState.s*__canvas.width);
        GL.viewport(Math.round(xPx-wPx/2), Math.round(yPx-wPx/2), wPx, wPx);
        fill_viewport();
      });
    },

    instance: function(specFaceCut){
      // Initialize a facecut object

      // default parameters if not specified 
      specFaceCut.sizePx = specFaceCut.sizePx || 64; // should be POT - size of the cut face texture
      specFaceCut.hueSizePx = specFaceCut.hueSizePx || 4; // should be POT - size of the texture used for color correction

      // create the face cut POT texture which will be used later to compute the hue Texture:
      const _glFaceCutTexture = create_emptyMipmapTexture(specFaceCut.sizePx,specFaceCut.sizePx);

      // create the hue Texture which will be used for color correction:
      const _glHueTexture = create_emptyLinearTexture(specFaceCut.hueSizePx, specFaceCut.hueSizePx);
      
      // normalized detection parameters:
      const _faceOffset = [0,0], _faceScale = [0,0];
      let _rz = 0.0;
      function compute_faceScaleOffset(detectState){
        _rz = detectState.rz;
        _faceOffset[0] = detectState.x*0.5 + 0.5 + detectState.s*FACECUTSETTINGS.offset[0]*Math.sin(detectState.ry); //normalized x position
        _faceOffset[1] = detectState.y*0.5 + 0.5 + detectState.s*FACECUTSETTINGS.offset[1];
        _faceScale[0] = detectState.s * FACECUTSETTINGS.scale[0];
        _faceScale[1] = detectState.s * FACECUTSETTINGS.scale[1]*__canvas.width/__canvas.height;

        // tweaks:
        _faceOffset[0] += _faceScale[0] * FACECUTSETTINGS.ryDriftDx*Math.sin(detectState.ry);
        _faceOffset[0] += _faceScale[0] * FACECUTSETTINGS.rzDriftDx*Math.sin(detectState.rz);
      }


      // public dynamic methods:
      const that = {
        // getters:
        get_faceScale: function(){
          return _faceScale;
        },
        get_faceOffset: function(){
          return _faceOffset;
        },
        get_rz: function(){
          return _rz;
        },

        bind_hueTexture: function(){
          GL.bindTexture(GL.TEXTURE_2D, _glHueTexture);
        },

        cut: function(detectState){
          GL.bindFramebuffer(__fboDrawTarget, __fbo); // for RTT
          GL.disable(GL.BLEND);

          // compute normalized detection parameters:
          compute_faceScaleOffset(detectState);

          // cut the face:
          GL.useProgram(__shps.faceCut.program);
          GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, _glFaceCutTexture, 0);
          GL.viewport(0, 0, specFaceCut.sizePx, specFaceCut.sizePx);
          GL.uniform1f(__shps.faceCut.uniforms.rz, -_rz);
          GL.uniform1f(__shps.faceCut.uniforms.aspectRatio, FACECUTSETTINGS.scale[0]/FACECUTSETTINGS.scale[1]);
          GL.uniform2fv(__shps.faceCut.uniforms.offset, _faceOffset);
          GL.uniform2fv(__shps.faceCut.uniforms.scale, _faceScale);
          GL.uniformMatrix2fv(__shps.faceCut.uniforms.videoTransformMat2, false, __videoTransformMat2);
          GL.bindTexture(GL.TEXTURE_2D, __glVideoTexture);
          fill_viewport();

          // compute the color correction texture:
          GL.useProgram(__shps.copy.program);
          GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, _glHueTexture, 0);
          GL.viewport(0, 0, specFaceCut.hueSizePx, specFaceCut.hueSizePx);
          GL.bindTexture(GL.TEXTURE_2D, _glFaceCutTexture);
          GL.generateMipmap(GL.TEXTURE_2D);
          fill_viewport();          
        }, //end cut()

        render: function(faceCutPos){ // render this faceCut on the same place than faceCutPos
          // set good blending: 
          GL.enable(GL.BLEND);
          GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
          GL.blendEquationSeparate( GL.FUNC_ADD, GL.FUNC_ADD );
          GL.blendFuncSeparate( GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE_MINUS_SRC_ALPHA );
          
          // compute normalized detection parameters:
          const faceScale = faceCutPos.get_faceScale();
          const faceOffset = faceCutPos.get_faceOffset();
          
          // play on the viewport to render at a specific position:
          const vpx = faceOffset[0]*__canvas.width; // in pixels
          const vpy = faceOffset[1]*__canvas.height;
          const vpw = faceScale[0]*__canvas.width;
          const vph = faceScale[1]*__canvas.height;
          GL.viewport(Math.round(vpx-vpw/2), Math.round(vpy-vph/2), Math.round(vpw), Math.round(vph));
          
          GL.useProgram(__shps.renderFace.program);
          GL.uniform1f(__shps.renderFace.uniforms.rz, _rz-faceCutPos.get_rz());
          GL.uniform1f(__shps.renderFace.uniforms.aspectRatio, FACECUTSETTINGS.scale[0]/FACECUTSETTINGS.scale[1]);


          GL.activeTexture(GL.TEXTURE2); // hue source
          GL.bindTexture(GL.TEXTURE_2D, _glHueTexture);
          GL.activeTexture(GL.TEXTURE1); // hue destination
          faceCutPos.bind_hueTexture();
          GL.activeTexture(GL.TEXTURE0); // faceCut image
          GL.bindTexture(GL.TEXTURE_2D, _glFaceCutTexture);

          fill_viewport();
          GL.disable(GL.BLEND);
        }

      }; //end that;
      return that;
    } //end instance()
  }; //end superThat
  return superThat;
})();


// Export ES6 module:
try {
  module.exports = JeelizFaceCut;
} catch(e){
  console.log('JeelizFaceCut ES6 Module not exported');
}