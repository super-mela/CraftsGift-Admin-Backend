const fs = require("fs");

var baseurl = process.env.PROFILE_PATH;

var upload_profile_files = function (req, res) {
  if (req.files) {
    const { id, name } = req.body;
    const file = req.files.photo;
    //console.log("request: " + req.files.file.mimetype);
    const RawfileType = req.files.photo.mimetype;
    const fileType = RawfileType.split("/")[1];
    fs.access(baseurl, (error) => {
      if (error) {
        fs.mkdir(baseurl, { recursive: true }, function (err) {
          if (err) {
          } else {
            if (req.files === null) {
              return res.status(400).json({ msg: "no file Uploaded" });
            }
            file.mv(
              `${baseurl}/${id + "_" + name + "." + fileType}`,
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

            console.log(" directory successfully created.", baseurl);
          }
        }
        );
      } else {
        if (
          fs.existsSync(baseurl)
        ) {
          //const file = req.files.file;
          file.mv(
            `${baseurl}/${id + "_" + name + "." + fileType}`,
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
module.exports = upload_profile_files;
