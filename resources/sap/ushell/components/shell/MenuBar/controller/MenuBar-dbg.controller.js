// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
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