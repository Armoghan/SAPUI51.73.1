/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/connectors/Utils","sap/ui/fl/apply/_internal/StorageResultMerger","sap/ui/fl/apply/_internal/storageResultDisassemble"],function(A,S,s){"use strict";function l(p,C){var g=C.map(function(o){var h=Object.assign(p,{url:o.url,path:o.url});return o.applyConnectorModule.loadFlexData(h).catch(A.logAndResolveDefault.bind(undefined,A.getEmptyFlexDataResponse(),o,"loadFlexData"));});return Promise.all(g);}function f(r){var F=[];r.forEach(function(R){if(Array.isArray(R)){F=F.concat(R);}else{F.push(R);}});return F;}function a(r){r.responses=f(r.responses);return r;}function c(r){return r.some(function(R){return R.variants&&R.variants.length>0||R.variantChanges&&R.variantChanges.length>0||R.variantDependentControlChanges&&R.variantDependentControlChanges.length>0||R.variantManagementChanges&&R.variantManagementChanges.length>0;});}function b(r){var v=0;r.forEach(function(R){if(R.variantSection&&Object.keys(R.variantSection).length>0){v++;}});return v;}function d(r){var D=[];var R=c(r);var n=b(r);var v=!R&&n<=1;if(v){D=r;}else{D=r.map(function(o){return o.variantSection?s(o):o;});}return{responses:D,variantSectionSufficient:v};}var e={};e.loadFlexData=function(p){if(!p||!p.reference){return Promise.reject("No reference was provided");}return A.getApplyConnectors().then(l.bind(this,p)).then(f).then(d).then(a).then(S.merge);};return e;},true);
