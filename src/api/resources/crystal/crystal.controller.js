const config = require("../../../config").data;
const { uploadCrystal_files } = require("../../../photosave");
const MultiPhotos = require("../../../multiphoto");
const { ObjectId } = require("mongodb");

const dbs = config.db.dbs;
const crystalsCollection = dbs.collection("crystals");


module.exports = {
  /* Add user api start here................................*/

  async addcrystal(req, res, next) {
    try {
      const {
        name,
        discount,
        net,
        price,
        image,
        tags,
        desc,

      } = req.body;
      crystalsCollection
        .findOne({
          name: name,
        })
        .then((crystal) => {
          if (!crystal) {
            return crystalsCollection.insertOne({
              name: name,
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
                req.files.image.name
                : "no image",

            });
          }
          throw new RequestError("Already exist crystal", 409);
        })
        .then((crystal) => {
          if (req.files) {
            uploadCrystal_files(req, function (err, result) {
              if (err) {
                res.send(err);
              } else {
                res.status(200).json({
                  success: true,
                  msg: "Successfully inserted crystal",
                });
              }
            });
          } else {
            res
              .status(200)
              .json({ success: true, msg: "Successfully inserted crystal" });
          }
        })
        .catch(function (err) {
          next(err);
        });
    } catch (err) {
      throw new RequestError("Error");
    }
  },

  async getAllcrystalList(req, res, next) {
    try {
      crystalsCollection.find()
        .sort({ date: -1 })
        .toArray()
        .then((crystal) => {
          res.status(200).json({ success: true, crystal });
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
        crystalId,
        name,
        discount,
        net,
        price,
        image,
        tags,
        desc,
        status
      } = req.body;
      crystalsCollection
        .findOne({ _id: ObjectId(crystalId) })
        .then((crystal) => {
          if (crystal) {
            return crystalsCollection.updateOne(
              { _id: ObjectId(crystal._id) },
              {
                $set: {
                  name: name, discount: discount, net: net, price: price, tags: JSON.parse(tags), desc: desc,
                  image: req.files ? req.files.image.name : crystal.image,
                  status: status
                }
              },
              { upsert: true }
            );
          }
          throw new RequestError("Not Found crystal", 409);
        })
        .then((p) => {
          if (req.files) {
            uploadCrystal_files(req, function (err, result) {
              if (err) {
                res.send(err);
              } else {
                res.status(200).json({
                  success: true,
                  msg: "Successfully inserted crystal",
                });
              }
            });
          } else {
            res
              .status(200)
              .json({ success: true, msg: "Successfully inserted crystal" });
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
  async getcrystalListById(req, res, next) {
    try {
      crystalsCollection
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

  async crystalDelete(req, res, next) {
    crystalsCollection
      .findOne({ _id: ObjectId(req.query.id) })
      .then((crystal) => {
        if (crystal) {
          return crystalsCollection.deleteOne({ _id: ObjectId(crystal._id) });
        }
        throw new RequestError("crystal is not found");
      })
      .then((re) => {
        return res.status(200).json({ status: "deleted crystal Seccessfully" });
      })
      .catch((err) => {
        next(err);
      });
  },

  async multiplePhotoUpload(req, res, next) {
    let attachmentEntries = [];
    var crystalId = req.body.crystalId;
    if (!(req.files.file.length === undefined)) {
      for (var i = 0; i < req.files.file.length; i++) {
        attachmentEntries.push({
          crystalId: crystalId,
          name: req.files.file[i].name,
          file: req.files.file[i],
          imgUrl: crystalId + "/" + req.files.file[i].name,
        });
        // console.log(attachmentEntries)
      }
    } else {
      attachmentEntries = [{
        crystalId: crystalId,
        name: req.files.file.name,
        file: req.files.file,
        imgUrl: crystalId + "/" + req.files.file.name,
      }]
    }

    // console.log(attachmentEntries)
    // db.crystal
    //   .findOne({
    //     where: { id: crystalId },
    //   })
    //   .then((r) => {
    //     if (r) {
    //       return db.crystalphoto
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
    //     throw new RequestError("crystalId is not found");
    //   })
    //   .then((r) => {
    //     res.status(200).json({
    //       success: true,
    //       msg: "Successfully inserted crystal",
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     res.status(500).json({ errors: ["Error insert photo"] });
    //   });
  },
  //All  crystal


}
