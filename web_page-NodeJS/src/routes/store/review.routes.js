const { Router } = require("express");
const ReviewController = require("../../controllers/store/review.controller");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    auth.authenticate,
    auth.restrict(["usuario"]),
    ReviewController.createReview
);

router.get("/", ReviewController.getReviews);
router.get("/:id", ReviewController.getReview);

router.put("/update/:id", ReviewController.updateReview);

router.delete("/delete/:id", ReviewController.deleteReview);

module.exports = router;