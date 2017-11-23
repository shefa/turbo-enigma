import { Meteor } from 'meteor/meteor';
import Images from '/models/images.js';

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
        var a  = img.path.split("/");
        var realName = a[a.length-1];
        var command = "cd "+img._storagePath+" && bash all.sh "+realName+" 25 20";
        console.log("going to call this command ");
        console.log(command);
        child.exec(command, function(error,stdout,stderr){
        
        });


        Images.addFile(pathToFile,{fileName:'', type: 'image/jpg', userId
    }
});
