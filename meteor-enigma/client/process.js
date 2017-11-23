import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/models/images.js';
import Processed from '/models/processed.js';

    
Template.process_page.helpers({
    originalLink: function()
    {
        var id = FlowRouter.getParam("_id");
        console.log(" in original Link ");
        console.log(id);
        var img = Images.find(id).fetch()[0];
        return img.link;
    },
    resultLink: function()
    {
    },
    processing: function()
    {
        var id = FlowRouter.getParam("_id");
        return Processed.find({userId:id});
    }
});
