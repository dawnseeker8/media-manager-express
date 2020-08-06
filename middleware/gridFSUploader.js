const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const {dbConfig} = require("../config/config");
const path = require("path");
const crypto = require("crypto");
const mongoose = require('mongoose');
let gfs;

function checkFileExists(file) {
  return new Promise((resolve, reject) => {
   gfs.find({filename: file.originalname}).toArray((err, files) => {
     if (!files || files.length === 0) {
        resolve();
     }
     if(err){
       reject({statusCode:500, err: err});
     }
     reject({statusCode:400, errMsg:"file already exists"});
   });
  })

}

function setupGridFSStore(connections) {
  connections.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(connections.db, {
      bucketName: "uploads"
    });
  });

  const storage = new GridFsStorage({
    url: dbConfig.mongoConnectString,
    file: (req, file) => {
      return new Promise((resolve, reject) => {

       checkFileExists(file).then(()=> {
         crypto.randomBytes(16, (err, buf) => {
           if (err) {
             return  reject({statusCode:500, err: err});
           }
           const fileInfo = {
             filename: path.basename(file.originalname),
             bucketName: "uploads"
           };
           resolve(fileInfo);
         });
       }).catch((err) => {
         reject(err);
       })
      });
    }
  });
  return multer({storage});
}

function getGfs() {
  return gfs;
}

module.exports = {getGfs, setupGridFSStore};
