const fs = require("fs");
const compress_images = require("compress-images");

var baseurl = __dirname + '/photo/product/';
var baseurlcategory = __dirname + '/photo/category';
var baseurloffer = __dirname + '/photo/offer/';
var baseurlcustomOrder = __dirname + '/photo/customOrder/';
var baseurlprofile = __dirname + '/photo/profile/';
var baseurlaboutus = __dirname + '/photo/aboutus';
var tempFilePath = `${__dirname}/temp/`;
const compression = 80
const options = {
  compress_force: false,
  statistic: true,
  autoupdate: true,
};

var upload_files = function (req, res) {
  if (req.files) {
    const { category, subCategory } = req.body;
    const file = req.files.image;
    const outFilePath = `${baseurl}/${category}/${subCategory}/`;
    fs.access(tempFilePath,
      (error) => {
        if (error) {
          fs.mkdir(tempFilePath,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }
                file.mv(`${tempFilePath}${file.name}`, (err) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                  compress_images(tempFilePath + file.name, outFilePath, options, false,
                    { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                    { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                    { svg: { engine: "svgo", command: "--multipass" } },
                    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                    // { webp: { engine: "webp", command: ["-q", compression] } }
                    , async function (err, completed) {
                      if (err) {
                        console.error(err);
                        res.status(500).send("Error compressing image");
                        return;
                      }
                      if (completed) {

                        fs.unlink(tempFilePath + file.name, function (error) {
                          if (error) throw error
                        })
                        console.log("Image compressed successfully!");
                        res(null, {
                          success: true,
                          msg: "Successfully inserted product",
                          url: file.name,
                        });

                      }
                    });
                }
                );
                console.log(" directory successfully created.", baseurl);
              }
            }
          );
        } else {
          if (
            fs.existsSync(tempFilePath)) {
            file.mv(`${tempFilePath}${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
                compress_images(tempFilePath + file.name, outFilePath, options, false,
                  { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                  { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                  { svg: { engine: "svgo", command: "--multipass" } },
                  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                  // { webp: { engine: "webp", command: ["-q", compression] } }
                  , async function (err, completed) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("Error compressing image");
                      return;
                    }
                    if (completed) {

                      fs.unlink(tempFilePath + file.name, function (error) {
                        if (error) throw error
                      })
                      console.log("Image compressed successfully!");
                      res(null, {
                        success: true,
                        msg: "Successfully inserted product",
                        url: file.name,
                      });
                    }
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
    const outFilePath = baseurlcategory + "/" + categoryName + "/";
    fs.access(tempFilePath,
      (error) => {
        if (error) {
          fs.mkdir(
            tempFilePath,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }
                file.mv(
                  `${tempFilePath}${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                    }
                    compress_images(tempFilePath + file.name, outFilePath, options, false,
                      { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                      { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                      { svg: { engine: "svgo", command: "--multipass" } },
                      { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                      // { webp: { engine: "webp", command: ["-q", compression] } }
                      , async function (err, completed) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error compressing image");
                          return;
                        }
                        if (completed) {

                          fs.unlink(tempFilePath + file.name, function (error) {
                            if (error) throw error
                          })
                          console.log("Image compressed successfully!");
                          res(null, {
                            success: true,
                            msg: "Successfully inserted product",
                            url: file.name,
                          });

                        }
                      });
                  }
                );

                console.log(" directory successfully created.", baseurlcategory);
              }
            }
          );
        } else {
          if (
            fs.existsSync(tempFilePath)) {
            file.mv(
              `${tempFilePath}${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                  //   return res.status(500).send(err);
                }
                compress_images(tempFilePath + file.name, outFilePath, options, false,
                  { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                  { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                  { svg: { engine: "svgo", command: "--multipass" } },
                  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                  // { webp: { engine: "webp", command: ["-q", compression] } }
                  , async function (err, completed) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("Error compressing image");
                      return;
                    }
                    if (completed) {

                      fs.unlink(tempFilePath + file.name, function (error) {
                        if (error) throw error
                      })
                      console.log("Image compressed successfully!");
                      res(null, {
                        success: true,
                        msg: "Successfully inserted product",
                        url: file.name,
                      });

                    }
                  });
              }
            );
          }
        }
      }
    );
  }
};

var upload_offer_files = function (req, res) {
  if (req.files) {
    const file = req.files.image;
    fs.access(tempFilePath,
      (error) => {
        if (error) {
          fs.mkdir(tempFilePath,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }
                file.mv(`${tempFilePath}/${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                    }
                    compress_images(tempFilePath + file.name, baseurloffer, options, false,
                      { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                      { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                      { svg: { engine: "svgo", command: "--multipass" } },
                      { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                      // { webp: { engine: "webp", command: ["-q", compression] } }
                      , async function (err, completed) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error compressing image");
                          return;
                        }
                        if (completed) {

                          fs.unlink(tempFilePath + file.name, function (error) {
                            if (error) throw error
                          })
                          console.log("Image compressed successfully!");
                          res(null, {
                            success: true,
                            msg: "Successfully inserted product",
                            url: file.name,
                          });

                        }
                      });
                  }
                );
              }
            }
          );
        } else {
          if (
            fs.existsSync(tempFilePath)) {
            file.mv(`${tempFilePath}/${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
                compress_images(tempFilePath + file.name, baseurloffer, options, false,
                  { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                  { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                  { svg: { engine: "svgo", command: "--multipass" } },
                  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                  // { webp: { engine: "webp", command: ["-q", compression] } }
                  , async function (err, completed) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("Error compressing image");
                      return;
                    }
                    if (completed) {

                      fs.unlink(tempFilePath + file.name, function (error) {
                        if (error) throw error
                      })
                      console.log("Image compressed successfully!");
                      res(null, {
                        success: true,
                        msg: "Successfully inserted product",
                        url: file.name,
                      });

                    }
                  });
              }
            );
          }
        }
      }
    );
  }
};

var upload_customOrder_files = function (req, res) {
  if (req.files) {
    const file = req.files.file;
    fs.access(tempFilePath,
      (error) => {
        if (error) {
          b
          fs.mkdir(tempFilePath,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }
                file.mv(`${tempFilePath}/${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                    }
                    compress_images(tempFilePath + file.name, baseurlcustomOrder, options, false,
                      { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                      { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                      { svg: { engine: "svgo", command: "--multipass" } },
                      { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                      // { webp: { engine: "webp", command: ["-q", compression] } }
                      , async function (err, completed) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error compressing image");
                          return;
                        }
                        if (completed) {

                          fs.unlink(tempFilePath + file.name, function (error) {
                            if (error) throw error
                          })
                          console.log("Image compressed successfully!");
                          res(null, {
                            success: true,
                            msg: "Successfully inserted product",
                            url: file.name,
                          });

                        }
                      });
                  }
                );
              }
            }
          );
        } else {
          if (
            fs.existsSync(tempFilePath)) {
            file.mv(`${tempFilePath}/${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
                compress_images(tempFilePath + file.name, baseurlcustomOrder, options, false,
                  { jpg: { engine: "mozjpeg ", command: ["-quality", compression] } },
                  { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                  { svg: { engine: "svgo", command: "--multipass" } },
                  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                  // { webp: { engine: "webp", command: ["-q", compression] } }
                  , async function (err, completed) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("Error compressing image");
                      return;
                    }
                    if (completed) {

                      fs.unlink(tempFilePath + file.name, function (error) {
                        if (error) throw error
                      })
                      console.log("Image compressed successfully!");
                      res(null, {
                        success: true,
                        msg: "Successfully inserted product",
                        url: file.name,
                      });

                    }
                  });
              }
            );
          }
        }
      }
    );
  }
};

var upload_profile = function (req, res) {
  if (req.files) {
    const file = req.files.file;
    fs.access(tempFilePath,
      (error) => {
        if (error) {
          fs.mkdir(tempFilePath,
            { recursive: true },
            function (err) {
              if (err) {
              } else {
                if (req.files === null) {
                  return res.status(400).json({ msg: "no file Uploaded" });
                }
                file.mv(`${tempFilePath}/${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                    }
                    compress_images(tempFilePath + file.name, baseurlprofile, options, false,
                      { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                      { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                      { svg: { engine: "svgo", command: "--multipass" } },
                      { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                      // { webp: { engine: "webp", command: ["-q", compression] } }
                      , async function (err, completed) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error compressing image");
                          return;
                        }
                        if (completed) {

                          fs.unlink(tempFilePath + file.name, function (error) {
                            if (error) throw error
                          })
                          console.log("Image compressed successfully!");
                          res(null, {
                            success: true,
                            msg: "Successfully inserted product",
                            url: file.name,
                          });

                        }
                      });
                  }
                );
              }
            }
          );
        } else {
          if (
            fs.existsSync(tempFilePath)) {
            file.mv(`${tempFilePath}/${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
                compress_images(tempFilePath + file.name, baseurlprofile, options, false,
                  { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                  { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                  { svg: { engine: "svgo", command: "--multipass" } },
                  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                  // { webp: { engine: "webp", command: ["-q", compression] } }
                  , async function (err, completed) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("Error compressing image");
                      return;
                    }
                    if (completed) {

                      fs.unlink(tempFilePath + file.name, function (error) {
                        if (error) throw error
                      })
                      console.log("Image compressed successfully!");
                      res(null, {
                        success: true,
                        msg: "Successfully inserted product",
                        url: file.name,
                      });

                    }
                  });
              }
            );
          }
        }
      }
    );
  }
};

var upload_Aboutus_files = function (req, res) {
  const founders = JSON.parse(req.body.founders)
  if (req.files) {
    if (req.files.sideimage) {
      const file = req.files.sideimage;
      fs.access(tempFilePath,
        (error) => {
          if (error) {
            fs.mkdir(tempFilePath,
              { recursive: true },
              function (err) {
                if (err) {
                  console.log(err)
                } else {

                  file.mv(`${tempFilePath}/${file.name}`,
                    (err) => {
                      if (err) {
                        console.error(err);
                      }
                      compress_images(tempFilePath + file.name, baseurlaboutus, options, false,
                        { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                        { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                        { svg: { engine: "svgo", command: "--multipass" } },
                        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                        // { webp: { engine: "webp", command: ["-q", compression] } }
                        , async function (err, completed) {
                          if (err) {
                            console.error(err);
                            res.status(500).send("Error compressing image");
                            return;
                          }
                          if (completed) {

                            fs.unlink(tempFilePath + file.name, function (error) {
                              if (error) throw error
                            })
                            console.log("Image compressed successfully!");
                          }
                        });
                    }
                  );
                }
              }
            );
          } else {
            if (
              fs.existsSync(tempFilePath)) {
              file.mv(`${tempFilePath}/${file.name}`,
                (err) => {
                  if (err) {
                    console.error(err);
                  }
                  compress_images(tempFilePath + file.name, baseurlaboutus, options, false,
                    { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                    { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                    { svg: { engine: "svgo", command: "--multipass" } },
                    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                    // { webp: { engine: "webp", command: ["-q", compression] } }
                    , async function (err, completed) {
                      if (err) {
                        console.error(err);
                        res.status(500).send("Error compressing image");
                        return;
                      }
                      if (completed) {

                        fs.unlink(tempFilePath + file.name, function (error) {
                          if (error) throw error
                        })
                        console.log("Image compressed successfully!");
                      }
                    });
                }
              );
            }
          }
        }
      );
    }
  }
  if (req.files.bannerimage) {
    const file = req.files.bannerimage;
    fs.access(tempFilePath,
      (error) => {
        if (error) {
          fs.mkdir(tempFilePath,
            { recursive: true },
            function (err) {
              if (err) {
                console.log(err)
              } else {
                file.mv(`${tempFilePath}/${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                    }
                    compress_images(tempFilePath + file.name, baseurlaboutus, options, false,
                      { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                      { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                      { svg: { engine: "svgo", command: "--multipass" } },
                      { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                      // { webp: { engine: "webp", command: ["-q", compression] } }
                      , async function (err, completed) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error compressing image");
                          return;
                        }
                        if (completed) {

                          fs.unlink(tempFilePath + file.name, function (error) {
                            if (error) throw error
                          })
                          console.log("Image compressed successfully!");
                        }
                      });
                  }
                );
              }
            }
          );
        } else {
          if (
            fs.existsSync(tempFilePath)) {
            file.mv(`${tempFilePath}/${file.name}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
                compress_images(tempFilePath + file.name, baseurlaboutus, options, false,
                  { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                  { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                  { svg: { engine: "svgo", command: "--multipass" } },
                  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                  // { webp: { engine: "webp", command: ["-q", compression] } }
                  , async function (err, completed) {
                    if (err) {
                      console.error(err);
                      res.status(500).send("Error compressing image");
                      return;
                    }
                    if (completed) {
                      fs.unlink(tempFilePath + file.name, function (error) {
                        if (error) throw error
                      })
                      console.log("Image compressed successfully!");
                    }
                  });
              }
            );
          }
        }
      }
    );
  }
  if (founders.length) {
    for (var row of founders) {
      if (req.files[row.founderfilename]) {
        const file = req.files[row.founderfilename];
        fs.access(tempFilePath,
          (error) => {
            if (error) {
              fs.mkdir(tempFilePath,
                { recursive: true },
                function (err) {
                  if (err) {
                    console.log(err)
                  } else {
                    file.mv(`${tempFilePath}/${file.name}`,
                      (err) => {
                        if (err) {
                          console.error(err);
                        }
                        compress_images(tempFilePath + file.name, baseurlaboutus + "founders/", options, false,
                          { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                          { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                          { svg: { engine: "svgo", command: "--multipass" } },
                          { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                          // { webp: { engine: "webp", command: ["-q", compression] } }
                          , async function (err, completed) {
                            if (err) {
                              console.error(err);
                              res.status(500).send("Error compressing image");
                              return;
                            }
                            if (completed) {

                              fs.unlink(tempFilePath + file.name, function (error) {
                                if (error) throw error
                              })
                              console.log("Image compressed successfully!");
                            }
                          });
                      }
                    );
                  }
                }
              );
            } else {
              if (
                fs.existsSync(tempFilePath)) {
                file.mv(`${tempFilePath}/${file.name}`,
                  (err) => {
                    if (err) {
                      console.error(err);
                    }
                    compress_images(tempFilePath + file.name, baseurlaboutus + "founders/", options, false,
                      { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                      { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                      { svg: { engine: "svgo", command: "--multipass" } },
                      { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
                      // { webp: { engine: "webp", command: ["-q", compression] } }
                      , async function (err, completed) {
                        if (err) {
                          console.error(err);
                          res.status(500).send("Error compressing image");
                          return;
                        }
                        if (completed) {

                          fs.unlink(tempFilePath + file.name, function (error) {
                            if (error) throw error
                          })
                          console.log("Image compressed successfully!");
                        }
                      });
                  }
                );
              }
            }
          }
        );
      }
    }
  }
  res(null, {
    success: true,
    msg: "Successfully inserted product",
  });
};

var remove_founder = function (req, res) {
  const { remove } = req.body.data
  if (remove) {
    fs.unlink(baseurlaboutus + "founders/" + remove.founderfilename, function (error) {
      if (error) throw error
    })
    res(null, {
      success: true,
      msg: "Successfully Remove Founder",

    });
  }
};

module.exports = {
  upload_files,
  upload_category_files,
  upload_offer_files,
  upload_customOrder_files,
  upload_profile,
  upload_Aboutus_files,
  remove_founder,
};
