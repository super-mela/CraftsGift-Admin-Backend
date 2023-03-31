// import { db } from "../../../models";
const { db } = require("../../../models")
const { Op } = require("sequelize");
const { ObjectId } = require("mongodb");
const config = require("../../../config").data;
const { upload_category_files } = require("../../../photosave");

const dbs = config.db.dbs

const categoriesCollections = dbs.collection("categories");

module.exports = {
  /* Add user api start here................................*/

  async addCategory(req, res, next) {
    try {
      const { categoryName, subCategories } = req.body;
      categoriesCollections
        .findOne({ categoryName: categoryName })
        .then((data) => {
          if (data) {
            return categoriesCollections.updateOne(
              { _id: ObjectId(data._id) },
              {
                $set: {
                  subCategories: JSON.parse(subCategories),
                  image: req.files ? categoryName + "/" + req.files.image.name : "no image",
                }
              },
              { upsert: true }
            );
          }
          return categoriesCollections.insertOne({
            categoryName: categoryName,
            subCategories: JSON.parse(subCategories),
            image: req.files ? categoryName + "/" + req.files.image.name : "no image",
            date: new Date
          });
        })
        .then((category) => {
          if (req.files) {
            upload_category_files(req, function (err, result) {
              if (err) {
                res.send(err);
              } else {
                res.status(200).json({
                  success: true,
                  msg: "Successfully inserted category",
                });
              }
            });
          } else {
            res
              .status(200)
              .json({ success: true, msg: "Successfully inserted category" });
          }
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async searchCategory(req, res, next) {
    try {
      const { searchData } = req.body;
      categoriesCollections.find({ $or: [{ categoryName: searchData }, { subCategories: searchData }] })
        .toArray()
        .then((category) => {
          if (category.length) {
            res.status(200).json({ success: true, data: category });
          }
          else {
            res.status(200).json({ success: false, msg: "Category Not Found" });
          }
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async updateCategory(req, res, next) {
    try {
      const { _id, categoryName, subCategory } = req.body;
      categoriesCollections.findOne({ _id: ObjectId(_id) }).then((category) => {
        if (category) {
          return categoriesCollections.updateOne(
            { _id: ObjectId(category._id) },
            { $set: { categoryName: categoryName, subCategory: JSON.parse(subCategory), image: req.files ? categoryName + "/" + req.files.image.name : category.image } },
            { upsert: true }
          );
        }
        throw new RequestError("Category Not Found", 409);
      })
        .then((category) => {
          if (req.files) {
            upload_category_files(req, function (err, result) {
              if (err) {
                res.send(err);
              } else {
                res.status(200).json({
                  success: true,
                  msg: "Successfully updated category",
                });
              }
            });
          } else {
            res
              .status(200)
              .json({ success: true, msg: "Successfully updated category" });
          }
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },


  async getSubCategoryList(req, res, next) {
    try {
      categoriesCollections.findOne({ categoryName: req.query.categoryId })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },


  // category list
  async getMainList(req, res, next) {
    try {
      categoriesCollections
        .find()
        .sort({ date: -1 })
        .toArray()
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getMainListUpdate(req, res, next) {
    try {
      const { _id, categoryName, subCategories } = req.body;
      categoriesCollections.findOne({ _id: ObjectId(_id) }).then((category) => {
        if (category) {
          return categoriesCollections.updateOne(
            { _id: ObjectId(category._id) },
            { $set: { categoryName: categoryName, subCategories: JSON.parse(subCategories), image: req.files ? categoryName + "/" + req.files.image.name : category.image } },
            { upsert: true }
          );
        }
        throw new RequestError("Category Not Found", 409);
      })
        .then((category) => {
          if (req.files) {
            upload_category_files(req, function (err, result) {
              if (err) {
                res.send(err);
              } else {
                res.status(200).json({
                  success: true,
                  msg: "Successfully updated category",
                });
              }
            });
          } else {
            res
              .status(200)
              .json({ success: true, msg: "Successfully updated category" });
          }
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },


  //child category
  async deleteCategory(req, res, next) {
    categoriesCollections.findOne({ _id: ObjectId(req.query.id) })
      .then((data) => {
        if (data) {
          return categoriesCollections.deleteOne({ _id: ObjectId(data._id) }).then(
            (r) => [r, data]
          );
        }
        throw new RequestError("category is not found");
      })
      .then((re) => {
        return res
          .status(200)
          .json({ status: "deleted category Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },

};