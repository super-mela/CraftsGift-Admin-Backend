const express = require("express");
const offerController = require("./offer.controller");
const { sanitize } = require("../../../middleware/sanitizer");
const { jwtStrategy } = require("../../../middleware/strategy")
const { validateBody, schemas } = require("../../../middleware/validator")

// var attachmentDir = path.join(path.dirname(require.main.filename), 'public', 'images','product')

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, attachmentDir)
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname))
//     }
//   })
// var uploadAttachment = multer({ storage: storage, limits:{ fileSize: 10485760 }})


const offerRouter = express.Router();
// vendorRouter.route('/create').post(sanitize(),validateBody(schemas.vendorDetails),vendorController.index);
offerRouter.route('/create').post(sanitize(), jwtStrategy, offerController.index);
offerRouter.route('/list').get(sanitize(), jwtStrategy, offerController.getAlloffer);
offerRouter.route('/update').post(sanitize(), offerController.offerUpdate);
offerRouter.route('/delete').delete(sanitize(), offerController.offerDelete);


module.exports = { offerRouter }





