/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./thirdparty/three","sap/ui/base/ManagedObject","../ve/thirdparty/html2canvas","../DetailViewType","../DetailViewShape","./OrthographicCamera","./PerspectiveCamera"],function(t,B,c,D,d,O,P){"use strict";var e=B.extend("sap.ui.vk.threejs.DetailView",{metadata:{properties:{name:{type:"string",defaultValue:""},camera:{type:"any",defaultValue:null},type:{type:"sap.ui.vk.DetailViewType",defaultValue:D.DetailView},shape:{type:"sap.ui.vk.DetailViewShape",defaultValue:d.Box},borderWidth:{type:"float",defaultValue:2},backgroundColor:{type:"sap.ui.core.CSSColor",defaultValue:"#fff"},borderColor:{type:"sap.ui.core.CSSColor",defaultValue:"#000"},origin:{type:"any",defaultValue:new THREE.Vector3(0,0)},size:{type:"any",defaultValue:new THREE.Vector3(0.5,0.5)},attachmentPoint:{type:"any",defaultValue:null},metadata:{type:"any",defaultValue:{}},veId:{type:"any",defaultValue:{}},visibleNodes:{type:"any",defaultValue:null},targetNodes:{type:"any",defaultValue:null}}}});e.prototype.init=function(){if(B.prototype.init){B.prototype.init.call(this);}this._backgroundColor=new THREE.Color();this._node=new THREE.Group();var b=new THREE.MeshBasicMaterial({depthTest:false});this._line=new THREE.Mesh(new THREE.BufferGeometry(),b);this._line.renderOrder=0;this._node.add(this._line);var a=new THREE.BufferGeometry();a.setIndex([0,1,2]);var f=new THREE.MeshBasicMaterial({color:this._backgroundColor,depthTest:false});this._triangle=new THREE.Mesh(a,f);this._triangle.renderOrder=1;this._node.add(this._triangle);this._billboard=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshBasicMaterial({depthTest:false}));this._billboard.renderOrder=2;this._node.add(this._billboard);this._border=new THREE.Mesh(new THREE.BufferGeometry(),b);this._border.renderOrder=3;this._node.add(this._border);};e.prototype.setCamera=function(a){if(a instanceof P||a instanceof O){this.setProperty("camera",a,true);}return this;};e.prototype.setShape=function(a){this.setProperty("shape",a,true);return this;};e.prototype.setBackgroundColor=function(a){this.setProperty("backgroundColor",a,true);this._backgroundColor.setStyle(a);this._triangle.material.color.copy(this._backgroundColor);return this;};e.prototype.setBorderColor=function(a){this.setProperty("borderColor",a,true);this._border.material.map=null;return this;};e.prototype.setBorderWidth=function(a){this.setProperty("borderWidth",a,true);this._border.material.map=null;return this;};e.prototype.setOrigin=function(a){if(a instanceof THREE.Vector2){this.setProperty("origin",a,true);}return this;};e.prototype.setSize=function(a){if(a instanceof THREE.Vector2){this.setProperty("size",a,true);}return this;};var g=-0.5,j=1.5,p=new THREE.Vector4(),k=new THREE.Vector3(),n=new THREE.Vector3(),o=new THREE.Vector3(),q=new THREE.Vector2(),s=new THREE.Vector2(),r=new THREE.Vector2(),v=new THREE.Matrix4();function z(a,b){return Math.PI*(3*(a+b)-Math.sqrt((3*a+b)*(a+3*b)));}function A(a,b,h,i,l,m){var u=a[b],w=a[b+1],x=a[l],y=a[l+1],I=a[m],J=a[m+1],K=i-w,L=u-h;var f=((x-u)*K+(y-w)*L)/((x-I)*K+(y-J)*L);a[l]=x+(I-x)*f;a[l+1]=y+(J-y)*f;}function C(f,a,b,h){q.set(f[b+1]-f[a+1],f[a]-f[b]).normalize().multiplyScalar(h);f[a]+=q.x;f[a+1]+=q.y;f[b]+=q.x;f[b+1]+=q.y;}function E(a,b){var f=a.length;for(var h=0;h<6;h+=3){var l=h===0?b*g:b*j;var m=a[h],u=a[h+1];for(var i=h;i<f-6;i+=6){var w=a[i],x=a[i+1];a[i]=m;a[i+1]=u;m=a[i+6];u=a[i+7];C(a,i,i+6,l);if(i>h){A(a,i-6,w,x,i,i+6);}}}}e.prototype._createBoxViewport=function(a,b,f,h){var l=[-a,-b,0,a,-b,0,a,b,0,-a,b,0];var m=this._billboard.geometry;m.setIndex([0,1,2,0,2,3]);m.addAttribute("position",new THREE.Float32BufferAttribute(l,3));m.addAttribute("uv",new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));if(this._border.visible){var u=[],i;for(i=0;i<l.length;i+=3){var x=l[i],y=l[i+1];u.push(x,y,0,x,y,0);}u.push(u[0],u[1],0,u[0],u[1],0);E(u,this._borderWidth);i=u.length-6;u[0]=u[i];u[i+1]=u[1];u[3]=u[i+3];u[i+4]=u[4];this._createBorderGeometry(this._border.geometry,u);}};e.prototype._createCircleViewport=function(b,f,h,l){var m=[0,0,0],u=[0.5,0.5],w=[];var x=THREE.Math.clamp(Math.round(z(b,f)/24),32,256);var y=2*Math.PI/x;for(var i=0;i<x;i++){var a=i*y,I=Math.cos(a),J=Math.sin(a);m.push(I*b,J*f,0);u.push(I*0.5+0.5,J*0.5+0.5);w.push(0,i+1,i+1<x?i+2:1);}var K=this._billboard.geometry;K.setIndex(w);K.addAttribute("position",new THREE.Float32BufferAttribute(m,3));K.addAttribute("uv",new THREE.Float32BufferAttribute(u,2));var L=this._borderWidth*j;this._createCircleBorder(m,b,f,h&&q.set(h.x/(b+L),h.y/(f+L)).length()>1?h:null,l);};e.prototype._createCircleBorder=function(b,f,h,m,u){var w=this._borderWidth,I=[],i,x,y;if(m&&(u!==d.Circle&&u!==d.CircleLine)){I.push(m.x,m.y,0,m.x,m.y,0);var J=Math.PI*0.05;var K=Math.atan2(m.y*f,m.x*h)+J;var L=(b.length/3)-3;J=2*(Math.PI-J)/L;for(i=0;i<=L;i++){var a=K+i*J;x=Math.cos(a)*f;y=Math.sin(a)*h;I.push(x,y,0,x,y,0);}var M=[m.x,m.y,0,I[6],I[7],0,I[I.length-3],I[I.length-2],0];I.push(m.x,m.y,0,m.x,m.y,0);E(I,w);i=I.length-6;var N=q.set(I[9],I[10]).sub(m).length();var Q=q.set(I[9]-I[i-3],I[10]-I[i-2]).length()*0.5;var l=m.length();l=1-w*2*N/(Q*l);I[i+0]=I[0]=m.x*l;I[i+1]=I[1]=m.y*l;I[i+3]=I[3]=m.x;I[i+4]=I[4]=m.y;var R=this._triangle.geometry;l=(1+l)*0.5;M[0]*=l;M[1]*=l;R.addAttribute("position",new THREE.Float32BufferAttribute(M,3));this._triangle.visible=true;this._triangle.material.color.set(u===d.SolidPointer||u===d.SolidArrow?this.getBorderColor():this._backgroundColor);}else{this._line.visible=this._line.visible&&m!==null;for(i=3;i<b.length;i+=3){x=b[i];y=b[i+1];I.push(x,y,0,x,y,0);}I.push(I[0],I[1],0,I[0],I[1],0);E(I,w);i=I.length-6;I[i]=I[0]=b[3]+w*g;I[i+3]=I[3]=b[3]+w*j;I[i+1]=I[1]=b[4];I[i+4]=I[4]=b[4];}this._createBorderGeometry(this._border.geometry,I);};e.prototype._createBorderGeometry=function(a,b){var i,f=b.length/3;var h=[];for(i=2;i<f;i+=2){h.push(i-1,i,i-2,i+1,i,i-1);}var l=[];var u=this._borderU;for(i=0;i<f;i+=2){l.push(0,0.5,u,0.5);}a.setIndex(h);a.addAttribute("position",new THREE.Float32BufferAttribute(b,3));a.addAttribute("uv",new THREE.Float32BufferAttribute(l,2));};e.prototype._createLine=function(a){var b=[0,0,0,0,0,0,a.x,a.y,0,a.x,a.y,0];C(b,0,6,-this._borderWidth);C(b,3,9,this._borderWidth);this._createBorderGeometry(this._line.geometry,b);};e.prototype._updateGeometry=function(s,a,b){var f=this.getShape(),h=this.getAttachmentPoint(),i=this.getOrigin();this._border.visible=f!==d.BoxNoOutline;this._line.visible=f===d.BoxLine||f===d.CircleLine;this._triangle.visible=false;if(h){p.copy(h).applyMatrix4(b.matrixWorldInverse).applyMatrix4(b.projectionMatrix);h=p.w>0?h:null;var l=(p.x/p.w)*a.width/a.height,m=p.y/p.w;o.set(l-i.x,m-i.y,0).multiplyScalar(a.height);}switch(f){default:case d.Box:case d.BoxLine:case d.BoxNoOutline:this._createBoxViewport(s.x,s.y,h?o:null,f);break;case d.Circle:case d.CircleLine:case d.CirclePointer:case d.CircleArrow:case d.CircleBubbles:case d.SolidPointer:case d.SolidArrow:this._createCircleViewport(s.x,s.y,h?o:null,f);break;}if(this._line.visible){this._createLine(o);}};e.prototype._updateBorderTexture=function(a){var b=Math.round(this.getBorderWidth()*a);this._borderWidth=b+2;var f=THREE.Math.ceilPowerOfTwo(this._borderWidth);this._borderU=this._borderWidth/f;this._borderWidth/=a;var h=new ArrayBuffer(f*4);var l=new Uint32Array(h);var m=new THREE.Color(this.getBorderColor());m=(m.r*255)|((m.g*255)<<8)|((m.b*255)<<16)|0xFF000000;l.fill(m&0xFFFFFF);for(var i=1;i<=b;i++){l[i]=m;}var u=new THREE.DataTexture(new Uint8Array(h),f,1,THREE.RGBAFormat,THREE.UnsignedByteType,THREE.UVMapping,THREE.ClampToEdgeWrapping,THREE.ClampToEdgeWrapping,THREE.LinearFilter,THREE.LinearFilter);u.needsUpdate=true;this._border.material.map=u;this._border.material.needsUpdate=true;this._line.material=this._border.material;};function F(a){var m=a.elements;var i=m[15]===1;var b=2/m[0];var f=2/m[5];var h,l;if(i){h=-m[12]*b;l=-m[13]*f;}else{h=m[8]*b;l=m[9]*f;}var u=(b+h)*0.5;var w=h-u;var x=(f+l)*0.5;var y=l-x;return{left:w,top:x,right:u,bottom:y};}function G(a,b){var m=a.elements;var i=m[15]===1;m[0]=2/(b.right-b.left);m[5]=2/(b.top-b.bottom);if(i){m[12]=-(b.right+b.left)/(b.right-b.left);m[13]=-(b.top+b.bottom)/(b.top-b.bottom);}else{m[8]=(b.right+b.left)/(b.right-b.left);m[9]=(b.top+b.bottom)/(b.top-b.bottom);}}function H(a,b,s,f){var w=s.x/f.width;var h=s.y/f.height;p.copy(b).applyMatrix4(a.matrixWorldInverse).applyMatrix4(a.projectionMatrix);var x=((p.x/p.w)-w)*0.5+0.5;var y=((p.y/p.w)-h)*0.5+0.5;var i=F(a.projectionMatrix);var l={};l.left=THREE.Math.lerp(i.left,i.right,x);l.right=THREE.Math.lerp(i.left,i.right,x+w);l.top=THREE.Math.lerp(i.top,i.bottom,1-y-h);l.bottom=THREE.Math.lerp(i.top,i.bottom,1-y);G(a.projectionMatrix,l);}e.prototype._render=function(a,b,f,h,i){var l=a.getSize(),m=a.getPixelRatio(),u=this.getOrigin(),w=this._node,x=w.position;if(!this._border.material.map){this._updateBorderTexture(m);}s.copy(this.getSize()).multiplyScalar(l.height*0.5);s.set(Math.round(s.x)<<1,Math.round(s.y)<<1);x.set(u.x*l.height/l.width,u.y,0).unproject(b);p.copy(x).applyMatrix4(b.matrixWorldInverse).applyMatrix4(b.projectionMatrix);var y=((p.x/p.w)*0.5+0.5)*l.width,I=((p.y/p.w)*0.5+0.5)*l.height;var J=p.w/(l.width*b.projectionMatrix.elements[0]);w.scale.setScalar(J);k.setFromMatrixColumn(b.matrixWorld,0).multiplyScalar(J*2*(Math.round(y)-y));n.setFromMatrixColumn(b.matrixWorld,1).multiplyScalar(J*2*(Math.round(I)-I));x.add(k).add(n);w.quaternion.copy(b.quaternion);w.updateMatrixWorld();this._updateGeometry(s,l,b);r.copy(s).multiplyScalar(m);if(!this._renderTarget||this._renderTarget.width!==r.x||this._renderTarget.height!==r.y){this._renderTarget=new THREE.WebGLRenderTarget(r.x,r.y,{minFilter:THREE.LinearFilter,magFilter:THREE.NearestFilter,format:THREE.RGBFormat});this._billboard.material.map=this._renderTarget.texture;this._billboard.material.needsUpdate=true;}var K;if(this.getType()===D.Cutaway){K=b;v.copy(K.projectionMatrix);H(K,x,s,l);}else{K=this.getCamera();K.adjustClipPlanes(h);K.update(s.x,s.y);K=K.getCameraRef();}f.children.forEach(function(R){if(R.userData._vkDynamicObjects){R.userData._vkDynamicObjects.forEach(function(S){if(S.layers.test(b.layers)){if(S.isBillboard){S.visible=false;}else{S._vkUpdate(a,K,s);}}});}});if(i){i.position.copy(K.position);}var L=b.layers.mask,M=~L;var N=this.getTargetNodes();var Q=this.getTargetNodes();if(Array.isArray(Q)){N.forEach(function(w){w.userData.mask=w.layers.mask;w.layers.mask|=L;});}if(Array.isArray(Q)){Q.forEach(function(w){w.userData.mask=w.layers.mask;w.layers.mask&=M;});}a.setClearColor(this._backgroundColor,1);a.render(f,K,this._renderTarget,true);if(K===b){b.projectionMatrix.copy(v);}if(Array.isArray(N)){N.forEach(function(w){w.layers.mask=w.userData.mask;});}if(Array.isArray(Q)){Q.forEach(function(w){w.layers.mask=w.userData.mask;});}a.render(this._node,b);f.children.forEach(function(R){if(R.userData._vkDynamicObjects){R.userData._vkDynamicObjects.forEach(function(S){if(S.layers.test(b.layers)&&S.isBillboard){S.visible=true;}});}});};return e;});