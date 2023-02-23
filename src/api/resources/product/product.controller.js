// import { db } from "../../../models";
// import { queue } from "../../../kue";
// import config from "../../../config";
// import AWS from "aws-sdk";

const { db } = require("../../../models");
const { queue } = require("../../../kue");
const config = require("../../../config").data;
const AWS = require("aws-sdk");
const { Op } = require("sequelize");
const { upload_files, uploadAffiliate_files } = require("../../../photosave");
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
              tags: tags,
              discount: discount,
              date: new Date(),
              image: image

            });
          }
          throw new RequestError("Already exist product", 409);
        })
        .then((product) => {
          res.status(200).json({
            success: true,
            msg: "Successfully inserted product",
            id: product.id
          });
          // if (req.files) {
          //   upload_files(req, function (err, result) {
          //     if (err) {
          //       res.send(err);
          //     } else {
          //       res.status(200).json({
          //         success: true,
          //         msg: "Successfully inserted product",
          //         id: product.id
          //       });
          //     }
          //   });
          // } else {
          //   res
          //     .status(200)
          //     .json({ success: true, msg: "Successfully inserted product", id: product.id });
          // }
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
              { $set: { category: category, subCategory: subCategory, name: name, discount: discount, net: net, price: price, tags: tags, desc: desc, image: image, status: status } },
              { upsert: true }
            );
          }
          throw new RequestError("Not Found Product", 409);
        })
        .then((p) => {
          res.status(200).json({ success: true, msg: "Updated Successfully" });
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
      db.product
        .findAll({
          where: { id: req.query.id },
          include: [{ model: db.productphoto, attributes: ["id", "imgUrl"] }],
          order: [["createdAt", "DESC"]],
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
              //   {
              //   productId: productId,
              //   productName: r.item_name,
              //   imgUrl: 'path',
              //   // imgUrl: JSON.stringify(attachmentEntries),
              // }
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
  // async getAllPhoto(req, res, next) {
  //   try {
  //     var condition = { [Op.or]: [{ LastName: { [Op.eq]: "Doe" }, }, { FirstName: { [Op.or]: ["John", "Jane"] } }, { Age: { [Op.gt]: 18 } }] }
  //     db.user
  //       .findOne({
  //         attributes: ["id"],
  //         where: { id: req.body.id },
  //         include: [{ model: db.domain, where: { [Op.and]: [{ createdAt: { [Op.lt]: req.body.startdate } }, { createdAt: { [Op.gt]: req.body.enddate } }] } }],
  //       })
  //       .then((data) => {
  //         res.status(200).json({ success: true, data });
  //       })
  //       .catch(function (err) {
  //         next(err);
  //       });
  //   } catch (err) {
  //     throw new RequestError("Error");
  //   }
  // },

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


  async getCustomerProduct(req, res, next) {
    try {
      db.customer
        .findOne({
          attributes: ["id"],
          where: { email: req.user.email },
          include: [
            {
              model: db.product,
              order: [["id", "DESC"]],

            },
            {
              model: db.affiliate,
              order: [["id", "DESC"]],

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
  async getAllGrocerryStaples(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "Vechicle" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllVechicle(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "Vechicle" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllElectronics(req, res, next) {

    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "Electronics-Device" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllFashion(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "Fashion" },

          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllHealthandbeauty(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "care product" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllSport(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "sport goods" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllHome(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "Home appliance" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllKids(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "Kids product" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllAutoparts(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "spare part and Gadget" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllVideogames(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: "Games" },
          include: [
            {
              model: db.product,
              where: { status: "active" },
              order: [["createdAt", "DESC"]],
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  async getAllProductBySlug(req, res, next) {
    try {
      db.category
        .findOne({
          attributes: ["id", "slug"],
          where: { slug: req.params.slug },
          include: [
            {
              model: db.product,
              order: [["createdAt", "DESC"]],
              where: { status: "active" },
              include: [
                { model: db.productphoto, attributes: ["id", "imgUrl"] },
              ],
            },
            {
              model: db.affiliate,
              // where: { status: "active" },
              order: ["createdAt", "DESC"],

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

  // filter product

  async getFilterbyProduct(req, res, next) {
    try {
      let search = "%%";
      if (req.query.search) {
        search = "%" + req.query.search + "%";
      }
      const listData = [];
      const catagorylist = []
      db.SubCategory.findAll({
        attributes: ["id", "sub_name"],
        include: [

          {
            model: db.affiliate,
            order: [["createdAt", "DESC"]],
            required: true,
            where: {
              [Op.and]: [
                { name: { [Op.like]: search }, status: "active" },
              ],
            },
          },
        ],
      })
        .then((product) => {

          const pdata = product
          for (let productData in pdata) {
            catagorylist.push(pdata[productData])
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
              [Op.and]: [{
                [Op.or]: [
                  { name: { [Op.like]: search }, slug: { [Op.like]: search } },
                ], status: "active"
              }],
            },
          },

        ],
      })
        .then((product) => {

          const pdata = product
          for (let productData in pdata) {
            if (pdata[productData]) {
              catagorylist.push(pdata[productData])
              const product = pdata[productData].products
              for (let file in product) {
                listData.push(product[file])
              }
            }
          }
          res.status(200).json({ success: true, data: product, listData: listData, catagorylist: catagorylist });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },
  // async SearchFile(req, res, next) {
  //   var obj = {
  //     data1: '',
  //     data2: '',
  //     data3: '',
  //     data4: '',
  //     data5: '',
  //   }
  //   try {
  //     let search = "%%";
  //     if (req.body.search) {
  //       search = "%" + req.body.search + "%";
  //     }
  //     switch (req.body.searchtable) {
  //       case 1:
  //         db.SubCategory.findAll({
  //           attributes: ["id", "sub_name"],
  //           include: [
  //             {
  //               model: db.product,
  //               order: [["createdAt", "DESC"]],
  //               required: true,
  //               where: {
  //                 [Op.or]: [
  //                   { name: { [Op.like]: search }, slug: { [Op.like]: search } },
  //                 ],
  //               },
  //             },
  //           ],
  //         }).then((product) => {
  //           // console.log(product)
  //           obj.data1 = product;

  //           //   res.status(200).json({ success: true, data: product });
  //         })
  //           .catch(function (err) {
  //             next(err);
  //           });
  //       case 2:
  //         db.SubCategory.findAll({
  //           attributes: ["id", "sub_name"],
  //           include: [
  //             {
  //               model: db.product,
  //               order: [["createdAt", "DESC"]],
  //               required: true,
  //               where: {
  //                 [Op.or]: [
  //                   { name: { [Op.like]: search }, slug: { [Op.like]: search } },
  //                 ],
  //               },
  //             },
  //           ],
  //         }).then((product) => {
  //           obj.data2 = product;
  //           //   res.status(200).json({ success: true, data: product });
  //         })
  //           .catch(function (err) {
  //             next(err);
  //           });
  //       case 3:
  //         db.SubCategory.findAll({
  //           attributes: ["id", "sub_name"],
  //           include: [
  //             {
  //               model: db.product,
  //               order: [["createdAt", "DESC"]],
  //               required: true,
  //               where: {
  //                 [Op.or]: [
  //                   { name: { [Op.like]: search }, slug: { [Op.like]: search } },
  //                 ],
  //               },
  //             },
  //           ],
  //         }).then((product) => {
  //           obj.data3 = product;
  //           //   res.status(200).json({ success: true, data: product });
  //         })
  //           .catch(function (err) {
  //             next(err);
  //           });
  //       case 4:
  //         db.SubCategory.findAll({
  //           attributes: ["id", "sub_name"],
  //           include: [
  //             {
  //               model: db.product,
  //               order: [["createdAt", "DESC"]],
  //               required: true,
  //               where: {
  //                 [Op.or]: [
  //                   { name: { [Op.like]: search }, slug: { [Op.like]: search } },
  //                 ],
  //               },
  //             },
  //           ],
  //         }).then((product) => {
  //           obj.data4 = product;
  //           //   res.status(200).json({ success: true, data: product });
  //         })
  //           .catch(function (err) {
  //             next(err);
  //           });
  //       case 5:
  //         db.SubCategory.findAll({
  //           attributes: ["id", "sub_name"],
  //           include: [
  //             {
  //               model: db.product,
  //               order: [["createdAt", "DESC"]],
  //               required: true,
  //               where: {
  //                 [Op.or]: [
  //                   { name: { [Op.like]: search }, slug: { [Op.like]: search } },
  //                 ],
  //               },
  //             },
  //           ],
  //         }).then((product) => {
  //           obj.data5 = product;
  //           // console.log(obj)
  //           res.status(200).json({ success: true, data: obj });
  //         })
  //           .catch(function (err) {
  //             next(err);
  //           });
  //       default:
  //         console.log(`This is the search key word ${req.body.search}.`);

  //     }


  //   } catch (err) {
  //     throw new RequestError("Error");
  //   }
  // },
  async GetAllByCategory(req, res, next) {
    try {
      db.SubCategory.findOne({
        where: { sub_name: req.body.name },
        include: [
          {
            model: db.SubChildCategory,
            include: [
              {
                model: db.product,
                order: [["createdAt", "DESC"]],
                include: [
                  { model: db.productphoto, attributes: ["id", "imgUrl"] },
                ],
              },
            ],
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

  // aws image delete
  async awsProductPhotoDelete(req, res, next) {
    try {
      const { id, imgUrl } = req.body;
      deleteFileFromS3(imgUrl)
        .then((data) => {
          if (!data) {
            return db.productphoto.destroy({ where: { id: id } });
          }
          throw new RequestError("error");
        })
        .then((success) => {
          res.status(200).json({
            success: true,
            msg: "Successflly deleted image from s3 Bucket",
          });
        });
    } catch (err) {
      next(err);
      // res.status(500).json({ 'success':false, msg: err})
    }
  },

  async customerProductPhotoDelete(req, res, next) {
    try {
      const { id, imgUrl } = req.body;
      db.productphoto
        .findOne({ where: { id: parseInt(id) } })
        .then((product) => {
          MultiPhotos.deleteSliderPhoto(imgUrl, function (err, result) {
            if (err) {
              res.send(err);
            }
            return db.productphoto.destroy({ where: { id: id } });
          })
        })
        .then((success) => {
          res.status(200).json({
            success: true,
            msg: "Successflly deleted image from store",
          });
        });
    } catch (err) {
      next(err);
      // res.status(500).json({ 'success':false, msg: err})
    }
  },


  async getProductSubChildCat(req, res, next) {
    try {
      const { subCategoryId, childCategoryId } = req.body;
      db.product
        .findAll({
          where: {
            childCategoryId: childCategoryId,
            subCategoryId: childCategoryId,
          },
        })
        .then((product) => {
          res.status(200).json({ success: true, data: product });
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      next(err);
      // res.status(500).json({ 'success':false, msg: err})
    }
  },
};
