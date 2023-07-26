const fs = require("fs");
const { image_Compression } = require("./imageCompression");

var baseurl = __dirname + '/photo/product/';
var baseurlcategory = __dirname + '/photo/category';
var baseurloffer = __dirname + '/photo/offer/';
var baseurlcustomOrder = __dirname + '/photo/customOrder/';
var baseurlprofile = __dirname + '/photo/profile/';
var baseurlaboutus = __dirname + '/photo/aboutus/';
var baseurlbanner = __dirname + '/photo/banner/';
var baseurladvertbanner = __dirname + '/photo/advertbanner/';
var baseurlslider = __dirname + '/photo/slider/';
var baseurlcatAdvert = __dirname + '/photo/categoryAdvert/';
var tempFilePath = `${__dirname}/temp/`;

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
                  image_Compression(file, outFilePath, function (err, result) {
                    if (err) {
                      res.send(err);
                    } else {
                      res(null, result);
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
                image_Compression(file, outFilePath, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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
                    image_Compression(file, outFilePath, function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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
                }
                image_Compression(file, outFilePath, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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
                    image_Compression(file, baseurloffer, function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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
                image_Compression(file, baseurloffer, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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
                    image_Compression(file, baseurlcustomOrder, function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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
                image_Compression(file, baseurlcustomOrder, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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
                    image_Compression(file, baseurlprofile, function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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
                image_Compression(file, baseurlprofile, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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
                      image_Compression(file, baseurlaboutus, function (err, result) {
                        if (err) {
                          res.send(err);
                        } else {
                          res(null, result);
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
                  image_Compression(file, baseurlaboutus, function (err, result) {
                    if (err) {
                      res.send(err);
                    } else {
                      res(null, result);
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
                    image_Compression(file, baseurlaboutus, function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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
                image_Compression(file, baseurlaboutus, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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
                        image_Compression(file, baseurlaboutus + "founders/", function (err, result) {
                          if (err) {
                            res.send(err);
                          } else {
                            res(null, result);
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
                    image_Compression(file, baseurlaboutus + "founders/", function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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

var upload_banner_files = function (req, res) {
  if (req.files) {
    const file = req.files.bannerimage;
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
                    image_Compression(file, baseurlbanner, function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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
                image_Compression(file, baseurlbanner, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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

var upload_advertbanner_files = function (req, res) {
  if (req.files) {
    const file = req.files.advertbannerimage;
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
                    image_Compression(file, baseurladvertbanner, function (err, result) {
                      if (err) {
                        res.send(err);
                      } else {
                        res(null, result);
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
                image_Compression(file, baseurladvertbanner, function (err, result) {
                  if (err) {
                    res.send(err);
                  } else {
                    res(null, result);
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

var upload_sliders_files = function (req, res) {
  const sliders = JSON.parse(req.body.sliders)
  if (req.files) {
    if (sliders.length) {
      for (var row of sliders) {
        if (req.files[row.sliderfilename]) {
          const file = req.files[row.sliderfilename];
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
                          var data = { file: file, path: baseurlslider }
                          image_Compression(file, baseurlslider, function (err, result) {
                            if (err) {
                              res.send(err);
                            } else {
                              res(null, result);
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
                      var data = { file: file, path: baseurlslider }
                      image_Compression(file, baseurlslider, function (err, result) {
                        if (err) {
                          res.send(err);
                        } else {
                          res(null, result);
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
  }
};

var remove_slider = function (req, res) {
  const { remove } = req.body.data
  if (remove) {
    fs.unlink(baseurlslider + remove.sliderfilename, function (error) {
      if (error) throw error
    })
    res(null, {
      success: true,
      msg: "Successfully Remove Founder",

    });
  }
};

var upload_catadverts_files = function (req, res) {
  const catadverts = JSON.parse(req.body.catadverts)
  if (req.files) {
    console.log(req.files)
    if (catadverts.length) {
      for (var row of catadverts) {
        if (req.files[row.categoryfilename]) {
          const file = req.files[row.categoryfilename];
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
                          image_Compression(file, baseurlcatAdvert, function (err, result) {
                            if (err) {
                              res.send(err);
                            } else {
                              res(null, result);
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
                      image_Compression(file, baseurlcatAdvert, function (err, result) {
                        if (err) {
                          res.send(err);
                        } else {
                          res(null, result);
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
  }
};

var remove_catadverts = function (req, res) {
  const { remove } = req.body.data
  if (remove) {
    fs.unlink(baseurlcatAdvert + remove.categoryfilename, function (error) {
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
  upload_banner_files,
  upload_sliders_files,
  remove_slider,
  upload_catadverts_files,
  remove_catadverts,
  upload_advertbanner_files,
};
