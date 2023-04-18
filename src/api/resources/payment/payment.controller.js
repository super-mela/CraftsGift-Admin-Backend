const config = require("../../../config").data;
const dbs = config.db.dbs;

const invoicesCollection = dbs.collection("invoices");

module.exports = {

    /* Add user api start here................................*/

    async getAllPayment(req, res, next) {
        try {
            invoicesCollection.find()
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
    async searchPayment(req, res, next) {
        try {
            const { data } = req.body
            invoicesCollection.find({
                $or: [
                    { status: data },
                    { firstname: data },
                    { lastname: data },
                    { invoice: data },
                    { amount: data },
                    { paymentMethod: data },
                    { status: data },
                ]
            })
                .toArray()
                .then((payment) => {
                    if (payment.length) {
                        res.status(200).json({ 'success': true, payment: payment });
                    }
                    else {
                        res.status(200).json({ 'success': false, msg: "No Invoice Found" });
                    }
                })
                .catch(function (err) {
                    next(err)
                });
        }
        catch (err) {
            res.status(500).json({ 'errors': "" + err });
        }
    },

}


