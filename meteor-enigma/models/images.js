import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

Images = new FilesCollection({
  debug: false,
  collectionName: 'Images', 
  storagePath: '/root/coding/turbo-enigma/imageStore', 
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 50MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 50 && /png|jpe?g/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 50MB';
  }
});


if (Meteor.isServer) {
  //Images.denyClient();
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
} else {
  Meteor.subscribe('files.images.all');
}

export default Images;
