const { Router } = require("express");
const ShippingController = require("../../controllers/store/shipping.controller");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    auth.authenticate,
    auth.restrict(["admin"]),
    ShippingController.createShipping
);

router.get("/", ShippingController.getShipping);

router.put(
    "/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    ShippingController.updateShipping
);

router.delete(
    "/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    ShippingController.deleteShipping
);

module.exports = router;