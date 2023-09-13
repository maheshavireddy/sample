sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var that;

        return Controller.extend("project1.controller.View1", {
            onInit: function () {
                that = this;
            },
            Go:function() {
                var oModel = that.getOwnerComponent().getModel('oData');
                oModel.read('/multivalues', {
                    success: function (aData) {
                        var aVResults = aData.results
                        var oJSONModel = new sap.ui.model.json.JSONModel();
                        oJSONModel.setData({
                            aItems: aVResults
                        })
                        that.byId("ProductList").setModel(oJSONModel)
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            
            },
        });
    });
