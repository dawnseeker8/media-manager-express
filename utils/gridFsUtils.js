const {dbConfig} = require("../config/config");
const mongoose = require('mongoose');

let gfs;

mongoose.connect(dbConfig.mongoConnectString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);
const connection = mongoose.connection;

connection.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: "uploads"
  });
});

function checkFileNotExists(filename) {
  return new Promise((resolve, reject) => {
   gfs.find({filename: filename}).toArray((err, files) => {
     if (!files || files.length === 0) {
        resolve();
     } else {
       reject({statusCode:400, err:{errKey:'fileExists', err:`File $f{filename} already exists`, errParam:{filename: filename}}})
     }
     if(err){
       reject({statusCode:500, err: err});
     }
   });
  })
}

function getGfs() {
  return gfs;
}

module.exports = {getGfs, checkFileNotExists};
