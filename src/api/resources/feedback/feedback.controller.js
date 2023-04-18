const mailer = require("../../../mailer")

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

        } catch (err) {
            console.log(err)
            throw new RequestError("Error");
        }
    },
}