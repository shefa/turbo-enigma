import { Meteor } from 'meteor/meteor';
import Images from '/models/images.js';
import Processed from '/models/processed.js';
import Deskewed from '/models/deskewed.js';

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
        Images.load('http://51.254.202.28/turbo-enigma/preprocess/test_img/three_receipts.jpg',{ 
            fileName: 'receipts.jpg'
        }); 
  }
});

Meteor.methods({
    loadSampleImages()
    {
        Images.load('http://51.254.202.28/turbo-enigma/preprocess/test_img/scanned_receipt.jpg', {
            fileName: 'receipt.jpg'
        });
        Images.load('http://51.254.202.28/turbo-enigma/preprocess/test_img/scanned_page.jpg', {
            fileName: 'page.jpg'
        });
    },
    deleteImg(id)
    {
        Images.remove(id);
        Processed.remove({userId:id});
        Deskewed.remove({userId:id});
    },
    deskewImg(id)
    {
        var child = Npm.require("child_process");


        console.log("Going to Deskew the image on server");
        console.log("Deleting so far accumulated stuff");      
        Deskewed.remove({userId:id});

        var img = Images.find(id).fetch()[0];
        var path = img.path;
        
        
        var realName = img._id+'.'+img.extension;
        var command = "cd "+img._storagePath+" && bash skew.sh "+realName;
        
        console.log("1-Deskewing image...");
        console.log(command);
        child.exec(command, Meteor.bindEnvironment( function(e,x,y){
            console.log("1-Deskew completed!!!");
            console.log(x);
            Meteor.setTimeout( Meteor.bindEnvironment( function() {
                Deskewed.addFile(img._storagePath+"/fft_"+realName, { fileName:"Fourier Spectrum", type:img.type, userId:id, meta:{}});
                Deskewed.addFile(img._storagePath+"/fft_polar_"+realName, { fileName:"Linear Polar" , type:img.type, userId:id, meta:{}});
                Deskewed.addFile(img._storagePath+"/fft_polar_plot_"+realName+".png", { fileName:"Mean Plot" , type:"image/png", userId:id, meta:{}});
                Deskewed.addFile(img._storagePath+"/deskewed_"+realName, { fileName:"Deskewed" , type:img.type, userId:id, meta:{}});
            }),700);
        }));
    },
    processImg(id,clean=false,language="eng")
    {
        var child = Npm.require("child_process");


        console.log("Going to process the image on server - "+clean.toString()+" "+language);
        console.log("Deleting so far accumulated stuff");      
        Processed.remove({userId:id});
        OCR.remove({userId:id});

        var img = Images.find(id).fetch()[0];
        var path = img.path;
        
        
        var realName = img._id+'.'+img.extension;
        var command = "cd "+img._storagePath+" && bash split.sh "+realName;
        var command2 = "cd "+img._storagePath+" && bash all.sh "+realName;
        var command3 = "cd "+img._storagePath+" && tesseract --psm 1 --oem 1 -l "+language+" split_final_"+realName+" stdout";
        var command4 = "cd "+img._storagePath+" && tesseract --psm 1 --oem 1 -l "+language+" out_"+realName+" stdout";

        console.log("1-Splitting image...");
        
        child.exec(command, Meteor.bindEnvironment( function(e,x,y){
            console.log("1-Split completed!!!, splitted images = " + x);
            Meteor.setTimeout( Meteor.bindEnvironment( function() {
                Processed.addFile(img._storagePath+"/split_edged_blurred_"+realName, { fileName:"edges", type:img.type, userId:id, meta:{}});
                Processed.addFile(img._storagePath+"/split_contours_"+realName, { fileName:"contours" , type:img.type, userId:id, meta:{}});
                Processed.addFile(img._storagePath+"/split_final_"+realName, { fileName:"transform" , type:img.type, userId:id, meta:{}});
                Processed.addFile(img._storagePath+"/split_final_thresh_"+realName, { fileName:"threshold" , type:img.type, userId:id, meta:{}});
                
                for(var i=1;i<parseInt(x);i++)
                {
                    Processed.addFile(img._storagePath+"/split_final_"+i.toString()+"_"+realName, { fileName:"transform"+i.toString() , type:img.type, userId:id, meta:{}});
                }

            }),700);
            
            child.exec(command3, Meteor.bindEnvironment(function(e,x,y){
                OCR.insert({ text:x, userId:id, type:1});
                console.log("OCR done on split final image.");
                console.log("2-Cleaning image and doing OCR again...");

                if(clean) child.exec(command2, Meteor.bindEnvironment(function(e,x,y){
                    console.log("2-Image cleaned");
                    Meteor.setTimeout( Meteor.bindEnvironment( function() {
                        Processed.addFile(img._storagePath+"/out_"+realName, { fileName:"cleaned" , type:img.type, userId:id, meta:{}});
                    }),700);

                    child.exec(command4, Meteor.bindEnvironment(function(e,x,y){
                        console.log("3-All done!");
                        OCR.insert({ text:x , userId:id, type:2});
                    }));
                }));
            }));

        }));
    }
});
