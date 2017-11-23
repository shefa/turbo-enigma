import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/models/images.js';

    
Template.process_page.helpers({
    originalLink: function()
    {
        var id = FlowRouter.getParam('_id');
        var img = Images.find(id).fetch()[0];
        return img.link;
    },
    resultLink: function()
    {
    },
    processing: function()
    {
    }
});
