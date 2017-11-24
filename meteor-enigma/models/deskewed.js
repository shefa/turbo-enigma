import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

Deskewed = new FilesCollection({
  debug: false,
  collectionName: 'Deskewed',
  storagePath: '/root/coding/turbo-enigma/imageStore',
  allowClientCode: false
});

if (Meteor.isServer) {
  //Images.denyClient();
  Meteor.publish('files.deskewed.all', function () {
    return Deskewed.find().cursor;
  });
} else {
  Meteor.subscribe('files.deskewed.all');
}

export default Deskewed;
