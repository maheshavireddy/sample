sap.ui.define([
    "sap/ui/core/mvc/Controller"
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";
        var that;

        return Controller.extend("require.controller.View1", {
            onInit: function () {
                that = this;
                // that.onAfterRendering()
                

                // var datamodel = this.getOwnerComponent().getModel("SData")
            },
            onAfterRendering:function(){
                fetch("model/data.json")
                .then(response => response.json())
                .then(data => {
                    var data1 = data.sort((a,b) => a.PAGEID - b.PAGEID);

                // const customer = require('../model/data.json')

                // console.log(customer)
                    var oTable =  that.byId("tab1");
                    var aModel = new sap.ui.model.json.JSONModel();
                    aModel.setData({
                        aItems: data1
                    })
                    oTable.setModel(aModel);
                })
            },



            ////////CRUD
            onCreate:function(){
           
                if (!that.newCreateDialog) {
                    that.newCreateDialog = sap.ui.xmlfragment("require.view.Newfrag", that);
                }
                that.onClear();
                sap.ui.getCore().byId("btn").setText("Save")
                that.newCreateDialog.open();

            },
            onClear:function(){
                sap.ui.getCore().byId("PAGE").setValue("");
                sap.ui.getCore().byId("DESCR").setValue("");
                sap.ui.getCore().byId("PAREN").setValue("");
                sap.ui.getCore().byId("HEIGH").setValue("");
            },
            onClose:function(){
                that.newCreateDialog.close()
            },

            onAdd:function(oEvent){
                var page = sap.ui.getCore().byId("PAGE").getValue();
                var desc = sap.ui.getCore().byId("DESCR").getValue();
                var pare = sap.ui.getCore().byId("PAREN").getValue();
                var heir = sap.ui.getCore().byId("HEIGH").getValue();
                var newRecord = {
                    "PAGEID": parseInt(page),
                    "DESCRIPTION": desc,
                    "PARENTNODEID": parseInt(pare),
                    "HEIRARCHYLEVEL": parseInt(heir)
                    };

                    if(sap.ui.getCore().byId("btn").getText() === "Save"){
                        var oModel = that.getOwnerComponent().getModel('Odata')
                        oModel.callFunction("/CURD", {
                            method : "GET",
                            urlParameters: {
                                flag: "CREATE",
                                Obj : JSON.stringify(newRecord),
                            },
                            success: function (oData, _response) {
                                var message = _response.data.CURD.message;
                                sap.m.MessageToast.show(message);
                                that.onClose();
                                that.onAfterRendering()
                                that.onClear();
                                
                            },
                            error: function (e) {
                                sap.m.MessageToast.show(e);
                            }
                        }) 
                    }
                    else{
                        if(sap.ui.getCore().byId("btn").getText() === "Update"){
                            var oModel = that.getOwnerComponent().getModel('Odata')
                            oModel.callFunction("/CRUD", {
                                method : "GET",
                                urlParameters: {
                                    flag: "UPC",
                                    Obj : JSON.stringify(newRecord),
                                },
                                success: function (oData, _response) {
                                    var message = _response.data.CRUD.message;
                                    sap.m.MessageToast.show(message);
                                    sap.ui.getCore().byId("btn").setText("Save")
                                    that.onClose();
                                    that.onAfterRendering();
                                    that.onClear();   
                                },
                                error: function (e) {
                                    sap.m.MessageToast.show(e);
                                }
                            }) 
                        }
                    }
            },
            onUpdate:function(oEvent){
                if (!that.newCreateDialog) {
                    that.newCreateDialog = sap.ui.xmlfragment("require.view.Newfrag", that);
                }
                var oCurrenObject  = that.byId("tab1").getSelectedItem().getBindingContext().getObject()
                sap.ui.getCore().byId("PAGE").setValue(oCurrenObject.PAGEID);
                sap.ui.getCore().byId("DESCR").setValue(oCurrenObject.DESCRIPTION);
                sap.ui.getCore().byId("PAREN").setValue(oCurrenObject.PARENTNODEID);
                sap.ui.getCore().byId("HEIGH").setValue(oCurrenObject.HEIRARCHYLEVEL);
                sap.ui.getCore().byId("btn").setText("Update")
                that.newCreateDialog.open();
            },
            onDelete:function(){
                var oCurrenObject  = that.byId("tab1").getSelectedItem().getBindingContext().getObject()
                console.log(oCurrenObject)
                var oModel = that.getOwnerComponent().getModel('Odata')
                oModel.callFunction("/CRUD", {
                    method : "GET",
                    urlParameters: {
                        flag: "DEL",
                        Obj : JSON.stringify(oCurrenObject),
                    },
                    success: function (oData, _response) {
                        var message = _response.data.CRUD.message;
                        sap.m.MessageToast.show(message);
                        that.onAfterRendering();
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(e);
                    }
                }) 
            },
            onNav:function(){
                
            },
        });
    });
