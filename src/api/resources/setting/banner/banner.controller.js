const config = require("../../../../config").data;
const { upload_banner_files } = require("../../../../photosave");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const bannerCollection = dbs.collection("bannerImage");

module.exports = {
    /* Add user api start here................................*/

    async addBanner(req, res, next) {
        try {
            const { bannerfilename } = req.body;
            bannerCollection
                .findOne()
                .then((banner) => {
                    if (!banner) {
                        return bannerCollection.insertOne({
                            bannerfilename: req.files?.bannerimage ? req.files.bannerimage?.name : "no image",
                            date: new Date(),

                        });
                    }
                    else {
                        return bannerCollection.updateOne(
                            { _id: ObjectId(banner._id) },
                            {
                                $set: {

                                    bannerfilename: req.files?.bannerimage ? req.files.bannerimage.name : bannerfilename,
                                }
                            },
                            { upsert: true }
                        )
                    }

                })
                .then((banner) => {
                    if (req.files) {
                        upload_banner_files(req, function (err, result) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.status(200).json({
                                    success: true,
                                    msg: "Successfully inserted product",
                                });
                            }
                        });
                    } else {
                        res
                            .status(200)
                            .json({ success: true, msg: "Successfully inserted product" });
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },



    async getAllBanner(req, res, next) {
        try {
            bannerCollection.findOne()
                .then((banner) => {
                    res.status(200).json({ success: true, banner });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

}
