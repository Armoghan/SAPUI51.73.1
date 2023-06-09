/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/library","sap/ui/core/IconPool","sap/ui/Device","./library","./ListItemBase","./Image","./StandardListItemRenderer"],function(c,I,D,l,L,a,S){"use strict";var T=c.TextDirection;var V=c.ValueState;var b=L.extend("sap.m.StandardListItem",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Misc",defaultValue:null},description:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconInset:{type:"boolean",group:"Appearance",defaultValue:true},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},info:{type:"string",group:"Misc",defaultValue:null},infoState:{type:"sap.ui.core.ValueState",group:"Misc",defaultValue:V.None},adaptTitleSize:{type:"boolean",group:"Appearance",defaultValue:true},titleTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit},infoTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:T.Inherit},wrapping:{type:"boolean",group:"Behavior",defaultValue:false}},designtime:"sap/m/designtime/StandardListItem.designtime"}});b.prototype.exit=function(){if(this._oImage){this._oImage.destroy("KeepDom");}L.prototype.exit.apply(this,arguments);};b.prototype.setIcon=function(i){var o=this.getIcon();this.setProperty("icon",i);if(this._oImage&&(!i||I.isIconURI(i)!=I.isIconURI(o))){this._oImage.destroy("KeepDom");this._oImage=undefined;}return this;};b.prototype._getImage=function(){var i=this._oImage;if(i){i.setSrc(this.getIcon());if(i.setDensityAware){i.setDensityAware(this.getIconDensityAware());}}else{i=I.createControlByURI({id:this.getId()+"-img",src:this.getIcon(),densityAware:this.getIconDensityAware(),useIconTooltip:false},a).setParent(this,null,true);}var s=this.getIconInset()?"sapMSLIImg":"sapMSLIImgNoInset";i.addStyleClass(i instanceof a?s:s+"Icon",true);this._oImage=i;return this._oImage;};b.prototype._activeHandlingInheritor=function(){if(this._oImage){var A=this.getActiveIcon();A&&this._oImage.setSrc(A);}};b.prototype._inactiveHandlingInheritor=function(){if(this._oImage){this._oImage.setSrc(this.getIcon());}};b.prototype.getContentAnnouncement=function(B){var A="",i=this.getInfoState(),t,s="",d,e="",o,f;if(this.getWrapping()){o=this.getDomRef("titleButton");f=this.getDomRef("descriptionButton");t=this._bTitleTextExpanded?this.getTitle():this._getCollapsedText(this.getTitle());d=this._bDescriptionTextExpanded?this.getDescription():this._getCollapsedText(this.getDescription());if(o){s=o.textContent+" "+B.getText("ACC_CTR_TYPE_BUTTON");}if(f){e=f.textContent+" "+B.getText("ACC_CTR_TYPE_BUTTON");}A+=t+" "+s+" "+d+" "+e+" ";}else{A+=this.getTitle()+" "+this.getDescription()+" ";}A+=this.getInfo()+" ";if(i!="None"&&i!=this.getHighlight()){A+=B.getText("LIST_ITEM_STATE_"+i.toUpperCase());}return A;};b.prototype.showCompleteInfoText=function(){return this.getInfo().length<=15;};b.prototype.ontap=function(e){this._checkExpandCollapse(e);if(!e.isMarked()){return L.prototype.ontap.apply(this,arguments);}};b.prototype.onsapspace=function(e){this._checkExpandCollapse(e,true);if(!e.isMarked()){return L.prototype.onsapspace.apply(this,arguments);}};b.prototype._checkExpandCollapse=function(e,p){var t=e.target,i=t&&t.id;if(i&&i===this.getId()+"-titleButton"){if(p){e.preventDefault();}e.setMarked();return this._toggleExpandCollapse("title",this._bTitleTextExpanded);}if(i&&i===this.getId()+"-descriptionButton"){if(p){e.preventDefault();}e.setMarked();return this._toggleExpandCollapse("description",this._bDescriptionTextExpanded);}};b.prototype._toggleExpandCollapse=function(w,t){var o=this.getDomRef(w+"Text"),d=this.getDomRef(w+"ThreeDots"),B=this.getDomRef(w+"Button"),s=w==="title"?this.getTitle():this.getDescription(),r=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(!t){o.textContent=s;d.textContent=" ";B.textContent=r.getText("TEXT_SHOW_LESS");t=true;}else{o.textContent=this._getCollapsedText(s);d.textContent=" ... ";B.textContent=r.getText("TEXT_SHOW_MORE");t=false;}if(w==="title"){this._bTitleTextExpanded=t;}else{this._bDescriptionTextExpanded=t;}};b.prototype._getCollapsedText=function(t){var m=D.system.phone?100:300;return t.substr(0,m);};return b;});
