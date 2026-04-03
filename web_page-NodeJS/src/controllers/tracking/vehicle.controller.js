const VehicleRepository = require("../../repositories/tracking/vehicle.repository");
const UserModel = require("../../models/auth/user.model");
const GPSDeviceModel = require("../../models/tracking/gps_devise.model");
const { logger } = require("../../middlewares/logger.middleware");
const MailerController = require("../../services/mailer/nodemailer.service");

class VehicleController {
    async createVehicle(req, res) {
        try {
            const vehicleData = req.body;
            if (req.file && req.file.path) {
                vehicleData.photo = req.file.path;
            }
            const newVehicle = await VehicleRepository.createVehicle(vehicleData);

            await UserModel.findByIdAndUpdate(
                vehicleData.ownerUser,
                { $push: { vehicle: newVehicle._id } },
                { new: true }
            );

            const user = await UserModel.findById(vehicleData.ownerUser);
            await MailerController.sendVehicleCreatedEmail(user, newVehicle);

            logger.info(`Vehículo registrado con éxito: ${newVehicle.licensePlate} (ID: ${newVehicle._id})`);
            res.status(201).json({ message: "Vehículo registrado con éxito", vehicle: newVehicle });
        } catch (error) {
            logger.error(`Error al registrar vehículo: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getVehicles(req, res) {
        try {
            const { page, type, brand, model, color } = req.query;
            const vehicles = await VehicleRepository.getVehicles({ page, type, brand, model, color });

            if (!vehicles.docs.length) {
                logger.warn("No se encontraron vehículos con los filtros aplicados");
            } else {
                logger.info(`Vehículos obtenidos: ${vehicles.docs.length} encontrados`);
            }

            res.status(200).json(vehicles);
        } catch (error) {
            logger.error(`Error al obtener vehículos: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

    async getVehicle(req, res) {
        const { id } = req.params;
        try {
            const vehicle = await VehicleRepository.getVehicleById(id);

            logger.info(`Vehículo obtenido: ${vehicle.licensePlate} (ID: ${id})`);
            res.status(200).json({ message: "Vehículo encontrado", vehicle });
        } catch (error) {
            logger.error(`Error al obtener vehículo con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async updateVehicle(req, res) {
        const { id } = req.params;
        try {
            const updateData = { ...req.body };

            if (req.file && req.file.path) {
                updateData.photo = req.file.path;
            }

            const updatedVehicle = await VehicleRepository.updateVehicle(id, updateData);

            logger.info(`Vehículo actualizado: ${updatedVehicle.licensePlate} (ID: ${id})`);
            res.status(200).json({ message: "Vehículo actualizado correctamente", vehicle: updatedVehicle });
        } catch (error) {
            logger.error(`Error al actualizar vehículo con ID ${id}: ${error.message}`);
            res.status(404).json({ message: error.message });
        }
    }

    async deleteVehicle(req, res) {
        const { id } = req.params;
        try {
            const deletedVehicle = await VehicleRepository.deleteVehicle(id);

            if (!deletedVehicle) {
                return res.status(404).json({ message: "Vehículo no encontrado" });
            }

            if (deletedVehicle.ownerUser) {
                await UserModel.findByIdAndUpdate(
                    deletedVehicle.ownerUser,
                    { $pull: { vehicle: deletedVehicle._id } },
                    { new: true }
                );
            }

            if (deletedVehicle.gps) {
                await GPSDeviceModel.findByIdAndUpdate(
                    deletedVehicle.gps,
                    { $set: { vehicle: null } },
                    { new: true }
                );
            }

            logger.info(`Vehículo eliminado: ${deletedVehicle.licensePlate} (ID: ${id})`);
            res.status(200).json({ message: "Vehículo eliminado y GPS desvinculado", vehicle: deletedVehicle });
        } catch (error) {
            logger.error(`Error al eliminar vehículo con ID ${id}: ${error.message}`);
            res.status(500).json({ message: error.message });
        }
    }

}

module.exports = new VehicleController();
