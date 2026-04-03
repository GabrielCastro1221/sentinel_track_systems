const { Router } = require('express');
const upload = require("../../middlewares/cloudinary.middleware");
const UploadController = require("../../controllers/config/upload.controller");

const router = Router();

router.post("/upload",
    upload.single("photo"),
    UploadController.uploadImage
);

router.post("/upload/video",
    upload.single("video"),
    UploadController.uploadVideo
);

module.exports = router;