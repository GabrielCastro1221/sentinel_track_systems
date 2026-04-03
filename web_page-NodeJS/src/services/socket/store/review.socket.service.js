const ReviewRepository = require("../../../repositories/store/review.repository");
const { logger } = require("../../../middlewares/logger.middleware");

class SocketReview {
    constructor(io) {
        this.io = io;
        this.initSocketEvents();
    }

    initSocketEvents() {
        this.io.on("connection", async (socket) => {
            logger.info("WebSocket reviews connected");

            socket.on("createReview", async (data) => {
                try {
                    const newReview = await ReviewRepository.createReview(data);
                    socket.emit("reviewCreated", newReview);
                } catch (error) {
                    socket.emit("error", "Error creating review: " + error.message);
                }
            });

            socket.on("getReviews", async (productId) => {
                try {
                    const reviews = await ReviewRepository.getReviews(productId);
                    socket.emit("reviewsList", reviews);
                } catch (error) {
                    socket.emit("error", "Error fetching reviews: " + error.message);
                }
            });

            socket.on("getReview", async (reviewId) => {
                try {
                    const review = await ReviewRepository.getReview(reviewId);
                    socket.emit("reviewDetail", review);
                } catch (error) {
                    socket.emit("error", "Error fetching review: " + error.message);
                }
            });

            socket.on("updateReview", async ({ reviewId, updateData }) => {
                try {
                    const updatedReview = await ReviewRepository.updateReview(reviewId, updateData);
                    socket.emit("reviewUpdated", updatedReview);
                } catch (error) {
                    socket.emit("error", "Error updating review: " + error.message);
                }
            });

            socket.on("deleteReview", async (reviewId) => {
                try {
                    const deletedReview = await ReviewRepository.deleteReview(reviewId);
                    socket.emit("reviewDeleted", deletedReview);
                } catch (error) {
                    socket.emit("error", "Error deleting review: " + error.message);
                }
            });

            socket.on("disconnect", () => {
                logger.info("Client disconnected from Review socket:", socket.id);
            });
        });
    }
}

module.exports = SocketReview;
