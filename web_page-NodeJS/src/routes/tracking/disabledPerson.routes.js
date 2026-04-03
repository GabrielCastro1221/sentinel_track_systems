const { Router } = require("express");
const DisabledPersonController = require("../../controllers/tracking/disabledPerson.controller");
const upload = require("../../middlewares/cloudinary.middleware");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    upload.single("photo"),
    auth.authenticate,
    auth.restrict(["usuario"]),
    DisabledPersonController.createDisabledPerson
);

router.get(
    "/",
    auth.authenticate,
    auth.restrict(["admin"]),
    DisabledPersonController.getDisabledPersons
);

router.get(
    "/person/:id",
    auth.authenticate,
    auth.restrict(["usuario"]),
    DisabledPersonController.getDisabledPerson
);

router.put(
    "/update/:id",
    upload.single("photo"),
    auth.authenticate,
    auth.restrict(["usuario", "admin"]),
    DisabledPersonController.updateDisabledPerson
);

router.delete(
    "/delete/:id",
    auth.authenticate,
    auth.restrict(["usuario"]),
    DisabledPersonController.deleteDisabledPerson
);

module.exports = router;
