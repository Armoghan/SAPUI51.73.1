/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge","sap/ui/fl/write/connectors/BaseConnector","sap/ui/fl/apply/_internal/connectors/LrepConnector","sap/ui/fl/apply/_internal/connectors/Utils","sap/ui/fl/write/_internal/connectors/Utils","sap/base/util/restricted/_pick"],function(m,B,A,a,W,_){"use strict";var R={FLEX_INFO:"/flex/info/",PUBLISH:"/actions/make_changes_transportable/",CHANGES:"/changes/",VARIANTS:"/variants/",SETTINGS:"/flex/settings",TOKEN:"/actions/getcsrftoken/",APPVARIANTS:"/appdescr_variants/",APPVARIANTS_OVERVIEW:"/app_variant_overview/"};var b=function(p){var r;if(p.isLegacyVariant){r=R.VARIANTS;}else if(p.isAppVariant){r=R.APPVARIANTS;}else{r=R.CHANGES;}var P=_({changelist:p.transport,skipIam:p.skipIam},["changelist","skipIam"]);A._addClientAndLanguageInfo(P);if(p.flexObject&&!p.isAppVariant){p.fileName=p.flexObject.fileName;}var w=a.getUrl(r,p,P);delete p.reference;delete p.fileName;var t=a.getUrl(R.TOKEN,p);var o=W.getRequestOptions(A,t,p.flexObjects||p.flexObject,"application/json; charset=utf-8","json");return W.sendRequest(w,p.method,o);};var L=m({},B,{layers:["ALL"],reset:function(p){var P=["reference","layer","appVersion","changelist","generator"];var c=_(p,P);A._addClientAndLanguageInfo(c);if(p.selectorIds){c.selector=p.selectorIds;}if(p.changeTypes){c.changeType=p.changeTypes;}delete p.reference;var r=a.getUrl(R.CHANGES,p,c);var t=a.getUrl(R.TOKEN,p);var o=W.getRequestOptions(this.applyConnector,t);return W.sendRequest(r,"DELETE",o);},publish:function(p){var P=["reference","layer","appVersion","changelist","package"];var c=_(p,P);A._addClientAndLanguageInfo(c);delete p.reference;var s=a.getUrl(R.PUBLISH,p,c);var t=a.getUrl(R.TOKEN,p);var r=W.getRequestOptions(this.applyConnector,t);return W.sendRequest(s,"POST",r);},getFlexInfo:function(p){var P=["layer","appVersion"];var c=_(p,P);A._addClientAndLanguageInfo(c);var d=a.getUrl(R.FLEX_INFO,p,c);return a.sendRequest(d);},loadFeatures:function(p){if(A.settings){return Promise.resolve({response:A.settings});}var P={};A._addClientAndLanguageInfo(P);var f=a.getUrl(R.SETTINGS,p,P);return a.sendRequest(f);},write:function(p){p.method="POST";return b(p);},update:function(p){if(p.flexObject.fileType==="variant"){p.isLegacyVariant=true;}p.method="PUT";return b(p);},remove:function(p){var P={namespace:p.flexObject.namespace,layer:p.flexObject.layer};if(p.transport){P.changelist=p.transport;}A._addClientAndLanguageInfo(P);p.fileName=p.flexObject.fileName;var r=p.flexObject.fileType==="variant"?R.VARIANTS:R.CHANGES;var d=a.getUrl(r,p,P);d=decodeURIComponent(d);delete p.fileName;var t=a.getUrl(R.TOKEN,p);var o=W.getRequestOptions(A,t,undefined,"application/json; charset=utf-8","json");return W.sendRequest(d,"DELETE",o);}});L.applyConnector=A;L.appVariant.getManifest=function(p){var s=p.appVarUrl;var r=W.getRequestOptions(A,undefined,undefined,"application/json; charset=utf-8","json");return W.sendRequest(s,"GET",r);};L.appVariant.load=function(p){var s=a.getUrl(R.APPVARIANTS,p);var r=W.getRequestOptions(A,undefined,undefined,"application/json; charset=utf-8","json");return W.sendRequest(s,"GET",r);};L.appVariant.create=function(p){p.method="POST";p.isAppVariant=true;return b(p);};L.appVariant.assignCatalogs=function(p){var P={};P.action=p.action;delete p.action;P.assignFromAppId=p.assignFromAppId;delete p.assignFromAppId;var c=a.getUrl(R.APPVARIANTS,p,P);delete p.reference;var t=a.getUrl(R.TOKEN,p);var r=W.getRequestOptions(A,t,undefined,"application/json; charset=utf-8","json");return W.sendRequest(c,"POST",r);};L.appVariant.unassignCatalogs=function(p){var P={};P.action=p.action;delete p.action;var c=a.getUrl(R.APPVARIANTS,p,P);delete p.reference;var t=a.getUrl(R.TOKEN,p);var r=W.getRequestOptions(A,t,undefined,"application/json; charset=utf-8","json");return W.sendRequest(c,"POST",r);};L.appVariant.update=function(p){p.method="PUT";p.isAppVariant=true;return b(p);};L.appVariant.remove=function(p){var P={};if(p.transport){P.changelist=p.transport;}var d=a.getUrl(R.APPVARIANTS,p,P);delete p.reference;var t=a.getUrl(R.TOKEN,p);var r=W.getRequestOptions(A,t,undefined,"application/json; charset=utf-8","json");return W.sendRequest(d,"DELETE",r);};L.appVariant.list=function(p){var P={};P.layer=p.layer;P["sap.app/id"]=p["sap.app/id"];delete p.layer;delete p["sap.app/id"];var s=a.getUrl(R.APPVARIANTS_OVERVIEW,p,P);var r=W.getRequestOptions(A,undefined,undefined,"application/json; charset=utf-8","json");return W.sendRequest(s,"GET",r);};return L;},true);
