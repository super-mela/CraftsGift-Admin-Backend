// import { db } from '../../../models';
const { db } = require("../../../models")
const config = require("../../../config").data;

var Sequelize = require("sequelize");
const { ObjectId } = require("mongodb");
import mailer from "../../../mailer";

const dbs = config.db.dbs;
const invoicesCollection = dbs.collection("invoices");
const customOrederCollection = dbs.collection("customOrder")

module.exports = {

    /* Add user api start here................................*/

    async index(req, res, next) {
        try {
            const { customerId, paymentmethod, orderId, deliveryAddress, product, grandTotal } = req.body;
            db.customer.findOne({ where: { id: customerId } })
                .then(p => {
                    if (p) {
                        return db.Order.create({
                            custId: customerId,
                            number: orderId,
                            grandtotal: grandTotal,
                            paymentmethod: paymentmethod
                        })
                    }
                    return res.status(500).json({ 'errors': ['User is not found'] });
                })
                .then((order) => {
                    if (order) {
                        return db.Address.create({
                            orderId: order.id,
                            custId: customerId,
                            fullname: deliveryAddress ? deliveryAddress.name : '',
                            phone: deliveryAddress ? deliveryAddress.phone : '',
                            discrict: deliveryAddress ? deliveryAddress.discrict : '',
                            city: deliveryAddress ? deliveryAddress.city : '',
                            states: deliveryAddress ? deliveryAddress.states : '',
                            shipping: deliveryAddress ? deliveryAddress.address : '',
                        }).then((p) => [order, p])
                    }
                })
                .then(([order, p]) => {
                    if (order) {
                        let cartEntries = [];
                        for (var i = 0; i < product.length; i++) {
                            cartEntries.push({
                                orderId: order.id,
                                addressId: p.id,
                                productId: product[i].id,
                                name: product[i].name,
                                qty: product[i].qty,
                                price: product[i].price,
                                total: product[i].total,
                                photo: product[i].photo,
                            })
                        }
                        return db.Cart.bulkCreate(cartEntries).then((r) => [r])
                    }
                })
                .then((success) => {
                    res.status(200).json({ 'success': true });
                })
                .catch(function (err) {
                    console.log(error);
                    res.status(500).json({ 'errors': ['Error adding cart'] });
                });
        }
        catch (err) {
            throw new RequestError('Error');
        }
    },

    async getAllOrderList(req, res, next) {
        let options = {};
        if (req.query.sort) {
            if (req.query.sort == 'name') {
                options = {
                    sort: { date: 1 },
                };
            } else {
                options = {
                    sort: { date: -1 },
                };
            }
        }
        try {
            invoicesCollection.find(options).toArray()
                .then(list => {
                    res.status(200).json({ 'success': true, order: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },

    async statusUpdate(req, res, next) {
        try {
            const { _id, status, deliverydate } = req.body;
            invoicesCollection.findOne({ _id: ObjectId(_id) })
                .then(list => {
                    return invoicesCollection.updateOne(
                        { _id: ObjectId(list._id) },
                        { $set: { status: status, deliverydate: deliverydate } },
                        { upsert: true })
                })
                .then((success) => {
                    res.status(200).json({ 'success': true, msg: "Successfully Updated Status" });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },

    async getAllOrderListById(req, res, next) {
        try {
            db.Order.findAll({
                where: { custId: req.body.id },
                order: [['createdAt', 'DESC']],
                include: [{ model: db.Address, include: [{ model: db.Cart }] }],
            })
                .then(list => {
                    res.status(200).json({ 'success': true, order: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },
    async getAllOrderStatus(req, res, next) {
        try {
            db.Order.findAll({
                where: { status: req.body.status },
                order: [['createdAt', 'DESC']],
                include: [{ model: db.Address, include: [{ model: db.Cart }] }],
            })
                .then(list => {
                    res.status(200).json({ 'success': true, order: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },
    async getAllOrderCount(req, res, next) {
        // invoicesCollection.findAll({
        //     attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'total']],
        //     group: ['status']
        // })
        try {
            dbs.invoices.aggregate([
                { "$group": { _id: { status: "$status" }, count: { $sum: 1 } } }
            ]).then(list => {
                console.log(list)
                res.status(200).json({ 'success': true, data: list });
            })
                .catch(function (err) {
                    console.log(err)
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },


    /////////////////////////////////////////////////////////////
    ///////////////////custom orders////////////////////////////
    ////////////////////////////////////////////////////////////

    async getAllcustomOrderList(req, res, next) {
        try {
            customOrederCollection.find()
                .sort({ date: -1 })
                .toArray()
                .then(list => {
                    res.status(200).json({ 'success': true, order: list });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },

    async statusUpdate(req, res, next) {
        try {
            const { _id, status, deliverydate } = req.body;
            customOrederCollection.findOne({ _id: ObjectId(_id) })
                .then(list => {
                    return customOrederCollection.updateOne(
                        { _id: ObjectId(list._id) },
                        { $set: { status: status, deliverydate: new Date(deliverydate) } },
                        { upsert: true })
                })
                .then((success) => {
                    res.status(200).json({ 'success': true, msg: "Successfully Updated Status" });
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },


    async sendCustomOrderEmail(req, res, next) {
        try {
            const emailData = req.body
            //write code here that send email to the client 
            console.log("================================")
            console.log(emailData)
            console.log("================================")
            mailer.sendCustomOrderToCustomer(emailData);
            res.status(200).json({ 'success': true, msg: "Successfully Sent Email" });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },
}