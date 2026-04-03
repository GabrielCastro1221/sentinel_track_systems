const { Router } = require("express");
const configPageController = require("../../controllers/config/configPage.controller");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    auth.authenticate,
    auth.restrict(["admin"]),
    configPageController.createConfigPage
);

router.get("/", configPageController.getAllConfigPages);
router.get(
    "/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    configPageController.getConfigById
);

router.put(
    "/update/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    configPageController.updateConfigPage
);

router.delete(
    "/delete/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    configPageController.deleteConfigPage
);

module.exports = router;
