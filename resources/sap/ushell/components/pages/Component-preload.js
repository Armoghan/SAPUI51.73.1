//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/components/pages/Component.js":function(){//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Pages Runtime Component
 * This UIComponent gets initialized by the FLP renderer upon visiting
 * #Shell-home or #Launchpad-openFLPPage if spaces are enabled (/core/spaces/enabled).
 * In the future it should completely replace the classical homepage.
 *
 * @version 1.73.1
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ushell/EventHub",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/resources"
], function (UIComponent, EventHub, SharedComponentUtils, resources) {
    "use strict";

    /**
     * Component of the PagesRuntime view.
     *
     * @param {string} sId Component id
     * @param {object} oSParams Component parameter
     *
     * @class
     * @extends sap.ui.core.UIComponent
     *
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.pages.Component
     */
    return UIComponent.extend("sap.ushell.components.pages.Component", /** @lends sap.ushell.components.pages.Component */{
        metadata: {
            manifest: "json"
        },
        /**
         * UI5 lifecycle method which gets called upon component instantiation.
         * It emits the "PagesRuntimeRendered" event to notify the Scheduling Agent
         * that the pages runtime is successfully rendered.
         *
         * @private
         * @since 1.72.0
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            EventHub.emit("PagesRuntimeRendered");
            SharedComponentUtils.toggleUserActivityLog();
            SharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");
            this.setModel(resources.i18nModel, "i18n");
        },
        /**
         * Returns an empty object as this component doesn't
         * hold any component data.
         *
         * @returns {object} An empty object
         *
         * @private
         * @since 1.72.0
         */
        getComponentData: function () {
            return {};
        }
    });
});
},
	"sap/ushell/components/pages/controller/PageRuntime.controller.js":function(){//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview PageRuntime controller for PageRuntime view
 *
 * @version 1.73.1
 */

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/GenericTile",
    "sap/ushell/resources",
    "sap/m/MessagePage",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Config",
    "sap/ushell/components/pages/formatter/PageRuntimeFormatter",
    "sap/m/library",
    "sap/m/MessageToast"
], function (Controller, GenericTile, resources, MessagePage, JSONModel, Config, PageRuntimeFormatter, library, MessageToast) {
    "use strict";

    /**
     * Controller of the PagesRuntime view.
     * It is responsible for navigating between different pages and combines the
     * Pages service (@see sap.ushell.services.Pages) with the
     * VisualizationLoading service (@see sap.ushell.services.VisualizationLoading) to create
     * the content area of the Fiori Launchpad.
     *
     * @param {string} sId Controller id
     * @param {object} oParams Controller parameters
     *
     * @class
     * @extends sap.ui.core.mvc.Controller
     *
     * @private
     * @since 1.72.0
     * @alias sap.ushell.components.pages.controller.Pages
     */
    return Controller.extend("sap.ushell.components.pages.controller.Pages", /** @lends sap.ushell.components.pages.controller.Pages.prototype */ {
        formatter: PageRuntimeFormatter,

        /**
         * UI5 lifecycle method which is called upon controller initialization.
         * It gets all the required UShell services and sets the Pages service
         * model to the view. It also sets a separate model to the view which includes
         * some settings which change the view behavior.
         *
         * @private
         * @since 1.72.0
         */
        onInit: function () {
            this._oVisualizationLoadingService = sap.ushell.Container.getServiceAsync("VisualizationLoading");
            this._oPagesService = sap.ushell.Container.getServiceAsync("Pages");
            this._oURLParsingService = sap.ushell.Container.getServiceAsync("URLParsing");

            this._oViewSettingsModel = new JSONModel({
                sizeBehavior: Config.last("/core/home/sizeBehavior")
            });
            this.getView().setModel(this._oViewSettingsModel, "viewSettings");

            this._aConfigListeners = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
                this._oViewSettingsModel.setProperty("/sizeBehavior", sSizeBehavior);
            }.bind(this));

            this._oErrorPageModel = new JSONModel({
                icon: "sap-icon://documents",
                text: "",
                description: "",
                details: ""
            });
            this.getView().setModel(this._oErrorPageModel, "errorPage");

            this._oPagesService.then(function (oPagesService) {
                this.getView().setModel(oPagesService.getModel());
            }.bind(this));

            this.sCurrentTargetPageId = "";
            this._openFLPPage();

            this.oContainerRouter = sap.ushell.Container.getRenderer().getRouter();
            this.oContainerRouter.getRoute("home").attachMatched(this._openFLPPage, this);
            this.oContainerRouter.getRoute("openFLPPage").attachMatched(this._openFLPPage, this);

            this.oEventBus = sap.ui.getCore().getEventBus();
            this.oEventBus.subscribe("sap.ushell", "navigated", this._onShellNavigated, this);
            this.oErrorPage = this.byId("errorPage");
            this.oPagesNavContainer = this.byId("pagesNavContainer");
            this.oPagesNavContainer.attachNavigate(this._onPageNavigated, this);
            this.oPagesRuntimeNavContainer = this.byId("pagesRuntimeNavContainer");
            this.oPagesRuntimeNavContainer.attachNavigate(this._onErrorPageNavigated, this);
            document.addEventListener("visibilitychange", this._onTabNavigated.bind(this));
        },

        /**
         * Handles the visibility of the current page in the inner navContainer. When an application or the app finder
         * is opened, sets the visibility of the current page to false.
         *
         * @returns {Promise} Resolves to an empty value
         *
         * @private
         * @since 1.72.0
         */
        _onShellNavigated: function () {
            return this._oURLParsingService.then(function (urlParsingService) {
                var oHash = urlParsingService.parseShellHash(window.hasher.getHash());

                // nav to Shell-home or Launchpad-openFLPPage
                if ((oHash.semanticObject === "Shell" && oHash.action === "home")
                    || (oHash.semanticObject === "Launchpad" && oHash.action === "openFLPPage")) {
                    this._setCurrentPageVisibility(true, true);
                } else {
                    // open eg.app finder, application
                    this._setCurrentPageVisibility(false, false);
                }
            }.bind(this));
        },

        /**
         * Handles the visibility of the current page in the inner navContainer. When the browser navigates to another
         * tab, sets its visibility to false.
         *
         * @returns {Promise} Resolves to an empty value
         *
         * @private
         * @since 1.72.0
         */
        _onTabNavigated: function () {
            return this._oURLParsingService.then(function (urlParsingService) {
                var oHash = urlParsingService.parseShellHash(window.hasher.getHash());
                // navigate to or leave  Shell-home or Launchpad-openFLPPage
                if ((oHash.semanticObject === "Shell" && oHash.action === "home") ||
                    (oHash.semanticObject === "Launchpad" && oHash.action === "openFLPPage")) {
                    this._setCurrentPageVisibility(!document.hidden);
                }
            }.bind(this));
        },

        /**
         * Handles the visibility of the current page in the inner navContainer. When navigation happens, sets the
         * visibility of the previous page to false and the current page to true.
         *
         * @param {sap.ui.base.Event} event The navigate event of navContainer
         *
         * @private
         * @since 1.72.0
         */
        _onPageNavigated: function (event) {
            var oParams = event.getParameters();
            var oSourcePage = oParams.from;
            var oTargetPage = oParams.to;
            this._setPageVisibility(oSourcePage, false);
            this._setPageVisibility(oTargetPage, true);
        },

        /**
         * Handles the visibility of the current page in the inner navContainer. When entering or leaving a page,
         * sets its visibility accordingly.
         *
         * @param {sap.ui.base.Event} event The navigate event of navContainer
         *
         * @private
         * @since 1.73.0
         */
        _onErrorPageNavigated: function (event) {
            var oTargetPage = event.getParameter("to");

            // Sets the current page in the inner navContainer to invisible/visible
            // if the outer container navigates to/from the error page.
            this._setCurrentPageVisibility(!(oTargetPage instanceof MessagePage));
        },

        /**
         * Sets the visibility of the page that is displayed in the inner navContainer.
         *
         * @param {boolean} visibility The visibility of the current page
         * @param {boolean} refresh Indicates if all the visualizations of the current page should be refreshed
         *
         * @private
         * @since 1.72.0
         */
        _setCurrentPageVisibility: function (visibility, refresh) {
            var oCurrentPage = this.oPagesNavContainer.getCurrentPage();
            this._setPageVisibility(oCurrentPage, visibility, refresh);
        },

        /**
         * Sets the tiles in the page to active or inactive according to the visibility of the page.
         *
         * @param {object} page A page
         * @param {boolean} visibility The visibility of a page
         * @param {boolean} refresh Indicates if all the visualizations of the current page should be refreshed
         *
         * @private
         * @since 1.72.0
         */
        _setPageVisibility: function (page, visibility, refresh) {
            if (!page) {
                return;
            }
            page.getContent()[0].getAggregation("sections").forEach(function (oSection) {
                oSection.getAggregation("visualizations").forEach(function (oVisualization) {
                    if (oVisualization.setActive) {
                        oVisualization.setActive(visibility, refresh);
                    }
                });
            });
        },

        /**
         * Gets the url parameters and returns the spaceId and pageId of the target page.
         *
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
         *
         * @private
         * @since 1.72.0
         */
        _getPageAndSpaceId: function () {
            return this._oURLParsingService.then(function (urlParsingService) {
                var oHash = urlParsingService.parseShellHash(window.hasher.getHash());
                var oIntent = {
                    semanticObject: oHash.semanticObject || "",
                    action: oHash.action || ""
                };
                var oHashPartsParams = oHash.params || {};
                var aPageId = oHashPartsParams.pageId || [];
                var aSpaceId = oHashPartsParams.spaceId || [];


               return this._parsePageAndSpaceId(aPageId, aSpaceId, oIntent);
            }.bind(this));
        },

        /**
         * Parses the given spaceId and pageId. When there are no pageId and spaceId given but the intent is Shell-home,
         * returns the spaceId and pageId of the default page. When there is no pageId and spaceId, only a pageId or a
         * spaceId, or more than one pageId or spaceId given, returns a rejected promise with an error message.
         *
         * @param {array} pageId An array that contains the page id of the page which should be displayed
         * @param {array} spaceId An array that contains the space id of the page which should be displayed
         * @param {object} intent An object that contains the semantic object and action of the page which
         * should be displayed
         *
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId
         *
         * @private
         * @since 1.72.0
         */
        _parsePageAndSpaceId: function (pageId, spaceId, intent) {
            if (pageId.length < 1 && spaceId.length < 1) {
                if (intent.semanticObject === "Shell" && intent.action === "home") {
                    return this._getAssignedPage();
                }
                return Promise.reject(resources.i18n.getText("PageRuntime.NoPageIdAndSpaceIdProvided"));
            }

            if (pageId.length === 1 && spaceId.length === 0) {
                return Promise.reject(resources.i18n.getText("PageRuntime.OnlyPageIdProvided"));
            }

            if (pageId.length === 0 && spaceId.length === 1) {
                return Promise.reject(resources.i18n.getText("PageRuntime.OnlySpaceIdProvided"));
            }

            if (pageId.length > 1 || spaceId.length > 1) {
                return Promise.reject(resources.i18n.getText("PageRuntime.MultiplePageOrSpaceIdProvided"));
            }

            if (pageId[0] === "") {
                return Promise.reject(resources.i18n.getText("PageRuntime.InvalidPageId"));
            }

            if (spaceId[0] === "") {
                return Promise.reject(resources.i18n.getText("PageRuntime.InvalidSpaceId"));
            }

            return Promise.resolve({
                pageId: pageId[0],
                spaceId: spaceId[0]
            });
        },

        /**
         * Returns the default page of the current user.
         * It uses the Menu service to retrieve the first menu entry.
         * We currently interpret the first menu entry as the "default"
         * page.
         *
         * @returns {Promise<object>} Resolves to an object contains the pageId and spaceId of the page
         *
         * @private
         * @since 1.72.0
         */
        _getAssignedPage: function () {
            return sap.ushell.Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.getMenuEntries();
                })
                .then(function (menuEntries) {
                    if (menuEntries.length < 1) {
                        return Promise.reject(resources.i18n.getText("PageRuntime.NoAssignedPage"));
                    }
                    return this._oURLParsingService.then(function (oURLParsingService) {
                        var oParams;
                            oParams = oURLParsingService.parseShellHash(menuEntries[0].intent).params;
                            if (!oParams || !oParams.spaceId || !oParams.pageId) {
                                return Promise.reject(resources.i18n.getText("PageRuntime.CannotFindADefaultPage"));
                            }
                            return {
                                spaceId: oParams.spaceId[0],
                                pageId: oParams.pageId[0]
                            };
                    });
                }.bind(this));
        },

        /**
         * Triggers the navigation to a specific page after the pageId is returned and the
         * VisualizationLoading service loaded all the visualization data
         * and the Pages service could successfully load the requested
         * page. Triggers the navigation to an error page when an error occurs.
         *
         * @returns {Promise<string>}
         *  A promise which resolves with the path to the page model after
         *  the page was successfully loaded.
         *
         * @private
         * @since 1.72.0
         */
        _openFLPPage: function () {
            var sPageId,
                sSpaceId;

            return this._getPageAndSpaceId().then(function (ids) {
                sPageId = ids.pageId;
                sSpaceId = ids.spaceId;

                // This property may be updated by consecutive calls to _openFLPPage and prevents race conditions when
                // opening pages.
                this.sCurrentTargetPageId = sPageId;

                return this._oVisualizationLoadingService.then(function (oVisService) {
                    this._oResolvedVisualizationLoadingService = oVisService;

                    return Promise.all([ oVisService.loadVisualizationData(), this._oPagesService ]);
                }.bind(this)).then(function (results) {
                    var oPageService = results[1];
                    return oPageService.loadPage(sPageId);
                }).then(function () {
                    if (this.sCurrentTargetPageId === sPageId) {
                        this._navigate(sPageId);
                    }
                }.bind(this)).catch(function (error) {
                    var sDescription = resources.i18n.getText("PageRuntime.CannotLoadPage.Description") + JSON.stringify(error);

                    this._oErrorPageModel.setProperty("/icon", "sap-icon://documents");
                    this._oErrorPageModel.setProperty("/text", resources.i18n.getText("PageRuntime.CannotLoadPage.Text", [sPageId, sSpaceId]));
                    this._oErrorPageModel.setProperty("/description", "");
                    this._oErrorPageModel.setProperty("/details", sDescription);

                    this.oPagesRuntimeNavContainer.to(this.oErrorPage);
                }.bind(this));
            }.bind(this)).catch(function (error) {
                this._oErrorPageModel.setProperty("/icon", "sap-icon://documents");
                this._oErrorPageModel.setProperty("/text", error|| "");
                this._oErrorPageModel.setProperty("/description", "");
                this._oErrorPageModel.setProperty("/details", "");

                this.oPagesRuntimeNavContainer.to(this.oErrorPage);
            }.bind(this));
        },

        /**
         * Loops through every page in the inner NavContainer and displays
         * the one which was specified.
         *
         * @param {string} targetPageId The ID of the page which should be displayed
         *
         * @private
         * @since 1.72.0
         */
        _navigate: function (targetPageId) {
            var aPageControls = this.oPagesNavContainer.getPages();
            var sPageId;

            for (var i = 0; i < aPageControls.length; i++) {
                sPageId = aPageControls[i].data("pageId");
                if (targetPageId && targetPageId === sPageId) {
                    this.oPagesNavContainer.to(aPageControls[i]);
                    this.oPagesRuntimeNavContainer.to(this.oPagesNavContainer);
                    return;
                }
            }
        },

         /**
          * Displays the description of the current error and hide the button after it is pressed.
          *
          * @since 1.73.0
          * @private
          */
        _pressViewDetailsButton: function () {
            var sErrorDetails = this._oErrorPageModel.getProperty("/details") || "";
            this._oErrorPageModel.setProperty("/description", sErrorDetails);
        },

        /**
         * Copies the content of the text provided to the clipboard and shows a MessageToast with a success or error message
         *
         * @param {string} text The text that should be copied to the clipboard
         *
         * @since 1.73.0
         * @private
         */
        _copyToClipboard: function () {
            var oTemporaryDomElement = document.createElement("textarea");
            try {
                oTemporaryDomElement.contentEditable = true;
                oTemporaryDomElement.readonly = false;
                oTemporaryDomElement.textContent = this._oErrorPageModel.getProperty("/description");
                document.documentElement.appendChild(oTemporaryDomElement);

                oTemporaryDomElement.select();
                document.execCommand("copy");
                MessageToast.show(resources.i18n.getText("PageRuntime.CannotLoadPage.CopySuccess"), {
                    closeOnBrowserNavigation: false
                });
            } catch (oException) {
                MessageToast.show(resources.i18n.getText("PageRuntime.CannotLoadPage.CopyFail"), {
                    closeOnBrowserNavigation: false
                });
            } finally {
                oTemporaryDomElement.parentNode.removeChild(oTemporaryDomElement);
            }
        },

        /**
         * UI5 factory function which is used by the sections control
         * inside the runtime view to fill the visualizations aggregation
         * (@see sap.ushell.ui.launchpad.Section)
         *
         * @param {string} id Control ID
         * @param {sap.ui.model.Context} context UI5 context
         * @returns {sap.ui.core.Control} The UI5 control
         *
         * @private
         * @since 1.72.0
         */
        _visualizationFactory: function (id, context) {
            if (this._oResolvedVisualizationLoadingService) {
                var oVisualization = context.getObject();
                return this._oResolvedVisualizationLoadingService.instantiateVisualization(oVisualization);
            }
            return new GenericTile({
                state: library.LoadState.Failed
            });
        },

        /**
         * UI5 lifecycle method which is called upon controller destruction.
         * It detaches the router events and config listeners.
         *
         * @private
         * @since 1.72.0
         */
        onExit: function () {
            this.oContainerRouter.getRoute("home").detachMatched(this._openFLPPage, this);
            this.oContainerRouter.getRoute("openFLPPage").detachMatched(this._openFLPPage, this);
            this._aConfigListeners.off();
            this.oEventBus.unsubscribe("sap.ushell", "navigated", this._onPageNavigated, this);
            document.removeEventListener("visibilitychange");
            this.oPagesNavContainer.detachNavigate(this._onPageNavigated, this);
            this.oPagesRuntimeNavContainer.detachNavigate(this._onErrorPageNavigated, this);
        }
    });
});
},
	"sap/ushell/components/pages/formatter/PageRuntimeFormatter.js":function(){//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview PageRuntimeFormatter consists of formatter functions
 * which are use throughout the PagesRuntime.
 *
 * @version 1.73.1
 */

sap.ui.define([
    "sap/ui/Device"
], function (Device) {
    "use strict";
    var PageRuntimeFormatter = {};

    /**
     * Returns the section visibility depending on the used device and visualization count
     *
     * @param {object[]} visualizations An array of visualizations which are inside the section
     * @returns {boolean} The section visibility
     *
     * @since 1.73.0
     * @private
     */
    PageRuntimeFormatter._sectionVisibility = function (visualizations) {
        return !(visualizations.length === 0 && Device.system.phone);
    };

    return PageRuntimeFormatter;
});
},
	"sap/ushell/components/pages/manifest.json":'{\n    "_version": "1.73.1",\n    "sap.app": {\n        "id": "sap.ushell.components.pages"\n    },\n    "sap.ui": {\n        "technology": "UI5",\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "rootView": {\n            "viewName": "sap.ushell.components.pages.view.PageRuntime",\n            "type": "XML",\n            "async": true\n        },\n        "dependencies": {\n            "minUI5Version": "1.71",\n            "libs": {\n                "sap.m": {},\n                "sap.f": {}\n            }\n        }\n    }\n}\n',
	"sap/ushell/components/pages/view/PageRuntime.view.xml":'<View height="100%"\n    controllerName="sap.ushell.components.pages.controller.PageRuntime"\n    xmlns="sap.m"\n    xmlns:data="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"\n    xmlns:lp="sap.ushell.ui.launchpad">\n    <NavContainer id="pagesRuntimeNavContainer">\n        <NavContainer id="pagesNavContainer" pages="{/pages}">\n            <Page data:pageId="{id}" showHeader="false" backgroundDesign="Transparent">\n                <lp:Page sections="{\n                    path: \'sections\',\n                    templateShareable: false\n                }">\n                    <lp:Section title="{title}" sizeBehavior="{viewSettings>/sizeBehavior}" visible="{\n                        path: \'visualizations\',\n                        formatter: \'.formatter._sectionVisibility\'\n                    }" visualizations="{\n                        path: \'visualizations\',\n                        factory: \'._visualizationFactory\'\n                    }" />\n                </lp:Page>\n            </Page>\n        </NavContainer>\n        <MessagePage id="errorPage"\n            showHeader="false"\n            icon="{errorPage>/icon}"\n            text="{errorPage>/text}"\n            description="{errorPage>/description}">\n            <buttons>\n                <Button text="{i18n>PageRuntime.CannotLoadPage.DetailsButton}"\n                    visible="{= !!${errorPage>/details} &amp;&amp; !${errorPage>/description}}"\n                    press="._pressViewDetailsButton"/>\n                <Button text="{i18n>PageRuntime.CannotLoadPage.CopyButton}"\n                    visible="{= !!${errorPage>/details} }"\n                    press="._copyToClipboard"/>\n            </buttons>\n        </MessagePage>\n    </NavContainer>\n</View>'
},"Component-preload"
);
