const config = require("./config").data
const nodemailer = require("nodemailer")

const db = config.db.dbs
const usersCollections = db.collection("users");

module.exports = {
    sendEmployeePassword: (email) => {
        return new Promise((resolve, reject) => {
            try {
                usersCollections.findOne({ email: email })
                    .then((user) => {
                        if (user) {
                            var smtpTransport = nodemailer.createTransport({
                                host: process.env.MAIL_HOST,
                                port: process.env.MAIL_PORT,
                                auth: {
                                    user: process.env.MAIL_USERNAME,
                                    pass: process.env.MAIL_PASSWORD
                                },
                                tls: { rejectUnauthorized: false },
                            });
                            smtpTransport.sendMail({
                                from: process.env.MAIL_FROM,
                                to: email,
                                subject: 'Product blogging website',
                                html: "Dear user,<br><br> Thank you for registering with Crafts Gift.<br> <br> <b>" + otp + "</b><br> <br> This link will expire in 30sec. <br> This is a system generated mail. Please do not reply to this email ID.<br>Warm Regards,<br> Customer Care<br> Product",
                                // html: "Hi <br>" + "Your One Time Password(OTP) for completing your registeration on KDMARC is  " + password + " .Please do not share OTP with anyone .<br> Best Regards, <br> Team KDMARC",
                            }, function (error, info) {
                                if (error) {
                                    return reject({
                                        name: "ProductException",
                                        msg: 'Email Sending Failed'
                                    })
                                }
                                return resolve(true)
                            });
                        } else throw {
                            name: "ProductException",
                            msg: 'Email Body not available'
                        }
                    })
            } catch (err) {
                reject(err);
            }
        });
    },
    sendFeedback: (emaildata) => {
        return new Promise((resolve, reject) => {
            try {
                const { email, description, } = emaildata
                usersCollections.findOne({ email: email })
                    .then((user) => {
                        if (user) {
                            var smtpTransport = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.MAIL_USERNAME,
                                    pass: process.env.MAIL_PASSWORD
                                },
                                tls: { rejectUnauthorized: false },
                            });
                            smtpTransport.sendMail({
                                from: process.env.MAIL_FROM,
                                to: process.env.MAIL_TO,
                                subject: 'Crafts Gift Feedback',
                                html: `<h1>Feedback From ${user.name}</h1>` + "<br><br>Dear Crafts Gift,<br><br> " + description + "<br><br><br><br> Contact Information  " + email,
                            }, function (error, info) {
                                if (error) {

                                    return reject({
                                        name: "ProductException",
                                        msg: 'Email Sending Failed'
                                    })
                                } else {
                                    smtpTransport.sendMail({
                                        from: process.env.MAIL_FROM,
                                        to: user.email,
                                        subject: 'Crafts Gift Feedback',
                                        html: `<h4>Dear user ${user.name}</h4>` + "<br><br>We Would like to thankyou for your feedback<br><br> " + "<br><br><br><br> Crafts Gift ",
                                    }, function (error, info) {
                                        if (error) {
                                            return reject({
                                                name: "ProductException",
                                                msg: 'Email Sending Failed'
                                            })
                                        }
                                        return resolve(true)
                                    })
                                }

                            });
                        } else throw {
                            name: "ProductException",
                            msg: 'Email Body not available'
                        }
                    })
            } catch (err) {
                reject(err);
            }
        });

    },
    sendCustomOrderToCustomer: (emaildata) => {
        return new Promise((resolve, reject) => {
            try {
                const { email, description, orderId } = emaildata
                usersCollections.findOne({ email: email })
                    .then((user) => {
                        if (user) {
                            var smtpTransport = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.MAIL_USERNAME,
                                    pass: process.env.MAIL_PASSWORD
                                },
                                tls: { rejectUnauthorized: false },
                            });
                            smtpTransport.sendMail({
                                from: process.env.MAIL_FROM,
                                to: user.email,
                                subject: 'Crafts Gift Custom Order Feedback',
                                html: `<h1>Feedback From Crafts Gift for custom order number ${orderId}</h1>` + `<br><br>Dear User ${user.name},<br><br> ` + description + "<br><br><br><br> This is a system generated mail. Please do not reply to this email ID.<br>Warm Regards,<br> Customer Care<br> Product",
                            }, function (error, info) {
                                if (error) {

                                    return reject({
                                        name: "ProductException",
                                        msg: 'Email Sending Failed'
                                    })
                                } else {
                                    return resolve(true)
                                }

                            });
                        } else throw {
                            name: "ProductException",
                            msg: 'Email Body not available'
                        }
                    })
            } catch (err) {
                reject(err);
            }
        });

    },
    sendCustomOrderFromCustomer: (emaildata) => {
        return new Promise((resolve, reject) => {
            try {
                const { email, description, orderId } = emaildata
                usersCollections.findOne({ email: email })
                    .then((user) => {
                        if (user) {
                            var smtpTransport = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.MAIL_USERNAME,
                                    pass: process.env.MAIL_PASSWORD
                                },
                                tls: { rejectUnauthorized: false },
                            });
                            smtpTransport.sendMail({
                                from: process.env.MAIL_FROM,
                                to: process.env.MAIL_TO,
                                subject: 'Crafts Gift Customer Custom Order Description',
                                html: `<h1>Custom Order Description From ${user.name}</h1>` + "<br><br>Dear Crafts Gift,<br><br> " + description + "<br><br><br><br> Contact Information  " + email,
                            }, function (error, info) {
                                if (error) {

                                    return reject({
                                        name: "ProductException",
                                        msg: 'Email Sending Failed'
                                    })
                                } else {
                                    return resolve(true)
                                }

                            });
                        } else throw {
                            name: "ProductException",
                            msg: 'Email Body not available'
                        }
                    })
            } catch (err) {
                reject(err);
            }
        });

    }
}



