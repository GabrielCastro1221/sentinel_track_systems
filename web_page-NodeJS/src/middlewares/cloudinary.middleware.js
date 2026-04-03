const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const configObject = require("../config/enviroment.config");

cloudinary.config({
    cloud_name: configObject.cloudinary.cloud_name,
    api_key: configObject.cloudinary.api_key,
    api_secret: configObject.cloudinary.api_secret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        if (file.mimetype.startsWith("video/")) {
            return {
                folder: "uploads/videos",
                resource_type: "video",
                allowed_formats: ["mp4", "avi", "mov", "mkv"],
            };
        } else {
            return {
                folder: "uploads/images",
                resource_type: "image",
                allowed_formats: ["jpeg", "png", "gif"],
                transformation: [{ width: 800, height: 800, crop: "limit" }],
            };
        }
    },
});

const fileFilter = (req, file, cb) => {
    const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    const allowedVideoMimeTypes = ["video/mp4", "video/avi", "video/mov", "video/mkv"];

    if (
        !allowedImageMimeTypes.includes(file.mimetype) &&
        !allowedVideoMimeTypes.includes(file.mimetype)
    ) {
        return cb(
            new Error("Solo se permiten imágenes (JPEG, PNG, GIF) o videos (MP4, AVI, MOV, MKV)"),
            false
        );
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});

module.exports = upload;
