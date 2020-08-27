module.exports = {
  dbConfig: {
    mongoConnectString: process.env.MONGO_CONNECT_STRING || 'mongodb://localhost:27017/media'
  },
  uploadConfig: {
    uploadCacheFolder: process.env.UPLOAD_CACHE_FOLDER || 'public/videos',
    supportedType: process.env.UPLOAD_SUPPORT_MEDIA_TYPE || 'video/mp4',
    maximumUploadSize: process.env.MAXIMUM_UPLOAD_SIZE || 10*1000*1000
  }
};
