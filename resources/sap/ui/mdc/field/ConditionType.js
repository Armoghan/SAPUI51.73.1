/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/model/SimpleType','sap/ui/model/FormatException','sap/ui/model/ParseException','sap/ui/model/ValidateException','sap/ui/model/type/String','sap/ui/mdc/library','sap/ui/mdc/condition/FilterOperatorUtil','sap/ui/mdc/condition/Condition','sap/base/util/merge'],function(S,F,P,V,a,l,b,C,m){"use strict";var c=l.FieldDisplay;var d=S.extend("sap.ui.mdc.field.ConditionType",{constructor:function(x,y){S.apply(this,arguments);this.sName="Condition";this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");}});d.prototype.destroy=function(){S.prototype.destroy.apply(this,arguments);if(this._oDefaultType){this._oDefaultType.destroy();delete this._oDefaultType;}this._bDestroyed=true;};d.prototype.formatValue=function(x,I){if(x==undefined||x==null||this._bDestroyed){return null;}if(typeof x!=="object"||!x.operator||!x.values||!Array.isArray(x.values)){throw new F("No valid condition provided");}if(!I){I="string";}var T=n.call(this);var O=o.call(this);var y=p.call(this);var z=this.oFormatOptions.isUnit;s.call(this,x,O);if(z){x=m({},x);if(x.values[0]&&Array.isArray(x.values[0])){x.values[0]=x.values[0][1];}if(x.operator!=="EQ"&&x.operator!=="EEQ"){x.operator="EQ";if(x.values[1]){x.values.splice(1,1);}}}s.call(this,x,T);switch(this.getPrimitiveType(I)){case"string":case"any":if(x.operator==="EQ"&&(b.onlyEEQ(y)||w.call(this,T)==="boolean")){x=m({},x);x.operator="EEQ";}var D=k.call(this);var A=q.call(this);if(x.operator==="EEQ"&&D!==c.Value&&!x.values[1]&&A){var E=function(J){if(J instanceof F&&!A.getValidateInput()){return x;}else{throw J;}};var B=function(H){x=m({},x);if(H&&typeof H==="object"){x=u.call(this,x,H);}else if(x.values.length===1){x.values.push(H);}else{x.values[1]=H;}return x;};var G=this.oFormatOptions.bindingContext;var H;try{H=A.getTextForKey(x.values[0],x.inParameters,x.outParameters,G);}catch(J){return E.call(this,J);}if(H instanceof Promise){return H.then(function(H){x=B.call(this,H);return _.call(this,x);}.bind(this)).catch(function(J){x=E.call(this,J);return _.call(this,x);}.bind(this));}else{x=B.call(this,H);}}return _.call(this,x);default:if(T&&x.values.length>=1){return T.formatValue(x.values[0],I);}throw new F("Don't know how to format Condition to "+I);}};function _(x){var D=k.call(this);var T=n.call(this);if(this.oFormatOptions.hideOperator&&x.values.length>=1){return T.formatValue(x.values[0],"string");}var O=b.getOperator(x.operator);return O.format(x.values,x,T,D);}d.prototype.parseValue=function(x,I){if(this._bDestroyed){return null;}if(!I){I="string";}else if(I==="any"&&typeof x==="string"){I="string";}var N=this.oFormatOptions.navigateCondition;if(N){var O=this.formatValue(N,I);if(O===x){return m({},N);}}var D=k.call(this);var y=q.call(this);var T=n.call(this);var z=o.call(this);var A=p.call(this);var B=this.oFormatOptions.isUnit;var E;if(x===null||x===undefined||(x===""&&!y)){if(!r.call(this,T)&&!B){return null;}}t.call(this,T);t.call(this,z);switch(this.getPrimitiveType(I)){case"string":var G=x;var H;var J=false;if(b.onlyEEQ(A)){H=b.getEEQOperator();if(!H.test(x,T)){G="=="+x;}}else{var M=b.getMatchingOperators(A,G);if(M.length===0){if(y&&!r.call(this,T)){H=b.getEEQOperator();if(!H.test(x,T)){G="=="+x;}J=true;}else{H=b.getDefaultOperator(w.call(this,T));G=H?H.format([x]):x;}}else{H=M[0];}}if(H){var K;try{K=H.getCondition(G,T,D);}catch(L){if(L instanceof P&&z){z.parseValue(x,"string",z._aCurrentValue);}throw L;}if(!K){throw new P("Cannot parse value "+x);}if(!r.call(this,T)){if(H.name==="EEQ"&&y){if(K.values[0]!==null&&K.values[0]!==undefined){K=f.call(this,K,T,y,J,A,x,D);if(K instanceof Promise){return v.call(this,K);}}else if(K.values[1]!==null&&K.values[1]!==undefined){K=g.call(this,K,T,y,true,J,A,x,D);if(K instanceof Promise){return v.call(this,K);}}else if(x===""){K=null;}}else if(x===""){K=null;}}return e.call(this,K,T);}throw new P("Cannot parse value "+x);default:if(T){if(b.onlyEEQ(A)){E="EEQ";}else{E=b.getDefaultOperator(w.call(this,T)).name;}return C.createCondition(E,[T.parseValue(x,I)]);}throw new P("Don't know how to parse Condition from "+I);}};function e(x,T){var I=this.oFormatOptions.isUnit;var O=o.call(this);var U=null;if(I){var M;if(O._aCurrentValue){M=O._aCurrentValue[0];}if(x){if(x.operator!=="EEQ"&&x.operator!=="EQ"){throw new P("unsupported operator");}U=x.values[0];x.values=[[M,U],undefined];}else{x=C.createCondition("EEQ",[[M,null],undefined]);}s.call(this,x,O);}else if(x){var N=T.getMetadata().getName();var D=this.oFormatOptions.delegate;if(D&&D.getBaseType(N)==="unit"&&!x.values[0][1]&&T._aCurrentValue){U=T._aCurrentValue[1]?T._aCurrentValue[1]:null;x.values[0][1]=U;if(x.operator==="BT"){x.values[1][1]=U;}}s.call(this,x,T);s.call(this,x,O);}return x;}function f(x,T,y,z,O,A,D){var B;var E=function(I){if(I&&!(I instanceof P)&&!(I instanceof F)&&!(I instanceof V)){throw I;}if(D===c.Value){if(z){return i.call(this,T,O,A,D);}else if(!y.getValidateInput()){return j.call(this,T,O,A,D);}else{throw new P(I.message);}}else{x.values[1]=x.values[0];x.values[0]=null;return g.call(this,x,T,y,false,z,O,A,D);}};var G=function(B){if(B){if(typeof B==="object"){x=u.call(this,x,B);}else{x.values[1]=B;}}else{if(A===""){x=null;}else{x=E.call(this,new P(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[A])));}}return x;};try{T.validateValue(x.values[0]);var H=this.oFormatOptions.bindingContext;B=y.getTextForKey(x.values[0],undefined,undefined,H);}catch(I){return E.call(this,I);}if(B instanceof Promise){return B.then(function(B){x=G.call(this,B);return e.call(this,x,T);}.bind(this)).catch(function(I){x=E.call(this,I);return e.call(this,x,T);}.bind(this));}else{return G.call(this,B);}}function g(x,T,y,z,A,O,B,D){if(x.values[1]===""){return h.call(this,x,T,y,z,A,O,B,D,undefined);}var E=function(I){if(I&&!(I instanceof P)&&!(I instanceof F)){throw I;}if(I._bNotUnique){if(!y.getValidateInput()){return j.call(this,T,O,B,D);}else{throw I;}}else{return h.call(this,x,T,y,z,A,O,B,D,I);}};var G=function(K){if(K===null||K===undefined){return h.call(this,x,T,y,z,A,O,B,D,undefined);}if(K&&typeof K==="object"){x=u.call(this,x,K);}else{x.values[0]=K;}return x;};var H=this.oFormatOptions.bindingContext;var K;try{K=y.getKeyForText(x.values[1],H);}catch(I){return E.call(this,I);}if(K instanceof Promise){return K.then(function(K){x=G.call(this,K);return z?e.call(this,x,T):x;}.bind(this)).catch(function(I){x=E.call(this,I);return z?e.call(this,x,T):x;}.bind(this));}else{return G.call(this,K);}}function h(x,T,y,z,A,O,B,D,E){var G=null;var H=function(E){if(E&&!(E instanceof P)&&!(E instanceof F)){throw E;}x.values[1]=null;if(A){return i.call(this,T,O,B,D);}else if(!y.getValidateInput()){return j.call(this,T,O,B,D);}throw new P(E.message);};var I=function(G){if(G){if(typeof G==="object"){x=u.call(this,x,G);}else{x.values[1]=G;}}else{if(B===""){x=null;}else{x=H.call(this,E||new P(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[B])));}}return x;};try{x.values[0]=T.parseValue(x.values[1],"string");T.validateValue(x.values[0]);}catch(M){z=false;}if(z){var J=this.oFormatOptions.bindingContext;try{G=y.getTextForKey(x.values[0],undefined,undefined,J);}catch(M){return H.call(this,M);}if(G instanceof Promise){return G.then(function(G){return I.call(this,G);}.bind(this)).catch(function(E){return H.call(this,E);}.bind(this));}}else if(E){return H.call(this,E);}return I.call(this,G);}function i(T,O,x,D){var y=b.getDefaultOperator(w.call(this,T));var z=y?y.format([x]):x;var A=y.getCondition(z,T,D);return A;}function j(T,O,x,D){var y;if(b.onlyEEQ(O)){y="EEQ";}else{if(x.startsWith("==")){y="EEQ";x=x.slice(2);}else if(x.startsWith("=")){y="EQ";x=x.slice(1);}}var z=T.parseValue(x,"string");var A=C.createCondition(y,[z]);return A;}d.prototype.validateValue=function(x){var T=n.call(this);var O=p.call(this);var I=this.oFormatOptions.isUnit;if(x===undefined||this._bDestroyed){return null;}else if(x===null){if(b.onlyEEQ(O)){try{if(T._sParsedEmptyString===""){T.validateValue("");}else{T.validateValue(null);}}catch(E){if(E instanceof V){throw E;}else{return null;}}}return null;}if(typeof x!=="object"||!x.operator||!x.values||!Array.isArray(x.values)){throw new V(this._oResourceBundle.getText("field.VALUE_NOT_VALID"));}var y=b.getOperator(x.operator,O);if(I){x=m({},x);if(x.values[0]&&Array.isArray(x.values[0])){x.values[0]=x.values[0][1];}y=b.getEEQOperator();}y.validate(x.values,T);};function k(){var D=this.oFormatOptions.display;if(!D){D=c.Value;}return D;}function n(){var T=this.oFormatOptions.valueType;if(!T){if(!this._oDefaultType){this._oDefaultType=new a();}T=this._oDefaultType;}return T;}function o(){return this.oFormatOptions.originalDateType;}function p(){var O=this.oFormatOptions.operators;if(!O||O.length===0){O=b.getOperatorsForType("string");}return O;}function q(){var I=this.oFormatOptions.fieldHelpID;if(I){return sap.ui.getCore().byId(I);}return null;}function r(T){return T&&T.isA("sap.ui.model.CompositeType");}function s(x,T){if(r.call(this,T)&&x&&x.values[0]){T._aCurrentValue=x.values[0];}}function t(T){if(r.call(this,T)&&!T._aCurrentValue){T._aCurrentValue=[];}}function u(x,R){x.values=[R.key,R.description];if(R.inParameters){x.inParameters=R.inParameters;}if(R.outParameters){x.outParameters=R.outParameters;}return x;}function v(x){if(this.oFormatOptions.asyncParsing){this.oFormatOptions.asyncParsing(x);}return x;}function w(T){var x=T.getMetadata().getName();var y=T.oFormatOptions;var z=T.oConstraints;var D=this.oFormatOptions.delegate;var B=D?D.getBaseType(x,y,z):"string";if(B==="unit"){B="numeric";}return B;}return d;});