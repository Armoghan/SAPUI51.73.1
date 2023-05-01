/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/base/Log','sap/base/util/isEmptyObject','sap/ui/core/Component','sap/ui/core/Element','sap/ui/core/Shortcut'],function(L,a,C,E,S){"use strict";var b=E.extend("sap.ui.core.CommandExecution",{metadata:{library:"sap.ui.core",properties:{command:{type:"string"},enabled:{type:"boolean",defaultValue:true},visible:{type:"boolean",defaultValue:true}},events:{execute:{}}},trigger:function(){if(this.getVisible()&&this.getEnabled()){this.fireExecute({});}},setCommand:function(c){if(!this.getCommand()){this.setProperty("command",c,true);}else{L.error("The 'command' property can only be applied initially!");}return this;},_getCommandInfo:function(){var c,o=this.getParent(),d=C.getOwnerComponentFor(this);while(!d&&o&&o.getParent()){d=C.getOwnerComponentFor(o);o=o.getParent();}if(d){c=d.getCommand(this.getCommand());}return c?Object.assign({},c):null;},_createCommandData:function(p){var P=this.getParent(),o=P.getBindingContext("$cmd"),m=P.getModel("$cmd"),d=m.getData(),c=d[P.getId()];if(!c){p=o&&o.getObject();c=Object.create(p||null);}else if(p&&p!==Object.getPrototypeOf(c)){c=Object.create(p);}else if(c[this.getCommand()]){return;}c[this.getCommand()]={};c[this.getCommand()].enabled=this.getEnabled();c[this.getCommand()].visible=this.getVisible();m.setProperty("/"+P.getId(),c);this.bindProperty("enabled",{path:"$cmd>"+this.getCommand()+"/enabled"});this.bindProperty("visible",{path:"$cmd>"+this.getCommand()+"/visible"});P.bindElement("$cmd>/"+P.getId());},setParent:function(p){var t=this,c,o=this.getParent(),s,i;E.prototype.setParent.apply(this,arguments);c=this._getCommandInfo();function m(){if(p.getModel("$cmd")){t._createCommandData();t.getParent().detachModelContextChange(m);}}if(c&&this.getVisible()){if(p&&p!==o){s=c.shortcut;i=S.isRegistered(this.getParent(),s);if(!i){S.register(p,s,this.trigger.bind(this));}if(p.getModel("$cmd")){this._createCommandData();}else{p.attachModelContextChange(m);}var O=p._propagateProperties;p._propagateProperties=function(){var P=p.oPropagatedProperties;var d=P.oBindingContexts["$cmd"];var e=t.getBindingContext("$cmd");if(d&&e&&d!==e){t._createCommandData(d.getObject());}O.apply(p,arguments);};p._propagateProperties._sapui_fnOrig=O;}if(o&&o!=p){s=c.shortcut;i=S.isRegistered(o,s);if(i){S.unregister(o,c.shortcut);}this._cleanupContext(o);}}return this;},_cleanupContext:function(c){if(c.getBindingContext("$cmd")){var o=c.getBindingContext("$cmd").getObject();if(o){delete o[this.getCommand()];}if(a(Object.assign({},o))){c._propagateProperties=c._propagateProperties._sapui_fnOrig;c.unbindElement("$cmd");}}},setVisible:function(v){var p=this.getParent();this.setProperty("visible",v,true);if(p){var c=this._getCommandInfo();var s=c.shortcut;var i=S.isRegistered(this.getParent(),s);if(v&&!i){S.register(p,s,this.trigger.bind(this));}else if(!v&&i){S.unregister(p,s);}}return this;},destroy:function(){var p=this.getParent();if(p){var c=this._getCommandInfo();S.unregister(this.getParent(),c.shortcut);this._cleanupContext(p);}E.prototype.destroy.apply(this,arguments);}});b.find=function(c,s){var i,o,A;A=c.getDependents();for(i=0;i<A.length;i++){if(A[i].isA("sap.ui.core.CommandExecution")&&A[i].getCommand()===s){o=A[i];}}if(!o&&c.getParent()){o=b.find(c.getParent(),s);}return o;};return b;});
