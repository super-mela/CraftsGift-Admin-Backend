const fs = require("fs");
const compress_images = require("compress-images");
const sharp = require('sharp');

var tempFilePath = `${__dirname}/temp/`;
const compression = 80
const options = {
    compress_force: false,
    statistic: true,
    autoupdate: true,
};

var image_Compression = function (file, path, res) {
    if (file.name.split(".")[1] === "webp") {
        fs.access(path,
            (error) => {
                if (error) {
                    fs.mkdir(path,
                        { recursive: true },
                        function (err) {
                            if (err) {
                            } else {
                                sharp(tempFilePath + file.name)
                                    .webp({ quality: compression })
                                    .toFile(path + file.name, (err, info) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            fs.unlink(tempFilePath + file.name, function (error) {
                                                if (error) throw error
                                            })
                                            console.log("Image compressed successfully!");
                                            res(null, {
                                                success: true,
                                                msg: "Successfully inserted image",
                                                url: file.name,
                                            });
                                        }
                                    });
                            }
                        }
                    );
                } else if (
                    fs.existsSync(path)) {
                    sharp(tempFilePath + file.name)
                        .webp({ quality: compression })
                        .toFile(path + file.name, (err, info) => {
                            if (err) {
                                console.log(err);
                            } else {
                                fs.unlink(tempFilePath + file.name, function (error) {
                                    if (error) throw error
                                })
                                console.log("Image compressed successfully!");
                                res(null, {
                                    success: true,
                                    msg: "Successfully inserted image",
                                    url: file.name,
                                });
                            }
                        });
                }

            }
        );

    }
    else {
        compress_images(tempFilePath + file.name, path, options, false,
            { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
            { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
            { svg: { engine: "svgo", command: "--multipass" } },
            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }
            , async function (err, completed) {
                if (err) {
                    console.error(err);
                    res(err, null)
                    return;
                }
                if (completed) {

                    fs.unlink(tempFilePath + file.name, function (error) {
                        if (error) throw error
                    })
                    console.log("Image compressed successfully!");
                    res(null, {
                        success: true,
                        msg: "Successfully inserted image",
                        url: file.name,
                    });

                }
            });
    }
}

var uploadImageWithoutCompression = function (file, path, res) {

    fs.access(
        path,
        (error) => {
            if (error) {
                fs.mkdir(
                    path, { recursive: true }, function (err) {
                        if (err) {
                        } else {
                            if (file === null) {
                                return res.status(400).json({ msg: "no file Uploaded" });
                            }
                            file.mv(
                                `${path}/${file.name}`,
                                (err) => {
                                    if (err) {
                                        console.error(err);
                                        //   return res.status(500).send(err);
                                    }
                                    fs.unlink(tempFilePath + file.name, function (error) {
                                        if (error) throw error
                                    })
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
                if (fs.existsSync(path)) {
                    //const file = req.files.file;
                    file.mv(
                        `${path}/${file.name}`,
                        (err) => {
                            if (err) {
                                console.error(err);
                                //   return res.status(500).send(err);
                            }
                            fs.unlink(tempFilePath + file.name, function (error) {
                                if (error) throw error
                            })
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
};

module.exports = {
    image_Compression,
    uploadImageWithoutCompression
}