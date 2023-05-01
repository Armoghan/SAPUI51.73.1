/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BasePanel","sap/ui/core/Fragment"],function(B,F){"use strict";var S=B.extend("sap.ui.mdc.p13n.SortPanel",{library:"sap.ui.mdc",metadata:{},init:function(){var f,r,s;B.prototype.init.apply(this,arguments);f=F.createId(this.getId(),"SortPanelFragment");F.load({name:"sap.ui.mdc.p13n.SortPanel",id:f,controller:this}).then(function(o){this.setTemplate(o);r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");this.setPanelColumns([r.getText("sort.PERSONALIZATION_DIALOG_COLUMN_DESCRIPTION"),r.getText("sort.PERSONALIZATION_DIALOG_COLUMN_SORTORDER")]);this._oSortOrderSelect=F.byId(f,"sortOrderSelect");if(this._oSortOrderSelect){s=this._oSortOrderSelect.getItems();}if(s){s[0].setText(r.getText("sort.PERSONALIZATION_DIALOG_OPTION_ASCENDING"));s[1].setText(r.getText("sort.PERSONALIZATION_DIALOG_OPTION_DESCENDING"));}}.bind(this));},renderer:{}});S.prototype.onChangeOfSortOrder=function(e){var s=e.getParameter("selectedItem");if(s){this.fireChange();}};return S;},true);
