const { Router } = require("express");
const VehicleController = require("../../controllers/tracking/vehicle.controller");
const upload = require("../../middlewares/cloudinary.middleware");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create",
    upload.single("photo"),
    VehicleController.createVehicle
);

router.get(
    "/",
    auth.authenticate,
    auth.restrict(["admin"]),
    VehicleController.getVehicles
);
router.get("/vehicle/:id", VehicleController.getVehicle);

router.put(
    "/update/:id",
    upload.single("photo"),
    VehicleController.updateVehicle
);

router.delete("/delete/:id", VehicleController.deleteVehicle);

module.exports = router;
