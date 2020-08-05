const mongoose = require('mongoose');
module.export = mongoose.model('video',
  {
    id: mongoose.ObjectId,
    filename: {type: String, required: true},
    path: {type: String, required: true},
    createdDate: { type: Date, default: Date.now },
  });
