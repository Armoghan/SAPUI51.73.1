/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/mdc/library','sap/ui/mdc/field/FieldHelpBase','sap/ui/mdc/condition/Condition','sap/ui/base/ManagedObjectObserver','sap/ui/model/FormatException','sap/ui/model/ParseException','sap/ui/model/json/JSONModel'],function(l,F,C,M,a,P,J){"use strict";var L;var S;var m;var b;var B=F.extend("sap.ui.mdc.field.BoolFieldHelp",{metadata:{library:"sap.ui.mdc"}});B.prototype.init=function(){F.prototype.init.apply(this,arguments);this._oObserver=new M(d.bind(this));this._oObserver.observe(this,{properties:["filterValue","conditions"]});this._oModel=new J({"type":"","items":[{"key":true,"text":"true"},{"key":false,"text":"false"}]});this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");};B.prototype.exit=function(){F.prototype.exit.apply(this,arguments);this._oObserver.disconnect();this._oObserver=undefined;this._oModel.destroy();this._oModel=undefined;};B.prototype.connect=function(o){F.prototype.connect.apply(this,arguments);n.call(this);return this;};B.prototype._createPopover=function(){var p=F.prototype._createPopover.apply(this,arguments);if((!L||!S||!m)&&!this._bListRequested){L=sap.ui.require("sap/m/List");S=sap.ui.require("sap/m/StandardListItem");m=sap.ui.require("sap/m/library");b=sap.ui.require("sap/ui/model/Filter");if(!L||!S||!m){sap.ui.require(["sap/m/List","sap/m/StandardListItem","sap/m/library","sap/ui/model/Filter"],c.bind(this));this._bListRequested=true;}}if(p){var o=this._getField();if(o){p.setInitialFocus(o);}_.call(this);}return p;};function _(){if(!this._oList&&L&&S&&m&&!this._bListRequested){var i=new S({type:m.ListType.Active,title:"{text}"});this._oList=new L(this.getId()+"-List",{width:"100%",showNoData:false,mode:m.ListMode.SingleSelectMaster,rememberSelections:false,items:{path:"/items",template:i},itemPress:e.bind(this)});this._oList.setModel(this._oModel);f.call(this,this.getFilterValue());g.call(this);this._setContent(this._oList);if(this._bNavigate){this._bNavigate=false;this.navigate(this._iStep);this._iStep=null;}}}function c(i,s,o,p){L=i;S=s;m=o;b=p;this._bListRequested=false;if(!this._bIsBeingDestroyed){_.call(this);}}B.prototype.open=function(s){var p=this.getAggregation("_popover");if(p){var o=this._getField();p.setInitialFocus(o);}F.prototype.open.apply(this,arguments);return this;};B.prototype._handleAfterClose=function(E){F.prototype._handleAfterClose.apply(this,arguments);if(this._bUpdateFilterAfterClose){this._bUpdateFilterAfterClose=false;f.call(this);}};function d(o){if(o.name==="conditions"){h.call(this,o.current);}if(o.name==="filterValue"){if(this._oList){if(this._bClosing){this._bUpdateFilterAfterClose=true;}else{f.call(this,o.current);}}}}B.prototype.openByTyping=function(){return true;};B.prototype.navigate=function(s){var p=this._getPopover();if(!p||!this._oList){this._bNavigate=true;this._iStep=s;return;}var o=this._oList.getSelectedItem();var i=this._oList.getItems();var I=i.length;var q=0;if(o){q=this._oList.indexOfItem(o);q=q+s;if(q<0){q=0;}else if(q>=I-1){q=I-1;}}else if(s>=0){q=s-1;}else{q=I+s;}var r=i[q];if(r){if(!p.isOpen()){this.open();}if(r!==o){r.setSelected(true);var K=j.call(this,r);var t=k.call(this,K);this.setProperty("conditions",[t],true);this.fireNavigate({value:r.getTitle(),key:K,condition:t});}}};B.prototype.getTextForKey=function(K){if(K===null||K===undefined||K===""){return null;}var I=this._oModel.getData()["items"];for(var i=0;i<I.length;i++){var o=I[i];if(o["key"]===K){return o["text"];}}var E=this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[K]);throw new a(E);};B.prototype.getKeyForText=function(t){if(!t){return null;}var I=this._oModel.getData()["items"];for(var i=0;i<I.length;i++){var o=I[i];if(o["text"]===t){return o["key"];}}var E=this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[t]);throw new P(E);};function e(E){var i=E.getParameter("listItem");var s=i.getSelected();if(s){var K=j.call(this,i);var o=k.call(this,K);this.setProperty("conditions",[o],true);this.close();this.fireSelect({conditions:[o],add:true});}}function f(t){var o=this._oList.getBinding("items");if(t){var i=new b({path:"text",operator:"StartsWith",value1:t});o.filter(i);}else{o.filter();}this._oList.invalidate();g.call(this);}function g(){if(this._oList){var o=this.getConditions();var s;var t;var I=this._oList.getItems();if(o.length>0&&(o[0].operator==="EEQ"||o[0].operator==="EQ")){s=o[0].values[0];t=this.getTextForKey(s);}for(var i=0;i<I.length;i++){var p=I[i];if(p.getTitle()===t){p.setSelected(true);}else{p.setSelected(false);}}}}function h(i){g.call(this);}function j(i){var o=i.getBindingContext();var D=o&&o.getObject();if(D){return D["key"];}}function k(K){var o;var t=this.getTextForKey(K);if(t){o=C.createItemCondition(K,t);}return o;}function n(){if(this._oField){var t=this._oField._getDataType();var D=this._oModel.getData();if(t&&D["type"]!==t.getMetadata().getName()){D["type"]=t.getMetadata().getName();var I=D["items"];for(var i=0;i<I.length;i++){var o=I[i];o["text"]=t.formatValue(o["key"],"string");}}}}return B;},true);