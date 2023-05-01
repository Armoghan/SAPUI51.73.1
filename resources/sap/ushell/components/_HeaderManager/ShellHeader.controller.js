// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/Device","sap/ui/model/json/JSONModel","sap/ushell/EventHub","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ushell/ui/shell/OverflowListItem","sap/ushell/Config","sap/m/library","sap/ui/performance/Measurement"],function(C,D,J,E,A,O,a,l,M){"use strict";var L=l.ListType;return C.extend("sap.ushell.components._HeaderManager.ShellHeader",{shellUpdateAggItem:function(i,c){return sap.ui.getCore().byId(c.getObject());},pressNavBackButton:function(){E.emit("showMeArea",false);A.service().navigateBack();},pressEndItemsOverflow:function(e){var p=sap.ui.getCore().byId("headEndItemsOverflow"),m;if(!p){p=sap.ui.xmlfragment("sap.ushell.renderers.fiori2.HeadEndItemsOverflowPopover",this);m=new J({headEndItems:a.last("/core/shellHeader/headEndItems")});p.setModel(m);}if(p.isOpen()){p.close();}else{if(sap.ui.getCore().byId("shellNotificationsPopover")){E.emit("showNotifications",false);}p.openBy(e.getSource());}},headEndItemsOverflowItemFactory:function(i,c){var h=sap.ui.getCore().byId(c.getObject()),f=h.getBindingInfo("floatingNumber");var o=new O({id:i+"-"+h.getId(),icon:h.getIcon(),iconInset:true,title:h.getText(),type:L.Active,press:function(){if(h){h.firePress();}var p=sap.ui.getCore().byId("headEndItemsOverflow");if(p.isOpen()){p.close();}}});if(f){var m=h.getModel();o.setModel(m);o.bindProperty("floatingNumber",f);}return o;},destroyHeadEndItemsOverflow:function(e){e.getSource().destroy();},isHeadEndItemInOverflow:function(b){return b!=="ENDITEMSOVERFLOWBTN"&&!this.isHeadEndItemNotInOverflow(b);},isHeadEndItemNotInOverflow:function(b){var o=this.isHeadEndItemOverflow();var s=D.media.getCurrentRange(D.media.RANGESETS.SAP_STANDARD).name;if(b==="ENDITEMSOVERFLOWBTN"){return o;}if(!o){return true;}if(["MEAREAHEADERBUTTON","BACKBTN"].indexOf(b)>-1){return true;}if(s==="Phone"){return false;}if(["SF","FLOATINGCONTAINERBUTTON"].indexOf(b)>-1){return true;}if(s==="Desktop"&&b==="COPILOTBTN"){return true;}return false;},isHeadEndItemOverflow:function(){var n=0,e,b=a.last("/core/shellHeader/headEndItems");if(b.indexOf("endItemsOverflowBtn")===-1){return false;}var c=D.media.getCurrentRange(D.media.RANGESETS.SAP_STANDARD).name;var d=3;if(c==="Phone"){d=1;}for(var i=0;i<b.length;i++){e=sap.ui.getCore().byId(b[i]);if(e&&e.getVisible()){n++;}}if(sap.ui.getCore().byId("endItemsOverflowBtn").getVisible()){return n>d+1;}return n>d;},handleNavigationMenuItemPress:function(e){var d=e.getSource().getCustomData();if(d&&d.length>0){for(var i=0;i<d.length;i++){if(d[i].getKey()==="intent"){var s=d[i].getValue();if(s&&s[0]==="#"){this.navigateFromShellApplicationNavigationMenu(s);return;}}}}},navigateFromShellApplicationNavigationMenu:function(i){if(window.hasher.getHash()!==i.substr(1)){E.emit("centerViewPort",Date.now());window.hasher.setHash(i);}var s=sap.ui.getCore().byId("shellAppTitle");if(s){s.close();}},handleUserSettingsPress:function(){E.emit("openUserSettings",Date.now());},handleAppFinderPress:function(){M.start("FLP:AppFinderLoadingStartToEnd","AppFinderLoadingStartToEnd","FLP");sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(c){c.toExternal({target:{semanticObject:"Shell",action:"appfinder"}});});}});});