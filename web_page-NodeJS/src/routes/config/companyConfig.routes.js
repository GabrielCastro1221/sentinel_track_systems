const { Router } = require("express");
const companyConfigController = require("../../controllers/config/companyConfig.controller");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    auth.authenticate,
    auth.restrict(["admin"]),
    companyConfigController.createCompanyConfig
);

router.get("/", companyConfigController.getAllCompanyConfigs);
router.get(
    "/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    companyConfigController.getCompanyConfigById
);

router.put(
    "/update/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    companyConfigController.updateCompanyConfig
);

router.delete(
    "/delete/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    companyConfigController.deleteCompanyConfig
);

module.exports = router;
