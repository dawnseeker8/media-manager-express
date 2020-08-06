const express = require('express');
const router = express.Router();
const {setupDBConnection} = require("../utils/DbUtils");
const {getGfs, setupGridFSStore} = require("../middleware/gridFSUploader");
const connections = setupDBConnection();
const upload = setupGridFSStore(connections);
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  getGfs().find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "no media exist"
      });
    }

    return res.json(files);
  });
});

router.post('/', upload.single('file'), (req, res) => res.json({file: req.file}));

router.get('/:filename', (req, res) => {
  const gfs = getGfs();
  gfs.find({
    filename: req.params.filename
  })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist"
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

router.delete('/:id', (req, res) => {
  getGfs().delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({err: err.message});
    res.status(204).json({msg: `media ${req.params.id} have been successfully deleted`});
  });
});


module.exports = router;
