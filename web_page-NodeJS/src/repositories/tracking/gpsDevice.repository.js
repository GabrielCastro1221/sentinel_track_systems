const GPSDeviceModel = require("../../models/tracking/gps_devise.model");
const PetModel = require("../../models/tracking/pet.model");
const VehicleModel = require("../../models/tracking/vehicle.model");
const DisabledPersonModel = require("../../models/tracking/disabled_person.model");

class GPSDeviceRepository {
    async createAndAssignPetGPSDevice(gpsData) {
        try {
            const newGPSDevice = new GPSDeviceModel(gpsData);
            await newGPSDevice.save();

            if (gpsData.pet) {
                await PetModel.findByIdAndUpdate(
                    gpsData.pet,
                    { gps: newGPSDevice._id },
                    { new: true }
                );
            }

            return newGPSDevice;
        } catch (error) {
            throw new Error(`Error al crear y asignar el dispositivo GPS: ${error.message}`);
        }
    }

    async createAndAssignVehicleGPSDevice(gpsData) {
        try {
            const newGPSDevice = new GPSDeviceModel(gpsData);
            await newGPSDevice.save();

            if (gpsData.vehicle) {
                await VehicleModel.findByIdAndUpdate(
                    gpsData.vehicle,
                    { gps: newGPSDevice._id },
                    { new: true }
                );
            }

            return newGPSDevice;
        } catch (error) {
            throw new Error(`Error al crear y asignar el dispositivo GPS: ${error.message}`);
        }
    }

    async createAndAssignDisabledPersonGPSDevice(gpsData) {
        try {
            const newGPSDevice = new GPSDeviceModel(gpsData);
            await newGPSDevice.save();

            if (gpsData.disabled_person) {
                await DisabledPersonModel.findByIdAndUpdate(
                    gpsData.disabled_person,
                    { gps: newGPSDevice._id },
                    { new: true }
                );
            }

            return newGPSDevice;
        } catch (error) {
            throw new Error(`Error al crear y asignar el dispositivo GPS: ${error.message}`);
        }
    }

    async getGPSDevices({ page = 1, deviceId, name, active, pet, connectionStatus, assignedToUser }) {
        try {
            const query = {};
            if (deviceId) query.deviceId = deviceId;
            if (name) query.name = { $regex: name, $options: "i" };
            if (active !== undefined) query.active = active;
            if (pet) query.pet = pet;
            if (connectionStatus) query.connectionStatus = connectionStatus;
            if (assignedToUser) query.assignedToUser = assignedToUser;

            const options = {
                page: parseInt(page),
                limit: 10,
                sort: { createdAt: -1 },
                lean: true,
            };

            return await GPSDeviceModel.paginate(query, options);
        } catch (error) {
            throw new Error(`Error al obtener los dispositivos GPS: ${error.message}`);
        }
    }

    async getGPSDeviceById(id) {
        try {
            const gps = await GPSDeviceModel.findById(id);
            if (!gps) throw new Error("Dispositivo GPS no encontrado");
            return gps;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getLastLocation(id) {
        try {
            const gps = await GPSDeviceModel.findById(id);
            if (!gps) throw new Error("Dispositivo GPS no encontrado");
            return gps.lastLocation;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getHistoricalLocations(id) {
        try {
            const gps = await GPSDeviceModel.findById(id);
            if (!gps) throw new Error("Dispositivo GPS no encontrado");
            return gps.locationHistory;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateGPSDevice(id, updateData) {
        try {
            const gps = await GPSDeviceModel.findById(id);
            if (!gps) throw new Error("Dispositivo GPS no encontrado");

            if (updateData.lastLocation) {
                gps.lastLocation = {
                    latitude: updateData.lastLocation.latitude,
                    longitude: updateData.lastLocation.longitude,
                    date: updateData.lastLocation.date || new Date()
                };

                gps.locationHistory.push({
                    latitude: updateData.lastLocation.latitude,
                    longitude: updateData.lastLocation.longitude,
                    date: updateData.lastLocation.date || new Date()
                });
            }

            Object.assign(gps, updateData);

            await gps.save();
            return gps;
        } catch (error) {
            throw new Error(`Error al actualizar el dispositivo GPS: ${error.message}`);
        }
    }

    async changeConnectionStatus(id, newStatus) {
        try {
            const updated = await GPSDeviceModel.findByIdAndUpdate(
                id,
                { connectionStatus: newStatus },
                { new: true }
            );
            if (!updated) throw new Error("Dispositivo GPS no encontrado");
            return updated;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteGPSDevice(id) {
        try {
            const gps = await GPSDeviceModel.findByIdAndDelete(id);
            if (!gps) throw new Error("Dispositivo GPS no encontrado");

            if (gps.pet) {
                await PetModel.findByIdAndUpdate(gps.pet, { gps: null }, { new: true });
            }
            if (gps.vehicle) {
                await VehicleModel.findByIdAndUpdate(gps.vehicle, { gps: null }, { new: true });
            }
            if (gps.disabled_person) {
                await DisabledPersonModel.findByIdAndUpdate(gps.disabled_person, { gps: null }, { new: true });
            }
            return gps;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
      * @param {String} nameQuery
      * @param {Number} limit
      * @returns {Promise<Array>}
      */
    async searchByName(nameQuery, limit = 10) {
        try {
            const regex = new RegExp(nameQuery, "i");
            const devices = await GPSDeviceModel.find({ name: regex })
                .limit(limit)
                .populate({
                    path: "pet",
                    model: "Pet",
                    select: "petName species breed age sex"
                })
                .populate({
                    path: "vehicle",
                    model: "Vehicle",
                    select: "licensePlate type model brand color"
                })
                .populate({
                    path: "disabled_person",
                    model: "DisabledPerson",
                    select: "name document age CC disabilityType"
                })
                .populate({
                    path: "assignedToUser",
                    model: "User",
                    select: "name email role city phone"
                })
                .lean();

            return devices;
        } catch (error) {
            throw new Error(`Error al buscar dispositivos por nombre: ${error.message}`);
        }
    }

    /**
   * @param {String} gpsId
   * @param {Object} poiData
   * @returns {Promise<Object>}
   */

    async addPOI(gpsId, poiData) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) throw new Error("Dispositivo GPS no encontrado");
        gps.pointsOfInterest.push(poiData);
        await gps.save();
        return gps.pointsOfInterest;
    }

    async getPOIS(gpsId) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) return [];
        return gps.pointsOfInterest;
    }

    async updatePOI(gpsId, poiId, updateData) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) throw new Error("Dispositivo GPS no encontrado");
        const poi = gps.pointsOfInterest.id(poiId);
        if (!poi) throw new Error("POI no encontrado");
        Object.assign(poi, updateData);
        await gps.save();
        return gps.pointsOfInterest;
    }

    async deletePOI(gpsId, poiId) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) throw new Error("Dispositivo GPS no encontrado");
        gps.pointsOfInterest.pull({ _id: poiId });
        await gps.save();
        return gps.pointsOfInterest;
    }

    async addGeoFence(gpsId, geofenceData) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) throw new Error("Dispositivo GPS no encontrado");
        gps.geofences.push(geofenceData);
        await gps.save();
        return gps.geofences;
    }

    async getGeoFences(gpsId) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) return [];
        return gps.geofences;
    }

    async updateGeoFence(gpsId, geofenceId, updateData) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) throw new Error("Dispositivo GPS no encontrado");
        const geofence = gps.geofences.id(geofenceId);
        if (!geofence) throw new Error("Geofence no encontrado");
        Object.assign(geofence, updateData);
        await gps.save();
        return gps.geofences;
    }

    async deleteGeoFence(gpsId, geofenceId) {
        const gps = await GPSDeviceModel.findById(gpsId);
        if (!gps) throw new Error("Dispositivo GPS no encontrado");
        gps.geofences.pull({ _id: geofenceId });
        await gps.save();
        return gps.geofences;
    }
}

module.exports = new GPSDeviceRepository();
