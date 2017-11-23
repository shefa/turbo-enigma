import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/models/images.js';
import Processed from '/models/processed.js';

    
Template.process_page.helpers({
    originalLink: function()
    {
        return Images.find(FlowRouter.getParam("_id"));
    },
    resultLink: function()
    {
        return Processed.find({name:"final",userId:FlowRouter.getParam("_id")});
    },
    processing: function()
    {
        var id = FlowRouter.getParam("_id");
        return Processed.find({userId:id});
    }
});
