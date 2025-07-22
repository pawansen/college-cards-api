const multer = require('multer'),
  path = require('path'),
  UPLOAD_PATH = path.normalize(path.resolve(__dirname, '../../../uploads')),
  { ErrorResponse } = require('../utils/apiResponse'),
  { ERROR_MESSAGES } = require('../../../config/constants')

module.exports = function Upload(storagePath) {
  try {
    const storage = multer.diskStorage({
      destination(req, file, cb) {
        const url = UPLOAD_PATH + '/' + storagePath
        cb(null, url)
      },
      filename(req, file, cb) {
        cb(
          null,
          storagePath + '-' + Date.now() + path.extname(file.originalname)
        )
      },
    })
    return multer({
      storage,
      /*fileFilter: function (req, file, callback) {
              if (file.mimetype.includes("png") || file.mimetype.includes("jpeg")) {
                  callback(null, true);
              } else {
                callback("Please upload only png, jpeg file.", false);
              }
          }*/
    })
  } catch (err) {
    console.log(err)
  }
}
