const express = require('express');
const router = express.Router();
const tagController = require("../controllers/tag");

router.get('/', tagController.getAll);

router.get('/:name', tagController.get);

router.post('/', tagController.create);

router.put('/:name', tagController.update);

router.delete('/:name', tagController.remove);

module.exports = router;
