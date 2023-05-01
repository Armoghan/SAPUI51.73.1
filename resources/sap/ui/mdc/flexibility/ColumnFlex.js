/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/fl/changeHandler/Base","sap/ui/fl/apply/api/FlexRuntimeInfoAPI"],function(F,a){"use strict";var r=function(o){if(o&&o.isA&&o.isA("sap.ui.mdc.Table")&&o.isTableBound()){if(!o._bWaitForBindChanges){o._bWaitForBindChanges=true;a.waitForChanges({element:o}).then(function(){o.rebindTable();delete o._bWaitForBindChanges;});}}};var d=function(o){if(o&&o.isInvalidateSuppressed&&!o.isInvalidateSuppressed()){o.iSuppressInvalidate=1;a.waitForChanges({element:o}).then(function(){o.iSuppressInvalidate=0;o.invalidate();});}};var g=function(t,s,i){sap.ui.require([t],s,i);};var G=function(o,p,i){var m;var M=p.modifier;var j=M.getSelector(o.id,p.appComponent);m=M.bySelector(j,p.appComponent,p.view);if(!m&&i){m=i.find(function(k){var D=M.getProperty(k,"dataProperties");return D[0]===o.name;});}return m;};var f=function(i){return i?"reverted ":"applied ";};var b=function(A){return A?"add column ":"remove column ";};var c=function(o,i,p,I){d(i);return new Promise(function(j,k){var m=p.modifier,l=I?o.getRevertData():o.getContent();var D=l.name;var n=m.getAggregation(i,"columns");var q=l.index>-1?l.index:n.length;var M=G(l,p,n);var P=M?Promise.resolve(M):new Promise(function(j,k){var m=p.modifier;g(m.getProperty(i,"metadataDelegate"),function(T){T.beforeAddColumnFlex(D,i,p).then(function(s){if(s){j(s);}else{k();}});},k);});P.then(function(M){if(!M){k(new Error("No column created. Change to "+b(!I)+"cannot be "+f(I)+"at this moment"));return;}if(!m.findAggregation(M,"columns")){m.insertAggregation(i,"columns",M,q);}else{F.markAsNotApplicable("Specified change is already existing",true);}if(I){o.resetRevertData();}else{o.setRevertData({id:m.getId(M),name:l.name,index:q});}r(i);j();},function(){k(new Error("Change to "+b(!I)+"cannot be"+f(I)+"at this moment"));});});};var C=function(o,i,p,I){d(i);return new Promise(function(j,k){var m=p.modifier,l=I?o.getRevertData():o.getContent();var M=G(l,p,m.getAggregation(i,"columns"));if(!M){if(I){k(new Error("No column found. Change to "+b(I)+"cannot be "+f(I)+"at this moment"));return;}else{F.markAsNotApplicable("Specified change is already existing",true);}}var n=m.findIndexInParentAggregation(M);m.removeAggregation(i,"columns",M);if(I){o.resetRevertData();}else{o.setRevertData({id:m.getId(M),name:l.name,index:n});}g(m.getProperty(i,"metadataDelegate"),function(T){T.afterRemoveColumnFlex(M,i,p).then(function(q){if(q){m.destroy(M);}j();});},k);});};var e=function(o,i,p,I){d(i);return new Promise(function(j,k){var m=p.modifier;var l=I?o.getRevertData():o.getContent();var M=G(l,p,m.getAggregation(i,"columns"));if(!M){k(new Error("No column found. Change to move column cannot be "+f(I)+"at this moment"));return;}var O=m.findIndexInParentAggregation(M);if(i.moveColumn){i.moveColumn(M,l.index);}else{m.removeAggregation(i,"columns",M);m.insertAggregation(i,"columns",M,l.index);}if(I){o.resetRevertData();}else{o.setRevertData({id:m.getId(M),name:l.name,index:O});}j();});};var h={};h.removeColumn={"changeHandler":{applyChange:function(o,i,p){return C(o,i,p);},completeChangeContent:function(o,m,p){delete o.getContent().index;},revertChange:function(o,i,p){return c(o,i,p,true);}},"layers":{"USER":true}};h.addColumn={"changeHandler":{applyChange:function(o,i,p){return c(o,i,p);},completeChangeContent:function(o,m,p){},revertChange:function(o,i,p){return C(o,i,p,true);}},"layers":{"USER":true}};h.moveColumn={"changeHandler":{applyChange:function(o,i,p){return e(o,i,p);},completeChangeContent:function(o,m,p){},revertChange:function(o,i,p){return e(o,i,p,true);}},"layers":{"USER":true}};return h;});