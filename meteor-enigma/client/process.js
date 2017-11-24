import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/models/images.js';
import Processed from '/models/processed.js';
import Deskewed from '/models/deskewed.js';
    
Template.process_page.helpers({
    originalLink: function()
    {
        return Images.find(FlowRouter.getParam("_id"));
    },
    resultLink: function()
    {
        return Processed.find({name:"threshold",userId:FlowRouter.getParam("_id")});
    },
    resultOCR: function()
    {
        //console.log(OCR.find({userId:FlowRouter.getParam("_id")}).fetch());
        return OCR.find({userId:FlowRouter.getParam("_id"),type:1});
    },
    resultOCRClean: function()
    {
        //console.log(OCR.find({userId:FlowRouter.getParam("_id")}).fetch());
        return OCR.find({userId:FlowRouter.getParam("_id"),type:2});
    },

    /*
    getStuff: function(link)
    {
        console.log("getting the shit ");
        console.log(link);
        setTimeout(function(){ $("#OCRtext").load(link); }, 2000);
    },
    */
    processing: function()
    {
        return Processed.find({userId:FlowRouter.getParam("_id")});
    }
});

Template.deskew_page.helpers({
    originalLink: function()
    {
        return Images.find(FlowRouter.getParam("_id"));
    },
    resultLink: function()
    {
        return Deskewed.find({name:"Deskewed",userId:FlowRouter.getParam("_id")});
    },
    processing: function()
    {
        return Deskewed.find({userId:FlowRouter.getParam("_id")});
    }
});
