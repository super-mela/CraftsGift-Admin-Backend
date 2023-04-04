// import { db } from "../../../models";
// import { queue } from "../../../kue";
// import config from "../../../config";
// import AWS from "aws-sdk";

const config = require("../../../../config").data;
const { upload_Aboutus_files } = require("../../../../photosave");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const aboutusCollection = dbs.collection("aboutus");

module.exports = {
    /* Add user api start here................................*/

    async addAboutUs(req, res, next) {
        try {
            const {
                title,
                paragraph1,
                paragraph2,
                paragraph3,
                paragraph4,
                card1,
                card2,
                founders,
                bannerfilename,
                sidefilename
            } = req.body;
            aboutusCollection
                .findOne()
                .then((aboutus) => {
                    if (!aboutus) {
                        return aboutusCollection.insertOne({
                            title: title,
                            paragraph1: paragraph1,
                            paragraph2: paragraph2,
                            paragraph3: paragraph3,
                            paragraph4: paragraph4,
                            card1: JSON.parse(card1),
                            card2: JSON.parse(card2),
                            founders: JSON.parse(founders),
                            date: new Date(),
                            sidefilename: req.files?.sideimage ? req.files.sideimage?.name : "no image",
                            bannerfilename: req.files?.bannerimage ? req.files.bannerimage?.name : "no image",
                        });
                    }
                    else {
                        return aboutusCollection.updateOne(
                            { _id: ObjectId(aboutus._id) },
                            {
                                $set: {
                                    title: title,
                                    paragraph1: paragraph1,
                                    paragraph2: paragraph2,
                                    paragraph3: paragraph3,
                                    paragraph4: paragraph4,
                                    card1: JSON.parse(card1),
                                    card2: JSON.parse(card2),
                                    founders: JSON.parse(founders),
                                    sidefilename: req.files?.sideimage ? req.files.sideimage.name : sidefilename,
                                    bannerfilename: req.files?.bannerimage ? req.files.bannerimage.name : bannerfilename,
                                }
                            },
                            { upsert: true }
                        )
                    }

                })
                .then((aboutus) => {
                    if (req.files) {
                        upload_Aboutus_files(req, function (err, result) {
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



    async getAllAboutUs(req, res, next) {
        try {
            aboutusCollection.findOne()
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

    async updateAboutUs(req, res, next) {
        try {
            const {
                productId,
                category,
                subCategory,
                name,
                discount,
                net,
                price,
                image,
                tags,
                desc,
                status
            } = req.body;
            aboutusCollection
                .findOne({ _id: ObjectId(productId) })
                .then((aboutus) => {
                    if (aboutus) {
                        return aboutusCollection.updateOne(
                            { _id: ObjectId(product._id) },
                            {
                                $set: {
                                    category: category, subCategory: subCategory, name: name, discount: discount, net: net, price: price, tags: JSON.parse(tags), desc: desc,
                                    image: req.files ? category + "/" + subCategory + "/" + req.files.image.name : product.image,
                                    status: status
                                }
                            },
                            { upsert: true }
                        );
                    }
                    throw new RequestError("Not Found Product", 409);
                })
                .then((p) => {
                    if (req.files) {
                        upload_Aboutus_files(req, function (err, result) {
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
                    // res.status(200).json({ success: true, msg: "Updated Successfully" });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },




}
