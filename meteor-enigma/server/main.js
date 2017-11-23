import { Meteor } from 'meteor/meteor';
import Images from '/models/images.js';
import Processed from '/models/processed.js';

Meteor.startup(() => {
  // code to run on server at startup
  if(Images.find().count()==0)
  {
        Images.load('http://51.254.202.28/turbo-enigma/preprocess/test_img/scanned_receipt.jpg', {
            fileName: 'receipt.jpg'
        });
        Images.load('http://51.254.202.28/turbo-enigma/preprocess/test_img/scanned_page.jpg', {
            fileName: 'page.jpg'
        });
  }
});

Meteor.methods({
    processImg(id)
    {
        var child = Npm.require("child_process");


        console.log("Going to process the image on server");
        console.log("Deleting so far accumulated stuff");      
        Processed.remove({userId:id});
        OCR.remove({userId:id});

        var img = Images.find(id).fetch()[0];
        var path = img.path;
        
        
        var realName = img._id+'.'+img.extension;
        var command = "cd "+img._storagePath+" && bash split.sh "+realName;
        var command2 = "cd "+img._storagePath+" && bash all.sh "+realName;
        var command3 = "cd "+img._storagePath+" &&tesseract --psm 1 --oem 1 -l eng out_"+realName+" stdout";

        console.log("Splitting image...");
        child.exec(command, Meteor.bindEnvironment( function(e,x,y){
            console.log("Split completed!!!");
            Meteor.setTimeout( Meteor.bindEnvironment( function() {
                Processed.addFile(img._storagePath+"/split_edged_blurred_"+realName, { fileName:"edges", type:img.type, userId:id, meta:{}});
                Processed.addFile(img._storagePath+"/split_contours_"+realName, { fileName:"contours" , type:img.type, userId:id, meta:{}});
                Processed.addFile(img._storagePath+"/split_final_"+realName, { fileName:"transform" , type:img.type, userId:id, meta:{}});
            }),700);
            

            console.log("Cleaning image and doing OCR...");

            child.exec(command2, Meteor.bindEnvironment(function(e,x,y){
                console.log("Image cleaned");
                Meteor.setTimeout( Meteor.bindEnvironment( function() {
                    Processed.addFile(img._storagePath+"/out_"+realName, { fileName:"final" , type:img.type, userId:id, meta:{}});
                }),700);

                child.exec(command3, Meteor.bindEnvironment(function(e,x,y){
                    console.log("All done!");
                    OCR.insert({ text:x , userId:id});
                }));
            }));

        }));


        //Images.addFile(pathToFile,{fileName:'', type: img.type, userId
    }
});
