const express = require('express');
const router = express.Router();
const mediaController = require("../controllers/media");
const upload = require("../middleware/multerUploader");

router.get('/', mediaController.getAllMedia);

router.post('/', upload.single('file'), mediaController.createMedia);

router.get('/:filename', mediaController.getMedia);

router.delete('/:filename', mediaController.deleteMedia);

module.exports = router;
