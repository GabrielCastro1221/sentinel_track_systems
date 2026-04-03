const ReviewRepository = require("../../repositories/store/review.repository");
const { logger } = require("../../middlewares/logger.middleware");
const MailerController = require("../../services/mailer/nodemailer.service");

class ReviewController {
    async createReview(req, res) {
        try {
            const reviewData = req.body;
            const newReview = await ReviewRepository.createReview(reviewData);

            await MailerController.sendProductReviewEmail(
                newReview.user,
                newReview.product,
                newReview
            );

            logger.info(`Reseña creada: ${newReview._id}`);
            res.status(201).json(newReview);
        } catch (error) {
            logger.error(`Error al crear reseña: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    }

    async getReviews(req, res) {
        try {
            const { productId } = req.query;
            const reviews = await ReviewRepository.getReviews(productId);

            logger.info(`Reseñas obtenidas para producto: ${productId || "todos"}`);
            res.status(200).json(reviews);
        } catch (error) {
            logger.error(`Error al obtener reseñas: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getReview(req, res) {
        try {
            const { id } = req.params;
            const review = await ReviewRepository.getReview(id);

            if (!review) {
                logger.warn(`Reseña no encontrada: ${id}`);
                return res.status(404).json({ message: "Reseña no encontrada" });
            }

            logger.info(`Reseña obtenida: ${id}`);
            res.status(200).json(review);
        } catch (error) {
            logger.error(`Error al obtener reseña: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const updatedReview = await ReviewRepository.updateReview(id, updateData);

            if (!updatedReview) {
                logger.warn(`Reseña no encontrada: ${id}`);
                return res.status(404).json({ message: "Reseña no encontrada" });
            }

            logger.info(`Reseña actualizada: ${id}`);
            res.status(200).json(updatedReview);
        } catch (error) {
            logger.error(`Error al actualizar reseña: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            const deletedReview = await ReviewRepository.deleteReview(id);

            if (!deletedReview) {
                logger.warn(`Reseña no encontrada: ${id}`);
                return res.status(404).json({ message: "Reseña no encontrada" });
            }

            logger.info(`Reseña eliminada: ${id}`);
            res.status(200).json({ message: "Reseña eliminada correctamente" });
        } catch (error) {
            logger.error(`Error al eliminar reseña: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ReviewController();
