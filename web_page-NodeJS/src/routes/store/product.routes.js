const { Router } = require("express");
const ProductController = require("../../controllers/store/product.controller");
const upload = require("../../middlewares/cloudinary.middleware");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    upload
        .fields([
            { name: "image", maxCount: 1 },
            { name: "thumbnails", maxCount: 5 }
        ]),
    auth.authenticate,
    auth.restrict(["admin"]),
    ProductController.createProd
);

router.get("/", ProductController.getProducts);
router.get('/search-bar', ProductController.searchProductsBar);
router.get("/:id/reviews", ProductController.getProductReviews);
router.get("/:id/features", ProductController.getProductFeatures);
router.get("/featured", ProductController.getFeatured);
router.get("/more-seller", ProductController.getMoreSeller);
router.get("/new-arrive", ProductController.getNewArrive);
router.get("/:id", ProductController.getProductById);

router.put(
    "/:id",
    upload
        .fields([
            { name: "image", maxCount: 1 },
            { name: "thumbnails", maxCount: 5 }
        ]),
    auth.authenticate,
    auth.restrict(["admin"]),
    ProductController.updateProduct
);
router.put(
    "/featured/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    ProductController.featuredProduct
);
router.put(
    "/new-arrive/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    ProductController.newArrive
);
router.put(
    "/best-seller/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    ProductController.bestSeller
);

router.delete(
    "/:pid",
    auth.authenticate,
    auth.restrict(["admin"]),
    ProductController.deleteProduct);

module.exports = router;