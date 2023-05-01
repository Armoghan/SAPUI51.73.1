sap.ui.define(["./thirdparty/GlMatrixUtils","./AnimationTrackValueType"],function(g,A){"use strict";var a={};a.neutralAngleAxisToGlMatrixQuat=function(v){return g.quat.setAxisAngle(g.quat.create(),g.vec3.fromValues(v[0],v[1],v[2]),v[3]);};a.neutralEulerToGlMatrixQuat=function(v){var b=v[3]&3;var c=(v[3]>>2)&3;var d=(v[3]>>4)&3;var h=v[b];var e=v[c];var f=v[d];var i=Math.cos(h/2);var s=Math.sin(h/2);var j=Math.cos(e/2);var k=Math.sin(e/2);var l=Math.cos(f/2);var m=Math.sin(f/2);var x=s*j*l-i*k*m;var y=i*k*l+s*j*m;var z=i*j*m-s*k*l;var w=i*j*l+s*k*m;var q=g.quat.fromValues(x,y,z,w);return q;};a.neutralQuatToGlMatrixQuat=function(v){return g.quat.fromValues(v[0],v[1],v[2],v[3]);};a.glMatrixQuatToNeutral=function(v){return[v[0],v[1],v[2],v[3]];};a.interpolate=function(v,b,c,k,t){var d=b.value;var e=c.value;var f;var h;var i;var q;switch(v){case A.Quaternion:h=a.neutralQuatToGlMatrixQuat(d);i=a.neutralQuatToGlMatrixQuat(e);q=g.quat.lerp(g.quat.create(),h,i,k);f=a.glMatrixQuatToNeutral(q);break;case A.Euler:var r=[a.interpolateScalarLinear(d[0],e[0],k),a.interpolateScalarLinear(d[1],e[1],k),a.interpolateScalarLinear(d[2],e[2],k),d[3]];q=a.neutralEulerToGlMatrixQuat(r);f=a.glMatrixQuatToNeutral(q);break;case A.AngleAxis:f=[];var j=new THREE.Matrix4();var l;var m;var n;var x;var y;var z;for(var o=0;o<t.getKeysCount();o++){var p=t.getKey(o);x=p.value[0];y=p.value[1];z=p.value[2];l=p.value[3];m=new THREE.Vector3(x,y,z);n=new THREE.Matrix4();n.makeRotationAxis(m,l);j.premultiply(n);if(p===b){break;}}x=e[0];y=e[1];z=e[2];l=e[3]*k;m=new THREE.Vector3(x,y,z);var s=new THREE.Matrix4();s.makeRotationAxis(m,l);s.multiply(j);var u=new THREE.Quaternion().setFromRotationMatrix(s);f=u.toArray();break;case A.Vector3:f=[];f.push(a.interpolateScalarLinear(d[0],e[0],k),a.interpolateScalarLinear(d[1],e[1],k),a.interpolateScalarLinear(d[2],e[2],k));break;default:f=a.interpolateScalarLinear(d,e,k);}return f;};a.interpolateScalarLinear=function(v,b,k){return v+k*(b-v);};return a;});