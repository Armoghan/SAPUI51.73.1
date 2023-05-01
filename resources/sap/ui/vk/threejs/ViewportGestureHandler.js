/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/
sap.ui.define(["jquery.sap.global","sap/ui/base/EventProvider","./PerspectiveCamera","./OrthographicCamera","./thirdparty/three","../getResourceBundle"],function(q,E,P,O,t,g){"use strict";var V=E.extend("sap.ui.vk.threejs.ViewportGestureHandler",{metadata:{},constructor:function(v){this._matProj=null;this._viewport=v;this._rect=null;this._evt={x:0,y:0,z:0,d:0,initd:0};this._gesture=false;this._viewport.attachEvent("resize",this,this._onresize);this._nomenu=false;var T=function(a){var v=a;var b=new THREE.Vector3();var z=new THREE.Vector2();var A=0.001;var M=-Math.PI/2+A;var c=Math.PI/2-A;this.isTurnTableMode=true;this._timeIntervalForCameraAnimation=500;this._startTimeForCameraAnimation=0;this._newCamera=null;this._oldCamera=null;this._animationType=null;this._zoomedNodeRef=null;this._isZoomIn=true;this.beginGesture=function(x,y){var s=v.getScene();if(s==null){return;}var d=s.getSceneRef();var e=v.getCamera().getCameraRef();var f=v.getRenderer().getSize();z.x=x/f.width*2-1;z.y=y/f.height*-2+1;v._gesturePoint={x:x,y:y};var h=v.hitTest(x,y,d,e);if(h){b.copy(h.point);}else{var i=new THREE.Box3();d._expandBoundingBox(i,v._getLayers(),true);if(!i.isEmpty()){i.getCenter(b);}else{b.setScalar(0);}}};this.endGesture=function(){};this.pan=function(d,e){if(v.getFreezeCamera()||v.getCamera()==null){return;}if(d===0&&e===0){return;}var f=v.getCamera().getCameraRef();var s=v.getRenderer().getSize();if(f.view&&f.view.enabled){f.view.offsetX-=d*f.zoom*f.view.width/f.view.fullWidth;f.view.offsetY-=e*f.zoom*f.view.height/f.view.fullHeight;f.updateProjectionMatrix();}else{var o=b.clone().project(f);o.x-=d*2/s.width;o.y+=e*2/s.height;o.unproject(f).sub(b);f.position.add(o);f.updateMatrixWorld();}v.fireCameraChanged({position:f.position.toArray()});};this.rotate=function(d,e,i){if(v.getFreezeCamera()||v.getCamera()==null){return;}if(i!==undefined){this.isTurnTableMode=i;}if(d===0&&e===0){return;}var f=v.getCamera().getCameraRef(),h=d*-0.01,j=e*-0.01;var o=f.position.clone().sub(b);var l=new THREE.Vector3(),u=new THREE.Vector3().setFromMatrixColumn(f.matrixWorld,1).normalize(),r=new THREE.Vector3().setFromMatrixColumn(f.matrixWorld,0).normalize();f.getWorldDirection(l);l.normalize();var k=new THREE.Quaternion(),m=new THREE.Quaternion();if(this.isTurnTableMode){var s=new THREE.Vector3(0,1,0);r.crossVectors(l,s).normalize();u.crossVectors(r,l);var p=Math.atan2(l.y,Math.sqrt(l.x*l.x+l.z*l.z));k.setFromAxisAngle(s,h);m.setFromAxisAngle(r,THREE.Math.clamp(j,M-p,c-p));}else{k.setFromAxisAngle(u,h);m.setFromAxisAngle(r,j);}k.multiply(m);o.applyQuaternion(k);l.applyQuaternion(k);u.applyQuaternion(k);o.add(b);f.position.copy(o);f.up.copy(u);f.lookAt(o.add(l));f.updateMatrixWorld();v.fireCameraChanged({position:f.position.toArray(),quaternion:f.quaternion.toArray()});};this.zoom=function(d){if(d===0||d===1||v.getFreezeCamera()||v.getCamera()===null||v.getScene()===null){return;}var e=v.getCamera().getCameraRef();var h=new THREE.Vector3();if(!e.userData.isRedlineActivated){var i=100;var j=new THREE.Box3();var k=new THREE.Vector3();v.getScene().getSceneRef()._expandBoundingBox(j,v._getLayers(),true);j.applyMatrix4(e.matrixWorldInverse);j.min.z=Math.max(j.min.z,e.near);j.max.z=Math.max(j.max.z,e.near);j.applyMatrix4(e.projectionMatrix);j.getSize(k);var l=v.getRenderer().getSize();var s=k.x*l.width*0.5;var m=k.y*l.height*0.5;if(s<i&&m<i&&d<1){return;}}if(e.isPerspectiveCamera){if(e.view&&e.view.enabled){var n=v.getDomRef();var x=v._gesturePoint.x/n.clientWidth;var y=v._gesturePoint.y/n.clientHeight;var f=1/d;e.view.offsetX+=x*e.view.width;e.view.offsetY+=y*e.view.height;e.view.width*=f;e.view.height*=f;e.view.offsetX-=x*e.view.width;e.view.offsetY-=y*e.view.height;}else{h.set(z.x,z.y,1).unproject(e);h.sub(new THREE.Vector3(z.x,z.y,-1).unproject(e));var o=b.clone().sub(e.position).length()*(1-1/d);h.setLength(o);e.position.add(h);}}else if(e.isOrthographicCamera){h.set(z.x,z.y,1).unproject(e);h.sub(new THREE.Vector3(0,0,1).unproject(e));h.multiplyScalar(1-1/d);e.zoom*=d;e.position.add(h);}else{q.sap.log.error(g().getText("VIEWPORTGESTUREHANDLER_MSG_UNSUPPORTEDCAMERATYPE"));}e.updateProjectionMatrix();e.updateMatrixWorld();var p={position:e.position.toArray()};if(e.isOrthographicCamera){p.zoom=e.zoom;}v.fireCameraChanged(p);};this.animateCameraUpdate=function(){if(this._newCamera===null||this._oldCamera===null){return;}if(v.getCamera()==null){this._newCamera=null;this._oldCamera=null;return;}function s(f,h,x){x=THREE.Math.clamp((x-f)/(h-f),0.0,1.0);return x*x*x*(x*(x*6-15)+10);}var i=Math.min((Date.now()-this._startTimeForCameraAnimation)/this._timeIntervalForCameraAnimation,1);i=s(0,1,i);var d=v.getCamera().getCameraRef();if(d.isOrthographicCamera&&this._newCamera.isOrthographicCamera&&this._oldCamera.isOrthographicCamera){d.left=THREE.Math.lerp(this._oldCamera.left,this._newCamera.left,i);d.right=THREE.Math.lerp(this._oldCamera.right,this._newCamera.right,i);d.top=THREE.Math.lerp(this._oldCamera.top,this._newCamera.top,i);d.bottom=THREE.Math.lerp(this._oldCamera.bottom,this._newCamera.bottom,i);d.zoom=THREE.Math.lerp(this._oldCamera.zoom,this._newCamera.zoom,i);}if(d.isPerspectiveCamera&&this._newCamera.isPerspectiveCamera&&this._oldCamera.isPerspectiveCamera){d.fov=THREE.Math.lerp(this._oldCamera.fov,this._newCamera.fov,i);d.aspect=THREE.Math.lerp(this._oldCamera.aspect,this._newCamera.aspect,i);}d.far=THREE.Math.lerp(this._oldCamera.far,this._newCamera.far,i);d.near=THREE.Math.lerp(this._oldCamera.near,this._newCamera.near,i);d.updateProjectionMatrix();d.position.lerpVectors(this._oldCamera.position,this._newCamera.position,i);d.scale.lerpVectors(this._oldCamera.scale,this._newCamera.scale,i);d.up.lerpVectors(this._oldCamera.up,this._newCamera.up,i);var o=this._oldCamera.getWorldDirection(new THREE.Vector3());var n=this._newCamera.getWorldDirection(new THREE.Vector3());var e=new THREE.Vector3().lerpVectors(o,n,i);d.lookAt(e.add(d.position));if(i===1){this._newCamera=null;this._oldCamera=null;if(this._animationType==="zooming"&&this._zoomedNodeRef){v.fireNodeZoomed({zoomed:this._zoomedNodeRef,isZoomIn:this._isZoomIn});}v.cameraUpdateCompleted({position:d.position.toArray(),quaternion:d.quaternion.toArray()});}v.fireCameraChanged({position:d.position.toArray(),quaternion:d.quaternion.toArray()});};this.zoomObject=function(n,i,d){if(v.getScene()==null){return;}var e=new THREE.Box3();(i&&n?n:v.getScene().getSceneRef())._expandBoundingBox(e,v._getLayers(),true);this.zoomBox(e,0,d,n,i);};this.zoomBox=function(d,m,e,n,f){this._zoomedNodeRef=n;this._isZoomIn=f;this._animationType="zooming";var h=v.getCamera().getCameraRef();var s=new THREE.Vector3();d.getSize(s);if(s.lengthSq()===0){return;}var j=new THREE.Vector3();h.getWorldDirection(j);j.multiplyScalar(s.length());var k=new THREE.Vector3();d.getCenter(k);var l=[new THREE.Vector3(d.min.x,d.min.y,d.min.z),new THREE.Vector3(d.max.x,d.max.y,d.max.z),new THREE.Vector3(d.min.x,d.min.y,d.max.z),new THREE.Vector3(d.min.x,d.max.y,d.max.z),new THREE.Vector3(d.max.x,d.min.y,d.max.z),new THREE.Vector3(d.max.x,d.max.y,d.min.z),new THREE.Vector3(d.min.x,d.max.y,d.min.z),new THREE.Vector3(d.max.x,d.min.y,d.min.z)];var o=new THREE.Matrix4(),p=new THREE.Vector3();function r(h){o.multiplyMatrices(h.projectionMatrix,h.matrixWorldInverse);for(var i in l){p.copy(l[i]).applyMatrix4(o);if(p.x<-1.0||p.x>1.0||p.y<-1.0||p.y>1.0){return false;}}return true;}this._newCamera=h.clone();this._newCamera.position.copy(k).sub(j);this._newCamera.updateMatrixWorld(true);if(h.isPerspectiveCamera){while(!r(this._newCamera)){this._newCamera.position.sub(j);this._newCamera.updateMatrixWorld(true);}var u=10;var w=this._newCamera.position.clone();var x=k.clone();for(var y=0;y<u;y++){this._newCamera.position.copy(w).add(x).multiplyScalar(0.5);this._newCamera.updateMatrixWorld(true);if(r(this._newCamera)){w.copy(this._newCamera.position);}else{x.copy(this._newCamera.position);}}this._newCamera.position.copy(w).sub(k).multiplyScalar(m).add(w);this._newCamera.updateMatrixWorld(true);}if(h.isOrthographicCamera){var B=new THREE.Box2();l.forEach(function(i){p=i.project(this._newCamera);B.expandByPoint(new THREE.Vector2(p.x,p.y));}.bind(this));this._newCamera.zoom/=Math.max(B.getSize().x,B.getSize().y)*0.5*(1+m);this._newCamera.updateProjectionMatrix();}this._startTimeForCameraAnimation=Date.now();this._timeIntervalForCameraAnimation=e!==undefined?e:500;};this.prepareForCameraUpdateAnimation=function(){this._oldCamera=v.getCamera().getCameraRef().clone();};this.startAnimatingCameraUpdate=function(d,e){var f=v.getCamera().getCameraRef();if(!this._oldCamera){return;}if(!e){var h=0.0001;var n=false;if(f.isOrthographicCamera&&this._oldCamera.isOrthographicCamera){if(Math.abs(f.left-this._oldCamera.left)>h||Math.abs(f.right-this._oldCamera.right)>h||Math.abs(f.top-this._oldCamera.top)>h||Math.abs(f.bottom-this._oldCamera.bottom)>h||Math.abs(f.zoom-this._oldCamera.zoom)>h){n=true;}}else if(f.isPerspectiveCamera&&this._oldCamera.isPerspectiveCamera){if(Math.abs(f.fov-this._oldCamera.fov)>h||Math.abs(f.aspect-this._oldCamera.aspect)>h){n=true;}}if(!n){if(Math.abs(f.position.x-this._oldCamera.position.x)>h||Math.abs(f.position.y-this._oldCamera.position.y)>h||Math.abs(f.position.z-this._oldCamera.position.z)>h||Math.abs(f.scale.x-this._oldCamera.scale.x)>h||Math.abs(f.scale.y-this._oldCamera.scale.y)>h||Math.abs(f.scale.z-this._oldCamera.scale.z)>h||Math.abs(f.quaternion.x-this._oldCamera.quaternion.x)>h||Math.abs(f.quaternion.y-this._oldCamera.quaternion.y)>h||Math.abs(f.quaternion.z-this._oldCamera.quaternion.z)>h||Math.abs(f.quaternion.w-this._oldCamera.quaternion.w)>h){n=true;}}if(!n){v.cameraUpdateCompleted({position:f.position.toArray(),quaternion:f.quaternion.toArray()});return;}}this._newCamera=v.getCamera().getCameraRef().clone();this._timeIntervalForCameraAnimation=d!==undefined?d:500;this._startTimeForCameraAnimation=Date.now();};};this._cameraController=new T(v);}});V.prototype._activateRedline=function(){var c=this._viewport.getCamera().getCameraRef();c.userData.isRedlineActivated=true;if(c.isPerspectiveCamera){var d=this._viewport.getDomRef();c.setViewOffset(d.clientWidth,d.clientHeight,0,0,d.clientWidth,d.clientHeight);}};V.prototype._deactivateRedline=function(){var c=this._viewport.getCamera().getCameraRef();c.userData.isRedlineActivated=false;c.clearViewOffset();};V.prototype.destroy=function(){this._viewport=null;this._rect=null;this._evt=null;this._gesture=false;};V.prototype._getOffset=function(o){var r=o.getBoundingClientRect();var p={x:r.left+window.pageXOffset,y:r.top+window.pageYOffset};return p;};V.prototype._inside=function(e){if(this._rect===null||true){var i=this._viewport.getIdForLabel();var d=document.getElementById(i);if(!d){return false;}var o=this._getOffset(d);this._rect={x:o.x,y:o.y,w:d.offsetWidth,h:d.offsetHeight};}return(e.x>=this._rect.x&&e.x<=this._rect.x+this._rect.w&&e.y>=this._rect.y&&e.y<=this._rect.y+this._rect.h);};V.prototype._onresize=function(e){this._gesture=false;this._rect=null;};V.prototype.beginGesture=function(a){if(this._inside(a)&&!this._gesture){this._gesture=true;var x=a.x-this._rect.x,y=a.y-this._rect.y;this._evt.x=x;this._evt.y=y;this._evt.d=a.d;this._evt.initd=a.d;this._evt.avgd=a.d;this._evt.avgx=0;this._evt.avgy=0;q.sap.log.debug("Loco: beginGesture: "+x+", "+y);this._cameraController.beginGesture(x,y);a.handled=true;if(document.activeElement){try{document.activeElement.blur();}catch(e){}}var d=document.getElementById(this._viewport.getIdForLabel());d.focus();}this._nomenu=false;};V.prototype.move=function(e){if(this._gesture){var x=e.x-this._rect.x,y=e.y-this._rect.y;var d=x-this._evt.x;var a=y-this._evt.y;var b=e.d-this._evt.d;this._evt.x=x;this._evt.y=y;this._evt.d=e.d;this._evt.avgx=this._evt.avgx*0.99+d*0.01;this._evt.avgy=this._evt.avgy*0.99+a*0.01;var z=1.0;if(this._evt.initd>0){z=1.0+b*(1.0/this._evt.initd);}else if(e.n===2){if(e.points[0].y>e.points[1].y){z=1.0-b*0.005;if(z<0.333){z=0.333;}}else{z=1.0+b*0.005;if(z>3){z=3;}}}if(this._evt.initd>0){var c=Math.sqrt(this._evt.avgx*this._evt.avgx+this._evt.avgy*this._evt.avgy);q.sap.log.debug("AvgDist: "+c);if((Math.abs(e.d-this._evt.avgd)/this._evt.avgd)<(c/10)){z=1.0;}}z=THREE.Math.clamp(z,0.88,1.12);this._evt.avgd=this._evt.avgd*0.97+e.d*0.03;switch(e.n){case 1:q.sap.log.debug("Loco: Rotate: "+(d)+", "+(a));this._cameraController.rotate(d,a);break;case 2:q.sap.log.debug("Loco: Pan: "+(d)+", "+(a));if(z!=0&&z!=1.0){q.sap.log.debug("Loco: Zoom: "+(z));}this._cameraController.pan(d,a);if(d<10&&a<10&&z!=0&&z!=1.0){this._cameraController.zoom(z);}break;default:break;}this._nomenu=true;e.handled=true;}};V.prototype.endGesture=function(e){if(this._gesture){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: endGesture: "+x+", "+y);this._cameraController.endGesture();this._gesture=false;e.handled=true;}};V.prototype.click=function(e){if(this._inside(e)&&e.buttons<=1){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: click: "+(x)+", "+(y));if(this._viewport){this._viewport.tap(x,y,false);}e.handled=true;}};V.prototype.doubleClick=function(e){if(this._inside(e)&&e.buttons<=1){var x=e.x-this._rect.x,y=e.y-this._rect.y;q.sap.log.debug("Loco: doubleClick: "+(x)+", "+(y));if(this._viewport){this._viewport.tap(x,y,true);}e.handled=true;}};V.prototype.contextMenu=function(e){if(this._inside(e)||this._nomenu||e.buttons===5){this._nomenu=false;e.handled=true;}};V.prototype.keyEventHandler=function(e){};V.prototype.getViewport=function(){return this._viewport;};V.prototype.activateCamera=function(c,a,e){this._cameraController.prepareForCameraUpdateAnimation();if(this._viewport.getCamera().getCameraRef().isPerspectiveCamera!=c.isPerspectiveCamera){this._viewport.setCamera(c.isPerspectiveCamera?new P():new O());}this._viewport.getCamera().getCameraRef().copy(c);var s=this._viewport.getRenderer().getSize();this._viewport.getCamera().update(s.width,s.height);this._cameraController.startAnimatingCameraUpdate(a,e);return this;};V.prototype.setView=function(a,b){this._cameraController.prepareForCameraUpdateAnimation();var c=this._viewport.getCamera().getCameraRef();if(a){c.quaternion.copy(a);c.updateMatrixWorld();c.up.setFromMatrixColumn(c.matrixWorld,1).normalize();this._cameraController.zoomObject(null,false,b);}else{c.copy(this._viewport._homeCamera?this._viewport._homeCamera:new P().getCameraRef());var s=this._viewport.getRenderer().getSize();this._viewport.getCamera().update(s.width,s.height);this._cameraController.startAnimatingCameraUpdate(b);}return this;};V.prototype.zoomTo=function(b,a,m,c,n,i){this._cameraController.prepareForCameraUpdateAnimation();if(a){var d=this._viewport.getCamera().getCameraRef();d.quaternion.copy(a);d.updateMatrixWorld();d.up.setFromMatrixColumn(d.matrixWorld,1).normalize();}this._cameraController.zoomBox(b,m,c,n,i);return this;};V.prototype.zoomObject=function(n,i,a){this._cameraController.prepareForCameraUpdateAnimation();this._cameraController.zoomObject(n,i,a);return this;};V.prototype.animateCameraUpdate=function(){this._cameraController.animateCameraUpdate();};V.prototype.prepareForCameraUpdateAnimation=function(){this._cameraController.prepareForCameraUpdateAnimation();};V.prototype.startAnimatingCameraUpdate=function(a){this._cameraController.startAnimatingCameraUpdate(a);};return V;});