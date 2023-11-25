const fs = require("fs");
var baseurl = process.env.MULTI_PRODUCT_PATH;

var Multi_Photos = function (req, res) {
  if (req) {

    for (var i = 0; i < req.length; i++) {

      const file = req[i].file;
      const productId = req[i].productId
      const imgUrl = req[i].imgUrl
      //console.log("request: " + req.files.file.mimetype);
      // const RawfileType = req.files.photo.mimetype;
      // const fileType = RawfileType.split("/")[1];
      fs.access(
        baseurl + "/" + productId,
        (error) => {
          if (error) {
            fs.mkdir(
              baseurl + "/" + productId, { recursive: true }, function (err) {
                if (err) {
                } else {
                  if (req.files === null) {
                    return res.status(400).json({ msg: "no file Uploaded" });
                  }

                  file.mv(
                    `${baseurl}/${imgUrl}`,
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
            if (fs.existsSync(baseurl + "/" + productId)) {
              //const file = req.files.file;
              file.mv(
                `${baseurl}/${imgUrl}`,
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
  }
};

var Delete_Multi_Photos = function (req, res) {
  if (req) {
    const productId = req
    fs.access(
      baseurl + "/" + productId,
      (error) => {
        if (error) {
          return res(null, { success: true, msg: "No File Found" });
        } else {
          if (fs.existsSync(baseurl + "/" + productId)) {
            fs.unlink(`${baseurl}/${productId}`, (err) => {
              if (err) {
                console.error(err);
                //   return res.status(500).send(err);
              }
              res(null, {
                success: true,
                msg: "Successfully Removed Data",
              });
            }
            );
          }
        }
      }
    );
  }
};
var deleteSliderPhoto = function (req, res, next) {
  if (req) {
    const imgUrl = req
    fs.access(baseurl + "/" + imgUrl, (error) => {
      if (error) {
        // return error;
        res(null, { success: true, msg: "No File Found" });
      } else {
        if (fs.existsSync(baseurl + "/" + imgUrl)) {
          fs.unlink(`${baseurl}/${imgUrl}`, (err) => {
            if (err) {
              console.error(err);
              //   return res.status(500).send(err);
            } else {
              res(null, {
                success: true,
                msg: "Successfully Removed Data",
              });
            }
          }
          );
        }
      }
    }
    );
  }
};
module.exports = { Multi_Photos, Delete_Multi_Photos, deleteSliderPhoto };
// module.exports = Delete_Multi_Photos;
