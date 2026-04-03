class MulterRepository {
    async uploadImage(file) {
        try {
            if (!file) {
                throw new Error("No se ha proporcionado ningún archivo!");
            }

            const uploadedFile = {
                url: file.path,
                public_id: file.filename,
            };

            return uploadedFile;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async uploadVideo(file) {
        try {
            if (!file) {
                throw new Error("No se ha proporcionado ningún archivo de video!");
            }

            const uploadedVideo = {
                url: file.path,
                public_id: file.filename,
                type: "video"
            };

            return uploadedVideo;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new MulterRepository();
