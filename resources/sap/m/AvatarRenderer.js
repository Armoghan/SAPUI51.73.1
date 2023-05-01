/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/base/security/encodeCSS"],function(l,e){"use strict";var A=l.AvatarSize;var a=l.AvatarType;var b=l.AvatarColor;var c=Object.keys(b).filter(function(C){return C.indexOf("Accent")!==-1;});var d={apiVersion:2};d.render=function(r,o){var i=o.getInitials(),s=o._getActualDisplayType(),I=o._getImageFallbackType(),D=o.getDisplaySize(),f=o.getDisplayShape(),g=o.getImageFitType(),C=o.getCustomDisplaySize(),h=o.getCustomFontSize(),S=o.getSrc(),j="sapFAvatar",t=o.getTooltip_AsString(),k=o._getDefaultTooltip(),L=o.getAriaLabelledBy(),m=o.getAriaDescribedBy(),n=t&&i?k+" "+t:k,p=i?k+" "+i:k;r.openStart("span",o);r.class(j);d.addBackgroundColorClass(r,o);r.class(j+D);r.class(j+s);r.class(j+f);if(o.hasListeners("press")){r.class("sapMPointer");r.class(j+"Focusable");r.attr("role","button");r.attr("tabindex",0);}else{r.attr("role","img");}if(o.getShowBorder()){r.class("sapFAvatarBorder");}if(D===A.Custom){r.style("width",C);r.style("height",C);r.style("font-size",h);}if(t){r.attr("title",t);r.attr("aria-label",n);}else{r.attr("aria-label",p);}if(L&&L.length>0){r.attr("aria-labelledby",L.join(" "));}if(m&&m.length>0){r.attr("aria-describedby",m.join(" "));}r.openEnd();if(s===a.Icon||I===a.Icon){r.renderControl(o._getIcon());}else if(s===a.Initials||I===a.Initials){r.openStart("span");r.class(j+"InitialsHolder");r.openEnd();r.text(i);r.close("span");}if(s===a.Image){r.openStart("span");r.class(j+"ImageHolder");r.class(j+s+g);r.style("background-image","url('"+e(S)+"')");r.openEnd();r.close("span");}if(o._fnLightBoxOpen){r.openStart("span").class(j+"MagnifyingGlass").openEnd().close("span");}r.close("span");};d.addBackgroundColorClass=function(r,o){var B=o.getBackgroundColor();if(o.getBackgroundColor()===b.Random){B=b[c[c.length*Math.random()<<0]];}r.class("sapFAvatarColor"+B);};return d;},true);
