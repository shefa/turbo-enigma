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
        console.log("Going to process the image on server");
        var img = Images.find(id).fetch()[0];
        var path = img.path;
        console.log(path);
        console.log(img.storagePath)
        var child = Npm.require("child_process");
        
        var realName = img._id+'.'+img.extension;
        var command = "cd "+img._storagePath+" && bash all.sh "+realName+" 25 20";
        console.log("going to call this command ");
        console.log(command);
        child.exec(command, function(error,stdout,stderr){
            console.log("Command completed!!!");
            Processed.addFile(imt._storagePath+"/split_edged_blurred_"+realName { fileName:"edged", type:img.type, userId:img._id, fileId: 'splitEdge', meta:{}});
            Processed.addFile(imt._storagePath+"/split_contours_"+realName { fileName:"contours" , type:img.type, userId:img._id,  fileId: 'splitContour', meta:{}});
            Processed.addFile(imt._storagePath+"/split_final_"+realName { fileName:"final" , type:img.type, userId:img._id,        fileId: 'splitFinal', meta:{}});
        });


        //Images.addFile(pathToFile,{fileName:'', type: img.type, userId
    }
});
