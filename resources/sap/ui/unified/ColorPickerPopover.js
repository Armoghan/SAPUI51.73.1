/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/Device','sap/m/Button','sap/m/ResponsivePopover','./ColorPicker','./library','sap/m/library',"sap/ui/thirdparty/jquery"],function(C,D,B,R,a,l,L,q){"use strict";var P=L.PlacementType;var b=l.ColorPickerMode,c=l.ColorPickerDisplayMode;var d=L.ButtonType;var e=C.extend("sap.ui.unified.ColorPickerPopover",{metadata:{library:"sap.ui.unified",publicMethods:["openBy","close"],properties:{colorString:{type:"string",group:"Misc",defaultValue:null},mode:{type:"sap.ui.unified.ColorPickerMode",group:"Appearance",defaultValue:b.HSV},displayMode:{type:"sap.ui.unified.ColorPickerDisplayMode",group:"Appearance",defaultValue:c.Default}},events:{change:{parameters:{r:{type:"int"},g:{type:"int"},b:{type:"int"},h:{type:"int"},s:{type:"int"},v:{type:"int"},l:{type:"int"},hex:{type:"string"},alpha:{type:"string"}}}}},renderer:{}});var o=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");var F={COLOR_PICKER_PROPS:{colorString:"setColorString",mode:"setMode",displayMode:"setDisplayMode"},POPOVER_METHODS:{getDomRef:"",close:""}};e.prototype.init=function(){this._oPopover=null;this._bPopoverDestroying=null;};e.prototype.exit=function(){this._bPopoverDestroying=true;if(this._oPopover){this._oPopover.removeDelegate(this._oPopover._onAfterRenderingDelegate);this._oPopover.destroy();this._oPopover=null;}};e.prototype.openBy=function(f){return R.prototype.openBy.apply(this._ensurePopover(),arguments);};e.prototype._getColorPicker=function(){return this._ensurePopover().getContent()[0];};e.prototype._ensurePopover=function(){if(!this._oPopover){this._oPopover=this._createPopover();}return this._oPopover;};e.prototype._createPopover=function(){var p,f=this._createColorPicker(),g,t=this;p=new R(this.getId()+"-colorPickerPopover",{showHeader:D.system.phone,placement:P.VerticalPreferredBottom,showArrow:false,showCloseButton:false,beginButton:new B({text:o.getText("COLOR_PICKER_SUBMIT"),type:d.Emphasized,press:function(){t.fireChange(t._oLastChangeCPParams);p.close();}}),endButton:new B({text:o.getText("COLOR_PICKER_CANCEL"),press:function(){p.close();}}),title:o.getText("COLOR_PICKER_TITLE"),content:f});f.attachEvent("change",function(E){this._handleChange(E);}.bind(this));g={onAfterRendering:function(){var $=this.$();$.attr("aria-modal","true");$.attr("aria-label",this.getTitle());}};p.addEventDelegate(g,p);p._onAfterRenderingDelegate=g;return p;};e.prototype._handleChange=function(E){var t={};this._oLastChangeCPParams=q.extend(t,E.getParameters());delete this._oLastChangeCPParams.id;return this;};e.prototype._createColorPicker=function(){var f=new a(this.getId()+"-color_picker");return f;};e.prototype.setProperty=function(p,v,s){var t;if(F.COLOR_PICKER_PROPS[p]!==undefined){t=F.COLOR_PICKER_PROPS[p]||p;a.prototype[t].call(this._getColorPicker(),v);}return C.prototype.setProperty.apply(this,arguments);};Object.keys(F.POPOVER_METHODS).forEach(function(s){var t=F.POPOVER_METHODS[s]||s;e.prototype[s]=function(){if(this._bPopoverDestroying){return null;}var p=this._ensurePopover();return p[t].apply(p,arguments);};});return e;});