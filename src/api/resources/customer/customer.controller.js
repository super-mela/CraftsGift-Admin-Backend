
const { db } = require("../../../models");
const JWT = require("jsonwebtoken");
const mailer = require("../../../mailer");
const config = require("../../../config").data;
const bcrypt = require("bcrypt-nodejs");
const speakeasy = require("speakeasy");
const { validateEmail } = require("./../../../functions");
var path = require('path');
const upload_profile_files = require("../../../profileimage");

const dbs = config.db.dbs;
const usersCollections = dbs.collection("users");

var JWTSign = function (user, date) {
  return JWT.sign(
    {
      iss: config.app.name,
      sub: user._id,
      iam: user.type,
      iat: date.getTime(),
      exp: new Date().setMinutes(date.getMinutes() + 30),
    },
    config.app.secret
  );
};

function generateOtp() {
  let token = speakeasy.totp({
    secret: process.env.OTP_KEY,
    encoding: "base32",
    step: 30 - Math.floor((new Date().getTime() / 1000.0) % 30),
  });
  return token;
}

function verifyOtp(token) {
  let expiry = speakeasy.totp.verify({
    secret: process.env.OTP_KEY,
    encoding: "base32",
    token: token,
    step: 30 - Math.floor((new Date().getTime() / 1000.0) % 30),
    window: 0,
  });
  return expiry;
}

module.exports = {
  async addUser(req, res, next) {
    const { firstName, lastName, phone, email, address, password } = req.body;
    var passwordHash = bcrypt.hashSync(password);
    var token = generateOtp();
    var otp = verifyOtp(token);
    db.customer
      .findOne({ where: { email: email }, paranoid: false })
      .then((find) => {
        if (find) {
          throw new RequestError("Email is already in use", 409);
        }
        return db.customer.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          address: address,
          password: passwordHash,
        });
      })
      .then((user) => {
        if (user) {
          mailer.sendEmployeePassword(email, token);
          return res.status(200).json({
            success: true,
            key: otp,
            msg:
              "New Registration added and password has been sent to " +
              email +
              " .",
          });
        } else res.status(500).json({ success: false });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },

  async findUser(req, res, next) {
    db.customer
      .findOne({
        where: { email: req.query.email },
        attributes: { exclude: ['password'] },
        paranoid: false,
        include: [{ model: db.Address }],
      })
      .then((user) => {
        if (user) {
          return res.status(200).json({ success: true, data: user });
        } else res.status(500).json({ success: false });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },

  async login(req, res, next) {
    var date = new Date();
    var token = JWTSign(req.user, date);
    res.cookie("XSRF-token", token, {
      expire: new Date().setMinutes(date.getMinutes() + 30),
      httpOnly: true,
      secure: config.app.secure,
    });

    return res.status(200).json({ success: true, token });
  },

  async rootUserCheck(req, res) {
    if (validateEmail(req.body.email)) {
      db.user
        .findOne({
          where: {
            email: req.body.email,
          },
        })
        .then((user) => {
          if (user)
            return res.status(200).json({
              success: true,
              redirect: false,
              email: req.body.email,
            });
          return res.status(401).json({
            success: false,
            redirect: false,
            msg: "Crafts Gift account with that sign-in information does not exist. Try again or create a new account.",
          });
        });
    }
  },

  async sendReset(req, res) {
    const { email } = req.body;
    mailer
      .sendResetPassword(email)
      .then((r) => {
        return res.status(200).json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ errors: ["Error Sending Email!"] });
      });
  },

  async resetPassword(req, res) {
    const { email, verificationCode, password } = req.body;
    db.user
      .findOne({
        where: { email: email, verf_key: verificationCode },
      })
      .then((result) => {
        if (result) {
          var hash = bcrypt.hashSync(password);
          db.user.update(
            { password: hash, verf_key: null, attempt: 0, isVerify: 1 },
            { where: { email: email } }
          );
          return res.status(200).json({ success: true });
        } else {
          return res
            .status(500)
            .json({ errors: ["Invalid verification code!"] });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ errors: ["Error Updating Password!"] });
      });
  },

  async getAllCustomer(req, res, next) {
    usersCollections
      .find()
      .sort({ name: 1 })
      .toArray()
      .then((user) => {
        if (user) {
          return res.status(200).json({ success: true, data: user });
        } else res.status(500).json({ success: false });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  },

  async deleteCustomer(req, res, next) {
    try {
      db.customer
        .findOne({ where: { id: parseInt(req.query.id) } })
        .then((customer) => {
          if (customer) {
            return db.customer.destroy({ where: { id: customer.id } });
          }
          throw new RequestError("Customer is not found");
        })
        .then((re) => {
          return res
            .status(200)
            .json({ msg: "success", status: "deleted Customer Seccessfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async searchCustomer(req, res, next) {
    try {
      const { searchData } = req.body
      usersCollections
        .find({ $or: [{ name: searchData }, { email: searchData }] })
        .toArray()
        .then((customer) => {
          if (customer.length) {
            res.status(200).json({ success: true, data: customer });
          }
          else {
            res.status(200).json({ success: false, msg: "Customer Not Found", });
          }
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  //Api customer update
  async getCustomerUpdate(req, res, next) {
    try {
      const { id, firstName, lastName, phone, gender } = req.body.data;
      db.customer
        .findOne({ where: { id: id } })
        .then((customer) => {
          if (customer) {
            return db.customer.update(
              {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                gender: gender,
              },
              { where: { id: customer.id } }
            );
          }
          throw new RequestError("Customer is not found");
        })
        .then((re) => {
          return res
            .status(200)
            .json({ msg: "success", status: "deleted Customer Seccessfully" });
        })
        .catch((err) => {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async updateProfileImage(req, res, next) {
    try {
      const {
        name,
        id,
      } = req.body;
      const RawfileType = req.files.photo.mimetype;
      const fileType = RawfileType.split("/")[1];
      const filename =
        db.customer
          .findOne({
            where: { id: id }
          }
          )
          .then((customer) => {
            if (customer) {
              return db.customer.update({
                photo:
                  id + "_" + name + "." + fileType
              },
                { where: { id: customer.id } }
              )
                .then((customer) => {
                  if (req.files) {
                    upload_profile_files(req, function (err, result) {
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
            }
            throw new RequestError("User didn't exist", 409);
          })

    } catch (err) {
      throw new RequestError("Error");
    }
  },
  async sendImage(req, res, next) {
    var fileUpload = req.body.path
    res.setHeader('Content-Transfer-Encoding', 'binary')
    res.sendFile(path.join(fileUpload))
  },
};

