import { Meteor } from 'meteor/meteor';
import Images from '/models/images.js';
import Processed from '/models/processed.js';
import OCR from '/models/ocr.js';

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


        console.log("Splitting image...");
        child.exec(command, Meteor.bindEnvironment( function(error,stdout,stderr){
            console.log("Split completed!!!");
            Meteor.setTimeout( Meteor.bindEnvironment( function(err,res){
                Processed.addFile(img._storagePath+"/split_edged_blurred_"+realName, { fileName:"edges", type:img.type, userId:id, meta:{}});
                Processed.addFile(img._storagePath+"/split_contours_"+realName, { fileName:"contours" , type:img.type, userId:id, meta:{}});
                Processed.addFile(img._storagePath+"/split_final_"+realName, { fileName:"transform" , type:img.type, userId:id, meta:{}});
            },1000));
            

            console.log("Cleaning image and doing OCR...");

            child.exec(command2, function(error,stdout,stderr){
                console.log("All finished");
                console.log(stdout);
                Processed.addFile(img._storagePath+"/out_"+realName, { fileName:"final" , type:img.type, userId:img._id, meta:{}});
                OCR.addFile(img._storagePath+"/out_"+realName+'.txt', { fileName:"ocr" , type:"text/plain", userId:img._id, meta:{}});
            });

        }));


        //Images.addFile(pathToFile,{fileName:'', type: img.type, userId
    }
});
