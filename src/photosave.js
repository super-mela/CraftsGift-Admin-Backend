const fs = require("fs");

var baseurl = process.env.PRODUCT_PATH;
var affiliateurl = process.env.AFFILLIATE_PATH;

var upload_files = function (req, res) {
  if (req.files) {
    const { categoryId, subCategoryId, childCategoryId } = req.body;
    const file = req.files.photo;
    //console.log("request: " + req.files.file.mimetype);
    const RawfileType = req.files.photo.mimetype;
    const fileType = RawfileType.split("/")[1];
    fs.access(
      baseurl + "/" + categoryId + "/" + subCategoryId + "/" + childCategoryId,
      (error) => {
        if (error) {
          fs.mkdir(
            baseurl +
            "/" +
            categoryId +
            "/" +
            subCategoryId +
            "/" +
            childCategoryId,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }

                file.mv(
                  `${baseurl}/${categoryId}/${subCategoryId}/${childCategoryId}/${file.nam}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                      //   return res.status(500).send(err);
                    }
                    res(null, {
                      success: true,
                      msg: "Successfully inserted product",
                    });
                    // res.json({
                    //   filename: file.name,
                    //   filepath: ` /uploads/${file.name}`,
                    // });
                  }
                );

                console.log(" directory successfully created.", baseurl);
              }
            }
          );
        } else {
          if (
            fs.existsSync(
              baseurl +
              "/" +
              categoryId +
              "/" +
              subCategoryId +
              "/" +
              childCategoryId
            )
          ) {
            //const file = req.files.file;
            file.mv(
              `${baseurl}/${categoryId}/${subCategoryId}/${childCategoryId}/${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                  //   return res.status(500).send(err);
                }
                res(null, {
                  success: true,
                  msg: "Successfully inserted product",
                });
              }
            );
          }
        }
      }
    );
  }
};

var uploadAffiliate_files = function (req, res) {
  if (req.files) {
    const { categoryId, subCategoryId, childCategoryId } = req.body;
    const file = req.files.photo;
    //console.log("request: " + req.files.file.mimetype);
    const RawfileType = req.files.photo.mimetype;
    const fileType = RawfileType.split("/")[1];
    fs.access(
      affiliateurl + "/" + categoryId + "/" + subCategoryId + "/" + childCategoryId,
      (error) => {
        if (error) {
          fs.mkdir(
            affiliateurl +
            "/" +
            categoryId +
            "/" +
            subCategoryId +
            "/" +
            childCategoryId,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }
                file.mv(
                  `${affiliateurl}/${categoryId}/${subCategoryId}/${childCategoryId}/${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                      //   return res.status(500).send(err);
                    }
                    res(null, {
                      success: true,
                      msg: "Successfully inserted product",
                    });
                    // res.json({
                    //   filename: file.name,
                    //   filepath: ` /uploads/${file.name}`,
                    // });
                  }
                );

                console.log(" directory successfully created.", affiliateurl);
              }
            }
          );
        } else {
          if (
            fs.existsSync(
              affiliateurl +
              "/" +
              categoryId +
              "/" +
              subCategoryId +
              "/" +
              childCategoryId
            )
          ) {
            //const file = req.files.file;
            file.mv(
              `${affiliateurl}/${categoryId}/${subCategoryId}/${childCategoryId}/${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                  //   return res.status(500).send(err);
                }
                res(null, {
                  success: true,
                  msg: "Successfully inserted product",
                });
              }
            );
          }
        }
      }
    );
  }
};
module.exports = { upload_files, uploadAffiliate_files };
