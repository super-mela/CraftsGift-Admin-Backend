// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { db } = require("../../../models");
const mailer = require("../../../mailer");
const config = require("../../../config").data;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt-nodejs");
const speakeasy = require("speakeasy");
const run = require("../../index")
const { validateEmail } = require("./../../../functions")

const dbs = config.db.dbs;

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



/* ******* Collections **************** */
const usersCollections = dbs.collection(" adminusers");


// const dbs = client.db("Crafts")

module.exports = {
  async addUser(req, res, next) {
    const {
      firstName,
      lastName,
      phoneNo,
      email,
      address,
      password,
      role,
      verify,
    } = req.body;
    var passwordHash = bcrypt.hashSync(password);
    var token = generateOtp();
    var otp = verifyOtp(token);
    usersCollections.findOne({ email: email })
      .then((find) => {
        if (find) {
          throw new RequestError("Email is already in use", 409);
        }
        return usersCollections.insertOne({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNo: phoneNo,
          address: address,
          password: passwordHash,
          verify: verify,
          role: role,
        });
      })
      .then((user) => {
        if (user) {
          console.log(user)
          mailer.sendEmployeePassword(email, token);
          return res
            .status(200)
            .json({
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
    db.user
      .findOne({
        attributes: ["firstName", "lastName"],
        where: { email: req.query.email },
        paranoid: false,
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

  async getAllUserList(req, res, next) {
    db.user
      .findAll()
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

  async userUpdate(req, res, next) {
    const { id, firstName, lastName, email, address, password, role, verify } =
      req.body;
    var passwordHash = bcrypt.hashSync(password);
    db.user
      .findOne({ where: { email: email }, paranoid: false })
      .then((user) => {
        if (!user) {
          throw new RequestError("User is not found", 409);
        }
        return db.user.update(
          {
            firstName: firstName ? firstName : user.firstName,
            lastName: lastName ? lastName : user.lastName,
            password: password ? passwordHash : user.passwordHash,
            address: address ? address : user.address,
            role: role ? role : user.role,
            verify: verify ? verify : user.verify,
          },
          { where: { id: id } }
        );
      })
      .then((user) => {
        if (user) {
          return res
            .status(200)
            .json({ success: true, msg: "User update successsfully" });
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
      expire: new Date().setMinutes(date.getMinutes() + 200),
      httpOnly: true,
      secure: config.app.secure,
    });

    return res.status(200).json({ success: true, token, role: req.user.role });
  },

  async deleteUserList(req, res, next) {
    db.user
      .findOne({ where: { id: req.body.id } })
      .then((data) => {
        if (data) {
          return db.user
            .destroy({ where: { id: req.body.id } })
            .then((r) => [r, data]);
        }
        throw new RequestError("User is not found", 409);
      })
      .then((re) => {
        return res
          .status(200)
          .json({ status: "deleted userlist Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },
};

