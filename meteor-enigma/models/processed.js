import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

Processed = new FilesCollection({
  debug: false,
  collectionName: 'Processed',
  storagePath: '/root/coding/turbo-enigma/imageStore',
  allowClientCode: false
});

if (Meteor.isServer) {
  //Images.denyClient();
  Meteor.publish('files.processed.all', function () {
    return Processed.find().cursor;
  });
} else {
  Meteor.subscribe('files.processed.all');
}

export default Processed;
