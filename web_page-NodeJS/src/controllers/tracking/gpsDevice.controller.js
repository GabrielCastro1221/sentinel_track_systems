const GPSDeviceRepository = require("../../repositories/tracking/gpsDevice.repository");
const { logger } = require("../../middlewares/logger.middleware");

class GPSDeviceController {
    async createPetGPSDevice(req, res) {
        try {
            const gpsData = req.body;
            const newDevice = await GPSDeviceRepository.createAndAssignPetGPSDevice(gpsData);

            logger.info(`Dispositivo GPS registrado y asignado: ${newDevice.deviceId}`);
            res.status(201).json({
                message: "Dispositivo GPS creado y asignado con éxito",
                GPSDevice: newDevice
            });
        } catch (error) {
            logger.error(`Error al registrar dispositivo GPS: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async createVehicleGPSDevice(req, res) {
        try {
            const gpsData = req.body;
            const newDevice = await GPSDeviceRepository.createAndAssignVehicleGPSDevice(gpsData);

            logger.info(`Dispositivo GPS registrado y asignado: ${newDevice.deviceId}`);
            res.status(201).json({
                message: "Dispositivo GPS creado y asignado con éxito",
                GPSDevice: newDevice
            });
        } catch (error) {
            logger.error(`Error al registrar dispositivo GPS: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async createDisabledPersonGPSDevice(req, res) {
        try {
            const gpsData = req.body;
            const newDevice = await GPSDeviceRepository.createAndAssignDisabledPersonGPSDevice(gpsData);

            logger.info(`Dispositivo GPS registrado y asignado: ${newDevice.deviceId}`);
            res.status(201).json({
                message: "Dispositivo GPS creado y asignado con éxito",
                GPSDevice: newDevice
            });
        } catch (error) {
            logger.error(`Error al registrar dispositivo GPS: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getGPSDevices(req, res) {
        try {
            const { page, deviceId, name, active, pet, connectionStatus, assignedToUser } = req.query;
            const gpsDevices = await GPSDeviceRepository.getGPSDevices({
                page,
                deviceId,
                name,
                active,
                pet,
                connectionStatus,
                assignedToUser
            });

            logger.info(`Dispositivos GPS obtenidos: ${gpsDevices.docs.length} encontrados`);
            res.status(200).json(gpsDevices);
        } catch (error) {
            logger.error(`Error al obtener dispositivos GPS: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getGPSDevice(req, res) {
        const { id } = req.params;
        try {
            const gps = await GPSDeviceRepository.getGPSDeviceById(id);

            logger.info(`Dispositivo GPS obtenido: ${gps.deviceId}`);
            res.status(200).json({
                message: "Dispositivo GPS encontrado",
                GPSDevice: gps
            });
        } catch (error) {
            logger.error(`Error al obtener dispositivo GPS: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async getLastLocation(req, res) {
        const { id } = req.params;
        try {
            const location = await GPSDeviceRepository.getLastLocation(id);

            logger.info(`Última ubicación obtenida para dispositivo GPS ID: ${id}`);
            res.status(200).json(location);
        } catch (error) {
            logger.error(`Error al obtener última ubicación: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async getHistoricalLocations(req, res) {
        const { id } = req.params;
        try {
            const locations = await GPSDeviceRepository.getHistoricalLocations(id);

            logger.info(`Historial de ubicaciones obtenido para dispositivo GPS ID: ${id}, total: ${locations.length}`);
            res.status(200).json(locations);
        } catch (error) {
            logger.error(`Error al obtener historial de ubicaciones: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async updateGPSDevice(req, res) {
        const { id } = req.params;
        try {
            const updatedGPS = await GPSDeviceRepository.updateGPSDevice(id, req.body);

            logger.info(`Dispositivo GPS actualizado: ${updatedGPS.deviceId}`);
            res.status(200).json({
                message: "Dispositivo GPS actualizado correctamente",
                GPSDevice: updatedGPS
            });
        } catch (error) {
            logger.error(`Error al actualizar dispositivo GPS: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async changeStatusOffline(req, res) {
        const { id } = req.params;
        try {
            const updated = await GPSDeviceRepository.changeConnectionStatus(id, "offline");

            logger.info(`Dispositivo GPS ID: ${id} cambiado a estado offline`);
            res.status(200).json(updated);
        } catch (error) {
            logger.error(`Error al cambiar estado a offline: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async changeStatusOnline(req, res) {
        const { id } = req.params;
        try {
            const updated = await GPSDeviceRepository.changeConnectionStatus(id, "online");

            logger.info(`Dispositivo GPS ID: ${id} cambiado a estado online`);
            res.status(200).json(updated);
        } catch (error) {
            logger.error(`Error al cambiar estado a online: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async deleteGPSDevice(req, res) {
        const { id } = req.params;
        try {
            const deletedGPS = await GPSDeviceRepository.deleteGPSDevice(id);

            logger.info(`Dispositivo GPS eliminado: ID ${id}`);
            res.status(200).json({
                message: "Dispositivo GPS eliminado",
                GPSDevice: deletedGPS
            });
        } catch (error) {
            logger.error(`Error al eliminar dispositivo GPS: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    /**
  * @param {Request} req
  * @param {Response} res
  */
    async searchByName(req, res) {
        const { q, limit } = req.query;
        try {
            if (!q || q.trim() === "") {
                return res.status(400).json({ message: "El parámetro de busqueda es requerido" });
            }

            const devices = await GPSDeviceRepository.searchByName(q, parseInt(limit) || 10);

            logger.info(`Búsqueda de dispositivos GPS por nombre: "${q}", encontrados: ${devices.length}`);
            res.status(200).json(devices);
        } catch (error) {
            logger.error(`Error al buscar dispositivos GPS por nombre: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async addPOI(req, res) {
        const { id } = req.params;
        const poiData = req.body;
        try {
            const updatedGPS = await GPSDeviceRepository.addPOI(id, poiData);

            logger.info(`POI agregado al dispositivo GPS ID: ${id}`);
            res.status(201).json({
                message: "Punto de interés agregado correctamente",
                GPSDevice: updatedGPS
            });
        } catch (error) {
            logger.error(`Error al agregar POI: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getPOIS(req, res) {
        const { id } = req.params;
        try {
            const pois = await GPSDeviceRepository.getPOIS(id);

            logger.info(`Puntos de interes obtenidos para dispositivo GPS ID: ${id}`);
            res.status(200).json(pois);
        } catch (error) {
            logger.error(`Error al obtener puntos de interes: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async updatePOI(req, res) {
        const { id, poiId } = req.params;
        const updateData = req.body;
        try {
            const updatedGPS = await GPSDeviceRepository.updatePOI(id, poiId, updateData);

            logger.info(`POI ID: ${poiId} actualizado en dispositivo GPS ID: ${id}`);
            res.status(200).json({
                message: "Punto de interés actualizado correctamente",
                GPSDevice: updatedGPS
            });
        } catch (error) {
            logger.error(`Error al actualizar POI: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deletePOI(req, res) {
        const { id, poiId } = req.params;
        try {
            const updatedGPS = await GPSDeviceRepository.deletePOI(id, poiId);

            logger.info(`POI ID: ${poiId} eliminado del dispositivo GPS ID: ${id}`);
            res.status(200).json({
                message: "Punto de interés eliminado correctamente",
                GPSDevice: updatedGPS
            });
        } catch (error) {
            logger.error(`Error al eliminar POI: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async addGeoFence(req, res) {
        const { id } = req.params;
        const geofenceData = req.body;
        try {
            const updatedGPS = await GPSDeviceRepository.addGeoFence(id, geofenceData);

            logger.info(`Geofence agregada al dispositivo GPS ID: ${id}`);
            res.status(201).json({
                message: "Geofence agregada correctamente",
                GPSDevice: updatedGPS
            });
        } catch (error) {
            logger.error(`Error al agregar geofence: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getGeoFences(req, res) {
        const { id } = req.params;
        try {
            const geoFence = await GPSDeviceRepository.getGeoFences(id);

            logger.info(`Geo cercas obtenidas para dispositivo GPS ID: ${id}`);
            res.status(200).json(geoFence);
        } catch (error) {
            logger.error(`Error al obtener Geo cercas: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async updateGeoFence(req, res) {
        const { id, geofenceId } = req.params;
        const updateData = req.body;
        try {
            const updatedGPS = await GPSDeviceRepository.updateGeoFence(id, geofenceId, updateData);

            logger.info(`Geofence ID: ${geofenceId} actualizada en GPS ID: ${id}`);
            res.status(200).json({
                message: "Geofence actualizada correctamente",
                GPSDevice: updatedGPS
            });
        } catch (error) {
            logger.error(`Error al actualizar geofence: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async deleteGeoFence(req, res) {
        const { id, geofenceId } = req.params;
        try {
            const updatedGPS = await GPSDeviceRepository.deleteGeoFence(id, geofenceId);

            logger.info(`Geofence ID: ${geofenceId} eliminada del GPS ID: ${id}`);
            res.status(200).json({
                message: "Geofence eliminada correctamente",
                GPSDevice: updatedGPS
            });
        } catch (error) {
            logger.error(`Error al eliminar geofence: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new GPSDeviceController();
