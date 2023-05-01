/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Core','sap/ui/core/Control','sap/ui/core/Element','sap/ui/Device','./ListItemBase','./Text','./Image','./Button','./ToolbarSeparator','sap/m/OverflowToolbar','sap/m/OverflowToolbarLayoutData','sap/ui/core/IconPool','sap/ui/core/Icon','sap/ui/core/library'],function(l,C,a,E,D,L,T,I,B,b,O,c,d,e,f){'use strict';var P=f.Priority;var g=l.ButtonType;var h=l.OverflowToolbarPriority;var r=C.getLibraryResourceBundle('sap.m'),j=r.getText('NOTIFICATION_LIST_ITEM_CLOSE'),k=r.getText('NOTIFICATION_LIST_GROUP_CLOSE');var N=L.extend('sap.m.NotificationListBase',{metadata:{library:'sap.m',properties:{priority:{type:'sap.ui.core.Priority',group:'Appearance',defaultValue:P.None},title:{type:'string',group:'Appearance',defaultValue:''},datetime:{type:'string',group:'Appearance',defaultValue:''},showButtons:{type:'boolean',group:'Behavior',defaultValue:true},showCloseButton:{type:'boolean',group:'Behavior',defaultValue:true},authorName:{type:'string',group:'Appearance',defaultValue:''},authorPicture:{type:'sap.ui.core.URI',multiple:false}},aggregations:{buttons:{type:'sap.m.Button',multiple:true},_overflowToolbar:{type:'sap.m.OverflowToolbar',multiple:false,visibility:"hidden"},_priorityIcon:{type:'sap.ui.core.Icon',multiple:false,visibility:"hidden"}},events:{close:{}}}});N.prototype._activeHandling=function(){};N.prototype.updateSelectedDOM=function(){};N.prototype.getAccessibilityText=function(){return'';};N.prototype.getButtons=function(){return this._getOverflowToolbar().getContent().filter(function(i){return i!==this._closeButton&&i!==this._toolbarSeparator;},this);};N.prototype.addButton=function(o){var i=this._getOverflowToolbar(),m=i.getContent().length;if(D.system.phone){m-=2;}i.insertContent(o,m);this.invalidate();return this;};N.prototype.insertButton=function(o,i){this._getOverflowToolbar().insertContent(o,i);this.invalidate();return this;};N.prototype.removeButton=function(o){var i=this._getOverflowToolbar().removeContent(o.getId());this.invalidate();return i;};N.prototype.removeAllButtons=function(){var o=this._getOverflowToolbar(),i=this.getButtons();i.forEach(function(m){o.removeContent(m.getId());});this.invalidate();return this;};N.prototype.destroyButtons=function(){var i=this.getButtons();i.forEach(function(m){m.destroy();});this.invalidate();return this;};N.prototype._getOverflowToolbar=function(){var o=this.getAggregation('_overflowToolbar');if(!o){o=new O(this.getId()+'-overflowToolbar',{});this.setAggregation("_overflowToolbar",o,true);if(D.system.phone){var i=this._getCloseButton();i.setLayoutData(new c({priority:h.AlwaysOverflow}));this._toolbarSeparator=new b();this._toolbarSeparator.setLayoutData(new c({priority:h.AlwaysOverflow}));o.addContent(this._toolbarSeparator);o.addContent(i);}}return o;};N.prototype._getCloseButton=function(){var i=this._closeButton;if(!i){if(D.system.phone){this._closeButton=new B(this.getId()+'-closeButtonOverflow',{text:this.isA("sap.m.NotificationListItem")?j:k,type:g.Default,press:function(){this.close();}.bind(this)});}else{this._closeButton=new B(this.getId()+'-closeButtonX',{icon:d.getIconURI('decline'),type:g.Transparent,tooltip:this.isA("sap.m.NotificationListItem")?j:k,press:function(){this.close();}.bind(this)});}}return this._closeButton;};N.prototype.exit=function(){if(this._closeButton){this._closeButton.destroy();}if(this._toolbarSeparator){this._toolbarSeparator.destroy();}};N.prototype._hasActionButtons=function(){return this.getShowButtons()&&this.getButtons().length;};N.prototype._shouldRenderCloseButton=function(){return!D.system.phone&&this.getShowCloseButton();};N.prototype._shouldRenderOverflowToolbar=function(){var i=this._hasActionButtons();if(D.system.phone){return i||this.getShowCloseButton();}return i;};N.prototype.onBeforeRendering=function(){var m=this.getButtons(),n,o;if(D.system.phone){this._updatePhoneButtons();return;}n=m.length>1?h.AlwaysOverflow:h.NeverOverflow;for(var i=0;i<m.length;i++){o=m[i];o.setLayoutData(new c({priority:i===0?n:h.AlwaysOverflow}));}};N.prototype._updatePhoneButtons=function(){var i=this._getCloseButton(),m=this.isA("sap.m.NotificationListGroup"),n=m?k:j,o=m&&this.getCollapsed(),p=!o&&this._hasActionButtons(),s=this.getShowCloseButton(),q;this.getButtons().forEach(function(t){if(p){q=h.AlwaysOverflow;t.removeStyleClass('sapMNLIBHiddenButton');}else{q=h.NeverOverflow;t.addStyleClass('sapMNLIBHiddenButton');}t.setLayoutData(new c({priority:q}));});if(!s){i.setVisible(false);this._toolbarSeparator.setVisible(false);return;}i.setVisible(true);if(p){i.setText(n);i.setTooltip('');i.setType(g.Default);i.setIcon('');i.setLayoutData(new c({priority:h.AlwaysOverflow}));this._toolbarSeparator.setVisible(true);}else{i.setText('');i.setTooltip(n);i.setType(g.Transparent);i.setIcon(d.getIconURI('decline'));i.setLayoutData(new c({priority:h.NeverOverflow}));this._toolbarSeparator.setVisible(false);}};N.prototype.close=function(){var p=this.getParent();this.fireClose();var H=!!this.getParent();if(!H&&p&&p instanceof E){var i={onAfterRendering:function(){p.focus();p.removeEventDelegate(i);}};p.addEventDelegate(i);}};N.prototype._getPriorityIcon=function(){var p=this.getAggregation('_priorityIcon');if(!p){p=new e({src:'sap-icon://message-error'});this.setAggregation("_priorityIcon",p,true);}return p;};return N;});
