const config = require("../../../../config").data;
const { upload_banner_files } = require("../../../../photosave");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const shippingCollection = dbs.collection("shippingtype");

module.exports = {
    /* Add user api start here................................*/

    async addShipping(req, res, next) {
        try {
            console.log(req.body)
            const { shippers } = req.body;
            shippingCollection
                .findOne()
                .then((banner) => {
                    if (!banner) {
                        return shippingCollection.insertOne({
                            shippers: shippers,
                            date: new Date(),
                        });
                    }
                    else {
                        return shippingCollection.updateOne(
                            { _id: ObjectId(banner._id) },
                            { $set: { shippers: shippers } },
                            { upsert: true }
                        )
                    }

                })
                .then((banner) => {
                    if (banner) {
                        res.status(200).json({
                            success: true,
                            msg: "Successfully inserted product",
                        });
                    }
                    else {
                        res.status(500).json({ success: false, msg: "Shipping is not inserted/updated" });
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

    async updateShipping(req, res, next) {
        try {
            const { shippers } = req.body;
            shippingCollection
                .findOne()
                .then((banner) => {
                    if (banner) {
                        return shippingCollection.updateOne(
                            { _id: ObjectId(banner._id) },
                            { $set: { shippers: shippers } },
                            { upsert: true }
                        )
                    }
                    else {
                        res.status(200).json({
                            success: false,
                            msg: "No Data to update",
                        });
                    }
                })
                .then((banner) => {
                    if (banner) {
                        res.status(200).json({
                            success: true,
                            msg: "Successfully inserted product",
                        });
                    }
                    else {
                        res.status(500).json({ success: false, msg: "Shipping is not inserted/updated" });
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

    async getAllShippers(req, res, next) {
        try {
            shippingCollection.findOne()
                .then((shipper) => {
                    res.status(200).json({ success: true, shipper });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

}
