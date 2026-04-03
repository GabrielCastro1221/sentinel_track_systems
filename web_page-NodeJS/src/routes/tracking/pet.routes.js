const { Router } = require("express");
const PetController = require("../../controllers/tracking/pet.controller");
const upload = require("../../middlewares/cloudinary.middleware");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    upload.single("photo"),
    PetController.createPet
);

router.get(
    "/",
    auth.authenticate,
    auth.restrict(["admin"]),
    PetController.getPets
);

router.get("/pet/:id", PetController.getPet);

router.put(
    "/update/:id",
    upload.single("photo"),
    PetController.updatePet
);

router.delete("/delete/:id", PetController.deletePet);

module.exports = router;
