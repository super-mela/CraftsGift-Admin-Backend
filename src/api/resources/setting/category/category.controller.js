const config = require("../../../../config").data;
const { upload_catadverts_files, remove_catadverts } = require("../../../../photosave");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const catAdvertCollection = dbs.collection("categoryAdvert");

module.exports = {
    /* Add user api start here................................*/

    async addcatAdvert(req, res, next) {
        try {
            const { catadverts } = req.body;
            catAdvertCollection
                .findOne()
                .then((category) => {
                    if (!category) {
                        return catAdvertCollection.insertOne({
                            catadverts: JSON.parse(catadverts),
                            date: new Date(),
                        });
                    }
                    else {
                        return catAdvertCollection.updateOne(
                            { _id: ObjectId(category._id) },
                            { $set: { catadverts: JSON.parse(catadverts) } },
                            { upsert: true }
                        )
                    }
                })
                .then((category) => {
                    if (req.files) {
                        upload_catadverts_files(req, function (err, result) {
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

    async getAllCatAdvert(req, res, next) {
        try {
            catAdvertCollection.findOne()
                .then((catadvert) => {
                    res.status(200).json({ success: true, catadvert });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

    async updateCatAdvert(req, res, next) {
        try {
            const {
                catadverts,
                remove
            } = req.body.data;
            catAdvertCollection
                .findOne()
                .then((category) => {
                    if (category) {
                        return catAdvertCollection.updateOne(
                            { _id: ObjectId(category._id) },
                            { $set: { catadverts: catadverts } },
                            { upsert: true }
                        );
                    }
                    throw new RequestError("Not Found About Us", 409);
                })
                .then((p) => {
                    if (remove) {
                        remove_catadverts(req, function (err, result) {
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
