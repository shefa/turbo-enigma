import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/models/images.js';
import Processed from '/models/processed.js';
import OCR from '/models/ocr.js';
    
Template.process_page.helpers({
    originalLink: function()
    {
        return Images.find(FlowRouter.getParam("_id"));
    },
    resultLink: function()
    {
        return Processed.find({name:"final",userId:FlowRouter.getParam("_id")});
    },
    resultOCR: function()
    {
        //console.log(OCR.find({userId:FlowRouter.getParam("_id")}).fetch());
        return OCR.find({userId:FlowRouter.getParam("_id")});
    },
    getStuff: function(link)
    {
        console.log("getting the shit ");
        console.log(link);
        $("#OCRtext").load(link);
    },
    processing: function()
    {
        var id = FlowRouter.getParam("_id");
        return Processed.find({userId:id});
    }
});
