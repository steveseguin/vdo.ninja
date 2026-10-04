"use strict";
var THREE={}; 
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 */

THREE.Quaternion = function ( x, y, z, w ) {

    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._w = ( w !== undefined ) ? w : 1;

};

THREE.Quaternion.prototype = {

    constructor: THREE.Quaternion,

    get x () {

        return this._x;

    },

    set x ( value ) {

        this._x = value;
        this.onChangeCallback();

    },

    get y () {

        return this._y;

    },

    set y ( value ) {

        this._y = value;
        this.onChangeCallback();

    },

    get z () {

        return this._z;

    },

    set z ( value ) {

        this._z = value;
        this.onChangeCallback();

    },

    get w () {

        return this._w;

    },

    set w ( value ) {

        this._w = value;
        this.onChangeCallback();

    },

    set: function ( x, y, z, w ) {

        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;

        this.onChangeCallback();

        return this;

    },

    clone: function () {

        return new this.constructor( this._x, this._y, this._z, this._w );

    },

    copy: function ( quaternion ) {

        this._x = quaternion.x;
        this._y = quaternion.y;
        this._z = quaternion.z;
        this._w = quaternion.w;

        this.onChangeCallback();

        return this;

    },

    setFromEuler: function ( euler, update ) {

        if ( euler instanceof THREE.Euler === false ) {

            throw new Error( 'THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

        }

        // http://www.mathworks.com/matlabcentral/fileexchange/
        //     20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //    content/SpinCalc.m

        var c1 = Math.cos( euler._x / 2 );
        var c2 = Math.cos( euler._y / 2 );
        var c3 = Math.cos( euler._z / 2 );
        var s1 = Math.sin( euler._x / 2 );
        var s2 = Math.sin( euler._y / 2 );
        var s3 = Math.sin( euler._z / 2 );

        var order = euler.order;

        if ( order === 'XYZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( order === 'YXZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if ( order === 'ZXY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( order === 'ZYX' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if ( order === 'YZX' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( order === 'XZY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        }

        if ( update !== false ) this.onChangeCallback();

        return this;

    },

    setFromAxisAngle: function ( axis, angle ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

        // assumes axis is normalized

        var halfAngle = angle / 2, s = Math.sin( halfAngle );

        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos( halfAngle );

        this.onChangeCallback();

        return this;

    },

    setFromRotationMatrix: function ( m ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var te = m.elements,

            m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
            m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
            m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

            trace = m11 + m22 + m33,
            s;

        if ( trace > 0 ) {

            s = 0.5 / Math.sqrt( trace + 1.0 );

            this._w = 0.25 / s;
            this._x = ( m32 - m23 ) * s;
            this._y = ( m13 - m31 ) * s;
            this._z = ( m21 - m12 ) * s;

        } else if ( m11 > m22 && m11 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

            this._w = ( m32 - m23 ) / s;
            this._x = 0.25 * s;
            this._y = ( m12 + m21 ) / s;
            this._z = ( m13 + m31 ) / s;

        } else if ( m22 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

            this._w = ( m13 - m31 ) / s;
            this._x = ( m12 + m21 ) / s;
            this._y = 0.25 * s;
            this._z = ( m23 + m32 ) / s;

        } else {

            s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

            this._w = ( m21 - m12 ) / s;
            this._x = ( m13 + m31 ) / s;
            this._y = ( m23 + m32 ) / s;
            this._z = 0.25 * s;

        }

        this.onChangeCallback();

        return this;

    },

    setFromUnitVectors: function () {

        // http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

        // assumes direction vectors vFrom and vTo are normalized

        var v1, r;

        var EPS = 0.000001;

        return function ( vFrom, vTo ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            r = vFrom.dot( vTo ) + 1;

            if ( r < EPS ) {

                r = 0;

                if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

                    v1.set( - vFrom.y, vFrom.x, 0 );

                } else {

                    v1.set( 0, - vFrom.z, vFrom.y );

                }

            } else {

                v1.crossVectors( vFrom, vTo );

            }

            this._x = v1.x;
            this._y = v1.y;
            this._z = v1.z;
            this._w = r;

            this.normalize();

            return this;

        }

    }(),

    inverse: function () {

        this.conjugate().normalize();

        return this;

    },

    conjugate: function () {

        this._x *= - 1;
        this._y *= - 1;
        this._z *= - 1;

        this.onChangeCallback();

        return this;

    },

    dot: function ( v ) {

        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

    },

    lengthSq: function () {

        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

    },

    length: function () {

        return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

    },

    normalize: function () {

        var l = this.length();

        if ( l === 0 ) {

            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;

        } else {

            l = 1 / l;

            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;

        }

        this.onChangeCallback();

        return this;

    },

    multiply: function ( q, p ) {

        if ( p !== undefined ) {

            console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
            return this.multiplyQuaternions( q, p );

        }

        return this.multiplyQuaternions( this, q );

    },

    multiplyQuaternions: function ( a, b ) {

        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

        var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
        var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        this.onChangeCallback();

        return this;

    },

    multiplyVector3: function ( vector ) {

        console.warn( 'THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
        return vector.applyQuaternion( this );

    },

    slerp: function ( qb, t ) {

        if ( t === 0 ) return this;
        if ( t === 1 ) return this.copy( qb );

        var x = this._x, y = this._y, z = this._z, w = this._w;

        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

        var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        if ( cosHalfTheta < 0 ) {

            this._w = - qb._w;
            this._x = - qb._x;
            this._y = - qb._y;
            this._z = - qb._z;

            cosHalfTheta = - cosHalfTheta;

        } else {

            this.copy( qb );

        }

        if ( cosHalfTheta >= 1.0 ) {

            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;

            return this;

        }

        var halfTheta = Math.acos( cosHalfTheta );
        var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

        if ( Math.abs( sinHalfTheta ) < 0.001 ) {

            this._w = 0.5 * ( w + this._w );
            this._x = 0.5 * ( x + this._x );
            this._y = 0.5 * ( y + this._y );
            this._z = 0.5 * ( z + this._z );

            return this;

        }

        var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
        ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

        this._w = ( w * ratioA + this._w * ratioB );
        this._x = ( x * ratioA + this._x * ratioB );
        this._y = ( y * ratioA + this._y * ratioB );
        this._z = ( z * ratioA + this._z * ratioB );

        this.onChangeCallback();

        return this;

    },

    equals: function ( quaternion ) {

        return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        this._x = array[ offset ];
        this._y = array[ offset + 1 ];
        this._z = array[ offset + 2 ];
        this._w = array[ offset + 3 ];

        this.onChangeCallback();

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        array[ offset ] = this._x;
        array[ offset + 1 ] = this._y;
        array[ offset + 2 ] = this._z;
        array[ offset + 3 ] = this._w;

        return array;

    },

    onChange: function ( callback ) {

        this.onChangeCallback = callback;

        return this;

    },

    onChangeCallback: function () {}

};

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

    return qm.copy( qa ).slerp( qb, t );

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

    this.x = x || 0;
    this.y = y || 0;

};

THREE.Vector2.prototype = {

    constructor: THREE.Vector2,

    get width() { return this.x },
    set width( value ) { this.x = value },

    get height() { return this.y },
    set height( value ) { this.y = value },

    //

    set: function ( x, y ) {

        this.x = x;
        this.y = y;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },

    setComponent: function ( index, value ) {

        switch ( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            default: throw new Error( 'index is out of range: ' + index );

        }

    },

    getComponent: function ( index ) {

        switch ( index ) {

            case 0: return this.x;
            case 1: return this.y;
            default: throw new Error( 'index is out of range: ' + index );

        }

    },

    clone: function () {

        return new this.constructor( this.x, this.y );

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;

        return this;

    },

    add: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );

        }

        this.x += v.x;
        this.y += v.y;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;

    },

    addScaledVector: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;

        return this;

    },

    sub: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );

        }

        this.x -= v.x;
        this.y -= v.y;

        return this;

    },

    subScalar: function ( s ) {

        this.x -= s;
        this.y -= s;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;

    },

    multiply: function ( v ) {

        this.x *= v.x;
        this.y *= v.y;

        return this;

    },

    multiplyScalar: function ( scalar ) {

        if ( isFinite( scalar ) ) {
            this.x *= scalar;
            this.y *= scalar;
        } else {
            this.x = 0;
            this.y = 0;
        }

        return this;

    },

    divide: function ( v ) {

        this.x /= v.x;
        this.y /= v.y;

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    min: function ( v ) {

        this.x = Math.min( this.x, v.x );
        this.y = Math.min( this.y, v.y );

        return this;

    },

    max: function ( v ) {

        this.x = Math.max( this.x, v.x );
        this.y = Math.max( this.y, v.y );

        return this;

    },

    clamp: function ( min, max ) {

        // This function assumes min < max, if this assumption isn't true it will not operate correctly

        this.x = Math.max( min.x, Math.min( max.x, this.x ) );
        this.y = Math.max( min.y, Math.min( max.y, this.y ) );

        return this;

    },

    clampScalar: function () {

        var min, max;

        return function clampScalar( minVal, maxVal ) {

            if ( min === undefined ) {

                min = new THREE.Vector2();
                max = new THREE.Vector2();

            }

            min.set( minVal, minVal );
            max.set( maxVal, maxVal );

            return this.clamp( min, max );

        };

    }(),

    clampLength: function ( min, max ) {

        var length = this.length();

        this.multiplyScalar( Math.max( min, Math.min( max, length ) ) / length );

        return this;

    },

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

        return this;

    },

    negate: function () {

        this.x = - this.x;
        this.y = - this.y;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    },

    lengthManhattan: function() {

        return Math.abs( this.x ) + Math.abs( this.y );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    distanceTo: function ( v ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    },

    distanceToSquared: function ( v ) {

        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;

    },

    setLength: function ( length ) {

        return this.multiplyScalar( length / this.length() );

    },

    lerp: function ( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;

        return this;

    },

    lerpVectors: function ( v1, v2, alpha ) {

        this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

        return this;

    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) );

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        this.x = array[ offset ];
        this.y = array[ offset + 1 ];

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;

        return array;

    },

    fromAttribute: function ( attribute, index, offset ) {

        if ( offset === undefined ) offset = 0;

        index = index * attribute.itemSize + offset;

        this.x = attribute.array[ index ];
        this.y = attribute.array[ index + 1 ];

        return this;

    },

    rotateAround: function ( center, angle ) {

        var c = Math.cos( angle ), s = Math.sin( angle );

        var x = this.x - center.x;
        var y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;

        return this;

    }

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector3 = function ( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

};

THREE.Vector3.prototype = {

    constructor: THREE.Vector3,

    set: function ( x, y, z ) {

        this.x = x;
        this.y = y;
        this.z = z;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },

    setZ: function ( z ) {

        this.z = z;

        return this;

    },

    setComponent: function ( index, value ) {

        switch ( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            case 2: this.z = value; break;
            default: throw new Error( 'index is out of range: ' + index );

        }

    },

    getComponent: function ( index ) {

        switch ( index ) {

            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            default: throw new Error( 'index is out of range: ' + index );

        }

    },

    clone: function () {

        return new this.constructor( this.x, this.y, this.z );

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;

    },

    add: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );

        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;
        this.z += s;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;

    },

    addScaledVector: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;

        return this;

    },

    sub: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );

        }

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;

    },

    subScalar: function ( s ) {

        this.x -= s;
        this.y -= s;
        this.z -= s;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;

    },

    multiply: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
            return this.multiplyVectors( v, w );

        }

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;

        return this;

    },

    multiplyScalar: function ( scalar ) {

        if ( isFinite( scalar ) ) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;

    },

    multiplyVectors: function ( a, b ) {

        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;

        return this;

    },

    applyEuler: function () {

        var quaternion;

        return function applyEuler( euler ) {

            if ( euler instanceof THREE.Euler === false ) {

                console.error( 'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );

            }

            if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

            this.applyQuaternion( quaternion.setFromEuler( euler ) );

            return this;

        };

    }(),

    applyAxisAngle: function () {

        var quaternion;

        return function applyAxisAngle( axis, angle ) {

            if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

            this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

            return this;

        };

    }(),

    applyMatrix3: function ( m ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        var e = m.elements;

        this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
        this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
        this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

        return this;

    },

    applyMatrix4: function ( m ) {

        // input: THREE.Matrix4 affine matrix

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;

        this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
        this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
        this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

        return this;

    },

    applyProjection: function ( m ) {

        // input: THREE.Matrix4 projection matrix

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;
        var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

        this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d;
        this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d;
        this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;

        return this;

    },

    applyQuaternion: function ( q ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vector

        var ix =  qw * x + qy * z - qz * y;
        var iy =  qw * y + qz * x - qx * z;
        var iz =  qw * z + qx * y - qy * x;
        var iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return this;

    },

    project: function () {

        var matrix;

        return function project( camera ) {

            if ( matrix === undefined ) matrix = new THREE.Matrix4();

            matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
            return this.applyProjection( matrix );

        };

    }(),

    unproject: function () {

        var matrix;

        return function unproject( camera ) {

            if ( matrix === undefined ) matrix = new THREE.Matrix4();

            matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
            return this.applyProjection( matrix );

        };

    }(),

    transformDirection: function ( m ) {

        // input: THREE.Matrix4 affine matrix
        // vector interpreted as a direction

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;

        this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
        this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
        this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

        this.normalize();

        return this;

    },

    divide: function ( v ) {

        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    min: function ( v ) {

        this.x = Math.min( this.x, v.x );
        this.y = Math.min( this.y, v.y );
        this.z = Math.min( this.z, v.z );

        return this;

    },

    max: function ( v ) {

        this.x = Math.max( this.x, v.x );
        this.y = Math.max( this.y, v.y );
        this.z = Math.max( this.z, v.z );

        return this;

    },

    clamp: function ( min, max ) {

        // This function assumes min < max, if this assumption isn't true it will not operate correctly

        this.x = Math.max( min.x, Math.min( max.x, this.x ) );
        this.y = Math.max( min.y, Math.min( max.y, this.y ) );
        this.z = Math.max( min.z, Math.min( max.z, this.z ) );

        return this;

    },

    clampScalar: function () {

        var min, max;

        return function clampScalar( minVal, maxVal ) {

            if ( min === undefined ) {

                min = new THREE.Vector3();
                max = new THREE.Vector3();

            }

            min.set( minVal, minVal, minVal );
            max.set( maxVal, maxVal, maxVal );

            return this.clamp( min, max );

        };

    }(),

    clampLength: function ( min, max ) {

        var length = this.length();

        this.multiplyScalar( Math.max( min, Math.min( max, length ) ) / length );

        return this;

    },

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
        this.z = Math.floor( this.z );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );
        this.z = Math.ceil( this.z );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );
        this.z = Math.round( this.z );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
        this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

        return this;

    },

    negate: function () {

        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    },

    lengthManhattan: function () {

        return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    setLength: function ( length ) {

        return this.multiplyScalar( length / this.length() );

    },

    lerp: function ( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        this.z += ( v.z - this.z ) * alpha;

        return this;

    },

    lerpVectors: function ( v1, v2, alpha ) {

        this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

        return this;

    },

    cross: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
            return this.crossVectors( v, w );

        }

        var x = this.x, y = this.y, z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;

        return this;

    },

    crossVectors: function ( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    projectOnVector: function () {

        var v1, dot;

        return function projectOnVector( vector ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            v1.copy( vector ).normalize();

            dot = this.dot( v1 );

            return this.copy( v1 ).multiplyScalar( dot );

        };

    }(),

    projectOnPlane: function () {

        var v1;

        return function projectOnPlane( planeNormal ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            v1.copy( this ).projectOnVector( planeNormal );

            return this.sub( v1 );

        }

    }(),

    reflect: function () {

        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length

        var v1;

        return function reflect( normal ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

        }

    }(),

    angleTo: function ( v ) {

        var theta = this.dot( v ) / ( this.length() * v.length() );

        // clamp, to handle numerical problems

        return Math.acos( THREE.Math.clamp( theta, - 1, 1 ) );

    },

    distanceTo: function ( v ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    },

    distanceToSquared: function ( v ) {

        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;

    },

    setEulerFromRotationMatrix: function ( m, order ) {

        console.error( 'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );

    },

    setEulerFromQuaternion: function ( q, order ) {

        console.error( 'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );

    },

    getPositionFromMatrix: function ( m ) {

        console.warn( 'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );

        return this.setFromMatrixPosition( m );

    },

    getScaleFromMatrix: function ( m ) {

        console.warn( 'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );

        return this.setFromMatrixScale( m );

    },

    getColumnFromMatrix: function ( index, matrix ) {

        console.warn( 'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );

        return this.setFromMatrixColumn( index, matrix );

    },

    setFromMatrixPosition: function ( m ) {

        this.x = m.elements[ 12 ];
        this.y = m.elements[ 13 ];
        this.z = m.elements[ 14 ];

        return this;

    },

    setFromMatrixScale: function ( m ) {

        var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[ 2 ] ).length();
        var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[ 6 ] ).length();
        var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

        this.x = sx;
        this.y = sy;
        this.z = sz;

        return this;

    },

    setFromMatrixColumn: function ( index, matrix ) {

        var offset = index * 4;

        var me = matrix.elements;

        this.x = me[ offset ];
        this.y = me[ offset + 1 ];
        this.z = me[ offset + 2 ];

        return this;

    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        this.x = array[ offset ];
        this.y = array[ offset + 1 ];
        this.z = array[ offset + 2 ];

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;

        return array;

    },

    fromAttribute: function ( attribute, index, offset ) {

        if ( offset === undefined ) offset = 0;

        index = index * attribute.itemSize + offset;

        this.x = attribute.array[ index ];
        this.y = attribute.array[ index + 1 ];
        this.z = attribute.array[ index + 2 ];

        return this;

    }

};
/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector4 = function ( x, y, z, w ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

    constructor: THREE.Vector4,

    set: function ( x, y, z, w ) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },

    setZ: function ( z ) {

        this.z = z;

        return this;

    },

    setW: function ( w ) {

        this.w = w;

        return this;

    },

    setComponent: function ( index, value ) {

        switch ( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            case 2: this.z = value; break;
            case 3: this.w = value; break;
            default: throw new Error( 'index is out of range: ' + index );

        }

    },

    getComponent: function ( index ) {

        switch ( index ) {

            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            case 3: return this.w;
            default: throw new Error( 'index is out of range: ' + index );

        }

    },

    clone: function () {

        return new this.constructor( this.x, this.y, this.z, this.w );

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = ( v.w !== undefined ) ? v.w : 1;

        return this;

    },

    add: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );

        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;

        return this;

    },

    addScaledVector: function ( v, s ) {

        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        this.w += v.w * s;

        return this;

    },

    sub: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );

        }

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;

        return this;

    },

    subScalar: function ( s ) {

        this.x -= s;
        this.y -= s;
        this.z -= s;
        this.w -= s;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;

        return this;

    },

    multiplyScalar: function ( scalar ) {

        if ( isFinite( scalar ) ) {
            this.x *= scalar;
            this.y *= scalar;
            this.z *= scalar;
            this.w *= scalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        }

        return this;

    },

    applyMatrix4: function ( m ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        var e = m.elements;

        this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
        this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
        this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
        this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

        return this;

    },

    divideScalar: function ( scalar ) {

        return this.multiplyScalar( 1 / scalar );

    },

    setAxisAngleFromQuaternion: function ( q ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

        // q is assumed to be normalized

        this.w = 2 * Math.acos( q.w );

        var s = Math.sqrt( 1 - q.w * q.w );

        if ( s < 0.0001 ) {

             this.x = 1;
             this.y = 0;
             this.z = 0;

        } else {

             this.x = q.x / s;
             this.y = q.y / s;
             this.z = q.z / s;

        }

        return this;

    },

    setAxisAngleFromRotationMatrix: function ( m ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var angle, x, y, z,        // variables for result
            epsilon = 0.01,        // margin to allow for rounding errors
            epsilon2 = 0.1,        // margin to distinguish between 0 and 180 degrees

            te = m.elements,

            m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
            m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
            m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

        if ( ( Math.abs( m12 - m21 ) < epsilon )
           && ( Math.abs( m13 - m31 ) < epsilon )
           && ( Math.abs( m23 - m32 ) < epsilon ) ) {

            // singularity found
            // first check for identity matrix which must have +1 for all terms
            // in leading diagonal and zero in other terms

            if ( ( Math.abs( m12 + m21 ) < epsilon2 )
               && ( Math.abs( m13 + m31 ) < epsilon2 )
               && ( Math.abs( m23 + m32 ) < epsilon2 )
               && ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

                // this singularity is identity matrix so angle = 0

                this.set( 1, 0, 0, 0 );

                return this; // zero angle, arbitrary axis

            }

            // otherwise this singularity is angle = 180

            angle = Math.PI;

            var xx = ( m11 + 1 ) / 2;
            var yy = ( m22 + 1 ) / 2;
            var zz = ( m33 + 1 ) / 2;
            var xy = ( m12 + m21 ) / 4;
            var xz = ( m13 + m31 ) / 4;
            var yz = ( m23 + m32 ) / 4;

            if ( ( xx > yy ) && ( xx > zz ) ) {

                // m11 is the largest diagonal term

                if ( xx < epsilon ) {

                    x = 0;
                    y = 0.707106781;
                    z = 0.707106781;

                } else {

                    x = Math.sqrt( xx );
                    y = xy / x;
                    z = xz / x;

                }

            } else if ( yy > zz ) {

                // m22 is the largest diagonal term

                if ( yy < epsilon ) {

                    x = 0.707106781;
                    y = 0;
                    z = 0.707106781;

                } else {

                    y = Math.sqrt( yy );
                    x = xy / y;
                    z = yz / y;

                }

            } else {

                // m33 is the largest diagonal term so base result on this

                if ( zz < epsilon ) {

                    x = 0.707106781;
                    y = 0.707106781;
                    z = 0;

                } else {

                    z = Math.sqrt( zz );
                    x = xz / z;
                    y = yz / z;

                }

            }

            this.set( x, y, z, angle );

            return this; // return 180 deg rotation

        }

        // as we have reached here there are no singularities so we can handle normally

        var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 )
                          + ( m13 - m31 ) * ( m13 - m31 )
                          + ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

        if ( Math.abs( s ) < 0.001 ) s = 1;

        // prevent divide by zero, should not happen if matrix is orthogonal and should be
        // caught by singularity test above, but I've left it in just in case

        this.x = ( m32 - m23 ) / s;
        this.y = ( m13 - m31 ) / s;
        this.z = ( m21 - m12 ) / s;
        this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

        return this;

    },

    min: function ( v ) {

        this.x = Math.min( this.x, v.x );
        this.y = Math.min( this.y, v.y );
        this.z = Math.min( this.z, v.z );
        this.w = Math.min( this.w, v.w );

        return this;

    },

    max: function ( v ) {

        this.x = Math.max( this.x, v.x );
        this.y = Math.max( this.y, v.y );
        this.z = Math.max( this.z, v.z );
        this.w = Math.max( this.w, v.w );

        return this;

    },

    clamp: function ( min, max ) {

        // This function assumes min < max, if this assumption isn't true it will not operate correctly

        this.x = Math.max( min.x, Math.min( max.x, this.x ) );
        this.y = Math.max( min.y, Math.min( max.y, this.y ) );
        this.z = Math.max( min.z, Math.min( max.z, this.z ) );
        this.w = Math.max( min.w, Math.min( max.w, this.w ) );

        return this;

    },

    clampScalar: function () {

        var min, max;

        return function clampScalar( minVal, maxVal ) {

            if ( min === undefined ) {

                min = new THREE.Vector4();
                max = new THREE.Vector4();

            }

            min.set( minVal, minVal, minVal, minVal );
            max.set( maxVal, maxVal, maxVal, maxVal );

            return this.clamp( min, max );

        };

    }(),

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
        this.z = Math.floor( this.z );
        this.w = Math.floor( this.w );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );
        this.z = Math.ceil( this.z );
        this.w = Math.ceil( this.w );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );
        this.z = Math.round( this.z );
        this.w = Math.round( this.w );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
        this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
        this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

        return this;

    },

    negate: function () {

        this.x = - this.x;
        this.y = - this.y;
        this.z = - this.z;
        this.w = - this.w;

        return this;

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

    },

    lengthManhattan: function () {

        return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    setLength: function ( length ) {

        return this.multiplyScalar( length / this.length() );

    },

    lerp: function ( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        this.z += ( v.z - this.z ) * alpha;
        this.w += ( v.w - this.w ) * alpha;

        return this;

    },

    lerpVectors: function ( v1, v2, alpha ) {

        this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

        return this;

    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

    },

    fromArray: function ( array, offset ) {

        if ( offset === undefined ) offset = 0;

        this.x = array[ offset ];
        this.y = array[ offset + 1 ];
        this.z = array[ offset + 2 ];
        this.w = array[ offset + 3 ];

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        array[ offset ] = this.x;
        array[ offset + 1 ] = this.y;
        array[ offset + 2 ] = this.z;
        array[ offset + 3 ] = this.w;

        return array;

    },

    fromAttribute: function ( attribute, index, offset ) {

        if ( offset === undefined ) offset = 0;

        index = index * attribute.itemSize + offset;

        this.x = attribute.array[ index ];
        this.y = attribute.array[ index + 1 ];
        this.z = attribute.array[ index + 2 ];
        this.w = attribute.array[ index + 3 ];

        return this;

    }

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 */

THREE.Euler = function ( x, y, z, order ) {

    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._order = order || THREE.Euler.DefaultOrder;

};

THREE.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREE.Euler.DefaultOrder = 'XYZ';

THREE.Euler.prototype = {

    constructor: THREE.Euler,

    get x () {

        return this._x;

    },

    set x ( value ) {

        this._x = value;
        this.onChangeCallback();

    },

    get y () {

        return this._y;

    },

    set y ( value ) {

        this._y = value;
        this.onChangeCallback();

    },

    get z () {

        return this._z;

    },

    set z ( value ) {

        this._z = value;
        this.onChangeCallback();

    },

    get order () {

        return this._order;

    },

    set order ( value ) {

        this._order = value;
        this.onChangeCallback();

    },

    set: function ( x, y, z, order ) {

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order || this._order;

        this.onChangeCallback();

        return this;

    },

    clone: function () {

        return new this.constructor( this._x, this._y, this._z, this._order);

    },

    copy: function ( euler ) {

        this._x = euler._x;
        this._y = euler._y;
        this._z = euler._z;
        this._order = euler._order;

        this.onChangeCallback();

        return this;

    },

    setFromRotationMatrix: function ( m, order, update ) {

        var clamp = THREE.Math.clamp;

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var te = m.elements;
        var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
        var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
        var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

        order = order || this._order;

        if ( order === 'XYZ' ) {

            this._y = Math.asin( clamp( m13, - 1, 1 ) );

            if ( Math.abs( m13 ) < 0.99999 ) {

                this._x = Math.atan2( - m23, m33 );
                this._z = Math.atan2( - m12, m11 );

            } else {

                this._x = Math.atan2( m32, m22 );
                this._z = 0;

            }

        } else if ( order === 'YXZ' ) {

            this._x = Math.asin( - clamp( m23, - 1, 1 ) );

            if ( Math.abs( m23 ) < 0.99999 ) {

                this._y = Math.atan2( m13, m33 );
                this._z = Math.atan2( m21, m22 );

            } else {

                this._y = Math.atan2( - m31, m11 );
                this._z = 0;

            }

        } else if ( order === 'ZXY' ) {

            this._x = Math.asin( clamp( m32, - 1, 1 ) );

            if ( Math.abs( m32 ) < 0.99999 ) {

                this._y = Math.atan2( - m31, m33 );
                this._z = Math.atan2( - m12, m22 );

            } else {

                this._y = 0;
                this._z = Math.atan2( m21, m11 );

            }

        } else if ( order === 'ZYX' ) {

            this._y = Math.asin( - clamp( m31, - 1, 1 ) );

            if ( Math.abs( m31 ) < 0.99999 ) {

                this._x = Math.atan2( m32, m33 );
                this._z = Math.atan2( m21, m11 );

            } else {

                this._x = 0;
                this._z = Math.atan2( - m12, m22 );

            }

        } else if ( order === 'YZX' ) {

            this._z = Math.asin( clamp( m21, - 1, 1 ) );

            if ( Math.abs( m21 ) < 0.99999 ) {

                this._x = Math.atan2( - m23, m22 );
                this._y = Math.atan2( - m31, m11 );

            } else {

                this._x = 0;
                this._y = Math.atan2( m13, m33 );

            }

        } else if ( order === 'XZY' ) {

            this._z = Math.asin( - clamp( m12, - 1, 1 ) );

            if ( Math.abs( m12 ) < 0.99999 ) {

                this._x = Math.atan2( m32, m22 );
                this._y = Math.atan2( m13, m11 );

            } else {

                this._x = Math.atan2( - m23, m33 );
                this._y = 0;

            }

        } else {

            console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order )

        }

        this._order = order;

        if ( update !== false ) this.onChangeCallback();

        return this;

    },

    setFromQuaternion: function () {

        var matrix;

        return function ( q, order, update ) {

            if ( matrix === undefined ) matrix = new THREE.Matrix4();
            matrix.makeRotationFromQuaternion( q );
            this.setFromRotationMatrix( matrix, order, update );

            return this;

        };

    }(),

    setFromVector3: function ( v, order ) {

        return this.set( v.x, v.y, v.z, order || this._order );

    },

    reorder: function () {

        // WARNING: this discards revolution information -bhouston

        var q = new THREE.Quaternion();

        return function ( newOrder ) {

            q.setFromEuler( this );
            this.setFromQuaternion( q, newOrder );

        };

    }(),

    equals: function ( euler ) {

        return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

    },

    fromArray: function ( array ) {

        this._x = array[ 0 ];
        this._y = array[ 1 ];
        this._z = array[ 2 ];
        if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

        this.onChangeCallback();

        return this;

    },

    toArray: function ( array, offset ) {

        if ( array === undefined ) array = [];
        if ( offset === undefined ) offset = 0;

        array[ offset ] = this._x;
        array[ offset + 1 ] = this._y;
        array[ offset + 2 ] = this._z;
        array[ offset + 3 ] = this._order;

        return array;

    },

    toVector3: function ( optionalResult ) {

        if ( optionalResult ) {

            return optionalResult.set( this._x, this._y, this._z );

        } else {

            return new THREE.Vector3( this._x, this._y, this._z );

        }

    },

    onChange: function ( callback ) {

        this.onChangeCallback = callback;

        return this;

    },

    onChangeCallback: function () {}

};
/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 */

THREE.Matrix3 = function () {

    this.elements = new Float32Array( [

        1, 0, 0,
        0, 1, 0,
        0, 0, 1

    ] );

    if ( arguments.length > 0 ) {

        console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

    }

};

THREE.Matrix3.prototype = {

    constructor: THREE.Matrix3,

    set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

        var te = this.elements;

        te[ 0 ] = n11; te[ 3 ] = n12; te[ 6 ] = n13;
        te[ 1 ] = n21; te[ 4 ] = n22; te[ 7 ] = n23;
        te[ 2 ] = n31; te[ 5 ] = n32; te[ 8 ] = n33;

        return this;

    },

    identity: function () {

        this.set(

            1, 0, 0,
            0, 1, 0,
            0, 0, 1

        );

        return this;

    },

    clone: function () {

        return new this.constructor().fromArray( this.elements );

    },

    copy: function ( m ) {

        var me = m.elements;

        this.set(

            me[ 0 ], me[ 3 ], me[ 6 ],
            me[ 1 ], me[ 4 ], me[ 7 ],
            me[ 2 ], me[ 5 ], me[ 8 ]

        );

        return this;

    },

    multiplyVector3: function ( vector ) {

        console.warn( 'THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.' );
        return vector.applyMatrix3( this );

    },

    multiplyVector3Array: function ( a ) {

        console.warn( 'THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
        return this.applyToVector3Array( a );

    },

    applyToVector3Array: function () {

        var v1;

        return function ( array, offset, length ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();
            if ( offset === undefined ) offset = 0;
            if ( length === undefined ) length = array.length;

            for ( var i = 0, j = offset; i < length; i += 3, j += 3 ) {

                v1.fromArray( array, j );
                v1.applyMatrix3( this );
                v1.toArray( array, j );

            }

            return array;

        };

    }(),

    applyToBuffer: function () {

        var v1;

        return function applyToBuffer( buffer, offset, length ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();
            if ( offset === undefined ) offset = 0;
            if ( length === undefined ) length = buffer.length / buffer.itemSize;

            for ( var i = 0, j = offset; i < length; i ++, j ++ ) {

                v1.x = buffer.getX( j );
                v1.y = buffer.getY( j );
                v1.z = buffer.getZ( j );

                v1.applyMatrix3( this );

                buffer.setXYZ( v1.x, v1.y, v1.z );

            }

            return buffer;

        };

    }(),

    multiplyScalar: function ( s ) {

        var te = this.elements;

        te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
        te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
        te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

        return this;

    },

    determinant: function () {

        var te = this.elements;

        var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
            d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
            g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

    },

    getInverse: function ( matrix, throwOnInvertible ) {

        // input: THREE.Matrix4
        // ( based on http://code.google.com/p/webgl-mjs/ )

        var me = matrix.elements;
        var te = this.elements;

        te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
        te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
        te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
        te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
        te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
        te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
        te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
        te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
        te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

        var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

        // no inverse

        if ( det === 0 ) {

            var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

            if ( throwOnInvertible || false ) {

                throw new Error( msg );

            } else {

                console.warn( msg );

            }

            this.identity();

            return this;

        }

        this.multiplyScalar( 1.0 / det );

        return this;

    },

    transpose: function () {

        var tmp, m = this.elements;

        tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
        tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
        tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

        return this;

    },

    flattenToArrayOffset: function ( array, offset ) {

        var te = this.elements;

        array[ offset ] = te[ 0 ];
        array[ offset + 1 ] = te[ 1 ];
        array[ offset + 2 ] = te[ 2 ];

        array[ offset + 3 ] = te[ 3 ];
        array[ offset + 4 ] = te[ 4 ];
        array[ offset + 5 ] = te[ 5 ];

        array[ offset + 6 ] = te[ 6 ];
        array[ offset + 7 ] = te[ 7 ];
        array[ offset + 8 ]  = te[ 8 ];

        return array;

    },

    getNormalMatrix: function ( m ) {

        // input: THREE.Matrix4

        this.getInverse( m ).transpose();

        return this;

    },

    transposeIntoArray: function ( r ) {

        var m = this.elements;

        r[ 0 ] = m[ 0 ];
        r[ 1 ] = m[ 3 ];
        r[ 2 ] = m[ 6 ];
        r[ 3 ] = m[ 1 ];
        r[ 4 ] = m[ 4 ];
        r[ 5 ] = m[ 7 ];
        r[ 6 ] = m[ 2 ];
        r[ 7 ] = m[ 5 ];
        r[ 8 ] = m[ 8 ];

        return this;

    },

    fromArray: function ( array ) {

        this.elements.set( array );

        return this;

    },

    toArray: function () {

        var te = this.elements;

        return [
            te[ 0 ], te[ 1 ], te[ 2 ],
            te[ 3 ], te[ 4 ], te[ 5 ],
            te[ 6 ], te[ 7 ], te[ 8 ]
        ];

    }

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Matrix4 = function () {

    this.elements = new Float32Array( [

        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1

    ] );

    if ( arguments.length > 0 ) {

        console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

    }

};

THREE.Matrix4.prototype = {

    constructor: THREE.Matrix4,

    set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

        var te = this.elements;

        te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
        te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
        te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
        te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

        return this;

    },

    identity: function () {

        this.set(

            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1

        );

        return this;

    },

    clone: function () {

        return new THREE.Matrix4().fromArray( this.elements );

    },

    copy: function ( m ) {

        this.elements.set( m.elements );

        return this;

    },

    extractPosition: function ( m ) {

        console.warn( 'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
        return this.copyPosition( m );

    },

    copyPosition: function ( m ) {

        var te = this.elements;
        var me = m.elements;

        te[ 12 ] = me[ 12 ];
        te[ 13 ] = me[ 13 ];
        te[ 14 ] = me[ 14 ];

        return this;

    },

    extractBasis: function ( xAxis, yAxis, zAxis ) {

        var te = this.elements;

        xAxis.set( te[ 0 ], te[ 1 ], te[ 2 ] );
        yAxis.set( te[ 4 ], te[ 5 ], te[ 6 ] );
        zAxis.set( te[ 8 ], te[ 9 ], te[ 10 ] );

        return this;

    },

    makeBasis: function ( xAxis, yAxis, zAxis ) {

        this.set(
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            0,       0,       0,       1
        );

        return this;

    },

    extractRotation: function () {

        var v1;

        return function ( m ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            var te = this.elements;
            var me = m.elements;

            var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] ).length();
            var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] ).length();
            var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] ).length();

            te[ 0 ] = me[ 0 ] * scaleX;
            te[ 1 ] = me[ 1 ] * scaleX;
            te[ 2 ] = me[ 2 ] * scaleX;

            te[ 4 ] = me[ 4 ] * scaleY;
            te[ 5 ] = me[ 5 ] * scaleY;
            te[ 6 ] = me[ 6 ] * scaleY;

            te[ 8 ] = me[ 8 ] * scaleZ;
            te[ 9 ] = me[ 9 ] * scaleZ;
            te[ 10 ] = me[ 10 ] * scaleZ;

            return this;

        };

    }(),

    makeRotationFromEuler: function ( euler ) {

        if ( euler instanceof THREE.Euler === false ) {

            console.error( 'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

        }

        var te = this.elements;

        var x = euler.x, y = euler.y, z = euler.z;
        var a = Math.cos( x ), b = Math.sin( x );
        var c = Math.cos( y ), d = Math.sin( y );
        var e = Math.cos( z ), f = Math.sin( z );

        if ( euler.order === 'XYZ' ) {

            var ae = a * e, af = a * f, be = b * e, bf = b * f;

            te[ 0 ] = c * e;
            te[ 4 ] = - c * f;
            te[ 8 ] = d;

            te[ 1 ] = af + be * d;
            te[ 5 ] = ae - bf * d;
            te[ 9 ] = - b * c;

            te[ 2 ] = bf - ae * d;
            te[ 6 ] = be + af * d;
            te[ 10 ] = a * c;

        } else if ( euler.order === 'YXZ' ) {

            var ce = c * e, cf = c * f, de = d * e, df = d * f;

            te[ 0 ] = ce + df * b;
            te[ 4 ] = de * b - cf;
            te[ 8 ] = a * d;

            te[ 1 ] = a * f;
            te[ 5 ] = a * e;
            te[ 9 ] = - b;

            te[ 2 ] = cf * b - de;
            te[ 6 ] = df + ce * b;
            te[ 10 ] = a * c;

        } else if ( euler.order === 'ZXY' ) {

            var ce = c * e, cf = c * f, de = d * e, df = d * f;

            te[ 0 ] = ce - df * b;
            te[ 4 ] = - a * f;
            te[ 8 ] = de + cf * b;

            te[ 1 ] = cf + de * b;
            te[ 5 ] = a * e;
            te[ 9 ] = df - ce * b;

            te[ 2 ] = - a * d;
            te[ 6 ] = b;
            te[ 10 ] = a * c;

        } else if ( euler.order === 'ZYX' ) {

            var ae = a * e, af = a * f, be = b * e, bf = b * f;

            te[ 0 ] = c * e;
            te[ 4 ] = be * d - af;
            te[ 8 ] = ae * d + bf;

            te[ 1 ] = c * f;
            te[ 5 ] = bf * d + ae;
            te[ 9 ] = af * d - be;

            te[ 2 ] = - d;
            te[ 6 ] = b * c;
            te[ 10 ] = a * c;

        } else if ( euler.order === 'YZX' ) {

            var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

            te[ 0 ] = c * e;
            te[ 4 ] = bd - ac * f;
            te[ 8 ] = bc * f + ad;

            te[ 1 ] = f;
            te[ 5 ] = a * e;
            te[ 9 ] = - b * e;

            te[ 2 ] = - d * e;
            te[ 6 ] = ad * f + bc;
            te[ 10 ] = ac - bd * f;

        } else if ( euler.order === 'XZY' ) {

            var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

            te[ 0 ] = c * e;
            te[ 4 ] = - f;
            te[ 8 ] = d * e;

            te[ 1 ] = ac * f + bd;
            te[ 5 ] = a * e;
            te[ 9 ] = ad * f - bc;

            te[ 2 ] = bc * f - ad;
            te[ 6 ] = b * e;
            te[ 10 ] = bd * f + ac;

        }

        // last column
        te[ 3 ] = 0;
        te[ 7 ] = 0;
        te[ 11 ] = 0;

        // bottom row
        te[ 12 ] = 0;
        te[ 13 ] = 0;
        te[ 14 ] = 0;
        te[ 15 ] = 1;

        return this;

    },

    setRotationFromQuaternion: function ( q ) {

        console.warn( 'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );

        return this.makeRotationFromQuaternion( q );

    },

    makeRotationFromQuaternion: function ( q ) {

        var te = this.elements;

        var x = q.x, y = q.y, z = q.z, w = q.w;
        var x2 = x + x, y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;

        te[ 0 ] = 1 - ( yy + zz );
        te[ 4 ] = xy - wz;
        te[ 8 ] = xz + wy;

        te[ 1 ] = xy + wz;
        te[ 5 ] = 1 - ( xx + zz );
        te[ 9 ] = yz - wx;

        te[ 2 ] = xz - wy;
        te[ 6 ] = yz + wx;
        te[ 10 ] = 1 - ( xx + yy );

        // last column
        te[ 3 ] = 0;
        te[ 7 ] = 0;
        te[ 11 ] = 0;

        // bottom row
        te[ 12 ] = 0;
        te[ 13 ] = 0;
        te[ 14 ] = 0;
        te[ 15 ] = 1;

        return this;

    },

    lookAt: function () {

        var x, y, z;

        return function ( eye, target, up ) {

            if ( x === undefined ) x = new THREE.Vector3();
            if ( y === undefined ) y = new THREE.Vector3();
            if ( z === undefined ) z = new THREE.Vector3();

            var te = this.elements;

            z.subVectors( eye, target ).normalize();

            if ( z.lengthSq() === 0 ) {

                z.z = 1;

            }

            x.crossVectors( up, z ).normalize();

            if ( x.lengthSq() === 0 ) {

                z.x += 0.0001;
                x.crossVectors( up, z ).normalize();

            }

            y.crossVectors( z, x );


            te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
            te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
            te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

            return this;

        };

    }(),

    multiply: function ( m, n ) {

        if ( n !== undefined ) {

            console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
            return this.multiplyMatrices( m, n );

        }

        return this.multiplyMatrices( this, m );

    },

    multiplyMatrices: function ( a, b ) {

        var ae = a.elements;
        var be = b.elements;
        var te = this.elements;

        var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
        var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
        var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
        var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

        var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
        var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
        var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
        var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

        te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

        return this;

    },

    multiplyToArray: function ( a, b, r ) {

        var te = this.elements;

        this.multiplyMatrices( a, b );

        r[ 0 ] = te[ 0 ]; r[ 1 ] = te[ 1 ]; r[ 2 ] = te[ 2 ]; r[ 3 ] = te[ 3 ];
        r[ 4 ] = te[ 4 ]; r[ 5 ] = te[ 5 ]; r[ 6 ] = te[ 6 ]; r[ 7 ] = te[ 7 ];
        r[ 8 ]  = te[ 8 ]; r[ 9 ]  = te[ 9 ]; r[ 10 ] = te[ 10 ]; r[ 11 ] = te[ 11 ];
        r[ 12 ] = te[ 12 ]; r[ 13 ] = te[ 13 ]; r[ 14 ] = te[ 14 ]; r[ 15 ] = te[ 15 ];

        return this;

    },

    multiplyScalar: function ( s ) {

        var te = this.elements;

        te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
        te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
        te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
        te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

        return this;

    },

    multiplyVector3: function ( vector ) {

        console.warn( 'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
        return vector.applyProjection( this );

    },

    multiplyVector4: function ( vector ) {

        console.warn( 'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
        return vector.applyMatrix4( this );

    },

    multiplyVector3Array: function ( a ) {

        console.warn( 'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
        return this.applyToVector3Array( a );

    },

    applyToVector3Array: function () {

        var v1;

        return function ( array, offset, length ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();
            if ( offset === undefined ) offset = 0;
            if ( length === undefined ) length = array.length;

            for ( var i = 0, j = offset; i < length; i += 3, j += 3 ) {

                v1.fromArray( array, j );
                v1.applyMatrix4( this );
                v1.toArray( array, j );

            }

            return array;

        };

    }(),

    applyToBuffer: function () {

        var v1;

        return function applyToBuffer( buffer, offset, length ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();
            if ( offset === undefined ) offset = 0;
            if ( length === undefined ) length = buffer.length / buffer.itemSize;

            for ( var i = 0, j = offset; i < length; i ++, j ++ ) {

                v1.x = buffer.getX( j );
                v1.y = buffer.getY( j );
                v1.z = buffer.getZ( j );

                v1.applyMatrix4( this );

                buffer.setXYZ( v1.x, v1.y, v1.z );

            }

            return buffer;

        };

    }(),

    rotateAxis: function ( v ) {

        console.warn( 'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );

        v.transformDirection( this );

    },

    crossVector: function ( vector ) {

        console.warn( 'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
        return vector.applyMatrix4( this );

    },

    determinant: function () {

        var te = this.elements;

        var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
        var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
        var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
        var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

        //TODO: make this more efficient
        //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

        return (
            n41 * (
                + n14 * n23 * n32
                 - n13 * n24 * n32
                 - n14 * n22 * n33
                 + n12 * n24 * n33
                 + n13 * n22 * n34
                 - n12 * n23 * n34
            ) +
            n42 * (
                + n11 * n23 * n34
                 - n11 * n24 * n33
                 + n14 * n21 * n33
                 - n13 * n21 * n34
                 + n13 * n24 * n31
                 - n14 * n23 * n31
            ) +
            n43 * (
                + n11 * n24 * n32
                 - n11 * n22 * n34
                 - n14 * n21 * n32
                 + n12 * n21 * n34
                 + n14 * n22 * n31
                 - n12 * n24 * n31
            ) +
            n44 * (
                - n13 * n22 * n31
                 - n11 * n23 * n32
                 + n11 * n22 * n33
                 + n13 * n21 * n32
                 - n12 * n21 * n33
                 + n12 * n23 * n31
            )

        );

    },

    transpose: function () {

        var te = this.elements;
        var tmp;

        tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
        tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
        tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

        tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
        tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
        tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

        return this;

    },

    flattenToArrayOffset: function ( array, offset ) {

        var te = this.elements;

        array[ offset ] = te[ 0 ];
        array[ offset + 1 ] = te[ 1 ];
        array[ offset + 2 ] = te[ 2 ];
        array[ offset + 3 ] = te[ 3 ];

        array[ offset + 4 ] = te[ 4 ];
        array[ offset + 5 ] = te[ 5 ];
        array[ offset + 6 ] = te[ 6 ];
        array[ offset + 7 ] = te[ 7 ];

        array[ offset + 8 ]  = te[ 8 ];
        array[ offset + 9 ]  = te[ 9 ];
        array[ offset + 10 ] = te[ 10 ];
        array[ offset + 11 ] = te[ 11 ];

        array[ offset + 12 ] = te[ 12 ];
        array[ offset + 13 ] = te[ 13 ];
        array[ offset + 14 ] = te[ 14 ];
        array[ offset + 15 ] = te[ 15 ];

        return array;

    },

    getPosition: function () {

        var v1;

        return function () {

            if ( v1 === undefined ) v1 = new THREE.Vector3();
            console.warn( 'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );

            var te = this.elements;
            return v1.set( te[ 12 ], te[ 13 ], te[ 14 ] );

        };

    }(),

    setPosition: function ( v ) {

        var te = this.elements;

        te[ 12 ] = v.x;
        te[ 13 ] = v.y;
        te[ 14 ] = v.z;

        return this;

    },

    getInverse: function ( m, throwOnInvertible ) {

        // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        var te = this.elements;
        var me = m.elements;

        var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
        var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
        var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
        var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

        te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
        te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
        te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
        te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
        te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
        te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
        te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
        te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
        te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
        te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
        te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
        te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
        te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
        te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
        te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

        var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

        if ( det === 0 ) {

            var msg = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";

            if ( throwOnInvertible || false ) {

                throw new Error( msg );

            } else {

                console.warn( msg );

            }

            this.identity();

            return this;

        }

        this.multiplyScalar( 1 / det );

        return this;

    },

    translate: function ( v ) {

        console.error( 'THREE.Matrix4: .translate() has been removed.' );

    },

    rotateX: function ( angle ) {

        console.error( 'THREE.Matrix4: .rotateX() has been removed.' );

    },

    rotateY: function ( angle ) {

        console.error( 'THREE.Matrix4: .rotateY() has been removed.' );

    },

    rotateZ: function ( angle ) {

        console.error( 'THREE.Matrix4: .rotateZ() has been removed.' );

    },

    rotateByAxis: function ( axis, angle ) {

        console.error( 'THREE.Matrix4: .rotateByAxis() has been removed.' );

    },

    scale: function ( v ) {

        var te = this.elements;
        var x = v.x, y = v.y, z = v.z;

        te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
        te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
        te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
        te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

        return this;

    },

    getMaxScaleOnAxis: function () {

        var te = this.elements;

        var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
        var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
        var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

        return Math.sqrt( Math.max( scaleXSq, scaleYSq, scaleZSq ) );

    },

    makeTranslation: function ( x, y, z ) {

        this.set(

            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1

        );

        return this;

    },

    makeRotationX: function ( theta ) {

        var c = Math.cos( theta ), s = Math.sin( theta );

        this.set(

            1, 0,  0, 0,
            0, c, - s, 0,
            0, s,  c, 0,
            0, 0,  0, 1

        );

        return this;

    },

    makeRotationY: function ( theta ) {

        var c = Math.cos( theta ), s = Math.sin( theta );

        this.set(

             c, 0, s, 0,
             0, 1, 0, 0,
            - s, 0, c, 0,
             0, 0, 0, 1

        );

        return this;

    },

    makeRotationZ: function ( theta ) {

        var c = Math.cos( theta ), s = Math.sin( theta );

        this.set(

            c, - s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1

        );

        return this;

    },

    makeRotationAxis: function ( axis, angle ) {

        // Based on http://www.gamedev.net/reference/articles/article1199.asp

        var c = Math.cos( angle );
        var s = Math.sin( angle );
        var t = 1 - c;
        var x = axis.x, y = axis.y, z = axis.z;
        var tx = t * x, ty = t * y;

        this.set(

            tx * x + c, tx * y - s * z, tx * z + s * y, 0,
            tx * y + s * z, ty * y + c, ty * z - s * x, 0,
            tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
            0, 0, 0, 1

        );

         return this;

    },

    makeScale: function ( x, y, z ) {

        this.set(

            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1

        );

        return this;

    },

    compose: function ( position, quaternion, scale ) {

        this.makeRotationFromQuaternion( quaternion );
        this.scale( scale );
        this.setPosition( position );

        return this;

    },

    decompose: function () {

        var vector, matrix;

        return function ( position, quaternion, scale ) {

            if ( vector === undefined ) vector = new THREE.Vector3();
            if ( matrix === undefined ) matrix = new THREE.Matrix4();

            var te = this.elements;

            var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
            var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
            var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

            // if determine is negative, we need to invert one scale
            var det = this.determinant();
            if ( det < 0 ) {

                sx = - sx;

            }

            position.x = te[ 12 ];
            position.y = te[ 13 ];
            position.z = te[ 14 ];

            // scale the rotation part

            matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()

            var invSX = 1 / sx;
            var invSY = 1 / sy;
            var invSZ = 1 / sz;

            matrix.elements[ 0 ] *= invSX;
            matrix.elements[ 1 ] *= invSX;
            matrix.elements[ 2 ] *= invSX;

            matrix.elements[ 4 ] *= invSY;
            matrix.elements[ 5 ] *= invSY;
            matrix.elements[ 6 ] *= invSY;

            matrix.elements[ 8 ] *= invSZ;
            matrix.elements[ 9 ] *= invSZ;
            matrix.elements[ 10 ] *= invSZ;

            quaternion.setFromRotationMatrix( matrix );

            scale.x = sx;
            scale.y = sy;
            scale.z = sz;

            return this;

        };

    }(),

    makeFrustum: function ( left, right, bottom, top, near, far ) {

        var te = this.elements;
        var x = 2 * near / ( right - left );
        var y = 2 * near / ( top - bottom );

        var a = ( right + left ) / ( right - left );
        var b = ( top + bottom ) / ( top - bottom );
        var c = - ( far + near ) / ( far - near );
        var d = - 2 * far * near / ( far - near );

        te[ 0 ] = x;    te[ 4 ] = 0;    te[ 8 ] = a;    te[ 12 ] = 0;
        te[ 1 ] = 0;    te[ 5 ] = y;    te[ 9 ] = b;    te[ 13 ] = 0;
        te[ 2 ] = 0;    te[ 6 ] = 0;    te[ 10 ] = c;    te[ 14 ] = d;
        te[ 3 ] = 0;    te[ 7 ] = 0;    te[ 11 ] = - 1;    te[ 15 ] = 0;

        return this;

    },

    makePerspective: function ( fov, aspect, near, far ) {

        var ymax = near * Math.tan( THREE.Math.degToRad( fov * 0.5 ) );
        var ymin = - ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;

        return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );

    },

    makeOrthographic: function ( left, right, top, bottom, near, far ) {

        var te = this.elements;
        var w = right - left;
        var h = top - bottom;
        var p = far - near;

        var x = ( right + left ) / w;
        var y = ( top + bottom ) / h;
        var z = ( far + near ) / p;

        te[ 0 ] = 2 / w;    te[ 4 ] = 0;    te[ 8 ] = 0;    te[ 12 ] = - x;
        te[ 1 ] = 0;    te[ 5 ] = 2 / h;    te[ 9 ] = 0;    te[ 13 ] = - y;
        te[ 2 ] = 0;    te[ 6 ] = 0;    te[ 10 ] = - 2 / p;    te[ 14 ] = - z;
        te[ 3 ] = 0;    te[ 7 ] = 0;    te[ 11 ] = 0;    te[ 15 ] = 1;

        return this;

    },

    equals: function ( matrix ) {

        var te = this.elements;
        var me = matrix.elements;

        for ( var i = 0; i < 16; i ++ ) {

            if ( te[ i ] !== me[ i ] ) return false;

        }

        return true;

    },

    fromArray: function ( array ) {

        this.elements.set( array );

        return this;

    },

    toArray: function () {

        var te = this.elements;

        return [
            te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
            te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
            te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
            te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
        ];

    }

};
