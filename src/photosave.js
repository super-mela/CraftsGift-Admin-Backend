const fs = require("fs");

var baseurl = __dirname + '/photo/product';
var baseurlcategory = __dirname + '/photo/category';

console.log(baseurl)

var upload_files = function (req, res) {
  if (req.files) {
    const { category, subCategory } = req.body;
    const file = req.files.image;
    fs.access(
      baseurl + "/" + category + "/" + subCategory + "/",
      (error) => {
        if (error) {
          fs.mkdir(
            baseurl +
            "/" +
            category +
            "/" +
            subCategory,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }

                file.mv(
                  `${baseurl}/${category}/${subCategory}/${file.name}`,
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
              category +
              "/" +
              subCategory,
            )
          ) {
            //const file = req.files.file;
            file.mv(
              `${baseurl}/${category}/${subCategory}/${file.name}`,
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

var upload_category_files = function (req, res) {
  if (req.files) {
    const { categoryName } = req.body;
    const file = req.files.image;
    fs.access(
      baseurlcategory + "/" + categoryName + "/",
      (error) => {
        if (error) {
          fs.mkdir(
            baseurlcategory +
            "/" +
            categoryName,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }
                file.mv(
                  `${baseurlcategory}/${categoryName}/${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
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

                console.log(" directory successfully created.", baseurlcategory);
              }
            }
          );
        } else {
          if (
            fs.existsSync(
              baseurlcategory +
              "/" +
              categoryName,
            )
          ) {
            //const file = req.files.file;
            file.mv(
              `${baseurlcategory}/${categoryName}/${file.name}`,
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

module.exports = { upload_files, upload_category_files };
