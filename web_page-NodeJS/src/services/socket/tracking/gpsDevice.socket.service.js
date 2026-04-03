const { logger } = require("../../../middlewares/logger.middleware");
const GPSDeviceRepository = require("../../../repositories/tracking/gpsDevice.repository");

module.exports = function (io) {
    io.on("connection", (socket) => {
        logger.info("Client connected to GPS socket:", socket.id);

        socket.on("gps:create", async ({ gpsData }) => {
            try {
                let newGPS;
                if (gpsData.pet) {
                    newGPS = await GPSDeviceRepository.createAndAssignPetGPSDevice(gpsData);
                } else if (gpsData.vehicle) {
                    newGPS = await GPSDeviceRepository.createAndAssignVehicleGPSDevice(gpsData);
                } else if (gpsData.disabled_person) {
                    newGPS = await GPSDeviceRepository.createAndAssignDisabledPersonGPSDevice(gpsData);
                } else {
                    newGPS = await GPSDeviceRepository.createAndAssignPetGPSDevice(gpsData);
                }
                socket.emit("gps:create:response", newGPS);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:get", async (filters) => {
            try {
                const devices = await GPSDeviceRepository.getGPSDevices(filters);
                socket.emit("gps:get:response", devices);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:getById", async ({ deviceId }) => {
            try {
                const gps = await GPSDeviceRepository.getGPSDeviceById(deviceId);
                socket.emit("gps:getById:response", gps);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:update", async ({ deviceId, updateData }) => {
            try {
                const updated = await GPSDeviceRepository.updateGPSDevice(deviceId, updateData);
                socket.emit("gps:update:response", updated);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:delete", async ({ deviceId }) => {
            try {
                const deleted = await GPSDeviceRepository.deleteGPSDevice(deviceId);
                socket.emit("gps:delete:response", deleted);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:searchByName", async ({ name, limit }) => {
            try {
                const devices = await GPSDeviceRepository.searchByName(name, limit);
                socket.emit("gps:searchByName:response", devices);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:location:update", async ({ deviceId, lat, lng, date }) => {
            try {
                const gps = await GPSDeviceRepository.getGPSDeviceById(deviceId);
                gps.lastLocation = { latitude: lat, longitude: lng, date };
                gps.locationHistory.push({ latitude: lat, longitude: lng, date });
                await gps.save();

                io.emit("gps:location:updated", { deviceId, lat, lng, date });
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:location:last", async ({ deviceId }) => {
            try {
                const location = await GPSDeviceRepository.getLastLocation(deviceId);
                socket.emit("gps:location:last:response", location);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:location:history", async ({ deviceId }) => {
            try {
                const history = await GPSDeviceRepository.getHistoricalLocations(deviceId);
                socket.emit("gps:location:history:response", history);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:status:update", async ({ deviceId, status }) => {
            try {
                const updated = await GPSDeviceRepository.changeConnectionStatus(deviceId, status);
                io.emit("gps:status:updated", {
                    deviceId: updated._id,
                    connectionStatus: updated.connectionStatus
                });
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:poi:add", async ({ gpsId, poiData }) => {
            try {
                const pois = await GPSDeviceRepository.addPOI(gpsId, poiData);
                socket.emit("gps:poi:add:response", pois);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:poi:get", async ({ gpsId }) => {
            try {
                const pois = await GPSDeviceRepository.getPOIS(gpsId);
                socket.emit("gps:poi:get:response", pois);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:poi:update", async ({ gpsId, poiId, updateData }) => {
            try {
                const pois = await GPSDeviceRepository.updatePOI(gpsId, poiId, updateData);
                socket.emit("gps:poi:update:response", pois);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:poi:delete", async ({ gpsId, poiId }) => {
            try {
                const pois = await GPSDeviceRepository.deletePOI(gpsId, poiId);
                socket.emit("gps:poi:delete:response", pois);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:geofence:add", async ({ gpsId, geofenceData }) => {
            try {
                const geofences = await GPSDeviceRepository.addGeoFence(gpsId, geofenceData);
                socket.emit("gps:geofence:add:response", geofences);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:geofence:get", async ({ gpsId }) => {
            try {
                const geofences = await GPSDeviceRepository.getGeoFences(gpsId);
                socket.emit("gps:geofence:get:response", geofences);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:geofence:update", async ({ gpsId, geofenceId, updateData }) => {
            try {
                const geofences = await GPSDeviceRepository.updateGeoFence(gpsId, geofenceId, updateData);
                socket.emit("gps:geofence:update:response", geofences);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("gps:geofence:delete", async ({ gpsId, geofenceId }) => {
            try {
                const geofences = await GPSDeviceRepository.deleteGeoFence(gpsId, geofenceId);
                socket.emit("gps:geofence:delete:response", geofences);
            } catch (error) {
                socket.emit("gps:error", { message: error.message });
            }
        });

        socket.on("disconnect", () => {
            logger.info("Client disconnected from GPS socket:", socket.id);
        });
    });
};
