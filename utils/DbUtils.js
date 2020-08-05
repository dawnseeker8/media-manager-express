const mongoose = require('mongoose');
const {dbConfig} = require('../config/config');

function setupDBConnection() {
  return mongoose.createConnection(dbConfig.mongoConnectString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = {
  setupDBConnection
};

