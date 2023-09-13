sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/f/library',
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, fioriLibrary, Fragment, Filter, FilterOperator,MessageToast) {
        "use strict";
        var that;
        var aResu
        var Array1;
        var aArray2;
        var aResult;
        var aLastAdded;
        var aDupliactes;
        var aResults;
        var aVResults;
        var oCurrentObj;
        var aSomevalues;
        return Controller.extend("salesorder.controller.View1", {
            onInit: function () {
                that = this
                that.aMultiColurs()
            },
            onAfterRendering: function () {
                // that.onGo()
                // that.onDetails()
            },

            ///For Product Values 
            onValueHelpRequest: function (oEvent) {
                if (!that.newDetailsDialog) {

                    that.newDetailsDialog = sap.ui.xmlfragment("salesorder.view.ValueHelpDialog", that);
                }
                that.newDetailsDialog.open();
                var oModel = that.getOwnerComponent().getModel('oData');
                oModel.read('/pView', {
                    success: function (aData) {
                        aResult = aData.results
                        var oJSONModel = new sap.ui.model.json.JSONModel();
                        oJSONModel.setData({
                            aItems: aData.results
                        })
                        sap.ui.getCore().byId("selectDialog").setModel(oJSONModel);
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            },
            ////Seacrh For Product Products
            onValueHelpDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("PRODUCT_ID", FilterOperator.EQ, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            /////Confirmation and Close Fn
            onValueHelpDialogClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                oEvent.getSource().getBinding("items").filter([]);
                if (!oSelectedItem) {
                    return;
                }
                this.byId("productInput").setValue(oSelectedItem.getTitle());
            },
            onClick: function () {
                if(that.byId("productInput").getValue() === ""){
                    sap.m.MessageToast.show("Please select a Confirguable Product");
                }
                else{
                    if (!that.newCreateDialog) {
                        that.newCreateDialog = sap.ui.xmlfragment("salesorder.view.CreateDialog", that);
                    }
    
                    var Product_id = that.byId("productInput").getValue()
                    sap.ui.getCore().byId("ID").setValue(Product_id);
    
                    var Unique_Id = sap.ui.getCore().byId("box1").getSelectedKey()
                    var Active = Boolean(true)
                    sap.ui.getCore().byId("act").setValue(Active)
    
                    that.newCreateDialog.open();
                    that.creationSave()
                }
               
            },
            onCancel: function () {
                that.newCreateDialog.close();
                that.newCreateDialog.destroy();
                that.newCreateDialog = "";

            },

            onBrowse: function () {
                if(that.byId("productInput").getValue() === "" ){
                    sap.m.MessageToast.show("Required Valid Inputs")
                }
                else{
                    if (!that.CopyDialog) {
                        that.CopyDialog = that.loadFragment({
                            name: "salesorder.view.CopyDialog"
                        });
                    }
                    that.CopyDialog.then(function (CDialog) {
                        CDialog.open()
                        var Product_id = that.byId("productInput").getValue()
                        that.byId("cID").setValue(Product_id)
    
                        var Unique_Id = that.byId("box0").getValue()
                        that.byId("cUtype").setValue(Unique_Id)
    
                        var Active = oCurrentObj.ACTIVE
                        that.byId("cAct").setValue(Active);
                        
                        // var    copyTable  = [];
                        var a = that.getOwnerComponent().getModel("oShareModel").getProperty('/');
                        var c = a.items
                        var oJSONModel = new sap.ui.model.json.JSONModel();
                        oJSONModel.setData({
                            citems: c
                        })
                        that.byId("tab5").setModel(oJSONModel);
                    });
                }
               
                  
            },
            CLOSE: function () {
                that.CopyDialog.then(function (CopyValuesDialog) {
                    CopyValuesDialog.close();
                    that.onClear()
                })
            },
            onGo: function (oEvent) {
                var oModel = that.getOwnerComponent().getModel('oData');
                var oTable = that.getView().byId("tab1");
                var sQueryUnique = that.byId("box0").getSelectedKey();
                var sQueryProduct = that.byId("productInput").getValue();
                var atabFilters = [];
                if(sQueryProduct === ""){
                    sap.m.MessageToast.show("Please Select a Confirguable Product");
                }
                else{
                    oModel.read('/TableView', {
                        success: function (aData) {
                            aResults = aData.results
                         var   oCurrentValue = aData.results[0]
                            var oJSONModel = new sap.ui.model.json.JSONModel();
                            oJSONModel.setData({
                                aItems: aData.results
                            })
                            oTable.setModel(oJSONModel)
                            if (sQueryUnique === "All") {
                                if (sQueryUnique === "All") {
                                    atabFilters.push(new Filter("UID_TYPE", FilterOperator.EQ, "P"))
                                    atabFilters.push(new Filter("UID_TYPE", FilterOperator.EQ, "U"))
                                }
                                if (sQueryProduct.length > 0) {
                                    atabFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, sQueryProduct))
                                }
                                that.byId("tab1").getBinding("items").filter(atabFilters);
                            }
                            else {
                                if (sQueryUnique.length > 0) {
                                    for (var i = 0; i < sQueryUnique.length; i++) {
                                        atabFilters.push(new Filter("UID_TYPE", FilterOperator.EQ, sQueryUnique[i]));
                                    }
                                }
                                if (sQueryProduct.length > 0) {
                                    atabFilters.push(new Filter("PRODUCT_ID", FilterOperator.EQ, sQueryProduct));
                                }
                                that.byId("tab1").getBinding("items").filter(atabFilters);
                            }
    
                            that.getView().byId("tab1").getItems()[0].setSelected(true)
                            that.onDetails()
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    })
                }
              
            },
            OnAdd: function () {
                
                if (!that.CreateValuesDialog) {
                    that.CreateValuesDialog = that.loadFragment({
                        name: "salesorder.view.ValueDialog"
                    });
                }
                var oModel = that.getOwnerComponent().getModel('oData');
                // var oInput = new sap.m.Input({
                //     value:'Hello World'
                // });
                // oInput.setBusy(true);
                var TgT = new sap.m.BusyDialog({
                    text : "loading",
                })
                TgT.open()
                oModel.read('/multivalues', {
                    success: function (aData) {
                        TgT.close()
                        aVResults = aData.results
                        var aCreate = [];
                        var aClone  = [];
                        for(var i = 0; i<aVResults.length; i++){
                            var In = aClone.indexOf(aVResults[i].CHARVAL_NUM)
                            if(In === -1){
                                var oAdj ={
                                    CHARVAL_NUM: aVResults[i].CHARVAL_NUM,
                                    child:false,
                                    parent:true,
                                    selection:false,
                                    childrens:[{
                                        description:aVResults[i].CHAR_NUM_VAL_DES,
                                        child:true,
                                        parent:false,
                                        selection:false,
                                    }]
                                }
                                aCreate.push(oAdj);
                                aClone.push(aVResults[i].CHARVAL_NUM)
                            }
                            else{
                                var oHoods = {
                                    description:aVResults[i].CHAR_NUM_VAL_DES,
                                    child:true,
                                    parent:false,
                                    selection:false,
                                }
                                aCreate[In].childrens.push(oHoods)
                            }
                        }
                        // that.byId("table2").setData("Loading");
                        var otreemodel = new sap.ui.model.json.JSONModel();
                        otreemodel.setData({
                            aItems: aCreate       
                        });
                        var Treetable = that.getView().byId("table2");
                        Treetable.setModel(otreemodel)
                        Treetable.expandToLevel(1);
                        that.byId("table2").setModel(otreemodel)
                        for (var j = 0; j < that.byId("table2").oModels.undefined.oData.aItems.length; j++) {
                            for (var i = 0; i < sap.ui.getCore().byId("tab3").getItems().length; i++) {
                                for(var k = 0; k< that.byId("table2").oModels.undefined.oData.aItems[j].childrens.length; k++){
                                    if (that.byId("table2").oModels.undefined.oData.aItems[j].childrens[k].description ===sap.ui.getCore().byId("tab3").getModel().oData.items[i].description) {
                                        that.byId("table2").getModel().oData.aItems[j].childrens[k].selection = true
                                    }   
                                }
                            }
                        }
                    //  that.getView().byId("table2").setModel(otreemodel);
                        //  sap.ui.getCore().byId("table").setModel(Createmodel)
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
                that.CreateValuesDialog.then(function (CharaDialog) {
                    CharaDialog.open();
                });
            },
            Radiobtn:function(oEvent){
                var oBindingContext = oEvent.getSource().getBindingContext();
                var sChildren = oEvent.getSource().getText()
                var oModel = oBindingContext.getModel();
                var a = that.getOwnerComponent().getModel("oMulti").getProperty("/")
                var sPath = oBindingContext.getPath();
                var oItem = oModel.getProperty(sPath);
                oItem.isSelected = true;
                var i = sPath;
                var K = i.split("/children")
                var L = oModel.getObject(K[0])
                var H = L.childrens
                var M = L.Selection  = false
                // for(var t = 0; )
                for(var j = 0; j<H.length; j++){
                        if(H[j].des !== sChildren){
                            H[j].selection = false
                            // H[j].isSelected = false
                        }
                }
            },
            onClose: function (oEvent) {
                that.CreateValuesDialog.then(function (CharaDialog) {
                    CharaDialog.close();
                });
            },
            OnSub: function () {
                /////Need
                if (!that.copyDialog) {
                    that.copyDialog = sap.ui.xmlfragment("salesorder.view.CoValDialog", that);
                }
                var oModel = that.getOwnerComponent().getModel('oData');
                var res;
                oModel.read('/multivalues', {
                    success: function (aData) {
                        var SubResults = aData.results;
                        Array1 = [];
                        var dArray = [];
                        for (let i = 0; i < SubResults.length; i++) {
                           var  index =dArray.indexOf(SubResults[i].CHARVAL_NUM);
                           if(index === -1){
                            var obj1 = {
                                CHARVAL_NUM: SubResults[i].CHARVAL_NUM,
                                child:false,
                                parent:true,
                                Selection:false,
                                children:[{
                                    des:SubResults[i].CHAR_NUM_VAL_DES,
                                    child:true,
                                    parent:false,
                                    Selection:false,
                                }]
                            }
                            dArray.push(SubResults[i].CHARVAL_NUM)
                            Array1.push(obj1)
                           } 
                           else{
                                var oChd = {
                                    des:SubResults[i].CHAR_NUM_VAL_DES,
                                    child:true,
                                    parent:false,
                                    Selection:false, 
                                }
                                Array1[index].children.push(oChd) 
                            }
                           }
                           var otreemodel = that.getOwnerComponent().getModel("oMulti");
                           otreemodel.setData({
                               res: Array1
                           });
                            sap.ui.getCore().byId("tab6").setModel(otreemodel).expandToLevel(1)
                           
                        for (var i = 0; i < sap.ui.getCore().byId("tab6").getModel().oData.res.length; i++) {
                            for (var j = 0; j < that.byId("tab5").getModel().oData.citems.length; j++) {
                                for(var k = 0; k< sap.ui.getCore().byId("tab6").getModel().oData.res[i].children.length; k++){
                                    if(sap.ui.getCore().byId("tab6").getModel().oData.res[i].children[k].des === that.byId("tab5").getModel().oData.citems[j].CHAR_NUM_VAL_DES){
                                        sap.ui.getCore().byId("tab6").getModel().oData.res[i].children[k].Selection = true
                                    }   
                                }
                            }
                        }
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
                that.copyDialog.open();
            },
            OnSelectCheckBox:function(oEvent){
                var oSelect =that.getOwnerComponent().getModel("oMulti").getProperty("/").res
                for(var i = 0; i<oSelect.length; i++){
                    if(oSelect[i].Selection === true ){
                        for(var t = 0; t<oSelect[i].children.length; t++){
                            if(oSelect[i].children[t].Selection === true){
                                oSelect[i].children[t].Selection = false
                            }
                        }
                    }
                }
            },
            onSelectRadioButton: function(oEvent) {
                var oBindingContext = oEvent.getSource().getBindingContext();
                var sChildren = oEvent.getSource().getText()
                var oModel = oBindingContext.getModel();
                var a = that.getOwnerComponent().getModel("oMulti").getProperty("/")
                var sPath = oBindingContext.getPath();
                var oItem = oModel.getProperty(sPath);
                oItem.isSelected = true;
                var i = sPath;
                var K = i.split("/children")
                var L = oModel.getObject(K[0])
                var H = L.children
                // var M = L.Selection  = false
                // for(var t = 0; )
                for(var j = 0; j<H.length; j++){
                        if(H[j].des !== sChildren){
                            H[j].Selection = false
                            // H[j].isSelected = false
                        }
                }
              },
            GetClose: function () {
                that.copyDialog.close();
            },
            onSelect: function (oEvent) {
                // if(that.byId("CreateB").getText() === "Select"){
                    var aTst = [];
                    var aCTree = that.byId("table2").getModel().getData().aItems
                    for(var i = 0; i< aCTree.length; i++){
                        for(var j=0; j< aCTree[i].childrens.length; j++){
                            if(aCTree[i].childrens[j].selection === true){
                                aTst.push({
                                    CHARVAL_NUM:aCTree[i].CHARVAL_NUM,
                                    description:aCTree[i].childrens[j].description
                                })
                            }
                        }}
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oJSONModel.setData({
                    items: aTst
                })
                sap.ui.getCore().byId("tab3").setModel(oJSONModel);
                that.onClose()
            },
            onValSelect: function (oEvent) {
                var cArray = [];
                var aCkdbutton = sap.ui.getCore().byId("tab6").getModel().getData().res
                for(var i = 0; i<aCkdbutton.length; i++ ){
                    if(aCkdbutton[i].Selection === true){
                        for(var j = 0; j<aCkdbutton[i].children.length; j++ ){
                            cArray.push({
                              CHARVAL_NUM:aCkdbutton[i].CHARVAL_NUM ,
                              CHAR_NUM_VAL_DES: aCkdbutton[i].children[j].des
                            })
                        }
                    }
                    else{
                        if(aCkdbutton[i].Selection === false){
                            for(var k = 0; k<aCkdbutton[i].children.length; k++){
                                if(aCkdbutton[i].children[k].Selection === true )
                                cArray.push({
                                    CHARVAL_NUM:aCkdbutton[i].CHARVAL_NUM,
                                    CHAR_NUM_VAL_DES:aCkdbutton[i].children[k].des
                                })
                            }
                        }
                    }
                }
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oJSONModel.setData({
                    citems: cArray
                })
                that.byId("tab5").setModel(oJSONModel)
                that.copyDialog.close()
            },
            OnSave: function (oEvent) {
                that.creationSave();
                var aResss = aResu
                var iCount = sap.ui.getCore().byId("ID").getValue();
                var sPartner = sap.ui.getCore().byId("box1").getSelectedKey()
                var sBpCountry = sap.ui.getCore().byId("act").getValue();
                var sDescription = sap.ui.getCore().byId("Descr").getValue();
                var aCreateArray = [];
                for (var i = 0; i < sap.ui.getCore().byId("tab3").getItems().length; i++) {
                    var aC = sap.ui.getCore().byId("tab3").getItems()[i].getBindingContext().getProperty("/")
                    aCreateArray.push(aC.items[i])
                }
                if(sap.ui.getCore().byId("tab3").getItems().length === 0){
                    sap.m.MessageToast.show("Select a Characterstic values")
                    return false;
                }
                else{
                var sChar = aCreateArray[0].CHARVAL_NUM;
                var iNum = aCreateArray[0].description;
                var sCharNum = aCreateArray[0].CHAR_NUM;
                var sCharNumVal = aCreateArray[0].CHAR_NUM_VAL
                var obj = {
                    ID: aResss.length + 1,
                    // ID:aResults.length + 1,
                    PRODUCT_ID: iCount,
                    UID_TYPE: sPartner,
                    ACTIVE: Boolean(sBpCountry),
                    UNIQUE_DES: sDescription,
                    CHARVAL_NUM: sChar,
                    CHAR_NUM_VAL_DES: iNum,
                    CHAR_NUM: sCharNum,
                    CHAR_NUM_VAL: sCharNumVal
                }
                var oModel = that.getOwnerComponent().getModel("oData");
                oModel.callFunction("/validation", {
                    method: "GET",
                    urlParameters: {
                        flag: "C",
                        Obj: JSON.stringify(obj),
                        Obj2: JSON.stringify(aCreateArray)
                    },
                    success: function (oData, _response) {
                        var message = _response.data.validation.message;
                        sap.m.MessageToast.show(message);
                        that.newCreateDialog.close()
                        that.onAfterRendering();
                        that.onGo();
                        that.onClear1();
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(e);
                    }
                })
            }
            },
            aSecondTable: function () {
                var oModel = that.getOwnerComponent().getModel('oData');
                oModel.read('/itemview', {
                    success: function (aData) {
                        aDupliactes = aData.results
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            },
            aCharValues: function () {
                var oModel = that.getOwnerComponent().getModel('oData');
                oModel.read('/Values', {
                    success: function (data) {
                        aSomevalues = data.results
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            },
          
            onDetails: function (oEvent) {
                var MultTable = [];
                var aArray = []
                var aData = [];
                var aCharNum = [];
                var FirstTable = aResults
                that.aSecondTable()
                var SecondTable = aDupliactes
                that.aCharValues();
                var ThirdTable = aSomevalues
                that.aMultiColurs();
                var FourthTable = aArray2
                if (oEvent) {
                    oCurrentObj = oEvent.getSource().getSelectedItem().getBindingContext().getObject()
                    var oGblModel = that.getOwnerComponent().getModel("GLOBAL")
                        oGblModel.setData({
                            oCurrentObj
                        })
                    that.getView().byId("tab1").getItems()[0].setSelected(false);
                }
                else {
                    var oTab1 = that.getView().byId("tab1");
                    var aItems = oTab1.getItems();
                    if (aItems.length > 0) {
                        oTab1.setSelectedItem(aItems[0], true);
                        // oTab1.setSelectedItem.fire(press)
                        var oSelectedItem = oTab1.getSelectedItem();
                        if (!oSelectedItem) {
                            oSelectedItem = aItems[0];
                        }
                        oCurrentObj = oSelectedItem.getBindingContext().getObject();
                        var oGblModel = that.getOwnerComponent().getModel("GLOBAL")
                        oGblModel.setData({
                            oCurrentObj
                        })
                        for(let  i = 0 ; i<aArray2.length; i++){
                            if(aArray2[i].CHARVAL_NUM === oCurrentObj.CHARVAL_NUM){
                            for(let k = 0; k<aArray2[i].children.length; k++){
                                    aArray.push({
                                        CHARVAL_NUM:  aArray2[i].CHARVAL_NUM,
                                        CHAR_NUM_VAL_DES:aArray2[i].children[k].des
                                    })
                                }
                            }
                        }
                        var oFCL = this.oView.getParent().getParent();
                        oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
                        var oSharedModel = that.getOwnerComponent().getModel("oShareModel");
                        oSharedModel.setData({
                            items: aArray
                        });
                        sap.ui.controller("salesorder.controller.Details").getDetail();
                    }
                }
                var flag = false
                for (let i = 0; i < aDupliactes.length; i++) {
                    if(oCurrentObj.ID > 50){
                        if(oCurrentObj.ID === aDupliactes[i].ID ){
                            aData.push({
                                CHARVAL_NUM:aDupliactes[i].CHAR_NUM,
                                CHAR_NUM_VAL_DES:aDupliactes[i].CHAR_NUM_VAL
                            })
                        }
                    }
                    else{
                        for(var j= 0; j < aArray2.length;j++){
                            if (oCurrentObj.CHARVAL_NUM === aArray2[j].CHARVAL_NUM) {
                                for(var k = 0; k<aArray2[j].children.length; k++){
                                    aData.push({
                                        CHARVAL_NUM: aArray2[j].CHARVAL_NUM,
                                        CHAR_NUM_VAL_DES:aArray2[j].children[k].des
                                    })
                                }
                                flag = true
                                break;
                            }
                        }  
                    }  
                    if(flag){
                        break;
                    }
                }
                var oSharedModel = that.getOwnerComponent().getModel("oShareModel");
                oSharedModel.setData({
                    items: aData
                });
                sap.ui.controller("salesorder.controller.Details").getDetail();
                that.onAfterRendering()
            },
            aMultiColurs: function(){
                var aModel = that.getOwnerComponent().getModel('oData');
                aModel.read('/multivalues',  {
                    success:function(adata){
                         aLastAdded = adata.results
                          aArray2 = [];
                         var adupliArray = [];
                         for (let i = 0; i < aLastAdded.length; i++) {
                            var  index =adupliArray.indexOf(aLastAdded[i].CHARVAL_NUM);
                            if(index === -1){
                             var obj1 = {
                                 CHARVAL_NUM: aLastAdded[i].CHARVAL_NUM,
                                 child:false,
                                 parent:true,
                                 Selection:false,
                                 children:[{
                                     des:aLastAdded[i].CHAR_NUM_VAL_DES,
                                     child:true,
                                     parent:false,
                                     Selection:false,
                                 }]
                             }
                             adupliArray.push(aLastAdded[i].CHARVAL_NUM)
                             aArray2.push(obj1)
                            } 
                            else{
                                 var oChd = {
                                     des:aLastAdded[i].CHAR_NUM_VAL_DES,
                                     child:true,
                                     parent:false,
                                     Selection:false, 
                                 }
                                 aArray2[index].children.push(oChd) 
                             }
                            }
                    },
                    error:function(error){
                        console.log(error)
                    }
                })
            },
            SaveCopy12: function (oEvent) {
                var aSelectedItems = that.byId("tab2").getSelectedItems()
                aSelectedArray;
                for (var i = 0; i < aSelectedItems.length; i++) {
                    var oSelectedItem = aSelectedItems[i].getBindingContext().getObject()
                    aSelectedArray.push(oSelectedItem)
                }
                var oJSONModel = new sap.ui.model.json.oJSONModel();
                oJSONModel.setData({
                    items: aSelectedArray
                })
                that.byId("tab5").setModel(oJSONModel)
                that.CopyDialog.close()
            },
            onSaveCopy: function () {
                var iCount = that.byId("cID").getValue();
                var sPartner = that.byId("cUtype").getValue();
                var sBpCountry = that.byId("cAct").getValue();
                var sDescription = that.byId("cDescr").getValue();
                var aCopyArray = []
                for (var i = 0; i < that.byId("tab5").getItems().length; i++) {
                    var aP = that.byId("tab5").getItems()[i].getBindingContext().getProperty("/")
                    aCopyArray.push(aP.citems[i])
                }
                if(that.byId("tab5").getItems().length === 0){
                    sap.m.MessageToast.show("Select a Characterstic values")
                    return false;
                }
                else{
                var sChar = aCopyArray[0].CHARVAL_NUM;
                var iNum = aCopyArray[0].CHAR_NUM_VAL_DES;
                // var sCharNum = aCopyArray[0].CHAR_NUM;
                // var sCharNumVal = aCopyArray[0].CHAR_NUM_VAL
                var obj = {
                    ID: aResults.length + 1,
                    PRODUCT_ID: iCount,
                    UID_TYPE: sPartner,
                    ACTIVE: Boolean(sBpCountry),
                    UNIQUE_DES: sDescription,
                    CHARVAL_NUM: sChar,
                    CHAR_NUM_VAL_DES: iNum,
                    // CHAR_NUM: sCharNum,
                    // CHAR_NUM_VAL: sCharNumVal
                }
                var oModel = that.getOwnerComponent().getModel("oData");
                oModel.callFunction("/validation", {
                    method: "GET",
                    urlParameters: {
                        flag: "U",
                        Obj: JSON.stringify(obj),
                        Obj2: JSON.stringify(aCopyArray)
                    },
                    success: function (oData, _response) {
                        var message = _response.data.validation.message;
                        sap.m.MessageToast.show(message);
                        that.CLOSE()
                        that.onAfterRendering();
                        that.onGo()
                        that.onClear()
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(e);
                    }
                })
            }
            },
            onDelete: function (oEvent) {
                var oSelectedItem = oEvent.getSource().getParent();
                var oTable = oSelectedItem.getParent();
                var oModel = oTable.getModel();
                var aData = oModel.getProperty("/");
                var d = aData.items;
                var iIndex = oTable.indexOfItem(oSelectedItem);
                if (iIndex !== -1) {
                    d.splice(iIndex, 1);
                    oModel.setProperty("/", aData);
                    oModel.refresh();
}
              },
              onRemove: function (oEvent) {
                var oSelectedItem = oEvent.getSource().getParent();
                var oTable = oSelectedItem.getParent();
                var oModel = oTable.getModel();
                var aData = oModel.getProperty("/");
                var R = aData.citems;
                var iIndex = oTable.indexOfItem(oSelectedItem);
                if (iIndex !== -1) {
                    R.splice(iIndex, 1);
                    oModel.setProperty("/", aData);
                    oModel.refresh();
            }
        },
            onChangeBolean: function (oEvent) {
                var oSwitchSelected;
                // oSwitchSelected = that.byId("tab1").getSelectedItem().getBindingContext().getObject()
                oSwitchSelected = oEvent.getSource().getBindingContext().getObject()
                var oActive = oSwitchSelected
                var obj = {
                    ID: oActive.ID,
                    ACTIVE: oActive.ACTIVE
                }
                var oModel = that.getOwnerComponent().getModel("oData");
                oModel.callFunction("/Validator", {
                    method: "GET",
                    urlParameters: {
                        flag: "E",
                        Obj: JSON.stringify(obj)
                    },
                    success: function (oData, _response) {
                        var message = _response.data.Validator.message;
                        sap.m.MessageToast.show(message);
                        that.onAfterRendering();
                    },
                    error: function (e) {
                        sap.m.MessageToast.show(e);
                    }
                })
            },
            onSearch: function (oEvent) {
                var aTFilter = []
               var stnlist = that.getView().byId("tab1")
               var oItemBind = stnlist.getBinding("items")
               var sValue = oEvent.getSource().getValue().trim();
               var sValue1 = that.byId("productInput").getValue();
               var sValue2 = that.byId("box0").getValue();
               if (sValue2 === "All") {
                aTFilter.push(new Filter("UID_TYPE", FilterOperator.EQ, "P"))
                aTFilter.push(new Filter("UID_TYPE", FilterOperator.EQ, "U"))
            }
            //    var sValue3 = that.byId("UnitDes").getValue();
            //    var NewFilter =   new sap.ui.model.Filter("UNIQUE_DES", sap.ui.model.FilterOperator.Contains, sValue)
            var nwFilter = new Filter({
                filters:[
                    new Filter("ID", FilterOperator.EQ, sValue),
                    new Filter("UNIQUE_DES", FilterOperator.Contains, sValue),
                ],
                and:false
            })
            //    var Nw3 = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ,sValue);
               var Nw1 = new sap.ui.model.Filter("UID_TYPE", sap.ui.model.FilterOperator.Contains, sValue2);
               var Nw2 = new sap.ui.model.Filter("PRODUCT_ID", sap.ui.model.FilterOperator.Contains,sValue1);
               
               aTFilter.push(nwFilter,Nw1,Nw2)
               oItemBind.filter(aTFilter)

            },
            onSearching: function(oEvent) {
                // var sQuery = oEvent.getSource().getValue().trim();
                // var oTreeTable = that.byId("table2").getModel().oData.aItems;
                // var aFilter = [];
                // if(sQuery){
                //     const evens = oTreeTable.filter(item => item.CHARVAL_NUM === sQuery);
                //     aFilter.push(evens)
                //     console.log(evens); 
                //     var oJSONModel = new sap.ui.model.json.JSONModel();
                //     oJSONModel.setData({
                //         aItems: [aFilter]
                //     })
                //     that.byId("table2").setModel(oJSONModel)
                // }
                var aFilter = [];
                var sQuery = oEvent.getSource().getValue().trim();
                if (sQuery) {
                    var oTreetable = that.byId("table2");
                    var oBinding = oTreetable.getBinding("rows");
                    if(oBinding){
                        var oFilter = new Filter({
                            filters:[
                                new Filter("CHARVAL_NUM" , FilterOperator.Contains, sQuery),
                                new Filter("description", FilterOperator.Contains, sQuery),
                            ],
                            and:false
                        });
                        aFilter.push(oFilter);
                        oBinding.filter(aFilter)
                    }
                }else{
                    if(sQuery === ""){
                        that.byId("table2").getBinding("rows").filter([])
                    }
                }
            },
           
            onSearchingforCopy:function(oEvent){
                var aFilter = [];
                var sQuery = oEvent.getSource().getValue().trim();
                if (sQuery) {
                    var oTreetable = sap.ui.getCore().byId("tab6");
                    var oBinding = oTreetable.getBinding("rows")
                    if(oBinding){
                        var oFilter = new Filter({
                            filters:[
                                new Filter("CHARVAL_NUM", FilterOperator.Contains, sQuery),
                                new Filter("des", FilterOperator.Contains, sQuery),
                            ],
                            and:false
                        });
                        aFilter.push(oFilter);
                        oBinding.filter(aFilter)
                        // oTreeTable.expandToLevel(1)
                    }
                }else{
                    sap.ui.getCore().byId("tab6").getBinding("rows").filter([])
                }
            },
            onClear:function(){
                    that.byId("cDescr").setValue("");
                    that.byId("tab5").setModel(null)  
            },
            onClear1:function(){
                sap.ui.getCore().byId("Descr").setValue("");
                var nModel = new sap.ui.model.json.JSONModel();
                sap.ui.getCore().byId("tab3").setModel(nModel);
            },
            creationSave:function(){
            var oModel = that.getOwnerComponent().getModel("oData");
            oModel.read('/TableView', {
                success: function (aData) {
                     aResu = aData.results
            },
            error:function(error){
                console.log(error)
            }
        })
    }
        });
    });
    // var tableId = that.byId("tab1");
                // var sQuery = oEvent.getSource().getValue();
                // var sQuery1 = that.byId("box0").getValue();
                // var oBinding = tableId.getBinding("items");
                // var aFilters = oBinding.aFilters.slice()
                // if (sQuery && sQuery.length > 0 ) {
                //     var filter = new Filter("UNIQUE_DES", FilterOperator.EQ, sQuery);
                //     var filter1 = new Filter("UID_TYPE", FilterOperator.EQ, sQuery1)
                //                         aFilters.push(filter,filter1);
                //                         and:false
                // }
                // else {
                //     if(sQuery.length === 0 ){
                //         var oJSONModel = new sap.ui.model.json.JSONModel([]);
                //         that.byId("tab1").setModel(oJSONModel);
                //     }
                // }
                // oBinding.filter(aFilters)
                
            //    var finalFilter = new sap.ui.model.Filter({

            //     filters: aTFilter,

            //     and: falseonA

            // });

            // oItemBind.filter(finalFilter);
                // build filter array
                // var aFilter = [];
                // var sQuery = oEvent.getParameter("query");
                // if (sQuery) {
                //     aFilter.push(new Filter("UNIQUE_DES", FilterOperator.Contains,sQuery));
                // }
                //           
                // var oList = that.getView().byId("tab1");
                // var oBinding = oList.getBinding("items");
                // oBinding.filter(aFilter);
                // var tableId = that.byId("Details");
                // var sQuery = oEvent.getSource().getValue();
                // var oBinding = tableId.getBinding("items");
                // var aFilters = []
                // if (sQuery && sQuery.length > 0) {
                //     var filter = new sap.ui.model.Filter("CHARVAL_NUM", sap.ui.model.FilterOperator.Contains, sQuery);
                //     aFilters.push(filter);
                // }
                // oBinding.filter(aFilters);
                // onTreeChange: function(event) {
                //     if (event.getParameter("reason") == "filter") {
                //       const model = this.getOwnerComponent().getModel("search");
                //       const query = model.getProperty("/query");
                //       this.byId("myTree").expandToLevel(query ? 99 : 0);
                //     }
                //   },

               