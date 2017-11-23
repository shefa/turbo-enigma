import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

OCR = new FilesCollection({
  debug: false,
  collectionName: 'OCR',
  storagePath: '/root/coding/turbo-enigma/imageStore',
  allowClientCode: false
});

if (Meteor.isServer) {
  //Images.denyClient();
  Meteor.publish('files.ocr.all', function () {
    return OCR.find().cursor;
  });
} else {
  Meteor.subscribe('files.ocr.all');
}

export default OCR;
