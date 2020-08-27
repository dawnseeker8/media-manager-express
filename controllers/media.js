const {getGfs, checkFileNotExists} = require("../utils/gridFsUtils");
const fs = require('fs');
const path = require("path");
const {uploadConfig} = require("../config/config");

function _returnFileMeta(filename, req, res) {
  getGfs().find({filename: filename}).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no media exist"
      });
    }
    //will only have one file return because filename is unique
    return res.json(files[0]);
  });
}

function createMedia(req, res, next) {
  if (!req.file) {
    res.status(400).json({errKey: "emptyFile", err: "File is missing"});
    return;
  }

  checkFileNotExists(req.file.filename)
    .then(() => {
      const filename = req.file.filename;
      const filepath = `${uploadConfig.uploadCacheFolder}/${filename}`;
      let metaData = {mimeType: req.file.mimetype, path: `/medias/${filename}`};
      if (req.body.tags) metaData.tags = req.body.tags;
      fs.createReadStream(filepath).pipe(getGfs().openUploadStream(filename, {metadata: metaData})).on('error', function (error) {
        next({statusCode: 400, err: error});
      }).on('finish', function () {
        _returnFileMeta(filename, req, res);
      });

    })
    .catch((err) => {
      next({statusCode: 400, err: err});
    });
}

function getMedia(req, res, next) {
  const filename = req.params.filename;
  const file = `${uploadConfig.uploadCacheFolder}/${filename}`;

  fs.access(file, fs.constants.F_OK, (err) => {
    if (err) {
      checkFileNotExists(filename)
        .then(() => res.status(204).json({
          errKey: 204,
          err: {errKey: 'fileNotFound', err: `File ${filename} not found`, errParam: {filename: filename}}
        }))
        .catch(() => {
          _cacheGridFsFileAndServe(filename, file, next, res);
        });
    } else {
      res.sendFile(path.join(__dirname + '/../' + file), {acceptRanges: true});
    }
  })
}

function getAllMedia(req, res) {

  getGfs().find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no media exist"
      });
    }

    return res.json(files);
  });
}

function deleteMedia(req, res, next) {
  const filename = req.params.filename;
  const file = `${uploadConfig.uploadCacheFolder}/${filename}`;

  getGfs().find({filename: filename}).toArray(function (err, files) {
    if (err) next(err);
    if (files.length > 0)
      //will only have one file since name is unique.
      getGfs().delete(files[0]._id, ()=>_removeCashFile(file, next, req, res));
    else
      res.status(400).json({
        err: {
          errKey: 'fileNotFound',
          err: `File ${filename} not found`,
          errParam: {filename: filename}
        }
      });
  });
}

function _removeCashFile(file, next, req, res) {
  fs.access(file, fs.constants.F_OK, (err) => {
    if (err) {
      next({
        statusCode: 400,
        err: {errKey: 'deletedFail', err: `${req.params.filename} has been deleted unsuccessfully`}
      });
    } else {
      fs.unlink(file, (e) =>
        e ? next({
          statusCode: 400,
          err: e
        }) : res.status(200).json({msg: `${req.params.filename} has been deleted successfully`})
      );
    }
  });
}

function _cacheGridFsFileAndServe(filename, file, next, res) {
  getGfs().openDownloadStreamByName(filename)
    .pipe(fs.createWriteStream(file))
    .on('error', (err) => next(err))
    .on('finish', () => res.sendFile(path.join(__dirname + '/../' + file), {acceptRanges: true}));
}

module.exports = {getAllMedia, getMedia, createMedia, deleteMedia};
