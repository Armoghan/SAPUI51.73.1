/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./library','sap/ui/core/Core','sap/ui/Device','./NotificationListBase','sap/ui/core/InvisibleText','sap/ui/core/IconPool','sap/ui/core/Icon','sap/ui/core/ResizeHandler','sap/m/Link','sap/m/Avatar',"sap/ui/events/KeyCodes",'./NotificationListItemRenderer'],function(l,C,D,N,I,a,b,R,L,A,K,c){'use strict';var d=C.getLibraryResourceBundle('sap.m'),E=d.getText('NOTIFICATION_LIST_ITEM_SHOW_MORE'),e=d.getText('NOTIFICATION_LIST_ITEM_SHOW_LESS'),f=d.getText('NOTIFICATION_LIST_ITEM_READ'),U=d.getText('NOTIFICATION_LIST_ITEM_UNREAD');var m=44;var g=l.AvatarSize;var h=l.AvatarColor;var i=N.extend('sap.m.NotificationListItem',{metadata:{library:'sap.m',properties:{description:{type:'string',group:'Appearance',defaultValue:''},authorInitials:{type:"string",group:"Data",defaultValue:null},truncate:{type:'boolean',group:'Appearance',defaultValue:true},hideShowMoreButton:{type:'boolean',group:'Appearance',defaultValue:false}},aggregations:{processingMessage:{type:'sap.m.MessageStrip',multiple:false},_showMoreButton:{type:'sap.m.Link',multiple:false,visibility:"hidden"}}}});i.prototype.init=function(){this.setType('Active');this._footerIvisibleText=new I({id:this.getId()+"-invisibleFooterText"});};i.prototype._getAuthorAvatar=function(){var j=new A({initials:this.getAuthorInitials(),src:this.getAuthorPicture(),backgroundColor:h.Random,displaySize:g.XS});return j;};i.prototype.onBeforeRendering=function(){N.prototype.onBeforeRendering.call(this);if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}};i.prototype.onAfterRendering=function(){if(this.getHideShowMoreButton()){return;}this._updateShowMoreButtonVisibility();if(this.getDomRef()){this._resizeListenerId=R.register(this.getDomRef(),this._onResize.bind(this));}};i.prototype.onfocusin=function(j){N.prototype.onfocusin.apply(this,arguments);if(!D.browser.msie){return;}var t=j.target;if(t!==this.getDomRef()&&!t.classList.contains('sapMBtn')&&!t.classList.contains('sapMLnk')){j.preventDefault();j.stopImmediatePropagation();this.focus();}};i.prototype.onkeydown=function(j){if(j.target!==this.getDomRef()){return;}var n=this.getParent(),v,k;if(!n||!n.isA('sap.m.NotificationListGroup')){return;}v=n.getVisibleItems();k=v.indexOf(this);switch(j.which){case K.ARROW_UP:if(k===0){return;}var p=k-1;v[p].focus();break;case K.ARROW_DOWN:var o=k+1;if(o===v.length){return;}v[o].focus();break;}};i.prototype.exit=function(){if(this._resizeListenerId){R.deregister(this._resizeListenerId);this._resizeListenerId=null;}if(this._footerIvisibleText){this._footerIvisibleText.destroy();this._footerIvisibleText=null;}};i.prototype._onResize=function(){this._updateShowMoreButtonVisibility();};i.prototype._updateShowMoreButtonVisibility=function(){var $=this.$(),t=$.find('.sapMNLITitleText')[0],j=$.find('.sapMNLIDescription')[0],k;if($.length>0){k=t.scrollHeight>m||j.scrollHeight>m;}this._getShowMoreButton().setVisible(k);};i.prototype._getShowMoreButton=function(){var s=this.getAggregation('_showMoreButton');if(!s){s=new L(this.getId()+'-showMoreButton',{text:this.getTruncate()?E:e,press:function(){var t=!this.getTruncate();this._getShowMoreButton().setText(t?E:e);this.setTruncate(t);}.bind(this)});this.setAggregation("_showMoreButton",s,true);}return s;};i.prototype._getFooterInvisibleText=function(){var r=this.getUnread()?U:f,j=d.getText('NOTIFICATION_LIST_ITEM_DATETIME_PRIORITY',[this.getDatetime(),this.getPriority()]),k=this.getAuthorName(),n=[r];if(k){k=d.getText('NOTIFICATION_LIST_ITEM_CREATED_BY');n.push(k);n.push(this.getAuthorName());}n.push(j);return this._footerIvisibleText.setText(n.join(' '));};return i;});