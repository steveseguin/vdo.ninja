var THREEx    = THREEx || {}

THREEx.GeometricGlowMesh    = function(mesh){
    var object3d    = new THREE.Object3D

    var geometry    = mesh.geometry.clone()
    THREEx.dilateGeometry(geometry, 0.01)
    var material    = THREEx.createAtmosphereMaterial()
    material.uniforms.glowColor.value    = new THREE.Color('cyan')
    material.uniforms.coeficient.value    = 1.1
    material.uniforms.power.value        = 1.4
    var insideMesh    = new THREE.Mesh(geometry, material );
    object3d.add( insideMesh );


    var geometry    = mesh.geometry.clone()
    THREEx.dilateGeometry(geometry, 0.1)
    var material    = THREEx.createAtmosphereMaterial()
    material.uniforms.glowColor.value    = new THREE.Color('cyan')
    material.uniforms.coeficient.value    = 0.1
    material.uniforms.power.value        = 1.2
    material.side    = THREE.BackSide
    var outsideMesh    = new THREE.Mesh( geometry, material );
    object3d.add( outsideMesh );

    // expose a few variable
    this.object3d    = object3d
    this.insideMesh    = insideMesh
    this.outsideMesh= outsideMesh
}
