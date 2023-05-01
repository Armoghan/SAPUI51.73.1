/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/core/ResizeHandler','sap/base/Log','./SimpleFixFlexRenderer'],function(C,R,L){"use strict";var S=C.extend("sap.m.SimpleFixFlex",{metadata:{library:"sap.m",aggregations:{fixContent:{type:"sap.ui.core.Control",multiple:false},flexContent:{type:"sap.ui.core.Control",multiple:true}},properties:{fitParent:{type:"boolean",group:"Appearance",defaultValue:true}}}});S.FIX_AREA_CHARACTER_COUNT_RECOMMENDATION=200;S.FIX_AREA_CHARACTERS_ABOVE_RECOMMENDED_WARNING="It is recommended to use less than "+S.FIX_AREA_CHARACTER_COUNT_RECOMMENDATION+" characters as a value state text.";S.prototype.onBeforeRendering=function(){this._deregisterFixContentResizeHandler();var f=this.getFixContent();if(f&&f.isA("sap.m.Text")&&f.getText().length>S.FIX_AREA_CHARACTER_COUNT_RECOMMENDATION){L.warning(S.FIX_AREA_CHARACTERS_ABOVE_RECOMMENDED_WARNING,"",this.getId());}};S.prototype.onAfterRendering=function(){if(this.getFitParent()){this._registerFixContentResizeHandler();}};S.prototype._registerFixContentResizeHandler=function(){var f=this.getFixContent();if(!this._sResizeListenerId&&f&&f.getDomRef()){this._sResizeListenerId=R.register(f.getDomRef(),this._onFixContentResize.bind(this));this._onFixContentResize();}};S.prototype._deregisterFixContentResizeHandler=function(){if(this._sResizeListenerId){R.deregister(this._sResizeListenerId);this._sResizeListenerId=null;}};S.prototype._onFixContentResize=function(){var $=this.$(),a=this.getFixContent().$(),f=a.get(0);if(!f||!f.clientHeight){return null;}$.css("padding-top",f.clientHeight);a.addClass("sapUiSimpleFixFlexFixedWrap");};S.prototype.exit=function(){this._deregisterFixContentResizeHandler();};return S;});