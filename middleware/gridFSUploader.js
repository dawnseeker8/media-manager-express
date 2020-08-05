const multer = require('multer');
const GridFsStorage = require("multer-gridfs-storage");
const {dbConfig} = require("../config/config");
const mongoose = require('mongoose');
let gfs;

function setupGridFSStore(connections) {
  connections.once("open", () => {
    // init stream
    gfs = new mongoose.mongo.GridFSBucket(connections.db, {
      bucketName: "uploads"
    });
  });

  const storage = new GridFsStorage({
    url: dbConfig.mongoConnectString
  });
  return multer({storage});
}

module.exports = {gfs, setupGridFSStore};
