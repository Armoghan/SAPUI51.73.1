/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/m/CheckBox','sap/m/DatePicker','sap/m/TimePicker','sap/m/HBox','sap/m/Input','sap/m/Text','sap/m/ObjectIdentifier','sap/m/ObjectStatus','sap/m/Image','sap/m/Link','sap/m/VBox','sap/m/FlexItemData','sap/m/library','sap/ui/comp/navpopover/SmartLink','sap/ui/comp/odata/MetadataAnalyser','sap/ui/comp/smartfield/ODataHelper','sap/ui/comp/smartfield/SmartField','sap/ui/comp/odata/ODataType','sap/ui/comp/odata/CalendarMetadata','sap/ui/comp/odata/CriticalityMetadata','sap/ui/comp/util/FormatUtil','sap/ui/comp/util/MultiCurrencyUtil','sap/ui/core/Control','sap/ui/comp/navpopover/SemanticObjectController','sap/ui/comp/navpopover/NavigationPopoverHandler','./ValueHelpProvider','./ValueListProvider'],function(C,D,T,H,I,a,O,b,c,L,V,F,M,S,d,e,f,g,h,j,k,l,m,n,N,o,p){"use strict";var q;var r=function(P){if(P){this._oParentODataModel=P.model;this._oMetadataAnalyser=P.metadataAnalyser;this._aODataFieldMetadata=P.fieldsMetadata;this._oLineItemAnnotation=P.lineItemAnnotation;this._oSemanticKeyAnnotation=P.semanticKeyAnnotation;this._smartTableId=P.smartTableId;this._bProcessDataFieldDefault=P.processDataFieldDefault;this._isAnalyticalTable=P.isAnalyticalTable;this._isMobileTable=P.isMobileTable;this._oDateFormatSettings=P.dateFormatSettings;this._useUTCDateTime=P.useUTCDateTime;this._bEnableDescriptions=P.enableDescriptions;this._oCurrencyFormatSettings=P.currencyFormatSettings;this._oDefaultDropDownDisplayBehaviour=P.defaultDropDownDisplayBehaviour||"descriptionAndId";this.useSmartField=P.useSmartField==="true";this.useSmartToggle=P.useSmartToggle==="true";this._sEntitySet=P.entitySet;this._oSemanticKeyAdditionalControl=P._semanticKeyAdditionalControl;this._oSemanticObjectController=P.semanticObjectController;}if(!this._oMetadataAnalyser&&this._oParentODataModel){this._oMetadataAnalyser=new d(this._oParentODataModel);this._intialiseMetadata();}this._mSmartField={};this._oHelper=new e(this._oMetadataAnalyser.oModel);this._aValueListProvider=[];this._aValueHelpProvider=[];this._aLinkHandlers=[];};r.prototype._intialiseMetadata=function(){if(!this._aODataFieldMetadata){this._aODataFieldMetadata=this._oMetadataAnalyser.getFieldsByEntitySetName(this.sEntity);}};r.prototype.getFieldViewMetadata=function(i,s){var t=this._createFieldMetadata(i);this._createFieldTemplate(t,s);return t;};r.prototype._createFieldTemplate=function(v,i){if(this.useSmartField){v.template=new f({value:{path:v.name},entitySet:this._sEntitySet,contextEditable:{path:"sm4rtM0d3l>/editable",mode:"OneWay"},controlContext:this._isMobileTable?"responsiveTable":"table",wrapping:this._isMobileTable});if(g.isNumeric(v.type)||g.isDateOrTime(v.type)||h.isCalendarOrFiscalValue(v)){v.template.setTextAlign("Right");v.template.setWidth("100%");}this._completeSmartField(v);v.template._setPendingEditState(i);}if(this.useSmartToggle){v.template=new q({editable:{path:"sm4rtM0d3l>/editable",mode:"OneWay"},edit:this.useSmartField?v.template:this._createEditableTemplate(v),display:this._createDisplayOnlyTemplate(v)});}else if(!this.useSmartField){v.template=i?this._createEditableTemplate(v):this._createDisplayOnlyTemplate(v);}};r.prototype._completeSmartField=function(v){var i={annotations:{},path:v.name};if(!this._mSmartField.entitySetObject){this._mSmartField.entitySetObject=this._oHelper.oMeta.getODataEntitySet(this._sEntitySet);this._mSmartField.entityType=this._oHelper.oMeta.getODataEntityType(this._mSmartField.entitySetObject.entityType);}i.modelObject=this._oParentODataModel;i.entitySetObject=this._mSmartField.entitySetObject;i.entitySet=this._mSmartField.entitySetObject;i.entityType=this._mSmartField.entityType;this._oHelper.getProperty(i);v.fieldControlProperty=this._oHelper.oAnnotation.getFieldControlPath(i.property.property);if(v.fieldControlProperty&&v.parentPropertyName){v.fieldControlProperty=v.parentPropertyName+"/"+v.fieldControlProperty;}i.annotations.uom=this._oHelper.getUnitOfMeasure2(i);i.annotations.text=this._oHelper.getTextProperty2(i);i.annotations.lineitem=this._oLineItemAnnotation;i.annotations.semantic=d.getSemanticObjectsFromProperty(i.property.property);this._oHelper.getUOMTextAnnotation(i);if(i.property.property["sap:value-list"]||i.property.property["com.sap.vocabularies.Common.v1.ValueList"]){i.annotations.valuelist=this._oHelper.getValueListAnnotationPath(i);if(i.property.property["sap:value-list"]){i.annotations.valuelistType=i.property.property["sap:value-list"];}else{i.annotations.valuelistType=this._oMetadataAnalyser.getValueListSemantics(i.property.property["com.sap.vocabularies.Common.v1.ValueList"]);}}this._oHelper.getUOMValueListAnnotationPath(i);delete i.entitySet;v.template.data("configdata",{"configdata":i});v.template.data("dateFormatSettings",this._oDateFormatSettings);v.template.data("currencyFormatSettings",this._oCurrencyFormatSettings);v.template.data("defaultDropDownDisplayBehaviour",this._oDefaultDropDownDisplayBehaviour);if(i.annotations.uom||g.isNumeric(v.type)||g.isDateOrTime(v.type)||h.isCalendarOrFiscalValue(v)){var A=v.template.getTextAlign();if(A==="Initial"){A="Right";}v.align=A;}r._createModelTypeInstance(v,this._oDateFormatSettings,this._useUTCDateTime);};r.prototype._createEditableTemplate=function(v,B){var t=null,i=r._createModelTypeInstance(v,this._oDateFormatSettings,this._useUTCDateTime);var s=v.type==="Edm.DateTime"&&v.displayFormat==="Date";if(s||v.isCalendarDate){t=new D({value:{path:v.name,type:i}});}else if(v.type==="Edm.Boolean"){t=new C({selected:{path:v.name}});}if(v.semanticObjects&&(!B)){t=this._createSmartLinkFieldTemplate(v,i,function(){return this._createEditableTemplate(v,true);}.bind(this));}if(!t){if(v.type==="Edm.Time"){t=new T({value:{path:v.name,type:i}});}else{t=new I({value:{path:v.name,type:i}});if(v.unit){t.bindProperty("description",{path:v.unit});t.setTextAlign("Right");t.setTextDirection("LTR");t.setFieldWidth("80%");}else if(this._bEnableDescriptions&&v.description){t.bindProperty("description",{path:v.description});}else if(g.isNumeric(v.type)||g.isDateOrTime(v.type)||h.isCalendarOrFiscalValue(v)){v.align="Right";t.setTextAlign("Right");t.setTextDirection("LTR");}if(v.hasValueListAnnotation){this._associateValueHelpAndSuggest(t,v);}}}return t;};r.prototype._associateValueHelpAndSuggest=function(i,s){i.setShowValueHelp(true);this._aValueHelpProvider.push(new o({fieldName:s.fieldName,control:i,model:this._oParentODataModel,dateFormatSettings:this._oDateFormatSettings,displayFormat:s.displayFormat,displayBehaviour:s.displayBehaviour,loadAnnotation:true,fullyQualifiedFieldName:s.fullName,metadataAnalyser:this._oMetadataAnalyser,title:s.label,preventInitialDataFetchInValueHelpDialog:true,takeOverInputValue:false,type:s.type,maxLength:s.maxLength}));i.setShowSuggestion(true);i.setFilterSuggests(false);this._aValueListProvider.push(new p({fieldName:s.fieldName,control:i,model:this._oParentODataModel,displayFormat:s.displayFormat,dateFormatSettings:this._oDateFormatSettings,displayBehaviour:s.displayBehaviour,loadAnnotation:true,fullyQualifiedFieldName:s.fullName,metadataAnalyser:this._oMetadataAnalyser,aggregation:"suggestionRows",typeAheadEnabled:true}));};r.prototype._createDisplayOnlyTemplate=function(v,B){var t=null,i=null,A,s,u;i=r._createModelTypeInstance(v,this._oDateFormatSettings,this._useUTCDateTime);if(g.isNumeric(v.type)||g.isDateOrTime(v.type)||h.isCalendarOrFiscalValue(v)){A="Right";}if(v.urlInfo){t=this._createLink(v,i,v.urlInfo);}else if(v.criticalityInfo){t=this._createObjectStatusTemplate(v,i,v.criticalityInfo);}if(this._isMobileTable&&!t){if(v.isImageURL){t=new c({src:{path:v.name},width:"3em",height:"3em"});}else{u=r._getSemanticKeyIndex(v,this._oSemanticKeyAnnotation);if(u>-1){t=this._createObjectIdentifierTemplate(v,i,u===0);}}}if(!t){if(v.semanticObjects&&(!B)){t=this._createSmartLinkFieldTemplate(v,i,function(){return this._createDisplayOnlyTemplate(v,true);}.bind(this));}else if(v.unit){t=this._createMeasureFieldTemplate(v,i);}else if(v.isEmailAddress||v.isPhoneNumber){t=this._createEmailOrPhoneLink(v,i);}else{s=this._getDefaultBindingInfo(v,i);t=new a({wrapping:this._isMobileTable,textAlign:A,text:s});}}v.align=A;return t;};r._getSemanticKeyIndex=function(v,s){var i=-1,E;if(s&&s.semanticKeyFields){i=s.semanticKeyFields.indexOf(v.name);if(i<0){E=d.resolveEditableFieldFor(v);i=E?s.semanticKeyFields.indexOf(E):-1;}}return i;};r._createModelTypeInstance=function(v,i,u){var s,t;var w=v.type==="Edm.DateTime"&&v.displayFormat==="Date";if(w||v.isCalendarDate){s=i;t={displayFormat:"Date"};}else if(v.type==="Edm.DateTime"&&u){s={UTC:true};}else if(v.type==="Edm.Decimal"){t={precision:v.precision,scale:v.scale};}else if(v.type==="Edm.String"){t={isDigitSequence:v.isDigitSequence};}t=Object.assign({},t,{maxLength:v.maxLength});if(v.type=="Edm.DateTime"){v.modelType=g.getType(v.type,s,t,v.isCalendarDate);v.modelType.formatValue(new Date(),"string");v.modelType.oFormat.oFormatOptions.UTC=false;return g.getType(v.type,s,t,v.isCalendarDate);}v.modelType=g.getType(v.type,s,t,v.isCalendarDate);return v.modelType;};r.prototype._createEmailOrPhoneLink=function(v,t){var i=new L({text:this._getDefaultBindingInfo(v,t),wrapping:this._isMobileTable,press:function(E){var s=E.getSource().getText();if(v.isEmailAddress){M.URLHelper.triggerEmail(s);}else if(v.isPhoneNumber){M.URLHelper.triggerTel(s);}}});return i;};r.prototype._getDefaultBindingInfo=function(v,t){var B={path:v.name,type:t};if(this._bEnableDescriptions&&v.description){B={parts:[{path:v.name,type:t},{path:v.description}],formatter:k.getFormatterFunctionFromDisplayBehaviour(v.displayBehaviour)};}return B;};r.prototype._createLink=function(v,t,i){var s=null;v.linkProperties=i.parameters||i.urlPath;if(i.urlPath){s={path:i.urlPath};}else if(i.urlTarget){s=i.urlTarget;}return new L({text:this._getDefaultBindingInfo(v,t),wrapping:this._isMobileTable,href:s});};r.prototype._createObjectIdentifierTemplate=function(v,t,i){var s,u,w,x,y,z;var A=this;var B=function(E){if(A._oSemanticObjectController&&A._oSemanticObjectController.getForceLinkRendering()&&A._oSemanticObjectController.getForceLinkRendering()[v.name]){return true;}var G=v.semanticObjects.additionalSemanticObjects.concat(v.semanticObjects.defaultSemanticObject);return n.hasDistinctSemanticObject(G,E);};if(v.semanticObjects){n.getDistinctSemanticObjects().then(function(E){if(B(E)){z=new N({semanticObject:v.semanticObjects.defaultSemanticObject,additionalSemanticObjects:v.semanticObjects.additionalSemanticObjects,semanticObjectLabel:v.label,fieldName:v.name,semanticObjectController:A._oSemanticObjectController,navigationTargetsObtained:function(G){var s=sap.ui.getCore().byId(G.getSource().getControl());var J=G.getParameters().mainNavigation;if(J){J.setDescription(s.getText());}G.getParameters().show(s.getTitle(),J,undefined,undefined);}});A._aLinkHandlers.push(z);}});}if(v.description){switch(v.displayBehaviour){case"descriptionAndId":u=v.description;w=v.name;x=t;break;case"idAndDescription":u=v.name;w=v.description;y=t;break;case"idOnly":u=v.name;x=t;break;default:u=v.description;break;}}else{u=v.name;y=t;}s=new O({title:u?{path:u,type:y}:undefined,text:w?{path:w,type:x}:undefined,titleActive:v.semanticObjects?{path:"$sapuicompcontrolprovider_distinctSO>/distinctSemanticObjects",formatter:function(E){return B(E);}}:false,titlePress:function(E){if(z){z.setControl(E.getSource());z.openPopover(E.getParameter("domRef"));}}});s.attachEvent("ObjectIdentifier.designtime",function(E){if(z){z.setControl(E.getSource());E.getParameters().registerNavigationPopoverHandler(z);}});s.setModel(n.getJSONModel(),"$sapuicompcontrolprovider_distinctSO");if(this._oSemanticKeyAdditionalControl&&i){this._bSemanticKeyAdditionalControlUsed=true;return new V({renderType:"Bare",items:[s,this._oSemanticKeyAdditionalControl]}).addStyleClass("sapMTableContentMargin");}return s;};r.prototype._createObjectStatusTemplate=function(v,t,i){var s,u,w,B;w=j.getShowCriticalityIcon(i.criticalityRepresentationType);if(i.path){v.criticality=i.path;s={path:i.path,formatter:j.getCriticalityState};if(i.criticalityRepresentationPath){v.criticalityRepresentation=i.criticalityRepresentationPath;u={parts:[{path:i.path},{path:i.criticalityRepresentationPath}],formatter:function(x,y){return j.getShowCriticalityIcon(y)?j.getCriticalityIcon(x):undefined;}};}else if(w){u={path:i.path,formatter:j.getCriticalityIcon};}}else{s=j.getCriticalityState(i.criticalityType);if(i.criticalityRepresentationPath){v.criticalityRepresentation=i.criticalityRepresentationPath;u={path:i.criticalityRepresentationPath,formatter:function(x){return j.getShowCriticalityIcon(x)?j.getCriticalityIcon(i.criticalityType):undefined;}};}else if(w){u=j.getCriticalityIcon(i.criticalityType);}}if(v.unit){B={parts:[{path:v.name,type:t},{path:v.unit}],formatter:v.isCurrencyField?k.getInlineAmountFormatter():k.getInlineMeasureUnitFormatter(),useRawValues:v.isCurrencyField};}else{B=this._getDefaultBindingInfo(v,t);}return new b({text:B,state:s,icon:u});};r.prototype._createSmartLinkFieldTemplate=function(v,t,i){var B=v.unit?{parts:[{path:v.name,type:t},{path:v.unit}],formatter:v.isCurrencyField?k.getAmountCurrencyFormatter():k.getMeasureUnitFormatter(),useRawValues:true}:this._getDefaultBindingInfo(v,t);var s=new S({semanticObject:v.semanticObjects.defaultSemanticObject,additionalSemanticObjects:v.semanticObjects.additionalSemanticObjects,semanticObjectLabel:v.label,fieldName:v.name,text:B,uom:v.unit?{path:v.unit}:undefined,wrapping:this._isMobileTable,semanticObjectController:this._oSemanticObjectController,navigationTargetsObtained:function(E){var u=this.getBinding("text");if(!u||!Array.isArray(u.getValue())||v.unit){E.getParameters().show();return;}var w=u.getValue();var x=k.getTextsFromDisplayBehaviour(v.displayBehaviour,w[0],w[1]);var y=E.getParameters().mainNavigation;if(y){y.setDescription(x.secondText);}E.getParameters().show(x.firstText,y,undefined,undefined);}});s.setCreateControlCallback(i);return s;};r.prototype._createMeasureFieldTemplate=function(v,t){var i,A,s,u,U,E=false;E=!!(v.isCurrencyField&&this._oCurrencyFormatSettings&&this._oCurrencyFormatSettings.showCurrencySymbol);u=new a({layoutData:this._isMobileTable?undefined:new F({growFactor:1,baseSize:"0%"}),textDirection:"LTR",wrapping:false,textAlign:"End",text:{parts:[{path:v.name,type:t},{path:v.unit}],formatter:v.isCurrencyField?k.getAmountCurrencyFormatter():k.getMeasureUnitFormatter(),useRawValues:v.isCurrencyField}});U=new a({layoutData:new F({shrinkFactor:0}),textDirection:"LTR",wrapping:false,textAlign:"Begin",width:"3em",text:{path:v.unit,formatter:E?k.getCurrencySymbolFormatter():undefined}}).addStyleClass("sapUiCompUoMPart");i=new H({renderType:"Bare",justifyContent:"End",wrap:this._isMobileTable?"Wrap":undefined,items:[u,U]});i.addStyleClass("sapUiCompDirectionLTR");if(v.isCurrencyField&&this._isAnalyticalTable){A=new L({text:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_LINK_TEXT")||"Show Details",visible:{path:v.unit,formatter:l.isMultiCurrency},press:function(w){l.openMultiCurrencyPopover(w,{currency:v.name,unit:v.unit,additionalParent:this.useSmartToggle,smartTableId:this._smartTableId,template:s});}.bind(this)});s=i;s.bindProperty("visible",{path:v.unit,formatter:function(w){return!l.isMultiCurrency(w);}});i=new V({renderType:"Bare",items:[A,s]});}return i;};r.prototype._createFieldMetadata=function(i){var s=Object.assign({},i);s.label=i.fieldLabel||i.name;s.quickInfo=i.quickInfo||s.label;s.displayBehaviour=s.displayBehaviour||this._oDefaultDropDownDisplayBehaviour;s.filterType=this._getFilterType(i);this._updateValueListMetadata(s);this._setAnnotationMetadata(s);if(this._oLineItemAnnotation&&this._oLineItemAnnotation.fields&&this._oLineItemAnnotation.fields.indexOf(i.name)>-1){s.urlInfo=this._oLineItemAnnotation.urlInfo&&this._oLineItemAnnotation.urlInfo[i.name];s.criticalityInfo=this._oLineItemAnnotation.criticality&&this._oLineItemAnnotation.criticality[i.name];}else if(this._bProcessDataFieldDefault){this._oMetadataAnalyser.updateDataFieldDefault(s);}return s;};r.prototype._updateValueListMetadata=function(i){i.hasValueListAnnotation=i["sap:value-list"]!==undefined;if(i.hasValueListAnnotation){i.hasFixedValues=i["sap:value-list"]==="fixed-values";}else if(i["com.sap.vocabularies.Common.v1.ValueList"]){i.hasValueListAnnotation=true;i.hasFixedValues=this._oMetadataAnalyser.getValueListSemantics(i["com.sap.vocabularies.Common.v1.ValueList"])==="fixed-values";}};r.prototype._setAnnotationMetadata=function(i){if(i&&i.fullName){i.semanticObjects=this._oMetadataAnalyser.getSemanticObjectsFromAnnotation(i.fullName);}};r.prototype._getFilterType=function(i){return k._getFilterType(i);};r.prototype.destroy=function(){var s=function(A){var i;if(A){i=A.length;while(i--){A[i].destroy();}}};if(this._oMetadataAnalyser&&this._oMetadataAnalyser.destroy){this._oMetadataAnalyser.destroy();}this._oMetadataAnalyser=null;if(!this._bSemanticKeyAdditionalControlUsed&&this._oSemanticKeyAdditionalControl&&this._oSemanticKeyAdditionalControl.destroy){this._oSemanticKeyAdditionalControl.destroy();}s(this._aValueHelpProvider);this._aValueHelpProvider=null;s(this._aValueListProvider);this._aValueListProvider=null;s(this._aLinkHandlers);this._aLinkHandlers=null;if(this._oHelper){this._oHelper.destroy();}this._oHelper=null;this._mSmartField=null;this._aODataFieldMetadata=null;this._oDateFormatSettings=null;this._oCurrencyFormatSettings=null;this._oDefaultDropDownDisplayBehaviour=null;this._oLineItemAnnotation=null;this._oSemanticKeyAnnotation=null;this._oParentODataModel=null;this.bIsDestroyed=true;};q=m.extend("sap.ui.comp.SmartToggle",{metadata:{library:"sap.ui.comp",properties:{editable:{type:"boolean",defaultValue:false}},aggregations:{edit:{type:"sap.ui.core.Control",multiple:false},display:{type:"sap.ui.core.Control",multiple:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}}},renderer:{apiVersion:2,render:function(i,s){i.openStart("span",s).class("sapUiCompSmartToggle").openEnd();i.renderControl(s.getEditable()?s.getEdit():s.getDisplay());i.close("span");}}});q.prototype.getFocusDomRef=function(){var i=this.getEditable()?this.getEdit():this.getDisplay();if(i){return i.getFocusDomRef();}return m.prototype.getFocusDomRef.call(this);};q.prototype.getAccessibilityInfo=function(){var i=this.getEditable()?this.getEdit():this.getDisplay();if(i&&i.getAccessibilityInfo){return i.getAccessibilityInfo();}return null;};q.prototype.addAssociation=function(A,i,s){if(A==="ariaLabelledBy"){var E=this.getEdit(),t=this.getDisplay();E&&E.addAssociation(A,i,s);t&&t.addAssociation(A,i,s);}return m.prototype.addAssociation.apply(this,arguments);};q.prototype.removeAssociation=function(A,v,s){if(A==="ariaLabelledBy"){var E=this.getEdit(),i=this.getDisplay();E&&E.removeAssociation(A,v,s);i&&i.removeAssociation(A,v,s);}return m.prototype.removeAssociation.apply(this,arguments);};q.prototype.removeAllAssociation=function(A,s){if(A==="ariaLabelledBy"){var E=this.getEdit(),i=this.getDisplay();E&&E.removeAllAssociation(A,s);i&&i.removeAllAssociation(A,s);}return m.prototype.removeAllAssociation.apply(this,arguments);};return r;},true);
