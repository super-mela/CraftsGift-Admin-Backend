// import { db } from "../../../models";
const { db } = require("../../../models")
const { Op } = require("sequelize");
const mailer = require("../../../mailer")
// import mailer from "../../../mailer";

module.exports = {
    /* Add user api start here................................*/

    async sendfeedback(req, res, next) {
        try {
            const { firstName, email, dscription } = req.body;
            if (email) {
                mailer.sendFeedback(req.body);
                return res
                    .status(200)
                    .json({
                        success: true,
                        msg:
                            "Feedback is send to Crafts Gift using " +
                            email +
                            " .",
                    });
            } else res.status(500).json({ success: false });
            // db.category
            //     .findOne({ where: { name: name } })
            //     .then((data) => {
            //         if (data) {
            //             return db.category.update(
            //                 { slug: slug },
            //                 { where: { id: data.id } }
            //             );
            //         }
            //         return db.category.create({ name: name, slug: slug });
            //     })
            //     .then((category) => {
            //         res
            //             .status(200)
            //             .json({ success: true, msg: "Successfully inserted category" });
            //     })
            //     .catch(function (err) {
            //         next(err);
            //     });
        } catch (err) {
            console.log(err)
            // throw new RequestError("Error");
        }
    },
}