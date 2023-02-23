// import { db } from '../../../models';
const { db } = require("../../../models")
const Sequelize = require("sequelize");
const { ObjectId } = require("mongodb");
const config = require("../../../config").data;
const Op = Sequelize.Op;

const dbs = config.db.dbs;

const offersCollection = dbs.collection("offers");

module.exports = {

    /* Add user api start here................................*/

    async index(req, res, next) {
        try {
            const { name, coupon, discount, image, expiresIn, leastAmount } = req.body;
            offersCollection.findOne({ coupon: coupon })
                .then(offer => {
                    if (offer) {
                        return offersCollection.updateOne(
                            { _id: ObjectId(offer._id) },
                            { $set: { name: name, discount: discount, image: image, expiresIn: expiresIn, leastAmount: leastAmount } },
                            { upsert: true }
                        )
                    }
                    return offersCollection.insertOne(req.body)

                })
                .then(success => {
                    res.status(200).json({ 'success': true, msg: "Successfully inserted offer" });
                })
                .catch(function (err) {
                    console.log(err)
                    next(err)
                });
        }
        catch (err) {
            console.log(err)
            throw new RequestError('Error');
        }
    },

    async getAlloffer(req, res, next) {
        try {
            offersCollection.find()
                .toArray()
                .then(list => {
                    res.status(200).json({ 'success': true, data: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },



    async offerUpdate(req, res, next) {
        try {
            const { _id, name, coupon, discount, image, expiresIn, leastAmount } = req.body;
            offersCollection.findOne({ _id: ObjectId(_id) })
                .then(offer => {
                    if (offer) {
                        return offersCollection.updateOne(
                            { _id: ObjectId(offer._id) },
                            { $set: { name: name, discount: discount, image: image, expiresIn: expiresIn, leastAmount: leastAmount } },
                            { upsert: true }
                        )
                    }
                    throw new RequestError("No data found", 409)

                })
                .then(e => {
                    res.status(200).json({ 'success': true, msg: 'Updated Successfully' });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },


    async offerDelete(req, res, next) {
        try {
            offersCollection.findOne({ _id: ObjectId(req.query.id) })
                .then(data => {
                    if (data) {
                        return offersCollection.deleteOne({ _id: ObjectId(data._id) })
                    }
                    throw new RequestError('Offer is not found')
                })
                .then(re => {
                    return res.status(200).json({ success: true, 'status': "deleted Offer Seccessfully" });
                }).catch(err => {
                    next(err)
                })
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },


}


