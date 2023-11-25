
const mailer = require("../../../mailer");
const config = require("../../../config").data;
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const usersCollections = dbs.collection("users");

module.exports = {

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
      usersCollections
        .findOne({ _id: ObjectId(req.query._id) })
        .then((customer) => {
          if (customer) {
            return usersCollections.deleteOne({ _id: ObjectId(customer._id) });
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

  //Api to Send Email
  async sendCustomerEmail(req, res, next) {
    try {
      const emailData = req.body
      //write code here that send email to the client 
      console.log("================================")
      console.log(emailData)
      console.log("================================")
      mailer.sendToCustomer(emailData);
      res.status(200).json({ 'success': true, msg: "Successfully Sent Email" });
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
      const { _id, name, email } = req.body.data;
      usersCollections
        .findOne({ _id: ObjectId(_id) })
        .then((customer) => {
          if (customer) {
            return usersCollections.updateOne(
              { _id: ObjectId(customer._id) },
              {
                $set:
                {
                  name: name,
                  email: email,

                }
              },
              { upsert: true }
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

};

