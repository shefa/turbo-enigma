import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Images from '/models/images.js';
import './upload.html';


Template.uploadedFiles.onCreated(function(){
    this.selectedImg = new ReactiveVar("");
});

Template.uploadedFiles.helpers({
  uploadedFiles: function () {
    return Images.find();
  }
});

Template.uploadedFiles.events({
    'click img': function(e, template)
    {
        var id = e.target.attributes['id'].value;
        var path = Images.find(id).fetch()[0].path;
          
        var old = document.getElementById(template.selectedImg.get());
        if(old!==undefined&&old!==null) old.style.border="none";
        e.target.style.border="solid 3px red";
        template.selectedImg.set(id);
        
    },
    'click #processBtn': function(e, template)
    {
        var id = template.selectedImg.get();
        if(id!==undefined&&id!==null)
        {   
            Meteor.call("processImg",id);
            //console.log("redirecting to /process/"+id);
            FlowRouter.go('process.image',{_id: id});
        }
        else
        {
            window.alert("Please select a picture for processing first!");
        }
    }
});

Template.uploadedFiles.onRendered(function(){ 
    Meteor.Images=Images;
});

Template.uploadForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.uploadForm.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.uploadForm.events({
  'change #fileInput': function (e, template) {
    if (e.currentTarget.files && e.currentTarget.files[0]) {
      // We upload only one file, in case
      // there was multiple files selected
      var file = e.currentTarget.files[0];
      if (file) {
        var uploadInstance = Images.insert({
          file: file,
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);

        uploadInstance.on('start', function() {
          template.currentUpload.set(this);
        });

        uploadInstance.on('end', function(error, fileObj) {
          if (error) {
            window.alert('Error during upload: ' + error.reason);
          } else {
            window.alert('File "' + fileObj.name + '" successfully uploaded');
          }
          template.currentUpload.set(false);
        });

        uploadInstance.start();
      }
    }
  }
});
