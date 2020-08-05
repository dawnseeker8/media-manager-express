module.exports = {
  dbConfig: {
    mongoConnectString: process.env.MONGO_CONNECT_STRING || 'mongodb://localhost:27017/media'
  },
  uploadConfig: {
    supportedType: process.env.UPLOAD_SUPPORT_MEDIA_TYPE || 'video/mp4'
  }
};
