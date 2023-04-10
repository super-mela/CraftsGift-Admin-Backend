const config = require("../../../../config").data;
const { upload_sliders_files, remove_slider } = require("../../../../photosave");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const slidersCollection = dbs.collection("sliders");

module.exports = {
    /* Add user api start here................................*/

    async addSlider(req, res, next) {
        try {
            const { sliders } = req.body;
            slidersCollection
                .findOne()
                .then((slider) => {
                    if (!slider) {
                        return slidersCollection.insertOne({
                            sliders: JSON.parse(sliders),
                            date: new Date(),
                        });
                    }
                    else {
                        return slidersCollection.updateOne(
                            { _id: ObjectId(slider._id) },
                            { $set: { sliders: JSON.parse(sliders) } },
                            { upsert: true }
                        )
                    }
                })
                .then((slider) => {
                    if (req.files) {
                        upload_sliders_files(req, function (err, result) {
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



    async getAllSliders(req, res, next) {
        try {
            slidersCollection.findOne()
                .then((aboutus) => {
                    res.status(200).json({ success: true, aboutus });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

    async updateSliders(req, res, next) {
        try {
            const {
                sliders,
                remove
            } = req.body.data;
            slidersCollection
                .findOne()
                .then((slider) => {
                    if (slider) {
                        return slidersCollection.updateOne(
                            { _id: ObjectId(slider._id) },
                            { $set: { sliders: sliders } },
                            { upsert: true }
                        );
                    }
                    throw new RequestError("Not Found About Us", 409);
                })
                .then((p) => {
                    if (remove) {
                        remove_slider(req, function (err, result) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.status(200).json({
                                    success: true,
                                    msg: "Successfully Remove Founder",
                                });
                            }
                        });
                    } else {
                        res
                            .status(200)
                            .json({ success: false, msg: "No Removed File" });
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },
}
