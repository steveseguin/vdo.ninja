var THREEx = THREEx || {}

/**
 * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
 * @return {[type]} [description]
 */
THREEx.createAtmosphereMaterial    = function(){
    var vertexShader    = [
        'varying vec3    vVertexWorldPosition;',
        'varying vec3    vVertexNormal;',

        'varying vec4    vFragColor;',

        'void main(){',
        '    vVertexNormal    = normalize(normalMatrix * normal);',

        '    vVertexWorldPosition    = (modelMatrix * vec4(position, 1.0)).xyz;',

        '    // set gl_Position',
        '    gl_Position    = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}',

        ].join('\n')
    var fragmentShader    = [
        'uniform vec3    glowColor;',
        'uniform float    coeficient;',
        'uniform float    power;',

        'varying vec3    vVertexNormal;',
        'varying vec3    vVertexWorldPosition;',

        'varying vec4    vFragColor;',

        'void main(){',
        '    vec3 worldCameraToVertex= vVertexWorldPosition - cameraPosition;',
        '    vec3 viewCameraToVertex    = (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;',
        '    viewCameraToVertex    = normalize(viewCameraToVertex);',
        '    float intensity        = pow(abs(coeficient + dot(vVertexNormal, viewCameraToVertex)), power);',
        '    gl_FragColor        = vec4(glowColor, intensity);',
        '}',
    ].join('\n')

    // create custom material from the shader code above
    //   that is within specially labeled script tags
    var material    = new THREE.ShaderMaterial({
        uniforms: { 
            coeficient    : {
                type    : "f", 
                value    : 1.0
            },
            power        : {
                type    : "f",
                value    : 2
            },
            glowColor    : {
                type    : "c",
                value    : new THREE.Color('pink')
            },
        },
        vertexShader    : vertexShader,
        fragmentShader    : fragmentShader,
        //blending    : THREE.AdditiveBlending,
        transparent    : true,
        depthWrite    : false,
    });
    return material
}