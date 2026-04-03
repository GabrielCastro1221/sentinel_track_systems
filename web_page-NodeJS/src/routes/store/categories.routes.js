const { Router } = require("express");
const CategoryController = require("../../controllers/store/categories.controller");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    auth.authenticate,
    auth.restrict(["admin"]),
    CategoryController.createCategory
);

router.get("/", CategoryController.getCategories);

router.put(
    "/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    CategoryController.updateCategory
);

router.delete(
    "/:id",
    auth.authenticate,
    auth.restrict(["admin"]),
    CategoryController.deleteCategory
);

module.exports = router;
