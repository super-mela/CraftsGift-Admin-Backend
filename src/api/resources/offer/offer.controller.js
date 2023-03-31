// import { db } from '../../../models';
const { db } = require("../../../models")
const Sequelize = require("sequelize");
const { ObjectId } = require("mongodb");
const config = require("../../../config").data;
const { upload_offer_files } = require('../../../photosave');
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
                            {
                                $set: {
                                    name: name,
                                    discount: discount,
                                    image: req.files ? req.files.image.name : "no image",
                                    expiresIn: expiresIn,
                                    leastAmount: leastAmount
                                }
                            },
                            { upsert: true }
                        )
                    }
                    return offersCollection.insertOne({
                        name: name,
                        discount: discount,
                        coupon: coupon,
                        image: req.files ? req.files.image.name : "no image",
                        expiresIn: expiresIn,
                        leastAmount: leastAmount,
                        data: new Date()
                    })

                })
                .then(success => {
                    if (req.files) {
                        upload_offer_files(req, function (err, result) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.status(200).json({
                                    success: true,
                                    msg: "offer Successfully inserted",
                                });
                            }
                        });
                    } else {
                        res
                            .status(200)
                            .json({ success: true, msg: "offer Successfully inserted" });
                    }
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
                .sort({ date: -1 })
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

    async searchOffer(req, res, next) {
        try {
            const { searchData } = req.body;
            console.log(req.body)
            offersCollection.find({ $or: [{ name: searchData }, { coupon: searchData }, { discount: searchData }, { leastAmount: searchData }] })
                .toArray()
                .then((offer) => {
                    if (offer.length) {
                        res.status(200).json({ success: true, data: offer });
                    }
                    else {
                        res.status(200).json({ success: false, msg: "Offer not found" });
                    }
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
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
                            {
                                $set: {
                                    name: name,
                                    discount: discount,
                                    coupon: coupon,
                                    image: req.files ? req.files.image.name : offer.image,
                                    expiresIn: expiresIn,
                                    leastAmount: leastAmount
                                }
                            },
                            { upsert: true }
                        )
                    }
                    throw new RequestError("No data found", 409)
                })
                .then(e => {
                    if (req.files) {
                        upload_offer_files(req, function (err, result) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.status(200).json({
                                    success: true,
                                    msg: "offer Successfully updated",
                                });
                            }
                        });
                    } else {
                        res
                            .status(200)
                            .json({ success: true, msg: "offer Successfully updated" });
                    }
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


