const { Router } = require("express");
const CartController = require("../../controllers/store/cart.controller");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/:cid/products/:pid",
    auth.authenticate,
    auth.restrict(["usuario"]),
    CartController.addProductsToCart
);

router.post("/guest/:guestId/products/:pid", CartController.addProductsToGuestCart);

router.get(
    "/",
    auth.authenticate,
    auth.restrict(["admin"]),
    CartController.getPaginatedCarts
);

router.get("/:cid", CartController.getProductsToCart);

router.get(
    "/:cid/detail",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    CartController.getCartById
);

router.get("/guest/:guestId", CartController.getCartByGuestId);

router.delete(
    "/:cid/products/:pid",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    CartController.deleteProductToCart
);

router.delete(
    "/:cid",
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    CartController.emptyCart
);

router.delete("/guest/:guestId/products/:pid", CartController.deleteProductFromGuestCart);
router.delete("/guest/:guestId", CartController.emptyGuestCart);

module.exports = router;
