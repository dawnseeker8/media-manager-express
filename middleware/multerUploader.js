const multer = require('multer');
const {uploadConfig} = require("../config/config");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadConfig.uploadCacheFolder)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: uploadConfig.maximumUploadSize
  }
});

module.exports = upload;
