const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Medias = new Schema({
  id: mongoose.ObjectId,
  filename: {type: String, required: true},
  path: {type: String, required: true}
});

const TagSchema = new Schema({
  name: {type: String, required: true, max: 100, unique: true},
  slug: {type: String, required: true, max: 100},
  medias: [Medias]
});


// Export the model
module.exports = mongoose.model('Tag', TagSchema);
