const config = require("../../../../config").data;
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const crystsalOptionCollection = dbs.collection("crystalOption");

module.exports = {
    /* Add user api start here................................*/
    async addCrystalOption(req, res, next) {
        console.log(req.body)
        try {
            const { options } = req.body;
            crystsalOptionCollection
                .findOne()
                .then((crystal) => {
                    if (!crystal) {
                        return crystsalOptionCollection.insertOne({
                            ...req.body,
                            date: new Date(),
                        });
                    }
                    else {
                        return crystsalOptionCollection.updateOne(
                            { _id: ObjectId(crystal._id) },
                            { $set: { options } },
                            { upsert: true }
                        )
                    }

                })
                .then((crystal) => {
                    if (crystal) {
                        res.status(200).json({
                            success: true,
                            msg: "Successfully inserted Crystal Options",
                        });
                    }
                    else {
                        res.status(500).json({ success: false, msg: "Crystal Options is not inserted/updated" });
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

    async getAllCrystalOption(req, res, next) {
        try {
            crystsalOptionCollection.findOne()
                .then((options) => {
                    res.status(200).json({ success: true, options });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },

}
