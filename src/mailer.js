// import nodemailer from 'nodemailer';
// import config from './config';
// import { db } from './models';

const { db } = require("./models")
const config = require("./config").data
const nodemailer = require("nodemailer")

module.exports = {
    sendEmployeePassword: (email) => {
        return new Promise((resolve, reject) => {
            try {
                db.customer.findOne({ where: { email: email } })
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
                                html: "Dear user,<br><br> Thank you for registering with Habesh Gebeya.<br> <br> <b>" + otp + "</b><br> <br> This link will expire in 30sec. <br> This is a system generated mail. Please do not reply to this email ID.<br>Warm Regards,<br> Customer Care<br> Product",
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
                if (emaildata) {
                    const { firstName, email, description } = emaildata
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
                        subject: 'Habesha Gebaya Feedback',
                        html: `<h1>Feedback From ${firstName}</h1>` + "<br><br>Dear Crafts Gift,<br><br> " + description + "<br><br><br><br> Contact Information  " + email,
                    }, function (error, info) {
                        if (error) {

                            return reject({
                                name: "ProductException",
                                msg: 'Email Sending Failed'
                            })
                        } else {
                            smtpTransport.sendMail({
                                from: process.env.MAIL_FROM,
                                to: email,
                                subject: 'Habesha Gebaya Feedback',
                                html: `<h4>Dear user ${firstName}</h4>` + "<br><br>We Would like to thankyou for your feedback<br><br> " + "<br><br><br><br> Crafts Gift ",
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

            } catch (err) {
                reject(err);
            }
        });

    }
}



