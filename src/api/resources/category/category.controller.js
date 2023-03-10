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

  async addSubCategory(req, res, next) {
    try {
      const { categoryId, sub_name } = req.body;
      db.SubCategory.findOne({ where: { sub_name: sub_name } })
        .then((data) => {
          if (data) {
            throw new RequestError("Category already exist", 409);
          }
          return db.SubCategory.create({
            categoryId: categoryId,
            sub_name: sub_name,
          });
        })
        .then((category) => {
          res
            .status(200)
            .json({ success: true, msg: "Successfully inserted category" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async addSubChildCategory(req, res, next) {
    try {
      const { categoryId, subcategoryId, name } = req.body;
      db.SubChildCategory.findOne({
        where: {
          name: name,
          categoryId: categoryId,
          subcategoryId: subcategoryId,
        },
      })
        .then((data) => {
          if (data) {
            throw new RequestError("Category already exist", 409);
          }
          return db.SubChildCategory.create({
            categoryId: categoryId,
            subcategoryId: subcategoryId,
            name: name,
          });
        })
        .then((category) => {
          res
            .status(200)
            .json({ success: true, msg: "Successfully inserted category" });
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
      categoriesCollections.findOne({ _id: ObjectId(_id) }).then((data) => {
        if (data) {
          return categoriesCollections.updateOne(
            { _id: ObjectId(data._id) },
            { $set: { categoryName: categoryName, subCategory: JSON.parse(subCategory), image: req.files ? categoryName + "/" + req.files.image.name : "no image" } },
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

  async getCategoryList(req, res, next) {
    try {
      db.category
        .findAll({
          attributes: ["id", "name"],
          include: [{ model: db.SubCategory }],
        })
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

  async getAllSubCategoryList(req, res, next) {
    try {
      db.SubCategory
        .findAll({
          attributes: ["id", "sub_name", "categoryId"]
        })
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

  async getCategoryIdBySubcategory(req, res, next) {
    try {
      const { subcategoryId } = req.query;
      db.SubCategory
        .findOne({
          where: { id: subcategoryId },
          attributes: ["categoryId"]
        })
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

  async getSubChildCategoryList(req, res, next) {
    try {
      const { subcategoryId } = req.query;
      db.SubChildCategory.findAll({
        where: { subcategoryId: subcategoryId },
      })
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

  async getList(req, res, next) {
    try {
      db.SubChildCategory.findAll({
        include: [
          {
            model: db.SubCategory,
            attributes: ["id", "sub_name"],
            include: [{ model: db.category, attributes: ["id", "name"] }],
          },
        ],
      })
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

  async getCategoryById(req, res, next) {
    try {
      let categoryId = req.query.categoryId;
      db.SubChildCategory.findAll({
        where: { categoryId: categoryId },
        include: [
          {
            model: db.SubCategory,
            attributes: ["id", "sub_name"],
            include: [{ model: db.category, attributes: ["id", "name"] }],
          },
        ],
      })
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
      categoriesCollections.findOne({ _id: ObjectId(_id) }).then((data) => {
        if (data) {
          return categoriesCollections.updateOne(
            { _id: ObjectId(data._id) },
            { $set: { categoryName: categoryName, subCategories: JSON.parse(subCategories), image: req.files ? categoryName + "/" + req.files.image.name : "no image" } },
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
  // Sub category list
  async getSubCategory(req, res, next) {
    try {
      db.SubCategory.findAll({
        include: [{ model: db.category, attributes: ["id", "name"] }],
      })
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
  async getSubCatListUpdate(req, res, next) {
    try {
      const { id, sub_name } = req.body;
      db.SubCategory.findOne({ where: { id: id } })
        .then((data) => {
          if (data) {
            return db.SubCategory.update(
              { sub_name: sub_name },
              { where: { id: data.id } }
            );
          }
          throw new RequestError("Sub_Category is not found");
        })
        .then((category) => {
          res
            .status(200)
            .json({ success: true, msg: "Successfully Updated Sub_Category" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getDeletedSubCatList(req, res, next) {
    try {
      db.SubCategory.findOne({ where: { id: parseInt(req.query.id) } })
        .then((list) => {
          if (list) {
            return db.SubCategory.destroy({ where: { id: list.id } });
          }
          throw new RequestError("Id is not found");
        })
        .then((re) => {
          return res.status(200).json({
            msg: "success",
            status: "deleted Sub_Category Seccessfully",
          });
        })
        .catch((err) => {
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

  async getAllCategoryBySlug(req, res, next) {
    try {
      db.category
        .findOne({
          where: { slug: req.query.slug },
          include: [
            {
              model: db.SubCategory,
              include: [{ model: db.SubChildCategory }],
            },
          ],
        })
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

  async filterByCategoryList(req, res, next) {
    var filterdata = []
    try {

      db.affiliate
        .findAll({
          where: { childCategoryId: req.params.id },
        })
        .then((list) => {
          filterdata.push(list)
          // res.status(200).json({ success: true, data: list });
          db.product
            .findAll({
              where: { childCategoryId: req.params.id },
            })
            .then((listproduct) => {
              filterdata.push(listproduct)
              res.status(200).json({ success: true, data: filterdata });
            })
            .catch(function (err) {
              next(err);
            });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getFilterbyCategory(req, res, next) {
    try {
      let { id, name } = req.body;
      db.SubCategory.findOne({
        attributes: ["id", "sub_name"],
        where: { id: id, sub_name: name },
        include: [{ model: db.SubChildCategory }],
      })
        .then((product) => {
          res.status(200).json({ success: true, data: product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getProductBySubcategory(req, res, next) {
    try {
      let { id, name } = req.body;
      let search = "%%";
      if (name) {
        search = "%" + name + "%";
      }
      const listData = [];
      db.SubCategory.findAll({
        attributes: ["id", "sub_name"],
        include: [
          {
            model: db.affiliate,
            order: [["createdAt", "DESC"]],
            required: true,
            where: {
              [Op.or]: [{ name: { [Op.like]: search }, subCategoryId: id }],
            },
          },
        ],
      })
        .then((product) => {
          const pdata = product
          for (let productData in pdata) {
            if (pdata[productData].affiliates) {
              const affiliate = pdata[productData].affiliates
              for (let file in affiliate) {
                listData.push(affiliate[file])
              }
            }
          }
        })
      db.SubCategory.findAll({
        attributes: ["id", "sub_name"],
        include: [
          {
            model: db.product,
            order: [["createdAt", "DESC"]],
            required: true,
            where: {
              [Op.or]: [{ name: { [Op.like]: search }, subCategoryId: id }],
            },
          },
        ],
      })
        .then((product) => {
          const pdata = product
          for (let productData in pdata) {
            if (pdata[productData]) {
              const product = pdata[productData].products
              for (let file in product) {
                listData.push(product[file])
              }
            }
          }
          res.status(200).json({ success: true, data: listData });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  //mobile
  async getAllMobileCategory(req, res, next) {
    try {
      db.category
        .findAll({
          attributes: ["id", "name"],
          include: [
            {
              model: db.SubCategory,
              include: [{ model: db.SubChildCategory }],
            },
          ],
        })
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

  async getAllSubCategoryById(req, res, next) {
    try {
      db.product
        .findAll({
          where: { subCategoryId: req.body.subId },
        })
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
};
