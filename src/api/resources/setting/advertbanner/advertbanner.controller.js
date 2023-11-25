const config = require("../../../../config").data;
const { upload_advertbanner_files } = require("../../../../photosave");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const advertbannerCollection = dbs.collection("advertBanner");

module.exports = {
    /* Add user api start here................................*/

    async addBanner(req, res, next) {
        try {
            const { moto, title, description, caption, link, advertbannerfilename } = req.body;
            advertbannerCollection
                .findOne()
                .then((banner) => {
                    if (!banner) {
                        return advertbannerCollection.insertOne({
                            moto: moto,
                            title: title,
                            description: description,
                            caption: caption,
                            link: link,
                            advertbannerfilename: req.files?.advertbannerimage ? req.files.advertbannerimage?.name : "no image",
                            date: new Date(),

                        });
                    }
                    else {
                        return advertbannerCollection.updateOne(
                            { _id: ObjectId(banner._id) },
                            {
                                $set: {
                                    moto: moto,
                                    title: title,
                                    description: description,
                                    caption: caption,
                                    link: link,
                                    advertbannerfilename: req.files?.advertbannerimage ? req.files.advertbannerimage.name : advertbannerfilename,
                                }
                            },
                            { upsert: true }
                        )
                    }

                })
                .then((banner) => {
                    if (req.files) {
                        upload_advertbanner_files(req, function (err, result) {
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
            advertbannerCollection.findOne()
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
