sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/PDFViewer",
    "sap/ui/model/json/JSONModel",
    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,PDFViewer,JSONModel) {
        "use strict";
        var that
        var data
        return Controller.extend("uploads.controller.View1", {
            onInit: function () {
                that = this
                that.onAfterRendering()
            },
            onAfterRendering:function(){
                var oModel = that.getOwnerComponent().getModel("Odata");
                var oTable = that.getView().byId("tab1");
                oModel.read('/csvfiles', {
                    success: function(aResults) {
                        if (aResults.results.length > 0 ) {
                            data = aResults.results.length 
                            var oModel = new sap.ui.model.json.JSONModel()
                            oModel.setData({
                                items:aResults.results
                            })
                            oTable.setModel(oModel);                           
                        } else {
                            console.log("No data in model.");
                        }
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });  
            },
            onPdfUpload:function(){
                var fileupload = this.getView().byId("pdfupload");
                // var domref = oFileUpload.getFocusDomRef();
                var file = fileupload.oFileUpload.files[0];
                that.filename = file.name;
                that.filetype = file.type;
                // if(that.filename.split(".")[1] === "png" || "jpg" ){
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        debugger;
                        var Content = e.currentTarget.result;
                                var oObj = {
                                ID: parseInt(data+1),
                                NAME  : that.filename ,
                                URL: Content
                            }
                            var oModel = that.getOwnerComponent().getModel("Odata");
                            oModel.callFunction("/pdfstore", {
                                method : "GET",
                                urlParameters: {
                                    flag: "save",
                                    Obj: JSON.stringify(oObj)
                                },
                                success: function (oData, _response) {
                                    that.onAfterRendering()
                                },
                                error: function (e) {
                                    sap.m.MessageToast.show(e);
                                }
                            })
                        }
                    reader.readAsDataURL(file)
                // }
            },
            showPdf:function(oEvent){
                var sBase = oEvent.getSource().getBindingContext().getObject().URL
                if(sBase.split(",")[0] ==="data:image/png;base64" || sBase.split(",")[0] === "data:image/jpeg;base64"){
                    var image = new sap.m.Image({
                        src: sBase,
                        width: "1300px", 
                        height: "500px" 
                    });
                    if(that.getView().byId("ImgView").getContent().length > 0){
                        that.getView().byId("ImgView").removeAllContent()
                        var page = that.getView().byId("ImgView"); 
                        page.addContent(image);
                    }
                    else{
                        var page = that.getView().byId("ImgView"); 
                        page.addContent(image);  
                    }
                }
                else{

                    
                    // that.getView().byId("ImgView").removeAllContent()
                    // var pdfView = that.getView().byId("pdfviewer");
                    // pdfView.setSource(sBase)

                    var url = that.base64toblob(sBase);
                    window.open(url,"page");
                 
                   //    var  String  = EncodingUtil.base64Encode(url);
                   // var oHtml = this.getView().byId("idFrame");
                    // oHtml.setContent(url);
                   
                    // pdfView.attachEventOnce("afterRendering", function () {
                    //     pdfView.setSource(url);
                    //     pdfView.open();
                    // });
                    }
                },
                base64toblob:function(base){
                    var sByteString = atob(base.split(',')[1]);
                    var mimeString = base.split(',')[0].split(':')[1].split(';')[0]
                    const mime = "application/pdf";
                    var aR = new ArrayBuffer(sByteString.length);
                    var cArray = new Uint8Array(aR);
                    for (var i = 0; i < sByteString.length; i++) {
                        cArray[i] = sByteString.charCodeAt(i);
                    }
                    var blob = new Blob([aR], {type:mime});
                    return URL.createObjectURL(blob)
                },
                onDelete:function(oEvent){
                    var oCurentobj = oEvent.getSource().getBindingContext().getObject()
                    var oModel = that.getOwnerComponent().getModel("Odata");
                    oModel.callFunction("/pdfstore", {
                        method : "GET",
                        urlParameters: {
                            flag: "PDFDELETE",
                            Obj: JSON.stringify(oCurentobj)
                            
                        },
                        success: function (oData, _response) {
                            that.onAfterRendering()
                        },
                        error: function (e) {
                            sap.m.MessageToast.show(e);
                        }
                    })

                }
      });
     });
     





                      