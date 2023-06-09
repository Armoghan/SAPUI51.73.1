/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/apply/_internal/connectors/Utils"],function(A){"use strict";function _(f,c){if(c.content.fileName!==c.content.variantManagementReference){f.push(c.content);}c.controlChanges.forEach(function(o){f.push(o);});for(var C in c.variantChanges){f=f.concat(c.variantChanges[C]);}return f;}return function(r){var f=r.changes||[];for(var v in r.variantSection){var V=r.variantSection[v];for(var c in V.variantManagementChanges){f=f.concat(V.variantManagementChanges[c]);}f=V.variants.reduce(_,f);}var g=A.getGroupedFlexObjects(f);return A.filterAndSortResponses(g);};});
