//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/shellMenuBar/Component.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.MenuBar.Component", {
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            var oMenuModel = new JSONModel();
            this.setModel(oMenuModel, "menu");

            sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.getMenuEntries();
                })
                .then(function (aMenuEntries) {
                    oMenuModel.setProperty("/", aMenuEntries);
                });
        }
    });
});
},
	"sap/ushell/components/shellMenuBar/controller/MenuBar.controller.js":function(){// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    /**
     * Controller of the MenuBar view.
     * It is responsible for changing the hash after selecting a Menu entry.
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameter
     *
     * @class
     * @extends sap.ui.core.mvc.Controller
     *
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.shell.MenuBar.controller.MenuBar
     */

    return Controller.extend("sap.ushell.components.shell.MenuBar.controller.MenuBar" /**@lends sap.ushell.components.shell.MenuBar.controller.MenuBar*/, {

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         * It gets all the required UShell services and
         * initializes the view.
         *
         * @private
         * @since 1.72.0
         */
        onInit: function() {
            this.oContainerRouter = sap.ushell.Container.getRenderer().getRouter();

            this.oContainerRouter.getRoute("home").attachMatched(this._selectIndexAfterRouteChange, this);
            this.oContainerRouter.getRoute("openFLPPage").attachMatched(this._selectIndexAfterRouteChange, this);

            var oViewConfiguration = new JSONModel({
                //We need to initialize with a non-empty key to avoid flickering of the selection.
                selectedKey: "None Existing Key"
            });

            this.getView().setModel(oViewConfiguration, "viewConfiguration");

            this.oURLParsingService = sap.ushell.Container.getServiceAsync("URLParsing");

            this._selectIndexAfterRouteChange();
        },

        /**
         * Uses the Cross Application Navigation service to redirect to the selected menu intent
         *
         * @param {sap.ui.base.Event} event The event containing the selected menu intent
         *
         * @private
         * @since 1.72.0
         */
        onMenuItemSelection: function (event) {
            var sSelectedMenuIntent = event.getParameter("key");
            var oCANService = sap.ushell.Container.getServiceAsync("CrossApplicationNavigation");

            Promise.all([this.oURLParsingService, oCANService]).then(function (aServices) {
                var oURLParsingService = aServices[0];
                oCANService = aServices[1];

                var oParsedShellHash = oURLParsingService.parseShellHash(sSelectedMenuIntent);
                oCANService.toExternal({
                    target: {
                        semanticObject: oParsedShellHash.semanticObject,
                        action: oParsedShellHash.action
                    },
                    params: oParsedShellHash.params
                });
            });
        },

        /**
         * Selects the right key according to the current hash.
         *
         * Gets the space and page id out of the current hash and selects key according to them.
         * If no spaceId is passed, the pageId is also used as spaceId. This might change in the future.
         *
         * @returns {Promise<void>} a promise to wait for.
         *
         * @private
         * @since 1.72.0
         */
        _selectIndexAfterRouteChange: function () {
            return this.oURLParsingService
               .then(function (urlParsingService) {

                   var oHashParts = urlParsingService.parseShellHash(window.hasher.getHash());
                   if (oHashParts.action === "home") {
                       this.getView().getModel("viewConfiguration").setProperty("/selectedKey", "");
                   } else if (!oHashParts.params.pageId || !oHashParts.params.spaceId) {
                       this.getView().getModel("viewConfiguration").setProperty("/selectedKey", "None Existing Key");
                   } else {
                       var sKey = "#Launchpad-openFLPPage?spaceId=" + window.encodeURIComponent(oHashParts.params.spaceId[0]) + "&pageId=" + window.encodeURIComponent(oHashParts.params.pageId[0]);
                       this.getView().getModel("viewConfiguration").setProperty("/selectedKey", sKey);
                   }
                }.bind(this)
            );
        }
    });
});
},
	"sap/ushell/components/shellMenuBar/manifest.json":'{\n    "_version": "1.73.1",\n    "sap.app": {\n        "id": "sap.ushell.components.shell.MenuBar"\n    },\n    "sap.ui": {\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "rootView": {\n            "viewName": "sap.ushell.components.shell.MenuBar.view.MenuBar",\n            "type": "XML",\n            "async": true\n        },\n        "dependencies": {\n            "minUI5Version": "1.71",\n            "libs": {\n                "sap.m": {}\n            }\n        },\n        "models": {}\n    }\n}',
	"sap/ushell/components/shellMenuBar/view/MenuBar.view.xml":'<View xmlns="sap.m"\n    xmlns:core="sap.ui.core" controllerName="sap.ushell.components.shell.MenuBar.controller.MenuBar">\n    <IconTabHeader showOverflowSelectList="true" items="{menu>/}" selectedKey="{viewConfiguration>/selectedKey}" select=".onMenuItemSelection">\n        <items>\n            <IconTabFilter text="{menu>text}" key="{menu>intent}" />\n        </items>\n    </IconTabHeader>\n</View>\n'
},"Component-preload"
);
