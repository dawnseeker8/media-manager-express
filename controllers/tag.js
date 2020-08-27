const tagModel = require("../models/tag");

function get(req, res) {
  tagModel.findOne({name: req.params.name})
    .then(tag => res.json(tag))
    .catch(err => res.status(400).json(err));
}

function getAll(req, res) {
  tagModel.find({})
    .then((tags) => res.json(tags))
    .catch(err => res.status(400).json(err));
}

function create(req, res) {

  tagModel.create(req.body)
    .then(newTag => res.json(newTag))
    .catch(() => res.status(400).send({
      errKey: 'tagExists',
      err: `tag ${req.body.name} already exists`,
      errArg: req.body.name
    }));
}

function update(req, res) {
  tagModel.findOneAndUpdate({name: req.params.name}, req.body)
    .then(tag => res.json(tag))
    .catch(err => res.status(400).json(err));
}

function remove(req, res) {
  tagModel.findOneAndDelete({name: req.params.name})
    .then((tag) => res.status(200).json({
      msgKey: 'deleteSuccess',
      msg: `tag ${tag.name} delete successfully`,
      msgArg: tag.name
    }))
    .catch((err) => {
      res.status(400).json(err);
    })
}

module.exports = {get, getAll, create, update, remove}
