const { Router } = require("express");
const GPSDeviceController = require("../../controllers/tracking/gpsDevice.controller");
const auth = require("../../middlewares/auth.middleware");

const router = Router();

router.post(
    "/create-pet",
    auth.authenticate,
    auth.restrict(["usuario"]),
    GPSDeviceController.createPetGPSDevice
);
router.post(
    "/create-vehicle",
    auth.authenticate,
    auth.restrict(["usuario"]),
    GPSDeviceController.createVehicleGPSDevice
);
router.post(
    "/create-disabled-person",
    auth.authenticate,
    auth.restrict(["usuario"]),
    GPSDeviceController.createDisabledPersonGPSDevice
);

router.post("/:id/poi", GPSDeviceController.addPOI);
router.post("/:id/geofence", GPSDeviceController.addGeoFence);

router.get(
    "/",
    auth.authenticate,
    auth.restrict(["admin"]),
    GPSDeviceController.getGPSDevices
);
router.get("/gps/:id", GPSDeviceController.getGPSDevice);
router.get("/last-location/:id", GPSDeviceController.getLastLocation);
router.get("/history/:id", GPSDeviceController.getHistoricalLocations);
router.get("/pois/:id", GPSDeviceController.getPOIS);
router.get("/geofence/:id", GPSDeviceController.getGeoFences);
router.get("/search", GPSDeviceController.searchByName);
router.put("/update/:id", GPSDeviceController.updateGPSDevice);
router.put("/offline/:id", GPSDeviceController.changeStatusOffline);
router.put("/online/:id", GPSDeviceController.changeStatusOnline);
router.put("/:id/poi/:poiId", GPSDeviceController.updatePOI);
router.put("/:id/geofence/:geofenceId", GPSDeviceController.updateGeoFence);

router.delete("/delete/:id", GPSDeviceController.deleteGPSDevice);
router.delete("/:id/poi/:poiId", GPSDeviceController.deletePOI);
router.delete("/:id/geofence/:geofenceId", GPSDeviceController.deleteGeoFence);

module.exports = router;
