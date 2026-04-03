const MulterRepository = require("../../repositories/config/upload.repository");
const { logger } = require("../../middlewares/logger.middleware");

class MulterController {
    async uploadImage(req, res) {
        try {
            const file = req.file;
            const uploadedFile = await MulterRepository.uploadImage(file);

            logger.info(`Imagen cargada: ${uploadedFile.url}`);
            res.status(200).json({
                message: "Imagen cargada con éxito!",
                file: uploadedFile,
            });
        } catch (error) {
            logger.error(`Error al cargar la imagen: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }

    async uploadVideo(req, res) {
        try {
            const file = req.file;
            const uploadedVideo = await MulterRepository.uploadVideo(file);

            logger.info(`Video cargado: ${uploadedVideo.url}`);
            res.status(200).json({
                message: "Video cargado con éxito!",
                file: uploadedVideo,
            });
        } catch (error) {
            logger.error(`Error al cargar el video: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new MulterController();
