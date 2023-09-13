sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/FilterOperator"
   
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment,Filter,FilterOperator) {
        "use strict";
         var that;
        // var len;
        var aResults;
        var aItems;
        var len;
      
        return Controller.extend("salesorder.controller.Details", {
            onInit: function () {
              
                 that = this;
                 that.Trigger();
                //  that.CreateOrder();
               
                
            },
            getDetail: function(oEvent){
                var oSharedModel = that.getOwnerComponent().getModel("oShareModel");
                that.getView().byId("Details").setModel(oSharedModel)
            },
            CreateOrder:function(oEvent){
                if (!that.CreateDialog) {
                    that.CreateDialog = that.loadFragment({
                        name: "salesorder.view.OrderDialog"
                    });
                }
             
                // var oOrder = that.byId("tab1").getBinding()
                var Product_id = that.getOwnerComponent().getModel("GLOBAL").getProperty("/")
                var PD = Product_id.oCurrentObj.PRODUCT_ID
                that.byId("P").setValue(PD)

                var Description= that.getOwnerComponent().getModel("GLOBAL").getProperty("/")
                var PC = Description.oCurrentObj.UNIQUE_DES
                that.byId("Descr").setValue(PC)

                var idUnqi= that.getOwnerComponent().getModel("GLOBAL").getProperty("/")
                var IC = idUnqi.oCurrentObj.ID
                that.byId("UniqueId").setValue(IC)
    
                            
                that.CreateDialog.then(function(CoDialog) {
                    CoDialog.open();
                });
            },
            CreateData:function(){
                that.Trigger();
                var Prod = that.byId("P").getValue()
                var UnDes =that.byId("Descr").getValue()
                var UnqId = that.byId("UniqueId").getValue()
                var Quant = that.byId("Quant").getValue()
                var sDate = that.byId("DP1").getValue()
                var oSeed = {
                    ID:"SE00" +  parseInt(len + 1),
                    PRODUCT:Prod,
                    UNIQUE_ID:UnqId,
                    DESCRIPTION:UnDes,
                    QUANTITY: Quant,
                    DATE:sDate,
                }
                var oModel = this.getOwnerComponent().getModel("oData");
                oModel.callFunction("/Validator", {
                    method : "GET",
                    urlParameters: {
                        flag: "C",
                        Obj : JSON.stringify(oSeed),
                    
                    },
                    success: function (oData, _response) {
                        var message = _response.data.Validator.message;
                        sap.m.MessageToast.show(message);

                        that.onReject()
                        // that.CreateDialog.close()
                        // that.onAfterRendering();
                        that.reset();
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(e);
                    }
                })


            },
            onReject:function(){
                // that.CreateDialog.close()
                that.CreateDialog.then(function(CoDialog) {
                    CoDialog.close();
            })
        },
        handleChangeSearch:function(oEvent){
            
                var tableId = that.byId("Details");
                var sQuery = oEvent.getSource().getValue();
                var oBinding = tableId.getBinding("items");
                var aFilters = []
                
                if (sQuery && sQuery.length > 0) {
                    var filter = new sap.ui.model.Filter("CHARVAL_NUM", sap.ui.model.FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }
                
                oBinding.filter(aFilters);

        },
        reset:function(){
             that.byId("Quant").setValue("")
             that.byId("DP1").setValue("")

        },

        Trigger:function(){
            var oModel  = that.getOwnerComponent().getModel('oData');
            oModel.read('/SeedOrders', {
                success: function(aData){
                    aResults = aData.results
                    len = aResults.length
                    var oJSONModel =  new sap.ui.model.json.JSONModel();
                    oJSONModel.setData({
                        aItems: aData.results  
                    })
                },
                error: function (error){
                    console.log(error)  
                }
            })
        }
       
           
                
        });
    });



