const express = require('express');
const router = express.Router();
const mediaRoute = require("./media");
const tagRoute = require("./tag");

router.use('/medias', mediaRoute);
router.use('/tags', tagRoute);

module.exports = router;
