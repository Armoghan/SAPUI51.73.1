sap.ui.define(["jquery.sap.global","./thirdparty/three","sap/base/Log"],function(q,t,L){"use strict";var O=function(o){this._maskMaterial=new THREE.MeshBasicMaterial({color:0xff0080});this._maskMaterial.side=THREE.DoubleSide;this._blurMaskMaterial=this.getBlurMaterial(o*5);this._blurMaskMaterial.side=THREE.DoubleSide;this._outlineMaterial=this.getOutlineMaterial();this._outlineMaterial.side=THREE.DoubleSide;this._backgroundMaskCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);this._backgroundMaskGeometry=new THREE.PlaneBufferGeometry(2,2);this._backgroundMaskMesh=new THREE.Mesh(this._backgroundMaskGeometry);};O.prototype.setOutlineWidth=function(w){this._blurMaskMaterial=this.getBlurMaterial(w*5);this._blurMaskMaterial.side=THREE.DoubleSide;};O.prototype.render=function(r,s,c,a,o){if(!a||!a.length){return;}var p={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat};var b=r.getSize(new THREE.Vector2());var d=r.getPixelRatio();var w=b.width*d;var h=b.height*d;var e=new THREE.WebGLRenderTarget(w,h,p);e.texture.name="maskBuffer";e.texture.generateMipmaps=false;var f=new THREE.WebGLRenderTarget(w,h,p);f.texture.name="blurMaskBuffer";f.texture.generateMipmaps=false;var g=new THREE.WebGLRenderTarget(w,h,p);g.texture.name="OutlineMaskBuffer";g.texture.generateMipmaps=false;var j=new Set();var i;function k(A){if(A.isMesh){j.add(A);}}for(i=0;i<a.length;i++){var l=a[i];l.traverse(k);}var m=r.getClearColor().clone();var n=r.getClearAlpha();var u=r.autoClear;var v=j.values();var x=v.next();while(!x.done){var y=x.value;x=v.next();var z=y.material;y.material=this._maskMaterial;r.autoClear=false;r.setClearColor(0x000000,0);r.render(y,c,e,true);y.material=z;this._backgroundMaskMesh.material=this._blurMaskMaterial;this._blurMaskMaterial.uniforms.mask.value=e.texture;this._blurMaskMaterial.uniforms.texSize.value=new THREE.Vector2(e.width,e.height);r.render(this._backgroundMaskMesh,this._backgroundMaskCamera,f);this._backgroundMaskMesh.material=this._outlineMaterial;this._outlineMaterial.uniforms.mask.value=e.texture;this._outlineMaterial.uniforms.blurMask.value=f.texture;this._outlineMaterial.uniforms.outlineColor.value=o;r.render(this._backgroundMaskMesh,this._backgroundMaskCamera,g);this._backgroundMaskMesh.material=this.getCopyMaskShaderMaterial();this._backgroundMaskMesh.material.uniforms.mask.value=g.texture;r.render(this._backgroundMaskMesh,this._backgroundMaskCamera);}r.setClearColor(m,n);r.autoClear=u;};O.prototype.getCopyMaskShaderMaterial=function(){return new THREE.ShaderMaterial({uniforms:{"mask":{value:null}},vertexShader:["varying vec2 vUv;","void main() {","	vUv = uv;","	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);","}"].join("\n"),fragmentShader:["uniform sampler2D mask;","varying vec2 vUv;","void main() {","	gl_FragColor = texture2D( mask, vUv);","}"].join("\n"),depthTest:false,depthWrite:false,transparent:true});};O.prototype.getOutlineMaterial=function(){return new THREE.ShaderMaterial({uniforms:{"mask":{value:null},"blurMask":{value:null},"outlineColor":{value:new THREE.Vector3(0.0,0.0,1.0)}},vertexShader:["varying vec2 vUv;","void main() {","	vUv = uv;","	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["varying vec2 vUv;","uniform sampler2D mask;","uniform sampler2D blurMask;","uniform vec3 outlineColor;","void main() {","	vec4 c1 = texture2D( mask, vUv);","	vec4 c2 = texture2D( blurMask, vUv);","	if (c1.r < 0.9 && c2.g > 0.1) {","		gl_FragColor = vec4(outlineColor, 1.0);","	} else {","		gl_FragColor = vec4(outlineColor, 0.0);","	}","}"].join("\n")});};O.prototype.getBlurMaterial=function(l){return new THREE.ShaderMaterial({defines:{LINE_WIDTH:l},uniforms:{"mask":{value:null},"texSize":{value:new THREE.Vector2(0.5,0.5)}},vertexShader:["varying vec2 vUv;","void main() {","	vUv = uv;","	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["varying vec2 vUv;","uniform sampler2D mask;","uniform vec2 texSize;","void main() {","	vec2 invSize = 1.0 / texSize;","	float intensity = 0.0;","	for (int i = 0; i < LINE_WIDTH; i++) {","		vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize * float(i + 1), invSize * float(i + 1));","		vec4 c1 = texture2D( mask, vUv + uvOffset.xy);","		vec4 c2 = texture2D( mask, vUv - uvOffset.xy);","		vec4 c3 = texture2D( mask, vUv + uvOffset.yw);","		vec4 c4 = texture2D( mask, vUv - uvOffset.yw);","		intensity = intensity + ( c1.r + c2.r + c3.r + c4.r ) / 4.0;","	}","	if (LINE_WIDTH > 1) intensity = intensity / float(LINE_WIDTH);","	gl_FragColor = vec4(0.0, intensity, 0.1, 1.0);","}"].join("\n")});};O.prototype.getOutlineCreationMaterial=function(){return new THREE.ShaderMaterial({uniforms:{"mask":{value:null},"texSize":{value:new THREE.Vector2(0.5,0.5)},"outlineColor":{value:new THREE.Vector3(1.0,1.0,1.0)}},vertexShader:["varying vec2 vUv;","void main() {","	vUv = uv;","	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["varying vec2 vUv;","uniform sampler2D mask;","uniform vec2 texSize;","uniform vec3 outlineColor;","void main() {","	vec2 invSize = 1.0 / texSize;","	vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);","	vec4 c1 = texture2D( mask, vUv + uvOffset.xy);","	vec4 c2 = texture2D( mask, vUv - uvOffset.xy);","	vec4 c3 = texture2D( mask, vUv + uvOffset.yw);","	vec4 c4 = texture2D( mask, vUv - uvOffset.yw);","	float diff1 = (c1.r - c2.r)*0.5;","	float diff2 = (c3.r - c4.r)*0.5;","	float d = length( vec2(diff1, diff2) );","	gl_FragColor = vec4(outlineColor, 1.0) * vec4(d);","}"].join("\n")});};O.prototype.getOutlineWidthMaterial=function(m){return new THREE.ShaderMaterial({defines:{"MAX_WIDTH":m},uniforms:{"mask":{value:null},"texSize":{value:new THREE.Vector2(0.5,0.5)},"direction":{value:new THREE.Vector2(0.5,0.5)},"lineWidth":{value:1.0}},vertexShader:["varying vec2 vUv;","void main() {","	vUv = uv;","	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join("\n"),fragmentShader:["#include <common>","varying vec2 vUv;","uniform sampler2D mask;","uniform vec2 texSize;","uniform vec2 direction;","uniform float lineWidth;","float gaussianPdf(in float x, in float sigma) {","	return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;","}","void main() {","	vec2 invSize = 1.0 / texSize;","	float weightSum = gaussianPdf(0.0, lineWidth);","	vec4 diffuseSum = texture2D( mask, vUv) * weightSum;","	vec2 delta = direction * invSize * lineWidth/float(MAX_WIDTH);","	vec2 uvOffset = delta;","	for( int i = 1; i <= MAX_WIDTH; i ++ ) {","		float w = gaussianPdf(uvOffset.x, lineWidth);","		vec4 sample1 = texture2D( mask, vUv + uvOffset);","		vec4 sample2 = texture2D( mask, vUv - uvOffset);","		diffuseSum += ((sample1 + sample2) * w);","		weightSum += (2.0 * w);","		uvOffset += delta;","	}","	gl_FragColor = diffuseSum/weightSum;","}"].join("\n")});};return O;});