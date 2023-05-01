// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "./BaseDialog.controller",
    "sap/base/util/merge",
    "sap/ui/core/library"
], function (
    JSONModel,
    BaseDialogController,
    merge,
    coreLibrary
) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.CopyPageDialog", {
        constructor: function (oView, oResourceBundle) {
            this._oView = oView;
            this._oModel = new JSONModel({ validation: { targetId: false } });
            this.sViewId = "copyDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.CopyPageDialog";
            this._oResourceBundle = oResourceBundle;
        },

        /**
         * Called if the save button is clicked.
         * Retrieves all values and calls the confirm handler if set.
         *
         * @private
         */
        onConfirm: function () {
            var oModel = this.getModel(),
                oResolvedResult = {
                    content: {
                        targetId: oModel.getProperty("/targetId"),
                        sourceId: oModel.getProperty("/sourceId"),
                        title: oModel.getProperty("/title")
                    },
                    metadata: {}
                };
            if (this._fnConfirm) {
                this._fnConfirm(oResolvedResult);
            }
        },

        /**
         * Resets all fields to their initial values. If there are other values in the validation path, keep them.
         *
         * @param {sap.ui.model.json.JSONModel} oModel The JSONModel instance to reset.
         * @private
         */
        _resetModel: function (oModel) {
            oModel.setProperty("/targetId", "");
            oModel.setProperty("/sourceId", "");
            oModel.setProperty("/title", "");
            var oValidation = merge({}, oModel.getProperty("/validation"), {
                targetId: false
            });
            oModel.setProperty("/validation", oValidation);
        },

        /**
         * Called before the CreatePageDialog opens.
         * Creates the validation model.
         *
         * @private
         */
        onBeforeOpen: function () {
            var oFragment = this._oView.byId("copyDialog");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            this._resetModel(oFragment.getModel());
        },

        /**
         * Called on the change of the ID.
         *
         * @param {sap.ui.base.Event} oEvent The change event.
         * @private
         */
        onIdChange: function (oEvent) {
            var sNewId = oEvent.getParameters().value;
            this.handlePackageNamespaceChange(sNewId, false);
        },

        /**
         * Called on the live change of the ID.
         *
         * @param {sap.ui.base.Event} oEvent The change event.
         * @private
         */
        onIdLiveChange: function (oEvent) {
            var oInput = oEvent.getSource(),
                oModel = this.getModel(),
                sInputValue = oInput.getValue(),
                bIsValid = this.isValidID(sInputValue),
                oValidation = merge({}, oModel.getProperty("/validation"), { targetId: bIsValid }),
                sValueState = bIsValid ? ValueState.None : ValueState.Error;
            oModel.setProperty("/validation", oValidation);
            oInput.setValueState(sValueState);
            if (sInputValue.length > 0) {
                oInput.setValueStateText(this._oResourceBundle.getText("Message.InvalidPageID"));
            } else {
                oInput.setValueStateText(this._oResourceBundle.getText("Message.EmptyPageID"));
            }
            this.handlePackageNamespaceChange(sInputValue, true);
        }
    });
});
