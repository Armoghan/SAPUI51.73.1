/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/InvisibleText"],function(I){"use strict";var P={apiVersion:2};P.render=function(r,p){var i=p.getId();var t=p.getTooltip_AsString();var h=p._getHeader();r.openStart("div",p);r.class("sapMPlanCal");r.accessibilityState({role:"region",labelledby:I.getStaticId("sap.m","PLANNINGCALENDAR")});if(p._iSize!==undefined&&p._iSize!==null){r.class("sapMSize"+p._iSize);}if(!p.getSingleSelection()){r.class("sapMPlanCalMultiSel");}if(!p.getShowRowHeaders()){r.class("sapMPlanCalNoHead");}if(p.getShowWeekNumbers()&&p._viewAllowsWeekNumbers(p.getViewKey())){r.class("sapMPlanCalWithWeekNumbers");}if(p.getShowDayNamesLine()&&p._viewAllowsDayNamesLine(p.getViewKey())){r.class("sapMPlanCalWithDayNamesLine");}if(t){r.attr('title',t);}var w=p.getWidth();if(w){r.style("width",w);}var H=p.getHeight();if(H){r.style("height",H);}r.accessibilityState(p);r.openEnd();r.renderControl(h);var T=p.getAggregation("table");r.renderControl(T);var a=p._oRB.getText("PLANNINGCALENDAR");r.openStart("span",i+"-Descr");r.class("sapUiInvisibleText");r.openEnd();r.text(a);r.close("span");a=p._oRB.getText("PLANNINGCALENDAR_VIEW");r.openStart("span",i+"-SelDescr");r.class("sapUiInvisibleText");r.openEnd();r.text(a);r.close("span");r.close("div");};return P;},true);
