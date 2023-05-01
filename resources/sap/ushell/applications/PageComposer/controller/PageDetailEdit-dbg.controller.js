// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "./BaseController",
    "./Page",
    "./TileSelector",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/library",
    "sap/m/MessageToast",
    "sap/base/Log"
], function (
    MessagePopover,
    MessageItem,
    BaseController,
    Page,
    TileSelector,
    JSONModel,
    MessageBox,
    coreLibrary,
    MessageToast,
    Log
) {
    "use strict";

    var oModel = new JSONModel();

    /**
     * Convenience method to initialize the page model
     *
     * @param {object} model Page model to be initialized
     * @property {object} model.page Page of the model
     * @property {boolean} model.edit Wheter the page is in edit mode
     * @property {array} model.errors The errors on the page
     * @property {array} model.warnings The warnings on the page
     * @property {array} model.messages The combined errors and warnings on the page
     * @property {boolean} model.headerExpanded Wheter the page header is expanded
     *
     * @private
     */
    function _initModel (model) {
        model.setData({
            page: {},
            edit: false,
            dirtyPage: false,
            errors: [],
            warnings: [],
            messages: [],
            headerExpanded: true,
            catalogsExpanded: true
        });
    }

    function _setDirtyFlag (bValue) {
        sap.ushell.Container.setDirtyFlag(bValue);
        oModel.setProperty("/dirtyPage", bValue);
    }

    // JSONModel change event does not work properly
    oModel.setProperty = function (sPath, value, context) {
        var sRootPath = context ? context.getPath() : sPath;
        if (sRootPath.indexOf("/page") === 0 && !jQuery.isEmptyObject(oModel.getProperty("/page"))) {
            _setDirtyFlag(true);
        }
        JSONModel.prototype.setProperty.apply(this, arguments);
    };

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.PageDetailEdit", {
        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            var oLayoutContent = this.getView().byId("layoutContent"),
                oToggleCatalogsButton = this.getView().byId("toggleCatalogsButton"),
                oRouter = this.getRouter();
            oRouter.getRoute("edit").attachPatternMatched(this._onPageMatched, this);
            this.setModel(oModel);

            this.Page.init(this);
            this.TileSelector.init(this);
            this.TileSelector.setAddTileHandler(this.addVisualisationToSection.bind(this));

            this.getView().addEventDelegate({
                onBeforeHide: this.onRouteLeave.bind(this)
            });

            oLayoutContent.attachBreakpointChanged(function (oEvent) {
                // hides the "toggleCatalogsButton" when the TileSelector has not enough space to be rendered
                oToggleCatalogsButton.setVisible(oEvent.getParameters().currentBreakpoint !== "S");
            });
        },

        /**
         * Called when page detail view is exited.
         *
         * @private
         */
        onExit: function () {
            this.Page.exit();
        },

        Page: Page,
        TileSelector: new TileSelector(),
        oMessagePopover: new MessagePopover({
            items: {
                path: "/messages",
                template: new MessageItem({
                    type: "{type}",
                    title: "{title}",
                    activeTitle: "{active}",
                    description: "{description}",
                    subtitle: "{subTitle}",
                    counter: "{counter}"
                })
            },
            beforeOpen: function () { this.addStyleClass("sapUshellMessagePopoverNoResize"); }
        }).setModel(oModel),

        /**
         * Handles the message popover press in the footer bar.
         *
         * @param {sap.ui.base.Event} oEvent The press event.
         *
         * @private
         */
        handleMessagePopoverPress: function (oEvent) {
            this.oMessagePopover.toggle(oEvent.getSource());
        },

        /**
         * Called if the show/hide catalogs button is called.
         * Used to show or hide the side content.
         *
         * @private
         */
        onUpdateSideContentVisibility: function () {
            oModel.setProperty("/catalogsExpanded", !oModel.getProperty("/catalogsExpanded"));
        },

        /**
         * Called if the title is changed
         * If the title is empty, the valueState changes to ERROR
         *
         * @param {sap.ui.base.Event} oEvent The change event
         *
         * @private
         */
        onTitleChange: function (oEvent) {
            var oInput = oEvent.getSource();
            oInput.setValueStateText(this.getResourceBundle().getText("Message.EmptyTitle"));

            if (!oInput.getValue()) {
                oInput.setValueState(coreLibrary.ValueState.Error);
            } else {
                oInput.setValueState(coreLibrary.ValueState.None);
            }
        },

        /**
         * Called if the save button is pressed.
         * MessageToast will confirm that the changes have been successfully saved
         *
         * @private
         */
        onSave: function () {
            var oResourceBundle = this.getResourceBundle();
            var fnSave = function (sClickedAction) {
                if (sClickedAction === MessageBox.Action.OK) {
                    _setDirtyFlag(false); // Disable the Save button immediately to prohibit users pressing it twice
                    this.getView().setBusy(true);
                    this._savePage(oModel.getProperty("/page")).then(function () {

                        MessageToast.show(oResourceBundle.getText("Message.SavedChanges"), {
                            closeOnBrowserNavigation: false
                        });
                    }).catch(function (sErrorMsg) {
                        this.showMessageBoxError(sErrorMsg, false);
                        _setDirtyFlag(true); // Restore the dirty flag in case of errors
                    }.bind(this)).finally(function () {
                        this.getView().setBusy(false);
                    }.bind(this));
                }
            }.bind(this);

            if (!oModel.getProperty("/page/content/title")) {
                this.showMessageBoxError(oResourceBundle.getText("Message.EmptyTitle"));
                oModel.setProperty("/headerExpanded", true);

                return;
            }

            if (!window.navigator.onLine) {
                this.showMessageBoxError(oResourceBundle.getText("Message.NoInternetConnection"));

                return;
            }

            if (oModel.getProperty("/errors").length > 0) {
                var sTitle = oResourceBundle.getText("Title.TilesHaveErrors"),
                    sMessage = oResourceBundle.getText("Message.TilesHaveErrors");
                sap.ushell.Container.getService("Message").confirm(sMessage, fnSave, sTitle);

                return;
            }

            fnSave(MessageBox.Action.OK);
        },

        /**
         * Called if the cancel button is pressed.
         * Navigates to the page overview without saving changes.
         *
         * @private
         */
        onCancel: function () {
            this.navigateToPageOverview();
        },

        /**
         * Formatter used for extracting the "length" property of an object.
         *
         * @param {object} object The object to have its "length" property retrieved from.
         * @returns {*} The "length" property of the object parameter or "undefined" if the object is falsy.
         * @private
         */
        _formatLength: function (object) {
            return (object ? object.length : undefined);
        },

        /**
         * Set the new transportId to the page object
         *
         * @param {sap.ui.base.Event} event The object containing the metadata
         *
         * @private
         */
        _updatePageWithMetadata: function (event) {
            if (event && event.metadata && event.metadata.transportId) {
                oModel.setProperty("/page/metadata/transportId", event.metadata.transportId);
            }
        },

        /**
         * Called if the route matched the pattern for the editing of a page.
         * Loads the page with the id given in the URL parameter.
         *
         * @param {sap.ui.base.Event} event The routing event
         *
         * @private
         */
        _onPageMatched: function (event) {
            var oArguments = event.getParameter("arguments");
            var sPageId = decodeURIComponent(oArguments.pageId);
            var sRole = this.getOwnerComponent().getRole();
            this.getView().setBusy(true);

            Log.info("The page with id " + sPageId + " was opened in edit mode scoped by the following role", sRole);

            _initModel(oModel);
            this._loadPage(sPageId).then(function (oPage) {
                this._pageEditAllowed(oPage).then(function (editAllowed) {
                    if (!editAllowed) {
                        return;
                    }

                    oModel.setProperty("/page", oPage);
                    oModel.setProperty("/edit", true);

                    this.checkShowEditDialog(
                        oPage,
                        this._updatePageWithMetadata.bind(this),
                        this.navigateToPageOverview.bind(this)
                    );

                    this.Page.init(this);

                    if (!oModel.getProperty("/page/content/sections").length) {
                        this.Page.addSection();
                    } else {
                        this.collectPageMessages();
                        _setDirtyFlag(false);
                    }
                }.bind(this));
            }.bind(this)).catch(function () {
                this.navigateToErrorPage(sPageId);
            }.bind(this)).finally(function () {
                this.getView().setBusy(false);
            }.bind(this));

            this.fetchCatalogInfo(sPageId, sRole)
                .then(this.TileSelector.initTiles)
                .catch(function (sErrorMsg) {
                    this.showMessageBoxError(sErrorMsg, true);
                }.bind(this));
        },

        /**
         * Checks if the user is allowed to edit the page.
         *
         * @param {object} page The page to edit.
         * @returns {Promise<boolean>} A promise which resolves to true/false depending on if editing is allowed for the user.
         * @private
         */
        _pageEditAllowed: function (page) {
            return Promise.resolve(!this.checkMasterLanguageMismatch(page));
        },

        /**
         * Loads the page with the given pageId from the PagePersistence.
         *
         * @param {string} pageId The pageId to load
         * @returns {Promise<object>} A promise resolving to the page
         *
         * @private
         */
        _loadPage: function (pageId) {
            return Promise.all([
                sap.ushell.Container.getServiceAsync("VisualizationLoading"),
                this.getPageRepository().getPage(pageId)
            ]).then(function (promiseResults) {
                this.oVisualizationLoadingService = promiseResults[0];
                this.oVisualizationLoadingService.loadVisualizationData().then(function () {
                    oModel.updateBindings(true);
                    this.collectPageMessages();
                }.bind(this));
                return promiseResults[1];
            }.bind(this));
        },

        /**
         * Saves the page model using the PagePersistence service
         *
         * @param {object} page The page model to save
         * @returns {Promise<void>} A promise
         *
         * @private
         */
        _savePage: function (page) {
            return this.getPageRepository().updatePage(page);
        },

        /**
         * Collects errors and warnings that occured on the page.
         *
         * @private
         */
        collectPageMessages: function () {
            var oMessages = this.Page.collectMessages(),
                aErrors = oMessages.errors,
                aWarnings = oMessages.warnings,
                aMessages = aErrors.concat(aWarnings);

            oModel.setProperty("/errors", aErrors);
            oModel.setProperty("/warnings", aWarnings);
            oModel.setProperty("/messages", aMessages);
        },

        /* Section - Model API */

        /**
         * Adds a section to the model at the given index.
         *
         * @param {integer} sectionIndex The index of where to add the section in the array
         *
         * @protected
         */
        addSectionAt: function (sectionIndex) {
            var aSections = oModel.getProperty("/page/content/sections");

            if (!aSections) {
                Log.warning("The Model is not ready yet.");
                return;
            }

            if (!sectionIndex && sectionIndex !== 0) {
                sectionIndex = aSections.length;
            }
            aSections.splice(sectionIndex, 0, {
                title: "",
                visualizations: []
            });

            oModel.setProperty("/page/content/sections", aSections);
        },

        /**
         * Handles the deletion of a section using and updating the model
         *
         * @param {integer} sectionIndex The index of the section, that should be deleted
         *
         * @protected
         */
        deleteSection: function (sectionIndex) {
            if (!sectionIndex && sectionIndex !== 0) {
                return;
            }

            var aSections = oModel.getProperty("/page/content/sections");
            aSections.splice(sectionIndex, 1);
            oModel.setProperty("/page/content/sections", aSections);
            this.collectPageMessages();
        },

        /**
         * Handles the moving of a section using and updating the model
         *
         * @param {integer} originalSectionIndex The old index of the section, that should be moved
         * @param {integer} newSectionIndex The new index of the section, that should be moved
         *
         * @protected
         */
        moveSection: function (originalSectionIndex, newSectionIndex) {
            if (!originalSectionIndex && originalSectionIndex !== 0
                || !newSectionIndex && newSectionIndex !== 0) {
                return;
            }

            var aSections = oModel.getProperty("/page/content/sections"),
                oSectionToBeMoved = aSections.splice(originalSectionIndex, 1)[0];

            aSections.splice(newSectionIndex, 0, oSectionToBeMoved);
            oModel.setProperty("/page/content/sections", aSections);
            this.collectPageMessages();
        },

        /* Visualisation - Model API */

        /**
         * Handles the addition of a visualization to a section using and updating the model
         *
         * @param {string} visualizationData The visualization data of the visualization that should be added
         * @param {number[]} sectionIndices The indices of sections, the content should be added to
         * @param {integer} visualizationIndex The index, the visualization should be added at
         *
         * @protected
         */
        addVisualisationToSection: function (visualizationData, sectionIndices, visualizationIndex) {
            if (!visualizationData || !sectionIndices.length) {
                return;
            }

            sectionIndices.forEach(function (iSectionIndex) {
                var aVisualizations = oModel.getProperty("/page/content/sections/" + iSectionIndex + "/visualizations");

                if (!aVisualizations) {
                    Log.warning("The Model is not ready yet.");
                    return;
                }

                if (!visualizationIndex && visualizationIndex !== 0) {
                    visualizationIndex = aVisualizations.length;
                }

                aVisualizations.splice(visualizationIndex, 0, visualizationData);

                oModel.setProperty("/page/content/sections/" + iSectionIndex + "/visualizations", aVisualizations);

                this.collectPageMessages();
            }.bind(this));
        },

        /**
         * Handles the deletion of a visualization inside a section using and updating the model
         *
         * @param {integer} visualizationIndex The index of the visualization, that should be deleted
         * @param {integer} sectionIndex The index of the section, the visualization is in
         *
         * @protected
         */
        deleteVisualizationInSection: function (visualizationIndex, sectionIndex) {
            var sPath = "/page/content/sections/" + sectionIndex + "/visualizations",
                aVisualizations = oModel.getProperty(sPath);
            aVisualizations.splice(visualizationIndex, 1);
            oModel.setProperty(sPath, aVisualizations);
            this.collectPageMessages();
        },

        /**
         * Handles the movement of a visualization inside a section and between different sections,
         * using and updating the model
         *
         * @param {integer} originalVisualizationIndex The old index, where the visualization was from
         * @param {integer} newVisualizationIndex The new index, where the visualization should go
         * @param {integer} originalSectionIndex The index of the section, the visualization was in
         * @param {integer} newSectionIndex The index of the section, where the visualization should be added
         *
         * @protected
         */
        moveVisualizationInSection: function (originalVisualizationIndex, newVisualizationIndex, originalSectionIndex, newSectionIndex) {
            if (!originalVisualizationIndex && originalVisualizationIndex !== 0
                || !newVisualizationIndex && newVisualizationIndex !== 0
                || !originalSectionIndex && originalSectionIndex !== 0
                || !newSectionIndex && newSectionIndex !== 0) {
                return;
            }

            var sOriginalVisualizationPath = "/page/content/sections/" + originalSectionIndex + "/visualizations",
                sNewVisualizationPath = "/page/content/sections/" + newSectionIndex + "/visualizations",
                aOriginalVisualizations = oModel.getProperty(sOriginalVisualizationPath),
                aNewVisualizations = oModel.getProperty(sNewVisualizationPath),
                oContent = aOriginalVisualizations.splice(originalVisualizationIndex, 1);

            aNewVisualizations.splice(newVisualizationIndex, 0, oContent[0]);

            oModel.setProperty(sOriginalVisualizationPath, aOriginalVisualizations);
            oModel.setProperty(sNewVisualizationPath, aNewVisualizations);
            this.collectPageMessages();
        },

        /**
         * Instantiates and opens the dialog for editing the header
         */
        openEditPageHeaderDialog: function () {
            sap.ui.require([
                "sap/ushell/applications/PageComposer/controller/EditPageHeaderDialog.controller"
            ], function (EditPageHeaderDialogController) {
                if (!this.oEditPageHeaderDialogController) {
                    this.oEditPageHeaderDialogController = new EditPageHeaderDialogController(this.getRootView());
                }
               this.oEditPageHeaderDialogController.attachConfirm(this.editPageHeaderConfirm.bind(this));
                this.oEditPageHeaderDialogController.load().then(function () {
                    this.oEditPageHeaderDialogController.open();
                    this.oEditPageHeaderDialogController.getModel().setProperty("/id", oModel.getProperty("/page/content/id"));
                    this.oEditPageHeaderDialogController.getModel().setProperty("/title", oModel.getProperty("/page/content/title"));
                    this.oEditPageHeaderDialogController.getModel().setProperty("/description", oModel.getProperty("/page/content/description"));
                    this.oEditPageHeaderDialogController.initialTitleValidation();
                }.bind(this));
            }.bind(this));
        },

        /**
         * Persists the values from the Edit Page Header Dialog box
         * @param {object} oResults gets the changed values from the Edit Page header dialog
         */
        editPageHeaderConfirm: function (oResults) {
            if (oModel.getProperty("/page/content/title") !== oResults.title) {
                oModel.setProperty("/page/content/title", oResults.title);
            }
            if (oModel.getProperty("/page/content/description") !== oResults.description) {
                oModel.setProperty("/page/content/description", oResults.description || "");
            }
        }
    });
});
