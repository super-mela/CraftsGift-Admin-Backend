// import { db } from "../../../models";
const { db } = require("../../../models")
const { Op } = require("sequelize");

module.exports = {
    /* Add user api start here................................*/

    async addAddress(req, res, next) {

        try {
            const { fullName, phone, email, telegram, whatsup, district, city, state, shipping, area } = req.body;
            db.Address
                .findOne({ where: { fullname: fullName } })
                .then((data) => {
                    if (data) {
                        return db.Address.update(
                            {
                                telegram: telegram,
                                whatsup: whatsup,
                                discrict: district,
                                city: city,
                                states: state,
                                shipping: shipping,
                                area: area,
                            },
                            { where: { id: data.id } }
                        );
                    }
                    return db.Address.create({
                        fullname: fullName,
                        phone: phone,
                        email: email,
                        telegram: telegram,
                        whatsup: whatsup,
                        discrict: district,
                        city: city,
                        states: state,
                        shipping: shipping,
                        area: area,
                        custId: req.user.id,
                    });
                })
                .then((Address) => {
                    res
                        .status(200)
                        .json({ success: true, msg: "Successfully inserted address" });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },
    async updateAddress(req, res, next) {
        try {
            const { childcategoryId, subcategoryId, sub_name, name } = req.body;
            db.SubCategory.findOne({ where: { id: subcategoryId } }).then((data) => {
                if (data) {
                    return db.SubCategory.update(
                        { sub_name: sub_name },
                        { where: { id: subcategoryId } }
                    );
                }
                throw new RequestError("Category Not Found", 409);
            });
            db.SubChildCategory.findOne({ where: { id: childcategoryId } })
                .then((data) => {
                    if (data) {
                        return db.SubChildCategory.update(
                            { name: name },
                            { where: { id: childcategoryId } }
                        );
                    }
                    throw new RequestError("Category Not Found", 409);
                })
                .then((category) => {
                    res.status(200).json({ success: true, msg: "Successfully Updated" });
                })
                .catch(function (err) {
                    next(err);
                });
        } catch (err) {
            throw new RequestError("Error");
        }
    },
    async deleteAddress(req, res, next) {
        db.Address.findOne({ where: { id: parseInt(req.query.id) } })
            .then((data) => {
                if (data) {
                    return db.Address.destroy({ where: { id: data.id } }).then(
                        (r) => [r, data]
                    );
                }
                throw new RequestError("Customer address is not found");
            })
            .then((re) => {
                return res
                    .status(200)
                    .json({ status: "deleted address Seccessfully" });
            })
            .catch((err) => {
                next(err);
            });
    },
}