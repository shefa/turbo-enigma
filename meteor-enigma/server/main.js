import { Meteor } from 'meteor/meteor';
import Images from '/models/images.js';

Meteor.startup(() => {
  // code to run on server at startup
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
        var command = "cd "+img.storagePath+" && bash all.sh "+img.name+" 25 20";
        console.log("going to call this command ");
        console.log(command);
        //child.exec();


        //Images.addFile(pathToFile,{fileName:'', type: 'image/jpg', userId
    }
});
