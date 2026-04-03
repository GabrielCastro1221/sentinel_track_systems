const reviewModel = require("../../models/store/review.model");
const productModel = require("../../models/store/product.model");

class ReviewRepository {
    async createReview(reviewData) {
        try {
            const newReview = new reviewModel(reviewData);
            await newReview.save();

            await productModel.findByIdAndUpdate(
                reviewData.product,
                { $push: { reviews: newReview._id } },
                { new: true }
            );

            await this.updateProductRating(reviewData.product);

            const populatedReview = await reviewModel
                .findById(newReview._id)
                .populate("user")
                .populate("product");

            return populatedReview;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getReviews(productId = null) {
        try {
            const query = productId ? { product: productId } : {};

            return await reviewModel
                .find(query)
                .populate("user", "nombre email")
                .populate("product", "title");
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getReview(reviewId) {
        try {
            return await reviewModel
                .findById(reviewId)
                .populate("user", "nombre email")
                .populate("product", "title");
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateReview(reviewId, updateData) {
        try {
            const updatedReview = await reviewModel.findByIdAndUpdate(
                reviewId,
                updateData,
                { new: true }
            );

            if (updatedReview) {
                await this.updateProductRating(updatedReview.product);
            }

            return updatedReview;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProductRating(productId) {
        try {
            const reviews = await reviewModel.find({ product: productId });
            const totalRating = reviews.length;
            const averageRating =
                totalRating > 0
                    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalRating
                    : 0;

            await productModel.findByIdAndUpdate(productId, {
                averageRating,
                totalRating
            });

        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteReview(reviewId) {
        try {
            const review = await reviewModel.findByIdAndDelete(reviewId);

            if (review) {
                await productModel.findByIdAndUpdate(
                    review.product,
                    { $pull: { reviews: review._id } }
                );
                await this.updateProductRating(review.product);
            }

            return review;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new ReviewRepository();
