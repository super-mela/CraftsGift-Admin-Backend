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

module.exports = {
    image_Compression
}