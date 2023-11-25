const config = require("../../../config").data;
const { upload_files } = require("../../../photosave");
const MultiPhotos = require("../../../multiphoto");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const productsCollection = dbs.collection("products");


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
    // db.product
    //   .findOne({
    //     where: { id: productId },
    //   })
    //   .then((r) => {
    //     if (r) {
    //       return db.productphoto
    //         .bulkCreate(
    //           attachmentEntries
    //         )
    //         .then((response) => {
    //           MultiPhotos.Multi_Photos(attachmentEntries, function (err, result) {
    //             if (err) {
    //               res.send(err);
    //             }
    //           })
    //         })
    //     }
    //     throw new RequestError("ProductId is not found");
    //   })
    //   .then((r) => {
    //     res.status(200).json({
    //       success: true,
    //       msg: "Successfully inserted product",
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     res.status(500).json({ errors: ["Error insert photo"] });
    //   });
  },
  //All  product


}
