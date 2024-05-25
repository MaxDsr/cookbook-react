const mongoose = require('mongoose');


module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    const userId = new mongoose.Types.ObjectId('665205865268b4bb72389b9c');

    await db.collection('recipes').updateMany({}, { $set: { userId } });
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});


    await db.collection('recipes').updateMany({}, { $unset: { userId: "" } });
  }
};
