sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/ui/core/date/UI5Date",
    'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Fragment,Filter,FilterOperator,MessageToast,UI5Date,Spreadsheet) {
        "use strict";
        var that
        var len;
        var aResult;
        var Orders;
        var Og ;
       
        // var DQ = []
        var   aResults;
        return Controller.extend("seedorder.controller.View1", {
            onInit: function () {
                that = this;
                // that.seedTable();
                // that.onGo();  
                that.Trigger();
                // var oTable = that.byId("Frg");
                var oModel  = that.getOwnerComponent().getModel('oData');
                oModel.read('/SeedOrders',{
                    success: function(aData){
                        aResults = aData.results
                      }
                    })
                },
            onValueHelpRequest: function (oEvent) {
                if (!this.newDetailsDialog) {
                    this.newDetailsDialog = sap.ui.xmlfragment("seedorder.view.ValueHelp", this);
                }
                this.newDetailsDialog.open();
                var oModel = that.getOwnerComponent().getModel('oData');
                oModel.read('/pView', {
                    success: function (aData) {
                        var aResult = aData.results
                        var oJSONModel = new sap.ui.model.json.JSONModel();
                        oJSONModel.setData({
                            aItems: aResult
                        })
                        sap.ui.getCore().byId("selectDialog").setModel(oJSONModel);
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            },
            onValueHelpDialogSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("PRODUCT_ID", FilterOperator.Contains, sValue);
                oEvent.getSource().getBinding("items").filter([oFilter]);
            },
            onValueHelpDialogClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }
                this.byId("productInput").setValue(oSelectedItem.getTitle());
                that.byId("productInput1").setValue("");
            },
            onValueHelpRequestForID:function(){
                if(that.byId("productInput").getValue() === "" ){
                    sap.m.MessageToast.show("Please Select a Confirguable Product")
                }
                else{
                    if (!this.IDDetailsDialog) {
                        this.IDDetailsDialog = sap.ui.xmlfragment("seedorder.view.ValueID", this);
                    }
                    this.IDDetailsDialog.open();
                    var oModel = that.getOwnerComponent().getModel('oData');
                    var TFilter = []
                    var oTree = sap.ui.getCore().byId("selectDialog1")
                    oModel.read('/TableView', {
                        success: function (aData) {
                             aResult = aData.results
                            var sValue1 = that.byId("productInput").getValue();
                            for(var i = 0; i< aResult.length; i++){
                                if(aResult[i].PRODUCT_ID === sValue1){
                                    TFilter.push({
                                        ID:aResult[i].ID
                                    })
                                }
                            }
                             var aModel = new sap.ui.model.json.JSONModel();
                             aModel.setData({
                                 Items: TFilter
                             })
                             oTree.setModel(aModel)
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    })
                }
            },                                              
            onValueHelpDialogSearchForID: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                if(sValue.length >0){
                    var oFilter = new Filter("ID", FilterOperator.EQ, sValue);
                    oEvent.getSource().getBinding("items").filter([oFilter]);
                   
                }
                else{
                    // that.byId("selectDialog1").getBinding("rows").filter([])
                    oEvent.getSource().getBinding("items").filter([]);
                }
               
            },
            onValueHelpDialogCloseForID: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (!oSelectedItem) {
                    return;
                }
                this.byId("productInput1").setValue(oSelectedItem.getTitle());
            },
            onGo:function(){
                var P1 = that.byId("productInput").getValue();
                var P2 = that.byId("productInput1").getValue();
                if((P1.length === 0 ) || (P2.length === 0)  ){
                    sap.m.MessageToast.show("Please Select a Unique_ID ");
                }
                var Tst =[]
                var oModel = that.getOwnerComponent().getModel('oData');
                oModel.read('/SeedOrders', {
                    success: function (aData) {
                         Orders = aData.results
                        //  that.handleChange();
                        var tree = that.byId("tab1")
                        var dateId1 = that.byId("DRS1").getDateValue()
                        var DateId2 = that.byId("DRS1").getSecondDateValue()
                        
                        var dArray = []
                        var cDArray = []
                        while(DateId2>dateId1){
                            var newd1=new Date(dateId1.setDate(dateId1.getDate()+1)).toLocaleDateString();
                            dArray.push(newd1);
                        }
                        dArray.pop()
                         if(P1.length && P2.length > 0 && dateId1 === null ){
                            for(var j = 0; j<Orders.length; j++){
                                if(Orders[j].PRODUCt === P1  && Orders[j].UNIQUE_ID === P2){
                                    cDArray.push({
                                        ID:Orders[j].ID,
                                        UNIQUE_ID:Orders[j].UNIQUE_ID,
                                        QUANTITY:Orders[j].QUANTITY,
                                        DATE:Orders[j].DATE
                                    })
                                }
                            }
                        }else{
                            dateId1.setDate(dateId1.getDate()- dArray.length)
                            for(var j = 0; j<Orders.length; j++){
                                for(var i = 0; i<dArray.length; i++){
                                    if(Orders[j].CREATED_DATE === dArray[i] && Orders[j].PRODUCt === P1 && Orders[j].UNIQUE_ID === P2){
                                        cDArray.push(Orders[j])
                                    }
                                }
                            }
                        }
                        if(cDArray.length === 0){
                            that.byId("tab1").setVisible(false)
                            sap.m.MessageToast.show("No Data in These Dates");
                        }
                        else{
                            that.byId("tab1").setVisible(true)
                            var nModel = new sap.ui.model.json.JSONModel()
                            nModel.setData({
                                aItems:cDArray
                            })
                            tree.setModel(nModel)
                        }   
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            },
            CreateOrder:function(){
                if(that.byId("productInput").getValue().length <=0  ){
                    sap.m.MessageToast.show("Please Select Valid Requires")
                }
                else if (that.byId("productInput1").getValue().length === 0){
                    sap.m.MessageToast.show("Please Select Valid Requires")
                }
                else{
                    if (!that.newCreateDialog) {
                        that.newCreateDialog = sap.ui.xmlfragment("seedorder.view.CreateOrder", that);
                    }
                    var Product_id = that.byId("productInput").getValue()
                    sap.ui.getCore().byId("Product").setValue(Product_id);
    
                    var Unique_Id = that.byId("productInput1").getValue()
                    sap.ui.getCore().byId("Unique_Id").setValue(Unique_Id)
                    that.newCreateDialog.open();
                }
      
            },
            onReject:function(){
                that.newCreateDialog.close()
                    that.clear();
            },
            clear:function(){
                sap.ui.getCore().byId("Quant").setValue("");
                sap.ui.getCore().byId("DP1").setValue("");
            },
            CreateSeedOrder:function(){
                // that.seedTable();
                len
                var oModel  = that.getOwnerComponent().getModel('oData');
                oModel.read('/SeedOrders', {
                    success: function(aData){
                      var   aResults = aData.results
                        len = aResults.length
                var Prod = sap.ui.getCore().byId("Product").getValue()
                // var UnDes =that.byId("Descr").getValue()
                var Uniq_Id = sap.ui.getCore().byId("Unique_Id").getValue()
                var Quant = sap.ui.getCore().byId("Quant").getValue()
                var sDate = sap.ui.getCore().byId("DP1").getDateValue().toLocaleDateString();
                
                // for(var i =0; i<aResults.length; i++){
                    // if(aResults[i].PRODUCt === Prod && aResults[i].UNIQUE_ID === Uniq_Id && aResults[i].DATE === sDate ){
                    //     sap.m.MessageToast.show("MATERIAL DATE IS ALREADY EXITS CHANGE WITH OTHER DATE")
                    // }
                    // else{
                        var oSeed = {
                            ID:"SE00" +  parseInt(len + 1),
                            PRODUCT:Prod,
                            UNIQUE_ID:Uniq_Id,
                            // DESCRIPTION:UnDes,
                            QUANTITY: Quant,
                            DATE:sDate,
                        }
                        var isDataExists = aResults.some(function(aResult) {
                            return aResult.PRODUCt === oSeed.PRODUCT && 
                            aResult.UNIQUE_ID === oSeed.UNIQUE_ID && 
                            aResult.DATE === oSeed.DATE;
                        });
                        if (isDataExists) {
                            sap.m.MessageToast.show("Data already exists.");
                            that.onReject()
                        }
                        else{
                            var oModel = that.getOwnerComponent().getModel("oData");
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
                                    that.onGo();
                                    that.clear();
                                },
                                error: function (e) {
                                    sap.m.MessageToast.show(e);
                                }
                            })
                        }
                 
                        
                    // }
                // }
           
                },
                    error: function (error){
                        console.log(error)  
                    }
                })
            },
            onClick:function(){
                that.byId("productInput").setValue("");
                that.byId("productInput1").setValue("");
                that.byId("DRS1").setValue("");
                that.byId("S1").setValue("");
                var aModel = new sap.ui.model.json.JSONModel();
                that.byId("tab1").setModel(aModel)
            },
 
            onSearch:function(oEvent){
                var aFilter = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery) {
                    var oTreetable = that.getView().byId("tab1");
                    var oBinding = oTreetable.getBinding("items");
                    if(oBinding){
                        var oFilter = new Filter({
                            filters:[
                                new Filter("UNIQUE_ID" , FilterOperator.Contains, sQuery),
                                new Filter("ID", FilterOperator.Contains, sQuery),
                            ],
                            and:false
                        });
                        aFilter.push(oFilter);
                        oBinding.filter(aFilter)
                    }
                }
                else{
                    if(sQuery === ""){
                        that.getView().byId("tab1").getBinding("items").filter([])
                    }
                }
               },
           DownLoad:function(){
            if (!that.DownLoadDialog) {
                that.DownLoadDialog = that.loadFragment({
                    name: "seedorder.view.Download"
                });
            }
        //     if (!that.DownLoadDialog) {
        //         that.DownLoadDialog = sap.ui.xmlfragment("seedorder.view.Download", that);
        //     }
        //     that.DownLoadDialog.open();
        that.DownLoadDialog.then(function(DownloadDialog) {
            DownloadDialog.open();
        });
           },
           Cancel:function(){
            that.DownLoadDialog.then(function(DownloadDialog){
                DownloadDialog.close()
            })
           },
           onDownLoad:function(){
            var afrm1 = []
            var afrm2 = []
            var dateId1 = that.byId("DRS3").getDateValue()
            var DateId2 = that.byId("DRS3").getSecondDateValue()
            var Prod = that.byId("productInput").getValue()
            if(Prod === "" || Prod.length > 0){
                afrm1.push("PRODUCT_ID")
            }
            var Uniq_Id = that.byId("productInput1").getValue()
            if(Uniq_Id === "" || Uniq_Id.length > 0){
                afrm1.push("UNIQUE_ID")
            }
            if(dateId1.toDateString().split(" ")[0] === "Mon"){
                afrm1.push(dateId1.toLocaleDateString())  
            }  
            while(DateId2>dateId1){
                var newd1=new Date(dateId1.setDate(dateId1.getDate()+1))
                afrm2.push(newd1);
            }
            afrm2.pop();
            // dateId1.setDate(dateId1.getDate()- dArray.length);
            for(var i = 0; i< afrm2.length; i++){
                if(afrm2[i].toDateString().split(" ")[0] === "Mon"  ){
                    afrm1.push(afrm2[i].toLocaleDateString())
                }
            }

            ///setting weekend Monday if selected date not in  Mon Range 
            if(DateId2.toDateString().split(" ")[0] === "Tue"){
                var a= new Date(DateId2.setDate(DateId2.getDate()+6))
                afrm1.push(a.toLocaleDateString())
            }
            else if(DateId2.toDateString().split(" ")[0] === "Wed"){
               var a= new Date(DateId2.setDate(DateId2.getDate()+5))
               afrm1.push(a.toLocaleDateString())
            }
            else if(DateId2.toDateString().split(" ")[0] === "Thu"){
                var  a= new Date(DateId2.setDate(DateId2.getDate()+4))
                afrm1.push(a.toLocaleDateString())
            }
            else if(DateId2.toDateString().split(" ")[0] === "Fri"){
                var  a= new Date(DateId2.setDate(DateId2.getDate()+3))
                afrm1.push(a.toLocaleDateString())
            }
            else if(DateId2.toDateString().split(" ")[0] === "Sat"){
                var  a= new Date(DateId2.setDate(DateId2.getDate()+2))
                afrm1.push(a.toLocaleDateString())
            }
            else{
                if(DateId2.toDateString().split(" ")[0] === "Sun"){
                    var  a= new Date(DateId2.setDate(DateId2.getDate()+1))
                    afrm1.push(a.toLocaleDateString())
                }
            }
            ///// Download the columns with property 
            var aCols = []
            for(var j=0; j<afrm1.length; j++){
                aCols.push({
                    property:afrm1[j]
                });
            }
            var aData = []
           var  oSettings = {
                        workbook: {
                            columns: aCols
                        },
                        dataSource: aData,
                        fileName: "Example.xlsx",
                        worker: true
                    };
                    var oSheet = new Spreadsheet(oSettings);
                    oSheet.build().finally(function () {
                        oSheet.destroy();
                        that.Cancel()
                    
                    });
           },
           onUpload:function(){
            var fileupload = this.getView().byId("Fileupload");
            var file  = fileupload.oFileUpload.files[0];
            var oExcelData = {}
            that.filename = file.name;
            that.filetype = file.type;
                var reader  = new FileReader();
                reader.onload = function(event){
                    var data = event.target.result;
                    var workbook = XLSX.read(data, {
                        type:"binary"
                    });
                    workbook.SheetNames.forEach(function (sheetName) {
                        
                        oExcelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
                        Og = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], { header: 1 })[0]
                        var oData = oExcelData;
                        that.Emport(oExcelData);
                    });
                   
                };  
                reader.readAsBinaryString(file);
           },
           Emport: function(array){
            var oModel = that.getOwnerComponent().getModel("GLOBAL");
            oModel.setProperty("/", array)
          
            // var vTable = sap.ui.getCore().byId("Frg")
            var cdp =[];
            var aInvalid= [];
            var aValid = [];
            var adp = [];
            var adModel = that.getOwnerComponent().getModel("VALID");
            adModel.setProperty("/a", adp)
            DQ ;
            for (var i = 0; i <array.length; i++) {
                for (var j = 0; j < Og.length; j++) {
                    var key = Og[j];
                    if (!array[i].hasOwnProperty(key)) {
                        array[i][key] = "--";
                    }
                }
            }
            for (var i = 0; i < array.length; i++) {
                var keys = Object.keys(array[i]);
            
                for (var k = 0; k<keys.length; k++) {
                    if(keys[k] == "PRODUCT_ID" || keys[k] == "UNIQUE_ID"){
                    }
                    else{
                        var oldKey = keys[k];
                        var newKey = oldKey.split("/").join("-");
                        if (oldKey !== newKey) {
                            array[i][newKey] = array[i][oldKey];
                            delete array[i][oldKey];
                    }
                    }
                }
            }
            // for (var p = 0; p < array.length; p++) {
            //     var isValid = false; 
            //     for (var k = 0; k < aResult.length; k++) {
            //         if (aResult[k].PRODUCT_ID == array[p].PRODUCT_ID && aResult[k].ID == array[p].UNIQUE_ID)  {
            //             array[p].Status = "Valid";
            //             array[p].Reason = "---";
            //             aInvalid.push(array[p]);
            //             break; 
            //         } 
            //         else if (aResult[k].ID != array[p].UNIQUE_ID && aResult[k].PRODUCT_ID != array[p].PRODUCT_ID ) {
            //             array[p].Status = "InValid";
            //             array[p].Reason = "PRODUCT_ID IS UNDEFINED";
                    
            //             aInvalid.push(array[p]);
            //             // adp.push(array[p].UNIQUE_ID)
            //             break;
            //         }
            //          else {
            //             isValid = true;
            //         }
            //     }

            //     if (isValid) {
            //         array[p].Status = "InValid";
            //         array[p].Reason = "UNIQUE_ID IS UNDEFINED";
            //         // array[p].Status = "Valid";
            //         // array[p].Reason = "---";
            //         // adp.push(array[p].PRODUCT_ID)
            //         aValid.push(array[p]);
            //     }
            // }
            for(var p =0; p<array.length; p++){
                for(var k = 0; k<aResult.length; k++){
                    if(aResult[k].PRODUCT_ID !== array[p].PRODUCT_ID && aResult[k].ID != array[p].UNIQUE_ID   ){
                        array[p].Status = "InValid"
                        array[p].Reason = "PRODUCT_ID IS UNDEFINED"
                        aInvalid.push(array[p])  
                    }
                    else{
                        if(aResult[k].ID != array[p].UNIQUE_ID ){
                            array[p].Status = "InValid"
                            array[p].Reason = "UNIQUE_ID  IS UNDEFINED"
                            aInvalid.push(array[p]) 
                        }
                    }
                }
            }
            var ValidRe = array.filter(function(item1) {
                var isProductIdNotFound = !aResult.some(function(item2) {
                    return item1.PRODUCT_ID == item2.PRODUCT_ID 
                
                });
                return isProductIdNotFound;
            });

            var Qrd = [];
            for(var i = 0; i<ValidRe.length; i++){
                for(var j = 0; j<array.length; j++){
                    if(ValidRe[i] != array[j]){
                        Qrd.push(array[j])
                    }
                    else{
                        adp.push(ValidRe[i].PRODUCT_ID)
                    }
                }
            }
            var Prd = Qrd.filter(function(item1) {
                var isProductIdNotFound = !aResult.some(function(item2) {
                    return item1.PRODUCT_ID === item2.PRODUCT_ID &&
                    item1.UNIQUE_ID == item2.ID
                });
                return isProductIdNotFound;
            });

            for(var j = 0; j<array.length; j++){
                for(var i = 0; i< Prd.length; i++){
                    if(array[j].PRODUCT_ID == Prd[i].PRODUCT_ID && array[j].UNIQUE_ID == Prd[i].UNIQUE_ID){
                        array[j].Reason = "UNIQUE_ID IS UNDEFINED"
                    }
                    adp.push((Prd[i].UNIQUE_ID).split('').join(' '))
                    // adp.push(Prd[i].UNIQUE_ID + " " )
                   
                }
            }
            


            // for(var i = 0; i< ValidRe.length; i++){
            //     adp.push(ValidRe[i].PRODUCT_ID)
            // }
            for(var i =0; i<array.length; i++){
                for(var j = 0; j<aResult.length; j++){
                    if(aResult[j].PRODUCT_ID == array[i].PRODUCT_ID  && aResult[j].ID == array[i].UNIQUE_ID){
                        array[i].Status = "Valid" 
                        array[i].Reason = "---"
                        aValid.push(array[i])   
                    }
                }
            }
                    var L = 0;
                    for(var i =0; i<aInvalid.length; i++){
                        if(aInvalid[i].Status != "Valid"){
                            L+=1
                        }
                    } 
                if(L < 0 ){
                    that.onFragment(adp);
                }
                else{
                    var QuantF = [];  
                    for(var i = 2; i<Og.length ; i++){
                        // var F = true; 
                        for(var j = 0; j< array.length; j++){
                            var v1  = Object.keys(array[j])
                            if(Og.length != v1.length -2 ){
                                array[j].Status = "InValid"
                                array[j].Reason = "Contains NULL"
                                QuantF.push(array[j])
                                adp.push(Object.keys(array[j]))
                                // F = false;
                                // break;
                            }
                            else if(Og.length > 0) {
                                var v2 = Object.values(array[j]).length
                                for(var i = 2; i<v2-2; i++){
                                    if((/^\d+$/.test(Object.values(array[j])[i]) === false)){
                                        array[j].Status = "InValid"
                                        array[j].Reason = "InValid-Quantity"
                                        QuantF.push(array[j])
                                        adp.push(Object.values(array[j])[i])
                                    } 
                                }
                            }
                        }
                    }
            }
            var DQ = [];
            if(array.length > 0){
                for(var i = 0; i<array.length; i++){
                    for(var j = 2; j<Object.keys(array[i]).length; j++){
                        if(/^\d+$/.test(Object.values(array[i])[j]) === true){
                            var oK = Object.keys(array[i])[j].split("-").join("/");
                            var oV = Object.values(array[i])[j]
                            DQ.push({
                                PRODUCT:array[i].PRODUCT_ID,
                                UNIQUE_ID:array[i].UNIQUE_ID,
                                DATE:oK,
                                QUANTITY:parseInt(oV),
                            })
                        }
                        else{
                            j++
                        }
                    }
                }
                var aNew = [];
                if (DQ.length > 0) {
                    for (var i = 0; i < DQ.length; i++) {
                        var isValid = true;
                        for (var j = 0; j < aResults.length; j++) {
                            if (DQ[i].DATE === aResults[j].DATE && DQ[i].PRODUCT === aResults[j].PRODUCt && DQ[i].UNIQUE_ID === aResults[j].UNIQUE_ID) {
                                isValid = false; 
                                break; 
                            }
                        }
                        if (!isValid) {
                            DQ[i].Status = "InValid";
                            DQ[i].Reason = "DUPLICATES";
                            aNew.push(DQ[i]);
                        }
                    }
                }
                // if(aNew.length> 0 || aNew.length < 0){
                    for(var i =0; i<array.length; i++){
                        for(var j = 0; j<aNew.length; j++){
                            if(aNew[j].PRODUCT == array[i].PRODUCT_ID && aNew[j].UNIQUE_ID == array[i].UNIQUE_ID ){
                                array[i].Status = "InValid";
                                array[i].Reason = "DUPLICATES"
                                break;
                            }
                        }
                    }
                    for(var i = 0; i<array.length; i++){
                        array[i].UNIQUE_ID = (array[i].UNIQUE_ID).split('').join(' ');
                    }
                    // var ValidRe = array.filter(function(item1) {
                    //     var isProductIdNotFound = !aResult.some(function(item2) {
                    //         return item1.PRODUCT_ID === item2.PRODUCT_ID;
                    //     });
                    //     return isProductIdNotFound;
                    // });
                    // for(var i = 0; i< ValidRe.length; i++){
                    //     adp.push(ValidRe[i].PRODUCT_ID)
                    // }
                    var C= 0
                    for(var k= 0 ; k<array.length; k++){
                        if(array[k].Status == "InValid"){
                            C+=1
                        }
                    }
                    if(C > 0){
                        that.onFragment()
                        
                    }
                    else{
                        that.CreateSeedOrderwithExcel()
                    }
            }
        },
            Trigger:function(){
                var oModel = that.getOwnerComponent().getModel('oData')
                oModel.read('/TableView', {
                    success: function (aData) {
                         aResult = aData.results
                    },
                    error: function (error) {
                        console.log(error)
                    }
            })
        },
        onFragment:function(array){
            var oModel = that.getOwnerComponent().getModel("GLOBAL");
            oModel.getProperty("/", array)
            var adModel = that.getOwnerComponent().getModel("VALID");
            adModel.getProperty("a/", adp)
            var adp = that.getOwnerComponent().getModel("VALID").oData.a;
            array = that.getOwnerComponent().getModel("GLOBAL").oData
            if (!that.ValidDialog) {
                that.ValidDialog = sap.ui.xmlfragment("seedorder.view.ValidForm", that);
            }
            var oTable = sap.ui.getCore().byId("Frg");
            if(oTable.getColumns()[0]){
                oTable.removeAllColumns()
            }
            var nofcolumn= Object.keys(array[0]).length
            
            for (let i = 0; i < nofcolumn ; i++) {
            var oColumn = new sap.m.Column("col" + Math.random(),   {
               
                header: new sap.m.Label({
                    text: Object.keys(array[0])[i] 
                        })
                        });
                        oTable.addColumn(oColumn);
                        
                    }
                   var oCell = [];
                    for (let i = 0; i <Object.values(array[0]).length ; i++) {
                       
                        var oCell1 =  new sap.m.Text ({
                            
                            
                            text:  "{"  + Object.keys(array[0])[i] + "}" ,
                           
                                      });         
                    oCell.push(oCell1);
                    }
                var aColList = new sap.m.ColumnListItem("aColList" + Math.random(), {
                        cells: oCell
                     });
                oTable.setModel(oModel)
                   oTable.bindItems("/", aColList);  
                  for(var i = 0; i<oTable.getItems().length; i++){
                    for(var j = 0; j< oTable.getItems()[i].getCells().length; j++){
                        if(oTable.getItems()[i].getCells()[j].getText() === "Valid"){
                            oTable.getItems()[i].getCells()[j].addStyleClass("Success")
                      
                        }
                        else{
                            for(var k = 0; k<adp.length; k++){
                                var cellText = oTable.getItems()[i].getCells()[j].getText() 
                                var cell = oTable.getItems()[i].getCells()[j]
                                if( cellText === "InValid"  ){
                                    cell.addStyleClass("Failed")
                                }  
                                else if((cellText) === adp[k]){
                                    cell.addStyleClass("Failed");
                                    cell.removeStyleClass("Success");
                                }
                            // }
                           
                        }
                        }
                    }
                }
                  
                 
                that.ValidDialog.open();
        },
        onOk:function(){
            that.ValidDialog.close()
        },
        onSelect:function(){
            var sQueryUnique = sap.ui.getCore().byId("box0").getSelectedKey();
            var atabFilters = [];
            var adp = that.getOwnerComponent().getModel("VALID").oData.a;
            if (sQueryUnique.length > 0 ) {
                if (sQueryUnique === "All") {
                    atabFilters.push(new Filter("Status", FilterOperator.EQ, "Valid"))
                    atabFilters.push(new Filter("Status", FilterOperator.EQ, "InValid"))
                }
                else if (sQueryUnique === "Valid") {
                    atabFilters.push(new Filter("Status", FilterOperator.EQ, "Valid"))
                }
                else{
                    atabFilters.push(new Filter("Status", FilterOperator.EQ, "InValid"))
                }
                var oTable = sap.ui.getCore().byId("Frg")
                oTable.getBinding("items").filter(atabFilters)
                for (var i = 0; i < oTable.getItems().length; i++) {
                    for (var j = 0; j < oTable.getItems()[i].getCells().length; j++) {
                        var cell = oTable.getItems()[i].getCells()[j];
                        var cellText = cell.getText();
                        var addSuccessStyle = false;
                        var addFailedStyle = false;
        
                        if (cellText === "Valid") {
                            addSuccessStyle = true;
                        } else if (cellText === "InValid") {
                            addFailedStyle = true;
                        }
        
                        if (addSuccessStyle) {
                            cell.addStyleClass("Success");
                            cell.removeStyleClass("Failed");
                        } else {
                            cell.removeStyleClass("Success");
                        }
        
                        if (addFailedStyle) {
                            cell.addStyleClass("Failed");
                        } else {
                            cell.removeStyleClass("Failed");
                        }
        
                        for (var k = 0; k < adp.length; k++) {
                            if((cellText) === adp[k]){
                                    cell.addStyleClass("Failed");
                                    cell.removeStyleClass("Success");
                            }
                           
                          
                        }
                    }
                }
          
                }
        },
        onValueforReason:function(){
            if (!that.ReasFrg) {
                that.ReasFrg = sap.ui.xmlfragment("seedorder.view.Reasons", that);
            }
            var aFil = []
            var sQueryUnique = sap.ui.getCore().byId("box0").getSelectedKey();
            if(sQueryUnique == "Valid"){
                var oModel = new sap.ui.model.json.JSONModel()
                var oTable = sap.ui.getCore().byId("res").setModel(oModel)
            }
            else{
                var aSData = sap.ui.getCore().byId("Frg").getBinding("items").oModel.oData

                for(var i = 0; i< aSData.length; i++){
                    if(aSData[i].Status == "InValid" || sQueryUnique =="All"){
                        aFil.push({
                            Reason:aSData[i].Reason
                        })
                    }
                }
                var oModel = new sap.ui.model.json.JSONModel()
                oModel.setData({
                    Items:aFil
                })
                var oTable = sap.ui.getCore().byId("res").setModel(oModel)
                // var oModel = new sap.ui.model.json.JSONModel()
                // oModel.setData({
                //     aItems:
                // })
            }
            that.ReasFrg.open();
        },
        CreateSeedOrderwithExcel:function(){
            var CD = [];
            // var nID = Orders.length
            var oTable = that.byId("tab1")
            var aCreay = that.getOwnerComponent().getModel("GLOBAL").oData
            var oModel  = that.getOwnerComponent().getModel('oData');
            oModel.read('/SeedOrders', {
                success: function(aData){
                  var   aResults = aData.results
                    var nID = aResults.length
                    var uniqueIds = {};
                    var UOC = aCreay.filter(function(item) {
                        if (!uniqueIds.hasOwnProperty(item.PRODUCT_ID, item.UNIQUE_ID)) {
                            uniqueIds[item.UNIQUE_ID] = true;
                            uniqueIds[item.PRODUCT_ID] = true;
                            return true;
                        }
                        return false;
                    });
                    for(var i = 0; i<UOC.length; i++){
                        for(var j = 2; j<Object.keys(UOC[i]).length; j++){
                            if(/^\d+$/.test(Object.values(UOC[i])[j]) === true){
                                var oK = Object.keys(UOC[i])[j].split("-").join("/");
                                var oV = Object.values(UOC[i])[j]
                                CD.push({
                                    PRODUCT:UOC[i].PRODUCT_ID,
                                    UNIQUE_ID:UOC[i].UNIQUE_ID,
                                    DATE:oK,
                                    QUANTITY:parseInt(oV),
                                })
                            }
                            else{
                                j++
                            }
                        }
                    }
                    for(var k=0 ; k<CD.length; k++){
                        CD[k].ID = "SE00" +  parseInt(nID + 1)
                        nID++
                    }
                    var sModel = new sap.ui.model.json.JSONModel()
                    sModel.setData({
                        aItems:  CD
                    })
                    oTable.setModel(sModel)
                    oModel.callFunction("/Validator", {
                        method : "GET",
                        urlParameters: {
                            flag: "O",
                            Obj : JSON.stringify(CD),
                        },
                        success: function (oData, _response) {
                            var message = _response.data.Validator.message;
                            sap.m.MessageToast.show(message);
                            that.onReject()
                            that.onGo();
                            that.clear();
                        },
                        error: function (e) {
                            sap.m.MessageToast.show(e);
                        }
                    })
                }
                })
                
            }
        });
    });
