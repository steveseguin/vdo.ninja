"use strict";

THREE.FlexMaterial = function(spec){
  const _worldMatrixDelayed = new THREE['Matrix4']();

  //same handy function
  function mix(a,b,t){
    a.set(
      b.x*t+a.x*(1-t),
      b.y*t+a.y*(1-t),
      b.z*t+a.z*(1-t)
    );
  }
  
  //tweak shaders helpers
  function tweak_shaderAdd(code, chunk, glslCode){
    return code.replace(chunk, chunk + "\n" + glslCode);
  }
  function tweak_shaderDel(code, chunk){
    return code.replace(chunk, '');
  }
  function tweak_shaderRepl(code, chunk, glslCode){
    return code.replace(chunk, glslCode);
  }

  //get PHONG shader and tweak it :
  const phongShader = THREE.ShaderLib.phong;
  let vertexShaderSource = phongShader.vertexShader;
  vertexShaderSource = tweak_shaderAdd(vertexShaderSource, '#include <common>',
    'uniform mat4 modelMatrixDelayed;\n'
    +'uniform sampler2D flexMap;\n'
  );
  vertexShaderSource = tweak_shaderDel(vertexShaderSource, '#include <worldpos_vertex>');
  vertexShaderSource = tweak_shaderRepl(vertexShaderSource, '#include <project_vertex>',
    "vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n\
    vec4 worldPositionDelayed = modelMatrixDelayed * vec4( transformed, 1.0 );\n\
    worldPosition = mix(worldPosition, worldPositionDelayed, texture2D(flexMap, uv).r);\n\
    vec4 mvPosition = viewMatrix* worldPosition;\n\
    gl_Position = projectionMatrix * mvPosition;");

  const uniforms0 = {
    'modelMatrixDelayed': {
      'value': _worldMatrixDelayed
    },
    'flexMap': {
      value: spec.flexMap
    },
    'opacity': {
      value: (typeof(spec.opacity)!=='undefined') ? spec.opacity : 1
    }
  };
  const uniforms = Object.assign({}, phongShader.uniforms, uniforms0);
  
  const isMorphs = (spec.morphTargets) ? true : false;
  const mat = new THREE.ShaderMaterial({
    vertexShader: vertexShaderSource,
    fragmentShader: phongShader.fragmentShader,
    uniforms: uniforms,
    transparent: (spec.transparent) ? true : false,
    lights: true,
    morphTargets: isMorphs,
    morphNormals: isMorphs,

  });
  mat.flexMap = spec.flexMap;
  mat.opacity = mat.uniforms.opacity; // shortcut
 
  if (typeof(spec.map)!=='undefined') {
    uniforms.map = {value: spec.map};
    mat.map = spec.map;
  }
  if (typeof(spec.alphaMap)!=='undefined') {
    uniforms.alphaMap = {value: spec.alphaMap};
    mat.transparent = true;
    mat.alphaMap = spec.alphaMap;
  }

  if (typeof(spec.bumpMap)!=='undefined') {
    uniforms.bumpMap = {value: spec.bumpMap};
    mat.bumpMap = spec.bumpMap;
  }

  if (typeof(spec.bumpScale)!=='undefined') {
    uniforms.bumpScale = {value: spec.bumpScale};
    mat.bumpScale = spec.bumpScale;
  }

  if (typeof(spec.shininess)!=='undefined') {
    uniforms.shininess = {value: spec.shininess};
    mat.shininess = spec.shininess;
  }

  const _positionDelayed = new THREE.Vector3();
  const _scaleDelayed = new THREE.Vector3();
  const _eulerDelayed = new THREE['Euler']();
  let _initialized = false;

  mat.set_amortized = function(positionTarget, scaleTarget, eulerTarget, parentMatrix, amortization){
    if (!_initialized){
      if (positionTarget){
        _positionDelayed.copy(positionTarget);
      }
      if (scaleTarget){
        _scaleDelayed.copy(scaleTarget);
      }
      if (eulerTarget){
        _eulerDelayed.copy(eulerTarget);
      }
      _initialized = true;
    }

    if (eulerTarget){
      mix( _eulerDelayed, eulerTarget, amortization );
      _worldMatrixDelayed['makeRotationFromEuler'](_eulerDelayed);
    }
    
    if (positionTarget){
      mix( _positionDelayed, positionTarget, amortization );
      _worldMatrixDelayed['setPosition'](_positionDelayed);
    }

    if (scaleTarget){
      mix(_scaleDelayed, scaleTarget, amortization );
      _worldMatrixDelayed['scale'](_scaleDelayed);
    }

    if (parentMatrix){
      _worldMatrixDelayed.multiplyMatrices(parentMatrix, _worldMatrixDelayed);
    }
  }

  return mat;
};
