const { db } = require("../../../models");
const { queue } = require("../../../kue");
const config = require("../../../config").data;
const AWS = require("aws-sdk");
const { Op } = require("sequelize");
const { upload_files } = require("../../../photosave");
const MultiPhotos = require("../../../multiphoto");
const { ObjectId } = require("mongodb");

const s3 = new AWS.S3({
  accessKeyId: config.app.AWS_ACCESS_KEY,
  secretAccessKey: config.app.AWS_SECRET_KEY,
});

const dbs = config.db.dbs;
const productsCollection = dbs.collection("products");

var deleteFileFromS3 = async (imgUrl) => {
  try {
    const lastItem = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
    var params = {
      Bucket: "photoabhi",
      Key: lastItem,
    };
    s3.deleteObject(params, (error, data) => {
      if (error) {
        console.log(error, error.stack);
      }
      return data;
    });
  } catch (error) {
    assert.isNotOk(error, "Promise error");
    done();
  }
};

module.exports = {
  /* Add user api start here................................*/

  async addProduct(req, res, next) {
    try {
      const {
        name,
        category,
        discount,
        net,
        price,
        subCategory,
        image,
        tags,
        desc,

      } = req.body;
      productsCollection
        .findOne({
          category: category,
          subCategory: subCategory,
          name: name,
        })
        .then((product) => {
          if (!product) {
            return productsCollection.insertOne({
              name: name,
              category: category,
              subCategory: subCategory,
              status: "in stock",
              net: net,
              ratings: 0,
              desc: desc,
              purchases: 0,
              price: price,
              tags: JSON.parse(tags),
              discount: discount,
              date: new Date(),
              image: req.files
                ?
                category +
                "/" +
                subCategory +
                "/" +
                req.files.image.name
                : "no image",

            });
          }
          throw new RequestError("Already exist product", 409);
        })
        .then((product) => {
          if (req.files) {
            upload_files(req, function (err, result) {
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
    } catch (err) {
      throw new RequestError("Error");
    }
  },


  async addWishlist(req, res, next) {
    try {
      const { productId } = req.body;
      db.SavedProduct
        .findOne({
          where: {
            productId: productId,
            customersId: req.user.id,
          },
        })
        .then((product) => {
          if (!product) {
            return db.SavedProduct.create({
              productId: productId,
              customersId: req.user.id,
            });
          }
          throw new RequestError("Already exist product", 409);
        })
        .then((product) => {
          res
            .status(200)
            .json({ success: true, msg: "Successfully Save Wishlist" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async index(req, res, next) {
    try {
      const { supplierId, categoryId, subCategoryId } = req.query;
      db.product
        .findAll({
          order: [["createdAt", "DESC"]],
          where: {
            supplierId: supplierId,
            categoryId: categoryId,
            subCategoryId: subCategoryId,
          },
        })
        .then((product) => {
          res.status(200).json({ success: true, product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllProductList(req, res, next) {
    try {
      productsCollection.find()
        .sort({ date: -1 })
        .toArray()
        .then((product) => {
          res.status(200).json({ success: true, product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async update(req, res, next) {
    try {
      const {
        productId,
        category,
        subCategory,
        name,
        discount,
        net,
        price,
        image,
        tags,
        desc,
        status
      } = req.body;
      productsCollection
        .findOne({ _id: ObjectId(productId) })
        .then((product) => {
          if (product) {
            return productsCollection.updateOne(
              { _id: ObjectId(product._id) },
              {
                $set: {
                  category: category, subCategory: subCategory, name: name, discount: discount, net: net, price: price, tags: JSON.parse(tags), desc: desc,
                  image: req.files ? category + "/" + subCategory + "/" + req.files.image.name : product.image,
                  status: status
                }
              },
              { upsert: true }
            );
          }
          throw new RequestError("Not Found Product", 409);
        })
        .then((p) => {
          if (req.files) {
            upload_files(req, function (err, result) {
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
          // res.status(200).json({ success: true, msg: "Updated Successfully" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getProductListByCategory(req, res, next) {
    try {
      db.product
        .findAll({
          order: [["createdAt", "DESC"]],
          where: {
            categoryId: req.query.categoryId,
            subCategoryId: req.query.subCategoryId,
          },
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
  async getProductListById(req, res, next) {
    try {
      productsCollection
        .find({ _id: ObjectId(req.query.id) })
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

  async addProductOffer(req, res, next) {
    try {
      const { productId, qty, discount_per, discount_price, total, net_price } =
        req.body;
      db.ProductOffer.findOne({ where: { id: productId } })
        .then((list) => {
          if (!list) {
            return db.ProductOffer.create({
              productId: productId,
              image: req.file ? req.file.location : "",
              qty: qty,
              discount_per: discount_per,
              discount_price: discount_price,
              total: total,
              net_price: net_price,
            });
          } else {
            return db.ProductOffer.update(
              {
                qty: qty,
                discount_per: discount_per,
                discount_price: discount_price,
                total: total,
                net_price: net_price,
              },
              { where: { id: list.id } }
            );
          }
        })
        .then((p) => {
          res.status(200).json({ success: true, msg: "Successfully" });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getProductOffer(req, res, next) {
    try {
      db.ProductOffer.findAll({
        include: [
          {
            model: db.product,
            attributes: [
              "id",
              "categoryId",
              "price",
              "item_name",
              "description",
              "brand",
            ],
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

  async searchProductBySubCat(req, res, next) {
    try {
      db.SubCategory.findOne({
        where: { sub_name: req.body.subCat },
      })
        .then((data) => {
          if (data) {
            return db.product.findAll({
              where: { subCategoryId: data.id },
            });
          }
        })
        .then((list) => {
          res.status(200).json({ success: true, data: list });
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async productDelete(req, res, next) {

    productsCollection
      .findOne({ _id: ObjectId(req.query.id) })
      .then((product) => {
        if (product) {
          return productsCollection.deleteOne({ _id: ObjectId(product._id) });
        }
        throw new RequestError("Product is not found");
      })
      .then((re) => {
        return res.status(200).json({ status: "deleted Product Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },


  async productOfferDelete(req, res, next) {
    db.ProductOffer.findOne({ where: { id: parseInt(req.params.id) } })
      .then((product) => {
        if (product) {
          return db.ProductOffer.destroy({ where: { id: product.id } });
        }
        throw new RequestError("Product is not found");
      })
      .then((re) => {
        return res.status(200).json({ status: "deleted Product Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },

  async multiplePhotoUpload(req, res, next) {
    let attachmentEntries = [];
    var productId = req.body.productId;
    if (!(req.files.file.length === undefined)) {
      for (var i = 0; i < req.files.file.length; i++) {
        attachmentEntries.push({
          productId: productId,
          name: req.files.file[i].name,
          file: req.files.file[i],
          imgUrl: productId + "/" + req.files.file[i].name,
        });
        // console.log(attachmentEntries)
      }
    } else {
      attachmentEntries = [{
        productId: productId,
        name: req.files.file.name,
        file: req.files.file,
        imgUrl: productId + "/" + req.files.file.name,
      }]
    }

    // console.log(attachmentEntries)
    db.product
      .findOne({
        where: { id: productId },
      })
      .then((r) => {
        if (r) {
          return db.productphoto
            .bulkCreate(
              attachmentEntries
            )
            .then((response) => {
              MultiPhotos.Multi_Photos(attachmentEntries, function (err, result) {
                if (err) {
                  res.send(err);
                }
              })
            })
        }
        throw new RequestError("ProductId is not found");
      })
      .then((r) => {
        res.status(200).json({
          success: true,
          msg: "Successfully inserted product",
        });
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).json({ errors: ["Error insert photo"] });
      });
  },

  async getAllPhoto(req, res, next) {
    try {
      db.product
        .findAll({
          order: [["createdAt", "DESC"]],
          attributes: ["id", "name", "brand"],
          include: [{ model: db.productphoto, attributes: ["id", "imgUrl"] }],
        })
        .then((data) => {
          res.status(200).json({ success: true, data });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllPhotobyid(req, res, next) {
    try {
      db.productphoto
        .findAll({
          order: [["createdAt", "DESC"]],
          where: { productId: parseInt(req.query.id) },
          attributes: ["id", "imgUrl"],
        })
        .then((data) => {
          res.status(200).json({ success: true, data });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },
  async deleteSliderPhoto(req, res, next) {
    db.productphoto
      .findOne({ where: { id: parseInt(req.query.id) } })
      .then((product) => {
        if (product) {
          return db.productphoto.destroy({ where: { id: req.query.id } });
        }
        throw new RequestError("Product is not found");
      })
      .then((re) => {
        return res.status(200).json({ status: "deleted Product Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },
  //All  product


  async getSavedProduct(req, res, next) {
    try {
      db.customer
        .findOne({
          attributes: ["id"],
          where: { email: req.user.email },
          include: [
            {
              attributes: ["id"],
              model: db.SavedProduct,
              order: [["createdAt", "DESC"]],
              include: [{ model: db.product }],
            },
            {
              attributes: ["id"],
              model: db.SavedAffiliate,
              order: [["createdAt", "DESC"]],
              include: [{ model: db.affiliate }],
            },
          ],
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
}
